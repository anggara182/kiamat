import data from './episode.json';

export type Word = { text: string; highlight: boolean; start: number; end: number };
export type Shot = {
  id: number; start: number; end: number; act: number; set: string; framing: string; camera: string;
  vo: string; voKind: string; notes: string; words: Word[];
  trans?: 'cut' | 'dip' | 'flash' | 'white'; caption?: boolean; leak?: number; cool?: boolean; hero?: string; owner?: string;
};
type Ep = { accent?: string; fps: number; width: number; height: number; durationSec: number; audio?: boolean; shots: Shot[] };

export const EP = data as unknown as Ep;
export const FPS = EP.fps;

export type ShotSpan = { shot: Shot; from: number; dur: number };

/**
 * Frame spans derived from the shot list (never hardcoded): shots are made contiguous
 * (each runs until the next one starts) so a gap in VO timing never shows black.
 */
export const SPANS: ShotSpan[] = (() => {
  const shots = EP.shots;
  const total = Math.max(Math.round(EP.durationSec * FPS), Math.round(shots[shots.length - 1].end * FPS));
  return shots.map((shot, i) => {
    const from = i === 0 ? 0 : Math.round(shot.start * FPS);
    const to = i === shots.length - 1 ? total : Math.round(shots[i + 1].start * FPS);
    return { shot, from, dur: Math.max(1, to - from) };
  });
})();
export const TOTAL_FRAMES = SPANS[SPANS.length - 1].from + SPANS[SPANS.length - 1].dur;

export const spanOf = (id: number) => SPANS.find((s) => s.shot.id === id)!;

/** Local time (s, relative to the shot's Sequence start) of the first word matching `re`, or `fallback` (0..1 of the shot). */
export const wordAt = (id: number, re: RegExp, fallback: number, which: 'start' | 'end' = 'start') => {
  const sp = spanOf(id);
  const w = sp.shot.words.find((x) => re.test(x.text));
  return w ? w[which] - sp.from / FPS : (fallback * sp.dur) / FPS;
};
