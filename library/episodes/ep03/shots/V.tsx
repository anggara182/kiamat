import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO } from '../comp/Camera';
import { GROUND, GAP, HOUSE, WINDOWS } from '../sets/village';
import { Kid, Dad, MomRun, MomHero, FgFrame } from '../art/village_figs';

const Fg: React.FC<React.ComponentProps<typeof FgFrame>> = (pr) => (
  <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}><FgFrame {...pr} /></svg>
);

/* =============== Set "village" (owner V) =============== */

const Glow: React.FC<{ id: string; x: number; y: number; r: number; c: string; o: number }> = ({ id, x, y, r, c, o }) => (
  <g>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={c} stopOpacity={o} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** 1 — wide maghrib, slow push-in with parallax; kids run home across the yard. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1 + 0.08 * e, dx: -20 * e, dy: -10 * e };
  const kids = [0, 1, 2].map((i) => ({ x: 1000 - i * 70 - p * 520, s: 1.05 - i * 0.12, ph: t * 11 + i * 1.7 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#141233', overflow: 'hidden' }}>
      <BandImg id="village/sky" k={0.15} cam={cam} />
      <BandImg id="village/far" k={0.45} cam={cam} />
      <Live k={0.45} cam={cam}>
        <Glow id="v1w" x={WINDOWS[3][0]} y={WINDOWS[3][1]} r={26} c="#ffd08a" o={0.6 + 0.1 * Math.sin(t * 3)} />
      </Live>
      <Live k={1} cam={cam}>
        <ellipse cx={720} cy={1430} rx={620} ry={150} fill="url(#v1hz)" />
        <defs><radialGradient id="v1hz"><stop offset="0" stopColor="#ffb070" stopOpacity={0.85} /><stop offset="1" stopColor="#f0874a" stopOpacity={0} /></radialGradient></defs>
      </Live>
      <BandImg id="village/mid" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        {WINDOWS.slice(0, 2).map(([wx, wy], i) => <Glow key={i} id={`v1g${i}`} x={wx} y={wy} r={90} c="#ffb35c" o={0.35} />)}
        <ellipse cx={720} cy={GROUND - 40} rx={420} ry={70} fill="url(#v1hz)" opacity={0.6} />
        {kids.map((k, i) => <Kid key={i} x={k.x} y={GROUND - 2 + i * 4} s={k.s * 1.35} ph={k.ph} />)}
      </Live>
      <Fg stalk="l" right={false} />
    </AbsoluteFill>
  );
};

/** 6 — blue hour; follow dad laterally as he circles the house banging the wok. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const dadX = 180 + 520 * p;
  const cam: Cam = { zoom: 1.18, dx: 120 - 240 * e, dy: -40 };
  const strike = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.2)), 6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1430', overflow: 'hidden' }}>
      <BandImg id="village/skyblue" k={0.15} cam={cam} />
      <BandImg id="village/far" k={0.45} cam={cam} />
      <BandImg id="village/mid" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Glow id="v6lamp" x={HOUSE.lampX} y={HOUSE.lampY + 20} r={300} c="#ffb35c" o={0.75 + 0.05 * Math.sin(t * 9)} />
        <Glow id="v6lamp2" x={HOUSE.lampX} y={HOUSE.lampY} r={90} c="#ffd08a" o={0.8} />
        <circle cx={HOUSE.lampX} cy={HOUSE.lampY} r={7} fill="#ffd08a" />
        {WINDOWS.slice(0, 2).map(([wx, wy], i) => <Glow key={i} id={`v6g${i}`} x={wx} y={wy} r={70} c="#ffb35c" o={0.25} />)}
        <Dad x={dadX} y={GROUND + 4} s={1.15} ph={t * 6.5} strike={strike} />
        {/* small ring of sound off the wok rim, drawn as fading arcs (no flash) */}
        {strike > 0.2 && [0, 1].map((k) => (
          <path key={k} d={`M ${dadX - 50 - k * 14} ${GROUND - 260 - k * 10} q 20 -24 50 -28`} stroke="#9fc0d8" strokeWidth={2} fill="none" opacity={strike * 0.5} />
        ))}
      </Live>
      <Fg stalk="r" left={false} />
    </AbsoluteFill>
  );
};

/** 7 — HERO: mom from behind at the bamboo edge, hands cupped; slow push-in. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const gx = GAP.x - 108, gy = 1300 - 192;
  const cam: Cam = { zoom: 1.9 + 0.12 * e, dx: 0, dy: 0, ox: gx, oy: gy, tx: 770 - gx, ty: 0 };
  const momCam: Cam = { zoom: 1 + 0.07 * e, dx: 0, dy: 0 };
  const call = ramp(p, 0.15, 0.4) * (1 - 0.4 * ramp(p, 0.75, 1));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1430', overflow: 'hidden' }}>
      <BandImg id="village/skyblue" k={0.15} cam={cam} />
      <BandImg id="village/mid" k={1} cam={cam} />
      <Live k={1} cam={momCam}>
        <Glow id="v7cool" x={470} y={860} r={380} c="#7d8cb0" o={0.55} />
        <Glow id="v7warm" x={60} y={1600} r={560} c="#ffb35c" o={0.28} />
        <MomHero x={468} y={1722} s={1.05} t={t} call={call} />
      </Live>
      <Fg left={false} right stalk="l" />
    </AbsoluteFill>
  );
};

/** 9 — handheld wide, slight whip: mom runs into the dark gap; dad frozen in the fg, wok lowered. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 1.6);
  const whip = ramp(p, 0, 0.18);
  const gx = GAP.x - 108, gy = 1300 - 192;
  const cam: Cam = { zoom: 1.6, dx: 0, dy: 0, ox: gx, oy: gy, tx: (620 - gx) * (0.7 + 0.3 * whip) + h.hx, ty: h.hy, rot: h.hr };
  const run = ramp(p, 0.05, 0.85, EIO);
  const mx = 760 + (GAP.x - 760) * run, my = GROUND + 40 - 50 * run;
  const ms = 1.6 - 0.8 * run;
  const gone = ramp(p, 0.78, 0.9);
  const dadCam: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx * 1.4, ty: h.hy * 1.4, rot: h.hr };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1430', overflow: 'hidden' }}>
      <BandImg id="village/skyblue" k={0.15} cam={cam} />
      <BandImg id="village/far" k={0.45} cam={cam} />
      <Live k={1} cam={cam}>
        <Glow id="v9gap" x={GAP.x} y={GAP.top + 200} r={320} c="#9fc0d8" o={0.6} />
      </Live>
      <BandImg id="village/mid" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Glow id="v9g2" x={GAP.x} y={GROUND - 60} r={200} c="#9fc0d8" o={0.35} />
        <g opacity={1 - gone}><MomRun x={mx} y={my} s={ms} ph={t * 12} /></g>
      </Live>
      <Live k={1} cam={dadCam}>
        <Glow id="v9dr" x={330} y={1250} r={420} c="#5d6a8a" o={0.45} />
        <Dad x={290} y={2260} s={6.6} ph={0} strike={0} walk={0} lowered rim="#9fc0d8" />
      </Live>
      <Fg right={false} />
    </AbsoluteFill>
  );
};
