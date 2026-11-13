import React from 'react';

/** Panel button centre (world coords) for floor n (matches lift/panel band). */
export const btn = (n: number) => {
  const i = n - 1, col = i % 2, row = 4 - Math.floor(i / 2);
  return { x: 520 + col * 260, y: 720 + row * 230 };
};

/** Lit button overlay. */
export const LitBtn: React.FC<{ n: number; a: number }> = ({ n, a }) => {
  const { x, y } = btn(n);
  return (
    <g opacity={a}>
      <circle cx={x} cy={y} r="140" fill="url(#lbglow)" />
      <circle cx={x} cy={y} r="66" fill="none" stroke="#ffb000" strokeWidth="10" />
      <text x={x} y={y + 22} textAnchor="middle" fontSize="64" fontFamily="Oswald, sans-serif" fill="#ffb000">{n}</text>
    </g>
  );
};

export const LiftDefs: React.FC = () => (
  <defs>
    <radialGradient id="lbglow"><stop offset="0" stopColor="#ffb000" stopOpacity="0.45" /><stop offset="1" stopColor="#ffb000" stopOpacity="0" /></radialGradient>
    <linearGradient id="lskin" x1="0" x2="1"><stop offset="0" stopColor="#8f7563" /><stop offset="0.5" stopColor="#c9ab94" /><stop offset="1" stopColor="#7a6252" /></linearGradient>
    <linearGradient id="lhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07090d" /><stop offset="1" stopColor="#0d1016" /></linearGradient>
    <linearGradient id="lrefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7b8794" stopOpacity="0" /><stop offset="0.5" stopColor="#7b8794" stopOpacity="0.35" /><stop offset="1" stopColor="#7b8794" stopOpacity="0" /></linearGradient>
  </defs>
);

/** Amber floor readout. */
export const Readout: React.FC<{ x: number; y: number; text: string; up?: number; size?: number }> = ({ x, y, text, up = 0, size = 150 }) => (
  <g>
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontFamily="Oswald, sans-serif" fill="#ffb000">{text}</text>
    {up > 0 && <path d={`M${x - size * 0.75} ${y - size * 0.25} l${size * 0.22} ${-size * 0.32} l${size * 0.22} ${size * 0.32}z`} fill="#ffb000" opacity={up} />}
  </g>
);

/** Index finger + hand + hoodie sleeve, fingertip at (x,y), coming from lower right. */
export const Hand: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(-38) scale(${1 - press * 0.04})`}>
    <rect x="-34" y="-10" width="68" height="300" rx="34" fill="url(#lskin)" />
    <path d="M-60 250 Q-90 330 -70 470 L170 520 Q200 380 150 270 Q110 230 40 240 Z" fill="url(#lskin)" />
    <rect x="30" y="250" width="58" height="160" rx="29" fill="#8a705e" />
    <path d="M-120 430 Q40 400 230 470 L300 1100 L-160 1100 Z" fill="#14171d" />
    <path d="M-120 430 Q40 400 230 470" fill="none" stroke="#262b33" strokeWidth="18" />
  </g>
);

/** The woman: back turned, long black hair, dark coat, head lowered. Feet at (0,0), height ~ 1000*s. turn 0..1 = head turning. */
export const Woman: React.FC<{ x: number; y: number; s?: number; turn?: number }> = ({ x, y, s = 1, turn = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 -660 Q-170 -300 -130 0 L130 0 Q170 -300 150 -660 Q100 -720 0 -725 Q-100 -720 -150 -660Z" fill="#0b0d12" />
    <rect x="-110" y="-10" width="80" height="18" rx="9" fill="#050608" />
    <rect x="30" y="-10" width="80" height="18" rx="9" fill="#050608" />
    {/* head: hair, then a pale face strip revealed inside the head outline as she turns (no features) */}
    <ellipse cx="-6" cy="-860" rx="88" ry="108" fill="url(#lhair)" />
    <clipPath id="lwhead"><ellipse cx="-6" cy="-860" rx="88" ry="108" /></clipPath>
    <g clipPath="url(#lwhead)">
      <ellipse cx="40" cy="-835" rx="60" ry="92" fill="#e6e1d9" opacity={Math.min(1, turn * 1.5)} />
      <ellipse cx={-6 - turn * 62} cy="-866" rx="92" ry="116" fill="url(#lhair)" />
    </g>
    <path d={`M-92 -880 Q-140 -600 -124 -372 L-100 -350 L-80 -366 L-56 -342 L-30 -362 L-6 -338 L22 -360 L48 -340 L74 -364 L96 -346 L112 -368 Q140 -600 ${86 - turn * 14} -800Z`} fill="url(#lhair)" />
    {/* long strands catching a faint highlight */}
    {Array.from({ length: 16 }, (_, k) => {
      const x0 = -96 + k * 12.5, x1 = -118 + k * 15, c = x0 * 1.25;
      const y0 = x0 < 24 ? -955 + (x0 * x0) / 90 : -770;
      return <path key={k} d={`M${x0 * 0.8} ${y0} Q${c} -560 ${x1} -${352 + (k % 4) * 9}`} stroke={k % 3 === 0 ? '#5c6674' : '#262d38'} strokeWidth={k % 3 === 0 ? 3 : 2} fill="none" opacity={k % 3 === 0 ? 0.55 : 0.8} />;
    })}
    <path d="M-80 -930 Q-40 -962 10 -966" stroke="#6b7684" strokeWidth="5" fill="none" opacity="0.45" strokeLinecap="round" />
    <path d="M-150 -656 Q-120 -700 -96 -712 M150 -656 Q130 -700 104 -714" stroke="#5c6674" strokeWidth="4" fill="none" opacity="0.4" />
  </g>
);

/** Narrator from behind: hood + shoulders, centred at (x,y) = top of hood. */
export const Narrator: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-330 900 Q-330 380 -190 300 Q-120 250 -110 120 Q-120 0 0 -10 Q120 0 110 120 Q120 250 190 300 Q330 380 330 900Z" fill="#07090d" />
    <path d="M-100 140 Q0 220 100 140" fill="none" stroke="#1d222a" strokeWidth="8" />
    <path d="M-110 120 Q-120 0 0 -10 Q120 0 110 120" fill="none" stroke="#3a424c" strokeWidth="5" opacity="0.7" />
  </g>
);

/** Narrator full body from behind (hoodie). (x,y) = feet; height ~940*s. */
export const NarratorFull: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* jeans: weight on the left leg, right leg relaxed and slightly out, small gap */}
    <path d="M-120 -430 Q-122 -220 -98 -36 L-38 -36 Q-30 -220 -8 -400 Z" fill="#121822" />
    <path d="M-4 -400 Q30 -220 48 -40 L106 -46 Q96 -230 112 -430 Z" fill="#0f141c" />
    <path d="M-70 -380 Q-74 -230 -66 -60" stroke="#1f2733" strokeWidth="4" fill="none" opacity="0.7" />
    <path d="M-104 -40 Q-108 -4 -60 2 Q-20 4 -30 -36 Z" fill="#050608" />
    <path d="M42 -44 Q36 -6 86 -2 Q124 0 112 -48 Z" fill="#050608" />
    {/* right arm hanging, hand visible */}
    <path d="M150 -748 Q196 -640 190 -500 Q186 -470 160 -470 Q150 -600 118 -700 Z" fill="#0a0d12" />
    <path d="M160 -476 Q156 -430 176 -414 Q198 -420 194 -480 Z" fill="#3a302a" />
    {/* hoodie body: left shoulder dropped, hem band */}
    <path d="M-176 -742 Q-190 -600 -168 -410 Q-60 -392 0 -394 Q70 -394 150 -414 Q170 -560 162 -708 Q140 -760 70 -776 L-60 -774 Q-150 -768 -176 -742 Z" fill="#0b0e13" />
    <path d="M-168 -432 Q-60 -412 0 -414 Q70 -414 150 -434 L150 -414 Q70 -394 0 -394 Q-60 -392 -168 -410 Z" fill="#161b23" />
    {/* left arm bent, hand in the hoodie pocket */}
    <path d="M-176 -742 Q-214 -640 -196 -520 Q-170 -470 -110 -488 Q-140 -540 -150 -620 Z" fill="#090b10" />
    <path d="M-150 -560 Q-120 -600 -100 -680 M30 -700 Q60 -600 50 -470 M-40 -720 Q-60 -620 -50 -520" stroke="#1a1f28" strokeWidth="4" fill="none" opacity="0.8" />
    {/* hood, draped onto the upper back */}
    <path d="M-108 -786 Q-122 -890 -66 -946 Q-10 -984 4 -976 Q66 -970 108 -904 Q122 -850 100 -784 Q78 -716 8 -684 Q-80 -712 -108 -786 Z" fill="#0d1117" />
    <path d="M4 -974 Q14 -840 8 -690" stroke="#1f262f" strokeWidth="4" fill="none" opacity="0.9" />
    {/* rim light from the ceiling */}
    <path d="M-110 -820 Q-118 -900 -66 -946 Q-10 -984 4 -976 Q66 -970 104 -910" stroke="#b9cadb" strokeWidth="5" fill="none" opacity="0.55" strokeLinecap="round" />
    <path d="M-170 -742 Q-150 -766 -100 -772 M98 -776 Q140 -762 160 -712" stroke="#9fb2c6" strokeWidth="5" fill="none" opacity="0.45" strokeLinecap="round" />
  </g>
);
