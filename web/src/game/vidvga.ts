// Generated from src/vidvga.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_VIDEO from './c_video';
import * as GameVars from './gamevars';
import * as DaxIo from './daxio';
import * as PicVga from './picvga';
import * as Host from './host';

export const DAC_WRITE_INDEX = 968;
export const DAC_DATA = 969;

export const $at = { EGA_RGB: 234435, vgaMem: 151679 };

export function Install() {
  wS(226915, 20, "VGA");
  U8[226936] = 16;
  U8[226937] = true ? 1 : 0;
  U8[226938] = true ? 1 : 0;
  U8[226939] = 3;
  U8[226940] = 3;
  U8[226941] = 3;
  w32(226942, 3);
  U8[226946] = 19;
  w16(226947, 0);
  w32(226949, 4);
  w32(226953, 5);
  w32(226957, 6);
  w32(226961, 7);
  w32(226965, 8);
  w32(226969, 9);
  w32(226973, 10);
  w32(226977, 11);
  w32(226981, 12);
  w32(226985, 13);
  w32(226989, 14);
  w32(226993, 15);
  w32(226997, 16);
  w32(227001, 17);
}

export function SetPalette(registerIndex: number, color: number) {
  mv(registerIndex * 3 + 215679, (color & 15) * 3 + 234435, 3);
}

export function Start() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 15; $i1++) {
    i = $i1;
    SetPalette(i, i);
  }
}

export function FlushSpans() {
  let row: number = 0;
  for (let $i1 = 0; $i1 <= 167; $i1++) {
    row = $i1;
    if (U8[row + 227143] !== 0) {
      mv(((r16((row + 8) * 2 + 228719) + r16(row * 2 + 227311)) + 8) + 151679, r32(227135) + r16(row * 2 + 227647) + 27, (r16(row * 2 + 227983) - r16(row * 2 + 227647)) + 1);
    }
  }
}

export function ShowPic(screenX: number, screenY: number, pic: number) {
  let row: number = 0, rowBytes: number = 0, srcOff: number = 0;
  {
    const $w1 = pic;
    rowBytes = (r16($w1 + 2) * 8) & 65535;
    srcOff = 0;
    for (let $i2 = screenY * 8, $e2 = ((screenY * 8) + r16($w1)) - 1; $i2 <= $e2; $i2++) {
      row = $i2;
      mv((r16(row * 2 + 228719) + (screenX * 8)) + 151679, $w1 + srcOff + 27, rowBytes);
      srcOff = (srcOff + rowBytes) & 65535;
    }
  }
}

export function DrawGlyph(col: number, row: number, fg: number, bg: number, glyph: number) {
  let dstOff: number = 0, r: number = 0, k: number = 0, bits: number = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    r = $i1;
    dstOff = (r16(((row * 8) + r) * 2 + 228719) + (col * 8)) & 65535;
    bits = U8[r32(229651) + glyph * 8 + r];
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      if ((bits & (128 >>> k)) !== 0) {
        U8[(dstOff + k) + 151679] = fg;
      } else {
        U8[(dstOff + k) + 151679] = bg;
      }
    }
  }
}

export function ClearRect(ulCol: number, ulRow: number, lrCol: number, lrRow: number) {
  let y: number = 0;
  for (let $i1 = ulRow * 8, $e1 = (lrRow * 8) + 7; $i1 <= $e1; $i1++) {
    y = $i1;
    rt.fill((r16(y * 2 + 228719) + (ulCol * 8)) + 151679, ((lrCol - ulCol) + 1) * 8, 0);
  }
}

export function ClearScreen() {
  rt.fill(151679, 64000, 0);
}

export function WriteChar(col: number, row: number, attr: number, count: number, ch: number) {
  DaxIo.BiosWriteChar(U8[227132], col, row, attr, count, ch);
}

export function CellFill(color: number, colorMap: number, cell: number) {
  rt.fill(cell, 8, color);
}
