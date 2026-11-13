import React from 'react';
import { Glow, Puff } from './market_kit';

/**
 * Breakfast stall, front view (shot 3 at dawn, shot 23 at dusk). Same drawing, palette argument. Frame coords.
 * Upper ~40% is sky + a plain dark awning so the dusk quote overlay sits on a calm, dark area.
 */
export type StallPal = { sky: [string, string, string]; roofs: string; tarp: string; wood: string; woodD: string; back: string; ground: string; tint: string; tintO: number };
export const STALL_DAWN: StallPal = { sky: ['#1c2244', '#5b4a78', '#e59a7a'], roofs: '#2e2848', tarp: '#2f4a64', wood: '#9a7a58', woodD: '#6e5038', back: '#4a3428', ground: '#4e4250', tint: '#5b4a78', tintO: 0.18 };
export const STALL_DUSK: StallPal = { sky: ['#1f1830', '#3b2c52', '#c96b5c'], roofs: '#1c1528', tarp: '#2a2036', wood: '#a47658', woodD: '#6a4434', back: '#3e2a24', ground: '#3a2c3a', tint: '#c96b5c', tintO: 0.14 };
export const ST = { counter: 1200, floor: 1720, pot: { x: 850, top: 990 }, box: 780, ox1: 180, ox2: 900 };

export const StallBand: React.FC<{ pal: StallPal }> = ({ pal }) => (
  <g>
    <defs>
      <linearGradient id={`mtSky${pal.roofs}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={pal.sky[0]} /><stop offset="0.6" stopColor={pal.sky[1]} /><stop offset="1" stopColor={pal.sky[2]} />
      </linearGradient>
    </defs>
    <rect x={-108} y={-192} width={1296} height={1060} fill={`url(#mtSky${pal.roofs})`} />
    <path d="M-108 760 L60 700 L200 730 L360 690 L520 720 L700 680 L860 720 L1040 690 L1188 720 L1188 900 L-108 900 Z" fill={pal.roofs} />
    {/* stall interior */}
    <rect x={ST.ox1} y={ST.box} width={ST.ox2 - ST.ox1} height={ST.counter - ST.box} fill={pal.back} />
    {[860, 940, 1020, 1100].map((y) => <rect key={y} x={ST.ox1} y={y} width={ST.ox2 - ST.ox1} height={4} fill="#000" opacity={0.18} />)}
    <rect x={220} y={930} width={240} height={12} fill={pal.woodD} />
    {[240, 300, 360, 420].map((x, i) => <rect key={x} x={x} y={870 + (i % 2) * 10} width={36} height={60 - (i % 2) * 10} rx={6} fill="#c9a870" opacity={0.6} />)}
    <rect x={720} y={830} width={70} height={110} fill="#e9d9a8" opacity={0.55} />
    <rect x={800} y={830} width={60} height={96} fill="#e9d9a8" opacity={0.45} />
    {/* posts, awning, shutter box */}
    <rect x={150} y={700} width={34} height={1020} fill={pal.woodD} />
    <rect x={896} y={700} width={34} height={1020} fill={pal.woodD} />
    <path d="M100 660 L980 660 L1000 744 L80 744 Z" fill={pal.tarp} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${80 + i * 77} 744 q38 26 77 0`} fill={pal.tarp} />)}
    <rect x={170} y={744} width={740} height={40} fill="#3a3a44" />
    {/* ground */}
    <rect x={-108} y={ST.floor} width={1296} height={500} fill={pal.ground} />
    <rect x={-108} y={-192} width={1296} height={2400} fill={pal.tint} opacity={pal.tintO} />
  </g>
);

/** counter, glass case, stove and pot: drawn live IN FRONT of the owner */
export const StallCounter: React.FC<{ pal: StallPal }> = ({ pal }) => (
  <g>
    {/* counter with a glass case (left) and the stove (right) */}
    <rect x={130} y={ST.counter} width={820} height={30} fill={pal.wood} />
    <rect x={150} y={ST.counter + 30} width={780} height={ST.floor - ST.counter - 30} fill={pal.woodD} />
    {[1330, 1450, 1570].map((y) => <rect key={y} x={150} y={y} width={780} height={4} fill="#000" opacity={0.2} />)}
    <rect x={230} y={1060} width={330} height={140} fill="#cfe0e6" opacity={0.28} />
    <rect x={230} y={1060} width={330} height={140} fill="none" stroke="#8a8a90" strokeWidth={6} />
    {[[280, 1150], [360, 1160], [450, 1150], [510, 1165]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={34} ry={16} fill={i % 2 ? '#c98a3a' : '#a8622a'} />)}
    <rect x={720} y={1172} width={250} height={28} rx={6} fill="#2a2a30" />
    {/* the big pot (soup surface open, ladling) */}
    <path d={`M754 ${ST.pot.top} L946 ${ST.pot.top} L936 1168 Q850 1182 764 1168 Z`} fill="#b9bec4" />
    <path d={`M890 ${ST.pot.top} L946 ${ST.pot.top} L936 1168 Q910 1174 890 1176 Z`} fill="#80868c" />
    <ellipse cx={850} cy={ST.pot.top} rx={96} ry={18} fill="#cfd4d8" />
    <ellipse cx={850} cy={ST.pot.top + 4} rx={86} ry={13} fill="#b8743a" />
    <path d="M770 1010 L770 1150" stroke="#eef1f3" strokeWidth={8} opacity={0.5} strokeLinecap="round" />
    <rect x={130} y={ST.counter} width={820} height={ST.floor - ST.counter} fill={pal.tint} opacity={pal.tintO} />
  </g>
);

/** the stall bulb + steam (ones). lamp 0..1 */
export const StallLife: React.FC<{ t: number; steam: number; lamp?: number }> = ({ t, steam, lamp = 1 }) => (
  <g>
    <path d="M540 784 L540 820" stroke="#1a1418" strokeWidth={3} />
    <Glow id="mtBulb" x={540} y={836} rx={420} ry={300} c="#ffd08a" o={0.5 * lamp} mid={0.3} />
    <circle cx={540} cy={836} r={14} fill="#fff0c8" opacity={0.4 + 0.6 * lamp} />
    {Array.from({ length: 7 }, (_, i) => {
      const life = (t * 0.7 + i / 7) % 1;
      const x = 790 + ((i * 41) % 120) + Math.sin(t * 1.8 + i) * 22 * life;
      return <Puff key={i} id={`mtSt${i}`} x={x} y={ST.pot.top - 20 - life * 300} r={22 + life * 46} c="#f4f1ec" o={steam * 0.5 * Math.sin(Math.PI * life)} seed={i} />;
    })}
  </g>
);

/** the stall shutter (on ones): rail = y of the bottom rail */
export const Shutter: React.FC<{ rail: number; rattle: number }> = ({ rail, rattle }) => {
  const h = rail - ST.box;
  const slats: React.ReactNode[] = [];
  for (let y = rail - 22; y > ST.box; y -= 22) slats.push(<rect key={y} x={ST.ox1} y={y} width={ST.ox2 - ST.ox1} height={4} fill="#4a4652" />);
  return (
    <g transform={`translate(${rattle * 0.5} 0)`}>
      <defs><clipPath id="mtShC"><rect x={ST.ox1} y={ST.box} width={ST.ox2 - ST.ox1} height={Math.max(0, h)} /></clipPath></defs>
      <g clipPath="url(#mtShC)">
        <rect x={ST.ox1} y={ST.box} width={ST.ox2 - ST.ox1} height={h} fill="#6e6a76" />
        {slats}
        <rect x={ST.ox1} y={ST.box} width={ST.ox2 - ST.ox1} height={h} fill="#c96b5c" opacity={0.14} />
      </g>
      <rect x={ST.ox1 - 4} y={rail - 16} width={ST.ox2 - ST.ox1 + 8} height={18} fill="#3c3842" />
      <rect x={ST.ox1 - 4} y={rail - 16} width={ST.ox2 - ST.ox1 + 8} height={4} fill="#f0b27a" opacity={0.5} />
    </g>
  );
};

/** ladle: handle from the hand (hx,hy) toward the bowl; drip on ones */
export const Ladle: React.FC<{ hx: number; hy: number; ang: number; t: number; drip?: number }> = ({ hx, hy, ang, t, drip = 1 }) => {
  const L = 190, a = ang / 57.2958;
  const bx = hx + Math.cos(a) * L, by = hy + Math.sin(a) * L;
  const dp = (t * 2.2) % 1;
  return (
    <g>
      <path d={`M${hx} ${hy} L${bx} ${by}`} stroke="#9aa0a6" strokeWidth={9} strokeLinecap="round" />
      <path d={`M${bx - 30} ${by - 4} Q${bx} ${by + 34} ${bx + 30} ${by - 4} Z`} fill="#aeb4ba" />
      <ellipse cx={bx} cy={by - 4} rx={30} ry={7} fill="#b8743a" />
      {drip > 0 && <ellipse cx={bx + 4} cy={by + 26 + dp * 90} rx={4} ry={7} fill="#c98a4a" opacity={drip * (1 - dp)} />}
    </g>
  );
};
