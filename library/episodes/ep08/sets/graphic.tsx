import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { NightWorld } from '../art/graphic_art';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/night': { node: () => <NightWorld /> },
};
