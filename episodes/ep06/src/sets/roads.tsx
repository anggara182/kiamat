import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { rng } from '../art/world';

/** Set "roads" (shots 18, 19, 20). Art drawn in FRAME coords through translate(108 192). */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

/** night desert: horizon, the river line, roads converging on it (shot 18) */
export const NIGHT = { hy: 760, vp: { x: 560, y: 770 }, roads: [-1400, -700, -150, 450, 1100, 1800] };
const night = () => {
  const r = rng(3);
  const { hy, vp, roads } = NIGHT;
  return (
    <FR>
      <defs>{lin('rnSky', [[0, '#04060e'], [0.8, '#0c1428'], [1, '#1a2238']])}{glow('rnMoon', '#a9b8d6', 0.35)}</defs>
      {R(-140, -230, 1370, hy + 230, 'url(#rnSky)')}
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={-130 + r() * 1350} cy={-200 + r() * (hy + 100)} r={1 + r() * 1.8} fill="#e8eef8" opacity={0.3 + r() * 0.6} />)}
      <circle cx={900} cy={140} r={46} fill="#dfe6f2" /><ellipse cx={900} cy={140} rx={300} ry={300} fill="url(#rnMoon)" />
      {R(-140, hy, 1370, 1500, '#0d1018')}
      {/* the dry river: a dark band with a moonlit thread */}
      <path d={`M-140 ${hy + 4} Q560 ${hy - 6} 1230 ${hy + 6} L1230 ${hy + 26} Q560 ${hy + 18} -140 ${hy + 28} Z`} fill="#06080c" />
      <path d={`M-140 ${hy + 14} Q560 ${hy + 6} 1230 ${hy + 16}`} stroke="#a9b8d6" strokeWidth={2} opacity={0.5} />
      {roads.map((x, i) => <path key={i} d={`M${vp.x - 3} ${vp.y} L${vp.x + 3} ${vp.y} L${vp.x + x + 90} 2200 L${vp.x + x - 90} 2200 Z`} fill="#1a1d26" />)}
      {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={-140 + r() * 1370} cy={hy + 60 + r() * 1200} rx={30 + r() * 60} ry={6 + r() * 8} fill="#151924" />)}
    </FR>
  );
};

/** dawn desert seen from above-ish: horizon + riverbed far, wide dusty plain (shot 19) */
export const DAWN = { hy: 520, vp: { x: 560, y: 530 } };
const dawn = () => {
  const r = rng(21);
  return (
    <FR>
      <defs>{lin('rdSky', [[0, '#2b2440'], [0.55, '#9a5e5e'], [1, '#f2a65e']])}{glow('rdSun', '#ffd79a', 0.9)}{lin('rdGround', [[0, '#c98a5a'], [0.3, '#a0704a'], [1, '#5a4034']])}</defs>
      {R(-140, -230, 1370, DAWN.hy + 230, 'url(#rdSky)')}
      <ellipse cx={560} cy={DAWN.hy} rx={420} ry={200} fill="url(#rdSun)" />
      <circle cx={560} cy={DAWN.hy + 10} r={60} fill="#fff0c8" />
      {R(-140, DAWN.hy, 1370, 3200, 'url(#rdGround)')}
      <path d={`M-140 ${DAWN.hy + 8} Q560 ${DAWN.hy - 4} 1230 ${DAWN.hy + 8} L1230 ${DAWN.hy + 40} Q560 ${DAWN.hy + 24} -140 ${DAWN.hy + 40} Z`} fill="#6a4a3a" />
      {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={-140 + r() * 1370} cy={DAWN.hy + 60 + r() * 1900} rx={40 + r() * 90} ry={8 + r() * 14} fill="#8a5e40" opacity={0.5} />)}
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-140 + r() * 1370} ${DAWN.hy + 300 + r() * 1700} l${60 + r() * 80} ${-10 + r() * 20} l${40 + r() * 60} ${10 + r() * 20}`} stroke="#4a3524" strokeWidth={3} fill="none" opacity={0.6} />)}
    </FR>
  );
};

/** dark cracked riverbed for the title (shot 20) */
const riverbed = () => {
  const r = rng(8);
  return (
    <FR>
      <defs>{lin('rtBed', [[0, '#05060a'], [0.5, '#0e0c0e'], [1, '#05050a']])}</defs>
      {R(-140, -230, 1370, 2400, 'url(#rtBed)')}
      {Array.from({ length: 50 }, (_, i) => { const x = -140 + r() * 1370, y = 900 + r() * 1300; return <path key={i} d={`M${x} ${y} l${30 + r() * 70} ${-20 + r() * 40} l${20 + r() * 60} ${-10 + r() * 30}`} stroke="#1c1814" strokeWidth={3} fill="none" />; })}
    </FR>
  );
};

export const ROADS: Record<string, BandSpec> = {
  'roads/night': { blur: 1, node: night },
  'roads/dawn': { blur: 2, node: dawn },
  'roads/riverbed': { blur: 2, node: riverbed },
};
