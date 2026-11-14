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

export const $at = { EGA_RGB: 226109, vgaMem: 65793 };

export function Install() {
  wS(141029, 20, "VGA");
  U8[141050] = 16;
  U8[141051] = true ? 1 : 0;
  U8[141052] = true ? 1 : 0;
  U8[141053] = 3;
  U8[141054] = 3;
  U8[141055] = 3;
  w32(141056, 2);
  U8[141060] = 19;
  w16(141061, 0);
  w32(141063, 3);
  w32(141067, 4);
  w32(141071, 5);
  w32(141075, 6);
  w32(141079, 7);
  w32(141083, 8);
  w32(141087, 9);
  w32(141091, 10);
  w32(141095, 11);
  w32(141099, 12);
  w32(141103, 13);
  w32(141107, 14);
  w32(141111, 15);
  w32(141115, 16);
}

export function SetPalette(registerIndex: number, color: number) {
  mv(registerIndex * 3 + 129793, (color & 15) * 3 + 226109, 3);
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
    if (U8[row + 141257] !== 0) {
      mv(((r16((row + 8) * 2 + 142833) + r16(row * 2 + 141425)) + 8) + 65793, r32(141249) + r16(row * 2 + 141761) + 27, (r16(row * 2 + 142097) - r16(row * 2 + 141761)) + 1);
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
      mv((r16(row * 2 + 142833) + (screenX * 8)) + 65793, $w1 + srcOff + 27, rowBytes);
      srcOff = (srcOff + rowBytes) & 65535;
    }
  }
}

export function DrawGlyph(col: number, row: number, fg: number, bg: number, glyph: number) {
  let dstOff: number = 0, r: number = 0, k: number = 0, bits: number = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    r = $i1;
    dstOff = (r16(((row * 8) + r) * 2 + 142833) + (col * 8)) & 65535;
    bits = U8[r32(143765) + glyph * 8 + r];
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      if ((bits & (128 >>> k)) !== 0) {
        U8[(dstOff + k) + 65793] = fg;
      } else {
        U8[(dstOff + k) + 65793] = bg;
      }
    }
  }
}

export function ClearRect(ulCol: number, ulRow: number, lrCol: number, lrRow: number) {
  let y: number = 0;
  for (let $i1 = ulRow * 8, $e1 = (lrRow * 8) + 7; $i1 <= $e1; $i1++) {
    y = $i1;
    rt.fill((r16(y * 2 + 142833) + (ulCol * 8)) + 65793, ((lrCol - ulCol) + 1) * 8, 0);
  }
}

export function ClearScreen() {
  rt.fill(65793, 64000, 0);
}

export function WriteChar(col: number, row: number, attr: number, count: number, ch: number) {
  DaxIo.BiosWriteChar(U8[141246], col, row, attr, count, ch);
}

export function CellFill(color: number, colorMap: number, cell: number) {
  rt.fill(cell, 8, color);
}
