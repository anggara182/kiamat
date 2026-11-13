import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, handheld, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { DaySky, Deck, Catenary, Train, Bikes, DayWires, Birds } from '../art/street_day';
import { TW, TowerBand, TowerFg, BEAM, LiveHook } from '../art/street_tower';
import { CROSS, CrossGround, CrossTraffic, CrossPeople, CrossFg, CrossMoving } from '../art/street_cross';
import { DuskSky, DuskGround, LampShadows, LampLight, Trails, Railing, Pedestrians } from '../art/street_dusk';
import { AlleyLight, PoliceTape, Walkers, BusBg, BusBlur, Shelter, Crowd, OldMan } from '../art/street_walk';
import { Figure, seatPose, handA, Pose, Look } from '../art/street_people';

/* v3 ids: S07 traffic, S09 tower + worker, S10 crossing, S14 sunset time-lapse, S16 worker at dusk,
 * S19 police tape, S20 bus stop. Clocks: camera + environment (train, sun, shadows, lights, tape, bus,
 * birds, hook) on ONES (p/t); people (riders, dots, walkers, worker, old man) on TWOS (p2/t2). */

/** a small decaying shake for impacts (on ones) */
const jolt = (t: number, at: number, amp = 8) => (t < at ? 0 : amp * Math.exp(-(t - at) * 9) * Math.sin((t - at) * 46));

/** shot 7 — hazy morning: the commuter train slides across the viaduct during "Millions", above a river of motorbike riders. Lateral track. */
export const S07: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tM = wordAt(7, /^millions/i, 0.64);
  const cam: Cam = { zoom: 1.06 + 0.02 * p, dx: 46 - 92 * ramp(p, 0, 1, EIO), dy: 0, ty: 170, ox: 540, oy: 760 };
  const head = -3 + 9 * (tM - t); // the nose is crossing the frame's left third on the sync word
  return (
    <AbsoluteFill style={{ backgroundColor: '#c3d1d8' }}>
      <Live k={0.45} cam={cam}><DaySky /><Birds t={t} x0={1300} y0={330} vx={-150} vy={-8} n={7} s={1.1} col="#5a6470" /></Live>
      <BandImg id="street/day" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}><Catenary /><Train head={head} /><Deck /></Live>
      <Live k={0.8} cam={cam}><Bikes t={t2} /></Live>
      <Live k={1.3} cam={cam}><DayWires /></Live>
    </AbsoluteFill>
  );
};

const WORKER: Look = { body: '#262b33', far: '#1b1f25', skin: '#3a3330', hat: 'hardhat', hatCol: '#d9cfb8', vest: '#6a5236', rim: '#fff4d8', rimO: 0.75 };
const WORKER_X = 372;
const WH = 214; // worker height in fg units (x ~2 on screen in S09)

/** shot 9 — quick tilt up to a worker in a hard hat on a high beam; he catches the swinging crane hook on "rising" (clank). */
export const S09: React.FC = () => {
  const { t, t2 } = useShot();
  const tR = wordAt(9, /^rising/i, 0.55);
  const u = ramp(t, 0, tR, EOUT);
  const hh = handheld(t, 0.4);
  // close framing on the worker (fg layer scales ~2x): he is in frame and moving from frame 0
  const cam: Cam = { zoom: 1.75, dx: 123, dy: 378 + 296 * u, ox: 264, oy: 90, tx: hh.hx, ty: hh.hy + jolt(t, tR, 10) };
  const caught = t2 >= tR;
  const k = clamp01(t2 / tR);
  // anticipation: leaning out, arm reaching left for the incoming hook; follow-through: pulls it in, leans back
  const pose: Pose = caught
    ? { lean: -8 + 2 * Math.sin((t2 - tR) * 6), head: -14, thA: 10, shA: 6, thB: -12, shB: -10, uaA: 128, faA: 140, uaB: 30, faB: 96, breath: 0.6 * Math.sin(t2 * 4) }
    : { lean: 4 + 4 * k, head: -20, thA: 6, shA: 2, thB: -8, shB: -6, uaA: 112 + 12 * k, faA: 118 + 16 * k, uaB: 18, faB: 84, breath: 0.4 * Math.sin(t2 * 3) };
  const [handX, handY] = handA(WORKER_X, BEAM.y, WH, -1, pose);
  // hook (environment, on ones): swings in from the left and stops in his hand on the sync word, then jiggles
  const hu = clamp01(t / tR);
  const hookX = t < tR ? handX - 150 * (1 - EOUT(hu)) : handX + jolt(t, tR, 6);
  const hookY = handY + 30;
  const swing = t < tR ? -2.5 * (1 - hu) : jolt(t, tR, 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#a9c3d2' }}>
      <BandImg id="street/tower" k={1} cam={cam} />
      <Live k={1.2} cam={cam} w={TW.w} h={TW.h}><Birds t={t} x0={-200} y0={420} vx={130} vy={-10} n={5} s={0.9} col="#4a5560" seed={9} /></Live>
      <Live k={1.35} cam={cam} w={TW.w} h={TW.h}>
        <TowerFg mood="day">
          <LiveHook x={hookX} y={hookY} swing={swing} />
          <Figure x={WORKER_X} y={BEAM.y} h={WH} dir={-1} pose={pose} look={WORKER} />
        </TowerFg>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — straight down over the zebra crossing: people as dots streaming (on twos), released traffic driving off; very slow rotation. */
export const S10: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.02 + 0.03 * ramp(p, 0, 1, EOUT), dx: 0, dy: 0, rot: -2.5 * p, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8c867d' }}>
      <Live k={1} cam={cam}>
        <g transform={`translate(${CROSS.cx} ${CROSS.cy}) rotate(${CROSS.rot})`}>
          <CrossGround />
          <CrossMoving t={t} t2={t2} />
          <CrossTraffic />
          <CrossPeople t={t2 + 2} />
        </g>
      </Live>
      <Live k={1.3} cam={cam}><CrossFg /></Live>
    </AbsoluteFill>
  );
};

/** shot 14 — time-lapse at dusk: the sun drops between towers, the lamp's shadow sweeps the asphalt, pedestrians stream past; lamp on at "night". Slow push. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tNight = wordAt(14, /^night/i, 0.81);
  const tSet = Math.min(tNight - 0.6, wordAt(14, /^sudden/i, 0.62));
  const u = clamp01(t / tSet);
  const shadowO = 0.5 * (1 - ramp(u, 0.86, 1));
  const night = ramp(t, tSet, tNight + 0.5, EIO);
  const dark = ramp(t, tSet * 0.8, tNight, EIO);
  const dt = t - tNight;
  const on = dt < 0 ? 0 : dt < 0.08 ? 0.85 : dt < 0.17 ? 0.15 : Math.min(1, 0.7 + dt * 2);
  const cam: Cam = { zoom: 1 + 0.035 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 400, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <Live cam={cam}><DuskSky u={u} night={night} /><Birds t={t} x0={1300} y0={360} vx={-240} vy={-20} n={9} s={0.9} col="#1a1530" seed={13} /></Live>
      <BandImg id="street/dusk" cam={cam} />
      <Live cam={cam}>
        <DuskGround u={u} dark={dark} />
        <LampShadows u={u} o={shadowO} />
        <Trails o={0.8 * ramp(t, tSet, tNight + 0.4)} t={t} />
        <Pedestrians t2={t2} light={dark} />
        <LampLight on={on} />
        <Railing />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 16 — the same worker at dusk, sitting on the beam with his legs swinging, looking down at the city. Slow tilt. */
export const S16: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.32, dx: 0, dy: 360 + 70 * ramp(p, 0, 1, EIO), ox: 320, oy: 620 };
  const sw = Math.sin(t2 * 2.6);
  const pose: Pose = { ...seatPose(0.6 * Math.sin(t2 * 2.4), 34, 10 * sw), lean: 16, thA: 84, thB: 80, shA: 4 + 9 * sw, shB: -4 - 7 * sw, uaA: 8, faA: 14, uaB: 4, faB: 10 };
  const blink = Math.max(0, Math.sin(t * 5.2)) ** 6;
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2348' }}>
      {/* the sunset glow sits BEHIND the tower faces, so the tower stays a readable dark silhouette */}
      <Live k={1} cam={cam} w={TW.w} h={TW.h}><TowerBand mood="dusk" glow={[420, 822, 560]} blink={blink} /></Live>
      <Live k={1.2} cam={cam} w={TW.w} h={TW.h}><Birds t={t} x0={980} y0={520} vx={-120} vy={-6} n={6} s={1} col="#120d20" seed={17} /></Live>
      <Live k={1.35} cam={cam} w={TW.w} h={TW.h}>
        <TowerFg mood="dusk">
          <Figure x={WORKER_X + 30} y={BEAM.y + 27 * 1.9} h={190} dir={1} pose={pose} look={{ ...WORKER, body: '#16111f', far: '#0e0b16', skin: '#2a2028', vest: '#3a2a2a', hatCol: '#c9a27a', rim: '#ffc28a', rimO: 0.9 }} />
        </TowerFg>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 19 — people on their phones walk past yellow police tape at a black alley mouth; nobody turns. Slow lateral. */
export const S19: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.04 + 0.02 * p, dx: 36 - 72 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <BandImg id="street/walk" cam={cam} />
      <Live cam={cam}><AlleyLight t={t} /><PoliceTape t={t} /><Walkers t2={t2} /></Live>
    </AbsoluteFill>
  );
};

/** shot 20 — an old man in a peci sits still on a bus-stop bench (only breathing) while the crowd blurs past; a bus whooshes by on "slipping". */
export const S20: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tS = wordAt(20, /^slipping/i, 0.35);
  const cam: Cam = { zoom: 1 + 0.03 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 700, oy: 900, tx: jolt(t, tS - 0.05, 3), ty: jolt(t, tS - 0.05, 2) };
  const flick = Math.sin(t * 47) > 0.92 ? 0.55 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <Live cam={cam}>
        <BusBg />
        <BusBlur t={t} tS={tS} />
        <Shelter back />
        <Crowd t2={t2} front={false} />
        <Shelter flick={flick} />
        <OldMan t2={t2} />
        <Crowd t2={t2} front />
      </Live>
    </AbsoluteFill>
  );
};
