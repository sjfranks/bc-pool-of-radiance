// Generated from src/wideview.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_AREA from './c_area';
import * as GameVars from './gamevars';
import * as Blit from './blit';


export async function Enter(rows: number, cells: number) {
  let fits: boolean = false, $r0: boolean = false;
  Blit.FreePic(227135);
  fits = 16777216 >= (((Blit.FrameBytes(rows, cells) | 0) + 32028) - 32001);
  if (fits) {
    (await Blit.AllocPic(rows, cells, 1, 0, 227135));
  } else {
    (await Blit.AllocPic(168, 21, 1, 0, 227135));
  }
  Blit.ClearSpans();
  $r0 = fits;
  return $r0;
}

export async function Leave() {
  Blit.FreePic(227135);
  (await Blit.AllocPic(168, 21, 1, 0, 227135));
  Blit.ClearSpans();
}
