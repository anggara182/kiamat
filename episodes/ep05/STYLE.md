# EP05 "Old Gods": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP04. You may copy your own earlier art into this project as new files (never import across projects).

## Story beat (scale: a country, seen inside homes and on one hill)
The libraries close. Old teachers grow quiet, die one by one, and no one replaces them. Children learn chants instead of letters; parents stop answering questions. On a hill outside the city an ancient stone figure is dug up; people come to look, then bring flowers, then begin to walk around it in circles. Foundation (Bukhari 80): religious knowledge will be taken away. Then spring rain comes early, the harvest is the biggest ever, and more money than anyone knows what to do with arrives (hook into stage 3).

## Hard rules
- No phone shots. New characters.
- The stone figure is GENERIC and abstract (weathered, worn features, no recognisable deity, no symbols or iconography of any real religion). Offerings: flowers only (no incense, candles of a real rite, or prayer gestures of any real faith).
- Funeral: no body shown; a fresh mound and a stack of books.
- Banknotes generic and unreadable.
- Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Library day (1, 2): dusty sandstone `#cdb89a`, chain steel `#7d8590`.
- Village/teachers (3–7): soft daylight `#e9e2d4`, classroom dust beams `#f0d9a8`; night home (7) lamp `#ffcf86`.
- Hill day (8–10): dry earth `#a8865e`, pale sky `#dfe6ea`; dusk (11–14): `#f0a86a` → `#5a3a5e`, statue silhouette `#1c1620`.
- Harvest (15–17): rain grey-green `#8fa79a`, gold fields `#e2b84a`, warehouse warm `#c9a35a`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `library` | `P.tsx` | 1, 2, 18 (title "OLD GODS" + "CHAPTER 5 · THE LAST DAYS") |
| `village` | `H.tsx` | 3, 4, 5, 6, 7 |
| `hill` | `C.tsx` | 8, 9, 10, 11, 12, 13, 14 |
| `harvest` | `S.tsx` | 15, 16, 17 |

`sync` words in episode.json are binding (`wordAt`). Timing is an ESTIMATE until the real VO lands. Shot 14 carries the quote overlay (top ~15–40%): keep it dark and calm.
