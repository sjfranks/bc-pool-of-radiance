// Generated from src/jrnlseen.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as FileUtil from './fileutil';
import * as C_JRNL from './c_jrnl';
import * as GameVars from './gamevars';
import * as JrnlList from './jrnllist';
import * as JrnlQst from './jrnlqst';

export const SIG = "JRNL";
export const VERSION = 1;
export const PENDING_NONE = 0;
export const PENDING_ENTRY = 1;
export const PENDING_TALE = 2;
export const MAP_COUNT = 5;

export const $at = { MAPS: 240414, rec: 240429, pending: 240448 };

export function Clear() {
  rt.fill(240429, 19, 0);
  wS(240429, 4, SIG);
  U8[240434] = 1;
  U8[240448] = 0;
}

export function FindAll() {
  Clear();
  rt.fill(240435, 13, 255);
}

export function Mark(index: number) {
  if ((index >= 1) && (index <= 99)) {
    U8[Math.trunc(index / 8) + 240435] = U8[Math.trunc(index / 8) + 240435] | (1 << (index % 8));
  }
}

export function Found(index: number) {
  let $r0: boolean = false;
  $r0 = ((index >= 1) && (index <= 99)) && ((U8[Math.trunc(index / 8) + 240435] & (1 << (index % 8))) !== 0);
  return $r0;
}

export function Listed(index: number) {
  let $r0: boolean = false;
  $r0 = ((index >= 1) && (index <= 99)) && ((U8[141186] === 0) || Found(index));
  return $r0;
}

export function Scan(text: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 260);
  wS($f0, 255, text);
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    w16($f0 + 256, $i1);
    U8[$f0 + ri16($f0 + 256)] = rt.UpCase(U8[$f0 + ri16($f0 + 256)]);
  }
  if (U8[240448] !== 0) {
    w16($f0 + 256, 1);
    while ((ri16($f0 + 256) <= U8[$f0]) && (U8[$f0 + ri16($f0 + 256)] === 32)) {
      w16($f0 + 256, ri16($f0 + 256) + 1);
    }
    if (ReadNumber($f0, $f0 + 256, $f0 + 258)) {
      MarkNumber(ri16($f0 + 258), U8[240448] === 2);
    }
    U8[240448] = 0;
  }
  for (let $i3 = 1, $e3 = U8[$f0]; $i3 <= $e3; $i3++) {
    w16($f0 + 256, $i3);
    if (WordAt($f0, ri16($f0 + 256), "ENTRIES")) {
      TakeNumbers($f0, ri16($f0 + 256), 7, false, true);
    } else if (WordAt($f0, ri16($f0 + 256), "ENTRY")) {
      TakeNumbers($f0, ri16($f0 + 256), 5, false, false);
    } else if (WordAt($f0, ri16($f0 + 256), "TAVERN TALE")) {
      TakeNumbers($f0, ri16($f0 + 256), 11, true, false);
    }
  }
  if (rt.Pos("PROCLAMATIONS ARE POSTED", rS($f0)) > 0) {
    MarkPosted();
  }
  S.sp = $sp;
}

export function AreaMapAllowed() {
  let i: number = 0, allowed: boolean = false, $r0: boolean = false;
  allowed = r16(r32(141147) + 502) === 0;
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    i = $i1;
    if (((U8[i * 3 + 240412] === U8[146747]) && (U8[i * 3 + 240413] === U8[r32(141147) + 394])) && Found(18 + U8[i * 3 + 240411])) {
      allowed = true;
    }
  }
  $r0 = allowed;
  return $r0;
}

export function WriteSlot(s: number, name_: string) {
  let $r0: boolean = false;
  $r0 = FileUtil.WriteToSet(s, name_, 240429, 19);
  return $r0;
}

export function ReadSlot(fn: string) {
  U8[240448] = 0;
  if ((!FileUtil.ReadRecord(fn, 240429, 19) || (rS(240429) !== SIG)) || (U8[240434] !== 1)) {
    FindAll();
  }
}

export function MarkNumber(n: number, tale: boolean) {
  if (tale) {
    if ((n >= 1) && (n <= 23)) {
      Mark(76 + n);
    }
  } else if ((n >= 1) && (n <= 58)) {
    Mark(18 + n);
  }
}

export function MarkPosted() {
  let i: number = 0;
  for (let $i1 = 1; $i1 <= 18; $i1++) {
    i = $i1;
    if (JrnlQst.IsPosted(JrnlList.EntryNumber(i))) {
      Mark(i);
    }
  }
}

export function WordAt(text: number, p: number, word: string) {
  let $r0: boolean = false;
  let $t1;
  $r0 = (rt.Copy(rS(text), p, word.length) === word) && ((p === 1) || !($t1 = rt.UpCase(U8[text + (p - 1)]), ($t1 >= 65 && $t1 <= 90)));
  return $r0;
}

export function ReadNumber(text: number, p: number, n: number) {
  let $r0: boolean = false;
  w16(n, 0);
  let $t1;
  $r0 = (ri16(p) <= U8[text]) && ($t1 = U8[text + ri16(p)], ($t1 >= 48 && $t1 <= 57));
  let $t3;
  while ((ri16(p) <= U8[text]) && ($t3 = U8[text + ri16(p)], ($t3 >= 48 && $t3 <= 57))) {
    if (ri16(n) < 1000) {
      w16(n, ((ri16(n) * 10) + U8[text + ri16(p)]) - 48);
    }
    w16(p, ri16(p) + 1);
  }
  return $r0;
}

export function TakeNumbers(text: number, p: number, len: number, tale: boolean, many: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w16($f0, p);
  let more: boolean = false;
  w16($f0, ri16($f0) + len);
  if ((ri16($f0) > U8[text]) || (U8[text + ri16($f0)] !== 32)) {
    { S.sp = $sp; return; }
  }
  w16($f0, ri16($f0) + 1);
  if (ri16($f0) > U8[text]) {
    if (tale) {
      U8[240448] = 2;
    } else {
      U8[240448] = 1;
    }
    { S.sp = $sp; return; }
  }
  do {
    more = false;
    if (ReadNumber(text, $f0, $f0 + 2)) {
      MarkNumber(ri16($f0 + 2), tale);
      if (many) {
        if (rt.Copy(rS(text), ri16($f0), 5) === " AND ") {
          w16($f0, ri16($f0) + 5);
          more = true;
        } else if (rt.Copy(rS(text), ri16($f0), 2) === ", ") {
          w16($f0, ri16($f0) + 2);
          if (rt.Copy(rS(text), ri16($f0), 4) === "AND ") {
            w16($f0, ri16($f0) + 4);
          }
          more = true;
        }
      }
    }
  } while (!(!more));
  S.sp = $sp;
}

export function $init() {
  Clear();
}
