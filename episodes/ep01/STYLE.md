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

## Sets and ownership (v2: 21 shots, 24 fps, people-first)
Shot list v2 (13 Nov): the VO is unchanged, but it is cut into 21 shots so almost every line gets a human moment. Shot ids changed; `episode.json` has a `was` field mapping old components (S01..S10) to new ids. Components are named by the NEW id (`S01`..`S21`) and exported from the owner file; `src/shots/index.ts` picks them up automatically (missing ones render a grey placeholder).

| Set | Owner file | Shots | What it is |
|---|---|---|---|
| `city` (+ `train`) | `src/shots/C.tsx`, `src/shots/T.tsx` | 1, 12, 18, 19, 20 (city) · 6 (train) | Skyline (as v1). New: shot 12 is a DIFFERENT vantage (e.g. from a kampung rooftop with laundry lines), so it never looks like shot 1; shot 19 adds a lone man on a rooftop looking up at the star; shot 20 adds a near window where a mother turns off a lamp beside a sleeping child. Shot 6: inside a packed commuter train. |
| `home` | `src/shots/H.tsx` | 2, 3, 4, 15 | A small kampung house: kitchen at dawn (mother switches on the fluorescent light, pot steams), carport (father kick-starts a scooter, kid in a big helmet waits), bedroom (hand slaps a phone alarm, minaret in the window), floor-mat dinner at night (lamp swings, family holds on). |
| `street` | `src/shots/S.tsx` | 5, 7, 8, 11, 13, 16, 17 | As v1 plus: construction worker on a high beam (7, and dusk version 13), pedestrians streaming in the sunset time-lapse with the lamp post moved to a third (11), people walking past a police line without looking (16), an old man in a peci on a bus-stop bench while the crowd blurs past (17). |
| `screen` | `src/shots/P.tsx` | 9, 10, 14, 21 | As v1 plus: two suit-sleeved hands passing an envelope under a meeting table (14); a sleeping figure in the bed behind the phone (21). Fix the thumb in 10 (too long, reads as an index finger). |

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
