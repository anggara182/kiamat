import React from 'react';

/* HERO art for set "home" (owner H). Detailed: silhouette + 2-3 tones + rim + telling details. */

/** Shot 4: grandma's wrinkled hands, dented wok (wajan), metal ladle, kebaya sleeve. Local origin = wok centre. */
export const GrandmaWok: React.FC<{ lamp: number; tap: number }> = ({ lamp, tap }) => (
  <g>
    <defs>
      <linearGradient id="hw-wok" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a4048" /><stop offset="0.5" stopColor="#24202a" /><stop offset="1" stopColor="#100d14" />
      </linearGradient>
      <radialGradient id="hw-inner" cx="0.35" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#6a5a52" /><stop offset="0.6" stopColor="#2a2228" /><stop offset="1" stopColor="#151118" />
      </radialGradient>
      <linearGradient id="hw-skin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#c08860" /><stop offset="0.55" stopColor="#8e5c42" /><stop offset="1" stopColor="#5a3a2e" />
      </linearGradient>
      <linearGradient id="hw-sleeve" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3a2a3e" /><stop offset="0.6" stopColor="#5a4560" /><stop offset="1" stopColor="#2a1e2e" />
      </linearGradient>
      <linearGradient id="hw-ladle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9a9aa4" /><stop offset="0.5" stopColor="#e8e2d6" /><stop offset="1" stopColor="#5a5a66" />
      </linearGradient>
    </defs>
    {/* wok: outer bowl seen from 3/4 above */}
    <ellipse cx={0} cy={0} rx={300} ry={190} fill="url(#hw-wok)" />
    <ellipse cx={0} cy={-6} rx={278} ry={170} fill="url(#hw-inner)" />
    {/* rim highlight from the lamp (upper left) */}
    <path d="M -290 -20 C -250 -150, 120 -210, 260 -90" stroke="#ffd08a" strokeWidth={6} fill="none" opacity={0.55 + 0.35 * lamp} strokeLinecap="round" />
    <path d="M -298 -10 C -280 -120, -60 -196, 120 -186" stroke="#fff2cc" strokeWidth={3} fill="none" opacity={0.5 + 0.5 * lamp} strokeLinecap="round" />
    <path d="M 296 -6 C 290 90, 120 186, -60 190" stroke="#ffb35c" strokeWidth={2} fill="none" opacity={0.18} />
    {/* the dent */}
    <path d="M 90 40 C 130 20, 175 45, 160 85 C 140 110, 95 100, 90 40 Z" fill="#0d0a10" opacity={0.7} />
    <path d="M 96 42 C 128 30, 160 48, 158 72" stroke="#ffb35c" strokeWidth={3} fill="none" opacity={0.6 * lamp + 0.2} />
    <path d="M 100 56 C 120 66, 140 78, 150 96" stroke="#0a0810" strokeWidth={4} fill="none" opacity={0.8} />
    <path d="M 112 50 C 124 54, 134 60, 140 70" stroke="#fff2cc" strokeWidth={1.6} fill="none" opacity={0.7 * lamp} />
    {/* soot ring + worn spot */}
    <ellipse cx={-40} cy={10} rx={120} ry={70} fill="none" stroke="#0d0a10" strokeWidth={10} opacity={0.35} />
    <ellipse cx={-90} cy={-50} rx={60} ry={26} fill="#ffb35c" opacity={0.18 + 0.15 * lamp} />
    {/* side handles (wooden) */}
    <path d="M -300 -10 C -350 -20, -380 0, -350 24 L -296 20 Z" fill="#3a2418" />
    <path d="M 300 -10 C 350 -20, 380 0, 350 24 L 296 20 Z" fill="#2a1a12" />

    {/* LEFT hand gripping the wok rim (sleeve from lower left) */}
    <g transform="translate(-300 40) rotate(-12)">
      <path d="M -260 260 C -200 160, -120 80, -40 40 L 30 120 C -40 170, -110 250, -150 330 Z" fill="url(#hw-sleeve)" />
      <path d="M -40 40 L 30 120" stroke="#c9a96a" strokeWidth={6} opacity={0.7} />
      {/* lace edge of kebaya cuff */}
      <path d={`M -46 30 ${Array.from({ length: 7 }, (_, i) => `q ${4 + 9} ${-2 + 6} ${11} ${13}`).join(' ')}`} stroke="#efe2c4" strokeWidth={3} fill="none" opacity={0.85} />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-38 + i * 11} cy={40 + i * 13} r={3.2} fill="none" stroke="#efe2c4" strokeWidth={1.6} opacity={0.65} />)}
      <path d="M -20 70 C 20 20, 70 -20, 110 -30 C 140 -36, 150 -10, 130 4 C 150 0, 170 20, 150 40 C 170 44, 172 70, 146 76 C 120 100, 70 130, 30 120 Z" fill="url(#hw-skin)" />
      {/* knuckle wrinkles */}
      {[[100, -14], [126, 14], [132, 52]].map(([x, y], i) => (
        <g key={i} stroke="#4a2e24" strokeWidth={2} fill="none" opacity={0.75}>
          <path d={`M ${x - 10} ${y - 4} q 8 6 18 0`} /><path d={`M ${x - 8} ${y + 2} q 7 5 15 0`} /><path d={`M ${x - 6} ${y + 8} q 6 4 12 0`} />
        </g>
      ))}
      {/* fingers curled over the rim + thumb */}
      {[[104, -40, -20], [136, -8, 0], [146, 30, 14], [140, 66, 26]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M -10 -14 C 20 -22, 46 -12, 52 6 C 54 18, 44 22, 34 16 L -6 14 Z" fill="url(#hw-skin)" stroke="#3a241c" strokeWidth={1.5} />
          <path d="M 40 -4 q 6 6 2 14" stroke="#e8c8a0" strokeWidth={2} fill="none" opacity={0.5} />
        </g>
      ))}
      <path d="M 0 70 C 20 110, 60 132, 100 128 C 116 126, 118 110, 104 106 C 74 104, 46 92, 30 74 Z" fill="#8e5c42" stroke="#3a241c" strokeWidth={1.5} />
      <path d="M 10 80 C 40 70, 70 64, 96 70" stroke="#4a2e24" strokeWidth={2} fill="none" opacity={0.6} />
      <path d="M 14 96 C 46 88, 74 86, 100 92" stroke="#4a2e24" strokeWidth={1.6} fill="none" opacity={0.5} />
      <path d="M 30 60 C 50 50, 70 60, 90 54" stroke="#3a6070" strokeWidth={3} fill="none" opacity={0.35} />
      {/* rim light */}
      <path d="M -20 70 C 20 20, 70 -20, 110 -30" stroke="#ffd08a" strokeWidth={4} fill="none" opacity={0.5 + 0.4 * lamp} strokeLinecap="round" />
    </g>

    {/* RIGHT hand with metal ladle, tapping the rim */}
    <g transform={`translate(230 -120) rotate(${-18 + tap * 10})`}>
      <path d="M -40 -20 L -300 -260" stroke="url(#hw-ladle)" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-30} cy={-10} rx={52} ry={34} fill="#6a6a74" transform="rotate(40 -30 -10)" />
      <ellipse cx={-34} cy={-16} rx={38} ry={22} fill="#2a2a32" transform="rotate(40 -34 -16)" />
      <path d="M -70 -30 C -50 -50, -10 -44, 6 -24" stroke="#ffd08a" strokeWidth={3} fill="none" opacity={0.7 * lamp + 0.2} />
      <g transform="translate(-230 -200)">
        <path d="M 200 220 C 260 200, 320 230, 360 300 L 260 360 C 230 310, 200 280, 160 260 Z" fill="url(#hw-sleeve)" transform="translate(-10 0)" />
        <path d={`M 150 260 ${Array.from({ length: 5 }, () => 'q 10 -16 22 -10').join(' ')}`} stroke="#efe2c4" strokeWidth={3} fill="none" opacity={0.6} transform="translate(-6 -4)" />
        <path d="M -40 -30 C -14 -58, 34 -54, 54 -30 L 60 54 C 46 84, 0 92, -24 72 C -50 50, -56 0, -40 -30 Z" fill="url(#hw-skin)" transform="translate(150 180)" />
        <g transform="translate(150 180)" stroke="#4a2e24" strokeWidth={2} fill="none" opacity={0.75}>
          <path d="M 40 -34 q 8 6 16 0" /><path d="M 42 -26 q 7 5 14 0" />
          <path d="M 64 8 q 8 6 16 0" /><path d="M 66 16 q 7 5 14 0" />
          <path d="M 50 58 q 8 6 16 0" /><path d="M 52 66 q 7 5 14 0" />
          <path d="M -20 0 C 0 20, 20 30, 40 34" opacity={0.5} />
          <path d="M -24 20 C -4 40, 16 50, 36 54" opacity={0.4} />
        </g>
        {/* fingers wrapped around the ladle handle + thumb on top */}
        <g transform="translate(150 180)">
          {[[56, -46, -36], [90, -10, -12], [90, 32, 12], [64, 74, 36]].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M -10 -12 C 20 -18, 50 -10, 56 6 C 58 18, 46 20, 36 14 L -6 12 Z" fill="url(#hw-skin)" stroke="#2a1812" strokeWidth={2.5} />
              <path d="M 22 -10 q 4 10 0 20" stroke="#4a2e24" strokeWidth={1.5} fill="none" opacity={0.7} />
            </g>
          ))}
          <path d="M -40 -40 C -20 -80, 20 -96, 50 -84 C 62 -78, 56 -64, 44 -66 C 20 -64, 0 -50, -14 -30 Z" fill="#a8704e" stroke="#3a241c" strokeWidth={1.5} />
          <path d="M -10 30 C 10 24, 24 40, 40 36" stroke="#3a6070" strokeWidth={3} fill="none" opacity={0.35} />
        </g>
        <path d="M 110 140 C 140 110, 190 120, 210 150" transform="translate(0 0)" stroke="#ffd08a" strokeWidth={4} fill="none" opacity={0.5 + 0.4 * lamp} strokeLinecap="round" />
      </g>
    </g>
  </g>
);

/** Shot 10: small boy (~7) in a sarong, curled asleep. Origin = hip. breath 0..1 */
export const SleepingBoy: React.FC<{ breath: number }> = ({ breath }) => (
  <g>
    <defs>
      <linearGradient id="hb-sarong" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7a5a6a" /><stop offset="1" stopColor="#3e2e3c" />
      </linearGradient>
      <pattern id="hb-check" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
        <rect width="28" height="28" fill="#8a4a50" />
        <rect width="14" height="28" fill="#6a3440" opacity={0.7} />
        <rect width="28" height="14" fill="#6a3440" opacity={0.5} />
        <path d="M 0 0 L 28 0 M 0 14 L 28 14" stroke="#e8c890" strokeWidth={2} opacity={0.55} />
      </pattern>
      <linearGradient id="hb-skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b88a6c" /><stop offset="1" stopColor="#6e4c3e" />
      </linearGradient>
    </defs>
    <ellipse cx={-10} cy={58} rx={190} ry={22} fill="#3a4238" opacity={0.45} />
    {/* sarong over curled legs */}
    <path d="M -30 -40 C 40 -70, 130 -40, 140 10 C 150 50, 90 60, 40 56 L -60 56 C -80 20, -70 -20, -30 -40 Z" fill="url(#hb-check)" />
    <path d="M -30 -40 C 40 -70, 130 -40, 140 10 C 150 50, 90 60, 40 56 L -60 56 C -80 20, -70 -20, -30 -40 Z" fill="url(#hb-sarong)" opacity={0.35} />
    <path d="M -30 -40 C 40 -70, 130 -40, 140 10" stroke="#f0d8a8" strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M 0 -44 C 20 -10, 16 30, 4 54" stroke="#3e2430" strokeWidth={2} fill="none" opacity={0.45} />
    <path d="M 90 -30 C 110 0, 110 30, 96 52" stroke="#3e2430" strokeWidth={2} fill="none" opacity={0.45} />
    <path d="M 40 -52 C 70 -20, 80 20, 60 54" stroke="#3e2430" strokeWidth={2.5} fill="none" opacity={0.6} />
    {/* bare feet, toes */}
    <path d="M 126 30 C 160 28, 186 42, 180 58 L 124 58 Z" fill="url(#hb-skin)" />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={176 - i * 1} cy={36 + i * 6} r={4} fill="#a87a5e" />)}
    <path d="M 128 36 C 150 36, 168 40, 176 48" stroke="#f0c8a0" strokeWidth={2} fill="none" opacity={0.6} />
    {/* torso (breathing) */}
    <g transform={`translate(-60 0) scale(1 ${1 + 0.03 * breath})`}>
      <path d="M 30 -40 C -20 -60, -90 -50, -110 -10 C -120 30, -90 56, -40 56 L 20 56 C 30 20, 40 -10, 30 -40 Z" fill="#d8cfc0" />
      <path d="M 30 -40 C -20 -60, -90 -50, -110 -10" stroke="#f4eee2" strokeWidth={4} fill="none" opacity={0.8} />
    </g>
    {/* head resting on arm */}
    <path d="M -190 44 C -200 20, -160 10, -120 20 L -100 50 Z" fill="url(#hb-skin)" />
    <circle cx={-190} cy={6} r={42} fill="url(#hb-skin)" />
    <path d="M -230 -4 C -226 -40, -170 -50, -150 -20 C -160 -34, -200 -30, -210 -10 Z" fill="#1a1418" />
    <path d="M -218 -10 C -230 6, -228 30, -214 40" fill="#1a1418" />
    <path d="M -196 14 q 8 4 14 0" stroke="#3a2620" strokeWidth={2.4} fill="none" />
    {/* small hand tucked under cheek, fingers */}
    <path d="M -200 46 C -190 34, -160 30, -140 36 C -130 40, -132 50, -142 52 L -196 56 Z" fill="#b88a6c" stroke="#5a3a2e" strokeWidth={1.4} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-176 + i * 12} 40 l 4 13`} stroke="#5a3a2e" strokeWidth={1.4} />)}
    <path d="M -160 36 C -150 30, -140 32, -138 38" stroke="#f4eee2" strokeWidth={1.6} fill="none" opacity={0.7} />
    <path d="M -230 -4 C -226 -40, -170 -50, -150 -20" stroke="#f4eee2" strokeWidth={2} fill="none" opacity={0.6} />
  </g>
);

/** Shot 11: a woman's pair of sandals (selop), one upright, one tipped over. Origin = between them. */
export const Sandals: React.FC = () => {
  const sole = (
    <path d="M 0 -150 C 60 -150, 78 -90, 70 -20 C 64 50, 70 110, 40 150 C 10 175, -30 170, -48 140 C -66 100, -60 40, -66 -20 C -72 -100, -54 -150, 0 -150 Z" />
  );
  return (
    <g>
      <defs>
        <linearGradient id="hs-sole" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a5a3a" /><stop offset="1" stopColor="#4a2e20" />
        </linearGradient>
        <linearGradient id="hs-strap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a2a30" /><stop offset="0.5" stopColor="#b24a48" /><stop offset="1" stopColor="#5a1e24" />
        </linearGradient>
      </defs>
      {/* upright sandal */}
      <g transform="translate(-130 0) rotate(-10)">
        <ellipse cx={4} cy={14} rx={80} ry={168} fill="#3a4238" opacity={0.5} />
        <g fill="#2a1a12" transform="translate(0 12)">{sole}</g>
        <g fill="url(#hs-sole)">{sole}</g>
        <path d="M -20 -110 C 0 -120, 30 -100, 40 -80" stroke="#3a2418" strokeWidth={3} fill="none" opacity={0.6} />
        <ellipse cx={-4} cy={-60} rx={34} ry={18} fill="#3a2418" opacity={0.35} />
        <path d="M -70 -50 C -50 -110, 50 -110, 72 -50 L 60 -20 C 30 -60, -30 -60, -58 -20 Z" fill="url(#hs-strap)" />
        <path d="M -62 -48 C -40 -96, 40 -96, 64 -48" stroke="#e8a090" strokeWidth={3} fill="none" opacity={0.6} />
        <path d="M 0 -150 C -54 -150, -72 -100, -66 -20" stroke="#f4f1e0" strokeWidth={4} fill="none" opacity={0.55} />
        {[-36, -12, 12, 36].map((x, i) => <circle key={i} cx={x} cy={-74 + Math.abs(x) * 0.4} r={3.5} fill="#e8d4a0" />)}
      </g>
      {/* tipped-over sandal, lying on its side showing the sole edge */}
      <g transform="translate(150 40) rotate(62)">
        <g fill="#2a1a12" transform="translate(0 -6) scale(1 1)">
          <path d="M 0 -150 C 60 -150, 78 -90, 70 -20 C 64 50, 70 110, 40 150 L 20 150 C 40 110, 34 50, 40 -20 C 48 -90, 30 -140, 0 -150 Z" />
        </g>
        <g transform="scale(0.45 1)" fill="url(#hs-sole)">{sole}</g>
        <path d="M 14 -60 C 70 -80, 90 -30, 60 -10" stroke="url(#hs-strap)" strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M 18 -64 C 64 -80, 84 -40, 66 -20" stroke="#e8a090" strokeWidth={3} fill="none" opacity={0.6} />
        <path d="M -30 -140 C -30 -50, -28 50, -20 150" stroke="#c9ccd6" strokeWidth={3} fill="none" opacity={0.5} />
      </g>
    </g>
  );
};
