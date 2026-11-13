import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "close" (close-ups: the masked face leaning down, the sister's hands and profile). Static bands baked ONCE to public/baked/close/<band>.png. Ids "close/<band>". */
export const CLOSE: Record<string, BandSpec> = {};
