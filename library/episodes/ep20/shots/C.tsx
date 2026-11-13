import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Hand, Key, Lock } from '../art/close_parts';

const BG = '#0a0f12';

/** a few mane locks spilling in from the top-right: says "horse neck" on the hide inserts */
const TopMane: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[[1240, 60, 620, 70], [1150, 40, 560, 64], [1060, 20, 470, 56], [1300, 120, 700, 70]].map(([x, y, len, w], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${22 + i * 3})`}>
        <Lock len={len} w={w} sway={-20 + Math.sin(t * 0.8 + i) * 12} weed={i === 1} />
      </g>
    ))}
  </g>
);

/** drips falling from (x,y), cycling */
const Drips: React.FC<{ pts: [number, number][]; t: number; fall?: number }> = ({ pts, t, fall = 260 }) => (
  <g>
    {pts.map(([x, y], i) => {
      const c = ((t * 0.7 + i * 0.37) % 1);
      return <g key={i} opacity={1 - c * 0.6}><ellipse cx={x} cy={y + c * c * fall} rx="6" ry={9 + c * 6} fill="#b9c9cf" opacity="0.85" /></g>;
    })}
  </g>
);

/** rising steam wisps around (x,y) */
const Steam: React.FC<{ x: number; y: number; t: number; amt: number }> = ({ x, y, t, amt }) => (
  <g opacity={amt}>
    <defs><radialGradient id="stm"><stop offset="0" stopColor="#dfe8ea" stopOpacity="0.55" /><stop offset="1" stopColor="#dfe8ea" stopOpacity="0" /></radialGradient></defs>
    {Array.from({ length: 9 }, (_, i) => {
      const c = (t * 0.45 + i / 9) % 1;
      const sx = x + Math.sin(c * 6 + i * 1.7) * 60 * c + (i % 3 - 1) * 90;
      return <ellipse key={i} cx={sx} cy={y - c * 520} rx={50 + c * 110} ry={40 + c * 80} fill="url(#stm)" opacity={Math.sin(c * Math.PI)} />;
    })}
    {[0, 1, 2].map((i) => {
      const c = (t * 0.35 + i / 3) % 1;
      return <path key={'w' + i} d={`M${x - 80 + i * 80} ${y - 20} C${x - 120 + i * 80 + Math.sin(t * 2 + i) * 40} ${y - 160} ${x - 20 + i * 80} ${y - 260} ${x - 70 + i * 80 + Math.sin(t * 1.5 + i) * 50} ${y - 420}`}
        stroke="#e6eef0" strokeWidth="6" fill="none" strokeLinecap="round" opacity={0.35 * Math.sin(c * Math.PI)} strokeDasharray="160 600" strokeDashoffset={-c * 500} />;
    })}
  </g>
);

const MANE: [number, number, number, number][] = [
  // rootX, rootY, len, width (neck band is shifted -170)
  [930, 380, 380, 56], [880, 450, 440, 62], [830, 530, 480, 60], [785, 620, 520, 66], [750, 720, 540, 62],
  [725, 830, 520, 64], [705, 940, 470, 58], [695, 1050, 420, 54], [690, 1160, 340, 48],
  [860, 500, 360, 40], [770, 700, 420, 44], [715, 900, 400, 42],
];

/** shot 6 — the wet mane with weed, a small hand reaching toward it */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const zoom = 1 + 0.1 * EIO(p);
  const cam: Cam = { zoom, dx: -20 * p, dy: 0, ox: 760, oy: 900 };
  const reach = ramp(t, wordAt(6, /reached/, 0.7) - 0.6, wordAt(6, /pet/, 0.9) + 0.2);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="close/bg" k={0.3} cam={cam} />
      <BandImg id="close/neck" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <path d={`M${MANE.slice(0, 9).map(([x, y]) => `${x - 10} ${y - 30}`).join(' L')}`} stroke="#060708" strokeWidth="90" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {MANE.map(([x, y, len, w], i) => (
          <g key={i} transform={`translate(${x - 30} ${y}) rotate(${18 + (i % 9) * 1.2})`}>
            <Lock len={len * 1.15} w={w * 1.1} sway={-18 + Math.sin(t * 0.9 + i * 0.8) * 16} weed={i % 3 === 1} rim={i > 8 ? '#6f8a90' : '#c4d4d8'} />
          </g>
        ))}
        <Drips t={t} pts={MANE.filter((_, i) => i % 2 === 0).map(([x, y, len], i) => [x - 200 - i * 12, y + len * 1.08])} />
        <g transform={`translate(${160 + 250 * reach} ${1560 - 260 * reach}) rotate(${50 - 8 * reach}) scale(1.25)`}>
          <Hand sleeve="#4e5b6a" skin="#d9b6a3" shade="#9a7568" spread={0.6} curl={0.15 * (1 - reach)} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — small hand pressed flat on wet black hide; fingers can't lift */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.03 * p, dx: 0, dy: 0, ox: 540, oy: 850 };
  const stuck = wordAt(7, /stuck/, 0.8);
  const tug = t > stuck - 0.3 ? Math.max(0, Math.sin((t - stuck + 0.3) * 5)) * 0.22 : 0;
  const press = ramp(p, 0, 0.12);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="close/hide" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <radialGradient id="seal"><stop offset="0.6" stopColor="#000" stopOpacity="0.6" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
          <radialGradient id="wetRim"><stop offset="0.7" stopColor="#b9c9cf" stopOpacity="0" /><stop offset="0.85" stopColor="#b9c9cf" stopOpacity="0.35" /><stop offset="1" stopColor="#b9c9cf" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="660" cy="980" rx="260" ry="250" fill="url(#seal)" opacity={press} />
        <ellipse cx="660" cy="990" rx="250" ry="250" fill="url(#wetRim)" opacity={press * (0.6 + 0.4 * Math.sin(t * 2))} />
        <g transform={`translate(${680} ${1240 + 30 * (1 - press) + tug * 30}) rotate(-14) scale(1.6)`}>
          <Hand sleeve="#4e5b6a" skin="#d9b6a3" shade="#9a7568" spread={1.4} curl={tug} />
        </g>
        {/* wet strands of hide clinging to the fingers */}
        {[-60, -10, 40].map((x, i) => (
          <path key={i} d={`M${640 + x * 1.5} ${880} q${10} ${-30 - tug * 120} ${4} ${-70 - tug * 160}`} stroke="#6f8a90" strokeWidth="4" fill="none" opacity={0.25 + tug * 2.5} strokeLinecap="round" />
        ))}
        <Drips t={t} pts={[[470, 1200], [880, 1180], [700, 1330]]} fall={160} />
        <TopMane t={t} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — the girl pulls the old iron key out of her coat pocket (handheld) */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t * 1.4, 1.6);
  const cam: Cam = { zoom: 1.04 + 0.04 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr, ox: 540, oy: 900 };
  const pull = ramp(t, wordAt(9, /Grandma/, 0.4) - 0.3, wordAt(9, /iron/, 0.75) + 0.3);
  const wy = 1100 - 520 * pull;
  const wx = 560 + 20 * Math.sin(pull * 3);
  const pocket = 'M262 1240 Q560 1290 868 1196 L880 1700 L280 1740Z';
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="close/coat" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <clipPath id="outPocket"><path clipRule="evenodd" d={`M-200 -200 H1500 V2500 H-200Z ${pocket}`} /></clipPath>
          <radialGradient id="keyRim9"><stop offset="0" stopColor="#4fd1c5" stopOpacity="0.28" /><stop offset="1" stopColor="#4fd1c5" stopOpacity="0" /></radialGradient>
        </defs>
        <g clipPath="url(#outPocket)">
          <ellipse cx={wx} cy={wy + 380} rx="240" ry="260" fill="url(#keyRim9)" opacity={pull} />
          <g transform={`translate(${wx + 10} ${wy + 220}) rotate(${84 + 6 * Math.sin(t * 2)}) scale(1.35)`}><Key /></g>
          <g transform={`translate(${wx} ${wy}) rotate(${178 - 8 * pull}) scale(1.2)`}>
            <Hand sleeve="#2f2733" skin="#d4ae9a" shade="#8f6b5f" curl={0.55} spread={0.5} />
          </g>
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — iron key pressed against the wet hide, steam curling */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.05 * EIO(p), dx: 0, dy: 0, ox: 560, oy: 1000 };
  const tp = wordAt(10, /pressed/, 0.15);
  const press = ramp(t, tp - 0.2, tp + 0.6);
  const contact = ramp(t, tp + 0.5, wordAt(10, /neck/, 0.85));
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="close/hide" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <radialGradient id="burn"><stop offset="0" stopColor="#4fd1c5" stopOpacity="0.5" /><stop offset="0.5" stopColor="#4fd1c5" stopOpacity="0.12" /><stop offset="1" stopColor="#4fd1c5" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="700" cy="1010" rx={160 + 140 * contact} ry={110 + 90 * contact} fill="url(#burn)" opacity={contact} />
        <g transform={`translate(${380 - 200 * (1 - press)} ${1000 + 60 * (1 - press)}) rotate(-8)`}>
          <g transform="scale(1.6)"><Key /></g>
          <g transform="translate(-150 40) rotate(96) scale(1.3)">
            <Hand sleeve="#2f2733" skin="#d4ae9a" shade="#8f6b5f" curl={0.6} spread={0.4} />
          </g>
        </g>
        <Steam x={780} y={960} t={t} amt={contact} />
        <TopMane t={t + 2} />
      </Live>
    </AbsoluteFill>
  );
};
