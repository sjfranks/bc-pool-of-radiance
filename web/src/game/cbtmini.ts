// Generated from src/cbtmini.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Types from './types';
import * as C_IFC from './c_ifc';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Pathing from './pathing';
import * as Blit from './blit';
import * as VidOps from './vidops';
import * as CbtMap from './cbtmap';

export const FIRST_COL = 24;
export const LAST_COL = 36;
export const FIRST_ROW = 15;
export const LAST_ROW = 21;
export const CELL_PX = 2;
export const MAP_WIDTH = 100;
export const MAP_HEIGHT = 50;
export const LEFT_PX = 2;
export const TOP_PX = 3;
export const FLOOR_COLOR = 0;
export const WALL_COLOR = 1;
export const PARTY_COLOR = 11;
export const ENEMY_COLOR = 14;
export const DOWN_COLOR = 12;
export const CURRENT_COLOR = 15;
export const CURSOR_COLOR = 13;
export const NO_CURSOR = -1;
export const WALL_COST = 255;

export function Build(grid: number, current: number, cursorX: number, cursorY: number) {
  let x: number = 0, y: number = 0, t: number = 0, i: number = 0, pass: number = 0, p: number = 0;
  for (let $i1 = 0; $i1 <= 24; $i1++) {
    y = $i1;
    for (let $i2 = 0; $i2 <= 49; $i2++) {
      x = $i2;
      t = U8[r32(230527) + y * 50 + x + 7];
      if ((t > 0) && (U8[t * 3 + 218828] === 255)) {
        U8[grid + y * 50 + x] = 1;
      } else {
        U8[grid + y * 50 + x] = 0;
      }
    }
  }
  for (let $i3 = 0; $i3 <= 1; $i3++) {
    pass = $i3;
    for (let $i4 = 1, $e4 = Pathing.LastSlot(); $i4 <= $e4; $i4++) {
      i = $i4;
      p = r32(i * 4 + 230178);
      if (((U8[i * 4 + 229893] > 0) && (p !== 0)) && ((U8[p + 269] !== 0 ? 1 : 0) === pass)) {
        if (p === current) {
          PutCreature(grid, i, 15);
        } else if (U8[p + 269] === 0) {
          PutCreature(grid, i, 12);
        } else if (I8[p + 270] === 1) {
          PutCreature(grid, i, 14);
        } else {
          PutCreature(grid, i, 11);
        }
      }
    }
  }
  if (Pathing.OnArena(cursorX, cursorY)) {
    U8[grid + cursorY * 50 + cursorX] = 13;
  }
}

export function PixelColor(grid: number, px: number, py: number) {
  let $r0: number = 0;
  if ((((px < 2) || (px >= 102)) || (py < 3)) || (py >= 53)) {
    $r0 = 0;
  } else {
    $r0 = U8[grid + Math.trunc((py - 3) / 2) * 50 + Math.trunc((px - 2) / 2)];
  }
  return $r0;
}

export async function Show(current: number, cursorX: number, cursorY: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  let grid: number = 0, col: number = 0, row: number = 0, x: number = 0, y: number = 0;
  if ((((U8[227082] === 0) || (U8[227062] !== 5)) || (r32(230527) === 0)) || (U8[235217] !== 0)) {
    { S.sp = $sp; return; }
  }
  if (16777216 < ((1250 + (Blit.FrameBytes(8, 1) | 0)) + 1024)) {
    { S.sp = $sp; return; }
  }
  grid = rt.getMem(1250);
  (await Blit.AllocPic(8, 1, 1, 0, $f0));
  Build(grid, current, cursorX, cursorY);
  for (let $i1 = 15; $i1 <= 21; $i1++) {
    row = $i1;
    for (let $i2 = 24; $i2 <= 36; $i2++) {
      col = $i2;
      for (let $i3 = 0; $i3 <= 7; $i3++) {
        y = $i3;
        for (let $i4 = 0; $i4 <= 7; $i4++) {
          x = $i4;
          U8[$f0 + x + 4] = PixelColor(grid, ((col - 24) * 8) + x, ((row - 15) * 8) + y);
        }
        VidOps.PutPixelRow(r32($f0), 0, y, $f0 + 4);
      }
      Blit.ShowPic(col, row, r32($f0));
    }
  }
  Blit.FreePic($f0);
  rt.freeMem(grid);
  S.sp = $sp;
}

export function PutCreature(grid: number, i: number, color: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let k: number = 0, x: number = 0, y: number = 0;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    k = $i1;
    if (Pathing.GetIconTileDelta(U8[i * 4 + 229893], k, $f0, $f0 + 1)) {
      x = (I8[i * 4 + 229890] + I8[$f0]) << 24 >> 24;
      y = (I8[i * 4 + 229891] + I8[$f0 + 1]) << 24 >> 24;
      if (Pathing.OnArena(x, y)) {
        U8[grid + y * 50 + x] = color;
      }
    }
  }
  S.sp = $sp;
}
