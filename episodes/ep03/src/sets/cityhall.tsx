import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { CityHall } from '../art/cityhall_art';

/** Set "cityhall": one civic building drawn burning (night), ruined (ash dawn) and dark (night). Ids "cityhall/<band>". */
export const CITYHALL: Record<string, BandSpec> = {
  'cityhall/fire': { node: () => <CityHall st="fire" /> },
  'cityhall/ruin': { node: () => <CityHall st="ruin" /> },
  'cityhall/dark': { node: () => <CityHall st="dark" /> },
};
