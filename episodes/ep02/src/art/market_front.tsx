import React from 'react';
import { Glow } from './market_kit';

/** Shot 2: the shop front at dawn, rolling door rising, a queue with empty jerrycans. Frame coords. */
export const FR = { door: { x1: 250, x2: 850, y1: 600, y2: 1290 }, ground: 1290 };

export const FrontBand: React.FC = () => {
  const { door } = FR;
  return (
    <g>
      <defs>
        <linearGradient id="mfSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2244" /><stop offset="0.55" stopColor="#5b4a78" /><stop offset="1" stopColor="#e59a7a" />
        </linearGradient>
        <linearGradient id="mfIn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd08a" /><stop offset="1" stopColor="#b8763e" />
        </linearGradient>
        <linearGradient id="mfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9b8592" /><stop offset="1" stopColor="#6e5c70" />
        </linearGradient>
        <linearGradient id="mfStreet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a4c62" /><stop offset="1" stopColor="#231d2c" />
        </linearGradient>
      </defs>
      <rect x={-108} y={-192} width={1296} height={1100} fill="url(#mfSky)" />
      <path d="M-108 700 L40 640 L120 680 L300 600 L380 640 L700 620 L820 560 L960 620 L1188 600 L1188 900 L-108 900 Z" fill="#3a3058" />
      <rect x={760} y={500} width={10} height={130} fill="#3a3058" /><ellipse cx={765} cy={500} rx={30} ry={28} fill="#3a3058" />
      {/* neighbours */}
      <path d="M-108 520 L150 470 L150 1300 L-108 1300 Z" fill="#45384f" />
      <rect x={-60} y={760} width={130} height={150} fill="#ffcf86" opacity={0.85} />
      <rect x={2} y={760} width={6} height={150} fill="#45384f" />
      <path d="M950 480 L1188 520 L1188 1300 L950 1300 Z" fill="#3c3148" />
      <rect x={1010} y={900} width={130} height={390} fill="#2a2234" />
      {/* the shop */}
      <rect x={140} y={360} width={820} height={940} fill="url(#mfWall)" />
      <rect x={128} y={340} width={844} height={30} fill="#5a4a5e" />
      <rect x={200} y={410} width={700} height={120} fill="#4f6e72" />
      <rect x={200} y={410} width={700} height={120} fill="none" stroke="#3a4f52" strokeWidth={8} />
      <path d="M220 470 L880 470" stroke="#6f9094" strokeWidth={4} opacity={0.6} />
      {/* interior behind the door */}
      <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={door.y2 - door.y1} fill="url(#mfIn)" />
      {[760, 900, 1040].map((y) => <rect key={y} x={door.x1 + 30} y={y} width={door.x2 - door.x1 - 60} height={14} fill="#6e4a2a" />)}
      <rect x={door.x1 + 40} y={1040 - 70} width={60} height={70} fill="#8fb9cc" opacity={0.7} />
      <rect x={door.x1 + 480} y={900 - 60} width={40} height={60} fill="#8fb9cc" opacity={0.6} />
      <rect x={240} y={562} width={620} height={42} fill="#6a6070" />
      <rect x={240} y={600} width={14} height={700} fill="#5a5060" /><rect x={846} y={600} width={14} height={700} fill="#5a5060" />
      {/* street lamp (left) */}
      <rect x={66} y={420} width={12} height={880} fill="#2a2234" />
      <path d="M72 430 Q100 400 150 410" stroke="#2a2234" strokeWidth={8} fill="none" />
      {/* pavement + street */}
      <rect x={-108} y={FR.ground} width={1296} height={46} fill="#7a6a7c" />
      <rect x={-108} y={FR.ground + 46} width={1296} height={800} fill="url(#mfStreet)" />
      <rect x={-108} y={FR.ground + 40} width={1296} height={8} fill="#4a3e52" />
    </g>
  );
};

/** rolling door (on ones): open 0..1, rattle px */
export const RollDoor: React.FC<{ open: number; rattle: number }> = ({ open, rattle }) => {
  const { door } = FR;
  const yb = door.y2 - (door.y2 - door.y1) * open;
  const h = yb - door.y1;
  const slats: React.ReactNode[] = [];
  for (let y = yb - 24; y > door.y1 - 24; y -= 24) slats.push(<rect key={y} x={door.x1} y={y} width={door.x2 - door.x1} height={4} fill="#5d5666" />);
  return (
    <g transform={`translate(${rattle * 0.6} ${rattle})`}>
      <defs><clipPath id="mfDoorC"><rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={Math.max(0, h + 4)} /></clipPath></defs>
      <g clipPath="url(#mfDoorC)">
        <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={h} fill="#8c8494" />
        {slats}
        <rect x={door.x1} y={door.y1} width={door.x2 - door.x1} height={h} fill="#e59a7a" opacity={0.12} />
      </g>
      {h > 4 && <rect x={door.x1 - 4} y={yb - 18} width={door.x2 - door.x1 + 8} height={20} fill="#4d4656" />}
      {h > 4 && <rect x={(door.x1 + door.x2) / 2 - 40} y={yb - 10} width={80} height={12} rx={6} fill="#2e2a34" />}
    </g>
  );
};

/** light spill from the opened shop + street lamp glow (ones) */
export const FrontLight: React.FC<{ open: number; t: number }> = ({ open, t }) => (
  <g>
    <Glow id="mfLamp" x={150} y={420} rx={160} c="#ffd08a" o={0.6 + 0.04 * Math.sin(t * 30)} />
    <defs><linearGradient id="mfSpill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd08a" stopOpacity={0.3} /><stop offset="1" stopColor="#ffd08a" stopOpacity={0} /></linearGradient></defs>
    <path d={`M${FR.door.x1} ${FR.ground} L${FR.door.x2} ${FR.ground} L1000 1700 L100 1700 Z`} fill="url(#mfSpill)" opacity={open} />
  </g>
);

/** blue plastic jerrycan hanging from a handle at (x,y) (top of the handle) */
export const Jerrycan: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = '#3f7fb8', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60 20 L60 20 Q74 20 74 34 L74 200 Q74 214 60 214 L-60 214 Q-74 214 -74 200 L-74 34 Q-74 20 -60 20 Z" fill={c} />
    <path d="M-30 20 L-30 0 Q0 -14 30 0 L30 20" stroke={c} strokeWidth={14} fill="none" />
    <rect x={40} y={4} width={22} height={18} rx={4} fill="#e8e2d0" />
    <path d="M-74 60 L74 60 M-74 160 L74 160" stroke="#000" strokeWidth={4} opacity={0.15} />
    <path d="M-60 40 L-60 190" stroke="#fff" strokeWidth={8} opacity={0.3} strokeLinecap="round" />
  </g>
);
