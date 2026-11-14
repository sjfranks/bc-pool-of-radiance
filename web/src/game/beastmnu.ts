// Generated from src/beastmnu.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Bestiary from './bestiary';
import * as Crt from './crt';
import * as C_KEYS from './c_keys';
import * as C_MSG from './c_msg';
import * as C_BEAST from './c_beast';
import * as GameVars from './gamevars';
import * as BeastFil from './beastfil';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as StrUtil from './strutil';

export const TITLE_ROW = 1;
export const LIST_TOP = 3;
export const LIST_ROWS = 18;
export const LIST_LEFT = 3;
export const LIST_COL_WIDTH = 18;
export const PER_PAGE = 36;
export const COUNT_ROW = 22;
export const FACTS_TOP = 3;
export const FACT_COL = 2;
export const VALUE_COL = 20;
export const ITEM_COL = 4;
export const ITEM_COL2 = 21;
export const LAST_ROW = 22;
export const UNKNOWN = "??";
export const NONE = "None";

export async function BestiaryMenu() {
  let none: number = 0;
  none = (await ListPages("Bestiary: ", false));
}

export async function PickBeast(prompt: string) {
  let $r0: number = 0;
  $r0 = (await ListPages(prompt, true));
  return $r0;
}

export async function ShowEntry(b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0;
  U8[145643] = 1;
  (await DrawEntry(b));
  do {
    ch = (await MenuCore.MenuHorizontal(rS(b) + ": ", "Exit", 13, 10, 15, false, false, $f0)) & 255;
  } while (!(ch === 0 || ch === 69));
  S.sp = $sp;
}

export async function DrawFrame(title: string) {
  (await TextRend.ClearScreen());
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, title);
}

export function At(order: number, i: number) {
  let $r0: number = 0;
  if (order !== 0) {
    $r0 = Bestiary.Entry(r16(order + i * 2 - 2));
  } else {
    $r0 = Bestiary.Entry(i);
  }
  return $r0;
}

export function SortedOrder(n: number) {
  let order: number = 0, gap: number = 0, i: number = 0, j: number = 0, t: number = 0, $r0: number = 0;
  $r0 = 0;
  if ((n === 0) || (16777216 < (n * 2))) {
    return $r0;
  }
  order = rt.getMem(n * 2);
  for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    w16(order + i * 2 - 2, i);
  }
  gap = Math.trunc(n / 2);
  while (gap > 0) {
    for (let $i3 = gap + 1, $e3 = n; $i3 <= $e3; $i3++) {
      i = $i3;
      t = r16(order + i * 2 - 2);
      j = i;
      while ((j > gap) && (rS(Bestiary.Entry(r16(order + (j - gap) * 2 - 2))) > rS(Bestiary.Entry(t)))) {
        w16(order + j * 2 - 2, r16(order + (j - gap) * 2 - 2));
        j = (j - gap) & 65535;
      }
      w16(order + j * 2 - 2, t);
    }
    gap = Math.trunc(gap / 2);
  }
  $r0 = order;
  return $r0;
}

export function PageShape(n: number, top_: number, shown: number, rows: number) {
  w16(shown, (n - top_) + 1);
  if (r16(shown) > 36) {
    w16(shown, 36);
  }
  w16(rows, Math.trunc((r16(shown) + 1) / 2));
}

export async function DrawList(order: number, n: number, top_: number, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 45);
  let k: number = 0, col: number = 0, row: number = 0;
  (await DrawFrame("Bestiary"));
  if (n === 0) {
    TextRend.DisplayString(3, 3, 10, "None met yet");
    { S.sp = $sp; return; }
  }
  PageShape(n, top_, $f0, $f0 + 2);
  for (let $i1 = 0, $e1 = r16($f0) - 1; $i1 <= $e1; $i1++) {
    k = $i1;
    col = (3 + rt.mul(Math.trunc(k / r16($f0 + 2)), 18)) & 255;
    row = (3 + (k % r16($f0 + 2))) & 255;
    if ((top_ + k) === sel) {
      TextRend.DisplayStringOn(col, row, 0, 15, rS(At(order, top_ + k)));
    } else {
      TextRend.DisplayString(col, row, 10, rS(At(order, top_ + k)));
    }
  }
  wS($f0 + 4, 40, StrUtil.Count(n, "Creature", "Creatures"));
  TextRend.DisplayCentered(1, 38, 22, 11, rS($f0 + 4));
  S.sp = $sp;
}

export function ArmorText(b: number) {
  let $r0: string = "";
  if ((I8[b + 24] === (-128)) && (I8[b + 25] === 127)) {
    $r0 = UNKNOWN;
  } else if (I8[b + 24] === I8[b + 25]) {
    $r0 = StrUtil.NumStr(I8[b + 24]);
  } else if (I8[b + 24] === (-128)) {
    $r0 = StrUtil.NumStr(I8[b + 25]) + " or better";
  } else if (I8[b + 25] === 127) {
    $r0 = StrUtil.NumStr(I8[b + 24]) + " or worse";
  } else {
    $r0 = StrUtil.NumStr(I8[b + 24]) + " to " + StrUtil.NumStr(I8[b + 25]);
  }
  return $r0;
}

export function DrawGroup(b: number, heading: string, defenses: boolean, twoCols: boolean, row: number) {
  let i: number = 0, f: number = 0, k: number = 0;
  TextRend.DisplayString(2, U8[row], 11, heading);
  U8[row] = U8[row] + 1;
  k = 0;
  i = 1;
  f = BeastFil.FactAt(defenses, i) & 255;
  while (f !== 0) {
    if (Bestiary.Knows(b, f) && (U8[row] <= 22)) {
      if (twoCols && ((k % 2) === 1)) {
        TextRend.DisplayString(21, U8[row], 10, BeastFil.FactName(f));
      } else {
        TextRend.DisplayString(4, U8[row], 10, BeastFil.FactName(f));
      }
      k = (k + 1) & 255;
      if (!twoCols || ((k % 2) === 0)) {
        U8[row] = U8[row] + 1;
      }
    }
    i = (i + 1) & 255;
    f = BeastFil.FactAt(defenses, i) & 255;
  }
  if (U8[row] > 22) {
    return;
  }
  if (!Bestiary.Knows(b, 20)) {
    if (twoCols && ((k % 2) === 1)) {
      TextRend.DisplayString(21, U8[row], 14, UNKNOWN);
    } else {
      TextRend.DisplayString(4, U8[row], 14, UNKNOWN);
    }
    U8[row] = U8[row] + 1;
  } else if (k === 0) {
    TextRend.DisplayString(4, U8[row], 10, NONE);
    U8[row] = U8[row] + 1;
  } else if (twoCols && ((k % 2) === 1)) {
    U8[row] = U8[row] + 1;
  }
}

export function DrawFact(row: number, name_: string, known: boolean, value: string) {
  TextRend.DisplayString(2, row, 10, name_);
  if (known) {
    TextRend.DisplayString(20, row, 15, value);
  } else {
    TextRend.DisplayString(20, row, 14, UNKNOWN);
  }
}

export async function DrawEntry(b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let twoCols: boolean = false;
  (await DrawFrame(rS(b)));
  wS($f0 + 1, 40, StrUtil.Count(r16(b + 28), "time", "times"));
  DrawFact(3, "Seen", true, rS($f0 + 1));
  DrawFact(4, "Killed", true, StrUtil.NumStr(r16(b + 30)));
  if (Bestiary.Knows(b, 1)) {
    wS($f0 + 1, 40, "Large");
  } else {
    wS($f0 + 1, 40, "Man-sized or less");
  }
  DrawFact(5, "Size", Bestiary.Knows(b, 0), rS($f0 + 1));
  wS($f0 + 1, 40, ArmorText(b));
  DrawFact(6, "Armor Class", rS($f0 + 1) !== UNKNOWN, rS($f0 + 1));
  if (I8[b + 26] < 1) {
    wS($f0 + 1, 40, "Less than 1");
  } else {
    wS($f0 + 1, 40, StrUtil.NumStr(I8[b + 26]));
  }
  DrawFact(7, "Hit Dice", Bestiary.Knows(b, 2), rS($f0 + 1));
  DrawFact(8, "Most Damage Done", U8[b + 27] > 0, StrUtil.NumStr(U8[b + 27]) + " in one blow");
  U8[$f0] = 10;
  twoCols = BeastFil.ListRows(b) > ((22 - U8[$f0]) + 1);
  DrawGroup(b, "Defenses", true, twoCols, $f0);
  U8[$f0] = U8[$f0] + 1;
  if (U8[$f0] <= 22) {
    DrawGroup(b, "Attacks", false, twoCols, $f0);
  }
  S.sp = $sp;
}

export async function EntryPages(order: number, n: number, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0, b: number = 0;
  U8[145643] = 1;
  do {
    b = At(order, r16(sel));
    (await DrawEntry(b));
    ch = (await MenuCore.MenuHorizontal(rS(b) + ": ", "Next Prev Exit", 13, 10, 15, false, false, $f0)) & 255;
    switch (ch) {
      case 78: {
        if (r16(sel) < n) {
          w16(sel, r16(sel) + 1);
        } else {
          w16(sel, 1);
        }
        break;
      }
      case 80: {
        if (r16(sel) > 1) {
          w16(sel, r16(sel) - 1);
        } else {
          w16(sel, n);
        }
        break;
      }
    }
  } while (!(ch === 0 || ch === 69));
  S.sp = $sp;
}

export async function ListPages(prompt: string, pick: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let chosen: number = 0, order: number = 0, n: number = 0, top_: number = 0, ch: number = 0, cmd: number = 0, $r0: number = 0;
  chosen = 0;
  n = Bestiary.Count() & 65535;
  order = SortedOrder(n);
  top_ = 1;
  w16($f0, 1);
  U8[145643] = 1;
  do {
    (await DrawList(order, n, top_, r16($f0)));
    PageShape(n, top_, $f0 + 4, $f0 + 2);
    U8[227081] = true ? 1 : 0;
    U8[227082] = true ? 1 : 0;
    if (n === 0) {
      ch = (await MenuCore.MenuHorizontal(prompt, "Exit", 13, 10, 15, true, false, $f0 + 6)) & 255;
    } else if (pick) {
      ch = (await MenuCore.MenuHorizontal(prompt, "Ask Next Prev Exit", 13, 10, 15, true, false, $f0 + 6)) & 255;
    } else {
      ch = (await MenuCore.MenuHorizontal(prompt, "View Next Prev Exit", 13, 10, 15, true, false, $f0 + 6)) & 255;
    }
    cmd = ch;
    if ((U8[$f0 + 6] !== 0)) {
      cmd = 0;
    }
    if (n > 0) {
      if ((U8[$f0 + 6] !== 0)) {
        switch (ch) {
          case 72: {
            if (r16($f0) > top_) {
              w16($f0, r16($f0) - 1);
            }
            break;
          }
          case 80: {
            if (r16($f0) < ((top_ + r16($f0 + 4)) - 1)) {
              w16($f0, r16($f0) + 1);
            }
            break;
          }
          case 75: {
            if (r16($f0) >= (top_ + r16($f0 + 2))) {
              w16($f0, r16($f0) - r16($f0 + 2));
            }
            break;
          }
          case 77: {
            if ((r16($f0) + r16($f0 + 2)) < (top_ + r16($f0 + 4))) {
              w16($f0, r16($f0) + r16($f0 + 2));
            }
            break;
          }
          case 73: {
            cmd = 80;
            break;
          }
          case 81: {
            cmd = 78;
            break;
          }
        }
      }
      if (pick && (cmd === 65 || cmd === 13)) {
        chosen = At(order, r16($f0));
      } else {
        switch (cmd) {
          case 86: case 13: {
            (await EntryPages(order, n, $f0));
            top_ = ((Math.trunc((r16($f0) - 1) / 36) * 36) + 1) & 65535;
            U8[145643] = 1;
            break;
          }
          case 78: {
            if ((top_ + 36) <= n) {
              top_ = (top_ + 36) & 65535;
              w16($f0, top_);
            }
            break;
          }
          case 80: {
            if (top_ > 36) {
              top_ = (top_ - 36) & 65535;
              w16($f0, top_);
            }
            break;
          }
        }
      }
    }
  } while (!((chosen !== 0) || (!(U8[$f0 + 6] !== 0) && (ch === 0 || ch === 69))));
  if (order !== 0) {
    rt.freeMem(order);
  }
  TextRend.ClearBottomLine();
  $r0 = chosen;
  S.sp = $sp;
  return $r0;
}
