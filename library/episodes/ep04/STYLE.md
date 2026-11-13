# EP04 Pocong — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **HERO element per shot** (named in src/data/episode.json `hero`): detailed. Clean silhouette + 2–3 tone shading + rim light + a few telling details (fabric folds, knots, fingers, hair strands, reflections).
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette
- Night street & cemetery: sky `#0a0d1c` → `#1b2238` → `#2e3550` (low city glow at the horizon `#4a3a40`).
- Sodium street lights: `#ffb347` / `#ffd27a` pools on the asphalt; traffic light red `#ff3b30`, green `#3ddc84`.
- Silhouettes: `#07080f` near, `#121626` mid, `#20263a` far. Cool rim `#9fb4d8`, warm rim from street lights `#ffc070`.
- The pocong / shroud: off-white `#e9e4d6` with cool shadow `#9aa0b0`; knots tied with a darker band `#bdb6a4`.
- Accent / caption keywords: `#ffcc4d`.

## Characters (no detailed faces)
- Uncle (ojek driver): adult man on a small motorbike, helmet, jacket, seen from behind/side as a rimmed silhouette.
- The passenger / pocong: a figure fully wrapped in a white shroud, tied above the head (a tuft of cloth) and at the feet; face is only a dark oval opening, never detailed. Arms are inside the cloth (no hands). Eerie, never gory.
- Cemetery: simple Muslim grave markers (nisan), frangipani tree silhouette, low gate with an arch sign (no readable text needed).

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
- `road` (owner R, file src/shots/R.tsx): night road + cemetery gate, motorbike riding
- `bike` (owner K, file src/shots/K.tsx): close-ups on the motorbike: arms around the waist, the knot, the ear
- `graphic` (owner G, file src/shots/G.tsx): title, lore illustration, CTA
