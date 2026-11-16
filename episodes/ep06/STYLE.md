# EP06 "The River Runs Dry": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP05. You may copy your own earlier art into this project as new files (never import across projects).

## Story beat (scale: a whole REGION; stage 3 "Earth & wealth" begins, stakes jump)
Flash-forward hook: thousands of people on the banks of a dry riverbed staring at one golden glint. Then back: the Euphrates stops in one summer. Boats on mud, fish gasping by the thousands, wells dry, villages leave on trucks, a can of water costs a day's work, the river shrinks to a thread. Old men remember: the Prophet said this river would uncover a mountain of gold, and whoever is there should take nothing from it (Bukhari 7119, quote overlay). People laugh. A girl chasing her goat sees something shine; she digs, it doesn't end; her father digs, the village digs; it is a buried mountain of gold. By nightfall the news crosses every border; by morning a million people are walking toward the river.
**Big, mythic, sun-scorched.** Scale is the point (vast cracked riverbed, endless crowds, the gold's size), but every big image has readable human gestures.

## Hard rules
- **No phone shots** (a roadside radio is fine). New characters only.
- The Euphrates may be named, but **no modern borders, flags, maps, signs, country names, or real landmarks**. Generic villages (mud-brick + concrete, palms, a dry hand pump).
- The gold is RAW (a curved, rough, glowing surface like the back of a buried mountain), not coins or bars. No logos.
- The old man: simple white cap, white beard, prayer beads are fine. No depiction of the Prophet, angels, or anything sacred.
- Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Scorched day (1–9, 12–16): bleached sky `#efe6d2` → `#d8c39a`, cracked mud `#a07c55` / cracks `#4a3524`, heat haze, harsh short shadows.
- Gold `#e8b84a` core `#fff0b0`, rim `#9a6a1c`; glints with a soft star flare.
- Night (10, 11, 18, 20): deep blue `#070b16`, moonlight `#a9b8d6`, lamp `#ffcf86`, headlights `#fff3d0`.
- Sunset (17), dawn (19): `#2b2440` → `#f2a65e`, dust lit gold.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `riverbed` | `C.tsx` | 1, 3, 7, 11, 16, 17 |
| `banks` | `S.tsx` | 2, 4, 8, 13, 14, 15 |
| `village` | `H.tsx` | 5, 6, 9, 10, 12 |
| `roads` | `P.tsx` | 18, 19, 20 (title "THE RIVER RUNS DRY" + "CHAPTER 6 · THE LAST DAYS") |

`sync` words in episode.json are binding (`wordAt`). Timing is an ESTIMATE until the real VO lands. Shot 11 carries the quote overlay (top ~15–40%): keep it dark and calm.
