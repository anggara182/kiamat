import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { PocongFigure, KnotBand } from '../art/graphic_pocong';
import { ShroudKnot } from '../art/graphic_knot';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['500', '700'], subsets: ['latin'] });
const { fontFamily: marcellus } = loadMarcellus('normal', { weights: ['400'], subsets: ['latin'] });

const CREAM = '#e9e4d6';
const EBACK = Easing.out(Easing.back(1.8));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** shot 2 — title card over a shrouded standing silhouette, one cold light from above, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.2, 0.46, EOUT);
  const hit = ramp(t, wordAt(2, /^pocong/i, 0.7) - 0.05, wordAt(2, /^pocong/i, 0.7) + 0.4, EOUT);
  const track = 0.34 - 0.12 * a;
  const sway = Math.sin(t * 0.8) * 0.6;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.07 * z})`, transformOrigin: '540px 900px' }}>
        <defs>
          <linearGradient id="g2-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0d1c" /><stop offset="0.6" stopColor="#111629" /><stop offset="1" stopColor="#04050a" />
          </linearGradient>
          <linearGradient id="g2-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fb4d8" stopOpacity={0.32} /><stop offset="1" stopColor="#9fb4d8" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="g2-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fb4d8" stopOpacity={0.45} /><stop offset="1" stopColor="#9fb4d8" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g2-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2e3550" stopOpacity={1} /><stop offset="1" stopColor="#2e3550" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g2-bg)" />
        <ellipse cx={540} cy={1000} rx={520} ry={620} fill="url(#g2-halo)" />
        {/* cold beam from above */}
        <path d="M 440 -20 L 640 -20 L 860 1360 L 220 1360 Z" fill="url(#g2-beam)" />
        {/* far grave markers */}
        <g fill="#121626">
          <path d="M 90 1340 L 90 1240 Q 120 1210 150 1240 L 150 1340 Z" />
          <path d="M 900 1340 L 900 1225 Q 935 1192 970 1225 L 970 1340 Z" />
          <path d="M 760 1340 L 760 1270 Q 785 1250 810 1270 L 810 1340 Z" />
        </g>
        <rect x={0} y={1330} width={1080} height={600} fill="#07080f" />
        <ellipse cx={540} cy={1338} rx={260} ry={40} fill="url(#g2-pool)" />
        <PocongFigure id="g2" x={540} y={1340} s={0.98} tuft={sway} rot={sway * 0.4} />
        {/* foreground frangipani branch framing */}
        <g fill="#03040a">
          <path d="M -20 1180 C 60 1220 110 1300 130 1420 C 90 1330 40 1290 -20 1270 Z" />
          <path d="M 1100 1500 C 960 1560 900 1680 880 1940 L 1100 1940 Z" />
        </g>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 250 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 132, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: CREAM, opacity: a, transform: `translateY(${(1 - a) * 18}px) scale(${1 + 0.03 * hit})`, whiteSpace: 'nowrap',
        }}>POCONG</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 14, opacity: b }}>
          <div style={{ width: 100 * b, height: 2, background: `linear-gradient(90deg, rgba(255,204,77,0), ${GREEN})` }} />
          <div style={{ fontFamily: marcellus, fontSize: 46, letterSpacing: '0.12em', color: '#c9d2e6', whiteSpace: 'nowrap' }}>An Indonesian legend</div>
          <div style={{ width: 100 * b, height: 2, background: `linear-gradient(90deg, ${GREEN}, rgba(255,204,77,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — top-down lore illustration: shrouded body on a woven mat, three ties, candle glow; slow tilt head → feet. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const head = wordAt(3, /^head/, 0.75);
  const feet = wordAt(3, /^feet/, 0.88);
  const ty = -1150 * EIO(ramp(p, 0.05, 0.95, (n) => n));
  const fl = 0.9 + 0.06 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 11.1);
  const hHead = ramp(t, head - 0.1, head + 0.3, EOUT) * (1 - ramp(t, feet - 0.1, feet + 0.2));
  const hFeet = ramp(t, feet - 0.1, feet + 0.3, EOUT);
  const S = 2.4, X = 560, Y = 2440; // body: head tuft at y≈ 330, feet at 2520 (world of this shot)
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0806' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <radialGradient id="g3-candle" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="0.5" stopColor="#ffb347" stopOpacity={0.16} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g3-mat" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a2a1a" /><stop offset="0.5" stopColor="#6b5236" /><stop offset="1" stopColor="#3a2a1a" />
          </linearGradient>
          <pattern id="g3-weave" width={36} height={36} patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 18 0 L 18 18 L 0 18 Z M 18 18 L 36 18 L 36 36 L 18 36 Z" fill="#000" fillOpacity={0.18} />
          </pattern>
          <radialGradient id="g3-hi" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcc4d" stopOpacity={0.5} /><stop offset="1" stopColor="#ffcc4d" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(0 ${ty})`}>
          <rect x={-100} y={-100} width={1300} height={2900} fill="#120d09" />
          {/* woven mat */}
          <rect x={170} y={180} width={780} height={2440} rx={8} fill="url(#g3-mat)" />
          <rect x={170} y={180} width={780} height={2440} rx={8} fill="url(#g3-weave)" />
          <rect x={170} y={180} width={780} height={2440} rx={8} fill="none" stroke="#2a1d10" strokeWidth={14} />
          {/* candle glows */}
          <ellipse cx={1000} cy={420} rx={420 * fl} ry={420 * fl} fill="url(#g3-candle)" />
          <ellipse cx={90} cy={1500} rx={380 * fl} ry={380 * fl} fill="url(#g3-candle)" />
          {/* tie highlights */}
          <ellipse cx={X} cy={Y - 684 * S} rx={170} ry={120} fill="url(#g3-hi)" opacity={hHead} />
          <ellipse cx={X} cy={Y - 62 * S} rx={300} ry={140} fill="url(#g3-hi)" opacity={hFeet} />
          <PocongFigure id="g3" x={X} y={Y} s={S} />
          {/* candles (top-down: round holder + flame) */}
          {[[1000, 420], [90, 1500]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={46} fill="#3b2c1e" />
              <circle cx={cx} cy={cy} r={30} fill="#e9dcc0" />
              <ellipse cx={cx} cy={cy} rx={11 * fl} ry={16 * fl} fill="#ffd27a" />
              <ellipse cx={cx} cy={cy} rx={5} ry={8} fill="#fff6dc" />
            </g>
          ))}
          {/* frangipani petals (respectful offering) */}
          {[[300, 300], [820, 900], [260, 2100], [860, 1900]].map(([px, py], i) => (
            <g key={i} transform={`translate(${px} ${py}) rotate(${i * 40})`}>
              {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-14} rx={9} ry={16} fill="#f2ecdc" transform={`rotate(${r})`} />)}
              <circle r={6} fill="#ffcc4d" />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** shot 4 — close on the head knot: black, single rim light, slight tremble, slow push-in. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const rest = wordAt(4, /^rest/, 0.55);
  const living = wordAt(4, /^living/, 0.9);
  const tremble = (0.5 + 0.8 * ramp(t, rest - 0.2, rest + 0.4) + 0.6 * ramp(t, living - 0.3, living + 0.3)) ;
  const tr = tremble * (Math.sin(t * 13) * 0.35 + Math.sin(t * 21 + 1) * 0.2);
  const sw = tremble * (Math.sin(t * 2.1) * 0.6 + Math.sin(t * 9) * 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.1 * z})`, transformOrigin: '560px 820px' }}>
        <defs>
          <radialGradient id="g4-rim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fb4d8" stopOpacity={0.2} /><stop offset="1" stopColor="#9fb4d8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={820} cy={700} rx={560} ry={640} fill="url(#g4-rim)" />
        <g transform={`translate(545 860) scale(1.3) rotate(${tr} 0 240) translate(-545 -860)`}><ShroudKnot sw={sw} /></g>
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — end card CTA: "Would you untie it?" / "Comment YES or NO", words on their VO times, knotted-cloth motif. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, f: number) => {
    const at = Math.min(wordAt(13, re, f), sec - 0.75);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.3em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.6, EOUT);
  const untie = Math.min(wordAt(13, /^untie/, 0.3), sec - 0.75);
  const tight = ramp(t, untie, untie + 0.5, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0d1c' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05060c" /><stop offset="0.5" stopColor="#141a2e" /><stop offset="1" stopColor="#05060c" />
          </linearGradient>
          <radialGradient id="g13-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2e3550" stopOpacity={0.9} /><stop offset="1" stopColor="#2e3550" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <ellipse cx={540} cy={900} rx={560} ry={520} fill="url(#g13-glow)" />
        {/* far graves silhouettes at the bottom */}
        <g fill="#07080f">
          <rect x={0} y={1620} width={1080} height={300} />
          <path d="M 140 1630 L 140 1520 Q 175 1485 210 1520 L 210 1630 Z" />
          <path d="M 860 1630 L 860 1500 Q 900 1462 940 1500 L 940 1630 Z" />
          <path d="M 300 1630 L 300 1570 Q 325 1550 350 1570 L 350 1630 Z" />
        </g>
        <g transform="translate(540 930)"><KnotBand w={820} reveal={intro} tight={tight} /></g>
      </svg>
      <div style={{ position: 'absolute', left: 80, width: 920, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ ...row, letterSpacing: '0.05em', fontFamily: cinzel, fontWeight: 700, fontSize: 96, color: CREAM }}>
          <span style={pop(/^Would/, 0.07)}>Would</span>
          <span style={pop(/^you/, 0.17)}>you</span>
        </div>
        <div style={{ ...row, fontFamily: cinzel, fontWeight: 700, fontSize: 124, color: CREAM, lineHeight: 1.1 }}>
          <span style={{ ...pop(/^untie/, 0.27), color: GREEN }}>untie</span>
          <span style={pop(/^it/, 0.37)}>it?</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 80, width: 920, top: 1130, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ ...row, fontFamily: marcellus, fontSize: 70, color: '#c9d2e6', letterSpacing: '0.04em', alignItems: 'baseline' }}>
          <span style={pop(/^Comment/, 0.5)}>Comment</span>
          <span style={{ ...pop(/^YES/, 0.6), color: GREEN, fontFamily: cinzel, fontWeight: 700, fontSize: 88 }}>YES</span>
          <span style={pop(/^or/, 0.68)}>or</span>
          <span style={{ ...pop(/^NO/, 0.76), color: GREEN, fontFamily: cinzel, fontWeight: 700, fontSize: 88 }}>NO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
