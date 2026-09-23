// Structural parity gate: js/fi/* must mirror js/en/* exactly in shape, keys, ids and references.
// String values may differ (that is the translation); everything else may not.
// Errors exit 1. Run after every translation pass: node tools/check-parity.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const errs = [], warns = [];

function loadLocale(loc) {
  const read = f => readFileSync(path.join(root, "js", loc, f), "utf8");
  const data = new Function(read("data.js") + "\n;return {VDIR,VID,VREMOTE,VIDMETA,SOURCES,EX,WUS,MENUS,GAMES,PHASES};")();
  const ui = new Function(read("ui.js") + "\n;return {UI};")();
  const sess = new Function("EX", "WUS", "MENUS", "GAMES", "PHASES",
    read("sessions.js") + "\n;return {SESSIONS};")(data.EX, data.WUS, data.MENUS, data.GAMES, data.PHASES);
  return { ...data, ...ui, ...sess };
}

const en = loadLocale("en"), fi = loadLocale("fi");

// ---------- 1. full structural parity (keys, lengths, types; strings opaque) ----------
function diffShape(a, b, p) {
  const ae = Array.isArray(a), be = Array.isArray(b);
  if (ae !== be) { errs.push(`${p}: array vs non-array`); return; }
  if (ae) {
    if (a.length !== b.length) errs.push(`${p}: length ${a.length} (en) vs ${b.length} (fi)`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) diffShape(a[i], b[i], `${p}[${i}]`);
    return;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") { errs.push(`${p}: object vs ${typeof b}`); return; }
    for (const k of Object.keys(a)) if (!(k in b) && a[k] !== undefined) errs.push(`${p}.${k}: missing in fi`);
    for (const k of Object.keys(b)) if (!(k in a)) errs.push(`${p}.${k}: extra in fi`);
    for (const k of Object.keys(a)) if (k in b) diffShape(a[k], b[k], `${p}.${k}`);
    return;
  }
  if (typeof a === "function" || typeof b === "function") { errs.push(`${p}: unexpected function`); return; }
  if (typeof a !== typeof b) errs.push(`${p}: type ${typeof a} (en) vs ${typeof b} (fi)`);
}
for (const name of ["VDIR", "VID", "VREMOTE", "VIDMETA", "SOURCES", "EX", "WUS", "MENUS", "GAMES", "PHASES", "UI", "SESSIONS"])
  diffShape(en[name], fi[name], name);

// ---------- 2. strict equality where the value IS an id/reference ----------
const strict = (a, b, p) => { if (JSON.stringify(a) !== JSON.stringify(b)) errs.push(`${p}: must be identical (${JSON.stringify(a)} vs ${JSON.stringify(b)})`); };
const eqKeys = (a, b, p) => strict(Object.keys(a), Object.keys(b), `${p} (key list+order)`);

eqKeys(en.EX, fi.EX, "EX");
for (const id of Object.keys(en.EX)) if (id in fi.EX) { strict(en.EX[id].p, fi.EX[id].p, `EX.${id}.p`); strict(en.EX[id].v, fi.EX[id].v, `EX.${id}.v`); }
eqKeys(en.WUS, fi.WUS, "WUS");
for (const id of Object.keys(en.WUS)) if (id in fi.WUS) strict(en.WUS[id].ex, fi.WUS[id].ex, `WUS.${id}.ex`);
eqKeys(en.MENUS, fi.MENUS, "MENUS");
for (const id of Object.keys(en.MENUS)) if (id in fi.MENUS) {
  strict(en.MENUS[id].kind, fi.MENUS[id].kind, `MENUS.${id}.kind`);
  strict(en.MENUS[id].ex.map(x => x.id), fi.MENUS[id].ex.map(x => x.id), `MENUS.${id}.ex ids`);
}
eqKeys(en.GAMES, fi.GAMES, "GAMES");
strict(en.PHASES.map(p => [p.id, p.cls, p.wks]), fi.PHASES.map(p => [p.id, p.cls, p.wks]), "PHASES id/cls/wks");
strict(en.SOURCES.map(s => s[1]), fi.SOURCES.map(s => s[1]), "SOURCES urls");
strict(en.VDIR, fi.VDIR, "VDIR");

strict(Object.keys(en.SESSIONS), Object.keys(fi.SESSIONS), "SESSIONS weeks");
for (const w of Object.keys(en.SESSIONS)) {
  if (!(w in fi.SESSIONS)) continue;
  for (const d of ["mon", "sat"]) {
    const a = en.SESSIONS[w][d], b = fi.SESSIONS[w][d];
    if (!b) { errs.push(`SESSIONS.${w}.${d}: missing in fi`); continue; }
    if (!a) { errs.push(`SESSIONS.${w}.${d}: extra in fi`); continue; }
    const P = `SESSIONS.${w}.${d}`;
    strict(a.phase, b.phase, `${P}.phase`);
    strict(a.menu, b.menu, `${P}.menu`);
    strict(a.menu2, b.menu2, `${P}.menu2`);
    strict(a.wu, b.wu, `${P}.wu`);
    strict(a.games, b.games, `${P}.games`);
    strict(!!a.test, !!b.test, `${P}.test present`);
    if (a.timeline.length !== b.timeline.length) errs.push(`${P}.timeline: ${a.timeline.length} vs ${b.timeline.length} blocks`);
    for (let i = 0; i < Math.min(a.timeline.length, b.timeline.length); i++) {
      strict(a.timeline[i].t, b.timeline[i].t, `${P}.timeline[${i}].t`);
      if (a.timeline[i].b.length !== b.timeline[i].b.length) errs.push(`${P}.timeline[${i}].b: line count differs`);
    }
  }
}
// UI.lang legitimately differs
if (fi.UI.lang !== "fi") errs.push(`UI.lang: fi/ui.js must declare lang "fi" (got ${JSON.stringify(fi.UI.lang)})`);

// references resolve (fi side)
for (const mid of Object.keys(fi.MENUS)) for (const x of fi.MENUS[mid].ex) if (!(x.id in en.EX)) errs.push(`MENUS.${mid} → ${x.id}: unknown exercise`);
for (const w of Object.keys(fi.SESSIONS)) for (const d of ["mon", "sat"]) {
  const s = fi.SESSIONS[w][d];
  if (!s) continue;
  for (const ref of [s.menu, s.menu2]) if (ref && !(ref in en.MENUS)) errs.push(`SESSIONS.${w}.${d} menu ${ref}: unknown menu`);
  if (s.wu && !(s.wu in en.WUS)) errs.push(`SESSIONS.${w}.${d} wu ${s.wu}: unknown warm-up set`);
  for (const g of s.games || []) if (!(g in en.GAMES)) errs.push(`SESSIONS.${w}.${d} game ${g}: unknown game`);
}

// ---------- 3. token preservation inside string values (the anti-hallucination net for commit B) ----------
const ID_RE = /\b(?:m|c|l|p|x)\d{2}\b/g, VID_RE = /\bV[1-5]\b/g, URL_RE = /https?:\/\/[^\s"'<>()]+/g, TAG_RE = /<\/?[a-z]+[^>]*>/gi, NUM_RE = /\d+(?:[.,]\d+)*/g;
const grab = (s, re) => (s.match(re) || []).sort();
function walkStrings(a, b, p) {
  if (typeof a === "string" && typeof b === "string") {
    if (a === b) return;
    const eIds = grab(a, ID_RE), fIds = grab(b, ID_RE);
    if (JSON.stringify(eIds) !== JSON.stringify(fIds)) errs.push(`${p}: exercise-id tokens changed: [${eIds}] → [${fIds}]`);
    const eV = grab(a, VID_RE), fV = grab(b, VID_RE);
    if (JSON.stringify(eV) !== JSON.stringify(fV)) errs.push(`${p}: video-id tokens changed: [${eV}] → [${fV}]`);
    const eU = grab(a, URL_RE), fU = grab(b, URL_RE);
    if (JSON.stringify(eU) !== JSON.stringify(fU)) errs.push(`${p}: URLs changed`);
    const eT = grab(a, TAG_RE).map(t => t.replace(/\s+/g, " ")), fT = grab(b, TAG_RE).map(t => t.replace(/\s+/g, " "));
    if (JSON.stringify(eT) !== JSON.stringify(fT)) errs.push(`${p}: HTML tags changed: [${eT}] → [${fT}]`);
    const eN = grab(a, NUM_RE), fN = grab(b, NUM_RE);
    if (JSON.stringify(eN) !== JSON.stringify(fN)) warns.push(`${p}: numbers differ: [${eN}] → [${fN}]`);
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) { for (let i = 0; i < Math.min(a.length, b.length); i++) walkStrings(a[i], b[i], `${p}[${i}]`); return; }
  if (a && typeof a === "object" && b && typeof b === "object") { for (const k of Object.keys(a)) if (k in b) walkStrings(a[k], b[k], `${p}.${k}`); }
}
for (const name of ["VIDMETA", "SOURCES", "EX", "MENUS", "GAMES", "PHASES", "UI", "SESSIONS"])
  walkStrings(en[name], fi[name], name);

// ---------- 4. page shells ----------
for (const page of ["index", "plan", "exercises", "session"]) for (const loc of ["", ".fi"]) {
  const f = path.join(root, `${page}${loc}.html`);
  const html = readFileSync(f, "utf8");
  const l = loc ? "fi" : "en";
  if (!html.includes(`id="langsw"`)) errs.push(`${page}${loc}.html: missing #langsw switcher placeholder`);
  for (const js of ["data", "ui", "sessions"]) if (!html.includes(`js/${l}/${js}.js`)) errs.push(`${page}${loc}.html: must load js/${l}/${js}.js`);
  if (!html.includes(`src="js/app.js"`)) errs.push(`${page}${loc}.html: missing js/app.js`);
  const wantLang = loc ? 'lang="fi"' : 'lang="en"';
  if (!html.includes(wantLang)) errs.push(`${page}${loc}.html: html tag must have ${wantLang}`);
}

// ---------- report ----------
for (const w of warns) console.warn(`WARN  ${w}`);
for (const e of errs) console.error(`ERROR ${e}`);
if (errs.length) { console.error(`\nFAIL: ${errs.length} error(s), ${warns.length} warning(s)`); process.exit(1); }
console.log(`OK: en/fi parity holds (${warns.length} warning(s))`);
