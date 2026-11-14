// Generated from src/sage.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Types from './types';
import * as C_DATA from './c_data';
import * as DiskRec from './diskrec';
import * as GameVars from './gamevars';
import * as DaxIo from './daxio';
import * as DataArc from './dataarc';
import * as EclMenu from './eclmenu';
import * as SaveLoad from './saveload';
import * as Bestiary from './bestiary';
import * as BeastFil from './beastfil';
import * as BeastMnu from './beastmnu';
import * as Money from './money';
import * as MoneyCal from './moneycal';
import * as MenuCore from './menucore';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as StrUtil from './strutil';

export const MENU = "~Ask ~Leave";
export const CHOICE_ASK = 0;
export const CHOICE_LEAVE = 1;

export async function SageMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let b: number = 0, choice: number = 0;
  wS($f0, 255, "THE SAGE LOOKS UP FROM THE ANCIENT TOME SHE IS STUDYING. 'KNOWLEDGE IS A WEAPON. NAME YOUR FOE, AND I CAN SHARPEN YOUR BLADE.'");
  do {
    (await Say(rS($f0)));
    choice = (await EclMenu.MenuHorizontalCharacterSelect("", MENU, 13, 10, 15, true, false)) & 255;
    if (choice === 0) {
      b = (await BeastMnu.PickBeast("Ask about: "));
      (await Redraw());
      if (b === 0) {
        wS($f0, 255, "'IS THERE SOMETHING YOU WOULD ASK ABOUT?'");
      } else {
        wS($f0, 255, (await Consult(b)));
      }
    }
  } while (!(choice === 1));
  CharDisp.ClearMessageWindow();
  S.sp = $sp;
}

export async function FindNamed(archive: string, wanted: number, id: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 47);
  let n: number = 0, found: boolean = false, ended: boolean = false, suppressed: boolean = false, $r0: boolean = false;
  found = false;
  suppressed = (U8[229633] !== 0);
  U8[229633] = true ? 1 : 0;
  if ((await DaxIo.OpenDax(DaxIo.FolderOf(archive) + archive, ".DAX", $f0 + 16, $f0, $f0 + 8))) {
    ended = false;
    while (!found && !ended) {
      n = rt.BlockRead($f0 + 8, $f0 + 18, 9, true) & 65535;
      ended = (n < 9) || (rt.FilePos($f0 + 8) >= r16($f0 + 16));
      if (((n === 9) && (U8[$f0 + 18] < 253)) && (r16($f0 + 23) >= 285)) {
        if (DaxIo.ReadBlock($f0, r16($f0 + 16), ri32($f0 + 19), r16($f0 + 25), r16($f0 + 23), $f0 + 27)) {
          if ((I8[r32($f0 + 27)] & 255) <= 15) {
            mv($f0 + 31, r32($f0 + 27), 16);
            found = rS($f0 + 31) === rS(wanted);
          }
          rt.freeMem(r32($f0 + 27));
          if (found) {
            U8[id] = U8[$f0 + 18];
          }
        }
      }
    }
    DaxIo.CloseDax($f0, $f0 + 8);
  }
  U8[229633] = suppressed ? 1 : 0;
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export async function FindRecord(name_: number, disk: number, id: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let found: boolean = false, $r0: boolean = false;
  found = false;
  U8[disk] = 1;
  if ((await DaxIo.FamilyUsable(10))) {
    if ((await FindNamed(DataArc.MergedName(10), name_, $f0))) {
      while (!found && (U8[disk] <= 8)) {
        U8[id] = 0;
        do {
          found = (DaxIo.RemapId(10, U8[disk], U8[id]) === U8[$f0]) && DataArc.HasBlock(rS(229377) + DataArc.SourceFile(10, U8[disk]), U8[id]);
          if (!found) {
            U8[id] = U8[id] + 1;
          }
        } while (!(found || (U8[id] === 253)));
        if (!found) {
          U8[disk] = U8[disk] + 1;
        }
      }
    }
  } else {
    while (!found && (U8[disk] <= 8)) {
      found = (await FindNamed(DataArc.SourceName(10, U8[disk]), name_, id));
      if (!found) {
        U8[disk] = U8[disk] + 1;
      }
    }
  }
  $r0 = found;
  S.sp = $sp;
  return $r0;
}

export async function LoadKind(b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 55);
  let saved: number = 0, $r0: number = 0;
  w32($f0 + 2, 0);
  wS($f0 + 14, 40, rS(b));
  if ((await FindRecord($f0 + 14, $f0, $f0 + 1))) {
    saved = U8[229120];
    U8[229120] = U8[$f0];
    (await EclMenu.InitCreature(U8[$f0 + 1], $f0 + 2, $f0 + 6, $f0 + 10));
    U8[229120] = saved;
  }
  $r0 = r32($f0 + 2);
  S.sp = $sp;
  return $r0;
}

export async function Say(s: string) {
  (await CharDisp.MessageText(s, 10, true));
}

export async function Redraw() {
  TextRend.ClearRect(0, 0, 39, 24);
  (await CharDisp.DisplayNoncombatInterface());
  (await EclMenu.DisplayPortrait(U8[248650], U8[248651]));
}

export async function Consult(b: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let creature: number = 0, fee: number = 0, $r0: string = "";
  creature = (await LoadKind(b));
  if (creature === 0) {
    $r0 = "'" + rS(b) + "? I HAVE NOT HEARD OF ANY SUCH CREATURE.'";
  } else {
    mv($f0, b, 32);
    if (!BeastFil.Tell($f0, creature)) {
      if (ri32($f0 + 16) !== ri32(b + 16)) {
        mv(b, $f0, 32);
        U8[236562] = true ? 1 : 0;
      }
      $r0 = "'YOU KNOW AS MUCH AS I DO ABOUT " + rS(b) + ".'";
    } else {
      fee = MoneyCal.SageFee(I8[creature + 115]) & 65535;
      (await Say("'" + rS(b) + "? FOR " + StrUtil.Count(fee, "GOLD PIECE", "GOLD PIECES") + " I WILL TELL YOU ALL I KNOW.'"));
      if ((await MenuCore.YesNoMenu("pay the sage ", 13, 15, 10)) !== 89) {
        $r0 = "'AS YOU WISH.'";
      } else if (!(await Money.PayGold(r32(229635), fee))) {
        $r0 = "'COME BACK WHEN YOU HAVE THE GOLD.'";
      } else {
        mv(b, $f0, 32);
        U8[236562] = true ? 1 : 0;
        (await Say("SHE TAKES A TOME DOWN FROM A SHELF FILLED WITH MANY OTHERS, AND READS ALOUD."));
        (await CharDisp.MessageWait());
        (await BeastMnu.ShowEntry(b));
        (await Redraw());
        $r0 = "'IS THERE ANOTHER THAT STANDS AGAINST YOU?'";
      }
    }
    SaveLoad.FreeCreature(creature);
  }
  S.sp = $sp;
  return $r0;
}
