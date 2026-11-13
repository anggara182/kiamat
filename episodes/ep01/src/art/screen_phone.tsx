import React from 'react';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', { weights: ['600', '800'], subsets: ['latin'] });
export const UI_FONT = fontFamily;

/* ---------------- phone geometry (local px, body centred on the origin) ---------------- */
export const PW = 540, PH = 1120, PR = 78, BZ = 18;
export const SW = PW - 2 * BZ, SH = PH - 2 * BZ, SR = 62;
/** feed layout inside the screen (screen coords: 0..SW, 0..SH) */
export const FEED_TOP = 132, CARD_W = SW - 32, CARD_H = 420, CH = CARD_H + 22;

export type UI = { bg: string; card: string; bar: string; barOp: number; meta: string; chrome: string };
export const UI_DAY: UI = { bg: '#f4f2ee', card: '#ffffff', bar: '#2b2d33', barOp: 0.6, meta: '#c3bfb8', chrome: '#2b2d33' };
export const UI_NIGHT: UI = { bg: '#14161c', card: '#20232b', bar: '#c9ccd4', barOp: 0.5, meta: '#3c404a', chrome: '#c9ccd4' };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * A rect box-blurred along one axis by L px (motion smear): trapezoid alpha profile as a gradient.
 * Exact for a solid rect moving at constant speed, no filters needed.
 */
export const SRect: React.FC<{ id: string; x: number; y: number; w: number; h: number; rx?: number; fill: string; op?: number; L?: number; axis?: 'x' | 'y' }> = ({ id, x, y, w, h, rx = 0, fill, op = 1, L = 0, axis = 'y' }) => {
  if (L < 1.5) return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} opacity={op} />;
  const len = axis === 'y' ? h : w;
  const tot = len + L, a = Math.min(len, L) / tot, pk = Math.min(1, len / L);
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2={axis === 'x' ? 1 : 0} y2={axis === 'y' ? 1 : 0}>
          <stop offset={0} stopColor={fill} stopOpacity={0} />
          <stop offset={a} stopColor={fill} stopOpacity={pk} />
          <stop offset={1 - a} stopColor={fill} stopOpacity={pk} />
          <stop offset={1} stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      {axis === 'y'
        ? <rect x={x} y={y - L / 2} width={w} height={tot} rx={rx} fill={`url(#${id})`} opacity={op} />
        : <rect x={x - L / 2} y={y} width={tot} height={h} rx={rx} fill={`url(#${id})`} opacity={op} />}
    </>
  );
};

/* ---------------- news cards: real (fictional, generic) headlines + illustrated thumbnails, no gore ---------------- */
export type Thumb = 'rubble' | 'smoke' | 'tents' | 'night' | 'mics' | 'fire' | 'drought' | 'flood' | 'crowd';
export type Tag = 'BREAKING' | 'WAR' | 'LIVE' | 'UPDATE';
export type NewsSpec = { tag?: Tag; head: string; time: string; thumb: Thumb };
export const TAG_C: Record<Tag, string> = { BREAKING: '#c8322a', WAR: '#8e1f1f', LIVE: '#d2452f', UPDATE: '#59606c' };

/** Every headline used on screen (STYLE.md "Headlines", exact text). */
export const NEWS = {
  quake: { tag: 'BREAKING', head: '7.4 quake flattens coastal towns, thousands missing', time: '2m ago', thumb: 'rubble' },
  camp: { tag: 'WAR', head: 'Airstrikes hit refugee camp overnight', time: '5m ago', thumb: 'smoke' },
  genocide: { tag: 'BREAKING', head: 'Rights group warns of genocide as entire families are wiped out', time: '1m ago', thumb: 'tents' },
  debt: { head: 'Man stabbed to death over a $12 debt', time: '9m ago', thumb: 'night' },
  funds: { tag: 'UPDATE', head: 'Official arrested for stealing disaster relief funds', time: '3m ago', thumb: 'mics' },
  wildfire: { head: 'Wildfires force 80,000 to flee', time: 'just now', thumb: 'fire' },
  famine: { head: 'Famine declared in three provinces', time: 'just now', thumb: 'drought' },
  ceasefire: { tag: 'WAR', head: 'Ceasefire collapses after 48 hours', time: 'just now', thumb: 'crowd' },
  toll: { tag: 'LIVE', head: 'Death toll passes 12,000', time: '4m ago', thumb: 'rubble' },
  floods: { tag: 'BREAKING', head: 'Floods sweep away entire villages', time: '12m ago', thumb: 'flood' },
} satisfies Record<string, NewsSpec>;

const THUMB_AVG: Record<Thumb, string> = { rubble: '#a88a68', smoke: '#8c8a8a', tents: '#c9c2b2', night: '#1d2333', mics: '#7d7873', fire: '#7a3e2a', drought: '#c9a877', flood: '#7c6f58', crowd: '#8f8780' };

/** rough Inter-800 advance widths (em) for line wrapping */
const adv = (ch: string) => (/[ .,'!:;|]/.test(ch) ? 0.3 : /[ilIjtfr1]/.test(ch) ? 0.38 : /[mwMW]/.test(ch) ? 0.9 : /[A-Z0-9$]/.test(ch) ? 0.68 : 0.58);
export const wrap = (text: string, fs: number, maxW: number) => {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    const width = [...next].reduce((a, c) => a + adv(c) * fs, 0);
    if (cur && width > maxW) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

/** Flat illustrated thumbnail (silhouettes only, no people hurt, no gore). */
const ThumbArt: React.FC<{ kind: Thumb; w: number; h: number; id: string }> = ({ kind, w, h, id }) => {
  const g = (c1: string, c2: string, k = 'g') => (
    <>
      <defs><linearGradient id={`${id}${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <rect x={0} y={0} width={w} height={h} fill={`url(#${id}${k})`} />
    </>
  );
  const puff = (cx: number, cy: number, r: number, c: string, o = 1) => <circle cx={cx} cy={cy} r={r} fill={c} opacity={o} />;
  switch (kind) {
    case 'rubble':
      return (
        <g>
          {g('#e2c7a0', '#a9855c')}
          {puff(w * 0.3, h * 0.35, h * 0.3, '#f0dcbc', 0.7)}{puff(w * 0.5, h * 0.3, h * 0.24, '#ead3ae', 0.7)}
          <rect x={w * 0.08} y={h * 0.32} width={w * 0.16} height={h * 0.7} fill="#7a6048" />
          <g transform={`rotate(14 ${w * 0.5} ${h})`}><rect x={w * 0.4} y={h * 0.2} width={w * 0.2} height={h * 0.9} fill="#5f4a38" />
            {[0, 1, 2].map((r) => <rect key={r} x={w * 0.43} y={h * (0.3 + r * 0.17)} width={w * 0.14} height={h * 0.07} fill="#3f3127" />)}</g>
          <path d={`M${w * 0.68} ${h} L${w * 0.7} ${h * 0.45} L${w * 0.84} ${h * 0.58} L${w * 0.86} ${h} Z`} fill="#6c543f" />
          <path d={`M0 ${h} L0 ${h * 0.8} L${w * 0.15} ${h * 0.7} L${w * 0.3} ${h * 0.82} L${w * 0.48} ${h * 0.68} L${w * 0.62} ${h * 0.8} L${w * 0.8} ${h * 0.7} L${w} ${h * 0.82} L${w} ${h} Z`} fill="#4a3a2d" />
          {[0.2, 0.42, 0.58, 0.9].map((x, i) => <rect key={i} x={w * x} y={h * (0.76 + (i % 2) * 0.05)} width={w * 0.05} height={h * 0.03} fill="#2f251e" transform={`rotate(${i * 23 - 20} ${w * x} ${h * 0.78})`} />)}
        </g>
      );
    case 'smoke':
      return (
        <g>
          {g('#6d6f78', '#e0b98a')}
          {[[0.62, 0.62, 0.16], [0.58, 0.44, 0.2], [0.66, 0.28, 0.22], [0.55, 0.12, 0.24], [0.74, 0.06, 0.2]].map(([x, y, r], i) => puff(w * x, h * y, h * r, i % 2 ? '#3d3c40' : '#4a484c', 0.95))}
          {puff(w * 0.6, h * 0.82, h * 0.16, '#ff9a3c', 0.55)}
          <path d={`M0 ${h} L0 ${h * 0.7} L${w * 0.1} ${h * 0.7} L${w * 0.1} ${h * 0.56} L${w * 0.2} ${h * 0.56} L${w * 0.2} ${h * 0.74} L${w * 0.34} ${h * 0.74} L${w * 0.34} ${h * 0.5} L${w * 0.42} ${h * 0.5} L${w * 0.42} ${h * 0.78} L${w * 0.56} ${h * 0.78} L${w * 0.56} ${h * 0.66} L${w * 0.74} ${h * 0.66} L${w * 0.74} ${h * 0.58} L${w * 0.86} ${h * 0.58} L${w * 0.86} ${h * 0.72} L${w} ${h * 0.72} L${w} ${h} Z`} fill="#25262b" />
        </g>
      );
    case 'tents':
      return (
        <g>
          {g('#c9d4dc', '#d8ccb0')}
          <rect x={0} y={h * 0.5} width={w} height={h * 0.5} fill="#c4b08a" />
          {[0, 1, 2].map((row) => Array.from({ length: 6 - row }, (_, i) => {
            const s = 0.55 + row * 0.35, tw = w * 0.13 * s, x = w * (0.04 + i * (0.17 + row * 0.05)) + row * 14, y = h * (0.56 + row * 0.16);
            return <g key={`${row}${i}`}><path d={`M${x} ${y + tw * 0.55} L${x + tw / 2} ${y} L${x + tw} ${y + tw * 0.55} Z`} fill={i % 2 ? '#eeeae0' : '#dcd6c8'} /><path d={`M${x + tw / 2} ${y} L${x + tw * 0.62} ${y + tw * 0.55} L${x + tw * 0.38} ${y + tw * 0.55} Z`} fill="#8c8270" /></g>;
          }))}
          {puff(w * 0.85, h * 0.2, h * 0.12, '#ffffff', 0.6)}
        </g>
      );
    case 'night':
      return (
        <g>
          {g('#1c2233', '#0f121b')}
          {puff(w * 0.22, h * 0.4, h * 0.34, '#e0473c', 0.35)}{puff(w * 0.78, h * 0.38, h * 0.36, '#3d7bff', 0.35)}
          <rect x={w * 0.15} y={h * 0.15} width={w * 0.2} height={h * 0.6} fill="#151925" />
          <rect x={w * 0.62} y={h * 0.08} width={w * 0.26} height={h * 0.68} fill="#121622" />
          <rect x={0} y={h * 0.74} width={w} height={h * 0.26} fill="#262b38" />
          <path d={`M0 ${h * 0.66} L${w} ${h * 0.52}`} stroke="#e8c33a" strokeWidth={h * 0.05} />
          <path d={`M0 ${h * 0.84} L${w} ${h * 0.74}`} stroke="#e8c33a" strokeWidth={h * 0.04} />
          <circle cx={w * 0.5} cy={h * 0.3} r={h * 0.05} fill="#fff1c9" opacity={0.8} />
        </g>
      );
    case 'mics':
      return (
        <g>
          {g('#b6b0a8', '#8a847d')}
          <rect x={w * 0.1} y={h * 0.06} width={w * 0.8} height={h * 0.6} fill="#c9c3ba" opacity={0.6} />
          <ellipse cx={w * 0.5} cy={h * 0.36} rx={h * 0.13} ry={h * 0.16} fill="#2e2c2d" />
          <path d={`M${w * 0.26} ${h} Q${w * 0.28} ${h * 0.56} ${w * 0.5} ${h * 0.52} Q${w * 0.72} ${h * 0.56} ${w * 0.74} ${h} Z`} fill="#25262c" />
          <path d={`M${w * 0.46} ${h * 0.53} L${w * 0.5} ${h * 0.74} L${w * 0.54} ${h * 0.53} Z`} fill="#eeeae4" />
          <path d={`M${w * 0.49} ${h * 0.58} L${w * 0.5} ${h * 0.72} L${w * 0.51} ${h * 0.58} Z`} fill="#8e2a2a" />
          {[0.36, 0.45, 0.55, 0.64].map((x, i) => (
            <g key={i}><path d={`M${w * x} ${h} L${w * (0.5 + (x - 0.5) * 0.4)} ${h * 0.72}`} stroke="#151517" strokeWidth={h * 0.025} /><ellipse cx={w * (0.5 + (x - 0.5) * 0.4)} cy={h * 0.7} rx={h * 0.035} ry={h * 0.05} fill={['#1a1a1d', '#c8322a', '#1a1a1d', '#3a5fa0'][i]} /></g>
          ))}
        </g>
      );
    case 'fire':
      return (
        <g>
          {g('#3b2230', '#e07a3a')}
          {[[0.3, 0.3, 0.2], [0.5, 0.2, 0.24], [0.7, 0.28, 0.2]].map(([x, y, r], i) => puff(w * x, h * y, h * r, '#4a3036', 0.9))}
          <path d={`M0 ${h * 0.7} Q${w * 0.25} ${h * 0.5} ${w * 0.5} ${h * 0.62} Q${w * 0.75} ${h * 0.48} ${w} ${h * 0.64} L${w} ${h} L0 ${h} Z`} fill="#1e1416" />
          {Array.from({ length: 9 }, (_, i) => { const x = w * (0.04 + i * 0.115), y = h * (0.6 - Math.sin(i * 0.9) * 0.06); return <path key={i} d={`M${x - w * 0.04} ${y + h * 0.06} Q${x} ${y - h * 0.18} ${x + w * 0.04} ${y + h * 0.06} Z`} fill={i % 2 ? '#ffb347' : '#ff7a2f'} />; })}
          {[0.1, 0.3, 0.58, 0.86].map((x, i) => <path key={i} d={`M${w * x} ${h} L${w * x} ${h * 0.72} M${w * x - 10} ${h * 0.78} L${w * x} ${h * 0.74} L${w * x + 12} ${h * 0.8}`} stroke="#120c0d" strokeWidth={5} />)}
        </g>
      );
    case 'drought':
      return (
        <g>
          {g('#efe0bd', '#d9b77a')}
          {puff(w * 0.75, h * 0.25, h * 0.14, '#fff6dc', 0.9)}
          <rect x={0} y={h * 0.55} width={w} height={h * 0.45} fill="#c79a5c" />
          <path d={`M${w * 0.1} ${h * 0.7} L${w * 0.3} ${h * 0.8} L${w * 0.25} ${h} M${w * 0.3} ${h * 0.8} L${w * 0.55} ${h * 0.72} L${w * 0.7} ${h * 0.9} M${w * 0.55} ${h * 0.72} L${w * 0.62} ${h * 0.6} M${w * 0.7} ${h * 0.9} L${w * 0.95} ${h * 0.78}`} stroke="#8a6436" strokeWidth={3} fill="none" />
          <path d={`M${w * 0.24} ${h * 0.6} L${w * 0.25} ${h * 0.3} M${w * 0.25} ${h * 0.4} L${w * 0.16} ${h * 0.28} M${w * 0.25} ${h * 0.36} L${w * 0.33} ${h * 0.22} M${w * 0.18} ${h * 0.31} L${w * 0.14} ${h * 0.33}`} stroke="#4a3626" strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      );
    case 'flood':
      return (
        <g>
          {g('#a7b3bb', '#8a7a5c')}
          {[0.12, 0.38, 0.66].map((x, i) => (
            <g key={i}><rect x={w * x} y={h * (0.36 + i * 0.04)} width={w * 0.2} height={h * 0.3} fill="#e4ddcd" /><path d={`M${w * (x - 0.03)} ${h * (0.38 + i * 0.04)} L${w * (x + 0.1)} ${h * (0.2 + i * 0.04)} L${w * (x + 0.23)} ${h * (0.38 + i * 0.04)} Z`} fill="#8a4a36" /></g>
          ))}
          <rect x={0} y={h * 0.55} width={w} height={h * 0.45} fill="#7a6648" />
          {[0.62, 0.72, 0.84].map((y, i) => <path key={i} d={`M0 ${h * y} Q${w * 0.25} ${h * (y - 0.04)} ${w * 0.5} ${h * y} T${w} ${h * y}`} stroke="#a89470" strokeWidth={4} fill="none" />)}
        </g>
      );
    default: // crowd running from smoke
      return (
        <g>
          {g('#9a9592', '#d2c6b4')}
          {[[0.2, 0.25, 0.22], [0.42, 0.18, 0.26], [0.7, 0.24, 0.22]].map(([x, y, r], i) => puff(w * x, h * y, h * r, '#5a5658', 0.85))}
          <rect x={0} y={h * 0.78} width={w} height={h * 0.22} fill="#6e6862" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = w * (0.1 + i * 0.13), y = h * (0.82 + (i % 2) * 0.04), s = h * (0.32 + (i % 3) * 0.04);
            return <g key={i} fill="#2a2829"><ellipse cx={x} cy={y - s} rx={s * 0.09} ry={s * 0.11} /><path d={`M${x - s * 0.14} ${y - s * 0.86} L${x + s * 0.12} ${y - s * 0.86} L${x + s * 0.08} ${y - s * 0.4} L${x + s * 0.22} ${y} L${x + s * 0.1} ${y} L${x} ${y - s * 0.32} L${x - s * 0.16} ${y} L${x - s * 0.26} ${y} L${x - s * 0.1} ${y - s * 0.42} Z`} /></g>;
          })}
        </g>
      );
  }
};

/** card geometry (screen units) */
export const NC = { pad: 14, thumbH: 184, tagY: 212, tagH: 32, fs: 28, lh: 33, headY: 284, timeY: 396 };

/**
 * One news card at local (0,0), CARD_W x CARD_H: thumbnail, tag, headline (bold, wrapped), timestamp.
 * Lx/Ly = motion smear in px; the text fades into smeared bars as speed rises.
 */
export const NewsCard: React.FC<{ id: string; c: NewsSpec; ui: UI; Lx?: number; Ly?: number }> = ({ id, c, ui, Lx = 0, Ly = 0 }) => {
  const axis = Lx > Ly ? 'x' : 'y', L = Math.max(Lx, Ly);
  const k = clamp01(L / 70), kt = clamp01((L - 6) / 30);
  const { pad, thumbH, tagY, tagH, fs, lh, headY, timeY } = NC;
  const tw = CARD_W - 2 * pad;
  const lines = wrap(c.head, fs, tw - 4).slice(0, 3);
  const tagW = c.tag ? 28 + c.tag.length * 12.4 : 0;
  const hy = c.tag ? headY : headY - 26;
  return (
    <g>
      <SRect id={`${id}bg`} x={0} y={0} w={CARD_W} h={CARD_H} rx={24} fill={ui.card} L={L} axis={axis} />
      <SRect id={`${id}pa`} x={pad} y={pad} w={tw} h={thumbH} rx={14} fill={THUMB_AVG[c.thumb]} L={L} axis={axis} op={k} />
      <g opacity={1 - k}>
        <defs><clipPath id={`${id}pc`}><rect x={pad} y={pad} width={tw} height={thumbH} rx={14} /></clipPath></defs>
        <g clipPath={`url(#${id}pc)`}><g transform={`translate(${pad} ${pad})`}><ThumbArt kind={c.thumb} w={tw} h={thumbH} id={`${id}t`} /></g></g>
      </g>
      {c.tag && (
        <g>
          <SRect id={`${id}tg`} x={pad} y={tagY} w={tagW} h={tagH} rx={7} fill={TAG_C[c.tag]} L={L} axis={axis} />
          <text x={pad + tagW / 2} y={tagY + 22} textAnchor="middle" fontFamily={UI_FONT} fontWeight={800} fontSize={17} letterSpacing="0.06em" fill="#fff" opacity={1 - kt}>{c.tag}</text>
        </g>
      )}
      <g opacity={1 - kt}>
        {lines.map((l, i) => <text key={i} x={pad} y={hy + i * lh} fontFamily={UI_FONT} fontWeight={800} fontSize={fs} fill="#1d1f24">{l}</text>)}
        <text x={pad} y={timeY} fontFamily={UI_FONT} fontWeight={600} fontSize={18} fill="#8a8e96">{c.time}</text>
      </g>
      {kt > 0 && lines.map((l, i) => {
        const lw = Math.min(tw, [...l].reduce((a, ch) => a + adv(ch) * fs, 0));
        return <SRect key={i} id={`${id}l${i}`} x={pad} y={hy + i * lh - fs * 0.72} w={lw} h={fs * 0.8} rx={6} fill="#2b2d33" op={0.55 * kt} L={L} axis={axis} />;
      })}
    </g>
  );
};

/** status bar + generic header (no logo, no copy). Drawn over the scrolling cards. */
export const Chrome: React.FC<{ ui: UI }> = ({ ui }) => (
  <g>
    <rect x={0} y={0} width={SW} height={FEED_TOP - 12} fill={ui.bg} />
    <rect x={44} y={22} width={58} height={14} rx={7} fill={ui.chrome} opacity={0.7} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={SW - 132 + i * 11} y={34 - i * 4} width={7} height={6 + i * 4} rx={2} fill={ui.chrome} opacity={0.75} />)}
    <rect x={SW - 76} y={20} width={36} height={18} rx={5} fill="none" stroke={ui.chrome} strokeWidth={2.5} opacity={0.6} />
    <rect x={SW - 73} y={23} width={24} height={12} rx={3} fill={ui.chrome} opacity={0.75} />
    <rect x={28} y={70} width={168} height={26} rx={13} fill={ui.chrome} opacity={0.8} />
    <circle cx={SW - 48} cy={83} r={17} fill={ui.chrome} opacity={0.25} />
    <circle cx={SW - 96} cy={83} r={13} fill="none" stroke={ui.chrome} strokeWidth={3} opacity={0.45} />
    <rect x={0} y={FEED_TOP - 14} width={SW} height={2} fill={ui.chrome} opacity={0.1} />
  </g>
);

/**
 * Scrolling feed (screen coords). s = scroll position in cards (card i is at the top when s = i).
 * L = vertical smear in px. fling(i) moves single cards sideways (swipe-away) with their own smear.
 */
export const Feed: React.FC<{ id: string; ui: UI; cards: NewsSpec[]; s: number; L: number; fling?: (i: number) => { dx: number; rot: number; Lx: number }; chrome?: boolean }> = ({ id, ui, cards, s, L, fling, chrome = true }) => {
  const n = cards.length, pad = 1 + Math.ceil(L / 2 / CH), i0 = Math.floor(s) - pad, i1 = Math.floor(s) + Math.ceil(SH / CH) + pad;
  const out: React.ReactNode[] = [];
  for (let i = i0; i <= i1; i++) {
    const y = FEED_TOP + (i - s) * CH;
    if (y > SH + L / 2 || y + CARD_H < -L / 2) continue;
    const f = fling ? fling(i) : { dx: 0, rot: 0, Lx: 0 };
    if (Math.abs(f.dx) > SW * 1.4) continue;
    out.push(
      <g key={i} transform={`translate(${16 + f.dx} ${y}) rotate(${f.rot} ${CARD_W / 2} ${CARD_H / 2})`}>
        <NewsCard id={`${id}c${i}`} c={cards[((i % n) + n) % n]} ui={ui} Ly={L} Lx={f.Lx} />
      </g>,
    );
  }
  return (
    <g>
      <rect x={0} y={0} width={SW} height={SH} fill={ui.bg} />
      {out}
      {chrome && <Chrome ui={ui} />}
    </g>
  );
};

/* ---------------- phone body ---------------- */
/** Phone face (body centred on 0,0). Screen content as children in screen coords (0..SW, 0..SH). */
export const Phone: React.FC<{ id: string; rim?: string; rimOp?: number; on?: number; glare?: number; edge?: string; children?: React.ReactNode }> = ({ id, rim = '#fff4dc', rimOp = 0.7, on = 1, glare = 1, edge = '#4d525c', children }) => (
  <g>
    <defs>
      <clipPath id={`${id}sc`}><rect x={0} y={0} width={SW} height={SH} rx={SR} /></clipPath>
      <linearGradient id={`${id}gl`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity={0.16} />
        <stop offset="0.35" stopColor="#ffffff" stopOpacity={0.04} />
        <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
    </defs>
    {/* side buttons */}
    <rect x={PW / 2 - 4} y={-330} width={9} height={120} rx={4} fill="#2a2d34" />
    <rect x={-PW / 2 - 5} y={-380} width={9} height={80} rx={4} fill="#2a2d34" />
    <rect x={-PW / 2 - 5} y={-270} width={9} height={80} rx={4} fill="#2a2d34" />
    {/* body + metal edge */}
    <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} rx={PR} fill="#121419" />
    <rect x={-PW / 2 + 3} y={-PH / 2 + 3} width={PW - 6} height={PH - 6} rx={PR - 3} fill="none" stroke={edge} strokeWidth={4} />
    <g transform={`translate(${-SW / 2} ${-SH / 2})`}>
      <rect x={0} y={0} width={SW} height={SH} rx={SR} fill="#050608" />
      <g clipPath={`url(#${id}sc)`}>
        <g opacity={on}>{children}</g>
        <path d={`M0 0 L${SW * 0.62} 0 L0 ${SH * 0.5} Z`} fill={`url(#${id}gl)`} opacity={glare} />
      </g>
    </g>
    {/* rim light along top-left edge */}
    <path d={`M${-PW / 2 + 1} ${PH * 0.3} L${-PW / 2 + 1} ${-PH / 2 + PR} Q${-PW / 2 + 1} ${-PH / 2 + 1} ${-PW / 2 + PR} ${-PH / 2 + 1} L${PW * 0.25} ${-PH / 2 + 1}`} fill="none" stroke={rim} strokeWidth={4} opacity={rimOp} strokeLinecap="round" />
  </g>
);

/* ---------------- night notification (generic, no app identity) ---------------- */
export const NOTIF_H = 196;
/** Notification card in screen coords, top at y. a = opacity. */
export const Notif: React.FC<{ y: number; a?: number; w1?: number; w2?: number }> = ({ y, a = 1, w1 = 0.82, w2 = 0.55 }) => {
  const x = 16, w = SW - 32;
  return (
    <g opacity={a} transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={NOTIF_H} rx={28} fill="#252932" />
      <rect x={0} y={0} width={w} height={NOTIF_H} rx={28} fill="none" stroke="#3a3f4b" strokeWidth={2} />
      {/* neutral icon: grey disc with a plain speech bubble */}
      <circle cx={42} cy={44} r={22} fill="#3d4250" />
      <path d="M31 36 Q31 30 37 30 L48 30 Q54 30 54 36 L54 44 Q54 50 48 50 L40 50 L34 56 L35 50 Q31 49 31 44 Z" fill="#c9ccd4" />
      <rect x={76} y={36} width={120} height={15} rx={7} fill="#c9ccd4" opacity={0.5} />
      <text x={w - 22} y={50} textAnchor="end" fontFamily={UI_FONT} fontWeight={600} fontSize={20} fill="#8b909c">now</text>
      <text x={24} y={112} fontFamily={UI_FONT} fontWeight={800} fontSize={33} fill="#eef0f4">Forwarded many times</text>
      <rect x={24} y={136} width={(w - 48) * w1} height={15} rx={7} fill="#c9ccd4" opacity={0.5} />
      <rect x={24} y={162} width={(w - 48) * w2} height={15} rx={7} fill="#c9ccd4" opacity={0.35} />
    </g>
  );
};
