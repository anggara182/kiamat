import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { DayRoad } from '../art/street_day';
import { TowerBand, TW } from '../art/street_tower';
import { DuskBand } from '../art/street_dusk';
import { WalkBand } from '../art/street_walk';

/** Set "street" (v2: shots 5, 7, 8, 11, 13, 16, 17). Static bands baked ONCE to public/baked/street/<band>.png.
 *  day   = S05: road to the horizon, far street, viaduct piers, long bridge shadow (sky + towers are live behind it)
 *  tower = S07: tall band, low-angle unfinished tower + crane, day palette (S13 draws the same tower live in its dusk palette)
 *  dusk  = S11: boulevard from an overpass, median lamp posts, shophouses, towers; sky transparent (live sky behind)
 *  walk  = S16: evening sidewalk, shophouse row with a black alley mouth
 *  (S08 top-down crossing and S17 bus stop are drawn live: flat shapes + moving people)
 */
export const STREET: Record<string, BandSpec> = {
  'street/day': { node: () => <DayRoad /> },
  'street/tower': { w: TW.w, h: TW.h, node: () => <TowerBand mood="day" /> },
  'street/dusk': { node: () => <DuskBand /> },
  'street/walk': { node: () => <WalkBand /> },
};
