import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/market_kit';
import { HouseBand, TerraceBand } from '../art/homes_art';

/**
 * Set "homes" (shots 9, 24). Static bands baked ONCE to public/baked/homes/<band>.png. Art in FRAME coords via translate(108 192).
 *  house   = small house front at noon with the gutter (mother, daughter, bucket, water live)
 *  terrace = dark terrace facing the lit mosque window across the alley (two silhouettes live)
 */
export const HOMES: Record<string, BandSpec> = {
  'homes/house': { node: () => <Fr><HouseBand /></Fr> },
  'homes/terrace': { node: () => <Fr><TerraceBand /></Fr> },
};
