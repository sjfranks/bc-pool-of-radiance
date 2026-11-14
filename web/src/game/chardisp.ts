// Generated from src/chardisp.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as CharHlp from './charhlp';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as MenuCore from './menucore';
import * as MapView from './mapview';
import * as Pathing from './pathing';
import * as CbtMap from './cbtmap';
import * as C_EQUIP from './c_equip';
import * as C_KEYS from './c_keys';
import * as C_IFC from './c_ifc';
import * as Blit from './blit';
import * as Border from './border';
import * as Portrait from './portrait';
import * as SoundDrv from './sounddrv';
import * as C_SOUND from './c_sound';
import * as C_SPELL from './c_spell';
import * as TextRend from './textrend';
import * as Wilds from './wilds';
import * as StrUtil from './strutil';
import * as C_GBVM from './c_gbvm';
import * as Party from './party';
import * as C_DIR from './c_dir';
import * as CbtLog from './cbtlog';
import * as JrnlSeen from './jrnlseen';

export const WIDE_INFO_ROW = 19;
export const WIDE_MSG_TOP = 20;

export const $at = { portraitHeadId: 240458, portraitBodyId: 240459, hallMenu: 240460, messageTop: 240461, wideMsgPauses: 240462 };

export async function DisplayParty(hl: number) {
  let p: number = 0, col: number = 0, row: number = 0, band: number = 0, left: number = 0;
  if ((U8[240359] !== 0) && (U8[141176] === 3)) {
    return;
  }
  col = 17;
  row = 2;
  left = 0;
  if (U8[141176] === 0) {
    if ((U8[240460] !== 0)) {
      col = 2;
      left = 1;
    } else {
      col = 1;
    }
  }
  TextRend.DisplayString(col, row, 15, "Name");
  TextRend.DisplayString(33 - left, row, 15, "AC  HP");
  row = (row + 2) & 255;
  p = r32(143753);
  while (p !== 0) {
    (await Border.ClearBox(col, row, 38, row));
    if (p === hl) {
      TextRend.DisplayString(col, row, 15, rS(p));
    } else {
      DisplayCreatureName(p, col, row, false);
    }
    const $c2 = U8[p + 273];
    if (($c2 >= 0 && $c2 <= 50)) {
      band = 1;
    } else if (($c2 >= 51 && $c2 <= 60)) {
      band = 2;
    } else if (($c2 >= 61 && $c2 <= 69)) {
      band = 1;
    } else {
      band = 0;
    }
    PrintArmorClass(p, (band + 32) - left, row);
    const $c3 = U8[p + 283];
    if (($c3 >= 0 && $c3 <= 9)) {
      band = 2;
    } else if (($c3 >= 10 && $c3 <= 99)) {
      band = 1;
    } else {
      band = 0;
    }
    PrintHitPoints(p, (band + 36) - left, row, false);
    row = (row + 1) & 255;
    p = r32(p + 260);
  }
  (await Border.ClearBox(col, row, 38, row));
}

export function PrintArmorClass(creature: number, col: number, row: number) {
  TextRend.DisplayString(col, row, 10, ArmorClassText(creature));
}

export function PrintHitPoints(creature: number, col: number, row: number, hotPink: boolean) {
  let color: number = 0;
  if (U8[creature + 283] < U8[creature + 50]) {
    color = 14;
  } else {
    color = 10;
  }
  if (hotPink) {
    color = 13;
  }
  TextRend.DisplayString(col, row, color, StrUtil.NumStr(U8[creature + 283]));
}

export function DisplayCreatureName(creature: number, col: number, row: number, possessive: boolean) {
  let color: number = 0;
  color = NameColor(creature) & 255;
  TextRend.DisplayString(col, row, color, rS(creature));
  if (possessive) {
    TextRend.DisplayString(col + U8[creature], row, color, "'s");
  }
}

export function NameColor(creature: number) {
  let $r0: number = 0;
  if (U8[creature + 269] === 0) {
    $r0 = 12;
  } else if (I8[creature + 270] === 1) {
    $r0 = 14;
  } else if (CharHlp.CanTrain(creature)) {
    $r0 = 13;
  } else {
    $r0 = 11;
  }
  return $r0;
}

export function LogCreatureName(creature: number) {
  CbtLog.NextLine();
  CbtLog.Add(NameColor(creature), rS(creature));
}

export async function CombatPrintCreatureInfo(creature: number) {
  let row: number = 0;
  if ((U8[227025] !== 0)) {
    (await WideCreatureInfo(creature));
    return;
  }
  (await ClearCreatureInfo());
  row = 1;
  (await PrintNameString(creature, " ", row, false));
  row = (row + 1) & 255;
  TextRend.DisplayString(23, row + 1, 10, "Hitpoints");
  PrintHitPoints(creature, 33, row + 1, false);
  row = (row + 2) & 255;
  TextRend.DisplayString(23, row + 1, 10, "AC");
  PrintArmorClass(creature, 26, row + 1);
  U8[143770] = row + 1;
  if (r32(creature + 204) !== 0) {
    row = (row + 2) & 255;
    CharHlp.ItemLabel(r32(creature + 204), false);
    (await TextRend.DisplayMessageWindow(23, row + 1, 38, row + 3, 10, true, rS(r32(creature + 204))));
  }
  row = (U8[143770] + 1) & 255;
  if (U8[creature + 269] === 0) {
    TextRend.DisplayString(23, row + 1, 15, rS(U8[creature + 268] * 12 + 132701));
  } else if (CharHlp.IsHelpless(creature)) {
    TextRend.DisplayString(23, row + 1, 15, "(Helpless)");
  }
}

export async function ClearCreatureInfo() {
  if ((U8[227025] !== 0)) {
    (await Border.ClearBox(1, 19, 38, 21));
    U8[143769] = 1;
    U8[143770] = 20;
  } else {
    (await Border.ClearBox(23, 1, 38, 21));
  }
}

export function MsgLeft() {
  let $r0: number = 0;
  if ((U8[227025] !== 0)) {
    $r0 = 1;
  } else {
    $r0 = 23;
  }
  return $r0;
}

export async function PrintNameString(creature: number, s: string, row: number, pause: boolean) {
  let top_: number = 0;
  if (U8[141176] === 5) {
    if (row >= 10) {
      CbtLog.NewEntry();
      LogCreatureName(creature);
      CbtLog.NextLine();
      CbtLog.Add(10, s);
    }
    if ((U8[227025] !== 0)) {
      row = (await NextMsgRow(row)) & 255;
      (await Border.ClearBox(1, row, 38, 21));
      (await WideMsgName(creature, row));
      (await WideMsgText(s, 10));
    } else {
      (await Border.ClearBox(23, row, 38, 21));
      DisplayCreatureName(creature, 23, row, false);
      (await TextRend.DisplayMessageWindow(23, row + 1, 38, 21, 10, true, s));
    }
  } else {
    top_ = (await OpenMessageWindow()) & 255;
    DisplayCreatureName(creature, 1, top_ + 1, false);
    (await TextRend.DisplayMessageWindow(1, (top_ + 1) + 1, 38, 22, 10, true, s));
  }
  if (pause) {
    (await TextRend.PauseOnly());
    (await ClearMessageWindow());
  }
}

export async function PrintNameLine(creature: number, s: string, row: number) {
  if ((U8[227025] !== 0)) {
    (await WideMsgName(creature, (await NextMsgRow(row))));
    (await WideMsgText(s, 10));
  } else {
    DisplayCreatureName(creature, 23, row, false);
    (await TextRend.DisplayMessageWindow(23, row + 1, 38, row + 4, 10, true, s));
  }
}

export async function PrintMsgTail(s: string, color: number, row: number) {
  if (!(U8[227025] !== 0)) {
    TextRend.DisplayString(23, row, color, s);
  } else if (U8[143769] <= 1) {
    (await WideMsgText(s, color));
  } else {
    (await WideMsgText(" " + s, color));
  }
}

export async function PrintMessage(s: string) {
  (await MessageText(s, 10, true));
}

export async function MessageText(s: string, color: number, first: boolean) {
  if (U8[141176] === 5) {
    if (first) {
      CbtLog.NewEntry();
    }
    CbtLog.Add(color, s);
    if ((U8[227025] !== 0)) {
      if (first) {
        (await ClearWideMsg());
      }
      (await WideMsgText(s, color));
    } else {
      if (first) {
        (await Border.ClearBox(23, 10, 38, 21));
      }
      (await TextRend.DisplayMessageWindow(23, 10, 38, 21, color, first, s));
    }
  } else {
    if (first) {
      U8[240461] = (await OpenMessageWindow());
    }
    (await TextRend.DisplayMessageWindow(1, U8[240461] + 1, 38, 22, color, first, s));
  }
}

export async function MessageWait() {
  (await TextRend.DisplayAndPause(13, "Press any key to continue"));
  (await Border.ClearBox(0, 24, 39, 24));
}

export async function PrintTwoLines(line1: string, line2: string) {
  let left: number = 0;
  if (U8[141176] === 5) {
    left = MsgLeft() & 255;
  } else {
    left = 1;
  }
  (await MessageText(line1, 10, true));
  if (U8[143769] !== left) {
    U8[143769] = left;
    U8[143770] = U8[143770] + 1;
  }
  if (U8[141176] === 5) {
    CbtLog.NextLine();
  }
  (await MessageText(line2, 10, false));
  (await TextRend.PauseOnly());
  (await ClearMessageWindow());
}

export async function PrintBottomLine(s: string) {
  if (U8[141176] === 5) {
    CbtLog.NewEntry();
    CbtLog.Add(10, s);
    CbtLog.NewEntry();
  }
  (await ShowBottomLine(s));
}

export async function PrintActionLine(creature: number, s: string, logged: string) {
  if (U8[141176] === 5) {
    CbtLog.NewEntry();
    LogCreatureName(creature);
    CbtLog.NextLine();
    CbtLog.Add(10, logged);
    CbtLog.NewEntry();
  }
  (await ShowBottomLine(s));
}

export async function ClearMessageWindow() {
  if (U8[141176] !== 5) {
    (await Border.ClearBox(1, 18, 38, 22));
  } else if ((U8[227025] !== 0)) {
    (await ClearWideMsg());
  } else {
    (await Border.ClearBox(23, 10, 38, 21));
  }
}

export async function CopyIconFacing(cell: number, half: number, row: number, mirror: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let stride4: number = 0, stride: number = 0;
  stride = r16(r32(146533) + 17);
  stride4 = Blit.MaskBytes(stride) & 65535;
  if (mirror) {
    (await Blit.AllocPic(24, 3, 1, 1, $f0));
    (await Blit.MirrorPic(r32(cell * 8 + half * 4 + 143799), r32($f0)));
    mv(r32(146533) + (row * stride) + 27, r32($f0) + 27, stride);
    mv(r32(r32(146533) + 19) + (row * stride4), r32(r32($f0) + 19), stride4);
    Blit.FreePic($f0);
  } else {
    mv(r32(146533) + (row * stride) + 27, r32(cell * 8 + half * 4 + 143799) + 27, stride);
    mv(r32(r32(146533) + 19) + (row * stride4), r32(r32(cell * 8 + half * 4 + 143799) + 19), stride4);
  }
  S.sp = $sp;
}

export async function BuildIconFacings(cell: number) {
  (await CopyIconFacing(cell, 0, 0, false));
  (await CopyIconFacing(cell, 0, 1, true));
  (await CopyIconFacing(cell, 1, 2, true));
  (await CopyIconFacing(cell, 1, 3, false));
}

export async function CombatAnimateMovingIcon(startX: number, startY: number, endX: number, endY: number, frames: number, pace: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 175);
  let n: number = 0, count: number = 0, frame: number = 0, lastPass: boolean = false, done: boolean = false, camX: number = 0, camY: number = 0, prevX: number = 0, prevY: number = 0, accX: number = 0, accY: number = 0, dirX: number = 0, dirY: number = 0, stepX: number = 0, stepY: number = 0, pixX: number = 0, pixY: number = 0;
  prevX = startX;
  prevY = startY;
  rt.fill($f0, 149, 8);
  rt.fill($f0 + 149, 26, 0);
  n = 0;
  frame = 0;
  w16($f0 + 149, startX * 3);
  w16($f0 + 151, startY * 3);
  w16($f0 + 153, endX * 3);
  w16($f0 + 155, endY * 3);
  Pathing.PathFind($f0 + 149);
  do {
    done = !Pathing.NextPathStep($f0 + 149);
    U8[$f0 + n] = U8[$f0 + 174];
    n = (n + 1) & 255;
    if (n >= 148) {
      done = true;
    }
  } while (!(done));
  count = n;
  if (count < 2) {
    { S.sp = $sp; return; }
  }
  dirX = (endX - startX) << 24 >> 24;
  dirY = (endY - startY) << 24 >> 24;
  if (!CbtMap.ViewCoordsValid(startX - I8[r32(144641) + 2], startY - I8[r32(144641) + 3]) || !CbtMap.ViewCoordsValid(endX - I8[r32(144641) + 2], endY - I8[r32(144641) + 3])) {
    if ((Math.abs(dirX) <= I8[227026]) && (Math.abs(dirY) <= I8[227027])) {
      lastPass = true;
      camX = (startX + Math.trunc(dirX / 2)) << 24 >> 24;
      camY = (startY + Math.trunc(dirY / 2)) << 24 >> 24;
    } else {
      lastPass = false;
      camX = CbtMap.CenterX() << 24 >> 24;
      camY = CbtMap.CenterY() << 24 >> 24;
    }
  } else {
    lastPass = true;
    camX = CbtMap.CenterX() << 24 >> 24;
    camY = CbtMap.CenterY() << 24 >> 24;
  }
  (await CbtMap.ScrollView(camX, camY, 255, 8));
  n = 0;
  accX = 0;
  accY = 0;
  do {
    pixX = (((startX - I8[r32(144641) + 2]) * 3) + accX) << 24 >> 24;
    pixY = (((startY - I8[r32(144641) + 3]) * 3) + accY) << 24 >> 24;
    prevX = startX;
    prevY = startY;
    done = false;
    do {
      if (((pace > 0) || ((pixX % 3) === 0)) || ((pixY % 3) === 0)) {
        Blit.BlitTileClipped(pixX, pixY, frame, 5, r32(146533), r32(141249));
        (await Blit.FlushView());
        (await Crt.Delay(pace));
        Blit.BlitTileClipped(pixX, pixY, 0, 0, r32(141253), r32(141249));
        frame = (frame + 1) & 255;
        if (frame >= frames) {
          frame = 0;
        }
      }
      n = (n + 1) & 255;
      stepX = I8[U8[$f0 + n] + 132927];
      stepY = I8[U8[$f0 + n] + 132936];
      pixX = (pixX + stepX) << 24 >> 24;
      pixY = (pixY + stepY) << 24 >> 24;
      if ((((pixX < 0) || (pixX > (I8[227026] * 3))) || (pixY < 0)) || (pixY > (I8[227027] * 3))) {
        done = true;
      }
      if (!done && (n < count)) {
        accX = (accX + stepX) << 24 >> 24;
        accY = (accY + stepY) << 24 >> 24;
        if (Math.abs(accX) === 3) {
          startX = (startX + Pathing.SignOf(accX)) << 24 >> 24;
          camX = (camX + Pathing.SignOf(accX)) << 24 >> 24;
          accX = 0;
        }
        if (Math.abs(accY) === 3) {
          startY = (startY + Pathing.SignOf(accY)) << 24 >> 24;
          camY = (camY + Pathing.SignOf(accY)) << 24 >> 24;
          accY = 0;
        }
      }
    } while (!((n >= count) || done));
    if (n < count) {
      dirX = Pathing.SignOf(prevX - startX) << 24 >> 24;
      dirY = Pathing.SignOf(prevY - startY) << 24 >> 24;
      if (dirX !== 0) {
        if (startX >= (I8[r32(144641) + 2] + I8[227026])) {
          camX = (startX + I8[227029]) << 24 >> 24;
        } else if (startX <= I8[r32(144641) + 2]) {
          camX = (startX - I8[227029]) << 24 >> 24;
        }
      }
      if (dirY !== 0) {
        if (startY >= (I8[r32(144641) + 3] + I8[227027])) {
          camY = (startY + I8[227030]) << 24 >> 24;
        } else if (startY <= I8[r32(144641) + 3]) {
          camY = (startY - I8[227030]) << 24 >> 24;
        }
      }
      (await CbtMap.ScrollView(camX, camY, 255, 8));
    } else {
      lastPass = true;
      if (!CbtMap.ViewCoordsValid(endX - I8[r32(144641) + 2], endY - I8[r32(144641) + 3])) {
        (await CbtMap.ScrollView(endX, endY, 3, 8));
      }
      pixX = ((endX - I8[r32(144641) + 2]) * 3) << 24 >> 24;
      pixY = ((endY - I8[r32(144641) + 3]) * 3) << 24 >> 24;
      Blit.BlitTileClipped(pixX, pixY, frame, 5, r32(146533), r32(141249));
      if (pace > 0) {
        (await Blit.FlushView());
        (await Crt.Delay(pace));
        Blit.BlitTileClipped(pixX, pixY, 0, 0, r32(141253), r32(141249));
      }
    }
  } while (!(lastPass));
  (await Blit.FlushView());
  S.sp = $sp;
}

export async function AnimateIconBetween(from: number, dest: number, frames: number, pace: number) {
  (await CombatAnimateMovingIcon(CbtMap.CombatCellX(from), CbtMap.CombatCellY(from), CbtMap.CombatCellX(dest), CbtMap.CombatCellY(dest), frames, pace));
}

export async function AnimateBetween(from: number, dest: number, sprite: number, frames: number, pace: number) {
  (await BuildIconFacings(sprite));
  (await AnimateIconBetween(from, dest, frames, pace));
}

export async function PrintNameStringAnim(creature: number, effect: boolean, s: string) {
  let gx: number = 0, gy: number = 0, cell: number = 0, j: number = 0, i: number = 0, reps: number = 0, slot: number = 0;
  if (U8[141176] === 5) {
    (await SoundDrv.SoundSetAutoStop(0));
    if (effect) {
      cell = 22;
    } else {
      cell = 23;
    }
    (await BuildIconFacings(cell));
    if (!CbtMap.CombatIconVisible(creature, 1)) {
      (await CbtMap.ScrollView(CbtMap.CombatCellX(creature), CbtMap.CombatCellY(creature), 3, 8));
    }
    if (effect) {
      (await SoundDrv.SoundEffect(r16(132895), 32));
    } else if (U8[144900] !== 0) {
      (await SoundDrv.SoundEffect(r16(132893), 32));
    } else {
      (await SoundDrv.SoundCommand(r16(132893)));
    }
    (await PrintNameString(creature, s, 10, false));
    if (effect) {
      reps = U8[141163];
    } else {
      reps = 0;
    }
    slot = CbtMap.CombatSlot(creature) & 255;
    if (slot > 0) {
      gx = (I8[slot + 226880] * 3) << 24 >> 24;
      gy = (I8[slot + 226952] * 3) << 24 >> 24;
      for (let $i1 = 0, $e1 = reps; $i1 <= $e1; $i1++) {
        i = $i1;
        for (let $i2 = 0; $i2 <= 3; $i2++) {
          j = $i2;
          Blit.BlitTileClipped(gx, gy, j, 5, r32(146533), r32(141249));
          (await Blit.FlushView());
          (await Crt.Delay(70));
          Blit.BlitTileClipped(gx, gy, 0, 0, r32(141253), r32(141249));
        }
      }
    }
    (await SoundDrv.SoundSetAutoStop(10));
    (await Blit.FlushView());
    if (reps === 0) {
      (await TextRend.PauseOnly());
    }
  } else {
    (await PrintNameString(creature, s, 10, true));
  }
}

export async function PrintHpRestoreMsg(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  if (U8[creature + 283] === U8[creature + 50]) {
    wS($f0, 40, "is fully healed");
  } else {
    wS($f0, 40, "is partially healed");
  }
  (await PrintNameString(creature, rS($f0), 10, true));
  (await RedrawPartyOutOfCombat());
  S.sp = $sp;
}

export async function RedrawPartyOutOfCombat() {
  if (U8[141176] !== 5) {
    (await DisplayParty(r32(143749)));
  }
}

export async function DrawNoncombatWindows(inset: boolean) {
  (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
  (await Border.DrawWindow(1, 17, 38, 22, 0, 15, ""));
  (await Border.DrawWindow(1, 1, 15, 15, 0, 15, ""));
  if (inset) {
    (await Border.DrawWindow(3, 3, 13, 13, 0, 15, ""));
  }
}

export async function DisplayNoncombatInterface() {
  switch (U8[141176]) {
    case 0: {
      (await Border.DrawWindow(1, 1, 38, 22, 0, 15, ""));
      break;
    }
    case 1: case 8: {
      (await DrawNoncombatWindows(true));
      (await Portrait.LoadPortraitBufs(U8[240458], U8[240459]));
      (await Portrait.DisplayPortraitBufs(3, 3, true));
      break;
    }
    case 2: {
      (await DrawNoncombatWindows(true));
      (await Portrait.LoadAnimation("PIC", 29, 0, 145563));
      if (U8[145564] > 0) {
        (await Portrait.DisplayImageBuf(3, 3, true, r32(U8[145564] * 8 + 145561)));
      }
      (await DisplayParty(r32(143749)));
      (await PrintMiscInfo());
      break;
    }
    case 4: {
      (await DrawNoncombatWindows(true));
      (await MapView.DisplayMapView());
      (await DisplayParty(r32(143749)));
      (await PrintMiscInfo());
      break;
    }
    case 3: {
      if ((U8[240359] !== 0)) {
        (await DisplayWildernessInterface());
      } else {
        (await DrawNoncombatWindows(false));
        (await MapView.DisplayMapView());
        (await DisplayParty(r32(143749)));
        (await PrintMiscInfo());
      }
      break;
    }
    case 6: {
      (await DrawNoncombatWindows(true));
      (await Portrait.LoadAnimation("PIC", 1, 0, 145563));
      (await DisplayParty(r32(143749)));
      break;
    }
  }
}

export function MiscInfoText() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 47);
  let x: number = 0, y: number = 0, $r0: string = "";
  wS($f0 + 6, 40, "");
  x = I8[145546] & 255;
  y = I8[145547] & 255;
  if (U8[141223] > 1) {
    x = U8[r32(141147) + 390];
    y = U8[r32(141147) + 392];
    if (U8[141223] === 3) {
      x = (x + 13) & 255;
    }
    if (U8[141223] === 4) {
      x = (x + 26) & 255;
    }
  }
  wS($f0, 2, StrUtil.ZeroPad2(r16(r32(141147) + 402)));
  wS($f0 + 3, 2, StrUtil.ZeroPad2((10 * r16(r32(141147) + 400)) + r16(r32(141147) + 398)));
  if (JrnlSeen.AreaMapAllowed()) {
    wS($f0 + 6, 40, StrUtil.NumStr(x) + "," + StrUtil.NumStr(y) + " ");
  }
  wS($f0 + 6, 40, rS($f0 + 6) + rS(U8[145548] * 3 + 240464) + " ");
  wS($f0 + 6, 40, rS($f0 + 6) + rS($f0) + ":" + rS($f0 + 3));
  if ((U8[141214] !== 0)) {
    wS($f0 + 6, 40, rS($f0 + 6) + "*");
  }
  if (U8[141176] === 2) {
    wS($f0 + 6, 40, rS($f0 + 6) + " camping");
  } else if ((r16(r32(141151) + 1428) & 1) > 0) {
    wS($f0 + 6, 40, rS($f0 + 6) + " search");
  }
  $r0 = rS($f0 + 6);
  S.sp = $sp;
  return $r0;
}

export async function PrintMiscInfo() {
  if ((U8[240359] !== 0) && (U8[141176] === 3)) {
    return;
  }
  (await Border.ClearBox(17, 15, 38, 15));
  TextRend.DisplayString(17, 15, 10, MiscInfoText());
}

export async function DisplayWildernessInterface() {
  U8[141176] = 3;
  (await Wilds.ShowWide((U8[240358] !== 0)));
  (await Wilds.DrawWildWindows());
  (await MapView.DisplayMapView());
  (await MapView.DisplayWildMapView());
  (await PrintMiscInfo());
  (await DisplayParty(r32(143749)));
}

export async function SetWildView(wide: boolean) {
  if (wide === (U8[240359] !== 0)) {
    return;
  }
  (await Wilds.ShowWide(wide));
  (await Wilds.DrawTopWindows());
  (await MapView.DisplayMapView());
  (await PrintMiscInfo());
  (await DisplayParty(r32(143749)));
  if (!wide) {
    TextRend.ClearBottomLine();
  }
}

export async function DisplayCombatInterface() {
  (await CbtMap.SetCombatPalette());
  if ((U8[227025] !== 0)) {
    (await Border.DrawWindow(1, 1, 38, 21, 0, 0, ""));
  } else {
    (await Border.DrawWindow(1, 1, 21, 21, 0, 0, ""));
    (await Border.DrawWindow(23, 1, 38, 21, 0, 0, ""));
  }
  (await Border.ClearBox(0, 23, 39, 24));
  (await CbtMap.ScrollView(CbtMap.CenterX(), CbtMap.CenterY(), 255, 8));
}

export async function SelectChar(query: string, addExit: boolean, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let ch: number = 0, anim: boolean = false, p: number = 0;
  ch = 32;
  wS($f0 + 1, 40, "");
  if (addExit) {
    wS($f0 + 1, 40, " Exit");
  }
  U8[145643] = 1;
  while (!((ch === 13 || ch === 69 || ch === 83) || ((ch === 0) && addExit))) {
    (await DisplayParty(r32(sel)));
    if ((U8[141176] === 2) || (U8[141176] === 6)) {
      anim = true;
    } else {
      anim = false;
    }
    ch = (await MenuCore.MenuHorizontal(query + " ", "Select" + rS($f0 + 1), 13, 10, 15, true, anim, $f0)) & 255;
    p = r32(sel);
    if ((U8[$f0] !== 0)) {
      switch (ch) {
        case 79: {
          p = Party.NextCreature(p);
          break;
        }
        case 71: {
          p = Party.PrevCreature(r32(sel));
          break;
        }
      }
    } else if (((ch === 69) || (ch === 0)) && addExit) {
      p = 0;
    }
    w32(sel, p);
  }
  S.sp = $sp;
}

export function PrintItemLabel(item: number, col: number, row: number) {
  CharHlp.ItemLabel(item, false);
  TextRend.DisplayString(col, row, 10, rS(item));
}

export async function ShowFault(msg: string) {
  (await TextRend.DisplayAndPause(14, msg));
}

export async function ClearWideMsg() {
  (await Border.ClearBox(1, 20, 38, 21));
  U8[143769] = 1;
  U8[143770] = 20;
}

export function NoteWideMsg() {
  w16(240462, r16(226090));
}

export async function TurnWideMsg() {
  if (r16(226090) === r16(240462)) {
    (await TextRend.PauseOnly());
  }
  (await ClearWideMsg());
}

export async function NextMsgRow(row: number) {
  let r: number = 0, $r0: number = 0;
  if (U8[143769] <= 1) {
    r = U8[143770];
  } else {
    r = (U8[143770] + 1) & 255;
  }
  if ((row <= 10) || (r < 20)) {
    (await ClearWideMsg());
    r = 20;
  } else if (r > 21) {
    (await TurnWideMsg());
    r = 20;
  }
  $r0 = r;
  return $r0;
}

export async function WideMsgText(s: string, color: number) {
  if (U8[143770] > 21) {
    (await TurnWideMsg());
  } else if (U8[143770] < 20) {
    (await ClearWideMsg());
  }
  (await TextRend.DisplayMessageWindow(1, 20, 38, 21, color, false, s));
  NoteWideMsg();
}

export async function WideMsgName(creature: number, row: number) {
  (await Border.ClearBox(1, row, 38, row));
  DisplayCreatureName(creature, 1, row, false);
  U8[143769] = (1 + U8[creature]) + 1;
  U8[143770] = row;
}

export function ArmorClassText(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, StrUtil.NumStr(Math.abs(U8[creature + 273] - 60)));
  if (U8[creature + 273] > 60) {
    wS($f0, 40, "-" + rS($f0));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export async function WideCreatureInfo(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let col: number = 0, color: number = 0;
  (await ClearCreatureInfo());
  DisplayCreatureName(creature, 1, 19, false);
  col = ((1 + U8[creature]) + 2) & 255;
  TextRend.DisplayString(col, 19, 10, "HP");
  PrintHitPoints(creature, col + 3, 19, false);
  col = (col + ((3 + StrUtil.NumStr(U8[creature + 283]).length) + 2)) & 255;
  TextRend.DisplayString(col, 19, 10, "AC");
  PrintArmorClass(creature, col + 3, 19);
  col = (col + ((3 + ArmorClassText(creature).length) + 2)) & 255;
  wS($f0, 255, "");
  color = 15;
  if (U8[creature + 269] === 0) {
    wS($f0, 255, rS(U8[creature + 268] * 12 + 132701));
  } else if (CharHlp.IsHelpless(creature)) {
    wS($f0, 255, "(Helpless)");
  } else if (r32(creature + 204) !== 0) {
    CharHlp.ItemLabel(r32(creature + 204), false);
    wS($f0, 255, rS(r32(creature + 204)));
    color = 10;
  }
  if (col <= 38) {
    TextRend.DisplayString(col, 19, color, rt.Copy(rS($f0), 1, (38 - col) + 1));
  }
  S.sp = $sp;
}

export async function ShowBottomLine(s: string) {
  (await Border.ClearBox(0, 24, 39, 24));
  TextRend.DisplayString(0, 24, 10, s);
  (await TextRend.PauseOnly());
  (await Border.ClearBox(0, 24, 39, 24));
}

export async function OpenMessageWindow() {
  let top_: number = 0, $r0: number = 0;
  if (U8[146458] !== 0) {
    top_ = 18;
  } else {
    top_ = 17;
    (await Border.DrawBorder(1, top_, 38, 22, 0));
  }
  (await Border.ClearBox(1, top_, 38, 22));
  $r0 = top_;
  return $r0;
}

export function $init() {
  U8[240458] = 0;
  U8[240459] = 0;
}
