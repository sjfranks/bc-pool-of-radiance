// Generated from src/dataarc.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_DATA from './c_data';
import * as FileUtil from './fileutil';


export const $at = { families: 232670 };

export function SourceName(family: number, disk: number) {
  let $r0: string = "";
  if ((((family >= 1) && (family <= 14)) && (disk >= 1)) && (disk <= 8)) {
    $r0 = rS(family * 21 + 232649) + String.fromCharCode((48 + disk) & 255) + rS(family * 21 + 232657);
  } else {
    $r0 = "";
  }
  return $r0;
}

export function SourceFile(family: number, disk: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let $r0: string = "";
  wS($f0, 20, SourceName(family, disk));
  if (rS($f0) !== "") {
    wS($f0, 20, rS($f0) + ".DAX");
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function MergedName(family: number) {
  let $r0: string = "";
  if ((family >= 1) && (family <= 14)) {
    $r0 = rS(family * 21 + 232661);
  } else {
    $r0 = "";
  }
  return $r0;
}

export function MatchFamily(fileName: string, disk: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let i: number = 0, f: number = 0, digit: number = 0, $r0: number = 0;
  $r0 = 0;
  wS($f0, 20, fileName);
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + i] = rt.UpCase(U8[$f0 + i]);
  }
  for (let $i2 = 1; $i2 <= 14; $i2++) {
    f = $i2;
    {
      const $w3 = f * 21 + 232649;
      digit = (U8[$w3] + 1) & 255;
      if (U8[$f0] === (digit + U8[$w3 + 8])) {
        if ((((rt.Copy(rS($f0), 1, digit - 1) === rS($w3)) && (U8[$f0 + digit] >= 49)) && (U8[$f0 + digit] <= 56)) && (rt.Copy(rS($f0), digit + 1, U8[$w3 + 8]) === rS($w3 + 8))) {
          U8[disk] = U8[$f0 + digit] - 48;
          $r0 = f;
        }
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function ArchiveIntact(path: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 19);
  let n: number = 0, size: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = false;
  if (FileUtil.OpenReadOnly($f0, path)) {
    size = rt.FileSize($f0) | 0;
    n = rt.BlockRead($f0, $f0 + 8, 2, true) & 65535;
    if (((((rt.IOResult() === 0) && (n === 2)) && (r16($f0 + 8) > 0)) && ((r16($f0 + 8) % 9) === 0)) && ((2 + r16($f0 + 8)) <= size)) {
      rt.Seek($f0, (2 + r16($f0 + 8)) - 9);
      n = rt.BlockRead($f0, $f0 + 10, 9, true) & 65535;
      ok = ((((rt.IOResult() === 0) && (n === 9)) && (U8[$f0 + 10] === 255)) && (ri32($f0 + 11) >= 0)) && ((((2 + r16($f0 + 8)) + ri32($f0 + 11)) + r16($f0 + 17)) === size);
    }
    rt.Close($f0);
    n = rt.IOResult() & 65535;
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function HasBlock(path: string, id: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 19);
  let n: number = 0, i: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  if (FileUtil.OpenReadOnly($f0, path)) {
    n = rt.BlockRead($f0, $f0 + 8, 2, true) & 65535;
    if ((rt.IOResult() === 0) && (n === 2)) {
      i = 0;
      while ((i < Math.trunc(r16($f0 + 8) / 9)) && !found) {
        n = rt.BlockRead($f0, $f0 + 10, 9, true) & 65535;
        if ((rt.IOResult() !== 0) || (n !== 9)) {
          i = r16($f0 + 8);
        } else {
          found = U8[$f0 + 10] === id;
          i = (i + 1) & 65535;
        }
      }
    }
    rt.Close($f0);
    n = rt.IOResult() & 65535;
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export function FileLength(path: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let size: number = 0, $r0: number = 0;
  size = -1;
  if (FileUtil.OpenReadOnly($f0, path)) {
    size = rt.FileSize($f0) | 0;
    if (rt.IOResult() !== 0) {
      size = -1;
    }
    rt.Close($f0);
    if (rt.IOResult() !== 0) {
      size = -1;
    }
  }
  $r0 = size;
  S.sp = $sp;
  return $r0;
}

export function BlockRawSize(path: string, id: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 19);
  let n: number = 0, i: number = 0, size: number = 0, raw: number = 0, ok: boolean = false, $r0: number = 0;
  raw = -1;
  if (FileUtil.OpenReadOnly($f0, path)) {
    size = rt.FileSize($f0) | 0;
    n = rt.BlockRead($f0, $f0 + 8, 2, true) & 65535;
    ok = (((rt.IOResult() === 0) && (n === 2)) && ((r16($f0 + 8) % 9) === 0)) && ((2 + r16($f0 + 8)) <= size);
    i = 0;
    while (ok && (i < Math.trunc(r16($f0 + 8) / 9))) {
      n = rt.BlockRead($f0, $f0 + 10, 9, true) & 65535;
      ok = ((((rt.IOResult() === 0) && (n === 9)) && (ri32($f0 + 11) >= 0)) && (r16($f0 + 17) <= 36000)) && ((((2 + r16($f0 + 8)) + ri32($f0 + 11)) + r16($f0 + 17)) <= size);
      if ((ok && (U8[$f0 + 10] === id)) && (raw < 0)) {
        raw = r16($f0 + 15);
      }
      i = (i + 1) & 65535;
    }
    if (!ok) {
      raw = -1;
    }
    rt.Close($f0);
    n = rt.IOResult() & 65535;
  }
  $r0 = raw;
  S.sp = $sp;
  return $r0;
}
