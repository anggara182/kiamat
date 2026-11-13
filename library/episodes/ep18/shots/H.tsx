import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { Wife, OilLamp, LampGlow } from '../art/house_lib';
import { BigEye } from '../art/house_eye';
import { HFLOOR } from '../sets/house';

const FW = 1080, FH = 1920;
const LAMP = '#ffbf6b', MOON = '#cdd6ee';
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));
const flick = (t: number) => 0.9 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 29 + 1);

/** Lola: grey bun, house dress, seated or standing. Built from primitives. dir 1 = facing right. */
const Lola: React.FC<{ x: number; y: number; h: number; dir?: number; sit?: boolean; bead?: number }> = ({ x, y, h, dir = 1, sit, bead = 0 }) => {
  const u = h / 7;
  const dress = '#3a3040', skin = '#8a6448';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      {sit ? (
        <path d={`M ${-1.3 * u} 0 Q ${-1.2 * u} ${-1.2 * u} ${-0.7 * u} ${-2.6 * u} L ${0.7 * u} ${-2.6 * u} Q ${1.6 * u} ${-1.6 * u} ${2.0 * u} ${-0.4 * u} L ${2.0 * u} 0 Z`} fill={dress} />
      ) : (
        <path d={`M ${-0.75 * u} ${-3.4 * u} Q ${-0.9 * u} ${-1.5 * u} ${-0.8 * u} 0 L ${0.85 * u} 0 Q ${0.95 * u} ${-1.5 * u} ${0.75 * u} ${-3.4 * u} Z`} fill={dress} />
      )}
      <g transform={sit ? `translate(0 ${2.0 * u})` : undefined}>
        <path d={`M ${-0.75 * u} ${-3.3 * u} L ${-0.9 * u} ${-5.2 * u} Q ${0.1 * u} ${-5.7 * u} ${0.85 * u} ${-5.2 * u} L ${0.75 * u} ${-3.3 * u} Z`} fill={dress} />
        <path d={`M ${0.85 * u} ${-5.2 * u} L ${0.75 * u} ${-3.4 * u}`} stroke={LAMP} strokeWidth={0.1 * u} opacity={0.7} />
        <rect x={-0.13 * u} y={-5.85 * u} width={0.26 * u} height={0.4 * u} fill={skin} />
        <ellipse cx={0.1 * u} cy={-6.25 * u} rx={0.42 * u} ry={0.5 * u} fill={skin} />
        {/* grey hair + bun */}
        <path d={`M ${-0.44 * u} ${-6.1 * u} Q ${-0.4 * u} ${-6.85 * u} ${0.2 * u} ${-6.8 * u} Q ${0.5 * u} ${-6.6 * u} ${0.45 * u} ${-6.35 * u} Q ${0.05 * u} ${-6.5 * u} ${-0.1 * u} ${-5.9 * u} Z`} fill="#9a9aa2" />
        <circle cx={-0.5 * u} cy={-6.55 * u} r={0.28 * u} fill="#a8a8b0" />
        <path d={`M ${0.5 * u} ${-6.5 * u} Q ${0.58 * u} ${-6.1 * u} ${0.42 * u} ${-5.85 * u}`} stroke={LAMP} strokeWidth={0.08 * u} fill="none" />
        {/* arms forward holding rosary */}
        <path d={`M ${0.5 * u} ${-5.0 * u} Q ${0.7 * u} ${-4.0 * u} ${1.1 * u} ${-3.9 * u}`} stroke={skin} strokeWidth={0.26 * u} fill="none" strokeLinecap="round" />
        <circle cx={1.15 * u} cy={-3.95 * u} r={0.16 * u} fill={skin} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i / 6) * Math.PI + bead * 0.5;
          return <circle key={i} cx={1.15 * u + Math.cos(a) * 0.25 * u} cy={-3.7 * u + Math.sin(a) * 0.35 * u} r={0.05 * u} fill="#7d5b3d" />;
        })}
        <path d={`M ${1.15 * u} ${-3.4 * u} l 0 ${0.25 * u} M ${1.07 * u} ${-3.27 * u} l ${0.16 * u} 0`} stroke="#b08a5a" strokeWidth={0.04 * u} />
      </g>
    </g>
  );
};

/** Girl ~10, back/side view, dark. */
const Girl: React.FC<{ x: number; y: number; h: number; dir?: number }> = ({ x, y, h, dir = 1 }) => {
  const u = h / 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <path d={`M ${-0.7 * u} 0 L ${-0.8 * u} ${-2.4 * u} Q ${-0.6 * u} ${-4.2 * u} 0 ${-4.3 * u} Q ${0.6 * u} ${-4.2 * u} ${0.8 * u} ${-2.4 * u} L ${0.7 * u} 0 Z`} fill="#4a3a2e" />
      <path d={`M ${0.6 * u} ${-4.1 * u} Q ${0.85 * u} ${-3.0 * u} ${0.8 * u} ${-2.4 * u}`} stroke={LAMP} strokeWidth={0.1 * u} fill="none" opacity={0.6} />
      <ellipse cx={0.05 * u} cy={-4.85 * u} rx={0.5 * u} ry={0.58 * u} fill="#7a5640" />
      <path d={`M ${-0.55 * u} ${-4.7 * u} Q ${-0.5 * u} ${-5.6 * u} ${0.2 * u} ${-5.5 * u} Q ${0.6 * u} ${-5.3 * u} ${0.5 * u} ${-4.9 * u} Q 0 ${-5.1 * u} ${-0.2 * u} ${-4.4 * u} Q ${-0.6 * u} ${-3.8 * u} ${-0.7 * u} ${-3.6 * u} Z`} fill="#0b0807" />
    </g>
  );
};

/** neighbor: reuse Wife but with neighbor palette via a wrapper (dir -1 faces left). Dish in hand when offering. */
const Neighbor: React.FC<{ x: number; y: number; h: number; dir?: number; sway?: number; dish?: boolean }> = ({ x, y, h, dir = -1, sway = 0, dish }) => {
  const u = h / 7;
  return (
    <g>
      <Wife x={x} y={y} h={h} dir={dir} sway={sway} topC="#4a5a4a" skirtC="#2e3a4a" />
      {dish && (
        <g transform={`translate(${x + dir * 1.35 * u} ${y - 4.05 * u})`}>
          <ellipse cx={0} cy={0} rx={0.55 * u} ry={0.14 * u} fill="#d8c8a8" />
          <path d={`M ${-0.4 * u} 0 Q 0 ${-0.4 * u} ${0.4 * u} 0 Z`} fill="#f0e2c0" />
          <path d={`M ${-0.55 * u} 0 Q 0 ${0.25 * u} ${0.55 * u} 0`} stroke={LAMP} strokeWidth={3} fill="none" />
        </g>
      )}
    </g>
  );
};

const Room: React.FC<{ cam: Cam; t: number; crib?: boolean; lampX?: number; lampY?: number; lampO?: number; children?: React.ReactNode }> = ({ cam, t, crib = true, lampX = 660, lampY = 1320, lampO = 1, children }) => (
  <>
    <BandImg id="house/room" cam={cam} k={0.6} />
    <Live cam={cam} k={0.6}><LampGlow x={lampX} y={lampY - 60} r={700} o={0.55 * flick(t) * lampO} id="hglowbg" /></Live>
    {crib && <BandImg id="house/crib" cam={cam} k={0.85} />}
    <Live cam={cam} k={1}>
      {children}
      <LampGlow x={lampX} y={lampY - 60} r={260} o={0.9 * flick(t) * lampO} id="hglowfg" />
      <OilLamp x={lampX} y={lampY} s={1.6} flick={flick(t)} />
    </Live>
    <BandImg id="house/fg" cam={cam} k={1.25} />
  </>
);

/** shot 4: mother with baby (left), kind neighbor offering a dish (right), lamp between. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.2);
  const cam: Cam = { zoom: 1.12 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: -40, tx: h.hx, ty: h.hy, ox: 560, oy: 900 };
  const offer = ramp(p, 0.35, 0.65, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0a07' }}>
      <Room cam={cam} t={t} crib={false} lampX={640} lampY={1180}>
        <rect x={560} y={1180} width={160} height={380} fill="#1a130b" />
        <Wife x={400} y={HFLOOR} h={780} dir={1} baby topC="#6b5638" skirtC="#5a4426" />
        <Neighbor x={900 - 30 * offer} y={HFLOOR} h={800} dir={-1} sway={-4 * offer} dish />
      </Room>
    </AbsoluteFill>
  );
};

/** shot 5: close, garlic bulbs hanging at the capiz window; salt bowl on the threshold. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const salt = ramp(p, wp(5, /salt/, 0.75, sec) - 0.1, wp(5, /salt/, 0.75, sec) + 0.05, EIO);
  const cam: Cam = { zoom: 1 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: -260 * salt, ox: 540, oy: 800 };
  const sw = Math.sin(t * 1.2) * 2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0a07' }}>
      <Live cam={cam} w={FW} h={FH}>
        <defs>
          <radialGradient id="h5moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={MOON} stopOpacity="0.55" /><stop offset="1" stopColor={MOON} stopOpacity="0" /></radialGradient>
          <linearGradient id="h5wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c160e" /><stop offset="1" stopColor="#2a2318" /></linearGradient>
          <radialGradient id="h5bulb" cx="0.4" cy="0.35" r="0.6"><stop offset="0" stopColor="#fffaf0" /><stop offset="0.6" stopColor="#efe6d2" /><stop offset="1" stopColor="#9a8a70" /></radialGradient>
        </defs>
        <rect x={-100} y={-400} width={1280} height={2800} fill="url(#h5wall)" />
        {/* window opening with capiz panes */}
        <circle cx={400} cy={640} r={560} fill="url(#h5moon)" />
        <rect x={140} y={240} width={520} height={820} fill="#0e0f14" />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={160 + c * 166} y={260 + r * 262} width={150} height={242} fill="#e9e2cf" opacity={0.3 + 0.08 * ((r + c) % 3)} />))}
        <rect x={120} y={220} width={560} height={860} fill="none" stroke="#140f0a" strokeWidth={44} />
        <rect x={70} y={190} width={660} height={40} fill="#1a130b" />
        {/* garlic string */}
        <g transform={`rotate(${sw} 400 200)`}>
          <path d="M 400 200 L 400 980" stroke="#8a7550" strokeWidth={6} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 330 + i * 120, x = 400 + (i % 2 ? 46 : -46);
            return (
              <g key={i}>
                <path d={`M 400 ${y - 40} L ${x} ${y - 30}`} stroke="#8a7550" strokeWidth={8} />
                <path d={`M ${x} ${y - 60} Q ${x - 70} ${y - 10} ${x - 54} ${y + 40} Q ${x} ${y + 76} ${x + 54} ${y + 40} Q ${x + 70} ${y - 10} ${x} ${y - 60} Z`} fill="url(#h5bulb)" />
                <path d={`M ${x - 18} ${y - 30} Q ${x - 26} ${y + 20} ${x - 12} ${y + 56} M ${x + 18} ${y - 30} Q ${x + 26} ${y + 20} ${x + 12} ${y + 56}`} stroke="#b8a888" strokeWidth={3} fill="none" />
                <path d={`M ${x + 52} ${y - 10} Q ${x + 64} ${y + 20} ${x + 50} ${y + 44}`} stroke={LAMP} strokeWidth={5} fill="none" opacity={0.7} />
              </g>
            );
          })}
        </g>
        {/* doorway on the right: moonlit yard beyond, wooden frame */}
        <rect x={770} y={560} width={250} height={680} fill="#1c2338" />
        <circle cx={900} cy={760} r={260} fill="url(#h5moon)" />
        <path d="M 770 1000 Q 840 940 900 980 Q 960 930 1020 990 L 1020 1240 L 770 1240 Z" fill="#060807" />
        <rect x={740} y={540} width={34} height={710} fill="#2a1f14" />
        <rect x={1016} y={540} width={34} height={710} fill="#2a1f14" />
        <rect x={720} y={520} width={350} height={40} fill="#3a2c1a" />
        <path d="M 774 560 L 774 1240" stroke={LAMP} strokeWidth={4} opacity={0.5} />
        {/* threshold beam + floor */}
        <rect x={-100} y={1240} width={1280} height={44} fill="#3a2c1a" />
        <path d="M -100 1240 L 1180 1240" stroke={LAMP} strokeWidth={4} opacity={0.35} />
        <rect x={-100} y={1284} width={1280} height={1100} fill="#120d08" />
        <LampGlow x={560} y={1250} r={380} o={0.7 * flick(t)} id="h5lamp" />
        {/* salt bowl on the threshold, in front of the doorway */}
        <g transform="translate(410 -10)">
          <path d="M 330 1250 Q 330 1335 450 1342 Q 570 1335 570 1250 Z" fill="#7d5b3d" />
          <path d="M 340 1250 Q 450 1196 560 1250 Z" fill="#f4efe4" />
          <path d="M 330 1250 L 570 1250" stroke={LAMP} strokeWidth={5} opacity={0.8} />
          <path d="M 560 1256 Q 562 1310 520 1334" stroke={LAMP} strokeWidth={4} fill="none" opacity={0.6} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={380 + i * 40} cy={1272 + (i % 2) * 6} r={4} fill="#f4efe4" opacity={0.7} />)}
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 6: Lola + girl (left fg) watching the neighbor lean over the crib. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const lean = ramp(p, 0, wp(6, /leaned/, 0.25, sec) + 0.12, EIO);
  const whisper = ramp(p, wp(6, /whispered/, 0.65, sec) - 0.05, wp(6, /whispered/, 0.65, sec) + 0.08, EIO);
  const h = handheld(t, 0.12);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: -30, tx: h.hx, ty: h.hy, ox: 540, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0a07' }}>
      <Room cam={cam} t={t} lampX={1020} lampY={1300}>
        <rect x={950} y={1300} width={140} height={260} fill="#1a130b" />
        <Neighbor x={930} y={HFLOOR - 60} h={820} dir={-1} sway={9 * lean} />
        {/* crib front rail over her legs so she stands behind it */}
        <g transform={`translate(760 ${HFLOOR})`}>
          <path d="M -230 -40 L -250 -300 L 250 -300 L 230 -40 Z" fill="#2c2115" opacity={0.92} />
          {[-180, -110, -40, 30, 100, 170].map((x) => <rect key={x} x={x} y={-290} width={14} height={240} fill="#140f0a" />)}
          <path d="M -255 -305 L 255 -305" stroke="#8a6a40" strokeWidth={14} strokeLinecap="round" />
          <path d="M -40 -300 L 120 -300" stroke={LAMP} strokeWidth={4} opacity={0.6} />
        </g>
        <Lola x={300} y={HFLOOR + 40} h={760} dir={1} />
        <g transform={`rotate(${-6 * whisper} 420 1100)`}><Girl x={430} y={HFLOOR + 60} h={500} dir={1} /></g>
      </Room>
    </AbsoluteFill>
  );
};

/** shot 7: extreme close, the neighbor's eye; the girl's reflection upside down in the pupil. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const refl = ramp(p, wp(7, /myself/, 0.5, sec) - 0.1, wp(7, /Upside/, 0.7, sec), EIO);
  const z = 1 + 0.18 * ramp(p, 0, 1, EIO);
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0f08' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(540 760) scale(${z})`}>
          <BigEye id="h7" refl={0.25 + 0.75 * refl} look={-0.2 + 0.1 * Math.sin(t * 0.7)} />
        </g>
        <defs><radialGradient id="h7lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={LAMP} stopOpacity="0.25" /><stop offset="1" stopColor={LAMP} stopOpacity="0" /></radialGradient></defs>
        <circle cx={900} cy={300} r={500 * flick(t)} fill="url(#h7lamp)" />
        <path d={`M 0 ${FH} L 0 1250 Q 540 1150 ${FW} 1250 L ${FW} ${FH} Z`} fill="#0d0805" opacity={0.75} />
      </svg>
    </AbsoluteFill>
  );
};

/** shot 9: Lola seated by the crib praying, lamp low, roof in shadow above. */
export const S09: React.FC = () => {
  const { p, t, sec } = useShot();
  const creak = ramp(p, wp(9, /creaked/, 0.85, sec) - 0.06, wp(9, /creaked/, 0.85, sec) + 0.04, EIO);
  const cam: Cam = { zoom: 1.15, dx: 0, dy: 60, ox: 540, oy: 1000, tx: 0, ty: -10 * creak * Math.sin(t * 30) * 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0a07' }}>
      <Room cam={cam} t={t} lampX={580} lampY={1470} lampO={0.75}>
        <rect x={530} y={1470} width={100} height={90} fill="#1a130b" />
        <Lola x={400} y={HFLOOR} h={760} dir={1} sit bead={Math.floor(t * 1.2)} />
        {/* dust drifting from the roof as it creaks */}
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={640 + i * 70} cy={480 + creak * (200 + i * 60)} r={3} fill={MOON} opacity={creak * (1 - creak * 0.5) * 0.7} />)}
      </Room>
    </AbsoluteFill>
  );
};

/** shot 10: moonlit gap in the thatch, dark shape shifting behind it. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const shift = ramp(p, 0.15, 0.85, EIO);
  const z = 1 + 0.1 * ramp(p, 0, 1, EIO);
  const sniff = Math.sin(t * 5) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: '#07070a' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="h10m" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={MOON} stopOpacity="1" /><stop offset="0.5" stopColor="#8f9ac0" stopOpacity="0.6" /><stop offset="1" stopColor="#3a4260" stopOpacity="0" /></radialGradient>
          <clipPath id="h10gap"><path d="M 380 520 Q 520 430 700 500 Q 760 640 690 780 Q 540 860 400 790 Q 330 650 380 520 Z" /></clipPath>
        </defs>
        <g transform={`translate(540 700) scale(${z}) translate(-540 -700)`}>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#141008" />
          {/* thatch strands */}
          {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M ${-100 + i * 60} -100 Q ${-60 + i * 60} 600 ${-120 + i * 62} 1300`} stroke={i % 2 ? '#3d3322' : '#2a2318'} strokeWidth={34} fill="none" />)}
          {/* the gap: moon sky + shape */}
          <g clipPath="url(#h10gap)">
            <rect x={300} y={400} width={500} height={500} fill="#2a3150" />
            <circle cx={560} cy={640} r={300} fill="url(#h10m)" />
            <g transform={`translate(${-200 + 150 * shift} ${sniff})`}>
              <path d="M 380 860 Q 400 640 540 570 Q 600 540 640 548 Q 660 520 700 530 Q 730 545 728 575 L 800 600 L 726 602 Q 740 700 720 860 Z" fill="#050507" />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${430 + i * 30} ${680 + i * 10} l -40 ${70 + i * 8}`} stroke="#050507" strokeWidth={14} strokeLinecap="round" />)}
              <path d="M 640 548 Q 660 520 700 530 Q 730 545 728 575" stroke={MOON} strokeWidth={4} fill="none" opacity={0.6} />
              <circle cx={700} cy={560} r={7} fill="#e9d9b0" opacity={0.85} />
            </g>
          </g>
          <path d="M 380 520 Q 520 430 700 500 Q 760 640 690 780 Q 540 860 400 790 Q 330 650 380 520 Z" fill="none" stroke="#0b0906" strokeWidth={40} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${400 + i * 55} ${790 + (i % 2) * 20} q ${8 - i * 3} 60 ${-6 + i * 2} 120`} stroke="#3d3322" strokeWidth={10} strokeLinecap="round" />)}
          <path d="M 700 500 Q 760 640 690 780" stroke={MOON} strokeWidth={6} fill="none" opacity={0.5} />
          {/* moon beam toward the crib */}
          <path d="M 420 800 L 680 800 L 900 1500 L 160 1500 Z" fill={MOON} opacity={0.06} />
          <rect x={-200} y={1260} width={1480} height={60} fill="#050403" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** shot 12: a friendly woman's face (3/4, lamp-lit), slow push ending on one eye with the inverted reflection. */
export const S12: React.FC = () => {
  const { p, t, sec } = useShot();
  const refl = ramp(p, wp(12, /eyes/, 0.65, sec), wp(12, /upside/i, 0.85, sec), EIO);
  const k = ramp(p, 0.42, 0.97, EIO);
  const z = 1 + 0.06 * ramp(p, 0, 0.42, EIO) + 4.4 * k;
  const E = { x: 598, y: 690 };
  const cx = 540 + (E.x - 540) * k, cy = 820 + (E.y - 820) * k;
  const fl = flick(t);
  const SKA = '#e3b08a', SKB = '#7a4a32';
  return (
    <AbsoluteFill style={{ backgroundColor: '#140e0a' }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="h12bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#120c08" /><stop offset="1" stopColor="#3a2a1a" /></linearGradient>
          <radialGradient id="h12lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={LAMP} stopOpacity="0.55" /><stop offset="1" stopColor={LAMP} stopOpacity="0" /></radialGradient>
          <radialGradient id="h12sk" cx="0.68" cy="0.38" r="0.75"><stop offset="0" stopColor={SKA} /><stop offset="0.6" stopColor="#b47a56" /><stop offset="1" stopColor={SKB} /></radialGradient>
          <radialGradient id="h12dark" cx="0.5" cy="0.4" r="0.7"><stop offset="0.45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.7" /></radialGradient>
        </defs>
        <rect x={0} y={0} width={FW} height={FH} fill="url(#h12bg)" />
        <circle cx={960} cy={560} r={620 * fl} fill="url(#h12lamp)" />
        <g transform={`translate(540 760) scale(${z}) translate(${-cx} ${-cy})`}>
          {/* hair mass behind */}
          <path d="M 300 560 Q 300 300 520 290 Q 760 300 770 560 Q 800 900 820 1300 L 240 1300 Q 260 900 300 560 Z" fill="#0c0807" />
          {/* neck + shoulders */}
          <path d="M 490 950 L 585 950 L 590 1080 Q 820 1110 900 1300 L 180 1300 Q 260 1110 470 1080 Z" fill="#5a3a2a" />
          <path d="M 180 1300 Q 260 1150 420 1110 L 700 1110 Q 840 1150 900 1300 Z" fill="#6b5638" />
          <path d="M 700 1110 Q 840 1150 900 1300" stroke={LAMP} strokeWidth={5} fill="none" opacity={0.7} />
          {/* face, 3/4 to the left: far cheek narrower */}
          <path d="M 520 420 Q 690 420 712 620 Q 724 760 680 860 Q 630 960 540 975 Q 460 975 420 900 Q 380 820 380 700 Q 380 470 520 420 Z" fill="url(#h12sk)" />
          <path d="M 712 620 Q 724 760 680 860 Q 630 960 540 975" stroke="#ffd9a8" strokeWidth={5} fill="none" opacity={0.75} />
          {/* brows */}
          <path d="M 400 618 Q 440 596 478 604" stroke="#2a1a12" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M 540 604 Q 600 584 664 606" stroke="#2a1a12" strokeWidth={11} fill="none" strokeLinecap="round" />
          {/* eyes */}
          <g transform="translate(442 690) scale(0.1 0.11)"><BigEye id="h12a" refl={0} bare look={-0.3} /></g>
          <g transform={`translate(${E.x} ${E.y}) scale(0.145)`}><BigEye id="h12b" refl={refl} bare look={-0.3 + 0.05 * Math.sin(t * 0.6)} /></g>
          {/* nose (bridge toward the far side), nostril, lit tip */}
          <path d="M 510 680 Q 500 760 474 806 Q 486 826 512 822" stroke="#8a5a3e" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M 520 816 Q 540 822 552 810" stroke="#6a3e2a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={498} cy={800} r={9} fill="#ffd9a8" opacity={0.45} />
          {/* soft smile */}
          <path d="M 452 880 Q 520 918 604 872 Q 540 902 452 880 Z" fill="#9a4a3e" />
          <path d="M 446 876 Q 520 924 610 866" stroke="#5a2a22" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M 604 868 q 10 -6 14 -14" stroke="#5a2a22" strokeWidth={4} fill="none" strokeLinecap="round" />
          <ellipse cx={630} cy={790} rx={56} ry={34} fill="#e07a6a" opacity={0.18} />
          {/* front hair: centre part, curtains framing the face */}
          <path d="M 520 400 Q 380 420 360 600 Q 350 820 380 1000 Q 330 860 320 680 Q 320 440 520 400 Z" fill="#0c0807" />
          <path d="M 520 400 Q 660 410 720 560 Q 740 640 730 720 Q 760 560 700 440 Q 620 380 520 400 Z" fill="#0c0807" />
          <path d="M 470 410 Q 410 470 392 600" stroke="#0c0807" strokeWidth={30} fill="none" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${700 + i * 14} ${470 + i * 30} Q ${780 + i * 8} 800 ${790 + i * 6 + Math.sin(t * 0.8 + i) * 4} ${1200 + i * 20}`} stroke={LAMP} strokeWidth={3.5 - i * 0.5} fill="none" opacity={0.55 - i * 0.08} />)}
          <path d="M 520 300 Q 700 300 760 480" stroke={LAMP} strokeWidth={4} fill="none" opacity={0.5} />
        </g>
        <rect x={0} y={0} width={FW} height={FH} fill="url(#h12dark)" opacity={0.3 + 0.6 * k} />
      </svg>
    </AbsoluteFill>
  );
};
