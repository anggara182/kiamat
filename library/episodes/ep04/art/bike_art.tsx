import React from 'react';

/** Art for set "bike". All coords in world space (1296x2304); frame window = (108,192)..(1188,2112). */
export const P = {
  red: '#ff3b30', redDeep: '#5a0f14', ink: '#07080f', mid: '#121626', far: '#20263a',
  rimC: '#9fb4d8', rimW: '#ffc070', cloth: '#e9e4d6', clothSh: '#9aa0b0', knot: '#bdb6a4',
};

/** Night street at a red light (baked + blurred). */
export const BikeBg: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="bbSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a0d1c" /><stop offset="0.55" stopColor="#1b2238" /><stop offset="0.8" stopColor="#3a1e26" /><stop offset="1" stopColor="#120a10" />
      </linearGradient>
      <radialGradient id="bbRed" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff3b30" stopOpacity="0.95" /><stop offset="0.25" stopColor="#ff3b30" stopOpacity="0.45" /><stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bbSod" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd27a" stopOpacity="0.8" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={1296} height={2304} fill="url(#bbSky)" />
    <ellipse cx={648} cy={1150} rx={900} ry={700} fill="url(#bbRed)" opacity={0.35} />
    {/* far building silhouettes */}
    <path d="M0 1250 L0 900 L160 900 L160 780 L330 780 L330 1000 L470 1000 L470 860 L560 860 L560 1250 Z" fill="#20263a" />
    <path d="M760 1250 L760 820 L900 820 L900 720 L1060 720 L1060 940 L1296 940 L1296 1250 Z" fill="#20263a" />
    <rect x={0} y={1240} width={1296} height={1064} fill="#120a10" />
    {/* traffic light pole + red lamp (big bokeh) */}
    <rect x={985} y={420} width={22} height={830} fill="#07080f" />
    <rect x={950} y={360} width={92} height={240} rx={18} fill="#07080f" />
    <circle cx={996} cy={420} r={260} fill="url(#bbRed)" />
    <circle cx={996} cy={420} r={34} fill="#ffb0a8" />
    {/* sodium bokeh */}
    <circle cx={180} cy={640} r={110} fill="url(#bbSod)" opacity={0.6} />
    <circle cx={420} cy={720} r={70} fill="url(#bbSod)" opacity={0.45} />
    <circle cx={300} cy={1080} r={60} fill="url(#bbRed)" opacity={0.7} />
    <circle cx={1150} cy={1060} r={80} fill="url(#bbRed)" opacity={0.6} />
    {/* wet road red reflection */}
    <ellipse cx={996} cy={1500} rx={140} ry={420} fill="url(#bbRed)" opacity={0.35} />
  </g>
);

/** Shroud band wrapped around a waist: a curved strap with folds. a = from point, b = to point, sag = bulge, w = width. */
export const Strap: React.FC<{ ax: number; ay: number; bx: number; by: number; sag: number; w: number; id: string; folds?: number }> = ({ ax, ay, bx, by, sag, w, id, folds = 6 }) => {
  const mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
  const top = `M${ax} ${ay - w / 2} Q${mx} ${my - w / 2} ${bx} ${by - w / 2}`;
  const d = `${top} L${bx} ${by + w / 2} Q${mx} ${my + w / 2} ${ax} ${ay + w / 2} Z`;
  const fl = Array.from({ length: folds }, (_, i) => {
    const t = (i + 0.7) / (folds + 0.4);
    const x = (1 - t) * (1 - t) * ax + 2 * t * (1 - t) * mx + t * t * bx;
    const y = (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * my + t * t * by;
    const s = i % 2 ? 1 : -1;
    return `M${x - 14} ${y - w * 0.42} Q${x + 18 * s} ${y} ${x - 6} ${y + w * 0.44}`;
  });
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4efe2" /><stop offset="0.45" stopColor="#e9e4d6" /><stop offset="1" stopColor="#8a8f9e" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
      {fl.map((f, i) => <path key={i} d={f} stroke="#9aa0b0" strokeWidth={i % 2 ? 9 : 5} fill="none" strokeLinecap="round" opacity={0.75} />)}
      <path d={top} stroke="#ff8a7a" strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  );
};

/** Uncle from behind, waist wrapped in cloth (shot 7). Centered on x=648. */
export const UncleBack: React.FC<{ breath: number }> = ({ breath }) => (
  <g>
    <defs>
      <linearGradient id="ubJ" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3a1418" /><stop offset="0.25" stopColor="#121626" /><stop offset="0.8" stopColor="#0c0e18" /><stop offset="1" stopColor="#4a1418" />
      </linearGradient>
      <radialGradient id="ubH" cx="0.7" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#5a2228" /><stop offset="0.5" stopColor="#1a1c2a" /><stop offset="1" stopColor="#07080f" />
      </radialGradient>
    </defs>
    {/* torso / jacket */}
    <path d={`M420 ${960 - breath} Q440 ${860 - breath} 560 ${830 - breath} L736 ${830 - breath} Q856 ${860 - breath} 876 ${960 - breath} L900 1300 Q905 1420 880 1470 L416 1470 Q391 1420 396 1300 Z`} fill="url(#ubJ)" />
    {/* jacket seam + collar */}
    <path d={`M648 ${850 - breath} L648 1250`} stroke="#07080f" strokeWidth={6} opacity={0.7} />
    <path d={`M560 ${835 - breath} Q648 ${880 - breath} 736 ${835 - breath}`} stroke="#2a2e44" strokeWidth={14} fill="none" />
    <path d={`M420 ${960 - breath} Q440 ${860 - breath} 560 ${830 - breath}`} stroke="#ff5a4a" strokeWidth={6} fill="none" opacity={0.8} />
    <path d={`M876 ${960 - breath} L900 1300`} stroke="#ff5a4a" strokeWidth={6} fill="none" opacity={0.9} />
    {/* neck + helmet */}
    <rect x={608} y={760 - breath} width={80} height={90} fill="#0c0e18" />
    <ellipse cx={648} cy={660 - breath} rx={138} ry={150} fill="url(#ubH)" />
    <path d={`M512 ${690 - breath} Q648 ${740 - breath} 784 ${690 - breath} L780 ${760 - breath} Q648 ${800 - breath} 516 ${760 - breath} Z`} fill="#07080f" />
    <path d={`M560 ${545 - breath} Q648 ${505 - breath} 740 ${555 - breath}`} stroke="#ff8a7a" strokeWidth={7} fill="none" opacity={0.8} />
    <path d={`M770 ${600 - breath} Q790 ${660 - breath} 780 ${720 - breath}`} stroke="#ff5a4a" strokeWidth={8} fill="none" />
    {/* cloth wrapped around the waist: two straps meeting from the front */}
    <Strap ax={392} ay={1215} bx={904} by={1205} sag={50} w={92} id="ubS1" folds={7} />
    <Strap ax={400} ay={1300} bx={898} by={1290} sag={34} w={64} id="ubS2" folds={5} />
    {/* cloth ends wrapping round the sides (arms in cloth) */}
    <path d="M392 1160 Q340 1230 372 1330 L410 1330 Q396 1250 430 1170 Z" fill="#cfc9bb" />
    <path d="M904 1150 Q960 1230 924 1330 L888 1330 Q902 1250 866 1165 Z" fill="#cfc9bb" />
    <path d="M904 1150 Q960 1230 924 1330" stroke="#ff8a7a" strokeWidth={5} fill="none" />
  </g>
);

/** Extreme close-up: cloth across the jacket front ending in a knot (shot 8). Knot at (cx,cy). */
export const KnotCU: React.FC<{ cx: number; cy: number; tug: number }> = ({ cx, cy, tug }) => (
  <g>
    <defs>
      <linearGradient id="kJ" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b1e2e" /><stop offset="0.6" stopColor="#0c0e18" /><stop offset="1" stopColor="#2a0e12" />
      </linearGradient>
      <radialGradient id="kK" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fbf7ec" /><stop offset="0.45" stopColor="#e9e4d6" /><stop offset="0.8" stopColor="#bdb6a4" /><stop offset="1" stopColor="#7f8494" />
      </radialGradient>
      <linearGradient id="kT" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9e4d6" /><stop offset="1" stopColor="#8a8f9e" />
      </linearGradient>
      <radialGradient id="kRed" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff3b30" stopOpacity="0.5" /><stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* jacket front fills the frame */}
    <rect x={0} y={0} width={1296} height={2304} fill="url(#kJ)" />
    <ellipse cx={1150} cy={500} rx={700} ry={600} fill="url(#kRed)" />
    {/* zipper + jacket fold lines */}
    <path d="M648 192 L640 2112" stroke="#05060b" strokeWidth={14} />
    <path d="M660 192 L652 2112" stroke="#3a1a20" strokeWidth={3} strokeDasharray="10 12" />
    <path d="M260 300 Q330 700 250 1000 M1010 260 Q960 600 1060 900" stroke="#05060b" strokeWidth={18} fill="none" opacity={0.6} />
    {/* left strap (arm in cloth) coming from frame left, curving to knot */}
    <path d={`M-40 ${cy - 300} Q300 ${cy - 210} ${cx - 70} ${cy - 50} L${cx - 60} ${cy + 80} Q280 ${cy + 40} -40 ${cy + 10} Z`} fill="url(#kT)" />
    {/* right strap */}
    <path d={`M1340 ${cy - 330} Q1000 ${cy - 220} ${cx + 70} ${cy - 55} L${cx + 60} ${cy + 80} Q1010 ${cy + 40} 1340 ${cy + 0} Z`} fill="url(#kT)" />
    {/* strap folds (tactile) */}
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 40 + i * 92;
      return <path key={'l' + i} d={`M${x} ${cy - 270 + i * 40} Q${x + 40} ${cy - 120 + i * 20} ${x + 10} ${cy + 20 + i * 6}`} stroke="#9aa0b0" strokeWidth={i % 2 ? 12 : 6} fill="none" strokeLinecap="round" opacity={0.8} />;
    })}
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 1250 - i * 92;
      return <path key={'r' + i} d={`M${x} ${cy - 300 + i * 46} Q${x - 46} ${cy - 130 + i * 20} ${x - 8} ${cy + 10 + i * 8}`} stroke="#9aa0b0" strokeWidth={i % 2 ? 6 : 12} fill="none" strokeLinecap="round" opacity={0.8} />;
    })}
    {/* highlight on strap tops (red wash) */}
    <path d={`M-40 ${cy - 300} Q300 ${cy - 210} ${cx - 70} ${cy - 50}`} stroke="#ff9a8a" strokeWidth={6} fill="none" opacity={0.7} />
    <path d={`M1340 ${cy - 330} Q1000 ${cy - 220} ${cx + 70} ${cy - 55}`} stroke="#ff9a8a" strokeWidth={6} fill="none" opacity={0.8} />
    {/* hanging tails */}
    <g transform={`rotate(${tug * 3} ${cx} ${cy + 40})`}>
      <path d={`M${cx - 40} ${cy + 60} Q${cx - 120} ${cy + 260} ${cx - 90} ${cy + 430} L${cx - 20} ${cy + 410} Q${cx - 40} ${cy + 250} ${cx + 10} ${cy + 80} Z`} fill="url(#kT)" />
      <path d={`M${cx + 30} ${cy + 60} Q${cx + 110} ${cy + 230} ${cx + 70} ${cy + 380} L${cx + 140} ${cy + 360} Q${cx + 150} ${cy + 220} ${cx + 70} ${cy + 60} Z`} fill="url(#kT)" />
      <path d={`M${cx - 60} ${cy + 140} Q${cx - 80} ${cy + 280} ${cx - 60} ${cy + 400}`} stroke="#8a8f9e" strokeWidth={7} fill="none" />
      <path d={`M${cx + 80} ${cy + 130} Q${cx + 110} ${cy + 240} ${cx + 100} ${cy + 350}`} stroke="#8a8f9e" strokeWidth={7} fill="none" />
      <path d={`M${cx - 90} ${cy + 430} L${cx - 76} ${cy + 412} L${cx - 58} ${cy + 428} L${cx - 40} ${cy + 410} L${cx - 20} ${cy + 410}`} stroke="#bdb6a4" strokeWidth={4} fill="none" />
    </g>
    {/* the knot: a twisted bulb with a darker binding band */}
    <g transform={`translate(${cx} ${cy}) scale(${1 - tug * 0.05} ${1 + tug * 0.03})`}>
      <ellipse cx={0} cy={6} rx={150} ry={118} fill="#4a4e5e" />
      <ellipse cx={-6} cy={0} rx={140} ry={108} fill="url(#kK)" />
      <path d="M-120 -40 Q-40 -110 60 -80 Q130 -50 132 20" stroke="#9aa0b0" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M-128 30 Q-60 -20 20 10 Q90 40 120 80" stroke="#9aa0b0" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-60 -95 Q-20 -20 -40 90" stroke="#bdb6a4" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M-60 -95 Q-20 -20 -40 90" stroke="#8a8f9e" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M40 -100 Q70 -10 50 95" stroke="#bdb6a4" strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M-100 -70 Q-70 -98 -20 -102" stroke="#fffaf0" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M70 -86 Q120 -60 136 -10" stroke="#ff9a8a" strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

/** Helmet edge + ear in profile facing right (shot 9). Ear at (ex,ey). */
export const EarProfile: React.FC<{ ex: number; ey: number }> = ({ ex, ey }) => (
  <g>
    <defs>
      <linearGradient id="epSkin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2a1416" /><stop offset="0.6" stopColor="#5a2a26" /><stop offset="1" stopColor="#7a3a32" />
      </linearGradient>
      <linearGradient id="epHel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2a2e44" /><stop offset="0.5" stopColor="#121626" /><stop offset="1" stopColor="#07080f" />
      </linearGradient>
    </defs>
    {/* head/neck skin */}
    <path d={`M${ex - 260} ${ey - 200} L${ex + 520} ${ey - 260} L${ex + 560} ${ey + 1400} L${ex - 120} ${ey + 1400} Q${ex - 230} ${ey + 400} ${ex - 260} ${ey - 200} Z`} fill="url(#epSkin)" />
    {/* jaw shadow + nape rim */}
    <path d={`M${ex + 300} ${ey + 140} Q${ex + 200} ${ey + 360} ${ex + 40} ${ey + 520}`} stroke="#1a0a0c" strokeWidth={30} fill="none" opacity={0.6} />
    <path d={`M${ex - 250} ${ey - 120} Q${ex - 220} ${ey + 400} ${ex - 140} ${ey + 900}`} stroke="#ff5a4a" strokeWidth={8} fill="none" opacity={0.8} />
    {/* hair at nape */}
    <path d={`M${ex - 256} ${ey - 160} Q${ex - 120} ${ey - 60} ${ex - 40} ${ey - 130} L${ex - 30} ${ey - 220} L${ex - 270} ${ey - 220} Z`} fill="#0a0a10" />
    {/* ear */}
    <path d={`M${ex - 20} ${ey - 120} Q${ex + 90} ${ey - 160} ${ex + 110} ${ey - 40} Q${ex + 120} ${ey + 60} ${ex + 60} ${ey + 110} Q${ex + 30} ${ey + 160} ${ex - 10} ${ey + 130} Q${ex - 40} ${ey + 20} ${ex - 20} ${ey - 120} Z`} fill="#6a3430" />
    <path d={`M${ex + 10} ${ey - 90} Q${ex + 80} ${ey - 110} ${ex + 82} ${ey - 30} Q${ex + 84} ${ey + 40} ${ex + 40} ${ey + 80}`} stroke="#2a1214" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d={`M${ex + 30} ${ey - 30} Q${ex + 50} ${ey + 10} ${ex + 26} ${ey + 40}`} stroke="#2a1214" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M${ex - 20} ${ey - 120} Q${ex + 90} ${ey - 160} ${ex + 110} ${ey - 40} Q${ex + 120} ${ey + 60} ${ex + 60} ${ey + 110}`} stroke="#ff7a6a" strokeWidth={5} fill="none" />
    {/* helmet edge from top, padded rim */}
    <path d={`M${ex - 500} ${ey - 1200} L${ex + 700} ${ey - 1200} L${ex + 700} ${ey - 300} Q${ex + 200} ${ey - 200} ${ex - 60} ${ey - 190} Q${ex - 300} ${ey - 180} ${ex - 500} ${ey - 120} Z`} fill="url(#epHel)" />
    <path d={`M${ex + 700} ${ey - 300} Q${ex + 200} ${ey - 200} ${ex - 60} ${ey - 190} Q${ex - 300} ${ey - 180} ${ex - 500} ${ey - 120}`} stroke="#05060b" strokeWidth={34} fill="none" />
    <path d={`M${ex + 700} ${ey - 330} Q${ex + 200} ${ey - 235} ${ex - 60} ${ey - 225} Q${ex - 300} ${ey - 215} ${ex - 500} ${ey - 155}`} stroke="#ff6a5a" strokeWidth={6} fill="none" opacity={0.8} />
    {/* chin strap */}
    <path d={`M${ex + 170} ${ey - 200} L${ex + 300} ${ey + 500}`} stroke="#07080f" strokeWidth={26} />
  </g>
);

/** Cloth edge creeping in behind the head (shot 9): a pale fold with the tied tuft hint. */
export const ClothEdge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <linearGradient id="ceG" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#c4bfb3" /><stop offset="0.07" stopColor="#7d8293" /><stop offset="0.5" stopColor="#3a3e4c" /><stop offset="1" stopColor="#14161e" />
      </linearGradient>
    </defs>
    <path d="M-700 -500 L40 -420 Q130 -160 80 120 Q30 380 110 900 L-700 960 Z" fill="url(#ceG)" />
    <path d="M40 -420 Q110 -150 70 120 Q40 380 90 700" stroke="#e9e4d6" strokeWidth={5} fill="none" opacity={0.85} />
    <path d="M-20 -300 Q20 -80 -10 160 M-90 -200 Q-50 50 -80 400" stroke="#6a6f80" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

/** The pocong face leaning in: hooded shroud with a featureless dark oval opening (shot 10). */
export const PocongFace: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="pfC" cx="0.75" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#6a7186" /><stop offset="0.45" stopColor="#2e3242" /><stop offset="1" stopColor="#0b0d14" />
      </radialGradient>
      <radialGradient id="pfO" cx="0.55" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#000000" /><stop offset="0.8" stopColor="#030306" /><stop offset="1" stopColor="#14161e" />
      </radialGradient>
    </defs>
    {/* hood body */}
    <path d="M300 2112 Q250 1500 320 1100 Q380 700 560 560 Q640 500 720 520 Q900 560 980 820 Q1060 1100 1040 1500 Q1030 1800 1100 2112 Z" fill="url(#pfC)" />
    {/* tuft tied above the head */}
    <path d="M610 540 Q600 470 560 400 Q640 430 660 380 Q690 440 760 420 Q720 480 712 528 Z" fill="#2e3242" />
    <path d="M596 530 Q650 500 720 524" stroke="#4a5064" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M660 380 Q690 440 760 420" stroke="#9fb4d8" strokeWidth={5} fill="none" />
    {/* cloth folds */}
    <path d="M420 1200 Q470 1500 430 1900 M900 1250 Q960 1550 940 1950 M520 1560 Q600 1700 560 2000" stroke="#0b0d14" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.7} />
    {/* opening rim (cloth edge rolled around the oval) */}
    <ellipse cx={668} cy={1000} rx={196} ry={262} fill="#3a3f52" transform="rotate(-8 668 1000)" />
    <ellipse cx={664} cy={1006} rx={170} ry={236} fill="url(#pfO)" transform="rotate(-8 664 1006)" />
    <path d="M800 840 Q860 980 820 1160" stroke="#9fb4d8" strokeWidth={6} fill="none" opacity={0.8} />
    <path d="M500 800 Q650 700 830 790 Q700 760 560 830 Z" fill="#4a5064" />
    <path d="M520 806 Q650 718 810 786" stroke="#9fb4d8" strokeWidth={4} fill="none" opacity={0.7} />
    {/* cold rim on the outer silhouette */}
    <path d="M720 520 Q900 560 980 820 Q1060 1100 1040 1500 Q1030 1800 1100 2112" stroke="#9fb4d8" strokeWidth={9} fill="none" />
    <path d="M560 560 Q640 500 720 520" stroke="#9fb4d8" strokeWidth={6} fill="none" opacity={0.7} />
  </g>
);
