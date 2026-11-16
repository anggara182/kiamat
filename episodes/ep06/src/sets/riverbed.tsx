import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { RiverScene } from '../art/riverbed_art';
import { GoldScene } from '../art/riverbed_gold';

/** Set "riverbed": the dry bed between high banks (day with the watching crowd, night empty), the raw gold mountain by day and at dawn. Shot 7's aerial desert is live. */
export const RIVERBED: Record<string, BandSpec> = {
  'riverbed/day': { node: () => <RiverScene m="day" /> },
  'riverbed/night': { node: () => <RiverScene m="night" crowd={false} /> },
  'riverbed/gold': { node: () => <GoldScene m="day" /> },
  'riverbed/golddawn': { node: () => <GoldScene m="dawn" /> },
};
