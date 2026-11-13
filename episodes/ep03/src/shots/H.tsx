import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump, limb, Mitt } from '../art/homes_kit';
import { Side, Front, Pal } from '../art/homes_people';
import { DR, TableLamp, Table, TapBeat, BakeryBeat, QueueBg, Column, Radio } from '../art/homes_rooms';

const decay = (t: number, at: number, k = 8, w = 40) => (t < at ? 0 : Math.exp(-(t - at) * k) * Math.sin((t - at) * w));

const FATHER: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#5a6a7a', topD: '#3e4a58', bottom: '#2e2c34', headC: '#16131a', headD: '#16131a', rim: '#ffcf86' };
const MOTHER: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#8a5a6a', topD: '#5e3c48', bottom: '#4a3a4a', headC: '#c9a86a', headD: '#9a7a44', rim: '#ffcf86' };
const SON: Pal = { skin: '#a8714f', skinD: '#74482f', top: '#c9c2b2', topD: '#9a9282', bottom: '#2e3444', headC: '#16131a', headD: '#16131a', rim: '#ffcf86' };

/* ============ shot 8: night, the father rises from the dinner table and points at the TV on "gone" ============ */
export const S08: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tG = wordAt(8, /^gone/i, 0.7);
  const rise = ramp(t2, 0, Math.max(0.3, tG - 0.45), EOUT);
  const pt = ramp(t2, tG - 0.22, tG, EOUT);
  const shake = 6 * Math.abs(Math.sin(t2 * 9)) * ramp(t2, tG, tG + 0.2);
  const fH = 1000;
  const handN: [number, number] = [lerp(150, 360, pt), lerp(-600, -880, pt) - shake];
  const h = handheld(t, 0.25);
  const j = decay(t, tG, 9, 44);
  const cam: Cam = { zoom: 1.04 + 0.04 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx + 5 * j, ty: h.hy + 8 * j, ox: 560, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#16121a' }}>
      <BandImg id="homes/dining-a" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <ellipse cx={290} cy={800} rx={420} ry={300} fill="#9fd7ff" opacity={0.08 + 0.02 * Math.sin(t * 13)} />
          <Front x={450} y={1650} h={800} pal={SON} head="short" handL={[-150, -560]} handR={[150, -560]} tilt={8 * ramp(t2, tG - 0.3, tG)} eyes="open" bob={3 * Math.sin(t2 * 2.4)} rimO={0.5} />
          <Side x={170} y={DR.floor + 130} h={860} pal={MOTHER} head="scarf" skirt sit handN={[170, -600]} handF={[150, -610]} headTilt={-6 * pt} bob={3 * Math.sin(t2 * 2.2)} rimO={0.6} />
          <Side x={860} y={DR.floor + 260 * (1 - rise)} h={fH} dir={-1} pal={FATHER} head="short" male lean={4 + 10 * rise} handN={handN} handF={[100, -560]} bob={4 * Math.sin(t2 * 3)} rimO={0.7} />
          <Table jump={3 * Math.abs(j)} />
          <TableLamp x={560} sway={6 * Math.sin(t * 1.6) + 10 * j} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 9: reverse, the son stands and slams the table on "innocent"; the mother reaches to both ============ */
export const S09: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tI = wordAt(9, /^innocent/i, 0.63);
  const rise = ramp(t2, 0, Math.min(0.5, tI * 0.4), EOUT);
  const up = ramp(t2, tI - 0.32, tI - 0.08, EOUT);
  const down = ramp(t2, tI - 0.08, tI, Easing.in(Easing.quad));
  const hy = lerp(lerp(-640, -840, up), -592, down);
  const hx = lerp(lerp(150, 140, up), 200, down);
  const flinch = bump(t2, tI, 0.35);
  const j = decay(t, tI, 9, 50);
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.04 + 0.03 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx + 6 * j, ty: h.hy + 12 * j, ox: 520, oy: 1000 };
  const DARK: Pal = { skin: '#0e0a0c', skinD: '#0e0a0c', top: '#141016', topD: '#141016', bottom: '#141016', headC: '#0a080a', headD: '#0a080a', rim: '#ffcf86' };
  return (
    <AbsoluteFill style={{ backgroundColor: '#141016' }}>
      <BandImg id="homes/dining-b" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Front x={640} y={1660} h={820} pal={MOTHER} head="scarf" handL={[-320 + 30 * flinch, -720 - 30 * flinch]} handR={[300 - 30 * flinch, -700 - 20 * flinch]} tilt={-6 + 8 * flinch} eyes="open" bob={3 * Math.sin(t2 * 2.6)} rimO={0.6} />
          <Side x={300} y={DR.floor + 200 * (1 - rise)} h={920} pal={SON} head="short" male lean={6 + 14 * up - 4 * down + 8 * down} handN={[hx, hy]} handF={[hx - 30, hy - 10]} bob={3 * Math.sin(t2 * 3)} rimO={0.7} />
          <Table jump={22 * Math.max(0, j)} x1={80} x2={900} />
          <TableLamp x={520} sway={5 * Math.sin(t * 1.5) + 14 * j} />
        </Fr>
      </Live>
      <Live k={1.25} cam={cam}><Fr><Side x={1130} y={2350} h={1500} dir={-1} pal={DARK} head="short" male handN={[100, -500]} rimO={0.6} /></Fr></Live>
    </AbsoluteFill>
  );
};

/* ============ shot 14: three hard cuts: one drip on "water", an empty bakery shelf on "bread", a mother hugging her child in a silent queue on "answers" ============ */
export const S14: React.FC = () => {
  const { t, t2 } = useShot();
  const tW = wordAt(14, /^water/i, 0.11);
  const tB = wordAt(14, /^bread/i, 0.39);
  const tA = wordAt(14, /^answers/i, 0.66);
  const h = handheld(t, 0.2);
  if (t < tB) {
    const turn = ramp(t2, 0, Math.max(0.1, tW - 0.05), EOUT);
    const drop = t < tW - 0.2 ? 0 : (t - (tW - 0.2)) / 0.2;
    const cam: Cam = { zoom: 1.0 + 0.04 * (t / tB), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 600, oy: 900 };
    const kx = 545 + Math.cos((-50 * turn) / 57.3) * 70, ky = 690 + Math.sin((-50 * turn) / 57.3) * 70;
    return (
      <AbsoluteFill style={{ backgroundColor: '#cfd3d2' }}>
        <Live cam={cam}>
          <Fr>
            <TapBeat turn={turn} drop={drop} t={t} />
            <path d={limb(1250, 380, kx + 60, ky - 30, 150, 110)} fill="#5a6a7a" />
            <path d={limb(kx + 120, ky - 50, kx + 30, ky - 20, 90, 80)} fill="#a8714f" />
            <Mitt x={kx + 40} y={ky - 22} ang={190 - 30 * turn} len={130} w={88} skin="#a8714f" shade="#74482f" thumb={1} curl={0.6} />
          </Fr>
        </Live>
      </AbsoluteFill>
    );
  }
  if (t < tA) {
    const u = (t2 - tB) / Math.max(0.2, tA - tB);
    const cam: Cam = { zoom: 1.02, dx: 30 - 60 * u, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 900 };
    return (
      <AbsoluteFill style={{ backgroundColor: '#d8c8a8' }}>
        <Live cam={cam}>
          <Fr>
            <BakeryBeat t={t} />
            <path d={limb(-200, 1400, lerp(380, 640, u), 860, 120, 90)} fill="#c96b4a" />
            <Mitt x={lerp(380, 640, u)} y={856} ang={-8} len={120} w={80} skin="#b07a5e" shade="#7a4f3e" thumb={-1} curl={0.1} />
          </Fr>
        </Live>
      </AbsoluteFill>
    );
  }
  const sq = bump(t2, tA, 0.5);
  const cam: Cam = { zoom: 1.06 + 0.04 * clamp01((t - tA) / 0.8), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 520, oy: 1000 };
  const GREY: Pal = { skin: '#8a7a70', skinD: '#6a5a50', top: '#7a7a80', topD: '#5a5a60', bottom: '#4a4a52', headC: '#3a3a40', headD: '#2a2a30', rim: '#ffffff' };
  const MOM: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#5a7a8a', topD: '#3e5a68', bottom: '#4a3a4a', headC: '#d9c7a0', headD: '#a8966e', rim: '#ffffff' };
  const KID: Pal = { skin: '#a8714f', skinD: '#74482f', top: '#e0b040', topD: '#a8802a', bottom: '#3a4a6a', headC: '#16131a', headD: '#16131a', rim: '#ffffff' };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e6e8ea' }}>
      <Live cam={cam}>
        <Fr>
          <QueueBg />
          {[[110, 760], [250, 720], [860, 740], [1000, 780]].map(([x, hh], i) => (
            <Side key={i} x={x} y={1420} h={hh} pal={GREY} head={i % 2 ? 'scarf' : 'short'} skirt={i % 2 === 1} male={i % 2 === 0} bob={3 * Math.sin(t2 * 2 + i)} rimO={0.2} />
          ))}
          <Side x={620} y={1420} h={520} dir={-1} pal={KID} head="short" male lean={18 + 4 * sq} handN={[120, -700]} handF={[110, -720]} rimO={0.3} />
          <Side x={430} y={1420} h={820} pal={MOM} head="scarf" skirt lean={34 + 4 * sq} handN={[300 + 10 * sq, -560]} handF={[290, -600]} headTilt={10} bob={-6 * sq} rimO={0.3} footN={[90, 0]} footF={[-60, 0]} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 23: ash dawn, the column of followers walks toward the next city; the stall radio crackles on "name"; slow pull-back ============ */
export const S23: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tN = wordAt(23, /^name/i, 0.82);
  const crackle = t < tN ? 0.15 * (Math.sin(t * 31) > 0.6 ? 1 : 0) : Math.min(1, (t - tN) * 6);
  const turn = ramp(t2, tN, tN + 0.25, EOUT);
  const OLD: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#d8d0bc', topD: '#a8a08c', bottom: '#4a4a5a', headC: '#c9c2b2', headD: '#9a9282', rim: '#ffd8a8' };
  const z = 1.2 - 0.18 * EIO(t / sec);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 600, oy: 1150 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#4a4652' }}>
      <BandImg id="homes/highway" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Column t2={t2} />
          <Side x={975} y={1500} h={640} dir={-1} pal={OLD} head="peci" male sit lean={-4 + 14 * turn} headTilt={10 * turn} handN={[170, -560 + 30 * turn]} handF={[150, -560]} bob={2 * Math.sin(t2 * 2)} rimO={0.6} />
          <rect x={780} y={1232} width={408} height={300} fill="#5a4636" />
          <rect x={770} y={1222} width={418} height={20} fill="#7a5e44" />
          <Radio x={880} y={1224} crackle={crackle} t={t} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
