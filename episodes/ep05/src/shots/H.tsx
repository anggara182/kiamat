import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/village_kit';
import { Side, toFrame, Pal } from '../art/village_people';
import { HeldBook, CM, BookStack, EC, DustBeams, DustBook, Drum, NightRoom, TableLamp, Puff } from '../art/village_art';

const decay = (t: number, at: number, k = 8, w = 40) => (t < at ? 0 : Math.exp(-(t - at) * k) * Math.sin((t - at) * w));

/* ============ shot 3: the old teacher at the window closes his book on "quiet" ============ */
export const S03: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tQ = wordAt(3, /^quiet/i, 0.66);
  const open = 1 - ramp(t2, tQ - 0.24, tQ, Easing.in(Easing.quad));
  const lower = ramp(t2, tQ, tQ + 0.4, EOUT);
  const TEACHER: Pal = { skin: '#9a6a52', skinD: '#6a4636', top: '#e2dccc', topD: '#b4ae9e', bottom: '#4a4652', headC: '#bcb6aa', headD: '#8a8478', rim: '#fff4dc' };
  const X = 420, Y = 1760, Hh = 1000;
  const hn: [number, number] = [190, -660 + 60 * lower];
  const b = toFrame(X, Y, Hh, 1, hn);
  const head = toFrame(X, Y, Hh, 1, [22, -930]);
  const cam: Cam = { zoom: 1.04 + 0.08 * EIO(t / sec), dx: 0, dy: 0, ox: 560, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#d8cdb8' }}>
      <BandImg id="village/room" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <DustBeams t={t} x0={620} />
          <Side x={X} y={Y} h={Hh} pal={TEACHER} head="peci" male lean={4 - 3 * lower} headTilt={-6 * lower + 6 * (1 - lower)} handN={hn} handF={[hn[0] - 20, hn[1] - 10]} bob={2 * Math.sin(t2 * 1.8)} rimO={0.6} />
          <HeldBook x={b[0] - 30} y={b[1] - 6} open={open} s={1.7} />
          <g fill="none" stroke="#2a2420" strokeWidth={4}><circle cx={head[0] + 34} cy={head[1] - 4} r={14} /><path d={`M${head[0] + 20} ${head[1] - 6} L${head[0] - 10} ${head[1] - 10}`} /></g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 4: a sparse funeral; a mourner places the last book on the stack on "died" ============ */
export const S04: React.FC = () => {
  const { t, t2 } = useShot();
  const tD = wordAt(4, /^died/i, 0.62);
  const SX = 800, SY = 1262;
  const bend = ramp(t2, 0, tD - 0.1, EIO) * (1 - ramp(t2, tD + 0.2, tD + 0.7));
  const placed = t2 >= tD;
  const MX = 960, MY = 1290, MH = 700;
  const top = SY - 5 * 22;
  const handLocal: [number, number] = placed ? [lerp(240, 120, ramp(t2, tD, tD + 0.5)), -560] : [lerp(150, (MX - SX) / (MH / 1000), bend), lerp(-640, (top - 10 - MY) / (MH / 1000), bend)];
  const hand = toFrame(MX, MY, MH, -1, handLocal);
  const GREY: Pal = { skin: '#9a6a52', skinD: '#6a4636', top: '#3a3a44', topD: '#26262e', bottom: '#2e2e36', headC: '#14121a', headD: '#14121a', rim: '#ffffff' };
  const G2: Pal = { ...GREY, top: '#e8e4da', topD: '#bcb8ae', headC: '#e8e4da', headD: '#bcb8ae' };
  const G3: Pal = { ...GREY, top: '#4a4a3a', topD: '#30302a', headC: '#2a2a32', headD: '#1a1a20' };
  const breathe = (i: number) => 3 * Math.sin(t2 * 2 + i);
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e0d4' }}>
      <BandImg id="village/cemetery" cam={{ zoom: 1.02 + 0.02 * t / 2, dx: 0, dy: 0, ox: 540, oy: 1000 }} />
      <Live cam={{ zoom: 1.02 + 0.02 * t / 2, dx: 0, dy: 0, ox: 540, oy: 1000 }}>
        <Fr>
          <Side x={640} y={1150} h={560} dir={-1} pal={G3} head="peci" male bob={breathe(1)} headTilt={10} rimO={0.2} />
          <Side x={250} y={1300} h={680} pal={GREY} head="peci" male bob={breathe(2)} headTilt={12} handN={[40, -480]} rimO={0.2} />
          <Side x={380} y={1310} h={640} pal={G2} head="scarf" skirt bob={breathe(3)} headTilt={14} handN={[90, -560]} handF={[80, -580]} rimO={0.2} />
          <BookStack x={SX} y={SY} n={placed ? 6 : 5} />
          <Side x={MX} y={MY} h={MH} dir={-1} pal={GREY} head="short" male lean={6 + 34 * bend} handN={handLocal} handF={[60, -500]} headTilt={10} rimO={0.2} />
          {!placed && <g transform={`translate(${hand[0]} ${hand[1] + 10}) rotate(-4)`}><rect x={-60} y={-12} width={120} height={22} fill="#4a6a4a" /><rect x={-56} y={-9} width={112} height={4} fill="#f4efe2" opacity={0.7} /></g>}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 5: the empty classroom; a piece of chalk rolls off the ledge and hits the floor on "place" ============ */
export const S05: React.FC = () => {
  const { t, sec } = useShot();
  const tP = wordAt(5, /^place/i, 0.65);
  const tFall = tP - 0.34;
  let cx: number, cy: number, rot: number;
  if (t < tFall) { const u = ramp(t, 0.1, tFall, Easing.in(Easing.quad)); cx = 780 + 130 * u; cy = EC.ledge - 6; rot = u * 360; }
  else if (t < tP) { const u = (t - tFall) / (tP - tFall); cx = 910 + 30 * u; cy = EC.ledge - 6 + (EC.floor - 8 - EC.ledge) * u * u; rot = 360 + 300 * u; }
  else { const u = t - tP; cx = 940 + 60 * Math.min(1, u * 2); cy = EC.floor - 8 - 30 * Math.abs(decay(t, tP, 7, 16)); rot = 660 + 200 * Math.min(1, u); }
  const cam: Cam = { zoom: 1.02 + 0.07 * EIO(t / sec), dx: 0, dy: 0, ox: 700, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e2d8c2' }}>
      <BandImg id="village/classroom" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <DustBeams t={t} />
          <g transform={`translate(${cx} ${cy}) rotate(${rot})`}><rect x={-40} y={-12} width={80} height={24} rx={10} fill="#f4f0e4" /></g>
          {t > tP && <Puff id="vcHit" x={940} y={EC.floor - 14} r={20 + 50 * Math.min(1, (t - tP) * 2)} c="#ffffff" o={0.6 * Math.max(0, 1 - (t - tP) * 2)} />}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 6: children clap and chant in a circle around a boy with a drum; a clap lands on "letters"; a closed book in the dust ============ */
export const S06: React.FC = () => {
  const { t, t2 } = useShot();
  const tL = wordAt(6, /^letters/i, 0.71);
  const together = 0.5 + 0.5 * Math.cos((2 * Math.PI * (t2 - tL)) / 0.42);
  const cols = ['#c96b4a', '#4a7aa8', '#e0b040', '#6a9a5a', '#a85a8a', '#d8d0c0', '#8a5a3a', '#4a8a8a'];
  const kids = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.3;
    return { i, x: 540 + Math.cos(a) * 340, y: 1150 + Math.sin(a) * 100, h: 470 + Math.sin(a) * 50 };
  }).sort((p, q) => p.y - q.y);
  const h = handheld(t, 0.3);
  const cam: Cam = { zoom: 1.06, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 1000 };
  const kidPal = (i: number): Pal => ({ skin: i % 2 ? '#a8714f' : '#8a5a44', skinD: '#5e3b2e', top: cols[i], topD: cols[i], bottom: '#3a3a4a', headC: i % 3 === 0 ? '#e8e0d0' : '#14121a', headD: '#14121a', rim: '#ffffff' });
  const kid = (k: { i: number; x: number; y: number; h: number }) => {
    const dir = (k.x < 540 ? 1 : -1) as 1 | -1;
    const hop = Math.abs(Math.sin(t2 * 7.5 + k.i));
    return <Side key={k.i} x={k.x} y={k.y} h={k.h} dir={dir} pal={kidPal(k.i)} head={k.i % 3 === 0 ? 'scarf' : k.i % 2 ? 'bob' : 'short'} skirt={k.i % 3 === 0} male={k.i % 2 === 0} handN={[110 + 60 * (1 - together), -640 - 40 * together]} handF={[110 - 60 * (1 - together), -650 - 40 * together]} bob={8 * hop} lean={4 * Math.sin(t2 * 3.7 + k.i)} rimO={0.3} />;
  };
  const hit = Math.abs(Math.sin(t2 * 7.5));
  const LEAD: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#2a2a32', topD: '#1a1a22', bottom: '#5a4a3a', headC: '#14121a', headD: '#14121a', rim: '#ffffff' };
  const dr = toFrame(540, 1160, 640, 1, [150, -470]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe8d8' }}>
      <BandImg id="village/yard" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <ellipse cx={540} cy={1180} rx={420} ry={120} fill="#b89c70" opacity={0.5} />
          {kids.filter((k) => k.y < 1150).map(kid)}
          <Side x={540} y={1160} h={640} pal={LEAD} head="short" male handN={[160, -560 + 80 * hit]} handF={[130, -520]} lean={6} bob={6 * hit} rimO={0.3} />
          <Drum x={dr[0] + 10} y={dr[1] + 20} hit={hit} />
          {kids.filter((k) => k.y >= 1150).map(kid)}
          {Array.from({ length: 8 }, (_, i) => { const u = (t * 0.4 + i / 8) % 1; return <Puff key={i} id={`vyD${i}`} x={300 + i * 70} y={1220 - u * 60} r={20 + 30 * u} c="#e8d8b8" o={0.3 * (1 - u)} />; })}
        </Fr>
      </Live>
      <Live k={1.2} cam={cam}><Fr><DustBook x={230} y={1330} /></Fr></Live>
    </AbsoluteFill>
  );
};

/* ============ shot 7: night, a girl holds up a book to her father; he gently turns off the lamp on "answer" ============ */
export const S07: React.FC = () => {
  const { t, t2 } = useShot();
  const tA = wordAt(7, /^answer/i, 0.78);
  const reach = ramp(t2, tA - 0.45, tA - 0.04, EIO);
  const off = t >= tA;
  const lampOn = off ? Math.max(0, 1 - (t - tA) * 12) : 1;
  const FA: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#6a7a6a', topD: '#4a5a4a', bottom: '#3a3a44', headC: '#14121a', headD: '#14121a', rim: '#ffcf86' };
  const GI: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#e8a0b0', topD: '#b87080', bottom: '#e8a0b0', headC: '#14121a', headD: '#14121a', rim: '#ffcf86' };
  const FX = 760, FH = 860, FY = 1200 + 0.47 * FH;
  const sw: [number, number] = [(FX - 990) / (FH / 1000), (1110 - FY) / (FH / 1000)];
  const handN: [number, number] = [lerp(120, sw[0], reach), lerp(-520, sw[1], reach)];
  const lift = 0.5 + 0.5 * Math.sin(t2 * 2.2);
  const gb = toFrame(420, 1560, 480, 1, [160, -840 + 20 * lift]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1420' }}>
      <Live cam={{ zoom: 1.28 + 0.03 * t / 2.5, dx: 0, dy: 0, ox: 640, oy: 1150 }}>
        <Fr>
          <NightRoom />
          <TableLamp on={lampOn} />
          <Side x={FX} y={FY} h={FH} dir={-1} pal={FA} head="short" male sit face={reach > 0.5 ? 'back' : 'side'} lean={2 - 6 * reach} handN={handN} handF={[120, -500]} headTilt={8} bob={2 * Math.sin(t2 * 2)} rimO={0.6} />
          <Side x={420} y={1560} h={480} pal={GI} head="bob" skirt handN={[200, -740 + 20 * lift]} handF={[290, -750 + 20 * lift]} lean={-4} bob={6 * lift * (1 - reach * 0.5)} rimO={0.6} />
          <g transform={`translate(${gb[0] + 40} ${gb[1] + 50}) rotate(-6) scale(0.85)`}>
            <path d="M-110 -70 L0 -60 L0 70 L-110 60 Z" fill="#f4efe2" /><path d="M0 -60 L110 -70 L110 60 L0 70 Z" fill="#ebe4d2" />
            {[-40, -15, 10, 35].map((y) => <path key={y} d={`M-95 ${y} L-15 ${y + 4} M15 ${y + 4} L95 ${y}`} stroke="#8a8478" strokeWidth={4} />)}
            <path d="M-110 60 L0 70 L110 60 L110 72 L0 82 L-110 72 Z" fill="#3a5a8a" />
          </g>
          <rect x={-200} y={-300} width={1500} height={2600} fill="#0a1024" opacity={0.72 * (1 - lampOn)} />
          <path d="M160 460 L460 460 L620 1500 L60 1500 Z" fill="#9fb8e0" opacity={0.08 * (1 - lampOn)} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
