// Generated from pas/dos.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Host from './host';
import * as $ext from '../host/x_dos';

export const ReadOnly = 1;
export const Hidden = 2;
export const SysFile = 4;
export const VolumeID = 8;
export const Directory = 16;
export const Archive = 32;
export const AnyFile = 63;
export const FCarry = 1;

export const $at = { DosError: 131603 };

export const Bind = $ext.Bind;
export const GetDate = $ext.GetDate;
export const GetTime = $ext.GetTime;
export const FindFirst = $ext.FindFirst;
export const FindNext = $ext.FindNext;
export const FindClose = $ext.FindClose;
export const GetFTime = $ext.GetFTime;
export const GetFAttr = $ext.GetFAttr;
export const SetFAttr = $ext.SetFAttr;
export const SetFTime = $ext.SetFTime;
export function UnpackTime(p: number, t: number) {
  w16(t + 10, (p & 31) * 2);
  w16(t + 8, (p >>> 5) & 63);
  w16(t + 6, (p >>> 11) & 31);
  w16(t + 4, (p >>> 16) & 31);
  w16(t + 2, (p >>> 21) & 15);
  w16(t, ((p >>> 25) & 127) + 1980);
}

export function PackTime(t: number, p: number) {
  w32(p, ((((((r16(t) - 1980) << 25) | (r16(t + 2) << 21)) | (r16(t + 4) << 16)) | (r16(t + 6) << 11)) | (r16(t + 8) << 5)) | Math.trunc(r16(t + 10) / 2));
}

export const FExpand = $ext.FExpand;
export function DiskFree(drive: number) {
  let $r0: number = 0;
  $r0 = 67108864;
  return $r0;
}

export function GetEnv(name_: string) {
  let $r0: string = "";
  $r0 = "";
  return $r0;
}

export function DosExitCode() {
  let $r0: number = 0;
  $r0 = 0;
  return $r0;
}

export function Intr(intNo: number, regs: number) {
  Host.Intr(intNo, regs);
}

export function MsDos(regs: number) {
}

export function SwapVectors() {
}

export function Exec(path: string, cmd: string) {
  w16(131603, 2);
}

export function GetIntVec(intNo: number, vec: number) {
  w32(vec, 0);
}

export function SetIntVec(intNo: number, vec: number) {
}

export function FSplit(path: string, dir: number, name_: number, ext: number) {
  let i: number = 0, dot: number = 0;
  i = path.length;
  let $t2;
  while ((i > 0) && !($t2 = rt.chAt(path, i), $t2 === 92 || $t2 === 47 || $t2 === 58)) {
    i = (i - 1) << 16 >> 16;
  }
  wS(dir, 255, rt.Copy(path, 1, i));
  wS(name_, 255, rt.Copy(path, i + 1, 255));
  dot = 0;
  for (let $i3 = 1, $e3 = U8[name_]; $i3 <= $e3; $i3++) {
    i = $i3;
    if (U8[name_ + i] === 46) {
      dot = i;
    }
  }
  if (dot > 0) {
    wS(ext, 255, rt.Copy(rS(name_), dot, 255));
    wS(name_, 255, rt.Copy(rS(name_), 1, dot - 1));
  } else {
    wS(ext, 255, "");
  }
}

export function $init() {
  Bind(131603);
}
