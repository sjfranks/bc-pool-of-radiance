// Generated from src/ending.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_TILE from './c_tile';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CharHlp from './charhlp';
import * as Wilds from './wilds';
import * as Portrait from './portrait';
import * as C_GBVM from './c_gbvm';
import * as C_IFC from './c_ifc';
import * as Blit from './blit';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as MapTiles from './maptiles';


export async function WinGame() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let savedIfc: number = 0, cycles: number = 0;
  cycles = Math.trunc(rt.mul((10 - U8[141163]) & 65535, 5) / 2) & 255;
  wS($f0 + 4, 1, rt.fmtI(U8[143234], 0));
  savedIfc = U8[141176];
  U8[141176] = 7;
  w32($f0, 0);
  TextRend.ClearBottomLine();
  (await TextRend.ClearRect(1, 17, 38, 22));
  TextRend.DisplayString(1, 17, 10, "Mortally wounded, the dragon roars!");
  TextRend.DisplayString(1, 18, 10, "The spirit of Tyranthraxus flares up");
  TextRend.DisplayString(1, 19, 10, "from the dragon's body.");
  (await CharDisp.DisplayNoncombatInterface());
  (await Blit.LoadPic("FINAL" + rS($f0 + 4), 1, false, 0, $f0));
  Blit.BlitTileClipped(0, 0, 0, 0, r32($f0), r32(141249));
  (await PlayFinalAnim(3, 5, 2, cycles));
  (await Blit.LoadPic("FINAL" + rS($f0 + 4), 3, false, 0, $f0));
  Blit.BlitTileClipped(0, 0, 0, 0, r32($f0), r32(141249));
  if (r16(r32(141151) + 1660) > 1) {
    (await Blit.LoadPic("FINAL" + rS($f0 + 4), 4, false, 0, $f0));
    Blit.BlitTileClipped(0, 11, 0, 0, r32($f0), r32(141249));
  }
  if (r16(r32(141151) + 1660) > 2) {
    (await Blit.LoadPic("FINAL" + rS($f0 + 4), 5, false, 0, $f0));
    Blit.BlitTileClipped(13, 9, 0, 0, r32($f0), r32(141249));
  }
  if (r16(r32(141151) + 1660) > 3) {
    (await Blit.LoadPic("FINAL" + rS($f0 + 4), 6, false, 0, $f0));
    Blit.BlitTileClipped(0, 9, 0, 0, r32($f0), r32(141249));
  }
  (await TextRend.ClearRect(1, 17, 38, 22));
  TextRend.DisplayString(1, 17, 10, "\"Fools, you have but slain the body");
  TextRend.DisplayString(1, 18, 10, "I possessed.  I cannot be defeated!\"");
  TextRend.DisplayString(1, 19, 10, "With the power of the pool of radiance");
  TextRend.DisplayString(1, 20, 10, "which I moved here, to my lair,");
  TextRend.DisplayString(1, 21, 10, "I will still rule, by possessing one");
  TextRend.DisplayString(1, 22, 10, "of you!\"");
  (await PlayFinalAnim(3, 1, 7, cycles));
  (await TextRend.ClearRect(1, 17, 38, 22));
  TextRend.DisplayString(1, 17, 10, "\"No Lord Bane!  I can still rule here!");
  TextRend.DisplayString(1, 18, 10, "I have not failed.  Do not call me back");
  TextRend.DisplayString(1, 19, 10, "through the pool!\"");
  TextRend.DisplayString(1, 20, 10, "Noooo...");
  (await PlayFinalAnim(3, 1, 8, 1));
  (await TextRend.PauseOnly());
  (await TextRend.PauseOnly());
  (await TextRend.PauseOnly());
  Blit.FreePic($f0);
  U8[141176] = savedIfc;
  (await CharDisp.DisplayNoncombatInterface());
  S.sp = $sp;
}

export async function YarashComplete(animate: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let step: number = 0;
  async function RemapTile(tile: number, toT: number, dither: boolean) {
    if (tile > 127) {
      (await Blit.RemapPic(132853, toT, tile & 127, dither, (await MapTiles.SecondSheet())));
    } else {
      (await Blit.RemapPic(132853, toT, tile, dither, r32(143795)));
    }
  }
  async function RemapPyramid(dither: boolean) {
    let t: number = 0;
    for (let $i1 = 0; $i1 <= 10; $i1++) {
      t = $i1;
      (await RemapTile(U8[t + 240776], $f0, dither));
    }
    for (let $i2 = 0; $i2 <= 17; $i2++) {
      t = $i2;
      (await RemapTile(U8[t + 240787], $f0 + 16, dither));
    }
  }
  mv($f0 + 16, 132853, 16);
  U8[$f0 + 23] = 2;
  mv($f0, $f0 + 16, 16);
  U8[$f0] = 1;
  if (animate) {
    (await Wilds.BuildWildernessMap(17, 15, 4));
    (await Blit.FlushView());
    for (let $i3 = 0; $i3 <= 8; $i3++) {
      step = $i3;
      (await RemapPyramid(true));
      (await Wilds.BuildWildernessMap(U8[step + 240805], U8[step + 240814], 4));
      (await Blit.FlushView());
    }
  }
  (await RemapPyramid(false));
  if (animate) {
    (await Wilds.BuildWildernessMap(23, 25, 4));
    (await Blit.FlushView());
    (await TextRend.PauseOnly());
    (await TextRend.PauseOnly());
  }
  S.sp = $sp;
}

export async function PlayFinalAnim(col: number, row: number, picId: number, nCycles: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 66);
  let tickNow: number = 0, tickLast: number = 0, cycles: number = 0;
  cycles = 0;
  tickLast = (await TextRend.GetTicks()) | 0;
  rt.fill($f0, 66, 0);
  (await Portrait.LoadAnimation("FINAL", picId, 2, $f0));
  if (U8[$f0] === 0) {
    Portrait.FreeAnimation($f0);
    { S.sp = $sp; return; }
  }
  Blit.BlitTileClipped(col - 1, row - 1, 0, 0, r32($f0 + 6), r32(141249));
  (await Blit.FlushView());
  do {
    (await Portrait.DisplayImageBuf(col, row, true, r32($f0 + U8[$f0 + 1] * 8 - 2)));
    tickNow = (await TextRend.GetTicks()) | 0;
    if (((tickNow - tickLast) > (ri32($f0 + U8[$f0 + 1] * 8 - 6) * (U8[141163] + 3))) || (tickNow < tickLast)) {
      U8[$f0 + 1] = U8[$f0 + 1] + 1;
      if (U8[$f0 + 1] > U8[$f0]) {
        U8[$f0 + 1] = 1;
        cycles = (cycles + 1) & 255;
      }
      tickLast = tickNow;
    }
  } while (!(cycles === nCycles));
  Portrait.FreeAnimation($f0);
  S.sp = $sp;
}
