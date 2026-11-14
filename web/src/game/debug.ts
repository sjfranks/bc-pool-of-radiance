// Generated from src/debug.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';


export async function PrintHpDebug(msg: string, maximumHitPoints: number, currentHitPoints: number, drainedHitPoints: number) {
  if (U8[227093] !== 0) {
    TextRend.ClearRect(0, 0, 39, 0);
    TextRend.DisplayString(0, 0, 14, StrUtil.NumStr(maximumHitPoints) + " , " + StrUtil.NumStr(currentHitPoints) + " , " + StrUtil.NumStr(drainedHitPoints));
    (await TextRend.DisplayAndPause(14, msg));
    TextRend.ClearRect(0, 0, 39, 0);
  }
}
