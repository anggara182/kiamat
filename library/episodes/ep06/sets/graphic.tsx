import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {
  /** dark ward wall gradient behind the title / CTA. */
  'graphic/wall': {
    node: () => (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070c0d" />
            <stop offset="0.55" stopColor="#14201f" />
            <stop offset="1" stopColor="#070c0d" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#gw)" />
      </svg>
    ),
  },
};
