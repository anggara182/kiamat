# EP03 "The Man From Nowhere": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, repo rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01/EP02. You may copy your own EP01/EP02 art into this project as new files (never import across projects).

## Story beat (scale: a whole CITY, 7 days)
A rumour that the mayor sold the city's water sets the city on fire: a million people in the streets, banners on every bridge, families split in half, city hall burned on the third night, the mayor vanishes (ran or taken: never answered). Two days of curfew, no water, no bread. On the fifth day a man with no name walks out of the ashes, hands out bread, speaks softly. On the seventh day a full stadium hears him say God sent him, and half the city kneels. The narrator frames him clearly as one of the liars the Prophet warned about. Next morning, his followers walk toward the neighbouring city.
**Grand and cinematic.** Scale is the point: crowds, flames, smoke, floodlights, a stadium. Still people-first: every big image has readable human gestures.

## Hard rules
- **No phone shots.** Screens only as background (a TV glow, stadium screens showing a silhouette).
- **The man from nowhere has NO face, ever**: always backlit, from behind, or a tiny silhouette. Plain clothes, no religious symbols, no robes of any real faith.
- **The mayor has no face**: a generic suit silhouette on posters. No party colours, no real flags, no real symbols, no real place names. Banner/graffiti text exactly as given in episode.json (English).
- **Fire and riot without victims**: no bodies, no blood, no injuries shown. Arson is stylised (no instructional detail).
- New characters only. Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Riot night (1, 10): black-blue sky `#06080f`, fire `#ff8a2a` / `#ffcf6a` cores, smoke `#2a2530` lit orange from below, silhouettes `#05050a`.
- Ash dawn (2, 15, 16): grey-violet `#4a4652` → `#b9a59a`, ash particles, low sun `#ffd8a8` through smoke.
- Day crowd (6, 7, 13, 17, 18): hazy white sky `#e6e8ea`, concrete `#b8b2a6`, flare smoke red/white (no national colours).
- Homes night (8, 9): warm lamp `#ffcf86`, TV cool glow `#9fd7ff`.
- Stadium (19–22): night `#05070f`, floodlights `#f4f8ff` with long beams, the crowd as a sea of small shapes.
- Accent `#d9a441`.

## Sets and ownership
| Set(s) | Owner file | Shots |
|---|---|---|
| `cityhall` + `stadium` | `C.tsx` | 1, 2, 10, 19, 20, 21, 22 |
| `boulevard` | `S.tsx` | 6, 7, 13, 15, 16, 17, 18 |
| `homes` | `H.tsx` | 8, 9, 14, 23 |
| `walls` | `P.tsx` | 3, 4, 5, 11, 12, 24 (title: "THE MAN FROM NOWHERE" + "CHAPTER 3 · THE LAST DAYS") |

Every shot has `sync` words in `episode.json`; key actions land exactly at their starts (`wordAt`). Timing is an ESTIMATE until the real VO lands: animate with `wordAt` + relative progress only.

## Quote
Shot 22 carries the global quote overlay (Bukhari 7121) in the top ~15–40% of the frame: keep that area dark and calm.
