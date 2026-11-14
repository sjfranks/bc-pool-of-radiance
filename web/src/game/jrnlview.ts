// Generated from src/jrnlview.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Types from './types';
import * as C_JRNL from './c_jrnl';
import * as C_KEYS from './c_keys';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as CharHlp from './charhlp';
import * as JrnlList from './jrnllist';
import * as JrnlQst from './jrnlqst';
import * as CharDisp from './chardisp';
import * as C_MSG from './c_msg';
import * as JrnlSeen from './jrnlseen';

export const PANE_RIGHT = 38;
export const PANE_LEFT = 12;
export const LIST_LEFT = 1;
export const LIST_RIGHT = 10;
export const TOP_ROW = 1;
export const BOTTOM_ROW = 22;
export const TITLE_ROW = 1;
export const TEXT_TOP = 3;
export const TEXT_ROWS = 20;
export const PREVIEW_DELAY = 25;
export const PROMPT = "Journal: ";
export const QUESTS_LEFT = 1;
export const QUESTS_RIGHT = 38;
export const QUESTS_TOP = 3;

export const $at = { items: 250892, count: 250991, sel: 250993, top_: 250995, shown: 250997, lines: 250999, page: 251001, pages: 251003, previewDue: 251005, movedAt: 251006 };

export async function JournalMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let ch: number = 0, lastKey: number = 0, reading: boolean = false, savedChoice: number = 0;
  function OptionOf(key: number) {
    let i: number = 0, n: number = 0, $r1: number = 0;
    $r1 = 1;
    n = 0;
    for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
      i = $i1;
      let $t2;
      if (($t2 = U8[$f0 + i], ($t2 >= 65 && $t2 <= 90))) {
        n = (n + 1) & 255;
        if (U8[$f0 + i] === key) {
          $r1 = n;
        }
      }
    }
    return $r1;
  }
  savedChoice = U8[145643];
  CollectItems();
  w16(250993, 1);
  w16(250995, 1);
  w16(250997, 0);
  w16(250999, 0);
  w16(251001, 1);
  w16(251003, 1);
  reading = false;
  lastKey = 83;
  (await DrawJournal());
  U8[251005] = ri16(250991) > 0 ? 1 : 0;
  w32(251006, (await TextRend.GetTicks()));
  w32(227110, 33);
  do {
    if (ri16(250991) === 0) {
      wS($f0, 40, "Quests Exit");
    } else {
      wS($f0, 40, "Select");
      if (reading && (ri16(251001) < ri16(251003))) {
        wS($f0, 40, rS($f0) + " Next");
      }
      if (reading && (ri16(251001) > 1)) {
        wS($f0, 40, rS($f0) + " Prev");
      }
      wS($f0, 40, rS($f0) + " Quests Exit");
    }
    U8[145643] = OptionOf(lastKey);
    ch = (await MenuCore.MenuHorizontal(PROMPT, rS($f0), 13, 10, 15, true, false, $f0 + 41)) & 255;
    if ((U8[$f0 + 41] !== 0)) {
      if (ri16(250991) > 0) {
        switch (ch) {
          case 72: case 71: {
            if (ri16(250993) > 1) {
              (await MoveTo(ri16(250993) - 1));
            } else {
              (await MoveTo(ri16(250991)));
            }
            break;
          }
          case 80: case 79: {
            if (ri16(250993) < ri16(250991)) {
              (await MoveTo(ri16(250993) + 1));
            } else {
              (await MoveTo(1));
            }
            break;
          }
          case 73: {
            (await ScrollColumn(false));
            break;
          }
          case 81: {
            (await ScrollColumn(true));
            break;
          }
        }
      }
      if ((U8[251005] !== 0)) {
        reading = false;
        lastKey = 83;
      }
    } else {
      lastKey = ch;
      switch (ch) {
        case 83: {
          (await ShowSelected());
          reading = true;
          break;
        }
        case 78: {
          if (ri16(251001) < ri16(251003)) {
            w16(251001, ri16(251001) + 1);
            (await DrawPage());
          }
          break;
        }
        case 80: {
          if (ri16(251001) > 1) {
            w16(251001, ri16(251001) - 1);
            (await DrawPage());
          }
          break;
        }
        case 81: {
          w32(227110, 0);
          if ((await ShowQuests())) {
            ch = 69;
          } else {
            (await DrawJournal());
            w32(227110, 33);
          }
          break;
        }
      }
    }
  } while (!(!(U8[$f0 + 41] !== 0) && (ch === 0 || ch === 69)));
  w32(227110, 0);
  U8[145643] = savedChoice;
  (await CharDisp.DisplayNoncombatInterface());
  S.sp = $sp;
}

export function CollectItems() {
  let i: number = 0;
  w16(250991, 0);
  for (let $i1 = 1; $i1 <= 99; $i1++) {
    i = $i1;
    if (JrnlSeen.Listed(i)) {
      w16(250991, ri16(250991) + 1);
      U8[ri16(250991) + 250891] = i;
    }
  }
}

export function DrawLabel(n: number, highlighted: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, rt.Copy(JrnlList.EntryLabel(U8[n + 250891]), 1, 10));
  if (highlighted) {
    TextRend.DisplayStringOn(1, (1 + n) - ri16(250995), 0, 15, rS($f0));
  } else {
    TextRend.DisplayString(1, (1 + n) - ri16(250995), 10, rS($f0));
  }
  S.sp = $sp;
}

export async function DrawList() {
  let n: number = 0;
  (await Border.ClearBox(1, 1, 10, 22));
  n = ri16(250995);
  while ((n <= ri16(250991)) && ((n - ri16(250995)) <= 21)) {
    DrawLabel(n, n === ri16(250993));
    n = (n + 1) << 16 >> 16;
  }
}

export function PageStart(p: number) {
  let $r0: number = 0;
  if (p <= 1) {
    $r0 = 1;
  } else {
    $r0 = (20 + ((p - 2) * 18)) << 16 >> 16;
  }
  return $r0;
}

export async function DrawPage() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let line: number = 0, row: number = 0, lastRow: number = 0;
  (await Border.ClearBox(12, 1, 38, 1));
  (await Border.ClearBox(12, 3, 38, 22));
  wS($f0, 255, rt.Copy(JrnlList.EntryTitle(U8[ri16(250997) + 250891]), 1, 27));
  TextRend.DisplayCentered(12, 38, 1, 15, rS($f0));
  row = 3;
  lastRow = 22;
  if (ri16(251001) > 1) {
    MenuCore.DrawMore(12, 38, 3);
    row = (row + 1) << 16 >> 16;
  }
  if (ri16(251001) < ri16(251003)) {
    MenuCore.DrawMore(12, 38, 22);
    lastRow = (lastRow - 1) << 16 >> 16;
  }
  line = PageStart(ri16(251001)) << 16 >> 16;
  while ((row <= lastRow) && (line <= ri16(250999))) {
    TextRend.DisplayString(12, row, 10, rt.Copy(JrnlList.TextLine(U8[ri16(250997) + 250891], line), 1, 27));
    line = (line + 1) << 16 >> 16;
    row = (row + 1) << 16 >> 16;
  }
  S.sp = $sp;
}

export async function ShowSelected() {
  U8[251005] = false ? 1 : 0;
  if (ri16(250991) === 0) {
    return;
  }
  if (ri16(250997) !== ri16(250993)) {
    w16(250997, ri16(250993));
    w16(250999, JrnlList.LineCount(U8[ri16(250997) + 250891]));
    if (ri16(250999) <= 20) {
      w16(251003, 1);
    } else {
      w16(251003, 2);
      while (ri16(250999) > ((PageStart(ri16(251003)) + 20) - 2)) {
        w16(251003, ri16(251003) + 1);
      }
    }
    w16(251001, 1);
    (await DrawPage());
  } else if (ri16(251001) !== 1) {
    w16(251001, 1);
    (await DrawPage());
  }
}

export async function Moved(old: number) {
  if (ri16(250993) !== old) {
    U8[251005] = true ? 1 : 0;
    w32(251006, (await TextRend.GetTicks()));
  }
}

export async function TickPreview() {
  let now: number = 0;
  if ((U8[251005] !== 0) && !(await Crt.KeyPressed())) {
    now = (await TextRend.GetTicks()) | 0;
    if ((now < ri32(251006)) || ((now - ri32(251006)) >= 25)) {
      (await ShowSelected());
    }
  }
}

export async function DrawJournal() {
  (await Border.ClearBox(1, 1, 38, 22));
  (await Border.DrawBorder(1, 1, 10, 22, 0));
  (await Border.DrawBorder(12, 3, 38, 22, 0));
  (await Border.DrawBorder(12, 1, 38, 1, 0));
  (await DrawList());
  if (ri16(250991) === 0) {
    TextRend.DisplayString(12, 3, 10, "Your journal is empty.");
  } else if (ri16(250997) !== 0) {
    (await DrawPage());
  }
}

export function QuestLine(n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, " " + rt.Copy(JrnlQst.QuestLabel(n), 1, 31));
  while (U8[$f0] < 33) {
    wS($f0, 40, rS($f0) + " ");
  }
  if (JrnlQst.IsDone(n)) {
    $r0 = rS($f0) + "DONE";
  } else {
    $r0 = rS($f0) + "----";
  }
  S.sp = $sp;
  return $r0;
}

export async function ShowQuests() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 69);
  let ch: number = 0, n: number = 0, count: number = 0, top_: number = 0, lastKey: number = 0, $r0: boolean = false;
  async function DrawQuestPage() {
    let k: number = 0;
    (await Border.ClearBox(1, 3, 38, 22));
    k = top_;
    while ((k < count) && ((k - top_) < 20)) {
      TextRend.DisplayString(1, (3 + k) - top_, 10, QuestLine(U8[$f0 + k + 48]));
      k = (k + 1) << 16 >> 16;
    }
  }
  count = 0;
  for (let $i2 = 1; $i2 <= 21; $i2++) {
    n = $i2;
    if (JrnlQst.IsGiven(n)) {
      U8[$f0 + count + 48] = n;
      count = (count + 1) << 16 >> 16;
    }
  }
  (await Border.ClearBox(1, 1, 38, 22));
  (await Border.DrawBorder(1, 3, 38, 22, 0));
  (await Border.DrawBorder(1, 1, 38, 1, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, "QUESTS");
  top_ = 0;
  (await DrawQuestPage());
  lastKey = 81;
  do {
    wS($f0 + 1, 40, "Entries Quests");
    wS($f0 + 42, 5, "EQ");
    if ((top_ + 20) < count) {
      wS($f0 + 1, 40, rS($f0 + 1) + " Next");
      wS($f0 + 42, 5, rS($f0 + 42) + "N");
    }
    if (top_ > 0) {
      wS($f0 + 1, 40, rS($f0 + 1) + " Prev");
      wS($f0 + 42, 5, rS($f0 + 42) + "P");
    }
    wS($f0 + 1, 40, rS($f0 + 1) + " Exit");
    wS($f0 + 42, 5, rS($f0 + 42) + "X");
    if (rt.Pos(String.fromCharCode(lastKey), rS($f0 + 42)) > 0) {
      U8[145643] = rt.Pos(String.fromCharCode(lastKey), rS($f0 + 42));
    } else {
      U8[145643] = 2;
    }
    rt.wSet(227100, 0, 3, rt.setR(U8[$f0 + 42], U8[$f0 + 42]));
    U8[227082] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal(PROMPT, rS($f0 + 1), 13, 10, 15, true, false, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      switch (ch) {
        case 81: {
          ch = 78;
          break;
        }
        case 73: {
          ch = 80;
          break;
        }
        default: {
          ch = 32;
        }
      }
      if (rt.Pos(String.fromCharCode(ch), rS($f0 + 42)) === 0) {
        ch = 32;
      }
    } else if (ch === 13) {
      ch = U8[$f0 + U8[145643] + 42];
    }
    switch (ch) {
      case 78: {
        top_ = (top_ + 20) << 16 >> 16;
        (await DrawQuestPage());
        break;
      }
      case 80: {
        top_ = (top_ - 20) << 16 >> 16;
        if (top_ < 0) {
          top_ = 0;
        }
        (await DrawQuestPage());
        break;
      }
    }
    if (ch === 69 || ch === 81 || ch === 78 || ch === 80 || ch === 88) {
      lastKey = ch;
    }
  } while (!(ch === 0 || ch === 69 || ch === 88));
  $r0 = ch !== 69;
  S.sp = $sp;
  return $r0;
}

export async function MoveTo(n: number) {
  let old: number = 0;
  old = ri16(250993);
  if (n > ri16(250991)) {
    n = ri16(250991);
  }
  if (n < 1) {
    n = 1;
  }
  if ((n < ri16(250995)) || (n > ((ri16(250995) + 22) - 1))) {
    if (n < ri16(250995)) {
      w16(250995, n);
    } else {
      w16(250995, n - 21);
    }
    w16(250993, n);
    (await DrawList());
  } else {
    DrawLabel(ri16(250993), false);
    w16(250993, n);
    DrawLabel(ri16(250993), true);
  }
  (await Moved(old));
}

export async function ScrollColumn(down: boolean) {
  let row: number = 0, old: number = 0;
  old = ri16(250993);
  row = (ri16(250993) - ri16(250995)) << 16 >> 16;
  if (down) {
    w16(250995, ((ri16(250995) + 22) - 1) + 1);
  } else {
    w16(250995, ri16(250995) - 22);
  }
  if (ri16(250995) > (ri16(250991) - 21)) {
    w16(250995, ri16(250991) - 21);
  }
  if (ri16(250995) < 1) {
    w16(250995, 1);
  }
  w16(250993, ri16(250995) + row);
  if (ri16(250993) > ri16(250991)) {
    w16(250993, ri16(250991));
  }
  (await DrawList());
  (await Moved(old));
}
