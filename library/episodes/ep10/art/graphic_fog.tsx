import React from 'react';

/** Shared mirror + fog + candle pieces for set "graphic" (frame space 1080x1920). */
export const FOG = '#c9d6e3';
export const GLASS = '#2a333d';
export const COLD = '#9fb3c8';
export const CANDLE = '#ffc46b';

/** Dark bathroom mirror filling the frame, with tile edge and frame rim. `id` keeps gradient ids unique per shot. */
export const MirrorBg: React.FC<{ id: string; lx?: number; ly?: number; warm?: number }> = ({ id, lx = 540, ly = 1250, warm = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#222a33" />
        <stop offset="0.55" stopColor="#161b22" />
        <stop offset="1" stopColor="#0b0e13" />
      </linearGradient>
      <radialGradient id={`${id}-warm`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={CANDLE} stopOpacity={0.32} />
        <stop offset="0.45" stopColor="#7a5a3a" stopOpacity={0.12} />
        <stop offset="1" stopColor="#3a2e26" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${id}-streak`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLD} stopOpacity={0} />
        <stop offset="0.5" stopColor={COLD} stopOpacity={0.09} />
        <stop offset="1" stopColor={COLD} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#0e1116" />
    {/* mirror glass */}
    <rect x={40} y={60} width={1000} height={1800} rx={14} fill={`url(#${id}-glass)`} />
    <ellipse cx={lx} cy={ly} rx={620} ry={760} fill={`url(#${id}-warm)`} opacity={warm} />
    {/* cold diagonal reflections */}
    <path d="M 120 60 L 380 60 L 40 700 L 40 260 Z" fill={`url(#${id}-streak)`} />
    <path d="M 760 60 L 860 60 L 300 1860 L 200 1860 Z" fill={`url(#${id}-streak)`} opacity={0.6} />
    {/* frame rim */}
    <rect x={40} y={60} width={1000} height={1800} rx={14} fill="none" stroke="#07090d" strokeWidth={26} />
    <rect x={52} y={72} width={976} height={1776} rx={10} fill="none" stroke={COLD} strokeOpacity={0.18} strokeWidth={3} />
    <rect x={0} y={0} width={1080} height={1920} fill="none" stroke="#07090d" strokeWidth={70} />
  </g>
);

/** Soft fog patch (stacked ellipses, no filter). */
export const FogPatch: React.FC<{ id: string; cx: number; cy: number; rx: number; ry: number; o?: number }> = ({ id, cx, cy, rx, ry, o = 1 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={`${id}-fog`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={FOG} stopOpacity={0.26} />
        <stop offset="0.6" stopColor={FOG} stopOpacity={0.14} />
        <stop offset="1" stopColor={FOG} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-fog)`} />
    <ellipse cx={cx - rx * 0.3} cy={cy + ry * 0.15} rx={rx * 0.6} ry={ry * 0.6} fill={`url(#${id}-fog)`} opacity={0.7} />
    <ellipse cx={cx + rx * 0.35} cy={cy - ry * 0.1} rx={rx * 0.5} ry={ry * 0.55} fill={`url(#${id}-fog)`} opacity={0.6} />
  </g>
);

/** Candle flame reflection (glow + flame + small body), seen in the glass. */
export const CandleReflection: React.FC<{ x: number; y: number; s?: number; t: number; id: string; body?: boolean }> = ({ x, y, s = 1, t, id, body = true }) => {
  const fl = 1 + 0.06 * Math.sin(t * 9) + 0.04 * Math.sin(t * 13.7);
  const sway = 3 * Math.sin(t * 3.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-cg`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff1cf" stopOpacity={0.75} />
          <stop offset="0.25" stopColor={CANDLE} stopOpacity={0.35} />
          <stop offset="1" stopColor={CANDLE} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-wax`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3029" />
          <stop offset="0.35" stopColor="#c9b79a" />
          <stop offset="1" stopColor="#2a221d" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={-40} rx={210 * fl} ry={230 * fl} fill={`url(#${id}-cg)`} />
      {body && <>
        <path d="M -38 0 L -38 190 Q 0 204 38 190 L 38 0 Q 0 -10 -38 0 Z" fill={`url(#${id}-wax)`} />
        <path d="M -38 0 Q 0 12 38 0" fill="none" stroke="#fff1cf" strokeOpacity={0.55} strokeWidth={3} />
        <path d="M 14 4 Q 18 40 12 62" fill="none" stroke="#e8d6b8" strokeOpacity={0.6} strokeWidth={6} strokeLinecap="round" />
      </>}
      <path d="M 0 -4 L 0 -16" stroke="#1a120c" strokeWidth={4} />
      <path d={`M 0 ${-14} Q ${-15} ${-40} ${sway} ${-80 * fl} Q ${15} ${-40} 0 ${-14} Z`} fill={CANDLE} />
      <path d={`M 0 ${-16} Q ${-7} ${-34} ${sway * 0.6} ${-56 * fl} Q ${7} ${-34} 0 ${-16} Z`} fill="#fff6dc" />
    </g>
  );
};

/** Text drawn as if wiped into breath fog: pale faint core, soft halo strokes, revealed left→right by `rev` (0..1). */
export const FogText: React.FC<{
  id: string; x: number; y: number; size: number; font: string; weight?: number; text: string; rev: number;
  spacing?: number; color?: string; o?: number; drips?: number[];
}> = ({ id, x, y, size, font, weight = 700, text, rev, spacing = 0, color = FOG, o = 1, drips = [] }) => {
  const w = 1080;
  return (
    <g opacity={o}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={0} y={y - size * 1.4} width={w * rev} height={size * 3.2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={weight} fontSize={size} letterSpacing={spacing}
          fill="none" stroke={color} strokeOpacity={0.06} strokeWidth={size * 0.22} strokeLinejoin="round">{text}</text>
        <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={weight} fontSize={size} letterSpacing={spacing}
          fill="none" stroke={color} strokeOpacity={0.12} strokeWidth={size * 0.09} strokeLinejoin="round">{text}</text>
        <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={weight} fontSize={size} letterSpacing={spacing}
          fill={color} fillOpacity={0.72}>{text}</text>
        {drips.map((dx, i) => (
          <path key={i} d={`M ${dx} ${y + size * 0.02} q 2 ${size * 0.15} 0 ${size * (0.2 + 0.1 * ((i * 7) % 3))}`}
            stroke={color} strokeOpacity={0.3} strokeWidth={Math.max(3, size * 0.035)} strokeLinecap="round" fill="none" />
        ))}
      </g>
    </g>
  );
};
