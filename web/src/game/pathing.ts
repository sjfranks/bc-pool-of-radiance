// Generated from src/pathing.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_DIR from './c_dir';

export const WALL_COST = 255;
export const UNREACHED = 255;
export const START = 8;

export const $at = { TURNS: 227072 };

export function SignOf(v: number) {
  let $r0: number = 0;
  if (v < 0) {
    $r0 = -1;
  } else if (v > 0) {
    $r0 = 1;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function OnArena(x: number, y: number) {
  let $r0: boolean = false;
  $r0 = (((x >= 0) && (x <= 49)) && (y >= 0)) && (y <= 24);
  return $r0;
}

export function LastSlot() {
  let $r0: number = 0;
  if (U8[144007] > 72) {
    $r0 = 72;
  } else {
    $r0 = U8[144007];
  }
  return $r0;
}

export function SaveTargets(snap: number) {
  mv(snap, 144646, 216);
  U8[snap + 216] = U8[144645];
}

export function RestoreTargets(snap: number) {
  mv(144646, snap, 216);
  U8[144645] = U8[snap + 216];
}

export function PathFind(req: number) {
  {
    const $w1 = req;
    U8[$w1 + 24] = 0;
    w16($w1 + 10, Math.abs(ri16($w1 + 4) - ri16($w1)));
    w16($w1 + 12, Math.abs(ri16($w1 + 6) - ri16($w1 + 2)));
    U8[$w1 + 18] = SignOf(ri16($w1 + 4) - ri16($w1));
    U8[$w1 + 19] = SignOf(ri16($w1 + 6) - ri16($w1 + 2));
    w16($w1 + 20, ri16($w1));
    w16($w1 + 22, ri16($w1 + 2));
    if (ri16($w1 + 10) > ri16($w1 + 12)) {
      w16($w1 + 8, (ri16($w1 + 12) * 2) - ri16($w1 + 10));
      w16($w1 + 14, (ri16($w1 + 12) - ri16($w1 + 10)) * 2);
      w16($w1 + 16, ri16($w1 + 12) * 2);
    } else {
      w16($w1 + 8, (ri16($w1 + 10) * 2) - ri16($w1 + 12));
      w16($w1 + 14, (ri16($w1 + 10) - ri16($w1 + 12)) * 2);
      w16($w1 + 16, ri16($w1 + 10) * 2);
    }
  }
}

export function NextPathStep(req: number) {
  let dx8: number = 0, dy8: number = 0, $r0: boolean = false;
  dx8 = 0;
  dy8 = 0;
  $r0 = false;
  {
    const $w1 = req;
    if (ri16($w1 + 10) > ri16($w1 + 12)) {
      if (ri16($w1 + 20) !== ri16($w1 + 4)) {
        dx8 = I8[$w1 + 18];
        if (ri16($w1 + 8) >= 0) {
          dy8 = I8[$w1 + 19];
          w16($w1 + 22, ri16($w1 + 22) + I8[$w1 + 19]);
          w16($w1 + 8, ri16($w1 + 8) + ri16($w1 + 14));
          U8[$w1 + 24] = U8[$w1 + 24] + 3;
        } else {
          w16($w1 + 8, ri16($w1 + 8) + ri16($w1 + 16));
          U8[$w1 + 24] = U8[$w1 + 24] + 2;
        }
        w16($w1 + 20, ri16($w1 + 20) + I8[$w1 + 18]);
        $r0 = true;
      }
    } else {
      if (ri16($w1 + 22) !== ri16($w1 + 6)) {
        dy8 = I8[$w1 + 19];
        if (ri16($w1 + 8) >= 0) {
          dx8 = I8[$w1 + 18];
          w16($w1 + 20, ri16($w1 + 20) + I8[$w1 + 18]);
          w16($w1 + 8, ri16($w1 + 8) + ri16($w1 + 14));
          U8[$w1 + 24] = U8[$w1 + 24] + 3;
        } else {
          w16($w1 + 8, ri16($w1 + 8) + ri16($w1 + 16));
          U8[$w1 + 24] = U8[$w1 + 24] + 2;
        }
        w16($w1 + 22, ri16($w1 + 22) + I8[$w1 + 19]);
        $r0 = true;
      }
    }
    U8[$w1 + 25] = U8[(dy8 + 1) * 3 + (dx8 + 1) + 227031];
  }
  return $r0;
}

export function IsDirToward(x: number, y: number, tx: number, ty: number, dir: number) {
  let nx: number = 0, ny: number = 0, $r0: boolean = false;
  if (!OnArena(x, y) || !OnArena(tx, ty)) {
    $r0 = false;
    return $r0;
  }
  if (dir > 8) {
    dir = 8;
  }
  nx = (x + I8[dir + 132927]) << 24 >> 24;
  ny = (y + I8[dir + 132936]) << 24 >> 24;
  if (((x === tx) && (y === ty)) || ((nx === tx) && (ny === ty))) {
    $r0 = true;
    return $r0;
  }
  switch (dir) {
    case 0: {
      $r0 = ((tx >= nx) && (ty <= ((nx - tx) + ny))) || ((tx <= nx) && (ty <= ((tx - nx) + ny)));
      break;
    }
    case 1: {
      $r0 = ((tx >= nx) && (ty <= ((nx - tx) + ny))) || ((tx >= ((nx + ny) - ty)) && (ty <= ny));
      break;
    }
    case 2: {
      $r0 = ((tx >= ((nx + ny) - ty)) && (ty <= ny)) || ((tx >= ((nx + ty) - ny)) && (ty >= ny));
      break;
    }
    case 3: {
      $r0 = ((tx >= ((nx + ty) - ny)) && (ty >= ny)) || ((tx >= nx) && (ty >= ((tx - nx) + ny)));
      break;
    }
    case 4: {
      $r0 = ((tx >= nx) && (ty >= ((tx - nx) + ny))) || ((tx <= nx) && (ty >= ((nx - tx) + ny)));
      break;
    }
    case 5: {
      $r0 = ((tx <= nx) && (ty >= ((nx - tx) + ny))) || ((tx <= ((nx + ny) - ty)) && (ty >= ny));
      break;
    }
    case 6: {
      $r0 = ((tx <= ((nx + ny) - ty)) && (ty >= ny)) || ((tx <= ((nx + ty) - ny)) && (ty <= ny));
      break;
    }
    case 7: {
      $r0 = ((tx <= ((nx + ty) - ny)) && (ty <= ny)) || ((tx <= nx) && (ty <= ((tx - nx) + ny)));
      break;
    }
    case 8: {
      $r0 = true;
      break;
    }
  }
  return $r0;
}

export function DirToward(x: number, y: number, tx: number, ty: number) {
  let d: number = 0, $r0: number = 0;
  d = 0;
  while ((d < 8) && !IsDirToward(x, y, tx, ty, d)) {
    d = (d + 1) & 255;
  }
  $r0 = d;
  return $r0;
}

export function WalkLine(x: number, y: number, tx: number, ty: number, dist: number, view: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 26);
  let done: boolean = false, maxDist: number = 0, $r0: boolean = false;
  if (!OnArena(x, y) || !OnArena(I8[tx], I8[ty])) {
    w16(dist, 0);
    $r0 = false;
    { S.sp = $sp; return $r0; }
  }
  maxDist = ((r16(dist) * 2) + 1) & 65535;
  w16($f0, x);
  w16($f0 + 2, y);
  w16($f0 + 4, I8[tx]);
  w16($f0 + 6, I8[ty]);
  PathFind($f0);
  done = false;
  do {
    if (((U8[view + 6] === 0) && (U8[U8[view + ri16($f0 + 22) * 50 + ri16($f0 + 20) + 7] * 3 + 132943] > 0)) || (U8[$f0 + 24] > maxDist)) {
      U8[tx] = ri16($f0 + 20);
      U8[ty] = ri16($f0 + 22);
      w16(dist, U8[$f0 + 24]);
      $r0 = false;
      { S.sp = $sp; return $r0; }
    }
    done = !NextPathStep($f0);
  } while (!(done));
  w16(dist, U8[$f0 + 24]);
  $r0 = true;
  S.sp = $sp;
  return $r0;
}

export function BuildTargetList(x: number, y: number, range: number, filter: number, size: number, view: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 22);
  let i: number = 0, bestDir: number = 0, k: number = 0, j: number = 0, bestK: number = 0, bestJ: number = 0, found: boolean = false, bestDist: number = 0, last: number = 0;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    k = $i1;
    if (GetIconTileDelta(size, k, $f0 + 2, $f0 + 3)) {
      U8[$f0 + k + 4] = x + I8[$f0 + 2];
      U8[$f0 + k + 8] = y + I8[$f0 + 3];
    } else {
      U8[$f0 + k + 4] = -1;
    }
  }
  U8[144645] = 0;
  last = LastSlot() & 255;
  for (let $i2 = 1, $e2 = last; $i2 <= $e2; $i2++) {
    i = $i2;
    if (U8[i * 4 + 144007] > 0) {
      found = false;
      bestDist = 0;
      bestK = 0;
      bestJ = 0;
      for (let $i3 = 0; $i3 <= 3; $i3++) {
        j = $i3;
        if (GetIconTileDelta(U8[i * 4 + 144007], j, $f0 + 2, $f0 + 3)) {
          U8[$f0 + j + 12] = I8[i * 4 + 144004] + I8[$f0 + 2];
          U8[$f0 + j + 16] = I8[i * 4 + 144005] + I8[$f0 + 3];
        } else {
          U8[$f0 + j + 12] = -1;
        }
      }
      for (let $i4 = 0; $i4 <= 3; $i4++) {
        j = $i4;
        if (I8[$f0 + j + 12] >= 0) {
          for (let $i5 = 0; $i5 <= 3; $i5++) {
            k = $i5;
            if (I8[$f0 + k + 4] >= 0) {
              if (IsDirToward(I8[$f0 + k + 4], I8[$f0 + k + 8], I8[$f0 + j + 12], I8[$f0 + j + 16], filter)) {
                U8[$f0] = I8[$f0 + j + 12];
                U8[$f0 + 1] = I8[$f0 + j + 16];
                w16($f0 + 20, range);
                if (WalkLine(I8[$f0 + k + 4], I8[$f0 + k + 8], $f0, $f0 + 1, $f0 + 20, view)) {
                  if (!found || (r16($f0 + 20) < bestDist)) {
                    found = true;
                    bestDist = r16($f0 + 20);
                    bestK = k;
                    bestJ = j;
                  }
                }
              }
            }
          }
        }
      }
      if (found) {
        U8[144645] = U8[144645] + 1;
        U8[U8[144645] * 3 + 144643] = i;
        U8[U8[144645] * 3 + 144644] = bestDist;
        bestDir = 0;
        if (filter < 8) {
          bestDir = filter;
        } else {
          while (!IsDirToward(I8[$f0 + bestK + 4], I8[$f0 + bestK + 8], I8[$f0 + bestJ + 12], I8[$f0 + bestJ + 16], bestDir)) {
            bestDir = (bestDir + 1) & 255;
          }
        }
        U8[U8[144645] * 3 + 144645] = bestDir;
      }
    }
  }
  SortTargets();
  S.sp = $sp;
}

export function GetIconTileDelta(size: number, idx: number, dx: number, dy: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((size === 0) || (size > 4)) {
    return $r0;
  }
  U8[dx] = I8[size * 8 + idx * 2 + 227032];
  U8[dy] = I8[size * 8 + idx * 2 + 227033];
  if (I8[dx] >= 0) {
    $r0 = true;
  }
  return $r0;
}

export function BuildAreaList(x: number, y: number, radius: number) {
  BuildTargetList(x, y, radius, 255, 1, r32(144641));
}

export function TargetArea(x: number, y: number, radius: number) {
  let k: number = 0;
  BuildAreaList(x, y, radius);
  for (let $i1 = 1, $e1 = U8[144645]; $i1 <= $e1; $i1++) {
    k = $i1;
    w32(k * 4 + 146157, r32(U8[k * 3 + 144643] * 4 + 144292));
  }
  U8[146160] = U8[144645];
}

export async function RouteStep(slot: number, goals: Uint8Array, open: Uint8Array, avoid: Uint8Array, occupant: number, dir: number, goal: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let marks: number = 0, near: number = 0, queue: number = 0, head: number = 0, tail: number = 0, sx: number = 0, sy: number = 0, x: number = 0, y: number = 0, nx: number = 0, ny: number = 0, size: number = 0, d: number = 0, k: number = 0, first: number = 0, reached: number = 0, $r0: boolean = false;
  $r0 = false;
  sx = I8[slot * 4 + 144004];
  sy = I8[slot * 4 + 144005];
  size = U8[slot * 4 + 144007];
  if (size === 0) {
    { S.sp = $sp; return $r0; }
  }
  near = rt.getMem(1250);
  MarkGoals(goals, sx, sy, near, $f0);
  if (Reaches(sx, sy, size, near) === 0) {
    marks = rt.getMem(1250);
    queue = rt.getMem(2500);
    rt.fill(marks, 1250, 255);
    U8[marks + sy * 50 + sx] = 8;
    w16(queue, sx + (50 * sy));
    head = 0;
    tail = 1;
    reached = 0;
    while ((head < tail) && (reached === 0)) {
      x = r16(queue + head * 2) % 50;
      y = Math.trunc(r16(queue + head * 2) / 50) << 24 >> 24;
      head = (head + 1) & 65535;
      k = 0;
      while ((k <= 7) && (reached === 0)) {
        d = (U8[$f0] + U8[k + 227072]) % 8;
        nx = (x + I8[d + 132927]) << 24 >> 24;
        ny = (y + I8[d + 132936]) << 24 >> 24;
        if (OnArena(nx, ny)) {
          if ((U8[marks + ny * 50 + nx] === 255) && (await CanStand(nx, ny, size, slot, open, avoid, occupant))) {
            first = U8[marks + y * 50 + x];
            if (first === 8) {
              first = d;
            }
            U8[marks + ny * 50 + nx] = first;
            reached = Reaches(nx, ny, size, near) & 255;
            if (reached !== 0) {
              U8[dir] = first;
              U8[goal] = reached;
              $r0 = true;
            } else {
              w16(queue + tail * 2, nx + (50 * ny));
              tail = (tail + 1) & 65535;
            }
          }
        }
        k = (k + 1) & 255;
      }
    }
    rt.freeMem(queue);
    rt.freeMem(marks);
  }
  rt.freeMem(near);
  S.sp = $sp;
  return $r0;
}

export function SortTargets() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let i: number = 0, j: number = 0, auxJ: number = 0, auxI: number = 0;
  if (U8[144645] <= 1) {
    { S.sp = $sp; return; }
  }
  for (let $i1 = 1, $e1 = U8[144645] - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    for (let $i2 = i + 1, $e2 = U8[144645]; $i2 <= $e2; $i2++) {
      j = $i2;
      auxI = U8[i * 3 + 144645];
      auxJ = U8[j * 3 + 144645];
      if ((U8[j * 3 + 144644] < U8[i * 3 + 144644]) || (((U8[j * 3 + 144644] === U8[i * 3 + 144644]) && (auxJ < auxI)) && ((auxJ % 2) <= (auxI % 2)))) {
        mv($f0, i * 3 + 144643, 3);
        mv(i * 3 + 144643, j * 3 + 144643, 3);
        mv(j * 3 + 144643, $f0, 3);
      }
    }
  }
  S.sp = $sp;
}

export async function CanStand(x: number, y: number, size: number, slot: number, open: Uint8Array, avoid: Uint8Array, occupant: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let i: number = 0, cx: number = 0, cy: number = 0, t: number = 0, c: number = 0, $r0: boolean = false;
  $r0 = false;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if (GetIconTileDelta(size, i, $f0, $f0 + 1)) {
      cx = (x + I8[$f0]) << 24 >> 24;
      cy = (y + I8[$f0 + 1]) << 24 >> 24;
      if (!OnArena(cx, cy)) {
        { S.sp = $sp; return $r0; }
      }
      t = U8[r32(144641) + cy * 50 + cx + 7];
      if (((t === 0) || rt.inS(avoid, t)) || (U8[t * 3 + 132942] === 255)) {
        { S.sp = $sp; return $r0; }
      }
      c = (await rt.FT[occupant](cx, cy)) & 255;
      if (((c !== 0) && (c !== slot)) && !rt.inS(open, c)) {
        { S.sp = $sp; return $r0; }
      }
    }
  }
  $r0 = true;
  S.sp = $sp;
  return $r0;
}

export function Reaches(x: number, y: number, size: number, near: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let i: number = 0, $r0: number = 0;
  $r0 = 0;
  for (let $i1 = 0; $i1 <= 3; $i1++) {
    i = $i1;
    if (GetIconTileDelta(size, i, $f0, $f0 + 1)) {
      if (U8[near + (y + I8[$f0 + 1]) * 50 + (x + I8[$f0])] !== 0) {
        $r0 = U8[near + (y + I8[$f0 + 1]) * 50 + (x + I8[$f0])];
        { S.sp = $sp; return $r0; }
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function MarkGoals(goals: Uint8Array, sx: number, sy: number, near: number, heading: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let s: number = 0, i: number = 0, x: number = 0, y: number = 0, d: number = 0, span: number = 0, best: number = 0, tx: number = 0, ty: number = 0;
  rt.fill(near, 1250, 0);
  best = 32767;
  tx = sx;
  ty = sy;
  for (let $i1 = 1; $i1 <= 72; $i1++) {
    s = $i1;
    if (rt.inS(goals, s) && (U8[s * 4 + 144007] !== 0)) {
      for (let $i2 = 0; $i2 <= 3; $i2++) {
        i = $i2;
        if (GetIconTileDelta(U8[s * 4 + 144007], i, $f0, $f0 + 1)) {
          for (let $i3 = (I8[s * 4 + 144005] + I8[$f0 + 1]) - 1, $e3 = (I8[s * 4 + 144005] + I8[$f0 + 1]) + 1; $i3 <= $e3; $i3++) {
            y = $i3;
            for (let $i4 = (I8[s * 4 + 144004] + I8[$f0]) - 1, $e4 = (I8[s * 4 + 144004] + I8[$f0]) + 1; $i4 <= $e4; $i4++) {
              x = $i4;
              if (OnArena(x, y)) {
                if (U8[near + y * 50 + x] === 0) {
                  U8[near + y * 50 + x] = s;
                }
              }
            }
          }
        }
      }
      span = Math.abs(I8[s * 4 + 144004] - sx) << 16 >> 16;
      if (Math.abs(I8[s * 4 + 144005] - sy) > span) {
        span = Math.abs(I8[s * 4 + 144005] - sy) << 16 >> 16;
      }
      if (span < best) {
        best = span;
        tx = I8[s * 4 + 144004];
        ty = I8[s * 4 + 144005];
      }
    }
  }
  U8[heading] = 0;
  for (let $i5 = 0; $i5 <= 7; $i5++) {
    d = $i5;
    if ((I8[d + 132927] === SignOf(tx - sx)) && (I8[d + 132936] === SignOf(ty - sy))) {
      U8[heading] = d;
    }
  }
  S.sp = $sp;
}
