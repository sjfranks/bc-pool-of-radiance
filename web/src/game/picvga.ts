// Generated from src/picvga.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_VIDEO from './c_video';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as VidOps from './vidops';
import * as TpRand from './tprand';


export function ExpandChunk(chunk: number, mask: number, pic: number, at: number) {
  let k: number = 0;
  {
    const $w1 = pic;
    if (r32($w1 + 19) !== 0) {
      U8[r32($w1 + 19) + (at >>> 3)] = mask;
    }
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      if ((mask & (128 >>> k)) !== 0) {
        U8[$w1 + (at + k) + 27] = 255;
      } else {
        U8[$w1 + (at + k) + 27] = VidOps.ChunkPixel(chunk, k);
      }
    }
  }
}

export function MirrorFrame(src: number, dst: number) {
  let rowBytes: number = 0, row: number = 0, col: number = 0, rowOff: number = 0;
  {
    const $w1 = src;
    rowBytes = (r16($w1 + 2) * 8) & 65535;
    rowOff = 0;
    for (let $i2 = 1, $e2 = r16($w1); $i2 <= $e2; $i2++) {
      row = $i2;
      for (let $i3 = 0, $e3 = rowBytes - 1; $i3 <= $e3; $i3++) {
        col = $i3;
        U8[dst + (rowOff + col) + 27] = U8[$w1 + (((rowOff + rowBytes) - 1) - col) + 27];
      }
      rowOff = (rowOff + rowBytes) & 65535;
    }
  }
  VidOps.MirrorCellMask(src, dst);
}

export function RemapColour(pic: number, scratch: number, srcOff: number, nFrames: number, fromC: number, toC: number, isDithered: boolean) {
  let n: number = 0, total: number = 0, dstOff: number = 0;
  dstOff = 0;
  total = (nFrames * r16(scratch + 17)) & 65535;
  for (let $i1 = 1, $e1 = total; $i1 <= $e1; $i1++) {
    n = $i1;
    if (U8[pic + srcOff + 27] === fromC) {
      if (!isDithered || (TpRand.Random(4) === 0)) {
        U8[scratch + dstOff + 27] = toC;
      }
    }
    srcOff = (srcOff + 1) & 65535;
    dstOff = (dstOff + 1) & 65535;
  }
}

export function RecolorFrame(toT: number, pic: number) {
  let n: number = 0;
  for (let $i1 = 0, $e1 = r16(pic + 17) - 1; $i1 <= $e1; $i1++) {
    n = $i1;
    if (U8[pic + n + 27] < 16) {
      U8[pic + n + 27] = U8[toT + U8[pic + n + 27]];
    }
  }
}

export function PutPixelRow(pic: number, at: number, y: number, px: number) {
  let k: number = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    k = $i1;
    U8[pic + ((at + (y * 8)) + k) + 27] = U8[px + k] & 15;
  }
}

export function InitRowTables() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 199; $i1++) {
    i = $i1;
    w16(i * 2 + 142833, i * 320);
  }
}
