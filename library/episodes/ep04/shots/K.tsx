import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, handheld, ramp, EIO, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { UncleBack, KnotCU, EarProfile, ClothEdge, PocongFace } from '../art/bike_art';

const frac = (id: number, re: RegExp, fb: number, sec: number) => Math.min(0.98, Math.max(0, wordAt(id, re, fb) / sec));

/** shot 7 — medium from behind at the red light: uncle's back, white cloth wrapped round his waist. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.6);
  const idle = Math.sin(t * 22) * 1.6 + Math.sin(t * 13) * 1.1; // engine idle shake
  const cam: Cam = { zoom: 1.22 + 0.04 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy + idle * 0.3 + 60, rot: h.hr, oy: 700 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0d1c' }}>
      <BandImg id="bike/bg" k={0.4} cam={cam} />
      <Live k={1} cam={{ ...cam, ty: (cam.ty ?? 0) + idle }}>
        <UncleBack breath={Math.sin(t * 1.6) * 4} />
      </Live>
      {/* fg: seat / rear of the bike, dark */}
      <Live k={1.2} cam={cam}>
        <path d="M200 1500 Q648 1420 1096 1500 L1200 2304 L96 2304 Z" fill="#07080f" />
        <path d="M200 1500 Q648 1420 1096 1500" stroke="#ff5a4a" strokeWidth={5} fill="none" opacity={0.6} />
        <rect x={560} y={1560} width={176} height={60} rx={14} fill="#ff3b30" opacity={0.85} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — ECU on his waist: shroud cloth wrapped round the jacket, ending in a knot where hands should be. */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.35);
  const kn = frac(8, /knot/i, 0.75, sec);
  const tug = ramp(p, kn, Math.min(1, kn + 0.08), EIO) - ramp(p, Math.min(1, kn + 0.08), Math.min(1, kn + 0.2), EIO) * 0.6;
  const cam: Cam = { zoom: 1.3 + 0.14 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: h.hx, ty: h.hy - 60, rot: h.hr, oy: 818 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0e18' }}>
      <Live cam={cam}>
        <KnotCU cx={648} cy={1010} tug={tug} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — helmet edge + ear in profile; a pale cloth edge creeps in behind. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.3);
  const e = frac(9, /ear/i, 0.7, sec);
  const creep = ramp(p, 0.1, Math.max(0.3, e), EIO);
  const cam: Cam = { zoom: 1.25 + 0.05 * p, dx: 0, dy: 0, tx: h.hx + 40, ty: h.hy - 40, rot: h.hr, ox: 600, oy: 790 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0d1c' }}>
      <BandImg id="bike/bg" k={0.3} cam={cam} style={{ opacity: 0.75 - 0.35 * p }} />
      <Live cam={cam}>
        <ClothEdge x={-40 + 330 * creep} y={980} />
      </Live>
      <Live k={1.05} cam={cam}>
        <EarProfile ex={720} ey={980} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — near black: dark oval opening in white cloth leaning in from behind. Cold rim only, very slow push. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const lean = ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: 1 + 0.08 * lean, dx: 0, dy: 0, tx: Math.sin(t * 0.7) * 3, ty: Math.sin(t * 0.5) * 3, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#030408' }}>
      <Live cam={cam}>
        <g transform={`translate(${-30 * (1 - lean)} ${20 * (1 - lean)}) rotate(${-4 + 3 * lean} 668 1000)`}>
          <PocongFace />
        </g>
      </Live>
    </AbsoluteFill>
  );
};
