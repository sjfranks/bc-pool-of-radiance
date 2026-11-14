// Generated from src/vault.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as Crt from './crt';
import * as GameVars from './gamevars';
import * as Dos from './dos';
import * as CharHlp from './charhlp';
import * as C_ITEM from './c_item';
import * as MenuCore from './menucore';
import * as TextRend from './textrend';
import * as SaveMenu from './savemenu';
import * as DiskRec from './diskrec';
import * as NatFile from './natfile';

export const MAX_ITEMS = 100;
export const SESSION_FILE = "tmpvault.dat";
export const VAULT_SIG = "VALT";
export const VAULT_VERSION = 1;
export const COPY_BUF = 512;

export const $at = { visited: 242200 };

export function ForgetSessionVault() {
  FileUtil.DeleteFile(rS(143235) + SESSION_FILE);
}

export function AddToSave(s: number, letter: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ok: boolean = false, $r0: boolean = false;
  ok = true;
  if (!FileUtil.OpenReadOnly($f0, rS(143235) + SESSION_FILE)) {
    FileUtil.AddToSet(s, SaveMenu.VaultName(letter), false);
  } else {
    ok = CopyToTemp($f0, rS(s) + SaveMenu.VaultName(letter));
    if (ok) {
      FileUtil.AddToSet(s, SaveMenu.VaultName(letter), true);
    }
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function RestoreFromSlot(letter: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ok: boolean = false;
  if (FileUtil.OpenReadOnly($f0, rS(143235) + SaveMenu.VaultName(letter))) {
    ok = CopyToTemp($f0, rS(143235) + SESSION_FILE) && FileUtil.PutInPlace(rS(143235) + SESSION_FILE);
  } else {
    ok = FileUtil.DeleteChecked(rS(143235) + SESSION_FILE);
  }
  if (!ok) {
    ForgetSessionVault();
    (await TextRend.DisplayAndPause(14, "The vault's ledger was not copied."));
  }
  S.sp = $sp;
}

export function HasRoom() {
  let $r0: boolean = false;
  $r0 = MenuCore.ListCount(r32(144890)) < 100;
  return $r0;
}

export async function DepositItem(creature: number, item: number) {
  U8[item + 63] = 0;
  CharHlp.AppendItemCopy(144890, item);
  (await CharHlp.RemoveItem(creature, item));
}

export function ReadVault() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 170);
  let n: number = 0, ioRes: number = 0;
  U8[242200] = 0;
  rt.fill(144862, 28, 0);
  if (!FileUtil.RecoverFile(rS(143235) + SESSION_FILE)) {
    { S.sp = $sp; return; }
  }
  if (!FileUtil.OpenReadOnly($f0, rS(143235) + SESSION_FILE)) {
    { S.sp = $sp; return; }
  }
  n = rt.BlockRead($f0, $f0 + 8, 35, true) & 65535;
  if ((((rt.IOResult() === 0) && (n === 35)) && (rS($f0 + 8) === VAULT_SIG)) && (U8[$f0 + 13] === 1)) {
    U8[242200] = U8[$f0 + 14];
    mv(144862, $f0 + 15, 28);
    do {
      n = rt.BlockRead($f0, $f0 + 107, 63, true) & 65535;
      if (rt.IOResult() !== 0) {
        n = 0;
      }
      if ((n === 63) && HasRoom()) {
        DiskRec.ItemFromDisk($f0 + 107, $f0 + 43);
        CharHlp.AppendItemCopy(144890, $f0 + 43);
      }
    } while (!(n !== 63));
  }
  rt.Close($f0);
  ioRes = rt.IOResult() << 16 >> 16;
  S.sp = $sp;
}

export async function WriteVault() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 171);
  let p: number = 0, $r0: boolean = false;
  (await SaveMenu.CheckSaveDir());
  rt.fill($f0 + 8, 35, 0);
  wS($f0 + 8, 4, VAULT_SIG);
  U8[$f0 + 13] = 1;
  U8[$f0 + 14] = 1;
  mv($f0 + 15, 144862, 28);
  U8[$f0 + 43] = FileUtil.RewriteTemp($f0, rS(143235) + SESSION_FILE) ? 1 : 0;
  if ((U8[$f0 + 43] !== 0)) {
    FileUtil.WriteChecked($f0, $f0 + 8, 35, $f0 + 43);
    p = r32(144890);
    while ((U8[$f0 + 43] !== 0) && (p !== 0)) {
      mv($f0 + 44, p, 64);
      w32($f0 + 86, 0);
      DiskRec.ItemToDisk($f0 + 44, $f0 + 108);
      FileUtil.WriteChecked($f0, $f0 + 108, 63, $f0 + 43);
      p = r32(p + 42);
    }
    U8[$f0 + 43] = FileUtil.CloseTemp($f0, rS(143235) + SESSION_FILE, (U8[$f0 + 43] !== 0)) && FileUtil.PutInPlace(rS(143235) + SESSION_FILE) ? 1 : 0;
  }
  if (!(U8[$f0 + 43] !== 0)) {
    (await TextRend.DisplayAndPause(14, "The vault's ledger was not written."));
  }
  $r0 = (U8[$f0 + 43] !== 0);
  S.sp = $sp;
  return $r0;
}

export function WasVisited() {
  let $r0: boolean = false;
  $r0 = U8[242200] !== 0;
  return $r0;
}

export function CopyToTemp(fIn: number, dst: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let buf: number = 0, n: number = 0, ioRes: number = 0, $r0: boolean = false;
  U8[$f0 + 8] = FileUtil.RewriteTemp($f0, dst) ? 1 : 0;
  if ((U8[$f0 + 8] !== 0)) {
    buf = rt.getMem(512);
    do {
      n = rt.BlockRead(fIn, buf, 512, true) & 65535;
      if (rt.IOResult() !== 0) {
        U8[$f0 + 8] = false ? 1 : 0;
      }
      if ((U8[$f0 + 8] !== 0) && (n > 0)) {
        FileUtil.WriteChecked($f0, buf, n, $f0 + 8);
      }
    } while (!((n === 0) || !(U8[$f0 + 8] !== 0)));
    rt.freeMem(buf);
    U8[$f0 + 8] = FileUtil.CloseTemp($f0, dst, (U8[$f0 + 8] !== 0)) ? 1 : 0;
  }
  rt.Close(fIn);
  ioRes = rt.IOResult() << 16 >> 16;
  $r0 = (U8[$f0 + 8] !== 0);
  S.sp = $sp;
  return $r0;
}
