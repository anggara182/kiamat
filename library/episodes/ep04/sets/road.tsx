import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "road" (night road + cemetery gate, motorbike riding). Static bands baked ONCE to public/baked/road/<band>.png. Ids "road/<band>". */
export const RH = 1180; // horizon (world y)
export const GATE = { l: 680, r: 1000, ground: 1452 };
export const LAMP = { x: 560, y: 806, poleX: 420 };

const farLine = (fill: string) => (
  <g fill={fill}>
    <path d={`M 0,${RH} L 0,1090 C 60,1060 110,1080 150,1050 C 200,1020 240,1060 300,1070 L 300,1120 L 360,1120 L 360,1080 L 430,1080 L 430,1130 C 520,1110 600,1120 700,1100 C 760,1080 800,1110 860,1120 L 900,1120 L 900,1070 L 960,1070 L 960,1110 C 1060,1090 1140,1060 1200,1080 C 1240,1090 1270,1080 1296,1070 L 1296,${RH} Z`} />
  </g>
);

const Sky: React.FC<{ dawn?: boolean }> = ({ dawn }) => (
  <g>
    <defs>
      <linearGradient id={dawn ? 'skyD' : 'skyN'} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={RH}>
        {dawn ? <>
          <stop offset="0" stopColor="#24294a" /><stop offset="0.45" stopColor="#5b5576" /><stop offset="0.78" stopColor="#c98478" /><stop offset="1" stopColor="#ffcf96" />
        </> : <>
          <stop offset="0" stopColor="#0a0d1c" /><stop offset="0.55" stopColor="#1b2238" /><stop offset="0.86" stopColor="#2e3550" /><stop offset="1" stopColor="#4a3a40" />
        </>}
      </linearGradient>
      <radialGradient id={dawn ? 'sunD' : 'glowN'} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={dawn ? '#fff0c8' : '#5a4448'} stopOpacity={dawn ? 0.9 : 0.6} />
        <stop offset="1" stopColor={dawn ? '#ffb070' : '#4a3a40'} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={dawn ? '#3a3046' : '#0b0d18'} />
    <rect width={W} height={RH + 4} fill={`url(#${dawn ? 'skyD' : 'skyN'})`} />
    <ellipse cx={dawn ? 300 : 860} cy={RH} rx={dawn ? 520 : 640} ry={dawn ? 300 : 220} fill={`url(#${dawn ? 'sunD' : 'glowN'})`} />
    {!dawn && <g fill="#cfd6ea">{[[160, 260, 1.6], [420, 140, 1.2], [700, 330, 1.4], [980, 200, 1.8], [1160, 420, 1.2], [300, 520, 1.1], [860, 560, 1.3], [560, 90, 1.1]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.6} />)}</g>}
    {!dawn && <g><circle cx={980} cy={420} r={34} fill="#d9dbe6" opacity={0.85} /><circle cx={994} cy={410} r={32} fill="#11152a" /></g>}
    {farLine(dawn ? '#4a4058' : '#20263a')}
  </g>
);

/** Cemetery wall, gate, graves, frangipani, lamp pole, road. Same art for night and dawn (colors swap). */
const Mid: React.FC<{ dawn?: boolean }> = ({ dawn }) => {
  const near = dawn ? '#1d1a28' : '#07080f', mid = dawn ? '#2c2738' : '#121626', far = dawn ? '#3e3648' : '#1a2032';
  const road = dawn ? '#3a3344' : '#0d0f19', g = GATE;
  return (
    <g>
      {/* grave field beyond the wall */}
      <rect x={0} y={RH - 2} width={W} height={300} fill={far} />
      <g fill={far}>{[[720, 1380, 16, 46], [800, 1370, 14, 38], [880, 1388, 18, 50], [960, 1375, 14, 40], [760, 1408, 15, 36], [930, 1415, 15, 34], [560, 1360, 14, 40], [1100, 1366, 16, 42], [220, 1356, 14, 38], [1220, 1380, 16, 44]].map(([x, y, w, h], i) =>
        <path key={i} d={`M ${x - w},${y} L ${x - w},${y - h + w} A ${w} ${w} 0 0 1 ${x + w},${y - h + w} L ${x + w},${y} Z`} fill={dawn ? '#2e2a3a' : '#0f1322'} />)}</g>
      {/* frangipani tree, right, behind wall */}
      <g fill={mid}>
        <path d="M 1130,1380 C 1126,1250 1110,1120 1080,1020 C 1070,990 1090,985 1098,1010 C 1120,1080 1136,1150 1142,1200 C 1150,1120 1180,1040 1220,990 C 1236,975 1248,990 1236,1004 C 1196,1060 1170,1150 1162,1260 L 1166,1380 Z" />
        <ellipse cx={1060} cy={990} rx={90} ry={46} /><ellipse cx={1150} cy={940} rx={70} ry={40} /><ellipse cx={1250} cy={970} rx={90} ry={50} /><ellipse cx={1210} cy={900} rx={60} ry={34} />
      </g>
      <g fill={dawn ? '#f3e2d0' : '#c9c2b0'} opacity={dawn ? 0.5 : 0.35}>{[[1040, 975], [1090, 1000], [1150, 925], [1240, 955], [1270, 990], [1200, 892]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} />)}</g>
      {/* low wall left and right of the gate */}
      <path d={`M 0,1340 L ${g.l},1340 L ${g.l},${g.ground} L 0,${g.ground} Z M ${g.r},1340 L ${W},1340 L ${W},${g.ground} L ${g.r},${g.ground} Z`} fill={mid} />
      <path d={`M 0,1332 L ${g.l},1332 L ${g.l},1346 L 0,1346 Z M ${g.r},1332 L ${W},1332 L ${W},1346 L ${g.r},1346 Z`} fill={dawn ? '#4a4256' : '#252c42'} />
      {/* gate posts + arch */}
      <path d={`M ${g.l - 34},${g.ground} L ${g.l - 34},1090 L ${g.l + 6},1090 L ${g.l + 6},${g.ground} Z M ${g.r - 6},${g.ground} L ${g.r - 6},1090 L ${g.r + 34},1090 L ${g.r + 34},${g.ground} Z`} fill={near} />
      <path d={`M ${g.l - 44},1092 L ${g.l + 16},1092 L ${g.l + 16},1076 L ${g.l - 44},1076 Z M ${g.r - 16},1092 L ${g.r + 44},1092 L ${g.r + 44},1076 L ${g.r - 16},1076 Z`} fill={near} />
      <path d={`M ${g.l - 20},1080 C ${g.l + 60},1000 ${g.r - 60},1000 ${g.r + 20},1080 L ${g.r + 20},1100 C ${g.r - 60},1028 ${g.l + 60},1028 ${g.l - 20},1100 Z`} fill={near} />
      <rect x={(g.l + g.r) / 2 - 70} y={1012} width={140} height={34} rx={4} fill={near} />
      <rect x={(g.l + g.r) / 2 - 58} y={1022} width={116} height={14} rx={2} fill={dawn ? '#3e3648' : '#1c2234'} />
      {/* ground: verge + road */}
      <rect x={0} y={g.ground} width={W} height={H - g.ground} fill={dawn ? '#2a2534' : '#0a0c15'} />
      <path d={`M 0,1478 L ${W},1478 L ${W},${H} L 0,${H} Z`} fill={road} />
      <rect x={0} y={1470} width={W} height={8} fill={dawn ? '#5a4f62' : '#1e2436'} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${i * 300 - 40},1760 L ${i * 300 + 120},1760 L ${i * 300 + 126},1772 L ${i * 300 - 46},1772 Z`} fill={dawn ? '#6d6070' : '#2a2f40'} />)}
      {/* lamp pole (left) */}
      <path d={`M ${LAMP.poleX - 9},1488 L ${LAMP.poleX - 6},${LAMP.y + 40} C ${LAMP.poleX - 4},${LAMP.y - 10} ${LAMP.poleX + 40},${LAMP.y - 30} ${LAMP.x - 20},${LAMP.y - 22} L ${LAMP.x - 20},${LAMP.y - 12} C ${LAMP.poleX + 40},${LAMP.y - 20} ${LAMP.poleX + 6},${LAMP.y} ${LAMP.poleX + 6},${LAMP.y + 40} L ${LAMP.poleX + 9},1488 Z`} fill={near} />
      <path d={`M ${LAMP.x - 46},${LAMP.y - 24} L ${LAMP.x + 24},${LAMP.y - 24} L ${LAMP.x + 12},${LAMP.y - 6} L ${LAMP.x - 34},${LAMP.y - 6} Z`} fill={near} />
      <rect x={LAMP.poleX - 16} y={1470} width={32} height={18} fill={near} />
    </g>
  );
};

/** Foreground framing: dark weeds bottom corners, frangipani branch top-left. */
const Fg: React.FC = () => (
  <g fill="#05060b">
    <path d="M 0,2304 L 0,1880 C 30,1900 50,1960 60,2010 C 70,1940 90,1890 120,1860 C 110,1930 108,1990 116,2040 C 140,1990 170,1960 210,1950 C 180,2010 170,2080 180,2140 L 300,2304 Z" />
    <path d="M 1296,2304 L 1296,1900 C 1270,1920 1250,1970 1244,2020 C 1230,1960 1206,1920 1170,1900 C 1186,1970 1190,2030 1180,2080 C 1150,2040 1120,2020 1080,2014 C 1110,2070 1120,2140 1110,2200 L 1000,2304 Z" />
    <path d="M -20,150 C 120,190 240,260 330,360 L 320,372 C 240,290 120,220 -20,180 Z" />
    <g>{[[120, 210, -20], [220, 270, 10], [300, 350, 40], [180, 300, 70], [60, 250, 60]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx={70} ry={20} transform={`rotate(${a} ${x} ${y})`} />)}</g>
  </g>
);

export const ROAD: Record<string, BandSpec> = {
  'road/sky': { node: () => <Sky /> },
  'road/dawn': { node: () => <Sky dawn /> },
  'road/mid': { node: () => <Mid /> },
  'road/fg': { blur: 3, node: () => <Fg /> },
};
