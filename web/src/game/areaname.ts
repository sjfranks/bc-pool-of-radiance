// Generated from src/areaname.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';

export const LAST_SCRIPT = 29;

export const $at = { names: 240823 };

export function AreaFor(scriptId: number, mapId: number) {
  let $r0: string = "";
  if (scriptId > 29) {
    $r0 = "UNKNOWN AREA";
  } else {
    $r0 = rS(scriptId * 19 + 240823);
    if ((scriptId === 3) && (mapId === 3)) {
      $r0 = "VALJEVO CASTLE NW";
    }
    if ((scriptId === 3) && (mapId === 5)) {
      $r0 = "VALJEVO CASTLE SE";
    }
    if ((scriptId === 16) && (mapId === 30)) {
      $r0 = "LIZARD CATACOMBS";
    }
    if ((scriptId === 29) && (mapId === 32)) {
      $r0 = "KUTO'S CATACOMBS";
    }
    if ((scriptId === 24) && (mapId === 24)) {
      $r0 = "TEMPLE OF BANE";
    }
  }
  return $r0;
}

export function CurrentArea() {
  let $r0: string = "";
  $r0 = AreaFor(r16(r32(141147) + 484) & 255, U8[r32(141147) + 394]);
  return $r0;
}
