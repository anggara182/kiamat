import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Deck, Catenary, Train, Bikes, DayWires } from '../art/street_day';
import { TW, TowerFg } from '../art/street_tower';
import { CROSS, CrossGround, CrossTraffic, CrossPeople, CrossFg } from '../art/street_cross';
import { DuskSky, DuskGround, LampShadows, LampLight, Trails, Railing } from '../art/street_dusk';

/** shot 2 — hazy morning: a commuter train slides across a concrete viaduct above a river of motorbikes. Lateral track. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const tr = ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: 1.06, dx: 46 - 92 * tr, dy: 0, ty: 170, ox: 540, oy: 760 };
  const head = 11 - 7.5 * t;
  return (
    <AbsoluteFill style={{ backgroundColor: '#c3d1d8' }}>
      <BandImg id="street/sky" k={0.45} cam={cam} />
      <BandImg id="street/day" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam}><Catenary /><Train head={head} /><Deck /></Live>
      <Live k={0.8} cam={cam}><Bikes t={t} /></Live>
      <Live k={1.3} cam={cam}><DayWires /></Live>
    </AbsoluteFill>
  );
};

/** shot 3 — low angle tilting up an unfinished tower with its crane; hard cut on "top" to a top-down hold over a zebra crossing. */
export const S03: React.FC = () => {
  const { t, sec } = useShot();
  const tCut = wordAt(3, /^top/i, 0.52);
  const tSky = Math.min(tCut - 0.25, wordAt(3, /^sky/i, 0.46, 'end'));
  if (t < tCut) {
    // tilt: band window from the lower tower (with near building + wires) up to the crane against the sky
    const u = ramp(t, 0, tSky, EIO);
    const cam: Cam = { zoom: 1, dx: 0, dy: -600 + 1040 * u, ox: 540, oy: 960 };
    return (
      <AbsoluteFill style={{ backgroundColor: '#a9c3d2' }}>
        <BandImg id="street/tower" k={1} cam={cam} />
        <Live k={1.35} cam={cam} w={TW.w} h={TW.h}><TowerFg /></Live>
      </AbsoluteFill>
    );
  }
  const tt = t - tCut;
  const z = 1 + 0.05 * ramp(tt, 0, Math.max(0.5, sec - tCut), EOUT);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8c867d' }}>
      <Live k={1} cam={cam}>
        <g transform={`translate(${CROSS.cx} ${CROSS.cy}) rotate(${CROSS.rot})`}>
          <CrossGround />
          <CrossTraffic />
          <CrossPeople t={tt + 2} />
        </g>
      </Live>
      <Live k={1.3} cam={cam}><CrossFg /></Live>
    </AbsoluteFill>
  );
};

/** shot 6 — time-lapse at dusk: the sun drops between towers, the lamp post's long shadow sweeps the asphalt, the lamp switches on at "night". Locked. */
export const S06: React.FC = () => {
  const { t } = useShot();
  const tSet = wordAt(6, /^sudden/i, 0.58);
  const tNight = wordAt(6, /^night/i, 0.75);
  const u = clamp01(t / tSet);
  const shadowO = 0.5 * (1 - ramp(u, 0.86, 1));
  const night = ramp(t, tSet, tNight + 0.5, EIO);
  const dark = ramp(t, tSet * 0.8, tNight, EIO);
  const dt = t - tNight;
  const on = dt < 0 ? 0 : dt < 0.07 ? 0.85 : dt < 0.14 ? 0.15 : Math.min(1, 0.7 + dt * 2);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1d3d' }}>
      <Live cam={cam}><DuskSky u={u} night={night} /></Live>
      <BandImg id="street/dusk" cam={cam} />
      <Live cam={cam}>
        <DuskGround u={u} dark={dark} />
        <LampShadows u={u} o={shadowO} />
        <Trails o={0.8 * ramp(t, tSet, tNight + 0.4)} t={t} />
        <LampLight on={on} />
        <Railing />
      </Live>
    </AbsoluteFill>
  );
};
