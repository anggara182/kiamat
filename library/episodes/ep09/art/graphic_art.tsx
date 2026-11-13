import React from 'react';
import { rng } from './world';

/** Tiered pine silhouette path. x = trunk centre, base = ground y, h = height, w = half width at bottom. */
export const pinePath = (x: number, base: number, h: number, w: number, tiers = 6, seed = 1) => {
  const r = rng(seed);
  const top = base - h;
  const L: string[] = [], R: string[] = [];
  for (let j = 0; j < tiers; j++) {
    const f = (j + 1) / tiers;
    const y = top + h * 0.92 * f;
    const ww = w * (0.25 + 0.75 * f) * (0.9 + r() * 0.2);
    const yi = y - h * 0.05;
    L.push(`L ${x - ww} ${y} L ${x - ww * 0.42} ${yi}`);
    R.unshift(`L ${x + ww * 0.42} ${yi} L ${x + ww} ${y}`);
  }
  return `M ${x} ${top} ${L.join(' ')} L ${x - w * 0.08} ${base} L ${x + w * 0.08} ${base} ${R.join(' ')} Z`;
};

export const Pine: React.FC<{ x: number; base: number; h: number; w: number; fill: string; snow?: string; seed?: number; tiers?: number }> = ({ x, base, h, w, fill, snow, seed = 1, tiers = 6 }) => {
  const top = base - h;
  return (
    <g>
      <path d={pinePath(x, base, h, w, tiers, seed)} fill={fill} />
      {snow && Array.from({ length: tiers - 1 }, (_, j) => {
        const f = (j + 1) / tiers;
        const y = top + h * 0.92 * f;
        const ww = w * (0.25 + 0.75 * f) * 0.8;
        return <path key={j} d={`M ${x - ww} ${y - 4} Q ${x - ww * 0.5} ${y - h * 0.05 - 6} ${x - ww * 0.2} ${y - h * 0.045} L ${x - ww * 0.35} ${y - h * 0.03} Z`} fill={snow} opacity={0.55} />;
      })}
    </g>
  );
};

/** Hanging tuft of long white fur. Anchor (ax, ay); strands hang down to ~len. sway in px. */
export const FurTuft: React.FC<{ ax: number; ay: number; len: number; sway: number; n?: number; seed?: number; scale?: number }> = ({ ax, ay, len, sway, n = 34, seed = 7, scale = 1 }) => {
  const r = rng(seed);
  const strands = Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1) - 0.5;
    const L = len * (0.45 + 0.55 * Math.cos(u * 2.6)) * (0.7 + r() * 0.45);
    const ox = u * 30 * scale + (r() - 0.5) * 8;
    const bend = (r() - 0.5) * 70 * scale + u * 90 * scale;
    const sw = sway * (0.6 + r() * 0.6);
    const w = (1.2 + r() * 2.6) * scale;
    const tone = r();
    const col = tone < 0.18 ? '#9fb3c9' : tone < 0.75 ? '#e3ebf3' : '#ffffff';
    return { ox, L, bend, sw, w, col, op: 0.55 + r() * 0.45 };
  });
  const tip = (s: (typeof strands)[number]) => ({ x: ax + s.ox + s.bend * 0.6 + s.sw, y: ay + s.L });
  return (
    <g>
      {/* soft glow behind the tuft (gradient shape, not a filter) */}
      <ellipse cx={ax + sway * 0.5} cy={ay + len * 0.5} rx={90 * scale} ry={len * 0.6} fill="url(#furGlow)" />
      {/* body mass */}
      <path d={`M ${ax - 16 * scale} ${ay} C ${ax - 26 * scale} ${ay + len * 0.35}, ${ax - 8 * scale + sway * 0.4} ${ay + len * 0.7}, ${ax + sway * 0.9} ${ay + len * 0.95} C ${ax + 10 * scale + sway * 0.4} ${ay + len * 0.65}, ${ax + 22 * scale} ${ay + len * 0.3}, ${ax + 16 * scale} ${ay} Z`} fill="url(#furBody)" />
      {strands.map((s, i) => {
        const tp = tip(s);
        return (
          <path key={i} d={`M ${ax + s.ox} ${ay} C ${ax + s.ox + s.bend * 0.2} ${ay + s.L * 0.35}, ${ax + s.ox + s.bend + s.sw * 0.3} ${ay + s.L * 0.65}, ${tp.x} ${tp.y}`}
            stroke={s.col} strokeWidth={s.w} strokeLinecap="round" fill="none" opacity={s.op} />
        );
      })}
      {/* rim light strands on the lit (right) side */}
      {strands.filter((_, i) => i % 5 === 0).map((s, i) => {
        const tp = tip(s);
        return <path key={`r${i}`} d={`M ${ax + s.ox + 3} ${ay + 6} C ${ax + s.ox + 3 + s.bend * 0.2} ${ay + s.L * 0.35}, ${ax + s.ox + s.bend + s.sw * 0.3 + 3} ${ay + s.L * 0.6}, ${tp.x + 2} ${tp.y - s.L * 0.1}`} stroke="#bfe8ff" strokeWidth={1} fill="none" opacity={0.7} />;
      })}
    </g>
  );
};

export const FurDefs: React.FC = () => (
  <>
    <radialGradient id="furGlow">
      <stop offset="0" stopColor="#8fd8ff" stopOpacity={0.22} />
      <stop offset="1" stopColor="#8fd8ff" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="furBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c9d6e6" />
      <stop offset="0.5" stopColor="#eef3f8" />
      <stop offset="1" stopColor="#eef3f8" stopOpacity={0} />
    </linearGradient>
  </>
);

/** Snowfall: deterministic flakes, positions from time t. Frame space w x h. */
export const Snow: React.FC<{ t: number; w: number; h: number; n?: number; seed?: number; speed?: number; size?: number; op?: number }> = ({ t, w, h, n = 80, seed = 3, speed = 70, size = 4, op = 0.8 }) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x0 = r() * w, y0 = r() * h, d = 0.4 + r() * 0.8, ph = r() * 6.28;
        const y = (y0 + t * speed * d) % (h + 40) - 20;
        const x = x0 + Math.sin(t * 0.9 * d + ph) * 18 * d;
        return <circle key={i} cx={x} cy={y} r={size * d} fill="#eef3f8" opacity={op * (0.35 + 0.65 * d)} />;
      })}
    </g>
  );
};
