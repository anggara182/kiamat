import React from 'react';
import type { BandSpec } from '../comp/Bands';

/** Set "library" (shots 1, 2). Art drawn in FRAME coords through translate(108 192). */
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;

/** close on the library doors (shot 1): sandstone frame, tall wooden double doors, two handles */
export const DOORS = { x: 520, y: 260, w: 560, h: 1500, hy: 1150 };
const door = () => (
  <FR>
    <defs>{glow('ldSun', '#fff3d6', 0.6)}</defs>
    {R(-140, -230, 1370, 2400, '#cdb89a')}
    {Array.from({ length: 16 }, (_, i) => R(-140, -230 + i * 150, 1370, 3, '#b39c7c', 0.7))}
    {R(DOORS.x - 70, DOORS.y - 90, DOORS.w + 140, DOORS.h + 90, '#b8a282')}
    {R(DOORS.x - 70, DOORS.y - 90, DOORS.w + 140, 50, '#a08868')}
    {R(DOORS.x, DOORS.y, DOORS.w, DOORS.h, '#5a3a22')}
    {R(DOORS.x + DOORS.w / 2 - 4, DOORS.y, 8, DOORS.h, '#2e1c10')}
    {[0, 1].map((s) => [0, 1, 2].map((r) => R(DOORS.x + 40 + s * (DOORS.w / 2), DOORS.y + 60 + r * 470, DOORS.w / 2 - 80, 400, '#4a2e1a', 1, 8)))}
    {[-1, 1].map((s) => <g key={s}><rect x={DOORS.x + DOORS.w / 2 + s * 40 - 14} y={DOORS.hy - 90} width={28} height={180} rx={14} fill="#8a7a5a" /><rect x={DOORS.x + DOORS.w / 2 + s * 40 - 6} y={DOORS.hy - 80} width={6} height={160} fill="#c9b88a" /></g>)}
    {/* a faded notice (no readable text) */}
    <rect x={120} y={700} width={220} height={300} fill="#e8dcc0" opacity={0.6} transform="rotate(-3 230 850)" />
    {[0, 1, 2, 3].map((k) => R(150, 760 + k * 50, 160 - k * 20, 12, '#a89470', 0.6))}
    <ellipse cx={200} cy={200} rx={900} ry={900} fill="url(#ldSun)" />
    {R(-140, 1760, 1370, 500, '#a8926f')}
  </FR>
);

/** wide on the library steps (shot 2): facade, chained door, faded posters, plaza */
export const FACADE = { door: { x: 440, y: 520, w: 200, h: 360 }, stepsY: 900, plazaY: 1180 };
const steps = () => (
  <FR>
    <defs>{glow('lsSun', '#fff6dc', 0.5)}</defs>
    {R(-140, -230, 1370, 2400, '#dfe6ea')}
    <ellipse cx={900} cy={0} rx={700} ry={500} fill="url(#lsSun)" />
    {/* facade */}
    <path d="M-60 300 L540 120 L1140 300 Z" fill="#c2ac8c" />
    {R(-60, 300, 1200, 600, '#cdb89a')}
    {R(-60, 300, 1200, 30, '#b39c7c')}
    {[0, 1, 2, 3, 4, 5, 6].map((k) => k !== 3 && R(-20 + k * 170, 340, 60, 560, '#d9c6a6'))}
    {R(FACADE.door.x, FACADE.door.y, FACADE.door.w, FACADE.door.h, '#5a3a22')}
    {R(FACADE.door.x + 98, FACADE.door.y, 4, FACADE.door.h, '#2e1c10')}
    {/* faded posters */}
    {[[90, 560, -2], [260, 600, 3], [740, 580, -4], [900, 620, 2]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={110} height={150} fill={['#d9c9a8', '#cfc0a0', '#d4c4a4', '#cbbc9c'][i]} transform={`rotate(${r} ${x} ${y})`} opacity={0.85} />)}
    {/* steps + plaza */}
    {[0, 1, 2, 3, 4, 5].map((k) => R(-140 + k * 30, FACADE.stepsY + k * 46, 1370 - k * 60, 46, k % 2 ? '#c4ae8e' : '#d2bc9c'))}
    {R(-140, FACADE.plazaY, 1370, 1000, '#b8a688')}
    {Array.from({ length: 8 }, (_, i) => R(-140, FACADE.plazaY + 40 + i * i * 14, 1370, 2, '#a08e70'))}
  </FR>
);

export const LIBRARY: Record<string, BandSpec> = {
  'library/door': { blur: 1, node: door },
  'library/steps': { blur: 1, node: steps },
};
