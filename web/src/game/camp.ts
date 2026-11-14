// Generated from src/camp.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CharGen from './chargen';
import * as GameTime from './gametime';
import * as C_EFFECT from './c_effect';
import * as C_KEYS from './c_keys';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_SPELL from './c_spell';
import * as C_LEVEL from './c_level';
import * as FxEngine from './fxengine';
import * as Portrait from './portrait';
import * as Options from './options';
import * as Border from './border';
import * as C_TIME from './c_time';
import * as CharHlp from './charhlp';
import * as GameIo from './gameio';
import * as Magic from './magic';
import * as MenuCore from './menucore';
import * as SaveLoad from './saveload';
import * as TextRend from './textrend';
import * as ViewChar from './viewchar';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as Party from './party';
import * as Dice from './dice';
import * as UsualSpl from './usualspl';
import * as Clock from './clock';
import * as Explore from './explore';
import * as FixPlan from './fixplan';
import * as CharExt from './charext';

export const ACT_CAST = 1;
export const ACT_MEMORIZE = 2;
export const ACT_SCRIBE = 3;

export async function CampMainMenu(interrupted: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let savedIfc: number = 0, c: number = 0, saved: boolean = false;
  savedIfc = U8[141176];
  U8[141176] = 2;
  w16(249032, 0);
  rt.fill(249018, 14, 0);
  (await CharDisp.DisplayNoncombatInterface());
  (await Border.ClearBox(1, 17, 38, 22));
  TextRend.DisplayString(1, 18, 10, "The party makes camp...");
  ResetPartySpellActivities();
  U8[interrupted] = false ? 1 : 0;
  c = 32;
  while (((U8[interrupted] !== 0) === false) && !(c === 0 || c === 69)) {
    U8[227104] = true ? 1 : 0;
    c = (await MenuCore.MenuHorizontal("Camp:", rS(250851), 13, 10, 15, true, true, $f0 + 1)) & 255;
    if ((U8[$f0 + 1] !== 0)) {
      if (!(await Explore.SideScreen(c, false, false))) {
        (await SelectOtherChar(c));
      }
    } else {
      switch (c) {
        case 83: {
          saved = (await SaveLoad.SaveGame());
          (await CharDisp.DisplayNoncombatInterface());
          break;
        }
        case 86: {
          (await ViewChar.ViewCharMenu($f0));
          break;
        }
        case 77: {
          (await CampMagicMenu(interrupted));
          break;
        }
        case 82: {
          (await RestForSpellPrep(interrupted));
          break;
        }
        case 65: {
          (await CampAlterMenu());
          break;
        }
        case 70: {
          (await CampFixMenu(interrupted));
          break;
        }
      }
    }
  }
  ResetPartySpellActivities();
  w32(146449, 0);
  U8[141176] = savedIfc;
  (await CharDisp.PrintMiscInfo());
  (await CharDisp.ClearMessageWindow());
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export async function NoncombatCastMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let redraw: boolean = false, spellId: number = 0, caster: number = 0;
  redraw = false;
  w16($f0, -1);
  w32(146449, 0);
  if ((await CanDoSpellActivity(1))) {
    do {
      spellId = (await Magic.CastSpellMenu($f0, $f0 + 2, $f0 + 4)) & 255;
      if (spellId !== 0) {
        redraw = true;
        (await Border.DrawBorder(1, 17, 38, 22, 0));
        (await Border.ClearBox(1, 17, 38, 22));
        if (r32($f0 + 4) === 0) {
          (await Magic.CastSpell(spellId, false, true, $f0 + 3));
        } else {
          caster = r32(143749);
          (await Magic.UseItemSpell(r32($f0 + 4), spellId, true, $f0 + 3));
          CharHlp.RecalcStats(caster);
        }
        w16($f0, -1);
      } else {
        if ((U8[$f0 + 2] !== 0)) {
          redraw = true;
        } else {
          (await CharDisp.PrintNameString(r32(143749), "has no spells memorized", 10, true));
        }
      }
    } while (!(spellId === 0));
  }
  if (redraw) {
    (await CharDisp.DisplayNoncombatInterface());
  }
  S.sp = $sp;
}

export function PendingLevel(b: number) {
  let $r0: number = 0;
  $r0 = 0;
  if ((b > 127) && CharHlp.IsSpell(b & 127)) {
    $r0 = I8[(b & 127) * 16 + 136507] & 255;
  }
  return $r0;
}

export function CampSpellPrepTime(creature: number) {
  let maxMem: number = 0, maxScr: number = 0, cntMem: number = 0, cntScr: number = 0, p: number = 0, i: number = 0, lvl: number = 0, base: number = 0, $r0: number = 0;
  maxMem = 0;
  maxScr = 0;
  cntMem = 0;
  cntScr = 0;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    lvl = PendingLevel(CharHlp.MemorizedAt(creature, i)) & 255;
    if (lvl > maxMem) {
      maxMem = lvl;
    }
    cntMem = (cntMem + lvl) & 65535;
  }
  p = r32(creature + 200);
  while (p !== 0) {
    if (CharHlp.ItemReadable(p)) {
      for (let $i3 = 1; $i3 <= 3; $i3++) {
        i = $i3;
        lvl = PendingLevel(U8[p + i + 59]) & 255;
        if (lvl > maxScr) {
          maxScr = lvl;
        }
        cntScr = (cntScr + lvl) & 65535;
      }
    }
    p = r32(p + 42);
  }
  base = 0;
  if ((cntMem > 0) || (cntScr > 0)) {
    base = 4;
  }
  if ((maxMem > 2) || (maxScr > 2)) {
    base = 6;
  }
  U8[creature + 44] = base;
  $r0 = ((base * 60) + ((cntMem + cntScr) * 15)) & 65535;
  return $r0;
}

export function ResetMemorize(creature: number) {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    if (CharHlp.MemorizedAt(creature, i) > 127) {
      CharHlp.SetMemorizedAt(creature, i, 0);
    }
  }
  U8[creature + 44] = 0;
}

export function ResetScribe(creature: number) {
  let i: number = 0, p: number = 0;
  p = r32(creature + 200);
  while (p !== 0) {
    if (CharHlp.ItemReadable(p)) {
      for (let $i2 = 1; $i2 <= 3; $i2++) {
        i = $i2;
        U8[p + i + 59] = U8[p + i + 59] & 127;
      }
    }
    p = r32(p + 42);
  }
}

export function ResetPartySpellActivities() {
  let p: number = 0;
  p = r32(143753);
  while (p !== 0) {
    ResetMemorize(p);
    ResetScribe(p);
    p = r32(p + 260);
  }
}

export async function CanDoSpellActivity(activity: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: boolean = false;
  wS($f0, 40, "");
  if ((activity === 1) && CharHlp.AntiMagicArea()) {
    wS($f0, 40, "cannot cast spells in this area");
  } else if ((U8[r32(143749) + 268] === 1) || (U8[r32(143749) + 269] === 0)) {
    wS($f0, 40, "is in no condition to ");
    switch (activity) {
      case 1: {
        wS($f0, 40, rS($f0) + "cast any spells");
        break;
      }
      case 2: {
        wS($f0, 40, rS($f0) + "memorize spells");
        break;
      }
      case 3: {
        wS($f0, 40, rS($f0) + "scribe any scrolls");
        break;
      }
    }
  }
  if (rS($f0) === "") {
    $r0 = true;
  } else {
    $r0 = false;
    (await CharDisp.PrintNameString(r32(143749), rS($f0), 10, false));
  }
  S.sp = $sp;
  return $r0;
}

export async function SelectOtherChar(c: number) {
  let was: number = 0;
  was = r32(143749);
  Party.SelectPrevNextChar(c);
  if (r32(143749) !== was) {
    (await CharDisp.ClearMessageWindow());
  }
  (await CharDisp.DisplayParty(r32(143749)));
}

export function DisplaySpellSlots() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let typ: number = 0, lvl: number = 0, row: number = 0, any: boolean = false, has: boolean = false, $r0: boolean = false;
  any = false;
  row = 19;
  for (let $i1 = 0; $i1 <= 2; $i1++) {
    typ = $i1;
    has = false;
    switch (typ) {
      case 0: {
        wS($f0, 40, "Cleric");
        break;
      }
      case 1: {
        wS($f0, 40, "Magic-User");
        break;
      }
      default: {
        wS($f0, 40, "Druid");
      }
    }
    wS($f0, 40, StrUtil.PadRight(rS($f0), 10));
    for (let $i2 = 1; $i2 <= 5; $i2++) {
      lvl = $i2;
      if (CharHlp.SpellSlots(r32(143749), typ, lvl) === 0) {
        wS($f0, 40, rS($f0) + "     ");
      } else {
        wS($f0, 40, rS($f0) + "  " + StrUtil.NumStr(lvl) + ":" + StrUtil.NumStr(UsualSpl.SpellSlotsRemaining(r32(143749), lvl, typ)));
        has = true;
      }
    }
    if (has) {
      any = true;
      TextRend.PrintSpaces(1, row, 0, 38);
      TextRend.DisplayString(1, row, 10, rS($f0));
      row = (row + 1) & 255;
    }
  }
  if (any) {
    TextRend.DisplayString(1, 18, 11, "Spell Slots Remaining");
    while (row <= 21) {
      TextRend.PrintSpaces(1, row, 0, 38);
      row = (row + 1) & 255;
    }
  }
  $r0 = any;
  S.sp = $sp;
  return $r0;
}

export async function SlipAway() {
  let p: number = 0, next: number = 0, cur: number = 0, gone: boolean = false;
  if (!(U8[249034] !== 0)) {
    return;
  }
  cur = r32(143749);
  gone = false;
  p = r32(143753);
  while (p !== 0) {
    next = r32(p + 260);
    if (CharExt.SlipsAway(p) && ((p !== r32(143753)) || (next !== 0))) {
      (await CharDisp.PrintNameString(p, "slipped away while the party slept.", 0, true));
      if (cur === p) {
        cur = 0;
      }
      w32(143749, p);
      SaveLoad.RemoveCreature(false, true);
      gone = true;
    }
    p = next;
  }
  if (cur === 0) {
    cur = r32(143753);
  }
  w32(143749, cur);
  if (gone) {
    (await Border.ClearBox(17, 1, 38, 11));
    (await CharDisp.DisplayParty(r32(143749)));
  }
}

export async function RestForSpellPrep(interrupted: number) {
  let p: number = 0, total: number = 0, t: number = 0;
  if (U8[141200] !== 0) {
    p = r32(143753);
    while (p !== 0) {
      if (((U8[p + 268] !== 1) && (U8[p + 269] !== 0)) && !UsualSpl.HasPending(p)) {
        UsualSpl.QueueUsualSpells(p);
      }
      p = r32(p + 260);
    }
  }
  total = 0;
  p = r32(143753);
  while (p !== 0) {
    t = CampSpellPrepTime(p) & 65535;
    if (total < t) {
      total = t;
    }
    p = r32(p + 260);
  }
  Clock.SetFromMinutes(249018, total);
  U8[interrupted] = (await GameTime.CampRest(true)) ? 1 : 0;
  rt.fill(249018, 14, 0);
  (await SlipAway());
  (await CharDisp.PrintMiscInfo());
}

export function RememberUsualSpells() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 48);
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    U8[$f0 + i] = CharHlp.MemorizedAt(r32(143749), i) & 127;
  }
  UsualSpl.SetUsualSpells(r32(143749), $f0);
  S.sp = $sp;
}

export function RedrawSpellSlots() {
  let junk: boolean = false;
  junk = DisplaySpellSlots();
}

export async function CampMemorizeMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let done: boolean = false, redraw: boolean = false, spellId: number = 0;
  if ((await CanDoSpellActivity(2))) {
    done = false;
    if (!UsualSpl.HasPending(r32(143749))) {
      UsualSpl.QueueUsualSpells(r32(143749));
    }
    w16($f0 + 1, -1);
    spellId = (await Magic.SpellMenu(5, 5, $f0 + 1, $f0)) & 255;
    redraw = true;
    if ((U8[$f0] !== 0)) {
      if ((await MenuCore.YesNoMenu("Memorize These Spells? ", 14, 10, 15)) === 78) {
        ResetMemorize(r32(143749));
      } else {
        RememberUsualSpells();
        done = true;
      }
    } else {
      redraw = false;
    }
    w16($f0 + 1, -1);
    w32(240653, 32);
    while (done === false) {
      done = DisplaySpellSlots() === false;
      if (done) {
        (await CharDisp.PrintNameString(r32(143749), "cannot memorize any spells", 10, true));
      } else {
        spellId = (await Magic.SpellMenu(1, 2, $f0 + 1, $f0)) & 255;
        redraw = true;
        if (spellId === 0) {
          done = true;
        } else if (UsualSpl.SpellSlotsRemaining(r32(143749), I8[spellId * 16 + 136507], I8[spellId * 16 + 136506]) > 0) {
          UsualSpl.PutPending(r32(143749), spellId, $f0 + 3);
          if ((U8[$f0 + 3] !== 0)) {
            UsualSpl.SortMemorizedSpells(r32(143749));
          }
        }
      }
    }
    w32(240653, 0);
    if (ri16($f0 + 1) !== (-1)) {
      w16($f0 + 1, -1);
      spellId = (await Magic.SpellMenu(5, 5, $f0 + 1, $f0)) & 255;
      if ((U8[$f0] !== 0)) {
        if ((await MenuCore.YesNoMenu("Memorize these spells? ", 14, 10, 15)) === 78) {
          ResetMemorize(r32(143749));
        } else {
          RememberUsualSpells();
        }
      }
    }
    if (redraw) {
      (await CharDisp.DisplayNoncombatInterface());
    }
  }
  S.sp = $sp;
}

export async function CampScribeMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let done: boolean = false, redraw: boolean = false, spellId: number = 0, i: number = 0, p: number = 0, found: boolean = false;
  if (!(await CanDoSpellActivity(3))) {
    { S.sp = $sp; return; }
  }
  if (CharHlp.GetClassLevel(r32(143749), 32) <= 0) {
    (await CharDisp.PrintMessage("Scribing a scroll requires arcane training."));
  } else {
    done = false;
    w16($f0 + 1, -1);
    spellId = (await Magic.SpellMenu(6, 0, $f0 + 1, $f0)) & 255;
    redraw = true;
    if ((U8[$f0] !== 0)) {
      if ((await MenuCore.YesNoMenu("Scribe These Spells? ", 14, 10, 15)) === 78) {
        ResetScribe(r32(143749));
      } else {
        done = true;
      }
    } else {
      redraw = false;
    }
    w16($f0 + 1, -1);
    while (done === false) {
      spellId = (await Magic.SpellMenu(3, 3, $f0 + 1, $f0)) & 255;
      if (spellId === 0) {
        done = true;
        if ((U8[$f0] !== 0) === false) {
          (await CharDisp.PrintNameString(r32(143749), "has no copyable scrolls.", 10, true));
        } else {
          redraw = true;
        }
      } else if (!CharHlp.IsSpell(spellId) || !UsualSpl.HasSlotKind(I8[spellId * 16 + 136507], I8[spellId * 16 + 136506])) {
        redraw = true;
        (await CharDisp.PrintBottomLine("You can not scribe that spell."));
      } else {
        redraw = true;
        if (CharHlp.KnowsSpell(r32(143749), spellId)) {
          (await CharDisp.PrintBottomLine("You already know that spell."));
        } else {
          p = r32(r32(143749) + 200);
          found = false;
          while ((p !== 0) && (found === false)) {
            if (CharHlp.ItemReadable(p)) {
              for (let $i3 = 1; $i3 <= 3; $i3++) {
                i = $i3;
                if ((U8[p + i + 59] > 127) && ((U8[p + i + 59] & 127) === spellId)) {
                  (await CharDisp.PrintBottomLine("You are already scribing that spell."));
                  found = true;
                }
              }
            }
            p = r32(p + 42);
          }
          if (found === false) {
            if (CharHlp.SpellSlots(r32(143749), I8[spellId * 16 + 136506], I8[spellId * 16 + 136507]) > 0) {
              p = r32(r32(143749) + 200);
              while ((p !== 0) && (found === false)) {
                if (CharHlp.ItemReadable(p)) {
                  i = 1;
                  do {
                    if (U8[p + i + 59] === spellId) {
                      U8[p + i + 59] = U8[p + i + 59] | 128;
                      found = true;
                    }
                    i = (i + 1) & 255;
                  } while (!((i > 3) || found));
                }
                p = r32(p + 42);
              }
            } else {
              (await CharDisp.PrintBottomLine("You can not scribe that spell."));
            }
          }
        }
      }
    }
    if (ri16($f0 + 1) !== (-1)) {
      w16($f0 + 1, -1);
      spellId = (await Magic.SpellMenu(6, 0, $f0 + 1, $f0)) & 255;
      if ((U8[$f0] !== 0)) {
        if ((await MenuCore.YesNoMenu("Scribe these spells? ", 14, 10, 15)) === 78) {
          ResetScribe(r32(143749));
        }
      }
    }
    if (redraw) {
      (await CharDisp.DisplayNoncombatInterface());
    }
  }
  S.sp = $sp;
}

export async function CampDisplayMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 52);
  let effect: number = 0, ch: number = 0, id: number = 0, k: number = 0, cnt: number = 0, found: boolean = false, show: boolean = false, c: number = 0;
  w32($f0, rt.getMem(46));
  w32($f0 + 4, r32($f0));
  U8[r32($f0 + 4) + 41] = 0;
  wS(r32($f0 + 4), 40, " ");
  w32(r32($f0 + 4) + 42, 0);
  ch = r32(143753);
  while (ch !== 0) {
    cnt = 0;
    MenuCore.AppendMenuLine($f0, $f0 + 4, rS(ch), true);
    effect = r32(ch + 127);
    while (effect !== 0) {
      show = true;
      id = U8[effect];
      switch (id) {
        case 1: case 2: case 5: case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 16: case 17:
        case 19: case 20: case 21: case 22: case 23: case 24: case 25: case 28: case 29: case 32: case 33: case 34:
        case 36: case 37: case 38: case 39: case 41: case 42: case 45: case 46: case 49: case 51: case 52: case 53:
        case 142: case 144: case 145: case 146: case 148: case 152: case 153: case 154: case 155: case 156: {
          k = 1;
          found = false;
          while ((k <= 100) && (found === false)) {
            if (CharHlp.IsSpell(k) && (U8[k * 16 + 136516] === id)) {
              wS($f0 + 9, 40, rS(k * 33 + 133189));
              found = true;
            } else {
              k = (k + 1) & 255;
            }
          }
          if (found === false) {
            wS($f0 + 9, 40, "Funky--" + StrUtil.NumStr(id));
          }
          break;
        }
        case 4: {
          wS($f0 + 9, 40, "Studying Manual of Bodily Health");
          break;
        }
        case 7: {
          wS($f0 + 9, 40, "Training with Manual of Bodily Health");
          break;
        }
        case 27: {
          wS($f0 + 9, 40, "Feather Fall");
          break;
        }
        case 31: {
          wS($f0 + 9, 40, "Helpless");
          break;
        }
        case 35: {
          wS($f0 + 9, 40, "Prayer");
          break;
        }
        case 44: {
          wS($f0 + 9, 40, "Cause Disease");
          break;
        }
        case 50: {
          wS($f0 + 9, 40, "Dreaded Mummy Disease");
          break;
        }
        case 54: {
          wS($f0 + 9, 40, "Repulsed");
          break;
        }
        case 55: {
          wS($f0 + 9, 40, "Poisoned");
          break;
        }
        case 59: {
          wS($f0 + 9, 40, "Regenerating");
          break;
        }
        case 61: {
          wS($f0 + 9, 40, "Fire Resistance");
          break;
        }
        case 71: {
          wS($f0 + 9, 40, "Invisible");
          break;
        }
        case 72: {
          wS($f0 + 9, 40, "Camouflaged");
          break;
        }
        case 89: {
          wS($f0 + 9, 40, "Displaced");
          break;
        }
        case 147: {
          wS($f0 + 9, 40, "Berserk");
          break;
        }
        case 149: {
          wS($f0 + 9, 40, "Fire Shield (Hot)");
          break;
        }
        case 150: {
          wS($f0 + 9, 40, "Fire Shield (Cold)");
          break;
        }
        default: {
          show = false;
        }
      }
      if (show) {
        cnt = (cnt + 1) & 255;
        MenuCore.AppendMenuLine($f0, $f0 + 4, " " + rS($f0 + 9), false);
      }
      effect = r32(effect + 5);
    }
    if (cnt === 0) {
      MenuCore.AppendMenuLine($f0, $f0 + 4, " <No Spell Effects>", false);
    }
    MenuCore.AppendMenuLine($f0, $f0 + 4, " ", false);
    ch = r32(ch + 260);
  }
  U8[$f0 + 8] = true ? 1 : 0;
  w16($f0 + 50, 0);
  (await Border.DrawWindow(1, 1, 38, 22, 0, 15, "Display"));
  c = (await MenuCore.MenuVertical("", "", 11, 10, 15, 1, 4, 38, 22, r32($f0), true, $f0 + 8, $f0 + 50, $f0 + 4)) & 255;
  MenuCore.FreeStringList($f0);
  (await CharDisp.DisplayNoncombatInterface());
  S.sp = $sp;
}

export async function CampMagicMenu(interrupted: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let c: number = 0;
  c = 32;
  while (((U8[interrupted] !== 0) === false) && !(c === 0 || c === 69)) {
    c = (await MenuCore.MenuHorizontal("", rS(250687), 13, 10, 15, true, true, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      (await SelectOtherChar(c));
    } else {
      switch (c) {
        case 67: {
          (await NoncombatCastMenu());
          break;
        }
        case 77: {
          (await CampMemorizeMenu());
          break;
        }
        case 83: {
          (await CampScribeMenu());
          break;
        }
        case 68: {
          (await CampDisplayMenu());
          break;
        }
        case 82: {
          (await RestForSpellPrep(interrupted));
          break;
        }
      }
    }
  }
  S.sp = $sp;
}

export function OrderMoveUp() {
  let prev: number = 0, p: number = 0, savedNext: number = 0;
  p = r32(143753);
  prev = 0;
  if (p === r32(143749)) {
    p = Party.LastCreature();
  } else {
    while (r32(p + 260) !== r32(143749)) {
      prev = p;
      p = r32(p + 260);
    }
  }
  savedNext = r32(r32(143749) + 260);
  if (r32(143753) === r32(143749)) {
    if (savedNext !== 0) {
      w32(143753, savedNext);
    }
    w32(p + 260, r32(143749));
    w32(r32(143749) + 260, 0);
  } else {
    w32(p + 260, savedNext);
    w32(r32(143749) + 260, p);
    if ((p === r32(143753)) || (prev === 0)) {
      w32(143753, r32(143749));
    } else {
      w32(prev + 260, r32(143749));
    }
  }
}

export function OrderMoveDown() {
  let p: number = 0, next: number = 0;
  p = r32(143753);
  if (p !== r32(143749)) {
    while (r32(p + 260) !== r32(143749)) {
      p = r32(p + 260);
    }
  }
  next = r32(r32(143749) + 260);
  if (next === 0) {
    w32(r32(143749) + 260, r32(143753));
    w32(143753, r32(143749));
    w32(p + 260, next);
  } else {
    w32(r32(143749) + 260, r32(next + 260));
    if (r32(143753) === r32(143749)) {
      w32(143753, next);
    }
    if (p !== r32(143749)) {
      w32(p + 260, next);
    }
    w32(next + 260, r32(143749));
  }
}

export async function CampOrderMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let selected: number = 0, c: number = 0;
  selected = 0;
  c = 32;
  while (!(c === 0 || c === 69)) {
    c = (await MenuCore.MenuHorizontal("Party Order: ", rS(selected * 41 + 250728), 13, 10, 15, true, true, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      if (selected === 0) {
        (await SelectOtherChar(c));
      } else {
        switch (c) {
          case 71: case 72: {
            OrderMoveUp();
            break;
          }
          case 79: case 80: {
            OrderMoveDown();
            break;
          }
        }
        (await CharDisp.DisplayParty(r32(143749)));
      }
    } else if (c === 80 || c === 83) {
      selected = (selected === 0 ? 1 : 0);
      if (selected !== 0) {
        (await CharDisp.PrintNameString(r32(143749), "has been selected", 10, false));
      } else {
        (await CharDisp.ClearMessageWindow());
      }
    }
  }
  S.sp = $sp;
}

export async function CampDropMenu() {
  if ((r32(r32(143749) + 260) === 0) && (r32(143749) === r32(143753))) {
    if ((await MenuCore.YesNoMenu("quit TO DOS: ", 14, 10, 15)) === 89) {
      SaveLoad.RemoveCreature(false, true);
      (await GameIo.ExitGame());
    }
    return;
  }
  (await CharDisp.PrintNameString(r32(143749), "will be gone", 10, false));
  if ((await MenuCore.YesNoMenu("Drop from party? ", 14, 10, 15)) === 89) {
    if (U8[r32(143749) + 269] !== 0) {
      (await CharDisp.PrintNameString(r32(143749), "bids you farewell.", 10, true));
    } else {
      (await CharDisp.PrintNameString(r32(143749), "is dumped in a ditch.", 10, true));
    }
    SaveLoad.RemoveCreature(false, true);
    (await Border.ClearBox(17, 1, 38, 11));
    (await CharDisp.DisplayParty(r32(143749)));
  } else {
    (await CharDisp.PrintNameString(r32(143749), "Breathes A sigh of relief.", 10, true));
  }
}

export async function CampAlterMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let c: number = 0, c2: number = 0;
  c = 32;
  while (!(c === 0 || c === 69)) {
    c = (await MenuCore.MenuHorizontal("Alter: ", rS(250810), 13, 10, 15, true, true, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      (await SelectOtherChar(c));
    } else {
      switch (c) {
        case 79: {
          (await CampOrderMenu());
          break;
        }
        case 68: {
          (await CampDropMenu());
          break;
        }
        case 67: {
          do {
            if ((await Portrait.PlayerPortraitsHere())) {
              wS($f0 + 1, 40, "Icon Portrait Exit");
            } else {
              wS($f0 + 1, 40, "Icon Exit");
            }
            c2 = (await MenuCore.MenuHorizontal("Character: ", rS($f0 + 1), 13, 10, 15, true, true, $f0)) & 255;
            if ((U8[$f0] !== 0)) {
              (await SelectOtherChar(c2));
            } else {
              switch (c2) {
                case 73: {
                  (await CharGen.CustomizeIcon());
                  (await CharDisp.DisplayNoncombatInterface());
                  break;
                }
                case 80: {
                  if ((await Portrait.PlayerPortraitsHere())) {
                    (await CharGen.CustomizePortrait(true));
                    (await CharDisp.DisplayNoncombatInterface());
                  }
                  break;
                }
              }
            }
          } while (!(!(U8[$f0] !== 0) && (c2 === 0 || c2 === 69)));
          break;
        }
        case 83: {
          (await Options.OptionsMenu());
          (await CharDisp.DisplayNoncombatInterface());
          break;
        }
      }
    }
  }
  S.sp = $sp;
}

export async function CampFixMenu(interrupted: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2663);
  let reportCount: number = 0, used: number = 0, p: number = 0, i: number = 0, k: number = 0, cond: number = 0, spell: number = 0, cast: number = 0, healPool: number = 0, hp: number = 0, done: boolean = false, rested: boolean = false, goOn: boolean = false;
  function Note(s: string) {
    if (reportCount < 24) {
      reportCount = (reportCount + 1) & 255;
      wS($f0 + reportCount * 101 + 97, 100, s);
    } else {
      wS($f0 + 2521, 100, "Fix used more than this list shows.");
    }
  }
  async function Perform(use: number) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 81);
    used = (used + 1) & 255;
    switch (U8[use]) {
      case 2: {
        if ((await ViewChar.PaladinHeal(r32(use + 1), r32(use + 10)))) {
          (await CharDisp.PrintHpRestoreMsg(r32(use + 10)));
        }
        if (r32(use + 1) === r32(use + 10)) {
          Note("Fix: " + rS(r32(use + 1)) + " laid on hands.");
        } else {
          Note("Fix: " + rS(r32(use + 1)) + " laid hands on " + rS(r32(use + 10)) + ".");
        }
        break;
      }
      case 3: {
        (await ViewChar.PaladinCure(r32(use + 1), r32(use + 10)));
        Note("Fix: " + rS(r32(use + 1)) + " cured " + rS(r32(use + 10)) + "'s disease.");
        break;
      }
      default: {
        wS($f1, 80, CharHlp.ItemName(r32(use + 5), 1));
        (await Magic.CastItemSpellOn(r32(use + 1), r32(use + 5), U8[use + 9], r32(use + 10)));
        if (r32(use + 1) === r32(use + 10)) {
          Note("Fix: " + rS(r32(use + 1)) + " used " + rS($f1) + ".");
        } else {
          Note("Fix: " + rS(r32(use + 1)) + " used " + rS($f1) + " on " + rS(r32(use + 10)) + ".");
        }
      }
    }
    S.sp = $sp;
  }
  function NoteDrained() {
    let c: number = 0, m: number = 0, kind: number = 0, missing: number = 0;
    c = r32(143753);
    while (c !== 0) {
      missing = 0;
      for (let $i2 = 1; $i2 <= 4; $i2++) {
        kind = $i2;
        if ((missing === 0) && FixPlan.DrainedOutOf(c, FixPlan.CureSpell(kind))) {
          m = r32(143753);
          while (m !== 0) {
            if (FixPlan.Treatable(m) && (FixPlan.CondCount(m, kind) > 0)) {
              missing = FixPlan.CureSpell(kind) & 255;
            }
            m = r32(m + 260);
          }
        }
      }
      if (missing !== 0) {
        Note(rS(c) + " is level drained and can't cast " + rS(missing * 33 + 133189) + ".");
      }
      c = r32(c + 260);
    }
  }
  async function ShowReport() {
    let n: number = 0;
    for (let $i4 = 1, $e4 = reportCount; $i4 <= $e4; $i4++) {
      n = $i4;
      if (n > 1) {
        if (U8[143769] !== 1) {
          U8[143769] = 1;
          U8[143770] = U8[143770] + 1;
        }
        if (U8[143770] > 22) {
          (await CharDisp.MessageWait());
        }
      }
      (await CharDisp.MessageText(rS($f0 + n * 101 + 97), 10, (n === 1) || (U8[143770] > 22)));
    }
  }
  U8[interrupted] = false ? 1 : 0;
  if (CharHlp.AntiMagicArea()) {
    (await CharDisp.PrintMessage("Spells cannot be cast in this area."));
    { S.sp = $sp; return; }
  }
  reportCount = 0;
  used = 0;
  while ((used < 100) && FixPlan.NextUse(true, $f0 + 184)) {
    (await Perform($f0 + 184));
  }
  FixPlan.Plan($f0);
  rested = FixPlan.HasCasts($f0);
  goOn = true;
  if (rested) {
    Clock.SetFromMinutes(249018, FixPlan.RestMinutes($f0));
    U8[interrupted] = (await GameTime.CampRest(false)) ? 1 : 0;
    done = (((r16(249026) === 0) && (r16(249024) === 0)) && (r16(249022) === 0)) && (r16(249020) === 0);
    rt.fill(249018, 14, 0);
    goOn = done && !(U8[interrupted] !== 0);
    if (goOn) {
      for (let $i6 = 1, $e6 = U8[$f0]; $i6 <= $e6; $i6++) {
        i = $i6;
        for (let $i7 = 1; $i7 <= 4; $i7++) {
          cond = $i7;
          for (let $i8 = 1, $e8 = U8[$f0 + i * 4 + cond + 108]; $i8 <= $e8; $i8++) {
            k = $i8;
            spell = FixPlan.CureSpell(cond) & 255;
            w32(146161, r32($f0 + i * 4 - 3));
            U8[146160] = 1;
            U8[144900] = spell;
            (await rt.FT[r32(spell * 4 + 145644)]());
            U8[144900] = 0;
          }
        }
      }
      healPool = 0;
      for (let $i9 = 1, $e9 = r16($f0 + 177); $i9 <= $e9; $i9++) {
        cast = $i9;
        healPool = (healPool + Dice.RollDice(1, 8)) & 65535;
      }
      for (let $i10 = 1, $e10 = U8[$f0]; $i10 <= $e10; $i10++) {
        i = $i10;
        p = r32($f0 + i * 4 - 3);
        if (((FixPlan.Treatable(p) && (U8[p + 283] < U8[p + 50])) && (healPool > 0)) && !FixPlan.Rotted(p)) {
          hp = (U8[p + 50] - U8[p + 283]) & 65535;
          if (hp > healPool) {
            hp = healPool;
          }
          if ((await FxEngine.RestoreHitPoints(p, hp, false))) {
            healPool = (healPool - hp) & 65535;
          }
        }
      }
    }
  }
  if (goOn) {
    while ((used < 100) && FixPlan.NextUse(false, $f0 + 184)) {
      (await Perform($f0 + 184));
    }
    NoteDrained();
  }
  if (!rested && (used === 0)) {
    if (U8[$f0 + 182] === 0) {
      wS($f0 + 2622, 40, "No clerics available to heal.");
    } else if (U8[$f0 + 183] === 0) {
      wS($f0 + 2622, 40, "No cleric is in a condition to heal.");
    } else if ((r16($f0 + 179) === 0) && !(U8[$f0 + 181] !== 0)) {
      wS($f0 + 2622, 40, "Further healing would do no good.");
    } else {
      wS($f0 + 2622, 40, "Further healing isn't possible.");
    }
    if (reportCount === 0) {
      (await CharDisp.PrintMessage(rS($f0 + 2622)));
    } else {
      if (reportCount < 24) {
        reportCount = (reportCount + 1) & 255;
      }
      for (let $i12 = reportCount; $i12 >= 2; $i12--) {
        i = $i12;
        wS($f0 + i * 101 + 97, 100, rS($f0 + (i - 1) * 101 + 97));
      }
      wS($f0 + 198, 100, rS($f0 + 2622));
    }
  }
  (await CharDisp.DisplayParty(r32(143749)));
  (await CharDisp.PrintMiscInfo());
  (await ShowReport());
  if (rested) {
    (await SlipAway());
  }
  (await CharDisp.DisplayParty(r32(143749)));
  (await CharDisp.PrintMiscInfo());
  S.sp = $sp;
}
