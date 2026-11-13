import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { W, H, FRAME } from '../art/world';
import { BANDS } from './Bands';
export type { BandSpec } from './Bands';

/** Progress helpers relative to the enclosing Sequence (works for any shot duration). */
export const useShot = () => {
  const f = useCurrentFrame();
  const { durationInFrames: dur, fps } = useVideoConfig();
  const p = dur > 1 ? Math.min(1, Math.max(0, f / (dur - 1))) : 0;
  return { f, dur, fps, p, t: f / fps, sec: dur / fps };
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ramp = (x: number, a: number, b: number, ease: (n: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(x, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
export const EIO = Easing.inOut(Easing.cubic);
export const EOUT = Easing.out(Easing.cubic);

/**
 * Camera. zoom/dx/dy are scaled per layer by its parallax factor k; tx/ty/rot are applied
 * equally to every layer (pan/tilt/roll of the camera head). ox/oy = zoom origin in FRAME px.
 */
export type Cam = { zoom: number; dx: number; dy: number; tx?: number; ty?: number; rot?: number; ox?: number; oy?: number };
export const CAM0: Cam = { zoom: 1, dx: 0, dy: 0 };

/** Handheld wobble: smooth, deterministic sum of sines. */
export const handheld = (t: number, amp = 1) => ({
  hx: amp * (Math.sin(t * 1.7) * 5 + Math.sin(t * 4.3 + 1) * 2.2 + Math.sin(t * 9.1) * 0.8),
  hy: amp * (Math.sin(t * 1.3 + 2) * 4 + Math.sin(t * 3.7) * 2 + Math.sin(t * 8.3 + 3) * 0.7),
  hr: amp * (Math.sin(t * 1.1 + 0.5) * 0.25 + Math.sin(t * 3.1) * 0.1),
});

export const layerStyle = (k: number, cam: Cam, w = W, h = H): React.CSSProperties => {
  const left = (FRAME.w - w) / 2, top = (FRAME.h - h) / 2;
  const ox = (cam.ox ?? FRAME.w / 2) - left, oy = (cam.oy ?? FRAME.h * 0.55) - top;
  return {
    position: 'absolute', left, top, width: w, height: h,
    transformOrigin: `${ox}px ${oy}px`,
    transform: `translate(${cam.dx * k + (cam.tx ?? 0)}px, ${cam.dy * k + (cam.ty ?? 0)}px) rotate(${cam.rot ?? 0}deg) scale(${1 + (cam.zoom - 1) * k})`,
  };
};

/** A pre-baked depth band (static, blur already applied at bake time). */
export const BandImg: React.FC<{ id: string; k?: number; cam: Cam; style?: React.CSSProperties }> = ({ id, k = 1, cam, style }) => {
  const b = BANDS[id];
  return <Img src={staticFile(`baked/${id}.png`)} style={{ ...layerStyle(k, cam, b.w ?? W, b.h ?? H), ...style }} />;
};

/** Live (animated) SVG layer in the same space as a band. */
export const Live: React.FC<{ k?: number; cam: Cam; w?: number; h?: number; viewBox?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ k = 1, cam, w = W, h = H, viewBox, style, children }) => (
  <svg viewBox={viewBox ?? `0 0 ${w} ${h}`} style={{ ...layerStyle(k, cam, w, h), overflow: 'visible', ...style }}>{children}</svg>
);
