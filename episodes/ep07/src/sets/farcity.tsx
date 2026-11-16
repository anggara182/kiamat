import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { H, rng } from '../art/world';

/** Set "farcity" (shots 3, 14, 15). Art drawn in FRAME coords through translate(108 192) unless noted. */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

/** roads converging on the far river (shot 3). Wide band (2000 px) for the lateral track; band x = frame x + 460. */
export const ROADS_W = 2000, ROADS = { vpx: 1500, vpy: 720 };
const roads = () => {
  const r = rng(13);
  const { vpx, vpy } = ROADS;
  return (
    <g transform="translate(0 192)">
      <defs>{lin('frSky', [[0, '#e9dcc0'], [0.6, '#f2e4c4'], [1, '#e2c28a']])}{glow('frSun', '#fff6dc', 0.7)}</defs>
      {R(0, -230, ROADS_W, H, 'url(#frSky)')}
      <ellipse cx={1400} cy={300} rx={700} ry={420} fill="url(#frSun)" />
      {/* far hills + the river glinting at the vanishing point */}
      <path d={`M0 ${vpy} C300 640 700 600 1000 650 C1300 690 1600 610 ${ROADS_W} 660 L${ROADS_W} ${vpy + 40} L0 ${vpy + 40} Z`} fill="#c9a87a" />
      <path d={`M${vpx - 600} ${vpy + 6} Q${vpx} ${vpy - 10} ${vpx + 500} ${vpy + 4} L${vpx + 500} ${vpy + 22} Q${vpx} ${vpy + 10} ${vpx - 600} ${vpy + 24} Z`} fill="#fff1c9" />
      {/* plain */}
      {R(0, vpy + 20, ROADS_W, H, '#d8b27a')}
      {/* converging dirt roads */}
      {[-900, -300, 300, 1100].map((x0, i) => <path key={i} d={`M${vpx - 8} ${vpy + 20} L${vpx + 8} ${vpy + 20} L${vpx + x0 + 260} 2200 L${vpx + x0 - 120} 2200 Z`} fill="#e8cf9e" opacity={0.85} />)}
      {Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={r() * ROADS_W} cy={vpy + 60 + r() * 1300} rx={20 + r() * 40} ry={8 + r() * 10} fill="#b8925e" opacity={0.5} />)}
      {/* dust haze bands */}
      {R(0, vpy - 40, ROADS_W, 160, '#f2e4c4', 0.5)}
    </g>
  );
};

/** quiet old stone street at night, warm doorway glow (shot 14) */
export const DOOR = { x: 700, y: 640, w: 170, h: 360 };
const street = () => (
  <FR>
    <defs>{lin('fsSky', [[0, '#05060c'], [1, '#141428']])}{glow('fsDoor', '#ffd79a', 0.6)}{glow('fsSpill', '#ffd79a', 0.35)}</defs>
    {R(-140, -230, 1370, 2400, 'url(#fsSky)')}
    {/* stone houses, both sides, receding */}
    <path d="M-140 -230 L380 200 L380 1080 L-140 1500 Z" fill="#2a2536" />
    <path d="M1230 -230 L900 160 L900 1060 L1230 1420 Z" fill="#332d40" />
    <path d="M380 260 L900 230 L900 1060 L380 1080 Z" fill="#3a3346" />
    {Array.from({ length: 9 }, (_, i) => R(400 + (i % 3) * 170, 300 + Math.floor(i / 3) * 110, 100, 60, '#26213a'))}
    {[[60, 300], [60, 700], [200, 500]].map(([x, y], i) => R(x, y, 90, 130, '#1c1828'))}
    {/* the warm doorway in the end wall */}
    <ellipse cx={DOOR.x + DOOR.w / 2} cy={DOOR.y + DOOR.h / 2} rx={420} ry={380} fill="url(#fsDoor)" />
    {R(DOOR.x, DOOR.y, DOOR.w, DOOR.h, '#ffd79a')}
    {R(DOOR.x + 18, DOOR.y + 18, DOOR.w - 36, DOOR.h - 18, '#ffe9c2')}
    {/* cobbled street with the light spill */}
    <path d="M-140 1500 L380 1080 L900 1060 L1230 1420 L1230 2170 L-140 2170 Z" fill="#1c1824" />
    <path d={`M${DOOR.x} ${DOOR.y + DOOR.h} L${DOOR.x + DOOR.w} ${DOOR.y + DOOR.h} L1100 2170 L300 2170 Z`} fill="#ffd79a" opacity={0.12} />
    <ellipse cx={DOOR.x + 80} cy={1300} rx={500} ry={220} fill="url(#fsSpill)" />
    {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={-100 + ((i * 197) % 1330)} cy={1150 + ((i * 89) % 900)} rx={34} ry={12} fill="#26202e" opacity={0.7} />)}
  </FR>
);

/** close: stone wall, the doorway glow far left behind the pair (shot 15) */
const line = () => (
  <FR>
    <defs>{glow('flDoor', '#ffd79a', 0.55)}</defs>
    {R(-140, -230, 1370, 2400, '#1c1828')}
    {Array.from({ length: 12 }, (_, i) => R(-140, -230 + i * 200, 1370, 6, '#14111c'))}
    {Array.from({ length: 30 }, (_, i) => R(-140 + ((i * 263) % 1370), -230 + Math.floor(i / 3) * 200 + 6, 6, 194, '#14111c'))}
    <ellipse cx={60} cy={700} rx={700} ry={800} fill="url(#flDoor)" />
    {R(-90, 400, 200, 520, '#ffd79a', 0.85)}
    {R(-140, 1500, 1370, 700, '#14111a')}
  </FR>
);

export const FARCITY: Record<string, BandSpec> = {
  'farcity/roads': { blur: 4, w: ROADS_W, h: H, node: roads },
  'farcity/street': { blur: 2, node: street },
  'farcity/line': { blur: 10, node: line },
};
