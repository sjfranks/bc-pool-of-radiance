// Generated from src/classcal.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ALIGN from './c_align';
import * as C_RACE from './c_race';
import * as C_SPELL from './c_spell';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_CLASS from './c_class';
import * as C_LEVEL from './c_level';
import * as C_STAT from './c_stat';
import * as C_EQUIP from './c_equip';
import * as C_ITEM from './c_item';
import * as C_SAVE from './c_save';
import * as Dice from './dice';
import * as CharHlp from './charhlp';
import * as AbilAdj from './abiladj';

export const TURN_UNDEAD_KINDS = 10;
export const TURN_IMMUNE = 99;
export const HALFELF_MULTI_CLERIC_WIS = 13;
export const PRIME_STAT_THRESHOLD = 15;
export const LEAVE_CLASS_SCORE = 15;
export const TAKE_CLASS_SCORE = 17;

export const $at = { wisBonusSpells: 229828, classesByRace: 229919, alignByClass: 230017, usabilityBit: 230187, primeRequisites: 230195, ssiLevelCaps: 230203, ageDice: 230211, hpDice: 230435 };

export function RecalcBaseSkills(creature: number) {
  let i: number = 0, lvl: number = 0, tl: number = 0;
  U8[creature + 45] = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    i = $i1;
    if (I8[creature + 115] < I8[creature + i + 150]) {
      U8[creature + 115] = I8[creature + i + 150];
    }
    lvl = CharHlp.GetClassLevel(creature, 1 << i) << 24 >> 24;
    if (CharHlp.ClassResting(creature, i)) {
      switch (i) {
        case 0: {
          CharHlp.ClearSpellSlots(creature, 0);
          break;
        }
        case 5: {
          CharHlp.ClearSpellSlots(creature, 1);
          break;
        }
      }
    }
    tl = lvl;
    if (tl < 0) {
      tl = 0;
    } else if (tl > 10) {
      tl = 10;
    }
    if (U8[i * 11 + tl + 140171] > U8[creature + 45]) {
      U8[creature + 45] = U8[i * 11 + tl + 140171];
    }
    switch (i) {
      case 2: {
        if (lvl > 6) {
          U8[creature + 161] = 3;
        } else {
          U8[creature + 161] = 2;
        }
        break;
      }
      case 3: {
        if (lvl > 6) {
          U8[creature + 161] = 3;
        }
        break;
      }
      case 4: {
        if (lvl > 7) {
          U8[creature + 161] = 3;
        }
        break;
      }
    }
  }
  CasterSlots(creature);
  if (CharHlp.IsDualClass(creature)) {
    U8[creature + 176] = ItemLimitsFor(creature);
  }
  RecalcSaves(creature);
  RecalcThiefSkills(creature);
}

export function AwardWisdomBonus(creature: number) {
  let w: number = 0, wis: number = 0, lvl: number = 0;
  {
    const $w1 = creature;
    wis = U8[$w1 + 18];
    if (wis > 25) {
      wis = 25;
    }
    for (let $i2 = 13, $e2 = wis; $i2 <= $e2; $i2++) {
      w = $i2;
      for (let $i3 = 1; $i3 <= 5; $i3++) {
        lvl = $i3;
        if (CharHlp.SpellSlots(creature, 0, lvl) > 0) {
          CharHlp.SetSpellSlots(creature, 0, lvl, CharHlp.SpellSlots(creature, 0, lvl) + U8[w * 7 + lvl + 229736]);
        }
      }
    }
  }
}

export function ResetClericSlots(creature: number) {
  let lvl: number = 0;
  lvl = CharHlp.GetClassLevel(creature, 1) << 24 >> 24;
  if (lvl > 1) {
    RecalcBaseSkills(creature);
  } else if (lvl === 1) {
    FirstLevelSlots(creature, 0);
  }
}

export function StartingAge(race: number, charClass: number) {
  let p: number = 0, part: number = 0, oldest: number = 0, $r0: number = 0;
  if (charClass <= 7) {
    {
      const $w1 = race * 32 + charClass * 4 + 230179;
      $r0 = (Dice.RollDice(U8[$w1 + 2], U8[$w1 + 3]) + r16($w1)) & 65535;
    }
  } else {
    oldest = 0;
    for (let $i2 = 1; $i2 <= 3; $i2++) {
      p = $i2;
      part = I8[charClass * 3 + p + 140376];
      if ((part >= 0) && (part <= 7)) {
        {
          const $w3 = race * 32 + part * 4 + 230179;
          if ((r16($w3) + (U8[$w3 + 3] * U8[$w3 + 2])) > oldest) {
            oldest = (r16($w3) + (U8[$w3 + 3] * U8[$w3 + 2])) & 65535;
          }
        }
      }
    }
    $r0 = oldest;
  }
  return $r0;
}

export function RecalcSaves(creature: number) {
  let i: number = 0, k: number = 0, lvl: number = 0;
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    U8[creature + i + 109] = 20;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      lvl = CharHlp.GetClassLevel(creature, 1 << k) << 24 >> 24;
      if (lvl > 0) {
        if (lvl > 9) {
          lvl = 9;
        }
        if (U8[creature + i + 109] > U8[k * 45 + lvl * 5 + i + 230438]) {
          U8[creature + i + 109] = U8[k * 45 + lvl * 5 + i + 230438];
        }
      }
    }
  }
}

export function RecalcThiefSkills(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let j: number = 0, barred: boolean = false;
  if (CharHlp.ClassResting(creature, 6)) {
    rt.fill(creature + 119, 8, 0);
  }
  if (CharHlp.GetClassLevel(creature, 64) < 1) {
    { S.sp = $sp; return; }
  }
  barred = ArmorBarsThiefSkills(creature);
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    j = $i1;
    ThiefSkillParts(creature, j, $f0, $f0 + 1, $f0 + 2);
    if (barred) {
      U8[creature + j + 118] = 0;
    } else {
      U8[creature + j + 118] = ThiefSkill(I8[$f0], I8[$f0 + 1], I8[$f0 + 2]);
    }
  }
  S.sp = $sp;
}

export function ArmorBarsThiefSkills(creature: number) {
  let $r0: boolean = false;
  $r0 = (r32(creature + 208) !== 0) || ((r32(creature + 212) !== 0) && (U8[r32(creature + 212) + 46] !== 50));
  return $r0;
}

export function ThiefSkillParts(creature: number, j: number, base: number, racial: number, dexterity: number) {
  let dex: number = 0, r: number = 0, tl: number = 0;
  dex = U8[creature + 19];
  if (dex < 9) {
    dex = 9;
  } else if (dex > 25) {
    dex = 25;
  }
  r = I8[creature + 46];
  if ((r < 1) || (r > 7)) {
    r = 7;
  }
  tl = CharHlp.GetClassLevel(creature, 64) << 24 >> 24;
  if (tl < 1) {
    tl = 1;
  } else if (tl > 9) {
    tl = 9;
  }
  U8[base] = I8[tl * 8 + j + 230794];
  U8[racial] = I8[r * 8 + j + 230866];
  U8[dexterity] = 0;
  if (j < 6) {
    U8[dexterity] = I8[dex * 5 + j + 230885];
  }
}

export function ThiefSkill(base: number, racial: number, dexterity: number) {
  let total: number = 0, $r0: number = 0;
  if ((racial < 0) && (Math.abs(racial) > base)) {
    $r0 = 0;
  } else {
    total = (base + racial) + dexterity;
    if (total < 0) {
      total = 0;
    }
    $r0 = total & 255;
  }
  return $r0;
}

export function TurnLevel(creature: number) {
  let lvl: number = 0, paladin: number = 0, $r0: number = 0;
  lvl = CharHlp.GetClassLevel(creature, 1) << 24 >> 24;
  paladin = (CharHlp.GetClassLevel(creature, 8) - 2) << 24 >> 24;
  if (paladin > lvl) {
    lvl = paladin;
  }
  if (lvl < 0) {
    lvl = 0;
  }
  $r0 = lvl;
  return $r0;
}

export function TurnValue(undeadLevel: number, lvl: number) {
  let col: number = 0, $r0: number = 0;
  if ((lvl < 1) || (undeadLevel < 1)) {
    $r0 = 99;
    return $r0;
  }
  switch (lvl) {
    case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: {
      col = lvl;
      break;
    }
    case 9: case 10: case 11: case 12: case 13: {
      col = 9;
      break;
    }
    default: {
      col = 10;
    }
  }
  if (undeadLevel > 10) {
    undeadLevel = 10;
  }
  $r0 = I8[undeadLevel * 10 + col + 231005];
  return $r0;
}

export function RaceAbilityMin(race: number, gender: number, ability: number) {
  let $r0: number = 0;
  {
    const $w1 = race * 16 + 140249;
    switch (ability) {
      case 0: {
        $r0 = U8[$w1 + gender];
        break;
      }
      case 1: {
        $r0 = U8[$w1 + 6];
        break;
      }
      case 2: {
        $r0 = U8[$w1 + 8];
        break;
      }
      case 3: {
        $r0 = U8[$w1 + 10];
        break;
      }
      case 4: {
        $r0 = U8[$w1 + 12];
        break;
      }
      default: {
        $r0 = U8[$w1 + 14];
      }
    }
  }
  return $r0;
}

export function RaceAbilityMax(race: number, gender: number, ability: number) {
  let $r0: number = 0;
  {
    const $w1 = race * 16 + 140249;
    switch (ability) {
      case 0: {
        $r0 = U8[$w1 + gender + 2];
        break;
      }
      case 1: {
        $r0 = U8[$w1 + 7];
        break;
      }
      case 2: {
        $r0 = U8[$w1 + 9];
        break;
      }
      case 3: {
        $r0 = U8[$w1 + 11];
        break;
      }
      case 4: {
        $r0 = U8[$w1 + 13];
        break;
      }
      default: {
        $r0 = U8[$w1 + 15];
      }
    }
  }
  return $r0;
}

export function ClassAbilityMin(race: number, charClass: number, ability: number) {
  let p: number = 0, part: number = 0, least: number = 0, $r0: number = 0;
  least = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    p = $i1;
    part = I8[charClass * 3 + p + 140376];
    if (part >= 0) {
      if (I8[part * 6 + ability + 231116] > least) {
        least = I8[part * 6 + ability + 231116] & 255;
      }
    }
  }
  if ((((race === 4) && (ability === 2)) && ((charClass >= 8 && charClass <= 12))) && (least < 13)) {
    least = 13;
  }
  $r0 = least;
  return $r0;
}

export function ConHpPerDie(cls: number, con: number) {
  let share: number = 0, $r0: number = 0;
  if (con < 3) {
    con = 3;
  } else if (con > 25) {
    con = 25;
  }
  share = I8[con + 231161];
  if (((cls === 2) || (cls === 3)) || (cls === 4)) {
    switch (con) {
      case 17: {
        share = (share + 1) << 24 >> 24;
        break;
      }
      case 18: {
        share = (share + 2) << 24 >> 24;
        break;
      }
      case 19: case 20: {
        share = (share + 3) << 24 >> 24;
        break;
      }
      case 21: case 22: case 23: {
        share = (share + 4) << 24 >> 24;
        break;
      }
      case 24: case 25: {
        share = (share + 5) << 24 >> 24;
        break;
      }
    }
  }
  $r0 = share;
  return $r0;
}

export function ConHpBonus(creature: number, mask: number) {
  let bonus: number = 0, cls: number = 0, $r0: number = 0;
  bonus = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (RollsHitDice(creature, cls, mask)) {
      bonus = (bonus + rt.mul(ConHpPerDie(cls, U8[creature + 20]), DiceAtLevel(creature, cls))) << 24 >> 24;
    }
  }
  $r0 = bonus;
  return $r0;
}

export function HitDice(creature: number, cls: number) {
  let lvl: number = 0, before: number = 0, other: number = 0, $r0: number = 0;
  $r0 = 0;
  lvl = I8[creature + cls + 150];
  if (lvl <= 0) {
    return $r0;
  }
  before = 0;
  if ((U8[creature + 285] & (1 << cls)) === 0) {
    for (let $i1 = 0; $i1 <= 7; $i1++) {
      other = $i1;
      if (((U8[creature + 285] & (1 << other)) !== 0) && (I8[creature + other + 150] > before)) {
        before = I8[creature + other + 150];
      }
    }
  }
  if (before === 0) {
    $r0 = ((lvl + U8[cls + 230435]) - 1) & 255;
  } else if (lvl > before) {
    $r0 = (lvl - before) & 255;
  }
  return $r0;
}

export function HpClassCount(creature: number) {
  let n: number = 0, cls: number = 0, $r0: number = 0;
  n = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (I8[creature + cls + 150] > 0) {
      n = (n + 1) & 255;
    }
  }
  if ((n > 1) && (U8[creature + 285] !== 0)) {
    n = 1;
  }
  $r0 = n;
  return $r0;
}

export function DivideAmongClasses(sum: number, conB: number, clsCount: number) {
  let hp: number = 0, $r0: number = 0;
  if (clsCount === 0) {
    clsCount = 1;
  }
  if ((conB < 0) && (sum <= (Math.abs(conB) + clsCount))) {
    hp = 1;
  } else {
    hp = Math.trunc((sum + conB) / clsCount) << 16 >> 16;
  }
  if (hp > 255) {
    hp = 255;
  }
  $r0 = hp & 255;
  return $r0;
}

export function HpMinimum(creature: number) {
  let sum: number = 0, cls: number = 0, $r0: number = 0;
  sum = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    sum = (sum + HitDice(creature, cls)) << 16 >> 16;
  }
  $r0 = DivideAmongClasses(sum, DiceConBonus(creature, U8[creature + 20]), HpClassCount(creature)) & 255;
  return $r0;
}

export function HpMaximum(creature: number) {
  let sum: number = 0, cls: number = 0, $r0: number = 0;
  sum = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    sum = (sum + rt.mul(HitDice(creature, cls), U8[cls + 131910])) << 16 >> 16;
  }
  $r0 = DivideAmongClasses(sum, DiceConBonus(creature, U8[creature + 20]), HpClassCount(creature)) & 255;
  return $r0;
}

export function RollFirstLevelHp(creature: number, mask: number) {
  let roll: number = 0, die: number = 0, floor: number = 0, sum: number = 0, cls: number = 0, i: number = 0, $r0: number = 0;
  sum = 0;
  floor = HitDieFloor(U8[creature + 20]) & 255;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (RollsHitDice(creature, cls, mask)) {
      roll = 0;
      for (let $i2 = 1, $e2 = DiceAtLevel(creature, cls); $i2 <= $e2; $i2++) {
        i = $i2;
        die = Dice.RollDice(1, U8[cls + 131910]) & 255;
        if (die < floor) {
          die = floor;
        }
        roll = (roll + die) & 255;
      }
      if (I8[creature + cls + 150] === 1) {
        if (roll < Math.trunc((U8[cls + 131910] * 2) / 3)) {
          roll = Math.trunc((U8[cls + 131910] * 2) / 3) & 255;
        }
      }
      sum = (sum + roll) & 255;
    }
  }
  $r0 = sum;
  return $r0;
}

export function HitDieFloor(con: number) {
  let $r0: number = 0;
  const $c1 = con;
  if ($c1 === 19 || $c1 === 20) {
    $r0 = 2;
  } else if ($c1 === 21 || $c1 === 22) {
    $r0 = 3;
  } else if (($c1 >= 23 && $c1 <= 255)) {
    $r0 = 4;
  } else {
    $r0 = 1;
  }
  return $r0;
}

export function ConHpTotal(creature: number, con: number) {
  let total: number = 0, clsCount: number = 0, $r0: number = 0;
  total = DiceConBonus(creature, con) << 16 >> 16;
  clsCount = HpClassCount(creature) & 255;
  if (clsCount > 0) {
    total = Math.trunc(total / clsCount) << 16 >> 16;
  }
  $r0 = total;
  return $r0;
}

export function LoseConstitution(creature: number) {
  let hpLoss: number = 0;
  U8[creature + 20] = U8[creature + 20] - 1;
  hpLoss = (ConHpTotal(creature, U8[creature + 20] + 1) - ConHpTotal(creature, U8[creature + 20])) << 16 >> 16;
  if (hpLoss >= U8[creature + 50]) {
    hpLoss = U8[creature + 50] - 1;
  }
  if (hpLoss > 0) {
    U8[creature + 50] = U8[creature + 50] - hpLoss;
  }
}

export function ExperienceShare(creature: number, experience: number) {
  let share: number = 0, $r0: number = 0;
  share = experience;
  switch (I8[creature + 47]) {
    case 0: case 2: case 3: case 4: case 5: case 6: {
      if (PrimesAtLeast(creature, I8[creature + 47], 16)) {
        share = (Math.trunc(experience / 10) + experience) | 0;
      }
      break;
    }
    case 8: case 10: case 11: case 12: case 13: case 14: case 16: {
      share = Math.trunc(experience / 2);
      break;
    }
    case 9: case 15: {
      share = Math.trunc(experience / 3);
      break;
    }
  }
  $r0 = share;
  return $r0;
}

export function ItemLimitsFor(creature: number) {
  let limits: number = 0, cls: number = 0, $r0: number = 0;
  limits = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (CharHlp.GetClassLevel(creature, 1 << cls) > 0) {
      limits = limits | U8[cls + 230187];
    }
  }
  $r0 = limits;
  return $r0;
}

export function FirstLevelSlots(creature: number, cls: number) {
  switch (cls) {
    case 0: {
      CharHlp.ClearSpellSlots(creature, 0);
      CharHlp.SetSpellSlots(creature, 0, 1, 1);
      AwardWisdomBonus(creature);
      break;
    }
    case 5: {
      CharHlp.ClearSpellSlots(creature, 1);
      CharHlp.SetSpellSlots(creature, 1, 1, 1);
      break;
    }
  }
}

export function FitSpellsToLevel(creature: number) {
  let kind: number = 0, lvl: number = 0, room: number = 0, have: number = 0, i: number = 0, id: number = 0;
  if (CharHlp.GetClassLevel(creature, 1) === 1) {
    FirstLevelSlots(creature, 0);
  }
  if (CharHlp.GetClassLevel(creature, 32) === 1) {
    FirstLevelSlots(creature, 5);
  }
  for (let $i1 = 0; $i1 <= 2; $i1++) {
    kind = $i1;
    for (let $i2 = 1; $i2 <= 5; $i2++) {
      lvl = $i2;
      room = CharHlp.SpellSlots(creature, kind, lvl) & 255;
      have = 0;
      for (let $i3 = 0; $i3 <= 47; $i3++) {
        i = $i3;
        id = CharHlp.MemorizedAt(creature, i) & 127;
        if (CharHlp.IsSpell(id)) {
          if ((U8[id * 16 + 136506] === kind) && (I8[id * 16 + 136507] === lvl)) {
            have = (have + 1) & 255;
            if (have > room) {
              CharHlp.SetMemorizedAt(creature, i, 0);
            }
          }
        }
      }
    }
  }
}

export function StartCasterClass(creature: number, cls: number) {
  FirstLevelSlots(creature, cls);
  switch (cls) {
    case 0: {
      KnowClericSpells(creature);
      break;
    }
    case 5: {
      CharHlp.SetSpellKnown(creature, 11, true);
      CharHlp.SetSpellKnown(creature, 18, true);
      CharHlp.SetSpellKnown(creature, 19, true);
      CharHlp.SetSpellKnown(creature, 21, true);
      break;
    }
  }
}

export function PrimesAtLeast(creature: number, cls: number, score: number) {
  let ab: number = 0, have: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = true;
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    ab = $i1;
    if ((U8[cls + 230195] & (1 << ab)) !== 0) {
      if (ab === 0) {
        have = CharHlp.PermanentStrength(creature) & 255;
      } else {
        have = U8[creature + ab + 16];
      }
      if (have < score) {
        ok = false;
      }
    }
  }
  $r0 = ok;
  return $r0;
}

export function CanChangeClass(creature: number) {
  let $r0: boolean = false;
  $r0 = ((((I8[creature + 46] === 7) && (I8[creature + 47] >= 0)) && (I8[creature + 47] <= 7)) && !CharHlp.IsDualClass(creature)) && PrimesAtLeast(creature, I8[creature + 47], 15);
  return $r0;
}

export function CanTakeClass(creature: number, cls: number) {
  let ok: boolean = false, i: number = 0, $r0: boolean = false;
  ok = (CanChangeClass(creature) && (cls !== I8[creature + 47])) && (I8[creature + cls + 150] <= 0);
  if (ok) {
    ok = false;
    for (let $i1 = 1, $e1 = I8[230003]; $i1 <= $e1; $i1++) {
      i = $i1;
      if (I8[i + 230003] === cls) {
        ok = true;
      }
    }
  }
  if (ok) {
    ok = PrimesAtLeast(creature, cls, 17);
  }
  if (ok) {
    for (let $i2 = 0; $i2 <= 5; $i2++) {
      i = $i2;
      if (U8[creature + i + 16] < ClassAbilityMin(I8[creature + 46], cls, i)) {
        ok = false;
      }
    }
  }
  if (ok) {
    ok = false;
    {
      const $w3 = cls * 10 + 230017;
      for (let $i4 = 1, $e4 = I8[$w3]; $i4 <= $e4; $i4++) {
        i = $i4;
        if (I8[$w3 + i] === U8[creature + 160]) {
          ok = true;
        }
      }
    }
  }
  $r0 = ok;
  return $r0;
}

export function ChangeClass(creature: number, cls: number) {
  {
    const $w1 = creature;
    U8[$w1 + 285] = 1 << I8[$w1 + 47];
    U8[$w1 + 47] = cls;
    U8[$w1 + cls + 150] = 1;
    w32($w1 + 172, 0);
    U8[$w1 + 116] = 0;
    U8[$w1 + 117] = 0;
    U8[$w1 + 287] = 0;
  }
  CharHlp.ClearMemorized(creature);
  CharHlp.ClearSpellSlots(creature, 0);
  CharHlp.ClearSpellSlots(creature, 1);
  CharHlp.ClearSpellSlots(creature, 2);
  StartCasterClass(creature, cls);
  RecalcBaseSkills(creature);
}

export function SpellFailureChance(creature: number, spell: number) {
  let $r0: number = 0;
  $r0 = 0;
  if (CharHlp.IsSpell(spell)) {
    if ((I8[spell * 16 + 136506] === 0) && (CharHlp.GetClassLevel(creature, 1) > 0)) {
      $r0 = AbilAdj.WisSpellFailure(U8[creature + 18]) & 255;
    }
  }
  return $r0;
}

export function LevelXp(cls: number, lvl: number) {
  let $r0: number = 0;
  if (lvl < 2) {
    $r0 = 0;
  } else if (lvl > 9) {
    $r0 = -1;
  } else {
    $r0 = ri32(cls * 72 + lvl * 4 + 140420);
  }
  return $r0;
}

export function MaxLevel(cls: number) {
  let $r0: number = 0;
  if (U8[141188] !== 0) {
    $r0 = I8[cls + 230203];
  } else {
    $r0 = 9;
  }
  return $r0;
}

export function LevelOpen(cls: number, lvl: number) {
  let $r0: boolean = false;
  $r0 = ((lvl >= 2) && (lvl <= MaxLevel(cls))) && (LevelXp(cls, lvl) > 0);
  return $r0;
}

export function MinLevel(lvl: number) {
  let $r0: number = 0;
  if (lvl > 9) {
    $r0 = 9;
  } else {
    $r0 = lvl;
  }
  return $r0;
}

export function KnowClericSpells(creature: number) {
  let m: number = 0;
  for (let $i1 = 1; $i1 <= 100; $i1++) {
    m = $i1;
    if (CharHlp.IsSpell(m)) {
      {
        const $w2 = m * 16 + 136506;
        if ((U8[$w2] === 0) || (U8[$w2] === 2)) {
          if (CharHlp.SpellSlots(creature, U8[$w2], I8[$w2 + 1]) > 0) {
            CharHlp.SetSpellKnown(creature, m, true);
          }
        }
      }
    }
  }
}

export function PutSlotRow(creature: number, kind: number, row: number, add: boolean) {
  let k: number = 0;
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    k = $i1;
    if (add) {
      CharHlp.SetSpellSlots(creature, kind, k, CharHlp.SpellSlots(creature, kind, k) + U8[row + k - 1]);
    } else {
      CharHlp.SetSpellSlots(creature, kind, k, U8[row + k - 1]);
    }
  }
}

export function CasterSlots(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let clr: number = 0, mag: number = 0, pal: number = 0, rng: number = 0, k: number = 0;
  clr = CharHlp.GetClassLevel(creature, 1) << 24 >> 24;
  mag = CharHlp.GetClassLevel(creature, 32) << 24 >> 24;
  pal = CharHlp.GetClassLevel(creature, 8) << 24 >> 24;
  rng = CharHlp.GetClassLevel(creature, 16) << 24 >> 24;
  if (clr > 1) {
    if (clr > 9) {
      clr = 9;
    }
    for (let $i1 = 1; $i1 <= 5; $i1++) {
      k = $i1;
      U8[$f0 + k - 1] = U8[clr * 5 + k + 140449];
    }
    if (U8[creature + 18] < 17) {
      U8[$f0 + 4] = 0;
    }
    PutSlotRow(creature, 0, $f0, false);
    AwardWisdomBonus(creature);
  }
  if ((clr > 1) || ((clr <= 0) && (pal > 0))) {
    rt.fill($f0, 5, 0);
    if (pal >= 9) {
      for (let $i2 = 1; $i2 <= 5; $i2++) {
        k = $i2;
        U8[$f0 + k - 1] = U8[MinLevel(pal) * 5 + k + 140958];
      }
    }
    PutSlotRow(creature, 0, $f0, clr > 1);
  }
  if (mag > 1) {
    if (mag > 9) {
      mag = 9;
    }
    for (let $i3 = 1; $i3 <= 5; $i3++) {
      k = $i3;
      U8[$f0 + k - 1] = U8[mag * 5 + k + 140809];
    }
    PutSlotRow(creature, 1, $f0, false);
  }
  rt.fill($f0, 5, 0);
  if (rng >= 8) {
    for (let $i4 = 1; $i4 <= 5; $i4++) {
      k = $i4;
      U8[$f0 + k - 1] = U8[MinLevel(rng) * 5 + k + 140978];
    }
  }
  if ((mag > 1) || ((mag <= 0) && (rng > 0))) {
    PutSlotRow(creature, 1, $f0, mag > 1);
  }
  rt.fill($f0, 5, 0);
  if (rng >= 8) {
    for (let $i5 = 1; $i5 <= 5; $i5++) {
      k = $i5;
      U8[$f0 + k - 1] = U8[MinLevel(rng) * 5 + k + 140968];
    }
  }
  PutSlotRow(creature, 2, $f0, false);
  if (((clr > 1) || (pal > 0)) || (rng > 0)) {
    KnowClericSpells(creature);
  }
  S.sp = $sp;
}

export function RollsHitDice(creature: number, cls: number, mask: number) {
  let $r0: boolean = false;
  $r0 = ((I8[creature + cls + 150] > 0) && ((U8[cls + 131902] & mask) > 0)) && ((U8[creature + 285] & (1 << cls)) === 0);
  return $r0;
}

export function DiceAtLevel(creature: number, cls: number) {
  let $r0: number = 0;
  if (I8[creature + cls + 150] > 1) {
    $r0 = 1;
  } else {
    $r0 = U8[cls + 230435];
  }
  return $r0;
}

export function DiceConBonus(creature: number, con: number) {
  let bonus: number = 0, cls: number = 0, $r0: number = 0;
  bonus = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    bonus = (bonus + rt.mul(HitDice(creature, cls), ConHpPerDie(cls, con))) << 16 >> 16;
  }
  $r0 = bonus;
  return $r0;
}
