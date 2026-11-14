// Generated from src/savemenu.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as FileUtil from './fileutil';
import * as Crt from './crt';
import * as Dos from './dos';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as GameIo from './gameio';
import * as DaxIo from './daxio';
import * as MenuCore from './menucore';
import * as AreaName from './areaname';
import * as C_KEYS from './c_keys';
import * as StrUtil from './strutil';
import * as NatFile from './natfile';

export const SLOT_LETTERS = "ABCDEFGHIJZ";
export const OLD_QUICK_SLOT = 81;
export const SLOT_COUNT = 11;
export const DESC_LEN = 30;
export const AREA_LEN = 18;
export const DESC_SHOWN = 27;
export const QUIT_CHOSEN = 33;
export const QUICK_SLOT = 90;
export const INFO_SIG = "SINF";
export const INFO_VERSION = 1;
export const BOX_LEFT = 1;
export const BOX_RIGHT = 38;
export const TITLE_ROW = 1;
export const LIST_TOP = 3;
export const LIST_BOTTOM = 22;
export const VISIBLE = 6;
export const LEFT_COL = 2;
export const DESC_COL = 5;
export const RIGHT_COL = 37;
export const POP_DESC_ROW = 8;
export const OPT_NEXT = 1;
export const OPT_PREV = 2;
export const OPT_TAKE = 3;
export const OPT_QUIT = 4;
export const OPT_EXIT = 5;
export const EXIT_KEY = 88;
export const QUIT_KEY = 81;

export const $at = { listed: 249585, count: 249597, used: 249598, descs: 249609, areas: 249950, clocks: 250159, dates: 250225, times: 250346, sel: 250390, top_: 250391 };

export async function ChooseSlot(saving: boolean, start: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 22);
  let i: number = 0, ch: number = 0, newest: number = 0, chosen: number = 0, $r0: number = 0;
  $r0 = 0;
  wS($f0 + 10, 11, SLOT_LETTERS);
  U8[249597] = 0;
  for (let $i1 = 1, $e1 = U8[$f0 + 10]; $i1 <= $e1; $i1++) {
    i = $i1;
    ReadSlot(U8[249597] + 1, U8[$f0 + i + 10]);
    if (saving || (U8[(U8[249597] + 1) + 249597] !== 0)) {
      U8[249597] = U8[249597] + 1;
    }
  }
  U8[249585] = U8[249597];
  if (U8[249597] === 0) {
    (await TextRend.FlashBottomLine(14, "No saved games found to load."));
    { S.sp = $sp; return $r0; }
  }
  U8[250390] = 1;
  newest = 0;
  for (let $i2 = 1, $e2 = U8[249597]; $i2 <= $e2; $i2++) {
    i = $i2;
    if ((U8[i + 249597] !== 0) && ((newest === 0) || (ri32(i * 4 + 250342) > newest))) {
      newest = ri32(i * 4 + 250342);
      U8[250390] = i;
    }
  }
  if (rt.Pos(String.fromCharCode(start), rS(249585)) > 0) {
    U8[250390] = rt.Pos(String.fromCharCode(start), rS(249585));
  }
  U8[250391] = 1;
  TextRend.ClearScreen();
  (await Border.DrawBorder(1, 3, 38, 22, 0));
  (await Border.DrawBorder(1, 1, 38, 1, 0));
  TextRend.DisplayCentered(1, 38, 1, 15, "Load/Save Game Menu");
  MoveTo(U8[250390]);
  if (saving) {
    wS($f0 + 1, 8, "Save");
  } else {
    wS($f0 + 1, 8, "Load");
  }
  chosen = 32;
  U8[231529] = 3;
  do {
    wS(235275, 16, rS(249585) + "X");
    rt.wSet(235292, 0, 3, rt.setR(5, 5));
    U8[235274] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("Game: ", "Next Prev " + rS($f0 + 1) + " Quit Exit", 13, 10, 15, true, false, $f0)) & 255;
    if (!(U8[$f0] !== 0) && (ch === 13)) {
      switch (U8[231529]) {
        case 1: {
          ch = 78;
          break;
        }
        case 2: {
          ch = 80;
          break;
        }
        case 3: {
          ch = U8[$f0 + 2];
          break;
        }
        case 4: {
          ch = 33;
          break;
        }
        default: {
          ch = 0;
        }
      }
    }
    if ((U8[$f0] !== 0)) {
      switch (ch) {
        case 72: case 71: {
          MoveTo(U8[250390] - 1);
          break;
        }
        case 80: case 79: {
          MoveTo(U8[250390] + 1);
          break;
        }
        case 73: {
          if (U8[250390] > 6) {
            MoveTo(U8[250390] - 6);
          } else {
            MoveTo(1);
          }
          break;
        }
        case 81: {
          if ((U8[250390] + 6) < U8[249597]) {
            MoveTo(U8[250390] + 6);
          } else {
            MoveTo(U8[249597]);
          }
          break;
        }
      }
    } else if ((ch === 0) || (ch === 33)) {
      chosen = ch;
    } else if (ch === 88) {
      chosen = 0;
    } else if (ch === 81) {
      chosen = 33;
    } else if ((ch !== 32) && (rt.Pos(String.fromCharCode(ch), rS(249585)) > 0)) {
      chosen = ch;
    } else if (ch === 78) {
      MoveTo(U8[250390] + 1);
    } else if (ch === 80) {
      MoveTo(U8[250390] - 1);
    } else if (ch === U8[$f0 + 2]) {
      chosen = U8[U8[250390] + 249585];
    }
  } while (!(chosen !== 32));
  TextRend.ClearBottomLine();
  $r0 = chosen;
  S.sp = $sp;
  return $r0;
}

export async function AskDescription(letter: number, area: string, desc: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 62);
  let key: number = 0, $r0: boolean = false;
  Border.ClearBox(1, 3, 38, 22);
  wS($f0 + 31, 30, "SAVE GAME " + String.fromCharCode(letter));
  TextRend.DisplayString(2, 4, 10, rS($f0 + 31));
  TextRend.DisplayString(2, 5, 10, "Location: " + area);
  TextRend.DisplayString(2, 7, 10, "Description:");
  wS($f0, 30, rt.Copy(rS(desc), 1, 27));
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, 13, "Save: ");
  TextRend.DisplayString(6, 24, 10, "Exit");
  do {
    if (rS($f0) === "") {
      DrawDescLine(rS($f0 + 31));
    } else {
      DrawDescLine(rS($f0));
    }
    key = (await GameIo.ReadAnyKey()) & 255;
    const $c2 = key;
    if (($c2 >= 32 && $c2 <= 122)) {
      if (U8[$f0] < 27) {
        wS($f0, 30, rS($f0) + String.fromCharCode(rt.UpCase(key)));
      }
    } else if ($c2 === 8) {
      if (U8[$f0] > 0) {
        wS($f0, 30, rt.Copy(rS($f0), 1, U8[$f0] - 1));
      }
    }
  } while (!((key === 13) || (key === 27)));
  TextRend.ClearBottomLine();
  if (rS($f0) === "") {
    wS($f0, 30, rS($f0 + 31));
  }
  if (key === 13) {
    wS(desc, 30, rS($f0));
  }
  $r0 = key === 13;
  S.sp = $sp;
  return $r0;
}

export function ReadSlotInfo(letter: number, desc: number, area: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 56);
  let ok: boolean = false, $r0: boolean = false;
  wS(desc, 30, "");
  wS(area, 18, "");
  ok = (((FileUtil.ReadRecord(SlotFile(letter, ".inf"), $f0, 56) && (rS($f0) === INFO_SIG)) && (U8[$f0 + 5] === 1)) && (U8[$f0 + 6] <= 30)) && (U8[$f0 + 37] <= 18);
  if (ok) {
    wS(desc, 30, rS($f0 + 6));
    wS(area, 18, rS($f0 + 37));
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function SlotName(letter: number, ext: string) {
  let $r0: string = "";
  $r0 = "savgam" + String.fromCharCode(letter) + ext;
  return $r0;
}

export function SlotFile(letter: number, ext: string) {
  let $r0: string = "";
  $r0 = rS(229121) + SlotName(letter, ext);
  return $r0;
}

export function MemberName(letter: number, n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: string = "";
  wS($f0, 1, rt.fmtI(n, 0));
  $r0 = "CHRDAT" + String.fromCharCode(letter) + rS($f0);
  S.sp = $sp;
  return $r0;
}

export function VaultName(letter: number) {
  let $r0: string = "";
  $r0 = "vault" + String.fromCharCode(letter) + ".dat";
  return $r0;
}

export function RemoveCharFiles(s: number, base: string, ext: string) {
  FileUtil.AddToSet(s, base + ext, false);
  FileUtil.AddToSet(s, base + ".itm", false);
  FileUtil.AddToSet(s, base + ".spc", false);
  FileUtil.AddToSet(s, base + ".mem", false);
  FileUtil.AddToSet(s, base + ".sts", false);
  FileUtil.AddToSet(s, base + ".chx", false);
}

export function RecoverSlot(letter: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1028);
  let $r0: boolean = false;
  SlotSet($f0, letter);
  $r0 = FileUtil.RecoverSet($f0);
  S.sp = $sp;
  return $r0;
}

export function MoveOldQuickSave() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2056);
  let i: number = 0, ok: boolean = false;
  if (((!RecoverSlot(81) || !RecoverSlot(90)) || !FileUtil.Exists(SlotFile(81, ".dat"))) || FileUtil.Exists(SlotFile(90, ".dat"))) {
    { S.sp = $sp; return; }
  }
  SlotSet($f0, 81);
  SlotSet($f0 + 1028, 90);
  ok = true;
  for (let $i1 = U8[$f0 + 256]; $i1 >= 1; $i1--) {
    i = $i1;
    if (ok && FileUtil.Exists(rS($f0) + rS($f0 + i * 13 + 244))) {
      ok = FileUtil.DeleteChecked(rS($f0 + 1028) + rS($f0 + i * 13 + 1272));
      if (ok) {
        ok = FileUtil.RenameChecked(rS($f0) + rS($f0 + i * 13 + 244), rS($f0 + 1028) + rS($f0 + i * 13 + 1272));
      }
    }
  }
  S.sp = $sp;
}

export function WriteSlotInfo(s: number, letter: number, desc: string, area: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 56);
  let $r0: boolean = false;
  rt.fill($f0, 56, 0);
  wS($f0, 4, INFO_SIG);
  U8[$f0 + 5] = 1;
  wS($f0 + 6, 30, desc);
  wS($f0 + 37, 18, area);
  $r0 = FileUtil.WriteToSet(s, SlotName(letter, ".inf"), $f0, 56);
  S.sp = $sp;
  return $r0;
}

export function SaveDiskMsg() {
  let $r0: string = "";
  $r0 = "Put save disk in " + String.fromCharCode(U8[229122]) + ": (Esc gives up)";
  return $r0;
}

export async function AskSaveDisk(problem: string, name_: string) {
  let $r0: boolean = false;
  $r0 = (await DaxIo.AskForDisk(problem, name_, SaveDiskMsg())) !== 27;
  return $r0;
}

export async function CheckSaveDir() {
  while (!FileUtil.MakeFolder(rS(229121)) && (await AskSaveDisk("Cannot create", rt.Copy(rS(229121), 1, U8[229121] - 1)))) {
  }
}

export function SlotSet(s: number, letter: number) {
  let n: number = 0;
  FileUtil.NewSet(s, rS(229121));
  FileUtil.AddToSet(s, SlotName(letter, ".dat"), false);
  FileUtil.AddToSet(s, SlotName(letter, ".inf"), false);
  FileUtil.AddToSet(s, SlotName(letter, ".sts"), false);
  FileUtil.AddToSet(s, SlotName(letter, ".map"), false);
  FileUtil.AddToSet(s, SlotName(letter, ".nts"), false);
  FileUtil.AddToSet(s, SlotName(letter, ".jnl"), false);
  FileUtil.AddToSet(s, VaultName(letter), false);
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    n = $i1;
    RemoveCharFiles(s, MemberName(letter, n), ".sav");
  }
}

export function ReadSlot(i: number, letter: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 33);
  let ioRes: number = 0, n1: number = 0, n2: number = 0, recovered: boolean = false;
  recovered = RecoverSlot(letter);
  U8[i + 249585] = letter;
  U8[i + 249597] = false ? 1 : 0;
  w32(i * 4 + 250342, 0);
  wS(i * 6 + 250153, 5, "");
  wS(i * 11 + 250214, 10, "");
  wS(i * 31 + 249578, 30, "");
  wS(i * 19 + 249931, 18, "");
  if (FileUtil.OpenReadOnly($f0, SlotFile(letter, ".dat"))) {
    U8[i + 249597] = true ? 1 : 0;
    Dos.GetFTime($f0, $f0 + 8);
    if (rt.IOResult() === 0) {
      w32(i * 4 + 250342, ri32($f0 + 8));
      Dos.UnpackTime(ri32($f0 + 8), $f0 + 12);
      wS($f0 + 24, 4, rt.fmtI(r16($f0 + 12), 0));
      wS(i * 6 + 250153, 5, StrUtil.ZeroPad2(r16($f0 + 18)) + ":" + StrUtil.ZeroPad2(r16($f0 + 20)));
      wS(i * 11 + 250214, 10, rS($f0 + 24) + "/" + StrUtil.ZeroPad2(r16($f0 + 14)) + "/" + StrUtil.ZeroPad2(r16($f0 + 16)));
    }
    if (!ReadSlotInfo(letter, i * 31 + 249578, i * 19 + 249931)) {
      rt.Seek($f0, (1 + (r32(227033) + 484)) - (r32(227033)));
      n1 = rt.BlockRead($f0, $f0 + 29, 2, true) & 65535;
      rt.Seek($f0, (1 + (r32(227033) + 394)) - (r32(227033)));
      n2 = rt.BlockRead($f0, $f0 + 31, 2, true) & 65535;
      if (((rt.IOResult() === 0) && (n1 === 2)) && (n2 === 2)) {
        wS(i * 19 + 249931, 18, AreaName.AreaFor(r16($f0 + 29) & 255, U8[$f0 + 31]));
      } else {
        wS(i * 19 + 249931, 18, "UNKNOWN AREA");
      }
    }
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
  }
  S.sp = $sp;
}

export function DrawList() {
  let k: number = 0, i: number = 0, row: number = 0, color: number = 0;
  Border.ClearBox(1, 3, 38, 22);
  if (U8[250391] > 1) {
    MenuCore.DrawMore(1, 38, 3);
  }
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    k = $i1;
    i = (U8[250391] + k) & 255;
    if (i <= U8[249597]) {
      if (i === U8[250390]) {
        color = 15;
      } else {
        color = 10;
      }
      row = (4 + (3 * k)) & 255;
      if (i === U8[250390]) {
        TextRend.DisplayStringOn(2, row, 0, 15, String.fromCharCode(U8[i + 249585]) + ":");
      } else {
        TextRend.DisplayString(2, row, 15, String.fromCharCode(U8[i + 249585]));
        TextRend.DisplayString(3, row, color, ":");
      }
      if ((U8[i + 249597] !== 0)) {
        TextRend.DisplayString(5, row, color, rt.Copy(rS(i * 31 + 249578), 1, 27));
        TextRend.DisplayString(38 - U8[i * 6 + 250153], row, color, rS(i * 6 + 250153));
        TextRend.DisplayString(5, row + 1, color, rS(i * 19 + 249931));
        TextRend.DisplayString(38 - U8[i * 11 + 250214], row + 1, color, rS(i * 11 + 250214));
      } else {
        TextRend.DisplayString(5, row, color, "EMPTY");
      }
    }
  }
  if (((U8[250391] + 6) - 1) < U8[249597]) {
    MenuCore.DrawMore(1, 38, 22);
  }
}

export function MoveTo(i: number) {
  if (i < 1) {
    i = U8[249597];
  } else if (i > U8[249597]) {
    i = 1;
  }
  U8[250390] = i;
  if (U8[250390] < U8[250391]) {
    U8[250391] = U8[250390];
  }
  if (U8[250390] > ((U8[250391] + 6) - 1)) {
    U8[250391] = (U8[250390] - 6) + 1;
  }
  DrawList();
}

export function DrawDescLine(shown: string) {
  let i: number = 0;
  TextRend.DisplayString(2, 8, 15, shown);
  for (let $i1 = shown.length + 1; $i1 <= 27; $i1++) {
    i = $i1;
    TextRend.DisplayString((2 + i) - 1, 8, 10, ".");
  }
}
