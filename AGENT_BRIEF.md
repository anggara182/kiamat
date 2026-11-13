# Visual set brief (all set agents follow this)

You build the visuals for ONE set of a short 9:16 horror video in a Remotion project made from `template/`. Story, VO and pacing come from the episode's own script; you only draw. SVG vector only.

## Read first (in your project dir)
- Repo root `VISUAL-STYLE.md` (the look: detail budget, composition, palette pattern, characters, tech rules) and the episode's own `STYLE.md` (palette + characters for this episode, if present).
- `src/data/episode.json`: your shots (framing, camera, hero, notes, words, caption flag).
- Kit: `src/comp/Camera.tsx` (useShot, BandImg, Live, Cam, handheld, ramp, EIO), `src/data/ep.ts` (wordAt, spanOf), `src/comp/Overlays.tsx` (CAPTION_FONT, GREEN = this episode's accent colour).
- Good reference implementations with the same kit (in this repo): `library/episodes/ep07/shots/C.tsx` + `library/episodes/ep07/art/close_face.tsx` (close-ups, mask/eyes), `library/episodes/ep07/shots/S.tsx` + `library/episodes/ep07/sets/street.tsx` (wide sets with figures), `library/episodes/ep05/shots/G.tsx` (graphic/title/end card), `library/episodes/ep06/shots/C.tsx` + `library/episodes/ep06/art/close_art.tsx` (hands, trails).

- Asset library: `library/LIBRARY.md` (+ `library/catalog.json`, shot thumbnails in `library/thumbs/<ep>/sNN.jpg`). Before drawing a character, hand, face or prop from scratch, look for one there; to reuse it, copy its whole source file into a NEW file `src/art/<set>_<name>.tsx`, fix its relative imports, then restyle via props/palette.

## Ownership
Edit ONLY `src/sets/<set>.tsx`, `src/shots/<OWNER>.tsx` and NEW files `src/art/<set>_*.tsx`. Other agents edit other sets of the same project in parallel; never touch anything else. Do NOT git commit, do NOT run `bake.mjs`, `contact.mjs` or a render.

## Rules
- Motion clocks: characters and everything they do animate ON TWOS with `p2`/`t2`/`f2` from `useShot()` (or `onTwos`); camera moves and environment/background motion (sky, lights, windows, shadows, trains, clouds) stay ON ONES with `p`/`t`/`f`. Never drive a character with `p`/`t`.
- People make the content alive: every shot that has a person must show a specific, human action with readable body language (silhouette, posture, hands), not a static mannequin.
- Timing comes from the real voice-over and may change: animate on relative progress only, sync beats with `wordAt(id, /regex/, fallbackFraction)`. Never hardcode absolute frames.
- Captions (global) start at 74% of frame height on shots with `caption: true` (adjust if the account moves its subtitles): keep heroes above that zone. Graphic shots with `caption: false` draw their own text inside a 920 px safe width; on-screen words appear on their `words[]` times, capped so all text is fully visible ≥0.5 s before the shot ends.
- Title fonts via `@remotion/google-fonts` (Cinzel / Marcellus / Cormorant / Oswald…). For Japanese/Korean/Thai glyphs use a Noto font that has them and check they render.
- No 3D, no AI images, no per-frame filters, no mix-blend-mode, no box-shadow glows (glow = radial gradients), hard cuts only, no glitch/flash/transition effects, no grain (added at encode if used).
- Eerie, never gory. Ghosts are mostly implied: silhouettes, hair, hands, reflections, eyes.
- Reuse one set of bands across your shots via camera crop/zoom/parallax; live elements via `<Live>`.

## Workflow (mandatory)
edit → `node scripts/preview.mjs <set> <ids>` (bakes only your bands, 3 stills per shot, strip at `out/preview/<set>.jpg`) → Read the strip critically (silhouette test, clear focal point, composition, caption zone, no stray artifacts, nothing reading as the wrong object) → fix → repeat. Do at least 3 preview loops; do not stop early unless every shot is clearly polished. At the end `npx tsc -p . 2>&1 | grep -E "<set>|shots/<OWNER>"` must print nothing.

## Report
One short Indonesian paragraph: what each shot shows, what is still weak.
