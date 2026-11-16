import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, handheld, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { SQ, PORT, CAMP, Bunting, PartyCrowd, Confetti, Ship, Stall, Kite, Haze } from '../art/peace_art';
import { Figure, walkPose, ikArmA, handA, Pose, Look } from '../art/peace_people';

/* EP09 peace. No flags, insignia, symbols or weapons. Clocks: camera + environment (bunting, confetti,
 * ships, kite once flying, shutter) ON ONES (p/t); people ON TWOS (p2/t2). */

const jolt = (t: number, at: number, amp = 8) => (t < at ? 0 : amp * Math.exp(-(t - at) * 9) * Math.sin((t - at) * 46));
const stand = (t2: number, i = 0): Pose => ({ lean: 2, head: 4, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 8, faA: 18, uaB: -6, faB: 12, breath: 0.6 * Math.sin(t2 * 3 + i) });

/** shot 4 — a square full of celebrating people: a man lifts his daughter on "Romans", an old couple embraces, confetti bursts on "foretold". Slow crane down. */
export const S04: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tR = wordAt(4, /^romans/i, 0.35), tF = wordAt(4, /^foretold/i, 0.81);
  const cam: Cam = { zoom: 1 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 180 - 220 * ramp(p, 0, 1, EIO), ox: 540, oy: 1200 };
  const G = 1820;
  // father lifting his daughter overhead (lift lands on "Romans")
  const fx = 380, fh = 800, lift = ramp(t2, tR - 0.15, tR + 0.4, EOUT);
  const cx = fx + 30, cy = G - (0.62 + 0.55 * lift) * fh + Math.sin(t2 * 7) * 6 * lift;
  const fBase: Pose = { lean: -4 * lift, head: -10 - 26 * lift, thA: 6, shA: 2, thB: -6, shB: -6, uaA: 40, faA: 60, uaB: 40, faB: 60, breath: 0.6 * Math.sin(t2 * 3) };
  const aA = ikArmA(fx, G, fh, 1, fBase, cx + 26, cy + 70, -1), aB = ikArmA(fx, G, fh, 1, fBase, cx - 20, cy + 76, -1);
  const fPose: Pose = { ...fBase, ...aA, uaB: aB.uaA, faB: aB.faA, bob: -Math.abs(Math.sin(t2 * 7)) * 2 * lift };
  const kid: Pose = { lean: 0, head: -20 * lift, thA: 20, shA: -10, thB: -10, shB: -20, uaA: 40 + 120 * lift, faA: 60 + 110 * lift, uaB: 30 + 110 * lift, faB: 50 + 110 * lift };
  // old couple embracing, swaying gently
  const sw = Math.sin(t2 * 1.6) * 1.5, ox1 = 870, ox2 = 975, oh = 740;
  const p1: Pose = { lean: 8 + sw, head: 6, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 70, faA: 100, uaB: 60, faB: 95, breath: 0.6 * Math.sin(t2 * 2.4) };
  const p2: Pose = { lean: 8 - sw, head: 10, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 64, faA: 104, uaB: 56, faB: 100, breath: 0.6 * Math.sin(t2 * 2.4 + 1) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#f6efe0' }}>
      <BandImg id="peace/square" cam={cam} />
      <Live cam={cam}>
        <Bunting t={t} />
        <PartyCrowd t2={t2} y0={1190} y1={1720} s0={0.45} s1={2.2} arms={0.35 + 0.4 * ramp(t2, tF, tF + 0.3)} />
        <Figure x={ox2} y={G} h={oh * 0.95} dir={-1} pose={p2} look={{ body: '#6a5a7a', far: '#4a3e58', skin: '#a8765a', hat: 'hijab', hatCol: '#d8d0c0', skirt: true }} />
        <Figure x={ox1} y={G} h={oh} dir={1} pose={p1} look={{ body: '#5a6a5a', far: '#3e4a3e', skin: '#9a6a4e', hat: 'peci', hatCol: '#e8e2d4', beard: '#d8d0c8' }} />
        <Figure x={fx} y={G} h={fh} dir={1} pose={fPose} look={{ body: '#4f6f8a', far: '#3a5268', skin: '#9a6a4e', mouth: 0.6 * lift }} />
        <Figure x={cx} y={cy + 0.55 * 380} h={380} dir={1} pose={kid} look={{ body: '#e8b84a', far: '#c9962e', skin: '#b07a5a', hat: 'braids', hatCol: '#2a1e18', skirt: true, mouth: lift }} />
        <Confetti t={t} u={t - tF} x={648} y={1000} />
        <Confetti t={t + 3} u={t - tF - 0.08} x={200} y={1300} />
        <Confetti t={t + 7} u={t - tF - 0.12} x={1100} y={1250} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 5 — the sunny port market: kids chase between the stalls, a merchant laughs with a foreign buyer, a ship's horn on "ports", a kite rises on "siren". Slow lateral track. */
export const S05: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tP = wordAt(5, /^ports/i, 0.23), tS = wordAt(5, /^siren/i, 0.88);
  const cam: Cam = { zoom: 1.06, dx: 70 - 140 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1100 };
  const G = 1700;
  const laugh = Math.abs(Math.sin(t2 * 8));
  const runX = (i: number) => ((((t2 * 420 + i * 260) % 1700) + 1700) % 1700) - 200;
  const kiteU = ramp(t, tS - 0.2, tS + 0.7, EOUT);
  const kx = 1110, kh = 420;
  const kidPose: Pose = { lean: -6, head: -30, thA: 4, shA: 2, thB: -4, shB: -4, uaA: 150 + 10 * Math.sin(t2 * 3), faA: 160, uaB: 10, faB: 30 };
  const [khx, khy] = handA(kx, G + 40, kh, -1, kidPose);
  const puff = t - tP;
  return (
    <AbsoluteFill style={{ backgroundColor: '#f6efe0' }}>
      <BandImg id="peace/port-day" cam={cam} />
      <Live cam={cam}>
        <Ship x={760} y={PORT.sea + 70} s={0.9} col="#4f6f8a" col2="#e8e2d4" />
        {puff > 0 && puff < 2 && [0, 1, 2].map((k) => <circle key={k} cx={1000 + k * 30 + puff * 60} cy={PORT.sea - 130 - puff * 80 - k * 20} r={20 + puff * 30 + k * 6} fill="#ffffff" opacity={0.7 * (1 - puff / 2)} />)}
        {[0, 1, 2].map((i) => { const gx = ((t * 80 + i * 300) % 1500) - 100, gy = 500 + i * 60 + Math.sin(t * 2 + i) * 20; return <path key={i} d={`M ${gx - 14} ${gy - 4} Q ${gx - 6} ${gy - 10} ${gx} ${gy} Q ${gx + 6} ${gy - 10} ${gx + 14} ${gy - 4}`} stroke="#f2efe6" strokeWidth={3} fill="none" />; })}
        <Stall x={200} y={G - 40} w={300} col="#c94f3d" />
        {/* merchant behind his counter laughing with a foreign buyer (the counter hides his legs) */}
        <Figure x={600} y={G - 60} h={720} dir={1} pose={{ lean: -14 - 4 * laugh, head: -30 - 6 * laugh, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 70, faA: 120, uaB: 50, faB: 100, bob: -laugh * 2 }} look={{ body: '#e8e2d4', far: '#c8c0b0', skin: '#8a5a40', hat: 'peci', hatCol: '#3a3430', beard: '#3a2a20', mouth: laugh }} />
        <Stall x={620} y={G - 40} w={320} col="#4f8a7a" />
        <Stall x={1040} y={G - 40} w={300} col="#e8b84a" />
        <Figure x={790} y={G + 10} h={740} dir={-1} pose={{ ...stand(t2), lean: -10 - 3 * laugh, head: -24 - 6 * laugh, uaA: 60, faA: 100 }} look={{ body: '#6a7a8a', far: '#4a5868', skin: '#e0b898', hat: 'cap', hatCol: '#d8d0c0', mouth: laugh * 0.8, bag: 'shoulder', bagCol: '#8a6a44' }} />
        {/* kids chasing each other through the market */}
        {[0, 1].map((i) => <Figure key={i} x={runX(i)} y={G + 120 + i * 20} h={400 - i * 20} dir={1} pose={{ ...walkPose(t2 * 13 + i * 2, false, 1.4), lean: 16 }} look={{ body: i ? '#c94f3d' : '#5a7aa8', far: '#2a2a30', skin: '#b07a5a', hat: i ? 'braids' : null, hatCol: '#2a1e18', skirt: i === 1, mouth: 0.6 }} />)}
        {/* the kite: held low, rises into the sky on "siren" */}
        <Kite hx={khx} hy={khy} kx={khx - 120 - 260 * kiteU} ky={khy - 160 - 900 * kiteU} t={t} />
        <Figure x={kx} y={G + 40} h={kh} dir={-1} pose={kidPose} look={{ body: '#4f8a7a', far: '#2a4a40', skin: '#9a6a4e', hat: 'cap', hatCol: '#c94f3d' }} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — dusk camp: two soldiers (grey vs olive, no symbols) chest to chest shouting from "quarrel"; others rush in to pull them apart; the shove lands on "was". Handheld push-in. */
export const S07: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tQ = wordAt(7, /^quarrel/i, 0.4), tW = wordAt(7, /^was/i, 0.83);
  const hh = handheld(t, 1.1);
  const cam: Cam = { zoom: 1.0 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: hh.hx + jolt(t, tW, 10), ty: hh.hy + 60, rot: hh.hr, ox: 600, oy: 1200 };
  const G = 1720, h = 820;
  const shout = t2 > tQ - 0.1 ? Math.abs(Math.sin(t2 * 9)) : 0.2;
  const shove = ramp(t2, tW - 0.08, tW + 0.12, EOUT), back = ramp(t2, tW, tW + 0.4, EOUT);
  const ax = 470, bx = 720 + 90 * back;
  const aBase: Pose = { lean: 16 + 6 * shove, head: -4, thA: 14, shA: 4, thB: -10, shB: -10, uaA: 40, faA: 60, uaB: 30, faB: 70, breath: 0.6 * shout };
  const aArm = shove > 0 ? ikArmA(ax, G, h, 1, aBase, bx - 30, G - 0.66 * h, -1) : { uaA: 20, faA: 70 };
  const aPose: Pose = { ...aBase, ...aArm, uaB: shove > 0 ? aArm.uaA - 6 : 30, faB: shove > 0 ? aArm.faA - 4 : 70 };
  const bPose: Pose = { lean: 14 - 30 * back, head: -6 + 10 * back, thA: 10, shA: 4, thB: -14 - 10 * back, shB: -12, uaA: 30 + 40 * back, faA: 80, uaB: 20 + 30 * back, faB: 60, breath: 0.6 * shout };
  // the others rushing in from both sides (from "quarrel"), grabbing them from behind
  const k = ramp(t2, tQ, tQ + 0.9, EOUT);
  const lx = -200 + (ax - 230 + 200) * k, rx = 1400 - (1400 - (bx + 240)) * k;
  const grabL = k > 0.95, grabR = k > 0.95;
  const lBase: Pose = grabL ? { lean: -14, head: 4, thA: 12, shA: 4, thB: -16, shB: -14, uaA: 60, faA: 70, uaB: 50, faB: 60 } : { ...walkPose(t2 * 12, false, 1.3), lean: 18 };
  const lArm = grabL ? ikArmA(lx, G + 20, h * 0.97, 1, lBase, ax - 20, G - 0.72 * h, -1) : {};
  const rBase: Pose = grabR ? { lean: -14, head: 4, thA: 12, shA: 4, thB: -16, shB: -14, uaA: 60, faA: 70, uaB: 50, faB: 60 } : { ...walkPose(t2 * 12 + 1, false, 1.3), lean: 18 };
  const rArm = grabR ? ikArmA(rx, G + 20, h * 0.97, -1, rBase, bx + 20, G - 0.72 * h, -1) : {};
  const GREY: Look = { body: '#7a7e84', far: '#5a5e64', skin: '#a8765a', hat: 'cap', hatCol: '#5a5e64' };
  const OLIVE: Look = { body: '#5f6a48', far: '#434c32', skin: '#8a5a40', hat: 'cap', hatCol: '#434c32' };
  return (
    <AbsoluteFill style={{ backgroundColor: '#b8705a' }}>
      <BandImg id="peace/camp" cam={cam} />
      <Live cam={cam}>
        <Haze t={t} y={1050} col="#e0a080" />
        {/* a few onlookers further back turning toward the noise */}
        {[[220, 1300, 380, '#7a7e84'], [1000, 1290, 360, '#5f6a48'], [1160, 1310, 390, '#5f6a48']].map(([x, y, hh2, c], i) => <Figure key={i} x={x as number} y={y as number} h={hh2 as number} dir={(x as number) < 600 ? 1 : -1} pose={{ ...stand(t2, i), head: -6, lean: 6 }} look={{ body: c as string, far: '#3a3a3a', skin: '#8a5a40', hat: 'cap', hatCol: '#3a3c40' }} />)}
        <Figure x={bx} y={G} h={h} dir={-1} pose={bPose} look={{ ...OLIVE, mouth: shout }} />
        <Figure x={ax} y={G} h={h} dir={1} pose={aPose} look={{ ...GREY, mouth: shout }} />
        <Figure x={lx} y={G + 20} h={h * 0.97} dir={1} pose={{ ...lBase, ...lArm }} look={GREY} />
        <Figure x={rx} y={G + 20} h={h * 0.97} dir={-1} pose={{ ...rBase, ...rArm }} look={OLIVE} />
        {t2 >= tW && t2 < tW + 0.4 && <ellipse cx={bx - 20} cy={G + 10} rx={120 + 200 * (t2 - tW)} ry={20} fill="#c8a080" opacity={0.6 * (1 - (t2 - tW) / 0.4)} />}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — night port: stalls shuttered; a merchant pulls a metal shutter down; it slams on "warships" while dark warship silhouettes slide into the harbour. Slow push-in. */
export const S09: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tW = wordAt(9, /^warships/i, 0.74);
  const cam: Cam = { zoom: 1.02 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: jolt(t, tW, 9), ox: 560, oy: 1100 };
  const G = 1700;
  const sh = 0.25 + 0.6 * ramp(t, 0.2, tW - 0.08, EIO) + 0.15 * ramp(t, tW - 0.08, tW, (n) => n * n);
  const sx = 640, sw = 360;
  const shutterBottom = G - 40 - 330 + 330 * sh;
  const mx = sx + 150, mh = 760;
  const mBase: Pose = { lean: 4, head: -10 + 20 * ramp(t2, tW, tW + 0.4), thA: 4, shA: 2, thB: -6, shB: -6, uaA: 140, faA: 160, uaB: 120, faB: 150, breath: 0.6 * Math.sin(t2 * 3) };
  const reach = t2 < tW + 0.15;
  const mArm = reach ? ikArmA(mx, G + 20, mh, -1, mBase, sx + 60, shutterBottom, -1) : { uaA: 10, faA: 20 };
  const mArmB = reach ? ikArmA(mx, G + 20, mh, -1, mBase, sx + 120, shutterBottom + 4, -1) : { uaA: 0, faA: 10 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1020' }}>
      <BandImg id="peace/port-night" cam={cam} />
      <Live cam={cam}>
        <defs><radialGradient id="pnLamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb860" stopOpacity={0.6} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></radialGradient></defs>
        {/* warships sliding in, dark, no markings */}
        <ellipse cx={648} cy={PORT.sea - 20} rx={900} ry={160} fill="#3a4868" opacity={0.55} />
        <ellipse cx={300} cy={PORT.sea - 10} rx={500} ry={90} fill="#ffb860" opacity={0.12} />
        <Ship x={1600 - 150 * t} y={PORT.sea + 130} s={1.5} war col="#06080e" col2="#06080e" />
        <Ship x={420 - 80 * t} y={PORT.sea + 70} s={0.85} war col="#0a0d16" col2="#0a0d16" />
        {/* sea reflections of the lamp */}
        {[0, 1, 2, 3].map((k) => <rect key={k} x={960 - k * 8 + Math.sin(t * 2 + k) * 10} y={PORT.sea + 140 + k * 26} width={60 - k * 10} height={5} rx={2} fill="#ffb860" opacity={0.4} />)}
        <Stall x={200} y={G - 40} w={300} col="#c94f3d" night shutter={1} />
        <Stall x={sx} y={G - 40} w={sw} col="#4f8a7a" night shutter={sh} />
        <Stall x={1080} y={G - 40} w={300} col="#e8b84a" night shutter={1} />
        {/* sodium lamp */}
        <rect x={980} y={700} width={10} height={1000} fill="#1a1c22" />
        <circle cx={1000} cy={712} r={260} fill="url(#pnLamp)" />
        <circle cx={1000} cy={712} r={8} fill="#ffe0a8" />
        <polygon points="990,716 1010,716 1260,1720 740,1720" fill="#ffb860" opacity={0.08} />
        <Figure x={mx} y={G + 20} h={mh} dir={-1} pose={{ ...mBase, ...mArm, uaB: mArmB.uaA, faB: mArmB.faA }} look={{ body: '#5a4a3a', far: '#3a3028', skin: '#8a5a40', hat: 'peci', hatCol: '#14121a', rim: '#ffb860', rimO: 0.8 }} />
      </Live>
    </AbsoluteFill>
  );
};
