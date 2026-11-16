import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/homes_kit';
import { Side, Front, toFrame, Pal } from '../art/homes_people';
import { LongTable, Flash, Fire, BurningTreaty, AshFlakes, DropHand, DOOR, Walker, Loaf, CW, CeilingFan } from '../art/homes_art';

const leanPt = (X: number, Y: number, H: number, dir: 1 | -1, lean: number, p: [number, number]) => {
  const a = (lean * Math.PI) / 180, dx = p[0], dy = p[1] + 500;
  return toFrame(X, Y, H, dir, [dx * Math.cos(a) - dy * Math.sin(a), -500 + dx * Math.sin(a) + dy * Math.cos(a)]);
};
const loc = (X: number, Y: number, H: number, dir: 1 | -1, fx: number, fy: number): [number, number] => [((fx - X) * dir) / (H / 1000), (fy - Y) / (H / 1000)];

/* ============ shot 3: the treaty hall; two leaders lean across the table, the hands meet on "handshake"; camera flashes ============ */
export const S03: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tH = wordAt(3, /^handshake/i, 0.45);
  const reach = ramp(t2, 0, tH, EOUT);
  const pump = t2 > tH ? 10 * Math.sin((t2 - tH) * 14) : 0;
  const gx = 540, gy = 1070 + pump;
  const A: Pal = { skin: '#9a6a52', skinD: '#6a4636', top: '#2e3442', topD: '#1e2430', bottom: '#2a2a32', headC: '#14121a', headD: '#14121a', rim: '#ffffff' };
  const B: Pal = { skin: '#c48a6a', skinD: '#8a5a44', top: '#4a4640', topD: '#34302c', bottom: '#2a2a32', headC: '#6a5040', headD: '#4a3428', rim: '#ffffff' };
  const A2: Pal = { ...A, skin: '#8a5a44', top: '#3a4050' };
  const B2: Pal = { ...B, skin: '#b07a5e', top: '#55504a', headC: '#c9c2b2' };
  const LX = 300, RX = 780, Y = 1700, Hh = 920;
  const lh = loc(LX, Y, Hh, 1, lerp(470, gx - 14, reach), lerp(1150, gy, reach));
  const rh = loc(RX, Y, Hh, -1, lerp(610, gx + 14, reach), lerp(1150, gy, reach));
  const flashes = [tH, tH + 0.18, tH + 0.5];
  const fa = (i: number) => { const d = t - flashes[i]; return d < 0 || d > 0.12 ? 0 : 1 - d / 0.12; };
  const cam: Cam = { zoom: 1.22 + 0.04 * EIO(t / sec), dx: 0, dy: 0, ox: 540, oy: 1120 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#f6efe0' }}>
      <BandImg id="homes/hall" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Side x={60} y={Y} h={880} pal={A2} head="short" male bob={2 * Math.sin(t2 * 2)} headTilt={-4} rimO={0.3} />
          <Side x={170} y={Y} h={900} pal={A} head="short" male bob={2 * Math.sin(t2 * 2.2)} rimO={0.3} />
          <Side x={1020} y={Y} h={890} dir={-1} pal={B2} head="short" male bob={2 * Math.sin(t2 * 2.1)} rimO={0.3} />
          <Side x={910} y={Y} h={900} dir={-1} pal={B} head="short" male bob={2 * Math.sin(t2 * 1.9)} rimO={0.3} />
          <Side x={LX} y={Y} h={Hh} pal={A} head="short" male lean={6 + 13 * reach} handN={lh} handF={[60, -480]} rimO={0.4} />
          <Side x={RX} y={Y} h={Hh} dir={-1} pal={B} head="short" male lean={6 + 13 * reach} handN={rh} handF={[60, -480]} rimO={0.4} />
          <LongTable />
          <Flash id="hf0" x={60} y={1560} a={fa(0)} />
          <Flash id="hf1" x={1020} y={1520} a={fa(1)} />
          <Flash id="hf2" x={480} y={1620} a={fa(2)} />
          <rect x={-200} y={-300} width={1500} height={2600} fill="#ffffff" opacity={0.12 * Math.max(fa(0), fa(1), fa(2))} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 8: a hand drops the signed treaty into the fire; it curls and blackens, the signature last; ash on "ash" ============ */
export const S08: React.FC = () => {
  const { t, t2 } = useShot();
  const tA = wordAt(8, /^ash/i, 0.72);
  const open = ramp(t2, 0.12, 0.24, EOUT);
  const handOut = ramp(t2, 0.3, 0.8, EIO);
  const fall = Easing.in(Easing.quad)(clamp01((t - 0.18) / 0.32));
  const px = lerp(620, 560, fall), py = lerp(820, 1150, fall), pr = lerp(14, -8, fall);
  const burn = Easing.in(Easing.quad)(clamp01((t - 0.45) / (tA - 0.5)));
  const ash = clamp01((t - tA) / 0.22);
  return (
    <AbsoluteFill style={{ backgroundColor: '#120a08' }}>
      <BandImg id="homes/hearth" cam={{ zoom: 1.0, dx: 0, dy: 0, ox: 540, oy: 1000 }} />
      <Live cam={{ zoom: 1.0, dx: 0, dy: 0, ox: 540, oy: 1000 }}>
        <Fr>
          <Fire t={t} boost={bump(t, tA - 0.4, 0.6)} />
          <BurningTreaty x={px} y={py} rot={pr} burn={burn} curl={0.3 * fall + 0.7 * burn} ash={ash} t={t} />
          <AshFlakes x={px} y={py} a={Math.max(ash, 0.3 * burn)} t={t} />
          {handOut < 1 && <g transform={`translate(${200 * handOut} ${-500 * handOut})`}><DropHand x={700} y={760} open={open} /></g>}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 11: dawn doorway; the mother presses a loaf into her son's hands, holds his face, lets go on "shave"; men walk past ============ */
export const S11: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tF = wordAt(11, /^farmers/i, 0.44);
  const tS = wordAt(11, /^shave/i, 0.87);
  const give = ramp(t2, 0, 1.6, EIO);
  const face = ramp(t2, 1.9, 2.5, EIO) * (1 - ramp(t2, tS - 0.04, tS + 0.3, EOUT));
  const MO: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#6a5a7a', topD: '#4a3e58', bottom: '#4a3e58', headC: '#2a3a4a', headD: '#1a2632', rim: '#fff0d0' };
  const SO: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#5a6a4a', topD: '#3e4a32', bottom: '#3a3a44', headC: '#14121a', headD: '#14121a', rim: '#fff0d0' };
  const MX = 330, MH = 880, SX = 650, SH = 960, SY = DOOR.step + 20;
  const back = ramp(t2, tS + 0.1, sec, EOUT);
  const sX = SX + 30 * back;
  const sLean = 4 + 4 * face - 3 * back;
  const sh = leanPt(sX, SY, SH, -1, sLean, [22, -930]);
  // loaf: from her hands into his, then held at his chest
  const loafX = lerp(470, 520, give), loafY = lerp(1000, 1040, give);
  const sHandsOnLoaf = loc(sX, SY, SH, -1, loafX + 30, loafY);
  const mGive: [number, number] = [((loafX - 40) - MX) / (MH / 1000), (loafY - DOOR.step) / (MH / 1000)];
  const mFace: [number, number] = [((sh[0] + 10) - MX) / (MH / 1000), (sh[1] + 30 - DOOR.step) / (MH / 1000)];
  const mFaceF: [number, number] = [((sh[0] + 40) - MX) / (MH / 1000), (sh[1] + 10 - DOOR.step) / (MH / 1000)];
  const mDown: [number, number] = [120, -700];
  const mHN: [number, number] = face > 0 ? [lerp(mGive[0], mFace[0], face), lerp(mGive[1], mFace[1], face)] : give < 1 ? mGive : mDown;
  const mHF: [number, number] = face > 0 ? [lerp(mGive[0] - 20, mFaceF[0], face), lerp(mGive[1] - 20, mFaceF[1], face)] : give < 1 ? [mGive[0] - 20, mGive[1] - 20] : [100, -720];
  const mHNf: [number, number] = t2 > tS ? [lerp(mHN[0], mDown[0], ramp(t2, tS, tS + 0.4)), lerp(mHN[1], mDown[1], ramp(t2, tS, tS + 0.4))] : mHN;
  const h = handheld(t, 0.12);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 500, oy: 1000 };
  const walkers = [
    { x0: 1250, v: -90, s: 0.62, d: -1 as const, k: 'man' as const, t0: 0 },
    { x0: 520, v: 80, s: 0.58, d: 1 as const, k: 'man' as const, t0: 0 },
    { x0: 1250, v: -110, s: 0.66, d: -1 as const, k: 'farmer' as const, t0: tF - 3.2 },
    { x0: 480, v: 70, s: 0.6, d: 1 as const, k: 'man' as const, t0: 3.5 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#f2d2a8' }}>
      <BandImg id="homes/doorway" cam={cam} />
      <Live cam={cam}>
        <Fr>
          {walkers.map((w, i) => {
            const tt = t2 - w.t0;
            if (tt < 0) return null;
            return <Walker key={i} x={w.x0 + w.v * tt} y={1260} s={w.s} ph={tt * 8} dir={w.d} kind={w.k} />;
          })}
          <Side x={sX} y={SY} h={SH} dir={-1} pal={SO} head="short" male lean={sLean} handN={sHandsOnLoaf} handF={[sHandsOnLoaf[0] + 30, sHandsOnLoaf[1] + 10]} headTilt={6 * face} bob={2 * Math.sin(t2 * 2)} rimO={0.6} />
          <rect x={sX + 40} y={SY - 820} width={110} height={300} rx={30} fill="#6a5a3a" />
          <path d={`M${sX + 60} ${SY - 800} L${sX - 10} ${SY - 760}`} stroke="#4a3e28" strokeWidth={10} />
          <Loaf x={loafX} y={loafY} rot={-6} />
          <Side x={MX} y={DOOR.step} h={MH} pal={MO} head="scarf" skirt lean={4 + 6 * face} handN={mHNf} handF={mHF} headTilt={4 * face} bob={2 * Math.sin(t2 * 1.8)} rimO={0.6} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 12: the empty classroom; the fan winds down to silence ("silent"); the camera drifts to the window where a mother grips the curtain on "window" ============ */
export const S12: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tSi = wordAt(12, /^silent/i, 0.37);
  const tWi = wordAt(12, /^window/i, 0.83);
  const w0 = 540;
  const ang = t < tSi ? w0 * (t - (t * t) / (2 * tSi)) : (w0 * tSi) / 2;
  const drift = ramp(t, 1.2, sec, EIO);
  const grip = ramp(t2, tWi - 0.1, tWi + 0.08, EOUT);
  const MO: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#7a4a4a', topD: '#5a3434', bottom: '#5a3434', headC: '#3a3a4a', headD: '#26262e', rim: '#ffffff' };
  const mid = { x: (CW.mw.x1 + CW.mw.x2) / 2, y: 650 };
  const cam: Cam = { zoom: 1.0 + 1.0 * drift, dx: 0, dy: 0, ox: mid.x, oy: mid.y };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e0d4' }}>
      <BandImg id="homes/classroom" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <defs><clipPath id="hcMW"><rect x={CW.mw.x1} y={CW.mw.y1} width={CW.mw.x2 - CW.mw.x1} height={CW.mw.y2 - CW.mw.y1} /></clipPath></defs>
          <g clipPath="url(#hcMW)">
            <Front x={mid.x - 10} y={1080} h={520} pal={MO} head="scarf" handL={[-150, -560]} handR={[120 + 10 * grip, -860 + 20 * grip]} tilt={-6} eyes="open" bob={2 * Math.sin(t2 * 1.6)} rimO={0.3} />
            <path d={`M${CW.mw.x2 - 40 - 10 * grip} ${CW.mw.y1} Q${CW.mw.x2 - 30 - 20 * grip} ${CW.mw.y1 + 120} ${CW.mw.x2 - 44 - 12 * grip} ${CW.mw.y2} L${CW.mw.x2} ${CW.mw.y2} L${CW.mw.x2} ${CW.mw.y1} Z`} fill="#e8dcc8" />
            <path d={`M${CW.mw.x2 - 30} ${CW.mw.y1 + 40} Q${CW.mw.x2 - 40 - 14 * grip} ${CW.mw.y1 + 120} ${CW.mw.x2 - 30} ${CW.mw.y1 + 220}`} stroke="#bcae94" strokeWidth={4} fill="none" />
            <ellipse cx={CW.mw.x2 - 38 - 12 * grip} cy={CW.mw.y1 + 128} rx={12} ry={16} fill={MO.skin} />
          </g>
          <CeilingFan ang={ang} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
