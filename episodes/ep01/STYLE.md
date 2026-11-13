# EP01 "The World We Know": style guide (all set agents MUST follow)

Series look: read `/home/user/kiamat/VISUAL-STYLE.md` first (all sections, especially §2 detail budget, §3 composition, §4b bright mode, §5 characters, §7 tech rules). This file adds the episode specifics.

## Story beat
A modern Indonesian-style megacity in 2026, one ordinary day from dawn to night. Nothing supernatural, nothing destroyed. The unease comes from ordinary things: towers racing upward, a news feed full of bad news that is swiped away, time slipping. Grounded, documentary compositions, cinematic light.

## Palette (one per light mode; the shot's `light` field in episode.json tells you which)
- **Dawn (shot 1):** sky `#141a3a` → `#3b3466` → `#c7768a` → `#f4b98a` at the horizon. Silhouettes `#0c0f22` near, `#1c2142` mid, `#3a3a63` far. Lit windows `#ffd58a`.
- **Day, harsh and hazy (shots 2, 3, 4, 5):** sky `#9fb8c9` → `#d6dfe2` → `#f1ead8` (pale, almost white near the sun). Concrete `#b8b2a6` / shade `#7d786f`. Asphalt `#5d5b58`. Vegetation `#4d5a49`. Hard shadows: dark warm brown at opacity .2–.35. Foreground framing elements darker and cooler (`#3a4048`).
- **Dusk (shots 6, 7):** sky `#f0b27a` → `#d9785f` → `#6a3f63` → `#1f1d3d` at the top. Silhouettes `#1a1530` / `#2b2344`. Rim warm `#ffc28a`. Street lamp `#ffd27a`.
- **Night (shots 8, 9, 10):** sky `#05070f` → `#0d1222` → `#18203a`. Silhouettes `#04050a` / `#0b0e1a`. Windows `#ffcf86` (warm) and `#bfe3ff` (TV/phone cool). Star `#fff6dc`.
- **Phone UI (shots 4, 5, 10):** screen background `#f4f2ee` (day) / `#14161c` (night); cards `#ffffff` / `#20232b`; headline bars `#2b2d33` at 60% (day) or `#c9ccd4` at 50% (night); photo blocks as blurred gradient rectangles. **No logos, no real app UI copy, no readable real names or places.** Generic short words are fine (e.g. "BREAKING", "Forwarded many times").
- **Accent `#d9a441`** (old gold): caption keywords, the source label, and "EPISODE 01".

## Characters (no detailed faces)
- Crowds: simple silhouettes (motorbike riders with helmets, pedestrians), eerie only by quantity and repetition. Never more than a few individual figures in close view.
- Hands (shots 4, 5): adult hand, mitten construction with 1–2 finger separations, warm skin `#b07a5e` / shade `#7a4f3e`, sleeve of a work shirt `#3c4a5c`. Two hands visible only if it reads naturally; one hand holding the phone is fine.
- No identifiable real people, no real landmarks, no real brands. Mosque: generic minaret and dome, respectful, no text.

## Sets and ownership (v3: 25 shots, real VO timing, 76 s)
v3 (13 Nov): new hook, clear news headlines, title card, sound-synced actions. Shot ids changed AGAIN; `episode.json` field `was_v2` maps each new shot to its v2 shot id (null = new). Components are named by the NEW id (`S01`..`S25`) and exported from the owner file. **Rename every export to the new id and remove stale ones**: `src/shots/index.ts` picks components by name, so a stale export with a reused id would show the WRONG scene.

Every shot has a `sync` list in `episode.json`: the listed VO words are where its key actions MUST land (use `wordAt(id, /word/i, fallback)`, start of the word). Sound effects are placed on exactly those words, so do not move an action off its sync word.

| Set | Owner file | Shots (new ids) | Changes in v3 |
|---|---|---|---|
| `home` | `H.tsx` | 1, 2, 4, 5, 18 | NEW hook shot 1 (phone on the blanket flooding with BREAKING notifications; you may import the phone/notification components from `src/art/screen_phone.tsx` read-only, or draw your own). Shot 2 = old slap shot (slap on "slowly"). 4, 5, 18 = old kitchen, carport, dinner. |
| `city` + `train` | `C.tsx`, `T.tsx` | 3, 6, 15, 21, 22, 23 · 8 | NEW shot 6 (minaret with loudspeakers, tilt down to an old man in sarong + peci walking to the mosque with a prayer mat, birds lift on "rises", phone glows in windows on "hundred"). Shot 22: separate the man's head from the minaret. |
| `street` | `S.tsx` | 7, 9, 10, 14, 16, 19, 20 | Shot 9: worker bigger (≥20% of frame height), crane hook clank on "rising". Shot 14: bigger pedestrians. Shot 19: fix the two overlapping walkers. Shot 20: bus passes on "slipping". |
| `screen` | `P.tsx` | 11, 12, 13, 17, 24, 25 | News rebuilt with the REAL headlines below (11 and NEW 12). 13 swipes real headline cards. 24 ends with a hard cut to black (no EPISODE card). NEW 25 = title card. |

## Headlines (exact text; generic and fictional: no real places, people, organisations, outlets or logos)
Card style: white (day) card, a small red tag ("BREAKING" / "LIVE" / "WAR" / "UPDATE"), the headline in bold dark sans (Inter or Roboto via @remotion/google-fonts, ≥ 34 px at frame scale when full-screen, ≥ 26 px inside the OTS phone), a grey "2m ago"-style timestamp, and a simple illustrated thumbnail (silhouettes, no gore: rubble and dust, smoke over a skyline, rows of tents, a burning car, a crowd running, a man in a suit in front of microphones).
- Hook notifications (shot 1, stacked lock-screen style, newest on top): "BREAKING · 7.4 earthquake strikes coastal region" · "Death toll passes 12,000" · "Airstrikes hit refugee camp overnight" · "Rights group warns of genocide" · "Floods sweep away entire villages".
- Shot 11: on "earthquake": **BREAKING** "7.4 quake flattens coastal towns, thousands missing" · on "war": **WAR** "Airstrikes hit refugee camp overnight".
- Shot 12: on "Whole": **BREAKING** "Rights group warns of genocide as entire families are wiped out" · on "life": "Man stabbed to death over a $12 debt" · on "trusted": **UPDATE** "Official arrested for stealing disaster relief funds" · flurry after "betrays": "Wildfires force 80,000 to flee" / "Famine declared in three provinces" / "Ceasefire collapses after 48 hours".
- Shot 13 and 24 may reuse these. Shot 24 notification: "Forwarded many times" (keep).

## Title card (shot 25, ~4.2 s, black, no caption)
- Main title "THE BEGINNING OF THE END": Cinzel (600–700), off-white `#f1ead8`, letter-spaced, two lines if needed, inside the 920 px safe width, centred slightly above the middle; a soft gold radial glow behind (radial gradient, no filters).
- Under it, after a thin gold rule: "CHAPTER 1 · THE LAST DAYS" small, wide letter-spacing, `#d9a441`.
- Timing: main title fades/rises in from 0.25 s (stagger by word is fine), subtitle from ~1.1 s; everything fully visible ≥ 1.5 s before the end. Very slow push-in; a few drifting dust motes (on ones). A deep boom lands on the first frame (sound).

## Make it ALIVE (applies to every shot)
- The camera is never dead still: slow push/drift/parallax on ones, handheld breathing for intimate shots, a small jolt on impacts.
- Secondary motion everywhere: people breathe and shift weight (twos), cloth/hair/laundry/curtains move, steam, dust motes in light beams, birds, distant traffic and pedestrians, flickering signs, blinking aircraft lights.
- Actions land on their sync words; give them anticipation and follow-through (a hand pulls back before the slap; the screen jumps when the phone is hit).
- Short shots (1.5–2 s) must read in the first 0.3 s: the hero is already in frame and moving at frame 0.

## People (the heart of the episode)
- Every human shot shows a specific action with readable body language. Posture and hands tell the story; faces stay simple (no detailed features), seen from the side, back, or as silhouettes.
- Indonesian everyday look: work jackets, batik or plain shirts, headscarves, peci for older men, school uniforms, helmets. Modest, ordinary, believable.
- Construction (VISUAL-STYLE §5): head ≈ 1/7 of an adult, 1/5 of a child; shoulders wider than waist; tapered limbs with elbow/knee bends; mitten hands with 1–2 finger separations.
- **Characters animate ON TWOS** (`p2`/`t2`/`f2` from `useShot()`); camera and environment ON ONES (`p`/`t`/`f`). Breathing, swaying, small gestures matter: nobody stands frozen.

## Tech reminders
- World 1296x2304, frame 1080x1920. Bands in `src/sets/<set>.tsx` (export the record named in the stub: `CITY`, `STREET`, `SCREEN`, `HOME`, `TRAIN`), ids `"<set>/<band>"`, max 3–4 bands per set (mood variants of the same drawing count as separate bands; keep the drawing in one function with a palette argument, like `template/src/sets/village.tsx` in the repo root template).
- Captions start at 74% of frame height on every shot (all shots have `caption: true`): keep heroes above 72%.
- 24 fps. Animate on relative progress and `wordAt(id, /regex/, fallback)`; timing is an ESTIMATE and will change with the real VO.
- Hard cuts only, no glitch/flash/transition effects, no per-frame filters, no mix-blend-mode, no box-shadow glow.
