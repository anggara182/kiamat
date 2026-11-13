import React from 'react';

/** Bathroom geometry (world space 1296x2304). */
export const GL = { x: 300, y: 400, w: 696, h: 920 };
export const COUNTER = 1440;
export const CANDLE = { x: 648, top: 1340 };

/** Static room. day = pale morning version. */
export const Room: React.FC<{ day?: boolean }> = ({ day = false }) => {
  const wallA = day ? '#8a939c' : '#1c2128', wallB = day ? '#a7afb6' : '#262d36';
  const tiles: React.ReactNode[] = [];
  for (let y = 0; y < 2304; y += 108) tiles.push(<line key={'h' + y} x1={0} x2={1296} y1={y} y2={y} stroke={day ? '#7c858e' : '#151a20'} strokeWidth={3} />);
  for (let x = 0; x < 1296; x += 108) tiles.push(<line key={'v' + x} x1={x} x2={x} y1={0} y2={COUNTER} stroke={day ? '#7c858e' : '#151a20'} strokeWidth={3} />);
  return (
    <g>
      <defs>
        <linearGradient id={`wall${day}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wallA} /><stop offset="0.6" stopColor={wallB} /><stop offset="1" stopColor={wallA} /></linearGradient>
        <linearGradient id={`frame${day}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={day ? '#c9cdd0' : '#3a4048'} /><stop offset="1" stopColor={day ? '#7d848a' : '#11151a'} /></linearGradient>
        <linearGradient id={`ctr${day}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={day ? '#d8d6d0' : '#3b3630'} /><stop offset="0.08" stopColor={day ? '#9a9892' : '#14161b'} /><stop offset="1" stopColor={day ? '#5d6066' : '#07090d'} /></linearGradient>
      </defs>
      <rect width={1296} height={2304} fill={`url(#wall${day})`} />
      {tiles}
      <rect x={GL.x - 34} y={GL.y - 34} width={GL.w + 68} height={GL.h + 68} rx={8} fill={`url(#frame${day})`} />
      <rect x={0} y={COUNTER} width={1296} height={864} fill={`url(#ctr${day})`} />
      <rect x={0} y={COUNTER - 8} width={1296} height={16} fill={day ? '#e6e4de' : '#4a4038'} />
      <ellipse cx={648} cy={COUNTER + 70} rx={250} ry={46} fill={day ? '#c9c7c1' : '#0d0f13'} />
      <path d={`M 1000 ${COUNTER - 40} q 0 -30 40 -30 h 60 v 18 h -50 q -20 0 -20 12 Z`} fill={day ? '#7a7f84' : '#0b0d11'} />
      <rect x={1000} y={COUNTER - 40} width={26} height={40} fill={day ? '#7a7f84' : '#0b0d11'} />
    </g>
  );
};

/** Glass base: reflection of the room, darker than the room. */
export const GlassBg: React.FC<{ day?: boolean }> = ({ day = false }) => (
  <g>
    <defs>
      <linearGradient id={`gl${day}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={day ? '#7d8790' : '#0c0f13'} /><stop offset="0.7" stopColor={day ? '#929ba3' : '#151a21'} /><stop offset="1" stopColor={day ? '#6d757d' : '#0a0c10'} />
      </linearGradient>
      <linearGradient id={`sheen${day}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9fb3c8" stopOpacity={day ? 0.35 : 0.12} /><stop offset="0.5" stopColor="#9fb3c8" stopOpacity="0" /></linearGradient>
    </defs>
    <rect x={GL.x} y={GL.y} width={GL.w} height={GL.h} fill={`url(#gl${day})`} />
    {/* reflected door frame, low contrast */}
    <rect x={GL.x + 470} y={GL.y + 80} width={170} height={GL.h} fill={day ? '#6a737b' : '#090b0e'} />
    <rect x={GL.x + 480} y={GL.y + 90} width={150} height={GL.h} fill={day ? '#5b636b' : '#06070a'} />
  </g>
);
export const GlassSheen: React.FC<{ day?: boolean }> = ({ day = false }) => (
  <g>
    <polygon points={`${GL.x},${GL.y} ${GL.x + 260},${GL.y} ${GL.x},${GL.y + 420}`} fill={`url(#sheen${day})`} />
    <line x1={GL.x + 120} y1={GL.y + 40} x2={GL.x + 30} y2={GL.y + 190} stroke="#9fb3c8" strokeOpacity={day ? 0.4 : 0.18} strokeWidth={6} strokeLinecap="round" />
  </g>
);
export const GlassClip: React.FC<{ id: string }> = ({ id }) => (
  <defs><clipPath id={id}><rect x={GL.x} y={GL.y} width={GL.w} height={GL.h} /></clipPath></defs>
);

/** Candle glow (radial). */
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number; id: string; c?: string }> = ({ x, y, r, o = 1, id, c = '#ffc46b' }) => (
  <g opacity={o}>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity="0.55" /><stop offset="0.35" stopColor={c} stopOpacity="0.18" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** Candle with flame; flick = small sway (0 = steady). */
export const Candle: React.FC<{ x?: number; top?: number; flick?: number; t?: number; dim?: number; lit?: boolean }> = ({ x = CANDLE.x, top = CANDLE.top, flick = 1, t = 0, dim = 1, lit = true }) => {
  const sw = flick * (Math.sin(t * 7.3) * 3 + Math.sin(t * 13.1) * 1.5);
  const hgt = 46 + flick * Math.sin(t * 5.1) * 4;
  return (
    <g opacity={dim}>
      <defs><linearGradient id="cdl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9a46e" /><stop offset="0.45" stopColor="#f2dcb0" /><stop offset="1" stopColor="#5c4528" /></linearGradient>
        <radialGradient id="flm" cx="0.5" cy="0.75" r="0.6"><stop offset="0" stopColor="#ffffff" /><stop offset="0.4" stopColor="#ffe3a6" /><stop offset="1" stopColor="#ffc46b" stopOpacity="0.2" /></radialGradient></defs>
      <rect x={x - 26} y={top} width={52} height={COUNTER - top} rx={4} fill="url(#cdl)" />
      <ellipse cx={x} cy={top} rx={26} ry={7} fill="#f7e6c2" />
      <ellipse cx={x} cy={COUNTER} rx={60} ry={12} fill="#2b241c" />
      <line x1={x} y1={top} x2={x} y2={top - 12} stroke="#1a120a" strokeWidth={3} />
      {lit && <path d={`M ${x} ${top - 8} q -16 -14 ${sw} -${hgt} q 16 ${hgt * 0.6} 0 ${hgt - 8} Z`} fill="url(#flm)" />}
    </g>
  );
};

/** A ~13 y girl in pyjamas. view back (silhouette) or front (reflection). s = scale (head ry ≈ 80*s). */
export const Girl: React.FC<{ x: number; y: number; s?: number; view: 'back' | 'front'; hair?: 'long' | 'pony' | 'bob'; tone?: string; lit?: number; eyes?: number; eyeDark?: number; id: string }> = ({ x, y, s = 1, view, hair = 'long', tone = '#07090d', lit = 0.5, eyes = 1, eyeDark = 1, id }) => {
  const hairPath = hair === 'long'
    ? 'M -78 -40 Q -90 -110 0 -112 Q 90 -110 78 -40 L 92 150 Q 40 170 0 150 Q -40 170 -92 150 Z'
    : hair === 'pony'
      ? 'M -74 -40 Q -86 -112 0 -112 Q 86 -112 74 -40 L 70 30 Q 0 10 -70 30 Z M 30 -100 Q 120 -60 70 90 Q 50 20 20 -80 Z'
      : 'M -82 -40 Q -92 -114 0 -114 Q 92 -114 82 -40 L 86 60 Q 0 40 -86 60 Z';
  const body = 'M -60 92 Q -150 120 -170 200 L -200 600 L 200 600 L 170 200 Q 150 120 60 92 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`face${id}`} cx="0.5" cy="0.9" r="0.9"><stop offset="0" stopColor="#c7a07a" stopOpacity={lit} /><stop offset="1" stopColor="#2a2622" stopOpacity={lit} /></radialGradient>
        <linearGradient id={`pj${id}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffc46b" stopOpacity={0.35 * lit} /><stop offset="0.5" stopColor="#ffc46b" stopOpacity="0" /></linearGradient>
      </defs>
      <path d={body} fill={tone} />
      <rect x={-22} y={60} width={44} height={50} fill={tone} />
      {view === 'front' && <path d={body} fill={`url(#pj${id})`} />}
      <ellipse cx={0} cy={0} rx={68} ry={82} fill={tone} />
      {view === 'front' && <>
        <ellipse cx={0} cy={4} rx={64} ry={78} fill={`url(#face${id})`} />
        <g opacity={eyeDark}>
          <ellipse cx={-25} cy={2} rx={15} ry={9 * eyes + 0.5} fill="#05060a" />
          <ellipse cx={25} cy={2} rx={15} ry={9 * eyes + 0.5} fill="#05060a" />
        </g>
        <path d="M -12 44 Q 0 48 12 44" stroke="#1a1512" strokeWidth={3} fill="none" opacity={lit} />
      </>}
      <path d={view === 'front' ? hairPath.replace('L 92 150 Q 40 170 0 150 Q -40 170 -92 150 Z', 'L 92 150 Q 70 160 60 40 Q 40 -60 0 -70 Q -40 -60 -60 40 Q -70 160 -92 150 Z').replace('L 70 30 Q 0 10 -70 30 Z', 'L 70 20 Q 50 -60 0 -66 Q -50 -60 -70 20 Z').replace('L 86 60 Q 0 40 -86 60 Z', 'L 86 60 Q 70 -50 0 -70 Q -70 -50 -86 60 Z') : hairPath} fill={view === 'front' ? '#0b0b0f' : tone} />
      {/* rim light strands */}
      <path d="M -70 -60 Q -60 -105 0 -110" stroke="#ffc46b" strokeOpacity={view === 'back' ? 0.55 : 0.2} strokeWidth={4} fill="none" />
      <path d="M 70 -60 Q 60 -105 0 -110" stroke="#ffc46b" strokeOpacity={view === 'back' ? 0.55 : 0.2} strokeWidth={4} fill="none" />
      {view === 'back' && <path d="M -150 140 Q -60 96 0 98 Q 60 96 150 140" stroke="#ffc46b" strokeOpacity={0.35} strokeWidth={5} fill="none" />}
    </g>
  );
};

/** Mary: pale shape with long dark hair, baked with blur (never sharp). Drawn at (x,y) world. */
export const MARY = { x: 838, y: 820 };
export const Mary: React.FC = () => (
  <g transform={`translate(${MARY.x} ${MARY.y})`}>
    <defs>
      <radialGradient id="maryHalo" cx="0.5" cy="0.4" r="0.5"><stop offset="0" stopColor="#9fb3c8" stopOpacity="0.4" /><stop offset="1" stopColor="#9fb3c8" stopOpacity="0" /></radialGradient>
      <radialGradient id="maryF" cx="0.5" cy="0.4" r="0.55"><stop offset="0" stopColor="#d9d6cf" /><stop offset="1" stopColor="#a9a69f" /></radialGradient>
    </defs>
    <ellipse cx={0} cy={60} rx={330} ry={420} fill="url(#maryHalo)" />
    <path d="M -230 520 Q -170 300 -60 260 L 60 260 Q 170 300 230 520 Z" fill="#d9d6cf" opacity={0.55} />
    <path d="M -100 -40 Q -110 -170 0 -175 Q 110 -170 100 -40 L 130 330 Q 110 400 70 340 L 50 80 Q 40 -60 0 -70 Q -40 -60 -50 80 L -70 340 Q -110 400 -130 330 Z" fill="#0b0b0f" />
    <ellipse cx={0} cy={20} rx={52} ry={84} fill="url(#maryF)" />
    <path d="M -46 -40 Q -10 -90 46 -50 L 40 40 Q 10 -40 -30 -20 Z" fill="#0b0b0f" />
    <path d="M -16 58 Q 4 70 24 56" stroke="#3a3530" strokeWidth={5} fill="none" opacity={0.5} />
  </g>
);

/** Smoke curl rising from (x,y). */
export const Smoke: React.FC<{ x: number; y: number; t: number; o?: number }> = ({ x, y, t, o = 1 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const k = i / 24, yy = y - k * 520;
    const xx = x + Math.sin(k * 7 - t * 1.6) * 40 * k + k * k * 60;
    pts.push(`${i ? 'L' : 'M'} ${xx.toFixed(1)} ${yy.toFixed(1)}`);
  }
  return (
    <g opacity={o} fill="none" strokeLinecap="round">
      <path d={pts.join(' ')} stroke="#c9d2dc" strokeOpacity={0.12} strokeWidth={22} />
      <path d={pts.join(' ')} stroke="#dfe6ee" strokeOpacity={0.28} strokeWidth={5} />
    </g>
  );
};
