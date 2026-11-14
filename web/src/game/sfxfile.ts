// Generated from src/sfxfile.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_SOUND from './c_sound';
import * as FileUtil from './fileutil';
import * as GameVars from './gamevars';
import * as GameDirs from './gamedirs';

export const FILE_NAME = "SBSFX.DAT";
export const SIGNATURE = "SBFX";
export const VERSION = 2;
export const HEADER_BYTES = 6;
export const ENTRY_BYTES = 7;
export const MAX_SIZE = 65520;
export const MAX_ADPCM_BYTES = 32768;

export function Load(p: number, size: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let bytes: number = 0, got: number = 0, ok: boolean = false, ioRes: number = 0, $r0: boolean = false;
  $r0 = false;
  w32(p, 0);
  w16(size, 0);
  U8[count] = 0;
  if (!FileUtil.OpenReadOnly($f0, GameDirs.OwnFolder(FILE_NAME) + FILE_NAME)) {
    { S.sp = $sp; return $r0; }
  }
  bytes = rt.FileSize($f0) | 0;
  ok = ((rt.IOResult() === 0) && (bytes >= 6)) && (bytes <= 65520);
  if (!ok) {
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
    { S.sp = $sp; return $r0; }
  }
  w16(size, bytes);
  w32(p, rt.getMem(r16(size)));
  got = rt.BlockRead($f0, r32(p), r16(size), true) & 65535;
  rt.Close($f0);
  ok = (rt.IOResult() === 0) && (got === r16(size));
  if (ok) {
    ok = CheckHeader(r32(p), r16(size), count);
  }
  if (!ok) {
    rt.freeMem(r32(p));
    w32(p, 0);
    w16(size, 0);
    U8[count] = 0;
    { S.sp = $sp; return $r0; }
  }
  $r0 = true;
  S.sp = $sp;
  return $r0;
}

export function CheckHeader(p: number, size: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let $r0: boolean = false;
  $r0 = false;
  U8[count] = 0;
  if (size < 6) {
    { S.sp = $sp; return $r0; }
  }
  U8[$f0] = 4;
  mv($f0 + 1, p, 4);
  U8[count] = U8[p + 5];
  $r0 = ((rS($f0) === SIGNATURE) && (U8[p + 4] === 2)) && ((6 + (7 * U8[count])) <= size);
  S.sp = $sp;
  return $r0;
}

export function GetEntry(p: number, size: number, i: number, e: number) {
  let rec: number = 0, $r0: boolean = false;
  rec = 6 + (7 * i);
  U8[e] = U8[p + rec];
  U8[e + 1] = U8[p + (rec + 1)];
  U8[e + 2] = U8[p + (rec + 2)];
  mv(e + 3, p + (rec + 3), 2);
  mv(e + 5, p + (rec + 5), 2);
  $r0 = ((((((U8[e] >= 1) && (U8[e] <= 20)) && (U8[e + 1] <= 1)) && (r16(e + 3) > 0)) && (r16(e + 5) >= 6)) && ((r16(e + 5) + r16(e + 3)) <= size)) && ((U8[e + 1] !== 1) || (r16(e + 3) <= 32768));
  return $r0;
}

export function DecodedLength(e: number) {
  let $r0: number = 0;
  if (U8[e + 1] === 1) {
    $r0 = (2 * (r16(e + 3) - 1)) + 1;
  } else {
    $r0 = r16(e + 3);
  }
  return $r0;
}
