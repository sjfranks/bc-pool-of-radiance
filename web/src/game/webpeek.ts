// Generated from pas/webpeek.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as CbtMap from './cbtmap';
import * as CharHlp from './charhlp';


export function ViewX() {
  let $r0: number = 0;
  if (r32(230527) === 0) {
    $r0 = -1;
  } else {
    $r0 = I8[r32(230527) + 2];
  }
  return $r0;
}

export function ViewY() {
  let $r0: number = 0;
  if (r32(230527) === 0) {
    $r0 = -1;
  } else {
    $r0 = I8[r32(230527) + 3];
  }
  return $r0;
}

export function ActorX() {
  let $r0: number = 0;
  if ((r32(229635) === 0) || (CbtMap.CombatSlot(r32(229635)) === 0)) {
    $r0 = -1;
  } else {
    $r0 = CbtMap.CombatCellX(r32(229635)) << 16 >> 16;
  }
  return $r0;
}

export function ActorY() {
  let $r0: number = 0;
  if ((r32(229635) === 0) || (CbtMap.CombatSlot(r32(229635)) === 0)) {
    $r0 = -1;
  } else {
    $r0 = CbtMap.CombatCellY(r32(229635)) << 16 >> 16;
  }
  return $r0;
}

export function CellKind(x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let $r0: number = 0;
  $r0 = 1;
  if ((r32(230527) === 0) || (r32(229635) === 0)) {
    { S.sp = $sp; return $r0; }
  }
  if ((((x < 0) || (y < 0)) || (x > 49)) || (y > 24)) {
    { S.sp = $sp; return $r0; }
  }
  CbtMap.GetArenaContents(x, y, $f0, $f0 + 1);
  if ((U8[$f0] > 0) && (r32(U8[$f0] * 4 + 230178) !== 0)) {
    if (r32(U8[$f0] * 4 + 230178) === r32(229635)) {
      $r0 = 0;
    } else if (CharHlp.EnemyTeam(r32(U8[$f0] * 4 + 230178)) === CharHlp.Team(r32(229635))) {
      $r0 = 3;
    } else {
      $r0 = 2;
    }
  } else if (U8[U8[$f0 + 1] * 3 + 218828] === 255) {
    $r0 = 1;
  } else {
    $r0 = 0;
  }
  S.sp = $sp;
  return $r0;
}
