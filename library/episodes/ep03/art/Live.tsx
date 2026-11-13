import React from 'react';
import { W, H, SHORE, HORIZON, SUN, C, rng } from './world';

/** Animated surf: foam fronts that run up and slide back over the wet sand. t = seconds. */
export const Surf: React.FC<{ t: number }> = ({ t }) => {
  const fronts = [0, 1, 2].map((i) => {
    const phase = t * 0.5 + i * 2.1;
    const run = (Math.sin(phase) * 0.5 + 0.5) ** 1.5;
    const y = SHORE - 46 + i * 34 + run * 60;
    const pts: [number, number][] = [];
    for (let x = -20; x <= W + 20; x += 18) {
      const wob = Math.sin(x * 0.011 + i * 2 + t * 0.7) * 9 + Math.sin(x * 0.037 + i) * 4;
      pts.push([x, y + wob]);
    }
    return { pts, run, i };
  });
  const line = (p: [number, number][], dy = 0) => p.map(([x, y]) => `${x},${(y + dy).toFixed(1)}`).join(' ');
  return (
    <g>
      {fronts.map(({ pts, run, i }) => (
        <g key={i} opacity={0.3 + run * 0.55 - i * 0.05}>
          <polygon points={`${line(pts)} ${W + 20},${SHORE - 90} -20,${SHORE - 90}`} fill="#b9a6c4" opacity={0.08 + run * 0.06} />
          <polyline points={line(pts)} fill="none" stroke={C.foam} strokeWidth={5 - i} strokeLinecap="round" />
          <polyline points={line(pts, -7)} fill="none" stroke={C.foam} strokeWidth={1.6} opacity={0.55} strokeDasharray="14 22" />
          <polyline points={line(pts, 6)} fill="none" stroke="#ffd2a8" strokeWidth={1.2} opacity={0.35} strokeDasharray="6 30" />
        </g>
      ))}
      <path d={`M 0 ${SHORE - 96} Q ${W * 0.3} ${SHORE - 108 + Math.sin(t) * 5} ${W * 0.55} ${SHORE - 98} T ${W} ${SHORE - 102}`} stroke={C.foam} strokeWidth={3} opacity={0.4} fill="none" />
    </g>
  );
};

/** A handful of glints that twinkle on top of the baked glitter. */
export const Twinkles: React.FC<{ t: number }> = ({ t }) => {
  const r = rng(5);
  return (
    <g>
      {Array.from({ length: 34 }, (_, i) => {
        const k = Math.pow(r(), 1.4);
        const x = SUN.x + (r() - 0.5) * (60 + k * 520), y = HORIZON + 8 + k * (SHORE - HORIZON - 60), ph = r() * 6.28;
        const o = Math.max(0, Math.sin(t * 3.2 + ph)) ** 2;
        return <rect key={i} x={x} y={y} width={8 + k * 24} height={1.5 + k * 2.5} rx={1} fill="#fff6dc" opacity={o} />;
      })}
    </g>
  );
};

export const Gulls: React.FC<{ t: number }> = ({ t }) => (
  <g fill="none" stroke="#1c1428" strokeWidth={3} strokeLinecap="round">
    {[0, 1, 2].map((i) => {
      const x = 240 + i * 64 + t * 20, y = 560 + i * 22 + Math.sin(t * 1.3 + i) * 8;
      const f = Math.sin(t * 7 + i * 2) * 7;
      return <path key={i} d={`M ${x - 15} ${y - f} Q ${x - 7} ${y - 6} ${x} ${y} Q ${x + 7} ${y - 6} ${x + 15} ${y - f}`} />;
    })}
  </g>
);

/**
 * The girl, seen from behind, facing the sunset (backlit). Puppet rig in local units, feet at 0.
 * hairSway/hemSway in -1..1; greenHem 0..1 floods the dress green from the hem up (twist shot).
 */
export const Girl: React.FC<{
  x: number; y: number; s: number; t: number; hairSway: number; hemSway: number; greenHem?: number; id?: string;
  /** walk cycle phase (radians); undefined = standing */ walk?: number; stride?: number;
  /** vertical shake of the upper body in local units (laughing) */ shake?: number; reflection?: boolean;
}> = ({ x, y, s, t, hairSway, hemSway, greenHem = 0, id = 'g', walk, stride = 1, shake = 0, reflection = true }) => {
  const hs = hairSway * 16, ms = hemSway * 12;
  const lift = (sd: number) => (walk === undefined ? 0 : Math.max(0, Math.sin(walk + (sd > 0 ? 0 : Math.PI))) * stride);
  const bodyBob = walk === undefined ? 0 : -Math.abs(Math.cos(walk)) * 7 * stride;
  const armSwing = walk === undefined ? 0 : Math.sin(walk) * 6 * stride;
  const hem = -128;
  // dress: fitted bodice, waist, A-line skirt with a soft scalloped hem that moves in the wind
  const dress = `M -50 -452 C -60 -420, -54 -392, -42 -356 C -46 -330, -50 -312, -48 -300
    C -66 -250, -92 -190, ${-118 + ms} ${hem} C ${-90 + ms} ${hem + 12}, ${-60 + ms} ${hem + 2}, ${-30 + ms} ${hem + 10}
    C ${0 + ms} ${hem + 18}, ${30 + ms} ${hem + 4}, ${62 + ms} ${hem + 12} C ${90 + ms} ${hem + 18}, ${108 + ms} ${hem + 6}, ${124 + ms} ${hem - 2}
    C 96 -190, 66 -250, 50 -300 C 50 -312, 48 -330, 44 -356 C 56 -392, 62 -420, 52 -452 C 20 -462, -20 -462, -50 -452 Z`;
  // hair: full at the crown, narrower than the shoulders so they show, feathered V tips that sway
  const hair = `M -38 -566 C -60 -556, -64 -516, -58 -480 C -56 -456, -50 -440, -44 -420
    C ${-46 + hs * 0.4} -390, ${-44 + hs * 0.7} -350, ${-36 + hs} -316 L ${-28 + hs} -326 L ${-20 + hs} -300 L ${-10 + hs} -318
    L ${0 + hs} -290 L ${10 + hs} -316 L ${20 + hs} -298 L ${28 + hs} -322 L ${36 + hs} -312
    C ${44 + hs * 0.7} -350, ${46 + hs * 0.4} -392, 44 -420 C 50 -440, 56 -456, 58 -480 C 64 -516, 60 -556, 38 -568 C 14 -582, -14 -582, -38 -566 Z`;
  const r = rng(3);
  const strands = Array.from({ length: 18 }, () => ({ x0: -36 + r() * 72, x1: -34 + r() * 68, len: 0.82 + r() * 0.18, w: 0.8 + r() * 1.6 }));
  const greenTop = hem - greenHem * 360;
  const arm = (side: 1 | -1) => `M ${side * 50} -444 C ${side * 66} -420, ${side * 72} -380, ${side * 74} -340
    C ${side * 76} -300, ${side * 80} -270, ${side * 82} -236 C ${side * 84} -226, ${side * 80} -216, ${side * 74} -220
    C ${side * 70} -252, ${side * 64} -296, ${side * 60} -336 C ${side * 56} -372, ${side * 50} -404, ${side * 40} -430 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}dress`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.dressDeep} />
          <stop offset="0.6" stopColor={C.dressShade} />
          <stop offset="1" stopColor="#d9b7b0" />
        </linearGradient>
        <linearGradient id={`${id}hemGlow`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffd9a8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd9a8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}green`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#0f5e3c" />
          <stop offset="0.75" stopColor="#2f9a68" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2f9a68" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.skinShade} />
          <stop offset="1" stopColor={C.skin} />
        </linearGradient>
        <clipPath id={`${id}clip`}><path d={dress} /></clipPath>
      </defs>
      {/* long shadow toward camera (sun is ahead of her) */}
      <linearGradient id={`${id}shadow`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a0712" stopOpacity="0.5" />
        <stop offset="1" stopColor="#0a0712" stopOpacity="0" />
      </linearGradient>
      <path d={`M -34 0 C -40 120, -60 260, ${-46 + ms} 420 L ${46 + ms} 420 C 60 260, 40 120, 34 0 Z`} fill={`url(#${id}shadow)`} />
      {/* reflection on the wet sand */}
      {reflection && <g transform="scale(1 -0.45)" opacity={0.12}>
        <path d={dress} fill={C.dress} />
        <path d={hair} fill={C.hair} />
      </g>}
      {/* legs with ankles, feet sunk in a film of water */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * lift(sd) * -3} ${-lift(sd) * 30})`}>
        {lift(sd) > 0.05 && <ellipse cx={sd * 16} cy={-2} rx={11} ry={6 + lift(sd) * 6} fill="#c79a86" />}
        <path d={`M ${sd * 30} ${hem + 4} C ${sd * 34} -90, ${sd * 30} -50, ${sd * 25} -16 C ${sd * 24} -8, ${sd * 22} -2, ${sd * 18} 0 L ${sd * 8} 0 C ${sd * 10} -10, ${sd * 12} -30, ${sd * 14} -60 C ${sd * 16} -90, ${sd * 16} -110, ${sd * 14} ${hem + 4} Z`} fill={`url(#${id}skin)`} />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={56} ry={7} fill={C.foam} opacity={0.35} />
      <g transform={`translate(0 ${bodyBob})`}>
      {/* arms */}
      <g transform={`translate(0 ${shake * 0.8}) rotate(${-armSwing} -46 -440)`}>
        <path d={arm(-1)} fill={C.skinShade} />
        <path d="M -52 -440 C -70 -410, -76 -370, -78 -330 C -80 -290, -84 -262, -86 -236" stroke={C.rimWarm} strokeWidth={2} fill="none" opacity={0.45} />
      </g>
      <g transform={`translate(0 ${shake * 0.8}) rotate(${armSwing} 46 -440)`}>
        <path d={arm(1)} fill={`url(#${id}skin)`} />
        <path d="M 52 -440 C 70 -410, 76 -370, 78 -330 C 80 -290, 84 -262, 86 -236" stroke={C.rimWarm} strokeWidth={3} fill="none" opacity={0.85} />
      </g>
      {/* dress */}
      <path d={dress} fill={`url(#${id}dress)`} />
      <g clipPath={`url(#${id}clip)`}>
        {/* translucent hem glowing with sunlight */}
        <rect x={-140} y={hem - 120} width={280} height={140} fill={`url(#${id}hemGlow)`} />
        {[-80, -48, -16, 16, 48, 80].map((fx, i) => (
          <path key={i} d={`M ${fx * 0.4} -300 C ${fx * 0.7} -240, ${fx * 0.95 + ms * 0.5} -190, ${fx * 1.35 + ms} ${hem + 14}`} stroke={i % 2 ? '#4f4a6e' : '#c8bcd0'} strokeWidth={i % 2 ? 5 : 2} opacity={0.4} fill="none" />
        ))}
        <path d="M -52 -304 C -20 -296, 20 -296, 52 -304" stroke="#4f4a6e" strokeWidth={4} opacity={0.6} fill="none" />
        {greenHem > 0 && <rect x={-150} y={greenTop} width={300} height={-greenTop + hem + 40} fill={`url(#${id}green)`} />}
      </g>
      {/* warm rim all around the silhouette edge (backlight), stronger on the sun side */}
      <path d={dress} fill="none" stroke={C.rimWarm} strokeWidth={3} opacity={0.55} />
      <path d={`M 52 -452 C 62 -420, 56 -392, 44 -356 C 48 -330, 50 -312, 50 -300 C 66 -250, 96 -190, ${124 + ms} ${hem - 2}`} stroke="#ffe0b0" strokeWidth={4} fill="none" opacity={0.85} />
      <g transform={`translate(0 ${shake})`}>
      {/* neck + head */}
      <path d="M -14 -470 L 14 -470 L 16 -444 L -16 -444 Z" fill={C.skinShade} />
      <ellipse cx={0} cy={-520} rx={46} ry={54} fill={C.hair} />
      {/* hair: volume, strands, flyaways, rim */}
      <path d={hair} fill={C.hair} />
      {/* soft sheen across the crown and down the warm side */}
      <path d="M -34 -548 C -12 -566, 20 -564, 40 -546" stroke="#5c3e3c" strokeWidth={9} opacity={0.4} fill="none" strokeLinecap="round" />
      <path d={`M 40 -520 C 46 -470, ${42 + hs * 0.4} -400, ${32 + hs * 0.8} -340`} stroke="#6a4640" strokeWidth={6} opacity={0.35} fill="none" strokeLinecap="round" />
      {strands.map((st, i) => (
        <path key={i} d={`M ${st.x0} -566 C ${st.x0 * 1.2} -480, ${st.x1 + hs * 0.6} -400, ${st.x1 * 0.9 + hs} ${-560 + 270 * st.len}`} stroke={C.hairMid} strokeWidth={st.w} opacity={0.7} fill="none" />
      ))}
      <path d={hair} fill="none" stroke={C.rimWarm} strokeWidth={2.5} opacity={0.6} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${30 + k * 8} -540 C ${60 + k * 10 + hs} -520, ${78 + k * 12 + hs * 1.4} -${500 - k * 20}, ${92 + k * 14 + hs * 1.8} -${470 - k * 26}`} stroke={C.rimWarm} strokeWidth={1.2} opacity={0.7} fill="none" />
      ))}
      <path d="M -36 -566 C -10 -582, 22 -580, 40 -562" stroke="#ffe3bb" strokeWidth={3} opacity={0.8} fill="none" />
      </g>
      </g>
    </g>
  );
};
