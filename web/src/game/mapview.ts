// Generated from src/mapview.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Wilds from './wilds';
import * as View3D from './view3d';
import * as Blit from './blit';
import * as MapTiles from './maptiles';
import * as JrnlSeen from './jrnlseen';


export const $at = { wildAnimFrame: 240449 };

export async function DisplayMapView() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let loc: number = 0;
  function CeilColor(w: number) {
    let $r1: number = 0;
    if (w === 8 || w === 65) {
      $r1 = 0;
    } else {
      $r1 = 15;
    }
    return $r1;
  }
  function FloorColor(w: number) {
    let $r1: number = 0;
    if (w === 8) {
      $r1 = 8;
    } else {
      $r1 = 7;
    }
    return $r1;
  }
  function WallColor(w: number) {
    let $r1: number = 0;
    switch (w) {
      case 11: {
        $r1 = 8;
        break;
      }
      case 6: {
        $r1 = 1;
        break;
      }
      default: {
        $r1 = 6;
      }
    }
    return $r1;
  }
  loc = U8[141223];
  if (r16(r32(141147) + 460) !== 0) {
    loc = 1;
  }
  switch (loc) {
    case 1: {
      U8[145550] = View3D.GetMapEvent(I8[145546], I8[145547]);
      if (U8[145550] > 127) {
        U8[238101] = U8[(r16(r32(141147) + 508) & 7) + 240450];
      } else {
        U8[238101] = U8[(r16(r32(141147) + 506) & 7) + 240450];
      }
      if ((U8[146750] !== 0)) {
        U8[238102] = CeilColor(U8[146538]);
        U8[238103] = FloorColor(U8[146538]);
        U8[238104] = WallColor(U8[146537]);
      }
      View3D.SetView3DColors(U8[238101], U8[238102], U8[238103], U8[238104]);
      if (!JrnlSeen.AreaMapAllowed()) {
        U8[145545] = false ? 1 : 0;
      }
      (await View3D.Display3DMapView(I8[145546], I8[145547], U8[145548]));
      break;
    }
    case 2: case 3: case 4: {
      PartyCell(loc, $f0, $f0 + 2);
      (await Wilds.BuildWildernessMap(Wilds.CenteredCorner(ri16($f0), 43, Wilds.ViewLast()), Wilds.CenteredCorner(ri16($f0 + 2), 35, 4), Wilds.ViewLast()));
      (await DisplayWildMapView());
      break;
    }
  }
  S.sp = $sp;
}

export async function DisplayWildMapView() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $t1;
  if (!($t1 = U8[141223], ($t1 >= 2 && $t1 <= 4))) {
    { S.sp = $sp; return; }
  }
  PartyCell(U8[141223], $f0, $f0 + 2);
  (await MapTiles.DrawIconAnimSprite(ri16($f0) - Wilds.CenteredCorner(ri16($f0), 43, Wilds.ViewLast()), ri16($f0 + 2) - Wilds.CenteredCorner(ri16($f0 + 2), 35, 4), U8[145548], U8[240449] % 2, Math.trunc(U8[240449] / 2) + 9));
  U8[240449] = (U8[240449] + 1) % 6;
  (await Blit.FlushView());
  S.sp = $sp;
}

export function ResetGame() {
  U8[240449] = 0;
}

export function PartyCell(loc: number, col: number, row: number) {
  w16(col, U8[loc + 140166] + (r16(r32(141147) + 390) << 16 >> 16));
  w16(row, r16(r32(141147) + 392) << 16 >> 16);
}
