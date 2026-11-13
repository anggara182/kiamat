import React from 'react';
import { W, H, rng } from './world';

/**
 * EP04 set "nation" (invented places only, plain banners, no symbols, no weapons).
 * Bands: march (dawn overpass into a city), crowd (blurred day crowd backdrop), square (city square from high).
 * People, banners, dust and the three skylines of shot 4 are live.
 */
export const BANNER = '#ece6d6', BANNER_D = '#c9c1ae';

/* ------------------------------------------------------------------ shot 1: the overpass */
/** road centre line (world) as a quadratic curve from near (u=0) to the city gate (u=1) */
const P0: [number, number] = [260, 2420], P1: [number, number] = [-80, 1500], P2: [number, number] = [820, 1205];
export const road = (u: number): { x: number; y: number; s: number; w: number } => {
  const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
  const x = a * P0[0] + b * P1[0] + c * P2[0], y = a * P0[1] + b * P1[1] + c * P2[1];
  const s = 0.06 + 0.94 * Math.pow(1 - u, 2.2); // perspective scale
  return { x, y, s, w: 760 * s };
};
export const GATE = { x: 820, y: 1205, w: 120, h: 150 };
export const MarchBand: React.FC = () => {
  const r = rng(3);
  const edge = (side: -1 | 1, off = 0) => Array.from({ length: 41 }).map((_, i) => { const q = road(i / 40); return `${i ? 'L' : 'M'}${(q.x + side * (q.w / 2 + off * q.s)).toFixed(1)} ${(q.y + (off ? 0 : 0)).toFixed(1)}`; }).join('');
  const deck = `${edge(-1)} ${Array.from({ length: 41 }).map((_, i) => { const q = road(1 - i / 40); return `L${(q.x + q.w / 2).toFixed(1)} ${q.y.toFixed(1)}`; }).join('')} Z`;
  return (
    <g>
      <defs>
        <linearGradient id="mSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1240"><stop offset="0" stopColor="#2a2c48" /><stop offset="0.55" stopColor="#7a5a6e" /><stop offset="1" stopColor="#c98a6e" /></linearGradient>
        <radialGradient id="mSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff0cc" /><stop offset="0.25" stopColor="#e8c48a" stopOpacity={0.7} /><stop offset="1" stopColor="#e8c48a" stopOpacity={0} /></radialGradient>
        <linearGradient id="mGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a6a66" /><stop offset="0.3" stopColor="#4a3a4a" /><stop offset="1" stopColor="#1e1a2a" /></linearGradient>
        <linearGradient id="mDeck" gradientUnits="userSpaceOnUse" x1="0" y1="1200" x2="0" y2="2400"><stop offset="0" stopColor="#b48a76" /><stop offset="1" stopColor="#3a3040" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#mSky)" />
      <ellipse cx={980} cy={1180} rx={620} ry={420} fill="url(#mSun)" />
      <circle cx={980} cy={1190} r={56} fill="#fff4d8" />
      {/* the city on the horizon: invented towers, low domes-free roofs */}
      <path d={`M560 1240 V1180 ${Array.from({ length: 22 }).map((_, i) => { const x = 560 + i * 34; const y = 1060 + ((i * 47) % 130); return `H${x} V${y} H${x + 26} V${y + 30}`; }).join(' ')} H${W + 20} V1240 Z`} fill="#6a4a5e" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={600 + i * 66} y={1150 - (i % 3) * 30} width={22} height={90 + (i % 3) * 30} fill="#5a3e52" />)}
      {/* gate: a plain monumental arch at the city edge */}
      <g fill="#4a3448"><rect x={GATE.x - GATE.w / 2} y={GATE.y - GATE.h} width={GATE.w} height={GATE.h} /></g>
      <path d={`M${GATE.x - 24} ${GATE.y} V${GATE.y - 70} A24 24 0 0 1 ${GATE.x + 24} ${GATE.y - 70} V${GATE.y} Z`} fill="#e8c48a" />
      <rect x={0} y={1240} width={W} height={H - 1240} fill="url(#mGround)" />
      {/* lower roads and fields in the haze */}
      {[1320, 1420, 1560].map((y, i) => <path key={i} d={`M-20 ${y + 80} Q600 ${y - 40} ${W + 20} ${y + 30}`} stroke="#a07a72" strokeOpacity={0.35 - i * 0.08} strokeWidth={6 + i * 4} fill="none" />)}
      {Array.from({ length: 30 }).map((_, i) => <circle key={`t${i}`} cx={r() * W} cy={1300 + r() * 500} r={10 + r() * 20} fill="#3a2e3e" opacity={0.6} />)}
      {/* overpass pillars below the deck */}
      {Array.from({ length: 9 }).map((_, i) => { const q = road(0.08 + i * 0.1); return <rect key={i} x={q.x - 40 * q.s} y={q.y + 30 * q.s} width={80 * q.s} height={900 * q.s} fill="#1e1a26" />; })}
      {/* deck + side walls */}
      <path d={deck} fill="url(#mDeck)" />
      {Array.from({ length: 40 }).map((_, i) => { const a = road(i / 40), b = road((i + 1) / 40); return <g key={i}><path d={`M${a.x - a.w / 2} ${a.y} L${b.x - b.w / 2} ${b.y} L${b.x - b.w / 2} ${b.y + 60 * b.s} L${a.x - a.w / 2} ${a.y + 60 * a.s} Z`} fill="#2a2232" /><path d={`M${a.x + a.w / 2} ${a.y} L${b.x + b.w / 2} ${b.y} L${b.x + b.w / 2} ${b.y + 60 * b.s} L${a.x + a.w / 2} ${a.y + 60 * a.s} Z`} fill="#2a2232" /></g>; })}
      {/* railings + lamp posts */}
      <path d={edge(-1)} stroke="#d8b8a0" strokeOpacity={0.6} strokeWidth={4} fill="none" />
      <path d={edge(1)} stroke="#d8b8a0" strokeOpacity={0.6} strokeWidth={4} fill="none" />
      {Array.from({ length: 8 }).map((_, i) => { const q = road(0.05 + i * 0.12); return [-1, 1].map((sd) => <g key={`${i}${sd}`} fill="#1e1a26"><rect x={q.x + sd * q.w / 2 - 4 * q.s} y={q.y - 380 * q.s} width={8 * q.s} height={380 * q.s} /><rect x={q.x + sd * q.w / 2 - (sd > 0 ? 50 : 0) * q.s} y={q.y - 380 * q.s} width={50 * q.s} height={8 * q.s} /></g>); })}
    </g>
  );
};
/** the endless column: people along the road, front at u = front; walk phase on twos */
const MARCHERS = (() => {
  const r = rng(11);
  return Array.from({ length: 520 }).map(() => ({ u0: r(), lat: (r() * 2 - 1) * 0.42, h: 0.9 + r() * 0.2, col: ['#3a2e3e', '#4a3a40', '#2e2a3a', '#5a4448', '#3e3446'][Math.floor(r() * 5)], hijab: r() < 0.35, banner: r() < 0.035, ph: r() * 6 }));
})();
export const Column: React.FC<{ t2: number; front: number; flow: number; rim: string }> = ({ t2, front, flow, rim }) => (
  <g>
    {MARCHERS.map((m, i) => ({ m, u: front - ((m.u0 + flow) % 1) * front * 1.02, i }))
      .filter((q) => q.u > -0.02)
      .sort((a, b) => b.u - a.u)
      .map(({ m, u, i }) => {
        const q = road(Math.max(0, u)); const hh = 300 * q.s * m.h; const x = q.x + m.lat * q.w; const y = q.y + 10 * q.s;
        const bob = Math.abs(Math.sin(t2 * 6 + m.ph)) * hh * 0.03;
        const bw = hh * 0.13;
        return (
          <g key={i}>
            {m.banner && <g><rect x={x + bw * 0.6} y={y - hh * 1.9} width={hh * 0.025 + 1} height={hh * 1.4} fill="#2a2228" /><path d={`M${x + bw * 0.6} ${y - hh * 1.9} q${hh * 0.4} ${-hh * 0.06 + Math.sin(t2 * 5 + m.ph) * hh * 0.03} ${hh * 0.8} 0 l0 ${hh * 0.45} q${-hh * 0.4} ${hh * 0.05} ${-hh * 0.8} 0 Z`} fill={BANNER} /></g>}
            <path d={`M${x - bw} ${y} L${x - bw * 1.1} ${y - hh * 0.78 - bob} Q${x} ${y - hh * 0.84 - bob} ${x + bw * 1.1} ${y - hh * 0.78 - bob} L${x + bw} ${y} Z`} fill={m.col} />
            <ellipse cx={x} cy={y - hh * 0.89 - bob} rx={bw * (m.hijab ? 0.75 : 0.6)} ry={bw * (m.hijab ? 0.85 : 0.7)} fill={m.hijab ? '#4a3a4e' : '#2a2026'} />
            {q.s > 0.3 && <path d={`M${x - bw * 0.6} ${y - hh * 0.95 - bob} Q${x} ${y - hh * 1.02 - bob} ${x + bw * 0.6} ${y - hh * 0.95 - bob}`} stroke={rim} strokeOpacity={0.6} strokeWidth={Math.max(1, bw * 0.12)} fill="none" />}
          </g>
        );
      })}
  </g>
);

/* ------------------------------------------------------------------ shot 2: crowd backdrop (blurred band) */
export const CrowdBand: React.FC = () => {
  const r = rng(22);
  return (
    <g>
      <defs><linearGradient id="cbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6dde2" /><stop offset="0.5" stopColor="#e6e8ea" /><stop offset="1" stopColor="#f3efe6" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#cbSky)" />
      <rect x={0} y={900} width={W} height={260} fill="#c9c4bc" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={`b${i}`} x={i * 120 - 20} y={760 + (i % 3) * 50} width={90} height={400} fill="#bdb6aa" />)}
      {Array.from({ length: 5 }).map((_, i) => <g key={`f${i}`}><rect x={120 + i * 260} y={700} width={5} height={420} fill="#7a7068" /><path d={`M${125 + i * 260} 700 q90 -8 170 6 l0 90 q-80 -12 -170 -4 Z`} fill={BANNER} /></g>)}
      {Array.from({ length: 900 }).map((_, i) => { const y = 1100 + r() * 1200; const s = 0.6 + (y - 1100) / 700; return <g key={i}><ellipse cx={r() * W} cy={y} rx={22 * s} ry={26 * s} fill={['#6a5a5a', '#4a4248', '#8a7a6e', '#5a6270', '#3a3236'][Math.floor(r() * 5)]} /></g>; })}
    </g>
  );
};
/** open hand, palm to camera, on a sleeved forearm from below; hold = 'none' | 'bread' | 'flower' */
export const OpenHand: React.FC<{ x: number; y: number; s: number; rot: number; skin: string; skinD: string; sleeve: string; hold: 'none' | 'bread' | 'flower'; spread: number }> = ({ x, y, s, rot, skin, skinD, sleeve, hold, spread }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-42 0 L-50 900 L50 900 L42 0 Z" fill={sleeve} />
    <path d="M-36 -10 L-40 160 L40 160 L36 -10 Z" fill={skin} />
    <rect x={-60} y={-140} width={120} height={140} rx={38} fill={skin} />
    {hold === 'none' && [-1.5, -0.5, 0.5, 1.5].map((k, i) => <g key={i} transform={`rotate(${k * 6 * spread} ${k * 28} -130)`}><rect x={k * 28 - 12} y={-250 + Math.abs(k) * 22} width={24} height={130 - Math.abs(k) * 14} rx={12} fill={skin} /><path d={`M${k * 28 - 6} ${-150 + Math.abs(k) * 10} h12`} stroke={skinD} strokeWidth={3} /></g>)}
    {hold === 'none' && <g transform={`rotate(${-30 - 10 * spread} -58 -40)`}><rect x={-72} y={-110} width={26} height={90} rx={13} fill={skin} /></g>}
    {hold !== 'none' && <g>{[-1.5, -0.5, 0.5, 1.5].map((k, i) => <rect key={i} x={k * 28 - 13} y={-178} width={26} height={60} rx={13} fill={skin} />)}<rect x={-74} y={-120} width={28} height={70} rx={14} fill={skin} /></g>}
    {hold === 'bread' && <g><ellipse cx={0} cy={-210} rx={110} ry={58} fill="#c98a4a" /><ellipse cx={-10} cy={-226} rx={86} ry={34} fill="#dba766" /><path d="M-50 -232 q20 -14 40 0 M0 -238 q20 -14 40 0" stroke="#a86a34" strokeWidth={6} fill="none" /></g>}
    {hold === 'flower' && <g><path d="M0 -150 L-6 -420 M0 -200 L40 -380 M0 -180 L-50 -360" stroke="#4d6a49" strokeWidth={8} fill="none" />{[[-6, -430, '#e9b8c0'], [40, -390, '#f2e2a0'], [-50, -370, '#f0f0ea']].map(([fx, fy, c], i) => <g key={i}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={(fx as number) + Math.cos((a * Math.PI) / 180) * 18} cy={(fy as number) + Math.sin((a * Math.PI) / 180) * 18} rx={16} ry={12} fill={c as string} />)}<circle cx={fx as number} cy={fy as number} r={10} fill="#e8b84a" /></g>)}</g>}
    <path d="M-60 -60 Q0 -30 60 -60" stroke={skinD} strokeWidth={4} fill="none" opacity={0.6} />
  </g>
);

/* ------------------------------------------------------------------ shot 3: the square from high */
export const SQ = { cx: 648, cy: 1250, rx: 420, ry: 260 };
export const STREETS = [-2.6, -1.9, -1.0, -0.2, 0.6, 1.5, 2.3].map((a) => ({ a, mx: SQ.cx + Math.cos(a) * SQ.rx, my: SQ.cy + Math.sin(a) * SQ.ry, ex: SQ.cx + Math.cos(a) * 1100, ey: SQ.cy + Math.sin(a) * 800 }));
export const SquareBand: React.FC = () => {
  const r = rng(31);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#b8b2a6" />
      {/* building blocks: roofs seen from high */}
      {Array.from({ length: 70 }).map((_, i) => { const x = r() * W - 60, y = r() * H - 60, w = 120 + r() * 160, h = 90 + r() * 140; return <g key={i}><rect x={x} y={y} width={w} height={h} fill={['#cdbfa8', '#a8988a', '#d8cdb8', '#9a8a7a', '#c4b6a0'][Math.floor(r() * 5)]} /><rect x={x} y={y + h} width={w} height={22} fill="#7d786f" opacity={0.6} /></g>; })}
      {/* streets radiating */}
      {STREETS.map((s, i) => <path key={i} d={`M${s.mx} ${s.my} L${s.ex} ${s.ey}`} stroke="#8a8478" strokeWidth={110} strokeLinecap="round" />)}
      {STREETS.map((s, i) => <path key={`c${i}`} d={`M${s.mx} ${s.my} L${s.ex} ${s.ey}`} stroke="#7a746a" strokeWidth={4} strokeDasharray="30 30" />)}
      {/* the square (paved ellipse) with a plain clock pillar */}
      <ellipse cx={SQ.cx} cy={SQ.cy + 20} rx={SQ.rx + 30} ry={SQ.ry + 26} fill="#7d786f" opacity={0.5} />
      <ellipse cx={SQ.cx} cy={SQ.cy} rx={SQ.rx + 30} ry={SQ.ry + 26} fill="#d8d0c0" />
      {[0.35, 0.7].map((f) => <ellipse key={f} cx={SQ.cx} cy={SQ.cy} rx={SQ.rx * f} ry={SQ.ry * f} fill="none" stroke="#c4baa8" strokeWidth={6} />)}
      <ellipse cx={SQ.cx} cy={SQ.cy} rx={48} ry={30} fill="#9a9284" />
      <rect x={SQ.cx - 16} y={SQ.cy - 220} width={32} height={220} fill="#bdb4a2" /><rect x={SQ.cx + 4} y={SQ.cy - 220} width={12} height={220} fill="#8f8574" />
      <rect x={SQ.cx - 26} y={SQ.cy - 260} width={52} height={44} fill="#a89e8c" /><circle cx={SQ.cx} cy={SQ.cy - 238} r={14} fill="#f0ece2" />
      <path d={`M${SQ.cx + 16} ${SQ.cy} L${SQ.cx + 120} ${SQ.cy + 70} L${SQ.cx + 90} ${SQ.cy + 80} L${SQ.cx} ${SQ.cy + 14} Z`} fill="#2a2018" opacity={0.25} />
      {/* trees along the rim */}
      {Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2 + 0.2; if (STREETS.some((s) => Math.abs(((a - s.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.25)) return null; return <g key={`t${i}`}><circle cx={SQ.cx + Math.cos(a) * (SQ.rx + 60)} cy={SQ.cy + Math.sin(a) * (SQ.ry + 50)} r={40} fill="#4d5a49" /><circle cx={SQ.cx + Math.cos(a) * (SQ.rx + 60) - 12} cy={SQ.cy + Math.sin(a) * (SQ.ry + 50) - 10} r={22} fill="#6a7a62" /></g>; })}
    </g>
  );
};
/** people filling the square: each dot walks in from its street mouth and stops at its spot; fill = 0..1 (time-driven) */
const SQ_PPL = (() => {
  const r = rng(41);
  return Array.from({ length: 1100 }).map(() => {
    const a = r() * Math.PI * 2, f = Math.sqrt(r()) * 0.97;
    const x = SQ.cx + Math.cos(a) * SQ.rx * f, y = SQ.cy + Math.sin(a) * SQ.ry * f;
    let best = STREETS[0], bd = 1e9; for (const s of STREETS) { const d = Math.hypot(s.mx - x, s.my - y); if (d < bd) { bd = d; best = s; } }
    return { x, y, sx: best.mx, sy: best.my, ord: bd / 500 + r() * 0.35, col: ['#3a3236', '#5a4a52', '#6a5a5a', '#2e3440', '#7a6a5e', '#d8d0c0', '#8a3a3a'][Math.floor(r() * 7)], ph: r() * 6 };
  }).filter((q) => Math.hypot(q.x - SQ.cx, (q.y - SQ.cy) * 1.6) > 70);
})();
export const SquareCrowd: React.FC<{ t: number; t2: number; tFull: number }> = ({ t, t2, tFull }) => {
  const maxOrd = 1.35;
  return (
    <g>
      {/* street streams (keep flowing) */}
      {STREETS.map((s, j) => Array.from({ length: 34 }).map((_, i) => { const k = ((i / 34) + t * 0.5) % 1; const lat = ((i * 37) % 9 - 4) * 9; const nx = -(s.ey - s.my), ny = s.ex - s.mx; const L = Math.hypot(nx, ny); return <circle key={`${j}-${i}`} cx={s.ex + (s.mx - s.ex) * k + (nx / L) * lat} cy={s.ey + (s.my - s.ey) * k + (ny / L) * lat} r={7} fill={['#3a3236', '#5a4a52', '#2e3440', '#7a6a5e'][i % 4]} />; }))}
      {SQ_PPL.map((q, i) => {
        const arrive = (q.ord / maxOrd) * tFull; const k = Math.min(1, Math.max(0, (t - (arrive - 0.45)) / 0.45));
        if (k <= 0) return null;
        const jit = Math.sin(t2 * 3 + q.ph) * 1.5;
        return <g key={i}><circle cx={q.sx + (q.x - q.sx) * k + jit} cy={q.sy + (q.y - q.sy) * k} r={7.5} fill={q.col} /><circle cx={q.sx + (q.x - q.sx) * k + jit} cy={q.sy + (q.y - q.sy) * k - 3} r={3.5} fill="#1d1a1a" opacity={0.7} /></g>;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ shot 4: three invented skylines, the same banner rising */
export type Skyline = { sky: [string, string]; far: string; near: string; ground: string; kind: 0 | 1 | 2; towerX: number };
export const SKYLINES: Skyline[] = [
  { sky: ['#cdd8de', '#efece4'], far: '#a9b3b8', near: '#6e7a80', ground: '#8a8478', kind: 0, towerX: 700 },
  { sky: ['#e2dccf', '#f4ede0'], far: '#bfae9a', near: '#7a6450', ground: '#9a8670', kind: 1, towerX: 520 },
  { sky: ['#c9d2da', '#e6e8ea'], far: '#9aa6b4', near: '#4e5a68', ground: '#6a707a', kind: 2, towerX: 760 },
];
export const SkylineScene: React.FC<{ sk: Skyline; t: number; raise: number; i: number }> = ({ sk, t, raise, i }) => {
  const r = rng(60 + i);
  const towerTop = 760, towerBot = 1560, poleTop = towerTop - 360;
  const by = poleTop + 20 + (1 - raise) * 320; // banner top y along the pole
  const wave = (k: number) => Math.sin(t * 6 - k * 4) * 14 * k;
  return (
    <g>
      <defs><linearGradient id={`sk${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sk.sky[0]} /><stop offset="1" stopColor={sk.sky[1]} /></linearGradient></defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#sk${i})`} />
      <circle cx={260 + i * 300} cy={460} r={280} fill="#ffffff" opacity={0.5} />
      {/* far layer */}
      <path d={`M-40 1500 ${Array.from({ length: 24 }).map((_, k) => { const x = k * 58; const y = 1180 + r() * 220; return `L${x} 1500 L${x} ${y} L${x + 46} ${y} L${x + 46} 1500`; }).join(' ')} L${W + 40} 1500 Z`} fill={sk.far} />
      {/* near layer by kind */}
      {sk.kind === 0 && <g fill={sk.near}>{[[60, 1040, 150], [240, 1120, 120], [930, 980, 160], [1110, 1100, 140]].map(([x, y, w], k) => <rect key={k} x={x} y={y} width={w} height={1700 - y} />)}<path d="M0 1460 Q300 1380 640 1450 T1296 1430 V1700 H0 Z" /></g>}
      {sk.kind === 1 && <g fill={sk.near}>{Array.from({ length: 12 }).map((_, k) => { const x = k * 115 - 30, w = 110, y = 1280 + (k % 3) * 40; return <g key={k}><rect x={x} y={y} width={w} height={1700 - y} /><polygon points={`${x - 10},${y} ${x + w / 2},${y - 70} ${x + w + 10},${y}`} /></g>; })}</g>}
      {sk.kind === 2 && <g fill={sk.near}>{[[40, 860, 120], [180, 960, 110], [960, 820, 130], [1110, 940, 120], [300, 1160, 160], [820, 1120, 120]].map(([x, y, w], k) => <g key={k}><rect x={x} y={y} width={w} height={1700 - y} />{Array.from({ length: 8 }).map((_, j) => <rect key={j} x={x + 8} y={y + 20 + j * 60} width={w - 16} height={6} fill={sk.far} opacity={0.5} />)}</g>)}<rect x={-20} y={1500} width={W + 40} height={60} fill="#7f97a8" opacity={0.6} /></g>}
      {/* the central tower with a flagpole */}
      <g fill={sk.near}>
        <rect x={sk.towerX - 70} y={towerTop} width={140} height={towerBot - towerTop} />
        <rect x={sk.towerX - 90} y={towerTop - 20} width={180} height={24} />
        {sk.kind === 1 ? <polygon points={`${sk.towerX - 80},${towerTop - 20} ${sk.towerX},${towerTop - 150} ${sk.towerX + 80},${towerTop - 20}`} /> : <rect x={sk.towerX - 50} y={towerTop - 90} width={100} height={72} />}
        <rect x={sk.towerX - 4} y={poleTop} width={8} height={towerTop - poleTop} />
      </g>
      <rect x={sk.towerX - 4} y={poleTop} width={2.5} height={towerTop - poleTop} fill="#ffffff" opacity={0.5} />
      {/* the same plain banner, rising up the pole, waving */}
      <path d={`M${sk.towerX + 4} ${by} C${sk.towerX + 70} ${by + wave(0.3)} ${sk.towerX + 140} ${by + wave(0.6)} ${sk.towerX + 210} ${by + wave(1)} L${sk.towerX + 210} ${by + 130 + wave(1)} C${sk.towerX + 140} ${by + 130 + wave(0.6)} ${sk.towerX + 70} ${by + 130 + wave(0.3)} ${sk.towerX + 4} ${by + 130} Z`} fill={BANNER} />
      <path d={`M${sk.towerX + 4} ${by} C${sk.towerX + 70} ${by + wave(0.3)} ${sk.towerX + 140} ${by + wave(0.6)} ${sk.towerX + 210} ${by + wave(1)}`} stroke={BANNER_D} strokeWidth={4} fill="none" />
      <rect x={-20} y={1700} width={W + 40} height={H} fill={sk.ground} />
    </g>
  );
};
