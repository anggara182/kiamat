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

## Sets and ownership
| Set | Owner file | Shots | What it is |
|---|---|---|---|
| `city` | `src/shots/C.tsx` | 1, 7, 8, 9 | The city skyline seen from afar (dense low-rise kampung rooftops in front, towers behind, one mosque minaret). ONE skyline drawn once and baked in mood variants (dawn / dusk / night bands), reused across the four shots via camera crop/zoom and live window lights. Shot 8 tilts up into night sky with one star. Shot 7 draws the small source label. |
| `street` | `src/shots/S.tsx` | 2, 3, 6 | Street level: morning traffic under a concrete commuter-rail bridge (2); low angle up an unfinished tower with a crane, then a top-down view of a crossing with tiny people (3); a lamp post and its sweeping shadow on asphalt at sunset (6). |
| `screen` | `src/shots/P.tsx` | 4, 5, 10 | Phone close-ups: hand holding a phone with a scrolling news feed (4), thumb swiping cards away (5), a dark bedroom with a phone on a desk lighting up with a notification, then "EPISODE 01" on black (10). |

## Tech reminders
- World 1296x2304, frame 1080x1920. Bands in `src/sets/<set>.tsx` (export the record named in the stub: `CITY`, `STREET`, `SCREEN`), ids `"<set>/<band>"`, max 3–4 bands per set (mood variants of the same drawing count as separate bands; keep the drawing in one function with a palette argument, like `template/src/sets/village.tsx` in the repo root template).
- Captions start at 74% of frame height on every shot (all shots have `caption: true`): keep heroes above 72%.
- Animate on relative progress and `wordAt(id, /regex/, fallback)`; timing is an ESTIMATE and will change with the real VO.
- Hard cuts only, no glitch/flash/transition effects, no per-frame filters, no mix-blend-mode, no box-shadow glow.
