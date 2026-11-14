// Generated from src/daxio.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameVars from './gamevars';
import * as Dos from './dos';
import * as GameIo from './gameio';
import * as C_DATA from './c_data';
import * as C_KEYS from './c_keys';
import * as DataArc from './dataarc';
import * as FileUtil from './fileutil';
import * as StrUtil from './strutil';
import * as Host from './host';
import * as NatFile from './natfile';
import * as GameDirs from './gamedirs';
import * as C_DEMO from './c_demo';

export const MAX_REMAPS = 224;

export const $at = { savedDiskIndex: 224343, daxCompressedFilePtr: 225150, familyState: 225154, familyDisks: 225168, remapCount: 225182, remapFamily: 225183, remapDisk: 225407, remapFrom: 225631, remapTo: 225855 };

export function FreeRounded(p: number, n: number) {
  rt.freeMem(r32(p));
}

export function AllocRounded(p: number, n: number) {
  w32(p, rt.getMem((n + 7) & 65528));
}

export function WriteChar(col: number, row: number, attr: number, count: number, ch: number) {
  rt.FT[r32(141087)](col, row, attr, count, ch);
}

export function BiosWriteChar(page: number, col: number, row: number, attr: number, count: number, ch: number) {
  U8[141227] = 2;
  U8[141229] = page;
  U8[141233] = row;
  U8[141232] = col;
  Host.Intr(16, 141226);
  U8[141227] = 9;
  U8[141226] = ch;
  U8[141229] = page;
  U8[141228] = attr;
  w16(141230, count);
  Host.Intr(16, 141226);
}

export function WriteString(col: number, row: number, attr: number, source: string) {
  let n: number = 0, i: number = 0;
  n = source.length;
  for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    WriteChar(col, row, attr, 1, rt.chAt(source, i));
    col = (col + 1) & 255;
  }
}

export function WriteBlock(col: number, row: number, attr: number, count: number) {
  WriteChar(col, row, attr, count, 219);
}

export async function PromptBox(attr: number, message: string) {
  let key: number = 0;
  key = (await PromptKey(attr, message)) & 255;
}

export async function PromptKey(attr: number, message: string) {
  let $r0: number = 0;
  WriteBlock(0, 24, 0, 40);
  WriteString(0, 24, attr, message);
  $r0 = (await GameIo.ReadAnyKey()) & 255;
  WriteBlock(0, 24, 0, 40);
  return $r0;
}

export function PathForLine(name_: string, room: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let $r0: string = "";
  wS($f0, 255, Dos.FExpand(name_));
  if (U8[$f0] > room) {
    wS($f0, 255, "..." + rt.Copy(rS($f0), (U8[$f0] - room) + 4, room - 3));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export async function AskForDisk(problem: string, name_: string, diskMsg: string) {
  let $r0: number = 0;
  (await PromptBox(14, problem + ": " + PathForLine(name_, 38 - problem.length)));
  $r0 = (await PromptKey(14, diskMsg)) & 255;
  return $r0;
}

export function DataDiskMsg() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, "");
  if ((U8[143234] >= 1) && (U8[143234] <= 8)) {
    wS($f0, 40, String.fromCharCode((48 + U8[143234]) & 255) + " ");
  }
  $r0 = "Insert disk " + rS($f0) + "in drive " + String.fromCharCode(DataDrive()) + ": (Esc quits)";
  S.sp = $sp;
  return $r0;
}

export async function WaitForFile(name_: string, diskMsg: string) {
  while (!FileUtil.Exists(name_)) {
    rt.WriteT(0, "Not found: " + PathForLine(name_, 68) + "\n");
    rt.WriteT(0, diskMsg + " (Esc quits)" + "\n");
    if ((await GameIo.ReadAnyKey()) === 27) {
      rt.Halt(0);
    }
  }
}

export async function OpenWithRetry(fileName: string, promptMsg: string, noPrompt: boolean, escQuits: boolean, f: number) {
  let found: boolean = false, gaveUp: boolean = false, $r0: boolean = false;
  gaveUp = false;
  do {
    found = FileUtil.Exists(fileName);
    if (!found && !noPrompt) {
      if ((await AskForDisk("Not found", fileName, promptMsg)) === 27) {
        if (escQuits) {
          (await GameIo.ExitGame());
        }
        gaveUp = true;
      }
    }
  } while (!((found || noPrompt) || gaveUp));
  if (found) {
    found = FileUtil.OpenReadOnly(f, fileName);
  }
  $r0 = found;
  return $r0;
}

export function DataDrive() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let $r0: number = 0;
  if (U8[143491] > 0) {
    $r0 = rt.UpCase(U8[143492]);
  } else {
    wS($f0, 255, rt.GetDir());
    $r0 = rt.UpCase(U8[$f0 + 1]);
  }
  S.sp = $sp;
  return $r0;
}

export function SanitizeFileName(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, name_);
  let i: number = 0, $r0: string = "";
  for (let $i1 = 1; $i1 <= 10; $i1++) {
    i = $i1;
    wS($f0, 255, StrUtil.RemoveAll(rS($f0), String.fromCharCode(U8[i + 226078])));
  }
  wS($f0, 255, rt.Copy(rS($f0), 1, 8));
  for (let $i2 = 1, $e2 = U8[$f0]; $i2 <= $e2; $i2++) {
    i = $i2;
    U8[$f0 + i] = rt.UpCase(U8[$f0 + i]);
  }
  if (FileUtil.IsDeviceName(rS($f0))) {
    wS($f0, 255, rS($f0) + "_");
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function DecompressDax(src: number, dst: number, lenCompressed: number, lenDecompressed: number) {
  let srcIdx: number = 0, dstIdx: number = 0, b: number = 0, n: number = 0;
  srcIdx = 0;
  dstIdx = 0;
  while ((srcIdx < r16(lenCompressed)) && (dstIdx < r16(lenDecompressed))) {
    b = I8[r32(src) + srcIdx];
    srcIdx = (srcIdx + 1) & 65535;
    const $c2 = b;
    if (($c2 >= 0 && $c2 <= 126)) {
      n = (b + 1) & 65535;
      if (n > (r16(lenCompressed) - srcIdx)) {
        n = (r16(lenCompressed) - srcIdx) & 65535;
      }
      if (n > (r16(lenDecompressed) - dstIdx)) {
        n = (r16(lenDecompressed) - dstIdx) & 65535;
      }
      mv(r32(dst) + dstIdx, r32(src) + srcIdx, n);
      srcIdx = (srcIdx + n) & 65535;
      dstIdx = (dstIdx + n) & 65535;
    } else if (($c2 >= -127 && $c2 <= -1)) {
      if (srcIdx < r16(lenCompressed)) {
        n = (-b) & 65535;
        if (n > (r16(lenDecompressed) - dstIdx)) {
          n = (r16(lenDecompressed) - dstIdx) & 65535;
        }
        rt.fill(r32(dst) + dstIdx, n, I8[r32(src) + srcIdx]);
        srcIdx = (srcIdx + 1) & 65535;
        dstIdx = (dstIdx + n) & 65535;
      }
    }
  }
  if (dstIdx < r16(lenDecompressed)) {
    rt.fill(r32(dst) + dstIdx, r16(lenDecompressed) - dstIdx, 0);
  }
}

export async function OpenDax(dirName: string, ext: string, headerSize: number, f1: number, f2: number) {
  let nread: number = 0, $r0: boolean = false;
  if ((await OpenWithRetry(dirName + ext, DataDiskMsg(), (U8[143747] !== 0), true, f1))) {
    if (!FileUtil.OpenReadOnly(f2, dirName + ext)) {
      rt.Close(f1);
      $r0 = false;
      return $r0;
    }
    nread = rt.BlockRead(f2, headerSize, 2, true) & 65535;
    if ((nread === 2) && ((r16(headerSize) + 2) <= rt.FileSize(f2))) {
      w16(headerSize, r16(headerSize) + 2);
      rt.Seek(f1, r16(headerSize));
      $r0 = true;
    } else {
      CloseDax(f1, f2);
      $r0 = false;
    }
  } else {
    $r0 = false;
  }
  return $r0;
}

export function CloseDax(f1: number, f2: number) {
  rt.Close(f1);
  rt.Close(f2);
}

export async function LoadDax(fileName: string, ext: string, fileID: number, sizeRead: number, data: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 35);
  let n: number = 0, family: number = 0, whole: boolean = false, found: boolean = false;
  family = DataArc.MatchFamily(fileName, $f0 + 34) & 255;
  if ((family > 0) && (fileID < 253)) {
    if ((await FamilyUsable(family)) && DiskHasSource(family, U8[$f0 + 34])) {
      fileID = RemapId(family, U8[$f0 + 34], fileID) & 255;
      fileName = DataArc.MergedName(family);
    }
  }
  if (!(await OpenDax(FolderOf(fileName) + fileName, ext, $f0 + 25, $f0 + 9, $f0 + 17))) {
    w16(sizeRead, 0);
    w32(data, 0);
    { S.sp = $sp; return; }
  }
  found = false;
  whole = true;
  while ((whole && !found) && ((rt.FilePos($f0 + 17) + 9) <= r16($f0 + 25))) {
    n = rt.BlockRead($f0 + 17, $f0, 9, true) & 65535;
    whole = n === 9;
    if (whole && (r16($f0 + 7) > 36000)) {
      wS($f0 + 27, 6, rt.fmtI(r16($f0 + 7), 0));
      (await PromptBox(14, "tempsize " + rS($f0 + 27)));
      (await GameIo.ExitGame());
    }
    found = whole && (U8[$f0] === fileID);
  }
  if (found) {
    w16(sizeRead, r16($f0 + 5));
    if (!ReadBlock($f0 + 9, r16($f0 + 25), ri32($f0 + 1), r16($f0 + 7), r16(sizeRead), data)) {
      w16(sizeRead, 0);
    }
  } else {
    w16(sizeRead, 0);
    w32(data, 0);
  }
  CloseDax($f0 + 9, $f0 + 17);
  S.sp = $sp;
}

export function ReadBlock(f: number, hdrSize: number, offset: number, compSize: number, sizeRead: number, data: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w16($f0, sizeRead);
  let ioRes: number = 0, ok: boolean = false, $r0: boolean = false;
  w32(data, 0);
  ioRes = rt.IOResult() << 16 >> 16;
  ok = ((offset >= 0) && (offset < (rt.FileSize(f) - hdrSize))) && (rt.IOResult() === 0);
  if (ok) {
    rt.Seek(f, hdrSize + offset);
    ok = rt.IOResult() === 0;
  }
  if (ok) {
    w16($f0 + 2, 0);
    AllocRounded(225150, compSize);
    w16($f0 + 2, rt.BlockRead(f, r32(225150), compSize, true));
    ok = rt.IOResult() === 0;
    if (ok) {
      w32(data, rt.getMem(r16($f0)));
      DecompressDax(225150, data, $f0 + 2, $f0);
    }
    FreeRounded(225150, compSize);
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function FamilyUsable(family: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let i: number = 0, first: number = 0, $r0: boolean = false;
  if (U8[family + 225153] === 0) {
    U8[family + 225153] = 2;
    if (DataArc.ArchiveIntact(rS(224894) + DataArc.MergedName(family) + ".DAX")) {
      (await LoadDax(DataArc.MergedName(family), ".dax", 255, $f0, $f0 + 2));
      if (r32($f0 + 2) !== 0) {
        if ((r16($f0) >= 1) && ((I8[r32($f0 + 2)] & 255) === 46)) {
          rt.freeMem(r32($f0 + 2));
          (await LoadDax(DataArc.MergedName(family), ".dax", 253, $f0, $f0 + 2));
          if (r32($f0 + 2) !== 0) {
            if (SourcesMatch(family, r32($f0 + 2), r16($f0))) {
              U8[family + 225153] = 1;
            }
          }
        }
        if (r32($f0 + 2) !== 0) {
          rt.freeMem(r32($f0 + 2));
        }
      }
    }
    if (U8[family + 225153] === 1) {
      (await LoadDax(DataArc.MergedName(family), ".dax", 254, $f0, $f0 + 2));
      if (r32($f0 + 2) !== 0) {
        first = U8[225182];
        i = 0;
        while (((i + 2) < r16($f0)) && (U8[family + 225153] === 1)) {
          let $t2;
          if ((($t2 = I8[r32($f0 + 2) + i] & 255, ($t2 >= 1 && $t2 <= 8)) && ((I8[r32($f0 + 2) + (i + 1)] & 255) < 253)) && ((I8[r32($f0 + 2) + (i + 2)] & 255) < 253)) {
            if (U8[225182] === 224) {
              U8[family + 225153] = 2;
              U8[225182] = first;
            } else {
              U8[225182] = U8[225182] + 1;
              U8[U8[225182] + 225182] = family;
              U8[U8[225182] + 225406] = I8[r32($f0 + 2) + i] & 255;
              U8[U8[225182] + 225630] = I8[r32($f0 + 2) + (i + 1)] & 255;
              U8[U8[225182] + 225854] = I8[r32($f0 + 2) + (i + 2)] & 255;
            }
          }
          i = (i + 3) & 65535;
        }
        rt.freeMem(r32($f0 + 2));
      }
    }
  }
  $r0 = U8[family + 225153] === 1;
  S.sp = $sp;
  return $r0;
}

export function ResetArchiveCache() {
  rt.fill(225154, 14, 0);
  rt.fill(225168, 14, 0);
  U8[225182] = 0;
}

export async function ArchiveName(fileName: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let family: number = 0, $r0: string = "";
  $r0 = fileName;
  family = DataArc.MatchFamily(fileName, $f0) & 255;
  if (family > 0) {
    if ((await FamilyUsable(family)) && DiskHasSource(family, U8[$f0])) {
      $r0 = DataArc.MergedName(family);
    }
  }
  S.sp = $sp;
  return $r0;
}

export function RemapId(family: number, disk: number, id: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = id;
  for (let $i1 = 1, $e1 = U8[225182]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (((U8[i + 225182] === family) && (U8[i + 225406] === disk)) && (U8[i + 225630] === id)) {
      $r0 = U8[i + 225854];
    }
  }
  return $r0;
}

export function DiskHasBlock(fileName: string, fileID: number) {
  let $r0: boolean = false;
  $r0 = DataArc.HasBlock(rS(143491) + fileName + ".DAX", fileID);
  return $r0;
}

export function PushState(v: number) {
  U8[224343] = U8[143234];
  U8[143234] = v;
}

export function PopState() {
  U8[143234] = U8[224343];
}

export function FolderOf(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let family: number = 0, i: number = 0, built: boolean = false, $r0: string = "";
  wS($f0, 20, name_);
  if (rt.Pos(".", rS($f0)) > 0) {
    U8[$f0] = (rt.Pos(".", rS($f0)) - 1) & 255;
  }
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + i] = rt.UpCase(U8[$f0 + i]);
  }
  built = rS($f0) === "DATABLD";
  for (let $i2 = 1; $i2 <= 14; $i2++) {
    family = $i2;
    built = built || (rS($f0) === DataArc.MergedName(family));
  }
  if (built) {
    $r0 = rS(224894);
  } else if (rS($f0) === C_DEMO.ARCHIVE) {
    $r0 = GameDirs.OwnFolder("DEMO.DAX");
  } else {
    $r0 = rS(143491);
  }
  S.sp = $sp;
  return $r0;
}

export function DiskHasSource(family: number, disk: number) {
  let $r0: boolean = false;
  $r0 = (U8[family + 225167] & (1 << (disk - 1))) !== 0;
  return $r0;
}

export function SourcesMatch(family: number, data: number, size: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, d: number = 0, ok: boolean = false, $r0: boolean = false;
  U8[family + 225167] = 0;
  ok = (size % 9) === 0;
  i = 0;
  while (ok && (i < size)) {
    d = (I8[data + i] & 255) & 255;
    ok = (d >= 1) && (d <= 8);
    if (ok) {
      mv($f0, data + (i + 1), 4);
      U8[family + 225167] = U8[family + 225167] | (1 << (d - 1));
      ok = DataArc.FileLength(rS(143491) + DataArc.SourceFile(family, d)) === ri32($f0);
    }
    i = (i + 9) & 65535;
  }
  for (let $i2 = 1; $i2 <= 8; $i2++) {
    d = $i2;
    if (ok && !DiskHasSource(family, d)) {
      ok = DataArc.FileLength(rS(143491) + DataArc.SourceFile(family, d)) < 0;
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function $init() {
  ResetArchiveCache();
  U8[224343] = 0;
}
