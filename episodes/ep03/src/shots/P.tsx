import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadMarker } from '@remotion/google-fonts/PermanentMarker';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Person, PersonSpec, EAR, MOUTH, facePt } from '../art/walls_people';
import { CELL_W, WIN, VP } from '../sets/walls';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });
const { fontFamily: MARKER } = loadMarker('normal', { weights: ['400'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
/** Show cell 0 or 1 of a 2-cell band in the normal world position. */
const cellCam = (cam: Cam, i: 0 | 1): Cam => {
  const T = (2 * CELL_W - 1080) / 2 - 108 - i * CELL_W;
  return { ...cam, tx: (cam.tx ?? 0) + T, ox: (cam.ox ?? 540) - T };
};
const flutter = (t2: number, on = 1) => on * (0.5 + 0.5 * Math.sin(t2 * 26)) * (0.6 + 0.4 * Math.sin(t2 * 7.3));
const SKIN = { skin: '#b07a5e', shade: '#7a4f3e', lit: '#cf9779', deep: '#4f3026' };

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

/* ---------------- cast (new characters) ---------------- */
const CAST: Record<string, PersonSpec> = {
  stallA: { skin: '#9c6b52', shade: '#68412f', hair: 'short', hairC: '#141010', shirt: '#3e4a3a', shirtD: '#262e22' },
  stallB: { skin: '#b07a5e', shade: '#7a4f3e', hair: 'bald', hairC: '#2a2420', shirt: '#6a4a34', shirtD: '#4a3222', mustache: true, towel: '#b8a27a' },
};

/* ============ shot 3 (night): two men at a coffee stall, the lit city hall on the hill; they lean in on "whisper" ============ */
export const S03: React.FC = () => {
  const { t, t2, p } = useShot();
  const tw = wordAt(3, /^whisper/i, 0.7);
  const lean = ramp(t2, tw, tw + 0.16, EOUT); // the lean-in lands on the word
  const look = 1 - ramp(t2, tw - 0.3, tw, EIO); // before: both glance up at the hall
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.02 + 0.04 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 560, oy: 1000 };
  const steam = (x: number, k: number) => <path key={k} d={`M${x} 1200 C${x - 20 + 18 * Math.sin(t * 2 + k)} 1150 ${x + 24 + 14 * Math.sin(t * 2.6 + k)} 1100 ${x + 6 * Math.sin(t * 1.7 + k)} ${1040 - 20 * ((t * 0.6 + k * 0.3) % 1)}`} stroke="#f2e8d8" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.18} />;
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <BandImg id="walls/stall" k={0.6} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <Pair id="p3" ex={560} ey={1010} s={1.2} wh={CAST.stallA} li={CAST.stallB} talk={flutter(t2, t2 > tw ? 1 : 0)} lean={-8 * look + 12 * lean}
            wide={0.3 * lean} cup={lean} liLean={-10 * look + 2 * lean} bob={2 * Math.sin(t2 * 2)} rim="#ffd08a" rimOp={0.65} />
          {[180, 400, 780].map((x, k) => steam(x, k))}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 4 (night): a hand sprays "HE SOLD OUR WATER"; the last word completes on "water" ============ */
const L1 = { x: 200, y: 660, w: 660, text: 'HE SOLD' }, L2 = { x: 110, y: 930, w: 860, text: 'OUR WATER' };
const PAINT = '#ece4cc';
export const S04: React.FC = () => {
  const { t, t2, p } = useShot();
  const tw = wordAt(4, /^water/i, 0.72);
  // the reveal follows the hand (ON TWOS); "WATER" (the last 5/9 of line 2) finishes exactly at the start of "water"
  const u1 = ramp(t2, 0.02, 0.5 * tw, Easing.linear);
  const uOur = ramp(t2, 0.56 * tw, 0.68 * tw, Easing.linear);
  const uWat = ramp(t2, 0.68 * tw, tw, Easing.linear);
  const OUR_F = 0.42;
  const w1 = L1.w * u1, w2 = L2.w * (OUR_F * uOur + (1 - OUR_F) * uWat);
  const onLine2 = t2 >= 0.53 * tw;
  const wob = 22 * Math.sin(t2 * 31);
  const P = onLine2 ? { x: L2.x + w2, y: L2.y - 80 + wob } : { x: L1.x + w1, y: L1.y - 80 + wob };
  const spraying = (t2 < 0.5 * tw || (t2 > 0.56 * tw && t2 < tw)) ? 1 : 0;
  const drips = (L: typeof L1, ww: number, seed: number) => [0.12, 0.33, 0.55, 0.78, 0.93].map((f, i) => {
    const x = L.x + L.w * f + ((seed * 37 + i * 53) % 30), passed = ww >= L.w * f;
    const tx = passed ? 1 : 0;
    const len = tx * (40 + ((i * 29 + seed) % 60)) * clamp01((t - (seed ? 0.7 * tw : 0.3 * tw) - f * 0.4) / 1.2 + 0.1);
    return <path key={i} d={`M${x} ${L.y + 10} L${x} ${L.y + 10 + len}`} stroke={PAINT} strokeWidth={9} strokeLinecap="round" opacity={0.85} />;
  });
  const h = handheld(t, 0.18);
  const cam: Cam = { zoom: 1.03 + 0.04 * EIO(p), dx: 0, dy: 0, tx: h.hx - 30 * p, ty: h.hy, ox: 560, oy: 800 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c1a18' }}>
      <BandImg id="walls/wall-pair" k={0.9} cam={cellCam(cam, 0)} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <clipPath id="p4c1"><rect x={L1.x - 30} y={L1.y - 230} width={w1 + 30} height={300} /></clipPath>
            <clipPath id="p4c2"><rect x={L2.x - 30} y={L2.y - 230} width={w2 + 30} height={300} /></clipPath>
            <radialGradient id="p4mist" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={PAINT} stopOpacity={0.55} /><stop offset="1" stopColor={PAINT} stopOpacity={0} /></radialGradient>
          </defs>
          {[[L1, 'p4c1', w1, 0], [L2, 'p4c2', w2, 1]].map(([L, c, ww, sd]) => {
            const LL = L as typeof L1;
            return (
              <g key={c as string}>
                <g clipPath={`url(#${c})`}>
                  <text x={LL.x} y={LL.y} fontFamily={MARKER} fontSize={220} textLength={LL.w} lengthAdjust="spacingAndGlyphs" fill="none" stroke={PAINT} strokeWidth={16} opacity={0.22}>{LL.text}</text>
                  <text x={LL.x} y={LL.y} fontFamily={MARKER} fontSize={220} textLength={LL.w} lengthAdjust="spacingAndGlyphs" fill={PAINT}>{LL.text}</text>
                </g>
                {drips(LL, ww as number, sd as number)}
              </g>
            );
          })}
          <ellipse cx={P.x} cy={P.y + 60} rx={110} ry={110} fill="url(#p4mist)" opacity={spraying} />
          {/* spray can in a gloved-less hand, hoodie sleeve from the lower right (ON TWOS) */}
          <g transform={`translate(${P.x + 70} ${P.y + 40}) rotate(${-12 + 4 * Math.sin(t2 * 9)})`}>
            <path d="M120 300 C220 420 300 700 330 1200 L700 1200 C600 800 420 420 230 240 Z" fill="#23262e" />
            <path d="M120 300 C220 420 300 700 330 1200" stroke="#ffcf86" strokeWidth={4} fill="none" opacity={0.35} />
            <rect x={-10} y={30} width={110} height={300} rx={26} fill="#8a2a26" />
            <rect x={-10} y={30} width={22} height={300} rx={11} fill="#c45a50" opacity={0.6} />
            <path d="M-6 40 Q45 -6 96 40 Z" fill="#b8b8b8" />
            <rect x={36} y={-4} width={24} height={22} rx={4} fill="#d8d8d8" />
            {/* fingers wrapped round the can (mitten, two separations) + index on the nozzle */}
            <path d="M70 120 C130 110 170 150 176 210 C182 270 150 300 96 300 L70 300 Z" fill={SKIN.skin} />
            <path d="M96 180 C130 182 150 190 168 196 M96 240 C130 244 150 250 170 256" stroke={SKIN.deep} strokeWidth={4} fill="none" opacity={0.6} />
            <path d="M60 0 C80 -20 120 -10 130 30 C140 80 120 110 90 120 L70 120 C90 90 96 50 70 20 Z" fill={SKIN.skin} />
            <path d="M60 0 C80 -20 120 -10 130 30" stroke="#ffcf86" strokeWidth={3} fill="none" opacity={0.6} />
            <path d="M176 210 C180 160 150 120 110 116" stroke={SKIN.shade} strokeWidth={6} fill="none" opacity={0.6} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 5 (day): posters of a faceless mayor slap on one after another; a red X lands on "proof" ============ */
const POSTERS = [
  [140, 260, -4], [700, 300, 3], [430, 620, 0], [880, 760, -3], [60, 900, 5], [300, 1080, -2], [760, 1180, 4],
  [520, 160, 2], [-60, 520, -5], [1000, 380, 3], [180, 1380, -3], [880, 1460, 2],
] as const;
const Poster: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-170} y={-240} width={340} height={480} fill="#efe9dc" />
    <rect x={-170} y={-240} width={340} height={70} fill="#3a3a40" />
    <rect x={-150} y={-160} width={300} height={290} fill="#c9c3b6" />
    <path d="M-120 130 Q-110 30 0 10 Q110 30 120 130 Z" fill="#2e2e34" />
    <path d="M-26 14 L0 80 L26 14 Z" fill="#efe9dc" />
    <path d="M-8 20 L0 76 L8 20 Z" fill="#5a5a62" />
    <ellipse cx={0} cy={-52} rx={52} ry={64} fill="#4a4a52" />
    <rect x={-140} y={160} width={280} height={22} fill="#3a3a40" opacity={0.8} />
    <rect x={-100} y={196} width={200} height={14} fill="#8a8680" />
    <path d="M-170 -60 L170 40" stroke="#ffffff" strokeWidth={3} opacity={0.35} />
  </g>
);
export const S05: React.FC = () => {
  const { t, t2, p, sec } = useShot();
  const tp = wordAt(5, /^proof/i, 0.27);
  const times = POSTERS.map((_, i) => (i === 2 ? Math.max(0, tp - 0.3) : i < 2 ? i * 0.3 : tp + 0.18 + (i - 3) * ((sec - 0.5 - tp - 0.18) / (POSTERS.length - 4))));
  const slapAt = times.map((x) => x);
  const jolt = slapAt.reduce((a, x) => a + 6 * bump(t, x, 0.08), 0);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.02 + 0.05 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy + jolt, ox: 540, oy: 820 };
  const x1 = ramp(t, tp, tp + 0.1, Easing.linear), x2 = ramp(t, tp + 0.1, tp + 0.2, Easing.linear);
  const last = slapAt.reduce((a, x, i) => (t2 >= x ? i : a), -1);
  const order = POSTERS.map((_, i) => i).filter((i) => i !== 2).concat([2]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfc7b6' }}>
      <BandImg id="walls/wall-pair" k={0.9} cam={cellCam(cam, 1)} />
      <Live k={1} cam={cam}>
        <Fr>
          {order.map((i) => {
            const [x, y, r] = POSTERS[i];
            if (t2 < slapAt[i]) return null;
            const sc = 1 + 0.12 * (1 - ramp(t2, slapAt[i], slapAt[i] + 0.09, EOUT)); // slapped flat (on twos)
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x={-162} y={-226} width={340} height={480} fill="#2a2018" opacity={0.18} />
                <Poster s={sc * (i === 2 ? 1.15 : 1)} />
                {i === 2 && x1 > 0 && (
                  <g transform="scale(1.15)" stroke="#c4322b" strokeWidth={34} strokeLinecap="round" fill="none">
                    <path d="M-140 -200 L140 200" strokeDasharray="500" strokeDashoffset={500 * (1 - x1)} />
                    <path d="M140 -200 L-140 200" strokeDasharray="500" strokeDashoffset={500 * (1 - x2)} />
                  </g>
                )}
              </g>
            );
          })}
          {/* the slapping hand: a palm pressing the newest poster for a moment (ON TWOS) */}
          {last >= 0 && t2 - slapAt[last] < 0.17 && (() => {
            const [x, y] = POSTERS[last];
            return (
              <g transform={`translate(${x + 40} ${y + 60}) rotate(-20)`}>
                <path d="M-40 60 L40 60 L120 900 L-150 900 Z" fill="#3a4a5e" />
                <path d="M-70 60 C-80 -20 -60 -110 -30 -130 C-10 -150 30 -150 50 -120 C70 -90 80 -10 70 60 Z" fill={SKIN.skin} />
                <path d="M-30 -125 L-24 -40 M10 -140 L8 -50" stroke={SKIN.deep} strokeWidth={4} opacity={0.5} />
                <path d="M-70 40 C-110 10 -130 -40 -120 -60 C-100 -70 -80 -30 -66 -10" fill={SKIN.skin} />
              </g>
            );
          })()}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 11 (day): the empty mayor's office; papers lift out of the open window on "vanished" ============ */
const PAPERS = Array.from({ length: 11 }, (_, i) => ({ x: 160 + i * 80 + (i % 3) * 20, y: 1050 - (i % 4) * 10, r: (i * 23) % 30 - 15, sp: 0.8 + (i % 4) * 0.25 }));
export const S11: React.FC = () => {
  const { t, p } = useShot();
  const tv = wordAt(11, /^vanished/i, 0.42);
  const h = handheld(t, 0.12);
  const cam: Cam = { zoom: 1.03 + 0.05 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 600, oy: 800 };
  const gust = 0.4 + 0.6 * ramp(t, tv - 0.1, tv + 0.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#cbbfa8' }}>
      <BandImg id="walls/office" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          {/* curtain pushed by the wind (environment, on ones) */}
          <path d={`M${WIN.x + WIN.w - 40} ${WIN.y - 30} L${WIN.x + WIN.w + 60} ${WIN.y - 30} L${WIN.x + WIN.w + 60} ${WIN.y + WIN.h + 40} C${WIN.x + WIN.w - 60 - 120 * gust} ${WIN.y + WIN.h} ${WIN.x + WIN.w - 20 - 140 * gust + 20 * Math.sin(t * 7)} ${WIN.y + 400} ${WIN.x + WIN.w - 40} ${WIN.y - 30} Z`} fill="#e8dcc0" opacity={0.85} />
          {/* the chair, turned away toward the window */}
          <rect x={410} y={720} width={300} height={380} rx={70} fill="#241814" />
          <rect x={430} y={740} width={260} height={110} rx={50} fill="#33231c" />
          <path d="M420 760 Q560 700 700 760" stroke="#fff6dc" strokeWidth={5} fill="none" opacity={0.5} />
          {/* papers: a few flutter at frame 0, all lift and fly to the window on "vanished" */}
          {PAPERS.map((q, i) => {
            const u = ramp(t, tv + i * 0.03, tv + 0.9 + i * 0.03, Easing.out(Easing.quad)) * q.sp;
            const x = q.x + (WIN.x + 200 - q.x) * u + 40 * Math.sin(t * 9 + i) * u, y = q.y - 700 * u + 20 * Math.sin(t * 6 + i) * u;
            const flut = 6 * Math.sin(t * 14 + i) * (1 - u) * (i % 3 === 0 ? 1 : 0.2);
            return (
              <g key={i} transform={`translate(${x} ${y + flut}) rotate(${q.r + 220 * u * (i % 2 ? 1 : -1)}) scale(1 ${0.4 + 0.6 * Math.abs(Math.cos(t * 5 * u + i))})`}>
                <rect x={-60} y={-40} width={120} height={80} fill="#f6f2e8" />
                <rect x={-46} y={-26} width={80} height={6} fill="#8a8680" opacity={0.6} />
                <rect x={-46} y={-10} width={92} height={6} fill="#8a8680" opacity={0.5} />
              </g>
            );
          })}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 12 (night): one car's tail lights shrink down the empty road and vanish on "taken"; a door left open ============ */
export const S12: React.FC = () => {
  const { t, p } = useShot();
  const tk = wordAt(12, /^taken/i, 0.75);
  const k = 0.26 * (1 - ramp(t, 0, tk, Easing.in(Easing.quad))) + 0.012;
  const lit = t < tk ? 1 : 0; // gone exactly on the word
  const cx = VP.x + 18 * k, cy = VP.y + 900 * k;
  const h = handheld(t, 0.1);
  const cam: Cam = { zoom: 1 + 0.06 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: VP.x, oy: VP.y };
  const flick = Math.sin(t * 23) > 0.6 ? 0.4 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="walls/road" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <Fr>
          <defs>
            <radialGradient id="p12r" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff3a2a" stopOpacity={0.7} /><stop offset="1" stopColor="#ff3a2a" stopOpacity={0} /></radialGradient>
            <radialGradient id="p12d" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd8a0" stopOpacity={0.8} /><stop offset="1" stopColor="#ffd8a0" stopOpacity={0} /></radialGradient>
          </defs>
          {/* the car going away: faint body + two red lights */}
          {lit > 0 && (
            <g>
              <rect x={cx - 220 * k} y={cy - 150 * k} width={440 * k} height={150 * k} rx={30 * k} fill="#0a0b10" />
              <ellipse cx={cx} cy={cy} rx={500 * k + 20} ry={200 * k + 10} fill="url(#p12r)" />
              {[-1, 1].map((sd) => <rect key={sd} x={cx + sd * 170 * k - 30 * k} y={cy - 100 * k} width={60 * k + 1.5} height={26 * k + 1.5} rx={6 * k} fill="#ff4a3a" />)}
              <path d={`M${cx - 200 * k} ${cy + 4} L${cx + 200 * k} ${cy + 4} L${cx + 260 * k} ${cy + 260 * k} L${cx - 260 * k} ${cy + 260 * k} Z`} fill="#ff3a2a" opacity={0.08} />
            </g>
          )}
          {/* foreground: a parked car with its door left open, dome light on (one lamp flickers) */}
          <g transform="translate(-90 110)">
          <ellipse cx={120} cy={1240} rx={420} ry={300} fill="url(#p12d)" opacity={flick} />
          <path d="M-140 1080 L260 1060 C320 1060 360 1120 380 1200 L400 1560 L-140 1580 Z" fill="#0c0d12" />
          <path d="M-140 1110 L230 1094 C280 1094 310 1140 320 1200 L-140 1210 Z" fill="#2a2620" />
          <path d={`M300 1090 L${560 + 10 * Math.sin(t * 0.8)} 1150 L${600 + 10 * Math.sin(t * 0.8)} 1620 L360 1560 Z`} fill="#101117" />
          <path d={`M310 1100 L${540 + 10 * Math.sin(t * 0.8)} 1158 L${552 + 10 * Math.sin(t * 0.8)} 1330 L330 1300 Z`} fill="#1e2230" />
          <path d={`M300 1090 L${560 + 10 * Math.sin(t * 0.8)} 1150`} stroke="#ffd8a0" strokeWidth={4} opacity={0.6 * flick} />
          <circle cx={120} cy={1110} r={14} fill="#fff1c9" opacity={flick} />
          <ellipse cx={200} cy={1640} rx={500} ry={60} fill="#000" opacity={0.5} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};


const MOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S24: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['THE', 0, 0.25], ['MAN', 0, 0.42], ['FROM', 1, 0.62], ['NOWHERE', 1, 0.82]];
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
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 84, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
            <div>{line(1)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 3 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
