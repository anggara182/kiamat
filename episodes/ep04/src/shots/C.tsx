import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, handheld } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Column, GATE, OpenHand, SquareCrowd, SKYLINES, SkylineScene } from '../art/nation_art';
import { rng } from '../art/world';

/** dust motes drifting in the low sun (environment, on ones) */
const Dust: React.FC<{ t: number; n: number; col: string }> = ({ t, n, col }) => {
  const r = rng(5);
  const ps = Array.from({ length: n }).map(() => ({ x: r() * 1296, y: 900 + r() * 1300, v: 10 + r() * 30, s: 1.5 + r() * 3, ph: r() * 6 }));
  return <g fill={col}>{ps.map((q, i) => <circle key={i} cx={q.x + t * q.v} cy={q.y - t * q.v * 0.4 + Math.sin(t + q.ph) * 8} r={q.s} opacity={0.35 + 0.3 * Math.sin(t * 2 + q.ph)} />)}</g>;
};

/** shot 1 — HOOK, dawn: an endless column of followers with plain banners pours across a highway overpass into a city; the head reaches the city gate on "cities". */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tc = wordAt(1, /^cities/i, 0.76);
  const cam: Cam = { zoom: 1.2 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 120, ox: 640, oy: 980 };
  const f = 0.72 + 0.28 * (t2 / tc);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2c48' }}>
      <BandImg id="nation/march" k={0.92} cam={cam} />
      <Live k={0.92} cam={cam}>
        <ellipse cx={GATE.x} cy={GATE.y - 40} rx={90} ry={70} fill="#e8c48a" opacity={0.25 + 0.25 * ramp(t, tc - 0.2, tc + 0.2)} />
        <Column t2={t2} f={f} rim="#f2c890" />
        <Dust t={t} n={70} col="#e8c48a" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 2 — day, close: empty open hands rise out of the crowd on "weapons", some holding bread and flowers; no weapons anywhere. Handheld. */
export const S02: React.FC = () => {
  const { t, t2 } = useShot();
  const tw = wordAt(2, /^weapons/i, 0.56);
  const hh = handheld(t, 1.1);
  const cam: Cam = { zoom: 1.05, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, rot: hh.hr, ox: 540, oy: 960 };
  const hands: [number, number, number, number, 'none' | 'bread' | 'flower', string, string, string, number][] = [
    [180, 1500, 0.95, -14, 'none', '#9a6a52', '#6e4a3a', '#5a6a7a', 0.0],
    [420, 1380, 1.1, -4, 'bread', '#b07a5e', '#7a4f3e', '#a35f55', 0.08],
    [690, 1440, 1.05, 6, 'none', '#8a5a44', '#5e3e30', '#3e4a5c', 0.04],
    [930, 1520, 0.95, 16, 'flower', '#b8866a', '#80583e', '#7a6a4a', 0.12],
    [300, 1900, 1.35, -10, 'flower', '#a87258', '#744c3a', '#4a3e52', 0.16],
    [820, 1880, 1.4, 10, 'none', '#9e6e56', '#6e4a3a', '#d8d2c4', 0.1],
    [560, 2020, 1.5, 2, 'bread', '#8f5f48', '#603f30', '#5a6a5a', 0.2],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="nation/crowd" k={0.7} cam={cam} />
      <Live k={1} cam={cam}>
        {hands.map(([x, y, s, rot, hold, sk, skd, sl, d], i) => {
          const up = ramp(t2, tw - 0.2 + d, tw + 0.2 + d);
          const wave = Math.sin(t2 * 3 + i) * 3;
          return <OpenHand key={i} x={x} y={y + 520 * (1 - up) - 40 * up} s={s} rot={rot + wave} skin={sk} skinD={skd} sleeve={sl} hold={hold} spread={0.4 + 0.6 * up} />;
        })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 3 — high wide: the square floods with people from every street until full on "crowds". Slow crane-up. */
export const S03: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tc = wordAt(3, /^crowds/i, 0.57);
  const cam: Cam = { zoom: 1.2 - 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 60 * ramp(p, 0, 1, EIO), ox: 540, oy: 1060 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#b8b2a6' }}>
      <BandImg id="nation/square" k={1} cam={cam} />
      <Live k={1} cam={cam}><SquareCrowd t={t} t2={t2} tFull={tc} /></Live>
    </AbsoluteFill>
  );
};

/** shot 4 — three hard cuts (a third each): three invented skylines, the same plain banner rising up a tower's pole in each. Locked (slight drift). */
export const S04: React.FC = () => {
  const { t, sec } = useShot();
  const seg = Math.min(2, Math.floor((t / sec) * 3));
  const lt = t - (seg * sec) / 3, ls = sec / 3;
  const raise = ramp(lt, 0.05, ls * 0.8);
  const cam: Cam = { zoom: 1.03 + 0.02 * (lt / ls), dx: 0, dy: 0, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <Live k={1} cam={cam}><SkylineScene sk={SKYLINES[seg]} t={t} raise={raise} i={seg} /></Live>
    </AbsoluteFill>
  );
};
