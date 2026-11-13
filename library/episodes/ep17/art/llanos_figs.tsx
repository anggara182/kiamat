import React from 'react';
import { rng } from './world';

/** El Silbón: impossibly tall thin silhouette, wide-brim hat, sack over shoulder. Feet at (0,0), height h. */
export const Silbon: React.FC<{ x: number; y: number; h: number; fill?: string; rim?: string; step?: number }> = ({ x, y, h, fill = '#050607', rim, step = 0 }) => {
  const s = h / 1000;
  const sw = Math.sin(step) * 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill={fill}>
        {/* legs */}
        <path d={`M-8 -470 L${-14 + sw} -10 L${-2 + sw} 0 L${0 + sw * 0.5} -12 L6 -470 Z`} />
        <path d={`M-4 -470 L${10 - sw} -10 L${22 - sw} 0 L${16 - sw * 0.5} -12 L12 -470 Z`} />
        {/* torso */}
        <path d="M-30 -820 Q-34 -640 -14 -460 L18 -460 Q34 -640 30 -820 Q0 -835 -30 -820 Z" />
        {/* arms long */}
        <path d="M-28 -810 Q-46 -620 -40 -380 L-30 -380 Q-34 -620 -18 -790 Z" />
        <path d="M28 -810 Q44 -650 30 -520 L40 -515 Q52 -650 36 -800 Z" />
        {/* sack over right shoulder */}
        <path d="M20 -830 Q90 -860 96 -760 Q100 -640 60 -600 Q26 -620 32 -700 Q30 -780 20 -830 Z" />
        {/* neck & head */}
        <rect x={-7} y={-860} width={14} height={45} />
        <ellipse cx={0} cy={-880} rx={18} ry={24} />
        {/* wide brim hat */}
        <path d="M-80 -895 Q0 -915 80 -895 Q60 -886 0 -888 Q-60 -886 -80 -895 Z" />
        <path d="M-26 -896 Q-24 -950 0 -952 Q24 -950 26 -896 Z" />
      </g>
      {rim && <path d="M30 -820 Q34 -640 18 -460 L22 -460 Q38 -640 34 -818 Z" fill={rim} opacity={0.7} />}
    </g>
  );
};

/** Long thin barefoot footprint (pointing up = away). */
export const Footprint: React.FC<{ x: number; y: number; s: number; rot?: number; fill?: string; o?: number }> = ({ x, y, s, rot = 0, fill = '#3a3328', o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} fill={fill}>
    <path d="M0 -60 Q9 -58 9 -30 Q7 0 9 30 Q8 50 0 52 Q-8 50 -8 30 Q-6 0 -9 -30 Q-9 -58 0 -60 Z" />
    {[-8, -3.5, 0.5, 4.5, 8.5].map((tx, i) => <ellipse key={i} cx={tx} cy={-69 + Math.abs(tx - 0.5) * 0.9 + (i === 0 ? -3 : 0)} rx={i === 0 ? 3.4 : 2.4} ry={i === 0 ? 4.6 : 3.6} />)}
  </g>
);

/** Swaying grass blades for live layers. */
export const SwayGrass: React.FC<{ seed: number; n: number; x0: number; x1: number; y0: number; y1: number; hmin: number; hmax: number; t: number; wind: number; fill: string; fill2?: string }> =
  ({ seed, n, x0, x1, y0, y1, hmin, hmax, t, wind, fill, fill2 }) => {
    const r = rng(seed);
    const out: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const by = y0 + r() * (y1 - y0), bx = x0 + r() * (x1 - x0);
      const sc = 0.5 + 0.5 * (by - y0) / Math.max(1, y1 - y0);
      const h = (hmin + r() * (hmax - hmin)) * sc, w = (3 + r() * 4) * sc;
      const ph = r() * 6.28;
      const bend = (Math.sin(t * 1.6 - bx * 0.006 + ph * 0.3) * 0.7 + 0.3) * wind * h * 0.35 + (r() - 0.5) * h * 0.2;
      out.push(<path key={i} d={`M${bx - w} ${by} Q${bx + bend * 0.3} ${by - h * 0.55} ${bx + bend} ${by - h} Q${bx + bend * 0.3 + w * 0.4} ${by - h * 0.55} ${bx + w} ${by} Z`} fill={fill2 && i % 3 === 0 ? fill2 : fill} />);
    }
    return <>{out}</>;
  };
