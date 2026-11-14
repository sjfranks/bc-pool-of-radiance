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


export const $at = { wildAnimFrame: 248641 };

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
  loc = U8[227109];
  if (r16(r32(227033) + 460) !== 0) {
    loc = 1;
  }
  switch (loc) {
    case 1: {
      U8[231436] = View3D.GetMapEvent(I8[231432], I8[231433]);
      if (U8[231436] > 127) {
        U8[246293] = U8[(r16(r32(227033) + 508) & 7) + 248642];
      } else {
        U8[246293] = U8[(r16(r32(227033) + 506) & 7) + 248642];
      }
      if ((U8[232636] !== 0)) {
        U8[246294] = CeilColor(U8[232424]);
        U8[246295] = FloorColor(U8[232424]);
        U8[246296] = WallColor(U8[232423]);
      }
      View3D.SetView3DColors(U8[246293], U8[246294], U8[246295], U8[246296]);
      if (!JrnlSeen.AreaMapAllowed()) {
        U8[231431] = false ? 1 : 0;
      }
      (await View3D.Display3DMapView(I8[231432], I8[231433], U8[231434]));
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
  if (!($t1 = U8[227109], ($t1 >= 2 && $t1 <= 4))) {
    { S.sp = $sp; return; }
  }
  PartyCell(U8[227109], $f0, $f0 + 2);
  (await MapTiles.DrawIconAnimSprite(ri16($f0) - Wilds.CenteredCorner(ri16($f0), 43, Wilds.ViewLast()), ri16($f0 + 2) - Wilds.CenteredCorner(ri16($f0 + 2), 35, 4), U8[231434], U8[248641] % 2, Math.trunc(U8[248641] / 2) + 9));
  U8[248641] = (U8[248641] + 1) % 6;
  Blit.FlushView();
  S.sp = $sp;
}

export function ResetGame() {
  U8[248641] = 0;
}

export function PartyCell(loc: number, col: number, row: number) {
  w16(col, U8[loc + 226052] + (r16(r32(227033) + 390) << 16 >> 16));
  w16(row, r16(r32(227033) + 392) << 16 >> 16);
}
