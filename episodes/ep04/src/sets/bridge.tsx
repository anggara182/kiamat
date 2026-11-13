import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { RiverBand, EndBand, YardBand } from '../art/bridge_art';

/** Set "bridge" (EP04 shots 9, 10, 11, 12, 13): one river, one new bridge.
 *  day   = the river side-on in hazy day light (S09 building, S10 opening); the bridge is live
 *  night = the same river at night (S11 the empty bridge falls)
 *  end   = the broken end of the bridge over black water (S12)
 *  yard  = a day street with a puddle (S13 the engineer and the van) */
export const BRIDGE: Record<string, BandSpec> = {
  'bridge/day': { node: () => <RiverBand mood="day" /> },
  'bridge/night': { node: () => <RiverBand mood="night" /> },
  'bridge/end': { node: () => <EndBand /> },
  'bridge/yard': { node: () => <YardBand /> },
};
