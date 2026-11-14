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


export const $at = { saveSettings: 232647, showMemory: 232651, beforeExit: 232655, debugFile: 232659, memShown: 232667, scanPending: 232668 };

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
  if ((U8[227098] !== 0)) {
    U8[227099] = true ? 1 : 0;
    key = 27;
    (await DropTypeAhead());
    U8[232668] = false ? 1 : 0;
    $r0 = 27;
    return $r0;
  }
  key = (await Crt.ReadKey()) & 255;
  if ((U8[232668] !== 0)) {
    U8[232668] = false ? 1 : 0;
    (await DropTypeAhead());
    $r0 = key;
    return $r0;
  }
  U8[232668] = (key === 0) && (await Crt.KeyPressed()) ? 1 : 0;
  if (key === 19) {
    SetSound(U8[229119] === 2);
    if (r32(232647) !== 0) {
      (await rt.FT[r32(232647)]());
    }
  }
  if ((U8[227094] !== 0)) {
    if (key === 4) {
      U8[227093] = (U8[227093] === 0 ? 1 : 0);
    }
    if (key === 3) {
      (await ExitGame());
    }
    if (key === 12) {
      U8[227100] = !(U8[227100] !== 0) ? 1 : 0;
      if ((U8[227100] !== 0)) {
        rt.Assign(232659, "debug.txt");
        rt.RewriteT(232659);
        if (rt.IOResult() !== 0) {
          U8[227100] = false ? 1 : 0;
        }
      } else {
        rt.Close(232659);
      }
    }
    if ((key === 26) && (U8[227100] !== 0)) {
      DumpEffects();
    }
    if (((key === 25) && !(U8[232667] !== 0)) && (r32(232651) !== 0)) {
      U8[232667] = true ? 1 : 0;
      (await rt.FT[r32(232651)]());
      U8[232667] = false ? 1 : 0;
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
  if (((U8[227098] !== 0) && !(U8[227099] !== 0)) && (await Crt.KeyPressed())) {
    U8[227099] = true ? 1 : 0;
  }
  $r0 = (U8[227098] !== 0) && (U8[227099] !== 0);
  return $r0;
}

export async function ReadAnyKey() {
  let key: number = 0, scan: number = 0, $r0: number = 0;
  key = (await ReadGameKey()) & 255;
  if ((key === 0) && (U8[232668] !== 0)) {
    scan = (await Crt.ReadKey()) & 255;
    U8[232668] = false ? 1 : 0;
  }
  $r0 = key;
  return $r0;
}

export function SetSound(turnOn: boolean) {
  if (U8[227026] === 2) {
    return;
  }
  if (!turnOn) {
    if (U8[229119] !== 2) {
      SoundDrv.SoundCommand(r16(218771));
      U8[229119] = 2;
    }
  } else if (U8[229119] === 2) {
    U8[229119] = U8[232638];
    SoundDrv.SoundSuspend();
  }
  U8[227069] = (turnOn ? 1 : 0);
}

export async function DiscardPendingKeys() {
  let key: number = 0;
  if ((await Crt.KeyPressed())) {
    key = (await ReadAnyKey()) & 255;
  }
}

export async function ExitGame() {
  let hook: number = 0;
  hook = r32(232655);
  w32(232655, 0);
  if (hook !== 0) {
    (await rt.FT[hook]());
  }
  if ((U8[227100] !== 0)) {
    rt.Close(232659);
  }
  U8[229119] = U8[232638];
  SoundDrv.SoundCommand(r16(218771));
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
  U8[227113] = 0;
  U8[227112] = U8[227133];
  Host.Intr(16, 227112);
}

export function DumpEffects() {
  let p: number = 0, e: number = 0;
  p = r32(229639);
  while (p !== 0) {
    e = r32(p + 127);
    while (e !== 0) {
      rt.WriteT(232659, "who: " + rS(p) + "  sp#: " + rt.fmtI(U8[e], 0) + "\n");
      e = r32(e + 5);
    }
    p = r32(p + 260);
  }
}

export function $init() {
  U8[232667] = false ? 1 : 0;
  U8[232668] = false ? 1 : 0;
  w32(232647, 0);
  w32(232651, 0);
  w32(232655, 0);
}
