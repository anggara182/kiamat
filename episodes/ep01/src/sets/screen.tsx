import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { H, rng } from '../art/world';

/**
 * Set "screen" (shots 4, 5, 10). Static bands baked ONCE to public/baked/screen/<band>.png. Ids "screen/<band>".
 *  - train_out : hazy day city seen through a commuter-train window (wide, panned live = the train moving)
 *  - train_in  : train interior around the window (soft, out of focus)
 *  - room_bg   : night bedroom wall + window (lit only by the phone, soft)
 *  - room_desk : the desk top the phone lies on, with the phone's light pool baked in
 * Art inside world bands is drawn in FRAME coords through translate(108 192).
 */
export const OUT_W = 2400;
const FR: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;

/* ---------------- day: outside the train window ---------------- */
const trainOut = () => {
  const r = rng(41);
  const far: React.ReactNode[] = [], mid: React.ReactNode[] = [];
  for (let x = -40; x < OUT_W; ) {
    const w = 70 + r() * 110, h = 160 + r() * 380;
    far.push(<rect key={x} x={x} y={1250 - h} width={w} height={h + 40} fill={r() > 0.5 ? '#b3bfc6' : '#aab7bf'} />);
    x += w + 20 + r() * 90;
  }
  for (let x = -60; x < OUT_W; ) {
    const w = 120 + r() * 200, h = 70 + r() * 170;
    mid.push(<rect key={x} x={x} y={1330 - h} width={w} height={h + 60} fill="#97a0a3" />);
    x += w + 10 + r() * 60;
  }
  return (
    <g>
      <defs>
        <linearGradient id="soSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb8c9" /><stop offset="0.3" stopColor="#d6dfe2" /><stop offset="0.52" stopColor="#f1ead8" /><stop offset="0.62" stopColor="#c9c6bb" /><stop offset="1" stopColor="#77796f" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={OUT_W} height={H} fill="url(#soSky)" />
      {far}
      {mid}
      {/* near rooftops / trees just below the window line */}
      <path d={`M0 1420 ${Array.from({ length: 25 }, (_, i) => `Q${i * 100 + 50} ${1330 + (i % 3) * 30} ${i * 100 + 100} ${1400 + ((i * 7) % 4) * 18}`).join(' ')} L${OUT_W} ${H} L0 ${H} Z`} fill="#6e7a68" />
      <rect x={0} y={1540} width={OUT_W} height={H - 1540} fill="#5f655d" />
      {/* utility poles + wires */}
      {[260, 980, 1700, 2300].map((x) => (
        <g key={x} fill="#55595b">
          <rect x={x} y={640} width={16} height={1000} />
          <rect x={x - 50} y={690} width={116} height={10} />
        </g>
      ))}
      <path d="M268 700 Q620 780 988 700 Q1340 780 1708 700 Q2010 770 2308 700" stroke="#55595b" strokeWidth={3} fill="none" />
    </g>
  );
};

/* ---------------- day: train interior around the window ---------------- */
const WIN = { x: 30, y: 70, w: 1020, h: 1170, r: 84 };
const trainIn = () => {
  const { x, y, w, h, r } = WIN;
  const hole = `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
  return (
    <FR>
      <defs>
        <linearGradient id="siWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ddd8ce" /><stop offset="0.5" stopColor="#c2bdb2" /><stop offset="1" stopColor="#8e897f" />
        </linearGradient>
        <radialGradient id="siHaze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffdf2" stopOpacity={0.75} /><stop offset="0.45" stopColor="#fff6dc" stopOpacity={0.32} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* wall with the window cut out */}
      <path d={`M-140 -230 L1230 -230 L1230 2150 L-140 2150 Z ${hole}`} fillRule="evenodd" fill="url(#siWall)" />
      <path d={hole} fill="none" stroke="#6f6b64" strokeWidth={26} />
      {/* haze / sun bloom over the glass */}
      <ellipse cx={330} cy={420} rx={820} ry={760} fill="url(#siHaze)" />
      {/* seat backs below the window (darker, quiet behind the captions) */}
      <path d="M-140 1330 Q-140 1280 -80 1280 L430 1280 Q492 1280 492 1340 L492 2150 L-140 2150 Z" fill="#4a5466" />
      <path d="M570 1340 Q570 1280 632 1280 L1170 1280 Q1230 1280 1230 1340 L1230 2150 L570 2150 Z" fill="#455063" />
      <rect x={492} y={1300} width={78} height={850} fill="#2f3745" />
      {/* hanging grab strap, top right */}
      <rect x={858} y={-230} width={26} height={430} fill="#5a626c" />
      <ellipse cx={871} cy={262} rx={44} ry={62} fill="none" stroke="#5a626c" strokeWidth={18} />
    </FR>
  );
};

/* ---------------- night: bedroom wall + window ---------------- */
const roomBg = () => {
  const r = rng(77);
  return (
    <FR>
      <defs>
        <linearGradient id="srWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#090b15" /><stop offset="1" stopColor="#121728" /></linearGradient>
        <linearGradient id="srSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070f" /><stop offset="0.6" stopColor="#0d1222" /><stop offset="1" stopColor="#18203a" /></linearGradient>
        <radialGradient id="srWash" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#bfe3ff" stopOpacity={0.16} /><stop offset="1" stopColor="#bfe3ff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={-140} y={-230} width={1370} height={1000} fill="url(#srWall)" />
      {/* window, cropped by the frame top */}
      <rect x={110} y={-220} width={470} height={480} fill="#04050a" />
      <rect x={130} y={-200} width={430} height={440} fill="url(#srSky)" />
      {Array.from({ length: 7 }, (_, i) => {
        const bx = 130 + i * 64 + r() * 20, bh = 60 + r() * 170;
        return <rect key={i} x={bx} y={240 - bh} width={44 + r() * 30} height={bh} fill="#070910" />;
      })}
      {[[190, 150], [262, 110], [300, 190], [420, 100], [470, 175], [520, 140]].map(([x, y], i) => <rect key={i} x={x} y={y} width={6} height={8} fill="#ffcf86" opacity={0.45} />)}
      <rect x={339} y={-200} width={12} height={440} fill="#04050a" />
      <rect x={130} y={20} width={430} height={12} fill="#04050a" />
      <rect x={100} y={250} width={490} height={18} fill="#0b0e19" />
      {/* curtains */}
      <path d="M20 -230 L170 -230 Q150 100 186 330 L40 350 Q0 100 20 -230 Z" fill="#080a13" />
      <path d="M70 -200 Q60 100 90 340 M130 -200 Q118 100 146 330" stroke="#10142280" strokeWidth={8} fill="none" />
      <path d="M548 -230 L640 -230 Q630 100 650 320 L572 330 Q560 100 548 -230 Z" fill="#080a13" />
      {/* wall shelf with books, right */}
      <rect x={680} y={150} width={300} height={14} fill="#0d101c" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={700 + i * 40 + (i > 3 ? 40 : 0)} y={150 - (95 + ((i * 37) % 50))} width={30} height={95 + ((i * 37) % 50)} fill={i % 2 ? '#0b0e19' : '#0f1220'} />)}
      <rect x={680} y={162} width={300} height={4} fill="#1d2740" opacity={0.7} />
      {/* the bed behind the desk: headboard right, mattress, pillow (the sleeper himself is live) */}
      <rect x={-140} y={330} width={1370} height={300} fill="#070912" />
      <path d="M990 180 L1230 170 L1230 630 L990 630 Z" fill="#0a0d17" />
      <path d="M990 180 L990 630" stroke="#1f2a44" strokeWidth={4} opacity={0.8} />
      <path d="M-140 440 C200 425 600 420 990 430 L990 630 L-140 630 Z" fill="#0d1120" />
      <path d="M-140 440 C200 425 600 420 990 430" stroke="#1c2540" strokeWidth={3} opacity={0.7} />
      <ellipse cx={850} cy={440} rx={130} ry={44} fill="#151b2b" />
      <path d="M730 452 C790 476 900 478 970 452" stroke="#222c45" strokeWidth={3} fill="none" opacity={0.7} />
      {/* phone light washing the lower wall */}
      <ellipse cx={540} cy={560} rx={760} ry={300} fill="url(#srWash)" />
    </FR>
  );
};

/* ---------------- night: desk top (phone light pool baked in) ---------------- */
export const DESK = { y: 600, phone: { x: 540, y: 1010 } };
const roomDesk = () => {
  const { x: px, y: py } = DESK.phone;
  return (
    <FR>
      <defs>
        <linearGradient id="sdTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#15110f" /><stop offset="1" stopColor="#0a0807" /></linearGradient>
        <radialGradient id="sdPool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#bfe3ff" stopOpacity={0.34} /><stop offset="0.45" stopColor="#9cc4e8" stopOpacity={0.13} /><stop offset="1" stopColor="#9cc4e8" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sdFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.75} /></linearGradient>
        <radialGradient id="sdSh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" stopOpacity={0.6} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={-140} y={DESK.y} width={1370} height={1600} fill="url(#sdTop)" />
      {/* faint grain */}
      {[700, 860, 1080, 1320].map((y, i) => <path key={y} d={`M-140 ${y} Q400 ${y + 30 - i * 14} 1230 ${y + 10}`} stroke="#211a15" strokeWidth={3} fill="none" opacity={0.6} />)}
      <rect x={-140} y={DESK.y - 4} width={1370} height={6} fill="#2b3550" opacity={0.7} />
      <ellipse cx={px} cy={py} rx={620} ry={440} fill="url(#sdPool)" />
      {/* mug, upper left: cast shadow away from the phone, rim toward it */}
      <g transform="translate(-95 -10)">
      <ellipse cx={200} cy={720} rx={110} ry={46} fill="url(#sdSh)" />
      <path d="M180 690 L180 800 Q240 830 300 800 L300 690 Z" fill="#151a28" />
      <ellipse cx={240} cy={690} rx={60} ry={20} fill="#0c0f18" />
      <ellipse cx={240} cy={693} rx={48} ry={14} fill="#080504" />
      <path d="M300 690 L300 800 Q270 818 240 820" stroke="#bfe3ff" strokeWidth={4} fill="none" opacity={0.55} />
      <path d="M180 712 Q148 716 150 748 Q152 778 182 780" stroke="#151a28" strokeWidth={14} fill="none" />
      </g>
      {/* closed notebook, right */}
      <g transform="translate(940 800) rotate(12)">
        <rect x={-130} y={-110} width={270} height={210} rx={10} fill="url(#sdSh)" transform="translate(30 -24)" />
        <rect x={-150} y={-110} width={290} height={210} rx={10} fill="#1a1f2e" />
        <path d="M-150 100 L140 100 L140 86" stroke="#9fb4d0" strokeWidth={4} fill="none" opacity={0.45} />
        <path d="M-150 -100 L-150 100" stroke="#9fb4d0" strokeWidth={4} opacity={0.4} />
        <rect x={84} y={-110} width={10} height={210} fill="#10131d" />
      </g>
      {/* charging cable from the phone's bottom to the back of the desk */}
      <path d={`M${px + 52} ${py + 300} C${px + 120} ${py + 420} ${px + 380} ${py + 360} ${px + 430} ${py + 120} C${px + 470} ${py - 80} ${px + 560} ${py - 300} ${px + 660} ${DESK.y}`} stroke="#07080d" strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M${px + 56} ${py + 306} C${px + 120} ${py + 410} ${px + 300} ${py + 400} ${px + 400} ${py + 260}`} stroke="#6d86ad" strokeWidth={3} fill="none" opacity={0.35} />
      {/* falling off toward the front edge (caption zone stays dark) */}
      <rect x={-140} y={1380} width={1370} height={800} fill="url(#sdFront)" />
    </FR>
  );
};


/* ---------------- day: under a meeting table (out of focus, the hands are live) ---------------- */
const meeting = () => (
  <FR>
    <defs>
      <linearGradient id="smFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9e4d6" /><stop offset="0.5" stopColor="#bdb6a8" /><stop offset="1" stopColor="#6f6a62" /></linearGradient>
      <linearGradient id="smTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c1814" /><stop offset="1" stopColor="#2e2721" /></linearGradient>
      <radialGradient id="smWin" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffdf2" stopOpacity={0.9} /><stop offset="1" stopColor="#fffdf2" stopOpacity={0} /></radialGradient>
    </defs>
    {/* bright room beyond: far wall with window light, carpet */}
    <rect x={-140} y={-230} width={1370} height={2400} fill="url(#smFloor)" />
    <rect x={-140} y={330} width={1370} height={260} fill="#d9d3c4" />
    <ellipse cx={560} cy={460} rx={720} ry={260} fill="url(#smWin)" />
    {/* far side: chair pedestals and two pairs of trousered legs (seated people) */}
    {[[130, 0], [860, 1]].map(([x, k]) => (
      <g key={x} fill={k ? '#3b3f47' : '#363a42'}>
        <path d={`M${x - 110} 420 L${x - 8} 420 L${x - 22} 900 L${x - 110} 900 Z`} />
        <path d={`M${x + 16} 420 L${x + 118} 420 L${x + 120} 900 L${x + 30} 900 Z`} />
        <path d={`M${x - 120} 900 Q${x - 60} 880 ${x - 26} 910 L${x - 130} 920 Z M${x + 26} 905 Q${x + 80} 880 ${x + 130} 905 L${x + 124} 920 Z`} fill="#1f2228" />
      </g>
    ))}
    <rect x={480} y={480} width={34} height={420} fill="#4a4e55" />
    <path d="M400 905 L594 905 L560 925 L434 925 Z" fill="#33363c" />
    {/* table underside (closest, top of frame) with a cross rail and its lit front edge */}
    <path d="M-140 -230 L1230 -230 L1230 300 Q540 360 -140 300 Z" fill="url(#smTop)" />
    <path d="M-140 300 Q540 360 1230 300" stroke="#8a7a66" strokeWidth={10} fill="none" opacity={0.55} />
    <rect x={-140} y={150} width={1370} height={46} fill="#151210" />
    {/* near trouser knee, right foreground (dark, cool) */}
    <path d="M1000 1240 C1060 1180 1240 1170 1240 1170 L1240 2150 L920 2150 Q930 1500 1000 1240 Z" fill="#2a2e36" />
    <path d="M-140 1300 C-40 1260 60 1270 120 1330 Q150 1700 120 2150 L-140 2150 Z" fill="#262a31" />
  </FR>
);

export const SCREEN: Record<string, BandSpec> = {
  'screen/train-out': { blur: 10, w: OUT_W, h: H, node: trainOut },
  'screen/train-in': { blur: 12, node: trainIn },
  'screen/room': { blur: 0, node: () => <g>{roomBg()}{roomDesk()}</g> },
  'screen/meeting': { blur: 7, node: meeting },
};
