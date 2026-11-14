// Generated from src/picega.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as VidOps from './vidops';
import * as TpRand from './tprand';


export function ExpandChunk(chunk: number, mask: number, pic: number, at: number) {
  let k: number = 0, bit: number = 0, plane: number = 0, color: number = 0;
  {
    const $w1 = pic;
    if (r32($w1 + 19) !== 0) {
      U8[r32($w1 + 19) + (at >>> 2)] = mask;
    }
    bit = 128;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      color = VidOps.ChunkPixel(chunk, k) & 255;
      for (let $i3 = 0; $i3 <= 3; $i3++) {
        plane = $i3;
        if ((U8[plane + 132841] & color) > 0) {
          U8[$w1 + (plane + at) + 27] = U8[$w1 + (plane + at) + 27] | bit;
        }
      }
      bit = bit >>> 1;
    }
    if (r32($w1 + 19) !== 0) {
      for (let $i4 = 0; $i4 <= 3; $i4++) {
        plane = $i4;
        U8[$w1 + (plane + at) + 27] = U8[$w1 + (plane + at) + 27] & (~mask & 255);
      }
    }
  }
}

export function MirrorFrame(src: number, dst: number) {
  let dstOff: number = 0, srcOff: number = 0, rowStart: number = 0, rowBytes: number = 0, col: number = 0, row: number = 0, plane: number = 0;
  {
    const $w1 = src;
    rowBytes = (r16($w1 + 2) * 4) & 65535;
    srcOff = (rowBytes - 4) & 65535;
    dstOff = 0;
    for (let $i2 = 1, $e2 = r16($w1); $i2 <= $e2; $i2++) {
      row = $i2;
      rowStart = dstOff;
      for (let $i3 = 1, $e3 = r16($w1 + 2); $i3 <= $e3; $i3++) {
        col = $i3;
        for (let $i4 = 0; $i4 <= 3; $i4++) {
          plane = $i4;
          U8[dst + (plane + dstOff) + 27] = VidOps.MirrorBits(U8[$w1 + (((srcOff - dstOff) + rowStart) + plane) + 27]);
        }
        dstOff = (dstOff + 4) & 65535;
      }
      srcOff = (srcOff + rowBytes) & 65535;
    }
  }
  VidOps.MirrorCellMask(src, dst);
}

export function RemapColour(pic: number, scratch: number, srcOff: number, nFrames: number, fromC: number, toC: number, isDithered: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let frameNo: number = 0, col: number = 0, row: number = 0, match: number = 0, plane: number = 0, dstOff: number = 0;
  dstOff = 0;
  {
    const $w1 = scratch;
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      plane = $i2;
      if ((fromC & U8[plane + 132841]) > 0) {
        U8[$f0 + plane] = 0;
      } else {
        U8[$f0 + plane] = 255;
      }
    }
    for (let $i3 = 1, $e3 = nFrames; $i3 <= $e3; $i3++) {
      frameNo = $i3;
      for (let $i4 = 1, $e4 = r16($w1); $i4 <= $e4; $i4++) {
        row = $i4;
        for (let $i5 = 1, $e5 = r16($w1 + 2); $i5 <= $e5; $i5++) {
          col = $i5;
          if (isDithered) {
            match = (TpRand.Random(256) & TpRand.Random(256)) & 255;
          } else {
            match = 255;
          }
          for (let $i6 = 0; $i6 <= 3; $i6++) {
            plane = $i6;
            match = (U8[pic + (plane + srcOff) + 27] ^ U8[$f0 + plane]) & match;
          }
          for (let $i7 = 0; $i7 <= 3; $i7++) {
            plane = $i7;
            if ((toC & U8[plane + 132841]) > 0) {
              U8[$w1 + (plane + dstOff) + 27] = U8[$w1 + (plane + dstOff) + 27] | match;
            } else {
              U8[$w1 + (plane + dstOff) + 27] = U8[$w1 + (plane + dstOff) + 27] & (~match & 255);
            }
          }
          srcOff = (srcOff + 4) & 65535;
          dstOff = (dstOff + 4) & 65535;
        }
      }
    }
  }
  S.sp = $sp;
}

export function RecolorFrame(toT: number, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let n: number = 0, k: number = 0, bit: number = 0, c: number = 0;
  n = 0;
  while ((n + 3) < r16(pic + 17)) {
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      k = $i2;
      U8[$f0 + k] = 0;
    }
    for (let $i3 = 0; $i3 <= 7; $i3++) {
      bit = $i3;
      c = (((((U8[pic + n + 27] >>> bit) & 1) | (((U8[pic + (n + 1) + 27] >>> bit) & 1) << 1)) | (((U8[pic + (n + 2) + 27] >>> bit) & 1) << 2)) | (((U8[pic + (n + 3) + 27] >>> bit) & 1) << 3)) & 255;
      c = U8[toT + c];
      for (let $i4 = 0; $i4 <= 3; $i4++) {
        k = $i4;
        if ((c & (1 << k)) !== 0) {
          U8[$f0 + k] = U8[$f0 + k] | (1 << bit);
        }
      }
    }
    for (let $i5 = 0; $i5 <= 3; $i5++) {
      k = $i5;
      U8[pic + (n + k) + 27] = U8[$f0 + k];
    }
    n = (n + 4) & 65535;
  }
  S.sp = $sp;
}

export function PutPixelRow(pic: number, at: number, y: number, px: number) {
  let plane: number = 0, k: number = 0, b: number = 0;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    plane = $i1;
    b = 0;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      if ((U8[px + k] & U8[plane + 132841]) !== 0) {
        b = b | (128 >>> k);
      }
    }
    U8[pic + ((at + (y * 4)) + plane) + 27] = b;
  }
}

export function InitRowTables() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 199; $i1++) {
    i = $i1;
    w16(i * 2 + 142833, i * 40);
  }
}
