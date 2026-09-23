// ===== locale: chosen by filename (index.fi.html = fi), UI/EX/MENUS/… come from js/<lang>/*.js loaded before this file =====
const LANG = /\.fi\./i.test(location.pathname) ? "fi" : "en";
const L = p => `${p}${LANG === "fi" ? ".fi" : ""}.html`;
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

function localizeLinks() {
  document.querySelectorAll("a[href]").forEach(a => {
    const m = a.getAttribute("href").match(/^(?:\.\/)?(index|plan|exercises|session)\.html(\?|#|$)/);
    if (m) a.setAttribute("href", L(m[1]) + a.getAttribute("href").slice(m[0].length));
  });
}

function setupLangSwitch() {
  const el = document.getElementById("langsw");
  if (!el) return;
  let page = location.pathname.split("/").pop().replace(/(\.fi)?\.html$/, "");
  if (!page) page = "index";
  el.innerHTML = ["en", "fi"].map(l =>
    `<a href="${page}${l === "fi" ? ".fi" : ""}.html${location.search}" class="${l === LANG ? "on" : ""}">${l === "fi" ? "FI (beta)" : "EN"}</a>`).join("");
}

// ===== shared helpers =====
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function vidLink(v) {
  if (!v) return `<span class="tag">${UI.noVideo}</span>`;
  const [id, pos] = v;
  if (VREMOTE[id]) return `<a class="vlink" href="${VREMOTE[id]}" target="_blank">${fmt(UI.fifaVideo, { id, pos })}</a>`;
  return `<a class="vlink" href="${VDIR + VID[id]}" target="_blank">${fmt(UI.video, { id, pos })}</a>`;
}

function exCard(id, dose, extra, links) {
  if (links === undefined) links = true;
  const e = EX[id];
  if (!e) return `<div class="exrow"><b>?? ${esc(id)}</b></div>`;
  return `<div class="exrow">
    <div class="exhead">
      <span><span class="tag ${e.p}">${UI.tags[e.p] || e.p}</span><b>${esc(e.n)}</b></span>
      ${dose ? `<span class="dose">${esc(dose)}</span>` : ""}
    </div>
    <div class="focus">${esc(e.focus)}</div>
    <ul>${e.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
    ${e.prog && e.prog !== "—" ? `<div class="prog">${UI.progress}${esc(e.prog)}</div>` : ""}
    ${links ? `<div style="margin-top:6px">${vidLink(e.v)} ${extra || ""}</div>` : ""}
  </div>`;
}

function menuBlock(mid, links) {
  const m = MENUS[mid];
  if (!m) return "";
  let h = `<h3>${esc(m.name)} <span class="pill">${m.rounds}</span></h3><p class="small muted">${UI.rest} ${esc(m.rest)}</p>`;
  if (m.note) h += `<p class="small" style="margin-bottom:10px">${m.note}</p>`;
  if (m.ex.length === 0) return h;
  return h + m.ex.map(x => exCard(x.id, x.dose, "", links)).join("");
}

function wuBlock(wuId) {
  const w = WUS[wuId];
  return `<h3>${esc(w.name)}</h3><p class="small muted">${UI.wuNote}</p>` +
    w.ex.map((id, i) => `<span class="tag mobility">${i + 1}. ${esc(EX[id].n)}</span>`).join(" ");
}

function gameCard(gid) {
  const g = GAMES[gid];
  if (!g) return "";
  return `<div class="exrow"><div class="exhead"><span><span class="tag play">${UI.tags.play}</span><b>${esc(g.n)}</b></span><span class="dose">${fmt(UI.ballsN, { n: esc(g.balls) })}</span></div>
    <ul><li>${esc(g.how)}</li></ul><div class="prog">${esc(g.space)}</div></div>`;
}

function timeline(arr) {
  let html = '<div class="tl">';
  for (const b of arr) {
    let body = "";
    for (const line of b.b) {
      if (Array.isArray(line)) { body += "<ul>" + line.map(x => `<li>${x}</li>`).join("") + "</ul>"; }
      else if (line.startsWith("- ")) { body += `<li style="margin-left:18px">${line.slice(2)}</li>`; }
      else if (line.startsWith("<")) { body += line; }
      else body += `<p>${line}</p>`;
    }
    html += `<div class="block"><div class="t">${b.t}</div><div><h4>${b.h}</h4>${body}</div></div>`;
  }
  return html + "</div>";
}

// ===== plan page =====
function renderPlan() {
  const el = document.getElementById("plan-table");
  if (!el) return;
  let rows = "";
  for (let w = 1; w <= 24; w++) {
    const s = SESSIONS[w];
    if (!s) continue;
    rows += `<tr>
      <td><b>${w}</b></td>
      <td><span class="tag">${s.mon.phase}</span>${esc(s.mon.phaseName)}</td>
      <td><a href="${L("session")}?w=${w}&d=mon">${UI.mon}</a> — ${esc(s.mon.focus)}</td>
      <td><a href="${L("session")}?w=${w}&d=sat">${UI.sat}</a> — ${esc(s.sat.focus)}</td>
    </tr>`;
  }
  el.innerHTML = `<table><tr><th>${UI.wk}</th><th>${UI.phase}</th><th>${UI.monHead}</th><th>${UI.satHead}</th></tr>${rows}</table>`;
}

// ===== session page =====
function renderSession() {
  const el = document.getElementById("session");
  if (!el) return;
  const q = new URLSearchParams(location.search);
  const w = parseInt(q.get("w") || "1", 10);
  const d = q.get("d") === "sat" ? "sat" : "mon";
  const s = SESSIONS[w] && SESSIONS[w][d];
  if (!s) { el.innerHTML = `<p>${UI.notFound}</p>`; return; }

  const dayName = d === "mon" ? UI.dayMon : UI.daySat;
  let html = `<div class="sess-head">
    <span class="tag">${s.phase}</span><span class="tag">${esc(s.phaseName)}</span>${s.test ? `<span class="pill">${UI.testPill}</span>` : ""}
    <h1 style="font-size:1.5rem;margin-top:8px">${fmt(UI.weekTitle, { w, day: dayName })}</h1>
    <div class="meta"><b>${UI.focus}</b> ${esc(s.focus)}</div>
  </div>`;

  html += `<div class="sess-nav noprint">
    <a href="${L("plan")}">${UI.allSessions}</a>
    <span>${d === "mon"
      ? `<a href="${L("session")}?w=${w}&d=sat">${UI.satSession}</a>`
      : (w < 24 ? `<a href="${L("session")}?w=${w + 1}&d=mon">${UI.nextMon}</a>` : `<a href="${L("plan")}">${UI.backToPlan}</a>`)}</span>
    <button class="printbtn" onclick="window.print()">${UI.print}</button>
  </div>`;

  if (s.intro) html += `<div class="note"><b>${UI.coachBrief}</b> ${s.intro}</div>`;

  html += `<h2 class="sec">${UI.setup}</h2><div class="card"><ul style="margin-left:18px">${s.equip.map(e => `<li>${e}</li>`).join("")}</ul></div>`;

  html += `<h2 class="sec">${UI.sessTimeline}</h2>` + timeline(s.timeline);

  if (s.menu || s.menu2) {
    html += `<h2 class="sec">${UI.physCards}</h2>`;
    html += s.menu ? menuBlock(s.menu, false) : "";
    if (s.menu2) html += `<h3 style="margin-top:22px">${esc(s.menu2Title || UI.secondBlock)}</h3>` + menuBlock(s.menu2, false);
    html += `<p class="small muted">${fmt(UI.vidsNote, { idx: L("index"), ex: L("exercises") })}</p>`;
  }
  if (s.wu) { html += `<h2 class="sec">${UI.warmupToday}</h2><div class="card">${wuBlock(s.wu)}</div>`; }

  if (s.games && s.games.length) {
    html += `<h2 class="sec">${UI.ballPlayToday}</h2>` + s.games.map(gameCard).join("");
  }

  html += `<h2 class="sec">${UI.runGroups}</h2>` + UI.groupbox;
  if (s.groupNote) html += `<div class="note">${s.groupNote}</div>`;

  if (s.test) html += `<h2 class="sec">${UI.testProtocol}</h2><div class="card">${s.test}</div>`;

  if (s.coachPoints && s.coachPoints.length) {
    html += `<h2 class="sec">${UI.coach3}</h2><div class="card"><ol style="margin-left:18px">${s.coachPoints.map(c => `<li>${c}</li>`).join("")}</ol></div>`;
  }

  html += UI.safety + UI.gate;
  html += `<div class="sess-nav noprint" style="margin-top:26px"><a href="${L("plan")}">${UI.allSessions}</a><a href="${L("index")}">${UI.overview}</a>${d === "mon" ? `<a href="${L("session")}?w=${w}&d=sat">${UI.satArrow}</a>` : (w < 24 ? `<a href="${L("session")}?w=${w + 1}&d=mon">${UI.nextWeek}</a>` : "")}</div>`;

  document.title = `${UI.titleShort} W${w} ${d === "mon" ? UI.mon : UI.sat}`;
  el.innerHTML = html;
}

// ===== exercises page =====
function renderExercises() {
  const el = document.getElementById("exlib");
  if (!el) return;
  let html = "";
  function block(title, ids) { html += `<h3>${title}</h3>` + ids.map(id => exCard(id)).join(""); }
  block(UI.exBlocks.mobility, Object.keys(EX).filter(k => EX[k].p === "mobility"));
  block(UI.exBlocks.core, ["c01", "c02", "c03", "c04", "c05", "c06", "c07", "c08", "c09"]);
  block(UI.exBlocks.coreProg, ["c10", "c11", "c12", "c13", "c14", "c15", "c16"]);
  block(UI.exBlocks.lbs, Object.keys(EX).filter(k => EX[k].p === "lbs"));
  block(UI.exBlocks.power, Object.keys(EX).filter(k => EX[k].p === "power"));
  block(UI.exBlocks.combo, Object.keys(EX).filter(k => EX[k].p === "combo"));
  el.innerHTML = html;
}

// ===== index page =====
function renderIndex() {
  const ph = document.getElementById("phases");
  if (ph) ph.innerHTML = PHASES.map(p => `<div class="card phase ${p.cls}">
    <h3><span>${p.id} · ${esc(p.name)}</span><span class="wk">${UI.weeksLabel} ${p.wks}</span></h3>
    <p class="small muted">${esc(p.goal)}</p><ul>${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");

  const vd = document.getElementById("vids");
  if (vd) vd.innerHTML = VIDMETA.map(m => {
    if (VREMOTE[m.v]) return `<div class="vidcard">
      <div class="vinfo"><b>${esc(m.title)}</b><p class="small muted">${esc(m.note)}</p>
      <p style="margin-top:10px"><a href="${VREMOTE[m.v]}" target="_blank">${UI.watchFifa}</a></p></div></div>`;
    return `<div class="vidcard">
      <video controls preload="none" src="${VDIR + VID[m.v]}"></video>
      <div class="vinfo"><b>${esc(m.title)}</b><p class="small muted">${esc(m.note)}</p>
      <p class="small" style="margin-top:6px"><a href="${VDIR + VID[m.v]}" target="_blank">${UI.openFull}</a></p></div></div>`;
  }).join("");

  const so = document.getElementById("sources");
  if (so) so.innerHTML = "<ul style='margin-left:18px'>" + SOURCES.map(s => `<li><a href="${s[1]}" target="_blank">${esc(s[0])}</a></li>`).join("") + "</ul>";
}

document.addEventListener("DOMContentLoaded", () => { localizeLinks(); setupLangSwitch(); renderPlan(); renderSession(); renderExercises(); renderIndex(); });
