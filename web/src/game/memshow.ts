// Generated from src/memshow.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';


export async function ShowMemory() {
  (await TextRend.DisplayAndPause(10, "Heap free " + StrUtil.NumStr(16777216) + " big " + StrUtil.NumStr(16777216)));
  (await TextRend.DisplayAndPause(10, "Pictures " + StrUtil.NumStr(ri32(234418)) + " peak " + StrUtil.NumStr(ri32(234422))));
  TextRend.ClearBottomLine();
  U8[227106] = true ? 1 : 0;
}
