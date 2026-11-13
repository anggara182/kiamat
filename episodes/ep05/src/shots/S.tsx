import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, clamp01, EIO, EOUT } from '../comp/Camera';
import { wordAt, spanOf, FPS } from '../data/ep';
import { RF, GF, WH, Rain, Cart, Chaff, Shafts, Sack, Notes, Note } from '../art/harvest_art';
import { Figure, walkPose, Pose, Look } from '../art/harvest_people';

/* EP05 harvest. Clocks: camera + environment (rain, chaff, light, falling sheaves, banknotes) ON ONES (p/t);
 * people ON TWOS (p2/t2). */

/** like wordAt but the LAST matching word (S17: "...what to do with." is the cliffhanger beat) */
const lastWordAt = (id: number, re: RegExp, fallback: number) => {
  const sp = spanOf(id);
  const ws = sp.shot.words.filter((w) => re.test(w.text));
  return ws.length ? ws[ws.length - 1].start - sp.from / FPS : (fallback * sp.dur) / FPS;
};
const EIN = Easing.in(Easing.quad);
const FARM: Look[] = [
  { body: '#4a5a4a', far: '#34402f', skin: '#9a6a4e', hat: 'caping', hatCol: '#d8c08a', rim: '#e9f0ec', rimO: 0.5 },
  { body: '#5a4a3a', far: '#3e3226', skin: '#8a5a40', hat: 'caping', hatCol: '#cdb47a', rim: '#e9f0ec', rimO: 0.5 },
  { body: '#3a4a5a', far: '#28343f', skin: '#a8765a', hat: 'hijab', hatCol: '#6a7a6a', skirt: true, rim: '#e9f0ec', rimO: 0.5 },
];

/** shot 15 — a curtain of rain sweeps over the green paddies; farmers look up and laugh; the rain hits the field on "early". Slow push-in. */
export const S15: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tE = wordAt(15, /^early/i, 0.7);
  const cam: Cam = { zoom: 1 + 0.06 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 1000 };
  const xFront = 1500 - 1900 * ramp(t, 0, tE, EIO);
  const hit = ramp(t, tE, tE + 0.25);
  const joy = ramp(t2, tE - 0.1, tE + 0.2, EOUT);
  const F: [number, number, number, number][] = [[300, RF.water + 210, 640, 1], [690, RF.water + 290, 720, -1], [1010, RF.water + 150, 560, -1]];
  return (
    <AbsoluteFill style={{ backgroundColor: '#8fa79a' }}>
      <BandImg id="harvest/rain" cam={cam} />
      <Live cam={cam}>
        <defs><radialGradient id="hvPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#9fb8ac" stopOpacity={0.95} /><stop offset="0.6" stopColor="#9fb8ac" stopOpacity={0.85} /><stop offset="1" stopColor="#9fb8ac" stopOpacity={0} /></radialGradient></defs>
        {F.map(([x, y, h, dir], i) => {
          const laugh = Math.abs(Math.sin(t2 * 9 + i)) * joy;
          const pose: Pose = { lean: -8 - 6 * joy, head: -30 - 10 * laugh, thA: 4, shA: 2, thB: -4, shB: -4,
            uaA: 30 + 110 * joy + 8 * laugh, faA: 50 + 110 * joy, uaB: 20 + 100 * joy, faB: 40 + 110 * joy, bob: -laugh * 2, breath: 0.6 * Math.sin(t2 * 3 + i) };
          return (
            <g key={i}>
              <Figure x={x} y={y} h={h} dir={dir} pose={pose} look={FARM[i]} />
              {/* water over the shins + a ripple ring */}
              <ellipse cx={x} cy={y - h * 0.06} rx={h * 0.34} ry={h * 0.11} fill="url(#hvPool)" />
              <ellipse cx={x} cy={y - h * 0.16} rx={h * 0.18} ry={h * 0.025} fill="none" stroke="#e9f0ec" strokeWidth={3} opacity={0.6} />
            </g>
          );
        })}
        <Rain t={t} xFront={xFront} hit={hit} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 16 — golden harvest: harvesters cutting and carrying, carts piled high; one cart overflows on "seen". Lateral track. */
export const S16: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tS = wordAt(16, /^seen/i, 0.8);
  const cam: Cam = { zoom: 1.08, dx: 60 - 120 * ramp(p, 0, 1, EIO), dy: 0, ox: 540, oy: 1000 };
  const spill = ramp(t, tS, tS + 0.55, EIN);
  const cutters: [number, number, number, Look][] = [
    [260, 1440, 520, { body: '#6a4a3a', far: '#4a3426', skin: '#8a5a40', hat: 'caping', hatCol: '#e2c88a', rim: '#fff2c8', rimO: 0.7 }],
    [520, 1400, 470, { body: '#3a4a5a', far: '#2a3440', skin: '#9a6a4e', hat: 'hijab', hatCol: '#a85a3a', skirt: true, rim: '#fff2c8', rimO: 0.7 }],
  ];
  const walkEnd = 1.3, cx = 1200 - 150 * Math.min(t2, walkEnd); // carrier walks in and stops beside the cart
  return (
    <AbsoluteFill style={{ backgroundColor: '#f2dca8' }}>
      <BandImg id="harvest/gold" cam={cam} />
      <Live cam={cam}>
        {cutters.map(([x, y, h, look], i) => {
          const sw = Math.sin(t2 * 6 + i * 1.7);
          const pose: Pose = { lean: 52 + 4 * sw, head: 30, thA: 28, shA: -8, thB: 6, shB: -10, uaA: 70 + 40 * sw, faA: 40 + 60 * sw, uaB: 40, faB: 20 };
          return <Figure key={i} x={x} y={y} h={h} dir={1} pose={pose} look={look} />;
        })}
        <Cart x={800} y={GF.ground + 170} s={1.2} spill={spill} t={t} />
        <g>
          <Figure x={cx} y={GF.ground + 240} h={660} dir={-1} pose={{ ...(t2 < walkEnd ? walkPose(t2 * 6, false, 0.8) : { lean: 6, head: -10, thA: 3, shA: 1, thB: -3, shB: -3, uaA: 0, faA: 0, uaB: 10, faB: 30, breath: 0.6 * Math.sin(t2 * 3) }), uaA: 160, faA: 196 }} look={{ body: '#5a4a3a', far: '#3e3226', skin: '#8a5a40', hat: 'caping', hatCol: '#e2c88a', rim: '#fff2c8', rimO: 0.7 }} />
          {/* bundle of sheaves on his shoulder */}
          <g transform={`translate(${cx - 10} ${GF.ground + 240 - 660 * 0.86}) rotate(12)`}><path d="M -120 0 Q -60 -40 60 -30 Q 120 -24 130 0 Q 60 20 -120 16 Z" fill="#e2b84a" /><path d="M -100 6 L 110 -4" stroke="#b8862a" strokeWidth={4} /><rect x={-10} y={-26} width={16} height={40} fill="#8a6a3a" /></g>
        </g>
        <Chaff t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 17 — a warehouse piling up with sacks of money; a merchant laughs; notes flutter; a sack tips and notes burst out on the final "with". Slow push-in. */
export const S17: React.FC = () => {
  const { p, t, t2 } = useShot();
  const tW = lastWordAt(17, /^with/i, 0.83);
  const cam: Cam = { zoom: 1.02 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 480, oy: 1050 };
  const G = WH.floor;
  const tip = ramp(t, tW - 0.12, tW + 0.25, EIN), burst = Math.max(0, t - tW);
  const rows: [number, number, number][] = [];
  for (let i = 0; i < 7; i++) rows.push([60 + i * 120, G + 20, 1.05]);
  for (let i = 0; i < 6; i++) rows.push([120 + i * 120, G - 100, 1.0]);
  for (let i = 0; i < 5; i++) rows.push([180 + i * 120, G - 215, 0.95]);
  for (let i = 0; i < 3; i++) rows.push([300 + i * 120, G - 325, 0.9]);
  const laugh = Math.abs(Math.sin(t2 * 8));
  const mPose: Pose = { lean: -14 - 4 * laugh, head: -34 - 6 * laugh, thA: 6, shA: 2, thB: -6, shB: -6, uaA: 150 + 10 * laugh, faA: 170, uaB: 60, faB: 120, bob: -laugh * 2, breath: 1.2 * laugh };
  return (
    <AbsoluteFill style={{ backgroundColor: '#3a2c1e' }}>
      <BandImg id="harvest/barn" cam={cam} />
      <Live cam={cam}>
        {/* hard shadows of the pile on the floor */}
        <polygon points={`20,${G + 20} 940,${G + 20} 1200,${G + 240} 260,${G + 240}`} fill="#1a120a" opacity={0.45} />
        {rows.map(([x, y, s], i) => <Sack key={i} x={x} y={y} s={s} rot={((i * 37) % 12) - 6} tone={i % 2} money={i > 6} />)}
        {/* the top sack that tips over the edge and spills */}
        <Sack x={420 + 80 * tip} y={G - 435 + 60 * tip * tip} s={0.92} rot={-4 + 110 * tip} />
        <Shafts t={t} />
        <ellipse cx={900} cy={G + 26} rx={160} ry={18} fill="#1a120a" opacity={0.5} />
        <polygon points={`840,${G + 20} 970,${G + 20} 1180,${G + 200} 1030,${G + 200}`} fill="#1a120a" opacity={0.35} />
        <Figure x={900} y={G + 20} h={780} dir={-1} pose={mPose} look={{ body: '#6a4a2a', far: '#4a3018', skin: '#a8765a', hat: 'peci', hatCol: '#1a1410', rim: '#f6dca0', rimO: 0.8 }} />
        {/* a fan of notes in his raised hand */}
        {(() => { const hx = 900 + 12, hy = G + 20 - 780 * 1.06; return <g transform={`translate(${hx} ${hy})`}>{[-30, -10, 10, 30].map((a) => <g key={a} transform={`rotate(${a + Math.sin(t2 * 8) * 4})`}><g transform="translate(0 -26)"><Note w={56} tint={a > 0 ? 1 : 0} /></g></g>)}</g>; })()}
        <Notes t={t} burst={burst} ox={520} oy={G - 470} />
      </Live>
    </AbsoluteFill>
  );
};
