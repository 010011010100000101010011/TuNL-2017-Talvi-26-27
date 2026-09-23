// EN -> FI translation pipeline for js/fi/* and *.fi.html.
// Reads js/en/* objects, translates prose fields via translategemma (per-string, never whole files),
// with ⟦Pn⟧-protected HTML tags / URLs / {ph} / entities / exercise-menu-game-phase names (for cross-page consistency),
// a persistent cache (resumable, incremental), keeps EN on repeated validation failure,
// then REGENERATES js/fi/{data,ui,sessions}.js and *.fi.html wholesale from EN sources. EN files are never modified.
// Machine fields (ids, pillars, video refs, menu/wu/game references, times) are never translated.
// Usage: node tools/translate-fi.mjs   (then: node tools/check-parity.mjs)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "http://100.88.241.117:11434/v1/chat/completions";
const MODEL = "translategemma:27b";
const CONCURRENCY = 4;
const CACHE_F = path.join(root, "tools/translation-cache.fi.json");

// ---------- load EN locale (objects) ----------
function loadEn() {
  const read = f => readFileSync(path.join(root, "js/en", f), "utf8");
  const data = new Function(read("data.js") + "\n;return {VDIR,VID,VREMOTE,VIDMETA,SOURCES,EX,WUS,MENUS,GAMES,PHASES};")();
  const ui = new Function(read("ui.js") + "\n;return {UI};")();
  const sess = new Function("EX", "WUS", "MENUS", "GAMES", "PHASES",
    read("sessions.js") + "\n;return {SESSIONS};")(data.EX, data.WUS, data.MENUS, data.GAMES, data.PHASES);
  return { ...data, ...ui, ...sess };
}
const EN = loadEn();

// ---------- prose-field whitelist: path -> true when the string must be translated ----------
// paths look like "EX.m01.cues[2]", "SESSIONS.3.sat.timeline[4].b[1]", "UI.groupbox"
function isProse(p) {
  if (/^EX\.\w+\.(n|focus|prog)$/.test(p)) return true;
  if (/^EX\.\w+\.cues\[\d+\]$/.test(p)) return true;
  if (/^MENUS\.\w+\.(name|note|rest|rounds)$/.test(p)) return true;
  if (/^MENUS\.\w+\.ex\[\d+\]\.dose$/.test(p)) return true;
  if (/^GAMES\.\w+\.(n|how|space)$/.test(p)) return true;
  if (/^WUS\.\w+\.name$/.test(p)) return true;
  if (/^PHASES\[\d+\]\.(name|goal|points\[\d+\])$/.test(p)) return true;
  if (/^VIDMETA\[\d+\]\.(title|note)$/.test(p)) return true;
  if (/^SOURCES\[\d+\]\[0\]$/.test(p)) return true;
  if (/^UI\.lang$/.test(p)) return false;
  if (/^UI\./.test(p)) return true;
  if (/^SESSIONS\.\d+\.(mon|sat)\.(focus|intro|groupNote|test|menu2Title|phaseName)$/.test(p)) return true;
  if (/^SESSIONS\.\d+\.(mon|sat)\.(equip|coachPoints)\[\d+\]$/.test(p)) return true;
  if (/^SESSIONS\.\d+\.(mon|sat)\.timeline\[\d+\]\.h$/.test(p)) return true;
  if (/^SESSIONS\.\d+\.(mon|sat)\.timeline\[\d+\]\.b(\[\d+\])+$/.test(p)) return true;
  return false;
}
function collectProse(v, p, out) {
  if (typeof v === "string") { if (isProse(p) && !out.includes(v)) out.push(v); return; }
  if (Array.isArray(v)) { v.forEach((x, i) => collectProse(x, `${p}[${i}]`, out)); return; }
  if (v && typeof v === "object") for (const k of Object.keys(v)) collectProse(v[k], p ? `${p}.${k}` : k, out);
}
function mapProse(v, p, fn) {
  if (typeof v === "string") return isProse(p) ? fn(v) : v;
  if (Array.isArray(v)) return v.map((x, i) => mapProse(x, `${p}[${i}]`, fn));
  if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v)) o[k] = mapProse(v[k], p ? `${p}.${k}` : k, fn); return o; }
  return v;
}

// ---------- name registry (translated first, shortest first, for cross-string consistency) ----------
const names = [];
const addName = s => { if (s && s.length >= 4 && /[A-Za-z]/.test(s) && !names.includes(s)) names.push(s); };
for (const k of Object.keys(EN.EX)) addName(EN.EX[k].n);
for (const k of Object.keys(EN.MENUS)) addName(EN.MENUS[k].name);
for (const k of Object.keys(EN.GAMES)) addName(EN.GAMES[k].n);
for (const p of EN.PHASES) addName(p.name);
for (const k of Object.keys(EN.WUS)) addName(EN.WUS[k].name);
names.sort((a, b) => a.length - b.length);

// ---------- cache ----------
let cache = { sig: "", names: {}, strings: {} };
if (existsSync(CACHE_F)) cache = JSON.parse(readFileSync(CACHE_F, "utf8"));
let lastFlush = 0;
function flush(force) {
  const now = Date.now();
  if (force || now - lastFlush > 10000) { lastFlush = now; writeFileSync(CACHE_F, JSON.stringify(cache, null, 1)); }
}

// ---------- model ----------
async function callModel(text, attempt) {
  const strong = attempt > 0
    ? " CRITICAL: every marker like ⟦P0⟧ must appear in your output exactly once, byte-identical. Never translate or drop them." : "";
  const body = {
    model: MODEL, temperature: 0,
    messages: [{ role: "user", content:
      `Translate the following text from English to Finnish. Output only the translation. Copy all HTML tags, URLs, and all ⟦...⟧ markers exactly unchanged.${strong}\n\n${text}` }]
  };
  const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return (j.choices?.[0]?.message?.content ?? "").trim();
}

// ---------- protection ----------
const URL_RE = /https?:\/\/[^\s"'<>()]+/g, TAG_RE = /<\/?[a-zA-Z][^>]*>/g, ENT_RE = /&(?:[a-zA-Z]+|#\d+);/g, PH_RE = /\{\w+\}/g, U_RE = /\bU10\b/g;
function protect(s, nameList, table) {
  const put = orig => { const k = `⟦P${table.length}⟧`; table.push(orig); return k; };
  let out = s;
  for (const re of [URL_RE, TAG_RE, ENT_RE, PH_RE]) out = out.replace(re, m => put(m));
  for (const n of nameList) if (out.includes(n)) out = out.split(n).join(put(n));
  out = out.replace(U_RE, m => put(m));
  return out;
}
function restore(s, table) {
  let out = s;
  for (let i = 0; i < table.length; i++) {
    const k = `⟦P${i}⟧`;
    if (out.split(k).length - 1 !== 1) return null;
    out = out.split(k).join(table[i]);
  }
  return out.includes("⟦P") ? null : out;
}
const plainLen = s => s.replace(/⟦P\d+⟧/g, " ").replace(/<[^>]*>/g, " ").replace(/&\w+;|&#\d+;/g, " ").replace(/\s+/g, " ").trim().length;

// ---------- translate one raw EN string ----------
const report = { translated: 0, cached: 0, skipped: 0, keptEn: [], noChange: [] };
async function translateOne(raw, nameMap) {
  if (cache.strings[raw] !== undefined) { report.cached++; return cache.strings[raw]; }
  const table = [];
  const prot = protect(raw, nameMap ? [...nameMap.keys()].sort((a, b) => b.length - a.length) : [], table);
  if (nameMap) for (let i = 0; i < table.length; i++) if (nameMap.has(table[i])) table[i] = nameMap.get(table[i]);
  if (plainLen(prot) === 0) { report.skipped++; return raw; }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const got = await callModel(prot, attempt);
      const back = restore(got, table);
      if (!back || back.length > raw.length * 2.5 + 40) continue;
      if (back === raw) report.noChange.push(raw);
      report.translated++; cache.strings[raw] = back; flush(); return back;
    } catch { await new Promise(r => setTimeout(r, 1500)); }
  }
  report.keptEn.push(raw);
  return raw;
}

// ---------- worker pool ----------
async function runPool(jobs) {
  let i = 0; const results = new Array(jobs.length);
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (i < jobs.length) {
      const idx = i++;
      results[idx] = await jobs[idx]();
      if ((report.translated + report.cached) % 50 === 0) process.stdout.write(`[${report.translated + report.cached}] `);
    }
  });
  await Promise.all(workers);
  return results;
}

// ---------- pass 1: names ----------
console.log(`names: ${names.length}`);
await runPool(names.map(n => async () => {
  if (cache.names[n] !== undefined) return cache.names[n];
  const fi = await translateOne(n, null);
  cache.names[n] = fi; flush();
  return fi;
}));
const nameMap = new Map(names.map(n => [n, cache.names[n] || n]));
for (const n of names) if (cache.strings[n] === undefined) cache.strings[n] = cache.names[n];

const nSig = createHash("sha256").update(JSON.stringify(names.map(n => cache.names[n]))).digest("hex").slice(0, 16);
if (cache.sig && cache.sig !== nSig) { console.log("name translations changed -> dropping prose cache"); cache.strings = {}; for (const n of names) cache.strings[n] = cache.names[n]; }
cache.sig = nSig;

// ---------- pass 2: content prose ----------
const dataStrings = [];
for (const name of ["VIDMETA", "SOURCES", "EX", "MENUS", "GAMES", "PHASES", "UI", "SESSIONS"]) collectProse(EN[name], name, dataStrings);
console.log(`prose strings: ${dataStrings.length}`);
await runPool(dataStrings.map(s => () => translateOne(s, nameMap)));

// ---------- pass 3: HTML shells — text runs merged across inline tags ----------
const INLINE = /^(a|b|i|em|strong|span|code|br|sup|sub|small|u|mark)$/i;
function splitShell(src) {
  const parts = src.split(/(<[^>]*>)/);
  const out = [], groups = [];
  let cur = null, inside = null;
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith("<")) {
      const tag = (p.match(/^<\/?\s*([a-zA-Z][\w-]*)/) || [])[1] || "";
      if (/^(script|style|video)$/i.test(tag)) {
        inside = p.startsWith("</") ? null : (inside || tag);
        out.push(p); cur = null; continue;
      }
      if (!inside && INLINE.test(tag) && cur) { cur.s += p; continue; }
      out.push(p); cur = null; continue;
    }
    if (!inside && /[A-Za-z]/.test(p.replace(/&\w+;|&#\d+;/g, ""))) {
      if (!cur) { cur = { s: "" }; groups.push(cur); out.push(`\x00${groups.length - 1}\x00`); }
      cur.s += p; continue;
    }
    out.push(p); cur = null;
  }
  return { skeleton: out.join(""), groups: groups.map(g => g.s) };
}
const shells = ["index", "plan", "exercises", "session"].map(n => ({ en: `${n}.html`, fi: `${n}.fi.html` }));
const shellSk = new Map();
{
  const all = [];
  for (const sh of shells) {
    const { skeleton, groups } = splitShell(readFileSync(path.join(root, sh.en), "utf8"));
    shellSk.set(sh.fi, { skeleton, groups });
    all.push(...groups);
  }
  console.log(`html text groups: ${all.length}`);
  await runPool(all.map(g => () => translateOne(g, nameMap)));
}

// ---------- serialize ----------
const js = x => JSON.stringify(x, null, 1);
const T = s => (cache.strings[s] !== undefined ? cache.strings[s] : s);

writeFileSync(path.join(root, "js/fi/data.js"),
  `// ===== FI locale (generated by tools/translate-fi.mjs from js/en/data.js — do not edit by hand) =====\n` +
  ["VDIR", "VID", "VREMOTE"].map(n => `const ${n} = ${js(EN[n])};`).join("\n") + "\n" +
  ["VIDMETA", "SOURCES", "EX", "WUS", "MENUS", "GAMES", "PHASES"].map(n => `const ${n} = ${js(mapProse(EN[n], n, T))};`).join("\n") + "\n");

writeFileSync(path.join(root, "js/fi/ui.js"),
  `// ===== FI locale chrome (generated by tools/translate-fi.mjs from js/en/ui.js — do not edit by hand) =====\n` +
  `const UI = ${js({ ...mapProse(EN.UI, "UI", T), lang: "fi" })};\n`);

writeFileSync(path.join(root, "js/fi/sessions.js"),
  `// ===== FI sessions (generated by tools/translate-fi.mjs from js/en/sessions.js — do not edit by hand) =====\n` +
  `const SESSIONS = ${js(mapProse(EN.SESSIONS, "SESSIONS", T))};\n`);

for (const sh of shells) {
  const { skeleton, groups } = shellSk.get(sh.fi);
  let out = skeleton;
  groups.forEach((g, i) => { out = out.split(`\x00${i}\x00`).join(cache.strings[g] !== undefined ? cache.strings[g] : g); });
  if (out.includes("⟦P") || out.includes("\x00")) { console.error(`ERROR ${sh.fi}: unrestored placeholder left in output`); process.exitCode = 1; }
  out = out.replace('<html lang="en">', '<html lang="fi">').replaceAll("js/en/", "js/fi/");
  writeFileSync(path.join(root, sh.fi), out);
}

flush(true);
writeFileSync(path.join(root, "tools/translate-report.fi.json"), JSON.stringify(report, null, 1));
console.log(`\ndone: translated=${report.translated} cached=${report.cached} skipped=${report.skipped} kept-EN=${report.keptEn.length} no-change=${report.noChange.length}`);
if (report.keptEn.length) { console.error("KEPT EN (fix manually or re-run):"); report.keptEn.forEach(s => console.error(`  ${s.slice(0, 90)}`)); process.exitCode = 2; }
