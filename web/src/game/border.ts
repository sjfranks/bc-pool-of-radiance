// Generated from src/border.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as TextRend from './textrend';
import * as Sym8x8 from './sym8x8';

export const BORDER_SYM_BASE = 276;
export const LAST_COL = 39;
export const LAST_ROW = 24;
export const JOIN_COL = 16;
export const JOIN_ROW = 16;

export const $at = { joinCorner: 226100 };

export async function DrawBorder(ulCol: number, ulRow: number, lrCol: number, lrRow: number, corner: number) {
  let i: number = 0, symBase: number = 0;
  ulCol = (ulCol - 1) << 24 >> 24;
  ulRow = (ulRow - 1) << 24 >> 24;
  lrCol = (lrCol + 1) << 24 >> 24;
  lrRow = (lrRow + 1) << 24 >> 24;
  symBase = (corner * 3) + 276;
  (await Sym8x8.Put8x8Sym(ulCol, ulRow, symBase + 0, false, false));
  (await Sym8x8.Put8x8Sym(lrCol, ulRow, symBase + 0, false, false));
  (await Sym8x8.Put8x8Sym(ulCol, lrRow, symBase + 0, false, false));
  (await Sym8x8.Put8x8Sym(lrCol, lrRow, symBase + 0, false, false));
  for (let $i1 = ulCol + 1, $e1 = lrCol - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    (await Sym8x8.Put8x8Sym(i, ulRow, symBase + 2, false, false));
    (await Sym8x8.Put8x8Sym(i, lrRow, symBase + 2, false, false));
  }
  for (let $i2 = ulRow + 1, $e2 = lrRow - 1; $i2 <= $e2; $i2++) {
    i = $i2;
    (await Sym8x8.Put8x8Sym(ulCol, i, symBase + 1, false, false));
    (await Sym8x8.Put8x8Sym(lrCol, i, symBase + 1, false, false));
  }
  if (((ulCol === 16) || (lrCol === 16)) && ((ulRow === 16) || (lrRow === 16))) {
    U8[226100] = true ? 1 : 0;
  } else if ((U8[226100] !== 0) && (((((ulRow === 16) || (lrRow === 16)) && (ulCol < 16)) && (lrCol > 16)) || ((((ulCol === 16) || (lrCol === 16)) && (ulRow < 16)) && (lrRow > 16)))) {
    (await PutCorner(16, 16, corner));
  }
}

export async function ClearBox(ulCol: number, ulRow: number, lrCol: number, lrRow: number) {
  if (ulCol < 0) {
    ulCol = 0;
  }
  if (ulRow < 0) {
    ulRow = 0;
  }
  if (lrCol > 39) {
    lrCol = 39;
  }
  if (lrRow > 24) {
    lrRow = 24;
  }
  if ((((ulCol <= 16) && (lrCol >= 16)) && (ulRow <= 16)) && (lrRow >= 16)) {
    U8[226100] = false ? 1 : 0;
  }
  (await TextRend.ClearRect(ulCol, ulRow, lrCol, lrRow));
}

export async function DrawWindow(ulCol: number, ulRow: number, lrCol: number, lrRow: number, corner: number, color: number, title: string) {
  (await ClearBox(ulCol, ulRow, lrCol, lrRow));
  (await DrawBorder(ulCol, ulRow, lrCol, lrRow, corner));
  if (title.length !== 0) {
    TextRend.DisplayCentered(ulCol, lrCol - 1, ulRow, color, title);
  }
}

export async function PutCorner(col: number, row: number, corner: number) {
  (await Sym8x8.Put8x8Sym(col, row, (corner * 3) + 276, false, false));
}

export function ForgetJoin() {
  U8[226100] = false ? 1 : 0;
}
