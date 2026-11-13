import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { Fr } from '../art/home_kit';
import { CarportFg, AlleyWindows, Scooter, Father, Kid, Exhaust } from '../art/home_carport';
import { lerp } from '../art/home_kit';
import { HangLamp, SwingLight, Glasses, MotherChild, FatherBack } from '../art/home_dinner';
import { WindowLife, Phone, Sleeper, BlanketFold, SleepArm } from '../art/home_bedroom';
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

/* ============ shot 4: bedroom close at dawn, a hand creeps out of the blanket and slaps the phone alarm; minaret lamp on "prayer" ============ */
export const S04: React.FC = () => {
  const { t, t2, p, sec } = useShot();
  const tPray = wordAt(4, /^prayer/i, 0.2);
  const tHund = wordAt(4, /^hundred/i, 0.56);
  const tSlap = Math.min(sec - 0.5, wordAt(4, /^alarm/i, 0.74) - 0.04);
  // the hand ON TWOS: creeps out, pats the sheet (misses), raises, slaps
  const wrist = track(t2, [
    [0.1, 520, 1204], [Math.min(0.9, tSlap * 0.4), 600, 1250], [tSlap * 0.5, 610, 1262], [tSlap * 0.62, 630, 1258], [tSlap * 0.8, 640, 1262],
    [tSlap - 0.18, 700, 1232], [tSlap, 770, 1268], [sec, 774, 1270],
  ]);
  const pat = bumpT(t2, tSlap * 0.45, tSlap * 0.14);
  const lift = Math.max(ramp(t2, tSlap - 0.3, tSlap - 0.1, EOUT) * (1 - ramp(t2, tSlap - 0.08, tSlap)), 0.5 * pat);
  const ang = -6 + 10 * pat - 14 * lift;
  const spread = ramp(t2, tSlap - 0.04, tSlap + 0.06);
  const stir = ramp(t2, 0, 0.6) * (1 - 0.4 * ramp(t2, tSlap + 0.2, sec));
  const breath = 0.5 + 0.5 * Math.sin(t2 * 2.4);
  // phone + window (ON ONES)
  const off = t > tSlap + 0.06;
  const ring = off ? Math.max(0, 0.4 - (t - tSlap) * 2) : 1;
  const buzz = off ? 0 : (Math.floor(t * 24) % 2 ? 2.5 : -2.5) * (Math.floor(t * 3) % 2 ? 1 : 0.2);
  const lamp = ramp(t, tPray, tPray + 0.25, EOUT);
  const dots = ramp(t, tHund, tHund + 0.45);
  const cam: Cam = { zoom: 1.15 + 0.03 * p, dx: 0, dy: 0, ox: 640, oy: 1180 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d1a33' }}>
      <BandImg id="home/bedroom" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <WindowLife lamp={lamp} dots={dots} t={t} />
          <Sleeper breath={breath} stir={stir} />
          <Phone ring={ring} buzz={buzz} t={t} />
          <SleepArm wx={wrist.x} wy={wrist.y} ang={ang} lift={lift} spread={spread} rim={0.3 + 0.7 * ring} />
          <BlanketFold stir={stir} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 15: night, family dinner on the floor mat; the lamp swings, glasses tremble, jolts on "shaking" / "again" ============ */
export const S15: React.FC = () => {
  const { t, t2 } = useShot();
  const tS = wordAt(15, /^shaking/i, 0.25);
  const ags = [wordAt(15, /^again/i, 0.45)];
  const sp = spanOf(15);
  const again2 = sp.shot.words.filter((w) => /^again/i.test(w.text))[1];
  ags.push(again2 ? again2.start - sp.from / FPS : ags[0] + 0.5);
  const jolts = [tS, ...ags];
  // camera + environment ON ONES
  const jolt = (k: number) => jolts.reduce((a, j, i) => { const u = t - j; return u < 0 ? a : a + (i === 0 ? 1 : 0.6) * Math.exp(-u * 7) * Math.sin(u * 46 + k); }, 0);
  const amp = 10 * ramp(t, tS - 0.05, tS + 0.4, EOUT);
  const ang = amp * Math.sin((t - tS) * 5.6) + 1.2 * Math.sin(t * 2);
  const tr = 3 * ramp(t, tS - 0.05, tS + 0.1) * (0.6 + 0.4 * Math.abs(jolt(0)));
  const cam: Cam = { zoom: 1.3, dx: 0, dy: 0, tx: 12 * jolt(0), ty: 9 * jolt(1.3), rot: 0.35 * jolt(2.1), ox: 600, oy: 1160 };
  // people ON TWOS
  const hug = ramp(t2, tS - 0.04, tS + 0.34, EOUT);
  const look = ramp(t2, tS + 0.05, tS + 0.4, EOUT);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 3.4);
  const flinch = jolts.reduce((a, j) => Math.max(a, bumpT(t2, j, 0.25)), 0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#120e14' }}>
      <BandImg id="home/dinner" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <SwingLight ang={ang} />
          <Glasses tr={tr} t={t} />
          <MotherChild hug={hug} look={look} breath={breath} />
          <HangLamp ang={ang} />
        </Fr>
      </Live>
      <Live k={1.15} cam={cam}><Fr><FatherBack look={look} breath={breath} flinch={flinch} /></Fr></Live>
    </AbsoluteFill>
  );
};
