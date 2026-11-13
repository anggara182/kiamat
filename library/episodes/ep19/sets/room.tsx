import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "room" (bedroom at night: circle of friends, candles, wall, window, dawn). Static bands baked ONCE to public/baked/room/<band>.png. Ids "room/<band>". */
export const FLOOR = 1180; // wall/floor line (world y)
export const CX = 648, CY = 1440; // circle centre on the floor (world)
export const WIN = { x: 820, y: 430, w: 300, h: 420 };

const Wall: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="rwall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14130f" />
        <stop offset="0.6" stopColor="#3a3630" />
        <stop offset="1" stopColor="#4a4238" />
      </linearGradient>
      <radialGradient id="rwallglow" cx="0.5" cy="0.62" r="0.5">
        <stop offset="0" stopColor="#7a6448" stopOpacity="0.55" />
        <stop offset="1" stopColor="#3a3630" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="rfloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b2c1f" />
        <stop offset="0.5" stopColor="#24190f" />
        <stop offset="1" stopColor="#0d0907" />
      </linearGradient>
      <linearGradient id="rwin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a2436" />
        <stop offset="1" stopColor="#2e3d55" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={FLOOR} fill="url(#rwall)" />
    <ellipse cx={CX} cy={FLOOR} rx={760} ry={560} fill="url(#rwallglow)" />
    {/* window with moon */}
    <rect x={WIN.x - 16} y={WIN.y - 16} width={WIN.w + 32} height={WIN.h + 32} fill="#17130f" />
    <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="url(#rwin)" />
    <circle cx={WIN.x + 200} cy={WIN.y + 110} r={38} fill="#c9d4e2" opacity={0.85} />
    <rect x={WIN.x + WIN.w / 2 - 6} y={WIN.y} width={12} height={WIN.h} fill="#17130f" />
    <rect x={WIN.x} y={WIN.y + WIN.h * 0.45} width={WIN.w} height={12} fill="#17130f" />
    {/* curtain */}
    <path d={`M${WIN.x - 70} ${WIN.y - 40} L${WIN.x + 40} ${WIN.y - 40} Q${WIN.x + 10} ${WIN.y + 250} ${WIN.x + 50} ${WIN.y + WIN.h + 90} L${WIN.x - 70} ${WIN.y + WIN.h + 90} Z`} fill="#2a2119" />
    {/* posters */}
    <rect x={190} y={470} width={190} height={260} fill="#4b4136" transform="rotate(-3 285 600)" />
    <rect x={208} y={492} width={154} height={150} fill="#5b4a3a" transform="rotate(-3 285 600)" />
    <rect x={430} y={560} width={150} height={200} fill="#423a31" transform="rotate(2 505 660)" />
    {/* wall clock */}
    <circle cx={560} cy={380} r={62} fill="#2a241d" />
    <circle cx={560} cy={380} r={52} fill="#6b6152" />
    <path d="M560 380 L560 340 M560 380 L586 372" stroke="#1a1612" strokeWidth={7} strokeLinecap="round" />
    {/* desk (left, against the wall) */}
    <rect x={60} y={900} width={330} height={26} fill="#2a1d13" />
    <rect x={80} y={926} width={22} height={260} fill="#1d150e" />
    <rect x={350} y={926} width={22} height={260} fill="#1d150e" />
    <rect x={250} y={926} width={110} height={130} fill="#22180f" />
    <rect x={130} y={840} width={70} height={60} fill="#1f1a15" />
    {/* skirting + floor */}
    <rect x={0} y={FLOOR - 14} width={W} height={14} fill="#1c1611" />
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="url(#rfloor)" />
  </g>
);

const Fg: React.FC = () => (
  <g fill="#07080a">
    {/* bed edge, left foreground */}
    <path d={`M0 1720 L360 1830 Q380 1840 380 1870 L380 ${H} L0 ${H} Z`} />
    <path d="M0 1690 Q200 1660 370 1760 L360 1830 L0 1720 Z" fill="#120f0c" />
    {/* chair leg / bag silhouette right */}
    <path d={`M1296 1780 Q1080 1800 1040 1960 Q1020 2100 1060 ${H} L1296 ${H} Z`} />
  </g>
);

export const ROOM: Record<string, BandSpec> = {
  'room/wall': { node: () => <Wall /> },
  'room/fg': { blur: 8, node: () => <Fg /> },
};
