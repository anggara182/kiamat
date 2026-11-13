import React from 'react';
import { W, H, rng } from './world';
import { loadFont } from '@remotion/google-fonts/Oswald';

const { fontFamily: OSWALD } = loadFont('normal', { weights: ['700'], subsets: ['latin'] });

/* ------------------------------------------------------------------------------------------
 * EP03 set "boulevard": one big city boulevard with a flyover.
 * High view (S06 crowd, S13 curfew): camera 22 m up, level, looking down the boulevard.
 * ---------------------------------------------------------------------------------------- */
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
export const HZ = '#e6e8ea';
export const V = { f: 1000, hc: 22, YH: 620, VX: 648, half: 18, flyZ: 70 };
export const vp = (X: number, Y: number, Z: number): [number, number] => [V.VX + (V.f * X) / Z, V.YH + (V.f * (V.hc - Y)) / Z];
const P = (X: number, Y: number, Z: number) => vp(X, Y, Z).map((v) => v.toFixed(1)).join(',');
const q4 = (a: number[], b: number[], c: number[], d: number[]) => `${P(a[0], a[1], a[2])} ${P(b[0], b[1], b[2])} ${P(c[0], c[1], c[2])} ${P(d[0], d[1], d[2])}`;
const hz = (c: string, z: number) => mix(c, HZ, Math.min(0.85, z / 260));

export const DayBand: React.FC = () => {
  const r = rng(301);
  const blocks: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    let z = 10, i = 0;
    while (z < 420) {
      const len = 14 + r() * 26, h = 14 + r() * 40, x0 = side * (V.half + 1.5), x1 = side * (V.half + 22), z1 = z + len;
      const face = hz(side < 0 ? '#a49d90' : '#c8c1b3', z), front = hz(side < 0 ? '#bdb6a8' : '#8f887b', z), win = hz('#6f6a62', z);
      blocks.push(
        <g key={`${side}${i}`}>
          <polygon points={q4([x0, 0, z], [x0, h, z], [x0, h, z1], [x0, 0, z1])} fill={face} />
          <polygon points={q4([x0, h, z], [x1, h, z], [x1, h, z1], [x0, h, z1])} fill={hz('#d6d0c4', z)} />
          <polygon points={q4([x0, 0, z], [x0, h, z], [x1, h, z], [x1, 0, z])} fill={front} />
          {Array.from({ length: Math.floor(h / 3.5) }, (_, k) => <polygon key={k} points={q4([x0, 3 + k * 3.5, z + 1], [x0, 4.4 + k * 3.5, z + 1], [x0, 4.4 + k * 3.5, z1 - 1], [x0, 3 + k * 3.5, z1 - 1])} fill={win} opacity={0.55} />)}
        </g>,
      );
      z = z1 + 2 + r() * 6;
      i++;
    }
  }
  blocks.reverse();
  const towers: React.ReactNode[] = [];
  let x = -40;
  while (x < W + 40) { const w = 50 + r() * 90, h = 120 + r() * 300; towers.push(<rect key={x} x={x} y={V.YH - h} width={w} height={h + 10} fill={r() < 0.5 ? '#c9ccce' : '#bfc3c6'} />); x += w + 10 + r() * 40; }
  const lanes: React.ReactNode[] = [];
  for (const X of [-13.5, -9, -4.5, 4.5, 9, 13.5]) for (let z = 12; z < 400; z += 12) lanes.push(<polygon key={`${X}${z}`} points={q4([X - 0.12, 0, z], [X + 0.12, 0, z], [X + 0.12, 0, z + 4], [X - 0.12, 0, z + 4])} fill={hz('#e8e4d8', z)} />);
  const lamps: React.ReactNode[] = [];
  for (let z = 16; z < 300; z += 24) { const [bx, by] = vp(0, 0, z), [, ty] = vp(0, 10, z), s = V.f / z; lamps.push(<g key={z} stroke={hz('#4a4a4e', z)} strokeWidth={Math.max(1, 0.3 * s)}><path d={`M ${bx} ${by} L ${bx} ${ty} M ${bx - 2 * s} ${ty} L ${bx + 2 * s} ${ty}`} /></g>); }
  const Z = V.flyZ;
  const piers = [-24, -8, 8, 24].map((X) => <polygon key={X} points={q4([X - 1, 0, Z + 4], [X - 1, 8, Z + 4], [X + 1, 8, Z + 4], [X + 1, 0, Z + 4])} fill={hz('#8f8a80', Z)} />);
  return (
    <g>
      <defs><linearGradient id="bvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6dade" /><stop offset="1" stopColor={HZ} /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bvSky)" />
      {towers}
      <rect x={0} y={V.YH - 30} width={W} height={60} fill={HZ} opacity={0.7} />
      {/* ground: road + median + sidewalks */}
      <rect x={0} y={V.YH} width={W} height={H - V.YH} fill="#a7a299" />
      <polygon points={q4([-V.half, 0, 8], [-V.half, 0, 900], [V.half, 0, 900], [V.half, 0, 8])} fill="#8e8a84" />
      <polygon points={q4([-0.8, 0, 8], [-0.8, 0, 900], [0.8, 0, 900], [0.8, 0, 8])} fill="#b8b2a6" />
      {lanes}
      {blocks}
      {lamps}
      {/* flyover crossing the boulevard */}
      {piers}
      <polygon points={q4([-200, 8, Z], [-200, 10.5, Z], [200, 10.5, Z], [200, 8, Z])} fill={hz('#9a958b', Z)} />
      <polygon points={q4([-200, 10.5, Z], [-200, 11.5, Z], [200, 11.5, Z], [200, 10.5, Z])} fill={hz('#b3ada2', Z)} />
      <polygon points={q4([-200, 8, Z], [-200, 8, Z + 12], [200, 8, Z + 12], [200, 8, Z])} fill={hz('#6f6b64', Z)} />
    </g>
  );
};

/* ---- the crowd as perspective rows of dotted strokes: heads + shoulders + raised arms. People = ON TWOS ---- */
const SHIRTS = ['#3a4a5a', '#d8d4c8', '#6a3a32', '#2f3530', '#8a7a5a', '#4a3a52', '#9a4a3a', '#e8e2d2'];
export const Crowd: React.FC<{ t2: number; surge: number; z0?: number; z1?: number }> = ({ t2, surge, z0 = 13, z1 = 150 }) => {
  const rows: React.ReactNode[] = [];
  const r = rng(311);
  for (let z = z1; z >= z0; z -= z < 40 ? 0.85 : z < 80 ? 1.3 : 2.2) {
    const s = V.f / z;
    const zz = z - surge * 1.2; // the whole sea of people leans forward on the surge
    const [xl, y] = vp(-V.half + 0.4, 1.45, zz), [xr] = vp(V.half - 0.4, 1.45, zz);
    const gap = 0.62 * s, ph = (r() * gap + Math.sin(t2 * 2.4 + z) * 0.08 * s) % gap;
    const headR = Math.max(1, 0.12 * s), shW = Math.max(1.4, 0.42 * s);
    const fadeC = (c: string) => mix(c, HZ, Math.min(0.7, z / 200));
    const shoulders = [0, 1, 2].map((k) => (
      <path key={k} d={`M ${xl} ${y + 0.28 * s} L ${xr} ${y + 0.28 * s}`} stroke={fadeC(SHIRTS[(Math.floor(z * 3) + k * 3) % SHIRTS.length])} strokeWidth={0.36 * s} strokeDasharray={`${shW} ${gap * 3 - shW}`} strokeDashoffset={-ph - k * gap} strokeLinecap="round" />
    ));
    rows.push(
      <g key={z.toFixed(2)}>
        {shoulders}
        <path d={`M ${xl} ${y} L ${xr} ${y}`} stroke={fadeC('#221a16')} strokeWidth={headR * 2} strokeDasharray={`0.01 ${gap}`} strokeDashoffset={-ph} strokeLinecap="round" />
      </g>,
    );
    // raised arms / fists in near rows (more on the surge)
    if (z < 70) {
      const n = Math.floor((xr - xl) / (gap * (surge > 0.2 ? 2.2 : 6)));
      let d = '';
      for (let k = 0; k < n; k++) {
        const ax = xl + ((k * 2.618 * gap + z * 37) % (xr - xl)), up = (0.45 + 0.2 * Math.sin(t2 * 5 + k + z)) * s;
        d += `M ${ax.toFixed(1)} ${(y + 0.1 * s).toFixed(1)} l ${(0.08 * s).toFixed(1)} ${(-up).toFixed(1)} `;
      }
      if (d) rows.push(<path key={`a${z.toFixed(2)}`} d={d} stroke={fadeC('#5a3f30')} strokeWidth={Math.max(1, 0.1 * s)} strokeLinecap="round" />);
    }
  }
  return <g>{rows}</g>;
};

/** flags without symbols on poles in the crowd (cloth = environment: ON ONES) */
export const Flags: React.FC<{ t: number; lift?: number }> = ({ t, lift = 0 }) => {
  const F: [number, number, string][] = [[-12, 22, '#f2efe6'], [7, 26, '#3f7a5a'], [-4, 34, '#e08a3a'], [14, 40, '#f2efe6'], [-15, 48, '#4f6f8a'], [2, 55, '#e08a3a'], [10, 62, '#3f7a5a'], [-8, 18, '#e08a3a'], [16, 30, '#4f6f8a']];
  return (
    <g>
      {F.map(([X, Z, c], i) => {
        const s = V.f / Z, [bx, by] = vp(X, 1.6, Z), top = by - (2.6 + 0.4 * lift) * s;
        const w = 1.3 * s, h = 0.85 * s, k = Math.sin(t * 6 + i), k2 = Math.sin(t * 6 + i + 1.4);
        return (
          <g key={i}>
            <path d={`M ${bx} ${by} L ${bx} ${top}`} stroke="#3a3430" strokeWidth={Math.max(1, 0.05 * s)} />
            <path d={`M ${bx} ${top} Q ${bx + w * 0.5} ${top + k * 0.18 * s} ${bx + w} ${top + k2 * 0.12 * s} L ${bx + w} ${top + h + k2 * 0.12 * s} Q ${bx + w * 0.5} ${top + h + k * 0.18 * s} ${bx} ${top + h} Z`} fill={c} />
            <path d={`M ${bx + w * 0.45} ${top + k * 0.18 * s * 0.9} L ${bx + w * 0.45} ${top + h + k * 0.18 * s * 0.9}`} stroke="#000" strokeWidth={0.12 * s} opacity={0.12} />
          </g>
        );
      })}
    </g>
  );
};

/** flare smoke plumes (red / white), rising and drifting; bright flare at the base (environment, ON ONES) */
export const Flares: React.FC<{ t: number; spots: [number, number, string][] }> = ({ t, spots }) => (
  <g>
    {spots.map(([X, Z, c], i) => {
      const s = V.f / Z, [bx, by] = vp(X, 2.2, Z);
      const puffs = Array.from({ length: 9 }, (_, k) => {
        const u = (((t * 0.35 + k / 9 + i * 0.13) % 1) + 1) % 1;
        return <circle key={k} cx={bx + u * 4 * s + Math.sin(t + k) * 0.3 * s} cy={by - u * 9 * s} r={(0.6 + u * 2.6) * s} fill={c} opacity={0.5 * (1 - u)} />;
      });
      return (
        <g key={i}>
          {puffs}
          <circle cx={bx} cy={by} r={0.5 * s} fill="#ffe2c0" opacity={0.6 + 0.4 * Math.sin(t * 40 + i)} />
          <circle cx={bx} cy={by} r={0.2 * s} fill="#ffffff" />
        </g>
      );
    })}
  </g>
);

/* ------------------------------------ curfew props (S13) ------------------------------------ */
export const BurntCar: React.FC<{ X: number; Z: number; t: number }> = ({ X, Z, t }) => {
  const s = V.f / Z, [x, y] = vp(X, 0, Z);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={3.4 * s} ry={1.1 * s} fill="#2a2420" opacity={0.6} />
      <path d={`M ${x - 2.2 * s} ${y} L ${x - 2.3 * s} ${y - 0.9 * s} L ${x - 1.2 * s} ${y - 1.0 * s} L ${x - 0.7 * s} ${y - 1.6 * s} L ${x + 0.9 * s} ${y - 1.6 * s} L ${x + 1.4 * s} ${y - 1.0 * s} L ${x + 2.3 * s} ${y - 0.9 * s} L ${x + 2.2 * s} ${y} Z`} fill="#2e2a28" />
      <path d={`M ${x - 0.6 * s} ${y - 1.5 * s} L ${x + 0.8 * s} ${y - 1.5 * s} L ${x + 1.2 * s} ${y - 1.05 * s} L ${x - 1.0 * s} ${y - 1.05 * s} Z`} fill="#141210" />
      <path d={`M ${x - 2.2 * s} ${y - 0.7 * s} L ${x + 2.2 * s} ${y - 0.7 * s}`} stroke="#6a4a3a" strokeWidth={0.12 * s} opacity={0.7} />
      {[-1.4, 1.4].map((d) => <ellipse key={d} cx={x + d * s} cy={y - 0.1 * s} rx={0.4 * s} ry={0.32 * s} fill="#0e0c0b" />)}
      {Array.from({ length: 6 }, (_, k) => { const u = (((t * 0.25 + k / 6) % 1) + 1) % 1; return <circle key={k} cx={x + 0.2 * s + u * 2 * s} cy={y - 1.6 * s - u * 5 * s} r={(0.3 + u * 1.2) * s} fill="#6f6a66" opacity={0.35 * (1 - u)} />; })}
    </g>
  );
};

/** paper litter tumbling across the empty road (environment, ON ONES) */
export const Litter: React.FC<{ t: number }> = ({ t }) => {
  const r = rng(321);
  const L = Array.from({ length: 14 }, () => ({ X: -16 + r() * 32, Z: 16 + r() * 40, v: 2 + r() * 3, ph: r() * 6, c: r() < 0.5 ? '#efece4' : '#d9cfb8' }));
  return (
    <g>
      {L.map((l, i) => {
        const X = -18 + ((((l.X + 18 + l.v * t) % 36) + 36) % 36), s = V.f / l.Z, [x, y] = vp(X, 0.15 + Math.abs(Math.sin(t * 5 + l.ph)) * 0.4, l.Z);
        return <rect key={i} x={x - 0.18 * s} y={y - 0.12 * s} width={0.36 * s} height={0.24 * s} fill={l.c} transform={`rotate(${t * 300 + l.ph * 60} ${x} ${y})`} />;
      })}
    </g>
  );
};

/** a stray dog trotting (animal = ON TWOS), side view, ground at (x,y) */
export const Dog: React.FC<{ x: number; y: number; s: number; t2: number; dir?: number }> = ({ x, y, s, t2, dir = 1 }) => {
  const ph = Math.sin(t2 * 11), c = '#5a4a3a';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} fill={c}>
      <ellipse cx={0} cy={2} rx={34} ry={4} fill="#2a2420" opacity={0.3} />
      <path d={`M -30 -34 Q -10 ${-42 - ph} 22 -38 Q 30 -36 30 -28 Q 10 -22 -28 -24 Z`} />
      <path d={`M 22 -38 L 34 -50 Q 42 -54 48 -48 L 50 -42 L 40 -38 L 30 -30 Z`} />
      <path d="M 36 -50 L 38 -58 L 42 -50 Z" />
      <path d={`M 22 -28 L ${26 + ph * 7} 0 M 16 -28 L ${18 - ph * 6} 0 M -22 -28 L ${-26 - ph * 7} 0 M -16 -28 L ${-12 + ph * 6} 0`} stroke={c} strokeWidth={4} strokeLinecap="round" />
      <path d={`M -30 -32 Q -42 ${-40 + ph * 3} -46 ${-30 + ph * 4}`} stroke={c} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------ flyover low angle (S07) ------------------------------------ */
export const FLY = { top: 560, face: 640, bottom: 880 };
export const FlyBand: React.FC = () => {
  const r = rng(331);
  return (
    <g>
      <defs><linearGradient id="bfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd4d8" /><stop offset="1" stopColor={HZ} /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bfSky)" />
      {/* city behind and below, hazy */}
      {Array.from({ length: 12 }, (_, i) => { const w = 90 + r() * 120, h = 300 + r() * 700; return <rect key={i} x={i * 115 - 40} y={1500 - h} width={w} height={h + 900} fill={i % 2 ? '#c4c6c4' : '#b8bbba'} />; })}
      {/* piers */}
      <polygon points={`210,${FLY.bottom} 330,${FLY.bottom} 360,2400 180,2400`} fill="#8a857c" />
      <polygon points={`950,${FLY.bottom} 1070,${FLY.bottom} 1110,2400 920,2400`} fill="#7d786f" />
      {/* deck seen from below: underside, face, parapet */}
      <polygon points={`-40,${FLY.bottom} ${W + 40},${FLY.bottom} ${W + 40},${FLY.bottom + 70} -40,${FLY.bottom + 90}`} fill="#5f5b55" />
      <rect x={-40} y={FLY.face} width={W + 80} height={FLY.bottom - FLY.face} fill="#9a958b" />
      <rect x={-40} y={FLY.top} width={W + 80} height={FLY.face - FLY.top} fill="#b3ada2" />
      <rect x={-40} y={FLY.top - 6} width={W + 80} height={8} fill="#f4f1e8" opacity={0.7} />
      <rect x={-40} y={FLY.face - 6} width={W + 80} height={10} fill="#77736c" />
    </g>
  );
};

/** long cloth banner hung along the parapet, sagging and waving (ON ONES); text exactly as given */
export const Banner: React.FC<{ x0: number; x1: number; y: number; h: number; text: string; bg: string; fg: string; t: number; ph: number; size: number }> = ({ x0, x1, y, h, text, bg, fg, t, ph, size }) => {
  const n = 8, pts: string[] = [];
  for (let i = 0; i <= n; i++) { const u = i / n, x = x0 + (x1 - x0) * u; pts.push(`${x},${y + h + Math.sin(t * 2.6 + u * 6 + ph) * 14 + Math.sin(u * Math.PI) * 26}`); }
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <path d={`M ${x0} ${y} L ${x1} ${y} L ${pts.slice().reverse().join(' L ')} Z`} fill={bg} />
      {Array.from({ length: 6 }, (_, i) => { const x = x0 + ((i + 0.5) / 6) * (x1 - x0) + Math.sin(t * 2 + i + ph) * 10; return <rect key={i} x={x - 14} y={y} width={28} height={h + 20} fill="#000" opacity={0.06 + 0.04 * Math.sin(t * 2.6 + i + ph)} />; })}
      <text x={mid} y={y + h * 0.5 + size * 0.35 + Math.sin(t * 2.6 + ph) * 4} fill={fg} fontFamily={OSWALD} fontWeight={700} fontSize={size} textAnchor="middle" letterSpacing={4}>{text}</text>
      {[x0, x1].map((x) => <path key={x} d={`M ${x} ${y} L ${x - 6} ${y - 30}`} stroke="#4a4440" strokeWidth={3} />)}
    </g>
  );
};

/* ------------------------------------ ash dawn street (S15, S16) ------------------------------------ */
export const A = { f: 1000, hc: 1.6, YH: 1080, VX: 648 };
export const ap = (X: number, Y: number, Z: number): [number, number] => [A.VX + (A.f * X) / Z, A.YH + (A.f * (A.hc - Y)) / Z];
const AP = (X: number, Y: number, Z: number) => ap(X, Y, Z).map((v) => v.toFixed(1)).join(',');
export const DawnBand: React.FC = () => {
  const r = rng(341);
  const ruins: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    let z = 4, i = 0;
    while (z < 300) {
      const len = 8 + r() * 14, h = 8 + r() * 22, x0 = side * 12, z1 = z + len;
      const c = mix(side < 0 ? '#2e2a34' : '#3a3540', '#9a8a88', Math.min(0.8, z / 200));
      const notch = h * (0.6 + r() * 0.3);
      ruins.push(<polygon key={`${side}${i}`} points={`${AP(x0, 0, z)} ${AP(x0, h, z)} ${AP(x0, notch, (z + z1) / 2)} ${AP(x0, h * 0.9, z1)} ${AP(x0, 0, z1)}`} fill={c} />);
      for (let k = 0; k < 3; k++) { const wz = z + 2 + k * (len / 3), wy = 3 + (k % 2) * 3.5; ruins.push(<polygon key={`w${side}${i}${k}`} points={`${AP(x0, wy, wz)} ${AP(x0, wy + 2, wz)} ${AP(x0, wy + 2, wz + 1.6)} ${AP(x0, wy, wz + 1.6)}`} fill={mix('#120f16', '#9a8a88', Math.min(0.7, z / 200))} />); }
      z = z1 + 1 + r() * 3;
      i++;
    }
  }
  ruins.reverse();
  const rubble: React.ReactNode[] = [];
  for (let i = 0; i < 40; i++) { const X = -10 + r() * 20, Z = 5 + r() * 60, [x, y] = ap(X, 0, Z), s = A.f / Z, w = (0.3 + r() * 1.2) * s; rubble.push(<polygon key={i} points={`${x - w},${y} ${x - w * 0.4},${y - w * 0.6} ${x + w * 0.3},${y - w * 0.5} ${x + w},${y}`} fill={mix('#2a2630', '#8a7a78', Math.min(0.7, Z / 80))} />); }
  return (
    <g>
      <defs>
        <linearGradient id="baSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4652" /><stop offset="0.6" stopColor="#8e7f84" /><stop offset="1" stopColor="#b9a59a" /></linearGradient>
        <radialGradient id="baSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2d8" /><stop offset="0.2" stopColor="#ffd8a8" stopOpacity={0.8} /><stop offset="1" stopColor="#ffd8a8" stopOpacity={0} /></radialGradient>
        <linearGradient id="baRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9a59a" /><stop offset="0.15" stopColor="#6a5f66" /><stop offset="1" stopColor="#2e2a32" /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#baSky)" />
      <circle cx={A.VX} cy={A.YH - 60} r={700} fill="url(#baSun)" />
      <circle cx={A.VX} cy={A.YH - 60} r={56} fill="#fff4dc" />
      <rect x={0} y={A.YH} width={W} height={H - A.YH} fill="url(#baRoad)" />
      {ruins}
      {/* a toppled street lamp and the shell of a car */}
      <path d={`M ${ap(-6, 0, 18)[0]} ${ap(-6, 0, 18)[1]} L ${ap(-1, 2.2, 22)[0]} ${ap(-1, 2.2, 22)[1]}`} stroke="#1e1a22" strokeWidth={10} />
      <path d={`M ${ap(5, 0, 14).join(' ')} m -150 0 l 10 -80 l 70 -10 l 40 -60 l 140 0 l 50 60 l 60 10 l 0 80 Z`} fill="#1e1a22" />
      {rubble}
    </g>
  );
};

/** drifting smoke bank (environment, ON ONES). o = opacity, y band, speed */
export const Smoke: React.FC<{ t: number; y: number; h: number; o: number; col?: string; v?: number; seed?: number }> = ({ t, y, h, o, col = '#8e8088', v = 30, seed = 7 }) => {
  const r = rng(seed);
  const p = Array.from({ length: 12 }, () => ({ x: r() * 1700 - 200, dy: r() * h, rx: 220 + r() * 260, ry: 80 + r() * 120 }));
  return (
    <g opacity={o}>
      {p.map((q, i) => <ellipse key={i} cx={((q.x + v * t + i * 13) % 1700) - 200} cy={y + q.dy} rx={q.rx} ry={q.ry} fill={col} opacity={0.35} />)}
    </g>
  );
};

/** ash flakes falling (environment, ON ONES) */
export const Ash: React.FC<{ t: number; n?: number; col?: string }> = ({ t, n = 50, col = '#d8ccc4' }) => {
  const r = rng(351);
  return <g fill={col}>{Array.from({ length: n }, (_, i) => { const x = r() * W, y0 = r() * H, s = 2 + r() * 4, v = 40 + r() * 60; return <rect key={i} x={(x + Math.sin(t + i) * 30) % W} y={(y0 + v * t) % H} width={s} height={s * 0.7} opacity={0.6} transform={`rotate(${t * 90 + i * 20} ${x} ${(y0 + v * t) % H})`} />; })}</g>;
};

/* ------------------------------------ day street, eye level (S17, S18) ------------------------------------ */
export const ST = { ground: 1560 };
export const StreetBand: React.FC = () => {
  const r = rng(361);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={HZ} />
      {/* shop fronts across the street, shutters half up, an awning */}
      {[0, 1, 2, 3].map((i) => {
        const x0 = -40 + i * 340, c = ['#c8c1b3', '#b8b2a6', '#d0c8b8', '#bfb8aa'][i];
        return (
          <g key={i}>
            <rect x={x0} y={260} width={336} height={ST.ground - 260} fill={c} />
            <rect x={x0 + 30} y={360} width={120} height={180} fill="#6f6a62" opacity={0.6} />
            <rect x={x0 + 186} y={360} width={120} height={180} fill="#6f6a62" opacity={0.6} />
            <rect x={x0 + 20} y={820} width={296} height={ST.ground - 820} fill={i % 2 ? '#8a857c' : '#3a3530'} />
            {Array.from({ length: 10 }, (_, k) => <rect key={k} x={x0 + 20} y={830 + k * 22} width={296} height={4} fill="#6f6a62" opacity={i % 2 ? 0.7 : 0} />)}
            <polygon points={`${x0 + 6},790 ${x0 + 330},790 ${x0 + 350},860 ${x0 - 14},860`} fill={['#7a4a3a', '#4f6f6a', '#8a6a3a', '#5a5a6a'][i]} />
          </g>
        );
      })}
      <rect x={0} y={ST.ground} width={W} height={H - ST.ground} fill="#b8b2a6" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 100 - 30} y={ST.ground} width={3} height={200} fill="#a39d92" />)}
      <rect x={0} y={ST.ground + 200} width={W} height={H} fill="#8e8a84" />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={r() * W} cy={ST.ground + 260 + r() * 400} rx={14} ry={6} fill="#6f6a62" opacity={0.5} />)}
    </g>
  );
};
