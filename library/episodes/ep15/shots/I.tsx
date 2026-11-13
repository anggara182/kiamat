import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';

const BG: React.CSSProperties = { backgroundColor: '#07080b' };
const Glow: React.FC<{ id: string; c: string; o?: number }> = ({ id, c, o = 0.7 }) => (
  <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient>
);

/** Tall wet man silhouette, feet at (0,0), height ~ 900 world px. Face never visible. */
const Father: React.FC<{ step?: number; rim?: string }> = ({ step = 0, rim = '#ffcf86' }) => {
  const s = Math.sin(step) * 40;
  return (
    <g transform="scale(1.12 1.1)">
      <path d={`M-92 -560 L-75 -300 L${-48 + s} 0 L${-8 + s} 0 L-2 -300 L2 -300 L${45 - s} 0 L${82 - s} 0 L78 -300 L95 -560 Z`} fill="#050608" />
      <path d="M-175 -770 Q-180 -825 -60 -845 L60 -845 Q180 -825 175 -770 L150 -680 L95 -520 L-95 -520 L-150 -680 Z" fill="#07080a" />
      <path d={`M-170 -780 Q-195 -650 ${-185 - s * 0.3} -460 L${-150 - s * 0.3} -455 Q-150 -620 -135 -720 Z`} fill="#07080a" />
      <path d={`M170 -780 Q195 -650 ${185 + s * 0.3} -460 L${150 + s * 0.3} -455 Q150 -620 135 -720 Z`} fill="#07080a" />
      <rect x={-28} y={-880} width={56} height={50} fill="#07080a" />
      <ellipse cx={0} cy={-925} rx={58} ry={70} fill="#07080a" />
      <path d="M-58 -930 Q-60 -1000 0 -998 Q60 -1000 58 -930" fill="none" stroke={rim} strokeWidth={4} opacity={0.6} />
      <path d="M150 -780 Q190 -650 175 -470" fill="none" stroke={rim} strokeWidth={4} opacity={0.5} />
      <path d="M-150 -780 Q-190 -650 -175 -470" fill="none" stroke={rim} strokeWidth={3} opacity={0.35} />
    </g>
  );
};

/** Mother + daughter from behind on a sofa. */
const Sofa: React.FC = () => (
  <g>
    <rect x={260} y={1430} width={780} height={260} rx={40} fill="#0a0b0e" />
    <rect x={230} y={1350} width={830} height={110} rx={50} fill="#0d0e12" />
    {/* mother */}
    <path d="M420 1460 Q410 1300 470 1270 L590 1270 Q650 1300 640 1460 Z" fill="#06070a" />
    <ellipse cx={530} cy={1210} rx={58} ry={68} fill="#06070a" />
    <path d="M478 1180 Q530 1120 584 1185" fill="none" stroke="#8fb7ff" strokeWidth={5} opacity={0.7} />
    <ellipse cx={575} cy={1215} rx={22} ry={26} fill="#06070a" />
    {/* daughter */}
    <path d="M720 1470 Q712 1340 760 1320 L850 1320 Q896 1340 888 1470 Z" fill="#06070a" />
    <ellipse cx={805} cy={1268} rx={50} ry={58} fill="#06070a" />
    <path d="M755 1250 Q760 1350 745 1400 L770 1330 Z" fill="#06070a" />
    <path d="M760 1240 Q805 1190 850 1245" fill="none" stroke="#8fb7ff" strokeWidth={4} opacity={0.65} />
  </g>
);

export const S04: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.3);
  const cam: Cam = { zoom: 1.08, dx: h.hx, dy: h.hy - 60 };
  const fl = 0.8 + 0.2 * Math.sin(t * 7) * Math.sin(t * 2.3);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="inside/room" cam={cam} />
      <Live cam={cam}><defs><Glow id="g4" c="#8fb7ff" o={0.85} /></defs>
        <ellipse cx={650} cy={1200} rx={520} ry={380} fill="url(#g4)" opacity={fl} />
        <Sofa /></Live>
      <Live cam={cam} k={1.3}><path d="M-100 2400 L-100 1100 Q60 1080 120 1250 L160 2400 Z" fill="#020203" /><path d="M1400 2400 L1400 1300 Q1240 1320 1200 1500 L1180 2400 Z" fill="#020203" /></Live>
    </AbsoluteFill>
  );
};

export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const o0 = Math.min(wordAt(5, /front/, 0.3), sec * 0.25);
  const o = ramp(t, o0, sec * 0.5, EIO);
  const cam: Cam = { zoom: 1.5 + 0.12 * p, dx: 330, dy: 80, ox: 315 + 0, oy: 1000 };
  const dw = 290 * (1 - 0.75 * o);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="inside/room" cam={cam} />
      <Live cam={cam}><defs><Glow id="g5" c="#ffcf86" o={0.8} /></defs>
        <rect x={170} y={660} width={290} height={850} fill="#1a2030" />
        <ellipse cx={315} cy={900} rx={200 * o + 1} ry={500} fill="url(#g5)" />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={190 + i * 27} y1={((t * 900 + i * 173) % 900) + 640} x2={186 + i * 27} y2={((t * 900 + i * 173) % 900) + 700} stroke="#9fb2c8" strokeWidth={2} opacity={0.5 * o} />)}
        <g transform={`translate(315 1500) scale(0.82)`} opacity={ramp(t, sec * 0.4, sec * 0.75)}><Father /></g>
        <rect x={170} y={660} width={dw} height={850} fill="#4b3423" />
        <rect x={170 + dw - 8} y={660} width={8} height={850} fill="#20160e" />
      </Live>
    </AbsoluteFill>
  );
};

export const S06: React.FC = () => {
  const { p, t } = useShot();
  const x = 200 + 820 * p;
  const cam: Cam = { zoom: 1.15, dx: 120 - 240 * p, dy: -40 };
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="inside/room" cam={cam} />
      <Live cam={cam}><defs><Glow id="g6" c="#8fb7ff" o={0.9} /></defs>
        <ellipse cx={650} cy={1150} rx={560} ry={460} fill="url(#g6)" opacity={0.6 + 0.4 * Math.sin(t * 5) * Math.sin(t * 1.7)} />
        <g transform={`translate(${x} 1560)`}><Father step={t * 4} rim="#8fb7ff" /></g>
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={x - i * 70} cy={1565} r={10 - i * 0.6} fill="#8fb7ff" opacity={0.35 - i * 0.025} />)}
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={x - 120 + i * 48} y1={1000 + ((t * 300 + i * 90) % 450)} x2={x - 120 + i * 48} y2={1025 + ((t * 300 + i * 90) % 450)} stroke="#9fb2c8" strokeWidth={3} opacity={0.6} />)}
      </Live>
      <Live cam={cam} k={1.4}><rect x={-200} y={1200} width={260} height={1100} fill="#030304" /></Live>
    </AbsoluteFill>
  );
};

/** Mother profile close-up, facing right (toward TV). */
const Profile: React.FC<{ phone?: number; rim: string }> = ({ phone = 0, rim }) => (
  <g>
    <path d="M280 2304 Q300 1600 520 1440 L800 1420 Q1000 1520 1030 2304 Z" fill="#14161d" />
    <path d="M280 2304 Q300 1600 520 1440 L800 1420 Q1000 1520 1030 2304" fill="none" stroke={rim} strokeWidth={3} opacity={0.25} />
    <path d="M640 1450 L650 1180 Q560 1050 590 860 Q640 680 790 690 Q870 705 875 800 Q878 860 868 885 Q862 905 880 935 L922 990 Q925 1005 892 1010 Q900 1030 893 1040 L882 1050 Q897 1065 888 1080 Q868 1095 870 1110 Q885 1150 860 1175 Q820 1195 790 1190 Q795 1300 815 1440 L640 1450 Z" fill="#2b2731" />
    <path d="M875 800 Q878 860 868 885 Q862 905 880 935 L922 990 Q925 1005 892 1010 Q900 1030 893 1040 L882 1050 Q897 1065 888 1080 Q868 1095 870 1110 Q885 1150 860 1175 Q820 1195 790 1190 Q795 1300 812 1400" fill="none" stroke={rim} strokeWidth={5} strokeLinejoin="round" />
    <path d="M845 760 Q800 790 780 860 Q740 900 725 960 Q700 1100 700 1260 Q690 1400 690 1490 Q640 1450 600 1500 Q550 1460 480 1510 Q520 1300 530 1100 Q520 850 600 740 Q690 650 800 680 Q840 700 845 760 Z" fill="#0a090c" />
    <path d="M600 740 Q690 650 800 680 Q840 700 845 760" fill="none" stroke={rim} strokeWidth={4} opacity={0.6} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${640 + i * 30} ${700 + i * 4} Q${560 + i * 25} 1000 ${560 + i * 22} 1500`} fill="none" stroke="#1e1c24" strokeWidth={3} />)}
    <path d="M760 930 Q735 960 742 1010" fill="none" stroke="#0a090c" strokeWidth={10} />
    <ellipse cx={745} cy={975} rx={20} ry={38} fill="#2b2731" stroke={rim} strokeWidth={2} strokeOpacity={0.5} />
    {phone > 0 && <g opacity={phone}>
      <path d="M600 1560 Q600 1300 690 1160 L760 1120 Q800 1170 770 1240 L730 1560 Z" fill="#2a2228" />
      <rect x={690} y={950} width={95} height={210} rx={14} fill="#111" transform="rotate(-12 737 1055)" />
      <rect x={698} y={960} width={79} height={190} rx={10} fill="#e8f4ff" opacity={0.3} transform="rotate(-12 737 1055)" />
      <path d="M690 1180 Q680 1080 720 1040 Q780 1020 800 1060 L790 1100 Q760 1080 745 1110 L790 1120 Q795 1150 760 1150 L790 1160 Q790 1190 750 1195 Z" fill="#5a4a50" stroke="#8fb7ff" strokeWidth={4} />
    </g>}
  </g>
);

export const S07: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: -80 };
  const ring = t > wordAt(7, /rang/, 0.8) ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
  const fl = 0.75 + 0.25 * Math.sin(t * 6) * Math.sin(t * 1.9);
  return (
    <AbsoluteFill style={BG}>
      <Live cam={cam}><defs><Glow id="g7" c="#8fb7ff" o={0.75} /><Glow id="g7b" c="#e8f4ff" o={0.9} /></defs>
        <rect width={1296} height={2304} fill="#0b0d13" />
        <ellipse cx={1250} cy={950} rx={700} ry={800} fill="url(#g7)" opacity={fl} />
        <Profile rim="#8fb7ff" />
        <ellipse cx={420} cy={1560} rx={220} ry={160} fill="url(#g7b)" opacity={ring} />
      </Live>
    </AbsoluteFill>
  );
};

export const S08: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 1 + 0.1 * p, dx: 0, dy: 0 };
  const name = ramp(t, wordAt(8, /Dad/, 0.75) - 0.2, wordAt(8, /Dad/, 0.75) + 0.2);
  const pulse = 0.5 + 0.5 * Math.sin(t * 9);
  return (
    <AbsoluteFill style={BG}>
      <Live cam={cam}><defs><Glow id="g8" c="#e8f4ff" o={0.45} />
        <linearGradient id="ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2a44" /><stop offset="1" stopColor="#0c1424" /></linearGradient></defs>
        <rect width={1296} height={2304} fill="#07080b" />
        <ellipse cx={648} cy={1100} rx={700} ry={900} fill="url(#g8)" />
        <path d="M250 1700 Q260 1500 380 1450 L380 1900 Z" fill="#2a2228" />
        <rect x={360} y={420} width={576} height={1180} rx={70} fill="#0c0c0e" />
        <rect x={380} y={440} width={536} height={1140} rx={56} fill="url(#ps)" />
        <text x={648} y={600} fill="#e8f4ff" opacity={0.7} fontSize={44} textAnchor="middle" fontFamily="sans-serif">Incoming call</text>
        <circle cx={648} cy={820} r={120} fill="#e8f4ff" opacity={0.18} />
        <circle cx={648} cy={790} r={42} fill="#e8f4ff" opacity={0.6} /><path d="M570 900 Q648 820 726 900 Z" fill="#e8f4ff" opacity={0.6} />
        <text x={648} y={1060} fill="#e8f4ff" fontSize={130} fontWeight={700} textAnchor="middle" fontFamily="sans-serif" opacity={0.35 + 0.65 * name}>BAPAK</text>
        <text x={648} y={1130} fill="#ff7a59" fontSize={46} textAnchor="middle" fontFamily="sans-serif" opacity={name}>Dad</text>
        <circle cx={500} cy={1420} r={62 + 8 * pulse} fill="#e35b4b" /><circle cx={796} cy={1420} r={62 + 8 * pulse} fill="#3fbf6a" />
        <path d="M770 1410 Q796 1440 822 1410" stroke="#fff" strokeWidth={10} fill="none" />
      </Live>
    </AbsoluteFill>
  );
};

export const S09: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1, dx: 0, dy: -60 };
  return (
    <AbsoluteFill style={BG}>
      <Live cam={cam}><defs><Glow id="g9" c="#8fb7ff" o={0.6} /><Glow id="g9b" c="#e8f4ff" o={0.6} /></defs>
        <rect width={1296} height={2304} fill="#0b0d13" />
        <ellipse cx={1250} cy={950} rx={700} ry={800} fill="url(#g9)" />
        <ellipse cx={740} cy={1050} rx={170} ry={200} fill="url(#g9b)" opacity={0.8 + 0.2 * Math.sin(t * 3)} />
        <Profile phone={1} rim="#8fb7ff" />
        <path d="M150 300 L150 1500" stroke="#2a2d36" strokeWidth={30} opacity={0.5} />
      </Live>
    </AbsoluteFill>
  );
};

export const S10: React.FC = () => {
  const { p, t } = useShot();
  const open = ramp(t, wordAt(10, /opening|slowly/, 0.7), wordAt(10, /opening/, 0.95, 'end') + 0.4, EIO);
  const cam: Cam = { zoom: 1.7 + 0.15 * p, dx: -280, dy: 40, ox: 1005, oy: 1040 };
  const dw = 150 * (1 - 0.7 * open);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="inside/room" cam={cam} />
      <Live cam={cam}><defs><clipPath id="c10"><rect x={930} y={760} width={150} height={560} /></clipPath>
        <linearGradient id="d10" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a2a30" /><stop offset="1" stopColor="#4a5468" /></linearGradient>
        <radialGradient id="r10" cx="0.6" cy="0.35" r="0.6"><stop offset="0" stopColor="#3a4a66" /><stop offset="1" stopColor="#030305" /></radialGradient>
        <linearGradient id="f10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb7ff" stopOpacity={0.35} /><stop offset="1" stopColor="#8fb7ff" stopOpacity={0} /></linearGradient></defs>
        <rect x={850} y={600} width={300} height={910} fill="#0c0f15" />
        <path d="M850 1510 L1150 1510 L1080 1320 L930 1320 Z" fill="#0f131b" />
        <rect x={930} y={760} width={150} height={560} fill="url(#r10)" />
        <g clipPath="url(#c10)"><g transform="translate(1035 1320) scale(0.52)" opacity={0.25 + 0.75 * open}><Father rim="#8fb7ff" /></g></g>
        <path d={`M${930 + dw} 1320 L1080 1320 L${1080 + 60 * open} 1510 L${930 + dw - 40} 1510 Z`} fill="url(#f10)" opacity={0.3 + 0.7 * open} />
        <path d={`M930 760 L${930 + dw} ${760 + 25 * open} L${930 + dw} ${1320 - 18 * open} L930 1320 Z`} fill="url(#d10)" />
        <rect x={930 + dw * 0.14} y={800} width={dw * 0.72} height={210} fill="none" stroke="#1a1c22" strokeWidth={5} />
        <rect x={930 + dw * 0.14} y={1060} width={dw * 0.72} height={220} fill="none" stroke="#1a1c22" strokeWidth={5} />
        <circle cx={930 + dw * 0.86} cy={1050} r={7} fill="#b9c8e0" />
        <rect x={918} y={748} width={174} height={584} fill="none" stroke="#3a4252" strokeWidth={14} />
        <line x1={1092} y1={748} x2={1092} y2={1332} stroke="#8fb7ff" strokeWidth={3} opacity={0.5} />
      </Live>
      <Live cam={cam} k={1.25}><rect x={1200} y={500} width={140} height={1300} fill="#020203" /></Live>
    </AbsoluteFill>
  );
};
