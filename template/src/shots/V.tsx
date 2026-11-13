import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { VG } from '../sets/village';
import { Rain, Porch, Man, Runner, Wet } from '../art/village_figs';

const BG = '#06070c';

/** shot 1 — the village house in rain at night, porch lit, a tall man still at the gate. Slow push-in. */
export const S01: React.FC = () => {
  const { p, f } = useShot();
  const z = 1.3 + 0.16 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 20 * ramp(p, 0, 1), dy: 0, ty: -40, ox: 300, oy: 1060 };
  const tWord = wordAt(1, /word/i, 0.6);
  const man = 0.55 + 0.45 * ramp(p, tWord - 0.1, tWord + 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="village/bg" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}><Wet f={f} /><Porch on={1} /><g opacity={man}><ellipse cx={VG.MAN.x} cy={VG.MAN.y - 230} rx={150} ry={300} fill="url(#vGlow)" opacity={0.5} /><Man x={VG.MAN.x} y={VG.MAN.y} s={1.05} /></g></Live>
      <Live k={1.2} cam={cam}><Rain f={f} /></Live>
    </AbsoluteFill>
  );
};

/** shot 11 — mother and daughter running across the yard in the rain, door open behind. Handheld. */
export const S11: React.FC = () => {
  const { p, f, t } = useShot();
  const hh = handheld(t, 1.2);
  const cam: Cam = { zoom: 1.2, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy - 30, rot: hh.hr, ox: 330, oy: 1060 };
  const run = ramp(p, 0, 1, (n) => n);
  const mx = 540 - 300 * run, my = 1570 + 20 * run;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="village/bg" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <Wet f={f} on={0.8} />
        <Porch on={0.8} open={1} />
        <ellipse cx={mx - 60} cy={my - 200} rx={240} ry={260} fill="url(#vGlow)" opacity={0.45} />
        <Runner x={mx} y={my} s={1.0} ph={t * 11} mother />
        <Runner x={mx - 120} y={my + 6} s={0.72} ph={t * 13 + 1} />
      </Live>
      <Live k={1.2} cam={cam}><Rain f={f} /></Live>
    </AbsoluteFill>
  );
};

/** shot 12 — grey dawn, the house quiet, a man with a motorbike at the gate facing the open door. Slow pull-back. */
export const S12: React.FC = () => {
  const { p, f } = useShot();
  const z = 1.2 - 0.18 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: -110, ox: 360, oy: 1150 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#3a4152' }}>
      <BandImg id="village/dawn" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <Porch on={0} open={1} />
        <Man x={300} y={1630} s={0.95} fill="#15171c" bike face bikeX={250} />
      </Live>
      <Live k={1.2} cam={cam}><Rain f={f} color="#c8ccd4" o={0.35} /></Live>
    </AbsoluteFill>
  );
};
