import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { RainBand, GoldBand, BarnBand } from '../art/harvest_art';

/** Set "harvest" (EP05 shots 15, 16, 17).
 *  rain = green terraced paddies under a grey-green sky (S15)
 *  gold = golden rice fields at harvest, dirt track (S16)
 *  barn = warehouse interior with high windows (S17)
 *  (rain, people, carts, sacks and banknotes are live) */
export const HARVEST: Record<string, BandSpec> = {
  'harvest/rain': { node: () => <RainBand /> },
  'harvest/gold': { node: () => <GoldBand /> },
  'harvest/barn': { node: () => <BarnBand /> },
};
