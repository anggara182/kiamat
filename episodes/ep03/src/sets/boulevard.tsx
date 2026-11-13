import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { DayBand, FlyBand, DawnBand, StreetBand } from '../art/boulevard_art';

/** Set "boulevard" (EP03 shots 6, 7, 13, 15, 16, 17, 18): one big city boulevard with a flyover.
 *  day    = high view down the boulevard, buildings, flyover (S06 full of people, S13 empty under curfew)
 *  fly    = low angle on the flyover deck (S07 banners, people on top)
 *  dawn   = ash dawn at street level, ruins, low sun at the end of the street (S15)
 *  street = eye-level day street, shop fronts (S17 bread, S18 listeners, soft)
 *  (S16 close is drawn live; crowds, flags, smoke, banners, people are live) */
export const BOULEVARD: Record<string, BandSpec> = {
  'boulevard/day': { node: () => <DayBand /> },
  'boulevard/fly': { node: () => <FlyBand /> },
  'boulevard/dawn': { node: () => <DawnBand /> },
  'boulevard/street': { blur: 1.5, node: () => <StreetBand /> },
};
