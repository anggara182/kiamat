import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { W, H, SUN, SHORE, HORIZON, C, rng } from '../art/world';
import { Surf, Twinkles, Gulls, Girl } from '../art/Live';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO, EOUT, clamp01, layerStyle } from '../comp/Camera';
import { R308, TELE_VB, WL, crowdPeople, phonePos, CROWD_W } from '../sets/beach';
import { wordAt } from '../data/ep';
import { TitleCard } from './Title';

/* =============== Set A: the beach =============== */

const BG: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = C.skyTop, children }) => (
  <AbsoluteFill style={{ backgroundColor: c, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

/** 1 — the approved style frame: wide, slow push-in with parallax. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1 + 0.06 * e, dx: -30 * e, dy: -20 * e };
  return (
    <BG>
      <BandImg id="beach/far" k={0.35} cam={cam} />
      <Live k={0.35} cam={cam}><Gulls t={t} /></Live>
      <BandImg id="beach/mid" k={0.65} cam={cam} />
      <Live k={0.65} cam={cam}><Twinkles t={t} /></Live>
      <BandImg id="beach/near" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Surf t={t} />
        <Girl x={SUN.x + 6} y={SHORE + 26} s={0.8} t={t} hairSway={Math.sin(t * 1.1)} hemSway={Math.sin(t * 1.4 + 0.6)} />
      </Live>
      <BandImg id="beach/fg" k={1.45} cam={cam} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,150,90,0.06), rgba(0,0,0,0) 40%)' }} />
    </BG>
  );
};

/** A swell rising mid-sea whose spray reads, faintly, as a crowned figure. Respectful: regal, veiled, half-seen. */
const CrownedWave: React.FC<{ x: number; y: number; rise: number; t: number }> = ({ x, y, rise, t }) => {
  const H0 = 170 * rise; // swell height
  const r = rng(33);
  // one contour: broad swell -> shoulders -> a veiled head of water
  const sh = H0 * 0.62, nk = H0 * 0.8, hd = H0 * 1.22;
  const contour = `M -520 40 C -380 40, -260 ${-sh * 0.7}, -150 ${-sh} C -100 ${-sh * 1.08}, -60 ${-nk}, -44 ${-nk - 4} C -46 ${-hd + 10}, -24 ${-hd}, 0 ${-hd} C 24 ${-hd}, 46 ${-hd + 10}, 44 ${-nk - 4} C 60 ${-nk}, 100 ${-sh * 1.08}, 150 ${-sh} C 260 ${-sh * 0.7}, 380 40, 520 40`;
  const crown = [[-30, 0.55], [-15, 0.8], [0, 1.1], [15, 0.8], [30, 0.55]];
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id="swell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a6494" />
          <stop offset="0.3" stopColor="#3e3768" />
          <stop offset="1" stopColor="#24264a" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="veil" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#ffe9c8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe9c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={`${contour} Z`} fill="url(#swell)" />
      {/* inner light through the thin water of the head and veil */}
      <ellipse cx={0} cy={-hd * 0.78} rx={70} ry={hd * 0.42 + 1} fill="url(#veil)" opacity={rise} />
      {/* translucent lit lip along the whole contour (sun behind) */}
      <path d={contour} stroke="#ffd2a0" strokeWidth={2 + rise * 3} fill="none" opacity={0.8 * rise} />
      <path d={contour} stroke="#fff4e0" strokeWidth={1.2} fill="none" opacity={0.6 * rise} transform="translate(0 -2)" />
      {/* veil lines running down into the sea */}
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M ${sd * 40} ${-nk} C ${sd * 80} ${-sh * 0.5}, ${sd * 120} 0, ${sd * 170} 34`} stroke="#ffe3c0" strokeWidth={1.5} fill="none" opacity={0.4 * rise} />
      ))}
      {/* spray crown on the head */}
      {crown.map(([px, ph], i) => {
        const h = 70 * ph * rise, bx = px, by = -hd + 6;
        return (
          <g key={i}>
            <path d={`M ${bx - 7} ${by} C ${bx - 5} ${by - h * 0.5}, ${bx - 2} ${by - h * 0.8}, ${bx} ${by - h} C ${bx + 2} ${by - h * 0.8}, ${bx + 5} ${by - h * 0.5}, ${bx + 7} ${by} Z`} fill="#ffe8c8" opacity={0.55 * rise} />
            <circle cx={bx} cy={by - h - 4} r={2 + ph * 1.5} fill="#fff4e0" opacity={0.85 * rise} />
          </g>
        );
      })}
      {/* droplets lifting off the crest */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = r() * 2 - 1, sp = 0.5 + r();
        const life = (t * 0.45 * sp + r()) % 1;
        const dx = a * 160 + Math.sin(t + i) * 5, dy = -sh * (1 - Math.abs(a) * 0.5) - 10 - life * 90 * rise;
        return <circle key={i} cx={dx} cy={dy} r={1 + r() * 2} fill="#ffeacc" opacity={(1 - life) * 0.75 * rise} />;
      })}
      <path d="M -520 38 C -200 26, 200 46, 520 34" stroke="#f6efe6" strokeWidth={2.5} fill="none" opacity={0.35 * rise} strokeDasharray="30 14" />
    </g>
  );
};

/** 3 — tilt down from the sky + slow push; title card; the sea answers with a crowned crest. */
export const S03: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(ramp(p, 0, 0.7));
  const cam: Cam = { zoom: 1.12 + 0.06 * p, dx: -14 * p, dy: 0, ty: 300 - 310 * e };
  const rise = ramp(p, 0.35, 0.85, EOUT);
  return (
    <BG>
      <BandImg id="beach/far" k={0.5} cam={cam} />
      <Live k={0.5} cam={cam}><Gulls t={t + 4} /></Live>
      <BandImg id="beach/mid" k={0.75} cam={cam} />
      <Live k={0.75} cam={cam}>
        <Twinkles t={t} />
        <CrownedWave x={600} y={1330} rise={rise} t={t} />
      </Live>
      <BandImg id="beach/near" k={1} cam={cam} />
      <Live k={1} cam={cam}><Surf t={t + 3} /></Live>
      <BandImg id="beach/fg" k={1.45} cam={cam} />
      <TitleCard p={p} />
    </BG>
  );
};

/** 5 — telephoto on the headland, slow push to the green window. A shape stands behind the curtain. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const s = W / TELE_VB.w; // world -> band px
  const wx = (R308.x - TELE_VB.x) * s - (W - 1080) / 2, wy = (R308.y - TELE_VB.y) * s - (H - 1920) / 2;
  const cam: Cam = { zoom: 1 + 0.5 * e, dx: 0, dy: 0, ox: wx, oy: wy, ...(() => { const h = handheld(t, 0.35); return { tx: h.hx, ty: h.hy }; })() };
  const vb = `${TELE_VB.x} ${TELE_VB.y} ${TELE_VB.w} ${TELE_VB.h}`;
  const glow = 0.75 + 0.25 * Math.sin(t * 2.3) * Math.sin(t * 0.9 + 1);
  const figure = ramp(p, 0.55, 0.8) * (1 - ramp(p, 0.92, 1));
  return (
    <BG c="#2c2454">
      <BandImg id="beach/tele-far" k={0.85} cam={cam} />
      <Live k={0.85} cam={cam} viewBox={vb}><Gulls t={t * 0.6 + 30} /></Live>
      <BandImg id="beach/tele-mid" k={1} cam={cam} />
      <Live k={1} cam={cam} viewBox={vb}>
        <defs>
          <radialGradient id="g308" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9dffc8" stopOpacity="0.8" />
            <stop offset="0.4" stopColor="#3dff95" stopOpacity="0.25" />
            <stop offset="1" stopColor="#3dff95" stopOpacity="0" />
          </radialGradient>
        </defs>
        <Twinkles t={t} />
        <circle cx={R308.x} cy={R308.y} r={46 * glow} fill="url(#g308)" />
        {/* a still silhouette behind the curtain */}
        <path d={`M ${R308.x - 2.6} ${R308.y + 9} L ${R308.x - 2.4} ${R308.y - 2} Q ${R308.x} ${R308.y - 7} ${R308.x + 2.4} ${R308.y - 2} L ${R308.x + 2.6} ${R308.y + 9} Z`} fill="#0d3a24" opacity={0.75 * figure} />
        <circle cx={R308.x} cy={R308.y - 5.2} r={1.9} fill="#0d3a24" opacity={0.75 * figure} />
        <path d={`M ${R308.x - 3.4} ${R308.y - 6.4} l 1.1 -2 l 1.1 1.2 l 1.2 -2.2 l 1.2 2.2 l 1.1 -1.2 l 1.1 2 Z`} fill="#0d3a24" opacity={0.6 * figure} />
      </Live>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,180,120,0.08), rgba(0,0,0,0) 70%)' }} />
    </BG>
  );
};

/** 9 — low tide: the sea pulled far back. Slow pull-back reveals the flats. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.32 - 0.32 * e, dx: 0, dy: 30 * (1 - e), oy: 900 };
  // a sheet of water still draining back toward the far waterline
  const drain = 1 - EOUT(p);
  const edgeY = WL + 12 + drain * 420;
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = -40 + i * 36;
    return `${x},${(edgeY + Math.sin(x * 0.01 + t * 0.8) * 10 + Math.sin(x * 0.033) * 5).toFixed(1)}`;
  }).join(' ');
  const r = rng(12);
  return (
    <BG>
      <BandImg id="beach/far" k={0.3} cam={cam} />
      <Live k={0.3} cam={cam}><Gulls t={t + 10} /></Live>
      <BandImg id="beach/flats-mid" k={0.7} cam={cam} />
      <Live k={0.7} cam={cam}>
        <polygon points={`-40,${WL} ${W + 40},${WL} ${pts.split(' ').reverse().join(' ')}`} fill="#3a3460" opacity={0.42} />
        <polyline points={pts} fill="none" stroke={C.foam} strokeWidth={2.5} opacity={0.55} />
        <polyline points={pts} fill="none" stroke="#ffd2a8" strokeWidth={1} opacity={0.6} transform="translate(0 -5)" strokeDasharray="20 30" />
        {/* glints on the wet flats in the sun column */}
        {Array.from({ length: 30 }, (_, i) => {
          const k = r(), x = SUN.x + (r() - 0.5) * (40 + k * 500), y = WL + 20 + k * 800, ph = r() * 6.28;
          return <rect key={i} x={x} y={y} width={6 + k * 22} height={1.5 + k * 2} rx={1} fill="#fff4d8" opacity={Math.max(0, Math.sin(t * 2.6 + ph)) ** 2} />;
        })}
      </Live>
      <BandImg id="beach/flats-near" k={1.2} cam={cam} />
      <BandImg id="beach/fg" k={1.6} cam={cam} />
    </BG>
  );
};

/** 10 — crowd silhouettes with glowing phones; lateral track. */
const Phones: React.FC<{ layer: 'near' | 'far'; t: number; flashAt: number }> = ({ layer, t, flashAt }) => {
  const ppl = crowdPeople(layer);
  const r = rng(layer === 'near' ? 5 : 6);
  return (
    <g>
      <defs>
        <linearGradient id={`scr${layer}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3d7a" />
          <stop offset="0.55" stopColor="#ff9f6a" />
          <stop offset="0.62" stopColor="#ffe6b0" />
          <stop offset="0.7" stopColor="#3a3060" />
          <stop offset="1" stopColor="#1c1830" />
        </linearGradient>
        <radialGradient id={`halo${layer}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe7c8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe7c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {ppl.map((p, i) => {
        if (!p.phone) { r(); return null; }
        const ph = phonePos(p);
        const myFlash = i === 2 ? flashAt : flashAt + 0.4 + r() * 1.2;
        const fl = Math.max(0, 1 - Math.abs(t - myFlash) * 7);
        const wob = Math.sin(t * 2 + i) * ph.w * 0.04;
        return (
          <g key={i} transform={`translate(${ph.x + wob} ${ph.y}) rotate(${Math.sin(i * 3) * 6})`}>
            <circle r={ph.h * 1.1} fill={`url(#halo${layer})`} />
            <rect x={-ph.w / 2 - ph.w * 0.08} y={-ph.h / 2 - ph.w * 0.08} width={ph.w * 1.16} height={ph.h + ph.w * 0.16} rx={ph.w * 0.18} fill="#07050b" />
            <rect x={-ph.w / 2} y={-ph.h / 2} width={ph.w} height={ph.h} rx={ph.w * 0.12} fill={`url(#scr${layer})`} />
            <circle cx={0} cy={ph.h * 0.11} r={ph.w * 0.12} fill="#fff6e0" />
            {/* the girl in white, tiny, on every screen */}
            <rect x={ph.w * 0.18} y={ph.h * 0.06} width={ph.w * 0.05} height={ph.h * 0.1} fill="#f4eef0" />
            {fl > 0 && <circle r={ph.h * (0.6 + fl)} fill="#ffffff" opacity={fl * 0.9} />}
          </g>
        );
      })}
    </g>
  );
};
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const e = interpolate(p, [0, 1], [0, 1], { easing: EIO });
  const cam: Cam = { zoom: 1.14, dx: 240 - 480 * e, dy: 0, oy: 1000 };
  const flashAt = 0.3;
  return (
    <BG>
      <BandImg id="beach/far" k={0.2} cam={cam} />
      <BandImg id="beach/flats-mid" k={0.45} cam={cam} />
      <BandImg id="beach/crowd-far" k={0.8} cam={cam} />
      <Live k={0.8} cam={cam} w={CROWD_W}><Phones layer="far" t={t} flashAt={flashAt + 0.5} /></Live>
      <BandImg id="beach/crowd-near" k={1.3} cam={cam} />
      <Live k={1.3} cam={cam} w={CROWD_W}><Phones layer="near" t={t} flashAt={flashAt} /></Live>
    </BG>
  );
};

/** 11 — follow behind her as she walks toward the far waterline. The ground flows past (zoom about the vanishing point). */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const walk = t * Math.PI * 2 * 0.95;
  const bob = Math.sin(walk * 2) * 3;
  const vp = { ox: 540, oy: 830 };
  const sky: Cam = { zoom: 1.04 + 0.02 * p, dx: 0, dy: 0, ...vp, ty: bob * 0.3 };
  const ground: Cam = { zoom: 1.02 + 0.14 * p, dx: 0, dy: 0, ...vp, ty: bob };
  const near: Cam = { zoom: 1.05 + 0.5 * p, dx: 0, dy: 0, ...vp, ty: bob * 1.5 };
  const fixed: Cam = { zoom: 1, dx: 0, dy: 0, ty: bob * 0.5 };
  const gx = 648, gy = 1490, s = 1.12;
  const stepPhase = (walk / Math.PI) % 2;
  return (
    <BG>
      <BandImg id="beach/far" k={1} cam={sky} />
      <Live k={1} cam={sky}><Gulls t={t + 20} /></Live>
      <BandImg id="beach/flats-mid" k={1} cam={ground} />
      <Live k={1} cam={fixed}>
        {/* footprints in the wet sand flowing back toward the camera */}
        {Array.from({ length: 9 }, (_, i) => {
          const u = i + (stepPhase % 1);
          const y = gy + 18 + Math.pow(u, 1.55) * 44, sc = 1 + u * 0.28, side = (i + Math.floor(stepPhase)) % 2 ? 1 : -1;
          return <ellipse key={i} cx={gx + side * 22 * sc} cy={y} rx={9 * sc} ry={4 * sc} fill="#120c1a" opacity={0.5 - u * 0.04} />;
        })}
        <Girl x={gx} y={gy} s={s} t={t} walk={walk} stride={1} hairSway={Math.sin(t * 1.6) * 0.7} hemSway={Math.sin(walk) * 0.8} />
      </Live>
      <BandImg id="beach/flats-near" k={1} cam={near} />
    </BG>
  );
};

/** 13 — medium from behind, handheld; her shoulders shake as she laughs. Background is the defocused beach. */
export const S13: React.FC = () => {
  const { p, t, fps } = useShot();
  const h = handheld(t, 1.1);
  const bg: Cam = { zoom: 1.5, dx: 0, dy: 0, ox: 452, oy: 760, tx: h.hx * 0.6 - 40 * p, ty: h.hy * 0.6 + 80, rot: h.hr };
  const fg: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr };
  const lt = wordAt(13, /laugh/, 0.15);
  const laugh = ramp(t, lt - 0.1, lt + 0.15) * (1 - 0.4 * ramp(t, lt + 0.9, lt + 1.4));
  const shake = laugh * (Math.sin(t * 38) * 5 + Math.sin(t * 23) * 3);
  void fps;
  return (
    <BG>
      <BandImg id="beach/soft" k={1} cam={bg} />
      {/* soft sun flare */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 40% 33%, rgba(255,226,170,0.45), rgba(255,170,100,0.12) 22%, rgba(0,0,0,0) 45%)' }} />
      <Live k={1} cam={fg}>
        <Girl x={600} y={2330} s={3.3} t={t} hairSway={Math.sin(t * 1.2) * 0.6 + laugh * Math.sin(t * 19) * 0.3} hemSway={Math.sin(t * 1.3)} shake={shake} reflection={false} id="g13" />
      </Live>
    </BG>
  );
};

/** 15 — wide, she is alone. Slow pull-back. Green light wakes under the waves and the sea creeps toward her. */
export const S15: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.24 - 0.24 * e, dx: 0, dy: -20 * (1 - e), oy: 1150 };
  const g = 0.45 + 0.55 * ramp(p, 0, 0.8);
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);
  const creep = 34 * EOUT(p);
  return (
    <BG c="#0e1430">
      <BandImg id="beach/far" k={0.35} cam={cam} />
      <BandImg id="beach/mid" k={0.65} cam={cam} />
      <Live k={0.65} cam={cam}>
        <defs>
          <radialGradient id="uw" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7dffb0" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#2fd88a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#2fd88a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[[560, 1330, 560, 110], [380, 1240, 300, 60], [820, 1220, 340, 60], [600, 1120, 420, 34]].map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x + Math.sin(t * 0.6 + i) * 20} cy={y} rx={rx * g * (i ? 1 : pulse)} ry={ry * g} fill="url(#uw)" opacity={g * (i ? 0.7 : 1)} />
        ))}
        <Twinkles t={t} />
        <circle cx={R308.x} cy={R308.y} r={30 + 10 * pulse} fill="url(#uw)" />
      </Live>
      <BandImg id="beach/near" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <g transform={`translate(0 ${creep})`}>
          <rect x={0} y={SHORE - 110} width={W} height={150} fill="#3dff95" opacity={0.08 * g} />
          <Surf t={t + 1.5} />
        </g>
        <Girl x={SUN.x + 6} y={SHORE + 26} s={0.8} t={t} hairSway={Math.sin(t * 1.4)} hemSway={Math.sin(t * 1.7 + 0.6)} greenHem={0.95} id="g15" />
      </Live>
      <BandImg id="beach/fg" k={1.45} cam={cam} />
      {/* cooler grade from the twist on */}
      <AbsoluteFill style={{ backgroundColor: '#5f8fa8', mixBlendMode: 'multiply', opacity: 0.35 }} />
    </BG>
  );
};

export { layerStyle, clamp01, HORIZON };
