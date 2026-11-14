// Generated from src/cbtlog.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_OPT from './c_opt';

export const MIN_ENTRIES = 10;
export const MAX_ENTRIES = 60;
export const DEFAULT_ENTRIES = 50;
export const SLOT_SIZE = 256;
export const COLOR_MARK = 1;

export const $at = { haveStore: 234483, logging: 234484, ringSize: 234485, ringNext: 234486, ringCount: 234487, current: 234488, curColor: 234744, ring: 234745 };

export function Startup() {
  if ((U8[234483] !== 0)) {
    return;
  }
  w32(234745, rt.getMem(15360));
  U8[234483] = true ? 1 : 0;
}

export function Usable() {
  let $r0: boolean = false;
  $r0 = (U8[234483] !== 0);
  return $r0;
}

export function Clear(capacity: number, enabled: boolean) {
  if (capacity < 10) {
    capacity = 10;
  }
  if (capacity > 60) {
    capacity = 60;
  }
  U8[234485] = capacity;
  U8[234486] = 0;
  U8[234487] = 0;
  wS(234488, 255, "");
  U8[234744] = 0;
  U8[234484] = enabled && (U8[234483] !== 0) ? 1 : 0;
}

export function Active() {
  let $r0: boolean = false;
  $r0 = (U8[234484] !== 0);
  return $r0;
}

export function NewEntry() {
  if (!(U8[234484] !== 0)) {
    return;
  }
  if (rS(234488) !== "") {
    PutSlot(U8[234486], 234488);
    U8[234486] = (U8[234486] + 1) % U8[234485];
    if (U8[234487] < U8[234485]) {
      U8[234487] = U8[234487] + 1;
    }
  }
  wS(234488, 255, "");
  U8[234744] = 0;
}

export function Add(color: number, s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let room: number = 0;
  if (!(U8[234484] !== 0) || (rS($f0) === "")) {
    { S.sp = $sp; return; }
  }
  if (color !== U8[234744]) {
    if ((U8[234488] + 3) > 255) {
      { S.sp = $sp; return; }
    }
    wS(234488, 255, rS(234488) + "\x01" + String.fromCharCode(color));
    U8[234744] = color;
  }
  room = 255 - U8[234488];
  if (U8[$f0] > room) {
    U8[$f0] = room & 255;
  }
  wS(234488, 255, rS(234488) + rS($f0));
  S.sp = $sp;
}

export function NextLine() {
  if (!(U8[234484] !== 0) || (rS(234488) === "")) {
    return;
  }
  if (U8[U8[234488] + 234488] !== 32) {
    if (U8[234488] < 255) {
      wS(234488, 255, rS(234488) + " ");
    }
  }
}

export function Heading(color: number, s: string) {
  NewEntry();
  Add(color, s);
  NewEntry();
}

export function Count() {
  let $r0: number = 0;
  $r0 = (U8[234487] + ((U8[234484] !== 0) && (rS(234488) !== "") ? 1 : 0)) & 255;
  return $r0;
}

export function Entry(n: number, s: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS(s, 255, "");
  if ((n < 1) || (n > Count())) {
    { S.sp = $sp; return; }
  }
  if (n > U8[234487]) {
    wS(s, 255, rS(234488));
  } else {
    if (U8[234487] < U8[234485]) {
      GetSlot(n - 1, $f0);
    } else {
      GetSlot(((U8[234486] + n) - 1) % U8[234485], $f0);
    }
    wS(s, 255, rS($f0));
  }
  S.sp = $sp;
}

export function PutSlot(n: number, s: number) {
  wS(r32(234745) + n * 256, 255, rS(s));
}

export function GetSlot(n: number, s: number) {
  wS(s, 255, rS(r32(234745) + n * 256));
}

export function $init() {
  U8[234483] = false ? 1 : 0;
  U8[234484] = false ? 1 : 0;
  U8[234485] = 50;
  U8[234486] = 0;
  U8[234487] = 0;
  wS(234488, 255, "");
  U8[234744] = 0;
}
