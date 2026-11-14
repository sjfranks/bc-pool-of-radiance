// Generated from src/moneycal.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_ITEM from './c_item';
import * as C_MONEY from './c_money';

export const PAY_NOBODY = 0;
export const PAY_CHARACTER = 1;
export const PAY_POOL = 2;
export const TEMPLE_FULL_PRICE = 1;
export const TEMPLE_TENTH_OFF = 2;
export const SAGE_FEE_PER_HD = 50;
export const SAGE_FEE_MIN = 100;

export function CopperValue(m: number) {
  let total: number = 0, i: number = 0, $r0: number = 0;
  total = 0;
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    total = (total + rt.mul(ri32(i * 4 + 131922), ri32(m + i * 4))) | 0;
  }
  $r0 = total;
  return $r0;
}

export function CoinValueInGold(m: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 28);
  mv($f0 + 0, m, 28);
  let $r0: number = 0;
  $r0 = Math.trunc(CopperValue($f0) / ri32(131934)) | 0;
  S.sp = $sp;
  return $r0;
}

export function CoinsOf(creature: number, m: number) {
  let i: number = 0;
  rt.fill(m, 28, 0);
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    w32(m + i * 4, r16(creature + i * 2 + 136));
  }
}

export function CoinRoom(creature: number, mType: number) {
  let $r0: number = 0;
  $r0 = 65535 - r16(creature + mType * 2 + 136);
  return $r0;
}

export function CreatureCopper(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 28);
  let $r0: number = 0;
  CoinsOf(creature, $f0);
  $r0 = CopperValue($f0) | 0;
  S.sp = $sp;
  return $r0;
}

export function CreatureGold(creature: number) {
  let $r0: number = 0;
  $r0 = Math.trunc(CreatureCopper(creature) / ri32(131934)) | 0;
  return $r0;
}

export function MakeChange(rem: number, cap: number, m: number) {
  let i: number = 0, n: number = 0;
  if (rem < 0) {
    rem = 0;
  }
  for (let $i1 = 4; $i1 >= 0; $i1--) {
    i = $i1;
    n = Math.trunc(rem / ri32(i * 4 + 131922)) | 0;
    if (n > cap) {
      n = cap;
    }
    w32(m + i * 4, n);
    rem = (rem - rt.mul(n, ri32(i * 4 + 131922))) | 0;
  }
}

export function Consolidate(m: number) {
  MakeChange(CopperValue(m), 65535, m);
}

export function WhoPays(buyer: number, gp: number) {
  let $r0: number = 0;
  if (gp <= CreatureGold(buyer)) {
    $r0 = 1;
  } else if (gp <= CoinValueInGold(144862)) {
    $r0 = 2;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function ItemBundle(item: number) {
  let $r0: number = 0;
  switch (U8[item + 46]) {
    case 9: case 28: case 73: {
      $r0 = 20;
      break;
    }
    default: {
      $r0 = 1;
    }
  }
  return $r0;
}

export function ItemValue(item: number) {
  let q: number = 0, $r0: number = 0;
  q = U8[item + 57];
  if (q === 0) {
    q = 1;
  }
  $r0 = Math.trunc((r16(item + 58) * q) / ItemBundle(item)) | 0;
  return $r0;
}

export function ItemSalePrice(item: number) {
  let v: number = 0, $r0: number = 0;
  v = Math.trunc(ItemValue(item) / 2) | 0;
  if (v > 65535) {
    v = 65535;
  }
  $r0 = v & 65535;
  return $r0;
}

export function ParseMoneyType(s: string, typeName: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = -1;
  i = 1;
  while ((i < s.length) && (rt.chAt(s, i) === 32)) {
    i = (i + 1) & 255;
  }
  if (i > s.length) {
    return $r0;
  }
  switch (rt.chAt(s, i)) {
    case 71: {
      if (rt.UpCase(rt.chAt(s, i + 1)) === 69) {
        $r0 = 5;
        wS(typeName, 255, "Gems ");
      } else {
        wS(typeName, 255, "Gold ");
        $r0 = 3;
      }
      break;
    }
    case 80: {
      wS(typeName, 255, "Platinum ");
      $r0 = 4;
      break;
    }
    case 69: {
      wS(typeName, 255, "electrum ");
      $r0 = 2;
      break;
    }
    case 83: {
      wS(typeName, 255, "silver ");
      $r0 = 1;
      break;
    }
    case 67: {
      wS(typeName, 255, "Copper ");
      $r0 = 0;
      break;
    }
    case 74: {
      wS(typeName, 255, "Jewelry ");
      $r0 = 6;
      break;
    }
  }
  return $r0;
}

export function TemplePrice(cost: number, mode: number) {
  let $r0: number = 0;
  if (mode === 2) {
    $r0 = (cost - Math.trunc(cost / 10)) & 65535;
  } else {
    $r0 = cost;
  }
  return $r0;
}

export function SageFee(hd: number) {
  let $r0: number = 0;
  if ((hd * 50) > 100) {
    $r0 = (hd * 50) & 65535;
  } else {
    $r0 = 100;
  }
  return $r0;
}
