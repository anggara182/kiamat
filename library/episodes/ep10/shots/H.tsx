import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { SitGirl, WalkGirl, DOOR } from '../art/house_figs';

const D = DOOR;
const flick = (t: number) => 0.88 + 0.07 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 13.1 + 1);

/** string lights sagging across the bedroom wall; twinkle = opacity only */
const StringLights: React.FC<{ t: number }> = ({ t }) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 18; i++) { const x = -40 + i * 76; const u = (i % 6) / 6; pts.push([x, 420 + Math.sin(u * Math.PI) * 120]); }
  return (
    <g>
      <defs><radialGradient id="hsBulb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2d6" stopOpacity="0.9" /><stop offset="0.3" stopColor="#ffd9a0" stopOpacity="0.4" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient></defs>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} stroke="#1a1012" strokeWidth={4} fill="none" />
      {pts.map(([x, y], i) => {
        const o = 0.75 + 0.25 * Math.sin(t * 2.1 + i * 1.7);
        return <g key={i} opacity={o}><circle cx={x} cy={y + 14} r={46} fill="url(#hsBulb)" /><ellipse cx={x} cy={y + 14} rx={8} ry={11} fill="#ffe8c0" /></g>;
      })}
    </g>
  );
};

/** shot 4 — sleepover bedroom: three girls in pyjamas on sleeping bags, string lights, one flashlight. Slow lateral track. */
export const S04: React.FC = () => {
  const { p, t, sec } = useShot();
  const tg = wordAt(4, /giggl/i, 0.85) / sec;
  const g = ramp(p, tg - 0.25, tg, EIO);
  const laugh = g * (0.5 + 0.5 * Math.sin(t * 9));
  const cam: Cam = { zoom: 1.1, dx: 70 - 140 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1100 };
  const hh = handheld(t, 0.15);
  const c2 = { ...cam, tx: hh.hx, ty: hh.hy };
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a1c22' }}>
      <BandImg id="house/bedroom" k={0.8} cam={c2} />
      <Live k={0.8} cam={c2}><StringLights t={t} /></Live>
      <Live k={1} cam={c2}>
        <defs>
          <linearGradient id="hsBeam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e8f1ff" stopOpacity="0.45" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0.03" /></linearGradient>
          <radialGradient id="hsSpot" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#e8f1ff" stopOpacity="0.55" /><stop offset="1" stopColor="#e8f1ff" stopOpacity="0" /></radialGradient>
          <radialGradient id="hsLamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.35" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={648} cy={1250} rx={620} ry={360} fill="url(#hsLamp)" />
        {/* flashlight beam onto the ceiling corner */}
        <ellipse cx={1010} cy={640} rx={170} ry={120} fill="url(#hsSpot)" />
        <polygon points="908,1250 936,1256 1110,640 910,640" fill="url(#hsBeam)" />
        <SitGirl x={300} y={1560} h={500} pj="#4a6a8a" pjD="#2e4660" hair="long" tilt={4} laugh={laugh * 0.6} />
        <SitGirl x={980} y={1560} h={500} pj="#8a5a6a" pjD="#5e3a48" hair="bob" tilt={-4} laugh={laugh * 0.8} />
        <SitGirl x={648} y={1600} h={540} pj="#c08a5a" pjD="#8a5a38" hair="pony" laugh={laugh} arm={g > 0.5 ? 'up' : 'lap'} />
        {/* flashlight held by the right girl */}
        <g transform="rotate(-12 920 1290)"><rect x={902} y={1250} width={36} height={92} rx={8} fill="#2a2e38" /><rect x={898} y={1240} width={44} height={20} rx={4} fill="#e8f1ff" /></g>
        <ellipse cx={920} cy={1250} rx={40} ry={28} fill="url(#hsSpot)" />
      </Live>
      <BandImg id="house/bedfg" k={1.2} cam={c2} />
    </AbsoluteFill>
  );
};

/** warm candle light the three girls carry (glow = radial gradients, flicker = opacity) */
const CandleGlow: React.FC<{ x: number; y: number; o: number; r?: number }> = ({ x, y, o, r = 1 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id="hcG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc46b" stopOpacity="0.55" /><stop offset="0.45" stopColor="#ffc46b" stopOpacity="0.16" /><stop offset="1" stopColor="#ffc46b" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={560 * r} ry={620 * r} fill="url(#hcG)" />
  </g>
);

/** shot 5 — three silhouettes walking down the dark hallway toward the bathroom door, lit by the candle they carry. Follow from behind. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const hh = handheld(t, 0.5);
  const cam: Cam = { zoom: 1.04 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, rot: hh.hr * 0.5, ox: 540, oy: 900 };
  const adv = ramp(p, 0, 1, (x) => x);
  const sc = 1 - 0.22 * adv;
  const fy = 1600 - 190 * adv;
  const f = flick(t);
  const ph = t * 5.2;
  const gx = (x: number) => 648 + (x - 648) * sc;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0b0f' }}>
      <BandImg id="house/hall" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        {/* candle light reaching the door as they approach */}
        <rect x={D.x0} y={D.y0} width={D.x1 - D.x0} height={D.y1 - D.y0} fill="#ffc46b" opacity={(0.04 + 0.1 * adv) * f} />
      </Live>
      <Live k={1} cam={cam}>
        <CandleGlow x={648} y={fy - 470 * sc} o={f} r={0.9 + 0.1 * sc} />
        <ellipse cx={648} cy={fy + 10} rx={380 * sc} ry={90 * sc} fill="url(#hcG)" opacity={f} />
        <WalkGirl x={gx(440)} y={fy + 30 * sc} h={600 * sc} phase={ph + 2} hair="bob" side={1} />
        <WalkGirl x={gx(860)} y={fy + 20 * sc} h={590 * sc} phase={ph + 4} hair="long" side={-1} />
        <WalkGirl x={648} y={fy - 40 * sc} h={620 * sc} phase={ph} hair="pony" side={0} />
        {/* flame peeking over the middle girl's shoulder */}
        <ellipse cx={600} cy={fy - 40 * sc - 420 * sc} rx={70 * sc} ry={80 * sc} fill="#ffc46b" opacity={0.0} />
      </Live>
      <BandImg id="house/hallfg" k={1.25} cam={cam} />
    </AbsoluteFill>
  );
};

/** shot 11 — the empty dark hallway, bathroom door ajar with a sliver of candle light. Slow pull-back. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const f = flick(t * 0.8);
  const cam: Cam = { zoom: 1.32 - 0.3 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 800 };
  const gx = D.x1 - 26;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0b0f' }}>
      <BandImg id="house/hall" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="hsSl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffc46b" stopOpacity="0.6" /><stop offset="1" stopColor="#ffe2a8" /></linearGradient>
          <linearGradient id="hsSp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffc46b" stopOpacity="0.55" /><stop offset="1" stopColor="#ffc46b" stopOpacity="0" /></linearGradient>
          <radialGradient id="hsDg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc46b" stopOpacity="0.28" /><stop offset="1" stopColor="#ffc46b" stopOpacity="0" /></radialGradient>
        </defs>
        <g opacity={f}>
          <ellipse cx={gx + 12} cy={(D.y0 + D.y1) / 2} rx={200} ry={330} fill="url(#hsDg)" />
          {/* light spill on the floor, fanning toward camera */}
          <polygon points={`${gx},${D.y1} ${D.x1},${D.y1} ${D.x1 + 300},${D.y1 + 900} ${gx + 40},${D.y1 + 900}`} fill="url(#hsSp)" />
          {/* the sliver */}
          <rect x={gx} y={D.y0} width={22} height={D.y1 - D.y0} fill="url(#hsSl)" />
          <rect x={gx + 14} y={D.y0} width={8} height={D.y1 - D.y0} fill="#fff0cc" />
          {/* lit edge of the door slab */}
          <rect x={gx - 6} y={D.y0} width={6} height={D.y1 - D.y0} fill="#ffc46b" opacity={0.5} />
        </g>
      </Live>
      <BandImg id="house/hallfg" k={1.2} cam={cam} />
    </AbsoluteFill>
  );
};
