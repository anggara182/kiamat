import React from 'react';
import { W, H, rng } from './world';

/**
 * EP07 set "goldfield": a raw mountain of gold (huge curved rough glowing back, like a buried mountain) rising from a dry
 * cracked riverbed. One drawing with a palette, baked as night / day / dawn, plus a bokeh backdrop for the close-up.
 * Violence implied only; soldiers are distant plain silhouettes, no flags or insignia.
 */
export type GPal = { sky: string[]; gold: string[]; ridge: string; glint: string; bed: string[]; crack: string; far: string; glow: number };
export const GPALS: Record<'night' | 'day' | 'dawn', GPal> = {
  night: { sky: ['#05060c', '#0a0b16', '#1a1420'], gold: ['#ffe8a0', '#e8b84a', '#8a5a1e'], ridge: '#6a4214', glint: '#fff6d0', bed: ['#2a1e16', '#0c0806'], crack: '#050302', far: '#0c0a12', glow: 0.9 },
  day: { sky: ['#cdd6da', '#e6e2d6', '#f2e6c8'], gold: ['#fff0b0', '#e2b04a', '#a8782a'], ridge: '#8a5e22', glint: '#ffffff', bed: ['#d8b27a', '#a8865a'], crack: '#7a5a3a', far: '#bfae94', glow: 0.35 },
  dawn: { sky: ['#2e2238', '#5a4458', '#c9a08a'], gold: ['#ffd890', '#d8a04a', '#7a4e26'], ridge: '#5e3a20', glint: '#fff0d0', bed: ['#8a6a5a', '#3a2a2a'], crack: '#241818', far: '#4a3a48', glow: 0.6 },
};
export const GM = { cx: 700, top: 980, w: 1700, base: 1560 };

/** the gold mountain + riverbed (static) */
export const Goldfield: React.FC<{ m: 'night' | 'day' | 'dawn' }> = ({ m }) => {
  const p = GPALS[m]; const r = rng(7);
  const g = GM;
  const dome = `M${g.cx - g.w / 2} ${g.base} C${g.cx - g.w * 0.38} ${g.top + 160} ${g.cx - g.w * 0.18} ${g.top - 10} ${g.cx} ${g.top} C${g.cx + g.w * 0.2} ${g.top + 10} ${g.cx + g.w * 0.36} ${g.top + 180} ${g.cx + g.w / 2} ${g.base} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`gfSky-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={g.base}>{p.sky.map((c, i) => <stop key={i} offset={i / (p.sky.length - 1)} stopColor={c} />)}</linearGradient>
        <radialGradient id={`gfGold-${m}`} gradientUnits="userSpaceOnUse" cx={g.cx - 80} cy={g.top + 220} r={g.w * 0.55}><stop offset="0" stopColor={p.gold[0]} /><stop offset="0.45" stopColor={p.gold[1]} /><stop offset="1" stopColor={p.gold[2]} /></radialGradient>
        <radialGradient id={`gfHalo-${m}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={p.gold[0]} stopOpacity={0.5 * p.glow} /><stop offset="1" stopColor={p.gold[1]} stopOpacity={0} /></radialGradient>
        <linearGradient id={`gfBed-${m}`} gradientUnits="userSpaceOnUse" x1="0" y1={g.base - 40} x2="0" y2={H}><stop offset="0" stopColor={p.bed[0]} /><stop offset="1" stopColor={p.bed[1]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#gfSky-${m})`} />
      {m === 'day' && <circle cx={240} cy={420} r={320} fill="#ffffff" opacity={0.6} />}
      {m === 'dawn' && <ellipse cx={1080} cy={1500} rx={600} ry={300} fill="#ffc8a0" opacity={0.35} />}
      {/* far banks: low hills */}
      <path d={`M-40 ${g.base - 20} Q200 ${g.base - 160} 420 ${g.base - 90} Q700 ${g.base - 200} 1000 ${g.base - 110} Q1200 ${g.base - 170} ${W + 40} ${g.base - 60} V${g.base + 40} H-40 Z`} fill={p.far} />
      {/* halo of the gold into the air */}
      <ellipse cx={g.cx} cy={g.top + 260} rx={g.w * 0.65} ry={520} fill={`url(#gfHalo-${m})`} />
      {/* the mountain: rough curved back */}
      <path d={dome} fill={`url(#gfGold-${m})`} />
      {Array.from({ length: 16 }).map((_, i) => {
        const y = g.top + 40 + i * 34 + r() * 20; const span = (y - g.top) / (g.base - g.top);
        const hw = g.w * 0.5 * Math.sqrt(span) * 0.95;
        const pts = Array.from({ length: 9 }).map((__, k) => `${g.cx - hw + (k / 8) * hw * 2} ${y + Math.sin(k * 1.7 + i) * 8 + r() * 10}`).join(' L');
        return <path key={i} d={`M${pts}`} stroke={p.ridge} strokeOpacity={0.35 + r() * 0.25} strokeWidth={3 + r() * 5} fill="none" />;
      })}
      {Array.from({ length: 40 }).map((_, i) => { const x = g.cx + (r() - 0.5) * g.w * 0.8, y = g.top + 60 + r() * (g.base - g.top - 80); return <path key={`c${i}`} d={`M${x} ${y} l${r() * 30 - 15} ${10 + r() * 20} l${r() * 24 - 12} ${10 + r() * 16}`} stroke={p.ridge} strokeWidth={2} strokeOpacity={0.5} fill="none" />; })}
      {Array.from({ length: 90 }).map((_, i) => { const x = g.cx + (r() - 0.55) * g.w * 0.7, y = g.top + 30 + r() * (g.base - g.top - 60); return <circle key={`g${i}`} cx={x} cy={y} r={1.5 + r() * 3} fill={p.glint} opacity={0.4 + r() * 0.5} />; })}
      <path d={`M${g.cx - g.w * 0.3} ${g.top + 220} C${g.cx - g.w * 0.16} ${g.top + 40} ${g.cx - 40} ${g.top + 10} ${g.cx + 80} ${g.top + 14}`} stroke={p.glint} strokeOpacity={0.5} strokeWidth={8} fill="none" />
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

/** baked lamp points over the mountain (night) */
export const LAMPS = (() => {
  const r = rng(19); const g = GM;
  return Array.from({ length: 1600 }).map(() => {
    const u = r(), v = Math.pow(r(), 0.8);
    const y = g.top + 30 + v * (g.base + 380 - g.top);
    const span = Math.min(1, (y - g.top) / (g.base - g.top));
    const hw = y < g.base ? g.w * 0.5 * Math.sqrt(span) * 0.95 : W * 0.7;
    return { x: g.cx + (u * 2 - 1) * hw, y, s: 1 + Math.max(0, (y - g.top) / 900) * 1.6, o: r(), warm: r() < 0.85 };
  }).filter((q) => q.x > -40 && q.x < W + 40);
})();
export const NightBand: React.FC = () => (
  <g>
    <Goldfield m="night" />
    {LAMPS.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={1.6 * q.s} fill={q.warm ? '#ffcf86' : '#fff0c0'} opacity={0.75} />)}
    {LAMPS.filter((_, i) => i % 3 === 0).map((q, i) => <rect key={`p${i}`} x={q.x - 1.5 * q.s} y={q.y + 2 * q.s} width={3 * q.s} height={8 * q.s} fill="#140c08" />)}
  </g>
);
/** live flicker: a glow + brightness wobble on a subset (on ones) */
export const LampFlicker: React.FC<{ t: number; out?: (o: number) => number }> = ({ t, out }) => (
  <g>
    <defs><radialGradient id="lfGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.55} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient></defs>
    {LAMPS.filter((_, i) => i % 5 === 0).map((q, i) => { const a = (out ? out(q.o) : 1) * (0.6 + 0.4 * Math.sin(t * (6 + q.o * 9) + q.o * 40)); return a > 0.02 ? <circle key={i} cx={q.x} cy={q.y} r={7 * q.s} fill="url(#lfGlow)" opacity={a} /> : null; })}
  </g>
);
/** bokeh backdrop for the face close-up */
export const BokehBand: React.FC = () => {
  const r = rng(23);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#0a0806" />
      <ellipse cx={700} cy={1300} rx={900} ry={700} fill="#e8b84a" opacity={0.28} />
      {Array.from({ length: 140 }).map((_, i) => <circle key={i} cx={r() * W} cy={500 + r() * 1700} r={14 + r() * 40} fill={r() < 0.8 ? '#ffcf86' : '#fff0c0'} opacity={0.15 + r() * 0.35} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ people */
/** the digger, three-quarter back view, gripping a shovel upright in front of him; br = breathing (twos), grip 0..1 */
export const Digger: React.FC<{ x: number; y: number; h: number; br: number; grip: number; t2: number }> = ({ x, y, h, br, grip, t2 }) => {
  const u = h / 7; const heave = (Math.sin(br) * 0.5 + 0.5) * u * 0.08;
  const shY = y - h * 0.8 - heave; const tr = grip * Math.sin(t2 * 40) * u * 0.015;
  const handY = shY + u * 0.9, handX = x + u * 1.25;
  const skin = '#8a5a3e', skinD = '#5a3a28', shirt = '#5e5446', shirtD = '#3a332a';
  return (
    <g>
      {/* shovel planted in the bed, held upright */}
      <path d={`M${handX + u * 0.1} ${shY - u * 0.4} L${handX + u * 0.35} ${y + u * 0.3}`} stroke="#4a3220" strokeWidth={u * 0.13} strokeLinecap="round" />
      <path d={`M${handX + u * 0.1} ${y - u * 0.1} L${handX + u * 0.65} ${y - u * 0.05} L${handX + u * 0.55} ${y + u * 0.6} L${handX + u * 0.15} ${y + u * 0.6} Z`} fill="#3a3632" />
      <path d={`M${handX - u * 0.15} ${shY - u * 0.45} h${u * 0.55}`} stroke="#4a3220" strokeWidth={u * 0.13} strokeLinecap="round" />
      {/* body: torn shirt, broad back */}
      <path d={`M${x - u * 1.0} ${shY + u * 0.15} Q${x} ${shY - u * 0.2} ${x + u * 1.0} ${shY + u * 0.2} L${x + u * 0.75} ${y - h * 0.42} L${x - u * 0.8} ${y - h * 0.42} Z`} fill={shirt} />
      <path d={`M${x + u * 0.15} ${shY} Q${x + u * 0.8} ${shY + u * 0.05} ${x + u * 1.0} ${shY + u * 0.2} L${x + u * 0.75} ${y - h * 0.42} L${x + u * 0.2} ${y - h * 0.42} Z`} fill={shirtD} opacity={0.5} />
      {/* tears: skin showing through */}
      <path d={`M${x - u * 0.55} ${shY + u * 0.9} l${u * 0.3} ${u * 0.1} l-${u * 0.1} ${u * 0.5} l-${u * 0.25} -${u * 0.2} Z M${x + u * 0.2} ${shY + u * 1.7} l${u * 0.35} -${u * 0.05} l-${u * 0.05} ${u * 0.4} Z`} fill={skin} />
      <path d={`M${x - u * 0.8} ${y - h * 0.42} L${x + u * 0.75} ${y - h * 0.42} L${x + u * 0.6} ${y + u * 0.5} L${x - u * 0.7} ${y + u * 0.5} Z`} fill="#2e2a28" />
      {/* arms reaching to the handle */}
      <path d={`M${x + u * 0.85} ${shY + u * 0.25} L${x + u * 1.25} ${shY + u * 1.3} L${handX + tr} ${handY}`} stroke={skin} strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${x - u * 0.6} ${shY + u * 0.2} L${x + u * 0.2} ${shY + u * 1.0} L${handX - u * 0.05 + tr} ${shY - u * 0.3}`} stroke={skinD} strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={handX + u * 0.08 + tr} cy={handY} rx={u * (0.2 - 0.03 * grip)} ry={u * 0.17} fill={skin} />
      <ellipse cx={handX + u * 0.1 + tr} cy={shY - u * 0.3} rx={u * (0.2 - 0.03 * grip)} ry={u * 0.17} fill={skinD} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${handX + u * (0.0 + 0.06 * i) + tr} ${handY - u * 0.12} v${u * 0.22}`} stroke={skinD} strokeWidth={u * 0.03} opacity={0.4 + 0.5 * grip} />)}
      {/* neck + head, turned toward the gold (three-quarter back), sweat glints */}
      <rect x={x - u * 0.12} y={shY - u * 0.3} width={u * 0.36} height={u * 0.36} fill={skinD} />
      <ellipse cx={x + u * 0.12} cy={shY - u * 0.62} rx={u * 0.42} ry={u * 0.5} fill={skinD} />
      <path d={`M${x - u * 0.3} ${shY - u * 0.62} Q${x - u * 0.25} ${shY - u * 1.15} ${x + u * 0.2} ${shY - u * 1.12} Q${x + u * 0.5} ${shY - u * 1.08} ${x + u * 0.55} ${shY - u * 0.75} Q${x + u * 0.2} ${shY - u * 0.9} ${x - u * 0.3} ${shY - u * 0.62} Z`} fill="#1a1210" />
      <path d={`M${x + u * 0.5} ${shY - u * 0.85} Q${x + u * 0.6} ${shY - u * 0.55} ${x + u * 0.42} ${shY - u * 0.25}`} stroke="#ffcf6a" strokeOpacity={0.85} strokeWidth={u * 0.07} fill="none" />
      <path d={`M${x + u * 1.0} ${shY + u * 0.2} L${x + u * 0.75} ${y - h * 0.42}`} stroke="#ffcf6a" strokeOpacity={0.6} strokeWidth={u * 0.06} />
      {[[0.45, -0.45], [0.95, 0.5], [0.3, 0.6]].map(([dx, dy], i) => <circle key={i} cx={x + u * dx} cy={shY + u * dy} r={u * 0.04} fill="#fff0c0" opacity={0.5 + 0.5 * Math.sin(t2 * 3 + i)} />)}
    </g>
  );
};

/** his face, close (front three-quarter, simple), gold light from the right; swallow 0..1 (throat), smile 0..1 */
export const DiggerFace: React.FC<{ x: number; y: number; s: number; swallow: number; smile: number; br: number; t: number }> = ({ x, y, s, swallow, smile, br, t }) => {
  const b = Math.sin(br) * 4;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${s})`}>
      {/* shoulders + torn collar */}
      <path d="M-420 560 Q-380 300 -160 260 L160 260 Q380 300 420 560 Z" fill="#5e5446" />
      <path d="M-60 260 L0 360 L50 262" fill="#8a5a3e" />
      <path d="M-160 262 l40 60 l-20 40" stroke="#3a332a" strokeWidth={6} fill="none" />
      {/* neck with the swallow bob */}
      <path d="M-90 120 L-100 280 L100 280 L90 120 Z" fill="#6e4630" />
      <ellipse cx={8} cy={210 - swallow * 30} rx={16} ry={12} fill="#5a3a28" />
      {/* head */}
      <ellipse cx={0} cy={-40} rx={185} ry={220} fill="#8a5a3e" />
      <path d="M40 -255 Q200 -230 185 -40 Q180 120 60 175 Q150 -40 40 -255 Z" fill="#c98a50" opacity={0.6} />
      <path d="M-185 -40 Q-190 -220 -40 -258 Q-140 -180 -150 -40 Q-160 90 -90 165 Q-185 120 -185 -40 Z" fill="#5a3a28" opacity={0.55} />
      {/* hair */}
      <path d="M-185 -60 Q-200 -250 -20 -270 Q170 -280 190 -80 Q150 -200 30 -205 Q-80 -210 -150 -150 Z" fill="#1a1210" />
      {/* brows, eyes with gold reflections */}
      <path d="M-120 -88 Q-80 -102 -40 -90" stroke="#1a1210" strokeWidth={12} strokeLinecap="round" fill="none" />
      <path d="M40 -90 Q85 -104 128 -88" stroke="#1a1210" strokeWidth={12} strokeLinecap="round" fill="none" />
      {[-80, 85].map((ex, i) => (
        <g key={i}>
          <ellipse cx={ex} cy={-50} rx={34} ry={18} fill="#f2e4c8" />
          <circle cx={ex + 4} cy={-50} r={15} fill="#2a1a10" />
          <circle cx={ex + 10} cy={-55} r={5 + Math.sin(t * 7 + i) * 1} fill="#ffe08a" />
          <circle cx={ex - 2} cy={-46} r={2.5} fill="#ffcf6a" />
          <path d={`M${ex - 36} ${-54} Q${ex} ${-74} ${ex + 36} ${-54}`} stroke="#5a3a28" strokeWidth={6} fill="none" />
        </g>
      ))}
      {/* nose, mouth (smile) */}
      <path d="M8 -40 L-12 40 L22 48" stroke="#5a3a28" strokeWidth={8} fill="none" strokeLinejoin="round" />
      <path d={`M-60 ${95 - 4 * smile} Q0 ${95 + 22 * smile} ${62} ${92 - 14 * smile}`} stroke="#4a2a1e" strokeWidth={9} strokeLinecap="round" fill="none" />
      {/* sweat */}
      {[[-130, -150, 0], [120, -170, 1], [150, 20, 2], [-150, 40, 3]].map(([sx, sy, i]) => <ellipse key={i} cx={sx} cy={sy + ((t * 30 + i * 40) % 60)} rx={6} ry={10} fill="#fff0c0" opacity={0.65} />)}
      <path d="M185 -40 Q180 120 60 175" stroke="#ffcf6a" strokeOpacity={0.8} strokeWidth={8} fill="none" />
    </g>
  );
};

/** plain military truck silhouette (no markings), facing dir */
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
