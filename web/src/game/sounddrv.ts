// Generated from src/sounddrv.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_SOUND from './c_sound';
import * as Dos from './dos';
import * as GameVars from './gamevars';
import * as SndSeq from './sndseq';

export const CMD_DISABLE = 0;
export const CMD_ENABLE = 1;
export const CMD_STOP = 255;
export const SILENT_TUNE = 0;
export const OUTPUT_DISABLED = 0;
export const OUTPUT_ENABLED = 1;
export const MAX_CLOCK_PASSES = 60000;

export const $at = { soundSaved: 146752, soundAutoStop: 146753, soundExitSaved: 224315, musicTune: 224319 };

export function SoundTime() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let $r0: number = 0;
  Dos.GetTime($f0, $f0 + 2, $f0 + 4, $f0 + 6);
  $r0 = ((((r16($f0) * 360000) + (r16($f0 + 2) * 6000)) + (r16($f0 + 4) * 100)) + r16($f0 + 6)) | 0;
  S.sp = $sp;
  return $r0;
}

export async function SoundDelay(centiseconds: number) {
  let target: number = 0, now: number = 0, passes: number = 0, ticks: number = 0, elapsed: number = 0, last: number = 0, sample: number = 0;
  if (SoundTimerHooked()) {
    ticks = Math.trunc(((centiseconds * 11931) + 2520) / 5041);
    elapsed = 0;
    last = (await SoundTimerTicks()) & 65535;
    while (elapsed < ticks) {
      sample = (await SoundTimerTicks()) & 65535;
      elapsed = (elapsed + ((sample - last) & 65535)) | 0;
      last = sample;
    }
    return;
  }
  target = (SoundTime() + centiseconds) | 0;
  passes = 0;
  do {
    now = SoundTime() | 0;
    if ((target - now) > centiseconds) {
      now = (target + 1) | 0;
    }
    passes = (passes + 1) & 65535;
    if (passes === 60000) {
      now = target;
    }
  } while (!(now >= target));
}

export async function SoundCommand(cmd: number) {
  if (U8[143233] === 2) {
    return;
  }
  (await SetSoundDevice(U8[141140]));
  if (cmd !== 1) {
    w16(224319, 0);
  }
  if (r16(146753) > 0) {
    (await InstallSoundTimer());
  }
  switch (cmd) {
    case 0: {
      (await SilenceAll());
      (await SetSoundOutputEnabled(0));
      break;
    }
    case 1: {
      (await SetSoundOutputEnabled(1));
      break;
    }
    case 255: {
      (await SilenceAll());
      break;
    }
    default: {
      (await rt.FT[r32(141141)](cmd - 1));
    }
  }
  if ((r16(146753) > 0) && !(await MusicPlaying())) {
    (await SoundDelay(10));
    (await SilenceAll());
    (await UninstallSoundTimer());
  }
}

export async function SoundEffect(cmd: number, group: number) {
  if ((U8[141182] & group) !== 0) {
    (await SoundCommand(cmd));
  }
}

export async function SoundSuspend() {
  U8[146752] = U8[143233];
  if (U8[143233] === 2) {
    return;
  }
  w16(224319, 0);
  (await SetSoundDevice(U8[141140]));
  (await InstallSoundTimer());
  (await SilenceAll());
  (await UninstallSoundTimer());
}

export async function PlayMusic(tune: number) {
  if ((U8[143233] === 2) || !TuneAllowed(tune)) {
    return;
  }
  (await SetSoundDevice(U8[141140]));
  (await InstallSoundTimer());
  w16(224319, tune);
  (await rt.FT[r32(141141)](tune));
}

export async function StopMusic() {
  if (r16(224319) === 0) {
    return;
  }
  w16(224319, 0);
  if (U8[143233] === 2) {
    return;
  }
  (await rt.FT[r32(141141)](0));
  if (r16(146753) > 0) {
    (await UninstallSoundTimer());
  }
}

export async function MusicPlaying() {
  let $r0: boolean = false;
  $r0 = ((r16(224319) !== 0) && SoundTimerHooked()) && ((await SoundVoiceTune(0)) === r16(224319));
  return $r0;
}

export function SoundTimerHooked() {
  let $r0: boolean = false;
  $r0 = SndSeq.SoundTimerHooked();
  return $r0;
}

export async function ApplyMusicSettings() {
  if ((r16(224319) !== 0) && !TuneAllowed(r16(224319))) {
    (await StopMusic());
  }
}

export async function SoundSetAutoStop(autoStop: number) {
  if (U8[143233] === 2) {
    return;
  }
  if (autoStop > 0) {
    if ((r16(146753) === 0) && !(await MusicPlaying())) {
      (await UninstallSoundTimer());
    }
  } else {
    (await InstallSoundTimer());
  }
  w16(146753, autoStop);
}

export async function ProgramSpeakerVoices(tuneId: number) {
  (await SndSeq.ProgramSpeakerVoices(tuneId));
}

export async function ProgramTandyVoices(tuneId: number) {
  (await SndSeq.ProgramTandyVoices(tuneId));
}

export function OplWrite(reg: number, value: number) {
  SndSeq.OplWrite(reg, value);
}

export function OplReset() {
  SndSeq.OplReset();
}

export async function SetSoundDevice(mode: number) {
  (await SndSeq.SetSoundDevice(mode));
}

export async function InstallSoundTimer() {
  (await SndSeq.InstallSoundTimer());
}

export async function UninstallSoundTimer() {
  (await SndSeq.UninstallSoundTimer());
}

export async function SetSoundOutputEnabled(enabledValue: number) {
  (await SndSeq.SetSoundOutputEnabled(enabledValue));
}

export async function SoundTimerTicks() {
  let $r0: number = 0;
  $r0 = (await SndSeq.SoundTimerTicks()) & 65535;
  return $r0;
}

export async function SoundVoiceTune(voice: number) {
  let $r0: number = 0;
  $r0 = (await SndSeq.SoundVoiceTune(voice)) & 65535;
  return $r0;
}

export async function SilenceAll() {
  (await ProgramTandyVoices(0));
  (await ProgramSpeakerVoices(0));
}

export function TuneGroup(tune: number) {
  let $r0: number = 0;
  switch (tune) {
    case 21: {
      $r0 = 1;
      break;
    }
    case 22: {
      $r0 = 2;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function TuneAllowed(tune: number) {
  let $r0: boolean = false;
  $r0 = (U8[141180] !== 0) && ((TuneGroup(tune) === 0) || ((U8[141181] & TuneGroup(tune)) !== 0));
  return $r0;
}

export async function SoundExit() {
  w32(65544, r32(224315));
  (await UninstallSoundTimer());
}

export function $init() {
  w32(224315, r32(65544));
  w32(65544, 1);
  U8[146752] = 0;
  w16(146753, 0);
}
