import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/**
 * Set "whisper" (shots 4, 6, 7, 11). Mouth-to-ear close-ups, so every background is soft and out of focus.
 * Eight backgrounds packed as 4 bands x 2 cells: each band is 2 world cells wide (2592 x 2304).
 * Pick a cell with `cellCam(cam, 0|1)` (see shots/P.tsx). Art in a cell is drawn in FRAME coords.
 */
export const CELL_W = W;
const Cell: React.FC<{ i: 0 | 1; children: React.ReactNode }> = ({ i, children }) => (
  <g>
    <svg x={i * W} y={0} width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="hidden"><g transform="translate(108 192)">{children}</g></svg>
  </g>
);
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const grad = (id: string, stops: [number, string][], vertical = true) => (
  <linearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 0}>{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>
);
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const FULL = { x: -140, y: -230, w: 1370, h: 2400 };

/** shop at dawn: warm bulb, shelves of goods (shot 4) */
const shop = () => (
  <g>
    <defs>{grad('wShop', [[0, '#2a1f19'], [0.6, '#4a382b'], [1, '#1d1612']])}{glow('wBulb', '#ffd08a', 0.75)}</defs>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, 'url(#wShop)')}
    {[260, 600, 940, 1280].map((y) => <g key={y}>{R(-140, y, 1370, 22, '#8a7a64')}{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => R(-120 + k * 170, y - 120 + (k % 3) * 18, 120, 120 - (k % 3) * 18, ['#b9583f', '#d6b45c', '#5f7f8a', '#c9c2b0', '#7a5a8a'][(k + y / 20) % 5 | 0], 0.75, 6))}</g>)}
    <ellipse cx={160} cy={120} rx={700} ry={640} fill="url(#wBulb)" />
    <circle cx={160} cy={120} r={40} fill="#fff1c9" />
  </g>
);

/** inside an angkot: ceiling, bright street through the side window, vinyl seat back (shot 6) */
const angkot = () => (
  <g>
    <defs>{grad('wStreet', [[0, '#e9eef0'], [0.55, '#e4ddcb'], [1, '#b9ad94']])}</defs>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#5c4f45')}
    {R(-140, 240, 1370, 700, 'url(#wStreet)')}
    {[[-60, 420, 300, 520, '#d8cdb8'], [300, 480, 240, 460, '#c9bda6'], [600, 380, 360, 560, '#d8cdb8'], [1000, 460, 260, 480, '#cbbfa7']].map(([x, y, w, h, c], i) => R(x as number, y as number, w as number, h as number, c as string))}
    {[[120, 360, 160], [820, 330, 190]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#4d5a49" opacity={0.9} />)}
    {R(-140, -230, 1370, 470, '#cfc8bb')}
    {R(-140, 200, 1370, 46, '#2e3540')}
    {R(-140, 930, 1370, 50, '#2e3540')}
    {[-40, 460, 960].map((x) => R(x, 220, 40, 740, '#2e3540'))}
    {R(-140, 40, 1370, 16, '#9aa0a6', 1, 8)}
    <path d="M-140 1040 C200 1000 900 1000 1230 1040 L1230 2170 L-140 2170 Z" fill="#6a3a32" />
    {R(-140, 1040, 1370, 24, '#8a4f44')}
  </g>
);

/** pos ronda (guard post) at noon: tin roof shade, bamboo posts, slit drum, bright alley (shot 7) */
const ronda = () => (
  <g>
    <defs>{grad('wAlley', [[0, '#e9eef0'], [0.5, '#e2d8c4'], [1, '#a8987c']])}</defs>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, 'url(#wAlley)')}
    {R(-140, 300, 600, 900, '#d8cdb8')}{R(700, 260, 600, 940, '#cfc2aa')}
    <circle cx={560} cy={360} r={260} fill="#4d5a49" opacity={0.85} />
    {R(-140, -230, 1370, 420, '#5a4632')}
    <path d="M-140 190 L1230 190 L1230 230 L-140 230 Z" fill="#3a2c20" />
    {[40, 980].map((x) => R(x, 190, 60, 2000, '#b59a6a'))}
    {[40, 980].map((x) => R(x + 40, 190, 20, 2000, '#8a7350'))}
    <rect x={850} y={300} width={70} height={300} rx={30} fill="#8a5a34" />
    <rect x={878} y={370} width={14} height={160} rx={7} fill="#3a2414" />
    {R(-140, 1300, 1370, 900, '#7a6648')}
    {R(-140, 1300, 1370, 30, '#a08a64')}
  </g>
);

/** school gate (relay 1) */
const gate = () => (
  <g>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#e9eef0')}
    {R(-140, 600, 1370, 1600, '#d8cdb8')}
    <circle cx={900} cy={300} r={330} fill="#4d5a49" />
    {Array.from({ length: 16 }, (_, i) => R(-120 + i * 90, 420, 18, 1300, '#3e5a48'))}
    {R(-140, 480, 1370, 26, '#3e5a48')}{R(-140, 1160, 1370, 26, '#3e5a48')}
    {R(-140, 1700, 1370, 500, '#b9ad94')}
  </g>
);

/** market stall (relay 2) */
const market = () => (
  <g>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#d9cfbb')}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => R(-140 + k * 180, -230, 90, 600, k % 2 ? '#c0603a' : '#e6d9c0'))}
    <path d="M-140 370 Q540 430 1230 370 L1230 400 Q540 460 -140 400 Z" fill="#9a4a2e" />
    {R(-140, 420, 1370, 900, '#8f846f', 0.5)}
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-100 + i * 100} cy={1360 + (i % 2) * 40} r={70} fill={['#c4322b', '#6a8a3a', '#e0a63a'][i % 3]} opacity={0.9} />)}
    {R(-140, 1440, 1370, 800, '#7a5a3a')}
  </g>
);

/** barber shop (relay 3) */
const barber = () => (
  <g>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#e6e4dc')}
    {Array.from({ length: 12 }, (_, i) => R(-140, -230 + i * 120, 1370, 4, '#c9c6bc'))}
    <rect x={180} y={140} width={760} height={900} rx={30} fill="#a9bcc4" />
    <rect x={200} y={160} width={720} height={860} rx={24} fill="#c7d6dc" />
    <path d="M260 160 L440 160 L300 1020 L200 1020 Z" fill="#ffffff" opacity={0.35} />
    {R(-140, 1080, 1370, 40, '#8f846f')}
    {[0, 1, 2, 3, 4].map((k) => R(260 + k * 120, 990, 50, 90, ['#5f7f8a', '#c4322b', '#e0a63a', '#6a8a3a', '#7a5a8a'][k], 1, 10))}
    <rect x={1080} y={200} width={60} height={600} rx={30} fill="#f2f2f2" />
    {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M1080 ${240 + k * 110} L1140 ${200 + k * 110} L1140 ${240 + k * 110} L1080 ${280 + k * 110} Z`} fill={k % 2 ? '#2e4a8a' : '#c4322b'} />)}
  </g>
);

/** bus stop (relay 4) */
const busstop = () => (
  <g>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#e9eef0')}
    {R(-140, 300, 1370, 900, '#c9bda6')}
    <rect x={-140} y={420} width={1370} height={560} fill="#4a7a8a" />
    {[0, 1, 2, 3, 4, 5].map((k) => R(-100 + k * 230, 480, 180, 220, '#d8e4e8', 0.8, 10))}
    {R(-140, 980, 1370, 60, '#2a2018')}
    {R(-140, -230, 1370, 300, '#6d7680')}{R(-140, 60, 1370, 20, '#3a4048')}
    {R(-140, 1200, 1370, 1000, '#9a9a96')}{R(-140, 1200, 1370, 24, '#c9c6bc')}
  </g>
);

/** warung kopi (relay 5) */
const warung = () => (
  <g>
    {R(FULL.x, FULL.y, FULL.w, FULL.h, '#3a2c22')}
    {R(-140, -230, 1370, 500, '#e9eef0', 0.9)}
    {Array.from({ length: 10 }, (_, i) => R(-120 + i * 140, 120 + (i % 2) * 30, 90, 200, ['#c4322b', '#e0a63a', '#4a7a8a', '#6a8a3a'][i % 4], 0.85, 6))}
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-40 + k * 300} y={760} width={160} height={220} rx={30} fill="#c9d6dc" opacity={0.5} />)}
    {R(-140, 980, 1370, 60, '#8a6a48')}
    {R(-140, 1040, 1370, 1200, '#5a4632')}
  </g>
);

const band = (a: () => React.ReactNode, b: () => React.ReactNode) => () => (
  <g><Cell i={0}>{a()}</Cell><Cell i={1}>{b()}</Cell></g>
);

export const WHISPER: Record<string, BandSpec> = {
  'whisper/shop-warung': { blur: 9, w: 2 * W, h: H, node: band(shop, warung) },
  'whisper/angkot-bus': { blur: 9, w: 2 * W, h: H, node: band(angkot, busstop) },
  'whisper/ronda-gate': { blur: 9, w: 2 * W, h: H, node: band(ronda, gate) },
  'whisper/market-barber': { blur: 9, w: 2 * W, h: H, node: band(market, barber) },
};
