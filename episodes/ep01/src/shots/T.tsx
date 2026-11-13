import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, handheld } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Commuter, CROWD, HERO, FRONT, FILL_MID, FILL_NEAR, BAGS, Bag, WindowStrobe, Straps, strobe, pt, S, Person } from '../art/train_car';

const rimAt = (t: number, z: number) => 1 - 0.7 * strobe(t, Math.min(4, Math.floor(z / 1.6)));
const haze = (z: number) => Math.max(0, (z - 3) / 9);

/**
 * shot 8 — inside a packed commuter train: people shoulder to shoulder on the straps, bags at their feet; the tired office worker
 * in the centre nods off and JOLTS awake on "survive", then sinks again. Bodies sway on twos; window light strobes and the car rocks on ones.
 */
export const S08: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ts = wordAt(8, /^survive/i, 0.4);
  const hh = handheld(t, 0.5);
  const jolt = Math.exp(-Math.max(0, t - ts) * 9) * (t >= ts ? 1 : 0); // camera bump on ones
  const z = 1.0 + 0.09 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy - 10 * jolt, rot: hh.hr * 0.6, ox: 540, oy: 720 };
  // hero: droop before, snap up (with a small overshoot) on "survive", then droop again (on twos)
  const nod = t2 < ts ? 0.15 + 0.85 * ramp(t2, 0, ts - 0.05) : 0.1 + 0.4 * ramp(t2, ts + 0.5, ts + 1.6);
  const eyes = t2 < ts ? 0.45 - 0.35 * ramp(t2, 0, ts - 0.05) : t2 < ts + 0.35 ? 1 : 0.9 - 0.55 * ramp(t2, ts + 0.5, ts + 1.6);
  const lift = t2 >= ts ? Math.exp(-(t2 - ts) * 6) : 0; // body jerk up (world px)
  // painter's order: far to near
  const items: { z: number; el: React.ReactNode }[] = [
    ...[...CROWD, ...FILL_MID].map((c, i) => ({ z: c.z, el: <Commuter key={`c${i}`} p={c} t2={t2} rim={rimAt(t, c.z)} haze={haze(c.z)} /> })),
    ...BAGS.map(([x, bz, k], i) => ({ z: bz - 0.05, el: <Bag key={`b${i}`} x={x} z={bz} kind={k} haze={haze(bz)} /> })),
    { z: HERO.z, el: <g key="hero" transform={`translate(0 ${-lift * 0.06 * S(HERO.z)})`}><Commuter p={HERO} t2={t2} rim={rimAt(t, 0)} nod={nod} eyes={eyes} hero /></g> },
  ].sort((a, b) => b.z - a.z);
  const shadows = [...CROWD, ...FILL_MID, HERO, ...FILL_NEAR].map((c: Person, i) => { const [x, y] = pt(c.x, 0, c.z); return <ellipse key={i} cx={x} cy={y} rx={0.32 * S(c.z)} ry={0.07 * S(c.z)} fill="#3a3834" opacity={0.5} />; });
  return (
    <AbsoluteFill style={{ backgroundColor: '#c3c6c0' }}>
      <BandImg id="train/car" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <WindowStrobe t={t} />
        <Straps t={t} skip={(x, zz) => zz < 2.6} />
        {shadows}
        {items.map((it) => it.el)}
      </Live>
      <Live k={1.12} cam={cam}>
        {FILL_NEAR.map((c, i) => <Commuter key={`n${i}`} p={c} t2={t2} rim={rimAt(t, 0)} />)}
        {FRONT.map((c, i) => <Commuter key={`f${i}`} p={c} t2={t2} rim={rimAt(t, 0)} />)}
      </Live>
    </AbsoluteFill>
  );
};
