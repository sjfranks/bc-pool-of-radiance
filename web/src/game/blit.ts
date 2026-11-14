// Generated from src/blit.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as DaxIo from './daxio';
import * as Dos from './dos';
import * as GameIo from './gameio';
import * as StrUtil from './strutil';
import * as VidOps from './vidops';
import * as Host from './host';

export const MAX_BLOCK = 65520;

export const $at = { picBytes: 226092, picPeak: 226096 };

export function SrcNibble(color: number, map: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  mv($f0 + 0, map, 8);
  let $r0: number = 0;
  if ((color & 1) !== 0) {
    $r0 = U8[$f0 + (color >>> 1)] & 15;
  } else {
    $r0 = (U8[$f0 + (color >>> 1)] & 240) >>> 4;
  }
  S.sp = $sp;
  return $r0;
}

export function SetVideoMode(mode: number) {
  U8[141247] = U8[141248];
  U8[141227] = 0;
  U8[141226] = mode;
  Host.Intr(16, 141226);
  U8[141248] = mode;
}

export function RestoreVideoMode() {
  SetVideoMode(U8[141247]);
}

export async function LoadPic(name_: string, fileId: number, hasMask: boolean, transpColor: number, pic: number) {
  (await LoadPicBlocks(name_, fileId, hasMask, transpColor, 65520, pic));
}

export async function LoadPicBlocks(name_: string, fileId: number, hasMask: boolean, transpColor: number, blockBytes: number, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 23);
  let readOfs: number = 0;
  if (r32(pic) !== 0) {
    FreePic(pic);
  }
  (await DaxIo.LoadDax(name_, ".dax", fileId, $f0 + 17, $f0 + 19));
  if (r16($f0 + 17) === 0) {
    { S.sp = $sp; return; }
  }
  mv($f0, r32($f0 + 19), 2);
  mv($f0 + 2, r32($f0 + 19) + 2, 2);
  mv($f0 + 4, r32($f0 + 19) + 4, 2);
  mv($f0 + 6, r32($f0 + 19) + 6, 2);
  mv($f0 + 8, r32($f0 + 19) + 8, 1);
  mv($f0 + 9, r32($f0 + 19) + 9, 8);
  (await AllocPicBlocks(r16($f0), r16($f0 + 2), U8[$f0 + 8], (hasMask ? 1 : 0), blockBytes, pic));
  {
    const $w1 = r32(pic);
    w16($w1 + 4, r16($f0 + 4));
    w16($w1 + 6, r16($f0 + 6));
    mv($w1 + 9, $f0 + 9, 8);
  }
  readOfs = 17;
  (await VidOps.ExpandPicFrames(r32($f0 + 19), readOfs, transpColor, r32(pic)));
  rt.freeMem(r32($f0 + 19));
  S.sp = $sp;
}

export function BlitTileCell(screenX: number, screenY: number, tileIdx: number, flag: number, gfx: number, dest: number) {
  BlitTile(screenX, screenY, tileIdx, flag & (-5), gfx, dest, false);
}

export function BlitTileClipped(screenX: number, screenY: number, tileIdx: number, flag: number, gfx: number, dest: number) {
  BlitTile(screenX, screenY, tileIdx, flag, gfx, dest, true);
}

export async function MirrorPic(src: number, dst: number) {
  if ((src === 0) || (dst === 0)) {
    return;
  }
  mv(dst + 9, src + 9, 8);
  (await rt.FT[r32(141095)](src, dst));
}

export async function ShowPic(screenX: number, screenY: number, pic: number) {
  if (pic === 0) {
    return;
  }
  (await rt.FT[r32(141071)](screenX, screenY, pic));
}

export async function FlushView() {
  (await rt.FT[r32(141067)]());
  ClearSpans();
}

export function ClearSpans() {
  rt.fill(141257, 168, 0);
  rt.fill(141761, 336, 255);
  rt.fill(142097, 336, 0);
}

export async function RemapPic(fromColors: number, toColors: number, frame: number, isDithered: boolean, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  mv($f0 + 0, fromColors, 16);
  mv($f0 + 16, toColors, 16);
  w32($f0 + 32, pic);
  let srcOff: number = 0, nFrames: number = 0, pairIdx: number = 0, allFrames: boolean = false;
  if (r32($f0 + 32) === 0) {
    { S.sp = $sp; return; }
  }
  allFrames = frame < 0;
  if (!allFrames) {
    w16($f0 + 40, frame);
    FrameBlock($f0 + 32, $f0 + 40);
    if (r16($f0 + 40) >= U8[r32($f0 + 32) + 8]) {
      { S.sp = $sp; return; }
    }
    frame = r16($f0 + 40) << 16 >> 16;
  }
  {
    const $w1 = r32($f0 + 32);
    if (frame < 0) {
      frame = 0;
      nFrames = U8[$w1 + 8];
    } else {
      nFrames = 1;
    }
    srcOff = (frame * r16($w1 + 17)) & 65535;
  }
  (await AllocPic(r16(r32($f0 + 32)), r16(r32($f0 + 32) + 2), nFrames, 0, $f0 + 36));
  mv(r32($f0 + 36) + 9, r32($f0 + 32) + 9, 8);
  mv(r32($f0 + 36) + 27, r32($f0 + 32) + srcOff + 27, U8[r32($f0 + 36) + 8] * r16(r32($f0 + 36) + 17));
  for (let $i2 = 0; $i2 <= 15; $i2++) {
    pairIdx = $i2;
    if (U8[$f0 + pairIdx] !== U8[$f0 + pairIdx + 16]) {
      rt.FT[r32(141099)](r32($f0 + 32), r32($f0 + 36), srcOff, nFrames, U8[$f0 + pairIdx], U8[$f0 + pairIdx + 16], isDithered);
    }
  }
  {
    const $w3 = r32($f0 + 32);
    mv($w3 + (frame * r16($w3 + 17)) + 27, r32($f0 + 36) + 27, nFrames * r16($w3 + 17));
  }
  FreePic($f0 + 36);
  if (allFrames && (r32(r32($f0 + 32) + 23) !== 0)) {
    (await RemapPic($f0, $f0 + 16, -1, isDithered, r32(r32($f0 + 32) + 23)));
  }
  S.sp = $sp;
}

export async function AllocPic(height: number, width: number, count: number, flag: number, pic: number) {
  (await AllocPicBlocks(height, width, count, flag, 65520, pic));
}

export async function AllocPicBlocks(height: number, width: number, count: number, flag: number, blockBytes: number, pic: number) {
  let frameSize: number = 0, totalSize: number = 0, fit: number = 0, rest: number = 0;
  frameSize = FrameBytes(height, width) & 65535;
  if (frameSize === 0) {
    fit = count;
  } else {
    fit = Math.trunc((blockBytes - 27) / frameSize) | 0;
    if ((fit < 1) && (frameSize <= 65493)) {
      fit = 1;
    }
  }
  if ((fit < 1) && (frameSize > 0)) {
    (await GameIo.FatalError("A picture of " + StrUtil.NumStr(height) + " rows and " + StrUtil.NumStr(width) + " cells is too large for the " + rS(141029) + " video mode."));
  }
  rest = 0;
  if (count > fit) {
    rest = (count - fit) & 255;
    count = fit & 255;
  }
  totalSize = (count * frameSize) & 65535;
  w32(pic, rt.getMem(totalSize + 27));
  rt.fill(r32(pic), totalSize + 27, 0);
  w16(r32(pic), height);
  w16(r32(pic) + 2, width);
  w16(r32(pic) + 17, frameSize);
  U8[r32(pic) + 8] = count;
  if ((flag & 1) > 0) {
    w32(r32(pic) + 19, rt.getMem(MaskBytes(totalSize)));
    rt.fill(r32(r32(pic) + 19), MaskBytes(totalSize), 0);
  }
  w32(226092, ri32(226092) + (totalSize + 27));
  if ((flag & 1) > 0) {
    w32(226092, ri32(226092) + MaskBytes(totalSize));
  }
  if (ri32(226092) > ri32(226096)) {
    w32(226096, ri32(226092));
  }
  if (rest > 0) {
    (await AllocPicBlocks(height, width, rest, flag, blockBytes, r32(pic) + 23));
  }
}

export function FreePic(pic: number) {
  let nBytes: number = 0;
  if (r32(pic) === 0) {
    return;
  }
  FreePic(r32(pic) + 23);
  {
    const $w1 = r32(pic);
    nBytes = (U8[$w1 + 8] * r16($w1 + 17)) & 65535;
    if (r32($w1 + 19) !== 0) {
      rt.freeMem(r32($w1 + 19));
      w32(226092, ri32(226092) - MaskBytes(nBytes));
    }
  }
  w32(226092, ri32(226092) - (nBytes + 27));
  rt.freeMem(r32(pic));
  w32(pic, 0);
}

export async function FillPicRect(x: number, y: number, width: number, height: number, color: number, colorMap: number, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  mv($f0 + 0, colorMap, 8);
  let clipLeft: number = 0, clipRight: number = 0, clampedX: number = 0, rightMargin: number = 0, runLen: number = 0, lastRow: number = 0, dstOff: number = 0, row: number = 0, absRow: number = 0, screenOfs: number = 0, i: number = 0, cellLen: number = 0, cells: number = 0, uniform: boolean = false, firstOfs: number = 0;
  if (pic === 0) {
    { S.sp = $sp; return; }
  }
  if ((width === 0) || (height === 0)) {
    { S.sp = $sp; return; }
  }
  if ((((x >= r16(pic + 2)) || ((x + width) <= 0)) || (y >= r16(pic))) || ((y + height) <= 0)) {
    { S.sp = $sp; return; }
  }
  if (x < 0) {
    clipLeft = Math.abs(x) & 65535;
    clampedX = 0;
  } else {
    clipLeft = 0;
    clampedX = x & 65535;
  }
  if (r16(pic + 2) < (x + width)) {
    clipRight = ((x + width) - r16(pic + 2)) & 65535;
    rightMargin = 0;
  } else {
    clipRight = 0;
    rightMargin = (r16(pic + 2) - (x + width)) & 65535;
  }
  if (y < 0) {
    dstOff = 0;
    absRow = 0;
    lastRow = ((height - Math.abs(y)) - 1) & 65535;
    if (lastRow > (r16(pic) - 1)) {
      lastRow = (r16(pic) - 1) & 65535;
    }
  } else {
    absRow = y & 65535;
    dstOff = (absRow * r16(pic + 2)) & 65535;
    if (r16(pic) < (y + height)) {
      lastRow = ((r16(pic) - 1) - y) & 65535;
    } else {
      lastRow = (height - 1) & 65535;
    }
  }
  screenOfs = (clampedX << U8[141054]) & 65535;
  cells = ((width - clipLeft) - clipRight) & 65535;
  runLen = (cells << U8[141053]) & 65535;
  clampedX = (clampedX << U8[141053]) & 65535;
  rightMargin = (rightMargin << U8[141053]) & 65535;
  dstOff = (dstOff << U8[141053]) & 65535;
  (await rt.FT[r32(141056)](color, $f0, $f0 + 8));
  cellLen = (1 << U8[141053]) & 255;
  uniform = true;
  for (let $i1 = 1, $e1 = cellLen - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[$f0 + i + 8] !== U8[$f0 + 8]) {
      uniform = false;
    }
  }
  for (let $i2 = 0, $e2 = lastRow; $i2 <= $e2; $i2++) {
    row = $i2;
    dstOff = (dstOff + clampedX) & 65535;
    firstOfs = dstOff;
    if (uniform) {
      rt.fill(pic + dstOff + 27, runLen, U8[$f0 + 8]);
      dstOff = (dstOff + runLen) & 65535;
    } else if (cellLen === 4) {
      for (let $i3 = 1, $e3 = cells; $i3 <= $e3; $i3++) {
        i = $i3;
        w32((pic + dstOff + 27), ri32(($f0 + 8)));
        dstOff = (dstOff + 4) & 65535;
      }
    } else {
      for (let $i4 = 1, $e4 = cells; $i4 <= $e4; $i4++) {
        i = $i4;
        mv(pic + dstOff + 27, $f0 + 8, cellLen);
        dstOff = (dstOff + cellLen) & 65535;
      }
    }
    MarkSpan(absRow, firstOfs, dstOff - 1, screenOfs);
    dstOff = (dstOff + rightMargin) & 65535;
    absRow = (absRow + 1) & 65535;
  }
  S.sp = $sp;
}

export async function SetPaletteRegister(registerIndex: number, color: number) {
  if (HasPalette()) {
    (await rt.FT[r32(141115)](registerIndex, color));
  }
}

export function FrameBytes(height: number, width: number) {
  let $r0: number = 0;
  $r0 = ((height * width) << U8[141053]) & 65535;
  return $r0;
}

export function MaskBytes(imageBytes: number) {
  let $r0: number = 0;
  $r0 = imageBytes >>> U8[141055];
  return $r0;
}

export function ColourCount() {
  let $r0: number = 0;
  $r0 = U8[141050];
  return $r0;
}

export function HasPalette() {
  let $r0: boolean = false;
  $r0 = (U8[141051] !== 0);
  return $r0;
}

export function ClearPic(pic: number) {
  let clear: number = 0;
  if (pic === 0) {
    return;
  }
  if ((U8[141052] !== 0)) {
    clear = 255;
  } else {
    clear = 0;
  }
  rt.fill(pic + 27, r16(pic + 17), clear);
  if (r32(pic + 19) !== 0) {
    rt.fill(r32(pic + 19), MaskBytes(r16(pic + 17)), 255);
  }
}

export function FrameBlock(pic: number, frame: number) {
  while (((r32(pic) !== 0) && (r32(r32(pic) + 23) !== 0)) && (r16(frame) >= U8[r32(pic) + 8])) {
    w16(frame, r16(frame) - U8[r32(pic) + 8]);
    w32(pic, r32(r32(pic) + 23));
  }
}

export function FrameCount(pic: number) {
  let n: number = 0, $r0: number = 0;
  n = 0;
  while (pic !== 0) {
    n = (n + U8[pic + 8]) & 65535;
    pic = r32(pic + 23);
  }
  $r0 = n;
  return $r0;
}

export function MarkSpan(row: number, first: number, last: number, screenOfs: number) {
  U8[row + 141257] = 1;
  if (r16(row * 2 + 141761) > first) {
    w16(row * 2 + 141425, screenOfs);
    w16(row * 2 + 141761, first);
  }
  if (last > r16(row * 2 + 142097)) {
    w16(row * 2 + 142097, last);
  }
}

export function BlitTile(screenX: number, screenY: number, tileIdx: number, flag: number, gfx: number, dest: number, clip: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  w32($f0, gfx);
  let cs: number = 0, ms: number = 0, planesPerMask: number = 0, maskEach: boolean = false, clipLeft: number = 0, clipRight: number = 0, leftSkip: number = 0, rightSkip: number = 0, maskClipLeft: number = 0, maskClipRight: number = 0, rowBytes: number = 0, srcOff: number = 0, destOff: number = 0, saveOff: number = 0, lastRow: number = 0, y: number = 0, maskOff: number = 0, planesLeft: number = 0, scanline: number = 0, screenOff: number = 0, useMask: boolean = false, saveRequested: boolean = false, i: number = 0, firstOfs: number = 0;
  w16($f0 + 4, tileIdx);
  FrameBlock($f0, $f0 + 4);
  if ((r32($f0) === 0) || (dest === 0)) {
    { S.sp = $sp; return; }
  }
  useMask = ((flag & 1) > 0) && (r32(r32($f0) + 19) !== 0);
  saveRequested = (flag & 4) > 0;
  if (clip) {
    if (screenX < 0) {
      clipLeft = Math.abs(screenX) & 65535;
      if (clipLeft >= r16(r32($f0) + 2)) {
        { S.sp = $sp; return; }
      }
      leftSkip = 0;
    } else {
      clipLeft = 0;
      leftSkip = screenX & 65535;
      if (leftSkip >= r16(dest + 2)) {
        { S.sp = $sp; return; }
      }
    }
    if (r16(dest + 2) < (screenX + r16(r32($f0) + 2))) {
      clipRight = ((screenX + r16(r32($f0) + 2)) - r16(dest + 2)) & 65535;
      if (clipRight >= r16(r32($f0) + 2)) {
        { S.sp = $sp; return; }
      }
      rightSkip = 0;
    } else {
      clipRight = 0;
      rightSkip = (r16(dest + 2) - (screenX + r16(r32($f0) + 2))) & 65535;
    }
    if (screenY < 0) {
      srcOff = rt.mul(rt.mul(Math.abs(screenY), r16(r32($f0) + 2)), 8) & 65535;
      destOff = 0;
      scanline = 0;
      lastRow = ((r16(r32($f0)) - 1) - rt.mul(Math.abs(screenY), 8)) & 65535;
      if (((r16(r32($f0) + 17) - 1) < srcOff) || ((r16(r32($f0)) - 1) < lastRow)) {
        { S.sp = $sp; return; }
      }
      if (lastRow > (r16(dest) - 1)) {
        lastRow = (r16(dest) - 1) & 65535;
      }
    } else {
      srcOff = 0;
      scanline = (screenY * 8) & 65535;
      destOff = (scanline * r16(dest + 2)) & 65535;
      if (r16(dest) < ((screenY * 8) + r16(r32($f0)))) {
        lastRow = ((r16(dest) - 1) - (screenY * 8)) & 65535;
      } else {
        lastRow = (r16(r32($f0)) - 1) & 65535;
      }
      if ((((r16(r32($f0) + 17) - 1) < srcOff) || ((r16(dest + 17) - 1) < destOff)) || ((r16(r32($f0)) - 1) < lastRow)) {
        { S.sp = $sp; return; }
      }
    }
  } else {
    clipLeft = 0;
    clipRight = 0;
    srcOff = 0;
    scanline = (screenY * 8) & 65535;
    destOff = (scanline * r16(dest + 2)) & 65535;
    lastRow = (r16(r32($f0)) - 1) & 65535;
    leftSkip = screenX & 65535;
    rightSkip = (r16(dest + 2) - (screenX + r16(r32($f0) + 2))) & 65535;
  }
  cs = U8[141053];
  ms = U8[141055];
  screenOff = (leftSkip << U8[141054]) & 65535;
  rowBytes = (((r16(r32($f0) + 2) - clipLeft) - clipRight) << cs) & 65535;
  clipLeft = (clipLeft << cs) & 65535;
  clipRight = (clipRight << cs) & 65535;
  leftSkip = (leftSkip << cs) & 65535;
  rightSkip = (rightSkip << cs) & 65535;
  srcOff = (srcOff << cs) & 65535;
  saveOff = srcOff;
  srcOff = ((r16($f0 + 4) * r16(r32($f0) + 17)) + srcOff) & 65535;
  maskOff = srcOff >>> ms;
  maskClipLeft = clipLeft >>> ms;
  maskClipRight = clipRight >>> ms;
  planesPerMask = (1 << ms) & 255;
  planesLeft = planesPerMask;
  maskEach = useMask && (ms === 0);
  destOff = (destOff << cs) & 65535;
  for (let $i1 = 0, $e1 = lastRow; $i1 <= $e1; $i1++) {
    y = $i1;
    srcOff = (srcOff + clipLeft) & 65535;
    saveOff = (saveOff + clipLeft) & 65535;
    destOff = (destOff + leftSkip) & 65535;
    firstOfs = destOff;
    if (saveRequested) {
      mv(r32(141253) + saveOff + 27, dest + destOff + 27, rowBytes);
    }
    saveOff = (saveOff + rowBytes) & 65535;
    if (useMask && (U8[141052] !== 0)) {
      for (let $i2 = 1, $e2 = rowBytes; $i2 <= $e2; $i2++) {
        i = $i2;
        if (U8[r32($f0) + srcOff + 27] !== 255) {
          U8[dest + destOff + 27] = U8[r32($f0) + srcOff + 27];
        }
        srcOff = (srcOff + 1) & 65535;
        destOff = (destOff + 1) & 65535;
      }
    } else if (maskEach) {
      for (let $i3 = 1, $e3 = rowBytes; $i3 <= $e3; $i3++) {
        i = $i3;
        U8[dest + destOff + 27] = (U8[dest + destOff + 27] & U8[r32(r32($f0) + 19) + srcOff]) | U8[r32($f0) + srcOff + 27];
        srcOff = (srcOff + 1) & 65535;
        destOff = (destOff + 1) & 65535;
      }
    } else if (useMask) {
      maskOff = (maskOff + maskClipLeft) & 65535;
      for (let $i4 = 1, $e4 = rowBytes; $i4 <= $e4; $i4++) {
        i = $i4;
        U8[dest + destOff + 27] = (U8[dest + destOff + 27] & U8[r32(r32($f0) + 19) + maskOff]) | U8[r32($f0) + srcOff + 27];
        srcOff = (srcOff + 1) & 65535;
        planesLeft = (planesLeft - 1) & 255;
        if (planesLeft === 0) {
          planesLeft = planesPerMask;
          maskOff = (maskOff + 1) & 65535;
        }
        destOff = (destOff + 1) & 65535;
      }
      maskOff = (maskOff + maskClipRight) & 65535;
    } else {
      mv(dest + destOff + 27, r32($f0) + srcOff + 27, rowBytes);
      srcOff = (srcOff + rowBytes) & 65535;
      destOff = (destOff + rowBytes) & 65535;
    }
    MarkSpan(scanline, firstOfs, destOff - 1, screenOff);
    srcOff = (srcOff + clipRight) & 65535;
    saveOff = (saveOff + clipRight) & 65535;
    destOff = (destOff + rightSkip) & 65535;
    scanline = (scanline + 1) & 65535;
  }
  S.sp = $sp;
}

export function $init() {
  w32(226092, 0);
  w32(226096, 0);
}
