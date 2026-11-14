// Generated from src/view3d.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as Sym8x8 from './sym8x8';
import * as C_DIR from './c_dir';
import * as DaxIo from './daxio';
import * as GameIo from './gameio';
import * as StrUtil from './strutil';
import * as Explored from './explored';


export const $at = { wallGfx: 246289, skyCeilingColor: 246293, ceilingBandColor: 246294, midBandColor: 246295, floorBandColor: 246296, viewSlotGeom: 248480 };

export function SetView3DColors(cSky: number, cHorz1: number, cHorz2: number, cFloor: number) {
  U8[246293] = cSky;
  U8[246294] = cHorz1;
  U8[246295] = cHorz2;
  U8[246296] = cFloor;
}

export function GetWallType(x: number, y: number, facing: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  U8[$f0] = x;
  U8[$f0 + 1] = y;
  let $r0: number = 0;
  $r0 = 0;
  if (MapSquare($f0, $f0 + 1)) {
    switch (facing) {
      case 0: {
        $r0 = (U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0]] & 240) >>> 4;
        break;
      }
      case 2: {
        $r0 = U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0]] & 15;
        break;
      }
      case 4: {
        $r0 = (U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 256] & 240) >>> 4;
        break;
      }
      case 6: {
        $r0 = U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 256] & 15;
        break;
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function GetBarrierType(x: number, y: number, facing: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  U8[$f0] = x;
  U8[$f0 + 1] = y;
  let b: number = 0, $r0: number = 0;
  if (!MapSquare($f0, $f0 + 1)) {
    $r0 = 0;
  } else {
    b = 1;
    if (GetWallType(I8[$f0], I8[$f0 + 1], facing) > 0) {
      switch (facing) {
        case 6: {
          b = (U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 768] & 192) >>> 6;
          break;
        }
        case 4: {
          b = (U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 768] & 48) >>> 4;
          break;
        }
        case 2: {
          b = (U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 768] & 12) >>> 2;
          break;
        }
        case 0: {
          b = U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 768] & 3;
          break;
        }
      }
    }
    $r0 = b;
  }
  S.sp = $sp;
  return $r0;
}

export function GetMapEvent(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  U8[$f0] = x;
  U8[$f0 + 1] = y;
  let $r0: number = 0;
  if (MapSquare($f0, $f0 + 1)) {
    $r0 = U8[r32(231427) + I8[$f0 + 1] * 16 + I8[$f0] + 512];
  } else {
    $r0 = 0;
  }
  S.sp = $sp;
  return $r0;
}

export async function Display3DMapView(x: number, y: number, facing: number) {
  let fL: number = 0, fR: number = 0, fB: number = 0, cxPos: number = 0, cyPos: number = 0, dxF: number = 0, dyF: number = 0, dist: number = 0;
  async function FarFronts(walk: number, other: number, corner: number, step: number) {
    let wx: number = 0, wy: number = 0, side: number = 0, symOfs: number = 0, wallFront: number = 0, prevWall: number = 0;
    wx = cxPos;
    wy = cyPos;
    side = 0;
    symOfs = 0;
    prevWall = 0;
    while (side < 4) {
      wallFront = GetWallType(wx, wy, facing) & 255;
      if (!Types.OnMap(wx, wy) && (GetWallType(wx, wy, other) === 0)) {
        prevWall = 0;
      }
      if (wallFront !== 0) {
        if (prevWall > 0) {
          (await DrawWallSlice((ri16(248528) + symOfs) + corner, ri16(248548), prevWall, 9));
        }
        prevWall = wallFront;
        (await DrawWallSlice(ri16(248510) + symOfs, ri16(248530), wallFront, 0));
      } else {
        if ((prevWall > 0) && (GetWallType(wx - I8[walk + 218813], wy - I8[walk + 218822], walk) !== 0)) {
          (await DrawWallSlice((ri16(248528) + symOfs) + corner, ri16(248548), prevWall, 9));
        }
        prevWall = 0;
      }
      side = (side + 1) & 255;
      symOfs = (symOfs + step) << 16 >> 16;
      wx = (wx + I8[walk + 218813]) << 16 >> 16;
      wy = (wy + I8[walk + 218822]) << 16 >> 16;
    }
  }
  async function FarSides(dir: number, slot: number, step: number, adjust: number) {
    let wx: number = 0, wy: number = 0, side: number = 0, symOfs: number = 0, wallSide: number = 0;
    wx = cxPos;
    wy = cyPos;
    side = 0;
    symOfs = 0;
    while (side < 3) {
      wallSide = GetWallType(wx, wy, dir) & 255;
      if (wallSide !== 0) {
        if (side === 0) {
          (await DrawWallSlice(ri16(slot * 2 + 248510) + symOfs, ri16(slot * 2 + 248530), wallSide, slot));
        } else {
          (await DrawWallSlice((ri16(slot * 2 + 248510) + symOfs) + adjust, ri16(slot * 2 + 248530), wallSide, slot));
        }
      }
      side = (side + 1) & 255;
      symOfs = (symOfs + step) << 16 >> 16;
      wx = (wx + I8[dir + 218813]) << 16 >> 16;
      wy = (wy + I8[dir + 218822]) << 16 >> 16;
    }
  }
  async function FrontsAndSides(start: number, cells: number, count: number, symStart: number, symStep: number, frontSlot: number, sideDir: number, sideSlot: number, scan: number) {
    let wx: number = 0, wy: number = 0, side: number = 0, symOfs: number = 0, wallFront: number = 0, wallSide: number = 0;
    wx = cxPos;
    wy = cyPos;
    for (let $i3 = 1, $e3 = cells; $i3 <= $e3; $i3++) {
      side = $i3;
      wx = (wx + I8[start + 218813]) << 16 >> 16;
      wy = (wy + I8[start + 218822]) << 16 >> 16;
    }
    side = 0;
    symOfs = symStart;
    while (side < count) {
      wallFront = GetWallType(wx, wy, facing) & 255;
      if (wallFront !== 0) {
        (await DrawWallSlice(ri16(frontSlot * 2 + 248510) + symOfs, ri16(frontSlot * 2 + 248530), wallFront, frontSlot));
      }
      wallSide = GetWallType(wx, wy, sideDir) & 255;
      if (wallSide !== 0) {
        (await DrawWallSlice(ri16(sideSlot * 2 + 248510) + symOfs, ri16(sideSlot * 2 + 248530), wallSide, sideSlot));
      }
      side = (side + 1) & 255;
      symOfs = (symOfs + symStep) << 16 >> 16;
      wx = (wx + I8[scan + 218813]) << 16 >> 16;
      wy = (wy + I8[scan + 218822]) << 16 >> 16;
    }
  }
  Explored.Mark(x, y);
  if ((U8[231431] !== 0)) {
    (await DrawAutoMap(x, y, facing));
  } else {
    DrawBackdrop();
    fL = (facing + 6) % 8;
    fB = (facing + 4) % 8;
    fR = (facing + 2) % 8;
    cxPos = x;
    cyPos = y;
    dxF = I8[facing + 218813];
    dyF = I8[facing + 218822];
    dist = 2;
    cxPos = (cxPos + (dist * dxF)) << 16 >> 16;
    cyPos = (cyPos + (dist * dyF)) << 16 >> 16;
    do {
      switch (dist) {
        case 2: {
          (await FarFronts(fL, fR, 1, -2));
          (await FarFronts(fR, fL, -1, 2));
          (await FarSides(fL, 1, -2, -1));
          (await FarSides(fR, 2, 2, 1));
          break;
        }
        case 1: {
          (await FrontsAndSides(fL, 2, 3, -6, 3, 3, fL, 4, fR));
          (await FrontsAndSides(fR, 2, 3, 6, -3, 3, fR, 5, fL));
          break;
        }
        case 0: {
          (await FrontsAndSides(fL, 1, 2, -7, 7, 6, fL, 7, fR));
          (await FrontsAndSides(fR, 1, 2, 7, -7, 6, fR, 8, fL));
          break;
        }
      }
      cxPos = (cxPos + I8[fB + 218813]) << 16 >> 16;
      cyPos = (cyPos + I8[fB + 218822]) << 16 >> 16;
      dist = (dist - 1) & 255;
    } while (!(dist === 255));
    DisplayViewBuf();
  }
}

export async function LoadWallSet(fileId: number, wsSlot: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let offset: number = 0, symOfs: number = 0, row: number = 0, i: number = 0, col: number = 0, count: number = 0, setFile: number = 0;
  if ((wsSlot < 1) || (wsSlot > 3)) {
    { S.sp = $sp; return; }
  }
  (await DaxIo.LoadDax("WALLDEF" + StrUtil.NumStr(U8[229120]), ".dax", fileId, $f0, $f0 + 2));
  if ((((r16($f0) === 0) || ((r16($f0) % 780) !== 0)) || ((Math.trunc(r16($f0) / 780) + wsSlot) > 4)) || ((r16($f0) > 780) && (fileId > 25))) {
    (await GameIo.FatalError("Unable to load wallset in LoadWallSet."));
  }
  symOfs = (r16(wsSlot * 2 + 218803) - r16(218805)) & 65535;
  offset = 0;
  i = 1;
  do {
    mv(r32(246289) + ((5 * ((wsSlot + i) - 2)) + 1) * 156 - 156, r32($f0 + 2) + offset, 780);
    offset = (offset + 780) & 65535;
    i = (i + 1) & 65535;
  } while (!(offset >= r16($f0)));
  rt.freeMem(r32($f0 + 2));
  count = (i - 1) & 255;
  for (let $i2 = 1, $e2 = count; $i2 <= $e2; $i2++) {
    i = $i2;
    let $t3;
    if (($t3 = (wsSlot + i) - 1, ($t3 >= 1 && $t3 <= 3))) {
      w16(((wsSlot + i) - 1) * 4 + 231433, -1);
      w16(((wsSlot + i) - 1) * 4 + 231435, -1);
      for (let $i4 = 1; $i4 <= 5; $i4++) {
        row = $i4;
        for (let $i5 = 0; $i5 <= 155; $i5++) {
          col = $i5;
          if (U8[r32(246289) + ((5 * ((wsSlot + i) - 2)) + row) * 156 + col - 156] >= r16(218805)) {
            let $t6;
            $t6 = r32(246289) + ((5 * ((wsSlot + i) - 2)) + row) * 156 + col - 156, U8[$t6] = U8[$t6] + symOfs;
          }
        }
      }
      if (count > 1) {
        if (fileId === 0) {
          setFile = 10;
        } else {
          setFile = fileId;
        }
        (await Sym8x8.Load8x8Set((setFile * 10) + i, (wsSlot + i) - 1));
      } else {
        (await Sym8x8.Load8x8Set(fileId, (wsSlot + i) - 1));
      }
    }
  }
  w16(wsSlot * 4 + 231433, fileId);
  w16(wsSlot * 4 + 231435, wsSlot);
  S.sp = $sp;
}

export async function Load3DMap(mapId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let offset: number = 0;
  (await DaxIo.LoadDax("GEO" + StrUtil.NumStr(U8[229120]), ".dax", mapId, $f0, $f0 + 2));
  if ((r16($f0) === 0) || (r16($f0) !== 1026)) {
    (await GameIo.FatalError("Unable to load geo in Load3DMap."));
  }
  offset = 2;
  mv(r32(231427), r32($f0 + 2) + offset, 256);
  offset = (offset + 256) & 65535;
  mv(r32(231427) + 256, r32($f0 + 2) + offset, 256);
  offset = (offset + 256) & 65535;
  mv(r32(231427) + 512, r32($f0 + 2) + offset, 256);
  offset = (offset + 256) & 65535;
  mv(r32(231427) + 768, r32($f0 + 2) + offset, 256);
  rt.freeMem(r32($f0 + 2));
  w16(r32(227033) + 394, mapId);
  S.sp = $sp;
}

export function WrapCoords(x: number, y: number) {
  U8[x] = I8[x] & 15;
  U8[y] = I8[y] & 15;
}

export function DisplayViewBuf() {
  Blit.FlushView();
}

export async function DrawAutoMap(x: number, y: number, facing: number) {
  let pwx: number = 0, pwy: number = 0, wx: number = 0, wy: number = 0, xLo: number = 0, yLo: number = 0, mx: number = 0, my: number = 0, sym: number = 0;
  xLo = (x - 5) << 24 >> 24;
  if (xLo < 0) {
    xLo = 0;
  }
  if (xLo > 5) {
    xLo = 5;
  }
  pwx = (x - xLo) << 24 >> 24;
  yLo = (y - 5) << 24 >> 24;
  if (yLo < 0) {
    yLo = 0;
  }
  if (yLo > 5) {
    yLo = 5;
  }
  pwy = (y - yLo) << 24 >> 24;
  for (let $i1 = 0; $i1 <= 10; $i1++) {
    wy = $i1;
    my = (wy + yLo) << 24 >> 24;
    for (let $i2 = 0; $i2 <= 10; $i2++) {
      wx = $i2;
      mx = (wx + xLo) << 24 >> 24;
      sym = 260;
      if (GetWallType(mx, my, 0) > 0) {
        sym = (sym + 1) & 65535;
      }
      if (GetWallType(mx, my, 2) > 0) {
        sym = (sym + 2) & 65535;
      }
      if (GetWallType(mx, my, 4) > 0) {
        sym = (sym + 4) & 65535;
      }
      if (GetWallType(mx, my, 6) > 0) {
        sym = (sym + 8) & 65535;
      }
      (await Sym8x8.Put8x8Sym((wx + 3) - 1, (wy + 3) - 1, sym, true, false));
    }
  }
  (await Sym8x8.Put8x8Sym((pwx + 3) - 1, (pwy + 3) - 1, Math.trunc(facing / 2) + 256, true, false));
  DisplayViewBuf();
}

export function DrawBackdrop() {
  Blit.FillPicRect(2, 16, 11, 43, U8[246293], 218731, r32(227135));
  Blit.FillPicRect(2, 59, 11, 1, U8[246294], 218731, r32(227135));
  Blit.FillPicRect(2, 60, 11, 2, U8[246295], 218731, r32(227135));
  Blit.FillPicRect(2, 62, 11, 42, U8[246296], 218731, r32(227135));
}

export async function DrawWallSlice(x: number, y: number, wallType: number, slot: number) {
  let colLim: number = 0, rowLim: number = 0, col: number = 0, row: number = 0, cnt: number = 0;
  cnt = U8[slot + 248480];
  colLim = (U8[slot + 248490] + x) - 1;
  rowLim = (U8[slot + 248500] + y) - 1;
  for (let $i1 = y, $e1 = rowLim; $i1 <= $e1; $i1++) {
    row = $i1;
    for (let $i2 = x, $e2 = colLim; $i2 <= $e2; $i2++) {
      col = $i2;
      if (((((row >= 0) && (row <= 10)) && (col >= 0)) && (col <= 10)) && (U8[r32(246289) + wallType * 156 + cnt - 156] > 0)) {
        (await Sym8x8.Put8x8Sym((col + 3) - 1, (row + 3) - 1, U8[r32(246289) + wallType * 156 + cnt - 156], true, true));
      }
      cnt = (cnt + 1) & 255;
    }
  }
}

export function MapSquare(x: number, y: number) {
  let $r0: boolean = false;
  $r0 = Types.OnMap(I8[x], I8[y]) || ((U8[232633] !== 0) && (U8[232633] !== 10));
  WrapCoords(x, y);
  return $r0;
}

export function $init() {
  w32(246289, 0);
  U8[246293] = 0;
  U8[246294] = 0;
  U8[246295] = 0;
  U8[246296] = 0;
}
