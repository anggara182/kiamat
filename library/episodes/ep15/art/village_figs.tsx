import React from 'react';
import { W, H } from './world';
import { RAIN, VG } from '../sets/village';

/** Rain streaks, slanted, falling with frame f. */
export const Rain: React.FC<{ f: number; color?: string; o?: number }> = ({ f, color = '#9aa6bd', o = 1 }) => (
  <g stroke={color} strokeWidth={2.4} strokeLinecap="round" opacity={o}>
    {RAIN.map((d, i) => {
      const y = ((d.y + f * 48 * d.v) % (H + 200)) - 100;
      const x = (d.x - (y - d.y) * 0.12 + W * 4) % W;
      return <line key={i} x1={x} y1={y} x2={x - d.l * 0.12} y2={y + d.l} opacity={d.o} />;
    })}
  </g>
);

/** Porch light glow + lit door / windows. open = 0..1 door gap. */
export const Porch: React.FC<{ on?: number; open?: number }> = ({ on = 1, open = 0 }) => {
  const D = VG.DOOR;
  return (
    <g>
      <defs>
        <radialGradient id="vGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc777" stopOpacity="0.55" /><stop offset="0.5" stopColor="#ffb060" stopOpacity="0.15" /><stop offset="1" stopColor="#ffb060" stopOpacity="0" /></radialGradient>
      </defs>
      <g opacity={on}>
        <ellipse cx={D.x + D.w / 2} cy={1220} rx={330} ry={260} fill="url(#vGlow)" />
        <rect x={D.x + D.w / 2 - 9} y={1196} width={18} height={20} rx={6} fill="#fff1c8" />
        <rect x={470} y={1275} width={65} height={90} fill="#e9a457" opacity={0.55} />
        <rect x={785} y={1275} width={65} height={90} fill="#e9a457" opacity={0.35} />
      </g>
      {/* door: dark panels; open shows warm interior gap */}
      <rect x={D.x} y={D.y} width={D.w} height={D.h} fill={open > 0 ? '#d58c46' : '#0e0d0d'} opacity={open > 0 ? 0.35 + 0.5 * on : 1} />
      <rect x={D.x} y={D.y} width={D.w * (1 - 0.8 * open)} height={D.h} fill="#120f0e" />
    </g>
  );
};

/** Wet path: warm porch reflection on the path + puddle glints, low contrast (sits under captions). */
export const Wet: React.FC<{ on?: number; f: number }> = ({ on = 1, f }) => {
  const D = VG.DOOR, cx = D.x + D.w / 2;
  return (
    <g opacity={on}>
      <defs>
        <linearGradient id="vRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9a457" stopOpacity="0.32" /><stop offset="1" stopColor="#e9a457" stopOpacity="0" /></linearGradient>
        <radialGradient id="vPud" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f0b670" stopOpacity="0.35" /><stop offset="1" stopColor="#f0b670" stopOpacity="0" /></radialGradient>
      </defs>
      <polygon points={`${cx - 40},1510 ${cx + 40},1510 ${cx + 120},2150 ${cx - 90},2150`} fill="url(#vRefl)" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={cx - 30 - i * 8 + Math.sin(f * 0.2 + i) * 6} y={1560 + i * 90} width={60 + i * 18} height={4} rx={2} fill="#f3c27f" opacity={0.18 - i * 0.02} />)}
      <ellipse cx={850} cy={1820} rx={150} ry={16} fill="url(#vPud)" />
      <ellipse cx={330} cy={1950} rx={170} ry={18} fill="url(#vPud)" opacity={0.6} />
    </g>
  );
};

/** Tall man silhouette standing at the gate (feet at x,y). face=1 turns his head in profile to the right (toward the door). bike = motorbike parked on his left. */
export const Man: React.FC<{ x: number; y: number; s?: number; fill?: string; bike?: boolean; face?: boolean; bikeX?: number }> = ({ x, y, s = 1, fill = '#030304', bike, face, bikeX = -300 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    {bike && <g transform={bikeX > 0 ? `translate(${bikeX} 0) scale(-1 1)` : `translate(${bikeX} 0)`}>
      <circle cx={-100} cy={-52} r={52} /><circle cx={150} cy={-52} r={52} />
      <circle cx={-100} cy={-52} r={22} fill="#6c6e74" /><circle cx={150} cy={-52} r={22} fill="#6c6e74" />
      <path d="M -100 -60 L -60 -150 L 90 -150 L 150 -60 L 70 -80 L -20 -80 Z" />
      <rect x={-80} y={-178} width={130} height={30} rx={14} />
      <path d="M 120 -150 L 150 -250 L 175 -250 L 150 -140 Z" />
      <rect x={130} y={-262} width={90} height={14} rx={7} />
      <ellipse cx={176} cy={-214} rx={16} ry={12} fill="#bfc2c8" />
    </g>}
    <g transform={face ? 'rotate(3 0 0)' : undefined}>
      <path d="M -22 0 L -16 -170 L -30 -175 L -52 -330 Q -50 -370 -10 -378 L 10 -378 Q 50 -370 52 -330 L 30 -175 L 16 -170 L 22 0 L 4 0 L 0 -160 L -4 0 Z" />
      <ellipse cx={0} cy={-404} rx={24} ry={30} />
      {face && <path d="M 18 -420 L 34 -404 L 20 -396 Z" />}
      {face && <path d="M -28 -428 Q 0 -446 30 -428 L 48 -424 L 24 -418 Z" />}
      <path d="M -50 -335 L -60 -190 L -46 -188 L -38 -300 Z" />
      <path d="M 50 -335 L 60 -190 L 46 -188 L 38 -300 Z" />
    </g>
  </g>
);

/** Running figure facing LEFT — stride phase ph (radians). mother = long hair streaming back + skirt; else child with short bob. */
export const Runner: React.FC<{ x: number; y: number; s: number; ph: number; mother?: boolean; fill?: string }> = ({ x, y, s, ph, mother, fill = '#050506' }) => {
  const a = Math.sin(ph) * 30, b = -a;
  const leg = (ang: number) => <rect x={-9} y={0} width={18} height={150} rx={8} transform={`translate(0 -150) rotate(${ang})`} />;
  const sway = Math.sin(ph * 2) * 4;
  return (
    <g transform={`translate(${x} ${y - Math.abs(Math.cos(ph)) * 10 * s}) scale(${s})`} fill={fill}>
      {leg(a)}{leg(b)}
      <g transform="rotate(-10 0 -150)">
        {mother && <path d="M -30 -205 L 34 -205 L 60 -110 L -62 -110 Z" />}
        <path d="M -30 -150 L -28 -300 Q 0 -318 28 -300 L 34 -150 Z" />
        <rect x={-8} y={-300} width={16} height={130} rx={8} transform={`rotate(${a * 1.4} 0 -292)`} />
        <rect x={-8} y={-300} width={16} height={130} rx={8} transform={`rotate(${b * 1.4} 0 -292)`} />
        <ellipse cx={-8} cy={-336} rx={22} ry={26} />
        {mother
          ? <path d={`M -26 -356 Q 0 -372 20 -350 Q 44 -320 58 ${-262 + sway} Q 86 ${-214 + sway} 110 ${-196 + sway} Q 70 -200 46 -238 Q 30 -270 16 -300 Q 4 -318 -20 -320 Z`} />
          : <path d="M -30 -350 Q -8 -372 18 -352 Q 26 -330 20 -312 L 8 -318 Q -10 -326 -30 -330 Z" />}
      </g>
    </g>
  );
};
