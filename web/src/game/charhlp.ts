// Generated from src/charhlp.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_EFFECT from './c_effect';
import * as C_EQUIP from './c_equip';
import * as C_RACE from './c_race';
import * as C_LEVEL from './c_level';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_GBVM from './c_gbvm';
import * as C_MONEY from './c_money';
import * as Stats from './stats';
import * as C_NPC from './c_npc';
import * as StrUtil from './strutil';
import * as AbilAdj from './abiladj';
import * as C_SPELL from './c_spell';
import * as ClassCal from './classcal';

export const SET_LABEL_COL = 38;
export const UNDEAD_TYPE = 4;
export const LIGHT_ARMOR = 150;
export const MEDIUM_ARMOR = 399;
export const MAGIC_ARMOR_MOVE = 3;
export const MOVE_LOADED = 9;
export const MOVE_HEAVY = 6;
export const MOVE_OVERLOADED = 3;
export const OVER_LIGHT = 512;
export const OVER_LOADED = 768;
export const OVER_HEAVY = 1024;
export const BAG_OF_HOLDING_COINS = 5000;
export const MAX_ENCUMBRANCE = 65535;
export const HEAVY_LOOT = 255;
export const HEAVY_LOOT_PENALTY = 90;
export const MEDIUM_LOOT = 24;
export const MEDIUM_LOOT_PENALTY = 50;
export const STR_BAND_LOW = 0;
export const STR_BAND_17 = 1;
export const STR_BAND_18 = 2;
export const PALADIN_LEVELS_BEFORE = 8;
export const RANGER_DRUID_LEVELS_BEFORE = 7;
export const RANGER_MAGE_LEVELS_BEFORE = 8;
export const HALFELF_CLERIC_CAP = 5;
export const HALFELF_MAGE_CAP = 8;
export const HALFORC_CLERIC_CAP = 4;
export const HALFORC_CLERIC_CAP_MAX = 7;
export const HALFORC_THIEF_CAP = 8;
export const HALFORC_THIEF_CAP_MAX = 11;
export const HALFORC_CAP_SCORE = 14;

export const $at = { faultHook: 235329, baseItems: 235333, FIGHTER_CAP: 239379 };

export function WeaponAdjust(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let w: number = 0, base: number = 0, plus: number = 0;
  w = r32(creature + 204);
  if (w === 0) {
    { S.sp = $sp; return; }
  }
  base = BaseItem(U8[w + 46]);
  U8[creature + 272] = U8[creature + 45];
  if ((U8[base + 14] & 2) !== 0) {
    U8[creature + 272] = AbilAdj.DexMissileAdjust(creature) + U8[creature + 272];
  }
  U8[creature + 281] = I8[base + 11];
  if ((U8[base + 14] & 4) !== 0) {
    U8[creature + 272] = AbilAdj.StrToHitAdjust(creature) + U8[creature + 272];
    U8[creature + 281] = AbilAdj.StrDamageAdjust(creature) + I8[creature + 281];
  }
  plus = I8[w + 50];
  if ((FindDamagingRangedWeapon(creature, $f0) && (r32($f0) !== 0)) && (r32($f0) !== w)) {
    plus = (plus + I8[r32($f0) + 50]) << 24 >> 24;
    U8[creature + 281] = I8[creature + 281] + I8[r32($f0) + 50];
  } else {
    U8[creature + 281] = I8[creature + 281] + plus;
  }
  let $t1, $t2;
  if ((I8[creature + 46] === 2) && (($t1 = U8[w + 46], ($t1 >= 41 && $t1 <= 44) || $t1 === 36 || $t1 === 37) || ((U8[w + 46] === 45) && ($t2 = U8[w + 48], ($t2 >= 41 && $t2 <= 44))))) {
    plus = (plus + 1) << 24 >> 24;
  }
  U8[creature + 272] = U8[creature + 272] + plus;
  U8[creature + 277] = U8[base + 9];
  U8[creature + 279] = U8[base + 10];
  S.sp = $sp;
}

export function ArmorMoveAdjust(creature: number, item: number) {
  if (U8[BaseItem(U8[item + 46])] === 2) {
    const $c1 = r16(item + 55);
    if (($c1 >= 0 && $c1 <= 150)) {
      U8[creature + 284] = U8[creature + 114];
    } else if (($c1 >= 151 && $c1 <= 399)) {
      U8[creature + 284] = 9;
    } else {
      U8[creature + 284] = 6;
    }
    if ((I8[item + 50] !== 0) && (U8[creature + 284] <= 9)) {
      U8[creature + 284] = U8[creature + 284] + 3;
    }
  }
}

export function ArmorAdjustHelper(creature: number, item: number, adj: number, isMagicBody: number, ringSave: number) {
  let descr: number = 0, slot: number = 0;
  descr = U8[BaseItem(U8[item + 46]) + 6];
  if (descr > 127) {
    descr = descr & 127;
    slot = U8[BaseItem(U8[item + 46])];
    if (slot === 1) {
      U8[adj + 1] = descr + I8[item + 50];
    } else if (descr === 0) {
      if (slot === 9) {
        if (I8[item + 50] > I8[adj + 3]) {
          U8[adj + 3] = I8[item + 50];
        }
        if (I8[item + 50] > I8[ringSave]) {
          U8[ringSave] = I8[item + 50];
        }
        if (I8[item + 51] > I8[ringSave]) {
          U8[ringSave] = I8[item + 51];
        }
      } else {
        U8[adj + 2] = I8[adj + 2] + I8[item + 50];
        U8[creature + 257] = I8[creature + 257] + I8[item + 51];
      }
    } else {
      if ((descr + I8[item + 50]) > I8[adj + 4]) {
        U8[adj + 4] = descr + I8[item + 50];
        if (I8[item + 50] > 0) {
          if (slot === 2) {
            U8[isMagicBody] = true ? 1 : 0;
          }
        }
      }
    }
  }
}

export function EncumbranceAdjust(creature: number) {
  let over: number = 0, movement: number = 0;
  over = (r16(creature + 258) - AbilAdj.WeightAllowance(creature)) | 0;
  if (over < 0) {
    over = 0;
  }
  const $c1 = over;
  if (($c1 >= 0 && $c1 <= 512)) {
    movement = U8[creature + 284];
  } else if (($c1 >= 513 && $c1 <= 768)) {
    movement = 9;
  } else if (($c1 >= 769 && $c1 <= 1024)) {
    movement = 6;
  } else {
    movement = 3;
  }
  if (movement < U8[creature + 284]) {
    U8[creature + 284] = movement;
  }
}

export function ItemLabel(item: number, isInv: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 260);
  let found: boolean = false, p: number = 0;
  wS(item, 40, "");
  if (isInv) {
    if (U8[item + 52] !== 0) {
      wS(item, 40, " Yes  ");
    } else {
      wS(item, 40, " No   ");
    }
  }
  found = false;
  p = r32(229639);
  while ((p !== 0) && !found) {
    if (HasEffect(p, 5, $f0)) {
      found = true;
    }
    p = r32(p + 260);
  }
  if (found) {
    if (((I8[item + 50] > 0) || (I8[item + 51] > 0)) || (U8[item + 54] !== 0)) {
      wS(item, 40, rS(item) + "*" + " ");
    }
  }
  if (U8[item + 57] > 0) {
    wS(item, 40, rS(item) + StrUtil.NumStr(U8[item + 57]) + " ");
  }
  wS($f0 + 4, 255, ItemName(item, U8[item + 57]));
  if (rS($f0 + 4) !== "") {
    wS(item, 40, rS(item) + rS($f0 + 4) + " ");
  }
  if (isInv && (U8[item + 63] !== 0)) {
    if (U8[item] > 36) {
      U8[item] = 36;
    }
    while (U8[item] < 37) {
      wS(item, 40, rS(item) + " ");
    }
    wS(item, 40, rS(item) + String.fromCharCode((48 + U8[item + 63]) & 255));
  }
  S.sp = $sp;
}

export function SetTaggable(item: number) {
  let base: number = 0, $r0: boolean = false;
  base = BaseItem(U8[item + 46]);
  $r0 = ((((U8[base] === 0) && (U8[base + 1] > 0)) || (U8[base] === 1)) || (U8[item + 46] === 73)) || (U8[item + 46] === 28);
  return $r0;
}

export function ItemName(item: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let i: number = 0, mask: number = 0, appended: boolean = false, ofName: boolean = false, $r0: string = "";
  wS($f0, 255, "");
  mask = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    if (U8[item + i + 46] !== 0) {
      if (((U8[item + 53] >>> (3 - i)) & 1) === 0) {
        mask = (mask + (1 << (i - 1))) & 255;
      }
    }
  }
  ofName = (U8[item + 48] === 167) && ((mask & 4) !== 0);
  appended = false;
  for (let $i2 = 3; $i2 >= 1; $i2--) {
    i = $i2;
    if (((mask >>> (i - 1)) & 1) > 0) {
      if (rS($f0) !== "") {
        wS($f0, 255, rS($f0) + " ");
      }
      wS($f0, 255, rS($f0) + rS(U8[item + i + 46] * 21 + 239373));
      if ((count >= 2) && !appended) {
        if ((((((1 << (i - 1)) === mask) || (((i === 1) && (mask > 4)) && !ofName)) || ((i === 2) && !((mask & 1) !== 0))) || ((i === 3) && ofName)) || ((((U8[item + 46] === 73) || (U8[item + 46] === 28)) || (U8[item + 46] === 9)) && (U8[item + 49] !== 177))) {
          wS($f0, 255, rS($f0) + "s");
          appended = true;
        }
      }
    }
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function LabelItems(list: number) {
  while (list !== 0) {
    ItemLabel(list, false);
    list = r32(list + 42);
  }
}

export function IsHelpless(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 1; $i1 <= 4; $i1++) {
    i = $i1;
    if (HasEffect(creature, U8[i + 219028], $f0)) {
      $r0 = true;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function LinkEquipped(creature: number) {
  let i: number = 0, item: number = 0, slot: number = 0;
  for (let $i1 = 0; $i1 <= 12; $i1++) {
    i = $i1;
    w32(creature + i * 4 + 204, 0);
  }
  item = r32(creature + 200);
  while (item !== 0) {
    if (U8[item + 52] !== 0) {
      slot = U8[BaseItem(U8[item + 46])];
      switch (slot) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: {
          w32(creature + slot * 4 + 204, item);
          break;
        }
        case 9: {
          if (r32(creature + 240) !== 0) {
            if (r32(creature + 244) === 0) {
              w32(creature + 244, item);
            }
          } else {
            w32(creature + 240, item);
          }
          break;
        }
      }
      if (U8[item + 46] === 73) {
        w32(creature + 248, item);
      }
      if (U8[item + 46] === 28) {
        w32(creature + 252, item);
      }
    }
    item = r32(item + 42);
  }
}

export function RecalcStats(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let j: number = 0, k: number = 0, item: number = 0, equipWeight: number = 0, raw: number = 0;
  LinkEquipped(creature);
  U8[creature + 199] = 0;
  item = r32(creature + 200);
  U8[creature + 256] = 0;
  equipWeight = 0;
  while (item !== 0) {
    U8[creature + 199] = U8[creature + 199] + 1;
    if (U8[item + 52] !== 0) {
      equipWeight = (equipWeight + ItemWeight(item)) | 0;
      U8[creature + 256] = U8[creature + 256] + U8[BaseItem(U8[item + 46]) + 1];
    }
    item = r32(item + 42);
  }
  raw = RawWeight(creature) | 0;
  for (let $i2 = 1; $i2 <= 2; $i2++) {
    j = $i2;
    U8[creature + j + 276] = U8[creature + j + 162];
    U8[creature + j + 278] = U8[creature + j + 164];
    U8[creature + j + 280] = I8[creature + j + 166];
  }
  for (let $i3 = 0; $i3 <= 4; $i3++) {
    k = $i3;
    U8[$f0 + k + 1] = 0;
  }
  U8[$f0] = false ? 1 : 0;
  U8[creature + 257] = 0;
  U8[$f0 + 6] = 0;
  U8[creature + 273] = U8[creature + 169];
  U8[creature + 284] = U8[creature + 114];
  U8[creature + 272] = U8[creature + 45];
  U8[$f0 + 1] = AbilAdj.DexterityArmorAdjustment(creature);
  if (r32(creature + 204) === 0) {
    U8[creature + 272] = AbilAdj.StrToHitAdjust(creature) + U8[creature + 272];
    U8[creature + 281] = AbilAdj.StrDamageAdjust(creature) + I8[creature + 281];
  }
  WeaponAdjust(creature);
  item = r32(creature + 200);
  while (item !== 0) {
    if (U8[item + 52] !== 0) {
      ArmorMoveAdjust(creature, item);
      ArmorAdjustHelper(creature, item, $f0 + 1, $f0, $f0 + 6);
    }
    item = r32(item + 42);
  }
  U8[creature + 257] = I8[creature + 257] + I8[$f0 + 6];
  if ((U8[$f0] !== 0)) {
    U8[$f0 + 4] = 0;
  }
  if (HasBagOfHolding(creature)) {
    if (raw < 5000) {
      raw = 0;
    } else {
      raw = (raw - 5000) | 0;
    }
    if (raw < equipWeight) {
      raw = equipWeight;
    }
  }
  if (raw > 65535) {
    raw = 65535;
  }
  w16(creature + 258, raw);
  EncumbranceAdjust(creature);
  if (I8[$f0 + 5] < U8[creature + 273]) {
    U8[$f0 + 5] = U8[creature + 273];
  }
  U8[creature + 273] = 0;
  for (let $i5 = 0; $i5 <= 4; $i5++) {
    k = $i5;
    U8[creature + 273] = U8[creature + 273] + I8[$f0 + k + 1];
  }
  U8[creature + 274] = (((I8[$f0 + 5] + I8[$f0 + 3]) + I8[$f0 + 4]) - 1) - 1;
  if (I8[$f0 + 1] < 0) {
    U8[creature + 274] = U8[creature + 274] + I8[$f0 + 1];
  }
  if ((WarriorLevel(creature) > 0) && (I8[creature + 46] > 0)) {
    U8[creature + 107] = WarriorLevel(creature);
  } else {
    U8[creature + 107] = 1;
  }
  if (I8[creature + 156] > 0) {
    ClassCal.RecalcThiefSkills(creature);
  }
  S.sp = $sp;
}

export function RemoveSpell(creature: number, spell: number) {
  let i: number = 0;
  i = 0;
  while ((i <= 47) && (MemorizedAt(creature, i) !== spell)) {
    i = (i + 1) & 255;
  }
  if (i <= 47) {
    SetMemorizedAt(creature, i, 0);
  }
}

export async function RemoveItem(creature: number, item: number) {
  let p: number = 0;
  if (item === 0) {
    (await Fault("Nil Item pointer..."));
  } else {
    p = r32(creature + 200);
    if (p === item) {
      w32(creature + 200, r32(item + 42));
    } else {
      while ((p !== 0) && (r32(p + 42) !== item)) {
        p = r32(p + 42);
      }
    }
    if (p === 0) {
      (await Fault("Tried to Lose item & couldn't find it!"));
    } else {
      w32(p + 42, r32(item + 42));
      w32(item + 42, 0);
      rt.freeMem(item);
    }
  }
}

export function ItemSelected(item: number, selector: number) {
  let j: number = 0, found: boolean = false, $r0: boolean = false;
  if (selector === 255) {
    found = false;
    for (let $i1 = 1; $i1 <= 3; $i1++) {
      j = $i1;
      if (U8[item + j + 46] === 152) {
        found = true;
      }
    }
    $r0 = found;
  } else {
    $r0 = U8[item + 46] === selector;
  }
  return $r0;
}

export function FindPartyItem(selector: number, owner: number) {
  let p: number = 0, item: number = 0, $r0: number = 0;
  $r0 = 0;
  w32(owner, 0);
  p = r32(229639);
  while ((p !== 0) && (r32(owner) === 0)) {
    item = r32(p + 200);
    while ((item !== 0) && (r32(owner) === 0)) {
      if (ItemSelected(item, selector)) {
        $r0 = item;
        w32(owner, p);
      }
      item = r32(item + 42);
    }
    p = r32(p + 260);
  }
  return $r0;
}

export async function UseUpItem(creature: number, item: number) {
  if (U8[item + 57] > 1) {
    U8[item + 57] = U8[item + 57] - 1;
  } else {
    (await RemoveItem(creature, item));
  }
}

export function FreeItemList(list: number) {
  let next: number = 0;
  while (r32(list) !== 0) {
    next = r32(r32(list) + 42);
    rt.freeMem(r32(list));
    w32(list, next);
  }
}

export function PrependItemCopy(list: number, item: number) {
  let n: number = 0;
  n = rt.getMem(64);
  mv(n, item, 64);
  w32(n + 42, r32(list));
  w32(list, n);
}

export function PrependEffectCopy(list: number, effect: number) {
  let n: number = 0;
  n = rt.getMem(9);
  mv(n, effect, 9);
  w32(n + 5, r32(list));
  w32(list, n);
}

export function ClearTreasure() {
  FreeItemList(230776);
  rt.fill(230748, 28, 0);
}

export function AppendItemCopy(list: number, item: number) {
  let p: number = 0, n: number = 0;
  n = rt.getMem(64);
  mv(n, item, 64);
  w32(n + 42, 0);
  p = r32(list);
  if (p === 0) {
    w32(list, n);
  } else {
    while (r32(p + 42) !== 0) {
      p = r32(p + 42);
    }
    w32(p + 42, n);
  }
}

export function SameStack(item: number, other: number) {
  let $r0: boolean = false;
  $r0 = (((((((((((((other !== item) && (U8[other + 57] > 0)) && (U8[other + 47] === U8[item + 47])) && (U8[other + 48] === U8[item + 48])) && (U8[other + 49] === U8[item + 49])) && (U8[other + 46] === U8[item + 46])) && (I8[other + 50] === I8[item + 50])) && (I8[other + 51] === I8[item + 51])) && (U8[other + 54] === U8[item + 54])) && (r16(other + 55) === r16(item + 55))) && (U8[other + 60] === U8[item + 60])) && (U8[other + 60] < 2)) && (U8[other + 61] === U8[item + 61])) && (U8[other + 62] === U8[item + 62]);
  return $r0;
}

export async function JoinStacks(creature: number, item: number) {
  let cur: number = 0, next: number = 0, dst: number = 0, qty: number = 0;
  if (U8[item + 57] === 0) {
    return;
  }
  dst = item;
  qty = U8[dst + 57];
  cur = r32(creature + 200);
  while (cur !== 0) {
    next = r32(cur + 42);
    if (SameStack(dst, cur)) {
      if ((qty + U8[cur + 57]) <= 255) {
        qty = (qty + U8[cur + 57]) & 255;
        if (U8[cur + 52] !== 0) {
          U8[dst + 52] = U8[cur + 52];
        }
        if (U8[dst + 63] === 0) {
          U8[dst + 63] = U8[cur + 63];
        }
        (await RemoveItem(creature, cur));
      } else {
        U8[dst + 57] = 255;
        U8[cur + 57] = U8[cur + 57] - (255 - qty);
        qty = U8[cur + 57];
        dst = cur;
      }
    }
    cur = next;
  }
  U8[dst + 57] = qty;
}

export function JoinsWhole(creature: number, item: number) {
  let p: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  if (U8[item + 57] > 0) {
    p = r32(creature + 200);
    while ((p !== 0) && !found) {
      found = SameStack(item, p) && ((U8[p + 57] + U8[item + 57]) <= 255);
      p = r32(p + 42);
    }
  }
  $r0 = found;
  return $r0;
}

export async function AddToInventory(creature: number, item: number) {
  let added: number = 0, p: number = 0;
  AppendItemCopy(creature + 200, item);
  if ((U8[227070] === 0) || (U8[item + 57] === 0)) {
    return;
  }
  added = r32(creature + 200);
  while (r32(added + 42) !== 0) {
    added = r32(added + 42);
  }
  p = r32(creature + 200);
  while ((p !== added) && !SameStack(added, p)) {
    p = r32(p + 42);
  }
  if (p !== added) {
    (await JoinStacks(creature, p));
  }
}

export function HasEffect(creature: number, id: number, effect: number) {
  let found: boolean = false, $r0: boolean = false;
  found = false;
  w32(effect, r32(creature + 127));
  while ((r32(effect) !== 0) && !found) {
    if (U8[r32(effect)] === id) {
      found = true;
    } else {
      w32(effect, r32(r32(effect) + 5));
    }
  }
  $r0 = found;
  return $r0;
}

export function HasteSlowRate(creature: number, n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let hasted: boolean = false, slowed: boolean = false, $r0: number = 0;
  hasted = HasEffect(creature, 39, $f0);
  slowed = HasEffect(creature, 42, $f0);
  if (hasted && !slowed) {
    if (n > 127) {
      n = 255;
    } else {
      n = (n * 2) & 255;
    }
  } else if (slowed && !hasted) {
    n = Math.trunc(n / 2);
  }
  $r0 = n;
  S.sp = $sp;
  return $r0;
}

export function InflictDamage(creature: number, dmg: number) {
  let over: number = 0, remain: number = 0, wasUp: boolean = false, hpBefore: number = 0;
  let $t1;
  if (($t1 = U8[creature + 268], $t1 === 6 || $t1 === 7 || $t1 === 8)) {
    return;
  }
  let $t2;
  wasUp = ($t2 = U8[creature + 268], $t2 === 0 || $t2 === 1);
  hpBefore = U8[creature + 283];
  over = 0;
  remain = 0;
  if ((U8[creature + 268] === 5) && (U8[227062] === 5)) {
    over = U8[r32(creature + 264) + 14] + dmg;
  } else if (U8[creature + 283] >= dmg) {
    remain = (U8[creature + 283] - dmg) & 255;
  } else {
    over = dmg - U8[creature + 283];
  }
  if ((over > 9) || ((remain === 0) && (U8[creature + 268] === 1))) {
    U8[creature + 268] = 6;
  } else if (over > 0) {
    U8[creature + 268] = 5;
    if (U8[227062] === 5) {
      U8[r32(creature + 264) + 14] = over;
    }
  } else if (remain === 0) {
    U8[creature + 268] = 4;
  }
  let $t3;
  if (!($t3 = U8[creature + 268], $t3 === 0 || $t3 === 1)) {
    U8[creature + 269] = 0;
    U8[creature + 283] = 0;
    if (U8[227062] === 5) {
      if (wasUp) {
        let $t4;
        $t4 = Team(creature) + 230780, U8[$t4] = U8[$t4] - 1;
      }
      U8[r32(creature + 264) + 3] = 0;
    }
  } else {
    U8[creature + 283] = remain;
  }
  Stats.Damaged(r32(229635), creature, hpBefore - U8[creature + 283], wasUp);
}

export function EnemyTeam(creature: number) {
  let $r0: number = 0;
  $r0 = (1 - Team(creature)) << 24 >> 24;
  return $r0;
}

export function Team(creature: number) {
  let $r0: number = 0;
  $r0 = (I8[creature + 270] & 255) & 1;
  return $r0;
}

export function CountTeams() {
  let p: number = 0;
  U8[230780] = 0;
  U8[230781] = 0;
  p = r32(229639);
  while (p !== 0) {
    if (U8[p + 269] !== 0) {
      let $t2;
      $t2 = Team(p) + 230780, U8[$t2] = U8[$t2] + 1;
    }
    p = r32(p + 260);
  }
}

export function SideEmpty() {
  let $r0: boolean = false;
  $r0 = (U8[230780] === 0) || (U8[230781] === 0);
  return $r0;
}

export function EndActions(creature: number) {
  let $r0: boolean = false;
  U8[r32(creature + 264) + 3] = 0;
  U8[r32(creature + 264)] = 0;
  U8[r32(creature + 264) + 7] = 0;
  U8[r32(creature + 264) + 6] = 0;
  $r0 = true;
  return $r0;
}

export function CanUseItems(creature: number) {
  let $r0: boolean = false;
  $r0 = ((U8[creature + 269] !== 0) && !AntiMagicArea()) && ((((U8[227062] === 2) || (U8[227062] === 3)) || (U8[227062] === 4)) || ((U8[227062] === 5) && (U8[r32(creature + 264) + 2] !== 0)));
  return $r0;
}

export function AntiMagicArea() {
  let $r0: boolean = false;
  $r0 = r16(r32(227033) + 458) > 0;
  return $r0;
}

export function PaladinReady(p: number) {
  let $r0: boolean = false;
  $r0 = ((GetClassLevel(p, 8) > 0) && (U8[p + 268] === 0)) && (U8[227062] !== 5);
  return $r0;
}

export function PaladinCanHeal(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  $r0 = PaladinReady(p) && !HasEffect(p, 140, $f0);
  S.sp = $sp;
  return $r0;
}

export function PaladinCanCure(p: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let used: number = 0, allowed: number = 0, $r0: boolean = false;
  used = 0;
  if (HasEffect(p, 141, $f0)) {
    used = U8[r32($f0) + 3];
  }
  allowed = (Math.trunc((GetClassLevel(p, 8) - 1) / 5) + 1) << 24 >> 24;
  $r0 = (PaladinReady(p) && (allowed > 0)) && (used < allowed);
  S.sp = $sp;
  return $r0;
}

export function Guard(creature: number) {
  let $r0: boolean = false;
  $r0 = EndActions(creature);
  U8[r32(creature + 264) + 7] = 1;
  return $r0;
}

export function GetCasterLevel(spell: number) {
  let own: number = 0, other: number = 0, $r0: number = 0;
  own = 0;
  other = 0;
  switch (U8[spell * 16 + 222392]) {
    case 0: {
      own = GetClassLevel(r32(229635), 1) << 16 >> 16;
      other = (GetClassLevel(r32(229635), 8) - 8) << 16 >> 16;
      break;
    }
    case 1: {
      own = GetClassLevel(r32(229635), 32) << 16 >> 16;
      other = (GetClassLevel(r32(229635), 16) - 8) << 16 >> 16;
      break;
    }
    case 2: {
      own = (GetClassLevel(r32(229635), 16) - 7) << 16 >> 16;
      break;
    }
    case 3: {
      own = 12;
      break;
    }
  }
  if (other > own) {
    own = other;
  }
  if (own < 0) {
    own = 0;
  }
  $r0 = own & 255;
  if ((U8[232343] !== 0) && (U8[spell * 16 + 222392] !== 3)) {
    $r0 = 6;
  }
  return $r0;
}

export function HasRangedWeapon(creature: number) {
  let $r0: boolean = false;
  $r0 = (r32(creature + 204) !== 0) && (U8[BaseItem(U8[r32(creature + 204) + 46]) + 12] > 1);
  return $r0;
}

export function HasThrowableWeapon(creature: number) {
  let $r0: boolean = false;
  $r0 = HasRangedWeapon(creature) && ((U8[BaseItem(U8[r32(creature + 204) + 46]) + 14] & 20) === 20);
  return $r0;
}

export function FindDamagingRangedWeapon(creature: number, sel: number) {
  let $r0: boolean = false;
  $r0 = FindAmmo(creature, r32(creature + 204), sel);
  return $r0;
}

export function FindAmmo(creature: number, w: number, sel: number) {
  let props: number = 0, $r0: boolean = false;
  $r0 = false;
  w32(sel, 0);
  props = 0;
  if (w !== 0) {
    props = U8[BaseItem(U8[w + 46]) + 14];
    if ((props & 16) !== 0) {
      w32(sel, w);
    }
    if ((props & 8) !== 0) {
      if ((props & 1) !== 0) {
        w32(sel, r32(creature + 248));
      }
      if ((props & 128) !== 0) {
        w32(sel, r32(creature + 252));
      }
    }
  }
  if ((r32(sel) !== 0) || (props === 10)) {
    $r0 = true;
  }
  return $r0;
}

export function AtLevelCap(creature: number, cls: number) {
  let lvl: number = 0, band: number = 0, str: number = 0, $r0: boolean = false;
  $r0 = false;
  if (U8[227073] === 0) {
    return $r0;
  }
  {
    const $w1 = creature;
    lvl = I8[$w1 + cls + 150];
    if (lvl <= 0) {
      return $r0;
    }
    str = PermanentStrength(creature) & 255;
    if (str < 17) {
      band = 0;
    } else if (str === 17) {
      band = 1;
    } else {
      band = 2;
    }
    let $t2;
    if ((I8[$w1 + 46] === 4) && (cls === 0)) {
      $r0 = lvl >= 5;
    } else if ((I8[$w1 + 46] === 4) && (cls === 5)) {
      $r0 = lvl >= 8;
    } else if (I8[$w1 + 46] === 6) {
      $r0 = (HalfOrcCap(creature, cls) !== 0) && (lvl >= HalfOrcCap(creature, cls));
    } else if (($t2 = I8[$w1 + 46], ($t2 >= 1 && $t2 <= 5)) && ((cls === 2) || ((cls === 4) && (I8[$w1 + 46] === 4)))) {
      $r0 = (I8[I8[$w1 + 46] * 3 + band + 239376] !== 0) && (lvl >= I8[I8[$w1 + 46] * 3 + band + 239376]);
    }
  }
  return $r0;
}

export function DiseaseStrLoss(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: number = 0;
  if (HasEffect(creature, 43, $f0)) {
    $r0 = U8[r32($f0) + 3] >>> 4;
  } else {
    $r0 = 0;
  }
  S.sp = $sp;
  return $r0;
}

export function PermanentStrength(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let p: number = 0, $r0: number = 0;
  $r0 = U8[creature + 16];
  p = r32(creature + 127);
  while (p !== 0) {
    if (((U8[p] === 12) || (U8[p] === 38)) && (U8[p + 3] < 128)) {
      AbilAdj.StrengthEffectToStrength(p, $f0, $f0 + 1);
      $r0 = AbilAdj.ClampScore(U8[$f0] - DiseaseStrLoss(creature)) & 255;
      { S.sp = $sp; return $r0; }
    }
    p = r32(p + 5);
  }
  S.sp = $sp;
  return $r0;
}

export function CanTrain(creature: number) {
  let $r0: boolean = false;
  $r0 = TrainClasses(creature, false) !== 0;
  return $r0;
}

export function TrainClasses(creature: number, anyXp: boolean) {
  let cls: number = 0, lvl: number = 0, mask: number = 0, $r0: number = 0;
  mask = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    lvl = I8[creature + cls + 150];
    if ((U8[creature + 285] & (1 << cls)) !== 0) {
      lvl = 0;
    }
    if (lvl > 0) {
      if (!AtLevelCap(creature, cls)) {
        if (ClassCal.LevelOpen(cls, lvl + 1)) {
          if (anyXp || (ClassCal.LevelXp(cls, lvl + 1) <= ri32(creature + 172))) {
            mask = (mask | (1 << cls)) & 255;
          }
        }
      }
    }
  }
  $r0 = mask;
  return $r0;
}

export function HallMask() {
  let cls: number = 0, mask: number = 0, $r0: number = 0;
  if ((U8[227076] !== 0)) {
    mask = 0;
    for (let $i1 = 0; $i1 <= 7; $i1++) {
      cls = $i1;
      mask = mask | U8[cls + 217788];
    }
    $r0 = mask;
  } else {
    $r0 = r16(r32(227037) + 1360);
  }
  return $r0;
}

export function HasBagOfHolding(creature: number) {
  let item: number = 0, $r0: boolean = false;
  $r0 = false;
  item = r32(creature + 200);
  while (item !== 0) {
    if ((U8[item + 52] !== 0) && (U8[item + 47] === 186)) {
      $r0 = true;
    }
    item = r32(item + 42);
  }
  return $r0;
}

export function RawWeight(creature: number) {
  let item: number = 0, w: number = 0, c: number = 0, $r0: number = 0;
  w = 0;
  item = r32(creature + 200);
  while (item !== 0) {
    w = (w + ItemWeight(item)) | 0;
    item = r32(item + 42);
  }
  for (let $i2 = 0; $i2 <= 6; $i2++) {
    c = $i2;
    w = (w + r16(creature + c * 2 + 136)) | 0;
  }
  $r0 = w;
  return $r0;
}

export function ItemWeight(item: number) {
  let $r0: number = 0;
  if (U8[item + 57] > 0) {
    $r0 = U8[item + 57] * r16(item + 55);
  } else {
    $r0 = r16(item + 55);
  }
  return $r0;
}

export function WarriorLevel(creature: number) {
  let $r0: number = 0;
  $r0 = GetClassLevel(creature, 28) << 24 >> 24;
  return $r0;
}

export function GetClassLevel(creature: number, mask: number) {
  let best: number = 0, cls: number = 0, $r0: number = 0;
  best = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (((mask & (1 << cls)) !== 0) && (I8[creature + cls + 150] > best)) {
      if (!ClassResting(creature, cls)) {
        best = I8[creature + cls + 150];
      }
    }
  }
  $r0 = best;
  return $r0;
}

export function IsDualClass(creature: number) {
  let $r0: boolean = false;
  $r0 = U8[creature + 285] !== 0;
  return $r0;
}

export function ClassResting(creature: number, cls: number) {
  let $r0: boolean = false;
  $r0 = ((U8[creature + 285] & (1 << cls)) !== 0) && (I8[creature + cls + 150] >= FollowedLevel(creature));
  return $r0;
}

export function CurrentClassLevel(creature: number) {
  let $r0: number = 0;
  if (IsDualClass(creature)) {
    $r0 = FollowedLevel(creature) << 24 >> 24;
  } else {
    $r0 = I8[creature + 115];
  }
  return $r0;
}

export function BaseItem(itemType: number) {
  let $r0: number = 0;
  if (itemType > 127) {
    $r0 = r32(235333) + 2048;
  } else {
    $r0 = r32(235333) + itemType * 16;
  }
  return $r0;
}

export function FixWeaponClasses(items: number) {
  U8[items + 23] = 0;
  U8[items + 71] = 1;
  U8[items + 215] = 1;
  U8[items + 407] = 1;
  U8[items + 471] = 1;
  U8[items + 519] = 1;
  U8[items + 599] = 1;
  U8[items + 631] = 1;
  U8[items + 1175] = 1;
}

export function FixAmmoBits(items: number) {
  let i: number = 0;
  {
    const $w1 = items + 336;
    U8[$w1 + 14] = (U8[$w1 + 14] & (-9)) | 20;
  }
  for (let $i2 = 0; $i2 <= 127; $i2++) {
    i = $i2;
    if ((U8[items + i * 16 + 14] & 8) === 0) {
      U8[items + i * 16 + 14] = U8[items + i * 16 + 14] & (-130);
    }
  }
}

export function IsNpc(creature: number) {
  let $r0: boolean = false;
  $r0 = U8[creature + 132] >= 128;
  return $r0;
}

export function MayTrade(creature: number) {
  let $r0: boolean = false;
  $r0 = (!IsNpc(creature) || (U8[creature + 269] === 0)) || (U8[creature + 268] === 1);
  return $r0;
}

export function IsPerson(creature: number) {
  let i: number = 0, named: boolean = false, $r0: boolean = false;
  named = false;
  for (let $i1 = 1; $i1 <= 9; $i1++) {
    i = $i1;
    if (rS(creature) === rS(i * 16 + 217516)) {
      named = true;
    }
  }
  for (let $i2 = 1; $i2 <= 2; $i2++) {
    i = $i2;
    if (rS(creature) === rS(i * 16 + 244733)) {
      named = true;
    }
  }
  $r0 = (U8[creature + 159] !== 4) && (named || ((U8[creature + 108] === 1) && ((I8[creature + 46] !== 0) || (U8[creature + 159] === 0))));
  return $r0;
}

export function SleepCost(creature: number) {
  let $r0: number = 0;
  switch (I8[creature + 115]) {
    case 0: case 1: {
      $r0 = 1;
      break;
    }
    case 2: {
      $r0 = 2;
      break;
    }
    case 3: {
      $r0 = 4;
      break;
    }
    case 4: {
      $r0 = 6;
      break;
    }
    case 5: {
      if (I8[creature + 46] === 0) {
        $r0 = 10;
      } else {
        $r0 = 20;
      }
      break;
    }
    default: {
      $r0 = 20;
    }
  }
  return $r0;
}

export function SleepTakes(creature: number, pool: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let cost: number = 0, $r0: boolean = false;
  cost = SleepCost(creature) & 255;
  $r0 = false;
  if (((U8[creature + 268] !== 1) && !HasEffect(creature, 53, $f0)) && (U8[pool] >= cost)) {
    U8[pool] = U8[pool] - cost;
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export function SleepMost(caught: number, enemy: number, foes: number, friends: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let pool: number = 0, i: number = 0, cr: number = 0;
  U8[foes] = 0;
  U8[friends] = 0;
  for (let $i1 = 4; $i1 <= 16; $i1++) {
    pool = $i1;
    U8[$f0 + 1] = 0;
    U8[$f0 + 2] = 0;
    U8[$f0] = pool;
    for (let $i2 = 1, $e2 = U8[caught]; $i2 <= $e2; $i2++) {
      i = $i2;
      cr = r32(U8[caught + i] * 4 + 230178);
      if (SleepTakes(cr, $f0)) {
        let $t3;
        $t3 = $f0 + (Team(cr) === enemy ? 1 : 0) + 1, U8[$t3] = U8[$t3] + 1;
      }
    }
    if (U8[$f0 + 2] > U8[foes]) {
      U8[foes] = U8[$f0 + 2];
    }
    if (U8[$f0 + 1] > U8[friends]) {
      U8[friends] = U8[$f0 + 1];
    }
  }
  S.sp = $sp;
}

export function CatchText(count: number, most: number, foes: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, StrUtil.NumStr(count));
  if ((most > 0) && (most < count)) {
    wS($f0, 40, rS($f0) + " OF " + StrUtil.NumStr(most));
  }
  if (foes) {
    $r0 = rS($f0) + " " + StrUtil.Pluralize(count, "ENEMY", "ENEMIES");
  } else {
    $r0 = rS($f0) + " " + StrUtil.Pluralize(count, "ALLY", "ALLIES");
  }
  S.sp = $sp;
  return $r0;
}

export function ComesUnderPlayer(creature: number) {
  let $r0: boolean = false;
  $r0 = !IsNpc(creature) && (U8[creature + 268] !== 1);
  return $r0;
}

export function ItemReadable(it: number) {
  let $r0: boolean = false;
  $r0 = false;
  if (it !== 0) {
    let $t1;
    $r0 = ($t1 = U8[BaseItem(U8[it + 46])], ($t1 >= 11 && $t1 <= 13));
  }
  return $r0;
}

export function ScrollLegible(creature: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: boolean = false;
  if (HasEffect(creature, 16, $f0) || ((GetClassLevel(creature, 1) > 0) && (U8[BaseItem(U8[item + 46])] === 12))) {
    U8[item + 53] = 0;
  }
  $r0 = U8[item + 53] === 0;
  S.sp = $sp;
  return $r0;
}

export function IsSpell(id: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((id >= 1) && (id <= 100)) {
    $r0 = U8[id * 16 + 222392] !== 3;
  }
  return $r0;
}

export function SpellSlots(creature: number, kind: number, lvl: number) {
  let $r0: number = 0;
  $r0 = 0;
  if ((lvl >= 1) && (lvl <= 5)) {
    {
      const $w1 = creature;
      switch (kind) {
        case 0: {
          if (lvl <= 3) {
            $r0 = U8[$w1 + lvl + 177];
          } else {
            $r0 = U8[$w1 + kind * 2 + lvl + 332];
          }
          break;
        }
        case 1: {
          if (lvl <= 3) {
            $r0 = U8[$w1 + lvl + 180];
          } else {
            $r0 = U8[$w1 + kind * 2 + lvl + 332];
          }
          break;
        }
        case 2: {
          $r0 = U8[$w1 + lvl + 339];
          break;
        }
      }
    }
  }
  return $r0;
}

export function SetSpellSlots(creature: number, kind: number, lvl: number, n: number) {
  if ((lvl >= 1) && (lvl <= 5)) {
    {
      const $w1 = creature;
      switch (kind) {
        case 0: {
          if (lvl <= 3) {
            U8[$w1 + lvl + 177] = n;
          } else {
            U8[$w1 + kind * 2 + lvl + 332] = n;
          }
          break;
        }
        case 1: {
          if (lvl <= 3) {
            U8[$w1 + lvl + 180] = n;
          } else {
            U8[$w1 + kind * 2 + lvl + 332] = n;
          }
          break;
        }
        case 2: {
          U8[$w1 + lvl + 339] = n;
          break;
        }
      }
    }
  }
}

export function ClearSpellSlots(creature: number, kind: number) {
  let lvl: number = 0;
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    lvl = $i1;
    SetSpellSlots(creature, kind, lvl, 0);
  }
}

export function KnowsSpell(creature: number, id: number) {
  let $r0: boolean = false;
  if ((id >= 1) && (id <= 56)) {
    $r0 = U8[creature + id + 50] !== 0;
  } else if ((id > 56) && (id <= 100)) {
    $r0 = (U8[creature + Math.trunc(((id - 56) - 1) / 8) + 345] & (1 << (((id - 56) - 1) % 8))) !== 0;
  } else {
    $r0 = false;
  }
  return $r0;
}

export function SetSpellKnown(creature: number, id: number, known: boolean) {
  let k: number = 0, bit: number = 0;
  if ((id >= 1) && (id <= 56)) {
    U8[creature + id + 50] = (known ? 1 : 0);
  } else if ((id > 56) && (id <= 100)) {
    k = Math.trunc(((id - 56) - 1) / 8) & 255;
    bit = (1 << (((id - 56) - 1) % 8)) & 255;
    if (known) {
      U8[creature + k + 345] = U8[creature + k + 345] | bit;
    } else {
      U8[creature + k + 345] = U8[creature + k + 345] & (~bit & 255);
    }
  }
}

export function MemorizedAt(creature: number, i: number) {
  let $r0: number = 0;
  if (i <= 20) {
    $r0 = U8[creature + i + 23];
  } else if (i <= 47) {
    $r0 = U8[creature + i + 330];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function SetMemorizedAt(creature: number, i: number, b: number) {
  if (i <= 20) {
    U8[creature + i + 23] = b;
  } else if (i <= 47) {
    U8[creature + i + 330] = b;
  }
}

export function GetMemorized(creature: number, all: number) {
  mv(all, creature + 23, 21);
  mv(all + 21, creature + 351, 27);
}

export function PutMemorized(creature: number, all: number) {
  mv(creature + 23, all, 21);
  mv(creature + 351, all + 21, 27);
}

export function ClearMemorized(creature: number) {
  rt.fill(creature + 23, 21, 0);
  rt.fill(creature + 351, 27, 0);
}

export function ScrollSpellAt(item: number, slot: number) {
  let id: number = 0, $r0: number = 0;
  $r0 = 0;
  if ((slot >= 1) && (slot <= 3)) {
    id = U8[item + slot + 59] & 127;
    if (IsSpell(id)) {
      $r0 = id;
    }
  }
  return $r0;
}

export function ItemSpell(item: number) {
  let id: number = 0, $r0: number = 0;
  $r0 = 0;
  if ((!ItemReadable(item) && (U8[item + 61] > 0)) && (U8[item + 62] < 128)) {
    id = U8[item + 61];
    if (id > 56) {
      id = (id - 23) & 255;
    }
    if (id <= 128) {
      $r0 = id;
    }
  }
  return $r0;
}

export function CastableScroll(creature: number, item: number) {
  let $r0: boolean = false;
  $r0 = false;
  if (ItemReadable(item)) {
    if ((U8[item + 52] !== 0) || ((U8[BaseItem(U8[item + 46]) + 13] & U8[creature + 176]) !== 0)) {
      $r0 = ScrollLegible(creature, item);
    }
  }
  return $r0;
}

export function HasScrollSpells(creature: number) {
  let item: number = 0, i: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  if (CanUseItems(creature)) {
    item = r32(creature + 200);
    while ((item !== 0) && !found) {
      if (CastableScroll(creature, item)) {
        for (let $i2 = 1; $i2 <= 3; $i2++) {
          i = $i2;
          if (ScrollSpellAt(item, i) !== 0) {
            found = true;
          }
        }
      }
      item = r32(item + 42);
    }
  }
  $r0 = found;
  return $r0;
}

export function CalcSpellRange(spell: number) {
  let r: number = 0, $r0: number = 0;
  if (!(U8[232343] !== 0)) {
    r = (U8[spell * 16 + 222394] + rt.mul(U8[spell * 16 + 222395], GetCasterLevel(spell))) & 255;
  } else {
    r = ((U8[spell * 16 + 222395] * 6) + U8[spell * 16 + 222394]) & 255;
  }
  if ((r === 0) && (U8[spell * 16 + 222398] !== 0)) {
    r = 1;
  }
  if (r === 255) {
    r = 1;
  }
  $r0 = r;
  return $r0;
}

export function SpellArea(spell: number, size: number) {
  let mode: number = 0, $r0: number = 0;
  U8[size] = 0;
  mode = U8[spell * 16 + 222398] & 15;
  if (spell === 84) {
    U8[size] = 6;
    $r0 = 6;
  } else if (spell === 92) {
    U8[size] = Math.trunc((GetCasterLevel(spell) + 1) / 2);
    if (U8[size] < 1) {
      U8[size] = 1;
    }
    $r0 = 6;
  } else {
    switch (mode) {
      case 0: {
        $r0 = 0;
        break;
      }
      case 5: {
        $r0 = 7;
        break;
      }
      case 15: {
        $r0 = 2;
        break;
      }
      case 8: case 9: case 10: case 11: case 12: case 13: case 14: {
        if (spell === 51) {
          U8[size] = 8;
          $r0 = 5;
        } else if (spell === 34) {
          U8[size] = 2;
          $r0 = 4;
        } else if (spell === 91) {
          U8[size] = 3;
          $r0 = 4;
        } else {
          U8[size] = mode & 7;
          if (((spell === 47) || (spell === 64)) && (r32(227033) !== 0)) {
            if (r16(r32(227033) + 460) === 0) {
              U8[size] = 2;
            }
          }
          $r0 = 3;
        }
        break;
      }
      default: {
        U8[size] = (mode & 3) + 1;
        $r0 = 1;
      }
    }
  }
  return $r0;
}

export function PoolCost(spell: number, target: number) {
  let cost: number = 0, $r0: number = 0;
  if (spell === 79) {
    switch (U8[target + 108] & 127) {
      case 0: case 1: {
        cost = 1;
        break;
      }
      case 2: case 3: {
        cost = 2;
        break;
      }
      default: {
        cost = 4;
      }
    }
    if (((U8[target + 108] & 128) !== 0) && (cost < 2)) {
      cost = 2;
    }
  } else {
    const $c1 = I8[target + 115];
    if ($c1 === 2) {
      cost = 2;
    } else if ($c1 === 3) {
      cost = 4;
    } else if (($c1 >= 4 && $c1 <= 127)) {
      cost = 8;
    } else {
      cost = 1;
    }
  }
  $r0 = cost;
  return $r0;
}

export function SpellDuration(spell: number, d: number) {
  function Rolled(count: number, sides: number, add: number, mult: number) {
    U8[d] = count;
    U8[d + 1] = sides;
    w16(d + 2, add);
    U8[d + 4] = mult;
  }
  switch (spell) {
    case 40: {
      Rolled(1, 6, 0, 10);
      break;
    }
    case 57: case 61: {
      Rolled(5, 4, 0, 1);
      break;
    }
    case 59: {
      Rolled(1, 4, 4, 10);
      break;
    }
    case 63: {
      if (U8[227062] === 5) {
        Rolled(2, 10, 0, 10);
      } else {
        Rolled(1, 10, 10, 10);
      }
      break;
    }
    case 128: {
      Rolled(0, 0, 24, 60);
      break;
    }
    default: {
      {
        const $w1 = spell * 16 + 222392;
        Rolled(0, 0, U8[$w1 + 4] + rt.mul(U8[$w1 + 5], GetCasterLevel(spell)), 1);
      }
    }
  }
}

export function TheftChance(chance: number, weight: number) {
  let penalty: number = 0, $r0: number = 0;
  if (weight > 255) {
    penalty = 90;
  } else if (weight > 24) {
    penalty = 50;
  } else {
    penalty = 0;
  }
  if (chance > penalty) {
    $r0 = (chance - penalty) & 255;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export async function Fault(msg: string) {
  if (r32(235329) !== 0) {
    (await rt.FT[r32(235329)](msg));
  }
}

export function HalfOrcCap(creature: number, cls: number) {
  let cap: number = 0, $r0: number = 0;
  $r0 = 0;
  switch (cls) {
    case 0: {
      cap = (4 + U8[creature + 18]) - 14;
      if (cap < 4) {
        cap = 4;
      } else if (cap > 7) {
        cap = 7;
      }
      $r0 = cap << 24 >> 24;
      break;
    }
    case 6: {
      cap = (8 + U8[creature + 19]) - 14;
      if (cap < 8) {
        cap = 8;
      } else if (cap > 11) {
        cap = 11;
      }
      $r0 = cap << 24 >> 24;
      break;
    }
  }
  return $r0;
}

export function FollowedLevel(creature: number) {
  let $r0: number = 0;
  if ((I8[creature + 47] >= 0) && (I8[creature + 47] <= 7)) {
    $r0 = I8[creature + I8[creature + 47] + 150];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function $init() {
  w32(235329, 0);
  w32(235333, 0);
}
