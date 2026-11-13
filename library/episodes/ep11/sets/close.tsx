import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { Tin, Coin } from '../art/close_art';

/** Shared layout (world space). */
export const BOWL = { cx: 648, cy: 1230, rx: 270, ry: 104 };
export const DOOR_Y = 760;
export const TIN = { cx: 640, cy: 1300 };

const Floor: React.FC<{ dawn?: boolean }> = ({ dawn }) => {
  const wall = dawn ? ['#3a3a40', '#6b6460'] : ['#07090f', '#141a26'];
  const floor = dawn ? ['#4e3e30', '#241a12'] : ['#121216', '#060608'];
  const gap = dawn ? '#fff1d0' : '#cfe0f2';
  const id = dawn ? 'd' : 'n';
  return (
    <g>
      <defs>
        <linearGradient id={`wall${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={wall[0]} /><stop offset="1" stopColor={wall[1]} /></linearGradient>
        <linearGradient id={`floor${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={floor[0]} /><stop offset="1" stopColor={floor[1]} /></linearGradient>
        <linearGradient id={`beam${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={gap} stopOpacity={dawn ? 0.3 : 0.13} /><stop offset="1" stopColor={gap} stopOpacity={0} /></linearGradient>
        <radialGradient id={`pool${id}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={gap} stopOpacity={dawn ? 0.3 : 0.2} /><stop offset="1" stopColor={gap} stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={W} height={DOOR_Y} fill={`url(#wall${id})`} />
      {/* door planks */}
      <rect x={250} y={0} width={800} height={DOOR_Y} fill={dawn ? '#4a3a2e' : '#120f12'} />
      {[450, 650, 850].map((x) => <rect key={x} x={x - 3} y={0} width={6} height={DOOR_Y} fill="#000" opacity={0.45} />)}
      <rect x={250} y={420} width={800} height={22} fill="#000" opacity={0.3} />
      <rect x={236} y={0} width={14} height={DOOR_Y} fill="#000" opacity={0.6} />
      <rect x={1050} y={0} width={14} height={DOOR_Y} fill="#000" opacity={0.6} />
      {/* floor */}
      <rect y={DOOR_Y} width={W} height={H - DOOR_Y} fill={`url(#floor${id})`} />
      {[-900, -500, -150, 150, 500, 900, 1300, 1700, 2100].map((x, i) => (
        <path key={i} d={`M${648 + (x - 648) * 0.35} ${DOOR_Y} L${x} ${H}`} stroke="#000" strokeWidth={4} opacity={0.35} />
      ))}
      {/* light through the gap under the door */}
      <path d={`M250 ${DOOR_Y} L1050 ${DOOR_Y} L1280 ${DOOR_Y + 900} L60 ${DOOR_Y + 900} Z`} fill={`url(#beam${id})`} />
      <ellipse cx={648} cy={BOWL.cy + 30} rx={520} ry={260} fill={`url(#pool${id})`} />
      <rect x={250} y={DOOR_Y - 12} width={800} height={14} fill={gap} />
      <rect x={250} y={DOOR_Y - 4} width={800} height={4} fill="#ffffff" opacity={0.8} />
    </g>
  );
};

/** Set "close". Ids "close/<band>". */
export const CLOSE: Record<string, BandSpec> = {
  'close/table': {
    node: () => (
      <g>
        <defs>
          <radialGradient id="bulbG" cx="0.62" cy="0.28" r="0.55"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="0.5" stopColor="#7a4a22" stopOpacity={0.25} /><stop offset="1" stopColor="#0b0f18" stopOpacity={0} /></radialGradient>
          <linearGradient id="tableG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5a4130" /><stop offset="1" stopColor="#1e140e" /></linearGradient>
        </defs>
        <rect width={W} height={H} fill="#0e0c0e" />
        <rect width={W} height={1100} fill="url(#bulbG)" />
        {/* shelf silhouettes behind */}
        <rect x={0} y={560} width={W} height={18} fill="#000" opacity={0.6} />
        {[120, 260, 380, 900, 1030, 1150].map((x, i) => <rect key={x} x={x} y={430 + (i % 2) * 30} width={90} height={130 - (i % 2) * 30} rx={8} fill={['#3a2e3a', '#2e3a34', '#3e3426'][i % 3]} opacity={0.7} />)}
        {/* table */}
        <rect x={0} y={1080} width={W} height={H - 1080} fill="url(#tableG)" />
        <rect x={0} y={1080} width={W} height={6} fill="#ffd27a" opacity={0.35} />
        {[1180, 1320, 1500, 1740].map((y) => <path key={y} d={`M0 ${y} Q648 ${y - 14} ${W} ${y + 6}`} stroke="#000" strokeWidth={3} opacity={0.3} fill="none" />)}
        <Tin cx={TIN.cx} cy={TIN.cy} />
        <Coin x={280} y={1400} r={50} />
        <Coin x={360} y={1440} r={44} />
        <Coin x={300} y={1372} r={46} />
        <Coin x={960} y={1420} r={48} />
        <Coin x={1050} y={1470} r={42} />
      </g>
    ),
  },
  'close/floor': { node: () => <Floor /> },
  'close/dawn': { node: () => <Floor dawn /> },
  'close/fg': {
    blur: 14,
    node: () => (
      <g>
        <path d={`M0 1500 Q200 1600 260 ${H} L0 ${H} Z`} fill="#050506" />
        <path d={`M${W} 1700 Q1100 1900 1080 ${H} L${W} ${H} Z`} fill="#050506" />
        <rect x={0} y={0} width={120} height={1300} fill="#050506" />
      </g>
    ),
  },
};
