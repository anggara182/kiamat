import React from 'react';
import { rng } from './world';

/** Shared props for set "close": scrawl letters, pencil, doll stick, clock, hands. All frame-space SVG. */
type Pt = [number, number];
const O: Pt[] = Array.from({ length: 25 }, (_, i) => {
  const a = -Math.PI / 2 - (i / 24) * Math.PI * 2.08;
  return [0.3 + 0.32 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)] as Pt;
});
const GLYPH: Record<string, Pt[][]> = {
  P: [[[0, 1], [0, 0], [0.42, 0.03], [0.6, 0.2], [0.5, 0.42], [0.02, 0.5]]],
  L: [[[0.02, 0], [0, 1], [0.55, 0.98]]],
  A: [[[0, 1], [0.3, 0], [0.62, 1]], [[0.12, 0.62], [0.52, 0.6]]],
  Y: [[[0, 0], [0.3, 0.5], [0.62, 0]], [[0.3, 0.5], [0.28, 1]]],
  N: [[[0, 1], [0, 0], [0.62, 1], [0.64, 0]]],
  O: [O],
};

/** Build jittered strokes for a word. Returns polylines in px. */
export const scrawl = (word: string, x: number, y: number, size: number, seed: number, slant = 0.15, jit = 0.05): Pt[][] => {
  const r = rng(seed);
  const out: Pt[][] = [];
  let cx = x;
  for (const ch of word) {
    const g = GLYPH[ch];
    if (!g) { cx += size * 0.5; continue; }
    const sz = size * (0.88 + r() * 0.24);
    const dy = (r() - 0.5) * size * 0.12;
    for (const st of g) {
      out.push(st.map(([u, v]) => {
        const jx = (r() - 0.5) * jit * size, jy = (r() - 0.5) * jit * size;
        return [cx + u * sz + (1 - v) * slant * sz + jx, y + dy + v * sz + jy] as Pt;
      }));
    }
    cx += sz * 0.82;
  }
  return out;
};

const seglen = (s: Pt[]) => s.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - s[i][0], p[1] - s[i][1]), 0);
/** Partial polylines up to fraction q of total length; returns d string and pen tip. */
export const partial = (strokes: Pt[][], q: number) => {
  const total = strokes.reduce((a, s) => a + seglen(s), 0);
  let left = Math.max(0, Math.min(1, q)) * total;
  let d = '';
  let tip: Pt = strokes[0][0];
  for (const s of strokes) {
    if (left <= 0) break;
    d += `M${s[0][0].toFixed(1)},${s[0][1].toFixed(1)}`;
    tip = s[0];
    for (let i = 1; i < s.length; i++) {
      const L = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
      if (left >= L) { d += `L${s[i][0].toFixed(1)},${s[i][1].toFixed(1)}`; left -= L; tip = s[i]; }
      else {
        const f = left / L;
        tip = [s[i - 1][0] + (s[i][0] - s[i - 1][0]) * f, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * f];
        d += `L${tip[0].toFixed(1)},${tip[1].toFixed(1)}`; left = 0; break;
      }
    }
  }
  return { d, tip };
};
export const full = (strokes: Pt[][]) => strokes.map((s) => 'M' + s.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')).join('');

/** Pencil, tip at (0,0), body going up along -y, rotated by rot deg. */
export const Pencil: React.FC<{ x: number; y: number; rot: number; s?: number; rim?: string }> = ({ x, y, rot, s = 1, rim = '#ffc46b' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,0 L-14,-46 L14,-46 Z" fill="#d9b98a" />
    <path d="M0,0 L-5,-16 L5,-16 Z" fill="#2a2622" />
    <rect x={-15} y={-430} width={30} height={386} fill="#c99a2e" />
    <rect x={-15} y={-430} width={10} height={386} fill="#8a6418" />
    <rect x={10} y={-430} width={5} height={386} fill={rim} opacity={0.7} />
    <rect x={-16} y={-470} width={32} height={42} fill="#8f8f86" />
    <rect x={-15} y={-500} width={30} height={32} rx={8} fill="#b9706a" />
  </g>
);

/** The jelangkung stick body (cloth over a stick) from the top, ending in a tied pencil. Tip at (x,y). */
export const DollStick: React.FC<{ x: number; y: number; rot: number; t: number; rim?: string }> = ({ x, y, rot, t, rim = '#ffc46b' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    {/* stick */}
    <rect x={-22} y={-1300} width={44} height={1000} fill="#3d2c1c" />
    <rect x={10} y={-1300} width={10} height={1000} fill={rim} opacity={0.35} />
    {/* pencil lashed to stick */}
    <Pencil x={0} y={0} rot={0} rim={rim} />
    {/* string lashing */}
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M-30,${-360 + i * 18} C-10,${-376 + i * 18} 10,${-344 + i * 18} 30,${-358 + i * 18}`} stroke="#d8cdb2" strokeWidth={5} fill="none" />
    ))}
    <path d={`M28,-330 C46,-300 ${40 + Math.sin(t * 2) * 8},-270 ${50 + Math.sin(t * 2.3) * 10},-240`} stroke="#d8cdb2" strokeWidth={4} fill="none" />
    {/* faded cloth hanging over stick */}
    <path d={`M-220,-1400 L220,-1400 C200,-1000 170,-760 ${150 + Math.sin(t * 1.3) * 6},-600 C80,-580 40,-640 0,-590 C-40,-640 -90,-570 ${-160 + Math.sin(t * 1.1) * 6},-610 C-180,-800 -210,-1000 -220,-1400 Z`} fill="#8a7a63" />
    <path d="M-220,-1400 C-210,-1000 -180,-800 -160,-610 C-110,-640 -80,-700 -60,-1400 Z" fill="#4e4436" opacity={0.7} />
    <path d={`M150,-600 C170,-760 200,-1000 220,-1400`} stroke={rim} strokeWidth={6} fill="none" opacity={0.6} />
    <path d="M-120,-1100 C-100,-900 -80,-760 -70,-640 M40,-1200 C50,-1000 60,-800 70,-620" stroke="#5e5240" strokeWidth={5} fill="none" />
  </g>
);

/** Dark mitten hand from the frame edge (fingertips at x,y), dir=1 reaching right. */
export const Fingers: React.FC<{ x: number; y: number; dir: 1 | -1; rot?: number; rim?: string }> = ({ x, y, dir, rot = 0, rim = '#ffc46b' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${dir},1)`}>
    <path d="M-520,-120 C-360,-150 -200,-120 -90,-70 C-40,-60 0,-40 4,-10 C6,14 -20,22 -60,16 L-80,30 C-40,40 -36,66 -70,72 L-170,70 C-260,110 -400,130 -520,140 Z" fill="#1c140e" />
    <path d="M-90,-70 C-40,-60 0,-40 4,-10" stroke={rim} strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M-60,16 L-150,12 M-70,72 L-170,64" stroke="#0a0705" strokeWidth={4} fill="none" />
  </g>
);

/** Wall clock. h/m in hours/minutes, sec 0..60. */
export const Clock: React.FC<{ x: number; y: number; r: number; h: number; m: number; sec: number; light: number }> = ({ x, y, r, h, m, sec, light }) => {
  const ma = (m / 60) * 360, ha = ((h % 12) / 12) * 360 + (m / 60) * 30, sa = (sec / 60) * 360;
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <radialGradient id="ckface" cx="0.5" cy="0.75" r="0.75"><stop offset="0" stopColor="#f3e2b8" /><stop offset="0.55" stopColor="#b8a17a" /><stop offset="1" stopColor="#4a3e2e" /></radialGradient>
      </defs>
      <circle r={r + 46} fill="#20160d" />
      <circle r={r + 46} fill="none" stroke="#ffc46b" strokeWidth={6} strokeDasharray={`${(r + 46) * 2.2} ${(r + 46) * 10}`} transform="rotate(30)" opacity={0.75 * light} />
      <circle r={r + 12} fill="#3a2a1a" />
      <circle r={r} fill="url(#ckface)" />
      <circle r={r} fill="#07080a" opacity={0.55 * (1 - light)} />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0, a = (i / 60) * Math.PI * 2;
        const r1 = r * (big ? 0.82 : 0.9), r2 = r * 0.95;
        return <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2} stroke="#2a2018" strokeWidth={big ? 12 : 4} />;
      })}
      <g transform={`rotate(${ha})`}><path d={`M-14,30 L-9,${-r * 0.5} L0,${-r * 0.58} L9,${-r * 0.5} L14,30 Z`} fill="#17110b" /></g>
      <g transform={`rotate(${ma})`}><path d={`M-10,40 L-6,${-r * 0.78} L0,${-r * 0.86} L6,${-r * 0.78} L10,40 Z`} fill="#17110b" /></g>
      <g transform={`rotate(${sa})`}><path d={`M-3,60 L-2,${-r * 0.86} L2,${-r * 0.86} L3,60 Z`} fill="#7a1e14" /></g>
      <circle r={16} fill="#17110b" />
      {/* glass sheen */}
      <path d={`M${-r * 0.7},${-r * 0.45} A${r * 0.85},${r * 0.85} 0 0 1 ${r * 0.2},${-r * 0.85}`} stroke="#fff6dc" strokeWidth={10} fill="none" opacity={0.18} />
    </g>
  );
};
