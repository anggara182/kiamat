import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { DeepBand, WallBand, SkyBand, DirtBand } from '../art/alley_art';

/** Set "alley" (EP02 shots 13, 14, 15, 16, 17, 20, 21): one narrow kampung alley at harsh noon.
 *  deep = looking down the alley (S13 crowd turning in, S21 the young man alone, crowd leaving)
 *  wall = the alley wall straight on, gutter + ground (S14 the young man at the pipe; S15 soft behind the close-up)
 *  sky  = low angle up between the walls to the white sky (S16 the ring of the crowd)
 *  dirt = the ground, pebbles (S17 the hand and the stone)
 *  (S20 uses a live backdrop; people, laundry, pipe, water, dust, cat are live) */
export const ALLEY: Record<string, BandSpec> = {
  'alley/deep': { node: () => <DeepBand /> },
  'alley/wall': { node: () => <WallBand /> },
  'alley/sky': { node: () => <SkyBand /> },
  'alley/dirt': { blur: 2, node: () => <DirtBand /> },
};
