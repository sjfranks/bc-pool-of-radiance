// Generated from src/tprand.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Dos from './dos';


export const $at = { RandSeed: 234431 };

export function Random(range: number) {
  let hi: number = 0, $r0: number = 0;
  NextSeed();
  hi = (ri32(234431) >>> 16) & 65535;
  if (range === 0) {
    $r0 = 0;
  } else {
    $r0 = (hi % range) & 65535;
  }
  return $r0;
}

export function Randomize() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  Dos.GetTime($f0, $f0 + 2, $f0 + 4, $f0 + 6);
  w32(234431, (((r16($f0 + 4) << 8) | r16($f0 + 6)) << 16) | ((r16($f0) << 8) | r16($f0 + 2)));
  S.sp = $sp;
}

export function NextSeed() {
  let lo: number = 0, hi: number = 0, p0: number = 0, p1: number = 0;
  lo = ri32(234431) & 65535;
  hi = (ri32(234431) >>> 16) & 65535;
  p0 = (lo * 33797) | 0;
  p1 = ((((p0 >>> 16) & 65535) + (lo * 2056)) + (hi * 33797)) | 0;
  w32(234431, (((p1 & 65535) << 16) | (p0 & 65535)) + 1);
}
