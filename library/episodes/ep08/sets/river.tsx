import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';
import { RC } from '../art/river_figs';

/** World layout of the river set (shared with src/shots/R.tsx). */
export const RV = { horizon: 1000, edge: 1400, moon: { x: 880, y: 560, r: 58 } };

const reed = (x: number, base: number, h: number, lean: number, w: number) =>
  `M${x - w},${base} Q${x + lean * 0.4},${base - h * 0.6} ${x + lean},${base - h} Q${x + lean * 0.4 + w * 0.3},${base - h * 0.6} ${x + w},${base}Z`;

const Reeds: React.FC<{ seed: number; x0: number; x1: number; base: number; hMin: number; hMax: number; n: number; fill: string }> = ({ seed, x0, x1, base, hMin, hMax, n, fill }) => {
  const r = rng(seed);
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), h = hMin + r() * (hMax - hMin);
    d.push(reed(x, base + r() * 30, h, (r() - 0.5) * h * 0.35, 3 + r() * 5));
  }
  return <path d={d.join(' ')} fill={fill} />;
};

/** Set "river". Ids "river/<band>". */
export const RIVER: Record<string, BandSpec> = {
  'river/sky': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="rs-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={RC.skyTop} /><stop offset="0.7" stopColor={RC.skyLow} /><stop offset="1" stopColor="#2a3157" />
          </linearGradient>
          <radialGradient id="rs-glow"><stop offset="0" stopColor="#c9d2e6" stopOpacity={0.45} /><stop offset="0.35" stopColor="#7d89ad" stopOpacity={0.18} /><stop offset="1" stopColor="#1b2140" stopOpacity={0} /></radialGradient>
          <radialGradient id="rs-moon" cx="0.42" cy="0.4"><stop offset="0" stopColor="#f7f8fb" /><stop offset="1" stopColor="#cfd5e2" /></radialGradient>
        </defs>
        <rect width={W} height={RV.horizon + 40} fill="url(#rs-sky)" />
        <circle cx={RV.moon.x} cy={RV.moon.y} r={420} fill="url(#rs-glow)" />
        <circle cx={RV.moon.x} cy={RV.moon.y} r={RV.moon.r} fill="url(#rs-moon)" />
        <circle cx={RV.moon.x + 16} cy={RV.moon.y - 10} r={12} fill="#c3cad8" opacity={0.5} />
        <circle cx={RV.moon.x - 20} cy={RV.moon.y + 18} r={8} fill="#c3cad8" opacity={0.45} />
        {/* thin clouds */}
        <path d={`M300,${RV.moon.y + 70} q200,-24 420,0 t500,6 l0,14 q-300,-10 -920,-6Z`} fill="#3a4266" opacity={0.6} />
      </g>
    ),
  },
  'river/far': {
    blur: 1.5,
    node: () => {
      const hz = RV.horizon;
      const r = rng(8);
      const lights = Array.from({ length: 9 }, (_, i) => ({ x: 330 + i * 48 + r() * 30, y: hz - 30 - r() * 40, c: i % 3 === 0 ? RC.candle : RC.mari }));
      return (
        <g>
          <path d={`M0,${hz - 60} C200,${hz - 120} 380,${hz - 150} 560,${hz - 110} C720,${hz - 80} 860,${hz - 70} 1000,${hz - 100} C1120,${hz - 125} 1220,${hz - 90} ${W},${hz - 70} L${W},${hz + 10} L0,${hz + 10}Z`} fill="#141a30" />
          <path d={`M0,${hz - 20} C300,${hz - 50} 700,${hz - 40} ${W},${hz - 25} L${W},${hz + 8} L0,${hz + 8}Z`} fill="#0e1324" />
          {/* village roofs */}
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${340 + i * 70},${hz - 28} l14,-16 l14,16 l0,20 l-28,0Z`} fill="#0b1020" />)}
          <rect x={540} y={hz - 92} width={10} height={40} fill="#0b1020" />
          <path d={`M533,${hz - 92} l12,-18 l12,18Z`} fill="#0b1020" />
          {lights.map((l, i) => (
            <g key={i}>
              <circle cx={l.x} cy={l.y} r={14} fill={l.c} opacity={0.18} />
              <circle cx={l.x} cy={l.y} r={3.2} fill={l.c} />
            </g>
          ))}
        </g>
      );
    },
  },
  'river/water': {
    node: () => {
      const hz = RV.horizon, e = RV.edge;
      return (
        <g>
          <defs>
            <linearGradient id="rw-w" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1e2747" /><stop offset="0.35" stopColor="#121c33" /><stop offset="1" stopColor={RC.river} />
            </linearGradient>
            <linearGradient id="rw-ref" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={RC.glint} stopOpacity={0.55} /><stop offset="1" stopColor={RC.glint} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rw-bank" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1a2033" /><stop offset="0.25" stopColor="#0d111d" /><stop offset="1" stopColor={RC.near} />
            </linearGradient>
            <linearGradient id="rw-mist" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={RC.mist} stopOpacity={0} /><stop offset="0.5" stopColor={RC.mist} stopOpacity={0.28} /><stop offset="1" stopColor={RC.mist} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect y={hz - 4} width={W} height={e - hz + 60} fill="url(#rw-w)" />
          {/* moon reflection column */}
          <path d={`M${RV.moon.x - 40},${hz} L${RV.moon.x + 40},${hz} L${RV.moon.x + 110},${e} L${RV.moon.x - 110},${e}Z`} fill="url(#rw-ref)" opacity={0.6} />
          {/* low mist */}
          <rect y={hz - 30} width={W} height={120} fill="url(#rw-mist)" />
          <rect y={e - 150} width={W} height={150} fill="url(#rw-mist)" opacity={0.7} />
          {/* near bank (mud slope), lit lip at the water edge */}
          <path d={`M0,${e - 10} C260,${e - 30} 520,${e + 10} 760,${e - 4} C960,${e - 16} 1140,${e + 6} ${W},${e - 8} L${W},${H} L0,${H}Z`} fill="url(#rw-bank)" />
          <path d={`M0,${e - 10} C260,${e - 30} 520,${e + 10} 760,${e - 4} C960,${e - 16} 1140,${e + 6} ${W},${e - 8}`} stroke="#5b6680" strokeWidth={2} fill="none" opacity={0.6} />
          {/* path of trampled mud up the bank */}
          <path d={`M640,${e + 20} C600,${e + 200} 520,${e + 420} 430,${H}`} stroke="#141a28" strokeWidth={70} fill="none" opacity={0.7} />
          {/* mid reeds on the bank */}
          <Reeds seed={3} x0={0} x1={330} base={e + 10} hMin={90} hMax={220} n={40} fill={RC.mid} />
          <Reeds seed={4} x0={1050} x1={W} base={e + 6} hMin={80} hMax={200} n={30} fill={RC.mid} />
        </g>
      );
    },
  },
  'river/fg': {
    node: () => {
      const e = RV.edge;
      return (
        <g>
          {/* willow, left: trunk + hanging curtains */}
          <path d="M60,1500 C90,1200 70,900 150,640 C190,520 260,430 380,380 L392,402 C290,450 220,560 200,700 C170,900 190,1200 170,1520Z" fill={RC.near} />
          <path d="M0,300 C200,260 420,300 600,380 C640,400 600,420 560,410 C400,360 200,340 0,370Z" fill={RC.near} />
          {Array.from({ length: 22 }, (_, i) => {
            const x = 20 + i * 27, top = 330 + Math.sin(i * 1.7) * 30 + (i > 14 ? (i - 14) * 12 : 0), len = 380 + ((i * 53) % 260);
            return <path key={i} d={`M${x},${top} C${x + 6},${top + len * 0.4} ${x + 14},${top + len * 0.8} ${x + 18},${top + len} L${x + 12},${top + len} C${x + 4},${top + len * 0.8} ${x - 6},${top + len * 0.4} ${x - 8},${top}Z`} fill={RC.near} />;
          })}
          {/* foreground reed clumps framing bottom corners */}
          <Reeds seed={11} x0={-40} x1={360} base={H} hMin={500} hMax={900} n={34} fill={RC.near} />
          <Reeds seed={12} x0={930} x1={W + 40} base={H} hMin={480} hMax={860} n={30} fill={RC.near} />
          <Reeds seed={13} x0={300} x1={960} base={H} hMin={120} hMax={300} n={30} fill={RC.near} />
          <rect y={e + 560} width={W} height={H} fill={RC.near} />
        </g>
      );
    },
  },
};
