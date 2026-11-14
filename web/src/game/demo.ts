// Generated from src/demo.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_DEMO from './c_demo';
import * as C_IFC from './c_ifc';
import * as GameVars from './gamevars';
import * as GameIo from './gameio';
import * as DaxIo from './daxio';
import * as DataArc from './dataarc';
import * as DiskRec from './diskrec';
import * as SaveLoad from './saveload';
import * as EclVm from './eclvm';
import * as GameInit from './gameinit';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as Portrait from './portrait';
import * as TpRand from './tprand';


export function Complete(path: string) {
  let id: number = 0, ok: boolean = false, $r0: boolean = false;
  ok = DataArc.BlockRawSize(path, 1) > 2;
  for (let $i1 = 240; $i1 <= 243; $i1++) {
    id = $i1;
    ok = (ok && (DataArc.BlockRawSize(path, id) >= 285)) && (DataArc.BlockRawSize(path, id + 8) >= 0);
  }
  $r0 = ok;
  return $r0;
}

export function Available() {
  let $r0: boolean = false;
  $r0 = Complete(DaxIo.FolderOf(C_DEMO.ARCHIVE) + C_DEMO.ARCHIVE + ".DAX");
  return $r0;
}

export async function Run() {
  let savedDelay: number = 0, savedSeed: number = 0;
  if (!Available()) {
    U8[141212] = false ? 1 : 0;
    return;
  }
  savedDelay = U8[141163];
  savedSeed = ri32(226105);
  U8[141211] = false ? 1 : 0;
  U8[141212] = true ? 1 : 0;
  U8[141213] = false ? 1 : 0;
  U8[141163] = 2;
  w32(226105, 1);
  U8[143234] = 1;
  U8[141222] = 1;
  U8[141223] = 1;
  U8[141176] = 4;
  (await TextRend.ClearScreen());
  (await CharDisp.DrawNoncombatWindows(false));
  (await EclVm.RunDemo());
  SaveLoad.FreeParty();
  Portrait.FreeAnimation(145563);
  (await GameInit.ResetGameState());
  U8[141163] = savedDelay;
  w32(226105, savedSeed);
  U8[141212] = false ? 1 : 0;
  U8[141213] = false ? 1 : 0;
  while ((await Crt.KeyPressed())) {
    (await GameIo.DiscardPendingKeys());
  }
  (await TextRend.ClearScreen());
}
