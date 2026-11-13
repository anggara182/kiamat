import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { HUT } from '../sets/barrio';

const { x: HX, eave: EV, floor: FL } = HUT;

const Glow: React.FC<{ cx: number; cy: number; r: number; c: string; o: number; id: string }> = ({ cx, cy, r, c, o, id }) => (
  <g>
    <defs><radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </g>
);

/** Lamp-lit window + door of the hero hut. */
const Lamps: React.FC<{ t: number; on: number }> = ({ t, on }) => {
  const fl = 0.85 + 0.1 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1);
  return (
    <g opacity={on}>
      <rect x={HX - 165} y={EV + 65} width={100} height={90} fill="#ffbf6b" opacity={0.85 * fl} />
      <path d={`M ${HX - 115} ${EV + 65} L ${HX - 115} ${EV + 155} M ${HX - 165} ${EV + 110} L ${HX - 65} ${EV + 110}`} stroke="#3b2a14" strokeWidth={6} />
      <rect x={HX + 45} y={EV + 50} width={90} height={FL - EV - 55} fill="#e89a48" opacity={0.6 * fl} />
      <Glow id="bLw" cx={HX - 115} cy={EV + 110} r={190 * fl} c="#ffbf6b" o={0.35} />
      <Glow id="bLd" cx={HX + 90} cy={EV + 140} r={170 * fl} c="#ffbf6b" o={0.25} />
    </g>
  );
};

/** Huge black bird silhouette perched (fold 0..1: 0 = wings spread, 1 = folded). */
const Bird: React.FC<{ x: number; y: number; s: number; fold: number }> = ({ x, y, s, fold }) => {
  const span = 380 - 190 * fold, lift = 140 - 120 * fold;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#030304">
      {/* wings */}
      <path d={`M -20 -120 Q ${-span * 0.6} ${-130 - lift} ${-span} ${-60 - lift} Q ${-span * 0.7} ${-70 - lift * 0.4} ${-span * 0.75} ${-20 - lift * 0.3} Q ${-span * 0.45} ${-40} -30 -40 Z`} />
      <path d={`M 20 -120 Q ${span * 0.6} ${-130 - lift} ${span} ${-60 - lift} Q ${span * 0.7} ${-70 - lift * 0.4} ${span * 0.75} ${-20 - lift * 0.3} Q ${span * 0.45} ${-40} 30 -40 Z`} />
      {/* body hunched */}
      <path d="M -50 0 Q -80 -100 -36 -170 Q 0 -196 30 -172 Q 70 -110 50 0 Q 0 14 -50 0 Z" />
      {/* head + beak */}
      <ellipse cx={4} cy={-198} rx={30} ry={26} />
      <path d="M -26 -205 L -60 -228 L -22 -190 Z" />
      <path d="M 26 -206 Q 70 -200 84 -178 Q 60 -190 28 -186 Z" />
      {/* tail + talons */}
      <path d="M -40 -10 L -90 60 L 10 0 Z" />
      <path d="M -30 0 L -36 26 M -20 0 L -16 26 M 20 0 L 16 26 M 30 0 L 38 26" stroke="#030304" strokeWidth={7} />
      {/* faint moon rim + eye */}
      <path d="M -40 -175 Q 0 -205 40 -175" stroke="#8d97b8" strokeWidth={4} fill="none" opacity={0.6} />
      <circle cx={14} cy={-204} r={5} fill="#b98cff" opacity={0.8} />
    </g>
  );
};

/** shot 1 — wide barrio at night, slow push-in toward the lamp-lit hut. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const { hx, hy } = handheld(t, 0.4);
  const z = 1 + 0.18 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hx, ty: hy, oy: 1250 - 192 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a16' }}>
      <BandImg id="barrio/sky" k={0.3} cam={cam} />
      <BandImg id="barrio/hut" k={1} cam={cam} />
      <Live k={0.3} cam={cam}>
        <rect x={1050} y={1340} width={34} height={30} fill="#ffbf6b" opacity={0.25 + 0.5 * ramp(p, 0.35, 0.5)} />
        <Glow id="bNb" cx={1067} cy={1355} r={70} c="#ffbf6b" o={0.25 * ramp(p, 0.35, 0.5)} />
      </Live>
      <Live k={1} cam={cam}><Lamps t={t} on={1} /></Live>
      <BandImg id="barrio/fg" k={1.5} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 8 — the hut in moonlight; tilt up, a huge black bird lands on the thatch. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const land = wordAt(8, /^landed/i, 0.3) / sec;
  const { hx, hy } = handheld(t, 0.5);
  const tilt = 170 * EIO(p);
  const cam: Cam = { zoom: 1.15, dx: 0, dy: -60 + tilt * 0.4, tx: hx, ty: -120 + tilt + hy, oy: 1010 - 192 };
  const a = ramp(p, land - 0.12, land + 0.06);
  const fold = 0.7 * ramp(p, land + 0.02, land + 0.25);
  const bx = HX + 300 * (1 - a), by = HUT.peak + 10 - 300 * (1 - a);
  const settle = a >= 1 ? Math.sin(Math.max(0, p - land - 0.06) * 40) * 6 * (1 - fold) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#070a16' }}>
      <BandImg id="barrio/sky" k={0.3} cam={cam} />
      <BandImg id="barrio/hut" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Lamps t={t} on={1 - 0.6 * fold} />
        <Bird x={bx} y={by + settle} s={1.3} fold={fold} />
      </Live>
      <BandImg id="barrio/fg" k={1.5} cam={cam} />
    </AbsoluteFill>
  );
};

const FEATHERS = [
  [20, 2, -8, 1], [110, 40, 12, 0.9], [50, 80, -4, 1.1], [150, 118, 170, 0.8], [-60, 160, 20, 0.9], [230, 172, -10, 0.8],
];
const Feather: React.FC<{ x: number; y: number; r: number; s: number }> = ({ x, y, r, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -50 0 Q -10 -20 50 -4 Q 0 14 -50 0 Z" fill="#060608" />
    <path d="M 50 -4 L 64 -6" stroke="#060608" strokeWidth={3} />
    <path d="M -40 1 L 36 -1" stroke="#3a3a44" strokeWidth={2} />
  </g>
);

/** shot 11 — neighbor's hut at grey dawn, empty; black feathers on the steps. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const { hx, hy } = handheld(t, 0.3);
  const z = 1.35 - 0.3 * EIO(p);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, tx: hx, ty: hy - 200, ox: HX + 100 - 108, oy: FL + 60 - 192 };
  const drift = Math.sin(t * 1.4) * 2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#1e1d1c' }}>
      <BandImg id="barrio/dawn" k={0.3} cam={cam} />
      <BandImg id="barrio/hut" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Glow id="bMist" cx={HX} cy={1600} r={700} c="#c9c6c0" o={0.45} />
        {FEATHERS.map(([fx, fy, r, s], i) => <Feather key={i} x={HX + 40 + fx} y={FL + 6 + fy} r={r + (i === 2 ? drift * 4 : 0)} s={s * 1.15} />)}
      </Live>
      <BandImg id="barrio/fg" k={1.5} cam={cam} style={{ opacity: 0.85 }} />
    </AbsoluteFill>
  );
};
