// Generated from pas/gamedirs.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';

export const OS_LINUX = 0;
export const OS_MAC = 1;
export const OS_WINDOWS = 2;
export const THIS_OS = 0;
export const GAME_FOLDER = "C:\\POOLRAD\\";

export const $at = { dataFolder: 224638, writeFolder: 224894 };

export function OwnFolder(name_: string) {
  let $r0: string = "";
  $r0 = rS(224638);
  return $r0;
}

export function ReadName(name_: string) {
  let $r0: string = "";
  $r0 = rS(224894) + name_;
  return $r0;
}

export function $init() {
  wS(224638, 255, GAME_FOLDER);
  wS(224894, 255, GAME_FOLDER);
}
