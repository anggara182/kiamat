import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, handheld, EIO, EOUT } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { BED, POOL, FIELD, Heat, Boat, Fish, Bucket, GoldPatch, Glint, Goat, Dust } from '../art/banks_art';
import { Figure, walkPose, kneelPose, ikArmA, handA, Pose, Look } from '../art/banks_people';

/* EP06 banks, scorched day. Clocks: camera + environment (heat, dust, glints, the boat once pushed, gold)
 * ON ONES (p/t); people, fish and the goat ON TWOS (p2/t2). */

/** last matching word (S15: "Then the whole village dug." is the second "dug") */
const lastWordAt = (id: number, re: RegExp, fallback: number) => {
  const sp = spanOf(id), ws = sp.shot.words.filter((w) => re.test(w.text));
  return ws.length ? ws[ws.length - 1].start - sp.from / FPS : (fallback * sp.dur) / FPS;
};
const jolt = (t: number, at: number, amp = 8) => (t < at ? 0 : amp * Math.exp(-(t - at) * 9) * Math.sin((t - at) * 46));
const Shovel: React.FC<{ tx: number; ty: number; bx: number; by: number; s?: number }> = ({ tx, ty, bx, by, s = 1 }) => {
  const a = (Math.atan2(by - ty, bx - tx) * 180) / Math.PI, L = Math.hypot(bx - tx, by - ty);
  return <g transform={`translate(${tx} ${ty}) rotate(${a})`}><rect x={0} y={-4 * s} width={L - 60 * s} height={8 * s} fill="#8a6a44" /><path d={`M ${L - 64 * s} ${-15 * s} L ${L - 8 * s} ${-20 * s} Q ${L + 6 * s} 0 ${L - 8 * s} ${20 * s} L ${L - 64 * s} ${15 * s} Z`} fill="#8a8e92" /></g>;
};

/** shot 2 — the old fisherman pushes his boat into the river; there is no water: the hull scrapes and stops dead on "stopped"; he straightens and stares. */
export const S02: React.FC = () => {
  const { t, t2 } = useShot();
  const tS = wordAt(2, /^stopped/i, 0.64);
  const G = BED.ground - 150;
  const bx = 900 + 250 * Math.min(t, tS);
  const stopped = t >= tS;
  const hh = handheld(t, stopped ? 0.25 : 0.9);
  const cam: Cam = { zoom: 1.12, dx: 160 - (bx - 900) * 0.85, dy: 0, tx: hh.hx + jolt(t, tS, 7), ty: hh.hy, ox: 540, oy: 1000 };
  const fx = bx - 150, h = 760;
  const st = ramp(t2, tS + 0.1, tS + 0.6, EIO);
  const base: Pose = stopped
    ? { lean: 34 * (1 - st) + 8 * (t2 < tS + 0.15 ? 1 : 0), head: 16 - 30 * st, thA: 14 * (1 - st), shA: 4, thB: -12 * (1 - st), shB: -10 * (1 - st), uaA: 60, faA: 70, uaB: 50, faB: 60, breath: 0.8 * Math.sin(t2 * 4) }
    : { ...walkPose(t2 * 6.2, false, 0.7), lean: 34, head: 16 };
  // both hands on the stern while pushing; after the stop they come off as he straightens
  const armA = ikArmA(fx, G, h, 1, base, bx + 14, G - 150 + 40 * st, -1);
  const armB = ikArmA(fx, G, h, 1, base, bx + 40 - 90 * st, G - 90 + 40 * st, -1);
  const pose: Pose = { ...base, ...(st < 0.9 ? armA : { uaA: 8, faA: 14 }), ...(st < 0.6 ? { uaB: armB.uaA, faB: armB.faA } : { uaB: -6, faB: 10 }) };
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="banks/bed" cam={cam} />
      <Live cam={cam} w={BED.w}>
        <Heat t={t} y={BED.horizon + 10} />
        {/* scrape marks in the cracked mud behind the hull */}
        <path d={`M 860 ${G + 2} L ${bx + 40} ${G + 2}`} stroke="#5a4028" strokeWidth={8} opacity={0.6} />
        <path d={`M 880 ${G + 12} L ${bx + 60} ${G + 12}`} stroke="#5a4028" strokeWidth={4} opacity={0.4} />
        {!stopped && <ellipse cx={bx + 40} cy={G} rx={70} ry={14} fill="#d8c39a" opacity={0.6} />}
        {stopped && t < tS + 0.6 && <ellipse cx={bx + 360} cy={G - 10} rx={120 + 200 * (t - tS)} ry={30} fill="#d8c39a" opacity={0.6 * (1 - (t - tS) / 0.6)} />}
        <Boat x={bx} y={G} s={1.1} />
        <ellipse cx={fx} cy={G + 4} rx={110} ry={12} fill="#2a2018" opacity={0.3} />
        <Figure x={fx} y={G} h={h} dir={1} pose={pose} look={{ body: '#7a8a8e', far: '#5a6a6e', skin: '#8a5a40', beard: '#7a7068', rim: '#fff6e0', rimO: 0.7 }} />
        <Dust t={t} w={BED.w} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 4 — a shrinking pool full of flopping fish, two kids with buckets at its edge; on "thousands" the camera rises: the fish carpet runs to the horizon. */
export const S04: React.FC = () => {
  const { t, t2 } = useShot();
  const tT = wordAt(4, /^thousands/i, 0.72);
  const rise = ramp(t, tT - 0.3, tT + 0.7, EIO);
  const cam: Cam = { zoom: 1.08 - 0.14 * rise, dx: 0, dy: -560 + 700 * rise, ox: 540, oy: 960 };
  const fr = (k: number) => { const v = Math.sin(k * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const fish = Array.from({ length: 34 }, (_, i) => ({ x: 90 + fr(i) * 1120, y: POOL.edge + 110 + fr(i + 50) * 430, s: 0.9 + (i % 4) * 0.22, ph: i * 1.7, rot: fr(i + 99) * 70 - 35 }));
  const kid = (x: number, dir: number, look: Look, point: boolean, i: number) => {
    const G = POOL.edge + 70, h = 500;
    const pose: Pose = { lean: 8, head: 22, thA: 4, shA: 2, thB: -4, shB: -4, uaA: point ? 70 + 6 * Math.sin(t2 * 6) : 14, faA: point ? 76 : 30, uaB: 6, faB: 10, breath: 0.6 * Math.sin(t2 * 3 + i) };
    const [bxh, byh] = handA(x, G, h, dir, { ...pose, uaA: pose.uaB, faA: pose.faB });
    return <g key={i}><ellipse cx={x} cy={G + 4} rx={70} ry={8} fill="#2a2018" opacity={0.3} /><Bucket x={bxh} y={byh} s={1.1} col={i ? '#c94f3d' : '#4f7a9a'} sw={Math.sin(t2 * 3 + i) * 4} /><Figure x={x} y={G} h={h} dir={dir} pose={pose} look={look} /></g>;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="banks/pool" cam={cam} />
      <Live cam={cam} h={POOL.h}>
        {/* twinkles across the far fish carpet */}
        {Array.from({ length: 110 }, (_, i) => { const y = POOL.horizon + 14 + ((i * 53) % 1350), x = (i * 211 + (i % 7) * 37) % 1296, k = Math.max(0, Math.sin(t * 5 + i * 1.3)); return <circle key={i} cx={x} cy={y} r={1.5 + (y - POOL.horizon) / 400 + 4 * k} fill="#ffffff" opacity={0.85 * k} />; })}
        {fish.map((f, i) => <Fish key={i} x={f.x} y={f.y} s={f.s} ph={t2 * (7 + (i % 4)) + f.ph} rot={f.rot} />)}
        {fish.map((f, i) => { const k = Math.max(0, Math.sin(t * 6 + i * 2.1)); return <circle key={`g${i}`} cx={f.x + 6} cy={f.y - 8} r={2 + 5 * k} fill="#ffffff" opacity={0.9 * k} />; })}
        {kid(300, 1, { body: '#4f6f8a', far: '#3a5268', skin: '#a8765a', hat: 'cap', hatCol: '#d8d0c0' }, true, 0)}
        {kid(990, -1, { body: '#c9a06a', far: '#9a7a50', skin: '#9a6a4e', hat: 'hijab', hatCol: '#6a5a7a', skirt: true }, false, 1)}
        <Heat t={t} y={POOL.horizon + 6} w={1296} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — a farmer kneels in a dead field and crumbles a dry stalk; the dust blows off his palm on "grew"; his son stands behind with an empty bucket. Slow push-in. */
export const S08: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tG = wordAt(8, /^grew/i, 0.85);
  const cam: Cam = { zoom: 1.03 + 0.09 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 1150 };
  const G = FIELD.ground, fx = 620, h = 760;
  const open = ramp(t2, tG - 0.05, tG + 0.12, EOUT);
  const base: Pose = { ...kneelPose(14, 30, 0.6 * Math.sin(t2 * 2.4)) };
  const grind = Math.sin(t2 * 9) * (1 - open);
  const hand: [number, number] = [fx + 0.27 * h, G - 0.44 * h - 30 * open];
  const armA = ikArmA(fx, G, h, 1, base, hand[0], hand[1], -1);
  const pose: Pose = { ...base, ...armA, uaB: 50, faB: 40 };
  const [hx, hy] = handA(fx, G, h, 1, pose);
  const blow = Math.max(0, t - tG);
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="banks/field" cam={cam} />
      <Live cam={cam}>
        {/* son behind with an empty bucket */}
        {(() => { const sx = 330, sh = 500; const sp: Pose = { lean: 2, head: 20, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 6, faA: 12, uaB: 8, faB: 16, breath: 0.6 * Math.sin(t2 * 3.2) }; const [bxh, byh] = handA(sx, G - 60, sh, 1, sp); return <g><ellipse cx={sx} cy={G - 56} rx={70} ry={8} fill="#2a2018" opacity={0.3} /><Bucket x={bxh} y={byh} s={1.1} col="#8a8e92" sw={Math.sin(t2 * 2.2) * 5} /><Figure x={sx} y={G - 60} h={sh} dir={1} pose={sp} look={{ body: '#8a6a4a', far: '#6a5038', skin: '#a8765a' }} /></g>; })()}
        <ellipse cx={fx + 40} cy={G + 4} rx={170} ry={14} fill="#2a2018" opacity={0.3} />
        <Figure x={fx} y={G} h={h} dir={1} pose={pose} look={{ body: '#6a5a48', far: '#4a3e30', skin: '#8a5a40', hat: 'wrap', hatCol: '#e2dccc', beard: '#9a948c', rim: '#fff6e0', rimO: 0.6 }} />
        {/* the dry stalk in his fist; crumbs fall while he grinds; on "grew" the palm opens and the dust blows away */}
        {open < 0.5 && <path d={`M ${hx} ${hy} l ${30 + grind * 4} ${-70} M ${hx} ${hy} l ${-6} ${40}`} stroke="#7a5e3a" strokeWidth={6} strokeLinecap="round" />}
        {open > 0 && <ellipse cx={hx + 10} cy={hy - 4} rx={30} ry={9} fill="#8a5a40" />}
        {Array.from({ length: 26 }, (_, i) => {
          if (open <= 0) { const u = ((t * 1.5 + i / 26) % 1); return i < 8 ? <rect key={i} x={hx - 4 + (i % 3) * 4} y={hy + u * 0.44 * h} width={4} height={4} fill="#9a7a52" opacity={1 - u} /> : null; }
          const x = hx + 10 + blow * (120 + i * 18) + Math.sin(t * 3 + i) * 10, y = hy - 10 - blow * (20 + (i % 5) * 16) + (i % 7) * 4;
          return <circle key={i} cx={x} cy={y} r={3 + (i % 4)} fill="#c4a47a" opacity={Math.max(0, 0.9 - blow * 0.5)} />;
        })}
        <Dust t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 13 — a girl runs after her goat across the riverbed; she stops dead and turns as a gold glint flares in the mud on "shine". Track, then stop. */
export const S13: React.FC = () => {
  const { t, t2 } = useShot();
  const tS = wordAt(13, /^shine/i, 0.78);
  const G = BED.ground - 130, h = 580;
  const gx = 420 + 300 * Math.min(t2, tS);
  const stopped = t2 >= tS;
  const turn = ramp(t2, tS, tS + 0.17);
  const dir = turn < 0.5 ? 1 : -1;
  const cam: Cam = { zoom: 1.12, dx: 700 - 300 * Math.min(t, tS), dy: 0, ox: 540, oy: 1000 };
  const pose: Pose = stopped ? { lean: 6 + 10 * turn, head: 12, thA: 6, shA: 2, thB: -6, shB: -6, uaA: 20 + 30 * turn, faA: 40 + 30 * turn, uaB: 10, faB: 20, breath: 1.2 * Math.sin(t2 * 6) } : { ...walkPose(t2 * 13, false, 1.35), lean: 14 };
  const goatX = 760 + 340 * Math.min(t2, tS) + 50 * Math.max(0, Math.min(t2 - tS, 0.8));
  const goatRun = t2 < tS + 0.5;
  const glX = gx - 300 + (stopped ? 0 : 0), glintX = 420 + 300 * tS - 240, glintK = Math.max(ramp(t, tS - 0.5, tS - 0.3) * 0.25, ramp(t, tS - 0.05, tS + 0.1) * (1 - 0.4 * ramp(t, tS + 0.4, tS + 1.2)));
  void glX;
  const sq = 1 - 0.2 * Math.sin(turn * Math.PI);
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="banks/bed" cam={cam} />
      <Live cam={cam} w={BED.w}>
        <Heat t={t} y={BED.horizon + 10} />
        <Goat x={goatX} y={G - 30} s={1.9} t2={t2} run={goatRun} />
        <Glint x={glintX} y={G + 50} k={glintK} s={1.6} />
        <ellipse cx={gx} cy={G + 4} rx={60} ry={8} fill="#2a2018" opacity={0.3} />
        <g transform={`translate(${gx} 0) scale(${sq} 1) translate(${-gx} 0)`}>
          <Figure x={gx} y={G} h={h} dir={dir} pose={pose} look={{ body: '#a85a48', far: '#7a3e32', skin: '#9a6a4e', hat: 'braids', hatCol: '#2a1e18', skirt: true, rim: '#fff6e0', rimO: 0.6 }} />
        </g>
        {!stopped && <ellipse cx={gx - 40} cy={G} rx={40} ry={10} fill="#d8c39a" opacity={0.6} />}
        <Dust t={t} w={BED.w} />
      </Live>
    </AbsoluteFill>
  );
};

/** top-down small hand (back of the hand, fingers pointing up), forearm running to the bottom of the frame */
const TopChildHand: React.FC<{ x: number; y: number; side: number; curl: number }> = ({ x, y, side, curl }) => {
  const sk = '#b07a5a', sh = '#8a5a40', kn = '#6a4030';
  return (
    <g>
      <path d={`M ${x - 46} ${y + 80} L ${x - 60 + side * 40} 2400 L ${x + 70 + side * 40} 2400 L ${x + 50} ${y + 80} Z`} fill={sh} />
      <path d={`M ${x - 40} ${y + 80} L ${x - 50 + side * 40} 2400 L ${x + side * 40} 2400 L ${x} ${y + 80} Z`} fill={sk} opacity={0.6} />
      {/* thumb on the inner side */}
      <path d={`M ${x - side * 46} ${y + 30} Q ${x - side * 86} ${y - 6} ${x - side * 80} ${y - 40} Q ${x - side * 66} ${y - 50} ${x - side * 56} ${y - 26} Q ${x - side * 50} ${y} ${x - side * 34} ${y + 12} Z`} fill={sk} />
      {/* four fingers, separated, shortening as they curl into the mud */}
      {[-30, -10, 10, 30].map((d, i) => { const L = (66 - Math.abs(i - 1.5) * 8) * (1 - 0.35 * curl); return <g key={i}><rect x={x + d - 9} y={y - 40 - L} width={18} height={L + 20} rx={9} fill={sk} /><rect x={x + d - 9} y={y - 40 - L} width={18} height={14} rx={7} fill="#5a3e26" opacity={0.75} /></g>; })}
      <path d={`M ${x - 48} ${y - 40} Q ${x} ${y - 52} ${x + 48} ${y - 40} L ${x + 50} ${y + 80} L ${x - 46} ${y + 80} Z`} fill={sk} />
      <path d={`M ${x - 40} ${y - 36} Q ${x} ${y - 46} ${x + 40} ${y - 36}`} stroke={kn} strokeWidth={4} fill="none" opacity={0.6} />
    </g>
  );
};

/** shot 14 — top-down: her small hands scrape the mud away; a smooth raw-gold edge widens under her fingers; on "end" the hands stop, the gold runs past both edges. */
export const S14: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tE = wordAt(14, /^end/i, 0.76);
  const cam: Cam = { zoom: 1.02 + 0.04 * p, dx: 0, dy: 0, ox: 540, oy: 960 };
  const grow = ramp(t, 0, tE, (n) => n * n * (3 - 2 * n));
  const w = 160 + 1500 * grow, hgt = Math.min(760, 70 + 0.45 * w);
  const cx = 648, cy = 1080;
  const stroke = t2 < tE ? Math.sin(t2 * 12) : 0;
  const reach = Math.min(400, w * 0.36);
  return (
    <AbsoluteFill style={{ backgroundColor: '#9a7650' }}>
      <BandImg id="banks/top" cam={cam} />
      <Live cam={cam}>
        <GoldPatch x={cx} y={cy} w={w} h={hgt} t={t} />
        {/* scraped mud crumbs thrown aside */}
        {Array.from({ length: 14 }, (_, i) => { const s = i % 2 ? 1 : -1, u = ((t * 1.4 + i / 14) % 1); return t2 < tE ? <ellipse key={i} cx={cx + s * (reach + 60 + u * 120)} cy={cy + 160 + (i % 5) * 30 - u * 40} rx={10} ry={7} fill="#5a3e26" opacity={1 - u} /> : null; })}
        <g transform={`translate(${cx - reach - 20 * stroke} ${cy + 200}) scale(1.7) translate(${-(cx - reach - 20 * stroke)} ${-(cy + 200)})`}><TopChildHand x={cx - reach - 20 * stroke} y={cy + 200} side={-1} curl={0.5 + 0.5 * stroke} /></g>
        <g transform={`translate(${cx + reach + 20 * stroke} ${cy + 200}) scale(1.7) translate(${-(cx + reach + 20 * stroke)} ${-(cy + 200)})`}><TopChildHand x={cx + reach + 20 * stroke} y={cy + 200} side={1} curl={0.5 - 0.5 * stroke} /></g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 15 — her father digs beside her (on "father"); behind them dozens of villagers run down the bank with shovels, hoes and bare hands, and hit the riverbed on "dug". Slow pull-back. */
export const S15: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tF = wordAt(15, /^father/i, 0.1);
  const tD = lastWordAt(15, /^dug/i, 0.78);
  const cam: Cam = { zoom: 1.28 - 0.26 * ramp(p, 0, 1, EIO), dx: -60, dy: 0, ox: 560, oy: 1150 };
  const G = BED.ground + 40;
  // father digging with a shovel: first strike on "father"
  const fx = 1460, fh = 640; // blade lands right of the gold, well away from the girl
  const ph = Math.max(0, t2 - tF + 0.35) / 0.9;
  const u = ph % 1, push = u < 0.4 ? EIO(u / 0.4) : 1 - EIO((u - 0.4) / 0.6);
  const T: [number, number] = [fx - (0.1 + 0.08 * push) * fh, G - (0.66 - 0.14 * push) * fh], B: [number, number] = [fx - 0.44 * fh, G - (0.04 + 0.3 * (1 - push)) * fh];
  const fBase: Pose = { lean: 12 + 14 * push, head: 20, thA: 10, shA: 4, thB: -8, shB: -8, uaA: 40, faA: 60, uaB: 40, faB: 60 };
  const mid: [number, number] = [T[0] + (B[0] - T[0]) * 0.4, T[1] + (B[1] - T[1]) * 0.4];
  const aN = ikArmA(fx, G, fh, -1, fBase, mid[0], mid[1], -1), aF = ikArmA(fx, G, fh, -1, fBase, T[0], T[1], -1);
  const fPose: Pose = { ...fBase, ...aN, uaB: aF.uaA, faB: aF.faA };
  // villagers run down a visible earth bank (feet on the slope, dust), then spread over the bed behind the father on the 2nd "dug"
  const slopeTop: [number, number] = [860, 900], slopeBot: [number, number] = [1300, 1150];
  const slopeY = (x: number) => (x <= slopeTop[0] ? slopeTop[1] : x >= slopeBot[0] ? slopeBot[1] : slopeTop[1] + ((x - slopeTop[0]) / (slopeBot[0] - slopeTop[0])) * (slopeBot[1] - slopeTop[1]));
  // a loose diagonal stream: each villager has its own place in the line (gap along the path), its own depth row and bed spot
  const NV = 12, GAP = 78, V = (440 + (NV - 1) * GAP + 260) / Math.max(1.2, tD);
  const crowd = Array.from({ length: NV }, (_, i) => ({ s0: -i * GAP, row: i % 3, x1: 1060 + ((i * 5) % NV) * 70, y1: 1170 + (i % 3) * 55, tool: i % 3 }));
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="banks/bed" cam={cam} />
      <Live cam={cam} w={BED.w}>
        <Heat t={t} y={BED.horizon + 10} />
        {/* the near bank: an earth slope running down onto the riverbed */}
        <polygon points={`200,${slopeTop[1] - 120} ${slopeTop[0]},${slopeTop[1]} ${slopeBot[0]},${slopeBot[1]} ${slopeBot[0] + 80},${slopeBot[1] + 40} 200,${slopeBot[1] + 40}`} fill="#b08a62" />
        <path d={`M 200 ${slopeTop[1] - 120} L ${slopeTop[0]} ${slopeTop[1]} L ${slopeBot[0]} ${slopeBot[1]} L ${slopeBot[0] + 80} ${slopeBot[1] + 40}`} stroke="#d8c39a" strokeWidth={6} fill="none" />
        {[[700, 1010], [900, 1060], [1100, 1110]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} l 80 30`} stroke="#8a6a48" strokeWidth={4} opacity={0.6} />)}
        {crowd.map((c, i) => {
          const sp = c.s0 + V * t2; // distance travelled along the path from the slope top
          const onSlope = sp < 440, rowY = c.row * 26;
          const xs = slopeTop[0] + Math.min(sp, 440);
          const bedK = clamp01((sp - 440) / 260);
          const arrived = bedK >= 1;
          const x = onSlope ? xs : slopeBot[0] - 40 + (c.x1 - slopeBot[0] + 40) * bedK;
          const y = (onSlope ? slopeY(xs) : slopeBot[1] + (c.y1 - slopeBot[1]) * bedK) + rowY;
          if (sp < -120) return null; // still beyond the crest
          const h = 270 + 90 * Math.max(0, (y - 900) / 300) + c.row * 12;
          const pose: Pose = arrived ? { lean: 40 + 10 * Math.sin(t2 * 8 + i), head: 20, thA: 14, shA: 4, thB: -8, shB: -8, uaA: 70 + 40 * Math.sin(t2 * 8 + i), faA: 60, uaB: 50, faB: 40 } : { ...walkPose(t2 * 13 + i, false, 1.35), lean: onSlope ? 4 : 16, uaA: c.tool < 2 ? 140 : 50, faA: c.tool < 2 ? 160 : 80 };
          const [hx, hy] = handA(x, y, h, 1, pose);
          const L = 0.62 * h;
          const tool = c.tool === 0
            ? <g><path d={`M ${hx} ${hy} l ${arrived ? 0.3 * L : -0.45 * L} ${arrived ? 0.9 * L : -0.8 * L}`} stroke="#8a6a44" strokeWidth={6} /><rect x={hx + (arrived ? 0.3 * L : -0.45 * L) - 12} y={hy + (arrived ? 0.9 * L : -0.8 * L) - 6} width={24} height={30} rx={4} fill="#8a8e92" /></g>
            : c.tool === 1
              ? <g><path d={`M ${hx} ${hy} l ${arrived ? 0.35 * L : -0.4 * L} ${arrived ? 0.85 * L : -0.85 * L}`} stroke="#8a6a44" strokeWidth={6} /><path d={`M ${hx + (arrived ? 0.35 * L : -0.4 * L) - 4} ${hy + (arrived ? 0.85 * L : -0.85 * L)} l 36 14`} stroke="#8a8e92" strokeWidth={10} strokeLinecap="round" /></g>
              : null;
          return (
            <g key={i}>
              <ellipse cx={x} cy={y + 3} rx={h * 0.16} ry={h * 0.025} fill="#2a2018" opacity={0.3} />
              {!arrived && <ellipse cx={x - h * 0.15} cy={y - 4} rx={h * 0.12} ry={h * 0.035} fill="#d8c39a" opacity={0.7} />}
              {tool}
              <Figure x={x} y={y} h={h} dir={1} pose={pose} look={{ body: ['#6a5a48', '#4f6f8a', '#8a6a4a', '#7a3e32', '#3a4a3a'][i % 5], far: '#3a2e24', skin: '#8a5a40', hat: i % 4 === 0 ? 'wrap' : i % 4 === 2 ? 'hijab' : null, hatCol: i % 4 === 0 ? '#e2dccc' : '#6a5a7a', skirt: i % 4 === 2 }} />
            </g>
          );
        })}
        {t2 >= tD && t2 < tD + 0.6 && <ellipse cx={1150} cy={BED.horizon + 100} rx={300 + 300 * (t2 - tD)} ry={40} fill="#d8c39a" opacity={0.5 * (1 - (t2 - tD) / 0.6)} />}
        <GoldPatch x={1010} y={G + 30} w={260} h={74} t={t} />
        {/* the girl kneeling at the gold, scraping */}
        {(() => {
          // the girl kneels at the gold edge and digs with BOTH hands (alternating scoops), solid, fully opaque
          const gx = 860, gh = 470, kp: Pose = { ...kneelPose(38, 34, 0.5 * Math.sin(t2 * 3)) };
          const sw = Math.sin(t2 * 10);
          const aN = ikArmA(gx, G, gh, 1, kp, 935 + 24 * sw, G + 12 - 16 * Math.max(0, sw), -1);
          const aF = ikArmA(gx, G, gh, 1, kp, 965 - 24 * sw, G + 8 - 16 * Math.max(0, -sw), -1);
          return <Figure x={gx} y={G} h={gh} dir={1} pose={{ ...kp, ...aN, uaB: aF.uaA, faB: aF.faA }} look={{ body: '#a85a48', far: '#7a3e32', skin: '#9a6a4e', hat: 'braids', hatCol: '#2a1e18', skirt: true, rim: '#fff6e0', rimO: 0.6 }} />;
        })()}
        <Shovel tx={T[0]} ty={T[1]} bx={B[0]} by={B[1]} s={fh / 600} />
        <ellipse cx={fx} cy={G + 4} rx={110} ry={12} fill="#2a2018" opacity={0.3} />
        <Figure x={fx} y={G} h={fh} dir={-1} pose={fPose} look={{ body: '#5a6a5a', far: '#3e4a3e', skin: '#8a5a40', hat: 'wrap', hatCol: '#e2dccc', beard: '#3a2a20', rim: '#fff6e0', rimO: 0.6 }} />
        {t2 > tF - 0.05 && push > 0.85 && <ellipse cx={B[0]} cy={G} rx={60} ry={14} fill="#d8c39a" opacity={0.6} />}
        <Dust t={t} w={BED.w} />
      </Live>
    </AbsoluteFill>
  );
};
