import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/**
 * Set "walls" (shots 3, 4, 5, 11, 12). Art drawn in FRAME coords through translate(108 192).
 * walls/wall-pair holds two cells side by side (night wall for 4, day wall for 5): pick with cellCam in shots/P.tsx.
 */
export const CELL_W = W;
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const Cell: React.FC<{ i: 0 | 1; children: React.ReactNode }> = ({ i, children }) => (
  <svg x={i * W} y={0} width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="hidden"><g transform="translate(108 192)">{children}</g></svg>
);
const R = (x: number, y: number, w: number, h: number, fill: string, op = 1, rx = 0) => <rect x={x} y={y} width={w} height={h} fill={fill} opacity={op} rx={rx} />;
const glow = (id: string, c: string, o: number) => <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>;
const lin = (id: string, stops: [number, string][]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>;

/** night coffee stall; the city on the hill with the lit city hall, small, far behind (shot 3) */
export const HALL = { x: 700, y: 420 };
const stall = () => {
  const r = rng(5);
  return (
    <FR>
      <defs>{lin('wsSky', [[0, '#06080f'], [0.7, '#141a30'], [1, '#2a2c44']])}{glow('wsHall', '#ffcf86', 0.55)}{glow('wsBulb', '#ffd08a', 0.7)}</defs>
      {R(-140, -230, 1370, 2400, 'url(#wsSky)')}
      {/* hill + city lights */}
      <path d="M-140 640 C200 560 480 470 700 470 C920 470 1100 560 1230 600 L1230 900 L-140 900 Z" fill="#0b0e1a" />
      {Array.from({ length: 70 }, (_, i) => <rect key={i} x={-120 + r() * 1340} y={560 + r() * 320} width={5} height={7} fill="#ffcf86" opacity={0.25 + r() * 0.5} />)}
      {/* city hall: columns + dome, lit */}
      <ellipse cx={HALL.x} cy={HALL.y} rx={260} ry={170} fill="url(#wsHall)" />
      <path d={`M${HALL.x - 120} 470 L${HALL.x - 120} 400 L${HALL.x + 120} 400 L${HALL.x + 120} 470 Z`} fill="#e8c88a" />
      {[0, 1, 2, 3, 4, 5].map((k) => R(HALL.x - 110 + k * 42, 404, 12, 62, '#9a7a4a'))}
      <path d={`M${HALL.x - 130} 400 L${HALL.x} 360 L${HALL.x + 130} 400 Z`} fill="#f2d79a" />
      <path d={`M${HALL.x - 40} 362 Q${HALL.x} 300 ${HALL.x + 40} 362 Z`} fill="#f2d79a" />
      {/* stall: awning edge on top, bulb, counter at the bottom */}
      <path d="M-140 -230 L1230 -230 L1230 150 Q540 200 -140 150 Z" fill="#3a1f1a" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-140 + i * 170} 150 Q${-55 + i * 170} 200 ${30 + i * 170} 150`} fill={i % 2 ? '#7a2e24' : '#c9b48a'} />)}
      <ellipse cx={230} cy={230} rx={520} ry={420} fill="url(#wsBulb)" />
      <circle cx={230} cy={210} r={22} fill="#fff1c9" />
      {R(-140, 1300, 1370, 900, '#3a2a20')}
      {R(-140, 1300, 1370, 22, '#8a6a48')}
      {[120, 330, 760, 980].map((x, i) => <rect key={i} x={x} y={1210} width={60} height={92} rx={8} fill={['#c9d6dc', '#c9d6dc', '#e0b26a', '#c9d6dc'][i]} opacity={0.6} />)}
    </FR>
  );
};

/** wall pair: 0 = night street wall under a lamp (shot 4), 1 = harsh day wall (shot 5) */
const wallNight = () => (
  <g>
    <defs>{glow('wnLamp', '#ffcf86', 0.5)}{lin('wnWall', [[0, '#3a3530'], [1, '#1c1a18']])}</defs>
    {R(-140, -230, 1370, 2400, 'url(#wnWall)')}
    {Array.from({ length: 14 }, (_, i) => R(-140, -230 + i * 170, 1370, 4, '#151311', 0.7))}
    {Array.from({ length: 40 }, (_, i) => R(-140 + ((i * 137) % 1370), -230 + Math.floor(i / 3) * 170 + 4, 4, 166, '#151311', 0.5))}
    <ellipse cx={300} cy={300} rx={1000} ry={900} fill="url(#wnLamp)" />
    {[[200, 1150, 200, 120], [820, 400, 140, 90]].map(([x, y, w, h], i) => <ellipse key={i} cx={x} cy={y} rx={w} ry={h} fill="#000" opacity={0.18} />)}
    {R(-140, 1500, 1370, 700, '#141210')}
  </g>
);
const wallDay = () => (
  <g>
    {R(-140, -230, 1370, 2400, '#cfc7b6')}
    {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={-100 + ((i * 211) % 1330)} cy={-100 + ((i * 397) % 1900)} rx={60 + (i % 4) * 30} ry={30 + (i % 3) * 20} fill="#a89f8c" opacity={0.25} />)}
    <path d="M-140 -230 L1230 -230 L1230 80 L-140 260 Z" fill="#2a2018" opacity={0.28} />
    {R(-140, 1560, 1370, 600, '#9a927f')}
    {R(-140, 1560, 1370, 20, '#7d7666')}
  </g>
);

/** the mayor's office by day: window light, desk, empty frame (shot 11) */
export const WIN = { x: 640, y: 120, w: 440, h: 760 };
const office = () => (
  <FR>
    <defs>{glow('woSun', '#fffdf2', 0.7)}</defs>
    {R(-140, -230, 1370, 2400, '#cbbfa8')}
    {R(-140, 1100, 1370, 1100, '#6a4a34')}
    {R(WIN.x - 30, WIN.y - 30, WIN.w + 60, WIN.h + 60, '#8a7a64')}
    {R(WIN.x, WIN.y, WIN.w, WIN.h, '#e9eef0')}
    <path d={`M${WIN.x} ${WIN.y + WIN.h * 0.7} L${WIN.x + WIN.w} ${WIN.y + WIN.h * 0.62} L${WIN.x + WIN.w} ${WIN.y + WIN.h} L${WIN.x} ${WIN.y + WIN.h} Z`} fill="#b8b2a6" />
    <ellipse cx={WIN.x + WIN.w / 2} cy={WIN.y + WIN.h / 2} rx={600} ry={700} fill="url(#woSun)" />
    <path d={`M${WIN.x} ${WIN.y + WIN.h} L${WIN.x + WIN.w} ${WIN.y + WIN.h} L${WIN.x + WIN.w - 300} 2000 L${WIN.x - 640} 2000 Z`} fill="#fff6dc" opacity={0.18} />
    {/* empty portrait frame (no face, no symbol) and a bookcase */}
    <rect x={80} y={180} width={300} height={380} fill="#5a4632" />
    <rect x={100} y={200} width={260} height={340} fill="#a89f8c" />
    {R(-140, 640, 420, 460, '#4a3628')}
    {[0, 1, 2].map((r) => <g key={r}>{R(-120, 680 + r * 140, 380, 10, '#2e2018')}{[0, 1, 2, 3, 4, 5].map((k) => R(-110 + k * 60, 690 + r * 140 - 100 + (k % 3) * 10, 40, 100 - (k % 3) * 10, ['#7a3a2e', '#3a4a5e', '#8a7a4a'][k % 3]))}</g>)}
    {/* desk */}
    <path d="M60 1080 L1080 1020 L1230 1100 L1230 1260 L-60 1300 Z" fill="#4a2e1e" />
    <path d="M60 1080 L1080 1020 L1230 1100 L-60 1160 Z" fill="#6a4430" />
    {R(-60, 1300, 1290, 900, '#2e1c12')}
  </FR>
);

/** night road to the vanishing point with lamp pools (shot 12) */
export const VP = { x: 560, y: 860 };
const road = () => (
  <FR>
    <defs>{lin('wrSky', [[0, '#05070f'], [1, '#141a30']])}{glow('wrPool', '#ffcf86', 0.35)}</defs>
    {R(-140, -230, 1370, 1100, 'url(#wrSky)')}
    <path d={`M-140 ${VP.y} L${VP.x - 60} ${VP.y - 40} L${VP.x - 60} ${VP.y} Z`} fill="#0a0c16" />
    {[[-140, 600, 300], [200, 700, 160], [800, 680, 200], [1000, 560, 260]].map(([x, y, w], i) => R(x, y, w, VP.y - y + 6, '#0b0e1a'))}
    <path d={`M-140 2170 L${VP.x - 8} ${VP.y} L${VP.x + 8} ${VP.y} L1230 2170 Z`} fill="#16171c" />
    <path d={`M-140 ${VP.y} L-140 2170 L${VP.x - 8} ${VP.y} Z`} fill="#0d0e12" />
    <path d={`M1230 ${VP.y} L1230 2170 L${VP.x + 8} ${VP.y} Z`} fill="#0f1014" />
    {Array.from({ length: 9 }, (_, i) => { const k = Math.pow(0.72, i), y = VP.y + 1300 * k, w = 18 * k; return <path key={i} d={`M${VP.x - w} ${y} L${VP.x + w} ${y} L${VP.x + w * 0.7} ${y - 160 * k} L${VP.x - w * 0.7} ${y - 160 * k} Z`} fill="#d9d2b8" opacity={0.5} />; })}
    {[0, 1, 2, 3].map((i) => { const k = Math.pow(0.6, i), x = VP.x + 760 * k, y = VP.y + 900 * k; return <g key={i}><rect x={x} y={y - 1100 * k} width={12 * k + 2} height={1100 * k} fill="#05060a" /><ellipse cx={x - 80 * k} cy={y} rx={420 * k} ry={120 * k} fill="url(#wrPool)" /><circle cx={x - 40 * k} cy={y - 1100 * k} r={14 * k + 2} fill="#ffe0a0" /></g>; })}
  </FR>
);

export const WALLS: Record<string, BandSpec> = {
  'walls/stall': { blur: 3, node: stall },
  'walls/wall-pair': { blur: 1, w: 2 * W, h: H, node: () => <g><Cell i={0}>{wallNight()}</Cell><Cell i={1}>{wallDay()}</Cell></g> },
  'walls/office': { blur: 2, node: office },
  'walls/road': { blur: 1, node: road },
};
