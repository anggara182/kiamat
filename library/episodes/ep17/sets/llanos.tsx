import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "llanos" (the plains at night and dawn). Static bands baked ONCE. Ids "llanos/<band>". */
export const LL_HOR = 1150; // horizon (frame y ~958)
export const MOON = { x: 840, y: 640, r: 170 };

const grassRow = (seed: number, y0: number, amp: number, n: number, w = W) => {
  const r = rng(seed);
  let d = `M0 ${H} L0 ${y0}`;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    d += ` L${x - w / n / 2} ${y0 + r() * amp * 0.3} L${x} ${y0 - amp * (0.5 + r() * 0.8)}`;
  }
  return d + ` L${w} ${H} Z`;
};

const Palm: React.FC<{ x: number; y: number; s: number; fill: string }> = ({ x, y, s, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <path d="M-5 0 Q-2 -120 6 -240 L12 -240 Q5 -120 5 0 Z" />
    {[-150, -115, -70, -35, 0, 30].map((a, i) => (
      <path key={i} d="M9 -240 Q50 -275 95 -250 Q55 -258 9 -232 Z" transform={`rotate(${a + 15} 9 -240)`} />
    ))}
    <ellipse cx={9} cy={-238} rx={12} ry={9} />
  </g>
);

export const LLANOS: Record<string, BandSpec> = {
  'llanos/sky': {
    node: () => (
      <>
        <defs>
          <linearGradient id="lsk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070a12" />
            <stop offset="0.35" stopColor="#141c2a" />
            <stop offset="0.5" stopColor="#2c3a44" />
            <stop offset="0.56" stopColor="#4a5a5c" />
            <stop offset="1" stopColor="#0d120d" />
          </linearGradient>
          <radialGradient id="lglow">
            <stop offset="0" stopColor="#f3ecd2" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#c9c7b0" stopOpacity="0.18" />
            <stop offset="1" stopColor="#8fa3b5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lmoon" cx="0.42" cy="0.4">
            <stop offset="0" stopColor="#fbf6e4" />
            <stop offset="0.8" stopColor="#f3ecd2" />
            <stop offset="1" stopColor="#d9d0b0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#lsk)" />
        <circle cx={MOON.x} cy={MOON.y} r={MOON.r * 4.2} fill="url(#lglow)" />
        <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="url(#lmoon)" />
        <circle cx={MOON.x - 50} cy={MOON.y + 30} r={34} fill="#e2dabd" opacity={0.6} />
        <circle cx={MOON.x + 60} cy={MOON.y - 50} r={22} fill="#e2dabd" opacity={0.5} />
        <circle cx={MOON.x + 30} cy={MOON.y + 80} r={16} fill="#e2dabd" opacity={0.5} />
        <path d={`M0 ${LL_HOR - 40} Q300 ${LL_HOR - 70} 640 ${LL_HOR - 52} T${W} ${LL_HOR - 60} L${W} ${LL_HOR + 30} L0 ${LL_HOR + 30} Z`} fill="#3e4c50" opacity={0.6} />
      </>
    ),
  },
  'llanos/dawn': {
    node: () => (
      <>
        <defs>
          <linearGradient id="ldw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141a2a" />
            <stop offset="0.18" stopColor="#2c3448" />
            <stop offset="0.34" stopColor="#6a6c7c" />
            <stop offset="0.46" stopColor="#d9b48a" />
            <stop offset="0.5" stopColor="#f2d6a4" />
            <stop offset="0.53" stopColor="#c3b9a4" />
            <stop offset="1" stopColor="#4b4a3c" />
          </linearGradient>
          <radialGradient id="ldsun">
            <stop offset="0" stopColor="#fff1cc" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f2c99a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#ldw)" />
        <path d={`M-20 820 Q300 790 640 812 T1320 800 L1320 836 Q900 850 640 842 T-20 856 Z`} fill="#4b4d60" opacity={0.55} />
        <path d={`M200 960 Q520 940 860 956 T1320 950 L1320 972 Q860 984 520 974 T200 980 Z`} fill="#9a8a86" opacity={0.45} />
        
      </>
    ),
  },
  'llanos/far': {
    node: () => (
      <>
        <path d={grassRow(3, LL_HOR, 10, 60)} fill="#1a2219" />
        <Palm x={250} y={LL_HOR + 6} s={1.1} fill="#0b0f0b" />
        <Palm x={318} y={LL_HOR + 8} s={0.8} fill="#0b0f0b" />
        <Palm x={1110} y={LL_HOR + 4} s={0.6} fill="#0b0f0b" />
        <path d={`M300 ${LL_HOR + 60} Q700 ${LL_HOR + 40} 1296 ${LL_HOR + 70} L1296 ${LL_HOR + 82} Q700 ${LL_HOR + 54} 300 ${LL_HOR + 66} Z`} fill="#8fa3b5" opacity={0.55} />
        <rect x={0} y={LL_HOR + 120} width={W} height={H} fill="#1f281c" />
        <path d={grassRow(7, LL_HOR + 130, 18, 50)} fill="#222b1e" />
      </>
    ),
  },
  'llanos/fg': {
    blur: 4,
    node: () => {
      const r = rng(11);
      const blades: React.ReactNode[] = [];
      for (let i = 0; i < 70; i++) {
        const x = r() * W, h = 280 + r() * 520, lean = (r() - 0.5) * 140, w = 8 + r() * 10;
        const side = x < 330 || x > 960 ? 1 : 0.55;
        blades.push(<path key={i} d={`M${x - w} ${H} Q${x + lean * 0.3} ${H - h * side * 0.6} ${x + lean} ${H - h * side} Q${x + lean * 0.3 + 4} ${H - h * side * 0.6} ${x + w} ${H} Z`} fill={i % 3 ? '#0a0e09' : '#141b12'} />);
      }
      return <>{blades}</>;
    },
  },
};
