// Generated from src/cbtacts.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as C_TERR from './c_terr';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as MenuCore from './menucore';
import * as Magic from './magic';
import * as C_EFFECT from './c_effect';
import * as C_EQUIP from './c_equip';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_STATUS from './c_status';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_SOUND from './c_sound';
import * as C_SPELL from './c_spell';
import * as C_SPRITE from './c_sprite';
import * as Border from './border';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as FxEngine from './fxengine';
import * as Pathing from './pathing';
import * as SoundDrv from './sounddrv';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as AbilAdj from './abiladj';
import * as Dice from './dice';
import * as Blit from './blit';
import * as ClassCal from './classcal';
import * as Bestiary from './bestiary';
import * as CbtLog from './cbtlog';
import * as C_BEAST from './c_beast';
import * as Party from './party';
import * as ViewChar from './viewchar';
import * as C_MSG from './c_msg';
import * as CbtMini from './cbtmini';

export const MAX_THROWN = 24;
export const RULE_NONE = 0;
export const RULE_SLEEP = 1;

export const $at = { suppressTargeting: 247481, seenCasting: 247482, hitsMade: 247514, hostileHpPct: 247516, doneRoundFlag: 247517, thrownCount: 247518, thrown: 247519, attacksMade: 247715, aimSpell: 247717, areaRules: 247718 };

export async function BeginRound(creature: number) {
  {
    const $w1 = r32(creature + 264);
    U8[$w1] = 0;
    U8[$w1 + 1] = 1;
    U8[$w1 + 2] = 1;
    U8[$w1 + 8] = 0;
    U8[$w1 + 4] = 2;
    (await RecalcAttacksLeft(creature));
    U8[144899] = U8[creature + 162];
    U8[144902] = 0;
    (await FxEngine.TriggerEffectsWithCondition(18, creature));
    U8[creature + 276] = AttacksFromRate(U8[144899]);
    U8[$w1 + 5] = U8[creature + 107];
    if (U8[creature + 269] !== 0) {
      U8[$w1 + 3] = Dice.RollDice(1, 6) + AbilAdj.DexMissileAdjust(creature);
      if (I8[$w1 + 3] < 1) {
        U8[$w1 + 3] = 1;
      }
      if ((((I8[creature + 270] + 1) & (r16(r32(141151) + 1430) << 16 >> 16)) & 255) !== 0) {
        U8[$w1 + 3] = I8[$w1 + 3] - 6;
      }
      if ((I8[$w1 + 3] < 0) || (I8[$w1 + 3] > 20)) {
        U8[$w1 + 3] = 0;
      }
    } else {
      U8[$w1 + 3] = 0;
    }
  }
  U8[r32(creature + 264) + 6] = (await CalcCreatureMovement(creature));
}

export async function CalcCreatureMovement(creature: number) {
  let m: number = 0, $r0: number = 0;
  m = U8[creature + 284];
  if (I8[creature + 270] === 0) {
    m = (m + r16(r32(141151) + 1764)) & 255;
  }
  U8[144902] = 1;
  if ((m < 1) || (m > 96)) {
    m = 1;
  }
  U8[144899] = m * 2;
  (await FxEngine.TriggerEffectsWithCondition(18, creature));
  U8[144902] = 0;
  $r0 = U8[144899];
  return $r0;
}

export async function CombatMoveCreature(creature: number, dir: number) {
  let cost: number = 0, slot: number = 0, nx: number = 0, ny: number = 0, x: number = 0, y: number = 0;
  if ((dir & 1) !== 0) {
    cost = 3;
  } else {
    cost = 2;
  }
  if (cost > U8[r32(creature + 264) + 6]) {
    U8[r32(creature + 264) + 6] = 0;
    return;
  }
  let $t1;
  $t1 = r32(creature + 264) + 6, U8[$t1] = U8[$t1] - cost;
  slot = CbtMap.CombatSlot(creature) & 255;
  if (slot === 0) {
    U8[r32(creature + 264) + 6] = 0;
    return;
  }
  x = I8[slot * 4 + 144004];
  y = I8[slot * 4 + 144005];
  nx = (x + I8[dir + 132927]) << 24 >> 24;
  ny = (y + I8[dir + 132936]) << 24 >> 24;
  cost = 1;
  if (U8[creature + 271] !== 0) {
    cost = 3;
    if (!CbtMap.ViewCoordsValid(nx - I8[r32(144641) + 2], ny - I8[r32(144641) + 3])) {
      (await CbtMap.ScrollView(x, y, 2, 8));
    }
  }
  (await CbtMap.UpdateCombatMapTile(0, 0, slot));
  U8[slot * 4 + 144004] = nx;
  U8[slot * 4 + 144005] = ny;
  CbtMap.BuildArenaArrays();
  (await CbtMap.ScrollView(nx, ny, cost, 8));
  ResetFlanking(creature);
  (await SoundDrv.SoundEffect(r16(132907), 1));
  (await GuardersAttack(creature));
  if ((U8[creature + 269] === 0) || CharHlp.IsHelpless(creature)) {
    U8[r32(creature + 264) + 6] = 0;
  }
}

export async function AttacksOfOpportunity(creature: number, dir: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 18);
  let still: boolean = false, attacked: boolean = false, slot: number = 0, cntBefore: number = 0, cntAfter: number = 0, j: number = 0, i: number = 0, k: number = 0, phase: number = 0, a: number = 0, p: number = 0, savedOther: number = 0, savedPhase: number = 0, savedInit: number = 0, savedSpell: number = 0, savedGuard: number = 0, savedMove: number = 0, savedMade: number = 0, savedSweep: number = 0;
  rt.fill($f0, 12, 0);
  slot = CbtMap.CombatSlot(creature) & 255;
  if (slot === 0) {
    { S.sp = $sp; return; }
  }
  cntBefore = CbtMap.CountTargets(creature, 1) & 255;
  if (cntBefore === 0) {
    { S.sp = $sp; return; }
  }
  for (let $i1 = 1, $e1 = cntBefore; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + i - 1] = U8[i + 146459];
  }
  let $t2;
  $t2 = slot * 4 + 144004, U8[$t2] = I8[$t2] + I8[dir + 132927];
  let $t3;
  $t3 = slot * 4 + 144005, U8[$t3] = I8[$t3] + I8[dir + 132936];
  cntAfter = CbtMap.CountTargets(creature, 1) & 255;
  let $t4;
  $t4 = slot * 4 + 144004, U8[$t4] = I8[$t4] - I8[dir + 132927];
  let $t5;
  $t5 = slot * 4 + 144005, U8[$t5] = I8[$t5] - I8[dir + 132936];
  for (let $i6 = 1, $e6 = cntBefore; $i6 <= $e6; $i6++) {
    i = $i6;
    still = false;
    for (let $i7 = 1, $e7 = cntAfter; $i7 <= $e7; $i7++) {
      j = $i7;
      if (U8[j + 146459] === U8[$f0 + i - 1]) {
        still = true;
      }
    }
    if (still) {
      U8[$f0 + i - 1] = 0;
    }
  }
  for (let $i8 = 1, $e8 = cntBefore; $i8 <= $e8; $i8++) {
    i = $i8;
    if (U8[$f0 + i - 1] > 0) {
      if (U8[creature + 269] !== 0) {
        attacked = false;
        p = r32(U8[$f0 + i - 1] * 4 + 144292);
        if (!CharHlp.IsHelpless(p)) {
          if ((await CanTarget(p, creature, true))) {
            if (!CharHlp.HasEffect(p, 75, $f0 + 12)) {
              if (!CharHlp.HasEffect(p, 74, $f0 + 12)) {
                for (let $i9 = U8[r32(p + 264) + 9] + 6, $e9 = U8[r32(p + 264) + 9] + 10; $i9 <= $e9; $i9++) {
                  a = $i9;
                  if (!attacked) {
                    if (((I8[r32(p + 264) + 3] > 0) || (U8[r32(p + 264) + 15] === 0)) || Pathing.IsDirToward(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), a % 8)) {
                      phase = 1;
                      if (U8[p + 161] === 0) {
                        phase = 2;
                      }
                      for (let $i10 = 1; $i10 <= 2; $i10++) {
                        k = $i10;
                        if (U8[p + k + 274] > 0) {
                          phase = k;
                        }
                      }
                      U8[$f0 + 16] = U8[p + 275];
                      U8[$f0 + 17] = U8[p + 276];
                      savedPhase = U8[r32(p + 264) + 4];
                      savedInit = I8[r32(p + 264) + 3];
                      savedSpell = U8[r32(p + 264)];
                      savedGuard = U8[r32(p + 264) + 7];
                      savedMove = U8[r32(p + 264) + 6];
                      savedMade = U8[r32(p + 264) + 8];
                      savedSweep = U8[r32(p + 264) + 5];
                      U8[p + 275] = 0;
                      U8[p + 276] = 0;
                      U8[p + phase + 274] = 1;
                      U8[r32(p + 264) + 4] = phase;
                      savedOther = r32(r32(p + 264) + 10);
                      (await MakeAttack(p, creature, true, 0, 247517));
                      attacked = true;
                      w32(r32(p + 264) + 10, savedOther);
                      if (U8[p + 269] !== 0) {
                        U8[p + 275] = U8[$f0 + 16];
                        U8[p + 276] = U8[$f0 + 17];
                        U8[r32(p + 264) + 4] = savedPhase;
                        U8[r32(p + 264) + 3] = savedInit;
                        U8[r32(p + 264)] = savedSpell;
                        U8[r32(p + 264) + 7] = savedGuard;
                        U8[r32(p + 264) + 6] = savedMove;
                        U8[r32(p + 264) + 8] = savedMade;
                        U8[r32(p + 264) + 5] = savedSweep;
                      }
                      if (U8[creature + 269] !== 0) {
                        (await CharDisp.CombatPrintCreatureInfo(creature));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  S.sp = $sp;
}

export async function StepCreature(creature: number, dir: number) {
  let done: boolean = false, $r0: boolean = false;
  done = false;
  (await AttacksOfOpportunity(creature, dir));
  if ((U8[creature + 269] === 0) || CharHlp.IsHelpless(creature)) {
    done = CharHlp.EndActions(creature);
  } else {
    (await CombatMoveCreature(creature, dir));
    if (U8[creature + 269] === 0) {
      done = CharHlp.EndActions(creature);
    }
    (await FxEngine.ConsiderStinkingCloud(creature));
    if (U8[creature + 269] !== 0) {
      (await Magic.ConsiderCloudkill(creature));
      if (U8[creature + 269] === 0) {
        done = CharHlp.EndActions(creature);
      }
    }
    if (CharHlp.IsHelpless(creature)) {
      done = CharHlp.EndActions(creature);
    }
  }
  $r0 = done;
  return $r0;
}

export function ResetFlanking(creature: number) {
  U8[r32(creature + 264) + 15] = 0;
  U8[r32(creature + 264) + 18] = 0;
}

export function DirOfKey(ch: number) {
  let $r0: number = 0;
  switch (ch) {
    case 72: {
      $r0 = 0;
      break;
    }
    case 73: {
      $r0 = 1;
      break;
    }
    case 77: {
      $r0 = 2;
      break;
    }
    case 81: {
      $r0 = 3;
      break;
    }
    case 80: {
      $r0 = 4;
      break;
    }
    case 79: {
      $r0 = 5;
      break;
    }
    case 75: {
      $r0 = 6;
      break;
    }
    case 71: {
      $r0 = 7;
      break;
    }
    default: {
      $r0 = 8;
    }
  }
  return $r0;
}

export async function AttackWithReadied(att: number, def: number, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  NoteAttackDirection(att, def);
  w32($f0, 0);
  if (CharHlp.HasRangedWeapon(att)) {
    if (CharHlp.FindDamagingRangedWeapon(att, $f0)) {
      if (CharHlp.HasThrowableWeapon(att)) {
        if (CbtMap.CalcDistance(att, def) === 1) {
          w32($f0, 0);
        }
      }
    }
  }
  (await MakeAttack(att, def, false, r32($f0), done));
  S.sp = $sp;
}

export function WeaponDamage(base: number, mult: number, bonus: number) {
  let d: number = 0, $r0: number = 0;
  d = base;
  if (d < 0) {
    d = 0;
  }
  d = ((d * mult) + bonus) | 0;
  if (d > 255) {
    d = 255;
  }
  $r0 = d & 255;
  return $r0;
}

export function AmmoLeft(quantity: number, used: number) {
  let $r0: number = 0;
  if (quantity > used) {
    $r0 = (quantity - used) & 255;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export async function AttemptFlee(creature: number) {
  let ok: boolean = false, enemyMove: number = 0, halfMove: number = 0, $r0: boolean = false;
  ok = false;
  if (CbtMap.CountTargets(creature, 255) === 0) {
    ok = true;
  } else {
    halfMove = Math.trunc((await CalcCreatureMovement(creature)) / 2) & 255;
    enemyMove = (await HighestEnemyMovement(creature)) & 255;
    if (enemyMove < halfMove) {
      ok = true;
    } else if (enemyMove === halfMove) {
      if (Dice.RollDice(1, 2) === 1) {
        ok = true;
      }
    }
  }
  if (ok) {
    (await FxEngine.PutOutOfPlayWithStatus(creature, 3, "Got Away"));
  } else {
    (await CharDisp.PrintActionLine(creature, "Escape is blocked", "is blocked from escaping"));
  }
  $r0 = CharHlp.EndActions(creature);
  return $r0;
}

export async function RecalcAttacksLeft(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let adj: number = 0, saved: number = 0, qty: number = 0, rof: number = 0, ranged: boolean = false;
  ranged = false;
  saved = U8[creature + 275];
  if (CharHlp.HasRangedWeapon(creature) && CharHlp.FindDamagingRangedWeapon(creature, $f0)) {
    ranged = true;
    rof = U8[CharHlp.BaseItem(U8[r32(creature + 204) + 46]) + 5];
    if (rof < 2) {
      rof = 2;
    }
    U8[144899] = rof;
  } else {
    U8[144899] = U8[creature + 161];
  }
  U8[144902] = 0;
  (await FxEngine.TriggerEffectsWithCondition(18, creature));
  adj = AttacksFromRate(U8[144899]) & 255;
  if (ranged && (r32($f0) !== 0)) {
    qty = 1;
    if (U8[r32($f0) + 57] > qty) {
      qty = U8[r32($f0) + 57];
    }
    if (qty < adj) {
      adj = qty;
    }
  }
  if (((U8[r32(creature + 264) + 8] === 0) || (adj < saved)) || (((U8[r32(creature + 264) + 8] !== 0) && (adj < (saved * 2))) && !ranged)) {
    U8[creature + 275] = adj;
  }
  S.sp = $sp;
}

export async function SweepAttack(att: number, def: number) {
  let cnt: number = 0, weak: number = 0, i: number = 0, defIdx: number = 0, p: number = 0, $r0: boolean = false;
  $r0 = false;
  if (U8[att + 275] >= U8[r32(att + 264) + 5]) {
    return $r0;
  }
  if (I8[def + 115] !== 0) {
    return $r0;
  }
  if (CbtMap.CalcDistance(att, def) !== 1) {
    return $r0;
  }
  cnt = CbtMap.CountTargets(att, 1) & 255;
  weak = 0;
  defIdx = 0;
  for (let $i1 = 1, $e1 = cnt; $i1 <= $e1; $i1++) {
    i = $i1;
    p = r32(U8[i + 146459] * 4 + 144292);
    if (p === def) {
      defIdx = i;
    }
    if (I8[p + 115] === 0) {
      weak = (weak + 1) & 255;
    }
  }
  if (defIdx === 0) {
    return $r0;
  }
  if (weak <= U8[att + 275]) {
    return $r0;
  }
  if (weak > U8[r32(att + 264) + 5]) {
    weak = U8[r32(att + 264) + 5];
  }
  (await CharDisp.PrintNameString(att, "sweeps", 10, true));
  p = r32(U8[146460] * 4 + 144292);
  if (p !== def) {
    U8[defIdx + 146459] = U8[146460];
    U8[146460] = CbtMap.CombatSlot(def);
  }
  for (let $i2 = 1, $e2 = cnt; $i2 <= $e2; $i2++) {
    i = $i2;
    if ((weak > 0) && (U8[att + 269] !== 0)) {
      if (I8[r32(U8[i + 146459] * 4 + 144292) + 115] === 0) {
        p = r32(U8[i + 146459] * 4 + 144292);
        NoteAttackDirection(att, p);
        U8[att + 275] = 1;
        (await MakeAttack(att, p, false, 0, 247517));
        weak = (weak - 1) & 255;
      }
    }
  }
  $r0 = true;
  return $r0;
}

export async function CanTarget(creature: number, other: number, allowAlly: boolean) {
  let saved: number = 0, $r0: boolean = false;
  $r0 = false;
  if (other === 0) {
    return $r0;
  }
  if (creature === other) {
    $r0 = true;
    return $r0;
  }
  if (!allowAlly && (I8[other + 270] === I8[creature + 270])) {
    return $r0;
  }
  U8[247481] = 0;
  (await FxEngine.TriggerEffectsWithCondition(1, other));
  if (U8[247481] === 0) {
    saved = r32(r32(creature + 264) + 10);
    w32(r32(creature + 264) + 10, other);
    (await FxEngine.TriggerEffectsWithCondition(0, creature));
    w32(r32(creature + 264) + 10, saved);
  }
  $r0 = U8[247481] === 0;
  return $r0;
}

export async function AimCycles(creature: number, other: number, allies: boolean) {
  let $r0: boolean = false;
  if ((other === 0) || (creature === other)) {
    $r0 = other !== 0;
  } else if (U8[141194] === 0) {
    $r0 = (await CanTarget(creature, other, true));
  } else if (allies) {
    $r0 = (I8[other + 270] === I8[creature + 270]) && (await CanTarget(creature, other, true));
  } else {
    $r0 = (await CanTarget(creature, other, false));
  }
  return $r0;
}

export function NoteThrown(thrower: number, item: number) {
  if ((I8[thrower + 270] !== 0) || (U8[247518] >= 24)) {
    return;
  }
  U8[247518] = U8[247518] + 1;
  w32(U8[247518] * 8 + 247511, item);
  w32(U8[247518] * 8 + 247515, thrower);
}

export async function ReturnThrown(n: number, thrower: number, back: number, name_: number) {
  let item: number = 0, prev: number = 0, p: number = 0, last: number = 0, saved: number = 0, base: number = 0, $r0: boolean = false;
  $r0 = false;
  w32(back, 0);
  wS(name_, 255, "");
  item = r32(n * 8 + 247511);
  w32(thrower, r32(n * 8 + 247515));
  prev = 0;
  if (r32(144890) !== item) {
    prev = r32(144890);
    while ((prev !== 0) && (r32(prev + 42) !== item)) {
      prev = r32(prev + 42);
    }
    if (prev === 0) {
      return $r0;
    }
  }
  p = r32(143753);
  while ((p !== 0) && (p !== r32(thrower))) {
    p = r32(p + 260);
  }
  if ((p === 0) || (I8[r32(thrower) + 270] !== 0)) {
    return $r0;
  }
  if (ViewChar.CannotCarryItem(r32(thrower), item)) {
    return $r0;
  }
  CharHlp.ItemLabel(item, false);
  wS(name_, 255, rS(item));
  last = r32(r32(thrower) + 200);
  while ((last !== 0) && (r32(last + 42) !== 0)) {
    last = r32(last + 42);
  }
  (await CharHlp.AddToInventory(r32(thrower), item));
  w32(back, r32(r32(thrower) + 200));
  while ((r32(back) !== 0) && (r32(r32(back) + 42) !== 0)) {
    w32(back, r32(r32(back) + 42));
  }
  if (r32(back) === last) {
    w32(back, 0);
  }
  if (prev === 0) {
    w32(144890, r32(item + 42));
  } else {
    w32(prev + 42, r32(item + 42));
  }
  if (r32(143761) === item) {
    w32(143761, r32(item + 42));
  }
  w32(item + 42, 0);
  rt.freeMem(item);
  CharHlp.RecalcStats(r32(thrower));
  if (r32(back) !== 0) {
    U8[r32(back) + 52] = 0;
    base = CharHlp.BaseItem(U8[r32(back) + 46]);
    if ((((r32(r32(thrower) + 204) === 0) && (U8[base] === 0)) && ((U8[r32(thrower) + 256] + U8[base + 1]) <= 2)) && ((U8[base + 13] & U8[r32(thrower) + 176]) !== 0)) {
      saved = r32(143749);
      w32(143749, r32(thrower));
      (await FxEngine.ToggleReadyItem(r32(back)));
      w32(143749, saved);
      CharHlp.RecalcStats(r32(thrower));
    }
  }
  $r0 = true;
  return $r0;
}

export async function CombatTurnUndead(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let roll: number = 0, attempts: number = 0, destroys: number = 0, turnVal: number = 0, any: boolean = false, stop: boolean = false, lvl: number = 0;
  (await CharDisp.PrintNameString(creature, "turns undead...", 10, false));
  TextRend.ClearBottomLine();
  (await TextRend.PauseOnly());
  any = false;
  stop = false;
  U8[r32(creature + 264) + 17] = 1;
  destroys = 6;
  attempts = Dice.RollDice(1, 12) & 255;
  roll = Dice.RollDice(1, 20) & 255;
  lvl = ClassCal.TurnLevel(creature) << 24 >> 24;
  while ((FindTurnUndeadTarget(creature, $f0) && (attempts > 0)) && (stop === false)) {
    turnVal = ClassCal.TurnValue(I8[r32($f0) + 118], lvl) << 24 >> 24;
    if (roll >= Math.abs(turnVal)) {
      any = true;
      (await CbtMap.DisplayMapViewCentered(r32($f0), 3, false));
      (await CharDisp.CombatPrintCreatureInfo(r32($f0)));
      if (turnVal > 0) {
        U8[r32(r32($f0) + 264) + 16] = 1;
        (await CharDisp.PrintNameStringAnim(r32($f0), true, "is turned"));
      } else {
        (await CharDisp.PrintNameString(r32($f0), "Is destroyed", 10, false));
        (await CbtMap.CreatureDowned(r32($f0)));
        U8[r32($f0) + 268] = 8;
        U8[r32($f0) + 269] = 0;
      }
      if (destroys > 0) {
        destroys = (destroys - 1) & 255;
      }
      attempts = (attempts - 1) & 255;
      if (attempts === 0) {
        if (destroys > 0) {
          if (turnVal < 0) {
            attempts = (attempts + 1) & 255;
          }
        }
      }
      (await CharDisp.ClearMessageWindow());
    } else {
      stop = true;
    }
  }
  if (!any) {
    (await CharDisp.PrintBottomLine("Nothing Happens..."));
  }
  CharHlp.CountTeams();
  U8[247517] = CharHlp.EndActions(creature) ? 1 : 0;
  (await CharDisp.ClearMessageWindow());
  S.sp = $sp;
}

export function FindTurnUndeadTarget(creature: number, tgt: number) {
  let cnt: number = 0, i: number = 0, best: number = 0, p: number = 0, $r0: boolean = false;
  best = 13;
  w32(tgt, 0);
  cnt = CbtMap.CountTargets(creature, 255) & 255;
  $r0 = false;
  for (let $i1 = 1, $e1 = cnt; $i1 <= $e1; $i1++) {
    i = $i1;
    p = r32(U8[i + 146459] * 4 + 144292);
    if (((U8[r32(p + 264) + 16] === 0) && (I8[p + 118] > 0)) && (I8[p + 118] < best)) {
      best = I8[p + 118];
      w32(tgt, p);
      $r0 = true;
    }
  }
  return $r0;
}

export function NoteAttackDirection(att: number, def: number) {
  let rel: number = 0, d: number = 0;
  let $t1;
  $t1 = r32(def + 264) + 15, U8[$t1] = U8[$t1] + 1;
  d = DirTowardTarget(def, att) & 255;
  rel = (((d - U8[r32(def + 264) + 9]) + 8) % 8) & 255;
  if (rel > 4) {
    rel = (8 - rel) & 255;
  }
  U8[r32(def + 264) + 18] = (U8[r32(def + 264) + 18] + rel) % 8;
}

export async function MakeAttack(att: number, def: number, fromBehind: boolean, weapon: number, done: number) {
  let item: number = 0, savedCur: number = 0, dir: number = 0, ranged: boolean = false;
  ranged = weapon !== 0;
  if ((U8[r32(def + 264) + 15] < 3) && !fromBehind) {
    dir = DirTowardTarget(def, att) & 255;
    if (CbtMap.CombatIconVisible(def, 0)) {
      (await CbtMap.SetCreatureFacing(def, dir, 0, 0));
    } else {
      U8[r32(def + 264) + 9] = dir;
    }
  }
  dir = DirTowardTarget(att, def) & 255;
  (await CharDisp.CombatPrintCreatureInfo(att));
  (await CbtMap.SetCreatureFacing(att, dir, 1, 0));
  w32(r32(att + 264) + 10, def);
  (await Crt.Delay(100));
  if (weapon !== 0) {
    (await AnimateMissile(att, def, weapon));
  }
  if ((r32(att + 204) !== 0) && (U8[r32(att + 204) + 46] === 47)) {
    (await AnimateMissile(att, def, r32(att + 204)));
    ranged = true;
  }
  U8[done] = true ? 1 : 0;
  if ((U8[att + 275] > 0) || (U8[att + 276] > 0)) {
    savedCur = r32(143749);
    w32(143749, att);
    (await RollAttacks(att, def, fromBehind, ranged, done));
    if (weapon !== 0) {
      U8[weapon + 57] = AmmoLeft(U8[weapon + 57], U8[247715]);
      if (U8[weapon + 57] === 0) {
        if (CharHlp.HasThrowableWeapon(att) && (U8[weapon + 62] !== 137)) {
          CharHlp.PrependItemCopy(144890, weapon);
          item = r32(144890);
          U8[item + 52] = 0;
          (await CharHlp.RemoveItem(att, weapon));
          w32(143761, item);
          NoteThrown(att, item);
        } else {
          (await CharHlp.RemoveItem(att, weapon));
        }
      }
    }
    CharHlp.RecalcStats(att);
    w32(143749, savedCur);
  }
  if ((U8[done] !== 0)) {
    U8[done] = CharHlp.EndActions(att) ? 1 : 0;
  }
  if (CbtMap.CombatIconVisible(att, 0)) {
    (await CbtMap.SetCreatureFacing(att, U8[r32(att + 264) + 9], 1, 1));
    (await CbtMap.SetCreatureFacing(att, U8[r32(att + 264) + 9], 0, 0));
  }
}

export function FindCureTarget(creature: number, tgt: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let best: number = 0, nx: number = 0, ny: number = 0, downIdx: number = 0, bestHp: number = 0, d: number = 0, j: number = 0, $r0: boolean = false;
  best = 0;
  downIdx = 0;
  bestHp = 255;
  for (let $i1 = 0; $i1 <= 8; $i1++) {
    d = $i1;
    nx = (CbtMap.CombatCellX(creature) + I8[d + 132927]) << 24 >> 24;
    ny = (CbtMap.CombatCellY(creature) + I8[d + 132936]) << 24 >> 24;
    CbtMap.GetArenaContents(nx, ny, $f0, $f0 + 1);
    if (U8[$f0] > 0) {
      w32(tgt, r32(U8[$f0] * 4 + 144292));
      if (I8[r32(tgt) + 270] === I8[creature + 270]) {
        if (U8[r32(tgt) + 283] < U8[r32(tgt) + 50]) {
          if ((U8[r32(tgt) + 283] < bestHp) || ((r32(tgt) === creature) && (U8[r32(tgt) + 283] < Math.trunc(U8[r32(tgt) + 50] / 2)))) {
            best = r32(tgt);
            bestHp = U8[r32(tgt) + 283];
          }
        }
      }
    } else if (U8[$f0 + 1] === 31) {
      for (let $i2 = 1, $e2 = U8[144640]; $i2 <= $e2; $i2++) {
        j = $i2;
        if (r32(j * 7 + 144577) !== 0) {
          let $t3;
          if (!($t3 = U8[r32(j * 7 + 144577) + 268], $t3 === 6 || $t3 === 7 || $t3 === 8)) {
            if (I8[j * 7 + 144581] === nx) {
              if (I8[j * 7 + 144582] === ny) {
                if (I8[r32(j * 7 + 144577) + 270] === I8[creature + 270]) {
                  downIdx = j;
                }
              }
            }
          }
        }
      }
    }
  }
  if ((bestHp < 8) || (downIdx === 0)) {
    w32(tgt, best);
  } else {
    w32(tgt, r32(downIdx * 7 + 144577));
  }
  if (r32(tgt) !== 0) {
    $r0 = true;
  } else {
    $r0 = false;
  }
  S.sp = $sp;
  return $r0;
}

export function SpellCanAffect(spell: number, target: number, caster: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let eff: number = 0, i: number = 0, ok: boolean = false, $r0: boolean = false;
  $r0 = false;
  if ((target === 0) || (U8[target + 269] === 0)) {
    { S.sp = $sp; return $r0; }
  }
  eff = U8[spell * 16 + 136516];
  if ((eff !== 0) && CharHlp.HasEffect(target, eff, $f0)) {
    { S.sp = $sp; return $r0; }
  }
  if (CharHlp.IsHelpless(target)) {
    for (let $i1 = 1; $i1 <= 4; $i1++) {
      i = $i1;
      if (eff === U8[i + 133142]) {
        { S.sp = $sp; return $r0; }
      }
    }
  }
  ok = true;
  switch (spell) {
    case 10: {
      ok = CharHlp.IsPerson(target) && !PartyKnows(caster, target, 12);
      break;
    }
    case 23: case 49: {
      ok = CharHlp.IsPerson(target) && !PartyKnows(caster, target, 11);
      break;
    }
    case 21: {
      U8[$f0 + 4] = 16;
      ok = ((U8[target + 159] !== 4) && CharHlp.SleepTakes(target, $f0 + 4)) && !PartyKnows(caster, target, 12);
      break;
    }
    case 27: {
      ok = rS(target) === C_SPELL.SNAKE_NAME;
      break;
    }
    case 34: {
      ok = !FxEngine.CloudSpares(target) && !InCloud(target, 30);
      break;
    }
    case 91: {
      ok = !FxEngine.CloudkillProof(target) && !InCloud(target, 66);
      break;
    }
    case 40: {
      ok = U8[target + 159] !== 4;
      break;
    }
    case 25: {
      ok = rt.inM(247482, 0, 32, CbtMap.CombatSlot(target));
      break;
    }
    case 94: {
      ok = !PartyKnows(caster, target, 11);
      break;
    }
    case 81: {
      ok = !PartyKnows(caster, target, 12);
      break;
    }
    case 76: {
      ok = U8[target + 159] !== 4;
      break;
    }
    case 70: {
      ok = I8[target + 115] < 6;
      break;
    }
    case 68: {
      ok = !PartyKnows(caster, target, 10);
      break;
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function CloudCatch(spell: number, x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 13);
  let caught: number = 0, k: number = 0, j: number = 0, first: boolean = false, p: number = 0, $r0: number = 0;
  $r0 = 0;
  caught = 0;
  if (CharHlp.SpellArea(spell, $f0 + 10) !== 4) {
    { S.sp = $sp; return $r0; }
  }
  for (let $i1 = 1, $e1 = U8[$f0 + 10] * U8[$f0 + 10]; $i1 <= $e1; $i1++) {
    k = $i1;
    CbtMap.CloudCell(U8[$f0 + 10], k, x, y, $f0 + 11, $f0 + 12);
    CbtMap.GetArenaContents(I8[$f0 + 11], I8[$f0 + 12], $f0 + k - 1, $f0 + 9);
    if ((U8[$f0 + 9] === 0) || (U8[U8[$f0 + 9] * 3 + 132942] >= 255)) {
      U8[$f0 + k - 1] = 0;
    }
    if (U8[$f0 + k - 1] > 0) {
      p = r32(U8[$f0 + k - 1] * 4 + 144292);
      if (CharHlp.Team(p) !== CharHlp.EnemyTeam(r32(143749))) {
        { S.sp = $sp; return $r0; }
      }
      first = true;
      for (let $i2 = 1, $e2 = k - 1; $i2 <= $e2; $i2++) {
        j = $i2;
        if (U8[$f0 + j - 1] === U8[$f0 + k - 1]) {
          first = false;
        }
      }
      if (first && SpellCanAffect(spell, p, r32(143749))) {
        caught = (caught + 1) & 255;
      }
    }
  }
  $r0 = caught;
  S.sp = $sp;
  return $r0;
}

export async function BestAim(spell: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 74);
  let n: number = 0, i: number = 0, j: number = 0, caught: number = 0, ties: number = 0, radius: number = 0, p: number = 0, best: number = 0, taken: boolean = false, $r0: number = 0;
  U8[count] = 0;
  best = 0;
  ties = 0;
  n = CbtMap.CountTargets(r32(143749), CharHlp.CalcSpellRange(spell)) & 255;
  for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + i - 1] = U8[i + 146459];
  }
  radius = U8[spell * 16 + 136521];
  if (CharHlp.SpellArea(spell, $f0 + 72) !== 1) {
    U8[$f0 + 72] = 1;
  }
  for (let $i2 = 1, $e2 = n; $i2 <= $e2; $i2++) {
    i = $i2;
    p = r32(U8[$f0 + i - 1] * 4 + 144292);
    if ((U8[p + 269] !== 0) && (await CanTarget(r32(143749), p, true))) {
      if (radius > 0) {
        if (!AreaHitsNonEnemy(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), radius)) {
          caught = 0;
          if (CharHlp.SpellArea(spell, $f0 + 73) === 4) {
            caught = CloudCatch(spell, CbtMap.CombatCellX(p), CbtMap.CombatCellY(p)) & 255;
          } else {
            for (let $i3 = 1, $e3 = U8[144645]; $i3 <= $e3; $i3++) {
              j = $i3;
              if (SpellCanAffect(spell, r32(U8[j * 3 + 144643] * 4 + 144292), r32(143749))) {
                caught = (caught + 1) & 255;
              }
            }
          }
          if (caught > U8[count]) {
            U8[count] = caught;
            best = p;
            ties = 1;
          } else if ((caught === U8[count]) && (caught > 0)) {
            ties = (ties + 1) & 255;
            if (Dice.RollDice(1, ties) === 1) {
              best = p;
            }
          }
        }
      } else if (SpellCanAffect(spell, p, r32(143749))) {
        if (U8[count] < U8[$f0 + 72]) {
          U8[count] = U8[count] + 1;
        }
        taken = false;
        for (let $i4 = 1; $i4 <= 72; $i4++) {
          j = $i4;
          if (r32(j * 4 + 146157) === p) {
            taken = true;
          }
        }
        if (!taken) {
          ties = (ties + 1) & 255;
          if (Dice.RollDice(1, ties) === 1) {
            best = p;
          }
        }
      }
    }
  }
  if (best === 0) {
    U8[count] = 0;
  }
  $r0 = best;
  S.sp = $sp;
  return $r0;
}

export async function SelectCombatTargets(spell: number, b: boolean, cast: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let remaining: number = 0, k: number = 0, j: number = 0, dup: boolean = false, kind: number = 0, picked: boolean = false, pool: number = 0, spent: number = 0, stop: boolean = false;
  U8[cast] = true ? 1 : 0;
  U8[146160] = 0;
  rt.fill(146161, 288, 0);
  U8[144904] = 0;
  U8[240657] = CbtMap.CombatCellX(r32(143749));
  U8[240658] = CbtMap.CombatCellY(r32(143749));
  kind = CharHlp.SpellArea(spell, $f0 + 7) & 255;
  switch (kind) {
    case 0: {
      w32(146161, r32(143749));
      U8[146160] = 1;
      break;
    }
    case 2: {
      if (!b) {
        if (spell === 60) {
          U8[247717] = spell;
          (await CbtMap.StartSpellPreview(1, spell, 0, 19, true));
        } else {
          (await CbtMap.StartSpellPreview(0, spell, 0, AimMarker(spell), false));
        }
      }
      picked = (await SelectSpellTarget(spell, b, 0, $f0));
      (await CbtMap.StopSpellPreview());
      if (picked) {
        if (r32($f0) !== 0) {
          w32(146161, r32($f0));
          U8[146160] = 1;
        } else {
          Pathing.TargetArea(I8[240657], I8[240658], 0);
          U8[144904] = 1;
        }
      } else {
        U8[cast] = false ? 1 : 0;
      }
      break;
    }
    case 3: case 4: case 5: {
      if (!b) {
        U8[247717] = spell;
        switch (kind) {
          case 5: {
            (await CbtMap.StartSpellPreview(1, spell, 0, 19, true));
            break;
          }
          case 4: {
            (await CbtMap.StartSpellPreview(2, spell, U8[$f0 + 7], 22, true));
            break;
          }
          default: {
            if ((spell === 47) || (spell === 64)) {
              (await CbtMap.StartSpellPreview(0, spell, U8[$f0 + 7], 23, true));
            } else {
              (await CbtMap.StartSpellPreview(0, spell, U8[$f0 + 7], AimMarker(spell), true));
            }
          }
        }
      }
      picked = (await SelectSpellTarget(spell, b, 1, $f0));
      (await CbtMap.StopSpellPreview());
      if (picked) {
        Pathing.TargetArea(I8[240657], I8[240658], U8[spell * 16 + 136512] & 7);
        U8[144904] = 1;
      } else {
        U8[cast] = false ? 1 : 0;
      }
      break;
    }
    case 6: {
      if (!b) {
        U8[247717] = spell;
        (await CbtMap.StartSpellPreview(1, spell, 0, AimMarker(spell), true));
      }
      picked = (await SelectSpellTarget(spell, b, 1, $f0));
      (await CbtMap.StopSpellPreview());
      if (picked) {
        U8[144904] = 1;
      } else {
        U8[cast] = false ? 1 : 0;
      }
      break;
    }
    case 7: {
      if (spell === 79) {
        pool = CharHlp.GetCasterLevel(spell) & 255;
      } else {
        pool = Dice.RollDice(2, 4) & 255;
      }
      spent = 0;
      k = 0;
      stop = false;
      do {
        if (!b) {
          (await CbtMap.StartSpellPreview(0, spell, 0, AimMarker(spell), false));
        }
        picked = (await SelectSpellTarget(spell, b, 0, $f0));
        (await CbtMap.StopSpellPreview());
        if (picked && (r32($f0) !== 0)) {
          dup = false;
          for (let $i2 = 1, $e2 = k; $i2 <= $e2; $i2++) {
            j = $i2;
            if (r32(j * 4 + 146157) === r32($f0)) {
              dup = true;
            }
          }
          if (!dup) {
            spent = (spent + CharHlp.PoolCost(spell, r32($f0))) & 255;
            if ((k > 0) && (spent > pool)) {
              stop = true;
            } else {
              k = (k + 1) & 255;
              w32(k * 4 + 146157, r32($f0));
            }
          } else if (!b) {
            (await CharDisp.PrintBottomLine("Already been targeted"));
          } else {
            pool = (pool - 1) & 255;
          }
          (await CbtMap.RedrawArenaCell(CbtMap.CombatCellX(r32($f0)), CbtMap.CombatCellY(r32($f0))));
        } else {
          stop = true;
        }
      } while (!((stop || (pool === 0)) || (k === 72)));
      U8[146160] = k;
      if (k === 0) {
        U8[cast] = false ? 1 : 0;
      }
      break;
    }
    default: {
      remaining = U8[$f0 + 7];
      k = 0;
      while (remaining > 0) {
        if (!b) {
          (await CbtMap.StartSpellPreview(0, spell, 0, AimMarker(spell), false));
        }
        picked = (await SelectSpellTarget(spell, b, 0, $f0));
        (await CbtMap.StopSpellPreview());
        if (picked) {
          dup = false;
          for (let $i4 = 1, $e4 = k; $i4 <= $e4; $i4++) {
            j = $i4;
            if (r32(j * 4 + 146157) === r32($f0)) {
              dup = true;
            }
          }
          if (!dup) {
            k = (k + 1) & 255;
            w32(k * 4 + 146157, r32($f0));
            remaining = (remaining - 1) & 255;
          } else if (!b) {
            (await CharDisp.PrintBottomLine("Already been targeted"));
          } else {
            remaining = (remaining - 1) & 255;
          }
          (await CbtMap.RedrawArenaCell(CbtMap.CombatCellX(r32(k * 4 + 146157)), CbtMap.CombatCellY(r32(k * 4 + 146157))));
        } else {
          remaining = (remaining - 1) & 255;
        }
      }
      U8[146160] = k;
      if (k === 0) {
        U8[cast] = false ? 1 : 0;
      }
    }
  }
  S.sp = $sp;
}

export async function CastSpellCombat(spell: number, ai: number, cast: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let spellId: number = 0, castTime: number = 0, caster: number = 0;
  caster = r32(143749);
  U8[$f0 + 2] = true ? 1 : 0;
  w16($f0, -1);
  U8[cast] = false ? 1 : 0;
  spellId = spell;
  w32($f0 + 3, 0);
  if (spellId === 0) {
    spellId = (await Magic.CastSpellMenu($f0, $f0 + 2, $f0 + 3)) & 255;
    if (spellId === 0) {
      w32($f0 + 3, 0);
    }
  }
  if (spellId > 0) {
    if (U8[spellId * 16 + 136517] === 0) {
      (await CharDisp.PrintBottomLine("Camp Only Spell"));
      spellId = 0;
      w32($f0 + 3, 0);
    } else {
      rt.wSet(247482, 0, 32, rt.sUnion(rt.rSet(247482, 0, 32), rt.setR(CbtMap.CombatSlot(caster), CbtMap.CombatSlot(caster))));
    }
  }
  if (r32($f0 + 3) !== 0) {
    (await Magic.UseItemSpell(r32($f0 + 3), spellId, true, cast));
    CharHlp.RecalcStats(caster);
    (await RecalcAttacksLeft(caster));
    if (!(U8[cast] !== 0)) {
      (await CharDisp.DisplayCombatInterface());
    }
    { S.sp = $sp; return; }
  }
  if (ai === 0) {
    (await CharDisp.DisplayCombatInterface());
    (await CbtMap.DisplayMapViewCentered(caster, 3, true));
    (await CharDisp.CombatPrintCreatureInfo(caster));
  }
  if (spellId > 0) {
    castTime = Math.trunc(U8[spellId * 16 + 136518] / 3);
    if (castTime === 0) {
      (await Magic.CastSpell(spellId, (ai !== 0), true, cast));
      U8[cast] = CharHlp.EndActions(caster) ? 1 : 0;
    } else {
      U8[cast] = true ? 1 : 0;
      (await CharDisp.PrintNameString(caster, "Begins Casting", 10, true));
      U8[r32(caster + 264)] = spellId;
      if (I8[r32(caster + 264) + 3] > castTime) {
        let $t1;
        $t1 = r32(caster + 264) + 3, U8[$t1] = I8[$t1] - castTime;
      } else {
        U8[r32(caster + 264) + 3] = 1;
      }
    }
  }
  S.sp = $sp;
}

export async function CheckAttackAlly(att: number, def: number) {
  let p: number = 0, $r0: boolean = false;
  if ((CharHlp.EnemyTeam(def) === CharHlp.Team(att)) || (U8[att + 271] !== 0)) {
    $r0 = true;
  } else if ((await MenuCore.YesNoMenu("Attack Ally: ", 13, 10, 15)) !== 89) {
    $r0 = false;
  } else {
    $r0 = true;
    w16(r32(141151) + 1638, 1);
    p = r32(143753);
    while (p !== 0) {
      if ((U8[p + 268] === 0) && CharHlp.IsNpc(p)) {
        U8[p + 270] = 1;
        w32(r32(p + 264) + 10, 0);
      }
      p = r32(p + 260);
    }
    CharHlp.CountTeams();
  }
  return $r0;
}

export async function CombatAimMenu(creature: number, range: number, weaponMode: number, groundOk: number, allies: boolean, done: number, tgt: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 217);
  let effRange: number = 0, tgtCount: number = 0, curIdx: number = 0, skipStep: number = 0, menuStep: number = 0, curX: number = 0, curY: number = 0, nextX: number = 0, nextY: number = 0, p: number = 0, ch: number = 0;
  async function BuildAimTargets(c: number) {
    let i: number = 0;
    Pathing.BuildTargetList(CbtMap.CombatCellX(c), CbtMap.CombatCellY(c), 127, 255, CbtMap.GetIconSize(c), r32(144641));
    tgtCount = 0;
    for (let $i1 = 1, $e1 = U8[144645]; $i1 <= $e1; $i1++) {
      i = $i1;
      if ((await AimCycles(c, r32(U8[i * 3 + 144643] * 4 + 144292), allies))) {
        tgtCount = (tgtCount + 1) & 255;
        mv($f0 + tgtCount * 3 - 3, i * 3 + 144643, 3);
      }
    }
    if (tgtCount === 0) {
      tgtCount = U8[144645];
      for (let $i2 = 1, $e2 = tgtCount; $i2 <= $e2; $i2++) {
        i = $i2;
        mv($f0 + i * 3 - 3, i * 3 + 144643, 3);
      }
    }
    if ((curIdx < 1) || (curIdx > tgtCount)) {
      curIdx = 1;
    }
  }
  function AimStart(c: number) {
    let i: number = 0, other: number = 0, current: number = 0, nearest: number = 0, own: number = 0, $r1: number = 0;
    current = 0;
    nearest = 0;
    own = 0;
    for (let $i3 = tgtCount; $i3 >= 1; $i3--) {
      i = $i3;
      other = r32(U8[$f0 + i * 3 - 3] * 4 + 144292);
      if (other === c) {
        own = i;
      } else if (other !== 0) {
        if ((I8[other + 270] === I8[c + 270]) === allies) {
          nearest = i;
          if (other === r32(r32(c + 264) + 10)) {
            current = i;
          }
        }
      }
    }
    if (current === 0) {
      if (allies) {
        current = own;
      } else {
        current = nearest;
      }
    }
    if (current === 0) {
      current = 1;
    }
    $r1 = current;
    return $r1;
  }
  async function AdvanceAimTarget(step: number, animate: boolean) {
    let $r1: number = 0;
    if (animate) {
      curX = I8[U8[$f0 + curIdx * 3 - 3] * 4 + 144004];
      curY = I8[U8[$f0 + curIdx * 3 - 3] * 4 + 144005];
    } else {
      (await CbtMap.RedrawArenaCell(curX, curY));
    }
    curIdx = (curIdx + step) & 255;
    if (curIdx === 0) {
      curIdx = tgtCount;
    }
    if (curIdx > tgtCount) {
      curIdx = 1;
    }
    $r1 = r32(U8[$f0 + curIdx * 3 - 3] * 4 + 144292);
    nextX = I8[U8[$f0 + curIdx * 3 - 3] * 4 + 144004];
    nextY = I8[U8[$f0 + curIdx * 3 - 3] * 4 + 144005];
    if (animate) {
      (await CharDisp.CombatAnimateMovingIcon(curX, curY, nextX, nextY, 1, 0));
      curX = nextX;
      curY = nextY;
    }
    return $r1;
  }
  (await CharDisp.CopyIconFacing(25, 0, 0, false));
  rt.fill(tgt, 7, 0);
  U8[done] = false ? 1 : 0;
  effRange = range;
  if (effRange === 255) {
    if (r32(creature + 204) !== 0) {
      effRange = (U8[CharHlp.BaseItem(U8[r32(creature + 204) + 46]) + 12] - 1) & 255;
    } else {
      effRange = 1;
    }
  }
  if ((effRange === 0) || (effRange === 255)) {
    effRange = 1;
  }
  curIdx = 1;
  (await BuildAimTargets(creature));
  curIdx = AimStart(creature) & 255;
  skipStep = 0;
  p = (await AdvanceAimTarget(skipStep, true));
  skipStep = 1;
  menuStep = 0;
  ch = 32;
  while (((U8[done] !== 0) === false) && !(ch === 0 || ch === 69)) {
    if (!(await CanTarget(creature, p, true))) {
      p = (await AdvanceAimTarget(skipStep, false));
    } else {
      ch = (await AimTargetMenu(creature, p, effRange, weaponMode, $f0 + 216)) & 255;
      if (U8[$f0 + 216] !== 8) {
        ch = 77;
      }
      switch (ch) {
        case 78: {
          skipStep = 1;
          menuStep = 1;
          break;
        }
        case 80: {
          skipStep = -1;
          menuStep = -1;
          break;
        }
        case 77: {
          (await ManualAimCursor(creature, p, effRange, weaponMode, groundOk, U8[$f0 + 216], done, tgt));
          (await CharDisp.CopyIconFacing(25, 0, 0, false));
          (await BuildAimTargets(creature));
          menuStep = 0;
          break;
        }
        case 84: {
          (await ConfirmAttackTarget(creature, p, weaponMode, done, tgt));
          (await CharDisp.CopyIconFacing(25, 0, 0, false));
          (await BuildAimTargets(creature));
          menuStep = 0;
          break;
        }
        case 67: {
          (await CbtMap.ScrollView(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), 0, 8));
          menuStep = 0;
          break;
        }
      }
      (await CbtMap.RedrawArenaCell(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p)));
      p = (await AdvanceAimTarget(menuStep, ((U8[done] !== 0) === false) && !(ch === 0 || ch === 69)));
    }
  }
  if (weaponMode !== 0) {
    (await Border.ClearBox(0, 23, 39, 23));
  }
  S.sp = $sp;
}

export function DirTowardTarget(creature: number, other: number) {
  let $r0: number = 0;
  $r0 = Pathing.DirToward(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), CbtMap.CombatCellX(other), CbtMap.CombatCellY(other)) & 255;
  return $r0;
}

export function UpdateHostileHpPercent() {
  let maxSum: number = 0, curSum: number = 0, p: number = 0;
  maxSum = 0;
  curSum = 0;
  p = r32(143753);
  while (p !== 0) {
    if (I8[p + 270] === 1) {
      if (U8[p + 269] !== 0) {
        curSum = (curSum + U8[p + 283]) & 65535;
      }
      maxSum = (maxSum + U8[p + 50]) & 65535;
    }
    p = r32(p + 260);
  }
  if (maxSum > 0) {
    U8[247516] = rt.mul(Math.trunc((curSum * 20) / maxSum), 5);
  }
}

export async function HighestEnemyMovement(creature: number) {
  let best: number = 0, m: number = 0, p: number = 0, $r0: number = 0;
  best = 0;
  p = r32(143753);
  while (p !== 0) {
    if ((CharHlp.EnemyTeam(creature) === CharHlp.Team(p)) && (U8[p + 269] !== 0)) {
      m = Math.trunc((await CalcCreatureMovement(p)) / 2) & 255;
      if (m > best) {
        best = m;
      }
    }
    p = r32(p + 260);
  }
  $r0 = best;
  return $r0;
}

export async function AcquireTarget(creature: number, range: number, relaxed: number, forceNew: number) {
  let cnt: number = 0, tries: number = 0, pick: number = 0, second: boolean = false, found: boolean = false, pass: boolean = false, p: number = 0, $r0: boolean = false;
  pass = false;
  found = false;
  second = false;
  p = r32(r32(creature + 264) + 10);
  if ((forceNew !== 0) || ((p !== 0) && (((I8[p + 270] === I8[creature + 270]) || (U8[p + 269] === 0)) || !(await CanTarget(creature, p, true))))) {
    w32(r32(creature + 264) + 10, 0);
  }
  if (r32(r32(creature + 264) + 10) !== 0) {
    found = true;
  }
  while (!found && !second) {
    second = pass;
    if (pass && (forceNew === 0)) {
      U8[r32(144641) + 6] = 1;
    }
    tries = 20;
    cnt = CbtMap.CountTargets(creature, range) & 255;
    while (((tries > 0) && !found) && (cnt > 0)) {
      tries = (tries - 1) & 255;
      pick = Dice.RollDice(1, cnt) & 255;
      if (U8[pick + 146459] > 0) {
        p = r32(U8[pick + 146459] * 4 + 144292);
        if (((relaxed !== 0) && (U8[r32(144641) + 6] !== 0)) || (await CanTarget(creature, p, true))) {
          found = true;
          w32(r32(creature + 264) + 10, p);
        } else {
          U8[pick + 146459] = 0;
          for (let $i3 = 1, $e3 = cnt; $i3 <= $e3; $i3++) {
            pick = $i3;
            if (U8[pick + 146459] > 0) {
              found = true;
            }
          }
          if (found) {
            found = false;
          } else {
            cnt = 0;
          }
        }
      }
    }
    if (!pass) {
      pass = true;
    }
  }
  U8[r32(144641) + 6] = 0;
  $r0 = found;
  return $r0;
}

export async function AttackClawRake(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  if (U8[247514] === 2) {
    if (U8[r32(r32(creature + 264) + 10) + 269] !== 0) {
      U8[r32(creature + 264) + 4] = 2;
      U8[creature + 276] = 2;
      U8[creature + 278] = 2;
      U8[creature + 280] = 4;
      U8[creature + 275] = 0;
      (await CharDisp.PrintNameString(creature, "Rakes...", 10, true));
      Bestiary.Learn(creature, r32(r32(creature + 264) + 10), 55);
      (await MakeAttack(creature, r32(r32(creature + 264) + 10), false, 0, $f0));
      U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
    }
  }
  S.sp = $sp;
}

export async function BiteAndHold(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  if ((await FxEngine.HoldTarget(creature, p, removed, 74, $f0 + 1)) !== 0) {
    U8[creature + 275] = 1;
    U8[creature + 276] = 0;
    U8[creature + 277] = 3;
    U8[creature + 279] = 4;
    (await MakeAttack(creature, r32(144909), true, 0, $f0));
    U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
    if (U8[r32(144909) + 269] === 0) {
      (await FxEngine.RemoveEffect(creature, 74, p));
    }
  }
  S.sp = $sp;
}

export async function VictoryCheat() {
  let done: boolean = false, p: number = 0, slot: number = 0, $r0: boolean = false;
  $r0 = false;
  if (!(U8[141208] !== 0)) {
    return $r0;
  }
  $r0 = true;
  (await CharDisp.PrintBottomLine("The Gods intervene!"));
  p = r32(143753);
  while (p !== 0) {
    if (I8[p + 270] === 1) {
      U8[p + 269] = 0;
      U8[p + 268] = 6;
      slot = CbtMap.CombatSlot(p) & 255;
      if (slot > 0) {
        U8[slot * 4 + 144007] = 0;
      }
    }
    done = CharHlp.EndActions(p);
    p = r32(p + 260);
  }
  (await CbtMap.ScrollView(CbtMap.CenterX(), CbtMap.CenterY(), 255, 8));
  return $r0;
}

export function AreaHitsNonEnemy(x: number, y: number, radius: number) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  Pathing.BuildAreaList(x, y, radius);
  for (let $i1 = 1, $e1 = U8[144645]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (CharHlp.Team(r32(U8[i * 3 + 144643] * 4 + 144292)) !== CharHlp.EnemyTeam(r32(143749))) {
      $r0 = true;
    }
  }
  return $r0;
}

export async function ReportAreaCatch(caught: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, enemy: number = 0;
  rt.fill($f0, 4, 0);
  enemy = CharHlp.EnemyTeam(r32(143749)) << 24 >> 24;
  for (let $i1 = 1, $e1 = U8[caught]; $i1 <= $e1; $i1++) {
    i = $i1;
    let $t2;
    $t2 = $f0 + (CharHlp.Team(r32(U8[caught + i] * 4 + 144292)) === enemy ? 1 : 0) * 2, U8[$t2] = U8[$t2] + 1;
  }
  if (AreaRuleOf(U8[247717]) === 1) {
    CharHlp.SleepMost(caught, enemy, $f0 + 3, $f0 + 1);
  }
  (await ShowAreaTally($f0));
  S.sp = $sp;
}

export function LeadershipBase(lvl: number) {
  let $r0: number = 0;
  if (lvl >= 8) {
    $r0 = 80;
  } else if (lvl >= 4) {
    $r0 = 40;
  } else if (lvl >= 1) {
    $r0 = 20;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function LeadershipChance(paladin: number) {
  let chance: number = 0, $r0: number = 0;
  chance = LeadershipBase(CharHlp.GetClassLevel(paladin, 8)) & 255;
  if (U8[paladin + 21] > 13) {
    chance = (chance + ((U8[paladin + 21] - 13) * 5)) & 255;
  }
  $r0 = chance;
  return $r0;
}

export function CanLead(p: number) {
  let $r0: boolean = false;
  $r0 = (((!CharHlp.IsNpc(p) && (CharHlp.Team(p) === 0)) && (CharHlp.GetClassLevel(p, 8) > 0)) && (U8[p + 268] === 0)) && (U8[p + 269] !== 0);
  return $r0;
}

export function CanBeLed(p: number) {
  let $r0: boolean = false;
  $r0 = ((((CharHlp.IsNpc(p) && (CharHlp.Team(p) === 0)) && (U8[p + 271] !== 0)) && (U8[p + 268] === 0)) && (U8[p + 269] !== 0)) && (U8[p + 17] > 3);
  return $r0;
}

export function TryLead(paladin: number, npc: number, roll: number) {
  let leads: boolean = false, $r0: boolean = false;
  leads = roll < LeadershipChance(paladin);
  if (leads) {
    U8[npc + 271] = 0;
    U8[r32(npc + 264) + 22] = 1;
  }
  $r0 = leads;
  return $r0;
}

export async function UseLeadership() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let paladin: number = 0, npc: number = 0, row: number = 0, c: number = 0;
  if ((U8[141212] !== 0)) {
    { S.sp = $sp; return; }
  }
  row = 0;
  paladin = r32(143753);
  while (paladin !== 0) {
    if (CanLead(paladin)) {
      npc = r32(143753);
      while (npc !== 0) {
        if (CanBeLed(npc)) {
          if (TryLead(paladin, npc, Dice.RollDice(1, 100))) {
            if ((row === 0) || (row > 19)) {
              if (row > 19) {
                c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0)) & 255;
              }
              (await Border.DrawWindow(1, 1, 38, 22, 0, 13, "Using leadership ability"));
              row = 3;
            }
            (await TextRend.DisplayMessageWindow(1, row, 38, 22, 15, true, rS(paladin) + " leads " + rS(npc) + "."));
            row = (row + 2) & 255;
          }
        }
        npc = r32(npc + 260);
      }
    }
    paladin = r32(paladin + 260);
  }
  if (row > 0) {
    c = (await MenuCore.MenuHorizontal("", C_MSG.CONTINUE_PROMPT, 15, 15, 15, true, false, $f0)) & 255;
  }
  S.sp = $sp;
}

export function AttacksFromRate(n: number) {
  let v: number = 0, $r0: number = 0;
  v = n;
  if ((U8[146459] & 1) !== 0) {
    v = (v + 1) & 255;
  }
  $r0 = Math.trunc(v / 2);
  return $r0;
}

export function ApplyRangePenalty(att: number, def: number, defense: number) {
  let subrange: number = 0, dist: number = 0;
  dist = CbtMap.CalcDistance(att, def) << 24 >> 24;
  if (CharHlp.HasRangedWeapon(att)) {
    subrange = Math.trunc((U8[CharHlp.BaseItem(U8[r32(att + 204) + 46]) + 12] - 1) / 3) << 24 >> 24;
  } else {
    subrange = dist;
  }
  if ((dist - subrange) > 0) {
    dist = (dist - subrange) << 24 >> 24;
    U8[defense] = U8[defense] + 2;
  }
  if ((dist - subrange) > 0) {
    dist = (dist - subrange) << 24 >> 24;
    U8[defense] = U8[defense] + 3;
  }
}

export function IsBackstab(att: number, def: number) {
  let weapon: number = 0, wItem: number = 0, can: boolean = false, $r0: boolean = false;
  can = false;
  weapon = r32(att + 204);
  if (weapon !== 0) {
    wItem = U8[weapon + 46];
  }
  if (CharHlp.GetClassLevel(att, 64) > 0) {
    if (!ClassCal.ArmorBarsThiefSkills(att)) {
      if ((((weapon === 0) || (wItem === 7)) || (wItem === 8)) || ((wItem >= 35) && (wItem <= 37))) {
        can = true;
      }
    }
  }
  if ((can && (U8[r32(def + 264) + 15] > 1)) && (DirTowardTarget(att, def) === U8[r32(def + 264) + 9])) {
    $r0 = true;
  } else {
    $r0 = false;
  }
  return $r0;
}

export async function AnimateMissile(att: number, def: number, weapon: number) {
  let sym: number = 0, frames: number = 0, dir: number = 0, pace: number = 0, size: number = 0;
  dir = DirTowardTarget(att, def) & 255;
  frames = 1;
  pace = 10;
  sym = 13;
  size = Blit.MaskBytes(r16(r32(146533) + 17)) & 65535;
  switch (U8[weapon + 46]) {
    case 9: case 21: case 28: case 31: case 73: {
      if ((dir & 1) !== 0) {
        if ((dir === 3) || (dir === 5)) {
          (await CharDisp.CopyIconFacing(sym + 1, 1, 0, dir === 5));
        } else {
          (await CharDisp.CopyIconFacing(sym + 1, 0, 0, dir === 7));
        }
      } else {
        (await CharDisp.CopyIconFacing(sym + (dir % 4), Math.trunc(dir / 4), 0, false));
      }
      break;
    }
    case 2: case 7: case 20: {
      (await CharDisp.BuildIconFacings(sym + 3));
      frames = 4;
      pace = 50;
      break;
    }
    case 85: case 86: {
      (await CharDisp.BuildIconFacings(sym + 4));
      frames = 4;
      pace = 50;
      break;
    }
    default: {
      if (U8[weapon + 46] === 47) {
        sym = (sym + 1) & 255;
      }
      (await CharDisp.CopyIconFacing(sym + 7, 0, 0, false));
      (await CharDisp.CopyIconFacing(sym + 7, 1, 1, false));
      frames = 2;
      pace = 20;
    }
  }
  (await SoundDrv.SoundSetAutoStop(0));
  (await SoundDrv.SoundEffect(r16(132899), 2));
  (await CharDisp.AnimateIconBetween(att, def, frames, pace));
  (await SoundDrv.SoundEffect(r16(132911), 2));
  (await SoundDrv.SoundSetAutoStop(10));
}

export async function CalcWeaponDamage(att: number, def: number, idx: number) {
  let i: number = 0, mult: number = 0, bonus: number = 0;
  mult = 1;
  if (IsBackstab(att, def)) {
    mult = (Math.trunc(((CharHlp.GetClassLevel(att, 64) & 65535) + 3) / 4) + 1) & 255;
  }
  bonus = 0;
  if ((CharHlp.GetClassLevel(att, 16) > 0) && (CbtMap.CalcDistance(att, def) <= 1)) {
    for (let $i1 = 1; $i1 <= 16; $i1++) {
      i = $i1;
      if (rS(def) === rS(i * 16 + 131630)) {
        bonus = CharHlp.GetClassLevel(att, 16) & 255;
      }
    }
  }
  U8[144897] = WeaponDamage(I8[att + idx + 280] + Dice.RollDamageDice(U8[att + idx + 276], U8[att + idx + 278]), mult, bonus);
  U8[144898] = 0;
  (await FxEngine.TriggerEffectsWithCondition(4, att));
  (await FxEngine.TriggerEffectsWithCondition(5, def));
}

export async function ProcessAttackResult(att: number, def: number, atkType: number, dmg: number, dmgDisp: number, isHit: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 81);
  let row: number = 0;
  switch (atkType) {
    case 2: {
      wS($f0, 80, "-Backstabs-");
      break;
    }
    case 3: {
      wS($f0, 80, "slays helpless");
      break;
    }
    default: {
      wS($f0, 80, "Attacks");
    }
  }
  (await CharDisp.PrintNameString(att, rS($f0), 10, false));
  row = 12;
  CharDisp.LogCreatureName(def);
  if (atkType === 1) {
    wS($f0, 80, "(from behind) ");
  } else {
    wS($f0, 80, "");
  }
  if (isHit) {
    if (atkType === 3) {
      wS($f0, 80, "with one cruel blow");
    } else {
      wS($f0, 80, rS($f0) + "Hitting for " + StrUtil.Count(dmgDisp, "point", "points") + " of damage");
    }
    CharHlp.InflictDamage(def, dmg);
    if (atkType !== 3) {
      Bestiary.LearnBlow(att, def, dmg);
    }
  } else {
    wS($f0, 80, rS($f0) + "and Misses");
  }
  CbtLog.NextLine();
  CbtLog.Add(10, rS($f0));
  (await CharDisp.PrintNameLine(def, rS($f0), row));
  row = (U8[143770] + 1) & 255;
  if (dmg > 0) {
    U8[r32(def + 264) + 1] = 0;
    if (U8[r32(def + 264)] > 0) {
      (await TextRend.PauseOnly());
      (await CharDisp.PrintNameString(def, "lost a spell", 12, true));
      CharHlp.RemoveSpell(def, U8[r32(def + 264)]);
      U8[r32(def + 264)] = 0;
    } else {
      (await TextRend.PauseOnly());
    }
  } else {
    (await TextRend.PauseOnly());
  }
  if (U8[def + 269] === 0) {
    (await CharDisp.PrintNameString(def, "goes down", row, false));
    row = (row + 2) & 255;
    if (U8[def + 268] === 5) {
      CbtLog.NextLine();
      CbtLog.Add(10, "and is Dying");
      (await CharDisp.PrintMsgTail("and is Dying", 10, row));
    }
    let $t1;
    if (($t1 = U8[def + 268], $t1 === 6 || $t1 === 7 || $t1 === 8)) {
      (await CharDisp.PrintNameString(def, "is killed", row, false));
    }
    (await FxEngine.RemoveEffectsHp0(def));
    (await FxEngine.TriggerEffectsWithCondition(13, def));
    if (U8[def + 269] === 0) {
      (await CbtMap.CreatureDowned(def));
    } else {
      (await TextRend.PauseOnly());
    }
  }
  (await CharDisp.ClearMessageWindow());
  S.sp = $sp;
}

export async function GuardersAttack(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let cnt: number = 0, i: number = 0, p: number = 0;
  cnt = CbtMap.CountTargets(creature, 1) & 255;
  for (let $i1 = 1, $e1 = cnt; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[creature + 269] !== 0) {
      p = r32(U8[i + 146459] * 4 + 144292);
      if ((U8[r32(p + 264) + 7] !== 0) && !CharHlp.IsHelpless(p)) {
        (await CbtMap.ScrollView(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), 2, 8));
        U8[r32(p + 264) + 7] = 0;
        NoteAttackDirection(p, creature);
        (await MakeAttack(p, creature, false, 0, $f0));
      }
    }
  }
  S.sp = $sp;
}

export async function RollAttacks(att: number, def: number, fromBehind: boolean, ranged: boolean, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let anyHit: boolean = false, defDowned: boolean = false, behind: boolean = false, phase: number = 0, startPhase: number = 0, atkType: number = 0, behindIdx: number = 0, slay: number = 0, group: number = 0, rolled: boolean = false, backstab: boolean = false;
  if (ranged) {
    group = 2;
  } else {
    group = 4;
  }
  behind = fromBehind;
  U8[done] = false ? 1 : 0;
  U8[247514] = 0;
  U8[247515] = 0;
  U8[247715] = 0;
  U8[247716] = 0;
  anyHit = false;
  defDowned = false;
  U8[144897] = 0;
  U8[r32(att + 264) + 8] = 1;
  if (CharHlp.IsHelpless(def)) {
    (await SoundDrv.SoundEffect(r16(132901), group));
    while ((U8[r32(att + 264) + 4] > 1) && (U8[att + U8[r32(att + 264) + 4] + 274] === 0)) {
      let $t2;
      $t2 = r32(att + 264) + 4, U8[$t2] = U8[$t2] - 1;
    }
    let $t3;
    $t3 = U8[r32(att + 264) + 4] + 247714, U8[$t3] = U8[$t3] + 1;
    if (U8[def + 283] > 250) {
      slay = 255;
    } else {
      slay = (U8[def + 283] + 5) & 255;
    }
    (await ProcessAttackResult(att, def, 3, slay, 1, true));
    (await FxEngine.RemoveInvisibility(att));
    for (let $i4 = 1; $i4 <= 2; $i4++) {
      phase = $i4;
      U8[att + phase + 274] = 0;
    }
    anyHit = true;
    U8[done] = true ? 1 : 0;
  } else {
    if ((r32(att + 204) !== 0) && ((U8[def + 108] & 128) !== 0)) {
      mv($f0, CharHlp.BaseItem(U8[r32(att + 204) + 46]), 16);
      U8[att + 277] = U8[$f0 + 2];
      U8[att + 279] = U8[$f0 + 3];
      U8[att + 281] = (I8[att + 281] - I8[$f0 + 11]) + I8[$f0 + 4];
    }
    if (r32(att + 204) !== 0) {
      Bestiary.LearnSize(def, att, (U8[def + 108] & 128) !== 0);
    }
    CharHlp.RecalcStats(def);
    (await FxEngine.TriggerEffectsWithCondition(11, def));
    behindIdx = 0;
    backstab = IsBackstab(att, def);
    if (backstab) {
      U8[$f0 + 16] = U8[def + 274] - 2;
    } else {
      if (U8[r32(def + 264) + 15] > 1) {
        if ((DirTowardTarget(att, def) === U8[r32(def + 264) + 9]) && (U8[r32(def + 264) + 18] > 4)) {
          behind = true;
        }
      }
      if (behind) {
        behindIdx = 1;
      }
      U8[$f0 + 16] = U8[def + behindIdx + 273];
    }
    ApplyRangePenalty(att, def, $f0 + 16);
    atkType = 0;
    if (behind) {
      atkType = 1;
    }
    if (backstab) {
      atkType = 2;
    }
    startPhase = U8[r32(att + 264) + 4];
    for (let $i5 = startPhase; $i5 >= 1; $i5--) {
      phase = $i5;
      while ((U8[att + phase + 274] > 0) && (defDowned === false)) {
        let $t7;
        $t7 = att + phase + 274, U8[$t7] = U8[$t7] - 1;
        U8[r32(att + 264) + 4] = phase;
        U8[phase + 247714] = U8[phase + 247714] + 1;
        rolled = (await FxEngine.AttackRoll(att, def, U8[$f0 + 16]));
        if (atkType === 0) {
          Bestiary.LearnArmor(def, att, (I8[144906] + FxEngine.HitBonus(att)) - (U8[$f0 + 16] - U8[def + 273]), rolled);
        }
        if (rolled || CharHlp.IsHelpless(def)) {
          anyHit = true;
          if (CharHlp.HasEffect(def, 28, $f0 + 17) && FxEngine.ImageStruck(r32($f0 + 17))) {
            (await SoundDrv.SoundEffect(r16(132905), group));
            (await ProcessAttackResult(att, def, atkType, 0, 0, false));
            (await FxEngine.LoseImage(def, r32($f0 + 17)));
          } else {
            U8[phase + 247513] = U8[phase + 247513] + 1;
            (await SoundDrv.SoundEffect(r16(132901), group));
            (await CalcWeaponDamage(att, def, phase));
            (await ProcessAttackResult(att, def, atkType, U8[144897], U8[144897], true));
            if (U8[def + 269] !== 0) {
              (await FxEngine.TriggerEffectsWithCondition((2 + phase) - 1, att));
            }
            if (U8[def + 269] === 0) {
              defDowned = true;
            }
          }
        }
      }
    }
    if (!anyHit) {
      (await SoundDrv.SoundEffect(r16(132905), group));
      (await ProcessAttackResult(att, def, atkType, 0, 0, false));
    }
    U8[done] = true ? 1 : 0;
    for (let $i8 = 1; $i8 <= 2; $i8++) {
      phase = $i8;
      if (U8[att + phase + 274] > 0) {
        U8[done] = false ? 1 : 0;
      }
    }
    U8[r32(att + 264) + 5] = 0;
  }
  if ((U8[done] !== 0)) {
    U8[done] = CharHlp.EndActions(att) ? 1 : 0;
  }
  S.sp = $sp;
}

export function PartyKnows(caster: number, target: number, fact: number) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  if (((caster === 0) || !Party.IsPartyMember(caster)) || Party.IsPartyMember(target)) {
    return $r0;
  }
  i = Bestiary.Find(rS(target)) & 65535;
  if (i !== 0) {
    $r0 = Bestiary.Knows(Bestiary.Entry(i), fact);
  }
  return $r0;
}

export function InCloud(creature: number, terr: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: boolean = false;
  if (terr === 30) {
    CbtMap.ProbeDirection(creature, 8, $f0, $f0 + 1);
    $r0 = U8[$f0 + 1] === 30;
  } else {
    $r0 = CbtMap.ProbeTerrain(creature, 8, terr);
  }
  S.sp = $sp;
  return $r0;
}

export async function SelectSpellTarget(spell: number, ai: boolean, ground: number, tgt: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let p: number = 0, $r0: boolean = false;
  U8[$f0] = false ? 1 : 0;
  if (!ai) {
    (await CombatAimMenu(r32(143749), CharHlp.CalcSpellRange(spell), 0, ground, U8[spell * 16 + 136520] === 0, $f0, tgt));
    w32(r32(r32(143749) + 264) + 10, r32(tgt));
  } else {
    if (U8[spell * 16 + 136520] === 0) {
      w32(tgt, r32(143749));
      if (!rt.inS(C_SPELL.CURE_WOUNDS, spell) || FindCureTarget(r32(143749), tgt)) {
        U8[tgt + 4] = CbtMap.CombatCellX(r32(tgt));
        U8[tgt + 5] = CbtMap.CombatCellY(r32(tgt));
        U8[$f0] = true ? 1 : 0;
      }
    } else {
      p = (await BestAim(spell, $f0 + 1));
      if (p !== 0) {
        w32(r32(r32(143749) + 264) + 10, p);
        w32(tgt, p);
        U8[tgt + 4] = CbtMap.CombatCellX(p);
        U8[tgt + 5] = CbtMap.CombatCellY(p);
        U8[$f0] = true ? 1 : 0;
      }
    }
  }
  if ((U8[$f0] !== 0)) {
    $r0 = true;
    U8[240657] = I8[tgt + 4];
    U8[240658] = I8[tgt + 5];
  } else {
    $r0 = false;
    rt.fill(tgt, 7, 0);
  }
  S.sp = $sp;
  return $r0;
}

export function HostileSpell(spell: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((spell >= 1) && (spell <= 128)) {
    $r0 = (U8[spell * 16 + 136520] === 1) && (U8[spell * 16 + 136513] === 0);
  }
  return $r0;
}

export function AimMarker(spell: number) {
  let $r0: number = 0;
  if (HostileSpell(spell)) {
    $r0 = 18;
  } else {
    $r0 = 22;
  }
  return $r0;
}

export function AreaRuleOf(spell: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1; $i1 <= 1; $i1++) {
    i = $i1;
    if (U8[i * 2 + 247716] === spell) {
      $r0 = U8[i * 2 + 247717];
    }
  }
  return $r0;
}

export function AimSpellName(spell: number) {
  let $r0: string = "";
  $r0 = "";
  if (spell === 64) {
    spell = 47;
  }
  if (CharHlp.IsSpell(spell)) {
    $r0 = rS(spell * 33 + 133189);
  }
  return $r0;
}

export async function ShowAreaTally(side: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 293);
  let n: number = 0, len: number = 0, col: number = 0, i: number = 0;
  function Add(color: number, s: string) {
    n = (n + 1) & 255;
    wS($f0 + n * 41 - 41, 40, s);
    U8[$f0 + n + 245] = color;
    len = (len + s.length) & 255;
  }
  function AddSides() {
    if ((U8[side + 2] === 0) && (U8[side] === 0)) {
      Add(10, "NO TARGETS");
    } else {
      if (U8[side + 2] > 0) {
        Add(14, CharHlp.CatchText(U8[side + 2], U8[side + 3], true));
      }
      if ((U8[side + 2] > 0) && (U8[side] > 0)) {
        Add(10, ", ");
      }
      if (U8[side] > 0) {
        Add(11, CharHlp.CatchText(U8[side], U8[side + 1], false));
      }
    }
  }
  wS($f0 + 252, 40, AimSpellName(U8[247717]));
  n = 0;
  len = 0;
  if (rS($f0 + 252) !== "") {
    Add(15, rS($f0 + 252));
    Add(15, ": ");
  }
  AddSides();
  if (len > 40) {
    n = 0;
    len = 0;
    AddSides();
  }
  (await Border.ClearBox(0, 23, 39, 23));
  col = 0;
  for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    TextRend.DisplayString(col, 23, U8[$f0 + i + 245], rS($f0 + i * 41 - 41));
    col = (col + U8[$f0 + i * 41 - 41]) & 255;
  }
  S.sp = $sp;
}

export function ShowRange(dist: number) {
  TextRend.DisplayString(0, 23, 10, "Range = " + StrUtil.NumStr(dist) + "  ");
}

export function WeaponCanStrike(cur: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  if (!CharHlp.HasRangedWeapon(cur)) {
    $r0 = true;
  } else if (!CharHlp.FindDamagingRangedWeapon(cur, $f0)) {
    $r0 = false;
  } else {
    $r0 = (CbtMap.CountTargets(cur, 1) === 0) || CharHlp.HasThrowableWeapon(cur);
  }
  S.sp = $sp;
  return $r0;
}

export async function AimTargetMenu(cur: number, tgt: number, range: number, weaponMode: number, dir: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let dist: number = 0, ch: number = 0, $r0: number = 0;
  wS($f0, 40, "");
  dist = CbtMap.CalcDistance(cur, tgt) & 255;
  if (weaponMode !== 0) {
    ShowRange(dist);
  }
  if (dist <= range) {
    if ((weaponMode === 0) || ((cur !== tgt) && WeaponCanStrike(cur))) {
      wS($f0, 40, "Target ");
    }
  }
  wS($f0, 40, "Next Prev Manual " + rS($f0) + "Center Exit");
  (await CbtMap.DisplayMapViewCentered(tgt, 3, true));
  (await CharDisp.CombatPrintCreatureInfo(tgt));
  (await CbtMini.Show(cur, CbtMap.CombatCellX(tgt), CbtMap.CombatCellY(tgt)));
  do {
    U8[227081] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("Aim: ", rS($f0), 13, 10, 15, true, false, $f0 + 41)) & 255;
    U8[dir] = 8;
    if ((U8[$f0 + 41] !== 0)) {
      U8[dir] = DirOfKey(ch);
    }
  } while (!(!(U8[$f0 + 41] !== 0) || (U8[dir] !== 8)));
  $r0 = ch;
  S.sp = $sp;
  return $r0;
}

export async function ConfirmAttackTarget(cur: number, tgt: number, weaponMode: number, done: number, sel: number) {
  U8[done] = true ? 1 : 0;
  if (weaponMode === 1) {
    if (!(await CheckAttackAlly(cur, tgt))) {
      U8[done] = false ? 1 : 0;
    }
  }
  if ((U8[done] !== 0)) {
    w32(sel, tgt);
    U8[sel + 4] = CbtMap.CombatCellX(tgt);
    U8[sel + 5] = CbtMap.CombatCellY(tgt);
    U8[r32(144641) + 4] = false ? 1 : 0;
    (await CbtMap.ScrollView(CbtMap.CenterX(), CbtMap.CenterY(), 3, 8));
    if (weaponMode === 1) {
      if ((await SweepAttack(cur, tgt))) {
        U8[done] = CharHlp.EndActions(cur) ? 1 : 0;
      } else {
        (await AttackWithReadied(cur, tgt, done));
      }
    }
  } else {
    rt.fill(sel, 7, 0);
  }
}

export async function ManualAimCursor(cur: number, underCursor: number, range: number, weaponMode: number, ground: number, startDir: number, done: number, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 47);
  let ch: number = 0, dir: number = 0, j: number = 0, cx: number = 0, cy: number = 0, valid: boolean = false;
  rt.fill(sel, 7, 0);
  cx = CbtMap.CombatCellX(underCursor) << 24 >> 24;
  cy = CbtMap.CombatCellY(underCursor) << 24 >> 24;
  ch = 32;
  dir = startDir;
  U8[done] = false ? 1 : 0;
  U8[r32(144641) + 4] = true ? 1 : 0;
  U8[r32(144641) + 5] = 1;
  while (!(ch === 0 || ch === 69 || ch === 84)) {
    (await CbtMap.ScrollView(cx, cy, 3, dir));
    cx = (cx + I8[dir + 132927]) << 24 >> 24;
    cy = (cy + I8[dir + 132936]) << 24 >> 24;
    if (cx < 0) {
      cx = 0;
    }
    if (cy < 0) {
      cy = 0;
    }
    if (cx > 49) {
      cx = 49;
    }
    if (cy > 24) {
      cy = 24;
    }
    CbtMap.GetArenaContents(cx, cy, $f0 + 43, $f0 + 44);
    valid = false;
    w16($f0 + 45, 255);
    U8[$f0 + 41] = cx;
    U8[$f0 + 42] = cy;
    if (Pathing.WalkLine(CbtMap.CombatCellX(cur), CbtMap.CombatCellY(cur), $f0 + 41, $f0 + 42, $f0 + 45, r32(144641))) {
      valid = true;
      if (weaponMode !== 0) {
        ShowRange(Math.trunc(r16($f0 + 45) / 2));
      }
    } else if (weaponMode !== 0) {
      (await Border.ClearBox(0, 23, 39, 23));
    }
    w16($f0 + 45, Math.trunc(r16($f0 + 45) / 2));
    underCursor = 0;
    if (valid) {
      if (U8[$f0 + 43] > 0) {
        underCursor = r32(U8[$f0 + 43] * 4 + 144292);
      } else if (U8[$f0 + 44] === 31) {
        for (let $i2 = 1, $e2 = U8[144640]; $i2 <= $e2; $i2++) {
          j = $i2;
          if (I8[j * 7 + 144581] === cx) {
            if (I8[j * 7 + 144582] === cy) {
              underCursor = r32(j * 7 + 144577);
            }
          }
        }
      }
    }
    if (underCursor !== 0) {
      (await CharDisp.CombatPrintCreatureInfo(underCursor));
    } else {
      (await CharDisp.ClearCreatureInfo());
    }
    (await CbtMini.Show(cur, cx, cy));
    if ((range < r16($f0 + 45)) || (U8[U8[$f0 + 44] * 3 + 132942] === 255)) {
      valid = false;
    }
    if (underCursor !== 0) {
      if (!(await CanTarget(cur, underCursor, true))) {
        valid = false;
      }
      if (weaponMode === 1) {
        if ((cur === underCursor) || ((U8[$f0 + 43] === 0) && (U8[$f0 + 44] === 31))) {
          valid = false;
        } else if (!WeaponCanStrike(cur)) {
          valid = false;
        }
      }
    } else if (ground === 0) {
      valid = false;
    }
    wS($f0, 40, "Center Exit");
    if (valid) {
      wS($f0, 40, "Target " + rS($f0));
    }
    U8[227081] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("(Use Cursor keys) ", rS($f0), 13, 10, 15, true, false, 247517)) & 255;
    switch (ch) {
      case 84: {
        U8[r32(144641) + 4] = false ? 1 : 0;
        if (valid) {
          U8[sel + 4] = cx;
          U8[sel + 5] = cy;
          if (underCursor !== 0) {
            w32(sel, underCursor);
          } else {
            w32(sel, 0);
          }
          if (weaponMode === 1) {
            (await ConfirmAttackTarget(cur, r32(sel), weaponMode, done, sel));
          } else {
            U8[done] = true ? 1 : 0;
          }
        }
        if ((valid === false) || ((U8[done] !== 0) === false)) {
          (await CbtMap.RedrawArenaCell(cx, cy));
          U8[done] = false ? 1 : 0;
          rt.fill(sel, 7, 0);
        }
        break;
      }
      case 0: case 69: {
        (await CbtMap.RedrawArenaCell(cx, cy));
        rt.fill(sel, 7, 0);
        U8[done] = false ? 1 : 0;
        break;
      }
      case 67: {
        (await CbtMap.ScrollView(cx, cy, 0, 8));
        dir = 8;
        break;
      }
      default: {
        dir = DirOfKey(ch) & 255;
      }
    }
  }
  S.sp = $sp;
}

export function $init() {
  U8[247481] = 0;
  U8[247717] = 0;
  rt.fill(247514, 2, 0);
  U8[247516] = 0;
  U8[247517] = false ? 1 : 0;
}
