import React from 'react';
import { W, H, rng } from './world';

/**
 * EP09 set "banners": ridge crest by day, the valley below the far slope, the dusk coast with ships and camps,
 * the dawn mist valley between two armies. Banners are plain dark cloth with at most one abstract stripe:
 * no real flags, symbols, crosses or crescents. The sides differ only by tone (grey vs olive). No combat.
 */
export const BANNER_COLS = ['#5a2a22', '#3a4250', '#8a6a2a', '#4a3a30', '#2e3440'];

/** a tall pole with a plain cloth banner waving (environment, on ones); stripe = optional single band */
export const Banner: React.FC<{ x: number; y: number; h: number; col: string; stripe?: boolean; t: number; ph: number; pole?: string }> = ({ x, y, h, col, stripe, t, ph, pole = '#2a2622' }) => {
  const bw = h * 0.28, bh = h * 0.42; const top = y - h;
  const w = (k: number) => Math.sin(t * 3.2 - k * 3 + ph) * bw * 0.1 * k;
  const d = `M${x} ${top + 4} C${x + bw * 0.35} ${top + 4 + w(0.35)} ${x + bw * 0.7} ${top + 4 + w(0.7)} ${x + bw} ${top + 6 + w(1)} L${x + bw} ${top + bh + w(1)} C${x + bw * 0.7} ${top + bh + w(0.7)} ${x + bw * 0.35} ${top + bh + w(0.35)} ${x} ${top + bh} Z`;
  return (
    <g>
      <rect x={x - Math.max(1, h * 0.008)} y={top} width={Math.max(2, h * 0.016)} height={h} fill={pole} />
      <path d={d} fill={col} />
      {stripe && <path d={`M${x} ${top + bh * 0.62} C${x + bw * 0.35} ${top + bh * 0.62 + w(0.35)} ${x + bw * 0.7} ${top + bh * 0.62 + w(0.7)} ${x + bw} ${top + bh * 0.64 + w(1)}`} stroke="#c9b48a" strokeOpacity={0.55} strokeWidth={bh * 0.07} fill="none" />}
    </g>
  );
};

/* ------------------------------------------------------------------ bands */
export const RIDGE = { y: 1240 };
const ridgeY = (x: number) => RIDGE.y - 40 * Math.sin(x / 300) - 20 * Math.sin(x / 120 + 1);
export const ridgeAt = ridgeY;
export const RidgeBand: React.FC = () => {
  const r = rng(4);
  return (
    <g>
      <defs><linearGradient id="brSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6d2c8" /><stop offset="0.5" stopColor="#e8e4da" /><stop offset="1" stopColor="#f2efe6" /></linearGradient>
        <linearGradient id="brHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b5a44" /><stop offset="1" stopColor="#8a7a58" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#brSky)" />
      <circle cx={980} cy={380} r={320} fill="#ffffff" opacity={0.55} />
      <path d={`M-20 ${H} L-20 ${ridgeY(0)} ${Array.from({ length: 34 }).map((_, i) => `L${i * 40} ${ridgeY(i * 40).toFixed(1)}`).join(' ')} L${W + 20} ${ridgeY(W)} L${W + 20} ${H} Z`} fill="url(#brHill)" />
      {/* meadow slope toward the camera */}
      <path d={`M-20 ${H} L-20 1600 Q500 1520 ${W + 20} 1640 L${W + 20} ${H} Z`} fill="#9a8c62" />
      {Array.from({ length: 120 }).map((_, i) => { const y = 1500 + Math.pow(r(), 1.3) * 800; const k = (y - 1500) / 800; const x = r() * W; return <path key={i} d={`M${x} ${y} l-${4 + 8 * k} -${10 + 20 * k} M${x} ${y} l${2 + 4 * k} -${12 + 24 * k} M${x} ${y} l${6 + 10 * k} -${8 + 16 * k}`} stroke="#6a6a42" strokeWidth={1.5 + 2 * k} />; })}
      {[[200, 1700, 40], [980, 1780, 60], [620, 1900, 50]].map(([x, y, s], i) => <ellipse key={`s${i}`} cx={x} cy={y} rx={s * 1.6} ry={s * 0.6} fill="#7a6a4a" />)}
    </g>
  );
};

/** valley seen from high above the far slope: the slope falls toward a broad valley floor and a horizon */
export const VALLEY = { hz: 820, floor: 1500 };
export const ValleyBand: React.FC = () => {
  const r = rng(6);
  return (
    <g>
      <defs><linearGradient id="bvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6d2c8" /><stop offset="1" stopColor="#ece8de" /></linearGradient>
        <linearGradient id="bvFloor" gradientUnits="userSpaceOnUse" x1="0" y1={VALLEY.hz} x2="0" y2={H}><stop offset="0" stopColor="#b8ae96" /><stop offset="0.5" stopColor="#9a8c6a" /><stop offset="1" stopColor="#6b5a44" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bvSky)" />
      <path d={`M-20 ${VALLEY.hz} Q300 ${VALLEY.hz - 60} 600 ${VALLEY.hz - 20} Q950 ${VALLEY.hz - 70} ${W + 20} ${VALLEY.hz - 10} L${W + 20} ${VALLEY.hz + 20} L-20 ${VALLEY.hz + 20} Z`} fill="#a8a294" />
      <rect x={0} y={VALLEY.hz} width={W} height={H - VALLEY.hz} fill="url(#bvFloor)" />
      {/* a river, fields, roads on the valley floor */}
      <path d={`M-20 ${VALLEY.hz + 200} Q400 ${VALLEY.hz + 120} 700 ${VALLEY.hz + 260} T${W + 20} ${VALLEY.hz + 230}`} stroke="#9ab0b8" strokeWidth={14} fill="none" />
      {Array.from({ length: 40 }).map((_, i) => { const y = VALLEY.hz + 40 + r() * 600; const k = (y - VALLEY.hz) / 600; return <rect key={i} x={r() * W} y={y} width={60 + 140 * k} height={14 + 30 * k} fill={r() < 0.5 ? '#a89a72' : '#8a8a5a'} opacity={0.5} />; })}
      {/* the near (far-side) slope we look down: darker, top of frame bottom */}
      <path d={`M-20 ${H} L-20 ${VALLEY.floor + 300} Q400 ${VALLEY.floor + 150} 700 ${VALLEY.floor + 260} Q1000 ${VALLEY.floor + 340} ${W + 20} ${VALLEY.floor + 240} L${W + 20} ${H} Z`} fill="#6b5a44" />
    </g>
  );
};

/** dusk coast: calm dark upper sky, the sea with a glow line, a long dark shore curving away with hills */
export const COAST = { hz: 1180 };
export const CoastBand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="bcSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={COAST.hz}><stop offset="0" stopColor="#120e1c" /><stop offset="0.55" stopColor="#2a2034" /><stop offset="0.85" stopColor="#8a5a5a" /><stop offset="1" stopColor="#e8a870" /></linearGradient>
      <linearGradient id="bcSea" gradientUnits="userSpaceOnUse" x1="0" y1={COAST.hz} x2="0" y2={H}><stop offset="0" stopColor="#6a4a54" /><stop offset="1" stopColor="#141820" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#bcSky)" />
    <ellipse cx={400} cy={COAST.hz} rx={500} ry={90} fill="#ffc890" opacity={0.35} />
    <rect x={0} y={COAST.hz} width={W} height={H - COAST.hz} fill="url(#bcSea)" />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${100 + i * 40} ${COAST.hz + 30 + i * 60} h${300 - i * 30}`} stroke="#e8a870" strokeOpacity={0.25 - i * 0.03} strokeWidth={3} />)}
    {/* the shore: dark land on the right curving away to the horizon, hills behind */}
    <path d={`M${W + 20} ${H} L${W + 20} ${COAST.hz - 60} Q1000 ${COAST.hz - 90} 820 ${COAST.hz - 40} L760 ${COAST.hz} Q900 ${COAST.hz + 300} 760 ${COAST.hz + 700} Q620 ${H - 300} 700 ${H} Z`} fill="#1c1a22" />
    <path d={`M${W + 20} ${COAST.hz - 60} Q1100 ${COAST.hz - 200} 960 ${COAST.hz - 110} Q880 ${COAST.hz - 150} 800 ${COAST.hz - 40}`} fill="#241e2c" />
    <path d={`M760 ${COAST.hz} Q900 ${COAST.hz + 300} 760 ${COAST.hz + 700} Q620 ${H - 300} 700 ${H}`} stroke="#e8a870" strokeOpacity={0.35} strokeWidth={4} fill="none" />
  </g>
);
/** shore line point (s 0 far .. 1 near) */
export const shoreAt = (s: number): [number, number] => {
  const p0 = [790, COAST.hz - 10], p1 = [920, COAST.hz + 300], p2 = [700, H];
  const a = (1 - s) ** 2, b = 2 * s * (1 - s), c = s * s;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
};

/** dawn mist valley between two slopes: armies on both slopes (live), mist in the gap */
export const MIST = { floor: 1420 };
export const MistBand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="bmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3448" /><stop offset="0.45" stopColor="#8a7a8a" /><stop offset="0.7" stopColor="#c9c2d0" /><stop offset="1" stopColor="#e8a870" /></linearGradient>
      <radialGradient id="bmSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe0b0" stopOpacity={0.9} /><stop offset="1" stopColor="#e8a870" stopOpacity={0} /></radialGradient>
      <linearGradient id="bmMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8d0d8" stopOpacity={0} /><stop offset="0.5" stopColor="#d8d0d8" stopOpacity={0.8} /><stop offset="1" stopColor="#c9c2d0" stopOpacity={0.6} /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#bmSky)" />
    <ellipse cx={648} cy={1260} rx={420} ry={260} fill="url(#bmSun)" />
    <path d="M-20 1300 Q300 1180 648 1290 Q1000 1180 1316 1300 L1316 1380 L-20 1380 Z" fill="#7a6e80" opacity={0.7} />
    {/* left and right slopes facing each other */}
    <path d={`M-20 ${H} L-20 1080 Q200 1060 420 1300 Q520 1400 560 ${MIST.floor} L560 ${H} Z`} fill="#2a2430" />
    <path d={`M1316 ${H} L1316 1060 Q1100 1050 880 1290 Q780 1400 740 ${MIST.floor} L740 ${H} Z`} fill="#26222e" />
    <rect x={400} y={MIST.floor - 40} width={500} height={H} fill="#3a3240" />
    <rect x={-20} y={1300} width={1340} height={360} fill="url(#bmMist)" />
  </g>
);
/** a slope army: dense small figures + banners on a slope region (live, banners on ones, figures shimmer on twos) */
export const slopeArmy = (seed: number, x0: number, x1: number, yTop: (x: number) => number, depth: number, n: number) => {
  const r = rng(seed);
  return Array.from({ length: n }).map(() => { const x = x0 + r() * (x1 - x0); const y = yTop(x) + r() * depth; return { x, y, s: 0.5 + (y - 900) / 1400, ph: r() * 6 }; }).sort((a, b) => a.y - b.y);
};
export const Figure: React.FC<{ x: number; y: number; s: number; col: string; arm?: number }> = ({ x, y, s, col, arm = 0 }) => (
  <g fill={col}><rect x={x - 3.5 * s} y={y - 18 * s} width={7 * s} height={18 * s} rx={2.5 * s} /><circle cx={x} cy={y - 21 * s} r={3.4 * s} />{arm > 0 && <path d={`M${x + 3 * s} ${y - 15 * s} l${2 * s} ${-12 * s * arm}`} stroke={col} strokeWidth={2.2 * s} />}</g>
);

/** shepherd boy (10), three-quarter back view, with a stick; walk/freeze: still 0..1 (1 = frozen staring up) */
export const Shepherd: React.FC<{ x: number; y: number; h: number; still: number; t2: number }> = ({ x, y, h, still, t2 }) => {
  const u = h / 5.5; const walk = (1 - still) * Math.sin(t2 * 6);
  const shY = y - h * 0.74 + Math.abs(walk) * u * 0.04; const look = still * 0.25;
  return (
    <g>
      <path d={`M${x - u * 0.3} ${y - h * 0.42} L${x - u * 0.35 + walk * u * 0.2} ${y} M${x + u * 0.3} ${y - h * 0.42} L${x + u * 0.35 - walk * u * 0.2} ${y}`} stroke="#4a4038" strokeWidth={u * 0.3} strokeLinecap="round" />
      <path d={`M${x - u * 0.65} ${shY + u * 0.1} Q${x} ${shY - u * 0.15} ${x + u * 0.65} ${shY + u * 0.1} L${x + u * 0.55} ${y - h * 0.4} L${x - u * 0.55} ${y - h * 0.4} Z`} fill="#b8584a" />
      <path d={`M${x + u * 0.6} ${shY + u * 0.2} L${x + u * 0.95} ${shY + u * 1.0} L${x + u * 1.05} ${shY + u * 1.2}`} stroke="#b8584a" strokeWidth={u * 0.24} strokeLinecap="round" fill="none" />
      <path d={`M${x + u * 1.05} ${shY + u * (0.2 + 0.3 * still)} L${x + u * 1.25} ${y}`} stroke="#5a4030" strokeWidth={u * 0.1} strokeLinecap="round" />
      <path d={`M${x - u * 0.6} ${shY + u * 0.2} L${x - u * 0.8} ${shY + u * 1.0} L${x - u * 0.7} ${shY + u * 1.6}`} stroke="#a8483c" strokeWidth={u * 0.24} strokeLinecap="round" fill="none" />
      <rect x={x - u * 0.12} y={shY - u * 0.25} width={u * 0.24} height={u * 0.3} fill="#7a4f3e" />
      <ellipse cx={x + u * 0.05} cy={shY - u * 0.6 - look * u * 0.1} rx={u * 0.42} ry={u * 0.48} fill="#1d1a1a" />
      <ellipse cx={x + u * 0.42} cy={shY - u * 0.55 - look * u * 0.1} rx={u * 0.1} ry={u * 0.16} fill="#7a4f3e" />
    </g>
  );
};
/** goat, side view; head up 0..1 (frozen, alert) */
export const Goat: React.FC<{ x: number; y: number; s: number; up: number; dir?: 1 | -1; col?: string; t2: number }> = ({ x, y, s, up, dir = 1, col = '#e8e2d2', t2 }) => {
  const graze = (1 - up) * (0.5 + 0.5 * Math.sin(t2 * 4 + x));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      <path d="M-50 -30 Q-10 -62 40 -44 L40 -22 Q0 -12 -50 -20 Z" fill={col} />
      {[-40, -26, 22, 34].map((k) => <rect key={k} x={k - 3} y={-24} width={6} height={24} fill="#9a9284" />)}
      <g transform={`rotate(${-40 * up + 50 * graze} 40 -40)`}><ellipse cx={58} cy={-54} rx={15} ry={11} fill={col} /><path d="M54 -64 q6 -12 16 -14" stroke="#6a5a4a" strokeWidth={3} fill="none" /></g>
      <path d="M-50 -26 l-8 -8" stroke={col} strokeWidth={4} />
    </g>
  );
};
/** generic ship silhouette (plain, no markings) */
export const Ship: React.FC<{ x: number; y: number; s: number; col: string; lights?: number }> = ({ x, y, s, col, lights = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 0 L120 0 L100 18 L-110 18 Z" fill={col} />
    <rect x={-60} y={-30} width={90} height={30} fill={col} /><rect x={-30} y={-58} width={40} height={28} fill={col} /><rect x={-12} y={-90} width={5} height={32} fill={col} />
    {lights > 0 && [-50, -20, 10].map((lx) => <rect key={lx} x={lx} y={-22} width={8} height={5} fill="#ffb860" opacity={lights} />)}
  </g>
);
