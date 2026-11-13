import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GL, CANDLE, GlassBg, GlassSheen, GlassClip, Glow, Candle, Girl, Smoke } from '../art/mirror_art';

const BG = '#0a0c10';
const GCX = GL.x + GL.w / 2;
/** reflection of the candle inside the glass (mirrored, darker) */
const CandleRefl: React.FC<{ t: number; flick?: number }> = ({ t, flick = 1 }) => (
  <g opacity={0.55}><Candle x={CANDLE.x + 40} top={CANDLE.top - 40} t={t + 0.3} flick={flick} /><Glow id="rg" x={CANDLE.x + 40} y={CANDLE.top - 70} r={260} o={0.6} /></g>
);

/** Bathroom: room band + glass (clipped content) + candle + room glow. */
const Bath: React.FC<{ cam: Cam; t: number; inGlass?: React.ReactNode; front?: React.ReactNode; flick?: number; day?: boolean; candle?: boolean; mary?: number; inGlass2?: React.ReactNode }> = ({ cam, t, inGlass, inGlass2, front, flick = 1, day = false, candle = true, mary = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: day ? '#8a939c' : BG }}>
    <BandImg id={day ? 'mirror/day' : 'mirror/room'} cam={cam} />
    <Live cam={cam}>
      <GlassClip id={'gc' + (day ? 'd' : 'n')} />
      <g clipPath={`url(#gc${day ? 'd' : 'n'})`}>
        <GlassBg day={day} />
        {!day && candle && <CandleRefl t={t} flick={flick} />}
        {inGlass}
      </g>
    </Live>
    {mary > 0 && <BandImg id="mirror/mary" cam={cam} style={{ opacity: mary, clipPath: `inset(${GL.y}px ${1296 - GL.x - GL.w}px ${2304 - GL.y - GL.h}px ${GL.x}px)` }} />}
    <Live cam={cam}>
      <g clipPath={`url(#gc${day ? 'd' : 'n'}2)`}>
        <GlassClip id={'gc' + (day ? 'd' : 'n') + '2'} />
        {inGlass2}
        <GlassSheen day={day} />
      </g>
      {!day && <Glow id="room" x={CANDLE.x} y={CANDLE.top - 40} r={760} o={0.75 + 0.05 * flick * Math.sin(t * 6)} />}
      {candle && !day && <Candle t={t} flick={flick} />}
      {front}
    </Live>
  </AbsoluteFill>
);

/** shot 1 — wide dark bathroom, one candle before the mirror; slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.18 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 900 };
  return <Bath cam={cam} t={t} />;
};

const GIRLS = [
  { x: 420, hair: 'pony' as const, s: 1.0 },
  { x: 660, hair: 'long' as const, s: 1.05 },
  { x: 900, hair: 'bob' as const, s: 0.98 },
];

/** shot 6 — three girls from behind facing the mirror; their reflections lit by the candle. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.08, dx: 0, dy: -40, ox: 540, oy: 900 };
  return (
    <Bath cam={cam} t={t}
      inGlass={<>{GIRLS.map((g, i) => <Girl key={i} id={'r6' + i} x={GCX + (GCX - g.x) * -0.78} y={880} s={g.s * 0.8} view="front" hair={g.hair} tone="#10141a" lit={0.55} />)}</>}
      front={<>{GIRLS.map((g, i) => <Girl key={i} id={'b6' + i} x={g.x} y={1340 + (i === 1 ? 20 : 0)} s={g.s * 1.25} view="back" hair={g.hair} />)}</>}
    />
  );
};

/** shot 7 — the mirror alone, flame steady (relief beat). */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.35 + 0.06 * p, dx: 0, dy: -60, ox: 540, oy: 860 };
  return <Bath cam={cam} t={t} flick={0.1} />;
};

/** shot 8 — one girl's reflection, candle smoke curling (she's about to blow it out). */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.9, dx: 0, dy: -10, ox: 540, oy: 760 };
  const blow = wordAt(8, /blow/i, 0.3);
  const out = clamp01((t - blow) / 0.6);
  return (
    <Bath cam={cam} t={t} flick={1 + out}
      inGlass={<Girl id="r8" x={GCX} y={840} s={1.05} view="front" hair="long" tone="#10141a" lit={0.6} />}
      front={<Smoke x={CANDLE.x} y={CANDLE.top - 60} t={t} o={0.15 + 0.85 * out} />}
    />
  );
};

/** shot 9 — extreme close on the reflection's eyes in shadow; it blinks a beat late (on "later"). */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const late = wordAt(9, /later/i, 0.8);
  const bl = (c: number) => { const d = Math.abs(t - c); return d < 0.18 ? d / 0.18 : 1; };
  const eyes = bl(late + 0.05);
  const z = 1.3 + 0.08 * ramp(p, 0, 1, EIO);
  const ex = 280;
  const Eye: React.FC<{ x: number }> = ({ x }) => (
    <g>
      <path d={`M ${x - 150} 1000 Q ${x} ${1000 - 90 * eyes - 2} ${x + 150} 1000 Q ${x} ${1000 + 80 * eyes + 2} ${x - 150} 1000 Z`} fill="#5c4f45" />
      <circle cx={x + 6} cy={1000} r={62 * Math.max(eyes, 0.02)} fill="#0b0909" />
      <ellipse cx={x + 6} cy={1000} rx={62} ry={62 * eyes} fill="#0b0909" opacity={eyes > 0.05 ? 1 : 0} />
      <circle cx={x + 28} cy={980} r={9} fill="#ffc46b" opacity={0.55 * eyes} />
      <path d={`M ${x - 160} 1000 Q ${x} ${1000 - 92 * eyes - 4} ${x + 160} 1000`} stroke="#140f0c" strokeWidth={14} fill="none" />
      <path d={`M ${x - 140} ${880} Q ${x} 800 ${x + 170} 870`} stroke="#140f0c" strokeWidth={34} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#050608' }}>
      <Live cam={{ zoom: z, dx: 0, dy: -60, ox: 540, oy: 808 }}>
        <defs>
          <radialGradient id="skin9" cx="0.5" cy="0.62" r="0.55"><stop offset="0" stopColor="#7a5e48" /><stop offset="0.55" stopColor="#30271f" /><stop offset="1" stopColor="#08080a" /></radialGradient>
          <linearGradient id="shade9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050608" stopOpacity="0.95" /><stop offset="0.38" stopColor="#050608" stopOpacity="0.55" /><stop offset="0.5" stopColor="#050608" stopOpacity="0.3" /><stop offset="0.75" stopColor="#050608" stopOpacity="0.05" /><stop offset="1" stopColor="#050608" stopOpacity="0.6" /></linearGradient>
        </defs>
        <rect x={-200} y={0} width={1700} height={2304} fill="url(#skin9)" />
        <Eye x={648 - ex} /><Eye x={648 + ex} />
        <path d="M 0 300 Q 300 520 360 900 L 0 1400 Z" fill="#0b0b0f" />
        <path d="M 1296 300 Q 1000 520 940 900 L 1296 1400 Z" fill="#0b0b0f" />
        <rect width={1296} height={2304} fill="url(#shade9)" />
        <rect x={0} y={0} width={1296} height={2304} fill="none" stroke="#2a333d" strokeWidth={0} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 10 — behind the girl's reflection, a blurred pale shape with long dark hair, very faint. */
export const S10: React.FC = () => {
  const { p, t } = useShot();
  const pale = wordAt(10, /pale/i, 0.55);
  const o = 0.1 + 0.28 * clamp01((t - wordAt(10, /behind/i, 0.2)) / 1.2) + 0.12 * clamp01((t - pale) / 0.8);
  const cam: Cam = { zoom: 1.75, dx: 0, dy: 40, ox: 540, oy: 700 };
  return (
    <Bath cam={cam} t={t} flick={0.4}
      mary={o}
      inGlass2={<><Girl id="r10" x={GCX - 70} y={860} s={1.05} view="front" hair="long" tone="#0e1117" lit={0.4} eyeDark={1} /></>}
    />
  );
};

/** shot 12 — the same mirror in pale morning light; the reflection's eyes still a little too dark. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1.4 + 0.2 * ramp(p, 0, 1, EIO), dx: 0, dy: -20, ox: 540, oy: 760 };
  return (
    <Bath cam={cam} t={t} day candle={false}
      inGlass={<Girl id="r12" x={GCX} y={880} s={1.0} view="front" hair="long" tone="#3d434b" lit={0.9} eyeDark={1} />}
    />
  );
};
