// Generated from src/diskrec.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_EQUIP from './c_equip';
import * as StrUtil from './strutil';
import * as C_ITEM from './c_item';
import * as C_SPELL from './c_spell';

export const CHAR_DISK_BYTES = 285;
export const ITEM_DISK_BYTES = 63;
export const EFFECT_DISK_BYTES = 9;
export const CHAR_POINTERS = 17;
export const ITEM_POINTERS = 1;
export const EFFECT_POINTERS = 1;
export const DRAINED_FILLER = 255;

export const $at = { charMem: 248862, itemMem: 248864, charPtrs: 248866, itemPtrs: 248900, effectPtrs: 248934 };

export function CharToDisk(c: number, disk: number) {
  Pack(c, r16(248862), disk, 248866, 17);
}

export function ItemToDisk(it: number, disk: number) {
  Pack(it, r16(248864), disk, 248900, 1);
}

export function EffectToDisk(ef: number, disk: number) {
  Pack(ef, 9, disk, 248934, 1);
}

export function CharFromDisk(disk: number, c: number) {
  let ok: boolean = false;
  Unpack(disk, c, r16(248862), 248866, 17);
  rt.fill(c + 285, 93, 0);
  ok = StrUtil.FitLength(c, 15);
  if (U8[c + 116] === 255) {
    U8[c + 116] = 0;
    U8[c + 117] = 0;
  }
}

export function ItemFromDisk(disk: number, it: number) {
  let ok: boolean = false;
  Unpack(disk, it, r16(248864), 248900, 1);
  U8[it + 63] = 0;
  ok = StrUtil.FitLength(it, 40);
  if ((U8[it + 61] === 81) && (HasNamePart(it, 111) || HasNamePart(it, 181))) {
    U8[it + 61] = 150;
  } else if ((U8[it + 61] === 90) && HasNamePart(it, 114)) {
    U8[it + 61] = 151;
  }
}

export function EffectFromDisk(disk: number, ef: number) {
  Unpack(disk, ef, 9, 248934, 1);
}

export function CharDiskOfs(memOfs: number) {
  let $r0: number = 0;
  $r0 = DiskOfs(memOfs, 248866, 17) & 65535;
  return $r0;
}

export function ItemDiskOfs(memOfs: number) {
  let $r0: number = 0;
  $r0 = DiskOfs(memOfs, 248900, 1) & 65535;
  return $r0;
}

export function EffectDiskOfs(memOfs: number) {
  let $r0: number = 0;
  $r0 = DiskOfs(memOfs, 248934, 1) & 65535;
  return $r0;
}

export function CharDiskSize() {
  let $r0: number = 0;
  $r0 = r16(248862) - 0;
  return $r0;
}

export function ItemDiskSize() {
  let $r0: number = 0;
  $r0 = r16(248864) - 0;
  return $r0;
}

export function EffectDiskSize() {
  let $r0: number = 0;
  $r0 = 9;
  return $r0;
}

export function Pack(mem: number, memBytes: number, disk: number, ptrs: number, n: number) {
  let src: number = 0, dst: number = 0, from: number = 0, put: number = 0, i: number = 0;
  src = mem;
  dst = disk;
  from = 0;
  put = 0;
  for (let $i1 = 0, $e1 = n - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    mv(dst + put, src + from, r16(ptrs + i * 2) - from);
    put = (put + (r16(ptrs + i * 2) - from)) & 65535;
    rt.fill(dst + put, 4, 0);
    put = (put + 4) & 65535;
    from = (r16(ptrs + i * 2) + 4) & 65535;
  }
  mv(dst + put, src + from, memBytes - from);
}

export function Unpack(disk: number, mem: number, memBytes: number, ptrs: number, n: number) {
  let src: number = 0, dst: number = 0, from: number = 0, at: number = 0, i: number = 0;
  src = disk;
  dst = mem;
  from = 0;
  at = 0;
  for (let $i1 = 0, $e1 = n - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    mv(dst + from, src + at, r16(ptrs + i * 2) - from);
    at = (at + ((r16(ptrs + i * 2) - from) + 4)) & 65535;
    rt.fill(dst + r16(ptrs + i * 2), 4, 0);
    from = (r16(ptrs + i * 2) + 4) & 65535;
  }
  mv(dst + from, src + at, memBytes - from);
}

export function DiskOfs(memOfs: number, ptrs: number, n: number) {
  let i: number = 0, d: number = 0, $r0: number = 0;
  d = memOfs;
  for (let $i1 = 0, $e1 = n - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r16(ptrs + i * 2) < memOfs) {
      d = (d - 0) & 65535;
    }
  }
  $r0 = d;
  return $r0;
}

export function FindPointers() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 451);
  let i: number = 0;
  w16(248862, (($f0 + 285) >>> 0) - ($f0 >>> 0));
  w16(248866, (($f0 + 127) >>> 0) - ($f0 >>> 0));
  w16(248868, (($f0 + 200) >>> 0) - ($f0 >>> 0));
  for (let $i1 = 0; $i1 <= 12; $i1++) {
    i = $i1;
    w16(((2 + i) - 0) * 2 + 248866, (($f0 + i * 4 + 204) >>> 0) - ($f0 >>> 0));
  }
  w16(248896, (($f0 + 260) >>> 0) - ($f0 >>> 0));
  w16(248898, (($f0 + 264) >>> 0) - ($f0 >>> 0));
  w16(248864, (($f0 + 441) >>> 0) - (($f0 + 378) >>> 0));
  w16(248900, (($f0 + 420) >>> 0) - (($f0 + 378) >>> 0));
  w16(248934, (($f0 + 447) >>> 0) - (($f0 + 442) >>> 0));
  S.sp = $sp;
}

export function HasNamePart(it: number, part: number) {
  let $r0: boolean = false;
  $r0 = ((U8[it + 47] === part) || (U8[it + 48] === part)) || (U8[it + 49] === part);
  return $r0;
}

export function $init() {
  FindPointers();
}
