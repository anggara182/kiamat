import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { useShot, BandImg, Live, Cam, ramp, EIO, EOUT, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { Person, PersonSpec } from '../art/road_profile';
import { SWITCHBACK } from '../sets/road';

const { fontFamily: TITLE_FONT } = loadCinzel('normal', { weights: ['600', '700'], subsets: ['latin'] });

/** Live layers are in world space; Fr shifts to FRAME coords (frame = world - (108,192)). */
const Fr: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(108 192)">{children}</g>;
const bump = (t: number, a: number, d: number) => { const u = clamp01((t - a) / d); return Math.sin(Math.PI * u); };
const cap = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `M${x1 + nx * w1} ${y1 + ny * w1} L${x2 + nx * w2} ${y2 + ny * w2} A${w2} ${w2} 0 0 0 ${x2 - nx * w2} ${y2 - ny * w2} L${x1 - nx * w1} ${y1 - ny * w1} A${w1} ${w1} 0 0 0 ${x1 + nx * w1} ${y1 + ny * w1} Z`;
};
/** arm from shoulder S via elbow E to hand H, with a mitten hand (two finger separations) */
const Arm: React.FC<{ S: [number, number]; E: [number, number]; H: [number, number]; sleeve: string; skin: string; shade: string }> = ({ S, E, H, sleeve, skin, shade }) => (
  <g>
    <path d={cap(S[0], S[1], E[0], E[1], 30, 25)} fill={sleeve} />
    <path d={cap(E[0], E[1], H[0], H[1], 25, 20)} fill={skin} />
    <ellipse cx={H[0]} cy={H[1]} rx={30} ry={24} fill={skin} />
    <path d={`M${H[0] - 16} ${H[1] - 6} q6 10 0 20 M${H[0] - 4} ${H[1] - 10} q6 12 0 24`} stroke={shade} strokeWidth={3} fill="none" opacity={0.6} />
  </g>
);

/* point along the switchback polyline, u in 0..1 */
const along = (u: number) => {
  const seg = SWITCHBACK.length - 1, x = Math.min(seg - 1e-6, Math.max(0, u * seg)), i = Math.floor(x), f = x - i;
  const [x1, y1] = SWITCHBACK[i], [x2, y2] = SWITCHBACK[i + 1];
  return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, k: 1 - u * 0.75 };
};

/* ============ shot 13 (night): trucks wind north; in the nearest cab a farmer looks at a family photo and pockets it on "seen" ============ */
const FARMER: PersonSpec = { skin: '#9c6b52', shade: '#68412f', hair: 'short', hairC: '#1c1714', shirt: '#6a5a3a', shirtD: '#4a3e26', mustache: true };
export const S13: React.FC = () => {
  const { t, t2, p } = useShot();
  const tn = wordAt(13, /^north/i, 0.14), ts = wordAt(13, /^seen/i, 0.8);
  const more = ramp(t, tn, tn + 0.3, EOUT);       // on "north" the convoy lights run on up the mountain
  const pocket = ramp(t2, ts - 0.2, ts, EIO);      // the photo goes into the shirt pocket on "seen" (ON TWOS)
  const look = 1 - ramp(t2, ts, ts + 0.4, EIO);    // eyes on the photo, then back to the road
  const bounce = 3 * Math.sin(t * 9) + 2 * Math.sin(t * 17);
  const cam: Cam = { zoom: 1.03, dx: 0, dy: 0, tx: 0, ty: 0, ox: 540, oy: 900 };
  const mtCam: Cam = { zoom: 1.03, dx: 0, dy: 0, tx: 40 - 80 * p, ty: 0, ox: 540, oy: 900 }; // slow drift alongside
  const lights = Array.from({ length: 34 }, (_, i) => ({ u: (i / 34 + t * 0.012) % 1, extra: i % 3 === 0 }));
  // farmer, facing LEFT (the road ahead), seen through the side window
  const Hd = { x: 600, y: 950 }, S = 0.95;
  const photoAt: [number, number] = [430 + 120 * pocket, 1130 + 150 * pocket];
  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      <BandImg id="road/mountains" k={0.8} cam={mtCam} />
      <Live k={0.8} cam={mtCam}>
        <Fr>
          {lights.map((l, i) => {
            const a = along(l.u);
            if (l.extra && a.y < 520 && more <= 0) return null;
            return <g key={i} opacity={l.extra && a.y < 520 ? more : 1}><circle cx={a.x - 6 * a.k} cy={a.y} r={2 + 3 * a.k} fill="#fff3d0" /><circle cx={a.x + 6 * a.k} cy={a.y} r={2 + 3 * a.k} fill="#fff3d0" /><ellipse cx={a.x} cy={a.y} rx={22 * a.k} ry={10 * a.k} fill="#fff3d0" opacity={0.18} /></g>;
          })}
        </Fr>
      </Live>
      <Live k={1} cam={cam}>
        <Fr>
          <g transform={`translate(0 ${bounce})`}>
            <defs><clipPath id="p13w"><rect x={80} y={820} width={940} height={530} /></clipPath></defs>
            <rect x={80} y={820} width={940} height={530} fill="#0c0e16" />
            <g clipPath="url(#p13w)">
            {/* dash glow from below-left */}
            <ellipse cx={300} cy={1340} rx={420} ry={200} fill="#ffcf86" opacity={0.12} />
            {/* steering wheel + far arm on it */}
            <Arm S={[640, 1190]} E={[560, 1300]} H={[392, 1196]} sleeve={FARMER.shirtD} skin={FARMER.shade} shade="#3a2418" />
            <g transform="translate(360 1240) scale(0.42 1)"><circle r={120} fill="none" stroke="#141414" strokeWidth={22} /></g>
            {/* the farmer: cap, moustache; looks down at the photo, then up */}
            <g transform={`translate(${Hd.x} ${Hd.y + 2 * Math.sin(t2 * 1.8)}) scale(${-S} ${S})`}>
              <Person id="p13f" p={FARMER} lean={14 * look} rim="#ffcf86" rimOp={0.55} />
              <g transform={`rotate(${14 * look} 0 140)`}>
                <path d="M-120 -90 C-110 -170 60 -180 96 -110 L170 -96 C176 -86 160 -78 140 -80 L80 -84 C20 -90 -60 -80 -120 -60 Z" fill="#4a5a3a" />
                <path d="M96 -110 L170 -96" stroke="#2e3a24" strokeWidth={6} />
              </g>
              {/* shirt pocket on the chest */}
              <rect x={10} y={300} width={80} height={70} rx={6} fill={FARMER.shirtD} />
              <path d="M10 300 L90 300" stroke="#2e2616" strokeWidth={4} />
            </g>
            {/* the photo (white border, a family of three), then into the pocket */}
            <g transform={`translate(${photoAt[0]} ${photoAt[1]}) rotate(${-8 + 10 * pocket}) scale(${1 - 0.35 * pocket})`} opacity={pocket > 0.95 ? 0 : 1}>
              <rect x={-60} y={-44} width={120} height={88} fill="#f2ede2" />
              <rect x={-50} y={-34} width={100} height={62} fill="#c9a77a" />
              {[[-24, 0, 14], [4, -4, 16], [28, 6, 10]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y - 10} r={r * 0.6} fill="#3a2a20" /><rect x={x - r * 0.7} y={y - 2} width={r * 1.4} height={r * 2} rx={4} fill={['#7a4a5a', '#3a5a7a', '#c4504a'][i]} /></g>)}
              <ellipse cx={0} cy={0} rx={90} ry={70} fill="#ffcf86" opacity={0.12} />
            </g>
            {/* near arm: holds the photo, then tucks it into the pocket */}
            <Arm S={[600, 1205]} E={[560 + 20 * pocket, 1320 - 40 * pocket]} H={[photoAt[0] + 40, photoAt[1] + 20]} sleeve={FARMER.shirt} skin={FARMER.skin} shade={FARMER.shade} />
            </g>
            {/* cab body around the side window */}
            <path d="M-140 760 L1230 760 L1230 2170 L-140 2170 Z M80 820 L1020 820 L1020 1350 L80 1350 Z" fillRule="evenodd" fill="#3a2a22" />
            <path d="M80 820 L1020 820" stroke="#a9b8d6" strokeWidth={3} opacity={0.4} />
            {/* window reflections */}
            <path d="M300 820 L360 820 L180 1350 L120 1350 Z" fill="#a9b8d6" opacity={0.05} />
          </g>
        </Fr>
      </Live>
    </AbsoluteFill>
  );
};

/* ============ shot 15: title card over dark mist and faint banners ============ */
const SMOKE = Array.from({ length: 9 }, (_, i) => ({ x: (i * 377) % 1600, y: 300 + (i * 211) % 1300, r: 220 + (i % 3) * 90, v: 18 + (i % 4) * 9 }));
const TMOTES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 683) % 1920, r: 1.5 + (i % 4) * 0.9, sp: 8 + (i % 5) * 5, ph: i * 1.7 }));

export const S15: React.FC = () => {
  const { t, p } = useShot();
  const words: [string, number, number][] = [['EIGHTY', 0, 0.25], ['BANNERS', 1, 0.5]];
  const sub = ramp(t, 1.1, 1.7, EOUT), rule = ramp(t, 0.95, 1.5, EOUT);
  const glow = ramp(t, 0.1, 1.4, EOUT);
  const z = 1 + 0.045 * EIO(p);
  const line = (k: number) => words.filter((w) => w[1] === k).map(([w, , a0], j) => {
    const v = ramp(t, a0, a0 + 0.6, EOUT);
    return <span key={j} style={{ display: 'inline-block', opacity: v, transform: `translateY(${(1 - v) * 26}px)`, marginRight: '0.32em' }}>{w}</span>;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <BandImg id="road/mist" k={1} cam={{ zoom: 1 + 0.03 * p, dx: 0, dy: 0 }} />
      <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p25g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d9a441" stopOpacity={0.16} /><stop offset="0.5" stopColor="#d9a441" stopOpacity={0.05} /><stop offset="1" stopColor="#d9a441" stopOpacity={0} /></radialGradient>
        </defs>
        <defs><radialGradient id="p16s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2a2a34" stopOpacity={0.8} /><stop offset="1" stopColor="#2a2228" stopOpacity={0} /></radialGradient></defs>
        {SMOKE.map((s, k) => <ellipse key={k} cx={((s.x + t * s.v) % 1600) - 260} cy={s.y + 30 * Math.sin(t * 0.4 + k)} rx={s.r * 1.6} ry={s.r} fill="url(#p16s)" opacity={0.55} />)}
        <ellipse cx={540} cy={880} rx={620} ry={330} fill="url(#p25g)" opacity={glow} />
        {TMOTES.map((m, k) => {
          const y = (((m.y - t * m.sp) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.6 + m.ph) * 14;
          return <circle key={k} cx={x} cy={y} r={m.r} fill="#f1ead8" opacity={(0.12 + 0.12 * Math.sin(t * 1.3 + m.ph)) * glow} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})`, transformOrigin: '540px 880px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -160, width: 920 }}>
          <div style={{ fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 100, letterSpacing: '0.08em', color: '#f1ead8', lineHeight: 1.18, textAlign: 'center', whiteSpace: 'nowrap', paddingLeft: '0.32em' }}>
            <div>{line(0)}</div>
            <div>{line(1)}</div>
          </div>
          <div style={{ width: 320, height: 2, marginTop: 44, transform: `scaleX(${rule})`, background: `linear-gradient(90deg, rgba(217,164,65,0), ${GREEN}, rgba(217,164,65,0))` }} />
          <div style={{ marginTop: 34, fontFamily: TITLE_FONT, fontWeight: 600, fontSize: 30, letterSpacing: '0.32em', paddingLeft: '0.32em', color: GREEN, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, whiteSpace: 'nowrap' }}>CHAPTER 9 · THE LAST DAYS</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
