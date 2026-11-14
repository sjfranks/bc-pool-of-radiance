// Generated from src/strutil.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';


export function NumStr(n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  let $r0: string = "";
  wS($f0, 11, rt.fmtI(n, 0));
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function ZeroPad2(n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  let $r0: string = "";
  wS($f0, 11, rt.fmtI(n % 100, 0));
  if (U8[$f0] < 2) {
    wS($f0, 11, "0" + rS($f0));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function HalvesStr(halves: number) {
  let $r0: string = "";
  if ((halves & 1) !== 0) {
    $r0 = NumStr(halves) + "/2";
  } else {
    $r0 = NumStr(Math.trunc(halves / 2));
  }
  return $r0;
}

export function Grouped(n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  let i: number = 0, $r0: string = "";
  wS($f0, 15, rt.fmtI(n, 0));
  i = U8[$f0] - 3;
  while (i > 0) {
    wS($f0, 15, rt.Insert(",", rS($f0), i + 1));
    i = (i - 3) << 16 >> 16;
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function Pluralize(n: number, singular: string, plural: string) {
  let $r0: string = "";
  if (n === 1) {
    $r0 = singular;
  } else {
    $r0 = plural;
  }
  return $r0;
}

export function Count(n: number, singular: string, plural: string) {
  let $r0: string = "";
  $r0 = NumStr(n) + " " + Pluralize(n, singular, plural);
  return $r0;
}

export function FitLength(s: number, max: number) {
  let $r0: boolean = false;
  $r0 = U8[s] <= max;
  if (U8[s] > max) {
    U8[s] = max;
  }
  return $r0;
}

export function PadRight(s: string, width: number) {
  let $r0: string = "";
  s = rt.Copy(s, 1, width);
  while (s.length < width) {
    s = s + " ";
  }
  $r0 = s;
  return $r0;
}

export function PadLeft(s: string, width: number) {
  let $r0: string = "";
  s = rt.Copy(s, 1, width);
  while (s.length < width) {
    s = " " + s;
  }
  $r0 = s;
  return $r0;
}

export function MenuToOptions(menu: number, opts: number) {
  let i: number = 0;
  wS(opts, 255, "");
  i = 1;
  while (i <= U8[menu]) {
    let $t2;
    if (($t2 = U8[menu + i], ($t2 >= 65 && $t2 <= 90))) {
      U8[menu + i] = (U8[menu + i] + 32) & 255;
    }
    if (U8[menu + i] === 126) {
      wS(menu, 255, rt.Delete(rS(menu), i, 1));
      if (i <= U8[menu]) {
        U8[menu + i] = rt.UpCase(U8[menu + i]);
        wS(opts, 255, rS(opts) + String.fromCharCode(U8[menu + i]));
      }
    }
    i = (i + 1) & 255;
  }
}

export function MarkHotkey(option: string, taken: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, option);
  let at: number = 0, i: number = 0, $r0: string = "";
  at = 1;
  if ((rS($f0) !== "") && (rt.Pos(String.fromCharCode(rt.UpCase(U8[$f0 + 1])), rS(taken)) > 0)) {
    i = 2;
    while ((i <= U8[$f0]) && (at === 1)) {
      let $t2;
      if (($t2 = rt.UpCase(U8[$f0 + i]), ($t2 >= 65 && $t2 <= 90) || ($t2 >= 48 && $t2 <= 57)) && (rt.Pos(String.fromCharCode(rt.UpCase(U8[$f0 + i])), rS(taken)) === 0)) {
        at = i;
      }
      i = (i + 1) & 255;
    }
  }
  if (rS($f0) !== "") {
    wS(taken, 255, rS(taken) + String.fromCharCode(rt.UpCase(U8[$f0 + at])));
  }
  wS($f0, 255, rt.Insert("~", rS($f0), at));
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function OptionSpan(menu: string, first: number, nextFirst: number, hlFirst: number, hlLast: number) {
  U8[hlFirst] = first;
  while ((U8[hlFirst] > 1) && (rt.chAt(menu, U8[hlFirst] - 1) !== 32)) {
    U8[hlFirst] = U8[hlFirst] - 1;
  }
  if (nextFirst > first) {
    U8[hlLast] = nextFirst - 1;
    while ((U8[hlLast] > first) && (rt.chAt(menu, U8[hlLast]) !== 32)) {
      U8[hlLast] = U8[hlLast] - 1;
    }
    if (rt.chAt(menu, U8[hlLast]) !== 32) {
      U8[hlLast] = nextFirst - 1;
    }
  } else {
    U8[hlLast] = menu.length;
  }
  while ((U8[hlLast] > first) && (rt.chAt(menu, U8[hlLast]) === 32)) {
    U8[hlLast] = U8[hlLast] - 1;
  }
}

export function RemoveAll(s: string, del: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let i: number = 0, $r0: string = "";
  i = 1;
  if (del !== "") {
    while (((i + del.length) - 1) <= U8[$f0]) {
      if (rt.Copy(rS($f0), i, del.length) === del) {
        wS($f0, 255, rt.Delete(rS($f0), i, del.length));
        if (i > del.length) {
          i = (i - (del.length - 1)) & 255;
        } else {
          i = 1;
        }
      } else {
        i = (i + 1) & 255;
      }
    }
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}
