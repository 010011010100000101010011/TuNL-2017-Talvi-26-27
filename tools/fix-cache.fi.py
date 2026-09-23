#!/usr/bin/env python3
# Manual correction pass over tools/translation-cache.fi.json:
# fixes mistranslated registry names + specific strings, and re-syncs the old FI names embedded
# inside already-translated prose. Run: python3 tools/fix-cache.fi.py  (then re-run translate-fi.mjs, then check-parity.mjs)
import json, os
p = os.path.join(os.path.dirname(__file__), "translation-cache.fi.json")
c = json.load(open(p))

NAME_FIXES = {
  "Legs 1 — bilateral basics": "Reidet 1 – perusliikkeet molemmille jaloille",
  "Legs 2 — basics with range": "Reidet 2 – perusliikkeet isommalla liikeradalla",
  "Legs 3 — unilateral intro": "Reidet 3 – yksijalkaisten alkeet",
  "Legs 4 — unilateral depth": "Reidet 4 – yksijalka, syvempään",
  "Legs 5 — rotation & control": "Reidet 5 – kierto ja hallinta",
  "Legs 6 — rotation block B": "Reidet 6 – kiertolohko B",
  "Legs 7 — combine & express (combo circuit)": "Reidet 7 – yhdistä ja ilmaise (kombinaatiopiiri)",
  "Core 2 — longer holds, sharper tempo": "Ydin 2 – pidemmät pito, terävämpi tempo",
  "Core 3 — build: side plank family + Copenhagen": "Ydin 3 – rakennus: sivulankkuperhe + Kööpenhamina",
  "Core 4 — rotation block A": "Ydin 4 – kiertolohko A",
  "Core 5 — rotation block B": "Ydin 5 – kiertolohko B",
  "Core 6 — player-built menu": "Ydin 6 – pelaajan kokoama valikko",
  "Power A — forward focus (intro)": "Teho A – eteenpaino (intro)",
  "Power B — lateral & rotation": "Teho B – sivu ja kierto",
  "Power C — express, max intent": "Teho C – ilmaisu, maksimiteho",
  "Movement prep & landing school (Phase 1 — no jumping yet)": "Alkuvalmistelu ja laskeutumiskoulu (vaihe 1 – ei vielä hyppyjä)",
  "Build strength, introduce power": "Rakenna voimaa, lisää tehoa",
  "Rotate & control": "Kierto ja hallinta",
  "Express & combine": "Ilmaisu ja kombinaatiot",
  "Set A — hips & spine basics (Phase 1)": "Sarja A – lantion ja selkärangan perusliikkeet (vaihe 1)",
  "Set B — adds moving stability (Phase 2)": "Sarja B – lisää liikkuva vakaus (vaihe 2)",
  "Set C — full battery (Phases 3–4)": "Sarja C – koko paketti (vaiheet 3–4)",
  "Copenhagen plank": "Kööpenhaminan lankku",
  "Copenhagen plank with lowering & lifting": "Kööpenhaminan lankku: lasku ja nousu",
  "King of the box": "Laatikon kuningas",
  "Box game 3v3 / 4v4": "Laatikkopeli 3v3 / 4v4",
  "1v1 duel square": "1v1-kaksintaisteluneliö",
  "Passing squares 2v2 / 3v3": "Syöttöneliöt 2v2 / 3v3",
  "Mini-league 3v3 / 4v4": "Miniliiga 3v3 / 4v4",
  "Obstacle-course relay (makeshift)": "Estaviesti (yksinkertainen rata)",
  "Alternating superman": "Vaihteleva supermies",
  "Knee-to-elbow Spiderman climbs": "Spiderman-kiipeily: polvi kyynärpäähän",
  "Runner lunge to hamstring shift": "Juoksija-askel → takareiden siirto",
  "Pillar single-leg Romanian deadlift": "Yksijalkainen romanialainen maastaveto (pillar-tuki)",
  "Prone isometric hold (plank)": "Makaava isometrinen pito (lankku)",
  "Frog-pose with rotation": "Sammakkoasento kierrolla",
  "Curtsy squat → side lunge": "Curtsy-kyykky → sivuaskelkyykky",
  "Modified pistol squat (onto box)": "Muunnettu pistol-kyykky (laatikolle)",
  "Alternating side lunge": "Vuorottainen sivuaskelkyykky",
  "Alternating side lunge (strength version)": "Vuorottainen sivuaskelkyykky (vahvuusversio)",
  "Open side plank with arm & hip flexion/extension": "Avoin sivulankku: käden ja lonkan koukistus/ojennus",
  "Overhead reverse split lunge with reach": "Pään-yläpuolella-takaskelkyykky + ojennus",
  "Single-leg skater squat (onto box)": "Yksijalkainen luistelijakyykky (laatikolle)",
  "Double-leg broad jump with countermovement": "Kaksijalkainen pituushyppy vastaliikkeellä",
  "Double-leg box jump with rotation": "Kaksijalkainen laatikkohyppy kierrolla",
  "Double-leg box jump, stiff legs + driving arms": "Kaksijalkainen laatikkohyppy, jäykät jalat + käsien työnnys",
  "Forward lunge with rotational twist": "Eteenaskel vartalon kierrolla",
  "Plank to straight-leg hip flexion & adduction": "Lankusta suorajalkainen lonkan koukistus ja lähennys",
  "Single-leg lateral counter jumps L↔R (light load)": "Yksijalkaiset sivuttaiset vastahypyt V↔O (kevyt kuorma)",
  "Single-leg lateral counter, unloaded, fast": "Yksijalkainen sivuttainen vastatoisto, kuormaton, nopea",
  "Extended-arms plank to extended lunge": "Suorakätälankku → pitkä askel",
  "Pigeon stretch with external hip rotation": "Kyyhkysvenytys ulkokierrolla",
  "Rotational press-up": "Punnerrus + kierto",
  "Glute-hamstring lift": "Pakara-takareisinosto",
  "High-step forward lunge + rotational high reach": "Korkea eteenaskel + kierto yläojennuksella",
}

STRING_FIXES = {
  "Lift top leg with brief hold; open side plank (c12)": "Nosta yläjalka ja pidä hetki; avoin sivulankku (c12)",
  "Lower & lift hips (c16). Easier first: working foot on floor": "Laske ja nosta lantio (c16). Helpotus ensin: työskentelevä jalka lattialla",
  "Rotate 90-90 left/right, drive up quickly at the end of each rotation": "Kierrä 90-90 vasen/oikea, nouse räjähdysmäisesti pystyyn jokaisen kierron lopuksi",
  "2 × 3 — box up 1 notch if landings were silent": "2 × 3 – nosta laatikkoa yhdellä pykälällä, jos laskeutumiset olivat äänettömiä",
  "Core 5 as 40-s circuit rounds — engine + posture": "Ydin 5 – 40 s:n piirierät – moottori + ryhti",
  "Explain your 4-combo choice in one sentence. Then run it.": "Selitä 4 kombinaation valintasi yhdellä lauseella. Suorita sitten valintasi.",
  "All six FIFA strength/mobility <b>combos</b> are now on the menu (curtsy→side lunge, lunge twist, pillar RDL, high-step reach, single-leg glute-ham on box, rotational press-up). Bodyweight standard only — light backpack/partner-hand load is a personal gate decision, never a group one. Power C enters with intent.":
    "Kaikki kuusi FIFA:n voima- ja liikkuvuus<b>kombinaatiota</b> ovat nyt valikossa (curtsy→sivuaskelkyykky, askelkierto, pillar-RDL, korkea askel + ojennus, yksijalkainen pakara-ham laatikolla, punnerrus + kierto). Vain kehonpainotaso – kevyt reppu/kaverin käsi -kuorma on henkilökohtainen portkipäätös, ei ryhmän. Teho C tulee mukaan tähdäten.",
}

old_to_new = {}
for en, fi in NAME_FIXES.items():
    if en in c["names"]:
        if c["names"][en] != fi:
            old_to_new[c["names"][en]] = fi
        c["names"][en] = fi
        c["strings"][en] = fi

for en, fi in STRING_FIXES.items():
    c["strings"][en] = fi

for k in list(c["strings"].keys()):
    if k in NAME_FIXES:
        continue
    v = c["strings"][k]
    for old, new in old_to_new.items():
        if old in v:
            v = v.replace(old, new)
    c["strings"][k] = v

c["sig"] = ""
json.dump(c, open(p, "w"), ensure_ascii=False, indent=1)
print(f"applied {len(NAME_FIXES)} name fixes, {len(STRING_FIXES)} string fixes, propagated {len(old_to_new)} renames into {len(c['strings'])} strings")
