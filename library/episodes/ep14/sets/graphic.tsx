import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "graphic" (title, rules board, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {};
