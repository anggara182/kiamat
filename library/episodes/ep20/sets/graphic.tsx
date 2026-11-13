import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "graphic" (title, lore, CTA). Static bands baked ONCE to public/baked/graphic/<band>.png. Ids "graphic/<band>". */
const HY = 1380; // loch line in world space
export const GRAPHIC: Record<string, BandSpec> = {
  'graphic/sky': {
    node: () => (
      <>
        <defs>
          <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1116" />
            <stop offset="0.45" stopColor="#26333c" />
            <stop offset="0.6" stopColor="#56666e" />
            <stop offset="0.6" stopColor="#0f1d22" />
            <stop offset="1" stopColor="#070c0f" />
          </linearGradient>
          <radialGradient id="gs-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#b9c9cf" stopOpacity={0.55} />
            <stop offset="1" stopColor="#b9c9cf" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#gs-sky)" />
        <ellipse cx={W * 0.42} cy={HY - 60} rx={700} ry={420} fill="url(#gs-glow)" />
        <path d={`M 0 ${HY - 170} Q 220 ${HY - 330} 460 ${HY - 210} Q 640 ${HY - 120} 820 ${HY - 260} Q 1040 ${HY - 380} ${W} ${HY - 220} L ${W} ${HY} L 0 ${HY} Z`} fill="#3a2f3d" opacity={0.75} />
        <path d={`M 0 ${HY - 70} Q 300 ${HY - 160} 620 ${HY - 80} Q 900 ${HY - 20} ${W} ${HY - 120} L ${W} ${HY} L 0 ${HY} Z`} fill="#211b25" />
        <rect x={0} y={HY} width={W} height={H - HY} fill="#0f1d22" />
        <ellipse cx={W * 0.42} cy={HY + 40} rx={520} ry={40} fill="url(#gs-glow)" opacity={0.6} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={260 + i * 60} y={HY + 90 + i * 70} width={440 - i * 70} height={4} fill="#b9c9cf" opacity={0.18 - i * 0.03} />)}
        <circle cx={1000} cy={HY - 96} r={5} fill="#ffcc80" />
        <rect x={0} y={HY - 260} width={W} height={130} fill="#9aa7ad" opacity={0.08} />
      </>
    ),
  },
};
