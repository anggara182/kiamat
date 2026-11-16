import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP07 set "dig": digging pits in gold-flecked mud on a dry riverbed, harsh sun, the edge of a
 * huge raw gold surface glowing in the background. Dawn bank (S06), close on hands + gold (S12).
 * ---------------------------------------------------------------------------------------- */
export const PIT = { rim: 1290, floor: 1500 };

const flecks = (seed: number, x0: number, y0: number, w: number, h: number, n: number, col = '#f2cc5a') => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => <circle key={i} cx={x0 + r() * w} cy={y0 + r() * h} r={1.5 + r() * 3.5} fill={col} opacity={0.6 + r() * 0.4} />);
};

/** day: riverbed, other diggers' spoil heaps far off, the raw gold surface on the horizon, the pit */
export const PitBand: React.FC = () => {
  const r = rng(701);
  return (
    <g>
      <defs>
        <linearGradient id="dgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9d4a8" /><stop offset="1" stopColor="#f4e6c4" /></linearGradient>
        <radialGradient id="dgSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbea" /><stop offset="0.25" stopColor="#fff2c8" stopOpacity={0.7} /><stop offset="1" stopColor="#fff2c8" stopOpacity={0} /></radialGradient>
        <linearGradient id="dgGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d474" /><stop offset="1" stopColor="#c8901e" /></linearGradient>
        <linearGradient id="dgMud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8864e" /><stop offset="1" stopColor="#7a5a32" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#dgSky)" />
      <circle cx={1060} cy={260} r={420} fill="url(#dgSun)" />
      {/* the edge of the raw gold mass on the horizon, glowing */}
      <path d="M -40 900 Q 200 760 520 800 Q 760 700 1000 780 Q 1160 740 1340 800 L 1340 960 L -40 960 Z" fill="url(#dgGold)" />
      <path d="M 120 830 Q 300 780 480 810 M 640 760 Q 820 730 980 790" stroke="#fff2b0" strokeWidth={6} fill="none" opacity={0.7} />
      {/* dry riverbed, spoil heaps and far diggers' tents */}
      <rect x={0} y={940} width={W} height={PIT.rim - 940} fill="#d8b27a" />
      {Array.from({ length: 9 }, (_, i) => { const x = r() * W, y = 980 + r() * 220, w = 60 + r() * 120; return <g key={i}><ellipse cx={x} cy={y} rx={w} ry={w * 0.22} fill="#b8925a" /><ellipse cx={x + w * 0.2} cy={y + w * 0.05} rx={w * 0.6} ry={w * 0.08} fill="#2a2018" opacity={0.25} /></g>; })}
      {Array.from({ length: 6 }, (_, i) => { const x = 80 + i * 220 + r() * 60, y = 960 + r() * 40; return <polygon key={`t${i}`} points={`${x - 24},${y} ${x},${y - 30} ${x + 24},${y}`} fill="#cbbfa6" />; })}
      {/* the pit: far wall lit, floor of gold-flecked mud, puddles */}
      <rect x={0} y={PIT.rim} width={W} height={H - PIT.rim} fill="url(#dgMud)" />
      <rect x={0} y={PIT.rim} width={W} height={70} fill="#c49a5e" />
      <rect x={0} y={PIT.rim + 70} width={W} height={20} fill="#2a2018" opacity={0.25} />
      {flecks(711, 0, PIT.rim, W, H - PIT.rim, 140)}
      <ellipse cx={300} cy={1780} rx={180} ry={26} fill="#6f5a3e" />
      <ellipse cx={980} cy={1900} rx={220} ry={30} fill="#6f5a3e" />
    </g>
  );
};

/** foreground lip of the pit (hides the men's legs below the knee): ON ONES static, drawn live over the figures */
export const PitLip: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M -40 ${y} Q 300 ${y - 30} 640 ${y - 10} Q 980 ${y + 10} 1340 ${y - 20} L 1340 ${H} L -40 ${H} Z`} fill="#8a6a3c" />
    <path d={`M -40 ${y} Q 300 ${y - 30} 640 ${y - 10} Q 980 ${y + 10} 1340 ${y - 20}`} stroke="#c49a5e" strokeWidth={10} fill="none" />
    {flecks(721, 0, y, W, 500, 60)}
    {/* mud clods */}
    {[160, 420, 760, 1080].map((x, i) => <ellipse key={x} cx={x} cy={y + 40 + (i % 2) * 30} rx={50} ry={20} fill="#6f5232" />)}
  </g>
);

/** a shovel from the handle top (tx,ty) to the blade tip (bx,by) */
export const Shovel: React.FC<{ tx: number; ty: number; bx: number; by: number; s?: number; mud?: number }> = ({ tx, ty, bx, by, s = 1, mud = 0 }) => {
  const a = Math.atan2(by - ty, bx - tx), L = Math.hypot(bx - tx, by - ty);
  const deg = (a * 180) / Math.PI;
  return (
    <g transform={`translate(${tx} ${ty}) rotate(${deg})`}>
      <rect x={-8 * s} y={-5 * s} width={16 * s} height={10 * s} rx={4 * s} fill="#4a3424" />
      <rect x={0} y={-4 * s} width={L - 70 * s} height={8 * s} fill="#8a6a44" />
      <path d={`M ${L - 74 * s} ${-16 * s} L ${L - 10 * s} ${-22 * s} Q ${L + 6 * s} 0 ${L - 10 * s} ${22 * s} L ${L - 74 * s} ${16 * s} Z`} fill="#8a8e92" />
      {mud > 0 && <ellipse cx={L - 40 * s} cy={-14 * s} rx={30 * s * mud} ry={12 * s * mud} fill="#6f5232" />}
    </g>
  );
};

/** a dented metal water bottle */
export const Bottle: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-12} y={-34} width={24} height={52} rx={8} fill="#7d8a8e" />
    <rect x={-6} y={-44} width={12} height={12} fill="#4a5054" />
    <rect x={-10} y={-30} width={6} height={42} rx={3} fill="#c9d4d8" opacity={0.6} />
  </g>
);

/** dust kicked from the shovels / drifting in the heat (ON ONES) */
export const Dust: React.FC<{ t: number; n?: number; col?: string; o?: number }> = ({ t, n = 30, col = '#f2e2b8', o = 0.5 }) => {
  const r = rng(731);
  return <g fill={col}>{Array.from({ length: n }, (_, i) => { const x0 = r() * W, y0 = r() * H, s = 2 + r() * 4; return <circle key={i} cx={(x0 + t * (18 + r() * 20)) % W} cy={(y0 - t * (5 + r() * 8) + H) % H} r={s} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(t + i)))} />; })}</g>;
};

/* ------------------------------------ S06: dawn bank ------------------------------------ */
export const BANK = { x0: -40, y0: 1520, x1: 900, y1: 980 }; // slope from lower left up to the crest
export const bankY = (x: number) => (x >= BANK.x1 ? BANK.y1 : BANK.y0 + ((x - BANK.x0) / (BANK.x1 - BANK.x0)) * (BANK.y1 - BANK.y0));
export const DawnBand: React.FC = () => {
  const r = rng(741);
  return (
    <g>
      <defs>
        <linearGradient id="ddSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4458" /><stop offset="0.6" stopColor="#a8808a" /><stop offset="1" stopColor="#c9a08a" /></linearGradient>
        <radialGradient id="ddSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe8c8" /><stop offset="0.3" stopColor="#f6c8a0" stopOpacity={0.6} /><stop offset="1" stopColor="#f6c8a0" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#ddSky)" />
      <circle cx={1050} cy={900} r={520} fill="url(#ddSun)" />
      <circle cx={1050} cy={900} r={46} fill="#fff0d8" />
      {/* far gold mass, dim at dawn */}
      <path d="M -40 1000 Q 300 900 640 950 Q 940 880 1340 940 L 1340 1060 L -40 1060 Z" fill="#8a6a4a" opacity={0.8} />
      {/* the bank: slope up to a crest, the riverbed below */}
      <rect x={0} y={1060} width={W} height={H - 1060} fill="#6a5048" />
      <polygon points={`${BANK.x0},${BANK.y0} ${BANK.x1},${BANK.y1} ${W + 40},${BANK.y1} ${W + 40},${H} ${BANK.x0},${H}`} fill="#4a3842" />
      <path d={`M ${BANK.x0} ${BANK.y0} L ${BANK.x1} ${BANK.y1} L ${W + 40} ${BANK.y1}`} stroke="#c9a08a" strokeWidth={6} fill="none" opacity={0.7} />
      {Array.from({ length: 12 }, (_, i) => { const x = r() * 900, y = bankY(x) + 20 + r() * 300; return <ellipse key={i} cx={x} cy={y} rx={20 + r() * 30} ry={6} fill="#2e2430" opacity={0.6} />; })}
      {/* the empty pit at the foot of the bank: a dark hole, nothing else */}
      <ellipse cx={170} cy={1700} rx={210} ry={60} fill="#1e161c" />
      <ellipse cx={170} cy={1690} rx={210} ry={56} fill="none" stroke="#8a6a5a" strokeWidth={6} opacity={0.6} />
    </g>
  );
};

/** drifting dawn smoke (ON ONES) */
export const Haze: React.FC<{ t: number; y: number; o?: number }> = ({ t, y, o = 0.35 }) => {
  const r = rng(751);
  return <g opacity={o}>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={((r() * 1600 + t * 20) % 1700) - 200} cy={y + r() * 260} rx={260 + r() * 200} ry={50 + r() * 50} fill="#c9a8a0" opacity={0.5} />)}</g>;
};

/* ------------------------------------ S12: close ------------------------------------ */
export const CloseBand: React.FC = () => {
  const r = rng(761);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#c8a06a" />
      <ellipse cx={300} cy={600} rx={600} ry={420} fill="#f2cc5a" opacity={0.5} />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={r() * W} cy={300 + r() * 1600} rx={60 + r() * 120} ry={120 + r() * 200} fill="#5a4024" opacity={0.35} />)}
    </g>
  );
};

/** lump of raw gold */
export const Gold: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 10 Q -70 -30 -30 -46 Q 10 -60 50 -36 Q 72 -10 56 22 Q 30 44 -10 40 Q -50 36 -60 10 Z" fill="#c8901e" />
    <path d="M -30 -46 Q 10 -60 50 -36 Q 40 -16 6 -14 Q -30 -12 -52 -6 Q -50 -36 -30 -46 Z" fill="#f2cc5a" />
    <path d="M -10 -40 l 10 -6 M 20 -36 l 8 -4" stroke="#fff2b0" strokeWidth={5} strokeLinecap="round" />
    <path d="M -20 10 q 10 8 26 2" stroke="#8a5a14" strokeWidth={3} fill="none" />
  </g>
);
