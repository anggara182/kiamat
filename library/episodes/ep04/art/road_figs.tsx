import React from 'react';

/* Road set heroes: standing pocong, seated pocong passenger, small motorbike + uncle. */
const SH = '#e9e4d6', SHD = '#9aa0b0', KN = '#bdb6a4', RIMW = '#ffc070', RIMC = '#9fb4d8';

/** Standing pocong (human proportions, ~7 heads). Feet at (x,y); ~310 units tall * s. arm 0..1 raises an arm-shape under the cloth. dark 0..1 dims it. */
export const Pocong: React.FC<{ x: number; y: number; s?: number; arm?: number; dark?: number; t?: number; rim?: number }> = ({ x, y, s = 1, arm = 0, dark = 0, t = 0, rim = 1 }) => {
  const sway = Math.sin(t * 0.9) * 0.8;
  const ang = 6 - 120 * arm;
  const body = "M 0,-290 C 15,-290 22,-280 22,-266 C 22,-254 16,-246 12,-242 C 14,-236 20,-232 30,-226 C 38,-220 38,-200 36,-170 C 34,-130 30,-80 24,-40 C 22,-24 18,-12 14,0 L -14,0 C -18,-12 -22,-24 -24,-40 C -30,-80 -34,-130 -36,-170 C -38,-200 -38,-220 -30,-226 C -20,-232 -14,-236 -12,-242 C -16,-246 -22,-254 -22,-266 C -22,-280 -15,-290 0,-290 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway} 0 0)`}>
      <ellipse cx={0} cy={4} rx={56} ry={8} fill="#000" opacity={0.45} />
      {/* arm-shape under the cloth, pivot at the shoulder */}
      {arm > 0.02 && <g transform={`rotate(${ang} -30 -222)`}>
        <path d="M -40,-226 C -44,-186 -42,-150 -36,-122 C -32,-112 -22,-114 -22,-124 C -20,-160 -20,-200 -20,-226 Z" fill={SH} />
        <path d="M -30,-220 C -32,-180 -30,-150 -28,-126" stroke={SHD} strokeWidth={3} fill="none" opacity={0.6} />
        <path d="M -40,-224 C -44,-186 -42,-150 -36,-122" stroke={RIMW} strokeWidth={2.5} fill="none" opacity={0.9 * rim} />
      </g>}
      <path d={body} fill={SH} />
      {/* cool shadow side (lamp is to the left) */}
      <path d="M 6,-288 C 18,-286 22,-276 22,-266 C 22,-254 16,-246 12,-242 C 14,-236 20,-232 30,-226 C 38,-220 38,-200 36,-170 C 34,-130 30,-80 24,-40 C 22,-24 18,-12 14,0 L 4,0 C 12,-40 18,-100 18,-160 C 18,-200 14,-220 8,-238 C 14,-250 14,-272 6,-288 Z" fill={SHD} />
      {/* folds following the wrap */}
      <path d="M -18,-210 C -22,-160 -18,-90 -8,-20" stroke={SHD} strokeWidth={2.5} fill="none" opacity={0.55} />
      <path d="M -26,-200 C -14,-206 2,-206 14,-200" stroke={SHD} strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M -24,-120 C -10,-126 6,-126 22,-120" stroke={SHD} strokeWidth={2} fill="none" opacity={0.5} />
      {/* ties: neck, knees, feet */}
      <path d="M -13,-242 C -6,-238 6,-238 13,-242" stroke={KN} strokeWidth={5} fill="none" />
      <path d="M -26,-64 C -12,-58 12,-58 26,-64" stroke={KN} strokeWidth={4} fill="none" />
      <path d="M -17,-12 C -8,-8 8,-8 17,-12" stroke={KN} strokeWidth={5} fill="none" />
      <path d="M -12,0 C -18,6 -18,12 -12,13 L 12,13 C 18,12 18,6 12,0 Z" fill={KN} />
      {/* small twisted knot on top of the head */}
      <path d="M -6,-289 C -5,-296 -2,-300 0,-303 C 3,-300 5,-296 6,-289 Z" fill={KN} />
      <path d="M -1,-302 C -8,-306 -10,-313 -7,-317 C -3,-313 -1,-312 1,-316 C 3,-312 6,-313 9,-316 C 10,-310 6,-305 2,-302 Z" fill={SH} />
      <path d="M -3,-296 L 3,-299 M -2,-292 L 4,-295" stroke={SHD} strokeWidth={1.5} />
      {/* face opening: small, dark, no eyes */}
      <ellipse cx={-1} cy={-266} rx={11} ry={14} fill={SHD} />
      <ellipse cx={-3} cy={-265} rx={8.5} ry={11.5} fill="#05060b" />
      {/* warm rim, lamp side */}
      <path d="M 0,-290 C -15,-290 -22,-280 -22,-266 C -22,-254 -16,-246 -12,-242 C -14,-236 -20,-232 -30,-226 C -38,-220 -38,-200 -36,-170 C -34,-130 -30,-80 -24,-40 C -22,-24 -18,-12 -14,0" stroke={RIMW} strokeWidth={3} fill="none" opacity={0.95 * rim} />
      <path d="M -1,-302 C -8,-306 -10,-313 -7,-317" stroke={RIMW} strokeWidth={1.5} fill="none" opacity={0.8 * rim} />
      {dark > 0 && <g opacity={dark}>
        <path d={body} fill="#2a2f44" />
        <ellipse cx={-3} cy={-265} rx={9} ry={12} fill="#000" />
      </g>}
    </g>
  );
};

/** Small motorbike (bebek) facing right, ground at (x,y). rider / passenger optional. lit: headlight on. */
export const Motorbike: React.FC<{ x: number; y: number; s?: number; flip?: boolean; rider?: boolean; passenger?: boolean; t?: number; lit?: number; rim?: number; wheelRot?: number; threads?: boolean; dawn?: boolean }> = ({ x, y, s = 1, flip = false, rider = true, passenger = false, t = 0, lit = 1, rim = 1, wheelRot = 0, threads = false, dawn = false }) => {
  const dk = dawn ? '#1c1a28' : '#07080f', md = dawn ? '#2a2638' : '#121626', hi = dawn ? '#5a5068' : '#2a3048';
  const rw = dawn ? '#ffb58a' : RIMW;
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} -30)`}>
      <circle r={31} fill={dk} />
      <circle r={20} fill={md} />
      <g transform={`rotate(${wheelRot})`}>{[0, 60, 120].map((a) => <rect key={a} x={-1.5} y={-19} width={3} height={38} fill={hi} transform={`rotate(${a})`} />)}</g>
      <circle r={5} fill={hi} />
      <path d="M -26,-17 A 31 31 0 0 1 20,-24" stroke={rw} strokeWidth={2.5} fill="none" opacity={0.7 * rim} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={2} rx={150} ry={12} fill="#000" opacity={0.5} />
      {lit > 0 && <path d="M 96,-112 L 420,-170 L 420,-20 Z" fill="url(#roadBeam)" opacity={lit} />}
      {wheel(-78)}{wheel(82)}
      {/* exhaust */}
      <rect x={-118} y={-40} width={66} height={10} rx={5} fill={hi} />
      {/* fork */}
      <path d="M 72,-118 L 82,-30" stroke={dk} strokeWidth={8} strokeLinecap="round" />
      {/* body */}
      <path d="M -122,-48 C -116,-72 -92,-80 -60,-80 L -10,-76 C 10,-74 18,-60 30,-50 L 46,-50 C 56,-80 62,-104 70,-122 L 82,-122 C 82,-96 88,-70 102,-52 C 110,-44 102,-36 90,-38 L 30,-36 C 0,-30 -40,-30 -70,-40 C -92,-46 -112,-40 -122,-48 Z" fill={md} />
      <path d="M -122,-48 C -116,-72 -92,-80 -60,-80 L -10,-76" stroke={rw} strokeWidth={3} fill="none" opacity={0.8 * rim} />
      <path d="M 70,-122 L 82,-122 C 82,-96 88,-70 102,-52" stroke={rw} strokeWidth={2.5} fill="none" opacity={0.6 * rim} />
      {/* seat */}
      <path d="M -112,-80 C -104,-94 -70,-96 -18,-92 C -6,-91 -2,-82 -12,-79 L -104,-76 Z" fill={dk} />
      <path d="M -108,-86 C -90,-94 -50,-95 -18,-92" stroke={hi} strokeWidth={3} fill="none" />
      {/* handlebar + mirror + head light */}
      <path d="M 56,-128 L 90,-134" stroke={dk} strokeWidth={7} strokeLinecap="round" />
      <path d="M 74,-132 L 66,-170" stroke={dk} strokeWidth={3} /><ellipse cx={64} cy={-174} rx={8} ry={5} fill={md} />
      <ellipse cx={96} cy={-112} rx={7} ry={9} fill={lit > 0 ? '#fff2c8' : hi} />
      <circle cx={-121} cy={-60} r={4.5} fill={lit > 0 ? '#ff3b30' : '#5a2020'} />
      {threads && <g stroke="#e9e4d6" strokeWidth={2.4} fill="none" strokeLinecap="round">
        <path d="M -96,-88 C -80,-96 -66,-84 -50,-92 C -40,-97 -32,-90 -24,-94" opacity={0.95} />
        <path d="M -84,-86 C -74,-80 -64,-90 -56,-82 C -50,-76 -60,-66 -54,-56" opacity={0.85} />
        <path d="M -70,-92 C -64,-100 -54,-96 -44,-100" opacity={0.8} />
        <path d="M -102,-84 C -110,-80 -108,-70 -116,-64" opacity={0.75} />
        <path d="M -60,-90 C -58,-84 -46,-86 -40,-80" opacity={0.7} />
      </g>}
      {passenger && <Passenger t={t} rim={rim} />}
      {rider && (
        <g>
          {/* far leg (darker) */}
          <path d="M -46,-96 L 16,-104 L 22,-50" stroke={dk} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* torso jacket */}
          <path d="M -72,-94 C -74,-130 -62,-172 -42,-188 C -28,-196 -6,-192 0,-178 C 6,-150 -2,-120 -16,-94 Z" fill={md} />
          <path d="M -72,-100 C -74,-132 -62,-172 -42,-188 C -28,-196 -10,-194 -2,-184" stroke={rw} strokeWidth={3} fill="none" opacity={0.9 * rim} />
          <path d="M -40,-180 C -42,-150 -40,-120 -34,-98" stroke={dk} strokeWidth={2} fill="none" opacity={0.8} />
          {/* near leg */}
          <path d="M -52,-92 L 12,-100" stroke={dk} strokeWidth={24} strokeLinecap="round" />
          <path d="M 12,-100 L 8,-48" stroke={dk} strokeWidth={17} strokeLinecap="round" />
          <ellipse cx={16} cy={-42} rx={16} ry={7} fill={dk} />
          <path d="M -52,-104 L 12,-112" stroke={hi} strokeWidth={2} opacity={0.7} />
          {/* arm */}
          <path d="M -20,-174 Q 14,-150 62,-130" stroke={md} strokeWidth={16} strokeLinecap="round" fill="none" />
          <path d="M -22,-182 Q 16,-160 62,-138" stroke={rw} strokeWidth={2.5} fill="none" opacity={0.7 * rim} />
          <circle cx={64} cy={-130} r={8} fill={dk} />
          {/* neck + helmet */}
          <rect x={-24} y={-200} width={14} height={14} fill={dk} />
          <path d="M -46,-206 C -46,-232 -26,-240 -10,-236 C 6,-232 12,-218 10,-204 L -8,-198 C -24,-194 -42,-194 -46,-206 Z" fill={hi} />
          <path d="M -2,-226 C 8,-222 12,-212 10,-204 L -6,-200 Z" fill="#0b0d16" />
          <path d="M -44,-212 C -42,-232 -24,-240 -10,-236" stroke={rw} strokeWidth={3} fill="none" opacity={rim} />
          <path d="M 2,-222 L 7,-214" stroke="#ffd27a" strokeWidth={2} opacity={0.8 * rim} />
        </g>
      )}
      {passenger && (
        /* cloth-wrapped arm holding the rider's waist (no hand) */
        <g>
          <path d="M -84,-174 C -62,-168 -42,-148 -28,-124 C -24,-114 -34,-108 -42,-114 C -56,-134 -72,-150 -90,-156 Z" fill={SH} />
          <path d="M -84,-174 C -62,-168 -42,-148 -28,-124" stroke={RIMW} strokeWidth={2} fill="none" opacity={0.8 * rim} />
          <path d="M -60,-160 C -48,-150 -40,-136 -34,-122" stroke={SHD} strokeWidth={3} fill="none" />
                  </g>
      )}
    </g>
  );
};

/** Seated pocong behind the rider (side view, facing right): hips on the seat, wrapped legs hang, soft cloth ribbons trail back. */
const Passenger: React.FC<{ t: number; rim: number }> = ({ t, rim }) => {
  const w = (a: number, ph: number, sp = 10) => Math.sin(t * sp + ph) * a;
  /** tapered soft ribbon trailing left from (x0,y0), drooping slightly */
  const rib = (x0: number, y0: number, len: number, wd: number, ph: number, droop = 6) => {
    const xa = x0 - len * 0.35, xb = x0 - len * 0.7, xc = x0 - len;
    const ya = y0 + droop * 0.3 + w(4, ph), yb = y0 + droop * 0.7 + w(7, ph + 1.2), yc = y0 + droop + w(10, ph + 2.4);
    return `M ${x0},${y0} C ${xa},${ya - 2} ${xb},${yb - 2} ${xc},${yc} Q ${xc - 10},${yc + wd * 0.45} ${xc + 2},${yc + wd * 0.75} C ${xb},${yb + wd * 0.95} ${xa},${ya + wd} ${x0},${y0 + wd} Z`;
  };
  return (
    <g>
      {/* soft cloth ribbons from neck tie, back hem and feet knot */}
      <path d={rib(-112, -190, 60, 6, 0, 18)} fill={SHD} opacity={0.8} />
      <path d={rib(-120, -110, 80, 7, 1.5, 22)} fill={SH} opacity={0.75} />
      <path d={rib(-120, -84, 55, 6, 3, 24)} fill={SHD} opacity={0.8} />
      <path d={rib(-82, -22, 45, 5, 4.2, 16)} fill={SH} opacity={0.75} />
      <path d="M -100,-228 C -88,-228 -82,-218 -82,-206 C -82,-196 -86,-190 -88,-186 C -80,-182 -76,-174 -76,-158 C -76,-130 -78,-110 -76,-94 C -68,-90 -64,-80 -65,-66 C -66,-52 -64,-40 -64,-28 L -84,-28 C -84,-42 -86,-56 -90,-70 L -120,-76 C -124,-100 -126,-140 -124,-168 C -122,-180 -116,-184 -112,-186 C -114,-190 -118,-196 -118,-206 C -118,-220 -110,-230 -100,-230 Z" fill={SH} />
      {/* shadow on the back side */}
      <path d="M -112,-186 C -116,-184 -122,-180 -124,-168 C -126,-140 -124,-100 -120,-76 L -104,-74 C -108,-100 -110,-140 -106,-182 Z" fill={SHD} />
      <path d="M -84,-28 C -84,-42 -86,-56 -90,-70 L -80,-70 C -76,-56 -74,-42 -74,-28 Z" fill={SHD} opacity={0.6} />
      {/* ties */}
      <path d="M -88,-186 C -96,-182 -106,-182 -112,-186" stroke={KN} strokeWidth={4} fill="none" />
      <path d="M -64,-32 C -70,-28 -80,-28 -84,-32" stroke={KN} strokeWidth={4} fill="none" />
      <path d="M -84,-28 C -86,-22 -84,-18 -80,-16 L -68,-16 C -64,-18 -62,-22 -64,-28 Z" fill={KN} />
      {/* twisted top knot */}
      <path d="M -104,-227 C -103,-233 -101,-236 -100,-238 C -98,-236 -96,-233 -96,-227 Z" fill={KN} />
      <path d="M -100,-237 C -106,-240 -109,-246 -107,-250 C -103,-247 -101,-246 -99,-249 C -97,-246 -94,-246 -91,-249 C -90,-243 -94,-239 -98,-237 Z" fill={SH} />
      {/* face opening toward the rider's back */}
      <ellipse cx={-89} cy={-206} rx={6} ry={10} fill="#05060b" />
      {/* rims: warm lamp light from above/front, cool on the back */}
      <path d="M -100,-228 C -88,-228 -82,-218 -82,-206 C -82,-196 -86,-190 -88,-186 C -80,-182 -76,-174 -76,-158" stroke={RIMW} strokeWidth={2.5} fill="none" opacity={0.9 * rim} />
      <path d="M -118,-206 C -118,-218 -112,-228 -100,-228" stroke={RIMW} strokeWidth={2.5} fill="none" opacity={0.9 * rim} />
      <path d="M -124,-168 C -126,-140 -124,-100 -120,-76" stroke={RIMC} strokeWidth={2} fill="none" opacity={0.7 * rim} />
    </g>
  );
};

/** gradient defs used by Motorbike's headlight beam; render once inside each Live svg. */
export const RoadDefs: React.FC = () => (
  <defs>
    <linearGradient id="roadBeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff2c8" stopOpacity={0.55} />
      <stop offset="1" stopColor="#ffd27a" stopOpacity={0} />
    </linearGradient>
    <radialGradient id="roadGlow">
      <stop offset="0" stopColor="#ffd27a" stopOpacity={0.9} />
      <stop offset="0.25" stopColor="#ffb347" stopOpacity={0.35} />
      <stop offset="1" stopColor="#ffb347" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="roadPool">
      <stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} />
      <stop offset="0.6" stopColor="#ffb347" stopOpacity={0.2} />
      <stop offset="1" stopColor="#ffb347" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="roadCone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffd27a" stopOpacity={0.28} />
      <stop offset="1" stopColor="#ffb347" stopOpacity={0.04} />
    </linearGradient>
    <radialGradient id="roadStreak">
      <stop offset="0" stopColor="#ffe2a0" stopOpacity={0.95} />
      <stop offset="0.3" stopColor="#ffb347" stopOpacity={0.4} />
      <stop offset="1" stopColor="#ffb347" stopOpacity={0} />
    </radialGradient>
  </defs>
);
