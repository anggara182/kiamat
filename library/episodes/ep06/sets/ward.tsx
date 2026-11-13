import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';

/** Set "ward" (hospital ward at night: beds, curtains, IV stands, corridor). Static bands baked ONCE to public/baked/ward/<band>.png. Ids "ward/<band>". */
export const VP = { x: 648, y: 1020 };
const FE = { l: 590, r: 706, t: 935, b: 1080 }; // far end of corridor

const Bed: React.FC<{ x: number; y: number; s?: number; fill?: string; sheet?: string }> = ({ x, y, s = 1, fill = '#0e1718', sheet = '#2f4542' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-150} width={20} height={150} fill={fill} />
    <rect x={170} y={-110} width={16} height={110} fill={fill} />
    <path d="M -186 -95 L 180 -95 L 186 -60 L -186 -60 Z" fill={sheet} />
    <path d="M -186 -60 L 186 -60 L 176 -30 L -176 -30 Z" fill={fill} />
    <rect x={-170} y={-118} width={90} height={26} rx={12} fill={sheet} opacity={0.9} />
    <line x1={-160} y1={-30} x2={-160} y2={0} stroke={fill} strokeWidth={8} />
    <line x1={160} y1={-30} x2={160} y2={0} stroke={fill} strokeWidth={8} />
  </g>
);
const Iv: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = '#0b1213' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <rect x={-3} y={-420} width={6} height={420} />
    <rect x={-40} y={-420} width={80} height={5} />
    <rect x={-34} y={-410} width={22} height={50} rx={6} />
    <path d="M -30 0 L 30 0 L 0 -14 Z" />
  </g>
);
export const wardBits = { Bed, Iv };

export const WARD: Record<string, BandSpec> = {
  /** one-point corridor */
  'ward/corridor': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="wcL" x1="0" x2="1"><stop offset="0" stopColor="#0d1516" /><stop offset="1" stopColor="#2c3f43" /></linearGradient>
          <linearGradient id="wcR" x1="1" x2="0"><stop offset="0" stopColor="#0d1516" /><stop offset="1" stopColor="#2c3f43" /></linearGradient>
          <linearGradient id="wcC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070c0d" /><stop offset="1" stopColor="#1b2a2e" /></linearGradient>
          <linearGradient id="wcF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#080d0d" /><stop offset="1" stopColor="#1f2d2c" /></linearGradient>
          <radialGradient id="wcG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#9fd8cf" stopOpacity={0.35} /><stop offset="1" stopColor="#9fd8cf" stopOpacity={0} /></radialGradient>
        </defs>
        <polygon points={`0,0 ${W},0 ${FE.r},${FE.t} ${FE.l},${FE.t}`} fill="url(#wcC)" />
        <polygon points={`0,0 ${FE.l},${FE.t} ${FE.l},${FE.b} 0,${H}`} fill="url(#wcL)" />
        <polygon points={`${W},0 ${FE.r},${FE.t} ${FE.r},${FE.b} ${W},${H}`} fill="url(#wcR)" />
        <polygon points={`0,${H} ${FE.l},${FE.b} ${FE.r},${FE.b} ${W},${H}`} fill="url(#wcF)" />
        <rect x={FE.l} y={FE.t} width={FE.r - FE.l} height={FE.b - FE.t} fill="#2f4744" />
        {/* far double door */}
        <rect x={FE.l + 20} y={FE.t + 40} width={76} height={105} fill="#1a2626" />
        <line x1={VP.x} y1={FE.t + 40} x2={VP.x} y2={FE.b} stroke="#0d1516" strokeWidth={3} />
        <rect x={FE.l + 28} y={FE.t + 50} width={22} height={24} fill="#5f8a82" opacity={0.6} />
        <rect x={FE.r - 50} y={FE.t + 50} width={22} height={24} fill="#5f8a82" opacity={0.6} />
        {/* wainscot line + tile joints on floor */}
        {[0.25, 0.55, 0.8].map((k, i) => <line key={i} x1={0} y1={H * (0.62 + k * 0.0)} x2={FE.l} y2={FE.b - 30} stroke="#0d1516" strokeWidth={4} opacity={i === 0 ? 0.9 : 0} />)}
        <line x1={W} y1={H * 0.62} x2={FE.r} y2={FE.b - 30} stroke="#0d1516" strokeWidth={4} />
        {[-5, -3, -1.6, -0.6, 0.6, 1.6, 3, 5].map((k, i) => <line key={`fl${i}`} x1={VP.x + k * 160} y1={H} x2={VP.x + k * 9} y2={FE.b} stroke="#0a1112" strokeWidth={3} opacity={0.45} />)}
        {[0.08, 0.18, 0.32, 0.52, 0.8].map((k, i) => { const y = FE.b + (H - FE.b) * k; return <line key={`fh${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#0a1112" strokeWidth={2 + k * 4} opacity={0.5} />; })}
        {/* doors on walls (trapezoids) */}
        {[{ a: 0.18, b: 0.34 }, { a: 0.5, b: 0.6 }, { a: 0.72, b: 0.78 }].map((d, i) => {
          const lerp = (k: number, from: number, to: number) => from + (to - from) * k;
          const xa = lerp(d.a, 0, FE.l), xb = lerp(d.b, 0, FE.l);
          const ta = lerp(d.a, 300, FE.t + 40), tb = lerp(d.b, 300, FE.t + 40);
          const ba = lerp(d.a, H * 0.86, FE.b), bb = lerp(d.b, H * 0.86, FE.b);
          const rxa = W - xa, rxb = W - xb;
          return <g key={i}>
            <polygon points={`${xa},${ta} ${xb},${tb} ${xb},${bb} ${xa},${ba}`} fill="#121c1d" />
            <polygon points={`${rxa},${ta} ${rxb},${tb} ${rxb},${bb} ${rxa},${ba}`} fill="#101a1b" />
            <polygon points={`${xa + (xb - xa) * 0.2},${ta + (tb - ta) * 0.2 + 60} ${xa + (xb - xa) * 0.7},${ta + (tb - ta) * 0.7 + 50} ${xa + (xb - xa) * 0.7},${ta + (tb - ta) * 0.7 + 140} ${xa + (xb - xa) * 0.2},${ta + (tb - ta) * 0.2 + 170}`} fill="#3f5f5a" opacity={0.35} />
          </g>;
        })}
        {/* ceiling tubes (dim, receding) */}
        {[0.12, 0.36, 0.56, 0.72].map((k, i) => { const y = FE.t * k * 0.98 + 10, w = (1 - k) * 260 + 20, hh = (1 - k) * 22 + 4; return <rect key={`t${i}`} x={VP.x - w / 2} y={y} width={w} height={hh} fill="#4b6662" opacity={0.7} />; })}
        {/* floor reflection streak */}
        <polygon points={`${VP.x - 18},${FE.b} ${VP.x + 18},${FE.b} ${VP.x + 140},${H} ${VP.x - 140},${H}`} fill="#7fb8ae" opacity={0.07} />
        <ellipse cx={VP.x} cy={FE.t + 70} rx={200} ry={160} fill="url(#wcG)" />
      </g>
    ),
  },
  /** ward interior: back wall, window, curtains, beds row */
  'ward/room': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="wrW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#111c1e" /><stop offset="0.7" stopColor="#2c3f43" /><stop offset="1" stopColor="#1b2a2e" /></linearGradient>
          <linearGradient id="wrF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f2d2c" /><stop offset="1" stopColor="#0a1112" /></linearGradient>
          <linearGradient id="wrCur" x1="0" x2="1"><stop offset="0" stopColor="#2a403e" /><stop offset="0.5" stopColor="#3a5552" /><stop offset="1" stopColor="#253837" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={1330} fill="url(#wrW)" />
        <rect x={0} y={1330} width={W} height={H - 1330} fill="url(#wrF)" />
        <rect x={0} y={1316} width={W} height={14} fill="#0d1516" />
        {[1420, 1560, 1760, 2040].map((y, i) => <line key={i} x1={0} y1={y} x2={W} y2={y} stroke="#0a1112" strokeWidth={2 + i} />)}
        {/* window */}
        <rect x={500} y={430} width={300} height={380} fill="#0b1418" />
        <rect x={510} y={440} width={135} height={175} fill="#1d3238" /><rect x={655} y={440} width={135} height={175} fill="#1d3238" />
        <rect x={510} y={625} width={135} height={175} fill="#17282d" /><rect x={655} y={625} width={135} height={175} fill="#17282d" />
        {/* ceiling curtain rail + curtains between beds */}
        <rect x={0} y={560} width={W} height={8} fill="#0d1516" />
        {[{ x: 40, w: 150 }, { x: 410, w: 90 }, { x: 900, w: 110 }, { x: 1180, w: 120 }].map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={568} width={c.w} height={700} fill="url(#wrCur)" />
            {[0.25, 0.5, 0.75].map((k, j) => <line key={j} x1={c.x + c.w * k} y1={572} x2={c.x + c.w * k + 6} y2={1266} stroke="#1c2c2b" strokeWidth={6} />)}
            <path d={`M ${c.x} 1268 Q ${c.x + c.w / 2} 1290 ${c.x + c.w} 1268 Z`} fill="#2a403e" />
          </g>
        ))}
        <Iv x={300} y={1340} s={1} />
        <Iv x={1070} y={1340} s={1} />
        <Bed x={240} y={1360} s={1} />
        <Bed x={1010} y={1360} s={1} />
        {/* reflections of beds/lights on floor */}
        <rect x={60} y={1380} width={360} height={60} fill="#3a5552" opacity={0.12} />
        <rect x={830} y={1380} width={360} height={60} fill="#3a5552" opacity={0.12} />
        {/* ceiling light housings */}
        {[250, 650, 1050].map((x) => <rect key={x} x={x - 130} y={150} width={260} height={30} fill="#0d1516" />)}
      </g>
    ),
  },
  /** dark foreground frame: curtain edge + bed foot rail */
  'ward/near': {
    node: () => (
      <g>
        <path d={`M 0 0 L 170 0 Q 210 600 175 1400 Q 150 1600 0 1700 Z`} fill="#0a1112" />
        <path d={`M 170 0 Q 210 600 175 1400`} stroke="#3a5552" strokeWidth={4} fill="none" opacity={0.6} />
        <path d={`M ${W} 1880 L ${W - 320} 1900 L ${W - 330} ${H} L ${W} ${H} Z`} fill="#070c0d" />
        <rect x={W - 340} y={1860} width={340} height={24} rx={10} fill="#0b1213" />
      </g>
    ),
  },
};
