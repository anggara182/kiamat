import React from 'react';
import { AbsoluteFill } from 'remotion';
import { W, rng } from '../art/world';
import { Ribbon, Pt } from '../art/Silk';
import { BandImg, Live, useShot, ramp, Cam, handheld, EIO, EOUT } from '../comp/Camera';
import { HEM_H, HEM_Y, hemPath, FOLDS, foldX, LOW_HZ } from '../sets/shore';
import { wordAt } from '../data/ep';

/* =============== Set B: shore close-ups =============== */

/** 4 — the green selendang floating in the shallows, light caustics on the sand below. Slow drift. */
const selendangPts = (t: number): Pt[] =>
  Array.from({ length: 96 }, (_, i) => {
    const s = i / 95;
    const bx = 648 + 430 * Math.sin(s * 4.6 + 0.2), by = 380 + s * 1120;
    const n = Math.sin(s * 7 - t * 1.3) * 46 + Math.sin(s * 13 - t * 2.1) * 12;
    return [bx + n * 0.45, by - n * 0.9];
  });
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.06 + 0.06 * p, dx: -30 * p, dy: -24 * p, rot: -1.5 + 1.5 * p };
  const pts = selendangPts(t);
  const twist = (s: number) => 1.7 * Math.sin(s * 4.2 - t * 0.9) + 0.5 * Math.sin(s * 11 - t * 1.7) + 0.2;
  const r = rng(44);
  const foam = Array.from({ length: 4 }, (_, i) => ({ x: r() * W, y: 300 + r() * 1700, s: 0.6 + r() * 0.9, v: 8 + r() * 14, seed: i }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#241a34', overflow: 'hidden' }}>
      <BandImg id="shore/bed" k={0.85} cam={cam} />
      {/* caustics: two baked nets sliding against each other */}
      <BandImg id="shore/caustA" k={0.85} cam={{ ...cam, tx: Math.sin(t * 0.7) * 26, ty: Math.cos(t * 0.55) * 22 }} style={{ opacity: 0.5 }} />
      <BandImg id="shore/caustB" k={0.85} cam={{ ...cam, tx: Math.cos(t * 0.6 + 1) * 30, ty: Math.sin(t * 0.8) * 24, zoom: cam.zoom + 0.03 }} style={{ opacity: 0.4 }} />
      {/* the cloth's shadow on the bed */}
      <Live k={0.85} cam={cam}>
        <g transform="translate(40 70)" opacity={0.35}>
          <Ribbon pts={pts} width={190} twist={twist} pal={{ deep: '#120a1c', dark: '#120a1c', mid: '#120a1c', light: '#120a1c', spec: '#120a1c', trim: '#120a1c' }} />
        </g>
      </Live>
      <Live k={1} cam={cam}>
        <Ribbon pts={pts} width={(s) => 190 + 40 * Math.sin(s * 9 + t)} twist={twist} trim fringe light={0.4 + 0.3 * Math.sin(t)} />
        {/* lace foam drifting on the surface */}
        {foam.map((f, i) => {
          const rr = rng(100 + f.seed);
          const x = f.x + t * f.v, y = f.y + Math.sin(t * 0.5 + i) * 10;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${f.s})`} opacity={0.55}>
              {Array.from({ length: 22 }, (_, k) => {
                const a = rr() * 6.28, d = 30 + rr() * 90;
                return <ellipse key={k} cx={Math.cos(a) * d * 1.6} cy={Math.sin(a) * d * 0.6} rx={8 + rr() * 22} ry={4 + rr() * 10} fill="none" stroke="#f6efe6" strokeWidth={2 + rr() * 2} />;
              })}
            </g>
          );
        })}
        {Array.from({ length: 36 }, (_, i) => {
          const x = r() * W, y = 200 + r() * 1900, ph = r() * 6.28;
          return <rect key={`g${i}`} x={x} y={y} width={10 + r() * 20} height={2.5} rx={1} fill="#fff4dc" opacity={Math.max(0, Math.sin(t * 3 + ph)) ** 3} />;
        })}
      </Live>
      {/* surface sheen: warm sky reflected in the top of the frame */}
      <AbsoluteFill style={{ background: 'linear-gradient(170deg, rgba(255,170,110,0.28), rgba(255,170,110,0) 35%, rgba(20,30,60,0) 70%, rgba(20,30,60,0.35))' }} />
    </AbsoluteFill>
  );
};

/* ---------- 12: feet at sand level ---------- */
const skin = { shadow: '#5e3a30', mid: '#a86e54', light: '#d99a76', hi: '#f0bc96' };
/** One leg + foot, front view, toes toward camera. Local origin at the ground under the foot. inner = +1 if the big toe is on the right. */
const LegFront: React.FC<{ x: number; y: number; inner: 1 | -1; curl: number; id: string }> = ({ x, y, inner, curl, id }) => {
  const toes = [
    { dx: 30, w: 30, h: 34 },
    { dx: 4, w: 21, h: 26 },
    { dx: -18, w: 19, h: 23 },
    { dx: -38, w: 17, h: 20 },
    { dx: -55, w: 15, h: 17 },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${inner} 1)`}>
      <defs>
        <linearGradient id={`${id}leg`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={skin.shadow} />
          <stop offset="0.3" stopColor={skin.mid} />
          <stop offset="0.58" stopColor={skin.light} />
          <stop offset="0.75" stopColor={skin.mid} />
          <stop offset="1" stopColor={skin.shadow} />
        </linearGradient>
      </defs>
      {/* shin + calf (knee hidden under the hem) */}
      <path d="M -62 -900 C -72 -820, -82 -760, -80 -700 C -78 -620, -60 -520, -46 -420 C -38 -340, -34 -260, -34 -200 L -36 -150 L 38 -150 L 34 -200 C 32 -260, 36 -340, 40 -420 C 50 -520, 70 -620, 72 -720 C 72 -800, 66 -860, 60 -900 Z" fill={`url(#${id}leg)`} />
      <path d="M -78 -720 C -76 -620, -58 -520, -46 -420" stroke={skin.shadow} strokeWidth={10} opacity={0.4} fill="none" />
      <path d="M 10 -880 C 14 -700, 8 -460, 4 -220" stroke={skin.hi} strokeWidth={10} opacity={0.35} fill="none" strokeLinecap="round" />
      {/* ankle bones */}
      <ellipse cx={-38} cy={-170} rx={12} ry={16} fill={skin.light} opacity={0.6} />
      <ellipse cx={40} cy={-160} rx={10} ry={13} fill={skin.mid} opacity={0.7} />
      {/* foot: dorsum widening toward the toes */}
      <path d="M -40 -190 C -48 -120, -76 -60, -72 -22 C -70 -6, -40 0, 0 0 C 36 0, 56 -4, 58 -26 C 60 -60, 46 -130, 40 -190 Z" fill={`url(#${id}leg)`} />
      <path d="M -10 -150 C -14 -100, -10 -60, 0 -36" stroke={skin.hi} strokeWidth={6} opacity={0.35} fill="none" />
      {/* toes */}
      {toes.map((tt, i) => {
        const h = tt.h * (1 - curl * 0.25);
        return (
          <g key={i}>
            <ellipse cx={tt.dx} cy={-h / 2 + 2} rx={tt.w / 2} ry={h / 2 + 1} fill={i === 0 ? skin.light : skin.mid} />
            <ellipse cx={tt.dx} cy={-h * 0.62} rx={tt.w * 0.3} ry={h * 0.26} fill="#f2d3c0" opacity={0.85} />
            <path d={`M ${tt.dx - tt.w / 2 + 1} ${-h * 0.2} q ${tt.w / 2} ${4} ${tt.w - 2} 0`} stroke={skin.shadow} strokeWidth={1.5} fill="none" opacity={0.6} />
          </g>
        );
      })}
      {/* contact: sand pushed up around the sole */}
      <ellipse cx={-6} cy={2} rx={82} ry={8} fill="#3a2a38" opacity={0.6} />
    </g>
  );
};
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.4);
  const cam: Cam = { zoom: 1.22 + 0.06 * EIO(p), dx: 0, dy: 0, ox: 560, oy: 1180, tx: h.hx, ty: h.hy - 60 };
  const fIn = 0.1, fullAt = 1.0;
  const back = wordAt(12, /Just/, 0.6);
  // foam front y (world): from below the frame to past the toes, then slides back a little
  const reach = ramp(t, fIn, fullAt, EOUT) - 0.35 * ramp(t, back, back + 1.2, EIO);
  const frontY = 2400 - reach * 1060;
  const curl = ramp(t, fIn + 0.5, fIn + 0.8) * (1 - ramp(t, back, back + 0.6));
  const r = rng(12);
  const edge = Array.from({ length: 34 }, (_, i) => {
    const x = -40 + i * 42;
    return [x, frontY + Math.sin(x * 0.012 + t * 1.6) * 22 + Math.sin(x * 0.041 + 1) * 10] as [number, number];
  });
  const edgeStr = edge.map(([x, y]) => `${x},${y.toFixed(1)}`).join(' ');
  const edgeD = edge.reduce((d, [x, y], i) => {
    if (i === 0) return `M ${x} ${y.toFixed(1)}`;
    const [px, py] = edge[i - 1];
    return `${d} Q ${px} ${py.toFixed(1)} ${((px + x) / 2).toFixed(1)} ${((py + y) / 2).toFixed(1)}`;
  }, '');
  const sway = Math.sin(t * 1.3) * 6;
  const contact = LOW_HZ + 220;
  return (
    <AbsoluteFill style={{ backgroundColor: '#141a3e', overflow: 'hidden' }}>
      <BandImg id="shore/low-bg" k={0.3} cam={cam} />
      <BandImg id="shore/low-sand" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="foamSheet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4eef4" stopOpacity="0.85" />
            <stop offset="0.12" stopColor="#c9c4e0" stopOpacity="0.45" />
            <stop offset="1" stopColor="#8a86b8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="hem12" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c8bcd4" />
            <stop offset="0.5" stopColor="#fbf3ec" />
            <stop offset="1" stopColor="#d6c3c6" />
          </linearGradient>
        </defs>
        {/* reflections of the legs in the film of water */}
        <g transform={`translate(0 ${contact * 2}) scale(1 -1)`} opacity={0.22}>
          <LegFront x={520} y={contact} inner={1} curl={0} id="r1" />
          <LegFront x={790} y={contact + 10} inner={-1} curl={0} id="r2" />
        </g>
        <LegFront x={520} y={contact} inner={1} curl={curl} id="l1" />
        <LegFront x={790} y={contact + 10} inner={-1} curl={curl} id="l2" />
        {/* the white hem at the top of the frame, front-lit by the low sun behind camera */}
        <path d={`M 200 0 L 1100 0 L ${1100 + sway} 520 ${Array.from({ length: 9 }, (_, i) => `Q ${1100 + sway - i * 100 - 50} ${560 + (i % 2) * 8} ${1100 + sway - (i + 1) * 100} ${520 + Math.sin(i + t) * 6}`).join(' ')} L 200 0 Z`} fill="url(#hem12)" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={1050 + sway - i * 100} cy={510} r={12} fill="none" stroke="#e2d6dc" strokeWidth={3} />)}
        <path d={`M 320 0 C 330 200, 300 380, ${320 + sway} 540 M 640 0 C 650 200, 640 380, ${640 + sway} 545 M 920 0 C 910 200, 930 380, ${920 + sway} 540`} stroke="#9b8fb0" strokeWidth={14} opacity={0.3} fill="none" />
        {/* foam sheet sliding in over the toes */}
        <path d={`${edgeD} L ${W + 40} 2400 L -40 2400 Z`} fill="url(#foamSheet)" />
        <path d={edgeD} fill="none" stroke="#fffaf4" strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        <path d={edgeD} fill="none" stroke="#ffffff" strokeWidth={3} strokeDasharray="18 26" transform="translate(0 18)" opacity={0.7} />
        <path d={edgeD} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="6 40" transform="translate(0 40)" opacity={0.5} />
        {Array.from({ length: 70 }, (_, i) => {
          const [x, y] = edge[i % edge.length];
          return <circle key={i} cx={x + r() * 40 - 20} cy={y + 10 + r() * 70} r={2 + r() * 7} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.6} />;
        })}
        {/* foam piling against the ankles */}
        {reach > 0.85 && [520, 790].map((x) => (
          <ellipse key={x} cx={x} cy={contact - 30} rx={96} ry={22} fill="none" stroke="#fff" strokeWidth={6} opacity={(reach - 0.85) * 5 * 0.6} />
        ))}
      </Live>
      <BandImg id="shore/low-fg" k={1.4} cam={cam} />
      {/* warm front light from the sun behind camera */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,170,110,0) 30%, rgba(255,170,110,0.12) 60%, rgba(0,0,0,0) 100%)' }} />
    </AbsoluteFill>
  );
};

/* ---------- 14: tilt down to the hem; green climbs ---------- */
export const S14: React.FC = () => {
  const { p, t, sec } = useShot();
  const tiltEnd = Math.min(wordAt(14, /down/, 0.25, 'end') + 0.2, sec * 0.4);
  const tilt = ramp(t, 0.1, tiltEnd, EIO);
  const gStart = wordAt(14, /turning/, 0.55) - 0.15;
  const gEnd = wordAt(14, /^up/, 0.95, 'end') + 0.3;
  const level = ramp(t, gStart, gEnd, (x) => 1 - Math.pow(1 - x, 1.8));
  const push = ramp(t, gStart, sec, EIO);
  const cam: Cam = { zoom: 1 + 0.07 * push, dx: 0, dy: 0, oy: 1100, tx: Math.sin(t * 0.7) * 4, ty: 540 - 1080 * tilt + Math.sin(t * 0.9) * 3 };
  // dye front: base climb + capillary fingers along the folds + fine ragged noise
  const climb = level * 1180;
  const front = Array.from({ length: 82 }, (_, i) => {
    const x = -60 + i * 18;
    let y = HEM_Y + 50 - climb;
    for (const [k, fx] of FOLDS.entries()) {
      const fxx = foldX(fx, HEM_Y - climb);
      const vary = [1, 0.45, 0.8, 0.3, 1.15, 0.55, 0.9, 0.35, 0.7][k];
      y -= Math.exp(-(((x - fxx) / (52 + 34 * vary)) ** 2)) * (40 + climb * 0.17 * vary) * (0.85 + 0.15 * Math.sin(k * 2.3 + t * 0.8)) * Math.min(1, level * 4);
    }
    y += Math.sin(x * 0.021 + 2) * 40 * level + Math.sin(x * 0.045 + 1) * 16 + Math.sin(x * 0.13) * 8 + Math.sin(x * 0.31 + t * 2) * 3;
    return [x, y] as [number, number];
  });
  const fstr = front.map(([x, y]) => `${x},${y.toFixed(1)}`).join(' ');
  const topY = Math.min(...front.map((f) => f[1]));
  const flash = wordAt(14, /green/, 0.65);
  const fl = Math.max(0, 1 - Math.abs(t - flash) * 4) * (t > flash - 0.1 ? 1 : 0);
  const waterGlow = ramp(t, gStart - 0.3, gStart + 1.5);
  return (
    <AbsoluteFill style={{ backgroundColor: '#151229', overflow: 'hidden' }}>
      <BandImg id="shore/hem-water" k={0.92} cam={cam} />
      <Live k={0.92} cam={cam} h={HEM_H}>
        <defs>
          <radialGradient id="wg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#3dff95" stopOpacity="0.6" />
            <stop offset="1" stopColor="#3dff95" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[470, 800].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={HEM_Y + 470} rx={(160 + 120 * waterGlow) * (1 + 0.06 * Math.sin(t * 2 + i))} ry={50 + 30 * waterGlow} fill="url(#wg)" opacity={waterGlow * 0.85} />
            <ellipse cx={x} cy={HEM_Y + 466} rx={84 + Math.sin(t * 3 + i) * 6} ry={14} fill="none" stroke="#f6efe6" strokeWidth={4} opacity={0.6} />
            <ellipse cx={x} cy={HEM_Y + 470} rx={120 + Math.sin(t * 2.2 + i) * 10} ry={22} fill="none" stroke="#f6efe6" strokeWidth={2} opacity={0.35} strokeDasharray="20 16" />
          </g>
        ))}
      </Live>
      <BandImg id="shore/hem-fabric" k={1} cam={cam} />
      <Live k={1} cam={cam} h={HEM_H}>
        <defs>
          <clipPath id="dyeClip"><path d={hemPath()} /></clipPath>
          <linearGradient id="dye" gradientUnits="userSpaceOnUse" x1="0" y1={HEM_Y + 60} x2="0" y2={topY}>
            <stop offset="0" stopColor="#063d26" />
            <stop offset="0.45" stopColor="#0f7a49" />
            <stop offset="0.85" stopColor="#2fc27a" />
            <stop offset="1" stopColor="#8affc0" />
          </linearGradient>
        </defs>
        {level > 0.001 && (
          <g clipPath="url(#dyeClip)">
            {/* wicking halo ahead of the front (stacked offsets, no blur filter) */}
            {[30, 18, 8].map((o, i) => (
              <polygon key={o} points={`${front.map(([x, y]) => `${x},${(y - o).toFixed(1)}`).join(' ')} ${W + 60},${HEM_Y + 120} -60,${HEM_Y + 120}`} fill="#7dffb0" opacity={[0.08, 0.12, 0.2][i]} />
            ))}
            <polygon points={`${fstr} ${W + 60},${HEM_Y + 120} -60,${HEM_Y + 120}`} fill="url(#dye)" opacity={0.82} />
            <polyline points={fstr} fill="none" stroke="#b4ffd6" strokeWidth={3} opacity={0.7} />
          </g>
        )}
      </Live>
      <BandImg id="shore/hem-shade" k={1} cam={cam} />
      {fl > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(160,255,200,${0.7 * fl}), rgba(30,200,110,${0.45 * fl}))` }} />}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,40,30,${0.25 * level}), rgba(0,0,0,0) 60%)` }} />
    </AbsoluteFill>
  );
};
