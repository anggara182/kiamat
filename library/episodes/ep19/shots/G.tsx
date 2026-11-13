import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Doll, Candle, Glow } from '../art/graphic_doll';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['400', '700'], subsets: ['latin'] });
const { fontFamily: corm } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

const ACC = GREEN; // #e6d3a3
const CANDLE = '#ffc46b';
const DARK = '#07080a';
const PAPER = '#e9e1cf';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** Shared room backdrop: dim plaster wall, floor, candle-lit centre. */
const Backdrop: React.FC<{ id: string; floorY: number; glowY: number; glow?: number }> = ({ id, floorY, glowY, glow = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={DARK} /><stop offset="0.55" stopColor="#2a2621" /><stop offset="1" stopColor="#3a3630" />
      </linearGradient>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b2219" /><stop offset="1" stopColor={DARK} />
      </linearGradient>
      <radialGradient id={`${id}-wg`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c99a5a" stopOpacity={0.55} /><stop offset="0.5" stopColor="#6b4a2a" stopOpacity={0.25} /><stop offset="1" stopColor="#3a3630" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id}-wall)`} />
    <ellipse cx={540} cy={glowY} rx={760} ry={820} fill={`url(#${id}-wg)`} opacity={glow} />
    <rect y={floorY} width={1080} height={1920 - floorY} fill={`url(#${id}-floor)`} />
    <path d={`M 0 ${floorY} L 1080 ${floorY}`} stroke="#4a3a28" strokeWidth={4} opacity={0.6} />
  </g>
);

/* ---------------- shot 2: title over the doll's silhouette ---------------- */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.02, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const st = ramp(t, wordAt(2, /^stays/, 0.6) - 0.1, wordAt(2, /^stays/, 0.6) + 0.5, EOUT);
  const track = 0.16 - 0.04 * a;
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.06 * z})`, transformOrigin: '540px 900px' }}>
        <Backdrop id="g2" floorY={1240} glowY={1020} />
        {/* back-light behind the doll */}
        <Glow x={540} y={900} r={620} o={0.95} id="g2-bl" />
        {/* wall shadow of the doll, larger and leaning wrong */}
        <g opacity={0.2 + 0.2 * st}><Doll x={700 + 30 * st} y={520} s={1.45} sway={-9 - 6 * st} id="g2-sh" dark /></g>
        {/* paper on the floor beneath the pencil */}
        <path d="M 360 1372 L 720 1372 L 790 1470 L 290 1470 Z" fill={PAPER} opacity={0.14} />
        <path d="M 360 1372 L 720 1372 L 790 1470 L 290 1470 Z" fill="#6b4a2a" opacity={0.2} />
        {/* the doll itself, dark silhouette with candle rim */}
        <Doll x={540} y={690} s={0.94} sway={1.5 * Math.sin(t * 0.9)} id="g2-d" dark />
        {/* candles on the floor */}
        {[[300, 1350, 0.9], [780, 1360, 1.0], [170, 1420, 0.75], [910, 1430, 0.8]].map(([x, y, s], i) => (
          <g key={i}><Glow x={x} y={y - 140 * s} r={200 * s} id={`g2-cg${i}`} /><Candle x={x} y={y} s={s} h={120} t={t + i} id={`g2-c${i}`} /></g>
        ))}
        {/* foreground: dark floor lip */}
        <path d="M 0 1500 Q 540 1440 1080 1500 L 1080 1920 L 0 1920 Z" fill={DARK} opacity={0.85} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 200 }}>
        <div style={{
          fontFamily: cinzel, fontWeight: 700, fontSize: 112, lineHeight: 1, letterSpacing: `${track}em`, marginRight: `-${track}em`,
          color: '#f3e8cc', opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap',
        }}>JELANGKUNG</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: b }}>
          <div style={{ width: 110 * b, height: 2, background: `linear-gradient(90deg, rgba(230,211,163,0), ${ACC})` }} />
          <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 52, letterSpacing: '0.04em', color: ACC, whiteSpace: 'nowrap' }}>An Indonesian legend</div>
          <div style={{ width: 110 * b, height: 2, background: `linear-gradient(90deg, ${ACC}, rgba(230,211,163,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- shot 3: lore insert, the doll over paper ---------------- */
const Label: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; o: number; right?: boolean }> = ({ x, y, tx, ty, text, o, right }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={7} fill={ACC} />
    <path d={`M ${x} ${y} L ${tx} ${ty} L ${tx + (right ? 60 : -60)} ${ty}`} stroke={ACC} strokeWidth={2.5} fill="none" opacity={0.85} />
    <text x={tx + (right ? 72 : -72)} y={ty + 13} textAnchor={right ? 'start' : 'end'} fontFamily={cinzel} fontWeight={400} fontSize={34} fill={ACC} letterSpacing="0.08em">{text}</text>
  </g>
);

export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const k1 = ramp(t, wordAt(3, /^coconut/, 0.25), wordAt(3, /^coconut/, 0.25) + 0.4, EOUT);
  const k2 = ramp(t, wordAt(3, /^stick/, 0.48), wordAt(3, /^stick/, 0.48) + 0.4, EOUT);
  const k3 = ramp(t, wordAt(3, /^paper/, 0.68), wordAt(3, /^paper/, 0.68) + 0.4, EOUT);
  const tw = wordAt(3, /^spirit/, 0.85);
  const w = ramp(t, tw, tw + 1.0, (n) => n);
  const sway = 2.2 * Math.sin(t * 1.1) + (w > 0 && w < 1 ? 3 * Math.sin(t * 14) : 0);
  // pencil tip position follows the scrawl
  const sx = 540 + (w > 0 ? 120 * Math.sin(w * 9) * (0.5 + w * 0.5) : 0);
  const dollX = sx - 16 * 0.78;
  const lines = [0, 1, 2];
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.05 * z})`, transformOrigin: '540px 900px' }}>
        <Backdrop id="g3" floorY={1080} glowY={900} />
        <Glow x={540} y={760} r={600} o={0.75} id="g3-bl" />
        {/* paper on the floor, in perspective */}
        <path d="M 230 1150 L 850 1150 L 960 1370 L 120 1370 Z" fill={PAPER} />
        <path d="M 230 1150 L 850 1150 L 960 1370 L 120 1370 Z" fill="#6b4a2a" opacity={0.18} />
        {/* scrawl the spirit writes */}
        <g stroke="#2a2420" strokeWidth={5} fill="none" strokeLinecap="round">
          {lines.map((i) => {
            const lw = ramp(w, i / 3, (i + 1) / 3, (n) => n);
            if (lw <= 0) return null;
            const y = 1210 + i * 48, x0 = 300 - i * 20, len = 460 + i * 20;
            let d = `M ${x0} ${y}`;
            const n = Math.floor(40 * lw);
            for (let j = 1; j <= n; j++) {
              const xx = x0 + (len * j) / 40, ph = j * 1.9 + i;
              const gap = (j % 9 === 0);
              d += `${gap ? ' M' : ' L'} ${xx} ${y + 16 * Math.sin(ph) - (j % 5 === 2 ? 18 : 0)}`;
            }
            return <path key={i} d={d} />;
          })}
        </g>
        {/* the doll, lit, pencil touching paper */}
        <g transform={`translate(0 ${-8 * (1 - z)})`}>
          <Doll x={dollX} y={620} s={0.78} sway={sway} id="g3-d" />
        </g>
        {/* candles flanking */}
        {[[150, 1330, 0.95], [930, 1320, 0.9]].map(([x, y, s], i) => (
          <g key={i}><Glow x={x} y={y - 150 * s} r={230 * s} id={`g3-cg${i}`} /><Candle x={x} y={y} s={s} h={130} t={t + i * 2} id={`g3-c${i}`} /></g>
        ))}
        {/* foreground hands framing (dark silhouettes) */}
        <path d="M 0 1440 Q 540 1400 1080 1440 L 1080 1920 L 0 1920 Z" fill={DARK} opacity={0.8} />
        <path d="M 0 0 L 90 0 Q 60 600 0 1100 Z" fill={DARK} opacity={0.7} />
        <path d="M 1080 0 L 990 0 Q 1020 600 1080 1100 Z" fill={DARK} opacity={0.7} />
        <Label x={dollX + 50} y={600} tx={600} ty={470} text="coconut shell" o={k1} right />
        <Label x={dollX + 2} y={1000} tx={330} ty={900} text="stick" o={k2} />
        <Label x={290} y={1190} tx={250} ty={1090} text="paper" o={k3 * (1 - w)} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- shot 13: CTA ---------------- */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const cap = sec - 0.5 - 0.3; // everything fully visible ≥0.5 s before the end
  const at = (re: RegExp, fb: number) => Math.min(wordAt(13, re, fb), cap);
  const r = (s: number) => ramp(t, s, s + 0.3, EOUT);
  const q1 = r(at(/^Would/, 0.05));
  const q2 = r(at(/^jelangkung/, 0.3));
  const c1 = r(at(/^Comment/, 0.45));
  const yes = r(at(/^YES/, 0.55));
  const no = r(at(/^NO/, 0.68));
  const btn = (txt: string, o: number, x: number) => (
    <div style={{
      position: 'absolute', left: x, top: 1360, width: 300, height: 140, borderRadius: 18, border: `4px solid ${ACC}`,
      background: 'rgba(230,211,163,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o,
      transform: `scale(${0.85 + 0.15 * o})`, fontFamily: cinzel, fontWeight: 700, fontSize: 84, color: ACC, letterSpacing: '0.08em',
    }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <Backdrop id="g13" floorY={1900} glowY={560} glow={0.8} />
        <Glow x={540} y={520} r={440} o={0.9} id="g13-bl" />
        <Doll x={540} y={300} s={0.62} sway={2 * Math.sin(t * 1.2)} id="g13-d" dark />
        {/* pencil motif: a drawn line growing under the question */}
        {q2 > 0.01 && <path d={`M 170 1205 L ${170 + 740 * q2} 1205`} stroke={ACC} strokeWidth={4} strokeLinecap="round" opacity={0.8} />}
        <g transform={`translate(${170 + 740 * q2} 1205) rotate(35)`} opacity={q2 * (1 - c1 * 0.0)}>
          <rect x={-10} y={-150} width={20} height={120} fill="#d8a63a" />
          <path d="M -10 -30 L 10 -30 L 0 0 Z" fill="#e9cf9a" />
        </g>
        {/* dim paper with old scrawl at the bottom (pencil motif) */}
        <path d="M 300 1590 L 780 1590 L 860 1780 L 220 1780 Z" fill={PAPER} opacity={0.16} />
        <g stroke={PAPER} strokeWidth={4} fill="none" opacity={0.22} strokeLinecap="round">
          {[0, 1, 2].map((i) => {
            let d = `M ${330 - i * 25} ${1640 + i * 45}`;
            for (let j = 1; j <= 30; j++) d += ` L ${330 - i * 25 + j * (14 + i)} ${1640 + i * 45 + 12 * Math.sin(j * 1.9 + i) - (j % 5 === 2 ? 14 : 0)}`;
            return <path key={i} d={d} />;
          })}
        </g>
        {[[150, 1820, 0.9], [930, 1810, 0.85]].map(([x, y, s], i) => (
          <g key={i}><Glow x={x} y={y - 150 * s} r={230 * s} id={`g13-cg${i}`} /><Candle x={x} y={y} s={s} h={130} t={t + i * 2} id={`g13-c${i}`} /></g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 80, width: 920, top: 940, textAlign: 'center' }}>
        <div style={{ fontFamily: corm, fontStyle: 'italic', fontWeight: 500, fontSize: 70, color: '#f3e8cc', opacity: q1, whiteSpace: 'nowrap' }}>Would you play</div>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 104, color: '#f3e8cc', opacity: q2, letterSpacing: '0.06em', whiteSpace: 'nowrap', marginTop: 4 }}>JELANGKUNG?</div>
      </div>
      <div style={{ position: 'absolute', left: 80, width: 920, top: 1250, textAlign: 'center', fontFamily: cinzel, fontWeight: 400, fontSize: 52, color: '#cfc6b4', letterSpacing: '0.12em', opacity: c1 }}>COMMENT</div>
      {btn('YES', yes, 190)}
      {btn('NO', no, 590)}
    </AbsoluteFill>
  );
};
