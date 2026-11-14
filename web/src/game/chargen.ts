// Generated from src/chargen.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as SaveLoad from './saveload';
import * as ViewChar from './viewchar';
import * as Border from './border';
import * as C_CLASS from './c_class';
import * as C_LEVEL from './c_level';
import * as C_RACE from './c_race';
import * as C_SPELL from './c_spell';
import * as C_KEYS from './c_keys';
import * as C_EFFECT from './c_effect';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_GBVM from './c_gbvm';
import * as C_STAT from './c_stat';
import * as C_MONEY from './c_money';
import * as Money from './money';
import * as C_ALIGN from './c_align';
import * as Options from './options';
import * as Blit from './blit';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as ClassCal from './classcal';
import * as DaxIo from './daxio';
import * as FxEngine from './fxengine';
import * as MapTiles from './maptiles';
import * as MenuCore from './menucore';
import * as Portrait from './portrait';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as MoneyCal from './moneycal';
import * as Party from './party';
import * as Magic from './magic';
import * as C_MSG from './c_msg';
import * as Dice from './dice';
import * as VidOps from './vidops';
import * as ChgClass from './chgclass';
import * as PartyMnu from './partymnu';
import * as CharExt from './charext';
import * as C_DEMO from './c_demo';
import * as Demo from './demo';
import * as TpRand from './tprand';

export const RACE_SPLIT_COL = 17;
export const RACE_TOP_BOTTOM = 8;
export const RACE_LIST_ROW = 2;

export const $at = { raceAbilityAdj: 253845, stingMode: 253887, ageThresholds: 253888, startingGoldClass: 253958 };

export async function MainMenu(inGame: boolean, anywhere: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 46);
  let ch: number = 0, redraw: boolean = false, saved: boolean = false, atHall: boolean = false, top_: number = 0;
  U8[143234] = 3;
  redraw = true;
  U8[253887] = 0;
  U8[$f0 + 4] = 0;
  if (anywhere) {
    U8[$f0 + 4] = 10;
  }
  U8[240460] = inGame ? 1 : 0;
  U8[141176] = 0;
  while (true) {
    if (redraw) {
      (await Border.DrawWindow(1, 1, 38, 22, 0, 0, ""));
      atHall = (CharHlp.HallMask() > 0) || (U8[253887] !== 0);
      PartyMnu.OfferedCmds(r32(143749) !== 0, atHall, inGame, anywhere, $f0 + 2);
      top_ = 10;
      if (r32(143749) !== 0) {
        (await CharDisp.DisplayParty(r32(143749)));
        top_ = PartyMnu.MenuTop(r16(r32(141151) + 1660)) & 255;
      }
      if (inGame) {
        if (!rt.inM($f0 + 2, 0, 2, U8[$f0 + 4])) {
          U8[$f0 + 4] = PartyMnu.StepCmd(rt.rSet($f0 + 2, 0, 2), U8[$f0 + 4], 1);
        }
        PartyMnu.Draw(rt.rSet($f0 + 2, 0, 2), top_, U8[$f0 + 4]);
      } else {
        PartyMnu.DrawList(rt.rSet($f0 + 2, 0, 2));
      }
      redraw = false;
    }
    if (inGame) {
      ch = (await PartyMnu.ChooseCmd(rt.rSet($f0 + 2, 0, 2), top_, $f0 + 4, $f0)) & 255;
    } else {
      ch = (await PartyMnu.ChooseListed(rt.rSet($f0 + 2, 0, 2), (r32(143753) === 0) && Demo.Available(), $f0)) & 255;
    }
    TextRend.ClearBottomLine();
    if ((U8[$f0] !== 0)) {
      if ((ch === 71 || ch === 79) || (!inGame && (ch === 72 || ch === 80))) {
        Party.SelectPrevNextChar(ch);
        (await CharDisp.DisplayParty(r32(143749)));
      } else if ((await ViewChar.AltItems(ch))) {
        (await CharDisp.DisplayNoncombatInterface());
        redraw = true;
      }
    } else if (ch === 33) {
      U8[141212] = true ? 1 : 0;
      { S.sp = $sp; return; }
    } else {
      if (!(ch === 69 || ch === 83 || ch === 71 || ch === 74)) {
        U8[143748] = 0;
      }
      switch (ch) {
        case 67: {
          (await CreateCharacterMenu());
          break;
        }
        case 68: {
          (await DropCharacterMenu());
          break;
        }
        case 77: {
          (await ModifyCharacterMenu());
          break;
        }
        case 84: {
          (await TrainingMenu());
          break;
        }
        case 85: {
          wS($f0 + 5, 40, ChgClass.Refusal(r32(143749), atHall));
          if (rS($f0 + 5) !== "") {
            (await TextRend.FlashBottomLine(14, rS($f0 + 5)));
          } else {
            (await ChgClass.ChangeClassMenu(U8[253887] !== 0));
          }
          break;
        }
        case 86: {
          (await ViewChar.ViewCharMenu($f0 + 1));
          break;
        }
        case 65: {
          (await AddCharacterMenu());
          break;
        }
        case 82: {
          if (r32(143749) !== 0) {
            if ((await SaveLoad.SaveChar(r32(143749), ""))) {
              SaveLoad.RemoveCreature(false, true);
            }
          }
          break;
        }
        case 76: {
          (await SaveLoad.LoadGame());
          if (U8[141176] !== 0) {
            U8[141221] = 1;
            { S.sp = $sp; return; }
          }
          break;
        }
        case 83: {
          if (r32(143753) !== 0) {
            saved = (await SaveLoad.SaveGame());
          }
          break;
        }
        case 66: {
          if (r32(143753) !== 0) {
            U8[141176] = 4;
            TextRend.ClearBottomLine();
            { S.sp = $sp; return; }
          }
          break;
        }
        case 71: {
          (await Options.OptionsMenu());
          break;
        }
        case 69: {
          if (anywhere) {
            { S.sp = $sp; return; }
          } else {
            (await SaveLoad.QuitToDos(true));
          }
          break;
        }
        case 74: {
          if ((U8[141208] !== 0)) {
            U8[253887] = (U8[253887] === 0 ? 1 : 0);
            if (U8[253887] !== 0) {
              (await CharDisp.PrintBottomLine("Free training on"));
            } else {
              (await CharDisp.PrintBottomLine("Free training off"));
            }
          }
          break;
        }
      }
      redraw = true;
    }
  }
  S.sp = $sp;
}

export async function TrainAnywhere() {
  let savedDisk: number = 0, savedIfc: number = 0, savedChoice: number = 0, savedHall: boolean = false;
  savedDisk = U8[143234];
  savedIfc = U8[141176];
  savedChoice = U8[145643];
  savedHall = (U8[240460] !== 0);
  U8[141190] = true ? 1 : 0;
  (await MainMenu(true, true));
  U8[141190] = false ? 1 : 0;
  U8[143234] = savedDisk;
  U8[141176] = savedIfc;
  U8[145643] = savedChoice;
  U8[240460] = savedHall ? 1 : 0;
  TextRend.ClearBottomLine();
}

export async function CustomizeIcon() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 115);
  let key: number = 0, done: boolean = false, cur: number = 0, i: number = 0, j: number = 0, savedChoice: number = 0, savedHead: number = 0, savedBody: number = 0, savedSize: number = 0, tSize: number = 0, inGrid: boolean = false, which: number = 0, pick: number = 0;
  async function PartPic(kind: number, id: number, frame: number) {
    let block: number = 0, $r1: number = 0;
    $r1 = 0;
    if ((kind > 1) || (frame > 1)) {
      return $r1;
    }
    if (id >= U8[kind + 254181]) {
      return $r1;
    }
    block = (id + (frame * 128)) & 255;
    if (tSize === 2) {
      block = (block + 64) & 255;
    }
    if (U8[$f0 + kind * 2 + frame + 31] !== block) {
      DaxIo.PushState(3);
      (await Blit.LoadPic(rS(kind * 6 + 254169), block, true, 0, $f0 + kind * 8 + frame * 4 + 15));
      DaxIo.PopState();
      U8[$f0 + kind * 2 + frame + 31] = block;
    }
    $r1 = r32($f0 + kind * 8 + frame * 4 + 15);
    return $r1;
  }
  function Merge(src: number) {
    if (VidOps.CanMerge(src, r32($f0 + 35))) {
      VidOps.MergePic(src, r32($f0 + 35));
      mv(r32($f0 + 35) + 9, src + 9, 8);
    }
  }
  async function BuildIcon(frame: number, h: number, b: number, c: number) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 16);
    let k: number = 0;
    if ((r32($f0 + 35) === 0) || (frame > 1)) {
      { S.sp = $sp; return; }
    }
    if (r32(r32($f0 + 35) + 19) === 0) {
      { S.sp = $sp; return; }
    }
    Blit.ClearPic(r32($f0 + 35));
    Merge((await PartPic(1, b, frame)));
    Merge((await PartPic(0, h, frame)));
    for (let $i1 = 0; $i1 <= 15; $i1++) {
      k = $i1;
      U8[$f1 + k] = k;
    }
    for (let $i2 = 1; $i2 <= 6; $i2++) {
      k = $i2;
      U8[$f1 + (U8[k + 140258] & 15)] = U8[c + k - 1] & 15;
      U8[$f1 + ((U8[k + 140258] + 8) & 15)] = U8[c + k - 1] >>> 4;
    }
    (await VidOps.RecolorPic($f1, r32($f0 + 35)));
    S.sp = $sp;
  }
  function Place(src: number, frame: number, boxed: boolean, dst: number) {
    if (dst === 0) {
      return;
    }
    if (boxed && (Blit.ColourCount() < 16)) {
      rt.fill(dst + 27, r16(dst + 17), U8[Blit.SrcNibble(3, 132845) + 131918]);
    } else {
      rt.fill(dst + 27, r16(dst + 17), 0);
    }
    if (boxed && (Blit.ColourCount() === 16)) {
      if (frame === 0) {
        VidOps.OverlayPic(r32(143999), dst);
      } else {
        VidOps.OverlayPic(r32(144003), dst);
      }
    }
    VidOps.OverlayPic(src, dst);
  }
  async function Compose(frame: number, h: number, b: number, c: number, dst: number) {
    (await BuildIcon(frame, h, b, c));
    Place(r32($f0 + 35), frame, true, dst);
  }
  function OptionCount() {
    let $r1: number = 0;
    switch (cur) {
      case 0: {
        $r1 = 14;
        break;
      }
      case 1: {
        $r1 = 32;
        break;
      }
      default: {
        $r1 = 16;
      }
    }
    return $r1;
  }
  function PageSize(first: number) {
    let n: number = 0, $r1: number = 0;
    n = OptionCount() & 255;
    if (n <= 16) {
      $r1 = n;
    } else if (first === 0) {
      $r1 = 12;
    } else if ((n - first) <= 12) {
      $r1 = (n - first) & 255;
    } else {
      $r1 = 8;
    }
    return $r1;
  }
  function PageFirst(v: number) {
    let first: number = 0, $r1: number = 0;
    first = 0;
    while ((first < OptionCount()) && (v >= (first + PageSize(first)))) {
      first = (first + PageSize(first)) & 255;
    }
    $r1 = first;
    return $r1;
  }
  function CellOf(v: number) {
    let first: number = 0, $r1: number = 0;
    first = PageFirst(v) & 255;
    if (first > 0) {
      $r1 = ((v - first) + 4) & 255;
    } else {
      $r1 = (v - first) & 255;
    }
    return $r1;
  }
  function PartNibble() {
    let $r1: number = 0;
    $r1 = 0;
    if ((cur >= 3) && (cur <= 9)) {
      if (U8[cur + 254151] === 2) {
        $r1 = which;
      } else {
        $r1 = U8[cur + 254151];
      }
    }
    return $r1;
  }
  function OptionState(opt: number, h: number, b: number, c: number) {
    let slot: number = 0;
    switch (cur) {
      case 0: {
        U8[h] = opt;
        break;
      }
      case 1: {
        U8[b] = opt;
        break;
      }
      case 3: case 4: case 5: case 6: case 7: case 8: case 9: {
        slot = U8[cur + 254144];
        if (PartNibble() === 0) {
          U8[c + slot - 1] = (U8[c + slot - 1] & 240) | (opt & 15);
        } else {
          U8[c + slot - 1] = (U8[c + slot - 1] & 15) | ((opt & 15) << 4);
        }
        break;
      }
    }
  }
  function CurrentOption() {
    let v: number = 0, $r1: number = 0;
    switch (cur) {
      case 0: {
        v = U8[$f0 + 7];
        break;
      }
      case 1: {
        v = U8[$f0 + 8];
        break;
      }
      default: {
        if (PartNibble() === 0) {
          v = U8[$f0 + U8[cur + 254144] + 8] & 15;
        } else {
          v = U8[$f0 + U8[cur + 254144] + 8] >>> 4;
        }
      }
    }
    if (v >= OptionCount()) {
      v = 0;
    }
    $r1 = v;
    return $r1;
  }
  function Counter(v: number, count: number) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 41);
    let $r1: string = "";
    if (v < count) {
      wS($f1, 40, StrUtil.NumStr(v + 1));
    } else {
      wS($f1, 40, "?");
    }
    wS($f1, 40, rS($f1) + "/" + StrUtil.NumStr(count));
    while (U8[$f1] < 5) {
      wS($f1, 40, rS($f1) + " ");
    }
    $r1 = rS($f1);
    S.sp = $sp;
    return $r1;
  }
  function DrawItem(k: number) {
    let col: number = 0, d1: number = 0, d2: number = 0;
    if (k > 9) {
      return;
    }
    if (k === cur) {
      col = 15;
    } else {
      col = 10;
    }
    TextRend.DisplayString(U8[k + 254127], U8[k + 254137], col, rS(k * 7 + 254057));
    switch (k) {
      case 0: {
        TextRend.DisplayString(10, U8[k + 254137], col, Counter(U8[$f0 + 7], 14));
        break;
      }
      case 1: {
        TextRend.DisplayString(10, U8[k + 254137], col, Counter(U8[$f0 + 8], 32));
        break;
      }
      case 2: {
        if (tSize === 1) {
          TextRend.DisplayString(10, U8[k + 254137], col, "Small");
        } else {
          TextRend.DisplayString(10, U8[k + 254137], col, "Large");
        }
        break;
      }
      case 3: case 4: case 5: case 6: case 7: case 8: case 9: {
        if (U8[k + 254151] === 2) {
          d1 = col;
          d2 = col;
          if (inGrid && (k === cur)) {
            if (which === 0) {
              d2 = 10;
            } else {
              d1 = 10;
            }
          }
          TextRend.DisplayString(11, U8[k + 254137], d1, "1");
          TextRend.DisplayString(13, U8[k + 254137], d2, "2");
        }
        break;
      }
    }
  }
  async function ShowCell(k: number, boxed: boolean) {
    if ((k > 15) || (r32($f0 + k * 4 + 39) === 0)) {
      return;
    }
    Place(r32($f0 + k * 4 + 39), 0, boxed, r32($f0 + 111));
    (await Blit.ShowPic(U8[(k % 4) + 254161], U8[Math.trunc(k / 4) + 254165], r32($f0 + 111)));
  }
  async function DrawGrid() {
    const $sp = S.sp, $f1 = (S.sp = $sp - 8);
    let k: number = 0, opt: number = 0, first: number = 0, top_: number = 0, moreBelow: boolean = false;
    first = PageFirst(pick) & 255;
    if (first > 0) {
      top_ = 4;
    } else {
      top_ = 0;
    }
    moreBelow = (first + PageSize(first)) < OptionCount();
    if (OptionCount() > 16) {
      (await Border.ClearBox(18, U8[254165], 38, U8[254168] + 2));
    }
    for (let $i5 = 0; $i5 <= 15; $i5++) {
      k = $i5;
      opt = (first + k) - top_;
      if (((k < 4) && (top_ > 0)) || ((k >= 12) && moreBelow)) {
        if ((k % 4) === 0) {
          TextRend.DisplayString(25, U8[Math.trunc(k / 4) + 254165] + 1, 10, "(more)");
        }
      } else if (opt < (first + PageSize(first))) {
        U8[$f1] = U8[$f0 + 7];
        U8[$f1 + 1] = U8[$f0 + 8];
        mv($f1 + 2, $f0 + 9, 6);
        OptionState(opt, $f1, $f1 + 1, $f1 + 2);
        (await BuildIcon(0, U8[$f1], U8[$f1 + 1], $f1 + 2));
        if (((((r32($f0 + k * 4 + 39) !== 0) && (r32($f0 + 35) !== 0)) && (r16(r32($f0 + k * 4 + 39) + 17) === r16(r32($f0 + 35) + 17))) && (r32(r32($f0 + k * 4 + 39) + 19) !== 0)) && (r32(r32($f0 + 35) + 19) !== 0)) {
          mv(r32($f0 + k * 4 + 39) + 27, r32($f0 + 35) + 27, r16(r32($f0 + 35) + 17));
          mv(r32(r32($f0 + k * 4 + 39) + 19), r32(r32($f0 + 35) + 19), Blit.MaskBytes(r16(r32($f0 + 35) + 17)));
        }
        (await ShowCell(k, opt === pick));
      } else {
        (await Border.ClearBox(U8[(k % 4) + 254161], U8[Math.trunc(k / 4) + 254165], U8[(k % 4) + 254161] + 2, U8[Math.trunc(k / 4) + 254165] + 2));
      }
    }
    S.sp = $sp;
  }
  async function ShowPreviews() {
    if (inGrid) {
      Place(r32($f0 + CellOf(pick) * 4 + 39), 0, true, r32($f0 + 103));
    } else {
      (await Compose(0, U8[$f0 + 7], U8[$f0 + 8], $f0 + 9, r32($f0 + 103)));
    }
    (await Blit.ShowPic(3, 3, r32($f0 + 103)));
    (await Compose(1, U8[$f0 + 7], U8[$f0 + 8], $f0 + 9, r32($f0 + 107)));
    (await Blit.ShowPic(10, 3, r32($f0 + 107)));
  }
  function MsgLine(row: number, s: string) {
    TextRend.DisplayCentered(18, 38, row, 10, s);
  }
  async function ShowMessage() {
    let top_: number = 0;
    (await Border.ClearBox(18, 18, 38, 22));
    if (!inGrid) {
      return;
    }
    if (((cur >= 3) && (cur <= 9)) && (U8[cur + 254151] === 2)) {
      top_ = 18;
    } else {
      top_ = 19;
    }
    if (cur >= 3) {
      MsgLine(top_, "Choosing " + rS(cur * 7 + 254057) + " color");
    } else {
      MsgLine(top_, "Choosing " + rS(cur * 7 + 254057));
    }
    MsgLine(top_ + 1, "Arrows to select,");
    MsgLine(top_ + 2, "Enter to choose");
    if (top_ === 18) {
      MsgLine(top_ + 3, "Space toggles");
      MsgLine(top_ + 4, "color 1/2");
    }
  }
  function Revert() {
    {
      const $w6 = r32(143749);
      U8[$f0 + 7] = U8[$w6 + 189];
      U8[$f0 + 8] = U8[$w6 + 190];
      if (U8[$w6 + 192] === 1) {
        tSize = 1;
      } else {
        tSize = 2;
      }
      mv($f0 + 9, $w6 + 193, 6);
    }
  }
  function MovePick(arrow: number) {
    let n: number = 0, v: number = 0;
    n = OptionCount() << 16 >> 16;
    v = pick;
    switch (arrow) {
      case 75: {
        if (v > 0) {
          v = (v - 1) << 16 >> 16;
        } else {
          v = (n - 1) << 16 >> 16;
        }
        break;
      }
      case 77: {
        if (v < (n - 1)) {
          v = (v + 1) << 16 >> 16;
        } else {
          v = 0;
        }
        break;
      }
      case 80: {
        if ((v + 4) < n) {
          v = (v + 4) << 16 >> 16;
        } else if (Math.trunc(v / 4) < Math.trunc((n - 1) / 4)) {
          v = (n - 1) << 16 >> 16;
        } else {
          v = (v % 4) << 16 >> 16;
        }
        break;
      }
      case 72: {
        if (v >= 4) {
          v = (v - 4) << 16 >> 16;
        } else {
          v = ((Math.trunc((n - 1) / 4) * 4) + v) << 16 >> 16;
          if (v > (n - 1)) {
            v = (v - 4) << 16 >> 16;
          }
        }
        break;
      }
    }
    if ((v >= 0) && (v < n)) {
      pick = v & 255;
    }
  }
  async function ChooseInGrid() {
    let old: number = 0, finished: boolean = false;
    inGrid = true;
    which = 0;
    pick = CurrentOption() & 255;
    TextRend.ClearBottomLine();
    DrawItem(cur);
    (await ShowMessage());
    (await DrawGrid());
    (await ShowPreviews());
    finished = false;
    do {
      U8[227081] = true ? 1 : 0;
      key = (await MenuCore.MenuHorizontal("", "", 13, 10, 15, true, false, $f0)) & 255;
      if ((U8[$f0] !== 0)) {
        if (key === 72 || key === 80 || key === 75 || key === 77) {
          old = pick;
          MovePick(key);
          if (pick !== old) {
            OptionState(pick, $f0 + 7, $f0 + 8, $f0 + 9);
            if (PageFirst(pick) !== PageFirst(old)) {
              (await DrawGrid());
            } else {
              (await ShowCell(CellOf(old), false));
              (await ShowCell(CellOf(pick), true));
            }
            DrawItem(cur);
            (await ShowPreviews());
          }
        }
      } else {
        switch (key) {
          case 13: {
            {
              const $w8 = r32(143749);
              switch (cur) {
                case 0: {
                  U8[$w8 + 189] = U8[$f0 + 7];
                  break;
                }
                case 1: {
                  U8[$w8 + 190] = U8[$f0 + 8];
                  break;
                }
                default: {
                  mv($w8 + 193, $f0 + 9, 6);
                }
              }
            }
            finished = true;
            break;
          }
          case 0: {
            Revert();
            finished = true;
            break;
          }
          case 32: {
            if (((cur >= 3) && (cur <= 9)) && (U8[cur + 254151] === 2)) {
              which = (1 - which) & 255;
              pick = CurrentOption() & 255;
              DrawItem(cur);
              (await DrawGrid());
            }
            break;
          }
        }
      }
    } while (!(finished));
    inGrid = false;
    (await Border.ClearBox(18, 1, 38, 16));
    (await ShowMessage());
    DrawItem(cur);
    (await ShowPreviews());
  }
  async function Confirmed() {
    let $r1: boolean = false;
    if ((await MenuCore.YesNoMenu("Is this icon ok? ", 13, 10, 15)) === 89) {
      $r1 = true;
    } else {
      U8[145643] = 1;
      $r1 = false;
    }
    return $r1;
  }
  savedChoice = U8[145643];
  {
    const $w9 = r32(143749);
    savedHead = U8[$w9 + 189];
    savedBody = U8[$w9 + 190];
    savedSize = U8[$w9 + 192];
    mv($f0 + 1, $w9 + 193, 6);
  }
  for (let $i10 = 0; $i10 <= 1; $i10++) {
    i = $i10;
    for (let $i11 = 0; $i11 <= 1; $i11++) {
      j = $i11;
      w32($f0 + i * 8 + j * 4 + 15, 0);
      U8[$f0 + i * 2 + j + 31] = 255;
    }
  }
  (await Blit.AllocPic(24, 3, 1, 1, $f0 + 35));
  for (let $i12 = 0; $i12 <= 15; $i12++) {
    i = $i12;
    (await Blit.AllocPic(24, 3, 1, 1, $f0 + i * 4 + 39));
  }
  (await Blit.AllocPic(24, 3, 1, 0, $f0 + 103));
  (await Blit.AllocPic(24, 3, 1, 0, $f0 + 107));
  (await Blit.AllocPic(24, 3, 1, 0, $f0 + 111));
  inGrid = false;
  which = 0;
  pick = 0;
  cur = 0;
  Revert();
  (await TextRend.ClearScreen());
  (await CbtMap.SetCombatPalette());
  (await Border.DrawBorder(1, 1, 16, 22, 0));
  (await Border.DrawBorder(18, 1, 38, 22, 0));
  (await Border.DrawBorder(18, 18, 38, 22, 0));
  {
    const $w13 = r32(143749);
    TextRend.DisplayCentered(1, 16, 1, 3, rS($w13));
  }
  TextRend.DisplayString(2, 6, 10, "Ready");
  TextRend.DisplayString(9, 6, 10, "Action");
  TextRend.DisplayString(2, 12, 10, "Color");
  for (let $i14 = 0; $i14 <= 9; $i14++) {
    i = $i14;
    DrawItem(i);
  }
  (await ShowPreviews());
  done = false;
  U8[145643] = 1;
  do {
    U8[227081] = cur !== 10 ? 1 : 0;
    U8[227082] = cur !== 10 ? 1 : 0;
    key = (await MenuCore.MenuHorizontal("", "Keep Exit", 13, 10, 15, true, false, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      if (key === 72 || key === 80) {
        i = cur;
        if (key === 72) {
          if (cur === 0) {
            cur = 10;
          } else {
            cur = (cur - 1) & 255;
          }
        } else if (cur === 10) {
          cur = 0;
        } else {
          cur = (cur + 1) & 255;
        }
        DrawItem(i);
        DrawItem(cur);
      }
    } else {
      switch (key) {
        case 13: {
          switch (cur) {
            case 2: {
              tSize = (3 - tSize) & 255;
              U8[r32(143749) + 192] = tSize;
              DrawItem(cur);
              (await ShowPreviews());
              break;
            }
            default: {
              (await ChooseInGrid());
            }
          }
          break;
        }
        case 75: {
          done = (await Confirmed());
          break;
        }
        case 69: case 0: {
          {
            const $w16 = r32(143749);
            U8[$w16 + 189] = savedHead;
            U8[$w16 + 190] = savedBody;
            U8[$w16 + 192] = savedSize;
            mv($w16 + 193, $f0 + 1, 6);
          }
          done = true;
          break;
        }
      }
    }
  } while (!(done));
  for (let $i17 = 0; $i17 <= 1; $i17++) {
    i = $i17;
    for (let $i18 = 0; $i18 <= 1; $i18++) {
      j = $i18;
      Blit.FreePic($f0 + i * 8 + j * 4 + 15);
    }
  }
  Blit.FreePic($f0 + 35);
  for (let $i19 = 0; $i19 <= 15; $i19++) {
    i = $i19;
    Blit.FreePic($f0 + i * 4 + 39);
  }
  Blit.FreePic($f0 + 103);
  Blit.FreePic($f0 + 107);
  Blit.FreePic($f0 + 111);
  if (Party.IsPartyMember(r32(143749)) && (U8[r32(143749) + 191] < 8)) {
    (await SaveLoad.LoadCharIconAnim(true));
    if (U8[141223] > 1) {
      (await MapTiles.LoadIconAnim("ICON", 0, 11));
    }
  }
  TextRend.ClearBottomLine();
  (await CbtMap.SetNoncombatPalette());
  U8[145643] = savedChoice;
  S.sp = $sp;
}

export async function CustomizePortrait(canCancel: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 27);
  let key: number = 0, onBody: boolean = false, done: boolean = false, i: number = 0, step: number = 0, nHeads: number = 0, nBodies: number = 0, savedHead: number = 0, savedBody: number = 0;
  function Wrap(cur: number, k: number, n: number) {
    let $r1: number = 0;
    $r1 = (((((cur - 1) + k) + n) % n) + 1) & 255;
    return $r1;
  }
  async function ShowRow(body: boolean) {
    let k: number = 0;
    {
      const $w1 = r32(143749);
      for (let $i2 = -1; $i2 <= 1; $i2++) {
        k = $i2;
        if (body) {
          (await Blit.LoadPic("BODY" + rS($f0 + 25), U8[Wrap(U8[$w1 + 188], k, nBodies) + 133187], false, 0, $f0 + (k + 1) * 4 + 13));
          (await Portrait.DisplayImageBuf(U8[(k + 1) + 254054], 9, false, r32($f0 + (k + 1) * 4 + 13)));
        } else {
          (await Blit.LoadPic("HEAD" + rS($f0 + 25), U8[Wrap(U8[$w1 + 187], k, nHeads) + 133146], false, 0, $f0 + (k + 1) * 4 + 1));
          (await Portrait.DisplayImageBuf(U8[(k + 1) + 254054], 4, false, r32($f0 + (k + 1) * 4 + 1)));
        }
      }
    }
  }
  async function Centered(row: number, color: number, s: string) {
    (await Border.ClearBox(2, row, 37, row));
    TextRend.DisplayCentered(2, 37, row, color, s);
  }
  async function ShowCounts() {
    let col: number = 0;
    {
      const $w3 = r32(143749);
      if (onBody) {
        col = 10;
      } else {
        col = 15;
      }
      (await Centered(17, col, "Head " + StrUtil.PadLeft(StrUtil.NumStr(U8[$w3 + 187]), 2) + " of " + StrUtil.NumStr(nHeads)));
      if (onBody) {
        col = 15;
      } else {
        col = 10;
      }
      (await Centered(18, col, "Body " + StrUtil.PadLeft(StrUtil.NumStr(U8[$w3 + 188]), 2) + " of " + StrUtil.NumStr(nBodies)));
    }
  }
  wS($f0 + 25, 1, rt.fmtI(U8[143234], 0));
  nHeads = (await Portrait.PlayerPortraitCount(false)) & 255;
  nBodies = (await Portrait.PlayerPortraitCount(true)) & 255;
  for (let $i4 = 0; $i4 <= 2; $i4++) {
    i = $i4;
    w32($f0 + i * 4 + 1, 0);
    w32($f0 + i * 4 + 13, 0);
  }
  {
    const $w5 = r32(143749);
    savedHead = U8[$w5 + 187];
    savedBody = U8[$w5 + 188];
    if ((U8[$w5 + 187] === 0) || (U8[$w5 + 187] > nHeads)) {
      U8[$w5 + 187] = 1;
    }
    if ((U8[$w5 + 188] === 0) || (U8[$w5 + 188] > nBodies)) {
      U8[$w5 + 188] = 1;
    }
    (await TextRend.ClearScreen());
    (await Border.DrawBorder(1, 1, 38, 22, 0));
    (await Centered(2, 15, rS($w5)));
    (await Border.DrawBorder(U8[254055], 4, U8[254055] + 10, 14, 0));
    (await Centered(20, 10, "Arrow keys for selection"));
    (await ShowRow(false));
    (await ShowRow(true));
    onBody = false;
    done = false;
    U8[145643] = 5;
    do {
      (await ShowCounts());
      U8[227081] = true ? 1 : 0;
      key = (await MenuCore.MenuHorizontal("Portrait: ", "Head Body Next Prev Keep", 13, 10, 15, true, false, $f0)) & 255;
      step = 0;
      if ((U8[$f0] !== 0)) {
        switch (key) {
          case 72: case 80: {
            onBody = !onBody;
            break;
          }
          case 75: {
            step = -1;
            break;
          }
          case 77: {
            step = 1;
            break;
          }
        }
      } else {
        switch (key) {
          case 78: {
            step = 1;
            break;
          }
          case 80: {
            step = -1;
            break;
          }
          case 72: {
            onBody = false;
            break;
          }
          case 66: {
            onBody = true;
            break;
          }
          case 0: {
            if (canCancel) {
              U8[$w5 + 187] = savedHead;
              U8[$w5 + 188] = savedBody;
              done = true;
            }
            break;
          }
          case 75: case 32: case 13: {
            (await Border.ClearBox(U8[254054], 4, U8[254054] + 10, 14));
            (await Border.ClearBox(U8[254056], 4, U8[254056] + 10, 14));
            (await Border.ClearBox(2, 17, 37, 20));
            if ((await MenuCore.YesNoMenu("Is this portrait ok? ", 13, 10, 15)) === 89) {
              done = true;
            } else {
              (await ShowRow(false));
              (await ShowRow(true));
              (await Centered(20, 10, "Arrow keys for selection"));
              U8[145643] = 5;
            }
            break;
          }
        }
      }
      if (step !== 0) {
        if (onBody) {
          U8[$w5 + 188] = Wrap(U8[$w5 + 188], step, nBodies);
        } else {
          U8[$w5 + 187] = Wrap(U8[$w5 + 187], step, nHeads);
        }
        (await ShowRow(onBody));
      }
    } while (!(done));
  }
  for (let $i7 = 0; $i7 <= 2; $i7++) {
    i = $i7;
    Blit.FreePic($f0 + i * 4 + 1);
    Blit.FreePic($f0 + i * 4 + 13);
  }
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export function Modifiable() {
  let $r0: boolean = false;
  $r0 = (((I8[r32(143749) + 46] >= 1) && (I8[r32(143749) + 46] <= 7)) && (I8[r32(143749) + 47] >= 0)) && (I8[r32(143749) + 47] <= 16);
  return $r0;
}

export async function ModifyCharacter(levelled: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 12);
  let savedExc: number = 0, savedHp: number = 0, savedHpCur: number = 0, lvlSp: number = 0, hold: number = 0, key: number = 0, statIdx: number = 0, oldCon: number = 0, hpShift: number = 0;
  async function RedrawStat(hotPink: boolean) {
    if (statIdx < 6) {
      (await ViewChar.PrintStat(statIdx, hotPink));
    } else {
      CharDisp.PrintHitPoints(r32(143749), 4, 18, hotPink);
    }
  }
  function StatMinimum(racialMin: number) {
    let $r1: number = 0;
    {
      const $w1 = r32(143749);
      if (ClassCal.ClassAbilityMin(I8[$w1 + 46], I8[$w1 + 47], statIdx) > racialMin) {
        $r1 = ClassCal.ClassAbilityMin(I8[$w1 + 46], I8[$w1 + 47], statIdx) & 255;
      } else {
        $r1 = racialMin;
      }
    }
    return $r1;
  }
  function RaiseToMinimum(a: number) {
    {
      const $w2 = r32(143749);
      if (U8[$w2 + a + 16] < StatMinimum(ClassCal.RaceAbilityMin(I8[$w2 + 46], I8[$w2 + 158], a))) {
        U8[$w2 + a + 16] = StatMinimum(ClassCal.RaceAbilityMin(I8[$w2 + 46], I8[$w2 + 158], a));
      }
    }
  }
  function LowerToMaximum(a: number) {
    {
      const $w3 = r32(143749);
      if (U8[$w3 + a + 16] > ClassCal.RaceAbilityMax(I8[$w3 + 46], I8[$w3 + 158], a)) {
        U8[$w3 + a + 16] = ClassCal.RaceAbilityMax(I8[$w3 + 46], I8[$w3 + 158], a);
      }
    }
  }
  function ShiftHp() {
    {
      const $w4 = r32(143749);
      hpShift = (ClassCal.ConHpTotal(r32(143749), U8[$w4 + 20]) - ClassCal.ConHpTotal(r32(143749), oldCon)) << 16 >> 16;
      if ((U8[$w4 + 50] + hpShift) < 1) {
        hpShift = 1 - U8[$w4 + 50];
      }
      U8[$w4 + 50] = U8[$w4 + 50] + hpShift;
      if ((U8[$w4 + 283] + hpShift) < 0) {
        U8[$w4 + 283] = 0;
      } else {
        U8[$w4 + 283] = U8[$w4 + 283] + hpShift;
      }
    }
  }
  function StepHp(k: number) {
    let hp: number = 0;
    hp = (U8[r32(143749) + 50] + k) << 16 >> 16;
    if (hp > ClassCal.HpMaximum(r32(143749))) {
      hp = ClassCal.HpMaximum(r32(143749)) << 16 >> 16;
    }
    SetHpMax(hp);
  }
  if (!Modifiable()) {
    (await TextRend.PrintAndPause(rS(r32(143749)) + " can't be modified.", 14));
    { S.sp = $sp; return; }
  }
  (await ViewChar.DisplayChar(r32(143749)));
  mv($f0, r32(143749) + 16, 6);
  savedExc = U8[r32(143749) + 22];
  savedHp = U8[r32(143749) + 50];
  savedHpCur = U8[r32(143749) + 283];
  for (let $i5 = 1; $i5 <= 5; $i5++) {
    lvlSp = $i5;
    U8[$f0 + lvlSp + 5] = CharHlp.SpellSlots(r32(143749), 0, lvlSp);
  }
  statIdx = 6;
  (await RedrawStat(false));
  statIdx = 0;
  (await RedrawStat(true));
  {
    const $w6 = r32(143749);
    do {
      U8[227081] = true ? 1 : 0;
      key = (await MenuCore.MenuHorizontal("Modify character: ", "Keep Exit", 13, 10, 15, true, false, $f0 + 11)) & 255;
      (await RedrawStat(false));
      oldCon = U8[$w6 + 20];
      if ((U8[$f0 + 11] !== 0)) {
        switch (key) {
          case 80: case 13: {
            statIdx = (statIdx + 1) & 255;
            if (statIdx > 6) {
              statIdx = 0;
            }
            break;
          }
          case 72: {
            statIdx = (statIdx - 1) & 255;
            if (statIdx === 255) {
              statIdx = 6;
            }
            break;
          }
          case 75: {
            if (statIdx < 6) {
              hold = statIdx << 24 >> 24;
              if (U8[$w6 + hold + 16] > 0) {
                let $t8;
                $t8 = $w6 + hold + 16, U8[$t8] = U8[$t8] - 1;
              }
              switch (hold) {
                case 0: {
                  if (U8[$w6 + 22] > 0) {
                    U8[$w6 + 22] = U8[$w6 + 22] - 1;
                    let $t9;
                    $t9 = $w6 + hold + 16, U8[$t9] = U8[$t9] + 1;
                  } else {
                    RaiseToMinimum(hold);
                  }
                  break;
                }
                case 2: {
                  RaiseToMinimum(hold);
                  ClassCal.ResetClericSlots(r32(143749));
                  break;
                }
                case 4: {
                  RaiseToMinimum(hold);
                  if (levelled) {
                    ShiftHp();
                  } else {
                    if (ClassCal.HpMaximum(r32(143749)) < U8[$w6 + 50]) {
                      U8[$w6 + 50] = ClassCal.HpMaximum(r32(143749));
                    }
                    U8[$w6 + 283] = U8[$w6 + 50];
                  }
                  statIdx = 6;
                  (await RedrawStat(false));
                  statIdx = 4;
                  break;
                }
                default: {
                  RaiseToMinimum(hold);
                }
              }
            } else if (levelled) {
              StepHp(-1);
            } else {
              U8[$w6 + 50] = U8[$w6 + 50] - 1;
              if (ClassCal.HpMinimum(r32(143749)) > U8[$w6 + 50]) {
                U8[$w6 + 50] = ClassCal.HpMinimum(r32(143749));
              }
              U8[$w6 + 283] = U8[$w6 + 50];
            }
            break;
          }
          case 77: {
            if (statIdx < 6) {
              hold = statIdx << 24 >> 24;
              let $t10;
              $t10 = $w6 + hold + 16, U8[$t10] = U8[$t10] + 1;
              switch (hold) {
                case 0: {
                  if (U8[$w6 + hold + 16] > ClassCal.RaceAbilityMax(I8[$w6 + 46], I8[$w6 + 158], hold)) {
                    if (((U8[$w6 + hold + 16] > 18) && (CharHlp.WarriorLevel(r32(143749)) > 0)) && (U8[I8[$w6 + 46] * 16 + I8[$w6 + 158] + 140253] > U8[$w6 + 22])) {
                      U8[$w6 + 22] = U8[$w6 + 22] + 1;
                    }
                    U8[$w6 + hold + 16] = ClassCal.RaceAbilityMax(I8[$w6 + 46], I8[$w6 + 158], hold);
                  }
                  break;
                }
                case 2: {
                  LowerToMaximum(hold);
                  ClassCal.ResetClericSlots(r32(143749));
                  break;
                }
                case 4: {
                  LowerToMaximum(hold);
                  if (levelled) {
                    ShiftHp();
                  } else {
                    if (ClassCal.HpMinimum(r32(143749)) > U8[$w6 + 50]) {
                      U8[$w6 + 50] = ClassCal.HpMinimum(r32(143749));
                    }
                    U8[$w6 + 283] = U8[$w6 + 50];
                  }
                  statIdx = 6;
                  (await RedrawStat(false));
                  statIdx = 4;
                  break;
                }
                default: {
                  LowerToMaximum(hold);
                }
              }
            } else if (levelled) {
              StepHp(1);
            } else {
              U8[$w6 + 50] = U8[$w6 + 50] + 1;
              if (ClassCal.HpMaximum(r32(143749)) < U8[$w6 + 50]) {
                U8[$w6 + 50] = ClassCal.HpMaximum(r32(143749));
              }
              U8[$w6 + 283] = U8[$w6 + 50];
            }
            break;
          }
        }
      } else {
        switch (key) {
          case 69: case 0: {
            for (let $i11 = 0; $i11 <= 5; $i11++) {
              hold = $i11;
              U8[r32(143749) + hold + 16] = U8[$f0 + hold];
            }
            U8[r32(143749) + 22] = savedExc;
            U8[r32(143749) + 50] = savedHp;
            U8[r32(143749) + 283] = U8[$w6 + 50];
            if (levelled) {
              U8[r32(143749) + 283] = savedHpCur;
            }
            for (let $i12 = 1; $i12 <= 5; $i12++) {
              lvlSp = $i12;
              CharHlp.SetSpellSlots(r32(143749), 0, lvlSp, U8[$f0 + lvlSp + 5]);
            }
            if (I8[$w6 + 156] > 0) {
              ClassCal.RecalcThiefSkills(r32(143749));
            }
            CharHlp.RecalcStats(r32(143749));
            { S.sp = $sp; return; }
            break;
          }
        }
      }
      CharHlp.RecalcStats(r32(143749));
      ViewChar.PrintCombatStats();
      (await RedrawStat(true));
    } while (!(!(U8[$f0 + 11] !== 0) && (key === 75)));
    if (I8[$w6 + 156] > 0) {
      ClassCal.RecalcThiefSkills(r32(143749));
    }
    if (!levelled) {
      U8[r32(143749) + 133] = 1;
    }
  }
  S.sp = $sp;
}

export function SetHpMax(hp: number) {
  let dmg: number = 0;
  {
    const $w1 = r32(143749);
    dmg = U8[$w1 + 50] - U8[$w1 + 283];
    if (hp < ClassCal.HpMinimum(r32(143749))) {
      hp = ClassCal.HpMinimum(r32(143749)) << 16 >> 16;
    }
    if (hp < 1) {
      hp = 1;
    }
    U8[$w1 + 50] = hp;
    if ((hp - dmg) < 0) {
      U8[$w1 + 283] = 0;
    } else {
      U8[$w1 + 283] = hp - dmg;
    }
  }
}

export async function GainLevels(trainable: number, restoreDrain: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let clsCount: number = 0, rolled: number = 0, gain: number = 0, dmg: number = 0, cls: number = 0, conB: number = 0, oldMage: number = 0, sel: number = 0, resting: number = 0;
  resting = ChgClass.RestingMask(r32(143749)) & 255;
  {
    const $w1 = r32(143749);
    clsCount = ClassCal.HpClassCount(r32(143749)) & 255;
    oldMage = I8[$w1 + 155];
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      cls = $i2;
      if (I8[$w1 + cls + 150] > 0) {
        if (((U8[cls + 131902] & trainable) > 0) && ((U8[$w1 + 285] & (1 << cls)) === 0)) {
          let $t3;
          $t3 = $w1 + cls + 150, U8[$t3] = I8[$t3] + 1;
          if (restoreDrain && (U8[$w1 + 116] > 0)) {
            if (CharExt.TrainDrain(r32(143749), cls, $f0 + 3)) {
              if (U8[$f0 + 7] > U8[$w1 + 117]) {
                U8[$w1 + 117] = 0;
              } else {
                U8[$w1 + 117] = U8[$w1 + 117] - U8[$f0 + 7];
              }
            } else {
              U8[$w1 + 117] = U8[$w1 + 117] - Math.trunc(U8[$w1 + 117] / U8[$w1 + 116]);
            }
            U8[$w1 + 116] = U8[$w1 + 116] - 1;
          }
        }
      }
    }
    ClassCal.RecalcBaseSkills(r32(143749));
    if (I8[$w1 + 155] > oldMage) {
      w16($f0, -1);
      do {
        sel = (await Magic.SpellMenu(4, 4, $f0, $f0 + 2)) & 255;
      } while (!((sel > 0) || !(U8[$f0 + 2] !== 0)));
      if (sel > 0) {
        CharHlp.SetSpellKnown(r32(143749), sel, true);
      }
    }
    if (!CharHlp.IsDualClass(r32(143749)) || (ClassCal.HitDice(r32(143749), I8[$w1 + 47]) > 0)) {
      rolled = ClassCal.RollFirstLevelHp(r32(143749), trainable) << 16 >> 16;
      gain = Math.trunc(rolled / clsCount) << 16 >> 16;
      if (gain === 0) {
        gain = 1;
      }
      U8[$w1 + 177] = U8[$w1 + 177] + gain;
      conB = ClassCal.ConHpBonus(r32(143749), trainable) << 16 >> 16;
      gain = Math.trunc((rolled + conB) / clsCount) << 16 >> 16;
      if (gain < 1) {
        gain = 1;
      }
      dmg = (U8[$w1 + 50] - U8[$w1 + 283]) & 255;
      U8[$w1 + 50] = U8[$w1 + 50] + gain;
      U8[$w1 + 283] = U8[$w1 + 50] - dmg;
    }
  }
  if (resting !== 0) {
    (await ChgClass.AnnounceWoken(r32(143749), resting));
  }
  S.sp = $sp;
}

export async function CreateCharacterMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 11);
  let creature: number = 0, savedCur: number = 0, slot: number = 0, j: number = 0, roll: number = 0, ch: number = 0, k: number = 0, g: number = 0, cls: number = 0, i: number = 0, cnt: number = 0, clsCount: number = 0, goldDice: number = 0, addExit: boolean = false;
  function ClampToLimits(i: number) {
    {
      const $w1 = creature;
      if (U8[$w1 + i + 16] < ClassCal.RaceAbilityMin(I8[$w1 + 46], I8[$w1 + 158], i)) {
        U8[$w1 + i + 16] = ClassCal.RaceAbilityMin(I8[$w1 + 46], I8[$w1 + 158], i);
      }
      if (U8[$w1 + i + 16] > ClassCal.RaceAbilityMax(I8[$w1 + 46], I8[$w1 + 158], i)) {
        U8[$w1 + i + 16] = ClassCal.RaceAbilityMax(I8[$w1 + 46], I8[$w1 + 158], i);
      }
      if (U8[$w1 + i + 16] < ClassCal.ClassAbilityMin(I8[$w1 + 46], I8[$w1 + 47], i)) {
        U8[$w1 + i + 16] = ClassCal.ClassAbilityMin(I8[$w1 + 46], I8[$w1 + 47], i);
      }
    }
  }
  async function PickFromList() {
    const $sp = S.sp, $f1 = (S.sp = $sp - 5);
    let key: number = 0, withExit: boolean = false, $r1: boolean = false;
    $r1 = true;
    w32($f1, r32($f0));
    w16($f0 + 8, 1);
    withExit = true;
    U8[$f1 + 4] = true ? 1 : 0;
    do {
      key = (await MenuCore.MenuVertical("", "", 13, 10, 15, 1, 2, 38, 22, r32($f0), withExit, $f1 + 4, $f0 + 8, $f1)) & 255;
      if (key === 0) {
        MenuCore.FreeStringList($f0);
        SaveLoad.FreeCreature(creature);
        $r1 = false;
        { S.sp = $sp; return $r1; }
      }
    } while (!(key === 13));
    S.sp = $sp;
    return $r1;
  }
  creature = rt.getMem(378);
  rt.fill(creature, 378, 0);
  {
    const $w3 = creature;
    for (let $i4 = 1; $i4 <= 6; $i4++) {
      slot = $i4;
      U8[$w3 + slot + 192] = U8[slot + 140258] + ((U8[slot + 140258] + 8) * 16);
    }
    U8[$w3 + 169] = 50;
    U8[$w3 + 45] = 40;
    U8[$w3 + 268] = 0;
    U8[$w3 + 269] = 1;
    U8[$w3 + 187] = 1;
    U8[$w3 + 188] = 1;
    U8[$w3 + 108] = 1;
    U8[$w3 + 171] = TpRand.Random(256);
  }
  MenuCore.AllocStringList(7, $f0);
  U8[r32($f0) + 41] = 1;
  wS(r32($f0), 40, "Pick Race");
  for (let $i5 = 1; $i5 <= 7; $i5++) {
    k = $i5;
    switch (k) {
      case 1: case 2: case 3: case 4: case 5: {
        w32($f0 + 4, MenuCore.FindListMember(k, r32($f0)));
        wS(r32($f0 + 4), 40, "  " + rS(k * 9 + 132408));
        break;
      }
      case 7: {
        w32($f0 + 4, MenuCore.FindListMember(k - 1, r32($f0)));
        wS(r32($f0 + 4), 40, "  " + rS(k * 9 + 132408));
        break;
      }
    }
  }
  (await Border.ClearBox(1, 1, 38, 22));
  (await Border.DrawBorder(1, 10, 38, 22, 0));
  (await Border.DrawBorder(1, 1, 16, 8, 0));
  (await Border.DrawBorder(18, 1, 38, 8, 0));
  (await ShowRaceInfo(1));
  w32($f0 + 4, r32($f0));
  w16($f0 + 8, 1);
  w16(145641, 1);
  U8[$f0 + 10] = true ? 1 : 0;
  addExit = true;
  do {
    U8[227106] = true ? 1 : 0;
    ch = (await MenuCore.MenuVertical("", "", 13, 10, 15, 1, 2, 16, 7, r32($f0), addExit, $f0 + 10, $f0 + 8, $f0 + 4)) & 255;
    if (ch === 0) {
      MenuCore.FreeStringList($f0);
      SaveLoad.FreeCreature(creature);
      { S.sp = $sp; return; }
    }
    if (ch !== 13) {
      if (ri16($f0 + 8) === 6) {
        (await ShowRaceInfo(7));
      } else {
        (await ShowRaceInfo(ri16($f0 + 8)));
      }
    }
  } while (!(ch === 13));
  (await Border.DrawWindow(1, 1, 38, 22, 0, 0, ""));
  if (ri16($f0 + 8) === 6) {
    w16($f0 + 8, ri16($f0 + 8) + 1);
  }
  {
    const $w7 = creature;
    U8[$w7 + 46] = ri16($f0 + 8);
    switch (I8[$w7 + 46]) {
      case 5: {
        U8[$w7 + 192] = 1;
        FxEngine.AddEffect(creature, 90, 0, 255, false);
        FxEngine.AddEffect(creature, 97, 0, 255, false);
        break;
      }
      case 1: {
        U8[$w7 + 192] = 1;
        FxEngine.AddEffect(creature, 90, 0, 255, false);
        FxEngine.AddEffect(creature, 97, 0, 255, false);
        FxEngine.AddEffect(creature, 26, 0, 255, false);
        FxEngine.AddEffect(creature, 47, 0, 255, false);
        break;
      }
      case 3: {
        U8[$w7 + 192] = 1;
        FxEngine.AddEffect(creature, 97, 0, 255, false);
        FxEngine.AddEffect(creature, 18, 0, 255, false);
        FxEngine.AddEffect(creature, 47, 0, 255, false);
        FxEngine.AddEffect(creature, 48, 0, 255, false);
        break;
      }
      case 2: {
        U8[$w7 + 192] = 2;
        FxEngine.AddEffect(creature, 107, 0, 255, false);
        break;
      }
      case 4: {
        U8[$w7 + 192] = 2;
        FxEngine.AddEffect(creature, 124, 0, 255, false);
        break;
      }
      default: {
        U8[$w7 + 192] = 2;
      }
    }
  }
  MenuCore.FreeStringList($f0);
  MenuCore.AllocStringList(3, $f0);
  U8[r32($f0) + 41] = 1;
  wS(r32($f0), 40, "Pick Gender");
  for (let $i8 = 0; $i8 <= 1; $i8++) {
    g = $i8;
    w32($f0 + 4, MenuCore.FindListMember(g + 1, r32($f0)));
    wS(r32($f0 + 4), 40, "  " + rS(g * 7 + 132624));
  }
  if (!(await PickFromList())) {
    { S.sp = $sp; return; }
  }
  U8[creature + 158] = ri16($f0 + 8) - 1;
  MenuCore.FreeStringList($f0);
  cnt = I8[I8[creature + 46] * 14 + 229905] & 255;
  if (cnt > 13) {
    cnt = 13;
  }
  MenuCore.AllocStringList(cnt + 1, $f0);
  U8[r32($f0) + 41] = 1;
  wS(r32($f0), 40, "Pick Class");
  for (let $i9 = 1, $e9 = cnt; $i9 <= $e9; $i9++) {
    slot = $i9;
    w32($f0 + 4, MenuCore.FindListMember(slot, r32($f0)));
    wS(r32($f0 + 4), 40, "  " + rS(I8[I8[creature + 46] * 14 + slot + 229905] * 26 + 131942));
  }
  if (!(await PickFromList())) {
    { S.sp = $sp; return; }
  }
  if ((ri16($f0 + 8) < 1) || (ri16($f0 + 8) > cnt)) {
    w16($f0 + 8, 1);
  }
  {
    const $w10 = creature;
    U8[$w10 + 47] = I8[I8[$w10 + 46] * 14 + ri16($f0 + 8) + 229905];
    U8[$w10 + 115] = 1;
    if ((I8[$w10 + 47] >= 0) && (I8[$w10 + 47] <= 16)) {
      for (let $i11 = 1; $i11 <= 3; $i11++) {
        slot = $i11;
        if ((I8[I8[$w10 + 47] * 3 + slot + 140376] >= 0) && (I8[I8[$w10 + 47] * 3 + slot + 140376] <= 7)) {
          U8[$w10 + I8[I8[$w10 + 47] * 3 + slot + 140376] + 150] = 1;
        }
      }
    }
    if (I8[$w10 + 47] === 3) {
      FxEngine.AddEffect(creature, 45, 0, 255, false);
    }
    U8[$w10 + 176] = 0;
    U8[$w10 + 45] = 0;
    for (let $i12 = 0; $i12 <= 7; $i12++) {
      cls = $i12;
      if (I8[$w10 + cls + 150] > 0) {
        if (U8[cls * 11 + I8[$w10 + cls + 150] + 140171] > U8[$w10 + 45]) {
          U8[$w10 + 45] = U8[cls * 11 + I8[$w10 + cls + 150] + 140171];
        }
        U8[$w10 + 176] = U8[$w10 + 176] | U8[cls + 230187];
      }
    }
  }
  ClassCal.RecalcSaves(creature);
  MenuCore.FreeStringList($f0);
  cnt = I8[I8[creature + 47] * 10 + 230017] & 255;
  MenuCore.AllocStringList(cnt + 1, $f0);
  U8[r32($f0) + 41] = 1;
  wS(r32($f0), 40, "Pick Alignment");
  for (let $i13 = 1, $e13 = cnt; $i13 <= $e13; $i13++) {
    slot = $i13;
    w32($f0 + 4, MenuCore.FindListMember(slot, r32($f0)));
    wS(r32($f0 + 4), 40, "  " + rS(I8[I8[creature + 47] * 10 + slot + 230017] * 16 + 132480));
  }
  if (!(await PickFromList())) {
    { S.sp = $sp; return; }
  }
  U8[creature + 160] = I8[I8[creature + 47] * 10 + ri16($f0 + 8) + 230017];
  MenuCore.FreeStringList($f0);
  w16(creature + 48, ClassCal.StartingAge(I8[creature + 46], I8[creature + 47]));
  savedCur = r32(143749);
  w32(143749, creature);
  (await ViewChar.DisplayChar(r32(143749)));
  do {
    U8[creature + 22] = 0;
    for (let $i15 = 0; $i15 <= 5; $i15++) {
      i = $i15;
      U8[creature + i + 16] = 0;
      for (let $i16 = 1; $i16 <= 6; $i16++) {
        j = $i16;
        roll = Dice.RollDice(3, 6) & 255;
        if ((I8[creature + 46] >= 1) && (I8[creature + 46] <= 7)) {
          roll = (roll + I8[I8[creature + 46] * 6 + i + 253839]) & 255;
        }
        if (U8[creature + i + 16] < roll) {
          U8[creature + i + 16] = roll;
        }
      }
      {
        const $w17 = creature;
        switch (i) {
          case 0: {
            if ((U8[$w17 + i + 16] > 0) && (r16(I8[$w17 + 46] * 10 + 253878) < r16($w17 + 48))) {
              let $t18;
              $t18 = $w17 + i + 16, U8[$t18] = U8[$t18] + 1;
            }
            if ((U8[$w17 + i + 16] > 0) && (r16(I8[$w17 + 46] * 10 + 253880) < r16($w17 + 48))) {
              let $t19;
              $t19 = $w17 + i + 16, U8[$t19] = U8[$t19] - 1;
            }
            if ((U8[$w17 + i + 16] > 0) && (r16(I8[$w17 + 46] * 10 + 253882) < r16($w17 + 48))) {
              let $t20;
              $t20 = $w17 + i + 16, U8[$t20] = U8[$t20] - 2;
            }
            if ((U8[$w17 + i + 16] > 0) && (r16(I8[$w17 + 46] * 10 + 253884) < r16($w17 + 48))) {
              let $t21;
              $t21 = $w17 + i + 16, U8[$t21] = U8[$t21] - 1;
            }
            ClampToLimits(i);
            if ((U8[$w17 + 16] === 18) && (CharHlp.WarriorLevel(creature) > 0)) {
              U8[$w17 + 22] = TpRand.Random(100) + 1;
              if (U8[I8[$w17 + 46] * 16 + I8[$w17 + 158] + 140253] < U8[$w17 + 22]) {
                U8[$w17 + 22] = U8[I8[$w17 + 46] * 16 + I8[$w17 + 158] + 140253];
              }
            }
            break;
          }
          case 1: {
            if (r16(I8[$w17 + 46] * 10 + 253880) < r16($w17 + 48)) {
              let $t22;
              $t22 = $w17 + i + 16, U8[$t22] = U8[$t22] + 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253884) < r16($w17 + 48)) {
              let $t23;
              $t23 = $w17 + i + 16, U8[$t23] = U8[$t23] + 1;
            }
            ClampToLimits(i);
            break;
          }
          case 2: {
            if (r16(I8[$w17 + 46] * 10 + 253878) >= r16($w17 + 48)) {
              let $t24;
              $t24 = $w17 + i + 16, U8[$t24] = U8[$t24] - 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253880) < r16($w17 + 48)) {
              let $t25;
              $t25 = $w17 + i + 16, U8[$t25] = U8[$t25] + 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253882) < r16($w17 + 48)) {
              let $t26;
              $t26 = $w17 + i + 16, U8[$t26] = U8[$t26] + 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253884) < r16($w17 + 48)) {
              let $t27;
              $t27 = $w17 + i + 16, U8[$t27] = U8[$t27] + 1;
            }
            ClampToLimits(i);
            break;
          }
          case 3: {
            if (r16(I8[$w17 + 46] * 10 + 253882) < r16($w17 + 48)) {
              let $t28;
              $t28 = $w17 + i + 16, U8[$t28] = U8[$t28] - 2;
            }
            if (r16(I8[$w17 + 46] * 10 + 253884) < r16($w17 + 48)) {
              let $t29;
              $t29 = $w17 + i + 16, U8[$t29] = U8[$t29] - 1;
            }
            ClampToLimits(i);
            break;
          }
          case 4: {
            let $t30;
            $t30 = $w17 + i + 16, U8[$t30] = U8[$t30] + 1;
            if (r16(I8[$w17 + 46] * 10 + 253880) < r16($w17 + 48)) {
              let $t31;
              $t31 = $w17 + i + 16, U8[$t31] = U8[$t31] - 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253882) < r16($w17 + 48)) {
              let $t32;
              $t32 = $w17 + i + 16, U8[$t32] = U8[$t32] - 1;
            }
            if (r16(I8[$w17 + 46] * 10 + 253884) < r16($w17 + 48)) {
              let $t33;
              $t33 = $w17 + i + 16, U8[$t33] = U8[$t33] - 1;
            }
            ClampToLimits(i);
            break;
          }
          case 5: {
            ClampToLimits(i);
            break;
          }
        }
      }
      (await ViewChar.PrintStat(i, false));
    }
    if (I8[creature + 156] > 0) {
      ClassCal.RecalcThiefSkills(creature);
    }
    {
      const $w34 = creature;
      U8[$w34 + 161] = 2;
      U8[$w34 + 163] = 1;
      U8[$w34 + 165] = 2;
      U8[$w34 + 170] = 1;
      U8[$w34 + 114] = 12;
      goldDice = 0;
      clsCount = 0;
      for (let $i35 = 0; $i35 <= 7; $i35++) {
        cls = $i35;
        if (I8[$w34 + cls + 150] > 0) {
          goldDice = (goldDice + Dice.RollDice(U8[cls * 2 + 253958], U8[cls * 2 + 253959])) & 255;
          clsCount = (clsCount + 1) & 255;
          ClassCal.StartCasterClass(creature, cls);
        }
      }
      w16($w34 + 142, Math.trunc((goldDice * 10) / clsCount));
      U8[$w34 + 177] = ClassCal.RollFirstLevelHp(creature, 255);
      U8[$w34 + 50] = ClassCal.DivideAmongClasses(U8[$w34 + 177], ClassCal.ConHpBonus(creature, 255), clsCount);
      U8[$w34 + 283] = U8[$w34 + 50];
      U8[$w34 + 177] = Math.trunc(U8[$w34 + 177] / clsCount);
    }
    ViewChar.PrintCombatStats();
    (await ViewChar.PrintMoney());
    ch = (await MenuCore.YesNoMenu("Keep this character? ", 13, 10, 15)) & 255;
  } while (!(ch === 89));
  (await ViewChar.DisplayChar(r32(143749)));
  w32(143749, savedCur);
  do {
    wS(creature, 15, (await TextRend.ReadString("Character name: ", 13, 15)));
  } while (!(rS(creature) !== ""));
  savedCur = r32(143749);
  w32(143749, creature);
  (await CustomizePortrait(false));
  (await ViewChar.DisplayChar(r32(143749)));
  (await CustomizeIcon());
  while (!(await SaveLoad.SaveChar(creature, "")) && ((await MenuCore.YesNoMenu("Try again? ", 14, 10, 15)) === 89)) {
  }
  w32(143749, savedCur);
  SaveLoad.FreeCreature(creature);
  S.sp = $sp;
}

export async function DropCharacterMenu() {
  if (r32(143749) === 0) {
    return;
  }
  {
    const $w1 = r32(143749);
    if (((await MenuCore.YesNoMenu("Drop " + rS($w1) + " forever? ", 14, 10, 15)) === 89) && ((await MenuCore.YesNoMenu("Are you sure? ", 14, 10, 15)) === 89)) {
      if (U8[$w1 + 269] === 0) {
        (await CharDisp.PrintBottomLine("You dump " + rS($w1) + " out back."));
      } else {
        (await CharDisp.PrintBottomLine(rS($w1) + " bids you farewell."));
      }
      (await SaveLoad.EraseChar(rS($w1)));
      SaveLoad.RemoveCreature(false, true);
    } else if ((U8[$w1] + 27) <= 40) {
      (await CharDisp.PrintBottomLine(rS($w1) + " breathes a sigh of relief."));
    } else {
      (await CharDisp.PrintBottomLine(rS($w1) + " sighs with relief."));
    }
  }
}

export async function ModifyCharacterMenu() {
  if (((ri32(r32(143749) + 172) > 0) || !Modifiable()) || CharHlp.IsDualClass(r32(143749))) {
    (await TextRend.PrintAndPause(rS(r32(143749)) + " can't be modified.", 14));
  } else {
    (await ModifyCharacter(false));
  }
}

export async function TrainingMenu() {
  let xpClamp: number = 0, nextXp: number = 0, trainMask: number = 0, classMask: number = 0, trainable: number = 0, trains: number = 0, cls: number = 0, row: number = 0, lvl: number = 0;
  if ((U8[r32(143749) + 268] !== 0) && (U8[253887] === 0)) {
    (await TextRend.PrintAndPause("we only train conscious people", 14));
    return;
  }
  if ((MoneyCal.CreatureGold(r32(143749)) < 1000) && (U8[253887] === 0)) {
    (await TextRend.PrintAndPause("Training costs 1000 gp.", 14));
    return;
  }
  trainMask = 0;
  classMask = 0;
  {
    const $w1 = r32(143749);
    xpClamp = 0;
    trains = CharHlp.TrainClasses(r32(143749), U8[253887] !== 0) & 255;
    for (let $i2 = 0; $i2 <= 7; $i2++) {
      cls = $i2;
      if ((I8[$w1 + cls + 150] > 0) && ((U8[$w1 + 285] & (1 << cls)) === 0)) {
        classMask = (classMask + U8[cls + 131902]) & 255;
        lvl = I8[$w1 + cls + 150];
        if ((trains & (1 << cls)) !== 0) {
          trainMask = (trainMask + U8[cls + 131902]) & 255;
          if (ClassCal.LevelOpen(cls, lvl + 2)) {
            nextXp = ClassCal.LevelXp(cls, lvl + 2) | 0;
          } else {
            nextXp = 0;
          }
          if (nextXp > 0) {
            if (ri32($w1 + 172) >= nextXp) {
              if (nextXp > xpClamp) {
                xpClamp = (nextXp - 1) | 0;
              }
            }
          }
        }
      }
    }
    if (U8[253887] === 0) {
      if ((classMask & CharHlp.HallMask()) === 0) {
        (await TextRend.PrintAndPause("We don't train that class here", 14));
        return;
      } else if ((trainMask & CharHlp.HallMask()) === 0) {
        (await TextRend.PrintAndPause("Not Enough Experience", 14));
        return;
      }
    }
    if (U8[253887] === 0) {
      trainable = trainMask & CharHlp.HallMask();
    } else {
      trainable = trainMask;
    }
    if (trainable === 0) {
      (await TextRend.PrintAndPause("No class can train further", 14));
      return;
    }
    (await Border.ClearBox(1, 1, 38, 22));
    row = 4;
    CharDisp.DisplayCreatureName(r32(143749), 4, row, false);
    TextRend.DisplayString(U8[$w1] + 4, row, 10, " will become:");
    for (let $i3 = 0; $i3 <= 7; $i3++) {
      cls = $i3;
      if ((I8[$w1 + cls + 150] > 0) && ((U8[$w1 + 285] & (1 << cls)) === 0)) {
        if ((U8[cls + 131902] & trainable) > 0) {
          row = (row + 1) << 24 >> 24;
          if (row === 5) {
            TextRend.DisplayString(6, row, 10, "    a level " + StrUtil.NumStr(I8[$w1 + cls + 150] + 1) + " " + rS(cls * 26 + 131942));
          } else {
            TextRend.DisplayString(6, row, 10, "and a level " + StrUtil.NumStr(I8[$w1 + cls + 150] + 1) + " " + rS(cls * 26 + 131942));
          }
        }
      }
    }
    if ((await MenuCore.YesNoMenu("Do you wish to train? ", 13, 10, 15)) !== 89) {
      return;
    }
    (await CharDisp.PrintBottomLine("Congratulations..."));
    if (U8[253887] === 0) {
      Money.PayFromCreature(r32(143749), 1000);
    }
    if (xpClamp > 0) {
      w32($w1 + 172, xpClamp);
    }
    (await GainLevels(trainable, true));
  }
}

export async function AddCharacterMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 11);
  let creature: number = 0, p: number = 0, key: number = 0, nonNpc: number = 0, rangers: number = 0, hasEvil: boolean = false, paladin: number = 0, newEvil: boolean = false, newPaladin: boolean = false, newRanger: boolean = false;
  (await SaveLoad.LoadCharlist($f0));
  if (r32($f0) === 0) {
    (await TextRend.FlashBottomLine(14, "No characters found to add."));
    { S.sp = $sp; return; }
  }
  (await Border.ClearBox(1, 1, 38, 22));
  w16($f0 + 8, 0);
  w32($f0 + 4, r32($f0));
  U8[$f0 + 10] = true ? 1 : 0;
  nonNpc = 0;
  do {
    key = (await MenuCore.MenuVertical("Add a character: ", "Add Exit", 13, 10, 15, 1, 2, 38, 22, r32($f0), false, $f0 + 10, $f0 + 8, $f0 + 4)) & 255;
    if ((key === 13) || (key === 65)) {
      if (U8[r32($f0 + 4) + 1] !== 42) {
        creature = rt.getMem(378);
        nonNpc = 0;
        if (!(await SaveLoad.LoadChar(rS(r32($f0 + 4)), creature, false))) {
          rt.freeMem(creature);
          if (!SaveLoad.HasCharFile(rS(r32($f0 + 4)))) {
            (await SaveLoad.SaveCharlist(r32($f0), rS(r32($f0 + 4))));
            MenuCore.FreeStringList($f0);
            (await SaveLoad.LoadCharlist($f0));
            if (r32($f0) === 0) {
              { S.sp = $sp; return; }
            }
            w16($f0 + 8, 0);
            w32($f0 + 4, r32($f0));
            U8[$f0 + 10] = true ? 1 : 0;
          } else {
            (await TextRend.DisplayAndPause(14, rt.Copy(rS(r32($f0 + 4)), 1, 21) + "'s file is damaged."));
            (await Border.ClearBox(0, 24, 39, 24));
          }
        } else {
          wS(r32($f0 + 4), 40, "* " + rS(r32($f0 + 4)));
          if (r32(143753) === 0) {
            w16(r32(141151) + 1660, 0);
            SaveLoad.AddCharToParty(creature);
            (await SaveLoad.LoadCharIconAnim(true));
          } else {
            rangers = 0;
            hasEvil = false;
            paladin = 0;
            p = r32(143753);
            while ((p !== 0) && ((rS(p) !== rS(creature)) || (U8[p + 171] !== U8[creature + 171]))) {
              if (!CharHlp.IsNpc(p)) {
                nonNpc = (nonNpc + 1) & 255;
              }
              if (CharHlp.GetClassLevel(p, 16) > 0) {
                rangers = (rangers + 1) & 255;
              }
              if (rt.inS(C_ALIGN.EVIL_ALIGNMENTS, U8[p + 160])) {
                hasEvil = true;
              }
              if (CharHlp.GetClassLevel(p, 8) > 0) {
                paladin = p;
              }
              p = r32(p + 260);
            }
            newPaladin = CharHlp.GetClassLevel(creature, 8) > 0;
            newRanger = CharHlp.GetClassLevel(creature, 16) > 0;
            newEvil = rt.inS(C_ALIGN.EVIL_ALIGNMENTS, U8[creature + 160]);
            if ((p === 0) && (((newPaladin && hasEvil) || (newRanger && (rangers >= 3))) || (newEvil && (paladin !== 0)))) {
              wS(r32($f0 + 4), 40, rt.Delete(rS(r32($f0 + 4)), 1, 2));
              if (newPaladin && hasEvil) {
                (await TextRend.DisplayAndPause(14, "paladins do not join with evil scum"));
              } else if (newRanger && (rangers >= 3)) {
                (await TextRend.DisplayAndPause(14, "too many rangers in party"));
              } else {
                (await TextRend.DisplayAndPause(14, rS(paladin) + " will tolerate no evil!"));
              }
              (await Border.ClearBox(0, 24, 39, 24));
              SaveLoad.FreeCreature(creature);
            } else if (((p === 0) && (r16(r32(141151) + 1660) < 8)) && (CharHlp.IsNpc(creature) || (nonNpc < 6))) {
              SaveLoad.AddCharToParty(creature);
              (await SaveLoad.LoadCharIconAnim(true));
              if (!CharHlp.IsNpc(creature)) {
                nonNpc = (nonNpc + 1) & 255;
              }
            } else {
              if (p === 0) {
                wS(r32($f0 + 4), 40, rt.Copy(rS(r32($f0 + 4)), 3, U8[r32($f0 + 4)] - 2));
              }
              SaveLoad.FreeCreature(creature);
            }
          }
        }
      }
    }
  } while (!((((key === 69) || (key === 0)) || (nonNpc >= 6)) || (r16(r32(141151) + 1660) >= 8)));
  (await SaveLoad.SaveCharlist(r32($f0), ""));
  MenuCore.FreeStringList($f0);
  S.sp = $sp;
}

export async function ShowRaceInfo(race: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 264);
  let i: number = 0, slot: number = 0, cnt: number = 0, cls: number = 0, row: number = 0, adj: number = 0, p: number = 0, part: number = 0, lvl: number = 0, hasMulti: boolean = false;
  (await Border.ClearBox(23, 2, 38, 7));
  (await Border.ClearBox(1, 11, 38, 21));
  if ((race < 1) || (race > 7)) {
    { S.sp = $sp; return; }
  }
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    i = $i1;
    TextRend.DisplayString(19, 2 + i, 10, rS(i * 4 + 132384));
    adj = I8[race * 6 + i + 253839];
    if (adj > 0) {
      wS($f0, 255, "+" + StrUtil.NumStr(adj));
    } else if (adj < 0) {
      wS($f0, 255, "-" + StrUtil.NumStr(-adj));
    } else {
      wS($f0, 255, " 0");
    }
    TextRend.DisplayString(23, 2 + i, 10, rS($f0));
  }
  rt.fill($f0 + 256, 8, 0);
  hasMulti = false;
  cnt = I8[race * 14 + 229905] & 255;
  if (cnt > 13) {
    cnt = 13;
  }
  row = 13;
  for (let $i2 = 1, $e2 = cnt; $i2 <= $e2; $i2++) {
    slot = $i2;
    cls = I8[race * 14 + slot + 229905];
    if ((cls >= 0) && (cls <= 16)) {
      wS($f0, 255, "");
      for (let $i3 = 1; $i3 <= 3; $i3++) {
        p = $i3;
        part = I8[cls * 3 + p + 140376];
        if ((part >= 0) && (part <= 7)) {
          U8[$f0 + part + 256] = true ? 1 : 0;
          if (rS($f0) !== "") {
            wS($f0, 255, rS($f0) + "/");
          }
          wS($f0, 255, rS($f0) + rS(part * 3 + 253974));
        }
      }
      if ((cls > 7) && (row <= 21)) {
        hasMulti = true;
        TextRend.DisplayString(21, row, 10, rt.Copy(rS($f0), 1, 18));
        row = (row + 1) & 255;
      }
    }
  }
  TextRend.DisplayString(2, 11, 13, "Max");
  TextRend.DisplayString(7, 11, 13, "Class");
  if (hasMulti) {
    TextRend.DisplayString(21, 11, 13, "Multiclasses");
  }
  row = 13;
  for (let $i4 = 0; $i4 <= 7; $i4++) {
    part = $i4;
    if ((U8[$f0 + part + 256] !== 0) && (row <= 19)) {
      lvl = I8[race * 8 + part + 253990];
      if ((lvl > 0) && (U8[141187] === 0)) {
        lvl = 0;
      }
      if (lvl === 0) {
        wS($f0, 255, "U");
      } else if (lvl > 0) {
        wS($f0, 255, StrUtil.NumStr(lvl));
      } else {
        wS($f0, 255, "-");
      }
      TextRend.DisplayString(3, row, 10, rS($f0));
      TextRend.DisplayString(7, row, 10, rt.Copy(rS(part * 26 + 131942), 1, 13));
      row = (row + 1) & 255;
    }
  }
  if (hasMulti) {
    TextRend.DisplayString(2, 20, 10, "Multiclass levels");
    TextRend.DisplayString(4, 21, 10, "are as above.");
  }
  S.sp = $sp;
}
