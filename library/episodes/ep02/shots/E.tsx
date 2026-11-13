import React from 'react';
import { AbsoluteFill, spring } from 'remotion';
import { W, rng } from '../art/world';
import { Ribbon, Pt } from '../art/Silk';
import { BandImg, Live, useShot, ramp, Cam, EIO, EOUT } from '../comp/Camera';
import { DEEP_C } from '../sets/graphic';
import { CAPTION_FONT, GREEN } from '../comp/Overlays';
import { cinzel, CrownMark } from './Title';
import { spanOf, FPS } from '../data/ep';

/* =============== Set E: graphic / typographic =============== */

const useWords = (id: number) => {
  const sp = spanOf(id);
  return sp.shot.words.map((w) => ({ ...w, f: Math.round((w.start - sp.from / FPS) * FPS) }));
};

/** 2 — "Never wear green." Green silk whips across and stops hard; each word slams. */
export const S02: React.FC = () => {
  const { t, f, fps } = useShot();
  const words = useWords(2);
  // silk: flies in from lower-left, hard stop at ~0.3 s, then breathes
  const whip = ramp(t, 0, 0.3, EOUT);
  const pts: Pt[] = Array.from({ length: 70 }, (_, i) => {
    const s = i / 69;
    const x = -500 + s * 2300 - (1 - whip) * 1900, y = 1700 - s * 1500 + Math.sin(s * 4 + t * 2) * 90 + (1 - whip) * 500;
    return [x, y];
  });
  const twist = (s: number) => 1.3 * Math.sin(s * 6 - t * 2.4 - whip * 4) + 0.2;
  // camera shake on every slam
  let shake = 0;
  for (const w of words) { const d = f - w.f; if (d >= 0 && d < 12) shake = Math.max(shake, (1 - d / 12) * 14); }
  const sx = Math.sin(f * 2.9) * shake, sy = Math.cos(f * 3.7) * shake;
  const cam: Cam = { zoom: 1.12 + 0.04 * t, dx: 0, dy: 0, tx: sx * 0.4, ty: sy * 0.4 };
  const sizes = [150, 150, 210];
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070a', overflow: 'hidden' }}>
      <BandImg id="beach/soft" cam={cam} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(4,10,8,0.55), rgba(2,4,4,0.92))' }} />
      <Live cam={{ zoom: 1, dx: 0, dy: 0, tx: sx, ty: sy }} w={1080} h={1920}>
        <Ribbon pts={pts} width={(s) => 300 + 140 * Math.sin(s * 3)} twist={twist} trim light={0.6} />
      </Live>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translate(${sx}px, ${sy - 60}px)` }}>
        {words.map((w, i) => {
          const s = spring({ frame: f - w.f, fps, config: { damping: 11, stiffness: 260, mass: 0.7 } });
          const on = f >= w.f;
          const isG = /green/i.test(w.text);
          return (
            <div key={i} style={{
              fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: sizes[i] ?? 150, lineHeight: 1.0, letterSpacing: '-0.01em',
              color: isG ? GREEN : '#fff', opacity: on ? 1 : 0, transform: `scale(${on ? 1.8 - 0.8 * s : 1.8})`,
              textShadow: isG ? '0 0 40px rgba(80,255,160,0.8), 0 0 90px rgba(40,220,130,0.5), 0 6px 20px rgba(0,0,0,0.6)' : '0 6px 24px rgba(0,0,0,0.7)',
              textTransform: 'uppercase',
            }}>{w.text}</div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A regal figure, half-formed in light: crown, veil, shoulders. Used at very low opacity. */
const Presence: React.FC<{ s: number; o: number }> = ({ s, o }) => (
  <g transform={`translate(${DEEP_C.x} ${DEEP_C.y + 40}) scale(${s})`} opacity={o}>
    <defs>
      <linearGradient id="presFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#03301c" stopOpacity="1" />
        <stop offset="0.55" stopColor="#03301c" stopOpacity="0.8" />
        <stop offset="1" stopColor="#03301c" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g fill="url(#presFade)">
      {/* crown (jamang points), head, veil falling to narrow shoulders, dissolving */}
      <path d="M -26 -196 L -23 -218 L -14 -205 L -7 -232 L 0 -212 L 7 -232 L 14 -205 L 23 -218 L 26 -196 Z" />
      <path d="M -28 -166 C -28 -196, 28 -196, 28 -166 C 28 -140, 18 -126, 0 -124 C -18 -126, -28 -140, -28 -166 Z" />
      <path d="M -30 -180 C -40 -140, -50 -110, -92 -84 C -120 -66, -130 -30, -128 40 L 128 40 C 130 -30, 120 -66, 92 -84 C 50 -110, 40 -140, 30 -180 C 20 -150, -20 -150, -30 -180 Z" />
    </g>
  </g>
);

/** 16 — POV pushing into dark water; the green glow swells toward the lens with a heartbeat. */
export const S16: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1 + 0.4 * e, dx: 0, dy: 0, oy: DEEP_C.y - 192, rot: Math.sin(t * 0.5) * 1.2 };
  // heartbeat: lub-dub at ~70 bpm
  const ph = (t * 1.15) % 1;
  const beat = Math.exp(-(((ph - 0.05) / 0.05) ** 2)) + 0.6 * Math.exp(-(((ph - 0.22) / 0.05) ** 2));
  const grow = Math.pow(p, 2.1);
  const R = 120 + grow * 1500;
  const r = rng(16);
  const motes = Array.from({ length: 46 }, () => ({ a: r() * 6.28, d0: r(), sp: 0.15 + r() * 0.3, s: 1 + r() * 3 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#03100f', overflow: 'hidden' }}>
      <BandImg id="graphic/deep" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="glow16" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e6fff0" stopOpacity="1" />
            <stop offset="0.12" stopColor="#8affc0" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#2fd88a" stopOpacity="0.45" />
            <stop offset="0.75" stopColor="#0f7a49" stopOpacity="0.15" />
            <stop offset="1" stopColor="#0f7a49" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={DEEP_C.x} cy={DEEP_C.y} r={R * (1.6 + 0.12 * beat)} fill="url(#glow16)" opacity={0.35 + 0.3 * grow} />
        <circle cx={DEEP_C.x} cy={DEEP_C.y} r={R * (0.7 + 0.08 * beat)} fill="url(#glow16)" opacity={0.6 + 0.4 * grow} />
        <Presence s={1.3 + grow * 1.2} o={0.2 * ramp(p, 0.25, 0.6) * (1 - ramp(p, 0.82, 0.97))} />
        {motes.map((m, i) => {
          const d = (m.d0 + t * m.sp) % 1;
          const dist = 40 + d * d * 1300;
          return <circle key={i} cx={DEEP_C.x + Math.cos(m.a) * dist} cy={DEEP_C.y + Math.sin(m.a) * dist * 1.3} r={m.s * (0.4 + d * 2.4)} fill="#c8ffe0" opacity={(1 - d) * 0.7 * d * 3} />;
        })}
      </Live>
      <BandImg id="graphic/weeds" k={1.8} cam={cam} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(120,255,180,${0.18 * grow + 0.06 * beat}), rgba(0,0,0,0) 60%)` }} />
    </AbsoluteFill>
  );
};

/** 17 — end card. Static camera; words pop on their beats; the green swatch answers. */
export const S17: React.FC = () => {
  const { t, f, fps } = useShot();
  const words = useWords(17);
  const cam: Cam = { zoom: 1.02 - 0.02 * ramp(t, 0, 3), dx: 0, dy: 0 };
  const sw = ['#f4f1ec', '#15151a', '#c8323a', '#2f5fb8', '#e8c040', '#2fd88a'];
  const lastW = words[words.length - 1]?.f ?? 30;
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  const intro = ramp(t, 0, 0.5, EOUT);
  return (
    <AbsoluteFill style={{ backgroundColor: '#030806', overflow: 'hidden' }}>
      <BandImg id="graphic/end" cam={cam} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 420 }}>
        <div style={{ opacity: intro, transform: `translateY(${(1 - intro) * 10}px)` }}><CrownMark w={110} color="#c9a45c" /></div>
        <div style={{ fontFamily: cinzel, fontWeight: 500, fontSize: 40, letterSpacing: '0.32em', marginRight: '-0.32em', color: '#d8bf86', marginTop: 16, opacity: intro }}>NYI RORO KIDUL</div>
        {/* speech bubble */}
        <svg width={120} height={110} viewBox="0 0 120 110" style={{ marginTop: 120, opacity: intro }}>
          <path d="M 14 10 H 106 A 10 10 0 0 1 116 20 V 70 A 10 10 0 0 1 106 80 H 52 L 28 102 L 32 80 H 14 A 10 10 0 0 1 4 70 V 20 A 10 10 0 0 1 14 10 Z" fill="none" stroke="#f4f1ec" strokeWidth={5} strokeLinejoin="round" />
          {[36, 60, 84].map((x, i) => <circle key={x} cx={x} cy={45} r={6} fill={i === 2 ? GREEN : '#f4f1ec'} opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 5 - i))} />)}
        </svg>
        <div style={{ marginTop: 40, fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 118, lineHeight: 1.04, textAlign: 'center', width: 900 }}>
          {[[0, 1], [2, 3]].map((line, li) => (
            <div key={li}>
              {line.map((wi) => {
                const w = words[wi];
                if (!w) return null;
                const s = spring({ frame: f - w.f, fps, config: { damping: 13, stiffness: 240, mass: 0.6 } });
                return (
                  <span key={wi} style={{ display: 'inline-block', margin: '0 0.14em', color: w.highlight ? GREEN : '#fff', opacity: f >= w.f - 1 ? Math.min(1, s * 1.5) : 0, transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`, textShadow: w.highlight ? '0 0 36px rgba(80,255,160,0.6)' : '0 4px 20px rgba(0,0,0,0.6)' }}>{w.text}</span>
                );
              })}
            </div>
          ))}
        </div>
        {/* shirt swatches */}
        <div style={{ display: 'flex', gap: 30, marginTop: 90 }}>
          {sw.map((c, i) => {
            const s = spring({ frame: f - lastW - 4 - i * 3, fps, config: { damping: 12, stiffness: 200 } });
            const g = i === sw.length - 1;
            return (
              <div key={c} style={{ position: 'relative', width: 92, height: 92 }}>
                {g && <div style={{ position: 'absolute', left: -60, top: -60, width: 212, height: 212, borderRadius: 106, opacity: s * (0.6 + 0.4 * pulse), background: 'radial-gradient(circle, rgba(80,255,160,0.7) 30%, rgba(80,255,160,0) 70%)' }} />}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 46, background: c, transform: `scale(${s * (g ? 1 + 0.08 * pulse : 1)})`, border: '3px solid rgba(255,255,255,0.25)' }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Live cam={{ zoom: 1, dx: 0, dy: 0 }}>
        {Array.from({ length: 30 }, (_, i) => {
          const rr = rng(200 + i);
          const x = rr() * W, y = 300 + rr() * 1800 - ((t * (10 + rr() * 20)) % 200);
          return <circle key={i} cx={x} cy={y} r={1 + rr() * 2} fill="#8affc0" opacity={0.15 + 0.25 * Math.sin(t * 2 + i) ** 2} />;
        })}
      </Live>
    </AbsoluteFill>
  );
};

export { EIO };
