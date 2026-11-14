// Generated from src/spellinf.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_SPELL from './c_spell';
import * as C_ITEM from './c_item';
import * as Crt from './crt';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as C_KEYS from './c_keys';
import * as CharHlp from './charhlp';
import * as FxEngine from './fxengine';
import * as StrUtil from './strutil';
import * as TextRend from './textrend';
import * as Border from './border';
import * as MenuCore from './menucore';
import * as CharDisp from './chardisp';
import * as SpellTxt from './spelltxt';

export const SUMMARY_WIDTH = 38;
export const TEXT_LINES = 9;
export const TEXT_COLS = 36;
export const VALUE_COL = 15;
export const VALUE_WIDTH = 24;
export const CASTER_AREA = "THE CASTER";

export const $at = { saveResults: 255495, saveNames: 255623 };

export function SaveResult(spell: number) {
  let $r0: number = 0;
  if ((spell >= 1) && (spell <= 128)) {
    $r0 = U8[spell + 255494];
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function RangeText(line: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 43);
  let spell: number = 0, $r0: string = "";
  spell = UseLine(line, $f0) & 255;
  wS($f0 + 2, 40, "");
  {
    const $w1 = spell * 16 + 222392;
    if (spell === 31) {
      if (long) {
        wS($f0 + 2, 40, "TOUCH");
      }
    } else if (CampOnly(spell)) {
      if (U8[$w1 + 7] === 1) {
        wS($f0 + 2, 40, "SELF");
      } else if (long) {
        wS($f0 + 2, 40, "ANY OF THE PARTY");
      }
    } else if (CharHlp.SpellArea(spell, $f0 + 1) === 0) {
      if (U8[$w1 + 7] === 1) {
        wS($f0 + 2, 40, "SELF");
      } else if (long) {
        wS($f0 + 2, 40, "ANYWHERE");
      }
    } else if ((U8[$w1 + 2] === 255) || ((U8[$w1 + 2] + U8[$w1 + 3]) === 0)) {
      wS($f0 + 2, 40, "TOUCH");
    } else if (long) {
      wS($f0 + 2, 40, StrUtil.Count(CharHlp.CalcSpellRange(spell), "SQUARE", "SQUARES"));
    } else {
      wS($f0 + 2, 40, StrUtil.NumStr(CharHlp.CalcSpellRange(spell)));
    }
  }
  if ((rS($f0 + 2) !== "") && !long) {
    wS($f0 + 2, 40, "RNG " + rS($f0 + 2));
  }
  $r0 = rS($f0 + 2);
  U8[232343] = (U8[$f0] !== 0) ? 1 : 0;
  S.sp = $sp;
  return $r0;
}

export function AreaText(line: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 84);
  let spell: number = 0, kind: number = 0, aura: number = 0, $r0: string = "";
  spell = UseLine(line, $f0) & 255;
  wS($f0 + 2, 40, "");
  wS($f0 + 43, 40, "");
  kind = CharHlp.SpellArea(spell, $f0 + 1) & 255;
  if (spell === 60) {
    kind = 5;
    U8[$f0 + 1] = 3;
  }
  aura = 0;
  {
    const $w1 = spell * 16 + 222392;
    if (U8[$w1 + 10] > 0) {
      aura = FxEngine.AuraRange(U8[$w1 + 10]) & 255;
    }
    if (spell === 31) {
      wS($f0 + 43, 40, "ONE DOOR");
    } else if (CampOnly(spell)) {
      switch (U8[$w1 + 7]) {
        case 1: {
          wS($f0 + 43, 40, CASTER_AREA);
          break;
        }
        case 4: {
          wS($f0 + 2, 40, "AREA PARTY");
          wS($f0 + 43, 40, "THE WHOLE PARTY");
          break;
        }
        default: {
          wS($f0 + 43, 40, "1 CHARACTER");
        }
      }
    } else if (aura > 0) {
      wS($f0 + 2, 40, "AREA R" + StrUtil.NumStr(aura));
      if (kind === 0) {
        wS($f0 + 43, 40, "RADIUS " + StrUtil.NumStr(aura) + " AROUND CASTER");
      } else {
        wS($f0 + 43, 40, "RADIUS " + StrUtil.NumStr(aura) + " AROUND TARGET");
      }
    } else {
      switch (kind) {
        case 0: {
          if (U8[$w1 + 7] === 1) {
            wS($f0 + 43, 40, CASTER_AREA);
          } else {
            wS($f0 + 2, 40, "AREA ALL");
            wS($f0 + 43, 40, "THE WHOLE FIELD");
          }
          break;
        }
        case 1: {
          if (U8[$f0 + 1] === 1) {
            wS($f0 + 43, 40, "1 CREATURE");
          } else {
            wS($f0 + 2, 40, "TGT 1-" + StrUtil.NumStr(U8[$f0 + 1]));
            wS($f0 + 43, 40, "UP TO " + StrUtil.NumStr(U8[$f0 + 1]) + " CREATURES");
          }
          break;
        }
        case 2: {
          wS($f0 + 43, 40, "1 CREATURE");
          break;
        }
        case 3: {
          wS($f0 + 2, 40, "AREA R" + StrUtil.NumStr(U8[$f0 + 1]));
          wS($f0 + 43, 40, "RADIUS " + StrUtil.Count(U8[$f0 + 1], "SQUARE", "SQUARES"));
          break;
        }
        case 4: {
          wS($f0 + 2, 40, "AREA " + StrUtil.NumStr(U8[$f0 + 1]) + "x" + StrUtil.NumStr(U8[$f0 + 1]));
          wS($f0 + 43, 40, StrUtil.NumStr(U8[$f0 + 1]) + "x" + StrUtil.NumStr(U8[$f0 + 1]) + " SQUARES");
          break;
        }
        case 5: {
          wS($f0 + 2, 40, "AREA BOLT");
          wS($f0 + 43, 40, "BOLT, " + StrUtil.Count(U8[$f0 + 1], "SQUARE", "SQUARES") + " PAST AIM");
          break;
        }
        case 6: {
          wS($f0 + 2, 40, "AREA CONE");
          wS($f0 + 43, 40, "CONE, " + StrUtil.Count(U8[$f0 + 1], "SQUARE", "SQUARES") + " LONG");
          break;
        }
        case 7: {
          wS($f0 + 2, 40, "TGT POOL");
          wS($f0 + 43, 40, "CREATURES BY POOL");
          break;
        }
      }
    }
  }
  if (long) {
    $r0 = rS($f0 + 43);
  } else {
    $r0 = rS($f0 + 2);
  }
  U8[232343] = (U8[$f0] !== 0) ? 1 : 0;
  S.sp = $sp;
  return $r0;
}

export function ItemAreaText(line: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, AreaText(line, true));
  if (rS($f0) === CASTER_AREA) {
    wS($f0, 40, "USER");
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function DurationText(line: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 68);
  let spell: number = 0, m: number = 0, u: number = 0, $r0: string = "";
  spell = UseLine(line, $f0) & 255;
  CharHlp.SpellDuration(spell, $f0 + 1);
  if (U8[$f0 + 1] > 0) {
    wS($f0 + 47, 20, StrUtil.NumStr(U8[$f0 + 1]) + "D" + StrUtil.NumStr(U8[$f0 + 2]));
    if (r16($f0 + 3) > 0) {
      wS($f0 + 47, 20, rS($f0 + 47) + "+" + StrUtil.NumStr(r16($f0 + 3)));
    }
    switch (U8[$f0 + 5]) {
      case 1: {
        if (long) {
          wS($f0 + 6, 40, rS($f0 + 47) + " ROUNDS");
        } else {
          wS($f0 + 6, 40, rS($f0 + 47) + " RD");
        }
        break;
      }
      case 10: {
        if (long) {
          wS($f0 + 6, 40, rS($f0 + 47) + " TURNS");
        } else {
          wS($f0 + 6, 40, rS($f0 + 47) + " TU");
        }
        break;
      }
      default: {
        if (long) {
          wS($f0 + 6, 40, rS($f0 + 47) + " HOURS");
        } else {
          wS($f0 + 6, 40, rS($f0 + 47) + " HR");
        }
      }
    }
  } else {
    m = (r16($f0 + 3) * U8[$f0 + 5]) & 65535;
    {
      const $w1 = spell * 16 + 222392;
      if (U8[$f0 + 5] > 1) {
        u = U8[$f0 + 5];
      } else if (((U8[$w1 + 4] % 60) === 0) && ((U8[$w1 + 5] % 60) === 0)) {
        u = 60;
      } else if (((U8[$w1 + 4] % 10) === 0) && ((U8[$w1 + 5] % 10) === 0)) {
        u = 10;
      } else {
        u = 1;
      }
    }
    if ((m === 0) || ((U8[spell * 16 + 222402] === 0) && (spell !== 91))) {
      if ((m === 0) && (U8[spell * 16 + 222402] > 0)) {
        if (long) {
          wS($f0 + 6, 40, "PERMANENT");
        } else {
          wS($f0 + 6, 40, "PERM");
        }
      } else if (long) {
        wS($f0 + 6, 40, "INSTANT");
      } else {
        wS($f0 + 6, 40, "INST");
      }
    } else if (u === 60) {
      if (long) {
        wS($f0 + 6, 40, StrUtil.Count(Math.trunc(m / 60), "HOUR", "HOURS"));
      } else {
        wS($f0 + 6, 40, StrUtil.NumStr(Math.trunc(m / 60)) + " HR");
      }
    } else if (u === 10) {
      if (long) {
        wS($f0 + 6, 40, StrUtil.Count(Math.trunc(m / 10), "TURN", "TURNS"));
      } else {
        wS($f0 + 6, 40, StrUtil.NumStr(Math.trunc(m / 10)) + " TU");
      }
    } else if (long) {
      wS($f0 + 6, 40, StrUtil.Count(m, "ROUND", "ROUNDS"));
    } else {
      wS($f0 + 6, 40, StrUtil.NumStr(m) + " RD");
    }
  }
  if (!long) {
    wS($f0 + 6, 40, "DUR " + rS($f0 + 6));
  }
  $r0 = rS($f0 + 6);
  U8[232343] = (U8[$f0] !== 0) ? 1 : 0;
  S.sp = $sp;
  return $r0;
}

export function SaveText(spell: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 62);
  let $r0: string = "";
  spell = spell & 127;
  wS($f0 + 41, 20, "");
  if ((spell >= 1) && (spell <= 128)) {
    wS($f0 + 41, 20, " (VS " + rS((U8[spell * 16 + 222401] % 5) * 10 + 255623) + ")");
  }
  switch (SaveResult(spell)) {
    case 1: {
      if (long) {
        wS($f0, 40, "NEGATES" + rS($f0 + 41));
      } else {
        wS($f0, 40, "SAVE NEG");
      }
      break;
    }
    case 2: {
      if (long) {
        wS($f0, 40, "HALVES DAMAGE" + rS($f0 + 41));
      } else {
        wS($f0, 40, "SAVE 1/2");
      }
      break;
    }
    case 4: {
      if (long) {
        wS($f0, 40, "LESSENS" + rS($f0 + 41));
      } else {
        wS($f0, 40, "SAVE PART");
      }
      break;
    }
    default: {
      if (long) {
        wS($f0, 40, "NONE");
      } else {
        wS($f0, 40, "");
      }
    }
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function WhenText(spell: number, long: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  spell = spell & 127;
  if (spell === 31) {
    if (long) {
      wS($f0, 40, "AT A LOCKED DOOR");
    } else {
      wS($f0, 40, "DOORS");
    }
  } else {
    switch (U8[spell * 16 + 222403]) {
      case 0: {
        if (long) {
          wS($f0, 40, "IN CAMP");
        } else {
          wS($f0, 40, "CAMP");
        }
        break;
      }
      case 1: {
        if (long) {
          wS($f0, 40, "IN COMBAT");
        } else {
          wS($f0, 40, "CBT");
        }
        break;
      }
      default: {
        if (long) {
          wS($f0, 40, "IN CAMP OR COMBAT");
        } else {
          wS($f0, 40, "");
        }
      }
    }
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function CasterLevelText(line: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let spell: number = 0, i: number = 0, $r0: string = "";
  spell = UseLine(line, $f0) & 255;
  if (spell === 64) {
    wS($f0 + 1, 40, "");
    for (let $i1 = 1; $i1 <= 3; $i1++) {
      i = $i1;
      if (i === 3) {
        wS($f0 + 1, 40, rS($f0 + 1) + " OR ");
      } else if (i > 1) {
        wS($f0 + 1, 40, rS($f0 + 1) + ", ");
      }
      wS($f0 + 1, 40, rS($f0 + 1) + StrUtil.NumStr((i * 2) + 1));
    }
  } else {
    wS($f0 + 1, 40, StrUtil.NumStr(CharHlp.GetCasterLevel(spell)));
  }
  $r0 = rS($f0 + 1);
  U8[232343] = (U8[$f0] !== 0) ? 1 : 0;
  S.sp = $sp;
  return $r0;
}

export function CastTimeText(line: number) {
  let spell: number = 0, n: number = 0, $r0: string = "";
  spell = line & 255;
  n = Math.trunc(U8[spell * 16 + 222404] / 3);
  if ((line & 256) !== 0) {
    n = 0;
  }
  if (CampOnly(spell)) {
    $r0 = "";
  } else if (n === 0) {
    $r0 = "AT ONCE";
  } else {
    $r0 = "LATER: -" + StrUtil.NumStr(n) + " INITIATIVE";
  }
  return $r0;
}

export function Summary(line: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  $r0 = BuildSummary(line, $f0);
  S.sp = $sp;
  return $r0;
}

export function SummaryKeys(line: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 82);
  let $r0: string = "";
  wS($f0 + 41, 40, BuildSummary(line, $f0));
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function TextLine(spell: number, n: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let i: number = 0, p: number = 0, $r0: string = "";
  $r0 = "";
  if ((n < 1) || (n > SpellTxt.LineCount(spell))) {
    { S.sp = $sp; return $r0; }
  }
  wS($f0, 255, SpellTxt.TextChunk(spell, Math.trunc((n - 1) / 6)));
  for (let $i1 = 1, $e1 = (n - 1) % 6; $i1 <= $e1; $i1++) {
    i = $i1;
    p = rt.Pos("\x0d", rS($f0));
    if (p === 0) {
      wS($f0, 255, "");
    } else {
      wS($f0, 255, rt.Delete(rS($f0), 1, p));
    }
  }
  p = rt.Pos("\x0d", rS($f0));
  if (p > 0) {
    U8[$f0] = (p - 1) & 255;
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function ShowSummary(line: number, row: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 82);
  let i: number = 0, first: number = 0, color: number = 0;
  TextRend.PrintSpaces(1, row, 0, 38);
  if ((line & 255) === 0) {
    { S.sp = $sp; return; }
  }
  wS($f0, 40, BuildSummary(line, $f0 + 41));
  first = 1;
  for (let $i1 = 1, $e1 = U8[$f0]; $i1 <= $e1; $i1++) {
    i = $i1;
    if ((i === U8[$f0]) || (U8[$f0 + (i + 1) + 41] !== U8[$f0 + first + 41])) {
      if (U8[$f0 + first + 41] === 75) {
        color = 15;
      } else {
        color = 10;
      }
      TextRend.DisplayString(first, row, color, rt.Copy(rS($f0), first, (i - first) + 1));
      first = (i + 1) & 255;
    }
  }
  S.sp = $sp;
}

export async function ShowPage(lines: number, count: number, cur: number) {
  (await Browse(lines, 0, count, cur, "Spell: "));
}

export function HasItemPage(item: number) {
  let $r0: boolean = false;
  $r0 = (U8[item + 53] === 0) && (SpellTxt.LineCount(CharHlp.ItemSpell(item)) > 0);
  return $r0;
}

export async function ShowItemPage(items: number, count: number, cur: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 138);
  let i: number = 0;
  if (count > 16) {
    count = 16;
  }
  for (let $i1 = 0, $e1 = count - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    w16($f0 + i * 2, CharHlp.ItemSpell(r32(items + i * 4)) | 256);
  }
  (await Browse($f0, items, count, cur, "Item: "));
  S.sp = $sp;
}

export function UseLine(line: number, old: number) {
  let $r0: number = 0;
  U8[old] = (U8[232343] !== 0) ? 1 : 0;
  U8[232343] = (line & 256) !== 0 ? 1 : 0;
  $r0 = line & 255;
  return $r0;
}

export function CampOnly(spell: number) {
  let $r0: boolean = false;
  $r0 = U8[spell * 16 + 222403] === 0;
  return $r0;
}

export function BuildSummary(line: number, keys: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 738);
  let i: number = 0, j: number = 0, n: number = 0, pass: number = 0, $r0: string = "";
  wS($f0, 40, RangeText(line, false));
  wS($f0 + 41, 40, AreaText(line, false));
  wS($f0 + 82, 40, DurationText(line, false));
  wS($f0 + 123, 40, SaveText(line, false));
  wS($f0 + 164, 40, WhenText(line, false));
  wS($f0 + 717, 20, "  ");
  for (let $i1 = 1; $i1 <= 2; $i1++) {
    pass = $i1;
    wS($f0 + 205, 255, "");
    wS($f0 + 461, 255, "");
    for (let $i2 = 1; $i2 <= 5; $i2++) {
      i = $i2;
      if (rS($f0 + i * 41 - 41) !== "") {
        if (rS($f0 + 205) !== "") {
          wS($f0 + 205, 255, rS($f0 + 205) + rS($f0 + 717));
          wS($f0 + 461, 255, rS($f0 + 461) + rS($f0 + 717));
        }
        wS($f0 + 205, 255, rS($f0 + 205) + rS($f0 + i * 41 - 41));
        n = rt.Pos(" ", rS($f0 + i * 41 - 41));
        if (n === 0) {
          n = (U8[$f0 + i * 41 - 41] + 1) & 255;
        }
        for (let $i3 = 1, $e3 = U8[$f0 + i * 41 - 41]; $i3 <= $e3; $i3++) {
          j = $i3;
          if (j < n) {
            wS($f0 + 461, 255, rS($f0 + 461) + "K");
          } else {
            wS($f0 + 461, 255, rS($f0 + 461) + " ");
          }
        }
      }
    }
    if (U8[$f0 + 205] > 38) {
      wS($f0 + 717, 20, " ");
    }
  }
  if (U8[$f0 + 205] > 38) {
    U8[$f0 + 205] = 38;
    U8[$f0 + 461] = 38;
  }
  wS(keys, 40, rS($f0 + 461));
  $r0 = rS($f0 + 205);
  S.sp = $sp;
  return $r0;
}

export function Figure(row: number, lbl: string, value: string) {
  TextRend.DisplayString(1, row, 10, lbl);
  TextRend.DisplayString(15, row, 15, value);
}

export function ItemName(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 82);
  let qty: number = 0, $r0: string = "";
  wS($f0, 40, rS(item));
  qty = U8[item + 57];
  U8[item + 57] = 0;
  CharHlp.ItemLabel(item, false);
  wS($f0 + 41, 40, rS(item));
  U8[item + 57] = qty;
  wS(item, 40, rS($f0));
  if (rt.Copy(rS($f0 + 41), 1, 2) === "* ") {
    wS($f0 + 41, 40, rt.Delete(rS($f0 + 41), 1, 2));
  }
  while ((U8[$f0 + 41] > 0) && (U8[$f0 + U8[$f0 + 41] + 41] === 32)) {
    U8[$f0 + 41] = U8[$f0 + 41] - 1;
  }
  $r0 = rS($f0 + 41);
  S.sp = $sp;
  return $r0;
}

export function LevelAfter(used: number, lvl: string) {
  let $r0: string = "";
  if ((used + (", LEVEL " + lvl).length) <= 24) {
    $r0 = ", LEVEL " + lvl;
  } else if ((used + (", LV " + lvl).length) <= 24) {
    $r0 = ", LV " + lvl;
  } else {
    $r0 = "";
  }
  return $r0;
}

export async function DrawPage(line: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 82);
  let spell: number = 0, i: number = 0, row: number = 0;
  spell = line & 255;
  wS($f0, 40, CasterLevelText(line));
  (await Border.DrawWindow(1, 3, 38, 22, 0, 0, ""));
  if (CharHlp.IsSpell(spell)) {
    TextRend.DisplayCentered(1, 38, 3, 15, rS(spell * 33 + 219075));
    switch (U8[spell * 16 + 222392]) {
      case 0: {
        wS($f0 + 41, 40, "CLERIC");
        break;
      }
      case 2: {
        wS($f0 + 41, 40, "DRUID");
        break;
      }
      default: {
        wS($f0 + 41, 40, "MAGIC-USER");
      }
    }
    wS($f0 + 41, 40, rS($f0 + 41) + " LEVEL " + StrUtil.NumStr(I8[spell * 16 + 222393]));
  } else {
    if (item !== 0) {
      TextRend.DisplayCentered(1, 38, 3, 15, ItemName(item));
    }
    wS($f0 + 41, 40, "MAGIC ITEM, CASTER LEVEL " + rS($f0));
  }
  TextRend.DisplayCentered(1, 38, 4, 10, rS($f0 + 41));
  TextRend.DisplayString(1, 6, 10, "CAST BY");
  if (item !== 0) {
    wS($f0 + 41, 40, rt.Copy(ItemName(item), 1, 24));
    if (CharHlp.IsSpell(spell)) {
      wS($f0 + 41, 40, rS($f0 + 41) + LevelAfter(U8[$f0 + 41], rS($f0)));
    }
    TextRend.DisplayString(15, 6, 15, rS($f0 + 41));
  } else if ((line & 256) !== 0) {
    TextRend.DisplayString(15, 6, 15, "A SCROLL, LEVEL " + rS($f0));
  } else {
    CharDisp.DisplayCreatureName(r32(229635), 15, 6, false);
    TextRend.DisplayString(15 + U8[r32(229635)], 6, 15, LevelAfter(U8[r32(229635)], rS($f0)));
  }
  row = 7;
  Figure(row, "RANGE", RangeText(line, true));
  if (item !== 0) {
    Figure(row + 1, "AREA", ItemAreaText(line));
  } else {
    Figure(row + 1, "AREA", AreaText(line, true));
  }
  Figure(row + 2, "DURATION", DurationText(line, true));
  Figure(row + 3, "SAVING THROW", SaveText(line, true));
  Figure(row + 4, "CAST", WhenText(line, true));
  wS($f0 + 41, 40, CastTimeText(line));
  if (rS($f0 + 41) !== "") {
    Figure(row + 5, "CASTING TIME", rS($f0 + 41));
  }
  for (let $i1 = 1; $i1 <= 9; $i1++) {
    i = $i1;
    TextRend.DisplayString(1, (14 + i) - 1, 10, TextLine(spell, i));
  }
  S.sp = $sp;
}

export async function Browse(lines: number, items: number, count: number, cur: number, query: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 42);
  let ch: number = 0, step: number = 0, done: boolean = false, item: number = 0;
  if (((count < 1) || (ri16(cur) < 0)) || (ri16(cur) >= count)) {
    { S.sp = $sp; return; }
  }
  if (count > 1) {
    wS($f0 + 1, 40, "Next Prev Exit");
  } else {
    wS($f0 + 1, 40, "Exit");
  }
  done = false;
  do {
    item = 0;
    if (items !== 0) {
      item = r32(items + ri16(cur) * 4);
    }
    (await DrawPage(r16(lines + ri16(cur) * 2), item));
    step = 0;
    U8[231529] = 1;
    do {
      ch = (await MenuCore.MenuHorizontal(query, rS($f0 + 1), 13, 10, 15, true, false, $f0)) & 255;
      if ((U8[$f0] !== 0)) {
        switch (ch) {
          case 72: case 73: {
            step = -1;
            break;
          }
          case 80: case 81: {
            step = 1;
            break;
          }
        }
      } else {
        switch (ch) {
          case 80: {
            step = -1;
            break;
          }
          case 78: {
            step = 1;
            break;
          }
          case 0: case 69: {
            done = true;
            break;
          }
        }
      }
      if (count < 2) {
        step = 0;
      }
    } while (!(done || (step !== 0)));
    if (step !== 0) {
      w16(cur, ((ri16(cur) + count) + step) % count);
    }
  } while (!(done));
  TextRend.ClearBottomLine();
  S.sp = $sp;
}
