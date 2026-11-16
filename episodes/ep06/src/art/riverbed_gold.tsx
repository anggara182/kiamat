import React from 'react';
import { W, H, rng } from './world';

/**
 * EP06 set "riverbed" (copied from EP07 goldfield art and restyled): a raw mountain of gold (huge curved rough glowing back, like a buried mountain) rising from a dry
 * cracked riverbed. One drawing with a palette, baked as night / day / dawn, plus a bokeh backdrop for the close-up.
 * Violence implied only; soldiers are distant plain silhouettes, no flags or insignia.
 */
export type GPal = { sky: string[]; gold: string[]; ridge: string; glint: string; bed: string[]; crack: string; far: string; glow: number };
export const GPALS: Record<'night' | 'day' | 'dawn', GPal> = {
  night: { sky: ['#05060c', '#0a0b16', '#1a1420'], gold: ['#f0b850', '#a86e22', '#3a2208'], ridge: '#2a1806', glint: '#fff6d0', bed: ['#2a1e16', '#0c0806'], crack: '#050302', far: '#0c0a12', glow: 0.9 },
  day: { sky: ['#efe6d2', '#e6d8b8', '#d8c39a'], gold: ['#fff0b0', '#e8b84a', '#9a6a1c'], ridge: '#7a5218', glint: '#ffffff', bed: ['#b08a60', '#a07c55'], crack: '#4a3524', far: '#c4ae88', glow: 0.4 },
  dawn: { sky: ['#2b2440', '#8a5a5a', '#f2a65e'], gold: ['#fff0b0', '#e8b84a', '#9a6a1c'], ridge: '#6a4418', glint: '#fff6d8', bed: ['#a07c55', '#4a3524'], crack: '#3a2a1c', far: '#5a4048', glow: 0.75 },
};
export const GM = { cx: 700, top: 960, w: 2300, base: 1560 };

/** the gold mountain + riverbed (static) */
export const GoldScene: React.FC<{ m: 'night' | 'day' | 'dawn' }> = ({ m }) => {
  const p = GPALS[m]; const r = rng(7);
  const g = GM;
  // rough top edge: a broad curve broken by boulders and shoulders
  const N = 36;
  const edge = Array.from({ length: N + 1 }).map((_, i) => {
    const f = i / N, x = g.cx - g.w / 2 + f * g.w;
    const curve = g.top + (g.base - g.top) * Math.pow(Math.abs(f - 0.47) * 2, 1.8);
    const bump = Math.sin(i * 2.3) * 22 + Math.sin(i * 5.1) * 12 + (r() - 0.5) * 30 - (i % 7 === 3 ? 40 : 0);
    return [x, Math.min(g.base, curve + bump)] as [number, number];
  });
  const dome = `M${g.cx - g.w / 2} ${g.base} ` + edge.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ` L${g.cx + g.w / 2} ${g.base} Z`;
  // facets: irregular planes, lit from the upper left
  const facets = Array.from({ length: 46 }).map(() => {
    const cx = g.cx + (r() - 0.5) * g.w * 0.85, cy = g.top + 40 + r() * (g.base - g.top - 40);
    const rr = 50 + r() * 140; const n = 5 + Math.floor(r() * 3);
    const pts = Array.from({ length: n }).map((__, k) => { const a = (k / n) * Math.PI * 2 + r() * 0.5; return `${(cx + Math.cos(a) * rr * (0.6 + r() * 0.6)).toFixed(1)},${(cy + Math.sin(a) * rr * 0.55 * (0.6 + r() * 0.6)).toFixed(1)}`; }).join(' ');
    return { pts, light: r() < 0.45, o: 0.12 + r() * 0.22 };
  });
  return (
    <g>
      <defs>
        <linearGradient id={`gfSky-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={g.base}>{p.sky.map((c, i) => <stop key={i} offset={i / (p.sky.length - 1)} stopColor={c} />)}</linearGradient>
        <radialGradient id={`gfGold-${m}`} gradientUnits="userSpaceOnUse" cx={g.cx - 80} cy={g.top + 260} r={g.w * 0.5}><stop offset="0" stopColor={p.gold[0]} /><stop offset="0.45" stopColor={p.gold[1]} /><stop offset="1" stopColor={p.gold[2]} /></radialGradient>
        <radialGradient id={`gfHalo-${m}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={p.gold[0]} stopOpacity={0.5 * p.glow} /><stop offset="1" stopColor={p.gold[1]} stopOpacity={0} /></radialGradient>
        <linearGradient id={`gfBed-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1={g.base - 40} x2="0" y2={H}><stop offset="0" stopColor={p.bed[0]} /><stop offset="1" stopColor={p.bed[1]} /></linearGradient>
        <clipPath id={`gfClip-${m}`}><path d={dome} /></clipPath>
        <radialGradient id={`gfRelL-${m}`} cx="0.42" cy="0.38" r="0.6"><stop offset="0" stopColor={p.glint} stopOpacity={0.4} /><stop offset="1" stopColor={p.glint} stopOpacity={0} /></radialGradient>
        <radialGradient id={`gfRelD-${m}`} cx="0.6" cy="0.65" r="0.6"><stop offset="0" stopColor={p.ridge} stopOpacity={0.28} /><stop offset="1" stopColor={p.ridge} stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#gfSky-${m})`} />
      {m === 'day' && <circle cx={240} cy={420} r={320} fill="#ffffff" opacity={0.6} />}
      {m === 'dawn' && <ellipse cx={1080} cy={1500} rx={600} ry={300} fill="#ffc8a0" opacity={0.35} />}
      <path d={`M-40 ${g.base - 20} Q200 ${g.base - 160} 420 ${g.base - 90} Q700 ${g.base - 200} 1000 ${g.base - 110} Q1200 ${g.base - 170} ${W + 40} ${g.base - 60} V${g.base + 40} H-40 Z`} fill={p.far} />
      <ellipse cx={g.cx} cy={g.top + 280} rx={g.w * 0.55} ry={560} fill={`url(#gfHalo-${m})`} />
      <path d={dome} fill={`url(#gfGold-${m})`} />
      <g clipPath={`url(#gfClip-${m})`}>
        {facets.map((f, i) => { const [cx, cy] = f.pts.split(' ')[0].split(',').map(Number); return <ellipse key={i} cx={cx} cy={cy} rx={120 + (i % 5) * 50} ry={26 + (i % 4) * 10} fill={`url(#gfRel${f.light ? 'L' : 'D'}-${m})`} transform={`rotate(${(i * 37) % 30 - 15} ${cx} ${cy})`} />; })}
        {Array.from({ length: 30 }).map((_, i) => { const x = g.cx + (r() - 0.5) * g.w * 0.8, y = g.top + 40 + r() * (g.base - g.top - 60); return <path key={`c${i}`} d={`M${x} ${y} l${r() * 40 - 20} ${16 + r() * 30} l${r() * 30 - 15} ${14 + r() * 24} l${r() * 20 - 10} ${10 + r() * 20}`} stroke={p.ridge} strokeWidth={2 + r() * 3} strokeOpacity={0.55} fill="none" />; })}
        {Array.from({ length: 120 }).map((_, i) => { const x = g.cx + (r() - 0.55) * g.w * 0.75, y = g.top + 20 + r() * (g.base - g.top - 40); return <circle key={`g${i}`} cx={x} cy={y} r={1.5 + r() * 3.5} fill={p.glint} opacity={0.35 + r() * 0.55} />; })}
        <rect x={0} y={g.base - 120} width={W} height={120} fill={p.gold[2]} opacity={0.5} />
      </g>
      <path d={edge.slice(6, 22).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y + 4}`).join(' ')} stroke={p.glint} strokeOpacity={0.55} strokeWidth={6} fill="none" />
      {/* the dry cracked riverbed */}
      <rect x={0} y={g.base - 30} width={W} height={H - g.base + 30} fill={`url(#gfBed-${m})`} />
      {Array.from({ length: 140 }).map((_, i) => {
        const y = g.base + Math.pow(r(), 1.6) * (H - g.base); const k = (y - g.base) / (H - g.base);
        const x = r() * W, w = 30 + k * 220;
        return <path key={`k${i}`} d={`M${x - w / 2} ${y} l${w * 0.3} ${-6 - k * 10} l${w * 0.4} ${4 + k * 12} l${w * 0.3} ${-5 - k * 8}`} stroke={p.crack} strokeWidth={1.5 + k * 4} strokeOpacity={0.7} fill="none" />;
      })}
      <rect x={0} y={g.base - 30} width={W} height={30} fill={p.gold[1]} opacity={0.18 * p.glow} />
    </g>
  );
};

/** plain truck silhouette (no markings), facing dir */
export const Truck: React.FC<{ x: number; y: number; s: number; col: string; dir?: 1 | -1 }> = ({ x, y, s, col, dir = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`} fill={col}>
    <rect x={-120} y={-90} width={160} height={70} rx={6} />
    <path d="M40 -70 L90 -70 L110 -40 L110 -20 L40 -20 Z" />
    <rect x={-124} y={-96} width={168} height={10} rx={4} opacity={0.8} />
    <circle cx={-80} cy={-14} r={18} /><circle cx={-30} cy={-14} r={18} /><circle cx={80} cy={-14} r={18} />
  </g>
);
/** tiny standing figure (soldier/digger) */
export const Tiny: React.FC<{ x: number; y: number; s: number; col: string; ph?: number }> = ({ x, y, s, col, ph = 0 }) => (
  <g fill={col}><rect x={x - 3 * s} y={y - 18 * s + Math.sin(ph) * s} width={6 * s} height={14 * s} rx={2 * s} /><circle cx={x} cy={y - 21 * s + Math.sin(ph) * s} r={3 * s} /><rect x={x - 2.6 * s} y={y - 5 * s} width={5.2 * s} height={5 * s} /></g>
);
