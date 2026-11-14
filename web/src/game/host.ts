// Generated from pas/host.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as $ext from '../host/x_host';

export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 200;
export const TEXT_MODE = 3;
export const VGA_MODE = 19;

export const $at = { screen: 65793, dac: 129793, videoMode: 130561, BIOS_FONT: 130562, cursorRow: 131586, cursorCol: 131594 };

export const Service = $ext.Service;
export const WaitKey = $ext.WaitKey;
export const Idle = $ext.Idle;
export const Sleep = $ext.Sleep;
export const PushKey = $ext.PushKey;
export const KeyWaiting = $ext.KeyWaiting;
export const PopKey = $ext.PopKey;
export const BiosTicks = $ext.BiosTicks;
export function Intr(intNo: number, regs: number) {
  if (intNo !== 16) {
    return;
  }
  switch (U8[regs + 1]) {
    case 0: {
      U8[130561] = U8[regs] & 127;
      if (U8[130561] === 19) {
        rt.fill(65793, 64000, 0);
      }
      break;
    }
    case 2: {
      U8[(U8[regs + 3] & 7) + 131586] = U8[regs + 7];
      U8[(U8[regs + 3] & 7) + 131594] = U8[regs + 6];
      break;
    }
    case 9: {
      if (U8[130561] === 19) {
        WriteBiosChars(U8[(U8[regs + 3] & 7) + 131594], U8[(U8[regs + 3] & 7) + 131586], U8[regs], U8[regs + 2], r16(regs + 4));
      }
      break;
    }
    case 15: {
      U8[regs] = U8[130561];
      break;
    }
  }
}

export function WriteBiosChars(col: number, row: number, ch: number, color: number, count: number) {
  let n: number = 0, r: number = 0, k: number = 0, bits: number = 0, ofs: number = 0;
  n = 0;
  while (((n < count) && ((col + n) < 40)) && (row < 25)) {
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      r = $i2;
      if (ch < 128) {
        bits = U8[ch * 8 + r + 130562];
      } else {
        bits = 0;
      }
      ofs = (((row * 8) + r) * 320) + ((col + n) * 8);
      for (let $i3 = 0; $i3 <= 7; $i3++) {
        k = $i3;
        if ((bits & (128 >>> k)) === 0) {
          U8[(ofs + k) + 65793] = 0;
        } else if ((color & 128) !== 0) {
          U8[(ofs + k) + 65793] = U8[(ofs + k) + 65793] ^ (color & 127);
        } else {
          U8[(ofs + k) + 65793] = color;
        }
      }
    }
    n = (n + 1) & 65535;
  }
}

export function $init() {
  U8[130561] = 3;
}
