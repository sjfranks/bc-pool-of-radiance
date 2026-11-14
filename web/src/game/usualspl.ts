// Generated from src/usualspl.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as GameVars from './gamevars';
import * as GameDefs from './gamedefs';
import * as Party from './party';
import * as CharHlp from './charhlp';
import * as C_SPELL from './c_spell';

export const USUAL_ENTRIES = 8;
export const MEM_SIG = "USPL";
export const MEM_VERSION = 2;
export const MEM_VERSION_1 = 1;

export const $at = { usualOwner: 242201, usualName: 242233, usualSpells: 242361 };

export function GetUsualSpells(creature: number, spells: number) {
  let i: number = 0, $r0: boolean = false;
  i = FindUsualEntry(creature) & 255;
  if (i > 0) {
    mv(spells, i * 48 + 242313, 48);
  }
  $r0 = i > 0;
  return $r0;
}

export function SetUsualSpells(creature: number, spells: number) {
  let i: number = 0, j: number = 0;
  if (creature === 0) {
    return;
  }
  ForgetUsualSpells(creature);
  i = 0;
  for (let $i1 = 8; $i1 >= 1; $i1--) {
    j = $i1;
    if (r32(j * 4 + 242197) === 0) {
      i = j;
    }
  }
  if (i === 0) {
    for (let $i2 = 8; $i2 >= 1; $i2--) {
      j = $i2;
      if (!Party.IsPartyMember(r32(j * 4 + 242197))) {
        i = j;
      }
    }
  }
  if (i === 0) {
    i = 1;
  }
  w32(i * 4 + 242197, creature);
  wS(i * 16 + 242217, 15, rS(creature));
  mv(i * 48 + 242313, spells, 48);
}

export function ForgetUsualSpells(creature: number) {
  let i: number = 0;
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    i = $i1;
    if (r32(i * 4 + 242197) === creature) {
      w32(i * 4 + 242197, 0);
    }
  }
}

export function WriteUsualSpells(s: number, creature: number, base: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 71);
  let $r0: boolean = false;
  $r0 = true;
  rt.fill($f0, 71, 0);
  if (GetUsualSpells(creature, $f0 + 23)) {
    wS($f0, 4, MEM_SIG);
    U8[$f0 + 5] = 2;
    wS($f0 + 6, 15, rS(creature));
    U8[$f0 + 22] = U8[creature + 171];
    $r0 = FileUtil.WriteToSet(s, base + ".mem", $f0, 71);
  } else {
    FileUtil.AddToSet(s, base + ".mem", false);
  }
  S.sp = $sp;
  return $r0;
}

export function ReadUsualSpells(creature: number, fn: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 115);
  ForgetUsualSpells(creature);
  if (FileUtil.ReadRecord(fn + ".mem", $f0, 71)) {
    if (((((rS($f0) === MEM_SIG) && (U8[$f0 + 5] === 2)) && (U8[$f0 + 6] <= 15)) && (rS($f0 + 6) === rS(creature))) && (U8[$f0 + 22] === U8[creature + 171])) {
      SetUsualSpells(creature, $f0 + 23);
    }
  } else if (FileUtil.ReadRecord(fn + ".mem", $f0 + 71, 44)) {
    if (((((rS($f0 + 71) === MEM_SIG) && (U8[$f0 + 76] === 1)) && (U8[$f0 + 77] <= 15)) && (rS($f0 + 77) === rS(creature))) && (U8[$f0 + 93] === U8[creature + 171])) {
      rt.fill($f0 + 23, 48, 0);
      mv($f0 + 23, $f0 + 94, 21);
      SetUsualSpells(creature, $f0 + 23);
    }
  }
  S.sp = $sp;
}

export function HasSlotKind(lvl: number, typ: number) {
  let $r0: boolean = false;
  $r0 = (((lvl >= 1) && (lvl <= 5)) && (typ >= 0)) && (typ <= 2);
  return $r0;
}

export function SpellSlotsRemaining(creature: number, lvl: number, typ: number) {
  let count: number = 0, $r0: number = 0;
  $r0 = 0;
  if (HasSlotKind(lvl, typ)) {
    count = SlotsUsed(creature, lvl, typ) & 255;
    if (count < CharHlp.SpellSlots(creature, typ, lvl)) {
      $r0 = (CharHlp.SpellSlots(creature, typ, lvl) - count) & 255;
    }
  }
  return $r0;
}

export function PutPending(creature: number, id: number, placed: number) {
  let i: number = 0;
  i = 0;
  while ((i <= 47) && (CharHlp.MemorizedAt(creature, i) !== 0)) {
    i = (i + 1) & 255;
  }
  U8[placed] = i <= 47 ? 1 : 0;
  if ((U8[placed] !== 0)) {
    CharHlp.SetMemorizedAt(creature, i, id + 128);
  }
}

export function SortMemorizedSpells(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 48);
  let i: number = 0, j: number = 0, tmp: number = 0;
  CharHlp.GetMemorized(creature, $f0);
  for (let $i1 = 0; $i1 <= 46; $i1++) {
    i = $i1;
    for (let $i2 = i; $i2 <= 47; $i2++) {
      j = $i2;
      if ((U8[$f0 + i] & 127) > (U8[$f0 + j] & 127)) {
        tmp = U8[$f0 + i];
        U8[$f0 + i] = U8[$f0 + j];
        U8[$f0 + j] = tmp;
      }
    }
  }
  CharHlp.PutMemorized(creature, $f0);
  S.sp = $sp;
}

export function HasPending(creature: number) {
  let i: number = 0, pending: boolean = false, $r0: boolean = false;
  pending = false;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    if (CharHlp.MemorizedAt(creature, i) > 127) {
      pending = true;
    }
  }
  $r0 = pending;
  return $r0;
}

export function QueueUsualSpells(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 97);
  let i: number = 0, j: number = 0, id: number = 0, found: boolean = false;
  if (GetUsualSpells(creature, $f0)) {
    for (let $i1 = 0; $i1 <= 47; $i1++) {
      i = $i1;
      U8[$f0 + i + 48] = CharHlp.MemorizedAt(creature, i) & 127;
    }
    for (let $i2 = 0; $i2 <= 47; $i2++) {
      i = $i2;
      id = U8[$f0 + i];
      if (CharHlp.IsSpell(id)) {
        found = false;
        for (let $i3 = 0; $i3 <= 47; $i3++) {
          j = $i3;
          if (!found && (U8[$f0 + j + 48] === id)) {
            U8[$f0 + j + 48] = 0;
            found = true;
          }
        }
        if (!found && CharHlp.KnowsSpell(creature, id)) {
          if (SpellSlotsRemaining(creature, I8[id * 16 + 136507], I8[id * 16 + 136506]) > 0) {
            PutPending(creature, id, $f0 + 96);
          }
        }
      }
    }
    SortMemorizedSpells(creature);
  }
  S.sp = $sp;
}

export function FindUsualEntry(creature: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  if (creature !== 0) {
    for (let $i1 = 1; $i1 <= 8; $i1++) {
      i = $i1;
      if ((r32(i * 4 + 242197) === creature) && (rS(i * 16 + 242217) === rS(creature))) {
        $r0 = i;
      }
    }
  }
  return $r0;
}

export function SlotsUsed(creature: number, lvl: number, typ: number) {
  let count: number = 0, i: number = 0, id: number = 0, $r0: number = 0;
  count = 0;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    id = CharHlp.MemorizedAt(creature, i) & 127;
    if (CharHlp.IsSpell(id)) {
      if ((I8[id * 16 + 136507] === lvl) && (I8[id * 16 + 136506] === typ)) {
        count = (count + 1) & 255;
      }
    }
  }
  $r0 = count;
  return $r0;
}

export function $init() {
  rt.fill(242201, 32, 0);
}
