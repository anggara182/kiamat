import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadNotoKR } from '@remotion/google-fonts/NotoSerifKR';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { rng } from '../art/world';
import { Pine, FurTuft, FurDefs, Snow } from '../art/graphic_art';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['400', '700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600'], subsets: ['latin'] });
const { fontFamily: notoKR } = loadNotoKR('normal', { weights: ['700'] });

const ICE = GREEN; // #8fd8ff accent
const FUR = '#eef3f8';
const PINE = '#060a10';
const FW = 1080, FH = 1920;
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** jagged furry outline through control points (frame space), spikes pushed outward from centre (cx, cy). */
const furOutline = (pts: [number, number][], cx: number, cy: number, seed: number, amp = 18) => {
  const r = rng(seed);
  const out: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    for (let k = 0; k < 4; k++) {
      const u = k / 4;
      let x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
      if (k % 2 === 1 && r() > 0.3) {
        const nx = x - cx, ny = y - cy, l = Math.hypot(nx, ny) || 1;
        const a = amp * (0.5 + r());
        x += (nx / l) * a; y += (ny / l) * a;
      }
      out.push(`${i === 0 && k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${out.join(' ')} L ${lx} ${ly} Z`;
};

// hunched creature, 3/4 side view facing left: low head, arched back, long front leg stepping forward
const BEAST: [number, number][] = [
  [252, 1368], [276, 1220], [318, 1090], [350, 1030], [326, 1004], [300, 980], [292, 944], [314, 906], [356, 886], [398, 878], [430, 880], [452, 838],
  [476, 796], [522, 752], [602, 726], [692, 738], [772, 788], [832, 868], [854, 980], [846, 1100], [830, 1230],
  [846, 1368], [790, 1372], [774, 1240], [744, 1112], [650, 1088], [540, 1098], [470, 1118], [456, 1250], [452, 1368],
  [404, 1370], [406, 1240], [398, 1128], [372, 1185], [338, 1290], [308, 1368],
];
const BACK = BEAST.slice(7, 20);
const FAR_LEGS = 'M 560 1080 C 575 1180 585 1280 590 1372 L 632 1372 C 628 1280 622 1180 640 1080 Z M 690 1090 C 700 1200 705 1290 700 1370 L 742 1370 C 744 1290 742 1190 740 1090 Z';
const BEAST_D = furOutline(BEAST, 600, 1020, 11, 8);
const BACK_D = furOutline(BACK, 600, 1020, 12, 11).replace(' Z', '').replace(/L [\d.]+ [\d.]+$/, '');

/** shot 2 — title card over a huge pale silhouette between dark snowy pines, cold blue light. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const zoom = 1 + 0.06 * EIO(p);
  const tTitle = ramp(p, 0.02, 0.22, EOUT);
  const tJang = wordAt(2, /Jangsan/i, 0.55);
  const { sec } = useShot();
  const kr = ramp(t, Math.min(tJang, sec * 0.6) - 0.1, Math.min(tJang, sec * 0.6) + 0.5, EOUT);
  const beast = ramp(p, 0.0, 0.5, EIO);
  const breathe = Math.sin(t * 1.4) * 3;
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={FULL}>
        <defs>
          <linearGradient id="g2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b14" />
            <stop offset="0.45" stopColor="#152238" />
            <stop offset="0.7" stopColor="#1d3150" />
            <stop offset="1" stopColor="#0a101c" />
          </linearGradient>
          <radialGradient id="g2glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#6f9ccc" stopOpacity={0.55} />
            <stop offset="0.6" stopColor="#3a5a86" stopOpacity={0.2} />
            <stop offset="1" stopColor="#3a5a86" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g2beast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef3f8" stopOpacity={0.95} />
            <stop offset="0.45" stopColor="#c9d6e6" stopOpacity={0.75} />
            <stop offset="0.85" stopColor="#7f93b0" stopOpacity={0.25} />
            <stop offset="1" stopColor="#7f93b0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d3150" stopOpacity={0} />
            <stop offset="0.5" stopColor="#2a4064" stopOpacity={0.75} />
            <stop offset="1" stopColor="#0a101c" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="g2ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7f93b0" />
            <stop offset="1" stopColor="#1a2436" />
          </linearGradient>
        </defs>
        <rect width={FW} height={FH} fill="url(#g2sky)" />
        <g transform={`translate(540 1000) scale(${zoom}) translate(-540 -1000)`}>
          {/* cold glow behind the shape */}
          <ellipse cx={540} cy={980} rx={520} ry={560} fill="url(#g2glow)" />
          {/* far pines (low contrast) */}
          {[60, 170, 900, 1010, 330, 760].map((x, i) => (
            <Pine key={i} x={x} base={1340} h={520 + (i % 3) * 90} w={110} fill="#14223a" seed={20 + i} />
          ))}
          {/* the huge pale shape */}
          <g opacity={0.25 + 0.75 * beast} transform={`translate(0 ${breathe})`}>
            <path d={FAR_LEGS} fill="#5d7090" opacity={0.7} />
            <path d={BEAST_D} fill="url(#g2beast)" />
            {/* belly shadow */}
            <path d="M 470 1060 C 560 1040 680 1040 760 1080 L 744 1112 C 660 1086 560 1094 470 1118 Z" fill="#7f93b0" opacity={0.45} />
            {/* rim light along the arched back */}
            <path d={BACK_D} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" opacity={0.65} />
            {/* long fur hanging from shoulders / belly */}
            {Array.from({ length: 16 }, (_, i) => {
              const x = 440 + i * 22, y0 = 860 + Math.abs(i - 4) * 10 + (i > 8 ? (i - 8) * 14 : 0);
              return <path key={i} d={`M ${x} ${y0} q ${-6 - (i % 3) * 3} 90 ${-14 - (i % 4) * 4} ${170 + (i % 3) * 30}`} stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.22} />;
            })}
            {/* low head: shadowed face + two dull eyes */}
            <ellipse cx={330} cy={948} rx={36} ry={30} fill="#9fb0c6" opacity={0.55} />
            {[[316, 944], [348, 936]].map(([x, y], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={16} ry={9} fill="#8fd8ff" opacity={0.14} />
                <ellipse cx={x} cy={y} rx={7} ry={4} fill="#c3ced8" opacity={0.85} />
                <ellipse cx={x} cy={y} rx={3} ry={2.4} fill="#1b2532" opacity={0.85} />
              </g>
            ))}
          </g>
          {/* pine trunk in front, hiding part of the hind body */}
          <path d="M 690 1420 L 708 620 L 728 620 L 752 1420 Z" fill="#0b121e" />
          <path d="M 714 760 L 640 800 L 716 790 Z M 724 900 L 800 950 L 726 930 Z M 712 1040 L 650 1070 L 714 1062 Z" fill="#0b121e" />
          <path d="M 728 620 L 752 1420" stroke="#3c5272" strokeWidth={2} opacity={0.6} />
          {/* mid pines framing the shape */}
          <Pine x={150} base={1420} h={860} w={150} fill="#0b121e" snow="#9fb0c6" seed={3} tiers={7} />
          <Pine x={950} base={1420} h={900} w={170} fill="#0b121e" snow="#9fb0c6" seed={4} tiers={7} />
          {/* ground + mist */}
          <path d="M -40 1330 Q 300 1300 540 1320 T 1120 1310 L 1120 1920 L -40 1920 Z" fill="url(#g2ground)" opacity={0.6} />
          <rect x={-40} y={1150} width={1160} height={770} fill="url(#g2mist)" />
        </g>
        {/* fg pines, darkest, edges */}
        <Pine x={-20} base={1700} h={1500} w={260} fill={PINE} seed={5} tiers={8} />
        <Pine x={1100} base={1720} h={1550} w={270} fill={PINE} seed={6} tiers={8} />
        <rect y={1500} width={FW} height={420} fill="#05080e" />
        <Snow t={t} w={FW} h={1500} n={60} seed={9} speed={60} size={3.2} op={0.7} />
      </svg>
      {/* title, top third */}
      <div style={{ position: 'absolute', top: 170, left: 80, right: 80, textAlign: 'center', opacity: tTitle, transform: `translateY(${(1 - tTitle) * 24}px)` }}>
        <div style={{ fontFamily: cinzel, fontWeight: 400, fontSize: 46, letterSpacing: 18, color: '#c9d6e6' }}>THE</div>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 128, lineHeight: 1.0, letterSpacing: 6 + (1 - tTitle) * 10, color: FUR, marginTop: 4 }}>JANGSAN</div>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 128, lineHeight: 1.0, letterSpacing: 6 + (1 - tTitle) * 10, color: FUR }}>TIGER</div>
        <div style={{ margin: '26px auto 0', width: 380 * tTitle, height: 2, background: ICE, opacity: 0.7 }} />
        <div style={{ fontFamily: notoKR, fontWeight: 700, fontSize: 52, color: ICE, marginTop: 22, letterSpacing: 4, opacity: kr, transform: `translateY(${(1 - kr) * 14}px)` }}>
          장산범 <span style={{ color: '#c9d6e6', fontFamily: cinzel, fontWeight: 400 }}>· Busan</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** shot 3 — a single long tuft of white fur caught on a dark pine branch, falling snow, slow push. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const zoom = 1 + 0.14 * EIO(p);
  const sway = Math.sin(t * 0.9) * 14 + Math.sin(t * 2.1) * 4;
  const AX = 600, AY = 640;
  const needles = (x: number, y: number, ang: number, n: number, len: number, seed: number) => {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = ang + (i / (n - 1) - 0.5) * 1.6 + (r() - 0.5) * 0.2;
      const l = len * (0.7 + r() * 0.4);
      return <path key={i} d={`M ${x} ${y} L ${x + Math.cos(a) * l} ${y + Math.sin(a) * l}`} stroke={PINE} strokeWidth={4} strokeLinecap="round" />;
    });
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={FULL}>
        <defs>
          <FurDefs />
          <linearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b14" />
            <stop offset="0.4" stopColor="#152238" />
            <stop offset="1" stopColor="#0a101c" />
          </linearGradient>
          <radialGradient id="g3light" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#4d6f9c" stopOpacity={0.7} />
            <stop offset="1" stopColor="#4d6f9c" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={FW} height={FH} fill="url(#g3sky)" />
        {/* far, soft pines */}
        {[90, 260, 820, 990].map((x, i) => (
          <Pine key={i} x={x} base={1700} h={1100 + (i % 2) * 200} w={170} fill="#101a2c" seed={30 + i} tiers={7} />
        ))}
        <Snow t={t} w={FW} h={FH} n={50} seed={21} speed={35} size={2.2} op={0.45} />
        <g transform={`translate(${AX} ${AY + 250}) scale(${zoom}) translate(${-AX} ${-AY - 250})`}>
          <ellipse cx={AX + 30} cy={AY + 260} rx={430} ry={560} fill="url(#g3light)" />
          {/* branch from the left */}
          <path d={`M -40 520 C 160 560, 380 600, ${AX} ${AY - 6} C 700 660, 820 700, 900 760 L 896 774 C 810 716, 700 680, ${AX} ${AY + 12} C 380 622, 160 584, -40 548 Z`} fill={PINE} />
          <path d={`M -40 520 C 160 560, 380 600, ${AX} ${AY - 6} C 700 660, 820 700, 900 760`} stroke="#3c5272" strokeWidth={2} fill="none" opacity={0.8} />
          <path d={`M 300 590 C 340 540, 380 520, 430 505 L 432 512 C 384 528, 348 548, 310 600 Z`} fill={PINE} />
          {/* needle clusters */}
          {needles(80, 540, -1.9, 12, 90, 1)}{needles(220, 572, 1.6, 12, 85, 2)}{needles(430, 506, -1.8, 12, 80, 3)}
          {needles(760, 690, 1.5, 11, 80, 4)}{needles(880, 752, -1.6, 10, 75, 5)}{needles(140, 556, 1.7, 10, 70, 6)}
          {/* snow sitting on the branch */}
          <path d={`M 60 534 Q 160 540, 260 556 Q 200 560, 80 545 Z`} fill="#c9d6e6" opacity={0.75} />
          <path d={`M 660 650 Q 740 664, 810 696 Q 740 680, 660 660 Z`} fill="#c9d6e6" opacity={0.7} />
          {/* the hero tuft */}
          <FurTuft ax={AX} ay={AY} len={520} sway={sway} n={38} seed={7} scale={1.3} />
          {/* a few strands wrapped on the branch */}
          <path d={`M ${AX - 24} ${AY - 4} q 20 -14 48 2`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.85} />
          <path d={`M ${AX - 14} ${AY + 4} q 18 10 36 -4`} stroke="#dfe8f2" strokeWidth={2.5} fill="none" opacity={0.8} />
        </g>
        {/* fg out-of-focus branch, dark */}
        <path d="M 1120 1300 C 980 1330, 860 1400, 760 1520 L 790 1540 C 880 1430, 990 1370, 1120 1350 Z" fill="#04070c" />
        {needles(900, 1400, 2.4, 14, 160, 9)}
        <Snow t={t + 3} w={FW} h={FH} n={26} seed={22} speed={110} size={6} op={0.75} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA end card. Words appear on their VO times (capped so all is visible >= 0.5 s before the end). */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cap = sec - 0.95;
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap);
  const tW = at(/Would/i, 0.08), tA = at(/answer/i, 0.3), tC = at(/Comment/i, 0.45), tY = at(/YES/i, 0.58), tN = at(/^NO/i, 0.75);
  const show = (s: number) => ramp(t, s - 0.05, s + 0.35, EOUT);
  const sway = Math.sin(t * 1.1) * 8;
  const word = (txt: string, s: number, style: React.CSSProperties = {}) => {
    const o = show(s);
    return <span style={{ display: 'inline-block', opacity: o, transform: `translateY(${(1 - o) * 18}px)`, ...style }}>{txt}</span>;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={FULL}>
        <defs>
          <FurDefs />
          <linearGradient id="g13sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b14" />
            <stop offset="0.55" stopColor="#152238" />
            <stop offset="1" stopColor="#0b1220" />
          </linearGradient>
          <radialGradient id="g13glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2f4c74" stopOpacity={0.8} />
            <stop offset="1" stopColor="#2f4c74" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={FW} height={FH} fill="url(#g13sky)" />
        <ellipse cx={540} cy={860} rx={560} ry={520} fill="url(#g13glow)" />
        {/* pine motif at the bottom: snowy ridge + pines */}
        <Pine x={140} base={1920} h={760} w={200} fill="#0b121e" snow="#9fb0c6" seed={41} tiers={7} />
        <Pine x={960} base={1920} h={820} w={210} fill="#0b121e" snow="#9fb0c6" seed={42} tiers={7} />
        <path d="M -20 1700 Q 300 1640 540 1670 T 1100 1650 L 1100 1920 L -20 1920 Z" fill="#c9d6e6" opacity={0.18} />
        {/* branch across the top with the white fur tuft */}
        <path d="M -40 250 C 200 280, 420 300, 640 330 C 780 350, 900 380, 1000 420 L 994 446 C 886 404, 768 372, 640 356 C 420 330, 200 312, -40 292 Z" fill={PINE} />
        <path d="M -40 250 C 200 280, 420 300, 640 330 C 780 350, 900 380, 1000 420" stroke="#3c5272" strokeWidth={2} fill="none" />
        <FurTuft ax={700} ay={340} len={300} sway={sway} n={28} seed={13} scale={0.9} />
        <Snow t={t} w={FW} h={FH} n={55} seed={51} speed={45} size={3} op={0.55} />
      </svg>
      <div style={{ position: 'absolute', left: 80, width: 920, top: 760, textAlign: 'center' }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 104, lineHeight: 1.12, color: FUR }}>
          {word('Would', tW)} {word('you', tW + 0.12)}<br />{word('answer?', tA, { color: ICE })}
        </div>
        <div style={{ margin: '40px auto 36px', width: 240 * show(tC), height: 2, background: ICE, opacity: 0.6 }} />
        <div style={{ fontFamily: oswald, fontWeight: 600, fontSize: 80, letterSpacing: 4, color: '#e3ebf3' }}>
          {word('Comment', tC)} {word('YES', tY, { color: ICE })} {word('or', tY + 0.15)} {word('NO', tN, { color: ICE })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
