// Generated from src/effhndlr.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as C_NPC from './c_npc';
import * as C_TERR from './c_terr';
import * as C_SAVE from './c_save';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CbtActs from './cbtacts';
import * as ClassCal from './classcal';
import * as FxEngine from './fxengine';
import * as Debug from './debug';
import * as C_EFFECT from './c_effect';
import * as C_EQUIP from './c_equip';
import * as C_RACE from './c_race';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_ALIGN from './c_align';
import * as C_SPELL from './c_spell';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as Pathing from './pathing';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as AbilAdj from './abiladj';
import * as C_LEVEL from './c_level';
import * as Dice from './dice';
import * as Stats from './stats';
import * as ChgClass from './chgclass';
import * as Bestiary from './bestiary';
import * as C_BEAST from './c_beast';
import * as C_SPRITE from './c_sprite';
import * as CharExt from './charext';

export const ANIMAL_TYPES = rt.setR(11, 11, 14, 15);
export const OTHERWORLDLY_TYPE = 7;
export const PETRIFY_GAZE_RANGE = 3;

export const $at = { mundaneCheck: 247720 };

export function EffBless(creature: number, p: number, removed: boolean) {
  U8[144908] = U8[144908] + 5;
  U8[144906] = I8[144906] + 1;
}

export function EffCurse(creature: number, p: number, removed: boolean) {
  if (U8[144908] < 5) {
    U8[144908] = 0;
  } else {
    U8[144908] = U8[144908] - 5;
  }
  U8[144906] = I8[144906] - 1;
}

export function EffUndeadSlayer(creature: number, p: number, removed: boolean) {
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  if (U8[r32(144909) + 159] === 4) {
    U8[144906] = I8[144906] + 2;
    U8[144897] = U8[144897] + 2;
  }
}

export async function EffTrainStart(creature: number, p: number, removed: boolean) {
  (await CharDisp.PrintNameString(creature, "starts to train", 10, true));
  FxEngine.AddEffect(creature, 7, 43200, 255, true);
}

export function EffFlameTongue(creature: number, p: number, removed: boolean) {
  let bonus: number = 0;
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  switch (U8[r32(144909) + 159]) {
    case 10: {
      bonus = 1;
      break;
    }
    case 9: case 12: {
      bonus = 2;
      break;
    }
    case 4: {
      bonus = 3;
      break;
    }
    default: {
      bonus = 0;
    }
  }
  U8[144906] = I8[144906] + bonus;
  U8[144897] = U8[144897] + bonus;
  U8[144898] = 9;
}

export async function EffTrainManual(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let hpGain: number = 0;
  (await CharDisp.PrintNameString(creature, "is hardier", 10, true));
  U8[creature + 20] = AbilAdj.ClampScore(U8[creature + 20] + 1);
  if ((U8[creature + 20] >= 20) && !CharHlp.HasEffect(creature, 62, $f0)) {
    FxEngine.AddEffect(creature, 62, AbilAdj.ConRegenMinutes(U8[creature + 20]), 255, true);
  }
  hpGain = (ClassCal.ConHpTotal(creature, U8[creature + 20]) - ClassCal.ConHpTotal(creature, U8[creature + 20] - 1)) << 16 >> 16;
  if (hpGain > (255 - U8[creature + 50])) {
    hpGain = 255 - U8[creature + 50];
  }
  if (hpGain > 0) {
    U8[creature + 50] = U8[creature + 50] + hpGain;
    U8[creature + 283] = U8[creature + 283] + hpGain;
  }
  S.sp = $sp;
}

export function EffProtEvil(creature: number, p: number, removed: boolean) {
  Protection(creature, rt.inS(C_ALIGN.EVIL_ALIGNMENTS, U8[r32(143749) + 160]));
}

export function EffProtGood(creature: number, p: number, removed: boolean) {
  let $t1;
  Protection(creature, ($t1 = U8[r32(143749) + 160], $t1 === 0 || $t1 === 3 || $t1 === 6));
}

export function EffResistCold(creature: number, p: number, removed: boolean) {
  ResistElement(2);
}

export function EffCharm(creature: number, p: number, removed: boolean) {
  if (removed) {
    U8[creature + 270] = Math.trunc((U8[p + 3] & 64) / 64);
    if (U8[creature + 132] === 179) {
      U8[creature + 132] = 0;
    }
  } else {
    if ((U8[p + 3] & 32) === 0) {
      U8[p + 3] = (U8[p + 3] + 32) + rt.mul(CharHlp.Team(creature), 64);
      U8[creature + 270] = Math.trunc(U8[p + 3] / 128);
      U8[creature + 271] = 1;
      if (!CharHlp.IsNpc(creature)) {
        U8[creature + 132] = 179;
      }
      w32(r32(creature + 264) + 10, 0);
      CharHlp.CountTeams();
    }
    U8[144908] = 100;
  }
}

export function EffExtraStr(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let bestBase: number = 0, bestExc: number = 0, q: number = 0, best: number = 0, restored: number = 0, loss: number = 0;
  if (U8[p + 3] > 127) {
    { S.sp = $sp; return; }
  }
  loss = CharHlp.DiseaseStrLoss(creature) & 255;
  AbilAdj.StrengthEffectToStrength(p, $f0, $f0 + 1);
  restored = AbilAdj.StrengthModifier(AbilAdj.ClampScore(U8[$f0]), U8[$f0 + 1]) & 255;
  U8[creature + 16] = AbilAdj.ClampScore(U8[$f0] - loss);
  U8[creature + 22] = U8[$f0 + 1];
  best = 0;
  bestBase = 0;
  bestExc = 0;
  q = r32(creature + 127);
  while (q !== 0) {
    if ((U8[q] === 12) || (U8[q] === 38)) {
      if (q !== p) {
        AbilAdj.StrengthEffectToStrength(q, $f0, $f0 + 1);
        if ((U8[$f0] > bestBase) || ((U8[$f0] === bestBase) && (U8[$f0 + 1] > bestExc))) {
          bestBase = U8[$f0];
          bestExc = U8[$f0 + 1];
          best = q;
        }
      }
    }
    q = r32(q + 5);
  }
  if (best !== 0) {
    U8[best + 3] = restored;
    U8[creature + 16] = AbilAdj.ClampScore(bestBase - loss);
    U8[creature + 22] = bestExc;
  }
  S.sp = $sp;
}

export function EffFriends(creature: number, p: number, removed: boolean) {
  if (p !== 0) {
    U8[creature + 21] = FxEngine.FriendsEndCha(U8[creature + 21], U8[p + 3]);
  }
}

export async function EffSlowPoisonHit(creature: number, p: number, removed: boolean) {
  if (AddEffectIfNoLock(creature, 15, U8[p + 3], 10)) {
    if ((await TickDamage(creature, 32))) {
    }
  }
}

export function EffShield(creature: number, p: number, removed: boolean) {
  if (U8[creature + 273] < 57) {
    U8[creature + 273] = 57;
  }
  w16(240560, ri16(240560) + 1);
  if (rt.inS(C_SPELL.MAGIC_MISSILES, U8[144900])) {
    U8[144897] = 0;
  }
}

export function EffGnomeHitBonus(creature: number, p: number, removed: boolean) {
  RacialFoeBonus(creature, 247721, 5);
}

export function EffResistFire(creature: number, p: number, removed: boolean) {
  ResistElement(1);
}

export async function EffSilence(creature: number, p: number, removed: boolean) {
  if (U8[r32(creature + 264) + 2] !== 0) {
    (await CharDisp.PrintNameString(creature, "is silenced", 10, true));
  }
  U8[r32(creature + 264) + 2] = 0;
  U8[r32(creature + 264) + 1] = 0;
}

export async function EffSlowPoisonEnd(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (CharHlp.HasEffect(creature, 55, $f0)) {
    (await InflictStatusMsg(creature, 6, "dies from poison"));
  }
  U8[144903] = 1;
  (await FxEngine.RemoveEffect(creature, 15, 0));
  U8[144903] = 0;
  S.sp = $sp;
}

export async function EffSpiritualHammer(creature: number, p: number, removed: boolean) {
  let item: number = 0, found: number = 0;
  item = r32(creature + 200);
  found = 0;
  while ((item !== 0) && (found === 0)) {
    if ((U8[item + 46] === 20) && (U8[item + 49] === 243)) {
      found = 1;
    } else {
      item = r32(item + 42);
    }
  }
  if (removed && (item !== 0)) {
    (await CharHlp.RemoveItem(creature, item));
  }
  if (!removed) {
    if (found === 0) {
      if (U8[creature + 199] < 16) {
        item = rt.getMem(64);
        rt.fill(item, 64, 0);
        U8[item + 46] = 20;
        U8[item + 48] = 20;
        U8[item + 49] = 243;
        U8[item + 50] = 1;
        U8[item + 61] = 23;
        U8[item + 62] = 137;
        CharHlp.AppendItemCopy(creature + 200, item);
        rt.freeMem(item);
        (await CharDisp.PrintNameString(creature, "Gains an item", 10, true));
      }
    }
  }
  CharHlp.RecalcStats(creature);
}

export function EffInvisible(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (!CharHlp.HasEffect(r32(143749), 24, $f0)) {
    U8[247481] = 1;
  } else {
    Bestiary.Learn(r32(143749), creature, 52);
  }
  U8[144906] = I8[144906] - 4;
  S.sp = $sp;
}

export function EffDwarfHitBonus(creature: number, p: number, removed: boolean) {
  RacialFoeBonus(creature, 247801, 11);
}

export async function EffMirrorImage(creature: number, p: number, removed: boolean) {
  if (FxEngine.ImageStruck(p)) {
    if (U8[144900] > 0) {
      if (U8[144904] === 0) {
        NullifyAttack(0);
        (await FxEngine.LoseImage(creature, p));
      }
    }
  }
}

export function EffEnfeeble(creature: number, p: number, removed: boolean) {
  U8[144897] = U8[144897] - Math.trunc(U8[144897] / 4);
}

export async function EffCoughing(creature: number, p: number, removed: boolean) {
  if (U8[r32(creature + 264) + 2] !== 0) {
    (await CharDisp.PrintNameString(creature, "is coughing", 10, true));
  }
  U8[r32(creature + 264) + 2] = 0;
  U8[r32(creature + 264) + 1] = 0;
  CharHlp.RecalcStats(creature);
  if (U8[creature + 274] > 52) {
    U8[creature + 274] = U8[creature + 274] - 2;
  } else {
    U8[creature + 274] = 50;
  }
  U8[creature + 273] = U8[creature + 274];
  if (creature === r32(143749)) {
    (await CharDisp.CombatPrintCreatureInfo(creature));
  }
}

export async function EffAnimateDead(creature: number, p: number, removed: boolean) {
  let side: number = 0;
  U8[p + 4] = false ? 1 : 0;
  side = Math.trunc(U8[p + 3] / 16) & 1;
  if (U8[144903] === 0) {
    (await InflictStatusMsg(creature, 6, "collapses"));
  }
  U8[creature + 270] = side;
  U8[creature + 271] = 1;
  U8[creature + 118] = 0;
  U8[creature + 107] = CharHlp.WarriorLevel(creature);
  U8[creature + 114] = 12;
  if (U8[creature + 132] === 179) {
    U8[creature + 132] = 0;
  }
  U8[creature + 159] = 0;
}

export function EffBlind(creature: number, p: number, removed: boolean) {
  U8[144906] = I8[144906] - 4;
  U8[creature + 273] = U8[creature + 273] - 4;
  U8[creature + 274] = U8[creature + 274] - 4;
  w16(240560, ri16(240560) - 4);
}

export async function EffDiseased(creature: number, p: number, removed: boolean) {
  (await FxEngine.CallEffectHandler(43, creature, p, removed));
  (await FxEngine.CallEffectHandler(44, creature, p, removed));
}

export function EffAlliedPrayer(creature: number, p: number, removed: boolean) {
  w16(240560, ri16(240560) + 1);
  U8[144906] = I8[144906] + 1;
}

export function EffBestowCurse(creature: number, p: number, removed: boolean) {
  U8[144906] = I8[144906] - 4;
  w16(240560, ri16(240560) - 4);
}

export function EffBlinking(creature: number, p: number, removed: boolean) {
  if (I8[r32(creature + 264) + 3] > 0) {
    U8[247481] = 1;
    U8[144907] = true ? 1 : 0;
    Bestiary.Learn(creature, r32(143749), 42);
  }
}

export async function EffHasted(creature: number, p: number, removed: boolean) {
  if ((U8[p + 3] & 16) === 0) {
    U8[p + 3] = U8[p + 3] + 16;
    (await CharDisp.PrintNameString(creature, "ages", 10, true));
    w16(creature + 48, r16(creature + 48) + 1);
  }
  U8[144899] = CharHlp.HasteSlowRate(creature, U8[144899]);
}

export async function EffCastCloud(creature: number, p: number, removed: boolean) {
  let node: number = 0, cloudNum: number = 0;
  cloudNum = Math.trunc(U8[p + 3] / 16);
  node = r32(146453);
  while ((node !== 0) && !((r32(node) === creature) && (U8[node + 28] === cloudNum))) {
    node = r32(node + 4);
  }
  if (node === 0) {
    return;
  }
  (await CharDisp.PrintBottomLine("The air clears a little..."));
  CbtMap.LiftCloud(node);
}

export async function EffProtNormalMissiles(creature: number, p: number, removed: boolean) {
  let missile: number = 0;
  missile = FindDamagingWeapon(r32(143749));
  if (missile !== 0) {
    if (I8[missile + 50] === 0) {
      (await AvoidRanged(creature, 100, 255));
    } else if (CbtMap.CalcDistance(r32(143749), creature) > 1) {
      Dice.ReduceDamagePerDie(1);
    }
  }
}

export function EffSlowed(creature: number, p: number, removed: boolean) {
  U8[144899] = CharHlp.HasteSlowRate(creature, U8[144899]);
}

export async function EffDiseaseStrength(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let loss: number = 0, level: number = 0, weaken: boolean = false;
  if (U8[p] === 43) {
    loss = U8[p + 3] >>> 4;
    level = U8[p + 3] & 15;
  } else {
    loss = 0;
    level = U8[p + 3];
    if (level > 15) {
      level = 15;
    }
  }
  weaken = (U8[creature + 16] > 3) && (loss < 15);
  if (AddEffectIfNoLock(creature, 43, ((loss + (weaken ? 1 : 0)) * 16) + level, 60)) {
    if (weaken) {
      (await CharDisp.PrintNameString(creature, "is weakened", 10, true));
      U8[creature + 16] = U8[creature + 16] - 1;
      CharHlp.RecalcStats(creature);
    } else if (U8[creature + 16] <= 3) {
      if (!CharHlp.HasEffect(creature, 31, $f0)) {
        FxEngine.AddEffect(creature, 31, 0, 255, false);
      }
    }
  } else if ((removed && (U8[p] === 43)) && (loss > 0)) {
    U8[creature + 16] = AbilAdj.ClampScore(U8[creature + 16] + loss);
    CharHlp.RecalcStats(creature);
  }
  S.sp = $sp;
}

export async function EffDiseaseHitPoints(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (AddEffectIfNoLock(creature, 44, U8[p + 3], 10)) {
    if (!(await TickDamage(creature, 64))) {
      if (!CharHlp.HasEffect(creature, 31, $f0)) {
        FxEngine.AddEffect(creature, 31, 0, 255, false);
      }
    }
  }
  S.sp = $sp;
}

export function EffDwarfGiantDefense(creature: number, p: number, removed: boolean) {
  let $t1;
  if (($t1 = U8[r32(143749) + 159], $t1 === 0 || $t1 === 1 || $t1 === 2 || $t1 === 10)) {
    let $t2;
    if (($t2 = U8[r32(143749) + 108] & 127, $t2 === 1 || $t2 === 2)) {
      if (NamedIn(r32(143749), 247977, 6)) {
        U8[144906] = I8[144906] - 4;
      }
    }
  }
}

export function EffGnomeBugDefense(creature: number, p: number, removed: boolean) {
  if (U8[r32(143749) + 159] === 1) {
    if ((rS(r32(143749)) === "BUGBEAR") || (rS(r32(143749)) === "GNOLL")) {
      U8[144906] = I8[144906] - 4;
    }
  }
}

export function EffPrayer(creature: number, p: number, removed: boolean) {
  if (CharHlp.Team(creature) === FxEngine.PrayerSide(p)) {
    EffAlliedPrayer(creature, p, removed);
  } else {
    U8[144906] = I8[144906] - 1;
    w16(240560, ri16(240560) - 1);
  }
}

export async function EffRotNoHeal(creature: number, p: number, removed: boolean) {
  if (AddEffectIfNoLock(creature, 50, U8[p + 3], 14400)) {
    if ((await FxEngine.RestoreHitPoints(creature, 1, true))) {
      (await CharDisp.PrintHpRestoreMsg(creature));
    }
  }
}

export function EffHelpless(creature: number, p: number, removed: boolean) {
  if (CharHlp.EndActions(creature)) {
  }
}

export function EffRingInvis(creature: number, p: number, removed: boolean) {
  FxEngine.AddEffect(creature, 25, 1, 12, false);
}

export async function EffMummyRot(creature: number, p: number, removed: boolean) {
  if (U8[144903] !== 0) {
    return;
  }
  (await CharDisp.PrintNameString(creature, "Rots...", 10, true));
  U8[creature + 21] = AbilAdj.ClampScore(U8[creature + 21] - 2);
  if (Math.trunc(U8[p + 3] / 16) > 1) {
    U8[p + 3] = U8[p + 3] - 16;
    if (AddEffectIfNoLock(creature, 57, U8[p + 3], 43200)) {
    }
  } else {
    (await InflictStatusMsg(creature, 8, "Dies rots away"));
  }
}

export function EffImmobile(creature: number, p: number, removed: boolean) {
  U8[r32(creature + 264) + 6] = 0;
  if (U8[144902] !== 0) {
    U8[144899] = 0;
  }
}

export function EffTrollRegen(creature: number, p: number, removed: boolean) {
  FxEngine.AddEffect(creature, 98, 0, 255, false);
}

export function EffRingFireRes(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 1) !== 0) {
    NoteFireResisted(creature);
    Dice.ReduceDamagePerDie(2);
    w16(240560, ri16(240560) + 4);
    if ((U8[144898] & 8) === 0) {
      NullifyAttack(0);
    }
  }
}

export async function EffConRegeneration(creature: number, p: number, removed: boolean) {
  let minutes: number = 0;
  minutes = AbilAdj.ConRegenMinutes(U8[creature + 20]) & 65535;
  if (minutes === 0) {
    minutes = 60;
  }
  if (AddEffectIfNoLock(creature, 62, U8[p + 3], minutes)) {
    if ((await FxEngine.RestoreHitPoints(creature, 1, true))) {
      (await CharDisp.PrintHpRestoreMsg(creature));
    }
  }
}

export async function EffPoisonHit0(creature: number, p: number, removed: boolean) {
  (await PoisonTouch(creature, 0));
}

export async function EffPoisonHit4(creature: number, p: number, removed: boolean) {
  (await PoisonTouch(creature, 4));
}

export async function EffPoisonHit2(creature: number, p: number, removed: boolean) {
  (await PoisonTouch(creature, 2));
}

export async function EffKreenPara(creature: number, p: number, removed: boolean) {
  (await ParalysisTouch(creature, Dice.RollDice(2, 8), 0));
}

export async function EffGhoulPara(creature: number, p: number, removed: boolean) {
  if (AttackTarget(creature) === 0) {
    return;
  }
  if (I8[AttackTarget(creature) + 46] !== 2) {
    (await ParalysisTouch(creature, 63, 0));
  }
}

export async function EffDriderPara(creature: number, p: number, removed: boolean) {
  (await ParalysisTouch(creature, Dice.RollDice(1, 9) + 10, -2));
}

export async function EffPoisonHitM2(creature: number, p: number, removed: boolean) {
  (await PoisonTouch(creature, -2));
}

export function EffDustOfDisappearance(creature: number, p: number, removed: boolean) {
  U8[247481] = 1;
  U8[144906] = I8[144906] - 4;
}

export function EffCamouflage(creature: number, p: number, removed: boolean) {
  if (Dice.RollDice(1, 100) <= 95) {
    FxEngine.AddEffect(creature, 25, 1, 12, false);
    Bestiary.Learn(creature, 0, 53);
  }
}

export async function EffBloodDrain(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let dmg: number = 0;
  if ((await FxEngine.HoldTarget(creature, p, removed, 75, $f0)) === 0) {
    if ((U8[$f0] !== 0) && (U8[creature + 269] !== 0)) {
      if (U8[r32(144909) + 269] !== 0) {
        U8[r32(creature + 264) + 16] = 1;
      }
    }
  } else {
    (await CharDisp.PrintNameString(creature, "Sucks some Blood", 10, true));
    dmg = Dice.RollDamageDice(1, 4) & 255;
    U8[144898] = 128;
    (await FxEngine.InflictNonWeaponDamage(r32(144909), dmg, 0, false));
    if (CharHlp.EndActions(creature)) {
    }
    if ((U8[r32(144909) + 269] !== 0) && (Math.trunc(r16(p + 1) / 16) > dmg)) {
      w16(p + 1, r16(p + 1) - (dmg * 16));
    } else {
      (await FxEngine.RemoveEffect(creature, 75, p));
    }
  }
  S.sp = $sp;
}

export async function EffBloodAttach(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  if (!HoldSlot(creature, $f0)) {
    { S.sp = $sp; return; }
  }
  FxEngine.AddEffect(creature, 75, 207, U8[$f0], true);
  (await Immobilize(r32(144909)));
  Bestiary.Learn(creature, r32(144909), 47);
  S.sp = $sp;
}

export async function EffBiteHold(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  if (!HoldSlot(creature, $f0)) {
    { S.sp = $sp; return; }
  }
  if (U8[r32(144909) + 16] < 19) {
    FxEngine.AddEffect(creature, 74, 0, U8[$f0], true);
    (await Immobilize(r32(144909)));
    (await CharDisp.PrintNameString(r32(144909), "is held fast", 10, true));
    Bestiary.Learn(creature, r32(144909), 56);
  }
  S.sp = $sp;
}

export async function EffHealWake(creature: number, p: number, removed: boolean) {
  let strength: number = 0;
  if (p === 0) {
    strength = 0;
  } else {
    strength = U8[p + 3];
  }
  if (!(await FxEngine.ReviveDeadCreature(creature, U8[creature + 283]))) {
    if (AddEffectIfNoLock(creature, 78, strength, 1)) {
    }
  }
}

export async function EffFireTouch(creature: number, p: number, removed: boolean) {
  U8[144898] = 9;
  if (AttackTarget(creature) !== 0) {
    Bestiary.Learn(creature, AttackTarget(creature), 38);
    (await FxEngine.InflictNonWeaponDamage(AttackTarget(creature), Dice.RollDamageDice(2, 10), 0, false));
  }
}

export async function EffAcidSquirt(creature: number, p: number, removed: boolean) {
  U8[144898] = 16;
  if (AttackTarget(creature) !== 0) {
    Bestiary.Learn(creature, AttackTarget(creature), 48);
    (await FxEngine.InflictNonWeaponDamage(AttackTarget(creature), Dice.RollDamageDice(1, 4), 0, false));
  }
}

export async function EffDragonFear(creature: number, p: number, removed: boolean) {
  let q: number = 0, saved: boolean = false;
  Bestiary.Learn(creature, 0, 46);
  q = r32(143753);
  while (q !== 0) {
    if (U8[q + 269] !== 0) {
      if (CharHlp.Team(q) !== CharHlp.Team(creature)) {
        saved = (await FxEngine.RollSavingThrow(q, 4, 0));
        switch (I8[q + 115]) {
          case 0: case 1: case 2: case 3: {
            (await FxEngine.AddEffectWithMessage(q, 52, 0, 12, false, true, saved, "is paralyzed with fear"));
            break;
          }
          case 4: case 5: {
            (await FxEngine.AddEffectWithMessage(q, 2, 0, 12, false, true, saved, "is weakened by fear"));
            break;
          }
        }
      }
    }
    q = r32(q + 260);
  }
}

export async function EffMummyFear(creature: number, p: number, removed: boolean) {
  let q: number = 0, bonus: number = 0, saved: boolean = false;
  Bestiary.Learn(creature, 0, 46);
  q = r32(143753);
  while (q !== 0) {
    (await FxEngine.RemoveEffect(q, 82, 0));
    if (U8[q + 269] !== 0) {
      if (CharHlp.Team(q) !== CharHlp.Team(creature)) {
        bonus = 0;
        if (U8[CharHlp.Team(q) + 144894] >= 6) {
          bonus = (bonus + 1) & 255;
        }
        if (I8[q + 46] === 7) {
          bonus = (bonus + 2) & 255;
        }
        saved = (await FxEngine.RollSavingThrow(q, 0, bonus));
        (await FxEngine.AddEffectWithMessage(q, 52, Dice.RollDice(1, 4), 12, false, true, saved, "is paralyzed with fear"));
      }
    }
    q = r32(q + 260);
  }
}

export async function EffPetrifyGaze(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let item: number = 0, reflected: boolean = false;
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    { S.sp = $sp; return; }
  }
  if (!PetrifyGazeReaches(creature, r32(144909))) {
    { S.sp = $sp; return; }
  }
  Bestiary.Learn(creature, r32(144909), 36);
  (await CharDisp.PrintNameString(creature, "gazes...", 10, false));
  (await CharDisp.AnimateBetween(creature, r32(144909), 18, 4, 45));
  if (CharHlp.HasEffect(creature, 127, $f0)) {
    reflected = false;
    item = r32(r32(144909) + 200);
    while ((item !== 0) && !reflected) {
      if ((U8[item + 52] !== 0) && IsMirror(item)) {
        (await CharDisp.PrintNameString(r32(144909), "reflects it!", 12, false));
        (await CharDisp.AnimateBetween(r32(144909), creature, 18, 4, 45));
        reflected = true;
        w32(144909, creature);
      }
      item = r32(item + 42);
    }
  }
  if (SilverShielded(r32(144909))) {
    (await CharDisp.PrintNameString(r32(144909), "is shielded from it!", 12, false));
    { S.sp = $sp; return; }
  }
  if (!(await FxEngine.RollSavingThrow(r32(144909), 1, 0))) {
    (await InflictStatusMsg(r32(144909), 7, "is Stoned"));
  }
  S.sp = $sp;
}

export async function EffCharmGaze(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let target: number = 0;
  target = AttackTarget(creature);
  w32(144909, target);
  if (target === 0) {
    { S.sp = $sp; return; }
  }
  if (!(await CbtActs.CanTarget(creature, target, true))) {
    { S.sp = $sp; return; }
  }
  if (!InSight(creature, target, U8[136668])) {
    { S.sp = $sp; return; }
  }
  (await CharDisp.PrintNameString(creature, "Gazes...", 10, false));
  Bestiary.Learn(creature, target, 37);
  (await CharDisp.AnimateBetween(creature, target, 18, 4, 45));
  (await FxEngine.AddEffectWithMessage(target, 11, 0, rt.mul(CharHlp.Team(creature), 128) + 12, true, true, (await FxEngine.RollSavingThrow(target, 4, -2)), "is charmed"));
  if (CharHlp.HasEffect(target, 11, $f0)) {
    (await FxEngine.CallEffectHandler(11, target, r32($f0), false));
  }
  S.sp = $sp;
}

export async function DrainLevels(creature: number, levels: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let xpMin: number = 0, cls: number = 0, j: number = 0, i: number = 0, totalLevels: number = 0, hpPerLevel: number = 0, k: number = 0, dual: boolean = false, top_: number = 0, xpBefore: number = 0, lowered: number = 0, lost: number = 0;
  function ClassToDrain() {
    let xpTry: number = 0, jj: number = 0, bestLvl: number = 0, lvl: number = 0, $r1: number = 0;
    xpMin = 0;
    bestLvl = 0;
    for (let $i1 = 0; $i1 <= 7; $i1++) {
      jj = $i1;
      lvl = I8[creature + jj + 150];
      if ((U8[creature + 285] & (1 << jj)) !== 0) {
        lvl = -1;
      }
      if (lvl > 9) {
        xpTry = ClassCal.LevelXp(jj, 9) | 0;
      } else {
        xpTry = ClassCal.LevelXp(jj, lvl) | 0;
      }
      if ((lvl >= bestLvl) && (lvl >= 0)) {
        if ((xpTry >= xpMin) || (xpTry === (-1))) {
          xpMin = xpTry;
          $r1 = jj;
          bestLvl = lvl;
        }
      }
    }
    return $r1;
  }
  if (levels > 1) {
    wS($f0, 40, StrUtil.NumStr(levels) + " levels");
  } else {
    wS($f0, 40, "a level");
  }
  (await CharDisp.PrintNameString(creature, "is drained " + rS($f0), 10, true));
  if (U8[creature + 268] === 1) {
    (await InflictStatusMsg(creature, 8, "is dead forever"));
    U8[creature + 50] = 0;
    { S.sp = $sp; return; }
  }
  for (let $i2 = 1, $e2 = levels; $i2 <= $e2; $i2++) {
    i = $i2;
    if (U8[creature + 268] !== 8) {
      U8[creature + 116] = U8[creature + 116] + 1;
      totalLevels = 0;
      dual = CharHlp.IsDualClass(creature);
      for (let $i3 = 0; $i3 <= 7; $i3++) {
        j = $i3;
        if (dual) {
          totalLevels = (totalLevels + ClassCal.HitDice(creature, j)) & 255;
        } else {
          totalLevels = (totalLevels + I8[creature + j + 150]) & 255;
        }
      }
      if (totalLevels === 0) {
        (await InflictStatusMsg(creature, 8, "is dead forever"));
        U8[creature + 50] = 0;
        { S.sp = $sp; return; }
      }
      hpPerLevel = Math.trunc(U8[creature + 50] / totalLevels) & 255;
      if (dual && (ClassCal.HitDice(creature, I8[creature + 47]) === 0)) {
        hpPerLevel = 0;
      }
      if (U8[141207] !== 0) {
        (await Debug.PrintHpDebug("max,cur,lost", U8[creature + 50], U8[creature + 283], U8[creature + 117]));
      }
      xpBefore = ri32(creature + 172);
      lowered = -1;
      for (let $i4 = 1, $e4 = hpPerLevel; $i4 <= $e4; $i4++) {
        k = $i4;
        if (U8[creature + 50] > 0) {
          U8[creature + 50] = U8[creature + 50] - 1;
        }
        if (U8[creature + 177] > 0) {
          U8[creature + 177] = U8[creature + 177] - 1;
        }
        if (U8[creature + 283] > 0) {
          U8[creature + 283] = U8[creature + 283] - 1;
        }
        U8[creature + 117] = U8[creature + 117] + 1;
      }
      cls = ClassToDrain() << 24 >> 24;
      if (dual) {
        top_ = I8[creature + cls + 150];
      } else {
        top_ = I8[creature + 115];
      }
      if (top_ < 2) {
        (await InflictStatusMsg(creature, 8, "is dead forever"));
        U8[creature + 50] = 0;
        if (levels === 2) {
          U8[creature + cls + 150] = 0;
        }
      } else {
        let $t5;
        $t5 = creature + cls + 150, U8[$t5] = I8[$t5] - 1;
        lowered = cls;
        if (U8[creature + 283] === 0) {
          if (U8[creature + 268] !== 6) {
            (await InflictStatusMsg(creature, 6, "is killed"));
          }
        }
        ClassCal.RecalcBaseSkills(creature);
        ClassCal.FitSpellsToLevel(creature);
      }
      cls = ClassToDrain() << 24 >> 24;
      U8[creature + 115] = I8[creature + cls + 150];
      if (dual) {
        for (let $i6 = 0; $i6 <= 7; $i6++) {
          j = $i6;
          if (I8[creature + j + 150] > I8[creature + 115]) {
            U8[creature + 115] = I8[creature + j + 150];
          }
        }
      }
      w32(creature + 172, xpMin);
      if (lowered >= 0) {
        lost = (xpBefore - ri32(creature + 172)) | 0;
        if (lost < 0) {
          lost = 0;
        }
        CharExt.PushDrain(creature, lost, hpPerLevel, lowered);
      }
      CharHlp.RecalcStats(creature);
      if (dual) {
        (await ChgClass.SyncClassPowers(creature));
      }
    }
  }
  S.sp = $sp;
}

export async function EffDrainOne(creature: number, p: number, removed: boolean) {
  (await DrainTouch(creature, 1));
}

export async function EffDrainTwo(creature: number, p: number, removed: boolean) {
  (await DrainTouch(creature, 2));
}

export async function EffRotTouch(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    { S.sp = $sp; return; }
  }
  Bestiary.Learn(creature, r32(144909), 35);
  if (FxEngine.DiseaseImmune(r32(144909), 50)) {
    { S.sp = $sp; return; }
  }
  if (!CharHlp.HasEffect(r32(144909), 50, $f0)) {
    FxEngine.AddEffect(r32(144909), 50, 14400, 255, true);
    FxEngine.AddEffect(r32(144909), 57, 43200, rt.mul(Dice.RollDice(1, 6), 16) + 15, true);
    (await CharDisp.PrintNameString(r32(144909), "is Diseased", 10, true));
  }
  S.sp = $sp;
}

export function EffDisplaced(creature: number, p: number, removed: boolean) {
  if ((U8[p + 3] & 16) === 0) {
    U8[144907] = true ? 1 : 0;
    U8[p + 3] = U8[p + 3] | 16;
    Bestiary.Learn(creature, r32(143749), 43);
  }
}

export function ResetDisplacement(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (CharHlp.HasEffect(creature, 89, $f0)) {
    U8[r32($f0) + 3] = U8[r32($f0) + 3] & (-17);
  }
  S.sp = $sp;
}

export function EffConPsnSave(creature: number, p: number, removed: boolean) {
  if (U8[240562] === 0) {
    w16(240560, ri16(240560) + AbilAdj.ConSaveBonus(U8[creature + 20]));
  }
}

export async function EffImmuneMM(creature: number, p: number, removed: boolean) {
  if (rt.inS(C_SPELL.MAGIC_MISSILES, U8[144900])) {
    NullifyAttack(0);
    (await CharDisp.PrintNameString(creature, "is unaffected", 10, true));
    Bestiary.Learn(creature, r32(143749), 13);
  } else {
    ElementImmunity(creature, 4, 16);
  }
}

export function EffHalfFire(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 1) !== 0) {
    HalveDamage(creature, 7);
  }
}

export function EffHalfBash(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if (w !== 0) {
    if ((U8[CharHlp.BaseItem(U8[w + 46]) + 7] & 128) !== 0) {
      HalveDamage(creature, 3);
    } else if ((U8[CharHlp.BaseItem(U8[w + 46]) + 7] & 1) !== 0) {
      HalveDamage(creature, 4);
    }
  }
}

export async function EffFightOn(creature: number, p: number, removed: boolean) {
  U8[p + 4] = false ? 1 : 0;
  if (U8[creature + 269] !== 0) {
    (await InflictStatusMsg(creature, 6, "Falls dead"));
  }
}

export function EffNeedSilver(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if ((w === 0) || ((I8[w + 50] === 0) && (U8[w + 49] !== 177))) {
    NoHarmWithoutSilver(creature);
  }
}

export function EffConSpellSave(creature: number, p: number, removed: boolean) {
  if ((U8[240562] === 4) || (U8[240562] === 2)) {
    w16(240560, ri16(240560) + AbilAdj.ConSaveBonus(U8[creature + 20]));
  }
}

export function EffRegen3(creature: number, p: number, removed: boolean) {
  if (U8[creature + 283] < U8[creature + 50]) {
    Bestiary.Learn(creature, 0, 19);
  }
  if ((U8[creature + 283] + 3) > U8[creature + 50]) {
    U8[creature + 283] = U8[creature + 50];
  } else {
    U8[creature + 283] = U8[creature + 283] + 3;
  }
}

export async function EffCanFightOn(creature: number, p: number, removed: boolean) {
  let hp: number = 0;
  hp = 0;
  if (U8[creature + 268] === 5) {
    if (U8[r32(creature + 264) + 14] < 6) {
      hp = (6 - U8[r32(creature + 264) + 14]) & 255;
    }
  }
  if (U8[creature + 268] === 4) {
    hp = 6;
  }
  if (hp > 0) {
    if ((await FxEngine.ReviveDeadCreature(creature, hp))) {
      Bestiary.Learn(creature, 0, 44);
      FxEngine.AddEffect(creature, 95, Dice.RollDice(1, 4) + 1, 255, true);
      U8[p + 4] = false ? 1 : 0;
      (await FxEngine.RemoveEffect(creature, 99, p));
    }
  }
}

export function EffTrollBurn(creature: number, p: number, removed: boolean) {
  if (((U8[144898] & 1) === 0) && ((U8[144898] & 16) === 0)) {
    FxEngine.AddEffect(creature, 102, Dice.RollDice(3, 6), 255, true);
  }
}

export function EffTrollHeal(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (!CharHlp.HasEffect(creature, 98, $f0)) {
    if (!CharHlp.HasEffect(creature, 59, $f0)) {
      FxEngine.AddEffect(creature, 59, 3, 255, true);
    }
  }
  S.sp = $sp;
}

export async function EffTrollReturn(creature: number, p: number, removed: boolean) {
  if ((await FxEngine.ReviveDeadCreature(creature, U8[creature + 50]))) {
    Bestiary.Learn(creature, 0, 19);
  } else if (AddEffectIfNoLock(creature, 102, U8[p + 3], 1)) {
  }
}

export async function EffGaseous(creature: number, p: number, removed: boolean) {
  U8[p + 4] = false ? 1 : 0;
  Bestiary.Learn(creature, 0, 45);
  (await CbtMap.DisplayMapViewCentered(creature, 3, false));
  (await FxEngine.PutOutOfPlayWithStatus(creature, 3, "Turns gaseous and escapes"));
}

export async function EffKreenDodge(creature: number, p: number, removed: boolean) {
  (await AvoidRanged(creature, 60, 49));
}

export function EffMagicRes50(creature: number, p: number, removed: boolean) {
  MagicResistance(creature, 50);
}

export function EffMagicRes85(creature: number, p: number, removed: boolean) {
  MagicResistance(creature, 85);
}

export function EffElfResistance(creature: number, p: number, removed: boolean) {
  SleepCharmResist(90);
}

export function EffImmuneSleepCharm(creature: number, p: number, removed: boolean) {
  let effId: number = 0;
  effId = U8[144896];
  NullifyAttack(11);
  NullifyAttack(53);
  NoteImmunity(creature, effId);
}

export function EffImmuneParalysis(creature: number, p: number, removed: boolean) {
  let effId: number = 0;
  effId = U8[144896];
  NullifyAttack(52);
  NoteImmunity(creature, effId);
}

export function EffNoCold(creature: number, p: number, removed: boolean) {
  ElementImmunity(creature, 2, 14);
}

export function EffImmuneParalysisPoison(creature: number, p: number, removed: boolean) {
  let effId: number = 0;
  effId = U8[144896];
  NullifyAttack(55);
  NullifyAttack(52);
  NoteImmunity(creature, effId);
  if (U8[240562] === 0) {
    w16(240560, 100);
  }
}

export function EffImmuneFire(creature: number, p: number, removed: boolean) {
  ElementImmunity(creature, 1, 15);
}

export function EffEfreetiFire(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 1) !== 0) {
    NoteFireResisted(creature);
    Dice.ReduceDamagePerDie(1);
  }
}

export function EffHalfElectricity(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 4) !== 0) {
    HalveDamage(creature, 9);
  }
}

export function EffHalfPierce(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if (w !== 0) {
    if (U8[CharHlp.BaseItem(U8[w + 46]) + 7] === 0) {
      HalveDamage(creature, 5);
    } else if ((U8[CharHlp.BaseItem(U8[w + 46]) + 7] & 1) !== 0) {
      HalveDamage(creature, 4);
    }
  }
}

export function EffHalfMagical(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if (w !== 0) {
    if (I8[w + 50] > 0) {
      HalveDamage(creature, 6);
    }
  }
}

export function EffHolyWater(creature: number, p: number, removed: boolean) {
  let item: number = 0;
  item = r32(r32(143749) + 204);
  if (item !== 0) {
    if (U8[item + 46] === 85) {
      U8[144897] = Dice.RollDamageDice(1, 6) + 1;
    }
  }
}

export function EffHalfCold(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 2) !== 0) {
    HalveDamage(creature, 8);
  }
}

export function EffNeedMagic(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if ((w === 0) || (I8[w + 50] === 0)) {
    if ((I8[r32(143749) + 46] > 0) || (I8[r32(143749) + 115] < 4)) {
      if (U8[144897] > 0) {
        Bestiary.Learn(creature, r32(143749), 17);
      }
      U8[144897] = 0;
    }
  }
}

export async function EffDodgeBoulders(creature: number, p: number, removed: boolean) {
  let item: number = 0;
  item = r32(r32(143749) + 204);
  if (item !== 0) {
    if ((U8[item + 46] === 87) || (U8[item + 46] === 88)) {
      (await AvoidRanged(creature, 50, 50));
    }
  }
}

export async function EffAnhkhegAcid(creature: number, p: number, removed: boolean) {
  w32(144909, AttackTarget(creature));
  if ((r32(144909) === 0) || (U8[r32(144909) + 269] === 0)) {
    return;
  }
  if (Dice.RollDice(1, 100) > 25) {
    return;
  }
  if (CbtMap.CalcDistance(creature, r32(144909)) >= 4) {
    return;
  }
  if (CharHlp.EndActions(creature)) {
  }
  (await CharDisp.PrintNameString(creature, "Spits Acid", 10, true));
  Bestiary.Learn(creature, r32(144909), 48);
  (await CharDisp.AnimateBetween(creature, r32(144909), 23, 1, 30));
  U8[144898] = 16;
  (await FxEngine.InflictNonWeaponDamage(r32(144909), Dice.RollDamageDice(8, 4), 2, (await FxEngine.RollSavingThrow(r32(144909), 3, 0))));
  (await FxEngine.RemoveEffect(creature, 121, p));
  (await FxEngine.RemoveEffect(creature, 80, 0));
}

export function EffMummyFire(creature: number, p: number, removed: boolean) {
  let item: number = 0;
  item = r32(r32(143749) + 204);
  if (item !== 0) {
    if (U8[item + 46] === 86) {
      U8[144897] = Dice.RollDamageDice(3, 8);
    }
  }
  if ((U8[144898] & 9) !== 0) {
    U8[144897] = U8[144897] + U8[144901];
  }
}

export function EffSilverMagic(creature: number, p: number, removed: boolean) {
  let w: number = 0;
  w = FindDamagingWeapon(r32(143749));
  if (w !== 0) {
    if ((I8[w + 50] === 0) && (U8[w + 49] === 177)) {
      HalveDamage(creature, 41);
    } else if (I8[w + 50] === 0) {
      NoHarmWithoutSilver(creature);
    }
  } else {
    NoHarmWithoutSilver(creature);
  }
}

export function EffHalfElfResistance(creature: number, p: number, removed: boolean) {
  SleepCharmResist(30);
}

export function EffNoCharmPoison(creature: number, p: number, removed: boolean) {
  let effId: number = 0;
  effId = U8[144896];
  NullifyAttack(11);
  NullifyAttack(53);
  NullifyAttack(52);
  NullifyAttack(55);
  NoteImmunity(creature, effId);
  if (U8[240562] === 0) {
    w16(240560, 100);
  }
}

export function EffGazeBlock(creature: number, p: number, removed: boolean) {
  let item: number = 0, j: number = 0;
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  item = r32(r32(144909) + 200);
  while ((item !== 0) && (U8[247481] === 0)) {
    if (U8[item + 52] !== 0) {
      if (IsMirror(item)) {
        U8[247481] = 1;
      }
      for (let $i2 = 1; $i2 <= 3; $i2++) {
        j = $i2;
        if ((U8[item + j + 46] === 152) && (U8[item + 49] === 252)) {
          U8[247481] = 1;
        }
      }
    }
    item = r32(item + 42);
  }
}

export async function EffReadyItem(creature: number, p: number, removed: boolean) {
  let item: number = 0, effect: number = 0;
  item = p;
  if (removed) {
    (await FxEngine.RemoveEffect(creature, U8[item + 61], 0));
  } else {
    FxEngine.AddEffect(creature, U8[item + 61], 0, 12, false);
    effect = r32(creature + 127);
    while (r32(effect + 5) !== 0) {
      effect = r32(effect + 5);
    }
    if (rt.inS(rt.setR(56, 56, 72, 72), U8[item + 61])) {
      (await FxEngine.CallEffectHandler(U8[item + 61], creature, effect, false));
    }
  }
}

export async function EffGauntlets(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let isOgre: boolean = false, found: boolean = false, q: number = 0, next: number = 0;
  if (removed) {
    found = false;
    q = r32(creature + 127);
    if (((U8[creature + 16] + CharHlp.DiseaseStrLoss(creature)) === 18) && (U8[creature + 22] === 100)) {
      isOgre = true;
    } else {
      isOgre = false;
    }
    while ((q !== 0) && (found === false)) {
      next = r32(q + 5);
      if (((U8[q] === 38) && isOgre) && (U8[q + 3] < 128)) {
        (await FxEngine.RemoveEffect(creature, 38, q));
        found = true;
      }
      q = next;
    }
  } else {
    if (FxEngine.AdjustForNewStrength(creature, 18, 100, $f0) && (creature === r32(143749))) {
      if (U8[141176] === 5) {
        U8[141176] = 2;
        (await CharDisp.PrintNameString(creature, "is stronger", 10, true));
        U8[141176] = 5;
      } else {
        (await CharDisp.PrintNameString(creature, "is stronger", 10, true));
      }
    }
    U8[144905] = 1;
    FxEngine.AddEffect(creature, 38, 0, U8[$f0], true);
  }
  S.sp = $sp;
}

export async function EffAlignedWeapon(creature: number, p: number, removed: boolean) {
  let item: number = 0, dmg: number = 0;
  item = p;
  if (removed) {
    return;
  }
  if ((U8[item + 61] & 15) !== U8[creature + 160]) {
    U8[item + 52] = 0;
    dmg = Math.trunc(U8[item + 61] / 16);
    U8[144898] = 8;
    if (U8[141176] === 5) {
      (await CharDisp.DisplayCombatInterface());
    }
    (await FxEngine.InflictItemShock(creature, item, dmg));
    U8[144905] = 1;
  }
}

export async function EffBoulder(creature: number, p: number, removed: boolean) {
  let item: number = 0;
  item = p;
  if (removed) {
    return;
  }
  if (U8[creature + 16] < 19) {
    U8[item + 52] = 0;
    (await CharDisp.PrintBottomLine("Must have Giant Strength"));
  }
}

export async function EffHammerGone(creature: number, p: number, removed: boolean) {
  if (removed) {
    (await FxEngine.RemoveEffect(creature, 23, 0));
  }
}

export function EffNone(creature: number, p: number, removed: boolean) {
}

export async function InflictStatusMsg(creature: number, status_: number, msg: string) {
  (await CharDisp.PrintNameString(creature, msg, 10, false));
  switch (U8[creature + 268]) {
    case 7: case 6: case 8: {
      return;
      break;
    }
  }
  U8[creature + 268] = status_;
  U8[creature + 269] = 0;
  U8[creature + 283] = 0;
  if (status_ === 6 || status_ === 8) {
    Stats.Death(creature);
  }
  (await FxEngine.RemoveEffectsHp0(creature));
  (await FxEngine.TriggerEffectsWithCondition(13, creature));
  if (U8[creature + 269] === 0) {
    (await CbtMap.CreatureDowned(creature));
  }
  (await TextRend.PauseOnly());
  (await CharDisp.ClearMessageWindow());
  (await CharDisp.RedrawPartyOutOfCombat());
}

export async function EffSticksToSnakes(creature: number, p: number, removed: boolean) {
  let attacks: number = 0;
  attacks = (U8[creature + 275] + U8[creature + 276]) & 255;
  if (U8[p + 3] > attacks) {
    U8[p + 3] = U8[p + 3] - attacks;
  } else {
    (await FxEngine.RemoveEffect(creature, 142, p));
  }
  (await CharDisp.PrintNameStringAnim(creature, true, "is fighting with snakes"));
  (await CharDisp.ClearMessageWindow());
  if (CharHlp.EndActions(creature)) {
  }
}

export function EffDispelEvil(creature: number, p: number, removed: boolean) {
  if (DispelEvilReaches(r32(143749))) {
    U8[144906] = I8[144906] - 7;
  }
}

export async function EffDispelEvilTouch(creature: number, p: number, removed: boolean) {
  let tgt: number = 0;
  tgt = AttackTarget(creature);
  if (tgt === 0) {
    return;
  }
  if (DispelEvilReaches(tgt) && !(await FxEngine.RollSavingThrow(tgt, 4, 0))) {
    (await InflictStatusMsg(tgt, 8, "is dispelled"));
    (await FxEngine.RemoveEffect(creature, 143, 0));
    (await FxEngine.RemoveEffect(creature, 144, 0));
  } else {
    (await CharDisp.PrintNameString(tgt, "resists dispel evil", 10, true));
  }
}

export function DispelEvilReaches(creature: number) {
  let $r0: boolean = false;
  $r0 = rt.inS(C_ALIGN.EVIL_ALIGNMENTS, U8[creature + 160]) && ((U8[creature + 159] === 4) || (U8[creature + 159] === 7));
  return $r0;
}

export function EffFaerieFire(creature: number, p: number, removed: boolean) {
  if (U8[creature + 273] >= 2) {
    U8[creature + 273] = U8[creature + 273] - 2;
  } else {
    U8[creature + 273] = 0;
  }
  if (U8[creature + 274] >= 2) {
    U8[creature + 274] = U8[creature + 274] - 2;
  } else {
    U8[creature + 274] = 0;
  }
}

export async function EffConfusion(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if ((r32(creature + 264) === 0) || (U8[r32(creature + 264)] !== 0)) {
    { S.sp = $sp; return; }
  }
  const $c1 = Dice.RollDice(1, 100);
  if (($c1 >= 1 && $c1 <= 10)) {
    (await FxEngine.AddEffectWithMessage(creature, 148, 10, 0, true, true, false, "runs away"));
    if (CharHlp.HasEffect(creature, 148, $f0)) {
      StartFear(creature);
      (await FxEngine.RemoveEffect(creature, 146, p));
      { S.sp = $sp; return; }
    }
  } else if (($c1 >= 11 && $c1 <= 60)) {
    (await CharDisp.PrintNameStringAnim(creature, true, "is confused"));
    (await CharDisp.ClearMessageWindow());
    if (CharHlp.EndActions(creature)) {
    }
  } else if (($c1 >= 61 && $c1 <= 80)) {
    (await FxEngine.AddEffectWithMessage(creature, 147, 1, I8[creature + 270] & 255, true, true, false, "goes berserk"));
    if (CharHlp.HasEffect(creature, 147, $f0)) {
      (await FxEngine.CallEffectHandler(147, creature, r32($f0), false));
    }
  } else {
    (await CharDisp.PrintNameStringAnim(creature, true, "is enraged"));
    (await CharDisp.ClearMessageWindow());
  }
  if ((await FxEngine.RollSavingThrow(creature, 4, -2))) {
    (await FxEngine.RemoveEffect(creature, 146, p));
  }
  S.sp = $sp;
}

export function EffConfusedBerserk(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 217);
  if (removed) {
    if (U8[creature + 132] === 179) {
      U8[creature + 132] = 0;
    }
    U8[creature + 270] = U8[p + 3] << 24 >> 24;
    CharHlp.CountTeams();
  } else if (U8[141176] === 5) {
    U8[creature + 271] = 1;
    if (!CharHlp.IsNpc(creature) || (U8[creature + 132] === 179)) {
      U8[creature + 132] = 179;
    } else {
      U8[creature + 132] = 178;
    }
    w32(r32(creature + 264) + 10, 0);
    Pathing.SaveTargets($f0);
    Pathing.BuildTargetList(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), 255, 255, CbtMap.GetIconSize(creature), r32(144641));
    if (U8[144645] >= 2) {
      w32(r32(creature + 264) + 10, r32(U8[144649] * 4 + 144292));
    }
    Pathing.RestoreTargets($f0);
    if (r32(r32(creature + 264) + 10) !== 0) {
      U8[creature + 270] = 1 - CharHlp.Team(r32(r32(creature + 264) + 10));
      CharHlp.CountTeams();
    }
  }
  S.sp = $sp;
}

export function StartFear(creature: number) {
  U8[r32(creature + 264) + 16] = 1;
  U8[creature + 271] = 1;
  if (!CharHlp.IsNpc(creature)) {
    U8[creature + 132] = 179;
  }
  w32(r32(creature + 264) + 10, 0);
}

export function EffFear(creature: number, p: number, removed: boolean) {
  if (removed) {
    if (U8[creature + 132] === 179) {
      U8[creature + 132] = 0;
      U8[creature + 271] = 0;
    }
    if (r32(creature + 264) !== 0) {
      U8[r32(creature + 264) + 16] = 0;
    }
  }
}

export function EffFireShieldHot(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 2) !== 0) {
    w16(240560, ri16(240560) + 2);
  }
}

export function EffFireShieldCold(creature: number, p: number, removed: boolean) {
  if ((U8[144898] & 1) !== 0) {
    w16(240560, ri16(240560) + 2);
  }
}

export async function EffFireShieldZap(creature: number, p: number, removed: boolean) {
  let dmg: number = 0, elem: number = 0, attacker: number = 0;
  attacker = r32(143749);
  if (((attacker === 0) || (attacker === creature)) || (U8[144897] === 0)) {
    return;
  }
  if (CbtMap.CalcDistance(attacker, creature) < 2) {
    dmg = U8[144897];
    elem = U8[144898];
    (await CharDisp.PrintNameString(attacker, "gets zapped", 10, true));
    U8[144898] = 8;
    if (dmg > 127) {
      (await FxEngine.InflictNonWeaponDamage(attacker, 255, 0, false));
    } else {
      (await FxEngine.InflictNonWeaponDamage(attacker, dmg * 2, 0, false));
    }
    U8[144897] = dmg;
    U8[144898] = elem;
  }
}

export function EffMinorGlobe(creature: number, p: number, removed: boolean) {
  if (CharHlp.IsSpell(U8[144900])) {
    if (U8[U8[144900] * 16 + 136507] <= 3) {
      NullifyAttack(0);
    }
  }
}

export async function EffFeeblemind(creature: number, p: number, removed: boolean) {
  if ((U8[141176] === 5) && (r32(creature + 264) !== 0)) {
    U8[r32(creature + 264) + 1] = 0;
    if (U8[r32(creature + 264)] > 0) {
      (await CharDisp.PrintNameString(creature, "lost a spell", 12, true));
      CharHlp.RemoveSpell(creature, U8[r32(creature + 264)]);
      U8[r32(creature + 264)] = 0;
    }
  }
}

export function EffInvisibleToAnimals(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (rt.inS(ANIMAL_TYPES, U8[r32(143749) + 159])) {
    if (!CharHlp.HasEffect(r32(143749), 24, $f0)) {
      U8[247481] = 1;
    }
    U8[144906] = I8[144906] - 4;
  }
  S.sp = $sp;
}

export function EffEntangle(creature: number, p: number, removed: boolean) {
  if (U8[144902] !== 0) {
    if (U8[p + 3] === 0) {
      U8[144899] = 0;
    } else {
      U8[144899] = Math.trunc(U8[144899] / 2);
    }
  }
}

export async function TouchImmune(target: number, effId: number) {
  let immune: boolean = false, $r0: boolean = false;
  U8[247720] = true ? 1 : 0;
  immune = (await FxEngine.EffectImmune(target, effId));
  U8[247720] = false ? 1 : 0;
  if (immune) {
    (await CharDisp.PrintNameString(target, "is Unaffected", 10, true));
  }
  $r0 = immune;
  return $r0;
}

export function InSight(gazer: number, target: number, range: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = false;
  if (target === 0) {
    { S.sp = $sp; return $r0; }
  }
  if (CbtMap.CombatSlot(target) === 0) {
    { S.sp = $sp; return $r0; }
  }
  w16($f0, range);
  U8[$f0 + 2] = CbtMap.CombatCellX(target);
  U8[$f0 + 3] = CbtMap.CombatCellY(target);
  $r0 = Pathing.WalkLine(CbtMap.CombatCellX(gazer), CbtMap.CombatCellY(gazer), $f0 + 2, $f0 + 3, $f0, r32(144641));
  S.sp = $sp;
  return $r0;
}

export function PetrifyGazeReaches(gazer: number, target: number) {
  let $r0: boolean = false;
  $r0 = ((target !== 0) && (U8[target + 269] !== 0)) && InSight(gazer, target, 3);
  return $r0;
}

export function SilverShielded(creature: number) {
  let shield: number = 0, $r0: boolean = false;
  shield = r32(creature + 208);
  $r0 = (shield !== 0) && HasName(shield, 177);
  return $r0;
}

export function AttackTarget(creature: number) {
  let $r0: number = 0;
  $r0 = 0;
  if (r32(creature + 264) !== 0) {
    $r0 = r32(r32(creature + 264) + 10);
  }
  return $r0;
}

export function NullifyAttack(effId: number) {
  if ((effId === 0) || (U8[144896] === effId)) {
    U8[144897] = 0;
    U8[144896] = 0;
  }
}

export function ImmunityFact(effId: number) {
  let $r0: number = 0;
  switch (effId) {
    case 53: case 11: {
      $r0 = 12;
      break;
    }
    case 52: {
      $r0 = 11;
      break;
    }
    case 55: {
      $r0 = 10;
      break;
    }
    default: {
      $r0 = 255;
    }
  }
  return $r0;
}

export function NoteNullified(creature: number, effId: number, dmg: number, fact: number) {
  if (((effId !== 0) && (U8[144896] === 0)) || ((dmg !== 0) && (U8[144897] === 0))) {
    Bestiary.Learn(creature, r32(143749), fact);
  }
}

export function NoteImmunity(creature: number, effId: number) {
  NoteNullified(creature, effId, 0, ImmunityFact(effId));
}

export function HalveDamage(creature: number, fact: number) {
  if (U8[144897] > 0) {
    Bestiary.Learn(creature, r32(143749), fact);
  }
  U8[144897] = Math.trunc(U8[144897] / 2);
}

export function NoteFireResisted(creature: number) {
  if (U8[144897] > 0) {
    Bestiary.Learn(creature, r32(143749), 51);
  }
}

export function NoHarmWithoutSilver(creature: number) {
  if (U8[144897] > 0) {
    Bestiary.Learn(creature, r32(143749), 40);
  }
  U8[144897] = 0;
}

export function AddEffectIfNoLock(creature: number, effId: number, strength: number, minutes: number) {
  let $r0: boolean = false;
  if (U8[144903] !== 0) {
    $r0 = false;
  } else {
    $r0 = true;
    FxEngine.AddEffect(creature, effId, minutes, strength, true);
  }
  return $r0;
}

export async function TickDamage(creature: number, source: number) {
  let $r0: boolean = false;
  $r0 = U8[creature + 283] > 1;
  if (U8[creature + 283] > 1) {
    U8[144898] = source;
    (await FxEngine.InflictNonWeaponDamage(creature, 1, 0, false));
    (await CharDisp.RedrawPartyOutOfCombat());
  }
  return $r0;
}

export function ResistElement(elem: number) {
  if ((U8[144898] & elem) !== 0) {
    U8[144897] = Math.trunc(U8[144897] / 2);
    w16(240560, ri16(240560) + 3);
  }
}

export function ElementImmunity(creature: number, elem: number, fact: number) {
  let effId: number = 0, dmg: number = 0;
  effId = U8[144896];
  dmg = U8[144897];
  if ((U8[144898] & elem) !== 0) {
    NullifyAttack(0);
    NoteNullified(creature, effId, dmg, fact);
  }
}

export function SleepCharmResist(pct: number) {
  if (Dice.RollDice(1, 100) <= pct) {
    NullifyAttack(53);
    NullifyAttack(11);
  }
}

export function NamedIn(creature: number, names: number, count: number) {
  let i: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  for (let $i1 = 1, $e1 = count; $i1 <= $e1; $i1++) {
    i = $i1;
    if (rS(creature) === rS(names + i * 16 - 16)) {
      found = true;
    }
  }
  $r0 = found;
  return $r0;
}

export function RacialFoeBonus(creature: number, names: number, count: number) {
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  if (U8[r32(144909) + 159] <= 1) {
    if (U8[r32(144909) + 108] === 1) {
      if (NamedIn(r32(144909), names, count)) {
        U8[144906] = I8[144906] + 1;
      }
    }
  }
}

export function HasName(item: number, name_: number) {
  let $r0: boolean = false;
  $r0 = ((U8[item + 47] === name_) || (U8[item + 48] === name_)) || (U8[item + 49] === name_);
  return $r0;
}

export function IsMirror(item: number) {
  let $r0: boolean = false;
  $r0 = HasName(item, 118);
  return $r0;
}

export function HoldSlot(creature: number, slot: number) {
  let $r0: boolean = false;
  $r0 = false;
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return $r0;
  }
  U8[slot] = CbtMap.CombatSlot(r32(144909));
  $r0 = U8[slot] !== 0;
  return $r0;
}

export async function Immobilize(victim: number) {
  FxEngine.AddEffect(victim, 58, 0, 255, false);
  (await FxEngine.CallEffectHandler(58, victim, 0, false));
}

export function Protection(creature: number, foe: boolean) {
  if (foe && (CharHlp.Team(r32(143749)) !== CharHlp.Team(creature))) {
    w16(240560, ri16(240560) + 2);
    U8[144906] = I8[144906] - 2;
  }
}

export async function AvoidRanged(creature: number, pct: number, fact: number) {
  let phase: number = 0;
  if (r32(r32(143749) + 204) !== 0) {
    if (CbtMap.CalcDistance(r32(143749), creature) > 1) {
      if (Dice.RollDice(1, 100) <= pct) {
        (await CharDisp.PrintNameString(creature, "Avoids it", 10, true));
        Bestiary.Learn(creature, r32(143749), fact);
        U8[144897] = 0;
        U8[144907] = true ? 1 : 0;
        phase = U8[r32(r32(143749) + 264) + 4];
        if ((phase >= 1) && (phase <= 2)) {
          if (U8[phase + 247513] > 0) {
            U8[phase + 247513] = U8[phase + 247513] - 1;
          }
        }
      }
    }
  }
}

export function FindDamagingWeapon(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let ok: boolean = false, $r0: number = 0;
  w32($f0, 0);
  if (r32(creature + 204) !== 0) {
    ok = CharHlp.FindDamagingRangedWeapon(creature, $f0);
    if ((ok === false) || (r32($f0) === 0)) {
      w32($f0, r32(creature + 204));
    }
  }
  $r0 = r32($f0);
  S.sp = $sp;
  return $r0;
}

export async function PoisonTouch(creature: number, saveMod: number) {
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  Bestiary.Learn(creature, r32(144909), 32);
  if (!(await FxEngine.RollSavingThrow(r32(144909), 0, saveMod + AbilAdj.ConPoisonSave(U8[r32(144909) + 20])))) {
    if (!(await TouchImmune(r32(144909), 55))) {
      (await CharDisp.PrintNameString(r32(144909), "is Poisoned", 10, false));
      (await TextRend.PauseOnly());
      FxEngine.AddEffect(r32(144909), 55, 0, 255, false);
      (await InflictStatusMsg(r32(144909), 6, "is killed"));
    }
  }
}

export async function ParalysisTouch(creature: number, minutes: number, saveMod: number) {
  w32(144909, AttackTarget(creature));
  if (r32(144909) === 0) {
    return;
  }
  Bestiary.Learn(creature, r32(144909), 33);
  if (!(await FxEngine.RollSavingThrow(r32(144909), 0, saveMod))) {
    if (!(await TouchImmune(r32(144909), 52))) {
      (await CharDisp.PrintNameStringAnim(r32(144909), true, "is Paralyzed"));
      FxEngine.AddEffect(r32(144909), 52, minutes, 12, false);
    }
  }
}

export async function DrainTouch(creature: number, levels: number) {
  if (AttackTarget(creature) === 0) {
    return;
  }
  Bestiary.Learn(creature, AttackTarget(creature), 34);
  (await DrainLevels(AttackTarget(creature), levels));
}

export function MagicResistance(creature: number, pct: number) {
  let lvl: number = 0, chance: number = 0;
  if (U8[144900] === 0) {
    lvl = 11;
  } else {
    lvl = CharHlp.GetCasterLevel(U8[144900]) & 255;
    if ((U8[146457] !== 0) && (lvl > 6)) {
      lvl = 6;
    }
  }
  chance = pct + ((11 - lvl) * 5);
  if (chance < 0) {
    chance = 0;
  } else if (chance > 100) {
    chance = 100;
  }
  if ((U8[144896] === 0) && ((U8[144898] & 8) === 0)) {
    return;
  }
  if ((U8[247720] !== 0)) {
    return;
  }
  if (Dice.RollDice(1, 100) <= chance) {
    NullifyAttack(0);
    Bestiary.Learn(creature, r32(143749), 18);
  }
}
