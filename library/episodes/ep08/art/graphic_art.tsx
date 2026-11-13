import React from 'react';

/** Shared vector art for set "graphic". Frame coordinates (1080x1920) unless noted. */
export const P = {
  skyTop: '#090c1a', skyLow: '#1b2140', moon: '#e9ecf2', river: '#0d1626', glint: '#cfd8e6',
  reedNear: '#060810', reedMid: '#121828', mist: '#8b96ad', mari: '#ff9f5a', candle: '#ffd08a',
  dress: '#e7e4dc', dressShade: '#a7b0c0', hair: '#0b0c10',
};

/** Night sky + moon + river, drawn in WORLD space (1296x2304), frame offset (108,192). */
export const NightWorld: React.FC = () => {
  const hz = 1215; // horizon (frame y ~1023)
  return (
    <g>
      <defs>
        <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.skyTop} />
          <stop offset="0.75" stopColor={P.skyLow} />
          <stop offset="1" stopColor="#2a3150" />
        </linearGradient>
        <radialGradient id="gMoonGlow">
          <stop offset="0" stopColor="#cfd8e6" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#8b96ad" stopOpacity="0.18" />
          <stop offset="1" stopColor="#8b96ad" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gRiver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2238" />
          <stop offset="0.3" stopColor={P.river} />
          <stop offset="1" stopColor="#05080f" />
        </linearGradient>
        <linearGradient id="gMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.mist} stopOpacity="0" />
          <stop offset="0.5" stopColor={P.mist} stopOpacity="0.28" />
          <stop offset="1" stopColor={P.mist} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1296} height={hz + 4} fill="url(#gSky)" />
      <circle cx={790} cy={960} r={420} fill="url(#gMoonGlow)" />
      <circle cx={790} cy={960} r={92} fill={P.moon} />
      <circle cx={760} cy={940} r={20} fill="#d3d8e2" opacity={0.6} />
      <circle cx={815} cy={985} r={13} fill="#d3d8e2" opacity={0.5} />
      {/* far bank with willows */}
      <path d={`M0 ${hz} L0 1150 Q90 1120 170 1150 Q240 1100 330 1160 L520 1185 Q700 1170 900 1190 Q1050 1150 1150 1170 Q1230 1130 1296 1160 L1296 ${hz} Z`} fill={P.reedMid} />
      {/* village lights */}
      {[[980, 1192], [1012, 1189], [1060, 1195], [1100, 1186]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r={14} fill={P.mari} opacity={0.18} /><circle cx={x} cy={y} r={3.2} fill={P.candle} /></g>
      ))}
      <rect y={hz} width={1296} height={2304 - hz} fill="url(#gRiver)" />
      {/* moon path on water */}
      {Array.from({ length: 16 }).map((_, i) => {
        const y = hz + 14 + i * i * 4.2 + i * 12;
        const w = 40 + i * 14;
        return <rect key={i} x={790 - w / 2 + Math.sin(i * 2.1) * 30} y={y} width={w} height={3 + i * 0.5} rx={2} fill={P.glint} opacity={0.55 - i * 0.03} />;
      })}
      <rect y={hz - 70} width={1296} height={170} fill="url(#gMist)" />
    </g>
  );
};

/** Reed clump silhouette, base at (x,y), height h. */
export const Reeds: React.FC<{ x: number; y: number; h: number; flip?: boolean; fill?: string; sway?: number }> = ({ x, y, h, flip, fill = P.reedNear, sway = 0 }) => {
  const s = flip ? -1 : 1;
  const blades = [[-40, 1, -60], [-10, 0.85, -20], [20, 1.1, 30], [55, 0.7, 70], [80, 0.95, 120], [-70, 0.6, -110]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s} 1)`}>
      {blades.map(([dx, k, lean], i) => {
        const top = -h * k, lx = lean + sway * (1 + i * 0.2);
        return <path key={i} d={`M${dx - 9} 0 Q${dx + lx * 0.3} ${top * 0.5} ${dx + lx} ${top} Q${dx + lx * 0.3 + 6} ${top * 0.5} ${dx + 9} 0 Z`} fill={fill} />;
      })}
      <ellipse cx={20} cy={-h * 0.62} rx={9} ry={34} fill={fill} transform={`rotate(${8 + sway * 0.1} 20 ${-h * 0.62})`} />
      <rect x={-140} y={-4} width={300} height={400} fill={fill} />
    </g>
  );
};

/** La Llorona kneeling at the water's edge, facing right. Base point ~ knees at (0,0); height ~ 300. */
export const Llorona: React.FC<{ sway: number }> = ({ sway }) => (
  <g>
    <defs>
      <linearGradient id="gDress" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6d7688" />
        <stop offset="0.55" stopColor={P.dressShade} />
        <stop offset="1" stopColor={P.dress} />
      </linearGradient>
      <linearGradient id="gVeil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8f98aa" stopOpacity="0.55" />
        <stop offset="1" stopColor={P.dress} stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* skirt pooled on the ground */}
    <path d="M-120 20 Q-150 -10 -110 -70 Q-80 -120 -40 -140 L30 -135 Q60 -80 70 -20 Q90 10 120 22 Q0 34 -120 20 Z" fill="url(#gDress)" />
    <path d="M-80 -60 Q-70 -20 -90 15 M-40 -90 Q-30 -40 -45 18 M10 -100 Q20 -50 15 20" stroke="#5f6878" strokeWidth={4} fill="none" opacity={0.7} />
    {/* torso bent forward */}
    <path d="M-40 -140 Q-58 -210 -30 -262 Q0 -292 40 -282 Q70 -250 66 -200 Q55 -160 30 -135 Z" fill="url(#gDress)" />
    {/* arm reaching to the water */}
    <path d="M40 -250 Q90 -200 128 -120 Q140 -80 150 -20 L134 -18 Q120 -78 104 -115 Q70 -180 30 -220 Z" fill={P.dressShade} />
    <path d="M134 -22 Q142 4 150 10 Q160 4 156 -22 Z" fill="#c9ccd4" />
    {/* head bowed */}
    <ellipse cx={46} cy={-300} rx={30} ry={36} fill="#9aa3b4" transform="rotate(25 46 -300)" />
    {/* long wet hair over face, hanging down */}
    <path d={`M14 -330 Q50 -350 78 -320 Q92 -280 86 -230 Q90 -180 ${96 + sway} -130 Q${80 + sway} -138 74 -170 Q66 -140 ${60 + sway * 0.7} -110 Q48 -160 50 -210 Q30 -240 10 -290 Z`} fill={P.hair} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${60 + i * 6} -300 Q${70 + i * 5} -220 ${78 + i * 4 + sway * (0.5 + i * 0.15)} ${-150 + i * 10}`} stroke={P.hair} strokeWidth={3} fill="none" />
    ))}
    {/* veil */}
    <path d={`M8 -345 Q52 -372 86 -334 Q70 -300 30 -270 Q-10 -220 -60 -170 Q-90 -150 ${-110 - sway} -120 Q-80 -200 -40 -260 Q-10 -310 8 -345 Z`} fill="url(#gVeil)" />
    {/* moon rim light on the right edges */}
    <path d="M86 -334 Q96 -300 88 -240" stroke={P.moon} strokeWidth={3} fill="none" opacity={0.9} />
    <path d="M66 -200 Q55 -160 30 -135 M128 -120 Q140 -80 150 -20 M70 -20 Q90 10 120 22" stroke={P.moon} strokeWidth={3.5} fill="none" opacity={0.85} />
  </g>
);

/** Paper boat (folded), centred at (0,0), width ~180. */
export const PaperBoat: React.FC<{ tone?: number }> = ({ tone = 1 }) => (
  <g opacity={tone}>
    <path d="M-95 -6 L95 -6 L66 30 L-66 30 Z" fill="#b9c1d0" />
    <path d="M-95 -6 L0 -6 L-20 30 L-66 30 Z" fill="#8d96a8" />
    <path d="M-48 -6 L0 -92 L48 -6 Z" fill="#dfe3ea" />
    <path d="M-48 -6 L0 -92 L0 -6 Z" fill="#a7b0c0" />
    <path d="M-95 -6 L-62 -40 L-48 -6 Z M95 -6 L62 -40 L48 -6 Z" fill="#c5ccd8" />
    <path d="M0 -92 L48 -6 M66 30 L95 -6" stroke={P.moon} strokeWidth={2.5} fill="none" />
    <path d="M-66 30 L66 30" stroke="#5a6273" strokeWidth={2} />
  </g>
);

/** Marigold (cempasúchil) head, centred at (0,0), radius ~r. */
export const Marigold: React.FC<{ r?: number; rot?: number }> = ({ r = 40, rot = 0 }) => {
  const rings: [number, number, string, number][] = [[1, 16, '#e0782f', 0.36], [0.72, 13, P.mari, 0.32], [0.45, 10, '#ffb36e', 0.3], [0.2, 6, P.candle, 0.32]];
  return (
    <g transform={`rotate(${rot})`}>
      <circle r={r * 1.05} fill="#b8551e" />
      {rings.map(([k, n, c, pr], j) =>
        Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + j * 0.4;
          return <circle key={`${j}-${i}`} cx={Math.cos(a) * r * k * 0.82} cy={Math.sin(a) * r * k * 0.82} r={r * pr} fill={c} stroke="#a94c1a" strokeWidth={1.2} />;
        }),
      )}
    </g>
  );
};

/** Expanding ring ripples around (0,0). q = phase 0..1 (looping). */
export const Ripples: React.FC<{ q: number; n?: number; rx: number; ry: number; color?: string; op?: number }> = ({ q, n = 3, rx, ry, color = P.glint, op = 0.5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const f = (q + i / n) % 1;
      return <ellipse key={i} rx={rx * (0.3 + f)} ry={ry * (0.3 + f)} fill="none" stroke={color} strokeWidth={3 - f * 2} opacity={op * (1 - f)} />;
    })}
  </g>
);
