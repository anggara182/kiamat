import React from 'react';

/** Outside view: winter night, ridge, snowy pine trail. World coords 1296x2304. */
export const Outside: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="ho-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070b14" /><stop offset="0.45" stopColor="#152238" /><stop offset="0.6" stopColor="#24375a" />
      </linearGradient>
      <linearGradient id="ho-snow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7f93b0" /><stop offset="0.35" stopColor="#b9c8dc" /><stop offset="1" stopColor="#d6e0ec" />
      </linearGradient>
      <radialGradient id="ho-moon" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c9d6e6" stopOpacity="0.45" /><stop offset="1" stopColor="#c9d6e6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1296" height="2304" fill="url(#ho-sky)" />
    <ellipse cx="420" cy="560" rx="380" ry="300" fill="url(#ho-moon)" />
    <path d="M0 900 L180 760 L330 820 L520 640 L700 780 L880 700 L1060 820 L1296 720 L1296 1200 L0 1200Z" fill="#0c1220" />
    <path d="M520 640 L470 700 L505 690 L540 720 L575 690 L610 700Z M180 760 L150 800 L190 790 L215 805Z M880 700 L840 750 L880 740 L920 755Z" fill="#c9d6e6" opacity="0.8" />
    <path d="M0 1080 Q300 1010 640 1040 T1296 1000 L1296 2304 L0 2304Z" fill="url(#ho-snow)" />
    {/* trail */}
    <path d="M610 1045 Q560 1200 700 1400 T620 2304 L860 2304 Q820 1700 720 1400 Q640 1200 650 1045Z" fill="#7f93b0" opacity="0.55" />
    {/* pine rows */}
    {[[60, 1060, 1.0], [210, 1030, 0.8], [330, 1050, 1.1], [470, 1020, 0.7], [800, 1010, 0.75], [930, 1040, 1.15], [1070, 1010, 0.9], [1210, 1040, 1.2]].map(([x, y, s], i) => (
      <path key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#060a10"
        d="M0 -420 L-40 -300 L-20 -305 L-80 -170 L-40 -178 L-120 -20 L-60 -28 L-150 120 L-8 105 L-8 170 L8 170 L8 105 L150 120 L60 -28 L120 -20 L40 -178 L80 -170 L20 -305 L40 -300Z" />
    ))}
    {[[-40, 1300, 1.9], [1250, 1280, 2.0], [140, 1220, 1.3], [1120, 1200, 1.4]].map(([x, y, s], i) => (
      <path key={'n' + i} transform={`translate(${x} ${y}) scale(${s})`} fill="#060a10"
        d="M0 -420 L-40 -300 L-20 -305 L-80 -170 L-40 -178 L-120 -20 L-60 -28 L-150 120 L-8 105 L-8 170 L8 170 L8 105 L150 120 L60 -28 L120 -20 L40 -178 L80 -170 L20 -305 L40 -300Z" />
    ))}
  </g>
);

/** Kitchen doorway with the mother standing still (seen 3/4 from the side, facing left to the window). */
export const Kitchen: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="hk-glow" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#ffe2b0" /><stop offset="0.5" stopColor="#ffcf8f" /><stop offset="1" stopColor="#b8784a" />
      </radialGradient>
      <linearGradient id="hk-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffcf8f" stopOpacity="0.5" /><stop offset="1" stopColor="#ffcf8f" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="1296" height="2304" fill="#141820" />
    {/* doorway opening */}
    <rect x="560" y="520" width="560" height="1300" fill="url(#hk-glow)" />
    {/* kitchen cabinets, low detail */}
    <rect x="560" y="1240" width="560" height="580" fill="#a8683e" opacity="0.55" />
    <rect x="560" y="1220" width="560" height="26" fill="#ffe8c4" opacity="0.7" />
    <rect x="600" y="600" width="230" height="300" fill="#c88a55" opacity="0.4" />
    <ellipse cx="860" cy="560" rx="70" ry="20" fill="#fff4dc" />
    <path d="M560 1820 L1120 1820 L1296 2304 L360 2304Z" fill="url(#hk-floor)" />
    {/* door frame */}
    <rect x="530" y="490" width="34" height="1340" fill="#0d1016" /><rect x="1116" y="490" width="34" height="1340" fill="#0d1016" /><rect x="530" y="470" width="620" height="40" fill="#0d1016" />
    {/* mother silhouette, standing still, facing left */}
    <g transform="translate(830 0)">
      <path d="M-52 760 Q-60 690 -10 672 Q40 662 56 712 Q66 760 46 800 L40 840 L-30 846 Q-56 810 -52 760Z" fill="#1a1412" />
      <circle cx="30" cy="676" r="30" fill="#1a1412" />
      <path d="M-30 840 Q-96 856 -104 930 L-92 1180 Q-110 1480 -100 1740 L-40 1752 L-30 1700 L20 1700 L30 1752 L84 1740 Q92 1480 70 1180 L96 930 Q88 856 30 840Z" fill="#1a1412" />
      {/* apron */}
      <path d="M-58 960 L46 960 L64 1480 L-76 1480Z" fill="#3a2a22" /><path d="M46 1000 Q90 1010 96 1060" stroke="#5a4232" strokeWidth="6" fill="none" />
      <path d="M-96 880 Q-130 990 -114 1070 Q-84 1124 -10 1120 L-6 1094 Q-68 1092 -86 1056 Q-98 990 -76 900Z" fill="#1a1412" />
      <path d="M90 880 Q122 990 106 1070 Q76 1124 4 1120 L0 1094 Q62 1092 80 1056 Q90 990 70 900Z" fill="#1a1412" />
      <ellipse cx="-3" cy="1106" rx="24" ry="17" fill="#1a1412" />
      <path d="M-62 960 Q-10 940 48 960" stroke="#5a4232" strokeWidth="6" fill="none" />
      {/* warm rim on her right edge */}
      <path d="M56 712 Q66 760 46 800 M30 840 Q88 856 96 900 Q122 990 106 1070 M70 1180 Q92 1480 84 1740 M-104 930 L-92 1180" stroke="#ffd9a0" strokeWidth="5" fill="none" opacity="0.85" />
      <path d="M-52 760 Q-60 700 -14 674" stroke="#ffd9a0" strokeWidth="3" fill="none" opacity="0.5" />
    </g>
    {/* shadow of her on the floor */}
    <ellipse cx="830" cy="1772" rx="160" ry="22" fill="#2a1a10" opacity="0.6" />
  </g>
);
