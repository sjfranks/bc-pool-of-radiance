// Generated from src/postcbt.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_MSG from './c_msg';
import * as C_SPELL from './c_spell';
import * as GameVars from './gamevars';
import * as Shop from './shop';
import * as SaveLoad from './saveload';
import * as Magic from './magic';
import * as C_KEYS from './c_keys';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_GBVM from './c_gbvm';
import * as C_MONEY from './c_money';
import * as C_EFFECT from './c_effect';
import * as Stats from './stats';
import * as Bestiary from './bestiary';
import * as BeastFil from './beastfil';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as CharExt from './charext';
import * as EclMenu from './eclmenu';
import * as MenuCore from './menucore';
import * as Money from './money';
import * as TextRend from './textrend';
import * as ViewChar from './viewchar';
import * as CharDisp from './chardisp';
import * as Party from './party';
import * as Dice from './dice';
import * as ClassCal from './classcal';
import * as CbtActs from './cbtacts';
import * as C_ITEM from './c_item';


export const $at = { nonEscapedHostileFound: 249926, partyFled: 249927, nonSharerCount: 249928, expShare: 249929, combatWon: 249933 };

export async function PostCombat() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 362);
  if ((U8[141212] !== 0)) {
    CharHlp.CountTeams();
    if ((U8[144894] > 0) && (U8[144895] === 0)) {
      w16(r32(141151) + 1422, 0);
    } else {
      w16(r32(141151) + 1422, 1);
    }
    PostCombatCreatureCleanup(false, $f0);
    Bestiary.NewEncounter();
    { S.sp = $sp; return; }
  }
  w16(r32(141151) + 1422, 0);
  U8[249926] = false ? 1 : 0;
  U8[141176] = 6;
  DetermineCombatResults();
  PostCombatCreatureCleanup((((U8[249933] !== 0) && !(U8[249927] !== 0)) && !(U8[141224] !== 0)) && !(U8[146746] !== 0), $f0);
  if (!(U8[141224] !== 0) || (U8[146746] !== 0)) {
    (await JoinRisen($f0));
    (await RetrieveThrownWeapons());
    (await NpcTreasureShare());
    (await PostCombatSummary(ri32(249929)));
    (await LootMenu());
    CharHlp.FreeItemList(144890);
  } else {
    w16(r32(141151) + 1422, 128);
    (await Border.DrawWindow(1, 1, 38, 22, 0, 15, "The END!"));
    U8[143769] = 2;
    U8[143770] = 6;
    (await TextRend.DisplayMessageWindow(2, 5, 37, 22, 10, true, "The monsters rejoice for the party has been destroyed"));
    (await TextRend.DisplayAndPause(13, "Press any key to continue"));
  }
  U8[141225] = 1;
  w16(r32(141151) + 1760, 0);
  w16(r32(141151) + 1762, 0);
  w16(r32(141151) + 1764, 0);
  w16(r32(141151) + 1478, 0);
  w16(r32(141151) + 1484, 0);
  Bestiary.NewEncounter();
  BeastFil.Flush();
  S.sp = $sp;
}

export function PostCombatCreatureCleanup(won: boolean, risen: number) {
  let p: number = 0, next: number = 0, room: number = 0;
  U8[risen + 32] = 0;
  U8[risen + 361] = 0;
  room = (8 - r16(r32(141151) + 1660)) << 16 >> 16;
  w16(r32(141151) + 1424, 0);
  p = r32(143753);
  while (p !== 0) {
    next = r32(p + 260);
    if ((won && RisenForParty(p)) && (U8[risen + 32] < room)) {
      Unlink(p);
      KeepRisen(p);
      U8[risen + 32] = U8[risen + 32] + 1;
      w32(risen + U8[risen + 32] * 4 - 4, p);
      p = next;
    } else if (IsMonster(p) || (I8[p + 270] === 1)) {
      if ((won && RisenForParty(p)) && (U8[risen + 361] < 8)) {
        U8[risen + 361] = U8[risen + 361] + 1;
        wS(risen + U8[risen + 361] * 41 - 8, 40, rS(p));
      }
      if (U8[p + 269] !== 1) {
        let $t2;
        $t2 = r32(141151) + 1424, w16($t2, r16($t2) + 1);
      }
      w32(143749, p);
      SaveLoad.RemoveCreature(IsMonster(p), true);
      p = next;
    } else {
      if (r32(p + 264) !== 0) {
        if (U8[r32(p + 264) + 22] !== 0) {
          U8[p + 271] = 1;
        }
        rt.freeMem(r32(p + 264));
        w32(p + 264, 0);
      }
      if ((U8[141191] !== 0) && CharHlp.ComesUnderPlayer(p)) {
        U8[p + 271] = 0;
      }
      p = r32(p + 260);
    }
  }
  w32(143749, r32(143753));
}

export async function LootTakeMenu(treasure: number, items: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let c: number = 0, done: boolean = false;
  done = false;
  if ((U8[treasure] !== 0)) {
    if ((U8[items] !== 0)) {
      do {
        c = (await MenuCore.MenuHorizontal("Take: ", "Money Items Exit", 13, 10, 15, true, true, $f0)) & 255;
        if ((U8[$f0] !== 0)) {
          if ((await ViewChar.AltItems(c))) {
            (await CharDisp.DisplayNoncombatInterface());
          } else {
            Party.SelectPrevNextChar(c);
          }
        } else {
          switch (c) {
            case 77: {
              (await Money.TakeMoneyMenu());
              (await CharDisp.DisplayNoncombatInterface());
              break;
            }
            case 73: {
              (await LootTakeItemMenu());
              break;
            }
            case 69: case 0: {
              done = true;
              break;
            }
          }
        }
        (await CharDisp.DisplayParty(r32(143749)));
        Money.DetermineTreasure(treasure, items);
        if (!(U8[treasure] !== 0) || !(U8[items] !== 0)) {
          done = true;
        }
      } while (!(done));
    } else {
      (await Money.TakeMoneyMenu());
      (await CharDisp.DisplayNoncombatInterface());
    }
  } else {
    (await LootTakeItemMenu());
  }
  S.sp = $sp;
}

export function DetermineLootExp(share: number) {
  let p: number = 0, i: number = 0, expTotal: number = 0, q: number = 0, item: number = 0, cnt: number = 0, sharers: number = 0;
  if ((U8[146746] !== 0) && (r16(r32(141151) + 1484) !== 0)) {
    w32(share, I8[r32(143749) + 115] * 100);
  } else {
    expTotal = 0;
    p = r32(143753);
    cnt = 0;
    while (p !== 0) {
      item = r32(p + 200);
      if ((I8[p + 270] === 1) && (U8[p + 268] !== 3)) {
        U8[249926] = true ? 1 : 0;
        for (let $i2 = 0; $i2 <= 6; $i2++) {
          i = $i2;
          let $t3;
          $t3 = i * 4 + 144862, w32($t3, ri32($t3) + r16(p + i * 2 + 136));
        }
        expTotal = ((expTotal + r16(p + 184)) + (U8[p + 186] * U8[p + 177])) | 0;
        if (r16(r32(141151) + 1478) !== 1) {
          while (item !== 0) {
            if ((r16(item + 58) > 0) || ((cnt < 8) && (Dice.RollDice(1, 10) <= 3))) {
              cnt = (cnt + 1) & 255;
              CharHlp.ItemLabel(item, false);
              CharHlp.PrependItemCopy(144890, item);
              U8[r32(144890) + 52] = 0;
              U8[r32(144890) + 63] = 0;
            }
            item = r32(item + 42);
          }
        }
      }
      p = r32(p + 260);
    }
    expTotal = (expTotal + Math.trunc(ri32(144862) / 200)) | 0;
    expTotal = (expTotal + Math.trunc(ri32(144866) / 20)) | 0;
    expTotal = (expTotal + Math.trunc(ri32(144870) / 2)) | 0;
    expTotal = (expTotal + ri32(144874)) | 0;
    expTotal = (expTotal + (ri32(144878) * 5)) | 0;
    expTotal = (expTotal + (ri32(144882) * 250)) | 0;
    expTotal = (expTotal + (ri32(144886) * 2200)) | 0;
    q = r32(144890);
    while ((q !== 0) && (q !== r32(143761))) {
      if (I8[q + 50] > 0) {
        expTotal = (expTotal + (I8[q + 50] * 400)) | 0;
      }
      q = r32(q + 42);
    }
    sharers = (r16(r32(141151) + 1660) - U8[249928]) << 16 >> 16;
    if (sharers > 0) {
      w32(share, Math.trunc(expTotal / sharers));
    } else {
      w32(share, 0);
    }
  }
}

export function AwardExperience(experience: number) {
  let p: number = 0;
  p = r32(143753);
  while (p !== 0) {
    if ((U8[p + 269] !== 0) && (U8[p + 268] !== 1)) {
      w32(p + 172, ri32(p + 172) + ClassCal.ExperienceShare(p, experience));
    }
    p = r32(p + 260);
  }
}

export function IsMonster(p: number) {
  let $r0: boolean = false;
  $r0 = (r32(p + 264) !== 0) && (U8[r32(p + 264) + 19] === 1);
  return $r0;
}

export function DetermineCombatResults() {
  let p: number = 0, nxt: number = 0, b: boolean = false;
  U8[249928] = 0;
  U8[141224] = true ? 1 : 0;
  U8[249927] = false ? 1 : 0;
  p = r32(143753);
  while ((p !== 0) && !IsMonster(p)) {
    if (U8[p + 268] === 3) {
      U8[249927] = true ? 1 : 0;
    }
    p = r32(p + 260);
  }
  if ((U8[146746] !== 0)) {
    U8[141224] = false ? 1 : 0;
  }
  U8[249933] = false ? 1 : 0;
  p = r32(143753);
  if (!(U8[146746] !== 0)) {
    while ((p !== 0) && !IsMonster(p)) {
      if ((((((U8[p + 268] === 3) || (U8[p + 268] === 1)) || (U8[p + 268] === 0)) || (r16(r32(141151) + 1484) === 1)) && (I8[p + 270] === 0)) && !CharHlp.IsNpc(p)) {
        U8[141224] = false ? 1 : 0;
      }
      if ((U8[p + 268] === 1) || (U8[p + 268] === 0)) {
        U8[249933] = true ? 1 : 0;
        U8[249927] = false ? 1 : 0;
      }
      if ((U8[p + 269] === 0) || (U8[p + 268] === 1)) {
        U8[249928] = U8[249928] + 1;
      }
      p = r32(p + 260);
    }
    if ((U8[249933] !== 0)) {
      DetermineLootExp(249929);
      AwardExperience(ri32(249929));
    }
    p = r32(143753);
    if (!(U8[141224] !== 0)) {
      while ((p !== 0) && !IsMonster(p)) {
        nxt = r32(p + 260);
        if (!(U8[249927] !== 0)) {
          switch (U8[p + 268]) {
            case 3: {
              U8[p + 268] = 0;
              U8[p + 269] = 1;
              break;
            }
            case 5: {
              U8[p + 268] = 4;
              break;
            }
            case 4: {
              if (U8[p + 283] > 0) {
                U8[p + 268] = 0;
                U8[p + 269] = 1;
              }
              break;
            }
          }
        } else {
          w16(r32(141151) + 1422, 129);
          if (U8[p + 268] === 3) {
            U8[p + 268] = 0;
            U8[p + 269] = 1;
          } else {
            w32(143749, p);
            SaveLoad.RemoveCreature(false, true);
          }
        }
        p = nxt;
      }
    } else {
      p = r32(143753);
      b = false;
      while ((p !== 0) && !b) {
        nxt = r32(p + 260);
        if (!IsMonster(p)) {
          w32(143749, p);
          SaveLoad.RemoveCreature(false, true);
        } else {
          b = true;
        }
        p = nxt;
      }
      w16(r32(141151) + 1660, 0);
    }
  } else {
    p = r32(143753);
    while (p !== 0) {
      if (((U8[p + 269] === 1) && (U8[p + 268] === 0)) && (I8[p + 270] !== 1)) {
        U8[249933] = true ? 1 : 0;
      }
      p = r32(p + 260);
    }
    if ((U8[249933] !== 0)) {
      DetermineLootExp(249929);
      AwardExperience(ri32(249929));
    }
    p = r32(143753);
    while (p !== 0) {
      if ((U8[p + 268] === 0) || (U8[p + 268] === 1)) {
        U8[p + 269] = 1;
      }
      if (U8[p + 268] === 5) {
        U8[p + 268] = 4;
      }
      p = r32(p + 260);
    }
  }
}

export async function PostCombatSummary(experience: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 270);
  let c: number = 0;
  U8[$f0 + 267] = 0;
  (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
  if ((U8[249926] !== 0) || (U8[146746] !== 0)) {
    if ((U8[146746] !== 0) && !(U8[249933] !== 0)) {
      TextRend.DisplayString(1, 3, 10, "You have lost the duel.");
      experience = 0;
    } else if ((U8[146746] !== 0)) {
      TextRend.DisplayString(1, 3, 10, "You have won the duel.");
    } else {
      TextRend.DisplayString(1, 3, 10, "The party has won.");
    }
  } else {
    if ((U8[249927] !== 0)) {
      TextRend.DisplayString(1, 3, 10, "The party has fled.");
      experience = 0;
    } else {
      TextRend.DisplayString(1, 3, 10, "The party has found Treasure!");
    }
  }
  wS($f0, 10, rt.fmtI(experience, 0));
  if ((U8[146746] !== 0)) {
    wS($f0 + 11, 255, "The duelist receives " + rS($f0));
  } else {
    wS($f0 + 11, 255, "Each character receives " + rS($f0));
  }
  TextRend.DisplayString(1, 5, 10, rS($f0 + 11));
  TextRend.DisplayString(1, 7, 10, "experience points.");
  c = (await MenuCore.MenuHorizontal(rS($f0 + 267), C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0 + 269)) & 255;
  S.sp = $sp;
}

export async function LootTakeItemSelection(c: number, itemToTake: number, cursor: number, idx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let head: number = 0;
  U8[$f0] = true ? 1 : 0;
  (await Border.DrawWindow(1, 1, 38, 22, 0, 15, "Loot"));
  CharHlp.LabelItems(r32(144890));
  head = r32(144890);
  U8[227105] = true ? 1 : 0;
  U8[c] = (await MenuCore.MenuVertical("Items: ", "Take", 13, 10, 15, 1, 4, 38, 22, head, true, $f0, idx, cursor));
  w32(itemToTake, r32(cursor));
  S.sp = $sp;
}

export async function LootTakeItemMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  let p: number = 0, done: boolean = false, opened: boolean = false;
  w32($f0, 0);
  w32($f0 + 5, r32(144890));
  w16($f0 + 9, 0);
  do {
    (await LootTakeItemSelection($f0 + 4, $f0, $f0 + 5, $f0 + 9));
    done = false;
    if (Party.AltMember(U8[$f0 + 4]) > 0) {
      opened = (await ViewChar.AltItems(U8[$f0 + 4]));
    } else if (((U8[$f0 + 4] !== 84) && (U8[$f0 + 4] !== 13)) || (r32($f0) === 0)) {
      done = true;
    } else {
      done = false;
      U8[r32($f0) + 63] = 0;
      (await Shop.GiveItemCopyToCreature(r32($f0), $f0 + 11));
      if (!(U8[$f0 + 11] !== 0) && (U8[141176] === 6)) {
        Stats.Count(r32(143749), 8, 1);
      }
      if (!(U8[$f0 + 11] !== 0)) {
        p = r32(144890);
        if (p === r32($f0)) {
          w32(144890, r32(r32($f0) + 42));
        } else {
          while (r32(p + 42) !== r32($f0)) {
            p = r32(p + 42);
          }
          w32(p + 42, r32(r32($f0) + 42));
        }
        w32(r32($f0) + 42, 0);
        rt.freeMem(r32($f0));
        if (r32(144890) === 0) {
          done = true;
        }
      }
    }
  } while (!(done));
  (await CharDisp.DisplayNoncombatInterface());
  S.sp = $sp;
}

export async function LootMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 275);
  let c: number = 0, done: boolean = false, i: number = 0, detectSpell: number = 0, hasDetect: boolean = false;
  U8[$f0 + 259] = 0;
  done = false;
  (await CharDisp.DisplayNoncombatInterface());
  U8[$f0] = false ? 1 : 0;
  do {
    Money.DetermineTreasure($f0, $f0 + 1);
    wS($f0 + 2, 255, "View Pool Exit");
    i = 0;
    wS($f0 + 261, 13, " Exit");
    hasDetect = false;
    if ((U8[$f0 + 1] !== 0)) {
      while ((i <= 47) && !hasDetect) {
        if (rt.inS(C_SPELL.DETECT_MAGIC, CharHlp.MemorizedAt(r32(143749), i))) {
          hasDetect = true;
          detectSpell = CharHlp.MemorizedAt(r32(143749), i) & 255;
        }
        i = (i + 1) & 255;
      }
    }
    if (hasDetect) {
      wS($f0 + 261, 13, " Detect Exit");
    }
    if ((U8[$f0] !== 0)) {
      wS($f0 + 2, 255, "View Take Pool Share" + rS($f0 + 261));
    } else if ((U8[$f0 + 1] !== 0)) {
      wS($f0 + 2, 255, "View Take Pool" + rS($f0 + 261));
    }
    c = (await MenuCore.MenuHorizontal(rS($f0 + 259), rS($f0 + 2), 13, 10, 15, true, true, $f0 + 258)) & 255;
    Stats.MarkCoins();
    if ((U8[$f0 + 258] !== 0)) {
      if ((await ViewChar.AltItems(c))) {
        (await CharDisp.DisplayNoncombatInterface());
      } else {
        Party.SelectPrevNextChar(c);
      }
      (await CharDisp.DisplayParty(r32(143749)));
    } else {
      switch (c) {
        case 86: {
          (await ViewChar.ViewCharMenu($f0 + 258));
          break;
        }
        case 84: {
          (await LootTakeMenu($f0, $f0 + 1));
          break;
        }
        case 80: {
          Money.PoolMoney();
          break;
        }
        case 83: {
          if ((U8[$f0] !== 0)) {
            Money.ShareMoney();
          }
          break;
        }
        case 68: {
          if (hasDetect) {
            (await Magic.CastSpell(detectSpell, false, false, $f0 + 258));
          }
          break;
        }
        case 69: case 0: {
          Money.DetermineTreasure($f0, $f0 + 1);
          done = !((U8[$f0] !== 0) || (U8[$f0 + 1] !== 0)) || !(await Money.GoBackForIt("There is still treasure left.  ", "Do you want to go back and claim your treasure?"));
          break;
        }
      }
    }
    Stats.SettleCoins();
  } while (!(done));
  S.sp = $sp;
}

export function RisenForParty(p: number) {
  let $r0: boolean = false;
  $r0 = (IsMonster(p) && (U8[p + 268] === 1)) && (I8[p + 270] === 0);
  return $r0;
}

export function Unlink(p: number) {
  let prev: number = 0;
  prev = r32(143753);
  while ((prev !== 0) && (r32(prev + 260) !== p)) {
    prev = r32(prev + 260);
  }
  if (prev !== 0) {
    w32(prev + 260, r32(p + 260));
  }
  w32(p + 260, 0);
}

export function KeepRisen(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (r32(p + 264) !== 0) {
    rt.freeMem(r32(p + 264));
    w32(p + 264, 0);
  }
  if (CharHlp.HasEffect(p, 32, $f0)) {
    U8[r32($f0) + 3] = U8[r32($f0) + 3] & 15;
  }
  U8[p + 286] = U8[p + 286] | 1;
  S.sp = $sp;
}

export async function RetrieveThrownWeapons() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 265);
  let n: number = 0, row: number = 0, c: number = 0;
  if (U8[141195] === 0) {
    { S.sp = $sp; return; }
  }
  row = 0;
  for (let $i1 = 1, $e1 = U8[247518]; $i1 <= $e1; $i1++) {
    n = $i1;
    if ((await CbtActs.ReturnThrown(n, $f0, $f0 + 4, $f0 + 8))) {
      if ((row === 0) || (row > 19)) {
        if (row > 19) {
          c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0 + 264)) & 255;
        }
        (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
        row = 3;
      }
      (await TextRend.DisplayMessageWindow(1, row, 38, 22, 10, true, rS(r32($f0)) + " retrieves " + rS($f0 + 8) + "."));
      row = (row + 3) & 255;
    }
  }
  if (row > 0) {
    c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0 + 264)) & 255;
  }
  U8[247518] = 0;
  S.sp = $sp;
}

export async function JoinRisen(risen: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let i: number = 0, row: number = 0, c: number = 0;
  if ((U8[risen + 32] + U8[risen + 361]) === 0) {
    { S.sp = $sp; return; }
  }
  (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
  row = 0;
  for (let $i1 = 1, $e1 = U8[risen + 32]; $i1 <= $e1; $i1++) {
    i = $i1;
    (await EclMenu.JoinParty(r32(risen + i * 4 - 4)));
    (await TextRend.DisplayMessageWindow(5, row + 5, 34, 22, 10, true, rS(r32(risen + i * 4 - 4)) + " joins the party."));
    row = (row + 2) & 255;
  }
  i = 1;
  while ((i <= U8[risen + 361]) && (row <= 16)) {
    (await TextRend.DisplayMessageWindow(5, row + 5, 34, 22, 10, true, rS(risen + i * 41 - 8) + " collapses; the party is full."));
    row = (row + 2) & 255;
    i = (i + 1) & 255;
  }
  c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0)) & 255;
  w32(143749, r32(143753));
  S.sp = $sp;
}

export async function NpcTreasureShare() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let p: number = 0, npcShares: number = 0, total: number = 0, cut: number = 0, row: number = 0, i: number = 0, took: boolean = false, c: number = 0;
  took = false;
  p = r32(143753);
  npcShares = 0;
  total = 0;
  while (p !== 0) {
    if (CharHlp.IsNpc(p) && (U8[p + 268] === 0)) {
      npcShares = (npcShares + (U8[p + 133] & 7)) & 255;
      total = (total + (U8[p + 133] & 7)) & 255;
    } else {
      total = (total + 1) & 255;
    }
    p = r32(p + 260);
  }
  if (npcShares > 0) {
    for (let $i2 = 0; $i2 <= 6; $i2++) {
      i = $i2;
      if (ri32(i * 4 + 144862) > 0) {
        cut = Math.trunc(ri32(i * 4 + 144862) / total) | 0;
        let $t3;
        $t3 = i * 4 + 144862, w32($t3, ri32($t3) - (npcShares * cut));
        took = true;
      }
    }
  }
  if (took) {
    (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
    p = r32(143753);
    row = 0;
    while (p !== 0) {
      if ((CharHlp.IsNpc(p) && (U8[p + 268] === 0)) && (U8[p + 133] > 0)) {
        (await TextRend.DisplayMessageWindow(5, row + 5, 34, 22, 10, true, rS(p) + " takes and hides his share."));
        row = (row + 2) & 255;
      }
      p = r32(p + 260);
    }
    c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0)) & 255;
  }
  S.sp = $sp;
}
