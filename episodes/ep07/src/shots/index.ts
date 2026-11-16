import React from 'react';
import { AbsoluteFill } from 'remotion';
import * as C from './C';
import * as H from './H';
import * as P from './P';
import * as S from './S';

const Todo: React.FC = () => React.createElement(AbsoluteFill, { style: { backgroundColor: '#1a1a1f' } });
const pick = (m: Record<string, unknown>, name: string) => ((m[name] as React.FC) ?? Todo);

/** shot id -> owner module (episode.json "owner"). */
const OWNER: Record<number, Record<string, unknown>> = {
  1: C, 2: C, 3: P, 4: S, 5: S, 6: S, 7: H, 8: C, 9: H, 10: H, 11: C, 12: S, 13: C, 14: P, 15: P, 16: P,
};

export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, mod]) => [Number(id), pick(mod, `S${String(id).padStart(2, '0')}`)]),
);
