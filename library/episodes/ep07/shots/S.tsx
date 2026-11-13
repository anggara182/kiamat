import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { LAMP, WOMAN, Woman, Girl, DroppedMask, gy, gx } from '../art/street_figs';

const BG = '#0b0d18';

/** The streetlight's light: cone + pool + bulb glow. Flicker = opacity only. */
const Light: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id="slPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e8f1ff" stopOpacity="0.5" /><stop offset="0.6" stopColor="#e8f1ff" stopOpacity="0.14" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0" /></radialGradient>
      <linearGradient id="slCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8f1ff" stopOpacity="0.38" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0.04" /></linearGradient>
      <radialGradient id="slBulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="0.25" stopColor="#e8f1ff" stopOpacity="0.45" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0" /></radialGradient>
    </defs>
    <polygon points={`${LAMP.armX - 30},${LAMP.head} ${LAMP.armX + 30},${LAMP.head} ${LAMP.armX + 300},${LAMP.base + 40} ${LAMP.armX - 300},${LAMP.base + 40}`} fill="url(#slCone)" />
    <ellipse cx={LAMP.armX} cy={LAMP.base + 10} rx={420} ry={110} fill="url(#slPool)" />
    <ellipse cx={LAMP.armX} cy={LAMP.head + 6} rx={180} ry={180} fill="url(#slBulb)" />
    <rect x={LAMP.armX - 28} y={LAMP.head - 2} width={56} height={10} rx={4} fill="#ffffff" />
  </g>
);

/** woman's shadow on the asphalt, falling toward camera */
const WShadow: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <path d={`M ${WOMAN.x - 50} ${WOMAN.y} L ${WOMAN.x + 50} ${WOMAN.y} L ${WOMAN.x + 120} ${WOMAN.y + 260} L ${WOMAN.x - 40} ${WOMAN.y + 280} Z`} fill="#05060a" opacity={0.55 * o} />
);

const Street: React.FC<{ cam: Cam; children?: React.ReactNode; light?: number; woman?: boolean; fg?: boolean }> = ({ cam, children, light = 1, woman = true, fg = true }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="street/bg" k={0.85} cam={cam} />
    <Live k={0.85} cam={cam}><Light o={light} />{woman && <><WShadow o={light} /><Woman {...WOMAN} /></>}</Live>
    {children}
    {fg && <BandImg id="street/fg" k={1.25} cam={cam} />}
  </AbsoluteFill>
);

/** shot 1 — wide street, the tall woman perfectly still under the light. Slow push-in. */
export const S01: React.FC = () => {
  const { p } = useShot();
  const z = 1 + 0.16 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: -40 * ramp(p, 0, 1), dy: 0, ox: 700, oy: 900 };
  return <Street cam={cam} />;
};

/** shot 4 — schoolgirl walking toward the streetlight, tracked from behind. No woman yet. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.05 + 0.08 * p, dx: 0, dy: 0, ox: 760, oy: 900 };
  const hh = handheld(t, 0.3);
  return (
    <Street cam={{ ...cam, tx: hh.hx, ty: hh.hy }} woman={false}>
      <Live k={1} cam={{ zoom: 1, dx: 0, dy: 0 }}><Girl x={560} y={1560} h={720} view="back" phase={t * 0.9} amp={0.8} /></Live>
    </Street>
  );
};

/** shot 5 — the tall masked woman under the light; small girl stopped in the fg (scale contrast). */
export const S05: React.FC = () => {
  const { p } = useShot();
  const tw = wordAt(5, /tall/i, 0.25), tm = wordAt(5, /mask/i, 0.85);
  const { sec } = useShot();
  const z = 1.18 + 0.1 * ramp(p, 0, 1) + 0.08 * ramp(p, tw / sec, tm / sec);
  const cam: Cam = { zoom: z, dx: -60, dy: 40, ox: 800, oy: 800 };
  return (
    <Street cam={cam}>
      <Live k={1} cam={{ zoom: 1, dx: 0, dy: 0 }}><Girl x={400} y={1560} h={420} view="back" /></Live>
    </Street>
  );
};

/** shot 10 — woman motionless; girl runs toward camera. Handheld, quick. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const tr = wordAt(10, /ran/i, 0.75);
  const run = ramp(p, Math.min(0.6, tr / sec - 0.35), 1, EIO);
  const hh = handheld(t * 1.8, 1.4);
  const cam: Cam = { zoom: 1.12, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, rot: hh.hr, ox: 760, oy: 900 };
  const s = 0.34 + 0.2 * run;
  const gh = 380 + 380 * run;
  return (
    <Street cam={cam}>
      <Live k={1} cam={{ ...cam, zoom: 1 }}><Girl x={gx(420, s) - 60 * run} y={Math.min(gy(s), 1580)} h={gh} view="front" phase={t * 2.2} amp={0.4 + 0.6 * run} /></Live>
    </Street>
  );
};

/** shot 11 — the empty street; light flickers; a dropped white mask. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, f } = useShot();
  const fl = [1, 1, 1, 0.25, 1, 1, 0.55, 1, 1, 1, 1, 0.15, 0.9, 1, 1, 1][Math.floor(f / 3) % 16];
  const cam: Cam = { zoom: 1.22 - 0.16 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 760, oy: 1100 };
  return (
    <Street cam={cam} light={fl} woman={false}>
      <Live k={1.1} cam={cam}><DroppedMask x={700} y={1500} w={210} /></Live>
    </Street>
  );
};

/** shot 12 — our front gate; a tall masked shadow cast across it. Slow push-in. */
export const S12: React.FC = () => {
  const { p, sec } = useShot();
  const th = wordAt(12, /house/i, 0.9);
  const cam: Cam = { zoom: 1 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1100 };
  const creep = ramp(p, 0, th / sec, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="street/gate" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <g transform={`translate(${760 - 120 * creep}, 1640) skewX(-22) scale(1, 0.95)`} opacity={0.82}>
          <path d="M -90 0 L -100 -160 L -120 -760 Q -130 -800 -96 -830 L -56 -860 L -44 -930 Q -50 -1010 0 -1014 Q 50 -1010 44 -930 L 56 -860 L 96 -830 Q 130 -800 120 -760 L 100 -160 L 90 0 Z" fill="#05060a" />
          <path d="M -52 -940 L -60 -820 L -40 -760 L -46 -940 Z M 52 -940 L 60 -820 L 40 -760 L 46 -940 Z" fill="#05060a" />
          <path d="M -46 -912 L -58 -918 M 46 -912 L 58 -918" stroke="#05060a" strokeWidth={8} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};
