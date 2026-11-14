// Generated from src/databld.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Dos from './dos';
import * as Types from './types';
import * as C_DATA from './c_data';
import * as GameVars from './gamevars';
import * as DataArc from './dataarc';
import * as DataPat from './datapat';
import * as DaxIo from './daxio';
import * as TextRend from './textrend';
import * as BldShow from './bldshow';
import * as StrUtil from './strutil';
import * as SaveMenu from './savemenu';
import * as FileUtil from './fileutil';
import * as NatFile from './natfile';

export const MAX_BLOCKS = 512;
export const MAX_REMAPS = 16;
export const CHUNK_SIZE = 4096;
export const RUN_SIZE = 127;
export const MAX_ENCODED = 64000;
export const MAX_LOADABLE = 35718;
export const ROOM_MARGIN = 65536;
export const SOURCES_SIZE = 72;
export const VERSION_RAW = 5;
export const VERSION_PACKED = 6;
export const LOG_NAME = "DATABLD.LOG";

export const $at = { logFile: 262391, logOpen: 262399, crcTable: 262400, bufA: 262404, bufB: 262408, sources: 262412, sourceCount: 262416, blocks: 262418, blockCount: 262422, sourceList: 262424, sourceListLen: 262496, remapCount: 262498, remapDisk: 262499, remapFrom: 262515, remapTo: 262531, remapBlock: 262547, archiveName: 262579, failNote: 262600, lastError: 262681, writeNote: 262683, memNote: 262764, builtCount: 262845, keptCount: 262846, failedCount: 262847, n: 262848 };

export async function BuildDataFiles() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 14);
  let anyStale: boolean = false, fam: number = 0, oldFileMode: number = 0;
  oldFileMode = U8[65540];
  U8[65540] = 0;
  SaveMenu.MoveOldQuickSave();
  DaxIo.ResetArchiveCache();
  RemoveFile("DATABLD.$$$");
  for (let $i1 = 1; $i1 <= 14; $i1++) {
    fam = $i1;
    RemoveFile(DataArc.MergedName(fam) + ".$$$");
  }
  anyStale = false;
  for (let $i2 = 1; $i2 <= 14; $i2++) {
    fam = $i2;
    U8[$f0 + fam - 1] = !(await DaxIo.FamilyUsable(fam)) && HasFiles(fam) ? 1 : 0;
    if ((U8[$f0 + fam - 1] !== 0)) {
      anyStale = true;
    }
  }
  if (anyStale) {
    rt.Assign(262391, GamePath(LOG_NAME));
    rt.RewriteT(262391);
    U8[262399] = rt.IOResult() === 0 ? 1 : 0;
    wS(262683, 80, "");
    wS(262764, 80, "");
    wS(262600, 80, "");
    wS(262579, 20, "DATABLD");
    if (CanWrite()) {
      RemoveTemp();
    }
    (await BldShow.Open($f0, rS(262683) === ""));
    Progress("Please wait, constructing data files...");
    LogLine("Merged data archives, version " + StrUtil.NumStr(46));
    U8[262845] = 0;
    U8[262846] = 0;
    U8[262847] = 0;
    w32(262400, 0);
    if (16777216 < 29772) {
      wS(262764, 80, "not enough memory");
    } else {
      w32(262400, rt.getMem(1024));
      w32(262404, rt.getMem(4096));
      w32(262408, rt.getMem(4096));
      w32(262412, rt.getMem(7168));
      w32(262418, rt.getMem(7168));
      InitCrcTable();
      if (!DataPat.LoadTable()) {
        wS(262764, 80, "the data fixes do not add up");
      }
    }
    for (let $i3 = 1; $i3 <= 14; $i3++) {
      fam = $i3;
      if ((U8[$f0 + fam - 1] !== 0)) {
        (await BldShow.StartFamily(fam));
        (await UpdateFamily(fam));
        (await BldShow.EndFamily(fam, rS(262600) === ""));
      } else if (HasFiles(fam)) {
        LogLine(DataArc.MergedName(fam) + ".DAX up to date");
        U8[262846] = U8[262846] + 1;
      }
    }
    if (r32(262400) !== 0) {
      DataPat.FreeTable();
      rt.freeMem(r32(262418));
      rt.freeMem(r32(262412));
      rt.freeMem(r32(262408));
      rt.freeMem(r32(262404));
      rt.freeMem(r32(262400));
      w32(262400, 0);
    }
    LogLine("Done: " + StrUtil.NumStr(U8[262845]) + " built, " + StrUtil.NumStr(U8[262846]) + " up to date, " + StrUtil.NumStr(U8[262847]) + " failed.");
    if ((U8[262399] !== 0)) {
      rt.Close(262391);
    }
    w16(262848, rt.IOResult());
    U8[262399] = false ? 1 : 0;
    TextRend.ClearBottomLine();
    (await BldShow.Finish(U8[262847] > 0));
    DaxIo.ResetArchiveCache();
  }
  U8[65540] = oldFileMode;
  S.sp = $sp;
}

export function LogLine(s: string) {
  if ((U8[262399] !== 0)) {
    rt.WriteT(262391, s + "\n");
    rt.Flush(262391);
    if (rt.IOResult() !== 0) {
      U8[262399] = false ? 1 : 0;
    }
  }
}

export function Progress(s: string) {
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, 10, rt.Copy(s, 1, 40));
  LogLine(s);
}

export function Fail(why: string) {
  if (rS(262600) === "") {
    wS(262600, 80, why);
  }
}

export function FailWriting(why: string) {
  Fail(why);
  if (rS(262683) === "") {
    wS(262683, 80, why);
  }
}

export function IoOk() {
  let err: number = 0, $r0: boolean = false;
  err = rt.IOResult() << 16 >> 16;
  if (err !== 0) {
    w16(262681, err);
  }
  $r0 = err === 0;
  return $r0;
}

export function Reserve(size: number) {
  let ok: boolean = false, $r0: boolean = false;
  ok = 16777216 >= (size + 8);
  if (!ok) {
    Fail("not enough memory");
  }
  $r0 = ok;
  return $r0;
}

export function InitCrcTable() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, k: number = 0;
  for (let $i1 = 0; $i1 <= 255; $i1++) {
    i = $i1;
    w32($f0, i);
    for (let $i2 = 1; $i2 <= 8; $i2++) {
      k = $i2;
      if ((ri32($f0) & 1) !== 0) {
        w32($f0, (ri32($f0) >>> 1) ^ 3988292384);
      } else {
        w32($f0, ri32($f0) >>> 1);
      }
    }
    w16(r32(262400) + i * 2, r16($f0));
    w16(r32(262400) + i * 2 + 512, r16($f0 + 2));
  }
  S.sp = $sp;
}

export function AddCrc(crc: number, buf: number, count: number) {
  let i: number = 0, idx: number = 0, low16: number = 0, high16: number = 0, table: number = 0;
  table = r32(262400);
  low16 = r16(crc);
  high16 = r16(crc + 2);
  i = 0;
  while (i < count) {
    idx = ((low16 & 255) ^ U8[buf + i]) & 255;
    low16 = (((low16 >>> 8) | (high16 << 8)) ^ r16(table + idx * 2)) & 65535;
    high16 = (high16 >>> 8) ^ r16(table + idx * 2 + 512);
    i = (i + 1) & 65535;
  }
  w16(crc, low16);
  w16(crc + 2, high16);
}

export function ReadAt(f: number, pos: number, buf: number, count: number) {
  let got: number = 0, $r0: boolean = false;
  rt.Seek(f, pos);
  got = rt.BlockRead(f, buf, count, true) & 65535;
  $r0 = IoOk() && (got === count);
  return $r0;
}

export async function CrcOfFile(f: number, size: number, crc: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let pos: number = 0, part: number = 0, ok: boolean = false, $r0: boolean = false;
  w32($f0, -1);
  pos = 0;
  ok = true;
  while (ok && (pos < size)) {
    part = 4096;
    if ((size - pos) < part) {
      part = (size - pos) & 65535;
    }
    ok = ReadAt(f, pos, r32(262404), part);
    AddCrc($f0, r32(262404), part);
    (await BldShow.Advance(part));
    pos = (pos + part) | 0;
  }
  w32(crc, ~ri32($f0));
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function GamePath(name_: string) {
  let $r0: string = "";
  $r0 = DaxIo.FolderOf(name_) + name_;
  return $r0;
}

export function RemoveFile(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  rt.Assign($f0, GamePath(name_));
  rt.Erase($f0);
  w16(262848, rt.IOResult());
  S.sp = $sp;
}

export function TempPath() {
  let $r0: string = "";
  $r0 = FileUtil.TempName(GamePath(rS(262579) + ".DAX"));
  return $r0;
}

export function TempLabel() {
  let $r0: string = "";
  $r0 = FileUtil.TEMP_FOLDER + rS(262579) + ".DAX";
  return $r0;
}

export function RemoveTemp() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  rt.Assign($f0, TempPath());
  rt.Erase($f0);
  w16(262848, rt.IOResult());
  S.sp = $sp;
}

export function HasFiles(fam: number) {
  let disk: number = 0, found: boolean = false, $r0: boolean = false;
  found = DataArc.FileLength(GamePath(DataArc.MergedName(fam) + ".DAX")) >= 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    disk = $i1;
    if (!found) {
      found = DataArc.FileLength(GamePath(DataArc.SourceFile(fam, disk))) >= 0;
    }
  }
  $r0 = found;
  return $r0;
}

export function HasRoom(fam: number) {
  let disk: number = 0, size: number = 0, need: number = 0, free: number = 0, $r0: boolean = false;
  need = 65536;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    disk = $i1;
    size = DataArc.FileLength(GamePath(DataArc.SourceFile(fam, disk))) | 0;
    if (size > 0) {
      need = (need + size) | 0;
    }
  }
  free = -1;
  let $t2;
  if (((U8[229377] >= 2) && (U8[229379] === 58)) && ($t2 = rt.UpCase(U8[229378]), ($t2 >= 65 && $t2 <= 90))) {
    free = Dos.DiskFree((rt.UpCase(U8[229378]) - 65) + 1) | 0;
  }
  if ((free >= 0) && (free < need)) {
    Fail("not enough room on the disk: " + StrUtil.NumStr(need) + " bytes wanted, " + StrUtil.NumStr(free) + " free");
  }
  $r0 = (free < 0) || (free >= need);
  return $r0;
}

export function CanWrite() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ok: boolean = false, $r0: boolean = false;
  w16(262681, 0);
  if (!FileUtil.MakeTempFolder(GamePath(rS(262579) + ".DAX"))) {
    FailWriting("making the TMP\\ folder");
    $r0 = false;
    { S.sp = $sp; return $r0; }
  }
  rt.Assign($f0, TempPath());
  rt.RewriteF($f0, 1);
  ok = IoOk();
  if (ok) {
    rt.Close($f0);
    ok = IoOk();
  }
  if (!ok) {
    FailWriting("writing " + TempLabel() + ": DOS error " + StrUtil.NumStr(ri16(262681)));
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function ReadSource(f: number, fam: number, disk: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 19);
  let dataStart: number = 0, i: number = 0, ok: boolean = false, $r0: boolean = false;
  w16(262681, 0);
  w32($f0 + 2, rt.FileSize(f));
  ok = IoOk() && ReadAt(f, 0, $f0, 2);
  dataStart = 2 + r16($f0);
  ok = (ok && ((r16($f0) % 9) === 0)) && (dataStart <= ri32($f0 + 2));
  i = 1;
  while (ok && (i <= Math.trunc(r16($f0) / 9))) {
    ok = ReadAt(f, 2 + ((i - 1) * 9), $f0 + 10, 9);
    ok = (ok && (ri32($f0 + 11) >= 0)) && (((dataStart + ri32($f0 + 11)) + r16($f0 + 17)) <= ri32($f0 + 2));
    if (ok) {
      if ((r16(262416) + 3) >= 512) {
        Fail("too many blocks");
        ok = false;
      } else {
        w16(262416, r16(262416) + 1);
        U8[r32(262412) + r16(262416) * 14 - 14] = U8[$f0 + 10];
        w16(r32(262412) + r16(262416) * 14 - 13, r16($f0 + 15));
        w16(r32(262412) + r16(262416) * 14 - 11, r16($f0 + 17));
        U8[r32(262412) + r16(262416) * 14 - 9] = disk;
        w32(r32(262412) + r16(262416) * 14 - 8, dataStart + ri32($f0 + 11));
        w32(r32(262412) + r16(262416) * 14 - 4, 0);
      }
    }
    i = (i + 1) & 65535;
  }
  ok = ok && (await CrcOfFile(f, ri32($f0 + 2), $f0 + 6));
  if (ok && ((r16(262496) + 9) <= 72)) {
    U8[r16(262496) + 262424] = disk;
    mv((r16(262496) + 1) + 262424, $f0 + 2, 4);
    mv((r16(262496) + 5) + 262424, $f0 + 6, 4);
    w16(262496, r16(262496) + 9);
  }
  if (!ok) {
    if (ri16(262681) !== 0) {
      Fail("reading " + DataArc.SourceFile(fam, disk) + ": DOS error " + StrUtil.NumStr(ri16(262681)));
    } else {
      Fail(DataArc.SourceFile(fam, disk) + " is damaged");
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function ReadSources(fam: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let disk: number = 0, ok: boolean = false, $r0: boolean = false;
  w16(262416, 0);
  w16(262496, 0);
  ok = true;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    disk = $i1;
    if (ok) {
      rt.Assign($f0, GamePath(DataArc.SourceFile(fam, disk)));
      rt.ResetF($f0, 1);
      if (rt.IOResult() === 0) {
        Progress(rS(262579) + ".DAX: reading " + DataArc.SourceFile(fam, disk));
        (await BldShow.Reading(fam, disk));
        ok = (await ReadSource($f0, fam, disk));
        rt.Close($f0);
        w16(262848, rt.IOResult());
      }
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function SameBlock(fam: number, a: number, b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  let left: number = 0, part: number = 0, posA: number = 0, posB: number = 0, i: number = 0, same: boolean = false, $r0: boolean = false;
  same = (r16(a + 3) === r16(b + 3)) && (r16(a + 1) === r16(b + 1));
  if (same) {
    w16(262681, 0);
    rt.Assign($f0, GamePath(DataArc.SourceFile(fam, U8[a + 5])));
    rt.ResetF($f0, 1);
    if (IoOk()) {
      rt.Assign($f0 + 8, GamePath(DataArc.SourceFile(fam, U8[b + 5])));
      rt.ResetF($f0 + 8, 1);
      if (IoOk()) {
        left = r16(a + 3);
        posA = ri32(a + 6);
        posB = ri32(b + 6);
        while (same && (left > 0)) {
          part = left;
          if (part > 4096) {
            part = 4096;
          }
          if (ReadAt($f0, posA, r32(262404), part) && ReadAt($f0 + 8, posB, r32(262408), part)) {
            i = 0;
            while (same && (i < part)) {
              same = U8[r32(262404) + i] === U8[r32(262408) + i];
              i = (i + 1) & 65535;
            }
          } else {
            same = false;
          }
          posA = (posA + part) | 0;
          posB = (posB + part) | 0;
          left = (left - part) & 65535;
        }
        rt.Close($f0 + 8);
      }
      rt.Close($f0);
    }
    w16(262848, rt.IOResult());
    if (ri16(262681) !== 0) {
      Fail("comparing " + DataArc.SourceFile(fam, U8[b + 5]) + ": DOS error " + StrUtil.NumStr(ri16(262681)));
      same = false;
    }
  }
  $r0 = same;
  S.sp = $sp;
  return $r0;
}

export function EncodeRuns(raw: number, rawSize: number, packedBuf: number, packedSize: number) {
  let i: number = 0, o: number = 0, run: number = 0;
  w32(packedBuf, 0);
  w16(packedSize, 0);
  if (rawSize > 64000) {
    Fail("a block is too large to pack");
  } else if (rawSize > 0) {
    w16(packedSize, rawSize + Math.trunc(((rawSize + 127) - 1) / 127));
    if (Reserve(r16(packedSize))) {
      w32(packedBuf, rt.getMem(r16(packedSize)));
    } else {
      w16(packedSize, 0);
    }
  }
  i = 0;
  o = 0;
  while ((r16(packedSize) > 0) && (i < rawSize)) {
    run = (rawSize - i) & 65535;
    if (run > 127) {
      run = 127;
    }
    U8[r32(packedBuf) + o] = run - 1;
    mv(r32(packedBuf) + (o + 1), raw + i, run);
    o = (o + (run + 1)) & 65535;
    i = (i + run) & 65535;
  }
}

export function AddMemoryBlock(blockId: number, raw: number, size: number) {
  w16(262422, r16(262422) + 1);
  U8[r32(262418) + r16(262422) * 14 - 14] = blockId;
  w16(r32(262418) + r16(262422) * 14 - 13, size);
  U8[r32(262418) + r16(262422) * 14 - 9] = 0;
  w32(r32(262418) + r16(262422) * 14 - 8, 0);
  EncodeRuns(raw, size, r32(262418) + r16(262422) * 14 - 4, r32(262418) + r16(262422) * 14 - 11);
}

export async function ArchiveSound(path: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 22);
  let size: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = false;
  if (DataArc.ArchiveIntact(path)) {
    rt.Assign($f0, path);
    rt.ResetF($f0, 1);
    if (IoOk()) {
      size = rt.FileSize($f0) | 0;
      ok = (ReadAt($f0, size - 6, $f0 + 12, 6) && (U8[$f0 + 12] === 4)) && (U8[$f0 + 13] === 46);
      if (ok) {
        mv($f0 + 18, $f0 + 14, 4);
        ok = (await CrcOfFile($f0, size - 6, $f0 + 8)) && (ri32($f0 + 8) === ri32($f0 + 18));
      }
      rt.Close($f0);
      w16(262848, rt.IOResult());
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function ChooseIds(fam: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1024);
  let i: number = 0, r: number = 0, hit: number = 0, spare: number = 0, id: number = 0, $r0: boolean = false;
  rt.fill($f0, 256, 0);
  rt.fill($f0 + 256, 256, 0);
  rt.fill($f0 + 512, 512, 0);
  for (let $i1 = 1, $e1 = r16(262416); $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + U8[r32(262412) + i * 14 - 14]] = true ? 1 : 0;
  }
  i = 1;
  while ((i <= r16(262416)) && (rS(262600) === "")) {
    id = U8[r32(262412) + i * 14 - 14];
    if (r16($f0 + id * 2 + 512) === 0) {
      w16(262422, r16(262422) + 1);
      mv(r32(262418) + r16(262422) * 14 - 14, r32(262412) + i * 14 - 14, 14);
      w16($f0 + id * 2 + 512, r16(262422));
    } else if (!SameBlock(fam, r32(262418) + r16($f0 + id * 2 + 512) * 14 - 14, r32(262412) + i * 14 - 14) && (rS(262600) === "")) {
      hit = 0;
      for (let $i3 = 1, $e3 = U8[262498]; $i3 <= $e3; $i3++) {
        r = $i3;
        if (((hit === 0) && (U8[r + 262514] === id)) && (rS(262600) === "")) {
          if (SameBlock(fam, r32(262418) + r16(r * 2 + 262545) * 14 - 14, r32(262412) + i * 14 - 14)) {
            hit = r;
          }
        }
      }
      if (U8[262498] === 16) {
        Fail("too many collisions");
      } else if (rS(262600) === "") {
        U8[262498] = U8[262498] + 1;
        U8[U8[262498] + 262498] = U8[r32(262412) + i * 14 - 9];
        U8[U8[262498] + 262514] = id;
        if (hit > 0) {
          U8[U8[262498] + 262530] = U8[hit + 262530];
          w16(U8[262498] * 2 + 262545, r16(hit * 2 + 262545));
        } else {
          spare = 1;
          while ((spare < 253) && ((U8[$f0 + spare] !== 0) || (U8[$f0 + spare + 256] !== 0))) {
            spare = (spare + 1) & 65535;
          }
          if (spare >= 253) {
            Fail("no spare block id left");
          } else {
            U8[$f0 + spare + 256] = true ? 1 : 0;
            w16(262422, r16(262422) + 1);
            mv(r32(262418) + r16(262422) * 14 - 14, r32(262412) + i * 14 - 14, 14);
            U8[r32(262418) + r16(262422) * 14 - 14] = spare;
            U8[U8[262498] + 262530] = spare;
            w16(U8[262498] * 2 + 262545, r16(262422));
          }
        }
      }
    }
    i = (i + 1) & 65535;
  }
  $r0 = rS(262600) === "";
  S.sp = $sp;
  return $r0;
}

export async function CopyBlock(fam: number, b: number, dst: number, crc: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let left: number = 0, part: number = 0, pos: number = 0, ok: boolean = false, $r0: boolean = false;
  if (U8[b + 5] === 0) {
    rt.BlockWrite(dst, r32(b + 10), r16(b + 3), false);
    AddCrc(crc, r32(b + 10), r16(b + 3));
    (await BldShow.Advance(r16(b + 3)));
    ok = IoOk();
  } else {
    rt.Assign($f0, GamePath(DataArc.SourceFile(fam, U8[b + 5])));
    rt.ResetF($f0, 1);
    ok = IoOk();
    if (ok) {
      left = r16(b + 3);
      pos = ri32(b + 6);
      while (ok && (left > 0)) {
        part = left;
        if (part > 4096) {
          part = 4096;
        }
        ok = ReadAt($f0, pos, r32(262404), part);
        if (ok) {
          rt.BlockWrite(dst, r32(262404), part, false);
          AddCrc(crc, r32(262404), part);
          (await BldShow.Advance(part));
          ok = IoOk();
        }
        pos = (pos + part) | 0;
        left = (left - part) & 65535;
      }
      rt.Close($f0);
      w16(262848, rt.IOResult());
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function WriteArchive(fam: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 29);
  let nextOffset: number = 0, i: number = 0, ok: boolean = false, $r0: boolean = false;
  w16(262681, 0);
  rt.Assign($f0, TempPath());
  rt.RewriteF($f0, 1);
  ok = IoOk();
  if (ok) {
    w32($f0 + 19, -1);
    w16($f0 + 8, r16(262422) * 9);
    rt.BlockWrite($f0, $f0 + 8, 2, false);
    AddCrc($f0 + 19, $f0 + 8, 2);
    nextOffset = 0;
    for (let $i1 = 1, $e1 = r16(262422); $i1 <= $e1; $i1++) {
      i = $i1;
      U8[$f0 + 10] = U8[r32(262418) + i * 14 - 14];
      w32($f0 + 11, nextOffset);
      w16($f0 + 15, r16(r32(262418) + i * 14 - 13));
      w16($f0 + 17, r16(r32(262418) + i * 14 - 11));
      rt.BlockWrite($f0, $f0 + 10, 9, false);
      AddCrc($f0 + 19, $f0 + 10, 9);
      nextOffset = (nextOffset + r16(r32(262418) + i * 14 - 11)) | 0;
    }
    (await BldShow.Writing(nextOffset));
    ok = IoOk();
    i = 1;
    while (ok && (i < r16(262422))) {
      ok = (await CopyBlock(fam, r32(262418) + i * 14 - 14, $f0, $f0 + 19));
      i = (i + 1) & 65535;
    }
    if (ok) {
      U8[$f0 + 23] = 4;
      U8[$f0 + 24] = 46;
      w32($f0 + 19, ~ri32($f0 + 19));
      mv($f0 + 25, $f0 + 19, 4);
      rt.BlockWrite($f0, $f0 + 23, 6, false);
      ok = IoOk();
    }
    rt.Close($f0);
    ok = IoOk() && ok;
  }
  if (!ok) {
    if (ri16(262681) !== 0) {
      FailWriting("writing " + TempLabel() + ": DOS error " + StrUtil.NumStr(ri16(262681)));
    } else {
      FailWriting("writing " + TempLabel());
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function IssueName(issue: number) {
  let $r0: string = "";
  $r0 = "#" + StrUtil.NumStr(issue);
  return $r0;
}

export function MaxRawSize(fam: number) {
  let $r0: number = 0;
  if (fam === 1) {
    $r0 = 9986;
  } else {
    $r0 = 35718;
  }
  return $r0;
}

export function SameBlockPart(a: number, b: number) {
  let $r0: boolean = false;
  $r0 = ((U8[r32(262379) + a * 11 - 9] === U8[r32(262379) + b * 11 - 9]) && (U8[r32(262379) + a * 11 - 8] === U8[r32(262379) + b * 11 - 8])) && (U8[r32(262379) + a * 11 - 7] === U8[r32(262379) + b * 11 - 7]);
  return $r0;
}

export function SameFix(a: number, b: number) {
  let $r0: boolean = false;
  $r0 = (r16(r32(262379) + a * 11 - 11) === r16(r32(262379) + b * 11 - 11)) && SameBlockPart(a, b);
  return $r0;
}

export function RemapOf(disk: number, id: number) {
  let r: number = 0, found: number = 0, $r0: number = 0;
  found = 0;
  for (let $i1 = 1, $e1 = U8[262498]; $i1 <= $e1; $i1++) {
    r = $i1;
    if ((U8[r + 262498] === disk) && (U8[r + 262514] === id)) {
      found = r;
    }
  }
  $r0 = found;
  return $r0;
}

export function ResolveBlock(disk: number, id: number) {
  let i: number = 0, r: number = 0, found: number = 0, listed: boolean = false, $r0: number = 0;
  found = 0;
  r = RemapOf(disk, id) & 65535;
  if (r > 0) {
    found = r16(r * 2 + 262545);
  } else {
    listed = false;
    for (let $i1 = 1, $e1 = r16(262416); $i1 <= $e1; $i1++) {
      i = $i1;
      if ((U8[r32(262412) + i * 14 - 9] === disk) && (U8[r32(262412) + i * 14 - 14] === id)) {
        listed = true;
      }
    }
    if (listed) {
      for (let $i2 = 1, $e2 = r16(262422); $i2 <= $e2; $i2++) {
        i = $i2;
        if (U8[r32(262418) + i * 14 - 14] === id) {
          found = i;
        }
      }
    }
  }
  $r0 = found;
  return $r0;
}

export function BlockShared(disk: number, id: number, target: number) {
  let i: number = 0, shared: boolean = false, $r0: boolean = false;
  shared = false;
  for (let $i1 = 1, $e1 = r16(262416); $i1 <= $e1; $i1++) {
    i = $i1;
    if ((!shared && (U8[r32(262412) + i * 14 - 14] === id)) && (U8[r32(262412) + i * 14 - 9] !== disk)) {
      shared = ResolveBlock(U8[r32(262412) + i * 14 - 9], id) === target;
    }
  }
  $r0 = shared;
  return $r0;
}

export function SplitBlock(disk: number, id: number, target: number, why: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let i: number = 0, r: number = 0, spare: number = 0, $r0: number = 0;
  $r0 = 0;
  rt.fill($f0, 256, 0);
  for (let $i1 = 1, $e1 = r16(262416); $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + U8[r32(262412) + i * 14 - 14]] = true ? 1 : 0;
  }
  for (let $i2 = 1, $e2 = r16(262422); $i2 <= $e2; $i2++) {
    i = $i2;
    U8[$f0 + U8[r32(262418) + i * 14 - 14]] = true ? 1 : 0;
  }
  spare = 1;
  while ((spare < 253) && (U8[$f0 + spare] !== 0)) {
    spare = (spare + 1) & 65535;
  }
  r = RemapOf(disk, id) & 65535;
  if (U8[r32(262418) + target * 14 - 9] === 0) {
    wS(why, 80, "the block is not in its archive");
  } else if (spare >= 253) {
    wS(why, 80, "no spare block id left");
  } else if ((r === 0) && (U8[262498] === 16)) {
    wS(why, 80, "too many collisions");
  } else if ((r16(262422) + 3) >= 512) {
    wS(why, 80, "too many blocks");
  } else {
    w16(262422, r16(262422) + 1);
    mv(r32(262418) + r16(262422) * 14 - 14, r32(262418) + target * 14 - 14, 14);
    U8[r32(262418) + r16(262422) * 14 - 14] = spare;
    if (r === 0) {
      U8[262498] = U8[262498] + 1;
      r = U8[262498];
      U8[r + 262498] = disk;
      U8[r + 262514] = id;
    }
    U8[r + 262530] = spare;
    w16(r * 2 + 262545, r16(262422));
    $r0 = r16(262422);
  }
  S.sp = $sp;
  return $r0;
}

export function ApplyFix(fam: number, first: number, pos: number, raw: number, spare: number, room: number, rawLen: number, why: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 11);
  let p: number = 0, q: number = 0, k: number = 0, len: number = 0, newLen: number = 0, t: number = 0, ok: boolean = false, $r0: boolean = false;
  mv(r32(spare), r32(raw), r16(rawLen));
  len = r16(rawLen);
  ok = true;
  p = first;
  q = pos;
  while ((ok && (p <= 113)) && SameFix(first, p)) {
    mv($f0, r32(262379) + p * 11 - 11, 11);
    ok = ((r16($f0 + 5) === len) && ((r16($f0 + 7) + U8[$f0 + 9]) <= len)) && (((q + U8[$f0 + 9]) + U8[$f0 + 10]) <= 3953);
    k = 0;
    while (ok && (k < U8[$f0 + 9])) {
      ok = U8[r32(spare) + (r16($f0 + 7) + k)] === U8[r32(262383) + (q + k)];
      k = (k + 1) & 65535;
    }
    if (!ok) {
      wS(why, 80, "the block differs");
    } else {
      newLen = (len - U8[$f0 + 9]) + U8[$f0 + 10];
      ok = (newLen <= MaxRawSize(fam)) && (newLen <= room);
      if (!ok) {
        wS(why, 80, "the block would be too long");
      } else {
        mv(r32(spare) + (r16($f0 + 7) + U8[$f0 + 10]), r32(spare) + (r16($f0 + 7) + U8[$f0 + 9]), (len - r16($f0 + 7)) - U8[$f0 + 9]);
        mv(r32(spare) + r16($f0 + 7), r32(262383) + (q + U8[$f0 + 9]), U8[$f0 + 10]);
        len = newLen & 65535;
      }
    }
    q = (q + (U8[$f0 + 9] + U8[$f0 + 10])) & 65535;
    p = (p + 1) & 65535;
  }
  if (ok) {
    t = r32(raw);
    w32(raw, r32(spare));
    w32(spare, t);
    w16(rawLen, len);
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function PatchBlock(fam: number, first: number, pos: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 186);
  let disk: number = 0, id: number = 0, target: number = 0, room: number = 0, p: number = 0, q: number = 0, ok: boolean = false, fixed: boolean = false, held: boolean = false, $r0: boolean = false;
  disk = U8[r32(262379) + first * 11 - 8];
  id = U8[r32(262379) + first * 11 - 7];
  Progress(rS(262579) + ".DAX: fixing " + DataArc.SourceFile(fam, disk) + " block " + StrUtil.NumStr(id));
  (await BldShow.Fixing(fam, disk));
  ok = true;
  fixed = false;
  held = false;
  wS($f0 + 24, 80, "");
  target = ResolveBlock(disk, id) & 65535;
  if (target === 0) {
    wS($f0 + 24, 80, "the block is not there");
  } else if (BlockShared(disk, id, target)) {
    target = SplitBlock(disk, id, target, $f0 + 24) & 65535;
  }
  room = 0;
  if (target > 0) {
    room = r16(r32(262418) + target * 14 - 13);
    for (let $i1 = first; $i1 <= 113; $i1++) {
      p = $i1;
      if (SameBlockPart(first, p)) {
        room = (room + U8[r32(262379) + p * 11 - 1]) | 0;
      }
    }
    if (room > 64000) {
      room = 64000;
    }
    if ((((U8[r32(262418) + target * 14 - 9] === 0) || (r16(r32(262418) + target * 14 - 11) === 0)) || (r16(r32(262418) + target * 14 - 13) === 0)) || (r16(r32(262418) + target * 14 - 13) > 64000)) {
      wS($f0 + 24, 80, "the block cannot be patched");
    } else {
      ok = Reserve((r16(r32(262418) + target * 14 - 11) + (2 * room)) + 24);
    }
  }
  if (ok && (rS($f0 + 24) === "")) {
    w16($f0 + 14, r16(r32(262418) + target * 14 - 11));
    w16($f0, r16(r32(262418) + target * 14 - 13));
    w32($f0 + 10, rt.getMem(r16($f0 + 14)));
    w32($f0 + 2, rt.getMem(room));
    w32($f0 + 6, rt.getMem(room));
    held = true;
    w16(262681, 0);
    rt.Assign($f0 + 16, GamePath(DataArc.SourceFile(fam, U8[r32(262418) + target * 14 - 9])));
    rt.ResetF($f0 + 16, 1);
    ok = IoOk();
    if (ok) {
      ok = ReadAt($f0 + 16, ri32(r32(262418) + target * 14 - 8), r32($f0 + 10), r16($f0 + 14));
      rt.Close($f0 + 16);
      w16(262848, rt.IOResult());
    }
    if (ok) {
      DaxIo.DecompressDax($f0 + 10, $f0 + 2, $f0 + 14, $f0);
    } else {
      Fail("reading " + DataArc.SourceFile(fam, U8[r32(262418) + target * 14 - 9]) + " for a fix: DOS error " + StrUtil.NumStr(ri16(262681)));
    }
    rt.freeMem(r32($f0 + 10));
  }
  if (ok) {
    q = pos;
    for (let $i2 = first; $i2 <= 113; $i2++) {
      p = $i2;
      if (SameBlockPart(first, p) && ((p === first) || !SameFix(p - 1, p))) {
        if (rS($f0 + 24) !== "") {
          LogLine(rS(262579) + ".DAX: " + IssueName(r16(r32(262379) + p * 11 - 11)) + " skipped: " + rS($f0 + 24));
        } else if (ApplyFix(fam, p, q, $f0 + 2, $f0 + 6, room, $f0, $f0 + 105)) {
          fixed = true;
          LogLine(rS(262579) + ".DAX: " + IssueName(r16(r32(262379) + p * 11 - 11)) + " applied");
        } else {
          LogLine(rS(262579) + ".DAX: " + IssueName(r16(r32(262379) + p * 11 - 11)) + " skipped: " + rS($f0 + 105));
        }
      }
      q = (q + (U8[r32(262379) + p * 11 - 2] + U8[r32(262379) + p * 11 - 1])) & 65535;
    }
    if (fixed) {
      U8[r32(262418) + target * 14 - 9] = 0;
      w32(r32(262418) + target * 14 - 8, 0);
      w16(r32(262418) + target * 14 - 13, r16($f0));
      EncodeRuns(r32($f0 + 2), r16($f0), r32(262418) + target * 14 - 4, r32(262418) + target * 14 - 11);
      ok = rS(262600) === "";
    }
  }
  if (held) {
    rt.freeMem(r32($f0 + 6));
    rt.freeMem(r32($f0 + 2));
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function ApplyPatches(fam: number) {
  let p: number = 0, q: number = 0, pos: number = 0, ok: boolean = false, firstOnBlock: boolean = false, $r0: boolean = false;
  ok = true;
  pos = 0;
  for (let $i1 = 1; $i1 <= 113; $i1++) {
    p = $i1;
    if (ok && (U8[r32(262379) + p * 11 - 9] === fam)) {
      firstOnBlock = true;
      for (let $i2 = 1, $e2 = p - 1; $i2 <= $e2; $i2++) {
        q = $i2;
        if (SameBlockPart(q, p)) {
          firstOnBlock = false;
        }
      }
      if (firstOnBlock) {
        ok = (await PatchBlock(fam, p, pos));
      }
    }
    pos = (pos + (U8[r32(262379) + p * 11 - 2] + U8[r32(262379) + p * 11 - 1])) & 65535;
  }
  $r0 = ok;
  return $r0;
}

export async function BuildArchive(fam: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 61);
  let r: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = ChooseIds(fam);
  if (ok) {
    ok = (await ApplyPatches(fam));
  }
  if (ok) {
    AddMemoryBlock(253, 262424, r16(262496));
    if (U8[262498] > 0) {
      for (let $i1 = 1, $e1 = U8[262498]; $i1 <= $e1; $i1++) {
        r = $i1;
        U8[$f0 + (3 * (r - 1))] = U8[r + 262498];
        U8[$f0 + ((3 * (r - 1)) + 1)] = U8[r + 262514];
        U8[$f0 + ((3 * (r - 1)) + 2)] = U8[r + 262530];
      }
      AddMemoryBlock(254, $f0, 3 * U8[262498]);
    }
    rt.fill($f0 + 48, 5, 0);
    AddMemoryBlock(255, $f0 + 48, 5);
    ok = rS(262600) === "";
  }
  if (ok) {
    Progress(rS(262579) + ".DAX: writing");
    ok = (await WriteArchive(fam));
  }
  if (ok) {
    Progress(rS(262579) + ".DAX: checking");
    (await BldShow.Checking());
    ok = (await ArchiveSound(TempPath()));
    if (!ok) {
      Fail(TempLabel() + " did not read back whole");
    }
  }
  if (ok) {
    RemoveFile(rS(262579) + ".DAX");
    rt.Assign($f0 + 53, TempPath());
    w16(262681, 0);
    rt.Rename($f0 + 53, GamePath(rS(262579) + ".DAX"));
    ok = IoOk();
    if (!ok) {
      FailWriting("renaming " + TempLabel() + ": DOS error " + StrUtil.NumStr(ri16(262681)));
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function UpdateFamily(fam: number) {
  let i: number = 0;
  wS(262579, 20, DataArc.MergedName(fam));
  wS(262600, 80, "");
  w16(262422, 0);
  U8[262498] = 0;
  if (rS(262683) !== "") {
    Fail("not tried: " + rS(262683));
  } else if (rS(262764) !== "") {
    Fail("not tried: " + rS(262764));
  } else if ((HasRoom(fam) && CanWrite()) && (await ReadSources(fam))) {
    if (r16(262416) === 0) {
      LogLine(rS(262579) + ".DAX skipped: no per-disk archives");
      RemoveTemp();
      RemoveFile(rS(262579) + ".DAX");
    } else {
      for (let $i1 = 1, $e1 = r16(262416); $i1 <= $e1; $i1++) {
        i = $i1;
        if (U8[r32(262412) + i * 14 - 14] >= 253) {
          Fail("a per-disk archive uses block " + StrUtil.NumStr(U8[r32(262412) + i * 14 - 14]));
        }
      }
      if (rS(262600) === "") {
        if ((await BuildArchive(fam))) {
          LogLine(rS(262579) + ".DAX built: " + StrUtil.NumStr(r16(262422)) + " blocks, " + StrUtil.NumStr(U8[262498]) + " collisions");
          U8[262845] = U8[262845] + 1;
        }
      }
    }
  }
  if (rS(262600) !== "") {
    LogLine(rS(262579) + ".DAX FAILED: " + rS(262600));
    RemoveTemp();
    RemoveFile(rS(262579) + ".DAX");
    U8[262847] = U8[262847] + 1;
  }
  for (let $i2 = r16(262422); $i2 >= 1; $i2--) {
    i = $i2;
    if ((U8[r32(262418) + i * 14 - 9] === 0) && (r16(r32(262418) + i * 14 - 11) > 0)) {
      rt.freeMem(r32(r32(262418) + i * 14 - 4));
    }
  }
}
