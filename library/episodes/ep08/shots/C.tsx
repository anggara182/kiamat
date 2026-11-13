import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { PaleHand, BowedHead, Footprint, HairStrand, Puddle, Drop } from '../art/close_art';

const FW = 1080, FH = 1920;
const L: React.FC<{ cam: Cam; k?: number; children: React.ReactNode }> = ({ cam, k = 1, children }) => (
  <Live cam={cam} k={k} w={FW} h={FH}>{children}</Live>
);
const wp = (id: number, re: RegExp, fb: number, sec: number) => Math.min(1, Math.max(0, wordAt(id, re, fb) / sec));

/** shot 6 — pale hands searching under the dark river surface. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const again = wp(6, /^again\.?$/i, 0.85, sec);
  const h = handheld(t, 0.15);
  const cam: Cam = { zoom: 1.02 + 0.05 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 540, oy: 820 };
  // two sweeps: one before "again", a second, faster one after
  const s1 = Math.sin(t * 1.6), s2 = Math.sin(t * 1.6 + 1.3);
  const urg = 1 + 0.5 * ramp(p, again - 0.05, again + 0.1);
  const lx = 330 + 70 * s1 * urg, rx = 720 + 60 * s2 * urg;
  const ly = 920 + 25 * Math.cos(t * 1.6), ry = 960 + 22 * Math.cos(t * 1.6 + 1.3);
  const rip = (k: number) => ((t * 0.45 + k) % 1);
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14' }}>
      <L cam={cam} k={0.7}>
        <defs>
          <linearGradient id="c6w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2540" /><stop offset="0.45" stopColor="#0d1626" /><stop offset="1" stopColor="#05080f" /></linearGradient>
          <radialGradient id="c6moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#cfd8e6" stopOpacity={0.4} /><stop offset="1" stopColor="#cfd8e6" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#c6w)" />
        <ellipse cx={560} cy={620} rx={620} ry={300} fill="url(#c6moon)" />
        <ellipse cx={540} cy={880} rx={420} ry={260} fill="url(#c6moon)" />
      </L>
      <L cam={cam} k={1}>
        <defs>
          <linearGradient id="c6veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1626" stopOpacity={0.15} /><stop offset="1" stopColor="#0d1626" stopOpacity={0.75} /></linearGradient>
          <radialGradient id="c6dk" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#03050a" stopOpacity={0.9} /><stop offset="1" stopColor="#03050a" stopOpacity={0} /></radialGradient>
        </defs>
        {/* hands under water: drawn, then veiled by translucent water layers */}
        <g transform={`translate(${lx},${ly}) rotate(${-18 + 8 * s1}) scale(1.45)`} opacity={0.88}><PaleHand flip={false} spread={0.5 + 0.5 * s1} /></g>
        <g transform={`translate(${rx},${ry}) rotate(${16 - 7 * s2}) scale(1.45)`} opacity={0.82}><PaleHand flip spread={0.5 + 0.5 * s2} /></g>
        {/* wrists fade upward into dark water */}
        <rect x={-200} y={520} width={1480} height={260} fill="#0d1626" opacity={0.55} />
        <rect x={-200} y={600} width={1480} height={700} fill="url(#c6veil)" />
        {/* refraction bands drifting across the hands */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 700 + i * 90 + 18 * Math.sin(t * 0.9 + i);
          return <path key={i} d={`M-100,${y} C200,${y - 30} 400,${y + 30} 600,${y} S1000,${y - 20} 1200,${y + 10} L1200,${y + 26} C1000,${y + 6} 800,${y + 46} 600,${y + 22} S200,${y - 6} -100,${y + 22} Z`} fill="#cfd8e6" opacity={0.05 + 0.03 * (i % 2)} />;
        })}
        {/* expanding ripples where the hands break the surface */}
        {[0, 0.33, 0.66].map((k, i) => {
          const r = rip(k); const cx = i === 1 ? rx : lx;
          return <ellipse key={i} cx={cx} cy={700} rx={60 + 360 * r} ry={14 + 70 * r} fill="none" stroke="#cfd8e6" strokeWidth={4 - 3 * r} opacity={0.5 * (1 - r)} />;
        })}
        {/* moon glints on the surface */}
        {Array.from({ length: 14 }).map((_, i) => {
          const gx = 300 + ((i * 97) % 520) + 30 * Math.sin(t * 1.3 + i);
          const gy = 640 + ((i * 53) % 160);
          const o = 0.35 + 0.35 * Math.sin(t * 3 + i * 1.7);
          return <ellipse key={i} cx={gx} cy={gy} rx={22 + (i % 3) * 14} ry={3 + (i % 2) * 2} fill="#e9ecf2" opacity={Math.max(0, o)} />;
        })}
        {/* dark lower water and frame edges */}
        <rect x={-200} y={1480} width={1480} height={700} fill="#04070d" opacity={0.6} />
        <ellipse cx={-60} cy={500} rx={260} ry={900} fill="url(#c6dk)" />
        <ellipse cx={1140} cy={500} rx={260} ry={900} fill="url(#c6dk)" />
      </L>
      <L cam={cam} k={1.25}>
        {/* foreground reed blades */}
        <path d="M-40,1920 C30,1400 60,900 40,300 C90,900 100,1400 80,1920 Z" fill="#060810" />
        <path d="M30,1920 C120,1500 200,1100 260,760 C210,1150 160,1500 120,1920 Z" fill="#060810" />
        <path d="M1120,1920 C1060,1300 1050,800 1090,180 C1020,800 1000,1300 1030,1920 Z" fill="#060810" />
      </L>
    </AbsoluteFill>
  );
};

/** shot 7 — her head bowed, wet hair over the face, dripping. */
export const S07: React.FC = () => {
  const { p, t, sec } = useShot();
  const sob = wp(7, /children/i, 0.6, sec);
  const heave = ramp(p, sob - 0.08, sob + 0.04) - ramp(p, sob + 0.1, sob + 0.3);
  const cam: Cam = { zoom: 1 + 0.08 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 540, oy: 760 };
  const sh = heave * 14 + 3 * Math.sin(t * 2.2);
  return (
    <AbsoluteFill style={{ backgroundColor: '#04050a' }}>
      <L cam={cam} k={0.5}>
        <defs>
          <radialGradient id="c7m" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3a4468" /><stop offset="0.45" stopColor="#1b2140" /><stop offset="1" stopColor="#090c1a" /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="#090c1a" />
        <ellipse cx={760} cy={520} rx={700} ry={760} fill="url(#c7m)" />
        <circle cx={860} cy={300} r={70} fill="#e9ecf2" opacity={0.9} />
        <circle cx={860} cy={300} r={140} fill="#e9ecf2" opacity={0.08} />
        {/* faint mist band */}
        <rect x={-200} y={1060} width={1480} height={120} fill="#8b96ad" opacity={0.06} />
      </L>
      <L cam={cam} k={1}>
        <g transform={`translate(540,${600 + sh}) scale(0.92)`}><BowedHead t={t} /></g>
      </L>
    </AbsoluteFill>
  );
};

/** shot 10 — morning: wet footprints on tiles to an open window, slow tilt up. */
export const S10: React.FC = () => {
  const { p, t, sec } = useShot();
  const win = wp(10, /window/i, 0.85, sec);
  const tilt = ramp(p, 0.05, Math.max(0.4, win), EIO);
  const cam: Cam = { zoom: 1.0 + 0.12 * tilt, dx: 0, dy: 0, ty: -260 + 560 * tilt, ox: 560, oy: 500 };
  const VX = 560, HZ = 470; // vanishing point / far wall base (frame px, before tilt)
  const tiles: React.ReactNode[] = [];
  for (let i = -9; i <= 9; i++) tiles.push(<line key={'v' + i} x1={VX + i * 30} y1={HZ} x2={VX + i * 260} y2={2300} stroke="#6e7a86" strokeWidth={2} opacity={0.35} />);
  let y = HZ, d = 18;
  for (let i = 0; i < 14; i++) { y += d; d *= 1.32; tiles.push(<line key={'h' + i} x1={-300} y1={y} x2={1400} y2={y} stroke="#6e7a86" strokeWidth={2} opacity={0.35} />); }
  // footprints from bottom (river side) to window
  const prints = Array.from({ length: 9 }).map((_, i) => {
    const k = i / 8; const yy = 2150 - (2150 - HZ - 30) * (1 - Math.pow(1 - k, 1.9));
    const sc = 1.25 * (1 - k * 0.8); const xx = VX + (i % 2 ? 1 : -1) * 70 * sc + 120 * (1 - k);
    return { x: xx, y: yy, s: sc, left: i % 2 === 0, k };
  });
  const sway = Math.sin(t * 0.9) * 0.5 + Math.sin(t * 2.1) * 0.2;
  return (
    <AbsoluteFill style={{ backgroundColor: '#1c2128' }}>
      <L cam={cam}>
        <defs>
          <linearGradient id="c10wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4250" /><stop offset="1" stopColor="#5b6170" /></linearGradient>
          <linearGradient id="c10fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8f94" /><stop offset="0.4" stopColor="#4a4f57" /><stop offset="1" stopColor="#1a1d23" /></linearGradient>
          <linearGradient id="c10sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe6ee" /><stop offset="1" stopColor="#fff4dc" /></linearGradient>
          <radialGradient id="c10glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff4dc" stopOpacity={0.5} /><stop offset="1" stopColor="#fff4dc" stopOpacity={0} /></radialGradient>
          <linearGradient id="c10spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff4dc" stopOpacity={0.35} /><stop offset="1" stopColor="#fff4dc" stopOpacity={0} /></linearGradient>
        </defs>
        <rect x={-300} y={-500} width={1700} height={HZ + 520} fill="url(#c10wall)" />
        {/* open window */}
        <ellipse cx={VX} cy={180} rx={520} ry={420} fill="url(#c10glow)" />
        <rect x={VX - 210} y={-180} width={420} height={560} fill="#2a2f38" />
        <rect x={VX - 185} y={-160} width={370} height={515} fill="url(#c10sky)" />
        {/* far trees through window, soft */}
        <path d={`M${VX - 185},300 C${VX - 120},230 ${VX - 40},260 ${VX + 20},220 C${VX + 90},250 ${VX + 150},230 ${VX + 185},270 L${VX + 185},355 L${VX - 185},355 Z`} fill="#9aa6b0" opacity={0.6} />
        {/* open shutter */}
        <path d={`M${VX + 185},-160 L${VX + 330},-120 L${VX + 330},330 L${VX + 185},355 Z`} fill="#4a4f5a" />
        <rect x={VX - 230} y={355} width={460} height={34} fill="#6b5a48" />
        <rect x={VX - 230} y={355} width={460} height={5} fill="#fff4dc" opacity={0.7} />
        {/* white curtain stirring */}
        <path d={`M${VX - 185},-160 C${VX - 120 + 30 * sway},0 ${VX - 150 - 40 * sway},180 ${VX - 70 + 60 * sway},350 L${VX - 40 + 70 * sway},350 C${VX - 60 - 20 * sway},170 ${VX - 30 + 40 * sway},20 ${VX - 70},-160 Z`} fill="#f4f1ea" opacity={0.85} />
        <path d={`M${VX - 150},-160 C${VX - 100 + 20 * sway},40 ${VX - 120 - 30 * sway},200 ${VX - 50 + 60 * sway},350`} stroke="#c9ccd2" strokeWidth={6} fill="none" opacity={0.8} />
        <path d={`M${VX - 70},-160 C${VX - 40 + 40 * sway},0 ${VX - 80},170 ${VX - 40 + 70 * sway},350`} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.7} />
        {/* floor */}
        <rect x={-300} y={HZ} width={1700} height={2000} fill="url(#c10fl)" />
        <path d={`M${VX - 230},${HZ} L${VX + 230},${HZ} L${VX + 760},2300 L${VX - 760},2300 Z`} fill="url(#c10spill)" />
        {tiles}
        <rect x={-300} y={HZ - 6} width={1700} height={10} fill="#2a2f38" />
        {prints.map((f, i) => (
          <g key={i} transform={`translate(${f.x},${f.y}) scale(${f.s * (f.left ? -1 : 1)},${f.s * 0.42})`}><Footprint wet={1 - f.k * 0.4} /></g>
        ))}
        {/* dark foreground doorframe edges */}
        <rect x={-300} y={-500} width={340} height={2900} fill="#0e1015" />
        <rect x={1010} y={-500} width={400} height={2900} fill="#0e1015" />
        <rect x={40} y={-500} width={8} height={2900} fill="#3a404c" opacity={0.6} />
      </L>
    </AbsoluteFill>
  );
};

/** shot 11 — windowsill, one long wet hair strand, drops catching morning light. */
export const S11: React.FC = () => {
  const { p, t, sec } = useShot();
  const wet = wp(11, /wet/i, 0.8, sec);
  const cam: Cam = { zoom: 1.0 + 0.1 * ramp(p, 0, 1, EIO), dx: 0, dy: 0, ox: 560, oy: 900 };
  const sway = Math.sin(t * 0.8);
  const drip = ramp(p, wet - 0.05, Math.min(1, wet + 0.25));
  return (
    <AbsoluteFill style={{ backgroundColor: '#2a2a2e' }}>
      <L cam={cam} k={0.5}>
        <defs>
          <linearGradient id="c11bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6ebf0" /><stop offset="0.5" stopColor="#fff2d6" /><stop offset="1" stopColor="#d9c7a6" /></linearGradient>
          <radialGradient id="c11sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity={0.8} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={1300} fill="url(#c11bg)" />
        <ellipse cx={760} cy={540} rx={520} ry={420} fill="url(#c11sun)" />
        {/* soft trees outside */}
        <path d="M-200,780 C0,700 200,740 380,690 C560,730 760,680 980,720 C1100,700 1200,730 1280,720 L1280,900 L-200,900 Z" fill="#b7bfae" opacity={0.6} />
        {/* curtain edge stirring */}
        <path d={`M-200,-200 L240,-200 C200,200 ${260 + 40 * sway},500 ${200 + 50 * sway},900 L-200,900 Z`} fill="#f7f4ee" opacity={0.9} />
        <path d={`M120,-200 C100,250 ${170 + 30 * sway},550 ${120 + 40 * sway},900`} stroke="#d6d4ce" strokeWidth={10} fill="none" />
      </L>
      <L cam={cam} k={1}>
        <defs>
          <linearGradient id="c11sill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62" /><stop offset="0.3" stopColor="#8a5f36" /><stop offset="1" stopColor="#3a2614" /></linearGradient>
          <linearGradient id="c11wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a89c8a" /><stop offset="0.6" stopColor="#8a7e6e" /><stop offset="1" stopColor="#5a5248" /></linearGradient>
          <linearGradient id="c11front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3c20" /><stop offset="1" stopColor="#1a1009" /></linearGradient>
        </defs>
        {/* sill top surface, slightly in perspective */}
        <path d="M-200,880 L1280,860 L1280,1260 L-200,1300 Z" fill="url(#c11sill)" />
        <path d="M-200,880 L1280,860" stroke="#fff2d6" strokeWidth={5} opacity={0.8} />
        {[960, 1030, 1110, 1190].map((y, i) => (
          <path key={i} d={`M-200,${y + 10} C200,${y - 8 + i * 4} 600,${y + 14} 1280,${y - 6}`} stroke="#4a2f17" strokeWidth={3} fill="none" opacity={0.45} />
        ))}
        <path d="M520,1060 c40,-14 80,-6 90,8 c-20,14 -70,16 -90,-8 Z" fill="#4a2f17" opacity={0.35} />
        {/* wet patch darkening the wood */}
        <ellipse cx={560} cy={1090} rx={420} ry={70} fill="#2a1a0c" opacity={0.18 + 0.08 * drip} />
        <HairStrand t={t} />
        <Puddle x={850} y={1030} s={1.1} t={t} />
        <Drop x={430} y={1150} r={26} t={t} i={0} />
        <Drop x={700} y={1160} r={19} t={t} i={1} />
        <Drop x={1030} y={960} r={14} t={t} i={2} />
        {/* a fresh drop runs off the hair tips into the puddle on "wet" */}
        <circle cx={872} cy={990 + 30 * drip} r={7} fill="#e1ecf6" opacity={0.85 * (1 - ramp(drip, 0.8, 1))} />
        {/* sill front edge */}
        <path d="M-200,1300 L1280,1260 L1280,1360 L-200,1410 Z" fill="url(#c11front)" />
        <path d="M-200,1300 L1280,1260" stroke="#d9a868" strokeWidth={4} opacity={0.6} />
        {/* wall under the window: lit plaster, shadow under the sill lip */}
        <rect x={-200} y={1380} width={1480} height={820} fill="url(#c11wall)" />
        <path d="M-200,1405 L1280,1355 L1280,1440 L-200,1500 Z" fill="#2a2420" opacity={0.6} />
        <path d="M-200,1700 L1280,1640" stroke="#6d6458" strokeWidth={3} opacity={0.4} />
        <path d="M300,1500 L1280,1460 L1280,2200 L700,2200 Z" fill="#fff2d6" opacity={0.08} />
      </L>
    </AbsoluteFill>
  );
};
