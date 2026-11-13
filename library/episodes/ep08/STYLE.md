# EP08 La Llorona — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **HERO element per shot** (named in src/data/episode.json `hero`): detailed. Clean silhouette + 2–3 tone shading + rim light + a few telling details (fabric folds, knots, fingers, hair strands, reflections).
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette
- Mexican riverbank at night: sky `#090c1a` → `#1b2140` with a pale moon `#e9ecf2`; river `#0d1626` with moon glints `#cfd8e6`.
- Reeds/willows silhouettes `#060810` near, `#121828` mid; mist `#8b96ad` low over the water.
- Village lights far away: marigold `#ff9f5a`, candle `#ffd08a`; papel picado colours only as tiny accents.
- La Llorona: white dress `#e7e4dc` gone grey-blue in moonlight `#a7b0c0`, long black wet hair `#0b0c10`, face never clear.
- Accent / caption keywords `#ff9f5a`.

## Characters (no detailed faces)
- Narrator's cousin: boy (~10) with a small fishing rod and a flashlight, seen from behind/silhouette.
- La Llorona: woman in a long white dress kneeling at the water's edge, long wet black hair covering her face, hands in the water. Sorrowful and eerie, never gory.

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
- `river` (owner R, file src/shots/R.tsx): riverbank at night with reeds, willow, moon, distant village
- `close` (owner C, file src/shots/C.tsx): close-ups: her hands in the water, her veiled face, wet footprints, window
- `graphic` (owner G, file src/shots/G.tsx): title, lore, CTA
