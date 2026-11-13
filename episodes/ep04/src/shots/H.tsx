import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/institutions_kit';
import { Side, Front, toFrame, Pal } from '../art/institutions_people';
import { HF, CheerCrowd, Megaphone, Chart, CB, BoardMath, HeKnows, letterPos, ChalkDust } from '../art/institutions_art';

const DOCTOR: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#f2f4f2', topD: '#c8ccc8', bottom: '#3a4050', headC: '#4a4a52', headD: '#2a2a30', rim: '#ffffff' };
const FOLLOWER: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#3a3a44', topD: '#26262e', bottom: '#2a2a32', headC: '#14121a', headD: '#14121a', rim: '#ffffff' };
const LOUD: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#7a3a34', topD: '#5a2a26', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#ffffff' };
const LOUDCOAT: Pal = { ...LOUD, top: '#f2f4f2', topD: '#cfd4d0' };
const NURSE: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#8ac0b0', topD: '#5e9484', bottom: '#8ac0b0', headC: '#f2f4f2', headD: '#c8ccc8', rim: '#ffffff' };
const NURSE2: Pal = { ...NURSE, skin: '#9a6650', skinD: '#6a4434', headC: '#5a7a8a', headD: '#3e5a68' };

/** simple frontal legs (trousers + shoes) for a Front figure, origin feet */
const Legs: React.FC<{ x: number; y: number; h: number; c: string; shoe?: string; spread?: number }> = ({ x, y, h, c, shoe = '#1d1a1e', spread = 0 }) => {
  const s = h / 1000;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-96 -320 L-4 -320 L${-20 - spread} -20 L${-90 - spread} -20 Z`} fill={c} />
      <path d={`M4 -320 L96 -320 L${90 + spread} -20 L${20 + spread} -20 Z`} fill={c} />
      <path d={`M${-100 - spread} -30 L${-14 - spread} -30 L${-10 - spread} 0 L${-110 - spread} 0 Z`} fill={shoe} />
      <path d={`M${14 + spread} -30 L${100 + spread} -30 L${110 + spread} 0 L${10 + spread} 0 Z`} fill={shoe} />
    </g>
  );
};

/* ============ shot 5: the doctor is walked out of the hospital, looking back; the push lands on "aside" ============ */
export const S05: React.FC = () => {
  const { t, t2, p } = useShot();
  const tA = wordAt(5, /^aside/i, 0.8);
  const push = ramp(t2, tA - 0.1, tA, EOUT);
  const stumble = bump(t2, tA, 0.5);
  const dx = 720 - 120 * t2 - 70 * push;
  const ph = t2 * 6.5;
  const fN: [number, number] = [50 * Math.sin(ph), 0], fF: [number, number] = [-50 * Math.sin(ph), 0];
  // the follower's hand rests on the doctor's UPPER ARM (below the shoulder joint), computed from the doctor's lean
  const dLean = ((6 + 14 * stumble) * Math.PI) / 180;
  const arm = { lx: 4, ly: -700 }; // doctor local (facing left), upper arm
  const ax = arm.lx * Math.cos(dLean) - (arm.ly + 500) * Math.sin(dLean), ay = -500 + arm.lx * Math.sin(dLean) + (arm.ly + 500) * Math.cos(dLean);
  const gx = dx - ax * 0.82, gy = HF.landing + ay * 0.82;
  const fX = dx + 230 - 20 * push;
  const grip: [number, number] = [(fX - gx) / 0.86 - 40 * push * 0, (gy - HF.landing) / 0.86];
  const cam: Cam = { zoom: 1.12, dx: 50 - 100 * EIO(p), dy: 0, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="institutions/hospital" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Side x={960} y={HF.landing} h={820} dir={-1} pal={FOLLOWER} head="short" male handN={[60, -480]} lean={3} bob={3 * Math.sin(t2 * 2)} rimO={0.3} />
          <Side x={dx} y={HF.landing} h={820} dir={-1} pal={DOCTOR} head="short" male face={stumble > 0.3 ? 'side' : 'back'} lean={6 + 14 * stumble} footN={fN} footF={fF} handN={[60, -470]} handF={[-30, -470]} bob={6 * Math.abs(Math.sin(ph))} rimO={0.4} />
          <Side x={fX} y={HF.landing} h={860} dir={-1} pal={FOLLOWER} head="short" male lean={4 + 6 * push} footN={[-50 * Math.sin(ph), 0]} footF={[50 * Math.sin(ph), 0]} handN={grip} handF={[40, -480]} bob={6 * Math.abs(Math.cos(ph))} rimO={0.3} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 6: low angle, the loud man on the hospital steps raises the megaphone on "place"; the crowd cheers ============ */
export const S06: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tP = wordAt(6, /^place/i, 0.75);
  const up = ramp(t2, tP - 0.18, tP, EOUT);
  const pump = 0.5 + 0.5 * Math.sin(t2 * 8);
  const mH = 900;
  const handR: [number, number] = [lerp(150, 110, up), lerp(-900, -1060, up)];
  const hr = toFrame(560, HF.landing, mH, 1, handR);
  const h = handheld(t, 0.35);
  const cam: Cam = { zoom: 1.12 + 0.08 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 650 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <BandImg id="institutions/hospital" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Legs x={560} y={HF.landing} h={mH} c={LOUD.bottom} spread={20} />
          <Front x={560} y={HF.landing} h={mH} pal={LOUD} head="short" handL={[-190, -1060 - 90 * pump]} handR={handR} tilt={-6 - 4 * up} eyes="open" mouth={0.6 + 0.4 * pump} bob={4 * pump} rimO={0.4} />
          <Megaphone x={hr[0]} y={hr[1] - 10} ang={lerp(-25, -70, up)} s={1.0} />
        </Fr>
      </Live>
      <Live k={1.15} cam={cam}><Fr><CheerCrowd t2={t2} hype={ramp(t2, tP, tP + 0.2)} /></Fr></Live>
    </AbsoluteFill>
  );
};

/* ============ shot 7: corridor, the loud man in a too-big white coat grabs a chart upside down on "hospital"; the nurses exchange looks ============ */
export const S07: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tH = wordAt(7, /^hospital/i, 0.66);
  const grab = ramp(t2, tH - 0.2, tH, EOUT);
  const look = ramp(t2, tH + 0.15, tH + 0.45, EOUT);
  const mY = 1700, mH = 1000;
  const handR: [number, number] = [lerp(170, 60, grab), lerp(-480, -660, grab)];
  const handL: [number, number] = [lerp(-170, -60, grab), lerp(-470, -650, grab)];
  const nursePass = toFrame(230, 1640, 900, 1, [lerp(240, 300, grab), -620]);
  const chartPos = grab < 0.5 ? { x: nursePass[0], y: nursePass[1], r: -6 } : { x: 540, y: mY + (-655 * mH) / 1000, r: 180 + 4 * Math.sin(t2 * 3) };
  const cam: Cam = { zoom: 1.04 + 0.06 * EIO(t / sec), dx: 0, dy: 0, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfe3dc' }}>
      <BandImg id="institutions/corridor" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Legs x={540} y={mY} h={mH} c={LOUD.bottom} />
          <Front x={540} y={mY} h={mH} pal={LOUDCOAT} head="short" handL={handL} handR={handR} tilt={8 * grab} eyes="open" mouth={0.3 + 0.5 * grab * (0.5 + 0.5 * Math.sin(t2 * 9))} bob={3 * Math.sin(t2 * 2.4)} rimO={0.2} />
          {/* the coat is far too big: long hem past the knees, sleeves flapping */}
          <path d={`M${540 - 128} ${mY - 330} L${540 + 128} ${mY - 330} L${540 + 160} ${mY - 110} L${540 - 160} ${mY - 110} Z`} fill="#f2f4f2" />
          <path d={`M540 ${mY - 330} L540 ${mY - 110}`} stroke="#cfd4d0" strokeWidth={6} />
          <path d={`M${540 + 60} ${mY - 330} L${540 + 160} ${mY - 110} L${540 + 100} ${mY - 110} Z`} fill="#cfd4d0" opacity={0.6} />
          <Chart x={chartPos.x} y={chartPos.y} rot={chartPos.r} s={1} />
          <Side x={230} y={1640} h={900} pal={NURSE} head="scarf" skirt handN={grab < 0.5 ? [240, -620] : [60, -470]} handF={[40, -480]} lean={-4 * look} headTilt={14 * (1 - look) - 8 * look} rimO={0.2} />
          <Side x={860} y={1640} h={880} dir={-1} pal={NURSE2} head="scarf" skirt handN={[80, -560]} handF={[60, -560]} lean={-4 * look} headTilt={14 * (1 - look) - 8 * look} rimO={0.2} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 8: classroom, a man erases the maths and writes "HE KNOWS" in crooked letters (last letter on "schools"); children watch ============ */
export const S08: React.FC = () => {
  const { t, t2 } = useShot();
  const tS = wordAt(8, /^schools/i, 0.73);
  const tE1 = Math.min(1.1, tS * 0.45);
  const erase = ramp(t2, 0.0, tE1, Easing.inOut(Easing.quad)) * 1.0 + 0.04;
  const n = t2 < tE1 + 0.05 ? 0 : 7 * clamp01((t2 - (tE1 + 0.05)) / (tS - (tE1 + 0.05)));
  const writing = n > 0 && n < 7;
  let hx: number, hy: number;
  if (n <= 0) { hx = CB.x1 + (CB.x2 - CB.x1) * Math.min(1, erase) - 20; hy = 640 + 160 * Math.sin(t2 * 14); }
  else { const l = letterPos(Math.floor(Math.min(6.99, n))); const f = n - Math.floor(n); hx = l.x + 50 + 30 * Math.sin(f * 9); hy = l.y - 120 + 110 * f; }
  const mH = 860, mY = 1580;
  const mX = Math.min(hx - 290, 760);
  const local: [number, number] = [(hx - mX) / (mH / 1000), (hy - mY) / (mH / 1000)];
  const TEACH: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#6a5a7a', topD: '#4a3e58', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#fffaf0' };
  const KID: Pal = { skin: '#a8714f', skinD: '#74482f', top: '#f4f4f0', topD: '#cfcfc8', bottom: '#8a2a2a', headC: '#14121a', headD: '#14121a', rim: '#fffaf0' };
  const KIDS: Pal = { ...KID, skin: '#b07a5e', headC: '#e8e0d0', headD: '#bcb4a4' };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e2dccb' }}>
      <BandImg id="institutions/classroom" cam={{ zoom: 1.03, dx: 0, dy: 0, ox: 540, oy: 900 }} />
      <Live cam={{ zoom: 1.03, dx: 0, dy: 0, ox: 540, oy: 900 }}>
        <Fr>
          <BoardMath erase={erase} />
          <HeKnows n={n} />
          <ChalkDust t={t} />
          <Side x={mX} y={mY} h={mH} pal={TEACH} head="short" male handN={local} handF={[40, -470]} lean={writing ? 4 : 2} bob={2 * Math.sin(t2 * 3)} rimO={0.3} />
          <rect x={hx - 16} y={hy - 10} width={n <= 0 ? 60 : 14} height={n <= 0 ? 30 : 14} rx={4} fill={n <= 0 ? '#5a4a3a' : '#f4f6f0'} />
        </Fr>
      </Live>
      <Live k={1.15} cam={{ zoom: 1.03, dx: 0, dy: 0, ox: 540, oy: 900 }}>
        <Fr>
          {[[150, 1700, KID], [430, 1760, KIDS], [720, 1700, KID], [980, 1780, KIDS]].map(([x, y, pal], i) => (
            <g key={i} transform={`rotate(${(Math.sin(t2 * 1.5 + i) * 4 + (hx - 540) * 0.01)} ${x} ${y})`}>
              <ellipse cx={x as number} cy={(y as number) + 200} rx={150} ry={220} fill={(pal as Pal).top} />
              <circle cx={x as number} cy={(y as number) - 40} r={84} fill={(pal as Pal).skinD} />
              <path d={`M${(x as number) - 86} ${(y as number) - 20} Q${(x as number) - 90} ${(y as number) - 130} ${x} ${(y as number) - 130} Q${(x as number) + 90} ${(y as number) - 130} ${(x as number) + 86} ${(y as number) - 20} Q${x} ${(y as number) + 10} ${(x as number) - 86} ${(y as number) - 20} Z`} fill={(pal as Pal).headC} />
            </g>
          ))}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
