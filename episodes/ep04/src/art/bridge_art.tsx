import React from 'react';
import { W, H, rng } from './world';

/* ------------------------------------------------------------------------------------------
 * EP04 set "bridge": one river, one new bridge, seen side-on from the downstream bank.
 * Day (S09 building, S10 opening), night (S11 the empty bridge falls, S12 the broken end),
 * and a day street with a van (S13).
 * ---------------------------------------------------------------------------------------- */
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b), k = Math.min(1, Math.max(0, t));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
export type Mood = 'day' | 'night';
export const BR = { deck: 1030, deckH: 40, water: 1300, bankL: 150, bankR: 1150, pierL: 470, pierR: 830 };
const PAL = {
  day: { sky: ['#cfd6dc', '#e6e8ea'], far: '#b9bfc0', far2: '#a9afb0', bank: '#8a8270', bank2: '#6f685a', water: ['#9aa8ae', '#6f7f86'], tree: '#6f7a66', conc: '#b8b2a6', concD: '#8f8a80' },
  night: { sky: ['#06080f', '#111628'], far: '#0d1120', far2: '#141a2c', bank: '#0e1018', bank2: '#0a0c12', water: ['#0f131c', '#0b0e14'], tree: '#0a0d14', conc: '#2a2c34', concD: '#1c1e26' },
};

/** river, banks, far town; the bridge itself is live */
export const RiverBand: React.FC<{ mood: Mood }> = ({ mood }) => {
  const C = PAL[mood], r = rng(mood === 'day' ? 401 : 402);
  const town: React.ReactNode[] = [];
  let x = -30;
  while (x < W + 30) {
    const w = 40 + r() * 90, h = 60 + r() * 220;
    town.push(<rect key={x} x={x} y={BR.water - 140 - h} width={w} height={h + 40} fill={r() < 0.5 ? C.far : C.far2} />);
    if (mood === 'night') for (let k = 0; k < 3; k++) if (r() < 0.5) town.push(<rect key={`w${x}${k}`} x={x + 8 + r() * (w - 20)} y={BR.water - 120 - r() * h} width={6} height={8} fill={r() < 0.7 ? '#ffcf86' : '#bfe3ff'} opacity={0.8} />);
    x += w + 4;
  }
  return (
    <g>
      <defs>
        <linearGradient id={`brSky${mood}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.sky[0]} /><stop offset="1" stopColor={C.sky[1]} /></linearGradient>
        <linearGradient id={`brWater${mood}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.water[0]} /><stop offset="1" stopColor={C.water[1]} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#brSky${mood})`} />
      {mood === 'night' && <circle cx={1020} cy={380} r={26} fill="#e9e6da" opacity={0.85} />}
      {town}
      {/* far bank with trees */}
      <rect x={0} y={BR.water - 150} width={W} height={160} fill={C.bank2} />
      {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={i * 90 + r() * 40} cy={BR.water - 150} rx={60 + r() * 30} ry={40 + r() * 20} fill={C.tree} />)}
      {/* water */}
      <rect x={0} y={BR.water} width={W} height={H - BR.water} fill={`url(#brWater${mood})`} />
      {/* near banks rising at both sides (embankments) */}
      <polygon points={`-40,${BR.deck + 60} ${BR.bankL},${BR.deck + 60} ${BR.bankL + 160},${H} -40,${H}`} fill={C.bank} />
      <polygon points={`${W + 40},${BR.deck + 60} ${BR.bankR},${BR.deck + 60} ${BR.bankR - 160},${H} ${W + 40},${H}`} fill={C.bank} />
      <polygon points={`-40,${BR.deck + 60} ${BR.bankL},${BR.deck + 60} ${BR.bankL + 30},${BR.deck + 140} -40,${BR.deck + 140}`} fill={C.bank2} />
      <polygon points={`${W + 40},${BR.deck + 60} ${BR.bankR},${BR.deck + 60} ${BR.bankR - 30},${BR.deck + 140} ${W + 40},${BR.deck + 140}`} fill={C.bank2} />
      {/* abutments */}
      <rect x={BR.bankL - 60} y={BR.deck + BR.deckH} width={80} height={140} fill={C.concD} />
      <rect x={BR.bankR - 20} y={BR.deck + BR.deckH} width={80} height={140} fill={C.concD} />
    </g>
  );
};

/** moving water: drifting highlight streaks; night version reflects lamps (environment, ON ONES) */
export const Water: React.FC<{ t: number; mood: Mood; lamps?: number[]; lampOn?: number }> = ({ t, mood, lamps = [], lampOn = 1 }) => {
  const r = rng(411);
  const day = mood === 'day';
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => { const y = BR.water + 20 + r() * 900, w = 60 + r() * 160, x = ((r() * W + t * (30 + r() * 30)) % (W + 200)) - 100; return <rect key={i} x={x} y={y} width={w} height={3 + (y - BR.water) / 300} rx={2} fill={day ? '#e9eef0' : '#3a4060'} opacity={day ? 0.4 : 0.5} />; })}
      {!day && lamps.map((lx, i) => <g key={i} opacity={lampOn * (0.6 + 0.2 * Math.sin(t * 3 + i))}>{[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={lx - 18 + Math.sin(t * 2 + k + i) * 10} y={BR.water + 30 + k * 60} width={36 - k * 3} height={6} rx={3} fill="#ffb347" opacity={0.7 - k * 0.1} />)}</g>)}
    </g>
  );
};

/* ------------------------------------ the bridge (live) ------------------------------------ */
type BridgeProps = { mood: Mood; stage: 'build' | 'done'; t: number; sag?: number; fall?: number; lampOn?: number; beamU?: number };
/** deck spans: left (bankL..pierL), middle (pierL..pierR), right (pierR..bankR). fall 0..1 drops the middle span. */
export const Bridge: React.FC<BridgeProps> = ({ mood, stage, t, sag = 0, fall = 0, lampOn = 1, beamU = 1 }) => {
  const C = PAL[mood];
  const D = BR.deck, dh = BR.deckH;
  const build = stage === 'build';
  const pier = (x: number, crooked: number) => (
    <g key={x}>
      <polygon points={`${x - 30},${D + dh} ${x + 30},${D + dh} ${x + 36 + crooked},${H} ${x - 36 + crooked},${H}`} fill={build ? '#7a5a3a' : C.concD} />
      <rect x={x - 46} y={D + dh} width={92} height={22} fill={build ? '#6a4a30' : C.conc} />
      {build && [0, 1, 2].map((k) => <path key={k} d={`M ${x - 70} ${D + 80 + k * 70} L ${x + 70 + crooked} ${D + 120 + k * 70} M ${x + 70} ${D + 70 + k * 70} L ${x - 70 + crooked} ${D + 130 + k * 70}`} stroke="#8a6a44" strokeWidth={8} />)}
    </g>
  );
  const span = (x0: number, x1: number, key: string, tilt = 0, dy = 0) => {
    const rail: React.ReactNode[] = [];
    if (!build) for (let x = x0 + 12; x < x1; x += 34) rail.push(<rect key={x} x={x} y={D - 46} width={5} height={46} fill={C.concD} />);
    return (
      <g key={key} transform={`translate(0 ${dy}) rotate(${tilt} ${(x0 + x1) / 2} ${D})`}>
        <rect x={x0} y={D} width={x1 - x0} height={dh} fill={build ? '#9a7a54' : C.conc} />
        <rect x={x0} y={D + dh - 10} width={x1 - x0} height={10} fill={build ? '#7a5a3a' : C.concD} />
        {!build && <rect x={x0} y={D - 50} width={x1 - x0} height={6} fill={C.concD} />}
        {rail}
      </g>
    );
  };
  const lampPost = (x: number, dy = 0, tilt = 0, on = 1) => (
    <g key={x} transform={`translate(0 ${dy}) rotate(${tilt} ${x} ${D})`}>
      <rect x={x - 3} y={D - 190} width={6} height={190} fill={mood === 'day' ? '#5a5a5e' : '#1a1c24'} />
      <path d={`M ${x} ${D - 186} q 20 -12 34 0`} stroke={mood === 'day' ? '#5a5a5e' : '#1a1c24'} strokeWidth={5} fill="none" />
      {mood === 'night' && on > 0 && <g opacity={on}><circle cx={x + 34} cy={D - 180} r={60} fill="url(#brLampGlow)" /><circle cx={x + 34} cy={D - 182} r={5} fill="#fff2c8" /><polygon points={`${x + 26},${D - 178} ${x + 42},${D - 178} ${x + 90},${D} ${x - 22},${D}`} fill="#ffb347" opacity={0.12} /></g>}
    </g>
  );
  const midDy = fall > 0 ? fall * fall * 900 : sag * 30, midTilt = fall > 0 ? fall * 14 : sag * 2;
  return (
    <g>
      <defs><radialGradient id="brLampGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.7} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient></defs>
      {pier(BR.pierL, build ? 10 : 0)}
      {pier(BR.pierR, build ? -14 : 0)}
      {build ? (
        <g>
          {span(BR.bankL - 20, BR.pierL + 40, 'l', -1.2)}
          {/* right span: only stringers so far */}
          {[0, 1].map((k) => <rect key={k} x={BR.pierR - 30} y={D + 6 + k * 22} width={BR.bankR - BR.pierR + 50} height={10} fill="#9a7a54" transform={`rotate(${0.8 + k} ${BR.pierR} ${D})`} />)}
          {/* timber A-frame + rope lowering the middle beam */}
          <path d={`M ${BR.pierL + 20} ${D} L ${(BR.pierL + BR.pierR) / 2} ${D - 360} L ${BR.pierR - 20} ${D}`} stroke="#7a5a3a" strokeWidth={10} fill="none" />
        </g>
      ) : (
        <g>
          {span(BR.bankL - 20, BR.pierL, 'l')}
          {span(BR.pierR, BR.bankR + 20, 'r')}
          {span(BR.pierL, BR.pierR, 'm', midTilt, midDy)}
          {lampPost(BR.pierL - 10, 0, 0, lampOn)}
          {lampPost(BR.pierR + 10, 0, 0, lampOn)}
          {lampPost((BR.pierL + BR.pierR) / 2, midDy, midTilt, lampOn * (1 - fall * 3))}
          {mood === 'day' && <g>{/* bunting */}<path d={`M ${BR.bankL} ${D - 190} Q ${BR.pierL} ${D - 120} ${(BR.pierL + BR.pierR) / 2} ${D - 190} Q ${BR.pierR} ${D - 120} ${BR.bankR} ${D - 190}`} stroke="#5a5a5e" strokeWidth={2} fill="none" />{Array.from({ length: 22 }, (_, i) => { const u = i / 21, x = BR.bankL + (BR.bankR - BR.bankL) * u, y = D - 190 + Math.sin(u * Math.PI * 2) ** 2 * 64 + 6; return <polygon key={i} points={`${x - 10},${y} ${x + 10},${y} ${x + Math.sin(t * 5 + i) * 4},${y + 22}`} fill={['#c94f3d', '#e8c24a', '#4f6f8a', '#f2efe6'][i % 4]} />; })}</g>}
        </g>
      )}
      {/* the hanging beam (build): rope from the A-frame apex, swinging in, landing crooked at beamU = 1 */}
      {build && (() => {
        const ax = (BR.pierL + BR.pierR) / 2, ay = D - 360;
        const bx = ax + (1 - beamU) * -60 + Math.sin(t * 3) * 8 * (1 - beamU), by = D - (1 - beamU) * 220, rot = 5 + (1 - beamU) * 8;
        return <g><path d={`M ${ax} ${ay} L ${bx - 120} ${by} M ${ax} ${ay} L ${bx + 120} ${by}`} stroke="#5a4a38" strokeWidth={2.5} /><rect x={bx - 210} y={by - 4} width={420} height={30} fill="#a8865c" transform={`rotate(${rot} ${bx} ${by})`} /><rect x={bx - 210} y={by + 18} width={420} height={8} fill="#7a5a3a" transform={`rotate(${rot} ${bx} ${by})`} /></g>;
      })()}
    </g>
  );
};

/** spray + dust when the span hits the water (environment, ON ONES); u = 0..1 since impact */
export const Splash: React.FC<{ u: number }> = ({ u }) => {
  if (u <= 0 || u >= 1) return null;
  const cx = (BR.pierL + BR.pierR) / 2, y = BR.water;
  return (
    <g>
      {Array.from({ length: 14 }, (_, i) => { const a = -Math.PI * (0.1 + 0.8 * (i / 13)), d = 80 + 420 * u, x = cx + Math.cos(a) * d * 1.2, yy = y + Math.sin(a) * d * (1 - u * 0.6); return <ellipse key={i} cx={x} cy={yy} rx={30 + 40 * u} ry={14 + 20 * u} fill="#8a96b0" opacity={0.6 * (1 - u)} />; })}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={`d${i}`} cx={cx - 300 + i * 85} cy={y - 60 - 260 * u - (i % 2) * 40} rx={90 + 120 * u} ry={60 + 80 * u} fill="#3a3a48" opacity={0.45 * (1 - u)} />)}
      <ellipse cx={cx} cy={y + 10} rx={200 + 400 * u} ry={20 + 30 * u} fill="none" stroke="#5a6480" strokeWidth={6} opacity={0.7 * (1 - u)} />
    </g>
  );
};

/** dust trickling from cracks while the span sags (ON ONES) */
export const Trickle: React.FC<{ t: number; o: number }> = ({ t, o }) => o <= 0 ? null : (
  <g fill="#6a6a78" opacity={o}>
    {[BR.pierL + 10, BR.pierR - 10, (BR.pierL + BR.pierR) / 2].map((x, i) => [0, 1, 2, 3, 4].map((k) => { const u = ((t * 0.9 + k / 5 + i * 0.3) % 1); return <rect key={`${i}${k}`} x={x + Math.sin(k + i) * 10} y={BR.deck + BR.deckH + u * 260} width={4} height={8} opacity={1 - u} />; }))}
  </g>
);

/* ------------------------------------ S12: the broken end ------------------------------------ */
export const EndBand: React.FC = () => {
  const r = rng(421);
  return (
    <g>
      <defs><linearGradient id="beSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#06080f" /><stop offset="1" stopColor="#141a2c" /></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#beSky)" />
      {Array.from({ length: 14 }, (_, i) => { const w = 50 + r() * 80, h = 60 + r() * 160; return <g key={i}><rect x={i * 96 - 20} y={1280 - h} width={w} height={h + 30} fill="#0d1120" />{r() < 0.6 && <rect x={i * 96 + 10} y={1280 - h * 0.6} width={8} height={10} fill="#ffcf86" opacity={0.7} />}</g>; })}
      <rect x={0} y={1300} width={W} height={H - 1300} fill="#0b0e14" />
      {/* the deck from the left, broken off mid-air: jagged end, bent railing, dangling rebar */}
      <polygon points={`-40,880 760,880 800,900 770,930 810,960 760,990 -40,990`} fill="#2a2c34" />
      <rect x={-40} y={960} width={760} height={30} fill="#1c1e26" />
      <rect x={-40} y={820} width={720} height={8} fill="#1c1e26" />
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={i * 36} y={820} width={5} height={60} fill="#1c1e26" />)}
      <path d="M 680 824 Q 740 830 770 880 Q 790 920 760 960" stroke="#1c1e26" strokeWidth={8} fill="none" />
      {[770, 790, 810, 784].map((x, i) => <path key={i} d={`M ${x} ${905 + i * 16} q ${10 + i * 4} 40 ${-4 + i * 6} ${120 + i * 40}`} stroke="#3a3c46" strokeWidth={3} fill="none" />)}
      {/* pier under the deck */}
      <polygon points={`280,990 380,990 400,${H} 260,${H}`} fill="#1c1e26" />
    </g>
  );
};

/** the streetlight at the broken edge, flickering (ON ONES) */
export const EdgeLamp: React.FC<{ on: number }> = ({ on }) => (
  <g>
    <defs><radialGradient id="beGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.8} /><stop offset="0.3" stopColor="#ffb347" stopOpacity={0.3} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient></defs>
    <rect x={636} y={540} width={10} height={340} fill="#14161e" />
    <path d="M 641 548 q 30 -20 60 0" stroke="#14161e" strokeWidth={8} fill="none" />
    <g opacity={on}>
      <polygon points="690,560 712,560 900,880 520,880" fill="#ffb347" opacity={0.12} />
      <circle cx={701} cy={556} r={180} fill="url(#beGlow)" />
      <circle cx={701} cy={556} r={7} fill="#fff2c8" />
      <rect x={520} y={876} width={380} height={8} fill="#ffb347" opacity={0.35} />
      {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={690 - k * 6} y={1340 + k * 90} width={30 + k * 8} height={7} rx={3} fill="#ffb347" opacity={0.5 - k * 0.07} />)}
    </g>
    <rect x={688} y={552} width={26} height={8} rx={3} fill="#2a2c34" />
  </g>
);

/* ------------------------------------ S13: the van ------------------------------------ */
export const YARD = { ground: 1560 };
export const YardBand: React.FC = () => (
  <g>
    <rect x={0} y={0} width={W} height={H} fill="#e6e8ea" />
    <rect x={0} y={300} width={W} height={YARD.ground - 300} fill="#c8c1b3" />
    {[0, 1, 2].map((i) => <rect key={i} x={80 + i * 420} y={460} width={240} height={300} fill="#8f8a80" opacity={0.6} />)}
    <rect x={0} y={YARD.ground - 180} width={W} height={180} fill="#b3ada2" />
    <rect x={0} y={YARD.ground} width={W} height={H - YARD.ground} fill="#9a958b" />
    <rect x={0} y={YARD.ground} width={W} height={40} fill="#2a2018" opacity={0.15} />
    {/* puddle */}
    <ellipse cx={520} cy={YARD.ground + 150} rx={230} ry={36} fill="#7a8a92" />
    <ellipse cx={480} cy={YARD.ground + 142} rx={140} ry={14} fill="#e9eef0" opacity={0.5} />
  </g>
);

/** a plain van (no markings), side door slid open, dark interior */
export const Van: React.FC<{ x: number; y: number; door: number }> = ({ x, y, door }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={260} cy={6} rx={330} ry={22} fill="#2a2018" opacity={0.3} />
    <path d="M 0 -60 L 0 -420 Q 0 -460 40 -460 L 420 -460 Q 470 -460 500 -400 L 560 -260 L 560 -60 Z" fill="#d6d8d6" />
    <rect x={0} y={-120} width={560} height={30} fill="#a9aca9" />
    <path d="M 440 -440 L 480 -440 L 530 -300 L 440 -300 Z" fill="#3a4048" />
    <rect x={60} y={-420} width={(1 - door) * 240 + 10} height={330} fill="#c8cac8" />
    <rect x={60 + (1 - door) * 240} y={-420} width={door * 240} height={330} fill="#16181c" />
    <rect x={300} y={-420} width={10} height={330} fill="#a9aca9" />
    {[110, 440].map((wx) => <g key={wx}><circle cx={wx} cy={-50} r={56} fill="#1a1a1e" /><circle cx={wx} cy={-50} r={24} fill="#8a8e92" /></g>)}
  </g>
);

/** rolled blueprints: a roll (in the arm) or unrolling flat in the puddle */
export const Blueprints: React.FC<{ x: number; y: number; rot: number; open?: number; s?: number }> = ({ x, y, rot, open = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {open > 0 && <rect x={-70} y={-6} width={140 * open} height={56 * open} fill="#3f6a9a" transform={`skewX(-20)`} />}
    {open > 0 && <path d={`M ${-60} 10 l ${100 * open} 0 M ${-60} 24 l ${80 * open} 0`} stroke="#d8e4f0" strokeWidth={2} opacity={0.7} />}
    <rect x={-80} y={-10} width={160} height={20} rx={10} fill="#4a76a8" />
    <rect x={-80} y={-10} width={160} height={6} rx={3} fill="#8ab0d8" />
    <ellipse cx={-80} cy={0} rx={5} ry={10} fill="#d8e4f0" />
  </g>
);
