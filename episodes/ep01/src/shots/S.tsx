import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { DaySky, Deck, Catenary, Train, Bikes, DayWires } from '../art/street_day';
import { TW, TowerBand, TowerFg, BEAM } from '../art/street_tower';
import { CROSS, CrossGround, CrossTraffic, CrossPeople, CrossFg } from '../art/street_cross';
import { DuskSky, DuskGround, LampShadows, LampLight, Trails, Railing, Pedestrians } from '../art/street_dusk';
import { AlleyLight, PoliceTape, Walkers, BusBg, BusBlur, Shelter, Crowd, OldMan } from '../art/street_walk';
import { Figure, seatPose, Pose, Look } from '../art/street_people';

/* Clocks: camera + environment (train, sun, shadows, lights, tape, bus) on ONES (p/t);
 * people (riders, dots, walkers, worker, old man) on TWOS (p2/t2). */

/** shot 5 — hazy morning: a commuter train slides across a concrete viaduct above a river of motorbike riders. Lateral track. */
export const S05: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tr = ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: 1.06, dx: 46 - 92 * tr, dy: 0, ty: 170, ox: 540, oy: 760 };
  const head = 11 - 7.5 * t;
  return (
    <AbsoluteFill style={{ backgroundColor: '#c3d1d8' }}>
      <Live k={0.45} cam={cam}><DaySky /></Live>
      <BandImg id="street/day" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}><Catenary /><Train head={head} /><Deck /></Live>
      <Live k={0.8} cam={cam}><Bikes t={t2} /></Live>
      <Live k={1.3} cam={cam}><DayWires /></Live>
    </AbsoluteFill>
  );
};

const WORKER: Look = { body: '#262b33', far: '#1b1f25', skin: '#3a3330', hat: 'hardhat', hatCol: '#d9cfb8', vest: '#6a5236', rim: '#fff4d8', rimO: 0.75 };
const WORKER_X = 372;

/** shot 7 — low angle tilting up the unfinished tower; a worker in a hard hat on a high beam reaches for the crane hook. */
export const S07: React.FC = () => {
  const { t, t2 } = useShot();
  const tEnd = wordAt(7, /^claims/i, 0.7);
  const u = ramp(t, 0, tEnd, EIO);
  const cam: Cam = { zoom: 1, dx: 0, dy: -600 + 1040 * u, ox: 540, oy: 960 };
  // worker: standing on the beam, leaning back, near arm reaching up for the hook, far hand on the safety line
  const reach = Math.sin(t2 * 2.2);
  const pose: Pose = { lean: -6 + reach, head: -24, thA: 8, shA: 4, thB: -10, shB: -8, uaA: 168 + 6 * reach, faA: 176 + 4 * reach, uaB: 24, faB: 92 + 6 * reach, breath: 0.4 * Math.sin(t2 * 3) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#a9c3d2' }}>
      <BandImg id="street/tower" k={1} cam={cam} />
      <Live k={1.35} cam={cam} w={TW.w} h={TW.h}>
        <TowerFg mood="day"><Figure x={WORKER_X} y={BEAM.y} h={214} dir={-1} pose={pose} look={WORKER} /></TowerFg>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — straight down over the zebra crossing, people as dots streaming (on twos); very slow rotation. */
export const S08: React.FC = () => {
  const { p, t2 } = useShot();
  const cam: Cam = { zoom: 1.02 + 0.03 * ramp(p, 0, 1, EOUT), dx: 0, dy: 0, rot: -2.5 * p, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8c867d' }}>
      <Live k={1} cam={cam}>
        <g transform={`translate(${CROSS.cx} ${CROSS.cy}) rotate(${CROSS.rot})`}>
          <CrossGround />
          <CrossTraffic />
          <CrossPeople t={t2 + 2} />
        </g>
      </Live>
      <Live k={1.3} cam={cam}><CrossFg /></Live>
    </AbsoluteFill>
  );
};

/** shot 11 — time-lapse at dusk: the sun drops between towers, the lamp's shadow sweeps the asphalt, pedestrians stream past; lamp on at "night". Locked. */
export const S11: React.FC = () => {
  const { t, t2 } = useShot();
  const tSet = wordAt(11, /^sudden/i, 0.6);
  const tNight = wordAt(11, /^night/i, 0.77);
  const u = clamp01(t / tSet);
  const shadowO = 0.5 * (1 - ramp(u, 0.86, 1));
  const night = ramp(t, tSet, tNight + 0.5, EIO);
  const dark = ramp(t, tSet * 0.8, tNight, EIO);
  const dt = t - tNight;
  const on = dt < 0 ? 0 : dt < 0.08 ? 0.85 : dt < 0.17 ? 0.15 : Math.min(1, 0.7 + dt * 2);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <Live cam={cam}><DuskSky u={u} night={night} /></Live>
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

/** shot 13 — the same worker at dusk, sitting on the beam with his legs hanging, looking down at the city. Slow tilt. */
export const S13: React.FC = () => {
  const { p, t2 } = useShot();
  const cam: Cam = { zoom: 1.32, dx: 0, dy: 360 + 70 * ramp(p, 0, 1, EIO), ox: 320, oy: 620 };
  const sw = Math.sin(t2 * 2.6);
  const pose: Pose = { ...seatPose(0.6 * Math.sin(t2 * 2.4), 34, 10 * sw), lean: 16, thA: 84, thB: 80, shA: 4 + 9 * sw, shB: -4 - 7 * sw, uaA: 8, faA: 14, uaB: 4, faB: 10 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2348' }}>
      <Live k={1} cam={cam} w={TW.w} h={TW.h}><TowerBand mood="dusk" /></Live>
      <Live k={1.35} cam={cam} w={TW.w} h={TW.h}>
        {/* sunset-lit haze behind the worker so his silhouette reads dark against light */}
        <defs><radialGradient id="stWGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f6b98a" stopOpacity={0.75} /><stop offset="0.5" stopColor="#d9785f" stopOpacity={0.3} /><stop offset="1" stopColor="#d9785f" stopOpacity={0} /></radialGradient></defs>
        <ellipse cx={WORKER_X + 60} cy={BEAM.y - 60} rx={460} ry={360} fill="url(#stWGlow)" />
      </Live>
      <Live k={1.35} cam={cam} w={TW.w} h={TW.h}>
        <TowerFg mood="dusk">
          <Figure x={WORKER_X + 30} y={BEAM.y + 27 * 1.9} h={190} dir={1} pose={pose} look={{ ...WORKER, body: '#16111f', far: '#0e0b16', skin: '#2a2028', vest: '#3a2a2a', hatCol: '#c9a27a', rim: '#ffc28a', rimO: 0.9 }} />
        </TowerFg>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 16 — people on their phones walk past yellow police tape at a black alley mouth; nobody turns. Slow lateral. */
export const S16: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.04, dx: 36 - 72 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <BandImg id="street/walk" cam={cam} />
      <Live cam={cam}><AlleyLight /><PoliceTape t={t} /><Walkers t2={t2} /></Live>
    </AbsoluteFill>
  );
};

/** shot 17 — an old man in a peci sits still on a bus-stop bench (only breathing) while the crowd and a bus blur past. Locked. */
export const S17: React.FC = () => {
  const { t, t2 } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <Live cam={cam}>
        <BusBg />
        <BusBlur t={t} />
        <Shelter back />
        <Crowd t2={t2} front={false} />
        <Shelter />
        <OldMan t2={t2} />
        <Crowd t2={t2} front />
      </Live>
    </AbsoluteFill>
  );
};
