import React from 'react';

/**
 * HERO for shot 2: Wewe Gombel. Very tall thin female silhouette, very long hair, arms hanging
 * below the knees, never fully lit. Local coords: head top at (0,0), height ~900, x centred on 0.
 * `sway` (-1..1) moves hair strands and fingers slightly.
 */
export const WeweFigure: React.FC<{ x: number; y: number; s?: number; sway?: number }> = ({ x, y, s = 1, sway = 0 }) => {
  const h = sway * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id="gw-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d0a14" />
          <stop offset="0.7" stopColor="#151021" />
          <stop offset="1" stopColor="#231c33" />
        </linearGradient>
        <linearGradient id="gw-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.72" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="gw-haze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3a4658" stopOpacity={0.55} />
          <stop offset="0.6" stopColor="#2a3242" stopOpacity={0.25} />
          <stop offset="1" stopColor="#1a2030" stopOpacity={0} />
        </radialGradient>
        <mask id="gw-mask"><rect x={-300} y={-40} width={600} height={960} fill="url(#gw-fade)" /></mask>
      </defs>
      <g mask="url(#gw-mask)">
        {/* soft lighter haze directly behind the figure for silhouette contrast */}
        
        {/* hair, back mass: falls from crown to near the ground */}
        <g transform="scale(0.6 1)"><path d={`M -26 6 C -54 40, -66 160, -70 330 C -74 520, ${-88 + h} 700, ${-70 + h} 880 L ${70 + h} 880 C ${86 + h} 700, 72 500, 66 320 C 60 160, 52 40, 26 6 Z`} fill="#0a0810" /></g>
        {/* body: long gown, extremely thin */}
        <path d="M -10 58 C -30 62, -42 72, -44 96 C -40 150, -26 220, -24 300 C -24 420, -32 560, -42 700 C -48 800, -54 860, -60 900 L 60 900 C 54 860, 48 800, 42 700 C 32 560, 24 420, 24 300 C 26 220, 40 150, 44 96 C 42 72, 30 62, 10 58 Z" fill="url(#gw-body)" />
        {/* left arm: long, hanging well past the knees, a gap of haze between arm and body */}
        <path d={`M -40 80 C -54 92, -60 120, -62 170 C -66 260, -72 360, -74 450 C -76 560, ${-78 + h * 0.4} 640, ${-76 + h * 0.4} 690 L ${-64 + h * 0.4} 690 C -64 620, -62 540, -62 450 C -60 360, -56 260, -52 180 C -50 130, -46 104, -34 94 Z`} fill="#120e1b" />
        {/* right arm */}
        <path d={`M 40 80 C 54 92, 60 120, 62 170 C 66 260, 72 360, 74 450 C 76 560, ${78 + h * 0.4} 640, ${76 + h * 0.4} 694 L ${64 + h * 0.4} 694 C 64 620, 62 540, 62 450 C 60 360, 56 260, 52 180 C 50 130, 46 104, 34 94 Z`} fill="#17121f" />
        {/* hands: long pale-ish fingers, barely visible */}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 70 + h * 0.4} 690)`} stroke="#4a4254" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.75}>
            <path d={`M ${-4 * sd} 0 C ${-6 * sd} 24, ${-4 * sd} 44, ${-6 * sd} 62`} />
            <path d={`M 0 0 C 0 26, ${2 * sd} 48, ${1 * sd} 70`} />
            <path d={`M ${4 * sd} 0 C ${6 * sd} 24, ${7 * sd} 42, ${8 * sd} 60`} />
            <path d={`M ${7 * sd} -4 C ${12 * sd} 14, ${12 * sd} 28, ${13 * sd} 40`} />
          </g>
        ))}
        {/* head + neck */}
        <path d="M -8 40 L -9 64 L 9 64 L 8 40 Z" fill="#141019" />
        <ellipse cx={0} cy={22} rx={19} ry={25} fill="#120e18" />
        {/* hair, front curtain over face and shoulders */}
        <path d={`M -24 4 C -6 -10, 14 -8, 26 6 C 38 50, 40 200, ${44 + h} 380 L ${28 + h} 380 C 24 220, 20 90, 6 30 C -4 70, -16 200, ${-28 + h} 430 L ${-46 + h} 430 C -40 220, -34 70, -24 4 Z`} fill="#07060b" />
        {/* hair strands (detail) */}
        <g fill="none" stroke="#0a0812" strokeWidth={2} transform="scale(0.6 1)" strokeLinecap="round">
          <path d={`M -64 380 C -72 520, ${-82 + h} 650, ${-96 + h * 1.4} 780`} />
          <path d={`M 62 360 C 70 500, ${80 + h} 640, ${94 + h * 1.4} 760`} />
          <path d={`M -72 300 C -84 380, ${-92 + h} 450, ${-104 + h * 1.5} 520`} />
        </g>
        {/* longer finger tips */}
        {[-1, 1].map((sd) => (
          <path key={`ft${sd}`} d={`M ${sd * 70 + h * 0.4} 752 C ${sd * 71 + h * 0.5} 780, ${sd * 72 + h * 0.6} 800, ${sd * 73 + h * 0.7} 816`} stroke="#4a4254" strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.6} />
        ))}
        {/* cool moon rim on the right edge only */}
        <g fill="none" stroke="#9fc0d8" strokeLinecap="round">
          <path d="M 22 2 C 32 40, 30 120, 34 220" strokeWidth={3} opacity={0.7} />
          <path d="M -22 6 C -8 -8, 12 -8, 24 4" strokeWidth={2.4} opacity={0.55} />
          <path d="M 26 6 C 34 40, 38 160, 40 320" strokeWidth={2.6} opacity={0.6} />
          <path d={`M 62 170 C 68 300, 74 420, ${76 + h * 0.4} 600`} strokeWidth={2.4} opacity={0.55} />
          <path d="M 12 58 C 32 62, 44 72, 52 100" strokeWidth={2.6} opacity={0.65} />
          
          <path d="M -12 58 C -28 64, -36 76, -38 100" strokeWidth={1.6} opacity={0.3} />
          <path d="M 18 12 C 20 18, 20 26, 18 36" strokeWidth={1.8} opacity={0.5} />
        </g>
      </g>
      {/* ground mist swallowing the hem */}
      <ellipse cx={0} cy={880} rx={260} ry={70} fill="url(#gw-haze)" />
    </g>
  );
};
