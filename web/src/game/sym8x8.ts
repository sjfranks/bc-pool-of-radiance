// Generated from src/sym8x8.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Blit from './blit';
import * as GameIo from './gameio';
import * as StrUtil from './strutil';


export async function Load8x8Set(fileID: number, setId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  if ((setId >= 0 && setId <= 4)) {
    wS($f0, 1, rt.fmtI(U8[143234], 0));
    (await Blit.LoadPic("8x8d" + rS($f0), fileID, true, 13, setId * 4 + 143771));
    if (r32(setId * 4 + 143771) === 0) {
      (await GameIo.FatalError("Unable to load 8x8D" + rS($f0) + "-" + StrUtil.NumStr(fileID)));
    }
  }
  S.sp = $sp;
}

export async function Put8x8Sym(col: number, row: number, symbol: number, inCombat: boolean, other: boolean) {
  let setIdx: number = 0;
  const $c1 = symbol;
  if (($c1 >= 1 && $c1 <= 45)) {
    setIdx = 0;
  } else if (($c1 >= 46 && $c1 <= 115)) {
    setIdx = 1;
  } else if (($c1 >= 116 && $c1 <= 185)) {
    setIdx = 2;
  } else if (($c1 >= 186 && $c1 <= 255)) {
    setIdx = 3;
  } else if (($c1 >= 256 && $c1 <= 286)) {
    setIdx = 4;
  } else if ($c1 === 0 || ($c1 >= 287 && $c1 <= 65535)) {
    (await GameIo.FatalError("Bad symbol number in Put8x8Symbol."));
  }
  if (r32(setIdx * 4 + 143771) !== 0) {
    symbol = (symbol - r16(setIdx * 2 + 132917)) & 65535;
    {
      const $w2 = r32(setIdx * 4 + 143771);
      if (((r16($w2) !== 8) || (r16($w2 + 2) !== 1)) || (symbol >= U8[$w2 + 8])) {
        return;
      }
    }
    if (inCombat) {
      Blit.BlitTileCell(col, row, symbol, (other ? 1 : 0), r32(setIdx * 4 + 143771), r32(141249));
    } else {
      {
        const $w3 = r32(setIdx * 4 + 143771);
        mv(r32(143791) + 27, $w3 + (symbol * r16($w3 + 17)) + 27, r16($w3 + 17));
      }
      (await Blit.ShowPic(col, row, r32(143791)));
    }
  }
}
