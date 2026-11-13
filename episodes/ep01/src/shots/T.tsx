import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Commuter, CROWD, HERO, FRONT, WindowStrobe, Straps, strobe } from '../art/train_car';

/**
 * shot 6 — inside a packed commuter train: people shoulder to shoulder on the straps, a tired office worker in the centre,
 * eyes half closed, nodding off and catching himself on "survive". Bodies sway on twos; window light strobes on ones. Slow push-in.
 */
export const S06: React.FC = () => {
  const { p, t, t2 } = useShot();
  const z = 1.0 + 0.09 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 540, oy: 720 };
  const ts = wordAt(6, /^survive/i, 0.45);
  // nod: slow droop, snap back up on "survive", then droop again (on twos)
  const nod = t2 < ts ? ramp(t2, 0.1, ts - 0.05) : 0.15 + 0.35 * ramp(t2, ts + 0.35, ts + 1.6);
  const eyes = t2 < ts ? 0.5 - 0.35 * ramp(t2, 0.1, ts - 0.05) : 0.7 - 0.4 * ramp(t2, ts + 0.35, ts + 1.6);
  const rim = 1 - 0.7 * strobe(t, 2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#c3c6c0' }}>
      <BandImg id="train/car" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <WindowStrobe t={t} />
        <Straps t={t} skip={(x, zz) => zz < 2.6} />
        {CROWD.map((c, i) => <Commuter key={i} p={c} t2={t2} rim={1 - 0.7 * strobe(t, Math.min(4, Math.floor(c.z / 1.6)))} haze={Math.max(0, (c.z - 3) / 9)} />)}
        <Commuter p={HERO} t2={t2} rim={rim} nod={nod} eyes={eyes} hero />
      </Live>
      <Live k={1.12} cam={cam}>
        {FRONT.map((c, i) => <Commuter key={i} p={c} t2={t2} rim={1 - 0.7 * strobe(t, 0)} />)}
      </Live>
    </AbsoluteFill>
  );
};
