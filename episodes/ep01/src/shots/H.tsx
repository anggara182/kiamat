import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { Fr } from '../art/home_kit';
import { CarportFg, AlleyWindows, Scooter, Father, Kid, Exhaust } from '../art/home_carport';
import { lerp } from '../art/home_kit';
import { HangLamp, SwingLight, Glasses, MotherChild, FatherBack } from '../art/home_dinner';
import { WindowLife, Phone, Sleeper, BlanketFold, SleepArm, CurtainL } from '../art/home_bedroom';
import { HookBed, HookHair, HookPhone, HookGlow, HOOK_LINES, HookNote } from '../art/home_hook';
import { KitchenDark, Tube, Flame, Steam, PotLid, MotherKitchen } from '../art/home_kitchen';

/** Tube start-up stutter (on ones): u = seconds since the switch, len = time until it holds steady. */
const tubeLevel = (u: number, len: number) => {
  if (u < 0) return 0;
  const x = u / len;
  const seq: [number, number][] = [[0.06, 0.85], [0.16, 0.04], [0.24, 0.6], [0.4, 0.1], [0.47, 1], [0.6, 0.25], [0.66, 0.9], [0.74, 0.5]];
  for (const [end, v] of seq) if (x < end) return v;
  return Math.min(1, 0.75 + (x - 0.74) * 2);
};

/* ============ shot 4 (v2 S02): dawn kitchen, the click lands on "lights", the tube flickers right after, the pot steams ============ */
export const S04: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tSw = wordAt(4, /^lights/i, 0.26); // the click
  const r = Math.max(0.6, sec - tSw); // time left after the switch
  const tOn = tSw + 0.5 * r; // tube holds steady
  const L = tubeLevel(t - tSw - 1 / 24, tOn - tSw);
  // mother ON TWOS: hand arrives at the switch (moving at frame 0) -> click on "lights" -> looks up at the stuttering tube -> drops the arm, turns, lifts the lid
  const arrive = ramp(t2, 0, Math.max(0.12, tSw - 0.14), EOUT);
  const press = ramp(t2, tSw - 0.12, tSw, EOUT) * (1 - ramp(t2, tSw + 0.06, tSw + 0.22));
  const look = ramp(t2, tSw + 0.05, tSw + 0.3, EOUT) * (1 - ramp(t2, tSw + 0.4 * r, tSw + 0.6 * r));
  const reachL = (0.55 + 0.45 * arrive) * (1 - ramp(t2, tSw + 0.3 * r, tSw + 0.6 * r, EIO));
  const reachR = ramp(t2, tSw + 0.32 * r, tSw + 0.72 * r, EIO);
  const turn = ramp(t2, tSw + 0.3 * r, tSw + 0.6 * r, EIO);
  const lean = ramp(t2, tSw + 0.3 * r, tSw + 0.7 * r, EIO);
  const lift = ramp(t2, tSw + 0.72 * r, tSw + 0.9 * r, EOUT);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 3.2);
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.02 + 0.03 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.4, ox: 520, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c1029' }}>
      <BandImg id="home/kitchen" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Flame t={t} dark={1 - L} />
          <PotLid lift={lift} tilt={-8 * lift} />
          <Steam t={t} amt={ramp(t, tSw + 0.1, tOn)} burst={clamp01((t - (tSw + 0.76 * r)) / 0.5)} />
          <MotherKitchen reachL={reachL} press={press} reachR={reachR} lift={lift} look={look} turn={turn} lean={lean} breath={breath} rimO={L} />
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

/* ============ shot 5 (v2 S03): dawn carport, the father kick-starts the scooter, the kid in a big helmet waits at the door ============ */
export const S05: React.FC = () => {
  const { t, t2, p, sec } = useShot();
  const tC = wordAt(5, /^cough/i, 0.34); // stomp 1 lands
  const tA = Math.max(tC + 0.24, wordAt(5, /^awake/i, 0.52)); // stomp 2 lands, the engine catches
  // near foot (ON TWOS): on the pedal -> knee up -> stomp -> up -> stomp -> onto the floorboard
  const R = [362, 1237], U = [384, 1150], D = [393, 1314], F = [600, 1206];
  const foot = track(t2, [
    [0, R[0] + 8, R[1] - 50], [Math.max(0.08, tC - 0.18), U[0], U[1]], [tC, D[0], D[1]], [tC + 0.04, D[0], D[1]],
    [tC + (tA - tC) * 0.55, U[0], U[1] + 20], [tA, D[0], D[1]], [tA + 0.1, D[0], D[1]], [Math.min(sec, tA + 0.45), F[0], F[1]],
  ]);
  const kick = foot.x < 470 ? clamp01((foot.y - R[1]) / (D[1] - R[1])) : 0;
  const rise = Math.max(bumpT(t2, tC - 0.16, 0.3), bumpT(t2, tA - 0.14, 0.26));
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

/* ============ shot 2 (v2 S04): bedroom close at dawn, the hand pulls back and slaps the buzzing phone EXACTLY on "slowly"; stillness, the dawn grows ============ */
export const S02: React.FC = () => {
  const { t, t2, p, sec } = useShot();
  const tSlap = wordAt(2, /^slowly/i, 0.17);
  // the hand ON TWOS: already out, groping toward the phone at frame 0 -> pulls back and up (anticipation) -> slap -> bounce -> settles
  const wrist = track(t2, [
    [0, 646, 1250], [tSlap * 0.35, 668, 1258], [tSlap - 0.12, 640, 1222], [tSlap, 716, 1268], [tSlap + 0.1, 712, 1262], [tSlap + 0.25, 716, 1270], [sec, 718, 1272],
  ]);
  const lift = ramp(t2, tSlap * 0.35, tSlap - 0.12, EOUT) * (1 - ramp(t2, tSlap - 0.06, tSlap)) + 0.25 * bumpT(t2, tSlap + 0.02, 0.18);
  const ang = -6 - 18 * lift + 4 * bumpT(t2, 0, 0.3);
  const spread = ramp(t2, tSlap - 0.04, tSlap + 0.04) * (1 - 0.4 * ramp(t2, tSlap + 0.5, tSlap + 1.2));
  const stir = 0.6 + 0.4 * bumpT(t2, tSlap - 0.2, 0.6) - 0.3 * ramp(t2, tSlap + 0.6, sec);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 2.2);
  // phone + window + camera ON ONES
  const off = t >= tSlap + 1 / 24;
  const ring = off ? Math.max(0, 0.5 - (t - tSlap) * 4) : 1;
  const hop = t >= tSlap ? 10 * Math.exp(-(t - tSlap) * 14) * Math.abs(Math.cos((t - tSlap) * 40)) : 0;
  const buzz = off ? 0 : (Math.floor(t * 24) % 2 ? 3 : -3);
  const dawn = ramp(t, tSlap + 0.3, sec, EIO);
  const j = t >= tSlap ? Math.exp(-(t - tSlap) * 9) * Math.sin((t - tSlap) * 50) : 0;
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.15 + 0.035 * p, dx: 0, dy: 0, tx: h.hx + 6 * j, ty: h.hy + 10 * j, ox: 640, oy: 1180 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d1a33' }}>
      <BandImg id="home/bedroom" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <WindowLife lamp={0.25 + 0.75 * dawn} dots={0.6 + 0.4 * dawn} t={t} dawn={dawn} />
          <CurtainL t={t} />
          <Sleeper breath={breath} stir={stir} />
          <g transform={`translate(0 ${-hop})`}><Phone ring={ring} buzz={buzz} t={t} /></g>
          <SleepArm wx={wrist.x} wy={wrist.y} ang={ang} lift={lift} spread={spread} rim={0.3 + 0.7 * ring} />
          <BlanketFold stir={stir} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 1 (NEW hook): the phone on the blanket floods with news; one new notification + buzz on "world", "end", "bang" ============ */
export const S01: React.FC = () => {
  const { t, t2, sec } = useShot();
  const beats = [wordAt(1, /^world/i, 0.26), wordAt(1, /^end/i, 0.51), wordAt(1, /^bang/i, 0.7)];
  const arr = [-10, -0.12, ...beats];
  const notes: HookNote[] = HOOK_LINES.map((n, i) => ({ ...n, arr: arr[i] }));
  // buzz (ONES): decaying shake after every arrival (the one sliding in at frame 0 is already buzzing)
  const bz = (k: number) => arr.slice(1).reduce((a, b) => { const u = t - b; return u < 0 || u > 0.4 ? a : a + Math.exp(-u * 9) * Math.sin(u * 90 + k); }, 0);
  const lit = arr.slice(1).reduce((a, b) => Math.max(a, t >= b ? Math.exp(-(t - b) * 4) : 0), 0);
  // sleeper ON TWOS: the hair stirs, more at "bang"
  const stir = 0.3 * Math.sin(t2 * 1.7) + bumpT(t2, beats[2] - 0.05, 0.5);
  const breath = 0.5 + 0.5 * Math.sin(t2 * 2.4);
  const h = handheld(t, 0.3);
  const z = 1.02 + 0.08 * EIO(t / sec);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr * 0.5, ox: 584, oy: 720 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#120e1c' }}>
      <Live cam={cam}>
        <Fr>
          <HookBed breath={breath} glow={0.6 + 0.4 * lit} />
          <HookGlow lit={lit} />
          <HookPhone notes={notes} t={t} bx={6 * bz(0)} br={1.2 * bz(1.7)} lit={lit} />
        </Fr>
      </Live>
      <Live k={1.2} cam={cam}><Fr><HookHair t2={t2} stir={stir} /></Fr></Live>
    </AbsoluteFill>
  );
};

/* ============ shot 18 (v2 S15): night, family dinner on the floor mat; the lamp swings, glasses tremble, jolts on "shaking" / "again" ============ */
export const S18: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tS = wordAt(18, /^shaking/i, 0.26);
  const ags = [wordAt(18, /^again/i, 0.44)];
  const sp = spanOf(18);
  const again2 = sp.shot.words.filter((w) => /^again/i.test(w.text))[1];
  ags.push(again2 ? again2.start - sp.from / FPS : ags[0] + 0.5);
  const jolts = [tS, ...ags];
  // camera + environment ON ONES
  const jolt = (k: number) => jolts.reduce((a, j, i) => { const u = t - j; return u < 0 ? a : a + (i === 0 ? 1 : 0.6) * Math.exp(-u * 7) * Math.sin(u * 46 + k); }, 0);
  const amp = 10 * ramp(t, tS - 0.05, tS + 0.4, EOUT);
  const ang = amp * Math.sin((t - tS) * 5.6) + 2 * Math.sin(t * 2.4);
  const tr = 3 * ramp(t, tS - 0.05, tS + 0.1) * (0.6 + 0.4 * Math.abs(jolt(0)));
  const cam: Cam = { zoom: 1.38 + 0.05 * EIO(t / sec), dx: 0, dy: 0, tx: 12 * jolt(0), ty: 9 * jolt(1.3), rot: 0.35 * jolt(2.1), ox: 620, oy: 1200 };
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
          <MotherChild hug={hug} look={look} breath={breath} eat={0.5 - 0.5 * Math.cos(t2 * 5)} />
          <HangLamp ang={ang} />
        </Fr>
      </Live>
      <Live k={1.15} cam={cam}><Fr><FatherBack look={look} breath={breath} flinch={flinch} /></Fr></Live>
    </AbsoluteFill>
  );
};
