import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/home_kit';
import { KitchenBand } from '../art/home_kitchen';
import { CarportBand } from '../art/home_carport';

/**
 * Set "home" (shots 2, 3, 4, 15): one small kampung house. Static bands baked ONCE to public/baked/home/<band>.png.
 *  carport = shot 3, carport + open gate + the alley waking at dawn (scooter, people, windows live)
 *  kitchen = shot 2, the kitchen fully lit by the tube (a live darkness layer dims it before the tube catches)
 * Art is drawn in FRAME coords through translate(108 192).
 */
export const HOME: Record<string, BandSpec> = {
  'home/kitchen': { node: () => <Fr><KitchenBand /></Fr> },
  'home/carport': { node: () => <Fr><CarportBand /></Fr> },
};
