import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/homes_kit';
import { TreatyHall, Hearth, Doorway, Classroom } from '../art/homes_art';

/**
 * Set "homes" (shots 3, 8, 11, 12). Static bands baked ONCE to public/baked/homes/<band>.png. Art in FRAME coords via translate(108 192).
 *  hall      = bright treaty hall (3; table, delegations, flashes live)
 *  hearth    = fireplace bricks + logs (8; fire, hand, burning treaty live)
 *  doorway   = house doorway at dawn, street behind (11; mother, son, walkers live)
 *  classroom = empty classroom with chairs on desks and a window onto a narrow street (12; fan, mother at the window live)
 */
export const HOMES: Record<string, BandSpec> = {
  'homes/hall': { node: () => <Fr><TreatyHall /></Fr> },
  'homes/hearth': { node: () => <Fr><Hearth /></Fr> },
  'homes/doorway': { node: () => <Fr><Doorway /></Fr> },
  'homes/classroom': { node: () => <Fr><Classroom /></Fr> },
};
