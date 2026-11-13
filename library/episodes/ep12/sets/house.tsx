import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { ExteriorBand, ExtFgBand, InteriorBand } from '../art/house_art';

/** Set "house" (Thai stilt house interior and canal exterior at night). Static bands baked ONCE to public/baked/house/<band>.png. Ids "house/<band>". */
export const HOUSE: Record<string, BandSpec> = {
  'house/ext': { node: () => <ExteriorBand /> },
  'house/fg': { blur: 4, node: () => <ExtFgBand /> },
  'house/int': { node: () => <InteriorBand /> },
};
