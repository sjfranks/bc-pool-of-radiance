// Generated from src/cbtmap.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_TERR from './c_terr';
import * as C_SPELL from './c_spell';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as MapTiles from './maptiles';
import * as TextRend from './textrend';
import * as SoundDrv from './sounddrv';
import * as C_IFC from './c_ifc';
import * as C_DIR from './c_dir';
import * as C_SOUND from './c_sound';
import * as Pathing from './pathing';
import * as MenuCore from './menucore';
import * as Blit from './blit';
import * as CharHlp from './charhlp';
import * as Border from './border';

export const WIDE_ROWS = 144;
export const WIDE_CELLS = 38;
export const CURSOR_CELL = 25;
export const PREVIEW_PACE = 12;
export const PREVIEW_HOLD = 3;
export const PREVIEW_GAP = 2;
export const AREA_CELLS = 80;

export const $at = { boltTracer: 226873, aimReport: 226877, gridX: 226881, gridY: 226953, wideLayout: 227025, viewLastX: 227026, viewLastY: 227027, viewFullX: 227028, halfX: 227029, halfY: 227030, crIdxArr: 236589, previewOn: 237839, previewRadius: 237840, previewShape: 237841, previewSpell: 237842, areaArt: 237843, previewReport: 237844, aimSet: 237845, aimX: 237846, aimY: 237847, aimSize: 237848, areaCount: 237849, areaX: 237850, areaY: 237930, areaRing: 238010, ringCount: 238090, ringsShown: 238091, frameNo: 238092, lastTick: 238093 };

export function SetLayout(wide: boolean) {
  U8[227025] = wide ? 1 : 0;
  U8[226089] = wide ? 1 : 0;
  if (wide) {
    U8[227026] = 12;
    U8[227027] = 5;
    U8[227028] = 11;
  } else {
    U8[227026] = 6;
    U8[227027] = 6;
    U8[227028] = 6;
  }
  U8[227029] = Math.trunc(I8[227026] / 2);
  U8[227030] = Math.trunc(I8[227027] / 2);
}

export function CenterX() {
  let $r0: number = 0;
  $r0 = (I8[r32(144641) + 2] + I8[227029]) << 24 >> 24;
  return $r0;
}

export function CenterY() {
  let $r0: number = 0;
  $r0 = (I8[r32(144641) + 3] + I8[227030]) << 24 >> 24;
  return $r0;
}

export async function SetCombatPalette() {
  (await Blit.SetPaletteRegister(0, 8));
  (await Blit.SetPaletteRegister(8, 0));
}

export async function SetNoncombatPalette() {
  (await Blit.SetPaletteRegister(0, 0));
  (await Blit.SetPaletteRegister(8, 8));
}

export async function RedrawArenaCell(x: number, y: number) {
  let relX: number = 0, relY: number = 0;
  relX = (x - I8[r32(144641) + 2]) << 24 >> 24;
  relY = (y - I8[r32(144641) + 3]) << 24 >> 24;
  (await UpdateCombatMapTile(relX, relY, 0));
  (await DrawCellCreature(x, y));
}

export function BuildArenaArrays() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let i: number = 0, j: number = 0;
  rt.fill(236589, 1250, 0);
  for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[i * 4 + 144007] > 0) {
      for (let $i2 = 0; $i2 <= 3; $i2++) {
        j = $i2;
        if (Pathing.GetIconTileDelta(U8[i * 4 + 144007], j, $f0, $f0 + 1)) {
          U8[(I8[i * 4 + 144005] + I8[$f0 + 1]) * 50 + (I8[i * 4 + 144004] + I8[$f0]) + 236589] = i;
        }
      }
    }
  }
  CalcGridDeltas();
  S.sp = $sp;
}

export function GetArenaContents(x: number, y: number, crIdx: number, terrIdx: number) {
  if (Pathing.OnArena(x, y)) {
    U8[terrIdx] = U8[r32(144641) + y * 50 + x + 7];
    U8[crIdx] = U8[y * 50 + x + 236589];
  } else {
    U8[crIdx] = 0;
    U8[terrIdx] = 0;
  }
}

export function OccupantAt(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: number = 0;
  GetArenaContents(x, y, $f0, $f0 + 1);
  $r0 = U8[$f0];
  S.sp = $sp;
  return $r0;
}

export async function UpdateCombatMapTile(x: number, y: number, crIdx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  U8[$f0] = crIdx;
  let absX: number = 0, absY: number = 0, i: number = 0, size: number = 0;
  if (U8[$f0] === 0) {
    absX = (x + I8[r32(144641) + 2]) << 24 >> 24;
    absY = (y + I8[r32(144641) + 3]) << 24 >> 24;
    GetArenaContents(absX, absY, $f0, $f0 + 3);
  }
  if (U8[$f0] > 0) {
    x = I8[U8[$f0] + 226880];
    y = I8[U8[$f0] + 226952];
    absX = (x + I8[r32(144641) + 2]) << 24 >> 24;
    absY = (y + I8[r32(144641) + 3]) << 24 >> 24;
    size = U8[U8[$f0] * 4 + 144007];
    for (let $i1 = 0; $i1 <= 3; $i1++) {
      i = $i1;
      if (Pathing.GetIconTileDelta(size, i, $f0 + 1, $f0 + 2)) {
        if (ViewCoordsValid(x + I8[$f0 + 1], y + I8[$f0 + 2])) {
          (await MapTiles.DrawTerrain((x + I8[$f0 + 1]) * 3, (y + I8[$f0 + 2]) * 3, U8[r32(144641) + (absY + I8[$f0 + 2]) * 50 + (absX + I8[$f0 + 1]) + 7]));
        }
      }
    }
  } else if (ViewCoordsValid(x, y)) {
    (await MapTiles.DrawTerrain(x * 3, y * 3, U8[r32(144641) + absY * 50 + absX + 7]));
  }
  S.sp = $sp;
}

export function ViewCoordsValid(x: number, y: number) {
  let $r0: boolean = false;
  if ((((x < 0) || (x > I8[227026])) || (y < 0)) || (y > I8[227027])) {
    $r0 = false;
  } else {
    $r0 = true;
  }
  return $r0;
}

export function CombatIconVisible(creature: number, whole: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let i: number = 0, slot: number = 0, $r0: boolean = false;
  $r0 = true;
  slot = CombatSlot(creature) & 255;
  if ((slot === 0) || (U8[slot * 4 + 144007] === 0)) {
    $r0 = false;
  } else {
    for (let $i1 = 0; $i1 <= 3; $i1++) {
      i = $i1;
      if (Pathing.GetIconTileDelta(U8[slot * 4 + 144007], i, $f0, $f0 + 1)) {
        if (!ViewCoordsValid(I8[slot + 226880] + I8[$f0], I8[slot + 226952] + I8[$f0 + 1])) {
          $r0 = false;
          if (whole !== 0) {
            { S.sp = $sp; return $r0; }
          }
        } else {
          $r0 = true;
          if (whole === 0) {
            { S.sp = $sp; return $r0; }
          }
        }
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export async function BuildViewBuffer(x: number, y: number, delta: number) {
  let margin: number = 0, pixX: number = 0, pixY: number = 0, i: number = 0, j: number = 0, cX: number = 0, cY: number = 0, minX: number = 0, maxX: number = 0, minY: number = 0, maxY: number = 0, $r0: boolean = false;
  $r0 = false;
  cX = CenterX() << 24 >> 24;
  cY = CenterY() << 24 >> 24;
  if ((delta === 0) || (delta === 255)) {
    minX = cX;
    maxX = cX;
    minY = cY;
    maxY = cY;
  } else {
    if (delta > 3) {
      delta = 3;
    }
    margin = (3 - delta) << 24 >> 24;
    minX = (I8[r32(144641) + 2] + margin) << 24 >> 24;
    maxX = ((I8[r32(144641) + 2] + I8[227028]) - margin) << 24 >> 24;
    minY = (I8[r32(144641) + 3] + margin) << 24 >> 24;
    maxY = ((I8[r32(144641) + 3] + I8[227027]) - margin) << 24 >> 24;
  }
  if (((((delta !== 255) && (x >= minX)) && (x <= maxX)) && (y >= minY)) && (y <= maxY)) {
    return $r0;
  }
  if ((x < minX) || (x > maxX)) {
    cX = x;
  }
  if ((y < minY) || (y > maxY)) {
    cY = y;
  }
  if (cX > (49 - (I8[227026] - I8[227029]))) {
    cX = (49 - (I8[227026] - I8[227029])) << 24 >> 24;
  }
  if (cX < I8[227029]) {
    cX = I8[227029];
  }
  if (cY > (24 - (I8[227027] - I8[227030]))) {
    cY = (24 - (I8[227027] - I8[227030])) << 24 >> 24;
  }
  if (cY < I8[227030]) {
    cY = I8[227030];
  }
  U8[r32(144641) + 2] = cX - I8[227029];
  U8[r32(144641) + 3] = cY - I8[227030];
  pixY = 0;
  cY = I8[r32(144641) + 3];
  for (let $i1 = 0, $e1 = I8[227027]; $i1 <= $e1; $i1++) {
    j = $i1;
    pixX = 0;
    cX = I8[r32(144641) + 2];
    for (let $i2 = 0, $e2 = I8[227026]; $i2 <= $e2; $i2++) {
      i = $i2;
      (await MapTiles.DrawTerrain(pixX, pixY, U8[r32(144641) + cY * 50 + cX + 7]));
      pixX = (pixX + 3) << 24 >> 24;
      cX = (cX + 1) << 24 >> 24;
    }
    pixY = (pixY + 3) << 24 >> 24;
    cY = (cY + 1) << 24 >> 24;
  }
  CalcGridDeltas();
  $r0 = true;
  return $r0;
}

export async function ScrollView(x: number, y: number, delta: number, dir: number) {
  let p: number = 0, i: number = 0, tx: number = 0, ty: number = 0;
  tx = (x + I8[dir + 132927]) << 24 >> 24;
  ty = (y + I8[dir + 132936]) << 24 >> 24;
  if ((await BuildViewBuffer(tx, ty, delta))) {
    for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
      i = $i1;
      p = r32(i * 4 + 144292);
      if ((U8[i * 4 + 144007] > 0) && (p !== 0)) {
        if ((U8[p + 269] !== 0) && CombatIconVisible(p, 0)) {
          (await MapTiles.DrawIconAnimSprite(I8[i + 226880], I8[i + 226952], U8[r32(p + 264) + 9], 0, U8[p + 191]));
        }
      }
    }
  }
  (await RedrawArenaCell(x, y));
  if (!ViewCoordsValid(tx - I8[r32(144641) + 2], ty - I8[r32(144641) + 3])) {
    if (tx > 49) {
      tx = 49;
    }
    if (tx < 0) {
      tx = 0;
    }
    if (ty > 24) {
      ty = 24;
    }
    if (ty < 0) {
      ty = 0;
    }
  }
  (await DrawCursorCell(tx, ty));
  (await Blit.FlushView());
}

export async function SetCreatureFacing(creature: number, dir: number, frame: number, eraseOnly: number) {
  let slot: number = 0;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    U8[r32(creature + 264) + 9] = dir;
    return;
  }
  if (!CombatIconVisible(creature, 1)) {
    (await ScrollView(CombatCellX(creature), CombatCellY(creature), 3, 8));
  }
  if (((Math.trunc(U8[r32(creature + 264) + 9] / 4) !== Math.trunc(dir / 4)) || (frame !== 0)) || (eraseOnly !== 0)) {
    (await UpdateCombatMapTile(0, 0, slot));
  }
  if (dir !== U8[r32(creature + 264) + 9]) {
    U8[r32(creature + 264) + 9] = dir;
  }
  if (eraseOnly === 0) {
    if (CombatIconVisible(creature, 1)) {
      (await MapTiles.DrawIconAnimSprite(I8[slot + 226880], I8[slot + 226952], dir, frame, U8[creature + 191]));
      (await Blit.FlushView());
    }
  }
}

export function CombatCellX(creature: number) {
  let slot: number = 0, $r0: number = 0;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    $r0 = 0;
  } else {
    $r0 = I8[slot * 4 + 144004];
  }
  return $r0;
}

export function CombatCellY(creature: number) {
  let slot: number = 0, $r0: number = 0;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    $r0 = 0;
  } else {
    $r0 = I8[slot * 4 + 144005];
  }
  return $r0;
}

export function GetIconSize(creature: number) {
  let slot: number = 0, $r0: number = 0;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    $r0 = 0;
  } else {
    $r0 = U8[slot * 4 + 144007];
  }
  return $r0;
}

export function CombatSlot(creature: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  if (creature !== 0) {
    for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
      i = $i1;
      if (r32(i * 4 + 144292) === creature) {
        $r0 = i;
        return $r0;
      }
    }
  }
  return $r0;
}

export function ProbeDirection(creature: number, dir: number, crIdx: number, terrIdx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, slot: number = 0, best: number = 0, nx: number = 0, ny: number = 0, x: number = 0, y: number = 0;
  U8[crIdx] = 0;
  U8[terrIdx] = 23;
  best = 1;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    U8[terrIdx] = 0;
    { S.sp = $sp; return; }
  }
  x = I8[slot * 4 + 144004];
  y = I8[slot * 4 + 144005];
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if (Pathing.GetIconTileDelta(U8[slot * 4 + 144007], i, $f0 + 2, $f0 + 3)) {
      nx = ((x + I8[$f0 + 2]) + I8[dir + 132927]) << 24 >> 24;
      ny = ((y + I8[$f0 + 3]) + I8[dir + 132936]) << 24 >> 24;
      GetArenaContents(nx, ny, $f0, $f0 + 1);
      if (U8[$f0] === slot) {
        U8[$f0] = 0;
      }
      if (U8[$f0] > 0) {
        U8[crIdx] = U8[$f0];
      }
      if ((U8[$f0 + 1] === 0) || (U8[terrIdx] === 0)) {
        U8[terrIdx] = 0;
      } else if ((U8[$f0 + 1] === 30) || (U8[terrIdx] === 30)) {
        U8[terrIdx] = 30;
      } else if ((U8[$f0 + 1] === 66) || (U8[terrIdx] === 66)) {
        U8[terrIdx] = 66;
      } else if (U8[U8[$f0 + 1] * 3 + 132942] >= best) {
        best = U8[U8[$f0 + 1] * 3 + 132942];
        U8[terrIdx] = U8[$f0 + 1];
      }
    }
  }
  S.sp = $sp;
}

export function ProbeTerrain(creature: number, dir: number, terr: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, slot: number = 0, $r0: boolean = false;
  $r0 = false;
  slot = CombatSlot(creature) & 255;
  if (slot === 0) {
    { S.sp = $sp; return $r0; }
  }
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if (Pathing.GetIconTileDelta(U8[slot * 4 + 144007], i, $f0 + 2, $f0 + 3)) {
      GetArenaContents((I8[slot * 4 + 144004] + I8[$f0 + 2]) + I8[dir + 132927], (I8[slot * 4 + 144005] + I8[$f0 + 3]) + I8[dir + 132936], $f0, $f0 + 1);
      if (U8[$f0 + 1] === terr) {
        $r0 = true;
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function CloudCell(side: number, i: number, x: number, y: number, cx: number, cy: number) {
  let d: number = 0;
  if (side === 3) {
    d = U8[i + 133212];
  } else {
    d = U8[i + 133208];
  }
  U8[cx] = x + I8[d + 132927];
  U8[cy] = y + I8[d + 132936];
}

export function CloudTerrain(spell: number) {
  let $r0: number = 0;
  if (spell === 91) {
    $r0 = 66;
  } else {
    $r0 = 30;
  }
  return $r0;
}

export function AppendCloud() {
  let node: number = 0, $r0: number = 0;
  node = r32(146453);
  if (r32(146453) === 0) {
    w32(146453, rt.getMem(31));
    node = r32(146453);
  } else {
    while (r32(node + 4) !== 0) {
      node = r32(node + 4);
    }
    w32(node + 4, rt.getMem(31));
    node = r32(node + 4);
  }
  rt.fill(node, 31, 0);
  $r0 = node;
  return $r0;
}

export function SpreadCloud(node: number, crIdx: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let p2: number = 0, j: number = 0, k: number = 0;
  for (let $i1 = 1, $e1 = U8[node + 30] * U8[node + 30]; $i1 <= $e1; $i1++) {
    k = $i1;
    CloudCell(U8[node + 30], k, I8[node + 26], I8[node + 27], $f0 + 1, $f0 + 2);
    GetArenaContents(I8[$f0 + 1], I8[$f0 + 2], crIdx + k - 1, $f0);
    if ((U8[$f0] > 0) && (U8[U8[$f0] * 3 + 132942] < 255)) {
      U8[node + k + 16] = 1;
    } else {
      U8[node + k + 16] = 0;
    }
    if (rt.inS(C_TERR.CLOUDS, U8[$f0])) {
      p2 = r32(146453);
      while (p2 !== 0) {
        if (p2 !== node) {
          for (let $i3 = 1, $e3 = U8[p2 + 30] * U8[p2 + 30]; $i3 <= $e3; $i3++) {
            j = $i3;
            CloudCell(U8[p2 + 30], j, I8[p2 + 26], I8[p2 + 27], $f0 + 3, $f0 + 4);
            if (((U8[p2 + j + 16] !== 0) && (I8[$f0 + 3] === I8[$f0 + 1])) && (I8[$f0 + 4] === I8[$f0 + 2])) {
              if (!rt.inS(C_TERR.CLOUDS, U8[p2 + j + 7])) {
                U8[$f0] = U8[p2 + j + 7];
              }
            }
          }
        }
        p2 = r32(p2 + 4);
      }
    } else if (U8[$f0] === 31) {
      for (let $i4 = 1, $e4 = U8[144640]; $i4 <= $e4; $i4++) {
        j = $i4;
        if ((I8[j * 7 + 144581] === I8[$f0 + 1]) && (I8[j * 7 + 144582] === I8[$f0 + 2])) {
          U8[$f0] = U8[j * 7 + 144583];
        }
      }
    }
    U8[node + k + 7] = U8[$f0];
    if (U8[node + k + 16] !== 0) {
      U8[r32(144641) + I8[$f0 + 2] * 50 + I8[$f0 + 1] + 7] = U8[node + 29];
    }
  }
  S.sp = $sp;
}

export function LiftCloud(node: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let q: number = 0, corpse: boolean = false, d: number = 0, i: number = 0;
  for (let $i1 = 1, $e1 = U8[node + 30] * U8[node + 30]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[node + i + 16] !== 0) {
      CloudCell(U8[node + 30], i, I8[node + 26], I8[node + 27], $f0, $f0 + 1);
      corpse = false;
      for (let $i2 = 1, $e2 = U8[144640]; $i2 <= $e2; $i2++) {
        d = $i2;
        if (((r32(d * 7 + 144577) !== 0) && (I8[d * 7 + 144581] === I8[$f0])) && (I8[d * 7 + 144582] === I8[$f0 + 1])) {
          corpse = true;
        }
      }
      if (corpse) {
        U8[r32(144641) + I8[$f0 + 1] * 50 + I8[$f0] + 7] = 31;
      } else {
        U8[r32(144641) + I8[$f0 + 1] * 50 + I8[$f0] + 7] = U8[node + i + 7];
      }
    }
  }
  if (r32(146453) === node) {
    w32(146453, r32(node + 4));
  } else {
    q = r32(146453);
    while (r32(q + 4) !== node) {
      q = r32(q + 4);
    }
    w32(q + 4, r32(node + 4));
  }
  rt.freeMem(node);
  q = r32(146453);
  while (q !== 0) {
    for (let $i5 = 1, $e5 = U8[q + 30] * U8[q + 30]; $i5 <= $e5; $i5++) {
      i = $i5;
      if (U8[q + i + 16] !== 0) {
        CloudCell(U8[q + 30], i, I8[q + 26], I8[q + 27], $f0, $f0 + 1);
        U8[r32(144641) + I8[$f0 + 1] * 50 + I8[$f0] + 7] = U8[q + 29];
      }
    }
    q = r32(q + 4);
  }
  S.sp = $sp;
}

export function RegisterDowned(creature: number, x: number, y: number) {
  let k: number = 0, free: number = 0;
  free = 0;
  for (let $i1 = 1, $e1 = U8[144640]; $i1 <= $e1; $i1++) {
    k = $i1;
    if (r32(k * 7 + 144577) === creature) {
      return;
    } else if ((r32(k * 7 + 144577) === 0) && (free === 0)) {
      free = k;
    }
  }
  if (free === 0) {
    if (U8[144640] >= 8) {
      return;
    }
    U8[144640] = U8[144640] + 1;
    free = U8[144640];
  }
  U8[free * 7 + 144583] = U8[r32(144641) + y * 50 + x + 7];
  if (!rt.inS(C_TERR.CLOUDS, U8[r32(144641) + y * 50 + x + 7])) {
    U8[r32(144641) + y * 50 + x + 7] = 31;
  }
  w32(free * 7 + 144577, creature);
  U8[free * 7 + 144581] = x;
  U8[free * 7 + 144582] = y;
}

export async function CreatureDowned(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let slot: number = 0, k: number = 0, cellX: number = 0, cellY: number = 0;
  (await SoundDrv.SoundSetAutoStop(0));
  if (U8[141176] !== 5) {
    (await SoundDrv.SoundEffect(r16(132897), 8));
    (await TextRend.PauseOnly());
  } else {
    for (let $i1 = 1, $e1 = U8[144640]; $i1 <= $e1; $i1++) {
      k = $i1;
      if (r32(k * 7 + 144577) === creature) {
        (await SoundDrv.SoundSetAutoStop(10));
        { S.sp = $sp; return; }
      }
    }
    slot = CombatSlot(creature) & 255;
    if (slot === 0) {
      (await SoundDrv.SoundSetAutoStop(10));
      { S.sp = $sp; return; }
    }
    cellX = CombatCellX(creature) << 24 >> 24;
    cellY = CombatCellY(creature) << 24 >> 24;
    if (!CombatIconVisible(creature, 1)) {
      (await ScrollView(cellX, cellY, 3, 8));
    }
    (await UpdateCombatMapTile(0, 0, slot));
    for (let $i2 = 0; $i2 <= 3; $i2++) {
      k = $i2;
      if (Pathing.GetIconTileDelta(U8[slot * 4 + 144007], k, $f0, $f0 + 1)) {
        Blit.BlitTileClipped((I8[slot + 226880] + I8[$f0]) * 3, (I8[slot + 226952] + I8[$f0 + 1]) * 3, 0, 5, r32(143991), r32(141249));
      }
    }
    (await Blit.FlushView());
    if (U8[r32(creature + 264) + 19] === 0) {
      RegisterDowned(creature, cellX, cellY);
    }
    (await SoundDrv.SoundEffect(r16(132897), 8));
    (await TextRend.PauseOnly());
    (await UpdateCombatMapTile(0, 0, slot));
    U8[slot * 4 + 144007] = 0;
    BuildArenaArrays();
    (await ScrollView(CenterX(), CenterY(), 3, 8));
    U8[r32(creature + 264) + 3] = 0;
    U8[r32(creature + 264) + 6] = 0;
    U8[r32(creature + 264)] = 0;
    U8[r32(creature + 264) + 7] = 0;
  }
  (await SoundDrv.SoundSetAutoStop(10));
  S.sp = $sp;
}

export function IsValidCreatureLoc(creature: number, x: number, y: number, moving: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let slot: number = 0, i: number = 0, found: boolean = false, $r0: boolean = false;
  if (U8[141176] === 5) {
    $r0 = false;
    slot = CombatSlot(creature) & 255;
    if (slot === 0) {
      { S.sp = $sp; return $r0; }
    }
    U8[slot * 4 + 144007] = U8[creature + 108] & 127;
    U8[slot * 4 + 144004] = x;
    U8[slot * 4 + 144005] = y;
    ProbeDirection(creature, 8, $f0, $f0 + 1);
    if (((U8[$f0] !== 0) || (U8[$f0 + 1] === 0)) || (U8[U8[$f0 + 1] * 3 + 132942] === 255)) {
      U8[slot * 4 + 144007] = 0;
    } else {
      $r0 = true;
      if (moving) {
        if (U8[r32(creature + 264) + 19] === 0) {
          for (let $i1 = 1, $e1 = U8[144640]; $i1 <= $e1; $i1++) {
            i = $i1;
            if (r32(i * 7 + 144577) === creature) {
              if (U8[i * 7 + 144583] !== 31) {
                U8[$f0 + 1] = U8[i * 7 + 144583];
              }
              rt.fill(i * 7 + 144577, 7, 0);
            }
          }
          found = false;
          for (let $i2 = 1, $e2 = U8[144640]; $i2 <= $e2; $i2++) {
            i = $i2;
            if (((r32(i * 7 + 144577) !== 0) && (I8[i * 7 + 144581] === x)) && (I8[i * 7 + 144582] === y)) {
              found = true;
            }
          }
          if (!found) {
            U8[r32(144641) + y * 50 + x + 7] = U8[$f0 + 1];
          }
        }
      }
      BuildArenaArrays();
    }
  } else {
    $r0 = true;
  }
  S.sp = $sp;
  return $r0;
}

export async function DisplayMapViewCentered(creature: number, delta: number, cursor: boolean) {
  U8[r32(144641) + 4] = cursor ? 1 : 0;
  U8[r32(144641) + 5] = GetIconSize(creature);
  (await ScrollView(CombatCellX(creature), CombatCellY(creature), delta, 8));
  U8[r32(144641) + 4] = false ? 1 : 0;
  U8[r32(144641) + 5] = 1;
}

export async function StartSpellPreview(shape: number, spell: number, radius: number, areaCell: number, report: boolean) {
  (await StopSpellPreview());
  U8[237841] = shape;
  U8[237842] = spell;
  U8[237840] = radius;
  U8[237843] = areaCell;
  U8[237844] = report ? 1 : 0;
  U8[237845] = false ? 1 : 0;
  U8[238091] = 0;
  U8[237849] = 0;
  U8[237839] = true ? 1 : 0;
  w32(227110, 18);
}

export async function TickSpellPreview() {
  let now: number = 0, ring: number = 0, i: number = 0;
  if (!((U8[237839] !== 0) && (U8[237845] !== 0))) {
    return;
  }
  now = (await TextRend.GetTicks()) | 0;
  if ((now >= ri32(238093)) && ((now - ri32(238093)) < 12)) {
    return;
  }
  w32(238093, now);
  ring = U8[238092];
  if (ring <= U8[238090]) {
    for (let $i1 = 1, $e1 = U8[237849]; $i1 <= $e1; $i1++) {
      i = $i1;
      if ((U8[i + 238009] + 1) === ring) {
        (await RepaintCell(I8[i + 237849], I8[i + 237929]));
        (await DrawAreaCell(i, 1));
      } else if (U8[i + 238009] === ring) {
        (await DrawAreaCell(i, 0));
      }
    }
    if (ring < U8[238090]) {
      U8[238091] = ring + 1;
    }
  } else if (ring === (U8[238090] + 3)) {
    (await EraseSpellPreview());
  } else if (ring >= ((U8[238090] + 3) + 2)) {
    U8[238092] = 0;
    return;
  }
  U8[238092] = U8[238092] + 1;
  (await Blit.FlushView());
}

export async function StopSpellPreview() {
  if ((U8[237839] !== 0)) {
    w32(227110, 0);
    U8[237845] = false ? 1 : 0;
    (await EraseSpellPreview());
    (await Blit.FlushView());
    if ((U8[237844] !== 0)) {
      (await Border.ClearBox(0, 23, 39, 23));
    }
    U8[237844] = false ? 1 : 0;
    U8[237839] = false ? 1 : 0;
  }
}

export function CountTargets(creature: number, range: number) {
  let n: number = 0, cnt: number = 0, i: number = 0, $r0: number = 0;
  Pathing.BuildTargetList(CombatCellX(creature), CombatCellY(creature), range, 255, GetIconSize(creature), r32(144641));
  n = U8[144645];
  cnt = 0;
  if (n > 0) {
    for (let $i1 = 1, $e1 = n; $i1 <= $e1; $i1++) {
      i = $i1;
      if (CharHlp.EnemyTeam(creature) === CharHlp.Team(r32(U8[i * 3 + 144643] * 4 + 144292))) {
        cnt = (cnt + 1) & 255;
        mv(cnt * 3 + 144643, i * 3 + 144643, 3);
      }
    }
    n = cnt;
    U8[144645] = cnt;
  }
  $r0 = n;
  for (let $i2 = 1, $e2 = n; $i2 <= $e2; $i2++) {
    i = $i2;
    U8[i + 146459] = U8[i * 3 + 144643];
  }
  return $r0;
}

export function CalcDistance(creature: number, other: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 217);
  let i: number = 0, $r0: number = 0;
  Pathing.SaveTargets($f0);
  U8[r32(144641) + 6] = 1;
  Pathing.BuildTargetList(CombatCellX(creature), CombatCellY(creature), 255, 255, GetIconSize(creature), r32(144641));
  U8[r32(144641) + 6] = 0;
  i = 1;
  while ((i <= U8[144645]) && (r32(U8[i * 3 + 144643] * 4 + 144292) !== other)) {
    i = (i + 1) & 255;
  }
  if (i <= U8[144645]) {
    $r0 = U8[i * 3 + 144644] >>> 1;
  } else {
    $r0 = 255;
  }
  Pathing.RestoreTargets($f0);
  S.sp = $sp;
  return $r0;
}

export function InAimFootprint(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let i: number = 0, $r0: boolean = false;
  $r0 = false;
  if ((U8[237845] !== 0)) {
    for (let $i1 = 0; $i1 <= 3; $i1++) {
      i = $i1;
      if (Pathing.GetIconTileDelta(U8[237848], i, $f0, $f0 + 1)) {
        if (((I8[237846] + I8[$f0]) === x) && ((I8[237847] + I8[$f0 + 1]) === y)) {
          $r0 = true;
        }
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export async function DrawCellCreature(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  GetArenaContents(x, y, $f0, $f0 + 1);
  if (U8[$f0] > 0) {
    if (CombatIconVisible(r32(U8[$f0] * 4 + 144292), 0)) {
      (await MapTiles.DrawIconAnimSprite(I8[U8[$f0] + 226880], I8[U8[$f0] + 226952], U8[r32(r32(U8[$f0] * 4 + 144292) + 264) + 9], 0, U8[r32(U8[$f0] * 4 + 144292) + 191]));
    }
  }
  S.sp = $sp;
}

export async function DrawCellTop(x: number, y: number, relX: number, relY: number) {
  if (InAimFootprint(x, y)) {
    (await MapTiles.DrawIconAnimSprite(relX, relY, 0, 0, 25));
  }
  (await DrawCellCreature(x, y));
}

export async function RepaintCell(x: number, y: number) {
  let relX: number = 0, relY: number = 0;
  relX = (x - I8[r32(144641) + 2]) << 24 >> 24;
  relY = (y - I8[r32(144641) + 3]) << 24 >> 24;
  if (ViewCoordsValid(relX, relY)) {
    (await MapTiles.DrawTerrain(relX * 3, relY * 3, U8[r32(144641) + y * 50 + x + 7]));
    (await DrawCellTop(x, y, relX, relY));
  }
}

export async function DrawPreviewArt(x: number, y: number, art: number, facing: number, half: number) {
  let relX: number = 0, relY: number = 0;
  relX = (x - I8[r32(144641) + 2]) << 24 >> 24;
  relY = (y - I8[r32(144641) + 3]) << 24 >> 24;
  if (ViewCoordsValid(relX, relY)) {
    (await MapTiles.DrawIconAnimSprite(relX, relY, facing, half, art));
    (await DrawCellCreature(x, y));
  }
}

export async function DrawAreaCell(i: number, half: number) {
  let relX: number = 0, relY: number = 0;
  if (U8[237841] === 2) {
    relX = (I8[i + 237849] - I8[r32(144641) + 2]) << 24 >> 24;
    relY = (I8[i + 237929] - I8[r32(144641) + 3]) << 24 >> 24;
    if (ViewCoordsValid(relX, relY)) {
      (await MapTiles.DrawTerrain(relX * 3, relY * 3, CloudTerrain(U8[237842])));
      (await DrawCellTop(I8[i + 237849], I8[i + 237929], relX, relY));
    }
  } else {
    (await DrawPreviewArt(I8[i + 237849], I8[i + 237929], U8[237843], 0, half));
  }
}

export async function EraseSpellPreview() {
  let i: number = 0;
  for (let $i1 = 1, $e1 = U8[237849]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[i + 238009] < U8[238091]) {
      (await RepaintCell(I8[i + 237849], I8[i + 237929]));
    }
  }
  U8[238091] = 0;
}

export function AddAreaCell(x: number, y: number, ring: number) {
  if (U8[237849] < 80) {
    U8[237849] = U8[237849] + 1;
    U8[U8[237849] + 237849] = x;
    U8[U8[237849] + 237929] = y;
    U8[U8[237849] + 238009] = ring;
    if (ring >= U8[238090]) {
      U8[238090] = ring + 1;
    }
  }
}

export function AddCaught(list: number, c: number) {
  let i: number = 0;
  for (let $i1 = 1, $e1 = U8[list]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (U8[list + i] === c) {
      return;
    }
  }
  if (U8[list] < 72) {
    U8[list] = U8[list] + 1;
    U8[list + U8[list]] = c;
  }
}

export async function ReportCaught(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 292);
  let i: number = 0;
  U8[$f0] = 0;
  if (U8[237841] === 0) {
    Pathing.SaveTargets($f0 + 73);
    Pathing.BuildAreaList(x, y, U8[237840]);
    for (let $i1 = 1, $e1 = U8[144645]; $i1 <= $e1; $i1++) {
      i = $i1;
      AddCaught($f0, U8[i * 3 + 144643]);
    }
    Pathing.RestoreTargets($f0 + 73);
  } else {
    for (let $i2 = 1, $e2 = U8[237849]; $i2 <= $e2; $i2++) {
      i = $i2;
      GetArenaContents(I8[i + 237849], I8[i + 237929], $f0 + 290, $f0 + 291);
      if (U8[$f0 + 290] > 0) {
        AddCaught($f0, U8[$f0 + 290]);
      }
    }
  }
  (await rt.FT[r32(226877)]($f0));
  S.sp = $sp;
}

export async function RestartSpellPreview(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 135);
  let relX: number = 0, relY: number = 0, i: number = 0;
  U8[237845] = true ? 1 : 0;
  U8[237846] = x;
  U8[237847] = y;
  U8[237848] = U8[r32(144641) + 5];
  U8[237849] = 0;
  U8[238090] = 0;
  switch (U8[237841]) {
    case 1: {
      AddAreaCell(x, y, 0);
      (await rt.FT[r32(226873)](U8[237842], x, y, $f0));
      for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
        i = $i1;
        AddAreaCell(I8[$f0 + i], I8[$f0 + i + 64], Math.trunc((i + 1) / 2));
      }
      break;
    }
    case 2: {
      for (let $i2 = 1, $e2 = U8[237840] * U8[237840]; $i2 <= $e2; $i2++) {
        i = $i2;
        CloudCell(U8[237840], i, x, y, $f0 + 129, $f0 + 130);
        GetArenaContents(I8[$f0 + 129], I8[$f0 + 130], $f0 + 133, $f0 + 134);
        if (U8[$f0 + 134] > 0) {
          if (U8[U8[$f0 + 134] * 3 + 132942] < 255) {
            AddAreaCell(I8[$f0 + 129], I8[$f0 + 130], (i > 1 ? 1 : 0));
          }
        }
      }
      break;
    }
    default: {
      for (let $i3 = 0, $e3 = I8[227027]; $i3 <= $e3; $i3++) {
        relY = $i3;
        for (let $i4 = 0, $e4 = I8[227026]; $i4 <= $e4; $i4++) {
          relX = $i4;
          U8[$f0 + 129] = I8[r32(144641) + 2] + relX;
          U8[$f0 + 130] = I8[r32(144641) + 3] + relY;
          w16($f0 + 131, U8[237840]);
          if (Pathing.WalkLine(x, y, $f0 + 129, $f0 + 130, $f0 + 131, r32(144641))) {
            AddAreaCell(I8[r32(144641) + 2] + relX, I8[r32(144641) + 3] + relY, Math.trunc(r16($f0 + 131) / 2));
          }
        }
      }
    }
  }
  if ((U8[237844] !== 0)) {
    (await ReportCaught(x, y));
  }
  U8[238092] = 0;
  w32(238093, (await TextRend.GetTicks()) - 12);
  S.sp = $sp;
}

export function CalcGridDeltas() {
  let i: number = 0;
  for (let $i1 = 1, $e1 = Pathing.LastSlot(); $i1 <= $e1; $i1++) {
    i = $i1;
    U8[i + 226880] = I8[i * 4 + 144004] - I8[r32(144641) + 2];
    U8[i + 226952] = I8[i * 4 + 144005] - I8[r32(144641) + 3];
  }
}

export async function DrawCursorCell(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let relX: number = 0, relY: number = 0, i: number = 0;
  if ((U8[237839] !== 0)) {
    U8[237845] = false ? 1 : 0;
    (await EraseSpellPreview());
  }
  relX = (x - I8[r32(144641) + 2]) << 24 >> 24;
  relY = (y - I8[r32(144641) + 3]) << 24 >> 24;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if (Pathing.GetIconTileDelta(U8[r32(144641) + 5], i, $f0, $f0 + 1)) {
      if (ViewCoordsValid(relX + I8[$f0], relY + I8[$f0 + 1])) {
        (await MapTiles.DrawTerrain((relX + I8[$f0]) * 3, (relY + I8[$f0 + 1]) * 3, U8[r32(144641) + (y + I8[$f0 + 1]) * 50 + (x + I8[$f0]) + 7]));
        if ((U8[r32(144641) + 4] !== 0)) {
          (await MapTiles.DrawIconAnimSprite(relX + I8[$f0], relY + I8[$f0 + 1], 0, 0, 25));
        }
      }
    }
  }
  (await DrawCellCreature(x, y));
  if ((U8[237839] !== 0) && (U8[r32(144641) + 4] !== 0)) {
    (await RestartSpellPreview(x, y));
  }
  S.sp = $sp;
}

export function $init() {
  U8[237839] = false ? 1 : 0;
  U8[237844] = false ? 1 : 0;
  U8[237845] = false ? 1 : 0;
  rt.fill(226881, 72, 0);
  rt.fill(226953, 72, 0);
  SetLayout(false);
}
