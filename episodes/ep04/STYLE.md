# EP04 "The Loudest Voice": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP03. You may copy your own earlier art into this project as new files (never import across projects).

## Story beat (scale: a whole COUNTRY, 30 days)
The followers of the man from nowhere take eleven cities with crowds, not weapons. In every city the people who know how things work are pushed aside and the loudest voices take their place: a man with no training runs the hospital, a man who can barely read rewrites the schools, a bridge is built by people who never built anything. It opens to cheers and falls, empty, on the third night. The engineers who warned them have been silenced. The experts leave; the loud ones stay. Last order: close the libraries.
Foundation (Bukhari 59): when trust is lost and authority is handed to the unfit, wait for the Hour.

## Hard rules
- No phone shots. The man from nowhere is NOT shown in this chapter.
- No violence or victims: people are steered by a hand on the shoulder, the bridge falls EMPTY.
- Invented places only (no real maps, flags, symbols, parties). Text exactly as in episode.json ("HE KNOWS").
- New characters. Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Dawn march (1): `#2a2c48` → `#c98a6e`, dust gold `#e8c48a`.
- Day city/institutions (2–10, 13, 15, 16): hazy white `#e6e8ea`, hospital mint `#cfe3dc` / white coats, classroom green board `#2f4a3c`.
- Night collapse (11, 12, 17): `#06080f`, sodium lamp `#ffb347`, river black `#0b0e14`.
- Quote office (14): dusty amber beam `#d9b27a` on dark wood `#2a2018`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `nation` | `C.tsx` | 1, 2, 3, 4 |
| `institutions` | `H.tsx` | 5, 6, 7, 8 |
| `bridge` | `S.tsx` | 9, 10, 11, 12, 13 |
| `exodus` | `P.tsx` | 14, 15, 16, 17, 18 (title "THE LOUDEST VOICE" + "CHAPTER 4 · THE LAST DAYS") |

`sync` words in episode.json are binding (`wordAt`). Timing is an ESTIMATE until the real VO lands. Shot 14 carries the quote overlay (top ~15–40%): keep it dark and calm.
