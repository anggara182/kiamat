import React from 'react';
import { AbsoluteFill, Sequence, Html5Audio, staticFile } from 'remotion';
import { EP, SPANS } from '../data/ep';
import { SCENES } from '../shots';
import { Vignette, Captions, QuoteOverlay } from './Overlays';

/**
 * Shot spans come from src/data/ep03.json (start/end/durationSec), never hardcoded.
 * Order: scenes -> captions -> vignette on top; grain is added once at the final ffmpeg encode. Hard cuts only (no light leak, no transitions, no glitch).
 */
export const Episode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {SPANS.map(({ shot, from, dur }) => {
      const Scene = SCENES[shot.id];
      return (
        <Sequence key={shot.id} from={from} durationInFrames={dur} name={`${String(shot.id).padStart(2, '0')} ${shot.set} - ${shot.framing}`}>
          {Scene ? <Scene /> : null}
        </Sequence>
      );
    })}
    <QuoteOverlay />
    <Captions />
    <Vignette />
    {EP.audio ? <Html5Audio src={staticFile('audio/mix.wav')} /> : null}
  </AbsoluteFill>
);
