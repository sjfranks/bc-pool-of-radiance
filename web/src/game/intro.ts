// Generated from src/intro.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as TextRend from './textrend';
import * as Blit from './blit';
import * as Border from './border';
import * as C_SOUND from './c_sound';
import * as SoundDrv from './sounddrv';
import * as FileUtil from './fileutil';
import * as TpRand from './tprand';
import * as GameDirs from './gamedirs';

export const FLASH_TICKS = 290;

export async function Introduction() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 260);
  let i: number = 0, deadline: number = 0, now: number = 0, last: number = 0;
  w32($f0, 0);
  wS($f0 + 4, 255, rS(143491));
  U8[143491] = 0;
  wS(143491, 255, GameDirs.OwnFolder("RAVFULL.DAX"));
  if (FileUtil.Exists(rS(143491) + "RAVFULL.DAX")) {
    (await Blit.LoadPic("RAVFULL", 1, false, 0, $f0));
    (await Blit.ShowPic(0, 0, r32($f0)));
    (await TextRend.DelayOrKey(2));
  }
  U8[143491] = 0;
  (await Blit.LoadPic("title", 1, false, 0, $f0));
  (await Blit.ShowPic(0, 0, r32($f0)));
  (await SoundDrv.PlayMusic(21));
  (await TextRend.DelayOrKey(5));
  if (!(U8[141146] !== 0)) {
    wS(143491, 255, rS($f0 + 4));
    Blit.FreePic($f0);
    { S.sp = $sp; return; }
  }
  (await Blit.LoadPic("title", 2, false, 0, $f0));
  wS(143491, 255, rS($f0 + 4));
  (await Blit.ShowPic(0, 0, r32($f0)));
  Blit.FreePic($f0);
  last = (await TextRend.GetTicks()) | 0;
  deadline = (last + 500) | 0;
  do {
    now = (await TextRend.GetTicks()) | 0;
    if (now !== last) {
      last = now;
      if (Blit.HasPalette() && (TpRand.Random(290) === 0)) {
        for (let $i2 = 0, $e2 = TpRand.Random(3) + 1; $i2 <= $e2; $i2++) {
          i = $i2;
          (await Blit.SetPaletteRegister(1, 9));
          (await Crt.Delay(150));
          (await Blit.SetPaletteRegister(1, 11));
          (await Crt.Delay(100));
          (await Blit.SetPaletteRegister(1, 15));
          (await Crt.Delay(50));
          (await Blit.SetPaletteRegister(1, 11));
          (await Crt.Delay(100));
          (await Blit.SetPaletteRegister(1, 9));
          (await Crt.Delay(150));
          (await Blit.SetPaletteRegister(1, 1));
        }
      }
    }
  } while (!(((await Crt.KeyPressed()) || (now >= deadline)) || (now < (deadline - 500))));
  (await Credits());
  S.sp = $sp;
}

export async function Credits() {
  (await Border.DrawWindow(1, 1, 38, 3, 0, 0, ""));
  (await Border.DrawWindow(1, 5, 38, 23, 0, 0, ""));
  TextRend.DisplayString(5, 1, 10, "scenario created by:");
  TextRend.DisplayString(26, 1, 14, "tsr, inc.");
  TextRend.DisplayString(15, 2, 10, "jim ward");
  TextRend.DisplayString(2, 3, 10, "david cook,steve winter,mike breault");
  TextRend.DisplayString(1, 5, 10, "game created by:");
  TextRend.DisplayString(18, 5, 14, "ssi special projects");
  TextRend.DisplayCentered(0, 39, 6, 11, rS(131605));
  TextRend.DisplayString(2, 7, 14, "programming:");
  TextRend.DisplayString(20, 7, 14, "original");
  TextRend.DisplayString(2, 8, 11, "scot bayless");
  TextRend.DisplayString(20, 8, 14, "programming:");
  TextRend.DisplayString(2, 9, 11, "brad myers");
  TextRend.DisplayString(20, 9, 11, "keith brors");
  TextRend.DisplayString(2, 10, 11, "russ brown");
  TextRend.DisplayString(20, 10, 11, "brad myers");
  TextRend.DisplayString(2, 11, 11, "ted greer");
  TextRend.DisplayString(2, 13, 14, "graphic arts:");
  TextRend.DisplayString(20, 13, 14, "encounter coding:");
  TextRend.DisplayString(2, 14, 11, "tom wahl");
  TextRend.DisplayString(20, 14, 11, "paul murray");
  TextRend.DisplayString(2, 15, 11, "fred butts");
  TextRend.DisplayString(20, 15, 11, "russ brown");
  TextRend.DisplayString(2, 16, 11, "darla marasco");
  TextRend.DisplayString(20, 16, 11, "victor penman");
  TextRend.DisplayString(2, 17, 11, "susan halbleib");
  TextRend.DisplayString(20, 17, 11, "dave shelley");
  TextRend.DisplayString(2, 19, 14, "project manager");
  TextRend.DisplayString(20, 19, 14, "developer:");
  TextRend.DisplayString(2, 20, 11, "victor penman");
  TextRend.DisplayString(20, 20, 11, "george mac donald");
  TextRend.DisplayString(2, 22, 14, "testing:");
  TextRend.DisplayString(11, 22, 11, "joel billings,steve salyer");
  TextRend.DisplayString(2, 23, 11, "james kucera,robert daly,rick white");
  (await TextRend.DelayOrKey(10));
}
