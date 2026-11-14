// Generated from src/combat.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_TIME from './c_time';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as GameIo from './gameio';
import * as Crt from './crt';
import * as CombatAi from './combatai';
import * as CombatSt from './combatst';
import * as Magic from './magic';
import * as C_KEYS from './c_keys';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as Options from './options';
import * as Stats from './stats';
import * as Blit from './blit';
import * as Border from './border';
import * as CbtActs from './cbtacts';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as FxEngine from './fxengine';
import * as MenuCore from './menucore';
import * as ViewChar from './viewchar';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as CharDisp from './chardisp';
import * as Dice from './dice';
import * as CbtLog from './cbtlog';
import * as LogView from './logview';
import * as ClassCal from './classcal';
import * as MapTiles from './maptiles';
import * as CbtMini from './cbtmini';
import * as C_ITEM from './c_item';
import * as WideView from './wideview';

export const SHOW_LOG = 255;
export const SHOW_MAP = 254;
export const READY_SET_1 = 252;
export const READY_SET_2 = 253;

export async function CombatMain() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let endNoticed: boolean = false;
  U8[227062] = 5;
  w32(231530, 31);
  CbtLog.Clear(U8[227092], U8[227091] !== 0);
  (await CombatSt.CombatStart());
  U8[$f0] = false ? 1 : 0;
  endNoticed = false;
  CharHlp.CountTeams();
  if (CharHlp.SideEmpty()) {
    U8[$f0] = true ? 1 : 0;
  }
  while (!(U8[$f0] !== 0) && !(await GameIo.DemoEnding())) {
    CbtLog.Heading(15, "Round " + StrUtil.NumStr(U8[232345] + 1));
    CharHlp.CountTeams();
    w32($f0 + 1, r32(229639));
    while (r32($f0 + 1) !== 0) {
      (await CbtActs.BeginRound(r32($f0 + 1)));
      w32($f0 + 1, r32(r32($f0 + 1) + 260));
    }
    w16(r32(227037) + 1430, 0);
    NextCreature($f0 + 1);
    while (((r32($f0 + 1) !== 0) && !(U8[$f0] !== 0)) && !(await GameIo.DemoEnding())) {
      (await CreatureAction(r32($f0 + 1)));
      CharHlp.CountTeams();
      if (CharHlp.SideEmpty() && !endNoticed) {
        U8[$f0] = true ? 1 : 0;
        endNoticed = true;
      } else {
        NextCreature($f0 + 1);
      }
    }
    if (!(await GameIo.DemoEnding())) {
      (await EndOfRound($f0));
    }
  }
  (await CombatDoneCleanup());
  S.sp = $sp;
}

export async function BandageDying(bandage: boolean) {
  let p: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  p = r32(229639);
  while (p !== 0) {
    if (((U8[r32(p + 264) + 19] === 0) && (I8[p + 270] === 0)) && (U8[p + 268] === 5)) {
      found = true;
      if (bandage) {
        U8[p + 268] = 4;
        U8[r32(p + 264) + 14] = 0;
        (await CharDisp.PrintNameString(p, "is bandaged", 10, true));
        bandage = false;
      }
    }
    p = r32(p + 260);
  }
  $r0 = found;
  return $r0;
}

export function NextCreature(next: number) {
  let best: number = 0, bestRoll: number = 0, roll: number = 0, p: number = 0;
  best = 0;
  bestRoll = 0;
  p = r32(229639);
  while (p !== 0) {
    roll = Dice.RollDice(1, 100) & 255;
    if (I8[r32(p + 264) + 3] > best) {
      bestRoll = roll;
    }
    if ((I8[r32(p + 264) + 3] >= best) && (roll >= bestRoll)) {
      bestRoll = roll;
      best = I8[r32(p + 264) + 3] & 255;
      w32(next, p);
    }
    p = r32(p + 260);
  }
  if (best === 0) {
    w32(next, 0);
  }
}

export async function CreatureAction(creature: number) {
  CbtActs.ResetFlanking(creature);
  U8[r32(creature + 264) + 7] = 0;
  (await FxEngine.TriggerEffectsWithCondition(7, creature));
  if (I8[r32(creature + 264) + 3] <= 0) {
    return;
  }
  if (I8[r32(creature + 264) + 3] === 20) {
    U8[r32(creature + 264) + 3] = 19;
  }
  w32(229635, creature);
  (await CbtMap.DisplayMapViewCentered(creature, 2, true));
  CharHlp.RecalcStats(creature);
  (await CharDisp.CombatPrintCreatureInfo(creature));
  (await FxEngine.TriggerEffectsWithCondition(15, creature));
  if (I8[r32(creature + 264) + 3] > 0) {
    if (U8[creature + 271] !== 0) {
      (await CombatAi.CombatAiControl(creature));
    } else {
      (await ManualControl(creature));
    }
  }
  (await CbtMap.RedrawArenaCell(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature)));
}

export async function ManualControl(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let p: number = 0, spell: number = 0;
  if (U8[creature + 269] !== 0) {
    if (U8[r32(creature + 264)] > 0) {
      spell = U8[r32(creature + 264)];
      U8[r32(creature + 264)] = 0;
      (await Magic.CastSpell(spell, false, true, $f0 + 1));
      U8[$f0 + 1] = CharHlp.EndActions(creature) ? 1 : 0;
    } else {
      U8[$f0 + 1] = false ? 1 : 0;
      while (!(U8[$f0 + 1] !== 0)) {
        (await CombatMenu(creature, $f0));
        switch (U8[$f0]) {
          case 77: {
            (await MoveMenu(creature, $f0 + 1));
            break;
          }
          case 86: {
            (await ViewChar.ViewCharMenu($f0 + 1));
            (await CbtActs.RecalcAttacksLeft(creature));
            if (!(U8[$f0 + 1] !== 0)) {
              (await CharDisp.DisplayCombatInterface());
            }
            break;
          }
          case 65: {
            (await CbtActs.CombatAimMenu(creature, 255, 1, 0, false, $f0 + 1, $f0 + 2));
            break;
          }
          case 85: {
            (await ViewChar.UseItemMenu($f0 + 1));
            (await CbtActs.RecalcAttacksLeft(creature));
            if (!(U8[$f0 + 1] !== 0)) {
              (await CharDisp.DisplayCombatInterface());
            }
            break;
          }
          case 67: {
            (await CbtActs.CastSpellCombat(0, 0, $f0 + 1));
            break;
          }
          case 84: {
            (await CbtActs.CombatTurnUndead(creature));
            U8[$f0 + 1] = CharHlp.EndActions(creature) ? 1 : 0;
            break;
          }
          case 81: {
            TurnOnAuto(creature);
            TextRend.ClearBottomLine();
            (await Crt.Delay(200));
            U8[$f0 + 1] = true ? 1 : 0;
            (await CombatAi.CombatAiControl(creature));
            break;
          }
          case 68: {
            (await DoneMenu(creature, $f0 + 1));
            break;
          }
          case 252: case 253: {
            if ((await FxEngine.ReadySet(creature, (1 + U8[$f0]) - 252))) {
              (await CbtActs.RecalcAttacksLeft(creature));
            }
            break;
          }
          case 255: {
            (await LogView.ShowLog("Combat Messages"));
            (await CharDisp.DisplayCombatInterface());
            break;
          }
          case 254: {
            if ((U8[235217] !== 0)) {
              (await TextRend.FlashBottomLine(10, "No minimap in the Wide View"));
            } else {
              U8[227082] = (U8[227082] === 0 ? 1 : 0);
              Options.SaveOptions();
            }
            break;
          }
          case 50: {
            (await CombatAi.ToggleQuickMagic());
            break;
          }
          case 32: {
            CombatAi.AllToManual();
            break;
          }
          case 16: {
            U8[r32(creature + 264) + 3] = 20;
            p = r32(229639);
            while (p !== 0) {
              TurnOnAuto(p);
              p = r32(p + 260);
            }
            TextRend.ClearBottomLine();
            (await Crt.Delay(200));
            U8[$f0 + 1] = true ? 1 : 0;
            break;
          }
          case 45: {
            if ((await CbtActs.VictoryCheat())) {
              (await CbtMap.DisplayMapViewCentered(creature, 3, false));
              U8[$f0 + 1] = true ? 1 : 0;
            } else {
              (await CharDisp.PrintBottomLine("That doesn't work"));
            }
            break;
          }
        }
        if (!(U8[$f0 + 1] !== 0)) {
          (await CbtMap.DisplayMapViewCentered(creature, 2, true));
          (await CharDisp.CombatPrintCreatureInfo(creature));
        }
      }
    }
  } else {
    U8[$f0 + 1] = CharHlp.EndActions(creature) ? 1 : 0;
  }
  S.sp = $sp;
}

export async function CombatMenu(creature: number, ch: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let i: number = 0, hasSpell: boolean = false, sets: boolean = false;
  wS($f0, 40, "");
  if (U8[r32(creature + 264) + 6] > 0) {
    wS($f0, 40, rS($f0) + "Move ");
  }
  wS($f0, 40, rS($f0) + "View Aim ");
  if (U8[creature + 199] > 0) {
    wS($f0, 40, rS($f0) + "Use ");
  }
  hasSpell = false;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    i = $i1;
    if (CharHlp.MemorizedAt(creature, i) > 0) {
      hasSpell = true;
    }
  }
  if (((hasSpell && (U8[r32(creature + 264) + 1] !== 0)) || CharHlp.HasScrollSpells(creature)) && !CharHlp.AntiMagicArea()) {
    wS($f0, 40, rS($f0) + "Cast ");
  }
  if ((ClassCal.TurnLevel(creature) > 0) && (U8[r32(creature + 264) + 17] === 0)) {
    wS($f0, 40, rS($f0) + "Turn ");
  }
  wS($f0, 40, rS($f0) + "Quick Done");
  sets = HasSets(creature);
  if (sets && ((U8[$f0] + 4) <= 40)) {
    wS($f0, 40, rS($f0) + " 1 2");
  }
  (await CbtMini.Show(creature, -1, -1));
  let $t5;
  do {
    if (sets) {
      wS(235275, 16, "12");
    }
    U8[ch] = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, true, false, $f0 + 41));
    let $t4;
    if ((U8[$f0 + 41] !== 0)) {
      let $t3;
      if ((U8[ch] === 65) && CbtLog.Active()) {
        U8[ch] = 255;
      } else if (U8[ch] === 61) {
        U8[ch] = 254;
      } else if (!($t3 = U8[ch], $t3 === 16 || $t3 === 45 || $t3 === 50)) {
        U8[ch] = 0;
      }
    } else if (sets && ($t4 = U8[ch], $t4 === 49 || $t4 === 50)) {
      U8[ch] = ((252 + U8[ch]) - 49) & 255;
    }
  } while (!(($t5 = U8[ch], $t5 === 16 || $t5 === 32 || $t5 === 45 || $t5 === 50 || $t5 === 255 || $t5 === 254 || $t5 === 252 || $t5 === 253 || $t5 === 65 || $t5 === 67 || $t5 === 68 || $t5 === 77 || $t5 === 81 || $t5 === 84 || $t5 === 85 || $t5 === 86)));
  S.sp = $sp;
}

export async function EndOfRound(done: number) {
  let p: number = 0;
  (await FxEngine.AdvanceTime(1, 1));
  U8[232345] = U8[232345] + 1;
  CbtActs.UpdateHostileHpPercent();
  p = r32(229639);
  while (p !== 0) {
    (await FxEngine.TriggerEffectsWithCondition(19, p));
    (await FxEngine.ConsiderStinkingCloud(p));
    (await Magic.ConsiderCloudkill(p));
    if (U8[p + 268] === 5) {
      let $t2;
      $t2 = r32(p + 264) + 14, U8[$t2] = U8[$t2] + 1;
      if (U8[r32(p + 264) + 14] > 9) {
        U8[p + 268] = 6;
        Stats.Death(p);
      }
    }
    p = r32(p + 260);
  }
  if ((await BandageDying(false))) {
    (await CharDisp.PrintBottomLine("Your Teammate is Dying"));
  }
  CharHlp.CountTeams();
  (await CbtMap.ScrollView(CbtMap.CenterX(), CbtMap.CenterY(), 255, 8));
  U8[done] = CharHlp.SideEmpty() ? 1 : 0;
  if (((U8[230780] > 0) && (U8[230781] === 0)) && !(U8[227098] !== 0)) {
    if ((await MenuCore.YesNoMenu("Continue Battle:", 13, 10, 15)) === 89) {
      U8[done] = false ? 1 : 0;
    }
  }
}

export async function MoveMenu(creature: number, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let savedMove: number = 0, savedDir: number = 0, startX: number = 0, startY: number = 0, dir: number = 0, ch: number = 0, attacksLeft: number = 0;
  savedMove = U8[r32(creature + 264) + 6];
  savedDir = U8[r32(creature + 264) + 9];
  startX = CbtMap.CombatCellX(creature) << 24 >> 24;
  startY = CbtMap.CombatCellY(creature) << 24 >> 24;
  ch = 32;
  U8[done] = false ? 1 : 0;
  dir = 8;
  while (((U8[r32(creature + 264) + 6] > 1) && (ch !== 0)) && (ch !== 13)) {
    Border.ClearBox(24, 24, 39, 24);
    (await CbtMini.Show(creature, -1, -1));
    U8[235273] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("Move/Attack, Move Left = " + StrUtil.NumStr(Math.trunc(U8[r32(creature + 264) + 6] / 2)) + " ", "", 10, 10, 15, true, false, 255709)) & 255;
    switch (ch) {
      case 0: {
        U8[r32(creature + 264) + 6] = savedMove;
        if (CbtMap.CombatSlot(creature) > 0) {
          (await CbtMap.UpdateCombatMapTile(0, 0, CbtMap.CombatSlot(creature)));
        }
        U8[done] = CbtMap.IsValidCreatureLoc(creature, startX, startY, false) === false ? 1 : 0;
        (await CbtMap.ScrollView(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), 0, 8));
        U8[r32(creature + 264) + 9] = savedDir;
        dir = 8;
        break;
      }
      default: {
        dir = CbtActs.DirOfKey(ch) & 255;
      }
    }
    if (dir < 8) {
      (await CbtMap.SetCreatureFacing(creature, dir, 0, 0));
      CbtMap.ProbeDirection(creature, dir, $f0, $f0 + 1);
      if (U8[$f0] > 0) {
        attacksLeft = U8[creature + 275] + U8[creature + 276];
        (await MeleeAttack(creature, r32(U8[$f0] * 4 + 230178), done));
        if ((U8[creature + 275] + U8[creature + 276]) !== attacksLeft) {
          savedMove = U8[r32(creature + 264) + 6];
          savedDir = U8[r32(creature + 264) + 9];
          startX = CbtMap.CombatCellX(creature) << 24 >> 24;
          startY = CbtMap.CombatCellY(creature) << 24 >> 24;
        }
      } else if (U8[$f0 + 1] === 0) {
        switch ((await MenuCore.YesNoMenu("Flee:", 13, 10, 15))) {
          case 89: {
            U8[done] = (await CbtActs.AttemptFlee(creature)) ? 1 : 0;
            break;
          }
          case 78: {
            U8[done] = false ? 1 : 0;
            break;
          }
        }
      } else if (U8[U8[$f0 + 1] * 3 + 218828] > U8[r32(creature + 264) + 6]) {
        (await CharDisp.PrintBottomLine("Blocked"));
      } else {
        if ((await CbtActs.StepCreature(creature, dir))) {
          U8[done] = true ? 1 : 0;
        }
      }
    }
  }
  if (U8[r32(creature + 264) + 6] < 2) {
    U8[r32(creature + 264) + 6] = 0;
  }
  S.sp = $sp;
}

export async function MeleeAttack(att: number, def: number, done: number) {
  if (CharHlp.HasRangedWeapon(att) && !CharHlp.HasThrowableWeapon(att)) {
    (await CharDisp.PrintBottomLine("Not with that weapon"));
  } else if ((await CbtActs.CheckAttackAlly(att, def))) {
    w32(r32(att + 264) + 10, def);
    if ((await CbtActs.SweepAttack(att, def))) {
      U8[done] = true ? 1 : 0;
    } else {
      CbtActs.NoteAttackDirection(att, def);
      (await CbtActs.MakeAttack(att, def, false, 0, done));
    }
  }
}

export async function DoneMenu(creature: number, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let ch: number = 0;
  U8[done] = false ? 1 : 0;
  wS($f0, 40, "");
  if (!CharHlp.HasRangedWeapon(creature) || CharHlp.HasThrowableWeapon(creature)) {
    wS($f0, 40, rS($f0) + "Guard ");
  }
  wS($f0, 40, rS($f0) + "Delay Quit ");
  if ((await BandageDying(false))) {
    wS($f0, 40, rS($f0) + "Bandage ");
  }
  wS($f0, 40, rS($f0) + "Speed Exit");
  ch = 32;
  while (!(ch === 0 || ch === 69) && !(U8[done] !== 0)) {
    ch = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, false, false, 255709)) & 255;
    switch (ch) {
      case 71: {
        U8[done] = CharHlp.Guard(creature) ? 1 : 0;
        (await CharDisp.PrintActionLine(creature, "Guarding", "is Guarding"));
        break;
      }
      case 68: {
        U8[r32(creature + 264) + 3] = 1;
        U8[done] = true ? 1 : 0;
        break;
      }
      case 81: {
        U8[done] = CharHlp.EndActions(creature) ? 1 : 0;
        break;
      }
      case 66: {
        if ((await BandageDying(true))) {
        }
        U8[done] = CharHlp.EndActions(creature) ? 1 : 0;
        break;
      }
      case 83: {
        (await SpeedMenu());
        break;
      }
    }
  }
  S.sp = $sp;
}

export async function SpeedMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 82);
  let ch: number = 0, speed: number = 0;
  speed = U8[227049];
  ch = 32;
  while (!(ch === 0 || ch === 69)) {
    wS($f0 + 41, 40, "GameSpeed (" + StrUtil.NumStr(U8[227049]) + ") :");
    wS($f0, 40, " ");
    if (U8[227049] < 9) {
      wS($f0, 40, rS($f0) + "Slower ");
    }
    if (U8[227049] > 0) {
      wS($f0, 40, rS($f0) + "Faster ");
    }
    wS($f0, 40, rS($f0) + "Exit");
    ch = (await MenuCore.MenuHorizontal(rS($f0 + 41), rS($f0), 13, 10, 15, false, false, 255709)) & 255;
    switch (ch) {
      case 83: {
        U8[227049] = U8[227049] + 1;
        break;
      }
      case 70: {
        U8[227049] = U8[227049] - 1;
        break;
      }
    }
  }
  if (U8[227049] !== speed) {
    Options.SaveOptions();
  }
  S.sp = $sp;
}

export function TurnOnAuto(creature: number) {
  U8[creature + 271] = 1;
  if ((r32(r32(creature + 264) + 10) !== 0) && (I8[r32(r32(creature + 264) + 10) + 270] === I8[creature + 270])) {
    w32(r32(creature + 264) + 10, 0);
  }
}

export async function CombatDoneCleanup() {
  let p: number = 0;
  while (r32(232339) !== 0) {
    p = r32(r32(232339) + 4);
    rt.freeMem(r32(232339));
    w32(232339, p);
  }
  rt.freeMem(r32(230527));
  w32(230527, 0);
  Blit.FreePic(232419);
  MapTiles.FreeCloudkillArt();
  if ((U8[235217] !== 0)) {
    (await WideView.Leave());
    CbtMap.SetLayout(false);
  }
  CbtMap.SetNoncombatPalette();
  w32(231530, 32);
}

export function HasSets(creature: number) {
  let item: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  item = r32(creature + 200);
  while (item !== 0) {
    if (U8[item + 63] !== 0) {
      found = true;
    }
    item = r32(item + 42);
  }
  $r0 = found;
  return $r0;
}
