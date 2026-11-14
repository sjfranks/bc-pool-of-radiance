// Generated from src/gameboot.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_OPT from './c_opt';
import * as CfgFile from './cfgfile';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as Dos from './dos';
import * as Blit from './blit';
import * as SoundDrv from './sounddrv';
import * as DaxIo from './daxio';
import * as FileUtil from './fileutil';
import * as GameIo from './gameio';
import * as CbtLog from './cbtlog';
import * as VidVga from './vidvga';
import * as SndDig from './snddig';
import * as Host from './host';
import * as GameDirs from './gamedirs';
import * as DataPick from './datapick';

export const GFX_RESERVE_PARAS = 1024;
export const OVERLAY_BUF_BYTES = 100352;

export const $at = { cfgVideo: 235038, cfgSound: 235039, cfgIntro: 235040 };

export function ReadConfig() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 912);
  let $t1;
  if (($t1 = CfgFile.ReadPoolCfg(GameDirs.ReadName(C_OPT.CFG_NAME), $f0, $f0 + 836), $t1 === 1 || $t1 === 3)) {
    rt.WriteT(65568, "POOL.CFG is missing or unreadable: playing with the defaults. Run poolcfg to set up the game." + "\n");
    CfgFile.PoolDefaults($f0, "");
  }
  U8[235038] = U8[$f0];
  U8[235039] = U8[$f0 + 1];
  U8[235040] = U8[$f0 + 2];
  wS(229377, 255, rS($f0 + 3));
  wS(229121, 255, rS($f0 + 259));
  S.sp = $sp;
}

export function NativeFolders(gameDir: number, saveDir: number) {
  wS(saveDir, 255, CfgFile.NativeSaveFolder(rS(gameDir), rS(saveDir), rS(233220)));
  wS(gameDir, 255, rS(232964));
}

export function SwitchGiven(word: string) {
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 2, $e1 = rt.ParamCount(); $i1 <= $e1; $i1++) {
    i = $i1;
    if (rt.ParamStr(i) === word) {
      $r0 = true;
    }
  }
  return $r0;
}

export function $init() {
  U8[227094] = rt.ParamStr(1) === "STING" ? 1 : 0;
  U8[227095] = rt.ParamStr(2) === "NORAND" ? 1 : 0;
  U8[227096] = (U8[227094] !== 0) && SwitchGiven("ADVISE") ? 1 : 0;
  U8[227097] = (rt.ParamStr(1) === "DEMO") || SwitchGiven("DEMO") ? 1 : 0;
  DataPick.FindGame();
  U8[227105] = false ? 1 : 0;
  CbtLog.Startup();
  U8[151678] = false ? 1 : 0;
  ReadConfig();
  U8[227113] = 15;
  Host.Intr(16, 227112);
  U8[227133] = U8[227112];
  U8[227134] = U8[227133];
  VidVga.Install();
  Blit.SetVideoMode(U8[226946]);
  rt.FT[r32(226949)]();
  SndDig.Install();
  U8[229119] = U8[227026];
  SoundDrv.SoundSuspend();
  NativeFolders(229377, 229121);
  U8[227032] = U8[235040] === 70 ? 1 : 0;
}
