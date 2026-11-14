// Generated from src/combatai.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as C_NPC from './c_npc';
import * as C_TERR from './c_terr';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as CbtActs from './cbtacts';
import * as FxEngine from './fxengine';
import * as C_EFFECT from './c_effect';
import * as C_EQUIP from './c_equip';
import * as C_CLASS from './c_class';
import * as C_STATUS from './c_status';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_SPELL from './c_spell';
import * as C_KEYS from './c_keys';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as GameIo from './gameio';
import * as Magic from './magic';
import * as Pathing from './pathing';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as Dice from './dice';
import * as Combat from './combat';
import * as ClassCal from './classcal';
import * as TpRand from './tprand';

export const TURN_SLACK = 20;

export const $at = { aiDirOffsets: 258126, lastMoveDir: 258156, stuckCount: 258157, quickShown: 258158 };

export async function CombatAiControl(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let stance: number = 0, spell: number = 0;
  U8[$f0] = (await CheckKeystroke(creature)) ? 1 : 0;
  if (QuickLine()) {
  }
  CharDisp.ClearMessageWindow();
  if (U8[creature + 269] === 0) {
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  }
  stance = U8[r32(creature + 264) + 21];
  if (((stance === 0) || (stance > 4)) || (Dice.RollDice(1, 4) === 1)) {
    stance = Dice.RollDice(1, 8) & 255;
    if (stance === 8) {
      stance = (Dice.RollDice(1, 2) + 4) & 255;
    } else {
      stance = Dice.RollDice(1, 4) & 255;
    }
  }
  U8[r32(creature + 264) + 21] = stance;
  if (!(U8[$f0] !== 0)) {
    U8[$f0] = (await CheckMorale(creature)) ? 1 : 0;
  }
  if ((U8[r32(creature + 264) + 20] !== 0) && (U8[r32(creature + 264) + 16] === 0)) {
    (await CharDisp.PrintNameString(creature, "flees in panic", 10, true));
  }
  if ((U8[$f0] !== 0)) {
    { S.sp = $sp; return; }
  }
  if (U8[r32(creature + 264)] > 0) {
    spell = U8[r32(creature + 264)];
    U8[r32(creature + 264)] = 0;
    (await Magic.CastSpell(spell, true, true, $f0));
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  } else if ((await SelectItemToUse(creature))) {
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  } else if ((await TurnUndeadAi(creature))) {
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  } else if ((await SelectSpellToCast(creature))) {
    U8[$f0] = true ? 1 : 0;
  } else {
    (await EquipWeaponAndShield(creature));
    U8[$f0] = (await CheckKeystroke(creature)) ? 1 : 0;
    while (!(U8[$f0] !== 0)) {
      if ((await CbtActs.AcquireTarget(creature, 255, 1, 0)) && (I8[r32(creature + 264) + 3] > 0)) {
        U8[$f0] = (await AiMoveAttack(creature)) ? 1 : 0;
      } else {
        U8[$f0] = (await FinishRound(creature)) ? 1 : 0;
      }
    }
  }
  S.sp = $sp;
}

export async function ToggleQuickMagic() {
  U8[232418] = !(U8[232418] !== 0) ? 1 : 0;
  if (!QuickLine()) {
    if ((U8[232418] !== 0)) {
      (await CharDisp.PrintBottomLine("Magic On"));
    } else {
      (await CharDisp.PrintBottomLine("Magic Off"));
    }
  }
}

export function AllToManual() {
  let p: number = 0;
  p = r32(229639);
  while (p !== 0) {
    if (CharHlp.ComesUnderPlayer(p)) {
      U8[p + 271] = 0;
    }
    p = r32(p + 260);
  }
}

export function KnowsItem(creature: number, item: number) {
  let $r0: boolean = false;
  $r0 = (U8[item + 53] === 0) || (CharHlp.Team(creature) !== 0);
  return $r0;
}

export function CalcWeaponPriority(creature: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  let pri: number = 0, known: boolean = false, $r0: number = 0;
  known = KnowsItem(creature, item);
  mv($f0, CharHlp.BaseItem(U8[item + 46]), 16);
  pri = (U8[$f0 + 10] * U8[$f0 + 9]) & 255;
  if (known && (I8[item + 50] > 0)) {
    pri = (pri + (I8[item + 50] * 8)) & 255;
  }
  if (I8[$f0 + 11] > 0) {
    pri = (pri + (I8[$f0 + 11] * 2)) & 255;
  }
  if (((U8[item + 46] === 85) && (r32(r32(creature + 264) + 10) !== 0)) && (I8[r32(r32(creature + 264) + 10) + 118] > 0)) {
    pri = 8;
  }
  if ((U8[$f0 + 14] & 8) > 0) {
    pri = (pri + ((U8[$f0 + 5] - 1) * 2)) & 255;
  }
  if (U8[$f0 + 1] <= 1) {
    pri = (pri + 3) & 255;
  }
  if ((U8[$f0 + 1] + U8[creature + 256]) > 3) {
    pri = 0;
  }
  if (known) {
    if (U8[item + 62] === 132) {
      if ((U8[item + 61] & 15) !== U8[creature + 160]) {
        pri = 0;
      }
    }
    if (U8[item + 61] === 83) {
      pri = 0;
    }
    if (U8[item + 54] !== 0) {
      pri = 0;
    }
  }
  $r0 = pri;
  S.sp = $sp;
  return $r0;
}

export async function SpellImpact(creature: number, spell: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let eff: number = 0, threat: boolean = false, $r0: number = 0;
  $r0 = 0;
  if (rt.inS(C_SPELL.CURE_WOUNDS, spell)) {
    if (CbtActs.FindCureTarget(creature, $f0)) {
      $r0 = 1;
    }
  } else if (U8[spell * 16 + 222406] === 0) {
    switch (spell) {
      case 24: {
        threat = EnemySeenDoing(creature, 1);
        break;
      }
      case 8: {
        threat = EnemySeenDoing(creature, 2);
        break;
      }
      case 54: {
        threat = EnemyHasMissiles(creature);
        break;
      }
      default: {
        threat = true;
      }
    }
    eff = U8[spell * 16 + 222402];
    if (spell === 85) {
      eff = 151;
    }
    if (threat && ((eff === 0) || !CharHlp.HasEffect(creature, eff, $f0 + 4))) {
      $r0 = 1;
    }
  } else {
    rt.fill(232047, 288, 0);
    if ((await CbtActs.BestAim(spell, $f0 + 8)) !== 0) {
      if (((U8[spell * 16 + 222407] === 0) || (spell === 25)) || (U8[$f0 + 8] >= 2)) {
        $r0 = U8[$f0 + 8];
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function KeepsGear(creature: number) {
  let $r0: boolean = false;
  $r0 = (U8[227079] === 0) && CharHlp.ComesUnderPlayer(creature);
  return $r0;
}

export async function EquipWeaponAndShield(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let bestRanged: number = 0, bestMelee: number = 0, bestShield: number = 0, item: number = 0, bestRangedPri: number = 0, bestMeleePri: number = 0, bestShieldPri: number = 0, pri: number = 0, itType: number = 0, needSwap: boolean = false, changed: boolean = false, trueRanged: boolean = false, hasAmmo: boolean = false;
  if (KeepsGear(creature)) {
    { S.sp = $sp; return; }
  }
  if (r32(creature + 204) !== 0) {
    U8[creature + 256] = U8[creature + 256] - U8[CharHlp.BaseItem(U8[r32(creature + 204) + 46]) + 1];
  }
  if (r32(creature + 208) !== 0) {
    U8[creature + 256] = U8[creature + 256] - U8[CharHlp.BaseItem(U8[r32(creature + 208) + 46]) + 1];
  }
  bestRanged = 0;
  bestMelee = 0;
  bestShield = 0;
  bestRangedPri = 1;
  bestMeleePri = (U8[creature + 165] * U8[creature + 163]) & 255;
  if (I8[creature + 167] > 0) {
    bestMeleePri = (bestMeleePri + (I8[creature + 167] * 2)) & 255;
  }
  bestShieldPri = 0;
  item = r32(creature + 200);
  while (item !== 0) {
    itType = U8[item + 46];
    if (U8[CharHlp.BaseItem(itType)] === 0) {
      if ((U8[CharHlp.BaseItem(itType) + 13] & U8[creature + 176]) !== 0) {
        pri = CalcWeaponPriority(creature, item) & 255;
        if (((U8[CharHlp.BaseItem(itType) + 14] & 8) !== 0) || ((U8[CharHlp.BaseItem(itType) + 14] & 16) !== 0)) {
          if (pri > bestRangedPri) {
            bestRanged = item;
            bestRangedPri = pri;
          }
        }
        if ((U8[CharHlp.BaseItem(itType) + 14] & 8) === 0) {
          if (pri > bestMeleePri) {
            bestMelee = item;
            bestMeleePri = pri;
          }
        }
      }
    }
    if (U8[CharHlp.BaseItem(itType)] === 1) {
      if ((U8[CharHlp.BaseItem(itType) + 13] & U8[creature + 176]) > 0) {
        if (!KnowsItem(creature, item)) {
          pri = 1;
        } else if ((I8[item + 50] >= 0) && (U8[item + 54] === 0)) {
          pri = (I8[item + 50] + 1) & 255;
        } else {
          pri = 0;
        }
        if (pri > bestShieldPri) {
          bestShield = item;
          bestShieldPri = pri;
        }
      }
    }
    item = r32(item + 42);
  }
  if (((bestRanged !== 0) && (U8[CharHlp.BaseItem(U8[bestRanged + 46]) + 12] > 1)) && ((U8[CharHlp.BaseItem(U8[bestRanged + 46]) + 14] & 20) === 20)) {
    trueRanged = true;
  } else {
    trueRanged = false;
  }
  hasAmmo = CharHlp.FindAmmo(creature, bestRanged, $f0);
  if ((((bestRanged !== 0) && (bestRangedPri > Math.trunc(bestMeleePri / 2))) && hasAmmo) && (trueRanged || (CbtMap.CountTargets(creature, 1) === 0))) {
    item = bestRanged;
  } else {
    item = bestMelee;
  }
  changed = false;
  needSwap = true;
  if (r32(creature + 204) !== 0) {
    if ((r32(creature + 204) === item) || (U8[r32(creature + 204) + 54] !== 0)) {
      needSwap = false;
    }
  }
  if (needSwap) {
    if (r32(creature + 204) !== 0) {
      (await FxEngine.ToggleReadyItem(r32(creature + 204)));
    }
    CharHlp.RecalcStats(creature);
    if (r32(creature + 208) !== 0) {
      if (U8[r32(creature + 208) + 54] === 0) {
        U8[creature + 256] = U8[creature + 256] - U8[CharHlp.BaseItem(U8[r32(creature + 208) + 46]) + 1];
      }
    }
    if (item !== 0) {
      (await FxEngine.ToggleReadyItem(item));
    }
    changed = true;
  }
  CharHlp.RecalcStats(creature);
  (await CbtActs.RecalcAttacksLeft(creature));
  needSwap = true;
  if (r32(creature + 208) !== 0) {
    if ((r32(creature + 208) === bestShield) || (U8[r32(creature + 208) + 54] !== 0)) {
      needSwap = false;
    }
  }
  if (U8[creature + 256] > 2) {
    if ((r32(creature + 208) === 0) || (U8[r32(creature + 208) + 54] !== 0)) {
      if (item !== 0) {
        (await FxEngine.ToggleReadyItem(item));
      }
      changed = true;
    } else {
      (await FxEngine.ToggleReadyItem(r32(creature + 208)));
      changed = true;
    }
  } else if ((U8[creature + 256] < 2) && needSwap) {
    if (r32(creature + 208) !== 0) {
      (await FxEngine.ToggleReadyItem(r32(creature + 208)));
    }
    CharHlp.RecalcStats(creature);
    if (bestShield !== 0) {
      (await FxEngine.ToggleReadyItem(bestShield));
    }
    changed = true;
  }
  CharHlp.RecalcStats(creature);
  if (changed) {
    (await CharDisp.CombatPrintCreatureInfo(creature));
  }
  S.sp = $sp;
}

export function QuickLine() {
  let p: number = 0, quick: boolean = false, $r0: boolean = false;
  quick = false;
  p = r32(229639);
  while (p !== 0) {
    if ((U8[p + 271] !== 0) && CharHlp.ComesUnderPlayer(p)) {
      quick = true;
    }
    p = r32(p + 260);
  }
  TextRend.ClearBottomLine();
  $r0 = quick;
  U8[258158] = quick ? 1 : 0;
  if (!quick) {
    return $r0;
  }
  TextRend.DisplayString(0, 24, 13, "Quick: ");
  TextRend.DisplayString(7, 24, 15, "On (Space) ");
  TextRend.DisplayString(18, 24, 13, "Magic: ");
  if ((U8[232418] !== 0)) {
    TextRend.DisplayString(25, 24, 15, "On (Alt-M)");
  } else {
    TextRend.DisplayString(25, 24, 15, "Off (Alt-M)");
  }
  return $r0;
}

export async function TurnUndeadAi(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  if (((U8[r32(creature + 264) + 17] === 0) && (ClassCal.TurnLevel(creature) > 0)) && CbtActs.FindTurnUndeadTarget(creature, $f0)) {
    $r0 = true;
    (await CbtActs.CombatTurnUndead(creature));
  } else {
    $r0 = false;
  }
  S.sp = $sp;
  return $r0;
}

export async function SelectItemToUse(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let lowPri: number = 0, roll: number = 0, i: number = 0, effect: number = 0, item: number = 0, chosen: number = 0, $r0: boolean = false;
  $r0 = false;
  chosen = 0;
  lowPri = 7;
  roll = Dice.RollDice(1, 7) & 255;
  if (((U8[r32(creature + 264) + 2] !== 0) && (U8[CharHlp.EnemyTeam(creature) + 230780] > 0)) && !CharHlp.AntiMagicArea()) {
    for (let $i1 = 1, $e1 = roll; $i1 <= $e1; $i1++) {
      i = $i1;
      item = r32(creature + 200);
      while ((item !== 0) && (chosen === 0)) {
        effect = CharHlp.ItemSpell(item) & 255;
        if (((U8[item + 52] !== 0) && (effect !== 0)) && KnowsItem(creature, item)) {
          if ((await DecideCastSpell(creature, effect, lowPri))) {
            chosen = item;
          }
        }
        item = r32(item + 42);
      }
      lowPri = (lowPri - 1) & 255;
    }
  }
  if (chosen !== 0) {
    (await Magic.UseItem(chosen, $f0));
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export async function SelectSpellToCast(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 145);
  let total: number = 0, roll: number = 0, count: number = 0, k: number = 0, chosen: number = 0, $r0: boolean = false;
  count = 0;
  if ((U8[r32(creature + 264) + 1] !== 0) && !CharHlp.AntiMagicArea()) {
    for (let $i1 = 0; $i1 <= 47; $i1++) {
      k = $i1;
      if (CharHlp.IsSpell(CharHlp.MemorizedAt(creature, k))) {
        U8[$f0 + count] = CharHlp.MemorizedAt(creature, k);
        count = (count + 1) & 255;
      }
    }
  }
  chosen = 0;
  total = 0;
  if (count > 0) {
    if (CharHlp.IsNpc(creature) || (U8[232418] !== 0)) {
      if (U8[CharHlp.EnemyTeam(creature) + 230780] > 0) {
        for (let $i2 = 0, $e2 = count - 1; $i2 <= $e2; $i2++) {
          k = $i2;
          w16($f0 + k * 2 + 48, 0);
          if (U8[U8[$f0 + k] * 16 + 222405] > 0) {
            w16($f0 + k * 2 + 48, rt.mul((await SpellImpact(creature, U8[$f0 + k])) & 65535, U8[U8[$f0 + k] * 16 + 222405]));
          }
          total = (total + r16($f0 + k * 2 + 48)) & 65535;
        }
        if (total > 0) {
          roll = TpRand.Random(total) & 65535;
          k = 0;
          while (roll >= r16($f0 + k * 2 + 48)) {
            roll = (roll - r16($f0 + k * 2 + 48)) & 65535;
            k = (k + 1) & 255;
          }
          chosen = U8[$f0 + k];
        }
      }
    }
  }
  if (chosen > 0) {
    (await CbtActs.CastSpellCombat(chosen, 1, $f0 + 144));
  } else {
    U8[$f0 + 144] = false ? 1 : 0;
  }
  $r0 = (U8[$f0 + 144] !== 0);
  S.sp = $sp;
  return $r0;
}

export async function AiMoveAttack(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let inRange: boolean = false, canAct: boolean = false, weaponRange: number = 0, cnt: number = 0, pick: number = 0, target: number = 0, loopCount: number = 0, loopLimit: number = 0, $r0: boolean = false;
  U8[258156] = 8;
  U8[258157] = 0;
  loopCount = 0;
  loopLimit = (Math.trunc(U8[r32(creature + 264) + 6] / 2) + 20) & 255;
  canAct = true;
  U8[$f0] = false ? 1 : 0;
  (await FxEngine.TriggerEffectsWithCondition(14, creature));
  if ((I8[creature + 270] === 0) && (await Combat.BandageDying(true))) {
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  }
  if (I8[r32(creature + 264) + 3] === 0) {
    canAct = false;
  }
  while (!(U8[$f0] !== 0) && canAct) {
    if (U8[r32(creature + 264) + 20] !== 0) {
      while (((U8[r32(creature + 264) + 6] > 0) && (I8[r32(creature + 264) + 3] > 0)) && (I8[r32(creature + 264) + 3] < 20)) {
        (await AiMoveStep(creature));
      }
    }
    if ((I8[r32(creature + 264) + 3] === 0) || (I8[r32(creature + 264) + 3] === 20)) {
      canAct = false;
    }
    loopCount = (loopCount + 1) & 255;
    if (canAct && (loopCount > loopLimit)) {
      U8[$f0] = true ? 1 : 0;
      canAct = !(await FinishRound(creature));
    }
    if (!(U8[$f0] !== 0) && canAct) {
      inRange = false;
      weaponRange = 1;
      if (r32(creature + 204) !== 0) {
        weaponRange = (U8[CharHlp.BaseItem(U8[r32(creature + 204) + 46]) + 12] - 1) & 255;
      }
      if ((weaponRange === 0) || (weaponRange === 255)) {
        weaponRange = 1;
      }
      target = r32(r32(creature + 264) + 10);
      if ((target !== 0) && ((U8[target + 269] === 0) || (I8[target + 270] === I8[creature + 270]))) {
        target = 0;
      }
      if (target !== 0) {
        if ((await CbtActs.CanTarget(creature, target, true))) {
          U8[$f0 + 3] = CbtMap.CombatCellX(target);
          U8[$f0 + 4] = CbtMap.CombatCellY(target);
          w16($f0 + 1, weaponRange);
          if (Pathing.WalkLine(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), $f0 + 3, $f0 + 4, $f0 + 1, r32(230527))) {
            if (Math.trunc(r16($f0 + 1) / 2) <= weaponRange) {
              inRange = true;
            }
          }
        }
      }
      if (!inRange) {
        cnt = CbtMap.CountTargets(creature, weaponRange) & 255;
        if (cnt === 0) {
          if ((await CbtActs.AcquireTarget(creature, 255, 0, 0))) {
            (await AiMoveStep(creature));
          } else {
            U8[$f0] = (await FinishRound(creature)) ? 1 : 0;
          }
        } else {
          pick = Dice.RollDice(1, cnt) & 255;
          target = r32(U8[pick + 232345] * 4 + 230178);
          if ((CharHlp.HasRangedWeapon(creature) && !CharHlp.HasThrowableWeapon(creature)) && (CbtMap.CountTargets(creature, 1) > 0)) {
            (await EquipWeaponAndShield(creature));
            U8[$f0] = true ? 1 : 0;
            if (CharHlp.HasRangedWeapon(creature) && !CharHlp.HasThrowableWeapon(creature)) {
              canAct = !(await FinishRound(creature));
            }
          } else if ((CbtMap.CalcDistance(creature, target) === 1) || (await CbtActs.CanTarget(creature, target, true))) {
            inRange = true;
          }
        }
      }
      if (inRange) {
        (await CbtMap.ScrollView(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), 2, CbtActs.DirTowardTarget(creature, target)));
      }
      if (inRange) {
        if ((await CbtActs.SweepAttack(creature, target))) {
          U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
        } else {
          (await CbtActs.AttackWithReadied(creature, target, $f0));
          if ((U8[$f0] !== 0)) {
            canAct = false;
          } else if (U8[target + 269] === 0) {
            U8[$f0] = true ? 1 : 0;
          }
        }
      }
    }
  }
  $r0 = canAct === false;
  S.sp = $sp;
  return $r0;
}

export async function FinishRound(creature: number) {
  let $r0: boolean = false;
  CharDisp.ClearMessageWindow();
  if ((CharHlp.IsHelpless(creature) || CharHlp.HasRangedWeapon(creature)) || (I8[r32(creature + 264) + 3] === 0)) {
    $r0 = CharHlp.EndActions(creature);
  } else {
    $r0 = CharHlp.Guard(creature);
    (await CharDisp.PrintActionLine(creature, "Guarding", "is Guarding"));
  }
  return $r0;
}

export async function CheckKeystroke(creature: number) {
  let ch: number = 0, ext: boolean = false, $r0: boolean = false;
  $r0 = false;
  if ((U8[227098] !== 0)) {
    if ((await GameIo.DemoEnding())) {
    }
  } else if ((await Crt.KeyPressed())) {
    ch = (await GameIo.ReadGameKey()) & 255;
    ext = ch === 0;
    if (ext) {
      ch = (await GameIo.ReadGameKey()) & 255;
    }
    switch (ch) {
      case 50: {
        if (ext) {
          (await ToggleQuickMagic());
        }
        break;
      }
      case 32: {
        AllToManual();
        if (U8[creature + 271] === 0) {
          U8[r32(creature + 264) + 3] = 20;
          $r0 = true;
        }
        break;
      }
      case 45: {
        if (ext) {
          if ((await CbtActs.VictoryCheat())) {
          }
        }
        break;
      }
    }
  }
  return $r0;
}

export async function CheckMorale(creature: number) {
  let enemyMove: number = 0, moraleSave: number = 0, hpPct: number = 0, $r0: boolean = false;
  $r0 = false;
  U8[r32(creature + 264) + 20] = 0;
  (await FxEngine.RemoveAiEffects(creature));
  if (U8[r32(creature + 264) + 16] !== 0) {
    U8[r32(creature + 264) + 20] = 1;
    (await CharDisp.PrintNameString(creature, "is forced to flee", 10, true));
    return $r0;
  }
  if (!CharHlp.IsNpc(creature)) {
    return $r0;
  }
  U8[230794] = (U8[creature + 132] & 127) * 2;
  if (U8[230794] > 102) {
    U8[230794] = 0;
  }
  (await FxEngine.TriggerEffectsWithCondition(17, creature));
  if (U8[creature + 50] === 0) {
    hpPct = 0;
  } else {
    hpPct = Math.trunc((U8[creature + 283] * 100) / U8[creature + 50]) << 16 >> 16;
  }
  if ((U8[230794] >= (100 - hpPct)) && (U8[230794] !== 0)) {
    return $r0;
  }
  moraleSave = U8[230794];
  U8[230794] = U8[255708];
  (await FxEngine.TriggerEffectsWithCondition(17, creature));
  if (((U8[230794] >= (100 - r16(r32(227037) + 1420))) && (U8[230794] !== 0)) && (I8[creature + 270] !== 0)) {
    return $r0;
  }
  enemyMove = (await CbtActs.HighestEnemyMovement(creature)) & 255;
  if (enemyMove <= Math.trunc((await CbtActs.CalcCreatureMovement(creature)) / 2)) {
    U8[r32(creature + 264) + 20] = 1;
  } else if (U8[creature + 17] > 5) {
    (await FxEngine.PutOutOfPlayWithStatus(creature, 4, "Surrenders"));
    $r0 = CharHlp.EndActions(creature);
  }
  return $r0;
}

export function EnemySeenDoing(creature: number, elem: number) {
  let i: number = 0, p: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
    i = $i1;
    p = r32(i * 4 + 230178);
    if (p !== 0) {
      if (((U8[p + 269] !== 0) && (CharHlp.Team(p) === CharHlp.EnemyTeam(creature))) && ((U8[i + 248754] & elem) !== 0)) {
        $r0 = true;
      }
    }
  }
  return $r0;
}

export function EnemyHasMissiles(creature: number) {
  let i: number = 0, p: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
    i = $i1;
    p = r32(i * 4 + 230178);
    if (p !== 0) {
      if (((U8[p + 269] !== 0) && (CharHlp.Team(p) === CharHlp.EnemyTeam(creature))) && CharHlp.HasRangedWeapon(p)) {
        $r0 = true;
      }
    }
  }
  return $r0;
}

export async function DecideCastSpell(creature: number, spell: number, minPri: number) {
  let $r0: boolean = false;
  $r0 = (U8[spell * 16 + 222405] >= minPri) && ((await SpellImpact(creature, spell)) > 0);
  return $r0;
}

export function AvoidsCloud(creature: number) {
  let $r0: boolean = false;
  $r0 = !FxEngine.CloudProof(creature);
  return $r0;
}

export function AvoidsCloudkill(creature: number) {
  let $r0: boolean = false;
  $r0 = !FxEngine.CloudkillProof(creature) && !CbtMap.ProbeTerrain(creature, 8, 66);
  return $r0;
}

export function CanStepDir(creature: number, dir: number, edge: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let stepCost: number = 0, $r0: boolean = false;
  U8[edge] = false ? 1 : 0;
  $r0 = false;
  CbtMap.ProbeDirection(creature, dir, $f0, $f0 + 1);
  if (U8[$f0 + 1] === 0) {
    U8[edge] = true ? 1 : 0;
    { S.sp = $sp; return $r0; }
  }
  if (U8[$f0] !== 0) {
    { S.sp = $sp; return $r0; }
  }
  if (U8[U8[$f0 + 1] * 3 + 218828] >= U8[r32(creature + 264) + 6]) {
    { S.sp = $sp; return $r0; }
  }
  stepCost = 2;
  if ((dir & 1) !== 0) {
    stepCost = 3;
  }
  stepCost = (stepCost * U8[U8[$f0 + 1] * 3 + 218828]) & 255;
  if ((U8[$f0 + 1] === 30) && AvoidsCloud(creature)) {
    stepCost = (U8[r32(creature + 264) + 6] + 1) & 255;
  }
  if (CbtMap.ProbeTerrain(creature, dir, 66) && AvoidsCloudkill(creature)) {
    stepCost = (U8[r32(creature + 264) + 6] + 1) & 255;
  }
  if (U8[r32(creature + 264) + 6] >= stepCost) {
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export function AiCanStep(creature: number, attempt: number, baseDir: number, edge: number) {
  let $r0: boolean = false;
  $r0 = CanStepDir(creature, (baseDir + U8[U8[r32(creature + 264) + 21] * 5 + attempt + 258120]) % 8, edge);
  return $r0;
}

export async function RouteToEnemy(creature: number, dir: number, wait: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 100);
  let slot: number = 0, targetSlot: number = 0, i: number = 0, last: number = 0, found: boolean = false, p: number = 0, $r0: boolean = false;
  $r0 = false;
  U8[wait] = false ? 1 : 0;
  slot = CbtMap.CombatSlot(creature) & 255;
  targetSlot = CbtMap.CombatSlot(r32(r32(creature + 264) + 10)) & 255;
  if ((slot === 0) || (targetSlot === 0)) {
    { S.sp = $sp; return $r0; }
  }
  rt.wSet($f0 + 1, 0, 32, rt.setR());
  if (AvoidsCloud(creature)) {
    rt.wSet($f0 + 1, 0, 32, rt.sUnion(rt.rSet($f0 + 1, 0, 32), rt.setR(30, 30)));
  }
  if (AvoidsCloudkill(creature)) {
    rt.wSet($f0 + 1, 0, 32, rt.sUnion(rt.rSet($f0 + 1, 0, 32), rt.setR(66, 66)));
  }
  found = Pathing.RouteStep(slot, rt.setR(targetSlot, targetSlot), rt.setR(), rt.rSet($f0 + 1, 0, 32), 30, dir, $f0);
  if (!found) {
    rt.wSet($f0 + 36, 0, 32, rt.setR());
    rt.wSet($f0 + 68, 0, 32, rt.setR());
    last = Pathing.LastSlot() & 255;
    for (let $i1 = 1, $e1 = last; $i1 <= $e1; $i1++) {
      i = $i1;
      p = r32(i * 4 + 230178);
      if (((i !== slot) && (p !== 0)) && (U8[i * 4 + 229893] !== 0)) {
        if (CharHlp.Team(p) !== CharHlp.EnemyTeam(creature)) {
          rt.wSet($f0 + 68, 0, 32, rt.sUnion(rt.rSet($f0 + 68, 0, 32), rt.setR(i, i)));
        } else if ((U8[p + 269] !== 0) && (await CbtActs.CanTarget(creature, p, true))) {
          rt.wSet($f0 + 36, 0, 32, rt.sUnion(rt.rSet($f0 + 36, 0, 32), rt.setR(i, i)));
        }
      }
    }
    found = Pathing.RouteStep(slot, rt.rSet($f0 + 36, 0, 32), rt.setR(), rt.rSet($f0 + 1, 0, 32), 30, dir, $f0);
    if (!found) {
      found = Pathing.RouteStep(slot, rt.rSet($f0 + 36, 0, 32), rt.rSet($f0 + 68, 0, 32), rt.rSet($f0 + 1, 0, 32), 30, dir, $f0);
      if (found) {
        CbtMap.ProbeDirection(creature, U8[dir], $f0 + 33, $f0 + 34);
        U8[wait] = U8[$f0 + 33] !== 0 ? 1 : 0;
      }
    }
    if (found) {
      w32(r32(creature + 264) + 10, r32(U8[$f0] * 4 + 230178));
    }
  }
  $r0 = (found && !(U8[wait] !== 0)) && CanStepDir(creature, U8[dir], $f0 + 35);
  S.sp = $sp;
  return $r0;
}

export async function AiMoveStep(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let dir: number = 0, attempt: number = 0, done: boolean = false, routed: boolean = false;
  if (!(U8[258158] !== 0)) {
    TextRend.DisplayString(0, 24, 10, "Move/Attack, Move Left = " + StrUtil.NumStr(Math.trunc(U8[r32(creature + 264) + 6] / 2)) + " ");
  }
  if ((await CheckKeystroke(creature))) {
    { S.sp = $sp; return; }
  }
  if (((Math.trunc(U8[r32(creature + 264) + 6] / 2) > 0) && (I8[r32(creature + 264) + 3] > 0)) && ((U8[r32(creature + 264) + 20] !== 0) || (I8[creature + 47] !== 5))) {
    routed = false;
    U8[$f0 + 2] = false ? 1 : 0;
    if (U8[r32(creature + 264) + 20] === 0) {
      if (r32(r32(creature + 264) + 10) !== 0) {
        routed = (await RouteToEnemy(creature, $f0, $f0 + 2));
      }
      dir = CbtActs.DirTowardTarget(creature, r32(r32(creature + 264) + 10)) & 255;
    } else {
      U8[r32(creature + 264) + 21] = Dice.RollDice(1, 2);
      dir = U8[231434];
      if (I8[creature + 270] === 0) {
        dir = (dir + 4) & 255;
      }
      dir = dir % 8;
    }
    U8[$f0 + 1] = false ? 1 : 0;
    done = false;
    attempt = 1;
    if ((U8[$f0 + 2] !== 0)) {
      done = (await FinishRound(creature));
    } else if (routed) {
      U8[258156] = U8[$f0];
      U8[258157] = 0;
    } else {
      while (((attempt < 6) && !done) && !AiCanStep(creature, attempt, dir, $f0 + 1)) {
        if ((U8[r32(creature + 264) + 20] !== 0) && (U8[$f0 + 1] !== 0)) {
          done = (await CbtActs.AttemptFlee(creature));
        } else {
          attempt = (attempt + 1) & 255;
        }
      }
      if (done) {
        U8[r32(creature + 264) + 6] = 0;
        U8[r32(creature + 264) + 20] = 0;
        done = CharHlp.EndActions(creature);
      } else {
        if (attempt < 6) {
          U8[$f0] = (dir + U8[U8[r32(creature + 264) + 21] * 5 + attempt + 258120]) % 8;
        } else {
          U8[$f0] = dir;
        }
        if ((attempt === 6) || (U8[258156] === ((U8[$f0] + 4) % 8))) {
          U8[258157] = U8[258157] + 1;
          U8[r32(creature + 264) + 21] = (U8[r32(creature + 264) + 21] % 6) + 1;
          if (U8[258157] > 1) {
            w32(r32(creature + 264) + 10, 0);
            if (U8[258157] > 2) {
              U8[r32(creature + 264) + 6] = 0;
              done = true;
            } else if (!(await CbtActs.AcquireTarget(creature, 255, 1, 0))) {
              done = (await FinishRound(creature));
            }
          }
        }
        if (attempt < 6) {
          U8[258156] = U8[$f0];
        } else {
          done = true;
        }
      }
    }
    if (!done) {
      (await CbtMap.SetCreatureFacing(creature, U8[$f0], 0, 0));
      done = (await CbtActs.StepCreature(creature, U8[r32(creature + 264) + 9]));
    }
  } else {
    done = (await FinishRound(creature));
  }
  S.sp = $sp;
}

export function $init() {
  U8[258158] = false ? 1 : 0;
}
