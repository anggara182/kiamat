import React from 'react';
import type { BandSpec } from '../comp/Bands';
import { TrainCar } from '../art/train_car';

/** Set "train" (packed commuter-train car seen down the aisle, day). Static bands baked ONCE to public/baked/train/<band>.png. Ids "train/<band>". */
export const TRAIN: Record<string, BandSpec> = {
  'train/car': { node: () => <TrainCar /> },
};
