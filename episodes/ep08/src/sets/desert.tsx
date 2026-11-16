import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { NightBand, DayBand, DuskBand } from '../art/desert_art';

/** Set "desert": the flat plain at night (1, 2), the desert by day (9, 12), the pale plain ringed by low hills at dusk (10). Vehicles, dust and the collapses are live. */
export const DESERT: Record<string, BandSpec> = {
  'desert/night': { node: () => <NightBand /> },
  'desert/day': { node: () => <DayBand /> },
  'desert/dusk': { node: () => <DuskBand /> },
};
