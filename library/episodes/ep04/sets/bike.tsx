import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { BikeBg } from '../art/bike_art';

/** Set "bike" (close-ups on the motorbike: arms around the waist, the knot, the ear). Static bands baked ONCE to public/baked/bike/<band>.png. Ids "bike/<band>". */
export const BIKE: Record<string, BandSpec> = {
  'bike/bg': { blur: 16, node: () => <BikeBg /> },
};
