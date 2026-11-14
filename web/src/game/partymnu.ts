// Generated from src/partymnu.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as C_KEYS from './c_keys';
import * as C_MSG from './c_msg';
import * as C_DEMO from './c_demo';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as MenuCore from './menucore';
import * as StrUtil from './strutil';
import * as TextRend from './textrend';

export const CMD_ADD = 0;
export const CMD_REMOVE = 1;
export const CMD_SAVE = 2;
export const CMD_LOAD = 3;
export const CMD_SETTINGS = 4;
export const CMD_BEGIN = 5;
export const CMD_CREATE = 6;
export const CMD_VIEW = 7;
export const CMD_MODIFY = 8;
export const CMD_DROP = 9;
export const CMD_TRAIN = 10;
export const CMD_DUAL = 11;
export const CMD_EXIT = 12;
export const CMD_LAST = 12;
export const MENU_TOP = 10;
export const LIST_TOP = 12;
export const LEFT_HEAD_COL = 2;
export const RIGHT_HEAD_COL = 20;
export const GAME_HEAD_ROW = 4;
export const ROSTER_ROW = 4;
export const LIST_LAST = 11;
export const LIST_KEYS = "C D M T V A R L S B G E J";

export const $at = { cmdKeys: 249141, cmdNames: 249155, cmdRows: 249389, cmdCols: 249402, leftCmds: 249415, listCmds: 249417, listNames: 249429 };

export function OfferedCmds(hasChar: boolean, atHall: boolean, inGame: boolean, anywhere: boolean, offered: number) {
  if (anywhere) {
    rt.wSet(offered, 0, 2, rt.setR(12, 12));
    if (hasChar) {
      rt.wSet(offered, 0, 2, rt.sUnion(rt.rSet(offered, 0, 2), rt.setR(10, 10, 7, 7, 11, 11)));
    }
    return;
  }
  rt.wSet(offered, 0, 2, rt.setR(6, 6, 0, 0, 4, 4, 12, 12));
  if (hasChar) {
    rt.wSet(offered, 0, 2, rt.sUnion(rt.rSet(offered, 0, 2), rt.setR(7, 7, 8, 8, 9, 9, 1, 1, 2, 2, 5, 5)));
    if (atHall) {
      rt.wSet(offered, 0, 2, rt.sUnion(rt.rSet(offered, 0, 2), rt.setR(10, 10)));
    }
    if (inGame) {
      rt.wSet(offered, 0, 2, rt.sUnion(rt.rSet(offered, 0, 2), rt.setR(11, 11)));
    }
  } else {
    rt.wSet(offered, 0, 2, rt.sUnion(rt.rSet(offered, 0, 2), rt.setR(3, 3)));
  }
}

export function ExitLeaves(offered: Uint8Array) {
  let $r0: boolean = false;
  $r0 = rt.inS(offered, 12) && !rt.inS(offered, 4);
  return $r0;
}

export function MenuTop(members: number) {
  let top_: number = 0, $r0: number = 0;
  top_ = ((4 + members) + 1) & 255;
  if (top_ < 10) {
    top_ = 10;
  }
  if ((top_ + U8[249394]) > 22) {
    top_ = (22 - U8[249394]) & 255;
  }
  $r0 = top_;
  return $r0;
}

export function CmdRow(cmd: number, top_: number) {
  let $r0: number = 0;
  $r0 = (top_ + U8[cmd + 249389]) & 255;
  return $r0;
}

export function StepCmd(offered: Uint8Array, cmd: number, step: number) {
  let n: number = 0, k: number = 0, $r0: number = 0;
  $r0 = cmd;
  n = cmd;
  for (let $i1 = 1; $i1 <= 12; $i1++) {
    k = $i1;
    n = ((((n + 12) + 1) + step) % 13) & 255;
    if (rt.inS(offered, n)) {
      $r0 = n;
      return $r0;
    }
  }
  return $r0;
}

export function OtherColumn(offered: Uint8Array, cmd: number, top_: number) {
  let c: number = 0, best: number = 0, dist: number = 0, row: number = 0, $r0: number = 0;
  $r0 = cmd;
  best = 32767;
  row = CmdRow(cmd, top_) << 16 >> 16;
  for (let $i1 = 0; $i1 <= 12; $i1++) {
    c = $i1;
    if (rt.inS(offered, c) && (rt.inM(249415, 0, 2, c) !== rt.inM(249415, 0, 2, cmd))) {
      dist = Math.abs(CmdRow(c, top_) - row) << 16 >> 16;
      if (dist < best) {
        best = dist;
        $r0 = c;
      }
    }
  }
  return $r0;
}

export function Draw(offered: Uint8Array, top_: number, cur: number) {
  let cmd: number = 0;
  TextRend.DisplayString(2, top_, 13, "Party");
  TextRend.DisplayString(2, top_ + 4, 13, "Game");
  TextRend.DisplayString(20, top_, 13, "Character");
  for (let $i1 = 0; $i1 <= 12; $i1++) {
    cmd = $i1;
    DrawCmd(offered, top_, cmd, cur);
  }
}

export async function ChooseCmd(offered: Uint8Array, top_: number, cur: number, ext: number) {
  let ch: number = 0, was: number = 0, cmd: number = 0, $r0: number = 0;
  do {
    was = U8[cur];
    U8[227081] = true ? 1 : 0;
    U8[227082] = true ? 1 : 0;
    wS(227083, 16, rS(249141) + "J");
    ch = (await MenuCore.MenuHorizontal(StrUtil.PadLeft(rS(131605), 40), "", 3, 0, 15, true, false, ext)) & 255;
    if ((U8[ext] !== 0)) {
      switch (ch) {
        case 72: {
          U8[cur] = StepCmd(offered, U8[cur], -1);
          break;
        }
        case 80: {
          U8[cur] = StepCmd(offered, U8[cur], 1);
          break;
        }
        case 75: case 77: {
          U8[cur] = OtherColumn(offered, U8[cur], top_);
          break;
        }
        default: {
          $r0 = ch;
          return $r0;
        }
      }
    } else if (ch === 13) {
      $r0 = U8[(U8[cur] + 1) + 249141];
      return $r0;
    } else if (ch === 74) {
      $r0 = ch;
      return $r0;
    } else if ((ch === 0) && ExitLeaves(offered)) {
      $r0 = U8[249154];
      return $r0;
    } else {
      cmd = rt.Pos(String.fromCharCode(ch), rS(249141));
      if (((ch !== 0) && (cmd > 0)) && rt.inS(offered, cmd - 1)) {
        U8[cur] = cmd - 1;
        DrawCmd(offered, top_, was, U8[cur]);
        DrawCmd(offered, top_, U8[cur], U8[cur]);
        $r0 = ch;
        return $r0;
      }
    }
    if (U8[cur] !== was) {
      DrawCmd(offered, top_, was, U8[cur]);
      DrawCmd(offered, top_, U8[cur], U8[cur]);
    }
  } while (!(false));
  return $r0;
}

export function ListTop(count: number) {
  let $r0: number = 0;
  if (((12 + count) - 1) > 22) {
    $r0 = (23 - count) & 255;
  } else {
    $r0 = 12;
  }
  return $r0;
}

export function DrawList(offered: Uint8Array) {
  let i: number = 0, count: number = 0, row: number = 0;
  count = 0;
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    if (rt.inS(offered, U8[i + 249417])) {
      count = (count + 1) & 255;
    }
  }
  row = ListTop(count) & 255;
  for (let $i2 = 0; $i2 <= 11; $i2++) {
    i = $i2;
    if (rt.inS(offered, U8[i + 249417])) {
      TextRend.DisplayString(2, row, 15, String.fromCharCode(U8[i * 28 + 249430]));
      TextRend.DisplayString(3, row, 10, rt.Copy(rS(i * 28 + 249429), 2, U8[i * 28 + 249429] - 1));
      row = (row + 1) & 255;
    }
  }
}

export async function ChooseListed(offered: Uint8Array, idle: boolean, ext: number) {
  let ch: number = 0, i: number = 0, $r0: number = 0;
  do {
    if (idle) {
      if ((U8[141211] !== 0)) {
        w16(227114, 300);
      } else {
        w16(227114, 3000);
      }
      U8[227116] = 33;
    }
    ch = (await MenuCore.MenuHorizontal("pool of radiance " + rS(131605), LIST_KEYS, 3, 0, 0, true, false, ext)) & 255;
    if (((U8[ext] !== 0) || (ch === 74)) || (ch === 33)) {
      $r0 = ch;
      return $r0;
    }
    if (ch !== 0) {
      for (let $i2 = 0; $i2 <= 11; $i2++) {
        i = $i2;
        if (rt.inS(offered, U8[i + 249417]) && (U8[i * 28 + 249430] === ch)) {
          $r0 = U8[(U8[i + 249417] + 1) + 249141];
          return $r0;
        }
      }
    }
  } while (!(false));
  return $r0;
}

export function DrawCmd(offered: Uint8Array, top_: number, cmd: number, cur: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 18);
  let col: number = 0, row: number = 0, i: number = 0;
  wS($f0, 17, rS(cmd * 18 + 249155));
  if ((cmd === 12) && ExitLeaves(offered)) {
    wS($f0, 17, "Exit");
  }
  row = CmdRow(cmd, top_) & 255;
  col = U8[cmd + 249402];
  if (!rt.inS(offered, cmd)) {
    TextRend.DisplayString(col, row, 8, rS($f0));
  } else if (cmd === cur) {
    TextRend.DisplayStringOn(col, row, 0, 15, rS($f0));
  } else {
    TextRend.DisplayString(col, row, 10, rS($f0));
    i = 1;
    while (rt.UpCase(U8[$f0 + i]) !== U8[(cmd + 1) + 249141]) {
      i = (i + 1) & 255;
    }
    TextRend.DisplayString((col + i) - 1, row, 15, String.fromCharCode(U8[$f0 + i]));
  }
  S.sp = $sp;
}
