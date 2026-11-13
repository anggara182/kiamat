import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { DaySky, DayRoad } from '../art/street_day';
import { TowerBand, TW } from '../art/street_tower';
import { DuskBand } from '../art/street_dusk';

/** Set "street". Static bands baked ONCE to public/baked/street/<band>.png. Ids "street/<band>".
 *  sky   = shot 2: hazy morning sky, low sun, far towers (far parallax, slight haze blur)
 *  day   = shot 2: road to the horizon, far street, viaduct piers, long bridge shadow (mid)
 *  tower = shot 3a: tall band, low-angle unfinished tower + crane against the pale sky (tilt)
 *  dusk  = shot 6: boulevard, median lamp posts, buildings, towers; sky left transparent (live sky behind)
 *  (shot 3b, the top-down crossing, is drawn live: flat shapes + moving dots)
 */
export const STREET: Record<string, BandSpec> = {
  'street/sky': { blur: 1.5, node: () => <DaySky /> },
  'street/day': { node: () => <DayRoad /> },
  'street/tower': { w: TW.w, h: TW.h, node: () => <TowerBand /> },
  'street/dusk': { node: () => <DuskBand /> },
};
