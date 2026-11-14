// Generated from src/beastfil.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as FileUtil from './fileutil';
import * as Types from './types';
import * as Bestiary from './bestiary';
import * as GameVars from './gamevars';
import * as C_BEAST from './c_beast';

export const FILE_NAME = "BESTIARY.DAT";
export const BAD_NAME = "BESTIARY.BAD";
export const SIG = "BEST";
export const VERSION = 1;

export function Load() {
  LoadFrom(rS(143235) + FILE_NAME);
}

export function Flush() {
  if ((!(U8[228370] !== 0) || (U8[228371] !== 0)) || (Bestiary.Count() === 0)) {
    return;
  }
  if ((U8[228372] !== 0)) {
    FileUtil.DeleteFile(rS(143235) + BAD_NAME);
    if (!FileUtil.RenameChecked(rS(143235) + FILE_NAME, rS(143235) + BAD_NAME)) {
      return;
    }
    U8[228372] = false ? 1 : 0;
  }
  if (WriteTo(rS(143235) + FILE_NAME)) {
    U8[228370] = false ? 1 : 0;
  }
}

export function LoadFrom(fn: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 49);
  let n: number = 0, i: number = 0, ok: boolean = false, ioRes: number = 0, kept: boolean = false, short: boolean = false;
  Bestiary.Clear();
  ok = FileUtil.RecoverFile(fn);
  if (!FileUtil.OpenReadOnly($f0, fn)) {
    { S.sp = $sp; return; }
  }
  n = rt.BlockRead($f0, $f0 + 8, 9, true) & 65535;
  ok = ((((((rt.IOResult() === 0) && (n === 9)) && (rS($f0 + 8) === SIG)) && (U8[$f0 + 13] >= 1)) && (U8[$f0 + 14] >= 32)) && (r16($f0 + 15) <= 2000)) && (rt.FileSize($f0) === (9 + (r16($f0 + 15) * U8[$f0 + 14])));
  if (ok && (U8[$f0 + 13] === 1)) {
    ok = U8[$f0 + 14] === 32;
  }
  i = 0;
  short = false;
  while (ok && (i < r16($f0 + 15))) {
    i = (i + 1) & 65535;
    rt.Seek($f0, 9 + ((i - 1) * U8[$f0 + 14]));
    n = rt.BlockRead($f0, $f0 + 17, 32, true) & 65535;
    ok = (rt.IOResult() === 0) && (n === 32);
    if (ok) {
      kept = Bestiary.Append($f0 + 17);
      if (((!kept && (U8[$f0 + 17] >= 1)) && (U8[$f0 + 17] <= 15)) && (Bestiary.Find(rS($f0 + 17)) === 0)) {
        short = true;
      }
    }
  }
  rt.Close($f0);
  ioRes = rt.IOResult() << 16 >> 16;
  if (ok) {
    U8[228371] = (U8[$f0 + 13] > 1) || short ? 1 : 0;
  } else {
    Bestiary.Clear();
    U8[228372] = true ? 1 : 0;
  }
  S.sp = $sp;
}

export function WriteTo(fn: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 18);
  let $r0: boolean = false;
  rt.fill($f0 + 8, 9, 0);
  wS($f0 + 8, 4, SIG);
  U8[$f0 + 13] = 1;
  U8[$f0 + 14] = 32;
  w16($f0 + 15, Bestiary.Count());
  U8[$f0 + 17] = FileUtil.RewriteTemp($f0, fn) ? 1 : 0;
  if ((U8[$f0 + 17] !== 0)) {
    FileUtil.WriteChecked($f0, $f0 + 8, 9, $f0 + 17);
    if (r16($f0 + 15) > 0) {
      FileUtil.WriteChecked($f0, Bestiary.Entry(1), r16($f0 + 15) * 32, $f0 + 17);
    }
    U8[$f0 + 17] = FileUtil.CloseTemp($f0, fn, (U8[$f0 + 17] !== 0)) && FileUtil.PutInPlace(fn) ? 1 : 0;
  }
  $r0 = (U8[$f0 + 17] !== 0);
  S.sp = $sp;
  return $r0;
}

export function Tell(b: number, creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let effect: number = 0, i: number = 0, ac: number = 0, learned: boolean = false, $r0: boolean = false;
  function Know(fact: number, known: boolean) {
    if (Bestiary.Mark(b, fact, known) && (fact !== 20)) {
      learned = true;
    }
  }
  mv($f0, b, 32);
  learned = false;
  Know(0, true);
  Know(1, (U8[creature + 108] & 128) !== 0);
  Know(2, true);
  U8[b + 26] = I8[creature + 115];
  ac = 60 - U8[creature + 273];
  U8[b + 24] = ac;
  U8[b + 25] = ac;
  effect = r32(creature + 127);
  while (effect !== 0) {
    for (let $i2 = 1; $i2 <= 63; $i2++) {
      i = $i2;
      if (U8[i * 2 + 228371] === U8[effect]) {
        Know(U8[i * 2 + 228372], true);
      }
    }
    effect = r32(effect + 5);
  }
  Know(20, true);
  $r0 = ((learned || (I8[b + 26] !== I8[$f0 + 26])) || (I8[b + 24] !== I8[$f0 + 24])) || (I8[b + 25] !== I8[$f0 + 25]);
  S.sp = $sp;
  return $r0;
}

export function FactAt(defenses: boolean, i: number) {
  let $r0: number = 0;
  $r0 = 0;
  if (defenses) {
    switch (i) {
      case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
        $r0 = ((3 + i) - 1) & 255;
        break;
      }
      case 8: {
        $r0 = 41;
        break;
      }
      case 9: {
        $r0 = 51;
        break;
      }
      case 10: case 11: case 12: case 13: case 14: case 15: case 16: {
        $r0 = (10 + i) - 10;
        break;
      }
      case 17: {
        $r0 = 17;
        break;
      }
      case 18: {
        $r0 = 40;
        break;
      }
      case 19: {
        $r0 = 18;
        break;
      }
      case 20: {
        $r0 = 19;
        break;
      }
      case 21: {
        $r0 = 44;
        break;
      }
      case 22: {
        $r0 = 42;
        break;
      }
      case 23: {
        $r0 = 43;
        break;
      }
      case 24: {
        $r0 = 49;
        break;
      }
      case 25: {
        $r0 = 50;
        break;
      }
      case 26: {
        $r0 = 53;
        break;
      }
      case 27: {
        $r0 = 52;
        break;
      }
      case 28: {
        $r0 = 45;
        break;
      }
    }
  } else {
    switch (i) {
      case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
        $r0 = ((32 + i) - 1) & 255;
        break;
      }
      case 8: {
        $r0 = 46;
        break;
      }
      case 9: {
        $r0 = 47;
        break;
      }
      case 10: {
        $r0 = 48;
        break;
      }
      case 11: {
        $r0 = 54;
        break;
      }
      case 12: {
        $r0 = 55;
        break;
      }
      case 13: {
        $r0 = 56;
        break;
      }
    }
  }
  return $r0;
}

export function FactName(fact: number) {
  let $r0: string = "";
  switch (fact) {
    case 3: {
      $r0 = "Half: blunt";
      break;
    }
    case 4: {
      $r0 = "Half: piercing";
      break;
    }
    case 5: {
      $r0 = "Half: slashing";
      break;
    }
    case 6: {
      $r0 = "Half: magic wpns";
      break;
    }
    case 7: {
      $r0 = "Half: fire";
      break;
    }
    case 8: {
      $r0 = "Half: cold";
      break;
    }
    case 9: {
      $r0 = "Half: lightning";
      break;
    }
    case 41: {
      $r0 = "Half: silver";
      break;
    }
    case 51: {
      $r0 = "Resists fire";
      break;
    }
    case 10: {
      $r0 = "No poison";
      break;
    }
    case 11: {
      $r0 = "No paralysis";
      break;
    }
    case 12: {
      $r0 = "No sleep, charm";
      break;
    }
    case 13: {
      $r0 = "No magic missile";
      break;
    }
    case 14: {
      $r0 = "No cold";
      break;
    }
    case 15: {
      $r0 = "No fire";
      break;
    }
    case 16: {
      $r0 = "No lightning";
      break;
    }
    case 17: {
      $r0 = "Magic wpns only";
      break;
    }
    case 40: {
      $r0 = "Silver or magic";
      break;
    }
    case 18: {
      $r0 = "Resists magic";
      break;
    }
    case 19: {
      $r0 = "Regenerates";
      break;
    }
    case 44: {
      $r0 = "Fights past 0 hp";
      break;
    }
    case 42: {
      $r0 = "Blinks";
      break;
    }
    case 43: {
      $r0 = "Displaced";
      break;
    }
    case 49: {
      $r0 = "Dodges missiles";
      break;
    }
    case 50: {
      $r0 = "Dodges boulders";
      break;
    }
    case 53: {
      $r0 = "Turns invisible";
      break;
    }
    case 52: {
      $r0 = "Sees invisible";
      break;
    }
    case 45: {
      $r0 = "Escapes as gas";
      break;
    }
    case 32: {
      $r0 = "Poison";
      break;
    }
    case 33: {
      $r0 = "Paralysis";
      break;
    }
    case 34: {
      $r0 = "Level drain";
      break;
    }
    case 35: {
      $r0 = "Rotting disease";
      break;
    }
    case 36: {
      $r0 = "Petrifying gaze";
      break;
    }
    case 37: {
      $r0 = "Charming gaze";
      break;
    }
    case 38: {
      $r0 = "Burning touch";
      break;
    }
    case 46: {
      $r0 = "Fear aura";
      break;
    }
    case 47: {
      $r0 = "Drains blood";
      break;
    }
    case 48: {
      $r0 = "Acid";
      break;
    }
    case 54: {
      $r0 = "Breath weapon";
      break;
    }
    case 55: {
      $r0 = "Rakes";
      break;
    }
    case 56: {
      $r0 = "Holds fast";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function KnownCount(b: number, defenses: boolean) {
  let i: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  i = 1;
  while (FactAt(defenses, i) !== 0) {
    if (Bestiary.Knows(b, FactAt(defenses, i))) {
      n = (n + 1) & 255;
    }
    i = (i + 1) & 255;
  }
  $r0 = n;
  return $r0;
}

export function ListRows(b: number) {
  let defenses: number = 0, attacks: number = 0, n: number = 0, $r0: number = 0;
  defenses = KnownCount(b, true) & 255;
  attacks = KnownCount(b, false) & 255;
  n = ((defenses + attacks) + 3) & 255;
  if (!Bestiary.Knows(b, 20)) {
    n = (n + 2) & 255;
  } else {
    if (defenses === 0) {
      n = (n + 1) & 255;
    }
    if (attacks === 0) {
      n = (n + 1) & 255;
    }
  }
  $r0 = n;
  return $r0;
}
