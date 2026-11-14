// Generated from src/towncore.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as AbilAdj from './abiladj';

export const RACE_MONSTER = 0;
export const RACE_HUMAN = 1;
export const RACE_DWARF = 2;
export const RACE_ELF = 3;
export const RACE_GNOME = 4;
export const RACE_HALFELF = 5;
export const RACE_HALFLING = 6;
export const RACE_HALFORC = 7;
export const RACE_SILVANESTI = 8;
export const RACE_QUALINESTI = 9;
export const RACE_MOUNTAINDWARF = 10;
export const RACE_HILLDWARF = 11;
export const RACE_KENDER = 12;
export const TS_CURE_BLIND = 0;
export const TS_CURE_DISEASE = 1;
export const TS_CURE_LIGHT = 2;
export const TS_CURE_SERIOUS = 3;
export const TS_CURE_CRITICAL = 4;
export const TS_HEAL = 5;
export const TS_NEUTRALIZE = 6;
export const TS_RAISE = 7;
export const TS_RESURRECT = 8;
export const TS_REMOVE_CURSE = 9;
export const TS_STONE = 10;
export const TS_RESTORE = 11;
export const TS_LAST = 11;
export const TP_NONE = -1;
export const TC_OKAY = 0;
export const TC_ANIMATED = 1;
export const TC_TEMPGONE = 2;
export const TC_RUNNING = 3;
export const TC_UNCONSCIOUS = 4;
export const TC_DYING = 5;
export const TC_DEAD = 6;
export const TC_STONED = 7;
export const TC_GONE = 8;
export const TF_BLIND = 1;
export const TF_DISEASED = 2;
export const TF_POISONED = 4;
export const TF_SLOW_POISON = 8;
export const TF_CURSED = 16;
export const TF_ROT = 32;
export const TF_DRAINED = 64;
export const TF_FEEBLE = 128;
export const TA_BLIND = 1;
export const TA_DISEASE = 2;
export const TA_POISON = 4;
export const TA_ANIMATE = 8;
export const TA_FEEBLE = 16;
export const TA_CURSE = 32;
export const TA_RESTORE = 64;
export const TA_LOSE_CON = 128;
export const TA_STATUS = 256;
export const TA_SET_HP = 512;
export const TA_FULL_HP = 1024;
export const TA_HEAL_HP = 2048;
export const TA_RAISED = 4096;
export const TA_DIED = 8192;
export const TM_NONE = 0;
export const TM_CURED = 1;
export const TM_NOT_HELPED = 2;
export const TM_NO_SURVIVE = 3;
export const TM_SHOCK = 4;
export const TM_NOT_BLIND = 5;
export const TM_NOT_DISEASED = 6;
export const TM_NOT_WOUNDED = 7;
export const TM_IS_DEAD = 8;
export const TM_IS_STONED = 9;
export const TM_CANNOT_HEAL = 10;
export const TM_ROT = 11;
export const TM_NOT_DEAD = 12;
export const TM_NOT_POISONED = 13;
export const TM_NOT_CURSED = 14;
export const TM_NOT_STONED = 15;
export const TM_NOT_DRAINED = 16;
export const TM_GONE = 17;
export const TM_STILL_POISONED = 18;
export const TM_NO_CON = 19;
export const TM_ELF = 20;
export const TM_RACE = 21;
export const TM_LEVEL = 22;
export const TM_RESURRECTED = 23;
export const TM_SEES = 24;
export const TM_HEALED = 25;
export const TM_FULLY_HEALED = 26;
export const TM_UNPOISONED = 27;
export const TM_RAISED = 28;
export const TM_UNCURSED = 29;
export const TM_FLESH = 30;
export const TM_LAST = 30;
export const TM_BY_HP = 255;
export const REPAIR_STEPS = 7;

export function DefaultRules(r: number) {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    w32(r + i * 4, -1);
  }
  wS(r + 48, 12, "gold");
  rt.wSet(r + 61, 0, 4, rt.setR(1, 1, 2, 2, 4, 4, 5, 5, 6, 6, 7, 7, 10, 10, 11, 11, 12, 12));
  rt.wSet(r + 65, 0, 4, rt.rSet(r + 61, 0, 4));
  U8[r + 69] = 0;
  U8[r + 70] = 0;
  U8[r + 71] = 1;
  U8[r + 72] = 1;
  U8[r + 73] = true ? 1 : 0;
  U8[r + 74] = false ? 1 : 0;
  U8[r + 75] = true ? 1 : 0;
}

export function StandardPrices(r: number, divisor: number) {
  let i: number = 0;
  if (divisor === 0) {
    divisor = 1;
  }
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    w32(r + i * 4, Math.trunc(r16(i * 2 + 257957) / divisor));
  }
}

export function Offers(r: number, svc: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 76);
  mv($f0 + 0, r, 76);
  let $r0: boolean = false;
  $r0 = (svc <= 11) && (ri32($f0 + svc * 4) >= 0);
  S.sp = $sp;
  return $r0;
}

export function ServiceName(svc: number) {
  let $r0: string = "";
  switch (svc) {
    case 0: {
      $r0 = "Cure Blindness";
      break;
    }
    case 1: {
      $r0 = "Cure Disease";
      break;
    }
    case 2: {
      $r0 = "Cure Light Wounds";
      break;
    }
    case 3: {
      $r0 = "Cure Serious Wounds";
      break;
    }
    case 4: {
      $r0 = "Cure Critical Wounds";
      break;
    }
    case 5: {
      $r0 = "Heal";
      break;
    }
    case 6: {
      $r0 = "Neutralize Poison";
      break;
    }
    case 7: {
      $r0 = "Raise Dead";
      break;
    }
    case 8: {
      $r0 = "Resurrection";
      break;
    }
    case 9: {
      $r0 = "Remove Curse";
      break;
    }
    case 10: {
      $r0 = "Stone to Flesh";
      break;
    }
    case 11: {
      $r0 = "Restoration";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function TempleText(msg: number) {
  let $r0: string = "";
  switch (msg) {
    case 1: case 24: case 25: case 26: case 27: case 28: case 29: case 30: {
      $r0 = "is cured.";
      break;
    }
    case 2: {
      $r0 = "is not helped.";
      break;
    }
    case 3: {
      $r0 = "does not survive.";
      break;
    }
    case 4: {
      $r0 = "DOESN'T SURVIVE THE TRANSFORMATION.";
      break;
    }
    case 5: {
      $r0 = "is not blind.";
      break;
    }
    case 6: {
      $r0 = "is not Diseased.";
      break;
    }
    case 7: {
      $r0 = "is not wounded.";
      break;
    }
    case 8: {
      $r0 = "is dead.";
      break;
    }
    case 9: {
      $r0 = "is stoned.";
      break;
    }
    case 10: {
      $r0 = "cannot be healed.";
      break;
    }
    case 11: {
      $r0 = "has mummy rot, which stops healing.";
      break;
    }
    case 12: {
      $r0 = "is not dead.";
      break;
    }
    case 13: {
      $r0 = "is not poisoned.";
      break;
    }
    case 14: {
      $r0 = "is not cursed.";
      break;
    }
    case 15: {
      $r0 = "is not stoned.";
      break;
    }
    case 16: {
      $r0 = "has lost no levels.";
      break;
    }
    case 17: {
      $r0 = "is beyond help.";
      break;
    }
    case 18: {
      $r0 = "is still poisoned.";
      break;
    }
    case 19: {
      $r0 = "cannot be raised.";
      break;
    }
    case 20: {
      $r0 = "is an elf and cannot be raised.";
      break;
    }
    case 21: {
      $r0 = "cannot be raised.";
      break;
    }
    case 22: {
      $r0 = "is too inexperienced to be raised.";
      break;
    }
    case 23: {
      $r0 = "is resurrected.";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function NoWords(msg: number) {
  let $r0: string = "";
  $r0 = "";
  return $r0;
}

export function TempleWords(io: number, msg: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 284);
  mv($f0 + 0, io, 28);
  let $r0: string = "";
  wS($f0 + 28, 255, rt.FT[r32($f0 + 24)](msg));
  if (rS($f0 + 28) === "") {
    wS($f0 + 28, 255, TempleText(msg));
  }
  $r0 = rS($f0 + 28);
  S.sp = $sp;
  return $r0;
}

export function TempleQuote(r: number, svc: number, cost: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 89);
  mv($f0 + 0, r, 76);
  let $r0: string = "";
  wS($f0 + 76, 12, rt.fmtI(cost, 0));
  $r0 = ServiceName(svc) + " will only cost " + rS($f0 + 76) + " " + rS($f0 + 48) + " pieces.";
  S.sp = $sp;
  return $r0;
}

export function TempleRefusal(r: number, svc: number, c: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 92);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, c, 12);
  let minLevel: number = 0, $r0: number = 0;
  $r0 = 0;
  if ((svc !== 7) && (svc !== 8)) {
    { S.sp = $sp; return $r0; }
  }
  if (U8[$f0 + 76] === 8) {
    $r0 = 17;
    { S.sp = $sp; return $r0; }
  }
  if (!IsCorpse($f0 + 76)) {
    { S.sp = $sp; return $r0; }
  }
  if (svc === 7) {
    rt.wSet($f0 + 88, 0, 4, rt.rSet($f0 + 61, 0, 4));
    minLevel = U8[$f0 + 69];
  } else {
    rt.wSet($f0 + 88, 0, 4, rt.rSet($f0 + 65, 0, 4));
    minLevel = U8[$f0 + 70];
  }
  if (((svc === 7) && (U8[$f0 + 76] === 6)) && ((r16($f0 + 85) & 4) !== 0)) {
    $r0 = 18;
  } else if (U8[$f0 + 81] === 0) {
    $r0 = 19;
  } else if (!((U8[$f0 + 83] <= 31) && rt.inM($f0 + 88, 0, 4, U8[$f0 + 83]))) {
    let $t1;
    if (($t1 = U8[$f0 + 83], $t1 === 3 || $t1 === 8 || $t1 === 9)) {
      $r0 = 20;
    } else {
      $r0 = 21;
    }
  } else if (U8[$f0 + 84] < minLevel) {
    $r0 = 22;
  }
  S.sp = $sp;
  return $r0;
}

export function TempleNeed(svc: number, c: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  mv($f0 + 0, c, 12);
  let m: number = 0, $r0: number = 0;
  m = 0;
  switch (svc) {
    case 0: {
      if ((r16($f0 + 9) & 1) === 0) {
        m = 5;
      }
      break;
    }
    case 1: {
      if ((r16($f0 + 9) & 2) === 0) {
        m = 6;
      }
      break;
    }
    case 2: case 3: case 4: {
      m = NoWoundCure($f0, true) & 255;
      break;
    }
    case 5: {
      m = NoWoundCure($f0, false) & 255;
      break;
    }
    case 6: {
      if ((r16($f0 + 9) & 4) === 0) {
        m = 13;
      }
      break;
    }
    case 7: case 8: {
      if (!IsCorpse($f0)) {
        m = 12;
      }
      break;
    }
    case 9: {
      if ((r16($f0 + 9) & 16) === 0) {
        m = 14;
      }
      break;
    }
    case 10: {
      if (U8[$f0] !== 7) {
        m = 15;
      }
      break;
    }
    case 11: {
      if ((r16($f0 + 9) & 64) === 0) {
        m = 16;
      }
      break;
    }
  }
  $r0 = m;
  S.sp = $sp;
  return $r0;
}

export function TempleDice(r: number, svc: number, c: number, n: number, sides: number, plus: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 88);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, c, 12);
  U8[n] = 0;
  U8[sides] = 0;
  w16(plus, 0);
  switch (svc) {
    case 2: {
      U8[n] = 1;
      U8[sides] = 8;
      break;
    }
    case 3: {
      U8[n] = 2;
      U8[sides] = 8;
      w16(plus, 1);
      break;
    }
    case 4: {
      U8[n] = 3;
      U8[sides] = 8;
      w16(plus, 3);
      break;
    }
    case 5: {
      U8[n] = 1;
      U8[sides] = 4;
      break;
    }
    case 7: case 8: {
      if ((U8[$f0 + 73] !== 0) && IsCorpse($f0 + 76)) {
        U8[n] = 1;
        U8[sides] = 100;
      }
      break;
    }
    case 10: {
      if ((U8[$f0 + 75] !== 0) && (U8[$f0 + 76] === 7)) {
        U8[n] = 1;
        U8[sides] = 100;
      }
      break;
    }
  }
  S.sp = $sp;
}

export function TempleDeed(r: number, svc: number, c: number, roll: number, d: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 88);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, c, 12);
  let needed: boolean = false, missing: number = 0;
  w16(d, 0);
  U8[d + 2] = U8[$f0 + 76];
  w16(d + 3, 0);
  U8[d + 5] = 0;
  needed = TempleNeed(svc, $f0 + 76) === 0;
  if (!needed) {
    U8[d + 6] = 2;
  } else {
    switch (svc) {
      case 0: {
        U8[d + 6] = 24;
        break;
      }
      case 6: {
        U8[d + 6] = 27;
        break;
      }
      case 9: {
        U8[d + 6] = 29;
        break;
      }
      case 10: {
        U8[d + 6] = 30;
        break;
      }
      default: {
        U8[d + 6] = 1;
      }
    }
  }
  switch (svc) {
    case 0: {
      w16(d, 1);
      break;
    }
    case 1: {
      w16(d, 2);
      break;
    }
    case 2: case 3: case 4: {
      w16(d, 2048);
      if (roll < 0) {
        roll = 0;
      }
      w16(d + 3, roll);
      U8[d + 6] = 255;
      break;
    }
    case 5: {
      missing = ((ri16($f0 + 79) - ri16($f0 + 77)) - roll) << 16 >> 16;
      if (missing < 0) {
        missing = 0;
      }
      w16(d, 2067);
      w16(d + 3, missing);
      if (needed) {
        if ((ri16($f0 + 77) < ri16($f0 + 79)) && ((r16($f0 + 85) & 131) !== 0)) {
          U8[d + 6] = 26;
        } else {
          U8[d + 6] = 25;
        }
      }
      break;
    }
    case 6: {
      w16(d, 4);
      let $t1;
      if ((((r16($f0 + 85) & 4) !== 0) && !($t1 = U8[$f0 + 76], $t1 === 1 || $t1 === 7 || $t1 === 8 || $t1 === 2 || $t1 === 3)) && ((U8[$f0 + 76] !== 6) || ((r16($f0 + 85) & 8) === 0))) {
        w16(d, r16(d) | 256);
        U8[d + 2] = 0;
        if (ri16($f0 + 77) <= 0) {
          w16(d, r16(d) | 512);
          w16(d + 3, 1);
        }
      }
      break;
    }
    case 7: case 8: {
      if (needed && (TempleRefusal($f0, svc, $f0 + 76) === 0)) {
        Revive($f0, svc, $f0 + 76, roll, d);
      }
      break;
    }
    case 9: {
      w16(d, 32);
      break;
    }
    case 10: {
      if (U8[$f0 + 76] === 7) {
        w16(d, 768);
        if ((U8[$f0 + 75] !== 0) && !AbilAdj.SurvivesSystemShock(U8[$f0 + 82], roll)) {
          w16(d, r16(d) | 8192);
          U8[d + 2] = 6;
          w16(d + 3, 0);
          U8[d + 6] = 4;
        } else {
          U8[d + 2] = 0;
          w16(d + 3, 1);
        }
      }
      break;
    }
    case 11: {
      w16(d, 64);
      break;
    }
  }
  S.sp = $sp;
}

export async function TempleService(r: number, svc: number, io: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 139);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, io, 28);
  let why: number = 0, cost: number = 0, roll: number = 0;
  if (!Offers($f0, svc)) {
    { S.sp = $sp; return; }
  }
  rt.FT[r32($f0 + 76)]($f0 + 104);
  why = TempleRefusal($f0, svc, $f0 + 104) & 255;
  if (why !== 0) {
    (await rt.FT[r32($f0 + 88)](TempleWords($f0 + 76, why)));
    { S.sp = $sp; return; }
  }
  cost = ri32($f0 + svc * 4);
  why = TempleNeed(svc, $f0 + 104) & 255;
  if (why !== 0) {
    if (cost === 0) {
      (await rt.FT[r32($f0 + 88)](TempleWords($f0 + 76, why)));
      { S.sp = $sp; return; }
    } else if (!(await rt.FT[r32($f0 + 80)](TempleWords($f0 + 76, why)))) {
      { S.sp = $sp; return; }
    }
  }
  if (cost > 0) {
    if (!(await rt.FT[r32($f0 + 84)](TempleQuote($f0, svc, cost), cost))) {
      { S.sp = $sp; return; }
    }
  }
  TempleDice($f0, svc, $f0 + 104, $f0 + 135, $f0 + 136, $f0 + 137);
  roll = ri16($f0 + 137);
  if (U8[$f0 + 135] > 0) {
    roll = (roll + rt.FT[r32($f0 + 96)](U8[$f0 + 135], U8[$f0 + 136])) << 16 >> 16;
  }
  TempleDeed($f0, svc, $f0 + 104, roll, $f0 + 128);
  (await rt.FT[r32($f0 + 92)]($f0 + 128));
  if (U8[$f0 + 134] === 255) {
    rt.FT[r32($f0 + 76)]($f0 + 116);
    if (ri16($f0 + 117) > ri16($f0 + 105)) {
      U8[$f0 + 134] = 25;
    } else {
      U8[$f0 + 134] = 2;
    }
  }
  (await rt.FT[r32($f0 + 88)](TempleWords($f0 + 76, U8[$f0 + 134])));
  S.sp = $sp;
}

export function RepairStep(i: number) {
  let $r0: number = 0;
  switch (i) {
    case 1: {
      $r0 = 6;
      break;
    }
    case 2: {
      $r0 = 7;
      break;
    }
    case 3: {
      $r0 = 10;
      break;
    }
    case 4: {
      $r0 = 11;
      break;
    }
    case 5: {
      $r0 = 5;
      break;
    }
    case 6: {
      $r0 = 0;
      break;
    }
    default: {
      $r0 = 1;
    }
  }
  return $r0;
}

export function RepairPlan(r: number, c: number, p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 107);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, c, 12);
  rt.fill(p, 13, 0);
  mv($f0 + 88, $f0 + 76, 12);
  if (U8[$f0 + 88] === 8) {
    U8[p + 12] = 17;
    { S.sp = $sp; return; }
  }
  let $t1;
  if (($t1 = U8[$f0 + 88], $t1 === 1 || $t1 === 2 || $t1 === 3)) {
    { S.sp = $sp; return; }
  }
  if (((r16($f0 + 97) & 4) !== 0) && Offers($f0, 6)) {
    U8[p + 6] = 1;
    TempleDeed($f0, 6, $f0 + 88, 0, $f0 + 100);
    Suppose($f0 + 88, $f0 + 100);
  }
  if (U8[$f0 + 88] === 6) {
    U8[p + 12] = TempleRefusal($f0, 7, $f0 + 88);
    if ((U8[p + 12] !== 0) || !Offers($f0, 7)) {
      rt.fill(p, 12, 0);
      { S.sp = $sp; return; }
    }
    U8[p + 7] = 1;
    TempleDeed($f0, 7, $f0 + 88, 1, $f0 + 100);
    Suppose($f0 + 88, $f0 + 100);
  } else if ((U8[$f0 + 88] === 7) && Offers($f0, 10)) {
    U8[p + 10] = 1;
    TempleDeed($f0, 10, $f0 + 88, 1, $f0 + 100);
    Suppose($f0 + 88, $f0 + 100);
  }
  if ((U8[$f0 + 99] > 0) && Offers($f0, 11)) {
    U8[p + 11] = U8[$f0 + 99];
  }
  if ((Offers($f0, 5) && (NoWoundCure($f0 + 88, false) === 0)) && ((ri16($f0 + 89) < ri16($f0 + 91)) || ((r16($f0 + 97) & 160) !== 0))) {
    U8[p + 5] = 1;
  } else {
    if (((r16($f0 + 97) & 1) !== 0) && Offers($f0, 0)) {
      U8[p] = 1;
    }
    if (((r16($f0 + 97) & 2) !== 0) && Offers($f0, 1)) {
      U8[p + 1] = 1;
    }
  }
  S.sp = $sp;
}

export function RepairCost(r: number, p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 89);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, p, 13);
  let i: number = 0, cost: number = 0, $r0: number = 0;
  cost = 0;
  for (let $i1 = 0; $i1 <= 11; $i1++) {
    i = $i1;
    if ((U8[$f0 + i + 76] > 0) && (ri32($f0 + i * 4) > 0)) {
      cost = (cost + (ri32($f0 + i * 4) * U8[$f0 + i + 76])) | 0;
    }
  }
  $r0 = cost;
  S.sp = $sp;
  return $r0;
}

export function RepairQuote(r: number, cost: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 89);
  mv($f0 + 0, r, 76);
  let $r0: string = "";
  wS($f0 + 76, 12, rt.fmtI(cost, 0));
  $r0 = "Repairing the party will cost " + rS($f0 + 76) + " " + rS($f0 + 48) + " pieces.";
  S.sp = $sp;
  return $r0;
}

export async function TempleRepair(r: number, p: number, io: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 140);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, p, 13);
  mv($f0 + 89, io, 28);
  let step: number = 0, svc: number = 0, k: number = 0, roll: number = 0, undone: number = 0, failed: boolean = false, any: boolean = false, $r0: number = 0;
  undone = 0;
  failed = false;
  any = false;
  for (let $i1 = 1; $i1 <= 7; $i1++) {
    step = $i1;
    svc = RepairStep(step) & 255;
    for (let $i2 = 1, $e2 = U8[$f0 + svc + 76]; $i2 <= $e2; $i2++) {
      k = $i2;
      if (failed) {
        if (ri32($f0 + svc * 4) > 0) {
          undone = (undone + ri32($f0 + svc * 4)) | 0;
        }
      } else {
        any = true;
        rt.FT[r32($f0 + 89)]($f0 + 117);
        roll = 0;
        if (svc !== 5) {
          TempleDice($f0, svc, $f0 + 117, $f0 + 136, $f0 + 137, $f0 + 138);
          roll = ri16($f0 + 138);
          if (U8[$f0 + 136] > 0) {
            roll = (roll + rt.FT[r32($f0 + 109)](U8[$f0 + 136], U8[$f0 + 137])) << 16 >> 16;
          }
        }
        TempleDeed($f0, svc, $f0 + 117, roll, $f0 + 129);
        (await rt.FT[r32($f0 + 105)]($f0 + 129));
        if ((U8[$f0 + 135] === 3) || (U8[$f0 + 135] === 4)) {
          (await rt.FT[r32($f0 + 101)](TempleWords($f0 + 89, U8[$f0 + 135])));
          failed = true;
        }
      }
    }
  }
  if (any && !failed) {
    (await rt.FT[r32($f0 + 101)](TempleWords($f0 + 89, 1)));
  }
  $r0 = undone;
  S.sp = $sp;
  return $r0;
}

export function IsCorpse(c: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  mv($f0 + 0, c, 12);
  let $r0: boolean = false;
  $r0 = (U8[$f0] === 6) || (U8[$f0] === 1);
  S.sp = $sp;
  return $r0;
}

export function NoWoundCure(c: number, woundsOnly: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  mv($f0 + 0, c, 12);
  let $r0: number = 0;
  $r0 = 0;
  switch (U8[$f0]) {
    case 0: case 1: case 4: case 5: {
      if (woundsOnly) {
        if ((r16($f0 + 9) & 32) !== 0) {
          $r0 = 11;
        } else if (ri16($f0 + 1) >= ri16($f0 + 3)) {
          $r0 = 7;
        }
      }
      break;
    }
    case 6: {
      $r0 = 8;
      break;
    }
    case 7: {
      $r0 = 9;
      break;
    }
    default: {
      $r0 = 10;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function ConCost(c: number, loss: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  mv($f0 + 0, c, 12);
  let $r0: number = 0;
  if (U8[$f0 + 5] <= 3) {
    $r0 = 0;
  } else if ((U8[$f0 + 5] - loss) < 3) {
    $r0 = (U8[$f0 + 5] - 3) & 255;
  } else {
    $r0 = loss;
  }
  S.sp = $sp;
  return $r0;
}

export function Revive(r: number, svc: number, c: number, roll: number, d: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 88);
  mv($f0 + 0, r, 76);
  mv($f0 + 76, c, 12);
  let loss: number = 0;
  if ((U8[$f0 + 73] !== 0) && (roll > AbilAdj.ConResurrectionSurvival(U8[$f0 + 81]))) {
    if ((U8[$f0 + 74] !== 0)) {
      w16(d, 776);
      U8[d + 2] = 8;
      w16(d + 3, 0);
    }
    U8[d + 6] = 3;
    { S.sp = $sp; return; }
  }
  if (svc === 7) {
    loss = U8[$f0 + 71];
  } else {
    loss = U8[$f0 + 72];
  }
  U8[d + 5] = ConCost($f0 + 76, loss);
  w16(d, 4364);
  if (U8[d + 5] > 0) {
    w16(d, r16(d) | 128);
  }
  U8[d + 2] = 0;
  if (svc === 7) {
    w16(d, r16(d) | 512);
    w16(d + 3, 1);
    U8[d + 6] = 28;
  } else {
    w16(d, r16(d) | 1024);
    U8[d + 6] = 23;
  }
  S.sp = $sp;
}

export function Suppose(c: number, d: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  mv($f0 + 0, d, 7);
  if ((r16($f0) & 4) !== 0) {
    w16(c + 9, r16(c + 9) & (-13));
  }
  if ((r16($f0) & 256) !== 0) {
    U8[c] = U8[$f0 + 2];
  }
  if ((r16($f0) & 512) !== 0) {
    w16(c + 1, ri16($f0 + 3));
  }
  S.sp = $sp;
}
