import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { BED, POOL, BedBand, PoolBand, FieldBand, TopBand } from '../art/banks_art';

/** Set "banks" (EP06 shots 2, 4, 8, 13, 14, 15): the dry Euphrates bed and its banks, scorched day.
 *  bed   = wide cracked riverbed with the near bank on the left (S02 boat, S13 girl + goat, S15 the village digs)
 *  pool  = tall: a shrinking pool near, a carpet of fish to the horizon (S04 crane up)
 *  field = dead cracked field, far village (S08)
 *  top   = top-down damp mud (S14 her hands uncover the gold) */
export const BANKS: Record<string, BandSpec> = {
  'banks/bed': { w: BED.w, node: () => <BedBand /> },
  'banks/pool': { h: POOL.h, node: () => <PoolBand /> },
  'banks/field': { node: () => <FieldBand /> },
  'banks/top': { node: () => <TopBand /> },
};
