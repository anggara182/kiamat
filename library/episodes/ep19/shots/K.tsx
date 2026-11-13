import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { CX, CY, WIN, FLOOR } from '../sets/room';
import { Teen, Candle, Smoke, Doll, Paper, WallShadow } from '../art/room_k_people';

const BG = '#07080a';
const OX = CX - 108, OY = CY - 192; // circle centre in frame px
const STICK: [number, number] = [CX, CY - 92];

type SceneProps = {
  cam: Cam; t: number; p: number;
  teens?: boolean; laugh?: number; light?: number; join?: number;
  candleH?: number; lit?: number; doll?: 'hold' | 'fall' | 'none'; fall?: number; marks?: number;
};

const CANDLES: [number, number, number][] = [[CX, CY - 150, 1], [CX - 150, CY + 70, 2], [CX + 150, CY + 70, 3], [CX - 320, CY - 10, 4], [CX + 320, CY - 10, 5]];

/** The circle: back-row teens, candles, paper, doll, front-row teens (all in one live layer). */
const Circle: React.FC<SceneProps> = ({ cam, t, teens = true, laugh = 0, light = 1, join = 1, candleH = 64, lit = 1, doll = 'hold', fall = 0, marks = 1 }) => {
  const hand = (side: number, row: number): [number, number] => {
    const rest: [number, number] = [CX + side * (row ? 205 : 150), CY + (row ? 120 : -60)];
    const tgt: [number, number] = [STICK[0] + side * (row ? 12 : 9), CY + (row ? -46 : -128)];
    const j = doll === 'hold' ? join : 0;
    return [rest[0] + (tgt[0] - rest[0]) * j, rest[1] + (tgt[1] - rest[1]) * j];
  };
  const lb = (i: number) => laugh * Math.max(0, Math.sin(t * 9 + i * 1.7));
  return (
    <Live cam={cam}>
      <defs>
        <radialGradient id="kfloorglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb860" stopOpacity={0.5} />
          <stop offset="0.5" stopColor="#b8642a" stopOpacity={0.16} />
          <stop offset="1" stopColor="#b8642a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={CX} cy={CY} rx={560} ry={300} fill="url(#kfloorglow)" opacity={lit * light} />
      {teens && <>
        <Teen x={CX - 190} y={CY - 110} s={0.82} hand={hand(-1, 0)} laugh={lb(0)} light={light * lit} hair="long" tone="#5a3f2c" />
        <Teen x={CX + 190} y={CY - 110} s={0.82} hand={hand(1, 0)} laugh={lb(1)} light={light * lit} tone="#3f4a52" />
      </>}
      {CANDLES.slice(0, 1).map(([x, y, s]) => <Candle key={s} id={`k${s}`} x={x} y={y} h={candleH} lit={lit} t={t} seed={s} />)}
      <Paper x={CX} y={CY - 10} light={Math.max(lit * light, 0.25)} marks={marks} />
      {doll === 'hold' && <Doll x={CX} y={CY - 6} s={1.0} light={lit} />}
      {doll === 'fall' && <Doll x={CX + 30 * fall} y={CY - 6 + 10 * fall} s={1.0} rot={78 * fall} light={lit} />}
      {CANDLES.slice(1).map(([x, y, s]) => <Candle key={s} id={`k${s}`} x={x} y={y} h={candleH} lit={lit} t={t} seed={s} />)}
      {teens && <>
        <Teen x={CX - 260} y={CY + 190} s={1.12} back hand={hand(-1, 1)} laugh={lb(2)} light={light * lit} hair="long" />
        <Teen x={CX + 260} y={CY + 190} s={1.12} back hand={hand(1, 1)} laugh={lb(3)} light={light * lit} />
      </>}
    </Live>
  );
};

const Room: React.FC<SceneProps & { fgK?: number }> = (props) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <BandImg id="room/wall" k={0.85} cam={props.cam} />
    <Circle {...props} />
    <BandImg id="room/fg" k={1.25} cam={props.cam} />
  </AbsoluteFill>
);

/** 1: wide, four teens in a candle circle, slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.4);
  const cam: Cam = { zoom: 1.02 + 0.14 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr, ox: OX, oy: OY - 60 };
  return <Room cam={cam} t={t} p={p} join={1} />;
};

/** 4: medium, hands joining around the doll over the paper. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.5);
  const j = ramp(t, wordAt(4, /^Candles/, 0.4), wordAt(4, /^chant/, 0.7), EOUT);
  const cam: Cam = { zoom: 1.85 + 0.2 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy - 50, rot: h.hr, ox: OX, oy: OY - 120 };
  return <Room cam={cam} t={t} p={p} join={j} />;
};

/** 7: medium, the teens laughing, candles burned low, lateral track. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.4);
  const laugh = 1 - 0.6 * ramp(t, wordAt(7, /^lost/, 0.6), wordAt(7, /^time/, 0.85));
  const cam: Cam = { zoom: 1.38, dx: -70 + 140 * EIO(p), dy: 0, tx: h.hx, ty: h.hy + 20, rot: h.hr, ox: OX, oy: OY - 80 };
  return <Room cam={cam} t={t} p={p} join={0.35} laugh={laugh} candleH={24} doll="hold" />;
};

/** 10: wide, locked. Doll drops, candles go out, a shadow on the wall that matches no one. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const fall = ramp(t, wordAt(10, /^dropped/, 0.05), wordAt(10, /^doll/, 0.18), EOUT);
  const outT = wordAt(10, /^out/, 0.5);
  const lit = 1 - ramp(t, outT - 0.15, outT + 0.1);
  const dark = 1 - lit;
  const shT = wordAt(10, /^laughed/, 0.7);
  const sh = ramp(t, shT - 0.6, shT + 0.8, EOUT);
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, ox: OX, oy: OY - 60 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="room/wall" k={0.85} cam={cam} />
      <Circle cam={cam} t={t} p={p} doll="fall" fall={fall} lit={lit} light={1} join={0.3} candleH={20} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="kmoonwall" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fb2cc" stopOpacity={0.3} />
            <stop offset="1" stopColor="#9fb2cc" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="kmoonshaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fb2cc" stopOpacity={0.22} />
            <stop offset="1" stopColor="#9fb2cc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1296} height={2304} fill={BG} opacity={0.8 * dark} />
        <g opacity={dark}>
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#9fb2cc" opacity={0.28} />
          <circle cx={WIN.x + 200} cy={WIN.y + 110} r={38} fill="#dfe7f0" opacity={0.9} />
          <path d={`M${WIN.x} ${WIN.y + WIN.h} L${WIN.x + WIN.w} ${WIN.y + WIN.h} L${WIN.x + 120} ${CY + 260} L${WIN.x - 380} ${CY + 200} Z`} fill="url(#kmoonshaft)" />
          <ellipse cx={420} cy={720} rx={360} ry={460} fill="url(#kmoonwall)" />
          {/* teens as moonlit silhouettes: thin cool rims on the shoulders */}
          <path d={`M${CX - 380} ${CY - 20} Q${CX - 290} ${CY - 60} ${CX - 200} ${CY - 10}`} stroke="#9fb2cc" strokeWidth={4} fill="none" opacity={0.5} />
          <path d={`M${CX + 200} ${CY - 10} Q${CX + 290} ${CY - 60} ${CX + 380} ${CY - 20}`} stroke="#9fb2cc" strokeWidth={4} fill="none" opacity={0.5} />
          {CANDLES.map(([x, y, s], i) => <Smoke key={s} x={x} y={y - 30} a={clamp01(dark * 1.4 - sh * 0.3)} k={p + i * 0.2} seed={i} />)}
        </g>
        <WallShadow x={430} y={FLOOR - 10 + 40 * (1 - sh)} s={0.9 + 0.15 * sh} o={0.85 * sh} arm={sh} />
      </Live>
      <BandImg id="room/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** 11: wide, grey dawn, burnt-out candles, the doll gone; slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.32 - 0.26 * EIO(p), dx: 0, dy: 0, ox: OX, oy: OY - 40 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="room/wall" k={0.85} cam={cam} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="kdawnshaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8dee4" stopOpacity={0.35} />
            <stop offset="1" stopColor="#c8d0d8" stopOpacity={0.05} />
          </linearGradient>
          <radialGradient id="kdawnpool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#c9d2da" stopOpacity={0.45} />
            <stop offset="1" stopColor="#c9d2da" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1296} height={2304} fill="#6f7c8c" opacity={0.28} />
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#dfe3e4" opacity={0.75} />
        <rect x={WIN.x + WIN.w / 2 - 6} y={WIN.y} width={12} height={WIN.h} fill="#2a2a2c" />
        <rect x={WIN.x} y={WIN.y + WIN.h * 0.45} width={WIN.w} height={12} fill="#2a2a2c" />
        <path d={`M${WIN.x} ${WIN.y + WIN.h} L${WIN.x + WIN.w} ${WIN.y + WIN.h} L${CX + 240} ${CY + 120} L${CX - 260} ${CY + 80} Z`} fill="url(#kdawnshaft)" />
        <ellipse cx={CX} cy={CY} rx={380} ry={180} fill="url(#kdawnpool)" />
      </Live>
      <Circle cam={cam} t={t} p={p} teens={false} doll="none" lit={0} light={0.3} candleH={10} marks={1} />
      <Live cam={cam}>
        {/* faint mark where the doll stood */}
        <ellipse cx={CX} cy={CY - 8} rx={26} ry={8} fill="#5a4a38" opacity={0.35} />
        <path d={`M${CX - 4} ${CY - 6} l-30 30`} stroke="#3a2f24" strokeWidth={3} opacity={0.5} />
      </Live>
      <BandImg id="room/fg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};
