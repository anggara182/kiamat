import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, handheld, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { pj, D, Laundry, Dust, Cat, WALL, PipeRun, Drips, Tools, Stone, Birds, PAL } from '../art/alley_art';
import { J, JointPipe, WrenchHand, SteadyHand, Flies, TopHand, G20, BaseBg, HangHand, Puff } from '../art/alley_close';
import { Figure, walkPose, kneelPose, BackWalker, RingFigure, handA, ikArmA, Pose, Look } from '../art/alley_people';

/* EP02 alley, harsh noon. Clocks: camera + environment (laundry, dust, water, birds, flies, puff) ON ONES (p/t);
 * people and the cat ON TWOS (p2/t2). Sync words land exactly on the word starts. */

const YOUNG: Look = { body: '#4f5f70', far: '#3a4756', skin: '#a8765a', rim: '#fff8ea', rimO: 0.6, bag: null };
const YOUNG_LEGS = '#6a6046';

/** crowd members (simplified): trousers/sarong colour, shirt, hat */
const CROWD = [
  { col: '#2f3237', shirt: '#6a3a32', hat: 'peci' as const }, { col: '#3a3a40', shirt: '#d8d4c8', hat: null }, { col: '#2a2a2e', shirt: '#3a4a5a', hat: 'cap' as const },
  { col: '#4a3a52', shirt: '#4a3a52', hat: 'hijab' as const, sarong: true }, { col: '#3d3428', shirt: '#8a7a5a', hat: null }, { col: '#2e3a30', shirt: '#2e3a30', hat: 'peci' as const, sarong: true },
  { col: '#33302c', shirt: '#5a3f2e', hat: null }, { col: '#2c2c34', shirt: '#7a8a8e', hat: 'cap' as const }, { col: '#3a2e2a', shirt: '#9a4a3a', hat: null },
  { col: '#2a2e36', shirt: '#4a5a4a', hat: 'peci' as const }, { col: '#4a4058', shirt: '#6a5a7a', hat: 'hijab' as const, sarong: true },
];

/** shot 13 — wide from behind: the crowd turns into the alley; the leader points down it on "found". Slow push. */
export const S13: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tF = wordAt(13, /^found/i, 0.47);
  const cam: Cam = { zoom: 1 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 900 };
  // walkers: [X, Z0, speed, turning-in from the street?]
  const W0: [number, number, number, boolean][] = [[-0.55, 4.4, 1.2, false], [0.15, 3.6, 1.25, false], [-0.2, 6.6, 1.1, false], [0.75, 6.1, 1.15, false], [-0.75, 8.2, 1.0, false],
    [0.3, 2.6, 1.3, false], [-0.4, 2.2, 1.35, true], [0.6, 1.9, 1.3, true], [0.05, 9.5, 1.0, false], [-0.85, 3.1, 1.2, false]];
  const people = W0.map(([X, z0, v, turn], i) => {
    let Xn = X, Zn = z0 + v * t2;
    if (turn) { const k = clamp01(t2 / 1.2); Xn = X + (1 - EOUT(k)) * 2.6; Zn = z0 + 0.4 * v * t2; }
    return { i, X: Xn, Z: Zn, ph: t2 * 7.5 + i * 1.7 };
  });
  // the leader: walking at the front, stops on "found" and points down the alley
  const lz = 3.9 + 1.0 * Math.min(t2, tF), lpoint = ramp(t2, tF - 0.25, tF + 0.08, EOUT);
  const all = [...people.map((q) => ({ ...q, leader: false })), { i: 99, X: 0.5, Z: lz, ph: t2 < tF ? t2 * 7.5 : tF * 7.5, leader: true }].sort((a, b) => b.Z - a.Z);
  const catK = ramp(t2, tF - 0.5, tF + 0.6, EIO);
  const [cx, cy] = pj(-0.9 + 2.0 * catK, 0, 12);
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.sky }}>
      <BandImg id="alley/deep" cam={cam} />
      <Live cam={cam}>
        <Laundry t={t} zs={[7, 12, 19]} />
        <Cat x={cx} y={cy} s={0.6} t2={t2} pose={catK > 0 && catK < 1 ? 'run' : 'sit'} dir={1} />
        {all.map((q) => {
          const [x, y] = pj(q.X, 0, q.Z), h = (1.65 * D.f) / q.Z;
          const c = CROWD[q.i % CROWD.length];
          return (
            <g key={q.i}>
              <ellipse cx={x + h * 0.05} cy={y + 2} rx={h * 0.14} ry={h * 0.025} fill={PAL.dark} opacity={0.35} />
              {q.leader
                ? <g transform={`translate(${x} 0) scale(-1 1) translate(${-x} 0)`}><BackWalker x={x} y={y} h={h * 1.04} ph={q.ph} col="#2a2a2e" shirt="#7a2f2a" hat="cap" point={lpoint} /></g>
                : <BackWalker x={x} y={y} h={h * (0.94 + (q.i % 3) * 0.04)} ph={q.ph} col={c.col} shirt={c.shirt} hat={c.hat} sarong={'sarong' in c ? c.sarong : false} />}
            </g>
          );
        })}
        <Dust t={t} x0={200} y0={700} w={900} h={900} n={26} o={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 14 — the young newcomer kneels at the leaking pipe, wrench in hand; he looks up on "man". Slight push. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tM = wordAt(14, /^man/i, 0.17);
  const cam: Cam = { zoom: 1.12 + 0.05 * ramp(p, 0, 1, EIO), dx: 40, dy: -40, ox: 520, oy: 1100 };
  const up = ramp(t2, tM - 0.08, tM + 0.25, EOUT);
  const x = 668, y = WALL.ground, h = 520;
  const work = Math.sin(t2 * 7) * (1 - up);
  const base: Pose = { ...kneelPose(24 - 16 * up, 14 - 40 * up, 0.5 * Math.sin(t2 * 3.4)) };
  const armA = ikArmA(x, y, h, -1, base, WALL.jointX + 24 + 6 * work, WALL.jointY + 6 + 4 * work);
  const armB = ikArmA(x, y, h, -1, base, WALL.jointX - 70, WALL.jointY - 4, 1);
  const pose: Pose = { ...base, ...armA, uaB: armB.uaA, faB: armB.faA };
  const [hx, hy] = handA(x, y, h, -1, pose);
  const drips = [0.1, 0.55, 1.0, 1.45, 1.9, 2.35, 2.8].map((d) => d);
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.lit }}>
      <BandImg id="alley/wall" cam={cam} />
      <Live cam={cam}>
        <Cat x={1110} y={1082} s={1.3} t2={t2} />
        <PipeRun />
        <Drips t={t} times={drips} x={WALL.jointX + 4} y0={WALL.jointY + 18} y1={WALL.ground + 52} s={1.4} />
        <Tools x={880} y={WALL.ground + 70} s={1.7} />
        <ellipse cx={x + 80} cy={y + 30} rx={170} ry={20} fill={PAL.dark} opacity={0.3} />
        {/* wrench in his hand, jaw on the elbow */}
        <path d={`M ${hx} ${hy} L ${WALL.jointX + 10} ${WALL.jointY - 6}`} stroke="#7d838a" strokeWidth={9} strokeLinecap="round" />
        <circle cx={WALL.jointX + 8} cy={WALL.jointY - 8} r={11} fill="#7d838a" />
        <Figure x={x} y={y} h={h} dir={-1} pose={pose} look={{ ...YOUNG, far: YOUNG_LEGS }} />
        <Dust t={t} x0={300} y0={500} w={900} h={900} n={22} o={0.55} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 15 — close on his hands tightening the joint; the drip slows; the last drop falls on "free". */
export const S15: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tF = wordAt(15, /^free/i, 0.78);
  // band: the wall around the joint, magnified (soft), aligned so its ground meets the live ground
  const zb = 2.4, jfx = WALL.jointX - 108, jfy = WALL.jointY - 192;
  const camB: Cam = { zoom: zb + 0.06 * p, dx: 150, dy: (G20 - 192) - (jfy + (WALL.ground - 192 - jfy) * zb), ox: jfx, oy: jfy };
  const cam: Cam = { zoom: 0.92 + 0.04 * ramp(p, 0, 1, EIO), dx: -70, dy: 0, ox: 560, oy: 900 };
  // ratchet strokes on twos: push the handle down, re-grip, ... final firm push on "free"
  const stroke = 0.62, n = Math.max(1, Math.floor((tF - 0.1) / stroke));
  const st = t2 < tF ? ((t2 % stroke) / stroke) : 1;
  const ang = t2 < tF ? (st < 0.75 ? 16 * EIO(st / 0.75) : 16 * (1 - (st - 0.75) / 0.25)) : 8 + 6 * ramp(t2, tF, tF + 0.2, EOUT);
  const squeeze = t2 < tF ? (st < 0.75 ? 1 : 0) : 1;
  void n;
  const times = [0.1, 0.6, 1.2, 1.85].filter((d) => d < tF - 0.4).concat([tF]);
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.lit }}>
      <BandImg id="alley/wall" cam={camB} />
      <Live cam={cam}>
        <JointPipe />
        <Drips t={t} times={times} x={J.cx - 40} y0={J.cy + 122} y1={J.ground + 24} s={3} />
        <SteadyHand grip={squeeze} />
        <WrenchHand ang={ang - 6} squeeze={squeeze} />
        <Flies t={t} x={J.cx - 120} y={J.ground} />
        <Dust t={t} x0={150} y0={300} w={1000} h={900} n={18} o={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 16 — low angle from his eye level: the crowd as a ring of dark silhouettes against the white sky; they step in on "in". */
export const S16: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tI = wordAt(16, /^in/i, 0.68);
  const cam: Cam = { zoom: 1 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 760 };
  const step = ramp(t2, tI - 0.04, tI + 0.3, EOUT), back = ramp(t2, tI - 0.3, tI - 0.04) * (1 - step);
  const R: [number, number, number, 'down' | 'crossed' | 'hips', 'peci' | 'cap' | 'hijab' | null, string][] = [
    [650, 2140, 1000, 'down', 'peci', '#3a302a'], [520, 2180, 1100, 'crossed', null, '#352b25'], [790, 2180, 1120, 'hips', 'cap', '#30282a'],
    [360, 2260, 1350, 'down', 'hijab', '#2c2420'], [950, 2260, 1380, 'crossed', null, '#2a221e'],
    [150, 2420, 1750, 'hips', 'peci', '#221b18'], [1150, 2420, 1780, 'down', 'cap', '#1f1916'],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.sky }}>
      <BandImg id="alley/sky" cam={cam} />
      <Live cam={cam}>
        <Birds t={t} x0={300} y0={420} vx={160} n={4} s={1.2} col="#6a6460" />
        {R.map(([x, y, h, arms, hat, col], i) => {
          const towards = (648 - x) * 0.08 * step;
          const sc = 1 + 0.09 * step - 0.02 * back;
          return <RingFigure key={i} x={x + towards} y={y} h={h * sc} col={col} arms={arms} hat={hat} sway={Math.sin(t2 * 1.8 + i) * 2} tilt={(648 - x) * 0.004 * (1 + step)} />;
        })}
        <Dust t={t} x0={300} y0={300} w={700} h={600} n={16} o={0.6} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 17 — extreme close-up: a hand closes around a stone in the dirt on "stone"; then a held, tense beat. */
export const S17: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tS = wordAt(17, /^stone/i, 0.6);
  const hh = handheld(t, 0.35);
  const camB: Cam = { zoom: 1.5 + 0.03 * p, dx: 0, dy: 0, ox: 540, oy: 1000, tx: hh.hx, ty: hh.hy };
  const cam: Cam = { zoom: 1 + 0.03 * p, dx: 0, dy: 0, ox: 540, oy: 1000, tx: hh.hx, ty: hh.hy };
  const reach = ramp(t2, 0, tS - 0.1, EOUT);
  const grip = ramp(t2, tS - 0.06, tS + 0.12, EOUT);
  const lift = ramp(t2, tS + 0.15, tS + 0.55, EIO);
  const trem = t2 > tS + 0.3 ? Math.sin(t2 * 41) * 2.4 : 0;
  const sx = 690, sy = 1250;
  const hxp = 1000 + (sx + 10 - 1000) * reach, hyp = 560 + (sy - 150 - 560) * reach - 34 * lift + trem;
  return (
    <AbsoluteFill style={{ backgroundColor: '#bfb197' }}>
      <BandImg id="alley/dirt" cam={camB} />
      <Live cam={cam}>
        {/* shadows: stone + hand on the ground */}
        <ellipse cx={sx + 40 + 30 * lift} cy={sy + 46 + 20 * lift} rx={90} ry={50} fill={PAL.dark} opacity={0.3} />
        <ellipse cx={hxp + 110} cy={hyp + 150} rx={150} ry={110} fill={PAL.dark} opacity={0.18 + 0.1 * reach} />
        <Stone x={sx} y={sy - 34 * lift + trem} s={2.6} rot={-8} shadow={0} />
        <TopHand x={hxp} y={hyp} rot={28} s={1.55} grip={grip} />
        <Dust t={t} x0={200} y0={400} w={900} h={900} n={14} o={0.45} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 20 — close and low: the hand opens and the stone drops into the dirt on "home"; the feet turn away. */
export const S20: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tH = wordAt(20, /^home/i, 0.6);
  const cam: Cam = { zoom: 1 + 0.03 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 1100 };
  const H0 = 1500, x0 = 640;
  const tTurn = tH + 0.4;
  const turning = ramp(t2, tTurn, tTurn + 0.17);
  const dir = turning < 0.5 ? -1 : 1;
  const walking = t2 > tTurn + 0.17;
  const wx = x0 + (walking ? (t2 - tTurn - 0.17) * 1300 : 0);
  const stand: Pose = { lean: 2, head: 4, thA: 2, shA: 0, thB: -3, shB: -3, uaA: 4, faA: 8, uaB: -4, faB: 4, breath: 0.4 * Math.sin(t2 * 3.6) };
  const pose = walking ? walkPose((t2 - tTurn) * 9, false, 0.9) : stand;
  const [hx, hy] = handA(wx, G20, H0, dir, walking ? stand : pose);
  const open = ramp(t2, tH - 0.04, tH + 0.12, EOUT);
  // the stone falls from the hand on the sync word (physics on ONES once released), small bounce + dust
  const fall = Math.max(0, t - tH), y0 = hy + 66, yG = G20 + 30;
  const g = 1100 * 9.8;
  const tImp = Math.sqrt((2 * (yG - y0)) / g);
  const sy = fall <= 0 ? y0 : fall < tImp ? y0 + 0.5 * g * fall * fall : yG - Math.max(0, Math.sin(Math.min(1, (fall - tImp) / 0.22) * Math.PI)) * 30;
  const sxp = fall > 0 ? hx + 30 * Math.min(1, fall / tImp) : hx;
  const sq = 1 - 0.18 * (turning > 0 && turning < 1 ? Math.sin(turning * Math.PI) : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.lit }}>
      <Live cam={cam}>
        <BaseBg />
        {/* others leaving behind him (smaller, further back) */}
        {[0, 1].map((i) => <Figure key={i} x={-260 + i * 520 + t2 * 900} y={G20 - 70} h={1150} dir={1} pose={walkPose(t2 * 8 + i * 2, false, 0.9)} look={{ body: i ? '#3a3a40' : '#2e3a30', far: '#22262a', skin: '#7a5040' }} opacity={0.9} />)}
        <ellipse cx={wx} cy={G20 + 14} rx={260} ry={26} fill={PAL.dark} opacity={0.3} />
        <Stone x={sxp} y={sy} s={1.5} rot={fall > 0 ? fall * 260 : -10} shadow={fall > tImp ? 1 : 0} />
        <Puff x={hx + 30} y={yG + 20} u={(fall - tImp) / 0.6} s={1.2} />
        <g transform={`translate(${wx} 0) scale(${sq} 1) translate(${-wx} 0)`}>
          <Figure x={wx} y={G20} h={H0} dir={dir} pose={pose} look={{ body: '#3a3d44', far: '#2a2c32', skin: '#8a5a40' }} />
          {!walking && <HangHand x={hx} y={hy - 30} s={1.15} open={open} />}
          {!walking && fall <= 0 && <Stone x={hx} y={hy + 60} s={1.4} rot={-10} shadow={0} />}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 21 — the young man alone, collecting his scattered tools (breathing, on twos); the crowd's backs recede down the alley. Slow pull-back. */
export const S21: React.FC = () => {
  const { p, t, t2 } = useShot();
  const [mx, my] = pj(-0.75, 0, 3.7);
  const cam: Cam = { zoom: 1.22 - 0.2 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: mx - 108 + 80, oy: my - 192 - 140 };
  const h = (1.7 * D.f) / 3.7;
  // pick-up cycle (twos): reach to a tool on the ground, bring it to the bag
  const cyc = 1.25, k = (t2 % cyc) / cyc, taken = Math.min(4, Math.floor(t2 / cyc) + 1);
  const reachT = k < 0.5 ? EIO(k / 0.5) : 1 - EIO((k - 0.5) / 0.5);
  const base: Pose = kneelPose(30 + 10 * reachT, 22, 0.8 * Math.sin(t2 * 2.6));
  const tool = [mx - 0.55 * h, my + 0.02 * h], bag = [mx + 0.32 * h, my - 0.12 * h];
  const arm = ikArmA(mx, my, h, -1, base, tool[0] + (bag[0] - tool[0]) * (1 - reachT), tool[1] + (bag[1] - tool[1]) * (1 - reachT));
  const pose: Pose = { ...base, ...arm, uaB: 40, faB: 70 };
  const backs = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ i, X: [-0.5, 0.3, -0.1, 0.6, -0.7, 0.1, 0.45, -0.3][i], Z: 9 + i * 2.2 + 1.3 * t2 }));
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.sky }}>
      <BandImg id="alley/deep" cam={cam} />
      <Live cam={cam}>
        <Laundry t={t} zs={[8, 14, 21]} />
        {backs.sort((a, b) => b.Z - a.Z).map((q) => { const [x, y] = pj(q.X, 0, q.Z), hh = (1.65 * D.f) / q.Z, c = CROWD[q.i % CROWD.length]; return <BackWalker key={q.i} x={x} y={y} h={hh} ph={t2 * 7 + q.i} col={c.col} shirt={c.shirt} hat={c.hat} sarong={'sarong' in c ? c.sarong : false} />; })}
        {(() => { const [cx, cy] = pj(1.0, 0, 8.2); return <Cat x={cx} y={cy} s={0.55} t2={t2} dir={-1} />; })()}
        <Tools x={bag[0] + 0.12 * h} y={my + 8} s={h / 300} spread={1} taken={taken} />
        <ellipse cx={mx + 30} cy={my + 6} rx={h * 0.32} ry={h * 0.04} fill={PAL.dark} opacity={0.3} />
        <Figure x={mx} y={my} h={h} dir={-1} pose={pose} look={{ ...YOUNG, far: YOUNG_LEGS }} />
        <Dust t={t} x0={200} y0={600} w={900} h={900} n={24} o={0.5} />
      </Live>
    </AbsoluteFill>
  );
};
