import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { useShot, BandImg, Live, Cam, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { WeweFigure } from '../art/graphic_wewe';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['500', '700'], subsets: ['latin'] });
const { fontFamily: marcellus } = loadMarcellus('normal', { weights: ['400'], subsets: ['latin'] });

const CREAM = '#f3e6cf';
const EBACK = Easing.out(Easing.back(1.8));

/** shot 2 — title card over the HERO: Wewe Gombel half hidden in dark bamboo, slow push-in. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const cam: Cam = { zoom: 1 + 0.09 * z, dx: 0, dy: -10 * z, ox: 600, oy: 900 };
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.2, 0.46, EOUT);
  const track = 0.32 - 0.14 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0a1e' }}>
      <BandImg id="graphic/far" k={0.5} cam={cam} />
      <Live k={0.85} cam={cam}>
        <WeweFigure x={720} y={660} s={1.12} sway={Math.sin(t * 0.9)} />
      </Live>
      <BandImg id="graphic/near" k={1.2} cam={cam} />
      <AbsoluteFill style={{ alignItems: 'center', top: 230 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 92, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: CREAM, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, whiteSpace: 'nowrap',
        }}>WEWE GOMBEL</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18, opacity: b }}>
          <div style={{ width: 100 * b, height: 2, background: `linear-gradient(90deg, rgba(255,138,61,0), ${GREEN})` }} />
          <div style={{ fontFamily: marcellus, fontSize: 44, letterSpacing: '0.12em', color: '#d9cbe0', whiteSpace: 'nowrap' }}>A Javanese legend</div>
          <div style={{ width: 100 * b, height: 2, background: `linear-gradient(90deg, ${GREEN}, rgba(255,138,61,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DarkBg: React.FC<{ dusk?: number }> = ({ dusk = 0 }) => (
  <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07060f" />
        <stop offset="0.55" stopColor="#141233" />
        <stop offset={dusk ? 0.86 : 1} stopColor={dusk ? '#2a1f48' : '#0e0c22'} />
        {dusk ? <stop offset="0.95" stopColor="#a2475a" /> : null}
        {dusk ? <stop offset="1" stopColor="#f0874a" /> : null}
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#g-dark)" />
  </svg>
);

/** shot 5 — typographic insert: "SHE ANSWERS FOR THEM." with echo copies fading outward. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const words = [
    { s: 'SHE', re: /^She/, f: 0.1 },
    { s: 'ANSWERS', re: /^answers/, f: 0.3, hi: true },
    { s: 'FOR', re: /^for/, f: 0.5 },
    { s: 'THEM.', re: /^them/, f: 0.7 },
  ].map((w) => ({ ...w, at: wordAt(5, w.re, w.f) }));
  const zoom = 1 + 0.06 * EIO(p);
  // three stacked lines so the longest ("ANSWERS" / "FOR THEM.") fits a ~920px safe width
  const rows = [[0], [1], [2, 3]];
  const line = (echo: number) => rows.map((r, ri) => (
    <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: '0.32em', lineHeight: 1.08 }}>
      {r.map((i) => {
        const w = words[i];
        const k = ramp(t, w.at - 0.04, w.at + 0.26, EOUT);
        return <span key={i} style={{ display: 'inline-block', opacity: k, transform: `scale(${0.92 + 0.08 * k})`, transformOrigin: '50% 60%', color: w.hi && echo === 0 ? GREEN : CREAM }}>{w.s}</span>;
      })}
    </div>
  ));
  const grow = ramp(t, words[1].at, words[1].at + 0.5, EOUT);
  return (
    <AbsoluteFill>
      <DarkBg />
      {/* single bamboo silhouette edge */}
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M 60 -20 L 118 -20 L 128 1940 L 52 1940 Z" fill="#1c2418" />
        {[260, 640, 1020, 1400, 1780].map((y) => <path key={y} d={`M 55 ${y} L 124 ${y}`} stroke="#121810" strokeWidth={6} />)}
        <path d="M 118 520 Q 200 490 260 540 Q 190 528 118 540 Z" fill="#1c2418" />
        <path d="M 120 1180 Q 210 1150 270 1196 Q 200 1188 120 1200 Z" fill="#1c2418" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})` }}>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 124, whiteSpace: 'nowrap', letterSpacing: '0.06em', marginRight: '-0.06em', textAlign: 'center', gap: 18 }}>
          {line(0)}
          <div style={{ width: 360 * grow, height: 3, marginTop: 20, background: `linear-gradient(90deg, rgba(255,138,61,0), ${GREEN}, rgba(255,138,61,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 13 — end card CTA: "Would you answer?" / "Comment YES or NO", words pop on their VO times. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, f: number) => {
    const at = Math.min(wordAt(13, re, f), sec - 0.45);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.08, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.3em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  return (
    <AbsoluteFill>
      <DarkBg dusk={1} />
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="g13-eye" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff8a3d" stopOpacity={0.55} />
            <stop offset="1" stopColor="#ff8a3d" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* framing bamboo, both edges */}
        {[[40, 70], [1010, 64]].map(([x, w], i) => (
          <g key={i} fill="#0d0a14">
            <path d={`M ${x - w / 2} -20 L ${x + w / 2} -20 L ${x + w / 2 + 6} 1940 L ${x - w / 2 - 6} 1940 Z`} />
            {[300, 720, 1140, 1560].map((y) => <path key={y} d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y}`} stroke="#06050a" strokeWidth={7} />)}
          </g>
        ))}
        {/* eyes in the dark above the text */}
        <g opacity={intro}>
          {[490, 590].map((x) => (
            <g key={x} transform={`translate(0 520) scale(1 ${Math.max(0.08, 1 - Math.max(0, 1 - Math.abs(((t + 0.4) % 2.6) - 2.45) / 0.12))}) translate(0 -520)`}>
              <ellipse cx={x} cy={520} rx={46} ry={30} fill="url(#g13-eye)" />
              <path d={`M ${x - 22} 520 Q ${x} 508 ${x + 22} 520 Q ${x} 528 ${x - 22} 520 Z`} fill="#f4f1e0" />
            </g>
          ))}
        </g>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: -80 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, marginTop: 0, letterSpacing: '0.06em', fontFamily: cinzel, fontWeight: 700, fontSize: 92, color: CREAM }}>
            <span style={pop(/^Would/, 0.07)}>Would</span>
            <span style={pop(/^you/, 0.19)}>you</span>
          </div>
          <div style={{ ...row, fontFamily: cinzel, fontWeight: 700, fontSize: 132, color: GREEN, lineHeight: 1.05 }}>
            <span style={pop(/^answer/, 0.31)}>answer?</span>
          </div>
          <div style={{ width: 520 * intro, height: 2, margin: '56px 0', background: `linear-gradient(90deg, rgba(243,230,207,0), ${CREAM}, rgba(243,230,207,0))`, opacity: 0.5 }} />
          <div style={{ ...row, fontFamily: marcellus, fontSize: 66, color: '#d9cbe0', letterSpacing: '0.04em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.43)}>Comment</span>
            <span style={{ ...pop(/^YES/, 0.55), color: GREEN, fontFamily: cinzel, fontWeight: 700, fontSize: 76 }}>YES</span>
            <span style={pop(/^or$/, 0.67)}>or</span>
            <span style={{ ...pop(/^NO/, 0.79), color: GREEN, fontFamily: cinzel, fontWeight: 700, fontSize: 76 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
