import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Person, PersonSpec, EAR, MOUTH, facePt } from '../art/whisper_people';
import { CELL_W } from '../sets/whisper';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };

/** Show cell 0 or 1 of a 2-cell whisper band in the normal world position (zoom origin stays at the frame point cam.ox/oy). */
const cellCam = (cam: Cam, i: 0 | 1): Cam => {
  const T = (2 * CELL_W - 1080) / 2 - 108 - i * CELL_W; // 648 - i*1296
  return { ...cam, tx: (cam.tx ?? 0) + T, ox: (cam.ox ?? 540) - T };
};
/** whispering mouth on twos: a soft open/close flutter */
const flutter = (t2: number, on = 1) => on * (0.5 + 0.5 * Math.sin(t2 * 26)) * (0.6 + 0.4 * Math.sin(t2 * 7.3));

/* ---------------- cast (new characters, EP02 only) ---------------- */
const SK = { a: { skin: '#b07a5e', shade: '#7a4f3e' }, b: { skin: '#9c6b52', shade: '#68412f' }, c: { skin: '#c48d6e', shade: '#8a5a44' }, d: { skin: '#8a5a44', shade: '#5a3628' } };
const CAST: Record<string, PersonSpec> = {
  whisperer: { ...SK.c, hair: 'scarf', hairC: '#7a3e5a', pattern: '#e0b26a', hairC2: '#f2d7a0', shirt: '#6a3a4e', shirtD: '#4a2636' },
  stallOwner: { ...SK.a, hair: 'scarf', hairC: '#3f5f6a', hairC2: '#cfe0e4', shirt: '#7a6a58', shirtD: '#5a4c3e' },
  angkotMan: { ...SK.b, hair: 'short', hairC: '#17120f', shirt: '#7a5a2e', shirtD: '#5a3f1c', shirtPat: '#d9b06a' },
  angkotWoman: { ...SK.a, hair: 'scarf', hairC: '#8a4f62', hairC2: '#f0c6cf', shirt: '#d9d2c4', shirtD: '#a89f8e' },
  rondaA: { ...SK.d, hair: 'short', hairC: '#121010', shirt: '#3a5f8a', shirtD: '#24405e' },
  rondaB: { ...SK.a, hair: 'short', hairC: '#1d1714', shirt: '#e6e1d6', shirtD: '#b8b1a2', towel: '#c9b27a' },
  rondaC: { ...SK.b, hair: 'bald', hairC: '#2a2420', shirt: '#4a3f38', shirtD: '#2e2722', mustache: true },
  mumA: { ...SK.c, hair: 'scarf', hairC: '#c46a5a', pattern: '#f2d7a0', shirt: '#e8d8c0', shirtD: '#b8a68c' },
  mumB: { ...SK.a, hair: 'scarf', hairC: '#4d6a8a', hairC2: '#d8e4f0', shirt: '#5a6a4a', shirtD: '#3c4a30' },
  seller: { ...SK.b, hair: 'scarf', hairC: '#6a8a4a', hairC2: '#e0ecc8', shirt: '#a0583a', shirtD: '#743e28' },
  buyer: { ...SK.d, hair: 'short', hairC: '#151110', shirt: '#8a6a4a', shirtD: '#5e4630' },
  barber: { ...SK.a, hair: 'short', hairC: '#0f0d0c', shirt: '#f0eee8', shirtD: '#c4c0b6' },
  client: { ...SK.c, hair: 'bald', hairC: '#3a302a', shirt: '#e8e6de', shirtD: '#c9c6bc', cape: true },
  girl: { ...SK.c, hair: 'long', hairC: '#1a1412', shirt: '#c9a24a', shirtD: '#94742c' },
  commuter: { ...SK.b, hair: 'short', hairC: '#1a1512', shirt: '#3a5f8a', shirtD: '#24405e' },
  coffeeA: { ...SK.d, hair: 'short', hairC: '#1a1512', shirt: '#6a2e2e', shirtD: '#4a1e1e', mustache: true },
  coffeeB: { ...SK.a, hair: 'short', hairC: '#8a8580', shirt: '#4a5a6a', shirtD: '#30404e' },
};

/**
 * A whisper pair: the listener's EAR sits at frame point (ex, ey); the whisperer leans in from behind with the mouth just short of it.
 * dir = 1: both face right (whisperer on the left); dir = -1: mirrored.
 */
const Pair: React.FC<{
  id: string; ex: number; ey: number; s: number; dir?: 1 | -1;
  wh: PersonSpec; li: PersonSpec; talk: number; lean: number; wide: number; cup: number;
  liLean?: number; bob?: number; rim?: string; rimOp?: number; ws?: number;
}> = ({ id, ex, ey, s, dir = 1, wh, li, talk, lean, wide, cup, liLean = 0, bob = 0, rim, rimOp, ws }) => {
  const sw = ws ?? s;
  const ear = facePt(0, 0, s, EAR, liLean, dir);
  const L = { x: ex - ear.x, y: ey - ear.y + bob };
  const target = { x: ex - dir * 46 * s, y: ey + 10 * s };
  const m = facePt(0, 0, sw, MOUTH, lean, dir);
  const Wp = { x: target.x - m.x, y: target.y - m.y };
  return (
    <g>
      <g transform={`translate(${L.x} ${L.y}) scale(${dir * s} ${s})`}><Person id={`${id}l`} p={li} wide={wide} lean={liLean} rim={rim} rimOp={rimOp} /></g>
      <g transform={`translate(${Wp.x} ${Wp.y}) scale(${dir * sw} ${sw})`}><Person id={`${id}w`} p={wh} talk={talk} lean={lean} cup={cup} rim={rim} rimOp={rimOp} /></g>
    </g>
  );
};

/* ============ shot 4 (dawn): ECU, lips at the stall owner's ear; her eye widens on "poisoned" ============ */
export const S04: React.FC = () => {
  const { t, t2, p } = useShot();
  const tp = wordAt(4, /^poisoned/i, 0.47);
  const wide = ramp(t2, tp, tp + 0.12, EOUT);
  const blink = bump(t2, tp - 0.25, 0.12); // a blink just before the word, then the eye snaps open
  const talk = flutter(t2, t2 < tp + 0.45 ? 1 : 0.2);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1 + 0.03 * EIO(p) + 0.04 * ramp(t, tp, tp + 0.3, EOUT), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 860, oy: 780 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a1f19' }}>
      <BandImg id="whisper/shop-warung" k={0.6} cam={cellCam(cam, 0)} />
      <Live k={1} cam={cam}>
        <Fr>
          <Pair id="p4" ex={500} ey={860} s={4.3} wh={CAST.whisperer} li={CAST.stallOwner} talk={talk} lean={6 + 2 * Math.sin(t2 * 2)} wide={wide * (1 - blink)}
            cup={0} liLean={-2 * wide} bob={2 * Math.sin(t2 * 2.4)} rim="#ffd08a" rimOp={0.7} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 6 (day): angkot, a man leans to a woman's ear; sway and window strobe on ones ============ */
export const S06: React.FC = () => {
  const { t, t2, p } = useShot();
  const saw = wordAt(6, /^saw/i, 0.63);
  const sway = Math.sin(t * 4.2) * 0.8 + Math.sin(t * 9.1) * 0.25; // vehicle on ones
  const body = Math.sin(t2 * 4.2 - 0.6) * 6; // passengers follow the sway a beat late, on twos
  const cam: Cam = { zoom: 1.04 + 0.03 * p, dx: 0, dy: 0, tx: sway * 4, ty: Math.abs(Math.sin(t * 6.3)) * -5, rot: sway * 0.5, ox: 540, oy: 900 };
  const strobe = [0, 1, 2].map((k) => ((t * 1500 + k * 820) % 2600) - 800);
  return (
    <AbsoluteFill style={{ backgroundColor: '#5c4f45' }}>
      <BandImg id="whisper/angkot-bus" k={0.8} cam={cellCam(cam, 0)} />
      <Live k={1} cam={cam}>
        <Fr>
          <g transform={`translate(${body} 0)`}>
            <Pair id="p6" ex={600} ey={760} s={1.45} wh={CAST.angkotMan} li={CAST.angkotWoman} talk={flutter(t2)} lean={9 + 2 * Math.sin(t2 * 3)} wide={0.7 * ramp(t2, saw, saw + 0.15, EOUT)}
              cup={ramp(t2, 0, 0.25, EOUT)} liLean={-3} bob={3 * Math.sin(t2 * 4.2)} />
          </g>
          {/* window light strobing across them (poles and trees passing), on ones */}
          {strobe.map((x, k) => <path key={k} d={`M${x} -100 L${x + 160} -100 L${x - 140} 2000 L${x - 300} 2000 Z`} fill="#2a2018" opacity={0.16} />)}
          <rect x={-200} y={-200} width={1500} height={2400} fill="#fff6dc" opacity={0.05 + 0.05 * Math.sin(t * 13)} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 7 (day): three men huddled at the pos ronda; one cups a hand and whispers ============ */
export const S07: React.FC = () => {
  const { t, t2, p } = useShot();
  const knew = wordAt(7, /^knew/i, 0.73);
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.02 + 0.05 * EIO(p), dx: 0, dy: 0, tx: h.hx - 20 * p, ty: h.hy, ox: 560, oy: 820 };
  const s = 1.2;
  const nod = 3 * Math.sin(t2 * 5); // the third man nods along, on twos
  return (
    <AbsoluteFill style={{ backgroundColor: '#e2d8c4' }}>
      <BandImg id="whisper/ronda-gate" k={0.7} cam={cellCam(cam, 0)} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* third man behind, facing left, leaning in to listen */}
          <g transform={`translate(${930} ${870 + 2 * Math.sin(t2 * 2.2)}) scale(${-s * 0.94} ${s * 0.94})`}>
            <Person id="p7c" p={CAST.rondaC} lean={12 + nod} wide={0.4 + 0.5 * ramp(t2, knew, knew + 0.15, EOUT)} rimOp={0.5} />
          </g>
          <Pair id="p7" ex={500} ey={790} s={s} wh={CAST.rondaA} li={CAST.rondaB} talk={flutter(t2)} lean={10 + 2 * Math.sin(t2 * 2.6)} wide={0.2 + 0.6 * ramp(t2, knew, knew + 0.15, EOUT)}
            cup={ramp(t2, 0, 0.2, EOUT)} liLean={4 + 3 * Math.sin(t2 * 1.8)} bob={2 * Math.sin(t2 * 2)} rimOp={0.5} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 11 (day): the relay, five passes with hard cuts, each shorter than the last ============ */
type Pass = { band: string; cell: 0 | 1; wh: PersonSpec; li: PersonSpec; dir: 1 | -1; ex: number; ey: number; s: number };
const PASSES: Pass[] = [
  { band: 'whisper/ronda-gate', cell: 1, wh: CAST.mumA, li: CAST.mumB, dir: 1, ex: 560, ey: 800, s: 1.6 },
  { band: 'whisper/market-barber', cell: 0, wh: CAST.seller, li: CAST.buyer, dir: -1, ex: 520, ey: 780, s: 1.75 },
  { band: 'whisper/market-barber', cell: 1, wh: CAST.barber, li: CAST.client, dir: 1, ex: 560, ey: 760, s: 1.9 },
  { band: 'whisper/angkot-bus', cell: 1, wh: CAST.girl, li: CAST.commuter, dir: -1, ex: 520, ey: 770, s: 2.05 },
  { band: 'whisper/shop-warung', cell: 1, wh: CAST.coffeeA, li: CAST.coffeeB, dir: 1, ex: 560, ey: 760, s: 2.25 },
];
const PASS_LEN = [0.27, 0.23, 0.2, 0.16, 0.14];

export const S11: React.FC = () => {
  const { t, t2, sec } = useShot();
  let a = 0, i = 0;
  for (; i < PASSES.length - 1; i++) { if (t < a + PASS_LEN[i] * sec) break; a += PASS_LEN[i] * sec; }
  const d = PASS_LEN[i] * sec, u = clamp01((t - a) / d), u2 = clamp01((t2 - a) / d);
  const P = PASSES[i];
  const h = handheld(t * 1.4, 0.25);
  const cam: Cam = { zoom: 1.02 + 0.06 * u, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: P.ex, oy: P.ey }; // each pass pushes in (ones)
  return (
    <AbsoluteFill style={{ backgroundColor: '#d8cdb8' }}>
      <BandImg id={P.band} k={0.7} cam={cellCam(cam, P.cell)} />
      <Live k={1} cam={cam}>
        <Fr>
          <Pair id={`p11${i}`} ex={P.ex} ey={P.ey} s={P.s} dir={P.dir} wh={P.wh} li={P.li} talk={flutter(t2 * 1.3)} lean={4 + 10 * ramp(u2, 0, 0.35, EOUT)}
            wide={ramp(u2, 0.5, 0.8, EOUT)} cup={i % 2 === 0 ? ramp(u2, 0, 0.3, EOUT) : 0} liLean={-2 * ramp(u2, 0.5, 0.8)} bob={2 * Math.sin(t2 * 3)} rimOp={0.5} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 25: title card on black (same design as EP01) ============ */
const MOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S25: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['FASTER', 0, 0.25], ['THAN', 0, 0.45], ['THE', 1, 0.66], ['TRUTH', 1, 0.86]];
  const sub = ramp(t, 1.1, 1.7, EOUT), rule = ramp(t, 0.95, 1.5, EOUT);
  const glow = ramp(t, 0.1, 1.4, EOUT);
  const z = 1 + 0.045 * EIO(p);
  const line = (k: number) => words.filter((w) => w[1] === k).map(([w, , a0], j) => {
    const v = ramp(t, a0, a0 + 0.6, EOUT);
    return <span key={j} style={{ display: 'inline-block', opacity: v, transform: `translateY(${(1 - v) * 26}px)`, marginRight: '0.32em' }}>{w}</span>;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p25g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d9a441" stopOpacity={0.22} /><stop offset="0.5" stopColor="#d9a441" stopOpacity={0.07} /><stop offset="1" stopColor="#d9a441" stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {MOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 88, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
            <div>{line(1)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 2 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
