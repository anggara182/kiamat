import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, handheld, ramp, EIO, Cam } from '../comp/Camera';
import { wordAt } from '../data/ep';

const frac = (id: number, re: RegExp, fb: number, sec: number) => Math.min(0.95, wordAt(id, re, fb) / sec);

/** Friend seen from behind; head top at (0,0). Shoulder-length hair, rounded sweater shoulders. */
const FriendBack: React.FC<{ x: number; y: number; s?: number; rim?: string; dark?: boolean }> = ({ x, y, s = 1, rim = '#9fc4ff', dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 150 L30 150 L34 215 L-34 215Z" fill={dark ? '#08090d' : '#1b1618'} />
    <path d="M-60 200 Q-150 200 -200 250 Q-246 296 -252 400 L-272 1500 L272 1500 L252 400 Q246 296 200 250 Q150 200 60 200 Q0 214 -60 200Z" fill={dark ? '#0c0f15' : '#3b4252'} />
    {!dark && <path d="M-64 204 Q0 226 64 204" stroke="#4d5568" strokeWidth="16" fill="none" strokeLinecap="round" />}
    {!dark && <path d="M-200 300 Q-170 560 -184 880 M-70 330 Q-84 600 -70 890 M90 330 Q100 600 84 890 M196 310 Q176 560 196 880" stroke="#30364a" strokeWidth="6" fill="none" opacity="0.7" />}
    <path d="M0 0 Q-88 0 -98 100 Q-106 170 -98 228 Q-110 260 -104 292 Q-92 280 -84 304 Q-70 290 -56 316 Q-42 298 -26 306 Q-12 322 4 302 Q20 316 36 296 Q52 310 66 286 Q82 300 92 276 Q108 282 100 236 Q106 170 98 100 Q88 0 0 0Z" fill={dark ? '#06080c' : '#0e0c11'} />
    {!dark && <path d="M-24 12 Q-74 60 -82 170 Q-84 220 -76 256 M8 8 Q-22 90 -30 200 Q-32 240 -24 266 M32 14 Q54 100 44 210 Q40 244 48 262 M64 34 Q92 120 84 230" stroke="#26212c" strokeWidth="3" fill="none" opacity="0.55" />}
    <path d="M-30 6 Q-90 20 -98 110 Q-104 180 -96 228" stroke={rim} strokeWidth="5" fill="none" opacity="0.75" />
    <path d="M30 6 Q90 20 98 110" stroke={rim} strokeWidth="3" fill="none" opacity="0.45" />
    <path d="M-98 150 Q-116 220 -112 300 M98 160 Q114 220 108 280 M-60 290 Q-58 320 -66 334" stroke={rim} strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M-150 206 Q-215 236 -240 320 M150 206 Q215 236 240 320" stroke={rim} strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
  </g>
);

/** Room wall with window hole (frame mullions), world coords. */
const Wall: React.FC<{ wx: number; wy: number; ww: number; wh: number }> = ({ wx, wy, ww, wh }) => (
  <g>
    <defs>
      <linearGradient id="hw-wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#10141c" /><stop offset="0.5" stopColor="#1a2130" /><stop offset="1" stopColor="#0e1118" />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" fill="url(#hw-wall)" d={`M-400 -400 H1700 V2700 H-400Z M${wx} ${wy} h${ww} v${wh} h${-ww}Z`} />
    <rect x={wx - 18} y={wy - 18} width={ww + 36} height={wh + 36} fill="none" stroke="#0a0c11" strokeWidth="36" />
    <rect x={wx + ww / 2 - 10} y={wy} width="20" height={wh} fill="#0a0c11" />
    <rect x={wx - 40} y={wy + wh + 10} width={ww + 80} height="30" fill="#2a3a55" />
    <rect x={wx - 40} y={wy + wh + 10} width={ww + 80} height="4" fill="#9fb6d6" opacity="0.6" />
  </g>
);

/** 5: friend from behind at the dark window; slow push-in. */
export const S05: React.FC = () => {
  const { p, t } = useShot();
  const h = handheld(t, 0.5);
  const cam: Cam = { zoom: 1 + 0.12 * EIO(p), dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr, oy: 820 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#141820' }}>
      <BandImg id="home/outside" k={0.4} cam={{ ...cam, dy: 60 }} />
      <Live cam={cam}>
        <Wall wx={250} wy={420} ww={820} wh={1060} />
        <FriendBack x={760} y={930} s={1.05} />
      </Live>
    </AbsoluteFill>
  );
};

/** 6: rack from window to the warm kitchen doorway; mother standing still. */
export const S06: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.4);
  const r0 = frac(6, /mother/, 0.25, sec);
  const rk = ramp(p, r0, r0 + 0.2);
  const cam: Cam = { zoom: 1 + 0.05 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, rot: h.hr };
  return (
    <AbsoluteFill style={{ backgroundColor: '#141820' }}>
      <BandImg id="home/kitchenSoft" cam={cam} />
      <BandImg id="home/kitchen" cam={cam} style={{ opacity: rk }} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="h6-cold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2a3a55" stopOpacity="0.9" /><stop offset="1" stopColor="#2a3a55" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="520" height="2304" fill="url(#h6-cold)" />
        <g opacity={1 - 0.35 * rk}>
          <FriendBack x={330} y={980} s={1.35} rim="#9fc4ff" dark={rk > 0.5} />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 7: adult hand settles on a sweater shoulder, window glow beyond. Locked. */
export const S07: React.FC = () => {
  const { p, sec } = useShot();
  const hp = frac(7, /hand/, 0.4, sec);
  const a = ramp(p, hp - 0.12, hp + 0.08);
  const press = ramp(p, hp + 0.3, hp + 0.5);
  const cam: Cam = { zoom: 1, dx: 0, dy: 0 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0e1118' }}>
      <BandImg id="home/outsideSoft" k={0.3} cam={{ zoom: 1.6, dx: -120, dy: 200 }} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="h7-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9fc4ff" stopOpacity="0.35" /><stop offset="1" stopColor="#9fc4ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="h7-sw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a6378" /><stop offset="0.5" stopColor="#3b4252" /><stop offset="1" stopColor="#232733" />
          </linearGradient>
          <linearGradient id="h7-skin" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0a878" /><stop offset="0.6" stopColor="#a26a4a" /><stop offset="1" stopColor="#5a382a" />
          </linearGradient>
        </defs>
        <rect width="1296" height="2304" fill="#0e1118" opacity="0.35" />
        <ellipse cx="700" cy="700" rx="600" ry="520" fill="url(#h7-glow)" />
        {/* hair edge at left */}
        <path d="M100 200 Q260 400 300 900 Q320 1200 240 1500 L0 1500 L0 200Z" fill="#0d0b10" />
        <path d="M100 200 Q260 400 300 900 Q320 1200 240 1500" stroke="#9fc4ff" strokeWidth="5" fill="none" opacity="0.6" />
        {/* shoulder of sweater */}
        <path d="M240 1080 Q520 1000 860 1080 Q1120 1150 1240 1400 L1300 2400 L120 2400 L160 1500 Q200 1150 240 1080Z" fill="url(#h7-sw)" />
        <path d="M300 1040 Q560 990 860 1080 Q1120 1150 1240 1400" stroke="#b9d0f0" strokeWidth="6" fill="none" opacity="0.7" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${420 + i * 150} ${1060 + i * 20} Q${440 + i * 150} ${1400} ${400 + i * 160} ${2100}`} stroke="#2c3240" strokeWidth="10" fill="none" />)}
        {/* hand + forearm from upper right */}
        <g transform={`translate(${(1 - a) * 520} ${(1 - a) * -360 + press * 6})`}>
          <path d="M1400 520 Q1200 640 1010 900 L940 1000 L1080 1060 L1200 900 Q1330 760 1460 680Z" fill="#6b4a3c" />
          <path d="M1400 520 Q1200 640 1010 900" stroke="#ffcf8f" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M960 960 Q860 990 760 1050 Q690 1095 640 1150 Q620 1175 650 1180 Q700 1150 760 1120 Q720 1160 690 1200 Q675 1225 705 1225 Q760 1185 800 1150 Q780 1190 760 1220 Q752 1245 780 1240 Q830 1200 860 1160 Q855 1195 845 1220 Q845 1240 870 1230 Q910 1180 940 1130 Q1000 1110 1060 1080 Q1100 1040 1080 990Z" fill="url(#h7-skin)" />
          <path d="M760 1120 Q720 1160 690 1200 M800 1150 Q780 1190 760 1220 M860 1160 Q855 1195 845 1220" stroke="#4a2e22" strokeWidth="4" fill="none" />
          <path d="M960 960 Q860 990 760 1050 Q690 1095 640 1150" stroke="#ffd9a0" strokeWidth="5" fill="none" opacity="0.9" />
          <path d="M1080 990 Q1010 960 960 960" stroke="#ffd9a0" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M905 1080 q12 -14 26 -6" stroke="#4a2e22" strokeWidth="3" fill="none" />
        </g>
        {/* fold under the hand */}
        <path d={`M640 1190 Q760 ${1240 + press * 20} 940 1150`} stroke="#232733" strokeWidth="12" fill="none" opacity={a} />
      </Live>
    </AbsoluteFill>
  );
};

/** 8: mother's profile in half shadow, eyes on the window (left), warm rim from the kitchen (right). */
export const S08: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.3);
  const tw = frac(8, /too/, 0.8, sec);
  const eye = 0.6 + 0.4 * ramp(p, tw - 0.1, tw + 0.05);
  const cam: Cam = { zoom: 1 + 0.06 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, oy: 760 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1016' }}>
      <BandImg id="home/kitchenSoft" k={0.3} cam={{ ...cam, zoom: 1.5, dx: 380 }} style={{ opacity: 0.55 }} />
      <Live cam={cam}>
        <defs>
          <linearGradient id="h8-cold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2a3a55" /><stop offset="0.55" stopColor="#141820" stopOpacity="0.6" /><stop offset="1" stopColor="#141820" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="h8-face" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a4a66" /><stop offset="0.35" stopColor="#1a1c24" /><stop offset="0.85" stopColor="#120f12" /><stop offset="1" stopColor="#7a4a2a" />
          </linearGradient>
        </defs>
        <rect width="1296" height="2304" fill="url(#h8-cold)" />
        <g transform="translate(40 40)">
          {/* hair + bun */}
          <path d="M600 520 Q700 380 880 420 Q1040 460 1060 640 Q1070 820 980 940 L760 900 Z" fill="#0b090c" />
          <circle cx="1040" cy="560" r="90" fill="#0b090c" />
          <path d="M1040 470 Q1130 500 1130 580" stroke="#ffcf8f" strokeWidth="6" fill="none" />
          <path d="M880 420 Q1000 440 1050 520" stroke="#ffcf8f" strokeWidth="4" fill="none" opacity="0.8" />
          {/* profile facing left */}
          <path d="M640 520 Q600 560 595 640 Q594 690 570 730 L520 820 Q512 838 540 842 L568 846 Q560 870 570 885 Q560 905 575 920 Q578 950 572 975 Q590 1010 650 1010 Q690 1012 712 1040 L730 1100 L1000 1100 L980 940 Q1040 820 1000 640 Q960 520 860 480 Q720 460 640 520Z" fill="url(#h8-face)" />
          <path d="M640 520 Q600 560 595 640 Q594 690 570 730 L520 820 Q512 838 540 842 L568 846 Q560 870 570 885 Q560 905 575 920 Q578 950 572 975 Q590 1010 650 1010" stroke="#8fb0e0" strokeWidth="4" fill="none" opacity="0.75" />
          <path d="M1000 640 Q1040 820 980 940 L1000 1100" stroke="#ffcf8f" strokeWidth="7" fill="none" />
          {/* eye: dim cool glint looking left */}
          <path d="M620 700 Q645 688 668 700 Q645 708 620 700Z" fill="#05060a" />
          <circle cx="628" cy="699" r="4" fill="#c9d6e6" opacity={eye} />
          <path d="M612 676 Q640 664 676 676" stroke="#05060a" strokeWidth="6" fill="none" />
          {/* ear in shadow + collar */}
          <path d="M820 690 Q850 680 855 720 Q850 760 825 760" stroke="#2a1c18" strokeWidth="8" fill="none" />
          <path d="M680 1080 Q760 1050 860 1070 Q960 1060 1030 1100 L1200 1500 L560 1500Z" fill="#1c1614" />
          <path d="M1030 1100 L1200 1500" stroke="#ffcf8f" strokeWidth="6" fill="none" opacity="0.8" />
          <path d="M760 1110 L720 1500 M900 1100 L880 1500" stroke="#3a2a22" strokeWidth="18" fill="none" />
        </g>
      </Live>
    </AbsoluteFill>
  );
};

/** 9: dark window glass, friend's faint reflection; two dull pale eyes between the pines. */
export const S09: React.FC = () => {
  const { p, sec } = useShot();
  const e0 = frac(9, /outside/, 0.25, sec);
  const eyes = ramp(p, e0, e0 + 0.15);
  const own = frac(9, /own/, 0.8, sec);
  const near = ramp(p, own - 0.1, own + 0.1);
  const cam: Cam = { zoom: 1.0 + 0.15 * EIO(p), dx: 0, dy: 0, oy: 900 };
  return (
    <AbsoluteFill style={{ backgroundColor: '#070b14' }}>
      <BandImg id="home/outside" k={0.6} cam={{ zoom: 2.3 + 0.2 * p, dx: 0, dy: 0, ox: 540, oy: 760 }} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="h9-eye" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#eef3f8" stopOpacity="0.9" /><stop offset="0.35" stopColor="#c9d6e6" stopOpacity="0.4" /><stop offset="1" stopColor="#c9d6e6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="h9-fur" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#eef3f8" stopOpacity="0.35" /><stop offset="1" stopColor="#eef3f8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="h9-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a3a55" stopOpacity="0.55" /><stop offset="0.5" stopColor="#0a1020" stopOpacity="0.35" /><stop offset="1" stopColor="#2a3a55" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* the pale shape + eyes between pines */}
        <g opacity={eyes}>
          <ellipse cx="660" cy="880" rx="220" ry="160" fill="url(#h9-fur)" />
          <g transform={`translate(0 ${-near * 10}) scale(${1}) `}>
            <ellipse cx="610" cy="860" rx={26 + near * 4} ry="11" fill="url(#h9-eye)" />
            <ellipse cx="712" cy="866" rx={26 + near * 4} ry="11" fill="url(#h9-eye)" />
            <ellipse cx="610" cy="860" rx="6" ry="4" fill="#e8eef4" opacity="0.8" />
            <ellipse cx="712" cy="866" rx="6" ry="4" fill="#e8eef4" opacity="0.8" />
          </g>
        </g>
        {/* foreground pine trunks outside framing the eyes */}
        <path d="M360 300 L420 300 L440 1700 L330 1700Z" fill="#060a10" />
        <path d="M900 300 L950 300 L990 1700 L880 1700Z" fill="#060a10" />
        <rect width="1296" height="2304" fill="url(#h9-glass)" />
        {/* faint reflection of the friend (in the glass) */}
        <g opacity="0.09">
          <path d="M1000 700 Q1100 690 1110 820 Q1112 930 1060 990 Q1150 1010 1220 1100 L1260 1700 L760 1700 L790 1100 Q850 1010 930 990 Q880 930 885 820 Q895 700 1000 700Z" fill="#c9d6e6" />
        </g>
        <path d="M1000 700 Q1100 690 1110 820" stroke="#c9d6e6" strokeWidth="3" fill="none" opacity="0.25" />
        {/* window frame */}
        <rect x="80" y="160" width="60" height="2000" fill="#0a0c11" />
        <rect x="80" y="1560" width="1200" height="600" fill="#0a0c11" />
        <rect x="140" y="1556" width="1140" height="5" fill="#7f93b0" opacity="0.6" />
        <path d="M200 1540 Q500 1500 900 1530 L1200 1540" stroke="#c9d6e6" strokeWidth="8" fill="none" opacity="0.2" />
      </Live>
    </AbsoluteFill>
  );
};
