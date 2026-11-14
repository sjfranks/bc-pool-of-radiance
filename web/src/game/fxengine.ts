// Generated from src/fxengine.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Stats from './stats';
import * as StrUtil from './strutil';
import * as AbilAdj from './abiladj';
import * as C_GBVM from './c_gbvm';
import * as CharDisp from './chardisp';
import * as C_TIME from './c_time';
import * as Dice from './dice';
import * as Clock from './clock';
import * as C_TERR from './c_terr';
import * as C_SAVE from './c_save';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as TextRend from './textrend';
import * as CharHlp from './charhlp';
import * as Pathing from './pathing';
import * as CbtMap from './cbtmap';
import * as C_EFFECT from './c_effect';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_DIR from './c_dir';
import * as C_LEVEL from './c_level';
import * as Crt from './crt';
import * as C_ITEM from './c_item';
import * as C_EQUIP from './c_equip';
import * as C_SPELL from './c_spell';

export const ANY_SIDE = 255;

export const $at = { effFlags: 240488, saveRoll: 240560, saveType: 240562, seenElements: 240563 };

export async function CallEffectHandler(effId: number, creature: number, p: number, removed: boolean) {
  if ((effId >= 1) && (effId <= 157)) {
    (await rt.FT[r32(effId * 4 + 144909)](creature, p, removed));
  }
}

export async function RemoveEffect(creature: number, effId: number, eff: number) {
  let prev: number = 0, p: number = 0;
  p = eff;
  if (p === 0) {
    p = r32(creature + 127);
    while ((p !== 0) && (U8[p] !== effId)) {
      p = r32(p + 5);
    }
  } else if (!HasEffectNode(creature, p)) {
    p = 0;
  }
  if (p === 0) {
    return;
  }
  if ((U8[p + 4] !== 0)) {
    (await CallEffectHandler(effId, creature, p, true));
    if (!HasEffectNode(creature, p)) {
      return;
    }
  }
  if (r32(creature + 127) === p) {
    w32(creature + 127, r32(p + 5));
  } else {
    prev = r32(creature + 127);
    while ((prev !== 0) && (r32(prev + 5) !== p)) {
      prev = r32(prev + 5);
    }
    if (prev === 0) {
      return;
    }
    w32(prev + 5, r32(p + 5));
  }
  rt.freeMem(p);
}

export function HasEffectNode(creature: number, eff: number) {
  let p: number = 0, $r0: boolean = false;
  p = r32(creature + 127);
  while ((p !== 0) && (p !== eff)) {
    p = r32(p + 5);
  }
  $r0 = p !== 0;
  return $r0;
}

export function HasDisease(creature: number) {
  let p: number = 0, $r0: boolean = false;
  p = r32(creature + 127);
  while ((p !== 0) && !rt.inS(C_EFFECT.DISEASES, U8[p])) {
    p = r32(p + 5);
  }
  $r0 = p !== 0;
  return $r0;
}

export async function RemoveDiseases(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let cured: boolean = false, $r0: boolean = false;
  U8[144903] = 1;
  cured = (await RemoveAll(creature, 34));
  if ((await RemoveAll(creature, 43))) {
    cured = true;
    if (CharHlp.HasEffect(creature, 31, $f0)) {
      (await RemoveEffect(creature, 31, r32($f0)));
    }
  }
  if ((await RemoveAll(creature, 44))) {
    cured = true;
  }
  if ((await RemoveAll(creature, 50))) {
    cured = true;
  }
  if ((await RemoveAll(creature, 57))) {
    cured = true;
  }
  U8[144903] = 0;
  $r0 = cured;
  S.sp = $sp;
  return $r0;
}

export function FriendsEndCha(cha: number, strength: number) {
  let $r0: number = 0;
  if ((strength & 128) !== 0) {
    $r0 = AbilAdj.ClampScore(cha - (strength & (-129))) & 255;
  } else {
    $r0 = AbilAdj.ClampScore(strength) & 255;
  }
  return $r0;
}

export async function TriggerEffectsWithCondition(cond: number, creature: number) {
  switch (cond) {
    case 0: {
      (await TriggerEffect(creature, 126));
      break;
    }
    case 1: {
      (await TriggerEffect(creature, 63));
      (await TriggerEffect(creature, 37));
      (await TriggerEffect(creature, 25));
      (await TriggerEffect(creature, 71));
      (await TriggerEffect(creature, 155));
      break;
    }
    case 2: {
      (await TriggerEffect(creature, 85));
      (await TriggerEffect(creature, 86));
      (await TriggerEffect(creature, 87));
      (await TriggerEffect(creature, 68));
      (await TriggerEffect(creature, 79));
      (await TriggerEffect(creature, 80));
      (await TriggerEffect(creature, 76));
      (await TriggerEffect(creature, 73));
      (await TriggerEffect(creature, 77));
      (await TriggerEffect(creature, 144));
      break;
    }
    case 3: {
      (await TriggerEffect(creature, 64));
      (await TriggerEffect(creature, 65));
      (await TriggerEffect(creature, 66));
      (await TriggerEffect(creature, 67));
      (await TriggerEffect(creature, 68));
      (await TriggerEffect(creature, 69));
      (await TriggerEffect(creature, 70));
      (await TriggerEffect(creature, 79));
      (await TriggerEffect(creature, 85));
      (await TriggerEffect(creature, 86));
      (await TriggerEffect(creature, 87));
      break;
    }
    case 4: {
      (await TriggerEffect(creature, 29));
      (await TriggerEffect(creature, 3));
      (await TriggerEffect(creature, 6));
      break;
    }
    case 5: {
      (await TriggerEffect(creature, 41));
      (await TriggerEffect(creature, 104));
      (await TriggerEffect(creature, 120));
      (await TriggerEffect(creature, 101));
      (await TriggerEffect(creature, 115));
      (await TriggerEffect(creature, 116));
      (await TriggerEffect(creature, 119));
      (await TriggerEffect(creature, 123));
      (await TriggerEffect(creature, 96));
      (await TriggerEffect(creature, 94));
      (await TriggerEffect(creature, 60));
      (await TriggerEffect(creature, 122));
      (await TriggerEffect(creature, 117));
      (await TriggerEffect(creature, 151));
      break;
    }
    case 6: {
      (await TriggerEffect(creature, 113));
      (await TriggerEffect(creature, 61));
      (await TriggerEffect(creature, 122));
      (await TriggerEffect(creature, 60));
      (await TriggerEffect(creature, 91));
      (await TriggerEffect(creature, 10));
      (await TriggerEffect(creature, 20));
      (await TriggerEffect(creature, 105));
      (await TriggerEffect(creature, 106));
      (await TriggerEffect(creature, 112));
      (await TriggerEffect(creature, 114));
      (await TriggerEffect(creature, 118));
      (await TriggerEffect(creature, 17));
      (await TriggerEffect(creature, 93));
      (await TriggerEffect(creature, 101));
      (await TriggerEffect(creature, 28));
      (await TriggerEffect(creature, 153));
      break;
    }
    case 7: {
      (await TriggerEffect(creature, 51));
      (await TriggerEffect(creature, 52));
      (await TriggerEffect(creature, 53));
      (await TriggerEffect(creature, 31));
      (await TriggerEffect(creature, 142));
      (await TriggerEffect(creature, 152));
      break;
    }
    case 8: {
      (await TriggerEffect(creature, 99));
      (await TriggerEffect(creature, 81));
      (await TriggerEffect(creature, 82));
      (await TriggerEffect(creature, 72));
      (await TriggerEffect(creature, 56));
      break;
    }
    case 9: {
      (await TriggerEffect(creature, 105));
      (await TriggerEffect(creature, 106));
      (await TriggerEffect(creature, 107));
      (await TriggerEffect(creature, 108));
      (await TriggerEffect(creature, 109));
      (await TriggerEffect(creature, 110));
      (await TriggerEffect(creature, 111));
      (await TriggerEffect(creature, 112));
      (await TriggerEffect(creature, 124));
      (await TriggerEffect(creature, 125));
      (await TriggerEffect(creature, 153));
      break;
    }
    case 10: {
      (await TriggerEffect(creature, 1));
      (await TriggerEffect(creature, 2));
      (await TriggerEffect(creature, 33));
      (await TriggerEffect(creature, 36));
      (await TriggerPrayer(creature));
      (await TriggerEffect(creature, 3));
      (await TriggerEffect(creature, 6));
      (await TriggerEffect(creature, 18));
      (await TriggerEffect(creature, 26));
      break;
    }
    case 11: {
      (await TriggerEffect(creature, 30));
      (await TriggerEffect(creature, 33));
      (await TriggerEffect(creature, 17));
      (await TriggerEffect(creature, 145));
      break;
    }
    case 12: {
      (await TriggerProtection(creature, 8, 45));
      (await TriggerProtection(creature, 9, 46));
      (await TriggerEffect(creature, 10));
      (await TriggerEffect(creature, 17));
      (await TriggerEffect(creature, 20));
      (await TriggerEffect(creature, 33));
      (await TriggerEffect(creature, 36));
      (await TriggerPrayer(creature));
      (await TriggerEffect(creature, 61));
      (await TriggerEffect(creature, 111));
      (await TriggerEffect(creature, 125));
      (await TriggerEffect(creature, 90));
      (await TriggerEffect(creature, 97));
      (await TriggerEffect(creature, 149));
      (await TriggerEffect(creature, 150));
      break;
    }
    case 13: {
      (await TriggerEffect(creature, 99));
      (await TriggerEffect(creature, 100));
      (await TriggerEffect(creature, 103));
      (await TriggerEffect(creature, 75));
      (await TriggerEffect(creature, 74));
      break;
    }
    case 14: {
      (await TriggerEffect(creature, 83));
      (await TriggerEffect(creature, 84));
      (await TriggerEffect(creature, 88));
      (await TriggerEffect(creature, 121));
      break;
    }
    case 15: {
      (await TriggerEffect(creature, 21));
      (await TriggerEffect(creature, 30));
      (await TriggerEffect(creature, 74));
      (await TriggerEffect(creature, 75));
      (await TriggerEffect(creature, 11));
      (await TriggerEffect(creature, 154));
      (await TriggerEffect(creature, 146));
      break;
    }
    case 16: {
      (await TriggerProtection(creature, 8, 45));
      (await TriggerProtection(creature, 9, 46));
      (await TriggerEffect(creature, 25));
      (await TriggerEffect(creature, 71));
      (await TriggerEffect(creature, 37));
      (await TriggerEffect(creature, 47));
      (await TriggerEffect(creature, 48));
      (await TriggerEffect(creature, 89));
      (await TriggerEffect(creature, 155));
      (await TriggerEffect(creature, 143));
      break;
    }
    case 17: {
      (await TriggerEffect(creature, 1));
      (await TriggerEffect(creature, 2));
      (await TriggerEffect(creature, 11));
      break;
    }
    case 18: {
      (await TriggerEffect(creature, 39));
      (await TriggerEffect(creature, 42));
      (await TriggerEffect(creature, 58));
      (await TriggerEffect(creature, 156));
      break;
    }
    case 19: {
      (await TriggerEffect(creature, 98));
      (await TriggerEffect(creature, 23));
      (await TriggerEffect(creature, 72));
      (await TriggerEffect(creature, 56));
      (await TriggerEffect(creature, 11));
      break;
    }
  }
}

export function CloudProof(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = ((CharHlp.HasEffect(creature, 32, $f0) || CharHlp.HasEffect(creature, 30, $f0)) || CharHlp.HasEffect(creature, 111, $f0)) || CharHlp.HasEffect(creature, 125, $f0);
  S.sp = $sp;
  return $r0;
}

export function CloudSpares(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = ((U8[creature + 269] === 0) || CharHlp.HasEffect(creature, 31, $f0)) || CloudProof(creature);
  S.sp = $sp;
  return $r0;
}

export async function ConsiderStinkingCloud(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let saved: boolean = false;
  if (CloudSpares(creature)) {
    { S.sp = $sp; return; }
  }
  CbtMap.ProbeDirection(creature, 8, $f0 + 5, $f0 + 4);
  if (U8[$f0 + 4] !== 30) {
    { S.sp = $sp; return; }
  }
  saved = (await RollSavingThrow(creature, 0, AbilAdj.ConPoisonSave(U8[creature + 20])));
  if (saved) {
    (await CharDisp.PrintNameString(creature, "is Unaffected", 10, true));
  } else {
    (await AddEffectWithMessage(creature, 31, Dice.RollDice(1, 4) + 1, 255, false, false, saved, "chokes and gags from nausea"));
    if (CharHlp.HasEffect(creature, 31, $f0)) {
      (await CallEffectHandler(31, creature, r32($f0), false));
    }
  }
  S.sp = $sp;
}

export function CloudkillProof(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = (((I8[creature + 115] > 6) || CharHlp.HasEffect(creature, 32, $f0)) || CharHlp.HasEffect(creature, 111, $f0)) || CharHlp.HasEffect(creature, 125, $f0);
  S.sp = $sp;
  return $r0;
}

export function CloudkillFate(level: number, saveMod: number) {
  let $r0: number = 0;
  U8[saveMod] = 0;
  if (level <= 4) {
    $r0 = 0;
  } else if (level <= 6) {
    if (level === 5) {
      U8[saveMod] = -4;
    }
    $r0 = 1;
  } else {
    $r0 = 2;
  }
  return $r0;
}

export function FreeCloudNumber(caster: number) {
  let node: number = 0, n: number = 0, used: boolean = false, $r0: number = 0;
  n = 0;
  do {
    used = false;
    node = r32(146453);
    while (node !== 0) {
      if ((r32(node) === caster) && (U8[node + 28] === n)) {
        used = true;
      }
      node = r32(node + 4);
    }
    if (used) {
      n = (n + 1) & 255;
    }
  } while (!(!used || (n === 15)));
  $r0 = n;
  return $r0;
}

export function CloudStrength(level: number, num: number) {
  let $r0: number = 0;
  if (level > 15) {
    level = 15;
  }
  $r0 = (level + (num * 16)) & 255;
  return $r0;
}

export function PrayerStrength(caster: number, level: number) {
  let $r0: number = 0;
  if (level > 15) {
    level = 15;
  }
  $r0 = (rt.mul(CharHlp.Team(caster), 16) + level) & 255;
  return $r0;
}

export function PrayerSide(effect: number) {
  let $r0: number = 0;
  $r0 = Math.trunc((U8[effect + 3] & 16) / 16);
  return $r0;
}

export function SpendDisplacement(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (CharHlp.HasEffect(creature, 89, $f0)) {
    U8[r32($f0) + 3] = U8[r32($f0) + 3] | 16;
  }
  S.sp = $sp;
}

export async function AttackRollNoAttacker(defender: number, sixtyMinusThac0: number) {
  let $r0: boolean = false;
  $r0 = (await RollToHit(0, defender, sixtyMinusThac0, U8[defender + 273]));
  return $r0;
}

export async function AttackRoll(attacker: number, defender: number, sixtyMinusAc: number) {
  let $r0: boolean = false;
  (await RemoveInvisibility(attacker));
  $r0 = (await RollToHit(attacker, defender, HitBonus(attacker), sixtyMinusAc));
  return $r0;
}

export function HitBonus(attacker: number) {
  let zmod: number = 0, $r0: number = 0;
  if (I8[attacker + 270] === 0) {
    zmod = ((r16(r32(141151) + 1762) & 255) << 24 >> 24) << 24 >> 24;
  } else {
    zmod = ((r16(r32(141151) + 1760) & 255) << 24 >> 24) << 24 >> 24;
  }
  $r0 = U8[attacker + 272] + zmod;
  return $r0;
}

export async function RollSavingThrow(creature: number, saveType: number, modifier: number) {
  let $r0: boolean = false;
  if ((saveType < 0) || (saveType > 4)) {
    saveType = 4;
  }
  w16(240560, Dice.RollDice(1, 20));
  switch (ri16(240560)) {
    case 1: {
      $r0 = false;
      break;
    }
    case 20: {
      $r0 = true;
      break;
    }
    default: {
      w16(240560, (ri16(240560) + I8[creature + 257]) + modifier);
      U8[240562] = saveType;
      (await TriggerEffectsWithCondition(12, creature));
      if (U8[creature + saveType + 109] <= ri16(240560)) {
        $r0 = true;
      } else {
        $r0 = false;
      }
    }
  }
  return $r0;
}

export function AddEffect(creature: number, effId: number, minutes: number, strength: number, onRemove: boolean) {
  let p: number = 0, q: number = 0;
  if (effId === 55) {
    Stats.Count(creature, 7, 1);
  }
  p = rt.getMem(9);
  if (r32(creature + 127) === 0) {
    w32(creature + 127, p);
  } else {
    q = r32(creature + 127);
    while (r32(q + 5) !== 0) {
      q = r32(q + 5);
    }
    w32(q + 5, p);
  }
  w32(p + 5, 0);
  U8[p] = effId;
  w16(p + 1, minutes);
  U8[p + 4] = onRemove ? 1 : 0;
  U8[p + 3] = strength;
}

export async function PutOutOfPlayWithStatus(creature: number, status_: number, msg: string) {
  let slot: number = 0;
  if (U8[creature + 269] === 0) {
    return;
  }
  slot = CbtMap.CombatSlot(creature) & 255;
  (await CbtMap.DisplayMapViewCentered(creature, 3, false));
  (await CharDisp.PrintNameString(creature, msg, 10, true));
  U8[creature + 269] = 0;
  U8[creature + 268] = status_;
  if (U8[creature + 268] !== 3) {
    U8[creature + 283] = 0;
  }
  if (slot > 0) {
    (await CbtMap.UpdateCombatMapTile(0, 0, slot));
    (await Blit.FlushView());
    U8[slot * 4 + 144007] = 0;
  }
  CbtMap.BuildArenaArrays();
  if (CharHlp.EndActions(creature)) {
    (await RemoveEffectsHp0(creature));
  }
}

export async function RemoveInvisibility(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  while (CharHlp.HasEffect(creature, 25, $f0)) {
    (await RemoveEffect(creature, 25, r32($f0)));
  }
  S.sp = $sp;
}

export function ImageStruck(image: number) {
  let $r0: boolean = false;
  $r0 = Dice.RollDice(1, U8[image + 3] + 1) > 1;
  return $r0;
}

export async function LoseImage(creature: number, image: number) {
  (await CharDisp.PrintNameString(creature, "lost an image", 10, true));
  U8[image + 3] = U8[image + 3] - 1;
  if (U8[image + 3] === 0) {
    (await RemoveEffect(creature, 28, image));
  }
}

export async function RemoveEffectsHp0(creature: number) {
  let i: number = 0;
  for (let $i1 = 1; $i1 <= 16; $i1++) {
    i = $i1;
    (await RemoveEffect(creature, U8[i + 240634], 0));
  }
}

export async function RemoveAiEffects(creature: number) {
  let i: number = 0;
  for (let $i1 = 1; $i1 <= 2; $i1++) {
    i = $i1;
    (await RemoveEffect(creature, U8[i + 240650], 0));
  }
}

export async function RemoveEffectWithMessage(creature: number, effId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = false;
  if (CharHlp.HasEffect(creature, effId, $f0)) {
    (await CharDisp.PrintNameString(creature, "is Cured", 10, true));
    (await RemoveEffect(creature, effId, r32($f0)));
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export function AdjustForNewStrength(creature: number, baseStr: number, excStr: number, effStrength: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let p: number = 0, found: number = 0, enc: number = 0, loss: number = 0, $r0: boolean = false;
  loss = CharHlp.DiseaseStrLoss(creature) & 255;
  U8[$f0] = U8[creature + 16] + loss;
  U8[$f0 + 1] = U8[creature + 22];
  if ((baseStr < U8[$f0]) || ((baseStr === 18) && (excStr < U8[$f0 + 1]))) {
    $r0 = false;
    U8[effStrength] = AbilAdj.StrengthModifier(baseStr, excStr) + 128;
  } else {
    found = 0;
    p = r32(creature + 127);
    while ((p !== 0) && (found === 0)) {
      if (((U8[p] === 12) || (U8[p] === 38)) && (U8[p + 3] < 128)) {
        found = p;
      }
      p = r32(p + 5);
    }
    if (found !== 0) {
      enc = AbilAdj.StrengthModifier(U8[$f0], U8[$f0 + 1]) & 255;
      AbilAdj.StrengthEffectToStrength(found, $f0, $f0 + 1);
      U8[found + 3] = enc + 128;
    }
    U8[creature + 16] = AbilAdj.ClampScore(baseStr - loss);
    U8[creature + 22] = excStr;
    CharHlp.RecalcStats(creature);
    U8[effStrength] = AbilAdj.StrengthModifier(U8[$f0], U8[$f0 + 1]);
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export async function InflictNonWeaponDamage(creature: number, damage: number, saveReduction: number, saved: boolean) {
  (await NonWeaponDamage(creature, damage, saveReduction, saved, 0));
}

export function FireShieldDamage(creature: number, saved: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let own: number = 0, other: number = 0;
  own = 0;
  other = 0;
  if (CharHlp.HasEffect(creature, 149, $f0)) {
    own = 1;
    other = 2;
  } else if (CharHlp.HasEffect(creature, 150, $f0)) {
    own = 2;
    other = 1;
  }
  if ((U8[144898] & other) !== 0) {
    if (saved) {
      U8[144897] = 0;
    } else {
      U8[144897] = Math.trunc(U8[144897] / 2);
    }
  } else if (((U8[144898] & own) !== 0) && !saved) {
    if (U8[144897] > 127) {
      U8[144897] = 255;
    } else {
      U8[144897] = U8[144897] * 2;
    }
  }
  S.sp = $sp;
}

export async function InflictItemShock(creature: number, item: number, damage: number) {
  (await NonWeaponDamage(creature, damage, 0, false, item));
}

export function DiseaseImmune(creature: number, effId: number) {
  let $r0: boolean = false;
  $r0 = ((creature !== 0) && (CharHlp.GetClassLevel(creature, 8) > 0)) && rt.inS(C_EFFECT.DISEASES, effId);
  return $r0;
}

export async function EffectImmune(creature: number, effId: number) {
  let $r0: boolean = false;
  U8[144896] = effId;
  (await TriggerEffectsWithCondition(9, creature));
  $r0 = (U8[144896] === 0) || DiseaseImmune(creature, effId);
  U8[144896] = 0;
  return $r0;
}

export async function AddEffectWithMessage(creature: number, effId: number, minutes: number, strength: number, onRemove: boolean, saveNegates: boolean, saved: boolean, msg: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if ((await EffectImmune(creature, effId)) || (saved && saveNegates)) {
    (await CharDisp.PrintNameString(creature, "is Unaffected", 10, true));
  } else {
    if (CharHlp.HasEffect(creature, effId, $f0)) {
      if (((r16(r32($f0) + 1) > 0) && (minutes > r16(r32($f0) + 1))) || (minutes === 0)) {
        (await RemoveEffect(creature, effId, r32($f0)));
      }
    }
    AddEffect(creature, effId, minutes, strength, onRemove);
    if (msg.length !== 0) {
      (await CharDisp.PrintNameStringAnim(creature, true, msg));
      (await CharDisp.ClearMessageWindow());
    }
  }
  S.sp = $sp;
}

export async function RestoreHitPoints(creature: number, hp: number, bypassRot: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let hpBefore: number = 0, $r0: boolean = false;
  $r0 = false;
  let $t1;
  if (!($t1 = U8[creature + 268], $t1 === 0 || $t1 === 1 || $t1 === 4 || $t1 === 5)) {
    { S.sp = $sp; return $r0; }
  }
  if ((U8[creature + 283] >= U8[creature + 50]) || !bypassRot) {
    if (CharHlp.HasEffect(creature, 50, $f0)) {
      { S.sp = $sp; return $r0; }
    }
    if (bypassRot) {
      { S.sp = $sp; return $r0; }
    }
  }
  hpBefore = U8[creature + 283];
  if ((U8[creature + 283] + hp) > U8[creature + 50]) {
    U8[creature + 283] = U8[creature + 50];
  } else {
    U8[creature + 283] = U8[creature + 283] + hp;
  }
  Stats.Healed(r32(143749), creature, U8[creature + 283] - hpBefore, false);
  if (U8[creature + 269] === 0) {
    if (U8[creature + 268] === 5) {
      U8[creature + 268] = 4;
    }
    if ((U8[creature + 268] === 4) && (U8[141176] !== 5)) {
      (await CallEffectHandler(78, creature, 0, true));
    }
  }
  $r0 = true;
  S.sp = $sp;
  return $r0;
}

export async function ReviveDeadCreature(creature: number, hp: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: boolean = false;
  if (CbtMap.IsValidCreatureLoc(creature, CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), true)) {
    U8[creature + 268] = 0;
    U8[creature + 269] = 1;
    U8[creature + 283] = hp;
    if (U8[141176] === 5) {
      (await CbtMap.DisplayMapViewCentered(creature, 3, false));
    }
    if (I8[creature + 270] === 1) {
      wS($f0, 40, "stands up and grins");
    } else {
      wS($f0, 40, "gets back up");
    }
    (await CharDisp.PrintNameString(creature, rS($f0), 10, true));
    CharHlp.CountTeams();
    $r0 = true;
  } else {
    $r0 = false;
  }
  S.sp = $sp;
  return $r0;
}

export async function ToggleReadyItem(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let err: number = 0, creature: number = 0;
  creature = r32(143749);
  if (U8[item + 52] !== 0) {
    if (U8[item + 54] !== 0) {
      (await CharDisp.PrintBottomLine("It's Cursed"));
    } else {
      (await UnreadyItem(creature, item));
    }
  } else {
    err = ReadyCheck(creature, item, $f0) & 255;
    if (err === 0) {
      (await ReadyItem(creature, item));
    } else {
      (await SayReadyError(creature, err, I8[$f0]));
    }
  }
  S.sp = $sp;
}

export function ReadyCheck(creature: number, item: number, slot: number) {
  let err: number = 0, $r0: number = 0;
  err = 0;
  if ((U8[creature + 256] + U8[CharHlp.BaseItem(U8[item + 46]) + 1]) > 2) {
    err = 3;
  }
  U8[slot] = U8[CharHlp.BaseItem(U8[item + 46])];
  switch (I8[slot] & 255) {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: {
      if (r32(creature + I8[slot] * 4 + 204) !== 0) {
        err = 2;
      }
      break;
    }
    case 9: {
      if (r32(creature + 244) !== 0) {
        err = 2;
      }
      break;
    }
  }
  if (U8[item + 46] === 73) {
    if (r32(creature + 248) !== 0) {
      err = 2;
      U8[slot] = 11;
    }
  }
  if (U8[item + 46] === 28) {
    if (r32(creature + 252) !== 0) {
      err = 2;
      U8[slot] = 12;
    }
  }
  if ((U8[CharHlp.BaseItem(U8[item + 46]) + 13] & U8[creature + 176]) === 0) {
    err = 1;
  }
  $r0 = err;
  return $r0;
}

export async function ReadySet(creature: number, n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let item: number = 0, other: number = 0, any: boolean = false, err: number = 0, $r0: boolean = false;
  any = false;
  U8[$f0] = false ? 1 : 0;
  U8[$f0 + 1] = false ? 1 : 0;
  item = r32(creature + 200);
  while (item !== 0) {
    if (U8[item + 63] === n) {
      any = true;
    }
    item = r32(item + 42);
  }
  if (!any) {
    (await CharDisp.PrintBottomLine("No set " + String.fromCharCode((48 + n) & 255)));
  } else {
    CharHlp.RecalcStats(creature);
    other = r32(creature + 200);
    while (other !== 0) {
      if (((U8[other + 52] !== 0) && (U8[other + 63] !== 0)) && (U8[other + 63] !== n)) {
        (await PutAwayForSet(creature, other, $f0 + 1, $f0));
      }
      other = r32(other + 42);
    }
    item = r32(creature + 200);
    while (item !== 0) {
      if ((U8[item + 63] === n) && (U8[item + 52] === 0)) {
        other = r32(creature + 200);
        while (other !== 0) {
          if (((U8[other + 52] !== 0) && (U8[other + 63] !== n)) && InTheWay(item, other)) {
            (await PutAwayForSet(creature, other, $f0 + 1, $f0));
          }
          other = r32(other + 42);
        }
        other = r32(creature + 200);
        while (other !== 0) {
          if ((((U8[other + 52] !== 0) && (U8[other + 63] !== n)) && (U8[CharHlp.BaseItem(U8[other + 46]) + 1] > 0)) && ((U8[creature + 256] + U8[CharHlp.BaseItem(U8[item + 46]) + 1]) > 2)) {
            (await PutAwayForSet(creature, other, $f0 + 1, $f0));
          }
          other = r32(other + 42);
        }
        err = ReadyCheck(creature, item, $f0 + 2) & 255;
        if (err === 0) {
          (await ReadyItem(creature, item));
          CharHlp.RecalcStats(creature);
          U8[$f0] = true ? 1 : 0;
        } else if (!(U8[$f0 + 1] !== 0)) {
          (await SayReadyError(creature, err, I8[$f0 + 2]));
          U8[$f0 + 1] = true ? 1 : 0;
        }
      }
      item = r32(item + 42);
    }
  }
  $r0 = (U8[$f0] !== 0);
  S.sp = $sp;
  return $r0;
}

export async function UnreadyItem(creature: number, item: number) {
  U8[item + 52] = 0;
  if (U8[item + 62] > 127) {
    (await CallEffectHandler(U8[item + 62], creature, item, true));
  }
}

export async function AdvanceTime(amount: number, tUnit: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 14);
  let i: number = 0, j: number = 0;
  for (let $i1 = 0; $i1 <= 6; $i1++) {
    i = $i1;
    w16($f0 + i * 2, r16(r32(141147) + (18886 + i) * 2 - 37376));
  }
  for (let $i2 = 1, $e2 = amount; $i2 <= $e2; $i2++) {
    j = $i2;
    let $t3;
    $t3 = $f0 + tUnit * 2, w16($t3, r16($t3) + 1);
    Clock.ValidateClock($f0, true);
  }
  for (let $i4 = 0; $i4 <= 6; $i4++) {
    i = $i4;
    w16(r32(141147) + (18886 + i) * 2 - 37376, r16($f0 + i * 2));
  }
  (await TimeOutEffects(amount, tUnit));
  S.sp = $sp;
}

export async function HoldTarget(creature: number, p: number, removed: boolean, effId: number, released: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: number = 0;
  $r0 = 0;
  U8[released] = false ? 1 : 0;
  if (((U8[p + 3] === 0) || (U8[p + 3] > U8[144007])) || (U8[p + 3] > 72)) {
    if (!removed) {
      U8[p + 4] = false ? 1 : 0;
      (await RemoveEffect(creature, effId, p));
    }
    { S.sp = $sp; return $r0; }
  }
  w32(144909, r32(U8[p + 3] * 4 + 144292));
  if (((removed || (U8[creature + 269] === 0)) || (U8[r32(144909) + 269] === 0)) || !CharHlp.HasEffect(r32(144909), 58, $f0)) {
    (await RemoveEffect(r32(144909), 58, 0));
    if (!removed) {
      U8[p + 4] = false ? 1 : 0;
      (await RemoveEffect(creature, effId, p));
    }
    U8[released] = true ? 1 : 0;
  } else {
    $r0 = r32(144909);
  }
  S.sp = $sp;
  return $r0;
}

export function AuraRange(effId: number) {
  let $r0: number = 0;
  switch (effId) {
    case 49: {
      $r0 = 6;
      break;
    }
    case 21: case 45: case 46: {
      $r0 = 1;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function EffectSource(creature: number, effId: number, side: number, effect: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 217);
  let p: number = 0, found: boolean = false, i: number = 0, range: number = 0, slot: number = 0, $r0: boolean = false;
  function Carries(c: number) {
    let $r1: boolean = false;
    $r1 = CharHlp.HasEffect(c, effId, effect) && ((side === 255) || (PrayerSide(r32(effect)) === side));
    return $r1;
  }
  found = false;
  p = r32(143753);
  range = AuraRange(effId) & 255;
  if (Carries(creature)) {
    found = true;
  } else if (range > 0) {
    Pathing.SaveTargets($f0);
    slot = CbtMap.CombatSlot(creature) & 255;
    while ((p !== 0) && !found) {
      if ((Carries(p) && ((effId === 21) || (U8[p + 269] !== 0))) && ((effId === 21 || effId === 49) || (CharHlp.Team(p) === CharHlp.Team(creature)))) {
        if (U8[141176] === 5) {
          Pathing.BuildTargetList(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), range, 255, CbtMap.GetIconSize(p), r32(144641));
          for (let $i2 = 1, $e2 = U8[144645]; $i2 <= $e2; $i2++) {
            i = $i2;
            if (U8[i * 3 + 144643] === slot) {
              found = true;
            }
          }
        } else {
          found = true;
        }
      }
      p = r32(p + 260);
    }
    Pathing.RestoreTargets($f0);
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export async function TriggerEffect(creature: number, effId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (EffectSource(creature, effId, 255, $f0)) {
    (await CallEffectHandler(effId, creature, r32($f0), false));
  }
  S.sp = $sp;
}

export async function TriggerPrayer(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let side: number = 0;
  for (let $i1 = 0; $i1 <= 1; $i1++) {
    side = $i1;
    if (EffectSource(creature, 49, side, $f0)) {
      (await CallEffectHandler(49, creature, r32($f0), false));
    }
  }
  S.sp = $sp;
}

export async function TriggerProtection(creature: number, own: number, aura: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if (EffectSource(creature, own, 255, $f0) || EffectSource(creature, aura, 255, $f0)) {
    (await CallEffectHandler(U8[r32($f0)], creature, r32($f0), false));
  }
  S.sp = $sp;
}

export async function RollToHit(attacker: number, defender: number, toHit: number, sixtyMinusAc: number) {
  let $r0: boolean = false;
  $r0 = false;
  U8[144907] = false ? 1 : 0;
  U8[144906] = Dice.RollDice(1, 20);
  if (I8[144906] === 1) {
    SpendDisplacement(defender);
  } else {
    if (I8[144906] === 20) {
      U8[144906] = 100;
    }
    if (attacker !== 0) {
      (await TriggerEffectsWithCondition(10, attacker));
    }
    (await TriggerEffectsWithCondition(16, defender));
    if (!(U8[144907] !== 0) && ((I8[144906] + toHit) >= sixtyMinusAc)) {
      $r0 = true;
    }
  }
  return $r0;
}

export async function NonWeaponDamage(creature: number, damage: number, saveReduction: number, saved: boolean, shockItem: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 44);
  let slot: number = 0;
  let $t1;
  if (($t1 = U8[creature + 268], $t1 === 6 || $t1 === 7 || $t1 === 8)) {
    { S.sp = $sp; return; }
  }
  if ((U8[141176] === 5) && (r32(143749) !== 0)) {
    if (CharHlp.Team(r32(143749)) !== CharHlp.Team(creature)) {
      slot = CbtMap.CombatSlot(r32(143749)) & 255;
      if (slot > 0) {
        U8[slot + 240562] = U8[slot + 240562] | U8[144898];
      }
    }
  }
  U8[144897] = damage;
  (await TriggerEffectsWithCondition(6, creature));
  if (saved) {
    switch (saveReduction) {
      case 1: {
        U8[144897] = 0;
        break;
      }
      case 2: {
        U8[144897] = Math.trunc(U8[144897] / 2);
        break;
      }
    }
  }
  FireShieldDamage(creature, saved);
  if (U8[144897] > 0) {
    wS($f0, 43, "takes " + StrUtil.Count(U8[144897], "point", "points") + " of damage ");
    switch (U8[144898] & (-9)) {
      case 1: {
        wS($f0, 43, rS($f0) + "from Fire");
        break;
      }
      case 2: {
        wS($f0, 43, rS($f0) + "from Cold");
        break;
      }
      case 4: {
        wS($f0, 43, rS($f0) + "from Electricity");
        break;
      }
      case 16: {
        wS($f0, 43, rS($f0) + "from Acid");
        break;
      }
      case 32: {
        wS($f0, 43, rS($f0) + "from poison");
        break;
      }
      case 64: {
        wS($f0, 43, rS($f0) + "from disease");
        break;
      }
      case 128: {
        wS($f0, 43, rS($f0) + "from blood drain");
        break;
      }
    }
    if ((U8[144898] & 8) === U8[144898]) {
      wS($f0, 43, rS($f0) + "from Magic");
    }
    if (shockItem === 0) {
      (await CharDisp.PrintNameStringAnim(creature, false, rS($f0)));
    } else {
      CharHlp.ItemLabel(shockItem, false);
      (await CharDisp.MessageText(rS(shockItem), 10, true));
      (await CharDisp.MessageText("shocks ", 15, false));
      (await CharDisp.MessageText(rS(creature), 10, false));
      (await CharDisp.MessageText(" for " + StrUtil.NumStr(U8[144897]) + " damage, and has been unequipped.", 15, false));
      (await CharDisp.MessageWait());
    }
    CharHlp.InflictDamage(creature, U8[144897]);
    if (U8[141176] === 5) {
      U8[r32(creature + 264) + 1] = 0;
      if (U8[r32(creature + 264)] > 0) {
        (await CharDisp.PrintNameString(creature, "lost a spell", 12, true));
        CharHlp.RemoveSpell(creature, U8[r32(creature + 264)]);
        U8[r32(creature + 264)] = 0;
      }
    }
    if (U8[creature + 269] === 0) {
      wS($f0, 43, "Goes Down");
      if (U8[creature + 268] === 5) {
        wS($f0, 43, rS($f0) + ", and is Dying");
      }
      let $t2;
      if (($t2 = U8[creature + 268], $t2 === 6 || $t2 === 7 || $t2 === 8)) {
        wS($f0, 43, "is killed");
      }
      (await CharDisp.PrintNameString(creature, rS($f0), U8[143770] + 1, false));
      if (U8[141176] !== 5) {
        (await TextRend.PauseOnly());
      } else {
        (await RemoveEffectsHp0(creature));
        (await TriggerEffectsWithCondition(13, creature));
        if (U8[creature + 269] === 0) {
          (await CbtMap.CreatureDowned(creature));
        } else {
          (await TextRend.PauseOnly());
        }
      }
    }
    (await CharDisp.ClearMessageWindow());
  }
  S.sp = $sp;
}

export async function RemoveAll(creature: number, effId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let found: boolean = false, $r0: boolean = false;
  found = false;
  while (CharHlp.HasEffect(creature, effId, $f0)) {
    (await RemoveEffect(creature, effId, r32($f0)));
    found = true;
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export async function ReadyItem(creature: number, item: number) {
  U8[item + 52] = 1;
  if (U8[item + 62] > 127) {
    (await CallEffectHandler(U8[item + 62], creature, item, false));
  }
}

export async function SayReadyError(creature: number, err: number, slot: number) {
  switch (err) {
    case 1: {
      (await CharDisp.PrintBottomLine("Wrong Class"));
      break;
    }
    case 2: {
      CharHlp.ItemLabel(r32(creature + slot * 4 + 204), false);
      (await CharDisp.PrintBottomLine("already using " + rS(r32(creature + slot * 4 + 204))));
      break;
    }
    case 3: {
      if ((U8[141176] !== 5) || (U8[creature + 271] === 0)) {
        (await CharDisp.PrintBottomLine("Your hands are full!"));
      }
      break;
    }
  }
}

export function InTheWay(item: number, other: number) {
  let slot: number = 0, $r0: boolean = false;
  slot = U8[CharHlp.BaseItem(U8[item + 46])];
  $r0 = (((slot <= 8) && (U8[CharHlp.BaseItem(U8[other + 46])] === slot)) || ((U8[item + 46] === 73) && (U8[other + 46] === 73))) || ((U8[item + 46] === 28) && (U8[other + 46] === 28));
  return $r0;
}

export async function PutAwayForSet(creature: number, other: number, said: number, changed: number) {
  if (U8[other + 54] !== 0) {
    if (!(U8[said] !== 0)) {
      (await CharDisp.PrintBottomLine("It's Cursed"));
    }
    U8[said] = true ? 1 : 0;
  } else {
    (await UnreadyItem(creature, other));
    CharHlp.RecalcStats(creature);
    U8[changed] = true ? 1 : 0;
  }
}

export async function TimeOutEffects(count: number, tUnit: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 224);
  let u: number = 0, i: number = 0, k: number = 0, step: number = 0, total: number = 0, cur: number = 0, found: boolean = false, e: number = 0, nExpiring: number = 0, again: boolean = false;
  if (U8[141176] !== 2) {
    rt.fill(240488, 72, 1);
  } else {
    found = false;
    i = 1;
    do {
      if (U8[i + 240487] !== 0) {
        found = true;
      }
      i = (i + 1) & 255;
    } while (!(found || (i > r16(r32(141151) + 1660))));
    if (!found) {
      { S.sp = $sp; return; }
    }
  }
  total = count;
  u = tUnit;
  if (u === 0) {
    total = Math.trunc(total / r16(138570)) | 0;
  }
  while (u > 1) {
    total = (r16((u - 1) * 2 + 138570) * total) | 0;
    u = (u - 1) << 24 >> 24;
  }
  while (total > 0) {
    if (total > 10) {
      step = 10;
    } else {
      step = total & 255;
    }
    i = 1;
    cur = r32(143753);
    while (cur !== 0) {
      if ((i > 72) || (U8[i + 240487] !== 0)) {
        again = false;
        nExpiring = 0;
        e = r32(cur + 127);
        while (e !== 0) {
          if (r16(e + 1) > 0) {
            if (step < r16(e + 1)) {
              w16(e + 1, r16(e + 1) - step);
              again = true;
            } else if (nExpiring < 32) {
              nExpiring = (nExpiring + 1) & 255;
              w32($f0 + nExpiring * 4 - 4, e);
              U8[$f0 + nExpiring + 127] = U8[e];
              w16($f0 + nExpiring * 2 + 158, r16(e + 1));
            } else {
              again = true;
            }
          }
          e = r32(e + 5);
        }
        for (let $i6 = 1, $e6 = nExpiring; $i6 <= $e6; $i6++) {
          k = $i6;
          if ((HasEffectNode(cur, r32($f0 + k * 4 - 4)) && (U8[r32($f0 + k * 4 - 4)] === U8[$f0 + k + 127])) && (r16(r32($f0 + k * 4 - 4) + 1) === r16($f0 + k * 2 + 158))) {
            (await RemoveEffect(cur, U8[r32($f0 + k * 4 - 4)], r32($f0 + k * 4 - 4)));
          }
        }
        e = r32(cur + 127);
        while ((e !== 0) && !again) {
          if (r16(e + 1) > 0) {
            again = true;
          }
          e = r32(e + 5);
        }
        if (i <= 72) {
          if (again) {
            U8[i + 240487] = 1;
          } else {
            U8[i + 240487] = 0;
          }
        }
      }
      i = (i + 1) & 255;
      cur = r32(cur + 260);
    }
    if (total > 10) {
      total = (total - 10) | 0;
    } else {
      total = 0;
    }
  }
  S.sp = $sp;
}

export function $init() {
  rt.fill(240488, 72, 0);
  w16(240560, 0);
  U8[240562] = 0;
}
