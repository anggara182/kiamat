import React from 'react';

/** Kelpie head + long neck in profile (facing left). Local coords: muzzle ~(-250,150), poll ~(50,-200), neck runs off to (460,900). */
export const HEAD_D =
  'M 52 -196 L 44 -302 Q 24 -262 16 -206 L -2 -284 Q -18 -236 -12 -190 Q -68 -168 -128 -66 L -226 84 Q -262 136 -226 168 Q -184 192 -140 172 Q -120 182 -98 166 Q -6 146 34 70 Q 110 420 170 1300 L 560 1300 Q 400 60 52 -196 Z';

const P0 = [52, -196], PC = [400, 60], P2 = [560, 1300];
const crest = (u: number) => [
  (1 - u) ** 2 * P0[0] + 2 * u * (1 - u) * PC[0] + u * u * P2[0],
  (1 - u) ** 2 * P0[1] + 2 * u * (1 - u) * PC[1] + u * u * P2[1],
];
const LOCKS = Array.from({ length: 16 }, (_, i) => {
  const u = 0.02 + i * 0.038;
  return { u, L: 170 + ((i * 37) % 5) * 30, w: 46 + ((i * 53) % 3) * 12, weed: i % 3 !== 1 };
});

export const KelpieHead: React.FC<{ x: number; y: number; s: number; t: number; sheen?: number; id: string; drops?: number }> = ({ x, y, s, t, sheen = 1, id, drops = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}-hide`} x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="#1c2529" />
        <stop offset="0.3" stopColor="#0a0b0c" />
        <stop offset="1" stopColor="#070808" />
      </linearGradient>
    </defs>
    {/* crest mane mass */}
    <path d={`M ${P0[0] - 10} ${P0[1] - 6} Q ${PC[0] + 24} ${PC[1] - 20} ${P2[0] + 30} ${P2[1]}`} fill="none" stroke="#050607" strokeWidth={64} strokeLinecap="round" />
    <path d={HEAD_D} fill={`url(#${id}-hide)`} />
    {/* rim light: face front, ears, crest top */}
    <path d="M -12 -190 Q -68 -168 -128 -66 L -226 84 Q -262 136 -226 168" fill="none" stroke="#b9c9cf" strokeWidth={5} strokeLinecap="round" opacity={0.8 * sheen} />
    <path d="M 44 -302 Q 24 -262 16 -206 M -2 -284 Q -18 -236 -12 -190" fill="none" stroke="#b9c9cf" strokeWidth={3.5} opacity={0.6 * sheen} />
    <path d={`M ${P0[0] - 30} ${P0[1] - 26} Q ${PC[0]} ${PC[1] - 50} ${P2[0] - 20} ${P2[1] - 500}`} fill="none" stroke="#6f8a90" strokeWidth={3} opacity={0.5 * sheen} />
    {/* wet sheen on cheek/jaw + throat */}
    <path d="M -40 -40 Q 14 10 22 76" fill="none" stroke="#6f8a90" strokeWidth={8} strokeLinecap="round" opacity={0.45 * sheen} />
    <path d="M -150 20 L -200 96" fill="none" stroke="#6f8a90" strokeWidth={5} strokeLinecap="round" opacity={0.35 * sheen} />
    <path d="M 60 160 Q 110 420 140 800" fill="none" stroke="#6f8a90" strokeWidth={4} opacity={0.25 * sheen} />
    {/* nostril + eye glint */}
    <ellipse cx={-214} cy={128} rx={9} ry={6} fill="#000" />
    <ellipse cx={-52} cy={-78} rx={15} ry={9} fill="#020303" />
    <circle cx={-57} cy={-81} r={3.4} fill="#d9e6ea" opacity={0.95} />
    {/* forelock */}
    <path d={`M 30 -205 Q -10 -160 ${-34 + Math.sin(t * 1.2) * 4} -110 Q 0 -150 46 -190 Z`} fill="#050607" />
    {/* hanging wet locks along the crest */}
    {LOCKS.map(({ u, L, w, weed }, i) => {
      const [cx, cy] = crest(u);
      const sw = Math.sin(t * 1.25 + i * 0.8) * 8;
      const tx = cx - 34 + sw, ty = cy + L;
      return (
        <g key={i}>
          <path d={`M ${cx - w / 2} ${cy - 10} Q ${cx - w * 0.4} ${cy + L * 0.55} ${tx} ${ty} Q ${cx + w * 0.15} ${cy + L * 0.5} ${cx + w / 2} ${cy - 10} Z`} fill="#0b1012" />
          <path d={`M ${cx - w * 0.25} ${cy} Q ${cx - w * 0.25} ${cy + L * 0.5} ${tx + 4} ${ty - 14}`} fill="none" stroke="#6f8a90" strokeWidth={2.5} opacity={0.5 * sheen} />
          {weed && <path d={`M ${cx + 6} ${cy + 6} Q ${cx - 8 + sw} ${cy + L * 0.6} ${tx + 10} ${ty + 30 + (i % 2) * 20}`} fill="none" stroke="#3f6b4a" strokeWidth={6} strokeLinecap="round" />}
          {weed && <ellipse cx={cx - 10 + sw * 0.6} cy={cy + L * 0.62} rx={9} ry={16} fill="#3f6b4a" transform={`rotate(20 ${cx - 10} ${cy + L * 0.62})`} />}
        </g>
      );
    })}
    {/* falling drops from lock tips */}
    {drops > 0 && LOCKS.map(({ u, L }, i) => {
      const [cx, cy] = crest(u);
      const per = 1.2 + (i % 4) * 0.3;
      const ph = ((t + i * 0.41) % per) / per;
      return <ellipse key={`d${i}`} cx={cx - 34} cy={cy + L + 10 + ph * ph * 300} rx={4.5} ry={9} fill="#b9c9cf" opacity={0.9 * (1 - ph) * drops} />;
    })}
  </g>
);
