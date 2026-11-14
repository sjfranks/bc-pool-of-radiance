// Generated from src/party.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as C_GBVM from './c_gbvm';
import * as C_KEYS from './c_keys';


export function IsPartyMember(creature: number) {
  let p: number = 0, n: number = 0, $r0: boolean = false;
  $r0 = false;
  if (creature === 0) {
    return $r0;
  }
  p = r32(229639);
  n = r16(r32(227037) + 1660) << 16 >> 16;
  while ((p !== 0) && (n > 0)) {
    if (p === creature) {
      $r0 = true;
      return $r0;
    }
    p = r32(p + 260);
    n = (n - 1) << 16 >> 16;
  }
  return $r0;
}

export function SelectPrevNextChar(c: number) {
  let p: number = 0;
  p = r32(229635);
  if (p === 0) {
    p = r32(229639);
  }
  if (p !== 0) {
    switch (c) {
      case 71: case 72: {
        p = PrevCreature(p);
        break;
      }
      case 79: case 80: {
        p = NextCreature(p);
        break;
      }
    }
  }
  w32(229635, p);
}

export function MemberAt(n: number) {
  let p: number = 0, $r0: number = 0;
  p = 0;
  if ((n >= 1) && (n <= r16(r32(227037) + 1660))) {
    p = r32(229639);
    while ((p !== 0) && (n > 1)) {
      p = r32(p + 260);
      n = (n - 1) & 255;
    }
  }
  $r0 = p;
  return $r0;
}

export function AltMember(c: number) {
  let $r0: number = 0;
  if ((c >= 120) && (c <= 127)) {
    $r0 = ((c - 120) + 1) & 255;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function LastCreature() {
  let p: number = 0, $r0: number = 0;
  p = r32(229639);
  if (p !== 0) {
    while (r32(p + 260) !== 0) {
      p = r32(p + 260);
    }
  }
  $r0 = p;
  return $r0;
}

export function PrevCreature(c: number) {
  let p: number = 0, $r0: number = 0;
  p = r32(229639);
  if (p === c) {
    p = LastCreature();
  } else {
    while ((p !== 0) && (r32(p + 260) !== c)) {
      p = r32(p + 260);
    }
  }
  $r0 = p;
  return $r0;
}

export function NextCreature(c: number) {
  let $r0: number = 0;
  if ((c !== 0) && (r32(c + 260) !== 0)) {
    $r0 = r32(c + 260);
  } else {
    $r0 = r32(229639);
  }
  return $r0;
}
