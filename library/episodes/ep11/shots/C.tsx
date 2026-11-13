import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useShot, BandImg, Live, Cam, handheld, ramp, EIO } from '../comp/Camera';
import { wordAt } from '../data/ep';
import { BOWL, DOOR_Y } from '../sets/close';
import { Bowl, Crab, SmallHand, Drop, Foot } from '../art/close_art';

const BG: React.CSSProperties = { backgroundColor: '#07080c' };
const FX = 108, FY = 192; // world -> frame offset
const bowlO = { ox: BOWL.cx - FX, oy: BOWL.cy - FY };

/** shot 5 — closed money tin with padlock, coins beside it. Locked camera, micro drift. */
export const S05: React.FC = () => {
  const { p, t, sec } = useShot();
  const h = handheld(t, 0.25);
  const cam: Cam = { zoom: 1.08 + 0.04 * p, dx: 0, dy: 0, tx: h.hx, ty: h.hy, ox: 532, oy: 1000 };
  const gl = ramp(t / sec, 0, 1);
  const vanish = ramp(t, wordAt(5, /vanish/i, 0.8), wordAt(5, /vanish/i, 0.8) + 0.8);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="close/table" cam={cam} />
      <Live cam={cam}>
        <defs>
          <radialGradient id="glint5"><stop offset="0" stopColor="#fff6d8" stopOpacity={0.9} /><stop offset="1" stopColor="#fff6d8" stopOpacity={0} /></radialGradient>
        </defs>
        {/* glint sliding along the padlock shackle */}
        <circle cx={600 + 80 * gl} cy={1040 - 20 * Math.sin(gl * Math.PI)} r={34} fill="url(#glint5)" />
        {/* the last coin fades away — "vanishing" */}
        <g opacity={1 - vanish}>
          <ellipse cx={1050} cy={1470} rx={42} ry={16} fill="#d9b25a" />
          <ellipse cx={1050} cy={1470} rx={30} ry={11} fill="none" stroke="#a8843c" strokeWidth={3} />
        </g>
        <ellipse cx={1050} cy={1478} rx={42} ry={16} fill="#1e140e" opacity={vanish} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 6 — clay bowl by the door, crab inside, moonlight under the door, slow push. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.2 + 0.25 * e, dx: 0, dy: -60 * e, ...bowlO };
  const fg: Cam = { ...cam, zoom: 1.0 + 0.4 * e };
  const crabIn = ramp(t, wordAt(6, /crab/i, 0.4), wordAt(6, /crab/i, 0.4) + 0.6);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="close/floor" cam={cam} />
      <Live cam={cam}>
        <Bowl cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.rx} ry={BOWL.ry} t={t} amp={0.25 * (1 - crabIn) + 0.1} rings={[{ x: BOWL.cx + 20, y: BOWL.cy + 6, t: crabIn }]}>
          <Crab x={BOWL.cx + 20} y={BOWL.cy + 8} s={1.05} a={-12 + 4 * Math.sin(t * 0.8)} ph={t * 1.2} />
        </Bowl>
      </Live>
      <BandImg id="close/fg" cam={fg} k={1.2} />
    </AbsoluteFill>
  );
};

/** shot 8 — ripples, crab scuttling, small grey hand reaches in on "splashing". */
export const S08: React.FC = () => {
  const { t } = useShot();
  const cam: Cam = { zoom: 1.85, dx: 0, dy: 40, ...bowlO };
  const sp = wordAt(8, /splash/i, 0.85);
  const reach = ramp(t, sp - 1.0, sp + 0.1);
  const splash = t - sp;
  const scared = ramp(t, sp - 0.2, sp + 0.6);
  const crabX = BOWL.cx + 30 - 90 * scared + 6 * Math.sin(t * 2);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="close/floor" cam={cam} />
      <Live cam={cam}>
        <Bowl cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.rx} ry={BOWL.ry} t={t} amp={0.35 + 0.65 * ramp(t, sp - 0.3, sp + 0.2)} rings={[{ x: BOWL.cx + 120, y: BOWL.cy - 10, t: splash / 1.2 }, { x: BOWL.cx + 100, y: BOWL.cy + 10, t: (splash - 0.35) / 1.2 }]}>
          <Crab x={crabX} y={BOWL.cy + 10 - 10 * scared} s={1.0} a={-20 - 30 * scared} ph={t * (2 + 8 * scared)} claw={scared} />
        </Bowl>
        <SmallHand ex={1080} ey={820} fx={BOWL.cx + 210 - 90 * reach} fy={BOWL.cy - 230 + 220 * reach} wet={ramp(t, sp, sp + 0.3)} />
        {[0, 1, 2, 3, 4].map((i) => {
          const d = splash - i * 0.05;
          if (d <= 0 || d > 0.9) return null;
          const vx = (i - 2) * 70, vy = -260 - i * 30;
          return <Drop key={i} x={BOWL.cx + 120 + vx * d} y={BOWL.cy - 10 + vy * d + 600 * d * d} r={7} o={1 - d / 0.9} />;
        })}
      </Live>
    </AbsoluteFill>
  );
};

/** shot 9 — the small grey hand pokes the crab, droplets; eerie-playful. Very slow push. */
export const S09: React.FC = () => {
  const { p, t } = useShot();
  const cam: Cam = { zoom: 2.0 + 0.18 * EIO(p), dx: 0, dy: 50, ...bowlO };
  const pokeP = (x: number) => Math.max(0, Math.sin(x)) ** 3;
  const pk = pokeP(t * 3.2);
  const crabX = BOWL.cx - 40 - 26 * pk;
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="close/floor" cam={cam} />
      <Live cam={cam}>
        <Bowl cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.rx} ry={BOWL.ry} t={t} amp={0.4 + 0.3 * pk}
          rings={[0, 1, 2, 3, 4, 5].map((k) => ({ x: BOWL.cx + 30, y: BOWL.cy - 4, t: ((t * 3.2 - Math.PI / 2 - k * 2 * Math.PI) / (2 * Math.PI)) * 1.6 }))}>
          <Crab x={crabX} y={BOWL.cy + 6} s={1.0} a={-35 + 15 * pk} ph={t * 3} claw={pk} />
        </Bowl>
        <SmallHand ex={1060} ey={880} fx={BOWL.cx + 50 - 22 * pk} fy={BOWL.cy - 30 + 26 * pk} poke={pk} wet={1} />
        {[0, 1, 2].map((i) => {
          const d = ((t * 3.2) / (2 * Math.PI) + i * 0.33) % 1;
          return <Drop key={i} x={BOWL.cx + 60 + (i - 1) * 60 * d} y={BOWL.cy - 40 - 140 * d + 260 * d * d} r={6} o={0.9 * (1 - d)} />;
        })}
        {/* drips from the hand */}
        <Drop x={BOWL.cx + 170} y={BOWL.cy - 110 + ((t * 120) % 90)} r={5} o={0.7} />
      </Live>
    </AbsoluteFill>
  );
};

/** shot 11 — morning, low angle: tiny wet footprints circle the bowl and lead under the door. */
export const S11: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const cam: Cam = { zoom: 1.35 - 0.15 * e, dx: 0, dy: 0, tx: -40 * e, ty: -170 + 150 * e, ox: 600, oy: 900 };
  // circle prints
  const prints: { x: number; y: number; a: number; side: number; s: number }[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2 + 0.3;
    const side = i % 2 ? 1 : -1;
    const r = 1 + (side * 0.08);
    prints.push({ x: BOWL.cx + Math.cos(th) * (BOWL.rx + 110) * r, y: BOWL.cy + 40 + Math.sin(th) * (BOWL.ry + 90) * r, a: (th * 180) / Math.PI + 180, side, s: 1.7 });
  }
  // trail to the door gap
  for (let i = 0; i < 7; i++) {
    const k = i / 6;
    const side = i % 2 ? 1 : -1;
    const x = BOWL.cx + 330 - 120 * k + side * 22;
    const y = BOWL.cy - 60 - (BOWL.cy - 60 - DOOR_Y - 30) * k;
    prints.push({ x, y, a: 0, side, s: 1.6 - 0.7 * k });
  }
  const reveal = ramp(t, 0, 0.1) ;
  const doorBeat = ramp(t, wordAt(11, /door/i, 0.85) - 0.6, wordAt(11, /door/i, 0.85) + 0.4);
  return (
    <AbsoluteFill style={BG}>
      <BandImg id="close/dawn" cam={cam} />
      <Live cam={cam}>
        {prints.map((f, i) => <Foot key={i} {...f} o={reveal * (i >= n ? 0.7 + 0.3 * doorBeat : 1)} />)}
        <Bowl cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.rx} ry={BOWL.ry} t={t} amp={0.05} moon={0.4}>
          <Crab x={BOWL.cx - 30} y={BOWL.cy + 8} s={1.0} a={20} ph={0} />
        </Bowl>
      </Live>
    </AbsoluteFill>
  );
};
