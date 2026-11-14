// Generated from src/wilds.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_ECL from './c_ecl';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Border from './border';
import * as MapTiles from './maptiles';
import * as TextRend from './textrend';
import * as WideView from './wideview';

export const STEP_OPEN = 0;
export const STEP_BLOCKED = 1;
export const STEP_RIVER = 2;
export const STEP_CORNER = 3;
export const STEP_HOURS = 12;
export const DIAGONAL_HOURS = 18;
export const WILD_SILVER_DRAGON_DEN = 1;
export const WILD_ZHENTIL_OUTPOST = 2;
export const WILD_BUCCANEERS_BASE = 3;
export const WILD_NOMAD_CAMP = 4;
export const WILD_KOBOLD_CAVES = 5;
export const WILD_UNNAMED_SITE = 6;
export const WILD_LIZARD_MAN_KEEP = 7;
export const WILD_SORCERERS_ISLAND = 8;
export const WILD_PHLAN = 9;
export const WILD_LAST_SITE = 9;

export const $at = { wideWanted: 248550, wideShown: 248551 };

export async function BuildWildernessMap(ulX: number, ulY: number, viewLast: number) {
  let viewX: number = 0, viewY: number = 0, k: number = 0, mapX: number = 0, mapY: number = 0, icon: number = 0, col: number = 0, row: number = 0;
  ulX = ViewCorner(ulX, 43, viewLast) << 16 >> 16;
  ulY = ViewCorner(ulY, 35, 4) << 16 >> 16;
  viewY = 0;
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    row = $i1;
    viewX = 0;
    for (let $i2 = 0, $e2 = viewLast; $i2 <= $e2; $i2++) {
      col = $i2;
      mapX = (col + ulX) << 24 >> 24;
      mapY = (row + ulY) << 24 >> 24;
      icon = (U8[mapY * 44 + mapX + 224470] - 1) & 255;
      for (let $i3 = 1; $i3 <= 9; $i3++) {
        k = $i3;
        if ((mapX === r16(k * 6 + 248546)) && (mapY === r16(k * 6 + 248548))) {
          switch (k) {
            case 3: {
              if (r16(r32(227033) + 792) !== 255) {
                icon = (r16(k * 6 + 248550) - 1) & 255;
              }
              break;
            }
            case 4: {
              if (((r16(r32(227033) + 932) !== 0) || ((r16(r32(227033) + 760) & 8) !== 0)) || (r16(r32(227033) + 830) === 0)) {
                icon = (r16(k * 6 + 248550) - 1) & 255;
              }
              break;
            }
            case 5: {
              if ((r16(r32(227033) + 832) & 2) === 0) {
                icon = (r16(k * 6 + 248550) - 1) & 255;
              }
              break;
            }
            case 6: {
              icon = (r16(k * 6 + 248550) - 1) & 255;
              break;
            }
            case 7: {
              if ((r16(r32(227033) + 832) & 1) === 0) {
                icon = (r16(k * 6 + 248550) - 1) & 255;
              }
              break;
            }
            case 8: case 9: {
              if (r16(r32(227033) + 870) > 253) {
                icon = (r16(k * 6 + 248550) - 1) & 255;
              }
              break;
            }
          }
        }
      }
      (await MapTiles.Copy2DTileClipped(viewX, viewY, icon));
      viewX = (viewX + 3) << 24 >> 24;
    }
    viewY = (viewY + 3) << 24 >> 24;
  }
}

export function ViewCorner(ul: number, last: number, viewLast: number) {
  let $r0: number = 0;
  if (ul > (last - viewLast)) {
    ul = (last - viewLast) << 16 >> 16;
  }
  if (ul < 0) {
    ul = 0;
  }
  $r0 = ul;
  return $r0;
}

export function CenteredCorner(cell: number, last: number, viewLast: number) {
  let $r0: number = 0;
  $r0 = ViewCorner(cell - Math.trunc(viewLast / 2), last, viewLast) << 16 >> 16;
  return $r0;
}

export function ViewLast() {
  let $r0: number = 0;
  if ((U8[248551] !== 0)) {
    $r0 = 12;
  } else {
    $r0 = 4;
  }
  return $r0;
}

export async function DrawWildWindows() {
  (await Border.DrawWindow(1, 17, 38, 22, 0, 0, ""));
  (await DrawTopWindows());
}

export async function DrawTopWindows() {
  if ((U8[248551] !== 0)) {
    Border.ClearBox(0, 0, 39, 16);
    (await Border.DrawWindow(1, 1, 38, 15, 0, 0, ""));
  } else {
    (await Border.DrawWindow(1, 1, 15, 15, 0, 0, ""));
    (await Border.DrawWindow(17, 1, 38, 15, 0, 0, ""));
  }
}

export async function ShowWide(wide: boolean) {
  if (wide === (U8[248551] !== 0)) {
    return;
  }
  if (wide) {
    (await MapTiles.LoadSecondSheet());
    U8[248551] = (await WideView.Enter(120, 38)) ? 1 : 0;
    if (!(U8[248551] !== 0)) {
      U8[248550] = false ? 1 : 0;
    }
  } else {
    (await WideView.Leave());
    U8[248551] = false ? 1 : 0;
  }
}

export function KeepsWide(opcode: number) {
  let $r0: boolean = false;
  switch (opcode) {
    case 0: case 1: case 2: case 19: case 37: case 38: case 3: case 20: case 22: case 23: case 24: case 25:
    case 26: case 27: case 4: case 5: case 6: case 7: case 8: case 9: case 47: case 48: case 42: case 53:
    case 30: case 29: case 35: case 34: case 50: case 59: case 28: case 52: case 17: case 18: case 51: case 14:
    case 49: case 45: {
      $r0 = true;
      break;
    }
    default: {
      $r0 = false;
    }
  }
  return $r0;
}

export function TileStep(tile: number, riverShut: boolean) {
  let $r0: number = 0;
  switch (tile) {
    case 78: case 126: case 127: case 128: case 130: case 131: case 132: case 168: case 169: case 170: case 171: case 172:
    case 174: case 175: case 176: case 177: case 178: case 179: case 188: case 221: case 222: case 225: case 226: case 227:
    case 228: case 229: case 230: case 231: case 232: case 233: case 245: {
      $r0 = 1;
      break;
    }
    case 102: case 103: case 104: case 105: case 106: case 107: case 108: case 114: {
      if (riverShut) {
        $r0 = 2;
      } else {
        $r0 = 0;
      }
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function StepTo(x: number, y: number, dir: number, colOfs: number, riverShut: boolean, nx: number, ny: number) {
  let meets: number = 0, $r0: number = 0;
  U8[nx] = x + I8[dir + 218813];
  U8[ny] = y + I8[dir + 218822];
  if (I8[nx] < 0) {
    U8[nx] = 0;
  }
  if (I8[nx] > 15) {
    U8[nx] = 15;
  }
  if (I8[ny] < 0) {
    U8[ny] = 0;
  }
  if (I8[ny] > 35) {
    U8[ny] = 35;
  }
  meets = TileStep(U8[I8[ny] * 44 + (I8[nx] + colOfs) + 224470], riverShut) & 255;
  if (((((meets === 0) && (I8[nx] !== x)) && (I8[ny] !== y)) && (TileStep(U8[y * 44 + (I8[nx] + colOfs) + 224470], riverShut) !== 0)) && (TileStep(U8[I8[ny] * 44 + (x + colOfs) + 224470], riverShut) !== 0)) {
    meets = 3;
  }
  $r0 = meets;
  return $r0;
}

export function $init() {
  U8[248550] = false ? 1 : 0;
  U8[248551] = false ? 1 : 0;
}
