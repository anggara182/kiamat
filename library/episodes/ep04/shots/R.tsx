import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Pocong, Motorbike, RoadDefs } from '../art/road_figs';
import { LAMP, GATE } from '../sets/road';

/* =============== Set "road" (owner R) =============== */

const POC_X = 790;

/** Lamp glow, cone and pool on the asphalt (live so the dawn shot can switch it off). */
const LampLight: React.FC<{ on?: number }> = ({ on = 1 }) => (
  <g opacity={on}>
    <path d={`M ${LAMP.x - 36},${LAMP.y - 8} L ${LAMP.x + 14},${LAMP.y - 8} L ${LAMP.x + 420},1560 L ${LAMP.x - 360},1560 Z`} fill="url(#roadCone)" />
    <ellipse cx={LAMP.x + 30} cy={1520} rx={470} ry={120} fill="url(#roadPool)" />
    <ellipse cx={LAMP.x - 10} cy={LAMP.y - 4} rx={170} ry={170} fill="url(#roadGlow)" />
    <ellipse cx={LAMP.x - 10} cy={LAMP.y - 6} rx={26} ry={6} fill="#fff4d0" />
    {/* warm light catching the gate post faces */}
    <rect x={GATE.l - 34} y={1100} width={8} height={GATE.ground - 1100} fill="#ffc070" opacity={0.35} />
  </g>
);

const Gate: React.FC<{ cam: Cam; p: number; t: number; arm?: number; dark?: number; pocS?: number; pocY?: number; pocX?: number; light?: number; children?: React.ReactNode }> = ({ cam, t, arm = 0, dark = 0, pocS = 0.98, pocY = GATE.ground, pocX = POC_X, light = 1, children }) => (
  <>
    <BandImg id="road/sky" k={0.25} cam={cam} />
    <BandImg id="road/mid" k={0.7} cam={cam} />
    <Live k={0.7} cam={cam}>
      <RoadDefs />
      <LampLight on={light} />
      <Pocong x={pocX} y={pocY} s={pocS} arm={arm} dark={dark} t={t} />
    </Live>
    {children}
    <BandImg id="road/fg" k={1.3} cam={cam} />
  </>
);

/** 1 — wide, cemetery gate under one sodium lamp; still white figure by the gate. Slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.14 + 0.2 * EIO(p), dx: -30 * EIO(p), dy: 0, tx: h.hx, ty: h.hy, ox: 720, oy: 1180 };
  return <AbsoluteFill style={{ backgroundColor: '#0a0d1c', overflow: 'hidden' }}><Gate cam={cam} p={p} t={t} /></AbsoluteFill>;
};

/** 5 — medium, uncle's ojek rolls into the lamp pool; the figure at the gate raises an arm-shape. Lateral track. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.2, dx: 60 - 120 * e, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 1100 };
  const waveT = wordAt(5, /waved/i, 0.75);
  const arrive = ramp(p, 0, 0.55, (x) => 1 - Math.pow(1 - x, 3));
  const arm = ramp(t, waveT - 0.3, waveT + 0.5) * (0.85 + 0.15 * Math.sin(t * 2.2));
  const bx = 120 + 330 * arrive;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0d1c', overflow: 'hidden' }}>
      <Gate cam={cam} p={p} t={t} arm={arm}>
        <Live k={0.7} cam={cam}>
          <Motorbike x={bx} y={1575} s={1.25} t={t} wheelRot={bx * 1.6} lit={1} />
        </Live>
      </Gate>
      <span style={{ display: 'none' }}>{sec}</span>
    </AbsoluteFill>
  );
};

/** 6 — side tracking shot riding at night: white passenger on the back, cloth fluttering, lamps streaking past. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t * 1.6, 0.5);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx * 0.6, ty: h.hy * 0.8 };
  const bob = Math.sin(t * 13) * 2.5 + Math.sin(t * 5.3) * 2;
  const wrap = (x: number, period: number) => ((x % period) + period) % period;
  const sp = 900; // world px / s at k=1
  const tight = ramp(t, wordAt(6, /Tight/i, 0.85) - 0.2, wordAt(6, /Tight/i, 0.85) + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0d1c', overflow: 'hidden' }}>
      <BandImg id="road/sky" k={0} cam={{ ...cam, zoom: 1.05, oy: 900 }} />
      <Live cam={cam}>
        <RoadDefs />
        {/* far tree line drifting */}
        {[0, 1, 2].map((i) => {
          const x = wrap(i * 700 - t * sp * 0.12, 2100) - 400;
          return <path key={i} d={`M ${x},1240 C ${x + 60},1150 ${x + 140},1170 ${x + 200},1130 C ${x + 280},1090 ${x + 360},1150 ${x + 440},1160 C ${x + 520},1120 ${x + 600},1150 ${x + 700},1240 Z`} fill="#161b2c" />;
        })}
        <rect x={-200} y={1236} width={1700} height={1100} fill="#0b0d16" />
        {/* lamps + poles mid distance, streaking */}
        {[0, 1, 2].map((i) => {
          const x = wrap(i * 620 - t * sp * 0.55, 1860) - 300;
          return (
            <g key={i}>
              <rect x={x - 6} y={760} width={12} height={500} fill="#07080f" />
              <path d={`M ${x},770 C ${x + 10},740 ${x + 50},730 ${x + 90},734`} stroke="#07080f" strokeWidth={9} fill="none" />
              <ellipse cx={x + 90} cy={742} rx={260} ry={34} fill="url(#roadStreak)" />
              <ellipse cx={x + 90} cy={742} rx={150} ry={150} fill="url(#roadGlow)" opacity={0.7} />
              <ellipse cx={x + 90} cy={1300} rx={330} ry={46} fill="url(#roadPool)" opacity={0.8} />
            </g>
          );
        })}
        {/* road surface: edge line + dashes rushing */}
        <rect x={-200} y={1290} width={1700} height={6} fill="#1e2436" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = wrap(i * 320 - t * sp * 1.2, 1920) - 300;
          return <rect key={i} x={x} y={1640} width={200} height={10} fill="#2c3244" />;
        })}
        {/* rider + passenger */}
        <g transform={`translate(0 ${bob})`}>
          <Motorbike x={660} y={1520} s={1.8} passenger t={t * (1 + 0.4 * tight)} wheelRot={-t * 900} lit={1} />
        </g>
        </Live>
    </AbsoluteFill>
  );
};

/** 11 — dawn, the motorbike parked alone on the empty road; white threads on the seat. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.3 - 0.2 * e, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 1350 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#3a3046', overflow: 'hidden' }}>
      <BandImg id="road/dawn" k={0.25} cam={cam} />
      <BandImg id="road/mid" k={0.7} cam={cam} />
      <Live k={0.7} cam={cam}>
        <RoadDefs />
        <defs>
          <linearGradient id="dawnRoad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffc890" stopOpacity={0.4} />
            <stop offset="1" stopColor="#6a5a78" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <rect x={0} y={1478} width={1296} height={900} fill="url(#dawnRoad)" />
        <rect x={0} y={1180} width={1296} height={300} fill="#c98478" opacity={0.12} />
        <Motorbike x={600} y={1515} s={1.5} rider={false} lit={0} threads dawn t={t} />
      </Live>
      <BandImg id="road/fg" k={1.3} cam={cam} style={{ opacity: 0.85 }} />
    </AbsoluteFill>
  );
};

/** 12 — the gate again, darker; the figure stands a little closer. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.25 + 0.22 * e, dx: -40 * e, dy: 0, tx: h.hx, ty: h.hy, ox: 720, oy: 1200 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c', overflow: 'hidden' }}>
      <Gate cam={cam} p={p} t={t} pocS={1.1} pocY={GATE.ground + 28} pocX={760} dark={0.3} light={0.6} />
      <AbsoluteFill style={{ backgroundColor: '#03040a', opacity: 0.3 }} />
    </AbsoluteFill>
  );
};
