import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { VP, DOOR } from '../art/house_figs';

const D = DOOR;
/** world point on the left/right wall at depth t (0 = near frame edge, 1 = door plane) */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Set "house" (sleepover bedroom and hallway at night). Static bands baked ONCE to public/baked/house/<band>.png. Ids "house/<band>". */
export const HOUSE: Record<string, BandSpec> = {
  /** bedroom: warm wall, window, bed edge, floor, three sleeping bags */
  'house/bedroom': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="hbWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1c22" /><stop offset="0.55" stopColor="#4a3030" /><stop offset="1" stopColor="#3a2626" /></linearGradient>
          <radialGradient id="hbWarm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.35" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
          <linearGradient id="hbFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2820" /><stop offset="1" stopColor="#1a120e" /></linearGradient>
          <linearGradient id="hbWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1428" /><stop offset="1" stopColor="#1c2a48" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#hbWall)" />
        <ellipse cx={640} cy={1050} rx={760} ry={560} fill="url(#hbWarm)" />
        {/* window with night sky + moon */}
        <rect x={200} y={560} width={300} height={380} fill="#24161a" />
        <rect x={218} y={578} width={264} height={344} fill="url(#hbWin)" />
        <circle cx={420} cy={650} r={26} fill="#c9d3e6" opacity={0.6} />
        <rect x={346} y={578} width={8} height={344} fill="#24161a" />
        <rect x={218} y={746} width={264} height={8} fill="#24161a" />
        {/* curtains */}
        <path d="M 170 540 Q 200 760 160 960 L 230 960 Q 250 760 230 540 Z" fill="#6a3a3a" />
        <path d="M 530 540 Q 500 760 540 960 L 470 960 Q 450 760 470 540 Z" fill="#6a3a3a" />
        {/* poster */}
        <rect x={820} y={620} width={200} height={260} fill="#5a3e4a" />
        <circle cx={920} cy={720} r={50} fill="#8a6070" />
        {/* skirting + floor */}
        <rect x={0} y={1180} width={W} height={H - 1180} fill="url(#hbFloor)" />
        <rect x={0} y={1168} width={W} height={18} fill="#24181a" />
        {/* bed on the right, edge with blanket */}
        <path d="M 1000 1000 L 1320 980 L 1320 1420 L 1000 1420 Z" fill="#2c1e24" />
        <path d="M 980 1000 Q 1150 960 1320 990 L 1320 1100 Q 1150 1080 980 1110 Z" fill="#5a4a6a" />
        {/* rug */}
        <ellipse cx={640} cy={1560} rx={620} ry={210} fill="#5a3030" opacity={0.6} />
        {/* sleeping bags (low detail) */}
        <rect x={80} y={1400} width={360} height={600} rx={90} fill="#3a5a6a" transform="rotate(-8 260 1700)" />
        <rect x={470} y={1380} width={360} height={640} rx={90} fill="#7a4a5a" />
        <rect x={870} y={1400} width={360} height={600} rx={90} fill="#5a6a3a" transform="rotate(8 1050 1700)" />
        {/* pillows */}
        <rect x={130} y={1340} width={260} height={110} rx={50} fill="#d8c4b0" opacity={0.7} transform="rotate(-8 260 1400)" />
        <rect x={520} y={1320} width={260} height={110} rx={50} fill="#e0ccb8" opacity={0.7} />
        <rect x={920} y={1340} width={260} height={110} rx={50} fill="#d8c4b0" opacity={0.7} transform="rotate(8 1050 1400)" />
      </g>
    ),
  },
  /** bedroom near foreground: dark bedpost + blanket edge framing left/bottom */
  'house/bedfg': {
    node: () => (
      <g>
        <rect x={0} y={300} width={80} height={H} fill="#0b0708" />
        <circle cx={40} cy={290} r={46} fill="#0b0708" />
        <path d={`M 0 2020 Q 300 1940 640 2060 Q 1000 2160 ${W} 2000 L ${W} ${H} L 0 ${H} Z`} fill="#120a0c" />
        <rect x={74} y={300} width={4} height={1800} fill="#ffd9a0" opacity={0.25} />
      </g>
    ),
  },
  /** dark hallway in perspective, bathroom door at the end (closed slab; light is live) */
  'house/hall': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="hhL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0c0e13" /><stop offset="1" stopColor="#1a1d24" /></linearGradient>
          <linearGradient id="hhR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#0a0c10" /><stop offset="1" stopColor="#181b22" /></linearGradient>
          <linearGradient id="hhF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#0a0b0e" /><stop offset="1" stopColor="#1e1e22" /></linearGradient>
          <linearGradient id="hhC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060709" /><stop offset="1" stopColor="#121419" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="#0a0b0f" />
        {/* ceiling */}
        <polygon points={`0,0 ${W},0 ${D.x1 + 60},${D.y0 - 60} ${D.x0 - 60},${D.y0 - 60}`} fill="url(#hhC)" />
        {/* left wall */}
        <polygon points={`0,0 ${D.x0 - 60},${D.y0 - 60} ${D.x0 - 60},${D.y1} 0,${H}`} fill="url(#hhL)" />
        {/* right wall */}
        <polygon points={`${W},0 ${D.x1 + 60},${D.y0 - 60} ${D.x1 + 60},${D.y1} ${W},${H}`} fill="url(#hhR)" />
        {/* floor runner */}
        <polygon points={`0,${H} ${D.x0 - 60},${D.y1} ${D.x1 + 60},${D.y1} ${W},${H}`} fill="url(#hhF)" />
        <polygon points={`${W * 0.22},${H} ${D.x0 + 10},${D.y1} ${D.x1 - 10},${D.y1} ${W * 0.78},${H}`} fill="#2a1a1c" opacity={0.6} />
        {/* end wall around the door */}
        <rect x={D.x0 - 60} y={D.y0 - 60} width={D.x1 - D.x0 + 120} height={D.y1 - D.y0 + 60} fill="#15171d" />
        {/* door frame + door slab */}
        <rect x={D.x0 - 12} y={D.y0 - 12} width={D.x1 - D.x0 + 24} height={D.y1 - D.y0 + 12} fill="#22252c" />
        <rect x={D.x0} y={D.y0} width={D.x1 - D.x0} height={D.y1 - D.y0} fill="#101217" />
        <rect x={D.x0 + 20} y={D.y0 + 24} width={D.x1 - D.x0 - 40} height={150} fill="#0d0f13" />
        <rect x={D.x0 + 20} y={D.y0 + 200} width={D.x1 - D.x0 - 40} height={160} fill="#0d0f13" />
        <circle cx={D.x0 + 20} cy={D.y0 + 210} r={7} fill="#3a3a3a" />
        {/* side doors + picture frames (low detail) */}
        <polygon points={`${lerp(0, D.x0 - 60, 0.35)},${lerp(0, D.y0 - 60, 0.35) + 240} ${lerp(0, D.x0 - 60, 0.6)},${lerp(0, D.y0 - 60, 0.6) + 120} ${lerp(0, D.x0 - 60, 0.6)},${lerp(H, D.y1, 0.6)} ${lerp(0, D.x0 - 60, 0.35)},${lerp(H, D.y1, 0.35)}`} fill="#08090c" />
        <polygon points={`${lerp(W, D.x1 + 60, 0.2)},${lerp(0, D.y0 - 60, 0.2) + 560} ${lerp(W, D.x1 + 60, 0.45)},${lerp(0, D.y0 - 60, 0.45) + 380} ${lerp(W, D.x1 + 60, 0.45)},${lerp(0, D.y0 - 60, 0.45) + 540} ${lerp(W, D.x1 + 60, 0.2)},${lerp(0, D.y0 - 60, 0.2) + 800}`} fill="#1e2128" stroke="#2a2d34" strokeWidth={6} />
        <polygon points={`${lerp(W, D.x1 + 60, 0.62)},${lerp(0, D.y0 - 60, 0.62) + 260} ${lerp(W, D.x1 + 60, 0.75)},${lerp(0, D.y0 - 60, 0.75) + 190} ${lerp(W, D.x1 + 60, 0.75)},${lerp(0, D.y0 - 60, 0.75) + 290} ${lerp(W, D.x1 + 60, 0.62)},${lerp(0, D.y0 - 60, 0.62) + 380}`} fill="#1e2128" stroke="#2a2d34" strokeWidth={4} />
        {/* skirting lines */}
        <line x1={0} y1={H - 30} x2={D.x0 - 60} y2={D.y1 - 4} stroke="#1c1f26" strokeWidth={6} />
        <line x1={W} y1={H - 30} x2={D.x1 + 60} y2={D.y1 - 4} stroke="#1c1f26" strokeWidth={6} />
      </g>
    ),
  },
  /** near foreground for the hall: dark doorway edges framing the shot */
  'house/hallfg': {
    node: () => (
      <g>
        <rect x={0} y={0} width={150} height={H} fill="#040507" />
        <rect x={W - 140} y={0} width={140} height={H} fill="#040507" />
        <rect x={0} y={0} width={W} height={150} fill="#040507" />
        <rect x={150} y={150} width={4} height={H} fill="#2a2d34" />
      </g>
    ),
  },
};
