import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600'], subsets: ['latin'] });

const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
const WARM = '#ffb36a';
const PALE = '#efe6d6';

/** Deterministic pseudo-random. */
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** Tall hairy silhouette: shaggy outline built from many hair strands around a broad body. */
const OUTLINE: [number, number][] = [[-250, -40], [-248, -200], [-240, -320], [-200, -410], [-150, -450], [-115, -520], [-80, -580], [-30, -610], [30, -610], [80, -580], [115, -520], [150, -450], [200, -410], [240, -320], [248, -200], [250, -40]];
const BODY = 'M-60,-560 C-120,-555 -150,-500 -170,-430 C-230,-400 -250,-300 -245,-180 L-240,0 L240,0 L245,-180 C250,-300 230,-400 170,-430 C150,-500 120,-555 60,-560 C30,-600 -30,-600 -60,-560 Z';
const HairyFigure: React.FC<{ x: number; y: number; s: number; sway: number }> = ({ x, y, s, sway }) => {
  const strands: string[] = [];
  let k = 0;
  for (let j = 0; j < OUTLINE.length - 1; j++) {
    const [x0, y0] = OUTLINE[j], [x1, y1] = OUTLINE[j + 1];
    const nx = y1 - y0, ny = -(x1 - x0); // outward normal (clockwise outline)
    const nl = Math.hypot(nx, ny) || 1;
    for (let q = 0; q < 9; q++, k++) {
      const u = (q + rnd(k) * 0.8) / 9;
      const px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u;
      const len = 26 + rnd(k + 5) * 46;
      const ox = (nx / nl) * len * 0.8 + sway * 3, oy = (ny / nl) * len * 0.5 + len * 0.6;
      strands.push(`M${px - (nx / nl) * 6},${py - (ny / nl) * 6} q${ox * 0.5},${oy * 0.3} ${ox},${oy}`);
    }
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* warm backlit rim: strands + edge stroke drawn in light, body over it */}
      <g stroke="#ffc27a" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.85}>
        {strands.map((d, i) => <path key={i} d={d} />)}
      </g>
      <path d={BODY} fill="none" stroke="#ffb36a" strokeWidth={14} opacity={0.7} />
      <g stroke="#050302" strokeWidth={4} strokeLinecap="round" fill="none">
        {strands.map((d, i) => <path key={i} d={d} transform="translate(-2,1)" />)}
      </g>
      <path d={BODY} fill="#050302" />
      <rect x={-262} y={-14} width={524} height={30} fill="#050302" />
      <path d="M-230,-330 C-270,-200 -275,-60 -262,60 L-228,62 C-236,-60 -228,-190 -200,-300 Z" fill="#050302" />
      <path d="M230,-330 C270,-200 275,-60 262,60 L228,62 C236,-60 228,-190 200,-300 Z" fill="#050302" />
      {/* faint eyes */}
      <ellipse cx={-26} cy={-470} rx={9} ry={4} fill="#ff7a3a" opacity={0.85} />
      <ellipse cx={26} cy={-470} rx={9} ry={4} fill="#ff7a3a" opacity={0.85} />
    </g>
  );
};

/** shot 2 — title card: warm-lit doorway, tall hairy silhouette filling it, title above. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.05, 0.35, EOUT);
  const b = ramp(p, 0.25, 0.55, EOUT);
  const gw = wordAt(2, /genderuwo/i, 0.7);
  const hl = ramp(t, gw - 0.1, gw + 0.3, EOUT);
  const flick = 0.92 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0705' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <defs>
          <radialGradient id="g2-door" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#ffcf8a" />
            <stop offset="0.5" stopColor="#c46a2c" />
            <stop offset="1" stopColor="#3a1a0c" />
          </radialGradient>
          <radialGradient id="g2-spill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={WARM} stopOpacity={0.35} />
            <stop offset="1" stopColor={WARM} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g2-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a160b" />
            <stop offset="1" stopColor="#0b0705" />
          </linearGradient>
        </defs>
        {/* wall planks */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={i * 122} y={0} width={118} height={1420} fill={i % 2 ? '#140c08' : '#170e09'} />
        ))}
        <ellipse cx={540} cy={1000} rx={620} ry={760} fill="url(#g2-spill)" opacity={flick} />
        {/* floor */}
        <rect x={0} y={1400} width={1080} height={520} fill="url(#g2-floor)" />
        {/* light spill on floor */}
        <path d="M370,1400 L710,1400 L900,1920 L180,1920 Z" fill={WARM} opacity={0.16 * flick} />
        {/* door frame */}
        <rect x={330} y={640} width={420} height={770} fill="#2a170c" />
        <rect x={350} y={660} width={380} height={745} fill="url(#g2-door)" opacity={flick} />
        {/* figure shadow on floor */}
        <path d="M470,1405 L610,1405 L700,1920 L380,1920 Z" fill="#050302" opacity={0.75} />
        <g transform="translate(540,1405) scale(0.66,1.0) translate(-540,-1405)"><HairyFigure x={540} y={1405} s={1.3} sway={Math.sin(t * 0.8)} /></g>
        {/* door leaf, half open */}
        <path d="M730,660 L840,620 L840,1450 L730,1405 Z" fill="#1d110a" />
        <path d="M730,660 L840,620 L840,1450 L730,1405 Z" fill="none" stroke="#3a2214" strokeWidth={4} />
      </svg>
      {/* title */}
      <div style={{ position: 'absolute', top: 210, left: 80, right: 80, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 132, letterSpacing: 6, color: PALE, lineHeight: 1 }}>
          GENDER<span style={{ color: hl > 0.5 ? WARM : PALE }}>UWO</span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 380, left: 80, right: 80, textAlign: 'center', opacity: b }}>
        <div style={{ width: 360 * b, height: 3, background: WARM, margin: '0 auto 22px', opacity: 0.8 }} />
        <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 46, letterSpacing: 12, color: '#d8c3a5' }}>A JAVANESE LEGEND</div>
      </div>
    </AbsoluteFill>
  );
};

/** shot 3 — lore insert: a man's work jacket on a hook, dripping, long dark hairs on the shoulders. */
export const S03: React.FC = () => {
  const { p, t, sec } = useShot();
  const z = EIO(p);
  const hairT = ramp(t, wordAt(3, /face/i, 0.55) - 0.2, wordAt(3, /face/i, 0.55) + 1.0, EOUT);
  const drops = Array.from({ length: 6 }, (_, i) => {
    const per = 1.1 + rnd(i) * 0.6;
    const ph = ((t + rnd(i + 3) * per) % per) / per;
    return { x: [300, 330, 450, 610, 750, 780][i], y: 1210 + ph * 190, o: ph < 0.85 ? 1 : (1 - ph) / 0.15 };
  });
  const hairs: string[] = [];
  for (let i = 0; i < 14; i++) {
    const left = i < 7;
    const sx = left ? 385 + rnd(i) * 80 : 615 + rnd(i) * 80;
    const sy = 540 + rnd(i + 2) * 40;
    const len = 260 + rnd(i + 4) * 260;
    const c = (rnd(i + 6) - 0.5) * 80;
    hairs.push(`M${sx},${sy} c${c},${len * 0.3} ${-c},${len * 0.6} ${c * 0.5},${len}`);
  }
  void sec;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e0a08' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.07 * z})`, transformOrigin: '540px 820px' }}>
        <defs>
          <radialGradient id="g3-lamp" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0" stopColor="#6b4a2c" />
            <stop offset="0.6" stopColor="#24170e" />
            <stop offset="1" stopColor="#0e0a08" />
          </radialGradient>
          <linearGradient id="g3-jacket" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1f2a24" />
            <stop offset="0.5" stopColor="#3a4a3c" />
            <stop offset="1" stopColor="#1a221d" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#g3-lamp)" />
        {/* wall hook + wire hanger */}
        <rect x={510} y={330} width={60} height={26} rx={6} fill="#2b2420" />
        <path d="M540,356 L540,400 Q540,430 565,425 Q585,418 572,400" stroke="#8a7a66" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M572,400 Q560,440 540,470 L340,575 L740,575 L540,470" stroke="#b5a88f" strokeWidth={6} fill="none" strokeLinejoin="round" />
        {/* sleeves (behind body) */}
        <path d="M372,560 C330,575 305,630 300,720 L282,1110 L352,1122 L368,820 C372,720 380,640 395,600 Z" fill="#26312a" />
        <path d="M708,560 C750,575 775,630 780,720 L798,1110 L728,1122 L712,820 C708,720 700,640 685,600 Z" fill="#26312a" />
        <path d="M282,1080 L352,1092 L352,1122 L282,1110 Z" fill="#18201b" />
        <path d="M728,1092 L798,1080 L798,1110 L728,1122 Z" fill="#18201b" />
        {/* body */}
        <path d="M480,500 L372,560 C380,620 385,700 380,800 L372,1200 L708,1200 L700,800 C695,700 700,620 708,560 L600,500 Z" fill="url(#g3-jacket)" />
        <path d="M378,1170 L702,1170 L708,1200 L372,1200 Z" fill="#1a221d" />
        {/* shirt collar points + lapels */}
        <path d="M480,500 L540,600 L600,500 L575,490 L540,555 L505,490 Z" fill="#141b17" />
        <path d="M478,500 L452,600 L530,590 Z" fill="#33433a" stroke="#141b17" strokeWidth={4} />
        <path d="M602,500 L628,600 L550,590 Z" fill="#33433a" stroke="#141b17" strokeWidth={4} />
        <path d="M540,600 L540,1200" stroke="#141b17" strokeWidth={6} />
        {[680, 790, 900, 1010, 1120].map((y) => <circle key={y} cx={555} cy={y} r={8} fill="#8a7a66" />)}
        {/* chest pockets with flaps */}
        <rect x={425} y={700} width={88} height={100} rx={4} fill="#2e3b33" stroke="#141b17" strokeWidth={4} />
        <path d="M421,694 L517,694 L517,728 L469,740 L421,728 Z" fill="#26312a" stroke="#141b17" strokeWidth={4} />
        <rect x={567} y={700} width={88} height={100} rx={4} fill="#2e3b33" stroke="#141b17" strokeWidth={4} />
        <path d="M563,694 L659,694 L659,728 L611,740 L563,728 Z" fill="#26312a" stroke="#141b17" strokeWidth={4} />
        {/* seam between sleeve and body */}
        <path d="M380,600 L376,1180" stroke="#101612" strokeWidth={5} />
        <path d="M700,600 L704,1180" stroke="#101612" strokeWidth={5} />
        {/* wet sheen */}
        <path d="M600,560 C660,600 700,700 700,900" stroke="#9fb3a2" strokeWidth={6} opacity={0.25} fill="none" />
        {/* long dark hairs */}
        <g stroke="#050302" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * hairT}>
          {hairs.map((d, i) => <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, 0.35 + hairT * 0.65)} />)}
        </g>
        {/* drips */}
        {drops.map((d, i) => <ellipse key={i} cx={d.x} cy={d.y} rx={5} ry={9} fill="#a9c0c8" opacity={0.7 * d.o} />)}
        {/* puddle */}
        <ellipse cx={540} cy={1420} rx={260} ry={26} fill="#2a3a40" opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: dark doorway + phone glowing on the floor, question and YES / NO. */
export const S13: React.FC = () => {
  const { p, t, sec } = useShot();
  const cap = (x: number) => Math.min(x, sec - 1.0);
  const q = ramp(t, cap(wordAt(13, /would/i, 0.05)) - 0.1, cap(wordAt(13, /would/i, 0.05)) + 0.4, EOUT);
  const c = ramp(t, cap(wordAt(13, /comment/i, 0.4)), cap(wordAt(13, /comment/i, 0.4)) + 0.3, EOUT);
  const y = ramp(t, cap(wordAt(13, /yes/i, 0.55)), cap(wordAt(13, /yes/i, 0.55)) + 0.3, EOUT);
  const n = ramp(t, cap(wordAt(13, /^no\.?$/i, 0.75)), cap(wordAt(13, /^no\.?$/i, 0.75)) + 0.3, EOUT);
  const glow = 0.8 + 0.2 * Math.sin(t * 3);
  void p;
  const pill = (txt: string, k: number, col: string): React.ReactNode => (
    <div style={{ opacity: k, transform: `scale(${0.8 + 0.2 * k})`, border: `4px solid ${col}`, borderRadius: 18, padding: '10px 54px', fontFamily: oswald, fontWeight: 600, fontSize: 96, color: col, letterSpacing: 4 }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#080605' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <radialGradient id="g13-door" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#5a3418" />
            <stop offset="1" stopColor="#120a06" />
          </radialGradient>
          <radialGradient id="g13-phone" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe6c4" stopOpacity={0.4} />
            <stop offset="1" stopColor="#ffe6c4" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* door, ajar, dark gap */}
        <rect x={300} y={640} width={480} height={860} fill="#1a100a" />
        <rect x={320} y={660} width={440} height={840} fill="url(#g13-door)" />
        <path d="M560,660 L760,620 L760,1540 L560,1500 Z" fill="#0d0805" />
        {/* long dark fingers curling round the door edge */}
        <g fill="#050302">
          <path d="M574,913 C508,909 464,911 448,927 C443,937 446,951 453,957 C458,961 462,956 460,949 C458,940 462,934 474,932 C513,928 560,930 574,933 Z" />
          <path d="M574,966 C501,962 440,964 424,980 C419,990 422,1004 429,1010 C434,1014 438,1009 436,1002 C434,993 438,987 450,985 C506,981 560,983 574,986 Z" />
          <path d="M574,1020 C505,1016 451,1018 435,1034 C430,1044 433,1058 440,1064 C445,1068 449,1063 447,1056 C445,1047 449,1041 461,1039 C510,1035 560,1037 574,1040 Z" />
          <path d="M574,1072 C519,1068 494,1070 478,1086 C473,1096 476,1110 483,1116 C488,1120 492,1115 490,1108 C488,1099 492,1093 504,1091 C524,1087 560,1089 574,1092 Z" />
        </g>
        {/* floor + phone */}
        <rect x={0} y={1500} width={1080} height={420} fill="#0c0806" />
        <ellipse cx={540} cy={1660} rx={380} ry={130} fill="url(#g13-phone)" opacity={glow} />
        <g transform="translate(540,1660) rotate(-16) scale(1,0.62)">
          <rect x={-80} y={-150} width={160} height={300} rx={22} fill="#0a0a0a" stroke="#3a3a3a" strokeWidth={5} />
          <rect x={-68} y={-132} width={136} height={264} rx={10} fill="#fff4e4" opacity={0.9 * glow} />
          <rect x={-22} y={-128} width={44} height={10} rx={5} fill="#0a0a0a" />
          <text x={0} y={-40} textAnchor="middle" fontFamily={oswald} fontSize={52} fill="#3a2a20" opacity={0.7}>3:07</text>
          <rect x={-50} y={10} width={100} height={34} rx={10} fill="#3a2a20" opacity={0.35} />
          <rect x={-50} y={54} width={100} height={34} rx={10} fill="#3a2a20" opacity={0.25} />
        </g>
      </svg>
      <div style={{ position: 'absolute', top: 230, left: 80, right: 80, textAlign: 'center', opacity: q, transform: `translateY(${(1 - q) * 24}px)` }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 84, color: PALE, lineHeight: 1.15 }}>Would you have<br />noticed?</div>
      </div>
            <div style={{ position: 'absolute', top: 470, left: 80, right: 80, textAlign: 'center', opacity: c, fontFamily: oswald, fontSize: 52, letterSpacing: 10, color: '#d8c3a5' }}>COMMENT</div>
      <div style={{ position: 'absolute', top: 1180, left: 80, right: 80, display: 'flex', justifyContent: 'center', gap: 60 }}>
        {pill('YES', y, GREEN)}
        {pill('NO', n, '#f4f0e8')}
      </div>
    </AbsoluteFill>
  );
};
