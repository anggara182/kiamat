import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { rng } from '../art/world';

/** Set "road" (shots 13, 15). Art drawn in FRAME coords through translate(108 192). */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

/** the switchback road (frame coords), climbing north up the mountain: headlights travel along it (live) */
export const SWITCHBACK: [number, number][] = [[1240, 780], [900, 760], [420, 720], [160, 660], [380, 600], [820, 560], [1000, 500], [760, 440], [420, 400], [300, 350], [520, 310], [700, 280]];
const mountains = () => {
  const r = rng(6);
  const d = SWITCHBACK.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <FR>
      <defs>{lin('rmSky', [[0, '#03050c'], [1, '#0e1426']])}</defs>
      {R(-140, -230, 1370, 2400, 'url(#rmSky)')}
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={-130 + r() * 1350} cy={-200 + r() * 500} r={1 + r() * 1.6} fill="#e8eef8" opacity={0.3 + r() * 0.5} />)}
      <path d="M-140 300 L120 160 L330 240 L560 110 L800 230 L1000 150 L1230 260 L1230 900 L-140 900 Z" fill="#0b0f1a" />
      <path d="M-140 520 L200 420 L520 470 L860 380 L1230 470 L1230 1000 L-140 1000 Z" fill="#0e1320" />
      <path d={d} stroke="#1c2230" strokeWidth={14} fill="none" strokeLinejoin="round" />
      <path d="M-140 760 L300 700 L700 720 L1230 680 L1230 1400 L-140 1400 Z" fill="#080b14" />
      {R(-140, 1400, 1370, 900, '#06070c')}
    </FR>
  );
};

/** dark mist with faint banner silhouettes on poles (title) */
const mist = () => (
  <FR>
    {R(-140, -230, 1370, 2400, '#06070b')}
    {[[80, 420], [260, 380], [460, 440], [700, 360], [900, 420], [1080, 390]].map(([x, y], i) => (
      <g key={i} fill="#12131a"><rect x={x} y={y} width={8} height={1100} /><path d={`M${x + 8} ${y} L${x + 150} ${y + 20} L${x + 140} ${y + 220} L${x + 8} ${y + 200} Z`} /></g>
    ))}
    {R(-140, 1500, 1370, 800, '#08090e')}
  </FR>
);

export const ROAD: Record<string, BandSpec> = {
  'road/mountains': { blur: 1, node: mountains },
  'road/mist': { blur: 8, node: mist },
};
