// Generated from src/fixplan.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CharHlp from './charhlp';
import * as FxEngine from './fxengine';
import * as C_EFFECT from './c_effect';
import * as C_LEVEL from './c_level';
import * as C_SPELL from './c_spell';
import * as C_STATUS from './c_status';

export const FIX_DRAIN = 1;
export const FIX_DISEASE = 2;
export const FIX_BLIND = 3;
export const FIX_CURSE = 4;
export const FIX_FIRST = 1;
export const FIX_LAST = 4;
export const USE_ITEM = 1;
export const USE_LAY_ON_HANDS = 2;
export const USE_PALADIN_CURE = 3;
export const WOUND_CLW = 4;
export const WOUND_HEALING = 7;
export const WOUND_OINTMENT = 10;
export const SLOT_ROW_FIRST = 2;
export const SLOT_ROW_LAST = 9;

export const $at = { CURES: 250683 };

export function CureSpell(cond: number) {
  let $r0: number = 0;
  if ((cond >= 1) && (cond <= 4)) {
    $r0 = U8[cond + 250682];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function CondCount(creature: number, cond: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: number = 0;
  switch (cond) {
    case 1: {
      $r0 = U8[creature + 116];
      break;
    }
    case 2: {
      $r0 = (FxEngine.HasDisease(creature) ? 1 : 0);
      break;
    }
    case 3: {
      $r0 = (CharHlp.HasEffect(creature, 33, $f0) ? 1 : 0);
      break;
    }
    case 4: {
      $r0 = (CharHlp.HasEffect(creature, 36, $f0) ? 1 : 0);
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function Treatable(creature: number) {
  let $r0: boolean = false;
  let $t1;
  $r0 = ($t1 = U8[creature + 268], $t1 === 0 || $t1 === 1 || $t1 === 4 || $t1 === 5);
  return $r0;
}

export function Rotted(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = CharHlp.HasEffect(creature, 50, $f0);
  S.sp = $sp;
  return $r0;
}

export function Plan(plan: number) {
  let p: number = 0, i: number = 0, k: number = 0, cond: number = 0, lvl: number = 0, wanted: number = 0;
  rt.fill(plan, 184, 0);
  p = r32(143753);
  while ((p !== 0) && (U8[plan] < 8)) {
    U8[plan] = U8[plan] + 1;
    w32(plan + U8[plan] * 4 - 3, p);
    if (CharHlp.GetClassLevel(p, 1) > 0) {
      U8[plan + 182] = U8[plan + 182] + 1;
      if (U8[p + 268] === 0) {
        U8[plan + 183] = U8[plan + 183] + 1;
      }
    }
    if (U8[p + 268] === 0) {
      for (let $i2 = 1; $i2 <= 5; $i2++) {
        lvl = $i2;
        U8[plan + U8[plan] * 5 + lvl + 27] = CharHlp.SpellSlots(p, 0, lvl);
      }
    }
    p = r32(p + 260);
  }
  for (let $i3 = 1; $i3 <= 4; $i3++) {
    cond = $i3;
    for (let $i4 = 1, $e4 = U8[plan]; $i4 <= $e4; $i4++) {
      i = $i4;
      if (Treatable(r32(plan + i * 4 - 3))) {
        for (let $i5 = 1, $e5 = CondCount(r32(plan + i * 4 - 3), cond); $i5 <= $e5; $i5++) {
          k = $i5;
          U8[plan + 181] = true ? 1 : 0;
          if (Assign(plan, CureSpell(cond))) {
            let $t6;
            $t6 = plan + i * 4 + cond + 108, U8[$t6] = U8[$t6] + 1;
          } else {
            let $t7;
            $t7 = plan + i * 4 + cond + 140, U8[$t7] = U8[$t7] + 1;
          }
        }
      }
    }
  }
  for (let $i8 = 1, $e8 = U8[plan]; $i8 <= $e8; $i8++) {
    i = $i8;
    p = r32(plan + i * 4 - 3);
    if (Treatable(p) && (U8[p + 283] < U8[p + 50])) {
      if (!Rotted(p) || (U8[plan + i * 4 + 110] > 0)) {
        w16(plan + 179, r16(plan + 179) + (U8[p + 50] - U8[p + 283]));
      }
    }
  }
  wanted = Math.trunc(((2 * r16(plan + 179)) + 8) / 9) & 65535;
  while (r16(plan + 177) < wanted) {
    if (Assign(plan, 3)) {
      w16(plan + 177, r16(plan + 177) + 1);
    } else {
      wanted = r16(plan + 177);
    }
  }
}

export function CasterTime(plan: number, j: number) {
  let t: number = 0, lvl: number = 0, top_: number = 0, $r0: number = 0;
  t = 0;
  top_ = 0;
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    lvl = $i1;
    if (U8[plan + j * 5 + lvl + 67] > 0) {
      t = (t + ((15 * lvl) * U8[plan + j * 5 + lvl + 67])) & 65535;
      top_ = lvl;
    }
  }
  if (top_ >= 3) {
    t = (t + 360) & 65535;
  } else if (top_ > 0) {
    t = (t + 240) & 65535;
  }
  $r0 = t;
  return $r0;
}

export function RestMinutes(plan: number) {
  let i: number = 0, total: number = 0, $r0: number = 0;
  total = 0;
  for (let $i1 = 1, $e1 = U8[plan]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (total < CasterTime(plan, i)) {
      total = CasterTime(plan, i) & 65535;
    }
  }
  $r0 = total;
  return $r0;
}

export function HasCasts(plan: number) {
  let i: number = 0, lvl: number = 0, any: boolean = false, $r0: boolean = false;
  any = false;
  for (let $i1 = 1, $e1 = U8[plan]; $i1 <= $e1; $i1++) {
    i = $i1;
    for (let $i2 = 1; $i2 <= 5; $i2++) {
      lvl = $i2;
      if (U8[plan + i * 5 + lvl + 67] > 0) {
        any = true;
      }
    }
  }
  $r0 = any;
  return $r0;
}

export function DrainedOutOf(cleric: number, spell: number) {
  let lvl: number = 0, cl: number = 0, $r0: boolean = false;
  $r0 = false;
  lvl = SpellLevel(spell) & 255;
  cl = CharHlp.GetClassLevel(cleric, 1) << 16 >> 16;
  if ((((U8[cleric + 116] === 0) || (cl <= 0)) || (lvl < 1)) || (lvl > 5)) {
    return $r0;
  }
  if (CharHlp.SpellSlots(cleric, 0, lvl) > 0) {
    return $r0;
  }
  cl = (cl + U8[cleric + 116]) << 16 >> 16;
  if (cl > 9) {
    cl = 9;
  }
  if (cl >= 2) {
    $r0 = U8[cl * 5 + lvl + 140449] > 0;
  }
  return $r0;
}

export function NextUse(drainOnly: boolean, use: number) {
  let p: number = 0, most: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  U8[use] = 1;
  p = r32(143753);
  while ((p !== 0) && !found) {
    if (Treatable(p)) {
      if (!drainOnly && (CondCount(p, 2) > 0)) {
        if (U8[141203] !== 0) {
          found = FindPaladin(false, use);
          if (found) {
            U8[use] = 3;
          }
        }
        if (!found && (U8[141201] !== 0)) {
          found = FindScroll(39, use);
        }
        if ((!found && (U8[141202] !== 0)) && !Poisoned(p)) {
          found = FindPotion(127, use);
        }
      }
      if ((!found && !drainOnly) && (U8[141201] !== 0)) {
        if (CondCount(p, 3) > 0) {
          found = FindScroll(37, use);
        }
        if (!found && (CondCount(p, 4) > 0)) {
          found = FindScroll(43, use);
        }
      }
      if ((!found && (U8[141201] !== 0)) && (CondCount(p, 1) > 0)) {
        found = FindScroll(56, use);
      }
    }
    if (found) {
      w32(use + 10, p);
    } else {
      p = r32(p + 260);
    }
  }
  if ((!found && !drainOnly) && (U8[141204] !== 0)) {
    most = 0;
    p = r32(143753);
    while (p !== 0) {
      if (Healable(p) > 0) {
        if ((most === 0) || (Healable(p) > Healable(most))) {
          most = p;
        }
      }
      p = r32(p + 260);
    }
    if (most !== 0) {
      found = FindPaladin(true, use);
      if (found) {
        U8[use] = 2;
        w32(use + 10, most);
      }
    }
  }
  if (!drainOnly) {
    p = r32(143753);
    while ((p !== 0) && !found) {
      if ((U8[141201] !== 0) && (Healable(p) >= 4)) {
        found = FindScroll(3, use);
      }
      if (!found && (U8[141202] !== 0)) {
        if (Healable(p) >= 7) {
          found = FindPotion(62, use);
        }
        if (((!found && (Healable(p) >= 10)) && !Poisoned(p)) && (CondCount(p, 2) === 0)) {
          found = FindPotion(127, use);
        }
      }
      if (found) {
        U8[use] = 1;
        w32(use + 10, p);
      } else {
        p = r32(p + 260);
      }
    }
  }
  $r0 = found;
  return $r0;
}

export function SpellLevel(spell: number) {
  let $r0: number = 0;
  if (CharHlp.IsSpell(spell)) {
    $r0 = U8[spell * 16 + 136507];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function Assign(plan: number, spell: number) {
  let j: number = 0, best: number = 0, lvl: number = 0, $r0: boolean = false;
  best = 0;
  lvl = SpellLevel(spell) & 255;
  if ((lvl >= 1) && (lvl <= 5)) {
    for (let $i1 = 1, $e1 = U8[plan]; $i1 <= $e1; $i1++) {
      j = $i1;
      if ((U8[plan + j * 5 + lvl + 27] > 0) && CharHlp.KnowsSpell(r32(plan + j * 4 - 3), spell)) {
        if ((best === 0) || (CasterTime(plan, j) < CasterTime(plan, best))) {
          best = j;
        }
      }
    }
  }
  if (best !== 0) {
    let $t2;
    $t2 = plan + best * 5 + lvl + 27, U8[$t2] = U8[$t2] - 1;
    let $t3;
    $t3 = plan + best * 5 + lvl + 67, U8[$t3] = U8[$t3] + 1;
  }
  $r0 = best !== 0;
  return $r0;
}

export function Able(creature: number) {
  let $r0: boolean = false;
  $r0 = (U8[creature + 268] === 0) && (U8[creature + 269] !== 0);
  return $r0;
}

export function FindScroll(spell: number, use: number) {
  let p: number = 0, item: number = 0, slot: number = 0, $r0: boolean = false;
  $r0 = false;
  p = r32(143753);
  while (p !== 0) {
    if (Able(p)) {
      item = r32(p + 200);
      while (item !== 0) {
        if (CharHlp.ItemReadable(item) && CharHlp.CastableScroll(p, item)) {
          for (let $i3 = 1; $i3 <= 3; $i3++) {
            slot = $i3;
            if (CharHlp.ScrollSpellAt(item, slot) === spell) {
              w32(use + 1, p);
              w32(use + 5, item);
              U8[use + 9] = spell;
              $r0 = true;
              return $r0;
            }
          }
        }
        item = r32(item + 42);
      }
    }
    p = r32(p + 260);
  }
  return $r0;
}

export function FindPotion(spell: number, use: number) {
  let p: number = 0, item: number = 0, $r0: boolean = false;
  $r0 = false;
  p = r32(143753);
  while (p !== 0) {
    if (Able(p)) {
      item = r32(p + 200);
      while (item !== 0) {
        if ((CharHlp.ItemSpell(item) === spell) && (U8[item + 60] > 0)) {
          w32(use + 1, p);
          w32(use + 5, item);
          U8[use + 9] = spell;
          $r0 = true;
          return $r0;
        }
        item = r32(item + 42);
      }
    }
    p = r32(p + 260);
  }
  return $r0;
}

export function FindPaladin(heal: boolean, use: number) {
  let p: number = 0, ready: boolean = false, $r0: boolean = false;
  $r0 = false;
  p = r32(143753);
  while (p !== 0) {
    if (heal) {
      ready = CharHlp.PaladinCanHeal(p);
    } else {
      ready = CharHlp.PaladinCanCure(p);
    }
    if (ready) {
      w32(use + 1, p);
      w32(use + 5, 0);
      U8[use + 9] = 0;
      $r0 = true;
      return $r0;
    }
    p = r32(p + 260);
  }
  return $r0;
}

export function Poisoned(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = CharHlp.HasEffect(creature, 55, $f0);
  S.sp = $sp;
  return $r0;
}

export function Healable(creature: number) {
  let $r0: number = 0;
  if ((Treatable(creature) && !Rotted(creature)) && (U8[creature + 283] < U8[creature + 50])) {
    $r0 = (U8[creature + 50] - U8[creature + 283]) & 255;
  } else {
    $r0 = 0;
  }
  return $r0;
}
