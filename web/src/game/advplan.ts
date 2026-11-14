// Generated from src/advplan.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as CfgFile from './cfgfile';

export const SLOW_CLOCKS = 19900;
export const CYCLE_CLOCKS = 357954600;

export function SupportDue(advised: string, version: string) {
  let $r0: boolean = false;
  $r0 = CfgFile.Tidy(advised) !== CfgFile.Tidy(version);
  return $r0;
}

export function SpeedSlow(clocks: number) {
  let $r0: boolean = false;
  $r0 = clocks > 19900;
  return $r0;
}

export function CyclesOf(clocks: number) {
  let cycles: number = 0, $r0: number = 0;
  if (clocks <= 0) {
    $r0 = 0;
  } else {
    cycles = Math.trunc((357954600 + Math.trunc(clocks / 2)) / clocks) | 0;
    $r0 = (Math.trunc((cycles + 50) / 100) * 100) | 0;
  }
  return $r0;
}
