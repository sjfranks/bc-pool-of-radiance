// Generated from src/clock.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_TIME from './c_time';


export function ValidateClock(clock: number, ageOnYear: boolean) {
  let i: number = 0, cur: number = 0;
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    i = $i1;
    if (r16(clock + i * 2) >= r16(i * 2 + 224456)) {
      let $t2;
      $t2 = clock + (i + 1) * 2, w16($t2, r16($t2) + 1);
      w16(clock + i * 2, r16(clock + i * 2) - r16(i * 2 + 224456));
      if ((i === 5) && ageOnYear) {
        cur = r32(229639);
        while (cur !== 0) {
          w16(cur + 48, r16(cur + 48) + 1);
          cur = r32(cur + 260);
        }
      }
    }
  }
}

export function SetFromMinutes(clock: number, minutes: number) {
  rt.fill(clock, 14, 0);
  w16(clock + 8, Math.trunc(minutes / 1440));
  w16(clock + 6, Math.trunc((minutes % 1440) / 60));
  w16(clock + 4, Math.trunc((minutes % 60) / 10));
  w16(clock + 2, minutes % 10);
}
