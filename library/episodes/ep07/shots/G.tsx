import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCorm } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadJP } from '@remotion/google-fonts/NotoSerifJP';
import { useShot, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { MaskFront, WomanProfile, PaleHand } from '../art/graphic_art';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCorm('italic', { weights: ['500', '600'], subsets: ['latin'] });
const { fontFamily: jp } = loadJP('normal', { weights: ['500'] });

const FW = 1080, FH = 1920;
const PINK = GREEN;

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox={`0 0 ${FW} ${FH}`} width={FW} height={FH} style={{ position: 'absolute', inset: 0, ...style }}>{children}</svg>
);

/** shot 2 — title over a tall masked silhouette in profile, one cold light. */
export const S02: React.FC = () => {
  const { p, sec } = useShot();
  const z = EIO(p);
  const tName = wordAt(2, /kuchisake/i, 0.4) / sec;
  const a = ramp(p, 0.02, 0.2, EOUT);
  const b = ramp(p, Math.min(0.6, tName - 0.05), Math.min(0.75, tName + 0.12), EOUT);
  const sc = 1 + 0.05 * z;
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080d' }}>
      <Svg style={{ transform: `scale(${sc})`, transformOrigin: '540px 900px' }}>
        <defs>
          <linearGradient id="g2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b0d18" />
            <stop offset="0.55" stopColor="#1a1f33" />
            <stop offset="1" stopColor="#07080d" />
          </linearGradient>
          <radialGradient id="g2light" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e8f1ff" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#a9c4e8" stopOpacity="0.22" />
            <stop offset="1" stopColor="#a9c4e8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g2cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8f1ff" stopOpacity="0.18" />
            <stop offset="1" stopColor="#e8f1ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={FW} height={FH} fill="url(#g2sky)" />
        {/* cold light behind the head (value contrast for the hero) */}
        <ellipse cx={420} cy={860} rx={520} ry={520} fill="url(#g2light)" />
        <path d="M250 560 L120 1400 L760 1400 L560 560 Z" fill="url(#g2cone)" />
        {/* mid: fence + utility pole silhouettes */}
        <rect x={0} y={1180} width={FW} height={220} fill="#12141d" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 140 + 10} y={1170} width={8} height={230} fill="#0c0e15" />)}
        <rect x={880} y={480} width={34} height={940} fill="#0c0e15" />
        <path d="M830 560 L970 560 L970 576 L830 576 Z" fill="#0c0e15" />
        <path d="M0 610 Q500 660 1080 600" fill="none" stroke="#0c0e15" strokeWidth={3} />
        {/* ground */}
        <rect x={0} y={1390} width={FW} height={530} fill="#07080d" />
        <ellipse cx={440} cy={1394} rx={300} ry={18} fill="#a9c4e8" opacity={0.12} />
        {/* hero */}
        <g transform="translate(470 1392)"><WomanProfile h={900} /></g>
        {/* fg dark framing */}
        <path d="M0 0 L0 1920 L70 1920 C60 1400 90 900 40 0 Z" fill="#050508" />
        <path d="M1080 1000 C1010 1100 990 1250 1000 1420 L1080 1420 Z" fill="#050508" />
      </Svg>
      {/* title, top third */}
      <div style={{ position: 'absolute', top: 210, left: 80, width: 920, textAlign: 'center' }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 84, letterSpacing: 4, whiteSpace: "nowrap", color: '#eef0f2', opacity: a, transform: `translateY(${(1 - a) * 18}px)`, lineHeight: 1.05 }}>
          KUCHISAKE<span style={{ color: PINK }}>-</span>ONNA
        </div>
        <div style={{ margin: '26px auto 0', width: 520 * a, height: 2, background: '#a9c4e8', opacity: 0.6 }} />
        <div style={{ marginTop: 26, fontFamily: jp, fontWeight: 500, fontSize: 64, letterSpacing: 10, color: '#d9e3f2', opacity: b }}>
          口裂け女 <span style={{ color: PINK, fontFamily: cinzel, fontSize: 44, letterSpacing: 4 }}>· JAPAN</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** shot 3 — the mask held by long pale fingers, ear loop slipping. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const slip = ramp(p, 0.2, 0.95, EIO);
  const sway = Math.sin(t * 0.9) * 1.2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#030305' }}>
      <Svg style={{ transform: `scale(${1 + 0.1 * z})`, transformOrigin: '520px 820px' }}>
        <defs>
          <radialGradient id="g3back" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1a1f33" stopOpacity="0.9" />
            <stop offset="1" stopColor="#030305" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3rim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#a9c4e8" stopOpacity="0.22" />
            <stop offset="1" stopColor="#a9c4e8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={520} cy={820} rx={620} ry={560} fill="url(#g3back)" />
        <ellipse cx={760} cy={560} rx={360} ry={300} fill="url(#g3rim)" />
        <g transform={`translate(500 860) rotate(${-8 + sway})`}>
          <g transform="scale(-1 1)"><MaskFront w={560} loopDrop={slip * 150} /></g>
        </g>
        <g transform={`translate(760 690) rotate(${8 + sway}) scale(1.7)`}><PaleHand /></g>
        {/* fg dark framing */}
        <path d="M0 1500 C300 1420 700 1460 1080 1380 L1080 1920 L0 1920 Z" fill="#020203" />
      </Svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA end card. */
export const S13: React.FC = () => {
  const { t, sec, p } = useShot();
  const cap = sec - 0.9;
  const W = (re: RegExp, f: number) => Math.min(cap, Math.max(0, wordAt(13, re, f) - 0.05));
  const op = (s: number) => clamp01((t - s) / 0.25);
  const line1: [string, RegExp, number, boolean][] = [
    ['Would', /^would/i, 0.06, false], ['you', /^you/i, 0.15, false], ['know', /^know/i, 0.24, false],
    ['what', /^what/i, 0.33, false], ['to', /^to$/i, 0.42, false], ['say?', /^say/i, 0.5, true],
  ];
  const line2: [string, RegExp, number, boolean][] = [
    ['Comment', /^comment/i, 0.6, false], ['YES', /^yes/i, 0.68, true], ['or', /^or$/i, 0.76, false], ['NO', /^no\.?$/i, 0.84, true],
  ];
  const tYes = W(/^yes/i, 0.68), tNo = W(/^no\.?$/i, 0.84);
  const mk = ramp(p, 0, 0.25, EOUT);
  const span = ([w, re, f, hi]: [string, RegExp, number, boolean], i: number) => {
    const s = W(re, f), o = op(s);
    return <span key={i} style={{ display: 'inline-block', opacity: o, transform: `translateY(${(1 - o) * 14}px)`, color: hi ? PINK : '#eef0f2', marginRight: 22 }}>{w}</span>;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#06070b' }}>
      <Svg>
        <defs>
          <radialGradient id="g13bg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1a1f33" />
            <stop offset="1" stopColor="#06070b" />
          </radialGradient>
        </defs>
        <ellipse cx={540} cy={1250} rx={700} ry={640} fill="url(#g13bg)" />
        <g transform={`translate(540 ${1180 - mk * 20})`}><MaskFront w={420} loopDrop={0} op={0.9 * mk} /></g>
        {/* thin frame inside safe width */}
        <rect x={80} y={300} width={920} height={1320} fill="none" stroke="#a9c4e8" strokeWidth={2} opacity={0.18} />
        <path d={`M390 830 L690 830`} stroke={PINK} strokeWidth={3} opacity={op(tYes) * 0.8} />
      </Svg>
      <div style={{ position: 'absolute', top: 520, left: 80, width: 920, textAlign: 'center', fontFamily: corm, fontWeight: 600, fontSize: 104, lineHeight: 1.12 }}>
        <div>{line1.slice(0, 3).map(span)}</div>
        <div>{line1.slice(3).map((w, i) => span(w, i + 3))}</div>
      </div>
      <div style={{ position: 'absolute', top: 860, left: 80, width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 70, letterSpacing: 3 }}>
        {line2.map(span)}
      </div>
      <div style={{ position: 'absolute', top: 1420, left: 80, width: 920, textAlign: 'center', fontFamily: jp, fontSize: 30, letterSpacing: 8, color: '#a9c4e8', opacity: 0.6 * op(tNo) }}>口裂け女</div>
    </AbsoluteFill>
  );
};
