// Generated from pas/sdlsound.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as SndSeq from './sndseq';
import * as SndChip from './sndchip';

export const CHUNK = 4096;

export const $at = { buf: 143486 };

export function Pull(count: number) {
  let $r0: number = 0;
  if (count > 4096) {
    count = 4096;
  }
  SndChip.Render(143486, count);
  $r0 = 143486;
  return $r0;
}

export function Open() {
  U8[65804] = true ? 1 : 0;
}

export function Close() {
  U8[65804] = false ? 1 : 0;
}

export function $init() {
  w32(65792, 1);
}
