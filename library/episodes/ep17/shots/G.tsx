import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Silbon, Note } from '../art/graphic_silbon';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700', '900'], subsets: ['latin', 'latin-ext'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

const GOLD = '#f2c14e';
const MOON = '#f3ecd2';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared night-llanos backdrop: sky gradient, huge moon, palms, grass horizon at `hy`. */
const Plains: React.FC<{ id: string; mx: number; my: number; mr: number; hy: number }> = ({ id, mx, my, mr, hy }) => (
  <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05070c" />
        <stop offset="0.55" stopColor="#1a2230" />
        <stop offset="1" stopColor="#3a4250" />
      </linearGradient>
      <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={MOON} stopOpacity={0.45} />
        <stop offset="0.45" stopColor="#8fa3b5" stopOpacity={0.16} />
        <stop offset="1" stopColor="#8fa3b5" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-moon`} cx="0.42" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#fbf6e4" />
        <stop offset="1" stopColor="#e2d8b8" />
      </radialGradient>
      <linearGradient id={`${id}-grass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a3324" />
        <stop offset="0.5" stopColor="#141a12" />
        <stop offset="1" stopColor="#07090a" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-sky)`} />
    <circle cx={mx} cy={my} r={mr * 2.4} fill={`url(#${id}-halo)`} />
    <circle cx={mx} cy={my} r={mr} fill={`url(#${id}-moon)`} />
    <circle cx={mx - mr * 0.3} cy={my + mr * 0.2} r={mr * 0.16} fill="#d6cba8" opacity={0.45} />
    <circle cx={mx + mr * 0.35} cy={my - mr * 0.25} r={mr * 0.1} fill="#d6cba8" opacity={0.4} />
    {/* far palms */}
    {[[150, 0.8], [930, 1]].map(([px, k], i) => (
      <g key={i} transform={`translate(${px} ${hy}) scale(${k})`} fill="#0b0f0b">
        <path d="M -5 0 Q -2 -160 8 -300 L 14 -300 Q 6 -160 6 0 Z" />
        {[-150, -110, -60, -20, 25, 70].map((a, j) => (
          <path key={j} transform={`translate(11 -300) rotate(${a})`} d="M 0 0 Q 60 -26 130 10 Q 60 -4 0 10 Z" />
        ))}
      </g>
    ))}
    <path d={`M 0 ${hy} Q 270 ${hy - 14} 540 ${hy - 4} Q 810 ${hy + 6} 1080 ${hy - 10} L 1080 1920 L 0 1920 Z`} fill={`url(#${id}-grass)`} />
    <path d={`M 0 ${hy + 60} Q 540 ${hy + 40} 1080 ${hy + 70}`} stroke="#8fa3b5" strokeWidth={3} opacity={0.25} fill="none" />
  </>
);

/** Foreground grass blades framing the bottom. */
const FgGrass: React.FC<{ y: number; sway: number; children?: React.ReactNode }> = ({ y, sway, children }) => (
  <g fill="#030404">
    <rect x={0} y={y + 40} width={1080} height={1920} fill="#161d14" />
    {children}
    {Array.from({ length: 22 }, (_, i) => {
      const x = i * 52 - 20, h = 140 + ((i * 37) % 90), lean = ((i % 5) - 2) * 14 + sway * (1 + (i % 3));
      return <path key={i} d={`M ${x - 14} ${y + 200} Q ${x} ${y - h * 0.4} ${x + lean} ${y - h} Q ${x + 6} ${y - h * 0.4} ${x + 16} ${y + 200} Z`} />;
    })}
  </g>
);

/** shot 2 — title card: El Silbón against a huge moon, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const tEl = wordAt(2, /^El$/, 0.45);
  const a = ramp(t, tEl - 0.6, tEl + 0.2, EOUT);
  const b = ramp(t, tEl + 0.1, tEl + 0.8, EOUT);
  const track = 0.16 - 0.06 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070c' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <Plains id="g2" mx={540} my={930} mr={330} hy={1300} />
        <Silbon x={560} y={1330} s={0.92} rim={0.75} step={0} />
        <FgGrass y={1370} sway={Math.sin(t * 1.2) * 4}>
          {/* El Silbón's long moon shadow stretching toward camera */}
          <path d="M 548 1330 L 572 1330 L 600 1780 L 520 1780 Z" fill="#020303" opacity={0.9} />
          <ellipse cx={560} cy={1800} rx={150} ry={34} fill="#020303" opacity={0.9} />
          <path d="M 520 1790 Q 560 1700 600 1790 Z" fill="#020303" opacity={0.9} />
        </FgGrass>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 190 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 900, fontSize: 132, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: MOON, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, whiteSpace: 'nowrap',
        }}>EL SILBÓN</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, rgba(242,193,78,0), ${GOLD})` }} />
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 44, letterSpacing: '0.16em', color: GOLD, whiteSpace: 'nowrap' }}>THE WHISTLER · VENEZUELA</div>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, ${GOLD}, rgba(242,193,78,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — lore: giant / seven notes / sack of bones, three beats on one figure. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const t1 = wordAt(3, /^giant/, 0.05), t2 = wordAt(3, /^whistles/, 0.45), t3 = wordAt(3, /^sack/, 0.8);
  const a1 = ramp(t, t1, t1 + 0.5, EOUT), a2 = ramp(t, t2, t2 + 0.4, EOUT), a3 = ramp(t, t3 - 0.3, t3 + 0.3, EOUT);
  const label = t < t2 ? 'GIANT · THIN' : t < t3 - 0.3 ? 'SEVEN NOTES' : 'A SACK OF BONES';
  const la = t < t2 ? a1 : t < t3 - 0.3 ? a2 : a3;
  const sx = 400, sy = 1340, ss = 1.02;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070c' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.05 * z}) translateX(${-10 * z}px)`, transformOrigin: '480px 900px' }}>
        <Plains id="g3" mx={760} my={640} mr={250} hy={1300} />
        {/* height ruler vs a palm: GIANT */}
        <g opacity={a1 * (t < t2 ? 1 : 0.35)}>
          <path d={`M 250 ${sy} L 250 ${sy - 940 * ss * a1}`} stroke={GOLD} strokeWidth={3} />
          {Array.from({ length: 9 }, (_, i) => (sy - i * 110 > sy - 940 * ss * a1) && <path key={i} d={`M 236 ${sy - i * 110} L 264 ${sy - i * 110}`} stroke={GOLD} strokeWidth={3} />)}
        </g>
        <Silbon x={sx} y={sy} s={ss} rim={0.8} sack={a3} step={t * 0.6} />
        {/* seven notes drifting from the head */}
        {Array.from({ length: 7 }, (_, i) => {
          const ti = t2 + i * 0.12;
          const o = ramp(t, ti, ti + 0.25, EOUT);
          const dy = (t - ti) * 18;
          return o > 0 ? <Note key={i} x={480 + i * 70} y={430 + Math.sin(i * 1.3) * 60 - dy - i * 10} s={0.9 + (i % 2) * 0.2} o={o * (t > t3 ? 0.4 : 1)} /> : null;
        })}
        <FgGrass y={1390} sway={Math.sin(t * 1.2) * 4} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 170 }}>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 88, letterSpacing: '0.12em', color: MOON, opacity: la, transform: `translateY(${(1 - la) * 16}px)`, whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ width: 160 * la, height: 4, background: GOLD, marginTop: 14 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: hat silhouette + music-note motif, YES / NO on word times. */
export const S13: React.FC = () => {
  const { t, sec, p } = useShot();
  const cap = sec - 0.6;
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap - 0.3);
  const q = ramp(t, at(/^Would/, 0.05) - 0.1, at(/^Would/, 0.05) + 0.4, EOUT);
  const c = ramp(t, at(/^Comment/, 0.55), at(/^Comment/, 0.55) + 0.3, EOUT);
  const y = ramp(t, at(/^YES/, 0.65), at(/^YES/, 0.65) + 0.25, EOUT);
  const n = ramp(t, at(/^NO/, 0.85), at(/^NO/, 0.85) + 0.25, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070c' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <radialGradient id="g13-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcc7a" stopOpacity={0.35} />
            <stop offset="0.5" stopColor="#4b5260" stopOpacity={0.18} />
            <stop offset="1" stopColor="#05070c" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g13-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070c" /><stop offset="0.5" stopColor="#141a24" /><stop offset="1" stopColor="#05070c" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <circle cx={540} cy={560} r={520} fill="url(#g13-glow)" />
        <linearGradient id="g13-pane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2230" /><stop offset="1" stopColor="#4b5260" /></linearGradient>
        <rect x={300} y={300} width={480} height={560} fill="url(#g13-pane)" />
        <circle cx={680} cy={400} r={120} fill="url(#g13-glow)" />
        <circle cx={680} cy={400} r={46} fill={MOON} />
        <path d="M 300 800 Q 420 780 540 796 Q 660 812 780 790 L 780 860 L 300 860 Z" fill="#2a3324" />
        {/* window frame motif */}
        <g fill="none" stroke="#4a3424" strokeWidth={18}>
          <rect x={300} y={300} width={480} height={560} rx={6} />
          <path d="M 540 300 L 540 860 M 300 580 L 780 580" />
        </g>
        {/* wide-brim hat silhouette peeking into the lower window pane */}
        <g transform={`translate(560 ${860 - 40 * EIO(ramp(p, 0, 0.6))})`}>
          <path d="M -170 0 Q 0 -44 190 0 Q 196 14 176 14 Q 0 -16 -160 14 Q -186 12 -170 0 Z" fill="#050607" />
          <path d="M -64 -6 Q -60 -120 6 -132 Q 82 -120 84 -4 Z" fill="#050607" />
          <path d="M -168 -2 Q 0 -44 188 -2" stroke={MOON} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
        <rect x={0} y={860} width={1080} height={1060} fill="#05070c" opacity={0.0} />
        {Array.from({ length: 7 }, (_, i) => (
          <Note key={i} x={200 + i * 113} y={1010 + Math.sin(t * 2 + i) * 10 + (i % 2) * 30} s={0.75} fill={GOLD} o={0.55 + 0.3 * Math.sin(t * 2 + i * 0.9)} />
        ))}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 1150 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 66, lineHeight: 1.18, color: MOON, opacity: q, transform: `translateY(${(1 - q) * 16}px)` }}>
          Would you look<br />out the window?
        </div>
        <div style={{ marginTop: 56, fontFamily: oswald, fontWeight: 400, fontSize: 46, letterSpacing: '0.2em', color: '#b9b2a0', opacity: c }}>COMMENT</div>
        <div style={{ display: 'flex', gap: 60, marginTop: 22, alignItems: 'center' }}>
          <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 120, color: GOLD, opacity: y, transform: `scale(${0.85 + 0.15 * y})` }}>YES</div>
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 56, color: '#b9b2a0', opacity: n }}>or</div>
          <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 120, color: MOON, opacity: n, transform: `scale(${0.85 + 0.15 * n})` }}>NO</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
