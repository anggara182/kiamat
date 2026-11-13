import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Corridor one-point perspective. */
export const VP = { x: 648, y: 1000 };
const NEAR = { l: -700, r: 700, t: -940, b: 1420 };
const pt = (rx: number, ry: number, z: number) => `${VP.x + rx / z},${VP.y + ry / z}`;
const quad = (rx0: number, ry0: number, rx1: number, ry1: number, z0: number, z1: number, wall: 'x' | 'y') =>
  wall === 'x'
    ? `M ${pt(rx0, ry0, z0)} L ${pt(rx0, ry0, z1)} L ${pt(rx0, ry1, z1)} L ${pt(rx0, ry1, z0)} Z`
    : `M ${pt(rx0, ry0, z0)} L ${pt(rx1, ry0, z0)} L ${pt(rx1, ry0, z1)} L ${pt(rx0, ry0, z1)} Z`;
export const ZEND = 6.2;
export const END = { x0: VP.x + NEAR.l / ZEND, x1: VP.x + NEAR.r / ZEND, y0: VP.y + NEAR.t / ZEND, y1: VP.y + NEAR.b / ZEND };
/** world point on the floor at depth z, lateral rx (relative units). */
export const floorPt = (rx: number, z: number) => ({ x: VP.x + rx / z, y: VP.y + NEAR.b / z, s: 1 / z });
/** bathroom window on the night exterior */
export const LIT = { x: 842, y: 1046, w: 74, h: 92 };

const WIN_Z = [1.05, 1.5, 2.1, 2.9, 3.9, 5.1, 6.2];

const Corridor = () => (
  <g>
    <defs>
      <linearGradient id="sc_sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a2233" /><stop offset="0.45" stopColor="#7d4268" /><stop offset="0.8" stopColor="#ff9a5a" /><stop offset="1" stopColor="#ffc98a" />
      </linearGradient>
      <linearGradient id="sc_rwall" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#3b3540" /><stop offset="1" stopColor="#6e5652" />
      </linearGradient>
      <linearGradient id="sc_floor" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#1c1719" /><stop offset="1" stopColor="#5e4744" />
      </linearGradient>
      <linearGradient id="sc_ceil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141219" /><stop offset="1" stopColor="#3a2f38" />
      </linearGradient>
      <radialGradient id="sc_endglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffb27a" stopOpacity="0.55" /><stop offset="1" stopColor="#ffb27a" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* surfaces */}
    <rect x={0} y={0} width={W} height={H} fill="#231d24" />
    <path d={`M ${pt(NEAR.l, NEAR.t, 1)} L ${pt(NEAR.r, NEAR.t, 1)} L ${pt(NEAR.r, NEAR.t, ZEND)} L ${pt(NEAR.l, NEAR.t, ZEND)} Z`} fill="url(#sc_ceil)" />
    <path d={`M ${pt(NEAR.l, NEAR.b, 1)} L ${pt(NEAR.r, NEAR.b, 1)} L ${pt(NEAR.r, NEAR.b, ZEND)} L ${pt(NEAR.l, NEAR.b, ZEND)} Z`} fill="url(#sc_floor)" />
    <path d={quad(NEAR.r, NEAR.t, 0, NEAR.b, 1, ZEND, 'x')} fill="url(#sc_rwall)" />
    <path d={quad(NEAR.l, NEAR.t, 0, NEAR.b, 1, ZEND, 'x')} fill="#2a2330" />
    {/* left wall windows: sunset sky */}
    <path d={`M ${pt(NEAR.l, -700, WIN_Z[0])} L ${pt(NEAR.l, -700, ZEND)} L ${pt(NEAR.l, 120, ZEND)} L ${pt(NEAR.l, 120, WIN_Z[0])} Z`} fill="url(#sc_sky)" />
    {/* distant rooftops through windows */}
    <path d={`M ${pt(NEAR.l, 20, WIN_Z[0])} L ${pt(NEAR.l, -60, 1.6)} L ${pt(NEAR.l, -10, 2.4)} L ${pt(NEAR.l, -80, 3.4)} L ${pt(NEAR.l, 0, ZEND)} L ${pt(NEAR.l, 120, ZEND)} L ${pt(NEAR.l, 120, WIN_Z[0])} Z`} fill="#3a2534" />
    {/* mullions + rail */}
    {WIN_Z.map((z, i) => <path key={i} d={`M ${pt(NEAR.l, -720, z)} L ${pt(NEAR.l, 140, z)}`} stroke="#1a1520" strokeWidth={Math.max(4, 34 / z)} />)}
    <path d={`M ${pt(NEAR.l, -300, 1.05)} L ${pt(NEAR.l, -300, ZEND)}`} stroke="#1a1520" strokeWidth={10} />
    <path d={`M ${pt(NEAR.l, 130, 1)} L ${pt(NEAR.l, 130, ZEND)}`} stroke="#140f17" strokeWidth={26} />
    {/* right wall: shoe cubbies / lockers */}
    <path d={quad(NEAR.r, -380, 0, 1100, 1.15, 4.6, 'x')} fill="#5b6470" />
    <path d={quad(NEAR.r, -380, 0, 1100, 1.15, 4.6, 'x')} fill="#2a2030" opacity={0.45} />
    {[1.15, 1.6, 2.2, 3.0, 3.8, 4.6].map((z, i) => <path key={i} d={`M ${pt(NEAR.r, -380, z)} L ${pt(NEAR.r, 1100, z)}`} stroke="#262a33" strokeWidth={Math.max(3, 18 / z)} />)}
    {[-380, 0, 370, 740, 1100].map((y, i) => <path key={i} d={`M ${pt(NEAR.r, y, 1.15)} L ${pt(NEAR.r, y, 4.6)}`} stroke="#262a33" strokeWidth={6} />)}
    {/* sun patches on floor and right wall (window light) */}
    {[[1.1, 1.45], [1.55, 2.0], [2.2, 2.75], [3.0, 3.7], [4.0, 4.9]].map(([a, b], i) => (
      <path key={i} d={`M ${pt(-520, NEAR.b, a)} L ${pt(420, NEAR.b, a + 0.25)} L ${pt(560, NEAR.b, b + 0.25)} L ${pt(-520, NEAR.b, b)} Z`} fill="#ff9a5a" opacity={0.16} />
    ))}
    {/* ceiling lights (off) */}
    {[1.4, 2.2, 3.3, 4.8].map((z, i) => <path key={i} d={`M ${pt(-90, NEAR.t + 4, z)} L ${pt(90, NEAR.t + 4, z)} L ${pt(90, NEAR.t + 4, z + 0.12)} L ${pt(-90, NEAR.t + 4, z + 0.12)} Z`} fill="#4a4550" />)}
    {/* end wall + bathroom door */}
    <rect x={END.x0} y={END.y0} width={END.x1 - END.x0} height={END.y1 - END.y0} fill="#4a3a40" />
    <ellipse cx={VP.x} cy={VP.y} rx={260} ry={260} fill="url(#sc_endglow)" />
    <rect x={VP.x - 40} y={VP.y - 64} width={80} height={VP.y + NEAR.b / ZEND - (VP.y - 64)} fill="#16121a" />
    <rect x={VP.x - 36} y={VP.y - 60} width={36} height={VP.y + NEAR.b / ZEND - (VP.y - 60)} fill="#221a22" />
    {/* girls' room sign, perpendicular plate */}
    <rect x={VP.x - 26} y={VP.y - 110} width={52} height={36} rx={4} fill="#efe3d6" />
    <circle cx={VP.x} cy={VP.y - 101} r={5} fill="#c3283b" />
    <path d={`M ${VP.x} ${VP.y - 95} L ${VP.x - 9} ${VP.y - 78} L ${VP.x + 9} ${VP.y - 78} Z`} fill="#c3283b" />
    {/* green exit sign (stairs) */}
    <rect x={VP.x + 112} y={VP.y - 168} width={64} height={28} fill="#2fae6a" />
    <rect x={VP.x + 118} y={VP.y - 163} width={18} height={18} fill="#e8fff2" />
  </g>
);

const CorridorFg = () => (
  <g>
    {/* near window pillar on the left + ceiling beam: dark framing */}
    <path d={`M 0 0 L 190 0 L 150 ${H} L 0 ${H} Z`} fill="#0b090d" />
    <path d={`M 0 0 L ${W} 0 L ${W} 210 Q 648 250 0 210 Z`} fill="#0b090d" />
    <path d={`M ${W} 0 L ${W - 90} 0 L ${W - 120} ${H} L ${W} ${H} Z`} fill="#0b090d" />
  </g>
);

const Night = () => {
  const r = rng(16);
  const floors = [0, 1, 2, 3];
  const bx0 = 180, bx1 = 1120, by0 = 820, by1 = 1500;
  return (
    <g>
      <defs>
        <linearGradient id="sc_nsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06080f" /><stop offset="0.6" stopColor="#141b2b" /><stop offset="1" stopColor="#2a3550" />
        </linearGradient>
        <linearGradient id="sc_bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3445" /><stop offset="1" stopColor="#151a26" />
        </linearGradient>
        <radialGradient id="sc_moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c8d4ee" stopOpacity="0.35" /><stop offset="1" stopColor="#c8d4ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#sc_nsky)" />
      <circle cx={400} cy={560} r={220} fill="url(#sc_moon)" />
      <circle cx={400} cy={560} r={34} fill="#dfe6f4" opacity={0.85} />
      {/* clock tower */}
      <rect x={570} y={680} width={160} height={160} fill="#232a3a" />
      <circle cx={650} cy={750} r={44} fill="#3a4458" /><circle cx={650} cy={750} r={36} fill="#1a2030" />
      <path d="M 650 750 L 650 722 M 650 750 L 670 758" stroke="#8592ad" strokeWidth={4} />
      {/* main block */}
      <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill="url(#sc_bld)" />
      <rect x={bx0 - 12} y={by0 - 14} width={bx1 - bx0 + 24} height={18} fill="#384156" />
      {floors.map((f) => <rect key={f} x={bx0} y={by0 + 60 + f * 160 + 104} width={bx1 - bx0} height={10} fill="#384156" opacity={0.7} />)}
      {floors.map((f) => Array.from({ length: 11 }).map((_, i) => {
        const x = bx0 + 32 + i * 82, y = by0 + 60 + f * 160;
        return <rect key={`${f}-${i}`} x={x} y={y} width={LIT.w} height={LIT.h} fill={r() > 0.85 ? '#232c40' : '#0e121c'} />;
      }))}
      {/* entrance */}
      <rect x={600} y={1390} width={100} height={110} fill="#0a0d14" />
      {/* ground */}
      <path d={`M 0 1500 L ${W} 1500 L ${W} ${H} L 0 ${H} Z`} fill="#0b0e16" />
      <path d="M 600 1500 L 700 1500 L 900 2304 L 380 2304 Z" fill="#1a2234" />
      <path d="M 0 1560 L 1296 1530" stroke="#1b2232" strokeWidth={6} />
    </g>
  );
};

const NightFg = () => (
  <g>
    {/* gate posts + fence + trees silhouettes */}
    <path d="M 0 1300 Q 90 1150 180 1230 Q 240 1120 320 1210 Q 360 1300 330 1420 L 300 1640 L 0 1640 Z" fill="#05070b" />
    <path d="M 1296 1260 Q 1200 1120 1110 1210 Q 1050 1140 990 1230 Q 960 1330 1000 1440 L 1040 1640 L 1296 1640 Z" fill="#05070b" />
    <rect x={0} y={1600} width={W} height={H - 1600} fill="#04060a" />
    {Array.from({ length: 33 }).map((_, i) => <rect key={i} x={i * 40} y={1540} width={8} height={70} fill="#04060a" />)}
    <rect x={0} y={1540} width={W} height={8} fill="#04060a" />
    <rect x={60} y={1380} width={70} height={260} fill="#05070b" /><rect x={1166} y={1380} width={70} height={260} fill="#05070b" />
  </g>
);

/** Set "school" (school corridor and exterior: sunset, night, stairs). Static bands baked ONCE to public/baked/school/<band>.png. Ids "school/<band>". */
export const SCHOOL: Record<string, BandSpec> = {
  'school/corridor': { node: () => <Corridor /> },
  'school/fg': { blur: 6, node: () => <CorridorFg /> },
  'school/night': { node: () => <Night /> },
  'school/nightfg': { blur: 3, node: () => <NightFg /> },
};
