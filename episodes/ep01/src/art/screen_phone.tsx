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

/* ---------------- news cards: blurred photo blocks + grey headline bars, generic words only ---------------- */
export type Photo = 'city' | 'quake' | 'night' | 'podium' | 'field' | 'sea' | 'crowd' | 'road';
export type CardSpec = { photo: Photo; tag?: string; tagC?: string; b1: number; b2: number; meta: number };

const PHOTO: Record<Photo, { top: string; bot: string; avg: string }> = {
  city: { top: '#a7b9c8', bot: '#d9d3c5', avg: '#c2c6c6' },
  quake: { top: '#cfae86', bot: '#7a624c', avg: '#a68867' },
  night: { top: '#1e2536', bot: '#0d1019', avg: '#181d2a' },
  podium: { top: '#9a948d', bot: '#5e5955', avg: '#7c7671' },
  field: { top: '#b4cddc', bot: '#6c8656', avg: '#8fa98f' },
  sea: { top: '#a8cadb', bot: '#3c6c84', avg: '#6f9bb0' },
  crowd: { top: '#c2bcb2', bot: '#6a6662', avg: '#97928b' },
  road: { top: '#c9cdcc', bot: '#5f5d5a', avg: '#959593' },
};

/** Soft photo content: gradients and a few low-contrast shapes (reads as an out-of-focus picture). */
const PhotoArt: React.FC<{ kind: Photo; w: number; h: number; id: string }> = ({ kind, w, h, id }) => {
  const soft = (cx: number, cy: number, rx: number, ry: number, c: string, o: number, k: string) => (
    <g key={k}>
      <defs><radialGradient id={`${id}${k}`}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}${k})`} />
    </g>
  );
  switch (kind) {
    case 'quake':
      return (
        <g>
          {soft(w * 0.3, h * 0.25, w * 0.6, h * 0.5, '#f3dfbf', 0.7, 'd')}
          <g transform={`rotate(9 ${w * 0.55} ${h})`} opacity={0.75}>
            <rect x={w * 0.42} y={h * 0.22} width={w * 0.24} height={h * 0.8} fill="#5b4737" />
            {[0, 1, 2, 3].map((r) => <rect key={r} x={w * 0.45} y={h * (0.3 + r * 0.14)} width={w * 0.18} height={h * 0.05} fill="#8a6f57" opacity={0.6} />)}
          </g>
          <rect x={w * 0.08} y={h * 0.45} width={w * 0.2} height={h * 0.6} fill="#6a5442" opacity={0.6} />
          <path d={`M0 ${h} Q${w * 0.25} ${h * 0.7} ${w * 0.5} ${h * 0.82} Q${w * 0.75} ${h * 0.66} ${w} ${h * 0.86} L${w} ${h} Z`} fill="#4a3a2e" opacity={0.8} />
          {soft(w * 0.6, h * 0.75, w * 0.45, h * 0.3, '#d9c09c', 0.45, 'e')}
        </g>
      );
    case 'night':
      return (
        <g>
          <rect x={0} y={h * 0.68} width={w} height={h * 0.32} fill="#232938" />
          {soft(w * 0.25, h * 0.45, w * 0.32, h * 0.42, '#e0473c', 0.75, 'r')}
          {soft(w * 0.72, h * 0.42, w * 0.34, h * 0.44, '#3d7bff', 0.7, 'b')}
          <rect x={w * 0.38} y={h * 0.5} width={w * 0.26} height={h * 0.2} rx={10} fill="#0b0d14" opacity={0.8} />
          <path d={`M0 ${h * 0.82} L${w} ${h * 0.62}`} stroke="#d9b545" strokeWidth={7} opacity={0.55} />
        </g>
      );
    case 'podium':
      return (
        <g>
          <rect x={w * 0.12} y={0} width={w * 0.76} height={h * 0.72} fill="#aaa49c" opacity={0.6} />
          <ellipse cx={w * 0.5} cy={h * 0.3} rx={w * 0.065} ry={h * 0.11} fill="#2e2c2d" />
          <path d={`M${w * 0.32} ${h} Q${w * 0.33} ${h * 0.5} ${w * 0.5} ${h * 0.45} Q${w * 0.67} ${h * 0.5} ${w * 0.68} ${h} Z`} fill="#26252a" />
          <path d={`M${w * 0.47} ${h * 0.46} L${w * 0.5} ${h * 0.62} L${w * 0.53} ${h * 0.46} Z`} fill="#d8d4ce" opacity={0.7} />
          <rect x={w * 0.34} y={h * 0.7} width={w * 0.32} height={h * 0.3} fill="#3c3631" />
          <path d={`M${w * 0.45} ${h * 0.7} L${w * 0.47} ${h * 0.55} M${w * 0.55} ${h * 0.7} L${w * 0.53} ${h * 0.55}`} stroke="#1c1b1e" strokeWidth={5} />
          {soft(w * 0.85, h * 0.2, w * 0.3, h * 0.3, '#ffffff', 0.35, 'f')}
        </g>
      );
    case 'field':
      return (
        <g>
          <rect x={0} y={h * 0.55} width={w} height={h * 0.45} fill="#5f7b4c" opacity={0.7} />
          {soft(w * 0.5, h * 0.2, w * 0.5, h * 0.3, '#ffffff', 0.4, 's')}
          {[0.2, 0.42, 0.66, 0.8].map((x, i) => <ellipse key={i} cx={w * x} cy={h * 0.62} rx={9} ry={20} fill="#2f3a2c" opacity={0.55} />)}
        </g>
      );
    case 'sea':
      return (
        <g>
          <rect x={0} y={h * 0.5} width={w} height={h * 0.5} fill="#335e74" opacity={0.6} />
          {soft(w * 0.7, h * 0.3, w * 0.4, h * 0.3, '#fff6dc', 0.55, 's')}
          <path d={`M0 ${h * 0.5} L${w} ${h * 0.48}`} stroke="#d8e6ea" strokeWidth={4} opacity={0.5} />
        </g>
      );
    case 'crowd':
      return (
        <g>
          {Array.from({ length: 22 }, (_, i) => {
            const x = ((i * 53) % 100) / 100 * w, y = h * (0.5 + ((i * 37) % 50) / 100);
            return <ellipse key={i} cx={x} cy={y} rx={12} ry={15} fill="#3a3734" opacity={0.55} />;
          })}
          {soft(w * 0.3, h * 0.2, w * 0.4, h * 0.25, '#ffffff', 0.35, 'g')}
        </g>
      );
    case 'road':
      return (
        <g>
          <path d={`M${w * 0.35} 0 L${w * 0.65} 0 L${w} ${h} L0 ${h} Z`} fill="#4d4b49" opacity={0.6} />
          {[0.3, 0.5, 0.7].map((y, i) => <ellipse key={i} cx={w * (0.4 + i * 0.1)} cy={h * y} rx={10 + i * 4} ry={7 + i * 3} fill="#222" opacity={0.5} />)}
        </g>
      );
    default: // city
      return (
        <g>
          {[0.05, 0.22, 0.4, 0.62, 0.8].map((x, i) => <rect key={i} x={w * x} y={h * (0.25 + (i % 2) * 0.15)} width={w * 0.14} height={h} fill="#7f8f9c" opacity={0.5} />)}
          <rect x={0} y={h * 0.78} width={w} height={h * 0.22} fill="#8d8a84" opacity={0.6} />
          {soft(w * 0.2, h * 0.1, w * 0.4, h * 0.25, '#ffffff', 0.4, 'h')}
        </g>
      );
  }
};

/** One feed card at local (0,0), CARD_W x CARD_H. Lx/Ly = motion smear in px (the larger axis wins). */
export const Card: React.FC<{ id: string; c: CardSpec; ui: UI; Lx?: number; Ly?: number }> = ({ id, c, ui, Lx = 0, Ly = 0 }) => {
  const axis = Lx > Ly ? 'x' : 'y', L = Math.max(Lx, Ly);
  const k = clamp01(L / 70), kt = clamp01(L / 26);
  const P = PHOTO[c.photo];
  const pw = CARD_W - 28, ph = 236;
  const tagW = c.tag ? 30 + c.tag.length * 12.5 : 0;
  return (
    <g>
      <SRect id={`${id}bg`} x={0} y={0} w={CARD_W} h={CARD_H} rx={26} fill={ui.card} L={L} axis={axis} />
      {/* photo: sharp block fades into its smeared average as speed rises */}
      <SRect id={`${id}pa`} x={14} y={14} w={pw} h={ph} rx={16} fill={P.avg} L={L} axis={axis} op={k} />
      <g opacity={1 - k}>
        <defs>
          <linearGradient id={`${id}pg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.top} /><stop offset="1" stopColor={P.bot} /></linearGradient>
          <clipPath id={`${id}pc`}><rect x={14} y={14} width={pw} height={ph} rx={16} /></clipPath>
        </defs>
        <rect x={14} y={14} width={pw} height={ph} rx={16} fill={`url(#${id}pg)`} />
        <g clipPath={`url(#${id}pc)`}><g transform="translate(14 14)"><PhotoArt kind={c.photo} w={pw} h={ph} id={`${id}pp`} /></g></g>
      </g>
      {c.tag && (
        <g>
          <SRect id={`${id}tg`} x={14} y={266} w={tagW} h={34} rx={8} fill={c.tagC ?? '#c4382e'} L={L} axis={axis} />
          <text x={14 + tagW / 2} y={289} textAnchor="middle" fontFamily={UI_FONT} fontWeight={800} fontSize={17} letterSpacing="0.08em" fill="#fff" opacity={1 - kt}>{c.tag}</text>
        </g>
      )}
      <SRect id={`${id}b1`} x={14} y={c.tag ? 314 : 272} w={pw * c.b1} h={22} rx={11} fill={ui.bar} op={ui.barOp} L={L} axis={axis} />
      <SRect id={`${id}b2`} x={14} y={c.tag ? 346 : 304} w={pw * c.b2} h={22} rx={11} fill={ui.bar} op={ui.barOp} L={L} axis={axis} />
      {!c.tag && <SRect id={`${id}b3`} x={14} y={336} w={pw * 0.5} h={22} rx={11} fill={ui.bar} op={ui.barOp} L={L} axis={axis} />}
      <SRect id={`${id}m`} x={14} y={386} w={pw * c.meta} h={13} rx={6} fill={ui.meta} L={L} axis={axis} />
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
export const Feed: React.FC<{ id: string; ui: UI; cards: CardSpec[]; s: number; L: number; fling?: (i: number) => { dx: number; rot: number; Lx: number }; chrome?: boolean }> = ({ id, ui, cards, s, L, fling, chrome = true }) => {
  const n = cards.length, pad = 1 + Math.ceil(L / 2 / CH), i0 = Math.floor(s) - pad, i1 = Math.floor(s) + Math.ceil(SH / CH) + pad;
  const out: React.ReactNode[] = [];
  for (let i = i0; i <= i1; i++) {
    const y = FEED_TOP + (i - s) * CH;
    if (y > SH + L / 2 || y + CARD_H < -L / 2) continue;
    const f = fling ? fling(i) : { dx: 0, rot: 0, Lx: 0 };
    if (Math.abs(f.dx) > SW * 1.4) continue;
    out.push(
      <g key={i} transform={`translate(${16 + f.dx} ${y}) rotate(${f.rot} ${CARD_W / 2} ${CARD_H / 2})`}>
        <Card id={`${id}c${i}`} c={cards[((i % n) + n) % n]} ui={ui} Ly={L} Lx={f.Lx} />
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
