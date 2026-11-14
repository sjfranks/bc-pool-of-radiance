// Generated from src/pictdy.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
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
  let k: number = 0, m: number = 0;
  {
    const $w1 = pic;
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      k = $i2;
      U8[$w1 + (at + k) + 27] = U8[chunk + k];
      if (r32($w1 + 19) !== 0) {
        m = 0;
        if ((mask & (128 >>> (2 * k))) !== 0) {
          m = 240;
        }
        if ((mask & (64 >>> (2 * k))) !== 0) {
          m = (m + 15) & 255;
        }
        U8[r32($w1 + 19) + (at + k)] = m;
        U8[$w1 + (at + k) + 27] = U8[$w1 + (at + k) + 27] & (~m & 255);
      }
    }
  }
}

export function MirrorFrame(src: number, dst: number) {
  let dstOff: number = 0, srcOff: number = 0, rowStart: number = 0, rowBytes: number = 0, col: number = 0, row: number = 0;
  {
    const $w1 = src;
    rowBytes = (r16($w1 + 2) * 4) & 65535;
    srcOff = (rowBytes - 1) & 65535;
    dstOff = 0;
    for (let $i2 = 1, $e2 = r16($w1); $i2 <= $e2; $i2++) {
      row = $i2;
      rowStart = dstOff;
      for (let $i3 = 1, $e3 = rowBytes; $i3 <= $e3; $i3++) {
        col = $i3;
        U8[dst + dstOff + 27] = VidOps.MirrorNibbles(U8[$w1 + ((srcOff - dstOff) + rowStart) + 27]);
        if (r32($w1 + 19) !== 0) {
          U8[r32(dst + 19) + dstOff] = VidOps.MirrorNibbles(U8[r32($w1 + 19) + ((srcOff - dstOff) + rowStart)]);
        }
        dstOff = (dstOff + 1) & 65535;
      }
      srcOff = (srcOff + rowBytes) & 65535;
    }
  }
}

export function RemapColour(pic: number, scratch: number, srcOff: number, nFrames: number, fromC: number, toC: number, isDithered: boolean) {
  let frameNo: number = 0, col: number = 0, row: number = 0, rowBytes: number = 0, fromHigh: number = 0, toHigh: number = 0, dstOff: number = 0;
  dstOff = 0;
  {
    const $w1 = scratch;
    rowBytes = (r16($w1 + 2) * 4) & 65535;
    fromHigh = (fromC << 4) & 255;
    toHigh = (toC << 4) & 255;
    for (let $i2 = 1, $e2 = nFrames; $i2 <= $e2; $i2++) {
      frameNo = $i2;
      for (let $i3 = 1, $e3 = r16($w1); $i3 <= $e3; $i3++) {
        row = $i3;
        for (let $i4 = 1, $e4 = rowBytes; $i4 <= $e4; $i4++) {
          col = $i4;
          if ((U8[pic + srcOff + 27] & 240) === fromHigh) {
            if (!isDithered || (TpRand.Random(4) === 0)) {
              U8[$w1 + dstOff + 27] = (U8[$w1 + dstOff + 27] & 15) | toHigh;
            }
          }
          if ((U8[pic + srcOff + 27] & 15) === fromC) {
            if (!isDithered || (TpRand.Random(4) === 0)) {
              U8[$w1 + dstOff + 27] = (U8[$w1 + dstOff + 27] & 240) | toC;
            }
          }
          srcOff = (srcOff + 1) & 65535;
          dstOff = (dstOff + 1) & 65535;
        }
      }
    }
  }
}

export function RecolorFrame(toT: number, pic: number) {
  let n: number = 0;
  for (let $i1 = 0, $e1 = r16(pic + 17) - 1; $i1 <= $e1; $i1++) {
    n = $i1;
    U8[pic + n + 27] = (U8[toT + (U8[pic + n + 27] >>> 4)] << 4) | U8[toT + (U8[pic + n + 27] & 15)];
  }
}

export function PutPixelRow(pic: number, at: number, y: number, px: number) {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    U8[pic + ((at + (y * 4)) + i) + 27] = ((U8[px + (i * 2)] & 15) << 4) | (U8[px + ((i * 2) + 1)] & 15);
  }
}

export function InitRowTables() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 199; $i1++) {
    i = $i1;
    w16(i * 2 + 142433, ((Math.trunc(i / 4) * 10) + 47104) + ((i % 4) * 512));
  }
}
