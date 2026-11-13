import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Hero hut geometry (world space). Frame window = world (108,192)..(1188,2112). */
export const HUT = { x: 640, peak: 1010, eave: 1250, floor: 1480, ground: 1640, half: 250 };

const hut = (cx: number, s: number, wall: string, roof: string, stilt: string, key: string) => {
  const g = 1640 - (1 - s) * 260;
  const fl = g - 160 * s, ev = fl - 230 * s, pk = ev - 240 * s, hw = 250 * s;
  return (
    <g key={key}>
      {[-0.8, -0.3, 0.3, 0.8].map((f, i) => <rect key={i} x={cx + f * hw - 9 * s} y={fl} width={18 * s} height={g - fl} fill={stilt} />)}
      <rect x={cx - hw * 0.9} y={ev} width={hw * 1.8} height={fl - ev + 12 * s} fill={wall} />
      <path d={`M ${cx - hw * 1.18} ${ev + 30 * s} L ${cx} ${pk} L ${cx + hw * 1.18} ${ev + 30 * s} L ${cx + hw * 1.05} ${ev + 46 * s} L ${cx - hw * 1.05} ${ev + 46 * s} Z`} fill={roof} />
    </g>
  );
};

const palm = (x: number, y: number, s: number, c: string, key: string) => (
  <g key={key} fill={c}>
    <path d={`M ${x - 10 * s} ${y} Q ${x + 30 * s} ${y - 300 * s} ${x + 10 * s} ${y - 620 * s} L ${x + 22 * s} ${y - 620 * s} Q ${x + 46 * s} ${y - 300 * s} ${x + 12 * s} ${y} Z`} />
    {[-160, -120, -60, -10, 40, 100, 150].map((a, i) => {
      const r = (a * Math.PI) / 180, L = 260 * s, tx = x + 16 * s + Math.sin(r) * L, ty = y - 620 * s - Math.cos(r) * L * 0.55 + 60 * s;
      return <path key={i} d={`M ${x + 16 * s} ${y - 620 * s} Q ${(x + 16 * s + tx) / 2} ${ty - 90 * s} ${tx} ${ty + 40 * s} Q ${(x + 16 * s + tx) / 2} ${ty - 40 * s} ${x + 16 * s} ${y - 606 * s} Z`} />;
    })}
  </g>
);

const far = (c: string) => (
  <g>
    {palm(120, 1420, 1.0, c, 'p1')}{palm(1150, 1400, 1.1, c, 'p2')}
    {hut(210, 0.55, c, c, c, 'h1')}{hut(1080, 0.6, c, c, c, 'h2')}
  </g>
);

const stars = () => { const r = rng(18); return Array.from({ length: 60 }, (_, i) => <circle key={i} cx={r() * W} cy={r() * 900} r={1 + r() * 2.2} fill="#cdd6ee" opacity={0.3 + r() * 0.5} />); };

/** Set "barrio": nipa huts at night and dawn. */
export const BARRIO: Record<string, BandSpec> = {
  'barrio/sky': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="brSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070a16" /><stop offset="0.5" stopColor="#1a2140" /><stop offset="1" stopColor="#3a4468" /></linearGradient>
          <radialGradient id="brMoon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#cdd6ee" stopOpacity="0.55" /><stop offset="1" stopColor="#cdd6ee" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#brSky)" />
        {stars()}
        <circle cx={HUT.x} cy={HUT.peak - 30} r={520} fill="url(#brMoon)" />
        <circle cx={HUT.x + 40} cy={HUT.peak - 120} r={130} fill="#e4e9f6" />
        <circle cx={HUT.x + 10} cy={HUT.peak - 140} r={22} fill="#c3cbe0" />
        <circle cx={HUT.x + 80} cy={HUT.peak - 90} r={14} fill="#c3cbe0" />
        <path d={`M 0 1420 Q 300 1340 600 1400 T 1296 1380 L 1296 ${H} L 0 ${H} Z`} fill="#141a2c" />
        {far('#0d1220')}
        <rect x={0} y={1630} width={W} height={H - 1630} fill="#0a0c10" />
        <ellipse cx={HUT.x} cy={1700} rx={420} ry={40} fill="#1c2236" opacity={0.7} />
      </g>
    ),
  },
  'barrio/dawn': {
    node: () => (
      <g>
        <defs>
          <linearGradient id="brDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4b5468" /><stop offset="0.55" stopColor="#9aa0aa" /><stop offset="0.8" stopColor="#d8cdbd" /><stop offset="1" stopColor="#8e8c88" /></linearGradient>
          <radialGradient id="brSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f3e0c4" stopOpacity="0.7" /><stop offset="1" stopColor="#f3e0c4" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#brDawn)" />
        <ellipse cx={HUT.x - 40} cy={1300} rx={700} ry={360} fill="url(#brSun)" />
        <path d={`M 0 1420 Q 300 1350 600 1400 T 1296 1380 L 1296 ${H} L 0 ${H} Z`} fill="#6d6c6c" />
        <rect x={0} y={1560} width={W} height={H - 1560} fill="#4e4c4a" />
        {far('#5d5f66')}
        <rect x={0} y={1630} width={W} height={H - 1630} fill="#3a3836" />
      </g>
    ),
  },
  /** hero hut (mid) with steps */
  'barrio/hut': {
    node: () => {
      const { x, eave, floor, ground } = HUT;
      return (
        <g>
          <defs>
            <linearGradient id="brWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a2318" /><stop offset="0.6" stopColor="#3b3022" /><stop offset="1" stopColor="#1c1710" /></linearGradient>
            <linearGradient id="brRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d3322" /><stop offset="1" stopColor="#1d180f" /></linearGradient>
          </defs>
                    {hut(x, 1, 'url(#brWall)', 'url(#brRoof)', '#16120c', 'hero')}
          {/* roof thatch lines */}
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${x - 250 - i * 8} ${eave - 40 - i * 50} L ${x + 250 + i * 8} ${eave - 40 - i * 50}`} stroke="#4a3e2a" strokeWidth={3} opacity={0.0} />)}
          <path d={`M ${x - 295} ${eave + 30} L ${x} ${HUT.peak} L ${x + 295} ${eave + 30}`} stroke="#8d97b8" strokeWidth={5} fill="none" opacity={0.55} />
          {/* window + door */}
          <rect x={x - 170} y={eave + 60} width={110} height={100} fill="#0e0b07" />
          <rect x={x + 40} y={eave + 40} width={100} height={floor - eave - 40} fill="#0e0b07" />
          {/* steps */}
          {[0, 1, 2, 3].map((i) => <rect key={i} x={x + 20 + i * 14} y={floor + 10 + i * 38} width={150} height={12} fill="#2c2418" />)}
          <path d={`M ${x + 20} ${floor} L ${x + 70} ${ground}`} stroke="#1a150e" strokeWidth={14} />
          <path d={`M ${x + 170} ${floor} L ${x + 220} ${ground}`} stroke="#1a150e" strokeWidth={14} />
        </g>
      );
    },
  },
  /** foreground banana leaves framing */
  'barrio/fg': {
    blur: 3,
    node: () => (
      <g fill="#060807">
        <path d="M -40 2304 L -40 1500 Q 120 1600 180 1900 Q 220 2100 260 2304 Z" />
        <path d="M -40 1250 Q 260 1300 420 1520 Q 260 1450 -40 1480 Z" />
        <path d="M 1336 2304 L 1336 1600 Q 1180 1700 1120 1950 Q 1080 2150 1060 2304 Z" />
        <path d="M 1336 1180 Q 1050 1260 900 1480 Q 1080 1400 1336 1420 Z" />
        {Array.from({ length: 26 }, (_, i) => { const x = i * 52 - 20, h = 60 + ((i * 37) % 70); return <path key={i} d={`M ${x} 2304 L ${x + 14} ${2060 - h} L ${x + 30} 2304 Z`} />; })}
        <path d="M 0 0 L 520 0 Q 320 80 0 260 Z" />
      </g>
    ),
  },
};
