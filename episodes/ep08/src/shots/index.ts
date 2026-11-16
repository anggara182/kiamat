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
  1: C, 2: C, 3: P, 4: H, 5: H, 6: P, 7: S, 8: H, 9: C, 10: C, 11: S, 12: C, 13: S, 14: S, 15: P, 16: P,
};

export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, mod]) => [Number(id), pick(mod, `S${String(id).padStart(2, '0')}`)]),
);
