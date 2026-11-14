// Generated from src/gameio.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_KEYS from './c_keys';
import * as C_SOUND from './c_sound';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as Dos from './dos';
import * as SoundDrv from './sounddrv';
import * as Types from './types';
import * as Host from './host';
import * as NatFile from './natfile';


export const $at = { saveSettings: 224321, showMemory: 224325, beforeExit: 224329, debugFile: 224333, memShown: 224341, scanPending: 224342 };

export async function ReadGameKey() {
  let key: number = 0, $r0: number = 0;
  async function DropTypeAhead() {
    let k: number = 0;
    while ((await Crt.KeyPressed())) {
      k = (await Crt.ReadKey()) & 255;
      if (k === 0) {
        if ((await Crt.KeyPressed())) {
          k = (await Crt.ReadKey()) & 255;
        }
      } else {
        key = k;
      }
    }
  }
  if ((U8[141212] !== 0)) {
    U8[141213] = true ? 1 : 0;
    key = 27;
    (await DropTypeAhead());
    U8[224342] = false ? 1 : 0;
    $r0 = 27;
    return $r0;
  }
  key = (await Crt.ReadKey()) & 255;
  if ((U8[224342] !== 0)) {
    U8[224342] = false ? 1 : 0;
    (await DropTypeAhead());
    $r0 = key;
    return $r0;
  }
  U8[224342] = (key === 0) && (await Crt.KeyPressed()) ? 1 : 0;
  if (key === 19) {
    (await SetSound(U8[143233] === 2));
    if (r32(224321) !== 0) {
      (await rt.FT[r32(224321)]());
    }
  }
  if ((U8[141208] !== 0)) {
    if (key === 4) {
      U8[141207] = (U8[141207] === 0 ? 1 : 0);
    }
    if (key === 3) {
      (await ExitGame());
    }
    if (key === 12) {
      U8[141214] = !(U8[141214] !== 0) ? 1 : 0;
      if ((U8[141214] !== 0)) {
        rt.Assign(224333, "debug.txt");
        rt.RewriteT(224333);
        if (rt.IOResult() !== 0) {
          U8[141214] = false ? 1 : 0;
        }
      } else {
        rt.Close(224333);
      }
    }
    if ((key === 26) && (U8[141214] !== 0)) {
      DumpEffects();
    }
    if (((key === 25) && !(U8[224341] !== 0)) && (r32(224325) !== 0)) {
      U8[224341] = true ? 1 : 0;
      (await rt.FT[r32(224325)]());
      U8[224341] = false ? 1 : 0;
    }
  }
  if (key !== 0) {
    (await DropTypeAhead());
  }
  $r0 = key;
  return $r0;
}

export async function DemoEnding() {
  let $r0: boolean = false;
  if (((U8[141212] !== 0) && !(U8[141213] !== 0)) && (await Crt.KeyPressed())) {
    U8[141213] = true ? 1 : 0;
  }
  $r0 = (U8[141212] !== 0) && (U8[141213] !== 0);
  return $r0;
}

export async function ReadAnyKey() {
  let key: number = 0, scan: number = 0, $r0: number = 0;
  key = (await ReadGameKey()) & 255;
  if ((key === 0) && (U8[224342] !== 0)) {
    scan = (await Crt.ReadKey()) & 255;
    U8[224342] = false ? 1 : 0;
  }
  $r0 = key;
  return $r0;
}

export async function SetSound(turnOn: boolean) {
  if (U8[141140] === 2) {
    return;
  }
  if (!turnOn) {
    if (U8[143233] !== 2) {
      (await SoundDrv.SoundCommand(r16(132885)));
      U8[143233] = 2;
    }
  } else if (U8[143233] === 2) {
    U8[143233] = U8[146752];
    (await SoundDrv.SoundSuspend());
  }
  U8[141183] = (turnOn ? 1 : 0);
}

export async function DiscardPendingKeys() {
  let key: number = 0;
  if ((await Crt.KeyPressed())) {
    key = (await ReadAnyKey()) & 255;
  }
}

export async function ExitGame() {
  let hook: number = 0;
  hook = r32(224329);
  w32(224329, 0);
  if (hook !== 0) {
    (await rt.FT[hook]());
  }
  if ((U8[141214] !== 0)) {
    rt.Close(224333);
  }
  U8[143233] = U8[146752];
  (await SoundDrv.SoundCommand(r16(132885)));
  SetStartMode();
  rt.Halt(0);
}

export async function FatalError(msg: string) {
  let key: number = 0;
  SetStartMode();
  rt.WriteT(0, msg + "\n");
  key = (await ReadAnyKey()) & 255;
  (await ExitGame());
}

export function SetStartMode() {
  U8[141227] = 0;
  U8[141226] = U8[141247];
  Host.Intr(16, 141226);
}

export function DumpEffects() {
  let p: number = 0, e: number = 0;
  p = r32(143753);
  while (p !== 0) {
    e = r32(p + 127);
    while (e !== 0) {
      rt.WriteT(224333, "who: " + rS(p) + "  sp#: " + rt.fmtI(U8[e], 0) + "\n");
      e = r32(e + 5);
    }
    p = r32(p + 260);
  }
}

export function $init() {
  U8[224341] = false ? 1 : 0;
  U8[224342] = false ? 1 : 0;
  w32(224321, 0);
  w32(224325, 0);
  w32(224329, 0);
}
