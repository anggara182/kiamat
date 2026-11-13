import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Room, Mary } from '../art/mirror_art';

/** Set "mirror" (bathroom: mirror, candle, reflections, close-ups). Static bands baked ONCE to public/baked/mirror/<band>.png. Ids "mirror/<band>". */
export const MIRROR: Record<string, BandSpec> = {
  'mirror/room': { node: () => <Room /> },
  'mirror/mary': { blur: 16, node: () => <Mary /> },
  'mirror/day': { node: () => <Room day /> },
};
