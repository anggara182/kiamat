import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01, handheld } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { CH, colXs, Fire, Smoke, Particles, CrowdBacks, Sweeper, ThrowArm, FlameArc } from '../art/cityhall_art';
import { BOWL, BANKS, sectorPath, FloodBank, FloodDefs, STAGE, ManSil, STAND_PPL, Spectator, KneelBack, StandingOldMan } from '../art/stadium_art';

/** shot 1 — HOOK: city hall burning at midnight, crowd silhouettes with raised arms, embers; flames flare on "fire". Push-in + handheld. */
export const S01: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tf = wordAt(1, /^fire/i, 0.15);
  const hh = handheld(t, 0.8);
  const cam: Cam = { zoom: 1.04 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: hh.hx, ty: hh.hy, rot: hh.hr, ox: 540, oy: 900 };
  const flare = 1 + (t >= tf ? 0.6 * Math.exp(-(t - tf) * 2.5) * ramp(t, tf, tf + 0.08) : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#06080f' }}>
      <BandImg id="cityhall/fire" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <Smoke t={t} srcs={[[CH.cx - 200, 900], [CH.cx + 150, 860], [CH.cx, 560], [160, 1080], [1140, 1080]]} col="#2a2530" lit="#ff8a2a" litO={0.45 * flare} scale={1.1} />
        <Fire t={t} flare={flare} />
        <Particles t={t} n={80} seed={3} x0={100} x1={1200} y0={200} y1={1300} dir={-1} col="#ffb050" size={3.2} speed={0.45} />
      </Live>
      <Live k={1.15} cam={cam}>
        <rect x={-300} y={1650} width={1900} height={900} fill="#ff6a1a" opacity={0.06 * flare} />
        <CrowdBacks y={1720} n={16} s={0.5} t2={t2} seed={4} fill="#08070c" rim="#ff9a3a" rimO={0.6} />
        <CrowdBacks y={2080} n={9} s={0.85} t2={t2 + 0.3} seed={8} fill="#050508" rim="#ffb060" rimO={0.7} />
        <Particles t={t} n={20} seed={7} x0={0} x1={1296} y0={1200} y1={2300} dir={-1} col="#ffcf6a" size={5} speed={0.6} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 2 — ash dawn: the ruins smoking at sunrise, a lone street sweeper pushing ash; smoke clears off the last column on "gone". Slow pull-back. */
export const S02: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tg = wordAt(2, /^gone/i, 0.72);
  const cam: Cam = { zoom: 1.16 - 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 600, oy: 1200 };
  const lc = colXs[6] + CH.colW / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#4a4652' }}>
      <BandImg id="cityhall/ruin" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <Smoke t={t} srcs={[[CH.cx - 120, 1300], [CH.cx + 60, 1260], [420, 1360]]} col="#5a5258" lit="#ffd8a8" litO={0.25} scale={0.55} rise={90} drift={40} />
        <g opacity={1 - ramp(t, tg - 0.7, tg, (n) => n)}>
          <ellipse cx={lc + 40 + t * 30} cy={1180} rx={260} ry={340} fill="url(#sm5a5258)" />
          <ellipse cx={lc - 20 + t * 20} cy={1060} rx={200} ry={220} fill="url(#sm5a5258)" />
        </g>
      </Live>
      <Live k={1.05} cam={cam}>
        <Sweeper x={780} y={1690} h={330} ph={t2 * 4.4} fill="#2a2428" rim="#ffd8a8" />
        <ellipse cx={850} cy={1694} rx={160} ry={12} fill="#2a2428" opacity={0.25} />
        <Particles t={t} n={70} seed={11} x0={0} x1={1296} y0={200} y1={2100} dir={1} col="#d8ccc4" size={2.6} speed={0.12} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — night, close: a silhouette arm winds back and throws a lit bottle on "flame"; the fire arcs toward the dark city hall. Slow drift. */
export const S10: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tf = wordAt(10, /^flame/i, 0.78);
  const cam: Cam = { zoom: 1.02 + 0.05 * ramp(p, 0, 1, EIO), dx: -20 * p, dy: 0, ox: 540, oy: 1000 };
  const wind = ramp(t2, tf - 1.0, tf - 0.08) * (t2 < tf ? 1 : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="cityhall/dark" k={0.85} cam={cam} />
      <Live k={0.85} cam={cam}>
        <Fire t={t} flare={1} pts={[]} />
        <Smoke t={t} srcs={[[150, 1250], [1180, 1200]]} col="#141018" lit="#ff8a2a" litO={0.3} scale={0.9} />
        <ellipse cx={120} cy={1300} rx={300} ry={160} fill="#ff6a1a" opacity={0.08 + 0.03 * Math.sin(t * 5)} />
        <CrowdBacks y={1560} n={12} s={0.32} t2={t2} seed={12} fill="#050508" rim="#ff9a3a" rimO={0.35} />
        <FlameArc k={ramp(t, tf, tf + 0.7, (n) => n)} t={t} from={[560, 1580]} to={[CH.cx + 60, 1180]} peak={420} />
      </Live>
      <Live k={1.2} cam={cam}>
        <ThrowArm wind={wind} rel={t2 - tf} t={t} fill="#030305" rim="#ff9a3a" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 19 — aerial push into the full stadium; floodlight banks snap on one by one, the last on "full". */
export const S19: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tf = wordAt(19, /^full/i, 0.77);
  const cam: Cam = { zoom: 1.0 + 0.22 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ty: -60 * p, ox: 540, oy: BOWL.cy - 192 };
  const times = [0.15, 0.4, 0.68, 1].map((f) => tf * f);
  const on = times.map((tt) => (t >= tt ? 1 : 0));
  const shimmer = Math.sin(t2 * 6) * 0.04;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="stadium/bowl" k={0.95} cam={cam} />
      <Live k={0.95} cam={cam}>
        <FloodDefs />
        {BANKS.map((b, i) => <path key={i} d={sectorPath(b.a - 0.95, b.a + 0.95)} fill="#05070f" opacity={0.7 * (1 - on[i])} />)}
        <ellipse cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.outer[0]} ry={BOWL.outer[1]} fill="#f4f8ff" opacity={0.03 + shimmer * on[3]} />
        {BANKS.map((b, i) => <FloodBank key={i} x={b.x} y={b.y - 138} on={on[i]} tx={BOWL.cx + (b.x - BOWL.cx) * 0.2} ty={BOWL.cy} />)}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 20 — low wide: the man on the stage, a tiny backlit silhouette, opens his arms on "sent"; the giant screens show only his silhouette. Slow push-in. */
export const S20: React.FC = () => {
  const { p, t, t2 } = useShot();
  const ts = wordAt(20, /^sent/i, 0.63);
  const cam: Cam = { zoom: 1.04 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: STAGE.floor - 192 };
  const open = ramp(t2, ts - 0.15, ts + 0.3);
  const M = STAGE.man;
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="stadium/low" k={0.9} cam={cam} />
      <Live k={0.9} cam={cam}>
        <FloodDefs />
        <defs><linearGradient id="scrFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f0ff" /><stop offset="1" stopColor="#9fb4e6" /></linearGradient></defs>
        {[STAGE.scrL, STAGE.scrR].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#scrFill)" opacity={0.92 + 0.04 * Math.sin(t * 9 + i)} />
            <ManSil x={s.x + s.w / 2} y={s.y + s.h + 150} h={560} open={open} fill="#0a0c14" />
            <rect x={s.x} y={s.y + s.h} width={s.w} height={160} fill="#05060b" />
          </g>
        ))}
        <FloodBank x={140} y={330} on={1} tx={STAGE.cx - 120} ty={STAGE.floor} />
        <FloodBank x={1156} y={330} on={1} tx={STAGE.cx + 120} ty={STAGE.floor} />
        <ManSil x={M.x} y={M.y + 40} h={M.h} open={open} fill="#05060b" />
      </Live>
      <Live k={1.15} cam={cam}>
        <ellipse cx={STAGE.cx} cy={STAGE.floor + 380} rx={760} ry={420} fill="url(#flGlow)" opacity={0.35} />
        <CrowdBacks y={1980} n={12} s={0.75} t2={t2} seed={21} fill="#04050a" rim="#c9d8ff" rimO={0.55} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 21 — the stands: a wave of kneeling rolls across, passing the centre on "knees"; a few stay standing, frozen. Locked, slight drift. */
export const S21: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tk = wordAt(21, /^knees/i, 0.68);
  const cam: Cam = { zoom: 1.05 + 0.02 * p, dx: -14 * p, dy: 0, ox: 540, oy: 960 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="stadium/stands" k={0.95} cam={cam} />
      <Live k={1} cam={cam}>
        <FloodDefs />
        {[180, 520, 860, 1180].map((x, i) => <FloodBank key={i} x={x} y={300} on={1} s={0.8} />)}
        {STAND_PPL.map((q, i) => {
          const tt = tk + (q.x - 648) / 650 + q.d;
          const k = q.stay ? 0 : ramp(t2, tt - 0.15, tt + 0.25);
          return <Spectator key={i} x={q.x + (q.stay ? 0 : Math.sin(t2 * 3 + i) * 1.2)} y={q.y} s={q.s} k={k} col={q.col} head={q.head} hijab={q.hijab} />;
        })}
        <rect x={-200} y={200} width={1700} height={500} fill="#dfe9ff" opacity={0.04 + 0.01 * Math.sin(t * 2)} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 22 — an old man (peci, plain shirt) stands still among the kneeling backs, looking away from the stage. Upper frame kept dark for the quote. Very slow push-in. */
export const S22: React.FC = () => {
  const { p, t2 } = useShot();
  const cam: Cam = { zoom: 1.02 + 0.06 * ramp(p, 0, 1, (n) => n), dx: 0, dy: 0, ox: 600, oy: 1100 };
  const rows: [number, number, number, number][] = [[1560, 1.0, 10, 1], [1860, 1.35, 7, 2], [2220, 1.8, 5, 3]];
  return (
    <AbsoluteFill style={{ backgroundColor: '#03040a' }}>
      <BandImg id="stadium/near" k={0.8} cam={cam} />
      <Live k={1} cam={cam}>
        {rows.slice(0, 2).map(([y, s, n, seed]) => Array.from({ length: n }).map((_, i) => { const x = -40 + (i + (seed * 0.37 + i * 0.13) % 0.5) * (1400 / n); return Math.abs(x - 640) < 130 * s && seed === 2 ? null : <KneelBack key={`${seed}-${i}`} x={x} y={y} s={s} col={seed === 1 ? '#0c0f1a' : '#080a12'} rim="#9fb4e6" br={t2 * 2 + i} hijab={(i + seed) % 3 === 0} />; }))}
        <StandingOldMan x={640} y={2120} h={980} turn={0.35 + 0.25 * ramp(p, 0.1, 0.9)} br={t2 * 2} rim="#b8c8f0" />
        {Array.from({ length: rows[2][2] }).map((_, i) => { const x = -40 + i * 330 + (i % 2) * 50; return <KneelBack key={`f${i}`} x={x} y={rows[2][0]} s={rows[2][1]} col="#04050a" rim="#9fb4e6" br={t2 * 2.2 + i} hijab={i % 2 === 0} />; })}
      </Live>
    </AbsoluteFill>
  );
};
