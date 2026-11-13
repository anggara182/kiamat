import React from 'react';

export const TC = {
  sky: '#06080f', conc: '#1c1f26', conc2: '#2a2e38', safety: '#e8c547', fluo: '#d9f0ff', fluoFall: '#5a7a96', red: '#ff4d4d',
  warm: '#fff3d6', warm2: '#f2dcae', warm3: '#c9a978', ext: '#b9c2cc', extShade: '#7d8794', band: '#4a5260',
  face: '#e8e4dc', faceShade: '#bdb6aa', cloth: '#15161c', near: '#05060a', mid: '#11131a',
};

/** One identical passenger, seated, facing camera. (x,y) = seat point (hips), s = scale (1 = ~260px head-to-seat). */
export const Passenger: React.FC<{ x: number; y: number; s: number; tilt?: number; eye?: number }> = ({ x, y, s, tilt = 0, eye = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* torso + shoulders */}
    <path d="M -78 0 C -84 -70 -80 -140 -62 -168 C -40 -184 40 -184 62 -168 C 80 -140 84 -70 78 0 Z" fill={TC.cloth} />
    {/* lapel fold */}
    <path d="M -10 -176 L 0 -110 L 10 -176" stroke="#24262f" strokeWidth={5} fill="none" />
    {/* hands on knees */}
    <ellipse cx={-34} cy={-6} rx={15} ry={10} fill={TC.faceShade} />
    <ellipse cx={34} cy={-6} rx={15} ry={10} fill={TC.faceShade} />
    {/* neck + head */}
    <rect x={-13} y={-200} width={26} height={30} fill={TC.faceShade} />
    <g transform={`rotate(${tilt} 0 -240)`}>
      <ellipse cx={0} cy={-240} rx={36} ry={46} fill={TC.face} />
      <path d="M 0 -286 A 36 46 0 0 1 0 -194 A 30 46 0 0 0 0 -286 Z" fill={TC.faceShade} opacity={0.7} />
      <path d="M -37 -246 C -40 -292 40 -292 37 -246 C 30 -270 -30 -270 -37 -246 Z" fill={TC.cloth} />
      <ellipse cx={-13} cy={-238} rx={6.5} ry={7.5 * eye} fill={TC.near} />
      <ellipse cx={13} cy={-238} rx={6.5} ry={7.5 * eye} fill={TC.near} />
    </g>
  </g>
);

/** Narrator from behind: young adult with backpack. (x,y)=feet centre, s scale (1 = ~1000px tall). */
export const Narrator: React.FC<{ x: number; y: number; s: number; rim?: string; rimO?: number }> = ({ x, y, s, rim = TC.warm, rimO = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -60 0 L -70 -420 C -110 -440 -150 -500 -150 -600 L -165 -800 C -160 -840 -120 -858 -70 -865 L -40 -870 C -38 -880 -50 -900 -55 -930 C -62 -1000 -30 -1030 0 -1030 C 30 -1030 62 -1000 55 -930 C 50 -900 38 -880 40 -870 L 70 -865 C 120 -858 160 -840 165 -800 L 150 -600 C 150 -500 110 -440 70 -420 L 60 0 L 15 0 L 8 -400 L -8 -400 L -15 0 Z"
      fill={TC.near}
    />
    {/* backpack */}
    <path d="M -95 -830 C -100 -860 100 -860 95 -830 L 105 -560 C 105 -530 -105 -530 -105 -560 Z" fill="#0c0d13" />
    <path d="M -80 -700 L 80 -700" stroke="#1a1c25" strokeWidth={8} />
    <path d="M -60 -845 C -90 -800 -100 -720 -96 -640" stroke="#1a1c25" strokeWidth={10} fill="none" />
    {/* rim light from the doors */}
    <g stroke={rim} strokeWidth={5} fill="none" opacity={rimO} strokeLinecap="round">
      <path d="M -40 -1010 C -60 -990 -62 -950 -55 -930" />
      <path d="M 40 -1010 C 60 -990 62 -950 55 -930" />
      <path d="M -165 -800 C -160 -840 -120 -858 -70 -865" />
      <path d="M 165 -800 C 160 -840 120 -858 70 -865" />
      <path d="M -150 -600 L -165 -800" opacity={0.6} />
      <path d="M 150 -600 L 165 -800" opacity={0.6} />
      <path d="M -95 -830 C -100 -860 100 -860 95 -830" opacity={0.7} />
    </g>
    {/* hair strands */}
    <g stroke="#1a1c25" strokeWidth={3} fill="none">
      <path d="M -20 -1025 C -30 -990 -35 -960 -38 -935" /><path d="M 10 -1028 C 15 -990 20 -960 22 -930" /><path d="M -2 -1030 C -5 -990 -4 -960 -6 -935" />
    </g>
  </g>
);

/** Side view of one carriage. x = left end, y = roof top, len length, h height (~460). door: 0..1 opening. */
export const Car: React.FC<{ x: number; y: number; len: number; h?: number; idp: string; faces?: boolean; door?: number }> = ({ x, y, len, h = 470, idp, faces = true, door = 0 }) => {
  const win: React.ReactNode[] = [];
  const nW = Math.floor(len / 230);
  for (let i = 0; i < nW; i++) {
    const wx = x + 40 + i * 230;
    const isDoor = i % 3 === 1;
    if (isDoor) {
      win.push(
        <g key={i}>
          <rect x={wx + 20} y={y + 70} width={150} height={h - 90} fill={TC.warm} />
          <rect x={wx + 20 - 75 * door} y={y + 70} width={75} height={h - 90} fill={TC.extShade} stroke={TC.band} strokeWidth={4} />
          <rect x={wx + 95 + 75 * door} y={y + 70} width={75} height={h - 90} fill={TC.extShade} stroke={TC.band} strokeWidth={4} />
          <rect x={wx + 34 - 75 * door} y={y + 100} width={48} height={150} rx={6} fill={`url(#${idp}win)`} />
          <rect x={wx + 109 + 75 * door} y={y + 100} width={48} height={150} rx={6} fill={`url(#${idp}win)`} />
        </g>,
      );
    } else {
      win.push(
        <g key={i}>
          <rect x={wx} y={y + 95} width={200} height={170} rx={10} fill={`url(#${idp}win)`} />
          {faces && [0, 1, 2].map((k) => (
            <g key={k}>
              <path d={`M ${wx + 30 + k * 62} ${y + 265} L ${wx + 34 + k * 62} ${y + 215} Q ${wx + 50 + k * 62} ${y + 200} ${wx + 66 + k * 62} ${y + 215} L ${wx + 70 + k * 62} ${y + 265} Z`} fill={TC.cloth} />
              <ellipse cx={wx + 50 + k * 62} cy={y + 182} rx={15} ry={19} fill={TC.face} />
              <circle cx={wx + 45 + k * 62} cy={y + 183} r={2.6} fill={TC.near} />
              <circle cx={wx + 55 + k * 62} cy={y + 183} r={2.6} fill={TC.near} />
            </g>
          ))}
        </g>,
      );
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${idp}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4dbe2" /><stop offset="0.5" stopColor={TC.ext} /><stop offset="1" stopColor="#6d7682" />
        </linearGradient>
        <linearGradient id={`${idp}win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor={TC.warm2} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={len} height={h} rx={26} fill={`url(#${idp}body)`} />
      <rect x={x} y={y + h - 150} width={len} height={44} fill={TC.band} />
      <rect x={x} y={y + h - 100} width={len} height={10} fill={TC.red} opacity={0.75} />
      <rect x={x} y={y + 8} width={len} height={18} fill="#e9eef3" opacity={0.6} />
      {win}
      <rect x={x} y={y + h} width={len} height={60} fill="#0b0c11" />
      {[0.12, 0.3, 0.7, 0.88].map((f) => <circle key={f} cx={x + len * f} cy={y + h + 50} r={34} fill="#07080c" />)}
    </g>
  );
};
