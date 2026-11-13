import React from 'react';

/** Jelangkung doll: coconut-shell head, stick cross-body in faded cloth, pencil tied at the bottom.
 *  (x,y) = head centre; total height ≈ 760*s. sway in degrees, rotates around the head. */
export const Doll: React.FC<{ x: number; y: number; s?: number; sway?: number; id: string; rim?: string; dark?: boolean }> = ({ x, y, s = 1, sway = 0, id, rim = '#ffc46b', dark }) => {
  const shell = dark ? '#120d09' : '#5a4128';
  const cloth = dark ? '#0d0b09' : '#8a7a63';
  const stick = dark ? '#0f0b08' : '#6b5236';
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-sh`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={dark ? '#1a130d' : '#8a6a46'} />
          <stop offset="0.6" stopColor={shell} />
          <stop offset="1" stopColor={dark ? '#08060a' : '#2a1d12'} />
        </radialGradient>
        <linearGradient id={`${id}-cl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark ? '#0a0807' : '#4a4134'} />
          <stop offset="0.45" stopColor={cloth} />
          <stop offset="1" stopColor={dark ? '#0a0807' : '#3a3229'} />
        </linearGradient>
      </defs>
      {/* vertical stick (spine) */}
      <rect x={-9} y={40} width={18} height={560} rx={6} fill={stick} />
      {/* cross arm */}
      <rect x={-175} y={128} width={350} height={16} rx={7} fill={stick} />
      {/* cloth draped over the cross */}
      <path d="M -40 92 Q -120 108 -170 132 L -194 214 L -176 204 L -170 236 L -150 196 Q -134 186 -122 196 Q -110 320 -118 440 L -96 470 L -70 446 L -40 488 L -10 452 L 20 492 L 52 450 L 78 482 L 110 444 Q 108 320 122 196 Q 134 186 150 196 L 168 240 L 174 206 L 192 216 L 170 132 Q 120 108 40 92 Z"
        fill={`url(#${id}-cl)`} />
      {/* cloth folds */}
      {!dark && <g stroke="#2e271f" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round">
        <path d="M -60 180 Q -70 300 -64 420" /><path d="M 10 170 Q 18 300 8 440" /><path d="M 70 190 Q 84 300 78 430" />
      </g>}
      {!dark && <g fill="#6e5f4b" opacity={0.7}>
        <path d="M -120 300 Q 0 318 118 300 L 118 322 Q 0 340 -120 322 Z" />
        <path d="M -118 380 Q 0 398 114 380 L 114 392 Q 0 410 -118 392 Z" />
      </g>}
      {/* string tie at neck */}
      <path d="M -34 96 Q 0 112 34 96" stroke={dark ? '#000' : '#c9b48a'} strokeWidth={5} fill="none" />
      {/* bottom stick + pencil tied */}
      <rect x={-9} y={470} width={18} height={140} rx={5} fill={stick} />
      <g transform="translate(16 520) rotate(-4)">
        <rect x={-8} y={0} width={16} height={170} fill={dark ? '#0d0b08' : '#d8a63a'} />
        <path d="M -8 170 L 8 170 L 0 214 Z" fill={dark ? '#0d0b08' : '#e9cf9a'} />
        <path d="M -3 198 L 3 198 L 0 214 Z" fill="#1a1a1a" />
      </g>
      <g stroke={dark ? '#000' : '#c9b48a'} strokeWidth={4} fill="none">
        <path d="M -14 548 L 28 556" /><path d="M -14 562 L 28 570" /><path d="M -14 576 L 28 584" />
      </g>
      {/* coconut-shell head */}
      <ellipse cx={0} cy={0} rx={78} ry={88} fill={`url(#${id}-sh)`} />
      {/* fibre strokes */}
      {!dark && <g stroke="#3a2a1a" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round">
        <path d="M -40 -70 Q -58 -10 -46 50" /><path d="M -10 -84 Q -22 -10 -14 70" /><path d="M 30 -78 Q 40 -10 28 66" /><path d="M 58 -50 Q 70 0 54 48" />
      </g>}
      {/* three coconut pores, read as a hollow face */}
      <ellipse cx={-26} cy={-6} rx={11} ry={13} fill="#0b0806" />
      <ellipse cx={26} cy={-6} rx={11} ry={13} fill="#0b0806" />
      <ellipse cx={0} cy={36} rx={9} ry={10} fill="#0b0806" />
      {/* candle rim light */}
      <path d="M 62 -54 Q 82 0 62 56" stroke={rim} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M 170 134 L 192 214" stroke={rim} strokeWidth={4} opacity={0.6} />
      <path d="M 122 200 Q 110 320 110 440" stroke={rim} strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/** Candle with radial glow (glow drawn by caller order). */
export const Candle: React.FC<{ x: number; y: number; h?: number; t: number; id: string; s?: number }> = ({ x, y, h = 120, t, id, s = 1 }) => {
  const fl = 1 + 0.06 * Math.sin(t * 9.1 + x) + 0.04 * Math.sin(t * 13.7);
  const sw = 2.5 * Math.sin(t * 5.3 + x * 0.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-f`} cx="0.5" cy="0.65" r="0.6">
          <stop offset="0" stopColor="#fff6dc" /><stop offset="0.5" stopColor="#ffc46b" /><stop offset="1" stopColor="#ff8a2a" stopOpacity={0.2} />
        </radialGradient>
      </defs>
      <rect x={-18} y={-h} width={36} height={h} rx={4} fill="#d9c9a4" />
      <rect x={-18} y={-h} width={10} height={h} fill="#fff" opacity={0.18} />
      <path d={`M -18 ${-h + 4} Q -6 ${-h + 22} 2 ${-h + 6} Q 10 ${-h + 30} 18 ${-h + 4}`} fill="#efe2c2" />
      <rect x={-2} y={-h - 14} width={4} height={16} fill="#1a1410" />
      <path d={`M 0 ${-h - 70 * fl} Q ${14 + sw} ${-h - 30} 0 ${-h - 8} Q ${-14 + sw} ${-h - 30} 0 ${-h - 70 * fl} Z`} fill={`url(#${id}-f)`} />
    </g>
  );
};

/** Radial glow disc. */
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number; id: string; c?: string }> = ({ x, y, r, o = 1, id, c = '#ffc46b' }) => (
  <g opacity={o}>
    <defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={0.55} /><stop offset="0.45" stopColor={c} stopOpacity={0.18} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);
