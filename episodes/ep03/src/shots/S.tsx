import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { V, vp, Crowd, Flags, Flares, BurntCar, Litter, Dog, FLY, Banner, A, ap, Smoke, Ash, ST } from '../art/boulevard_art';
import { ManBack, Bread, Bust, Rubble } from '../art/boulevard_close';
import { Figure, walkPose, DepthWalker, BackWalker, ikArmA, Pose, Look } from '../art/boulevard_people';

/* EP03 boulevard. Clocks: camera + environment (smoke, flags, banners, litter, ash) ON ONES (p/t);
 * people and the dog ON TWOS (p2/t2). The man from nowhere never shows a face. */

/** shot 6 — high wide crane-down over the boulevard filled with people; the crowd surges on "million". */
export const S06: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tM = wordAt(6, /^million/i, 0.34);
  const cam: Cam = { zoom: 1.07 - 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: 150 - 190 * ramp(p, 0, 1, EIO), ox: 540, oy: 700 };
  const surge = ramp(t2, tM - 0.06, tM + 0.35, EOUT) * (1 - 0.4 * ramp(t2, tM + 0.6, tM + 1.6));
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="boulevard/day" cam={cam} />
      <Live cam={cam}>
        <Crowd t2={t2} surge={surge} />
        <Flags t={t} lift={surge} />
        <Flares t={t} spots={[[-9, 30, '#d9483b'], [6, 44, '#f2efe6'], [12, 24, '#d9483b'], [-3, 60, '#f2efe6']]} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — low angle: the flyover hung with long cloth banners, people on top waving; lateral track. */
export const S07: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tB = wordAt(7, /^bridge/i, 0.6);
  const cam: Cam = { zoom: 1.0, dx: 26 - 52 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 700 };
  const up = ramp(t2, tB - 0.1, tB + 0.2, EOUT);
  const top: [number, number, string, 'peci' | 'cap' | 'hijab' | null][] = [[90, 0.6, '#2a2a30', 'cap'], [250, 0.2, '#3a2e2a', null], [420, 0.9, '#2e3a30', 'peci'], [600, 0.4, '#4a3a52', 'hijab'], [760, 0.7, '#2a2e36', null], [930, 0.3, '#3a2e2a', 'cap'], [1100, 0.8, '#2f3237', null], [1240, 0.5, '#33302c', 'peci']];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="boulevard/fly" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        {top.map(([x, ph, c, hat], i) => <BackWalker key={i} x={x} y={FLY.top + 120} h={300} ph={0} col={c} shirt={c} hat={hat} point={clamp01(0.3 + 0.7 * Math.abs(Math.sin(t2 * 3 + ph * 6)) * (0.5 + 0.5 * up))} />)}
        <rect x={-40} y={FLY.top} width={1376} height={FLY.face - FLY.top} fill="#b3ada2" />
        <rect x={-40} y={FLY.top - 6} width={1376} height={8} fill="#f4f1e8" opacity={0.7} />
        <Banner x0={190} x1={630} y={FLY.face + 6} h={230} text="STEP DOWN" bg="#f2efe6" fg="#b8322b" t={t} ph={0} size={104} />
        <Banner x0={668} x1={1140} y={FLY.face + 6} h={230} text="HE IS INNOCENT" bg="#1e1c1e" fg="#f2efe6" t={t} ph={2} size={66} />
      </Live>
      <Live k={1.3} cam={cam}>
        {/* people below on the street, from behind, fists up */}
        {[[160, 2380, 820, '#2a2a30'], [520, 2420, 900, '#3a2e2a'], [900, 2400, 860, '#2e3a30'], [1200, 2440, 920, '#2a2e36']].map(([x, y, h, c], i) => <BackWalker key={i} x={x as number} y={y as number} h={h as number} ph={0} col={c as string} shirt={c as string} point={clamp01(0.5 + 0.5 * Math.sin(t2 * 4 + i))} />)}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — the same boulevard empty under curfew: a burnt car, litter blowing, a stray dog trotting. Slow lateral. */
export const S13: React.FC = () => {
  const { p, t, t2 } = useShot();
  const cam: Cam = { zoom: 1.2, dx: 30 - 60 * ramp(p, 0, 1, EIO), dy: 0, ty: -80, ox: 540, oy: 1300 };
  const [dx, dy] = vp(-12 + 3.2 * t2, 0, 25);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="boulevard/day" cam={cam} />
      <Live cam={cam}>
        {/* abandoned things: a dropped flag, a sandal, scorch marks */}
        {(() => { const [x, y] = vp(5, 0, 22), s = V.f / 22; return <g><path d={`M ${x} ${y} l ${2 * s} ${-0.2 * s} l ${0.2 * s} ${0.5 * s} l ${-2 * s} ${0.3 * s} Z`} fill="#3f7a5a" /><path d={`M ${x - 0.4 * s} ${y + 0.2 * s} l ${3 * s} ${-0.4 * s}`} stroke="#3a3430" strokeWidth={0.06 * s} /></g>; })()}
        {(() => { const [x, y] = vp(-1, 0, 28), s = V.f / 28; return <ellipse cx={x} cy={y} rx={5 * s} ry={1.4 * s} fill="#2a2420" opacity={0.35} />; })()}
        <BurntCar X={-3} Z={30} t={t} />
        <Litter t={t} />
        <Dog x={dx} y={dy} s={(V.f / 25) * 0.022} t2={t2} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 15 — ash dawn: a lone faceless man walks out of drifting smoke toward camera, backlit; fully emerges on "ashes". */
export const S15: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tA = wordAt(15, /^ashes/i, 0.8);
  const cam: Cam = { zoom: 1 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 900 };
  const Z = 26 - 19 * EOUT(clamp01(t2 / Math.max(tA + 0.3, 1)));
  const [x, y] = ap(0.15, 0, Z), h = (1.75 * A.f) / Z;
  const front = 0.9 * (1 - ramp(t, tA - 0.9, tA, EIO));
  return (
    <AbsoluteFill style={{ backgroundColor: '#8e7f84' }}>
      <BandImg id="boulevard/dawn" cam={cam} />
      <Live cam={cam}>
        <Smoke t={t} y={A.YH - 260} h={300} o={0.8} col="#a8968f" v={22} seed={3} />
        <ellipse cx={x} cy={y - h * 0.55} rx={h * 0.4} ry={h * 0.7} fill="#ffd8a8" opacity={0.18} />
        <DepthWalker x={x} y={y} h={h} ph={t2 * 6.5} col="#141118" />
        <path d={`M ${x - h * 0.06} ${y - h * 0.98} Q ${x} ${y - h} ${x + h * 0.06} ${y - h * 0.98}`} stroke="#ffd8a8" strokeWidth={Math.max(1.5, h * 0.012)} fill="none" opacity={0.8} />
        <Smoke t={t} y={A.YH - 420} h={520} o={front} col="#9c8b86" v={34} seed={11} />
        <Ash t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 16 — close: his dusty sandals stepping over rubble; tilt up to his empty hands. Backlit, no face. */
export const S16: React.FC = () => {
  const { p, t, t2 } = useShot();
  const G = 1650, h = 1700;
  const u = ramp(p, 0.35, 0.95, EIO);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, ty: -160 + 320 * u };
  const walkT = Math.min(t2, 0.9);
  const x = 420 + walkT * 220;
  const walking = t2 < 0.9;
  const pose: Pose = walking ? walkPose(t2 * 5.5, false, 0.75) : { lean: 0, head: 6, thA: 3, shA: 2, thB: -4, shB: -4, uaA: 8, faA: 22, uaB: -6, faB: 14, breath: 0.5 * Math.sin(t2 * 3) };
  const look: Look = { body: '#16131b', far: '#0e0c12', skin: '#2a2026', rim: '#ffd8a8', rimO: 0.9 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8e7f84' }}>
      <Live cam={cam}>
        <defs>
          <linearGradient id="bsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a5f6a" /><stop offset="1" stopColor="#c8b0a0" /></linearGradient>
          <radialGradient id="bsSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2d8" /><stop offset="0.3" stopColor="#ffd8a8" stopOpacity={0.6} /><stop offset="1" stopColor="#ffd8a8" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={0} y={-400} width={1296} height={G + 400} fill="url(#bsSky)" />
        <circle cx={900} cy={1250} r={700} fill="url(#bsSun)" />
        <Smoke t={t} y={900} h={600} o={0.6} col="#b09c94" v={26} seed={5} />
        <rect x={0} y={G - 10} width={1296} height={1000} fill="#2a2630" />
        <Rubble y={G} n={16} />
        <Figure x={x} y={G} h={h} dir={1} pose={pose} look={look} />
        {/* dust kicked up by the steps */}
        {walking && [0, 1, 2].map((i) => <ellipse key={i} cx={x - 60 + i * 50} cy={G - 10 - i * 8} rx={50 + i * 20} ry={16} fill="#b8a494" opacity={0.25} />)}
        <Rubble y={G + 140} n={8} seed={409} />
        <Ash t={t} n={36} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 17 — the man from behind hands bread to a child on "bread"; people start to gather. Slow push-in. */
export const S17: React.FC = () => {
  const { p, t2 } = useShot();
  const tB = wordAt(17, /^bread/i, 0.34);
  const cam: Cam = { zoom: 1.04 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1100 };
  const G = ST.ground;
  const give = ramp(t2, tB - 0.35, tB, EOUT), take = ramp(t2, tB, tB + 0.35, EIO);
  const cx = 790, ch = 470;
  const bx = 700 + 30 * take, by = G - 330 + 40 * take;
  const childBase: Pose = { lean: 4 - 6 * give, head: -18, thA: 4, shA: 2, thB: -4, shB: -4, uaA: 10, faA: 20, uaB: 6, faB: 16, breath: 0.6 * Math.sin(t2 * 4) };
  const reach = clamp01(give * 1.2);
  const armA = ikArmA(cx, G, ch, -1, childBase, bx * reach + (cx - 20) * (1 - reach), by * reach + (G - 230) * (1 - reach));
  const childPose: Pose = { ...childBase, ...armA, uaB: armA.uaA - 8, faB: armA.faA - 6 };
  const gather: [number, number, number, string][] = [[-140, 300, 1, '#3a4a5a'], [1420, 1010, -1, '#6a3a32'], [-260, 170, 1, '#4a3a52'], [1520, 1140, -1, '#2f3530']];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="boulevard/street" cam={cam} />
      <Live cam={cam}>
        {gather.map(([x0, x1, dir, c], i) => {
          const k = clamp01((t2 - 0.2 - i * 0.25) / 1.6), x = x0 + (x1 - x0) * EOUT(k), moving = k > 0 && k < 1;
          return <Figure key={i} x={x} y={G - 40} h={720} dir={dir} pose={moving ? walkPose(t2 * 8 + i, false, 0.9) : { lean: 2, head: 6, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 6, faA: 30, uaB: -4, faB: 10, breath: 0.5 * Math.sin(t2 * 3 + i) }} look={{ body: c, far: '#22262a', skin: '#8a5a40', hat: i === 2 ? 'hijab' : i === 1 ? 'peci' : null, hatCol: i === 2 ? '#6a5a7a' : '#14121a', skirt: i === 2 }} />;
        })}
        <ellipse cx={cx} cy={G + 4} rx={60} ry={8} fill="#2a2018" opacity={0.3} />
        <Figure x={cx} y={G} h={ch} dir={-1} pose={childPose} look={{ body: '#c94f3d', far: '#4a3a30', skin: '#a8765a' }} />
        <Bread x={bx} y={by} s={2.4} />
        <ManBack x={520} y={G + 20} h={780} tx={bx - 22 + 10 * take} ty={by + 4} lean={6 * give} breath={0.6 * Math.sin(t2 * 2.4)} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 18 — listeners' faces in warm light, nodding slowly; the nods land on "true". Slow lateral. */
export const S18: React.FC = () => {
  const { p, t2 } = useShot();
  const tT = wordAt(18, /^true/i, 0.72);
  const camB: Cam = { zoom: 2.2, dx: 0, dy: 0, ox: 540, oy: 700 };
  const cam: Cam = { zoom: 1.03, dx: 30 - 60 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1000 };
  const nodAt = (i: number) => {
    const big = t2 >= tT - 0.04 * i ? Math.sin(clamp01((t2 - tT + 0.04 * i) / 0.5) * Math.PI) * 12 : 0;
    return Math.sin(t2 * 1.7 + i) * 2 + big;
  };
  const B: [number, number, number, 'hijab' | 'peci' | 'hair' | 'cap', string, string, string][] = [
    [330, 1260, 2.3, 'peci', '#14121a', '#8a5a40', '#5a3f2e'], [960, 1230, 2.2, 'hijab', '#6a5a7a', '#a8765a', '#6a5a7a'],
    [650, 1380, 2.6, 'hair', '#1e1814', '#9a6a4e', '#3a4a5a'], [1060, 1700, 3.2, 'cap', '#2c3a4a', '#7a5040', '#8a7a5a'], [300, 1720, 3.3, 'hijab', '#3a5a5a', '#a8765a', '#3a5a5a'],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="boulevard/street" cam={camB} />
      <Live cam={cam}>
        <defs><radialGradient id="bsWarm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf86" stopOpacity={0.45} /><stop offset="1" stopColor="#ffcf86" stopOpacity={0} /></radialGradient></defs>
        <rect x={0} y={0} width={1296} height={2304} fill="#3a3028" opacity={0.25} />
        <circle cx={0} cy={900} r={900} fill="url(#bsWarm)" />
        {B.map(([x, y, s, hat, hc, sk, top], i) => <Bust key={i} x={x} y={y} s={s} dir={-1} nod={nodAt(i)} skin={sk} shade="#5e3a2c" top={top} hat={hat} hatCol={hc} />)}
      </Live>
    </AbsoluteFill>
  );
};
