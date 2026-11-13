import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadKR } from '@remotion/google-fonts/NotoSansKR';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { GREEN } from '../comp/Overlays';

const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600'], subsets: ['latin'] });
const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: kr } = loadKR('normal', { weights: ['500'] });

const AMBER = GREEN; // episode accent (#ffb000)
const STEEL = '#2a2f38';
const PALE = '#e6e8ec';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Brushed-steel elevator panel background with a cold top light. */
const Panel: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0b0d11" />
        <stop offset="0.3" stopColor="#1a1e25" />
        <stop offset="0.55" stopColor="#262b33" />
        <stop offset="0.8" stopColor="#161a20" />
        <stop offset="1" stopColor="#0b0d11" />
      </linearGradient>
      <radialGradient id={`${id}-cold`} cx="0.5" cy="0.1" r="0.7">
        <stop offset="0" stopColor="#9fc3dc" stopOpacity={0.28} />
        <stop offset="1" stopColor="#9fc3dc" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-vig`} cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.85} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-steel)`} />
    {Array.from({ length: 34 }, (_, i) => (
      <line key={i} x1={20 + i * 31} y1={0} x2={20 + i * 31 + 6} y2={1920} stroke="#ffffff" strokeOpacity={0.018 + (i % 3) * 0.008} strokeWidth={2} />
    ))}
    <rect width={1080} height={1920} fill={`url(#${id}-cold)`} />
  </>
);

const Btn: React.FC<{ x: number; y: number; n: string; lit: number; r?: number; back?: number }> = ({ x, y, n, lit, r = 62, back = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    {lit > 0 && <circle r={r * 2.4} fill="url(#btn-glow)" opacity={lit} />}
    <circle r={r + 12} fill="#0c0e12" />
    <circle r={r + 6} fill="#3a404a" />
    <circle r={r} fill="#15181d" />
    <circle r={r - 8} fill="none" stroke={AMBER} strokeOpacity={0.03 + 0.12 * back + 0.85 * lit} strokeWidth={6} />
    <text y={r * 0.33} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={r * 0.95}
      fill={lit > 0.5 ? AMBER : back > 0.5 ? '#8a919c' : '#2c3038'}>{n}</text>
  </g>
);

const RED = '#ff3b2f';
const BtnGlowDef = () => (
  <>
    <radialGradient id="btn-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={AMBER} stopOpacity={0.55} />
      <stop offset="1" stopColor={AMBER} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="red-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={RED} stopOpacity={0.6} />
      <stop offset="1" stopColor={RED} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="seam-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#9fc3dc" stopOpacity={0.35} />
      <stop offset="1" stopColor="#9fc3dc" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="refl-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a3039" stopOpacity={0.5} />
      <stop offset="1" stopColor="#2a3039" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="door" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#0d1014" />
      <stop offset="0.5" stopColor="#1b1f26" />
      <stop offset="1" stopColor="#0d1014" />
    </linearGradient>
  </>
);

/** Seven-segment-ish floor readout box. */
const Readout: React.FC<{ x: number; y: number; w: number; h: number; text: string; flick?: number; red?: boolean }> = ({ x, y, w, h, text, flick = 1, red = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={18} fill="#07080a" stroke="#3a404a" strokeWidth={6} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#140c02" />
    <ellipse cx={0} cy={0} rx={w * 0.55} ry={h * 0.6} fill={red ? 'url(#red-glow)' : 'url(#btn-glow)'} opacity={0.6 * flick} />
    <text y={h * 0.3} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={h * 0.82} fill={red ? RED : AMBER} opacity={flick}>{text}</text>
  </g>
);

/** shot 2 — title card over a floor-number panel, cold light, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.22, 0.45, EOUT);
  const tg = wordAt(2, /^game/i, 0.75);
  const sec = useShot().sec;
  const c = ramp(t, tg - 0.1, tg + 0.35, EOUT);
  const floors = ['B1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const fi = Math.min(floors.length - 1, Math.floor(p * 9) + 1);
  const flick = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3);
  void sec;
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 820px' }}>
        <defs><BtnGlowDef /></defs>
        <Panel id="g2" />
        {/* floor indicator strip */}
        <rect x={120} y={260} width={840} height={150} rx={20} fill="#07080a" stroke="#3a404a" strokeWidth={6} />
        {floors.map((n, i) => {
          const on = i === fi;
          return (
            <g key={n}>
              {on && <circle cx={175 + i * 73} cy={335} r={70} fill="url(#btn-glow)" opacity={flick} />}
              <text x={175 + i * 73} y={355} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={56}
                fill={on ? AMBER : '#3c414a'} opacity={on ? flick : 1}>{n}</text>
            </g>
          );
        })}
        {/* title */}
        <g opacity={a} transform={`translate(0 ${30 * (1 - a)})`}>
          <text x={540} y={700} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={92} fill={PALE} letterSpacing={10}>THE</text>
          <text x={540} y={850} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={150} fill={PALE} letterSpacing={6}
            textLength={900} lengthAdjust="spacingAndGlyphs">ELEVATOR</text>
          <text x={540} y={1010} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={150} fill={c > 0.5 ? AMBER : PALE} letterSpacing={18}>GAME</text>
        </g>
        <g opacity={b}>
          <line x1={220} y1={1080} x2={860} y2={1080} stroke={AMBER} strokeOpacity={0.6} strokeWidth={3} />
          <text x={540} y={1160} textAnchor="middle" fontFamily={kr} fontWeight={500} fontSize={58} fill="#b8c2cf" letterSpacing={4}>엘리베이터 게임 · Korea</text>
        </g>
        {/* closed lift doors below (dark, calm behind captions) */}
        <rect x={170} y={1380} width={740} height={560} fill="#07080a" stroke="#3a404a" strokeWidth={8} />
        <rect x={186} y={1396} width={352} height={540} fill="url(#door)" />
        <rect x={542} y={1396} width={352} height={540} fill="url(#door)" />
        <ellipse cx={540} cy={1660} rx={60} ry={300} fill="url(#seam-glow)" opacity={0.6 + 0.25 * Math.sin(t * 1.7)} />
        <line x1={540} y1={1396} x2={540} y2={1920} stroke="#9fc3dc" strokeOpacity={0.35} strokeWidth={3} />
        {/* call buttons below */}
        <g opacity={0.9}>
          <Btn x={540} y={1290} n="▲" lit={0.25 + 0.2 * Math.sin(t * 3)} r={46} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** shot 3 — rules insert: button panel, the sequence 4-2-6-2-10-5 lights on the words. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const seq: [string, RegExp, number][] = [
    ['4', /^four/i, 0.2], ['2', /^two/i, 0.27], ['6', /^six/i, 0.33], ['2', /^two/i, 0.39], ['10', /^ten/i, 0.45], ['5', /^five/i, 0.55],
  ];
  // second "two": find by index
  const words = ['four', 'two', 'six', 'two2', 'ten', 'five'];
  void words;
  const tFour = wordAt(3, /^four/i, 0.2);
  const tTwo = wordAt(3, /^two/i, 0.27);
  const tSix = wordAt(3, /^six/i, 0.33);
  const tTen = wordAt(3, /^ten/i, 0.45);
  const tFive = wordAt(3, /^five/i, 0.55);
  const sp3 = spanOf(3);
  const twos = sp3.shot.words.filter((w) => /^two/i.test(w.text));
  const tTwo2 = twos.length > 1 ? twos[1].start - sp3.from / FPS : tSix + (tTen - tSix) / 2;
  const times = [tFour, tTwo, tSix, tTwo2, tTen, tFive];
  const tAlone = wordAt(3, /^alone/i, 0.05);
  const tWorld = wordAt(3, /^another/i, 0.85);
  // which button is lit now (the most recent press), plus memory dim glow
  let cur = -1;
  times.forEach((tt, i) => { if (t >= tt) cur = i; });
  const grid = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
  const pos = (n: string) => { const i = grid.indexOf(n); return { x: 400 + (i % 2) * 280, y: 470 + Math.floor(i / 2) * 175 }; };
  const pressed = cur >= 0 ? seq[cur][0] : '';
  const pressAge = cur >= 0 ? t - times[cur] : 99;
  const tWorks = Math.min(wordAt(3, /^works/i, 0.75), tWorld - 0.3);
  const done = t >= tWorks;
  const dieAt = (i: number) => tWorks + ((tWorld - tWorks) * i) / 10;
  const unknown = t >= tWorld;
  const redNow = unknown && (t - tWorld > 0.2 || Math.floor(t * 12) % 3 !== 0);
  const wv = ramp(t, tWorld - 0.1, tWorld + 0.8, EOUT);
  const solo = ramp(t, tAlone - 0.2, tAlone + 0.3, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.06 * z})`, transformOrigin: '540px 900px' }}>
        <defs><BtnGlowDef /></defs>
        <Panel id="g3" />
        {/* panel plate */}
        <rect x={240} y={330} width={600} height={1040} rx={36} fill="#111419" stroke="#3a404a" strokeWidth={8} />
        <rect x={262} y={352} width={556} height={996} rx={26} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={4} />
        {grid.map((n) => {
          const { x, y } = pos(n);
          const lit = n === pressed ? Math.max(0.35, 1 - pressAge * 0.25) : 0;
          const gi = grid.indexOf(n);
          const back = t >= dieAt(gi) ? 0 : 1;
          return <Btn key={n} x={x} y={y} n={n} lit={done ? 0 : lit} back={back} />;
        })}
        {/* sequence tally on top */}
        <g>
          {seq.map(([n], i) => {
            const on = t >= times[i];
            const x = 540 + (i - 2.5) * 140;
            return (
              <g key={i} opacity={on ? 1 : 0.25}>
                <text x={x} y={230} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={84} fill={on ? AMBER : '#5a616c'}>{n}</text>
                {i < 5 && <text x={x + 70} y={220} textAnchor="middle" fontFamily={oswald} fontSize={44} fill="#5a616c">›</text>}
              </g>
            );
          })}
        </g>
        {/* ride alone: one lone figure under a cold spot, panel dimmed */}
        <g opacity={solo * (1 - ramp(t, tFour - 0.25, tFour + 0.15))}>
          <rect x={240} y={330} width={600} height={1040} rx={36} fill="#05060a" opacity={0.82} />
          <ellipse cx={540} cy={760} rx={260} ry={420} fill="url(#seam-glow)" />
          <g transform="translate(540 1000) scale(2.4)">
            <circle cx={0} cy={-120} r={30} fill="#030305" stroke="#9fc3dc" strokeOpacity={0.55} strokeWidth={2} />
            <path d="M -50 60 L -46 -30 Q -44 -66 -14 -76 L -10 -88 L 10 -88 L 14 -76 Q 44 -66 46 -30 L 50 60 Z" fill="#030305" stroke="#9fc3dc" strokeOpacity={0.55} strokeWidth={2} />
          </g>
          <ellipse cx={540} cy={1150} rx={170} ry={18} fill="#000" opacity={0.7} />
        </g>
        {/* another world: lights died one by one; the display stutters to a red unknown floor */}
        <g opacity={wv}>
          <rect x={240} y={330} width={600} height={1040} rx={36} fill="#000" opacity={0.55} />
          <Readout x={540} y={850} w={320} h={200}
            text={redNow ? '?' : '5'} red={redNow}
            flick={0.7 + 0.3 * Math.abs(Math.sin(t * 19) * Math.sin(t * 6.1))} />
        </g>
        {/* steel floor reflection under the panel (faint, keeps caption zone calm) */}
        <rect x={240} y={1400} width={600} height={260} rx={30} fill="url(#refl-fade)" opacity={0.6} />
        <line x1={60} y1={1392} x2={1020} y2={1392} stroke="#3a404a" strokeOpacity={0.6} strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA with a floor-panel motif: "Would you play it?" + YES / NO buttons on their words. */
export const S13: React.FC = () => {
  const { t, sec, p } = useShot();
  const cap = Math.max(0.2, sec - 0.6); // everything visible ≥0.5 s before end
  const at = (re: RegExp, fb: number) => Math.min(cap - 0.25, wordAt(13, re, fb));
  const q = ramp(t, at(/^would/i, 0.05) - 0.1, at(/^would/i, 0.05) + 0.35, EOUT);
  const q2 = ramp(t, at(/^play/i, 0.2) - 0.1, at(/^play/i, 0.2) + 0.3, EOUT);
  const cm = ramp(t, at(/^comment/i, 0.45) - 0.05, at(/^comment/i, 0.45) + 0.3, EOUT);
  const ys = ramp(t, at(/^yes/i, 0.6) - 0.05, at(/^yes/i, 0.6) + 0.25, EOUT);
  const no = ramp(t, at(/^no/i, 0.8) - 0.05, at(/^no/i, 0.8) + 0.25, EOUT);
  const z = EIO(p);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07080a' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.04 * z})`, transformOrigin: '540px 960px' }}>
        <defs><BtnGlowDef /></defs>
        <Panel id="g13" />
        <Readout x={540} y={330} w={260} h={170} text="?" flick={0.85 + 0.15 * Math.sin(t * 17) * Math.sin(t * 5)} />
        <g opacity={q} transform={`translate(0 ${24 * (1 - q)})`}>
          <text x={540} y={680} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={104} fill={PALE}>WOULD YOU</text>
        </g>
        <g opacity={q2} transform={`translate(0 ${24 * (1 - q2)})`}>
          <text x={540} y={810} textAnchor="middle" fontFamily={cinzel} fontWeight={700} fontSize={104} fill={PALE}>PLAY IT?</text>
        </g>
        <g opacity={cm}>
          <text x={540} y={1010} textAnchor="middle" fontFamily={oswald} fontWeight={400} fontSize={64} fill="#b8c2cf" letterSpacing={8}>COMMENT</text>
        </g>
        <g opacity={ys} transform={`translate(330 1260) scale(${0.85 + 0.15 * ys})`}>
          <circle r={250} fill="url(#btn-glow)" opacity={ys} />
          <circle r={160} fill="#0c0e12" /><circle r={150} fill="#3a404a" /><circle r={138} fill="#15181d" />
          <circle r={122} fill="none" stroke={AMBER} strokeWidth={8} />
          <text y={34} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={100} fill={AMBER}>YES</text>
        </g>
        <g opacity={no} transform={`translate(750 1260) scale(${0.85 + 0.15 * no})`}>
          <circle r={160} fill="#0c0e12" /><circle r={150} fill="#3a404a" /><circle r={138} fill="#15181d" />
          <circle r={122} fill="none" stroke={PALE} strokeOpacity={0.6} strokeWidth={8} />
          <text y={34} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={100} fill={PALE}>NO</text>
        </g>
        {/* the lift doors wait below, seam faintly lit */}
        <rect x={210} y={1520} width={660} height={420} fill="#07080a" stroke="#3a404a" strokeWidth={8} />
        <rect x={226} y={1536} width={312} height={400} fill="url(#door)" />
        <rect x={542} y={1536} width={312} height={400} fill="url(#door)" />
        <ellipse cx={540} cy={1740} rx={50} ry={240} fill="url(#seam-glow)" opacity={0.5 + 0.3 * ys} />
        <line x1={540} y1={1536} x2={540} y2={1920} stroke="#9fc3dc" strokeOpacity={0.3 + 0.2 * ys} strokeWidth={3} />
        <rect width={1080} height={1920} fill="url(#g13-vig)" />
      </svg>
    </AbsoluteFill>
  );
};
