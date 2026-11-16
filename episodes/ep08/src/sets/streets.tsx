import React from 'react';
import type { BandSpec } from '../comp/Bands';

/**
 * Set "streets", NIGHT part (owned by P.tsx): band ids `streets/night-*` only. The day part lives in H's own file.
 * Art drawn in FRAME coords through translate(108 192).
 */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

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

/** dark alley, long lens: side door near-left, the alley narrowing to a lamp-lit road crossing at the far end (shot 6) */
export const ALLEY = { door: { x: 40, y: 760, w: 170, h: 420 }, end: { x: 600, y: 900 }, corner: 690 };
const alley = () => (
  <FR>
    <defs>{glow('naLamp', '#ffd79a', 0.55)}{glow('naDoor', '#ffd79a', 0.45)}</defs>
    {R(-140, -230, 1370, 2400, '#05060c')}
    {/* far road crossing, lit by a lamp */}
    <ellipse cx={ALLEY.end.x} cy={ALLEY.end.y - 60} rx={260} ry={220} fill="url(#naLamp)" />
    {R(430, 760, 330, 200, '#2a2430')}
    <rect x={ALLEY.corner + 20} y={560} width={10} height={300} fill="#0c0a10" /><circle cx={ALLEY.corner + 25} cy={560} r={14} fill="#ffe0a0" />
    {/* alley walls in steep perspective (long lens = gently compressed) */}
    <path d="M-140 -230 L430 560 L430 1000 L-140 1900 Z" fill="#26212f" />
    <path d={`M1230 -230 L${ALLEY.corner} 560 L${ALLEY.corner} 1000 L1230 1900 Z`} fill="#2c2636" />
    {Array.from({ length: 10 }, (_, i) => R(-140 + i * 50, 300 + i * 40, 20, 900 - i * 60, '#1c1826', 0.6))}
    <path d={`M430 1000 L${ALLEY.corner} 1000 L1230 1900 L-140 1900 Z`} fill="#16131c" />
    <path d={`M560 1000 L580 1000 L640 1900 L480 1900 Z`} fill="#0e0c12" opacity={0.6} />
    {/* side door spilling warm light */}
    {R(ALLEY.door.x, ALLEY.door.y, ALLEY.door.w, ALLEY.door.h, '#ffd79a', 0.9)}
    <ellipse cx={ALLEY.door.x + 160} cy={ALLEY.door.y + ALLEY.door.h + 40} rx={360} ry={140} fill="url(#naDoor)" />
    {/* barbed wire coil on the right wall top */}
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={1000 - i * 26} cy={240 + i * 26} rx={30} ry={14} fill="none" stroke="#6a6a72" strokeWidth={3} opacity={0.6} />)}
  </FR>
);

export const STREETS: Record<string, BandSpec> = {
  'streets/night-street': { blur: 2, node: street },
  'streets/night-alley': { blur: 2, node: alley },
};
