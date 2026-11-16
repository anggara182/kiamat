# EP08 "The Refuge": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP07. You may copy your own earlier art into this project as new files (never import across projects).

## Story beat (stage 4 begins: the awaited leader; stakes = the earth itself intervenes)
Hook: an army marches into the desert to kill one man, and the desert swallows it. Then back: the faceless giver from EP07 hands out gold without counting; people whisper he is the one the Prophet promised, a man from his family who would fill the earth with justice as it was filled with oppression (Abu Dawud 4282). He never claims it; he runs, to the Sacred House in Mecca. Faceless men who fear him send an army. Foundation (Muslim 2882, quote overlay): a seeker of refuge in the House, an army sent against him, swallowed when it reaches open ground. The sand trembles; the ground opens; by morning only flat sand and tire tracks that lead nowhere. In Mecca a hundred thousand hands reach toward him. Cliffhanger: far to the north an empire signs a peace treaty it never means to keep.

## Hard rules
- **The giver (the awaited man) has NO face, ever**: only from behind / backlit / tiny silhouette. Plain clothes, no robes, no symbols.
- **The Sacred House (Ka'bah) is NOT drawn.** Show only the white-clad crowd seen from behind, tall generic minarets, and a great soft white glow where the House would be. Pilgrims: simple white garments; respectful, luminous, calm.
- **The army has no flags, insignia, or national colours**; plain sand/olive vehicles. The swallowing shows vehicles, dust and ground only: **NO bodies, no people falling, no screaming faces**.
- The "men who feared him" are faceless (lit from below, in shadow). Maps have no borders, names, or text.
- No phone shots. New characters only. Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Desert night (1, 2): black-blue `#05070f`, headlights `#fff3d0`, sand `#3a3226` lit by headlights, dust `#6a5a48`.
- Desert day (9, 11, 12): bleached `#f1e6cc` → `#cdb48a`, harsh sun, dust `#d9c4a0`.
- Dusk plain (10): `#2a2238` → `#e89a5a`, flat pale ground `#bfae94`, long shadows.
- Streets (3, 6 night; 4, 5 day): old stone `#3a3346` + doorway `#ffd79a` / dusty day `#d8cdb8`, barbed wire grey.
- Mecca (7, 14): deep night/dawn blue `#0a1426` → `#cfd8e6`, white garments `#f4f1ea`, the glow `#ffffff` with soft gold rim `#f3dca0`.
- North hall (15): cold blue-grey `#1c2230`, snow outside `#cfd8e3`, lamp `#ffd9a0`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `desert` | `C.tsx` | 1, 2, 9, 10, 12 |
| `refuge` | `S.tsx` | 7, 11, 13, 14 |
| `streets` | `H.tsx` | 4, 5, 8 |
| `streets` + `north` | `P.tsx` | 3, 6, 15, 16 (title "THE REFUGE" + "CHAPTER 8 · THE LAST DAYS") |

`streets` is shared: H draws its day market/barricade + the dark room; P draws its night street/alley as separate band ids (`streets/night-*`). Coordinate by band id prefix; never edit the other's bands.
`sync` words in episode.json are binding (`wordAt`). Shot 10 carries the quote overlay (top ~15–40%): keep it dark and calm.
