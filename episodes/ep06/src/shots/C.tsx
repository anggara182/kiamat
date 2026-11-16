import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { rng } from '../art/world';
import { CROWD, CrowdFig, Boat, Aerial } from '../art/riverbed_art';
import { GM } from '../art/riverbed_gold';
import { FatherBoy, Boatman, CapOldMan, Villager, KneelWoman, SlideKid, GirlGoat } from '../art/riverbed_people';

/** y of the gold mountain's top edge at x (smooth base curve of the rough edge) */
const goldY = (x: number) => { const f = (x - (GM.cx - GM.w / 2)) / GM.w; return GM.top + (GM.base - GM.top) * Math.pow(Math.abs(f - 0.47) * 2, 1.8); };
/** soft star flare (glint) */
const Flare: React.FC<{ x: number; y: number; s: number; a: number; col?: string }> = ({ x, y, s, a, col = '#fff6d0' }) => (
  <g opacity={a}>
    <defs><radialGradient id="rbFl" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={col} stopOpacity={0.9} /><stop offset="0.25" stopColor="#ffe08a" stopOpacity={0.4} /><stop offset="1" stopColor="#ffe08a" stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={60 * s} fill="url(#rbFl)" />
    <path d={`M${x - 90 * s} ${y} L${x + 90 * s} ${y} M${x} ${y - 70 * s} L${x} ${y + 70 * s}`} stroke={col} strokeWidth={2.5 * s} strokeOpacity={0.8} />
    <circle cx={x} cy={y} r={6 * s} fill="#ffffff" />
  </g>
);
/** rising heat shimmer bands (environment) */
const Haze: React.FC<{ t: number; y0: number; y1: number; col: string }> = ({ t, y0, y1, col }) => (
  <g>{Array.from({ length: 7 }).map((_, i) => { const k = ((t * 0.12 + i / 7) % 1); const y = y1 - k * (y1 - y0); return <path key={i} d={`M-100 ${y} Q300 ${y - 8 + Math.sin(t * 3 + i) * 6} 650 ${y} T1400 ${y}`} stroke={col} strokeWidth={10} strokeOpacity={0.12 * Math.sin(k * Math.PI)} fill="none" />; })}</g>
);

/** shot 1 — HOOK (flash-forward): thousands line the high banks of the dry bed, frozen, staring at one gold glint that flares on "Euphrates"; a man lifts a boy onto his shoulders. Very slow push-in. */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const te = wordAt(1, /^Euphrates/i, 0.11);
  const cam: Cam = { zoom: 1.04 + 0.06 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ty: 60, ox: 540, oy: 1140 };
  const flare = 0.6 + 0.4 * Math.sin(t * 4) * 0.3 + (t >= te ? 1.2 * Math.exp(-(t - te) * 2) : 0);
  const near = CROWD.filter((q) => q.s > 3.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="riverbed/day" k={0.95} cam={cam} />
      <Live k={0.95} cam={cam}>
        {near.map((q, i) => <CrowdFig key={i} x={q.x + Math.sin(t2 * 1.5 + q.ph) * 1.5 * q.s} y={q.y} s={q.s} col={['#5a4a3e', '#3e3430', '#6a5244', '#2e2a2e', '#7a5a46'][q.c]} />)}
        <ellipse cx={648} cy={1336} rx={40} ry={11} fill="#e8b84a" />
        <ellipse cx={642} cy={1333} rx={18} ry={5} fill="#fff0b0" />
        <Flare x={648} y={1330} s={1.0 * flare} a={Math.min(1, flare)} />
        <Haze t={t} y0={1050} y1={1350} col="#fff6e4" />
      </Live>
      <Live k={1.15} cam={cam}>
        <FatherBoy x={930} y={2200} h={760} lift={ramp(t2, 0, 1.7)} sw={t2 * 1.5} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 3 — day: painted boats stranded and tilted on the cracked mud; a young boatman jumps down and his feet crack the crust on "mud" (dust puff, cracks spread). Slow lateral track. */
export const S03: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tm = wordAt(3, /^mud/i, 0.65);
  const cam: Cam = { zoom: 1.55, dx: 50 - 100 * ramp(p, 0, 1, (n) => n), dy: 0, ty: -780, ox: 540, oy: 960 };
  const j = clamp01((t2 - (tm - 0.5)) / 0.5); // jump progress
  const from: [number, number] = [640, 1648], to: [number, number] = [560, 1880];
  const bx = from[0] + (to[0] - from[0]) * j, by = from[1] + (to[1] - from[1]) * j - Math.sin(j * Math.PI) * 120;
  const crouch = j <= 0 ? 0.9 + 0.1 * Math.sin(t2 * 3) : j < 1 ? 0.15 : 1 - 0.5 * ramp(t2, tm + 0.1, tm + 0.6);
  const land = t - tm;
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="riverbed/day" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <Boat x={830} y={1560} L={300} tilt={-8} c1="#3e7a9a" c2="#e2b84a" />
        <Boat x={640} y={1690} L={380} tilt={10} c1="#b84a3a" c2="#3e8a6a" />
        <Boat x={1000} y={1760} L={420} tilt={-14} c1="#2e6a5a" c2="#d8573a" dir={-1} />
        <Boat x={420} y={1580} L={260} tilt={6} c1="#d8b84a" c2="#3e5a9a" />
        {land > 0 && <g>
          {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + 0.3; const L = 140 * ramp(land, 0, 0.35); return <path key={i} d={`M${to[0]} ${to[1]} l${Math.cos(a) * L * 0.6} ${Math.sin(a) * L * 0.18} l${Math.cos(a + 0.4) * L * 0.4} ${Math.sin(a + 0.4) * L * 0.12}`} stroke="#4a3524" strokeWidth={4} fill="none" />; })}
          {[0, 1, 2, 3].map((i) => <ellipse key={`d${i}`} cx={to[0] + (i - 1.5) * 50 * (1 + land * 2)} cy={to[1] - 20 - land * 80 - i * 10} rx={50 + land * 120} ry={24 + land * 40} fill="#d8b48a" opacity={0.6 * Math.max(0, 1 - land * 1.4)} />)}
        </g>}
        <Boatman x={bx} y={by} h={250} crouch={crouch} />
        <ellipse cx={bx} cy={j < 1 && j > 0 ? to[1] : by} rx={50} ry={9} fill="#4a3524" opacity={0.3} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — aerial: the vast desert, the river shrunk to a thin brown thread inside the pale scar of its old bed, tiny trucks on the road; the last shimmer thins on "thread". High, slow drift down. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const tt = wordAt(7, /^thread/i, 0.75);
  const cam: Cam = { zoom: 1.06, dx: 0, dy: 0, ty: 80 - 160 * ramp(p, 0, 1, (n) => n), rot: 2 * p, ox: 540, oy: 960 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#e8d8b4' }}>
      <Live k={1} cam={cam}><Aerial t={t} thin={ramp(t, tt, tt + 0.6)} /></Live>
    </AbsoluteFill>
  );
};

/** shot 11 — night: the empty bed under moonlight; an old man in a white cap stands on the bank looking down, and turns away on "nothing". Upper frame calm for the quote. */
export const S11: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tn = wordAt(11, /^nothing/i, 0.73);
  const cam: Cam = { zoom: 1.2 + 0.03 * p, dx: 0, dy: 0, ty: 420, ox: 540, oy: 1000 };
  const turn = ramp(t2, tn - 0.05, tn + 0.15);
  const step = ramp(t2, tn + 0.15, tn + 1.2, (n) => n);
  const r = rng(5);
  return (
    <AbsoluteFill style={{ backgroundColor: '#03050c' }}>
      <BandImg id="riverbed/night" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <CapOldMan x={250} y={975} h={300} turn={turn} step={step} rim="#a9b8d6" />
        {Array.from({ length: 30 }).map((_, i) => { const x = r() * 1296, y = 1200 + r() * 900; return <circle key={i} cx={x + t * 8} cy={y - t * 4} r={1.5 + r() * 2} fill="#a9b8d6" opacity={0.15 + 0.15 * Math.sin(t * 2 + i)} />; })}
      </Live>
    </AbsoluteFill>
  );
};

const VCOLS = ['#5a4a3e', '#3e4a5a', '#7a5a46', '#4a3a48', '#6a6a52', '#8a4a3a'];

/** shot 16 — day, extreme wide: the raw gold mountain emerging from the mud; villagers tiny on top, stunned, shovels lowered. Glints on "coin" and "nugget"; tilt down, then crane up so the full curve is revealed on "see". */
export const S16: React.FC = () => {
  const { t, t2 } = useShot();
  const tc = wordAt(16, /^coin/i, 0.12), tn = wordAt(16, /^nugget/i, 0.39), ts = wordAt(16, /^see/i, 0.88);
  const down = ramp(t, 0.1, tn, EIO), up = ramp(t, tn, ts, EIO);
  const cam: Cam = { zoom: 1.9 - 0.9 * up, dx: 0, dy: 0, ty: -560 * down * (1 - up), ox: 592, oy: 770 };
  const vs = [-260, -180, -110, -40, 30, 90, 170, 250].map((dx, i) => ({ x: GM.cx + dx, i }));
  const g1 = t >= tc ? Math.exp(-(t - tc) * 2.5) : 0, g2 = t >= tn ? Math.exp(-(t - tn) * 2) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#efe6d2' }}>
      <BandImg id="riverbed/gold" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        {vs.map((v) => <Villager key={v.i} x={v.x} y={goldY(v.x) + 90} h={110} body={VCOLS[v.i % 6]} head="#8a5a44" scarf={v.i % 3 === 1} shovel={v.i % 2 === 0} sw={t2 * 1.4 + v.i} shadow={-30} />)}
        <Flare x={GM.cx - 60} y={goldY(GM.cx - 60) + 70} s={0.5 + g1} a={Math.min(1, 0.3 + g1)} />
        <Flare x={GM.cx + 160} y={GM.top + 420} s={0.6 + 1.2 * g2} a={Math.min(1, 0.2 + g2)} />
        <Flare x={GM.cx - 300} y={GM.top + 360} s={0.4 + 0.3 * Math.sin(t * 3)} a={0.4} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 17 — dawn/sunset: villagers on the gold: an old woman's palm on it, kids sliding down, the girl with two braids and her goat at the centre, long shadows; the low sun flares off the gold on "history". */
export const S17: React.FC = () => {
  const { p, t, t2 } = useShot();
  const th = wordAt(17, /^history/i, 0.86);
  const cam: Cam = { zoom: 1.6 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -260, ox: 520, oy: 960 };
  const fl = t >= th - 0.1 ? ramp(t, th - 0.1, th + 0.25) * (1 - 0.4 * ramp(t, th + 0.4, th + 1)) : 0;
  const slope = (x: number) => goldY(x) + 140;
  const kids = [0, 1].map((i) => { const k = ((t2 * 0.35 + i * 0.5) % 1); const x = 560 - k * 360; return { x, y: slope(x), ang: -24 - 8 * k, i }; });
  const people: [number, number, string, boolean, boolean][] = [[300, 140, VCOLS[0], false, true], [700, 150, VCOLS[1], true, false], [760, 135, VCOLS[3], false, false], [220, 130, VCOLS[4], true, true]];
  return (
    <AbsoluteFill style={{ backgroundColor: '#2b2440' }}>
      <BandImg id="riverbed/golddawn" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs><linearGradient id="rbDawnWash" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#f2a65e" stopOpacity={0.35} /><stop offset="1" stopColor="#2b2440" stopOpacity={0.15} /></linearGradient></defs>
        <rect x={-200} y={-200} width={1700} height={2700} fill="url(#rbDawnWash)" />
        {people.map(([x, h, c, sit, scarf], i) => <Villager key={i} x={x} y={slope(x)} h={h} body={c} head="#8a5a44" sit={sit} scarf={scarf} sw={t2 * 1.3 + i} shadow={-h * 1.2} />)}
        {kids.map((k) => <SlideKid key={k.i} x={k.x} y={k.y} h={70} ang={k.ang} col={k.i ? '#3e8a6a' : '#d8573a'} ph={t2 * 6 + k.i} />)}
        <KneelWoman x={380} y={slope(380)} h={150} press={ramp(t2, 0.3, 0.9)} br={t2 * 2} />
        <GirlGoat x={560} y={slope(560)} h={120} sw={t2 * 2} rim="#ffd08a" />
        <Flare x={900} y={slope(900) - 120} s={0.5 + 2.6 * fl} a={0.3 + 0.7 * fl} col="#fff2d0" />
      </Live>
    </AbsoluteFill>
  );
};
