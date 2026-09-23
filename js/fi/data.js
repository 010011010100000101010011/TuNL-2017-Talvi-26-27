// ===== Source data: FIFA Training Centre "Athleticism for young players" (Tony Colbert) =====
const VDIR = "videos/";
const VID = {
  V1: "Fitness_TC_Mobility_1-13_premium.mp4",
  V2: "Fitness_TC_Core_1-9_premium.mp4",
  V3: "Fitness_Colbert_Lower_Body_Strenght_1-8_premium.mp4",
  V4: "Fitness_TC_Explosivity_1-6_premium.mp4",
  V5: "Core_progressions_all_exercises_premium.mp4"
};
// V1 exceeds GitHub's 100 MB per-file limit — it streams from the FIFA article instead
const VREMOTE = {
  V1: "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-dynamic-mobility.php"
};
const VIDMETA = [
  { v: "V1", title: "Dynamic mobility — all 13 exercises", note: "In video order 1–13, matching the Mobility library below. Hosted on the FIFA site (file too large for GitHub)." },
  { v: "V2", title: "Core strength — all 9 exercises", note: "In video order 1–9, matching the Core library below." },
  { v: "V3", title: "Functional lower-body strength — all 8 exercises", note: "In video order 1–8, matching the Lower-body library below." },
  { v: "V4", title: "Explosivity — all 6 exercises", note: "In video order 1–6, matching the Explosivity library below." },
  { v: "V5", title: "Core — new exercises & progressions (7)", note: "In video order 1–7, matching the Core progressions below." }
];
const SOURCES = [
  ["A foundation for physical development", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-foundation-for-phyiscal-development.php"],
  ["Building more from less (smart training)", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-building-more-from-less.php"],
  ["Dynamic mobility", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-dynamic-mobility.php"],
  ["Core strength", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-core-strength.php"],
  ["Functional lower-body strength", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-functional-lower-body-strength.php"],
  ["Explosivity", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-explosivity.php"],
  ["Core: new exercises & progressions", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-core-strength-progressions.php"],
  ["Mobility & strength: new exercises & progressions", "https://www.fifatrainingcentre.com/en/practice/training-perspectives/athleticism-for-young-players/athleticism-for-young-players-mobility-and-strength-progressions.php"]
];

// pillar: mobility | core | lbs | power | combo
// v: [videoId, positionInVideo] or null
const EX = {
  // ---- MOBILITY (V1, 13) ----
  m01: { n: "Frog-pose", p: "mobility", v: ["V1", 1], focus: "Hip flexors, adductors, rotators", cues: ["Keep feet turned out horizontally throughout"], prog: "Add rotation (m02)" },
  m02: { n: "Frog-pose with rotation", p: "mobility", v: ["V1", 2], focus: "Hip internal rotators", cues: ["Lift the foot", "Squeeze glutes and hold briefly at top"], prog: "—" },
  m03: { n: "Kneeling hip adductor rock", p: "mobility", v: ["V1", 3], focus: "Hip adductors and extensors", cues: ["Extended leg straight, ball of foot in full contact with floor", "Hold the stretch briefly at full range before returning"], prog: "—" },
  m04: { n: "Pigeon stretch with external hip rotation", p: "mobility", v: ["V1", 4], focus: "Hip flexors and external rotators", cues: ["Lift the knee to the fullest extent", "Hold briefly at top"], prog: "—" },
  m05: { n: "90-90 transition", p: "mobility", v: ["V1", 5], focus: "Hip internal + external rotators", cues: ["Sit as upright as possible while shifting sides"], prog: "Add arm reach / hip thrust (see core progressions)" },
  m06: { n: "Extended-arms plank to extended lunge", p: "mobility", v: ["V1", 6], focus: "Active hip flexors/extensors + strong core", cues: ["Arms completely extended, chest out", "Do not let hips drop in the bridged plank", "Rear leg extended and off the floor"], prog: "—" },
  m07: { n: "Plank to straight-leg hip flexion & adduction", p: "mobility", v: ["V1", 7], focus: "Active hip flexion + adduction with core", cues: ["Touch foot to floor in a controlled manner out wide", "Arms locked, chest out, hips level"], prog: "—" },
  m08: { n: "Runner lunge to hamstring shift", p: "mobility", v: ["V1", 8], focus: "Hip flexors/extensors, lumbar spine", cues: ["Neutral back in the lunge", "Lean slightly forward from the hip in the hamstring position, chest out, head up", "Straight leg, toes towards shin"], prog: "—" },
  m09: { n: "Overhead squat (arms up, no pole)", p: "mobility", v: ["V1", 9], focus: "Hip extensors/rotators, spine, ankles, shoulders + core", cues: ["Feet wider than shoulders", "Arms fully extended overhead", "Sit deep, chest out, core braced, head lifted"], prog: "—" },
  m10: { n: "Sumo squat with alternating reach", p: "mobility", v: ["V1", 10], focus: "Hip extensors/rotators + spinal rotation", cues: ["Sit deep, feet full contact with floor", "Reach high and rotate, look to the extended arm", "Drive knees out wide"], prog: "—" },
  m11: { n: "Kneeling lunge with rotation", p: "mobility", v: ["V1", 11], focus: "Spinal rotators, hip adductors/flexors", cues: ["Stable lunge, front knee facing straight ahead", "Rotate 180° side to side, arms extended at shoulder height", "Turn head to look along the rear arm"], prog: "—" },
  m12: { n: "Alternating side lunge", p: "mobility", v: ["V1", 12], focus: "Hip adductors/extensors, ankles + core", cues: ["Neutral back, chest out, head up", "Torso in line with the lunging knee", "Ball of both feet stays on the floor"], prog: "Hold a light bag with straight arms (P3+)" },
  m13: { n: "World's greatest stretch", p: "mobility", v: ["V1", 13], focus: "Hips + thoracic rotation + shoulders + core", cues: ["Extended lunge, rear leg off the floor, hips don't drop", "Support hand aligns with front foot", "Rotate and reach high in a big arc, hold briefly"], prog: "—" },

  // ---- CORE (V2, 9) ----
  c01: { n: "Prone isometric hold (plank)", p: "core", v: ["V2", 1], focus: "Deep abdominals, shoulder girdle", cues: ["Straight line head to heels", "Squeeze glutes, don't let hips sag or pike"], prog: "Plank with alternating arm reach (c02)" },
  c02: { n: "Plank, alternating arm reach", p: "core", v: ["V2", 2], focus: "Core + thoracic rotation + shoulder stability", cues: ["Reach arm forward at shoulder height", "Don't twist the body toward the raised arm; keep hips horizontal"], prog: "Spiderman climbs (c10)" },
  c03: { n: "Alternating superman", p: "core", v: ["V2", 3], focus: "Spinal extensors, glutes, obliques", cues: ["Alternate arm + opposite leg lift", "Keep a horizontal line", "Engage the glute of the raised leg"], prog: "Hold top position 3–5 s" },
  c04: { n: "Glute-hamstring lift", p: "core", v: ["V2", 4], focus: "Hip + spinal extensors", cues: ["Simultaneous straight-leg raise and bent-leg extension", "Hold briefly at top", "Both legs work together, controlled"], prog: "Shoulders on box, single-leg variation in P4 (x05)" },
  c05: { n: "High-reach march (on the spot)", p: "core", v: ["V2", 5], focus: "Core + hip flexors, ankle stability", cues: ["Arms locked straight overhead", "Drive knees up, march tall"], prog: "March → walk → kneeling-lunge start + walk" },
  c06: { n: "Side plank, legs together", p: "core", v: ["V2", 6], focus: "Hip abductors, obliques, spinal extensors", cues: ["Hips forward and high, straight posture", "Feet dorsiflexed (toes to shins)"], prog: "Legs apart (c07) → reach-through (c11)" },
  c07: { n: "Side plank, legs apart", p: "core", v: ["V2", 7], focus: "Same chain, wider base = more load through obliques/abductors", cues: ["Straight line, hips high", "Wider feet than side plank"], prog: "Lift top leg with brief hold; open side plank (c12)" },
  c08: { n: "Seated alternating leg raises", p: "core", v: ["V2", 8], focus: "Hip flexors, deep abdominals, spinal extensors", cues: ["Back straight, head up", "Straight leg, brief hold at top"], prog: "Less arm support → one hand → no hands" },
  c09: { n: "Copenhagen plank", p: "core", v: ["V2", 9], focus: "Hip adductors, obliques", cues: ["Top leg's foot rests just under the upper knee", "Hold a horizontal line, chest out, hips forward"], prog: "Lower & lift hips (c16). Easier first: working foot on floor" },
  // ---- CORE PROGRESSIONS (V5, 7) ----
  c10: { n: "Knee-to-elbow Spiderman climbs", p: "core", v: ["V5", 1], focus: "Deep core, obliques, hip flexors, shoulder girdle", cues: ["Start from elbow-front plank", "Bring elbow to knee alternately left/right", "No pelvis rotation — straight head-to-feet line"], prog: "Slower tempo, bigger range" },
  c11: { n: "Side plank reach-through (rotated)", p: "core", v: ["V5", 2], focus: "Hip abductors, obliques, lumbar/thoracic rotators", cues: ["Hips forward, straight posture, feet dorsiflexed", "Bring arm under the body in a big arc to a full high reach"], prog: "—" },
  c12: { n: "Open side plank with arm & hip flexion/extension", p: "core", v: ["V5", 3], focus: "Core + hip coordination, obliques, abductors", cues: ["Elbow to knee, then knee to elbow", "Extend to fully straight with legs held wide"], prog: "—" },
  c13: { n: "Crouching alternate hip rotations with arm raises", p: "core", v: ["V5", 4], focus: "Hip & lumbar rotators, obliques, unilateral stability", cues: ["Twist lower hips toward the floor, one-arm support", "Hold briefly each side, don't hold your breath"], prog: "—" },
  c14: { n: "Seated glute lift & resisted hip thrust", p: "core", v: ["V5", 5], focus: "Hip extensors/rotators, deep abs, lumbar stabilisers", cues: ["Lower slowly, light hip touch to floor", "Drive up thrusting hips forward, hold weight stable on hips"], prog: "Light bag on hips (U10: a filled backpack)" },
  c15: { n: "90-90 rotations with hip thrusts", p: "core", v: ["V5", 6], focus: "Lumbar rotators, hip extensors, deep core", cues: ["Rotate 90-90 left/right, drive up quickly at the end of each rotation", "Straight lumbar spine, chest out, head up"], prog: "—" },
  c16: { n: "Copenhagen plank with lowering & lifting", p: "core", v: ["V5", 7], focus: "Hip adductors, obliques, spinal stabilisers", cues: ["Lower the lower hip slowly to the floor, drive back up", "Chest out, hips forward, arm can reach under → overhead"], prog: "—" },

  // ---- LOWER-BODY STRENGTH (V3, 8) ----
  l01: { n: "Split squat / static lunge", p: "lbs", v: ["V3", 1], focus: "Quads, glutes, hamstrings, deep core", cues: ["Head up, back neutral", "Lower until rear knee lightly touches", "Drive up through the midfoot"], prog: "Front foot on lowest ladder rung; → reverse lunge (l02)" },
  l02: { n: "Alternating reverse split lunge", p: "lbs", v: ["V3", 2], focus: "Same chain + balance/stability", cues: ["Step back under control, don't collapse into the hip", "Keep torso tall throughout"], prog: "Hold a light bag at shoulder height (P3+)" },
  l03: { n: "Overhead reverse split lunge with reach", p: "lbs", v: ["V3", 3], focus: "Lunge + upper-body stabilisation, core", cues: ["Arms fixed overhead the whole time", "Smooth, controlled step back"], prog: "Single-arm overhead reach" },
  l04: { n: "Bulgarian split squat (rear foot on ladder)", p: "lbs", v: ["V3", 4], focus: "Unilateral leg strength", cues: ["Rear foot on ladder rung", "Tilt slightly forward, drive up through front midfoot"], prog: "Lower the step = longer range of motion" },
  l05: { n: "Single-leg skater squat (onto box)", p: "lbs", v: ["V3", 5], focus: "Single-leg strength + balance", cues: ["Squat toward the box on one leg", "Tap/seat at target depth, drive back with the same leg"], prog: "Gradually lower the box toward the floor" },
  l06: { n: "Modified pistol squat (onto box)", p: "lbs", v: ["V3", 6], focus: "Single-leg strength through full range", cues: ["Arms out, free leg straight off the floor", "Sit back onto box, stand up without double-bouncing"], prog: "Lower the box; keep free leg off floor. Easier: free heel taps floor" },
  l07: { n: "Single-leg step-down (from box)", p: "lbs", v: ["V3", 7], focus: "Single-leg control, landing stabilisers", cues: ["Lower free foot to lightly touch floor with control", "Knee tracks over toes, hips level"], prog: "Higher step; slide free foot forward on contact" },
  l08: { n: "Alternating side lunge (strength version)", p: "lbs", v: ["V3", 8], focus: "Lateral plane — adductors/abductors", cues: ["Neutral spine, chest out, elbows up", "Sit deep, both feet flat"], prog: "Hold a light bag with straight arms" },

  // ---- EXPLOSIVITY (V4, 6) ----
  p01: { n: "Sprinter power steps with strong arms", p: "power", v: ["V4", 1], focus: "Full-chain linear power", cues: ["Quality of the linear movement first", "Drive hard with the arms", "Brief hold at end of range"], prog: "Sprinter jumps; Bulgarian split jumps" },
  p02: { n: "Double-leg box jump, stiff legs + driving arms", p: "power", v: ["V4", 2], focus: "Ankle/knee/hip extensors", cues: ["Set position, only a slight countermovement", "Drive up onto the box, hold the landing quietly"], prog: "Increase height (mat behind box); single-leg from low height" },
  p03: { n: "Double-leg box jump with rotation", p: "power", v: ["V4", 3], focus: "Same + hip/spinal rotation under landing", cues: ["Same as box jump, rotate torso to land facing the turn", "Land quiet, hold"], prog: "Higher rotation demands only when landings are silent" },
  p04: { n: "Double-leg broad jump with countermovement", p: "power", v: ["V4", 4], focus: "Horizontal power", cues: ["Set → power forward for max distance", "Quick backward countermovement, drive forward again (1–2 continuous reps)"], prog: "Single-leg broad jumps (P4, 2–3 reps)" },
  p05: { n: "Single-leg lateral counter jumps L↔R (light load)", p: "power", v: ["V4", 5], focus: "Lateral + single-leg power, landing stabilisers", cues: ["Drive laterally for max distance", "Quick counter back to start", "U10 load = light backpack only, and only when unloaded is clean"], prog: "Increased rotation (arms beyond landing line)" },
  p06: { n: "Single-leg lateral counter, unloaded, fast", p: "power", v: ["V4", 6], focus: "Speed of landing + lateral reset", cues: ["Emphasis on SPEED of landing and countermovement", "Arms swing beyond the line"], prog: "Faster counter — never louder landing" },

  // ---- STRENGTH/MOBILITY COMBOS (article 8 — demo live, no video) ----
  x01: { n: "Curtsy squat → side lunge", p: "combo", v: null, focus: "Knee/hip extensors, glute med of curtsy leg, adductors + deep core", cues: ["Big step out to the side, other leg straight", "Cross back leg behind, knee toward floor on the ball of the foot", "Drive up INTO the side lunge", "U10: bodyweight first; resistance (partner hand / bag) at chest height only when perfect"], prog: "Add light resistance once bodyweight is clean" },
  x02: { n: "Forward lunge with rotational twist", p: "combo", v: null, focus: "Quads, glutes, deep abs, lumbar rotators", cues: ["Head up, chest out, neutral back", "Rotate with bent arms at chest height, turn the head with the hands", "Light knee touch, drive up through glutes + core rotators"], prog: "Add light resistance once bodyweight is clean" },
  x03: { n: "Pillar single-leg Romanian deadlift", p: "combo", v: null, focus: "Hip extensors, lumbar extensors, balance", cues: ["Pivot from hips, flat lower back, rear leg straight behind", "Drive up in ONE movement, arms to chest then full extension"], prog: "Small load only once stable and controlled start-to-finish" },
  x04: { n: "High-step forward lunge + rotational high reach", p: "combo", v: null, focus: "Quads, glutes, lumbar/thoracic rotators (accel → decel)", cues: ["Start far enough from the box/step to avoid over-reaching", "Strong drive from rear hip & knee stepping high", "Finish with a strong rotational high reach"], prog: "Prerequisite: x02 mastered. Add light load later" },
  x05: { n: "Single-leg glute-ham lift, shoulders on box", p: "combo", v: null, focus: "Glutes, spinal extensors, transverse abs (horizontal)", cues: ["Lie horizontal, shoulders on box/mattress edge", "Fully extend the working leg while flexing hip of free leg, hold briefly"], prog: "Light resistance across the hip of the working leg" },
  x06: { n: "Rotational press-up", p: "combo", v: null, focus: "Upper body + thoracic/lumbar rotators, whole core", cues: ["Press up and rotate into a big-arc overhead reach, straight back", "Control the descent — don't let the weight drop"], prog: "No resistance at first; small hand weights only once the back stays straight" }
};

// ---- WARM-UP SETS (whole group, every session — FIFA pre-training dose: 8–9 ex × 6–10 reps, ~10 min) ----
const WUS = {
  A: { name: "Set A — hips & spine basics (Phase 1)", ex: ["m09", "m03", "m04", "m05", "m08", "m10", "m11", "m12"] },
  B: { name: "Set B — adds moving stability (Phase 2)", ex: ["m02", "m05", "m11", "m06", "m12", "m08", "m10", "m07", "m13"] },
  C: { name: "Set C — full battery (Phases 3–4)", ex: ["m09", "m10", "m06", "m07", "m13", "m05", "m11", "m04", "m01"] }
};

// ---- MENUS ----
// kind: core | lbs | power ; ex: [{id, dose}] ; rounds/rest as string
const MENUS = {
  coreBase1: { name: "Core 1 — stability base", kind: "core", rounds: "2 rounds", rest: "45 s between exercises, 90 s between rounds",
    ex: [ { id: "c01", dose: "20–30 s hold" }, { id: "c06", dose: "15–20 s / side" }, { id: "c04", dose: "8 reps" }, { id: "c05", dose: "20 s fast march" }, { id: "c08", dose: "8 / leg" }, { id: "c03", dose: "10 alternations" } ] },
  coreBase2: { name: "Core 2 — longer holds, sharper tempo", kind: "core", rounds: "2 rounds", rest: "45 s between exercises, 90 s between rounds",
    ex: [ { id: "c01", dose: "30–40 s hold" }, { id: "c02", dose: "8 alternations" }, { id: "c06", dose: "20–25 s / side" }, { id: "c04", dose: "10 reps" }, { id: "c08", dose: "10 / leg, less arm support" }, { id: "c05", dose: "walk version, 10 m there + back" } ] },
  coreBuild: { name: "Core 3 — build: side plank family + Copenhagen", kind: "core", rounds: "2 rounds", rest: "45 s between exercises, 2 min between rounds",
    ex: [ { id: "c02", dose: "10 alternations" }, { id: "c07", dose: "20 s / side" }, { id: "c09", dose: "15–20 s / side (foot on floor first weeks)" }, { id: "c04", dose: "10 reps" }, { id: "c08", dose: "10 / leg" }, { id: "c03", dose: "10 alternations + 3 s hold" } ] },
  coreRot1: { name: "Core 4 — rotation block A", kind: "core", rounds: "2 rounds", rest: "45 s between exercises, 2 min between rounds",
    ex: [ { id: "c11", dose: "8 / side" }, { id: "c12", dose: "6 / side" }, { id: "c10", dose: "8 alternations" }, { id: "c15", dose: "6 / side" }, { id: "c09", dose: "20 s / side" }, { id: "c16", dose: "5 / side (foot on floor)" } ] },
  coreRot2: { name: "Core 5 — rotation block B", kind: "core", rounds: "2 rounds", rest: "40 s between exercises, 2 min between rounds",
    ex: [ { id: "c10", dose: "10 alternations" }, { id: "c13", dose: "6 / side" }, { id: "c14", dose: "8 reps" }, { id: "c15", dose: "8 / side" }, { id: "c11", dose: "10 / side" }, { id: "c16", dose: "8 / side (shin on low box/ladder)" } ] },
  coreExpress: { name: "Core 6 — player-built menu", kind: "core", rounds: "2 rounds", rest: "players set their own (coach checks: min 30 s)",
    note: "Each player picks 6 from the entire core library (see <a href='exercises.html'>exercise library</a>): <b>1 anti-rotation hold</b> (plank/side-plank family) + <b>1 hip hinge/glute</b> (glute-ham, superman, glute lift) + <b>1 rotation</b> (Spiderman, reach-through, 90-90 thrust, crouch rotation) + <b>3 free picks</b> (their weaknesses encouraged). Doses: 8–12 reps or 20–30 s holds. Assistant screens the sheet before it runs.",
    ex: [] },
  lbsBase1: { name: "Legs 1 — bilateral basics", kind: "lbs", rounds: "2 sets", rest: "60 s between exercises",
    ex: [ { id: "l01", dose: "6 / leg" }, { id: "l02", dose: "6 / leg" }, { id: "l07", dose: "6 / leg — LOW box (lowest setting)" }, { id: "l08", dose: "6 / side" } ] },
  lbsBase2: { name: "Legs 2 — basics with range", kind: "lbs", rounds: "2 sets", rest: "60–75 s between exercises",
    ex: [ { id: "l01", dose: "6 / leg — front foot on lowest ladder rung" }, { id: "l02", dose: "6 / leg, slow 3 s down" }, { id: "l07", dose: "6 / leg — raise box one notch" }, { id: "l08", dose: "6 / side, sit deeper" }, { id: "l05", dose: "4 / leg — squat onto HIGH box (intro)" } ] },
  lbsUni1: { name: "Legs 3 — unilateral intro", kind: "lbs", rounds: "2 sets", rest: "75 s between exercises",
    ex: [ { id: "l04", dose: "5 / leg — rear foot on ladder" }, { id: "l06", dose: "4 / leg — onto HIGH box" }, { id: "l05", dose: "5 / leg — mid box" }, { id: "l07", dose: "5 / leg — mid box" }, { id: "l08", dose: "6 / side" } ] },
  lbsUni2: { name: "Legs 4 — unilateral depth", kind: "lbs", rounds: "2–3 sets", rest: "90 s between exercises",
    ex: [ { id: "l04", dose: "6 / leg — lower ladder rung" }, { id: "l06", dose: "5 / leg — lower box than last week" }, { id: "l05", dose: "5 / leg — lower box" }, { id: "l07", dose: "6 / leg — higher step" }, { id: "l08", dose: "6 / side + light bag" } ] },
  lbsRot1: { name: "Legs 5 — rotation & control", kind: "lbs", rounds: "2 sets", rest: "75 s between exercises",
    ex: [ { id: "l03", dose: "5 / leg" }, { id: "l05", dose: "5 / leg — deep" }, { id: "l08", dose: "6 / side + light bag" }, { id: "x01", dose: "5 / side — bodyweight" }, { id: "l07", dose: "6 / leg" } ] },
  lbsRot2: { name: "Legs 6 — rotation block B", kind: "lbs", rounds: "2 sets", rest: "75–90 s between exercises",
    ex: [ { id: "l03", dose: "6 / leg" }, { id: "l06", dose: "5 / leg — deepest controlled" }, { id: "x02", dose: "5 / side — bodyweight" }, { id: "x03", dose: "5 / leg" }, { id: "l08", dose: "6 / side" } ] },
  lbsExpress: { name: "Legs 7 — combine & express (combo circuit)", kind: "lbs", rounds: "2–3 rounds", rest: "90 s between exercises",
    ex: [ { id: "x01", dose: "5 / side" }, { id: "x02", dose: "5 / side" }, { id: "x03", dose: "5 / leg" }, { id: "x04", dose: "4 / leg — step/low box" }, { id: "x05", dose: "5 / leg — shoulders on mattress stack" }, { id: "x06", dose: "5 (no load)" } ] },

  prep1: { name: "Movement prep & landing school (Phase 1 — no jumping yet)", kind: "power", rounds: "3 blocks", rest: "full catch-breath between blocks",
    ex: [ { id: "p01", dose: "3 blocks × 3 / leg — slow, big arm drive, FREEZE at end of each step" }, { id: "m06", dose: "4 / side — plank-to-lunge as the 'absorb' pattern" }, { id: "l07", dose: "3 / leg from LOW box — silent step-down landing drill" } ] },
  powA: { name: "Power A — forward focus (intro)", kind: "power", rounds: "see per exercise", rest: "60–90 s between sets — long rests are the point",
    ex: [ { id: "p01", dose: "2 × 3 / leg" }, { id: "p02", dose: "2 × 3 — LOW box only, mattresses around/in front" }, { id: "p04", dose: "2 × 3 — reset each jump" } ] },
  powB: { name: "Power B — lateral & rotation", kind: "power", rounds: "see per exercise", rest: "90 s between sets",
    ex: [ { id: "p02", dose: "2 × 3 — box up 1 notch if landings were silent" }, { id: "p03", dose: "2 × 3 — LOW box, 90° turn" }, { id: "p04", dose: "2 × 2 continuous" }, { id: "p06", dose: "2 × 3 / side" } ] },
  powC: { name: "Power C — express, max intent", kind: "power", rounds: "see per exercise", rest: "90–120 s between sets",
    ex: [ { id: "p03", dose: "3 × 3 — highest box with silent landings" }, { id: "p05", dose: "2 × 3 / side — light bag ONLY if p06 is perfect" }, { id: "p06", dose: "3 × 3 / side — fastest counter" }, { id: "p04", dose: "2 × 3 (P4 stretch: 2 × 2 single-leg)" } ] }
};

// ---- GAMES (ball stations & 3rd-group play — 1–2 balls each, fun + competition) ----
const GAMES = {
  rondo41: { n: "Rondo ladder 4v1 → 5v1 → 5v2", balls: "1", how: "4–5 players keep the ball inside a 5–6 m square, 1–2 in the middle. Score = 3 clean passes → rotate defenders in. Max 2 touches when confident, 3 touches while learning.", space: "One curtain zone, cone square" },
  boxgame: { n: "Box game 3v3 / 4v4", balls: "1", how: "Play inside an 8×8 m box with a small goal (or flag goals) on each end. A goal counts only from inside the box. Everyone plays everywhere.", space: "One zone, 2 small goals + 4 cones" },
  king: { n: "King of the box", balls: "1", how: "4v4, one ball, max 6 passes per attack — goals must come from a live move, not a kick-off. Winners stay on, losers run the next challenge.", space: "One zone, 2 small goals" },
  shadow: { n: "Shadow races", balls: "0", how: "Pairs: mirror-tag inside a 6×6 m grid, 30 s rounds; loser collects cones. Pure change-of-direction fun — no jumping.", space: "One zone, cones" },
  gauntlet: { n: "Obstacle-course relay (makeshift)", balls: "0–1", how: "Ladder feet → 6 hurdles (step-over, don't knock) → box step-up/down → rope hang 5 s → sprint to mattress and stick a frozen plank for 3 s. Team relay, rotate roles.", space: "Full width of one zone" },
  ropegames: { n: "Rope games", balls: "0", how: "Hanging-rope circuit: 10 s hangs, knee tucks (feet optional on mats), partner 'saw', team tug 3×8 s pulls. Grip + shoulder + pure fun.", space: "Ropes area, mats under" },
  minileague: { n: "Mini-league 3v3 / 4v4", balls: "1–2", how: "Small-sided tournament across two zones with 6 small goals; 3-min matches, points table on the wall.", space: "Two zones, 4–6 small goals" },
  duel1v1: { n: "1v1 duel square", balls: "2", how: "3×3 m squares, 45 s duels, coach feeds balls in one at a time. Count wins; winner stays.", space: "Corners of ball zone" },
  pasquare: { n: "Passing squares 2v2 / 3v3", balls: "1 per pair", how: "Two lines of passing targets, receive-turn-pass. Up to 10 balls = 10 players at 1:1.", space: "Ball zone" },
  tethers: { n: "Free play + weekly challenge", balls: "2", how: "Free play in zone with a 3-touch rule; last 3 min of the block = weekly challenge (crossbar, keep-away 90 s, longest volley).", space: "One zone" }
};

// ---- PHASES (overview text for the plan page) ----
const PHASES = [
  { id: "P1", wks: "1–6", cls: "p1", name: "Foundation & movement literacy",
    goal: "Own the technique of the basics before anything gets harder. Nothing is rushed: quality is the only gate.",
    points: ["Mobility Set A every warm-up — teach posture with names and cues", "Core: plank family, glute-ham, march, seated raises (Core 1 → 2)", "Legs: bilateral lunges, step-downs from the LOW box (Legs 1 → 2)", "Power slot = landing school & speed games — NO jumping yet", "W6 = first test: timed core circuit + movement gate checklist"] },
  { id: "P2", wks: "7–12", cls: "p2", name: "Build strength, introduce power",
    goal: "One leg, more range — and the first real jumps, on a fresh nervous system.",
    points: ["Mobility Set B — plank-travelling patterns added", "Core: side-plank legs apart + Copenhagen plank (Core 3)", "Legs: Bulgarian on ladder, pistol & skater onto boxes (Legs 3 → 4)", "Whole-group power microdose starts: power steps, low box jumps, broad jumps", "W12 = test + re-test vs W6 (video the same drills)"] },
  { id: "P3", wks: "13–18", cls: "p3", name: "Rotate & control",
    goal: "Rotation is football: press, cut, land, turn. Core progressions and the resisted-combo family enter the plan.",
    points: ["Mobility Set C — full battery incl. World's greatest stretch", "Core: Spiderman, reach-throughs, 90-90 thrusts, Copenhagen lower/lift (Core 4 → 5)", "Legs: overhead reverse lunges + first combos, curtsy→side lunge & lunge twist (Legs 5 → 6)", "Power: rotation box jumps + fast lateral counters (Power B)", "W18 = test + re-test vs W6/W12"] },
  { id: "P4", wks: "19–24", cls: "p4", name: "Express & combine",
    goal: "Everything together: full-body combos, max-intent power, and players owning their own circuit.",
    points: ["Mobility: players self-select 9 from Set C and lead a warm-up rep", "Core: player-built menu (Core 6) + partner challenges", "Legs: the six combos as a circuit (Legs 7) — bodyweight mastery, light load only if perfect", "Power C: highest silent-landing box, fastest counters (Power C)", "W23 = final test battery; W24 = festival + season review"] }
];
