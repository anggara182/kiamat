# EP06 Suster Ngesot — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **HERO element per shot** (named in src/data/episode.json `hero`): detailed. Clean silhouette + 2–3 tone shading + rim light + a few telling details (fabric folds, knots, fingers, hair strands, reflections).
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette
- Hospital ward at night: walls `#1b2a2e` → `#2c3f43`, floor tiles `#16201f` with a faint reflection; curtains `#3a5552`.
- Fluorescent light `#dff7f2` (flickering), monitor glow `#4dffb0`, exit sign `#3dff8a`.
- Cool shadows `#0a1112`; skin `#b07a62`; hospital blanket `#c9d6d2`.
- The nurse: old-style white uniform `#e6e8e2`, white cap, long dark hair `#0b0b0d`; never fully seen.
- Accent / caption keywords `#6fe3d6`.

## Characters (no detailed faces)
- Narrator: teenager sitting on a plastic chair beside the bed (silhouette / from behind / hands only).
- Grandma: elderly patient in bed, seen as a shape under the blanket, a wrinkled hand with an IV line; eyes may be suggested by two small highlights, no detailed face.
- Suster Ngesot (the crawling nurse): only ever partially shown — a pale hand on the floor reaching out from under the bed, the edge of a white uniform, a nurse's cap, long hair dragging. Never a full figure, never gory.

## Tech rules
- World space 1296x2304 (`src/art/world.ts`), frame 1080x1920. Bands: `Record<string, BandSpec>` in your `src/sets/<set>.tsx`, ids `"<set>/<band>"`, optional `blur` (applied once at bake). 3–4 bands per set max.
- Shots: `src/shots/<OWNER>.tsx` exporting `Sxx` components; use `useShot()` progress (relative), `BandImg`, `Live`, `Cam`, `handheld`, `ramp`, `EIO` from `src/comp/Camera.tsx`. Never hardcode absolute frames.
- NO per-frame blur/filters, NO mix-blend-mode, NO box-shadow glows. Glow = radial gradient shapes.
- Hard cuts only. NO light leaks, NO transitions, NO glitch / chromatic aberration / flashes / shakes-as-effects. Grain + vignette + captions are global (don't draw them). Keep the HERO out of the caption zone (y > 69% of frame) when the shot has a caption.

## Polish rules (v3)
- Every shot needs ONE clear focal point: put the HERO against the lightest area behind it (value contrast), give it a rim light, and keep everything else darker/lower contrast.
- 3 depth layers minimum (fg dark silhouette framing, mid with the hero, bg light/sky). Foreground framing elements (leaves, stalk edges) are cheap and add a lot.
- Composition: hero on a third, never cut at the head or feet by the frame edge unless it's a deliberate extreme close-up. Keep the hero above 72% of frame height (captions now smaller, start at 74%) when the shot has a caption.

## Character construction (build from primitives, then check the silhouette in preview)
- Proportions: adult head ≈ 1/7 of height; child (~7 y) ≈ 1/5.
- Build: head ellipse → neck → torso path (shoulders wider than waist) → limbs as tapered paths with elbow/knee bends → hands as simple mittens with 1–2 finger separations. Hair as one big shape + 4–8 strand strokes + rim strokes.
- Silhouette test: if the hero filled in solid black is not recognisable, fix the shape before adding detail.

## Self-check workflow (mandatory)
1. Write the set + shots. 2. `node scripts/preview.mjs <set> <ids>` (bakes ONLY your bands, renders 3 stills per shot at 15/50/90%, strip at out/preview/<set>.jpg, ~30–60 s). 3. LOOK at the strip with the Read tool and fix what reads wrong. 4. Preview once more. Stop.

## Sets in this episode
- `ward` (owner W, file src/shots/W.tsx): hospital ward at night: beds, curtains, IV stands, corridor
- `close` (owner C, file src/shots/C.tsx): close-ups: floor under the chair, hands, IV bag, the trail
- `graphic` (owner G, file src/shots/G.tsx): title, lore, CTA
