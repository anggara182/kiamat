import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadNoto } from '@remotion/google-fonts/NotoSerifJP';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: noto } = loadNoto('normal', { weights: ['600'], ignoreTooManyRequestsWarning: true } as never);

const RED = '#c3283b';
const ACC = GREEN; // #ff4f6d
const TUBE = '#e8f6ff';
const PALE = '#e6eef0';
const DOOR = '#b9b2a3';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared defs for the cold bathroom look. */
const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4d5f58" />
      <stop offset="0.5" stopColor="#33403b" />
      <stop offset="1" stopColor="#141a18" />
    </linearGradient>
    <linearGradient id={`${id}-door`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d4cebf" />
      <stop offset="0.6" stopColor={DOOR} />
      <stop offset="1" stopColor="#6e695e" />
    </linearGradient>
    <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a4743" />
      <stop offset="1" stopColor="#0d1110" />
    </linearGradient>
    <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={TUBE} stopOpacity={0.6} />
      <stop offset="0.45" stopColor="#8fa39a" stopOpacity={0.2} />
      <stop offset="1" stopColor="#8fa39a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${id}-red`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={ACC} stopOpacity={0.45} />
      <stop offset="1" stopColor={ACC} stopOpacity={0} />
    </radialGradient>
  </defs>
);

/** A stall door (x,y = top-left), with a "3" plaque, grime streaks and a dark gap below. */
const StallDoor: React.FC<{ id: string; x: number; y: number; w: number; h: number; num?: boolean; gap?: number }> = ({ id, x, y, w, h, num = true, gap = 70 }) => (
  <g>
    {/* frame posts */}
    <rect x={x - 26} y={y - 30} width={26} height={h + gap + 30} fill="#1f2624" />
    <rect x={x + w} y={y - 30} width={26} height={h + gap + 30} fill="#1f2624" />
    <rect x={x - 26} y={y - 30} width={w + 52} height={30} fill="#262e2b" />
    {/* the gap under the door */}
    <rect x={x} y={y + h} width={w} height={gap} fill="#050707" />
    {/* door */}
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-door)`} />
    <rect x={x + 30} y={y + 40} width={w - 60} height={h * 0.42} fill="none" stroke="#8f897c" strokeWidth={4} opacity={0.6} />
    <rect x={x + 30} y={y + 70 + h * 0.42} width={w - 60} height={h * 0.42} fill="none" stroke="#8f897c" strokeWidth={4} opacity={0.6} />
    {/* grime streaks */}
    <path d={`M ${x + w * 0.22} ${y + h * 0.55} q 6 ${h * 0.2} -4 ${h * 0.45}`} stroke="#5a564c" strokeWidth={10} opacity={0.35} fill="none" strokeLinecap="round" />
    <path d={`M ${x + w * 0.7} ${y + h * 0.62} q -5 ${h * 0.15} 3 ${h * 0.37}`} stroke="#5a564c" strokeWidth={7} opacity={0.3} fill="none" strokeLinecap="round" />
    {/* latch */}
    <rect x={x + w - 46} y={y + h * 0.5 - 14} width={26} height={44} rx={4} fill="#3c3a34" />
    <circle cx={x + w - 33} cy={y + h * 0.5 + 8} r={5} fill={ACC} />
    {/* rim light on left edge */}
    <rect x={x} y={y} width={5} height={h} fill={TUBE} opacity={0.55} />
    {num && (
      <g>
        <rect x={x + w / 2 - 50} y={y + 60} width={100} height={110} rx={10} fill="#e8e2d2" stroke="#3c3a34" strokeWidth={5} />
        <text x={x + w / 2} y={y + 150} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={92} fill="#1a1d1c">3</text>
      </g>
    )}
  </g>
);

/** Fluorescent tube with glow; flicker 0..1. */
const Tube: React.FC<{ id: string; cx: number; y: number; w: number; on: number }> = ({ id, cx, y, w, on }) => (
  <g>
    <ellipse cx={cx} cy={y + 60} rx={w * 1.1} ry={w * 0.9} fill={`url(#${id}-glow)`} opacity={on} />
    <rect x={cx - w / 2 - 14} y={y - 12} width={w + 28} height={30} rx={8} fill="#1a201e" />
    <rect x={cx - w / 2} y={y} width={w} height={16} rx={8} fill={TUBE} opacity={0.25 + 0.75 * on} />
  </g>
);

/** Wall tiles: a few grout lines only (low detail). */
const Tiles: React.FC<{ y0: number; y1: number; step?: number }> = ({ y0, y1, step = 120 }) => {
  const lines: React.ReactNode[] = [];
  for (let y = y0; y < y1; y += step) lines.push(<rect key={`h${y}`} x={0} y={y} width={1080} height={3} fill="#1b2220" opacity={0.45} />);
  for (let x = 60; x < 1080; x += step) lines.push(<rect key={`v${x}`} x={x} y={y0} width={3} height={y1 - y0} fill="#1b2220" opacity={0.35} />);
  return <g>{lines}</g>;
};

/** Small red shoe (Mary-Jane), pointing right; flip with sx=-1. */
const Shoe: React.FC<{ x: number; y: number; s?: number; sx?: number }> = ({ x, y, s = 1, sx = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * sx} ${s})`}>
    <path d="M -46 0 L -46 -26 Q -44 -40 -26 -40 L 4 -36 Q 30 -30 44 -16 Q 54 -6 50 0 Z" fill={RED} />
    <path d="M -40 -34 Q -10 -46 10 -34" stroke="#6e1220" strokeWidth={6} fill="none" />
    <rect x={-48} y={-3} width={100} height={6} rx={3} fill="#3a0a12" />
    <path d="M 2 -34 Q 30 -28 44 -16" stroke="#ff8a9a" strokeWidth={3} fill="none" opacity={0.6} />
  </g>
);

/* ---------------- shot 2: title card over stall door 3 ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.44, EOUT);
  const ans = wordAt(2, /^answer/, 0.6);
  const glowRed = ramp(t, ans - 0.1, ans + 0.5, EOUT);
  const flick = 0.82 + 0.18 * Math.sin(t * 23) * Math.sin(t * 3.1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1110' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 1000px' }}>
        <Defs id="g2" />
        <rect width={1080} height={1920} fill="url(#g2-wall)" />
        <Tiles y0={560} y1={1340} />
        <rect x={0} y={1330} width={1080} height={590} fill="url(#g2-floor)" />
        <Tube id="g2" cx={540} y={560} w={420} on={flick} />
        {/* neighbouring doors, darker */}
        <rect x={-60} y={640} width={250} height={620} fill="#4f4b42" />
        <rect x={890} y={640} width={250} height={620} fill="#4f4b42" />
        <StallDoor id="g2" x={310} y={660} w={460} h={610} gap={60} />
        {/* faint red under the door when "answer" */}
        <ellipse cx={540} cy={1310} rx={240} ry={40} fill="url(#g2-red)" opacity={glowRed} />
        {/* fg dark framing */}
        <rect x={0} y={0} width={1080} height={110} fill="#070908" />
        <rect x={0} y={0} width={60} height={1920} fill="#070908" />
        <rect x={1020} y={0} width={60} height={1920} fill="#070908" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 210 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 108, lineHeight: 1, letterSpacing: '0.05em', color: PALE, opacity: a, transform: `translateY(${(1 - a) * 20}px)`, whiteSpace: 'nowrap' }}>HANAKO-SAN</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: b }}>
          <div style={{ width: 90 * b, height: 3, background: `linear-gradient(90deg, rgba(255,79,109,0), ${ACC})` }} />
          <div style={{ fontFamily: noto, fontWeight: 600, fontSize: 46, letterSpacing: '0.08em', color: '#c9d8d4', whiteSpace: 'nowrap' }}>トイレの花子さん · Japan</div>
          <div style={{ width: 90 * b, height: 3, background: `linear-gradient(90deg, ${ACC}, rgba(255,79,109,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: red skirt hem under the closed door ---------------- */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const tRed = wordAt(3, /^red/, 0.5);
  const tStall = wordAt(3, /^stall/, 0.9);
  const show = ramp(t, tRed - 0.4, tRed + 0.4, EOUT);
  const sway = Math.sin(t * 1.4) * 4;
  const flick = 0.85 + 0.15 * Math.sin(t * 19) * Math.sin(t * 2.3);
  const glow = 0.5 + 0.5 * ramp(t, tStall - 0.2, tStall + 0.4, EOUT);
  // door: bottom edge at y=1120, floor gap down to 1330
  const dx = 140, dy = -600, dw = 800, dh = 1720, gapY = dy + dh;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1110' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.06 * z})`, transformOrigin: '540px 1180px' }}>
        <Defs id="g3" />
        <rect width={1080} height={1920} fill="url(#g3-wall)" />
        {/* floor tiles in perspective */}
        <rect x={0} y={gapY + 210} width={1080} height={1920} fill="url(#g3-floor)" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={0} y={gapY + 210 + i * i * 40 + i * 70} width={1080} height={3} fill="#0a0d0c" opacity={0.6} />)}
        <StallDoor id="g3" x={dx} y={dy} w={dw} h={dh} num={false} gap={210} />
        {/* light spilling through the gap from inside the stall */}
        <rect x={dx} y={gapY} width={dw} height={210} fill="#1a2421" />
        <ellipse cx={540} cy={gapY + 190} rx={360} ry={70} fill="url(#g3-glow)" opacity={0.7 * flick} />
        {/* skirt hem + legs + shoes, revealed on "red" */}
        <g opacity={show} transform={`translate(${sway} 0)`}>
          <path d={`M 400 ${gapY - 2} L 680 ${gapY - 2} L 700 ${gapY + 38} L 380 ${gapY + 38} Z`} fill={RED} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${400 + i * 46} ${gapY} L ${392 + i * 50} ${gapY + 38}`} stroke="#7a1424" strokeWidth={5} />)}
          <path d={`M 380 ${gapY + 38} L 700 ${gapY + 38}`} stroke="#ff8a9a" strokeWidth={3} opacity={0.5} />
          {/* legs (dark, white socks) */}
          <rect x={470} y={gapY + 38} width={34} height={90} fill="#2a2420" />
          <rect x={576} y={gapY + 38} width={34} height={90} fill="#2a2420" />
          <rect x={468} y={gapY + 118} width={38} height={56} fill="#d9dcd6" />
          <rect x={574} y={gapY + 118} width={38} height={56} fill="#d9dcd6" />
          <Shoe x={478} y={gapY + 208} s={1.15} sx={-1} />
          <Shoe x={602} y={gapY + 208} s={1.15} />
        </g>
        <ellipse cx={540} cy={gapY + 210} rx={200} ry={30} fill="url(#g3-red)" opacity={show * glow} />
        {/* darken the upper door so the eye drops to the gap */}
        <linearGradient id="g3-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1110" stopOpacity={0.85} />
          <stop offset="1" stopColor="#0d1110" stopOpacity={0} />
        </linearGradient>
        <rect x={0} y={0} width={1080} height={820} fill="url(#g3-shade)" />
        {/* fg: dark adjacent stall partition edges */}
        <path d="M 0 0 L 90 0 L 70 1920 L 0 1920 Z" fill="#070908" />
        <path d="M 1080 0 L 1000 0 L 1020 1920 L 1080 1920 Z" fill="#070908" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const pop = (re: RegExp, fb: number) => {
    const at = Math.min(wordAt(13, re, fb), sec - 0.85);
    const k = ramp(t, at - 0.03, at + 0.25, EBACK);
    return { opacity: ramp(t, at - 0.03, at + 0.1, EOUT), transform: `scale(${0.6 + 0.4 * k})`, display: 'inline-block' } as React.CSSProperties;
  };
  const row: React.CSSProperties = { display: 'flex', gap: '0.28em', justifyContent: 'center', whiteSpace: 'nowrap' };
  const intro = ramp(t, 0, 0.5, EOUT);
  const flick = 0.85 + 0.15 * Math.sin(t * 21) * Math.sin(t * 2.7);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1110' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Defs id="g13" />
        <rect width={1080} height={1920} fill="#0d1110" />
        <rect width={1080} height={1920} fill="url(#g13-wall)" opacity={0.55} />
        <Tube id="g13" cx={540} y={150} w={360} on={flick * intro} />
        {/* dim door at the bottom, red shoe under it */}
        <rect x={0} y={1640} width={1080} height={280} fill="url(#g13-floor)" />
        <StallDoor id="g13" x={330} y={1180} w={420} h={480} gap={70} />
        <ellipse cx={540} cy={1730} rx={220} ry={34} fill="url(#g13-red)" opacity={intro} />
        <Shoe x={492} y={1728} s={1.1} sx={-1} />
        <Shoe x={594} y={1728} s={1.1} />
        <rect x={0} y={0} width={60} height={1920} fill="#070908" />
        <rect x={1020} y={0} width={60} height={1920} fill="#070908" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 380 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 110, color: PALE, letterSpacing: '0.04em', lineHeight: 1.05 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.17)}>YOU</span>
          </div>
          <div style={{ ...row, fontFamily: cinzel, fontWeight: 700, fontSize: 160, color: ACC, letterSpacing: '0.03em', lineHeight: 1.05 }}>
            <span style={pop(/^knock/, 0.27)}>KNOCK?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '54px 0 50px', background: `linear-gradient(90deg, rgba(230,238,240,0), ${PALE}, rgba(230,238,240,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 76, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.45)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.55), color: ACC, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.65)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.75), color: ACC, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
