import React from 'react';
import { AbsoluteFill, interpolateColors } from 'remotion';
import { loadFont } from '@remotion/google-fonts/IBMPlexMono';
import { useShot, BandImg, Live, Cam, ramp, EIO, clamp01 } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { GREEN } from '../comp/Overlays';
import { CITY_PAL, Mood, Pal, Win, SkyArt, BandWindows, NearArt, PoleArt, MosqueLamp, RedLights, Star } from '../art/city_skyline';

const { fontFamily: MONO } = loadFont('normal', { weights: ['500'], subsets: ['latin'] });

/** parallax per layer: sky far, band (towers + mosque) mid, kampung rooftops near, utility pole nearest */
const K = { sky: 0.35, band: 0.8, near: 1, pole: 1.18 };

const mixPal = (a: Pal, b: Pal, x: number): Pal => {
  if (x <= 0.001) return a;
  const out: Pal = { ...a };
  for (const key of ['nearA', 'nearB', 'near', 'nearD', 'mist', 'win'] as const) out[key] = interpolateColors(Math.min(1, x), [0, 1], [a[key], b[key]]);
  out.mistO = a.mistO + (b.mistO - a.mistO) * Math.min(1, x);
  return out;
};

type StarP = { x: number; y: number; a: number; s?: number; k: number };
type SceneP = { cam: Cam; m: Mood; night?: number; on: (w: Win) => number; lamp?: number; arches?: number; red?: number; t: number; star?: StarP; pole?: boolean; children?: React.ReactNode };

/** The whole city: live sky -> baked skyline band (crossfade to night) -> band lights -> live near rooftops -> pole. */
const CityScene: React.FC<SceneP> = ({ cam, m, night = 0, on, lamp = 0, arches = 1, red = 0, t, star, pole = true, children }) => {
  const P = CITY_PAL[m];
  const NP = mixPal(P, CITY_PAL.night, night);
  const bg = interpolateColors(Math.min(1, night), [0, 1], [P.sky[0], CITY_PAL.night.sky[0]]);
  const fade = night > 0.005 && m !== 'night';
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Live k={K.sky} cam={cam}>
        <SkyArt m={m} />
        {fade && <g opacity={night}><SkyArt m="night" /></g>}
      </Live>
      {star && <Live k={star.k} cam={cam}><Star x={star.x} y={star.y} a={star.a} s={star.s} /></Live>}
      <BandImg id={`city/${m}`} k={K.band} cam={cam} />
      {fade && <BandImg id="city/night" k={K.band} cam={cam} style={{ opacity: night }} />}
      <Live k={K.band} cam={cam}>
        <BandWindows p={NP} on={on} />
        <MosqueLamp on={lamp} p={NP} arches={arches} />
        <RedLights t={t} on={red} />
      </Live>
      <Live k={K.near} cam={cam}><NearArt p={NP} on={on} /></Live>
      {pole && <Live k={K.pole} cam={cam}><PoleArt fill={NP.nearD} /></Live>}
      {children}
    </AbsoluteFill>
  );
};

/** switch-on curve: plain ramp, or a fluorescent kitchen tube (on, off, on) */
const flick = (dt: number, fl: boolean) => {
  if (dt < 0) return 0;
  if (!fl) return clamp01(dt / 0.1);
  if (dt < 0.07) return 0.9;
  if (dt < 0.14) return 0.08;
  if (dt < 0.2) return 0.75;
  if (dt < 0.27) return 0.2;
  return 1;
};

/** shot 1 — dawn: the minaret against the first glow, kitchen windows switching on (sync "lights"), minaret lamp on "prayer". Slow push-in. */
export const S01: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.06 + 0.12 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: -20, ox: 362, oy: 900 };
  const tl = wordAt(1, /^lights/i, 0.3);
  const tp = wordAt(1, /^prayer/i, 0.65);
  const on = (w: Win) => {
    if (w.L === 0) {
      if (w.o < 0.2) return 1;
      if (w.o > 0.62) return 0;
      return clamp01((t - (tl + 0.3 + ((w.o - 0.2) / 0.42) * 4.6)) / 0.12);
    }
    if (w.o < 0.06) return 1;
    if (w.o > 0.9) return 0;
    return flick(t - (tl - 0.05 + ((w.o - 0.06) / 0.84) * 3.4), w.fl);
  };
  return <CityScene cam={cam} m="dawn" on={on} t={t} lamp={ramp(t, tp - 0.1, tp + 0.5)} />;
};

/** shot 7 — dusk: the whole skyline in silhouette, sky darkening to night, windows coming on; source label on "foretold". Very slow pull-back. */
export const S07: React.FC = () => {
  const { p, t } = useShot();
  const z = 1.16 - 0.16 * ramp(p, 0, 1, EIO);
  const cam: Cam = { zoom: z, dx: 0, dy: 0, ty: 120, ox: 760, oy: 1000 };
  const night = 0.8 * ramp(p, 0.06, 1, (n) => n);
  const L = 0.06 + 0.6 * ramp(p, 0.15, 0.95, (n) => n);
  const on = (w: Win) => clamp01((L - w.o) / 0.02);
  const tf = wordAt(7, /^foretold/i, 0.7);
  const lab = ramp(t, tf, tf + 0.6);
  return (
    <CityScene cam={cam} m="dusk" night={night} on={on} t={t} lamp={ramp(p, 0.55, 0.85)} red={ramp(p, 0.45, 0.7)}>
      <div style={{ position: 'absolute', top: 226, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: lab }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 25, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: GREEN, textShadow: '0 2px 10px rgba(6,4,12,0.6)' }}>
          SAHIH MUSLIM 8 · SAHIH AL-BUKHARI 59, 7121
        </div>
        <div style={{ width: 64, height: 2, marginTop: 14, background: GREEN, opacity: 0.55 }} />
      </div>
    </CityScene>
  );
};

/** shot 8 — night: slow tilt up from the skyline into the sky, a single star. */
export const S08: React.FC = () => {
  const { p, t } = useShot();
  const tilt = ramp(p, 0.04, 0.92, EIO);
  const cam: Cam = { zoom: 1.08, dx: 0, dy: 420 + 700 * tilt, ty: -40, ox: 540, oy: 960 };
  const tg = wordAt(8, /^God/i, 0.82);
  const star = { x: 760, y: -18, k: 0.75, a: 0.3 + 0.7 * ramp(p, 0.1, 0.6), s: 1 + 0.3 * ramp(t, tg - 0.1, tg + 0.7) };
  const on = (w: Win) => (w.o < 0.7 ? 1 : 0);
  return <CityScene cam={cam} m="night" on={on} t={t} lamp={1} red={1} star={star} />;
};

/** shot 9 — night: the city locked off, windows going dark one by one (sync "lights"). */
export const S09: React.FC = () => {
  const { t, sec } = useShot();
  const cam: Cam = { zoom: 1.42, dx: 0, dy: 0, ty: -260, ox: 760, oy: 1250 };
  const tl = wordAt(9, /^lights/i, 0.55);
  const off = 0.16 * ramp(t, 0.3, tl, (n) => n) + 0.72 * ramp(t, tl, sec - 0.45, (n) => n);
  const on = (w: Win) => (w.o < 0.78 ? clamp01((w.o2 - off) / 0.006) : 0);
  return <CityScene cam={cam} m="night" on={on} t={t} lamp={0.6} arches={clamp01((0.55 - off) / 0.006)} red={1} pole={false} />;
};
