// Generated from pas/natfile.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';


export function NativeName(name_: string) {
  let $r0: string = "";
  $r0 = name_;
  return $r0;
}

export function SameName(a: string, b: string) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  if (a.length !== b.length) {
    return $r0;
  }
  for (let $i1 = 1, $e1 = a.length; $i1 <= $e1; $i1++) {
    i = $i1;
    if (rt.UpCase(rt.chAt(a, i)) !== rt.UpCase(rt.chAt(b, i))) {
      return $r0;
    }
  }
  $r0 = true;
  return $r0;
}
