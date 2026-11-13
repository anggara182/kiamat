import React from 'react';

/**
 * EP01 city set, people + foreground pieces (all live).
 *  - RoofMan: a kampung man (peci, t-shirt, sarong) seen from behind, head tilting up (shot 19). Animate on twos.
 *  - RoofDeck: flat concrete roof (dak) with parapet, water tanks on stands, antenna (shots 12, 19).
 *  - Laundry: two laundry lines with clothes swaying in the wind (shot 12, environment = on ones).
 *  - WindowHouse: a near house front whose window shows a mother turning off a lamp beside a sleeping child (shot 20).
 */

export type RoofPal = { deck: string; deckTop: string; tank: string; rim: string; rimO: number };

/** water tank (tandon) on a 4-leg steel stand; base centre (x, y), scale s */
export const Tank: React.FC<{ x: number; y: number; s: number; fill: string; rim?: string; rimO?: number }> = ({ x, y, s, fill, rim, rimO = 0 }) => {
  const tw = 120 * s, th = 130 * s, lg = 110 * s, ty = y - lg - th;
  return (
    <g>
      <g fill={fill}>
        <rect x={x - tw * 0.45} y={y - lg} width={7 * s} height={lg} />
        <rect x={x + tw * 0.45 - 7 * s} y={y - lg} width={7 * s} height={lg} />
        <rect x={x - tw * 0.2} y={y - lg} width={5 * s} height={lg} opacity={0.8} />
        <rect x={x - tw * 0.5} y={y - lg - 6 * s} width={tw} height={8 * s} />
        <path d={`M${x - tw * 0.45} ${y - lg * 0.55} L${x + tw * 0.45} ${y - lg * 0.15} L${x + tw * 0.45} ${y - lg * 0.15 + 4 * s} L${x - tw * 0.45} ${y - lg * 0.55 + 4 * s} Z`} />
        <rect x={x - tw / 2} y={ty + 14 * s} width={tw} height={th - 14 * s} rx={6 * s} />
        <ellipse cx={x} cy={ty + 14 * s} rx={tw / 2} ry={16 * s} />
        <rect x={x - 16 * s} y={ty - 6 * s} width={32 * s} height={10 * s} rx={3 * s} />
        {[0.35, 0.65].map((f) => <rect key={f} x={x - tw / 2} y={ty + th * f} width={tw} height={4 * s} opacity={0.6} />)}
      </g>
      {rim && <path d={`M${x - tw / 2} ${y - lg - 4 * s} V${ty + 14 * s} A${tw / 2} ${16 * s} 0 0 1 ${x + tw * 0.1} ${ty - 1 * s}`} stroke={rim} strokeOpacity={rimO} strokeWidth={2.5 * s} fill="none" />}
    </g>
  );
};

/** flat roof deck: parapet top edge at y, spanning x0..x1, filled down to y + depth */
export const RoofDeck: React.FC<{ x0: number; x1: number; y: number; p: RoofPal; depth?: number }> = ({ x0, x1, y, p, depth = 900 }) => (
  <g>
    <rect x={x0} y={y} width={x1 - x0} height={depth} fill={p.deck} />
    <rect x={x0} y={y - 6} width={x1 - x0} height={10} fill={p.deckTop} />
    <rect x={x0} y={y - 6} width={x1 - x0} height={2.5} fill={p.rim} opacity={p.rimO} />
  </g>
);

/* ------------------------------------------------------------------ shot 19: the man on the roof */
/**
 * Kampung man from behind, feet at (x, y), height h (world px). `up` 0..1 = head tilting back to look at the sky,
 * `br` = breathing phase (rad). Right hand rests on the tank stand rail at (handX, handY) when given.
 */
export const RoofMan: React.FC<{ x: number; y: number; h: number; up: number; br: number; fill: string; shirt: string; sarong: string; rim: string; rimO: number; hand?: [number, number] }> = ({ x, y, h, up, br, fill, shirt, sarong, rim, rimO, hand }) => {
  const u = h / 7; // head unit
  const breathe = Math.sin(br) * u * 0.03;
  const shY = y - h * 0.81 - breathe; // shoulder line
  const shW = u * 1.05; // half shoulder width
  const waistY = y - h * 0.5, waistW = u * 0.62;
  const neckH = u * (0.32 - 0.22 * up);
  const headCy = shY - neckH - u * 0.5 + u * 0.08 * up;
  const headRy = u * (0.56 - 0.06 * up);
  const lean = -u * 0.08 * up; // whole upper body leans back slightly
  const pecY = headCy - headRy * 0.92 - u * 0.2;
  // right arm: shoulder -> elbow -> hand on the rail (or hanging)
  const rs: [number, number] = [x + shW * 0.92, shY + u * 0.12];
  const rh: [number, number] = hand ?? [x + shW * 1.05, waistY + u * 0.3];
  const re: [number, number] = [(rs[0] + rh[0]) / 2 + u * 0.25, (rs[1] + rh[1]) / 2 + u * 0.15];
  // left arm: hand tucked into the sarong fold at the hip (elbow out)
  const ls: [number, number] = [x - shW * 0.92, shY + u * 0.12];
  const le: [number, number] = [x - shW * 1.25, shY + u * 1.5];
  const lh: [number, number] = [x - waistW * 0.8, waistY + u * 0.15];
  const limb = (a: [number, number], b: [number, number], c: [number, number], w0: number, w1: number, col: string) => (
    <g>
      <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={col} strokeWidth={w0} strokeLinecap="round" />
      <path d={`M${b[0]} ${b[1]} L${c[0]} ${c[1]}`} stroke={col} strokeWidth={w1} strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      {/* sarong: waist to ankles, flaring */}
      <path d={`M${x - waistW} ${waistY} L${x + waistW} ${waistY} L${x + u * 0.8} ${y - u * 0.25} L${x - u * 0.82} ${y - u * 0.25} Z`} fill={sarong} />
      {[0.3, 0.55, 0.78].map((f) => <path key={f} d={`M${x - waistW - (u * 0.2) * f} ${waistY + (y - waistY) * f} L${x + waistW + (u * 0.18) * f} ${waistY + (y - waistY) * f}`} stroke={fill} strokeOpacity={0.45} strokeWidth={u * 0.05} />)}
      <path d={`M${x - waistW} ${waistY + u * 0.12} L${x + waistW} ${waistY + u * 0.12}`} stroke={fill} strokeOpacity={0.6} strokeWidth={u * 0.14} />
      {/* feet (sandals) */}
      <path d={`M${x - u * 0.55} ${y - u * 0.25} h${u * 0.4} v${u * 0.25} h${-u * 0.46} Z M${x + u * 0.12} ${y - u * 0.25} h${u * 0.42} v${u * 0.25} h${-u * 0.44} Z`} fill={fill} />
      <g transform={`translate(${lean} 0)`}>
        {/* torso (t-shirt) */}
        <path d={`M${x - shW} ${shY + u * 0.1} Q${x} ${shY - u * 0.14} ${x + shW} ${shY + u * 0.1} L${x + waistW * 1.05} ${waistY + u * 0.15} L${x - waistW * 1.05} ${waistY + u * 0.15} Z`} fill={shirt} />
        <path d={`M${x} ${shY + u * 0.2} L${x + u * 0.04} ${waistY}`} stroke={fill} strokeOpacity={0.35} strokeWidth={u * 0.05} />
        {limb(ls, le, lh, u * 0.36, u * 0.3, shirt)}
        {limb(rs, re, rh, u * 0.36, u * 0.3, shirt)}
        <circle cx={rh[0]} cy={rh[1]} r={u * 0.16} fill={fill} />
        {/* neck + head (back of the head, ear on the right), peci */}
        <rect x={x - u * 0.2} y={shY - neckH - u * 0.05} width={u * 0.4} height={neckH + u * 0.18} fill={fill} />
        <ellipse cx={x + u * 0.03} cy={headCy} rx={u * 0.42} ry={headRy} fill={fill} />
        <ellipse cx={x + u * 0.44} cy={headCy + u * 0.08} rx={u * 0.08} ry={u * 0.14} fill={fill} />
        {/* peci: low flat-topped cap sitting on the crown, its top shows more as the head tilts back */}
        <path d={`M${x - u * 0.4} ${pecY + u * 0.36} L${x - u * 0.37} ${pecY} L${x + u * 0.43} ${pecY} L${x + u * 0.46} ${pecY + u * 0.36} Z`} fill={fill} />
        <ellipse cx={x + u * 0.03} cy={pecY} rx={u * 0.4} ry={u * (0.05 + 0.1 * up)} fill={fill} />
        {/* rim from the city glow (left) and the sky (top) */}
        <g stroke={rim} strokeOpacity={rimO} fill="none" strokeLinecap="round">
          <path d={`M${x - u * 0.37} ${pecY} L${x + u * 0.43} ${pecY}`} strokeWidth={u * 0.05} />
          <path d={`M${x - u * 0.42} ${headCy - u * 0.05} Q${x - u * 0.46} ${headCy + headRy * 0.6} ${x - u * 0.2} ${headCy + headRy}`} strokeWidth={u * 0.05} />
          <path d={`M${x - shW * 0.2} ${shY - u * 0.06} Q${x - shW * 0.8} ${shY - u * 0.02} ${x - shW * 1.08} ${shY + u * 0.25} L${le[0] - u * 0.16} ${le[1]}`} strokeWidth={u * 0.06} />
          <path d={`M${x - waistW} ${waistY} L${x - u * 0.82} ${y - u * 0.3}`} strokeWidth={u * 0.04} strokeOpacity={rimO * 0.6} />
          <path d={`M${x + shW * 0.3} ${shY - u * 0.04} Q${x + shW * 0.85} ${shY} ${x + shW * 1.05} ${shY + u * 0.3}`} strokeWidth={u * 0.035} strokeOpacity={rimO * 0.5} />
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ shot 12: laundry on a rooftop at dusk */
type Cloth = { x: number; line: 0 | 1; k: 'shirt' | 'sarong' | 'towel' | 'kid' | 'jilbab'; c: string; ph: number };
export const CLOTHES: Cloth[] = [
  { x: 250, line: 0, k: 'shirt', c: '#2e2236', ph: 0 }, { x: 345, line: 0, k: 'sarong', c: '#3a2428', ph: 1.3 }, { x: 440, line: 0, k: 'towel', c: '#24304a', ph: 2.1 },
  { x: 960, line: 0, k: 'jilbab', c: '#3f2c3a', ph: 0.7 }, { x: 1065, line: 0, k: 'shirt', c: '#28303d', ph: 2.6 },
  { x: 300, line: 1, k: 'kid', c: '#3a3026', ph: 1.9 }, { x: 395, line: 1, k: 'shirt', c: '#2c2438', ph: 0.4 }, { x: 1010, line: 1, k: 'sarong', c: '#271f30', ph: 1.1 },
];
const clothPath = (k: Cloth['k']) => {
  switch (k) {
    case 'shirt': return 'M-46 0 L46 0 L66 26 L48 40 L42 118 L-42 118 L-48 40 L-66 26 Z';
    case 'sarong': return 'M-38 0 L38 0 L40 170 L-40 170 Z';
    case 'towel': return 'M-32 0 L32 0 L33 96 L-33 96 Z';
    case 'kid': return 'M-30 0 L30 0 L34 52 L6 58 L0 30 L-6 58 L-34 52 Z';
    default: return 'M-44 0 L44 0 L30 120 Q0 140 -30 120 Z';
  }
};
/** laundry poles + lines from (x0..x1); line heights y0 / y1 (sag added); `wind` = time (s, on ones) */
export const Laundry: React.FC<{ x0: number; x1: number; y0: number; y1: number; base: number; fill: string; rim: string; rimO: number; t: number }> = ({ x0, x1, y0, y1, base, fill, rim, rimO, t }) => {
  const sag = 46;
  const lineY = (li: 0 | 1, x: number) => { const yy = li ? y1 : y0; const u = (x - x0) / (x1 - x0); return yy + sag * 4 * u * (1 - u); };
  return (
    <g>
      <g fill={fill}>
        <rect x={x0 - 7} y={y0 - 30} width={14} height={base - y0 + 30} />
        <rect x={x1 - 7} y={y0 - 20} width={14} height={base - y0 + 20} />
        <rect x={x0 - 30} y={y0 - 34} width={60} height={8} />
        <rect x={x1 - 30} y={y0 - 24} width={60} height={8} />
      </g>
      {[0, 1].map((li) => <path key={li} d={`M${x0} ${li ? y1 : y0} Q${(x0 + x1) / 2} ${(li ? y1 : y0) + sag * 2} ${x1} ${li ? y1 : y0}`} stroke={fill} strokeWidth={3} fill="none" />)}
      {CLOTHES.map((c, i) => {
        const ly = lineY(c.line, c.x);
        const a = Math.sin(t * 2.1 + c.ph) * 4 + Math.sin(t * 5.3 + c.ph * 2) * 1.5;
        return (
          <g key={i} transform={`translate(${c.x} ${ly}) rotate(${a})`}>
            <path d={clothPath(c.k)} fill={c.c} />
            <path d={clothPath(c.k)} fill="url(#cLaunLit)" />
            <path d={`M-40 1 L40 1`} stroke={rim} strokeOpacity={rimO} strokeWidth={3} />
            <rect x={-20} y={-6} width={5} height={12} fill={fill} /><rect x={15} y={-6} width={5} height={12} fill={fill} />
          </g>
        );
      })}
      <defs>
        <linearGradient id="cLaunLit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={rim} stopOpacity={0.22} /><stop offset="0.35" stopColor={rim} stopOpacity={0.04} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></linearGradient>
      </defs>
    </g>
  );
};

/* ------------------------------------------------------------------ shot 20: the near window */
/**
 * House front with one lit window (frame coords). Window rect W = (wx, wy, ww, wh).
 * `reach` 0..1 = mother's arm going to the lamp (on twos), `lamp` 0..1 = lamp light, `br` = breathing phase.
 */
export const WindowHouse: React.FC<{ reach: number; lamp: number; br: number; wall: string; rim: string }> = ({ reach, lamp, br, wall, rim }) => {
  const wx = 700, wy = 930, ww = 300, wh = 330;
  const lit = lamp;
  const room = lit > 0.5 ? '#e9b874' : '#1a2034';
  // mother: side view facing right, standing left of centre
  const u = 50; // head unit
  const mx = wx + 48, my = wy + wh + 120; // feet (below the sill, hidden)
  const bend = 0.26 * reach + 0.03 * Math.sin(br);
  const shX = mx + u * 0.15 + u * 0.9 * bend, shY = wy + 128 + u * 0.5 * bend;
  const hx = shX + u * 0.32 + u * 0.4 * bend, hy = shY - u * 0.62;
  const lampX = wx + 232, lampY = wy + 214;
  const hand: [number, number] = [shX + u * 0.6 + (lampX - 8 - shX - u * 0.6) * reach, shY + u * 1.75 + (lampY + 6 - shY - u * 1.75) * reach];
  const elbow: [number, number] = [(shX + hand[0]) / 2 + u * 0.1, Math.max(shY, hand[1]) + u * (0.5 - 0.2 * reach)];
  const sil = lit > 0.5 ? '#2a1a14' : '#0c0f1a';
  return (
    <g>
      <defs>
        <radialGradient id="cwRoom" cx="0.78" cy="0.62" r="0.75"><stop offset="0" stopColor="#ffe2a6" /><stop offset="0.5" stopColor="#e7ae68" /><stop offset="1" stopColor="#9a6438" /></radialGradient>
        <radialGradient id="cwSpill" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.4} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient>
      </defs>
      {/* spill of window light on the wall + roof eave */}
      <ellipse cx={wx + ww / 2} cy={wy + wh / 2} rx={330} ry={300} fill="url(#cwSpill)" opacity={lit} />
      <rect x={600} y={850} width={560} height={1200} fill={wall} />
      <path d={`M560 860 L1160 860 L1160 790 L640 790 Z`} fill="#030408" />
      <path d={`M560 860 L1160 860`} stroke={rim} strokeOpacity={0.35} strokeWidth={2} />
      <rect x={600} y={850} width={3} height={1200} fill={rim} opacity={0.3} />
      <clipPath id="cwClip"><rect x={wx} y={wy} width={ww} height={wh} /></clipPath>
      <g clipPath="url(#cwClip)">
      {/* the window: room behind */}
      <rect x={wx} y={wy} width={ww} height={wh} fill={lit > 0.5 ? 'url(#cwRoom)' : room} />
      {lit > 0.5 && <ellipse cx={lampX} cy={lampY - 30} rx={90} ry={80} fill="#fff1cf" opacity={0.35} />}
      {/* curtain panels */}
      <path d={`M${wx} ${wy} L${wx + 44} ${wy} Q${wx + 30} ${wy + wh * 0.5} ${wx + 40} ${wy + wh} L${wx} ${wy + wh} Z`} fill={lit > 0.5 ? '#b0703f' : '#141a2c'} />
      <path d={`M${wx + ww} ${wy} L${wx + ww - 30} ${wy} Q${wx + ww - 18} ${wy + wh * 0.5} ${wx + ww - 26} ${wy + wh} L${wx + ww} ${wy + wh} Z`} fill={lit > 0.5 ? '#b0703f' : '#141a2c'} />
      {/* table lamp on a small cabinet */}
      <g fill={sil}>
        <rect x={lampX - 22} y={lampY + 50} width={60} height={wh - (lampY - wy) - 50} />
        <rect x={lampX - 4} y={lampY + 8} width={8} height={44} />
        <ellipse cx={lampX} cy={lampY + 50} rx={18} ry={5} />
      </g>
      <path d={`M${lampX - 26} ${lampY + 10} L${lampX + 26} ${lampY + 10} L${lampX + 17} ${lampY - 26} L${lampX - 17} ${lampY - 26} Z`} fill={lit > 0.5 ? '#fff0c8' : '#20263a'} />
      {/* sleeping child on a floor mattress: blanket mound, head on the pillow near the lamp */}
      <g fill={sil}>
        <rect x={wx + 70} y={wy + wh - 34} width={150} height={34} />
        <ellipse cx={wx + 186} cy={wy + wh - 44} rx={30} ry={11} fill={lit > 0.5 ? '#d39a5c' : '#1a2032'} />
        <ellipse cx={wx + 180} cy={wy + wh - 62} rx={17} ry={16} />
        <path d={`M${wx + 76} ${wy + wh - 34} Q${wx + 84} ${wy + wh - 70 - 2 * Math.sin(br * 0.8)} ${wx + 120} ${wy + wh - 66 - 2 * Math.sin(br * 0.8)} Q${wx + 156} ${wy + wh - 64} ${wx + 166} ${wy + wh - 34} Z`} fill={lit > 0.5 ? '#6a3c22' : '#10141f'} />
      </g>
      {/* mother in a headscarf, side view, reaching for the lamp */}
      <g fill={sil}>
        <path d={`M${shX - u * 0.55} ${shY + u * 0.2} Q${shX - u * 0.1} ${shY - u * 0.25} ${shX + u * 0.62} ${shY + u * 0.15} L${shX + u * 0.75} ${my} L${shX - u * 0.95} ${my} Z`} />
        <path d={`M${shX + u * 0.15} ${shY + u * 0.2} L${elbow[0]} ${elbow[1]} L${hand[0]} ${hand[1]}`} stroke={sil} strokeWidth={u * 0.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={hand[0] + u * 0.08} cy={hand[1]} rx={u * 0.17} ry={u * 0.12} />
        {/* headscarf: head + drape over the shoulders */}
        <ellipse cx={hx} cy={hy} rx={u * 0.48} ry={u * 0.56} />
        <path d={`M${hx - u * 0.5} ${hy - u * 0.05} Q${hx - u * 0.75} ${hy + u * 0.9} ${shX - u * 0.6} ${shY + u * 0.9} L${shX + u * 0.7} ${shY + u * 0.7} Q${hx + u * 0.55} ${hy + u * 0.7} ${hx + u * 0.45} ${hy + u * 0.2} Z`} />
        <path d={`M${hx + u * 0.42} ${hy - u * 0.2} Q${hx + u * 0.6} ${hy + u * 0.05} ${hx + u * 0.46} ${hy + u * 0.3}`} stroke={sil} strokeWidth={u * 0.12} fill="none" />
      </g>
      </g>
      {/* window frame: two casements + top vent */}
      <g fill="#05060b">
        <rect x={wx - 14} y={wy - 14} width={ww + 28} height={14} />
        <rect x={wx - 14} y={wy + wh} width={ww + 28} height={18} />
        <rect x={wx - 14} y={wy} width={14} height={wh} />
        <rect x={wx + ww} y={wy} width={14} height={wh} />
        <rect x={wx + ww / 2 - 5} y={wy} width={10} height={wh} />
        <rect x={wx} y={wy + 58} width={ww} height={8} />
        {[0.2, 0.4, 0.6, 0.8].map((f) => <rect key={f} x={wx + ww * f - 2} y={wy} width={4} height={58} />)}
      </g>
      <rect x={wx - 20} y={wy + wh + 14} width={ww + 40} height={6} fill={rim} opacity={0.25} />
      {/* potted plant on the sill (foreground detail) */}
      <g fill="#030407">
        <path d={`M${wx + ww + 36} ${wy + wh + 18} l26 0 l-4 34 l-18 0 Z`} />
        <path d={`M${wx + ww + 49} ${wy + wh + 18} q-30 -40 -22 -76 q10 30 22 70 q8 -50 30 -70 q-6 40 -26 76 Z`} />
      </g>
    </g>
  );
};
