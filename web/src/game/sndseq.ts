// Generated from src/native/sndseq.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as SysUtils from './sysutils';
import * as C_SOUND from './c_sound';
import * as $hooks from '../host/hooks';

export const SND_ORG = 256;
export const SND_IMAGE_BYTES = 11958;
export const VOICE_SIZE = 48;
export const VF_DURATION = 0;
export const VF_STREAM = 2;
export const VF_PERIOD = 4;
export const VF_PERIOD_ADD = 6;
export const VF_OUT_PERIOD = 8;
export const VF_LEVEL = 10;
export const VF_LEVEL_ADD = 12;
export const VF_TEMPO = 14;
export const VF_RELEASE_LEAD = 16;
export const VF_TRANSPOSE = 18;
export const VF_GATE_LEN = 20;
export const VF_ENV_BASE = 22;
export const VF_ENV_POS = 24;
export const VF_ENV_WAIT = 26;
export const VF_LFO_TABLE = 28;
export const VF_LFO_PHASE = 30;
export const VF_LFO_RATE = 32;
export const VF_LFO_DEPTH = 34;
export const VF_LFO_WRAP = 36;
export const VF_LOOP_COUNTER_A = 38;
export const VF_LOOP_COUNTER_B = 40;
export const SPKR_BLOCKS = 1056;
export const SPKR_FREQ = 1440;
export const SONG_TABLE_A = 1466;
export const SONG_ROWS_A = 29;
export const TANDY_BLOCKS = 6716;
export const TANDY_FREQ = 7100;
export const SONG_TABLE_B = 7124;
export const SONG_ROWS_B = 29;
export const REST = 127;
export const OCT = 12;
export const ENV_SETLEVEL = 65535;
export const DEV_TANDY = 0;
export const DEV_SPEAKER = 1;
export const DEV_NONE = 2;
export const DEV_ADLIB = 3;
export const VOICES = 4;
export const FIELD_DURATION = 0;
export const ENV_RELEASE = 16;
export const CMD_FIRST = 250;
export const CMD_RESET = 250;
export const CMD_RET = 251;
export const CMD_CALL = 252;
export const CMD_CLEAR = 253;
export const CMD_LOOP = 254;
export const CMD_SET = 255;
export const LAST_FLAG = 128;
export const PITCH_MASK = 127;

export const $at = { PortWrite: 65792, Lock: 65796, Unlock: 65800, Rendered: 65804, SND_IMAGE: 65805, TANDY_SILENCE: 77763, mem: 77767, voiceLeft: 143303, curTune: 143304, seqVoice: 143306, voiceBase: 143308, freqBase: 143310, seqRet: 143312, voiceTune: 143314, outputOn: 143318, device: 143319, spkrVoice: 143320, hooked: 143322, drvTicks: 143323, seqBusy: 143325, gate: 143326, traceBuf: 143327, traceCap: 143331, traceLen: 143333, tracing: 143335, clockStart: 143336, clockRun: 143344 };

export function InstallSoundTimer() {
  EnterSeq();
  if (!(U8[143322] !== 0)) {
    U8[143322] = true ? 1 : 0;
    rt.w64(143336, SysUtils.GetTickCount64());
    rt.w64(143344, 0);
  }
  LeaveSeq();
}

export function UninstallSoundTimer() {
  let i: number = 0, saved: boolean = false;
  EnterSeq();
  if ((U8[143322] !== 0)) {
    U8[143322] = false ? 1 : 0;
    saved = (U8[143335] !== 0);
    U8[143335] = false ? 1 : 0;
    PortOut(97, U8[143326] & 252);
    if (U8[143319] === 0) {
      for (let $i1 = 0; $i1 <= 3; $i1++) {
        i = $i1;
        PortOut(192, U8[i + 77763]);
      }
    }
    U8[143335] = saved ? 1 : 0;
  }
  LeaveSeq();
}

export function ProgramSpeakerVoices(tuneId: number) {
  ProgramVoices(tuneId, 1466, 29, 1056);
}

export function ProgramTandyVoices(tuneId: number) {
  ProgramVoices(tuneId, 7124, 29, 6716);
}

export function OplWrite(reg: number, value: number) {
}

export function OplReset() {
}

export function SetSoundOutputEnabled(enabledValue: number) {
  EnterSeq();
  U8[143318] = enabledValue & 255;
  LeaveSeq();
}

function SoundTimerTicks$impl() {
  let $r0: number = 0;
  CatchUp();
  $r0 = r16(143323);
  return $r0;
}
export function SoundTimerTicks(...a) {
  $hooks.tap("SndSeq.SoundTimerTicks", a);
  return SoundTimerTicks$impl(...a);
}

export function SoundTimerHooked() {
  let $r0: boolean = false;
  $r0 = (U8[143322] !== 0);
  return $r0;
}

export function SetSoundDevice(mode: number) {
  let dev: number = 0;
  EnterSeq();
  dev = mode & 255;
  if (dev > 3) {
    dev = 2;
  }
  if ((dev !== U8[143319]) && (U8[143319] === 1)) {
    PortOut(97, GateIn() & 252);
  }
  U8[143319] = dev;
  LeaveSeq();
}

export function SoundVoiceTune(voice: number) {
  let $r0: number = 0;
  CatchUp();
  $r0 = U8[(voice & 3) + 143314];
  return $r0;
}

export function Tick() {
  if (!(U8[143322] !== 0)) {
    return;
  }
  w16(143323, (r16(143323) + 1) & 65535);
  DeviceTick();
}

export function SetTraceBuffer(buf: number, capacity: number) {
  w32(143327, buf);
  w16(143331, capacity);
  w16(143333, 0);
  U8[143335] = true ? 1 : 0;
}

export function TraceCount() {
  let $r0: number = 0;
  $r0 = r16(143333);
  return $r0;
}

export function TraceTick() {
  DeviceTick();
}

export function W(a: number) {
  let $r0: number = 0;
  $r0 = (U8[a + 77767] | (U8[((a + 1) & 65535) + 77767] << 8)) & 65535;
  return $r0;
}

export function SetW(a: number, v: number) {
  U8[a + 77767] = v & 255;
  U8[((a + 1) & 65535) + 77767] = v >> 8 & 255;
}

export function EnterSeq() {
  if (r32(65796) !== 0) {
    rt.FT[r32(65796)]();
  }
}

export function LeaveSeq() {
  if (r32(65800) !== 0) {
    rt.FT[r32(65800)]();
  }
}

export function PortOut(port: number, value: number) {
  if ((U8[143335] !== 0)) {
    if (r16(143333) < r16(143331)) {
      w16(r32(143327) + r16(143333) * 2, (port << 8) | value);
      w16(143333, r16(143333) + 1);
    }
  } else {
    if (port === 97) {
      U8[143326] = value;
    }
    if (r32(65792) !== 0) {
      rt.FT[r32(65792)](port, value);
    }
  }
}

export function GateIn() {
  let $r0: number = 0;
  if ((U8[143335] !== 0)) {
    $r0 = 0;
  } else {
    $r0 = U8[143326];
  }
  return $r0;
}

export function SeqEnd(si: number, di: number) {
  w16(si, r16(143306));
  if (W(r16(si) + 0) === 0) {
    U8[((4 - U8[143303]) & 3) + 143314] = 0;
    di = 0;
  }
  SetW(r16(si) + 2, di);
}

export function SeqProc(si: number) {
  let di: number = 0, bl: number = 0, bx: number = 0, ax: number = 0, cx: number = 0, cl: number = 0, target: number = 0, borrow: boolean = false;
  di = W(r16(si) + 2) & 65535;
  if (di === 0) {
    return;
  }
  w16(143306, r16(si));
  while (true) {
    bl = U8[di + 77767];
    di = (di + 1) & 65535;
    if (bl < 250) {
      while (true) {
        target = ((((bl >>> 5) * 48) + r16(143308)) & 65535) & 65535;
        bx = di;
        ax = W(r16(si) + 14) & 65535;
        if ((ax & 255) > 1) {
          ax = (ax & 255) * U8[((bx + 1) & 65535) + 77767];
        } else {
          ax = U8[((bx + 1) & 65535) + 77767];
        }
        SetW(r16(si) + 0, ax);
        ax = U8[bx + 77767] & 127;
        if (ax !== 127) {
          cx = W(r16(si) + 0) & 65535;
          SetW(target + 0, cx);
          if (cx >= W(target + 16)) {
            cx = ((cx - W(target + 16)) & 65535) & 65535;
          } else {
            cx = 0;
          }
          SetW(target + 20, cx);
          ax = ((ax + W(target + 18)) & 65535) & 65535;
          SetW(target + 24, 0);
          SetW(target + 26, 1);
          cl = 255;
          do {
            cl = ((cl + 1) & 255) & 255;
            borrow = ax < 12;
            ax = ((ax - 12) & 65535) & 65535;
          } while (!(borrow));
          ax = ((ax + 12) & 65535) & 65535;
          ax = W((r16(143310) + ((ax + ax) & 65535)) & 65535) & 65535;
          if ((cl & 31) >= 16) {
            ax = 0;
          } else {
            ax = ax >>> (cl & 31);
          }
          SetW(target + 4, ax);
          SetW(target + 8, ax);
        }
        di = bx;
        bl = U8[di + 77767];
        di = ((di + 2) & 65535) & 65535;
        if ((bl & 128) !== 0) {
          SeqEnd(si, di);
          return;
        }
        bl = U8[di + 77767];
        di = (di + 1) & 65535;
      }
    }
    switch (bl) {
      case 254: {
        bx = U8[di + 77767];
        di = (di + 1) & 65535;
        ax = W(di) & 65535;
        di = ((di + 2) & 65535) & 65535;
        if (W((bx + r16(si)) & 65535) === 0) {
          di = ax;
        } else {
          SetW((bx + r16(si)) & 65535, (W((bx + r16(si)) & 65535) - 1) & 65535);
          if (W((bx + r16(si)) & 65535) !== 0) {
            di = ax;
          }
        }
        break;
      }
      case 253: case 250: {
        if (bl === 253) {
          w16(si, (W(di) + r16(143308)) & 65535);
          di = ((di + 2) & 65535) & 65535;
        }
        SetW(r16(si) + 4, 0);
        SetW(r16(si) + 6, 0);
        SetW(r16(si) + 8, 0);
        SetW(r16(si) + 10, 0);
        SetW(r16(si) + 12, 0);
        SetW(r16(si) + 16, 0);
        SetW(r16(si) + 18, 0);
        SetW(r16(si) + 22, 0);
        SetW(r16(si) + 24, 0);
        SetW(r16(si) + 26, 0);
        SetW(r16(si) + 28, 0);
        SetW(r16(si) + 30, 0);
        SetW(r16(si) + 32, 0);
        SetW(r16(si) + 34, 0);
        SetW(r16(si) + 36, 0);
        break;
      }
      case 255: {
        bx = U8[di + 77767];
        di = (di + 1) & 65535;
        ax = W(di) & 65535;
        di = ((di + 2) & 65535) & 65535;
        SetW((bx + r16(si)) & 65535, ax);
        if (bx === 0) {
          SeqEnd(si, di);
          return;
        }
        break;
      }
      case 251: {
        di = r16(143312);
        w16(143312, 0);
        if (di === 0) {
          w16(si, r16(143306));
          SetW(r16(si) + 0, 0);
          SeqEnd(si, di);
          return;
        }
        break;
      }
      case 252: {
        ax = W(di) & 65535;
        di = ((di + 2) & 65535) & 65535;
        w16(143312, di);
        di = ax;
        break;
      }
    }
  }
}

export function VoiceStep(si: number) {
  let ax: number = 0, dx: number = 0, bx: number = 0, product: number = 0;
  SetW(r16(si) + 10, (W(r16(si) + 10) + W(r16(si) + 12)) & 65535);
  SetW(r16(si) + 4, (W(r16(si) + 4) + W(r16(si) + 6)) & 65535);
  dx = 0;
  ax = ((W(r16(si) + 30) + W(r16(si) + 32)) & 65535) & 65535;
  if (ax !== 0) {
    if (ax >= W(r16(si) + 36)) {
      ax = ((ax - W(r16(si) + 36)) & 65535) & 65535;
    }
    SetW(r16(si) + 30, ax);
    ax = ((((((ax << 16 >> 16) << 16 >> 16) >> 4) & 65535) + W(r16(si) + 28)) & 65535) & 65535;
    product = rt.mul(((U8[ax + 77767] << 8) << 16 >> 16) | 0, W(r16(si) + 34) << 16 >> 16) | 0;
    dx = (((product >>> 0) >>> 16) & 65535) & 65535;
  }
  SetW(r16(si) + 8, (dx + W(r16(si) + 4)) & 65535);
  if (W(r16(si) + 20) !== 0) {
    SetW(r16(si) + 20, (W(r16(si) + 20) - 1) & 65535);
    if (W(r16(si) + 20) === 0) {
      SetW(r16(si) + 24, 16);
      SetW(r16(si) + 26, 1);
    }
  }
  SetW(r16(si) + 0, (W(r16(si) + 0) - 1) & 65535);
  if (W(r16(si) + 0) === 0) {
    SeqProc(si);
  }
  if (W(r16(si) + 26) !== 0) {
    SetW(r16(si) + 26, (W(r16(si) + 26) - 1) & 65535);
    if (W(r16(si) + 26) === 0) {
      while (true) {
        bx = ((W(r16(si) + 22) + W(r16(si) + 24)) & 65535) & 65535;
        if (W((bx + 2) & 65535) !== 65535) {
          break;
        }
        ax = W(bx) & 65535;
        SetW(r16(si) + 10, ax);
        if (ax === 0) {
          SetW(r16(si) + 12, 0);
        }
        SetW(r16(si) + 24, (W(r16(si) + 24) + 4) & 65535);
      }
      SetW(r16(si) + 12, W(bx));
      SetW(r16(si) + 26, W((bx + 2) & 65535));
      SetW(r16(si) + 24, (W(r16(si) + 24) + 4) & 65535);
    }
  }
}

export function TickSpeaker() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let bl: number = 0, ax: number = 0;
  bl = 0;
  if (r16(143304) !== 0) {
    w16(143320, 0);
    U8[143303] = 4;
    w16(143310, 1440);
    w16($f0, 1056);
    w16(143308, r16($f0));
    do {
      if (W(r16($f0) + 0) !== 0) {
        VoiceStep($f0);
        if (((r16(143320) === 0) && (W(r16($f0) + 10) !== 0)) && (W(r16($f0) + 0) !== 0)) {
          w16(143320, r16($f0));
        }
      }
      w16($f0, (r16($f0) + 48) & 65535);
      U8[143303] = U8[143303] - 1;
    } while (!(U8[143303] === 0));
    if ((U8[143318] !== 0) && (r16(143320) !== 0)) {
      w16($f0, r16(143320));
      ax = W(r16($f0) + 8) & 65535;
      PortOut(66, ax & 255);
      PortOut(66, ax >> 8 & 255);
      bl = W(r16($f0) + 10) & 3;
    }
  }
  PortOut(97, (GateIn() & 252) | bl);
  S.sp = $sp;
}

export function TickTandy() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let ax: number = 0, al: number = 0, dl: number = 0, i: number = 0;
  if (r16(143304) !== 0) {
    U8[143303] = 4;
    w16(143310, 7100);
    w16($f0, 6716);
    w16(143308, r16($f0));
    do {
      if (W(r16($f0) + 0) !== 0) {
        VoiceStep($f0);
      }
      w16($f0, (r16($f0) + 48) & 65535);
      U8[143303] = U8[143303] - 1;
    } while (!(U8[143303] === 0));
    if (U8[143318] !== 0) {
      U8[143303] = 4;
      w16($f0, 6716);
      dl = 128;
      do {
        ax = (W(r16($f0) + 8) >>> 2) & 65535;
        al = (ax & 255) >>> 4;
        PortOut(192, al ^ dl);
        if (dl !== 224) {
          PortOut(192, ax >> 8 & 255);
        }
        ax = ((65535 - W(r16($f0) + 10)) & 65535) & 65535;
        PortOut(192, ((((ax >> 8 & 255) >>> 4) ^ dl) + 16) & 255);
        dl = ((dl + 32) & 255) & 255;
        w16($f0, (r16($f0) + 48) & 65535);
        U8[143303] = U8[143303] - 1;
      } while (!(U8[143303] === 0));
      { S.sp = $sp; return; }
    }
  }
  for (let $i3 = 0; $i3 <= 3; $i3++) {
    i = $i3;
    PortOut(192, U8[i + 77763]);
  }
  S.sp = $sp;
}

export function DeviceTick() {
  if ((U8[143325] !== 0)) {
    return;
  }
  U8[143325] = true ? 1 : 0;
  switch (U8[143319]) {
    case 0: {
      TickTandy();
      break;
    }
    case 1: {
      TickSpeaker();
      break;
    }
  }
  U8[143325] = false ? 1 : 0;
}

export function CatchUp() {
  let due: number = 0;
  if ((U8[65804] !== 0) || !(U8[143322] !== 0)) {
    return;
  }
  due = Math.trunc(Math.trunc(rt.mul(SysUtils.GetTickCount64() - rt.r64(143336), 1193182) / 5041000));
  while (rt.r64(143344) < due) {
    rt.w64(143344, rt.r64(143344) + 1);
    Tick();
  }
}

export function ProgramVoices(tuneId: number, table: number, rows: number, blocks: number) {
  let v: number = 0, stream: number = 0, di: number = 0;
  EnterSeq();
  if (tuneId >= rows) {
    tuneId = 0;
  }
  w16(143304, tuneId);
  di = blocks;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    v = $i1;
    stream = W(((table + (tuneId * 8)) + (v * 2)) & 65535) & 65535;
    if (stream !== 0) {
      rt.fill(di + 77767, 48, 0);
      SetW(di + 2, stream);
      U8[v + 143314] = r16(143304) & 255;
      SetW(di + 0, 1);
    }
    di = ((di + 48) & 65535) & 65535;
  }
  LeaveSeq();
}

export function $init() {
  rt.fill(77767, 65536, 0);
  mv(78023, 65805, 11958);
  U8[143318] = 1;
  U8[143319] = 2;
}
