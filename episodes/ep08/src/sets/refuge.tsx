import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { MeccaBand, SandBand, HoodBand } from '../art/refuge_art';

/** Set "refuge" (EP08 shots 7, 11, 13, 14). The Sacred House is NOT drawn (only the crowd, minarets and the glow).
 *  mecca-night = night court, arcades, tall generic minarets (S07); the glow and the crowd are live
 *  mecca-dawn  = the same view at dawn (S14)
 *  sand        = flat dawn sand, tire tracks that end (S13)
 *  hood        = macro on a truck hood in the desert sun (S11, soft) */
export const REFUGE: Record<string, BandSpec> = {
  'refuge/mecca-night': { node: () => <MeccaBand mood="night" /> },
  'refuge/mecca-dawn': { node: () => <MeccaBand mood="dawn" /> },
  'refuge/sand': { node: () => <SandBand /> },
  'refuge/hood': { blur: 3, node: () => <HoodBand /> },
};
