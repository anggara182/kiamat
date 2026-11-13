import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { useShot, ramp, EIO, EOUT, BandImg, CAM0 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { NurseCap, Tube, Clipboard, HairLock } from '../art/graphic_props';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

const FW = 1080, FH = 1920;
const flick = (t: number) => {
  const s = Math.sin(t * 23.0) * Math.sin(t * 7.3 + 1.2);
  return s > 0.82 ? 0.55 : 1;
};

const Frame: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <BandImg id="graphic/wall" cam={CAM0} />
    <svg viewBox={`0 0 ${FW} ${FH}`} width={FW} height={FH} style={{ position: 'absolute', inset: 0 }}>{children}</svg>
  </AbsoluteFill>
);

/** Tiles in simple floor perspective: horizon y0, bottom y1. */
const FloorTiles: React.FC<{ y0: number; y1: number; cx?: number; op?: number }> = ({ y0, y1, cx = 540, op = 1 }) => {
  const rows = [0, 0.06, 0.15, 0.28, 0.46, 0.7, 1];
  return (
    <g opacity={op}>
      <rect x={0} y={y0} width={FW} height={y1 - y0} fill="#16201f" />
      {rows.map((r, i) => <line key={'h' + i} x1={0} x2={FW} y1={y0 + (y1 - y0) * r} y2={y0 + (y1 - y0) * r} stroke="#2a3a38" strokeWidth={1 + r * 3} />)}
      {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((c) => (
        <line key={'v' + c} x1={cx + c * 60} y1={y0} x2={cx + c * 300} y2={y1} stroke="#2a3a38" strokeWidth={2} />
      ))}
    </g>
  );
};

/** shot 2 — title card: single fluorescent tube over an old nurse's cap on the floor. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const on = flick(t);
  const a = ramp(p, 0.04, 0.28, EOUT);
  const tSub = wordAt(2, /crawling/i, 0.72);
  const { sec } = useShot();
  const b = ramp(p, Math.min(0.75, tSub / sec - 0.12), Math.min(0.85, tSub / sec + 0.02), EOUT);
  const sc = 1 + 0.06 * z;
  return (
    <Frame bg="#070c0d">
      <defs>
        <linearGradient id="g2cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff7f2" stopOpacity={0.26 * on} />
          <stop offset="1" stopColor="#dff7f2" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="g2pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#bfe6df" stopOpacity={0.42 * on} />
          <stop offset="0.6" stopColor="#4d7a74" stopOpacity={0.14 * on} />
          <stop offset="1" stopColor="#4d7a74" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dff7f2" stopOpacity={0.35 * on} />
          <stop offset="1" stopColor="#dff7f2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g2wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1617" />
          <stop offset="1" stopColor="#1b2a2e" />
        </linearGradient>
      </defs>
      <g transform={`translate(540 960) scale(${sc}) translate(-540 -960)`}>
        <rect x={0} y={0} width={FW} height={1180} fill="url(#g2wall)" />
        <FloorTiles y0={1180} y1={1920} />
        <rect x={0} y={1180} width={FW} height={740} fill="#070c0d" opacity={0.35} />
        <path d={`M300 110 L780 110 L1000 1300 L80 1300 Z`} fill="url(#g2cone)" />
        <ellipse cx={540} cy={1200} rx={430} ry={140} fill="url(#g2pool)" />
        <ellipse cx={540} cy={110} rx={420} ry={110} fill="url(#g2halo)" />
        {/* doorway silhouettes left/right (fg framing) */}
        <path d="M0 360 L110 380 L110 1250 L0 1290 Z" fill="#050909" />
        <path d="M1080 330 L960 360 L960 1240 L1080 1280 Z" fill="#050909" />
        {/* reflection of the cap */}
        <g opacity={0.18} transform="translate(0 2380) scale(1 -1)">
          <NurseCap x={540} y={1150} s={1.05} lit={on} />
        </g>
        <NurseCap x={540} y={1110} s={1.05} lit={on} />
        {/* hair strand trailing from under cap */}
        <HairLock d="M650 1196 C720 1225 770 1262 860 1252 S1000 1286 1100 1268" n={10} spread={4} rim={0.5 * on} />
      </g>
      <Tube x={540} y={110} w={480} on={on} />
      {/* title, top third, not pushed (stays crisp) */}
      <g opacity={a} transform={`translate(0 ${18 * (1 - a)})`}>
        <text x={540} y={430} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={104} letterSpacing={6} fill="#e6e8e2">SUSTER</text>
        <text x={540} y={548} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={104} letterSpacing={6} fill={GREEN}>NGESOT</text>
        <line x1={380} x2={700} y1={590} y2={590} stroke="#e6e8e2" strokeWidth={2} opacity={0.5} />
      </g>
      <text x={540} y={660} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontWeight={500} fontSize={62} fill="#c9d6d2" opacity={b}>The crawling nurse</text>
    </Frame>
  );
};

/** shot 3 — lore insert: cap, clipboard, a hair strand on the floor tiles, cold light, slow push. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const on = flick(t * 0.6) * 0.15 + 0.85;
  const sc = 1.0 + 0.12 * z;
  const tile = 200;
  return (
    <Frame bg="#0a1112">
      <defs>
        <radialGradient id="g3pool" cx="0.45" cy="0.38" r="0.6">
          <stop offset="0" stopColor="#dff7f2" stopOpacity={0.30 * on} />
          <stop offset="0.5" stopColor="#6fa79e" stopOpacity={0.12 * on} />
          <stop offset="1" stopColor="#0a1112" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g3dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1112" stopOpacity="0" />
          <stop offset="1" stopColor="#050909" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g transform={`translate(520 760) scale(${sc}) rotate(${-2 + 1.5 * z}) translate(-520 -760)`}>
        <rect x={-200} y={-200} width={1480} height={2320} fill="#16201f" />
        {[...Array(9)].map((_, i) => <line key={'a' + i} x1={-200 + i * tile + 40} x2={-200 + i * tile + 40} y1={-200} y2={2120} stroke="#273634" strokeWidth={6} />)}
        {[...Array(13)].map((_, i) => <line key={'b' + i} y1={-200 + i * tile + 60} y2={-200 + i * tile + 60} x1={-200} x2={1280} stroke="#273634" strokeWidth={6} />)}
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#g3pool)" />
        <Clipboard x={700} y={900} s={1.05} rot={14} />
        {/* long hair strand */}
        <HairLock d="M-80 1010 C100 1050 200 930 340 975 S500 1110 610 1070 S760 1150 820 1240" n={12} spread={4} rim={0.7} />
        <NurseCap x={360} y={640} s={0.95} rot={-18} lit={on} dirty />
      </g>
      <rect x={0} y={1200} width={FW} height={720} fill="url(#g3dark)" />
      {/* fg: dark bed edge + leg framing the top right */}
      <path d="M1080 0 L760 0 L800 120 L1080 160 Z" fill="#050909" />
      <rect x={930} y={130} width={44} height={420} fill="#050909" />
      <ellipse cx={952} cy={556} rx={40} ry={12} fill="#050909" />
    </Frame>
  );
};

/** shot 13 — CTA end card. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  // never later than 0.75 s before the end so every word is fully visible >= 0.5 s
  const at = (re: RegExp, f: number) => { const s0 = Math.min(wordAt(13, re, f), sec - 0.75); return ramp(t, s0, s0 + 0.2, EOUT); };
  const w1 = at(/^Would/, 0.08), w2 = at(/^you/, 0.2), w3 = at(/^look/, 0.32);
  const c1 = at(/^Comment/, 0.45), c2 = at(/^YES/, 0.56), c3 = at(/^or$/, 0.66), c4 = at(/^NO/, 0.74);
  const on = flick(t);
  const word = (txt: string, x: number, y: number, a: number, fill: string, size: number, font = cinzel, anchor: 'start' | 'middle' | 'end' = 'middle') => (
    <text x={x} y={y + 14 * (1 - a)} opacity={a} textAnchor={anchor} fontFamily={font} fontWeight={700} fontSize={size} fill={fill}>{txt}</text>
  );
  return (
    <Frame bg="#070c0d">
      <defs>
        <radialGradient id="g13halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dff7f2" stopOpacity={0.25 * on} />
          <stop offset="1" stopColor="#dff7f2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g13cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff7f2" stopOpacity={0.12 * on} />
          <stop offset="1" stopColor="#dff7f2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <FloorTiles y0={1360} y1={1920} />
      <rect x={0} y={1360} width={FW} height={560} fill="#070c0d" opacity={0.3} />
      <path d="M340 100 L740 100 L960 1500 L120 1500 Z" fill="url(#g13cone)" />
      <ellipse cx={540} cy={100} rx={380} ry={100} fill="url(#g13halo)" />
      <ellipse cx={540} cy={1420} rx={360} ry={70} fill="url(#g13halo)" />
      <Tube x={540} y={100} w={440} on={on} />
      <NurseCap x={540} y={1320} s={0.85} lit={on} />
      {word('WOULD', 540, 560, w1, '#e6e8e2', 120)}
      {word('YOU', 540, 700, w2, '#e6e8e2', 120)}
      {word('LOOK?', 540, 850, w3, GREEN, 140)}
      <line x1={400} x2={680} y1={920} y2={920} stroke="#e6e8e2" strokeWidth={2} opacity={0.4 * c1} />
      <text x={540} y={1030 + 14 * (1 - c1)} opacity={c1} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontWeight={500} fontSize={84} fill="#c9d6d2">Comment</text>
      {word('YES', 330, 1170, c2, GREEN, 120)}
      <text x={540} y={1160 + 14 * (1 - c3)} opacity={c3} textAnchor="middle" fontFamily={corm} fontStyle="italic" fontWeight={500} fontSize={76} fill="#c9d6d2">or</text>
      {word('NO', 740, 1170, c4, GREEN, 120)}
    </Frame>
  );
};
