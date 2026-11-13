import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Horse, Kid, K } from '../art/loch_figs';

const HX = 820, HY = 1230; // horse spot in the shallows (world)
const fr = (wx: number, wy: number) => ({ ox: wx - 108, oy: wy - 192 });

/** Horse standing in water: body clipped at waterline wy, reflection below, small rings. depth pushes it under. */
const HorseInWater: React.FC<{ id: string; x: number; wy: number; s: number; depth?: number; walk?: number; head?: number; flip?: boolean; drip?: number; rings?: number }> = ({ id, x, wy, s, depth = 40, walk, head, flip, drip, rings = 1 }) => {
  const y = wy + depth * s;
  return (
    <g>
      <defs>
        <clipPath id={`${id}a`}><rect x={x - 600} y={wy - 800} width={1200} height={800} /></clipPath>
        <clipPath id={`${id}b`}><rect x={x - 600} y={wy} width={1200} height={800} /></clipPath>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.water} stopOpacity="0" />
          <stop offset="1" stopColor={K.water} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}b)`} opacity={0.38}>
        <g transform={`translate(0,${2 * wy}) scale(1,-1)`}><Horse x={x} y={y} s={s} walk={walk} head={head} flip={flip} rim={0.4} /></g>
      </g>
      <g clipPath={`url(#${id}a)`}><Horse x={x} y={y} s={s} walk={walk} head={head} flip={flip} drip={drip} /></g>
      {rings > 0 && <g fill="none" stroke={K.silver} opacity={0.35 * rings}>
        <ellipse cx={x - 74 * s * (flip ? -1 : 1)} cy={wy} rx={30 * s} ry={5 * s} strokeWidth={2} />
        <ellipse cx={x + 150 * s * (flip ? -1 : 1)} cy={wy} rx={30 * s} ry={5 * s} strokeWidth={2} />
        <ellipse cx={x + 40 * s * (flip ? -1 : 1)} cy={wy + 4} rx={170 * s} ry={14 * s} strokeWidth={1.5} opacity={0.6} />
      </g>}
    </g>
  );
};

const Mist: React.FC<{ t: number; y: number; o?: number }> = ({ t, y, o = 1 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id="lmistr" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#9aa7ad" stopOpacity="0.32" />
        <stop offset="1" stopColor="#9aa7ad" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={400 + t * 14} cy={y} rx={520} ry={60} fill="url(#lmistr)" />
    <ellipse cx={1000 - t * 10} cy={y + 50} rx={460} ry={50} fill="url(#lmistr)" />
  </g>
);

/** 1: wide misty loch at dusk, black horse in the shallows. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.02 + 0.16 * EIO(p), dx: 0, dy: 0, ...fr(HX, HY) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d141a' }}>
      <BandImg id="loch/sky" k={0.4} cam={cam} />
      <BandImg id="loch/water" k={0.7} cam={cam} />
      <Live k={0.8} cam={cam}><HorseInWater id="h1" x={HX} wy={HY} s={0.42} drip={t * 0.8} head={0.15 + 0.1 * Math.sin(t * 0.6)} /><Mist t={t} y={HY + 10} /></Live>
      <BandImg id="loch/shore" k={1} cam={cam} />
    </AbsoluteFill>
  );
};

/** 4: two kids walking home on the shore path, tracked from behind. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const { hx, hy, hr } = handheld(t, 0.6);
  const cam: Cam = { zoom: 1.55, dx: -60 * p, dy: -20 * p, tx: hx, ty: hy, rot: hr, ...fr(560, 1470) };
  const ph = t * 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d141a' }}>
      <BandImg id="loch/sky" k={0.3} cam={cam} />
      <BandImg id="loch/water" k={0.6} cam={cam} />
      <Live k={0.65} cam={cam}><HorseInWater id="h4" x={300} wy={1080} s={0.13} rings={0.4} /><Mist t={t} y={1090} /></Live>
      <BandImg id="loch/shore" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Kid x={500 - 30 * p} y={1440 - 14 * p} h={250} phase={ph} jumper="#4a3a44" />
        <Kid x={610 - 30 * p} y={1474 - 14 * p} h={190} phase={ph + 1.7} jumper="#2f4a52" hair="short" />
      </Live>
    </AbsoluteFill>
  );
};

/** 5: the horse in the shallows, its reflection, mist around its legs. Very slow push. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 2.0 + 0.14 * EIO(p), dx: 0, dy: 0, ...fr(HX, HY - 60) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d141a' }}>
      <BandImg id="loch/sky" k={0.5} cam={cam} />
      <BandImg id="loch/water" k={0.8} cam={cam} />
      <Live k={0.9} cam={cam}><HorseInWater id="h5" x={HX + 30} wy={HY} s={0.42} drip={t * 0.8} head={0.1 + 0.08 * Math.sin(t * 0.5)} /><Mist t={t} y={HY + 6} /></Live>
      <BandImg id="loch/shore" k={1} cam={cam} />
    </AbsoluteFill>
  );
};

/** 8: horse turns toward the loch and walks deeper, the boy stuck at its side. Locked. */
export const S08: React.FC = () => {
  const { p, t, fps } = useShot();
  const tt = wordAt(8, /turned/, 0.2), tw = wordAt(8, /started/, 0.65);
  const sec = t;
  const turned = sec >= tt;
  const go = ramp(sec, tw - 0.3, tw + 1.8);
  const x = HX + 30 - 220 * go, wy = HY - 40 * go, depth = 40 + 120 * go;
  const s = 0.42 - 0.04 * go;
  const cam: Cam = { zoom: 1.9, dx: 0, dy: 0, ...fr(HX - 90, HY - 80) };
  const boyX = x + 240 * s * (turned ? -1 : 1), boyY = wy + 40 + 140 * s * go;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d141a' }}>
      <BandImg id="loch/sky" k={0.5} cam={cam} />
      <BandImg id="loch/water" k={0.8} cam={cam} />
      <Live k={0.9} cam={cam}>
        <HorseInWater id="h8" x={x} wy={wy} s={s} depth={depth} flip={!turned} walk={go * 9} drip={t * 0.9} head={turned ? 0 : 0.3} />
        <defs><clipPath id="b8"><rect x={0} y={0} width={1296} height={wy + 4} /></clipPath></defs>
        <g clipPath="url(#b8)"><Kid x={boyX} y={boyY} h={290 * s} jumper="#5b8590" rim={1.4} hair="short" reach={0.8} phase={go * 7} /></g>
        <ellipse cx={boyX} cy={wy + 2} rx={30 * s} ry={4} fill="none" stroke={K.silver} strokeWidth={2} opacity={0.4 * go} />
        <Mist t={t} y={HY + 10} o={0.8} />
      </Live>
      <BandImg id="loch/shore" k={1} cam={cam} />
    </AbsoluteFill>
  );
};

/** 11: the horse sinks, the brother free; two kids on the shore, perfectly still water. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const ts = wordAt(11, /sank/, 0.55);
  const sink = ramp(t, ts - 1.2, ts + 0.9);
  const cam: Cam = { zoom: 1.6 - 0.45 * EIO(p), dx: 0, dy: 0, ...fr(700, 1300) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d141a' }}>
      <BandImg id="loch/sky" k={0.5} cam={cam} />
      <BandImg id="loch/water" k={0.8} cam={cam} />
      <Live k={0.9} cam={cam}>
        {sink < 1 && <HorseInWater id="h11" x={HX - 160} wy={HY - 50} s={0.36} depth={160 + 500 * sink} head={0} rings={0} />}
        <Mist t={t} y={HY - 30} />
      </Live>
      <BandImg id="loch/shore" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Kid x={520} y={1380} h={230} jumper="#4a3a44" />
        <Kid x={610} y={1404} h={172} jumper="#2f4a52" hair="short" />
      </Live>
    </AbsoluteFill>
  );
};

/** 12: cottage garden at night, lit window, a dark dripping horse by the far gate. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const th = wordAt(12, /horse/, 0.6);
  const show = ramp(t, wordAt(12, /evenings/, 0.35), th);
  const cam: Cam = { zoom: 1.15 + 0.35 * EIO(p), dx: 0, dy: 0, ...fr(640, 1170) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a0d' }}>
      <BandImg id="loch/sky" k={0.4} cam={cam} />
      <BandImg id="loch/water" k={0.6} cam={cam} />
      <Live k={0.6} cam={cam}><rect x={-300} y={-300} width={1900} height={2900} fill="#05080c" opacity={0.55} /></Live>
      <BandImg id="loch/garden" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <g opacity={show}><Horse x={652} y={1178} s={0.27} head={0.25} drip={t * 0.7} /></g>
      </Live>
    </AbsoluteFill>
  );
};
