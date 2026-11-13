import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

export const L_HZ = 1000;

/** Set "loch" (loch shore at dusk and night: water, hills, path, the horse in the shallows, the garden at the end). Static bands baked ONCE to public/baked/loch/<band>.png. Ids "loch/<band>". */
export const LOCH: Record<string, BandSpec> = {
  'loch/sky': {
    blur: 2,
    node: () => (
      <>
        <defs>
          <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d141a" />
            <stop offset="0.25" stopColor="#1c2831" />
            <stop offset="0.42" stopColor="#26333c" />
            <stop offset="0.48" stopColor="#6d7c86" />
            <stop offset="1" stopColor="#6d7c86" />
          </linearGradient>
          <radialGradient id="lglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#c9d6db" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c9d6db" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lmist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9aa7ad" stopOpacity="0" />
            <stop offset="0.5" stopColor="#9aa7ad" stopOpacity="0.55" />
            <stop offset="1" stopColor="#9aa7ad" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#lsky)" />
        <ellipse cx={700} cy={960} rx={620} ry={260} fill="url(#lglow)" />
        {/* far hills (heather) */}
        <path d={`M 0 860 Q 160 760 330 800 Q 470 700 640 820 Q 760 880 900 780 Q 1060 700 1296 820 L 1296 ${L_HZ + 4} L 0 ${L_HZ + 4} Z`} fill="#5a5664" />
        <path d={`M 0 900 Q 120 840 260 880 Q 420 820 520 900 Q 600 950 700 960 L 700 ${L_HZ + 4} L 0 ${L_HZ + 4} Z`} fill="#3a2f3d" />
        <path d={`M 860 940 Q 980 860 1120 900 Q 1220 920 1296 880 L 1296 ${L_HZ + 4} L 860 ${L_HZ + 4} Z`} fill="#3a2f3d" />
        {/* far cottage window on the right hill */}
        <rect x={1080} y={958} width={9} height={7} fill="#ffcc80" />
        <circle cx={1084} cy={961} r={22} fill="#ffcc80" opacity={0.12} />
        {/* mist bands */}
        <rect x={0} y={900} width={W} height={180} fill="url(#lmist)" />
        <rect x={0} y={980} width={W} height={120} fill="url(#lmist)" opacity={0.7} />
      </>
    ),
  },
  'loch/water': {
    node: () => {
      const r = rng(20);
      const streaks = Array.from({ length: 22 }, () => ({ x: r() * W, y: L_HZ + 10 + Math.pow(r(), 1.6) * 700, w: 60 + r() * 260 }));
      return (
        <>
          <defs>
            <linearGradient id="lwat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7f8f97" />
              <stop offset="0.12" stopColor="#3e5058" />
              <stop offset="0.45" stopColor="#16262c" />
              <stop offset="1" stopColor="#0b161a" />
            </linearGradient>
            <radialGradient id="lshine" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#b9c9cf" stopOpacity="0.45" />
              <stop offset="1" stopColor="#b9c9cf" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x={0} y={L_HZ} width={W} height={H - L_HZ} fill="url(#lwat)" />
          <ellipse cx={720} cy={L_HZ + 140} rx={420} ry={150} fill="url(#lshine)" />
          {/* reflected hills, darker */}
          <path d={`M 0 ${L_HZ} L 700 ${L_HZ} Q 600 ${L_HZ + 40} 520 ${L_HZ + 70} Q 300 ${L_HZ + 110} 0 ${L_HZ + 90} Z`} fill="#2a2a33" opacity={0.6} />
          <path d={`M 860 ${L_HZ} L 1296 ${L_HZ} L 1296 ${L_HZ + 90} Q 1120 ${L_HZ + 70} 860 ${L_HZ + 40} Z`} fill="#2a2a33" opacity={0.6} />
          {streaks.map((s, i) => <rect key={i} x={s.x} y={s.y} width={s.w} height={2 + (s.y - L_HZ) / 300} fill="#b9c9cf" opacity={0.18} />)}
        </>
      );
    },
  },
  'loch/shore': {
    node: () => (
      <>
        <defs>
          <linearGradient id="lbank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2730" />
            <stop offset="1" stopColor="#0c0b0f" />
          </linearGradient>
          <linearGradient id="lpath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a6a6e" />
            <stop offset="1" stopColor="#2e2e33" />
          </linearGradient>
        </defs>
        {/* ruined boathouse on the far left shore */}
        <path d="M 150 1190 L 150 1100 L 230 1040 L 300 1092 L 300 1190 Z" fill="#1d1a22" />
        <path d="M 230 1040 L 262 1062 L 250 1100 L 236 1070 Z" fill="#26333c" />
        <rect x={196} y={1130} width={36} height={60} fill="#0f0e12" />
        {/* near bank sweeping from left to bottom-right */}
        <path d="M 0 1180 Q 220 1170 360 1210 Q 560 1290 760 1420 Q 980 1560 1296 1600 L 1296 2304 L 0 2304 Z" fill="url(#lbank)" />
        {/* stone path running along the shore */}
        <path d="M 120 1230 Q 320 1260 520 1360 Q 760 1480 1296 1700 L 1296 1820 Q 760 1600 480 1440 Q 300 1330 90 1270 Z" fill="url(#lpath)" />
        <g fill="#26262b" opacity={0.6}>
          <ellipse cx={420} cy={1340} rx={40} ry={9} /><ellipse cx={640} cy={1450} rx={52} ry={11} /><ellipse cx={900} cy={1580} rx={66} ry={13} /><ellipse cx={1150} cy={1690} rx={80} ry={15} />
        </g>
        {/* shoreline sheen */}
        <path d="M 0 1180 Q 220 1170 360 1210 Q 560 1290 760 1420 Q 980 1560 1296 1600" stroke="#b9c9cf" strokeWidth={3} fill="none" opacity={0.45} />
        {/* foreground reeds framing left and right */}
        <g fill="#060708">
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${30 + i * 18} 2304 Q ${20 + i * 22} ${1900 - (i % 3) * 120} ${60 + i * 26 - 40} ${1650 + (i % 4) * 70} Q ${36 + i * 22} ${1900} ${44 + i * 18} 2304 Z`} />)}
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${1270 - i * 20} 2304 Q ${1280 - i * 24} ${1960 - (i % 3) * 100} ${1250 - i * 28 + 40} ${1760 + (i % 3) * 80} Q ${1262 - i * 22} 1960 ${1254 - i * 20} 2304 Z`} />)}
        </g>
      </>
    ),
  },
  'loch/garden': {
    node: () => (
      <>
        <defs>
          <linearGradient id="lgrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2622" />
            <stop offset="1" stopColor="#07090a" />
          </linearGradient>
          <radialGradient id="lwin" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcc80" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffcc80" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* garden lawn */}
        <path d="M 0 1160 Q 400 1140 800 1170 Q 1100 1190 1296 1180 L 1296 2304 L 0 2304 Z" fill="url(#lgrass)" />
        {/* light spill from window on the lawn */}
        <ellipse cx={1010} cy={1700} rx={360} ry={140} fill="url(#lwin)" opacity={0.6} />
        {/* far stone wall + gate at the end of garden */}
        <path d="M 0 1178 L 560 1170 L 560 1140 L 0 1150 Z" fill="#14161a" />
        <path d="M 720 1170 L 1296 1182 L 1296 1150 L 720 1140 Z" fill="#14161a" />
        <g stroke="#1b1e22" strokeWidth={6}><path d="M 560 1176 L 560 1100" /><path d="M 720 1176 L 720 1100" /></g>
        <g stroke="#1b1e22" strokeWidth={3}><path d="M 562 1110 L 610 1112 M 562 1150 L 610 1150 M 610 1110 L 610 1150 M 562 1110 L 610 1150" /></g>
        {/* cottage (right, foreground) */}
        <path d="M 900 2304 L 900 1420 L 1080 1240 L 1296 1400 L 1296 2304 Z" fill="#0a0b0d" />
        <path d="M 880 1430 L 1080 1220 L 1296 1380 L 1296 1400 L 1080 1250 L 900 1440 Z" fill="#1d2329" />
        <rect x={1180} y={1180} width={50} height={120} fill="#0a0b0d" />
        <ellipse cx={1010} cy={1610} rx={180} ry={160} fill="url(#lwin)" />
        <rect x={950} y={1530} width={120} height={150} fill="#ffcc80" />
        <path d="M 1010 1530 L 1010 1680 M 950 1605 L 1070 1605" stroke="#3b2a1a" strokeWidth={8} />
        {/* path stones leading to the gate */}
        <g fill="#2b2f33" opacity={0.7}>
          <ellipse cx={640} cy={1200} rx={22} ry={5} /><ellipse cx={620} cy={1260} rx={34} ry={7} /><ellipse cx={590} cy={1350} rx={48} ry={10} /><ellipse cx={550} cy={1480} rx={66} ry={13} /><ellipse cx={500} cy={1660} rx={90} ry={18} />
        </g>
        {/* foreground bushes left */}
        <path d="M 0 1600 Q 60 1500 140 1560 Q 220 1480 300 1600 Q 340 1700 280 1800 L 0 1900 Z" fill="#050606" />
        <path d="M 0 2304 L 0 1820 Q 120 1760 220 1860 Q 300 1960 260 2304 Z" fill="#030404" />
      </>
    ),
  },
};
