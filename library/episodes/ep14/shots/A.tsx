import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, ramp, EIO, handheld } from '../comp/Camera';
import { LDOOR, HVP } from '../sets/hall';

const BG: React.CSSProperties = { backgroundColor: '#07090d' };

/** Steel elevator doors in the lobby opening; open = 0..1. */
const LobbyDoors: React.FC<{ open: number; lit: number; floor: string }> = ({ open, lit, floor }) => {
  const d = LDOOR, half = (d.x1 - d.x0) / 2, cx = (d.x0 + d.x1) / 2, sh = half * open;
  return (
    <g>
      <defs>
        <linearGradient id="adSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a535e" /><stop offset="0.5" stopColor="#7b8794" /><stop offset="1" stopColor="#4a535e" /></linearGradient>
        <linearGradient id="adIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f3ff" /><stop offset="0.6" stopColor="#9aa7b4" /><stop offset="1" stopColor="#4a535e" /></linearGradient>
        <radialGradient id="adSpill" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#e9f3ff" stopOpacity="0.4" /><stop offset="1" stopColor="#e9f3ff" stopOpacity="0" /></radialGradient>
      </defs>
      {lit > 0 && <g opacity={lit}>
        <rect x={d.x0} y={d.y0} width={d.x1 - d.x0} height={d.y1 - d.y0} fill="url(#adIn)" />
        {/* side walls in perspective */}
        <polygon points={`${d.x0},${d.y0} ${d.x0 + 60},${d.y0 + 50} ${d.x0 + 60},${d.y1 - 70} ${d.x0},${d.y1}`} fill="#4a535e" />
        <polygon points={`${d.x1},${d.y0} ${d.x1 - 60},${d.y0 + 50} ${d.x1 - 60},${d.y1 - 70} ${d.x1},${d.y1}`} fill="#5a6470" />
        {/* back wall: brushed panels + mirror */}
        <rect x={d.x0 + 60} y={d.y0 + 50} width={d.x1 - d.x0 - 120} height={d.y1 - d.y0 - 120} fill="#8d99a6" />
        {[1, 2, 3].map((i) => <rect key={i} x={d.x0 + 60 + i * (d.x1 - d.x0 - 120) / 4 - 2} y={d.y0 + 50} width={4} height={d.y1 - d.y0 - 120} fill="#4a535e" opacity={0.6} />)}
        <rect x={d.x0 + 100} y={d.y0 + 110} width={d.x1 - d.x0 - 200} height={260} fill="#b8c4d0" opacity={0.55} />
        <line x1={d.x0 + 110} y1={d.y0 + 340} x2={d.x0 + 200} y2={d.y0 + 130} stroke="#ffffff" strokeWidth={6} opacity={0.35} />
        {/* handrail on back + sides */}
        <rect x={d.x0 + 60} y={d.y0 + 440} width={d.x1 - d.x0 - 120} height={12} rx={6} fill="#e9f3ff" />
        <rect x={d.x0 + 60} y={d.y0 + 452} width={d.x1 - d.x0 - 120} height={6} fill="#4a535e" />
        <line x1={d.x0 + 6} y1={d.y0 + 470} x2={d.x0 + 60} y2={d.y0 + 446} stroke="#c8d2dc" strokeWidth={10} strokeLinecap="round" />
        <line x1={d.x1 - 6} y1={d.y0 + 470} x2={d.x1 - 60} y2={d.y0 + 446} stroke="#c8d2dc" strokeWidth={10} strokeLinecap="round" />
        {/* floor */}
        <polygon points={`${d.x0},${d.y1} ${d.x0 + 60},${d.y1 - 70} ${d.x1 - 60},${d.y1 - 70} ${d.x1},${d.y1}`} fill="#3a4250" />
        <rect x={d.x0 + 20} y={d.y0 + 10} width={d.x1 - d.x0 - 40} height={14} fill="#ffffff" />
        <polygon points={`${d.x1 - 14},${d.y0 + 250} ${d.x1 - 46},${d.y0 + 270} ${d.x1 - 46},${d.y0 + 400} ${d.x1 - 14},${d.y0 + 410}`} fill="#2a3038" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={d.x1 - 30} cy={d.y0 + 290 + i * 30} r={7} fill={i === 0 ? '#ffb000' : '#7b8794'} />)}
        <polygon points={`${d.x0},${d.y1} ${d.x1},${d.y1} ${d.x1 + 160},${d.y1 + 420} ${d.x0 - 160},${d.y1 + 420}`} fill="url(#adSpill)" />
      </g>}
      <clipPath id="adClip"><rect x={d.x0} y={d.y0} width={d.x1 - d.x0} height={d.y1 - d.y0} /></clipPath>
      <g clipPath="url(#adClip)">
      <rect x={d.x0 - sh * 0.98} y={d.y0} width={half} height={d.y1 - d.y0} fill="url(#adSteel)" />
      <rect x={cx + sh * 0.98} y={d.y0} width={half} height={d.y1 - d.y0} fill="url(#adSteel)" />
      <rect x={cx - 2 - sh} y={d.y0} width={4} height={d.y1 - d.y0} fill="#2a3038" opacity={1 - open} />
      </g>
      <text x={648} y={620} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={56} fill="#ffb000">{floor}</text>
    </g>
  );
};

/** The woman: back turned, head lowered, long black hair, dark coat. Feet at (x, y), height h. */
const Woman: React.FC<{ x: number; y: number; h: number; sway: number }> = ({ x, y, h, sway }) => {
  const s = h / 700;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway} 0 -700)`}>
      <defs><linearGradient id="awRim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9c0b0" stopOpacity="0.5" /><stop offset="0.2" stopColor="#c9c0b0" stopOpacity="0" /><stop offset="0.8" stopColor="#c9c0b0" stopOpacity="0" /><stop offset="1" stopColor="#c9c0b0" stopOpacity="0.5" /></linearGradient></defs>
      {/* legs */}
      <path d="M -40 -150 L -36 0 L -18 0 L -12 -150 Z M 12 -150 L 18 0 L 36 0 L 40 -150 Z" fill="#d9d4cc" opacity={0.55} />
      {/* coat */}
      <path d="M -62 -560 Q -95 -500 -92 -380 L -100 -140 Q 0 -120 100 -140 L 92 -380 Q 95 -500 62 -560 Q 0 -585 -62 -560 Z" fill="#0c0e13" />
      {/* arms hanging */}
      <path d="M -88 -520 Q -110 -400 -104 -300 L -86 -296 Q -88 -400 -70 -500 Z" fill="#090b0f" />
      <path d="M 88 -520 Q 110 -400 104 -300 L 86 -296 Q 88 -400 70 -500 Z" fill="#090b0f" />
      <ellipse cx={-96} cy={-286} rx={10} ry={18} fill="#d9d4cc" opacity={0.75} />
      <ellipse cx={96} cy={-286} rx={10} ry={18} fill="#d9d4cc" opacity={0.75} />
      {/* head (lowered) + long hair over back */}
      <ellipse cx={0} cy={-610} rx={44} ry={52} fill="#07090d" />
      <path d="M -46 -640 Q -60 -560 -74 -420 Q -60 -360 -40 -330 L 40 -330 Q 60 -360 74 -420 Q 60 -560 46 -640 Q 0 -680 -46 -640 Z" fill="#05060a" />
      {[-30, -14, 2, 18, 32].map((k, i) => <path key={i} d={`M ${k} -640 Q ${k * 1.4} -480 ${k * 1.2 + (i % 2 ? 4 : -4)} ${-330 + (i % 3) * 14}`} stroke="#1c2230" strokeWidth={3} fill="none" />)}
      <path d="M -62 -560 Q -95 -500 -92 -380 L -100 -140 Q 0 -120 100 -140 L 92 -380 Q 95 -500 62 -560" fill="url(#awRim)" opacity={0.6} />
      <path d="M -44 -650 Q 0 -684 44 -650" stroke="#c9c0b0" strokeWidth={4} fill="none" opacity={0.5} />
    </g>
  );
};

/** shot 4 — empty lobby at 1 a.m., closed doors waiting, slow push. */
export const S04: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.3);
  const cam = { zoom: 1 + 0.12 * EIO(p), dx: h.hx, dy: h.hy - 30 * p, oy: 620 };
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="hall/lobby" cam={cam} />
      <Live cam={cam}><LobbyDoors open={0} lit={0} floor="1" /></Live>
    </AbsoluteFill>
  );
};

/** shot 6 — from inside the lift: doors open on the dim 5th-floor hallway, the woman with her back turned. */
export const S06: React.FC = () => {
  const { p } = useShot();
  const o = ramp(p, 0.12, 0.45, EIO);
  const cam = { zoom: 1, dx: 0, dy: 0 };
  const gap = 16 + 880 * o;
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="hall/corridor" cam={cam} />
      <Live cam={cam}>
        <Woman x={HVP.x + 30} y={HVP.y + 450} h={700} sway={0.4 * Math.sin(p * 6)} />
        <defs><linearGradient id="a6Door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a535e" /><stop offset="0.7" stopColor="#7b8794" /><stop offset="1" stopColor="#4a535e" /></linearGradient></defs>
        <rect x={648 - gap / 2 - 800} y={0} width={800} height={2304} fill="url(#a6Door)" />
        <rect x={648 + gap / 2} y={0} width={800} height={2304} fill="url(#a6Door)" />
        <rect x={648 - gap / 2 - 6} y={0} width={6} height={2304} fill="#2a3038" />
        <rect x={648 + gap / 2} y={0} width={6} height={2304} fill="#2a3038" />
        {/* lift interior frame (fg) */}
        <rect x={0} y={0} width={1296} height={300} fill="#07090d" />
        <rect x={0} y={1820} width={1296} height={484} fill="#0b0d12" />
        <rect x={0} y={0} width={190} height={2304} fill="#07090d" />
        <rect x={1106} y={0} width={190} height={2304} fill="#07090d" />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — stairwell, narrator running down, exit glow. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 1);
  const cam = { zoom: 1.25, dx: h.hx - 40 * p, dy: h.hy + 220 + 110 * p };
  const x = 1000 - 640 * p, y = 752 + 356 * p;
  const run = 1.35 * Math.sin(t * 14);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="hall/stairs" cam={cam} />
      <Live cam={cam}>
        <g transform={`translate(${x} ${y - 8 * Math.abs(run)}) scale(1.15) rotate(-9 0 -180)`}>
          {/* back leg */}
          <path d={`M 4 -170 Q ${30 + 30 * run} -110 ${20 + 50 * run} -70 L ${0 + 60 * run} -4 L ${22 + 60 * run} 0 L ${36 + 50 * run} -72 Q ${44 + 30 * run} -120 30 -172 Z`} fill="#0d1016" stroke="#0d1016" strokeWidth={10} strokeLinejoin="round" />
          {/* back arm */}
          <path d={`M 26 -320 Q ${50 - 30 * run} -270 ${40 - 40 * run} -230 L ${20 - 40 * run} -200 L ${8 - 40 * run} -210 L ${24 - 40 * run} -240 Q ${30 - 30 * run} -280 10 -310 Z`} fill="#0d1016" />
          {/* hoodie torso, leaning forward-down */}
          <path d="M -40 -330 Q -58 -260 -46 -175 L 40 -168 Q 52 -250 40 -330 Q 0 -350 -40 -330 Z" fill="#07090d" />
          <rect x={-46} y={-182} width={88} height={18} rx={6} fill="#07090d" />
          {/* front leg */}
          <path d={`M -30 -172 Q ${-40 - 30 * run} -110 ${-30 - 50 * run} -70 L ${-14 - 60 * run} -4 L ${8 - 60 * run} 0 L ${-14 - 50 * run} -72 Q ${-6 - 30 * run} -120 4 -170 Z`} fill="#07090d" stroke="#07090d" strokeWidth={10} strokeLinejoin="round" />
          <ellipse cx={-4 - 60 * run} cy={-2} rx={22} ry={8} fill="#07090d" />
          {/* front arm */}
          <path d={`M -34 -320 Q ${-60 + 30 * run} -270 ${-50 + 40 * run} -228 L ${-28 + 40 * run} -196 L ${-16 + 40 * run} -206 L ${-34 + 40 * run} -238 Q ${-40 + 30 * run} -280 -14 -312 Z`} fill="#07090d" />
          <path d={`M -34 -320 Q ${-60 + 30 * run} -270 ${-50 + 40 * run} -228`} stroke="#3dff8a" strokeWidth={3} fill="none" opacity={0.45} />
          {/* hood */}
          <path d="M -34 -334 Q -48 -380 -26 -408 Q 2 -428 28 -404 Q 44 -376 30 -334 Q 0 -346 -34 -334 Z" fill="#07090d" />
          <path d="M -26 -408 Q 2 -428 28 -404 Q 44 -376 30 -334 Q 52 -260 40 -168" stroke="#3dff8a" strokeWidth={4} fill="none" opacity={0.55} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** shot 12 — lobby: the elevator waiting, doors open, lit, panel on 5, nobody inside. */
export const S12: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.25);
  const cam = { zoom: 1.08 + 0.2 * EIO(p), dx: h.hx, dy: h.hy, oy: 900 };
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="hall/lobby" cam={cam} />
      <Live cam={cam}><LobbyDoors open={1} lit={1} floor="5" /></Live>
    </AbsoluteFill>
  );
};
