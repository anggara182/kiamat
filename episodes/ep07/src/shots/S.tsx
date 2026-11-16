import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { PIT, PitLip, Shovel, Bottle, Dust, bankY, Haze } from '../art/dig_art';
import { Clutcher } from '../art/dig_close';
import { Figure, walkPose, kneelPose, ikArmA, handA, Pose, Look } from '../art/dig_people';

/* EP07 dig. Clocks: camera + environment (dust, haze) ON ONES (p/t); people, their shovels, the bottle,
 * the mallet ON TWOS (p2/t2). Violence implied only: in S06 nothing but absence. */

const A_LOOK: Look = { body: '#4f5f6e', far: '#3a4552', skin: '#9a6a4e', hat: 'cap', hatCol: '#8a3a2a', rim: '#fff4d8', rimO: 0.7 };
const B_LOOK: Look = { body: '#7a5a3a', far: '#5a4028', skin: '#8a5a40', beard: '#2a1e18', rim: '#fff4d8', rimO: 0.7 };
const jolt = (t: number, at: number, amp = 6) => (t < at ? 0 : amp * Math.exp(-(t - at) * 10) * Math.sin((t - at) * 50));

/** shovel + both hands for a digger at (x, G) of height h facing dir; phase u 0..1 (push down, lift with mud) */
const digRig = (x: number, G: number, h: number, dir: number, u: number) => {
  const push = u < 0.55 ? EIO(u / 0.55) : 1 - EIO((u - 0.55) / 0.45);
  const T: [number, number] = [x + dir * (0.1 + 0.08 * push) * h, G - (0.66 - 0.14 * push) * h];
  const B: [number, number] = [x + dir * 0.44 * h, G - (0.06 + 0.34 * (1 - push)) * h];
  return { T, B, push, mud: 1 - push };
};

/** a digger: figure whose two hands hold the shovel (near hand mid-handle, far hand on the top grip) */
const Digger: React.FC<{ x: number; G: number; h: number; dir: number; u: number; look: Look; bulk?: number; lean?: number; head?: number; stop?: number; nearTarget?: [number, number] }> = ({ x, G, h, dir, u, look, bulk = 1, lean = 0, head = 0, stop = 0, nearTarget }) => {
  const rig = digRig(x, G, h, dir, stop > 0 ? 0.55 : u);
  const base: Pose = { lean: 14 + 12 * rig.push * (1 - stop) + lean, head: 10 + 8 * rig.push * (1 - stop) + head, thA: 10, shA: 4, thB: -8, shB: -8, uaA: 40, faA: 60, uaB: 40, faB: 60 };
  const mid: [number, number] = [rig.T[0] + (rig.B[0] - rig.T[0]) * 0.4, rig.T[1] + (rig.B[1] - rig.T[1]) * 0.4];
  const near = ikArmA(x, G, h, dir, base, ...(nearTarget ?? mid), -1);
  const far = ikArmA(x, G, h, dir, base, rig.T[0], rig.T[1], -1);
  const pose: Pose = { ...base, ...near, uaB: far.uaA, faB: far.faA };
  return (
    <g transform={`translate(${x} 0) scale(${bulk} 1) translate(${-x} 0)`}>
      <Shovel tx={rig.T[0]} ty={rig.T[1]} bx={rig.B[0]} by={rig.B[1]} s={h / 600} mud={rig.mud * (1 - stop)} />
      <Figure x={x} y={G} h={h} dir={dir} pose={pose} look={look} />
    </g>
  );
};

/** shot 4 — two friends dig side by side; A passes B the water bottle on "water" and they both laugh. */
export const S04: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tW = wordAt(4, /^water/i, 0.89);
  const cam: Cam = { zoom: 1.04 + 0.03 * p, dx: 10 - 20 * p, dy: 0, ox: 540, oy: 1000 };
  const G = 1660, lip = 1440, ax = 330, bx = 930, ah = 820, bh = 730;
  const aStop = ramp(t2, tW - 1.0, tW - 0.8), bStop = ramp(t2, tW - 0.5, tW - 0.35);
  const laugh = ramp(t2, tW + 0.15, tW + 0.35) * Math.abs(Math.sin(t2 * 9));
  // the bottle: on the lip, picked up by A, handed across on the sync word, B lifts it
  const meet: [number, number] = [(ax + bx) / 2 + 10, G - 0.58 * ah];
  const k1 = ramp(t2, tW - 0.75, tW - 0.5, EOUT), k2 = ramp(t2, tW - 0.5, tW, EIO), k3 = ramp(t2, tW + 0.1, tW + 0.6, EIO);
  const rim: [number, number] = [ax + 170, lip - 26];
  const aHold: [number, number] = [ax + 0.25 * ah, G - 0.5 * ah];
  let bot: [number, number] = rim;
  if (k1 > 0) bot = [rim[0] + (aHold[0] - rim[0]) * k1, rim[1] + (aHold[1] - rim[1]) * k1];
  if (k2 > 0) bot = [aHold[0] + (meet[0] - aHold[0]) * k2, aHold[1] + (meet[1] - aHold[1]) * k2];
  const bMouth: [number, number] = [bx - 0.12 * bh, G - 0.86 * bh];
  if (k3 > 0) bot = [meet[0] + (bMouth[0] - meet[0]) * k3, meet[1] + (bMouth[1] - meet[1]) * k3];
  const aNear = k1 > 0 && t2 < tW + 0.1 ? bot : undefined;
  const bNear = t2 >= tW - 0.25 ? bot : undefined;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9d4a8' }}>
      <BandImg id="dig/pit" cam={cam} />
      <Live cam={cam}>
        <Digger x={ax} G={G} h={ah} dir={1} u={(t2 / 1.3) % 1} look={A_LOOK} stop={aStop} nearTarget={aNear} lean={-14 * laugh} head={-30 * laugh} />
        <Digger x={bx} G={G} h={bh} dir={-1} u={(t2 / 1.3 + 0.5) % 1} look={B_LOOK} bulk={1.14} stop={bStop} nearTarget={bNear} lean={-12 * laugh} head={-34 * laugh + (k3 > 0.5 ? -20 : 0)} />
        <Bottle x={bot[0]} y={bot[1]} rot={k3 * -60} s={1.3} />
        <PitLip y={lip} />
        <Dust t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 5 — a rope pegged tight between them; B hammers the peg in on "rope"; each digs only on his side, glancing at the other. Slow push-in. */
export const S05: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tR = wordAt(5, /^rope/i, 0.75);
  const cam: Cam = { zoom: 1.02 + 0.07 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1150, ty: jolt(t, tR, 5) };
  const G = 1600, lip = 1700, ax = 300, ah = 800;
  const peg: [number, number] = [610, 1610];
  // mallet: two strikes, the second lands exactly on "rope"
  const strike = (at: number) => (t2 < at - 0.35 ? 0 : t2 < at ? EIO((t2 - at + 0.35) / 0.35) : 1 - ramp(t2, at, at + 0.4));
  const raise = t2 < tR - 0.9 ? strike(tR - 0.9 + 0.35) * 0 : Math.max(0, 1 - Math.max(strike(tR - 0.7) > 0 && t2 < tR - 0.7 ? 1 - strike(tR - 0.7) : 0, t2 >= tR - 0.35 && t2 < tR ? 1 - EIO((t2 - tR + 0.35) / 0.35) : 0));
  void raise;
  const up = t2 < tR - 0.35 ? (t2 < tR - 0.8 ? ramp(t2, tR - 1.2, tR - 0.95) * (1 - ramp(t2, tR - 0.95, tR - 0.8)) : ramp(t2, tR - 0.8, tR - 0.35)) : 1 - ramp(t2, tR - 0.35, tR, (n) => n * n);
  const bh = 720, bxk = 900;
  const kb = kneelPose(22 - 10 * up, 20, 0.4 * Math.sin(t2 * 3));
  const mHand: [number, number] = [peg[0] + 150 + 40 * up, peg[1] - 70 - 240 * up];
  const bArm = ikArmA(bxk, G, bh, -1, kb, mHand[0], mHand[1], -1);
  const bArm2 = ikArmA(bxk, G, bh, -1, kb, peg[0] + 46, peg[1] - 40, -1);
  const glanceB = t2 > tR + 0.2 ? 1 : 0;
  const bPose: Pose = { ...kb, ...bArm, uaB: bArm2.uaA, faB: bArm2.faA, head: glanceB ? -12 : 22 };
  const [mx, my] = handA(bxk, G, bh, -1, bPose);
  const glanceA = (Math.sin(t2 * 2.2) > 0.3 ? 1 : 0) || (t2 > tR - 0.1 ? 1 : 0);
  const pegDown = t2 >= tR ? 18 : t2 >= tR - 0.7 ? 8 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e9d4a8' }}>
      <BandImg id="dig/pit" cam={cam} />
      <Live cam={cam}>
        {/* the rope: from the peg, taut along the pit floor to a far peg */}
        <path d={`M ${peg[0]} ${peg[1] - 30 + pegDown} L 620 ${PIT.rim + 90}`} stroke="#efe2bc" strokeWidth={9} />
        <path d={`M ${peg[0]} ${peg[1] - 24 + pegDown} L 620 ${PIT.rim + 96}`} stroke="#2a2018" strokeWidth={4} opacity={0.25} />
        <rect x={614} y={PIT.rim + 70} width={10} height={26} fill="#5a4028" />
        <Digger x={ax} G={G} h={ah} dir={1} u={(t2 / 1.6) % 1} look={A_LOOK} lean={glanceA ? -10 : 0} head={glanceA ? -26 : 0} stop={t2 > tR ? 0.6 : 0} />
        {/* B kneeling at the peg with a mallet */}
        <ellipse cx={bxk} cy={G + 6} rx={150} ry={14} fill="#2a2018" opacity={0.3} />
        <Figure x={bxk} y={G} h={bh} dir={-1} pose={bPose} look={B_LOOK} />
        <g transform={`translate(${mx} ${my}) rotate(${-100 + 80 * (1 - up)})`}><rect x={-8} y={-8} width={150} height={16} rx={6} fill="#a8865c" /><rect x={128} y={-34} width={52} height={68} rx={8} fill="#5a4430" /><rect x={128} y={-34} width={52} height={14} rx={6} fill="#7a5e44" /></g>
        <rect x={peg[0] - 12} y={peg[1] - 70 + pegDown} width={24} height={80 - pegDown} fill="#6a4a30" />
        <rect x={peg[0] - 16} y={peg[1] - 76 + pegDown} width={32} height={10} fill="#8a6a44" />
        <PitLip y={lip} />
        {t2 >= tR && t2 < tR + 0.4 && <ellipse cx={peg[0]} cy={peg[1] + 10} rx={70 + 120 * (t2 - tR)} ry={14} fill="#c49a5e" opacity={0.6 * (1 - (t2 - tR) / 0.4)} />}
        <Dust t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 6 — dawn, long lens: B walks up the bank alone carrying TWO shovels, not looking back; the pit behind empty; he reaches the top on "back". */
export const S06: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tB = wordAt(6, /^back/i, 0.74);
  const cam: Cam = { zoom: 1.03 + 0.02 * p, dx: 0, dy: 0, ox: 540, oy: 1000 };
  const x0 = 260, x1 = 900;
  const k = clamp01(t2 / tB), x = t2 <= tB ? x0 + (x1 - x0) * k : x1 + 60 * (t2 - tB);
  const y = bankY(x), h = 400;
  const pose: Pose = { ...walkPose(t2 * 5.2, false, 0.75), lean: 12 * (x < x1 ? 1 : 0.4), head: 16, uaA: 168, faA: 200 };
  const [sx, sy] = handA(x, y, h, 1, pose);
  return (
    <AbsoluteFill style={{ backgroundColor: '#a8808a' }}>
      <BandImg id="dig/dawn" cam={cam} />
      <Live cam={cam}>
        <Haze t={t} y={1050} />
        {/* long dawn shadow down the slope behind him */}
        <ellipse cx={x - 140} cy={y + 8} rx={200} ry={12} fill="#1e161c" opacity={0.45} transform={`rotate(-30 ${x} ${y})`} />
        {/* two shovels over his shoulder, blades trailing behind */}
        {[0, 1].map((i) => <Shovel key={i} tx={sx + 14 + i * 6} ty={sy - 6 + i * 10} bx={sx - 230 + i * 20} by={sy + 70 + i * 26} s={0.6} />)}
        <Figure x={x} y={y} h={h} dir={1} pose={pose} look={{ ...B_LOOK, body: '#3a2a26', far: '#2a1e1c', skin: '#5a3a30', rim: '#ffe0c0', rimO: 0.9 }} />
        <Haze t={t} y={1500} o={0.25} />
        <Dust t={t} col="#f0d0c0" o={0.35} n={20} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — close: a trembling hand clutches a lump of gold to his chest; the eyes dart left and right; the grip tightens on "lived". */
export const S12: React.FC = () => {
  const { p, t2 } = useShot();
  const tL = wordAt(12, /^lived/i, 0.73);
  const cam: Cam = { zoom: 1.0 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 700 };
  const grip = ramp(t2, tL - 0.05, tL + 0.18, EOUT);
  const seq = [-1, 0.9, -0.2, -1, 1, 0.1, -0.9, 1];
  const dart = seq[Math.floor(t2 / 0.33) % seq.length];
  const trem = Math.sin(t2 * 47) * (3 + 5 * grip);
  return (
    <AbsoluteFill style={{ backgroundColor: '#c8a06a' }}>
      <BandImg id="dig/close" cam={cam} />
      <Live cam={cam}>
        <Clutcher dart={dart} grip={grip} trem={trem} breath={4 * Math.sin(t2 * 6)} />
      </Live>
    </AbsoluteFill>
  );
};
