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
    U8[227098] = false ? 1 : 0;
    return;
  }
  savedDelay = U8[227049];
  savedSeed = ri32(234431);
  U8[227097] = false ? 1 : 0;
  U8[227098] = true ? 1 : 0;
  U8[227099] = false ? 1 : 0;
  U8[227049] = 2;
  w32(234431, 1);
  U8[229120] = 1;
  U8[227108] = 1;
  U8[227109] = 1;
  U8[227062] = 4;
  TextRend.ClearScreen();
  (await CharDisp.DrawNoncombatWindows(false));
  (await EclVm.RunDemo());
  SaveLoad.FreeParty();
  Portrait.FreeAnimation(231449);
  (await GameInit.ResetGameState());
  U8[227049] = savedDelay;
  w32(234431, savedSeed);
  U8[227098] = false ? 1 : 0;
  U8[227099] = false ? 1 : 0;
  while ((await Crt.KeyPressed())) {
    (await GameIo.DiscardPendingKeys());
  }
  TextRend.ClearScreen();
}
