import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { Easing } from 'remotion';
import { wordAt } from '../data/ep';
import { BR, Water, Bridge, Splash, Trickle, EdgeLamp, YARD, Van, Blueprints } from '../art/bridge_art';
import { Figure, walkPose, BackWalker, handA, ikArmA, Pose, Look } from '../art/bridge_people';

/* EP04 bridge. Clocks: camera + environment (water, beam on its rope, ribbon, confetti, the falling span,
 * spray, lamps) ON ONES (p/t); people ON TWOS (p2/t2). No victims: the bridge falls EMPTY. */

const jolt = (t: number, at: number, amp = 10) => (t < at ? 0 : amp * Math.exp(-(t - at) * 8) * Math.sin((t - at) * 44));
const EIN = Easing.in(Easing.quad);
const WORK: Look[] = [
  { body: '#3a4a5a', far: '#2a3440', skin: '#8a5a40', hat: 'cap', hatCol: '#c94f3d' }, { body: '#6a3a32', far: '#4a2822', skin: '#7a5040', hat: null },
  { body: '#2f3530', far: '#22261f', skin: '#8a5a40', hat: 'peci', hatCol: '#14121a' }, { body: '#8a7a5a', far: '#5a4f3a', skin: '#9a6a4e', hat: 'cap', hatCol: '#3a4a5a' },
  { body: '#4a3a52', far: '#32283a', skin: '#a8765a', hat: 'hijab', hatCol: '#7a5a8a', skirt: true }, { body: '#5a5e62', far: '#3a3d40', skin: '#8a5a40', hat: null },
];

/** shot 9 — followers clumsily build the bridge: ropes, crooked timber; the middle beam clangs into place crooked on "anything". Lateral track. */
export const S09: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tA = wordAt(9, /^anything/i, 0.77);
  const cam: Cam = { zoom: 1.32, dx: 60 - 120 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 820, ty: jolt(t, tA, 7) };
  const beamU = ramp(t, 0.1, tA, EIN);
  const cheer = t2 >= tA;
  const D = BR.deck, ax = (BR.pierL + BR.pierR) / 2, ay = D - 360;
  const pullers: [number, number][] = [[260, 0], [330, 1.3], [400, 2.6]];
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="bridge/day" cam={cam} />
      <Live cam={cam}>
        <Water t={t} mood="day" />
        <Bridge mood="day" stage="build" t={t} beamU={beamU} />
        {pullers.map(([x, ph], i) => {
          const heave = Math.sin(t2 * 4 + ph);
          const pose: Pose = cheer
            ? { lean: -4, head: -16, thA: 4, shA: 2, thB: -4, shB: -4, uaA: 168 + 6 * Math.sin(t2 * 9 + i), faA: 176, uaB: 160, faB: 170, bob: -Math.abs(Math.sin(t2 * 9 + i)) * 3 }
            : { lean: -20 - 6 * heave, head: -10, thA: 18, shA: 6, thB: -14, shB: -18, uaA: 70, faA: 76, uaB: 64, faB: 72 };
          const [hx, hy] = handA(x, D, 100, 1, pose);
          return <g key={i}>{!cheer && <path d={`M ${hx} ${hy} L ${ax} ${ay}`} stroke="#5a4a38" strokeWidth={2} />}<Figure x={x} y={D} h={100} dir={1} pose={pose} look={WORK[i]} /></g>;
        })}
        {/* a man hammering on the left span, two more on the right stringers */}
        {(() => { const hm = Math.sin(t2 * 8); const pose: Pose = cheer ? { lean: 0, head: -14, thA: 2, shA: 0, thB: -2, shB: -2, uaA: 165, faA: 178, uaB: 150, faB: 165 } : { lean: 26, head: 18, thA: 30, shA: -10, thB: 10, shB: -20, uaA: 90 + 50 * hm, faA: 100 + 60 * hm, uaB: 40, faB: 60 }; return <Figure x={170} y={D} h={96} dir={1} pose={pose} look={WORK[3]} />; })()}
        {[[930, 4], [1060, 5]].map(([x, k], i) => { const w = Math.sin(t2 * 3 + i); const pose: Pose = cheer ? { lean: 0, head: -16, thA: 2, shA: 0, thB: -2, shB: -2, uaA: 160, faA: 170, uaB: 168 + 6 * w, faB: 178 } : { lean: 8, head: 4 - 10 * i, thA: 6, shA: 2, thB: -6, shB: -6, uaA: 40 + 20 * w, faA: 90, uaB: 20, faB: 40 }; return <Figure key={x} x={x} y={D + 10} h={96} dir={-1} pose={pose} look={WORK[k]} />; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — ribbon cutting on the finished bridge packed with people; the ribbon snaps on "cheered"; confetti. Slow push-in. */
export const S10: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tC = wordAt(10, /^cheered/i, 0.69);
  const cam: Cam = { zoom: 1.22 + 0.08 * ramp(p, 0, 1, EIO), dx: 30, dy: 0, ox: 420, oy: 820 };
  const D = BR.deck, rx = 420;
  const cut = t >= tC, cu = Math.max(0, t - tC);
  const crowd = Array.from({ length: 28 }, (_, i) => ({ x: 540 + i * 24 + (i % 3) * 6, h: 74 + (i % 4) * 6, c: ['#3a4a5a', '#6a3a32', '#2f3530', '#8a7a5a', '#4a3a52', '#9a4a3a', '#d8d4c8'][i % 7] }));
  const conf = Array.from({ length: 60 }, (_, i) => ({ x: 200 + ((i * 97) % 900), v: 120 + (i % 7) * 30, c: ['#c94f3d', '#e8c24a', '#4f6f8a', '#f2efe6', '#3f7a5a'][i % 5], ph: i }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="bridge/day" cam={cam} />
      <Live cam={cam}>
        <Water t={t} mood="day" />
        <Bridge mood="day" stage="done" t={t} />
        {crowd.map((q, i) => <BackWalker key={i} x={q.x} y={D - 4} h={q.h} ph={0} col={q.c} shirt={q.c} point={clamp01((cut ? 0.6 : 0.15) + 0.4 * Math.abs(Math.sin(t2 * (cut ? 6 : 2) + i)))} hat={i % 5 === 0 ? 'peci' : i % 7 === 3 ? 'hijab' : null} />)}
        {/* ribbon across the deck: snaps on the sync word, the halves drop and flutter */}
        <rect x={rx - 4} y={D - 70} width={8} height={70} fill="#5a5a5e" />
        <rect x={rx + 90} y={D - 70} width={8} height={70} fill="#5a5a5e" />
        {!cut ? <path d={`M ${rx} ${D - 56} Q ${rx + 47} ${D - 50} ${rx + 94} ${D - 56}`} stroke="#c9322b" strokeWidth={9} fill="none" />
          : <g><path d={`M ${rx} ${D - 56} q ${8 + Math.sin(t * 8) * 4} ${20 + 30 * Math.min(1, cu * 3)} ${2} ${30 + 40 * Math.min(1, cu * 3)}`} stroke="#c9322b" strokeWidth={9} fill="none" /><path d={`M ${rx + 94} ${D - 56} q ${-8 + Math.sin(t * 8 + 1) * 4} ${20 + 30 * Math.min(1, cu * 3)} ${-2} ${30 + 40 * Math.min(1, cu * 3)}`} stroke="#c9322b" strokeWidth={9} fill="none" /></g>}
        {(() => { const snip = ramp(t2, tC - 0.25, tC, EOUT); const pose: Pose = { lean: 4, head: 8 - 20 * (cut ? 1 : 0), thA: 3, shA: 1, thB: -3, shB: -3, uaA: 70 + 10 * snip + (cut ? 80 : 0), faA: 80 + (cut ? 90 : 0), uaB: cut ? 150 : 10, faB: cut ? 165 : 20, breath: 0.5 * Math.sin(t2 * 3) }; return <Figure x={rx - 40} y={D} h={100} dir={1} pose={pose} look={{ body: '#2a2c34', far: '#1c1e24', skin: '#8a5a40', hat: 'peci', hatCol: '#14121a', rim: '#ffffff', rimO: 0.4 }} />; })()}
        {/* confetti burst */}
        {cut && conf.map((c, i) => { const y = D - 260 - 200 * Math.exp(-cu * 3) + c.v * cu, x = c.x + Math.sin(t * 3 + c.ph) * 30; return <rect key={i} x={x} y={y} width={10} height={6} fill={c.c} transform={`rotate(${t * 400 + c.ph * 40} ${x} ${y})`} opacity={Math.max(0, 1 - cu / 3)} />; })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — night: the EMPTY bridge buckles and its middle span falls into the black river on "fell"; spray, dust, jolt. */
export const S11: React.FC = () => {
  const { t } = useShot();
  const tF = wordAt(11, /^fell/i, 0.68);
  const fall = ramp(t, tF, tF + 0.5, EIN);
  const imp = tF + 0.42;
  const cam: Cam = { zoom: 1.16, dx: 0, dy: 0, ox: 540, oy: 900, tx: jolt(t, tF, 6) + jolt(t, imp, 9), ty: jolt(t, imp, 12) };
  const sag = ramp(t, 0, tF, EIN);
  const flick = t < tF ? (Math.sin(t * 37) > 0.75 - 0.6 * sag ? 0.25 : 1) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <BandImg id="bridge/night" cam={cam} />
      <Live cam={cam}>
        <Water t={t} mood="night" lamps={[BR.pierL + 24, BR.pierR + 44]} lampOn={flick} />
        <Trickle t={t} o={sag * (1 - fall)} />
        <Bridge mood="night" stage="done" t={t} sag={sag} fall={fall} lampOn={flick} />
        <Splash u={(t - imp) / 1.1} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — night: the broken end of the bridge over black water; one streetlight flickers at the edge. Slow push-in. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.09 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 600, oy: 700 };
  const on = Math.sin(t * 23) > 0.6 || Math.sin(t * 5.3) > 0.9 ? 0.15 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <BandImg id="bridge/end" cam={cam} />
      <Live cam={cam}>
        {/* water ripples + bits of concrete still dropping from the broken edge */}
        {Array.from({ length: 12 }, (_, i) => { const x = ((i * 137 + t * 40) % 1400) - 60, y = 1360 + (i * 71) % 700; return <rect key={i} x={x} y={y} width={80 + (i % 4) * 30} height={4} rx={2} fill="#2a3048" opacity={0.6} />; })}
        {[0, 1, 2].map((k) => { const u = ((t * 0.7 + k / 3) % 1); return <rect key={k} x={780 + k * 12} y={980 + u * 330} width={8} height={10} fill="#3a3c46" opacity={1 - u * 0.5} />; })}
        {[0, 1].map((k) => { const u = ((t * 0.7 + k / 2 + 0.3) % 1); return <ellipse key={`r${k}`} cx={790 + k * 14} cy={1310} rx={10 + 60 * u} ry={3 + 10 * u} fill="none" stroke="#3a4060" strokeWidth={3} opacity={1 - u} />; })}
        <EdgeLamp on={on} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — an engineer with rolled blueprints is steered by a hand on his shoulder into a van; the blueprints fall into a puddle on "silenced". */
export const S13: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tS = wordAt(13, /^silenced/i, 0.75);
  const cam: Cam = { zoom: 1.04 + 0.03 * p, dx: 0, dy: 0, ox: 540, oy: 1000 };
  const G = YARD.ground, h = 700;
  const ex = 240 + 120 * Math.min(t2, tS + 0.3), walking = true;
  const ePose: Pose = { ...walkPose(t2 * 6, false, 0.6), head: t2 >= tS ? 18 : 4, uaA: 18, faA: 72 };
  const [hx, hy] = handA(ex, G, h, 1, ePose);
  // the follower right behind him, hand resting on his shoulder
  const fx = ex - 170;
  const fBase: Pose = { ...walkPose(t2 * 6 + 1.2, false, 0.6), lean: 6 };
  const shoulder: [number, number] = [ex - 6, G - h * 0.79];
  const fArm = ikArmA(fx, G, h * 1.02, 1, fBase, shoulder[0], shoulder[1]);
  const fPose: Pose = { ...fBase, ...fArm };
  // blueprints: under his arm, then slipping and falling into the puddle (ONES once released)
  const fallT = Math.max(0, t - tS), g = 9.8 * 400, yLand = G + 140;
  const yb = fallT <= 0 ? hy - 6 : Math.min(yLand, hy - 6 + 0.5 * g * fallT * fallT);
  const landed = yb >= yLand;
  const xb = fallT <= 0 ? hx : hx - 40 * Math.min(1, fallT * 3);
  void walking;
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="bridge/yard" cam={cam} />
      <Live cam={cam}>
        <Van x={700} y={G + 20} door={1} />
        <ellipse cx={ex} cy={G + 6} rx={110} ry={12} fill="#2a2018" opacity={0.3} />
        <Figure x={fx} y={G} h={h * 1.02} dir={1} pose={fPose} look={{ body: '#2a2c34', far: '#1c1e24', skin: '#7a5040', hat: 'cap', hatCol: '#14121a' }} />
        <Figure x={ex} y={G} h={h} dir={1} pose={ePose} look={{ body: '#e8e6e0', far: '#3a3d44', skin: '#a8765a', rim: '#ffffff', rimO: 0.3 }} />
        <Blueprints x={xb} y={yb} rot={fallT > 0 ? Math.min(80, fallT * 300) : -14} open={landed ? ramp(t, tS + 0.35, tS + 0.9, EOUT) : 0} s={1.4} />
        {landed && <ellipse cx={xb} cy={yLand + 6} rx={60 + 120 * Math.min(1, (t - tS - 0.3) * 2)} ry={10 + 12 * Math.min(1, (t - tS - 0.3) * 2)} fill="none" stroke="#e9eef0" strokeWidth={3} opacity={Math.max(0, 1 - (t - tS - 0.3))} />}
      </Live>
    </AbsoluteFill>
  );
};
