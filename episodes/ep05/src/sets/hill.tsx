import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { DayBand, DuskBand, TopBand, BaseBand } from '../art/hill_art';

/** Set "hill": the excavation site by day (8–10), the hill at dusk (14), top-down at dusk (12), the statue base close-up backdrop (11, 13). Ids "hill/<band>". */
export const HILL: Record<string, BandSpec> = {
  'hill/day': { node: () => <DayBand /> },
  'hill/dusk': { node: () => <DuskBand /> },
  'hill/top': { node: () => <TopBand /> },
  'hill/base': { blur: 8, node: () => <BaseBand /> },
};
