import React from 'react';
import { CT } from '../sets/cottage';

/** Ornate silver comb with a long grey hair strand. Centered at (x,y), lying on a surface at y. */
export const Comb: React.FC<{ x: number; y: number; s?: number; hair?: number }> = ({ x, y, s = 1, hair = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={120} ry={10} fill="#000" opacity={0.45} />
    <path d="M -95 -2 Q 0 -48 95 -2 L 95 -16 Q 0 -66 -95 -16 Z" fill="#d8dde3" />
    <path d="M -80 -14 Q 0 -50 80 -14" stroke="#8a929c" strokeWidth={3} fill="none" />
    {[-50, -20, 10, 40].map((cx, i) => <circle key={i} cx={cx} cy={-30 + Math.abs(cx) * 0.12} r={6} fill="#aeb6c0" />)}
    {Array.from({ length: 19 }, (_, i) => <rect key={i} x={-92 + i * 10} y={-4} width={5} height={8} fill="#c6ccd3" />)}
    <path d="M -96 -2 L 96 -2 L 96 4 L -96 4 Z" fill="#c6ccd3" />
    <g opacity={hair}>
      <path d="M 20 -8 C 80 30 160 10 200 40 S 260 90 330 70" stroke="#9aa0a8" strokeWidth={2.4} fill="none" />
      <path d="M 10 -6 C 60 40 120 30 170 60 S 240 110 300 110" stroke="#b8bec6" strokeWidth={1.6} fill="none" opacity={0.8} />
    </g>
  </g>
);

/** Grandfather seated in profile, wool cap & cardigan. Light always comes from the fire (+x world).
 *  face="left": faces the window, warm rim on his back. face="right": faces the fire, firelit profile with a smile. */
export const Grandpa: React.FC<{ x: number; y: number; rim?: number; nod?: number; face?: 'left' | 'right'; smile?: number; breath?: number }> = ({ x, y, rim = 1, nod = 0, face = 'left', smile = 0, breath = 0 }) => {
  const fr = face === 'right';
  const warm = '#ff9d4d';
  return (
    <g transform={`translate(${x},${y}) scale(${fr ? -1 : 1},1)`}>
      {/* chair: curved back post + seat + legs */}
      <path d="M 40 30 C 48 -200 52 -420 30 -560 L 58 -560 C 80 -420 76 -200 70 30 Z" fill="#0d0907" />
      <rect x={-140} y={-182} width={210} height={26} rx={8} fill="#0d0907" />
      <rect x={-130} y={-160} width={16} height={190} fill="#0d0907" />
      {/* legs */}
      <path d="M -150 -200 C -205 -200 -222 -190 -214 -150 C -210 -90 -206 -40 -204 -8 L -170 -8 C -172 -60 -174 -120 -170 -160 L -40 -150 C 0 -150 22 -170 22 -200 Z" fill="#161310" />
      <ellipse cx={-206} cy={0} rx={38} ry={12} fill="#0c0a08" />
      {/* torso (cardigan), slight breathing */}
      <g transform={`translate(0 ${-breath * 3})`}>
        <path d="M -10 -478 C 40 -440 52 -330 34 -200 C 24 -160 -20 -150 -70 -158 L -150 -170 C -170 -200 -140 -222 -110 -228 C -122 -310 -112 -400 -70 -466 C -52 -482 -28 -486 -10 -478 Z" fill="#1d1916" />
        {/* cardigan button line */}
        <path d="M -98 -430 C -118 -360 -118 -290 -110 -230" stroke="#2a2420" strokeWidth={4} fill="none" />
        {/* arm resting on the knee, bent */}
        <path d="M -30 -440 C -40 -380 -54 -320 -60 -282 C -64 -256 -100 -236 -160 -224" stroke="#26201b" strokeWidth={46} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={-176} cy={-222} rx={26} ry={18} fill="#2c241e" />
        <path d="M 30 -460 C 58 -380 54 -270 36 -196" stroke={warm} strokeWidth={6} fill="none" opacity={(fr ? 0.15 : 0.6) * rim} strokeLinecap="round" />
        {/* head, nods */}
        <g transform={`rotate(${nod * 7} -30 -480)`}>
          <path d="M -24 -592 C -70 -594 -94 -568 -98 -538 L -114 -516 L -100 -508 C -98 -500 -94 -494 -98 -488 C -94 -472 -82 -462 -66 -460 C -40 -458 -12 -470 -2 -496 C 12 -530 12 -582 -24 -592 Z" fill="#1d1916" />
          {/* ear */}
          <path d="M -24 -544 C -14 -540 -14 -516 -26 -512" stroke="#2a221c" strokeWidth={5} fill="none" strokeLinecap="round" />
          {/* firelit face (only when facing the fire) */}
          {fr && <g opacity={rim}>
            <path d="M -60 -578 C -88 -566 -96 -548 -98 -538 L -114 -516 L -100 -508 C -98 -500 -94 -494 -98 -488 C -94 -472 -82 -462 -66 -460 C -60 -480 -66 -520 -60 -578 Z" fill="#a8683e" />
            <path d="M -96 -548 L -114 -516 L -100 -508 C -98 -500 -94 -494 -98 -488 C -94 -472 -82 -462 -66 -460" stroke="#ffc48a" strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {/* closed, crinkled eye */}
            <path d={`M -88 -540 Q -80 ${-546 + smile * 4} -72 -540`} stroke="#3a2418" strokeWidth={4} fill="none" strokeLinecap="round" />
            {/* smile + cheek line */}
            <path d={`M -97 -490 Q -88 ${-484 + smile * 6} ${-76 - smile * 2} ${-494 - smile * 4}`} stroke="#3a2418" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M -74 -512 Q -70 -500 -74 -490" stroke="#7a4a2c" strokeWidth={3} fill="none" opacity={0.7 * smile} strokeLinecap="round" />
            {/* white brow & stubble hint */}
            <path d="M -92 -552 Q -82 -558 -70 -552" stroke="#d8dde3" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
          </g>}
          {/* wool cap */}
          <path d="M -96 -572 C -86 -630 0 -640 12 -584 C 14 -574 6 -570 -4 -570 L -118 -566 C -122 -570 -112 -576 -96 -572 Z" fill="#141210" />
          <path d="M 12 -584 C 18 -550 12 -510 -2 -490" stroke={warm} strokeWidth={6} fill="none" opacity={(fr ? 0 : 0.75) * rim} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

/** Fire in the hearth; flicker = opacity / small scale only. */
export const Fire: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => {
  const { fire } = CT; const cx = fire.x + fire.w / 2, by = fire.y + fire.h - 20;
  const f = (a: number, b: number) => 0.85 + 0.15 * Math.sin(t * a + b);
  return (
    <g opacity={o}>
      <defs><radialGradient id="ctFG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb36b" stopOpacity="0.55" /><stop offset="1" stopColor="#ff9d4d" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={cx} cy={by - 60} rx={420 * f(3.1, 0)} ry={360 * f(2.3, 1)} fill="url(#ctFG)" />
      <path d={`M ${cx - 110} ${by} C ${cx - 120} ${by - 90} ${cx - 60} ${by - 140 * f(7, 1)} ${cx - 40} ${by - 200 * f(5, 2)} C ${cx - 10} ${by - 120} ${cx + 10} ${by - 120} ${cx + 30} ${by - 230 * f(6, 0)} C ${cx + 70} ${by - 140} ${cx + 120} ${by - 80} ${cx + 110} ${by} Z`} fill="#ff9d4d" />
      <path d={`M ${cx - 60} ${by} C ${cx - 60} ${by - 60} ${cx - 20} ${by - 100 * f(8, 3)} ${cx} ${by - 140 * f(6.5, 1)} C ${cx + 20} ${by - 90} ${cx + 60} ${by - 50} ${cx + 60} ${by} Z`} fill="#ffd9a0" />
      <rect x={cx - 140} y={by - 6} width={280} height={30} rx={12} fill="#1f120a" />
    </g>
  );
};

/** Rain streaks on the window glass, clipped to the panes. */
export const Rain: React.FC<{ t: number }> = ({ t }) => {
  const { win } = CT; const drops: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const x = win.x + ((i * 97) % win.w);
    const sp = 120 + ((i * 53) % 90);
    const y = win.y + (((t * sp + i * 211) % (win.h + 200)) - 100);
    drops.push(<line key={i} x1={x} y1={y} x2={x - 3} y2={y + 40 + (i % 4) * 14} stroke="#8d99a6" strokeWidth={2} opacity={0.35} strokeLinecap="round" />);
    drops.push(<circle key={`b${i}`} cx={win.x + ((i * 151) % win.w)} cy={win.y + ((i * 263) % win.h)} r={3} fill="#8d99a6" opacity={0.28} />);
  }
  return <g><defs><clipPath id="ctWinClip"><rect x={win.x} y={win.y} width={win.w} height={win.h} /></clipPath></defs><g clipPath="url(#ctWinClip)">{drops}</g></g>;
};

/** Long pale human hand outside the glass, rising from below (rise 0..1); palm pressed flat on the glass at the end. */
export const Hand: React.FC<{ rise: number; press?: number }> = ({ rise, press = 0 }) => {
  const { win } = CT; const cx = win.x + win.w * 0.36; const base = win.y + win.h + 270 - rise * 480;
  const skin = '#c3cbd2', shade = '#9aa4ae', crease = '#86909b';
  const fingers: [number, number, number, number][] = [ // x, length, angle, width
    [-42, 178, -9, 25], [-14, 206, -2, 26], [14, 196, 4, 25], [40, 150, 12, 22],
  ];
  return (
    <g clipPath="url(#ctWinClip2)">
      <defs>
        <clipPath id="ctWinClip2"><rect x={win.x} y={win.y} width={win.w} height={win.h} /></clipPath>
        <linearGradient id="ctArmFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9aa4ae" /><stop offset="0.55" stopColor="#5d6670" stopOpacity="0.6" /><stop offset="1" stopColor="#0a1018" stopOpacity="0" /></linearGradient>
        <radialGradient id="ctHandGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e3e9f0" stopOpacity="0.22" /><stop offset="1" stopColor="#e3e9f0" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={`translate(${cx},${base}) rotate(-5) scale(0.9)`} opacity={0.86}>
        <ellipse cx={0} cy={-60} rx={210} ry={260} fill="url(#ctHandGlow)" />
        {/* wrist / forearm */}
        <path d="M -50 70 C -44 160 -40 260 -38 420 L 40 420 C 40 260 44 160 52 70 Z" fill="url(#ctArmFade)" />
        {/* palm */}
        <path d="M -60 -66 C -66 -10 -62 50 -46 86 C -20 100 24 100 48 86 C 62 46 64 -10 58 -66 Z" fill={skin} />
        {/* thumb, angled out */}
        <g transform="translate(-50 34) rotate(-34)">
          <path d="M -15 10 C -16 -40 -14 -80 -10 -100 C -6 -112 6 -112 10 -100 C 14 -80 15 -40 14 10 Z" fill={skin} />
          <path d="M -8 -58 L 8 -58" stroke={crease} strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={0} cy={-92} rx={8} ry={10} fill="#eef2f4" opacity={0.6 * press} />
        </g>
        {fingers.map(([fx, len, ang, w], i) => (
          <g key={i} transform={`translate(${fx} -58) rotate(${ang})`}>
            <rect x={-w / 2} y={-len} width={w} height={len + 18} rx={w / 2} fill={skin} />
            {/* knuckles & joint creases */}
            <path d={`M ${-w / 2 + 5} ${-len * 0.36} L ${w / 2 - 5} ${-len * 0.36}`} stroke={crease} strokeWidth={2.5} strokeLinecap="round" />
            <path d={`M ${-w / 2 + 6} ${-len * 0.68} L ${w / 2 - 6} ${-len * 0.68}`} stroke={crease} strokeWidth={2} strokeLinecap="round" />
            <path d={`M ${-w / 2 + 4} -4 Q 0 4 ${w / 2 - 4} -4`} stroke={shade} strokeWidth={3} fill="none" />
            {/* fingertip pressed on the glass */}
            <ellipse cx={0} cy={-len + w * 0.55} rx={w * 0.38} ry={w * 0.5} fill="#eef2f4" opacity={0.65 * press} />
          </g>
        ))}
        {/* palm creases, pressed heel */}
        <path d="M -44 -20 C -10 -8 20 -26 50 -36" stroke={crease} strokeWidth={2.5} fill="none" opacity={0.8} />
        <path d="M -48 22 C -20 10 0 30 20 60" stroke={crease} strokeWidth={2.5} fill="none" opacity={0.7} />
        <ellipse cx={4} cy={58} rx={30} ry={14} fill="#dfe5e9" opacity={0.35 * press} />
      </g>
    </g>
  );
};
