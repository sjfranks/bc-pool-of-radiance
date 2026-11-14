// Generated from src/bestiary.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as C_IFC from './c_ifc';
import * as C_BEAST from './c_beast';
import * as Party from './party';

export const MAX_ENTRIES = 2000;
export const GROW = 16;
export const MET_MAX = 16;

export const $at = { dirty: 236562, readOnly: 236563, damaged: 236564, table: 236691, used: 236695, room: 236697, metIdx: 236699, metCount: 236731 };

export function Count() {
  let $r0: number = 0;
  $r0 = r16(236695);
  return $r0;
}

export function Entry(i: number) {
  let $r0: number = 0;
  if ((i >= 1) && (i <= r16(236695))) {
    $r0 = r32(236691) + i * 32 - 32;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function Find(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, name_);
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  if (U8[$f0] > 15) {
    U8[$f0] = 15;
  }
  for (let $i1 = 1, $e1 = r16(236695); $i1 <= $e1; $i1++) {
    i = $i1;
    if (rS(r32(236691) + i * 32 - 32) === rS($f0)) {
      $r0 = i;
      { S.sp = $sp; return $r0; }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function Knows(b: number, fact: number) {
  let $r0: boolean = false;
  $r0 = (fact <= 63) && ((ri32(b + Math.trunc(fact / 32) * 4 + 16) & (1 << (fact % 32))) !== 0);
  return $r0;
}

export function Mark(b: number, fact: number, known: boolean) {
  let $r0: boolean = false;
  $r0 = false;
  if ((fact > 63) || (Knows(b, fact) === known)) {
    return $r0;
  }
  w32(b + Math.trunc(fact / 32) * 4 + 16, ri32(b + Math.trunc(fact / 32) * 4 + 16) ^ (1 << (fact % 32)));
  $r0 = true;
  return $r0;
}

export function NarrowArmor(b: number, bound: number, lower: boolean) {
  if (bound < (-127)) {
    bound = -127;
  }
  if (bound > 126) {
    bound = 126;
  }
  if (lower) {
    if (bound > I8[b + 24]) {
      if (bound > I8[b + 25]) {
        U8[b + 25] = 127;
      }
      U8[b + 24] = bound;
      U8[236562] = true ? 1 : 0;
    }
  } else if (bound < I8[b + 25]) {
    if (bound < I8[b + 24]) {
      U8[b + 24] = -128;
    }
    U8[b + 25] = bound;
    U8[236562] = true ? 1 : 0;
  }
}

export function Clear() {
  if (r32(236691) !== 0) {
    rt.freeMem(r32(236691));
  }
  w32(236691, 0);
  w16(236695, 0);
  w16(236697, 0);
  U8[236562] = false ? 1 : 0;
  U8[236563] = false ? 1 : 0;
  U8[236564] = false ? 1 : 0;
  U8[236731] = 0;
}

export function Append(b: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((((U8[b] < 1) || (U8[b] > 15)) || (Find(rS(b)) !== 0)) || !Reserve(r16(236695) + 1)) {
    return $r0;
  }
  if (I8[b + 24] > I8[b + 25]) {
    U8[b + 24] = -128;
    U8[b + 25] = 127;
  }
  w16(236695, r16(236695) + 1);
  mv(r32(236691) + r16(236695) * 32 - 32, b, 32);
  $r0 = true;
  return $r0;
}

export function Met(creature: number) {
  let i: number = 0, k: number = 0;
  if (((creature === 0) || Party.IsPartyMember(creature)) || (U8[227098] !== 0)) {
    return;
  }
  i = Add(rS(creature)) & 65535;
  if (i === 0) {
    return;
  }
  for (let $i1 = 1, $e1 = U8[236731]; $i1 <= $e1; $i1++) {
    k = $i1;
    if (r16(k * 2 + 236697) === i) {
      return;
    }
  }
  if (U8[236731] < 16) {
    U8[236731] = U8[236731] + 1;
    w16(U8[236731] * 2 + 236697, i);
  }
  if (r16(r32(236691) + i * 32 - 4) < 65535) {
    let $t2;
    $t2 = r32(236691) + i * 32 - 4, w16($t2, r16($t2) + 1);
  }
  U8[236562] = true ? 1 : 0;
}

export function NewEncounter() {
  U8[236731] = 0;
}

export function Learn(beast: number, witness: number, fact: number) {
  let i: number = 0;
  i = Watched(beast, witness) & 65535;
  if (i !== 0) {
    SetFact(r32(236691) + i * 32 - 32, fact);
  }
}

export function LearnSize(beast: number, attacker: number, large: boolean) {
  let i: number = 0;
  if (attacker === 0) {
    return;
  }
  i = Watched(beast, attacker) & 65535;
  if (i === 0) {
    return;
  }
  if (Mark(r32(236691) + i * 32 - 32, 0, true)) {
    U8[236562] = true ? 1 : 0;
  }
  if (Mark(r32(236691) + i * 32 - 32, 1, large)) {
    U8[236562] = true ? 1 : 0;
  }
}

export function LearnArmor(beast: number, attacker: number, reach: number, hit: boolean) {
  let i: number = 0;
  if ((attacker === 0) || (U8[230793] !== 0)) {
    return;
  }
  if ((I8[230792] <= 1) || (I8[230792] >= 50)) {
    return;
  }
  i = Watched(beast, attacker) & 65535;
  if (i === 0) {
    return;
  }
  if (hit) {
    NarrowArmor(r32(236691) + i * 32 - 32, 60 - reach, true);
  } else {
    NarrowArmor(r32(236691) + i * 32 - 32, 59 - reach, false);
  }
}

export function LearnBlow(attacker: number, victim: number, dmg: number) {
  let i: number = 0;
  if (victim === 0) {
    return;
  }
  i = Watched(attacker, victim) & 65535;
  if ((i !== 0) && (dmg > U8[r32(236691) + i * 32 - 5])) {
    U8[r32(236691) + i * 32 - 5] = dmg;
    U8[236562] = true ? 1 : 0;
  }
}

export function Killed(victim: number) {
  let i: number = 0;
  if (((victim === 0) || Party.IsPartyMember(victim)) || (U8[227098] !== 0)) {
    return;
  }
  i = Add(rS(victim)) & 65535;
  if (i === 0) {
    return;
  }
  if (r16(r32(236691) + i * 32 - 2) < 65535) {
    let $t1;
    $t1 = r32(236691) + i * 32 - 2, w16($t1, r16($t1) + 1);
  }
  SetFact(r32(236691) + i * 32 - 32, 2);
  U8[r32(236691) + i * 32 - 6] = I8[victim + 115];
  U8[236562] = true ? 1 : 0;
}

export function SetFact(b: number, fact: number) {
  if (Mark(b, fact, true)) {
    U8[236562] = true ? 1 : 0;
  }
}

export function Reserve(n: number) {
  let p: number = 0, size: number = 0, more: number = 0, $r0: boolean = false;
  $r0 = true;
  if (n <= r16(236697)) {
    return $r0;
  }
  $r0 = false;
  if (n > 2000) {
    return $r0;
  }
  more = (Math.trunc(((n + 16) - 1) / 16) * 16) & 65535;
  if (more > 2000) {
    more = 2000;
  }
  size = (more * 32) & 65535;
  if (16777216 < size) {
    return $r0;
  }
  p = rt.getMem(size);
  if (r16(236695) > 0) {
    mv(p, r32(236691), r16(236695) * 32);
  }
  if (r32(236691) !== 0) {
    rt.freeMem(r32(236691));
  }
  w32(236691, p);
  w16(236697, more);
  $r0 = true;
  return $r0;
}

export function Add(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, name_);
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  if (U8[$f0] > 15) {
    U8[$f0] = 15;
  }
  if (rS($f0) === "") {
    { S.sp = $sp; return $r0; }
  }
  i = Find(rS($f0)) & 65535;
  if (i === 0) {
    if (!Reserve(r16(236695) + 1)) {
      { S.sp = $sp; return $r0; }
    }
    w16(236695, r16(236695) + 1);
    i = r16(236695);
    rt.fill(r32(236691) + i * 32 - 32, 32, 0);
    wS(r32(236691) + i * 32 - 32, 15, rS($f0));
    U8[r32(236691) + i * 32 - 8] = -128;
    U8[r32(236691) + i * 32 - 7] = 127;
    U8[236562] = true ? 1 : 0;
  }
  SetFact(r32(236691) + i * 32 - 32, 28);
  $r0 = i;
  S.sp = $sp;
  return $r0;
}

export function Watched(beast: number, witness: number) {
  let $r0: number = 0;
  $r0 = 0;
  if ((((beast === 0) || (U8[227062] !== 5)) || Party.IsPartyMember(beast)) || (U8[227098] !== 0)) {
    return $r0;
  }
  if ((witness !== 0) && !Party.IsPartyMember(witness)) {
    return $r0;
  }
  $r0 = Add(rS(beast)) & 65535;
  return $r0;
}

export function $init() {
  w32(236691, 0);
  w16(236695, 0);
  w16(236697, 0);
  U8[236562] = false ? 1 : 0;
  U8[236563] = false ? 1 : 0;
  U8[236564] = false ? 1 : 0;
  U8[236731] = 0;
}
