import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { RumourBand, DuskBand, GateBand, InsideBand } from '../art/kampung_mosque';

/**
 * Set "kampung": rumour image of the water tower (5, 12), the real tower at dusk (22), the mosque gate (10), the mosque interior (19).
 * Shot 18 (loudspeaker horns against the sky) is drawn live. Static bands baked ONCE to public/baked/kampung/<band>.png.
 */
export const KAMPUNG: Record<string, BandSpec> = {
  'kampung/rumour': { node: () => <RumourBand /> },
  'kampung/dusk': { node: () => <DuskBand /> },
  'kampung/gate': { node: () => <GateBand /> },
  'kampung/inside': { node: () => <InsideBand /> },
};
