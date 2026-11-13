import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Tiles, Fingertips, OldHand, YoungHand } from '../art/close_art';
import { GrandmaHead, Handprint } from '../art/close_grandma';

const FW = 1080, FH = 1920;
const L: React.FC<{ cam: Cam; k?: number; children: React.ReactNode }> = ({ cam, k = 1, children }) => (
  <Live cam={cam} k={k} w={FW} h={FH}>{children}</Live>
);
/** progress fraction of a word inside the shot */
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));

/** shot 7 — floor under the chair, fingertips in the dark. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const stop = wp(7, /stopped/, 0.2, sec);
  const slide = ramp(p, 0, stop + 0.05, EIO);
  const push = ramp(p, 0, 1, EIO);
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1 + 0.14 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 470, oy: 1120 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05090a' }}>
      <L cam={cam} k={0.6}>
        <defs>
          <linearGradient id="c7wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c1517" /><stop offset="1" stopColor="#1b2a2e" /></linearGradient>
          <linearGradient id="c7floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f2e2e" /><stop offset="1" stopColor="#070c0c" /></linearGradient>
          <radialGradient id="c7door" cx="0.5" cy="1" r="0.8"><stop offset="0" stopColor="#dff7f2" stopOpacity={0.55} /><stop offset="1" stopColor="#dff7f2" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={1060} fill="url(#c7wall)" />
        {/* corridor door gap, cold light */}
        <rect x={180} y={420} width={360} height={440} fill="#2f4a4a" />
        <rect x={210} y={440} width={300} height={420} fill="#9fc9c2" opacity={0.6} />
        <ellipse cx={360} cy={880} rx={520} ry={260} fill="url(#c7door)" />
        <rect x={-200} y={860} width={1480} height={1300} fill="url(#c7floor)" />
        <Tiles vx={360} y0={860} y1={1920} stroke="#0a1112" op={0.7} />
        {/* light spill on tiles */}
        <path d="M230,860 L490,860 L760,1920 L-140,1920 Z" fill="#dff7f2" opacity={0.07} />
        <path d="M290,860 L430,860 L560,1500 L80,1500 Z" fill="#dff7f2" opacity={0.06} />
      </L>
      <L cam={cam} k={1}>
        <defs>
          <radialGradient id="c7dark" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#020405" stopOpacity={0.95} /><stop offset="1" stopColor="#020405" stopOpacity={0} /></radialGradient>
          <radialGradient id="c7tip" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#dff7f2" stopOpacity={0.22} /><stop offset="1" stopColor="#dff7f2" stopOpacity={0} /></radialGradient>
        </defs>
        {/* shadow pool under the chair */}
        <ellipse cx={420} cy={1130} rx={520} ry={190} fill="url(#c7dark)" />
        <ellipse cx={520} cy={1150} rx={300} ry={130} fill="url(#c7tip)" />
        {/* fingertips sliding out of the dark, then stopping */}
        <g transform={`translate(${330 + slide * 120},${1150}) rotate(-14) scale(2.1,1.35)`} opacity={0.82}>
          <Fingertips curl={ramp(p, stop + 0.1, stop + 0.4) * 0.5} />
        </g>
        <ellipse cx={250 + slide * 110} cy={1165} rx={150} ry={130} fill="url(#c7dark)" />
        <ellipse cx={230 + slide * 110} cy={1165} rx={110} ry={110} fill="url(#c7dark)" />
        <ellipse cx={150} cy={1160} rx={260} ry={170} fill="url(#c7dark)" /><ellipse cx={170} cy={1160} rx={200} ry={130} fill="url(#c7dark)" />
        {/* plastic chair: seat underside + 4 legs */}
        <path d="M-120,560 L860,600 L840,660 L-120,640 Z" fill="#0b1213" />
        <path d="M-120,560 L860,600" stroke="#5f8a86" strokeWidth={3} opacity={0.5} />
        {[[40, 1290, 18], [300, 1040, 12], [690, 1060, 12], [880, 1360, 20]].map(([x, y, w], i) => (
          <g key={i}>
            <path d={`M${x - w},${i % 3 === 0 ? 630 : 640} L${x + w},${i % 3 === 0 ? 630 : 640} L${x + w * 0.8},${y} L${x - w * 0.8},${y} Z`} fill="#0d1516" />
            <path d={`M${i === 0 ? x + w : x - w},640 L${i === 0 ? x + w * 0.8 : x - w * 0.8},${y}`} stroke="#9fc9c2" strokeWidth={2.5} opacity={0.55} />
            <ellipse cx={x} cy={y} rx={w * 1.4} ry={6} fill="#020405" />
          </g>
        ))}
        {/* sneakers (narrator) right foreground */}
        <g>
          <path d="M760,260 L870,260 L880,1100 L770,1100 Z" fill="#141c24" />
          <path d="M930,220 L1040,220 L1050,1060 L940,1060 Z" fill="#111820" />
          <path d="M700,1080 C700,1030 760,1010 880,1020 C960,1030 1000,1080 1010,1140 C1015,1190 960,1210 820,1205 C720,1200 690,1150 700,1080 Z" fill="#1d262c" />
          <path d="M690,1170 C760,1215 920,1220 1012,1180 L1012,1200 C930,1240 760,1240 690,1195 Z" fill="#8fa9a5" />
          <path d="M880,1040 C960,1000 1010,1050 1060,1080 C1110,1120 1120,1170 1080,1180 L900,1170 Z" fill="#192127" />
          <path d="M890,1172 L1090,1176 L1090,1196 L890,1194 Z" fill="#7d9591" />
          <path d="M760,1060 l60,-10 M770,1085 l60,-10 M780,1110 l55,-8" stroke="#3b4a52" strokeWidth={5} />
          <path d="M700,1080 C700,1030 760,1010 880,1020" stroke="#9fc9c2" strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </L>
    </AbsoluteFill>
  );
};

/** shot 8 — grandma's IV hand gripping the narrator's. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const wh = wp(8, /whisper/, 0.8, sec);
  const grip = ramp(p, 0.05, 0.35) * 0.6 + ramp(p, wh - 0.05, wh + 0.08) * 0.4;
  const h = handheld(t, 0.12);
  const cam: Cam = { zoom: 1 + 0.03 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1112' }}>
      <L cam={cam} k={0.7}>
        <defs>
          <linearGradient id="c8bl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a3a3a" /><stop offset="0.55" stopColor="#6f8784" /><stop offset="1" stopColor="#1a2526" /></linearGradient>
          <radialGradient id="c8glow" cx="0.8" cy="0.2" r="0.7"><stop offset="0" stopColor="#4dffb0" stopOpacity={0.35} /><stop offset="1" stopColor="#4dffb0" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c8bl)" />
        {/* blanket folds */}
        <path d="M-100,400 C200,520 500,480 1180,700 L1180,820 C600,620 260,640 -100,560 Z" fill="#3e5250" opacity={0.7} />
        <path d="M-100,1300 C300,1180 700,1260 1180,1150 L1180,1260 C700,1380 300,1300 -100,1420 Z" fill="#2b3a3a" opacity={0.7} />
        <path d="M-100,1290 C300,1170 700,1250 1180,1140" stroke="#c9d6d2" strokeWidth={4} opacity={0.35} fill="none" />
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c8glow)" />
        {/* IV line from top right */}
        <path d={`M1200,120 C980,300 860,500 ${650},${780}`} stroke="#d9efe9" strokeWidth={6} fill="none" opacity={0.75} />
      </L>
      <L cam={cam} k={1}>
        <defs>
          <radialGradient id="c8rim" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#4dffb0" stopOpacity={0.18} /><stop offset="1" stopColor="#4dffb0" stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx={560} cy={900} rx={460} ry={360} fill="url(#c8rim)" />
        <g transform="translate(340,940) rotate(-6) scale(1.3)"><YoungHand /></g>
        <g transform={`translate(${720 - grip * 6},${780 + grip * 4}) rotate(-12) scale(1.3)`}><OldHand grip={grip} /></g>
        {/* green rim along the top edge of the old hand */}
        <path d="M680,700 C600,690 500,700 420,740" stroke="#4dffb0" strokeWidth={4} fill="none" opacity={0.45} transform="rotate(-12 720 780)" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 9 — grandma on the pillow, face in shadow, two eye glints. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const push = ramp(p, 0, 1, EIO);
  const h = handheld(t, 0.08);
  const cam: Cam = { zoom: 1 + 0.08 * push, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 820 };
  // one slow, gentle blink
  const bl = p > 0.55 && p < 0.65 ? 1 - Math.abs((p - 0.6) / 0.05) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1112' }}>
      <L cam={cam} k={0.6}>
        <defs>
          <radialGradient id="c9bg" cx="0.75" cy="0.25" r="0.9"><stop offset="0" stopColor="#2f5a4c" /><stop offset="0.5" stopColor="#1b2a2e" /><stop offset="1" stopColor="#0a1112" /></radialGradient>
          <linearGradient id="c9pil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fa8a2" /><stop offset="1" stopColor="#2c3f43" /></linearGradient>
        </defs>
        <rect x={-100} y={-100} width={1280} height={2120} fill="url(#c9bg)" />
        <path d="M-120,300 C200,220 820,240 1200,380 C1220,700 1200,1100 1180,1400 C800,1330 200,1360 -120,1420 Z" fill="url(#c9pil)" />
        <path d="M-120,300 C200,220 820,240 1200,380" stroke="#c9f5e2" strokeWidth={5} fill="none" opacity={0.5} />
        <path d="M100,600 C300,560 500,620 640,580" stroke="#465c5a" strokeWidth={8} fill="none" opacity={0.5} />
        {/* blanket edge foreground */}
        <path d="M-120,1180 C200,1120 600,1180 1200,1080 L1200,2100 L-120,2100 Z" fill="#c9d6d2" />
        <path d="M-120,1180 C200,1120 600,1180 1200,1080 L1200,1150 C600,1250 200,1200 -120,1260 Z" fill="#7d918d" />
        
      </L>
      <L cam={cam} k={1}>
        <defs>
          <radialGradient id="c9face" cx="0.7" cy="0.3" r="0.8"><stop offset="0" stopColor="#8a5e4c" /><stop offset="0.55" stopColor="#4a3029" /><stop offset="1" stopColor="#1e1416" /></radialGradient>
          <radialGradient id="c9mon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#4dffb0" stopOpacity={0.25} /><stop offset="1" stopColor="#4dffb0" stopOpacity={0} /></radialGradient>
        </defs>
        <g transform="translate(560,760) rotate(-16) scale(1.25)"><GrandmaHead bl={bl} t={t} /></g>
        {/* blanket pulled up to the chin */}
        <path d="M-120,1010 C120,960 380,1000 560,990 C760,980 960,930 1200,960 L1200,2100 L-120,2100 Z" fill="#c9d6d2" />
        <path d="M-120,1010 C120,960 380,1000 560,990 C760,980 960,930 1200,960" stroke="#eef8f5" strokeWidth={6} fill="none" opacity={0.8} />
        <path d="M-120,1060 C200,1030 420,1080 640,1050 C860,1020 1000,1010 1200,1030 L1200,1100 C900,1080 700,1120 400,1110 C200,1100 0,1110 -120,1130 Z" fill="#9cb0ac" />
        <path d="M200,1160 C320,1130 460,1180 560,1240 M720,1150 C820,1120 960,1160 1100,1220" stroke="#7d918d" strokeWidth={10} fill="none" opacity={0.6} strokeLinecap="round" />
        <rect x={-120} y={1300} width={1320} height={800} fill="#1a2526" opacity={0.3} />
        <ellipse cx={900} cy={500} rx={300} ry={260} fill="url(#c9mon)" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 11 — morning: fresh IV bag labelled 02:00, a long dark hair caught on the stand. */
export const S11: React.FC = () => {
  const { p, t, sec } = useShot();
  const nurse = wp(11, /nurse/, 0.7, sec);
  const tilt = ramp(p, 0.05, Math.max(0.5, nurse), EIO);
  const h = handheld(t, 0.1);
  const cam: Cam = { zoom: 1.04 + 0.04 * ramp(p, nurse, 1), dx: 0, dy: 0, tx: h.hx, ty: h.hy + 380 - tilt * 520, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfdedb' }}>
      <L cam={cam} k={1}>
        <defs>
          <linearGradient id="c11wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9fb5b1" /><stop offset="0.65" stopColor="#e9f3ef" /><stop offset="1" stopColor="#fbfff9" /></linearGradient>
          <linearGradient id="c11bag" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b9d0cc" /><stop offset="0.6" stopColor="#eef8f5" /><stop offset="1" stopColor="#ffffff" /></linearGradient>
          <linearGradient id="c11pole" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4c5a5c" /><stop offset="0.6" stopColor="#d6e2e0" /><stop offset="1" stopColor="#7b8a8c" /></linearGradient>
        </defs>
        <rect x={-200} y={-900} width={1480} height={3800} fill="url(#c11wall)" />
        {/* window light slab */}
        <path d="M760,-900 L1280,-900 L1280,2900 L980,2900 Z" fill="#fffbe9" opacity={0.5} />
        {/* blurred curtain edge left (fg) */}
        <path d="M-200,-900 L120,-900 C90,0 140,900 80,2900 L-200,2900 Z" fill="#3a5552" />
        <path d="M120,-900 C90,0 140,900 80,2900" stroke="#6f9490" strokeWidth={8} fill="none" />
        {/* pole */}
        <rect x={528} y={-900} width={22} height={3800} fill="url(#c11pole)" />
        {/* hook bar */}
        <path d="M420,-60 L660,-60" stroke="#566466" strokeWidth={10} strokeLinecap="round" />
        <path d="M600,-60 q0,40 -20,60" stroke="#566466" strokeWidth={6} fill="none" />
        {/* bag */}
        <g transform="translate(580,0)">
          <path d="M-150,20 C-160,200 -170,420 -150,560 C-120,640 120,640 150,560 C170,420 160,200 150,20 C80,-10 -80,-10 -150,20 Z" fill="url(#c11bag)" opacity={0.95} />
          <path d="M-150,20 C-160,200 -170,420 -150,560" stroke="#8aa29e" strokeWidth={4} fill="none" />
          <path d="M120,60 C140,220 140,420 120,560" stroke="#ffffff" strokeWidth={8} fill="none" opacity={0.9} />
          {/* fluid level */}
          <path d="M-152,150 C-60,140 60,160 156,148 C164,300 162,460 150,560 C120,640 -120,640 -150,560 C-164,420 -160,300 -152,150 Z" fill="#d4ecef" opacity={0.65} />
          <ellipse cx={0} cy={4} rx={20} ry={14} fill="none" stroke="#7d9591" strokeWidth={6} />
          {/* printed lines */}
          {[0, 1, 2].map((i) => <rect key={i} x={-110} y={190 + i * 30} width={140 - i * 30} height={8} fill="#8fa9a5" opacity={0.6} />)}
          {/* tape label with handwriting */}
          <g transform="rotate(-4)">
            <rect x={-118} y={320} width={236} height={110} rx={6} fill="#fff6cf" />
            <path d="M-118,428 L118,428" stroke="#e0d3a2" strokeWidth={4} />
            <text x={0} y={398} textAnchor="middle" fontFamily="'Comic Sans MS','Segoe Print',cursive" fontSize={72} fill="#1b2a7a" fontStyle="italic" fontWeight={600} letterSpacing={2}>02:00</text>
          </g>
          {/* drip chamber + line */}
          <rect x={-18} y={630} width={36} height={110} rx={10} fill="#e6f4f1" stroke="#8aa29e" strokeWidth={3} />
          <path d="M0,740 C0,900 -60,1100 -40,1700" stroke="#d6e7e3" strokeWidth={6} fill="none" />
        </g>
        {/* long dark hair caught on the pole clamp, drifting down */}
        <rect x={510} y={1010} width={58} height={50} rx={6} fill="#3b4648" />
        <path d="M512,1018 L566,1018" stroke="#d6e2e0" strokeWidth={3} />
        <g fill="none" stroke="#0b0b0d" strokeLinecap="round">
          <path d={`M540,1030 C620,1030 640,1080 600,1160 C560,1240 640,1320 610,1420 C ${590 + Math.sin(t * 1.3) * 10},1520 650,1600 620,1720`} strokeWidth={5} />
          <path d="M540,1030 C470,1040 470,1060 520,1062" strokeWidth={3} />
        </g>
        <path d="M600,1160 C560,1240 640,1320 610,1420" stroke="#5c6668" strokeWidth={1.2} fill="none" opacity={0.6} transform="translate(2,-2)" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 12 — morning floor, a faint smeared trail leading under the curtain. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const tr = wp(12, /trail/, 0.4, sec);
  const push = ramp(p, 0, 1, EIO);
  const reveal = 0.55 + 0.45 * ramp(p, tr - 0.1, tr + 0.1);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1 + 0.18 * push, dx: 0, dy: -40 * push, tx: h.hx, ty: h.hy, ox: 620, oy: 860 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#8ea7a2' }}>
      <L cam={cam} k={0.55}>
        <defs>
          <linearGradient id="c12wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5d7672" /><stop offset="1" stopColor="#c9dcd6" /></linearGradient>
          <linearGradient id="c12cur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a5552" /><stop offset="0.5" stopColor="#5e807b" /><stop offset="1" stopColor="#3a5552" /></linearGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={1000} fill="url(#c12wall)" />
        {/* curtain hanging in the back, hem just off the floor */}
        <path d="M380,-200 L1280,-200 L1280,760 L380,760 Z" fill="url(#c12cur)" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${440 + i * 140},-200 L${450 + i * 140},760`} stroke="#2c4542" strokeWidth={22} opacity={0.6} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={'l' + i} d={`M${500 + i * 140},-200 L${505 + i * 140},760`} stroke="#9cc0b8" strokeWidth={6} opacity={0.4} />)}
        <path d="M380,760 Q420,780 460,760 T540,760 T620,760 T700,760 T780,760 T860,760 T940,760 T1020,760 T1100,760 T1180,760 T1280,760" stroke="#2c4542" strokeWidth={8} fill="none" />
        {/* dark gap under the curtain */}
        <rect x={380} y={765} width={900} height={50} fill="#0a1112" opacity={0.9} />
      </L>
      <L cam={cam} k={1}>
        <defs>
          <linearGradient id="c12floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9c0ba" /><stop offset="0.5" stopColor="#7f9893" /><stop offset="1" stopColor="#3c5250" /></linearGradient>
          <linearGradient id="c12smear" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#4a3e36" stopOpacity={0.18} /><stop offset="1" stopColor="#3a302b" stopOpacity={0.5} /></linearGradient>
          <radialGradient id="c12sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6dc" stopOpacity={0.55} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={812} width={1480} height={1400} fill="url(#c12floor)" />
        <Tiles vx={720} y0={812} y1={1920} stroke="#5d7672" op={0.55} />
        <ellipse cx={760} cy={1000} rx={520} ry={180} fill="url(#c12sun)" />
        {/* the smeared trail: wide, wiped, with drag streaks, narrowing into the gap */}
        <g opacity={reveal}>
          {/* one broad, irregular wiped sweep, fading at both ends */}
          <path d="M150,1920 C180,1840 230,1790 260,1700 C300,1590 360,1540 420,1430 C470,1340 500,1260 560,1180 C610,1110 640,1040 690,980 C720,940 740,880 760,818 L860,818 C850,870 820,920 800,960 C780,1010 790,1060 750,1120 C700,1190 690,1260 650,1340 C610,1420 620,1500 580,1580 C540,1660 560,1760 540,1920 Z" fill="url(#c12smear)" />
          <path d="M240,1920 C280,1800 330,1720 380,1600 C430,1490 500,1420 540,1320 C580,1230 640,1150 680,1060 C710,990 760,920 790,830 L830,830 C810,900 780,960 760,1010 C730,1080 700,1150 660,1230 C620,1310 580,1380 540,1480 C500,1580 470,1700 450,1920 Z" fill="#3a302b" opacity={0.12} />
          {/* lighter wiped patches inside the sweep */}
          <path d="M330,1760 C380,1700 420,1690 440,1720 C430,1780 380,1820 330,1800 Z" fill="#9fb6b0" opacity={0.25} />
          <path d="M560,1300 C590,1260 620,1250 630,1280 C620,1320 590,1340 565,1330 Z" fill="#9fb6b0" opacity={0.22} />
          {/* faint five-finger prints along the trail, reaching toward the gap */}
          <g transform="translate(400,1560) rotate(28) scale(1.15,0.75)"><Handprint op={0.4} /></g>
          <g transform="translate(560,1250) rotate(30) scale(0.75,0.5)"><Handprint op={0.38} /></g>
          <g transform="translate(700,1010) rotate(32) scale(0.48,0.33)"><Handprint op={0.42} /></g>
          <g transform="translate(790,880) rotate(30) scale(0.32,0.22)"><Handprint op={0.45} /></g>
        </g>
        {/* fg bed leg + frame on the left (dark framing) */}
        <path d="M-200,-200 L120,-200 L160,560 L-200,620 Z" fill="#1b2a2e" />
        <path d="M120,-200 L160,560" stroke="#dff7f2" strokeWidth={4} opacity={0.5} />
        <rect x={60} y={540} width={60} height={760} fill="#141f22" />
        <path d="M118,540 L118,1300" stroke="#cfe6e0" strokeWidth={4} opacity={0.6} />
        <ellipse cx={90} cy={1310} rx={70} ry={18} fill="#0a1112" opacity={0.7} />
      </L>
    </AbsoluteFill>
  );
};
