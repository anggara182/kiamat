import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Layout (world px). Window on the back wall left, fireplace right, table across the foreground. */
export const CT = { win: { x: 250, y: 560, w: 440, h: 560 }, sill: 1120, fire: { x: 860, y: 1180, w: 300, h: 420 }, floor: 1600, table: 1700 };

const Stones: React.FC<{ seed: number; x: number; y: number; w: number; h: number; c: string }> = ({ seed, x, y, w, h, c }) => {
  const r = rng(seed); const out: React.ReactNode[] = [];
  for (let yy = y; yy < y + h; yy += 70) {
    let xx = x - r() * 80;
    while (xx < x + w) { const sw = 90 + r() * 90; out.push(<rect key={`${xx}-${yy}`} x={xx + 4} y={yy + 4} width={sw - 8} height={62} rx={14} fill={c} opacity={0.35 + r() * 0.4} />); xx += sw; }
  }
  return <g>{out}</g>;
};

const Room = () => {
  const { win, sill, fire, floor } = CT;
  return (
    <g>
      <defs>
        <linearGradient id="ctWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f1115" /><stop offset="1" stopColor="#1c1d22" /></linearGradient>
        <radialGradient id="ctWarm" cx="0.78" cy="0.62" r="0.55"><stop offset="0" stopColor="#ff9d4d" stopOpacity="0.28" /><stop offset="1" stopColor="#ff9d4d" stopOpacity="0" /></radialGradient>
        <linearGradient id="ctGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2a38" /><stop offset="1" stopColor="#0a1018" /></linearGradient>
        <radialGradient id="ctMoon" cx="0.7" cy="0.25" r="0.5"><stop offset="0" stopColor="#e3e9f0" stopOpacity="0.35" /><stop offset="1" stopColor="#e3e9f0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#ctWall)" />
      <Stones seed={13} x={0} y={0} w={W} h={floor} c="#2a2c31" />
      <rect x={0} y={0} width={W} height={H} fill="url(#ctWarm)" />
      {/* beam */}
      <rect x={0} y={300} width={W} height={70} fill="#120d0a" />
      {/* window */}
      <rect x={win.x - 30} y={win.y - 30} width={win.w + 60} height={win.h + 60} fill="#08090b" />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#ctGlass)" />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#ctMoon)" />
      <path d={`M ${win.x} ${win.y + 470} Q ${win.x + 120} ${win.y + 400} ${win.x + 230} ${win.y + 450} T ${win.x + win.w} ${win.y + 420} L ${win.x + win.w} ${win.y + win.h} L ${win.x} ${win.y + win.h} Z`} fill="#0b1219" />
      <rect x={win.x + win.w / 2 - 9} y={win.y} width={18} height={win.h} fill="#15100c" />
      <rect x={win.x} y={win.y + win.h / 2 - 9} width={win.w} height={18} fill="#15100c" />
      {/* latch */}
      <rect x={win.x + win.w / 2 - 22} y={win.y + win.h / 2 + 14} width={44} height={16} rx={4} fill="#4a4f57" />
      {/* sill */}
      <rect x={win.x - 60} y={sill} width={win.w + 120} height={40} fill="#3a3d42" />
      <rect x={win.x - 60} y={sill + 40} width={win.w + 120} height={14} fill="#121316" />
      {/* fireplace */}
      <rect x={fire.x - 60} y={fire.y - 120} width={fire.w + 120} height={fire.h + 120} fill="#2e3035" />
      <Stones seed={7} x={fire.x - 60} y={fire.y - 120} w={fire.w + 120} h={fire.h + 120} c="#41444a" />
      <rect x={fire.x - 80} y={fire.y - 150} width={fire.w + 160} height={34} fill="#1a120c" />
      <path d={`M ${fire.x} ${fire.y + fire.h} L ${fire.x} ${fire.y + 60} Q ${fire.x + fire.w / 2} ${fire.y - 20} ${fire.x + fire.w} ${fire.y + 60} L ${fire.x + fire.w} ${fire.y + fire.h} Z`} fill="#070505" />
      {/* floor */}
      <rect x={0} y={floor} width={W} height={H - floor} fill="#141210" />
    </g>
  );
};

const Table = () => (
  <g>
    <defs><linearGradient id="ctTab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b2a1e" /><stop offset="1" stopColor="#1a120c" /></linearGradient></defs>
    <rect x={-40} y={CT.table} width={W + 80} height={60} fill="url(#ctTab)" />
    <rect x={-40} y={CT.table + 60} width={W + 80} height={H - CT.table} fill="#0c0907" />
    {[0.3, 0.55, 0.8].map((f, i) => <rect key={i} x={-40} y={CT.table + 60 * f} width={W + 80} height={2} fill="#120c08" opacity={0.6} />)}
  </g>
);

export const COTTAGE: Record<string, BandSpec> = {
  'cottage/room': { node: () => <Room /> },
  'cottage/table': { node: () => <Table /> },
};
