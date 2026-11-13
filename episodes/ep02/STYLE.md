# EP02 "Faster Than the Truth": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md` (all sections) and repo rules in `/home/user/kiamat/CLAUDE.md`. Kit conventions are identical to EP01 (`/home/user/kiamat/episodes/ep01`): read its STYLE.md sections "Make it ALIVE" and "People", and reuse its art where it helps (copy files into your own `src/art/<set>_*.tsx`, never import across projects).

## Story beat
One kampung neighbourhood, one day, dawn to night. A false rumour ("the water is poisoned, a stranger was seen at the water tower") spreads mouth to mouth, causes panic, and nearly ends with a mob stoning an innocent young newcomer who was fixing a leaking pipe for free. The mosque loudspeaker announces the water is clean. Nobody apologises. That night a new whisper starts.
**New characters only** (nobody from EP01). **No phone shots at all** (adrian, 13 Nov): the rumour travels through mouths, ears and crowds.

## Characters (simple faces, readable body language, Indonesian everyday clothes)
- Stall owner: woman, 40s, headscarf, apron, breakfast stall with a steaming pot (shots 3, 8, 23).
- The whisperer: woman customer, 30s, patterned headscarf (shot 3).
- Young newcomer: man, 20s, plain work T-shirt, cargo trousers, tool bag, wrench (14, 15, 16, 21).
- Mother + small daughter (6) with a doll (9).
- Two old men: peci, sarong, one with a walking stick (10).
- Marbot (mosque caretaker): man, 50s, white peci, reading glasses, holding a paper (19).
- Crowd: 8–12 simplified figures, varied heights and clothes (13, 16, 20).

## Two visual registers
- **Reality** (most shots): the series look, warm/harsh light by time of day.
- **Rumour image** (shots 5 and 12 only): what people imagine. Flat, cold, desaturated blue-grey, no texture, faceless silhouettes, slightly too-symmetric composition; red marker lines in 12. It must read instantly as "not real".

## Palette
- Dawn (1–3): sky `#1c2244` → `#5b4a78` → `#e59a7a`; shop interior warm bulb `#ffd08a`; shelves `#8a7a64`.
- Day / noon (6–11, 13–21): harsh white sky `#e9eef0`, walls `#d8cdb8` / shade `#8f846f`, hard short shadows `#2a2018` at .3, foliage `#4d5a49`.
- Dusk (22–23): `#f0b27a` → `#c96b5c` → `#3b2c52`.
- Night (24, 25): `#05070f` → `#141a30`; one warm mosque window `#ffcf86`.
- Rumour (5, 12): `#2a3140` / `#4a5468` / `#8d97a8`, red marker `#c4322b`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots | What it is |
|---|---|---|---|
| `market` + `homes` | `H.tsx` | 1, 2, 3, 8, 9, 23, 24 | Small corner shop with shelves + rolling door + breakfast stall (dawn, day, dusk); a small house front with a gutter (9); a dark terrace facing the lit mosque window (24). |
| `kampung` | `C.tsx` | 5, 10, 12, 18, 19, 22 | Water tower (rumour version 5/12, real dusk version 22), mosque gate (10), mosque loudspeaker pole (18), mosque interior with the marbot at the microphone (19). |
| `alley` | `S.tsx` | 13, 14, 15, 16, 17, 20, 21 | One narrow kampung alley at harsh noon: crowd entering, the young man at the leaking pipe, the ring of the crowd from his eye level, the stone, the dispersal. |
| `whisper` | `P.tsx` | 4, 6, 7, 11, 25 | Mouth-to-ear close-ups: lips near an ear (4), angkot passengers (6), pos ronda men (7), a fast whisper relay montage (11), and the title card (25, same design as EP01 S25: "FASTER THAN THE TRUTH" + "CHAPTER 2 · THE LAST DAYS"). |

Every shot has a `sync` list in `episode.json`: key actions land exactly at the start of those words (`wordAt(id, /^word/i, fallback)`); sound effects are placed on the same words.

## Foundational quote
Shots 22–23 carry the global quote overlay (Qur'an 49:6) in the upper part of the frame (top ~15–40%). Keep that area calm and darker there (sky, soft gradients), no busy detail or bright lights behind it.

## Rules recap
Characters ON TWOS (`p2`/`t2`/`f2`), camera/environment ON ONES. 24 fps. Hard cuts only. No 3D, no AI images, no per-frame filters, no mix-blend-mode, no box-shadow glow. Captions at 74% of frame height: keep heroes above 72%. No real brands, logos, places or people. Stone scene: no violence shown, no injury; the tension is the hand and the crowd. Band ids: hyphens only.
