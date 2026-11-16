import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/camp_kit';
import { Side, toFrame, Pal } from '../art/camp_people';
import { TN, GoldBlock, Crate, Kneel, NIGHT_TENTS, lanternAt, Lantern, Flap, DW, Sandals, Shovel, Dog, Puff } from '../art/camp_art';

/* ============ shot 7: inside a tent, father and son each keep one hand on the same gold block; the son's jaw tightens on "speaking" ============ */
export const S07: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tSons = wordAt(7, /^sons/i, 0.39);
  const tSp = wordAt(7, /^speaking/i, 0.82);
  const tug = bump(t2, tSons - 0.05, 0.5);
  const jaw = ramp(t2, tSp - 0.06, tSp + 0.1, EOUT);
  const crateTop = 1110;
  const bx = TN.block.x - 8 * tug, by = crateTop;
  const FA: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#9a8a70', topD: '#6e604c', bottom: '#4a4038', headC: '#b8b4ac', headD: '#8a867e', rim: '#fff0c8' };
  const SO: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#4a5a6a', topD: '#32404e', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#fff0c8' };
  const fX = 300, fH = 880, fY = TN.floor + 300 * (fH / 1000);
  const sX = 780, sH = 920, sY = TN.floor + 300 * (sH / 1000);
  const fHand: [number, number] = [(bx - 50 - fX) / (fH / 1000), (by - 30 - fY) / (fH / 1000)];
  const sHand: [number, number] = [(sX - (bx + 50)) / (sH / 1000), (by - 30 - sY) / (sH / 1000)];
  const leanPt = (X: number, Y: number, H: number, dir: 1 | -1, lean: number, p: [number, number]) => {
    const a = (lean * Math.PI) / 180, dx = p[0], dy = p[1] + 500;
    return toFrame(X, Y, H, dir, [dx * Math.cos(a) - dy * Math.sin(a), -500 + dx * Math.sin(a) + dy * Math.cos(a)]);
  };
  const fb = 3 * Math.sin(t2 * 1.9), sb = 3 * Math.sin(t2 * 2.3 + 1);
  const fLean = 14 + 3 * tug, sLean = 14 + 3 * tug + 3 * jaw;
  const fh = leanPt(fX, fY - fb * fH / 1000, fH, 1, fLean, [22, -930]);
  const sh = leanPt(sX, sY - (sb - 8 * jaw) * sH / 1000, sH, -1, sLean, [22, -930]);
  const fHip = toFrame(fX, fY, fH, 1, [0, -500]), sHip = toFrame(sX, sY, sH, -1, [0, -500]);
  const h = handheld(t, 0.12);
  const cam: Cam = { zoom: 1.05 + 0.15 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 1020 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#cbbfa6' }}>
      <BandImg id="camp/tent" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Kneel hx={fHip[0]} hy={fHip[1]} dir={1} floor={TN.floor + 60} s={fH / 1000} c={FA.bottom} foot={FA.skinD} />
          <Kneel hx={sHip[0]} hy={sHip[1]} dir={-1} floor={TN.floor + 70} s={sH / 1000} c={SO.bottom} foot={SO.skinD} />
          <Crate x={540} top={crateTop} floor={TN.floor + 50} />
          <GoldBlock x={bx} y={by} />
          <Side x={fX} y={fY} h={fH} pal={FA} head="short" male noLegs lean={fLean} handN={fHand} handF={[150, -440]} bob={fb} rimO={0.5} />
          <path d={`M${fh[0] - 10} ${fh[1] + 30} Q${fh[0] + 14} ${fh[1] + 100} ${fh[0] + 50} ${fh[1] + 58} L${fh[0] + 52} ${fh[1] + 30} Q${fh[0] + 24} ${fh[1] + 48} ${fh[0] - 10} ${fh[1] + 30} Z`} fill="#d8d4cc" />
          <Side x={sX} y={sY} h={sH} dir={-1} pal={SO} head="short" male noLegs lean={sLean} handN={sHand} handF={[150, -440]} headTilt={-4 * jaw} bob={sb - 8 * jaw} rimO={0.5} />
          <g opacity={jaw}>
            <path d={`M${sh[0] + 8} ${sh[1] + 54} Q${sh[0] - 20} ${sh[1] + 66} ${sh[0] - 42} ${sh[1] + 44}`} stroke="#4a2c22" strokeWidth={6} fill="none" strokeLinecap="round" />
            <ellipse cx={sh[0] + 4} cy={sh[1] + 30} rx={10} ry={8} fill="#5e3b2e" />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 9: the tent camp at night; lanterns go out one by one; the last in the front row dies on "quieter" ============ */
export const S09: React.FC = () => {
  const { t, p } = useShot();
  const tQ = wordAt(9, /^quieter/i, 0.7);
  const n = NIGHT_TENTS.length;
  const front = NIGHT_TENTS.map((x, i) => i).filter((i) => NIGHT_TENTS[i].s === 1);
  const offAt = (i: number) => {
    const k = front.indexOf(i);
    if (k >= 0) return tQ - (front.length - 1 - k) * 0.42;
    const hsh = ((i * 2654435761) >>> 0) % 1000 / 1000;
    return hsh < 0.55 ? 0.15 + hsh / 0.55 * (tQ - 0.5) : 99;
  };
  const level = (i: number) => {
    const d = t - offAt(i);
    if (d >= 0.12) return 0;
    if (d >= 0) return d < 0.04 ? 0.6 : d < 0.08 ? 0.15 : 0.4;
    return d > -0.2 ? 0.8 + 0.2 * Math.sin(d * 120) : 1;
  };
  const cam: Cam = { zoom: 1.08, dx: 30 - 60 * EIO(p), dy: 0, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05060c' }}>
      <BandImg id="camp/night" cam={cam} />
      <Live cam={cam}>
        <Fr>
          {Array.from({ length: n }, (_, i) => { const l = lanternAt(i); return <Lantern key={i} id={`cl${i}`} x={l.x} y={l.y} s={l.s} on={level(i)} t={t} />; })}
          <Flap t={t} />
          {Array.from({ length: 5 }, (_, i) => { const u = (t * 0.08 + i / 5) % 1; return <Puff key={i} id={`cs${i}`} x={900 + 100 * u + i * 20} y={760 - 200 * u} r={50 + 80 * u} c="#2a2228" o={0.45 * Math.sin(Math.PI * u)} />; })}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 10: dawn, sandals at the doors of empty tents, shovels in the sand; a thin dog sniffs and lifts its head on "for" ============ */
export const S10: React.FC = () => {
  const { t, t2, p } = useShot();
  const tF = wordAt(10, /^for/i, 0.86);
  const walk = clamp01(t2 / tF);
  const dogX = lerp(40, 680, EIO(walk) * 0.6 + walk * 0.4);
  const tents = Array.from({ length: DW.n }, (_, i) => -260 + i * DW.spacing);
  const nearest = Math.min(...tents.map((x) => Math.abs(x + 60 - dogX)));
  const sniff = t2 >= tF ? 1 - ramp(t2, tF, tF + 0.14, EOUT) : clamp01(1.4 - nearest / 120) * 0.9 + 0.1;
  const stop = ramp(t2, tF - 0.3, tF, EOUT);
  const ph = t2 * 9 * (1 - stop);
  const cam: Cam = { zoom: 1.12, dx: 90 - 180 * EIO(p), dy: 0, ox: 540, oy: 1150 };
  const cols = ['#6a4a34', '#3a3a44', '#8a5a3a', '#5a3a2e', '#4a5a3a', '#7a4a4a', '#3a4a5a'];
  return (
    <AbsoluteFill style={{ backgroundColor: '#c9a08a' }}>
      <BandImg id="camp/dawn" cam={cam} />
      <Live cam={cam}>
        <Fr>
          {Array.from({ length: 6 }, (_, i) => { const u = (t * 0.06 + i / 6) % 1; return <Puff key={i} id={`cd${i}`} x={-100 + i * 240 + 80 * u} y={860 - 140 * u} r={60 + 90 * u} c="#d8b8a8" o={0.35 * Math.sin(Math.PI * u)} />; })}
          {tents.map((x, i) => <Sandals key={i} x={x + 60} y={DW.ground + 36} c={cols[i % cols.length]} rot={(i % 3) - 1} />)}
          {tents.filter((_, i) => i % 2 === 1).map((x, i) => <Shovel key={i} x={x + 170} y={DW.ground + 46} rot={i % 2 ? 9 : -7} />)}
          <ellipse cx={dogX + 10} cy={1262} rx={150} ry={14} fill="#5a4458" opacity={0.35} />
          <Dog x={dogX} y={1270} s={1.3} sniff={sniff} ph={ph} tail={0.3 + 0.2 * Math.sin(t2 * 4) - 0.3 * stop} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
