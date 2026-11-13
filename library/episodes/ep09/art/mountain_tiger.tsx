import React from 'react';

/** The Jangsan Tiger: never fully shown. A huge pale hunched mass, mostly hidden behind pine trunks:
 * coarse ragged fur on a high shoulder hump, low blunt head, long forelegs, two dull eyes. Origin = feet. */
export const PaleShape: React.FC<{ x: number; y: number; s: number; o?: number; eyes?: number; id: string; trunk?: string }> = ({ x, y, s, o = 1, eyes = 1, id, trunk = '#0b1322' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`pg${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eef3f8" />
        <stop offset="0.55" stopColor="#c9d6e6" />
        <stop offset="1" stopColor="#5f7190" />
      </linearGradient>
      <radialGradient id={`ph${id}`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c9d6e6" stopOpacity="0.3" />
        <stop offset="1" stopColor="#c9d6e6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={90} cy={-150} rx={380} ry={260} fill={`url(#ph${id})`} opacity={o} />
    <g opacity={o}>
      {/* hunched body: low blunt head left, ragged shoulder hump, back sloping right, long forelegs */}
      <path d="M -78 0 L -62 -66 C -96 -78 -108 -116 -92 -140 C -74 -164 -24 -166 -4 -146 L 4 -186 L 18 -228 L 32 -218 L 44 -268 L 62 -246 L 80 -276 L 96 -244 L 120 -258 L 134 -232 L 160 -242 L 172 -214 L 198 -222 L 210 -196 L 238 -200 L 246 -176 L 272 -170 C 304 -128 306 -64 292 0 L 252 0 L 244 -58 C 204 -82 140 -84 96 -64 L 76 0 L 46 0 L 34 -84 L -6 -90 L -36 0 Z" fill={`url(#pg${id})`} />
      {/* shadowed underside / far foreleg */}
      <path d="M 96 -64 C 140 -84 204 -82 244 -58 L 240 -30 C 200 -50 140 -52 100 -36 Z M 34 -84 L 46 0 L 30 0 L 22 -80 Z" fill="#5f7190" opacity={0.7} />
      {/* coarse fur strokes */}
      <g stroke="#8a9cb8" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6}>
        <path d="M 40 -230 l 10 34" /><path d="M 78 -244 l 6 40" /><path d="M 118 -228 l 4 36" /><path d="M 160 -214 l 2 30" /><path d="M 204 -192 l -2 26" />
        <path d="M -60 -120 l 8 16" /><path d="M -30 -136 l 6 18" />
      </g>
      {/* rim on the hump */}
      <path d="M 4 -186 L 18 -228 L 32 -218 L 44 -268 L 62 -246 L 80 -276 L 96 -244 L 120 -258 L 134 -232 L 160 -242" stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.75} />
      {/* two dull eyes, low in the head */}
      <g opacity={eyes}>
        <ellipse cx={-66} cy={-118} rx={9} ry={4} fill="#a9b39a" />
        <ellipse cx={-34} cy={-122} rx={8} ry={4} fill="#a9b39a" />
      </g>
    </g>
    {/* pine trunks in front hide most of it */}
    <path d="M -140 40 L -126 -430 L -96 -430 L -86 40 Z" fill={trunk} />
    <path d="M 128 40 L 142 -430 L 186 -430 L 198 40 Z" fill={trunk} />
    <path d="M 330 40 L 338 -430 L 366 -430 L 376 40 Z" fill={trunk} />
  </g>
);

/** Snowfall: deterministic live particles in world space. */
export const Snow: React.FC<{ t: number; n?: number; seed?: number; size?: number; color?: string; speed?: number }> = ({ t, n = 90, seed = 1, size = 4, color = '#dfe8f3', speed = 120 }) => {
  let s = seed * 9301 + 49297;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = r() * 1296, y0 = r() * 2304, k = 0.5 + r(), ph = r() * 6.28;
        const y = (y0 + t * speed * k) % 2304;
        const x = x0 + Math.sin(t * 0.9 + ph) * 22 * k;
        return <circle key={i} cx={x} cy={y} r={size * k} opacity={0.35 + 0.5 * (k - 0.5)} />;
      })}
    </g>
  );
};
