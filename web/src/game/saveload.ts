// Generated from src/saveload.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Dos from './dos';
import * as DiskRec from './diskrec';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as TextRend from './textrend';
import * as GameIo from './gameio';
import * as MenuCore from './menucore';
import * as Ending from './ending';
import * as ClassCal from './classcal';
import * as View3D from './view3d';
import * as MapTiles from './maptiles';
import * as C_KEYS from './c_keys';
import * as C_GBVM from './c_gbvm';
import * as SaveMenu from './savemenu';
import * as AreaName from './areaname';
import * as Vault from './vault';
import * as Stats from './stats';
import * as DaxIo from './daxio';
import * as CharHlp from './charhlp';
import * as FileUtil from './fileutil';
import * as Party from './party';
import * as StrUtil from './strutil';
import * as UsualSpl from './usualspl';
import * as VidOps from './vidops';
import * as Explored from './explored';
import * as MapNotes from './mapnotes';
import * as JrnlSeen from './jrnlseen';
import * as C_EFFECT from './c_effect';
import * as C_LEVEL from './c_level';
import * as CharDisp from './chardisp';
import * as CharExt from './charext';
import * as BeastFil from './beastfil';
import * as NatFile from './natfile';


export async function LoadCharlist(list: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 53);
  let p: number = 0, ioRes: number = 0;
  w32(list, 0);
  (await SaveMenu.CheckSaveDir());
  if (!FileUtil.RecoverFile(rS(229121) + "charlist.txt")) {
    { S.sp = $sp; return; }
  }
  if (!FileUtil.Exists(rS(229121) + "charlist.txt")) {
    { S.sp = $sp; return; }
  }
  ioRes = rt.IOResult() << 16 >> 16;
  rt.Assign($f0 + 4, rS(229121) + "charlist.txt");
  rt.ResetT($f0 + 4);
  if (rt.IOResult() !== 0) {
    { S.sp = $sp; return; }
  }
  ioRes = 0;
  while ((ioRes === 0) && !rt.Eof($f0 + 4)) {
    wS($f0 + 12, 40, rt.ReadStrT($f0 + 4)), rt.ReadLnT($f0 + 4);
    ioRes = rt.IOResult() << 16 >> 16;
    if (ioRes === 0) {
      p = r32(229639);
      while ((p !== 0) && (rS(p) !== rS($f0 + 12))) {
        p = r32(p + 260);
      }
      if (p !== 0) {
        wS($f0 + 12, 40, "* " + rS($f0 + 12));
      }
      MenuCore.AppendMenuLine(list, $f0, rS($f0 + 12), false);
    }
  }
  rt.Close($f0 + 4);
  ioRes = rt.IOResult() << 16 >> 16;
  S.sp = $sp;
}

export async function SaveCharlist(list: number, omit: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 520);
  let p: number = 0, ioRes: number = 0, ok: boolean = false;
  (await SaveMenu.CheckSaveDir());
  wS($f0 + 264, 255, rS(229121) + "charlist.txt");
  do {
    ioRes = rt.IOResult() << 16 >> 16;
    if (FileUtil.MakeTempFolder(rS($f0 + 264))) {
      rt.Assign($f0, FileUtil.TempName(rS($f0 + 264)));
      rt.RewriteT($f0);
      ioRes = rt.IOResult() << 16 >> 16;
    } else {
      ioRes = 3;
    }
  } while (!((ioRes === 0) || !(await SaveMenu.AskSaveDisk("Cannot write", rS($f0 + 264)))));
  if (ioRes !== 0) {
    { S.sp = $sp; return; }
  }
  p = list;
  ok = true;
  while (ok && (p !== 0)) {
    wS($f0 + 8, 255, rS(p));
    if (rt.Copy(rS($f0 + 8), 1, 2) === "* ") {
      wS($f0 + 8, 255, rt.Delete(rS($f0 + 8), 1, 2));
    }
    if ((omit.length === 0) || (rS($f0 + 8) !== omit)) {
      rt.WriteT($f0, rS($f0 + 8) + "\n");
    }
    ok = rt.IOResult() === 0;
    p = r32(p + 42);
  }
  rt.Close($f0);
  ok = (rt.IOResult() === 0) && ok;
  if (ok) {
    ok = FileUtil.PutInPlace(rS($f0 + 264));
  } else {
    FileUtil.DeleteFile(FileUtil.TempName(rS($f0 + 264)));
  }
  S.sp = $sp;
}

export async function LoadCharIconAnim(loading: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let i: number = 0, height: number = 0;
  DaxIo.PushState(3);
  {
    const $w1 = r32(229635);
    if (U8[$w1 + 192] === 2) {
      height = 2;
    } else {
      height = 1;
    }
    (await MapTiles.LoadIconAnim("CHEAD" + String.fromCharCode(U8[height + 255423]), U8[$w1 + 189], 11));
    (await MapTiles.LoadIconAnim("CBODY" + String.fromCharCode(U8[height + 255423]), U8[$w1 + 190], U8[$w1 + 191]));
    VidOps.MergePic(r32(229773), r32(U8[$w1 + 191] * 8 + 229685));
    VidOps.MergePic(r32(229777), r32(U8[$w1 + 191] * 8 + 229689));
    if (loading) {
      for (let $i2 = 0; $i2 <= 15; $i2++) {
        i = $i2;
        U8[$f0 + i] = i;
        U8[$f0 + i + 16] = i;
      }
      for (let $i3 = 1; $i3 <= 6; $i3++) {
        i = $i3;
        U8[$f0 + U8[i + 226144] + 16] = U8[$w1 + i + 192] & 15;
        U8[$f0 + (U8[i + 226144] + 8) + 16] = (U8[$w1 + i + 192] & 240) >>> 4;
      }
      (await Blit.RemapPic($f0, $f0 + 16, 0, false, r32(U8[$w1 + 191] * 8 + 229685)));
      (await Blit.RemapPic($f0, $f0 + 16, 0, false, r32(U8[$w1 + 191] * 8 + 229689)));
    }
  }
  MapTiles.FreeIconAnim(11);
  DaxIo.PopState();
  S.sp = $sp;
}

export async function SaveChar(creature: number, fname: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1054);
  let p: number = 0, ok: boolean = false, found: boolean = false, $r0: boolean = false;
  (await SaveMenu.CheckSaveDir());
  if (fname.length === 0) {
    wS($f0 + 1041, 4, ".cha");
    wS($f0 + 1028, 12, CharFileName(rS(creature)));
  } else {
    wS($f0 + 1041, 4, ".sav");
    wS($f0 + 1028, 12, fname);
  }
  FileUtil.NewSet($f0, rS(229121));
  ok = CommitWhole($f0, (await WriteCharFiles($f0, creature, rS($f0 + 1028), rS($f0 + 1041))));
  if (!ok) {
    (await TextRend.DisplayAndPause(14, "Could not save " + rt.Copy(rS(creature), 1, 15) + "."));
  }
  if (ok && (fname.length === 0)) {
    (await LoadCharlist($f0 + 1046));
    p = r32($f0 + 1046);
    w32($f0 + 1050, 0);
    found = false;
    while (p !== 0) {
      if ((rS(p) === rS(creature)) || (rS(p) === "* " + rS(creature))) {
        found = true;
      }
      w32($f0 + 1050, p);
      p = r32(p + 42);
    }
    if (!found) {
      MenuCore.AppendMenuLine($f0 + 1046, $f0 + 1050, rS(creature), false);
      (await SaveCharlist(r32($f0 + 1046), ""));
    }
    MenuCore.FreeStringList($f0 + 1046);
  }
  $r0 = ok;
  S.sp = $sp;
  return $r0;
}

export async function EraseChar(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1032);
  let erased: boolean = false;
  FileUtil.NewSet($f0, rS(229121));
  SaveMenu.RemoveCharFiles($f0, CharFileName(name_), ".cha");
  erased = FileUtil.CommitSet($f0);
  (await LoadCharlist($f0 + 1028));
  if (r32($f0 + 1028) !== 0) {
    (await SaveCharlist(r32($f0 + 1028), name_));
    MenuCore.FreeStringList($f0 + 1028);
  }
  S.sp = $sp;
}

export async function LoadChar(name_: string, creature: number, savedGame: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 411);
  let res: number = 0, item: number = 0, effect: number = 0, newItem: number = 0, newEffect: number = 0, whole: boolean = false, found: boolean = false, $r0: boolean = false;
  if (!savedGame) {
    found = RecoverChar(name_);
  }
  name_ = CharFileBase(name_);
  wS($f0 + 13, 40, SaveMenu.SaveDiskMsg());
  if (savedGame) {
    wS($f0 + 8, 4, ".sav");
  } else {
    wS($f0 + 8, 4, ".cha");
  }
  found = (await DaxIo.OpenWithRetry(name_ + rS($f0 + 8), rS($f0 + 13), false, false, $f0));
  $r0 = false;
  if (!found) {
    { S.sp = $sp; return $r0; }
  }
  res = 0;
  DiskRec.CharToDisk(creature, $f0 + 54);
  res = rt.BlockRead($f0, $f0 + 54, 285, true) & 65535;
  whole = (rt.IOResult() === 0) && (res === 285);
  DiskRec.CharFromDisk($f0 + 54, creature);
  rt.Close($f0);
  w32(creature + 260, 0);
  w32(creature + 200, 0);
  w32(creature + 127, 0);
  w32(creature + 264, 0);
  $r0 = whole;
  if (!whole) {
    { S.sp = $sp; return $r0; }
  }
  if ((U8[227077] !== 0) && CharHlp.ComesUnderPlayer(creature)) {
    U8[creature + 271] = 0;
  }
  if (FileUtil.Exists(name_ + ".itm")) {
    found = (await DaxIo.OpenWithRetry(name_ + ".itm", rS($f0 + 13), false, false, $f0));
    item = 0;
    whole = found;
    while (whole && !rt.Eof($f0)) {
      newItem = rt.getMem(64);
      res = 0;
      res = rt.BlockRead($f0, $f0 + 339, 63, true) & 65535;
      whole = (rt.IOResult() === 0) && (res === 63);
      if (whole) {
        DiskRec.ItemFromDisk($f0 + 339, newItem);
        w32(newItem + 42, 0);
        if (item === 0) {
          w32(creature + 200, newItem);
        } else {
          w32(item + 42, newItem);
        }
        item = newItem;
      } else {
        rt.freeMem(newItem);
      }
    }
    if (found) {
      rt.Close($f0);
    }
  }
  if (FileUtil.Exists(name_ + ".spc")) {
    found = (await DaxIo.OpenWithRetry(name_ + ".spc", rS($f0 + 13), false, false, $f0));
    effect = 0;
    whole = found;
    while (whole && !rt.Eof($f0)) {
      newEffect = rt.getMem(9);
      res = 0;
      res = rt.BlockRead($f0, $f0 + 402, 9, true) & 65535;
      whole = (rt.IOResult() === 0) && (res === 9);
      if (whole) {
        DiskRec.EffectFromDisk($f0 + 402, newEffect);
        w32(newEffect + 5, 0);
        if (effect === 0) {
          w32(creature + 127, newEffect);
        } else {
          w32(effect + 5, newEffect);
        }
        effect = newEffect;
      } else {
        rt.freeMem(newEffect);
      }
    }
    if (found) {
      rt.Close($f0);
    }
  }
  if (I8[creature + 153] > 0) {
    effect = r32(creature + 127);
    while (effect !== 0) {
      if (((U8[effect] === 8) && (r16(effect + 1) === 0)) && (U8[effect + 3] === 255)) {
        U8[effect] = 45;
      }
      effect = r32(effect + 5);
    }
  }
  CharHlp.LinkEquipped(creature);
  UsualSpl.ReadUsualSpells(creature, name_);
  Stats.ReadChar(creature, name_);
  CharExt.ReadExt(creature, name_);
  S.sp = $sp;
  return $r0;
}

export function HasCharFile(name_: string) {
  let $r0: boolean = false;
  $r0 = FileUtil.Exists(CharFileBase(name_) + ".cha");
  return $r0;
}

export async function LoadGame() {
  let letter: number = 0;
  (await SaveMenu.CheckSaveDir());
  do {
    letter = (await SaveMenu.ChooseSlot(false, 0)) & 255;
    if (letter === 33) {
      (await QuitToDos(false));
    }
  } while (!(letter !== 33));
  if (letter !== 0) {
    (await LoadSlot(letter));
  }
}

export async function SaveGame() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 69);
  let letter: number = 0, ok: boolean = false, $r0: boolean = false;
  $r0 = false;
  (await SaveMenu.CheckSaveDir());
  wS($f0 + 31, 18, AreaName.CurrentArea());
  letter = 0;
  do {
    letter = (await SaveMenu.ChooseSlot(true, letter)) & 255;
    if (letter === 0) {
      { S.sp = $sp; return $r0; }
    }
    if (letter === 33) {
      (await QuitToDos(false));
      letter = 0;
      ok = false;
    } else {
      ok = SaveMenu.ReadSlotInfo(letter, $f0, $f0 + 50);
      ok = (await SaveMenu.AskDescription(letter, rS($f0 + 31), $f0));
    }
  } while (!(ok));
  $r0 = (await SaveToSlot(letter, rS($f0), rS($f0 + 31)));
  S.sp = $sp;
  return $r0;
}

export async function QuitToDos(askSave: boolean) {
  if ((await MenuCore.YesNoMenu("Exit to DOS? ", 14, 10, 15)) === 89) {
    if ((!askSave || (U8[229634] !== 0)) || (r32(229639) === 0)) {
      (await GameIo.ExitGame());
    } else if ((await MenuCore.YesNoMenu("Save first? ", 14, 10, 15)) === 78) {
      (await GameIo.ExitGame());
    } else if ((await SaveGame())) {
      (await GameIo.ExitGame());
    }
  }
  TextRend.ClearBottomLine();
}

export async function QuickSave() {
  if ((await SaveToSlot(90, "QUICK SAVE", AreaName.CurrentArea()))) {
    (await TextRend.DisplayAndPause(10, "Quick save done."));
    TextRend.ClearBottomLine();
  }
}

export function QuickLoadable() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let ioRes: number = 0, recovered: boolean = false, $r0: boolean = false;
  $r0 = false;
  recovered = SaveMenu.RecoverSlot(90);
  if (FileUtil.OpenReadOnly($f0, SaveMenu.SlotFile(90, ".dat"))) {
    $r0 = (rt.FileSize($f0) >= SaveMinSize()) && (rt.IOResult() === 0);
    rt.Close($f0);
  }
  ioRes = rt.IOResult() << 16 >> 16;
  S.sp = $sp;
  return $r0;
}

export async function QuickLoad() {
  if (!QuickLoadable()) {
    (await TextRend.DisplayAndPause(14, "There is no quick save."));
    TextRend.ClearBottomLine();
    U8[227107] = 1;
    return;
  }
  FreeParty();
  (await LoadSlot(90));
  U8[227107] = 1;
  U8[227108] = 1;
}

export function AddCharToParty(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let p: number = 0;
  U8[creature + 191] = 255;
  if (r32(229639) === 0) {
    w32(229639, creature);
  } else {
    w32(Party.LastCreature() + 260, creature);
  }
  rt.fill($f0, 8, 0);
  p = r32(229639);
  while (p !== 0) {
    let $t2;
    if (($t2 = U8[p + 191], ($t2 >= 0 && $t2 <= 7))) {
      U8[$f0 + U8[p + 191]] = 1;
    }
    p = r32(p + 260);
  }
  w32(229635, creature);
  {
    const $w3 = r32(229635);
    U8[$w3 + 191] = 0;
    while ((U8[$w3 + 191] < 8) && (U8[$f0 + U8[$w3 + 191]] !== 0)) {
      U8[$w3 + 191] = U8[$w3 + 191] + 1;
    }
  }
  let $t5;
  $t5 = r32(227037) + 1660, w16($t5, r16($t5) + 1);
  ClassCal.RecalcBaseSkills(creature);
  S.sp = $sp;
}

export async function CheckFileElseQuit(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let ch: number = 0, saving: boolean = false, x: number = 0, y: number = 0, disk: number = 0;
  if (FileUtil.Exists(name_)) {
    { S.sp = $sp; return; }
  }
  wS($f0, 40, "Save and exit  Insert disk #" + StrUtil.NumStr(U8[229120]));
  do {
    ch = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, false, false, $f0 + 41)) & 255;
    saving = !(U8[$f0 + 41] !== 0) && (ch === 83);
    if (saving) {
      x = I8[231432];
      y = I8[231433];
      disk = U8[229120];
      U8[231432] = I8[231432] - I8[U8[231434] + 218813];
      U8[231433] = I8[231433] - I8[U8[231434] + 218822];
      View3D.WrapCoords(231432, 231433);
      DaxIo.PopState();
      if ((await SaveGame())) {
        (await GameIo.ExitGame());
      }
      U8[231432] = x;
      U8[231433] = y;
      U8[229120] = disk;
      (await CharDisp.DisplayNoncombatInterface());
    }
  } while (!(!saving));
  S.sp = $sp;
}

export function FreeCreature(creature: number) {
  let holdE: number = 0, effect: number = 0;
  {
    const $w1 = creature;
    if (r32($w1 + 264) !== 0) {
      rt.freeMem(r32($w1 + 264));
    }
    CharHlp.FreeItemList($w1 + 200);
    effect = r32($w1 + 127);
    while (effect !== 0) {
      holdE = effect;
      effect = r32(effect + 5);
      rt.freeMem(holdE);
    }
  }
  UsualSpl.ForgetUsualSpells(creature);
  Stats.Forget(creature);
  rt.freeMem(creature);
}

export function RemoveCreature(suppressSizeDec: boolean, freeAnim: boolean) {
  let prev: number = 0, removed: number = 0;
  if (r32(229639) === 0) {
    return;
  }
  removed = r32(229635);
  prev = r32(229639);
  if (prev !== r32(229635)) {
    while ((r32(prev + 260) !== r32(229635)) && (r32(prev + 260) !== 0)) {
      prev = r32(prev + 260);
    }
    if (r32(prev + 260) !== 0) {
      if (freeAnim) {
        MapTiles.FreeIconAnim(U8[r32(229635) + 191]);
      }
      w32(prev + 260, r32(r32(229635) + 260));
      FreeCreature(r32(229635));
      w32(229635, prev);
      if (!suppressSizeDec) {
        let $t2;
        $t2 = r32(227037) + 1660, w16($t2, r16($t2) - 1);
      }
    }
  } else {
    if (freeAnim) {
      MapTiles.FreeIconAnim(U8[r32(229635) + 191]);
    }
    w32(229639, r32(r32(229635) + 260));
    prev = r32(r32(229635) + 260);
    FreeCreature(r32(229635));
    w32(229635, prev);
    if (!suppressSizeDec) {
      let $t3;
      $t3 = r32(227037) + 1660, w16($t3, r16($t3) - 1);
    }
  }
  if ((r32(229635) !== removed) && (r32(229643) === removed)) {
    w32(229643, r32(229635));
  }
}

export function FreeParty() {
  while (r32(229639) !== 0) {
    w32(229635, r32(229639));
    RemoveCreature(false, true);
  }
  w32(229635, 0);
}

export async function RewriteSaveFile(f: number, name_: string) {
  let opened: boolean = false, $r0: boolean = false;
  do {
    opened = FileUtil.RewriteTemp(f, name_);
  } while (!(opened || !(await SaveMenu.AskSaveDisk("Cannot write", name_))));
  $r0 = opened;
  return $r0;
}

export function CharFileName(name_: string) {
  let $r0: string = "";
  $r0 = DaxIo.SanitizeFileName(name_);
  return $r0;
}

export function CharFileBase(name_: string) {
  let $r0: string = "";
  $r0 = rS(229121) + CharFileName(name_);
  return $r0;
}

export async function WriteCharFiles(s: number, creature: number, base: string, ext: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 817);
  let item: number = 0, effect: number = 0, $r0: boolean = false;
  U8[$f0 + 8] = (await RewriteSaveFile($f0, rS(s) + base + ext)) ? 1 : 0;
  mv($f0 + 9, creature, 378);
  w32($f0 + 136, 0);
  w32($f0 + 209, 0);
  w32($f0 + 269, 0);
  w32($f0 + 273, 0);
  rt.fill($f0 + 213, 52, 0);
  DiskRec.CharToDisk($f0 + 9, $f0 + 460);
  if ((U8[$f0 + 8] !== 0)) {
    FileUtil.WriteChecked($f0, $f0 + 460, 285, $f0 + 8);
    U8[$f0 + 8] = FileUtil.CloseTemp($f0, rS(s) + base + ext, (U8[$f0 + 8] !== 0)) ? 1 : 0;
    if ((U8[$f0 + 8] !== 0)) {
      FileUtil.AddToSet(s, base + ext, true);
    }
  }
  if ((U8[$f0 + 8] !== 0)) {
    if (r32(creature + 200) === 0) {
      FileUtil.AddToSet(s, base + ".itm", false);
    } else {
      U8[$f0 + 8] = FileUtil.RewriteTemp($f0, rS(s) + base + ".itm") ? 1 : 0;
      if ((U8[$f0 + 8] !== 0)) {
        item = r32(creature + 200);
        while ((U8[$f0 + 8] !== 0) && (item !== 0)) {
          mv($f0 + 387, item, 64);
          w32($f0 + 429, 0);
          DiskRec.ItemToDisk($f0 + 387, $f0 + 745);
          FileUtil.WriteChecked($f0, $f0 + 745, 63, $f0 + 8);
          item = r32(item + 42);
        }
        U8[$f0 + 8] = FileUtil.CloseTemp($f0, rS(s) + base + ".itm", (U8[$f0 + 8] !== 0)) ? 1 : 0;
        if ((U8[$f0 + 8] !== 0)) {
          FileUtil.AddToSet(s, base + ".itm", true);
        }
      }
    }
  }
  if ((U8[$f0 + 8] !== 0)) {
    if (r32(creature + 127) === 0) {
      FileUtil.AddToSet(s, base + ".spc", false);
    } else {
      U8[$f0 + 8] = FileUtil.RewriteTemp($f0, rS(s) + base + ".spc") ? 1 : 0;
      if ((U8[$f0 + 8] !== 0)) {
        effect = r32(creature + 127);
        while ((U8[$f0 + 8] !== 0) && (effect !== 0)) {
          mv($f0 + 451, effect, 9);
          w32($f0 + 456, 0);
          DiskRec.EffectToDisk($f0 + 451, $f0 + 808);
          FileUtil.WriteChecked($f0, $f0 + 808, 9, $f0 + 8);
          effect = r32(effect + 5);
        }
        U8[$f0 + 8] = FileUtil.CloseTemp($f0, rS(s) + base + ".spc", (U8[$f0 + 8] !== 0)) ? 1 : 0;
        if ((U8[$f0 + 8] !== 0)) {
          FileUtil.AddToSet(s, base + ".spc", true);
        }
      }
    }
  }
  $r0 = (((U8[$f0 + 8] !== 0) && UsualSpl.WriteUsualSpells(s, creature, base)) && Stats.WriteChar(s, creature, base)) && CharExt.WriteExt(s, creature, base);
  S.sp = $sp;
  return $r0;
}

export function RecoverChar(name_: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1028);
  let $r0: boolean = false;
  FileUtil.NewSet($f0, rS(229121));
  SaveMenu.RemoveCharFiles($f0, CharFileName(name_), ".cha");
  $r0 = FileUtil.RecoverSet($f0);
  S.sp = $sp;
  return $r0;
}

export function CommitWhole(s: number, ok: boolean) {
  let $r0: boolean = false;
  if (ok) {
    ok = FileUtil.CommitSet(s);
  } else {
    FileUtil.DropSet(s);
  }
  $r0 = ok;
  return $r0;
}

export function SaveMinSize() {
  let $r0: number = 0;
  $r0 = 13137;
  return $r0;
}

export async function LoadSlot(letter: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 593);
  let i: number = 0, creature: number = 0, res: number = 0, found: boolean = false;
  found = SaveMenu.RecoverSlot(letter);
  found = (await DaxIo.OpenWithRetry(SaveMenu.SlotFile(letter, ".dat"), SaveMenu.SaveDiskMsg(), true, false, $f0 + 328));
  TextRend.ClearBottomLine();
  if (found) {
    found = ((rt.IOResult() === 0) && (rt.FileSize($f0 + 328) >= SaveMinSize())) && (rt.IOResult() === 0);
    if (!found) {
      rt.Close($f0 + 328);
    }
    res = rt.IOResult() & 65535;
  }
  if (!found) {
    (await TextRend.DisplayAndPause(14, "Save game " + String.fromCharCode(letter) + " is damaged."));
    TextRend.ClearBottomLine();
    { S.sp = $sp; return; }
  }
  TextRend.DisplayString(0, 24, 10, "Loading...Please Wait");
  res = rt.BlockRead($f0 + 328, 229120, 1, true) & 65535;
  let $t1;
  if (!($t1 = U8[229120], ($t1 >= 1 && $t1 <= 8))) {
    U8[229120] = 1;
  }
  res = rt.BlockRead($f0 + 328, r32(227033), 2048, true) & 65535;
  res = rt.BlockRead($f0 + 328, r32(227037), 2048, true) & 65535;
  res = rt.BlockRead($f0 + 328, r32(227041), 1024, true) & 65535;
  rt.Seek($f0 + 328, rt.FilePos($f0 + 328) + 7680);
  res = rt.BlockRead($f0 + 328, 231432, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, 231433, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, 231434, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, 231435, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, 231436, 1, true) & 65535;
  U8[231434] = U8[231434] & 6;
  res = rt.BlockRead($f0 + 328, 227109, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, 227062, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, $f0 + 592, 1, true) & 65535;
  res = rt.BlockRead($f0 + 328, $f0, 328, true) & 65535;
  rt.Close($f0 + 328);
  res = rt.IOResult() & 65535;
  (await Vault.RestoreFromSlot(letter));
  Stats.ReadGame(SaveMenu.SlotFile(letter, ".sts"));
  Explored.ReadSlot(SaveMenu.SlotFile(letter, ".map"));
  MapNotes.ReadSlot(SaveMenu.SlotFile(letter, ".nts"));
  JrnlSeen.ReadSlot(SaveMenu.SlotFile(letter, ".jnl"));
  if (U8[$f0 + 592] > 8) {
    U8[$f0 + 592] = 8;
  }
  for (let $i2 = 1, $e2 = U8[$f0 + 592]; $i2 <= $e2; $i2++) {
    i = $i2;
    found = StrUtil.FitLength($f0 + i * 41 - 41, 40);
  }
  w16(r32(227037) + 1660, 0);
  for (let $i3 = 1, $e3 = U8[$f0 + 592]; $i3 <= $e3; $i3++) {
    i = $i3;
    wS($f0 + 336, 255, CharFileName(rS($f0 + i * 41 - 41)));
    if (FileUtil.Exists(rS(229121) + rS($f0 + 336) + ".sav")) {
      creature = rt.getMem(378);
      if ((await LoadChar(rS($f0 + 336), creature, true))) {
        AddCharToParty(creature);
      } else {
        rt.freeMem(creature);
      }
      (await SaveMenu.CheckSaveDir());
    }
  }
  w32(229635, r32(229639));
  while (r32(229635) !== 0) {
    (await LoadCharIconAnim(true));
    w32(229635, r32(r32(229635) + 260));
  }
  w32(229635, r32(229639));
  U8[229120] = r16(r32(227037) + 1572) & 255;
  let $t5;
  if (!($t5 = U8[229120], ($t5 >= 1 && $t5 <= 8))) {
    U8[229120] = 1;
  }
  if (U8[227109] < 2) {
    (await View3D.Load3DMap(U8[r32(227033) + 394]));
  }
  if (U8[227109] > 1) {
    (await MapTiles.LoadIconAnim("ICON", 0, 11));
  } else {
    for (let $i6 = 1; $i6 <= 3; $i6++) {
      i = $i6;
      w16(i * 4 + 231433, r16(r32(227033) + (19193 + i) * 2 - 37376));
      w16(i * 4 + 231435, r16(r32(227033) + (19196 + i) * 2 - 37376));
      if (ri16(i * 4 + 231433) >= 0) {
        (await View3D.LoadWallSet(ri16(i * 4 + 231433), ri16(i * 4 + 231435)));
      }
    }
  }
  w16(r32(227033) + 1022, 0);
  if (r16(r32(227033) + 836) !== 0) {
    (await Ending.YarashComplete(false));
  }
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export async function SaveToSlot(letter: number, desc: string, area: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1642);
  let n: number = 0, p: number = 0, opened: boolean = false, $r0: boolean = false;
  $r0 = false;
  if ((U8[227098] !== 0)) {
    { S.sp = $sp; return $r0; }
  }
  Dos.GetDate($f0 + 1634, $f0 + 1636, $f0 + 1638, $f0 + 1640);
  w16(r32(227033) + 484, U8[232633]);
  rt.fill($f0, 328, 0);
  (await SaveMenu.CheckSaveDir());
  FileUtil.NewSet($f0 + 328, rS(229121));
  wS($f0 + 1377, 255, SaveMenu.SlotFile(letter, ".dat"));
  opened = (await RewriteSaveFile($f0 + 1356, rS($f0 + 1377)));
  U8[$f0 + 1633] = opened ? 1 : 0;
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, 10, "Saving...Please Wait");
  mv($f0 + 1365, r32(227033) + 1012, 12);
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    n = $i1;
    w16(r32(227033) + (19193 + n) * 2 - 37376, ri16(n * 4 + 231433));
    w16(r32(227033) + (19196 + n) * 2 - 37376, ri16(n * 4 + 231435));
  }
  w16(r32(227033) + 504, U8[227049]);
  w16(r32(227033) + 510, (((1 - U8[227066]) * 4) + ((U8[227063] * U8[227065]) * 2)) + (U8[227063] * U8[227064]));
  w16(r32(227037) + 1572, U8[229120]);
  FileUtil.WriteChecked($f0 + 1356, 229120, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, r32(227033), 2048, $f0 + 1633);
  mv(r32(227033) + 1012, $f0 + 1365, 12);
  FileUtil.WriteChecked($f0 + 1356, r32(227037), 2048, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, r32(227041), 1024, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, r32(227045), 7680, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 231432, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 231433, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 231434, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 231435, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 231436, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 227109, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, 227062, 1, $f0 + 1633);
  U8[$f0 + 1364] = 0;
  p = r32(229639);
  while ((p !== 0) && (U8[$f0 + 1364] < 8)) {
    U8[$f0 + 1364] = U8[$f0 + 1364] + 1;
    wS($f0 + U8[$f0 + 1364] * 41 - 41, 40, SaveMenu.MemberName(letter, U8[$f0 + 1364]));
    p = r32(p + 260);
  }
  FileUtil.WriteChecked($f0 + 1356, $f0 + 1364, 1, $f0 + 1633);
  FileUtil.WriteChecked($f0 + 1356, $f0, 328, $f0 + 1633);
  if (opened) {
    U8[$f0 + 1633] = FileUtil.CloseTemp($f0 + 1356, rS($f0 + 1377), (U8[$f0 + 1633] !== 0)) ? 1 : 0;
  }
  if ((U8[$f0 + 1633] !== 0)) {
    FileUtil.AddToSet($f0 + 328, SaveMenu.SlotName(letter, ".dat"), true);
  }
  p = r32(229639);
  for (let $i3 = 1; $i3 <= 8; $i3++) {
    n = $i3;
    if (n <= U8[$f0 + 1364]) {
      U8[$f0 + 1633] = (U8[$f0 + 1633] !== 0) && (await WriteCharFiles($f0 + 328, p, SaveMenu.MemberName(letter, n), ".sav")) ? 1 : 0;
      p = r32(p + 260);
    } else {
      SaveMenu.RemoveCharFiles($f0 + 328, SaveMenu.MemberName(letter, n), ".sav");
    }
  }
  U8[$f0 + 1633] = ((((((U8[$f0 + 1633] !== 0) && SaveMenu.WriteSlotInfo($f0 + 328, letter, desc, area)) && Stats.WriteGame($f0 + 328, SaveMenu.SlotName(letter, ".sts"))) && Explored.WriteSlot($f0 + 328, SaveMenu.SlotName(letter, ".map"))) && MapNotes.WriteSlot($f0 + 328, SaveMenu.SlotName(letter, ".nts"))) && JrnlSeen.WriteSlot($f0 + 328, SaveMenu.SlotName(letter, ".jnl"))) && Vault.AddToSave($f0 + 328, letter) ? 1 : 0;
  U8[$f0 + 1633] = CommitWhole($f0 + 328, (U8[$f0 + 1633] !== 0)) ? 1 : 0;
  BeastFil.Flush();
  TextRend.ClearBottomLine();
  if ((U8[$f0 + 1633] !== 0)) {
    U8[229634] = 1;
  } else {
    (await TextRend.DisplayAndPause(14, "The game was not saved."));
    TextRend.ClearBottomLine();
  }
  $r0 = (U8[$f0 + 1633] !== 0);
  S.sp = $sp;
  return $r0;
}
