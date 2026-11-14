// Generated from src/native/sndseq.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as SysUtils from './sysutils';
import * as C_SOUND from './c_sound';

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

export const $at = { PortWrite: 146755, Lock: 146759, Unlock: 146763, Rendered: 146767, SND_IMAGE: 146768, TANDY_SILENCE: 158726, mem: 158730, voiceLeft: 224266, curTune: 224267, seqVoice: 224269, voiceBase: 224271, freqBase: 224273, seqRet: 224275, voiceTune: 224277, outputOn: 224281, device: 224282, spkrVoice: 224283, hooked: 224285, drvTicks: 224286, seqBusy: 224288, gate: 224289, traceBuf: 224290, traceCap: 224294, traceLen: 224296, tracing: 224298, clockStart: 224299, clockRun: 224307 };

export async function InstallSoundTimer() {
  (await EnterSeq());
  if (!(U8[224285] !== 0)) {
    U8[224285] = true ? 1 : 0;
    rt.w64(224299, SysUtils.GetTickCount64());
    rt.w64(224307, 0);
  }
  (await LeaveSeq());
}

export async function UninstallSoundTimer() {
  let i: number = 0, saved: boolean = false;
  (await EnterSeq());
  if ((U8[224285] !== 0)) {
    U8[224285] = false ? 1 : 0;
    saved = (U8[224298] !== 0);
    U8[224298] = false ? 1 : 0;
    (await PortOut(97, U8[224289] & 252));
    if (U8[224282] === 0) {
      for (let $i1 = 0; $i1 <= 3; $i1++) {
        i = $i1;
        (await PortOut(192, U8[i + 158726]));
      }
    }
    U8[224298] = saved ? 1 : 0;
  }
  (await LeaveSeq());
}

export async function ProgramSpeakerVoices(tuneId: number) {
  (await ProgramVoices(tuneId, 1466, 29, 1056));
}

export async function ProgramTandyVoices(tuneId: number) {
  (await ProgramVoices(tuneId, 7124, 29, 6716));
}

export function OplWrite(reg: number, value: number) {
}

export function OplReset() {
}

export async function SetSoundOutputEnabled(enabledValue: number) {
  (await EnterSeq());
  U8[224281] = enabledValue & 255;
  (await LeaveSeq());
}

export async function SoundTimerTicks() {
  let $r0: number = 0;
  (await CatchUp());
  $r0 = r16(224286);
  return $r0;
}

export function SoundTimerHooked() {
  let $r0: boolean = false;
  $r0 = (U8[224285] !== 0);
  return $r0;
}

export async function SetSoundDevice(mode: number) {
  let dev: number = 0;
  (await EnterSeq());
  dev = mode & 255;
  if (dev > 3) {
    dev = 2;
  }
  if ((dev !== U8[224282]) && (U8[224282] === 1)) {
    (await PortOut(97, GateIn() & 252));
  }
  U8[224282] = dev;
  (await LeaveSeq());
}

export async function SoundVoiceTune(voice: number) {
  let $r0: number = 0;
  (await CatchUp());
  $r0 = U8[(voice & 3) + 224277];
  return $r0;
}

export async function Tick() {
  if (!(U8[224285] !== 0)) {
    return;
  }
  w16(224286, (r16(224286) + 1) & 65535);
  (await DeviceTick());
}

export function SetTraceBuffer(buf: number, capacity: number) {
  w32(224290, buf);
  w16(224294, capacity);
  w16(224296, 0);
  U8[224298] = true ? 1 : 0;
}

export function TraceCount() {
  let $r0: number = 0;
  $r0 = r16(224296);
  return $r0;
}

export async function TraceTick() {
  (await DeviceTick());
}

export function W(a: number) {
  let $r0: number = 0;
  $r0 = (U8[a + 158730] | (U8[((a + 1) & 65535) + 158730] << 8)) & 65535;
  return $r0;
}

export function SetW(a: number, v: number) {
  U8[a + 158730] = v & 255;
  U8[((a + 1) & 65535) + 158730] = v >> 8 & 255;
}

export async function EnterSeq() {
  if (r32(146759) !== 0) {
    (await rt.FT[r32(146759)]());
  }
}

export async function LeaveSeq() {
  if (r32(146763) !== 0) {
    (await rt.FT[r32(146763)]());
  }
}

export async function PortOut(port: number, value: number) {
  if ((U8[224298] !== 0)) {
    if (r16(224296) < r16(224294)) {
      w16(r32(224290) + r16(224296) * 2, (port << 8) | value);
      w16(224296, r16(224296) + 1);
    }
  } else {
    if (port === 97) {
      U8[224289] = value;
    }
    if (r32(146755) !== 0) {
      (await rt.FT[r32(146755)](port, value));
    }
  }
}

export function GateIn() {
  let $r0: number = 0;
  if ((U8[224298] !== 0)) {
    $r0 = 0;
  } else {
    $r0 = U8[224289];
  }
  return $r0;
}

export function SeqEnd(si: number, di: number) {
  w16(si, r16(224269));
  if (W(r16(si) + 0) === 0) {
    U8[((4 - U8[224266]) & 3) + 224277] = 0;
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
  w16(224269, r16(si));
  while (true) {
    bl = U8[di + 158730];
    di = (di + 1) & 65535;
    if (bl < 250) {
      while (true) {
        target = ((((bl >>> 5) * 48) + r16(224271)) & 65535) & 65535;
        bx = di;
        ax = W(r16(si) + 14) & 65535;
        if ((ax & 255) > 1) {
          ax = (ax & 255) * U8[((bx + 1) & 65535) + 158730];
        } else {
          ax = U8[((bx + 1) & 65535) + 158730];
        }
        SetW(r16(si) + 0, ax);
        ax = U8[bx + 158730] & 127;
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
          ax = W((r16(224273) + ((ax + ax) & 65535)) & 65535) & 65535;
          if ((cl & 31) >= 16) {
            ax = 0;
          } else {
            ax = ax >>> (cl & 31);
          }
          SetW(target + 4, ax);
          SetW(target + 8, ax);
        }
        di = bx;
        bl = U8[di + 158730];
        di = ((di + 2) & 65535) & 65535;
        if ((bl & 128) !== 0) {
          SeqEnd(si, di);
          return;
        }
        bl = U8[di + 158730];
        di = (di + 1) & 65535;
      }
    }
    switch (bl) {
      case 254: {
        bx = U8[di + 158730];
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
          w16(si, (W(di) + r16(224271)) & 65535);
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
        bx = U8[di + 158730];
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
        di = r16(224275);
        w16(224275, 0);
        if (di === 0) {
          w16(si, r16(224269));
          SetW(r16(si) + 0, 0);
          SeqEnd(si, di);
          return;
        }
        break;
      }
      case 252: {
        ax = W(di) & 65535;
        di = ((di + 2) & 65535) & 65535;
        w16(224275, di);
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
    product = rt.mul(((U8[ax + 158730] << 8) << 16 >> 16) | 0, W(r16(si) + 34) << 16 >> 16) | 0;
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

export async function TickSpeaker() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let bl: number = 0, ax: number = 0;
  bl = 0;
  if (r16(224267) !== 0) {
    w16(224283, 0);
    U8[224266] = 4;
    w16(224273, 1440);
    w16($f0, 1056);
    w16(224271, r16($f0));
    do {
      if (W(r16($f0) + 0) !== 0) {
        VoiceStep($f0);
        if (((r16(224283) === 0) && (W(r16($f0) + 10) !== 0)) && (W(r16($f0) + 0) !== 0)) {
          w16(224283, r16($f0));
        }
      }
      w16($f0, (r16($f0) + 48) & 65535);
      U8[224266] = U8[224266] - 1;
    } while (!(U8[224266] === 0));
    if ((U8[224281] !== 0) && (r16(224283) !== 0)) {
      w16($f0, r16(224283));
      ax = W(r16($f0) + 8) & 65535;
      (await PortOut(66, ax & 255));
      (await PortOut(66, ax >> 8 & 255));
      bl = W(r16($f0) + 10) & 3;
    }
  }
  (await PortOut(97, (GateIn() & 252) | bl));
  S.sp = $sp;
}

export async function TickTandy() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let ax: number = 0, al: number = 0, dl: number = 0, i: number = 0;
  if (r16(224267) !== 0) {
    U8[224266] = 4;
    w16(224273, 7100);
    w16($f0, 6716);
    w16(224271, r16($f0));
    do {
      if (W(r16($f0) + 0) !== 0) {
        VoiceStep($f0);
      }
      w16($f0, (r16($f0) + 48) & 65535);
      U8[224266] = U8[224266] - 1;
    } while (!(U8[224266] === 0));
    if (U8[224281] !== 0) {
      U8[224266] = 4;
      w16($f0, 6716);
      dl = 128;
      do {
        ax = (W(r16($f0) + 8) >>> 2) & 65535;
        al = (ax & 255) >>> 4;
        (await PortOut(192, al ^ dl));
        if (dl !== 224) {
          (await PortOut(192, ax >> 8 & 255));
        }
        ax = ((65535 - W(r16($f0) + 10)) & 65535) & 65535;
        (await PortOut(192, ((((ax >> 8 & 255) >>> 4) ^ dl) + 16) & 255));
        dl = ((dl + 32) & 255) & 255;
        w16($f0, (r16($f0) + 48) & 65535);
        U8[224266] = U8[224266] - 1;
      } while (!(U8[224266] === 0));
      { S.sp = $sp; return; }
    }
  }
  for (let $i3 = 0; $i3 <= 3; $i3++) {
    i = $i3;
    (await PortOut(192, U8[i + 158726]));
  }
  S.sp = $sp;
}

export async function DeviceTick() {
  if ((U8[224288] !== 0)) {
    return;
  }
  U8[224288] = true ? 1 : 0;
  switch (U8[224282]) {
    case 0: {
      (await TickTandy());
      break;
    }
    case 1: {
      (await TickSpeaker());
      break;
    }
  }
  U8[224288] = false ? 1 : 0;
}

export async function CatchUp() {
  let due: number = 0;
  if ((U8[146767] !== 0) || !(U8[224285] !== 0)) {
    return;
  }
  due = Math.trunc(Math.trunc(rt.mul(SysUtils.GetTickCount64() - rt.r64(224299), 1193182) / 5041000));
  while (rt.r64(224307) < due) {
    rt.w64(224307, rt.r64(224307) + 1);
    (await Tick());
  }
}

export async function ProgramVoices(tuneId: number, table: number, rows: number, blocks: number) {
  let v: number = 0, stream: number = 0, di: number = 0;
  (await EnterSeq());
  if (tuneId >= rows) {
    tuneId = 0;
  }
  w16(224267, tuneId);
  di = blocks;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    v = $i1;
    stream = W(((table + (tuneId * 8)) + (v * 2)) & 65535) & 65535;
    if (stream !== 0) {
      rt.fill(di + 158730, 48, 0);
      SetW(di + 2, stream);
      U8[v + 224277] = r16(224267) & 255;
      SetW(di + 0, 1);
    }
    di = ((di + 48) & 65535) & 65535;
  }
  (await LeaveSeq());
}

export function $init() {
  rt.fill(158730, 65536, 0);
  mv(158986, 146768, 11958);
  U8[224281] = 1;
  U8[224282] = 2;
}
