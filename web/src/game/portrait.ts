// Generated from src/portrait.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as VidOps from './vidops';
import * as GameIo from './gameio';
import * as Border from './border';
import * as DaxIo from './daxio';
import * as StrUtil from './strutil';

export const BODY_ROW_OFFSET = 5;

export const $at = { picArcName: 227117, picArcId: 227127 };

export async function DisplayImageBuf(col: number, row: number, anim: boolean, pic: number) {
  if (pic !== 0) {
    if (anim) {
      Blit.BlitTileClipped(col - 1, row - 1, 0, 1, pic, r32(141249));
      (await Blit.FlushView());
    } else {
      (await Blit.ShowPic(col, row, pic));
    }
  }
}

export async function LoadAnimation(name_: string, picId: number, transp: number, a: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 20);
  let offset: number = 0, f: number = 0, xorBuf: number = 0, j: number = 0, planeSz: number = 0, isPic: boolean = false, gotXor: boolean = false, xorSz: number = 0, xorLast: number = 0, loaded: number = 0, stop: boolean = false, fr: number = 0;
  function FrameNeed() {
    let frameSz: number = 0, need: number = 0, $r1: number = 0;
    frameSz = Blit.FrameBytes(r16($f0 + 6), r16($f0 + 8)) | 0;
    need = ((27 + frameSz) + 8) | 0;
    if ((transp & 1) > 0) {
      need = (need + (Blit.MaskBytes(frameSz) + 8)) | 0;
      if (Blit.ColourCount() === 16) {
        need = (need + ((27 + frameSz) + 8)) | 0;
      }
    }
    if (isPic && (f === 1)) {
      need = (need + (((r16($f0 + 6) * r16($f0 + 8)) * 4) + 8)) | 0;
    }
    $r1 = need;
    return $r1;
  }
  wS($f0 + 10, 9, name_ + StrUtil.NumStr(U8[143234]));
  if (((U8[a] > 0) && (rS($f0 + 10) === rS(227117))) && (picId === U8[227127])) {
    { S.sp = $sp; return; }
  }
  FreeAnimation(a);
  isPic = (name_ === "PIC") || (name_ === "FINAL");
  (await DaxIo.LoadDax(rS($f0 + 10), ".dax", picId, $f0, $f0 + 2));
  if (r16($f0) === 0) {
    { S.sp = $sp; return; }
  }
  offset = 0;
  gotXor = false;
  {
    const $w1 = a;
    U8[$w1] = I8[r32($f0 + 2) + offset];
    if ((name_ === "PIC") && (picId === 1)) {
      if (U8[$w1] > 4) {
        U8[$w1] = 4;
      }
    }
    if (U8[$w1] > 8) {
      U8[$w1] = 8;
    }
    offset = (offset + 1) & 65535;
    U8[$w1 + 1] = 1;
    loaded = 0;
    stop = false;
    f = 1;
    while ((f <= U8[$w1]) && !stop) {
      if ((((offset + 4) + 2) + 2) > r16($f0)) {
        stop = true;
      } else {
        mv($w1 + (loaded + 1) * 8 - 6, r32($f0 + 2) + offset, 4);
        offset = (offset + 4) & 65535;
        mv($f0 + 6, r32($f0 + 2) + offset, 2);
        offset = (offset + 2) & 65535;
        mv($f0 + 8, r32($f0 + 2) + offset, 2);
        offset = (offset + 2) & 65535;
        if (((r16($f0 + 6) === 0) || (r16($f0 + 8) === 0)) || ((((((offset + 2) + 2) + 1) + 8) + ((r16($f0 + 6) * r16($f0 + 8)) * 4)) > r16($f0))) {
          stop = true;
        }
      }
      if (stop) {
      } else if ((16777216 >= 3900) && (16777216 >= FrameNeed())) {
        loaded = (loaded + 1) & 255;
        (await Blit.AllocPic(r16($f0 + 6), r16($f0 + 8), 1, transp, $w1 + loaded * 8 - 2));
        {
          const $w3 = r32($w1 + loaded * 8 - 2);
          mv($w3 + 4, r32($f0 + 2) + offset, 2);
          offset = (offset + 2) & 65535;
          mv($w3 + 6, r32($f0 + 2) + offset, 2);
          offset = (offset + 3) & 65535;
          mv($w3 + 9, r32($f0 + 2) + offset, 8);
          offset = (offset + 8) & 65535;
        }
        planeSz = (((r16(r32($w1 + loaded * 8 - 2)) * r16(r32($w1 + loaded * 8 - 2) + 2)) * 4) - 1) & 65535;
        if (isPic) {
          if (f === 1) {
            xorSz = (planeSz + 1) & 65535;
            xorBuf = rt.getMem(xorSz);
            mv(xorBuf, r32($f0 + 2) + offset, xorSz);
            gotXor = true;
          } else {
            xorLast = planeSz;
            if (xorLast > (xorSz - 1)) {
              xorLast = (xorSz - 1) & 65535;
            }
            for (let $i4 = offset, $e4 = offset + xorLast; $i4 <= $e4; $i4++) {
              j = $i4;
              U8[r32($f0 + 2) + j] = I8[r32($f0 + 2) + j] ^ I8[xorBuf + (j - offset)];
            }
          }
        }
        (await VidOps.ExpandPicFrames(r32($f0 + 2), offset, 0, r32($w1 + loaded * 8 - 2)));
        if (((transp & 1) > 0) && (Blit.ColourCount() === 16)) {
          (await Blit.RemapPic(132853, 132869, 0, false, r32($w1 + loaded * 8 - 2)));
        }
        offset = (offset + (planeSz + 1)) & 65535;
      } else if (f === 1) {
        stop = true;
      } else {
        offset = (offset + (13 + ((r16($f0 + 6) * r16($f0 + 8)) * 4))) & 65535;
      }
      f = (f + 1) & 255;
    }
    U8[$w1] = loaded;
  }
  if (loaded > 0) {
    wS(227117, 9, rS($f0 + 10));
    U8[227127] = picId;
  }
  if (isPic && gotXor) {
    rt.freeMem(xorBuf);
  }
  rt.freeMem(r32($f0 + 2));
  S.sp = $sp;
}

export function FreeAnimation(a: number) {
  let k: number = 0;
  {
    const $w1 = a;
    for (let $i2 = 1, $e2 = U8[$w1]; $i2 <= $e2; $i2++) {
      k = $i2;
      Blit.FreePic($w1 + k * 8 - 2);
    }
  }
  rt.fill(a, 66, 0);
  U8[227117] = 0;
  U8[227127] = 255;
}

export async function DisplayCharPortrait() {
  {
    const $w1 = r32(143749);
    if ((((U8[$w1 + 187] === 0) || (U8[$w1 + 188] === 0)) || (U8[$w1 + 187] > 41)) || (U8[$w1 + 188] > 21)) {
      return;
    }
  }
  (await Border.DrawWindow(28, 1, 38, 11, 0, 0, ""));
  {
    const $w2 = r32(143749);
    (await LoadPortraitBufs(U8[U8[$w2 + 187] + 133146], U8[U8[$w2 + 188] + 133187]));
    (await DisplayPortraitBufs(28, 1, true));
  }
}

export async function PlayerPortraitsHere() {
  let $r0: boolean = false;
  $r0 = (U8[143234] === 3) || (await MergedPortraits());
  return $r0;
}

export async function PlayerPortraitCount(body: boolean) {
  let $r0: number = 0;
  if ((await MergedPortraits())) {
    if (body) {
      $r0 = 21;
    } else {
      $r0 = 41;
    }
  } else if (body) {
    $r0 = 16;
  } else {
    $r0 = 21;
  }
  return $r0;
}

export async function DisplayPortraitBufs(col: number, row: number, both: boolean) {
  (await DisplayImageBuf(col, row, false, r32(145630)));
  if (both) {
    (await DisplayImageBuf(col, row + 5, false, r32(145636)));
  }
}

export async function LoadPortraitBufs(headId: number, bodyId: number) {
  async function LoadSlot(slot: number, archive: string, id: number) {
    if (id === 255) {
      return;
    }
    {
      const $w1 = slot * 6 + 145623;
      if ((U8[$w1] !== id) || (U8[$w1 + 5] !== U8[143234])) {
        (await Blit.LoadPic(archive + StrUtil.NumStr(U8[143234]), id, false, 0, $w1 + 1));
        if (r32($w1 + 1) !== 0) {
          U8[$w1] = id;
          U8[$w1 + 5] = U8[143234];
        } else {
          U8[$w1] = 255;
        }
      }
    }
  }
  (await LoadSlot(1, "HEAD", headId));
  (await LoadSlot(2, "BODY", bodyId));
}

export async function Show3DSprite(dist: number, a: number) {
  if ((dist < 1) || (dist > 3)) {
    (await GameIo.FatalError("Illegal range in Show3DSprite."));
  }
  if (r32(a + dist * 8 - 2) !== 0) {
    {
      const $w1 = r32(a + dist * 8 - 2);
      Blit.BlitTileClipped((r16($w1 + 4) + 3) - 1, (r16($w1 + 6) + 3) - 1, 0, 1, r32(a + dist * 8 - 2), r32(141249));
    }
    (await Blit.FlushView());
  }
}

export function ResetGame() {
  U8[227117] = 0;
  U8[227127] = 255;
}

export async function MergedPortraits() {
  let $r0: boolean = false;
  $r0 = ((await DaxIo.ArchiveName("HEAD" + StrUtil.NumStr(U8[143234]))) === "HEAD") && ((await DaxIo.ArchiveName("BODY" + StrUtil.NumStr(U8[143234]))) === "BODY");
  return $r0;
}
