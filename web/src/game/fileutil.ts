// Generated from src/fileutil.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Dos from './dos';
import * as SysUtils from './sysutils';
import * as NatFile from './natfile';

export const TEMP_FOLDER = "TMP\\";
export const BACKUP_FOLDER = "TMP\\BAK\\";
export const SET_FILES = 55;

export function IsDeviceName(base: string) {
  let $r0: boolean = false;
  let $t1, $t2;
  $r0 = ((((((base === "CON") || (base === "AUX")) || (base === "NUL")) || (base === "PRN")) || (base === "CLOCK$")) || (((base.length === 4) && (rt.Copy(base, 1, 3) === "COM")) && ($t1 = rt.chAt(base, 4), ($t1 >= 49 && $t1 <= 52)))) || (((base.length === 4) && (rt.Copy(base, 1, 3) === "LPT")) && ($t2 = rt.chAt(base, 4), ($t2 >= 49 && $t2 <= 51)));
  return $r0;
}

export function Exists(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let found: boolean = false, $r0: boolean = false;
  found = (name_ !== "") && OpenReadOnly($f0, name_);
  if (found) {
    rt.Close($f0);
    found = rt.IOResult() === 0;
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export function DeleteFile(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0;
  rt.Assign($f0, name_);
  rt.Erase($f0);
  ioRes = rt.IOResult() << 16 >> 16;
  S.sp = $sp;
}

export function DeleteChecked(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let $r0: boolean = false;
  $r0 = true;
  if (!Exists(name_)) {
    { S.sp = $sp; return $r0; }
  }
  rt.Assign($f0, name_);
  rt.Erase($f0);
  $r0 = rt.IOResult() === 0;
  S.sp = $sp;
  return $r0;
}

export function MakeFolder(dir: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, dir);
  let ioRes: number = 0, i: number = 0, first: number = 0, $r0: boolean = false;
  ioRes = rt.IOResult() << 16 >> 16;
  if ((U8[$f0] > 0) && IsSeparator(U8[$f0 + U8[$f0]])) {
    U8[$f0] = U8[$f0] - 1;
  }
  first = 2;
  if ((U8[$f0] >= 2) && (U8[$f0 + 2] === 58)) {
    first = 4;
  }
  if (U8[$f0] < first) {
    $r0 = true;
    { S.sp = $sp; return $r0; }
  }
  for (let $i1 = first, $e1 = U8[$f0] - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    if (IsSeparator(U8[$f0 + i])) {
      rt.MkDir(rt.Copy(rS($f0), 1, i - 1));
      ioRes = rt.IOResult() << 16 >> 16;
    }
  }
  rt.MkDir(rS($f0));
  ioRes = rt.IOResult() << 16 >> 16;
  $r0 = (ioRes === 0) || (ioRes === 5);
  S.sp = $sp;
  return $r0;
}

export function OpenReadOnly(f: number, name_: string) {
  let mode: number = 0, ioRes: number = 0, $r0: boolean = false;
  ioRes = rt.IOResult() << 16 >> 16;
  if (SysUtils.DirectoryExists(NatFile.NativeName(name_))) {
    $r0 = false;
    return $r0;
  }
  rt.Assign(f, name_);
  mode = U8[65540];
  U8[65540] = 0;
  rt.ResetF(f, 1);
  U8[65540] = mode;
  $r0 = rt.IOResult() === 0;
  return $r0;
}

export function ReadRecord(name_: string, rec: number, size: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let n: number = 0, ok: boolean = false, ioRes: number = 0, $r0: boolean = false;
  ok = false;
  if (OpenReadOnly($f0, name_)) {
    ok = (rt.FileSize($f0) === size) && (rt.IOResult() === 0);
    if (ok) {
      n = rt.BlockRead($f0, rec, size, true) & 65535;
      ok = (rt.IOResult() === 0) && (n === size);
    }
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function TempName(name_: string) {
  let $r0: string = "";
  $r0 = InFolder(name_, TEMP_FOLDER);
  return $r0;
}

export function MakeTempFolder(name_: string) {
  let $r0: boolean = false;
  $r0 = Fits(name_) && MakeOne(rt.Copy(name_, 1, FolderLength(name_)) + TEMP_FOLDER);
  return $r0;
}

export function RewriteTemp(f: number, name_: string) {
  let ioRes: number = 0, $r0: boolean = false;
  $r0 = false;
  if (!MakeTempFolder(name_)) {
    return $r0;
  }
  ioRes = rt.IOResult() << 16 >> 16;
  rt.Assign(f, TempName(name_));
  rt.RewriteF(f, 1);
  $r0 = rt.IOResult() === 0;
  return $r0;
}

export function WriteChecked(f: number, buf: number, size: number, ok: number) {
  let n: number = 0;
  if (!(U8[ok] !== 0)) {
    return;
  }
  n = rt.BlockWrite(f, buf, size, true) & 65535;
  U8[ok] = (rt.IOResult() === 0) && (n === size) ? 1 : 0;
}

export function CloseTemp(f: number, name_: string, ok: boolean) {
  let $r0: boolean = false;
  rt.Close(f);
  ok = (rt.IOResult() === 0) && ok;
  if (!ok) {
    DeleteFile(TempName(name_));
  }
  $r0 = ok;
  return $r0;
}

export function RenameChecked(from: string, name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0, $r0: boolean = false;
  ioRes = rt.IOResult() << 16 >> 16;
  rt.Assign($f0, from);
  rt.Rename($f0, name_);
  $r0 = rt.IOResult() === 0;
  S.sp = $sp;
  return $r0;
}

export function PutInPlace(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1028);
  let ok: boolean = false, $r0: boolean = false;
  ok = !IsReadOnly(name_) && SetOfOne($f0, name_);
  if (ok) {
    ok = CommitSet($f0);
  } else {
    DeleteFile(TempName(name_));
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function RecoverFile(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1028);
  let $r0: boolean = false;
  $r0 = true;
  if (SetOfOne($f0, name_)) {
    $r0 = RecoverSet($f0);
  }
  S.sp = $sp;
  return $r0;
}

export function NewSet(s: number, dir: string) {
  wS(s, 255, dir);
  U8[s + 256] = 0;
  U8[s + 1027] = false ? 1 : 0;
}

export function AddToSet(s: number, name_: string, put: boolean) {
  if (U8[s + 256] >= 55) {
    U8[s + 1027] = true ? 1 : 0;
    if (put) {
      DeleteFile(TempName(rS(s) + name_));
    }
    return;
  }
  U8[s + 256] = U8[s + 256] + 1;
  wS(s + U8[s + 256] * 13 + 244, 12, name_);
  U8[s + U8[s + 256] + 971] = put ? 1 : 0;
}

export function WriteToSet(s: number, name_: string, rec: number, size: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let $r0: boolean = false;
  U8[$f0 + 8] = RewriteTemp($f0, rS(s) + name_) ? 1 : 0;
  if ((U8[$f0 + 8] !== 0)) {
    WriteChecked($f0, rec, size, $f0 + 8);
    U8[$f0 + 8] = CloseTemp($f0, rS(s) + name_, (U8[$f0 + 8] !== 0)) ? 1 : 0;
  }
  if ((U8[$f0 + 8] !== 0)) {
    AddToSet(s, name_, true);
  }
  $r0 = (U8[$f0 + 8] !== 0);
  S.sp = $sp;
  return $r0;
}

export function DropSet(s: number) {
  let i: number = 0;
  for (let $i1 = 1, $e1 = U8[s + 256]; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((U8[s + i + 971] !== 0)) {
      DeleteFile(TempName(rS(s) + rS(s + i * 13 + 244)));
    }
  }
  U8[s + 256] = 0;
}

export function CommitSet(s: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let i: number = 0, ok: boolean = false, done: boolean = false, $r0: boolean = false;
  ok = !(U8[s + 1027] !== 0) && Settle(s, Unfinished(s), false);
  if (ok && (U8[s + 256] > 0)) {
    ok = MakeOne(rS(s) + TEMP_FOLDER) && MakeOne(rS(s) + BACKUP_FOLDER);
  }
  i = 0;
  while (ok && (i < U8[s + 256])) {
    i = (i + 1) & 255;
    wS($f0, 255, rS(s) + rS(s + i * 13 + 244));
    if (Exists(rS($f0))) {
      ok = RenameChecked(rS($f0), BackupName(rS($f0)));
    } else if ((U8[s + i + 971] !== 0)) {
      ok = MakeMark(rS($f0));
    }
  }
  i = (U8[s + 256] + 1) & 255;
  while (ok && (i > 1)) {
    i = (i - 1) & 255;
    if ((U8[s + i + 971] !== 0)) {
      ok = RenameChecked(TempName(rS(s) + rS(s + i * 13 + 244)), rS(s) + rS(s + i * 13 + 244));
    }
  }
  done = Settle(s, !ok, !ok);
  if (!ok) {
    U8[s + 256] = 0;
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function RecoverSet(s: number) {
  let $r0: boolean = false;
  $r0 = true;
  if (Unfinished(s)) {
    $r0 = Settle(s, true, true);
  }
  return $r0;
}

export function BackupName(name_: string) {
  let $r0: string = "";
  $r0 = InFolder(name_, BACKUP_FOLDER);
  return $r0;
}

export function IsSeparator(c: number) {
  let $r0: boolean = false;
  $r0 = (c === 92) || (c === 47);
  return $r0;
}

export function FolderLength(name_: string) {
  let i: number = 0, $r0: number = 0;
  i = name_.length;
  let $t2;
  while ((i > 0) && !($t2 = rt.chAt(name_, i), $t2 === 92 || $t2 === 47 || $t2 === 58)) {
    i = (i - 1) & 255;
  }
  $r0 = i;
  return $r0;
}

export function InFolder(name_: string, sub: string) {
  let i: number = 0, $r0: string = "";
  i = FolderLength(name_) & 255;
  $r0 = rt.Copy(name_, 1, i) + sub + rt.Copy(name_, i + 1, name_.length - i);
  return $r0;
}

export function Fits(name_: string) {
  let $r0: boolean = false;
  $r0 = (name_.length + 8) < 256;
  return $r0;
}

export function MakeOne(dir: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, dir);
  let ioRes: number = 0, $r0: boolean = false;
  ioRes = rt.IOResult() << 16 >> 16;
  U8[$f0] = U8[$f0] - 1;
  rt.MkDir(rS($f0));
  ioRes = rt.IOResult() << 16 >> 16;
  $r0 = (ioRes === 0) || (ioRes === 5);
  S.sp = $sp;
  return $r0;
}

export function OldTempName(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, name_);
  let $r0: string = "";
  if (U8[$f0] > 0) {
    U8[$f0 + U8[$f0]] = 36;
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function OldBackupName(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, name_);
  let $r0: string = "";
  if (U8[$f0] > 0) {
    U8[$f0 + U8[$f0]] = 37;
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function SetOfOne(s: number, name_: string) {
  let i: number = 0, fits: boolean = false, $r0: boolean = false;
  i = FolderLength(name_) & 255;
  NewSet(s, rt.Copy(name_, 1, i));
  fits = (name_.length - i) < 13;
  if (fits) {
    AddToSet(s, rt.Copy(name_, i + 1, name_.length - i), true);
  }
  $r0 = fits;
  return $r0;
}

export function IsReadOnly(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 10);
  let ioRes: number = 0, $r0: boolean = false;
  $r0 = false;
  if (!Exists(name_)) {
    { S.sp = $sp; return $r0; }
  }
  rt.Assign($f0, name_);
  Dos.GetFAttr($f0, $f0 + 8);
  ioRes = rt.IOResult() << 16 >> 16;
  $r0 = (ioRes === 0) && ((r16($f0 + 8) & 1) !== 0);
  S.sp = $sp;
  return $r0;
}

export function EraseBackup(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0, $r0: boolean = false;
  if (Exists(name_)) {
    rt.Assign($f0, name_);
    Dos.SetFAttr($f0, 0);
    ioRes = rt.IOResult() << 16 >> 16;
  }
  $r0 = DeleteChecked(name_);
  S.sp = $sp;
  return $r0;
}

export function IsMark(backup: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0, $r0: boolean = false;
  $r0 = false;
  if (OpenReadOnly($f0, backup)) {
    $r0 = (rt.FileSize($f0) === 0) && (rt.IOResult() === 0);
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
  }
  S.sp = $sp;
  return $r0;
}

export function MakeMark(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0, $r0: boolean = false;
  ioRes = rt.IOResult() << 16 >> 16;
  rt.Assign($f0, BackupName(name_));
  rt.RewriteF($f0, 1);
  ioRes = rt.IOResult() << 16 >> 16;
  if (ioRes === 0) {
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
  }
  $r0 = ioRes === 0;
  S.sp = $sp;
  return $r0;
}

export function SettleOne(name_: string, backup: string, back: boolean) {
  let $r0: boolean = false;
  if (!Exists(backup)) {
    $r0 = true;
  } else if (!back) {
    $r0 = EraseBackup(backup);
  } else if (IsMark(backup)) {
    $r0 = DeleteChecked(name_) && EraseBackup(backup);
  } else {
    $r0 = DeleteChecked(name_) && RenameChecked(backup, name_);
  }
  return $r0;
}

export function Settle(s: number, back: boolean, copies: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let i: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = true;
  for (let $i1 = 1, $e1 = U8[s + 256]; $i1 <= $e1; $i1++) {
    i = $i1;
    wS($f0, 255, rS(s) + rS(s + i * 13 + 244));
    ok = SettleOne(rS($f0), OldBackupName(rS($f0)), back) && ok;
    ok = SettleOne(rS($f0), BackupName(rS($f0)), back) && ok;
    DeleteFile(OldTempName(rS($f0)));
    if (copies) {
      DeleteFile(TempName(rS($f0)));
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function Unfinished(s: number) {
  let $r0: boolean = false;
  $r0 = (U8[s + 256] > 0) && (Exists(BackupName(rS(s) + rS(s + 257))) || Exists(OldBackupName(rS(s) + rS(s + 257))));
  return $r0;
}
