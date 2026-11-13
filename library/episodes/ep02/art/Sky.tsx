import React from 'react';
import { W, HORIZON, SUN, C, rng } from './world';

/**
 * Mega mendung cloud (Cirebon batik): one lobed contour; the graded bands are concentric
 * strokes of the SAME contour (widest/darkest first), so every band follows the outline.
 */
const cloudPath = (w: number, h: number, lobes: number, seed: number) => {
  const r = rng(seed);
  const left = -w / 2;
  const step = w / lobes;
  let d = `M ${left} 0`;
  for (let i = 0; i < lobes; i++) {
    const x0 = left + i * step;
    const lh = h * (0.5 + 0.5 * Math.sin(((i + 0.5) / lobes) * Math.PI)) * (0.85 + r() * 0.3);
    d += ` C ${x0 - step * 0.08} ${-lh * 1.25}, ${x0 + step * 1.08} ${-lh * 1.25}, ${x0 + step} 0`;
  }
  // underside with the signature curl
  d += ` C ${w * 0.42} ${h * 0.26}, ${w * 0.2} ${h * 0.3}, ${w * 0.08} ${h * 0.16}`;
  d += ` C ${w * 0.02} ${h * 0.06}, ${-w * 0.08} ${h * 0.1}, ${-w * 0.04} ${h * 0.2}`;
  d += ` C ${-w * 0.02} ${h * 0.34}, ${-w * 0.36} ${h * 0.34}, ${left} 0 Z`;
  return d;
};

export const MegaMendung: React.FC<{ cx: number; cy: number; w: number; h: number; lobes?: number; seed?: number; tones: string[]; band?: number; opacity?: number }> = ({ cx, cy, w, h, lobes = 5, seed = 1, tones, band = 18, opacity = 1 }) => {
  const d = cloudPath(w, h, lobes, seed);
  const n = tones.length;
  return (
    <g transform={`translate(${cx} ${cy})`} opacity={opacity}>
      {/* outermost band first = widest stroke; inner bands are progressively narrower strokes on top */}
      {tones.map((c, i) => (
        <path key={i} d={d} fill={i === n - 1 ? c : 'none'} stroke={c} strokeWidth={(n - 1 - i) * band * 2 + 0.01} strokeLinejoin="round" />
      ))}
      {/* fine ink line separating bands, typical of the batik look */}
      {/* thin ink line on the outer contour, the batik line work */}
      <path d={d} fill="none" stroke="#1a0f2e" strokeOpacity={0.5} strokeWidth={2} strokeLinejoin="round" transform={`scale(${1 + (n - 1) * band / (w / 2)})`} />
    </g>
  );
};

export const Sky: React.FC = () => {
  const r = rng(7);
  const stars = Array.from({ length: 90 }, () => ({ x: r() * W, y: r() * 460, s: 0.5 + r() * 1.5, o: 0.15 + r() * 0.6 }));
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyTop} />
          <stop offset="0.32" stopColor={C.skyHigh} />
          <stop offset="0.64" stopColor={C.skyMid} />
          <stop offset="0.88" stopColor={C.skyLow} />
          <stop offset="1" stopColor={C.skyHorizon} />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.95" />
          <stop offset="0.18" stopColor={C.sunGlow} stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#e3735e" stopOpacity="0.18" />
          <stop offset="1" stopColor="#e3735e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunDisc" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#fffdf4" />
          <stop offset="0.65" stopColor={C.sun} />
          <stop offset="1" stopColor="#ffcf8a" />
        </radialGradient>
        <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b4566a" stopOpacity="0" />
          <stop offset="0.5" stopColor="#b4566a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#b4566a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={HORIZON + 4} fill="url(#sky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={s.o * 0.8} />)}

      {/* high mega mendung, cool, catching the last light on the lower bands */}
      <MegaMendung cx={300} cy={250} w={600} h={160} lobes={6} seed={3} band={11} tones={['#1e1a44', '#2c2454', '#3d2d60', '#53386a', '#6e4470', '#8c5374']} />
      <MegaMendung cx={1040} cy={430} w={540} h={140} lobes={5} seed={9} band={10} tones={['#2c2454', '#46306a', '#66396c', '#8a486e', '#b05d6c', '#d37a6c']} />
      {/* sun + glow sit behind the low clouds */}
      <circle cx={SUN.x} cy={SUN.y} r={560} fill="url(#sunGlow)" />
      <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#sunDisc)" />
      {/* thin haze streaks passing in front of the sun (soft, tapered) */}
      {[[-18, 7, 520], [8, 5, 440], [30, 9, 620], [52, 6, 380]].map(([dy, h, w], i) => (
        <rect key={i} x={SUN.x - w / 2 + (i % 2 ? 40 : -30)} y={SUN.y + dy} width={w} height={h} rx={h / 2} fill="url(#streak)" opacity={0.7} />
      ))}
      <MegaMendung cx={200} cy={660} w={500} h={120} lobes={5} seed={12} band={9} tones={['#5c3364', '#7d4066', '#a14f64', '#c46560', '#e07f62', '#f59d6c']} />
      <MegaMendung cx={1080} cy={780} w={420} h={96} lobes={4} seed={21} band={8} tones={['#8a4566', '#ad5662', '#cc6c5e', '#e5875f', '#f6a56c', '#ffc286']} />
      <MegaMendung cx={850} cy={900} w={300} h={64} lobes={4} seed={30} band={6} tones={['#b7605f', '#d4775e', '#ec9364', '#fcb176', '#ffd29a']} opacity={0.9} />
      <MegaMendung cx={330} cy={930} w={260} h={54} lobes={3} seed={44} band={6} tones={['#b05a60', '#cf725f', '#e98f64', '#fbae76']} opacity={0.85} />
      {/* horizon haze band */}
      <rect x={0} y={HORIZON - 60} width={W} height={64} fill="#ffcf96" opacity={0.18} />
    </g>
  );
};
