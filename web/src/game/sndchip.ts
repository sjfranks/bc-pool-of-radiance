// Generated from src/native/sndchip.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_SOUND from './c_sound';
import * as SndSeq from './sndseq';

export const RATE = 48000;
export const TANDY_HZ = 3579545;
export const TANDY_DIVIDER = 16;
export const SPEAKER_PEAK = 5000;
export const TANDY_PEAK = 4500;
export const SAMPLE_PEAK = 28000;
export const NOISE_SEED = 16384;

export const $at = { TANDY_LEVELS: 143352, tickAcc: 143416, spkDivisor: 143420, spkGates: 143424, spkCount: 143425, spkHigh: 143429, spkLowByte: 143430, spkSecond: 143431, spkAcc: 143432, tdyTone: 143436, tdyNoise: 143442, tdyAtt: 143443, tdyLatch: 143447, tdyCount: 143448, tdyOut: 143456, tdyShift: 143460, tdyAcc: 143462, smpData: 143466, smpLen: 143470, smpRate: 143474, smpPos: 143478 };

export function Write(port: number, value: number) {
  switch (port) {
    case 66: {
      if (!(U8[143431] !== 0)) {
        U8[143430] = value;
        U8[143431] = true ? 1 : 0;
      } else {
        w32(143420, U8[143430] | (value << 8));
        if (r32(143420) === 0) {
          w32(143420, 65536);
        }
        U8[143431] = false ? 1 : 0;
      }
      break;
    }
    case 97: {
      U8[143424] = value & 3;
      break;
    }
    case 192: {
      WriteTandy(value);
      break;
    }
  }
}

export function PlaySample(data: number, len: number, rate: number) {
  let locked: boolean = false;
  locked = r32(65796) !== 0;
  if (locked) {
    rt.FT[r32(65796)]();
  }
  w32(143466, data);
  w32(143470, len);
  w32(143474, rate);
  rt.w64(143478, 0);
  if (locked) {
    rt.FT[r32(65800)]();
  }
}

export function Render(buf: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w32($f0, buf);
  let i: number = 0, s: number = 0;
  for (let $i1 = 0, $e1 = count - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    w32(143416, ri32(143416) + 1193182);
    if (ri32(143416) >= 241968000) {
      w32(143416, ri32(143416) - 241968000);
      SndSeq.Tick();
    }
    s = ((SpeakerSample() + TandySample()) + SampleSample()) | 0;
    if (s > 32767) {
      s = 32767;
    } else if (s < (-32768)) {
      s = -32768;
    }
    w16(r32($f0) + i * 2, s);
  }
  S.sp = $sp;
}

export function WriteTandy(value: number) {
  let reg: number = 0, voice: number = 0;
  if ((value & 128) !== 0) {
    U8[143447] = (value >>> 4) & 7;
    reg = U8[143447];
    voice = reg >>> 1;
    if ((reg & 1) !== 0) {
      U8[voice + 143443] = value & 15;
    } else if (voice < 3) {
      w16(voice * 2 + 143436, (r16(voice * 2 + 143436) & 1008) | (value & 15));
    } else {
      U8[143442] = value & 7;
      w16(143460, 16384);
    }
  } else {
    reg = U8[143447];
    voice = reg >>> 1;
    if ((reg & 1) !== 0) {
      U8[voice + 143443] = value & 15;
    } else if (voice < 3) {
      w16(voice * 2 + 143436, (r16(voice * 2 + 143436) & 15) | ((value & 63) << 4));
    } else {
      U8[143442] = value & 7;
      w16(143460, 16384);
    }
  }
}

export function SpeakerSample() {
  let clocks: number = 0, high: number = 0, n: number = 0, half: number = 0, $r0: number = 0;
  w32(143432, ri32(143432) + 1193182);
  clocks = Math.trunc(ri32(143432) / 48000);
  w32(143432, ri32(143432) % 48000);
  if (U8[143424] !== 3) {
    $r0 = 0;
    return $r0;
  }
  half = Math.trunc(r32(143420) / 2);
  if (half === 0) {
    half = 1;
  }
  high = 0;
  for (let $i1 = 1, $e1 = clocks; $i1 <= $e1; $i1++) {
    n = $i1;
    if (r32(143425) <= 1) {
      w32(143425, half);
      U8[143429] = !(U8[143429] !== 0) ? 1 : 0;
    } else {
      w32(143425, r32(143425) - 1);
    }
    if ((U8[143429] !== 0)) {
      high = (high + 1) | 0;
    }
  }
  if (clocks === 0) {
    $r0 = 0;
  } else {
    $r0 = Math.trunc((((2 * high) - clocks) * 5000) / clocks) | 0;
  }
  return $r0;
}

export function TandySample() {
  let steps: number = 0, n: number = 0, v: number = 0, sum: number = 0, period: number = 0, feedback: number = 0, $r0: number = 0;
  w32(143462, ri32(143462) + 3579545);
  steps = Math.trunc(ri32(143462) / 768000);
  w32(143462, ri32(143462) % 768000);
  sum = 0;
  for (let $i1 = 1, $e1 = steps; $i1 <= $e1; $i1++) {
    n = $i1;
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      v = $i2;
      if (v < 3) {
        period = r16(v * 2 + 143436);
      } else {
        switch (U8[143442] & 3) {
          case 0: {
            period = 16;
            break;
          }
          case 1: {
            period = 32;
            break;
          }
          case 2: {
            period = 64;
            break;
          }
          default: {
            period = r16(143440);
          }
        }
      }
      if (period === 0) {
        period = 1024;
      }
      if (r16(v * 2 + 143448) <= 1) {
        w16(v * 2 + 143448, period);
        U8[v + 143456] = !(U8[v + 143456] !== 0) ? 1 : 0;
        if ((v === 3) && (U8[v + 143456] !== 0)) {
          if ((U8[143442] & 4) !== 0) {
            feedback = (r16(143460) ^ (r16(143460) >>> 1)) & 1;
          } else {
            feedback = r16(143460) & 1;
          }
          w16(143460, (r16(143460) >>> 1) | (feedback << 14));
        }
      } else {
        let $t3;
        $t3 = v * 2 + 143448, w16($t3, r16($t3) - 1);
      }
      if (v < 3) {
        if ((U8[v + 143456] !== 0)) {
          sum = (sum + ri32(U8[v + 143443] * 4 + 143352)) | 0;
        } else {
          sum = (sum - ri32(U8[v + 143443] * 4 + 143352)) | 0;
        }
      } else if ((r16(143460) & 1) !== 0) {
        sum = (sum + ri32(U8[143446] * 4 + 143352)) | 0;
      } else {
        sum = (sum - ri32(U8[143446] * 4 + 143352)) | 0;
      }
    }
  }
  if (steps === 0) {
    $r0 = 0;
  } else {
    $r0 = Math.trunc(sum / steps) | 0;
  }
  return $r0;
}

export function SampleSample() {
  let i: number = 0, frac: number = 0, a: number = 0, b: number = 0, $r0: number = 0;
  $r0 = 0;
  if (r32(143470) === 0) {
    return $r0;
  }
  i = Math.trunc(rt.r64(143478) / 48000) >>> 0;
  if (i >= r32(143470)) {
    w32(143470, 0);
    return $r0;
  }
  frac = (rt.r64(143478) % 48000) | 0;
  a = U8[r32(143466) + i] - 128;
  if ((i + 1) < r32(143470)) {
    b = U8[r32(143466) + (i + 1)] - 128;
  } else {
    b = a;
  }
  $r0 = Math.trunc(rt.mul(Math.trunc((rt.mul(a, 48000 - frac) + rt.mul(b, frac)) / 48000), 28000) / 128) | 0;
  rt.w64(143478, rt.r64(143478) + r32(143474));
  return $r0;
}

export function $init() {
  w32(143420, 65536);
  w16(143460, 16384);
  rt.fill(143443, 4, 15);
}
