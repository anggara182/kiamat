import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Outside, Kitchen } from '../art/home_art';

/** Set "home" (apartment interior: window facing the mountain, kitchen, close-ups). Static bands baked ONCE to public/baked/home/<band>.png. Ids "home/<band>". */
export const HOME: Record<string, BandSpec> = {
  'home/outside': { node: () => <Outside /> },
  'home/outsideSoft': { blur: 6, node: () => <Outside /> },
  'home/kitchen': { node: () => <Kitchen /> },
  'home/kitchenSoft': { blur: 12, node: () => <Kitchen /> },
};
