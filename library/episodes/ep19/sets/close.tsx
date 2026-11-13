import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "close" (close-ups: the doll, hands, pencil writing, paper, clock). Static bands baked ONCE to public/baked/close/<band>.png. Ids "close/<band>". */
const planks = (fill: string, line: string) => (
  <>
    <rect x={0} y={0} width={W} height={H} fill={fill} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M${-100 + i * 260},0 L${-40 + i * 260},${H}`} stroke={line} strokeWidth={8} />
    ))}
  </>
);

export const CLOSE: Record<string, BandSpec> = {
  /** wooden floor under candle light (shots 5, 6, 9) */
  'close/floor': {
    node: () => (
      <>
        <defs>
          <radialGradient id="cfglow" cx="0.3" cy="0.3" r="0.8"><stop offset="0" stopColor="#ffc46b" stopOpacity={0.55} /><stop offset="0.45" stopColor="#a8672c" stopOpacity={0.25} /><stop offset="1" stopColor="#07080a" stopOpacity={0} /></radialGradient>
          <linearGradient id="cfdark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07080a" stopOpacity={0} /><stop offset="1" stopColor="#07080a" stopOpacity={0.85} /></linearGradient>
        </defs>
        {planks('#2c1d12', '#140c07')}
        <rect width={W} height={H} fill="url(#cfglow)" />
        <rect width={W} height={H} fill="url(#cfdark)" />
      </>
    ),
  },
  /** plaster wall lit from below by candles (shot 8) */
  'close/wall': {
    node: () => (
      <>
        <defs>
          <linearGradient id="cwall" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#7a5a34" /><stop offset="0.45" stopColor="#3a3630" /><stop offset="1" stopColor="#0d0d0e" /></linearGradient>
          <radialGradient id="cwglow" cx="0.45" cy="1" r="0.75"><stop offset="0" stopColor="#ffc46b" stopOpacity={0.6} /><stop offset="1" stopColor="#ffc46b" stopOpacity={0} /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#cwall)" />
        <rect width={W} height={H} fill="url(#cwglow)" />
        {/* poster corner edges, dim */}
        <path d="M0,500 L240,470 L270,1150 L0,1180 Z" fill="#2a2620" />
        <path d="M1296,1500 L1060,1530 L1080,2304 L1296,2304 Z" fill="#3c3227" />
      </>
    ),
  },
  /** desk top under a cold lamp at midnight (shot 12) */
  'close/desk': {
    node: () => (
      <>
        <defs>
          <radialGradient id="cdlamp" cx="0.65" cy="0.25" r="0.85"><stop offset="0" stopColor="#c9d6e6" stopOpacity={0.55} /><stop offset="0.5" stopColor="#5c6c82" stopOpacity={0.25} /><stop offset="1" stopColor="#07080a" stopOpacity={0} /></radialGradient>
        </defs>
        {planks('#1d1814', '#0d0b09')}
        <rect width={W} height={H} fill="url(#cdlamp)" />
      </>
    ),
  },
};
