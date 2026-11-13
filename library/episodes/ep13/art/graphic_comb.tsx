import React from 'react';

/** Ornate silver comb (spine + teeth) with an optional long grey hair strand. Local origin = comb centre, width ~600*s. */
export const Comb: React.FC<{ x: number; y: number; s?: number; rot?: number; hair?: number; id: string }> = ({ x, y, s = 1, rot = 0, hair = 1, id }) => {
  const teeth = Array.from({ length: 26 }, (_, i) => -270 + i * 21.6);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-sv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fa" />
          <stop offset="0.45" stopColor="#d8dde3" />
          <stop offset="1" stopColor="#7d858f" />
        </linearGradient>
        <radialGradient id={`${id}-gl`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity={0.45} />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={480} ry={260} fill={`url(#${id}-gl)`} />
      {/* teeth */}
      {teeth.map((tx, i) => <path key={i} d={`M ${tx - 6} -20 L ${tx + 6} -20 L ${tx + 3} 150 Q ${tx} 158 ${tx - 3} 150 Z`} fill={`url(#${id}-sv)`} />)}
      {/* ornate spine */}
      <path d="M -300 -20 Q -300 -70 -250 -82 Q -150 -150 0 -158 Q 150 -150 250 -82 Q 300 -70 300 -20 Z" fill={`url(#${id}-sv)`} stroke="#5f6670" strokeWidth={3} />
      <path d="M -240 -42 Q -120 -112 0 -118 Q 120 -112 240 -42" fill="none" stroke="#8f98a3" strokeWidth={5} />
      <circle cx={0} cy={-84} r={24} fill="#9aa3ad" stroke="#f4f7fa" strokeWidth={4} />
      {[-150, 150].map((cx) => <path key={cx} d={`M ${cx - 40} -58 Q ${cx} -100 ${cx + 40} -58`} fill="none" stroke="#f4f7fa" strokeWidth={4} />)}
      <path d="M -260 -70 Q -120 -136 60 -142" fill="none" stroke="#ffffff" strokeWidth={4} opacity={0.8} />
      {/* hair strand caught in the teeth */}
      {hair > 0 && (
        <g opacity={hair} fill="none" strokeLinecap="round">
          <path d="M -560 -260 Q -300 -120 -96 40 Q 40 140 160 90 Q 320 30 420 260 Q 480 420 380 620" stroke="#d2d6db" strokeWidth={10} />
          <path d="M -560 -250 Q -310 -110 -90 52 Q 50 150 170 104 Q 330 50 432 270" stroke="#ffffff" strokeWidth={4} opacity={0.8} />
          <path d="M -540 -300 Q -280 -150 -60 10 Q 80 110 220 60 Q 360 20 470 200" stroke="#e6eaee" strokeWidth={6} opacity={0.85} />
        </g>
      )}
    </g>
  );
};

/** Distant banshee: pale grey figure, very long white hair, grey cloak. Origin = feet, height ~h. */
export const Banshee: React.FC<{ x: number; y: number; h: number; sway?: number; id: string }> = ({ x, y, h, sway = 0, id }) => {
  const s = h / 700;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-cl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a3038" />
          <stop offset="0.6" stopColor="#56606b" />
          <stop offset="1" stopColor="#9aa5b0" />
        </linearGradient>
        <linearGradient id={`${id}-hr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f5f8" />
          <stop offset="1" stopColor="#aeb8c2" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {/* cloak body, flared, wind-blown hem */}
      <path d={`M -60 -570 Q -112 -520 -122 -400 Q -150 -200 ${-205 - sway * 12} 0 Q 0 14 190 0 Q 140 -220 122 -400 Q 112 -520 70 -572 Q 5 -592 -60 -570 Z`} fill={`url(#${id}-cl)`} />
      {/* cloak folds */}
      {[`M -40 -390 Q -80 -200 -120 -4`, `M 12 -370 Q 0 -190 22 -4`, `M 70 -390 Q 100 -200 135 -4`].map((d, i) => <path key={i} d={d} stroke="#1b2027" strokeWidth={8} fill="none" opacity={0.85} />)}
      {[`M 40 -380 Q 60 -200 80 -4`, `M -12 -380 Q -30 -200 -50 -4`].map((d, i) => <path key={i} d={d} stroke="#8d99a6" strokeWidth={4} fill="none" opacity={0.45} />)}
      {/* hair flowing down her back, blown left */}
      <path d={`M -16 -676 Q 34 -694 48 -650 Q 22 -640 6 -600 Q -16 -540 -42 -480 Q -90 -330 ${-160 - sway * 25} -170 Q ${-200 - sway * 30} -70 ${-250 - sway * 35} -30 L ${-200 - sway * 25} -60 Q -130 -180 -78 -360 Q -52 -460 -60 -570 Q -62 -650 -16 -676 Z`} fill={`url(#${id}-hr)`} />
      {/* head + hint of pale face (lit side toward the moon) */}
      <ellipse cx={8} cy={-626} rx={33} ry={43} fill="#5d6670" />
      <path d="M 22 -664 Q 46 -640 42 -614 Q 44 -600 34 -588 Q 26 -580 18 -586 Q 12 -620 22 -664 Z" fill="#e3e9f0" opacity={0.92} />
      {/* hair crown + strands */}
      <path d="M -40 -640 Q -20 -690 30 -672 Q 44 -664 48 -650 Q 10 -668 -40 -640 Z" fill="#f2f5f8" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-10 - i * 6} -664 Q ${-50 - i * 10} -420 ${-150 - i * 16 - sway * 30} -${110 - i * 10}`} stroke="#ffffff" strokeWidth={3.5} fill="none" opacity={0.6} />)}
      {/* lock of hair over the shoulder, being combed */}
      <path d="M 30 -640 Q 60 -560 78 -470 Q 96 -400 92 -330 L 80 -332 Q 80 -410 62 -470 Q 44 -550 22 -620 Z" fill="#f2f5f8" />
      <path d="M 30 -640 Q 64 -540 88 -335" stroke="#ffffff" strokeWidth={3} fill="none" />
      {/* arm (sleeve) bent, hand at the lock */}
      <path d="M 66 -548 Q 132 -540 128 -490 Q 124 -470 104 -470" stroke="#6d7782" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={102} cy={-470} rx={13} ry={11} fill="#d6dde4" />
      {/* the silver comb, clear: spine + teeth */}
      <g transform="translate(132 -500) rotate(4) scale(1.6)">
        <path d="M -46 0 Q -46 -16 -30 -18 Q 0 -26 30 -18 Q 46 -16 46 0 Z" fill="#eef2f6" stroke="#3a3f46" strokeWidth={2.5} />
        <path d="M -30 -10 Q 0 -18 30 -10" stroke="#9aa3ad" strokeWidth={2} fill="none" />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-42 + i * 9} y={0} width={5} height={22} fill="#d8dde3" stroke="#3a3f46" strokeWidth={1} />)}
      </g>
      {/* moon rim light on right edge */}
      <path d="M 122 -400 Q 140 -220 190 0" stroke="#e3e9f0" strokeWidth={7} fill="none" opacity={0.85} />
      <path d="M 70 -572 Q 112 -520 122 -400" stroke="#e3e9f0" strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};
