import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { RidgeBand, ValleyBand, CoastBand, MistBand } from '../art/banners_art';

/** Set "banners": the ridge crest (1), the valley from above (2, 6), the dusk coast (10), the dawn mist valley (14). Banners, armies, ships, fires and the bird are live. */
export const BANNERS: Record<string, BandSpec> = {
  'banners/ridge': { node: () => <RidgeBand /> },
  'banners/valley': { node: () => <ValleyBand /> },
  'banners/coast': { node: () => <CoastBand /> },
  'banners/mist': { node: () => <MistBand /> },
};
