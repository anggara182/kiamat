import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { SC, FLOOR, STALLS, SW, DOOR_TOP, Defs, StallFront } from '../sets/stall';

const BG = '#0d1110';
const S3 = STALLS[2].x;

/** Fluorescent tube glow; flicker by opacity only. */
const Tube: React.FC<{ t: number }> = ({ t }) => {
  const fl = (Math.sin(t * 23) > 0.93 || Math.sin(t * 7.3 + 1) > 0.97) ? 0.35 : 1;
  return (
    <g opacity={fl}>
      <defs><radialGradient id="bTube" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={SC.light} stopOpacity="0.55" /><stop offset="1" stopColor={SC.light} stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={690} cy={360} rx={520} ry={260} fill="url(#bTube)" />
      <rect x={535} y={350} width={310} height={12} rx={6} fill="#ffffff" />
    </g>
  );
};

/** a schoolgirl from behind: navy sailor uniform, white collar, black bob */
const GirlBack: React.FC<{ x: number; y: number; s: number; hand?: number }> = ({ x, y, s, hand = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 120 C -120 60 -70 30 0 30 C 70 30 120 60 110 120 L 130 420 L -130 420 Z" fill="#1d2740" />
    <path d="M -90 60 L 0 40 L 90 60 L 80 150 L -80 150 Z" fill="#e9eef2" />
    <path d="M -80 135 L 80 135" stroke="#1d2740" strokeWidth={8} />
    <path d="M -130 420 L 130 420 L 160 640 L -160 640 Z" fill="#141b2e" />
    {[-100, -50, 0, 50, 100].map((k) => <line key={k} x1={k * 1.1} y1={425} x2={k * 1.4} y2={636} stroke="#0a0e18" strokeWidth={5} />)}
    <path d="M -70 640 L -40 640 L -45 820 L -70 820 Z M 40 640 L 70 640 L 70 820 L 45 820 Z" fill="#d9d4cc" opacity={0.85} />
    {/* arms */}
    <path d="M -110 90 Q -150 260 -140 410 L -110 410 Q -110 260 -88 120 Z" fill="#18213a" />
    <path d={`M 98 100 L ${140 + 40 * hand} ${250 - 130 * hand} L ${125 - 95 * hand} ${400 - 420 * hand}`} stroke="#18213a" strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d={`M ${140 + 40 * hand} ${250 - 130 * hand} L ${125 - 95 * hand} ${400 - 420 * hand}`} stroke={SC.light} strokeOpacity={0.12 * hand} strokeWidth={6} fill="none" transform="translate(16 -10)" />
    <ellipse cx={0} cy={-60} rx={78} ry={92} fill="#0d0b10" />
    <path d="M -86 -50 C -96 30 -70 60 -60 64 L 60 64 C 70 60 96 30 86 -50 C 80 -150 -80 -150 -86 -50 Z" fill="#0b090d" />
    {[-50, -20, 15, 45].map((k) => <path key={k} d={`M ${k} -140 Q ${k * 1.3} -40 ${k * 1.25} 60`} stroke="#3a3440" strokeWidth={4} fill="none" opacity={0.7} />)}
    <path d="M -84 -60 C -88 -120 -40 -152 0 -152" stroke={SC.light} strokeOpacity={0.35} strokeWidth={5} fill="none" />
  </g>
);

/** shot 5 — wide, row of stalls, slow push-in, tube flickers. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.12 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 760, oy: 1000 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/room" cam={cam} />
      <Live cam={cam}><Tube t={t} /></Live>
    </AbsoluteFill>
  );
};

/** A girl's right fist from the back (knuckles toward the door, at local 0,0), navy sleeve with white cuff. */
const Fist: React.FC = () => (
  <g>
    <path d="M 150 -10 L 760 560 L 760 900 L 60 120 Z" fill="#1d2740" />
    <path d="M 150 -10 L 420 240" stroke="#2d3a5c" strokeWidth={10} fill="none" />
    <path d="M 128 -18 L 196 50 L 96 150 L 40 86 Z" fill="#e9eef2" />
    <path d="M 196 50 L 96 150" stroke="#9aa3b3" strokeWidth={6} />
    {/* back of hand */}
    <path d="M 20 -92 C 70 -112 128 -96 150 -46 C 160 0 150 60 120 108 C 90 130 50 130 22 110 Z" fill="#e2b49c" />
    <path d="M 40 -60 C 80 -50 110 -20 122 20" stroke="#c48f78" strokeWidth={5} fill="none" opacity={0.6} />
    {/* thumb wrapped under */}
    <path d="M 118 96 C 90 132 30 140 -4 120 C -20 108 -8 92 12 96 C 46 104 80 98 104 82 Z" fill="#d6a68d" stroke="#a87560" strokeWidth={4} />
    {/* four curled finger segments, knuckles facing the door */}
    {[-92, -48, -4, 40].map((y, i) => (
      <g key={i}>
        <rect x={-34} y={y} width={70} height={46} rx={21} fill={i % 2 ? '#dcae95' : '#e4b8a0'} stroke="#a87560" strokeWidth={4} />
        <path d={`M -16 ${y + 8} q -12 15 0 30`} stroke="#a87560" strokeWidth={3} fill="none" opacity={0.7} />
        <ellipse cx={22} cy={y + 22} rx={12} ry={14} fill="#f2d2bf" opacity={0.85} />
      </g>
    ))}
    <path d="M 26 -92 C 70 -110 126 -96 148 -50" stroke="#fff1e6" strokeOpacity={0.55} strokeWidth={5} fill="none" />
  </g>
);

/** shot 6 — close, knuckles knocking on door 3, on One / Two / Three. */
export const S06: React.FC = () => {
  const { t } = useShot();
  const knocks = [wordAt(6, /^One/, 0.25), wordAt(6, /^Two/, 0.35), wordAt(6, /^Three/, 0.45)];
  let hit = 0;
  for (const k of knocks) { const d = t - k; if (d > -0.14 && d < 0.2) hit = Math.max(hit, d < 0 ? 1 + d / 0.14 : 1 - d / 0.2); }
  const pre = ramp(t, 0, knocks[0] - 0.3, EIO), post = ramp(t, knocks[2] + 0.4, knocks[2] + 1.2, EIO);
  const d = 1 - hit; // 0 = touching
  const away = 0.35 * d + 0.65 * (1 - pre) + 0.65 * post;
  const h = handheld(t, 0.4);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0, tx: h.hx, ty: h.hy };
  const fx = 690 + 70 * away, fy = 1000 + 50 * away, sc = 1 + 0.16 * away;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/door" cam={cam} />
      <Live cam={cam}>
        <defs><radialGradient id="bKnock" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#1a1610" stopOpacity="0.55" /><stop offset="1" stopColor="#1a1610" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={690 + 40 + 90 * away} cy={1000 + 30 + 80 * away} rx={130 + 80 * away} ry={150 + 70 * away} fill="url(#bKnock)" opacity={1 - 0.5 * away} />
        <g transform={`translate(${fx} ${fy}) scale(${sc})`}><Fist /></g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 7 — two girls from behind before the closed third door; friend's hand rises to her mouth on "voice". */
export const S07: React.FC = () => {
  const { t, p } = useShot();
  const tv = wordAt(7, /voice/, 0.75);
  const hand = ramp(t, tv - 0.9, tv + 0.1, EIO);
  const cam: Cam = { zoom: 1.6, dx: 0, dy: 0, ox: 867, oy: 1000, tx: -260 - 10 * p, ty: 40 };
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/room" cam={cam} />
      <Live cam={cam}><Tube t={t} /></Live>
      <Live cam={{ zoom: 1, dx: 0, dy: 0 }}>
        <GirlBack x={420} y={1230} s={1.15} />
        <GirlBack x={870} y={1260} s={1.1} hand={hand} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 8 — the gap under the third door: red pleated hem and the toes of two small red shoes. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const z = 3 + 0.25 * p;
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ox: 867, oy: 1309, tx: -327, ty: -380 };
  const adv = ramp(t, wordAt(8, /here/, 0.7) - 0.6, wordAt(8, /here/, 0.85, 'end'), EIO);
  const sx = 975, top = FLOOR - 70;
  const Shoe: React.FC<{ x: number }> = ({ x }) => (
    <g>
      <path d={`M ${x - 26} ${FLOOR - 8 + 6 * adv} C ${x - 28} ${FLOOR - 24} ${x - 14} ${FLOOR - 30} ${x} ${FLOOR - 30} C ${x + 14} ${FLOOR - 30} ${x + 28} ${FLOOR - 24} ${x + 26} ${FLOOR - 8 + 6 * adv} Z`} fill={SC.red} />
      <path d={`M ${x - 22} ${FLOOR - 26} Q ${x} ${FLOOR - 32} ${x + 22} ${FLOOR - 26}`} stroke="#5a0d18" strokeWidth={4} fill="none" />
      <path d={`M ${x - 18} ${FLOOR - 28} L ${x + 18} ${FLOOR - 22}`} stroke="#3a0810" strokeWidth={4} /><circle cx={x + 16} cy={FLOOR - 23} r={2} fill="#e8e0d0" />
      <ellipse cx={x - 6} cy={FLOOR - 20} rx={8} ry={3} fill="#ff9aa6" opacity={0.6} />
      <rect x={x - 26} y={FLOOR - 9 + 6 * adv} width={52} height={3} fill="#3a0810" />
    </g>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/room" cam={cam} />
      <Live cam={cam}>
        <defs><clipPath id="bGap"><rect x={S3 + 6} y={top} width={SW - 12} height={80} /></clipPath>
          <radialGradient id="bRed" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={SC.red} stopOpacity="0.4" /><stop offset="1" stopColor={SC.red} stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={sx} cy={FLOOR - 10} rx={170} ry={46} fill="url(#bRed)" />
        <g clipPath="url(#bGap)">
          {/* pleated hem just under the door bottom */}
          <path d={`M ${sx - 70} ${top} L ${sx + 70} ${top} L ${sx + 76} ${top + 18} L ${sx - 76} ${top + 18} Z`} fill="#8e1a2b" />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${sx - 64 + i * 16} ${top} L ${sx - 68 + i * 17} ${top + 18}`} stroke="#5a0d18" strokeWidth={3} />)}
          <path d={`M ${sx - 76} ${top + 18} L ${sx + 76} ${top + 18}`} stroke={SC.red} strokeWidth={3} />
          <path d={`M ${sx - 46} ${top + 18} h 20 l 2 26 h -24 Z M ${sx + 26} ${top + 18} h 20 l 2 26 h -24 Z`} fill="#d8d2c8" opacity={0.75} />
        </g>
        <Shoe x={sx - 28} /><Shoe x={sx + 28} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — low angle, door 3 creeps open; a small red shoe inside on the tiles, lit by the flickering tube. */
export const S09: React.FC = () => {
  const { t } = useShot();
  const t0 = wordAt(9, /open/, 0.3);
  const o = ramp(t, t0 - 0.2, wordAt(9, /Slowly/, 0.45, 'end') + 0.4, EIO) * 0.72;
  const shoe = ramp(t, t0 + 0.2, t0 + 1.0, EIO);
  const fl = (Math.sin(t * 23) > 0.93 || Math.sin(t * 7.3 + 1) > 0.97) ? 0.4 : 1;
  const cam: Cam = { zoom: 2, dx: 0, dy: 0, ox: 867, oy: 1250, tx: -327, ty: -60 };
  const cx = S3 + 6, shx = cx + 200;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/room" cam={cam} />
      <Live cam={cam}>
        <Defs />
        <defs>
          <radialGradient id="bShoeG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={SC.red} stopOpacity="0.5" /><stop offset="1" stopColor={SC.red} stopOpacity="0" /></radialGradient>
          <radialGradient id="bPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={SC.light} stopOpacity="0.35" /><stop offset="1" stopColor={SC.light} stopOpacity="0" /></radialGradient>
        </defs>
        <rect x={cx} y={DOOR_TOP} width={SW - 12} height={FLOOR - DOOR_TOP} fill={SC.ink} />
        <rect x={cx} y={FLOOR - 150} width={SW - 12} height={150} fill="#1b2120" />
        {[0, 1, 2].map((i) => <line key={i} x1={cx} y1={FLOOR - 150 + i * 50} x2={cx + SW} y2={FLOOR - 150 + i * 50} stroke="#0c100f" strokeWidth={3} />)}
        <ellipse cx={shx} cy={FLOOR - 20} rx={150} ry={60} fill="url(#bPool)" opacity={fl * shoe} />
        <StallFront x={S3} open={o} num="3" />
        <g opacity={shoe} transform={`translate(${shx} ${FLOOR}) scale(1.75) translate(${-shx} ${-FLOOR})`}>
          <ellipse cx={shx} cy={FLOOR - 26} rx={80} ry={36} fill="url(#bShoeG)" />
          <ellipse cx={shx} cy={FLOOR - 9} rx={44} ry={6} fill="#000" opacity={0.6} />
          <path d={`M ${shx - 44} ${FLOOR - 10} C ${shx - 44} ${FLOOR - 28} ${shx - 28} ${FLOOR - 34} ${shx - 10} ${FLOOR - 32} L ${shx + 8} ${FLOOR - 28} C ${shx + 30} ${FLOOR - 26} ${shx + 44} ${FLOOR - 20} ${shx + 44} ${FLOOR - 10} Z`} fill={SC.red} />
          <path d={`M ${shx - 34} ${FLOOR - 28} C ${shx - 20} ${FLOOR - 22} ${shx - 4} ${FLOOR - 22} ${shx + 6} ${FLOOR - 28}`} fill="#3a0810" />
          <path d={`M ${shx - 12} ${FLOOR - 32} Q ${shx - 2} ${FLOOR - 20} ${shx + 16} ${FLOOR - 27}`} stroke="#5a0d18" strokeWidth={4} fill="none" />
          <circle cx={shx + 14} cy={FLOOR - 27} r={2.5} fill="#e8e0d0" />
          <path d={`M ${shx - 44} ${FLOOR - 11} L ${shx + 44} ${FLOOR - 11}`} stroke="#2a060c" strokeWidth={3} />
          <path d={`M ${shx - 40} ${FLOOR - 20} Q ${shx - 30} ${FLOOR - 32} ${shx - 14} ${FLOOR - 31}`} stroke={SC.light} strokeOpacity={0.5 * fl} strokeWidth={3} fill="none" />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — two stalls and a bare tiled wall; faint knuckle marks appear on "knocks". */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.18 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 867, oy: 1000 };
  const tk = wordAt(12, /knocks/, 0.7);
  const ks = [0, 1, 2].map((i) => ramp(t, tk + 0.35 * i, tk + 0.35 * i + 0.4, EIO));
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BandImg id="stall/room2" cam={cam} />
      <Live cam={cam}>
        <Tube t={t} />
        {ks.map((k, i) => (
          <g key={i} opacity={0.4 * k} transform={`translate(${S3 + 120 + i * 30} ${1000 + i * 26})`}>
            {[0, 1, 2, 3].map((j) => <ellipse key={j} cx={j * 26} cy={j * 5} rx={11} ry={15} fill="#141816" />)}
          </g>
        ))}
      </Live>
    </AbsoluteFill>
  );
};
