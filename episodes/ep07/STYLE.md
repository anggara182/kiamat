# EP07 "Ninety-Nine": style guide (all set agents MUST follow)

Series look: `/home/user/kiamat/VISUAL-STYLE.md`, rules `/home/user/kiamat/CLAUDE.md`. Kit identical to EP01–EP06. You may copy your own earlier art (incl. EP06 riverbed/gold) into this project as new files (never import across projects).

## Story beat (scale: the whole world comes to one river; the bloodiest stakes so far)
Hook: "Ninety-nine out of every hundred will die for it." A sea of lamps over the mountain of gold; a man gripping a shovel who believes he'll survive. People come from every direction. Two friends dig side by side: day one they share water, day two they mark their ground with rope, day three only one comes back (carrying two shovels). Fathers and sons each hold the same gold block. Soldiers come to guard it and fight each other. Every night the camp grows quieter; sandals left at tent doors. Foundation (Muslim 2894, quote overlay): people would fight over it, ninety-nine of every hundred killed, each hoping to be the one who lives. The gold doesn't care who owns it. Cliffhanger: far away, in a city no one watches, a faceless man gives wealth away without counting it, and people begin to whisper a name.

## Hard rules
- **Violence is IMPLIED ONLY**: no bodies, no blood, no wounds, no weapons pointed at anyone in frame. Loss is shown by absence (empty tents, sandals, two shovels, lanterns going out). Soldiers are distant silhouettes in plain uniforms: **no flags, insignia, or national colours**.
- **The giving man has NO face, ever**: only from behind / backlit / silhouette. Plain clothes, no robes or symbols.
- No modern borders, signs, maps, or real places. No phone shots. New characters only.
- Characters ON TWOS, camera/environment ON ONES. 24 fps. Hard cuts only.

## Palette
- Gold night (1, 2): black `#05060c`, thousands of lamp points `#ffcf86`, gold mountain `#e8b84a` glowing from within, smoke `#2a2228`.
- Dig day (4, 5, 12): hot ochre `#d8b27a`, gold-flecked mud `#8a6a3c`, harsh sun.
- Dawn (6, 10, 11, 13): ash rose `#c9a08a` → `#5a4458`, long shadows, drifting smoke.
- Camp (7, 9): canvas `#cbbfa6`, lantern `#ffc46a`, night `#0a0d18`.
- Roads (3) dust gold `#e2c28a`; far city night (14, 15): old stone `#3a3346`, warm doorway backlight `#ffd79a`.
- Accent `#d9a441`.

## Sets and ownership
| Set | Owner file | Shots |
|---|---|---|
| `goldfield` | `C.tsx` | 1, 2, 8, 11, 13 |
| `dig` | `S.tsx` | 4, 5, 6, 12 |
| `camp` | `H.tsx` | 7, 9, 10 |
| `farcity` | `P.tsx` | 3, 14, 15, 16 (title "NINETY-NINE" + "CHAPTER 7 · THE LAST DAYS") |

`sync` words in episode.json are binding (`wordAt`). Timing is an ESTIMATE until the real VO lands. Shot 11 carries the quote overlay (top ~15–40%): keep it dark and calm.
