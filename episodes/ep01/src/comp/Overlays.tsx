import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { FRAME } from '../art/world';
import { EP, SPANS, FPS, Word } from '../data/ep';

const { fontFamily } = loadFont('normal', { weights: ['800'], subsets: ['latin'] });
export const CAPTION_FONT = fontFamily;
export const GREEN = EP.accent ?? '#7dffb0'; // caption keyword colour (per episode)

/**
 * Grain + vignette applied ONCE over the merged frame. Tile cycles every 2 frames.
 * The grain tiles are pre-converted to signed alpha noise (white/black + alpha), so a plain alpha
 * blend reproduces the old overlay-blend look without forcing a blend-mode composite of the whole frame.
 */
/** Vignette only: grain is added at the final ffmpeg encode (scripts/finish.sh), so it can be tuned without re-rendering.
 *  Strength follows the current shot's `light`: night .7, dawn .5, day .3 (bright shots keep their light, edges still settle). */
export const VIGNETTE_BY_LIGHT = { night: 0.7, dawn: 0.5, day: 0.3 } as const;
export const Vignette: React.FC<{ vignette?: number }> = ({ vignette }) => {
  const f = useCurrentFrame();
  const span = SPANS.find((s) => f >= s.from && f < s.from + s.dur) ?? SPANS[SPANS.length - 1];
  const v = vignette ?? VIGNETTE_BY_LIGHT[span.shot.light ?? 'night'];
  return <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(8,4,16,${v}) 100%)` }} />;
};

export const Grain: React.FC<{ opacity?: number; vignette?: number }> = ({ opacity = 0.075, vignette = 0.75 }) => {
  const f = useCurrentFrame();
  const i = Math.floor(f / 2) % 4;
  const ox = ((Math.floor(f / 2) * 137) % 200) - 100, oy = ((Math.floor(f / 2) * 71) % 200) - 100;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* all four tiles stay mounted (no src swap = no per-frame decode/wait); only one is visible */}
      {[0, 1, 2, 3].map((k) => (
        <Img key={k} src={staticFile(`grain/a${k}.png`)} style={{ position: 'absolute', left: -100 + ox, top: -100 + oy, width: FRAME.w + 200, height: FRAME.h + 200, opacity: k === i ? opacity : 0, imageRendering: 'pixelated' }} />
      ))}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(8,4,16,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

/* ---------------- per-shot look: light leak, transitions, caption policy ---------------- */
/** Transition INTO shot `id` (from the previous one). */
export const TRANS_IN: Record<number, 'cut' | 'dip' | 'flash' | 'white'> = Object.fromEntries(EP.shots.map((s) => [s.id, s.trans ?? 'cut']));
/** Shots whose words are already the on-screen text (no caption). */
export const NO_CAPTION = new Set(EP.shots.filter((s) => s.caption === false).map((s) => s.id));

const actOf = (f: number) => (SPANS.find((s) => f >= s.from && f < s.from + s.dur) ?? SPANS[SPANS.length - 1]).shot.act;

/** Warm light leak in acts 1-4, cooler and greener from the twist on. Two pre-rendered soft blobs, moved by transform only. */
export const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  const span = SPANS.find((s) => f >= s.from && f < s.from + s.dur) ?? SPANS[SPANS.length - 1];
  const id = span.shot.id;
  const cool = span.shot.cool ?? false;
  const strength = span.shot.leak ?? 0.45;
  const t = f / FPS;
  const pulse = 0.85 + 0.15 * Math.sin(t * 1.3);
  const blob = (src: string, cx: number, cy: number, w: number, h: number, o: number) => (
    <Img src={staticFile(`grain/${src}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: 512, height: 512, opacity: o, transformOrigin: '0 0', transform: `translate(${cx - w / 2}px, ${cy - h / 2}px) scale(${w / 512}, ${h / 512})` }} />
  );
  return (
    <AbsoluteFill style={{ opacity: strength * pulse, pointerEvents: 'none' }}>
      {blob(cool ? 'leak-cool' : 'leak-warm', FRAME.w * (0.2 + Math.sin(t * 0.35) * 0.18), FRAME.h * (0.18 + Math.cos(t * 0.27) * 0.1), 1300, 1350, 0.5)}
      {blob(cool ? 'leak-cool2' : 'leak-warm2', FRAME.w * (0.85 + Math.sin(t * 0.22 + 2) * 0.12), FRAME.h * 0.7, 650, 1900, 0.3)}
    </AbsoluteFill>
  );
};

/** Dips / flashes at shot boundaries, all derived from the shot list. */
export const Transitions: React.FC = () => {
  const f = useCurrentFrame();
  let black = 0, green = 0, white = 0;
  for (let i = 1; i < SPANS.length; i++) {
    const b = SPANS[i].from, kind = TRANS_IN[SPANS[i].shot.id] ?? 'cut';
    const d = f - b;
    if (kind === 'dip') {
      black = Math.max(black, interpolate(d, [-7, 0, 9], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    } else if (kind === 'flash') {
      green = Math.max(green, interpolate(d, [-2, 0, 10], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    } else if (kind === 'white') {
      white = Math.max(white, interpolate(d, [-6, 0, 8], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    }
  }
  // fade in from black at the very start, out at the very end
  const total = SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].dur;
  black = Math.max(black, interpolate(f, [0, 8], [1, 0], { extrapolateRight: 'clamp' }), interpolate(f, [total - 12, total - 1], [0, 1], { extrapolateLeft: 'clamp' }));
  if (!black && !green && !white) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {green > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(210,255,230,${green}), rgba(60,220,140,${green * 0.85}) 60%, rgba(10,80,50,${green * 0.7}))` }} />}
      {white > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(255,255,255,${white}), rgba(190,230,240,${white * 0.8}))` }} />}
      {black > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${black})` }} />}
    </AbsoluteFill>
  );
};

/* ---------------- captions ---------------- */
type Page = { words: Word[]; start: number; end: number; lines: Word[][] };
const MAX_LINE = 21;
const CAPTION_TAIL = 0.6; // s the last caption page lingers after its last word
const len = (ws: Word[]) => ws.reduce((a, w) => a + w.text.length + 1, 0) - 1;
const lineify = (ws: Word[]) => {
  const lines: Word[][] = [[]];
  for (const w of ws) {
    const l = lines[lines.length - 1];
    if (l.length && len(l) + 1 + w.text.length > MAX_LINE) lines.push([w]); else l.push(w);
  }
  return lines;
};
/** Pages of at most two lines; a sentence end closes a page once it has some length. */
const paginate = (words: Word[], shotEnd: number): Page[] => {
  const pages: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    if (cur.length && lineify([...cur, w]).length > 2) { pages.push(cur); cur = []; }
    cur.push(w);
    if (/[.!?…]$/.test(w.text) && len(cur) > 10) { pages.push(cur); cur = []; }
  }
  if (cur.length) pages.push(cur);
  // last page ends shortly after its last word (not at the shot end), so end cards/title cards stay clean
  return pages.map((ws, i) => ({ words: ws, lines: lineify(ws), start: ws[0].start, end: i < pages.length - 1 ? pages[i + 1][0].start : Math.min(shotEnd, ws[ws.length - 1].end + CAPTION_TAIL) }));
};
const PAGES = SPANS.flatMap((s) => (NO_CAPTION.has(s.shot.id) ? [] : paginate(s.shot.words, (s.from + s.dur) / FPS).map((p) => ({ ...p, shot: s.shot.id, shotFrom: s.from }))));

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const page = PAGES.find((p) => t >= p.start - 0.05 && t < p.end);
  const span = SPANS.find((s) => f >= s.from && f < s.from + s.dur);
  const lastWord = span?.shot.words[span.shot.words.length - 1];
  const scrimOn = span && !NO_CAPTION.has(span.shot.id) && (!lastWord || t < lastWord.end + CAPTION_TAIL) ? 1 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* fixed lower-third scrim */}
      <AbsoluteFill style={{ opacity: scrimOn, background: 'linear-gradient(180deg, rgba(6,4,12,0) 60%, rgba(6,4,12,0.55) 71%, rgba(6,4,12,0.62) 82%, rgba(6,4,12,0.3) 100%)' }} />
      {page && (
        <div style={{ position: 'absolute', top: FRAME.h * 0.74, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 46, lineHeight: 1.22, color: '#fff', textAlign: 'center', maxWidth: 820, letterSpacing: '-0.005em' }}>
            {page.lines.map((l, i) => (
              <div key={i}>
                {l.map((w, j) => {
                  const wf = Math.round(w.start * FPS);
                  const sp = spring({ frame: f - wf, fps: FPS, config: { damping: 14, stiffness: 220, mass: 0.6 } });
                  const on = f >= wf - 1;
                  const active = t >= w.start && t < w.end + 0.15;
                  return (
                    <span key={j} style={{
                      display: 'inline-block', marginRight: j < l.length - 1 ? '0.26em' : 0,
                      opacity: on ? Math.min(1, sp * 1.6) : 0, transform: `translateY(${(1 - sp) * 18}px) scale(${0.7 + 0.3 * sp + (active ? 0.04 : 0)})`,
                      color: w.highlight ? GREEN : '#fff',
                      textShadow: w.highlight ? '0 0 24px rgba(80,255,160,0.55), 0 3px 12px rgba(0,0,0,0.8)' : '0 3px 12px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)',
                    }}>{w.text}</span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export { actOf };
