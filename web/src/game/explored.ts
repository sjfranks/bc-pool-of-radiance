// Generated from src/explored.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as GameVars from './gamevars';

export const MAX_AREAS = 64;
export const SIG = "EXPL";
export const VERSION = 1;

export const $at = { rec: 238105 };

export function Clear() {
  rt.fill(238105, 2183, 0);
  wS(238105, 4, SIG);
  U8[238110] = 1;
}

export function Mark(x: number, y: number) {
  let i: number = 0, script: number = 0, map: number = 0;
  if (!Types.OnMap(x, y)) {
    return;
  }
  script = U8[146747];
  map = U8[r32(141147) + 394];
  i = Find(script, map) & 255;
  if (i === 0) {
    if (U8[238111] >= 64) {
      return;
    }
    U8[238111] = U8[238111] + 1;
    i = U8[238111];
    U8[i * 34 + 238078] = script;
    U8[i * 34 + 238079] = map;
  }
  w16(i * 34 + y * 2 + 238080, r16(i * 34 + y * 2 + 238080) | (1 << x));
}

export function Visited(script: number, map: number, x: number, y: number) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  if (!Types.OnMap(x, y)) {
    return $r0;
  }
  i = Find(script, map) & 255;
  if (i !== 0) {
    $r0 = (r16(i * 34 + y * 2 + 238080) & (1 << x)) !== 0;
  }
  return $r0;
}

export function WriteSlot(s: number, name_: string) {
  let $r0: boolean = false;
  $r0 = FileUtil.WriteToSet(s, name_, 238105, 2183);
  return $r0;
}

export function ReadSlot(fn: string) {
  if (((!FileUtil.ReadRecord(fn, 238105, 2183) || (rS(238105) !== SIG)) || (U8[238110] !== 1)) || (U8[238111] > 64)) {
    Clear();
  }
}

export function Find(script: number, map: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1, $e1 = U8[238111]; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((U8[i * 34 + 238078] === script) && (U8[i * 34 + 238079] === map)) {
      $r0 = i;
      return $r0;
    }
  }
  return $r0;
}

export function $init() {
  Clear();
}
