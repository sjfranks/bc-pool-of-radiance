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

export const $at = { soundSaved: 232638, soundAutoStop: 232639, soundExitSaved: 232641, musicTune: 232645 };

export function SoundTime() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let $r0: number = 0;
  Dos.GetTime($f0, $f0 + 2, $f0 + 4, $f0 + 6);
  $r0 = ((((r16($f0) * 360000) + (r16($f0 + 2) * 6000)) + (r16($f0 + 4) * 100)) + r16($f0 + 6)) | 0;
  S.sp = $sp;
  return $r0;
}

export function SoundDelay(centiseconds: number) {
  let target: number = 0, now: number = 0, passes: number = 0, ticks: number = 0, elapsed: number = 0, last: number = 0, sample: number = 0;
  if (SoundTimerHooked()) {
    ticks = Math.trunc(((centiseconds * 11931) + 2520) / 5041);
    elapsed = 0;
    last = SoundTimerTicks() & 65535;
    while (elapsed < ticks) {
      sample = SoundTimerTicks() & 65535;
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

export function SoundCommand(cmd: number) {
  if (U8[229119] === 2) {
    return;
  }
  SetSoundDevice(U8[227026]);
  if (cmd !== 1) {
    w16(232645, 0);
  }
  if (r16(232639) > 0) {
    InstallSoundTimer();
  }
  switch (cmd) {
    case 0: {
      SilenceAll();
      SetSoundOutputEnabled(0);
      break;
    }
    case 1: {
      SetSoundOutputEnabled(1);
      break;
    }
    case 255: {
      SilenceAll();
      break;
    }
    default: {
      rt.FT[r32(227027)](cmd - 1);
    }
  }
  if ((r16(232639) > 0) && !MusicPlaying()) {
    SoundDelay(10);
    SilenceAll();
    UninstallSoundTimer();
  }
}

export function SoundEffect(cmd: number, group: number) {
  if ((U8[227068] & group) !== 0) {
    SoundCommand(cmd);
  }
}

export function SoundSuspend() {
  U8[232638] = U8[229119];
  if (U8[229119] === 2) {
    return;
  }
  w16(232645, 0);
  SetSoundDevice(U8[227026]);
  InstallSoundTimer();
  SilenceAll();
  UninstallSoundTimer();
}

export function PlayMusic(tune: number) {
  if ((U8[229119] === 2) || !TuneAllowed(tune)) {
    return;
  }
  SetSoundDevice(U8[227026]);
  InstallSoundTimer();
  w16(232645, tune);
  rt.FT[r32(227027)](tune);
}

export function StopMusic() {
  if (r16(232645) === 0) {
    return;
  }
  w16(232645, 0);
  if (U8[229119] === 2) {
    return;
  }
  rt.FT[r32(227027)](0);
  if (r16(232639) > 0) {
    UninstallSoundTimer();
  }
}

export function MusicPlaying() {
  let $r0: boolean = false;
  $r0 = ((r16(232645) !== 0) && SoundTimerHooked()) && (SoundVoiceTune(0) === r16(232645));
  return $r0;
}

export function SoundTimerHooked() {
  let $r0: boolean = false;
  $r0 = SndSeq.SoundTimerHooked();
  return $r0;
}

export function ApplyMusicSettings() {
  if ((r16(232645) !== 0) && !TuneAllowed(r16(232645))) {
    StopMusic();
  }
}

export function SoundSetAutoStop(autoStop: number) {
  if (U8[229119] === 2) {
    return;
  }
  if (autoStop > 0) {
    if ((r16(232639) === 0) && !MusicPlaying()) {
      UninstallSoundTimer();
    }
  } else {
    InstallSoundTimer();
  }
  w16(232639, autoStop);
}

export function ProgramSpeakerVoices(tuneId: number) {
  SndSeq.ProgramSpeakerVoices(tuneId);
}

export function ProgramTandyVoices(tuneId: number) {
  SndSeq.ProgramTandyVoices(tuneId);
}

export function OplWrite(reg: number, value: number) {
  SndSeq.OplWrite(reg, value);
}

export function OplReset() {
  SndSeq.OplReset();
}

export function SetSoundDevice(mode: number) {
  SndSeq.SetSoundDevice(mode);
}

export function InstallSoundTimer() {
  SndSeq.InstallSoundTimer();
}

export function UninstallSoundTimer() {
  SndSeq.UninstallSoundTimer();
}

export function SetSoundOutputEnabled(enabledValue: number) {
  SndSeq.SetSoundOutputEnabled(enabledValue);
}

export function SoundTimerTicks() {
  let $r0: number = 0;
  $r0 = SndSeq.SoundTimerTicks() & 65535;
  return $r0;
}

export function SoundVoiceTune(voice: number) {
  let $r0: number = 0;
  $r0 = SndSeq.SoundVoiceTune(voice) & 65535;
  return $r0;
}

export function SilenceAll() {
  ProgramTandyVoices(0);
  ProgramSpeakerVoices(0);
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
  $r0 = (U8[227066] !== 0) && ((TuneGroup(tune) === 0) || ((U8[227067] & TuneGroup(tune)) !== 0));
  return $r0;
}

export function SoundExit() {
  w32(65544, r32(232641));
  UninstallSoundTimer();
}

export function $init() {
  w32(232641, r32(65544));
  w32(65544, 2);
  U8[232638] = 0;
  w16(232639, 0);
}
