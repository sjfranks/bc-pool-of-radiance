// Generated from src/viewchar.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as DaxIo from './daxio';
import * as TextRend from './textrend';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as Portrait from './portrait';
import * as CbtMap from './cbtmap';
import * as Money from './money';
import * as Magic from './magic';
import * as FxEngine from './fxengine';
import * as C_EFFECT from './c_effect';
import * as C_EQUIP from './c_equip';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_STAT from './c_stat';
import * as C_MONEY from './c_money';
import * as C_SAVE from './c_save';
import * as Vault from './vault';
import * as Stats from './stats';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as MoneyCal from './moneycal';
import * as C_MSG from './c_msg';
import * as ClassCal from './classcal';
import * as C_ITEM from './c_item';
import * as C_SPELL from './c_spell';
import * as SpellInf from './spellinf';
import * as Party from './party';

export const KILL_TOP = 6;
export const KILL_ROWS = 15;
export const KILL_COL_WIDTH = 18;
export const KILLS_SHOWN = 30;
export const PAGE_SAVES = 1;
export const PAGE_STATS = 2;
export const PAGE_KILLS = 3;
export const PAGE_THIEF = 4;
export const PAGE_CLERIC = 5;

export const $at = { tradeTarget: 247711 };

export async function DisplayChar(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 265);
  let row: number = 0, i: number = 0, j: number = 0, multi: boolean = false;
  (await TextRend.ClearScreen());
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  CharDisp.DisplayCreatureName(creature, 1, 1, false);
  if (CharHlp.IsNpc(creature)) {
    TextRend.DisplayString(U8[creature] + 3, 1, 10, "(NPC)");
  }
  U8[$f0] = 1;
  wS($f0 + 1, 255, rS(U8[creature + 158] * 7 + 132624));
  TextRend.DisplayString(U8[$f0], 3, 15, rS($f0 + 1));
  U8[$f0] = (U8[$f0] + U8[$f0 + 1]) + 1;
  wS($f0 + 1, 255, rS(I8[creature + 46] * 9 + 132408));
  TextRend.DisplayString(U8[$f0], 3, 15, rS($f0 + 1));
  U8[$f0] = (U8[$f0] + U8[$f0 + 1]) + 1;
  TextRend.DisplayString(U8[$f0], 3, 15, "Age " + StrUtil.NumStr(r16(creature + 48)));
  wS($f0 + 1, 255, rS(U8[creature + 160] * 16 + 132480));
  TextRend.DisplayString(1, 4, 15, rS($f0 + 1));
  if (!CharHlp.IsDualClass(creature)) {
    TextRend.DisplayString(1, 5, 15, rS(I8[creature + 47] * 26 + 131942));
  }
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    i = $i1;
    TextRend.DisplayString(1, i + 7, 10, rS(i * 4 + 132384) + " ");
    (await PrintStat(i, false));
  }
  (await PrintMoney());
  TextRend.DisplayString(1, 15, 15, "Level");
  Magic.DrainedByClass(creature, $f0 + 257);
  if (CharHlp.IsDualClass(creature)) {
    DrawDualClass(creature, 5, 15, $f0 + 257, $f0);
  } else {
    multi = false;
    U8[$f0] = 7;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      j = $i2;
      if (I8[creature + j + 150] > 0) {
        if (multi) {
          DrawLevel(creature, j, U8[$f0 + j + 257], 15, 15, "/", "", $f0);
        } else {
          DrawLevel(creature, j, U8[$f0 + j + 257], 15, 15, "", "", $f0);
        }
        multi = true;
      }
    }
  }
  if (U8[$f0] < 16) {
    U8[$f0] = 16;
  }
  TextRend.DisplayString(U8[$f0] + 1, 15, 15, "Exp " + StrUtil.NumStr(ri32(creature + 172)));
  PrintCombatStats();
  row = 20;
  if (r32(creature + 204) !== 0) {
    TextRend.DisplayString(1, row, 15, "Weapon");
    CharDisp.PrintItemLabel(r32(creature + 204), 8, row);
  }
  row = (row + 1) & 255;
  if (r32(creature + 212) !== 0) {
    TextRend.DisplayString(2, row, 15, "Armor");
    CharDisp.PrintItemLabel(r32(creature + 212), 8, row);
  }
  row = (row + 1) & 255;
  TextRend.DisplayString(1, row, 15, "Status");
  wS($f0 + 1, 255, rS(U8[creature + 268] * 12 + 132701));
  TextRend.DisplayString(8, row, 10, rS($f0 + 1));
  TextRend.DisplayString(8 + U8[$f0 + 1], row, 12, SecondaryStatus(creature));
  if (((U8[141177] !== 0) && (U8[141178] !== 0)) && (await Portrait.PlayerPortraitsHere())) {
    (await Portrait.DisplayCharPortrait());
  }
  S.sp = $sp;
}

export function SecondaryStatus(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 45);
  let $r0: string = "";
  wS($f0, 40, "");
  if (CharHlp.HasEffect(creature, 55, $f0 + 41)) {
    wS($f0, 40, rS($f0) + ", Poisoned");
  }
  if (U8[creature + 116] > 0) {
    wS($f0, 40, rS($f0) + ", Drained");
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function PrintCombatStats() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let p: number = 0, row: number = 0, col: number = 0, mv: number = 0;
  p = r32(143749);
  CharHlp.RecalcStats(p);
  row = 17;
  TextRend.DisplayString(1, row, 15, "AC    ");
  CharDisp.PrintArmorClass(p, 4, row);
  TextRend.DisplayString(1, row + 1, 15, "HP    ");
  CharDisp.PrintHitPoints(p, 4, row + 1, false);
  col = 8;
  TextRend.DisplayString(col + 1, row, 15, "THAC0   ");
  TextRend.DisplayString(col + 7, row, 10, StrUtil.NumStr(60 - U8[p + 272]));
  wS($f0, 40, StrUtil.NumStr(U8[p + 277]) + "d" + StrUtil.NumStr(U8[p + 279]));
  if (I8[p + 281] > 0) {
    wS($f0, 40, rS($f0) + "+" + StrUtil.NumStr(I8[p + 281]));
  }
  if (I8[p + 281] < 0) {
    wS($f0, 40, rS($f0) + "-" + StrUtil.NumStr(Math.abs(I8[p + 281])));
  }
  TextRend.DisplayString(col, row + 1, 15, "Damage        ");
  TextRend.DisplayString(col + 7, row + 1, 10, rS($f0));
  TextRend.DisplayString(col, row + 2, 15, "Att/Rd        ");
  TextRend.DisplayString(col + 7, row + 2, 10, StrUtil.HalvesStr(U8[p + 161]));
  col = 22;
  TextRend.DisplayString(col, row, 15, "Encumbrance      ");
  TextRend.DisplayString(col + 12, row, 10, StrUtil.NumStr(r16(p + 258)));
  mv = CharHlp.HasteSlowRate(p, U8[p + 284]) & 255;
  TextRend.DisplayString(col + 3, row + 1, 15, "Movement   ");
  TextRend.DisplayString(col + 12, row + 1, 10, StrUtil.NumStr(mv));
  S.sp = $sp;
}

export async function PrintStat(statIdx: number, modifying: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let col: number = 0, hlCol: number = 0;
  if (modifying) {
    hlCol = 13;
  } else {
    hlCol = 10;
  }
  col = 5;
  (await Border.ClearBox(col, statIdx + 7, 11, statIdx + 7));
  if (U8[r32(143749) + statIdx + 16] < 10) {
    col = (col + 1) & 255;
  }
  TextRend.DisplayString(col, statIdx + 7, hlCol, StrUtil.NumStr(U8[r32(143749) + statIdx + 16]));
  if (((statIdx === 0) && (U8[r32(143749) + 16] === 18)) && (U8[r32(143749) + 22] > 0)) {
    wS($f0, 40, StrUtil.ZeroPad2(U8[r32(143749) + 22]));
    TextRend.DisplayString(7, 7, hlCol, "(" + rS($f0) + ")");
  }
  S.sp = $sp;
}

export async function PrintMoney() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let row: number = 0, m: number = 0;
  (await Border.ClearBox(12, 7, 26, 14));
  row = 7;
  for (let $i1 = 6; $i1 >= 0; $i1--) {
    m = $i1;
    if (r16(r32(143749) + m * 2 + 136) > 0) {
      wS($f0, 40, rS(m * 9 + 132638));
      TextRend.DisplayString(20 - U8[$f0], row, 10, rS($f0));
      TextRend.DisplayString(21, row, 10, StrUtil.NumStr(r16(r32(143749) + m * 2 + 136)));
      row = (row + 1) & 255;
    }
  }
  S.sp = $sp;
}

export async function ViewCharMenu(done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 45);
  let ch: number = 0, hasMoney: boolean = false, i: number = 0, j: number = 0, shown: number = 0;
  if (U8[141176] === 5) {
    (await CbtMap.SetNoncombatPalette());
  }
  ch = 32;
  U8[done] = false ? 1 : 0;
  w32(247711, r32(143749));
  shown = r32(143749);
  (await DisplayChar(shown));
  DrawMoreInfoLabel();
  while (!(ch === 0 || ch === 69) && !(U8[done] !== 0)) {
    wS($f0, 40, "");
    U8[$f0 + 41] = false ? 1 : 0;
    hasMoney = false;
    for (let $i2 = 0; $i2 <= 47; $i2++) {
      i = $i2;
      if (CharHlp.MemorizedAt(shown, i) > 0) {
        U8[$f0 + 41] = true ? 1 : 0;
      }
    }
    for (let $i3 = 0; $i3 <= 6; $i3++) {
      j = $i3;
      if (r16(shown + j * 2 + 136) > 0) {
        hasMoney = true;
      }
    }
    if (r32(shown + 200) !== 0) {
      wS($f0, 40, rS($f0) + "Items ");
    }
    if ((U8[$f0 + 41] !== 0)) {
      wS($f0, 40, rS($f0) + "Spells ");
    }
    if ((CharHlp.MayTrade(shown) && hasMoney) && (U8[141176] !== 5)) {
      wS($f0, 40, rS($f0) + "Trade ");
    }
    if (hasMoney && (U8[141176] === 8)) {
      wS($f0, 40, rS($f0) + "Deposit ");
    } else if (hasMoney) {
      wS($f0, 40, rS($f0) + "Drop ");
    }
    if (CharHlp.PaladinCanHeal(shown)) {
      wS($f0, 40, rS($f0) + "Heal ");
    }
    if (CharHlp.PaladinCanCure(shown)) {
      wS($f0, 40, rS($f0) + "Cure ");
    }
    wS($f0, 40, rS($f0) + "Exit");
    wS(227083, 16, "M");
    U8[227105] = U8[141176] !== 5 ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, false, false, $f0 + 42)) & 255;
    w16($f0 + 43, -1);
    if ((U8[$f0 + 42] !== 0)) {
      if ((await AltItems(ch))) {
        shown = r32(143749);
        (await DisplayChar(shown));
        DrawMoreInfoLabel();
      }
      ch = 32;
    }
    switch (ch) {
      case 73: {
        (await UseItemMenu(done));
        break;
      }
      case 83: {
        i = (await Magic.SpellMenu(0, 0, $f0 + 43, $f0 + 41)) & 255;
        break;
      }
      case 84: {
        (await TradeTreasureMenu());
        break;
      }
      case 68: {
        (await DropMoneyMenu());
        (await PrintMoney());
        PrintCombatStats();
        break;
      }
      case 72: {
        if (CharHlp.PaladinCanHeal(shown)) {
          (await LayOnHands(shown));
        }
        break;
      }
      case 67: {
        if (CharHlp.PaladinCanCure(shown)) {
          (await CureDisease(shown));
        }
        break;
      }
      case 77: {
        (await MorePage());
        break;
      }
    }
    if (!(U8[done] !== 0) && (ch === 73 || ch === 83 || ch === 84 || ch === 72 || ch === 67 || ch === 77)) {
      shown = r32(143749);
      (await DisplayChar(shown));
      DrawMoreInfoLabel();
    }
  }
  if (U8[141176] === 5) {
    (await CbtMap.SetCombatPalette());
  }
  (await CharDisp.DisplayNoncombatInterface());
  S.sp = $sp;
}

export async function UseItemMenu(done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 48);
  let ch: number = 0, needRedraw: boolean = false, p: number = 0, creature: number = 0, member: number = 0, itemCount: number = 0;
  creature = r32(143749);
  ch = 32;
  w32($f0 + 42, r32(creature + 200));
  w16($f0 + 46, 0);
  U8[$f0 + 41] = true ? 1 : 0;
  needRedraw = true;
  while (((!(ch === 0 || ch === 69) && !(U8[done] !== 0)) && (U8[creature + 199] > 0)) && (r32(creature + 200) !== 0)) {
    itemCount = U8[creature + 199];
    p = MenuCore.FindListMember(ri16($f0 + 46), r32(creature + 200));
    while ((p === 0) && (ri16($f0 + 46) > 0)) {
      w16($f0 + 46, ri16($f0 + 46) - 1);
      p = MenuCore.FindListMember(ri16($f0 + 46), r32(creature + 200));
    }
    wS($f0, 40, ItemMenuLine(creature, p));
    p = r32(creature + 200);
    while (p !== 0) {
      CharHlp.ItemLabel(p, true);
      p = r32(p + 42);
    }
    if (needRedraw || (U8[144905] !== 0)) {
      (await TextRend.ClearScreen());
      (await Border.DrawBorder(1, 1, 38, 22, 0));
      CharDisp.DisplayCreatureName(creature, 1, 1, true);
      TextRend.DisplayString(U8[creature] + 4, 1, 10, "Items");
      (await Border.DrawWindow(1, 3, 38, 22, 0, 0, ""));
      TextRend.DisplayString(1, 3, 15, "Ready Item");
      if (TagsSets()) {
        TextRend.DisplayString(36, 3, 15, "Set");
      }
      U8[$f0 + 41] = true ? 1 : 0;
      needRedraw = false;
      U8[144905] = 0;
    }
    wS(227083, 16, "");
    if (TagsSets()) {
      wS(227083, 16, "12");
    }
    if ((U8[141208] !== 0)) {
      wS(227083, 16, rS(227083) + "V");
    }
    U8[227106] = true ? 1 : 0;
    U8[227105] = U8[141176] !== 5 ? 1 : 0;
    ch = (await MenuCore.MenuVertical("", rS($f0), 13, 10, 15, 1, 5, 38, 22, r32(creature + 200), true, $f0 + 41, $f0 + 46, $f0 + 42)) & 255;
    if ((U8[227107] !== 0)) {
      ch = 32;
    } else if (Party.AltMember(ch) > 0) {
      member = Party.MemberAt(Party.AltMember(ch));
      if ((member !== 0) && (member !== creature)) {
        if ((U8[member + 199] === 0) || (r32(member + 200) === 0)) {
          (await TextRend.DisplayAndPause(14, rS(member) + " has no items."));
          TextRend.ClearBottomLine();
        } else {
          creature = member;
          w32(143749, member);
          w32(247711, member);
          w16($f0 + 46, 0);
          needRedraw = true;
        }
      }
      ch = 32;
    } else if (r32($f0 + 42) !== 0) {
      switch (ch) {
        case 86: {
          if ((U8[141208] !== 0)) {
            (await ViewItemDetail(r32($f0 + 42)));
            needRedraw = true;
          }
          break;
        }
        case 82: {
          (await FxEngine.ToggleReadyItem(r32($f0 + 42)));
          break;
        }
        case 49: case 50: {
          if (TagsSets()) {
            (await TagSet(r32($f0 + 42), ch - 48));
            U8[$f0 + 41] = true ? 1 : 0;
          }
          break;
        }
        case 85: {
          if ((U8[r32($f0 + 42) + 52] === 0) && !CharHlp.CastableScroll(creature, r32($f0 + 42))) {
            (await CharDisp.PrintBottomLine("Must be Readied"));
            ch = 32;
          } else if (CharHlp.ItemReadable(r32($f0 + 42)) || (CharHlp.ItemSpell(r32($f0 + 42)) !== 0)) {
            (await Magic.UseItem(r32($f0 + 42), done));
            if (U8[141176] !== 5) {
              U8[done] = false ? 1 : 0;
            }
            if (!(U8[done] !== 0)) {
              needRedraw = true;
            }
          }
          break;
        }
        case 84: {
          if ((await CheckItemAvail(r32($f0 + 42)))) {
            (await ItemTradeMenu(r32($f0 + 42)));
          } else {
            ch = 32;
          }
          needRedraw = true;
          break;
        }
        case 68: {
          if (!(await CheckItemAvail(r32($f0 + 42)))) {
            ch = 32;
          } else if (U8[141176] === 8) {
            if (Vault.HasRoom()) {
              (await Vault.DepositItem(r32(143749), r32($f0 + 42)));
              U8[$f0 + 41] = true ? 1 : 0;
            } else {
              (await TextRend.DisplayAndPause(14, "The vault is full."));
            }
          } else {
            CharHlp.ItemLabel(r32($f0 + 42), false);
            (await SayBelow(true, "Your " + rS(r32($f0 + 42)) + "will be gone forever"));
            if ((await MenuCore.YesNoMenu("Drop It? ", 13, 10, 15)) === 89) {
              (await CharHlp.RemoveItem(r32(143749), r32($f0 + 42)));
              U8[$f0 + 41] = true ? 1 : 0;
            }
            (await Border.ClearBox(1, 21, 38, 22));
          }
          break;
        }
        case 72: {
          (await HalveItem(r32($f0 + 42)));
          break;
        }
        case 74: {
          (await CharHlp.JoinStacks(r32(143749), r32($f0 + 42)));
          break;
        }
        case 83: {
          if ((await CheckItemAvail(r32($f0 + 42)))) {
            (await SellItem(r32($f0 + 42)));
          } else {
            ch = 32;
          }
          break;
        }
        case 73: {
          if (U8[141176] === 1) {
            (await IdentifyItem(r32($f0 + 42), $f0 + 41));
          } else if (SpellInf.HasItemPage(r32($f0 + 42))) {
            (await ItemInfo(creature, r32($f0 + 42), $f0 + 46));
            needRedraw = true;
          }
          break;
        }
      }
    }
    if (!(U8[227107] !== 0)) {
      CharHlp.RecalcStats(creature);
    }
    if (U8[creature + 199] !== itemCount) {
      U8[$f0 + 41] = true ? 1 : 0;
    }
  }
  S.sp = $sp;
}

export async function MemberItems(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  w32(143749, creature);
  w32(247711, creature);
  if ((U8[creature + 199] === 0) || (r32(creature + 200) === 0)) {
    (await TextRend.DisplayAndPause(14, rS(creature) + " has no items."));
  } else {
    U8[$f0] = false ? 1 : 0;
    (await UseItemMenu($f0));
  }
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export async function AltItems(c: number) {
  let member: number = 0, $r0: boolean = false;
  member = 0;
  if ((U8[141176] !== 5) && (Party.AltMember(c) > 0)) {
    member = Party.MemberAt(Party.AltMember(c));
  }
  if (member !== 0) {
    (await MemberItems(member));
  }
  $r0 = member !== 0;
  return $r0;
}

export async function PaladinHeal(p: number, tgt: number) {
  let hpBefore: number = 0, healed: boolean = false, $r0: boolean = false;
  hpBefore = U8[tgt + 283];
  healed = (await FxEngine.RestoreHitPoints(tgt, rt.mul(CharHlp.GetClassLevel(p, 8), 2), false));
  if (healed) {
    Stats.Count(p, 4, U8[tgt + 283] - hpBefore);
  }
  FxEngine.AddEffect(p, 140, 1440, 255, false);
  $r0 = healed;
  return $r0;
}

export async function PaladinCure(p: number, tgt: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if ((await FxEngine.RemoveDiseases(tgt))) {
  }
  if (CharHlp.HasEffect(p, 141, $f0)) {
    let $t1;
    $t1 = r32($f0) + 3, U8[$t1] = U8[$t1] + 1;
  } else {
    FxEngine.AddEffect(p, 141, 10080, 1, false);
  }
  S.sp = $sp;
}

export function CannotCarryItem(creature: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: boolean = false;
  CharHlp.RecalcStats(creature);
  $r0 = ((U8[creature + 199] >= 16) && !((U8[141184] !== 0) && CharHlp.JoinsWhole(creature, item))) || Money.CheckOverload(creature, CharHlp.ItemWeight(item), $f0);
  S.sp = $sp;
  return $r0;
}

export function ItemMenuLine(creature: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let halve: boolean = false, $r0: string = "";
  wS($f0, 255, "Ready");
  if (CharHlp.CanUseItems(creature)) {
    wS($f0, 255, rS($f0) + " Use");
  }
  if (CharHlp.MayTrade(creature) && (U8[141176] !== 5)) {
    wS($f0, 255, rS($f0) + " Trade");
  }
  if (U8[141176] === 8) {
    wS($f0, 255, rS($f0) + " Deposit");
  } else {
    wS($f0, 255, rS($f0) + " Drop");
  }
  halve = (U8[creature + 199] < 16) && (U8[item + 57] > 1);
  if (halve) {
    wS($f0, 255, rS($f0) + " Halve");
  }
  if (CanJoin(item)) {
    wS($f0, 255, rS($f0) + " Join");
  }
  if (CharHlp.MayTrade(creature) && (U8[141176] === 1)) {
    wS($f0, 255, rS($f0) + " Sell");
  }
  if (U8[141176] === 1) {
    wS($f0, 255, rS($f0) + " Id");
  } else if (SpellInf.HasItemPage(item)) {
    wS($f0, 255, rS($f0) + " Info");
  }
  if (halve && ((U8[$f0] + 5) > 40)) {
    wS($f0, 255, rt.Delete(rS($f0), rt.Pos(" Halve", rS($f0)), 6));
  }
  if ((TagsSets() && CharHlp.SetTaggable(item)) && (((U8[$f0] + 4) + 5) <= 40)) {
    wS($f0, 255, rS($f0) + " 1 2");
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function TagsSets() {
  let $r0: boolean = false;
  $r0 = (U8[141176] !== 8) && (U8[141176] !== 1);
  return $r0;
}

export async function TagSet(item: number, n: number) {
  if (!CharHlp.SetTaggable(item)) {
    (await CharDisp.PrintBottomLine("Weapons and shields only"));
  } else if (U8[item + 63] === n) {
    U8[item + 63] = 0;
  } else {
    U8[item + 63] = n;
  }
}

export async function ItemTradeMenu(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w32($f0, r32(247711));
  (await CharDisp.DisplayNoncombatInterface());
  (await CharDisp.SelectChar("Trade with Whom?", true, $f0));
  if (r32($f0) !== 0) {
    w32(247711, r32($f0));
    if (CannotCarryItem(r32($f0), item)) {
      (await CharDisp.PrintBottomLine("Overloaded"));
    } else {
      (await CharHlp.AddToInventory(r32($f0), item));
      (await CharHlp.RemoveItem(r32(143749), item));
      CharHlp.RecalcStats(r32($f0));
    }
  }
  S.sp = $sp;
}

export async function HalveItem(item: number) {
  let newIt: number = 0, half: number = 0, remainder: number = 0;
  half = Math.trunc(U8[item + 57] / 2);
  if (half > 0) {
    remainder = (U8[item + 57] - half) & 255;
    newIt = rt.getMem(64);
    mv(newIt, item, 64);
    U8[newIt + 57] = half;
    U8[newIt + 52] = 0;
    w32(newIt + 42, r32(item + 42));
    U8[item + 57] = remainder;
    w32(item + 42, newIt);
  } else {
    (await CharDisp.PrintBottomLine("Can't halve that"));
  }
}

export function CanJoin(item: number) {
  let p: number = 0, $r0: boolean = false;
  $r0 = false;
  if (U8[item + 57] > 0) {
    p = r32(r32(143749) + 200);
    while (p !== 0) {
      if (CharHlp.SameStack(item, p)) {
        $r0 = true;
      }
      p = r32(p + 42);
    }
  }
  return $r0;
}

export async function SellItem(item: number) {
  let price: number = 0;
  price = MoneyCal.ItemSalePrice(item) & 65535;
  CharHlp.ItemLabel(item, false);
  (await SayBelow(true, "I'll give you " + StrUtil.NumStr(price) + " gold pieces for your " + rS(item)));
  if ((await MenuCore.YesNoMenu("Is It a Deal? ", 13, 10, 15)) === 89) {
    (await CharDisp.PrintBottomLine("Sold!"));
    (await CharHlp.RemoveItem(r32(143749), item));
    (await Money.GiveCoins(r32(143749), Math.trunc(price / 5), price % 5));
  }
  (await Border.ClearBox(1, 21, 38, 22));
}

export async function IdentifyItem(item: number, newInfo: number) {
  let paid: boolean = false;
  paid = false;
  CharHlp.ItemLabel(item, false);
  (await SayBelow(true, "For 200 gold pieces I'll identify your " + rS(item)));
  if ((await MenuCore.YesNoMenu("Is It a Deal? ", 13, 10, 15)) === 89) {
    paid = (await Money.PayGold(r32(143749), 200));
  }
  if (paid) {
    if (U8[item + 53] === 0) {
      (await SayBelow(true, "I can't tell anything new about your " + rS(item)));
    } else {
      U8[item + 53] = 0;
      CharHlp.ItemLabel(item, false);
      (await SayBelow(true, "It looks like some sort of " + rS(item)));
      U8[newInfo] = true ? 1 : 0;
    }
    (await TextRend.PauseOnly());
  }
  (await Border.ClearBox(1, 21, 38, 22));
}

export async function TradeTreasureMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 264);
  let m: number = 0, mType: number = 0, prev: number = 0, amount: number = 0, exitOuter: boolean = false, exitInner: boolean = false, redraw: boolean = false;
  do {
    w32($f0, r32(247711));
    (await CharDisp.DisplayNoncombatInterface());
    (await CharDisp.SelectChar("Trade to?", true, $f0));
    if (r32($f0) === 0) {
      exitOuter = true;
    } else {
      (await DisplayChar(r32(143749)));
      do {
        (await PrintMoney());
        w32(247711, r32($f0));
        prev = (await PickCoinType($f0 + 4));
        if (prev === 0) {
          exitInner = true;
          exitOuter = false;
        } else {
          wS($f0 + 8, 255, "");
          mType = MoneyCal.ParseMoneyType(rS(prev), $f0 + 8) << 24 >> 24;
          wS($f0 + 8, 255, "How much " + rS($f0 + 8) + "will you trade? ");
          amount = (await Money.InputNumberMax(r16(r32(143749) + mType * 2 + 136), rS($f0 + 8), 10)) & 65535;
          (await Money.TradeMoney(r32(143749), r32($f0), amount, mType));
          exitInner = true;
          exitOuter = true;
          for (let $i3 = 0; $i3 <= 6; $i3++) {
            m = $i3;
            if (r16(r32(143749) + m * 2 + 136) > 0) {
              exitOuter = false;
              exitInner = false;
            }
          }
        }
        if (r32($f0 + 4) !== 0) {
          MenuCore.FreeStringList($f0 + 4);
        }
      } while (!(exitInner));
    }
  } while (!(exitOuter));
  S.sp = $sp;
}

export async function DropMoneyMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 260);
  let m: number = 0, mType: number = 0, prev: number = 0, exitFlag: boolean = false, amount: number = 0;
  do {
    (await PrintMoney());
    prev = (await PickCoinType($f0));
    if (prev === 0) {
      exitFlag = true;
    } else {
      wS($f0 + 4, 255, "");
      mType = MoneyCal.ParseMoneyType(rS(prev), $f0 + 4) << 24 >> 24;
      if (U8[141176] === 8) {
        wS($f0 + 4, 255, "How much " + rS($f0 + 4) + "will you deposit? ");
      } else {
        wS($f0 + 4, 255, "How much " + rS($f0 + 4) + "will you drop? ");
      }
      amount = (await Money.InputNumberMax(r16(r32(143749) + mType * 2 + 136), rS($f0 + 4), 10)) & 65535;
      Money.DropMoney(r32(143749), amount, mType);
      exitFlag = true;
      for (let $i2 = 0; $i2 <= 6; $i2++) {
        m = $i2;
        if (r16(r32(143749) + m * 2 + 136) > 0) {
          exitFlag = false;
        }
      }
    }
    if (r32($f0) !== 0) {
      MenuCore.FreeStringList($f0);
    }
  } while (!(exitFlag));
  S.sp = $sp;
}

export async function SayBelow(clearFirst: boolean, s: string) {
  (await TextRend.DisplayMessageWindow(1, 21, 38, 22, 14, clearFirst, s));
}

export function DrainMark(n: number) {
  let $r0: string = "";
  if (n === 0) {
    $r0 = "";
  } else {
    $r0 = "(-" + StrUtil.NumStr(n) + ")";
  }
  return $r0;
}

export function DrawLevel(creature: number, cls: number, drained: number, levelRow: number, color: number, prefix: string, suffix: string, levelCol: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, prefix + StrUtil.NumStr(I8[creature + cls + 150]));
  TextRend.DisplayString(U8[levelCol], levelRow, color, rS($f0));
  U8[levelCol] = U8[levelCol] + U8[$f0];
  wS($f0, 40, DrainMark(drained));
  if (rS($f0) !== "") {
    TextRend.DisplayString(U8[levelCol], levelRow, 12, rS($f0));
    U8[levelCol] = U8[levelCol] + U8[$f0];
  }
  if (suffix !== "") {
    TextRend.DisplayString(U8[levelCol], levelRow, color, suffix);
    U8[levelCol] = U8[levelCol] + suffix.length;
  }
  S.sp = $sp;
}

export function DrawDualClass(creature: number, classRow: number, levelRow: number, drained: number, levelCol: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let col: number = 0, cls: number = 0;
  wS($f0, 40, rS(I8[creature + 47] * 26 + 131942));
  TextRend.DisplayString(1, classRow, 15, rS($f0));
  col = (1 + U8[$f0]) & 255;
  U8[levelCol] = 7;
  DrawLevel(creature, I8[creature + 47], U8[drained + I8[creature + 47]], levelRow, 15, "", "", levelCol);
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (((U8[creature + 285] & (1 << cls)) !== 0) && (I8[creature + cls + 150] > 0)) {
      if (CharHlp.ClassResting(creature, cls)) {
        DrawLevel(creature, cls, U8[drained + cls], levelRow, 8, " (", ")", levelCol);
        wS($f0, 40, " (" + rS(cls * 26 + 131942) + ")");
        TextRend.DisplayString(col, classRow, 8, rS($f0));
      } else {
        DrawLevel(creature, cls, U8[drained + cls], levelRow, 15, "/", "", levelCol);
        wS($f0, 40, " (" + rS(cls * 26 + 131942) + ")");
        TextRend.DisplayString(col, classRow, 15, rS($f0));
      }
      col = (col + U8[$f0]) & 255;
    }
  }
  S.sp = $sp;
}

export async function LayOnHands(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  (await CharDisp.DisplayNoncombatInterface());
  w32($f0, r32(143753));
  (await CharDisp.SelectChar("Heal whom? ", true, $f0));
  if (r32($f0) === 0) {
    { S.sp = $sp; return; }
  }
  if ((await PaladinHeal(p, r32($f0)))) {
    (await CharDisp.PrintBottomLine(rS(r32($f0)) + " feels better"));
  } else {
    (await CharDisp.PrintBottomLine(rS(r32($f0)) + " is unaffected"));
  }
  S.sp = $sp;
}

export async function CureDisease(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let ch: number = 0;
  (await CharDisp.DisplayNoncombatInterface());
  w32($f0, r32(143753));
  (await CharDisp.SelectChar("Cure whom? ", true, $f0));
  if (r32($f0) === 0) {
    { S.sp = $sp; return; }
  }
  ch = 89;
  if (!FxEngine.HasDisease(r32($f0))) {
    (await CharDisp.PrintNameString(r32($f0), "is not diseased", 0, false));
    ch = (await MenuCore.YesNoMenu("cure anyway: ", 13, 10, 15)) & 255;
    (await CharDisp.ClearMessageWindow());
  }
  if (ch !== 89) {
    { S.sp = $sp; return; }
  }
  (await PaladinCure(p, r32($f0)));
  (await CharDisp.PrintBottomLine(rS(r32($f0)) + " is cured"));
  S.sp = $sp;
}

export async function MoreHeading(creature: number) {
  (await TextRend.ClearScreen());
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  TextRend.DisplayCentered(2, 37, 2, 11, rS(creature));
}

export async function MoreTitle(creature: number, title: string) {
  (await MoreHeading(creature));
  TextRend.DisplayCentered(2, 37, 4, 15, title);
}

export async function DrawGameStats(creature: number, b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let i: number = 0, n: number = 0;
  (await MoreTitle(creature, "Game Stats"));
  for (let $i1 = 1; $i1 <= 12; $i1++) {
    i = $i1;
    n = 0;
    if (b !== 0) {
      n = ri32(b + i * 4 - 4);
    }
    if (i === 9) {
      n = Math.trunc(n / ri32(131934)) | 0;
    }
    wS($f0, 40, rt.fmtI(n, 0));
    TextRend.DisplayString(3, 5 + i, 15, rS(i * 18 + 227127));
    TextRend.DisplayString(36 - U8[$f0], 5 + i, 10, rS($f0));
  }
  S.sp = $sp;
}

export async function DrawKills(creature: number, b: number, order: number, kinds: number, top_: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let i: number = 0, k: number = 0, width: number = 0;
  (await MoreTitle(creature, "Kill Count"));
  if (kinds === 0) {
    TextRend.DisplayString(3, 6, 10, "None");
    { S.sp = $sp; return; }
  }
  width = 1;
  for (let $i1 = 1, $e1 = kinds; $i1 <= $e1; $i1++) {
    i = $i1;
    if (StrUtil.NumStr(ri32(b + i * 20 + 45)).length > width) {
      width = StrUtil.NumStr(ri32(b + i * 20 + 45)).length;
    }
  }
  if (top_ > 1) {
    MenuCore.DrawMore(1, 38, 5);
  }
  for (let $i2 = 0; $i2 <= 29; $i2++) {
    k = $i2;
    if ((top_ + k) <= kinds) {
      i = U8[order + (top_ + k) - 1];
      wS($f0, 40, StrUtil.PadLeft(StrUtil.NumStr(ri32(b + i * 20 + 45)), width) + " " + rt.Copy(rS(b + i * 20 + 29), 1, 16 - width));
      TextRend.DisplayString(2 + ((k % 2) * 18), 6 + Math.trunc(k / 2), 10, rS($f0));
    }
  }
  if ((top_ + 30) <= kinds) {
    MenuCore.DrawMore(1, 38, 21);
  }
  S.sp = $sp;
}

export function ReadStats(creature: number, b: number, order: number, kinds: number) {
  let i: number = 0, j: number = 0, t: number = 0;
  w32(b, Stats.BlockOf(creature));
  U8[kinds] = 0;
  if (r32(b) !== 0) {
    U8[kinds] = U8[r32(b) + 48];
  }
  for (let $i1 = 1, $e1 = U8[kinds]; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[order + i - 1] = i;
  }
  for (let $i2 = 1, $e2 = U8[kinds]; $i2 <= $e2; $i2++) {
    i = $i2;
    for (let $i3 = i + 1, $e3 = U8[kinds]; $i3 <= $e3; $i3++) {
      j = $i3;
      if (rS(r32(b) + U8[order + j - 1] * 20 + 29) < rS(r32(b) + U8[order + i - 1] * 20 + 29)) {
        t = U8[order + i - 1];
        U8[order + i - 1] = U8[order + j - 1];
        U8[order + j - 1] = t;
      }
    }
  }
}

export async function DrawSaves(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let i: number = 0, need: number = 0;
  (await MoreTitle(p, "Saving Throws"));
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    switch (i) {
      case 0: {
        wS($f0, 40, "Paralysis, Poison, Death");
        break;
      }
      case 1: {
        wS($f0, 40, "Petrification, Polymorph");
        break;
      }
      case 2: {
        wS($f0, 40, "Rod, Staff, Wand");
        break;
      }
      case 3: {
        wS($f0, 40, "Breath Weapon");
        break;
      }
      default: {
        wS($f0, 40, "Spell");
      }
    }
    TextRend.DisplayString(2, 6 + i, 10, rS($f0));
    need = U8[p + i + 109] - I8[p + 257];
    if (need < 2) {
      need = 2;
    }
    if (need > 20) {
      need = 20;
    }
    wS($f0, 40, StrUtil.NumStr(need));
    TextRend.DisplayString(32 - U8[$f0], 6 + i, 15, rS($f0));
  }
  S.sp = $sp;
}

export function SignedNum(n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, StrUtil.NumStr(Math.abs(n)));
  if (U8[$f0] < 2) {
    wS($f0, 40, " " + rS($f0));
  }
  if (n < 0) {
    wS($f0, 40, "-" + rS($f0));
  } else {
    wS($f0, 40, "+" + rS($f0));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export async function DrawThief(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 44);
  let j: number = 0;
  (await MoreHeading(p));
  TextRend.DisplayString(18, 4, 15, "Race Dex Level Total");
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    j = $i1;
    switch (j) {
      case 1: {
        wS($f0 + 3, 40, "Pick Pockets");
        break;
      }
      case 2: {
        wS($f0 + 3, 40, "Open Lock");
        break;
      }
      case 3: {
        wS($f0 + 3, 40, "Find Traps");
        break;
      }
      case 4: {
        wS($f0 + 3, 40, "Move Silently");
        break;
      }
      case 5: {
        wS($f0 + 3, 40, "Hide in Shadows");
        break;
      }
      case 6: {
        wS($f0 + 3, 40, "Hear Noise");
        break;
      }
      case 7: {
        wS($f0 + 3, 40, "Climb Walls");
        break;
      }
      default: {
        wS($f0 + 3, 40, "Read Languages");
      }
    }
    TextRend.DisplayString(2, 4 + j, 10, rS($f0 + 3));
    ClassCal.ThiefSkillParts(p, j, $f0, $f0 + 1, $f0 + 2);
    TextRend.DisplayString(19, 4 + j, 15, SignedNum(I8[$f0 + 1]));
    TextRend.DisplayString(23, 4 + j, 15, SignedNum(I8[$f0 + 2]));
    TextRend.DisplayString(29, 4 + j, 15, SignedNum(I8[$f0]));
    wS($f0 + 3, 40, SignedNum(U8[p + j + 118]));
    TextRend.DisplayString(38 - U8[$f0 + 3], 4 + j, 15, rS($f0 + 3));
  }
  if (ClassCal.ArmorBarsThiefSkills(p)) {
    (await TextRend.DisplayMessageWindow(2, 14, 37, 15, 14, true, "Most armor or a shield bars the use of thief skills."));
  }
  S.sp = $sp;
}

export async function DrawCleric(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let i: number = 0, lvl: number = 0, v: number = 0;
  (await MoreTitle(p, "Turn Undead"));
  lvl = ClassCal.TurnLevel(p) << 24 >> 24;
  TextRend.DisplayString(2, 6, 10, "Cleric Level");
  wS($f0, 40, StrUtil.NumStr(lvl));
  TextRend.DisplayString(38 - U8[$f0], 6, 15, rS($f0));
  TextRend.DisplayString(2, 8, 15, "Undead");
  TextRend.DisplayString(32, 8, 15, "Result");
  for (let $i1 = 1; $i1 <= 10; $i1++) {
    i = $i1;
    switch (i) {
      case 1: {
        wS($f0, 40, "Skeleton");
        break;
      }
      case 2: {
        wS($f0, 40, "Zombie");
        break;
      }
      case 3: {
        wS($f0, 40, "Ghoul");
        break;
      }
      case 4: {
        wS($f0, 40, "Shadow");
        break;
      }
      case 5: {
        wS($f0, 40, "Wight");
        break;
      }
      case 6: {
        wS($f0, 40, "Ghast");
        break;
      }
      case 7: {
        wS($f0, 40, "Wraith");
        break;
      }
      case 8: {
        wS($f0, 40, "Mummy");
        break;
      }
      case 9: {
        wS($f0, 40, "Spectre");
        break;
      }
      default: {
        wS($f0, 40, "Vampire");
      }
    }
    TextRend.DisplayString(2, 8 + i, 10, rS($f0));
    v = ClassCal.TurnValue(i, lvl) << 24 >> 24;
    if (v === 99) {
      wS($f0, 40, "-");
    } else if (v === 1) {
      wS($f0, 40, "T");
    } else if (Math.abs(v) <= 1) {
      wS($f0, 40, "D");
    } else {
      wS($f0, 40, StrUtil.NumStr(Math.abs(v)));
    }
    TextRend.DisplayString(38 - U8[$f0], 8 + i, 15, rS($f0));
  }
  TextRend.DisplayString(2, 20, 10, "D  Destroyed automatically");
  TextRend.DisplayString(2, 21, 10, "T  Turned automatically");
  TextRend.DisplayString(2, 22, 10, "#  Minimum d20 roll to turn");
  S.sp = $sp;
}

export async function MorePage() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 95);
  let p: number = 0, page: number = 0, haveStats: boolean = false, top_: number = 0, ch: number = 0;
  p = r32(143749);
  CharHlp.RecalcStats(p);
  wS($f0, 40, "Saves sTats Kills");
  if (CharHlp.GetClassLevel(p, 64) > 0) {
    wS($f0, 40, rS($f0) + " tHief");
  }
  if (ClassCal.TurnLevel(p) > 0) {
    wS($f0, 40, rS($f0) + " Cler");
  }
  wS($f0, 40, rS($f0) + " Exit");
  page = 1;
  haveStats = false;
  top_ = 1;
  U8[145643] = 1;
  do {
    switch (page) {
      case 2: {
        (await DrawGameStats(p, r32($f0 + 41)));
        break;
      }
      case 3: {
        (await DrawKills(p, r32($f0 + 41), $f0 + 46, U8[$f0 + 45], top_));
        break;
      }
      case 4: {
        (await DrawThief(p));
        break;
      }
      case 5: {
        (await DrawCleric(p));
        break;
      }
      default: {
        (await DrawSaves(p));
      }
    }
    ch = (await MenuCore.MenuHorizontal("Info: ", rS($f0), 13, 10, 15, true, false, $f0 + 94)) & 255;
    if ((U8[$f0 + 94] !== 0)) {
      if (page === 3) {
        switch (ch) {
          case 72: {
            if (top_ > 1) {
              top_ = (top_ - 2) << 16 >> 16;
            }
            break;
          }
          case 80: {
            if ((top_ + 30) <= U8[$f0 + 45]) {
              top_ = (top_ + 2) << 16 >> 16;
            }
            break;
          }
          case 73: {
            top_ = (top_ - 30) << 16 >> 16;
            if (top_ < 1) {
              top_ = 1;
            }
            break;
          }
          case 81: {
            if ((top_ + 30) <= U8[$f0 + 45]) {
              top_ = (top_ + 30) << 16 >> 16;
            }
            break;
          }
        }
      }
    } else {
      switch (ch) {
        case 83: {
          page = 1;
          break;
        }
        case 72: {
          page = 4;
          break;
        }
        case 67: {
          page = 5;
          break;
        }
        case 84: case 75: {
          if (!haveStats) {
            ReadStats(p, $f0 + 41, $f0 + 46, $f0 + 45);
          }
          haveStats = true;
          if (ch === 84) {
            page = 2;
          } else {
            page = 3;
            top_ = 1;
          }
          break;
        }
      }
    }
  } while (!(!(U8[$f0 + 94] !== 0) && (ch === 0 || ch === 69)));
  S.sp = $sp;
}

export function DrawMoreInfoLabel() {
  TextRend.DisplayString(29, 13, 15, "M");
  TextRend.DisplayString(30, 13, 10, "ore Info");
}

export async function CheckItemAvail(item: number) {
  let $r0: boolean = false;
  $r0 = false;
  if (U8[item + 52] !== 0) {
    (await CharDisp.PrintBottomLine("Must be unreadied"));
  } else if (!CharHlp.ItemReadable(item)) {
    $r0 = true;
  } else if (((U8[item + 60] > 127) || (U8[item + 61] > 127)) || (U8[item + 62] > 127)) {
    CharDisp.DisplayCreatureName(r32(143749), 1, 21, false);
    U8[143769] = U8[r32(143749)] + 2;
    U8[143770] = 21;
    (await SayBelow(false, " was going to scribe from that scroll"));
    if ((await MenuCore.YesNoMenu("is it Okay to lose it? ", 13, 10, 15)) === 89) {
      $r0 = true;
    }
  } else {
    $r0 = true;
  }
  (await Border.ClearBox(1, 21, 38, 22));
  return $r0;
}

export async function ViewItemDetail(it: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 101);
  let i: number = 0;
  {
    const $w1 = it;
    w32($f0, U8[$w1 + 46]);
    w32($f0 + 4, U8[$w1 + 47]);
    w32($f0 + 8, U8[$w1 + 48]);
    w32($f0 + 12, U8[$w1 + 49]);
    w32($f0 + 16, I8[$w1 + 50] & 255);
    w32($f0 + 20, I8[$w1 + 51] & 255);
    w32($f0 + 24, U8[$w1 + 52]);
    w32($f0 + 28, U8[$w1 + 53]);
    w32($f0 + 32, U8[$w1 + 54]);
    w32($f0 + 36, r16($w1 + 58));
    w32($f0 + 40, U8[$w1 + 60]);
    w32($f0 + 44, U8[$w1 + 61]);
    w32($f0 + 48, U8[$w1 + 62]);
    w32($f0 + 52, U8[CharHlp.BaseItem(U8[$w1 + 46]) + 2]);
    w32($f0 + 56, U8[CharHlp.BaseItem(U8[$w1 + 46]) + 3]);
  }
  (await TextRend.ClearScreen());
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  for (let $i2 = 1; $i2 <= 15; $i2++) {
    i = $i2;
    switch (i) {
      case 1: {
        wS($f0 + 60, 40, "itemtype:");
        break;
      }
      case 2: {
        wS($f0 + 60, 40, "namenum(1):");
        break;
      }
      case 3: {
        wS($f0 + 60, 40, "namenum(2):");
        break;
      }
      case 4: {
        wS($f0 + 60, 40, "namenum(3):");
        break;
      }
      case 5: {
        wS($f0 + 60, 40, "plus:");
        break;
      }
      case 6: {
        wS($f0 + 60, 40, "plussave:");
        break;
      }
      case 7: {
        wS($f0 + 60, 40, "ready:");
        break;
      }
      case 8: {
        wS($f0 + 60, 40, "identified:");
        break;
      }
      case 9: {
        wS($f0 + 60, 40, "cursed:");
        break;
      }
      case 10: {
        wS($f0 + 60, 40, "value:");
        break;
      }
      case 11: {
        wS($f0 + 60, 40, "charges:");
        break;
      }
      case 12: {
        wS($f0 + 60, 40, "effect:");
        break;
      }
      case 13: {
        wS($f0 + 60, 40, "special:");
        break;
      }
      case 14: {
        wS($f0 + 60, 40, "dice large:");
        break;
      }
      default: {
        wS($f0 + 60, 40, "sides large:");
      }
    }
    TextRend.DisplayString(2, i + 1, 10, rS($f0 + 60));
    TextRend.DisplayString(20, i + 1, 10, StrUtil.NumStr(ri32($f0 + i * 4 - 4)));
  }
  (await TextRend.DisplayAndPause(10, "press a key"));
  S.sp = $sp;
}

export async function ItemInfo(creature: number, sel: number, idx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 66);
  let count: number = 0, p: number = 0;
  count = 0;
  w16($f0 + 64, 0);
  p = r32(creature + 200);
  while ((p !== 0) && (count < 16)) {
    if (SpellInf.HasItemPage(p)) {
      if (p === sel) {
        w16($f0 + 64, count);
      }
      w32($f0 + count * 4, p);
      count = (count + 1) << 16 >> 16;
    }
    p = r32(p + 42);
  }
  (await SpellInf.ShowItemPage($f0, count, $f0 + 64));
  if (count > 0) {
    w16(idx, MenuCore.ListIndex(r32(creature + 200), r32($f0 + ri16($f0 + 64) * 4)));
  }
  S.sp = $sp;
}

export async function PickCoinType(list: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let p: number = 0, ch: number = 0, $r0: number = 0;
  p = Money.CoinMenu(r32(143749));
  w32(list, p);
  w32($f0, 0);
  w16($f0 + 4, 0);
  U8[$f0 + 6] = true ? 1 : 0;
  ch = (await MenuCore.MenuVertical("Select type of coin", "", 13, 10, 15, 12, 7, 25, 13, p, true, $f0 + 6, $f0 + 4, $f0)) & 255;
  $r0 = r32($f0);
  S.sp = $sp;
  return $r0;
}
