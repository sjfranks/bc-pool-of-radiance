// Generated from src/native/snddig.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_SOUND from './c_sound';
import * as GameVars from './gamevars';
import * as SfxFile from './sfxfile';
import * as SoundDrv from './sounddrv';
import * as SndChip from './sndchip';


export const $at = { ADPCM_DELTA: 234749, ADPCM_STEP: 234813, loadTried: 234877, effects: 234878 };

export function Install() {
  wS(227005, 20, "Digital Audio");
  U8[227026] = 0;
  w32(227027, 18);
  U8[227031] = true ? 1 : 0;
}

export function DecodeAdpcm(src: number, start: number, len: number, dst: number) {
  let level: number = 0, step: number = 0, i: number = 0, n: number = 0, half: number = 0, code: number = 0, k: number = 0;
  level = U8[src + start];
  step = 0;
  U8[dst] = level;
  n = 1;
  for (let $i1 = 1, $e1 = len - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    for (let $i2 = 0; $i2 <= 1; $i2++) {
      half = $i2;
      if (half === 0) {
        code = U8[src + (start + i)] >>> 4;
      } else {
        code = U8[src + (start + i)] & 15;
      }
      k = (code + step) & 255;
      if (k > 63) {
        k = 63;
      }
      level = (level + I8[k + 234749]) << 16 >> 16;
      if (level > 255) {
        level = 255;
      } else if (level < 0) {
        level = 0;
      }
      step = ((step + U8[k + 234813]) & 255) & 255;
      U8[dst + n] = level;
      n = (n + 1) & 65535;
    }
  }
}

export function LoadEffects() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 14);
  let i: number = 0, fx: number = 0;
  U8[234877] = true ? 1 : 0;
  rt.fill(234878, 160, 0);
  if (!SfxFile.Load($f0, $f0 + 4, $f0 + 6)) {
    { S.sp = $sp; return; }
  }
  for (let $i1 = 1, $e1 = U8[$f0 + 6]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (SfxFile.GetEntry(r32($f0), r16($f0 + 4), i - 1, $f0 + 7)) {
      fx = U8[$f0 + 7] * 8 + 234870;
      if (r32(fx) !== 0) {
        rt.freeMem(r32(fx));
      }
      w16(fx + 6, Math.trunc(1000000 / (256 - U8[$f0 + 9])));
      w16(fx + 4, SfxFile.DecodedLength($f0 + 7));
      w32(fx, rt.getMem(r16(fx + 4)));
      if (U8[$f0 + 8] === 1) {
        DecodeAdpcm(r32($f0), r16($f0 + 12), r16($f0 + 10), r32(fx));
      } else {
        mv(r32(fx), r32($f0) + r16($f0 + 12), r16($f0 + 10));
      }
    }
  }
  rt.freeMem(r32($f0));
  S.sp = $sp;
}

export function Play(tune: number) {
  if ((tune >= 1) && (tune <= 20)) {
    if (!(U8[234877] !== 0)) {
      LoadEffects();
    }
    if (r32(tune * 8 + 234870) !== 0) {
      SoundDrv.ProgramTandyVoices(0);
      SndChip.PlaySample(r32(tune * 8 + 234870), r16(tune * 8 + 234874), r16(tune * 8 + 234876));
      return;
    }
  }
  if (tune === 0) {
    SndChip.PlaySample(0, 0, 0);
  }
  SoundDrv.ProgramTandyVoices(tune);
}

export function $init() {
  U8[234877] = false ? 1 : 0;
}
