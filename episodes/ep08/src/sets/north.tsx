import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { rng } from '../art/world';

/** Set "north" (shots 15, 16). Art drawn in FRAME coords through translate(108 192). */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;

/** grand cold hall: tall windows (snow is live), panelled walls, a long table, a desk lamp */
export const WINS = [[60, 140], [420, 140], [780, 140]] as const;
export const TABLE_Y = 1180;
const hall = () => (
  <FR>
    <defs>{glow('nhLamp', '#ffd9a0', 0.5)}</defs>
    {R(-140, -230, 1370, 2400, '#1c2230')}
    {Array.from({ length: 8 }, (_, i) => R(-140 + i * 180, 900, 150, 260, '#232a3a', 0.8, 6))}
    {WINS.map(([x, y], i) => <g key={i}>{R(x - 20, y - 20, 280, 700, '#121722')}{R(x, y, 240, 660, '#3a4458')}<path d={`M${x} ${y + 100} Q${x + 120} ${y - 40} ${x + 240} ${y + 100} L${x + 240} ${y} L${x} ${y} Z`} fill="#121722" />{R(x + 116, y, 8, 660, '#121722')}{R(x, y + 330, 240, 8, '#121722')}</g>)}
    {/* heavy curtains */}
    {[-60, 340, 700, 1060].map((x, i) => <path key={i} d={`M${x} -230 L${x + 80} -230 Q${x + 60} 400 ${x + 90} 880 L${x - 10} 880 Q${x + 20} 400 ${x} -230 Z`} fill="#3a1e24" />)}
    {/* long table */}
    <path d={`M-140 ${TABLE_Y} L1230 ${TABLE_Y - 30} L1230 ${TABLE_Y + 80} L-140 ${TABLE_Y + 110} Z`} fill="#3a2418" />
    <path d={`M-140 ${TABLE_Y} L1230 ${TABLE_Y - 30}`} stroke="#6a4a30" strokeWidth={6} />
    {R(-140, TABLE_Y + 110, 1370, 1000, '#141824')}
    <ellipse cx={540} cy={TABLE_Y - 40} rx={520} ry={260} fill="url(#nhLamp)" />
  </FR>
);

/** dark drifting-sand bed for the title */
const sand = () => {
  const r = rng(4);
  return (
    <FR>
      {R(-140, -230, 1370, 2400, '#06070c')}
      {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${-140 + r() * 1370} ${1000 + r() * 1200} q${80 + r() * 120} ${-20 - r() * 30} ${200 + r() * 200} 0`} stroke="#1a1814" strokeWidth={4} fill="none" />)}
    </FR>
  );
};

export const NORTH: Record<string, BandSpec> = {
  'north/hall': { blur: 3, node: hall },
  'north/sand': { blur: 2, node: sand },
};
