import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "lift" (elevator interior: panel, doors, reflections, hands). Static bands baked ONCE to public/baked/lift/<band>.png. Ids "lift/<band>". */
const Car: React.FC = () => {
  const r = rng(14);
  const streaks = Array.from({ length: 70 }, () => ({ x: 310 + r() * 680, y: 320 + r() * 1050, h: 60 + r() * 220, o: 0.03 + r() * 0.05 }));
  return (
    <g>
      <defs>
        <linearGradient id="lwall" x1="0" x2="1"><stop offset="0" stopColor="#3a424c" /><stop offset="0.5" stopColor="#7b8794" /><stop offset="1" stopColor="#3a424c" /></linearGradient>
        <linearGradient id="lside" x1="0" x2="1"><stop offset="0" stopColor="#1c2027" /><stop offset="1" stopColor="#4a535e" /></linearGradient>
        <linearGradient id="lside2" x1="1" x2="0"><stop offset="0" stopColor="#1c2027" /><stop offset="1" stopColor="#4a535e" /></linearGradient>
        <linearGradient id="lfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2622" /><stop offset="1" stopColor="#0d0c0b" /></linearGradient>
        <radialGradient id="lglow" cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="#e9f3ff" stopOpacity="0.55" /><stop offset="1" stopColor="#e9f3ff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="#0a0c10" />
      <polygon points={`0,0 300,300 300,1450 0,${H}`} fill="url(#lside)" />
      <polygon points={`${W},0 996,300 996,1450 ${W},${H}`} fill="url(#lside2)" />
      <polygon points={`0,0 ${W},0 996,300 300,300`} fill="#cfd8e2" />
      <rect x="400" y="90" width="496" height="110" rx="10" fill="#e9f3ff" />
      <rect x="300" y="300" width="696" height="1150" fill="url(#lwall)" />
      {streaks.map((s, i) => <rect key={i} x={s.x} y={s.y} width="2" height={s.h} fill="#ffffff" opacity={s.o} />)}
      <line x1="648" y1="300" x2="648" y2="1450" stroke="#2b3139" strokeWidth="6" />
      <rect x="300" y="1440" width="696" height="12" fill="#9aa6b2" />
      <polygon points={`300,1450 996,1450 ${W},${H} 0,${H}`} fill="url(#lfloor)" />
      <polygon points="1060,620 1130,595 1130,1080 1060,1060" fill="#20252c" />
      <rect width={W} height={H} fill="url(#lglow)" />
    </g>
  );
};

const Panel: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="lpan" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#8a96a3" /><stop offset="1" stopColor="#3e4650" /></linearGradient>
      <radialGradient id="lpg" cx="0.4" cy="0.2" r="0.9"><stop offset="0" stopColor="#e9f3ff" stopOpacity="0.25" /><stop offset="1" stopColor="#e9f3ff" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="#4a535e" />
    <rect x="300" y="250" width="700" height="1750" rx="24" fill="url(#lpan)" stroke="#2a3038" strokeWidth="8" />
    <rect x="420" y="330" width="460" height="200" rx="12" fill="#120a02" />
    {Array.from({ length: 10 }, (_, i) => {
      const n = i + 1, col = i % 2, row = 4 - Math.floor(i / 2);
      const cx = 520 + col * 260, cy = 720 + row * 230;
      return (
        <g key={n}>
          <circle cx={cx} cy={cy} r="80" fill="#2b3038" />
          <circle cx={cx} cy={cy} r="66" fill="#99a5b1" />
          <text x={cx} y={cy + 22} textAnchor="middle" fontSize="64" fontFamily="Oswald, sans-serif" fill="#2b3038">{n}</text>
        </g>
      );
    })}
    <rect width={W} height={H} fill="url(#lpg)" />
  </g>
);

export const LIFT: Record<string, BandSpec> = {
  'lift/car': { node: () => <Car /> },
  'lift/panel': { node: () => <Panel /> },
};
