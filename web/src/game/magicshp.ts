// Generated from src/magicshp.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CharHlp from './charhlp';
import * as RandItem from './randitem';

export const SCROLL_PRICE_PER_LEVEL = 1200;
export const SCROLL_SPELLS = 3;
export const SCROLL_COUNT = 12;
export const WARE_COUNT = 7;
export const STOCK_COUNT = 19;

export const $at = { scrolls: 253726, wares: 253762 };

export function ScrollPrice(n: number) {
  let i: number = 0, price: number = 0, $r0: number = 0;
  price = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    price = (price + (U8[U8[n * 3 + i + 253722] * 16 + 136507] * 1200)) & 65535;
  }
  $r0 = price;
  return $r0;
}

export function MakeStockItem(n: number, item: number) {
  let i: number = 0;
  rt.fill(item, 64, 0);
  if (n <= 7) {
    {
      const $w1 = n * 7 + 253755;
      U8[item + 46] = U8[$w1];
      if (U8[$w1 + 1] !== 0) {
        RandItem.ApplyTemplate(item, U8[$w1 + 1]);
      } else {
        U8[item + 49] = U8[$w1 + 2];
        U8[item + 48] = 162;
        U8[item + 50] = 1;
        w16(item + 55, U8[$w1 + 3]);
      }
      U8[item + 57] = U8[$w1 + 4];
      w16(item + 58, r16($w1 + 5));
    }
  } else {
    U8[item + 46] = 61;
    U8[item + 49] = 209;
    U8[item + 48] = 212;
    U8[item + 50] = 1;
    w16(item + 55, 25);
    for (let $i2 = 1; $i2 <= 3; $i2++) {
      i = $i2;
      U8[item + i + 59] = U8[(n - 7) * 3 + i + 253722];
    }
    w16(item + 58, ScrollPrice(n - 7));
  }
  U8[item + 53] = 0;
}

export function StockShop() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 64);
  let n: number = 0;
  CharHlp.FreeItemList(144890);
  for (let $i1 = 1; $i1 <= 19; $i1++) {
    n = $i1;
    MakeStockItem(n, $f0);
    CharHlp.AppendItemCopy(144890, $f0);
  }
  S.sp = $sp;
}
