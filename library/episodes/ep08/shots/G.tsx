import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { useShot, BandImg, Live, ramp, EIO, EOUT, handheld, clamp01 } from '../comp/Camera';
import type { Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { P, Reeds, Llorona, PaperBoat, Marigold, Ripples } from '../art/graphic_art';

const { fontFamily: CINZEL } = loadCinzel('normal', { weights: ['400', '700'], subsets: ['latin'] });
const { fontFamily: CORM } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

const ACC = GREEN; // episode accent (marigold)
const FW = 1080, FH = 1920;

/** reveal opacity/offset for a time-based word cue, capped so it finishes >= `tail` s before shot end. */
const useReveal = (t: number, sec: number, at: number, dur = 0.45, tail = 0.6) => {
  const start = Math.max(0, Math.min(at, sec - tail - dur));
  return clamp01((t - start) / dur);
};

/* ───────────────────────── shot 2 — title card ───────────────────────── */
export const S02: React.FC = () => {
  const { p, t, sec } = useShot();
  const cam: Cam = { zoom: 1 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, oy: FH * 0.45 };
  const h = handheld(t, 0.25);
  const camFg: Cam = { ...cam, tx: h.hx, ty: h.hy };
  const sway = Math.sin(t * 1.4) * 6;
  const tTitle = wordAt(2, /^La$/i, 0.3) - 0.35;
  const tSub = wordAt(2, /weeping/i, 0.7) - 0.3;
  const aT = EOUT(useReveal(t, sec, tTitle, 0.8));
  const aS = EOUT(useReveal(t, sec, tSub, 0.7));
  const lineW = 520 * EOUT(useReveal(t, sec, tTitle + 0.3, 0.9));
  return (
    <AbsoluteFill style={{ backgroundColor: P.skyTop }}>
      <BandImg id="graphic/night" k={0.5} cam={cam} />
      <Live k={1} cam={camFg} w={FW} h={FH}>
        <defs>
          <linearGradient id="g2bank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#151b2c" />
            <stop offset="1" stopColor="#05070d" />
          </linearGradient>
          <radialGradient id="g2halo">
            <stop offset="0" stopColor={P.glint} stopOpacity="0.35" />
            <stop offset="1" stopColor={P.glint} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* ripples where her hands touch the water */}
        <g transform="translate(626 1232)"><Ripples q={(t * 0.35) % 1} rx={150} ry={22} op={0.55} /></g>
        {/* near bank */}
        <path d="M-40 1150 Q120 1170 260 1196 Q420 1214 560 1228 Q600 1240 590 1262 Q560 1300 420 1330 L-40 1380 Z" fill="url(#g2bank)" />
        <path d="M260 1196 Q420 1214 560 1228" stroke="#3a4560" strokeWidth={3} fill="none" opacity={0.7} />
        <ellipse cx={500} cy={960} rx={190} ry={220} fill="url(#g2halo)" />
        <g transform="translate(470 1228) scale(1.05)"><Llorona sway={sway} /></g>
        {/* marigold petals drifting on the water */}
        {[[760, 1250, 0.5], [860, 1290, 0.38], [700, 1300, 0.3]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x + Math.sin(t * 0.6 + i) * 8} ${y}) scale(${s} ${s * 0.45})`}><Marigold r={40} rot={t * 6 + i * 40} /></g>
        ))}
        {/* candle on the bank */}
        <circle cx={250} cy={1180} r={40} fill={P.mari} opacity={0.12 + 0.03 * Math.sin(t * 7)} />
        <rect x={244} y={1172} width={12} height={20} rx={2} fill="#d9cbb0" />
        <ellipse cx={250} cy={1164} rx={4} ry={8} fill={P.candle} />
        {/* foreground reeds framing */}
        <Reeds x={40} y={1420} h={560} sway={Math.sin(t * 0.9) * 8} />
        <Reeds x={1060} y={1440} h={480} flip sway={Math.sin(t * 0.8 + 1) * 8} />
      </Live>
      {/* title (top third) */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 260 }}>
        <div style={{ fontFamily: CORM, fontStyle: 'italic', fontSize: 40, color: ACC, opacity: aT * 0.95, letterSpacing: 2, marginBottom: 6 }}>
          ✿ &nbsp;they call her&nbsp; ✿
        </div>
        <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 132, color: P.dress, letterSpacing: 10, lineHeight: 1.05, textAlign: 'center',
          opacity: aT, transform: `translateY(${(1 - aT) * 18}px)`, textShadow: '0 4px 0 rgba(0,0,0,0.55)' }}>
          LA<br />LLORONA
        </div>
        <div style={{ width: lineW, height: 2, marginTop: 18, background: `linear-gradient(90deg, transparent, ${ACC}, transparent)` }} />
        <div style={{ fontFamily: CORM, fontStyle: 'italic', fontWeight: 500, fontSize: 54, color: '#cfd8e6', marginTop: 16,
          opacity: aS, transform: `translateY(${(1 - aS) * 12}px)` }}>
          The weeping woman <span style={{ color: ACC }}>·</span> Mexico
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────────────────── shot 3 — paper boats ───────────────────────── */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const push = 1 + 0.08 * ramp(p, 0, 1, EIO);
  const tip = ramp(p, 0.3, 0.95, Easing2);
  const b1x = 360 + 90 * p, b2x = 690 + 50 * p;
  const bob1 = Math.sin(t * 1.6) * 6, bob2 = Math.sin(t * 1.3 + 1) * 5;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05080f' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ position: 'absolute', inset: 0, transformOrigin: '540px 900px', transform: `scale(${push})` }}>
        <defs>
          <linearGradient id="g3w" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2140" />
            <stop offset="0.35" stopColor={P.river} />
            <stop offset="1" stopColor="#04060c" />
          </linearGradient>
          <radialGradient id="g3moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={P.glint} stopOpacity="0.32" />
            <stop offset="1" stopColor={P.glint} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={FW} height={FH} fill="url(#g3w)" />
        <ellipse cx={600} cy={880} rx={520} ry={330} fill="url(#g3moon)" />
        {/* moon glints, slowly drifting */}
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 300 + i * 52;
          const w = 50 + (i % 5) * 34;
          const x = 600 + Math.sin(i * 2.7 + t * 0.6) * (60 + i * 6);
          return <rect key={i} x={x - w / 2} y={y} width={w} height={4} rx={2} fill={P.glint} opacity={0.12 + 0.3 * Math.abs(Math.sin(i * 1.3 + t * 0.8)) * (1 - Math.abs(y - 880) / 700)} />;
        })}
        {/* reflection of a marigold light far away */}
        <rect x={160} y={360} width={40} height={4} rx={2} fill={P.mari} opacity={0.35} />
        <rect x={150} y={390} width={60} height={3} rx={2} fill={P.mari} opacity={0.22} />
        {/* boat 1 — steady */}
        <g transform={`translate(${b1x} ${900 + bob1}) scale(1.2)`}>
          <Ripples q={(t * 0.3) % 1} rx={190} ry={30} op={0.45} />
          <g transform="translate(0 40) scale(1 -0.45)" opacity={0.25}><PaperBoat /></g>
          <g transform={`rotate(${Math.sin(t * 1.6) * 3})`}><PaperBoat /></g>
        </g>
        {/* boat 2 — tipping over, settling lower */}
        <g transform={`translate(${b2x} ${1020 + bob2 + tip * 26}) scale(1.2)`}>
          <Ripples q={(t * 0.45 + 0.5) % 1} rx={150 + tip * 80} ry={24 + tip * 12} op={0.4 + tip * 0.3} />
          <g transform="translate(0 40) scale(1 -0.45)" opacity={0.2 * (1 - tip)}><PaperBoat /></g>
          <g transform={`rotate(${-4 + tip * 78 + Math.sin(t * 1.3) * 2 * (1 - tip)}) scale(0.88)`}><PaperBoat tone={1 - tip * 0.25} /></g>
          {/* water line hiding the submerged part */}
          <ellipse cx={0} cy={58 - tip * 8} rx={120} ry={40} fill={P.river} opacity={0.2 + tip * 0.55} />
        </g>
        {/* dark foreground water / reed framing */}
        <path d={`M0 1260 Q300 1230 540 1270 Q800 1300 1080 1250 L1080 1920 L0 1920 Z`} fill="#03050a" opacity={0.75} />
        <g opacity={1}><Reeds x={-30} y={1500} h={760} fill={P.reedNear} sway={Math.sin(t * 0.7) * 10} /></g>
        <Reeds x={1110} y={1420} h={420} flip fill={P.reedNear} sway={Math.sin(t * 0.8) * 8} />
      </svg>
    </AbsoluteFill>
  );
};
function Easing2(x: number) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

/* ───────────────────────── shot 13 — CTA end card ───────────────────────── */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cam: Cam = { zoom: 1.12, dx: 0, dy: -470 };
  const words: { re: RegExp; txt: string; fb: number; key?: boolean }[] = [
    { re: /^Would/i, txt: 'Would', fb: 0.08 }, { re: /^you/i, txt: 'you', fb: 0.18 }, { re: /^help/i, txt: 'help', fb: 0.28 }, { re: /^her/i, txt: 'her?', fb: 0.38, key: true },
  ];
  const words2: { re: RegExp; txt: string; fb: number; key?: boolean }[] = [
    { re: /^Comment/i, txt: 'Comment', fb: 0.5 }, { re: /^YES/i, txt: 'YES', fb: 0.6, key: true }, { re: /^or$/i, txt: 'or', fb: 0.7 }, { re: /^NO/i, txt: 'NO', fb: 0.78, key: true },
  ];
  const W = (arr: typeof words, size: number, font: string, weight: number) => arr.map((w, i) => {
    const a = EOUT(useReveal(t, sec, wordAt(13, w.re, w.fb) - 0.05, 0.35, 0.55));
    return (
      <span key={i} style={{ display: 'inline-block', margin: '0 10px', fontFamily: font, fontWeight: weight, fontSize: size,
        color: w.key ? ACC : P.dress, opacity: a, transform: `translateY(${(1 - a) * 20}px) scale(${0.94 + 0.06 * a})` }}>{w.txt}</span>
    );
  });
  const flower = EOUT(useReveal(t, sec, wordAt(13, /^YES/i, 0.6) - 0.1, 0.6, 0.55));
  return (
    <AbsoluteFill style={{ backgroundColor: P.skyTop }}>
      <BandImg id="graphic/night" cam={cam} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,8,16,0.82) 0%, rgba(6,8,16,0.55) 45%, rgba(6,8,16,0.35) 70%, rgba(6,8,16,0.8) 100%)' }} />
      <Live k={1} cam={{ zoom: 1, dx: 0, dy: 0 }} w={FW} h={FH}>
        <g transform="translate(540 1330)">
          <Ripples q={(t * 0.3) % 1} n={4} rx={420} ry={70} color={ACC} op={0.45} />
          <Ripples q={(t * 0.3 + 0.125) % 1} n={4} rx={420} ry={70} color={P.glint} op={0.25} />
          <g transform={`translate(0 ${Math.sin(t * 1.4) * 5}) scale(${0.85 + 0.15 * flower} ${(0.85 + 0.15 * flower) * 0.6})`} opacity={0.4 + 0.6 * flower}>
            <circle r={110} fill={ACC} opacity={0.12} />
            <Marigold r={70} rot={t * 5} />
          </g>
          {[[-260, 30, 0.35], [250, -10, 0.3], [150, 60, 0.22]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x + Math.sin(t * 0.5 + i) * 10} ${y}) scale(${s} ${s * 0.55})`} opacity={0.85}><Marigold r={70} rot={t * 4 + i * 50} /></g>
          ))}
        </g>
        <Reeds x={30} y={1700} h={520} sway={Math.sin(t * 0.9) * 8} />
        <Reeds x={1050} y={1720} h={460} flip sway={Math.sin(t * 0.8 + 1) * 8} />
      </Live>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 540 }}>
        <div style={{ width: 920, textAlign: 'center', lineHeight: 1.15 }}>{W(words.slice(0, 2), 104, CINZEL, 700)}<br />{W(words.slice(2), 104, CINZEL, 700)}</div>
        <div style={{ width: 360, height: 2, margin: '40px 0', background: `linear-gradient(90deg, transparent, ${ACC}, transparent)`, opacity: EOUT(useReveal(t, sec, wordAt(13, /^Comment/i, 0.5) - 0.2, 0.5, 0.55)) }} />
        <div style={{ width: 920, textAlign: 'center', lineHeight: 1.15 }}>{W(words2, 66, CINZEL, 700)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
