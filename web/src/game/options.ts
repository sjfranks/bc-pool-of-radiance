// Generated from src/options.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as CfgFile from './cfgfile';
import * as Crt from './crt';
import * as Types from './types';
import * as C_KEYS from './c_keys';
import * as C_SOUND from './c_sound';
import * as C_DATA from './c_data';
import * as C_OPT from './c_opt';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as GameIo from './gameio';
import * as SoundDrv from './sounddrv';
import * as DaxIo from './daxio';
import * as DataArc from './dataarc';
import * as GameDefs from './gamedefs';
import * as VidOps from './vidops';
import * as CbtLog from './cbtlog';
import * as StrUtil from './strutil';
import * as Advisory from './advisory';

export const BUILD_VERSION = "UNKNOWN";
export const BUILD_COMMIT = "c690a70";
export const CHOICE_LEFT = 0;
export const CHOICE_RIGHT = 1;
export const PAGE_GAME = 1;
export const PAGE_SOUND = 2;
export const PAGE_CAMP = 3;
export const PAGE_COMBAT = 4;
export const PAGE_SYSTEM = 5;
export const SETTINGS_PAGES = rt.setR(1, 4);
export const LEFT_COL = 1;
export const RIGHT_COL = 38;
export const TOP_ROW = 1;
export const BOTTOM_ROW = 22;
export const FIRST_ROW = 2;
export const LABEL_COL = 2;
export const SETTING_COL = 24;
export const VALUE_COL = 20;
export const TITLE_COLOR = 15;
export const LINE_COLOR = 10;
export const OFF_COLOR = 8;

export const $at = { stepChoice: 257265, cur: 257266, unchangeable: 257327, noDevice: 257332 };

export function LoadOptions() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let found: number = 0;
  Collect(257266);
  found = CfgFile.ReadOptions(rS(229121), 257266, $f0) & 255;
  Apply(257266);
  GameIo.SetSound(U8[227069] !== 0);
  w32(232647, 20);
  S.sp = $sp;
}

export function SaveOptions() {
  let written: boolean = false;
  Collect(257266);
  written = CfgFile.WriteOptions(rS(229121), 257266);
}

export function Apply(s: number) {
  let opt: number = 0;
  U8[227049] = U8[s];
  U8[227092] = U8[s + 1];
  U8[227067] = 0;
  U8[227068] = 0;
  for (let $i1 = 2; $i1 <= 35; $i1++) {
    opt = $i1;
    switch (opt) {
      case 2: {
        U8[227063] = U8[s + opt];
        break;
      }
      case 3: {
        U8[227065] = U8[s + opt];
        break;
      }
      case 4: {
        U8[227064] = U8[s + opt];
        break;
      }
      case 5: {
        U8[227070] = U8[s + opt];
        break;
      }
      case 6: {
        U8[227071] = U8[s + opt];
        break;
      }
      case 7: {
        U8[227072] = U8[s + opt];
        break;
      }
      case 8: {
        U8[227073] = U8[s + opt];
        break;
      }
      case 9: {
        U8[227074] = U8[s + opt];
        break;
      }
      case 10: {
        U8[227075] = U8[s + opt];
        break;
      }
      case 13: {
        U8[227066] = U8[s + opt];
        break;
      }
      case 14: case 15: {
        if (U8[s + opt] !== 0) {
          U8[227067] = U8[227067] | GroupBit(opt);
        }
        break;
      }
      case 16: {
        U8[227069] = U8[s + opt];
        break;
      }
      case 17: case 18: case 19: case 20: case 21: case 22: {
        if (U8[s + opt] !== 0) {
          U8[227068] = U8[227068] | GroupBit(opt);
        }
        break;
      }
      case 28: {
        U8[227077] = U8[s + opt];
        break;
      }
      case 29: {
        U8[227078] = U8[s + opt];
        break;
      }
      case 30: {
        U8[227079] = U8[s + opt];
        break;
      }
      case 31: {
        U8[227080] = U8[s + opt];
        break;
      }
      case 32: {
        U8[227081] = U8[s + opt];
        break;
      }
      case 33: {
        U8[227082] = U8[s + opt];
        break;
      }
      case 34: {
        U8[227083] = U8[s + opt];
        break;
      }
      case 11: {
        U8[227084] = U8[s + opt];
        break;
      }
      case 12: {
        U8[227085] = U8[s + opt];
        break;
      }
      case 23: {
        U8[227086] = U8[s + opt];
        break;
      }
      case 24: {
        U8[227087] = U8[s + opt];
        break;
      }
      case 25: {
        U8[227088] = U8[s + opt];
        break;
      }
      case 26: {
        U8[227089] = U8[s + opt];
        break;
      }
      case 27: {
        U8[227090] = U8[s + opt];
        break;
      }
      case 35: {
        U8[227091] = U8[s + opt];
        break;
      }
    }
  }
  wS(257302, 24, rS(s + 36));
}

export function AdvisedVersion() {
  let $r0: string = "";
  $r0 = rS(257302);
  return $r0;
}

export function SetAdvised(version: string) {
  wS(257302, 24, CfgFile.Tidy(version));
  SaveOptions();
}

export async function OptionsMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let sel: number = 0, page: number = 0, ch: number = 0, changed: boolean = false, touched: boolean = false, savedChoice: number = 0, soundState: number = 0;
  function MoveTo(n: number) {
    DrawSetting(sel, 10);
    sel = n;
    DrawSetting(sel, 15);
  }
  function Arrow(choice: number) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 50);
    if (rt.inM(257327, 0, 5, sel)) {
      { S.sp = $sp; return; }
    }
    if (CfgFile.StepNames(sel, $f1, $f1 + 25)) {
      U8[257265] = choice;
      DrawSetting(sel, 15);
    } else {
      ChangeSetting(sel);
      touched = true;
    }
    S.sp = $sp;
  }
  async function ShowPage(p: number) {
    let opt: number = 0;
    page = p;
    if (rt.inS(SETTINGS_PAGES, page)) {
      for (let $i1 = 36; $i1 >= 1; $i1--) {
        opt = $i1;
        if (CfgFile.SettingPage(opt) === page) {
          sel = opt;
        }
      }
    }
    U8[257265] = 0;
    (await DrawPage(page, sel));
  }
  savedChoice = U8[231529];
  if (CbtLog.Usable()) {
    rt.wSet(257327, 0, 5, rt.setR());
  } else {
    rt.wSet(257327, 0, 5, rt.setR(35, 35, 36, 36));
  }
  U8[257332] = U8[227026] === 2 ? 1 : 0;
  CfgFile.Silenced((U8[257332] !== 0), 257327);
  sel = 1;
  U8[257265] = 0;
  changed = false;
  (await ShowPage(1));
  do {
    soundState = U8[229119];
    touched = false;
    U8[231529] = page;
    U8[235273] = true ? 1 : 0;
    U8[235274] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("", "Game Sound Camp coMbat sYstem Exit", 13, 10, 15, true, false, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      if (rt.inS(SETTINGS_PAGES, page)) {
        Passed(page, $f0 + 1);
        switch (ch) {
          case 72: case 71: {
            MoveTo(CfgFile.NextSetting(sel, false, rt.rSet($f0 + 1, 0, 5)));
            break;
          }
          case 80: case 79: {
            MoveTo(CfgFile.NextSetting(sel, true, rt.rSet($f0 + 1, 0, 5)));
            break;
          }
          case 75: {
            Arrow(0);
            break;
          }
          case 77: {
            Arrow(1);
            break;
          }
        }
      }
    } else {
      switch (ch) {
        case 13: {
          if (rt.inS(SETTINGS_PAGES, page) && !rt.inM(257327, 0, 5, sel)) {
            ChangeSetting(sel);
            touched = true;
          }
          break;
        }
        case 71: {
          if (page !== 1) {
            (await ShowPage(1));
          }
          break;
        }
        case 83: {
          if (page !== 2) {
            (await ShowPage(2));
          }
          break;
        }
        case 67: {
          if (page !== 3) {
            (await ShowPage(3));
          }
          break;
        }
        case 77: {
          if (page !== 4) {
            (await ShowPage(4));
          }
          break;
        }
        case 89: {
          if (page !== 5) {
            (await ShowPage(5));
          }
          break;
        }
      }
    }
    if (touched) {
      changed = true;
    }
    if (rt.inS(SETTINGS_PAGES, page) && (touched || (U8[229119] !== soundState))) {
      if ((page === 2) && (sel !== 16)) {
        DrawSetting(16, 10);
      }
      DrawSetting(sel, 15);
    }
  } while (!(!(U8[$f0] !== 0) && (ch === 0 || ch === 69)));
  if (changed) {
    SaveOptions();
  }
  U8[231529] = savedChoice;
  S.sp = $sp;
}

export function GroupBit(opt: number) {
  let $r0: number = 0;
  switch (opt) {
    case 14: {
      $r0 = 1;
      break;
    }
    case 15: {
      $r0 = 2;
      break;
    }
    case 17: {
      $r0 = 1;
      break;
    }
    case 18: {
      $r0 = 2;
      break;
    }
    case 19: {
      $r0 = 4;
      break;
    }
    case 20: {
      $r0 = 8;
      break;
    }
    case 21: {
      $r0 = 16;
      break;
    }
    case 22: {
      $r0 = 32;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function Collect(s: number) {
  let opt: number = 0;
  U8[s] = U8[227049];
  U8[s + 1] = U8[227092];
  for (let $i1 = 2; $i1 <= 35; $i1++) {
    opt = $i1;
    switch (opt) {
      case 2: {
        U8[s + opt] = U8[227063];
        break;
      }
      case 3: {
        U8[s + opt] = U8[227065];
        break;
      }
      case 4: {
        U8[s + opt] = U8[227064];
        break;
      }
      case 5: {
        U8[s + opt] = U8[227070];
        break;
      }
      case 6: {
        U8[s + opt] = U8[227071];
        break;
      }
      case 7: {
        U8[s + opt] = U8[227072];
        break;
      }
      case 8: {
        U8[s + opt] = U8[227073];
        break;
      }
      case 9: {
        U8[s + opt] = U8[227074];
        break;
      }
      case 10: {
        U8[s + opt] = U8[227075];
        break;
      }
      case 13: {
        U8[s + opt] = U8[227066];
        break;
      }
      case 14: case 15: {
        U8[s + opt] = ((U8[227067] & GroupBit(opt)) !== 0 ? 1 : 0);
        break;
      }
      case 16: {
        U8[s + opt] = U8[227069];
        break;
      }
      case 17: case 18: case 19: case 20: case 21: case 22: {
        U8[s + opt] = ((U8[227068] & GroupBit(opt)) !== 0 ? 1 : 0);
        break;
      }
      case 28: {
        U8[s + opt] = U8[227077];
        break;
      }
      case 29: {
        U8[s + opt] = U8[227078];
        break;
      }
      case 30: {
        U8[s + opt] = U8[227079];
        break;
      }
      case 31: {
        U8[s + opt] = U8[227080];
        break;
      }
      case 32: {
        U8[s + opt] = U8[227081];
        break;
      }
      case 33: {
        U8[s + opt] = U8[227082];
        break;
      }
      case 34: {
        U8[s + opt] = U8[227083];
        break;
      }
      case 11: {
        U8[s + opt] = U8[227084];
        break;
      }
      case 12: {
        U8[s + opt] = U8[227085];
        break;
      }
      case 23: {
        U8[s + opt] = U8[227086];
        break;
      }
      case 24: {
        U8[s + opt] = U8[227087];
        break;
      }
      case 25: {
        U8[s + opt] = U8[227088];
        break;
      }
      case 26: {
        U8[s + opt] = U8[227089];
        break;
      }
      case 27: {
        U8[s + opt] = U8[227090];
        break;
      }
      case 35: {
        U8[s + opt] = U8[227091];
        break;
      }
    }
  }
}

export function SettingRow(opt: number) {
  let $r0: number = 0;
  $r0 = (2 + CfgFile.SettingLine(opt)) & 255;
  return $r0;
}

export function Passed(page: number, skip: number) {
  let opt: number = 0;
  rt.wSet(skip, 0, 5, rt.rSet(257327, 0, 5));
  for (let $i1 = 1; $i1 <= 36; $i1++) {
    opt = $i1;
    if (CfgFile.SettingPage(opt) !== page) {
      rt.wSet(skip, 0, 5, rt.sUnion(rt.rSet(skip, 0, 5), rt.setR(opt, opt)));
    }
  }
}

export function ShownValue(opt: number) {
  let $r0: string = "";
  if ((opt === 16) && !(U8[257332] !== 0)) {
    $r0 = CfgFile.OnOff((U8[229119] !== 2 ? 1 : 0));
  } else if ((opt === 35) && !CbtLog.Usable()) {
    $r0 = "Needs EMS";
  } else {
    $r0 = CfgFile.ShownValue(257266, opt, (U8[257332] !== 0));
  }
  return $r0;
}

export function DrawSetting(opt: number, color: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 50);
  let row: number = 0, highlighted: boolean = false;
  function DrawValue(col: number, s: string, chosen: boolean, c: number) {
    if (highlighted && chosen) {
      TextRend.DisplayStringOn(col, row, 0, 15, s);
    } else {
      TextRend.DisplayString(col, row, c, s);
    }
  }
  if ((opt < 1) || (opt > 36)) {
    { S.sp = $sp; return; }
  }
  if (rt.inM(257327, 0, 5, opt)) {
    color = 8;
  }
  highlighted = color === 15;
  row = SettingRow(opt) & 255;
  TextRend.PrintSpaces(2, row, 0, 37);
  Collect(257266);
  TextRend.DisplayString(2, row, color, CfgFile.SettingLabel(257266, opt));
  if (CfgFile.StepNames(opt, $f0, $f0 + 25)) {
    if (highlighted) {
      color = 10;
    }
    DrawValue(24, rS($f0), U8[257265] !== 1, color);
    DrawValue((24 + U8[$f0]) + 1, rS($f0 + 25), U8[257265] === 1, color);
  } else {
    DrawValue(24, ShownValue(opt), true, color);
  }
  S.sp = $sp;
}

export function DrawInfo(row: number, lab: string, value: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, value);
  let i: number = 0;
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[$f0 + i] === 92) {
      U8[$f0 + i] = 47;
    }
  }
  if (U8[$f0] > 19) {
    wS($f0, 255, "..." + rt.Copy(rS($f0), (U8[$f0] - 16) + 1, 16));
  }
  TextRend.DisplayString(2, row, 10, rt.Copy(lab, 1, 17));
  TextRend.DisplayString(20, row, 10, rS($f0));
  S.sp = $sp;
}

export async function CountMerged(merged: number, present: number) {
  let fam: number = 0, disk: number = 0, found: boolean = false;
  U8[merged] = 0;
  U8[present] = 0;
  for (let $i1 = 1; $i1 <= 14; $i1++) {
    fam = $i1;
    if ((await DaxIo.FamilyUsable(fam))) {
      U8[merged] = U8[merged] + 1;
      U8[present] = U8[present] + 1;
    } else {
      found = false;
      for (let $i2 = 1; $i2 <= 8; $i2++) {
        disk = $i2;
        if (!found) {
          found = DataArc.FileLength(rS(229377) + DataArc.SourceFile(fam, disk)) >= 0;
        }
      }
      if (found) {
        U8[present] = U8[present] + 1;
      }
    }
  }
}

export function DrawSettingsPage(page: number, sel: number) {
  let opt: number = 0;
  for (let $i1 = 1; $i1 <= 36; $i1++) {
    opt = $i1;
    if (CfgFile.SettingPage(opt) === page) {
      if (opt === sel) {
        DrawSetting(opt, 15);
      } else {
        DrawSetting(opt, 10);
      }
      if (CfgFile.Heading(opt) !== "") {
        TextRend.DisplayString(2, SettingRow(opt) - 1, 10, CfgFile.Heading(opt));
      }
    }
  }
  if ((page === 2) && (U8[257332] !== 0)) {
    TextRend.DisplayString(2, SettingRow(22) + 2, 10, "No sound device in POOL.CFG");
  }
}

export async function DrawSystemPage() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 23);
  DrawInfo(2, "Video", VidOps.ModeName());
  DrawInfo(3, "Sound Device", rS(227005));
  DrawInfo(4, "Version", rS(217491));
  DrawInfo(5, "Commit", BUILD_COMMIT);
  (await CountMerged($f0, $f0 + 1));
  DrawInfo(7, "Data", "V" + StrUtil.Grouped(46));
  DrawInfo(8, "Merged Files", StrUtil.Grouped(U8[$f0]) + "/" + StrUtil.Grouped(U8[$f0 + 1]));
  DrawInfo(10, "Free Memory", StrUtil.Grouped(16777216));
  DrawInfo(11, "Largest Block", StrUtil.Grouped(16777216));
  DrawInfo(12, "EMS Active", "N/A");
  DrawInfo(13, "Speed Check", Advisory.SpeedText());
  DrawInfo(14, "Cycles", Advisory.CyclesText());
  wS($f0 + 2, 20, "");
  if ((U8[227094] !== 0)) {
    wS($f0 + 2, 20, "STING ");
  }
  if ((U8[227095] !== 0)) {
    wS($f0 + 2, 20, rS($f0 + 2) + "NORAND ");
  }
  if ((U8[227096] !== 0)) {
    wS($f0 + 2, 20, rS($f0 + 2) + "ADVISE");
  }
  if (rS($f0 + 2) !== "") {
    DrawInfo(15, "Switches", rS($f0 + 2));
  }
  Advisory.DisplayText(2, 17, 10, "This is a modified version of the");
  Advisory.DisplayText(2, 18, 10, "game. GOG, Steam and SNEG can't help");
  Advisory.DisplayText(2, 19, 10, "with it. Please send questions and");
  Advisory.DisplayText(2, 20, 10, "bug reports to");
  Advisory.DisplayText(2, 21, 15, Advisory.SUPPORT_EMAIL + ".");
  S.sp = $sp;
}

export async function DrawPage(page: number, sel: number) {
  Border.ClearBox(0, 0, 39, 23);
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  switch (page) {
    case 1: {
      TextRend.DisplayCentered(1, 38, 1, 15, "Game Settings");
      DrawSettingsPage(1, sel);
      break;
    }
    case 2: {
      TextRend.DisplayCentered(1, 38, 1, 15, "Sound Settings");
      DrawSettingsPage(2, sel);
      break;
    }
    case 3: {
      TextRend.DisplayCentered(1, 38, 1, 15, "Camp Settings");
      DrawSettingsPage(3, sel);
      break;
    }
    case 4: {
      TextRend.DisplayCentered(1, 38, 1, 15, "Combat Settings");
      DrawSettingsPage(4, sel);
      break;
    }
    case 5: {
      TextRend.DisplayCentered(1, 38, 1, 15, "System Info");
      (await DrawSystemPage());
      break;
    }
  }
}

export function ChangeSetting(opt: number) {
  if (opt === 16) {
    GameIo.SetSound(U8[229119] === 2);
  } else {
    Collect(257266);
    CfgFile.ChangeSetting(257266, opt, U8[257265] === 1);
    Apply(257266);
    if (opt === 13 || opt === 14 || opt === 15) {
      SoundDrv.ApplyMusicSettings();
    }
  }
}
