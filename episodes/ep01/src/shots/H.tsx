import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr } from '../art/home_kit';
import { KitchenDark, Tube, Flame, Steam, PotLid, MotherKitchen } from '../art/home_kitchen';

/** Tube start-up stutter (on ones): u = seconds since the switch, len = time until it holds steady. */
const tubeLevel = (u: number, len: number) => {
  if (u < 0) return 0;
  const x = u / len;
  const seq: [number, number][] = [[0.06, 0.85], [0.16, 0.04], [0.24, 0.6], [0.4, 0.1], [0.47, 1], [0.6, 0.25], [0.66, 0.9], [0.74, 0.5]];
  for (const [end, v] of seq) if (x < end) return v;
  return Math.min(1, 0.75 + (x - 0.74) * 2);
};

/* ============ shot 2: dawn kitchen, the mother switches on the tube light, the pot starts to steam ============ */
export const S02: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tSw = wordAt(2, /^lights/i, 0.3) - 0.12;
  const tOn = Math.max(tSw + 0.45, wordAt(2, /^on/i, 0.75));
  const L = tubeLevel(t - tSw, tOn - tSw);
  // mother ON TWOS
  const press = ramp(t2, tSw - 0.16, tSw, EOUT) * (1 - ramp(t2, tSw + 0.05, tSw + 0.2));
  const look = ramp(t2, tSw + 0.05, tSw + 0.4, EOUT) * (1 - ramp(t2, tOn - 0.05, tOn + 0.3));
  const reachL = 1 - ramp(t2, tOn - 0.15, tOn + 0.3, EIO);
  const reachR = ramp(t2, tOn - 0.05, Math.min(sec - 0.2, tOn + 0.45), EIO);
  const turn = ramp(t2, tOn - 0.1, tOn + 0.35, EIO);
  const lean = ramp(t2, tOn - 0.1, tOn + 0.5, EIO);
  const lift = ramp(t2, tOn + 0.45, tOn + 0.75, EOUT);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 3.2);
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.02, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.4, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c1029' }}>
      <BandImg id="home/kitchen" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Flame t={t} dark={1 - L} />
          <PotLid lift={lift} tilt={-8 * lift} />
          <Steam t={t} amt={ramp(t, tSw + 0.2, tOn + 0.3)} burst={clamp01((t - (tOn + 0.6)) / 0.6)} />
          <MotherKitchen reachL={reachL} press={press} reachR={reachR} look={look} turn={turn} lean={lean} breath={breath} rimO={L} />
          <KitchenDark o={0.8 * (1 - L)} />
          <Tube L={L} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
