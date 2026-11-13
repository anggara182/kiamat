import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * Shot 3b: straight top-down view from the tower onto a zebra crossing. People are dots
 * (head + shoulders + short hard shadow) moving in streams; vehicles wait at the stop lines.
 * Local space: origin at the crossing centre, x across the road, y along it; 1 m = M px.
 * The whole thing is rotated a little for a less diagrammatic, photographic feel.
 * ---------------------------------------------------------------------------------------- */
const M = 40;
const RW = 7.4 * M; // half road width
const SW = 3.6 * M; // sidewalk width
const ZH = 2.4 * M; // half crossing depth
export const CROSS = { rot: -17, cx: W / 2, cy: H / 2 - 40 };
const SH = { dx: 0.32 * M, dy: 0.22 * M }; // hard shadow offset (sun high, upper left)

/** a pedestrian follows a polyline (sidewalk -> zebra -> sidewalk, or just along a sidewalk) at speed v */
type Ped = { pts: [number, number][]; s0: number; v: number; shirt: string; r: number };
const SHIRTS = ['#d9d5c9', '#cfc6b3', '#2f3640', '#7a5040', '#4a6070', '#e6e2d8', '#8c8f7c', '#3b3a3f', '#b98e5c', '#a7b2b8', '#e9e6de', '#5a4a6a'];
const rp = rng(41);
const D = 1100;
export const PEDS: Ped[] = [];
const shirt = () => SHIRTS[Math.floor(rp() * SHIRTS.length)];
// crossing streams: right-movers in the upper half of the zebra, left-movers in the lower half (loosely)
for (let i = 0; i < 118; i++) {
  const right = i % 2 === 0;
  const yl = right ? -ZH * 0.82 + rp() * ZH * 0.92 : -ZH * 0.1 + rp() * ZH * 0.92;
  const xL = -RW - SW * (0.25 + rp() * 0.5), xR = RW + SW * (0.25 + rp() * 0.5);
  const [xs, xe] = right ? [xL, xR] : [xR, xL];
  const a = rp() < 0.5 ? -1 : 1, b = rp() < 0.5 ? -1 : 1;
  const pts: [number, number][] = [[xs, yl + a * D], [xs, yl], [xe, yl], [xe, yl + b * D]];
  // most of them are on the zebra right now (dense streams), some still arriving / already leaving
  const u = rp();
  const s0 = u < 0.72 ? D - 120 + rp() * (Math.abs(xe - xs) + 60) : u < 0.86 ? D - 600 + rp() * 480 : D + Math.abs(xe - xs) + rp() * 300;
  PEDS.push({ pts, s0, v: (1.2 + rp() * 0.35) * M, shirt: shirt(), r: 0.9 + rp() * 0.25 });
}
// sidewalk walkers (along the road)
for (let i = 0; i < 46; i++) {
  const side = i % 2 === 0 ? -1 : 1, up = rp() < 0.5;
  const x = side * (RW + 0.35 * M + rp() * (SW - 0.7 * M));
  const y0 = -1500 + rp() * 3000;
  PEDS.push({ pts: up ? [[x, y0 + 400], [x, y0 - 2000]] : [[x, y0 - 400], [x, y0 + 2000]], s0: 0, v: (1.1 + rp() * 0.4) * M, shirt: shirt(), r: 0.9 + rp() * 0.25 });
}
const along = (pts: [number, number][], s: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0);
    if (s <= L || i === pts.length - 2) {
      const k = Math.min(1, Math.max(0, s / L));
      return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, dir: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90 };
    }
    s -= L;
  }
  return { x: pts[0][0], y: pts[0][1], dir: 0 };
};

const Person: React.FC<{ x: number; y: number; shirt: string; r: number; dir: number; k: string }> = ({ x, y, shirt, r, dir }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${dir.toFixed(1)}) scale(${r})`}>
    <ellipse cx={0} cy={0} rx={0.27 * M} ry={0.15 * M} fill={shirt} />
    <circle cx={0.02 * M} cy={0} r={0.115 * M} fill="#201b18" />
  </g>
);

/** waiting vehicles (static): car roofs and a swarm of motorbikes at the stop lines */
const Car: React.FC<{ x: number; y: number; col: string; flip?: boolean }> = ({ x, y, col, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${flip ? 180 : 0})`}>
    <rect x={-0.9 * M + SH.dx} y={-2.2 * M + SH.dy} width={1.8 * M} height={4.4 * M} rx={0.45 * M} fill="#1c1a18" opacity={0.3} />
    <rect x={-0.9 * M} y={-2.2 * M} width={1.8 * M} height={4.4 * M} rx={0.45 * M} fill={col} />
    <rect x={-0.72 * M} y={-1.25 * M} width={1.44 * M} height={0.7 * M} rx={0.15 * M} fill="#2a2d33" />
    <rect x={-0.72 * M} y={1.05 * M} width={1.44 * M} height={0.5 * M} rx={0.12 * M} fill="#2a2d33" />
    <rect x={-0.66 * M} y={-0.5 * M} width={1.32 * M} height={1.5 * M} rx={0.12 * M} fill="#ffffff" opacity={0.12} />
  </g>
);
const Moto: React.FC<{ x: number; y: number; flip?: boolean; helm: string; rot?: number }> = ({ x, y, flip, helm, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${(flip ? 180 : 0) + rot})`}>
    <ellipse cx={SH.dx} cy={SH.dy} rx={0.36 * M} ry={0.95 * M} fill="#1c1a18" opacity={0.3} />
    <rect x={-0.2 * M} y={-0.95 * M} width={0.4 * M} height={1.9 * M} rx={0.2 * M} fill="#2c2f35" />
    <path d={`M ${-0.42 * M} ${-0.62 * M} L ${0.42 * M} ${-0.62 * M}`} stroke="#2c2f35" strokeWidth={0.08 * M} />
    <ellipse cx={0} cy={0.02 * M} rx={0.3 * M} ry={0.22 * M} fill="#3d3a3a" />
    <circle cx={0} cy={0} r={0.15 * M} fill={helm} />
  </g>
);

export const CrossGround: React.FC = () => {
  const r = rng(43);
  const roofs: React.ReactNode[] = [];
  // rooftops beyond the sidewalks: flat concrete roofs, parapets, water tanks, AC units
  for (let side = -1; side <= 1; side += 2) {
    let y = -1500;
    let i = 0;
    while (y < 1500) {
      const h = 7 * M + r() * 7 * M, x0 = side > 0 ? RW + SW + 0.3 * M : -(RW + SW + 0.3 * M) - 14 * M;
      const tone = ['#a39c90', '#9a5f48', '#b0a99c', '#8c867d', '#a8694f'][i % 5];
      roofs.push(
        <g key={`${side}-${i}`}>
          <rect x={x0} y={y} width={14 * M} height={h - 0.3 * M} fill={tone} />
          <rect x={x0} y={y} width={14 * M} height={h - 0.3 * M} fill="none" stroke="#7a746b" strokeWidth={0.25 * M} />
          <rect x={x0 + (side > 0 ? 0 : 14 * M - 0.5 * M)} y={y} width={0.5 * M} height={h - 0.3 * M} fill="#6c665e" opacity={0.5} />
          {r() < 0.7 && <g><circle cx={x0 + 4 * M + r() * 6 * M + SH.dx} cy={y + h * 0.4 + SH.dy} r={0.75 * M} fill="#4a443c" opacity={0.35} /><circle cx={x0 + 4 * M + r() * 6 * M} cy={y + h * 0.4} r={0.75 * M} fill="#c9c4b8" /></g>}
          {r() < 0.6 && <rect x={x0 + 2 * M + r() * 8 * M} y={y + h * 0.7} width={1.2 * M} height={0.8 * M} fill="#d6d2c8" />}
        </g>,
      );
      y += h;
      i++;
    }
  }
  const stripes: React.ReactNode[] = [];
  for (let x = -RW + 0.4 * M; x < RW - 0.3 * M; x += 1.0 * M) stripes.push(<rect key={x} x={x} y={-ZH} width={0.5 * M} height={2 * ZH} fill="#e9e5da" />);
  const dash = (x: number, from: number, to: number, key: string) => {
    const out: React.ReactNode[] = [];
    for (let y = from; y < to; y += 6 * M) out.push(<rect key={`${key}${y}`} x={x - 0.07 * M} y={y} width={0.14 * M} height={2.6 * M} fill="#dcd8cc" />);
    return out;
  };
  return (
    <g>
      <rect x={-2000} y={-2000} width={4000} height={4000} fill="#8c867d" />
      {roofs}
      {/* sidewalks + curbs */}
      <rect x={-RW - SW} y={-2000} width={SW} height={4000} fill="#b8b2a6" />
      <rect x={RW} y={-2000} width={SW} height={4000} fill="#b3ada1" />
      {/* asphalt */}
      <rect x={-RW} y={-2000} width={2 * RW} height={4000} fill="#5d5b58" />
      <rect x={-RW} y={-2000} width={0.3 * M} height={4000} fill="#d4cfc2" />
      <rect x={RW - 0.3 * M} y={-2000} width={0.3 * M} height={4000} fill="#d4cfc2" />
      {/* lane markings, centre double line, stop lines */}
      {dash(-RW / 2, -2000, -ZH - 3 * M, 'a')}{dash(RW / 2, -2000, -ZH - 3 * M, 'b')}
      {dash(-RW / 2, ZH + 3 * M, 2000, 'c')}{dash(RW / 2, ZH + 3 * M, 2000, 'd')}
      <rect x={-0.22 * M} y={-2000} width={0.13 * M} height={2000 - ZH - 1.6 * M} fill="#e3dfd2" />
      <rect x={0.09 * M} y={-2000} width={0.13 * M} height={2000 - ZH - 1.6 * M} fill="#e3dfd2" />
      <rect x={-0.22 * M} y={ZH + 1.6 * M} width={0.13 * M} height={2000} fill="#e3dfd2" />
      <rect x={0.09 * M} y={ZH + 1.6 * M} width={0.13 * M} height={2000} fill="#e3dfd2" />
      <rect x={0} y={-ZH - 1.7 * M} width={RW} height={0.4 * M} fill="#e3dfd2" />
      <rect x={-RW} y={ZH + 1.3 * M} width={RW} height={0.4 * M} fill="#e3dfd2" />
      {stripes}
      {/* tyre-worn darker bands in the lanes */}
      {[-RW * 0.75, -RW * 0.25, RW * 0.25, RW * 0.75].map((x) => <rect key={x} x={x - 0.9 * M} y={-2000} width={1.8 * M} height={4000} fill="#4f4d4a" opacity={0.25} />)}
    </g>
  );
};

export const CrossTraffic: React.FC = () => {
  const r = rng(47);
  const items: React.ReactNode[] = [];
  // southbound (moving down, right half) waits above the crossing, northbound below on the left half
  const cars = ['#d8d6d0', '#3b3e44', '#8e2f2a', '#c9c7c0', '#5d6670', '#e4e2dc'];
  for (let i = 0; i < 4; i++) items.push(<Car key={`cs${i}`} x={RW * 0.25 + (i % 2) * RW * 0.5} y={-ZH - 9.2 * M - Math.floor(i / 2) * 5.4 * M} col={cars[i]} flip />);
  for (let i = 0; i < 4; i++) items.push(<Car key={`cn${i}`} x={-RW * 0.25 - (i % 2) * RW * 0.5} y={ZH + 9.2 * M + Math.floor(i / 2) * 5.4 * M} col={cars[i + 2]} />);
  for (let i = 0; i < 11; i++) {
    const x = 0.8 * M + ((i * 0.618) % 1) * (RW - 1.6 * M), y = -ZH - 2.8 * M - (i % 3) * 1.5 * M - r() * 0.9 * M;
    items.push(<Moto key={`ms${i}`} x={x} y={y} rot={(r() - 0.5) * 16} flip helm={['#2a2a2e', '#d8d4cc', '#7a2f2a', '#3d4a5a'][i % 4]} />);
  }
  for (let i = 0; i < 11; i++) {
    const x = -0.8 * M - ((i * 0.618 + 0.3) % 1) * (RW - 1.6 * M), y = ZH + 2.8 * M + (i % 3) * 1.5 * M + r() * 0.9 * M;
    items.push(<Moto key={`mn${i}`} x={x} y={y} rot={(r() - 0.5) * 16} helm={['#d8d4cc', '#2a2a2e', '#3d4a5a', '#7a2f2a'][i % 4]} />);
  }
  return <g>{items}</g>;
};

/** people at time t (s): shadows first, then bodies */
export const CrossPeople: React.FC<{ t: number }> = ({ t }) => {
  // t is the ON-TWOS clock; shoulders swing a little with each step
  const pos = PEDS.map((p) => { const d = p.s0 + p.v * t, q = along(p.pts, d); return { p, ...q, dir: q.dir + Math.sin((d / (0.36 * M)) * Math.PI) * 11 }; });
  return (
    <g>
      <g fill="#1c1a18" opacity={0.32}>{pos.map(({ p, x, y }, i) => <ellipse key={i} cx={x + SH.dx * p.r} cy={y + SH.dy * p.r} rx={0.42 * M * p.r} ry={0.2 * M * p.r} transform={`rotate(32 ${x + SH.dx} ${y + SH.dy})`} />)}</g>
      {pos.map(({ p, x, y, dir }, i) => <Person key={i} k={String(i)} x={x} y={y} shirt={p.shirt} r={p.r} dir={dir} />)}
    </g>
  );
};

/** foreground: two tree canopies (closer to the camera), darker and cooler, faster parallax */
export const CrossFg: React.FC = () => {
  const canopy = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={30} cy={24} r={150} fill="#1c211e" opacity={0.35} />
      <path d="M -150 10 Q -160 -90 -70 -130 Q -10 -175 60 -140 Q 150 -120 150 -30 Q 175 60 100 110 Q 30 160 -50 130 Q -140 110 -150 10 Z" fill="#34423a" />
      <path d="M -110 -20 Q -100 -90 -40 -110 Q 20 -130 60 -100 Q 0 -90 -40 -60 Q -80 -40 -110 -20 Z" fill="#4a5a4e" />
      <circle cx={-60} cy={40} r={42} fill="#29332e" /><circle cx={50} cy={-20} r={50} fill="#344039" /><circle cx={60} cy={70} r={36} fill="#27302b" />
    </g>
  );
  return <g>{canopy(70, 360, 1.45, 'a')}{canopy(1250, 1880, 1.6, 'b')}{canopy(1230, 300, 0.9, 'c')}</g>;
};

export const CROSS_M = M;
