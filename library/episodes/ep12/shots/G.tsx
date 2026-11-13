import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadThai } from '@remotion/google-fonts/NotoSerifThai';
import { useShot, ramp, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Glow, OilLamp, Garland, Lime, Woman } from '../art/graphic_art';

const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['700'], subsets: ['latin'] });
const { fontFamily: thai } = loadThai('normal', { weights: ['600'], subsets: ['thai', 'latin'] });

const LAMP = '#ffc46b';
const FULL: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

/** shot 2 — title over a woman's long-haired silhouette in lamp light. */
export const S02: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const a = ramp(p, 0.03, 0.3, EOUT);
  const b = ramp(p, 0.18, 0.45, EOUT);
  const fl = Math.sin(t * 9) * 0.5 + Math.sin(t * 13.7) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0604' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1 + 0.05 * z})`, transformOrigin: '540px 900px' }}>
        <defs>
          <linearGradient id="g2-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0604" />
            <stop offset="0.55" stopColor="#2a170c" />
            <stop offset="1" stopColor="#0a0604" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g2-bg)" />
        {/* teak wall planks, low contrast */}
        {[120, 300, 480, 660, 840, 1020].map((x) => <rect key={x} x={x} y={560} width={6} height={1000} fill="#1a100a" />)}
        {/* lamp glow behind the figure (lightest area) */}
        <Glow id="g2-glow" cx={640} cy={960} rx={520 + fl * 10} ry={560} color={LAMP} o={0.55} />
        {/* floor */}
        <path d="M 0 1330 L 1080 1330 L 1080 1920 L 0 1920 Z" fill="#120a06" />
        <path d="M 0 1330 L 1080 1330" stroke="#3b2a1f" strokeWidth={4} />
        <OilLamp id="g2-l" x={790} y={1330} s={1.05} flick={fl} />
        <Glow id="g2-fl" cx={925} cy={1215} rx={130} color="#ffe0a0" o={0.75} />
        <Woman x={500} y={1320} s={0.88} sway={Math.sin(t * 0.8)} />
        {/* fg dark frame: hanging curtain edges */}
        <path d="M 0 0 L 150 0 Q 120 600 70 1920 L 0 1920 Z" fill="#040201" />
        <path d="M 1080 0 L 960 0 Q 1000 700 1040 1920 L 1080 1920 Z" fill="#040201" />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 200 }}>
        <div style={{ fontFamily: cinzel, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: '0.12em', marginRight: '-0.12em', color: '#f6e6c8', opacity: a, transform: `translateY(${(1 - a) * 24}px)`, whiteSpace: 'nowrap', textShadow: '0 0 40px rgba(255,196,107,0.35)' }}>MAE NAK</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, opacity: b }}>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, rgba(255,200,87,0), ${GREEN})` }} />
          <div style={{ fontFamily: thai, fontWeight: 600, fontSize: 50, letterSpacing: '0.06em', color: '#e0c89a', whiteSpace: 'nowrap' }}>แม่นาก · Thailand</div>
          <div style={{ width: 100 * b, height: 3, background: `linear-gradient(90deg, ${GREEN}, rgba(255,200,87,0))` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** shot 3 — oil lamp still burning on a teak windowsill, wilted jasmine garland beside it. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const z = EIO(p);
  const fl = Math.sin(t * 8.3) * 0.5 + Math.sin(t * 12.1) * 0.5;
  const dim = 1 - 0.15 * ramp(t, wordAt(3, /^died/, 0.9) - 0.3, wordAt(3, /^died/, 0.9) + 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: '#07090d' }}>
      <svg viewBox="0 0 1080 1920" style={{ ...FULL, transform: `scale(${1.02 + 0.07 * z})`, transformOrigin: '640px 1120px' }}>
        <defs>
          <linearGradient id="g3-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1220" />
            <stop offset="0.7" stopColor="#14223a" />
            <stop offset="1" stopColor="#0c1622" />
          </linearGradient>
          <linearGradient id="g3-sill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a5436" />
            <stop offset="0.15" stopColor="#5a3f2b" />
            <stop offset="1" stopColor="#2a1c12" />
          </linearGradient>
        </defs>
        {/* wall */}
        <rect width={1080} height={1920} fill="#1a110b" />
        {/* window opening: night canal outside */}
        <rect x={150} y={260} width={780} height={900} fill="url(#g3-night)" />
        <circle cx={760} cy={430} r={46} fill="#cfd8e6" opacity={0.85} />
        <Glow id="g3-moon" cx={760} cy={430} rx={170} color="#cfd8e6" o={0.35} />
        {/* far bank palms + banana, flat */}
        <path d="M 150 920 Q 300 880 450 905 Q 640 870 930 900 L 930 1160 L 150 1160 Z" fill="#070a0f" />
        <path d="M 300 905 L 310 700 M 310 700 Q 250 690 220 730 M 310 700 Q 360 660 410 690 M 310 700 Q 290 650 250 640 M 310 700 Q 350 700 380 740" stroke="#070a0f" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M 150 1010 L 930 1010" stroke="#cfd8e6" strokeWidth={2} opacity={0.25} />
        <path d="M 700 1030 L 800 1030 M 730 1050 L 780 1050" stroke="#cfd8e6" strokeWidth={3} opacity={0.4} />
        {/* faint reflection of a long-haired woman in the left pane, only as she 'waited… even after she died' */}
        <g opacity={0.45 * ramp(t, wordAt(3, /^waited\u2026|^waited…/, 0.68), wordAt(3, /^died/, 0.92))}><Woman x={430} y={1150} s={0.58} rim="#cfd8e6" /></g>
        {/* window frame + shutters */}
        <rect x={150} y={260} width={780} height={900} fill="none" stroke="#3b2a1f" strokeWidth={30} />
        <path d="M 540 260 L 540 1160" stroke="#3b2a1f" strokeWidth={18} />
        <path d="M 150 260 L 30 210 L 30 1220 L 150 1160 Z" fill="#2a1c12" />
        <path d="M 930 260 L 1050 210 L 1050 1220 L 930 1160 Z" fill="#24180f" />
        {/* lamp glow on wall/frame (warm, lightest area) */}
        <Glow id="g3-warm" cx={600} cy={1120} rx={560 * dim + fl * 8} ry={480} color={LAMP} o={0.55 * dim} />
        {/* teak sill */}
        <path d="M -20 1170 L 1100 1170 L 1100 1290 L -20 1290 Z" fill="url(#g3-sill)" />
        <path d="M -20 1170 L 1100 1170" stroke="#ffcf8a" strokeWidth={3} opacity={0.5} />
        <path d="M -20 1290 L 1100 1290 L 1100 1920 L -20 1920 Z" fill="#120b07" />
        {/* hero: lamp + garland */}
        <Garland x={90} y={1186} s={1.05} />
        <OilLamp id="g3-l" x={640} y={1196} s={1.7} flick={fl} />
        <Glow id="g3-fl" cx={858} cy={1010} rx={150 + fl * 6} color="#ffe0a0" o={0.8 * dim} />
        {/* fg dark framing: hanging banana leaf edge */}
        <path d="M 1080 0 L 860 0 Q 900 120 1000 180 Q 1060 210 1080 300 Z" fill="#040506" />
        <path d="M 0 1920 L 0 1500 Q 80 1560 140 1920 Z" fill="#050302" />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 13 — CTA: "Would you have run?" / "Comment YES or NO", lime + lamp motif. */
export const S13: React.FC = () => {
  const { t, sec } = useShot();
  const latest = sec - 0.5 - 0.3; // everything fully visible >=0.5 s before end
  const tA = Math.min(wordAt(13, /^Would/, 0.05), latest - 1.2);
  const tB = Math.min(wordAt(13, /^Comment/, 0.45), latest - 0.6);
  const tY = Math.min(wordAt(13, /^YES/, 0.55), latest - 0.3);
  const tN = Math.min(wordAt(13, /^NO/, 0.8), latest);
  const ap = (t0: number) => ramp(t, t0, t0 + 0.3, EOUT);
  const fl = Math.sin(t * 8.3) * 0.5 + Math.sin(t * 12.1) * 0.5;
  const A = ap(tA), B = ap(tB), Y = ap(tY), N = ap(tN);
  const word = (o: number, color: string, txt: string) => (
    <span style={{ display: 'inline-block', opacity: o, transform: `translateY(${(1 - o) * 16}px)`, color }}>{txt}</span>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0604' }}>
      <svg viewBox="0 0 1080 1920" style={FULL}>
        <defs>
          <linearGradient id="g13-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0604" />
            <stop offset="0.6" stopColor="#1e120a" />
            <stop offset="1" stopColor="#0a0604" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#g13-bg)" />
        <Glow id="g13-warm" cx={540} cy={1260} rx={560 + fl * 8} ry={420} color={LAMP} o={0.5} />
        <path d="M 0 1400 L 1080 1400 L 1080 1920 L 0 1920 Z" fill="#120a06" />
        <path d="M 0 1400 L 1080 1400" stroke="#3b2a1f" strokeWidth={4} />
        <Lime id="g13-lime" x={290} y={1318} s={1.4} />
        <OilLamp id="g13-l" x={600} y={1400} s={1.5} flick={fl} />
        <Glow id="g13-fl" cx={792} cy={1210} rx={160} color="#ffe0a0" o={0.75} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', top: 470 }}>
        <div style={{ width: 920, textAlign: 'center', fontFamily: cinzel, fontWeight: 700, fontSize: 96, lineHeight: 1.15, color: '#f6e6c8' }}>
          {word(A, '#f6e6c8', 'Would you')}<br />{word(A, '#f6e6c8', 'have\u00a0')}{word(A, GREEN, 'run?')}
        </div>
        <div style={{ width: 120 * B, height: 3, marginTop: 50, background: GREEN, opacity: B }} />
        <div style={{ width: 920, textAlign: 'center', marginTop: 50, fontFamily: cinzel, fontWeight: 700, fontSize: 72, lineHeight: 1.3, color: '#e0c89a' }}>
          {word(B, '#e0c89a', 'Comment')}<br />{word(Y, GREEN, 'YES')}{word(Y, '#e0c89a', ' or ')}{word(N, GREEN, 'NO')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
