// All art is drawn in one world space with overscan around the 1080x1920 frame,
// so baked bands have room for camera moves (pan, push-in, parallax).
// Frame window sits at world (108, 192) .. (1188, 2112).
export const W = 1296;
export const H = 2304;
export const FRAME = { w: 1080, h: 1920 };

// deterministic random for repeatable art
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
