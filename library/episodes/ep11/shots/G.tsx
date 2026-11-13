import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { TuyulSil, Coin, Marble, Crab, BULB } from '../art/graphic_tuyul';

const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700', '900'], subsets: ['latin'] });

const PALE = '#f1e6cf';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared warm room backdrop: dark wall, bulb glow at (bx,by), wooden floor from floorY. */
const Room: React.FC<{ bx: number; by: number; floorY: number; glow: number; id: string }> = ({ bx, by, floorY, glow, id }) => (
  <g>
    <defs>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={BULB} stopOpacity={0.6} />
        <stop offset="0.35" stopColor="#c47a2c" stopOpacity={0.28} />
        <stop offset="1" stopColor="#2a1a10" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a3e26" />
        <stop offset="0.5" stopColor="#3a2a1e" />
        <stop offset="1" stopColor="#140d08" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#120c09" />
    <ellipse cx={bx} cy={by + 300} rx={900} ry={900} fill={`url(#${id}-glow)`} opacity={glow} />
    <rect y={floorY} width={1080} height={1920 - floorY} fill={`url(#${id}-floor)`} />
    {/* perspective planks */}
    {[-6, -4, -2, 0, 2, 4, 6, 8, -8].map((i) => (
      <path key={i} d={`M ${540 + i * 40} ${floorY} L ${540 + i * 260} 1920`} stroke="#1a110b" strokeWidth={5} opacity={0.75} />
    ))}
    <path d={`M 0 ${floorY} L 1080 ${floorY}`} stroke="#140d08" strokeWidth={10} />
    <ellipse cx={bx} cy={floorY + 140} rx={520} ry={120} fill={`url(#${id}-glow)`} opacity={glow * 0.7} />
  </g>
);

const Bulb: React.FC<{ x: number; y: number; sw: number }> = ({ x, y, sw }) => (
  <g transform={`rotate(${sw} ${x} 0)`}>
    <path d={`M ${x} 0 L ${x} ${y - 40}`} stroke="#0a0706" strokeWidth={5} />
    <rect x={x - 16} y={y - 48} width={32} height={30} rx={4} fill="#1a1410" />
    <defs>
      <radialGradient id="bulb-halo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff3cc" stopOpacity={0.7} />
        <stop offset="0.3" stopColor={BULB} stopOpacity={0.25} />
        <stop offset="1" stopColor={BULB} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={170} fill="url(#bulb-halo)" />
    <circle cx={x} cy={y} r={30} fill="#fff3cc" />
    <circle cx={x} cy={y} r={20} fill="#ffffff" />
  </g>
);

/* ---------------- shot 2: title card ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const tu = wordAt(2, /^tuyul/, 0.8);
  const eye = ramp(t, tu - 0.05, tu + 0.2, EOUT);
  const flick = 0.9 + 0.06 * Math.sin(t * 3.3) + 0.04 * Math.sin(t * 7.1);
  const sw = 1.5 * Math.sin(t * 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#120c09' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1150px' }}>
        <Room bx={760} by={700} floorY={1180} glow={flick} id="g2" />
        <Bulb x={760} y={640} sw={sw} />
        {/* long shadow on floor away from bulb */}
        <ellipse cx={440} cy={1330} rx={170} ry={26} fill="#0a0604" opacity={0.7} transform="rotate(-8 440 1330)" />
        <TuyulSil x={500} y={1320} s={0.98} lean={-1} />
        {/* eyes glint brighter on "tuyul" */}
        <g opacity={eye}>
          <circle cx={500 - 29.4} cy={1320 - 446 * 0.98} r={20} fill={BULB} opacity={0.08} />
          <circle cx={500 + 29.4} cy={1320 - 446 * 0.98} r={20} fill={BULB} opacity={0.08} />
        </g>
        {/* foreground dark framing: counter edge + door post */}
        <path d="M 0 1520 L 1080 1460 L 1080 1920 L 0 1920 Z" fill="#0a0706" />
        <rect x={-10} y={0} width={80} height={1920} fill="#0a0706" />
        <rect x={1000} y={0} width={90} height={1920} fill="#0a0706" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 190 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 900, fontSize: 196, lineHeight: 1, letterSpacing: '0.12em', marginRight: '-0.12em',
          color: PALE, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap',
          textShadow: '0 4px 0 #3a2a1e',
        }}>TUYUL</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, rgba(0,0,0,0), ${GREEN})` }} />
          <div style={{ fontFamily: oswald, fontWeight: 400, fontSize: 46, letterSpacing: '0.2em', color: '#e0c48c', whiteSpace: 'nowrap' }}>AN INDONESIAN LEGEND</div>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(0,0,0,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: coins and a marble rolling on the floor ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const play = wordAt(3, /^playing/, 0.85);
  const tPlay = ramp(t, play - 1.0, play + 0.2, EIO);
  // marble rolls right->left, coins left->right, all along the floor
  const mx = 1180 - 860 * ramp(p, 0.0, 0.95, EOUT);
  const my = 1120 + 30 * Math.sin(p * 3);
  const coins = [
    { x0: -160, y: 1010, r: 62, d: 0.0, sp: 760 },
    { x0: -300, y: 1230, r: 84, d: 0.12, sp: 820 },
    { x0: -200, y: 880, r: 44, d: 0.28, sp: 640 },
  ];
  const flick = 0.92 + 0.08 * Math.sin(t * 2.7);
  return (
    <AbsoluteFill style={{ backgroundColor: '#120c09' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.06 * z})`, transformOrigin: '540px 1100px' }}>
        <Room bx={560} by={260} floorY={700} glow={flick} id="g3" />
        {/* a low cabinet/counter base far back */}
        <rect x={80} y={520} width={520} height={190} fill="#1c130d" />
        <rect x={80} y={520} width={520} height={10} fill="#5a3e26" opacity={0.6} />
        {/* coins */}
        {coins.map((c, i) => {
          const k = ramp(p, c.d, Math.min(1, c.d + 0.75), EOUT);
          const x = c.x0 + c.sp * k + i * 120;
          const wob = Math.sin(t * 9 + i) * (1 - k);
          const tilt = 0.25 + 0.15 * Math.abs(Math.sin(t * 5 + i)) * (1 - k * 0.5);
          return (
            <g key={i}>
              <ellipse cx={x} cy={c.y + c.r * 0.5} rx={c.r * 1.1} ry={c.r * 0.2} fill="#0a0604" opacity={0.6} />
              <Coin x={x} y={c.y} r={c.r} tilt={tilt} rot={wob * 10 + 4} id={`c3-${i}`} />
            </g>
          );
        })}
        {/* resting coin pile near the marble's target */}
        <Coin x={200} y={1330} r={70} tilt={0.3} id="c3-r1" />
        <Coin x={240} y={1300} r={70} tilt={0.3} id="c3-r2" />
        {/* marble */}
        <ellipse cx={mx} cy={my + 86} rx={100} ry={18} fill="#0a0604" opacity={0.6} />
        <Marble x={mx} y={my} r={84} spin={-(1180 - mx) * 0.7} />
        {/* tiny hand shadow reaching in on "playing" (implied tuyul) */}
        <g opacity={0.85 * tPlay} transform={`translate(${1080 - 300 * tPlay} 1040) scale(1.4)`}>
          <path d="M 300 30 Q 180 20 110 18 Q 90 22 96 40 L 110 80 Q 160 96 300 92 Z" fill="#0a0604" />
          <g stroke="#0a0604" strokeWidth={16} strokeLinecap="round" fill="none">
            <path d="M 104 26 Q 70 6 34 2" />
            <path d="M 100 40 Q 60 34 22 36" />
            <path d="M 102 56 Q 64 62 30 70" />
            <path d="M 108 72 Q 78 86 50 98" />
            <path d="M 130 84 Q 116 108 96 120" />
          </g>
          <path d="M 300 28 Q 180 18 110 16 Q 74 4 36 0" stroke={BULB} strokeWidth={3} opacity={0.35} fill="none" />
        </g>
        {/* foreground dark floor edge + chair leg */}
        <path d="M 0 1560 Q 540 1500 1080 1560 L 1080 1920 L 0 1920 Z" fill="#0a0706" opacity={0.9} />
        <rect x={880} y={0} width={70} height={1600} fill="#0a0706" />
        <rect x={-20} y={0} width={60} height={1920} fill="#0a0706" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA end card ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const crabT = Math.min(wordAt(13, /^crab/, 0.35), sec - 0.85);
  const crabIn = ramp(t, crabT - 0.2, crabT + 0.5, EOUT);
  const claw = Math.sin(t * 6) * 0.5 + 0.5;
  const flick = 0.92 + 0.08 * Math.sin(t * 2.3);
  return (
    <AbsoluteFill style={{ backgroundColor: '#120c09' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Room bx={540} by={1100} floorY={1380} glow={flick * (0.5 + 0.5 * intro)} id="g13" />
        <Bulb x={540} y={300} sw={1.2 * Math.sin(t * 1.1)} />
        {/* coins scattered on floor */}
        <Coin x={300} y={1560} r={54} tilt={0.32} id="c13-a" />
        <Coin x={770} y={1600} r={46} tilt={0.32} rot={-6} id="c13-b" />
        <Coin x={680} y={1500} r={36} tilt={0.3} rot={5} id="c13-c" />
        {/* crab scuttles in */}
        <g opacity={crabIn}>
          <ellipse cx={540 + 260 * (1 - crabIn)} cy={1560} rx={150} ry={22} fill="#0a0604" opacity={0.6} />
          <Crab x={540 + 260 * (1 - crabIn)} y={1500} s={0.9} claw={claw} />
        </g>
        <rect x={-10} y={0} width={60} height={1920} fill="#0a0706" />
        <rect x={1030} y={0} width={60} height={1920} fill="#0a0706" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 520 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 104, color: PALE, letterSpacing: '0.04em', lineHeight: 1.08 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.15)}>YOU</span>
            <span style={pop(/^try/, 0.23)}>TRY</span>
          </div>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 700, fontSize: 122, color: PALE, letterSpacing: '0.03em', lineHeight: 1.08 }}>
            <span style={pop(/^the/, 0.3)}>THE</span>
            <span style={{ ...pop(/^crab/, 0.38), color: GREEN }}>CRAB</span>
            <span style={{ ...pop(/^trick/, 0.46), color: GREEN }}>TRICK?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '50px 0 46px', background: `linear-gradient(90deg, rgba(0,0,0,0), ${PALE}, rgba(0,0,0,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 80, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.55)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.65), color: GREEN, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.74)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.83), color: GREEN, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
