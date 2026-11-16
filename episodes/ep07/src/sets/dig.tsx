import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { PitBand, DawnBand, CloseBand } from '../art/dig_art';

/** Set "dig" (EP07 shots 4, 5, 6, 12): digging pits in gold-flecked mud on a dry riverbed.
 *  pit   = harsh noon riverbed, the raw gold mass on the horizon, the pit (S04 water, S05 rope)
 *  dawn  = long-lens dawn bank with the empty pit at its foot (S06)
 *  close = soft ochre/gold backdrop for the close-up (S12)
 *  (people, shovels, rope, bottle, gold and dust are live) */
export const DIG: Record<string, BandSpec> = {
  'dig/pit': { node: () => <PitBand /> },
  'dig/dawn': { node: () => <DawnBand /> },
  'dig/close': { blur: 6, node: () => <CloseBand /> },
};
