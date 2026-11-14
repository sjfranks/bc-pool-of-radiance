// Generated from src/eclvm.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_AREA from './c_area';
import * as C_NPC from './c_npc';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as Temple from './temple';
import * as PostCbt from './postcbt';
import * as Combat from './combat';
import * as Explore from './explore';
import * as CharGen from './chargen';
import * as Ending from './ending';
import * as CharHlp from './charhlp';
import * as DaxIo from './daxio';
import * as GameIo from './gameio';
import * as C_ECL from './c_ecl';
import * as C_LEVEL from './c_level';
import * as C_IFC from './c_ifc';
import * as C_GBVM from './c_gbvm';
import * as C_SOUND from './c_sound';
import * as C_MONEY from './c_money';
import * as C_STATUS from './c_status';
import * as C_TIME from './c_time';
import * as VaultMnu from './vaultmnu';
import * as EclTrace from './ecltrace';
import * as Border from './border';
import * as Camp from './camp';
import * as EclMenu from './eclmenu';
import * as FxEngine from './fxengine';
import * as MapTiles from './maptiles';
import * as MapView from './mapview';
import * as MenuCore from './menucore';
import * as RandItem from './randitem';
import * as Portrait from './portrait';
import * as SaveLoad from './saveload';
import * as Shop from './shop';
import * as SoundDrv from './sounddrv';
import * as TextRend from './textrend';
import * as View3D from './view3d';
import * as StrUtil from './strutil';
import * as EclVars from './eclvars';
import * as CharDisp from './chardisp';
import * as Party from './party';
import * as Dice from './dice';
import * as DiskRec from './diskrec';
import * as MoneyCal from './moneycal';
import * as Bestiary from './bestiary';
import * as Sage from './sage';
import * as MagicShp from './magicshp';
import * as EffHndlr from './effhndlr';
import * as JrnlSeen from './jrnlseen';
import * as C_DEMO from './c_demo';
import * as Wilds from './wilds';
import * as TpRand from './tprand';

export const MAX_LOADED_MONSTERS = 63;
export const DUEL_WHOS = 3;
export const PROG_TRAINING = 0;
export const PROG_WIN_GAME = 8;
export const PROG_CAMP = 9;
export const PROG_SAGE = 10;
export const PROG_MAGIC_SHOP = 11;
export const PROG_DEMO_END = 3;
export const WILD_WEST_SCRIPT = 25;
export const WILD_CENTRAL_SCRIPT = 26;
export const WILD_EAST_SCRIPT = 27;

export const $at = { eclStop: 262003, newEclFlag: 262004, restoreChar: 262005, filesLoaded: 262006, enteringLoop: 262007, piecesLoaded: 262008, mapLoaded: 262009, creatureCnt: 262010, monId: 262011, monPicId: 262012, monstersOn: 262013, DUEL_WHO: 262014, searchModeFlag: 262029, ecl3dClearFlag: 262030, protNewLine: 262031 };

export async function GameLoop() {
  let cmd: number = 0;
  U8[262008] = 0;
  U8[262009] = 0;
  U8[262005] = 0;
  U8[262006] = 0;
  U8[262007] = 1;
  ForgetMonsters();
  U8[227062] = 4;
  U8[262004] = 0;
  U8[232633] = r16(r32(227033) + 484) & 255;
  switch (U8[232633]) {
    case 25: case 26: case 27: {
      if (r16(r32(227033) + 460) === 0) {
        U8[227062] = 3;
      }
      break;
    }
  }
  (await EclMenu.LoadEclScript(U8[232633]));
  EclMenu.EclInit();
  (await CallEclScript(r16(227058)));
  if (U8[227062] !== 3) {
    if (U8[262007] === 1) {
      (await CharDisp.DisplayNoncombatInterface());
      U8[262007] = 0;
    }
    (await MapView.DisplayMapView());
  }
  w16(r32(227033) + 484, U8[232633]);
  while (!(U8[227110] !== 0) && !(await Reloading())) {
    cmd = (await Explore.MapMainMenu()) & 255;
    w32(229643, r32(229635));
    w16(r32(227033) + 484, U8[232633]);
    while ((((r16(r32(227037) + 1428) > 1) || (rt.UpCase(cmd) === 69)) && !(U8[227110] !== 0)) && !(await Reloading())) {
      if (rt.UpCase(cmd) === 69) {
        (await EnterCamp());
      } else {
        U8[262029] = r16(r32(227037) + 1428) & 1;
        w16(r32(227037) + 1428, 1);
        (await MapView.DisplayMapView());
        (await CallEclScript(r16(227052)));
        if (U8[262004] !== 0) {
          (await NewEclDone());
        }
        w16(r32(227037) + 1428, U8[262029]);
      }
      if (!(U8[227110] !== 0) && !(await Reloading())) {
        cmd = (await Explore.MapMainMenu()) & 255;
        w32(229643, r32(229635));
      }
    }
    if (!(await Reloading())) {
      if (!(U8[227110] !== 0)) {
        (await CallEclScript(r16(227050)));
      }
      if (U8[262004] !== 0) {
        (await NewEclDone());
      } else if (!(U8[227110] !== 0) && !(await Reloading())) {
        w16(r32(227033) + 480, I8[231432]);
        w16(r32(227033) + 482, I8[231433]);
        (await Explore.ResolveMovement());
        (await MapView.DisplayMapView());
        if ((I8[231432] !== r16(r32(227033) + 480)) || (I8[231433] !== r16(r32(227033) + 482))) {
          SoundDrv.SoundEffect(r16(218793), 1);
        }
        U8[232634] = false ? 1 : 0;
        U8[248860] = true ? 1 : 0;
        (await CallEclScript(r16(227052)));
        if (U8[262004] !== 0) {
          (await NewEclDone());
        }
      }
    }
  }
  U8[227110] = false ? 1 : 0;
}

export function ResetGame() {
  U8[262029] = 0;
  U8[262030] = 0;
  U8[262031] = 0;
}

export async function RunDemo() {
  U8[262008] = 0;
  U8[262009] = 0;
  U8[262005] = 0;
  U8[262006] = 0;
  U8[262007] = 1;
  U8[262004] = 0;
  ForgetMonsters();
  (await EclMenu.LoadEclScript(1));
  EclMenu.EclInit();
  (await CallEclScript(r16(227058)));
  FreeEclStack();
}

export async function CallEclScript(address: number) {
  w16(227060, address);
  U8[262003] = 0;
  while (((U8[262003] === 0) && !(U8[227110] !== 0)) && !(await Reloading())) {
    U8[232433] = U8[r32(227045) + r16(227060) - 39168];
    if ((U8[227100] !== 0)) {
      rt.WriteT(232659, EclTrace.OpName(U8[232433]) + "\n");
    }
    if ((U8[248551] !== 0) && !Wilds.KeepsWide(U8[232433])) {
      (await CharDisp.SetWildView(false));
    }
    (await ExecNextEclCmd());
  }
  U8[262003] = 0;
}

export async function Reloading() {
  let $r0: boolean = false;
  $r0 = ((U8[258873] !== 0) || (U8[227107] !== 0)) || (await GameIo.DemoEnding());
  return $r0;
}

export function ForgetMonsters() {
  Bestiary.NewEncounter();
  U8[262010] = 0;
  U8[262011] = 0;
  U8[262012] = 0;
  U8[262013] = 0;
}

export function FreeEclStack() {
  while (r32(232425) !== 0) {
    w32(232429, r32(r32(232425) + 2));
    rt.freeMem(r32(232425));
    w32(232425, r32(232429));
  }
}

export function RestoreLoadedChar() {
  if (U8[262005] !== 0) {
    w32(229635, r32(229643));
    U8[262005] = 0;
  }
}

export async function EclExit() {
  if (U8[248861] !== 0) {
    (await Border.DrawWindow(1, 1, 15, 15, 0, 15, ""));
    if (r16(r32(227033) + 460) !== 0) {
      (await Border.DrawWindow(3, 3, 13, 13, 0, 15, ""));
    }
  }
  RestoreLoadedChar();
  rt.fill(248858, 2, 0);
  U8[232634] = false ? 1 : 0;
  U8[248861] = 0;
  U8[262003] = 1;
  w16(227060, r16(227060) + 1);
  FreeEclStack();
  U8[229656] = 17;
  U8[229655] = 1;
  U8[262030] = 0;
}

export function EclGoto() {
  EclVars.LoadEclVars(1);
  w16(227060, EclVars.CombineBytesToWord(U8[232562], U8[232498]));
}

export function EclGosubCmd() {
  EclVars.LoadEclVars(1);
  EclMenu.EclGosub(1);
}

export async function EclCompare() {
  EclVars.LoadEclVars(2);
  if ((U8[232434] >= 128) || (U8[232435] >= 128)) {
    EclMenu.EclCompareStr(rS(r32(232626)), rS(r32(232626) + 256));
  } else {
    EclMenu.EclCompareInt((await EclVars.GetEclVar(1)), (await EclVars.GetEclVar(2)));
  }
}

export async function EclArith() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let address: number = 0, i: number = 0, r: number = 0;
  EclVars.LoadEclVars(3);
  for (let $i1 = 1; $i1 <= 2; $i1++) {
    i = $i1;
    w16($f0 + i * 2 - 2, (await EclVars.GetEclVar(i)));
  }
  address = EclVars.CombineBytesToWord(U8[232564], U8[232500]) & 65535;
  switch (U8[232433]) {
    case 4: {
      r = (r16($f0) + r16($f0 + 2)) & 65535;
      break;
    }
    case 5: {
      r = (r16($f0 + 2) - r16($f0)) & 65535;
      break;
    }
    case 6: {
      if (r16($f0 + 2) === 0) {
        r = 0;
      } else {
        r = Math.trunc(r16($f0) / r16($f0 + 2)) & 65535;
      }
      break;
    }
    case 7: {
      r = (r16($f0) * r16($f0 + 2)) & 65535;
      break;
    }
  }
  (await EclVars.WriteGbvm(address, r));
  S.sp = $sp;
}

export async function EclRandom() {
  let n: number = 0, roll: number = 0, address: number = 0;
  EclVars.LoadEclVars(2);
  n = (await EclVars.GetEclVar(1)) & 255;
  if (n < 255) {
    n = (n + 1) & 255;
  }
  address = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  roll = TpRand.Random(n) & 255;
  (await EclVars.WriteGbvm(address, roll));
}

export async function EclSave() {
  let v: number = 0, address: number = 0;
  EclVars.LoadEclVars(2);
  address = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  if (U8[232434] < 128) {
    v = (await EclVars.GetEclVar(1)) & 65535;
    (await EclVars.WriteGbvm(address, v));
  } else {
    EclVars.WriteGbvmString(address, rS(r32(232626)));
    if (address === 27392) {
      CharDisp.DisplayParty(r32(229635));
    }
  }
}

export async function EclLoadChar() {
  let p: number = 0, idx: number = 0, i: number = 0, flag80: number = 0, wasSaved: boolean = false;
  U8[262005] = 1;
  EclVars.LoadEclVars(1);
  i = 0;
  idx = (await EclVars.GetEclVar(1)) & 255;
  p = r32(229639);
  flag80 = idx & 128;
  idx = idx & 127;
  if (idx > 0) {
    while ((i < idx) && (p !== 0)) {
      p = r32(p + 260);
      i = (i + 1) & 255;
    }
  }
  if (p !== 0) {
    w32(229635, p);
  }
  if (((flag80 !== 0) && (U8[232630] !== 0)) && (U8[232631] !== 0)) {
    if (p !== 0) {
      wasSaved = r32(229643) === r32(229635);
      if (wasSaved) {
        U8[262005] = 0;
      }
      SaveLoad.RemoveCreature(false, true);
      CharDisp.DisplayParty(r32(229635));
    }
    U8[232630] = false ? 1 : 0;
    U8[232631] = false ? 1 : 0;
  }
}

export async function EclSetupMon() {
  EclVars.LoadEclVars(3);
  U8[262011] = (await EclVars.GetEclVar(1));
  w16(r32(227037) + 1408, (await EclVars.GetEclVar(2)));
  U8[262012] = (await EclVars.GetEclVar(3));
  w16(r32(227037) + 1410, EclMenu.MaxMonsterDist(I8[231432], I8[231433], U8[231434]));
  if (r16(r32(227037) + 1408) < r16(r32(227037) + 1410)) {
    w16(r32(227037) + 1410, r16(r32(227037) + 1408));
  }
  (await EclMenu.DisplayMonster(U8[262011], U8[262012], r16(r32(227037) + 1410) & 255, 248858));
}

export async function EclLoadMon() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 403);
  let id: number = 0, count: number = 0, picId: number = 0, i: number = 0, p: number = 0, q: number = 0, savedCur: number = 0, invHead: number = 0, effHead: number = 0;
  savedCur = r32(229635);
  i = 1;
  EclVars.LoadEclVars(3);
  if (U8[262010] >= 63) {
    { S.sp = $sp; return; }
  }
  if (U8[248857] > 12) {
    { S.sp = $sp; return; }
  }
  p = 0;
  q = 0;
  id = (await EclVars.GetEclVar(1)) & 255;
  (await EclMenu.InitCreature(id, $f0, $f0 + 395, $f0 + 399));
  Bestiary.Met(r32($f0));
  mv($f0 + 4, r32($f0), 378);
  invHead = r32($f0 + 395);
  effHead = r32($f0 + 399);
  count = (await EclVars.GetEclVar(2)) & 255;
  if (count === 0) {
    count = 1;
  }
  picId = (await EclVars.GetEclVar(3)) & 255;
  wS($f0 + 382, 12, "CPIC");
  (await MapTiles.LoadIconAnim(rS($f0 + 382), picId, U8[248857]));
  p = Party.LastCreature();
  w32(p + 260, r32($f0));
  p = r32(p + 260);
  U8[p + 191] = U8[248857];
  w32(p + 260, 0);
  U8[262010] = U8[262010] + 1;
  i = (i + 1) & 255;
  while ((i <= count) && (U8[262010] < 63)) {
    q = rt.getMem(378);
    w32(p + 260, q);
    p = r32(p + 260);
    mv(p, $f0 + 4, 378);
    U8[p + 191] = U8[248857];
    w32(p + 260, 0);
    w32(p + 127, 0);
    w32(p + 200, 0);
    i = (i + 1) & 255;
    U8[262010] = U8[262010] + 1;
    while (r32($f0 + 395) !== 0) {
      CharHlp.PrependItemCopy(p + 200, r32($f0 + 395));
      w32($f0 + 395, r32(r32($f0 + 395) + 42));
    }
    w32($f0 + 395, invHead);
    while (r32($f0 + 399) !== 0) {
      CharHlp.PrependEffectCopy(p + 127, r32($f0 + 399));
      w32($f0 + 399, r32(r32($f0 + 399) + 5));
    }
    w32($f0 + 399, effHead);
  }
  U8[248857] = U8[248857] + 1;
  U8[262013] = 1;
  w32(229635, savedCur);
  S.sp = $sp;
}

export async function EclApproach() {
  if (r16(r32(227037) + 1410) > 0) {
    let $t1;
    $t1 = r32(227037) + 1410, w16($t1, r16($t1) - 1);
    (await EclMenu.DisplayMonster(U8[262011], U8[262012], r16(r32(227037) + 1410) & 255, 248858));
  }
  w16(227060, r16(227060) + 1);
}

export async function EclPicture() {
  let picId: number = 0;
  EclVars.LoadEclVars(1);
  picId = (await EclVars.GetEclVar(1)) & 255;
  if (picId !== 255) {
    (await CharDisp.SetWildView(false));
  }
  if ((r16(r32(227033) + 460) === 0) && (picId !== 255)) {
    (await Border.DrawWindow(3, 3, 13, 13, 0, 15, ""));
  }
  if (picId !== 255) {
    U8[248859] = true ? 1 : 0;
    U8[232634] = true ? 1 : 0;
    if (r16(r32(227037) + 1474) === 255) {
      (await Portrait.LoadAnimation("PIC", picId, 0, 231449));
      Portrait.DisplayImageBuf(3, 3, true, r32(231455));
    } else {
      (await EclMenu.DisplayPortrait(r16(r32(227037) + 1474) & 255, picId));
    }
  } else {
    if (((U8[227108] > 1) || (U8[227109] === 1)) && ((U8[232634] !== 0) || (U8[232635] !== 0))) {
      (await MapView.DisplayMapView());
      U8[232634] = false ? 1 : 0;
      U8[232635] = false ? 1 : 0;
      U8[248860] = true ? 1 : 0;
    }
    U8[248858] = false ? 1 : 0;
    U8[248859] = false ? 1 : 0;
  }
}

export async function EclInputNum() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let v: number = 0, address: number = 0;
  EclVars.LoadEclVars(2);
  wS($f0, 1, "");
  address = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  v = (await TextRend.ReadNumber(rS($f0), 10)) & 65535;
  (await EclVars.WriteGbvm(address, v));
  S.sp = $sp;
}

export async function EclInputStr() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 258);
  let address: number = 0;
  EclVars.LoadEclVars(2);
  wS($f0, 1, "");
  address = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  wS($f0 + 2, 255, (await TextRend.ReadString(rS($f0), 10, 40)));
  if (rS($f0 + 2) === "") {
    wS($f0 + 2, 255, " ");
  }
  EclVars.WriteGbvmString(address, rS($f0 + 2));
  S.sp = $sp;
}

export async function EclPrint() {
  EclVars.LoadEclVars(1);
  U8[258874] = 0;
  U8[227111] = 1;
  if (U8[232434] < 128) {
    wS(r32(232626), 255, StrUtil.NumStr((await EclVars.GetEclVar(1))));
  }
  JrnlSeen.Scan(rS(r32(232626)));
  if (U8[232433] === 17) {
    (await TextRend.ShowMessage(10, false, rS(r32(232626))));
  } else {
    U8[229656] = 17;
    U8[229655] = 1;
    (await TextRend.DisplayMessageWindow(1, 17, 38, 22, 10, true, rS(r32(232626))));
  }
  U8[227111] = 0;
}

export function EclReturn() {
  w16(227060, r16(227060) + 1);
  if (r32(232425) !== 0) {
    w16(227060, r16(r32(232425)));
    w32(232429, r32(r32(232425) + 2));
    rt.freeMem(r32(232425));
    w32(232425, r32(232429));
  }
}

export async function EclCompareAnd() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let i: number = 0;
  rt.fill(248851, 6, 0);
  EclVars.LoadEclVars(4);
  for (let $i1 = 1; $i1 <= 4; $i1++) {
    i = $i1;
    w16($f0 + i * 2 - 2, (await EclVars.GetEclVar(i)));
  }
  if ((r16($f0) === r16($f0 + 2)) && (r16($f0 + 4) === r16($f0 + 6))) {
    U8[248851] = true ? 1 : 0;
  } else {
    U8[248852] = true ? 1 : 0;
  }
  S.sp = $sp;
}

export async function EclIf() {
  w16(227060, r16(227060) + 1);
  switch (U8[232433]) {
    case 22: {
      if (!(U8[248851] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
    case 23: {
      if (!(U8[248852] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
    case 24: {
      if (!(U8[248853] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
    case 25: {
      if (!(U8[248854] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
    case 26: {
      if (!(U8[248855] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
    case 27: {
      if (!(U8[248856] !== 0)) {
        (await EclVars.SkipEclCmd());
      }
      break;
    }
  }
}

export async function EclNewEcl() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let id: number = 0;
  EclVars.LoadEclVars(1);
  w16(r32(227033) + 484, U8[232633]);
  id = (await EclVars.GetEclVar(1)) & 255;
  U8[232633] = id;
  wS($f0, 20, (await DaxIo.ArchiveName("ECL" + StrUtil.NumStr(U8[229120]))));
  (await SaveLoad.CheckFileElseQuit(DaxIo.FolderOf(rS($f0)) + rS($f0) + ".dax"));
  (await EclMenu.LoadEclScript(id));
  FreeEclStack();
  EclMenu.EclInit();
  U8[262003] = 1;
  U8[262004] = 1;
  U8[262006] = 0;
  S.sp = $sp;
}

export async function EclLoadFiles() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let i: number = 0;
  EclVars.LoadEclVars(3);
  U8[262006] = 1;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    U8[$f0 + i - 1] = (await EclVars.GetEclVar(i));
  }
  if (U8[232433] === 33) {
    U8[262009] = 1;
    if (((U8[$f0] !== 255) && (U8[$f0] !== 127)) && (r16(r32(227033) + 460) !== 0)) {
      w16(r32(227033) + 394, U8[$f0]);
      (await View3D.Load3DMap(U8[$f0]));
      w16(r32(227037) + 1426, 0);
    }
    if ((U8[$f0 + 2] !== 255) && (r16(r32(227033) + 460) === 0)) {
      (await MapTiles.Load24x24Set("BACPAC", 0));
    }
  } else {
    U8[262008] = 1;
    if (U8[$f0] === 127) {
      (await View3D.LoadWallSet(0, 1));
    } else if ((r16(r32(227033) + 462) !== 0) && (r16(r32(227033) + 464) !== 0)) {
      (await View3D.LoadWallSet(U8[$f0], 1));
      (await View3D.LoadWallSet(U8[$f0 + 2], 3));
    } else {
      for (let $i2 = 1; $i2 <= 3; $i2++) {
        i = $i2;
        if (U8[$f0 + i - 1] !== 255) {
          (await View3D.LoadWallSet(U8[$f0 + i - 1], i));
        } else {
          w16(i * 4 + 231433, -1);
          w16(i * 4 + 231435, -1);
        }
      }
    }
  }
  if (((U8[262007] !== 0) && (U8[262008] !== 0)) && (U8[262009] !== 0)) {
    (await CharDisp.DisplayNoncombatInterface());
    CharDisp.DisplayParty(r32(229635));
    U8[262007] = 0;
  }
  S.sp = $sp;
}

export async function EclAndOr() {
  let address: number = 0, v2: number = 0, v1: number = 0, r: number = 0;
  EclVars.LoadEclVars(3);
  v1 = (await EclVars.GetEclVar(1)) & 65535;
  v2 = (await EclVars.GetEclVar(2)) & 65535;
  address = EclVars.CombineBytesToWord(U8[232564], U8[232500]) & 65535;
  if (U8[232433] === 47) {
    r = (v1 & v2) & 255;
  } else {
    r = (v1 | v2) & 255;
  }
  EclMenu.EclCompareInt(0, r);
  (await EclVars.WriteGbvm(address, r));
}

export async function EclGetTable() {
  let addr1: number = 0, addr2: number = 0, sum: number = 0, v: number = 0, idx: number = 0;
  EclVars.LoadEclVars(3);
  addr1 = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  idx = (await EclVars.GetEclVar(2)) & 255;
  addr2 = EclVars.CombineBytesToWord(U8[232564], U8[232500]) & 65535;
  sum = (addr1 + idx) & 65535;
  v = (await EclVars.ReadGbvm(sum)) & 65535;
  (await EclVars.WriteGbvm(addr2, v));
}

export async function EclSaveTable() {
  let idx: number = 0, address: number = 0, v: number = 0, sum: number = 0;
  EclVars.LoadEclVars(3);
  v = (await EclVars.GetEclVar(1)) & 65535;
  address = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  idx = (await EclVars.GetEclVar(3)) & 65535;
  sum = (address + idx) & 65535;
  (await EclVars.WriteGbvm(sum, v));
}

export async function EclVMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 269);
  let count: number = 0, i: number = 0, address: number = 0, key: number = 0;
  U8[258874] = 0;
  U8[$f0 + 268] = true ? 1 : 0;
  wS($f0 + 264, 1, "");
  i = 1;
  EclVars.LoadEclVars(3);
  address = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  wS($f0, 255, rS(r32(232626)));
  count = (await EclVars.GetEclVar(3)) & 255;
  EclVars.LoadEclList(count);
  if (count > 20) {
    count = 20;
  }
  MenuCore.AllocStringList(count, $f0 + 256);
  w32($f0 + 260, r32($f0 + 256));
  U8[229655] = 1;
  U8[229656] = 17;
  (await TextRend.ShowMessage(10, true, rS($f0)));
  while (r32($f0 + 256) !== 0) {
    wS(r32($f0 + 256), 40, rS(r32(232626) + i * 256 - 256));
    U8[r32($f0 + 256) + 41] = 0;
    w32($f0 + 256, r32(r32($f0 + 256) + 42));
    i = (i + 1) & 255;
  }
  w16($f0 + 266, 0);
  do {
    w32($f0 + 256, r32($f0 + 260));
    U8[$f0 + 268] = true ? 1 : 0;
    key = (await MenuCore.MenuVertical(rS($f0 + 264), rS($f0 + 264), 13, 10, 15, 1, U8[229656] + 1, 38, 22, r32($f0 + 256), false, $f0 + 268, $f0 + 266, $f0 + 256)) & 255;
  } while (!((r32($f0 + 256) !== 0) || (r32($f0 + 260) === 0)));
  (await EclVars.WriteGbvm(address, ri16($f0 + 266)));
  MenuCore.FreeStringList($f0 + 260);
  TextRend.ClearRect(1, 17, 38, 22);
  S.sp = $sp;
}

export async function EclHMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 309);
  let count: number = 0, ch: number = 0, i: number = 0, address: number = 0, enterOk: boolean = false, anim: boolean = false, hlCol: number = 0, mCol: number = 0;
  wS($f0, 1, "");
  wS($f0 + 2, 50, "");
  EclVars.LoadEclVars(2);
  address = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  count = (await EclVars.GetEclVar(2)) & 255;
  EclVars.LoadEclList(count);
  if (count > 20) {
    count = 20;
  } else if (count === 0) {
    count = 1;
  }
  wS($f0 + 2, 50, "");
  if (count === 1) {
    enterOk = true;
    hlCol = 15;
    mCol = 15;
    if (rS(r32(232626)) === "PRESS <RETURN> OR BUTTON TO CONTINUE") {
      wS(r32(232626), 255, "PRESS <ENTER>/<RETURN> TO CONTINUE");
    }
  } else {
    enterOk = false;
    hlCol = 15;
    mCol = 10;
  }
  anim = (U8[232634] !== 0) && (U8[248860] !== 0);
  wS($f0 + 53, 255, "");
  for (let $i1 = 1, $e1 = count - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    wS($f0 + 2, 50, rS($f0 + 2) + StrUtil.MarkHotkey(rS(r32(232626) + i * 256 - 256), $f0 + 53) + " ");
  }
  wS($f0 + 2, 50, rS($f0 + 2) + StrUtil.MarkHotkey(rS(r32(232626) + count * 256 - 256), $f0 + 53));
  ch = (await EclMenu.MenuHorizontalCharacterSelect(rS($f0), rS($f0 + 2), 13, mCol, hlCol, enterOk, anim)) & 255;
  (await EclVars.WriteGbvm(address, ch));
  TextRend.ClearRect(0, 24, 39, 24);
  S.sp = $sp;
}

export function EclClearMon() {
  w16(227060, r16(227060) + 1);
  Bestiary.NewEncounter();
  U8[262010] = 0;
  U8[262013] = 0;
  U8[248857] = 8;
  CharHlp.ClearTreasure();
}

export async function EclPartyStr() {
  let hp: number = 0, th: number = 0, mage: number = 0, cleric: number = 0, ac: number = 0, strength: number = 0, address: number = 0, p: number = 0;
  EclVars.LoadEclVars(1);
  strength = 0;
  p = r32(229639);
  while (p !== 0) {
    hp = U8[p + 283];
    ac = U8[p + 273];
    th = U8[p + 272];
    mage = I8[p + 155] & 255;
    cleric = I8[p + 150] & 255;
    if (ac > 60) {
      ac = (ac - 60) & 255;
    } else {
      ac = 0;
    }
    if (th > 39) {
      th = (th - 39) & 255;
    } else {
      th = 0;
    }
    strength = (strength + Math.trunc(((cleric * 4) + (((hp + (ac * 5)) + (th * 5)) + (mage * 8))) / 10)) & 65535;
    p = r32(p + 260);
  }
  address = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  if (strength > 255) {
    strength = 255;
  }
  (await EclVars.WriteGbvm(address, strength));
}

export async function EclCheckParty() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let attr: number = 0, sum: number = 0, effId: number = 0, p: number = 0, found: boolean = false, addr1: number = 0, addr2: number = 0, addr3: number = 0, addr4: number = 0, count: number = 0, value: number = 0;
  async function Write4Gbvm() {
    (await EclVars.WriteGbvm(addr1, U8[$f0 + 4]));
    (await EclVars.WriteGbvm(addr2, U8[$f0 + 5]));
    (await EclVars.WriteGbvm(addr3, U8[$f0 + 6]));
    (await EclVars.WriteGbvm(addr4, (found ? 1 : 0)));
  }
  EclVars.LoadEclVars(6);
  p = r32(229639);
  found = false;
  if (U8[232434] === 1) {
    attr = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  } else {
    attr = (await EclVars.GetEclVar(1)) & 65535;
  }
  effId = (await EclVars.GetEclVar(2)) & 255;
  addr1 = EclVars.CombineBytesToWord(U8[232564], U8[232500]) & 65535;
  addr2 = EclVars.CombineBytesToWord(U8[232565], U8[232501]) & 65535;
  addr3 = EclVars.CombineBytesToWord(U8[232566], U8[232502]) & 65535;
  addr4 = EclVars.CombineBytesToWord(U8[232567], U8[232503]) & 65535;
  sum = 0;
  count = 0;
  U8[$f0 + 4] = 255;
  U8[$f0 + 5] = 0;
  U8[$f0 + 6] = 0;
  switch (attr) {
    case 0: {
      while ((p !== 0) && !found) {
        found = CharHlp.HasEffect(p, effId, $f0);
        p = r32(p + 260);
      }
      U8[$f0 + 4] = 0;
      (await Write4Gbvm());
      break;
    }
    case 27559: case 27675: {
      while (p !== 0) {
        count = (count + 1) & 255;
        if (attr === 27559) {
          value = U8[p + 121];
        } else {
          value = U8[p + 284];
        }
        if (value < U8[$f0 + 4]) {
          U8[$f0 + 4] = value;
        }
        if (value > U8[$f0 + 5]) {
          U8[$f0 + 5] = value;
        }
        sum = (sum + value) & 65535;
        p = r32(p + 260);
      }
      if (count === 0) {
        U8[$f0 + 4] = 0;
      } else {
        U8[$f0 + 6] = Math.trunc(sum / count);
      }
      (await Write4Gbvm());
      break;
    }
  }
  S.sp = $sp;
}

export async function EclPartySurprise() {
  let p: number = 0, mod1: number = 0, addr1: number = 0, addr2: number = 0;
  EclVars.LoadEclVars(2);
  p = r32(229639);
  mod1 = 0;
  while (p !== 0) {
    if (I8[p + 154] > 0) {
      mod1 = 1;
    }
    p = r32(p + 260);
  }
  addr1 = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  addr2 = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  (await EclVars.WriteGbvm(addr1, mod1));
  (await EclVars.WriteGbvm(addr2, 0));
}

export async function EclSurprise() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let r1: number = 0, r2: number = 0, i: number = 0, result: number = 0, t1: number = 0, t2: number = 0;
  EclVars.LoadEclVars(4);
  result = 0;
  for (let $i1 = 1; $i1 <= 4; $i1++) {
    i = $i1;
    U8[$f0 + i - 1] = (await EclVars.GetEclVar(i));
  }
  t1 = ((U8[$f0 + 3] + 2) - U8[$f0]) << 24 >> 24;
  t2 = ((U8[$f0 + 1] + 2) - U8[$f0 + 2]) << 24 >> 24;
  r1 = Dice.RollDice(1, 6) & 255;
  r2 = Dice.RollDice(1, 6) & 255;
  if (r1 <= t1) {
    result = 1;
  }
  if (r2 <= t2) {
    result = result | 2;
  }
  (await EclVars.WriteGbvm(28107, result));
  S.sp = $sp;
}

export async function EclCombat() {
  let dist: number = 0, mode: number = 0;
  w16(227060, r16(227060) + 1);
  if ((U8[262013] === 0) && !(U8[232632] !== 0)) {
    if (r16(r32(227037) + 1752) === 1) {
      w16(r32(227037) + 1752, 0);
      (await Shop.ShopMainMenu());
    } else if (r16(r32(227037) + 1752) === 2) {
      w16(r32(227037) + 1752, 0);
      (await VaultMnu.VaultMenu());
    } else if ((r16(r32(227037) + 1476) === 1) || (r16(r32(227037) + 1476) === 2)) {
      mode = r16(r32(227037) + 1476) & 255;
      w16(r32(227037) + 1476, 0);
      (await Temple.TempleMainMenu(mode));
    } else {
      (await PostCbt.PostCombat());
    }
  } else {
    dist = EclMenu.MaxMonsterDist(I8[231432], I8[231433], U8[231434]) & 65535;
    if (dist < r16(r32(227037) + 1410)) {
      w16(r32(227037) + 1410, dist);
    }
    (await Combat.CombatMain());
    (await PostCbt.PostCombat());
    if (r16(r32(227033) + 460) === 0) {
      (await MapTiles.Load24x24Set("BACPAC", 0));
      (await MapTiles.LoadWildIcons());
    }
    U8[232632] = false ? 1 : 0;
  }
  if (U8[227109] === 1) {
    U8[227062] = 4;
  } else {
    U8[227062] = 3;
  }
  w16(r32(227037) + 1428, r16(r32(227037) + 1428) & 1);
  rt.fill(248858, 2, 0);
  U8[232634] = false ? 1 : 0;
  (await CharDisp.DisplayNoncombatInterface());
}

export async function EclOnGoto() {
  let sel: number = 0, count: number = 0, i: number = 0, done: boolean = false;
  done = false;
  EclVars.LoadEclVars(2);
  sel = (await EclVars.GetEclVar(1)) & 255;
  count = (await EclVars.GetEclVar(2)) & 255;
  EclVars.LoadEclList(count);
  if (count > 64) {
    count = 64;
  }
  i = 0;
  while ((i < count) && !done) {
    if (sel === i) {
      if (U8[232433] === 37) {
        w16(227060, EclVars.CombineBytesToWord(U8[(i + 1) + 232561], U8[(i + 1) + 232497]));
      } else {
        EclMenu.EclGosub(i + 1);
      }
      done = true;
    } else {
      i = (i + 1) & 255;
    }
  }
}

export async function EclTreasure() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 70);
  let i: number = 0, tId: number = 0, j: number = 0, roll3: number = 0, roll: number = 0, roll2: number = 0, itemId: number = 0, offset: number = 0;
  EclVars.LoadEclVars(8);
  for (let $i1 = 0; $i1 <= 6; $i1++) {
    i = $i1;
    w32(i * 4 + 230748, (await EclVars.GetEclVar((i & 255) + 1)));
  }
  tId = (await EclVars.GetEclVar(8)) & 255;
  if (tId < 128) {
    (await DaxIo.LoadDax("ITEM" + StrUtil.NumStr(U8[229120]), ".dax", tId, $f0 + 64, $f0 + 66));
    if (r16($f0 + 64) === 0) {
      (await TextRend.DisplayAndPause(15, "Unable to find item file"));
      (await GameIo.ExitGame());
    }
    offset = 0;
    while ((r16($f0 + 64) - offset) >= 63) {
      DiskRec.ItemFromDisk(r32($f0 + 66) + offset, $f0);
      offset = (offset + 63) & 65535;
      CharHlp.PrependItemCopy(230776, $f0);
    }
    rt.freeMem(r32($f0 + 66));
  } else {
    if (tId === 255) {
      { S.sp = $sp; return; }
    }
    i = tId - 128;
    for (let $i3 = 1, $e3 = i; $i3 <= $e3; $i3++) {
      j = $i3;
      roll = Dice.RollDice(1, 100) & 255;
      const $c4 = roll;
      if (($c4 >= 1 && $c4 <= 60)) {
        do {
          roll2 = Dice.RollDice(1, 100) & 255;
        } while (!((roll2 !== 48) && (roll2 !== 49)));
        const $c6 = roll2;
        if (($c6 >= 1 && $c6 <= 47) || ($c6 >= 50 && $c6 <= 59)) {
          if (roll2 === 45) {
            itemId = 59;
          } else {
            itemId = roll2;
          }
        } else if (($c6 >= 60 && $c6 <= 90)) {
          roll2 = Dice.RollDice(1, 10) & 255;
          switch (roll2) {
            case 1: case 2: case 3: case 4: {
              itemId = 36;
              break;
            }
            case 5: case 6: case 7: {
              itemId = 35;
              break;
            }
            case 8: {
              itemId = 34;
              break;
            }
            case 9: {
              itemId = 37;
              break;
            }
            case 10: {
              itemId = 38;
              break;
            }
          }
        } else if (($c6 >= 91 && $c6 <= 94)) {
          itemId = 73;
        } else if (($c6 >= 95 && $c6 <= 97)) {
          itemId = 93;
        } else if (($c6 >= 98 && $c6 <= 100)) {
          itemId = 77;
        }
      } else if (($c4 >= 61 && $c4 <= 85)) {
        itemId = 61;
      } else if (($c4 >= 86 && $c4 <= 92)) {
        itemId = 62;
      } else if (($c4 >= 93 && $c4 <= 98)) {
        roll3 = Dice.RollDice(1, 16) & 255;
        switch (roll3) {
          case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
            itemId = 71;
            break;
          }
          case 8: case 9: {
            itemId = 70;
            break;
          }
          case 10: {
            itemId = 84;
            break;
          }
          case 11: case 12: {
            itemId = 78;
            break;
          }
          case 13: case 14: {
            itemId = 79;
            break;
          }
          case 15: {
            itemId = 92;
            break;
          }
          case 16: {
            itemId = 67;
            break;
          }
        }
      } else if ($c4 === 99 || $c4 === 100) {
        itemId = 69;
      }
      RandItem.GenerateRandomItem(itemId, $f0);
      CharHlp.PrependItemCopy(230776, $f0);
    }
    CharHlp.LabelItems(r32(230776));
  }
  S.sp = $sp;
}

export async function EclRob() {
  let whole: number = 0, pct: number = 0, chance: number = 0, p: number = 0, fraction: number = 0;
  EclVars.LoadEclVars(3);
  whole = (await EclVars.GetEclVar(1)) & 255;
  pct = (await EclVars.GetEclVar(2)) & 255;
  if (pct > 100) {
    pct = 100;
  }
  fraction = (100 - pct) / 100;
  chance = (await EclVars.GetEclVar(3)) & 255;
  if (whole === 0) {
    EclMenu.RobMoney(fraction, r32(229635));
    (await EclMenu.RobItems(chance, r32(229635)));
    CharHlp.RecalcStats(r32(229635));
  } else {
    p = r32(229639);
    while (p !== 0) {
      EclMenu.RobMoney(fraction, p);
      (await EclMenu.RobItems(chance, p));
      CharHlp.RecalcStats(p);
      p = r32(p + 260);
    }
  }
  CharDisp.DisplayParty(r32(229635));
}

export async function EclEncounter() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1074);
  let sel: number = 0, fleePar: number = 0, fleeMon: number = 0, i: number = 0, waited: boolean = false, clearW: boolean = false, anim: boolean = false, choice: number = 0, k: number = 0, tried: number = 0, address: number = 0;
  async function ApproachOrWait() {
    if (r16(r32(227037) + 1410) !== 0) {
      let $t1;
      $t1 = r32(227037) + 1410, w16($t1, r16($t1) - 1);
      (await EclMenu.DisplayMonster(U8[262011], U8[262012], r16(r32(227037) + 1410) & 255, 248858));
    } else {
      (await TextRend.ShowMessage(10, true, "Both sides wait."));
    }
    waited = true;
  }
  async function ApproachOrParley() {
    if (r16(r32(227037) + 1410) <= 0) {
      (await EclVars.WriteGbvm(address, 3));
    } else {
      let $t2;
      $t2 = r32(227037) + 1410, w16($t2, r16($t2) - 1);
      (await EclMenu.DisplayMonster(U8[262011], U8[262012], r16(r32(227037) + 1410) & 255, 248858));
      waited = true;
    }
  }
  async function MonstersFlee() {
    (await EclVars.WriteGbvm(address, 0));
    U8[229655] = 1;
    U8[229656] = 17;
    (await TextRend.ShowMessage(10, true, "The monsters flee."));
  }
  U8[232637] = 1;
  U8[258874] = 0;
  U8[227111] = 1;
  EclMenu.MoveExtremes($f0 + 1029, $f0 + 1030);
  wS($f0 + 1072, 1, "");
  EclVars.LoadEclVars(14);
  U8[262011] = (await EclVars.GetEclVar(1));
  w16(r32(227037) + 1408, (await EclVars.GetEclVar(2)));
  U8[262012] = (await EclVars.GetEclVar(3));
  address = EclVars.CombineBytesToWord(U8[232565], U8[232501]) & 65535;
  for (let $i3 = 0; $i3 <= 4; $i3++) {
    i = $i3;
    U8[$f0 + i] = (await EclVars.GetEclVar(i + 5));
  }
  for (let $i4 = 1; $i4 <= 3; $i4++) {
    i = $i4;
    wS($f0 + i * 256 - 251, 255, rS(r32(232626) + i * 256 - 256));
  }
  fleePar = (await EclVars.GetEclVar(13)) & 255;
  fleeMon = (await EclVars.GetEclVar(14)) & 255;
  w16(r32(227037) + 1410, EclMenu.MaxMonsterDist(I8[231432], I8[231433], U8[231434]));
  if (r16(r32(227037) + 1408) < r16(r32(227037) + 1410)) {
    w16(r32(227037) + 1410, r16(r32(227037) + 1408));
  }
  (await EclMenu.DisplayMonster(U8[262011], U8[262012], r16(r32(227037) + 1410) & 255, 248858));
  do {
    anim = (U8[232634] !== 0) && (U8[248860] !== 0);
    clearW = true;
    waited = false;
    U8[229655] = 1;
    U8[229656] = 17;
    if (r16(r32(227037) + 1410) <= 2) {
      k = (r16(r32(227037) + 1410) + 1) & 255;
      tried = 0;
      do {
        wS($f0 + 773, 255, rS($f0 + k * 256 - 251));
        k = (k + 1) & 255;
        if (k > 3) {
          k = 1;
        }
        tried = (tried + 1) & 255;
      } while (!((rS($f0 + 773) !== "") || (tried === 3)));
    }
    if (rS($f0 + 773) === "") {
      clearW = false;
    }
    (await TextRend.ShowMessage(10, clearW, rS($f0 + 773)));
    if ((r16(r32(227037) + 1410) === 0) || (r16(r32(227033) + 460) === 0)) {
      wS($f0 + 1031, 40, "~COMBAT ~WAIT ~FLEE ~PARLAY");
    } else {
      wS($f0 + 1031, 40, "~COMBAT ~WAIT ~FLEE ~ADVANCE");
    }
    sel = (await EclMenu.MenuHorizontalCharacterSelect(rS($f0 + 1072), rS($f0 + 1031), 13, 10, 15, false, anim)) & 255;
    if (((r16(r32(227037) + 1410) === 0) || (r16(r32(227033) + 460) === 0)) && (sel === 3)) {
      sel = 4;
    }
    choice = U8[$f0 + sel];
    switch (choice) {
      case 0: {
        if (sel !== 2) {
          (await EclVars.WriteGbvm(address, 1));
        } else {
          if (U8[$f0 + 1030] >= fleePar) {
            (await EclVars.WriteGbvm(address, 2));
          } else {
            (await EclVars.WriteGbvm(address, 1));
          }
        }
        break;
      }
      case 1: {
        switch (sel) {
          case 0: {
            (await EclVars.WriteGbvm(address, 1));
            break;
          }
          case 1: {
            waited = true;
            (await TextRend.ShowMessage(10, true, "Both sides wait."));
            break;
          }
          case 2: {
            (await EclVars.WriteGbvm(address, 2));
            break;
          }
          case 3: {
            (await ApproachOrWait());
            break;
          }
          case 4: {
            (await ApproachOrParley());
            break;
          }
        }
        break;
      }
      case 2: {
        switch (sel) {
          case 0: {
            if (fleeMon > U8[$f0 + 1029]) {
              (await MonstersFlee());
            } else {
              (await EclVars.WriteGbvm(address, 1));
            }
            break;
          }
          case 1: case 2: case 3: case 4: {
            (await MonstersFlee());
            break;
          }
        }
        break;
      }
      case 3: {
        switch (sel) {
          case 0: {
            (await EclVars.WriteGbvm(address, 1));
            break;
          }
          case 1: case 3: {
            (await ApproachOrWait());
            break;
          }
          case 2: {
            (await EclVars.WriteGbvm(address, 2));
            break;
          }
          case 4: {
            (await ApproachOrParley());
            break;
          }
        }
        break;
      }
      case 4: {
        switch (sel) {
          case 0: {
            (await EclVars.WriteGbvm(address, 1));
            break;
          }
          case 1: case 3: case 4: {
            (await ApproachOrParley());
            break;
          }
          case 2: {
            (await EclVars.WriteGbvm(address, 2));
            break;
          }
        }
        break;
      }
    }
  } while (!(!waited));
  TextRend.ClearRect(0, 24, 39, 24);
  U8[227111] = 0;
  U8[232637] = 0;
  S.sp = $sp;
}

export async function EclParlay() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let sel: number = 0, v5: number = 0, i: number = 0, address: number = 0, space: number = 0;
  EclVars.LoadEclVars(6);
  space = 32;
  for (let $i1 = 0; $i1 <= 4; $i1++) {
    i = $i1;
    U8[$f0 + i] = (await EclVars.GetEclVar(i + 1));
  }
  sel = (await EclMenu.MenuHorizontalCharacterSelect(String.fromCharCode(space), "~HAUGHTY ~SLY ~NICE ~MEEK ~ABUSIVE", 13, 10, 15, false, false)) & 255;
  address = EclVars.CombineBytesToWord(U8[232567], U8[232503]) & 65535;
  v5 = U8[$f0 + sel];
  (await EclVars.WriteGbvm(address, v5));
  S.sp = $sp;
}

export function SetFoundFlags(found: boolean) {
  rt.fill(248851, 6, 0);
  U8[248851] = found ? 1 : 0;
  U8[248852] = !found ? 1 : 0;
}

export async function EclFindItem() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  EclVars.LoadEclVars(1);
  SetFoundFlags(CharHlp.FindPartyItem((await EclVars.GetEclVar(1)), $f0) !== 0);
  S.sp = $sp;
}

export async function EclUseUpItem() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let item: number = 0;
  EclVars.LoadEclVars(1);
  item = CharHlp.FindPartyItem((await EclVars.GetEclVar(1)), $f0);
  SetFoundFlags(item !== 0);
  if (item !== 0) {
    if ((U8[item + 57] <= 1) && (U8[item + 52] !== 0)) {
      (await FxEngine.UnreadyItem(r32($f0), item));
    }
    (await CharHlp.UseUpItem(r32($f0), item));
    CharHlp.RecalcStats(r32($f0));
    CharDisp.DisplayParty(r32(229635));
  }
  S.sp = $sp;
}

export async function EclDelay() {
  w16(227060, r16(227060) + 1);
  (await TextRend.PauseOnly());
}

export async function EclDamage() {
  let attack: number = 0, dieCount: number = 0, sides: number = 0, i: number = 0, saveMod: number = 0, value: number = 0, bonus: number = 0, count: number = 0, saveType: number = 0, k: number = 0, dmg: number = 0, p: number = 0, q: number = 0, savedCur: number = 0, allParty: number = 0;
  savedCur = r32(229635);
  allParty = 0;
  p = r32(229639);
  EclVars.LoadEclVars(5);
  attack = (await EclVars.GetEclVar(1)) & 255;
  dieCount = (await EclVars.GetEclVar(2)) & 255;
  sides = (await EclVars.GetEclVar(3)) & 255;
  bonus = (await EclVars.GetEclVar(4)) & 255;
  value = (await EclVars.GetEclVar(5)) & 255;
  dmg = (bonus + Dice.RollDice(dieCount, sides)) & 65535;
  if ((attack & 64) !== 0) {
    allParty = 1;
  } else {
    count = Dice.RollDice(1, r16(r32(227037) + 1660) & 255) & 255;
  }
  if ((attack & 128) !== 0) {
    saveMod = attack & 31;
    saveType = value & 7;
    if (allParty !== 0) {
      while (p !== 0) {
        if ((attack & 32) !== 0) {
          (await EclMenu.EclInflictDamage(dmg, p));
        } else {
          if (!(await FxEngine.RollSavingThrow(p, saveType, saveMod))) {
            (await EclMenu.EclInflictDamage(dmg, p));
          }
        }
        p = r32(p + 260);
      }
    } else if ((value & 128) !== 0) {
      if ((saveType === 0) || !(await FxEngine.RollSavingThrow(r32(229635), saveType - 1, saveMod))) {
        (await EclMenu.EclInflictDamage(dmg, r32(229635)));
      }
    } else {
      for (let $i2 = 2, $e2 = count; $i2 <= $e2; $i2++) {
        i = $i2;
        p = r32(p + 260);
      }
      if (!(await FxEngine.RollSavingThrow(p, saveType, saveMod))) {
        (await EclMenu.EclInflictDamage(dmg, p));
      }
    }
  } else {
    q = r32(229639);
    while (q !== 0) {
      EffHndlr.ResetDisplacement(q);
      q = r32(q + 260);
    }
    for (let $i4 = 1, $e4 = attack; $i4 <= $e4; $i4++) {
      i = $i4;
      p = r32(229639);
      count = Dice.RollDice(1, r16(r32(227037) + 1660) & 255) & 255;
      k = 1;
      while (k < count) {
        p = r32(p + 260);
        k = (k + 1) & 255;
      }
      if ((await FxEngine.AttackRollNoAttacker(p, value))) {
        (await EclMenu.EclInflictDamage(dmg, p));
      }
      dmg = (bonus + Dice.RollDice(dieCount, sides)) & 65535;
    }
  }
  q = r32(229639);
  U8[227110] = true ? 1 : 0;
  while (q !== 0) {
    if (U8[q + 269] !== 0) {
      U8[227110] = false ? 1 : 0;
    }
    q = r32(q + 260);
  }
  if ((U8[227110] !== 0)) {
    (await Border.DrawWindow(1, 1, 38, 22, 0, 15, "The END!"));
    U8[229655] = 2;
    U8[229656] = 2;
    (await TextRend.DisplayMessageWindow(1, 1, 38, 22, 10, true, "The entire party is killed!"));
    (await Crt.Delay(3000));
  }
  w32(229635, savedCur);
  (await TextRend.DisplayAndPause(15, C_MSG.CONTINUE_PROMPT));
}

export async function EclSpriteOff() {
  w16(227060, r16(227060) + 1);
  if ((U8[232635] !== 0)) {
    (await MapView.DisplayMapView());
    U8[232635] = false ? 1 : 0;
    U8[232634] = false ? 1 : 0;
  }
}

export async function EclClock() {
  let n: number = 0;
  EclVars.LoadEclVars(1);
  n = (await EclVars.GetEclVar(1)) & 65535;
  while (n > 255) {
    (await FxEngine.AdvanceTime(255, 1));
    n = (n - 255) & 65535;
  }
  (await FxEngine.AdvanceTime(n, 1));
}

export function EclPrintRet() {
  w16(227060, r16(227060) + 1);
  U8[229655] = 1;
  U8[229656] = U8[229656] + 1;
  U8[262031] = 0;
}

export function EclClearBox() {
  w16(227060, r16(227060) + 1);
  TextRend.ClearRect(1, 1, 15, 15);
  U8[262030] = 1;
}

export async function EclWho() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 260);
  let at: number = 0, i: number = 0, back: number = 0;
  at = r16(227060);
  back = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    if ((U8[i * 5 + 262009] === U8[232633]) && (r16(i * 5 + 262010) === at)) {
      back = r16(i * 5 + 262012);
    }
  }
  EclVars.LoadEclVars(1);
  TextRend.ClearRect(1, 17, 38, 22);
  wS($f0, 255, rS(r32(232626)));
  w32($f0 + 256, r32(229635));
  (await CharDisp.SelectChar(rS($f0), back !== 0, $f0 + 256));
  if (r32($f0 + 256) === 0) {
    w16(227060, back);
  } else {
    w32(229635, r32($f0 + 256));
  }
  S.sp = $sp;
}

export async function EclAddNpc() {
  let id: number = 0, morale: number = 0, partySize: number = 0;
  EclVars.LoadEclVars(2);
  id = (await EclVars.GetEclVar(1)) & 255;
  partySize = r16(r32(227037) + 1660) & 255;
  (await EclMenu.AddCreatureToParty(id));
  if (r16(r32(227037) + 1660) === partySize) {
    return;
  }
  morale = (await EclVars.GetEclVar(2)) & 255;
  morale = Math.trunc(morale / 2);
  morale = morale | 128;
  U8[r32(229635) + 132] = morale;
  if (id !== 24) {
    U8[r32(229635) + 270] = 0;
  } else {
    U8[r32(229635) + 270] = 1;
  }
  if ((U8[227098] !== 0)) {
    U8[r32(229635) + 271] = 1;
  }
  CharHlp.RecalcStats(r32(229635));
  CharDisp.DisplayParty(r32(229635));
}

export async function EclSpell() {
  let spellId: number = 0, slot: number = 0, idx: number = 0, k: number = 0, p: number = 0, found: boolean = false, addr1: number = 0, addr2: number = 0;
  EclVars.LoadEclVars(3);
  spellId = (await EclVars.GetEclVar(1)) & 255;
  addr1 = EclVars.CombineBytesToWord(U8[232563], U8[232499]) & 65535;
  addr2 = EclVars.CombineBytesToWord(U8[232564], U8[232500]) & 65535;
  slot = 255;
  idx = 0;
  found = false;
  p = r32(229639);
  while ((p !== 0) && !found) {
    if (U8[p + 268] === 0) {
      for (let $i2 = 1; $i2 <= 20; $i2++) {
        k = $i2;
        if (!found && (U8[p + k + 23] === spellId)) {
          found = true;
          slot = (k - 1) & 255;
        }
      }
    }
    if (!found) {
      p = r32(p + 260);
      idx = (idx + 1) & 255;
    }
  }
  (await EclVars.WriteGbvm(addr1, slot));
  (await EclVars.WriteGbvm(addr2, idx));
}

export async function EclCall() {
  let address: number = 0, hold: number = 0;
  EclVars.LoadEclVars(1);
  address = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  switch (address) {
    case 11408: {
      U8[231436] = View3D.GetMapEvent(I8[231432], I8[231433]);
      if (U8[262006] !== 0) {
        if (((((U8[232634] !== 0) || (U8[232635] !== 0)) || (U8[232636] !== 0)) || (U8[255436] !== 0)) || (U8[255437] !== 0)) {
          (await MapView.DisplayMapView());
          CharDisp.PrintMiscInfo();
          U8[255437] = false ? 1 : 0;
          U8[232636] = false ? 1 : 0;
          U8[255436] = false ? 1 : 0;
          U8[232634] = false ? 1 : 0;
          U8[232635] = false ? 1 : 0;
        }
      }
      break;
    }
    case 32768: {
      (await CharDisp.SetWildView(false));
      (await EclMenu.CharFightsAlone(1));
      break;
    }
    case 32769: {
      (await CharDisp.SetWildView(false));
      (await EclMenu.CharFightsAlone(0));
      break;
    }
    case 47619: {
      switch (r16(255434)) {
        case 8: {
          SoundDrv.SoundEffect(r16(218793), 1);
          break;
        }
        case 10: {
          SoundDrv.SoundCommand(r16(218795));
          break;
        }
      }
      break;
    }
    case 49182: {
      EclMenu.EclMoveForward();
      break;
    }
    case 49176: {
      if (U8[227109] === 1) {
        U8[231435] = View3D.GetWallType(I8[231432], I8[231433], U8[231434]);
      }
      break;
    }
    case 2054: {
      if ((U8[227098] !== 0)) {
        (await Border.DrawWindow(3, 3, 13, 13, 0, 15, ""));
      }
      break;
    }
    case 33795: {
      if (U8[231449] > 1) {
        U8[231450] = U8[231450] + 1;
        if ((U8[231450] < 1) || (U8[231450] > U8[231449])) {
          U8[231450] = 1;
        }
        Portrait.DisplayImageBuf(3, 3, true, r32(U8[231450] * 8 + 231447));
        hold = (ri32(U8[231450] * 8 + 231443) * 10) | 0;
        if (hold < 25) {
          hold = 25;
        }
        (await TextRend.PauseTicks(hold));
      }
      break;
    }
  }
}

export async function EnterCamp() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  U8[$f0] = false ? 1 : 0;
  (await CallEclScript(r16(227054)));
  (await Camp.CampMainMenu($f0));
  if ((U8[$f0] !== 0)) {
    (await CharDisp.DisplayNoncombatInterface());
    (await CallEclScript(r16(227056)));
  }
  (await MapView.DisplayMapView());
  U8[229634] = 0;
  S.sp = $sp;
}

export async function EclProgram() {
  let v: number = 0, savedIp: number = 0;
  RestoreLoadedChar();
  EclVars.LoadEclVars(1);
  v = (await EclVars.GetEclVar(1)) & 255;
  switch (v) {
    case 0: {
      (await CharGen.MainMenu(true, false));
      if (U8[227107] !== 0) {
        U8[262003] = 1;
      } else {
        (await CharDisp.DisplayNoncombatInterface());
      }
      break;
    }
    case 8: {
      (await Ending.WinGame());
      break;
    }
    case 9: {
      savedIp = r16(227060);
      (await EnterCamp());
      w16(227060, savedIp);
      (await EclExit());
      break;
    }
    case 10: {
      (await Sage.SageMenu());
      break;
    }
    case 11: {
      MagicShp.StockShop();
      break;
    }
    case 3: {
      if ((U8[227098] !== 0)) {
        (await EclExit());
      }
      break;
    }
  }
}

export async function EclProtection() {
  let address: number = 0, a: number = 0, i: number = 0, c: number = 0, done: boolean = false;
  rt.fill(248858, 2, 0);
  U8[232634] = false ? 1 : 0;
  EclVars.LoadEclVars(1);
  address = EclVars.CombineBytesToWord(U8[232562], U8[232498]) & 65535;
  i = 0;
  done = false;
  if ((U8[262030] !== 0) && (U8[229656] > 13)) {
    U8[229656] = 5;
    U8[229655] = 2;
    U8[248861] = 1;
  }
  U8[262031] = 1;
  do {
    a = (address + i) & 65535;
    c = ((await EclVars.ReadGbvm(a)) + 1) & 255;
    if (c > 1) {
      TextRend.RenderChar(U8[229655], U8[229656], 15, 0, 1, c, 0);
      U8[229655] = U8[229655] + 1;
      i = (i + 1) & 65535;
    } else {
      done = true;
    }
  } while (!(done || (U8[229655] > 38)));
  U8[229656] = U8[229656] + 1;
}

export async function ExecNextEclCmd() {
  switch (U8[232433]) {
    case 0: {
      (await EclExit());
      break;
    }
    case 1: {
      EclGoto();
      break;
    }
    case 2: {
      EclGosubCmd();
      break;
    }
    case 3: {
      (await EclCompare());
      break;
    }
    case 4: case 5: case 6: case 7: {
      (await EclArith());
      break;
    }
    case 8: {
      (await EclRandom());
      break;
    }
    case 9: {
      (await EclSave());
      break;
    }
    case 10: {
      (await EclLoadChar());
      break;
    }
    case 11: {
      (await EclLoadMon());
      break;
    }
    case 12: {
      (await EclSetupMon());
      break;
    }
    case 13: {
      (await EclApproach());
      break;
    }
    case 14: {
      (await EclPicture());
      break;
    }
    case 15: {
      (await EclInputNum());
      break;
    }
    case 16: {
      (await EclInputStr());
      break;
    }
    case 17: case 18: {
      (await EclPrint());
      break;
    }
    case 19: {
      EclReturn();
      break;
    }
    case 20: {
      (await EclCompareAnd());
      break;
    }
    case 21: {
      (await EclVMenu());
      break;
    }
    case 22: case 23: case 24: case 25: case 26: case 27: {
      (await EclIf());
      break;
    }
    case 28: {
      EclClearMon();
      break;
    }
    case 29: {
      (await EclPartyStr());
      break;
    }
    case 30: {
      (await EclCheckParty());
      break;
    }
    case 32: {
      (await EclNewEcl());
      break;
    }
    case 33: case 55: {
      (await EclLoadFiles());
      break;
    }
    case 34: {
      (await EclPartySurprise());
      break;
    }
    case 35: {
      (await EclSurprise());
      break;
    }
    case 36: {
      (await EclCombat());
      break;
    }
    case 37: case 38: {
      (await EclOnGoto());
      break;
    }
    case 39: {
      (await EclTreasure());
      break;
    }
    case 40: {
      (await EclRob());
      break;
    }
    case 41: {
      (await EclEncounter());
      break;
    }
    case 42: {
      (await EclGetTable());
      break;
    }
    case 43: {
      (await EclHMenu());
      break;
    }
    case 44: {
      (await EclParlay());
      break;
    }
    case 45: {
      (await EclCall());
      break;
    }
    case 46: {
      (await EclDamage());
      break;
    }
    case 47: case 48: {
      (await EclAndOr());
      break;
    }
    case 49: {
      (await EclSpriteOff());
      break;
    }
    case 50: {
      (await EclFindItem());
      break;
    }
    case 51: {
      EclPrintRet();
      break;
    }
    case 52: {
      (await EclClock());
      break;
    }
    case 53: {
      (await EclSaveTable());
      break;
    }
    case 54: {
      (await EclAddNpc());
      break;
    }
    case 56: {
      (await EclProgram());
      break;
    }
    case 57: {
      (await EclWho());
      break;
    }
    case 58: {
      (await EclDelay());
      break;
    }
    case 59: {
      (await EclSpell());
      break;
    }
    case 60: {
      (await EclProtection());
      break;
    }
    case 61: {
      EclClearBox();
      break;
    }
    case 128: {
      (await EclUseUpItem());
      break;
    }
    default: {
      (await EclVars.SkipEclCmd());
    }
  }
}

export async function NewEclDone() {
  do {
    U8[231436] = View3D.GetMapEvent(I8[231432], I8[231433]);
    w16(r32(227037) + 1450, 0);
    w32(229643, r32(229635));
    U8[227108] = U8[227109];
    U8[227109] = 1;
    (await CallEclScript(r16(227058)));
    U8[227062] = 4;
    if (r16(r32(227033) + 460) === 0) {
      switch (U8[232633]) {
        case 25: {
          U8[227109] = 2;
          U8[227062] = 3;
          break;
        }
        case 26: {
          U8[227109] = 3;
          U8[227062] = 3;
          if ((r16(r32(227033) + 870) === 254) && (r16(r32(227033) + 836) === 0)) {
            (await Ending.YarashComplete(true));
          }
          break;
        }
        case 27: {
          U8[227109] = 4;
          U8[227062] = 3;
          break;
        }
      }
    }
    if ((U8[227108] > 1) && (U8[227109] === 1)) {
      (await Border.DrawWindow(3, 3, 13, 13, 0, 10, ""));
    }
    if ((((U8[227108] > 1) || (U8[227109] === 1)) && (U8[262006] !== 0)) || ((U8[227108] === 1) && (U8[227109] === 1))) {
      (await MapView.DisplayMapView());
    }
    U8[262004] = 0;
    (await CallEclScript(r16(227050)));
    if (U8[262004] === 0) {
      (await CallEclScript(r16(227052)));
      w32(229635, r32(229643));
      CharDisp.DisplayParty(r32(229635));
    }
  } while (!(U8[262004] === 0));
}

export function $init() {
  ForgetMonsters();
}
