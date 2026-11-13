import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01, handheld } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { RumourFigure, RUMOUR, Circling, Bird } from '../art/kampung_tower';
import { RUMOUR_TOWER, GATE, INSIDE, DUSK_TOWER, DUSK_ROWS, DUSK, HORNS, HornPole } from '../art/kampung_mosque';
import { SideMan, Onlooker, DoorHead, ManLook } from '../art/kampung_people';

const T = RUMOUR_TOWER;
/** crude red marker stroke that draws itself (pathLength trick); prog 0..1 */
const Marker: React.FC<{ d: string; prog: number; w?: number }> = ({ d, prog, w = 10 }) =>
  prog <= 0 ? null : <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(prog)} stroke={RUMOUR.red} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.92} />;

/** shot 5 — RUMOUR IMAGE: the water tower, flat and cold and too symmetric; a tall faceless figure fades in at its foot on "stranger". Slow push-in. */
export const S05: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ts = wordAt(5, /^stranger/i, 0.25);
  const cam: Cam = { zoom: 1.02 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 1050 };
  const a = ramp(t2, ts, ts + 0.6);
  const grow = 1 + 0.015 * Math.sin(t2 * 1.6);
  return (
    <AbsoluteFill style={{ backgroundColor: RUMOUR.sky }}>
      <BandImg id="kampung/rumour" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <ellipse cx={T.cx} cy={T.gy + 10} rx={330} ry={46} fill={RUMOUR.pale} opacity={0.06 + 0.04 * Math.sin(t * 3)} />
        <polygon points={`${T.cx - 60},${T.gy - 650} ${T.cx + 60},${T.gy - 650} ${T.cx + 300},${T.gy} ${T.cx - 300},${T.gy}`} fill={RUMOUR.pale} opacity={0.22} />
        <g opacity={a} transform={`translate(${T.cx} ${T.gy}) scale(1 ${grow}) translate(${-T.cx} ${-T.gy})`}>
          <RumourFigure x={T.cx} y={T.gy} h={560} fill={RUMOUR.sil} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — RUMOUR IMAGE again: the figure becomes THREE exactly on "three"; red marker circles the tank on "Poison" and crude arrows of a "plan" draw on "plan". */
export const S12: React.FC = () => {
  const { p, t, t2 } = useShot();
  const t3 = wordAt(12, /^three/i, 0.38), tpo = wordAt(12, /^Poison/i, 0.54), tpl = wordAt(12, /^plan/i, 0.8);
  const cam: Cam = { zoom: 1.06 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 1000 };
  const three = t2 >= t3;
  const grow = 1 + 0.015 * Math.sin(t2 * 1.6);
  const xs = three ? [T.cx - 230, T.cx, T.cx + 230] : [T.cx];
  const pump = 0.06 + 0.04 * Math.sin(t * 3);
  const tankY = T.gy - 650 - 160;
  return (
    <AbsoluteFill style={{ backgroundColor: RUMOUR.sky }}>
      <BandImg id="kampung/rumour" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <ellipse cx={T.cx} cy={T.gy + 10} rx={330} ry={46} fill={RUMOUR.pale} opacity={pump} />
        <polygon points={`${T.cx - 60},${T.gy - 650} ${T.cx + 60},${T.gy - 650} ${T.cx + 420},${T.gy} ${T.cx - 420},${T.gy}`} fill={RUMOUR.pale} opacity={0.22} />
        {xs.map((x) => (
          <g key={x} transform={`translate(${x} ${T.gy}) scale(1 ${grow}) translate(${-x} ${-T.gy})`}>
            <RumourFigure x={x} y={T.gy} h={560} fill={RUMOUR.sil} />
          </g>
        ))}
        {/* the "plan": crude marker drawing */}
        <Marker d={`M${T.cx + 200} ${tankY - 150} C${T.cx + 330} ${tankY - 20} ${T.cx + 210} ${tankY + 190} ${T.cx - 20} ${tankY + 185} C${T.cx - 260} ${tankY + 175} ${T.cx - 250} ${tankY - 120} ${T.cx - 40} ${tankY - 175} C${T.cx + 80} ${tankY - 200} ${T.cx + 180} ${tankY - 170} ${T.cx + 225} ${tankY - 120}`} prog={ramp(t, tpo, tpo + 0.35, (n) => n)} />
        <Marker d={`M${T.cx - 230} ${T.gy - 600} Q${T.cx - 300} ${T.gy - 800} ${T.cx - 175} ${tankY + 120} M${T.cx - 175} ${tankY + 120} l-14 52 M${T.cx - 175} ${tankY + 120} l-50 22`} prog={ramp(t, tpl, tpl + 0.22, (n) => n)} />
        <Marker d={`M${T.cx + 230} ${T.gy - 600} Q${T.cx + 300} ${T.gy - 800} ${T.cx + 175} ${tankY + 120} M${T.cx + 175} ${tankY + 120} l14 52 M${T.cx + 175} ${tankY + 120} l50 22`} prog={ramp(t, tpl + 0.05, tpl + 0.27, (n) => n)} />
        <Marker d={`M${T.cx - 40} ${T.gy - 160} l80 80 M${T.cx + 40} ${T.gy - 160} l-80 80`} prog={ramp(t, tpl + 0.1, tpl + 0.3, (n) => n)} w={12} />
        <Marker d={`M${T.cx} ${T.gy - 640} L${T.cx} ${T.gy - 200}`} prog={ramp(t, tpl + 0.12, tpl + 0.3, (n) => n)} w={6} />
      </Live>
    </AbsoluteFill>
  );
};

const OLD_A: ManLook = { skin: '#9a6a52', skinD: '#6e4a3a', shirt: '#7a5a40', shirtD: '#5a412e', sarong: '#3e4656', sarongD: '#2c3240', peci: '#141214', beard: '#d8d4cc' };
const OLD_B: ManLook = { skin: '#a8765c', skinD: '#7a5040', shirt: '#b8c2a8', shirtD: '#8e9a80', sarong: '#4a5a3e', sarongD: '#34402c', peci: '#141214', beard: '#e2ded6' };

/** shot 10 — day: two old men arguing at the mosque gate; the right one jabs his finger on "argued", the left one leans back on his stick; onlookers. */
export const S10: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ta = wordAt(10, /^argued/i, 0.22);
  const cam: Cam = { zoom: 1.14 + 0.07 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 40, ox: 600, oy: 1250 };
  const u = 620 / 7;
  // B (right, facing left): pulls the hand back (anticipation) then jabs on "argued", then small repeated jabs
  const back = ramp(t2, ta - 0.35, ta - 0.08);
  const jab = ramp(t2, ta - 0.08, ta + 0.02);
  const rep = t2 > ta + 0.3 ? Math.max(0, Math.sin((t2 - ta - 0.3) * 9)) * 0.35 : 0;
  const reach = clamp01(jab - rep) * (1 - 0) + (1 - jab) * (0.25 - 0.2 * back);
  const bx = 845, gy = GATE.gy - 5;
  const bShX = bx - 0.12 * u;
  const bHand: [number, number] = [bShX - u * (0.5 + 1.7 * reach) + back * u * 0.35, gy - 620 * 0.8 + u * (0.9 - 0.7 * reach)];
  const ax = 455;
  const aLean = -0.25 * jab + 0.05 * Math.sin(t2 * 2);
  const aHand: [number, number] = [ax + u * (0.9 + 0.4 * Math.sin(t2 * 6)), gy - 620 * 0.8 + u * (0.6 + 0.2 * Math.sin(t2 * 6))];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9eef0' }}>
      <BandImg id="kampung/gate" k={0.9} cam={cam} />
      <Live k={1} cam={cam}>
        {[[ax, 1], [bx, -1]].map(([x, d]) => <ellipse key={x} cx={x + d * 20 + 50} cy={gy + 6} rx={110} ry={14} fill="#2a2018" opacity={0.3} />)}
        <Onlooker x={235} y={gy - 10} h={470} body="#5a4a5e" head="#9a6a52" scarf="#8a5a62" sh={t2 * 1.7} armsCrossed turn={1} />
        <Onlooker x={1075} y={gy - 12} h={500} body="#3e5266" head="#a8765c" sh={t2 * 1.4 + 1} turn={-1} />
        <Onlooker x={960} y={gy - 70} h={380} body="#7a6a4e" head="#8a5e48" peci sh={t2 * 1.2 + 2} turn={-1} />
        <SideMan x={ax} y={gy} h={620} dir={1} look={OLD_A} stoop={0.9} stick lean={aLean} hand={aHand} mouth={Math.abs(Math.sin(t2 * 7)) * (t2 > ta + 0.4 ? 1 : 0.3)} headTilt={6 * jab} br={t2 * 2.2} />
        <SideMan x={bx} y={gy} h={620} dir={-1} look={OLD_B} stoop={0.5} lean={0.18 * jab} hand={bHand} finger mouth={Math.abs(Math.sin(t2 * 8)) * (t2 > ta - 0.1 ? 1 : 0.2)} br={t2 * 2.4} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 18 — day, low angle: the mosque loudspeaker horns on their pole against the white sky; a tiny jolt on "crackled", a bird lifts off. */
export const S18: React.FC = () => {
  const { p, t } = useShot();
  const tc = wordAt(18, /^crackled/i, 0.6);
  const dt = t - tc;
  const shake = dt > 0 ? Math.exp(-dt * 12) * Math.sin(dt * 70) : 0;
  const hh = handheld(t, 0.4);
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, tx: hh.hx, ty: 40 * (1 - ramp(p, 0, 1, EIO)) + hh.hy, rot: -2 + 1.5 * ramp(p, 0, 1, EIO), ox: 540, oy: 700 };
  const lift = dt - 0.06;
  const bx = HORNS.x + 6 + (lift > 0 ? 120 * lift + 160 * lift * lift : 0), by = HORNS.y - 22 - (lift > 0 ? 160 * lift + 120 * lift * lift : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9eef0' }}>
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="hpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9cfdc" /><stop offset="0.55" stopColor="#e3eaee" /><stop offset="1" stopColor="#f3f1ea" /></linearGradient>
          <radialGradient id="hpSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" /><stop offset="0.25" stopColor="#fffdf2" stopOpacity={0.8} /><stop offset="1" stopColor="#fffdf2" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-300} y={-300} width={1900} height={2900} fill="url(#hpSky)" />
        <circle cx={300} cy={420} r={330} fill="url(#hpSun)" />
        <circle cx={300} cy={420} r={46} fill="#fffef8" />
        {[[900, 380, 340], [260, 900, 260]].map(([x, y, w], i) => <ellipse key={i} cx={x + t * 6} cy={y} rx={w / 2} ry={10} fill="#ffffff" opacity={0.6} />)}
        {/* dome edge bottom-left (green-grey), with a finial */}
        <circle cx={120} cy={2420} r={620} fill="#93a698" />
        <path d="M-500 2420 A620 620 0 0 1 60 1803 Q-180 1980 -220 2420 Z" fill="#b5c4b8" />
        <rect x={117} y={1700} width={6} height={110} fill="#6a6a5a" />
        <HornPole shake={shake} />
        <Bird x={bx} y={by} s={1.6} fly={lift > 0 ? 1 : 0} flap={t * 15} fill="#2a2d30" dir={-1} />
        <Bird x={1080 - t * 90} y={560 + Math.sin(t * 2) * 10} s={0.9} fly={1} flap={t * 12} fill="#3a3e42" />
      </Live>
    </AbsoluteFill>
  );
};

const MARBOT: ManLook = { skin: '#9e6e56', skinD: '#714c3c', shirt: '#e9e6dc', shirtD: '#b9b4a6', sarong: '#4a3a52', sarongD: '#352a3c', peci: '#f2f0ea', glasses: true };

/** shot 19 — inside the mosque: the marbot reads a stamped paper into the microphone; he lifts the paper on "tested"; through the door the crowd looks up on "clean". Slow push-in. */
export const S19: React.FC = () => {
  const { p, t2 } = useShot();
  const tt = wordAt(19, /^tested/i, 0.3), tc = wordAt(19, /^clean/i, 0.52);
  const cam: Cam = { zoom: 1.14 + 0.07 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 60, ox: 600, oy: 1200 };
  const lift = 0.15 + 0.85 * ramp(t2, tt - 0.25, tt + 0.1) - 0.3 * ramp(t2, tt + 1.4, tt + 2.0);
  const up = ramp(t2, tc - 0.05, tc + 0.3);
  const D = INSIDE.door;
  const heads: [number, number, 'hijab' | 'peci' | 'hair', string][] = [[D.x + 40, 1240, 'peci', '#3a3430'], [D.x + 100, 1262, 'hijab', '#4a3a46'], [D.x + 165, 1232, 'hair', '#2e3238'], [D.x + 222, 1258, 'hijab', '#3a4250'], [D.x + 284, 1236, 'peci', '#3e3a30'], [D.x + 130, 1300, 'hair', '#33302c'], [D.x + 250, 1305, 'hijab', '#5a4048']];
  const mx = 420, my = INSIDE.floor;
  return (
    <AbsoluteFill style={{ backgroundColor: '#d6cfbd' }}>
      <BandImg id="kampung/inside" k={0.92} cam={cam} />
      <Live k={0.92} cam={cam}>
        {heads.map(([x, y, k, c], i) => <DoorHead key={i} x={x + Math.sin(t2 * 1.3 + i) * 3} y={y} s={0.78} kind={k} col={c} up={clamp01(up * 1.2 - i * 0.04)} />)}
      </Live>
      <Live k={1} cam={cam}>
        <ellipse cx={mx + 40} cy={my + 4} rx={140} ry={16} fill="#3a1a18" opacity={0.35} />
        {/* microphone stand with gooseneck */}
        <g><ellipse cx={INSIDE.mic.x} cy={my - 4} rx={46} ry={10} fill="#2a2a2c" /><rect x={INSIDE.mic.x - 5} y={1160} width={10} height={my - 1160} fill="#3a3a3e" />
          <path d={`M${INSIDE.mic.x} 1162 Q${INSIDE.mic.x - 10} 1080 ${INSIDE.mic.x - 70} 1068`} stroke="#3a3a3e" strokeWidth={8} fill="none" />
          <rect x={INSIDE.mic.x - 104} y={1056} width={40} height={22} rx={10} fill="#1d1d20" transform={`rotate(-12 ${INSIDE.mic.x - 84} 1067)`} /></g>
        <SideMan x={mx} y={my} h={640} dir={1} look={MARBOT} stoop={0.25} paper={{ lift }} mouth={Math.abs(Math.sin(t2 * 9)) * 0.9} headTilt={-4 + 6 * lift} br={t2 * 2} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 22 — dusk, the REAL water tower: warm, birds circling, kitchen windows in the kampung below. Upper frame kept calm for the quote. Very slow push-in. */
export const S22: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.03 + 0.05 * ramp(p, 0, 1, EIO), dx: -10 * p, dy: 0, ox: 700, oy: 1300 };
  const tankY = DUSK_TOWER.gy - 650 * DUSK_TOWER.s - 120;
  return (
    <AbsoluteFill style={{ backgroundColor: DUSK.mid }}>
      <BandImg id="kampung/dusk" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <defs><radialGradient id="dkWin" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={DUSK.win} stopOpacity={0.5} /><stop offset="1" stopColor={DUSK.win} stopOpacity={0} /></radialGradient></defs>
        {DUSK_ROWS.flatMap((r) => r.wins).map((w, i) => {
          const a = w.o < 0.45 ? 1 : w.o < 0.6 ? clamp01((t - (w.o - 0.45) * 12) / 0.1) : 0;
          return a > 0.01 ? <g key={i} opacity={a}><ellipse cx={w.x + w.w / 2} cy={w.y + w.h / 2} rx={w.w * 2.4} ry={w.h * 1.8} fill="url(#dkWin)" /><rect x={w.x} y={w.y} width={w.w} height={w.h} fill={DUSK.win} /></g> : null;
        })}
        {/* kitchen smoke rising from one roof */}
        {[0, 1, 2, 3].map((i) => { const k = ((t * 0.35 + i * 0.25) % 1); return <ellipse key={i} cx={420 + k * 40 + Math.sin(k * 6) * 10} cy={1610 - k * 260} rx={18 + k * 40} ry={12 + k * 22} fill="#c9a0a0" opacity={0.18 * (1 - k)} />; })}
        <Circling t={t} cx={DUSK_TOWER.cx} cy={tankY + 20} rx={260} ry={70} n={6} s={1.1} fill="#1d1428" />
      </Live>
    </AbsoluteFill>
  );
};
