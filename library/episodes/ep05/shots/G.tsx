import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { TrainFront } from '../art/graphic_train';

const { fontFamily: oswald } = loadOswald('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });

const RED = '#ff4d4d';
const ICE = '#d9f0ff';
const PALE = '#e8e4dc';
const EBACK = Easing.out(Easing.back(1.6));
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** shot 2 — title card: glowing train front emerging from a dark tunnel, cold light, slow push. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.04, 0.32, EOUT);
  const b = ramp(p, 0.2, 0.48, EOUT);
  const track = 0.07 - 0.03 * a;
  const glow = 0.5 + 0.5 * Math.sin(t * 2.1) * 0.3 + 0.35 * z;
  const ts = 0.78 + 0.14 * z; // train approaches
  const ty = 980 + 6 * z;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.05 * z})`, transformOrigin: '540px 1000px' }}>
        <defs>
          <radialGradient id="g2-mouth" cx="0.5" cy="0.55" r="0.5">
            <stop offset="0" stopColor="#5a7a96" stopOpacity={0.9} />
            <stop offset="0.55" stopColor="#1a2533" stopOpacity={0.9} />
            <stop offset="1" stopColor="#06080f" stopOpacity={1} />
          </radialGradient>
          <radialGradient id="g2-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={ICE} stopOpacity={0.55} />
            <stop offset="0.5" stopColor="#5a7a96" stopOpacity={0.22} />
            <stop offset="1" stopColor="#5a7a96" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="g2-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1f26" />
            <stop offset="1" stopColor="#06080f" />
          </linearGradient>
        </defs>
        {/* tunnel wall */}
        <rect width={1080} height={1920} fill="#0a0d14" />
        {/* receding tunnel rings (dark ribs) */}
        {[1.5, 1.28, 1.1].map((k, i) => (
          <path key={i} d={`M ${540 - 470 * k} ${1500} L ${540 - 470 * k} ${1000 - 120 * k} Q ${540 - 470 * k} ${1000 - 560 * k} 540 ${1000 - 560 * k} Q ${540 + 470 * k} ${1000 - 560 * k} ${540 + 470 * k} ${1000 - 120 * k} L ${540 + 470 * k} 1500`}
            fill="none" stroke={i === 2 ? '#1c2430' : '#11151d'} strokeWidth={46 - i * 10} />
        ))}
        {/* tunnel mouth with cold light */}
        <path d="M 110 1420 L 110 900 Q 110 470 540 470 Q 970 470 970 900 L 970 1420 Z" fill="url(#g2-mouth)" />
        <ellipse cx={540} cy={ty - 40} rx={560} ry={520} fill="url(#g2-halo)" opacity={0.7 + 0.3 * z} />
        {/* track bed */}
        <path d="M 110 1420 L 970 1420 L 1080 1920 L 0 1920 Z" fill="url(#g2-floor)" />
        {[[420, 120], [660, 960]].map(([x0, x1], i) => <path key={i} d={`M ${x0} 1380 L ${x1} 1920`} stroke="#5a7a96" strokeWidth={10} opacity={0.6} />)}
        {[0, 1, 2, 3].map((i) => { const y = 1430 + i * i * 38 + i * 50; return <path key={i} d={`M ${400 - i * 70} ${y} L ${680 + i * 70} ${y}`} stroke="#11131a" strokeWidth={14 + i * 6} />; })}
        <TrainFront x={540} y={ty} s={ts} glow={glow} />
        {/* beam reflection on rails */}
        <ellipse cx={540} cy={ty + 380 * ts} rx={330 * ts} ry={40} fill="url(#g2-halo)" opacity={0.8} />
        {/* foreground tunnel lip, darkest */}
        <path d="M 0 0 L 1080 0 L 1080 1920 L 1030 1920 L 1030 820 Q 1030 360 540 360 Q 50 360 50 820 L 50 1920 L 0 1920 Z" fill="#05060a" />
        {/* hanging cable silhouette */}
        <path d="M 50 520 Q 300 600 560 560 Q 820 520 1030 590" fill="none" stroke="#05060a" strokeWidth={8} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 170 }}>
        <div style={{
          fontFamily: oswald, fontWeight: 700, fontSize: 118, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: '#f2f8ff', opacity: a, transform: `translateY(${(1 - a) * 20}px)`, whiteSpace: 'nowrap',
          textShadow: '0 0 40px rgba(217,240,255,0.35)',
        }}>THE GHOST TRAIN</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 22, opacity: b }}>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, rgba(255,77,77,0), ${RED})` }} />
          <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 42, letterSpacing: '0.14em', color: '#b8cbe0', whiteSpace: 'nowrap' }}>Kereta Hantu · Jakarta</div>
          <div style={{ width: 110 * b, height: 3, background: `linear-gradient(90deg, ${RED}, rgba(255,77,77,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: split-flap departure board ---------------- */
const ROWS = [
  ['22:10', 'BOGOR', '2'],
  ['22:35', 'BEKASI', '4'],
  ['23:05', 'TANGERANG', '1'],
  ['23:40', 'CIKARANG', '3'],
  ['00:13', 'MANGGARAI', '4'],
];
const GLYPHS = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
const TW = 50, TH = 92, TG = 5; // tile size
const COLS = 18; // 5 time + gap + 10 dest + gap + 1 platform
const rowCells = (r: string[]) => (r[0].padEnd(6, ' ') + r[1].padEnd(11, ' ').slice(0, 11) + r[2]).split('');

const Tile: React.FC<{ x: number; y: number; ch: string; color: string; dim?: boolean }> = ({ x, y, ch, color, dim }) => (
  <g>
    <rect x={x} y={y} width={TW} height={TH} rx={5} fill={dim ? '#101219' : '#151821'} />
    <rect x={x} y={y} width={TW} height={TH / 2} rx={5} fill="#ffffff" opacity={0.035} />
    {ch !== ' ' && <text x={x + TW / 2} y={y + TH * 0.77} textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={74} fill={color}>{ch}</text>}
    <rect x={x} y={y + TH / 2 - 1.5} width={TW} height={3} fill="#05060a" />
  </g>
);

export const S03: React.FC = () => {
  const { p, t, f } = useShot();
  const z = EIO(p);
  const x0 = (1080 - (COLS * (TW + TG) - TG)) / 2;
  const y0 = 480;
  const rowH = TH + 64;
  const fl0 = wordAt(3, /^isn/, 0.65);
  const fl1 = wordAt(3, /^schedule/, 0.88);
  // flicker pattern: deterministic on/off per 2-frame step, settles blank
  const step = Math.floor(f / 2);
  const flick = t < fl0 ? 1 : t > fl1 ? 0 : [1, 0, 1, 1, 0, 1, 0, 0, 1, 0][step % 10];
  const dot = t > fl1 || (t > fl0 && !flick);
  const pulse = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.06 * z})`, transformOrigin: '540px 900px' }}>
        <defs>
          <linearGradient id="g3-panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1f26" />
            <stop offset="1" stopColor="#0c0e13" />
          </linearGradient>
          <radialGradient id="g3-light" cx="0.5" cy="0" r="0.8">
            <stop offset="0" stopColor={ICE} stopOpacity={0.22} />
            <stop offset="1" stopColor="#5a7a96" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g3-red" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={RED} stopOpacity={0.7} />
            <stop offset="1" stopColor={RED} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* board housing fills frame */}
        <rect x={-20} y={180} width={1120} height={1500} rx={18} fill="#2a2e38" />
        <rect x={10} y={210} width={1060} height={1440} rx={10} fill="url(#g3-panel)" />
        <rect x={10} y={210} width={1060} height={700} fill="url(#g3-light)" />
        <path d="M 10 212 L 1070 212" stroke="#5a7a96" strokeWidth={3} opacity={0.8} />
        {/* header */}
        <text x={x0} y={300} fontFamily={oswald} fontWeight={700} fontSize={58} fill={PALE} letterSpacing="0.08em">KEBERANGKATAN</text>
        <text x={1080 - x0} y={300} textAnchor="end" fontFamily={oswald} fontWeight={400} fontSize={40} fill="#8fa3b8" letterSpacing="0.12em">DEPARTURES</text>
        <rect x={x0} y={330} width={1080 - 2 * x0} height={4} fill="#e8c547" />
        {[['JAM', 0], ['TUJUAN', 6], ['PERON', 17]].map(([s, c]) => (
          <text key={s as string} x={x0 + (c as number) * (TW + TG) + (s === 'PERON' ? TW : 0)} textAnchor={s === 'PERON' ? 'end' : 'start'} y={408} fontFamily={oswald} fontWeight={400} fontSize={30} fill="#5a7a96" letterSpacing="0.14em">{s}</text>
        ))}
        {ROWS.map((r, ri) => {
          const cells = rowCells(r);
          const y = y0 + ri * rowH;
          const last = ri === ROWS.length - 1;
          const settle = 0.06 + ri * 0.05; // fraction of shot where row has settled
          return (
            <g key={ri}>
              {cells.map((ch, ci) => {
                if (ci === 5 || ci === 16) return null;
                const done = p > settle + ci * 0.004;
                const shown = done ? ch : ch === ' ' ? ' ' : GLYPHS[(ci * 7 + ri * 13 + step) % GLYPHS.length];
                const blank = last && !flick;
                const color = ci < 5 ? '#ffd27a' : ci === 17 ? ICE : PALE;
                return <Tile key={ci} x={x0 + ci * (TW + TG)} y={y} ch={blank ? ' ' : shown} color={color} dim={blank} />;
              })}
            </g>
          );
        })}
        {/* red dot on the blank row */}
        {dot && (() => {
          const y = y0 + (ROWS.length - 1) * rowH + TH / 2, x = x0 + 2 * (TW + TG) + TW / 2;
          return (
            <g>
              <circle cx={x} cy={y} r={110} fill="url(#g3-red)" opacity={pulse} />
              <circle cx={x} cy={y} r={26} fill={RED} />
              <circle cx={x - 8} cy={y - 8} r={7} fill="#ffd0d0" />
            </g>
          );
        })()}
        {/* footer strip of the board (below the rows, under caption zone it stays dark) */}
        <rect x={x0} y={y0 + ROWS.length * rowH} width={1080 - 2 * x0} height={3} fill="#2a2e38" />
        {/* foreground: dark ceiling beam + light fixture edge */}
        <path d="M -20 0 L 1100 0 L 1100 150 L -20 190 Z" fill="#05060a" />
        <rect x={340} y={130} width={400} height={18} rx={9} fill={ICE} opacity={0.85} />
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
  const blink = 0.8 + 0.2 * Math.sin(t * 4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#06080f" />
            <stop offset="0.6" stopColor="#0d1119" />
            <stop offset="1" stopColor="#1c1f26" />
          </linearGradient>
          <radialGradient id="g13-red" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={RED} stopOpacity={0.75} />
            <stop offset="0.35" stopColor={RED} stopOpacity={0.25} />
            <stop offset="1" stopColor={RED} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="g13-lens" cx="0.4" cy="0.38" r="0.6">
            <stop offset="0" stopColor="#ffe0e0" />
            <stop offset="0.35" stopColor={RED} />
            <stop offset="1" stopColor="#8a1414" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-sky)" />
        {/* red signal glow */}
        <ellipse cx={540} cy={430} rx={420} ry={420} fill="url(#g13-red)" opacity={intro * blink} />
        {/* signal post */}
        <rect x={528} y={600} width={24} height={1400} fill="#11131a" />
        <path d="M 440 250 Q 440 200 490 200 L 590 200 Q 640 200 640 250 L 640 610 Q 640 650 600 650 L 480 650 Q 440 650 440 610 Z" fill="#11131a" />
        <path d="M 446 250 Q 446 206 490 206 L 590 206" fill="none" stroke="#ff8a8a" strokeWidth={4} opacity={0.6 * intro} />
        {/* hoods + lamps: top red lit, bottom unlit */}
        <path d="M 470 360 Q 540 280 610 360 Z" fill="#05060a" />
        <circle cx={540} cy={430} r={58} fill="#05060a" />
        <circle cx={540} cy={430} r={48} fill="url(#g13-lens)" opacity={0.25 + 0.75 * intro} />
        <path d="M 470 520 Q 540 440 610 520 Z" fill="#05060a" />
        <circle cx={540} cy={570} r={58} fill="#05060a" />
        <circle cx={540} cy={570} r={44} fill="#1d2a24" />
        {/* rails converging toward the bottom */}
        <path d="M 0 1920 L 470 1640 L 610 1640 L 1080 1920 Z" fill="#11131a" />
        <path d="M 120 1920 L 500 1640 M 960 1920 L 580 1640" stroke={RED} strokeWidth={6} opacity={0.35} />
        {/* side silhouettes: platform pillars */}
        <rect x={-10} y={0} width={70} height={1920} fill="#05060a" />
        <rect x={1020} y={0} width={70} height={1920} fill="#05060a" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 760 }}>
        <div style={{ width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 600, fontSize: 104, color: PALE, letterSpacing: '0.04em', lineHeight: 1.05 }}>
            <span style={pop(/^Would/, 0.07)}>WOULD</span>
            <span style={pop(/^you/, 0.17)}>YOU</span>
          </div>
          <div style={{ ...row, fontFamily: oswald, fontWeight: 700, fontSize: 168, color: RED, letterSpacing: '0.03em', lineHeight: 1.05 }}>
            <span style={pop(/^get/, 0.27)}>GET</span>
            <span style={pop(/^on/, 0.37)}>ON?</span>
          </div>
          <div style={{ width: 520 * intro, height: 3, margin: '54px 0 50px', background: `linear-gradient(90deg, rgba(232,228,220,0), ${PALE}, rgba(232,228,220,0))`, opacity: 0.45 }} />
          <div style={{ ...row, fontFamily: oswald, fontWeight: 400, fontSize: 76, color: PALE, letterSpacing: '0.06em', alignItems: 'baseline' }}>
            <span style={pop(/^Comment/, 0.5)}>COMMENT</span>
            <span style={{ ...pop(/^YES/, 0.6), color: RED, fontWeight: 700 }}>YES</span>
            <span style={pop(/^or$/, 0.7)}>OR</span>
            <span style={{ ...pop(/^NO/, 0.8), color: RED, fontWeight: 700 }}>NO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
