import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr } from '../art/home_kit';
import { CarportFg, AlleyWindows, Scooter, Father, Kid, Exhaust } from '../art/home_carport';
import { lerp } from '../art/home_kit';
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
  const r = Math.max(0.6, sec - tSw); // time left after the switch
  const tOn = tSw + 0.5 * r; // tube holds steady
  const L = tubeLevel(t - tSw, tOn - tSw);
  // mother ON TWOS: press -> looks up at the stuttering tube -> drops the arm, turns to the stove, lifts the lid
  const press = ramp(t2, tSw - 0.16, tSw, EOUT) * (1 - ramp(t2, tSw + 0.05, tSw + 0.2));
  const look = ramp(t2, tSw + 0.05, tSw + 0.3, EOUT) * (1 - ramp(t2, tSw + 0.4 * r, tSw + 0.6 * r));
  const reachL = 1 - ramp(t2, tSw + 0.3 * r, tSw + 0.6 * r, EIO);
  const reachR = ramp(t2, tSw + 0.32 * r, tSw + 0.72 * r, EIO);
  const turn = ramp(t2, tSw + 0.3 * r, tSw + 0.6 * r, EIO);
  const lean = ramp(t2, tSw + 0.3 * r, tSw + 0.7 * r, EIO);
  const lift = ramp(t2, tSw + 0.72 * r, tSw + 0.9 * r, EOUT);
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
          <Steam t={t} amt={ramp(t, tSw + 0.1, tOn)} burst={clamp01((t - (tSw + 0.76 * r)) / 0.5)} />
          <MotherKitchen reachL={reachL} press={press} reachR={reachR} look={look} turn={turn} lean={lean} breath={breath} rimO={L} />
          <KitchenDark o={0.8 * (1 - L)} />
          <Tube L={L} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/** keyframe track: [[time, x, y], ...] -> point (eased between keys) */
const track = (t: number, keys: [number, number, number][]) => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1] = keys[i];
    const [t0, x0, y0] = keys[i - 1];
    if (t <= t1) { const u = EIO((t - t0) / Math.max(1e-3, t1 - t0)); return { x: lerp(x0, x1, u), y: lerp(y0, y1, u) }; }
  }
  const k = keys[keys.length - 1];
  return { x: k[1], y: k[2] };
};

/* ============ shot 3: dawn carport, the father kick-starts the scooter, the kid in a big helmet waits at the door ============ */
export const S03: React.FC = () => {
  const { t, t2, p, sec } = useShot();
  const tC = wordAt(3, /^cough/i, 0.38);
  const tA = Math.max(tC + 0.4, wordAt(3, /^awake/i, 0.62));
  // near foot (ON TWOS): on the pedal -> knee up -> stomp -> up -> stomp -> onto the floorboard
  const R = [362, 1237], U = [384, 1150], D = [393, 1314], F = [600, 1206];
  const foot = track(t2, [
    [0, R[0], R[1] - 20], [tC - 0.24, U[0], U[1]], [tC - 0.04, D[0], D[1]], [tC + 0.06, D[0], D[1]],
    [tA - 0.24, U[0], U[1]], [tA - 0.04, D[0], D[1]], [tA + 0.1, D[0], D[1]], [Math.min(sec, tA + 0.45), F[0], F[1]],
  ]);
  const kick = foot.x < 470 ? clamp01((foot.y - R[1]) / (D[1] - R[1])) : 0;
  const rise = Math.max(bumpT(t2, tC - 0.2, 0.3), bumpT(t2, tA - 0.2, 0.3));
  const look = ramp(t2, tA + 0.15, tA + 0.5, EIO);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 3);
  // engine (environment, ON ONES)
  const running = t > tA;
  const shake = running ? 1.6 * Math.sin(t * 90) : 0;
  const lamp = running ? (t - tA < 0.06 ? 0.5 : 1) : 0;
  const births = [tC, tC + 0.08, tA, tA + 0.1, tA + 0.35, tA + 0.6, tA + 0.85].filter((b) => b < sec);
  // kid (ON TWOS): helmet tipped over his eyes, he shoves it up when the engine catches, little bounce
  const push = ramp(t2, tA - 0.1, tA + 0.2, EOUT);
  const bounce = running ? Math.abs(Math.sin((t2 - tA) * 9)) * ramp(t2, tA, tA + 0.2) : 0.15 * Math.abs(Math.sin(t2 * 4));
  const cam: Cam = { zoom: 1.04, dx: 44 - 88 * EIO(p), dy: 0, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d1e2e' }}>
      <BandImg id="home/carport" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <AlleyWindows u={p} />
          <g transform="translate(-64 0)">
            <Exhaust t={t} births={births} />
            <Scooter lamp={lamp} shake={shake} kick={kick} />
            <Father foot={foot} rise={rise} look={look} breath={breath} />
          </g>
          <Kid push={push} bounce={bounce} tilt={-16} />
        </Fr>
      </Live>
      <Live k={1.35} cam={cam}><Fr><CarportFg /></Fr></Live>
    </AbsoluteFill>
  );
};

const bumpT = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
