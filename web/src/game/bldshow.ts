// Generated from src/bldshow.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_DATA from './c_data';
import * as Crt from './crt';
import * as Types from './types';
import * as C_MSG from './c_msg';
import * as GameVars from './gamevars';
import * as DataArc from './dataarc';
import * as TextRend from './textrend';
import * as Blit from './blit';
import * as Border from './border';
import * as GameIo from './gameio';
import * as StrUtil from './strutil';
import * as VidOps from './vidops';
import * as DaxIo from './daxio';

export const TITLE_ROW = 1;
export const STATUS_TOP = 3;
export const STATUS_BOTTOM = 9;
export const PANEL_TOP = 11;
export const PANEL_BOTTOM = 22;
export const MAKE_ROW = 4;
export const STEP_ROW = 5;
export const OVERALL_ROW = 7;
export const ETA_ROW = 8;
export const LABEL_WIDTH = 9;
export const LABEL_END = 13;
export const VALUE_COL = 15;
export const STEP_WIDTH = 13;
export const COUNT_WIDTH = 5;
export const BAR_COL = 21;
export const BAR_CELLS = 16;
export const BAR_PX = 128;
export const PANEL_FIRST = 13;
export const PANEL_ROWS = 7;
export const NAME_WIDTH = 8;
export const LEFT_NAME_COL = 3;
export const RIGHT_NAME_COL = 21;
export const NOTE_ROW = 21;
export const CELL_NONE = 0;
export const CELL_WAIT = 1;
export const CELL_CURRENT = 2;
export const CELL_DONE = 3;
export const CELL_FAILED = 4;
export const FRAME_BAR = 4;
export const FRAMES = 13;
export const FIELD_MAKE_LABEL = 0;
export const FIELD_MAKE = 1;
export const FIELD_STEP_LABEL = 2;
export const FIELD_STEP = 3;
export const FIELD_COUNT = 4;
export const FIELD_ETA = 5;
export const FIELDS = 6;
export const FIELD_WIDTH = 16;
export const NAME_NONE = 0;
export const NAME_SHOWN = 1;
export const NAME_FAILED = 2;
export const WARN_ROW = 5;
export const WARN_NEXT_ROW = 7;
export const PHASE_READ = 0;
export const PHASE_WRITE = 1;
export const PHASE_CHECK = 2;

export const $at = { st: 254183 };

export async function Open(stale: number, writable: boolean) {
  let fam: number = 0, disk: number = 0, n: number = 0, f: number = 0, col: number = 0, bytes: number = 0;
  w32(254183, 0);
  if (16777216 < (((860 + rt.mul(14, Blit.FrameBytes(8, 1) | 0)) + 128) + 1024)) {
    return;
  }
  w32(254183, rt.getMem(860));
  rt.fill(r32(254183), 860, 0);
  (await Blit.AllocPic(8, 1, 13, 0, r32(254183) + 852));
  (await Blit.AllocPic(8, 1, 1, 0, r32(254183) + 856));
  (await MakeFrame(0, 1, 6, 0, 8, 0, true));
  (await MakeFrame(1, 1, 6, 6, 14, 0, false));
  (await MakeFrame(2, 1, 6, 6, 10, 0, false));
  (await MakeFrame(3, 1, 6, 6, 12, 0, false));
  for (let $i1 = 0; $i1 <= 8; $i1++) {
    f = $i1;
    (await MakeFrame(4 + f, 0, 7, f, 10, 8, false));
  }
  for (let $i2 = 1; $i2 <= 14; $i2++) {
    fam = $i2;
    n = 0;
    bytes = 0;
    for (let $i3 = 1; $i3 <= 8; $i3++) {
      disk = $i3;
      w32(r32(254183) + fam * 32 + disk * 4 - 36, DataArc.FileLength(rS(143491) + DataArc.SourceFile(fam, disk)));
      if (ri32(r32(254183) + fam * 32 + disk * 4 - 36) >= 0) {
        n = (n + 1) & 255;
        U8[r32(254183) + fam * 8 + disk + 439] = n;
        bytes = (bytes + ri32(r32(254183) + fam * 32 + disk * 4 - 36)) | 0;
      }
    }
    if ((U8[stale + fam - 1] !== 0)) {
      let $t4;
      $t4 = r32(254183) + 824, w32($t4, ri32($t4) + (3 * bytes));
    } else {
      let $t5;
      $t5 = r32(254183) + 838, U8[$t5] = U8[$t5] + 1;
    }
    U8[r32(254183) + fam + 787] = (U8[stale + fam - 1] !== 0) || (n > 0) ? 1 : 0;
  }
  w32(r32(254183) + 844, (await TextRend.TickCount()));
  U8[r32(254183) + 839] = !writable ? 1 : 0;
  (await TextRend.ClearRect(0, 0, 39, 23));
  (await Border.DrawBorder(1, 1, 38, 1, 0));
  (await Border.DrawBorder(1, 3, 38, 9, 0));
  (await Border.DrawBorder(1, 11, 38, 22, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, "Please wait, preparing files");
  if ((U8[r32(254183) + 839] !== 0)) {
    col = 1;
    DrawText(col, 5, 12, "Warning:");
    DrawText(col + 8, 5, 14, " Install folder is read only.");
    TextRend.DisplayCentered(1, 38, 7, 14, "Game data fixes will be unavailable.");
  } else {
    Status(0, 1, 4, "Creating:", "");
    DrawText(5, 7, 14, StrUtil.PadLeft("Overall:", 9));
    DrawText(5, 8, 14, StrUtil.PadLeft("ETA:", 9));
    ShowCount();
    w16(r32(254183) + 832, 128);
    (await ShowBar(0));
    w32(r32(254183) + 834, 1);
  }
  for (let $i6 = 1; $i6 <= 14; $i6++) {
    fam = $i6;
    if (!(U8[stale + fam - 1] !== 0)) {
      SetName(fam, 1);
      (await SetCells(fam, 3));
    } else if ((U8[r32(254183) + 839] !== 0)) {
      SetName(fam, 2);
      (await SetCells(fam, 4));
    } else {
      SetName(fam, 1);
      (await SetCells(fam, 1));
    }
  }
}

export async function StartFamily(fam: number) {
  let disk: number = 0;
  if ((!Active() || (fam < 1)) || (fam > 14)) {
    return;
  }
  U8[r32(254183) + 802] = fam;
  w32(r32(254183) + 803, 0);
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    disk = $i1;
    if (ri32(r32(254183) + fam * 32 + disk * 4 - 36) > 0) {
      let $t2;
      $t2 = r32(254183) + 803, w32($t2, ri32($t2) + ri32(r32(254183) + fam * 32 + disk * 4 - 36));
    }
  }
  w32(r32(254183) + 807, ri32(r32(254183) + 828));
  Status(0, 1, 4, "Creating:", DataArc.MergedName(fam) + ".DAX");
  (await StartPhase(0, ri32(r32(254183) + 803)));
}

export async function Reading(fam: number, disk: number) {
  let d: number = 0;
  if ((!Active() || (fam < 1)) || (fam > 14)) {
    return;
  }
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    d = $i1;
    if (d < disk) {
      (await SetCell(fam, d, 3));
    } else if (d === disk) {
      (await SetCell(fam, d, 2));
    }
  }
  Step("Reading:", DataArc.SourceFile(fam, disk));
  (await Tick());
}

export async function Fixing(fam: number, disk: number) {
  if ((!Active() || (fam < 1)) || (fam > 14)) {
    return;
  }
  (await SetCells(fam, 3));
  Step("Fixing:", DataArc.SourceFile(fam, disk));
  (await Tick());
}

export async function Writing(bytes: number) {
  if (!Active()) {
    return;
  }
  (await SetCells(U8[r32(254183) + 802], 3));
  Step("Writing:", DataArc.MergedName(U8[r32(254183) + 802]) + ".DAX");
  (await StartPhase(1, bytes));
}

export async function Checking() {
  if (!Active()) {
    return;
  }
  Step("Checking:", DataArc.MergedName(U8[r32(254183) + 802]) + ".DAX");
  (await StartPhase(2, ri32(r32(254183) + 816)));
}

export async function Advance(bytes: number) {
  if (!Active()) {
    return;
  }
  let $t1;
  $t1 = r32(254183) + 812, w32($t1, ri32($t1) + bytes);
  if (ri32(r32(254183) + 812) >= ri32(r32(254183) + 820)) {
    (await Recount());
  } else {
    (await Tick());
  }
}

export async function EndFamily(fam: number, ok: boolean) {
  if ((!Active() || (fam < 1)) || (fam > 14)) {
    return;
  }
  if (ok) {
    (await SetCells(fam, 3));
  } else {
    (await SetCells(fam, 4));
    SetName(fam, 2);
    Step("", "");
  }
  let $t1;
  $t1 = r32(254183) + 838, U8[$t1] = U8[$t1] + 1;
  ShowCount();
  (await SetDone(ri32(r32(254183) + 807) + (3 * ri32(r32(254183) + 803))));
}

export async function Finish(failed: boolean) {
  let start: number = 0, key: number = 0;
  if (r32(254183) === 0) {
    return;
  }
  if (!(U8[r32(254183) + 839] !== 0)) {
    (await SetDone(ri32(r32(254183) + 824)));
    (await ShowBar(128));
    Status(0, 1, 4, "", "");
    Step("", "");
    Field(5, 15, 8, 11, "0:00", 5);
  }
  if (failed || (U8[r32(254183) + 839] !== 0)) {
    if (!(U8[r32(254183) + 839] !== 0) && (DataArc.FileLength(DaxIo.FolderOf("DATABLD.LOG") + "DATABLD.LOG") > 0)) {
      TextRend.DisplayCentered(1, 38, 21, 12, "See DATABLD.LOG");
    }
    while ((await Crt.KeyPressed())) {
      (await GameIo.DiscardPendingKeys());
    }
    TextRend.ClearBottomLine();
    TextRend.DisplayString(0, 24, 15, C_MSG.CONTINUE_PROMPT);
    do {
      key = (await GameIo.ReadAnyKey()) & 255;
    } while (!(key === 13));
    TextRend.ClearBottomLine();
  } else {
    start = ri32(r32(254183) + 840);
    while ((ri32(r32(254183) + 840) - start) < 18) {
      (await Tick());
    }
  }
  (await TextRend.ClearScreen());
  Blit.FreePic(r32(254183) + 856);
  Blit.FreePic(r32(254183) + 852);
  rt.freeMem(r32(254183));
  w32(254183, 0);
}

export function MulDiv(a: number, b: number, c: number) {
  let doublings: number = 0, q: number = 0, $r0: number = 0;
  if (((a <= 0) || (b <= 0)) || (c <= 0)) {
    $r0 = 0;
  } else {
    doublings = 0;
    while ((a > 46340) || (b > 46340)) {
      if (a > b) {
        a = (a >>> 1) | 0;
      } else {
        b = (b >>> 1) | 0;
      }
      if (c > 1) {
        c = (c >>> 1) | 0;
      } else {
        doublings = (doublings + 1) & 255;
      }
    }
    q = Math.trunc(rt.mul(a, b) / c) | 0;
    while (doublings > 0) {
      q = (q * 2) | 0;
      doublings = (doublings - 1) & 255;
    }
    $r0 = q;
  }
  return $r0;
}

export function DrawText(col: number, row: number, color: number, s: string) {
  if ((col < 40) && (row < 25)) {
    TextRend.DisplayString(col, row, color, rt.Copy(s, 1, 40 - col));
  }
}

export async function MakeFrame(frame: number, left: number, right: number, fill: number, fg: number, bg: number, outline: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let x: number = 0, y: number = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    y = $i1;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      x = $i2;
      U8[$f0 + x] = 0;
      if ((((y >= 1) && (y <= 6)) && (x >= left)) && (x <= right)) {
        if (outline) {
          if ((((y === 1) || (y === 6)) || (x === left)) || (x === right)) {
            U8[$f0 + x] = fg;
          }
        } else if ((x - left) < fill) {
          U8[$f0 + x] = fg;
        } else {
          U8[$f0 + x] = bg;
        }
      }
    }
    if (frame < 13) {
      (await VidOps.PutPixelRow(r32(r32(254183) + 852), frame, y, $f0));
    }
  }
  S.sp = $sp;
}

export async function ShowFrame(col: number, row: number, frame: number) {
  if (((col > 39) || (row > 24)) || (frame >= 13)) {
    return;
  }
  mv(r32(r32(254183) + 856) + 27, r32(r32(254183) + 852) + (frame * r16(r32(r32(254183) + 852) + 17)) + 27, r16(r32(r32(254183) + 856) + 17));
  (await Blit.ShowPic(col, row, r32(r32(254183) + 856)));
}

export function FamilyPlace(fam: number, row: number, col: number) {
  let $r0: boolean = false;
  $r0 = (fam >= 1) && (fam <= 14);
  if (fam <= 7) {
    U8[row] = (13 + fam) - 1;
    U8[col] = 3;
  } else {
    U8[row] = ((13 + fam) - 7) - 1;
    U8[col] = 21;
  }
  return $r0;
}

export async function SetCell(fam: number, disk: number, state: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  if ((((fam < 1) || (fam > 14)) || (disk < 1)) || (disk > 8)) {
    { S.sp = $sp; return; }
  }
  if ((U8[r32(254183) + fam * 8 + disk + 439] === 0) || (U8[r32(254183) + fam * 8 + disk + 551] === state)) {
    { S.sp = $sp; return; }
  }
  if (!FamilyPlace(fam, $f0, $f0 + 1)) {
    { S.sp = $sp; return; }
  }
  U8[r32(254183) + fam * 8 + disk + 551] = state;
  U8[$f0 + 1] = ((U8[$f0 + 1] + 8) + U8[r32(254183) + fam * 8 + disk + 439]) - 1;
  if (state !== 0) {
    (await ShowFrame(U8[$f0 + 1], U8[$f0], state - 1));
  }
  S.sp = $sp;
}

export async function SetCells(fam: number, state: number) {
  let disk: number = 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    disk = $i1;
    (await SetCell(fam, disk, state));
  }
}

export function SetName(fam: number, state: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let color: number = 0;
  if ((fam < 1) || (fam > 14)) {
    { S.sp = $sp; return; }
  }
  if (!(U8[r32(254183) + fam + 787] !== 0) || (U8[r32(254183) + fam + 671] === state)) {
    { S.sp = $sp; return; }
  }
  if (!FamilyPlace(fam, $f0, $f0 + 1)) {
    { S.sp = $sp; return; }
  }
  U8[r32(254183) + fam + 671] = state;
  if (state === 2) {
    color = 12;
  } else {
    color = 10;
  }
  DrawText(U8[$f0 + 1], U8[$f0], color, StrUtil.PadRight(DataArc.MergedName(fam), 7));
  S.sp = $sp;
}

export function Field(field: number, col: number, row: number, color: number, s: string, width: number) {
  let i: number = 0;
  if (field >= 6) {
    return;
  }
  if (width > 16) {
    width = 16;
  }
  s = StrUtil.PadRight(s, width);
  for (let $i1 = 1, $e1 = width; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((i > U8[r32(254183) + field * 17 + 686]) || (U8[r32(254183) + field * 17 + i + 686] !== rt.chAt(s, i))) {
      if (((col + i) - 1) < 40) {
        TextRend.RenderChar((col + i) - 1, row, color, 0, 1, rt.chAt(s, i), 1);
      }
    }
  }
  wS(r32(254183) + field * 17 + 686, 16, s);
}

export function Status(labelField: number, valueField: number, row: number, lbl: string, value: string) {
  Field(labelField, 5, row, 14, StrUtil.PadLeft(lbl, 9), 9);
  Field(valueField, 15, row, 11, value, 13);
}

export function ShowCount() {
  Field(4, 15, 7, 11, StrUtil.PadLeft(StrUtil.NumStr(U8[r32(254183) + 838]), 2) + "/" + StrUtil.NumStr(14), 5);
}

export async function ShowBar(px: number) {
  let c: number = 0, first: number = 0, last: number = 0, fill: number = 0;
  if (px > 128) {
    px = 128;
  }
  if (px === r16(r32(254183) + 832)) {
    return;
  }
  if (px > r16(r32(254183) + 832)) {
    first = Math.trunc(r16(r32(254183) + 832) / 8);
    last = Math.trunc((px - 1) / 8) & 65535;
  } else {
    first = Math.trunc(px / 8);
    last = Math.trunc((r16(r32(254183) + 832) - 1) / 8) & 65535;
  }
  if (last >= 16) {
    last = 15;
  }
  for (let $i1 = first, $e1 = last; $i1 <= $e1; $i1++) {
    c = $i1;
    fill = ((px << 16 >> 16) - ((c * 8) << 16 >> 16)) << 16 >> 16;
    if (fill < 0) {
      fill = 0;
    } else if (fill > 8) {
      fill = 8;
    }
    (await ShowFrame(21 + c, 7, 4 + fill));
  }
  w16(r32(254183) + 832, px);
}

export function ShowEta() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let secs: number = 0, mins: number = 0;
  secs = MulDiv(ri32(r32(254183) + 840), ri32(r32(254183) + 824) - ri32(r32(254183) + 828), ri32(r32(254183) + 828)) | 0;
  if (secs > 200000) {
    secs = 200000;
  }
  secs = Math.trunc(((secs * 10) + 91) / 182) | 0;
  mins = Math.trunc(secs / 60);
  if (mins > 99) {
    mins = 99;
    secs = 59;
  } else {
    secs = (secs % 60) | 0;
  }
  wS($f0, 20, StrUtil.ZeroPad2(secs));
  Field(5, 15, 8, 11, StrUtil.NumStr(mins) + ":" + rS($f0), 5);
  S.sp = $sp;
}

export async function Tick() {
  let now: number = 0, delta: number = 0;
  now = (await TextRend.TickCount()) | 0;
  if (now >= ri32(r32(254183) + 844)) {
    delta = (now - ri32(r32(254183) + 844)) | 0;
  } else {
    delta = ((now + 1573040) - ri32(r32(254183) + 844)) | 0;
  }
  if ((delta < 0) || (delta > 1573040)) {
    delta = 0;
  }
  let $t1;
  $t1 = r32(254183) + 840, w32($t1, ri32($t1) + delta);
  w32(r32(254183) + 844, now);
  if (((ri32(r32(254183) + 840) >= 36) && ((ri32(r32(254183) + 840) - ri32(r32(254183) + 848)) >= 18)) && (ri32(r32(254183) + 828) > 0)) {
    w32(r32(254183) + 848, ri32(r32(254183) + 840));
    ShowEta();
  }
}

export async function SetDone(units: number) {
  let px: number = 0;
  if (units > ri32(r32(254183) + 824)) {
    units = ri32(r32(254183) + 824);
  }
  if (units > ri32(r32(254183) + 828)) {
    w32(r32(254183) + 828, units);
    if (ri32(r32(254183) + 828) >= ri32(r32(254183) + 834)) {
      px = MulDiv(128, ri32(r32(254183) + 828), ri32(r32(254183) + 824)) | 0;
      (await ShowBar(px));
      w32(r32(254183) + 834, MulDiv(ri32(r32(254183) + 824), px + 1, 128));
      if (ri32(r32(254183) + 834) <= ri32(r32(254183) + 828)) {
        w32(r32(254183) + 834, ri32(r32(254183) + 828) + 1);
      }
    }
  }
  (await Tick());
}

export function Step(lbl: string, fileName: string) {
  Status(2, 3, 5, lbl, fileName);
}

export async function Recount() {
  let start: number = 0, part: number = 0;
  start = (ri32(r32(254183) + 807) + (U8[r32(254183) + 811] * ri32(r32(254183) + 803))) | 0;
  if (ri32(r32(254183) + 812) >= ri32(r32(254183) + 816)) {
    part = ri32(r32(254183) + 803);
  } else {
    part = MulDiv(ri32(r32(254183) + 803), ri32(r32(254183) + 812), ri32(r32(254183) + 816)) | 0;
  }
  (await SetDone(start + part));
  if ((ri32(r32(254183) + 834) - start) >= ri32(r32(254183) + 803)) {
    w32(r32(254183) + 820, ri32(r32(254183) + 816));
  } else {
    w32(r32(254183) + 820, MulDiv(ri32(r32(254183) + 834) - start, ri32(r32(254183) + 816), ri32(r32(254183) + 803)));
  }
  if (ri32(r32(254183) + 820) <= ri32(r32(254183) + 812)) {
    w32(r32(254183) + 820, ri32(r32(254183) + 812) + 1);
  }
}

export async function StartPhase(phase: number, total: number) {
  U8[r32(254183) + 811] = phase;
  w32(r32(254183) + 812, 0);
  w32(r32(254183) + 816, total);
  (await Recount());
}

export function Active() {
  let $r0: boolean = false;
  $r0 = r32(254183) !== 0;
  if (r32(254183) !== 0) {
    $r0 = !(U8[r32(254183) + 839] !== 0);
  }
  return $r0;
}
