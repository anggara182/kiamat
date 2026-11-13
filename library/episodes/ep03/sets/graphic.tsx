import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Simple bamboo stalk: tapered rect + 1 darker node line per segment + a few blade leaves. LOW detail. */
const Stalk: React.FC<{ x: number; w: number; top: number; fill: string; node: string; lean?: number; leaves?: number; seed?: number }> = ({ x, w, top, fill, node, lean = 0, leaves = 0, seed = 1 }) => {
  const r = rng(seed);
  const seg = 150 + w * 2;
  const nodes: number[] = [];
  for (let y = top + seg * 0.6; y < H; y += seg) nodes.push(y);
  const lx = (y: number) => x + lean * (H - y) / H;
  return (
    <g>
      <path d={`M ${lx(top) - w * 0.42} ${top} L ${lx(top) + w * 0.42} ${top} L ${x + w / 2} ${H} L ${x - w / 2} ${H} Z`} fill={fill} />
      {nodes.map((y, i) => (
        <path key={i} d={`M ${lx(y) - w * 0.5} ${y} L ${lx(y) + w * 0.5} ${y}`} stroke={node} strokeWidth={Math.max(2, w * 0.09)} />
      ))}
      {Array.from({ length: leaves }).map((_, i) => {
        const y = top + 80 + r() * 900;
        const d = r() > 0.5 ? 1 : -1;
        const L = 70 + r() * 70;
        const a = lx(y);
        return <path key={`l${i}`} d={`M ${a} ${y} Q ${a + d * L * 0.5} ${y - 22} ${a + d * L} ${y + 18} Q ${a + d * L * 0.45} ${y + 2} ${a} ${y} Z`} fill={fill} />;
      })}
    </g>
  );
};

/** Set "graphic" (owner G). Static depth bands, baked ONCE to public/baked/graphic/<band>.png. Ids must be "graphic/<band>". */
export const GRAPHIC: Record<string, BandSpec> = {
  /** Dark dusk sky + hazy far bamboo grove. */
  'graphic/far': {
    node: () => {
      const r = rng(31);
      return (
        <g>
          <defs>
            <linearGradient id="gf-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0b0a1e" />
              <stop offset="0.35" stopColor="#141233" />
              <stop offset="0.62" stopColor="#2a2148" />
              <stop offset="0.8" stopColor="#4a2c52" />
              <stop offset="1" stopColor="#1a1428" />
            </linearGradient>
            <radialGradient id="gf-glow" cx="0.556" cy="0.5" r="0.42" gradientTransform="translate(0.556 0.5) scale(1 0.62) translate(-0.556 -0.5)">
              <stop offset="0" stopColor="#e4ebf2" stopOpacity={0.95} />
              <stop offset="0.3" stopColor="#b9cbdb" stopOpacity={0.75} />
              <stop offset="0.65" stopColor="#5d6a8a" stopOpacity={0.35} />
              <stop offset="1" stopColor="#5d6a8a" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#gf-sky)" />
          {Array.from({ length: 14 }).map((_, i) => (
            <Stalk key={i} seed={100 + i} x={40 + i * 92 + r() * 40} w={14 + r() * 10} top={-40} fill="#2c2340" node="#241c35" lean={(r() - 0.5) * 60} leaves={3} />
          ))}
          <rect width={W} height={H} fill="url(#gf-glow)" />
          <rect y={H * 0.72} width={W} height={H * 0.28} fill="#1a1428" opacity={0.85} />
        </g>
      );
    },
  },
  /** Near bamboo silhouettes framing both sides, one stalk crossing the centre (hides the figure). */
  'graphic/near': {
    node: () => (
      <g>
        <Stalk seed={7} x={150} w={74} top={-60} fill="#0d0a14" node="#06050a" lean={-30} leaves={6} />
        <Stalk seed={8} x={290} w={44} top={-60} fill="#1c2418" node="#121810" lean={20} leaves={4} />
        <Stalk seed={9} x={430} w={34} top={-60} fill="#1c2418" node="#121810" lean={-14} leaves={5} />
        <Stalk seed={10} x={1060} w={52} top={-60} fill="#1c2418" node="#121810" lean={24} leaves={4} />
        <Stalk seed={11} x={1190} w={86} top={-60} fill="#0d0a14" node="#06050a" lean={30} leaves={6} />
        <path d={`M 0 ${H * 0.66} C 300 ${H * 0.63}, 900 ${H * 0.65}, ${W} ${H * 0.62} L ${W} ${H} L 0 ${H} Z`} fill="#0d0a14" />
      </g>
    ),
  },
};
