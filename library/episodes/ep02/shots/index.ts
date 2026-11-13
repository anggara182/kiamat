import React from 'react';
import { S01, S03, S05, S09, S10, S11, S13, S15 } from './A';
import { S04, S12, S14 } from './B';
import { S07, S08 } from './C';
import { S06 } from './D';
import { S02, S16, S17 } from './E';

/** shot id -> scene. Every scene animates on progress within its own Sequence. */
export const SCENES: Record<number, React.FC> = {
  1: S01, 2: S02, 3: S03, 4: S04, 5: S05, 6: S06, 7: S07, 8: S08, 9: S09,
  10: S10, 11: S11, 12: S12, 13: S13, 14: S14, 15: S15, 16: S16, 17: S17,
};
