import React from 'react';
import { limb, Mitt, DEG } from './institutions_kit';

/**
 * Generic EP02 people for the EP04 institutions set (copied from EP03) (simple faces, Indonesian everyday clothes).
 * Units: a figure is 1000 units tall at s = h/1000, origin = between the feet, facing +x (dir flips).
 * Animate every prop ON TWOS from the shot.
 */
export type Pal = {
  skin: string; skinD: string; top: string; topD: string; bottom: string; bottomD?: string;
  headC: string; headD: string; rim?: string; apron?: string; dots?: string; shoe?: string;
};
export type HeadKind = 'scarf' | 'peci' | 'short' | 'bob' | 'bun';
type P2 = [number, number];

/** pick the lower of the two IK elbows (natural for most poses); out=1 prefers the elbow toward -x (behind) */
export const ik2 = (sx: number, sy: number, hx: number, hy: number, L1: number, L2: number, prefer: 'low' | 'back' | 'front' | 'out' = 'low') => {
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy) || 1;
  const dmax = L1 + L2 - 0.5;
  if (d > dmax) { hx = sx + (dx / d) * dmax; hy = sy + (dy / d) * dmax; dx = hx - sx; dy = hy - sy; d = dmax; }
  const a = Math.atan2(dy, dx);
  const A = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const e1 = { x: sx + Math.cos(a + A) * L1, y: sy + Math.sin(a + A) * L1 };
  const e2 = { x: sx + Math.cos(a - A) * L1, y: sy + Math.sin(a - A) * L1 };
  let e = e1.y > e2.y ? e1 : e2;
  if (prefer === 'back') e = e1.x < e2.x ? e1 : e2;
  if (prefer === 'front') e = e1.x > e2.x ? e1 : e2;
  if (prefer === 'out') e = Math.abs(e1.x) > Math.abs(e2.x) ? e1 : e2;
  return { ex: e.x, ey: e.y, hx, hy };
};

/* ---------------- heads ---------------- */
/** profile head facing +x, centre (0,0), rx 60 / ry 70 */
const HeadSide: React.FC<{ kind: HeadKind; pal: Pal; rim: string; rimO: number }> = ({ kind, pal, rim, rimO }) => {
  const { skin, skinD, headC, headD, dots } = pal;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={58} ry={70} fill={skin} />
      <path d="M52 -12 L72 8 L54 16 Z" fill={skin} />
      <ellipse cx={-8} cy={6} rx={12} ry={16} fill={skinD} opacity={0.5} />
      {kind === 'scarf' && (
        <g>
          <path d="M18 -78 Q-70 -84 -80 0 Q-86 70 -70 128 L76 132 Q84 96 52 66 Q30 50 26 6 Q24 -50 18 -78 Z" fill={headC} />
          <path d="M18 -78 Q-70 -84 -80 0 Q-86 70 -70 128 L-20 130 Q-40 60 -30 0 Q-24 -60 18 -78 Z" fill={headD} opacity={0.5} />
          {dots && [[-50, -20], [-30, 30], [-60, 60], [-10, -40], [0, 80], [30, 100], [-40, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={dots} />)}
          <path d="M18 -78 Q-70 -84 -80 0" stroke={rim} strokeWidth={5} fill="none" opacity={rimO} strokeLinecap="round" />
        </g>
      )}
      {(kind === 'short' || kind === 'peci') && (
        <g>
          <path d="M-58 10 Q-66 -66 0 -72 Q46 -72 58 -30 Q30 -40 6 -30 Q-10 -6 -30 20 Z" fill={headC} />
          {kind === 'peci' && <path d="M-56 -40 L-50 -96 Q4 -104 56 -92 L58 -38 Q0 -48 -56 -40 Z" fill="#0d0c12" />}
          <path d={kind === 'peci' ? 'M-50 -96 Q4 -104 56 -92' : 'M-58 -10 Q-60 -66 0 -72'} stroke={rim} strokeWidth={5} fill="none" opacity={rimO} strokeLinecap="round" />
        </g>
      )}
      {kind === 'bob' && (
        <g>
          <path d="M-64 50 Q-76 -70 0 -76 Q56 -74 62 -24 Q40 -30 30 -14 L22 -40 Q-6 -10 -20 30 Q-30 60 -64 50 Z" fill={headC} />
          <path d="M-60 -20 Q-64 -70 0 -76" stroke={rim} strokeWidth={5} fill="none" opacity={rimO} strokeLinecap="round" />
        </g>
      )}
      {kind === 'bun' && (
        <g>
          <path d="M-58 20 Q-68 -66 0 -72 Q46 -72 58 -26 Q30 -36 10 -24 Q-14 0 -32 30 Z" fill={headC} />
          <circle cx={-60} cy={-20} r={30} fill={headC} />
          <path d="M-58 -10 Q-62 -66 0 -72" stroke={rim} strokeWidth={5} fill="none" opacity={rimO} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/** frontal head, centre (0,0). eyes: none | down | open (tiny marks only) */
export const HeadFront: React.FC<{ kind: HeadKind; pal: Pal; rim: string; rimO: number; eyes?: 'none' | 'down' | 'open'; mouth?: number }> = ({ kind, pal, rim, rimO, eyes = 'none', mouth = 0 }) => {
  const { skin, skinD, headC, headD, dots } = pal;
  return (
    <g>
      {kind === 'scarf' && <path d="M0 -84 Q-82 -84 -84 0 Q-90 80 -120 150 L120 150 Q90 80 84 0 Q82 -84 0 -84 Z" fill={headC} />}
      {kind === 'scarf' && <path d="M0 -84 Q82 -84 84 0 Q90 80 120 150 L40 150 Q70 60 60 0 Q50 -70 0 -84 Z" fill={headD} opacity={0.5} />}
      <ellipse cx={0} cy={4} rx={kind === 'scarf' ? 46 : 54} ry={kind === 'scarf' ? 60 : 68} fill={skin} />
      <ellipse cx={18} cy={14} rx={24} ry={46} fill={skinD} opacity={0.35} />
      {kind === 'scarf' && dots && [[-60, 40], [60, 50], [-70, 110], [70, 110], [0, 130], [-40, -60], [40, -62]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={dots} />)}
      {kind === 'scarf' && <path d="M0 -84 Q-82 -84 -84 0 Q-90 80 -120 150" stroke={rim} strokeWidth={5} fill="none" opacity={rimO} />}
      {(kind === 'short' || kind === 'peci') && <path d="M-56 -10 Q-60 -76 0 -76 Q60 -76 56 -10 Q40 -40 0 -44 Q-40 -40 -56 -10 Z" fill={headC} />}
      {kind === 'peci' && <path d="M-54 -36 L-50 -100 Q0 -108 50 -100 L54 -36 Q0 -46 -54 -36 Z" fill="#0d0c12" />}
      {kind === 'bob' && <path d="M-66 50 Q-78 -78 0 -80 Q78 -78 66 50 L50 50 Q52 -20 30 -34 Q0 -20 -30 -34 Q-52 -20 -50 50 Z" fill={headC} />}
      {eyes === 'down' && <g stroke={skinD} strokeWidth={5} strokeLinecap="round" fill="none"><path d="M-30 12 Q-20 18 -10 12" /><path d="M10 12 Q20 18 30 12" /></g>}
      {eyes === 'open' && <g fill="#1a1414"><circle cx={-20} cy={4} r={5} /><circle cx={20} cy={4} r={5} /></g>}
      {mouth > 0.05 && <ellipse cx={0} cy={36} rx={10 + 8 * mouth} ry={4 + 14 * mouth} fill="#2a1214" />}
    </g>
  );
};

/* ---------------- side figure ---------------- */
export type SideProps = {
  x: number; y: number; h: number; dir?: 1 | -1; pal: Pal; head: HeadKind;
  lean?: number; bob?: number; face?: 'side' | 'front' | 'back';
  handN?: P2; handF?: P2; footN?: P2; footF?: P2; skirt?: boolean; sit?: boolean; rimO?: number; male?: boolean;
  /** draw something in the near hand (local units, after the near arm) */
  holdN?: React.ReactNode; holdF?: React.ReactNode; headTilt?: number;
};

export const Side: React.FC<SideProps> = ({
  x, y, h, dir = 1, pal, head, lean = 0, bob = 0, face = 'side', handN, handF, footN, footF, skirt = false, sit = false, rimO = 0.7, male = false, holdN, holdF, headTilt = 0,
}) => {
  const s = h / 1000;
  const rim = pal.rim ?? '#ffe0b8';
  const hip: P2 = sit ? [0, -470] : [0, -500];
  const rot = (p: P2): P2 => { const a = lean / DEG, dx = p[0] - hip[0], dy = p[1] - hip[1]; return [hip[0] + dx * Math.cos(a) - dy * Math.sin(a), hip[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const shN = rot([22, -806]), shF = rot([-8, -814]);
  const hc = rot([22, -930]);
  const L1 = 185, L2 = 165;
  const hn = handN ?? [shN[0] + 20, shN[1] + 330];
  const hf = handF ?? [shF[0] - 10, shF[1] + 330];
  const aN = ik2(shN[0], shN[1], hn[0], hn[1], L1, L2);
  const aF = ik2(shF[0], shF[1], hf[0], hf[1], L1, L2);
  const fN = footN ?? (sit ? [230, 0] : [24, 0]);
  const fF = footF ?? (sit ? [200, 0] : [-20, 0]);
  const legN = ik2(12, hip[1], fN[0], fN[1] - 26, 250, 236, 'front');
  const legF = ik2(-12, hip[1], fF[0], fF[1] - 26, 250, 236, 'front');
  const torso = (() => {
    const pts: P2[] = male
      ? [[-64, -822], [-58, -600], [-64, -470], [66, -470], [62, -620], [70, -800], [40, -832]]
      : [[-60, -818], [-56, -590], [-72, -462], [70, -462], [56, -580], [80, -706], [64, -800], [36, -828]];
    const r = pts.map(rot);
    return `M${r[0].join(' ')} ` + r.slice(1).map((p) => `L${p.join(' ')}`).join(' ') + ' Z';
  })();
  const arm = (sh: P2, a: { ex: number; ey: number; hx: number; hy: number }, near: boolean) => (
    <g>
      <path d={limb(sh[0], sh[1], a.ex, a.ey, 58, 46)} fill={near ? pal.top : pal.topD} />
      <path d={limb(a.ex, a.ey, a.hx, a.hy, 46, 34)} fill={near ? pal.top : pal.topD} />
      <path d={limb(a.ex + (a.hx - a.ex) * 0.72, a.ey + (a.hy - a.ey) * 0.72, a.hx, a.hy, 30, 28)} fill={near ? pal.skin : pal.skinD} />
      <Mitt x={a.hx} y={a.hy} ang={Math.atan2(a.hy - a.ey, a.hx - a.ex) * DEG} len={72} w={44} skin={near ? pal.skin : pal.skinD} shade={pal.skinD} thumb={-1} curl={0.3} />
      {near && <path d={`M${sh[0]} ${sh[1] - 28} L${a.ex} ${a.ey - 22}`} stroke={rim} strokeWidth={4} opacity={rimO * 0.6} />}
    </g>
  );
  const leg = (l: { ex: number; ey: number; hx: number; hy: number }, hx: number, near: boolean) => (
    <g>
      <path d={limb(hx, hip[1], l.ex, l.ey, 76, 56)} fill={near ? pal.bottom : pal.bottomD ?? pal.bottom} />
      <path d={limb(l.ex, l.ey, l.hx, l.hy, 56, 40)} fill={skirt ? (near ? pal.skin : pal.skinD) : near ? pal.bottom : pal.bottomD ?? pal.bottom} />
      <path d={`M${l.hx - 24} ${l.hy + 6} L${l.hx + 60} ${l.hy + 10} Q${l.hx + 72} ${l.hy + 26} ${l.hx + 56} ${l.hy + 30} L${l.hx - 26} ${l.hy + 30} Z`} fill={pal.shoe ?? '#1d1a1e'} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${dir * s} ${s})`}>
      {arm(shF, aF, false)}
      {holdF}
      {leg(legF, -12, false)}
      {leg(legN, 12, true)}
      {skirt && !sit && <path d={`M${rot([-64, -560]).join(' ')} L${rot([64, -560]).join(' ')} L110 -40 L-96 -40 Z`} fill={pal.bottom} />}
      {skirt && sit && <path d={`M-70 -560 L60 -560 L${fN[0] + 40} -420 L${fN[0] + 30} -60 L${fN[0] - 70} -60 L${fN[0] - 70} -380 L-80 -380 Z`} fill={pal.bottom} />}
      <path d={torso} fill={pal.top} />
      {pal.apron && <path d={`M${rot([40, -760]).join(' ')} L${rot([78, -700]).join(' ')} L${rot([62, -470]).join(' ')} L${rot([70, -300]).join(' ')} L${rot([10, -300]).join(' ')} L${rot([20, -560]).join(' ')} Z`} fill={pal.apron} />}
      <path d={`M${rot([-60, -818]).join(' ')} L${rot([-56, -590]).join(' ')}`} stroke={rim} strokeWidth={4} opacity={rimO * 0.5} />
      {/* neck + head */}
      <path d={limb(rot([14, -820])[0], rot([14, -820])[1], hc[0] - 6, hc[1] + 50, 40, 36)} fill={pal.skinD} />
      <g transform={`translate(${hc[0]} ${hc[1]}) rotate(${lean * 0.5 + headTilt})`}>
        {face === 'side' && <HeadSide kind={head} pal={pal} rim={rim} rimO={rimO} />}
        {face === 'back' && <g transform="scale(-1 1)"><HeadSide kind={head} pal={pal} rim={rim} rimO={rimO} /></g>}
        {face === 'front' && <HeadFront kind={head} pal={pal} rim={rim} rimO={rimO} eyes="open" />}
      </g>
      {arm(shN, aN, true)}
      {holdN}
    </g>
  );
};

/** local -> frame coords for a Side/Front figure (to place props in its hands) */
export const toFrame = (x: number, y: number, h: number, dir: 1 | -1, p: P2): P2 => [x + p[0] * dir * (h / 1000), y + p[1] * (h / 1000)];

/* ---------------- frontal upper body (behind a counter / shelf) ---------------- */
export type FrontProps = {
  x: number; y: number; h: number; pal: Pal; head: HeadKind; handL: P2; handR: P2; tilt?: number; headDy?: number;
  eyes?: 'none' | 'down' | 'open'; bob?: number; rimO?: number; cross?: boolean; mouth?: number;
};
/** frontal figure (origin feet), legs omitted (always behind furniture). L = screen-left. */
export const Front: React.FC<FrontProps> = ({ x, y, h, pal, head, handL, handR, tilt = 0, headDy = 0, eyes = 'none', bob = 0, rimO = 0.7, cross = false, mouth = 0 }) => {
  const s = h / 1000, rim = pal.rim ?? '#ffe0b8';
  const shL: P2 = [-104, -806], shR: P2 = [104, -806];
  const aL = ik2(shL[0], shL[1], handL[0], handL[1], 185, 165, 'out');
  const aR = ik2(shR[0], shR[1], handR[0], handR[1], 185, 165, 'out');
  const arm = (sh: P2, a: { ex: number; ey: number; hx: number; hy: number }, lit: boolean) => (
    <g>
      <path d={limb(sh[0], sh[1], a.ex, a.ey, 62, 50)} fill={lit ? pal.top : pal.topD} />
      <path d={limb(a.ex, a.ey, a.hx, a.hy, 50, 38)} fill={lit ? pal.top : pal.topD} />
      <path d={limb(a.ex + (a.hx - a.ex) * 0.74, a.ey + (a.hy - a.ey) * 0.74, a.hx, a.hy, 32, 30)} fill={pal.skin} />
      <Mitt x={a.hx} y={a.hy} ang={Math.atan2(a.hy - a.ey, a.hx - a.ex) * DEG} len={74} w={48} skin={pal.skin} shade={pal.skinD} thumb={sh[0] < 0 ? 1 : -1} curl={0.35} />
      {lit && <path d={`M${sh[0] - 26} ${sh[1]} L${a.ex - 24} ${a.ey}`} stroke={rim} strokeWidth={4} opacity={rimO * 0.6} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${s})`}>
      {!cross && arm(shR, aR, false)}
      {!cross && arm(shL, aL, true)}
      <path d="M-112 -812 Q0 -840 112 -812 L96 -580 L118 -300 L-118 -300 L-96 -580 Z" fill={pal.top} />
      <path d="M30 -830 Q90 -826 112 -812 L96 -580 L118 -300 L50 -300 Z" fill={pal.topD} opacity={0.55} />
      {pal.apron && <path d="M-70 -700 L70 -700 L84 -300 L-84 -300 Z" fill={pal.apron} />}
      {pal.apron && <path d="M-70 -700 L-100 -800 M70 -700 L100 -800" stroke={pal.apron} strokeWidth={10} />}
      <path d="M-112 -812 L-96 -580 L-118 -300" stroke={rim} strokeWidth={4} fill="none" opacity={rimO * 0.6} />
      <rect x={-20} y={-850} width={40} height={50} fill={pal.skinD} />
      <g transform={`translate(0 ${-930 + headDy}) rotate(${tilt})`}>
        <HeadFront kind={head} pal={pal} rim={rim} rimO={rimO} eyes={eyes} mouth={mouth} />
      </g>
      {cross && (
        <g>
          {arm(shL, aL, true)}
          {arm(shR, aR, false)}
        </g>
      )}
    </g>
  );
};
