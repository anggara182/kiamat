# EP09 "Eighty Banners": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP08. You may copy your own earlier art into this project as new files (never import across projects).

## Story beat (the great war; stakes = the whole world at war)
Hook: eighty banners rise over a ridge, under each twelve thousand soldiers: nearly a million men marching under one broken promise. Then back: a handshake; a truce between the believers and "the Romans" (the hadith's name, NOT any modern nation); years of peace (ports, markets, children who never heard a siren); together they even defeat a common enemy; on the day of victory a quarrel over whose victory it was; within a week the treaty is ash; the same ports fill with warships. Foundation (Bukhari 3176, quote overlay): a truce with Bani al-Asfar who betray it and come under eighty flags, twelve thousand under each. In every city men answer the call; schools empty; mothers at windows; trucks drive north through the night. Cliffhanger: at dawn two armies face each other at a place the Prophet named fourteen centuries before.

## Hard rules
- **No real nations, flags, insignia, uniforms, religious symbols (no crosses, no crescents), or real places.** Banners are plain cloth in dark tones (deep red-brown, slate, ochre) with at most a simple abstract stripe. The two sides differ only by uniform tone (grey vs olive).
- **No combat shown, no weapons pointed, no bodies, no blood.** The quarrel is a shove and shouting only.
- No phone shots (a printed photo is fine). New characters only. Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Banners day (1, 2, 6): pale sky `#e8e4da`, ridge `#6b5a44`, army mass `#2a2622`, banners `#5a2a22` / `#3a4250` / `#8a6a2a`.
- Dawn/dusk (10, 14): mist `#c9c2d0` → `#e8a870`, armies `#1c1a22`.
- Peace (3, 4, 5): bright, warm `#f6efe0`, sea `#7fb3c8`, cheerful stall colours.
- Camp dusk (7): `#e09060` → `#3a2c40`. Port night (9): `#0a1020`, sodium lamp `#ffb860`, warships `#141820`.
- Homes (8 night fire `#ff9a3a`; 11 dawn `#f2d2a8`; 12 day `#e6e0d4`). Road night (13): `#05070f`, headlights `#fff3d0`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `banners` | `C.tsx` | 1, 2, 6, 10, 14 |
| `peace` | `S.tsx` | 4, 5, 7, 9 |
| `homes` (+ the treaty hall) | `H.tsx` | 3, 8, 11, 12 |
| `road` | `P.tsx` | 13, 15 (title "EIGHTY BANNERS" + "CHAPTER 9 · THE LAST DAYS") |

`sync` words in episode.json are binding (`wordAt`). Shot 10 carries the quote overlay (top ~15–40%): keep it dark and calm.
