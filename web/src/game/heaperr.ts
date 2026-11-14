// Generated from src/heaperr.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as C_KEYS from './c_keys';
import * as GameVars from './gamevars';
import * as SaveLoad from './saveload';
import * as GameIo from './gameio';
import * as TextRend from './textrend';

export const RESERVE_BYTES = 4096;

export const $at = { reserve: 262032, handling: 262036 };

export async function HeapErrorHandler(size: number) {
  let ch: number = 0, done: boolean = false, $r0: number = 0;
  $r0 = 0;
  if ((size === 0) || (U8[262036] !== 0)) {
    return $r0;
  }
  U8[262036] = true ? 1 : 0;
  if (r32(262032) !== 0) {
    rt.freeMem(r32(262032));
    w32(262032, 0);
  }
  done = false;
  do {
    TextRend.ClearBottomLine();
    TextRend.DisplayString(0, 24, 14, "OUT OF MEMORY: ENTER SAVES, ESC QUITS");
    (await GameIo.DiscardPendingKeys());
    do {
      ch = (await GameIo.ReadAnyKey()) & 255;
    } while (!((ch === 13) || (ch === 27)));
    if (ch === 27) {
      done = true;
    } else {
      done = (await SaveLoad.SaveGame());
    }
  } while (!(done));
  (await GameIo.ExitGame());
  return $r0;
}

export function KeepReserve() {
  if (r32(262032) === 0) {
    w32(262032, rt.getMem(4096));
  }
}

export function $init() {
  w32(262032, 0);
  U8[262036] = false ? 1 : 0;
}
