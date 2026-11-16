import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/village_kit';
import { Street, Courtyard, COURT_DAY, COURT_NIGHT, TeaStall } from '../art/village_art';

/**
 * Set "village" (shots 5, 6, 9, 10, 12). Static bands baked ONCE to public/baked/village/<band>.png. Art in FRAME coords via translate(108 192).
 *  street          = sun-scorched village street, mud-brick + concrete, palms, dust (5 pickup, 6 tanker; vehicles + people live)
 *  courtyard-day   = shaded courtyard with an arch toward the river (9)
 *  courtyard-night = the same courtyard by night (10; oil lamp live)
 *  teastall        = roadside tea stall (12)
 */
export const VILLAGE: Record<string, BandSpec> = {
  'village/street': { node: () => <Fr><Street /></Fr> },
  'village/courtyard-day': { node: () => <Fr><Courtyard pal={COURT_DAY} /></Fr> },
  'village/courtyard-night': { node: () => <Fr><Courtyard pal={COURT_NIGHT} night /></Fr> },
  'village/teastall': { node: () => <Fr><TeaStall /></Fr> },
};
