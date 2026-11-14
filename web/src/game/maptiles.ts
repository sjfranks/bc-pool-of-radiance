// Generated from src/maptiles.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_TILE from './c_tile';
import * as C_TERR from './c_terr';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as GameIo from './gameio';
import * as C_DIR from './c_dir';

export const FIRST_MONSTER_ICON = 8;
export const LAST_MONSTER_ICON = 12;
export const FIRST_WILD_ICON = 9;
export const FEATURE_SLOT = 34;
export const SHEET_BLOCK = 16384;

export const $at = { mapTilePtr2: 235041, cloudkillArt: 235045 };

export async function Load24x24Set(name_: string, mult: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 10);
  let i: number = 0, tiles: number = 0;
  if (mult > 127) {
    (await GameIo.FatalError("Start range error in Load24x24Set"));
  }
  w32($f0, 0);
  (await Blit.LoadPic(name_, 1, false, 0, $f0));
  if (r32($f0) === 0) {
    { S.sp = $sp; return; }
  }
  if (r32(229681) !== 0) {
    tiles = U8[r32($f0) + 8];
    if ((mult + tiles) > Blit.FrameCount(r32(229681))) {
      tiles = (Blit.FrameCount(r32(229681)) - mult) << 16 >> 16;
    }
    for (let $i1 = 0, $e1 = tiles - 1; $i1 <= $e1; $i1++) {
      i = $i1;
      w32($f0 + 4, r32(229681));
      w16($f0 + 8, mult + i);
      Blit.FrameBlock($f0 + 4, $f0 + 8);
      mv(r32($f0 + 4) + (r16($f0 + 8) * r16(r32($f0 + 4) + 17)) + 27, r32($f0) + (i * r16(r32($f0) + 17)) + 27, r16(r32($f0) + 17));
    }
  }
  Blit.FreePic($f0);
  S.sp = $sp;
}

export async function Copy2DTile(col: number, row: number, tile: number) {
  (await DrawTile(col, row, tile, false));
}

export async function Copy2DTileClipped(col: number, row: number, tile: number) {
  (await DrawTile(col, row, tile, true));
}

export async function DrawTerrain(col: number, row: number, terr: number) {
  let clip: boolean = false;
  clip = (col + 3) > r16(r32(227135) + 2);
  if ((terr === 66) && (r32(235045) !== 0)) {
    if (clip) {
      Blit.BlitTileClipped(col, row, 0, 0, r32(235045), r32(227135));
    } else {
      Blit.BlitTileCell(col, row, 0, 0, r32(235045), r32(227135));
    }
  } else {
    (await DrawTile(col, row, U8[terr * 3 + 218830], clip));
  }
}

export async function LoadCloudkillArt() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 26);
  Blit.FreePic(235045);
  w32($f0, 0);
  (await Blit.LoadPic("RandCom", 1, false, 0, $f0));
  if (r32($f0) === 0) {
    { S.sp = $sp; return; }
  }
  (await Blit.AllocPic(r16(r32($f0)), r16(r32($f0) + 2), 1, 0, 235045));
  mv(r32(235045) + 9, r32($f0) + 9, 8);
  w32($f0 + 4, r32($f0));
  w16($f0 + 8, U8[218920] - 34);
  Blit.FrameBlock($f0 + 4, $f0 + 8);
  mv(r32(235045) + 27, r32($f0 + 4) + (r16($f0 + 8) * r16(r32($f0 + 4) + 17)) + 27, r16(r32($f0 + 4) + 17));
  Blit.FreePic($f0);
  mv($f0 + 10, 218739, 16);
  U8[$f0 + 20] = 14;
  (await Blit.RemapPic(218739, $f0 + 10, 0, false, r32(235045)));
  S.sp = $sp;
}

export function FreeCloudkillArt() {
  Blit.FreePic(235045);
}

export async function SecondSheet() {
  let $r0: number = 0;
  (await LoadSecondSheet());
  $r0 = r32(235041);
  return $r0;
}

export async function LoadSecondSheet() {
  if (r32(235041) === 0) {
    (await Blit.LoadPicBlocks("sqrpaci", 2, false, 0, 16384, 235041));
  }
}

export function FreeSecondSheet() {
  Blit.FreePic(235041);
}

export function FreeIconAnim(animIdx: number) {
  if (animIdx > 25) {
    return;
  }
  Blit.FreePic(animIdx * 8 + 229685);
  Blit.FreePic(animIdx * 8 + 229689);
}

export async function LoadIconAnim(name_: string, fileId: number, animIdx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let frame: number = 0;
  if (animIdx > 25) {
    { S.sp = $sp; return; }
  }
  wS($f0, 1, "");
  if ((rt.Copy(name_, 1, 5) === "CHEAD") || (rt.Copy(name_, 1, 5) === "CBODY")) {
    if (rt.UpCase(rt.chAt(name_, name_.length)) === 84) {
      fileId = (fileId + 64) & 255;
    }
    name_ = rt.Copy(name_, 1, name_.length - 1);
  } else if ((name_ !== "COMSPR") && (name_ !== "ICON")) {
    wS($f0, 1, rt.fmtI(U8[229120], 0));
  }
  for (let $i1 = 0; $i1 <= 1; $i1++) {
    frame = $i1;
    (await Blit.LoadPic(name_ + rS($f0), fileId + (128 * frame), true, 0, animIdx * 8 + frame * 4 + 229685));
    if (name_ === "ICON") {
      (await Blit.RemapPic(218739, 218755, 0, false, r32(animIdx * 8 + frame * 4 + 229685)));
    } else if (rS($f0) !== "") {
      (await Blit.RemapPic(218739, 235049, 0, false, r32(animIdx * 8 + frame * 4 + 229685)));
    }
  }
  S.sp = $sp;
}

export async function LoadWildIcons() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 2; $i1++) {
    i = $i1;
    (await LoadIconAnim("ICON", i, 9 + i));
  }
}

export async function DrawIconAnimSprite(col: number, row: number, facing: number, frame: number, animIdx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  if ((animIdx > 25) || (frame > 1)) {
    { S.sp = $sp; return; }
  }
  if (r32(animIdx * 8 + frame * 4 + 229685) === 0) {
    { S.sp = $sp; return; }
  }
  {
    const $w1 = r32(animIdx * 8 + frame * 4 + 229685);
    (await Blit.AllocPic(r16($w1), r16($w1 + 2), 1, 1, $f0));
    if (facing > 3) {
      Blit.MirrorPic(r32(animIdx * 8 + frame * 4 + 229685), r32($f0));
    } else {
      mv(r32($f0) + 27, $w1 + 27, r16($w1 + 17));
      mv(r32(r32($f0) + 19), r32($w1 + 19), Blit.MaskBytes(r16($w1 + 17)));
    }
  }
  Blit.BlitTileClipped(col * 3, row * 3, 0, 1, r32($f0), r32(227135));
  Blit.FreePic($f0);
  S.sp = $sp;
}

export async function DrawTile(col: number, row: number, tile: number, clip: boolean) {
  let sheet: number = 0;
  if (tile > 127) {
    sheet = (await SecondSheet());
  } else {
    sheet = r32(229681);
  }
  if (sheet === 0) {
    return;
  }
  if (clip) {
    Blit.BlitTileClipped(col, row, tile & 127, 0, sheet, r32(227135));
  } else {
    Blit.BlitTileCell(col, row, tile & 127, 0, sheet, r32(227135));
  }
}

export function $init() {
  w32(235041, 0);
  w32(235045, 0);
}
