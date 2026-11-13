# EP03 Wewe Gombel — style guide (all agents MUST follow)

## Look
Semi-realistic stylized vector, **layered silhouettes against rich gradient light** (shadow-puppet / cinematic poster feel).
Detail lives in composition, light and the HERO element, not in background texture.

## Detail budget (the speed rule)
- **HERO element per shot** (named in ep03.json `hero`): detailed. Clean silhouette + 2–3 tone shading + rim light + a few telling details (wrinkles on grandma's hands, dent in the wok, sandal straps, child's fingers, hair strands of Wewe Gombel).
- **Everything else = LOW detail**: flat fills or 2–3 stop gradients, simple silhouettes, max ~6 shapes per background element, no textures, no micro props, no per-element rim light, no noise.
- Reuse within your set: one set of bands serves all your shots via camera crop/zoom/parallax.

## Palette (dusk/maghrib Java)
- Sky: top `#141233` → `#3b2a5c` → `#a2475a` → `#f0874a` horizon. Blue hour variant: `#0e1430` → `#26375e` → `#5d6a8a`.
- Silhouettes: `#0d0a14` (near), `#1a1428` (mid), `#2c2340` (far, hazy).
- Warm light (lamps, windows, rim): `#ffb35c`, `#ffd08a`. Moon/cool rim: `#9fc0d8`.
- Accent / horror: `#ff8a3d` (also caption keyword colour). Ghost eyes: `#f4f1e0` with `#ff8a3d` glow.
- Morning (shots 10–11): mist `#c9ccd6`, pale sky `#e8e0d4`, greens desaturated `#5a6b5a`.
- Bamboo: stalks `#1c2418`/`#2a3524`, node rings 1 darker line, leaves as simple blades.

## Characters (no faces needed)
- Wewe Gombel: extremely tall and thin, very long black hair, long arms reaching below the knees, pale-ish skin barely visible, never fully lit. Mysterious, not gory.
- Grandma: hands + kebaya sleeve only. Dad / Mom / kids: silhouettes with a warm or cool rim. Brother: small boy (~7), sarong, asleep.

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
- Proportions: adult head ≈ 1/7 of height; Wewe Gombel ≈ 1/10 (elongated, very long limbs); child (~7 y) ≈ 1/5.
- Build: head ellipse → neck → torso path (shoulders wider than waist) → limbs as tapered paths with elbow/knee bends → hands as simple mittens with 1–2 finger separations. Hair as one big shape + 4–8 strand strokes + rim strokes.
- Woman from behind (mom): bun on the back of the head, shoulders, kebaya (lighter edge at hem), sarong to the ankles, elbows out with hands at the sides of the head when shouting. Full figure visible, ~50–60% of frame height.
- Wewe Gombel crouched: knees high and sharp, back bowed into a long curve, head bowed low, hair curtain from the crown to the ground covering the face, one arm wrapping around a small child in front of her knees. The child must read as a child: big round head, small body, little hand.
- Silhouette test: if the hero filled in solid black is not recognisable, fix the shape before adding detail.

## Self-check workflow (mandatory)
1. Write the set + shots. 2. `node scripts/preview.mjs <set> <ids>` (bakes ONLY your bands, renders 3 stills per shot at 15/50/90%, strip at out/preview/<set>.jpg, ~30–60 s). 3. LOOK at the strip with the Read tool and fix what reads wrong. 4. Preview once more. Stop.
