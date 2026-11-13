import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H } from '../art/world';
import { VP, gy, gx, LAMP } from '../art/street_figs';

const P = (bx: number, s: number, up = 0) => `${gx(bx, s)},${gy(s) - up * s}`;
const pole = (bx: number, s: number, hgt: number, fill: string) => {
  const x = gx(bx, s), y = gy(s), t = hgt * s, w = 26 * s;
  return <g key={`${bx}-${s}`}><rect x={x - w / 2} y={y - t} width={w} height={t} fill={fill} /><rect x={x - 70 * s} y={y - t + 50 * s} width={140 * s} height={10 * s} fill={fill} /></g>;
};

/** Set "street" (narrow Japanese residential street at night under one streetlight). Static bands baked ONCE to public/baked/street/<band>.png. Ids "street/<band>". */
export const STREET: Record<string, BandSpec> = {
  /** sky, houses, walls, asphalt, poles, vending machine, streetlight pole */
  'street/bg': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0d18" /><stop offset="1" stopColor="#1a1f33" /></linearGradient>
          <linearGradient id="stRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1d27" /><stop offset="0.4" stopColor="#15171e" /><stop offset="1" stopColor="#0d0e13" /></linearGradient>
          <radialGradient id="stVend" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#9fd7ff" stopOpacity="0.45" /><stop offset="1" stopColor="#9fd7ff" stopOpacity="0" /></radialGradient>
          <radialGradient id="stSign" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe08a" stopOpacity="0.5" /><stop offset="1" stopColor="#ffe08a" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#stSky)" />
        {/* distant konbini glow at the end of the street */}
        <ellipse cx={VP.x - 20} cy={VP.y - 30} rx={140} ry={70} fill="url(#stSign)" />
        <rect x={VP.x - 60} y={VP.y - 52} width={70} height={16} fill="#ffe08a" opacity={0.85} />
        {/* house silhouettes left/right */}
        <path d={`M -50 ${VP.y + 40} L -50 560 L 140 470 L 330 560 L 330 820 L 470 950 L 600 830 L 640 ${VP.y} Z`} fill="#12141d" />
        <path d={`M 1350 ${VP.y + 60} L 1350 600 L 1180 520 L 1010 610 L 1010 860 L 880 800 L 770 860 L 740 ${VP.y} Z`} fill="#12141d" />
        <rect x={120} y={640} width={60} height={46} fill="#ffe08a" opacity={0.18} />
        <rect x={1120} y={690} width={46} height={60} fill="#9fd7ff" opacity={0.08} />
        {/* road */}
        <polygon points={`${VP.x},${VP.y} ${-500},${H} ${W + 500},${H}`} fill="url(#stRoad)" />
        <polygon points={`${VP.x - 3},${VP.y} ${VP.x + 3},${VP.y} ${gx(700, 1)},${H} ${gx(640, 1)},${H}`} fill="#262935" opacity={0.0} />
        {/* left block wall */}
        <polygon points={`${P(-120, 1)} ${P(-120, 1, 950)} ${P(-120, 0.06, 950)} ${P(-120, 0.06)}`} fill="#1c1f2a" />
        <polygon points={`${P(-120, 1, 950)} ${P(-120, 0.06, 950)} ${P(-120, 0.06, 905)} ${P(-120, 1, 905)}`} fill="#2a2e3c" />
        {/* right block wall */}
        <polygon points={`${P(1480, 1)} ${P(1480, 1, 950)} ${P(1480, 0.06, 950)} ${P(1480, 0.06)}`} fill="#181a24" />
        <polygon points={`${P(1480, 1, 950)} ${P(1480, 0.06, 950)} ${P(1480, 0.06, 905)} ${P(1480, 1, 905)}`} fill="#262a37" />
        {/* wall joints */}
        {[0.12, 0.18, 0.26, 0.38, 0.55, 0.8].map((s) => <g key={s}><line x1={gx(-120, s)} y1={gy(s)} x2={gx(-120, s)} y2={gy(s) - 950 * s} stroke="#14161f" strokeWidth={3 * s + 1} /><line x1={gx(1480, s)} y1={gy(s)} x2={gx(1480, s)} y2={gy(s) - 950 * s} stroke="#101219" strokeWidth={3 * s + 1} /></g>)}
        {/* vending machine against left wall */}
        <ellipse cx={gx(-120, 0.3) + 60} cy={gy(0.3) - 150} rx={260} ry={300} fill="url(#stVend)" />
        <polygon points={`${P(-120, 0.34)} ${P(-120, 0.34, 1950)} ${P(-120, 0.26, 1950)} ${P(-120, 0.26)}`} fill="#9fd7ff" opacity={0.9} />
        <polygon points={`${P(-120, 0.34, 1100)} ${P(-120, 0.34, 1450)} ${P(-120, 0.26, 1450)} ${P(-120, 0.26, 1100)}`} fill="#d8f0ff" />
        {[0, 1, 2].map((r) => <polygon key={r} points={`${P(-120, 0.335, 1060 - r * 190)} ${P(-120, 0.335, 990 - r * 190)} ${P(-120, 0.265, 1200 - r * 220)} ${P(-120, 0.265, 1280 - r * 220)}`} fill="#5c8fb8" opacity={0.6} />)}
        <polygon points={`${P(-120, 0.34)} ${P(-120, 0.26)} ${P(80, 0.26)} ${P(80, 0.34)}`} fill="#9fd7ff" opacity={0.18} />
        {/* utility poles far */}
        {pole(-60, 0.12, 4200, '#0e1018')}{pole(-60, 0.2, 4200, '#0c0e15')}{pole(1430, 0.16, 4200, '#0e1018')}
        {/* wires */}
        <path d={`M ${gx(-60, 0.12)} ${gy(0.12) - 4150 * 0.12} Q 500 600 ${gx(1430, 0.16)} ${gy(0.16) - 4150 * 0.16}`} stroke="#07080d" strokeWidth={3} fill="none" />
        <path d={`M ${gx(-60, 0.2)} ${gy(0.2) - 4150 * 0.2} Q 700 380 ${W + 50} 120`} stroke="#07080d" strokeWidth={3} fill="none" />
        <path d={`M ${gx(-60, 0.2)} ${gy(0.2) - 4100 * 0.2} Q 400 520 -40 300`} stroke="#07080d" strokeWidth={3} fill="none" />
        {/* streetlight pole */}
        <rect x={LAMP.x - 9} y={LAMP.head} width={18} height={LAMP.base - LAMP.head} fill="#0c0e15" />
        <path d={`M ${LAMP.x} ${LAMP.head + 10} Q ${LAMP.x - 20} ${LAMP.head - 20} ${LAMP.armX + 20} ${LAMP.head - 12} L ${LAMP.armX} ${LAMP.head - 10}`} stroke="#0c0e15" strokeWidth={10} fill="none" />
        <path d={`M ${LAMP.armX - 40} ${LAMP.head - 18} L ${LAMP.armX + 40} ${LAMP.head - 18} L ${LAMP.armX + 30} ${LAMP.head} L ${LAMP.armX - 30} ${LAMP.head} Z`} fill="#141722" />
        <rect x={LAMP.x - 9} y={LAMP.head} width={4} height={LAMP.base - LAMP.head} fill="#a9c4e8" opacity={0.25} />
      </g>
    ),
  },
  /** near foreground: big pole on the right edge with wires, dark */
  'street/fg': {
    node: () => (
      <g>
        <rect x={1150} y={0} width={70} height={H} fill="#07080d" />
        <rect x={1060} y={260} width={240} height={22} fill="#07080d" />
        <rect x={1100} y={300} width={30} height={60} fill="#07080d" />
        <path d="M 1150 280 Q 700 520 -40 420" stroke="#07080d" strokeWidth={6} fill="none" />
        <path d="M 1150 330 Q 950 600 -40 560" stroke="#07080d" strokeWidth={5} fill="none" />
        <rect x={1152} y={0} width={5} height={H} fill="#a9c4e8" opacity={0.18} />
      </g>
    ),
  },
  /** front gate of the family house (shot 12) */
  'street/gate': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="gtWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2f40" /><stop offset="1" stopColor="#151821" /></linearGradient>
          <linearGradient id="gtLight" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8f1ff" stopOpacity="0.32" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0" /></linearGradient>
          <linearGradient id="gtPlate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8c7458" /><stop offset="1" stopColor="#5d4a37" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="#0b0d18" />
        <path d="M -20 700 L 400 420 L 820 700 Z" fill="#12141d" />
        <rect x={60} y={700} width={905} height={500} fill="#12141d" />
        <rect x={180} y={820} width={120} height={150} fill="#ffe08a" opacity={0.22} />
        <rect x={0} y={1180} width={W} height={H - 1180} fill="#15171e" />
        {/* block walls */}
        <rect x={0} y={1000} width={300} height={640} fill="url(#gtWall)" />
        <rect x={900} y={1000} width={400} height={640} fill="url(#gtWall)" />
        {[1080, 1160, 1240, 1320, 1400, 1480, 1560].map((y) => <g key={y}><line x1={0} y1={y} x2={300} y2={y} stroke="#11131b" strokeWidth={3} /><line x1={900} y1={y} x2={W} y2={y} stroke="#11131b" strokeWidth={3} /></g>)}
        {/* gate pillars */}
        <rect x={260} y={880} width={110} height={950} fill="#262a37" />
        <rect x={830} y={880} width={110} height={950} fill="#1e2230" />
        <rect x={250} y={860} width={130} height={30} fill="#323748" />
        <rect x={820} y={860} width={130} height={30} fill="#2a2e3e" />
        {/* metal sliding gate */}
        <rect x={370} y={1080} width={460} height={540} fill="#0d0f16" opacity={0.75} />
        <rect x={370} y={1080} width={460} height={14} fill="#3a4152" />
        <rect x={370} y={1600} width={460} height={14} fill="#2c3240" />
        {Array.from({ length: 15 }, (_, i) => <rect key={i} x={384 + i * 30} y={1094} width={8} height={506} fill="#3a4152" />)}
        {/* nameplate on left pillar */}
        <rect x={278} y={1010} width={74} height={190} rx={4} fill="url(#gtPlate)" />
        <rect x={278} y={1010} width={74} height={190} rx={4} fill="none" stroke="#2c2219" strokeWidth={4} />
        <text x={315} y={1078} fontSize={52} fill="#20160e" textAnchor="middle" fontFamily="serif">田</text>
        <text x={315} y={1146} fontSize={52} fill="#20160e" textAnchor="middle" fontFamily="serif">中</text>
        {/* intercom + mailbox */}
        <rect x={846} y={1080} width={44} height={70} rx={6} fill="#3b4254" />
        <circle cx={868} cy={1126} r={9} fill="#9fd7ff" opacity={0.6} />
        {/* cold streetlight wash from upper right */}
        <polygon points={`${W},0 ${W},${H} 0,${H} 0,1500`} fill="url(#gtLight)" />
        <rect x={0} y={1620} width={W} height={20} fill="#0a0b10" />
      </g>
    ),
  },
};
