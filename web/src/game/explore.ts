// Generated from src/explore.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_TIME from './c_time';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as SoundDrv from './sounddrv';
import * as Camp from './camp';
import * as ViewChar from './viewchar';
import * as JrnlView from './jrnlview';
import * as View3D from './view3d';
import * as MapTiles from './maptiles';
import * as C_ECL from './c_ecl';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_STATUS from './c_status';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_SOUND from './c_sound';
import * as C_SPELL from './c_spell';
import * as SaveLoad from './saveload';
import * as Blit from './blit';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as FxEngine from './fxengine';
import * as MenuCore from './menucore';
import * as Portrait from './portrait';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as Party from './party';
import * as Dice from './dice';
import * as CompTool from './comptool';
import * as KeyHelp from './keyhelp';
import * as BeastMnu from './beastmnu';
import * as Magic from './magic';
import * as JrnlSeen from './jrnlseen';
import * as Wilds from './wilds';
import * as CharGen from './chargen';


export const $at = { quickLoadAsked: 250681, bottomMessageCleared: 250682, doorOpen: 253591, moveMode: 253594 };

export async function ResolveMovement() {
  let moved: boolean = false, barrier: number = 0;
  moved = false;
  switch (U8[141223]) {
    case 1: {
      if (r16(r32(141151) + 1426) < 255) {
        barrier = View3D.GetBarrierType(I8[145546], I8[145547], U8[145548]) & 255;
        switch (barrier) {
          case 1: {
            moved = true;
            break;
          }
          case 2: case 3: {
            moved = (await DoorMenu(barrier === 3));
            break;
          }
        }
        if (moved) {
          (await MovePartyForward3D());
        } else {
          (await SoundDrv.SoundEffect(r16(132901), 16));
        }
        (await CharDisp.PrintMiscInfo());
      } else {
        w16(r32(141151) + 1426, 0);
      }
      break;
    }
    case 2: case 3: case 4: {
      if (r16(r32(141151) + 1426) < 255) {
        (await MovePartyWilderness());
        (await CharDisp.PrintMiscInfo());
      } else {
        w16(r32(141151) + 1426, 0);
      }
      break;
    }
  }
  Portrait.FreeAnimation(145563);
  Blit.FreePic(145630);
  Blit.FreePic(145636);
  U8[145629] = 255;
  U8[145635] = 255;
}

export async function MapMainMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let done: boolean = false, c: number = 0, wild: boolean = false, $r0: number = 0;
  async function Turn(eighths: number, sound: boolean) {
    U8[145548] = (U8[145548] + eighths) % 8;
    if (sound) {
      (await SoundDrv.SoundEffect(r16(132907), 1));
    }
    U8[145549] = View3D.GetWallType(I8[145546], I8[145547], U8[145548]);
    (await View3D.Display3DMapView(I8[145546], I8[145547], U8[145548]));
  }
  function MoveKey(key: number) {
    let dir: number = 0;
    for (let $i1 = 0; $i1 <= 7; $i1++) {
      dir = $i1;
      if (U8[dir + 253718] === key) {
        U8[145548] = dir;
        done = true;
      }
    }
  }
  async function Arrow(dir: number, eighths: number, sound: boolean, ahead: boolean) {
    if (wild) {
      U8[145548] = dir;
      done = true;
    } else if (ahead) {
      MoveForward();
      done = true;
    } else {
      (await Turn(eighths, sound));
    }
  }
  c = 0;
  w16(r32(141151) + 1426, 0);
  let $t2;
  wild = ($t2 = U8[141223], ($t2 >= 2 && $t2 <= 4));
  if (!wild) {
    (await EndMoveMode());
  }
  if (wild || (U8[141223] === 1)) {
    if (wild && (U8[141222] < 2)) {
      (await MapTiles.LoadWildIcons());
      (await CharDisp.DisplayWildernessInterface());
    }
    done = false;
    do {
      U8[227081] = true ? 1 : 0;
      U8[227103] = true ? 1 : 0;
      U8[227104] = true ? 1 : 0;
      if ((U8[240358] !== 0)) {
        (await CharDisp.SetWildView(true));
      }
      if ((U8[253594] !== 0) && (U8[240359] !== 0)) {
        c = (await MenuCore.MenuHorizontal(CharDisp.MiscInfoText() + " ", rS(253677), 10, 10, 15, true, false, $f0)) & 255;
      } else if ((U8[253594] !== 0)) {
        c = (await MenuCore.MenuHorizontal("", rS(253677), 13, 10, 15, true, false, $f0)) & 255;
      } else if (wild) {
        c = (await MenuCore.MenuHorizontal("", rS(253636), 13, 10, 15, true, false, $f0)) & 255;
      } else {
        c = (await MenuCore.MenuHorizontal("", rS(253595), 13, 10, 15, true, false, $f0)) & 255;
      }
      if (!(U8[$f0] !== 0) && (U8[253594] !== 0)) {
        if (c === 0 || c === 69) {
          (await CharDisp.SetWildView(false));
          (await EndMoveMode());
        }
      } else if (!(U8[$f0] !== 0)) {
        switch (c) {
          case 77: {
            if (wild) {
              U8[253594] = true ? 1 : 0;
              U8[240358] = true ? 1 : 0;
            }
            break;
          }
          case 65: {
            if (JrnlSeen.AreaMapAllowed() || (U8[141208] !== 0)) {
              U8[145545] = !(U8[145545] !== 0) ? 1 : 0;
              (await View3D.Display3DMapView(I8[145546], I8[145547], U8[145548]));
            } else {
              (await TextRend.PrintAndPause("Not Here", 14));
            }
            break;
          }
          case 67: {
            (await Camp.NoncombatCastMenu());
            break;
          }
          case 86: {
            (await ViewChar.ViewCharMenu($f0 + 1));
            break;
          }
          case 74: {
            (await JrnlView.JournalMenu());
            break;
          }
          case 69: {
            done = true;
            break;
          }
          case 83: {
            w16(r32(141151) + 1428, r16(r32(141151) + 1428) ^ 1);
            break;
          }
          case 76: {
            w16(r32(141151) + 1428, r16(r32(141151) + 1428) | 2);
            (await FxEngine.AdvanceTime(1, 2));
            w16(141174, r16(141166));
            done = true;
            break;
          }
        }
      } else if (!(await SideScreen(c, true, wild))) {
        if (((U8[253594] !== 0) && (c !== 63)) && (c !== 66)) {
          MoveKey(c);
        } else {
          switch (c) {
            case 72: {
              (await Arrow(0, 0, false, true));
              break;
            }
            case 80: {
              (await Arrow(4, 4, false, false));
              break;
            }
            case 75: {
              (await Arrow(6, 6, true, false));
              break;
            }
            case 77: {
              (await Arrow(2, 2, true, false));
              break;
            }
            case 63: {
              (await SaveLoad.QuickSave());
              break;
            }
            case 66: {
              done = (await AskQuickLoad());
              break;
            }
            default: {
              Party.SelectPrevNextChar(c);
              (await CharDisp.DisplayParty(r32(143749)));
            }
          }
        }
      }
      (await CharDisp.PrintMiscInfo());
    } while (!(done));
  }
  U8[141222] = U8[141223];
  if (U8[250682] === 0) {
    (await Border.ClearBox(1, 17, 38, 22));
    U8[250682] = 1;
  }
  $r0 = c;
  S.sp = $sp;
  return $r0;
}

export async function SideScreen(c: number, quickKeys: boolean, wild: boolean) {
  let shown: boolean = false, member: number = 0, $r0: boolean = false;
  member = 0;
  switch (c) {
    case 59: case 60: {
      shown = true;
      break;
    }
    case 120: case 121: case 122: case 123: case 124: case 125: case 126: case 127: {
      if (Party.AltMember(c) > 0) {
        member = Party.MemberAt(Party.AltMember(c));
      }
      shown = member !== 0;
      break;
    }
    case 62: {
      shown = U8[141189] !== 0;
      break;
    }
    case 64: {
      shown = U8[141198] !== 0;
      break;
    }
    default: {
      $r0 = false;
      return $r0;
    }
  }
  $r0 = true;
  if (!shown) {
    return $r0;
  }
  (await Wilds.ShowWide(false));
  switch (c) {
    case 59: {
      (await KeyHelp.ShowKeys(quickKeys));
      break;
    }
    case 120: case 121: case 122: case 123: case 124: case 125: case 126: case 127: {
      (await ViewChar.MemberItems(member));
      break;
    }
    case 60: {
      (await BeastMnu.BestiaryMenu());
      break;
    }
    case 62: {
      (await CharGen.TrainAnywhere());
      break;
    }
    case 64: {
      (await CompTool.ToolsMenu());
      break;
    }
  }
  if (U8[141221] !== 0) {
    (await EndMoveMode());
  }
  if (wild) {
    (await CharDisp.DisplayWildernessInterface());
  } else {
    (await CharDisp.DisplayNoncombatInterface());
  }
  return $r0;
}

export function FindKnockCaster(caster: number, scroll: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let p: number = 0, $r0: boolean = false;
  w32(scroll, 0);
  w32(caster, FindCharWithSpell(31));
  p = r32(143753);
  while ((r32(caster) === 0) && (p !== 0)) {
    if ((U8[p + 268] === 0) && CharHlp.CanUseItems(p)) {
      Magic.FindScrollCopies(p, 31, $f0, scroll);
      if (r32(scroll) !== 0) {
        w32(caster, p);
      }
    }
    p = r32(p + 260);
  }
  $r0 = r32(caster) !== 0;
  S.sp = $sp;
  return $r0;
}

export async function ResetGame() {
  rt.fill(253591, 3, 1);
  (await EndMoveMode());
}

export function ChangeBarrierImpassable(x: number, y: number, facing: number) {
  if (!Types.OnMap(x, y)) {
    return;
  }
  switch (facing) {
    case 6: {
      U8[r32(145541) + y * 16 + x + 768] = U8[r32(145541) + y * 16 + x + 768] & 63;
      break;
    }
    case 4: {
      U8[r32(145541) + y * 16 + x + 768] = U8[r32(145541) + y * 16 + x + 768] & 207;
      break;
    }
    case 2: {
      U8[r32(145541) + y * 16 + x + 768] = U8[r32(145541) + y * 16 + x + 768] & 243;
      break;
    }
    case 0: {
      U8[r32(145541) + y * 16 + x + 768] = U8[r32(145541) + y * 16 + x + 768] & 252;
      break;
    }
  }
}

export function ChangeBarrierPassable(x: number, y: number, facing: number) {
  if (!Types.OnMap(x, y)) {
    return;
  }
  switch (facing) {
    case 6: {
      U8[r32(145541) + y * 16 + x + 768] = (U8[r32(145541) + y * 16 + x + 768] & 63) | 64;
      break;
    }
    case 4: {
      U8[r32(145541) + y * 16 + x + 768] = (U8[r32(145541) + y * 16 + x + 768] & 207) | 16;
      break;
    }
    case 2: {
      U8[r32(145541) + y * 16 + x + 768] = (U8[r32(145541) + y * 16 + x + 768] & 243) | 4;
      break;
    }
    case 0: {
      U8[r32(145541) + y * 16 + x + 768] = (U8[r32(145541) + y * 16 + x + 768] & 252) | 1;
      break;
    }
  }
}

export function OpenBarrierAhead() {
  ChangeBarrierPassable(I8[145546], I8[145547], U8[145548]);
  ChangeBarrierPassable(I8[145546] + I8[U8[145548] + 132927], I8[145547] + I8[U8[145548] + 132936], (U8[145548] + 4) % 8);
}

export function PartyHasClass(idx: number) {
  let p: number = 0, found: boolean = false, $r0: boolean = false;
  found = false;
  p = r32(143753);
  while ((p !== 0) && !found) {
    if (CharHlp.GetClassLevel(p, 1 << idx) > 0) {
      found = true;
    }
    p = r32(p + 260);
  }
  $r0 = found;
  return $r0;
}

export function BashDoor() {
  let p: number = 0, success: boolean = false, $r0: boolean = false;
  success = false;
  p = r32(143753);
  while ((p !== 0) && !success) {
    if (U8[p + 268] === 0) {
      {
        const $w2 = p;
        if (View3D.GetBarrierType(I8[145546], I8[145547], U8[145548]) === 3) {
          const $c3 = U8[$w2 + 16];
          if ($c3 === 18) {
            const $c4 = U8[$w2 + 22];
            if (($c4 >= 91 && $c4 <= 99)) {
              if (Dice.RollDice(1, 6) === 1) {
                success = true;
              }
            } else if (($c4 >= 100 && $c4 <= 255)) {
              if (Dice.RollDice(1, 6) <= 2) {
                success = true;
              }
            } else {
              U8[253591] = 0;
            }
          } else if ($c3 === 19 || $c3 === 20) {
            if (Dice.RollDice(1, 6) <= 3) {
              success = true;
            }
          } else if ($c3 === 21 || $c3 === 22) {
            if (Dice.RollDice(1, 6) <= 4) {
              success = true;
            }
          } else if ($c3 === 23) {
            if (Dice.RollDice(1, 6) <= 5) {
              success = true;
            }
          } else if ($c3 === 24) {
            if (Dice.RollDice(1, 8) <= 7) {
              success = true;
            }
          } else if (($c3 >= 25 && $c3 <= 255)) {
            if (Dice.RollDice(1, 10) <= 9) {
              success = true;
            }
          } else {
            U8[253591] = 0;
          }
        } else {
          const $c5 = U8[$w2 + 16];
          if (($c5 >= 3 && $c5 <= 7)) {
            if (Dice.RollDice(1, 6) === 1) {
              success = true;
            }
          } else if (($c5 >= 8 && $c5 <= 15)) {
            if (Dice.RollDice(1, 6) <= 2) {
              success = true;
            }
          } else if (($c5 >= 16 && $c5 <= 17)) {
            if (Dice.RollDice(1, 6) <= 3) {
              success = true;
            }
          } else if ($c5 === 18) {
            const $c6 = U8[$w2 + 22];
            if (($c6 >= 0 && $c6 <= 50)) {
              if (Dice.RollDice(1, 6) <= 3) {
                success = true;
              }
            } else if (($c6 >= 51 && $c6 <= 99)) {
              if (Dice.RollDice(1, 6) <= 4) {
                success = true;
              }
            } else if (($c6 >= 100 && $c6 <= 255)) {
              if (Dice.RollDice(1, 6) <= 5) {
                success = true;
              }
            }
          } else if ($c5 === 19 || $c5 === 20) {
            if (Dice.RollDice(1, 8) <= 7) {
              success = true;
            }
          } else if ($c5 === 21) {
            if (Dice.RollDice(1, 10) <= 9) {
              success = true;
            }
          } else if ($c5 === 22 || $c5 === 23) {
            if (Dice.RollDice(1, 12) <= 11) {
              success = true;
            }
          } else if ($c5 === 24) {
            if (Dice.RollDice(1, 20) <= 19) {
              success = true;
            }
          } else if (($c5 >= 25 && $c5 <= 255)) {
            if (Dice.RollDice(1, 24) <= 23) {
              success = true;
            }
          }
        }
      }
    }
    p = r32(p + 260);
  }
  if (success) {
    OpenBarrierAhead();
  }
  $r0 = success;
  return $r0;
}

export function PickLock() {
  let p: number = 0, success: boolean = false, $r0: boolean = false;
  success = false;
  p = r32(143753);
  while ((p !== 0) && !success) {
    {
      const $w2 = p;
      if ((U8[$w2 + 268] === 0) && (Dice.RollDice(1, 100) <= U8[$w2 + 120])) {
        success = true;
      }
    }
    p = r32(p + 260);
  }
  U8[253592] = 0;
  if (success) {
    OpenBarrierAhead();
  }
  $r0 = success;
  return $r0;
}

export function FindMemorizedSpell(spellId: number, creature: number) {
  let i: number = 0, $r0: number = 0;
  i = 0;
  while ((i <= 47) && (CharHlp.MemorizedAt(creature, i) !== spellId)) {
    i = (i + 1) & 255;
  }
  if (i <= 47) {
    $r0 = i;
  } else {
    $r0 = 255;
  }
  return $r0;
}

export function FindCharWithSpell(spellId: number) {
  let p: number = 0, $r0: number = 0;
  p = r32(143753);
  while ((p !== 0) && ((U8[p + 268] !== 0) || (FindMemorizedSpell(spellId, p) === 255))) {
    p = r32(p + 260);
  }
  $r0 = p;
  return $r0;
}

export async function PartyCastsKnock() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let $r0: boolean = false;
  $r0 = FindKnockCaster($f0, $f0 + 4);
  if (r32($f0) !== 0) {
    if (r32($f0 + 4) === 0) {
      CharHlp.RemoveSpell(r32($f0), 31);
    } else {
      (await Magic.RemoveSpellFromScroll(r32($f0), r32($f0 + 4), 31));
      CharHlp.RecalcStats(r32($f0));
    }
    OpenBarrierAhead();
  }
  S.sp = $sp;
  return $r0;
}

export function MoveForward() {
  let nx: number = 0, ny: number = 0, f: number = 0;
  nx = I8[145546];
  ny = I8[145547];
  f = U8[145548];
  w16(r32(141151) + 1450, 0);
  if (View3D.GetBarrierType(nx, ny, f) !== 0) {
    nx = (nx + I8[f + 132927]) << 16 >> 16;
    ny = (ny + I8[f + 132936]) << 16 >> 16;
    if (nx > 15) {
      U8[145546] = 15;
      w16(r32(141151) + 1450, 1);
    }
    if (nx < 0) {
      U8[145546] = 0;
      w16(r32(141151) + 1450, 1);
    }
    if (ny > 15) {
      U8[145547] = 15;
      w16(r32(141151) + 1450, 1);
    }
    if (ny < 0) {
      U8[145547] = 0;
      w16(r32(141151) + 1450, 1);
    }
  }
}

export async function MovePartyForward3D() {
  if (!(U8[141145] !== 0)) {
    (await SoundDrv.SoundEffect(r16(132907), 1));
  }
  U8[145546] = I8[145546] + I8[U8[145548] + 132927];
  U8[145547] = I8[145547] + I8[U8[145548] + 132936];
  View3D.WrapCoords(145546, 145547);
  U8[145549] = View3D.GetWallType(I8[145546], I8[145547], U8[145548]);
  rt.fill(253591, 3, 1);
  U8[145550] = View3D.GetMapEvent(I8[145546], I8[145547]);
  if ((r16(r32(141151) + 1428) & 1) > 0) {
    (await FxEngine.AdvanceTime(1, 2));
  } else {
    (await FxEngine.AdvanceTime(1, 1));
  }
}

export async function EndMoveMode() {
  U8[253594] = false ? 1 : 0;
  U8[240358] = false ? 1 : 0;
  (await Wilds.ShowWide(false));
}

export async function MovePartyWilderness() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let diagonal: boolean = false;
  switch (Wilds.StepTo(r16(r32(141147) + 390), r16(r32(141147) + 392), U8[145548], U8[U8[141223] + 140166], r16(r32(141147) + 836) === 0, $f0, $f0 + 1)) {
    case 0: {
      diagonal = (I8[$f0] !== r16(r32(141147) + 390)) && (I8[$f0 + 1] !== r16(r32(141147) + 392));
      w16(r32(141147) + 390, I8[$f0]);
      w16(r32(141147) + 392, I8[$f0 + 1]);
      if (diagonal) {
        (await FxEngine.AdvanceTime(18, 3));
      } else {
        (await FxEngine.AdvanceTime(12, 3));
      }
      break;
    }
    case 2: {
      (await TextRend.PrintAndPause("The river's stench drives you back.", 14));
      break;
    }
  }
  S.sp = $sp;
}

export async function AskQuickLoad() {
  let $r0: boolean = false;
  $r0 = SaveLoad.QuickLoadable();
  if (SaveLoad.QuickLoadable()) {
    U8[250681] = true ? 1 : 0;
    (await EndMoveMode());
  } else {
    (await TextRend.DisplayAndPause(14, "There is no quick save."));
    TextRend.ClearBottomLine();
  }
  return $r0;
}

export async function DoorMenu(barred: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 50);
  let $r0: boolean = false;
  $r0 = false;
  wS($f0, 40, "");
  if (U8[253591] !== 0) {
    wS($f0, 40, "Bash");
  }
  if ((U8[253592] !== 0) && PartyHasClass(6)) {
    wS($f0, 40, rS($f0) + " Pick");
  }
  if ((U8[253593] !== 0) && FindKnockCaster($f0 + 42, $f0 + 46)) {
    wS($f0, 40, rS($f0) + " Knock");
  }
  wS($f0, 40, rS($f0) + " Exit");
  if (rS($f0) === " Exit") {
    ChangeBarrierImpassable(I8[145546], I8[145547], U8[145548]);
  } else {
    switch ((await MenuCore.MenuHorizontal("Locked. ", rS($f0), 13, 10, 15, false, false, $f0 + 41))) {
      case 66: {
        $r0 = BashDoor();
        break;
      }
      case 80: {
        if (barred) {
          U8[253592] = 0;
        } else {
          $r0 = PickLock();
        }
        break;
      }
      case 75: {
        $r0 = (await PartyCastsKnock());
        break;
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function $init() {
  U8[250681] = false ? 1 : 0;
  U8[250682] = 0;
  U8[253594] = false ? 1 : 0;
}
