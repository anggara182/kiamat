import React from 'react';
import { Composition } from 'remotion';
import { W, H, FRAME } from './art/world';
import { BANDS, BandComp, bandCompId } from './comp/Bands';
import { Episode } from './comp/Episode';
import { EP, TOTAL_FRAMES } from './data/ep';

export const Root: React.FC = () => (
  <>
    <Composition id="Episode" component={Episode} durationInFrames={TOTAL_FRAMES} fps={EP.fps} width={FRAME.w} height={FRAME.h} />
    {Object.keys(BANDS).map((id) => (
      <Composition key={id} id={bandCompId(id)} component={BandComp} defaultProps={{ band: id }} durationInFrames={1} fps={30} width={BANDS[id].w ?? W} height={BANDS[id].h ?? H} />
    ))}
  </>
);
