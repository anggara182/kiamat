import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

export const VPX = 648, VPY = 1000;
const gx = (bx: number, s: number) => VPX + (bx - VPX) * s;
const gy = (s: number) => VPY + (H - VPY) * s;

/** Set "country" (country lane, stone walls, cottage exterior at night in rain). Static bands baked ONCE to public/baked/country/<band>.png. Ids "country/<band>". */
export const COUNTRY: Record<string, BandSpec> = {
  /** night sky, moon in clouds, hills */
  'country/sky': {
    node: () => {
      const r = rng(13);
      return (
        <g>
          <defs>
            <linearGradient id="cySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070a10" /><stop offset="1" stopColor="#1b2530" /></linearGradient>
            <radialGradient id="cyMoon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e3e9f0" stopOpacity="0.55" /><stop offset="1" stopColor="#e3e9f0" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#cySky)" />
          <circle cx={930} cy={420} r={260} fill="url(#cyMoon)" />
          <circle cx={930} cy={420} r={58} fill="#e3e9f0" opacity={0.9} />
          {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={r() * W} cy={300 + r() * 500} rx={220 + r() * 220} ry={30 + r() * 30} fill="#2a3440" opacity={0.55} />)}
          <path d={`M 0 940 Q 260 820 520 920 Q 760 860 1000 900 Q 1150 840 ${W} 880 L ${W} 1060 L 0 1060 Z`} fill="#121a22" />
        </g>
      );
    },
  },
  /** lane, stone walls, cottage with lit window */
  'country/lane': {
    node: () => {
      const r = rng(7);
      return (
        <g>
          <defs>
            <linearGradient id="cyRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262b33" /><stop offset="1" stopColor="#0e1014" /></linearGradient>
            <radialGradient id="cyWin" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9d4d" stopOpacity="0.55" /><stop offset="1" stopColor="#ff9d4d" stopOpacity="0" /></radialGradient>
          </defs>
          <rect x={0} y={VPY - 30} width={W} height={H - VPY + 30} fill="#0f151b" />
          {/* cottage, back-right */}
          <g transform="translate(860 860)">
            <rect x={0} y={40} width={260} height={130} fill="#3a3d42" />
            <polygon points="-20,44 130,-40 280,44" fill="#24272c" />
            <rect x={200} y={-30} width={26} height={50} fill="#24272c" />
            <circle cx={70} cy={100} r={90} fill="url(#cyWin)" />
            <rect x={52} y={84} width={36} height={34} fill="#ff9d4d" />
            <rect x={150} y={90} width={40} height={80} fill="#1a1c20" />
          </g>
          <polygon points={`${VPX - 8},${VPY} ${VPX + 8},${VPY} ${gx(1180, 1)},${H} ${gx(120, 1)},${H}`} fill="url(#cyRoad)" />
          {/* puddles */}
          {[[0.25, 560, 120], [0.45, 760, 170], [0.7, 520, 230]].map(([s, bx, w], i) => <ellipse key={i} cx={gx(bx, s)} cy={gy(s)} rx={w * s * 1.6} ry={w * s * 0.25} fill="#4a5664" opacity={0.6} />)}
          {/* stone walls both sides */}
          <polygon points={`${gx(80, 1)},${H} ${gx(80, 1)},${H - 260} ${gx(80, 0.02)},${VPY - 6} ${gx(80, 0.02)},${VPY}`} fill="#2f3237" />
          <polygon points={`${gx(1220, 1)},${H} ${gx(1220, 1)},${H - 260} ${gx(1220, 0.02)},${VPY - 6} ${gx(1220, 0.02)},${VPY}`} fill="#2b2e33" />
          {Array.from({ length: 40 }, (_, i) => { const s = 0.05 + r() * 0.95; const side = i % 2 ? 80 : 1220; return <ellipse key={i} cx={gx(side, s) + (side < 600 ? -1 : 1) * 40 * s} cy={gy(s) - 120 * s} rx={40 * s} ry={22 * s} fill="#3e4248" opacity={0.7} />; })}
        </g>
      );
    },
  },
};
