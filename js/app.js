// ===== shared helpers =====
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function vidLink(v) {
  if (!v) return '<span class="tag">no video — demo live</span>';
  const [id, pos] = v;
  if (VREMOTE[id]) return `<a class="vlink" href="${VREMOTE[id]}" target="_blank">▶ FIFA video ${id}, item ${pos}</a>`;
  return `<a class="vlink" href="${VDIR + VID[id]}" target="_blank">▶ video ${id}, item ${pos}</a>`;
}

function exCard(id, dose, extra, links) {
  if (links === undefined) links = true;
  const e = EX[id];
  if (!e) return `<div class="exrow"><b>?? ${esc(id)}</b></div>`;
  return `<div class="exrow">
    <div class="exhead">
      <span><span class="tag ${e.p}">${e.p}</span><b>${esc(e.n)}</b></span>
      ${dose ? `<span class="dose">${esc(dose)}</span>` : ""}
    </div>
    <div class="focus">${esc(e.focus)}</div>
    <ul>${e.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
    ${e.prog && e.prog !== "—" ? `<div class="prog">▲ Progress: ${esc(e.prog)}</div>` : ""}
    ${links ? `<div style="margin-top:6px">${vidLink(e.v)} ${extra || ""}</div>` : ""}
  </div>`;
}

function menuBlock(mid, links) {
  const m = MENUS[mid];
  if (!m) return "";
  let h = `<h3>${esc(m.name)} <span class="pill">${m.rounds}</span></h3><p class="small muted">Rest: ${esc(m.rest)}</p>`;
  if (m.note) h += `<p class="small" style="margin-bottom:10px">${m.note}</p>`;
  if (m.ex.length === 0) return h;
  return h + m.ex.map(x => exCard(x.id, x.dose, "", links)).join("");
}

function wuBlock(wuId) {
  const w = WUS[wuId];
  return `<h3>${esc(w.name)}</h3><p class="small muted">6–10 reps each, in this order, ~10 min. Coach names + cues aloud; players copy. Never repeat the same set two sessions in a row.</p>` +
    w.ex.map((id, i) => `<span class="tag mobility">${i + 1}. ${esc(EX[id].n)}</span>`).join(" ");
}

function gameCard(gid) {
  const g = GAMES[gid];
  if (!g) return "";
  return `<div class="exrow"><div class="exhead"><span><span class="tag play">play</span><b>${esc(g.n)}</b></span><span class="dose">${esc(g.balls)} ball(s)</span></div>
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

// grouping rules box (shared)
const GROUPBOX = `<div class="note"><b>Group rules (every session, both days)</b><br>
• <b>10–14 players</b> → 2 groups: physical ↔ ball.<br>
• <b>15–18 players</b> → 3 groups: physical ↔ ball ↔ play/competition (the 3rd activity is always play). On Saturday all three rotate; on Monday the play group stays playing and swaps between the two blocks.<br>
• Ball station takes <b>max 10 players</b> — one ball each. Physical station uses <b>0 balls</b>. Play station uses 1–2 balls with touch limits so everyone moves.<br>
• The ball station is the <b>head coach's technical/tactical slot</b> — winter themes (first touch, pressing, passing, dribbling…) will be inserted here later. Until a theme is listed for the day, run the named placeholder game.</div>`;

const SAFETY = `<div class="alert"><b>Stop-the-rep red flags:</b> hip drop in planks/lunges · lower back arching · knees caving in · loud or messy landings · pain (not "hard"). Step the player back one progression level until 6 clean reps are back. Universal cues: <i>chest out · straight back · drive through the midfoot · look up · strength work SLOW and quiet, power work FAST and light.</i></div>`;

const GATE = `<div class="ok"><b>Progression gate — progress on quality, not load.</b> An exercise graduates only when the player shows: ① 6 clean reps through the full range ② neutral spine + level hips (no drop, no arch) ③ quiet, controlled landings/returns. Then add in this order: range → less support / one leg → rotation → ladder/box height → speed or partner.</div>`;

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
      <td><a href="session.html?w=${w}&d=mon">Mon</a> — ${esc(s.mon.focus)}</td>
      <td><a href="session.html?w=${w}&d=sat">Sat</a> — ${esc(s.sat.focus)}</td>
    </tr>`;
  }
  el.innerHTML = `<table><tr><th>Wk</th><th>Phase</th><th>Monday · 60 min</th><th>Saturday · 90 min</th></tr>${rows}</table>`;
}

// ===== session page =====
function renderSession() {
  const el = document.getElementById("session");
  if (!el) return;
  const q = new URLSearchParams(location.search);
  const w = parseInt(q.get("w") || "1", 10);
  const d = q.get("d") === "sat" ? "sat" : "mon";
  const s = SESSIONS[w] && SESSIONS[w][d];
  if (!s) { el.innerHTML = "<p>Session not found.</p>"; return; }

  const dayName = d === "mon" ? "Monday · 60 min" : "Saturday · 90 min";
  let html = `<div class="sess-head">
    <span class="tag">${s.phase}</span><span class="tag">${esc(s.phaseName)}</span>${s.test ? '<span class="pill">TEST / MILESTONE DAY</span>' : ""}
    <h1 style="font-size:1.5rem;margin-top:8px">Week ${w} — ${dayName}</h1>
    <div class="meta"><b>Focus:</b> ${esc(s.focus)}</div>
  </div>`;

  html += `<div class="sess-nav noprint">
    <a href="plan.html">← All sessions</a>
    <span>${d === "mon"
      ? `<a href="session.html?w=${w}&d=sat">Saturday session →</a>`
      : (w < 24 ? `<a href="session.html?w=${w + 1}&d=mon">Next Monday →</a>` : `<a href="plan.html">Back to plan</a>`)}</span>
    <button class="printbtn" onclick="window.print()">Print</button>
  </div>`;

  if (s.intro) html += `<div class="note"><b>Coach brief:</b> ${s.intro}</div>`;

  html += `<h2 class="sec">Setup</h2><div class="card"><ul style="margin-left:18px">${s.equip.map(e => `<li>${e}</li>`).join("")}</ul></div>`;

  html += `<h2 class="sec">Session timeline</h2>` + timeline(s.timeline);

  if (s.menu || s.menu2) {
    html += `<h2 class="sec">Physical station — full exercise cards</h2>`;
    html += s.menu ? menuBlock(s.menu, false) : "";
    if (s.menu2) html += `<h3 style="margin-top:22px">${esc(s.menu2Title || "Second block")}</h3>` + menuBlock(s.menu2, false);
    html += `<p class="small muted">Example videos for every exercise: <a href="index.html">overview page</a> · <a href="exercises.html">exercise library</a>.</p>`;
  }
  if (s.wu) { html += `<h2 class="sec">Warm-up set today</h2><div class="card">${wuBlock(s.wu)}</div>`; }

  if (s.games && s.games.length) {
    html += `<h2 class="sec">Ball / play options today</h2>` + s.games.map(gameCard).join("");
  }

  html += `<h2 class="sec">Running the groups</h2>` + GROUPBOX;
  if (s.groupNote) html += `<div class="note">${s.groupNote}</div>`;

  if (s.test) html += `<h2 class="sec">Testing protocol</h2><div class="card">${s.test}</div>`;

  if (s.coachPoints && s.coachPoints.length) {
    html += `<h2 class="sec">Coach 3 things today</h2><div class="card"><ol style="margin-left:18px">${s.coachPoints.map(c => `<li>${c}</li>`).join("")}</ol></div>`;
  }

  html += SAFETY + GATE;
  html += `<div class="sess-nav noprint" style="margin-top:26px"><a href="plan.html">← All sessions</a><a href="index.html">Overview</a>${d === "mon" ? `<a href="session.html?w=${w}&d=sat">Saturday →</a>` : (w < 24 ? `<a href="session.html?w=${w + 1}&d=mon">Next week →</a>` : "")}</div>`;

  document.title = `U10 W${w} ${d === "mon" ? "Mon" : "Sat"}`;
  el.innerHTML = html;
}

// ===== exercises page =====
function renderExercises() {
  const el = document.getElementById("exlib");
  if (!el) return;
  let html = "";
  function block(title, ids) { html += `<h3>${title}</h3>` + ids.map(id => exCard(id)).join(""); }
  block("Dynamic mobility — 13 exercises (video V1)", Object.keys(EX).filter(k => EX[k].p === "mobility"));
  block("Core strength — 9 foundation exercises (video V2)", ["c01", "c02", "c03", "c04", "c05", "c06", "c07", "c08", "c09"]);
  block("Core progressions — 7 (video V5)", ["c10", "c11", "c12", "c13", "c14", "c15", "c16"]);
  block("Functional lower-body strength — 8 (video V3)", Object.keys(EX).filter(k => EX[k].p === "lbs"));
  block("Explosivity — 6 (video V4)", Object.keys(EX).filter(k => EX[k].p === "power"));
  block("Strength & mobility combos — 6 (no video: coach demos live)", Object.keys(EX).filter(k => EX[k].p === "combo"));
  el.innerHTML = html;
}

// ===== index page =====
function renderIndex() {
  const ph = document.getElementById("phases");
  if (ph) ph.innerHTML = PHASES.map(p => `<div class="card phase ${p.cls}">
    <h3><span>${p.id} · ${esc(p.name)}</span><span class="wk">weeks ${p.wks}</span></h3>
    <p class="small muted">${esc(p.goal)}</p><ul>${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");

  const vd = document.getElementById("vids");
  if (vd) vd.innerHTML = VIDMETA.map(m => {
    if (VREMOTE[m.v]) return `<div class="vidcard">
      <div class="vinfo"><b>${esc(m.title)}</b><p class="small muted">${esc(m.note)}</p>
      <p style="margin-top:10px"><a href="${VREMOTE[m.v]}" target="_blank">▶ Watch on the FIFA Training Centre page</a></p></div></div>`;
    return `<div class="vidcard">
      <video controls preload="none" src="${VDIR + VID[m.v]}"></video>
      <div class="vinfo"><b>${esc(m.title)}</b><p class="small muted">${esc(m.note)}</p>
      <p class="small" style="margin-top:6px"><a href="${VDIR + VID[m.v]}" target="_blank">Open full video</a></p></div></div>`;
  }).join("");

  const so = document.getElementById("sources");
  if (so) so.innerHTML = "<ul style='margin-left:18px'>" + SOURCES.map(s => `<li><a href="${s[1]}" target="_blank">${esc(s[0])}</a></li>`).join("") + "</ul>";
}

document.addEventListener("DOMContentLoaded", () => { renderPlan(); renderSession(); renderExercises(); renderIndex(); });
