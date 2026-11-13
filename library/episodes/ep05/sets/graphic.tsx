import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "graphic" (title, schedule board lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {};
