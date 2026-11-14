// Generated from src/keyhelp.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as C_KEYS from './c_keys';
import * as C_SOUND from './c_sound';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';

export const SHOW_ALWAYS = 0;
export const SHOW_QUICK = 1;
export const SHOW_COMPANION = 2;
export const SHOW_STING = 3;
export const SHOW_SOUND = 4;
export const SHOW_LOG = 5;
export const SHOW_TRAIN = 6;
export const KEY_LINES = 19;
export const LEFT_COL = 1;
export const RIGHT_COL = 38;
export const TITLE_ROW = 1;
export const LIST_TOP = 3;
export const BOTTOM_ROW = 23;
export const FIRST_ROW = 4;
export const LIST_ROWS = 19;
export const KEY_COL = 2;
export const TITLE_COLOR = 15;
export const KEY_COLOR = 15;
export const LINE_COLOR = 10;

export const $at = { KEYS: 261137 };

export function LineShown(n: number, quickKeys: boolean) {
  let $r0: boolean = false;
  switch (U8[n * 34 + 261136]) {
    case 1: {
      $r0 = quickKeys;
      break;
    }
    case 2: {
      $r0 = U8[227084] !== 0;
      break;
    }
    case 3: {
      $r0 = (U8[227094] !== 0);
      break;
    }
    case 4: {
      $r0 = U8[227026] !== 2;
      break;
    }
    case 5: {
      $r0 = U8[227091] !== 0;
      break;
    }
    case 6: {
      $r0 = U8[227075] !== 0;
      break;
    }
    default: {
      $r0 = true;
    }
  }
  return $r0;
}

export function GroupGaps(quickKeys: boolean) {
  let n: number = 0, rows: number = 0, group: number = 0, $r0: boolean = false;
  rows = 0;
  group = 32;
  for (let $i1 = 1; $i1 <= 19; $i1++) {
    n = $i1;
    if (LineShown(n, quickKeys)) {
      if ((group !== 32) && (KeyGroup(n) !== group)) {
        rows = (rows + 1) & 255;
      }
      group = KeyGroup(n) & 255;
      rows = (rows + 1) & 255;
    }
  }
  $r0 = rows <= 19;
  return $r0;
}

export function KeyGroup(n: number) {
  let $r0: number = 0;
  let $t1;
  if (($t1 = U8[n * 34 + 261104], $t1 === 65 || $t1 === 67)) {
    $r0 = U8[n * 34 + 261104];
  } else {
    $r0 = 70;
  }
  return $r0;
}

export async function ShowKeys(quickKeys: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let n: number = 0, row: number = 0, group: number = 0, ch: number = 0, savedChoice: number = 0, gaps: boolean = false;
  savedChoice = U8[231529];
  gaps = GroupGaps(quickKeys);
  Border.ClearBox(0, 0, 39, 23);
  (await Border.DrawBorder(1, 3, 38, 23, 0));
  (await Border.DrawBorder(1, 1, 38, 1, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, "Command Keys");
  row = 4;
  group = 32;
  for (let $i1 = 1; $i1 <= 19; $i1++) {
    n = $i1;
    if (LineShown(n, quickKeys)) {
      if ((gaps && (group !== 32)) && (KeyGroup(n) !== group)) {
        row = (row + 1) & 255;
      }
      group = KeyGroup(n) & 255;
      TextRend.DisplayString(2, row, 15, rS(n * 34 + 261103));
      TextRend.DisplayString(2 + U8[n * 34 + 261103], row, 10, rS(n * 34 + 261111));
      row = (row + 1) & 255;
    }
  }
  do {
    U8[235296] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("Help: ", "Exit", 13, 10, 15, false, false, $f0)) & 255;
  } while (!(!(U8[$f0] !== 0) && (ch === 0 || ch === 69)));
  TextRend.ClearBottomLine();
  U8[231529] = savedChoice;
  S.sp = $sp;
}
