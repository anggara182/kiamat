import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/streets_day_kit';
import { DayMarket, Barricade, DarkRoom } from '../art/streets_day_art';

/**
 * Set "streets", H part (shots 4, 5, 8). Band ids streets/day-* and streets/room-* only (P owns streets/night-*).
 * Static bands baked ONCE to public/baked/streets/<band>.png. Art in FRAME coords via translate(108 192).
 *  day-market    = busy old-stone market street with stall awnings (4; fruit stall + people live)
 *  day-barricade = grey street, barbed-wire barricade, bakery window (5; guards, queue, light live)
 *  room-dark     = the dark room of the men who fear him (8; table, map, lamp, men live)
 */
export const STREETS_DAY: Record<string, BandSpec> = {
  'streets/day-market': { node: () => <Fr><DayMarket /></Fr> },
  'streets/day-barricade': { node: () => <Fr><Barricade /></Fr> },
  'streets/room-dark': { node: () => <Fr><DarkRoom /></Fr> },
};
