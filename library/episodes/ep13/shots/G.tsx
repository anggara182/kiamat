import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Comb, Banshee } from '../art/graphic_comb';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin', 'latin-ext'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['600', '700'], subsets: ['latin'] });
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

const Rain: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 40, op = 0.25 }) => (
  <g stroke="#8d99a6" strokeWidth={2} opacity={op}>
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 197) % 1180 - 50;
      const y = ((i * 331 + t * 1400) % 2100) - 100;
      return <path key={i} d={`M ${x} ${y} l -14 60`} />;
    })}
  </g>
);

const Sky: React.FC<{ id: string; mx: number; my: number }> = ({ id, mx, my }) => (
  <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1018" />
        <stop offset="0.5" stopColor="#1f2c3a" />
        <stop offset="1" stopColor="#0a0e14" />
      </linearGradient>
      <radialGradient id={`${id}-moon`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e3e9f0" stopOpacity={0.9} />
        <stop offset="0.12" stopColor="#e3e9f0" stopOpacity={0.6} />
        <stop offset="0.45" stopColor="#8d99a6" stopOpacity={0.18} />
        <stop offset="1" stopColor="#8d99a6" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-sky)`} />
    <circle cx={mx} cy={my} r={700} fill={`url(#${id}-moon)`} />
    <circle cx={mx} cy={my} r={70} fill="#e3e9f0" />
  </>
);

/** shot 2 — title over the far banshee by a stone wall in mist, cold moon, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.05, 0.35, EOUT);
  const b = ramp(p, 0.25, 0.55, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e14' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1100px' }}>
        <Sky id="g2" mx={760} my={900} />
        <path d="M 0 1180 Q 300 1080 600 1150 Q 850 1200 1080 1110 L 1080 1920 L 0 1920 Z" fill="#121a22" />
        <ellipse cx={540} cy={1260} rx={700} ry={90} fill="#8d99a6" opacity={0.18} />
        <Banshee id="g2b" x={400} y={1295} h={460} sway={Math.sin(t * 1.3)} />
        {/* stone wall */}
        <path d="M 0 1300 L 1080 1270 L 1080 1360 L 0 1400 Z" fill="#2f3237" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${i * 160 + 40} ${1300 - i * 4} q 40 -16 80 0`} stroke="#3a3d42" strokeWidth={10} fill="none" />)}
        <ellipse cx={300 + 80 * z} cy={1330} rx={620} ry={70} fill="#8d99a6" opacity={0.14} />
        {/* foreground hills / grass */}
        <path d="M 0 1420 Q 400 1360 1080 1450 L 1080 1920 L 0 1920 Z" fill="#070a0f" />
        <Rain t={t} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 300 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 108, letterSpacing: '0.05em', color: '#eef3f8', opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap' }}>THE BANSHEE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 18, opacity: b }}>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, rgba(154,209,255,0), ${GREEN})` }} />
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 54, color: '#b8cbe0', whiteSpace: 'nowrap' }}>Bean sí · Ireland</div>
          <div style={{ width: 120 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(154,209,255,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore insert: silver comb with a long white hair strand caught in its teeth. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const tc = wordAt(3, /^comb/, 0.9);
  const hl = ramp(t, tc - 0.4, tc + 0.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#080b10' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.08 * z})`, transformOrigin: '540px 760px' }}>
        <defs>
          <radialGradient id="g3-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#3a4a5c" />
            <stop offset="0.6" stopColor="#151c26" />
            <stop offset="1" stopColor="#080b10" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g3-pool)" />
        {/* dark stone slab */}
        <path d="M -40 1080 Q 540 980 1120 1060 L 1120 1920 L -40 1920 Z" fill="#24272c" />
        <path d="M -40 1080 Q 540 980 1120 1060" stroke="#3a3d42" strokeWidth={6} fill="none" />
        <Comb id="g3c" x={540} y={760} s={1.25} rot={-8} />
        <circle cx={700} cy={640} r={90} fill="#ffffff" opacity={0.12 * hl} />
        {/* fg window-frame shadows */}
        <path d="M 0 0 L 110 0 L 70 1920 L 0 1920 Z" fill="#040609" />
        <path d="M 1080 0 L 990 0 L 1030 1920 L 1080 1920 Z" fill="#040609" />
        <Rain t={t} n={24} op={0.15} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: comb under rain, question + YES / NO on word times. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = EIO(p);
  const cap = (x: number) => Math.min(x, sec - 0.6);
  const q = ramp(t, cap(wordAt(13, /^Would/, 0.05)) - 0.1, cap(wordAt(13, /^Would/, 0.05)) + 0.3, EOUT);
  const c = ramp(t, cap(wordAt(13, /^Comment/, 0.5)) - 0.1, cap(wordAt(13, /^Comment/, 0.5)) + 0.3, EOUT);
  const y = ramp(t, cap(wordAt(13, /^YES/, 0.65)) - 0.1, cap(wordAt(13, /^YES/, 0.65)) + 0.25, EOUT);
  const n = ramp(t, cap(wordAt(13, /^NO/, 0.8)) - 0.1, cap(wordAt(13, /^NO/, 0.8)) + 0.25, EOUT);
  const pill = (txt: string, k: number, col: string) => (
    <div style={{ opacity: k, transform: `scale(${0.85 + 0.15 * k})`, fontFamily: oswald, fontWeight: 700, fontSize: 110, color: '#0a0e14', background: col, borderRadius: 26, padding: '6px 54px' }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e14' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Sky id="g13" mx={540} my={1200} />
        <path d="M -40 1520 Q 540 1440 1120 1520 L 1120 1920 L -40 1920 Z" fill="#24272c" />
        <Comb id="g13c" x={540} y={1240 + 6 * Math.sin(t * 1.5)} s={1.2} rot={-6 + 2 * z} />
        <Rain t={t} n={50} op={0.3} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 340 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 96, lineHeight: 1.15, color: '#eef3f8', opacity: q, transform: `translateY(${(1 - q) * 20}px)` }}>
          Would you <span style={{ color: GREEN }}>pick it up?</span>
        </div>
        <div style={{ marginTop: 60, fontFamily: oswald, fontWeight: 600, fontSize: 60, letterSpacing: '0.12em', color: '#b8cbe0', opacity: c }}>COMMENT</div>
        <div style={{ display: 'flex', gap: 50, marginTop: 30, alignItems: 'center' }}>
          {pill('YES', y, GREEN)}
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontSize: 64, color: '#b8cbe0', opacity: n }}>or</div>
          {pill('NO', n, '#d8dde3')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
