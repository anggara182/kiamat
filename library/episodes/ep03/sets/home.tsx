import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "home" (owner H). Static depth bands, baked ONCE to public/baked/home/<band>.png. Ids must be "home/<band>". */

/** banana tree base (world coords) used by shot 10 */
export const BANANA = { x: 760, y: 1440 };
/** vertical offset applied to the whole yard band (tree roots end up at BANANA.y + YARD_DY) */
export const YARD_DY = -180;
/** sandals spot for shot 11 */
export const SANDALS = { x: 640, y: 1220 };

const Porch: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="hp-lamp" cx="0.2" cy="0.18" r="0.9">
        <stop offset="0" stopColor="#ffb35c" stopOpacity="0.55" /><stop offset="0.45" stopColor="#7a3e2a" stopOpacity="0.25" /><stop offset="1" stopColor="#0d0a14" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="#2a1a16" />
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i}>
        <rect x={0} y={i * 400} width={W} height={400} fill={i % 2 ? '#2e1d18' : '#26170f'} />
        <rect x={0} y={i * 400} width={W} height={5} fill="#120a08" />
      </g>
    ))}
    <rect x={0} y={0} width={W} height={H} fill="url(#hp-lamp)" />
  </g>
);

const MorningSky: React.FC = () => {
  const r = rng(303);
  return (
    <g>
      <defs>
        <linearGradient id="hm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9bcc8" /><stop offset="0.5" stopColor="#e8e0d4" /><stop offset="1" stopColor="#c9ccd6" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#hm-sky)" />
      {/* far hazy treeline */}
      <path d={`M 0 1100 ${Array.from({ length: 14 }, (_, i) => `Q ${i * 100 + 50} ${1020 - r() * 90} ${(i + 1) * 100} 1090`).join(' ')} L ${W} 1400 L 0 1400 Z`} fill="#a4aab0" />
      <rect x={0} y={1300} width={W} height={H - 1300} fill="#9aa39a" />
    </g>
  );
};

/** banana tree + yard ground (mid band, morning) */
const Yard: React.FC = () => (
  <g transform={`translate(0 ${YARD_DY})`}>
    <path d={`M 0 1360 Q 600 1320 ${W} 1370 L ${W} ${H + 400} L 0 ${H + 400} Z`} fill="#6e7a6c" />
    <path d={`M 0 1700 Q 600 1640 ${W} 1720 L ${W} ${H + 400} L 0 ${H + 400} Z`} fill="#5a6b5a" />
    {/* house silhouette, far left, hazy */}
    <path d="M 40 1360 L 40 1120 L 220 1000 L 400 1120 L 400 1360 Z" fill="#8a8e92" />
    {/* banana tree */}
    <g transform={`translate(${BANANA.x} ${BANANA.y})`}>
      <path d="M -50 0 C -46 -300, -36 -560, -20 -720 L 22 -720 C 34 -560, 44 -300, 52 0 Z" fill="#4a5848" />
      <path d="M 10 0 C 14 -300, 20 -560, 22 -720" stroke="#3a4638" strokeWidth={14} fill="none" />
      {[[-1, -700, -40], [1, -710, 30], [-1, -620, -70], [1, -600, 70], [-1, -520, -110], [1, -760, 0]].map(([s, y, rot], i) => (
        <g key={i} transform={`translate(0 ${y}) rotate(${rot})`}>
          <path d={`M 0 0 C ${s * 120} -90, ${s * 340} -100, ${s * 470} -40 C ${s * 340} -10, ${s * 140} 20, 0 0 Z`} fill={i % 2 ? '#5a6b5a' : '#4e5e4e'} />
          <path d={`M 0 0 C ${s * 160} -50, ${s * 320} -60, ${s * 460} -40`} stroke="#3e4c3e" strokeWidth={4} fill="none" />
        </g>
      ))}
      {/* torn hanging dry leaf */}
      <path d="M 30 -520 C 80 -400, 90 -260, 70 -160 L 50 -170 C 60 -270, 50 -400, 18 -500 Z" fill="#7a7258" />
      {/* roots */}
      <path d="M -120 14 C -80 -10, -60 -10, -50 0 M 120 16 C 80 -6, 62 -8, 52 0" stroke="#3a4638" strokeWidth={16} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

/** bamboo base, low angle (shot 11): far hazy stalks, mid stalks, ground. Foreground stalk bases are live in S11. */
const BambooEdge: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hb-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a948a" /><stop offset="0.35" stopColor="#6e7a6c" /><stop offset="1" stopColor="#3e4a3e" />
      </linearGradient>
    </defs>
    {/* far hazy stalks */}
    {[[120, 40], [330, 34], [560, 30], [700, 38], [880, 32], [1060, 36], [1220, 30]].map(([x, w], i) => (
      <rect key={`f${i}`} x={x - w / 2} y={0} width={w} height={1180} fill="#7f8a84" opacity={0.7} />
    ))}
    {/* mid stalks */}
    {[[60, 90, '#2a3524'], [250, 70, '#34402e'], [470, 60, '#34402e'], [800, 80, '#2a3524'], [1000, 64, '#34402e'], [1190, 96, '#2a3524']].map(([x, w, c], i) => (
      <g key={i}>
        <rect x={(x as number) - (w as number) / 2} y={0} width={w as number} height={1200 + (i % 3) * 20} fill={c as string} />
        {[260, 600, 940].map((y) => <rect key={y} x={(x as number) - (w as number) / 2} y={y + i * 37} width={w as number} height={5} fill="#141a10" />)}
      </g>
    ))}
    <path d={`M 0 1150 Q 640 1120 ${W} 1160 L ${W} ${H} L 0 ${H} Z`} fill="url(#hb-ground)" />
    {[[260, 1170], [900, 1160], [1120, 1200]].map(([x, y], i) => (
      <path key={i} d={`M ${x} ${y} c 40 -10, 90 -4, 130 14 c -40 6, -90 6, -130 -14 Z`} fill="#4a564a" />
    ))}
  </g>
);

const MistFront: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="hm-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9ccd6" stopOpacity="0" /><stop offset="0.5" stopColor="#c9ccd6" stopOpacity="0.75" /><stop offset="1" stopColor="#c9ccd6" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <rect x={0} y={1150} width={W} height={500} fill="url(#hm-mist)" />
    <ellipse cx={300} cy={1500} rx={500} ry={90} fill="#e8e0d4" opacity={0.5} />
    <ellipse cx={1000} cy={1420} rx={460} ry={70} fill="#e8e0d4" opacity={0.45} />
  </g>
);

export const HOME: Record<string, BandSpec> = {
  'home/porch': { node: () => <Porch /> },
  'home/sky': { blur: 6, node: () => <MorningSky /> },
  'home/yard': { blur: 1.5, node: () => <Yard /> },
  'home/bamboo': { blur: 2, node: () => <BambooEdge /> },
  'home/mist': { blur: 14, node: () => <MistFront /> },
};
