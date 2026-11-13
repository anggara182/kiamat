import React from 'react';
import { W, H, rng } from './world';

/**
 * EP05 set "hill": the hilltop excavation (day), the hill at dusk (wide), top-down at dusk, close base backdrop.
 * The stone figure is GENERIC and abstract: a weathered monolith with a rounded head, eroded hollows, arms worn into the body.
 * No crown, no attributes, no symbols of any real faith. Drawn live with a palette so it can be buried/revealed.
 */
export const HILL = { cx: 648, crest: 1500 };
export type StonePal = { stone: string; stoneD: string; stoneHi: string; rim: string; rimO: number; lichen: string };
export const STONE_DAY: StonePal = { stone: '#9a8f80', stoneD: '#6e6558', stoneHi: '#c2b8a6', rim: '#fff6e0', rimO: 0.4, lichen: '#7d8a62' };
export const STONE_DUSK: StonePal = { stone: '#3a2c38', stoneD: '#221a26', stoneHi: '#7a4a4a', rim: '#ffb07a', rimO: 0.75, lichen: '#3e3a32' };
export const STONE_SIL: StonePal = { stone: '#1c1620', stoneD: '#140f18', stoneHi: '#2a1e28', rim: '#f0a86a', rimO: 0.85, lichen: '#1c1620' };

/** standing stone figure; (x, base) bottom centre, h total height (pedestal included) */
export const Statue: React.FC<{ x: number; base: number; h: number; p: StonePal }> = ({ x, base, h, p }) => {
  const u = h / 10;
  const ped = base - u * 1.2;
  const sh = base - u * 7.2; // shoulders
  const hy = base - u * 8.4; // head centre
  return (
    <g>
      {/* pedestal block, chipped */}
      <path d={`M${x - u * 2.2} ${base} L${x - u * 2.1} ${ped} L${x - u * 0.9} ${ped - u * 0.08} L${x - u * 0.6} ${ped + u * 0.1} L${x + u * 2.1} ${ped} L${x + u * 2.2} ${base} Z`} fill={p.stoneD} />
      <path d={`M${x - u * 2.1} ${ped} L${x + u * 2.1} ${ped} L${x + u * 2.0} ${ped + u * 0.18} L${x - u * 2.0} ${ped + u * 0.18} Z`} fill={p.stoneHi} opacity={0.5} />
      {/* body: a tapering slab, shoulders rounded off by erosion */}
      <path d={`M${x - u * 1.7} ${ped} L${x - u * 1.55} ${sh + u * 0.6} Q${x - u * 1.5} ${sh - u * 0.1} ${x - u * 0.6} ${sh - u * 0.25} L${x + u * 0.6} ${sh - u * 0.25} Q${x + u * 1.5} ${sh - u * 0.1} ${x + u * 1.55} ${sh + u * 0.6} L${x + u * 1.7} ${ped} Z`} fill={p.stone} />
      <path d={`M${x + u * 0.3} ${sh - u * 0.22} L${x + u * 0.6} ${sh - u * 0.25} Q${x + u * 1.5} ${sh - u * 0.1} ${x + u * 1.55} ${sh + u * 0.6} L${x + u * 1.7} ${ped} L${x + u * 0.5} ${ped} Z`} fill={p.stoneD} opacity={0.6} />
      {/* arms worn into the body (two shallow grooves), hands meeting low */}
      <path d={`M${x - u * 1.2} ${sh + u * 0.4} Q${x - u * 1.3} ${sh + u * 2.6} ${x - u * 0.3} ${sh + u * 3.6}`} stroke={p.stoneD} strokeWidth={u * 0.18} fill="none" opacity={0.8} />
      <path d={`M${x + u * 1.2} ${sh + u * 0.4} Q${x + u * 1.3} ${sh + u * 2.6} ${x + u * 0.3} ${sh + u * 3.6}`} stroke={p.stoneD} strokeWidth={u * 0.18} fill="none" opacity={0.8} />
      <ellipse cx={x} cy={sh + u * 3.75} rx={u * 0.5} ry={u * 0.3} fill={p.stoneD} opacity={0.7} />
      {/* cracks */}
      <path d={`M${x - u * 0.9} ${sh + u * 1.2} l${u * 0.25} ${u * 0.6} l${-u * 0.1} ${u * 0.5} l${u * 0.3} ${u * 0.7} M${x + u * 0.8} ${ped - u * 0.2} l${-u * 0.2} ${-u * 0.8} l${u * 0.15} ${-u * 0.5}`} stroke={p.stoneD} strokeWidth={u * 0.05} fill="none" />
      {/* neck + head: rounded, eroded, featureless but for deep hollows */}
      <path d={`M${x - u * 0.45} ${sh - u * 0.2} L${x - u * 0.4} ${hy + u * 0.5} L${x + u * 0.4} ${hy + u * 0.5} L${x + u * 0.45} ${sh - u * 0.2} Z`} fill={p.stone} />
      <path d={`M${x - u * 0.85} ${hy} Q${x - u * 0.9} ${hy - u * 1.15} ${x} ${hy - u * 1.2} Q${x + u * 0.9} ${hy - u * 1.15} ${x + u * 0.85} ${hy} Q${x + u * 0.8} ${hy + u * 0.85} ${x} ${hy + u * 0.95} Q${x - u * 0.8} ${hy + u * 0.85} ${x - u * 0.85} ${hy} Z`} fill={p.stone} />
      <path d={`M${x + u * 0.2} ${hy - u * 1.18} Q${x + u * 0.9} ${hy - u * 1.1} ${x + u * 0.85} ${hy} Q${x + u * 0.8} ${hy + u * 0.85} ${x + u * 0.1} ${hy + u * 0.94} Q${x + u * 0.5} ${hy} ${x + u * 0.2} ${hy - u * 1.18} Z`} fill={p.stoneD} opacity={0.55} />
      <ellipse cx={x - u * 0.33} cy={hy - u * 0.12} rx={u * 0.2} ry={u * 0.13} fill={p.stoneD} />
      <ellipse cx={x + u * 0.33} cy={hy - u * 0.1} rx={u * 0.18} ry={u * 0.12} fill={p.stoneD} />
      <path d={`M${x} ${hy - u * 0.15} L${x + u * 0.06} ${hy + u * 0.35}`} stroke={p.stoneD} strokeWidth={u * 0.07} />
      <path d={`M${x - u * 0.22} ${hy + u * 0.58} L${x + u * 0.2} ${hy + u * 0.56}`} stroke={p.stoneD} strokeWidth={u * 0.05} opacity={0.7} />
      {/* lichen + chips */}
      {[[-0.6, 1.8, 0.22], [0.9, 3.1, 0.18], [-1.2, 4.6, 0.26], [0.3, -0.8, 0.14]].map(([dx, dy, r], i) => <ellipse key={i} cx={x + u * dx} cy={sh + u * dy} rx={u * r} ry={u * r * 0.7} fill={p.lichen} opacity={0.55} />)}
      {/* rim light */}
      <path d={`M${x - u * 0.85} ${hy} Q${x - u * 0.9} ${hy - u * 1.15} ${x} ${hy - u * 1.2}`} stroke={p.rim} strokeOpacity={p.rimO} strokeWidth={u * 0.06} fill="none" />
      <path d={`M${x - u * 1.7} ${ped} L${x - u * 1.55} ${sh + u * 0.6} Q${x - u * 1.5} ${sh - u * 0.1} ${x - u * 0.6} ${sh - u * 0.25}`} stroke={p.rim} strokeOpacity={p.rimO * 0.8} strokeWidth={u * 0.06} fill="none" />
    </g>
  );
};

/* ------------------------------------------------------------------ bands */
const SKYD = ['#c9d6dd', '#dfe6ea', '#efe9dc'];
const hillPath = (crest: number) => `M-40 ${crest + 260} Q300 ${crest - 40} ${HILL.cx} ${crest - 10} Q1000 ${crest - 30} ${W + 40} ${crest + 300} V${H + 40} H-40 Z`;

/** day: pale sky, the city far below in haze, the dry hilltop with the pit, tools, spoil heaps */
export const DayBand: React.FC = () => {
  const r = rng(4);
  return (
    <g>
      <defs>
        <linearGradient id="hdSky" x1="0" y1="0" x2="0" y2="1">{SKYD.map((c, i) => <stop key={i} offset={i / 2} stopColor={c} />)}</linearGradient>
        <linearGradient id="hdEarth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8956a" /><stop offset="1" stopColor="#8a6a46" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#hdSky)" />
      <circle cx={260} cy={380} r={300} fill="#ffffff" opacity={0.55} />
      {/* city far below on the plain */}
      <path d={`M-20 1420 V1330 ${Array.from({ length: 30 }).map((_, i) => { const x = i * 45; const y = 1290 + ((i * 41) % 80); return `H${x} V${y} H${x + 34} V${y + 20}`; }).join(' ')} H${W + 20} V1420 Z`} fill="#b9bfc2" />
      <rect x={-20} y={1400} width={W + 40} height={200} fill="#c9c6b8" />
      {/* hill */}
      <path d={hillPath(HILL.crest)} fill="url(#hdEarth)" />
      {/* spoil heaps, the pit rim, a wheelbarrow, survey stakes */}
      <path d={`M120 ${HILL.crest + 180} Q220 ${HILL.crest + 40} 330 ${HILL.crest + 160} Z`} fill="#9a7650" />
      <path d={`M960 ${HILL.crest + 150} Q1080 ${HILL.crest + 20} 1200 ${HILL.crest + 170} Z`} fill="#9a7650" />
      <ellipse cx={HILL.cx} cy={HILL.crest + 40} rx={420} ry={90} fill="#6e5236" />
      <ellipse cx={HILL.cx} cy={HILL.crest + 30} rx={380} ry={70} fill="#7a5c3c" />
      <g fill="#5a4a3a"><ellipse cx={1050} cy={HILL.crest + 210} rx={40} ry={40} fill="#3a3028" /><path d={`M980 ${HILL.crest + 170} L1140 ${HILL.crest + 150} L1120 ${HILL.crest + 200} L1000 ${HILL.crest + 205} Z`} /><path d={`M1140 ${HILL.crest + 150} L1220 ${HILL.crest + 110}`} stroke="#3a3028" strokeWidth={8} /></g>
      {[[200, 1720], [1100, 1700], [400, 1640], [900, 1650]].map(([x, y], i) => <g key={i}><rect x={x} y={y - 90} width={6} height={90} fill="#6a5238" /><rect x={x + 6} y={y - 90} width={26} height={12} fill="#d8573a" /></g>)}
      {Array.from({ length: 60 }).map((_, i) => <ellipse key={i} cx={r() * W} cy={HILL.crest + 120 + r() * 700} rx={4 + r() * 10} ry={3 + r() * 5} fill="#7a5c3c" opacity={0.6} />)}
      {Array.from({ length: 18 }).map((_, i) => { const x = r() * W, y = HILL.crest + 260 + r() * 500; return <path key={`g${i}`} d={`M${x} ${y} l-8 -30 M${x} ${y} l4 -36 M${x} ${y} l12 -26`} stroke="#8a8a5a" strokeWidth={3} />; })}
    </g>
  );
};

/** dusk wide: calm dark upper sky (quote), glow low, the hill silhouette, city lights small below */
export const DuskBand: React.FC = () => {
  const r = rng(7);
  return (
    <g>
      <defs>
        <linearGradient id="hkSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1600"><stop offset="0" stopColor="#2a1e34" /><stop offset="0.5" stopColor="#5a3a5e" /><stop offset="0.82" stopColor="#c46e5c" /><stop offset="1" stopColor="#f0a86a" /></linearGradient>
        <radialGradient id="hkSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd09a" stopOpacity={0.9} /><stop offset="0.35" stopColor="#f0a86a" stopOpacity={0.45} /><stop offset="1" stopColor="#f0a86a" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#hkSky)" />
      <ellipse cx={420} cy={1560} rx={680} ry={360} fill="url(#hkSun)" />
      <ellipse cx={900} cy={1180} rx={260} ry={8} fill="#e8987a" opacity={0.35} />
      {/* city below: dim block line + warm lights */}
      <path d={`M-20 1680 V1620 ${Array.from({ length: 34 }).map((_, i) => { const x = i * 40; const y = 1590 + ((i * 29) % 50); return `H${x} V${y} H${x + 30} V${y + 14}`; }).join(' ')} H${W + 20} V1680 Z`} fill="#3a2a40" />
      {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={r() * W} cy={1620 + r() * 90} r={1.5 + r() * 2} fill="#ffcf86" opacity={0.4 + r() * 0.5} />)}
      {/* the hill, in front, dark */}
      <path d={`M-40 1980 Q260 1720 ${HILL.cx} 1700 Q1040 1720 ${W + 40} 2000 V${H + 40} H-40 Z`} fill="#1a1420" />
      <path d={`M-40 1980 Q260 1720 ${HILL.cx} 1700 Q1040 1720 ${W + 40} 2000`} stroke="#f0a86a" strokeOpacity={0.35} strokeWidth={3} fill="none" />
    </g>
  );
};

/** top-down at dusk: earth, trampled path ring, the statue seen from above with a long shadow, flowers at its base */
export const TOP = { cx: 648, cy: 1150, ring: 300 };
export const TopBand: React.FC = () => {
  const r = rng(9); const T = TOP;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#5a4048" />
      {Array.from({ length: 120 }).map((_, i) => <ellipse key={i} cx={r() * W} cy={r() * H} rx={6 + r() * 20} ry={4 + r() * 10} fill={r() < 0.5 ? '#4a3640' : '#6a4c50'} opacity={0.6} />)}
      <circle cx={T.cx} cy={T.cy} r={T.ring + 50} fill="#6e5050" opacity={0.7} />
      <circle cx={T.cx} cy={T.cy} r={T.ring - 50} fill="#5a4048" />
      {/* long dusk shadow of the statue toward lower right */}
      <path d={`M${T.cx - 60} ${T.cy} L${T.cx + 520} ${T.cy + 760} L${T.cx + 640} ${T.cy + 660} L${T.cx + 60} ${T.cy - 20} Z`} fill="#1c1620" opacity={0.45} />
      {/* pedestal square, body ellipse, head disc seen from above */}
      <rect x={T.cx - 110} y={T.cy - 110} width={220} height={220} fill="#2a2028" transform={`rotate(12 ${T.cx} ${T.cy})`} />
      <ellipse cx={T.cx} cy={T.cy} rx={90} ry={70} fill="#3a2c38" />
      <circle cx={T.cx - 6} cy={T.cy - 4} r={44} fill="#4a3842" />
      <path d={`M${T.cx - 50} ${T.cy - 20} A44 44 0 0 1 ${T.cx + 20} ${T.cy - 48}`} stroke="#f0a86a" strokeOpacity={0.7} strokeWidth={5} fill="none" />
      {/* flowers piled at the base */}
      {Array.from({ length: 70 }).map((_, i) => { const a = r() * Math.PI * 2, d = 130 + r() * 50; return <circle key={`f${i}`} cx={T.cx + Math.cos(a) * d} cy={T.cy + Math.sin(a) * d} r={6 + r() * 6} fill={['#e9b8c0', '#f2e2a0', '#f0f0ea', '#e88a6a', '#c9a0d0'][Math.floor(r() * 5)]} />; })}
      {/* the rope on its posts */}
      <circle cx={T.cx} cy={T.cy} r={200} fill="none" stroke="#c9a37a" strokeWidth={4} strokeDasharray="2 0" opacity={0.7} />
      {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={`p${i}`} cx={T.cx + Math.cos(a) * 200} cy={T.cy + Math.sin(a) * 200} r={9} fill="#3a2a22" />; })}
    </g>
  );
};

/** close base backdrop at dusk (blurred): the pedestal edge, warm sky glow, earth */
export const BaseBand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2840" /><stop offset="0.5" stopColor="#8a4e5a" /><stop offset="1" stopColor="#f0a86a" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#hbSky)" />
    <ellipse cx={300} cy={1300} rx={700} ry={420} fill="#ffc890" opacity={0.35} />
    <path d={`M-40 1560 Q600 1480 ${W + 40} 1540 V${H + 40} H-40 Z`} fill="#3a2830" />
    {/* the stone mass on the right, out of focus */}
    <path d="M760 0 L1300 0 L1300 2304 L700 2304 L720 1500 Q700 900 760 0 Z" fill="#2a1e28" />
    <path d="M760 0 Q700 900 720 1500" stroke="#ffb07a" strokeOpacity={0.5} strokeWidth={10} fill="none" />
  </g>
);
