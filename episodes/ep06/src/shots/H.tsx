import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Fr, lerp, bump } from '../art/village_kit';
import { Side, Front, toFrame, Pal } from '../art/village_people';
import { VS, Pickup, Load, HandPump, Tanker, Beads, OilLamp, StallTable, Puff } from '../art/village_art';

const decay = (t: number, at: number, k = 8, w = 40) => (t < at ? 0 : Math.exp(-(t - at) * k) * Math.sin((t - at) * w));
/** a point of a Side figure in frame coords, honouring its lean (rotation about the hip) */
const leanPt = (X: number, Y: number, H: number, dir: 1 | -1, lean: number, p: [number, number]) => {
  const a = (lean * Math.PI) / 180, dx = p[0], dy = p[1] + 500;
  return toFrame(X, Y, H, dir, [dx * Math.cos(a) - dy * Math.sin(a), -500 + dx * Math.sin(a) + dy * Math.cos(a)]);
};
/** the old man's white cap + white beard on a profile head (frame coords, head centre hx,hy, scale s, facing dir) */
const CapBeard: React.FC<{ hx: number; hy: number; s: number; dir: 1 | -1; tilt?: number }> = ({ hx, hy, s, dir, tilt = 0 }) => (
  <g transform={`translate(${hx} ${hy}) rotate(${tilt * dir}) scale(${dir * s} ${s})`}>
    <path d="M-60 -30 Q-62 -86 0 -88 Q60 -86 60 -30 Q0 -44 -60 -30 Z" fill="#f4f2ec" />
    <path d="M-60 -30 Q0 -44 60 -30" stroke="#c8c4bc" strokeWidth={5} fill="none" />
    <path d="M-10 30 Q14 118 66 66 L66 26 Q30 50 -10 30 Z" fill="#eeeae2" />
    <path d="M20 40 Q40 50 62 44" stroke="#c8c4bc" strokeWidth={4} fill="none" />
  </g>
);

const OLD: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#e8e2d4', topD: '#bcb6a8', bottom: '#8a8070', headC: '#e8e6e0', headD: '#bcbab4', rim: '#fff4dc' };

/* ============ shot 5: a family loads the pickup; the dry pump squeaks on "dry"; the rope pulled tight on "trucks"; slow pull-back ============ */
export const S05: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tD = wordAt(5, /^dry/i, 0.19);
  const tT = wordAt(5, /^trucks/i, 0.82);
  const pump = ramp(t2, tD - 0.2, tD, EOUT) * (1 - ramp(t2, tD + 0.3, tD + 0.7));
  const heave = ramp(t2, 0, Math.min(1.6, tT * 0.5), EIO);
  const pull = ramp(t2, tT - 0.3, tT, EOUT);
  const FA: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#6a7a8a', topD: '#4a5a6a', bottom: '#4a4038', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const MO: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#3a3a4a', topD: '#26262e', bottom: '#2a2a34', headC: '#2a2a34', headD: '#1a1a22', rim: '#fffbe8' };
  const GI: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#c96b8a', topD: '#a04a6a', bottom: '#c96b8a', headC: '#e0b040', headD: '#a8802a', rim: '#fffbe8' };
  const BO: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#d8d0bc', topD: '#a8a08c', bottom: '#5a5040', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const TX = -330, TY = VS.ground + 20;
  // father lifts the rolled mattress from his shoulder up onto the bed
  const fX = 960, fH = 640;
  const mat = { x: lerp(930, 820, heave), y: lerp(700, 780, heave) };
  const fHand: [number, number] = [(fX - mat.x) / (fH / 1000) + 20, (mat.y + 40 - VS.ground) / (fH / 1000)];
  // mother pulls the rope over the load
  const mX = 470, mH = 620;
  const mHand: [number, number] = [120 - 60 * pull, -900 + 200 * pull];
  const mh = toFrame(mX, VS.ground, mH, 1, mHand);
  const rope = { x1: 700, y1: 840, cx: lerp(620, 600, pull), cy: lerp(700, 660, pull) };
  const gX = lerp(1180, 1060, clamp01(t2 / sec));
  const cage = toFrame(gX, VS.ground + 60, 420, -1, [150, -600]);
  const cam: Cam = { zoom: 1.16 - 0.14 * EIO(t / sec), dx: 0, dy: 0, ox: 560, oy: 1050 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="village/street" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <g transform={`translate(${TX} ${TY}) scale(1.9) translate(${-TX} ${-TY})`}>
            <Pickup x={TX} y={TY} bounce={2 * Math.abs(decay(t, tT, 6, 30))} />
            <Load x={TX} y={TY} />
          </g>
          <path d={`M${rope.x1} ${rope.y1} Q${rope.cx} ${rope.cy} ${mh[0]} ${mh[1]}`} stroke="#c9a870" strokeWidth={6} fill="none" />
          <path d={`M380 840 Q${lerp(440, 460, pull)} ${lerp(640, 600, pull)} ${mh[0]} ${mh[1]}`} stroke="#c9a870" strokeWidth={5} fill="none" />
          <Side x={mX} y={VS.ground} h={mH} pal={MO} head="scarf" skirt lean={-8 * pull} handN={mHand} handF={[mHand[0] + 20, mHand[1] + 20]} bob={3 * Math.sin(t2 * 2.4)} rimO={0.5} />
          <g transform={`translate(${mat.x} ${mat.y}) rotate(${-10 + 10 * heave})`}>
            <rect x={-160} y={-50} width={320} height={100} rx={50} fill="#5a7aa8" />
            <path d="M-80 -50 L-80 50 M0 -50 L0 50 M80 -50 L80 50" stroke="#e8ecf2" strokeWidth={10} />
            <ellipse cx={-160} cy={0} rx={22} ry={50} fill="#3e5a86" />
          </g>
          <Side x={fX} y={VS.ground} h={fH} dir={-1} pal={FA} head="short" male lean={10 - 6 * heave} handN={fHand} handF={[fHand[0] + 30, fHand[1] - 20]} bob={6 * bump(t2, 0, 0.6)} rimO={0.5} />
          <Side x={gX} y={VS.ground + 60} h={420} dir={-1} pal={GI} head="bob" skirt handN={[150, -600]} handF={[140, -620]} footN={[30 * Math.sin(t2 * 8), 0]} footF={[-30 * Math.sin(t2 * 8), 0]} bob={6 * Math.abs(Math.sin(t2 * 8))} rimO={0.5} />
          <g transform={`translate(${cage[0]} ${cage[1]})`}>
            <rect x={-60} y={-10} width={120} height={90} rx={10} fill="none" stroke="#6a4e32" strokeWidth={5} />
            {[-30, 0, 30].map((x) => <path key={x} d={`M${x} -10 L${x} 80`} stroke="#6a4e32" strokeWidth={4} />)}
            <ellipse cx={4} cy={44} rx={34} ry={26} fill="#c96b3a" /><circle cx={30} cy={26} r={12} fill="#c96b3a" /><path d="M40 24 L50 28 L40 32 Z" fill="#e0b040" />
          </g>
          {[0, 1, 2].map((i) => { const u = (t * 0.3 + i / 3) % 1; return <Puff key={i} id={`vsd${i}`} x={300 + i * 250 + 60 * u} y={1260 - 40 * u} r={30 + 40 * u} c="#e2cfa8" o={0.4 * (1 - u)} />; })}
        </Fr>
      </Live>
      <Live k={1.25} cam={cam}>
        <Fr>
          <HandPump x={210} y={1480} handle={pump} />
          <Side x={30} y={1520} h={560} pal={BO} head="short" male lean={10 + 12 * pump} handN={[300, -560 + 160 * pump]} handF={[290, -540 + 160 * pump]} rimO={0.5} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 6: the tanker is mobbed; a labourer empties his coins into the driver's palm, the last coin on "work"; a can is handed down ============ */
export const S06: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tW = wordAt(6, /^work/i, 0.73);
  const LA: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#9a948a', topD: '#7a746a', bottom: '#6a6458', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const DR: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#3a4a3a', topD: '#26322a', bottom: '#2a2a32', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const palm = { x: 380, y: 1000 };
  const coins = 7;
  const tilt = ramp(t2, 0.2, tW, EIO);
  const dropT = (i: number) => lerp(0.35, tW, i / (coins - 1)) - 0.18;
  const give = ramp(t2, tW + 0.12, Math.min(sec, tW + 0.55), EOUT);
  const lX = 600, lH = 900;
  const lHand: [number, number] = [(lX - (palm.x + 30)) / (lH / 1000), (palm.y - 70 - VS.ground - 250) / (lH / 1000)];
  const can = { x: lerp(330, 470, give), y: lerp(940, 1120, give) };
  const cam: Cam = { zoom: 1.12 + 0.14 * EIO(t / sec), dx: 0, dy: 0, ox: 440, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="village/street" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Tanker x={60} y={VS.ground + 40} />
          {/* the mob: heads + shoulders, arms raised with jerrycans */}
          {Array.from({ length: 7 }, (_, i) => {
            const x = 660 + i * 85 + (i % 2) * 20, by = 1000 + (i % 3) * 40, up = 0.5 + 0.5 * Math.sin(t2 * 5 + i * 1.7);
            const c = ['#5a5a6a', '#6a4a3a', '#3a4a5a', '#7a6a4a'][i % 4];
            const hx = x - 30 + 10 * Math.sin(i), hy = by - 300 - 80 * up;
            return (
              <g key={i}>
                <ellipse cx={x} cy={by + 160} rx={90} ry={170} fill={c} />
                <path d={`M${x - 30} ${by + 20} L${hx} ${hy + 40}`} stroke={c} strokeWidth={34} strokeLinecap="round" />
                <circle cx={x} cy={by - 30} r={50} fill="#5e3b2e" />
                <path d={`M${x - 50} ${by - 40} Q${x} ${by - 100} ${x + 50} ${by - 40} Z`} fill="#14121a" />
                <circle cx={hx} cy={hy + 34} r={18} fill="#8a5a44" />
                <rect x={hx - 45} y={hy - 80} width={90} height={110} rx={12} fill={['#3f7fb8', '#e0b040', '#d8d4c4'][i % 3]} transform={`rotate(${-10 + (i % 4) * 6} ${hx} ${hy})`} />
              </g>
            );
          })}
          {/* the driver's arm out of the cab window, palm up */}
          <path d={`M230 950 L${palm.x - 30} ${palm.y + 20}`} stroke={DR.top} strokeWidth={44} strokeLinecap="round" />
          <path d={`M${palm.x - 50} ${palm.y + 18} Q${palm.x} ${palm.y + 50} ${palm.x + 56} ${palm.y + 10} Q${palm.x + 10} ${palm.y + 26} ${palm.x - 50} ${palm.y + 18} Z`} fill={DR.skin} />
          {/* coins: piled in the palm + falling */}
          {Array.from({ length: coins }, (_, i) => {
            const d0 = dropT(i), u = clamp01((t2 - d0) / 0.18);
            if (t2 < d0) return null;
            const y = lerp(palm.y - 60, palm.y + 14 - (i % 3) * 5, u * u);
            return <ellipse key={i} cx={palm.x + 6 + ((i * 11) % 30) - 15} cy={y} rx={13} ry={u < 1 ? 13 : 6} fill="#d9a441" stroke="#9a6a1c" strokeWidth={2} />;
          })}
          {give > 0 && <rect x={can.x - 50} y={can.y - 60} width={100} height={120} rx={12} fill="#3f7fb8" />}
          <Side x={lX} y={VS.ground + 250} h={lH} dir={-1} pal={LA} head="short" male lean={14 - 4 * give} handN={give > 0.2 ? [(lX - can.x) / 0.9, (can.y - VS.ground - 250) / 0.9] : lHand} handF={[lHand[0] - 20, lHand[1] + 40]} headTilt={10} bob={3 * Math.sin(t2 * 3)} rimO={0.5} />
          {/* cement dust on his sleeve + back */}
          {[[640, 1020], [610, 1100], [660, 1180], [700, 1060]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10 + (i % 2) * 6} fill="#e8e4dc" opacity={0.6} />)}
          <rect x={-200} y={-300} width={1500} height={2600} fill="#fff4dc" opacity={0.05 + 0.02 * Math.sin(t * 3)} />
          {tilt > 2 && null}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 9: shaded courtyard; the old man's beads stop on "remember"; he lifts his eyes toward the river ============ */
export const S09: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tR = wordAt(9, /^remember/i, 0.61);
  const moving = t2 < tR;
  const shift = (moving ? t2 : tR) * 1.6;
  const lift = ramp(t2, tR, Math.min(sec, tR + 0.6), EIO);
  const X = 380, H = 920, Y = 1140 + 470 * (H / 1000);
  const lean = 6 - 4 * lift;
  const hn = toFrame(X, Y, H, 1, [180, -520]);
  const hp = leanPt(X, Y, H, 1, lean, [22, -930]);
  const tilt = 12 - 20 * lift;
  const cam: Cam = { zoom: 1.08 + 0.14 * EIO(t / sec), dx: 0, dy: 0, ox: 480, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#d8c39a' }}>
      <BandImg id="village/courtyard-day" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Side x={X} y={Y} h={H} pal={OLD} head="short" male sit lean={lean} headTilt={tilt} handN={[180, -520]} handF={[160, -500]} bob={2 * Math.sin(t2 * 1.6)} rimO={0.6} />
          <CapBeard hx={hp[0]} hy={hp[1]} s={H / 1000} dir={1} tilt={lean * 0.5 + tilt} />
          <Beads x={hn[0] + 4} y={hn[1] - 30} shift={shift} />
          {Array.from({ length: 10 }, (_, i) => { const u = (t * 0.05 + i * 0.1) % 1; return <circle key={i} cx={760 + ((i * 97) % 280)} cy={700 + u * 500} r={3} fill="#fff8e0" opacity={0.5 * Math.sin(Math.PI * u)} />; })}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 10: lamplight; the old man tells three grandchildren; his hands trace a mountain, peaking on "gold"; the lamp flickers ============ */
export const S10: React.FC = () => {
  const { t, t2, sec } = useShot();
  const tG = wordAt(10, /^gold/i, 0.85);
  const X = 300, H = 900, Y = 1250 + 470 * (H / 1000);
  // hands rise from low and apart to the peak, meeting above his head on "gold"
  const u = ramp(t2, tG - 1.2, tG, EIO);
  const after = ramp(t2, tG + 0.1, tG + 0.6, EOUT);
  const hN: [number, number] = [lerp(360, 250, u) + 60 * after, lerp(-520, -1060, u) + 300 * after];
  const hF: [number, number] = [lerp(140, 230, u), lerp(-500, -1040, u) + 300 * after];
  const hp = leanPt(X, Y, H, 1, 4, [22, -930]);
  const KIDS: Pal[] = [
    { skin: '#9a6650', skinD: '#6a4434', top: '#c96b4a', topD: '#a04a2e', bottom: '#4a3a3a', headC: '#14121a', headD: '#14121a', rim: '#ffcf86' },
    { skin: '#8a5a44', skinD: '#5e3b2e', top: '#e0b040', topD: '#a8802a', bottom: '#e0b040', headC: '#3a5a7a', headD: '#2a4060', rim: '#ffcf86' },
    { skin: '#a06c52', skinD: '#6e4636', top: '#5a8a6a', topD: '#3e6a4a', bottom: '#3a3a4a', headC: '#14121a', headD: '#14121a', rim: '#ffcf86' },
  ];
  const cam: Cam = { zoom: 1.08 + 0.1 * EIO(t / sec), dx: 0, dy: 0, ox: 540, oy: 1050 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b16' }}>
      <BandImg id="village/courtyard-night" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <OilLamp x={560} y={1400} t={t} />
          <Side x={X} y={Y} h={H} pal={OLD} head="short" male sit lean={4} headTilt={-6 * u} handN={hN} handF={hF} bob={2 * Math.sin(t2 * 1.8)} rimO={0.8} />
          <CapBeard hx={hp[0]} hy={hp[1]} s={H / 1000} dir={1} tilt={2 - 6 * u} />
          {[[700, 560], [830, 500], [950, 540]].map(([x, hh], i) => (
            <Side key={i} x={x} y={1420 + 0.47 * hh} h={hh} dir={-1} pal={KIDS[i]} head={i === 1 ? 'scarf' : 'short'} skirt={i === 1} male={i !== 1} sit headTilt={-10 * u - 4} handN={[150, -480]} handF={[130, -470]} bob={3 * Math.sin(t2 * 2 + i)} rimO={0.9} />
          ))}
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 12: tea stall; one mimics the old man's mountain, the others burst out laughing and slap the table on "laughed" ============ */
export const S12: React.FC = () => {
  const { t, t2 } = useShot();
  const tL = wordAt(12, /^laughed/i, 0.43);
  const slap = ramp(t2, tL - 0.12, tL, EOUT);
  const laugh = ramp(t2, tL - 0.2, tL + 0.1, EOUT);
  const shake = Math.abs(Math.sin(t2 * 14)) * laugh;
  const j = decay(t, tL, 9, 40);
  const P1: Pal = { skin: '#8a5a44', skinD: '#5e3b2e', top: '#c9c2b2', topD: '#9a9282', bottom: '#4a4a52', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const P2: Pal = { skin: '#9a6650', skinD: '#6a4434', top: '#4a6a8a', topD: '#344e6a', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const P3: Pal = { skin: '#a06c52', skinD: '#6e4636', top: '#8a4a3a', topD: '#6a3428', bottom: '#2e2c34', headC: '#14121a', headD: '#14121a', rim: '#fffbe8' };
  const mime = 0.5 + 0.5 * Math.sin(t2 * 6);
  const cam: Cam = { zoom: 1.06, dx: 10 - 20 * t / 1.4, dy: 0, tx: 5 * j, ty: 8 * j, ox: 540, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="village/teastall" cam={cam} />
      <Live cam={cam}>
        <Fr>
          <Front x={560} y={1500} h={820} pal={P2} head="short" handL={[lerp(-180, -150, slap), lerp(-500, -460, slap)]} handR={[lerp(180, 190, slap), lerp(-760, -460, slap)]} tilt={-14 * laugh + 4 * shake} headDy={-10 * laugh} eyes="down" mouth={0.2 + 0.8 * laugh} bob={8 * shake} rimO={0.4} />
          <Front x={850} y={1500} h={800} pal={P3} head="short" handL={[lerp(-190, -140, slap), lerp(-760, -460, slap)]} handR={[180, -480]} tilt={12 * laugh - 4 * shake} headDy={-10 * laugh} eyes="down" mouth={0.2 + 0.8 * laugh} bob={8 * shake} rimO={0.4} />
          <StallTable jump={18 * Math.max(0, j)} />
          <Side x={240} y={1480} h={880} pal={P1} head="short" male lean={-4 - 6 * laugh} handN={[lerp(220, 260, mime), lerp(-1060, -960, mime)]} handF={[lerp(60, 10, mime), lerp(-1020, -900, mime)]} face={laugh > 0.5 ? 'front' : 'side'} bob={4 * mime} rimO={0.5} />
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};
