// Generated from src/advisory.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as GameIo from './gameio';
import * as SoundDrv from './sounddrv';
import * as Options from './options';
import * as AdvPlan from './advplan';
import * as StrUtil from './strutil';

export const SUPPORT_EMAIL = "talonius@brazencrows.com";
export const AT_SLOT = 64;
export const NAME_COLOR = 14;
export const VERSION_COLOR = 11;
export const TEXT_COLOR = 10;
export const KEY_COLOR = 15;
export const TEXT_COL = 1;
export const PART_LINES = 4;

export const $at = { speedClocks: 257253, AT_BITMAP: 257257 };

export function Measure() {
  w32(257253, 0);
}

export function SpeedText() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let tenths: number = 0, $r0: string = "";
  if (ri32(257253) === 0) {
    $r0 = "N/A";
  } else {
    tenths = Math.trunc(((ri32(257253) * 10) + 596) / 1193) | 0;
    wS($f0, 20, StrUtil.Grouped(Math.trunc(tenths / 10)) + "." + String.fromCharCode((48 + (tenths % 10)) & 255) + " ms");
    if (AdvPlan.SpeedSlow(ri32(257253))) {
      wS($f0, 20, rS($f0) + " SLOW");
    }
    $r0 = rS($f0);
  }
  S.sp = $sp;
  return $r0;
}

export function CyclesText() {
  let cycles: number = 0, $r0: string = "";
  cycles = AdvPlan.CyclesOf(ri32(257253)) | 0;
  if (ri32(257253) === 0) {
    $r0 = "N/A";
  } else if (cycles === 0) {
    $r0 = "under 100";
  } else {
    $r0 = "about " + StrUtil.Grouped(cycles);
  }
  return $r0;
}

export function DisplayText(col: number, row: number, color: number, s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let i: number = 0, r: number = 0;
  for (let $i1 = 1, $e1 = s.length; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((rt.chAt(s, i) === 64) && (r32(229651) !== 0)) {
      for (let $i2 = 0; $i2 <= 7; $i2++) {
        r = $i2;
        U8[$f0 + r] = U8[r32(229651) + r + 512];
        U8[r32(229651) + r + 512] = U8[r + 257257];
      }
      TextRend.RenderChar(col, row, color, 0, 1, 64, 0);
      for (let $i3 = 0; $i3 <= 7; $i3++) {
        r = $i3;
        U8[r32(229651) + r + 512] = U8[$f0 + r];
      }
    } else {
      TextRend.RenderChar(col, row, color, 0, 1, rt.chAt(s, i), 1);
    }
    col = (col + 1) & 255;
  }
  S.sp = $sp;
}

export async function Show() {
  let support: boolean = false, slow: boolean = false, row: number = 0, key: number = 0;
  if ((U8[227094] !== 0) && !(U8[227096] !== 0)) {
    return;
  }
  support = AdvPlan.SupportDue(Options.AdvisedVersion(), GameDefs.BUILD_VERSION);
  slow = AdvPlan.SpeedSlow(ri32(257253));
  if (!support && !slow) {
    return;
  }
  TextRend.ClearScreen();
  row = Math.trunc((21 - (5 * ((support ? 1 : 0) + (slow ? 1 : 0)))) / 2);
  TextRend.DisplayCentered(0, 39, row, 14, "POOL OF RADIANCE");
  TextRend.DisplayCentered(0, 39, row + 1, 11, "this version: UNKNOWN");
  row = (row + 3) & 255;
  if (support) {
    DisplayText(1, row, 10, "This is a modified version of the game.");
    DisplayText(1, row + 1, 10, "GOG, Steam and SNEG can't help with it.");
    DisplayText(1, row + 2, 10, "Please send questions and bug reports");
    DisplayText(1, row + 3, 10, "to talonius@brazencrows.com" + ".");
    row = (row + 5) & 255;
  }
  if (slow) {
    DisplayText(1, row, 10, "This computer is running slower than");
    DisplayText(1, row + 1, 10, "this version needs. In DOSBox, raise");
    DisplayText(1, row + 2, 10, "the CPU cycles: cycles=max, or for");
    DisplayText(1, row + 3, 10, "example cycles=fixed 20000.");
    row = (row + 5) & 255;
  }
  TextRend.DisplayCentered(0, 39, row, 15, "PRESS ANY KEY TO GO ON");
  key = (await GameIo.ReadAnyKey()) & 255;
  while ((await Crt.KeyPressed())) {
    (await GameIo.DiscardPendingKeys());
  }
  if (support) {
    Options.SetAdvised(GameDefs.BUILD_VERSION);
  }
  TextRend.ClearScreen();
}
