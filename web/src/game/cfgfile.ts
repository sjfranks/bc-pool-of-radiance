// Generated from src/cfgfile.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_OPT from './c_opt';
import * as FileUtil from './fileutil';
import * as Dos from './dos';
import * as NatFile from './natfile';

export const CFG_READ = 0;
export const CFG_MISSING = 1;
export const CFG_FIXED = 2;
export const CFG_UNREADABLE = 3;
export const PATH_OK = 0;
export const PATH_EMPTY = 1;
export const PATH_BAD_CHAR = 2;
export const PATH_TOO_LONG = 3;
export const PATH_MISSING = 4;

export function KeyName(key: number) {
  let $r0: string = "";
  switch (key) {
    case 1: {
      $r0 = "SPEED";
      break;
    }
    case 2: {
      $r0 = "ALLPORTRAITS";
      break;
    }
    case 3: {
      $r0 = "MONSTERS";
      break;
    }
    case 4: {
      $r0 = "PORTRAITS";
      break;
    }
    case 5: {
      $r0 = "AUTOJOIN";
      break;
    }
    case 6: {
      $r0 = "CONSOLIDATECOIN";
      break;
    }
    case 7: {
      $r0 = "JOURNAL";
      break;
    }
    case 8: {
      $r0 = "NONHUMANCAP";
      break;
    }
    case 9: {
      $r0 = "LEVELCAP";
      break;
    }
    case 10: {
      $r0 = "TRAINANYWHERE";
      break;
    }
    case 13: {
      $r0 = "MUSIC";
      break;
    }
    case 14: {
      $r0 = "TITLEMUSIC";
      break;
    }
    case 15: {
      $r0 = "BATTLEMUSIC";
      break;
    }
    case 16: {
      $r0 = "SOUND";
      break;
    }
    case 17: {
      $r0 = "FOOTSTEPS";
      break;
    }
    case 18: {
      $r0 = "RANGEDSOUND";
      break;
    }
    case 19: {
      $r0 = "MELEESOUND";
      break;
    }
    case 20: {
      $r0 = "DEATHSCREAM";
      break;
    }
    case 21: {
      $r0 = "WALLHIT";
      break;
    }
    case 22: {
      $r0 = "SPELLSOUND";
      break;
    }
    case 28: {
      $r0 = "AUTOENDQUICK";
      break;
    }
    case 29: {
      $r0 = "QUICKMAGIC";
      break;
    }
    case 30: {
      $r0 = "GEARCHANGES";
      break;
    }
    case 31: {
      $r0 = "AIMCYCLES";
      break;
    }
    case 32: {
      $r0 = "RETRIEVETHROWN";
      break;
    }
    case 33: {
      $r0 = "MINIMAP";
      break;
    }
    case 34: {
      $r0 = "WIDECOMBAT";
      break;
    }
    case 11: {
      $r0 = "COMPANION";
      break;
    }
    case 12: {
      $r0 = "CLUENOTES";
      break;
    }
    case 23: {
      $r0 = "AUTOMEMORIZE";
      break;
    }
    case 24: {
      $r0 = "FIXSCROLLS";
      break;
    }
    case 25: {
      $r0 = "FIXPOTIONS";
      break;
    }
    case 26: {
      $r0 = "FIXPALADINCURE";
      break;
    }
    case 27: {
      $r0 = "FIXPALADINHEAL";
      break;
    }
    case 35: {
      $r0 = "COMBATLOG";
      break;
    }
    case 36: {
      $r0 = "LOGLINES";
      break;
    }
    case 37: {
      $r0 = "ADVISED";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function SettingName(opt: number) {
  let $r0: string = "";
  switch (opt) {
    case 1: {
      $r0 = "Game Speed";
      break;
    }
    case 2: {
      $r0 = "Portraits";
      break;
    }
    case 3: {
      $r0 = "  Monster Portraits";
      break;
    }
    case 4: {
      $r0 = "  Character Portraits";
      break;
    }
    case 5: {
      $r0 = "Auto Join";
      break;
    }
    case 6: {
      $r0 = "Consolidate Coin";
      break;
    }
    case 7: {
      $r0 = "Journal";
      break;
    }
    case 8: {
      $r0 = "Non-Human Level Cap";
      break;
    }
    case 9: {
      $r0 = "Game Level Cap";
      break;
    }
    case 10: {
      $r0 = "Train Anywhere (F4)";
      break;
    }
    case 13: {
      $r0 = "Music";
      break;
    }
    case 14: {
      $r0 = "  Title Music";
      break;
    }
    case 15: {
      $r0 = "  Battle Music";
      break;
    }
    case 16: {
      $r0 = "Sound (Ctrl-S)";
      break;
    }
    case 17: {
      $r0 = "  Footsteps";
      break;
    }
    case 18: {
      $r0 = "  Ranged Weapon Usage";
      break;
    }
    case 19: {
      $r0 = "  Melee Attacks";
      break;
    }
    case 20: {
      $r0 = "  Death Scream";
      break;
    }
    case 21: {
      $r0 = "  Wall Hit";
      break;
    }
    case 22: {
      $r0 = "  Spell Effects";
      break;
    }
    case 28: {
      $r0 = "  Auto End Quick Mode";
      break;
    }
    case 29: {
      $r0 = "  Use Magic";
      break;
    }
    case 30: {
      $r0 = "  Allow Gear Changes";
      break;
    }
    case 31: {
      $r0 = "Aim Cycles";
      break;
    }
    case 32: {
      $r0 = "Retrieve Thrown";
      break;
    }
    case 33: {
      $r0 = "Minimap (F3)";
      break;
    }
    case 34: {
      $r0 = "Wide View";
      break;
    }
    case 11: {
      $r0 = "Companion Tools (F6)";
      break;
    }
    case 12: {
      $r0 = "  Clue Book Notes";
      break;
    }
    case 23: {
      $r0 = "Auto Memorize";
      break;
    }
    case 24: {
      $r0 = "  Use Scrolls";
      break;
    }
    case 25: {
      $r0 = "  Use Potions";
      break;
    }
    case 26: {
      $r0 = "  Use Paladin's Cure";
      break;
    }
    case 27: {
      $r0 = "  Use Paladin's Heal";
      break;
    }
    case 35: {
      $r0 = "Combat Log (F7)";
      break;
    }
    case 36: {
      $r0 = "  Log Lines";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function SettingPage(opt: number) {
  let $r0: number = 0;
  if ((opt >= 13) && (opt <= 22)) {
    $r0 = 2;
  } else if ((opt >= 23) && (opt <= 27)) {
    $r0 = 3;
  } else if ((opt >= 28) && (opt <= 36)) {
    $r0 = 4;
  } else {
    $r0 = 1;
  }
  return $r0;
}

export function Heading(opt: number) {
  let $r0: string = "";
  switch (opt) {
    case 28: {
      $r0 = "Quick Mode";
      break;
    }
    case 24: {
      $r0 = "Fix";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function SettingLine(opt: number) {
  let o: number = 0, line: number = 0, $r0: number = 0;
  line = 0;
  for (let $i1 = 1, $e1 = opt; $i1 <= $e1; $i1++) {
    o = $i1;
    if (SettingPage(o) === SettingPage(opt)) {
      line = (line + ((o < opt ? 1 : 0) + (Heading(o) !== "" ? 1 : 0))) & 255;
    }
  }
  $r0 = line;
  return $r0;
}

export function SettingLabel(s: number, opt: number) {
  let $r0: string = "";
  if (opt === 1 || opt === 36) {
    $r0 = SettingName(opt) + " (" + StoredValue(s, opt) + ")";
  } else {
    $r0 = SettingName(opt);
  }
  return $r0;
}

export function StepNames(opt: number, left: number, right: number) {
  let $r0: boolean = false;
  $r0 = true;
  switch (opt) {
    case 1: {
      wS(left, 24, "Slower");
      wS(right, 24, "Faster");
      break;
    }
    case 36: {
      wS(left, 24, "Less");
      wS(right, 24, "More");
      break;
    }
    default: {
      $r0 = false;
    }
  }
  return $r0;
}

export function NextSetting(opt: number, down: boolean, skip: Uint8Array) {
  let tries: number = 0, $r0: number = 0;
  tries = 0;
  do {
    if (down) {
      opt = (opt % 36) + 1;
    } else if (opt > 1) {
      opt = (opt - 1) & 255;
    } else {
      opt = 36;
    }
    tries = (tries + 1) & 255;
  } while (!(!rt.inS(skip, opt) || (tries >= 36)));
  $r0 = opt;
  return $r0;
}

export function OnOff(flag: number) {
  let $r0: string = "";
  if (flag !== 0) {
    $r0 = "ON";
  } else {
    $r0 = "OFF";
  }
  return $r0;
}

export function FlagValue(opt: number, flag: number) {
  let $r0: string = "";
  if (opt === 31) {
    if (flag !== 0) {
      $r0 = "ENEMIES";
    } else {
      $r0 = "ALL";
    }
  } else if (opt === 7) {
    if (flag !== 0) {
      $r0 = "FOUND";
    } else {
      $r0 = "ALL";
    }
  } else {
    $r0 = OnOff(flag);
  }
  return $r0;
}

export function Trim(s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let $r0: string = "";
  let $t2;
  while ((U8[$f0] > 0) && ($t2 = U8[$f0 + 1], $t2 === 32 || $t2 === 9)) {
    wS($f0, 255, rt.Delete(rS($f0), 1, 1));
  }
  let $t4;
  while ((U8[$f0] > 0) && ($t4 = U8[$f0 + U8[$f0]], $t4 === 32 || $t4 === 9)) {
    U8[$f0] = U8[$f0] - 1;
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function Tidy(s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let i: number = 0, $r0: string = "";
  wS($f0, 255, Trim(rS($f0)));
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    U8[$f0 + i] = rt.UpCase(U8[$f0 + i]);
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function KeyOf(line: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let eq: number = 0, k: number = 0, $r0: number = 0;
  $r0 = 0;
  eq = rt.Pos("=", line);
  if (eq === 0) {
    { S.sp = $sp; return $r0; }
  }
  wS($f0, 255, Tidy(rt.Copy(line, 1, eq - 1)));
  for (let $i1 = 1; $i1 <= 37; $i1++) {
    k = $i1;
    if (rS($f0) === KeyName(k)) {
      $r0 = k;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function Defaults(s: number) {
  let opt: number = 0;
  U8[s] = 1;
  U8[s + 1] = 50;
  for (let $i1 = 2; $i1 <= 35; $i1++) {
    opt = $i1;
    U8[s + opt] = (!(opt === 6 || opt === 29 || opt === 11 || opt === 10 || (opt >= 24 && opt <= 27) || opt === 33 || opt === 34) ? 1 : 0);
  }
  wS(s + 36, 24, "");
}

export function Flag(s: number, opt: number) {
  let $r0: number = 0;
  if ((opt >= 2) && (opt <= 35)) {
    $r0 = U8[s + opt];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function SetFlag(s: number, opt: number, value: number) {
  if ((opt >= 2) && (opt <= 35)) {
    U8[s + opt] = (value !== 0 ? 1 : 0);
  }
}

export function ChangeSetting(s: number, opt: number, right: boolean) {
  switch (opt) {
    case 1: {
      if (!right) {
        if (U8[s] < 9) {
          U8[s] = U8[s] + 1;
        }
      } else if (U8[s] > 0) {
        U8[s] = U8[s] - 1;
      }
      break;
    }
    case 36: {
      if (!right) {
        if (U8[s + 1] >= 15) {
          U8[s + 1] = U8[s + 1] - 5;
        } else {
          U8[s + 1] = 10;
        }
      } else if (U8[s + 1] <= 55) {
        U8[s + 1] = U8[s + 1] + 5;
      } else {
        U8[s + 1] = 60;
      }
      break;
    }
    default: {
      SetFlag(s, opt, (Flag(s, opt) === 0 ? 1 : 0));
    }
  }
}

export function StoredValue(s: number, key: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: string = "";
  if (key === 1) {
    $r0 = String.fromCharCode(48 + (U8[s] % 10));
  } else if (key === 36) {
    wS($f0, 3, rt.fmtI(U8[s + 1], 0));
    $r0 = rS($f0);
  } else if (key === 37) {
    $r0 = rS(s + 36);
  } else {
    $r0 = FlagValue(key, Flag(s, key));
  }
  S.sp = $sp;
  return $r0;
}

export function NoSoundDevice(sound: number) {
  let $r0: boolean = false;
  let $t1;
  $r0 = !($t1 = rt.UpCase(sound), $t1 === 80 || $t1 === 84 || $t1 === 65 || $t1 === 66);
  return $r0;
}

export function Silenced(silent: boolean, skip: number) {
  if (silent) {
    rt.wSet(skip, 0, 5, rt.sUnion(rt.rSet(skip, 0, 5), rt.setR(13, 22)));
  }
}

export function ShownValue(s: number, opt: number, silent: boolean) {
  let $r0: string = "";
  if (silent && (opt === 13 || opt === 16)) {
    $r0 = OnOff(0);
  } else {
    $r0 = StoredValue(s, opt);
  }
  return $r0;
}

export function ReadValue(s: number, key: number, value: string) {
  let n: number = 0, code: number = 0, $r0: boolean = false;
  $r0 = true;
  if (key === 1) {
    let $t1;
    if ((value.length === 1) && ($t1 = rt.chAt(value, 1), ($t1 >= 48 && $t1 <= 57))) {
      U8[s] = rt.chAt(value, 1) - 48;
    } else {
      $r0 = false;
    }
  } else if (key === 36) {
    n = rt.valI(value) << 16 >> 16; code = rt.valCode.v << 16 >> 16;
    if (((code === 0) && (n >= 10)) && (n <= 60)) {
      U8[s + 1] = n;
    } else {
      $r0 = false;
    }
  } else if (key === 37) {
    wS(s + 36, 24, value);
  } else if (((value === "ON") || (value === "1")) || (value === FlagValue(key, 1))) {
    SetFlag(s, key, 1);
  } else if (((value === "OFF") || (value === "0")) || (value === FlagValue(key, 0))) {
    SetFlag(s, key, 0);
  } else {
    $r0 = false;
  }
  return $r0;
}

export function ReadOptions(dir: string, s: number, bad: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 264);
  let key: number = 0, lines: number = 0, done: boolean = false, found: number = 0, ioRes: number = 0, $r0: number = 0;
  U8[bad] = 0;
  found = OpenText($f0, dir + C_OPT.OPT_NAME) & 255;
  if (found === 0) {
    lines = 0;
    done = false;
    do {
      if (rt.Eof($f0)) {
        done = true;
      } else {
        wS($f0 + 8, 255, rt.ReadStrT($f0)), rt.ReadLnT($f0);
        lines = (lines + 1) << 16 >> 16;
        key = KeyOf(rS($f0 + 8)) & 255;
        if (key !== 0) {
          if (!ReadValue(s, key, Tidy(rt.Copy(rS($f0 + 8), rt.Pos("=", rS($f0 + 8)) + 1, 255)))) {
            U8[bad] = U8[bad] + 1;
          }
        }
      }
      if ((rt.IOResult() !== 0) || (lines >= 100)) {
        done = true;
      }
    } while (!(done));
    rt.Close($f0);
    ioRes = rt.IOResult() << 16 >> 16;
    if (U8[bad] > 0) {
      found = 2;
    }
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export function WriteOptions(dir: string, s: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 528);
  let key: number = 0, lines: number = 0, done: boolean = false, ok: boolean = false, ioRes: number = 0, $r0: boolean = false;
  $r0 = false;
  wS($f0 + 272, 255, dir + C_OPT.OPT_NAME);
  ioRes = rt.IOResult() << 16 >> 16;
  if (!FileUtil.MakeFolder(dir) || !FileUtil.MakeTempFolder(rS($f0 + 272))) {
    { S.sp = $sp; return $r0; }
  }
  rt.Assign($f0, FileUtil.TempName(rS($f0 + 272)));
  rt.RewriteT($f0);
  if (rt.IOResult() !== 0) {
    { S.sp = $sp; return $r0; }
  }
  for (let $i1 = 1; $i1 <= 37; $i1++) {
    key = $i1;
    rt.WriteT($f0, KeyName(key) + "=" + StoredValue(s, key) + "\n");
  }
  ok = rt.IOResult() === 0;
  if (ok) {
    rt.Assign($f0 + 8, rS($f0 + 272));
    rt.ResetT($f0 + 8);
    if (rt.IOResult() === 0) {
      lines = 0;
      done = false;
      do {
        if (rt.Eof($f0 + 8)) {
          done = true;
        } else {
          wS($f0 + 16, 255, rt.ReadStrT($f0 + 8)), rt.ReadLnT($f0 + 8);
          lines = (lines + 1) << 16 >> 16;
          if ((KeyOf(rS($f0 + 16)) === 0) && (Tidy(rS($f0 + 16)) !== "")) {
            rt.WriteT($f0, rS($f0 + 16) + "\n");
          }
        }
        if (rt.IOResult() !== 0) {
          ok = false;
          done = true;
        }
        if (lines >= 100) {
          done = true;
        }
      } while (!(done));
      rt.Close($f0 + 8);
      ioRes = rt.IOResult() << 16 >> 16;
    }
  }
  rt.Close($f0);
  if (rt.IOResult() !== 0) {
    ok = false;
  }
  if (ok) {
    ok = FileUtil.PutInPlace(rS($f0 + 272));
  } else {
    FileUtil.DeleteFile(FileUtil.TempName(rS($f0 + 272)));
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export function ReadPoolCfg(name_: string, c: number, notes: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 264);
  let found: number = 0, lineNo: number = 0, missing: boolean = false, letter: number = 0, known: boolean = false, ioRes: number = 0, $r0: number = 0;
  U8[c] = 67;
  U8[c + 1] = 83;
  U8[c + 2] = 78;
  wS(c + 3, 255, "");
  wS(c + 259, 255, "");
  U8[c + 515] = 0;
  U8[notes] = 0;
  found = OpenText($f0, name_) & 255;
  if (found !== 0) {
    $r0 = found;
    { S.sp = $sp; return $r0; }
  }
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    lineNo = $i1;
    missing = rt.Eof($f0);
    wS($f0 + 8, 255, "");
    if (!missing) {
      wS($f0 + 8, 255, rt.ReadStrT($f0)), rt.ReadLnT($f0);
    }
    if (U8[$f0 + 8] > 0) {
      letter = rt.UpCase(U8[$f0 + 9]);
    } else {
      letter = 32;
    }
    known = !missing;
    switch (lineNo) {
      case 1: {
        if (letter === 67 || letter === 69 || letter === 84 || letter === 86) {
          U8[c] = letter;
        } else {
          known = false;
        }
        break;
      }
      case 2: {
        if (letter === 80 || letter === 84 || letter === 65 || letter === 66) {
          U8[c + 1] = letter;
        } else if (!(letter === 83 || letter === 78)) {
          known = false;
        }
        break;
      }
      case 3: {
        wS(c + 3, 255, rS($f0 + 8));
        break;
      }
      case 4: {
        wS(c + 259, 255, rS($f0 + 8));
        break;
      }
      case 5: {
        if (letter === 70) {
          U8[c + 2] = letter;
        } else if (letter !== 78) {
          known = false;
        }
        break;
      }
    }
    if (!known) {
      U8[notes] = U8[notes] + 1;
      U8[notes + U8[notes] * 15 - 14] = lineNo;
      U8[notes + U8[notes] * 15 - 13] = missing ? 1 : 0;
      wS(notes + U8[notes] * 15 - 12, 12, rt.Copy(rS($f0 + 8), 1, 12));
    }
  }
  while ((!rt.Eof($f0) && (U8[c + 515] < 4)) && (rt.IOResult() === 0)) {
    U8[c + 515] = U8[c + 515] + 1;
    wS(c + U8[c + 515] * 80 + 436, 79, rt.ReadStrT($f0)), rt.ReadLnT($f0);
  }
  rt.Close($f0);
  ioRes = rt.IOResult() << 16 >> 16;
  if (U8[notes] > 0) {
    $r0 = 2;
  } else {
    $r0 = 0;
  }
  S.sp = $sp;
  return $r0;
}

export function PoolDefaults(c: number, home: string) {
  U8[c] = 86;
  U8[c + 1] = 66;
  U8[c + 2] = 70;
  wS(c + 3, 255, home);
  wS(c + 259, 255, home + "SAVE\\");
  U8[c + 515] = 0;
}

export function WritePoolCfg(name_: string, c: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let i: number = 0, $r0: boolean = false;
  function PutLine(s: string) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 256);
    wS($f1, 255, s);
    wS($f1, 255, rS($f1) + "\x0d\x0a");
    FileUtil.WriteChecked($f0, $f1 + 1, U8[$f1], $f0 + 8);
    S.sp = $sp;
  }
  $r0 = false;
  if (!FileUtil.RewriteTemp($f0, name_)) {
    { S.sp = $sp; return $r0; }
  }
  U8[$f0 + 8] = true ? 1 : 0;
  PutLine(String.fromCharCode(U8[c]));
  PutLine(String.fromCharCode(U8[c + 1]));
  PutLine(rS(c + 3));
  PutLine(rS(c + 259));
  PutLine(String.fromCharCode(U8[c + 2]));
  for (let $i1 = 1, $e1 = U8[c + 515]; $i1 <= $e1; $i1++) {
    i = $i1;
    PutLine(rS(c + i * 80 + 436));
  }
  if (FileUtil.CloseTemp($f0, name_, (U8[$f0 + 8] !== 0))) {
    $r0 = FileUtil.PutInPlace(name_);
  }
  S.sp = $sp;
  return $r0;
}

export function NormalizePath(path: string, full: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 512);
  wS($f0, 255, path);
  let $r0: boolean = false;
  while ((U8[$f0] > 0) && (U8[$f0 + 1] === 32)) {
    wS($f0, 255, rt.Delete(rS($f0), 1, 1));
  }
  while ((U8[$f0] > 0) && (U8[$f0 + U8[$f0]] === 32)) {
    U8[$f0] = U8[$f0] - 1;
  }
  wS($f0, 255, Backslashed(rS($f0)));
  if ((U8[$f0] === 2) && (U8[$f0 + 2] === 58)) {
    wS($f0, 255, rt.GetDir());
  } else {
    wS($f0 + 256, 255, rt.GetDir());
    wS($f0 + 256, 255, Backslashed(rS($f0 + 256)));
    if (U8[$f0 + U8[$f0 + 256] + 256] !== 92) {
      wS($f0 + 256, 255, rS($f0 + 256) + "\\");
    }
    if ((U8[$f0] < 2) || (U8[$f0 + 2] !== 58)) {
      if ((U8[$f0] > 0) && (U8[$f0 + 1] === 92)) {
        wS($f0, 255, rt.Copy(rS($f0 + 256), 1, 2) + rS($f0));
      } else {
        wS($f0, 255, rS($f0 + 256) + rS($f0));
      }
    }
  }
  wS($f0, 255, Backslashed(rS($f0)));
  if (U8[$f0 + U8[$f0]] !== 92) {
    wS($f0, 255, rS($f0) + "\\");
  }
  wS(full, 255, rS($f0));
  $r0 = U8[$f0] <= 235;
  S.sp = $sp;
  return $r0;
}

export function DirExists(path: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 542);
  wS($f0, 255, path);
  let $r0: boolean = false;
  $r0 = false;
  if (((rS($f0) === "") || (rt.Pos("*", rS($f0)) > 0)) || (rt.Pos("?", rS($f0)) > 0)) {
    { S.sp = $sp; return $r0; }
  }
  if ((U8[$f0] > 1) && (U8[$f0 + U8[$f0]] === 92)) {
    U8[$f0] = U8[$f0] - 1;
  }
  wS($f0, 255, NatFile.NativeName(rS($f0)));
  Dos.FindFirst(rS($f0), 55, $f0 + 256);
  $r0 = (ri16(131603) === 0) && ((U8[$f0 + 277] & 16) !== 0);
  Dos.FindClose($f0 + 256);
  S.sp = $sp;
  return $r0;
}

export function CheckPath(text: string, full: number) {
  let i: number = 0, $r0: number = 0;
  text = Trim(text);
  wS(full, 255, text);
  if (text === "") {
    $r0 = 1;
    return $r0;
  }
  for (let $i1 = 1, $e1 = text.length; $i1 <= $e1; $i1++) {
    i = $i1;
    let $t2;
    if (($t2 = rt.chAt(text, i), $t2 === 42 || $t2 === 63 || $t2 === 34 || $t2 === 60 || $t2 === 62 || $t2 === 124)) {
      $r0 = 2;
      return $r0;
    }
  }
  if (!NormalizePath(text, full)) {
    $r0 = 3;
  } else {
    if (DirExists(rS(full))) {
      $r0 = 0;
    } else {
      $r0 = 4;
    }
  }
  return $r0;
}

export function NativeSaveFolder(dataDir: string, saveDir: string, home: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 768);
  let ok: boolean = false, $r0: string = "";
  ok = NormalizePath(dataDir, $f0);
  ok = NormalizePath(saveDir, $f0 + 256);
  wS($f0 + 512, 255, Trim(saveDir));
  let $t1;
  if ((U8[$f0 + 256] > U8[$f0]) && NatFile.SameName(rt.Copy(rS($f0 + 256), 1, U8[$f0]), rS($f0))) {
    $r0 = home + rt.Copy(rS($f0 + 256), U8[$f0] + 1, 255);
  } else if (((U8[$f0 + 512] > 0) && (($t1 = U8[$f0 + 513], $t1 === 92 || $t1 === 47) || ((U8[$f0 + 512] >= 2) && (U8[$f0 + 514] === 58)))) && DirExists(rS($f0 + 256))) {
    $r0 = rS($f0 + 256);
  } else {
    $r0 = home + "SAVE\\";
  }
  S.sp = $sp;
  return $r0;
}

export function OpenText(f: number, name_: string) {
  let ioRes: number = 0, recovered: boolean = false, $r0: number = 0;
  recovered = FileUtil.RecoverFile(name_);
  ioRes = rt.IOResult() << 16 >> 16;
  rt.Assign(f, name_);
  rt.ResetT(f);
  ioRes = rt.IOResult() << 16 >> 16;
  if (ioRes === 0) {
    $r0 = 0;
  } else if ((ioRes === 2) || (ioRes === 3)) {
    $r0 = 1;
  } else {
    $r0 = 3;
  }
  return $r0;
}

export function Backslashed(s: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  wS($f0, 255, s);
  let i: number = 0, $r0: string = "";
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[$f0 + i] === 47) {
      U8[$f0 + i] = 92;
    }
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}
