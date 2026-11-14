// Generated from src/money.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_NPC from './c_npc';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as C_KEYS from './c_keys';
import * as C_IFC from './c_ifc';
import * as C_MONEY from './c_money';
import * as GameIo from './gameio';
import * as MenuCore from './menucore';
import * as C_MSG from './c_msg';
import * as C_ITEM from './c_item';
import * as EclMenu from './eclmenu';
import * as CharDisp from './chardisp';
import * as AbilAdj from './abiladj';
import * as MoneyCal from './moneycal';
import * as Dice from './dice';
import * as StrUtil from './strutil';
import * as TpRand from './tprand';


export function CheckOverload(p: number, w: number, takable: number) {
  let $r0: boolean = false;
  w16(takable, SpareCapacity(p));
  if (w > r16(takable)) {
    $r0 = true;
  } else {
    $r0 = false;
    w16(takable, 0);
  }
  return $r0;
}

export function PoolMoney() {
  let p: number = 0, i: number = 0;
  p = r32(143753);
  while (p !== 0) {
    if ((U8[p + 132] === 0) || (U8[p + 132] === 179)) {
      for (let $i2 = 0; $i2 <= 6; $i2++) {
        i = $i2;
        let $t3;
        $t3 = i * 4 + 144862, w32($t3, ri32($t3) + r16(p + i * 2 + 136));
      }
      rt.fill(p + 136, 14, 0);
      CharHlp.RecalcStats(p);
    }
    p = r32(p + 260);
  }
}

export function ShareMoney() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 56);
  let p: number = 0, cnt: number = 0, takable: number = 0, i: number = 0;
  p = r32(143753);
  cnt = CountSharers() & 255;
  if (cnt === 0) {
    { S.sp = $sp; return; }
  }
  for (let $i1 = 0; $i1 <= 6; $i1++) {
    i = $i1;
    w32($f0 + i * 4, Math.trunc(ri32(i * 4 + 144862) / cnt));
    w32($f0 + i * 4 + 28, ri32(i * 4 + 144862) % cnt);
  }
  while (p !== 0) {
    if (!CharHlp.IsNpc(p)) {
      for (let $i3 = 6; $i3 >= 0; $i3--) {
        i = $i3;
        if (ri32($f0 + i * 4) <= Takable(p, i)) {
          w16(p + i * 2 + 136, ri32($f0 + i * 4) + r16(p + i * 2 + 136));
          CharHlp.RecalcStats(p);
          if (ri32($f0 + i * 4 + 28) > 0) {
            if (ri32($f0 + i * 4 + 28) <= Takable(p, i)) {
              w16(p + i * 2 + 136, r16(p + i * 2 + 136) + 1);
              CharHlp.RecalcStats(p);
              let $t4;
              $t4 = $f0 + i * 4 + 28, w32($t4, ri32($t4) - 1);
            }
          }
        } else {
          takable = Takable(p, i) & 65535;
          w16(p + i * 2 + 136, r16(p + i * 2 + 136) + takable);
          w32($f0 + i * 4 + 28, (ri32($f0 + i * 4 + 28) + ri32($f0 + i * 4)) - takable);
          CharHlp.RecalcStats(p);
        }
      }
    }
    if (!CharHlp.IsNpc(p)) {
      Consolidate(p);
    }
    p = r32(p + 260);
  }
  for (let $i5 = 6; $i5 >= 0; $i5--) {
    i = $i5;
    if (ri32($f0 + i * 4 + 28) > 0) {
      p = r32(143753);
      while (p !== 0) {
        takable = Takable(p, i) & 65535;
        if (takable > ri32($f0 + i * 4 + 28)) {
          takable = ri32($f0 + i * 4 + 28) & 65535;
        }
        if (takable > 0) {
          w16(p + i * 2 + 136, r16(p + i * 2 + 136) + takable);
          CharHlp.RecalcStats(p);
          w32($f0 + i * 4 + 28, ri32($f0 + i * 4 + 28) - takable);
          Consolidate(p);
        }
        p = r32(p + 260);
      }
    }
  }
  for (let $i7 = 0; $i7 <= 6; $i7++) {
    i = $i7;
    w32(i * 4 + 144862, ri32($f0 + i * 4 + 28));
  }
  S.sp = $sp;
}

export async function TakeMoneyMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 267);
  let mType: number = 0, n: number = 0, exitF: boolean = false, ch: number = 0;
  (await Border.DrawWindow(1, 1, 38, 22, 0, 10, ""));
  w16($f0 + 8, 0);
  do {
    U8[$f0 + 266] = true ? 1 : 0;
    w32($f0, CoinMenu(0));
    w32($f0 + 4, r32($f0));
    ch = (await MenuCore.MenuVertical("Select type of coin", "", 13, 10, 15, 2, 2, 15, 8, r32($f0), true, $f0 + 266, $f0 + 8, $f0 + 4)) & 255;
    exitF = (r32($f0 + 4) === 0) || (ch === 0);
    if (!exitF) {
      mType = MoneyCal.ParseMoneyType(rS(r32($f0 + 4)), $f0 + 10) << 24 >> 24;
      wS($f0 + 10, 255, "How much " + rS($f0 + 10) + "will you take? ");
      if (ri32(mType * 4 + 144862) > 65535) {
        n = 65535;
      } else {
        n = ri32(mType * 4 + 144862) & 65535;
      }
      n = (await InputNumberMax(n, rS($f0 + 10), 10)) & 65535;
      (await TakeMoney(r32(143749), n, mType));
      exitF = !PoolHasMoney();
    }
    MenuCore.FreeStringList($f0);
  } while (!(exitF));
  S.sp = $sp;
}

export async function InputNumberMax(max: number, query: string, color: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 13);
  let qLen: number = 0, ch: number = 0, v: number = 0, code: number = 0, n: number = 0, $r0: number = 0;
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, color, query);
  qLen = query.length;
  wS($f0, 5, rt.fmtI(max, 0));
  wS($f0 + 6, 6, "");
  do {
    ch = (await GameIo.ReadAnyKey()) & 255;
    switch (ch) {
      case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: {
        wS($f0 + 6, 6, rS($f0 + 6) + String.fromCharCode(ch));
        v = rt.valI(rS($f0 + 6)) | 0; code = rt.valCode.v << 16 >> 16;
        if (v > max) {
          wS($f0 + 6, 6, rS($f0));
        }
        break;
      }
      case 8: {
        if (U8[$f0 + 6] > 0) {
          wS($f0 + 6, 6, rt.Copy(rS($f0 + 6), 1, U8[$f0 + 6] - 1));
        }
        break;
      }
    }
    if (((ch >= 48 && ch <= 57)) || (ch === 8)) {
      TextRend.PrintSpaces(qLen, 24, 0, 6);
      TextRend.DisplayString(qLen, 24, 15, rS($f0 + 6));
    }
  } while (!((ch === 13) || (ch === 27)));
  TextRend.ClearBottomLine();
  if ((ch === 27) || (rS($f0 + 6) === "")) {
    n = 0;
  } else {
    n = rt.valI(rS($f0 + 6)) & 65535; code = rt.valCode.v << 16 >> 16;
  }
  $r0 = n;
  S.sp = $sp;
  return $r0;
}

export async function TradeMoney(giver: number, rcv: number, qty: number, mType: number) {
  if (qty <= Takable(rcv, mType)) {
    w16(giver + mType * 2 + 136, r16(giver + mType * 2 + 136) - qty);
    CharHlp.RecalcStats(giver);
    w16(rcv + mType * 2 + 136, r16(rcv + mType * 2 + 136) + qty);
    CharHlp.RecalcStats(rcv);
  } else {
    (await CharDisp.PrintBottomLine("Overloaded"));
  }
}

export function DropMoney(p: number, qty: number, mType: number) {
  w16(p + mType * 2 + 136, r16(p + mType * 2 + 136) - qty);
  CharHlp.RecalcStats(p);
  if (((U8[141176] === 6) || (U8[141176] === 1)) || (U8[141176] === 8)) {
    w32(mType * 4 + 144862, ri32(mType * 4 + 144862) + qty);
  }
}

export function DetermineTreasure(treasure: number, items: number) {
  U8[treasure] = PoolHasMoney() ? 1 : 0;
  U8[items] = r32(144890) !== 0 ? 1 : 0;
}

export function CoinMenu(creature: number) {
  let m: number = 0, amount: number = 0, p: number = 0, prev: number = 0, $r0: number = 0;
  p = 0;
  for (let $i1 = 0; $i1 <= 6; $i1++) {
    m = $i1;
    if (creature === 0) {
      amount = ri32(m * 4 + 144862);
    } else {
      amount = r16(creature + m * 2 + 136);
    }
    if (amount > 0) {
      prev = p;
      p = rt.getMem(46);
      w32(p + 42, prev);
      wS(p, 40, StrUtil.PadLeft(rS(m * 9 + 132638), 8) + " " + StrUtil.NumStr(amount));
      U8[p + 41] = 0;
    }
  }
  $r0 = p;
  return $r0;
}

export async function GoBackForIt(said: string, ask: string) {
  let $r0: boolean = false;
  (await TextRend.ShowMessage(10, true, said));
  (await TextRend.ShowMessage(15, false, ask));
  if ((await EclMenu.MenuHorizontalCharacterSelect("", "~Yes ~No", 13, 10, 15, false, false)) === 1) {
    $r0 = false;
  } else {
    (await TextRend.ClearRect(1, 17, 38, 22));
    $r0 = true;
  }
  return $r0;
}

export function PayFromCreature(creature: number, gp: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 28);
  let i: number = 0;
  MoneyCal.CoinsOf(creature, $f0);
  MoneyCal.MakeChange(MoneyCal.CopperValue($f0) - rt.mul(gp, ri32(131934)), 65535, $f0);
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    w16(creature + i * 2 + 136, ri32($f0 + i * 4));
  }
  CharHlp.RecalcStats(creature);
  S.sp = $sp;
}

export function PayFromPool(gp: number) {
  MoneyCal.MakeChange(MoneyCal.CopperValue(144862) - rt.mul(gp, ri32(131934)), 2147483647, 144862);
}

export async function GiveCoins(creature: number, pp: number, gp: number) {
  let ppTaken: number = 0, gpTaken: number = 0;
  ppTaken = pp;
  if (ppTaken > Takable(creature, 4)) {
    ppTaken = Takable(creature, 4) & 65535;
  }
  w16(creature + 144, r16(creature + 144) + ppTaken);
  gpTaken = gp;
  if (gpTaken > Takable(creature, 3)) {
    gpTaken = Takable(creature, 3) & 65535;
  }
  w16(creature + 142, r16(creature + 142) + gpTaken);
  if ((ppTaken < pp) || (gpTaken < gp)) {
    (await CharDisp.PrintBottomLine("Overloaded.  Money will be put in Pool."));
    w32(144878, ri32(144878) + (pp - ppTaken));
    w32(144874, ri32(144874) + (gp - gpTaken));
  }
  CharHlp.RecalcStats(creature);
  Consolidate(creature);
}

export function PayBy(buyer: number, payer: number, gp: number) {
  switch (payer) {
    case 1: {
      PayFromCreature(buyer, gp);
      break;
    }
    case 2: {
      PayFromPool(gp);
      break;
    }
  }
}

export async function PayGold(buyer: number, gp: number) {
  let payer: number = 0, $r0: boolean = false;
  payer = MoneyCal.WhoPays(buyer, gp) & 255;
  if (payer === 0) {
    (await CharDisp.PrintBottomLine("Not enough money."));
  } else {
    PayBy(buyer, payer, gp);
  }
  $r0 = payer !== 0;
  return $r0;
}

export async function AppraiseMenu(ok: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 231);
  let ch: number = 0, r: number = 0, value: number = 0, exitF: boolean = false;
  function HasRoom(creature: number) {
    let $r1: boolean = false;
    CharHlp.RecalcStats(creature);
    $r1 = (U8[creature + 199] < 16) && !CheckOverload(creature, 1, $f0 + 164);
    return $r1;
  }
  async function SellOrKeep(nameId: number, worth: number) {
    let holder: number = 0, c: number = 0;
    holder = 0;
    if (HasRoom(r32(143749))) {
      holder = r32(143749);
    } else {
      TextRend.DisplayString(1, 14, 15, rS(r32(143749)) + " doesn't have space");
      c = r32(143753);
      while ((c !== 0) && (holder === 0)) {
        if (((c !== r32(143749)) && !CharHlp.IsNpc(c)) && HasRoom(c)) {
          holder = c;
        }
        c = r32(c + 260);
      }
      if (holder !== 0) {
        TextRend.DisplayString(1, 15, 15, "Keep will give to " + rS(holder));
      } else {
        TextRend.DisplayString(1, 15, 15, "No one else has space either");
      }
    }
    if (holder !== 0) {
      wS($f0 + 123, 40, "Sell Keep");
    } else {
      wS($f0 + 123, 40, "Sell");
    }
    do {
      ch = (await MenuCore.MenuHorizontal("You can: ", rS($f0 + 123), 13, 10, 15, true, false, $f0 + 230)) & 255;
    } while (!(!(U8[$f0 + 230] !== 0) && ((ch === 83) || ((ch === 75) && (holder !== 0)))));
    if (ch === 75) {
      rt.fill($f0 + 166, 64, 0);
      w32($f0 + 208, 0);
      U8[$f0 + 218] = 0;
      U8[$f0 + 215] = nameId;
      U8[$f0 + 214] = 0;
      U8[$f0 + 213] = 0;
      U8[$f0 + 212] = 70;
      w16($f0 + 224, worth);
      w16($f0 + 221, 1);
      U8[$f0 + 219] = 0;
      CharHlp.AppendItemCopy(holder + 200, $f0 + 166);
      CharHlp.RecalcStats(holder);
    } else {
      (await GiveCoins(r32(143749), Math.trunc(worth / 5), 0));
    }
  }
  U8[ok] = true ? 1 : 0;
  if ((r16(r32(143749) + 146) === 0) && (r16(r32(143749) + 148) === 0)) {
    (await CharDisp.PrintBottomLine("No Gems or Jewelry"));
    U8[ok] = false ? 1 : 0;
  } else {
    do {
      if ((r16(r32(143749) + 146) === 0) && (r16(r32(143749) + 148) === 0)) {
        exitF = true;
      } else {
        exitF = false;
        wS($f0, 40, rt.fmtI(r16(r32(143749) + 146), 0));
        wS($f0 + 41, 40, rt.fmtI(r16(r32(143749) + 148), 0));
        switch (r16(r32(143749) + 146)) {
          case 0: {
            wS($f0, 40, "");
            break;
          }
          case 1: {
            wS($f0, 40, rS($f0) + " Gem");
            break;
          }
          default: {
            wS($f0, 40, rS($f0) + " Gems");
          }
        }
        switch (r16(r32(143749) + 148)) {
          case 0: {
            wS($f0 + 41, 40, "");
            break;
          }
          case 1: {
            wS($f0 + 41, 40, rS($f0 + 41) + " piece of Jewelry");
            break;
          }
          default: {
            wS($f0 + 41, 40, rS($f0 + 41) + " pieces of Jewelry");
          }
        }
        (await TextRend.ClearRect(1, 1, 38, 22));
        CharDisp.DisplayCreatureName(r32(143749), 1, 1, false);
        TextRend.DisplayString(1, 7, 15, "You have a fine collection of:");
        TextRend.DisplayString(1, 9, 15, rS($f0));
        TextRend.DisplayString(1, 10, 15, rS($f0 + 41));
        wS($f0 + 82, 40, "");
        if (r16(r32(143749) + 146) !== 0) {
          wS($f0 + 82, 40, "Gems ");
        }
        if (r16(r32(143749) + 148) !== 0) {
          wS($f0 + 82, 40, rS($f0 + 82) + "Jewelry ");
        }
        wS($f0 + 82, 40, rS($f0 + 82) + "Exit");
        ch = (await MenuCore.MenuHorizontal("Appraise: ", rS($f0 + 82), 13, 10, 15, true, false, $f0 + 230)) & 255;
        switch (ch) {
          case 71: {
            if (r16(r32(143749) + 146) !== 0) {
              let $t4;
              $t4 = r32(143749) + 146, w16($t4, r16($t4) - 1);
              r = Dice.RollDice(1, 100) & 255;
              switch (r) {
                case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12:
                case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24:
                case 25: {
                  value = 10;
                  break;
                }
                case 26: case 27: case 28: case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37:
                case 38: case 39: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48: case 49:
                case 50: {
                  value = 50;
                  break;
                }
                case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 60: case 61: case 62:
                case 63: case 64: case 65: case 66: case 67: case 68: case 69: case 70: {
                  value = 100;
                  break;
                }
                case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80: case 81: case 82:
                case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: {
                  value = 500;
                  break;
                }
                case 91: case 92: case 93: case 94: case 95: case 96: case 97: case 98: case 99: {
                  value = 1000;
                  break;
                }
                case 100: {
                  value = 5000;
                  break;
                }
              }
              wS($f0, 40, rt.fmtI(value, 0));
              wS($f0, 40, "The Gem is Valued at " + rS($f0) + " gp.");
              TextRend.DisplayString(1, 12, 15, rS($f0));
              (await SellOrKeep(101, value));
            }
            break;
          }
          case 74: {
            if (r16(r32(143749) + 148) !== 0) {
              let $t5;
              $t5 = r32(143749) + 148, w16($t5, r16($t5) - 1);
              r = Dice.RollDice(1, 100) & 255;
              switch (r) {
                case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: {
                  value = (TpRand.Random(900) + 100) & 65535;
                  break;
                }
                case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: {
                  value = (TpRand.Random(1000) + 200) & 65535;
                  break;
                }
                case 21: case 22: case 23: case 24: case 25: case 26: case 27: case 28: case 29: case 30: case 31: case 32:
                case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40: {
                  value = (TpRand.Random(1500) + 300) & 65535;
                  break;
                }
                case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48: case 49: case 50: {
                  value = (TpRand.Random(2500) + 500) & 65535;
                  break;
                }
                case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 60: case 61: case 62:
                case 63: case 64: case 65: case 66: case 67: case 68: case 69: case 70: {
                  value = (TpRand.Random(5000) + 1000) & 65535;
                  break;
                }
                case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80: case 81: case 82:
                case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: {
                  value = (TpRand.Random(6000) + 2000) & 65535;
                  break;
                }
                case 91: case 92: case 93: case 94: case 95: case 96: case 97: case 98: case 99: case 100: {
                  value = (TpRand.Random(10000) + 2000) & 65535;
                  break;
                }
              }
              wS($f0 + 41, 40, rt.fmtI(value, 0));
              wS($f0, 40, "The Jewel is Valued at " + rS($f0 + 41) + " gp.");
              TextRend.DisplayString(1, 12, 15, rS($f0));
              (await SellOrKeep(214, value));
            }
            break;
          }
          case 69: case 0: {
            exitF = true;
            break;
          }
        }
        CharHlp.RecalcStats(r32(143749));
      }
    } while (!(exitF));
  }
  S.sp = $sp;
}

export function CarryingCapacity(p: number) {
  let $r0: number = 0;
  if (CharHlp.HasBagOfHolding(p)) {
    $r0 = (((AbilAdj.WeightAllowance(p) | 0) + 1500) + 5000) | 0;
  } else {
    $r0 = ((AbilAdj.WeightAllowance(p) | 0) + 1500) | 0;
  }
  return $r0;
}

export function SpareCapacity(p: number) {
  let room: number = 0, $r0: number = 0;
  room = (CarryingCapacity(p) - CharHlp.RawWeight(p)) | 0;
  if (room < 0) {
    room = 0;
  }
  $r0 = room & 65535;
  return $r0;
}

export function Takable(p: number, mType: number) {
  let n: number = 0, $r0: number = 0;
  n = SpareCapacity(p) & 65535;
  if (MoneyCal.CoinRoom(p, mType) < n) {
    n = MoneyCal.CoinRoom(p, mType) & 65535;
  }
  $r0 = n;
  return $r0;
}

export function Consolidate(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 28);
  let i: number = 0;
  if (U8[141185] === 0) {
    { S.sp = $sp; return; }
  }
  MoneyCal.CoinsOf(creature, $f0);
  MoneyCal.Consolidate($f0);
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    w16(creature + i * 2 + 136, ri32($f0 + i * 4));
  }
  CharHlp.RecalcStats(creature);
  S.sp = $sp;
}

export function CountSharers() {
  let p: number = 0, n: number = 0, $r0: number = 0;
  p = r32(143753);
  n = 0;
  while (p !== 0) {
    if (!CharHlp.IsNpc(p)) {
      n = (n + 1) & 255;
    }
    p = r32(p + 260);
  }
  $r0 = n;
  return $r0;
}

export async function TakeMoney(p: number, qty: number, mType: number) {
  if (qty > Takable(p, mType)) {
    (await CharDisp.PrintBottomLine("Overloaded"));
  } else {
    if (qty > ri32(mType * 4 + 144862)) {
      qty = (ri32(mType * 4 + 144862) & 65535) & 65535;
    }
    w32(mType * 4 + 144862, ri32(mType * 4 + 144862) - qty);
    w16(p + mType * 2 + 136, r16(p + mType * 2 + 136) + qty);
    CharHlp.RecalcStats(p);
    Consolidate(p);
  }
}

export function PoolHasMoney() {
  let i: number = 0, has: boolean = false, $r0: boolean = false;
  has = false;
  for (let $i1 = 0; $i1 <= 6; $i1++) {
    i = $i1;
    if (ri32(i * 4 + 144862) !== 0) {
      has = true;
    }
  }
  $r0 = has;
  return $r0;
}
