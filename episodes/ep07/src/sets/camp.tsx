import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/camp_kit';
import { TentInside, CampNight, CampDawn } from '../art/camp_art';

/**
 * Set "camp" (shots 7, 9, 10). Static bands baked ONCE to public/baked/camp/<band>.png. Art in FRAME coords via translate(108 192).
 *  tent  = inside a canvas tent by day, blanket on the sand (7)
 *  night = the tent camp at night, rows of tents (9; lanterns + flap live)
 *  dawn  = a row of empty tents at ash-rose dawn (10; sandals, shovels, dog live)
 */
export const CAMP: Record<string, BandSpec> = {
  'camp/tent': { node: () => <Fr><TentInside /></Fr> },
  'camp/night': { node: () => <Fr><CampNight /></Fr> },
  'camp/dawn': { node: () => <Fr><CampDawn /></Fr> },
};
