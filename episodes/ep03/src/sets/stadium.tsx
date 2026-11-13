import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { BowlBand, LowBand, StandsBand, NearBand } from '../art/stadium_art';

/** Set "stadium": aerial bowl (19), low stage view (20), stands (21), dark near-crowd backdrop (22). Ids "stadium/<band>". */
export const STADIUM: Record<string, BandSpec> = {
  'stadium/bowl': { node: () => <BowlBand /> },
  'stadium/low': { node: () => <LowBand /> },
  'stadium/stands': { node: () => <StandsBand /> },
  'stadium/near': { blur: 3, node: () => <NearBand /> },
};
