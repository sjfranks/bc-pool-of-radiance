// Generated from src/comptool.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Types from './types';
import * as C_AREA from './c_area';
import * as C_DIR from './c_dir';
import * as C_KEYS from './c_keys';
import * as C_MSG from './c_msg';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as Blit from './blit';
import * as View3D from './view3d';
import * as AreaName from './areaname';
import * as Explored from './explored';
import * as EvtKind from './evtkind';
import * as CharEdit from './charedit';
import * as MapNotes from './mapnotes';
import * as ClueBook from './cluebook';
import * as StrUtil from './strutil';

export const MAP_COL = 2;
export const MAP_ROW = 3;
export const LEGEND_COL = 19;
export const KEY_ROW = 20;
export const PLAYER_ROW = 21;
export const NOTE_COL = 8;
export const MARK_NONE = 0;
export const MARK_CLUE = 1;
export const MARK_NOTE = 2;
export const SYM_SET = 4;
export const SYM_ARROW = 256;
export const SYM_WALLS = 260;

export const $at = { KIND_COLOURS: 261060, KIND_COLOURS_CGA: 261067, KIND_NAMES: 261074 };

export async function ToolsMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0;
  if (U8[227084] === 0) {
    { S.sp = $sp; return; }
  }
  (await DrawTools());
  do {
    ch = (await MenuCore.MenuHorizontal("Tools: ", "Map Character Exit", 13, 10, 15, false, false, $f0)) & 255;
    switch (ch) {
      case 77: {
        (await MapTool());
        break;
      }
      case 67: {
        (await CharEdit.EditMenu());
        (await DrawTools());
        break;
      }
    }
  } while (!(ch === 0 || ch === 69));
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export function NoteColour() {
  let $r0: number = 0;
  if (U8[226936] >= 16) {
    $r0 = 14;
  } else {
    $r0 = 13;
  }
  return $r0;
}

export async function ShowSymbol(col: number, row: number, symbol: number, dim: boolean, fill: number, mark: number, cursor: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let symbols: number = 0, glyph: number = 0, c: number = 0, remap: boolean = false;
  symbols = r32(229673);
  glyph = r32(229677);
  if ((symbols === 0) || (glyph === 0)) {
    { S.sp = $sp; return; }
  }
  mv(glyph + 27, symbols + ((symbol - r16(218811)) * r16(symbols + 17)) + 27, r16(symbols + 17));
  mv(glyph + 9, symbols + 9, 8);
  for (let $i1 = 0; $i1 <= 15; $i1++) {
    c = $i1;
    U8[$f0 + c] = c;
    U8[$f0 + c + 16] = c;
  }
  if (U8[226936] >= 16) {
    if (dim) {
      U8[$f0 + 24] = 0;
      U8[$f0 + 23] = 8;
      U8[$f0 + 31] = 8;
    }
  } else if (!dim) {
    U8[$f0 + 23] = 15;
  }
  if (fill !== 8) {
    U8[$f0 + 24] = fill;
  }
  if (mark !== 0) {
    if (mark === 1) {
      U8[$f0 + 23] = 11;
    } else {
      U8[$f0 + 23] = NoteColour();
    }
    U8[$f0 + 31] = U8[$f0 + 23];
  }
  if (cursor) {
    U8[$f0 + 24] = 15;
    U8[$f0 + 23] = 0;
    U8[$f0 + 31] = 0;
  }
  remap = false;
  for (let $i2 = 0; $i2 <= 15; $i2++) {
    c = $i2;
    if (U8[$f0 + c + 16] !== c) {
      remap = true;
    }
  }
  if (remap) {
    (await Blit.RemapPic($f0, $f0 + 16, 0, false, glyph));
  }
  Blit.ShowPic(col, row, glyph);
  S.sp = $sp;
}

export function KindColour(kind: number) {
  let $r0: number = 0;
  if (U8[226936] >= 16) {
    $r0 = U8[kind + 261059];
  } else {
    $r0 = U8[kind + 261066];
  }
  return $r0;
}

export function CluesShown() {
  let $r0: boolean = false;
  $r0 = U8[227085] !== 0;
  return $r0;
}

export async function DrawSquare(mx: number, my: number, cursor: boolean) {
  let sym: number = 0, kind: number = 0, fill: number = 0, mark: number = 0, script: number = 0, map: number = 0;
  script = U8[232633];
  map = U8[r32(227033) + 394];
  sym = 260;
  if (View3D.GetWallType(mx, my, 0) > 0) {
    sym = (sym + 1) & 65535;
  }
  if (View3D.GetWallType(mx, my, 2) > 0) {
    sym = (sym + 2) & 65535;
  }
  if (View3D.GetWallType(mx, my, 4) > 0) {
    sym = (sym + 4) & 65535;
  }
  if (View3D.GetWallType(mx, my, 6) > 0) {
    sym = (sym + 8) & 65535;
  }
  if ((mx === I8[231432]) && (my === I8[231433])) {
    sym = 256 + Math.trunc(U8[231434] / 2);
  }
  kind = (await EvtKind.Kind(View3D.GetMapEvent(mx, my))) & 255;
  fill = 8;
  if (kind !== 0) {
    fill = KindColour(kind) & 255;
  }
  mark = 0;
  if (MapNotes.Note(script, map, mx, my) !== "") {
    mark = 2;
  } else if (CluesShown() && ClueBook.Marked(map, mx, my)) {
    mark = 1;
  }
  (await ShowSymbol(2 + mx, 3 + my, sym, !Explored.Visited(script, map, mx, my), fill, mark, cursor));
}

export async function DrawMap() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let mx: number = 0, my: number = 0, kind: number = 0, row: number = 0;
  (await EvtKind.Prepare());
  rt.fill($f0, 7, (false ? 1 : 0));
  TextRend.ClearScreen();
  (await Border.DrawBorder(1, 1, 38, 22, 0));
  for (let $i1 = 0; $i1 <= 15; $i1++) {
    my = $i1;
    for (let $i2 = 0; $i2 <= 15; $i2++) {
      mx = $i2;
      (await DrawSquare(mx, my, false));
      kind = (await EvtKind.Kind(View3D.GetMapEvent(mx, my))) & 255;
      if (kind !== 0) {
        U8[$f0 + kind - 1] = true ? 1 : 0;
      }
    }
  }
  TextRend.DisplayString(19, 3, 15, AreaName.CurrentArea());
  TextRend.DisplayString(19, 5, 10, "Bright: visited");
  TextRend.DisplayString(19, 6, 8, "Dim: not visited");
  if (NoteColour() === 14) {
    TextRend.DisplayString(19, 7, 14, "Yellow: Player Note");
  } else {
    TextRend.DisplayString(19, 7, NoteColour(), "Magenta: Player Note");
  }
  row = 8;
  if (CluesShown()) {
    TextRend.DisplayString(19, row, 11, "Cyan: Clue Book");
    row = (row + 1) & 255;
  }
  TextRend.DisplayString(19, row, 10, "Party at " + StrUtil.NumStr(I8[231432]) + "," + StrUtil.NumStr(I8[231433]));
  row = (row + 2) & 255;
  for (let $i3 = 1; $i3 <= 7; $i3++) {
    kind = $i3;
    if ((U8[$f0 + kind - 1] !== 0)) {
      (await ShowSymbol(19, row, 260, false, KindColour(kind), 0, false));
      TextRend.DisplayString(21, row, 10, rS(kind * 9 + 261065));
      row = (row + 1) & 255;
    }
  }
  S.sp = $sp;
}

export async function OnAreaMap() {
  let $r0: boolean = false;
  $r0 = U8[227109] === 1;
  if (U8[227109] !== 1) {
    (await TextRend.DisplayAndPause(14, "The wilderness has its own map."));
    TextRend.ClearBottomLine();
  }
  return $r0;
}

export async function DrawTools() {
  if (U8[227109] === 1) {
    (await DrawMap());
  } else {
    TextRend.ClearScreen();
    (await Border.DrawBorder(1, 1, 38, 22, 0));
  }
  TextRend.DisplayCentered(1, 38, 1, 15, "Companion Tools");
}

export async function MapTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 32);
  let ch: number = 0, cx: number = 0, cy: number = 0, nx: number = 0, ny: number = 0, script: number = 0, map: number = 0;
  if (!(await OnAreaMap())) {
    { S.sp = $sp; return; }
  }
  script = U8[232633];
  map = U8[r32(227033) + 394];
  cx = I8[231432];
  cy = I8[231433];
  do {
    (await DrawSquare(cx, cy, true));
    TextRend.ClearRect(2, 20, 37, 21);
    TextRend.DisplayString(2, 20, 10, StrUtil.NumStr(cx) + "," + StrUtil.NumStr(cy) + " ");
    if (CluesShown()) {
      TextRend.DisplayString(8, 20, 11, ClueBook.Note(map, cx, cy));
    }
    TextRend.DisplayString(8, 21, NoteColour(), MapNotes.Note(script, map, cx, cy));
    U8[235273] = true ? 1 : 0;
    ch = (await MenuCore.MenuHorizontal("Map: ", "Write Clear Exit", 13, 10, 15, true, false, $f0)) & 255;
    nx = cx;
    ny = cy;
    if ((U8[$f0] !== 0)) {
      switch (ch) {
        case 75: {
          if (cx > 0) {
            nx = (nx - 1) << 24 >> 24;
          }
          break;
        }
        case 77: {
          if (cx < 15) {
            nx = (nx + 1) << 24 >> 24;
          }
          break;
        }
        case 72: {
          if (cy > 0) {
            ny = (ny - 1) << 24 >> 24;
          }
          break;
        }
        case 80: {
          if (cy < 15) {
            ny = (ny + 1) << 24 >> 24;
          }
          break;
        }
      }
    } else {
      switch (ch) {
        case 87: {
          wS($f0 + 1, 30, (await TextRend.ReadString("Note: ", 10, 30)));
          if (rS($f0 + 1) !== "") {
            if (!MapNotes.SetNote(script, map, cx, cy, rS($f0 + 1))) {
              (await TextRend.DisplayAndPause(14, "The notes are full."));
            }
          }
          break;
        }
        case 67: {
          MapNotes.ClearNote(script, map, cx, cy);
          break;
        }
      }
    }
    if (((nx !== cx) || (ny !== cy)) || !(U8[$f0] !== 0)) {
      (await DrawSquare(cx, cy, false));
      cx = nx;
      cy = ny;
    }
  } while (!(!(U8[$f0] !== 0) && (ch === 0 || ch === 69)));
  TextRend.ClearRect(2, 20, 37, 21);
  TextRend.ClearBottomLine();
  S.sp = $sp;
}
