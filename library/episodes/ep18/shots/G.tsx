import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600'], subsets: ['latin'] });

const MOON = '#cdd6ee';
const LAMP = '#ffbf6b';
const CAPIZ = '#e9e2cf';
const GARLIC = '#efe6d2';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Huge hunched crow-like bird perched on a ridge, 3/4 view facing right, wings half folded. Origin = feet. */
const Bird: React.FC<{ x: number; y: number; s: number; flap?: number; eye?: number }> = ({ x, y, s, flap = 0, eye = 1 }) => {
  const f = flap;
  return (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* far wing, half raised behind the back */}
    <path d={`M 10 -270 C -50 ${-360 - f * 70} -170 ${-400 - f * 90} -290 ${-370 - f * 80} L -262 ${-342 - f * 60} L -335 ${-322 - f * 55} L -275 ${-304 - f * 40} L -345 ${-276 - f * 30} L -268 ${-266 - f * 20} L -318 -228 L -220 -238 Z`} fill="#07070b" />
    <path d={`M 10 -270 C -50 ${-360 - f * 70} -170 ${-400 - f * 90} -290 ${-370 - f * 80}`} fill="none" stroke={MOON} strokeOpacity={0.35} strokeWidth={3} />
    {/* legs gripping the ridge */}
    <path d="M 10 -40 L 0 0 M 50 -40 L 46 2 M -14 2 L 16 2 M 34 4 L 62 4" stroke="#050507" strokeWidth={9} strokeLinecap="round" />
    {/* hunched body + tail */}
    <path d="M 40 -20 C 110 -50 150 -130 130 -220 C 122 -256 104 -278 84 -292 L 40 -302 C -20 -334 -120 -322 -190 -262 C -250 -202 -290 -122 -330 -42 L -405 42 L -378 48 L -352 28 L -360 72 L -318 40 L -304 66 L -262 2 C -180 -12 -60 -14 40 -20 Z" fill="#050507" />
    {/* long neck + head, beak in profile (slightly hooked) */}
    <path d="M 36 -296 C 46 -362 88 -412 138 -432 C 168 -444 198 -436 212 -414 C 236 -414 262 -408 280 -396 C 286 -390 284 -380 276 -378 C 268 -386 252 -384 236 -380 L 212 -380 C 196 -372 168 -362 150 -342 L 162 -328 L 140 -322 L 150 -300 L 126 -298 L 132 -270 L 110 -262 C 104 -240 96 -230 84 -226 Z" fill="#050507" />
    {/* near wing, folded along the body, ragged primaries trailing past the tail */}
    <path d="M 84 -226 C 30 -272 -96 -284 -176 -232 C -236 -192 -276 -122 -316 -46 L -428 26 L -364 8 L -410 62 L -336 22 L -352 86 L -292 22 C -200 -38 -84 -62 18 -80 C 72 -102 96 -170 84 -226 Z" fill="#0c0c12" />
    {/* covert feather rows (ragged, low contrast) */}
    <path d="M -150 -200 L -130 -176 L -110 -204 L -90 -180 L -70 -208 L -50 -184 L -30 -210 L -10 -186 L 10 -212 L 30 -190 L 50 -214" fill="none" stroke="#1d1d28" strokeWidth={3} strokeOpacity={0.5} />
    <path d="M -230 -110 L -200 -90 L -180 -122 L -150 -100 L -130 -132 L -100 -110 L -80 -140 L -50 -118 L -30 -146" fill="none" stroke="#1d1d28" strokeWidth={3} strokeOpacity={0.5} />
    {/* moon rim light: back, nape, head, beak top */}
    <path d="M 40 -302 C -20 -334 -120 -322 -190 -262 C -250 -202 -290 -122 -330 -42" fill="none" stroke={MOON} strokeOpacity={0.55} strokeWidth={4} />
    <path d="M 36 -296 C 46 -362 88 -412 138 -432 C 168 -444 198 -436 212 -414 C 236 -414 262 -408 280 -396" fill="none" stroke={MOON} strokeOpacity={0.6} strokeWidth={3.5} />
    <path d="M 84 -292 C 104 -278 122 -256 130 -220" fill="none" stroke={MOON} strokeOpacity={0.2} strokeWidth={3} />
    {/* eye */}
    <circle cx={186} cy={-410} r={26} fill="url(#g-eyeglow)" opacity={eye} />
    <circle cx={186} cy={-410} r={7} fill={LAMP} opacity={eye} />
  </g>
  );
};

/** shot 2 — title: huge black bird on a thatched roof against a full moon. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.02, 0.3, EOUT);
  const b = ramp(p, 0.2, 0.45, EOUT);
  const sw = wordAt(2, /aswang/i, 0.75);
  const flap = ramp(t, sw, sw + 0.35, EOUT) * (1 - ramp(t, sw + 0.35, sw + 0.9, EIO));
  return (
    <AbsoluteFill style={{ backgroundColor: '#06070d' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <defs>
          <linearGradient id="g2-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05060c" />
            <stop offset="0.45" stopColor="#1b2140" />
            <stop offset="0.75" stopColor="#2c2a4a" />
            <stop offset="1" stopColor="#0a0a12" />
          </linearGradient>
          <radialGradient id="g2-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={MOON} stopOpacity={0.55} />
            <stop offset="0.4" stopColor="#8f97c4" stopOpacity={0.22} />
            <stop offset="1" stopColor="#8f97c4" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g2-moon" cx="0.42" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#f4f6ff" />
            <stop offset="1" stopColor={MOON} />
          </radialGradient>
          <radialGradient id="g-eyeglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={LAMP} stopOpacity={0.6} />
            <stop offset="1" stopColor={LAMP} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g2-win" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={LAMP} stopOpacity={0.5} />
            <stop offset="1" stopColor={LAMP} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g2-sky)" />
        <circle cx={600} cy={780} r={620} fill="url(#g2-halo)" />
        <circle cx={600} cy={780} r={270} fill="url(#g2-moon)" />
        <circle cx={520} cy={720} r={40} fill="#b9c1dd" opacity={0.35} />
        <circle cx={690} cy={860} r={28} fill="#b9c1dd" opacity={0.3} />
        {/* far palms */}
        <g fill="#0d0f1a">
          <path d="M 0 1180 Q 200 1130 380 1170 Q 600 1120 800 1165 Q 960 1140 1080 1170 L 1080 1920 L 0 1920 Z" />
          <path d="M 130 1180 Q 140 1000 170 880" stroke="#0d0f1a" strokeWidth={12} fill="none" />
          <path d="M 170 880 Q 90 850 40 900 M 170 880 Q 240 840 300 880 M 170 880 Q 120 820 90 800 M 170 880 Q 220 820 260 810 M 170 880 Q 160 830 180 790" stroke="#0d0f1a" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M 960 1180 Q 950 1020 920 930" stroke="#0d0f1a" strokeWidth={12} fill="none" />
          <path d="M 920 930 Q 840 900 800 950 M 920 930 Q 990 890 1060 930 M 920 930 Q 880 870 850 850 M 920 930 Q 970 870 1010 860" stroke="#0d0f1a" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
        {/* nipa hut: thatched roof + stilts */}
        <path d="M 150 1290 L 540 1050 L 930 1290 Z" fill="#0b0a0c" />
        <path d="M 150 1290 L 540 1050 L 930 1290" fill="none" stroke={MOON} strokeOpacity={0.3} strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${230 + i * 30} ${1260 - i * 18} L ${850 - i * 30} ${1260 - i * 18}`} stroke="#17141a" strokeWidth={3} />)}
        <path d="M 120 1300 Q 540 1320 960 1300 L 930 1290 L 150 1290 Z" fill="#0b0a0c" />
        <rect x={230} y={1300} width={620} height={170} fill="#2a2318" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M 230 ${1330 + i * 38} L 850 ${1330 + i * 38}`} stroke="#1a150e" strokeWidth={6} />)}
        <rect x={470} y={1340} width={140} height={90} fill={LAMP} opacity={0.75} />
        <ellipse cx={540} cy={1385} rx={180} ry={110} fill="url(#g2-win)" />
        <path d="M 540 1340 L 540 1430 M 470 1385 L 610 1385" stroke="#120f12" strokeWidth={6} />
        {[260, 420, 660, 820].map((x) => <rect key={x} x={x} y={1470} width={18} height={180} fill="#08070a" />)}
        <rect x={0} y={1640} width={1080} height={280} fill="#050507" />
        <Bird x={510} y={1068} s={1.15 + 0.03 * z} flap={flap} eye={ramp(p, 0.12, 0.3)} />
        {/* foreground leaves */}
        <path d="M -20 1920 Q 80 1500 0 1200 Q 160 1500 140 1920 Z" fill="#020303" />
        <path d="M 1100 1920 Q 980 1560 1080 1260 Q 900 1540 940 1920 Z" fill="#020303" />
        <path d="M -30 260 Q 200 220 380 120 Q 220 300 -30 380 Z" fill="#020303" />
      </svg>
      {/* title block */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 180, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 160, letterSpacing: 14, color: '#eef0fa', lineHeight: 1 }}>ASWANG</div>
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 400, textAlign: 'center', opacity: b }}>
        <div style={{ height: 3, width: 300 * b, margin: '0 auto 22px', background: GREEN }} />
        <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 46, letterSpacing: 12, color: GREEN }}>A PHILIPPINE LEGEND</div>
      </div>
          </AbsoluteFill>
  );
};

/** shot 3 — lore: capiz window lit from inside, a huge wing shadow passes over it. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const tNight = wordAt(3, /^night/i, 0.4);
  const tBaby = wordAt(3, /^baby/i, 0.92);
  // wing sweep across the window on "Hungry at night", second slow pass on "baby"
  const s1 = ramp(t, tNight - 1.4, tNight + 1.6, EIO);
  const s2 = ramp(t, tBaby - 1.4, tBaby + 0.4, EIO);
  const wx1 = -900 + 2300 * s1;
  const wx2 = -900 + 1500 * s2;
  const lampFl = 0.92 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1);
  const panes: React.ReactNode[] = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) {
    const x = 290 + c * 100, y = 470 + r * 100;
    const d = Math.hypot(x + 45 - 540, y + 45 - 900) / 500;
    panes.push(<rect key={`${r}-${c}`} x={x + 6} y={y + 6} width={88} height={88} rx={4} fill={CAPIZ} opacity={0.95 - 0.45 * d} />);
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.07 * z})`, transformOrigin: '540px 860px' }}>
        <defs>
          <linearGradient id="g3-wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a2318" />
            <stop offset="1" stopColor="#0d0a07" />
          </linearGradient>
          <radialGradient id="g3-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={LAMP} stopOpacity={0.55} />
            <stop offset="0.5" stopColor={LAMP} stopOpacity={0.15} />
            <stop offset="1" stopColor={LAMP} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g3-pane" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#fff2d6" />
            <stop offset="1" stopColor={LAMP} />
          </radialGradient>
          <clipPath id="g3-win"><rect x={290} y={470} width={500} height={700} /></clipPath>
        </defs>
        {/* woven bamboo wall outside */}
        <rect width={1080} height={1920} fill="url(#g3-wall)" />
        {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M 0 ${i * 80 + 20} L 1080 ${i * 80 + 60}`} stroke="#000" strokeOpacity={0.22} strokeWidth={10} />)}
        <ellipse cx={540} cy={820} rx={620} ry={720} fill="url(#g3-glow)" opacity={lampFl} />
        {/* window frame */}
        <rect x={260} y={440} width={560} height={760} fill="#140f0a" />
        <rect x={290} y={470} width={500} height={700} fill="url(#g3-pane)" opacity={lampFl} />
        <g clipPath="url(#g3-win)">
          <rect x={290} y={470} width={500} height={700} fill="#3a2a18" />
          {panes}
          {/* wing shadow passes (inside window) */}
          <g transform={`translate(${wx1} 700) rotate(-8)`} opacity={0.88}>
            <path d="M 0 120 C 120 -40 360 -120 640 -70 L 560 -20 L 660 0 L 560 40 L 650 80 L 530 90 L 610 140 L 470 140 L 520 200 L 390 170 L 400 240 L 290 190 L 260 250 L 180 200 C 120 200 60 205 0 200 Z" fill="#0a0806" />
          </g>
          <g transform={`translate(${wx2} 840) rotate(4) scale(1.3)`} opacity={0.75}>
            <path d="M 0 120 C 120 -40 360 -120 640 -70 L 560 -20 L 660 0 L 560 40 L 650 80 L 530 90 L 610 140 L 470 140 L 520 200 L 390 170 L 400 240 L 290 190 L 260 250 L 180 200 C 120 200 60 205 0 200 Z" fill="#0a0806" />
          </g>
        </g>
        {/* lattice */}
        {[1, 2, 3, 4].map((c) => <rect key={`c${c}`} x={290 + c * 100 - 4} y={470} width={8} height={700} fill="#140f0a" />)}
        {[1, 2, 3, 4, 5, 6].map((r) => <rect key={`r${r}`} x={290} y={470 + r * 100 - 4} width={500} height={8} fill="#140f0a" />)}
        <rect x={536} y={470} width={8} height={700} fill="#0b0805" />
        {/* sill + spill of light */}
        <rect x={230} y={1200} width={620} height={34} fill="#1d150d" />
        <path d="M 236 1200 L 844 1200" stroke={LAMP} strokeOpacity={0.6} strokeWidth={3} />
        {/* garlic hanging by the window */}
        <path d="M 880 420 L 880 700" stroke="#3d3322" strokeWidth={5} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${880 + (i % 2 ? 14 : -10)} ${560 + i * 70})`}>
            <path d="M 0 -34 C 30 -20 34 20 0 34 C -34 20 -30 -20 0 -34 Z" fill={GARLIC} opacity={0.75} />
            <path d="M 0 -34 L 0 34" stroke="#b9ad94" strokeWidth={2} opacity={0.6} />
          </g>
        ))}
        {/* outside: wing shadow over the wall too (big, soft) */}
        <g transform={`translate(${wx1 - 200} 520) scale(1.8) rotate(-8)`} opacity={0.35}>
          <path d="M 0 120 C 120 -40 360 -120 640 -70 L 560 -20 L 660 0 L 560 40 L 650 80 L 530 90 L 610 140 L 470 140 L 520 200 L 390 170 L 400 240 L 290 190 L 260 250 L 180 200 C 120 200 60 205 0 200 Z" fill="#000" />
        </g>
        {/* foreground banana leaf framing */}
        <path d="M -40 1920 Q 60 1400 -40 1000 Q 230 1420 200 1920 Z" fill="#060807" />
        <path d="M 1120 0 Q 900 200 760 120 Q 960 330 1120 260 Z" fill="#060807" />
        <path d="M 1120 1920 Q 960 1650 1120 1380 Z" fill="#060807" />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: an eye with an upside-down reflection, garlic and a black feather; on-screen text. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const cap = Math.max(0.2, sec - 0.9); // all text fully visible >= 0.5 s before end
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap - 0.3);
  const tq = at(/^Would/i, 0.06);
  const tc = at(/^Comment/i, 0.55);
  const ty = at(/^YES/i, 0.64);
  const tn = at(/^NO/i, 0.82);
  const fade = (t0: number) => ramp(t, t0, t0 + 0.3, EOUT);
  const q = fade(tq), c = fade(tc), y = fade(ty), n = fade(tn);
  const blink = 1 - Math.max(0, 1 - Math.abs(t - (tc - 0.25)) / 0.12) ;
  const z = EIO(p);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060b' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <radialGradient id="g13-bg" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#2a2140" />
            <stop offset="0.6" stopColor="#0f0c18" />
            <stop offset="1" stopColor="#050408" />
          </radialGradient>
          <radialGradient id="g13-iris" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1a1208" />
            <stop offset="0.55" stopColor="#4a3218" />
            <stop offset="0.9" stopColor="#6b4a22" />
            <stop offset="1" stopColor="#1a1208" />
          </radialGradient>
          <radialGradient id="g13-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={GREEN} stopOpacity={0.35} />
            <stop offset="1" stopColor={GREEN} stopOpacity={0} />
          </radialGradient>
          <clipPath id="g13-eye"><path d="M 220 760 Q 540 520 860 760 Q 540 960 220 760 Z" /></clipPath>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <ellipse cx={540} cy={760} rx={520} ry={360} fill="url(#g13-glow)" />
        {/* eye */}
        <g transform={`translate(540 760) scale(${1 + 0.04 * z}) translate(-540 -760)`}>
          <path d="M 200 760 Q 540 480 880 760 Q 540 1000 200 760 Z" fill="#1a1420" />
          <g clipPath="url(#g13-eye)" transform={`translate(540 760) scale(1 ${Math.max(0.05, blink)}) translate(-540 -760)`}>
            <rect x={200} y={500} width={700} height={500} fill="#cfc7bb" />
            <circle cx={540} cy={760} r={150} fill="url(#g13-iris)" />
            <circle cx={540} cy={760} r={64} fill="#050307" />
            {/* upside-down reflection: tiny inverted figure */}
            <g transform="translate(570 730) scale(1 -1)" fill={CAPIZ} opacity={0.85}>
              <circle cx={0} cy={-26} r={7} />
              <path d="M -8 -18 L 8 -18 L 12 14 L -12 14 Z" />
              <path d="M -6 14 L -4 26 M 6 14 L 4 26" stroke={CAPIZ} strokeWidth={3} />
            </g>
            <ellipse cx={500} cy={720} rx={14} ry={9} fill="#fff" opacity={0.7} />
          </g>
          <path d="M 200 760 Q 540 480 880 760" fill="none" stroke="#050307" strokeWidth={18} strokeLinecap="round" />
          <path d="M 200 760 Q 540 1000 880 760" fill="none" stroke="#1a1420" strokeWidth={8} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = 260 + i * 95; const yy = 760 - 280 * (1 - Math.pow((x - 540) / 340, 2)) * 0.62; return <path key={i} d={`M ${x} ${yy} Q ${x - 10 + i * 3} ${yy - 40} ${x - 20 + i * 6} ${yy - 62}`} stroke="#050307" strokeWidth={6} fill="none" strokeLinecap="round" />; })}
        </g>
        {/* black feather, left */}
        <g transform={`translate(150 1820) scale(1.25) rotate(${24 + Math.sin(t * 1.3) * 2})`}>
          <path d="M 0 0 L 0 -340" stroke="#2a2430" strokeWidth={5} />
          <path d="M 0 -340 C -70 -280 -80 -120 -10 -20 L 0 0 C 50 -110 60 -260 0 -340 Z" fill="#2a2238" />
          <path d="M 0 -340 C 50 -260 60 -120 0 0" fill="none" stroke={GREEN} strokeOpacity={0.55} strokeWidth={4} />
          <path d="M 0 -340 C -70 -280 -80 -120 -10 -20" fill="none" stroke={MOON} strokeOpacity={0.25} strokeWidth={3} />
          {[-290, -250, -210, -170, -130, -90].map((yy) => <path key={yy} d={`M 0 ${yy} L -40 ${yy + 34} M 0 ${yy} L 36 ${yy + 30}`} stroke="#0b0910" strokeWidth={3} />)}
        </g>
        {/* garlic, right */}
        {[[860, 1600, 1.35], [990, 1650, 1.05], [740, 1680, 1]].map(([x, yy, s], i) => (
          <g key={i} transform={`translate(${x} ${yy}) scale(${s})`}>
            <path d="M 0 -80 C 70 -60 90 40 0 60 C -90 40 -70 -60 0 -80 Z" fill={GARLIC} />
            <path d="M 0 -80 C -30 -30 -30 20 0 60 M 0 -80 C 30 -30 30 20 0 60" fill="none" stroke="#c9bda4" strokeWidth={3} />
            <path d="M 0 -80 Q 4 -110 -4 -130" stroke="#c9bda4" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M -60 10 C -40 40 40 40 60 10" fill="none" stroke="#8a7f6a" strokeWidth={3} opacity={0.6} />
          </g>
        ))}
      </svg>
      {/* text inside 920 safe width */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1080, textAlign: 'center' }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 72, lineHeight: 1.15, color: '#eeeaf6', opacity: q, transform: `translateY(${(1 - q) * 20}px)` }}>Would you look<br />into her eyes?</div>
        <div style={{ marginTop: 50, fontFamily: oswald, fontWeight: 600, fontSize: 64, letterSpacing: 4, color: '#eeeaf6', opacity: c }}>
          COMMENT{' '}
          <span style={{ color: GREEN, opacity: y, display: 'inline-block', transform: `scale(${0.8 + 0.2 * y})` }}>YES</span>
          <span style={{ opacity: y }}> OR </span>
          <span style={{ color: GREEN, opacity: n, display: 'inline-block', transform: `scale(${0.8 + 0.2 * n})` }}>NO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
