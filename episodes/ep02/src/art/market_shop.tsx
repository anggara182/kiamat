import React from 'react';
import { loadFont } from '@remotion/google-fonts/PermanentMarker';
import { limb, Mitt, Glow, DEG, lerp } from './market_kit';

const { fontFamily: MARKER } = loadFont();

/**
 * Small corner shop interior (shots 1 and 8). Frame coords. The band is the back room in neutral daylight;
 * the front shelf unit, goods, hands, people and the light mood are live.
 */
export const SH = { tiers: [900, 1230, 1560], x1: 150, x2: 930, floor: 1700 };

export const ShopBand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="msWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4c7ae" /><stop offset="1" stopColor="#b3a68e" />
      </linearGradient>
      <linearGradient id="msDoor" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#efe8d6" /><stop offset="1" stopColor="#fbf8ef" />
      </linearGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={2400} fill="url(#msWall)" />
    <rect x={-108} y={-192} width={1296} height={300} fill="#8f846f" />
    <rect x={-108} y={100} width={1296} height={16} fill="#6e6452" />
    {/* back rack: three empty wooden shelves */}
    {[420, 620, 820].map((y) => (
      <g key={y}>
        <rect x={40} y={y} width={860} height={18} fill="#8a7a64" />
        <rect x={40} y={y + 18} width={860} height={10} fill="#5e5242" />
        <rect x={40} y={y + 28} width={860} height={40} fill="#8f846f" opacity={0.25} />
        {[120, 300, 520, 700].map((x) => <rect key={x} x={x} y={y + 4} width={44} height={10} fill="#f2ede0" opacity={0.6} />)}
      </g>
    ))}
    {[40, 470, 880].map((x) => <rect key={x} x={x} y={300} width={20} height={1400} fill="#6e6150" />)}
    {/* empty snack clips hanging from a string */}
    <path d="M60 250 Q470 290 880 250" stroke="#4a4236" strokeWidth={3} fill="none" />
    {[160, 300, 440, 580, 720].map((x, i) => <rect key={x} x={x - 6} y={262 + (i % 2) * 6} width={12} height={22} fill="#c4433a" opacity={0.7} />)}
    {/* doorway to the street (right): bright */}
    <rect x={930} y={150} width={300} height={1560} fill="url(#msDoor)" />
    <rect x={910} y={140} width={26} height={1580} fill="#6e6150" />
    {/* rolled-up door box above the doorway */}
    <rect x={910} y={110} width={300} height={44} fill="#7d776c" />
    {/* floor */}
    <rect x={-108} y={SH.floor} width={1296} height={500} fill="#7c7466" />
    <path d={`M930 ${SH.floor} L1188 ${SH.floor} L1188 2112 L700 2112 Z`} fill="#f3ead6" opacity={0.35} />
  </g>
);

/** front shelf unit (metal), drawn live in front of people; wob = rotation (deg, on ones) */
export const FrontShelf: React.FC<{ wob: number; children?: React.ReactNode; tag?: boolean }> = ({ wob, children, tag = true }) => (
  <g transform={`rotate(${wob} 540 ${SH.floor})`}>
    {children}
    {SH.tiers.map((y) => (
      <g key={y}>
        <rect x={SH.x1} y={y} width={SH.x2 - SH.x1} height={16} fill="#a29a8c" />
        <rect x={SH.x1} y={y + 16} width={SH.x2 - SH.x1} height={26} fill="#6d675d" />
        {tag && <rect x={SH.x1 + 30} y={y + 20} width={SH.x2 - SH.x1 - 60} height={14} fill="#e7e1d2" opacity={0.7} />}
      </g>
    ))}
    {[SH.x1 - 14, SH.x2 - 14].map((x) => (
      <g key={x}>
        <rect x={x} y={760} width={28} height={SH.floor - 760} fill="#57524a" />
        <rect x={x} y={760} width={8} height={SH.floor - 760} fill="#8d877b" />
        {Array.from({ length: 24 }, (_, i) => <rect key={i} x={x + 10} y={780 + i * 38} width={8} height={14} fill="#3a3630" />)}
      </g>
    ))}
  </g>
);

/** 19 L water gallon, bottom-centre origin (prop; whoever handles it animates it on twos). */
export const Gallon: React.FC<{ x: number; y: number; rot?: number; s?: number; full?: number }> = ({ x, y, rot = 0, s = 1, full = 0.92 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-78 -8 Q-80 0 -70 0 L70 0 Q80 0 78 -8 L78 -220 Q76 -250 46 -262 L28 -270 L28 -290 L-28 -290 L-28 -270 L-46 -262 Q-76 -250 -78 -220 Z" fill="#b9d6e2" opacity={0.75} />
    <path d={`M-74 ${-6} L74 -6 L74 ${-6 - 220 * full} L-74 ${-6 - 220 * full} Z`} fill="#7fb2cc" opacity={0.55} />
    {[-180, -120, -60].map((yy) => <path key={yy} d={`M-78 ${yy} Q0 ${yy + 10} 78 ${yy}`} stroke="#8fb9cc" strokeWidth={5} fill="none" />)}
    <rect x={-30} y={-306} width={60} height={22} rx={6} fill="#2e6fb0" />
    <path d="M-60 -230 L-60 -30" stroke="#ffffff" strokeWidth={10} opacity={0.45} strokeLinecap="round" />
    <path d="M-78 -8 L-78 -220 Q-76 -250 -46 -262" stroke="#e8f4fa" strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);

/** 1.5 L bottle, bottom-centre origin */
export const Bottle: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-26 0 L26 0 L26 -130 Q26 -150 12 -162 L10 -180 L-10 -180 L-12 -162 Q-26 -150 -26 -130 Z" fill="#c8e0ea" opacity={0.8} />
    <rect x={-26} y={-110} width={52} height={40} fill="#3f8fc4" opacity={0.85} />
    <rect x={-11} y={-192} width={22} height={14} rx={3} fill="#2e6fb0" />
    <path d="M-16 -130 L-16 -10" stroke="#fff" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
  </g>
);

export type ArmSpec = { sx: number; sy: number; hx: number; hy: number; L1: number; L2: number; w: number; sleeve: string; sleeveD: string; skin: string; skinD: string; cuff?: string; bangle?: boolean; curl?: number; thumb?: 1 | -1; bend?: 1 | -1 };

/** a grabbing arm entering from off-frame (shoulder off-screen), mitten hand, optional bangle */
export const GrabArm: React.FC<ArmSpec> = ({ sx, sy, hx, hy, L1, L2, w, sleeve, sleeveD, skin, skinD, cuff, bangle, curl = 0.5, thumb = 1, bend = 1 }) => {
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy) || 1;
  const dmax = L1 + L2 - 1;
  if (d > dmax) { hx = sx + (dx / d) * dmax; hy = sy + (dy / d) * dmax; dx = hx - sx; dy = hy - sy; d = dmax; }
  const a = Math.atan2(dy, dx), A = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const ex = sx + Math.cos(a + bend * A) * L1, ey = sy + Math.sin(a + bend * A) * L1;
  const ang = Math.atan2(hy - ey, hx - ex) * DEG;
  const wx = lerp(ex, hx, 0.8), wy = lerp(ey, hy, 0.8);
  return (
    <g>
      <path d={limb(sx, sy, ex, ey, w * 1.35, w * 1.15)} fill={sleeve} />
      <path d={limb(ex, ey, wx, wy, w * 1.15, w * 0.95)} fill={sleeve} />
      <path d={limb(sx, sy + w * 0.3, ex, ey + w * 0.25, w * 0.5, w * 0.4)} fill={sleeveD} opacity={0.6} />
      <path d={limb(wx, wy, hx, hy, w * 0.8, w * 0.72)} fill={skin} />
      {cuff && <path d={limb(lerp(ex, hx, 0.76), lerp(ey, hy, 0.76), wx, wy, w * 1.05, w * 1.0)} fill={cuff} />}
      {bangle && <path d={limb(lerp(wx, hx, 0.3), lerp(wy, hy, 0.3), lerp(wx, hx, 0.45), lerp(wy, hy, 0.45), w * 0.95, w * 0.92)} fill="#d9a441" />}
      <Mitt x={hx} y={hy} ang={ang} len={w * 2.0} w={w * 1.25} skin={skin} shade={skinD} thumb={thumb} curl={curl} rim="#ffe0b0" rimO={0.5} />
    </g>
  );
};

/** dawn mood for shot 1: warm bulb + darker room (on ones) */
export const DawnMood: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-200} y={-300} width={1500} height={2600} fill="#24162a" opacity={0.42} />
    <rect x={930} y={150} width={300} height={1560} fill="#5b4a78" opacity={0.7} />
    <rect x={930} y={1000} width={300} height={700} fill="#e59a7a" opacity={0.35} />
    <Glow id="msBulb" x={520} y={560} rx={700} ry={640} c="#ffd08a" o={0.45 + 0.03 * Math.sin(t * 40)} mid={0.3} />
  </g>
);

/** day light shaft from the doorway with dust motes (on ones) */
export const DayShaft: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M930 160 L1188 160 L760 1700 L300 1700 Z" fill="#fff8e6" opacity={0.16} />
    {Array.from({ length: 26 }, (_, i) => {
      const u = (t * (0.04 + (i % 5) * 0.012) + i * 0.173) % 1;
      const yy = 200 + ((i * 131) % 1400) - u * 160;
      const xx = 930 - (yy - 160) * 0.33 + ((i * 53) % 260) + Math.sin(t * 0.9 + i) * 14;
      return <circle key={i} cx={xx} cy={yy} r={i % 4 ? 2.4 : 3.6} fill="#fffaf0" opacity={0.5 * Math.sin(Math.PI * ((u + i * 0.07) % 1))} />;
    })}
  </g>
);

/** handwritten "HABIS" card taped to the shelf lip (prop, static) */
export const HabisCard: React.FC<{ x: number; y: number; rot?: number; sway?: number }> = ({ x, y, rot = -4, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + sway})`}>
    <rect x={-120} y={0} width={240} height={120} fill="#f4efe2" />
    <rect x={-120} y={0} width={240} height={120} fill="none" stroke="#cfc6b2" strokeWidth={3} />
    <rect x={-30} y={-12} width={60} height={22} fill="#e8dcb0" opacity={0.85} />
    <text x={0} y={84} textAnchor="middle" fontFamily={MARKER} fontSize={70} fill="#b8352b" letterSpacing={4}>HABIS</text>
  </g>
);
