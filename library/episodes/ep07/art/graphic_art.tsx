import React from 'react';

/** Surgical mask (front view), centred at 0,0, width ~w. Pleats + ear loops. */
export const MaskFront: React.FC<{ w?: number; loopDrop?: number; rim?: string; op?: number }> = ({ w = 300, loopDrop = 0, rim = '#a9c4e8', op = 1 }) => {
  const s = w / 300;
  return (
    <g transform={`scale(${s})`} opacity={op}>
      <defs>
        <linearGradient id="mfFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e3e7ec" />
          <stop offset="1" stopColor="#9aa3b0" />
        </linearGradient>
      </defs>
      {/* ear loops */}
      <path d={`M-148 -50 C-205 -60 -215 40 -150 52`} fill="none" stroke="#d8dde4" strokeWidth={5} />
      <path d={`M148 -50 C205 -60 ${215} ${40 + loopDrop * 0.6} ${150 + loopDrop * 0.2} ${52 + loopDrop}`} fill="none" stroke="#d8dde4" strokeWidth={5} />
      {/* body */}
      <path d="M-150 -62 Q0 -86 150 -62 L156 58 Q0 96 -156 58 Z" fill="url(#mfFill)" />
      {/* pleats */}
      {[-30, 2, 34].map((y, i) => (
        <path key={i} d={`M-152 ${y} Q0 ${y + 14 + i * 4} 152 ${y}`} fill="none" stroke="#8d97a5" strokeWidth={4} opacity={0.7} />
      ))}
      {[-28, 4, 36].map((y, i) => (
        <path key={'h' + i} d={`M-150 ${y + 5} Q0 ${y + 19 + i * 4} 150 ${y + 5}`} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.8} />
      ))}
      {/* nose wire */}
      <path d="M-60 -70 Q0 -84 60 -70" fill="none" stroke="#c4ccd6" strokeWidth={4} />
      {/* rim */}
      <path d="M-150 -62 Q0 -86 150 -62" fill="none" stroke={rim} strokeWidth={3} opacity={0.9} />
    </g>
  );
};

/** Tall masked woman in profile facing left. Origin = feet centre; height ~ h. */
export const WomanProfile: React.FC<{ h?: number; light?: number }> = ({ h = 1300, light = 1 }) => {
  const s = h / 1300;
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id="wpCoat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b352c" />
          <stop offset="0.35" stopColor="#1d1a16" />
          <stop offset="1" stopColor="#0d0c0b" />
        </linearGradient>
        <linearGradient id="wpHair" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1b22" />
          <stop offset="1" stopColor="#060609" />
        </linearGradient>
      </defs>
      {/* coat: long trench, belted, flared hem */}
      <path d="M-70 -1060 C-110 -1030 -120 -960 -115 -880 L-128 -560 C-150 -380 -175 -160 -190 -20 L120 -20 C110 -200 100 -420 92 -600 L96 -900 C92 -1000 60 -1060 10 -1075 Z" fill="url(#wpCoat)" />
      {/* belt */}
      <path d="M-127 -600 L93 -590 L92 -560 L-130 -572 Z" fill="#0a0a0b" />
      <path d="M-134 -585 L-170 -470 L-150 -468 L-120 -575 Z" fill="#141210" />
      {/* collar lapel */}
      <path d="M-70 -1062 L-40 -930 L-10 -1050 Z" fill="#2c2721" />
      {/* arm */}
      <path d="M-60 -990 C-80 -880 -82 -760 -70 -640 L-40 -630 C-44 -760 -40 -880 -20 -980 Z" fill="#14120f" />
      <path d="M-74 -640 C-80 -600 -72 -575 -55 -575 C-44 -590 -40 -615 -42 -632 Z" fill="#b8aea6" opacity={0.85 * light} />
      {/* coat fold lines */}
      <path d="M-120 -540 C-140 -360 -150 -200 -160 -40" fill="none" stroke="#4a4236" strokeWidth={3} opacity={0.6 * light} />
      <path d="M-40 -540 C-50 -360 -60 -200 -60 -30" fill="none" stroke="#000" strokeWidth={4} opacity={0.4} />
      {/* legs/shoes */}
      <path d="M-120 -22 L-118 0 L-60 0 L-62 -22 Z" fill="#050506" />
      <path d="M20 -22 L22 0 L80 0 L78 -22 Z" fill="#050506" />
      {/* neck */}
      <path d="M-40 -1080 L-30 -1130 L20 -1130 L22 -1078 Z" fill="#a89f97" />
      {/* head */}
      <ellipse cx={-8} cy={-1190} rx={62} ry={78} fill="#cfc5bc" />
      <path d="M-66 -1196 L-92 -1172 L-74 -1168 Z" fill="#cfc5bc" />
      {/* mask on lower face (profile) */}
      <path d="M-78 -1175 C-82 -1150 -76 -1125 -52 -1112 L10 -1110 L18 -1170 Z" fill="#eef0f2" />
      <path d="M-78 -1175 C-82 -1150 -76 -1125 -52 -1112" fill="none" stroke="#ffffff" strokeWidth={4} />
      <path d="M-70 -1160 L14 -1150 M-66 -1137 L14 -1132" stroke="#a8b0bb" strokeWidth={2.5} />
      <path d="M14 -1168 C40 -1180 46 -1140 16 -1115" fill="none" stroke="#dfe3e8" strokeWidth={3} />
      {/* eye shadow under fringe */}
      <path d="M-70 -1215 L-30 -1208 L-34 -1195 L-68 -1196 Z" fill="#2a262a" />
      {/* hair: fringe + long straight curtain down the back */}
      <path d="M-74 -1200 C-80 -1260 -40 -1285 0 -1282 C60 -1280 85 -1230 82 -1160 C86 -980 95 -800 104 -640 L40 -640 C40 -800 30 -980 26 -1090 C20 -1160 -10 -1200 -40 -1205 Z" fill="url(#wpHair)" />
      {/* hair strands */}
      {[46, 60, 74, 88].map((x, i) => (
        <path key={i} d={`M${x - 40} -1240 C${x} -1100 ${x + 6} -900 ${x + 10 + i * 2} ${-660 - i * 14}`} fill="none" stroke="#2d2f3a" strokeWidth={2} opacity={0.7} />
      ))}
      {/* cold rim light on the front edge (light from upper-left) */}
      <path d="M-74 -1200 C-80 -1260 -40 -1285 0 -1282" fill="none" stroke="#a9c4e8" strokeWidth={4} opacity={0.9 * light} />
      <path d="M-70 -1060 C-110 -1030 -120 -960 -115 -880 L-128 -560 C-150 -380 -175 -160 -190 -20" fill="none" stroke="#a9c4e8" strokeWidth={4} opacity={0.75 * light} />
      <path d="M-70 -1215 C-82 -1190 -84 -1160 -78 -1130" fill="none" stroke="#e8f1ff" strokeWidth={3} opacity={0.6 * light} />
    </g>
  );
};

/** Long pale hand reaching in from the right, fingertips pinching at origin. */
export const PaleHand: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="phSkin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e9e1d9" />
        <stop offset="0.5" stopColor="#c9beb4" />
        <stop offset="1" stopColor="#5b534d" />
      </linearGradient>
    </defs>
    {/* wrist + sleeve */}
    <path d="M150 140 C260 170 380 240 520 330 L560 230 C430 160 300 90 190 60 Z" fill="url(#phSkin)" />
    <path d="M480 300 C540 330 620 380 700 430 L760 290 C680 240 600 210 520 190 Z" fill="#1d1a16" />
    <path d="M520 190 L480 300" stroke="#a9c4e8" strokeWidth={3} opacity={0.5} />
    {/* back of hand */}
    <path d="M40 20 C60 -10 120 -10 190 60 L150 140 C100 120 60 90 30 70 Z" fill="url(#phSkin)" />
    {/* long fingers: index & middle over the mask edge, thumb behind */}
    <path d="M40 20 C10 0 -40 -14 -96 -22 C-112 -24 -116 -10 -102 -4 C-50 6 0 30 34 54 Z" fill="#ddd3ca" />
    <path d="M36 52 C0 50 -50 46 -104 46 C-120 48 -118 62 -102 64 C-50 68 0 74 34 82 Z" fill="#d2c7bd" />
    <path d="M34 82 C0 90 -40 100 -84 108 C-98 112 -94 126 -80 124 C-36 120 6 114 40 106 Z" fill="#c4b9af" />
    <path d="M60 -6 C30 -40 -10 -60 -46 -66 C-58 -66 -58 -52 -48 -48 C-14 -38 20 -16 44 10 Z" fill="#cfc4ba" />
    {/* nails */}
    <path d="M-100 -20 C-110 -18 -112 -8 -102 -6" fill="none" stroke="#f4eee8" strokeWidth={3} />
    <path d="M-104 48 C-114 50 -114 60 -104 62" fill="none" stroke="#f4eee8" strokeWidth={3} />
    {/* knuckle creases */}
    <path d="M-30 -10 Q-26 -2 -32 4 M-40 48 Q-36 56 -42 62 M-20 100 Q-16 108 -22 114" stroke="#8f847b" strokeWidth={2} fill="none" />
    {/* rim light along top edges */}
    <path d="M60 -6 C30 -40 -10 -60 -46 -66" fill="none" stroke="#e8f1ff" strokeWidth={3} opacity={0.9} />
    <path d="M40 20 C10 0 -40 -14 -96 -22" fill="none" stroke="#e8f1ff" strokeWidth={2.5} opacity={0.8} />
    <path d="M190 60 C300 90 430 160 560 230" fill="none" stroke="#a9c4e8" strokeWidth={3} opacity={0.7} />
  </g>
);
