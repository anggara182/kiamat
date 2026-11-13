import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { Fr } from '../art/institutions_kit';
import { HospitalFront, Corridor, Classroom } from '../art/institutions_art';

/**
 * Set "institutions" (shots 5, 6, 7, 8). Static bands baked ONCE to public/baked/institutions/<band>.png. Art in FRAME coords via translate(108 192).
 *  hospital  = hospital entrance with glass doors and steps (5; 6 from a low angle with the crowd live)
 *  corridor  = hospital corridor in mint (7)
 *  classroom = classroom with the green chalkboard (8; chalk writing live)
 */
export const INSTITUTIONS: Record<string, BandSpec> = {
  'institutions/hospital': { node: () => <Fr><HospitalFront /></Fr> },
  'institutions/corridor': { node: () => <Fr><Corridor /></Fr> },
  'institutions/classroom': { node: () => <Fr><Classroom /></Fr> },
};
