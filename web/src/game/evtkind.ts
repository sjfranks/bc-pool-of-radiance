// Generated from src/evtkind.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as C_ECL from './c_ecl';
import * as C_GBVM from './c_gbvm';
import * as EclVars from './eclvars';

export const KIND_NONE = 0;
export const KIND_EVENT = 1;
export const KIND_MESSAGE = 2;
export const KIND_TRAP = 3;
export const KIND_TREASURE = 4;
export const KIND_SERVICE = 5;
export const KIND_FIGHT = 6;
export const KIND_EXIT = 7;
export const MAX_VARS = 8;
export const MAX_DISPATCH = 96;
export const MAX_QUEUE = 512;
export const MAX_SCAN = 256;
export const MAX_FOLLOW = 160;
export const UNKNOWN = 255;

export const $at = { dispatchCount: 251010, dispatch: 251011, queue: 251491, queueLen: 252515, visited: 252517, varCount: 252521, vars: 252522, varMasks: 252538, varOffsets: 252546, kinds: 252554 };

export async function Prepare() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let a: number = 0, op: number = 0, i: number = 0, v2: number = 0, head: number = 0, eventBit: number = 0, guarded: number = 0;
  U8[251010] = 0;
  w16(252515, 0);
  rt.fill(252554, 256, 255);
  w32(252517, rt.getMem(1248));
  rt.fill(r32(252517), 1248, 0);
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    i = $i1;
    Push(r16(i * 2 + 141162));
  }
  head = 1;
  while (head <= r16(252515)) {
    a = r16(head * 2 + 251489);
    head = (head + 1) & 65535;
    op = (await Decode(a, $f0)) & 255;
    switch (op) {
      case 0: case 19: case 32: {
        break;
      }
      case 1: {
        Push(Operand(1, $f0 + 4));
        break;
      }
      case 2: {
        Push(Operand(1, $f0 + 4));
        Push(r16($f0));
        break;
      }
      case 37: case 38: {
        ListHead(a, $f0 + 6, $f0 + 4, $f0 + 8);
        for (let $i3 = 1, $e3 = U8[$f0 + 8]; $i3 <= $e3; $i3++) {
          i = $i3;
          Push(Operand(i, $f0 + 5));
        }
        if (op === 38) {
          Push(r16($f0));
        }
        break;
      }
      case 22: case 23: case 24: case 25: case 26: case 27: {
        Push(r16($f0));
        guarded = (await Decode(r16($f0), $f0 + 2)) & 255;
        Push(r16($f0 + 2));
        break;
      }
      default: {
        if (op === 47 || op === 3) {
          w16($f0 + 6, Operand(1, $f0 + 4));
          v2 = Operand(2, $f0 + 5) & 65535;
          if (((U8[$f0 + 4] !== 0) && (r16($f0 + 6) === 49231)) || ((U8[$f0 + 5] !== 0) && (v2 === 49231))) {
            U8[252521] = 0;
            eventBit = VarBit(49231, 255, 0) & 255;
            if (op === 3) {
              (await Scan(a, eventBit));
            } else {
              if (r16($f0 + 6) === 49231) {
                w16($f0 + 6, v2);
              }
              (await Scan(r16($f0), eventBit | VarBit(Operand(3, $f0 + 4), r16($f0 + 6) & 255, 0)));
            }
          }
        }
        Push(r16($f0));
      }
    }
  }
  rt.freeMem(r32(252517));
  S.sp = $sp;
}

export async function Kind(event: number) {
  let i: number = 0, k: number = 0, t: number = 0, found: boolean = false, $r0: number = 0;
  $r0 = 0;
  if (event === 0) {
    return $r0;
  }
  if (U8[event + 252554] !== 255) {
    $r0 = U8[event + 252554];
    return $r0;
  }
  k = 1;
  found = false;
  for (let $i1 = 1, $e1 = U8[251010]; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((event & U8[i * 5 + 251006]) === U8[i * 5 + 251007]) {
      t = (await KindAt(r16(i * 5 + 251008), (U8[i * 5 + 251010] !== 0))) & 255;
      if (!found || (t > k)) {
        k = t;
      }
      found = true;
    }
  }
  U8[event + 252554] = k;
  $r0 = k;
  return $r0;
}

export function Operand(i: number, isAddr: number) {
  let $r0: number = 0;
  let $t1;
  U8[isAddr] = ($t1 = U8[i + 146547], $t1 === 1 || $t1 === 3) ? 1 : 0;
  let $t2;
  if (($t2 = U8[i + 146547], $t2 === 1 || $t2 === 2 || $t2 === 3)) {
    $r0 = EclVars.CombineBytesToWord(U8[i + 146675], U8[i + 146611]) & 65535;
  } else {
    $r0 = U8[i + 146675];
  }
  return $r0;
}

export function ListHead(a: number, v: number, isAddr: number, n: number) {
  let t: number = 0;
  t = U8[r32(141159) + (a + 1) - 39168];
  U8[isAddr] = t === 1 || t === 3 ? 1 : 0;
  w16(v, U8[r32(141159) + (a + 2) - 39168]);
  a = (a + 3) & 65535;
  if (t === 1 || t === 2 || t === 3) {
    w16(v, EclVars.CombineBytesToWord(r16(v) & 255, U8[r32(141159) + a - 39168]));
    a = (a + 1) & 65535;
  }
  U8[n] = 0;
  let $t1;
  if (($t1 = U8[r32(141159) + a - 39168], $t1 === 0 || $t1 === 2)) {
    U8[n] = U8[r32(141159) + (a + 1) - 39168];
  }
}

export function InScript(a: number) {
  let $r0: boolean = false;
  $r0 = (a >= 39168) && (a <= 49151);
  return $r0;
}

export async function Decode(a: number, next: number) {
  let savedIp: number = 0, savedOp: number = 0, $r0: number = 0;
  savedIp = r16(141174);
  savedOp = U8[146547];
  w16(141174, a);
  (await EclVars.SkipEclCmd());
  $r0 = U8[146547];
  w16(next, r16(141174));
  w16(141174, savedIp);
  U8[146547] = savedOp;
  return $r0;
}

export function WrittenVar(a: number, op: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: number = 0;
  $r0 = 0;
  switch (op) {
    case 9: case 8: case 15: case 16: {
      $r0 = Operand(2, $f0) & 65535;
      break;
    }
    case 6: case 7: case 42: case 47: case 48: {
      $r0 = Operand(3, $f0) & 65535;
      break;
    }
    case 21: case 43: {
      ListHead(a, $f0 + 1, $f0, $f0 + 3);
      $r0 = r16($f0 + 1);
      break;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function AddDispatch(mask: number, value: number, target: number, single: boolean) {
  let i: number = 0;
  if (!InScript(target)) {
    return;
  }
  value = value & mask;
  for (let $i1 = 1, $e1 = U8[251010]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (((U8[i * 5 + 251006] === mask) && (U8[i * 5 + 251007] === value)) && (r16(i * 5 + 251008) === target)) {
      return;
    }
  }
  if (U8[251010] < 96) {
    U8[251010] = U8[251010] + 1;
    U8[U8[251010] * 5 + 251006] = mask;
    U8[U8[251010] * 5 + 251007] = value;
    w16(U8[251010] * 5 + 251008, target);
    U8[U8[251010] * 5 + 251010] = single ? 1 : 0;
  }
}

export function VarBit(v: number, mask: number, offset: number) {
  let k: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1, $e1 = U8[252521]; $i1 <= $e1; $i1++) {
    k = $i1;
    if ((r16(k * 2 + 252520) === v) && ((mask === 0) || (U8[k + 252545] === offset))) {
      $r0 = (1 << (k - 1)) & 255;
      return $r0;
    }
  }
  if ((mask !== 0) && (U8[252521] < 8)) {
    U8[252521] = U8[252521] + 1;
    w16(U8[252521] * 2 + 252520, v);
    U8[U8[252521] + 252537] = mask;
    U8[U8[252521] + 252545] = offset;
    $r0 = (1 << (U8[252521] - 1)) & 255;
  }
  return $r0;
}

export function Bits(v: number, live: number) {
  let k: number = 0, b: number = 0, $r0: number = 0;
  b = 0;
  for (let $i1 = 1, $e1 = U8[252521]; $i1 <= $e1; $i1++) {
    k = $i1;
    if (r16(k * 2 + 252520) === v) {
      b = (b | (1 << (k - 1))) & 255;
    }
  }
  $r0 = b & live;
  return $r0;
}

export function LiveVar(v: number, live: number, mask: number, offset: number) {
  let k: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 1, $e1 = U8[252521]; $i1 <= $e1; $i1++) {
    k = $i1;
    if ((r16(k * 2 + 252520) === v) && ((live & (1 << (k - 1))) !== 0)) {
      U8[mask] = U8[k + 252537];
      U8[offset] = U8[k + 252545];
      $r0 = true;
    }
  }
  return $r0;
}

export async function Scan(start: number, live: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 780);
  let todoLen: number = 0, head: number = 0, a: number = 0, op: number = 0, v2: number = 0, i: number = 0, w: number = 0, guarded: number = 0;
  function Follow(t: number, l: number) {
    let k: number = 0;
    if ((!InScript(t) || (l === 0)) || (todoLen >= 256)) {
      return;
    }
    for (let $i1 = 1, $e1 = todoLen; $i1 <= $e1; $i1++) {
      k = $i1;
      if (r16($f0 + k * 2 - 2) === t) {
        return;
      }
    }
    todoLen = (todoLen + 1) & 65535;
    w16($f0 + todoLen * 2 - 2, t);
    U8[$f0 + todoLen + 511] = l;
  }
  todoLen = 0;
  Follow(start, live);
  head = 1;
  while (head <= todoLen) {
    a = r16($f0 + head * 2 - 2);
    live = U8[$f0 + head + 511];
    head = (head + 1) & 65535;
    op = (await Decode(a, $f0 + 768)) & 255;
    switch (op) {
      case 0: case 19: case 32: {
        w16($f0 + 768, 0);
        break;
      }
      case 1: {
        Follow(Operand(1, $f0 + 772), live);
        w16($f0 + 768, 0);
        break;
      }
      case 37: case 38: {
        ListHead(a, $f0 + 774, $f0 + 772, $f0 + 778);
        if ((U8[$f0 + 772] !== 0) && LiveVar(r16($f0 + 774), live, $f0 + 776, $f0 + 777)) {
          for (let $i3 = 1, $e3 = U8[$f0 + 778]; $i3 <= $e3; $i3++) {
            i = $i3;
            AddDispatch(U8[$f0 + 776], (i - 1) + U8[$f0 + 777], Operand(i, $f0 + 773), false);
          }
        }
        if (op === 37) {
          w16($f0 + 768, 0);
        }
        break;
      }
      case 3: {
        w16($f0 + 774, Operand(1, $f0 + 772));
        v2 = Operand(2, $f0 + 773) & 65535;
        U8[$f0 + 776] = 0;
        if ((!((U8[$f0 + 772] !== 0) && LiveVar(r16($f0 + 774), live, $f0 + 776, $f0 + 777)) && (U8[$f0 + 773] !== 0)) && LiveVar(v2, live, $f0 + 776, $f0 + 777)) {
          v2 = r16($f0 + 774);
          U8[$f0 + 773] = (U8[$f0 + 772] !== 0) ? 1 : 0;
        }
        if ((U8[$f0 + 776] !== 0) && ((await Decode(r16($f0 + 768), $f0 + 770)) === 22)) {
          if ((U8[$f0 + 773] !== 0)) {
            Follow(r16($f0 + 770), live | VarBit(v2, U8[$f0 + 776], U8[$f0 + 777]));
          } else {
            AddDispatch(U8[$f0 + 776], (v2 & 255) + U8[$f0 + 777], r16($f0 + 770), true);
          }
        }
        break;
      }
      case 22: case 23: case 24: case 25: case 26: case 27: {
        guarded = (await Decode(r16($f0 + 768), $f0 + 770)) & 255;
        Follow(r16($f0 + 770), live);
        break;
      }
      case 4: case 5: {
        w16($f0 + 774, Operand(1, $f0 + 772));
        v2 = Operand(2, $f0 + 773) & 65535;
        w = Operand(3, $f0 + 779) & 65535;
        if (((!(U8[$f0 + 772] !== 0) && (U8[$f0 + 773] !== 0)) && (v2 === w)) && LiveVar(w, live, $f0 + 776, $f0 + 777)) {
          if (op === 4) {
            U8[$f0 + 777] = U8[$f0 + 777] - (r16($f0 + 774) & 255);
          } else {
            U8[$f0 + 777] = U8[$f0 + 777] + (r16($f0 + 774) & 255);
          }
          live = ((live & (~Bits(w, live) & 255)) | VarBit(w, U8[$f0 + 776], U8[$f0 + 777])) & 255;
        } else {
          live = live & (~Bits(w, live) & 255);
        }
        break;
      }
      default: {
        w = WrittenVar(a, op) & 65535;
        if (w !== 0) {
          live = live & (~Bits(w, live) & 255);
        }
      }
    }
    if (r16($f0 + 768) !== 0) {
      Follow(r16($f0 + 768), live);
    }
  }
  S.sp = $sp;
}

export function Push(a: number) {
  let k: number = 0;
  if (!InScript(a)) {
    return;
  }
  k = (a - 39168) & 65535;
  if ((U8[r32(252517) + Math.trunc(k / 8)] & (1 << (k % 8))) !== 0) {
    return;
  }
  U8[r32(252517) + Math.trunc(k / 8)] = U8[r32(252517) + Math.trunc(k / 8)] | (1 << (k % 8));
  if (r16(252515) < 512) {
    w16(252515, r16(252515) + 1);
    w16(r16(252515) * 2 + 251489, a);
  }
}

export async function KindAt(a: number, single: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 329);
  let todoLen: number = 0, head: number = 0, op: number = 0, i: number = 0, sawExit: boolean = false, sawService: boolean = false, sawFight: boolean = false, sawTreasure: boolean = false, sawTrap: boolean = false, sawMessage: boolean = false, only: number = 0, guarded: number = 0, $r0: number = 0;
  function Follow(t: number) {
    let k: number = 0;
    if (!InScript(t) || (todoLen >= 160)) {
      return;
    }
    for (let $i1 = 1, $e1 = todoLen; $i1 <= $e1; $i1++) {
      k = $i1;
      if (r16($f0 + k * 2 - 2) === t) {
        return;
      }
    }
    todoLen = (todoLen + 1) & 255;
    w16($f0 + todoLen * 2 - 2, t);
  }
  sawExit = false;
  sawService = false;
  sawFight = false;
  sawTreasure = false;
  sawTrap = false;
  sawMessage = false;
  todoLen = 0;
  only = a;
  Follow(a);
  head = 1;
  while (head <= todoLen) {
    a = r16($f0 + head * 2 - 2);
    head = (head + 1) & 255;
    op = (await Decode(a, $f0 + 320)) & 255;
    switch (op) {
      case 0: case 19: {
        w16($f0 + 320, 0);
        break;
      }
      case 32: {
        sawExit = true;
        w16($f0 + 320, 0);
        break;
      }
      case 36: case 41: case 11: {
        sawFight = true;
        break;
      }
      case 56: {
        sawService = true;
        break;
      }
      case 9: {
        w16($f0 + 326, Operand(2, $f0 + 324));
        if ((U8[$f0 + 324] !== 0) && ((r16($f0 + 326) === 28268) || (r16($f0 + 326) === 28130))) {
          sawService = true;
        }
        break;
      }
      case 39: {
        sawTreasure = true;
        break;
      }
      case 46: {
        sawTrap = true;
        break;
      }
      case 17: case 18: case 51: {
        sawMessage = true;
        break;
      }
      case 1: {
        Follow(Operand(1, $f0 + 324));
        w16($f0 + 320, 0);
        break;
      }
      case 2: {
        Follow(Operand(1, $f0 + 324));
        break;
      }
      case 37: case 38: {
        ListHead(a, $f0 + 326, $f0 + 324, $f0 + 328);
        for (let $i3 = 1, $e3 = U8[$f0 + 328]; $i3 <= $e3; $i3++) {
          i = $i3;
          Follow(Operand(i, $f0 + 325));
        }
        if (op === 37) {
          w16($f0 + 320, 0);
        }
        break;
      }
      case 22: case 23: case 24: case 25: case 26: case 27: {
        if (single && (a === only)) {
          only = r16($f0 + 320);
        } else {
          guarded = (await Decode(r16($f0 + 320), $f0 + 322)) & 255;
          Follow(r16($f0 + 322));
        }
        break;
      }
    }
    if ((single && (a === only)) && !(op === 1 || op === 2)) {
      w16($f0 + 320, 0);
    }
    if (r16($f0 + 320) !== 0) {
      Follow(r16($f0 + 320));
    }
  }
  if (sawExit) {
    $r0 = 7;
  } else if (sawService) {
    $r0 = 5;
  } else if (sawFight) {
    $r0 = 6;
  } else if (sawTreasure) {
    $r0 = 4;
  } else if (sawTrap) {
    $r0 = 3;
  } else if (sawMessage) {
    $r0 = 2;
  } else {
    $r0 = 0;
  }
  S.sp = $sp;
  return $r0;
}
