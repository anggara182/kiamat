import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/homes_kit';
import { DiningA, DiningB, HighwayBand } from '../art/homes_rooms';

/**
 * Set "homes" (shots 8, 9, 14, 23). Static bands baked ONCE to public/baked/homes/<band>.png. Art in FRAME coords via translate(108 192).
 *  dining-a = dinner room at night, TV wall (8)
 *  dining-b = the reverse angle, window wall (9)
 *  highway  = highway at ash dawn toward the neighbouring city, roadside stall (23)
 *  (shot 14's three short beats are drawn live)
 */
export const HOMES: Record<string, BandSpec> = {
  'homes/dining-a': { node: () => <Fr><DiningA /></Fr> },
  'homes/dining-b': { node: () => <Fr><DiningB /></Fr> },
  'homes/highway': { node: () => <Fr><HighwayBand /></Fr> },
};
