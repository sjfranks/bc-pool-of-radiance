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

export const $at = { TANDY_LEVELS: 226423, tickAcc: 226487, spkDivisor: 226491, spkGates: 226495, spkCount: 226496, spkHigh: 226500, spkLowByte: 226501, spkSecond: 226502, spkAcc: 226503, tdyTone: 226507, tdyNoise: 226513, tdyAtt: 226514, tdyLatch: 226518, tdyCount: 226519, tdyOut: 226527, tdyShift: 226531, tdyAcc: 226533, smpData: 226537, smpLen: 226541, smpRate: 226545, smpPos: 226549 };

export function Write(port: number, value: number) {
  switch (port) {
    case 66: {
      if (!(U8[226502] !== 0)) {
        U8[226501] = value;
        U8[226502] = true ? 1 : 0;
      } else {
        w32(226491, U8[226501] | (value << 8));
        if (r32(226491) === 0) {
          w32(226491, 65536);
        }
        U8[226502] = false ? 1 : 0;
      }
      break;
    }
    case 97: {
      U8[226495] = value & 3;
      break;
    }
    case 192: {
      WriteTandy(value);
      break;
    }
  }
}

export async function PlaySample(data: number, len: number, rate: number) {
  let locked: boolean = false;
  locked = r32(146759) !== 0;
  if (locked) {
    (await rt.FT[r32(146759)]());
  }
  w32(226537, data);
  w32(226541, len);
  w32(226545, rate);
  rt.w64(226549, 0);
  if (locked) {
    (await rt.FT[r32(146763)]());
  }
}

export async function Render(buf: number, count: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  w32($f0, buf);
  let i: number = 0, s: number = 0;
  for (let $i1 = 0, $e1 = count - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    w32(226487, ri32(226487) + 1193182);
    if (ri32(226487) >= 241968000) {
      w32(226487, ri32(226487) - 241968000);
      (await SndSeq.Tick());
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
    U8[226518] = (value >>> 4) & 7;
    reg = U8[226518];
    voice = reg >>> 1;
    if ((reg & 1) !== 0) {
      U8[voice + 226514] = value & 15;
    } else if (voice < 3) {
      w16(voice * 2 + 226507, (r16(voice * 2 + 226507) & 1008) | (value & 15));
    } else {
      U8[226513] = value & 7;
      w16(226531, 16384);
    }
  } else {
    reg = U8[226518];
    voice = reg >>> 1;
    if ((reg & 1) !== 0) {
      U8[voice + 226514] = value & 15;
    } else if (voice < 3) {
      w16(voice * 2 + 226507, (r16(voice * 2 + 226507) & 15) | ((value & 63) << 4));
    } else {
      U8[226513] = value & 7;
      w16(226531, 16384);
    }
  }
}

export function SpeakerSample() {
  let clocks: number = 0, high: number = 0, n: number = 0, half: number = 0, $r0: number = 0;
  w32(226503, ri32(226503) + 1193182);
  clocks = Math.trunc(ri32(226503) / 48000);
  w32(226503, ri32(226503) % 48000);
  if (U8[226495] !== 3) {
    $r0 = 0;
    return $r0;
  }
  half = Math.trunc(r32(226491) / 2);
  if (half === 0) {
    half = 1;
  }
  high = 0;
  for (let $i1 = 1, $e1 = clocks; $i1 <= $e1; $i1++) {
    n = $i1;
    if (r32(226496) <= 1) {
      w32(226496, half);
      U8[226500] = !(U8[226500] !== 0) ? 1 : 0;
    } else {
      w32(226496, r32(226496) - 1);
    }
    if ((U8[226500] !== 0)) {
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
  w32(226533, ri32(226533) + 3579545);
  steps = Math.trunc(ri32(226533) / 768000);
  w32(226533, ri32(226533) % 768000);
  sum = 0;
  for (let $i1 = 1, $e1 = steps; $i1 <= $e1; $i1++) {
    n = $i1;
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      v = $i2;
      if (v < 3) {
        period = r16(v * 2 + 226507);
      } else {
        switch (U8[226513] & 3) {
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
            period = r16(226511);
          }
        }
      }
      if (period === 0) {
        period = 1024;
      }
      if (r16(v * 2 + 226519) <= 1) {
        w16(v * 2 + 226519, period);
        U8[v + 226527] = !(U8[v + 226527] !== 0) ? 1 : 0;
        if ((v === 3) && (U8[v + 226527] !== 0)) {
          if ((U8[226513] & 4) !== 0) {
            feedback = (r16(226531) ^ (r16(226531) >>> 1)) & 1;
          } else {
            feedback = r16(226531) & 1;
          }
          w16(226531, (r16(226531) >>> 1) | (feedback << 14));
        }
      } else {
        let $t3;
        $t3 = v * 2 + 226519, w16($t3, r16($t3) - 1);
      }
      if (v < 3) {
        if ((U8[v + 226527] !== 0)) {
          sum = (sum + ri32(U8[v + 226514] * 4 + 226423)) | 0;
        } else {
          sum = (sum - ri32(U8[v + 226514] * 4 + 226423)) | 0;
        }
      } else if ((r16(226531) & 1) !== 0) {
        sum = (sum + ri32(U8[226517] * 4 + 226423)) | 0;
      } else {
        sum = (sum - ri32(U8[226517] * 4 + 226423)) | 0;
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
  if (r32(226541) === 0) {
    return $r0;
  }
  i = Math.trunc(rt.r64(226549) / 48000) >>> 0;
  if (i >= r32(226541)) {
    w32(226541, 0);
    return $r0;
  }
  frac = (rt.r64(226549) % 48000) | 0;
  a = U8[r32(226537) + i] - 128;
  if ((i + 1) < r32(226541)) {
    b = U8[r32(226537) + (i + 1)] - 128;
  } else {
    b = a;
  }
  $r0 = Math.trunc(rt.mul(Math.trunc((rt.mul(a, 48000 - frac) + rt.mul(b, frac)) / 48000), 28000) / 128) | 0;
  rt.w64(226549, rt.r64(226549) + r32(226545));
  return $r0;
}

export function $init() {
  w32(226491, 65536);
  w16(226531, 16384);
  rt.fill(226514, 4, 15);
}
