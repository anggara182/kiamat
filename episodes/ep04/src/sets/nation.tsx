import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { MarchBand, CrowdBand, SquareBand } from '../art/nation_art';

/** Set "nation": the dawn overpass into a city (1), a blurred day crowd (2), a city square from high (3). Shot 4's skylines are live. Ids "nation/<band>". */
export const NATION: Record<string, BandSpec> = {
  'nation/march': { node: () => <MarchBand /> },
  'nation/crowd': { blur: 10, node: () => <CrowdBand /> },
  'nation/square': { node: () => <SquareBand /> },
};
