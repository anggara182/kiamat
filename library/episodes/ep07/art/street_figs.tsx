import React from 'react';

/** Shared street geometry: one-point perspective. s = depth scale (1 = world bottom). */
export const VP = { x: 690, y: 1080 };
export const gy = (s: number) => VP.y + (2304 - VP.y) * s;
export const gx = (bx: number, s: number) => VP.x + (bx - VP.x) * s;
export const LAMP = { x: 905, base: gy(0.28), head: gy(0.28) - 1000, armX: 800 };
export const WOMAN = { x: 790, y: gy(0.28) - 4, h: 640 };

const RIM = '#a9c4e8';

/** Kuchisake-onna, front, perfectly still. feet at (x,y), total height h. Mouth never shown (mask). */
export const Woman: React.FC<{ x: number; y: number; h: number; hairSway?: number }> = ({ x, y, h, hairSway = 0 }) => {
  const k = h / 1000;
  const sw = hairSway;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <defs>
        <linearGradient id="wCoat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5e5446" /><stop offset="0.35" stopColor="#b9a98f" /><stop offset="0.6" stopColor="#a4957c" /><stop offset="1" stopColor="#3e372e" />
        </linearGradient>
        <linearGradient id="wCoatV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="0.55" stopColor="#000" stopOpacity="0.15" /><stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* back hair mass, very long */}
      <path d={`M -62 -985 Q -100 -900 -108 -760 Q -116 -600 -${104 + sw} -470 L ${104 + sw} -470 Q 116 -600 108 -760 Q 100 -900 62 -985 Z`} fill="#0b0b0e" />
      {/* legs */}
      <path d="M -46 -200 L -40 -18 L -22 -18 L -18 -200 Z" fill="#17161a" />
      <path d="M 18 -200 L 22 -18 L 40 -18 L 46 -200 Z" fill="#17161a" />
      <path d="M -48 -20 L -18 -20 L -14 0 L -52 0 Z" fill="#0a0a0c" />
      <path d="M 18 -20 L 48 -20 L 52 0 L 14 0 Z" fill="#0a0a0c" />
      {/* coat */}
      <path d="M -88 -838 Q -104 -820 -104 -770 L -122 -180 Q -60 -164 0 -170 Q 60 -164 122 -180 L 104 -770 Q 104 -820 88 -838 Q 40 -852 0 -846 Q -40 -852 -88 -838 Z" fill="url(#wCoat)" />
      <path d="M -88 -838 Q -104 -820 -104 -770 L -122 -180 Q -60 -164 0 -170 Q 60 -164 122 -180 L 104 -770 Q 104 -820 88 -838 Q 40 -852 0 -846 Q -40 -852 -88 -838 Z" fill="url(#wCoatV)" />
      {/* lapels + placket + belt */}
      <path d="M -30 -846 L 0 -700 L 30 -846 L 14 -846 L 0 -760 L -14 -846 Z" fill="#6f6553" />
      <path d="M -44 -836 L -6 -690 L -10 -650 L -58 -810 Z" fill="#cbbca2" opacity={0.6} />
      <path d="M 4 -700 L 4 -176" stroke="#6b6150" strokeWidth={4} />
      <rect x={-106} y={-622} width={212} height={26} fill="#8a7c64" />
      <path d="M -10 -624 L 30 -560 M 10 -598 L -18 -548" stroke="#7a6d57" strokeWidth={9} strokeLinecap="round" />
      {/* folds */}
      <path d="M -50 -590 Q -60 -380 -78 -190 M 46 -590 Q 58 -380 70 -192 M -14 -560 Q -20 -380 -22 -180" stroke="#5c5343" strokeWidth={5} fill="none" opacity={0.7} />
      {/* arms hanging stiff */}
      <path d="M -100 -808 Q -126 -790 -128 -720 L -132 -470 L -104 -466 L -98 -720 Z" fill="#8f826c" />
      <path d="M 100 -808 Q 126 -790 128 -720 L 132 -470 L 104 -466 L 98 -720 Z" fill="#6d6352" />
      <path d="M -134 -470 Q -136 -418 -122 -404 Q -108 -412 -104 -468 Z" fill="#d9cfc6" />
      <path d="M 134 -470 Q 136 -418 122 -404 Q 108 -412 104 -468 Z" fill="#b8ada4" />
      <path d="M -124 -440 L -122 -408 M 124 -440 L 122 -408" stroke="#9c8f86" strokeWidth={3} />
      {/* neck + head */}
      <rect x={-18} y={-880} width={36} height={44} fill="#b8ada4" />
      <ellipse cx={0} cy={-930} rx={40} ry={56} fill="#d9cfc6" />
      {/* mask: covers mouth fully */}
      <path d="M -40 -930 Q 0 -940 40 -930 L 38 -888 Q 0 -862 -38 -888 Z" fill="#eef0f2" />
      <path d="M -34 -918 Q 0 -924 34 -918 M -34 -904 Q 0 -908 34 -904" stroke="#c4c9cf" strokeWidth={2.5} fill="none" />
      <path d="M -40 -928 L -46 -940 M 40 -928 L 46 -940" stroke="#eef0f2" strokeWidth={3} />
      {/* fringe shadows the eyes */}
      <path d="M -50 -960 Q -46 -1000 0 -996 Q 46 -1000 50 -960 L 46 -918 Q 40 -940 26 -938 L 18 -944 L 6 -936 L -6 -944 L -18 -936 L -30 -942 Q -42 -938 -46 -918 Z" fill="#0b0b0e" />
      <path d="M -40 -944 Q 0 -936 40 -944 L 40 -935 Q 0 -929 -40 -935 Z" fill="#000" opacity={0.35} />
      {/* front hair curtains over shoulders */}
      <path d={`M -50 -962 Q -64 -900 -62 -820 Q -66 -720 -${74 + sw * 0.6} -600 L -48 -600 Q -46 -720 -40 -880 Z`} fill="#0b0b0e" />
      <path d={`M 50 -962 Q 64 -900 62 -820 Q 66 -720 ${74 + sw * 0.6} -600 L 48 -600 Q 46 -720 40 -880 Z`} fill="#0b0b0e" />
      {/* strands + rim (light from above) */}
      <path d="M -44 -985 Q -10 -1002 30 -990" stroke={RIM} strokeWidth={5} fill="none" opacity={0.85} />
      <path d="M -58 -940 Q -62 -800 -66 -640 M 58 -940 Q 62 -800 68 -640 M -96 -880 Q -104 -700 -100 -500" stroke="#2a2c36" strokeWidth={3} fill="none" />
      <path d="M -100 -820 Q -60 -846 -30 -846 M 100 -820 Q 60 -846 30 -846" stroke={RIM} strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M -104 -770 L -121 -200" stroke={RIM} strokeWidth={3} opacity={0.35} />
    </g>
  );
};

/** Schoolgirl in sailor uniform. view 'back' (walking away) or 'front' (running toward camera, backlit). phase = gait cycle 0..1, amp = 0 standing. */
export const Girl: React.FC<{ x: number; y: number; h: number; view: 'back' | 'front'; phase?: number; amp?: number }> = ({ x, y, h, view, phase = 0, amp = 0 }) => {
  const k = h / 1000;
  const a = Math.sin(phase * Math.PI * 2) * amp;
  const bob = -Math.abs(Math.cos(phase * Math.PI * 2)) * 18 * amp;
  const back = view === 'back';
  const navy = back ? '#1c2440' : '#121729';
  const skin = back ? '#c9b8ab' : '#5d5560';
  const leg = (sgn: number) => {
    const sw = sgn * a;
    const kx = sw * 60, fx = sw * 40, fy = back ? -sw * 50 : sw * 30;
    return <g>
      <path d={`M ${sgn * 30 - 20} -420 L ${sgn * 30 + 18} -420 L ${sgn * 30 + kx * 0.6 + 14} -220 L ${sgn * 30 + fx + 12} ${-60 + Math.min(0, fy)} L ${sgn * 30 + fx - 14} ${-60 + Math.min(0, fy)} L ${sgn * 30 + kx * 0.6 - 16} -220 Z`} fill={skin} />
      <path d={`M ${sgn * 30 + fx - 16} ${-150 + Math.min(0, fy)} L ${sgn * 30 + fx + 14} ${-150 + Math.min(0, fy)} L ${sgn * 30 + fx + 14} ${-40 + Math.min(0, fy)} L ${sgn * 30 + fx - 16} ${-40 + Math.min(0, fy)} Z`} fill={back ? '#e6e8ee' : '#8b8f9c'} />
      <path d={`M ${sgn * 30 + fx - 20} ${-42 + Math.min(0, fy)} L ${sgn * 30 + fx + 18} ${-42 + Math.min(0, fy)} L ${sgn * 30 + fx + 22} ${0 + Math.min(0, fy)} L ${sgn * 30 + fx - 22} ${0 + Math.min(0, fy)} Z`} fill="#0b0a10" />
    </g>;
  };
  const arm = (sgn: number) => {
    const sw = -sgn * a * (back ? 1 : 1.4);
    const hx = sgn * 108 + sw * 30, hy = -470 + Math.abs(sw) * -40;
    return <g>
      <path d={`M ${sgn * 82} -790 Q ${sgn * 112} -760 ${sgn * 108 + sw * 14} -640 L ${hx + 12} ${hy} L ${hx - 14} ${hy} L ${sgn * 80 + sw * 10} -650 Z`} fill={navy} />
      <ellipse cx={hx} cy={hy + 22} rx={18} ry={26} fill={skin} />
    </g>;
  };
  return (
    <g transform={`translate(${x},${y + bob * k}) scale(${k})`}>
      {leg(-1)}{leg(1)}
      {arm(-1)}{arm(1)}
      {/* blouse */}
      <path d="M -86 -800 Q -60 -830 0 -830 Q 60 -830 86 -800 L 96 -520 L -96 -520 Z" fill={navy} />
      {/* pleated skirt */}
      <path d={`M -96 -540 L 96 -540 L ${140 + a * 10} -390 L ${-140 + a * 10} -390 Z`} fill={back ? '#151b33' : '#0d1120'} />
      <path d="M -60 -540 L -88 -392 M -20 -540 L -30 -390 M 20 -540 L 30 -390 M 60 -540 L 88 -392" stroke={back ? '#0b0f22' : '#070914'} strokeWidth={6} />
      {back ? (
        <>
          {/* square sailor collar on the back, white trim */}
          <path d="M -80 -812 L 80 -812 L 74 -680 L -74 -680 Z" fill="#1a2240" />
          <path d="M -70 -800 L 70 -800 L 66 -692 L -66 -692 Z" fill="none" stroke="#e8ebf2" strokeWidth={6} />
          <path d="M -60 -790 L 60 -790 L 57 -702 L -57 -702 Z" fill="none" stroke="#e8ebf2" strokeWidth={3} />
          {/* school bag strap + bag at hip */}
          <path d="M 74 -800 L -100 -560" stroke="#3a2a22" strokeWidth={12} />
          <rect x={-170} y={-600} width={120} height={150} rx={14} fill="#2b201b" />
          <rect x={-162} y={-592} width={104} height={40} rx={8} fill="#3a2c24" />
          <path d="M -170 -560 L -50 -560" stroke={RIM} strokeWidth={2} opacity={0.5} />
        </>
      ) : (
        <>
          <path d="M -60 -826 L 0 -720 L 60 -826 L 44 -826 L 0 -746 L -44 -826 Z" fill="#c6cad4" opacity={0.55} />
          <path d="M -26 -740 L 0 -712 L 26 -740 L 30 -690 L 0 -712 L -30 -690 Z" fill="#7a2a3a" />
          <path d="M 70 -800 L -96 -560" stroke="#1b1412" strokeWidth={12} />
          <rect x={-160 - a * 20} y={-600} width={110} height={140} rx={14} fill="#160f0d" />
        </>
      )}
      {/* neck + head + hair */}
      <rect x={-18} y={-870} width={36} height={50} fill={skin} />
      {back ? (
        <>
          <ellipse cx={0} cy={-930} rx={70} ry={78} fill="#0b0b0e" />
          <path d="M -72 -930 Q -76 -850 -60 -800 L 60 -800 Q 76 -850 72 -930 Z" fill="#0b0b0e" />
          <path d="M -50 -990 Q 0 -1012 50 -990" stroke={RIM} strokeWidth={6} fill="none" opacity={0.8} />
          <path d="M -40 -960 Q -50 -880 -46 -806 M 0 -1000 L 0 -806 M 36 -960 Q 46 -880 42 -806" stroke="#22242e" strokeWidth={4} fill="none" />
        </>
      ) : (
        <>
          <ellipse cx={0} cy={-925} rx={62} ry={72} fill="#3c3640" />
          <path d="M -72 -930 Q -74 -1010 0 -1008 Q 74 -1010 72 -930 L 76 -820 L 52 -820 L 56 -930 Q 30 -960 0 -950 Q -30 -960 -56 -930 L -52 -820 L -76 -820 Z" fill="#0b0b0e" />
          <path d="M -60 -990 Q 0 -1018 60 -990" stroke={RIM} strokeWidth={6} fill="none" opacity={0.9} />
        </>
      )}
      {/* rim on shoulders */}
      <path d="M -86 -800 Q -60 -830 0 -830 Q 60 -830 86 -800" stroke={RIM} strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};

/** Dropped surgical mask lying on asphalt (seen at a low angle). */
export const DroppedMask: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const k = w / 200;
  return (
    <g transform={`translate(${x},${y}) scale(${k}, ${k * 0.42}) rotate(-12)`}>
      <ellipse cx={4} cy={18} rx={118} ry={70} fill="#000" opacity={0.5} />
      <path d="M -150 -30 Q -170 0 -150 40 M 150 -30 Q 172 10 146 44" stroke="#dfe3e8" strokeWidth={5} fill="none" />
      <path d="M -100 -60 Q 0 -78 100 -60 L 96 50 Q 0 76 -96 50 Z" fill="#eef0f2" />
      <path d="M -96 -20 Q 0 -34 96 -20 M -96 12 Q 0 0 96 12" stroke="#b9c0c9" strokeWidth={5} fill="none" />
      <path d="M -100 -60 Q 0 -78 100 -60" stroke="#ffffff" strokeWidth={6} fill="none" />
      <path d="M -96 50 Q 0 76 96 50" stroke="#9aa3ae" strokeWidth={8} fill="none" />
    </g>
  );
};
