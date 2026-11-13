import React from 'react';
import { W, H } from './world';

/**
 * EP01 set "train": a packed commuter-train car seen down the aisle (one-point perspective, camera at eye level).
 * Metric helper: pt(x, h, z) = world px of a point x m right of the aisle centre, h m above the floor, z m ahead.
 * Eye height 1.6 m sits on the horizon VP.y, so every standing adult's head lands near that line (real crowded-car photo look).
 */
export const VP = { x: 648, y: 900 };
const F = 1040; // px per metre at z = 1 m
const EYE = 1.6;
export const S = (z: number) => F / z;
export const pt = (x: number, h: number, z: number): [number, number] => [VP.x + (x * F) / z, VP.y - ((h - EYE) * F) / z];
const HW = 1.45; // half width of the car (m)
const CEIL = 2.3;
const ZN = 0.7, ZF = 8.6; // near plane / far end wall

export const TP = {
  ceil: '#e6e5de', ceilFar: '#cfd0ca', wall: '#d4d6cf', wallFar: '#c3c6c0', floor: '#8a8781', seat: '#5d7f99', seatTop: '#7698b1',
  window: '#f5f1e3', windowFar: '#ece8da', frame: '#9aa1a6', pole: '#b4bbc0', poleHi: '#eef2f4', ad: ['#c98f86', '#86a3b8', '#a7b58f', '#d4b77e'],
  light: '#fffdf4', strap: '#3a4048', door: '#b8bcb6',
};

const quad = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}L${d[0]} ${d[1]}Z`;

/** window spans along the car (z0, z1) */
export const WINS: [number, number][] = [[0.9, 1.9], [2.3, 3.4], [3.8, 4.9], [5.3, 6.4], [6.8, 7.9]];

/** baked interior: ceiling, walls with windows, benches, far door, fluorescent strips, rails, poles, blank ad panels */
export const TrainCar: React.FC = () => {
  const side = (sx: 1 | -1) => {
    const x = HW * sx;
    return (
      <g key={sx}>
        <path d={quad(pt(x, CEIL, ZN), pt(x, CEIL, ZF), pt(x, 0, ZF), pt(x, 0, ZN))} fill="url(#trWall)" />
        {/* blank ad panels above the windows */}
        {WINS.map(([a, b], i) => <path key={`a${i}`} d={quad(pt(x, 2.12, a + 0.1), pt(x, 2.12, b - 0.1), pt(x, 1.9, b - 0.1), pt(x, 1.9, a + 0.1))} fill={TP.ad[i % 4]} opacity={0.75} />)}
        {/* windows, bright day outside */}
        {WINS.map(([a, b], i) => (
          <g key={`w${i}`}>
            <path d={quad(pt(x, 1.86, a - 0.04), pt(x, 1.86, b + 0.04), pt(x, 0.9, b + 0.04), pt(x, 0.9, a - 0.04))} fill={TP.frame} />
            <path d={quad(pt(x, 1.82, a), pt(x, 1.82, b), pt(x, 0.94, b), pt(x, 0.94, a))} fill="url(#trWin)" />
            <path d={quad(pt(x, 1.82, (a + b) / 2 - 0.02), pt(x, 1.82, (a + b) / 2 + 0.02), pt(x, 0.94, (a + b) / 2 + 0.02), pt(x, 0.94, (a + b) / 2 - 0.02))} fill={TP.frame} />
          </g>
        ))}
        {/* longitudinal bench under the windows */}
        <path d={quad(pt(x, 0.95, ZN), pt(x, 0.95, ZF - 0.4), pt(x - 0.42 * sx, 0.46, ZF - 0.4), pt(x - 0.42 * sx, 0.46, ZN))} fill={TP.seat} />
        <path d={quad(pt(x - 0.42 * sx, 0.48, ZN), pt(x - 0.42 * sx, 0.48, ZF - 0.4), pt(x - 0.5 * sx, 0.42, ZF - 0.4), pt(x - 0.5 * sx, 0.42, ZN))} fill={TP.seatTop} />
        {/* overhead luggage rack */}
        <path d={quad(pt(x, 2.0, ZN), pt(x, 2.0, ZF), pt(x - 0.3 * sx, 1.98, ZF), pt(x - 0.3 * sx, 1.98, ZN))} fill={TP.frame} opacity={0.8} />
        {/* vertical poles at bench ends */}
        {[1.6, 3.6, 5.6, 7.6].map((z) => { const [px, py0] = pt(x - 0.5 * sx, 0, z); const [, py1] = pt(x - 0.5 * sx, CEIL, z); const w = 0.035 * S(z); return <g key={`p${z}`}><rect x={px - w / 2} y={py1} width={w} height={py0 - py1} fill={TP.pole} /><rect x={px - w * 0.3} y={py1} width={w * 0.25} height={py0 - py1} fill={TP.poleHi} /></g>; })}
      </g>
    );
  };
  const rail = (x: number) => <path d={quad(pt(x - 0.012, 2.02, ZN), pt(x - 0.012, 2.02, ZF), pt(x + 0.012, 2.0, ZF), pt(x + 0.012, 2.0, ZN))} fill={TP.pole} />;
  const [fx0, fy0] = pt(-HW, CEIL, ZF), [fx1, fy1] = pt(HW, 0, ZF);
  return (
    <g>
      <defs>
        <linearGradient id="trWall" gradientUnits="userSpaceOnUse" x1={pt(-HW, 1, ZN)[0]} y1="0" x2={VP.x} y2="0"><stop offset="0" stopColor={TP.wall} /><stop offset="1" stopColor={TP.wallFar} /></linearGradient>
        <linearGradient id="trCeil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TP.ceil} /><stop offset="1" stopColor={TP.ceilFar} /></linearGradient>
        <linearGradient id="trWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf8ee" /><stop offset="0.7" stopColor={TP.window} /><stop offset="1" stopColor="#d9dccf" /></linearGradient>
        <linearGradient id="trFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a968e" /><stop offset="1" stopColor="#6e6b66" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={TP.wallFar} />
      <path d={quad(pt(-HW, CEIL, ZN), pt(HW, CEIL, ZN), pt(HW, CEIL, ZF), pt(-HW, CEIL, ZF))} fill="url(#trCeil)" />
      <path d={quad(pt(-HW, 0, ZF), pt(HW, 0, ZF), pt(HW, 0, ZN), pt(-HW, 0, ZN))} fill="url(#trFloor)" />
      {side(-1)}{side(1)}
      {/* fluorescent strips along the ceiling */}
      {[-0.35, 0.35].map((x) => <path key={x} d={quad(pt(x - 0.06, CEIL - 0.02, ZN), pt(x - 0.06, CEIL - 0.02, ZF - 0.3), pt(x + 0.06, CEIL - 0.02, ZF - 0.3), pt(x + 0.06, CEIL - 0.02, ZN))} fill={TP.light} />)}
      {rail(-0.55)}{rail(0.55)}
      {/* far end wall with the gangway door (bright window) */}
      <rect x={fx0} y={fy0} width={fx1 - fx0} height={fy1 - fy0} fill={TP.wallFar} />
      <rect x={VP.x - 0.42 * S(ZF)} y={pt(0, 2.0, ZF)[1]} width={0.84 * S(ZF)} height={2.0 * S(ZF)} fill={TP.door} />
      <rect x={VP.x - 0.3 * S(ZF)} y={pt(0, 1.85, ZF)[1]} width={0.6 * S(ZF)} height={0.75 * S(ZF)} fill="#fbf8ee" />
    </g>
  );
};

/* ------------------------------------------------------------------ live: strobing window light + straps */
/** pylons outside sweep past each window (on ones): returns a darkness 0..1 per window index */
export const strobe = (t: number, i: number) => {
  const ph = (t * 2.6 - i * 0.22) % 1;
  return ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
};
export const WindowStrobe: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[-1, 1].map((sx) => WINS.map(([a, b], i) => {
      const x = HW * sx; const d = strobe(t, i);
      return d > 0.01 ? <path key={`${sx}${i}`} d={quad(pt(x, 1.82, a), pt(x, 1.82, b), pt(x, 0.94, b), pt(x, 0.94, a))} fill="#6f7a82" opacity={0.55 * d} /> : null;
    }))}
  </g>
);
/** hanging ring straps along both rails (sway with the car, on ones) */
export const Straps: React.FC<{ t: number; skip?: (x: number, z: number) => boolean }> = ({ t, skip }) => (
  <g>
    {[-0.55, 0.55].map((x) => [1.15, 1.55, 1.95, 2.4, 2.85, 3.3, 3.8, 4.4, 5.0, 5.7, 6.5, 7.4].map((z) => {
      if (skip?.(x, z)) return null;
      const [ax, ay] = pt(x, 2.01, z); const s = S(z); const a = Math.sin(t * 1.9 + z * 0.7) * 5;
      return (
        <g key={`${x}${z}`} transform={`translate(${ax} ${ay}) rotate(${a})`}>
          <rect x={-0.012 * s} y={0} width={0.024 * s} height={0.2 * s} fill={TP.strap} />
          <circle cx={0} cy={0.25 * s} r={0.05 * s} fill="none" stroke="#e9e6dc" strokeWidth={0.014 * s} />
        </g>
      );
    }))}
  </g>
);

/* ------------------------------------------------------------------ live: commuters (on twos) */
export type Look = 'hijab' | 'man' | 'woman';
export type Person = {
  x: number; z: number; look: Look; shirt: string; scarf?: string; hair?: string; skin?: string;
  face: 'front' | 'back' | 'left' | 'right'; arm: 'up' | 'down' | 'phone'; armSide?: 1 | -1; ph: number; h?: number; bag?: boolean;
};
const SKIN = '#b07a5e', SKIN_D = '#7a4f3e', HAIR = '#1d1a1a';
const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('');
};

/**
 * One commuter in metres (local: x right, y up from the floor, drawn with y negated), placed by pt() and scaled by S(z).
 * t2 = character clock (on twos). `rim` = window light strength on the edges (environment, on ones). `nod` 0..1 head droop (hero).
 */
export const Commuter: React.FC<{ p: Person; t2: number; rim: number; haze?: number; nod?: number; eyes?: number; hero?: boolean }> = ({ p, t2, rim, haze = 0, nod = 0, eyes = 1, hero }) => {
  const [X, Y] = pt(p.x, 0, p.z); const s = S(p.z);
  const sway = Math.sin(t2 * 2.3 + p.ph) * 1.4 + Math.sin(t2 * 5.1 + p.ph * 2) * 0.35; // degrees, around the feet
  const hh = p.h ?? (p.look === 'man' ? 1.7 : 1.6);
  const k = hh / 1.65;
  const c = (col: string) => (haze > 0 ? mix(col, '#c7c9c2', haze) : col);
  const skin = c(p.skin ?? SKIN), skinD = c(SKIN_D), hair = c(p.hair ?? HAIR), shirt = c(p.shirt), scarf = c(p.scarf ?? '#2f3a55');
  const shY = -1.4 * k, shW = (p.look === 'man' ? 0.22 : 0.19) * k, waistY = -0.98 * k, waistW = 0.16 * k;
  const headY = -1.56 * k - (hh - 1.65) * 0.1, hr = 0.1 * k;
  const nodA = nod * 14; // head droop (deg)
  const as = p.armSide ?? 1;
  const arm = (side: 1 | -1, up: boolean) => {
    const sx = side * shW * 0.88, sy = shY + 0.04;
    if (up) {
      const hx = side * 0.12 * k, hy = -1.8;
      return { pts: [[sx, sy], [side * (shW + 0.07), -1.62 * k], [hx, hy]], hand: [hx, hy] };
    }
    if (p.arm === 'phone' && side === as) return { pts: [[sx, sy], [side * (shW + 0.02), -1.12 * k], [side * 0.04, -1.2 * k]], hand: [side * 0.04, -1.2 * k] };
    return { pts: [[sx, sy], [side * (shW + 0.04), -1.12 * k], [side * (shW - 0.01), -0.88 * k]], hand: [side * (shW - 0.01), -0.88 * k] };
  };
  const arms = [arm(as, p.arm === 'up'), arm((-as) as 1 | -1, false)];
  const back = p.face === 'back';
  const drawArm = (a: ReturnType<typeof arm>, i: number) => (
    <g key={i}>
      <path d={`M${a.pts[0][0]} ${a.pts[0][1]} L${a.pts[1][0]} ${a.pts[1][1]} L${a.pts[2][0]} ${a.pts[2][1]}`} stroke={shirt} strokeWidth={0.085 * k} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${a.pts[1][0]} ${a.pts[1][1]} L${a.pts[2][0]} ${a.pts[2][1]}`} stroke={p.arm === 'up' && i === 0 && p.look !== 'hijab' ? skin : shirt} strokeWidth={0.07 * k} strokeLinecap="round" fill="none" />
      <ellipse cx={a.hand[0]} cy={a.hand[1]} rx={0.045 * k} ry={0.055 * k} fill={skin} />
      {hero && <path d={`M${a.hand[0] - 0.015 * k} ${a.hand[1] + 0.005 * k} L${a.hand[0] - 0.005 * k} ${a.hand[1] + 0.04 * k}`} stroke={skinD} strokeWidth={0.006 * k} />}
      {p.arm === 'up' && i === 0 && <g><rect x={a.hand[0] - 0.012} y={-2.08} width={0.024} height={2.08 + a.hand[1] - 0.05} fill={c(TP.strap)} /><circle cx={a.hand[0]} cy={a.hand[1] - 0.02} r={0.05} fill="none" stroke={c('#e9e6dc')} strokeWidth={0.014} /></g>}
    </g>
  );
  const eyeL = (ex: number) => {
    const ey = headY + 0.008;
    const open = 0.012 * eyes;
    return (
      <g key={ex}>
        <path d={`M${ex - 0.024} ${ey - 0.006} Q${ex} ${ey - 0.016} ${ex + 0.024} ${ey - 0.006} L${ex + 0.024} ${ey - 0.002 + open * 0.2} Q${ex} ${ey - 0.008 + open} ${ex - 0.024} ${ey - 0.002 + open * 0.2} Z`} fill={skinD} opacity={0.55} />
        <path d={`M${ex - 0.022} ${ey} Q${ex} ${ey + open} ${ex + 0.022} ${ey}`} stroke="#3a2a22" strokeWidth={0.006} fill="none" strokeLinecap="round" />
        <path d={`M${ex - 0.02} ${ey + 0.016} Q${ex} ${ey + 0.022} ${ex + 0.02} ${ey + 0.016}`} stroke={skinD} strokeWidth={0.004} fill="none" opacity={0.6} />
        <path d={`M${ex - 0.026} ${ey - 0.03} Q${ex} ${ey - 0.034 + 0.006 * (1 - eyes)} ${ex + 0.026} ${ey - 0.026}`} stroke={hair} strokeWidth={0.007} fill="none" />
      </g>
    );
  };
  const turned = p.face === 'left' ? -1 : p.face === 'right' ? 1 : 0;
  return (
    <g transform={`translate(${X} ${Y}) scale(${s}) rotate(${sway})`}>
      {/* lower body (mostly hidden in the crowd) */}
      <path d={`M${-waistW} ${waistY} L${waistW} ${waistY} L${0.13 * k} 0 L${-0.13 * k} 0 Z`} fill={c(p.look === 'man' ? '#2e3138' : '#3a3540')} />
      {/* torso */}
      <path d={`M${-shW} ${shY + 0.03} Q0 ${shY - 0.04} ${shW} ${shY + 0.03} L${waistW * 1.05} ${waistY - 0.02} L${-waistW * 1.05} ${waistY - 0.02} Z`} fill={shirt} />
      {p.bag && <g fill={c('#2b2e33')}>{back ? <rect x={-0.15 * k} y={shY + 0.06} width={0.3 * k} height={0.36 * k} rx={0.05} /> : <><rect x={-shW * 0.78} y={shY + 0.02} width={0.035 * k} height={0.34 * k} /><rect x={shW * 0.78 - 0.035 * k} y={shY + 0.02} width={0.035 * k} height={0.34 * k} /></>}</g>}
      {arms.map(drawArm)}
      {/* neck + head */}
      <g transform={`rotate(${nodA * (turned || 1) * 0.6} 0 ${shY - 0.02}) translate(0 ${nod * 0.03})`}>
        {p.look === 'hijab' ? (
          <g>
            <path d={`M${-0.13 * k} ${headY - 0.02} Q${-0.15 * k} ${shY + 0.06} ${-shW * 1.02} ${shY + 0.16} L${shW * 1.02} ${shY + 0.16} Q${0.15 * k} ${shY + 0.06} ${0.13 * k} ${headY - 0.02} Z`} fill={scarf} />
            <ellipse cx={0} cy={headY - 0.01} rx={hr * 1.22} ry={hr * 1.38} fill={scarf} />
            {!back && <ellipse cx={turned * 0.03} cy={headY + 0.015} rx={hr * 0.72} ry={hr * 0.92} fill={skin} />}
            {!back && <path d={`M${turned * 0.03 - hr * 0.72} ${headY - 0.03} Q${turned * 0.03} ${headY - hr * 1.0} ${turned * 0.03 + hr * 0.72} ${headY - 0.03}`} stroke={c(mix(p.scarf ?? '#2f3a55', '#000000', 0.25))} strokeWidth={0.012} fill="none" />}
          </g>
        ) : (
          <g>
            <rect x={-0.045 * k} y={shY - 0.1} width={0.09 * k} height={0.13} fill={skinD} />
            <ellipse cx={0} cy={headY} rx={hr * 0.92} ry={hr * 1.15} fill={back ? hair : skin} />
            {!back && <path d={`M${-hr * 0.95 + turned * 0.02} ${headY + 0.01} Q${-hr * 1.02} ${headY - hr * 1.3} ${turned * 0.03} ${headY - hr * 1.24} Q${hr * 1.02} ${headY - hr * 1.3} ${hr * 0.95 + turned * 0.02} ${headY + 0.01} Q${hr * 0.7} ${headY - hr * 0.62} ${hr * 0.1} ${headY - hr * 0.72} Q${-hr * 0.5} ${headY - hr * 0.55} ${-hr * 0.95 + turned * 0.02} ${headY + 0.01} Z`} fill={hair} />}
            {p.look === 'woman' && <path d={`M${-hr * 0.95} ${headY - 0.03} Q${-hr * 1.2} ${headY + 0.12} ${-hr * 0.8} ${shY + 0.05} L${hr * 0.8} ${shY + 0.05} Q${hr * 1.2} ${headY + 0.12} ${hr * 0.95} ${headY - 0.03} Z`} fill={hair} opacity={back ? 1 : 0.9} />}
            {turned !== 0 && !back && <ellipse cx={turned * hr * 0.85} cy={headY + 0.01} rx={0.02} ry={0.03} fill={skinD} />}
          </g>
        )}
        {hero && !back && [-0.038, 0.038].map(eyeL)}
        {hero && <path d={`M-0.018 ${headY + 0.07} Q0 ${headY + 0.065} 0.018 ${headY + 0.07}`} stroke={skinD} strokeWidth={0.008} fill="none" />}
      </g>
      {/* window light on both shoulders (strobes with the pylons, on ones) */}
      {rim > 0.01 && (
        <g stroke="#fff6e0" strokeOpacity={0.55 * rim * (1 - haze)} strokeWidth={0.014 * k} fill="none" strokeLinecap="round">
          <path d={`M${-shW * 0.4} ${shY - 0.02} Q${-shW * 0.95} ${shY} ${-shW} ${shY + 0.12}`} />
          <path d={`M${shW * 0.4} ${shY - 0.02} Q${shW * 0.95} ${shY} ${shW} ${shY + 0.12}`} />
        </g>
      )}
    </g>
  );
};

/** the crowd, far to near (painter's order) */
export const CROWD: Person[] = [
  // far rows (hazy)
  { x: -0.75, z: 7.6, look: 'hijab', shirt: '#7b6d78', scarf: '#8a6f7a', face: 'left', arm: 'up', ph: 0.2 },
  { x: -0.25, z: 7.9, look: 'man', shirt: '#7a8ca0', face: 'back', arm: 'up', ph: 1.1 },
  { x: 0.3, z: 7.4, look: 'man', shirt: '#9a8a6e', face: 'right', arm: 'down', ph: 2.0 },
  { x: 0.8, z: 7.7, look: 'hijab', shirt: '#5d6b7a', scarf: '#3d4a62', face: 'front', arm: 'up', ph: 0.6 },
  { x: -0.95, z: 6.4, look: 'man', shirt: '#4f5d6e', face: 'front', arm: 'up', armSide: -1, ph: 2.6 },
  { x: -0.4, z: 6.6, look: 'hijab', shirt: '#7a6a5a', scarf: '#c9b79a', face: 'back', arm: 'up', ph: 1.7 },
  { x: 0.15, z: 6.2, look: 'man', shirt: '#d9d6cc', face: 'left', arm: 'up', ph: 0.9 },
  { x: 0.7, z: 6.5, look: 'woman', shirt: '#8a6a7a', face: 'right', arm: 'down', ph: 2.3 },
  // row ~5 m
  { x: -1.0, z: 5.0, look: 'woman', shirt: '#a35f55', face: 'right', arm: 'phone', ph: 1.4 },
  { x: -0.5, z: 4.8, look: 'man', shirt: '#7a5236', face: 'front', arm: 'up', ph: 0.3 },
  { x: 0.02, z: 5.1, look: 'hijab', shirt: '#4a5568', scarf: '#b88a8f', face: 'left', arm: 'up', armSide: -1, ph: 2.2 },
  { x: 0.5, z: 4.7, look: 'man', shirt: '#8fa6c0', face: 'back', arm: 'up', armSide: -1, ph: 1.0, bag: true },
  { x: 1.0, z: 4.9, look: 'hijab', shirt: '#6a5a4a', scarf: '#2f3a55', face: 'left', arm: 'down', ph: 2.8 },
  // row ~3.5 m
  { x: -0.95, z: 3.6, look: 'hijab', shirt: '#55606e', scarf: '#22232a', face: 'right', arm: 'up', ph: 2.9 },
  { x: -0.4, z: 3.3, look: 'man', shirt: '#c9c4b4', face: 'left', arm: 'phone', ph: 1.9 },
  { x: 0.3, z: 3.4, look: 'hijab', shirt: '#7a6070', scarf: '#c9a37a', face: 'front', arm: 'up', armSide: -1, ph: 0.8 },
  { x: 0.9, z: 3.2, look: 'man', shirt: '#e3e0d6', face: 'left', arm: 'phone', armSide: -1, ph: 0.5 },
  // row ~2.3 m, right behind the hero
  { x: -0.68, z: 2.35, look: 'man', shirt: '#5d6a5a', face: 'right', arm: 'up', armSide: -1, ph: 1.2, bag: true },
  { x: 0.62, z: 2.2, look: 'hijab', shirt: '#3e4656', scarf: '#9a6a74', face: 'left', arm: 'up', ph: 2.5 },
];
/** the hero: tired office worker, centre */
export const HERO: Person = { x: 0.0, z: 1.45, look: 'man', shirt: '#9db5cf', face: 'front', arm: 'up', armSide: 1, ph: 0, bag: true, h: 1.68 };
/** framing commuters at the frame edges (closest, darker) */
export const FRONT: Person[] = [
  { x: -0.66, z: 1.0, look: 'hijab', shirt: '#4a3d4a', scarf: '#56604f', face: 'right', arm: 'down', ph: 1.6 },
  { x: 0.7, z: 1.02, look: 'man', shirt: '#4e3a2c', face: 'back', arm: 'down', ph: 2.4 },
];
