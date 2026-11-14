// Generated from src/piccga.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_VIDEO from './c_video';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as VidOps from './vidops';
import * as TpRand from './tprand';


export const $at = { cgaPixPos: 257237 };

export function ExpandChunk(chunk: number, mask: number, pic: number, at: number) {
  let k: number = 0, m: number = 0, half: number = 0, color: number = 0;
  {
    const $w1 = pic;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      k = $i2;
      color = Blit.SrcNibble(VidOps.ChunkPixel(chunk, k), $w1 + 9) & 255;
      U8[$w1 + (at + (k >>> 2)) + 27] = U8[$w1 + (at + (k >>> 2)) + 27] | U8[color * 4 + (k & 3) + 257237];
    }
    if (r32($w1 + 19) !== 0) {
      for (let $i3 = 0; $i3 <= 1; $i3++) {
        half = $i3;
        m = 0;
        for (let $i4 = 0; $i4 <= 3; $i4++) {
          k = $i4;
          if ((mask & (128 >>> ((half * 4) + k))) !== 0) {
            m = (m | r16((k + 4) * 2 + 218711)) & 255;
          }
        }
        U8[r32($w1 + 19) + (at + half)] = U8[r32($w1 + 19) + (at + half)] | m;
        U8[$w1 + (at + half) + 27] = U8[$w1 + (at + half) + 27] & (~U8[r32($w1 + 19) + (at + half)] & 255);
      }
    }
  }
}

export function MirrorFrame(src: number, dst: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let dstOff: number = 0, srcOff: number = 0, rowStart: number = 0, rowBytes: number = 0, col: number = 0, row: number = 0;
  {
    const $w1 = src;
    rowBytes = (r16($w1 + 2) * 2) & 65535;
    srcOff = (rowBytes - 2) & 65535;
    dstOff = 0;
    for (let $i2 = 1, $e2 = r16($w1); $i2 <= $e2; $i2++) {
      row = $i2;
      rowStart = dstOff;
      for (let $i3 = 0, $e3 = r16($w1 + 2) - 1; $i3 <= $e3; $i3++) {
        col = $i3;
        mv($f0, $w1 + ((srcOff - dstOff) + rowStart) + 27, 2);
        w16($f0, VidOps.MirrorPairs(r16($f0)));
        mv(dst + dstOff + 27, $f0, 2);
        if (r32($w1 + 19) !== 0) {
          mv($f0, r32($w1 + 19) + ((srcOff - dstOff) + rowStart), 2);
          w16($f0, VidOps.MirrorPairs(r16($f0)));
          mv(r32(dst + 19) + dstOff, $f0, 2);
        }
        dstOff = (dstOff + 2) & 65535;
      }
      srcOff = (srcOff + rowBytes) & 65535;
    }
  }
  S.sp = $sp;
}

export function RemapColour(pic: number, scratch: number, srcOff: number, nFrames: number, fromC: number, toC: number, isDithered: boolean) {
  let frameNo: number = 0, col: number = 0, row: number = 0, pixPos: number = 0, rowBytes: number = 0, dstOff: number = 0;
  dstOff = 0;
  {
    const $w1 = scratch;
    rowBytes = (r16($w1 + 2) * 2) & 65535;
    for (let $i2 = 1, $e2 = nFrames; $i2 <= $e2; $i2++) {
      frameNo = $i2;
      for (let $i3 = 1, $e3 = r16($w1); $i3 <= $e3; $i3++) {
        row = $i3;
        for (let $i4 = 1, $e4 = rowBytes; $i4 <= $e4; $i4++) {
          col = $i4;
          for (let $i5 = 0; $i5 <= 3; $i5++) {
            pixPos = $i5;
            if ((U8[pic + srcOff + 27] & r16((pixPos + 4) * 2 + 218711)) === U8[Blit.SrcNibble(fromC, $w1 + 9) * 4 + pixPos + 257237]) {
              if (!isDithered || (TpRand.Random(4) === 0)) {
                U8[$w1 + dstOff + 27] = (U8[$w1 + dstOff + 27] & (~r16((pixPos + 4) * 2 + 218711) & 65535)) | U8[Blit.SrcNibble(toC, $w1 + 9) * 4 + pixPos + 257237];
              }
            }
          }
          srcOff = (srcOff + 1) & 65535;
          dstOff = (dstOff + 1) & 65535;
        }
      }
    }
  }
}

export async function RecolorFrame(toT: number, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  let k: number = 0;
  for (let $i1 = 0; $i1 <= 15; $i1++) {
    k = $i1;
    U8[$f0 + k] = k;
  }
  (await Blit.RemapPic($f0, toT, 0, false, pic));
  S.sp = $sp;
}

export function PutPixelRow(pic: number, at: number, y: number, px: number) {
  let i: number = 0, k: number = 0, b: number = 0;
  for (let $i1 = 0; $i1 <= 1; $i1++) {
    i = $i1;
    b = 0;
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      k = $i2;
      b = (b | ((U8[(U8[px + ((i * 4) + k)] & 15) + 218695] & 3) << (6 - (2 * k)))) & 255;
    }
    U8[pic + ((at + (y * 2)) + i) + 27] = b;
  }
}

export function InitRowTables() {
  let i: number = 0;
  for (let $i1 = 0; $i1 <= 199; $i1++) {
    i = $i1;
    if ((i & 1) !== 0) {
      w16(i * 2 + 228319, (Math.trunc(i / 2) * 5) + 47616);
    } else {
      w16(i * 2 + 228319, (Math.trunc(i / 2) * 5) + 47104);
    }
  }
}
