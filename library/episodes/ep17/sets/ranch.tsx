import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

export const WIN = { x: 360, y: 640, w: 400, h: 580 }; // room window opening
export const DOOR = { x: 900, y: 860, w: 280, h: 780 }; // room door
export const FLOOR = 1640;
export const CWIN = { x: 260, y: 480, w: 780, h: 960 }; // city window

const Palm: React.FC<{ x: number; y: number; s: number; c?: string }> = ({ x, y, s, c = '#0b0f0b' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <path d="M-4,0 Q-2,-120 4,-240 L8,-240 Q4,-120 4,0 Z" />
    <path d="M6,-240 Q-40,-250 -80,-215 Q-40,-238 6,-232 Z M6,-240 Q50,-252 90,-212 Q50,-236 6,-232 Z M6,-242 Q-20,-280 -60,-280 Q-20,-268 4,-236 Z M6,-242 Q34,-284 74,-276 Q34,-266 8,-236 Z M6,-244 Q6,-280 -6,-300 Q12,-280 10,-238 Z" />
  </g>
);

/** Moonlit llanos seen through an opening (sky, moon, grass, palms). */
const Outside: React.FC<{ x: number; y: number; w: number; h: number; id: string }> = ({ x, y, w, h, id }) => {
  const hz = y + h * 0.68;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1428" />
          <stop offset="0.7" stopColor="#2c3f63" />
          <stop offset="1" stopColor="#6f86a3" />
        </linearGradient>
        <radialGradient id={`${id}mg`}>
          <stop offset="0" stopColor="#f3ecd2" stopOpacity={0.55} />
          <stop offset="1" stopColor="#f3ecd2" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}sky)`} />
      <circle cx={x + w * 0.66} cy={y + h * 0.3} r={w * 0.42} fill={`url(#${id}mg)`} />
      <circle cx={x + w * 0.66} cy={y + h * 0.3} r={w * 0.12} fill="#f3ecd2" />
      <path d={`M${x},${hz} Q${x + w * 0.5},${hz - 8} ${x + w},${hz + 4} L${x + w},${y + h} L${x},${y + h} Z`} fill="#2a3324" />
      <path d={`M${x},${hz + h * 0.12} Q${x + w * 0.5},${hz + h * 0.09} ${x + w},${hz + h * 0.13} L${x + w},${hz + h * 0.15} Q${x + w * 0.5},${hz + h * 0.12} ${x},${hz + h * 0.14} Z`} fill="#8fa3b5" opacity={0.7} />
      <Palm x={x + w * 0.2} y={hz + 6} s={w / 900} />
      <Palm x={x + w * 0.86} y={hz + 4} s={w / 1300} />
    </g>
  );
};

export const RANCH: Record<string, BandSpec> = {
  /** Exterior: ranch house porch at night, moon over the plain. */
  'ranch/porch': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b1a" />
            <stop offset="0.5" stopColor="#1d2a4a" />
            <stop offset="1" stopColor="#5d7393" />
          </linearGradient>
          <radialGradient id="pMoon">
            <stop offset="0" stopColor="#f3ecd2" stopOpacity={0.6} />
            <stop offset="1" stopColor="#f3ecd2" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="pWall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5a6272" />
            <stop offset="1" stopColor="#2a2e38" />
          </linearGradient>
          <linearGradient id="pFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2019" />
            <stop offset="1" stopColor="#0c0907" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#pSky)" />
        <circle cx={360} cy={620} r={420} fill="url(#pMoon)" />
        <circle cx={360} cy={620} r={120} fill="#f3ecd2" />
        <path d={`M0,1230 Q400,1205 800,1222 L800,1700 L0,1700 Z`} fill="#2a3324" />
        <path d="M0,1300 Q300,1290 700,1305 L700,1312 Q300,1298 0,1310 Z" fill="#8fa3b5" opacity={0.6} />
        <Palm x={170} y={1236} s={1.5} />
        <Palm x={560} y={1226} s={0.8} />
        {/* adobe wall */}
        <rect x={720} y={600} width={W - 720} height={1200} fill="url(#pWall)" />
        {/* door (closed, shutters) */}
        <rect x={880} y={1010} width={260} height={620} fill="#4a3424" />
        <path d="M1010,1010 L1010,1630" stroke="#20160f" strokeWidth={8} />
        <rect x={880} y={1010} width={260} height={620} fill="none" stroke="#20160f" strokeWidth={10} />
        {/* roof eave */}
        <path d="M300,520 L1296,430 L1296,620 L330,640 Z" fill="#6b3326" />
        <path d="M300,628 L1296,612 L1296,660 L330,668 Z" fill="#2b140e" />
        {/* posts */}
        <rect x={420} y={640} width={34} height={1100} fill="#18110c" />
        <rect x={110} y={560} width={60} height={1300} fill="#0c0806" />
        {/* porch floor */}
        <rect x={0} y={1640} width={W} height={H - 1640} fill="url(#pFloor)" />
        <path d="M0,1642 L1296,1642" stroke="#4a3a2c" strokeWidth={6} />
      </g>
    ),
  },
  /** Interior: adobe room, window (moonlit plain outside) and door. */
  'ranch/room': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1d25" />
            <stop offset="0.5" stopColor="#3b414e" />
            <stop offset="1" stopColor="#262a33" />
          </linearGradient>
          <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2019" />
            <stop offset="1" stopColor="#0b0806" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#rWall)" />
        <Outside x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} id="rw" />
        <rect x={WIN.x - 24} y={WIN.y - 24} width={WIN.w + 48} height={WIN.h + 48} fill="none" stroke="#2a2018" strokeWidth={48} />
        <rect x={WIN.x - 60} y={WIN.y + WIN.h + 24} width={WIN.w + 120} height={30} fill="#1c150f" />
        {/* door */}
        <rect x={DOOR.x - 20} y={DOOR.y - 20} width={DOOR.w + 40} height={DOOR.h + 20} fill="#17110c" />
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="#3a2a1d" />
        <path d={`M${DOOR.x + 40},${DOOR.y + 40} h${DOOR.w - 80} v${DOOR.h * 0.42} h-${DOOR.w - 80} Z M${DOOR.x + 40},${DOOR.y + DOOR.h * 0.52} h${DOOR.w - 80} v${DOOR.h * 0.4} h-${DOOR.w - 80} Z`} fill="none" stroke="#241912" strokeWidth={8} />
        {/* floor */}
        <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="url(#rFloor)" />
        <path d={`M0,${FLOOR} L${W},${FLOOR}`} stroke="#120d09" strokeWidth={10} />
        <path d="M0,1800 L1296,1800 M0,2000 L1296,2000" stroke="#17110c" strokeWidth={4} />
      </g>
    ),
  },
  /** City apartment window at night. */
  'ranch/city': {
    node: () => {
      const r = rng(17);
      const blds: React.ReactNode[] = [];
      let bx = CWIN.x - 20;
      while (bx < CWIN.x + CWIN.w) {
        const bw = 80 + r() * 120, top = CWIN.y + 360 + r() * 300;
        blds.push(<rect key={`b${bx}`} x={bx} y={top} width={bw} height={CWIN.h} fill={r() > 0.5 ? '#0f1422' : '#141a2b'} />);
        for (let i = 0; i < 6; i++) {
          if (r() > 0.45) blds.push(<rect key={`w${bx}-${i}`} x={bx + 12 + r() * (bw - 30)} y={top + 30 + r() * 400} width={10} height={14} fill={r() > 0.3 ? '#ffd890' : '#bcd3ff'} opacity={0.75} />);
        }
        bx += bw + 6;
      }
      return (
        <g>
          <defs>
            <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#05070f" />
              <stop offset="0.75" stopColor="#1c2440" />
              <stop offset="1" stopColor="#3a3a52" />
            </linearGradient>
            <linearGradient id="cWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0c0f16" />
              <stop offset="0.5" stopColor="#1b2130" />
              <stop offset="1" stopColor="#0c0f16" />
            </linearGradient>
            <clipPath id="cClip"><rect x={CWIN.x} y={CWIN.y} width={CWIN.w} height={CWIN.h} /></clipPath>
          </defs>
          <rect width={W} height={H} fill="url(#cWall)" />
          <g clipPath="url(#cClip)">
            <rect x={CWIN.x} y={CWIN.y} width={CWIN.w} height={CWIN.h} fill="url(#cSky)" />
            {blds}
          </g>
          <rect x={CWIN.x} y={CWIN.y} width={CWIN.w} height={CWIN.h} fill="none" stroke="#2c3344" strokeWidth={28} />
          <path d={`M${CWIN.x + CWIN.w / 2},${CWIN.y} V${CWIN.y + CWIN.h} M${CWIN.x},${CWIN.y + CWIN.h * 0.42} H${CWIN.x + CWIN.w}`} stroke="#2c3344" strokeWidth={16} />
          <rect x={CWIN.x - 70} y={CWIN.y + CWIN.h + 10} width={CWIN.w + 140} height={36} fill="#232a39" />
          <rect x={0} y={CWIN.y + CWIN.h + 46} width={W} height={H} fill="#080a10" />
        </g>
      );
    },
  },
};
