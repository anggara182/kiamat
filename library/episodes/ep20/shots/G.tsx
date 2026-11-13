import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCorm } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, BandImg, Live, ramp, EIO, EOUT, handheld, type Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { KelpieHead } from '../art/graphic_horse';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCorm('italic', { weights: ['500'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['500', '700'], subsets: ['latin'] });
const PALE = '#e6eef0';

/** shot 2 — title card over a kelpie head silhouette, cold dusk, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const hh = handheld(t, 0.4);
  const cam: Cam = { zoom: 1 + 0.06 * z, dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, oy: 900 };
  const tk = wordAt(2, /^kelpie/i, 0.55);
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(t, tk - 0.1, tk + 0.5, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b1116' }}>
      <BandImg id="graphic/sky" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <KelpieHead id="h2" x={720} y={1000} s={1.15} t={t} />
      </Live>
      <AbsoluteFill style={{ alignItems: 'center', top: 200 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 132, lineHeight: 1, letterSpacing: '0.08em', marginRight: '-0.08em', color: PALE, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap' }}>THE KELPIE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, rgba(79,209,197,0), ${GREEN})` }} />
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 56, color: '#b9c9cf', whiteSpace: 'nowrap' }}>A Scottish legend</div>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(79,209,197,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore insert: close on the dripping weed-tangled mane, drops falling. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const hh = handheld(t, 0.5);
  const cam: Cam = { zoom: 1 + 0.08 * z, dx: 0, dy: -30 * z, tx: hh.hx, ty: hh.hy, oy: 800 };
  const lbl = ramp(p, 0.02, 0.18, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b1116' }}>
      <BandImg id="graphic/sky" k={0.4} cam={{ ...cam, zoom: 1.25 + 0.04 * z, dy: -120 }} />
      <Live k={1} cam={cam}>
        <KelpieHead id="h3" x={300} y={1240} s={2.3} t={t} sheen={1.2} />
      </Live>
      <AbsoluteFill style={{ alignItems: 'center', top: 210 }}>
        <div style={{ opacity: lbl, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: oswald, fontWeight: 500, fontSize: 40, letterSpacing: '0.3em', marginRight: '-0.3em', color: GREEN }}>EACH-UISGE</div>
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 44, color: '#b9c9cf', marginTop: 6 }}>the water horse</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Iron key motif. */
const Key: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-20)`} fill="none" stroke="#6f7a80" strokeLinecap="round">
    <circle cx={0} cy={0} r={34} strokeWidth={14} />
    <path d="M 34 0 L 190 0 M 150 0 L 150 34 M 180 0 L 180 26" strokeWidth={14} />
    <path d="M -20 -22 Q 0 -32 20 -22" strokeWidth={3} stroke="#b9c9cf" opacity={0.7} />
  </g>
);

/** shot 13 — CTA end card: mane + iron key motif, words on VO times. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const cap = (x: number) => Math.min(x, sec - 0.9);
  const w1 = cap(wordAt(13, /^Would/, 0.05));
  const w2 = cap(wordAt(13, /^Comment/, 0.48));
  const wy = cap(wordAt(13, /^YES/, 0.58));
  const wn = cap(wordAt(13, /^NO/, 0.8));
  const a1 = ramp(t, w1, w1 + 0.35, EOUT);
  const a2 = ramp(t, w2, w2 + 0.3, EOUT);
  const ay = ramp(t, wy, wy + 0.3, EOUT);
  const an = ramp(t, wn, wn + 0.3, EOUT);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  const pill = (txt: string, a: number): React.ReactNode => (
    <div style={{ opacity: a, transform: `scale(${0.85 + 0.15 * a})`, fontFamily: oswald, fontWeight: 700, fontSize: 110, color: '#06110f', background: GREEN, borderRadius: 22, padding: '6px 46px', letterSpacing: '0.04em' }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#070c0f' }}>
      <BandImg id="graphic/sky" k={1} cam={{ zoom: 1.1, dx: 0, dy: -260 }} style={{ opacity: 0.55 }} />
      <Live k={1} cam={cam}>
        <KelpieHead id="h13" x={930} y={1760} s={0.95} t={t} sheen={0.9} />
        <Key x={330} y={1780} s={1.3 + 0.03 * p} />
      </Live>
      <AbsoluteFill style={{ alignItems: 'center', top: 470 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: PALE, opacity: a1, transform: `translateY(${(1 - a1) * 20}px)` }}>Would you have touched it?</div>
        <div style={{ marginTop: 90, fontFamily: oswald, fontWeight: 500, fontSize: 60, letterSpacing: '0.2em', marginRight: '-0.2em', color: '#b9c9cf', opacity: a2 }}>COMMENT</div>
        <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 40 }}>
          {pill('YES', ay)}
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontSize: 64, color: '#b9c9cf', opacity: an }}>or</div>
          {pill('NO', an)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
