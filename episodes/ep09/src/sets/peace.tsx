import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { SquareBand, PortBand, CampBand } from '../art/peace_art';

/** Set "peace" (EP09 shots 4, 5, 7, 9). No flags, insignia, symbols or weapons.
 *  square     = old-town square in celebration (S04)
 *  port-day   = port market by day: sea, cranes, headland (S05)
 *  port-night = the same port at night (S09)
 *  camp       = army camp at dusk: plain tents, trucks (S07) */
export const PEACE: Record<string, BandSpec> = {
  'peace/square': { node: () => <SquareBand /> },
  'peace/port-day': { node: () => <PortBand mood="day" /> },
  'peace/port-night': { node: () => <PortBand mood="night" /> },
  'peace/camp': { node: () => <CampBand /> },
};
