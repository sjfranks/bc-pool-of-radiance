// Generated from src/temple.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as TownCore from './towncore';
import * as Types from './types';
import * as Crt from './crt';
import * as C_MSG from './c_msg';
import * as C_MONEY from './c_money';
import * as C_LEVEL from './c_level';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Money from './money';
import * as Magic from './magic';
import * as FxEngine from './fxengine';
import * as C_EFFECT from './c_effect';
import * as C_KEYS from './c_keys';
import * as C_STATUS from './c_status';
import * as C_RACE from './c_race';
import * as Stats from './stats';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as Shop from './shop';
import * as CharDisp from './chardisp';
import * as Dice from './dice';
import * as ClassCal from './classcal';
import * as MoneyCal from './moneycal';
import * as StrUtil from './strutil';
import * as ViewChar from './viewchar';


export const $at = { rules: 249850 };

export async function TempleMainMenu(mode: number) {
  let i: number = 0;
  TempleRules(249850);
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    if (ri32(i * 4 + 249850) > 0) {
      w32(i * 4 + 249850, MoneyCal.TemplePrice(ri32(i * 4 + 249850), mode));
    }
  }
  (await Shop.CounterMenu(true, 21));
}

export async function HealMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 64);
  let count: number = 0, i: number = 0, done: boolean = false, c: number = 0, frame: boolean = false;
  done = false;
  count = 0;
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    if (TownCore.Offers(249850, i)) {
      U8[$f0 + count + 8] = i;
      count = (count + 1) & 255;
    }
  }
  w32($f0, 0);
  MenuCore.AllocStringList(count + 1, $f0);
  w32($f0 + 4, r32($f0));
  i = 0;
  while (r32($f0) !== 0) {
    if (i < count) {
      wS(r32($f0), 40, TownCore.ServiceName(U8[$f0 + i + 8]));
    } else {
      wS(r32($f0), 40, "Exit");
    }
    U8[r32($f0) + 41] = 0;
    w32($f0, r32(r32($f0) + 42));
    i = (i + 1) & 255;
  }
  w32($f0, r32($f0 + 4));
  frame = true;
  w16($f0 + 21, 0);
  do {
    if (frame) {
      (await TextRend.ClearRect(0, 24, 39, 24));
      U8[$f0 + 20] = true ? 1 : 0;
      (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
      (await Border.DrawWindow(1, 1, 38, 1, 0, 15, ""));
      frame = false;
    }
    wS($f0 + 23, 40, rS(r32(143749)) + ", how can we help you?");
    TextRend.DisplayString(1, 1, 15, rS($f0 + 23));
    (await Border.DrawWindow(1, 17, 38, 22, 0, 15, ""));
    U8[227105] = true ? 1 : 0;
    c = (await MenuCore.MenuVertical("", "Heal Repair Exit", 13, 10, 15, 2, 3, 38, 15, r32($f0), false, $f0 + 20, $f0 + 21, $f0 + 4)) & 255;
    switch (c) {
      case 72: case 13: {
        if ((ri16($f0 + 21) >= 0) && (ri16($f0 + 21) < count)) {
          (await Serve(U8[$f0 + ri16($f0 + 21) + 8]));
        } else {
          done = true;
        }
        break;
      }
      case 82: {
        (await RepairParty());
        break;
      }
      case 0: {
        done = true;
        break;
      }
      default: {
        if ((await ViewChar.AltItems(c))) {
          frame = true;
        }
      }
    }
  } while (!(done));
  MenuCore.FreeStringList($f0);
  (await TextRend.ClearRect(0, 0, 39, 24));
  (await CharDisp.DisplayNoncombatInterface());
  (await CharDisp.DisplayParty(r32(143749)));
  S.sp = $sp;
}

export function TempleRules(r: number) {
  TownCore.DefaultRules(r);
  TownCore.StandardPrices(r, 1);
  rt.wSet(r + 61, 0, 4, rt.sUnion(rt.rSet(r + 61, 0, 4), rt.setR(0, 0)));
  rt.wSet(r + 65, 0, 4, rt.sUnion(rt.rSet(r + 65, 0, 4), rt.setR(0, 0)));
  U8[r + 74] = true ? 1 : 0;
}

export function CanonRace(race: number) {
  let $r0: number = 0;
  switch (race) {
    case 1: {
      $r0 = 2;
      break;
    }
    case 2: {
      $r0 = 3;
      break;
    }
    case 3: {
      $r0 = 4;
      break;
    }
    case 4: {
      $r0 = 5;
      break;
    }
    case 5: {
      $r0 = 6;
      break;
    }
    case 6: {
      $r0 = 7;
      break;
    }
    case 7: {
      $r0 = 1;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function Look(c: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let cr: number = 0, item: number = 0, i: number = 0;
  cr = r32(143749);
  U8[c] = U8[cr + 268];
  w16(c + 1, U8[cr + 283]);
  w16(c + 3, U8[cr + 50]);
  U8[c + 5] = U8[cr + 20];
  U8[c + 6] = U8[cr + 20];
  U8[c + 7] = CanonRace(I8[cr + 46]);
  U8[c + 8] = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    i = $i1;
    if (I8[cr + i + 150] > U8[c + 8]) {
      U8[c + 8] = I8[cr + i + 150];
    }
  }
  w16(c + 9, 0);
  if (CharHlp.HasEffect(cr, 33, $f0)) {
    w16(c + 9, r16(c + 9) | 1);
  }
  if (FxEngine.HasDisease(cr)) {
    w16(c + 9, r16(c + 9) | 2);
  }
  if (CharHlp.HasEffect(cr, 55, $f0)) {
    w16(c + 9, r16(c + 9) | 4);
  }
  if (CharHlp.HasEffect(cr, 22, $f0) || CharHlp.HasEffect(cr, 15, $f0)) {
    w16(c + 9, r16(c + 9) | 8);
  }
  if (CharHlp.HasEffect(cr, 50, $f0)) {
    w16(c + 9, r16(c + 9) | 32);
  }
  if (CharHlp.HasEffect(cr, 36, $f0)) {
    w16(c + 9, r16(c + 9) | 16);
  }
  if (CharHlp.HasEffect(cr, 154, $f0)) {
    w16(c + 9, r16(c + 9) | 128);
  }
  item = r32(cr + 200);
  while (item !== 0) {
    if (U8[item + 54] !== 0) {
      w16(c + 9, r16(c + 9) | 16);
    }
    item = r32(item + 42);
  }
  U8[c + 11] = U8[cr + 116];
  if (U8[cr + 116] > 0) {
    w16(c + 9, r16(c + 9) | 64);
  }
  S.sp = $sp;
}

export async function Ask(msg: string) {
  let $r0: boolean = false;
  (await CharDisp.PrintNameString(r32(143749), msg, 0, false));
  $r0 = (await MenuCore.YesNoMenu("cast cure anyway: ", 13, 10, 15)) === 89;
  (await CharDisp.ClearMessageWindow());
  return $r0;
}

export async function Pay(quote: string, cost: number) {
  let $r0: boolean = false;
  (await TextRend.ShowMessage(10, true, quote));
  $r0 = false;
  if ((await MenuCore.YesNoMenu("pay for cure ", 13, 15, 10)) === 89) {
    $r0 = (await Money.PayGold(r32(143749), cost));
  }
  return $r0;
}

export async function Say(msg: string) {
  (await CharDisp.ClearMessageWindow());
  (await CharDisp.PrintNameString(r32(143749), msg, 0, true));
}

export async function Act(d: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  mv($f0 + 0, d, 7);
  let cr: number = 0, i: number = 0, hp: number = 0;
  cr = r32(143749);
  if ((r16($f0) & 1) !== 0) {
    (await FxEngine.RemoveEffect(cr, 33, 0));
  }
  if ((r16($f0) & 2) !== 0) {
    if ((await FxEngine.RemoveDiseases(cr))) {
    }
  }
  if ((r16($f0) & 16) !== 0) {
    (await FxEngine.RemoveEffect(cr, 154, 0));
  }
  U8[144903] = 1;
  if ((r16($f0) & 4) !== 0) {
    (await FxEngine.RemoveEffect(cr, 55, 0));
    (await FxEngine.RemoveEffect(cr, 22, 0));
    (await FxEngine.RemoveEffect(cr, 15, 0));
  }
  if ((r16($f0) & 8) !== 0) {
    (await FxEngine.RemoveEffect(cr, 32, 0));
  }
  U8[144903] = 0;
  if ((r16($f0) & 32) !== 0) {
    w32(146161, cr);
    (await Magic.SpellRemoveCurse());
  }
  if ((r16($f0) & 64) !== 0) {
    w32(146161, cr);
    (await Magic.SpellRestoration());
  }
  if ((r16($f0) & 128) !== 0) {
    for (let $i1 = 1, $e1 = U8[$f0 + 5]; $i1 <= $e1; $i1++) {
      i = $i1;
      ClassCal.LoseConstitution(cr);
    }
  }
  if ((r16($f0) & 256) !== 0) {
    U8[cr + 268] = U8[$f0 + 2];
    U8[cr + 269] = (U8[$f0 + 2] === 0 ? 1 : 0);
  }
  if ((r16($f0) & 512) !== 0) {
    U8[cr + 283] = ri16($f0 + 3);
  }
  if ((r16($f0) & 1024) !== 0) {
    U8[cr + 283] = U8[cr + 50];
  }
  if ((r16($f0) & 2048) !== 0) {
    hp = ri16($f0 + 3);
    if (hp > 255) {
      hp = 255;
    }
    if ((await FxEngine.RestoreHitPoints(cr, hp, false))) {
    }
  }
  if ((r16($f0) & 4096) !== 0) {
    Stats.Count(cr, 6, 1);
  }
  if ((r16($f0) & 8192) !== 0) {
    Stats.Death(cr);
  }
  S.sp = $sp;
}

export function Roll(n: number, sides: number) {
  let $r0: number = 0;
  $r0 = Dice.RollDice(n, sides) << 16 >> 16;
  return $r0;
}

export function Words(msg: number) {
  let $r0: string = "";
  switch (msg) {
    case 18: {
      $r0 = "is poisoned, and RAISE DEAD cannot help.";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function TempleIO(io: number) {
  w32(io, 22);
  w32(io + 4, 23);
  w32(io + 8, 24);
  w32(io + 12, 25);
  w32(io + 16, 26);
  w32(io + 20, 27);
  w32(io + 24, 28);
}

export async function Serve(svc: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 28);
  TempleIO($f0);
  (await TownCore.TempleService(249850, svc, $f0));
  S.sp = $sp;
}

export async function RepairParty() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 176);
  let n: number = 0, i: number = 0, p: number = 0, buyer: number = 0, total: number = 0, undone: number = 0;
  TempleIO($f0 + 148);
  buyer = r32(143749);
  n = 0;
  total = 0;
  p = r32(143753);
  while ((p !== 0) && (n < 8)) {
    n = (n + 1) & 255;
    w32($f0 + n * 4 + 100, p);
    w32(143749, p);
    Look($f0 + 136);
    TownCore.RepairPlan(249850, $f0 + 136, $f0 + n * 13 - 13);
    total = (total + TownCore.RepairCost(249850, $f0 + n * 13 - 13)) | 0;
    p = r32(p + 260);
  }
  for (let $i2 = 1, $e2 = n; $i2 <= $e2; $i2++) {
    i = $i2;
    if (U8[$f0 + i * 13 - 1] !== 0) {
      w32(143749, r32($f0 + i * 4 + 100));
      (await Say((await TownCore.TempleWords($f0 + 148, U8[$f0 + i * 13 - 1]))));
    }
  }
  w32(143749, buyer);
  if (total === 0) {
    (await CharDisp.MessageText("The party needs nothing the temple can give.", 10, true));
    (await CharDisp.MessageWait());
  } else if ((await Pay(TownCore.RepairQuote(249850, total), total))) {
    undone = 0;
    for (let $i3 = 1, $e3 = n; $i3 <= $e3; $i3++) {
      i = $i3;
      w32(143749, r32($f0 + i * 4 + 100));
      undone = (undone + (await TownCore.TempleRepair(249850, $f0 + i * 13 - 13, $f0 + 148))) | 0;
    }
    w32(143749, buyer);
    if (undone > 0) {
      w32(144874, ri32(144874) + undone);
      (await TextRend.ShowMessage(10, true, "The priests put " + StrUtil.NumStr(undone) + " gold pieces back in the pool."));
      (await TextRend.PauseOnly());
    }
  }
  w32(143749, buyer);
  (await CharDisp.ClearMessageWindow());
  S.sp = $sp;
}
