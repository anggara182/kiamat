import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/streets_day_kit';
import { Side, Front, toFrame, Pal } from '../art/streets_day_people';
import { MK, FruitStall, BR, Guards, SunShaft, MapTable, UnderLight } from '../art/streets_day_art';

const decay = (t: number, at: number, k = 8, w = 40) => (t < at ? 0 : Math.exp(-(t - at) * k) * Math.sin((t - at) * w));
const leanPt = (X: number, Y: number, H: number, dir: 1 | -1, lean: number, p: [number, number]) => {
  const a = (lean * Math.PI) / 180, dx = p[0], dy = p[1] + 500;
  return toFrame(X, Y, H, dir, [dx * Math.cos(a) - dy * Math.sin(a), -500 + dx * Math.sin(a) + dy * Math.cos(a)]);
};

/* ============ shot 4: market; the seller whispers to the old customer, the whisper travels along the stalls ("whisper"); she closes her eyes on "promised" ============ */
export const S04: React.FC = () => {
  const { t, t2, p } = useShot();
  const tW = wordAt(4, /^whisper/i, 0.22);
  const tP = wordAt(4, /^promised/i, 0.72);
  const sL = ramp(t2, tW - 0.3, tW, EOUT);
  const w2 = ramp(t2, tW + 0.15, tW + 0.45, EOUT);
  const m3 = ramp(t2, tW + 0.55, tW + 0.85, EOUT);
  const moved = ramp(t2, tP - 0.1, tP + 0.2, EOUT);
  const SE: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#6a7a5a', topD: '#4a5a3e', bottom: '#4a4038', headC: '#14121a', headD: '#14121a', rim: '#fff4dc' };
  const OW: Pal = { skin: '#9a6a52', skinD: '#6a4636', top: '#5a4a6a', topD: '#3e3250', bottom: '#3a3040', headC: '#e8e2d4', headD: '#bcb6a8', rim: '#fff4dc' };
  const A: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#c96b4a', topD: '#a04a2e', bottom: '#4a3a4a', headC: '#3a5a7a', headD: '#2a4060', rim: '#fff4dc' };
  const B: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#d8c8a0', topD: '#a8986e', bottom: '#5a4a3a', headC: '#8a3a4a', headD: '#5e2430', rim: '#fff4dc' };
  const M: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#4a5a6a', topD: '#32404e', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#fff4dc' };
  const oX = 690, oY = 1430, oH = 800, oLean = 6 + 5 * sL - 4 * moved;
  const oh = leanPt(oX, oY - 3 * Math.sin(t2 * 2) * 0.8, oH, -1, oLean, [22, -930]);
  const manX = lerp(1150, 1080, clamp01(t2 / (tW + 0.6)));
  const cam: Cam = { zoom: 1.04, dx: 30 - 60 * EIO(p), dy: 0, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#d8cdb8' }}>
      <BandImg id="streets/day-market" cam={cam} />
      <Live cam={cam}>
        <Fr>
          {/* the whisper travels: two women further back, then a man stops and turns */}
          <Side x={870} y={MK.ground} h={520} pal={A} head="scarf" skirt lean={4 + 18 * w2} handN={[120 + 20 * w2, -860]} handF={[60, -480]} bob={2 * Math.sin(t2 * 2)} rimO={0.3} />
          <Side x={975} y={MK.ground} h={500} dir={-1} pal={B} head="scarf" skirt lean={-4 * w2} headTilt={8 * w2} handN={[90, -520]} bob={2 * Math.sin(t2 * 2.3)} rimO={0.3} />
          <Side x={manX} y={MK.ground + 10} h={580} dir={-1} pal={M} head="short" male face={m3 > 0.5 ? 'back' : 'side'} footN={[m3 > 0.5 ? 0 : 30 * Math.sin(t2 * 8), 0]} footF={[m3 > 0.5 ? 0 : -30 * Math.sin(t2 * 8), 0]} bob={m3 > 0.5 ? 0 : 5 * Math.abs(Math.sin(t2 * 8))} rimO={0.3} />
          {/* the seller leans over his fruit to the old woman */}
          <Side x={190} y={1440} h={860} pal={SE} head="short" male lean={6 + 18 * sL} handN={[300 + 40 * sL, -900 + 30 * sL]} handF={[160, -560]} bob={2 * Math.sin(t2 * 2.6)} rimO={0.4} />
          <FruitStall x={220} y={1440} />
          <Side x={oX} y={oY} h={oH} dir={-1} pal={OW} head="scarf" skirt lean={oLean} headTilt={-10 * moved} handN={moved > 0.3 ? [90, -720] : [130, -560]} handF={[60, -480]} bob={3 * Math.sin(t2 * 2) * (1 - moved)} rimO={0.4} />
          {moved > 0.4 && <path d={`M${oh[0] - 30 * 0.8} ${oh[1] - 6} q-12 6 -24 0`} stroke="#3a2420" strokeWidth={4} fill="none" strokeLinecap="round" />}
          <path d={`M${oX + 60} ${oY - 470} L${oX + 90} ${oY}`} stroke="#6a4e32" strokeWidth={10} strokeLinecap="round" />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 5: a grey street behind barbed wire; a bread queue; light breaks through on "justice"; the boy looks up at his mother on "oppression" ============ */
export const S05: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tJ = wordAt(5, /^justice/i, 0.55);
  const tO = wordAt(5, /^oppression/i, 0.85);
  const shaft = ramp(t, tJ - 0.1, tJ + 0.5, EIO) * (1 - 0.6 * ramp(t, tO - 0.6, tO));
  const look = ramp(t2, tO - 0.1, tO + 0.25, EOUT);
  const MO: Pal = { skin: '#9a6a52', skinD: '#6a4636', top: '#6a6670', topD: '#4a4652', bottom: '#4a4652', headC: '#3a3a44', headD: '#26262e', rim: '#fff4dc' };
  const BO: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#8a7a6a', topD: '#6a5a4a', bottom: '#4a4a52', headC: '#14121a', headD: '#14121a', rim: '#fff4dc' };
  const Q: Pal[] = [
    { skin: '#8a5a44', skinD: '#5e3b2e', top: '#7a7a7e', topD: '#5a5a5e', bottom: '#4a4a50', headC: '#14121a', headD: '#14121a', rim: '#fff4dc' },
    { skin: '#9a6650', skinD: '#6a4434', top: '#6a6a5a', topD: '#4a4a3e', bottom: '#5a5048', headC: '#5a4a5a', headD: '#3e3240', rim: '#fff4dc' },
    { skin: '#a06c52', skinD: '#6e4636', top: '#5a6a72', topD: '#3e4a52', bottom: '#3a3a44', headC: '#14121a', headD: '#14121a', rim: '#fff4dc' },
  ];
  const mX = 360, mY = 1600, mH = 900;
  const mHandF: [number, number] = [-40, -440];
  const joint = toFrame(mX, mY, mH, 1, mHandF);
  const bX = 230, bY = 1590, bH = 520;
  const bHand: [number, number] = [(joint[0] - bX) / (bH / 1000), (joint[1] - bY) / (bH / 1000)];
  const cam: Cam = { zoom: 1.04 + 0.06 * EIO(t / sec), dx: 0, dy: 0, ox: 540, oy: 1050 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#a8a296' }}>
      <BandImg id="streets/day-barricade" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Guards t2={t2} />
          <SunShaft a={shaft} />
          {[[640, 760], [760, 740], [880, 780]].map(([x, hh], i) => {
            const bag = toFrame(x, 1440, hh, 1, [40, -430]);
            return (
              <g key={i}>
                <Side x={x} y={1440} h={hh} pal={Q[i]} head={i === 1 ? 'scarf' : 'short'} skirt={i === 1} male={i !== 1} handN={[40, -430]} lean={2 + 2 * Math.sin(t2 * 1.6 + i)} bob={2 * Math.sin(t2 * 1.8 + i)} rimO={0.3 + 0.4 * shaft} />
                <path d={`M${bag[0] - 26} ${bag[1] + 10} L${bag[0] + 26} ${bag[1] + 10} L${bag[0] + 34} ${bag[1] + 90} Q${bag[0]} ${bag[1] + 100} ${bag[0] - 34} ${bag[1] + 90} Z`} fill="#d8d0bc" opacity={0.9} />
              </g>
            );
          })}
          <Side x={mX} y={mY} h={mH} pal={MO} head="scarf" skirt handN={[60, -470]} handF={mHandF} headTilt={4 + 8 * look} bob={2 * Math.sin(t2 * 1.7)} rimO={0.3 + 0.4 * shaft} />
          <Side x={bX} y={bY} h={bH} pal={BO} head="short" male handN={bHand} handF={[30, -470]} headTilt={-26 * look} lean={-4 * look} bob={3 * Math.sin(t2 * 2.4)} rimO={0.3 + 0.4 * shaft} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 8: the dark room; three faceless men over an unnamed map, lit from below; a fist comes down on "him" ============ */
export const S08: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tH = wordAt(8, /^him/i, 0.33);
  const up = ramp(t2, tH - 0.4, tH - 0.12, EOUT);
  const down = ramp(t2, tH - 0.12, tH, EOUT);
  const fistY = lerp(lerp(-560, -920, up), -420, down);
  const fistX = lerp(lerp(160, 190, up), 130, down);
  const j = decay(t, tH, 9, 46);
  const SUIT: Pal = { skin: '#16120f', skinD: '#0e0c0a', top: '#24242c', topD: '#18181e', bottom: '#18181e', headC: '#0c0b0e', headD: '#0c0b0e', rim: '#ffd9a0' };
  const SUIT2: Pal = { ...SUIT, top: '#2c2a26', topD: '#1e1c1a' };
  const h = handheld(t, 0.1);
  const cam: Cam = { zoom: 1.04 + 0.12 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx + 6 * j, ty: h.hy + 10 * j, ox: 540, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0b10' }}>
      <BandImg id="streets/room-dark" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <UnderLight wob={6 * j} t={t} />
          <Front x={280} y={1720} h={1000} pal={SUIT2} head="short" handL={[-150, -520]} handR={[180, -560 + 20 * Math.max(0, j)]} tilt={6} bob={2 * Math.sin(t2 * 1.5)} rimO={0.8} />
          <Front x={800} y={1720} h={1000} pal={SUIT2} head="short" handL={[-170, -560]} handR={[150, -520]} tilt={-6} bob={2 * Math.sin(t2 * 1.7 + 1)} rimO={0.8} />
          <Front x={540} y={1760} h={1040} pal={SUIT} head="short" handL={[-150, -540]} handR={[fistX, fistY]} tilt={4 * down} bob={2 * Math.sin(t2 * 1.6)} rimO={0.9} />
          <MapTable jump={14 * Math.max(0, j)} wob={4 * j} />
          {/* the fist on the map (drawn over the table) */}
          {down > 0.3 && (
            <g>
              <path d={`M${540 + 230 * 1.04} ${1760 - 640 * 1.04} L${540 + fistX * 1.04} ${1760 + fistY * 1.04}`} stroke={SUIT.top} strokeWidth={50} strokeLinecap="round" />
              <ellipse cx={540 + fistX * 1.04} cy={1760 + fistY * 1.04 + 10} rx={40} ry={30} fill="#2a2018" />
              <path d={`M${540 + fistX * 1.04 - 30} ${1760 + fistY * 1.04 + 20} q30 14 60 0`} stroke="#ffd9a0" strokeWidth={3} fill="none" opacity={0.6} />
            </g>
          )}
          <rect x={-200} y={-300} width={1500} height={2600} fill="#0a0b10" opacity={0.15} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
