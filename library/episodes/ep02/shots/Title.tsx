import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { ramp, EOUT } from '../comp/Camera';

export const { fontFamily: cinzel } = loadCinzel('normal', { weights: ['500', '700'], subsets: ['latin'] });
export const { fontFamily: cormorant } = loadCormorant('italic', { weights: ['500'], subsets: ['latin'] });

/** Small Javanese-style crown ornament (jamang silhouette), line art. */
export const CrownMark: React.FC<{ w?: number; color?: string; opacity?: number }> = ({ w = 120, color = '#f3d9a4', opacity = 1 }) => (
  <svg width={w} height={w * 0.45} viewBox="0 0 120 54" style={{ opacity, overflow: 'visible' }}>
    <g fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
      <path d="M 14 46 L 106 46" />
      <path d="M 18 46 C 18 34, 26 30, 30 22 C 34 30, 40 34, 44 30 C 48 22, 54 16, 60 4 C 66 16, 72 22, 76 30 C 80 34, 86 30, 90 22 C 94 30, 102 34, 102 46" />
      <path d="M 60 14 C 56 22, 56 30, 60 36 C 64 30, 64 22, 60 14 Z" />
      <circle cx={60} cy={41} r={2.2} fill={color} />
      <circle cx={30} cy={40} r={1.6} fill={color} />
      <circle cx={90} cy={40} r={1.6} fill={color} />
      <path d="M 0 50 L 10 50 M 110 50 L 120 50" opacity={0.6} />
    </g>
  </svg>
);

/** Title card for shot 3: "NYI RORO KIDUL" / "Queen of the Southern Sea". Sits in the sky, clear of the caption zone. */
export const TitleCard: React.FC<{ p: number }> = ({ p }) => {
  const a = ramp(p, 0.04, 0.3, EOUT);
  const b = ramp(p, 0.22, 0.48, EOUT);
  const out = 1 - ramp(p, 0.9, 1);
  const track = 0.3 - 0.2 * a;
  return (
    <AbsoluteFill style={{ alignItems: 'center', top: 250, opacity: out }}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}><CrownMark w={130} /></div>
      <div style={{
        fontFamily: cinzel, fontWeight: 700, fontSize: 68, letterSpacing: `${track}em`, marginRight: `-${track}em`, marginTop: 18,
        color: '#fff4dc', opacity: a, whiteSpace: 'nowrap',
        textShadow: '0 0 30px rgba(255,190,120,0.55), 0 0 4px rgba(255,220,170,0.6), 0 4px 18px rgba(20,8,30,0.7)',
      }}>NYI RORO KIDUL</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, opacity: b }}>
        <div style={{ width: 90 * b, height: 1.5, background: 'linear-gradient(90deg, rgba(243,217,164,0), #f3d9a4)' }} />
        <div style={{ fontFamily: cormorant, fontStyle: 'italic', fontWeight: 500, fontSize: 48, color: '#f8e6c6', letterSpacing: '0.04em', textShadow: '0 2px 14px rgba(20,8,30,0.8)' }}>Queen of the Southern Sea</div>
        <div style={{ width: 90 * b, height: 1.5, background: 'linear-gradient(90deg, #f3d9a4, rgba(243,217,164,0))' }} />
      </div>
    </AbsoluteFill>
  );
};
