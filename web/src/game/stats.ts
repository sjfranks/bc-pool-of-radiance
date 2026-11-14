// Generated from src/stats.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as GameVars from './gamevars';
import * as C_GBVM from './c_gbvm';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as Party from './party';
import * as MoneyCal from './moneycal';
import * as Bestiary from './bestiary';
import * as StrUtil from './strutil';

export const KILLS = 1;
export const DAMAGE_DONE = 2;
export const DAMAGE_TAKEN = 3;
export const HEALED_GIVEN = 4;
export const HEALED_TAKEN = 5;
export const RAISED = 6;
export const POISONED = 7;
export const ITEMS_LOOTED = 8;
export const COIN_LOOTED = 9;
export const SPELLS_CAST = 10;
export const KNOCKED_DOWN = 11;
export const DIED = 12;
export const STAT_COUNT = 12;
export const KINDS = 48;
export const ENTRIES = 8;
export const SIG = "STAT";
export const VERSION = 1;

export const $at = { NAMES: 235337, game: 235553, owner: 236732, ownerName: 236764, blocks: 236892, marked: 236924, markedWorth: 236956, rec: 236988 };

export function BlockOf(creature: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  if (!Party.IsPartyMember(creature)) {
    return $r0;
  }
  i = FindEntry(creature) & 255;
  if (i === 0) {
    i = NewEntry(creature) & 255;
  }
  if (i !== 0) {
    $r0 = r32(i * 4 + 236888);
  }
  return $r0;
}

export function Count(creature: number, stat: number, n: number) {
  let b: number = 0;
  if (!Party.IsPartyMember(creature)) {
    return;
  }
  b = BlockOf(creature);
  if (b !== 0) {
    AddTo(b + stat * 4 - 4, n);
  }
  AddTo(stat * 4 + 235549, n);
}

export function Damaged(actor: number, victim: number, hp: number, wasUp: boolean) {
  let b: number = 0, down: boolean = false;
  let $t1;
  down = wasUp && !($t1 = U8[victim + 268], $t1 === 0 || $t1 === 1);
  if (Party.IsPartyMember(victim)) {
    Count(victim, 3, hp);
    if (down) {
      Count(victim, 11, 1);
    }
    if (U8[victim + 268] === 6) {
      Count(victim, 12, 1);
    }
  } else if (((U8[227062] === 5) && (actor !== victim)) && Party.IsPartyMember(actor)) {
    Count(actor, 2, hp);
    if (down) {
      Count(actor, 1, 1);
      b = BlockOf(actor);
      if (b !== 0) {
        AddKill(b, rS(victim));
      }
      AddKill(235553, rS(victim));
      Bestiary.Killed(victim);
    }
  }
}

export function Death(creature: number) {
  Count(creature, 12, 1);
}

export function Healed(actor: number, target: number, hp: number, byPower: boolean) {
  Count(target, 5, hp);
  if (byPower || (U8[230786] !== 0)) {
    Count(actor, 4, hp);
  }
}

export function MarkCoins() {
  let p: number = 0, n: number = 0;
  rt.fill(236924, 32, 0);
  p = r32(229639);
  n = 0;
  while (((p !== 0) && (n < r16(r32(227037) + 1660))) && (n < 8)) {
    n = (n + 1) & 255;
    w32(n * 4 + 236920, p);
    w32(n * 4 + 236952, MoneyCal.CreatureCopper(p));
    p = r32(p + 260);
  }
}

export function SettleCoins() {
  let n: number = 0, delta: number = 0, b: number = 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    n = $i1;
    if ((r32(n * 4 + 236920) !== 0) && Party.IsPartyMember(r32(n * 4 + 236920))) {
      delta = (MoneyCal.CreatureCopper(r32(n * 4 + 236920)) - ri32(n * 4 + 236952)) | 0;
      if (delta !== 0) {
        b = BlockOf(r32(n * 4 + 236920));
        if (b !== 0) {
          AddSigned(b + 32, delta);
        }
        AddSigned(235585, delta);
      }
    }
  }
  rt.fill(236924, 32, 0);
}

export function Forget(creature: number) {
  let i: number = 0;
  i = FindEntry(creature) & 255;
  if (i !== 0) {
    w32(i * 4 + 236728, 0);
  }
}

export function ResetGame() {
  rt.fill(235553, 1009, 0);
}

export function WriteChar(s: number, creature: number, base: string) {
  let i: number = 0, $r0: boolean = false;
  $r0 = true;
  i = FindEntry(creature) & 255;
  if (i === 0) {
    FileUtil.AddToSet(s, base + ".sts", false);
    return $r0;
  }
  rt.fill(236988, 1032, 0);
  wS(236988, 4, SIG);
  U8[236993] = 1;
  wS(236994, 15, rS(creature));
  U8[237010] = U8[creature + 171];
  mv(237011, r32(i * 4 + 236888), 1009);
  $r0 = FileUtil.WriteToSet(s, base + ".sts", 236988, 1032);
  return $r0;
}

export function ReadChar(creature: number, fn: string) {
  let i: number = 0;
  Forget(creature);
  if (!ReadFile(fn + ".sts")) {
    return;
  }
  if ((rS(236994) !== rS(creature)) || (U8[237010] !== U8[creature + 171])) {
    return;
  }
  i = NewEntry(creature) & 255;
  if (i !== 0) {
    mv(r32(i * 4 + 236888), 237011, 1009);
  }
}

export function WriteGame(s: number, name_: string) {
  let $r0: boolean = false;
  rt.fill(236988, 1032, 0);
  wS(236988, 4, SIG);
  U8[236993] = 1;
  mv(237011, 235553, 1009);
  $r0 = FileUtil.WriteToSet(s, name_, 236988, 1032);
  return $r0;
}

export function ReadGame(fn: string) {
  if (ReadFile(fn)) {
    mv(235553, 237011, 1009);
  } else {
    ResetGame();
  }
}

export function AddTo(counter: number, n: number) {
  if (n <= 0) {
    return;
  }
  if (ri32(counter) > (2147483647 - n)) {
    w32(counter, 2147483647);
  } else {
    w32(counter, ri32(counter) + n);
  }
}

export function AddKill(b: number, name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  wS($f0, 40, name_);
  let i: number = 0;
  if (U8[$f0] > 15) {
    U8[$f0] = 15;
  }
  i = 1;
  while ((i <= U8[b + 48]) && (rS(b + i * 20 + 29) !== rS($f0))) {
    i = (i + 1) & 255;
  }
  if (i > U8[b + 48]) {
    if (U8[b + 48] < 47) {
      U8[b + 48] = U8[b + 48] + 1;
      i = U8[b + 48];
    } else {
      i = 48;
      U8[b + 48] = 48;
      wS($f0, 40, "OTHER");
    }
    wS(b + i * 20 + 29, 15, rS($f0));
    if (i < 48) {
      w32(b + i * 20 + 45, 0);
    }
  }
  AddTo(b + i * 20 + 45, 1);
  S.sp = $sp;
}

export function FindEntry(creature: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    i = $i1;
    if (((r32(i * 4 + 236728) === creature) && (r32(i * 4 + 236728) !== 0)) && (rS(i * 16 + 236748) === rS(creature))) {
      $r0 = i;
    }
  }
  return $r0;
}

export function NewEntry(creature: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    i = $i1;
    if ((r32(i * 4 + 236728) === 0) || (rS(i * 16 + 236748) !== rS(r32(i * 4 + 236728)))) {
      if (r32(i * 4 + 236888) === 0) {
        w32(i * 4 + 236888, rt.getMem(1009));
      }
      rt.fill(r32(i * 4 + 236888), 1009, 0);
      w32(i * 4 + 236728, creature);
      wS(i * 16 + 236748, 15, rS(creature));
      $r0 = i;
      return $r0;
    }
  }
  return $r0;
}

export function AddSigned(counter: number, n: number) {
  if ((n > 0) && (ri32(counter) > (2147483647 - n))) {
    w32(counter, 2147483647);
  } else if ((n < 0) && (ri32(counter) < ((-2147483647) - n))) {
    w32(counter, -2147483647);
  } else {
    w32(counter, ri32(counter) + n);
  }
}

export function ReadFile(name_: string) {
  let ok: boolean = false, i: number = 0, $r0: boolean = false;
  ok = ((((FileUtil.ReadRecord(name_, 236988, 1032) && StrUtil.FitLength(236988, 4)) && (rS(236988) === SIG)) && (U8[236993] === 1)) && (U8[237059] <= 48)) && StrUtil.FitLength(236994, 15);
  if (ok) {
    for (let $i1 = 1, $e1 = U8[237059]; $i1 <= $e1; $i1++) {
      i = $i1;
      ok = ok && StrUtil.FitLength(i * 20 + 237040, 15);
    }
  }
  $r0 = ok;
  return $r0;
}

export function $init() {
  rt.fill(236732, 32, 0);
  rt.fill(236892, 32, 0);
  rt.fill(235553, 1009, 0);
  rt.fill(236924, 32, 0);
}
