// Generated from src/combatst.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_NPC from './c_npc';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CbtActs from './cbtacts';
import * as SaveLoad from './saveload';
import * as FxEngine from './fxengine';
import * as Portrait from './portrait';
import * as View3D from './view3d';
import * as MapTiles from './maptiles';
import * as Blit from './blit';
import * as GameIo from './gameio';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_SOUND from './c_sound';
import * as SoundDrv from './sounddrv';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as Dice from './dice';
import * as EffHndlr from './effhndlr';
import * as Bestiary from './bestiary';
import * as WideView from './wideview';


export const $at = { quadDir: 258159, terrainCls: 258163, quadFree: 258164, placeX: 258692, placeY: 258694, teamRows: 258696, teamDir: 258698 };

export async function CombatStart() {
  let p: number = 0;
  Portrait.FreeAnimation(231449);
  Blit.FreePic(231516);
  Blit.FreePic(231522);
  U8[231515] = 255;
  U8[231521] = 255;
  TextRend.ClearBottomLine();
  (await TextRend.PauseOnly());
  TextRend.DisplayString(0, 24, 10, "A battle begins...");
  SoundDrv.PlayMusic(22);
  U8[232418] = U8[227078] !== 0 ? 1 : 0;
  U8[232345] = 0;
  U8[230792] = 0;
  U8[230526] = 0;
  w32(232339, 0);
  w32(229647, 0);
  U8[255710] = 0;
  rt.wSet(255674, 0, 32, rt.setR());
  rt.fill(248755, 72, 0);
  rt.fill(230470, 56, 0);
  w16(r32(227037) + 1638, 0);
  if (r16(r32(227037) + 1420) > 100) {
    w16(r32(227037) + 1420, 100);
  }
  (await LoadCombatTileSet());
  (await GameIo.DiscardPendingKeys());
  InitCreatureCombatData();
  (await GameIo.DiscardPendingKeys());
  (await PlaceAllCreatures());
  (await GameIo.DiscardPendingKeys());
  (await CbtActs.UseLeadership());
  (await Blit.AllocPic(24, 3, 4, 1, 232419));
  if (U8[227083] !== 0) {
    CbtMap.SetLayout((await WideView.Enter(144, 38)));
  } else {
    CbtMap.SetLayout(false);
  }
  U8[r32(230527) + 2] = CbtMap.CombatCellX(r32(229639)) - I8[235221];
  U8[r32(230527) + 3] = CbtMap.CombatCellY(r32(229639)) - I8[235222];
  (await CharDisp.DisplayCombatInterface());
  p = r32(229639);
  while (p !== 0) {
    EffHndlr.ResetDisplacement(p);
    Bestiary.Met(p);
    (await FxEngine.TriggerEffectsWithCondition(8, p));
    p = r32(p + 260);
  }
  CbtActs.UpdateHostileHpPercent();
}

export function TerrainClass(ch: number, yarashDone: boolean) {
  let cls: number = 0, $r0: number = 0;
  switch (ch) {
    case 1: case 2: case 40: case 41: case 79: case 80: case 81: case 82: case 83: case 84: case 85: case 86:
    case 91: case 92: case 43: case 241: {
      cls = 1;
      break;
    }
    case 168: case 169: case 170: case 171: case 172: case 173: case 174: case 175: case 176: case 177: {
      cls = 33;
      break;
    }
    case 185: case 187: case 188: case 189: case 190: case 191: case 192: {
      cls = 17;
      break;
    }
    case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 19: case 20: case 21: case 23: case 24:
    case 25: {
      cls = 3;
      break;
    }
    case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 22: case 26: case 27:
    case 28: case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 201: case 202: case 203:
    case 204: case 205: case 206: case 207: case 208: {
      cls = 2;
      break;
    }
    case 209: case 210: case 211: case 212: case 213: {
      cls = 18;
      break;
    }
    case 37: case 57: case 64: case 154: case 155: case 156: case 157: case 158: case 164: case 165: case 180: case 243:
    case 239: case 240: case 250: case 252: {
      cls = 4;
      break;
    }
    case 39: case 42: case 44: case 153: case 159: {
      cls = 5;
      break;
    }
    case 45: case 46: case 51: case 52: case 53: case 54: case 55: case 56: case 67: case 68: case 69: case 70:
    case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 93: case 94: case 95: case 96: case 97: {
      cls = 68;
      break;
    }
    case 181: case 182: case 183: case 184: case 186: case 193: case 194: case 195: case 196: case 197: case 198: case 199:
    case 200: {
      cls = 20;
      break;
    }
    case 47: case 48: case 49: case 50: case 98: case 99: case 100: case 101: case 242: {
      cls = 64;
      break;
    }
    case 38: {
      cls = 65;
      break;
    }
    case 178: case 179: {
      cls = 96;
      break;
    }
    case 58: case 59: case 60: case 65: case 66: {
      cls = 72;
      break;
    }
    case 61: case 62: case 63: case 121: case 122: case 123: case 124: case 135: case 136: case 137: case 139: case 141:
    case 144: case 145: case 146: case 147: case 149: case 151: case 152: case 160: case 161: case 162: case 166: case 167:
    case 214: case 215: case 216: case 238: {
      cls = 8;
      break;
    }
    case 87: case 88: case 89: case 90: case 163: case 224: {
      cls = 136;
      break;
    }
    case 125: case 134: case 138: case 140: case 142: case 143: case 148: case 150: {
      cls = 9;
      break;
    }
    case 126: case 127: case 128: case 129: case 130: case 131: case 132: case 133: case 229: case 230: case 231: {
      cls = 40;
      break;
    }
    case 217: case 218: case 219: case 220: case 221: case 222: case 223: {
      cls = 24;
      break;
    }
    case 78: case 245: case 232: case 233: {
      cls = 32;
      break;
    }
    case 109: case 244: case 246: {
      cls = 128;
      break;
    }
    case 110: case 111: case 112: case 113: case 115: case 116: case 117: case 118: case 119: case 120: {
      cls = 129;
      break;
    }
    case 102: case 103: case 104: case 105: case 106: case 107: case 108: case 114: {
      cls = 144;
      break;
    }
    case 225: case 226: case 227: case 228: case 234: case 235: case 236: case 237: {
      cls = 160;
      break;
    }
    default: {
      cls = 1;
    }
  }
  if (((cls & 128) !== 0) && yarashDone) {
    cls = ((cls - 128) | 1) & 255;
  }
  $r0 = cls;
  return $r0;
}

export function SprinkleRareFeatures() {
  let col: number = 0, row: number = 0, roll: number = 0;
  for (let $i1 = 0; $i1 <= 49; $i1++) {
    col = $i1;
    for (let $i2 = 0; $i2 <= 24; $i2++) {
      row = $i2;
      if (U8[U8[r32(230527) + row * 50 + col + 7] * 3 + 218830] === 22) {
        roll = Dice.RollDice(1, 100) & 255;
        const $c3 = roll;
        if (($c3 >= 1 && $c3 <= 97)) {
        } else if ($c3 === 98) {
          U8[r32(230527) + row * 50 + col + 7] = 26;
        } else if ($c3 === 99) {
          U8[r32(230527) + row * 50 + col + 7] = 27;
        } else if ($c3 === 100) {
          if (U8[232633] !== 10) {
            if (Dice.RollDice(1, 100) === 1) {
              switch (Dice.RollDice(1, 10)) {
                case 1: case 2: case 3: case 4: case 5: case 6: {
                  U8[r32(230527) + row * 50 + col + 7] = 28;
                  break;
                }
                case 7: case 8: case 9: case 10: {
                  U8[r32(230527) + row * 50 + col + 7] = 29;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
}

export function WallBetween(x: number, y: number, dir: number) {
  let k1: number = 0, k2: number = 0, opp: number = 0, $r0: number = 0;
  function GetWallKind(px: number, py: number, pdir: number) {
    let $r1: number = 0;
    if (Types.OnMap(px, py)) {
      if (View3D.GetBarrierType(px, py, pdir) === 0) {
        $r1 = 1;
      } else if (View3D.GetWallType(px, py, pdir) === 0) {
        $r1 = 0;
      } else {
        $r1 = 3;
      }
    } else {
      if ((py === I8[231433]) && ((pdir === 2) || (pdir === 6))) {
        $r1 = 0;
      } else {
        $r1 = 1;
      }
    }
    return $r1;
  }
  opp = (dir + 4) % 8;
  k1 = GetWallKind(x, y, dir) & 255;
  k2 = GetWallKind(x + I8[dir + 218813], y + I8[dir + 218822], opp) & 255;
  $r0 = k1 | k2;
  return $r0;
}

export function BuildDungeonArena() {
  let dx: number = 0, dy: number = 0, cellX: number = 0, cellY: number = 0, wallN: number = 0, wallW: number = 0, wallE: number = 0;
  function PlotCell(i: number, j: number, t: number) {
    let x: number = 0, y: number = 0;
    x = ((((dx * 6) + (dy * 5)) + 21) + i) << 24 >> 24;
    y = (((dy * 5) + 10) + j) << 24 >> 24;
    if ((((x >= 0) && (x <= 49)) && (y >= 0)) && (y <= 24)) {
      U8[r32(230527) + y * 50 + x + 7] = t + 1;
    }
  }
  function DrawFloorWestWall() {
    let c: number = 0, r: number = 0;
    for (let $i1 = 2; $i1 <= 4; $i1++) {
      r = $i1;
      for (let $i2 = 0; $i2 <= 5; $i2++) {
        c = $i2;
        PlotCell(c, r, 22);
      }
    }
    if (wallW === 1) {
      for (let $i3 = 2; $i3 <= 4; $i3++) {
        r = $i3;
        PlotCell(r - 1, r, 4);
        PlotCell(r, r, 3);
        PlotCell(r + 1, r, 13);
      }
    } else if (wallW === 3) {
      PlotCell(1, 2, 8);
      PlotCell(5, 4, 0);
    }
  }
  function DrawNorthWall() {
    if (wallN === 1) {
      PlotCell(3, 0, 5);
      PlotCell(4, 0, 5);
      PlotCell(3, 1, 10);
      PlotCell(4, 1, 10);
    } else {
      PlotCell(3, 0, 22);
      PlotCell(4, 0, 22);
      PlotCell(3, 1, 22);
      PlotCell(4, 1, 22);
    }
  }
  function FillCornerNW() {
    let c1: number = 0, c3: number = 0, c2: number = 0, c4: number = 0, open: boolean = false;
    open = (WallBetween(cellX, cellY - 1, 6) === 0) && (WallBetween(cellX - 1, cellY, 0) === 0);
    switch (wallN) {
      case 0: {
        switch (wallW) {
          case 0: {
            c1 = 22;
            break;
          }
          case 3: {
            c1 = 13;
            break;
          }
          case 1: {
            if (open) {
              c1 = 0;
            } else {
              c1 = 13;
            }
            break;
          }
        }
        break;
      }
      case 3: case 1: {
        if (wallW === 0) {
          if (open) {
            c1 = 15;
          } else {
            c1 = 5;
          }
        } else {
          if (open) {
            c1 = 18;
          } else {
            c1 = 2;
          }
        }
        break;
      }
    }
    switch (wallN) {
      case 0: {
        c2 = 22;
        break;
      }
      case 3: {
        c2 = 17;
        break;
      }
      case 1: {
        c2 = 5;
        break;
      }
    }
    switch (wallW) {
      case 0: {
        if (wallN === 0) {
          c3 = 22;
        } else if (open) {
          c3 = 16;
        } else {
          c3 = 10;
        }
        break;
      }
      case 3: {
        if (open) {
          c3 = 20;
        } else {
          c3 = 7;
        }
        break;
      }
      case 1: {
        if (open) {
          c3 = 1;
        } else {
          c3 = 3;
        }
        break;
      }
    }
    switch (wallW) {
      case 0: case 3: {
        switch (wallN) {
          case 0: {
            c4 = 22;
            break;
          }
          case 3: {
            c4 = 23;
            break;
          }
          case 1: {
            c4 = 10;
            break;
          }
        }
        break;
      }
      case 1: {
        switch (wallN) {
          case 0: {
            c4 = 13;
            break;
          }
          case 3: {
            c4 = 21;
            break;
          }
          case 1: {
            c4 = 6;
            break;
          }
        }
        break;
      }
    }
    PlotCell(1, 0, c1);
    PlotCell(2, 0, c2);
    PlotCell(1, 1, c3);
    PlotCell(2, 1, c4);
  }
  function FillCornerNE() {
    let c1: number = 0, c3: number = 0, c2: number = 0, c4: number = 0, kN: number = 0, kE: number = 0;
    kN = WallBetween(cellX, cellY - 1, 2) & 255;
    kE = WallBetween(cellX + 1, cellY, 0) & 255;
    switch (wallN) {
      case 0: {
        if (kN === 1) {
          c1 = 4;
        } else {
          c1 = 22;
        }
        break;
      }
      case 3: {
        c1 = 15;
        break;
      }
      case 1: {
        c1 = 5;
        break;
      }
    }
    if (wallN === 0) {
      switch (kN) {
        case 0: {
          c2 = 22;
          break;
        }
        case 3: {
          if ((wallE === 0) && (kE !== 0)) {
            c2 = 24;
          } else {
            c2 = 1;
          }
          break;
        }
        case 1: {
          if ((wallE === 0) && (kE !== 0)) {
            c2 = 11;
          } else {
            c2 = 3;
          }
          break;
        }
      }
    } else {
      if (wallE !== 0) {
        c2 = 9;
      } else if (kE !== 0) {
        c2 = 5;
      } else if (kN === 0) {
        c2 = 17;
      } else {
        c2 = 19;
      }
    }
    switch (wallN) {
      case 0: {
        c3 = 22;
        break;
      }
      case 3: {
        c3 = 16;
        break;
      }
      case 1: {
        c3 = 10;
        break;
      }
    }
    if (wallN === 0) {
      if (kN === 0) {
        c4 = 22;
      } else if (wallE !== 0) {
        c4 = 4;
      } else if (kE === 0) {
        c4 = 8;
      } else {
        c4 = 12;
      }
    } else {
      if (wallE !== 0) {
        c4 = 14;
      } else if (kE === 0) {
        c4 = 23;
      } else {
        c4 = 10;
      }
    }
    PlotCell(5, 0, c1);
    PlotCell(6, 0, c2);
    PlotCell(5, 1, c3);
    PlotCell(6, 1, c4);
  }
  for (let $i4 = -2; $i4 <= 2; $i4++) {
    dy = $i4;
    for (let $i5 = -6; $i5 <= 6; $i5++) {
      dx = $i5;
      cellX = (I8[231432] + dx) << 24 >> 24;
      cellY = (I8[231433] + dy) << 24 >> 24;
      wallW = WallBetween(cellX, cellY, 6) & 255;
      wallN = WallBetween(cellX, cellY, 0) & 255;
      wallE = WallBetween(cellX, cellY, 2) & 255;
      DrawFloorWestWall();
      DrawNorthWall();
      FillCornerNW();
      FillCornerNE();
    }
  }
  SprinkleRareFeatures();
}

export function PlaceRiver() {
  let thresh: number = 0, fordCnt: number = 0, startCol: number = 0, col: number = 0, row: number = 0;
  function PlotFord(r: number, c: number) {
    U8[r32(230527) + r * 50 + c + 7] = 52;
    U8[r32(230527) + r * 50 + (c + 1) + 7] = 53;
    fordCnt = (fordCnt + 1) & 255;
  }
  thresh = 0;
  fordCnt = 0;
  if ((U8[258163] & 32) !== 0) {
    thresh = 35;
  }
  if ((U8[258163] & 16) !== 0) {
    thresh = 75;
  }
  if (Dice.RollDice(1, 100) > thresh) {
    return;
  }
  col = (34 - Dice.RollDice(5, 4)) << 24 >> 24;
  while (((col + 2) % 7) > 0) {
    col = (col - 1) << 24 >> 24;
  }
  startCol = col;
  for (let $i2 = 0; $i2 <= 24; $i2++) {
    row = $i2;
    if (col <= 48) {
      U8[r32(230527) + row * 50 + col + 7] = 50;
      U8[r32(230527) + row * 50 + (col + 1) + 7] = 51;
      if ((Dice.RollDice(1, 20) === 1) || ((fordCnt & 1) !== 0)) {
        PlotFord(row, col);
      }
      col = (col + 1) << 24 >> 24;
    }
  }
  if (fordCnt === 0) {
    row = ((12 - Dice.RollDice(1, 9)) + 4) << 24 >> 24;
    col = (startCol + row) << 24 >> 24;
    PlotFord(row, col);
    PlotFord(row + 1, col + 1);
  }
}

export function PlaceTrees() {
  let dens: number = 0, h: number = 0, col: number = 0, row: number = 0;
  dens = 1;
  if ((U8[258163] & 4) !== 0) {
    dens = 3;
  }
  if ((U8[258163] & 64) !== 0) {
    dens = 4;
  }
  if ((U8[258163] & 8) !== 0) {
    dens = 7;
  }
  if ((U8[258163] & 128) !== 0) {
    dens = 0;
  }
  for (let $i1 = 0; $i1 <= 49; $i1++) {
    col = $i1;
    for (let $i2 = 1; $i2 <= 24; $i2++) {
      row = $i2;
      if (((U8[U8[r32(230527) + row * 50 + col + 7] * 3 + 218830] === 22) && (U8[U8[r32(230527) + (row - 1) * 50 + col + 7] * 3 + 218830] === 22)) && (Dice.RollDice(1, 100) <= dens)) {
        h = Dice.RollDice(1, 10) & 255;
        if (h > 8) {
          h = (Dice.RollDice(1, 2) + 4) & 255;
        } else {
          h = Math.trunc((h + 1) / 2) & 255;
        }
        if ((U8[258163] & 64) !== 0) {
          h = (Dice.RollDice(1, 3) + 3) & 255;
        }
        U8[r32(230527) + row * 50 + col + 7] = (h + 31) + 4;
        if (h < 5) {
          U8[r32(230527) + (row - 1) * 50 + col + 7] = h + 31;
        }
      }
    }
  }
}

export function ScatterFeatures() {
  let tSwamp: number = 0, tA: number = 0, tB: number = 0, tC: number = 0, tD: number = 0, r: number = 0, col: number = 0, row: number = 0;
  tSwamp = 0;
  tA = 6;
  tB = 15;
  tC = 40;
  tD = 0;
  if ((U8[258163] & 2) !== 0) {
    tB = 45;
    tC = 10;
  }
  if ((U8[258163] & 4) !== 0) {
    tB = 25;
  }
  if ((U8[258163] & 64) !== 0) {
    tC = 5;
    tD = 30;
  }
  if ((U8[258163] & 128) !== 0) {
    tSwamp = 15;
    tC = 25;
    tB = 10;
  }
  for (let $i1 = 0; $i1 <= 49; $i1++) {
    col = $i1;
    for (let $i2 = 0; $i2 <= 24; $i2++) {
      row = $i2;
      if (U8[U8[r32(230527) + row * 50 + col + 7] * 3 + 218830] === 22) {
        r = Dice.RollDice(1, 255) & 255;
        if (r <= tSwamp) {
          r = Dice.RollDice(1, 4) & 255;
          if (((r === 4) && (row > 0)) && (U8[U8[r32(230527) + (row - 1) * 50 + col + 7] * 3 + 218830] === 22)) {
            U8[r32(230527) + (row - 1) * 50 + col + 7] = 65;
            U8[r32(230527) + row * 50 + col + 7] = 64;
          }
          if (r < 4) {
            U8[r32(230527) + row * 50 + col + 7] = (r + 31) + 29;
          }
        } else if (r <= (tA + tSwamp)) {
          U8[r32(230527) + row * 50 + col + 7] = (Dice.RollDice(1, 3) + 31) + 23;
        } else if (r <= ((tB + tSwamp) + tA)) {
          U8[r32(230527) + row * 50 + col + 7] = (Dice.RollDice(1, 4) + 31) + 10;
        } else if (r <= (((tD + tB) + tSwamp) + tA)) {
          r = (Math.trunc((Dice.RollDice(1, 10) - 1) / 3) + 1) & 255;
          U8[r32(230527) + row * 50 + col + 7] = (r + 31) + 25;
        } else if (r <= (tA + (((tC + tD) + tB) + tSwamp))) {
          r = Dice.RollDice(1, 4) & 255;
          if ((r === 4) && ((U8[258163] & 64) === 0)) {
            r = Dice.RollDice(1, 3) & 255;
          }
          U8[r32(230527) + row * 50 + col + 7] = (r + 31) + 14;
        }
      }
    }
  }
}

export function BuildWildernessArena() {
  let mapX: number = 0, mapY: number = 0;
  rt.fill(r32(230527) + 7, 1250, 23);
  mapX = U8[r32(227033) + 390] << 24 >> 24;
  mapY = U8[r32(227033) + 392] << 24 >> 24;
  if (U8[227109] === 3) {
    mapX = (mapX + 13) << 24 >> 24;
  }
  if (U8[227109] === 4) {
    mapX = (mapX + 26) << 24 >> 24;
  }
  U8[258163] = TerrainClass(U8[mapY * 44 + mapX + 224470], r16(r32(227033) + 870) === 255);
  PlaceRiver();
  PlaceTrees();
  ScatterFeatures();
  SprinkleRareFeatures();
}

export async function LoadCombatTileSet() {
  MapTiles.FreeSecondSheet();
  if (U8[227109] === 1) {
    (await MapTiles.Load24x24Set("DungCom", 0));
  } else {
    (await MapTiles.Load24x24Set("WildCom", 0));
  }
  (await MapTiles.Load24x24Set("RandCom", 34));
  (await MapTiles.LoadCloudkillArt());
  w32(230527, rt.getMem(1257));
  U8[r32(230527) + 4] = false ? 1 : 0;
  U8[r32(230527) + 5] = 1;
  U8[r32(230527) + 6] = 0;
  if (U8[227109] === 1) {
    BuildDungeonArena();
  } else {
    BuildWildernessArena();
  }
}

export function InitCreatureCombatData() {
  let p: number = 0, count: number = 0, m: number = 0;
  p = r32(229639);
  count = 0;
  while (p !== 0) {
    CharHlp.RecalcStats(p);
    count = (count + 1) & 255;
    w32(p + 264, rt.getMem(23));
    rt.fill(r32(p + 264), 23, 0);
    if (count > r16(r32(227037) + 1660)) {
      U8[r32(p + 264) + 19] = 1;
    }
    U8[r32(p + 264) + 9] = U8[Math.trunc(U8[231434] / 2) + 258159];
    if (I8[p + 270] === 1) {
      U8[r32(p + 264) + 9] = (U8[r32(p + 264) + 9] + 4) % 8;
    }
    m = U8[p + 132] & 127;
    if (((I8[p + 270] === 0) && (U8[r32(p + 264) + 19] === 1)) && ((m === 0) || (m > 102))) {
      U8[p + 132] = r16(r32(227037) + 1420) + 128;
    }
    p = r32(p + 260);
  }
}

export function QuadFullyOff(qx: number, qy: number) {
  let $r0: boolean = false;
  if (((qx >= 0) && (qx < 11)) || ((qy >= 0) && (qy < 6))) {
    $r0 = false;
  } else {
    $r0 = true;
  }
  return $r0;
}

export function TryPlaceAt(team: number, slot: number, qx: number, qy: number, bqx: number, bqy: number, ring: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: number = 0;
  if (((((qx < 0) || (qy < 0)) || (qx > 10)) || (qy > 5)) || (U8[team * 264 + ring * 66 + qy * 11 + qx + 258164] === 0)) {
    $r0 = 0;
  } else {
    U8[slot * 4 + 229890] = ((qx + (bqx * 6)) + (bqy * 5)) + 22;
    U8[slot * 4 + 229891] = (qy + (bqy * 5)) + 10;
    CbtMap.ProbeDirection(r32(slot * 4 + 230178), 8, $f0, $f0 + 1);
    if (((U8[$f0] === 0) && (U8[$f0 + 1] > 0)) && (U8[U8[$f0 + 1] * 3 + 218828] < 255)) {
      $r0 = 1;
      U8[team * 264 + ring * 66 + qy * 11 + qx + 258164] = 0;
    } else {
      $r0 = 0;
    }
  }
  S.sp = $sp;
  return $r0;
}

export function FindPlacement(team: number, slot: number) {
  let placed: number = 0, firstPass: number = 0, giveUp: number = 0, offGrid: number = 0, open: number = 0, state: number = 0, dir: number = 0, quad: number = 0, k: number = 0, stepX: number = 0, stepY: number = 0, wallX: number = 0, wallY: number = 0, legShift: number = 0, legLen: number = 0, baseQx: number = 0, baseQy: number = 0, tries: number = 0, ring: number = 0, legX: number = 0, legY: number = 0, qx: number = 0, qy: number = 0, $r0: boolean = false;
  firstPass = 1;
  giveUp = 0;
  placed = 0;
  state = 1;
  legShift = 0;
  ring = 0;
  baseQx = I8[team + 258692];
  baseQy = I8[team + 258694];
  do {
    quad = Math.trunc(U8[I8[team + 258698] * 4 + ring + 258716] / 2);
    switch (state) {
      case 1: {
        stepX = I8[U8[((quad + 2) % 4) + 258159] + 218813];
        stepY = I8[U8[((quad + 2) % 4) + 258159] + 218822];
        legX = (I8[(ring > 0 ? 1 : 0) * 4 + quad + 258732] + (stepX * legShift)) << 24 >> 24;
        legY = (I8[(ring > 0 ? 1 : 0) * 4 + quad + 258740] + (stepY * legShift)) << 24 >> 24;
        qx = legX;
        qy = legY;
        legLen = 1;
        state = 2;
        tries = 1;
        break;
      }
      case 2: {
        stepX = I8[U8[((quad + 1) % 4) + 258159] + 218813];
        stepY = I8[U8[((quad + 1) % 4) + 258159] + 218822];
        qx = (legX + (stepX * legLen)) << 24 >> 24;
        qy = (legY + (stepY * legLen)) << 24 >> 24;
        state = 3;
        tries = (tries + 1) & 255;
        break;
      }
      case 3: {
        stepX = I8[U8[((quad + 3) % 4) + 258159] + 218813];
        stepY = I8[U8[((quad + 3) % 4) + 258159] + 218822];
        qx = (legX + (stepX * legLen)) << 24 >> 24;
        qy = (legY + (stepY * legLen)) << 24 >> 24;
        state = 2;
        legLen = (legLen + 1) & 255;
        tries = (tries + 1) & 255;
        break;
      }
    }
    if ((((qx < 0) || (qy < 0)) || (qx > 10)) || (qy > 5)) {
      offGrid = 1;
    } else {
      offGrid = 0;
    }
    if (state > 1) {
      if ((((offGrid !== 0) && !QuadFullyOff(qx, qy)) || ((firstPass !== 0) && (tries >= I8[team + 258696]))) || ((firstPass === 0) && (tries > 11))) {
        legShift = (legShift + 1) & 255;
        if ((((team === 0) && ((I8[258698] & 1) !== 0)) && (ring === 0)) && (legShift === 1)) {
          wallX = (I8[team + 258692] + I8[231432]) << 24 >> 24;
          wallY = (I8[team + 258694] + I8[231433]) << 24 >> 24;
          open = 0;
          for (let $i2 = 1; $i2 <= 3; $i2++) {
            k = $i2;
            dir = U8[I8[team + 258698] * 4 + k + 258700];
            if ((U8[227109] > 1) || (WallBetween(wallX, wallY, dir) !== 1)) {
              open = 1;
            }
          }
          if (open !== 0) {
            legShift = (legShift + 1) & 255;
          }
        }
        state = 1;
        firstPass = 0;
      }
    }
    if ((offGrid !== 0) && QuadFullyOff(qx, qy)) {
      state = 0;
      while ((ring < 3) && (state !== 1)) {
        ring = (ring + 1) & 255;
        wallX = (I8[team + 258692] + I8[231432]) << 24 >> 24;
        wallY = (I8[team + 258694] + I8[231433]) << 24 >> 24;
        dir = U8[I8[team + 258698] * 4 + ring + 258700];
        if ((U8[227109] > 1) || (WallBetween(wallX, wallY, dir) !== 1)) {
          baseQx = (I8[team + 258692] + I8[dir + 218813]) << 24 >> 24;
          baseQy = (I8[team + 258694] + I8[dir + 218822]) << 24 >> 24;
          legShift = 0;
          state = 1;
        }
      }
      if (state !== 1) {
        giveUp = 1;
      }
    }
    if (offGrid === 0) {
      placed = TryPlaceAt(team, slot, qx, qy, baseQx, baseQy, ring) & 255;
    }
  } while (!((placed !== 0) || (giveUp !== 0)));
  if (giveUp !== 0) {
    $r0 = false;
  } else {
    $r0 = true;
  }
  return $r0;
}

export async function PlaceAllCreatures() {
  let team: number = 0, x: number = 0, y: number = 0, prev: number = 0, p: number = 0, next: number = 0, slot: number = 0, g: number = 0, d: number = 0, facing: number = 0;
  CharHlp.CountTeams();
  for (let $i1 = 1; $i1 <= 72; $i1++) {
    slot = $i1;
    U8[slot * 4 + 229893] = 0;
  }
  CbtMap.BuildArenaArrays();
  U8[258692] = 0;
  U8[258694] = 0;
  facing = U8[231434] & 6;
  U8[258698] = Math.trunc(facing / 2);
  U8[258693] = (I8[facing + 218813] * r16(r32(227037) + 1410)) + I8[258692];
  U8[258695] = (I8[facing + 218822] * r16(r32(227037) + 1410)) + I8[258694];
  U8[258699] = Math.trunc(((facing + 4) % 8) / 2);
  for (let $i2 = 0; $i2 <= 1; $i2++) {
    team = $i2;
    U8[team + 258696] = Math.trunc((U8[team + 230780] + 1) / 2);
  }
  for (let $i3 = 0; $i3 <= 1; $i3++) {
    team = $i3;
    for (let $i4 = 0; $i4 <= 3; $i4++) {
      g = $i4;
      if (g === 1) {
        d = 4;
      } else {
        d = I8[team + 258698] & 255;
      }
      for (let $i5 = 0; $i5 <= 5; $i5++) {
        y = $i5;
        for (let $i6 = 0; $i6 <= 10; $i6++) {
          x = $i6;
          if ((I8[d * 12 + y * 2 + 258748] > x) || (I8[d * 12 + y * 2 + 258749] < x)) {
            U8[team * 264 + g * 66 + y * 11 + x + 258164] = 0;
          } else {
            U8[team * 264 + g * 66 + y * 11 + x + 258164] = 1;
          }
        }
      }
    }
  }
  slot = 1;
  U8[229893] = 1;
  prev = 0;
  p = r32(229639);
  while ((p !== 0) && (slot <= 72)) {
    (await GameIo.DiscardPendingKeys());
    next = r32(p + 260);
    w32(slot * 4 + 230178, p);
    team = CharHlp.Team(p) << 24 >> 24;
    U8[slot * 4 + 229892] = slot;
    U8[slot * 4 + 229893] = U8[p + 108] & 7;
    if (FindPlacement(team, slot)) {
      prev = p;
      if (U8[p + 269] === 0) {
        U8[slot * 4 + 229893] = 0;
        if (!(U8[232632] !== 0) && (U8[r32(p + 264) + 19] === 0)) {
          x = I8[slot * 4 + 229890];
          y = I8[slot * 4 + 229891];
          CbtMap.RegisterDowned(p, x, y);
        }
      }
      CbtMap.BuildArenaArrays();
      slot = (slot + 1) & 255;
      U8[229893] = U8[229893] + 1;
    } else {
      U8[slot * 4 + 229893] = 0;
      if (U8[r32(p + 264) + 19] === 1) {
        w32(slot * 4 + 230178, 0);
        w32(229635, p);
        SaveLoad.RemoveCreature(true, false);
      } else {
        prev = p;
        slot = (slot + 1) & 255;
        U8[229893] = U8[229893] + 1;
      }
    }
    p = next;
  }
  if (prev !== 0) {
    w32(prev + 260, 0);
  }
}
