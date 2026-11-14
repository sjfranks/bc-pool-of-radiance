// Generated from src/gametime.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_TIME from './c_time';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as TextRend from './textrend';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as Magic from './magic';
import * as C_KEYS from './c_keys';
import * as C_GBVM from './c_gbvm';
import * as C_SPELL from './c_spell';
import * as FxEngine from './fxengine';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as Dice from './dice';
import * as Clock from './clock';
import * as AbilAdj from './abiladj';


export const $at = { restTime: 249018, healTicks: 249032, rested: 249034, prepTimers: 249035, restTicks: 249043 };

export async function CampRest(interactive: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let cur: number = 0, i: number = 0, cnt: number = 0, stop: boolean = false, $r0: boolean = false;
  $r0 = false;
  U8[249034] = false ? 1 : 0;
  i = 1;
  cur = r32(143753);
  while ((cur !== 0) && (i <= 8)) {
    U8[i + 249034] = 0;
    i = (i + 1) & 255;
    cur = r32(cur + 260);
  }
  rt.fill(240488, 72, 1);
  U8[$f0] = 0;
  cnt = 0;
  (await TextRend.ClearRect(1, 17, 38, 22));
  DisplayRestTime(0);
  U8[146458] = 1;
  if (interactive) {
    stop = !(await CampRestMenu());
  } else {
    stop = false;
  }
  while (!stop && ((((r16(249026) > 0) || (r16(249024) > 0)) || (r16(249022) > 0)) || (r16(249020) > 0))) {
    if ((await Crt.KeyPressed())) {
      DisplayRestTime(0);
      if ((await MenuCore.YesNoMenu("Stop Resting? ", 13, 10, 15)) === 89) {
        stop = true;
      } else {
        TextRend.ClearBottomLine();
      }
    }
    if (!stop) {
      DecrementRestTime(5, 1);
      U8[249034] = true ? 1 : 0;
      cnt = (cnt + 1) & 255;
      if (cnt >= 5) {
        DisplayRestTime(0);
        cnt = 0;
      }
      (await FxEngine.AdvanceTime(5, 1));
      (await CheckRestingHeal());
      (await AdvanceSpellPrep());
      (await AdvanceSpellPrepBase($f0));
      if (r16(r32(141151) + 1444) > 0) {
        w16(249043, r16(249043) + 1);
        if (r16(249043) >= r16(r32(141151) + 1444)) {
          w16(249043, 0);
          if (Dice.RollDice(1, 100) <= r16(r32(141151) + 1446)) {
            (await CharDisp.ClearMessageWindow());
            DisplayRestTime(0);
            TextRend.DisplayString(1, 19, 15, "The Party is rudely interrupted!");
            stop = true;
            $r0 = true;
            (await TextRend.PauseOnly());
          }
        }
      }
    }
  }
  (await TextRend.ClearRect(1, 17, 38, 22));
  U8[146458] = 0;
  S.sp = $sp;
  return $r0;
}

export function ResetGame() {
  w16(249043, 0);
}

export function ValidateRestTime() {
  Clock.ValidateClock(249018, false);
  if (r16(249028) > 0) {
    w16(249026, r16(249026) + (r16(138578) * r16(249028)));
    w16(249028, 0);
    if (r16(249026) > 99) {
      w16(249026, 99);
    }
  }
}

export function DecrementRestTime(count: number, tUnit: number) {
  let j: number = 0, k: number = 0;
  if ((((r16(249026) !== 0) || (r16(249024) !== 0)) || (r16(249022) !== 0)) || (r16(249020) !== 0)) {
    while (count > r16(tUnit * 2 + 249018)) {
      j = (tUnit + 1) << 24 >> 24;
      while ((r16(j * 2 + 249018) === 0) && (j < 5)) {
        j = (j + 1) << 24 >> 24;
      }
      if (j === 5) {
        rt.fill(249018, 14, 0);
        count = 0;
      } else {
        for (let $i3 = j, $e3 = tUnit + 1; $i3 >= $e3; $i3--) {
          k = $i3;
          let $t4;
          $t4 = k * 2 + 249018, w16($t4, r16($t4) - 1);
          let $t5;
          $t5 = (k - 1) * 2 + 249018, w16($t5, r16($t5) + r16((k - 1) * 2 + 138570));
        }
      }
    }
    let $t6;
    $t6 = tUnit * 2 + 249018, w16($t6, r16($t6) - count);
    ValidateRestTime();
  }
}

export function DisplayRestTime(hl: number) {
  let i: number = 0, x: number = 0;
  function DrawField(col: number, i: number, s: string) {
    if (i === hl) {
      TextRend.DisplayStringOn(col, 17, 0, 15, s);
    } else {
      TextRend.DisplayString(col, 17, 10, s);
    }
  }
  TextRend.DisplayString(1, 17, 10, "Rest Time:");
  x = 11;
  for (let $i1 = 4; $i1 >= 3; $i1--) {
    i = $i1;
    DrawField(x + 1, i, StrUtil.ZeroPad2(r16(i * 2 + 249018)));
    TextRend.DisplayString((x + 1) + 2, 17, 10, ":");
    x = (x + 3) & 255;
  }
  DrawField(x + 1, 2, StrUtil.ZeroPad2((10 * r16(249022)) + r16(249020)));
}

export async function CampRestMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0, sel: number = 0, $r0: boolean = false;
  $r0 = false;
  sel = 2;
  do {
    DisplayRestTime(sel);
    U8[227081] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("", "Rest   daYs Hours Mins   Inc Dec   Exit", 13, 10, 15, true, false, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      switch (ch) {
        case 72: {
          ch = 73;
          break;
        }
        case 80: {
          ch = 68;
          break;
        }
        case 75: {
          sel = (sel + 1) << 24 >> 24;
          if (sel > 4) {
            sel = 2;
          }
          ch = 32;
          break;
        }
        case 77: {
          sel = (sel - 1) << 24 >> 24;
          if (sel < 2) {
            sel = 4;
          }
          ch = 32;
          break;
        }
        default: {
          ch = 32;
        }
      }
    }
    switch (ch) {
      case 82: {
        $r0 = true;
        break;
      }
      case 89: {
        sel = 4;
        break;
      }
      case 72: {
        sel = 3;
        break;
      }
      case 77: {
        sel = 2;
        break;
      }
      case 73: {
        if (sel === 2) {
          w16(249020, r16(249020) + 5);
        } else {
          let $t2;
          $t2 = sel * 2 + 249018, w16($t2, r16($t2) + 1);
        }
        ValidateRestTime();
        break;
      }
      case 68: {
        if (sel === 2) {
          DecrementRestTime(5, 1);
        } else {
          DecrementRestTime(1, sel);
        }
        ValidateRestTime();
        break;
      }
    }
  } while (!(ch === 0 || ch === 69 || ch === 82));
  S.sp = $sp;
  return $r0;
}

export async function CheckRestingHeal() {
  let healed: boolean = false, cur: number = 0;
  w16(249032, r16(249032) + 1);
  if (r16(249032) >= 288) {
    healed = false;
    cur = r32(143753);
    while (cur !== 0) {
      if ((await FxEngine.RestoreHitPoints(cur, 1, false))) {
        healed = true;
      }
      cur = r32(cur + 260);
    }
    DisplayRestTime(0);
    TextRend.DisplayString(1, 19, 10, "The Whole Party Is Healed");
    if (healed) {
      (await CharDisp.DisplayParty(r32(143749)));
    }
    (await TextRend.PauseOnly());
    (await CharDisp.ClearMessageWindow());
    w16(249032, 0);
  }
}

export async function CheckMemorizeDone(creature: number, done: number) {
  let lvl: number = 0, i: number = 0, b: number = 0, $r0: number = 0;
  lvl = 0;
  i = 0;
  while ((i <= 47) && (lvl === 0)) {
    b = CharHlp.MemorizedAt(creature, i) & 255;
    if ((b > 127) && CharHlp.IsSpell(b & 127)) {
      if ((U8[done] !== 0)) {
        lvl = U8[(b & 127) * 16 + 136507];
      } else {
        CharHlp.SetMemorizedAt(creature, i, b & 127);
        DisplayRestTime(0);
        (await Magic.PrintCastSpellMsg(creature, "has memorized", b & 127));
        U8[done] = true ? 1 : 0;
      }
    }
    i = (i + 1) & 255;
  }
  $r0 = lvl;
  return $r0;
}

export async function CheckScribeDone(creature: number, done: number) {
  let j: number = 0, sp: number = 0, lvl: number = 0, item: number = 0, nxt: number = 0, held: number = 0, $r0: number = 0;
  lvl = 0;
  item = r32(creature + 200);
  while ((item !== 0) && (lvl === 0)) {
    nxt = r32(item + 42);
    j = 1;
    if (CharHlp.ItemReadable(item)) {
      while ((j <= 3) && (lvl === 0)) {
        if ((U8[item + j + 59] > 128) && CharHlp.IsSpell(U8[item + j + 59] & 127)) {
          if ((U8[done] !== 0)) {
            lvl = U8[(U8[item + j + 59] & 127) * 16 + 136507];
          } else {
            sp = U8[item + j + 59] & 127;
            (await Magic.RemoveSpellFromScroll(creature, item, U8[item + j + 59]));
            DisplayRestTime(0);
            if (Dice.RollDice(1, 100) <= AbilAdj.IntKnowSpellChance(U8[creature + 17])) {
              CharHlp.SetSpellKnown(creature, sp, true);
              (await Magic.PrintCastSpellMsg(creature, "has scribed", sp));
            } else {
              (await CharDisp.PrintTwoLines(rS(creature) + " failed to scribe " + rS(sp * 33 + 133189) + ".", rS(sp * 33 + 133189) + " has been lost."));
            }
            U8[done] = true ? 1 : 0;
            held = r32(creature + 200);
            while ((held !== 0) && (held !== item)) {
              held = r32(held + 42);
            }
            if (held === 0) {
              j = 3;
            }
          }
        }
        j = (j + 1) & 255;
      }
    }
    item = nxt;
  }
  $r0 = lvl;
  return $r0;
}

export async function AdvanceSpellPrep() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let i: number = 0, lvl: number = 0, cur: number = 0;
  i = 1;
  cur = r32(143753);
  while ((cur !== 0) && (i <= 8)) {
    U8[i + 249034] = U8[i + 249034] - 1;
    if ((U8[i + 249034] === 0) && (U8[cur + 44] === 0)) {
      U8[$f0] = false ? 1 : 0;
      lvl = (await CheckScribeDone(cur, $f0)) & 255;
      if (lvl === 0) {
        lvl = (await CheckMemorizeDone(cur, $f0)) & 255;
      }
      U8[i + 249034] = lvl * 3;
    }
    cur = r32(cur + 260);
    i = (i + 1) & 255;
  }
  S.sp = $sp;
}

export async function AdvanceSpellPrepBase(tick: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let i: number = 0, lvl: number = 0, cur: number = 0;
  U8[tick] = U8[tick] + 1;
  if (U8[tick] >= 12) {
    U8[tick] = 0;
    i = 1;
    cur = r32(143753);
    while (cur !== 0) {
      if ((U8[cur + 44] << 24 >> 24) > 0) {
        U8[cur + 44] = U8[cur + 44] - 1;
        if (U8[cur + 44] === 0) {
          U8[$f0] = true ? 1 : 0;
          lvl = (await CheckScribeDone(cur, $f0)) & 255;
          if (lvl === 0) {
            lvl = (await CheckMemorizeDone(cur, $f0)) & 255;
          }
          if (i <= 8) {
            U8[i + 249034] = lvl * 3;
          }
        }
      }
      cur = r32(cur + 260);
      i = (i + 1) & 255;
    }
  }
  S.sp = $sp;
}

export function $init() {
  rt.fill(249018, 14, 0);
  w16(249032, 0);
  U8[249034] = false ? 1 : 0;
}
