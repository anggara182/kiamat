// All art is drawn in one world space with overscan around the 1080x1920 frame,
// so baked bands have room for camera moves (pan, push-in, parallax).
// Frame window sits at world (108, 192) .. (1188, 2112).
export const W = 1296;
export const H = 2304;
export const FRAME = { w: 1080, h: 1920 };
export const HORIZON = 1010; // frame y ~818
export const SHORE = 1470; // frame y ~1278, girl stands here; captions sit below on the wet sand
export const SUN = { x: 560, y: HORIZON - 46, r: 70 };

export const C = {
  skyTop: '#11163a',
  skyHigh: '#33295a',
  skyMid: '#7d4268',
  skyLow: '#d9715a',
  skyHorizon: '#ffbf78',
  sun: '#fff3d1',
  sunGlow: '#ffae5a',
  seaFar: '#6a4a6e',
  seaMid: '#2c2f55',
  seaNear: '#171c36',
  glitter: '#ffd79e',
  land: '#1b1428',
  landRim: '#f2a272',
  hotel: '#c7b3b0',
  hotelShade: '#5e4f66',
  window: '#ffcf86',
  sandWet: '#2b2537',
  foam: '#f6efe6',
  dress: '#e9e3ea',
  dressShade: '#8e88a8',
  dressDeep: '#615c80',
  rimWarm: '#ffc27e',
  hair: '#110d15',
  hairMid: '#2a1f2c',
  skin: '#a8725a',
  skinShade: '#6e4a44',
  ink: '#0b0912',
};

// deterministic random for repeatable art
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
