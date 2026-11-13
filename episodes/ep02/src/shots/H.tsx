import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/market_kit';
import { Side, Front, toFrame, Pal } from '../art/market_people';
import { SH, FrontShelf, Gallon, Bottle, GrabArm, DawnMood, DayShaft, HabisCard } from '../art/market_shop';
import { RollDoor, FrontLight, Jerrycan } from '../art/market_front';
import { ST, StallLife, Shutter, Ladle } from '../art/market_stall';

/** keyframe track [[t, x, y], ...] eased between keys */
const track = (t: number, keys: [number, number, number][]) => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1] = keys[i], [t0, x0, y0] = keys[i - 1];
    if (t <= t1) { const u = EIO((t - t0) / Math.max(1e-3, t1 - t0)); return { x: lerp(x0, x1, u), y: lerp(y0, y1, u) }; }
  }
  const k = keys[keys.length - 1];
  return { x: k[1], y: k[2] };
};
const decay = (t: number, at: number, k = 8, w = 40) => (t < at ? 0 : Math.exp(-(t - at) * k) * Math.sin((t - at) * w));

/* palettes (people) */
const OWNER: Pal = { skin: '#a8714f', skinD: '#74482f', top: '#c9b49a', topD: '#9a8670', bottom: '#5a4a5e', headC: '#5e6e4a', headD: '#3e4a30', apron: '#e2dccd', rim: '#ffd8a8' };
const WHISPERER: Pal = { skin: '#b98262', skinD: '#7e5440', top: '#8a4a5a', topD: '#5e2e3c', bottom: '#3a3448', headC: '#3f6f8a', headD: '#2a4c60', dots: '#e0cfa0', rim: '#ffd8a8' };

/* ============ shot 1 (HOOK): hands grab the last gallons off the shelf at dawn; a gallon tips and thuds on "knew" ============ */
export const S01: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tK = wordAt(1, /^knew/i, 0.72);
  // goods handled by hands (ON TWOS)
  const g1 = track(t2, [[0, 380, 1230], [0.15, 360, 1210], [Math.min(0.9, tK * 0.55), 90, 1520]]);
  const g1r = -28 * ramp(t2, 0.1, Math.min(0.9, tK * 0.55));
  const tB0 = tK * 0.3, tB1 = tK - 0.3;
  const g2 = track(t2, [[0, 600, 1230], [tB0, 600, 1226], [tB1, 990, 990]]);
  const g2r = 18 * ramp(t2, tB0, tB1);
  const tip = Easing.in(Easing.quad)(clamp01((t2 - (tK - 0.26)) / 0.26));
  const g3r = -90 * tip + (t2 > tK ? 7 * Math.abs(decay(t2, tK, 9, 24)) : 0);
  const b2 = track(t2, [[0, 470, 900], [0.1, 466, 880], [0.6, 240, 520]]);
  const b3 = track(t2, [[0, 640, 900], [tK * 0.6, 640, 900], [tK * 0.75, 636, 880], [sec, 330, 560]]);
  // hands (ON TWOS)
  const hA = { x: g1.x + Math.sin(g1r / 57) * 290, y: g1.y - 300 };
  const hB = { x: g2.x + 54, y: g2.y - 240 };
  const hC = t2 < 0.62 ? { x: b2.x, y: b2.y - 150 } : track(t2, [[0.62, 300, 640], [tK * 0.6, 640, 740], [sec, b3.x, b3.y - 150]]);
  const hD = track(t2, [[0, 820, 1330], [tK - 0.2, 770, 1150], [tK + 0.06, 830, 1380], [sec, 840, 1420]]);
  // shelf + camera (ON ONES)
  const wob = 0.22 * Math.sin(t * 17) + 1.4 * decay(t, tK, 8, 38);
  const h = handheld(t, 0.7);
  const j = decay(t, tK, 9, 46);
  const cam: Cam = { zoom: 1.74 + 0.14 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx + 6 * j, ty: h.hy + 14 * j, rot: h.hr, ox: 540, oy: 1080 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#24162a' }}>
      <BandImg id="market/shop" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <DawnMood t={t} />
          <FrontShelf wob={wob}>
            <Bottle x={420} y={900} />
            <Bottle x={b2.x} y={b2.y} rot={-20 * ramp(t2, 0.1, 0.6)} />
            <Bottle x={b3.x} y={b3.y} rot={-24 * ramp(t2, tK * 0.75, sec)} />
            <Bottle x={712} y={900} rot={-3} />
            <g transform={`rotate(${g3r} 712 1230)`}><Gallon x={790} y={1230} /></g>
            <Gallon x={g2.x} y={g2.y} rot={g2r} />
            <Gallon x={g1.x} y={g1.y} rot={g1r} />
          </FrontShelf>
          <GrabArm sx={250} sy={470} hx={hC.x} hy={hC.y} L1={300} L2={270} w={50} sleeve="#8a3a4a" sleeveD="#5e2430" skin="#c48a6a" skinD="#8a5a44" bangle curl={0.55} thumb={1} bend={-1} />
          <GrabArm sx={940} sy={800} hx={hB.x} hy={hB.y} L1={300} L2={270} w={54} sleeve="#2f3a52" sleeveD="#1c2436" skin="#8a5a44" skinD="#5e3b2e" cuff="#26304a" curl={0.6} thumb={-1} bend={1} />
          <GrabArm sx={150} sy={1300} hx={hA.x} hy={hA.y} L1={300} L2={270} w={54} sleeve="#7a4a2a" sleeveD="#4e2e18" skin="#b07a5e" skinD="#7a4f3e" cuff="#a0703a" curl={0.65} thumb={1} bend={1} />
          <GrabArm sx={860} sy={1720} hx={hD.x} hy={hD.y} L1={280} L2={250} w={40} sleeve="#e0b040" sleeveD="#a8802a" skin="#a8714f" skinD="#74482f" curl={0.2} thumb={-1} bend={-1} />
          <rect x={-200} y={-300} width={1500} height={2600} fill="#ffd08a" opacity={0.06} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 2: the rolling door rattles up (done on "problem"), the queue with empty jerrycans turns on "true" ============ */
export const S02: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tP = wordAt(2, /^problem/i, 0.22);
  const tT = wordAt(2, /^true/i, 0.75);
  const open = lerp(0.28, 1, Easing.out(Easing.quad)(clamp01(t / Math.max(0.2, tP))));
  const rattle = t < tP ? 2.2 * Math.sin(t * 70) : 1.5 * decay(t, tP, 10, 50);
  const cam: Cam = { zoom: 1.0 + 0.06 * EIO(t / sec), dx: 0, dy: 0, ox: 540, oy: 1000 };
  const turn = (i: number) => (t2 >= tT + i * (1 / 24) ? 'front' : 'side') as 'front' | 'side';
  const sway = (i: number) => Math.sin(t2 * 2.4 + i * 1.7);
  const Y = 1352;
  const p1: Pal = { skin: '#b07a5e', skinD: '#7a4f3e', top: '#b98a6a', topD: '#8a6448', bottom: '#4a3a52', headC: '#7a4a62', headD: '#563246', rim: '#ffd08a' };
  const p2: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#4f6a8a', topD: '#364a66', bottom: '#33323c', headC: '#14121a', headD: '#14121a', rim: '#ffd08a' };
  const p3: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#7e6276', topD: '#5a4456', bottom: '#5a4a3a', headC: '#9a948c', headD: '#6a645c', rim: '#ffd08a' };
  const p4: Pal = { skin: '#a8714f', skinD: '#74482f', top: '#c96b4a', topD: '#94482e', bottom: '#3a4a6a', headC: '#14121a', headD: '#14121a', rim: '#ffd08a' };
  const H1 = 560, H2 = 610, H3 = 520, H4 = 400;
  const j2 = toFrame(600, Y, H2, 1, [40, -430]), j2f = toFrame(600, Y, H2, 1, [-30, -430]);
  const j3 = toFrame(400, Y, H3, 1, [40, -440]);
  const j4 = toFrame(225, Y, H4, 1, [30, -440]);
  const b = toFrame(810, Y, H1, 1, [96, -650]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c2244' }}>
      <BandImg id="market/front" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <RollDoor open={open} rattle={rattle} />
          <FrontLight open={ramp(t, tP * 0.6, tP + 0.3)} t={t} />
          {[[225, H4], [400, H3], [600, H2], [810, H1]].map(([x, hh], i) => <ellipse key={i} cx={x + 20} cy={Y + 4} rx={hh * 0.16} ry={10} fill="#140f1c" opacity={0.5} />)}
          <Jerrycan x={j2f[0]} y={j2f[1]} s={0.62} c="#3a6fa0" />
          <Side x={600} y={Y} h={H2} pal={p2} head="short" male face={turn(1)} bob={6 * sway(1)} lean={2 * sway(1)} handN={[40, -430]} handF={[-30, -430]} />
          <Jerrycan x={j2[0]} y={j2[1]} s={0.66} />
          <Side x={400} y={Y} h={H3} pal={p3} head="bun" skirt face={turn(2)} bob={5 * sway(2)} lean={6} handN={[40, -440]} />
          <Jerrycan x={j3[0]} y={j3[1]} s={0.56} c="#d9d4c4" />
          <Side x={225} y={Y} h={H4} pal={p4} head="short" male face={turn(3)} bob={8 * Math.abs(sway(3))} handN={[30, -440]} />
          <Jerrycan x={j4[0]} y={j4[1]} s={0.42} c="#e0b040" />
          <Side x={810} y={Y} h={H1} pal={p1} head="scarf" skirt face={turn(0)} bob={5 * sway(0)} handN={[110, -640]} handF={[80, -700]} />
          <Bottle x={b[0] - 26} y={b[1] + 60} rot={-12} s={0.62} />
          <Bottle x={b[0]} y={b[1] + 66} rot={2} s={0.62} />
          <Bottle x={b[0] + 24} y={b[1] + 60} rot={14} s={0.62} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 3: breakfast stall at dawn; the customer leans in and whispers (lands on "whisper"), the owner freezes mid-ladle ============ */
export const S03: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tW = wordAt(3, /^whisper/i, 0.39);
  const lean = 6 + 26 * ramp(t2, tW - 0.4, tW, EOUT) + 2 * Math.sin(t2 * 2);
  const ladling = 1 - ramp(t2, tW - 0.15, tW, EOUT);
  const dip = ladling * (0.5 + 0.5 * Math.sin(t2 * 7));
  // owner (faces left), near hand = ladle over the pot
  const oX = 790, oY = ST.floor, oH = 860;
  const handN: [number, number] = [150 + 20 * dip, -620 + 90 * dip];
  const hn = toFrame(oX, oY, oH, -1, handN);
  const cX = 430, cY = 1800, cH = 930;
  const freeze = ramp(t2, tW - 0.1, tW + 0.1);
  const cam: Cam = { zoom: 1.0 + 0.07 * EIO(t / sec), dx: 0, dy: 0, ox: 600, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c2244' }}>
      <BandImg id="market/stall-dawn" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Side x={oX} y={oY} h={oH} dir={-1} pal={OWNER} head="scarf" skirt handN={handN} handF={[120, -560]} lean={4 - 3 * freeze} headTilt={-6 * freeze} bob={3 * Math.sin(t2 * 3) * (1 - freeze)} />
          <Ladle hx={hn[0]} hy={hn[1]} ang={70 - 20 * dip} t={t} drip={freeze} />
          <StallLife t={t} steam={1} />
          <Side x={cX} y={cY} h={cH} dir={1} pal={WHISPERER} head="scarf" skirt lean={lean} handN={[120 + 30 * freeze, -880]} handF={[120, -560]} bob={2 * Math.sin(t2 * 3)} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 8: day, the same shelves are empty, "HABIS"; the owner folds her arms on "empty"; dust in the light ============ */
export const S08: React.FC = () => {
  const { t, t2, p } = useShot();
  const tE = wordAt(8, /^empty/i, 0.7);
  const c = ramp(t2, tE - 0.28, tE, EOUT);
  const breath = Math.sin(t2 * 2.6);
  const handL: [number, number] = [lerp(-160, 70, c), lerp(-420, -690, c)];
  const handR: [number, number] = [lerp(160, -70, c), lerp(-420, -700, c)];
  const cam: Cam = { zoom: 1.06, dx: 40 - 80 * EIO(p), dy: 0, ox: 540, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#d4c7ae' }}>
      <BandImg id="market/shop" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <DayShaft t={t} />
          <FrontShelf wob={0}>
            <Front x={520} y={SH.floor} h={954} pal={OWNER} head="scarf" cross handL={handL} handR={handR} bob={3 * breath + 6 * bump(t2, tE - 0.05, 0.25)} tilt={-3 * c} eyes="open" rimO={0.3} />
          </FrontShelf>
          <HabisCard x={560} y={SH.tiers[0] + 30} sway={2 * Math.sin(t * 2.2) + 6 * Math.exp(-Math.max(0, t - tE) * 3) * (t > tE ? Math.sin((t - tE) * 12) : 0)} />
        </Fr>
      </Live>
      <Live k={1.3} cam={cam}><Fr><rect x={-200} y={-300} width={210} height={2600} fill="#3a4048" opacity={0.9} /></Fr></Live>
    </AbsoluteFill>
  );
};

/* ============ shot 23: dusk, the owner pulls the stall shutter, pauses (eyes down) on "Prophet", the shutter comes down on "enough" ============ */
export const S23: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tPr = wordAt(23, /^prophet/i, 0.12);
  const tEn = wordAt(23, /^enough/i, 0.86);
  const railHold = 905;
  // the shutter is pulled by her (ON TWOS until she lets go), then drops (ON ONES)
  const pull = ramp(t2, 0, tPr, EOUT);
  const dropU = Easing.in(Easing.quad)(clamp01((t - (tEn - 0.16)) / 0.16));
  const rail = t < tEn - 0.16 ? lerp(800, railHold, pull) + 6 * ramp(t2, tEn - 0.5, tEn - 0.16) : lerp(railHold + 6, ST.counter + 2, dropU);
  const rattle = t > tEn ? 3 * decay(t, tEn, 9, 60) : 0;
  const down = ramp(t2, tPr, tPr + 0.35, EOUT);
  const fy = (y: number) => (y - ST.floor) / 0.86;
  const holdY = Math.min(rail, railHold + 6);
  const hands = t < tEn - 0.16;
  const handL: [number, number] = hands ? [-120, fy(holdY + 6)] : [-150, -560];
  const handR: [number, number] = hands ? [120, fy(holdY + 6)] : [150, -560];
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.0 + 0.06 * EIO(t / sec), dx: 0, dy: 0, tx: h.hx, ty: h.hy + 4 * rattle, ox: 540, oy: 1100 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#1f1830' }}>
      <BandImg id="market/stall-dusk" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <StallLife t={t} steam={0.35} lamp={0.7} />
          <Front x={540} y={ST.floor} h={860} pal={OWNER} head="scarf" handL={handL} handR={handR} headDy={34 * down} tilt={-4 * down} eyes={down > 0.5 ? 'down' : 'open'} bob={2 * Math.sin(t2 * 2.4)} rimO={0.5} />
          <Shutter rail={rail} rattle={rattle} />
          {hands && [420, 660].map((x) => <path key={x} d={`M${x - 26} ${rail - 2} Q${x} ${rail + 18} ${x + 26} ${rail - 2} Z`} fill={OWNER.skin} />)}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
