import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { W, H, rng } from '../art/world';

/** Set "mountain" (owner M). Ids "mountain/<band>". */

/** Pine: stacked tiers, flat fill, optional snow on tiers. */
export const Pine: React.FC<{ x: number; y: number; h: number; fill: string; snow?: string }> = ({ x, y, h, fill, snow }) => {
  const w = h * 0.36, tiers = 5;
  return (
    <g>
      <rect x={x - h * 0.015} y={y - h * 0.1} width={h * 0.03} height={h * 0.12} fill={fill} />
      {Array.from({ length: tiers }, (_, i) => {
        const ty = y - h * 0.08 - i * h * 0.17, tw = w * (1 - i * 0.17), th = h * 0.3;
        return <g key={i}>
          <path d={`M ${x - tw} ${ty} L ${x} ${ty - th} L ${x + tw} ${ty} Q ${x} ${ty - th * 0.18} ${x - tw} ${ty} Z`} fill={fill} />
          {snow && <path d={`M ${x - tw * 0.7} ${ty - th * 0.2} Q ${x} ${ty - th * 0.38} ${x + tw * 0.45} ${ty - th * 0.28} L ${x + tw * 0.2} ${ty - th * 0.36} Q ${x - tw * 0.2} ${ty - th * 0.32} ${x - tw * 0.7} ${ty - th * 0.2} Z`} fill={snow} opacity={0.55} />}
        </g>;
      })}
    </g>
  );
};

const VX = 660, VY = 860; // trail vanishing point (world)

export const MOUNTAIN: Record<string, BandSpec> = {
  /** night sky + snowy ridge + hazy far pines */
  'mountain/sky': {
    blur: 2,
    node: () => {
      const r = rng(11);
      return <g>
        <defs>
          <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070b14" /><stop offset="0.38" stopColor="#152238" /><stop offset="0.6" stopColor="#1d2c46" /></linearGradient>
          <radialGradient id="mglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3a5070" stopOpacity="0.8" /><stop offset="1" stopColor="#3a5070" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#msky)" />
        <ellipse cx={VX} cy={VY - 120} rx={520} ry={420} fill="url(#mglow)" />
        <path d={`M 0 760 L 180 600 L 300 680 L 480 470 L 600 560 L 760 420 L 920 580 L 1060 520 L 1296 700 L 1296 ${H} L 0 ${H} Z`} fill="#0c1220" />
        <path d="M 430 520 L 480 470 L 600 560 L 700 470 L 760 420 L 820 470 L 760 470 L 700 520 L 610 590 L 530 520 Z" fill="#c9d6e6" opacity={0.55} />
        <path d="M 140 640 L 180 600 L 240 650 L 190 640 Z M 1020 540 L 1060 520 L 1130 570 L 1070 560 Z" fill="#c9d6e6" opacity={0.4} />
        {Array.from({ length: 34 }, (_, i) => { const x = (i / 33) * W + (r() - 0.5) * 30, h = 90 + r() * 70; return <Pine key={i} x={x} y={880 + r() * 30} h={h} fill="#111a2c" />; })}
        <rect x={0} y={880} width={W} height={H - 880} fill="#111a2c" />
      </g>;
    },
  },
  /** snowy trail climbing to the vanishing point, flanked by converging pine rows */
  'mountain/trail': {
    node: () => {
      const r = rng(23);
      const rows: React.ReactNode[] = [];
      for (let i = 0; i < 14; i++) {
        const d = i / 13; // 0 far .. 1 near
        const y = VY + 20 + Math.pow(d, 1.8) * 1300;
        const spread = 70 + Math.pow(d, 1.6) * 820;
        const h = 120 + Math.pow(d, 1.7) * 900;
        const c = d < 0.4 ? '#0b1322' : '#060a10';
        rows.push(<Pine key={`l${i}`} x={VX - spread - r() * 40} y={y} h={h * (0.85 + r() * 0.3)} fill={c} snow={d > 0.3 ? '#c9d6e6' : undefined} />);
        rows.push(<Pine key={`r${i}`} x={VX + spread + r() * 40} y={y + r() * 20} h={h * (0.85 + r() * 0.3)} fill={c} snow={d > 0.3 ? '#c9d6e6' : undefined} />);
      }
      return <g>
        <defs>
          <linearGradient id="mtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7f93b0" /><stop offset="1" stopColor="#3d4d68" /></linearGradient>
          <linearGradient id="mgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a374f" /><stop offset="1" stopColor="#141c2c" /></linearGradient>
        </defs>
        <path d={`M 0 ${VY + 40} Q ${VX} ${VY - 10} ${W} ${VY + 40} L ${W} ${H} L 0 ${H} Z`} fill="url(#mgr)" />
        <path d={`M ${VX - 18} ${VY} Q ${VX - 60} ${VY + 500} ${VX - 120} ${VY + 900} Q ${VX - 260} ${VY + 1200} ${VX - 330} ${H} L ${VX + 330} ${H} Q ${VX + 220} ${VY + 1150} ${VX + 120} ${VY + 860} Q ${VX + 50} ${VY + 450} ${VX + 18} ${VY} Z`} fill="url(#mtr)" />
        {rows}
      </g>;
    },
  },
  /** foreground framing pines + snow bank */
  'mountain/near': {
    blur: 3,
    node: () => <g>
      <Pine x={40} y={2300} h={2300} fill="#04070c" snow="#7f93b0" />
      <Pine x={1290} y={2340} h={2200} fill="#04070c" snow="#7f93b0" />
      <path d={`M 0 2140 Q 300 2060 560 2150 Q 820 2230 1296 2120 L 1296 ${H} L 0 ${H} Z`} fill="#0a0f19" />
    </g>,
  },
  /** apartment block at the foot of the dark wooded slope */
  'mountain/apt': {
    node: () => {
      const r = rng(41);
      const wins: React.ReactNode[] = [];
      for (let fl = 0; fl < 11; fl++) for (let c = 0; c < 7; c++) wins.push(<rect key={`${fl}-${c}`} x={330 + c * 92} y={1130 + fl * 72} width={52} height={40} fill="#1a2538" />);
      return <g>
        <defs><linearGradient id="mslope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c1220" /><stop offset="1" stopColor="#080c16" /></linearGradient></defs>
        <path d={`M 0 900 Q 400 800 700 860 Q 1000 920 1296 860 L 1296 ${H} L 0 ${H} Z`} fill="url(#mslope)" />
        {Array.from({ length: 40 }, (_, i) => <Pine key={i} x={(i / 39) * W + (r() - 0.5) * 30} y={930 + r() * 60 + (i % 3) * 30} h={150 + r() * 80} fill="#060a10" snow="#c9d6e6" />)}
        <rect x={0} y={1040} width={W} height={1300} fill="#080c16" />
        <rect x={290} y={1070} width={700} height={900} fill="#1b2335" />
        <rect x={290} y={1070} width={700} height={900} fill="none" stroke="#2c3a54" strokeWidth={4} />
        <rect x={270} y={1050} width={740} height={26} fill="#c9d6e6" opacity={0.75} />
        <rect x={990} y={1070} width={60} height={900} fill="#10151f" />
        {wins}
        <text x={640} y={1105} fill="#4b5d7c" fontSize={26} fontFamily="sans-serif" fontWeight={700} textAnchor="middle">103동</text>
        <path d={`M 0 1960 Q 640 1910 1296 1970 L 1296 ${H} L 0 ${H} Z`} fill="#d6e0ec" />
        <path d={`M 0 2040 Q 640 1990 1296 2050 L 1296 ${H} L 0 ${H} Z`} fill="#7f93b0" opacity={0.5} />
      </g>;
    },
  },
};
