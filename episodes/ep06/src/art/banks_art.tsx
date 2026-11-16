import React from 'react';
import { H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP06 set "banks": the dry Euphrates bed and its banks, scorched day.
 * bed  (wide band, 2400 px): cracked riverbed, the bank rising on the left (S02, S13, S15)
 * pool (tall band, 3000 px): a shrinking pool near, fish carpet to the horizon (S04 crane up)
 * field: a dead cracked field, far village (S08)
 * top  : top-down damp mud (S14)
 * ---------------------------------------------------------------------------------------- */
export const BED = { w: 2400, horizon: 1000, ground: 1560 };
export const POOL = { h: 3000, horizon: 760, edge: 2300 };
const SKY = ['#d8c39a', '#efe6d2'];

/** cracked-mud cells between y0 and y1 (cells grow toward the camera); lines in crack colour */
const cracks = (seed: number, w: number, y0: number, y1: number, dark = '#4a3524', cell0 = 40, cell1 = 260) => {
  const r = rng(seed);
  const out: React.ReactNode[] = [];
  let y = y0, row = 0;
  while (y < y1) {
    const k = (y - y0) / (y1 - y0), ch = cell0 * 0.45 + (cell1 * 0.45 - cell0 * 0.45) * k, cw = cell0 + (cell1 - cell0) * k;
    let x = -r() * cw;
    out.push(<path key={`h${row}`} d={`M -40 ${y} ${Array.from({ length: Math.ceil(w / cw) + 2 }, (_, i) => `L ${i * cw} ${y + (r() - 0.5) * ch * 0.3}`).join(' ')}`} stroke={dark} strokeWidth={1.5 + 4 * k} fill="none" opacity={0.75} />);
    while (x < w + 40) { out.push(<path key={`v${row}${x.toFixed(0)}`} d={`M ${x} ${y} l ${(r() - 0.5) * cw * 0.3} ${ch}`} stroke={dark} strokeWidth={1.5 + 4 * k} opacity={0.75} />); x += cw * (0.7 + r() * 0.6); }
    y += ch; row++;
  }
  return out;
};

const palm = (x: number, y: number, s: number, c: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <path d="M -6 0 Q -14 -160 4 -300 L 12 -300 Q -2 -160 8 0 Z" />
    {[-150, -110, -60, -20, 30, 70, 120].map((a) => <path key={a} d={`M 8 -300 Q ${8 + Math.cos((a * Math.PI) / 180) * 80} ${-300 + Math.sin((a * Math.PI) / 180) * 80 - 30} ${8 + Math.cos((a * Math.PI) / 180) * 150} ${-300 + Math.sin((a * Math.PI) / 180) * 150 + 40} Q ${8 + Math.cos((a * Math.PI) / 180) * 80} ${-300 + Math.sin((a * Math.PI) / 180) * 60} 8 -300 Z`} />)}
  </g>
);

export const BedBand: React.FC = () => {
  const W = BED.w;
  return (
    <g>
      <defs>
        <linearGradient id="bkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SKY[0]} /><stop offset="1" stopColor={SKY[1]} /></linearGradient>
        <linearGradient id="bkMud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4a47a" /><stop offset="1" stopColor="#a07c55" /></linearGradient>
        <radialGradient id="bkSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbea" /><stop offset="0.3" stopColor="#fff2cc" stopOpacity={0.6} /><stop offset="1" stopColor="#fff2cc" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bkSky)" />
      <circle cx={1700} cy={300} r={500} fill="url(#bkSun)" />
      {/* far opposite bank, low, with palms */}
      <path d={`M -40 ${BED.horizon} Q 600 ${BED.horizon - 60} 1200 ${BED.horizon - 30} Q 1800 ${BED.horizon - 70} ${W + 40} ${BED.horizon - 20} L ${W + 40} ${BED.horizon + 20} L -40 ${BED.horizon + 20} Z`} fill="#b8a07a" />
      {[300, 520, 1400, 1650, 2100].map((x, i) => palm(x, BED.horizon - 30, 0.45 + (i % 2) * 0.1, '#8a8a6a', `fp${i}`))}
      {/* the near bank rising on the left (people run down it in S15) */}
      <path d={`M -40 640 Q 300 660 560 820 Q 760 940 980 ${BED.horizon + 40} L -40 ${BED.horizon + 40} Z`} fill="#b89870" />
      <path d={`M -40 640 Q 300 660 560 820 Q 760 940 980 ${BED.horizon + 40}`} stroke="#d8c39a" strokeWidth={6} fill="none" />
      {[60, 220].map((x, i) => palm(x, 650 + i * 10, 0.7, '#7a7a5a', `bp${i}`))}
      {/* the riverbed: pale cracked mud to the horizon */}
      <rect x={0} y={BED.horizon + 20} width={W} height={H} fill="url(#bkMud)" />
      {cracks(801, W, BED.horizon + 30, H, '#4a3524', 30, 300)}
      {/* old water lines on the bank */}
      <path d={`M 980 ${BED.horizon + 40} L ${W + 40} ${BED.horizon + 40}`} stroke="#8a6a48" strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/** heat shimmer faked with drifting pale bands (no filters) (ON ONES) */
export const Heat: React.FC<{ t: number; y: number; w?: number }> = ({ t, y, w = 2400 }) => (
  <g opacity={0.35}>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={((i * 400 + t * 60) % (w + 400)) - 400} y={y + Math.sin(t * 3 + i) * 6 + i * 8} width={360} height={5} rx={3} fill="#fff6e0" />)}</g>
);

/** wooden fishing boat, side view, bow to the right; x = stern bottom-left */
export const Boat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={300} cy={6} rx={320} ry={16} fill="#2a2018" opacity={0.35} />
    <path d="M 0 -150 L 520 -150 Q 600 -150 640 -200 Q 600 -40 520 0 L 60 0 Q 10 -40 0 -150 Z" fill="#7a5a3a" />
    <path d="M 0 -150 L 520 -150 Q 600 -150 640 -200 L 630 -180 Q 590 -134 520 -134 L 4 -134 Z" fill="#a8865c" />
    {[-110, -70, -36].map((yy) => <path key={yy} d={`M ${12 + (yy + 150) * 0.1} ${yy} L ${560 - (yy + 150) * 0.4} ${yy}`} stroke="#5a4028" strokeWidth={4} opacity={0.7} />)}
    <rect x={150} y={-180} width={14} height={34} fill="#5a4028" />
    <path d="M 160 -180 q 60 -10 120 30" stroke="#8a7a5a" strokeWidth={3} fill="none" />
    <path d="M 340 -160 L 480 -170 L 476 -150 Z" fill="#c9b48a" />
  </g>
);

/* ------------------------------------------ pool ------------------------------------------ */
export const PoolBand: React.FC = () => {
  const r = rng(811);
  const W = 1296, Hh = POOL.h;
  return (
    <g>
      <defs><linearGradient id="bpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SKY[0]} /><stop offset="1" stopColor={SKY[1]} /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={Hh} fill="url(#bpSky)" />
      <rect x={0} y={POOL.horizon} width={W} height={Hh} fill="#a07c55" />
      {/* the far flats: a silver carpet of fish all the way to the horizon */}
      {Array.from({ length: 70 }, (_, row) => {
        const y = POOL.horizon + 10 + row * row * 0.32 + row * 6;
        if (y > POOL.edge - 200) return null;
        const s = 0.2 + row * 0.04, n = Math.floor(W / (16 * s));
        let d = '';
        for (let k = 0; k < n; k += 2) { const x = k * 16 * s + r() * 10 * s; d += `M ${x.toFixed(1)} ${y + r() * 6 * s} l ${(10 * s).toFixed(1)} ${(-2 * s).toFixed(1)} `; }
        return <path key={row} d={d} stroke={row % 3 ? '#cfd6d8' : '#a9b2b6'} strokeWidth={Math.max(1, 2.6 * s)} strokeLinecap="round" opacity={0.55} />;
      })}
      {cracks(812, W, POOL.horizon + 20, POOL.edge - 160, '#5a4430', 20, 120).map((n, i) => <g key={i} opacity={0.4}>{n}</g>)}
      {/* the near pool: murky, shallow, a ring of wet mud */}
      <ellipse cx={640} cy={POOL.edge + 260} rx={900} ry={360} fill="#6a5238" />
      <ellipse cx={640} cy={POOL.edge + 270} rx={820} ry={310} fill="#7a8a7e" />
      <ellipse cx={600} cy={POOL.edge + 220} rx={500} ry={90} fill="#c9d4cc" opacity={0.35} />
    </g>
  );
};

/** a silver fish flopping: ph = phase (people/animals ON TWOS) */
export const Fish: React.FC<{ x: number; y: number; s: number; ph: number }> = ({ x, y, s, ph }) => {
  const bend = Math.sin(ph) * 22, hop = Math.max(0, Math.sin(ph * 0.5)) * 30;
  return (
    <g transform={`translate(${x} ${y - hop}) rotate(${bend * 0.6}) scale(${s})`}>
      <path d={`M -40 0 Q -10 -16 26 -4 Q 36 0 26 6 Q -10 18 -40 4 Z`} fill="#c9d2d6" />
      <path d={`M -40 0 Q -10 -16 26 -4`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.8} />
      <path d={`M -38 2 L ${-58} ${-12 + bend * 0.4} L ${-56} ${16 + bend * 0.4} Z`} fill="#a9b2b6" />
      <circle cx={18} cy={-1} r={3} fill="#1a1a1e" />
    </g>
  );
};

/** a plastic bucket hanging from a hand at (x,y) (top of the handle) */
export const Bucket: React.FC<{ x: number; y: number; s?: number; col?: string; sw?: number }> = ({ x, y, s = 1, col = '#4f7a9a', sw = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${sw}) scale(${s})`}>
    <path d="M -26 0 Q 0 -20 26 0" stroke="#3a3a3e" strokeWidth={3} fill="none" />
    <path d="M -30 4 L 30 4 L 24 64 L -24 64 Z" fill={col} />
    <rect x={-30} y={2} width={60} height={8} fill="#ffffff" opacity={0.3} />
  </g>
);

/* ------------------------------------------ field ------------------------------------------ */
export const FIELD = { ground: 1560 };
export const FieldBand: React.FC = () => {
  const r = rng(821), W = 1296;
  return (
    <g>
      <defs><linearGradient id="bfSky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SKY[0]} /><stop offset="1" stopColor={SKY[1]} /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bfSky2)" />
      {/* far village: mud-brick + concrete boxes, a water tower, palms */}
      {Array.from({ length: 9 }, (_, i) => { const x = i * 150 + r() * 40, w = 90 + r() * 60, h = 60 + r() * 70; return <g key={i}><rect x={x} y={1000 - h} width={w} height={h} fill={i % 2 ? '#c8b08a' : '#bba07a'} /><rect x={x + 20} y={1000 - h + 20} width={16} height={20} fill="#6a5a44" /></g>; })}
      {palm(980, 1000, 0.5, '#8a8a6a', 'p1')}{palm(160, 1000, 0.42, '#8a8a6a', 'p2')}
      <rect x={0} y={1000} width={W} height={H} fill="#a8865e" />
      {cracks(822, W, 1010, H, '#4a3524', 24, 240)}
      {/* rows of dead stalks */}
      {Array.from({ length: 8 }, (_, row) => {
        const y = 1050 + row * row * 9 + row * 30, s = 0.4 + row * 0.18;
        return <g key={row}>{Array.from({ length: Math.ceil(W / (70 * s)) + 1 }, (_, k) => { const x = k * 70 * s + (row % 2) * 35 * s; return <path key={k} d={`M ${x} ${y} q ${-6 * s} ${-30 * s} ${4 * s} ${-60 * s} M ${x} ${y} q ${10 * s} ${-20 * s} ${18 * s} ${-34 * s}`} stroke="#7a5e3a" strokeWidth={3 * s} fill="none" strokeLinecap="round" />; })}</g>;
      })}
      {/* a dead tree */}
      <path d="M 1120 1010 L 1110 760 M 1110 820 L 1060 740 M 1112 790 L 1170 720 M 1080 770 L 1050 760" stroke="#5a4430" strokeWidth={12} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------ top-down ------------------------------------------ */
export const TopBand: React.FC = () => {
  const r = rng(831), W = 1296;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#9a7650" />
      <ellipse cx={648} cy={1100} rx={700} ry={600} fill="#7a5a3a" />
      {cracks(832, W, 0, H, '#4a3524', 160, 220).map((n, i) => <g key={i} opacity={0.6}>{n}</g>)}
      {Array.from({ length: 50 }, (_, i) => { const x = r() * W, y = r() * H, s = 6 + r() * 16; return <g key={i}><ellipse cx={x + 4} cy={y + 4} rx={s} ry={s * 0.7} fill="#2a1e14" opacity={0.3} /><ellipse cx={x} cy={y} rx={s} ry={s * 0.7} fill={r() < 0.5 ? '#8a6a48' : '#b8966a'} /></g>; })}
    </g>
  );
};

/** the raw gold surface uncovered: a rough curved glowing patch of width w centred at (x,y) with a torn mud rim */
export const GoldPatch: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => {
  if (w <= 2) return null;
  const n = 18, pts: string[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, j = 1 + 0.12 * Math.sin(i * 2.7) + 0.08 * Math.sin(i * 5.3); pts.push(`${x + Math.cos(a) * w * 0.5 * j},${y + Math.sin(a) * h * 0.5 * j}`); }
  return (
    <g>
      <defs><radialGradient id="bkGold" cx="0.45" cy="0.4" r="0.6"><stop offset="0" stopColor="#fff0b0" /><stop offset="0.45" stopColor="#e8b84a" /><stop offset="1" stopColor="#9a6a1c" /></radialGradient></defs>
      <polygon points={pts.join(' ')} fill="#4a3524" transform={`translate(0 6) scale(1.04) translate(${-x * 0.04} ${-y * 0.04})`} />
      <polygon points={pts.join(' ')} fill="url(#bkGold)" />
      <path d={`M ${x - w * 0.3} ${y - h * 0.15} Q ${x} ${y - h * 0.3} ${x + w * 0.3} ${y - h * 0.12}`} stroke="#fff6d0" strokeWidth={Math.max(2, h * 0.05)} fill="none" opacity={0.7 + 0.2 * Math.sin(t * 4)} />
    </g>
  );
};

/** a glint with a soft star flare (ON ONES) */
export const Glint: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => k <= 0 ? null : (
  <g opacity={k}>
    <defs><radialGradient id="bkGlint" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6d0" stopOpacity={1} /><stop offset="0.3" stopColor="#ffe08a" stopOpacity={0.5} /><stop offset="1" stopColor="#ffd060" stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={140 * s * k} fill="url(#bkGlint)" />
    <path d={`M ${x - 200 * s * k} ${y} L ${x + 200 * s * k} ${y} M ${x} ${y - 120 * s * k} L ${x} ${y + 120 * s * k}`} stroke="#fff6d0" strokeWidth={4 * s} opacity={0.8} />
    <circle cx={x} cy={y} r={10 * s} fill="#ffffff" />
  </g>
);

/** a goat, side view (animal: ON TWOS); run 0/1 */
export const Goat: React.FC<{ x: number; y: number; s: number; t2: number; dir?: number; run?: boolean }> = ({ x, y, s, t2, dir = 1, run = true }) => {
  const ph = run ? Math.sin(t2 * 14) : 0, c = '#e8e0d0', d = '#8a7a62';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <ellipse cx={0} cy={2} rx={44} ry={5} fill="#2a2018" opacity={0.3} />
      <path d={`M 22 -34 L ${30 + ph * 8} 0 M 16 -34 L ${18 - ph * 7} 0 M -24 -34 L ${-30 - ph * 8} 0 M -18 -34 L ${-12 + ph * 7} 0`} stroke={d} strokeWidth={5} strokeLinecap="round" />
      <path d={`M -34 -40 Q -12 ${-56 - ph * 2} 24 -50 Q 36 -46 34 -32 Q 10 -26 -30 -28 Z`} fill={c} />
      <path d="M 24 -50 L 40 -66 Q 50 -70 56 -60 L 54 -52 L 42 -46 Z" fill={c} />
      <path d="M 40 -66 q -6 -14 -16 -16 M 44 -66 q -2 -14 -10 -20" stroke={d} strokeWidth={3} fill="none" />
      <path d="M 52 -52 l 2 10" stroke={d} strokeWidth={3} />
      <path d={`M -34 -40 l -8 ${-6 + ph * 3}`} stroke={c} strokeWidth={5} strokeLinecap="round" />
      <circle cx={48} cy={-60} r={2} fill="#1a1a1e" />
    </g>
  );
};

/** dust drifting/blowing (ON ONES) */
export const Dust: React.FC<{ t: number; n?: number; w?: number; col?: string; o?: number }> = ({ t, n = 30, w = 1296, col = '#f2e2c0', o = 0.5 }) => {
  const r = rng(841);
  return <g fill={col}>{Array.from({ length: n }, (_, i) => { const x0 = r() * w, y0 = r() * H, s = 2 + r() * 4; return <circle key={i} cx={(x0 + t * (20 + r() * 30)) % w} cy={(y0 - t * (4 + r() * 6) + H) % H} r={s} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(t + i)))} />; })}</g>;
};
