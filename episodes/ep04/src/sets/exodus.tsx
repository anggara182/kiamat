import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { rng } from '../art/world';

/** Set "exodus" (shots 14–17). Art drawn in FRAME coords through translate(108 192). */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

/** abandoned council office: dark wood, one dusty amber beam from a low left window; top of frame stays dark (quote) */
export const OFFICE = { win: { x: -40, y: 820, w: 220, h: 420 }, chair: { x: 600, y: 1150 } };
const office = () => (
  <FR>
    <defs>{lin('eoWall', [[0, '#0d0a08'], [0.45, '#1a140f'], [1, '#2a2018']])}{glow('eoPool', '#d9b27a', 0.4)}</defs>
    {R(-140, -230, 1370, 2400, 'url(#eoWall)')}
    {/* wall panelling (low contrast) */}
    {[0, 1, 2, 3, 4, 5, 6].map((k) => R(-120 + k * 200, 820, 170, 360, '#2a2018', 0.5, 6))}
    {/* low window, the only light */}
    {R(OFFICE.win.x, OFFICE.win.y, OFFICE.win.w, OFFICE.win.h, '#e8d0a0')}
    {R(OFFICE.win.x + 100, OFFICE.win.y, 12, OFFICE.win.h, '#3a2c20')}
    {R(OFFICE.win.x, OFFICE.win.y + 200, OFFICE.win.w, 12, '#3a2c20')}
    {/* floor */}
    <path d="M-140 1260 L1230 1260 L1230 2170 L-140 2170 Z" fill="#1c140f" />
    {[1360, 1520, 1740, 2000].map((y) => R(-140, y, 1370, 3, '#2e2218'))}
    <ellipse cx={720} cy={1420} rx={420} ry={110} fill="url(#eoPool)" />
    {/* long desk */}
    <path d="M60 1180 L1120 1160 L1180 1230 L20 1260 Z" fill="#4a3020" />
    <path d="M20 1260 L1180 1230 L1180 1290 L20 1320 Z" fill="#2e1e14" />
    {[60, 1110].map((x) => R(x, 1300, 40, 260, '#2a1a10'))}
    {/* scattered papers, a toppled empty nameplate (no text) */}
    {[[200, 1205, -8], [380, 1198, 6], [880, 1188, -4]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={120} height={22} fill="#cfc4ac" opacity={0.7} transform={`rotate(${r} ${x} ${y})`} />)}
    <path d="M620 1190 L740 1186 L736 1204 L616 1208 Z" fill="#8a6a3a" />
    {[[300, 1600, 20], [820, 1700, -14], [560, 1880, 8]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={150} height={100} fill="#a89f8c" opacity={0.35} transform={`rotate(${r} ${x} ${y})`} />)}
  </FR>
);

/** bus terminal by day: canopy, pillars, the far platform; the bus itself is live */
const terminal = () => (
  <FR>
    <defs>{lin('etSky', [[0, '#e6e8ea'], [1, '#d6d2c6']])}</defs>
    {R(-140, -230, 1370, 2400, 'url(#etSky)')}
    {R(-140, 380, 1370, 700, '#c9c2b2')}
    {[0, 1, 2, 3, 4].map((k) => R(-100 + k * 300, 480, 200, 260, '#b8b2a6'))}
    {R(-140, -230, 1370, 360, '#6d7378')}{R(-140, 130, 1370, 26, '#3a4048')}
    {[-40, 520, 1080].map((x) => R(x, 150, 50, 1200, '#9aa0a6'))}
    {R(-140, 1340, 1370, 900, '#a8a196')}{R(-140, 1340, 1370, 18, '#d8d2c4')}
    <path d="M-140 1340 L1230 1340 L1230 1400 L-140 1400 Z" fill="#2a2018" opacity={0.22} />
  </FR>
);

/** low-angle street: hazy sky, building tops leaning in (perspective), far crowd */
const street = () => {
  const r = rng(9);
  return (
    <FR>
      <defs>{lin('esSky', [[0, '#cfd6dc'], [0.6, '#e6e8ea'], [1, '#f2ece0']])}</defs>
      {R(-140, -230, 1370, 2400, 'url(#esSky)')}
      <path d="M-140 -230 L180 -230 L300 1400 L-140 1400 Z" fill="#a8a196" />
      <path d="M1230 -230 L900 -230 L780 1400 L1230 1400 Z" fill="#b8b2a6" />
      {Array.from({ length: 10 }, (_, i) => R(-120 + (i % 2) * 120, -150 + i * 150, 80, 90, '#6d6a64', 0.6))}
      {Array.from({ length: 10 }, (_, i) => R(1000 - (i % 2) * 100, -150 + i * 150, 80, 90, '#6d6a64', 0.6))}
      {Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={-100 + r() * 1300} cy={1380 + r() * 120} rx={30} ry={36} fill="#5a5650" />)}
      {R(-140, 1440, 1370, 800, '#4a4640')}
    </FR>
  );
};

/** library gates at night under a sodium lamp: steps, columns behind the bars */
export const GATE = { x0: 120, x1: 960, y0: 420, y1: 1500 };
const library = () => (
  <FR>
    <defs>{lin('elSky', [[0, '#06080f'], [1, '#141a30']])}{glow('elLamp', '#ffb347', 0.45)}</defs>
    {R(-140, -230, 1370, 2400, 'url(#elSky)')}
    {/* library facade: pediment + columns, dark */}
    <path d="M-40 360 L540 140 L1120 360 Z" fill="#1c1a20" />
    {R(-40, 360, 1160, 40, '#24222a')}
    {[0, 1, 2, 3, 4, 5].map((k) => R(20 + k * 200, 400, 70, 760, '#22202a'))}
    {R(-140, 1160, 1370, 60, '#2a2830')}{R(-140, 1220, 1370, 60, '#302e36')}{R(-140, 1280, 1370, 900, '#16151a')}
    <ellipse cx={980} cy={260} rx={760} ry={900} fill="url(#elLamp)" />
  </FR>
);

export const EXODUS: Record<string, BandSpec> = {
  'exodus/office': { blur: 1, node: office },
  'exodus/terminal': { blur: 7, node: terminal },
  'exodus/street': { blur: 5, node: street },
  'exodus/library': { blur: 3, node: library },
};
