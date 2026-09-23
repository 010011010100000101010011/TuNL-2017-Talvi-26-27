// ===== session builders: standard Mon/Sat skeletons, per-week specifics passed in =====
const PH = {
  1: { id: "P1", name: "Foundation & movement literacy" },
  2: { id: "P2", name: "Build strength, introduce power" },
  3: { id: "P3", name: "Rotate & control" },
  4: { id: "P4", name: "Express & combine" }
};
const phaseOf = w => PH[Math.min(4, Math.ceil(w / 6))];
const mn = id => MENUS[id].name;
const gn = id => GAMES[id].n;

function mon(w, o) {
  const p = phaseOf(w);
  const balls = [].concat(o.ball || []).filter(Boolean);
  const plays = [].concat(o.play || []).filter(Boolean);
  const tl = [
    { t: "0–10", h: "Warm-up — whole group", b: [
      "Full warm-up set below, in order, 6–10 reps each. Coach calls <b>name → cue → go</b>; players copy. Arms-length spacing.",
      ...(o.wuExtra || [])] },
    { t: "10–12", h: "Split groups", b: [
      "Physical group sets up its own mats/ladders (builds ownership). Assistant coach takes the physical station; the other coach takes ball (+ play if 3 groups)."] },
    { t: "12–32", h: "Block 1 — 20 min", b: [
      `<b>Physical group:</b> ${mn(o.menu)} — exact doses on the cards below. Work rate first, chatter second.`,
      `<b>Ball group:</b> ${balls.length ? balls.map(gn).join(" · ") : "head coach's theme drill"} — one ball each, max 10 players. <span class="small">(Theme slot: replace placeholder when winter theme is set.)</span>`,
      ...(plays.length ? [`<b>Play group (only 15+ players):</b> ${plays.map(gn).join(" · ")} — stays playing all evening, swaps ball↔play between blocks.`] : [])] },
    { t: "32–34", h: "Swap", b: ["2 min. Groups switch stations; physical station re-sets itself."] },
    { t: "34–54", h: "Block 2 — 20 min", b: [
      `<b>Physical group (the other half):</b> same menu — same doses. Everyone must complete the core circuit once this evening.`,
      `<b>Ball group:</b> ${balls.map(gn).join(" · ")} — raise the bar: ask for the cue from Block 1 during play.`,
      ...(plays.length ? [`<b>Play group:</b> rotate play ↔ ball per the rules below.`] : [])] },
    { t: "54–60", h: "Cool-down + debrief", b: [
      "Slow re-run of today's warm-up set, 10–12 calm reps with breathing — this doubles as the FIFA post-session mobility development dose.",
      o.debrief || "Debrief: ask two players to demo today's key cue." ] }
  ];
  return { phase: p.id, phaseName: p.name, focus: o.focus, menu: o.menu, wu: o.wu,
    games: [...balls, ...plays], timeline: tl,
    coachPoints: o.coachPoints || [], groupNote: o.groupNote, intro: o.intro,
    equip: o.equip || ["Zone 1 (physical): open floor + mats for planks; no equipment needed for core days", "Zone 2 (ball): up to 10 balls", ...(plays.length ? ["Zone 3 (play): 1–2 balls + cones"] : [])],
    test: o.test };
}

function sat(w, o) {
  const p = phaseOf(w);
  const st = rot => [
    `<b>Physical:</b> ${mn(o.leg)} — cards below. Assistant coaches the station; gate each player individually.`,
    `<b>Ball:</b> ${o.ball.map(g => gn(g)).join(" · ")} — max 10 players, one ball each. <span class="small">(Theme slot — replace placeholder when winter theme is set.)</span>`,
    `<b>Play:</b> ${o.play.map(g => gn(g)).join(" · ")}.`,
    ...(rot && o.rotNote ? [`<i>${o.rotNote}</i>`] : [])
  ];
  const tl = [
    { t: "0–10", h: "Warm-up — whole group", b: [
      "Full warm-up set below (6–10 reps each), then a <b>2-min ladder/hurdle flash</b>: in-in-out-out through both ladders + 3 hurdle step-overs, walking pace, tall posture.",
      ...(o.wuExtra || [])] },
    { t: "10–20", h: o.powerTitle || "Power microdose — whole group (fresh system!)", b: [
      `${mn(o.power)} — doses below. <b>3–4 reps, long rests, maximum intent, never tired, never loud.</b> Mattresses around every box.`,
      ...(o.powerExtra || [])] },
    { t: "20–22", h: "Split into station groups", b: [
      "3 groups if 15+ players; 2 groups (physical ↔ ball) if ≤14. All three stations pre-set behind the curtains."] },
    { t: "22–40", h: "Rotation 1", b: st(1) },
    { t: "40–42", h: "Transition", b: ["Rotate clockwise: physical → ball → play → physical. Fast — no standing lines anywhere."] },
    { t: "42–60", h: "Rotation 2", b: st(2) },
    { t: "60–62", h: "Transition", b: ["Rotate again."] },
    { t: "62–80", h: "Rotation 3", b: st(3) },
    { t: "80–86", h: "Whole-group final game", b: o.final || [`Free ${gn("minileague")} — 3 min matches, two small goals per end.`] },
    { t: "86–90", h: "Cool-down + debrief", b: [
      "Slow mobility re-run on the mattresses + team talk.", o.debrief || "Name one player per pillar who nailed the cue today."] }
  ];
  return { phase: p.id, phaseName: p.name, focus: o.focus, menu: o.leg, menu2: o.power, menu2Title: "Power / prep block — full exercise cards", wu: o.wu,
    games: [...o.ball, ...o.play], timeline: tl,
    coachPoints: o.coachPoints || [], groupNote: o.groupNote, intro: o.intro,
    equip: ["Zone 1 (physical): jump boxes (lowest settings), 2 step ladders, mattresses", "Zone 2 (ball): 10 balls + small goals", "Zone 3 (play): 1–2 balls, cones, ropes for relays"],
    test: o.test };
}

// =====================================================================
//  PHASE 1 — WEEKS 1–6: Foundation & movement literacy  (no jumping!)
// =====================================================================
const SESSIONS = {

1: {
  mon: mon(1, { focus: "Meet the core basics — posture before everything", wu: "A", menu: "coreBase1",
    ball: "pasquare", play: "rondo41",
    intro: "First session of the season. Everything is taught by <b>name + cue</b>; players will run these circuits semi-independently from week 3. Keep it playful and short on talk.",
    coachPoints: ["Plank = straight line head-to-heels, glutes on — hips sagging or piked = end the hold early, that's fine", "Teach the three test cues: <i>straight back · level hips · quiet</i>", "Ball station: one ball each, inside-of-foot only today"],
    debrief: "Quiz: name all 6 core exercises. Reward the names, not the reps." }),
  sat: sat(1, { focus: "Leg basics + landing school (freeze, don't jump)", wu: "A", leg: "lbsBase1", power: "prep1",
    ball: ["duel1v1"], play: ["shadow"],
    intro: "No jumping all phase. The power slot teaches the <b>landing/absorb pattern</b>: quiet feet, frozen positions. Boxes stay at the lowest setting today.",
    coachPoints: ["Split squat: rear knee kisses the floor, drive up through the midfoot", "Step-down = the drill that predicts landings — hips level, no knee cave", "Play zone: shadow races are change-of-direction, not distance sprints"],
    debrief: "Demo the silent landing — who can stick a freeze for 3 seconds?" })
},

2: {
  mon: mon(2, { focus: "Core 1 again, +5 seconds on every hold", wu: "A", menu: "coreBase1",
    ball: "pasquare", play: "boxgame",
    wuExtra: ["Today name each exercise together before starting — echo the cue once."],
    coachPoints: ["Same menu as last Monday — the win today is <b>longer holds with unchanged shape</b>", "Superman: press the glute of the lifting leg, no head bob", "Box game: 3-touch maximum, head up before receiving"],
    debrief: "Who improved their plank shape this week? Self-nominate, then show." }),
  sat: sat(2, { focus: "Legs with control tempo — 3 seconds down", wu: "A", leg: "lbsBase1", power: "prep1",
    ball: ["pasquare"], play: ["shadow"],
    powerExtra: ["Freeze jumps: on your whistle, players freeze mid-power-step — hold 3 s. Balance + control game."],
    rotNote: "Physical station this week: count the 3-second lowering out loud together.",
    coachPoints: ["Slow strength today — tempo is the load", "Side lunge: both feet flat, chest to the lunging side", "Landing school: step-downs must be quieter than walking"],
    debrief: "Loud feet = tell me why. (Too fast, too far, or not ready.)" })
},

3: {
  mon: mon(3, { focus: "Core 2 — longer holds, sharper tempo (new menu)", wu: "A", menu: "coreBase2",
    ball: "tethers", play: "king",
    intro: "Introduce Core 2: plank arm reaches and the walk version of the high-reach march. Same six movement families as Core 1 — names already known.",
    coachPoints: ["Arm reach in plank: hips stay square — no twisting toward the reaching arm", "Seated leg raise: less hand support, back stays tall", "King of the box: goals from live play only, max 6 passes"],
    debrief: "Which exercise tried to cheat you today (tempted to sag/pivot)? Ask around." }),
  sat: sat(3, { focus: "First ladder work in the legs station", wu: "A", leg: "lbsBase2", power: "prep1",
    ball: ["pasquare"], play: ["gauntlet"],
    intro: "Front foot goes on the lowest ladder rung today (more range in the split squat), and the first obstacle-course relay runs in the play zone.",
    powerExtra: ["Add 'stick the landing' partner game: one jumps/steps, partner judges the freeze 1–3.", "Still no height. Landing quality only."],
    coachPoints: ["Ladder split squat: torso tall, front knee over midfoot", "Step-down box up one notch ONLY if last week was silent", "Obstacle course: hurdles stepped over, never knocked — reset it yourself"],
    debrief: "Course feedback: which station was shakiest — and why?" })
},

4: {
  mon: mon(4, { focus: "Core 2 consolidation + first individual gate checks", wu: "A", menu: "coreBase2",
    ball: "pasquare", play: "rondo41",
    groupNote: "Assistant: during the physical block, quietly tick each player against the gate (6 clean reps · spine/hips · control) on the Core 2 exercises. Bring flags to the W6 test.",
    coachPoints: ["Same menu as W3 — now it belongs to the players; coach, don't lead", "Glute-ham lift: both legs simultaneously, hold 1 s at top", "Rondo: start 4v1, graduate to 5v1 when the keep-away flows"],
    debrief: "Gate check results — individual praise, not rankings." }),
  sat: sat(4, { focus: "Legs 2 with gate checks + speed games", wu: "A", leg: "lbsBase2", power: "prep1",
    ball: ["duel1v1"], play: ["shadow", "gauntlet"],
    rotNote: "Assistant runs gate checklist at the physical station (split squat, step-down, side lunge). Flags go to W6 test day.",
    coachPoints: ["Skater squat intro onto the HIGH box only — tap and up", "Duel square: 45 s, winner stays, coach feeds one ball at a time", "Two play games today — let them choose between shadow & gauntlet mid-rotation"],
    debrief: "Name the gate criteria — all three, out loud, together." })
},

5: {
  mon: mon(5, { focus: "Core 2 with partner mirrors — focus under distraction", wu: "A", menu: "coreBase2",
    ball: "pasquare", play: "king",
    intro: "Pairs: one holds/performs, partner mirrors and calls cues. U10s lock in harder when a friend is watching — same exercises, new demand.",
    coachPoints: ["Partner's job: call 'hips!' the moment the line breaks — kind, instant, no laughing match", "March walk: arms glued overhead the whole length", "Keep rounds short: switch pairs halfway through the block"],
    debrief: "Best cue-caller award — voted by the group." }),
  sat: sat(5, { focus: "Legs 2 as a flowing circuit (first full circuit run)", wu: "A", leg: "lbsBase2", power: "prep1",
    ball: ["tethers"], play: ["gauntlet"],
    intro: "Run the five leg exercises as one continuous station flow (40 s work / 20 s move style is fine) — rehearsal for the timed test next week.",
    powerExtra: ["Speed duels: 5 m sprint to a whistle-freeze, judged on stillness AND quiet feet."],
    coachPoints: ["Circuit etiquette: finish an exercise clean or stop it — no half reps", "Ropes out today: 10 s hangs between sets for grip", "Weekly challenge in the ball zone: 90 s keep-away vs the coach"],
    debrief: "Test tomorrow is the same circuit — predict your own score." })
},

6: {
  mon: mon(6, { focus: "TEST WEEK ① — core circuit benchmark (film it!)", wu: "A", menu: "coreBase1",
    ball: "pasquare", play: "tethers", test: `
      <p><b>Format (whole Monday, two groups, individual records on the sheet):</b></p>
      <ul>
        <li><b>Max plank</b> — straight line held; stop at first break of form. Record seconds.</li>
        <li><b>Max side plank (right)</b> — same rules. Record seconds.</li>
        <li><b>Glute-ham lift</b> — max clean reps in 30 s.</li>
        <li><b>Seated leg raises</b> — max clean reps in 30 s.</li>
        <li><b>Gate card</b> — assistant marks ① 6 clean reps ② spine/hips ③ control on plank family.</li>
      </ul>
      <p><b>Video:</b> film every player's plank + glute-ham from the side (phone on a tripod at mat level). This footage is the reference for W12/W18/W24 comparisons.</p>
      <p>Groups rotate: Group A test (assistant, mats), Group B ball/play with coach. Halfway swap.</p>`,
    groupNote: "Today the physical station is a calm test booth — one or two players at a time, others watch and cheer. Record scores on the clipboard sheet.",
    coachPoints: ["Test the form, not the effort — a 20 s perfect plank beats a 60 s wobble", "Praise visibly: post nothing, celebrate everyone", "Ball zone stays fun today — no testing there"],
    debrief: "Hand out the phase-1 gate cards. Nobody sees anyone else's numbers." }),
  sat: sat(6, { focus: "Phase 1 finish — landing-school festival + benchmark", wu: "A", leg: "lbsBase2", power: "prep1",
    ball: ["duel1v1", "tethers"], play: ["gauntlet", "shadow"],
    intro: "Last session of Phase 1. Structure stays normal but the vibe is a festival: relays, duels, and a quiet benchmark of the landing drills.",
    powerExtra: ["Benchmark (film it): power step freeze — 3 steps per leg, judged freeze quality 1–3; broad <b>step</b>-jump from standing onto low box, 3 tries, judge silence not distance."],
    final: ["Obstacle-course finals: team relays, two rounds, handicap the winners (one hand behind back, non-dominant foot hurdles) so the last round is close."],
    coachPoints: ["Festival ≠ sloppiness: gate still applies to every rep of every relay", "Film the benchmarks side-on for the W12 comparison", "End on time, end on a win"],
    debrief: "Phase 1 review: what did 'quiet feet' teach us? Next 6 weeks: one leg, more range, first real jumps." })
}
};

// =====================================================================
//  PHASE 2 — WEEKS 7–12: Build strength, introduce power
//  Warm-up upgrades to Set B. First real (low) jumps enter Saturday's
//  whole-group power microdose — box = lowest setting + mattresses.
// =====================================================================
Object.assign(SESSIONS, {

7: {
  mon: mon(7, { focus: "New core menu — side-plank family + Copenhagen intro", wu: "B", menu: "coreBuild",
    ball: "pasquare", play: "rondo41",
    intro: "Phase 2 opens: warm-up upgrades to <b>Set B</b> (adds the plank-travelling patterns) and Core 3 introduces <b>side plank legs apart</b> and the <b>Copenhagen plank</b>. Copenhagen starts with the working foot ON THE FLOOR — only lift it onto the ladder/bench when 20 s is clean.",
    coachPoints: ["New warm-up Set B — learn it as a story: frog → 90-90 → lunge-rotate → plank travel…", "Copenhagen: foot on floor first, hips high, no shoulder collapse", "Side plank legs apart is EASIER base / harder lever than legs together — explain why", "Ball: first touch out of feet every time"],
    debrief: "Which of the two new exercises tried hardest to cheat you?" }),
  sat: sat(7, { focus: "One leg day + FIRST box jumps (low!)", wu: "B", leg: "lbsUni1", power: "powA",
    ball: ["duel1v1"], play: ["boxgame"],
    intro: "The phase's big moment: real jumps — but only <b>3 reps, lowest box, mattresses around it, silent landings</b>. If the hall gets loud, we're doing it wrong. Legs station goes single-leg for the first time: Bulgarian (rear foot on ladder), skater and pistol onto the HIGH box.",
    powerExtra: ["Teach the pattern before the power: set → slight bend → DRIVE → stick silently → step down (never jump down off the box)."],
    coachPoints: ["Bulgarian: hips forward, front knee over midfoot, chest tall", "Pistol onto HIGH box today — sitting down, not collapsing", "Box jump = quality over height EVERY time: silent = earned another set"],
    debrief: "Box-jump rule #1? (Land quiet or the box goes lower.)" })
},

8: {
  mon: mon(8, { focus: "Core 3 consolidation — holds belong to the players", wu: "B", menu: "coreBuild",
    ball: "pasquare", play: "king",
    coachPoints: ["Players self-time their holds this week; assistant spot-checks form", "Superman now adds a 3-second hold at the top", "King of the box: losers run 5 wall-push-ups, winners set the next rule"],
    debrief: "Ask for one volunteer to demo a perfect Copenhagen line." }),
  sat: sat(8, { focus: "Legs 3 + Power A round 2 — intent up, noise down", wu: "B", leg: "lbsUni1", power: "powA",
    ball: ["tethers"], play: ["rondo41"],
    rotNote: "Power microdose check: has ANYONE landed loudly this week? Then today everyone repeats the pattern from the floor (no box) before using boxes.",
    coachPoints: ["Broad jump: swing big, land soft, freeze 1 s — walk back, don't run", "Skater squat: same leg drives back up — no hopping to the other foot", "Rondo 4v1: if the team beats the defenders 3×, promote to 5v1"],
    debrief: "Who kept every landing silent today? Quiet applause." })
},

9: {
  mon: mon(9, { focus: "Core 3 — Copenhagen progress check (+ gate flags)", wu: "B", menu: "coreBuild",
    ball: "pasquare", play: "boxgame",
    groupNote: "Assistant: Copenhagen foot comes OFF the floor (onto lowest ladder rung) for players with a clean 20 s foot-down version — everyone else keeps the regression. Flag gate results for W12 test.",
    coachPoints: ["Progress is individual — same menu, different steps", "Seated leg raise: hands come off the floor for the strong ones", "Box game: a goal counts only from inside the box"],
    debrief: "Name the ladder: range → support → rotation → height → speed." }),
  sat: sat(9, { focus: "Lower the boxes — more range in the legs, more distance in the jumps", wu: "B", leg: "lbsUni1", power: "powA",
    ball: ["duel1v1"], play: ["gauntlet"],
    powerExtra: ["Broad jump today measures: 3 jumps from a standing start, best distance marked with a cone. Record it — it's a W12 comparison number."],
    rotNote: "Physical station: skater & pistol boxes go down ONE notch only for players who tapped lightly and drove back clean.",
    coachPoints: ["Step-down: higher box = better only if the free foot touches like a feather", "Obstacle course: rope hang 10 s — hands over bar, shoulders 'up', not hanging on the joints", "Duel square: winner stays, coach feeds"],
    debrief: "Distance cones: beat your own cone next week, nobody else's." })
},

10: {
  mon: mon(10, { focus: "Core 3 in slow motion — 3 s down on every rep", wu: "B", menu: "coreBuild",
    ball: "tethers", play: ["shadow"],
    intro: "Same menu, new demand: three seconds down on every rep that has a down. Slow is the load — control exposes shortcuts.",
    coachPoints: ["Glute-ham in 3 s down: most players will discover their back isn't the boss — their glutes are", "Slow plank-to-position: no dropping", "Shadow races: mirror the partner, stay low, stay quiet"],
    debrief: "What did slow reveal that fast was hiding?" }),
  sat: sat(10, { focus: "Legs 4 — unilateral depth + first lateral hops", wu: "B", leg: "lbsUni2", power: "powA",
    ball: ["pasquare"], play: ["minileague"],
    powerExtra: ["INTRO lateral hops (prep for Power B): small skater hops side-to-side, 2 × 3/leg, hold landing 2 s — no distance chase today.", "Side lunge + light backpack enters for players with a perfect bodyweight version."],
    coachPoints: ["Pistol: box one notch lower ONLY with a straight torso at the bottom", "Lateral hop: land on one leg, freeze — that's the whole point", "Mini-league: 3-min matches, everyone touches the ball before a goal counts"],
    debrief: "Balance is strength in disguise." })
},

11: {
  mon: mon(11, { focus: "Core 3 partner-mirror circuit — distraction resistance", wu: "B", menu: "coreBuild",
    ball: ["pasquare", "duel1v1"], play: ["king"],
    coachPoints: ["Partners call cues AND count out of time on purpose — the performer must not speed up", "Copenhagen: top foot's shin rests on ladder rung, hip high", "Keep the pair switch mid-block so everyone performs twice"],
    debrief: "Best cue-callers get named. Again, kind and instant." }),
  sat: sat(11, { focus: "Legs 4 + Power B intro — lateral & fast counters", wu: "B", leg: "lbsUni2", power: "powB",
    ball: ["tethers"], play: ["shadow", "gauntlet"],
    intro: "Power B enters: rotation box jump on the LOW box + the unloaded fast lateral counter (p06). Loaded version (p05) stays locked until a player's unloaded counters are perfect and silent.",
    powerExtra: ["Rotation box jump: 90° turn onto the box, low height only. If the turn breaks the landing, come back to square jumps."],
    coachPoints: ["Fast counter ≠ fast feet on tiptoes — full foot, quick spring", "Overhead reverse lunge teaser for the ready: arms lock overhead, smooth step back", "Let players pick shadow or gauntlet mid-rotation — buy focus with autonomy"],
    debrief: "Which pillar did you feel in your legs today — strength or power?" })
},

12: {
  mon: mon(12, { focus: "TEST WEEK ② — core re-test vs W6 (film it!)", wu: "B", menu: "coreBuild",
    ball: ["pasquare", "duel1v1"], play: ["tethers"], test: `
      <p><b>Same protocol as W6 so the numbers compare:</b> max plank · max side plank (right) · glute-ham reps in 30 s · seated leg raises in 30 s · gate card.</p>
      <ul>
        <li><b>New bonus events</b> (record but not compared): max side plank legs apart · Copenhagen foot-down max hold · Copenhagen foot-up max hold (if cleared).</li>
        <li><b>Video:</b> same side-on angle as W6 for plank + glute-ham. Label files W12.</li>
      </ul>
      <p>Same two-station flow as W6: test booth (assistant) ↔ ball/play (coach), swap halfway. Scores private on the clipboard.</p>`,
    groupNote: "Run it calm and short: a test that turns into a grind is the wrong test for U10.",
    coachPoints: ["Compare players only to their own W6 film", "Perfect 20 s > wobbly 60 s — always", "Ball zone full fun: 1v1 tournament on the small goals"],
    debrief: "Hand out gate cards. Celebrate personal bests loudly." }),
  sat: sat(12, { focus: "Phase 2 finish — power benchmark + festival", wu: "B", leg: "lbsUni2", power: "powB",
    ball: ["duel1v1", "tethers"], play: ["gauntlet", "minileague"],
    powerExtra: ["BENCHMARK (film side-on): broad jump best-of-3 distance (vs W9 cone) · box jump max height with SILENT landing · lateral counter 3/leg best freeze quality. Record every player."],
    final: ["Mini-league finals on 4 small goals, 3-min matches + 'all-star' last match: coaches vs winners."],
    coachPoints: ["Festival energy, test focus — benchmarks still need the gate", "Film benchmarks for the W18/W24 montage", "Water between everything today"],
    debrief: "Phase 2 review: one-leg stronger, jumps quieter. Next: rotation — press, cut, turn." })
}
});

// =====================================================================
//  PHASE 3 — WEEKS 13–18: Rotate & control
//  Warm-up Set C (full battery). Core progressions (V5) enter; first
//  resisted-combo family exercises (bodyweight only). Power B runs.
// =====================================================================
Object.assign(SESSIONS, {

13: {
  mon: mon(13, { focus: "New core block — the rotation seven (V5) intro", wu: "C", menu: "coreRot1",
    ball: ["pasquare"], play: ["rondo41"],
    intro: "Phase 3 opens with the FIFA <b>core progressions</b>: Spiderman climbs, side-plank reach-through, open side plank, 90-90 thrusts, Copenhagen lower/lift. Teach each with the video on a screen/phone before the block starts — names already feel advanced, the players will rise to them.",
    coachPoints: ["Spiderman: elbow to knee, pelvis does NOT rotate — that's the whole exercise", "Reach-through: big arc under → tall high reach, hips stay stacked", "90-90 thrust: drive up fast at the end of each rotation", "Ball placeholder today = passing squares; theme slot resumes whenever set"],
    debrief: "Which new exercise is the hardest to keep honest? Vote." }),
  sat: sat(13, { focus: "Rotation enters the legs + first turning box jumps", wu: "C", leg: "lbsRot1", power: "powB",
    ball: ["duel1v1"], play: ["boxgame"],
    intro: "Legs 5 adds the <b>overhead reverse lunge</b> and the first combo: <b>curtsy squat → side lunge</b>, pure bodyweight. Power B continues; the rotation box jump stays LOW until the turn never costs landing quality.",
    powerExtra: ["Rotation box jump cue: 'spot the target before you leave the ground' — decide the turn direction in the set position."],
    coachPoints: ["Overhead lunge: arms are a statue — the body moves around them", "Curtsy: back knee to the floor on the ball of the foot, drive UP into the side lunge", "Box jump rotation: 90° only. A wobbly turned landing = no-turn box jumps tomorrow"],
    debrief: "Rotation rule: turn from the hips and spine, not the knees." })
},

14: {
  mon: mon(14, { focus: "Core 4 consolidation + Spiderman tempo", wu: "C", menu: "coreRot1",
    ball: ["pasquare"], play: ["king"],
    coachPoints: ["Spiderman: 2 s down — pelvis quiet, shoulders stacked over elbows", "Copenhagen lower/lift: foot still on the floor unless the gate says otherwise", "King of the box: max 6 passes, live-move goals only"],
    debrief: "Demo contest: cleanest Spiderman wins the round." }),
  sat: sat(14, { focus: "Legs 5 flow + Power B (box +1 notch if silent)", wu: "C", leg: "lbsRot1", power: "powB",
    ball: ["tethers"], play: ["gauntlet"],
    rotNote: "Box height is earned: only players with silent landings all week go up one notch — everyone else defends their current height.",
    coachPoints: ["Skater squat deeper: reach further, chest tall, same-leg drive", "Obstacle course: add a curtsy→side-lunge station on the bodyweight standard", "Duel square stays 3×3 m, 45 s"],
    debrief: "What did you earn this week — height, range, or speed?" })
},

15: {
  mon: mon(15, { focus: "Core 4 — open side plank deepens + gate flags", wu: "C", menu: "coreRot1",
    ball: ["duel1v1"], play: ["shadow"],
    groupNote: "Assistant: flag per player — Spiderman, reach-through, 90-90 thrust, Copenhagen lower/lift (gate card). Flags feed the W18 test.",
    coachPoints: ["Open side plank: full extension, legs wide — the pause IS the rep", "90-90 thrust: chest out, straight lumbar, no breath-holding", "Shadow: low and quiet beats fast and flailing"],
    debrief: "Name the gate — then name one thing you'll fix before test day." }),
  sat: sat(15, { focus: "Legs 5 + second combo (lunge twist) + faster counters", wu: "C", leg: "lbsRot1", power: "powB",
    ball: ["pasquare"], play: ["ropegames", "boxgame"],
    intro: "Second combo enters: <b>forward lunge with rotational twist</b> (bodyweight). Power B finishes the block with the fast unloaded lateral counter — speed of landing is the score.",
    powerExtra: ["Lateral counter scoring: partner counts 'clean' landings in 3 attempts — distance only after clean."],
    coachPoints: ["Lunge twist: hands stay at chest, head turns with them, knee kisses the floor", "Rope games: hangs, knee tucks over mats, team tug 3×8 s — grip day", "Box game: everyone defends, everyone attacks"],
    debrief: "Combo #1 and #2 — what do they share? (Turn + drive, quiet landing.)" })
},

16: {
  mon: mon(16, { focus: "New core block B — crouching rotations + glute thrusts", wu: "C", menu: "coreRot2",
    ball: ["pasquare"], play: ["minileague"],
    coachPoints: ["Crouching hip rotation: one-arm support, hips twist to the floor, breathe", "Seated glute lift: slow down, light touch, strong thrust up", "Mini-league: points table on the wall, 3-min matches"],
    debrief: "Two new moves, same principle: resist the rotation you don't want, create the one you do." }),
  sat: sat(16, { focus: "Legs 6 — deepest controlled ranges + Power B", wu: "C", leg: "lbsRot2", power: "powB",
    ball: ["tethers"], play: ["king"],
    rotNote: "Today's physical station standard: deepest range the player controls — 'deep' without control is just a collapse with ambition.",
    coachPoints: ["Pistol: deepest CONTROLLED box setting — torso wins the depth", "Pillar RDL (x03 intro at demo level): flat back, pivot, one smooth drive up", "King of the box: winners pick the next constraint"],
    debrief: "Balance under rotation — where did it hide today?" })
},

17: {
  mon: mon(17, { focus: "Core 5 as 40-s circuit rounds — engine + posture", wu: "C", menu: "coreRot2",
    ball: ["duel1v1"], play: ["gauntlet"],
    intro: "Same menu, circuit format: 40 s work / 20 s move, 2 rounds. Form first — a broken rep ends the interval for that station, no guilt.",
    coachPoints: ["Coach calls 'check!' every 10 s — players freeze and self-assess posture", "Spiderman under fatigue is where Phase 3 was won", "Course relay: hurdle step-overs reset if knocked"],
    debrief: "Did posture survive the engine work? Honest answers only." }),
  sat: sat(17, { focus: "Legs 6 + high-step combo (x04) + fastest counters", wu: "C", leg: "lbsRot2", power: "powB",
    ball: ["pasquare"], play: ["ropegames", "shadow"],
    intro: "Third combo: <b>high-step forward lunge + rotational high reach</b> onto the lowest box/step — prereq x02 demonstrated first. Power B at its fastest today.",
    coachPoints: ["High-step: start far enough from the box to place the whole foot", "Rotational high reach: strong finish pose — hold it like a photo", "Rope games: saw + hangs; keep shoulders active, no dead hanging"],
    debrief: "Three combos now — press, twist, step. All football actions, disguised." })
},

18: {
  mon: mon(18, { focus: "TEST WEEK ③ — rotation-core benchmark (film it!)", wu: "C", menu: "coreRot2",
    ball: ["pasquare", "duel1v1"], play: ["tethers"], test: `
      <p><b>Core rotation benchmark (individual, test-booth format as W6/W12):</b></p>
      <ul>
        <li><b>Spiderman climbs</b> — max clean reps in 30 s.</li>
        <li><b>Side-plank reach-through</b> — max clean reps in 30 s (per side not needed; alternate).</li>
        <li><b>90-90 thrust</b> — max clean alternations in 30 s.</li>
        <li><b>Copenhagen lower/lift</b> — max per side at current progression level.</li>
        <li><b>Max plank</b> + gate card — compare vs W6/W12.</li>
      </ul>
      <p><b>Video:</b> side-on Spiderman + Copenhagen, labelled W18.</p>
      <p>Ball/play zone: 1v1 world-cup format on the small goals — keep it festive.</p>`,
    groupNote: "Same calm test-booth flow: 2 players tested, the rest warm with shadow races nearby.",
    coachPoints: ["Rotation is the theme — judge every rep for a quiet pelvis", "Personal-best comparisons only", "End the test block with a group cheer for the last player"],
    debrief: "Gate cards out. Phase 3 numbers vs Phase 2 — what jumped?" }),
  sat: sat(18, { focus: "Phase 3 finish — power re-benchmark + combo showcase", wu: "C", leg: "lbsRot2", power: "powB",
    ball: ["duel1v1", "tethers"], play: ["gauntlet", "minileague"],
    powerExtra: ["BENCHMARK (film): rotation box jump best turn-and-stick · lateral counter clean-landings score · broad jump distance vs W12 cone. All recorded."],
    final: ["Combo showcase: pairs pick their 2 best combos, perform them for the group, group gives one-word feedback. Then coaches-vs-all-stars 3-min match."],
    coachPoints: ["Benchmark reps are gate reps — quality over numbers, same as always", "Film for the W24 season montage", "Hydrate, celebrate, hand out gate cards"],
    debrief: "Final phase: everything together, max intent, players build their own circuit." })
}
});

// =====================================================================
//  PHASE 4 — WEEKS 19–24: Express & combine
//  Player ownership + the six full-body combos + max-intent power.
// =====================================================================
Object.assign(SESSIONS, {

19: {
  mon: mon(19, { focus: "Player-built core circuits — ownership week", wu: "C", menu: "coreExpress",
    ball: ["pasquare"], play: ["minileague"],
    intro: "Phase 4 = expression. Each player builds their OWN 6-exercise core circuit from the whole core library: <b>1 anti-rotation hold + 1 hip hinge/glute + 1 rotation + 3 picks</b> (their weaknesses encouraged). Assistant screens every sheet for balance before it runs. This proves the exercises belong to them now.",
    coachPoints: ["Coach the sheet, then let them run — resist re-taking the wheel", "Selection sanity check: no two plank-holds in a row, include a rotation", "Their doses: 8–12 reps or 20–30 s holds, 2 rounds, rest they manage (min 30 s)"],
    debrief: "Who discovered a weakness they want to keep training? Write it on their sheet." }),
  sat: sat(19, { focus: "The six combos — first full pass", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["duel1v1"], play: ["boxgame"],
    intro: "All six FIFA strength/mobility <b>combos</b> are now on the menu (curtsy→side lunge, lunge twist, pillar RDL, high-step reach, single-leg glute-ham on box, rotational press-up). Bodyweight standard only — light backpack/partner-hand load is a personal gate decision, never a group one. Power C enters with intent.",
    powerExtra: ["Power C intro: explain the contract — 3 reps, full rest, maximum speed/height, silent landings. Anyone tired sits the set; that's the program working, not a punishment."],
    coachPoints: ["Rotational press-up: NO load until the back stays straight through the turn", "Single-leg glute-ham: shoulders on the mattress stack, full working-leg extension", "High-step reach: the finish pose holds — acceleration to deceleration, that's football"],
    debrief: "Which combo is your signature? Which one owns you?" })
},

20: {
  mon: mon(20, { focus: "Player-built menu × partner AMRAP (2 min, not endless)", wu: "C", menu: "coreExpress",
    ball: ["pasquare"], play: ["king"],
    intro: "Their circuits return, now as a 2-minute AMRAP (as many rounds as possible) with a partner counting and form-policing. U10-safe: 2 minutes hard stop, and the partner can VETO a broken rep — veto counts as a save, not a loss.",
    coachPoints: ["AMRAP rule: quality reps only — a vetoed rep is uncounted, no drama", "Partner feedback: 'hips!' 'quiet!' — the cue vocabulary they learned all season", "Keep rounds to 2 minutes; recovery jog between"],
    debrief: "Best partner save of the day — nominate each other." }),
  sat: sat(20, { focus: "Combos 4-of-6 + Power C round 2", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["tethers"], play: ["gauntlet"],
    rotNote: "Physical station this rotation: players pick 4 of the 6 combos and defend their pick — coach may swap one for their weakest.",
    coachPoints: ["Max intent ≠ max noise — speed with silence is the Phase 4 flex", "Pillar RDL: one smooth drive up, arms to chest", "Course relay: combos version — curtsy station + high-step station"],
    debrief: "Explain your 4-combo choice in one sentence. Then run it." })
},

21: {
  mon: mon(21, { focus: "Players run the stations — coaches watch and grade", wu: "C", menu: "coreExpress",
    ball: ["duel1v1"], play: ["ropegames"],
    intro: "Captains lead warm-up and run their circuits with their groups; coaches circulate with the gate card only. The assistant observes and ticks — this is the clearest movement audit of the season.",
    coachPoints: ["Silence the instinct to interrupt — take notes, coach after", "Grade quietly: posture under their self-built load", "If a captain asks, answer with a question"],
    debrief: "Coaches report: one green light and one growth area per player (private notes for W23)." }),
  sat: sat(21, { focus: "Combos + light-load power (first and maybe only load)", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["pasquare"], play: ["ropegames", "boxgame"],
    powerExtra: ["p05 loaded lateral counter: light backpack ONLY for players whose unloaded counters are perfect AND silent. Everyone else repeats p06. The bag is earned like a black belt."],
    coachPoints: ["Load rule of the season: small increments, only after perfection, chest-height only", "Combos with light bag: curtsy and lunge twist candidates", "Rope tug: teams of 4, 3×8 s pulls, mats behind"],
    debrief: "What does 'earned load' mean? Say it with me." })
},

22: {
  mon: mon(22, { focus: "Core Express final run + rotational press-up mastery", wu: "C", menu: "coreExpress",
    ball: ["pasquare"], play: ["minileague"],
    intro: "Last full core session before finals. Circuits run at chosen pace, plus a closing group block: 3 × 5 rotational press-ups with a 2-s reach-hold.",
    coachPoints: ["Press-up rotation: big-arc reach, straight back, slow descent", "Encourage adding one Phase-1 staple to their sheet — full circle", "Mini-league: seed for tomorrow's final"],
    debrief: "Tomorrow is the final test. Sleep, eat, shoes tied." }),
  sat: sat(22, { focus: "Full combos + Power C max intent — dress rehearsal", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["duel1v1", "tethers"], play: ["gauntlet"],
    rotNote: "Rehearse tomorrow's test flow at full speed: power booth → test booth → ball. Everyone knows their route.",
    coachPoints: ["One full pass of all six combos, no load, judged like a test", "Power C: pick your max silent box height NOW so tomorrow is performance, not discovery", "Everything fun stays fun — rehearsal is not a mood"],
    debrief: "Questions about the test? Answer every one, out loud." })
},

23: {
  mon: mon(23, { focus: "FINAL TEST ④ — full battery (film it!)", wu: "C", menu: "coreExpress",
    ball: ["pasquare", "duel1v1"], play: ["tethers"], test: `
      <p><b>Full-season battery — individual, private scores, film side-on (label W23):</b></p>
      <ul>
        <li><b>Max plank</b> · <b>max side plank</b> (right) — compare W6 / W12.</li>
        <li><b>Spiderman climbs</b> 30 s · <b>Copenhagen lower/lift</b> per side — compare W18.</li>
        <li><b>Movement screen:</b> split squat, pistol on box, step-down — gate card ①②③.</li>
        <li><b>Combos:</b> 2 best of six, judged 1–3 on control + rotation quality.</li>
        <li><b>Self-built circuit:</b> run their own 6-ex menu once, judged on posture under fatigue.</li>
      </ul>
      <p>Same calm booth flow (assistant) ↔ ball/play (coach), swap halfway. Every player leaves with their card.</p>`,
    groupNote: "Ball zone today: 1v1 world cup + free play — test-day nerves burn off best with a ball.",
    coachPoints: ["Test the season, not the day: if a player is off, note it and move on", "Film everything that feeds the W24 montage", "Celebrate every completed card"],
    debrief: "Tomorrow: festival. Bring your best and your loudest." }),
  sat: sat(23, { focus: "FINAL POWER TEST + league final", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["duel1v1", "tethers"], play: ["minileague"], test: `
      <p><b>Power test (film side-on, label W23):</b></p>
      <ul>
        <li><b>Broad jump</b> best-of-3 — distance vs W9/W12 cones.</li>
        <li><b>Box jump</b> — max height with a SILENT landing (mat protected, lowest-to-highest attempts).</li>
        <li><b>Rotation box jump</b> (low box) — best turn-and-stick, judged 1–3.</li>
        <li><b>Lateral counter</b> (unloaded) — clean-landing score of 3/side + fastest counter.</li>
      </ul>
      <p>Order matters: power test replaces the microdose (10–20 min slot), done fresh. Legs station becomes a light technique pass of the combos instead.</p>`,
    intro: "Power test first (fresh system!), then light combos, then the big one: mini-league final on 4 small goals.",
    final: ["League final + third-place match on the small goals, real names on the points table, coaches present as fans only."],
    coachPoints: ["Test is only as serious as the fun around it — keep the festival mood", "Record every benchmark — tomorrow's montage is the season", "Safety: test day means tired legs later; combos stay light"],
    debrief: "Every number goes on the card. Tomorrow we watch the season." })
}
});

// =====================================================================
//  WEEK 24 — CLOSING FESTIVAL (both days player-led)
// =====================================================================
Object.assign(SESSIONS, {
24: {
  mon: mon(24, { focus: "Player-led session + season review", wu: "C", menu: "coreExpress",
    ball: ["tethers", "pasquare"], play: ["ropegames", "shadow"],
    intro: "The players run the show. One group of volunteers leads the warm-up (Set C, self-selected order); another runs their self-built core circuits for the class; ball and play zones run the games the squad voted for. Coaches watch, clap, and hand out cards.",
    groupNote: "Set up a montage screen (laptop/tablet) by the mattresses: W6 → W12 → W18 → W23 clips on loop during the cool-down.",
    coachPoints: ["Let them teach — a player's cue lands where a coach's won't", "Review questions: hardest pillar? favourite drill? what do you want in spring?", "Keep the montage rolling — the visible progress is the medal"],
    debrief: "Season review round: one word each. Coach closes with what the group earned." }),
  sat: sat(24, { focus: "Season finale — tournament + player-designed challenges", wu: "C", leg: "lbsExpress", power: "powC",
    ball: ["duel1v1", "tethers"], play: ["gauntlet", "minileague"],
    intro: "Closing day: players design one physical challenge each (from anything in the plan) — the best ones run in the stations today; tournament brackets all afternoon. The final game is everyone vs coaches.",
    final: ["EVERYONE vs COACHES on all 6 small goals, 2 × 5 min. Handicap honestly. Then awards: most improved per pillar, best teammate, quietest landing, loudest cheer.", "Awards are handed out with the season montage playing."],
    coachPoints: ["Player-designed challenges still pass the safety gate — veto anything with risky landings", "Give every player a moment by name", "End on time, on a win, on a laugh"],
    debrief: "Hand out the cards + spring preview. Thank the families. Done — see you next season." })
}
});
