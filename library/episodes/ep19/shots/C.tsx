import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, BandImg, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { scrawl, partial, full, Pencil, DollStick, Fingers, Clock } from '../art/close_props';

const FW = 1080, FH = 1920;
const CANDLE = '#ffc46b';
const INK = '#2b2620';
const L: React.FC<{ cam: Cam; k?: number; children: React.ReactNode }> = ({ cam, k = 1, children }) => (
  <Live cam={cam} k={k} w={FW} h={FH}>{children}</Live>
);
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));
const flick = (t: number) => 0.85 + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1 + 1) + 0.03 * Math.sin(t * 23.7);

/** paper sheet (frame space) with candle-lit gradient */
const Paper: React.FC<{ id: string; x: number; y: number; w: number; h: number; rot: number; cool?: boolean; children?: React.ReactNode }> = ({ id, x, y, w, h, rot, cool, children }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <defs>
      <radialGradient id={`${id}pp`} cx="0.35" cy="0.3" r="0.9">
        <stop offset="0" stopColor={cool ? '#e8edf2' : '#f4e9cf'} />
        <stop offset="0.6" stopColor={cool ? '#a9b4c2' : '#c7b48e'} />
        <stop offset="1" stopColor={cool ? '#4a5462' : '#6b5638'} />
      </radialGradient>
    </defs>
    <path d={`M${-w / 2 + 14},${-h / 2 + 10} L${w / 2},${-h / 2} L${w / 2 - 8},${h / 2} L${-w / 2},${h / 2 - 6} Z`} fill="#000" opacity={0.45} transform="translate(14,18)" />
    <path d={`M${-w / 2 + 14},${-h / 2 + 10} L${w / 2},${-h / 2} L${w / 2 - 8},${h / 2} L${-w / 2},${h / 2 - 6} Z`} fill={`url(#${id}pp)`} />
    {children}
  </g>
);

/** shot 5 — the tied pencil under the doll starts dragging a shaky line. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const heavy = ramp(p, wp(5, /heavy/, 0.3, sec) - 0.05, wp(5, /heavy/, 0.3, sec) + 0.12, EIO);
  const go = ramp(p, wp(5, /pencil/, 0.6, sec), 1, (x) => x);
  const cam: Cam = { zoom: 1.02 + 0.02 * p, dx: 0, dy: 0, ox: 540, oy: 1000 };
  const r = rng(55);
  const line: [number, number][] = Array.from({ length: 40 }, (_, i) => [-120 + i * 13 + (r() - 0.5) * 6, 40 + Math.sin(i * 0.45) * 30 + Math.sin(i * 1.7) * 6 + (r() - 0.5) * 8 + i * 3]);
  const pr = partial([line], go);
  const tremble = (1 - go) * heavy * 2.5 + go * 4;
  const tx = pr.tip[0] + Math.sin(t * 31) * tremble, ty = pr.tip[1] + Math.cos(t * 27) * tremble;
  const L0 = flick(t);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <BandImg id="close/floor" cam={cam} k={0.6} />
      <L cam={cam} k={0.85}>
        <defs><linearGradient id="c5fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07080a" stopOpacity={0} /><stop offset="1" stopColor="#07080a" stopOpacity={0.6} /></linearGradient></defs>
        <circle cx={260} cy={260} r={600} fill={CANDLE} opacity={0.06 * L0} />
        <Paper id="c5" x={560} y={1010} w={820} h={1040} rot={-4}>
          {/* faint old marks on the paper */}
          <path d="M-300,-380 L-120,-386 M-300,-330 L-60,-334" stroke="#7d6c52" strokeWidth={4} opacity={0.35} />
          <rect x={-410} y={80} width={820} height={440} fill="url(#c5fade)" />
          <path d={pr.d} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Paper>
      </L>
      <L cam={cam} k={1}>
        <g transform={`translate(560,1010) rotate(-4)`}>
          <ellipse cx={tx + 40} cy={ty + 10} rx={60} ry={18} fill="#000" opacity={0.25} />
          <DollStick x={tx} y={ty + heavy * 6} rot={-10 + Math.sin(t * 1.4) * 0.6} t={t} rim={CANDLE} />
        </g>
        {/* hands on the doll, fingertips only */}
        <g transform="translate(0,-40) scale(0.8)"><Fingers x={470} y={250 + heavy * 14} dir={1} rot={14} rim={CANDLE} /></g>
        <g transform="translate(216,-20) scale(0.8)"><Fingers x={600} y={300 + heavy * 14} dir={-1} rot={-12} rim={CANDLE} /></g>
      </L>
      <L cam={cam} k={1.2}>
        {/* dark knee/foreground edge */}
        <path d="M-60,1500 C120,1460 260,1560 300,1980 L-60,1980 Z" fill="#0b0806" />
        <path d="M1140,1250 C980,1300 900,1500 920,1980 L1140,1980 Z" fill="#0b0806" />
        <path d="M1140,1250 C980,1300 900,1500 920,1980" stroke={CANDLE} strokeWidth={4} fill="none" opacity={0.25} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 6 — the paper covered in PLAY, over and over; the last one pressed darkest. */
const S6ROWS = (() => {
  const r = rng(606);
  return Array.from({ length: 11 }, (_, i) => ({
    x: -360 + r() * 120, y: -560 + i * 92 + (r() - 0.5) * 20, s: 62 + r() * 26, rot: (r() - 0.5) * 7, seed: 600 + i,
  }));
})();
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const push = ramp(p, 0, 1, EIO);
  const last = ramp(p, wp(6, /PLAY/, 0.82, sec) - 0.12, wp(6, /PLAY/, 0.82, sec) + 0.06, (x) => x);
  const h = handheld(t, 0.08);
  const cam: Cam = { zoom: 1.04 + 0.08 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 960 };
  const big = scrawl('PLAY', -250, -110, 170, 690, 0.12, 0.07);
  const pb = partial(big, last);
  const L0 = flick(t);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <BandImg id="close/floor" cam={cam} k={0.6} />
      <L cam={cam} k={0.9}>
        <Paper id="c6" x={560} y={900} w={940} h={1300} rot={3}>
          {S6ROWS.map((row, i) => (
            <g key={i} transform={`rotate(${row.rot})`}>
              <path d={full(scrawl('PLAY  PLAY', row.x, row.y, row.s, row.seed))} stroke={INK} strokeWidth={4 + (i % 3)} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.42 + (i % 4) * 0.08} />
            </g>
          ))}
          {/* warm pool of light on the centre word */}
          <ellipse cx={-30} cy={-20} rx={430} ry={260} fill={CANDLE} opacity={0.14 * L0} />
          <path d={full(big)} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
          <path d={pb.d} stroke="#1a1612" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {last > 0 && last < 1 && <Pencil x={pb.tip[0]} y={pb.tip[1]} rot={28} s={0.9} rim={CANDLE} />}
        </Paper>
      </L>
      <L cam={cam} k={1.15}>
        <path d="M-80,-60 L360,-60 C260,80 120,160 -80,200 Z" fill="#0b0806" />
        <path d="M1160,1380 C1000,1420 880,1640 900,2000 L1160,2000 Z" fill="#0b0806" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 8 — the wall clock ticks over to 12:01. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const at = wp(8, /Twelve/, 0.7, sec);
  const tick = Math.floor(t);
  const flip = p >= at ? 1 : 0;
  const s = flip ? (Math.floor((p - at) * sec)) % 60 : 60 - Math.ceil((at - p) * sec);
  const mjump = ramp(p, at - 0.01, at + 0.01, (x) => x);
  const cam: Cam = { zoom: 1.03 + 0.01 * p, dx: 0, dy: 0, ox: 540, oy: 760 };
  const L0 = flick(t);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <BandImg id="close/wall" cam={cam} k={0.6} />
      <L cam={cam} k={0.9}>
        <defs>
          <radialGradient id="c8g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={CANDLE} stopOpacity={0.45} /><stop offset="1" stopColor={CANDLE} stopOpacity={0} /></radialGradient>
        </defs>
        <circle cx={540} cy={820} r={640 * L0} fill="url(#c8g)" />
        {/* hanging nail + string */}
        <path d="M540,330 L420,440 M540,330 L660,440" stroke="#1a130c" strokeWidth={4} />
        <circle cx={540} cy={330} r={9} fill="#1a130c" />
        <Clock x={540} y={790} r={300} h={0} m={mjump} sec={(s + 60) % 60 + (tick % 1)} light={L0} />
      </L>
      <L cam={cam} k={1.2}>
        {/* friend's head + shoulder silhouette, bottom left, looking up */}
        <path d="M-80,2000 L-80,1350 C40,1300 150,1310 210,1260 C190,1170 200,1080 260,1040 C340,990 440,1020 470,1110 C490,1180 470,1250 430,1290 C520,1330 600,1420 640,1560 L700,2000 Z" fill="#0a0806" />
        <path d="M260,1040 C340,990 440,1020 470,1110 C490,1180 470,1250 430,1290" stroke={CANDLE} strokeWidth={5} fill="none" opacity={0.45} />
        {/* messy hair mass + ear */}
        <path d="M232,1080 C230,1010 300,960 380,975 C450,985 500,1040 490,1120 C470,1080 430,1060 400,1070 C360,1040 300,1050 232,1080 Z" fill="#0a0806" />
        <path d="M232,1080 C230,1010 300,960 380,975 C450,985 500,1040 490,1120" stroke={CANDLE} strokeWidth={4} fill="none" opacity={0.35} />
        <ellipse cx={226} cy={1170} rx={18} ry={30} fill="#0a0806" />
        {/* hair strands */}
        {[0, 1, 2].map((i) => <path key={i} d={`M${280 + i * 50},${1030 - i * 4} C${300 + i * 50},${1000} ${360 + i * 40},${990} ${420 + i * 20},${1030 + i * 10}`} stroke="#2a2016" strokeWidth={4} fill="none" />)}
      </L>
    </AbsoluteFill>
  );
};

/** shot 9 — the pencil presses hard, writing NO, and the paper tears. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const w0 = wp(9, /pencil/, 0.6, sec) - 0.06, w1 = wp(9, /NO/, 0.88, sec) + 0.04;
  const q = ramp(p, w0, w1, (x) => x);
  const tear = ramp(p, w1 - 0.02, Math.min(1, w1 + 0.1), EIO);
  const strokes = scrawl('NO', -230, -250, 370, 909, 0.1, 0.04);
  const pr = partial(strokes, q);
  const shake = 1.5 + (q > 0 && q < 1 ? 5 : 0);
  const tx = pr.tip[0] + Math.sin(t * 37) * shake, ty = pr.tip[1] + Math.cos(t * 29) * shake;
  const cam: Cam = { zoom: 1.04, dx: 0, dy: 0, ox: 540, oy: 900 };
  const L0 = flick(t);
  const rip: [number, number][] = [[200, 110], [190, 155], [208, 200], [180, 250], [200, 295], [172, 340], [192, 380], [176, 410]];
  const ripL = rip.map(([x, y], i) => `${i ? 'L' : 'M'}${x - 26 * tear * (i / 7 + 0.2)},${y}`).join('');
  const ripR = rip.slice().reverse().map(([x, y], i) => `L${x + 26 * tear * ((7 - i) / 7 + 0.2)},${y}`).join('');
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <BandImg id="close/floor" cam={cam} k={0.6} />
      <L cam={cam} k={0.9}>
        <Paper id="c9" x={560} y={930} w={900} h={1080} rot={-2}>
          <ellipse cx={0} cy={-40} rx={420} ry={360} fill={CANDLE} opacity={0.12 * L0} />
          {/* pressed groove under the ink */}
          <path d={pr.d} stroke="#000" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.18} transform="translate(4,5)" />
          <path d={pr.d} stroke="#16120e" strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* tear running down from the O */}
          {tear > 0 && (
            <g>
              <path d={`${ripL}${ripR}Z`} fill="#07080a" />
              <path d={ripL} stroke="#fff3d6" strokeWidth={3} fill="none" opacity={0.7 * tear} />
            </g>
          )}
        </Paper>
      </L>
      <L cam={cam} k={1}>
        <g transform="translate(560,930) rotate(-2)">
          <DollStick x={tx} y={ty} rot={-14 + Math.sin(t * 2.1) * 1.5} t={t} rim={CANDLE} />
        </g>
        <Fingers x={430} y={200} dir={1} rot={18} rim={CANDLE} />
        <Fingers x={720} y={240} dir={-1} rot={-16} rim={CANDLE} />
      </L>
      <L cam={cam} k={1.2}>
        <path d="M-60,1420 C120,1400 240,1560 260,1980 L-60,1980 Z" fill="#0b0806" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 12 — a school notebook under a cold desk lamp, one scrawled PLAY at the bottom. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const push = ramp(p, 0, 1, EIO);
  const reveal = ramp(p, wp(12, /PLAY/, 0.85, sec) - 0.1, wp(12, /PLAY/, 0.85, sec) + 0.04, EIO);
  const cam: Cam = { zoom: 1.02 + 0.14 * push, dx: 0, dy: -60 * push, ox: 560, oy: 1150 };
  const r = rng(1212);
  const homework = Array.from({ length: 10 }, (_, i) => ({ y: -470 + i * 58, w: 280 + r() * 260 }));
  const play = scrawl('PLAY', -190, 130, 128, 1299, 0.22, 0.16);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <BandImg id="close/desk" cam={cam} k={0.6} />
      <L cam={cam} k={0.9}>
        <defs>
          <radialGradient id="c12l" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#dfe8f2" stopOpacity={0.35} /><stop offset="1" stopColor="#dfe8f2" stopOpacity={0} /></radialGradient>
        </defs>
        {/* open notebook */}
        <g transform="translate(560,860) rotate(-3)">
          <rect x={-470} y={-640} width={940} height={1030} rx={14} fill="#000" opacity={0.4} transform="translate(16,20)" />
          <rect x={-470} y={-640} width={940} height={1030} rx={14} fill="#2b3442" />
          <rect x={-440} y={-620} width={880} height={990} fill="#c3ccd6" />
          <rect x={-440} y={-620} width={880} height={990} fill="url(#c12l)" />
          {Array.from({ length: 17 }, (_, i) => <line key={i} x1={-440} x2={440} y1={-540 + i * 58} y2={-540 + i * 58} stroke="#7d93b0" strokeWidth={2} opacity={0.6} />)}
          <line x1={-360} x2={-360} y1={-620} y2={370} stroke="#b06a6a" strokeWidth={3} opacity={0.6} />
          {homework.map((h, i) => (
            <path key={i} d={`M-330,${h.y - 8} q20,-14 40,0 t40,0 t40,0 M-200,${h.y - 8} L${-200 + h.w},${h.y - 12}`} stroke="#3a4a66" strokeWidth={4} fill="none" opacity={0.55} />
          ))}
          <ellipse cx={-40} cy={175} rx={330} ry={130} fill="#eef3f8" opacity={0.1 + 0.08 * reveal} />
          <path d={full(play)} stroke="#2a2826" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75 + 0.25 * reveal} />
        </g>
        {/* pencil lying on the desk */}
        <Pencil x={900} y={1500} rot={-60} s={0.85} rim="#c9d6e6" />
      </L>
      <L cam={cam} k={1.2}>
        {/* lamp head silhouette, top right */}
        <path d="M1200,-80 L1200,140 C1100,180 960,190 860,160 L780,330 L620,310 C640,220 700,150 760,120 L800,-80 Z" fill="#0a0b0e" />
        <path d="M620,310 L780,330" stroke="#e8eef6" strokeWidth={5} opacity={0.7} />
        <path d="M-60,1500 C80,1520 160,1640 180,1980 L-60,1980 Z" fill="#0a0b0e" />
      </L>
    </AbsoluteFill>
  );
};
