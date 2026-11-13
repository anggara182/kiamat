import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, handheld } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { HS, Man, Wife, Boat, PaleHand, LampGlow, OilLamp } from '../art/house_art';

const BG = '#05070d';
const flick = (t: number) => 0.88 + 0.07 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1 + 1);
const winC = { x: HS.win.x + HS.win.w / 2, y: HS.win.y + HS.win.h / 2 };
const doorC = { x: HS.door.x + HS.door.w / 2, y: HS.door.y + HS.door.h / 2 };

const Glints: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: 12 }).map((_, i) => {
      const y = HS.water + 30 + i * 46, w = 40 + (i % 4) * 30, x = 960 + Math.sin(i * 2.3) * 90 + Math.sin(t * 0.8 + i) * 14;
      return <rect key={i} x={x - w / 2} y={y} width={w} height={4} rx={2} fill="#cfd8e6" opacity={0.25 + 0.2 * Math.sin(t * 2 + i * 1.7)} />;
    })}
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={'w' + i} x={winC.x - 30 + Math.sin(t + i) * 8} y={HS.water + 60 + i * 34} width={60 - i * 6} height={4} rx={2} fill="#ffc46b" opacity={0.3 - i * 0.04} />
    ))}
  </g>
);

const Ext: React.FC<{ cam: Cam; t: number; children?: React.ReactNode; fg?: boolean; door?: number }> = ({ cam, t, children, fg = true, door = 0.5 }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="house/ext" cam={cam} />
    <Live cam={cam}>
      <LampGlow id="hWinG" x={winC.x} y={winC.y} r={260} o={flick(t)} />
      <LampGlow id="hDoorG" x={doorC.x} y={doorC.y} r={220} o={door * flick(t + 1)} />
      <Glints t={t} />
      {children}
    </Live>
    {fg && <BandImg id="house/fg" k={1.3} cam={cam} />}
  </AbsoluteFill>
);

/** shot 1 — wide: stilt house over the khlong, one lamp in the window. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: winC.x - 108, oy: winC.y - 192 };
  return <Ext cam={cam} t={t} door={0.25} />;
};

/** shot 4 — husband steps from the boat to the steps; wife with baby waits in the lamp-lit door. Lateral track. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const step = ramp(p, 0.1, 0.55, EIO);
  const cam: Cam = { zoom: 1.6, dx: 0, dy: 0, tx: -60 * p, ox: 1000 - 108, oy: 1440 - 192 };
  const mx = 1080 - 40 * step, my = HS.stepBot.y + 4 - 26 * step;
  return (
    <Ext cam={cam} t={t} door={1} fg={false}>
      <Boat x={1120} y={HS.stepBot.y + 18} w={260} rock={Math.sin(t * 1.4) * 1.5} />
      <Wife x={doorC.x - 10} y={HS.floor - 24} h={210} baby sway={Math.sin(t * 0.9) * 0.6} />
      <Man x={mx} y={my} h={190} dir={-1} pose={step > 0.05 && step < 0.95 ? 'step' : 'stand'} />
    </Ext>
  );
};

/** shot 5 — interior: wife at the low table, husband sitting, one lamp, too quiet. Slow push. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.05 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 620 - 108, oy: 1300 - 192 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0906' }}>
      <BandImg id="house/int" cam={cam} />
      <Live cam={cam}>
        <LampGlow id="hInL" x={640} y={1440} r={520} o={flick(t)} />
        <OilLamp x={640} y={1520} s={1.4} flick={flick(t * 1.3)} />
        <Wife x={440} y={1640} h={640} kneel dir={1} />
        <Man x={900} y={1640} h={600} dir={-1} pose="sit" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — under the house by the boat; a pale hand pushes down between the floorboards. Slow tilt down. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const a = Math.min(0.85, Math.max(0.2, wordAt(8, /hand/i, 0.6) / sec - 0.12));
  const hp = ramp(p, a, Math.min(1, a + 0.35), EIO);
  const cam: Cam = { zoom: 3.2, dx: 0, dy: 0, ty: -250 - 80 * ramp(p, 0, 0.6, EIO), ox: 620 - 108, oy: 1385 - 192 };
  return (
    <Ext cam={cam} t={t} fg={false} door={0}>
      <defs><radialGradient id="hMoonU" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#8fa3bd" stopOpacity="0.45" /><stop offset="1" stopColor="#8fa3bd" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={600} cy={1385} rx={150} ry={150} fill="url(#hMoonU)" />
      <rect x={560} y={HS.floor - 6} width={80} height={4} fill="#0a0604" />
      <PaleHand x={600} y={HS.floor - 4} ext={0.75 * hp} s={0.55} />
      <Boat x={770} y={HS.water + 4} w={200} rock={Math.sin(t) * 1} />
      <Man x={735} y={HS.water - 2} h={128} dir={-1} pose="look" rim="#cfd8e6" />
    </Ext>
  );
};

/** shot 10 — husband climbs back up the steps; wife's silhouette in the lamp-lit door. Locked. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const c = ramp(p, 0.05, 0.85, EIO);
  const cam: Cam = { zoom: 1.6, dx: 0, dy: 0, ox: 960 - 108, oy: 1400 - 192 };
  const sx = HS.stepBot.x + 20 + (HS.stepTop.x + 30 - HS.stepBot.x - 20) * c, sy = HS.stepBot.y - 6 + (HS.stepTop.y - 10 - HS.stepBot.y) * c;
  const hh = handheld(t, 0.15);
  return (
    <Ext cam={{ ...cam, tx: hh.hx, ty: hh.hy }} t={t} door={1.2} fg={false}>
      <Wife x={doorC.x} y={HS.floor - 24} h={215} sil dir={1} />
      <Man x={sx} y={sy} h={190} dir={-1} pose="climb" />
    </Ext>
  );
};

/** shot 11 — wide: a tiny figure runs along the bank away from the house; the window lamp still burns. Pull back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.3 - 0.22 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 520 - 108, oy: 1300 - 192 };
  const rx = 430 - 210 * ramp(p, 0.05, 1, (x) => x);
  return (
    <Ext cam={cam} t={t} door={0.2}>
      <defs><radialGradient id="hRunG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#8fa3bd" stopOpacity="0.35" /><stop offset="1" stopColor="#8fa3bd" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={rx} cy={HS.bankY - 80} rx={200} ry={160} fill="url(#hRunG)" />
      <rect x={0} y={HS.bankY + 6} width={420} height={5} fill="#8fa3bd" opacity={0.4} />
      <Man x={rx} y={HS.bankY + 8} h={165} dir={-1} pose="run" ph={t * 10} rim="#dfe7f2" />
    </Ext>
  );
};
