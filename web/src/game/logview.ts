// Generated from src/logview.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_KEYS from './c_keys';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as CbtLog from './cbtlog';
import * as LogWrap from './logwrap';

export const FRAME_LEFT = 1;
export const FRAME_RIGHT = 38;
export const TOP_ROW = 1;
export const BOTTOM_ROW = 22;
export const FIRST_ROW = 3;
export const LEFT_COL = 2;
export const RIGHT_COL = 38;
export const WIDTH = 37;
export const PAGE_ROWS = 20;
export const TITLE_COLOR = 15;

export const $at = { lineCounts: 258808, total: 258869, top_: 258871 };

export async function ShowLog(title: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1229);
  let n: number = 0, ch: number = 0, savedChoice: number = 0;
  savedChoice = U8[231529];
  w16(258869, 0);
  for (let $i1 = 1, $e1 = CbtLog.Count(); $i1 <= $e1; $i1++) {
    n = $i1;
    CbtLog.Entry(n, $f0);
    U8[n + 258807] = LogWrap.WrapEntry(rS($f0), 37, $f0 + 256);
    w16(258869, ri16(258869) + U8[n + 258807]);
  }
  Border.ClearBox(0, 0, 39, 24);
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, title);
  w16(258871, (ri16(258869) - 20) + 1);
  if (ri16(258871) < 1) {
    w16(258871, 1);
  }
  DrawPage();
  U8[231529] = 1;
  do {
    ch = (await MenuCore.MenuHorizontal("Messages: ", "Up Down Top eNd Exit", 13, 10, 15, true, false, $f0 + 1228)) & 255;
    if ((U8[$f0 + 1228] !== 0)) {
      switch (ch) {
        case 72: {
          ScrollTo(ri16(258871) - 1);
          break;
        }
        case 80: {
          ScrollTo(ri16(258871) + 1);
          break;
        }
        case 73: {
          ScrollTo(ri16(258871) - 20);
          break;
        }
        case 81: {
          ScrollTo(ri16(258871) + 20);
          break;
        }
        case 71: {
          ScrollTo(1);
          break;
        }
        case 79: {
          ScrollTo(ri16(258869));
          break;
        }
      }
    } else {
      switch (ch) {
        case 85: {
          ScrollTo(ri16(258871) - 1);
          break;
        }
        case 68: {
          ScrollTo(ri16(258871) + 1);
          break;
        }
        case 84: {
          ScrollTo(1);
          break;
        }
        case 78: {
          ScrollTo(ri16(258869));
          break;
        }
      }
    }
  } while (!(!(U8[$f0 + 1228] !== 0) && (ch === 0 || ch === 69)));
  U8[231529] = savedChoice;
  S.sp = $sp;
}

export function DrawLine(row: number, line: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let i: number = 0, col: number = 0, color: number = 0;
  col = 2;
  color = 10;
  wS($f0, 40, "");
  i = 1;
  while (i <= line.length) {
    if (rt.chAt(line, i) === 1) {
      if (rS($f0) !== "") {
        TextRend.DisplayString(col, row, color, rS($f0));
        col = (col + U8[$f0]) & 255;
        wS($f0, 40, "");
      }
      if (i < line.length) {
        color = rt.chAt(line, i + 1);
      }
      i = (i + 2) & 255;
    } else {
      wS($f0, 40, rS($f0) + String.fromCharCode(rt.chAt(line, i)));
      i = (i + 1) & 255;
    }
  }
  if (rS($f0) !== "") {
    TextRend.DisplayString(col, row, color, rS($f0));
  }
  S.sp = $sp;
}

export function DrawPage() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1228);
  let n: number = 0, first: number = 0, i: number = 0, count: number = 0;
  Border.ClearBox(2, 3, 38, 22);
  first = 1;
  for (let $i1 = 1, $e1 = CbtLog.Count(); $i1 <= $e1; $i1++) {
    n = $i1;
    if (((first + U8[n + 258807]) > ri16(258871)) && (first < (ri16(258871) + 20))) {
      CbtLog.Entry(n, $f0);
      count = LogWrap.WrapEntry(rS($f0), 37, $f0 + 256) & 255;
      for (let $i2 = 1, $e2 = count; $i2 <= $e2; $i2++) {
        i = $i2;
        if ((((first + i) - 1) >= ri16(258871)) && (((first + i) - 1) < (ri16(258871) + 20))) {
          DrawLine((((3 + first) + i) - 1) - ri16(258871), rS($f0 + i * 81 + 175));
        }
      }
    }
    first = (first + U8[n + 258807]) << 16 >> 16;
  }
  S.sp = $sp;
}

export function ScrollTo(t: number) {
  if (t > ((ri16(258869) - 20) + 1)) {
    t = ((ri16(258869) - 20) + 1) << 16 >> 16;
  }
  if (t < 1) {
    t = 1;
  }
  if (t !== ri16(258871)) {
    w16(258871, t);
    DrawPage();
  }
}
