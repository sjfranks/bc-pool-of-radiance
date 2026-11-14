// Generated from src/dice.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as GameVars from './gamevars';
import * as TpRand from './tprand';


export function RollDice(n: number, sides: number) {
  let i: number = 0, total: number = 0, $r0: number = 0;
  total = 0;
  if (n > 0) {
    for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
      i = $i1;
      total = (total + (TpRand.Random(sides) + 1)) & 255;
    }
  }
  $r0 = total;
  return $r0;
}

export function RollDamageDice(n: number, sides: number) {
  let $r0: number = 0;
  U8[144901] = n;
  $r0 = RollDice(n, sides) & 255;
  return $r0;
}

export function ReduceDamagePerDie(perDie: number) {
  if (U8[144897] > U8[144901]) {
    if ((U8[144897] - U8[144901]) > (perDie * U8[144901])) {
      U8[144897] = U8[144897] - (perDie * U8[144901]);
    } else {
      U8[144897] = U8[144901];
    }
  }
}
