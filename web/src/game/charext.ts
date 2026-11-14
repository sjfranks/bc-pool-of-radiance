// Generated from src/charext.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as C_ITEM from './c_item';
import * as C_STATUS from './c_status';

export const EXT_ANIMATE_JOINED = 1;
export const EXT_SIG = "CEXT";
export const EXT_VERSION = 5;
export const EXT_VERSION_4 = 4;
export const EXT_VERSION_3 = 3;
export const EXT_VERSION_2 = 2;
export const EXT_VERSION_1 = 1;

export function SlipsAway(creature: number) {
  let $r0: boolean = false;
  $r0 = ((U8[creature + 286] & 1) !== 0) && (U8[creature + 268] === 0);
  return $r0;
}

export function HasExt(creature: number) {
  let p: number = 0, i: number = 0, any: boolean = false, item: number = 0, $r0: boolean = false;
  any = false;
  p = creature + 285;
  for (let $i1 = 0; $i1 <= 92; $i1++) {
    i = $i1;
    if (U8[p + i] !== 0) {
      any = true;
    }
  }
  item = r32(creature + 200);
  while (item !== 0) {
    if (U8[item + 63] !== 0) {
      any = true;
    }
    item = r32(item + 42);
  }
  $r0 = any;
  return $r0;
}

export function WriteExt(s: number, creature: number, base: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 132);
  let item: number = 0, i: number = 0, $r0: boolean = false;
  $r0 = true;
  if (HasExt(creature)) {
    rt.fill($f0, 132, 0);
    wS($f0, 4, EXT_SIG);
    U8[$f0 + 5] = 5;
    wS($f0 + 6, 15, rS(creature));
    U8[$f0 + 22] = U8[creature + 171];
    mv($f0 + 23, creature + 285, 93);
    i = 0;
    item = r32(creature + 200);
    while ((item !== 0) && (i < 16)) {
      i = (i + 1) & 255;
      U8[$f0 + i + 115] = U8[item + 63];
      item = r32(item + 42);
    }
    $r0 = FileUtil.WriteToSet(s, base + ".chx", $f0, 132);
  } else {
    FileUtil.AddToSet(s, base + ".chx", false);
  }
  S.sp = $sp;
  return $r0;
}

export function ReadExt(creature: number, fn: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 387);
  let item: number = 0, i: number = 0;
  rt.fill(creature + 285, 93, 0);
  rt.fill($f0 + 371, 16, 0);
  if (FileUtil.ReadRecord(fn + ".chx", $f0, 132)) {
    if (((rS($f0) === EXT_SIG) && (U8[$f0 + 5] === 5)) && SameChar(creature, rS($f0 + 6), U8[$f0 + 22])) {
      mv(creature + 285, $f0 + 23, 93);
      mv($f0 + 371, $f0 + 116, 16);
    }
  } else if (FileUtil.ReadRecord(fn + ".chx", $f0 + 132, 116)) {
    if (((rS($f0 + 132) === EXT_SIG) && (U8[$f0 + 137] === 4)) && SameChar(creature, rS($f0 + 138), U8[$f0 + 154])) {
      mv(creature + 285, $f0 + 155, 93);
    }
  } else if (FileUtil.ReadRecord(fn + ".chx", $f0 + 248, 74)) {
    if (((rS($f0 + 248) === EXT_SIG) && (U8[$f0 + 253] === 3)) && SameChar(creature, rS($f0 + 254), U8[$f0 + 270])) {
      U8[creature + 285] = U8[$f0 + 271];
      U8[creature + 286] = U8[$f0 + 272];
      U8[creature + 287] = U8[$f0 + 273];
      mv(creature + 288, $f0 + 274, 48);
    }
  } else if (FileUtil.ReadRecord(fn + ".chx", $f0 + 322, 25)) {
    if (((rS($f0 + 322) === EXT_SIG) && (U8[$f0 + 327] === 2)) && SameChar(creature, rS($f0 + 328), U8[$f0 + 344])) {
      U8[creature + 285] = U8[$f0 + 345];
      U8[creature + 286] = U8[$f0 + 346];
    }
  } else if (FileUtil.ReadRecord(fn + ".chx", $f0 + 347, 24)) {
    if (((rS($f0 + 347) === EXT_SIG) && (U8[$f0 + 352] === 1)) && SameChar(creature, rS($f0 + 353), U8[$f0 + 369])) {
      U8[creature + 285] = U8[$f0 + 370];
    }
  }
  {
    const $w1 = creature + 285;
    if (U8[$w1 + 2] > 8) {
      U8[$w1 + 2] = 8;
    }
    while (U8[$w1 + 2] > U8[creature + 116]) {
      DropDrain(creature, 1);
    }
  }
  i = 0;
  item = r32(creature + 200);
  while (item !== 0) {
    U8[item + 63] = 0;
    if (i < 16) {
      i = (i + 1) & 255;
      if (U8[$f0 + i + 370] <= 2) {
        U8[item + 63] = U8[$f0 + i + 370];
      }
    }
    item = r32(item + 42);
  }
  S.sp = $sp;
}

export function PushDrain(creature: number, xp: number, hp: number, cls: number) {
  {
    const $w1 = creature + 285;
    if (U8[$w1 + 2] >= 8) {
      DropDrain(creature, 1);
    }
    U8[$w1 + 2] = U8[$w1 + 2] + 1;
    w32($w1 + U8[$w1 + 2] * 6 - 3, xp);
    U8[$w1 + U8[$w1 + 2] * 6 + 1] = hp;
    U8[$w1 + U8[$w1 + 2] * 6 + 2] = cls;
  }
}

export function PopDrain(creature: number, d: number) {
  let $r0: boolean = false;
  {
    const $w1 = creature + 285;
    $r0 = U8[$w1 + 2] > 0;
    if (U8[$w1 + 2] > 0) {
      mv(d, $w1 + U8[$w1 + 2] * 6 - 3, 6);
      U8[$w1 + 2] = U8[$w1 + 2] - 1;
    }
  }
  return $r0;
}

export function TrainDrain(creature: number, cls: number, d: number) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  {
    const $w1 = creature + 285;
    i = U8[$w1 + 2];
    while ((i > 0) && (I8[$w1 + i * 6 + 2] !== cls)) {
      i = (i - 1) & 255;
    }
    if (((i === 0) && (U8[$w1 + 2] > 0)) && (U8[$w1 + 2] >= U8[creature + 116])) {
      i = U8[$w1 + 2];
    }
    if (i > 0) {
      mv(d, $w1 + i * 6 - 3, 6);
      DropDrain(creature, i);
      $r0 = true;
    }
  }
  return $r0;
}

export function LoggedDrains(creature: number, cls: number) {
  let i: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  {
    const $w1 = creature + 285;
    for (let $i2 = 1, $e2 = U8[$w1 + 2]; $i2 <= $e2; $i2++) {
      i = $i2;
      if (I8[$w1 + i * 6 + 2] === cls) {
        n = (n + 1) & 255;
      }
    }
  }
  $r0 = n;
  return $r0;
}

export function SameChar(creature: number, name_: string, randByte: number) {
  let $r0: boolean = false;
  $r0 = ((name_.length <= 15) && (name_ === rS(creature))) && (randByte === U8[creature + 171]);
  return $r0;
}

export function DropDrain(creature: number, i: number) {
  {
    const $w1 = creature + 285;
    while (i < U8[$w1 + 2]) {
      mv($w1 + i * 6 - 3, $w1 + (i + 1) * 6 - 3, 6);
      i = (i + 1) & 255;
    }
    U8[$w1 + 2] = U8[$w1 + 2] - 1;
  }
}
