import React from 'react';
import { AbsoluteFill } from 'remotion';
import { W, H, rng } from '../art/world';
import { BandImg, Live, useShot, ramp, Cam, EIO } from '../comp/Camera';
import { VP, DOOR, proj } from '../sets/corridor';

/* =============== Set D: hotel corridor =============== */

/** 6 — one-point perspective, slow dolly toward 308. Green light spills under the door; something passes behind it. */
export const S06: React.FC = () => {
  const { p, t } = useShot();
  const e = EIO(p);
  const vp = { ox: VP.x - (W - 1080) / 2, oy: VP.y - (H - 1920) / 2 };
  const cam: Cam = { zoom: 1 + 0.32 * e, dx: 0, dy: 0, ...vp, ty: Math.sin(t * 2.4) * 2 };
  const flick = 0.82 + 0.1 * Math.sin(t * 13) * Math.sin(t * 7.3) + 0.08 * Math.sin(t * 3.1);
  // a shadow crosses the gap under the door
  const sh = ramp(p, 0.45, 0.85, EIO);
  const shX = DOOR.l + (DOOR.r - DOOR.l) * (-0.2 + 1.4 * sh);
  const shOn = sh > 0 && sh < 1;
  const dw = DOOR.r - DOOR.l;
  const r = rng(66);
  const [fl0, fy0] = proj(-0.5, 1.55, 5.38), [fr0] = proj(0.5, 1.55, 5.38);
  const [fl1, fy1] = proj(-1.25, 1.55, 2.4), [fr1] = proj(1.25, 1.55, 2.4);
  const panel = Math.sin(t * 17) > 0.6 || (t % 1.1 < 0.12) ? 0.9 : 0.25;
  return (
    <AbsoluteFill style={{ backgroundColor: '#140c0c', overflow: 'hidden' }}>
      <BandImg id="corridor/end" k={0.55} cam={cam} />
      <Live k={0.55} cam={cam}>
        <defs>
          <linearGradient id="gap" x1="0" y1="0" x2="1" y2="0">
            <stop offset={0} stopColor="#7dffb0" stopOpacity={0.9} />
            <stop offset={Math.max(0, (shX - DOOR.l) / dw - 0.12)} stopColor="#9dffc8" stopOpacity={1} />
            <stop offset={Math.min(1, Math.max(0, (shX - DOOR.l) / dw))} stopColor="#0a2a1a" stopOpacity={shOn ? 1 : 0} />
            <stop offset={Math.min(1, (shX - DOOR.l) / dw + 0.12)} stopColor="#9dffc8" stopOpacity={1} />
            <stop offset={1} stopColor="#7dffb0" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        {/* light leaking round the frame and under the door */}
        <rect x={DOOR.l - 2} y={DOOR.t} width={2.5} height={DOOR.b - DOOR.t} fill="#7dffb0" opacity={0.35 * flick} />
        <rect x={DOOR.r} y={DOOR.t} width={2.5} height={DOOR.b - DOOR.t} fill="#7dffb0" opacity={0.25 * flick} />
        <rect x={DOOR.l} y={DOOR.b - 5} width={dw} height={5} fill="url(#gap)" opacity={flick} />
      </Live>
      <BandImg id="corridor/main" k={1} cam={cam} />
      <Live k={1} cam={cam}>
        <defs>
          <linearGradient id="spill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5dffa0" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#3dff95" stopOpacity="0.16" />
            <stop offset="1" stopColor="#3dff95" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* spill fanning across the carpet toward us */}
        <path d={`M ${fl0} ${fy0} L ${fr0} ${fy0} L ${fr1} ${fy1} L ${fl1} ${fy1} Z`} fill="url(#spill)" opacity={flick} />
        {shOn && <path d={`M ${shX - 14} ${fy0} L ${shX + 14} ${fy0} L ${VP.x + (shX - VP.x) * 2.4 + 60} ${fy1} L ${VP.x + (shX - VP.x) * 2.4 - 60} ${fy1} Z`} fill="#0a0a0a" opacity={0.55} />}
        {/* the third ceiling panel stutters */}
        {(() => {
          const pts = [proj(-0.32, -1.05, 3.68), proj(0.32, -1.05, 3.68), proj(0.32, -1.05, 4.12), proj(-0.32, -1.05, 4.12)];
          return <path d={`M ${pts.map((q) => q.join(' ')).join(' L ')} Z`} fill="#ffe9c4" opacity={panel} />;
        })()}
        {/* dust in the light */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = VP.x + (r() - 0.5) * 700 + Math.sin(t * 0.4 + i) * 20, y = VP.y - 400 + r() * 900 + ((t * (6 + r() * 8)) % 60);
          return <circle key={i} cx={x} cy={y} r={1 + r() * 1.6} fill="#ffe2b8" opacity={0.25 + 0.2 * Math.sin(t * 2 + i)} />;
        })}
      </Live>
      <BandImg id="corridor/fg" k={1.6} cam={cam} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 55% 40% at 50% 40%, rgba(0,0,0,0) 40%, rgba(5,2,4,0.5) 100%)' }} />
    </AbsoluteFill>
  );
};
