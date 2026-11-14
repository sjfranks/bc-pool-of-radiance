// Generated from src/logwrap.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as CbtLog from './cbtlog';

export const WRAP_LINES = 12;
export const WRAP_LEN = 80;
export const COLOR_MARK = 1;

export function WrapEntry(entry: string, width: number, lines: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let n: number = 0, lineShown: number = 0, wordShown: number = 0, wordColor: number = 0, color: number = 0, i: number = 0, ch: number = 0, $r0: number = 0;
  function StartLine(c: number) {
    n = (n + 1) & 255;
    if (n <= 12) {
      if (c !== 0) {
        wS(lines + n * 81 - 81, 80, "\x01" + String.fromCharCode(c));
      } else {
        wS(lines + n * 81 - 81, 80, "");
      }
    }
    lineShown = 0;
  }
  function Put(s: string) {
    if (((n >= 1) && (n <= 12)) && ((U8[lines + n * 81 - 81] + s.length) <= 80)) {
      wS(lines + n * 81 - 81, 80, rS(lines + n * 81 - 81) + s);
    }
  }
  function EndWord() {
    let j: number = 0, c: number = 0, shown: number = 0;
    if (wordShown === 0) {
      return;
    }
    if ((lineShown > 0) && (((lineShown + 1) + wordShown) <= width)) {
      Put(" ");
      lineShown = (lineShown + 1) & 255;
    } else if (lineShown > 0) {
      StartLine(wordColor);
    }
    if (wordShown <= (width - lineShown)) {
      Put(rS($f0));
      lineShown = (lineShown + wordShown) & 255;
    } else {
      j = 1;
      shown = 0;
      while (j <= U8[$f0]) {
        c = U8[$f0 + j];
        if (c === 1) {
          if (j < U8[$f0]) {
            Put("\x01" + String.fromCharCode(U8[$f0 + (j + 1)]));
            wordColor = U8[$f0 + (j + 1)];
          }
          j = (j + 2) << 16 >> 16;
        } else {
          if (lineShown >= width) {
            StartLine(wordColor);
          }
          Put(String.fromCharCode(c));
          lineShown = (lineShown + 1) & 255;
          j = (j + 1) << 16 >> 16;
        }
      }
    }
    wS($f0, 255, "");
    wordShown = 0;
  }
  n = 0;
  if (width === 0) {
    $r0 = 0;
    { S.sp = $sp; return $r0; }
  }
  color = 0;
  wS($f0, 255, "");
  wordShown = 0;
  wordColor = 0;
  StartLine(0);
  i = 1;
  while (i <= entry.length) {
    ch = rt.chAt(entry, i);
    if (ch === 1) {
      if (i < entry.length) {
        color = rt.chAt(entry, i + 1);
        if (wordShown === 0) {
          wS($f0, 255, "\x01" + String.fromCharCode(color));
          wordColor = color;
        } else {
          wS($f0, 255, rS($f0) + "\x01" + String.fromCharCode(color));
        }
      }
      i = (i + 2) << 16 >> 16;
    } else {
      if (ch === 32) {
        EndWord();
      } else {
        if (wordShown === 0) {
          wordColor = color;
        }
        wS($f0, 255, rS($f0) + String.fromCharCode(ch));
        wordShown = (wordShown + 1) & 255;
      }
      i = (i + 1) << 16 >> 16;
    }
  }
  EndWord();
  if (n > 12) {
    n = 12;
  }
  $r0 = n;
  S.sp = $sp;
  return $r0;
}
