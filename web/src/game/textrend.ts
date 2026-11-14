// Generated from src/textrend.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as DaxIo from './daxio';
import * as Crt from './crt';
import * as Dos from './dos';
import * as GameIo from './gameio';
import * as C_KEYS from './c_keys';
import * as C_MSG from './c_msg';
import * as Border from './border';
import * as Host from './host';


export const $at = { pageByDelay: 226089, pauseCount: 226090 };

export async function LoadGameFont() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let n: number = 0;
  (await DaxIo.LoadDax("8X8d1", ".dax", 201, $f0, $f0 + 2));
  if (r16($f0) === 0) {
    { S.sp = $sp; return; }
  }
  n = r16($f0);
  if (n > 1416) {
    n = 1416;
  }
  mv(r32(143765), r32($f0 + 2), n);
  rt.freeMem(r32($f0 + 2));
  S.sp = $sp;
}

export function RenderChar(col: number, row: number, fg: number, bg: number, count: number, ch: number, isAscii: number) {
  let i: number = 0, charIdx: number = 0;
  if (((col > 39) || (row > 24)) || (r32(143765) === 0)) {
    return;
  }
  if (isAscii !== 0) {
    charIdx = rt.UpCase(ch) % 64;
  } else {
    if (ch >= 177) {
      return;
    }
    charIdx = ch;
  }
  for (let $i1 = 1, $e1 = count; $i1 <= $e1; $i1++) {
    i = $i1;
    rt.FT[r32(141075)](col, row, fg, bg, charIdx);
    col = (col + 1) & 255;
  }
}

export function PrintSpaces(col: number, row: number, color: number, count: number) {
  if ((col > 39) || (row > 24)) {
    return;
  }
  RenderChar(col, row, color, 0, count, 32, 1);
}

export function ClearBottomLine() {
  PrintSpaces(0, 24, 0, 40);
}

export function DisplayString(col: number, row: number, color: number, source: string) {
  DisplayStringOn(col, row, color, 0, source);
}

export function DisplayStringOn(col: number, row: number, fg: number, bg: number, source: string) {
  let n: number = 0, i: number = 0;
  if ((col > 39) || (row > 24)) {
    return;
  }
  n = source.length;
  for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    RenderChar(col, row, fg, bg, 1, rt.chAt(source, i), 1);
    col = (col + 1) & 255;
  }
}

export function DisplayCentered(left: number, right: number, row: number, color: number, s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let width: number = 0;
  width = ((right - left) + 1) & 255;
  if (U8[$f0] > width) {
    U8[$f0] = width;
  }
  DisplayString(left + Math.trunc((width - U8[$f0]) / 2), row, color, rS($f0));
  S.sp = $sp;
}

export async function DisplayMessageWindow(ulCol: number, ulRow: number, lrCol: number, lrRow: number, color: number, clearFirst: boolean, source: string) {
  let len: number = 0, width: number = 0, idx: number = 0, lineEnd: number = 0;
  async function PrintCharInWindow() {
    while ((idx <= lineEnd) && (U8[143769] <= lrCol)) {
      RenderChar(U8[143769], U8[143770], color, 0, 1, rt.chAt(source, idx), 1);
      if (U8[141225] !== 0) {
        (await Crt.Delay(U8[141163] * 10));
      }
      idx = (idx + 1) << 16 >> 16;
      U8[143769] = U8[143769] + 1;
    }
  }
  function FindNewIndex() {
    while ((idx < len) && (rt.chAt(source, idx) === 32)) {
      idx = (idx + 1) << 16 >> 16;
    }
  }
  if ((((ulCol > lrCol) || (ulRow > lrRow)) || (lrCol > 39)) || (lrRow > 24)) {
    return;
  }
  if ((((U8[143769] < ulCol) || (U8[143769] > lrCol)) || (U8[143770] < ulRow)) || (U8[143770] > lrRow)) {
    U8[143769] = ulCol;
    U8[143770] = ulRow;
  }
  if (clearFirst) {
    (await ClearRect(ulCol, ulRow, lrCol, lrRow));
    U8[143769] = ulCol;
    U8[143770] = ulRow;
  }
  idx = 1;
  len = source.length;
  if (len === 0) {
    return;
  }
  width = ((lrCol - ulCol) + 1) & 255;
  do {
    lineEnd = idx;
    while ((lineEnd < len) && rt.inM(226101, 4, 4, rt.chAt(source, lineEnd))) {
      lineEnd = (lineEnd + 1) << 16 >> 16;
    }
    while (((lineEnd < len) && !rt.inM(226101, 4, 4, rt.chAt(source, lineEnd))) && (rt.chAt(source, lineEnd) !== 32)) {
      lineEnd = (lineEnd + 1) << 16 >> 16;
    }
    if (rt.chAt(source, lineEnd) !== 32) {
      while (((lineEnd + 1) < len) && rt.inM(226101, 4, 4, rt.chAt(source, lineEnd + 1))) {
        lineEnd = (lineEnd + 1) << 16 >> 16;
      }
    }
    if ((U8[143769] <= lrCol) && (((lineEnd - idx) + (rt.chAt(source, lineEnd) !== 32 ? 1 : 0)) > width)) {
      lineEnd = ((idx + lrCol) - U8[143769]) << 16 >> 16;
    }
    if (((lineEnd - idx) + U8[143769]) > lrCol) {
      if ((((lineEnd - idx) + U8[143769]) === (lrCol + 1)) && (rt.chAt(source, lineEnd) === 32)) {
        lineEnd = (lineEnd - 1) << 16 >> 16;
        (await PrintCharInWindow());
      }
      U8[143769] = ulCol;
      U8[143770] = U8[143770] + 1;
      FindNewIndex();
      if ((U8[143770] > lrRow) && ((idx < len) || (rt.chAt(source, idx) !== 32))) {
        U8[143769] = ulCol;
        U8[143770] = ulRow;
        if ((U8[226089] !== 0)) {
          (await PauseOnly());
        } else {
          (await DisplayAndPause(13, "Press any key to continue"));
        }
        (await ClearRect(ulCol, ulRow, lrCol, lrRow));
        (await PrintCharInWindow());
      } else if (U8[143770] > lrRow) {
        return;
      }
    } else {
      (await PrintCharInWindow());
    }
  } while (!(idx > len));
  if (U8[143769] > lrCol) {
    U8[143769] = ulCol;
    U8[143770] = U8[143770] + 1;
  }
}

export async function ShowMessage(color: number, clearFirst: boolean, s: string) {
  (await DisplayMessageWindow(1, 17, 38, 22, color, clearFirst, s));
}

export async function ReadString(query: string, color: number, maxLen: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let col: number = 0, key: number = 0, $r0: string = "";
  ClearBottomLine();
  DisplayString(0, 24, color, query);
  col = query.length;
  wS($f0, 255, "");
  do {
    key = (await GameIo.ReadAnyKey()) & 255;
    const $c2 = key;
    if (($c2 >= 32 && $c2 <= 122)) {
      if (U8[$f0] < maxLen) {
        wS($f0, 255, rS($f0) + String.fromCharCode(key));
        DisplayString(col, 24, 15, String.fromCharCode(key));
        col = (col + 1) & 255;
      }
    } else if ($c2 === 8) {
      if (U8[$f0] > 0) {
        wS($f0, 255, rt.Copy(rS($f0), 1, U8[$f0] - 1));
        col = (col - 1) & 255;
        PrintSpaces(col, 24, 0, 1);
      }
    }
  } while (!((key === 13) || (key === 27)));
  ClearBottomLine();
  for (let $i3 = 1, $e3 = U8[$f0]; $i3 <= $e3; $i3++) {
    col = $i3;
    U8[$f0 + col] = rt.UpCase(U8[$f0 + col]);
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export async function ReadNumber(query: string, color: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let num: number = 0, code: number = 0, $r0: number = 0;
  do {
    wS($f0, 40, (await ReadString(query, color, 6)));
    num = rt.valI(rS($f0)) | 0; code = rt.valCode.v << 16 >> 16;
    if (code === 0) {
      if ((num > 65535) || (num < 0)) {
        code = 1;
      }
    }
  } while (!(code === 0));
  $r0 = num & 65535;
  S.sp = $sp;
  return $r0;
}

export async function DisplayAndPause(color: number, msg: string) {
  let key: number = 0;
  ClearBottomLine();
  DisplayString(0, 24, color, msg);
  key = (await GameIo.ReadAnyKey()) & 255;
  w16(226090, r16(226090) + 1);
}

export async function TickCount() {
  let now: number = 0, again: number = 0, $r0: number = 0;
  (await Crt.Delay(1));
  again = biosTicks() | 0;
  do {
    now = again;
    again = biosTicks() | 0;
  } while (!(now === again));
  $r0 = now;
  return $r0;
}

export async function GetTicks() {
  let now: number = 0, $r0: number = 0;
  now = (await TickCount()) | 0;
  $r0 = ((Math.trunc(now / 10000) * 54925) + Math.trunc(rt.mul(now % 10000, 54925) / 10000)) | 0;
  return $r0;
}

export async function ClearScreen() {
  (await rt.FT[r32(141083)]());
  Border.ForgetJoin();
}

export async function PrintAndPause(msg: string, color: number) {
  ClearBottomLine();
  DisplayString(0, 24, color, msg);
  (await PauseOnly());
  ClearBottomLine();
}

export async function PauseOnly() {
  if ((U8[141212] !== 0)) {
    (await PauseTicks(Math.trunc((U8[141163] * 45) / 2)));
  } else {
    (await Crt.Delay(U8[141163] * 225));
  }
  w16(226090, r16(226090) + 1);
}

export async function PauseTicks(hundredths: number) {
  let start: number = 0, now: number = 0;
  start = (await GetTicks()) | 0;
  do {
    now = (await GetTicks()) | 0;
  } while (!((((now - start) >= hundredths) || (now < start)) || (await GameIo.DemoEnding())));
}

export async function DelayOrKey(seconds: number) {
  let start: number = 0, deadline: number = 0, now: number = 0;
  start = (await GetTicks()) | 0;
  deadline = (start + (100 * seconds)) | 0;
  do {
    now = (await GetTicks()) | 0;
  } while (!(((now >= deadline) || (now < start)) || (await Crt.KeyPressed())));
}

export async function FlashBottomLine(color: number, msg: string) {
  let key: number = 0;
  ClearBottomLine();
  DisplayString(0, 24, color, msg);
  (await DelayOrKey(2));
  if ((await Crt.KeyPressed())) {
    key = (await GameIo.ReadAnyKey()) & 255;
  }
  ClearBottomLine();
}

export async function ClearRect(ulCol: number, ulRow: number, lrCol: number, lrRow: number) {
  if ((((((ulCol < 0) || (ulRow < 0)) || (ulCol > lrCol)) || (ulRow > lrRow)) || (lrCol > 39)) || (lrRow > 24)) {
    return;
  }
  (await rt.FT[r32(141079)](ulCol, ulRow, lrCol, lrRow));
}

export function biosTicks() {
  let $r0: number = 0;
  $r0 = Host.BiosTicks() | 0;
  return $r0;
}

export function $init() {
  U8[226089] = false ? 1 : 0;
  w16(226090, 0);
}
