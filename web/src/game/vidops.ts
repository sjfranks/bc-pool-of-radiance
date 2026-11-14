// Generated from src/vidops.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';


export function ModeName() {
  let $r0: string = "";
  $r0 = rS(226915);
  return $r0;
}

export function InitRowTables() {
  rt.FT[r32(226997)]();
}

export function MergePic(src: number, dst: number) {
  let n: number = 0;
  if (!CanMerge(src, dst)) {
    return;
  }
  if ((U8[226938] !== 0)) {
    for (let $i1 = 0, $e1 = r16(src + 17) - 1; $i1 <= $e1; $i1++) {
      n = $i1;
      if (U8[src + n + 27] !== 255) {
        U8[dst + n + 27] = U8[src + n + 27];
      }
    }
  } else {
    for (let $i2 = 0, $e2 = r16(src + 17) - 1; $i2 <= $e2; $i2++) {
      n = $i2;
      U8[dst + n + 27] = U8[dst + n + 27] | U8[src + n + 27];
    }
  }
  for (let $i3 = 0, $e3 = Blit.MaskBytes(r16(src + 17)) - 1; $i3 <= $e3; $i3++) {
    n = $i3;
    U8[r32(dst + 19) + n] = U8[r32(dst + 19) + n] & U8[r32(src + 19) + n];
  }
}

export function CanMerge(src: number, dst: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((src === 0) || (dst === 0)) {
    return $r0;
  }
  if ((r32(src + 19) === 0) || (r32(dst + 19) === 0)) {
    return $r0;
  }
  $r0 = ((r16(src + 17) !== 0) && (r16(src + 2) === r16(dst + 2))) && (r16(src + 17) <= r16(dst + 17));
  return $r0;
}

export function OverlayPic(src: number, dst: number) {
  let n: number = 0;
  if ((src === 0) || (dst === 0)) {
    return;
  }
  if (((r32(src + 19) === 0) || (r16(src + 17) !== r16(dst + 17))) || (r16(dst + 17) === 0)) {
    return;
  }
  if ((U8[226938] !== 0)) {
    for (let $i1 = 0, $e1 = r16(dst + 17) - 1; $i1 <= $e1; $i1++) {
      n = $i1;
      if (U8[src + n + 27] !== 255) {
        U8[dst + n + 27] = U8[src + n + 27];
      }
    }
    return;
  }
  for (let $i2 = 0, $e2 = r16(dst + 17) - 1; $i2 <= $e2; $i2++) {
    n = $i2;
    U8[dst + n + 27] = (U8[dst + n + 27] & U8[r32(src + 19) + (n >>> U8[226941])]) | U8[src + n + 27];
  }
}

export function RecolorPic(toT: number, pic: number) {
  if ((pic === 0) || (r16(pic + 17) === 0)) {
    return;
  }
  rt.FT[r32(226989)](toT, pic);
}

export function PutPixelRow(pic: number, frame: number, y: number, px: number) {
  if (pic === 0) {
    return;
  }
  rt.FT[r32(226993)](pic, frame * r16(pic + 17), y, px);
}

export function ComputeMask(transpColor: number, chunk: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  mv($f0 + 0, chunk, 4);
  let mask: number = 0, transpHigh: number = 0, bit: number = 0, i: number = 0, $r0: number = 0;
  mask = 0;
  transpHigh = (transpColor << 4) & 255;
  bit = 128;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if ((U8[$f0 + i] & 240) === transpHigh) {
      mask = (mask + bit) & 255;
    }
    bit = bit >>> 1;
    if ((U8[$f0 + i] & 15) === transpColor) {
      mask = (mask + bit) & 255;
    }
    bit = bit >>> 1;
  }
  $r0 = mask;
  S.sp = $sp;
  return $r0;
}

export function ChunkPixel(chunk: number, k: number) {
  let $r0: number = 0;
  if ((k & 1) !== 0) {
    $r0 = U8[chunk + (k >>> 1)] & 15;
  } else {
    $r0 = U8[chunk + (k >>> 1)] >>> 4;
  }
  return $r0;
}

export function ExpandPicFrames(imgData: number, srcOff: number, transpColor: number, pic: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let mask: number = 0, at: number = 0, n: number = 0, chunks: number = 0;
  while (pic !== 0) {
    chunks = ((U8[pic + 8] * r16(pic + 17)) >>> U8[226939]) & 65535;
    at = 0;
    for (let $i2 = 1, $e2 = chunks; $i2 <= $e2; $i2++) {
      n = $i2;
      mv($f0, imgData + srcOff, 4);
      mask = 0;
      if (r32(pic + 19) !== 0) {
        mask = ComputeMask(transpColor, $f0) & 255;
      }
      rt.FT[r32(226977)]($f0, mask, pic, at);
      at = (at + (1 << U8[226939])) & 65535;
      srcOff = (srcOff + 4) & 65535;
    }
    pic = r32(pic + 23);
  }
  S.sp = $sp;
}

export function MirrorBits(value: number) {
  let mirrored: number = 0, $r0: number = 0;
  mirrored = (value << 7) & 255;
  mirrored = (mirrored + ((value & 2) << 5)) & 255;
  mirrored = (mirrored + ((value & 4) << 3)) & 255;
  mirrored = (mirrored + ((value & 8) << 1)) & 255;
  mirrored = (mirrored + ((value & 16) >>> 1)) & 255;
  mirrored = (mirrored + ((value & 32) >>> 3)) & 255;
  mirrored = (mirrored + ((value & 64) >>> 5)) & 255;
  mirrored = (mirrored + ((value & 128) >>> 7)) & 255;
  $r0 = mirrored;
  return $r0;
}

export function MirrorPairs(value: number) {
  let mirrored: number = 0, $r0: number = 0;
  mirrored = ((value & r16(218725)) << 14) & 65535;
  mirrored = (mirrored + ((value & r16(218723)) << 10)) & 65535;
  mirrored = (mirrored + ((value & r16(218721)) << 6)) & 65535;
  mirrored = (mirrored + ((value & r16(218719)) << 2)) & 65535;
  mirrored = (mirrored + ((value & r16(218717)) >>> 2)) & 65535;
  mirrored = (mirrored + ((value & r16(218715)) >>> 6)) & 65535;
  mirrored = (mirrored + ((value & r16(218713)) >>> 10)) & 65535;
  mirrored = (mirrored + ((value & r16(218711)) >>> 14)) & 65535;
  $r0 = mirrored;
  return $r0;
}

export function MirrorNibbles(value: number) {
  let mirrored: number = 0, $r0: number = 0;
  mirrored = (value << 4) & 255;
  mirrored = (mirrored + ((value & 240) >>> 4)) & 255;
  $r0 = mirrored;
  return $r0;
}

export function MirrorCellMask(src: number, dst: number) {
  let row: number = 0, col: number = 0, maskOff: number = 0;
  {
    const $w1 = src;
    if (r32($w1 + 19) !== 0) {
      maskOff = 0;
      for (let $i2 = 1, $e2 = r16($w1); $i2 <= $e2; $i2++) {
        row = $i2;
        for (let $i3 = 0, $e3 = r16($w1 + 2) - 1; $i3 <= $e3; $i3++) {
          col = $i3;
          U8[r32(dst + 19) + (((maskOff + r16($w1 + 2)) - col) - 1)] = MirrorBits(U8[r32($w1 + 19) + (maskOff + col)]);
        }
        maskOff = (maskOff + r16($w1 + 2)) & 65535;
      }
    }
  }
}
