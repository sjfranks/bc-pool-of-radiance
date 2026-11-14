// Generated from pas/crt.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Host from './host';

export const Black = 0;
export const Blue = 1;
export const Green = 2;
export const Cyan = 3;
export const Red = 4;
export const Magenta = 5;
export const Brown = 6;
export const LightGray = 7;
export const DarkGray = 8;
export const LightBlue = 9;
export const LightGreen = 10;
export const LightCyan = 11;
export const LightRed = 12;
export const LightMagenta = 13;
export const Yellow = 14;
export const White = 15;
export const Blink = 128;

export const $at = { CheckBreak: 151678, pendingScan: 217488 };

export async function ReadKey() {
  let key: number = 0, $r0: number = 0;
  if (U8[217488] !== 0) {
    $r0 = U8[217488];
    U8[217488] = 0;
    return $r0;
  }
  if (!Host.KeyWaiting()) {
    (await Host.WaitKey());
  }
  key = Host.PopKey() & 65535;
  if ((key & 255) === 0) {
    U8[217488] = key >> 8 & 255;
  }
  $r0 = key & 255;
  return $r0;
}

export async function KeyPressed() {
  let $r0: boolean = false;
  if ((U8[217488] === 0) && !Host.KeyWaiting()) {
    (await Host.Idle());
    $r0 = Host.KeyWaiting();
  } else {
    $r0 = true;
  }
  return $r0;
}

export async function Delay(ms: number) {
  (await Host.Sleep(ms));
}

export function Sound(hz: number) {
}

export function NoSound() {
}

export function $init() {
  U8[151678] = true ? 1 : 0;
}
