import React from 'react';
import { W, H, rng } from './world';

/**
 * EP02 set "kampung": the neighbourhood water tower, drawn once with a palette (real dusk vs rumour image),
 * kampung roofs, the rumour figures and birds (copied/restyled from EP01 city_alley).
 */

export type TowerPal = { steel: string; tank: string; tankHi: string; rim: string; rimO: number; detail: boolean };

/** steel lattice water tower: legs from ground gy up to the platform, cylindrical tank on top. cx centre, s scale. */
export const WaterTower: React.FC<{ cx: number; gy: number; s: number; p: TowerPal }> = ({ cx, gy, s, p }) => {
  const legB = 180 * s, legT = 100 * s; // half spans at ground / platform
  const py = gy - 650 * s; // platform
  const tw = 150 * s, tTop = py - 300 * s;
  const panels = 4;
  const at = (f: number) => ({ y: gy - (gy - py) * f, hw: legB + (legT - legB) * f });
  const lw = 12 * s;
  return (
    <g>
      <g fill={p.steel}>
        {/* outer legs */}
        <polygon points={`${cx - legB - lw / 2},${gy} ${cx - legB + lw / 2},${gy} ${cx - legT + lw / 2},${py} ${cx - legT - lw / 2},${py}`} />
        <polygon points={`${cx + legB - lw / 2},${gy} ${cx + legB + lw / 2},${gy} ${cx + legT + lw / 2},${py} ${cx + legT - lw / 2},${py}`} />
        {/* rear legs (thinner, inside) */}
        {p.detail && <><polygon points={`${cx - legB * 0.55 - 3 * s},${gy} ${cx - legB * 0.55 + 3 * s},${gy} ${cx - legT * 0.55 + 3 * s},${py} ${cx - legT * 0.55 - 3 * s},${py}`} opacity={0.7} /><polygon points={`${cx + legB * 0.55 - 3 * s},${gy} ${cx + legB * 0.55 + 3 * s},${gy} ${cx + legT * 0.55 + 3 * s},${py} ${cx + legT * 0.55 - 3 * s},${py}`} opacity={0.7} /></>}
        {/* horizontal rings */}
        {Array.from({ length: panels + 1 }).map((_, i) => { const a = at(i / panels); return <rect key={i} x={cx - a.hw} y={a.y - 4 * s} width={a.hw * 2} height={7 * s} />; })}
        {/* platform with railing */}
        <rect x={cx - legT - 50 * s} y={py - 8 * s} width={(legT + 50 * s) * 2} height={14 * s} />
        <rect x={cx - legT - 50 * s} y={py - 52 * s} width={(legT + 50 * s) * 2} height={5 * s} />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={cx - legT - 50 * s + i * ((legT + 50 * s) * 2 - 4 * s) / 8} y={py - 52 * s} width={4 * s} height={46 * s} />)}
        {/* central pipe down to the ground (the leaking pipe of the story) */}
        <rect x={cx - 8 * s} y={py} width={16 * s} height={gy - py} />
        <rect x={cx - 14 * s} y={gy - 120 * s} width={28 * s} height={18 * s} />
        {/* ladder on the right leg */}
      </g>
      {/* cross bracing */}
      <g stroke={p.steel} strokeWidth={5 * s}>
        {Array.from({ length: panels }).map((_, i) => { const a = at(i / panels), b = at((i + 1) / panels); return <g key={i}><path d={`M${cx - a.hw} ${a.y} L${cx + b.hw} ${b.y}`} /><path d={`M${cx + a.hw} ${a.y} L${cx - b.hw} ${b.y}`} /></g>; })}
      </g>
      {/* ladder */}
      {p.detail && (
        <g stroke={p.steel} strokeWidth={3 * s}>
          <path d={`M${cx + legT + 18 * s} ${py} L${cx + legT + 18 * s} ${tTop + 30 * s}`} /><path d={`M${cx + legT + 34 * s} ${py} L${cx + legT + 34 * s} ${tTop + 30 * s}`} />
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${cx + legT + 18 * s} ${py - 10 * s - i * 24 * s} L${cx + legT + 34 * s} ${py - 10 * s - i * 24 * s}`} />)}
        </g>
      )}
      {/* tank */}
      <rect x={cx - tw} y={tTop + 20 * s} width={tw * 2} height={py - tTop - 28 * s} fill={p.tank} />
      <ellipse cx={cx} cy={tTop + 20 * s} rx={tw} ry={24 * s} fill={p.tank} />
      <path d={`M${cx - tw} ${tTop + 20 * s} Q${cx} ${tTop - 50 * s} ${cx + tw} ${tTop + 20 * s} Z`} fill={p.tank} />
      <rect x={cx - 18 * s} y={tTop - 36 * s} width={36 * s} height={18 * s} fill={p.tank} />
      {p.detail && (
        <g>
          <path d={`M${cx - tw} ${tTop + 30 * s} V${py - 8 * s} H${cx - tw * 0.55} V${tTop + 30 * s} Z`} fill={p.tankHi} opacity={0.55} />
          {[0.3, 0.62].map((f) => <rect key={f} x={cx - tw} y={tTop + 20 * s + (py - tTop) * f} width={tw * 2} height={5 * s} fill={p.steel} opacity={0.6} />)}
          <path d={`M${cx - tw * 0.3} ${tTop + 120 * s} q6 40 2 90`} stroke={p.steel} strokeOpacity={0.35} strokeWidth={6 * s} fill="none" />
          <g stroke={p.rim} strokeOpacity={p.rimO} fill="none" strokeLinecap="round">
            <path d={`M${cx - tw} ${py - 10 * s} V${tTop + 20 * s} Q${cx - tw * 0.6} ${tTop - 22 * s} ${cx - 10 * s} ${tTop - 26 * s}`} strokeWidth={4 * s} />
            <path d={`M${cx - legB - lw / 2} ${gy} L${cx - legT - lw / 2} ${py}`} strokeWidth={3 * s} />
            <path d={`M${cx - legT - 50 * s} ${py - 52 * s} H${cx}`} strokeWidth={2.5 * s} />
          </g>
        </g>
      )}
    </g>
  );
};

/** kampung roof rows (gable / hip / flat with tanks), clockwise paths; returns rows far -> near */
const n1 = (v: number) => Math.round(v * 10) / 10;
const R = (x: number, y: number, w: number, h: number) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`;
const P = (...p: number[]) => { let s = ''; for (let i = 0; i < p.length; i += 2) s += `${i ? 'L' : 'M'}${n1(p[i])} ${n1(p[i + 1])}`; return s + 'Z'; };
export type RoofWin = { x: number; y: number; w: number; h: number; o: number; row: number };
export const roofRows = (seed: number, rows: { eave: number; w0: number; w1: number; h0: number; h1: number; s: number }[], skip?: (x: number) => boolean) => {
  const r = rng(seed);
  return rows.map((S, ri) => {
    let d = ''; const wins: RoofWin[] = [];
    let x = -80 - r() * 40;
    while (x < W + 60) {
      const w = S.w0 + r() * (S.w1 - S.w0);
      const eave = S.eave + (r() * 2 - 1) * 10 * S.s - (r() < 0.2 ? 36 * S.s : 0);
      const h = S.h0 + r() * (S.h1 - S.h0);
      const k = r();
      d += R(x, eave, w, H - eave);
      if (k < 0.45) d += P(x - 5, eave, x + w / 2, eave - h, x + w + 5, eave);
      else if (k < 0.75) d += P(x - 5, eave, x + w * 0.25, eave - h * 0.8, x + w * 0.75, eave - h * 0.8, x + w + 5, eave);
      else {
        d += R(x - 2, eave - 12 * S.s, w + 4, 12 * S.s);
        if (!skip?.(x + w * 0.3)) {
          const cx = x + w * 0.3, tw = 30 * S.s, lg = 24 * S.s, ty = eave - 12 * S.s - lg - 34 * S.s;
          d += R(cx - tw * 0.42, eave - 12 * S.s - lg, 3 * S.s, lg) + R(cx + tw * 0.42 - 3 * S.s, eave - 12 * S.s - lg, 3 * S.s, lg) + R(cx - tw / 2, ty, tw, 34 * S.s);
        }
      }
      if (r() < 0.2 && !skip?.(x + w * 0.5)) { const ax = x + w * 0.5, L = (80 + r() * 70) * S.s, y0 = eave - h * 0.7; d += R(ax - 1.5 * S.s, y0 - L, 3 * S.s, L) + R(ax - 20 * S.s, y0 - L + 6 * S.s, 40 * S.s, 2.5 * S.s) + R(ax - 14 * S.s, y0 - L + 18 * S.s, 28 * S.s, 2.5 * S.s); }
      if (r() < 0.7) wins.push({ x: x + w * (0.25 + r() * 0.4), y: eave + 10 * S.s, w: 14 * S.s, h: 16 * S.s, o: r(), row: ri });
      x += w + (r() < 0.3 ? -w * 0.1 : r() * 6);
    }
    return { d, wins };
  });
};

/* ------------------------------------------------------------------ rumour image */
export const RUMOUR = { sky: '#4a5468', skyHi: '#5d677b', ground: '#2a3140', sil: '#1b2030', mid: '#3a4256', pale: '#8d97a8', red: '#c4322b' };
/** faceless, too-tall, symmetric figure (feet at x, y; height h) */
export const RumourFigure: React.FC<{ x: number; y: number; h: number; fill: string }> = ({ x, y, h, fill }) => {
  const u = h / 8;
  return (
    <g fill={fill}>
      <ellipse cx={x} cy={y - h + u * 0.5} rx={u * 0.36} ry={u * 0.5} />
      <rect x={x - u * 0.13} y={y - h + u * 0.9} width={u * 0.26} height={u * 0.35} />
      <path d={`M${x - u * 0.85} ${y - h + u * 1.35} Q${x} ${y - h + u * 1.05} ${x + u * 0.85} ${y - h + u * 1.35} L${x + u * 0.62} ${y} L${x - u * 0.62} ${y} Z`} />
      <path d={`M${x - u * 0.85} ${y - h + u * 1.4} L${x - u * 0.98} ${y - h + u * 4.3} L${x - u * 0.8} ${y - h + u * 4.35} L${x - u * 0.66} ${y - h + u * 1.7} Z`} />
      <path d={`M${x + u * 0.85} ${y - h + u * 1.4} L${x + u * 0.98} ${y - h + u * 4.3} L${x + u * 0.8} ${y - h + u * 4.35} L${x + u * 0.66} ${y - h + u * 1.7} Z`} />
      <ellipse cx={x} cy={y} rx={u * 1.6} ry={u * 0.14} opacity={0.5} />
    </g>
  );
};

/* ------------------------------------------------------------------ birds (from EP01) */
export const Bird: React.FC<{ x: number; y: number; s: number; fly: number; flap: number; fill: string; dir?: number }> = ({ x, y, s, fly, flap, fill, dir = 1 }) => {
  if (fly < 0.05) {
    return (
      <g fill={fill}>
        <ellipse cx={x} cy={y - 4 * s} rx={6 * s} ry={4 * s} />
        <circle cx={x + 5 * s * dir} cy={y - 8 * s} r={2.8 * s} />
        <path d={`M${x - 5 * s * dir} ${y - 4 * s} L${x - 12 * s * dir} ${y - 1 * s} L${x - 5 * s * dir} ${y - 2 * s} Z`} />
      </g>
    );
  }
  const w = Math.sin(flap) * 7 * s;
  return (
    <g>
      <path d={`M${x - 15 * s} ${y + w} Q${x - 7 * s} ${y - 5 * s + w * 0.3} ${x} ${y} Q${x + 7 * s} ${y - 5 * s + w * 0.3} ${x + 15 * s} ${y + w}`} stroke={fill} strokeWidth={2.6 * s} fill="none" strokeLinecap="round" />
      <ellipse cx={x} cy={y + 1 * s} rx={3.2 * s} ry={2.2 * s} fill={fill} />
    </g>
  );
};
/** birds circling a point (environment, on ones) */
export const Circling: React.FC<{ t: number; cx: number; cy: number; rx: number; ry: number; n: number; s: number; fill: string }> = ({ t, cx, cy, rx, ry, n, s, fill }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const a = t * (0.55 + (i % 3) * 0.08) + (i / n) * Math.PI * 2;
      const k = 0.85 + ((i * 37) % 10) / 30;
      return <Bird key={i} x={cx + Math.cos(a) * rx * k} y={cy + Math.sin(a) * ry * k + Math.sin(t * 2 + i) * 6} s={s * (0.8 + 0.3 * Math.sin(a))} fly={1} flap={t * 12 + i * 1.9} fill={fill} />;
    })}
  </g>
);
