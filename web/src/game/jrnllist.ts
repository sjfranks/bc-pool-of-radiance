// Generated from src/jrnllist.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_JRNL from './c_jrnl';
import * as Journal1 from './journal1';
import * as Journal2 from './journal2';
import * as Journal3 from './journal3';
import * as Journal4 from './journal4';

export const LINES_PER_CHUNK = 9;

export function EntryKind(index: number) {
  let $r0: number = 0;
  const $c1 = index;
  if (($c1 >= 1 && $c1 <= 18)) {
    $r0 = 1;
  } else if (($c1 >= 19 && $c1 <= 76)) {
    $r0 = 2;
  } else if (($c1 >= 77 && $c1 <= 99)) {
    $r0 = 3;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function EntryNumber(index: number) {
  let $r0: number = 0;
  const $c1 = index;
  if ($c1 === 1) {
    $r0 = 59;
  } else if ($c1 === 2) {
    $r0 = 64;
  } else if ($c1 === 3) {
    $r0 = 78;
  } else if ($c1 === 4) {
    $r0 = 101;
  } else if ($c1 === 5) {
    $r0 = 109;
  } else if ($c1 === 6) {
    $r0 = 110;
  } else if ($c1 === 7) {
    $r0 = 114;
  } else if ($c1 === 8) {
    $r0 = 120;
  } else if ($c1 === 9) {
    $r0 = 126;
  } else if ($c1 === 10) {
    $r0 = 129;
  } else if ($c1 === 11) {
    $r0 = 134;
  } else if ($c1 === 12) {
    $r0 = 154;
  } else if ($c1 === 13) {
    $r0 = 156;
  } else if ($c1 === 14) {
    $r0 = 170;
  } else if ($c1 === 15) {
    $r0 = 190;
  } else if ($c1 === 16) {
    $r0 = 201;
  } else if ($c1 === 17) {
    $r0 = 204;
  } else if ($c1 === 18) {
    $r0 = 214;
  } else if (($c1 >= 19 && $c1 <= 76)) {
    $r0 = (index - 18) << 16 >> 16;
  } else if (($c1 >= 77 && $c1 <= 99)) {
    $r0 = (index - 76) << 16 >> 16;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function ProclamationItem(number: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 1; $i1 <= 18; $i1++) {
    i = $i1;
    if (EntryNumber(i) === number) {
      $r0 = i;
    }
  }
  return $r0;
}

export function EntryLabel(index: number) {
  let $r0: string = "";
  $r0 = Heading(index, false);
  return $r0;
}

export function EntryTitle(index: number) {
  let $r0: string = "";
  $r0 = Heading(index, true);
  return $r0;
}

export function LineCount(index: number) {
  let $r0: number = 0;
  switch (index) {
    case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12:
    case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24:
    case 25: case 26: case 27: case 28: {
      $r0 = Journal1.LineCount(index) << 16 >> 16;
      break;
    }
    case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40:
    case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48: case 49: case 50: {
      $r0 = Journal2.LineCount(index) << 16 >> 16;
      break;
    }
    case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 60: case 61: case 62:
    case 63: case 64: case 65: case 66: case 67: {
      $r0 = Journal3.LineCount(index) << 16 >> 16;
      break;
    }
    case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79:
    case 80: case 81: case 82: case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: case 91:
    case 92: case 93: case 94: case 95: case 96: case 97: case 98: case 99: {
      $r0 = Journal4.LineCount(index) << 16 >> 16;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function TextLine(index: number, line: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let skip: number = 0, stop: number = 0, $r0: string = "";
  $r0 = "";
  if ((line >= 1) && (line <= LineCount(index))) {
    wS($f0, 255, TextChunk(index, Math.trunc((line - 1) / 9)));
    for (let $i1 = 1, $e1 = (line - 1) % 9; $i1 <= $e1; $i1++) {
      skip = $i1;
      wS($f0, 255, rt.Delete(rS($f0), 1, rt.Pos("\x0d", rS($f0))));
    }
    stop = rt.Pos("\x0d", rS($f0));
    if (stop > 0) {
      wS($f0, 255, rt.Delete(rS($f0), stop, U8[$f0]));
    }
    $r0 = rS($f0);
  }
  S.sp = $sp;
  return $r0;
}

export function RomanNumeral(value: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let $r0: string = "";
  function Take(amount: number, symbol: string) {
    while (value >= amount) {
      wS($f0, 255, rS($f0) + symbol);
      value = (value - amount) << 16 >> 16;
    }
  }
  wS($f0, 255, "");
  Take(1000, "M");
  Take(900, "CM");
  Take(500, "D");
  Take(400, "CD");
  Take(100, "C");
  Take(90, "XC");
  Take(50, "L");
  Take(40, "XL");
  Take(10, "X");
  Take(9, "IX");
  Take(5, "V");
  Take(4, "IV");
  Take(1, "I");
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function TextChunk(index: number, chunk: number) {
  let $r0: string = "";
  switch (index) {
    case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12:
    case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24:
    case 25: case 26: case 27: case 28: {
      $r0 = Journal1.TextChunk(index, chunk);
      break;
    }
    case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40:
    case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48: case 49: case 50: {
      $r0 = Journal2.TextChunk(index, chunk);
      break;
    }
    case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 60: case 61: case 62:
    case 63: case 64: case 65: case 66: case 67: {
      $r0 = Journal3.TextChunk(index, chunk);
      break;
    }
    case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79:
    case 80: case 81: case 82: case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: case 91:
    case 92: case 93: case 94: case 95: case 96: case 97: case 98: case 99: {
      $r0 = Journal4.TextChunk(index, chunk);
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function Heading(index: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let $r0: string = "";
  wS($f0, 5, rt.fmtI(EntryNumber(index), 0));
  switch (EntryKind(index)) {
    case 1: {
      if (long) {
        $r0 = "PROCLAMATION " + RomanNumeral(EntryNumber(index));
      } else {
        $r0 = RomanNumeral(EntryNumber(index));
      }
      break;
    }
    case 2: {
      if (long) {
        $r0 = "JOURNAL ENTRY " + rS($f0);
      } else {
        $r0 = "ENTRY " + rS($f0);
      }
      break;
    }
    case 3: {
      if (long) {
        $r0 = "TAVERN TALE " + rS($f0);
      } else {
        $r0 = "TALE " + rS($f0);
      }
      break;
    }
    default: {
      $r0 = "";
    }
  }
  S.sp = $sp;
  return $r0;
}
