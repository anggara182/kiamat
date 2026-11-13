import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/village_kit';
import { TeacherRoom, Cemetery, EmptyClass, VillageYard } from '../art/village_art';

/**
 * Set "village" (shots 3, 4, 5, 6, 7). Static bands baked ONCE to public/baked/village/<band>.png. Art in FRAME coords via translate(108 192).
 *  room      = the old teacher's room with a window and a bookshelf (3)
 *  cemetery  = small cemetery with a fresh mound (4)
 *  classroom = the empty classroom with the teacher's chair (5)
 *  yard      = dusty village yard (6)
 *  (the night home of shot 7 is drawn live)
 */
export const VILLAGE: Record<string, BandSpec> = {
  'village/room': { node: () => <Fr><TeacherRoom /></Fr> },
  'village/cemetery': { node: () => <Fr><Cemetery /></Fr> },
  'village/classroom': { node: () => <Fr><EmptyClass /></Fr> },
  'village/yard': { node: () => <Fr><VillageYard /></Fr> },
};
