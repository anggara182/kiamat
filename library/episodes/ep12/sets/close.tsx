import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "close" (close-ups: the lime, floorboards gap, the long arm, hands). Static bands baked ONCE to public/baked/close/<band>.png. Ids "close/<band>". */
export const CLOSE: Record<string, BandSpec> = {};
