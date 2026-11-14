// Generated from src/eclvars.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_NPC from './c_npc';
import * as C_SAVE from './c_save';
import * as GameVars from './gamevars';
import * as C_ECL from './c_ecl';
import * as C_STATUS from './c_status';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_MONEY from './c_money';
import * as CharHlp from './charhlp';
import * as AbilAdj from './abiladj';
import * as GameIo from './gameio';


export const $at = { diskHook: 255426, wallSetHook: 255430, sndEffect: 255434, movedParty: 255436, redrawSky: 255437 };

export async function GetEclVar(idx: number) {
  let lo: number = 0, hi: number = 0, $r0: number = 0;
  $r0 = 0;
  lo = U8[idx + 232561];
  hi = U8[idx + 232497];
  switch (U8[idx + 232433]) {
    case 0: {
      $r0 = lo;
      break;
    }
    case 1: case 3: {
      $r0 = (await ReadGbvm((hi * 256) + lo)) & 65535;
      break;
    }
    case 128: {
      $r0 = 0;
      break;
    }
    case 2: case 129: {
      $r0 = CombineBytesToWord(lo, hi) & 65535;
      break;
    }
  }
  return $r0;
}

export function LoadEclVars(count: number) {
  let i: number = 0, strIdx: number = 0, v: number = 0, len: number = 0, t: number = 0, lo: number = 0, hi: number = 0;
  strIdx = 0;
  for (let $i1 = 1, $e1 = count; $i1 <= $e1; $i1++) {
    i = $i1;
    t = U8[r32(227045) + (r16(227060) + 1) - 39168];
    lo = U8[r32(227045) + (r16(227060) + 2) - 39168];
    w16(227060, r16(227060) + 2);
    switch (t) {
      case 1: case 2: case 3: {
        w16(227060, r16(227060) + 1);
        hi = U8[r32(227045) + r16(227060) - 39168];
        break;
      }
      case 128: {
        if (strIdx < 20) {
          strIdx = (strIdx + 1) & 255;
        }
        len = lo;
        if (len > 0) {
          ConvGbString(len, strIdx);
        } else {
          wS(r32(232626) + strIdx * 256 - 256, 255, "");
        }
        break;
      }
      case 129: {
        if (strIdx < 20) {
          strIdx = (strIdx + 1) & 255;
        }
        w16(227060, r16(227060) + 1);
        hi = U8[r32(227045) + r16(227060) - 39168];
        v = CombineBytesToWord(lo, hi) & 65535;
        DerefGbString(strIdx, v);
        break;
      }
    }
    if (i <= 64) {
      U8[i + 232433] = t;
      U8[i + 232561] = lo;
      if ((t === 1 || t === 2 || t === 3) || (t === 129)) {
        U8[i + 232497] = hi;
      }
    }
  }
  w16(227060, r16(227060) + 1);
}

export function LoadEclList(count: number) {
  w16(227060, r16(227060) - 1);
  LoadEclVars(count);
}

export function CombineBytesToWord(lowByte: number, highByte: number) {
  let $r0: number = 0;
  $r0 = (highByte * 256) + lowByte;
  return $r0;
}

export async function WriteGbvm(address: number, value: number) {
  let zone: number = 0;
  zone = GbvmZone(address) & 255;
  PutCell(zone, address, value);
  switch (zone) {
    case 0: {
      if ((address === 18941) || (address === 18942)) {
        U8[255437] = true ? 1 : 0;
      } else if ((address === 18940) && (U8[227098] !== 0)) {
        U8[227049] = value & 255;
      }
      break;
    }
    case 1: {
      (await SpecialWriteZ1(address, value));
      break;
    }
    case 4: {
      switch (address) {
        case 251: case 252: case 177: case 184: case 185: {
          break;
        }
        case 990: {
          w16(255434, value);
          break;
        }
        case 49227: {
          U8[255436] = true ? 1 : 0;
          U8[231432] = value;
          break;
        }
        case 49228: {
          U8[231433] = value;
          U8[255436] = true ? 1 : 0;
          break;
        }
        case 49229: {
          switch (value % 4) {
            case 0: {
              U8[231434] = 0;
              break;
            }
            case 1: {
              U8[231434] = 2;
              break;
            }
            case 2: {
              U8[231434] = 4;
              break;
            }
            case 3: {
              U8[231434] = 6;
              break;
            }
          }
          U8[255436] = true ? 1 : 0;
          break;
        }
        case 49241: {
          U8[232423] = value;
          U8[232636] = true ? 1 : 0;
          break;
        }
        case 49247: {
          U8[232424] = value;
          U8[232636] = true ? 1 : 0;
          break;
        }
        case 53282: {
          break;
        }
      }
      break;
    }
  }
}

export async function ReadGbvm(address: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let zone: number = 0, $r0: number = 0;
  $r0 = 0;
  zone = GbvmZone(address) & 255;
  U8[$f0] = false ? 1 : 0;
  switch (zone) {
    case 0: {
      if (address <= 18815) {
        $r0 = PartyEffectsTable(address) & 65535;
      } else {
        $r0 = GetCell(zone, address) & 65535;
      }
      break;
    }
    case 1: {
      $r0 = SpecialReadZ1(address, $f0) & 65535;
      if (!(U8[$f0] !== 0)) {
        $r0 = GetCell(zone, address) & 65535;
      }
      break;
    }
    case 2: case 3: {
      $r0 = GetCell(zone, address) & 65535;
      break;
    }
    case 4: {
      switch (address) {
        case 251: case 252: case 177: {
          $r0 = 0;
          break;
        }
        case 829: {
          $r0 = U8[231434];
          break;
        }
        case 863: {
          break;
        }
        case 49227: {
          $r0 = I8[231432] & 65535;
          break;
        }
        case 49228: {
          $r0 = I8[231433] & 65535;
          break;
        }
        case 49229: {
          $r0 = Math.trunc(U8[231434] / 2);
          break;
        }
        case 49230: {
          $r0 = U8[231435];
          break;
        }
        case 49231: {
          $r0 = U8[231436];
          break;
        }
        case 198: {
          $r0 = ((await GameIo.DemoEnding()) ? 1 : 0);
          break;
        }
        case 49241: {
          break;
        }
      }
      break;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function WriteGbvmString(address: number, s: string) {
  let zone: number = 0, len: number = 0, i: number = 0, last: number = 0;
  zone = GbvmZone(address) & 255;
  len = s.length;
  last = ZoneLast(zone) & 65535;
  if ((zone === 1) && (address === 27392)) {
    wS(r32(229635), 15, s);
  } else if (zone < 4) {
    if ((last - address) < len) {
      len = (last - address) & 255;
    }
    for (let $i1 = 0, $e1 = len - 1; $i1 <= $e1; $i1++) {
      i = $i1;
      PutCell(zone, address + i, rt.chAt(s, i + 1));
    }
    PutCell(zone, address + len, 0);
  }
}

export async function SkipEclCmd() {
  let count: number = 0;
  U8[232433] = U8[r32(227045) + r16(227060) - 39168];
  switch (U8[232433]) {
    case 1: case 2: case 10: case 14: case 17: case 18: case 29: case 32: case 45: case 50: case 52: case 56:
    case 57: case 60: case 128: {
      LoadEclVars(1);
      break;
    }
    case 3: case 8: case 9: case 15: case 16: case 31: case 34: case 54: {
      LoadEclVars(2);
      break;
    }
    case 4: case 5: case 6: case 7: case 11: case 33: case 40: case 42: case 47: case 48: case 53: case 55:
    case 59: case 12: {
      LoadEclVars(3);
      break;
    }
    case 21: {
      LoadEclVars(3);
      count = (await GetEclVar(3)) & 255;
      LoadEclList(count);
      break;
    }
    case 43: case 37: case 38: {
      LoadEclVars(2);
      count = (await GetEclVar(2)) & 255;
      LoadEclList(count);
      break;
    }
    case 20: case 35: {
      LoadEclVars(4);
      break;
    }
    case 46: {
      LoadEclVars(5);
      break;
    }
    case 30: case 44: {
      LoadEclVars(6);
      break;
    }
    case 39: {
      LoadEclVars(8);
      break;
    }
    case 41: {
      LoadEclVars(14);
      break;
    }
    default: {
      w16(227060, r16(227060) + 1);
    }
  }
}

export function GbvmZone(address: number) {
  let $r0: number = 0;
  $r0 = 4;
  if ((address >= 18688) && (address <= 19711)) {
    $r0 = 0;
  }
  if ((address >= 27392) && (address <= 28415)) {
    $r0 = 1;
  }
  if ((address >= 38656) && (address <= 39167)) {
    $r0 = 2;
  }
  if ((address >= 39168) && (address <= 49151)) {
    $r0 = 3;
  }
  return $r0;
}

export function ConvGbString(len: number, strIdx: number) {
  let i: number = 0, cur: number = 0, prev: number = 0, c6: number = 0, phase: number = 0, ch: number = 0;
  wS(r32(232626) + strIdx * 256 - 256, 255, "");
  i = 0;
  cur = 0;
  phase = 1;
  while (i < len) {
    if (phase < 4) {
      w16(227060, r16(227060) + 1);
      prev = cur;
      cur = U8[r32(227045) + r16(227060) - 39168];
      i = (i + 1) & 255;
    }
    switch (phase) {
      case 1: {
        c6 = cur >>> 2;
        break;
      }
      case 2: {
        c6 = ((prev << 6) + (cur >>> 2)) & 255;
        c6 = c6 >>> 2;
        break;
      }
      case 3: {
        c6 = ((prev << 4) + (cur >>> 4)) & 255;
        c6 = c6 >>> 2;
        break;
      }
      case 4: {
        c6 = cur & 63;
        break;
      }
    }
    if (phase < 4) {
      phase = (phase + 1) & 255;
    } else {
      phase = 1;
    }
    if (c6 !== 0) {
      ch = DecodeGameCharacter(c6) & 255;
      wS(r32(232626) + strIdx * 256 - 256, 255, rS(r32(232626) + strIdx * 256 - 256) + String.fromCharCode(ch));
    }
  }
  if (phase === 4) {
    c6 = cur & 63;
    if (c6 !== 0) {
      ch = DecodeGameCharacter(c6) & 255;
      wS(r32(232626) + strIdx * 256 - 256, 255, rS(r32(232626) + strIdx * 256 - 256) + String.fromCharCode(ch));
    }
  }
}

export function DerefGbString(strIdx: number, address: number) {
  let zone: number = 0, last: number = 0, a: number = 0, c: number = 0;
  zone = GbvmZone(address) & 255;
  wS(r32(232626) + strIdx * 256 - 256, 255, "");
  if ((zone === 1) && (address === 27392)) {
    wS(r32(232626) + strIdx * 256 - 256, 255, rS(r32(229635)));
  } else if (zone < 4) {
    last = ZoneLast(zone) & 65535;
    a = address;
    do {
      c = GetCell(zone, a) & 65535;
      if (c !== 0) {
        wS(r32(232626) + strIdx * 256 - 256, 255, rS(r32(232626) + strIdx * 256 - 256) + String.fromCharCode(c & 255));
      }
      a = (a + 1) & 65535;
    } while (!(((c === 0) || (a > last)) || (U8[r32(232626) + strIdx * 256 - 256] === 255)));
  }
}

export function DecodeGameCharacter(c: number) {
  let $r0: number = 0;
  if (c > 31) {
    $r0 = c;
  } else {
    $r0 = (c + 64) & 255;
  }
  return $r0;
}

export function FindCurCharIdx(creature: number) {
  let idx: number = 0, p: number = 0, found: boolean = false, $r0: number = 0;
  p = r32(229639);
  found = false;
  idx = 0;
  while ((p !== 0) && !found) {
    if (p === creature) {
      found = true;
    } else {
      idx = (idx + 1) & 255;
      p = r32(p + 260);
    }
  }
  $r0 = idx;
  return $r0;
}

export function SpecialReadZ1(address: number, found: number) {
  let t: number = 0, $r0: number = 0;
  U8[found] = true ? 1 : 0;
  $r0 = 0;
  switch (address) {
    case 27416: {
      $r0 = U8[r32(229635) + 20];
      break;
    }
    case 27547: {
      $r0 = U8[r32(229635) + 110];
      break;
    }
    case 27552: {
      $r0 = CharHlp.CurrentClassLevel(r32(229635)) & 65535;
      break;
    }
    case 27557: case 27558: case 27559: case 27560: case 27561: case 27562: case 27563: case 27564: {
      t = ((address - 27557) + 1) & 255;
      $r0 = U8[r32(229635) + t + 118];
      break;
    }
    case 27576: {
      $r0 = U8[r32(229635) + 132];
      break;
    }
    case 27579: {
      $r0 = r16(r32(229635) + 136);
      break;
    }
    case 27581: {
      $r0 = r16(r32(229635) + 138);
      break;
    }
    case 27583: {
      $r0 = r16(r32(229635) + 140);
      break;
    }
    case 27585: {
      $r0 = r16(r32(229635) + 142);
      break;
    }
    case 27587: {
      $r0 = r16(r32(229635) + 144);
      break;
    }
    case 27608: {
      $r0 = (U8[r32(229635) + 160] << 24 >> 24) & 65535;
      break;
    }
    case 27639: {
      $r0 = r16(r32(229635) + 184);
      break;
    }
    case 27641: {
      $r0 = U8[r32(229635) + 186];
      break;
    }
    case 27648: {
      if (U8[r32(229635) + 269] !== 0) {
        $r0 = 1;
      } else {
        $r0 = 128;
      }
      break;
    }
    case 27660: {
      if ((I8[r32(229635) + 270] === 0) && (U8[r32(229635) + 271] !== 0)) {
        $r0 = 128;
      } else if (I8[r32(229635) + 270] === 1) {
        $r0 = 129;
      } else {
        $r0 = 0;
      }
      break;
    }
    case 27661: {
      break;
    }
    case 27675: {
      $r0 = U8[r32(229635) + 284];
      break;
    }
    case 28081: case 28084: {
      $r0 = FindCurCharIdx(r32(229635)) & 65535;
      break;
    }
    case 28111: {
      let $t1;
      if (($t1 = U8[r32(229635) + 21], ($t1 >= 3 && $t1 <= 25))) {
        $r0 = AbilAdj.ChaLoyaltyBase(U8[r32(229635) + 21]) & 65535;
      }
      break;
    }
    case 28178: {
      $r0 = U8[229120];
      break;
    }
    case 28222: {
      $r0 = r16(r32(227037) + 1660);
      break;
    }
    default: {
      U8[found] = false ? 1 : 0;
    }
  }
  return $r0;
}

export async function SpecialWriteZ1(address: number, value: number) {
  let t: number = 0;
  const $c1 = address;
  if ($c1 === 27392) {
    if (value === 0) {
      U8[232631] = true ? 1 : 0;
    }
  } else if (($c1 >= 27424 && $c1 <= 27504)) {
    t = ((address - 27424) + 1) & 255;
    U8[r32(229635) + t + 23] = value;
  } else if ($c1 === 27576) {
    if (value > 178) {
      value = (value - 50) & 65535;
    }
    U8[r32(229635) + 132] = value;
  } else if ($c1 === 27579) {
    w16(r32(229635) + 136, value);
  } else if ($c1 === 27581) {
    w16(r32(229635) + 138, value);
  } else if ($c1 === 27583) {
    w16(r32(229635) + 140, value);
  } else if ($c1 === 27585) {
    w16(r32(229635) + 142, value);
  } else if ($c1 === 27587) {
    w16(r32(229635) + 144, value);
  } else if ($c1 === 27639) {
    w16(r32(229635) + 184, value);
  } else if ($c1 === 27641) {
    U8[r32(229635) + 186] = value;
  } else if ($c1 === 27648) {
    if (value >= 128) {
      U8[r32(229635) + 269] = 0;
      if (value === 135) {
        U8[r32(229635) + 268] = 7;
      }
    }
    if (value === 0) {
      U8[232630] = true ? 1 : 0;
    }
  } else if ($c1 === 27660) {
    switch (value) {
      case 0: {
        U8[r32(229635) + 270] = 0;
        U8[r32(229635) + 271] = 0;
        break;
      }
      case 128: {
        U8[r32(229635) + 270] = 0;
        U8[r32(229635) + 271] = 1;
        break;
      }
      case 129: {
        U8[r32(229635) + 270] = 1;
        U8[r32(229635) + 271] = 1;
        break;
      }
    }
  } else if ($c1 === 28178) {
    if ((value >= 1) && (value <= 8)) {
      rt.FT[r32(255426)](value);
    }
  } else if ($c1 === 28194 || $c1 === 28196 || $c1 === 28198) {
    if (value > 128) {
      (await rt.FT[r32(255430)](value & 127, Math.trunc((address - 28194) / 2) + 1));
    }
  }
  if (((address >= 27579) && (address <= 27587)) && ((address & 1) !== 0)) {
    CharHlp.RecalcStats(r32(229635));
  }
}

export function GetCell(zone: number, address: number) {
  let $r0: number = 0;
  switch (zone) {
    case 0: {
      $r0 = r16(r32(227033) + address * 2 - 37376);
      break;
    }
    case 1: {
      $r0 = r16(r32(227037) + address * 2 - 54784);
      break;
    }
    case 2: {
      $r0 = r16(r32(227041) + address * 2 - 77312);
      break;
    }
    case 3: {
      $r0 = U8[r32(227045) + address - 39168];
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function PutCell(zone: number, address: number, value: number) {
  switch (zone) {
    case 0: {
      w16(r32(227033) + address * 2 - 37376, value);
      break;
    }
    case 1: {
      w16(r32(227037) + address * 2 - 54784, value);
      break;
    }
    case 2: {
      w16(r32(227041) + address * 2 - 77312, value);
      break;
    }
    case 3: {
      U8[r32(227045) + address - 39168] = value & 255;
      break;
    }
  }
}

export function PartyEffectsTable(address: number) {
  let k: number = 0, e: number = 0, n: number = 0, p: number = 0, effect: number = 0, $r0: number = 0;
  $r0 = 0;
  k = ((address - 18688) % 64) & 65535;
  e = 0;
  n = 0;
  p = r32(229639);
  while (p !== 0) {
    effect = r32(p + 127);
    while (effect !== 0) {
      if (e === k) {
        if (address < 18752) {
          $r0 = U8[effect];
        } else {
          $r0 = n;
        }
      }
      e = (e + 1) & 65535;
      effect = r32(effect + 5);
    }
    n = (n + 1) & 255;
    p = r32(p + 260);
  }
  return $r0;
}

export function ZoneLast(zone: number) {
  let $r0: number = 0;
  switch (zone) {
    case 0: {
      $r0 = 19711;
      break;
    }
    case 1: {
      $r0 = 28415;
      break;
    }
    case 2: {
      $r0 = 39167;
      break;
    }
    case 3: {
      $r0 = 49151;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function $init() {
  w16(255434, 0);
  U8[255436] = false ? 1 : 0;
  U8[255437] = false ? 1 : 0;
}
