// Generated from src/chgclass.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_STAT from './c_stat';
import * as C_EFFECT from './c_effect';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_MSG from './c_msg';
import * as C_RACE from './c_race';
import * as C_STATUS from './c_status';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Border from './border';
import * as CharDisp from './chardisp';
import * as CharHlp from './charhlp';
import * as ClassCal from './classcal';
import * as FxEngine from './fxengine';
import * as MenuCore from './menucore';
import * as Money from './money';
import * as MoneyCal from './moneycal';
import * as StrUtil from './strutil';
import * as TextRend from './textrend';

export const CHANGE_FEE = 2500;
export const LABEL_COL = 2;
export const NEEDS_COL = 14;
export const HAS_COL = 29;
export const TITLE_ROW = 1;
export const NOW_ROW = 3;
export const HEAD_ROW = 5;
export const FIRST_CLASS_ROW = 6;
export const LAST_CLASS_ROW = 13;
export const TEXT_TOP_ROW = 15;
export const TEXT_BOTTOM_ROW = 19;
export const STATUS_TOP_ROW = 21;
export const STATUS_BOTTOM_ROW = 22;
export const MAX_LISTED = 5;
export const NO_OBSTACLE = 0;
export const RULES_OBSTACLE = 1;
export const HALL_OBSTACLE = 2;
export const FEE_OBSTACLE = 3;

export function RestingMask(creature: number) {
  let mask: number = 0, cls: number = 0, $r0: number = 0;
  mask = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (CharHlp.ClassResting(creature, cls)) {
      mask = (mask | (1 << cls)) & 255;
    }
  }
  $r0 = mask;
  return $r0;
}

export async function SyncClassPowers(creature: number) {
  let ward: number = 0, item: number = 0;
  if (!CharHlp.IsDualClass(creature)) {
    return;
  }
  ward = OwnWard(creature);
  if (CharHlp.GetClassLevel(creature, 8) > 0) {
    if (ward === 0) {
      FxEngine.AddEffect(creature, 45, 0, 255, false);
    }
  } else if (ward !== 0) {
    (await FxEngine.RemoveEffect(creature, 45, ward));
  }
  item = r32(creature + 200);
  while (item !== 0) {
    if (((U8[item + 52] !== 0) && (U8[item + 54] === 0)) && ((U8[CharHlp.BaseItem(U8[item + 46]) + 13] & U8[creature + 176]) === 0)) {
      (await FxEngine.UnreadyItem(creature, item));
    }
    item = r32(item + 42);
  }
  CharHlp.RecalcStats(creature);
}

export async function AnnounceWoken(creature: number, wasResting: number) {
  let cls: number = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (((wasResting & (1 << cls)) !== 0) && !CharHlp.ClassResting(creature, cls)) {
      if (I8[creature + cls + 150] === 1) {
        ClassCal.StartCasterClass(creature, cls);
      }
      (await CharDisp.MessageText(rS(creature) + " can again use the skills of a " + rS(cls * 26 + 131942) + ".", 10, true));
      (await CharDisp.MessageWait());
    }
  }
  (await SyncClassPowers(creature));
}

export function Refusal(creature: number, atHall: boolean) {
  let $r0: string = "";
  $r0 = "";
  if (!atHall) {
    $r0 = "Dual classing requires a training hall.";
  } else if (creature === 0) {
    return $r0;
  } else if (I8[creature + 46] !== 7) {
    $r0 = "Only humans can dual class.";
  } else if (CharHlp.IsDualClass(creature)) {
    $r0 = rS(creature) + " already has two classes.";
  } else if (U8[creature + 268] !== 0) {
    $r0 = rS(creature) + " isn't able to do that.";
  } else if (U8[creature + 116] > 0) {
    $r0 = rS(creature) + " needs restoration first.";
  }
  return $r0;
}

export async function ChangeClassMenu(freeTraining: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 11);
  let creature: number = 0, count: number = 0, sel: number = 0, i: number = 0, row: number = 0, cls: number = 0, old: number = 0, ch: number = 0, done: boolean = false;
  function DrawListed(n: number, highlighted: boolean) {
    let color: number = 0;
    if (highlighted) {
      color = 14;
    } else if (Qualifies(creature, I8[$f0 + n - 1], freeTraining)) {
      color = 15;
    } else {
      color = 8;
    }
    DrawClassLines(creature, I8[$f0 + n - 1], U8[$f0 + n + 4], color, highlighted);
  }
  async function MoveTo(n: number) {
    if (sel > 0) {
      DrawListed(sel, false);
    }
    sel = n;
    DrawListed(sel, true);
    (await ShowClassStatus(creature, I8[$f0 + sel - 1], freeTraining));
  }
  creature = r32(143749);
  old = I8[creature + 47];
  (await TextRend.ClearScreen());
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  TextRend.DisplayCentered(2, 37, 1, 11, "Dual Class " + rS(creature));
  TextRend.DisplayString(2, 3, 10, "Now");
  TextRend.DisplayString(14, 3, 15, "Level " + StrUtil.NumStr(I8[creature + old + 150]) + " " + rS(old * 26 + 131942));
  TextRend.DisplayString(2, 5, 10, "New Class");
  TextRend.DisplayString(14, 5, 10, "Needs");
  TextRend.DisplayString(29, 5, 10, "Has");
  (await TextRend.DisplayMessageWindow(2, 15, 37, 19, 10, true, "To dual class a character must have " + StrUtil.NumStr(15) + " or more in the prime requisites of their current class, and " + StrUtil.NumStr(17) + " or more in their new class' prime requisites."));
  count = 0;
  row = 6;
  for (let $i1 = 1, $e1 = I8[230003]; $i1 <= $e1; $i1++) {
    i = $i1;
    cls = I8[i + 230003];
    if (((cls !== old) && (count < 5)) && (((row + PrimeCount(cls)) - 1) <= 13)) {
      count = (count + 1) & 255;
      U8[$f0 + count - 1] = cls;
      U8[$f0 + count + 4] = row;
      row = (row + PrimeCount(cls)) & 255;
    }
  }
  sel = 0;
  for (let $i2 = 1, $e2 = count; $i2 <= $e2; $i2++) {
    i = $i2;
    DrawListed(i, false);
  }
  if (!ClassCal.CanChangeClass(creature)) {
    (await ShowStatus(14, rS(creature) + " does not meet current class requirements."));
  } else if (count > 0) {
    i = 1;
    while ((i < count) && !Qualifies(creature, I8[$f0 + i - 1], freeTraining)) {
      i = (i + 1) & 255;
    }
    if (!Qualifies(creature, I8[$f0 + i - 1], freeTraining)) {
      i = 1;
    }
    (await MoveTo(i));
  }
  done = false;
  do {
    U8[227081] = true ? 1 : 0;
    if ((sel > 0) && Qualifies(creature, I8[$f0 + sel - 1], freeTraining)) {
      U8[227082] = true ? 1 : 0;
      ch = (await MenuCore.MenuHorizontal("Change class: ", "Choose Exit", 13, 10, 15, true, false, $f0 + 10)) & 255;
    } else {
      ch = (await MenuCore.MenuHorizontal("Change class: ", "Exit", 13, 10, 15, true, false, $f0 + 10)) & 255;
    }
    if ((U8[$f0 + 10] !== 0)) {
      if (sel > 0) {
        switch (ch) {
          case 72: {
            (await MoveTo((((sel + count) - 2) % count) + 1));
            break;
          }
          case 80: {
            (await MoveTo((sel % count) + 1));
            break;
          }
        }
      }
    } else if (((sel > 0) && ((ch === 67) || (ch === 13))) && Qualifies(creature, I8[$f0 + sel - 1], freeTraining)) {
      cls = I8[$f0 + sel - 1];
      if ((await MenuCore.YesNoMenu("Change " + rS(creature) + " to a " + rS(cls * 26 + 131942) + "? ", 13, 10, 15)) === 89) {
        if (!freeTraining) {
          Money.PayFromCreature(creature, 2500);
        }
        ClassCal.ChangeClass(creature, cls);
        (await SyncClassPowers(creature));
        (await CharDisp.PrintBottomLine(rS(creature) + " is now a " + rS(cls * 26 + 131942) + "."));
        done = true;
      }
    } else if ((ch === 69) || (ch === 0)) {
      done = true;
    }
  } while (!(done));
  S.sp = $sp;
}

export function OwnWard(creature: number) {
  let p: number = 0, $r0: number = 0;
  $r0 = 0;
  p = r32(creature + 127);
  while (p !== 0) {
    if (((U8[p] === 45) && (r16(p + 1) === 0)) && (U8[p + 3] === 255)) {
      $r0 = p;
    }
    p = r32(p + 5);
  }
  return $r0;
}

export async function ShowStatus(color: number, s: string) {
  let delayFlag: number = 0;
  delayFlag = U8[141225];
  U8[141225] = 0;
  (await TextRend.DisplayMessageWindow(2, 21, 37, 22, color, true, s));
  U8[141225] = delayFlag;
}

export function PrimeCount(cls: number) {
  let ab: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    ab = $i1;
    if ((U8[cls + 230195] & (1 << ab)) !== 0) {
      n = (n + 1) & 255;
    }
  }
  $r0 = n;
  return $r0;
}

export function DrawClassLines(creature: number, cls: number, row: number, color: number, highlighted: boolean) {
  let ab: number = 0, score: number = 0;
  if (highlighted) {
    TextRend.DisplayStringOn(2, row, 0, color, rS(cls * 26 + 131942));
  } else {
    TextRend.DisplayString(2, row, color, rS(cls * 26 + 131942));
  }
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    ab = $i1;
    if ((U8[cls + 230195] & (1 << ab)) !== 0) {
      if (ab === 0) {
        score = CharHlp.PermanentStrength(creature) & 255;
      } else {
        score = U8[creature + ab + 16];
      }
      TextRend.DisplayString(14, row, color, rS(ab * 4 + 132384) + " " + StrUtil.NumStr(17));
      TextRend.DisplayString(29, row, color, StrUtil.NumStr(score));
      row = (row + 1) & 255;
    }
  }
}

export function Obstacle(creature: number, cls: number, freeTraining: boolean) {
  let $r0: number = 0;
  if (!ClassCal.CanTakeClass(creature, cls)) {
    $r0 = 1;
  } else if (freeTraining) {
    $r0 = 0;
  } else if ((U8[cls + 131902] & CharHlp.HallMask()) === 0) {
    $r0 = 2;
  } else if (MoneyCal.CreatureGold(creature) < 2500) {
    $r0 = 3;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function Qualifies(creature: number, cls: number, freeTraining: boolean) {
  let $r0: boolean = false;
  $r0 = Obstacle(creature, cls, freeTraining) === 0;
  return $r0;
}

export async function ShowClassStatus(creature: number, cls: number, freeTraining: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, rS(cls * 26 + 131942));
  switch (Obstacle(creature, cls, freeTraining)) {
    case 1: {
      (await ShowStatus(14, rS(creature) + " does not meet " + rS($f0) + " requirements."));
      break;
    }
    case 2: {
      (await ShowStatus(14, "This hall cannot train a " + rS($f0) + "."));
      break;
    }
    case 3: {
      (await ShowStatus(14, rS(creature) + " can't afford to change class (" + StrUtil.Grouped(2500) + " gp)."));
      break;
    }
    default: {
      if (freeTraining) {
        (await ShowStatus(15, rS(creature) + " can become a " + rS($f0) + "."));
      } else {
        (await ShowStatus(15, rS(creature) + " can become a " + rS($f0) + " for " + StrUtil.Grouped(2500) + " gp."));
      }
    }
  }
  S.sp = $sp;
}
