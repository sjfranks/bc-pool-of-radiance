// Generated from src/mapnotes.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';

export const MAX_NOTES = 128;
export const NOTE_LEN = 30;
export const SIG = "NOTE";
export const VERSION = 1;

export const $at = { rec: 250937 };

export function Clear() {
  rt.fill(250937, 4487, 0);
  wS(250937, 4, SIG);
  U8[250942] = 1;
}

export function Note(script: number, map: number, x: number, y: number) {
  let i: number = 0, $r0: string = "";
  $r0 = "";
  if (!Types.OnMap(x, y)) {
    return $r0;
  }
  i = Find(script, map, x, y) & 255;
  if (i !== 0) {
    $r0 = rS(i * 35 + 250913);
  }
  return $r0;
}

export function SetNote(script: number, map: number, x: number, y: number, text: string) {
  let i: number = 0, $r0: boolean = false;
  $r0 = Types.OnMap(x, y);
  if (!Types.OnMap(x, y)) {
    return $r0;
  }
  if (text === "") {
    ClearNote(script, map, x, y);
    return $r0;
  }
  i = Find(script, map, x, y) & 255;
  if (i === 0) {
    if (U8[250943] >= 128) {
      $r0 = false;
      return $r0;
    }
    U8[250943] = U8[250943] + 1;
    i = U8[250943];
    U8[i * 35 + 250909] = script;
    U8[i * 35 + 250910] = map;
    U8[i * 35 + 250911] = x;
    U8[i * 35 + 250912] = y;
  }
  wS(i * 35 + 250913, 30, text);
  return $r0;
}

export function ClearNote(script: number, map: number, x: number, y: number) {
  let i: number = 0;
  if (!Types.OnMap(x, y)) {
    return;
  }
  i = Find(script, map, x, y) & 255;
  if (i !== 0) {
    mv(i * 35 + 250909, U8[250943] * 35 + 250909, 35);
    U8[250943] = U8[250943] - 1;
  }
}

export function WriteSlot(s: number, name_: string) {
  let $r0: boolean = false;
  $r0 = FileUtil.WriteToSet(s, name_, 250937, 4487);
  return $r0;
}

export function ReadSlot(fn: string) {
  let i: number = 0, kept: number = 0;
  if (((!FileUtil.ReadRecord(fn, 250937, 4487) || (rS(250937) !== SIG)) || (U8[250942] !== 1)) || (U8[250943] > 128)) {
    Clear();
  } else {
    kept = 0;
    for (let $i1 = 1, $e1 = U8[250943]; $i1 <= $e1; $i1++) {
      i = $i1;
      if (Types.OnMap(U8[i * 35 + 250911], U8[i * 35 + 250912]) && (U8[i * 35 + 250913] <= 30)) {
        kept = (kept + 1) & 255;
        mv(kept * 35 + 250909, i * 35 + 250909, 35);
      }
    }
    U8[250943] = kept;
  }
}

export function Find(s: number, m: number, nx: number, ny: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1, $e1 = U8[250943]; $i1 <= $e1; $i1++) {
    i = $i1;
    {
      const $w2 = i * 35 + 250909;
      if ((((U8[$w2] === s) && (U8[$w2 + 1] === m)) && (U8[$w2 + 2] === nx)) && (U8[$w2 + 3] === ny)) {
        $r0 = i;
        return $r0;
      }
    }
  }
  return $r0;
}

export function $init() {
  Clear();
}
