import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "bamboo" (owner B). Static depth bands, baked ONCE to public/baked/bamboo/<band>.png. Ids must be "bamboo/<band>". */

/** One stalk: flat strip, node rings as single darker lines, a few leaf blades. Low detail. */
const Stalk: React.FC<{ x: number; w: number; lean: number; fill: string; node: string; seed: number; leaves?: number }> = ({ x, w, lean, fill, node, seed, leaves = 2 }) => {
  const r = rng(seed);
  const top = -40, bot = H + 40;
  const x2 = x + lean;
  const nodes: number[] = [];
  for (let y = 120 + r() * 200; y < H; y += 220 + r() * 120) nodes.push(y);
  const at = (y: number) => x + (lean * (y - top)) / (bot - top);
  return (
    <g>
      <path d={`M ${x - w / 2} ${bot} L ${x2 - w / 2} ${top} L ${x2 + w / 2} ${top} L ${x + w / 2} ${bot} Z`} fill={fill} />
      {nodes.map((y, i) => <line key={i} x1={at(y) - w / 2} y1={y} x2={at(y) + w / 2} y2={y - 3} stroke={node} strokeWidth={Math.max(2, w * 0.08)} />)}
      {Array.from({ length: leaves }, (_, i) => {
        const y = 200 + r() * (H * 0.6), s = r() > 0.5 ? 1 : -1, L = w * (3 + r() * 2);
        const bx = at(y) + (s * w) / 2;
        return <g key={`l${i}`}>{[-0.35, 0, 0.4].map((a, j) => { const ex = bx + s * L * (1 - Math.abs(a) * 0.3), ey = y + L * a; return <path key={j} d={`M ${bx} ${y} Q ${(bx + ex) / 2} ${(y + ey) / 2 - L * 0.12} ${ex} ${ey} Q ${(bx + ex) / 2} ${(y + ey) / 2 + L * 0.06} ${bx} ${y + 4} Z`} fill={fill} />; })}</g>;
      })}
    </g>
  );
};

const row = (seed: number, n: number, wMin: number, wMax: number, fill: string, node: string, leaves: number) => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = ((i + 0.2 + r() * 0.6) / n) * W;
    return <Stalk key={i} x={x} w={wMin + r() * (wMax - wMin)} lean={(r() - 0.5) * 80} fill={fill} node={node} seed={seed * 31 + i} leaves={leaves} />;
  });
};

export const BAMBOO: Record<string, BandSpec> = {
  /** dusk sky glimpsed through the grove + hazy far stalks */
  'bamboo/far': {
    blur: 3,
    node: () => (
      <g>
        <defs>
          <linearGradient id="bbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141233" />
            <stop offset="0.38" stopColor="#3b2a5c" />
            <stop offset="0.62" stopColor="#a2475a" />
            <stop offset="0.8" stopColor="#5a3550" />
            <stop offset="1" stopColor="#1a1428" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#bbSky)" />
        <polygon points="380,0 520,0 760,1600 560,1600" fill="#9fc0d8" opacity={0.07} />
        <polygon points="700,0 780,0 1000,1600 880,1600" fill="#9fc0d8" opacity={0.06} />
        <ellipse cx={W * 0.52} cy={900} rx={300} ry={520} fill="#9fc0d8" opacity={0.08} />
        {row(11, 16, 14, 26, '#2c2340', '#241c36', 1)}
        <rect x={0} y={1560} width={W} height={H - 1560} fill="#1a1428" />
      </g>
    ),
  },
  'bamboo/mid': {
    blur: 1,
    node: () => <g>{row(23, 9, 30, 48, '#2a3524', '#1c2418', 2)}<path d={`M 0 1600 Q ${W / 2} 1560 ${W} 1610 L ${W} ${H} L 0 ${H} Z`} fill="#141a12" /></g>,
  },
  'bamboo/near': {
    node: () => (
      <g>
        <Stalk x={70} w={96} lean={30} fill="#0d0a14" node="#1c2418" seed={501} leaves={3} />
        <Stalk x={300} w={70} lean={-40} fill="#1c2418" node="#0d0a14" seed={502} leaves={2} />
        <Stalk x={1030} w={84} lean={-20} fill="#1c2418" node="#0d0a14" seed={503} leaves={2} />
        <Stalk x={1240} w={110} lean={10} fill="#0d0a14" node="#1c2418" seed={504} leaves={3} />
        <path d={`M 0 1700 Q ${W * 0.3} 1660 ${W * 0.6} 1690 T ${W} 1680 L ${W} ${H} L 0 ${H} Z`} fill="#0d0a14" />
      </g>
    ),
  },
  /** low ground fog strip; drifted by the camera only */
  'bamboo/fog': {
    blur: 18,
    node: () => (
      <g>
        <defs>
          <linearGradient id="bbFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d6a8a" stopOpacity={0} />
            <stop offset="0.5" stopColor="#5d6a8a" stopOpacity={0.45} />
            <stop offset="1" stopColor="#26375e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={0} y={1380} width={W} height={380} fill="url(#bbFog)" />
        <ellipse cx={W * 0.3} cy={1560} rx={420} ry={60} fill="#5d6a8a" opacity={0.25} />
        <ellipse cx={W * 0.75} cy={1520} rx={360} ry={50} fill="#5d6a8a" opacity={0.2} />
        <ellipse cx={W * 0.5} cy={1180} rx={520} ry={40} fill="#7d8cab" opacity={0.14} />
        <ellipse cx={W * 0.2} cy={1640} rx={300} ry={40} fill="#9fc0d8" opacity={0.12} />
      </g>
    ),
  },
};
