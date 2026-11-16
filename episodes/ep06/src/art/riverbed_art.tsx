import React from 'react';
import { W, H, rng } from './world';

/**
 * EP06 set "riverbed": the dry cracked bed of the river between high banks (one drawing, day / night palettes),
 * stranded boats, and the aerial desert with the river shrunk to a thread (live). No borders, signs or landmarks.
 */
export const RB = { vx: 648, vy: 1070 };
/** bank top lines and bed edges (world): left/right, from near (y=2400) to far (VP) */
export const bankTop = (side: -1 | 1, f: number) => (side < 0 ? [-120 + 690 * f, 880 + 180 * f] : [1416 - 670 * f, 860 + 200 * f]) as [number, number];
export const bedEdge = (side: -1 | 1, f: number) => (side < 0 ? [60 + 540 * f, 2400 - 1310 * f] : [1236 - 530 * f, 2400 - 1310 * f]) as [number, number];

type RPal = { sky: string[]; far: string; bank: string; bankD: string; bankTop: string; bed: string[]; crack: string; crackHi: string; crowd: string[]; haze: string };
const RPALS: Record<'day' | 'night', RPal> = {
  day: { sky: ['#e2d2b0', '#efe6d2', '#f4ecd8'], far: '#cdb48a', bank: '#b08a60', bankD: '#8a6a46', bankTop: '#c9a476', bed: ['#c49a6a', '#a07c55'], crack: '#4a3524', crackHi: '#d8b48a', crowd: ['#5a4a3e', '#3e3430', '#6a5244', '#2e2a2e', '#7a5a46'], haze: '#fff6e4' },
  night: { sky: ['#03050c', '#070b16', '#121a30'], far: '#0e1426', bank: '#182036', bankD: '#0e1322', bankTop: '#3a4868', bed: ['#34405e', '#1a2036'], crack: '#05070e', crackHi: '#a9b8d6', crowd: ['#0a0c14', '#0a0c14', '#0a0c14', '#0a0c14', '#0a0c14'], haze: '#a9b8d6' },
};
/** crowd positions on both banks (far small -> near big) */
export const CROWD = (() => {
  const r = rng(12); const out: { x: number; y: number; s: number; c: number; ph: number }[] = [];
  for (const side of [-1, 1] as const) for (let row = 0; row < 6; row++) for (let i = 0; i < 230; i++) {
    const f = Math.pow(r(), 0.7); const [x, y] = bankTop(side, f);
    const s = 0.4 + Math.pow(1 - f, 1.4) * 6.5;
    out.push({ x: x + (side < 0 ? -1 : 1) * row * 18 * s + (r() - 0.5) * 10 * s, y: y - row * 6 * s, s, c: Math.floor(r() * 5), ph: r() * 6 });
  }
  return out.sort((a, b) => a.s - b.s);
})();
export const CrowdFig: React.FC<{ x: number; y: number; s: number; col: string }> = ({ x, y, s, col }) => (
  <g fill={col}><path d={`M${x - 6 * s} ${y} L${x - 6.5 * s} ${y - 18 * s} Q${x} ${y - 22 * s} ${x + 6.5 * s} ${y - 18 * s} L${x + 6 * s} ${y} Z`} /><circle cx={x} cy={y - 25 * s} r={4.4 * s} /></g>
);

export const RiverScene: React.FC<{ m: 'day' | 'night'; crowd?: boolean }> = ({ m, crowd = true }) => {
  const p = RPALS[m]; const r = rng(3);
  const L = (f: number) => bankTop(-1, f), R = (f: number) => bankTop(1, f);
  const bl = (f: number) => bedEdge(-1, f), br = (f: number) => bedEdge(1, f);
  return (
    <g>
      <defs>
        <linearGradient id={`rbSky-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={RB.vy}>{p.sky.map((c, i) => <stop key={i} offset={i / 2} stopColor={c} />)}</linearGradient>
        <linearGradient id={`rbBed-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1={RB.vy} x2="0" y2={H}><stop offset="0" stopColor={p.bed[0]} /><stop offset="1" stopColor={p.bed[1]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#rbSky-${m})`} />
      {m === 'day' && <circle cx={980} cy={360} r={360} fill="#ffffff" opacity={0.55} />}
      {/* far flat land at the end of the bed */}
      <path d={`M400 ${RB.vy + 10} L400 ${RB.vy - 30} L900 ${RB.vy - 40} L900 ${RB.vy + 10} Z`} fill={p.far} />
      {/* bed */}
      <path d={`M${bl(0)[0] - 400} 2400 L${bl(1)[0]} ${bl(1)[1]} L${br(1)[0]} ${br(1)[1]} L${br(0)[0] + 400} 2400 Z`} fill={`url(#rbBed-${m})`} />
      {/* crack network in perspective */}
      {Array.from({ length: 260 }).map((_, i) => {
        const f = Math.pow(r(), 0.55); const y = RB.vy + 20 + (1 - f) * (H - RB.vy); const k = (y - RB.vy) / (H - RB.vy);
        const xl = bl(1)[0] + (bl(0)[0] - 300 - bl(1)[0]) * k, xr = br(1)[0] + (br(0)[0] + 300 - br(1)[0]) * k;
        const x = xl + r() * (xr - xl), w = 20 + k * 260;
        return <path key={i} d={`M${x - w / 2} ${y} l${w * 0.28} ${-3 - k * 14} l${w * 0.34} ${4 + k * 16} l${w * 0.38} ${-4 - k * 12}`} stroke={p.crack} strokeWidth={1 + k * 5} strokeOpacity={0.75} fill="none" />;
      })}
      {Array.from({ length: 120 }).map((_, i) => { const y = RB.vy + 40 + Math.pow(r(), 1.4) * (H - RB.vy); const k = (y - RB.vy) / (H - RB.vy); const x = 648 + (r() - 0.5) * (300 + k * 1600); return <path key={`h${i}`} d={`M${x} ${y} l${30 * k + 6} -${2 + 6 * k}`} stroke={p.crackHi} strokeOpacity={m === 'night' ? 0.55 : 0.35} strokeWidth={1 + 2 * k} />; })}
      {/* high banks: wall faces + tops */}
      <path d={`M${L(0)[0] - 200} ${L(0)[1]} L${L(1)[0]} ${L(1)[1]} L${bl(1)[0]} ${bl(1)[1]} L${bl(0)[0] - 400} 2400 L-300 2400 Z`} fill={p.bank} />
      <path d={`M${R(0)[0] + 200} ${R(0)[1]} L${R(1)[0]} ${R(1)[1]} L${br(1)[0]} ${br(1)[1]} L${br(0)[0] + 400} 2400 L1600 2400 Z`} fill={p.bankD} />
      {Array.from({ length: 14 }).map((_, i) => { const f = i / 14; const a = L(f), b = bl(f); return <path key={`s${i}`} d={`M${a[0]} ${a[1] + 10} L${b[0] - 30 * (1 - f)} ${b[1]}`} stroke={p.bankD} strokeOpacity={0.4} strokeWidth={2 + 6 * (1 - f)} />; })}
      {Array.from({ length: 6 }).map((_, i) => { const y = 0.2 + i * 0.12; return <path key={`st${i}`} d={`M${L(0)[0]} ${L(0)[1] + (bl(0)[1] - L(0)[1]) * y} L${L(1)[0]} ${L(1)[1] + (bl(1)[1] - L(1)[1]) * y}`} stroke={p.bankTop} strokeOpacity={0.25} strokeWidth={4} />; })}
      <path d={`M${L(0)[0] - 200} ${L(0)[1]} L${L(1)[0]} ${L(1)[1]}`} stroke={p.bankTop} strokeWidth={10} />
      <path d={`M${R(0)[0] + 200} ${R(0)[1]} L${R(1)[0]} ${R(1)[1]}`} stroke={p.bankTop} strokeWidth={10} />
      {/* ground beyond the banks (top) */}
      <path d={`M-300 ${L(0)[1]} L${L(1)[0]} ${L(1)[1]} L${L(1)[0]} ${L(1)[1] - 6} L-300 ${L(0)[1] - 30} Z`} fill={p.bankTop} />
      {crowd && CROWD.map((q, i) => <CrowdFig key={i} x={q.x} y={q.y} s={q.s} col={p.crowd[q.c]} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ boats (S03) */
/** a painted wooden boat tilted on the mud (side view); base at (x, y), length L, tilt deg */
export const Boat: React.FC<{ x: number; y: number; L: number; tilt: number; c1: string; c2: string; dir?: 1 | -1 }> = ({ x, y, L, tilt, c1, c2, dir = 1 }) => {
  const h = L * 0.22;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${dir} 1)`}>
      <ellipse cx={0} cy={6} rx={L * 0.55} ry={h * 0.25} fill="#4a3524" opacity={0.35} />
      <path d={`M${-L / 2} ${-h} Q${-L * 0.3} ${h * 0.4} 0 ${h * 0.35} Q${L * 0.36} ${h * 0.3} ${L / 2 + L * 0.06} ${-h * 1.3} L${L / 2} ${-h * 1.05} L${-L / 2 + 6} ${-h * 0.9} Z`} fill={c1} />
      <path d={`M${-L / 2 + L * 0.06} ${-h * 0.62} Q0 ${-h * 0.25} ${L / 2 + L * 0.03} ${-h * 0.95}`} stroke={c2} strokeWidth={h * 0.18} fill="none" />
      <path d={`M${-L / 2 + L * 0.1} ${-h * 0.3} Q0 ${h * 0.05} ${L / 2} ${-h * 0.55}`} stroke="#f0e6d0" strokeWidth={h * 0.06} fill="none" opacity={0.8} />
      <path d={`M${-L / 2} ${-h} L${L / 2 + L * 0.06} ${-h * 1.3}`} stroke="#3a2a1c" strokeWidth={h * 0.08} />
      <rect x={-L * 0.05} y={-h * 2.6} width={L * 0.02} height={h * 1.7} fill="#5a4030" />
      {[0.2, 0.5, 0.8].map((f) => <path key={f} d={`M${-L / 2 + L * f} ${-h * (0.95 + 0.25 * f)} l0 ${h * 0.6}`} stroke="#3a2a1c" strokeWidth={h * 0.04} opacity={0.5} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ aerial desert (S07, live) */
const meander = (k: number) => Array.from({ length: 41 }).map((_, i) => { const y = -200 + i * 70; const x = 600 + Math.sin(i * 0.33) * 260 + Math.sin(i * 0.11 + 1) * 140 + k; return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y}`; }).join(' ');
export const Aerial: React.FC<{ t: number; thin: number }> = ({ t, thin }) => {
  const r = rng(71);
  return (
    <g>
      <defs><linearGradient id="aeSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8d8b4" /><stop offset="1" stopColor="#d8c39a" /></linearGradient></defs>
      <rect x={-300} y={-300} width={W + 600} height={H + 800} fill="url(#aeSand)" />
      {Array.from({ length: 60 }).map((_, i) => { const x = r() * 1700 - 200, y = r() * 2700 - 200; return <path key={i} d={`M${x} ${y} q60 -${20 + r() * 20} 140 0 q60 ${20 + r() * 20} 140 0`} stroke="#c9b08a" strokeWidth={3} fill="none" opacity={0.6} />; })}
      {/* the pale scar of the old bed, its banks, the brown thread */}
      <path d={meander(0)} stroke="#c4a882" strokeWidth={330} fill="none" strokeLinecap="round" />
      <path d={meander(0)} stroke="#efe2c4" strokeWidth={270} fill="none" strokeLinecap="round" />
      {Array.from({ length: 50 }).map((_, i) => { const y = r() * 2600 - 200; return <path key={`c${i}`} d={`M${600 + Math.sin((y + 200) / 70 * 0.33) * 260 + Math.sin((y + 200) / 70 * 0.11 + 1) * 140 + (r() - 0.5) * 220} ${y} l20 6 l14 -8`} stroke="#c9b08a" strokeWidth={2} fill="none" />; })}
      <path d={meander(10)} stroke="#7a5a3a" strokeWidth={14 - 8 * thin} fill="none" />
      <path d={meander(10)} stroke="#d8e4e8" strokeWidth={4 - 2.5 * thin} strokeDasharray="40 60" strokeDashoffset={-t * 80} fill="none" opacity={0.8 * (1 - 0.85 * thin)} />
      {/* road + tiny trucks beside */}
      <path d="M1080 -300 Q980 900 1120 2600" stroke="#8a7a62" strokeWidth={22} fill="none" />
      <path d="M1080 -300 Q980 900 1120 2600" stroke="#e8dcc0" strokeWidth={2} strokeDasharray="24 30" fill="none" />
      {[0, 1, 2, 3, 4].map((i) => { const k = ((t * 0.05 + i * 0.21) % 1); const y = -200 + k * 2700; const x = 1080 + (1 - k) * k * 2 * -100 + k * 40 - 10 * (1 - k); return <g key={i}><rect x={x - 7} y={y - 14} width={14} height={28} rx={2} fill={i % 2 ? '#e8e2d2' : '#4a5a6a'} /><rect x={x - 6} y={y - 14} width={12} height={8} fill="#3a3a3a" /></g>; })}
      {/* a few mud-brick villages, low detail */}
      {[[300, 500], [1150, 1500], [250, 1900]].map(([x, y], i) => <g key={`v${i}`}>{Array.from({ length: 9 }).map((_, k) => <rect key={k} x={x + (k % 3) * 30} y={y + Math.floor(k / 3) * 26} width={24} height={20} fill={k % 2 ? '#c9ac80' : '#b8986a'} />)}</g>)}
    </g>
  );
};
