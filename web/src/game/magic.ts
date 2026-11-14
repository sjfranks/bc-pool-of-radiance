// Generated from src/magic.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Stats from './stats';
import * as CharDisp from './chardisp';
import * as C_SOUND from './c_sound';
import * as C_ITEM from './c_item';
import * as Dice from './dice';
import * as Crt from './crt';
import * as C_NPC from './c_npc';
import * as C_TERR from './c_terr';
import * as C_SAVE from './c_save';
import * as C_COND from './c_cond';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as TextRend from './textrend';
import * as Border from './border';
import * as CharHlp from './charhlp';
import * as SoundDrv from './sounddrv';
import * as MenuCore from './menucore';
import * as Pathing from './pathing';
import * as CbtMap from './cbtmap';
import * as ClassCal from './classcal';
import * as FxEngine from './fxengine';
import * as C_EFFECT from './c_effect';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_STATUS from './c_status';
import * as C_IFC from './c_ifc';
import * as C_DIR from './c_dir';
import * as C_SPELL from './c_spell';
import * as AbilAdj from './abiladj';
import * as StrUtil from './strutil';
import * as ChgClass from './chgclass';
import * as SpellInf from './spellinf';
import * as CbtLog from './cbtlog';
import * as C_SPRITE from './c_sprite';
import * as Bestiary from './bestiary';
import * as C_BEAST from './c_beast';
import * as CharExt from './charext';
import * as C_RACE from './c_race';
import * as EffHndlr from './effhndlr';

export const MARK_NONE = 0;
export const MARK_KNOWN = 1;
export const MARK_NOT_KNOWN = 2;
export const KNOWN_MARK = 45;
export const NOT_KNOWN_MARK = 43;
export const SCROLL_MARK = 45;
export const SPELL_LEVEL_LAST = 7;
export const LINE_WIDTH = 38;
export const MARK_COL = 3;

export const $at = { belowListHook: 240653, gTargetX: 240657, gTargetY: 240658, spellList: 248073, spellIds: 248077, spellScrolls: 248146, scrollPtrs: 248422, scrollCount: 248618, currentScrollPtr: 248619, scrollList: 248623, spellLevelNames: 248624 };

export async function SpellSelection(selType: number, idx: number, scroll: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 87);
  let p: number = 0, count: number = 0, windowRow: number = 0, bottomRow: number = 0, summaryRow: number = 0, ch: number = 0, addExit: boolean = false, moved: boolean = false, $r0: number = 0;
  switch (selType) {
    case 1: {
      wS($f0 + 45, 40, "Cast");
      break;
    }
    case 2: {
      wS($f0 + 45, 40, "Memorize");
      break;
    }
    case 3: {
      wS($f0 + 45, 40, "Scribe");
      break;
    }
    case 4: {
      wS($f0 + 45, 40, "Learn");
      break;
    }
    default: {
      wS($f0 + 45, 40, "");
    }
  }
  if (rS($f0 + 45) !== "") {
    wS($f0 + 4, 40, rS($f0 + 45) + ": ");
  } else {
    wS($f0 + 4, 40, "");
  }
  switch (selType) {
    case 2: {
      windowRow = 16;
      bottomRow = 16;
      summaryRow = 22;
      break;
    }
    case 5: {
      windowRow = 22;
      bottomRow = 22;
      summaryRow = 0;
      break;
    }
    default: {
      windowRow = 22;
      bottomRow = 20;
      summaryRow = 22;
    }
  }
  if (summaryRow > 0) {
    if (rS($f0 + 45) === "") {
      wS($f0 + 45, 40, "Info");
    } else {
      wS($f0 + 45, 40, rS($f0 + 45) + " Info");
    }
  }
  if (selType === 4) {
    addExit = false;
  } else {
    addExit = true;
  }
  U8[$f0 + 86] = false ? 1 : 0;
  if (ri16(idx) < 0) {
    (await DrawListWindows(windowRow, selType === 2));
    U8[$f0 + 86] = true ? 1 : 0;
    w16(145641, 0);
    w16(idx, 0);
    p = r32(248073);
    while ((p !== 0) && (U8[p + 41] !== 0)) {
      p = r32(p + 42);
      w16(idx, ri16(idx) + 1);
    }
    if (p === 0) {
      w16(idx, 0);
    }
  }
  if ((selType === 4) || (selType === 1)) {
    U8[$f0 + 86] = true ? 1 : 0;
  }
  w32($f0, 0);
  do {
    if (summaryRow > 0) {
      SpellInf.ShowSummary(LineSpell(ri16(idx)), summaryRow);
    }
    U8[227080] = selType === 5 ? 1 : 0;
    U8[227106] = summaryRow > 0 ? 1 : 0;
    U8[227108] = true ? 1 : 0;
    ch = (await MenuCore.MenuVertical(rS($f0 + 4), rS($f0 + 45), 13, 10, 15, 1, 3, 38, bottomRow, r32(248073), addExit, $f0 + 86, idx, $f0)) & 255;
    moved = (U8[227107] !== 0);
    if (((!moved && (ch === 73)) && (summaryRow > 0)) && (r32($f0) !== 0)) {
      (await SpellPage(idx, bottomRow, windowRow, selType === 2));
      U8[$f0 + 86] = true ? 1 : 0;
    }
  } while (!(!moved && (ch === 0 || ch === 13 || ch === 67 || ch === 69 || ch === 76 || ch === 77 || ch === 83)));
  if (summaryRow > 0) {
    SpellInf.ShowSummary(0, summaryRow);
  }
  p = r32(248073);
  count = 0;
  while (p !== r32($f0)) {
    if (U8[p + 41] === 0) {
      count = (count + 1) & 255;
    }
    p = r32(p + 42);
  }
  w32(scroll, 0);
  if ((ch === 0 || ch === 69) || (count > 68)) {
    $r0 = 0;
  } else {
    $r0 = U8[count + 248077];
    w32(scroll, r32(count * 4 + 248146));
  }
  if (selType === 3) {
    if (count <= 48) {
      w32(248619, r32(count * 4 + 248422));
    } else {
      w32(248619, 0);
    }
  }
  MenuCore.FreeStringList(248073);
  S.sp = $sp;
  return $r0;
}

export function GenerateSpellList(creature: number, menuType: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let i: number = 0, p: number = 0, lvl: number = 0, $r0: boolean = false;
  $r0 = false;
  w32(248073, 0);
  U8[$f0] = 0;
  for (let $i1 = 0; $i1 <= 68; $i1++) {
    i = $i1;
    U8[i + 248077] = 0;
    w32(i * 4 + 248146, 0);
  }
  for (let $i2 = 0; $i2 <= 48; $i2++) {
    i = $i2;
    w32(i * 4 + 248422, 0);
  }
  U8[248618] = 0;
  U8[248623] = menuType === 2 ? 1 : 0;
  if (menuType === 7) {
    AddAvailableSpells(creature);
  } else {
    for (let $i3 = 1; $i3 <= 7; $i3++) {
      lvl = $i3;
      switch (menuType) {
        case 0: {
          for (let $i4 = 0; $i4 <= 47; $i4++) {
            i = $i4;
            if (((CharHlp.MemorizedAt(creature, i) > 0) && (CharHlp.MemorizedAt(creature, i) < 128)) && (SlotLevel(creature, i) === lvl)) {
              AddMemorizedSpell(creature, i, $f0);
            }
          }
          break;
        }
        case 5: {
          for (let $i5 = 0; $i5 <= 47; $i5++) {
            i = $i5;
            if ((CharHlp.MemorizedAt(creature, i) > 127) && (SlotLevel(creature, i) === lvl)) {
              AddMemorizedSpell(creature, i, $f0);
            }
          }
          break;
        }
        case 1: {
          for (let $i6 = 1; $i6 <= 100; $i6++) {
            i = $i6;
            if (CharHlp.KnowsSpell(creature, i) && (I8[i * 16 + 136507] === lvl)) {
              AddSpellToList(creature, i, 0);
            }
          }
          break;
        }
        case 2: {
          AddScrollSpells(creature, false, 2, lvl);
          break;
        }
        case 3: {
          AddAllScrollSpells(creature, false, 1, lvl);
          break;
        }
        case 6: {
          AddAllScrollSpells(creature, true, 0, lvl);
          break;
        }
        case 4: {
          for (let $i7 = 1; $i7 <= 100; $i7++) {
            i = $i7;
            if (CharHlp.IsSpell(i)) {
              {
                const $w8 = i * 16 + 136506;
                if (((I8[$w8 + 1] === lvl) && (CharHlp.SpellSlots(creature, I8[$w8], I8[$w8 + 1]) > 0)) && !CharHlp.KnowsSpell(creature, i)) {
                  AddSpellToList(creature, i, 0);
                }
              }
            }
          }
          break;
        }
      }
    }
  }
  p = r32(248073);
  while ((p !== 0) && (U8[p + 41] !== 0)) {
    p = r32(p + 42);
  }
  if (p !== 0) {
    $r0 = true;
  } else if (r32(248073) !== 0) {
    MenuCore.FreeStringList(248073);
    w32(248073, 0);
  }
  S.sp = $sp;
  return $r0;
}

export function SpellListLine(n: number) {
  let p: number = 0, $r0: string = "";
  p = r32(248073);
  while ((p !== 0) && (n > 0)) {
    p = r32(p + 42);
    n = (n - 1) & 255;
  }
  if (p === 0) {
    $r0 = "";
  } else {
    $r0 = rS(p);
  }
  return $r0;
}

export async function NoncombatCastTargetMenu(spell: number, b: boolean, cast: number) {
  if (r32(146449) === 0) {
    w32(146449, r32(143749));
  }
  w32(146161, r32(143749));
  U8[146160] = 1;
  U8[cast] = true ? 1 : 0;
  switch (U8[spell * 16 + 136513]) {
    case 1: {
      break;
    }
    case 2: {
      (await CharDisp.DisplayNoncombatInterface());
      (await CharDisp.SelectChar("Cast Spell on whom", true, 146449));
      if (r32(146449) === 0) {
        w32(146161, 0);
        U8[146160] = 0;
        U8[cast] = false ? 1 : 0;
      } else {
        w32(146161, r32(146449));
      }
      break;
    }
    case 4: {
      w32(U8[146160] * 4 + 146157, r32(143753));
      while (r32(r32(U8[146160] * 4 + 146157) + 260) !== 0) {
        w32((U8[146160] + 1) * 4 + 146157, r32(r32(U8[146160] * 4 + 146157) + 260));
        U8[146160] = U8[146160] + 1;
      }
      break;
    }
    default: {
      U8[cast] = false ? 1 : 0;
    }
  }
}

export async function CastSpell(spell: number, b: boolean, announce: boolean, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let ok: boolean = false, chance: number = 0, failed: boolean = false, x: number = 0, y: number = 0, k: number = 0, p: number = 0;
  p = r32(143749);
  ok = true;
  if (!(U8[146457] !== 0) && CharHlp.HasEffect(p, 154, $f0)) {
    (await CharDisp.PrintNameString(p, "is too feebleminded to cast", 10, true));
    { S.sp = $sp; return; }
  }
  if ((U8[141176] !== 5) && (U8[spell * 16 + 136513] === 0)) {
    if ((U8[146457] !== 0) === false) {
      ShowCombatOnlySpell(spell);
      if ((await MenuCore.YesNoMenu("Lose it? ", 13, 15, 10)) === 89) {
        CharHlp.RemoveSpell(r32(143749), spell);
      }
    } else {
      ShowCombatOnly("That Item", "item");
      if ((await MenuCore.YesNoMenu("Use it? ", 13, 15, 10)) === 89) {
        U8[sel] = true ? 1 : 0;
      }
    }
    announce = false;
    ok = false;
  }
  if (announce) {
    if ((U8[146457] !== 0) === false) {
      (await PrintCastSpellMsg(p, "casts", spell));
    }
  }
  while (ok) {
    (await rt.FT[r32(145644)](spell, b, sel));
    if ((U8[sel] !== 0)) {
      ok = false;
      failed = false;
      if ((U8[146457] !== 0) === false) {
        chance = ClassCal.SpellFailureChance(p, spell) & 255;
        if (chance > 0) {
          failed = Dice.RollDice(1, 100) <= chance;
        }
      }
      if (failed) {
        CharHlp.RemoveSpell(p, spell);
        (await CharDisp.PrintNameString(p, "fails to cast " + rS(spell * 33 + 133189) + ".", 10, true));
      } else {
        if (U8[141176] === 5) {
          (await CharDisp.BuildIconFacings(18));
          x = CbtMap.CombatCellX(p) << 24 >> 24;
          y = CbtMap.CombatCellY(p) << 24 >> 24;
          k = Pathing.DirToward(x, y, I8[240657], I8[240658]) & 255;
          if (k < 8) {
            (await CbtMap.SetCreatureFacing(p, k, 1, 0));
          }
          (await SoundDrv.SoundSetAutoStop(0));
          switch (spell) {
            case 47: {
              (await SoundDrv.SoundEffect(r16(132909), 32));
              break;
            }
            case 51: {
              (await SoundDrv.SoundEffect(r16(132903), 32));
              break;
            }
            default: {
              (await SoundDrv.SoundEffect(r16(132891), 32));
            }
          }
          (await CharDisp.CombatAnimateMovingIcon(x, y, I8[240657], I8[240658], 4, 30));
          (await SoundDrv.SoundSetAutoStop(10));
          if (CbtMap.CombatIconVisible(p, 0)) {
            (await CbtMap.SetCreatureFacing(p, U8[r32(p + 264) + 9], 1, 1));
            (await CbtMap.SetCreatureFacing(p, U8[r32(p + 264) + 9], 0, 0));
          }
        }
        (await FxEngine.RemoveInvisibility(p));
        if ((U8[146457] !== 0) === false) {
          CharHlp.RemoveSpell(r32(143749), spell);
          Stats.Count(p, 10, 1);
        }
        U8[144900] = spell;
        (await rt.FT[r32(U8[144900] * 4 + 145644)]());
        U8[144900] = 0;
        U8[144904] = 0;
      }
    } else {
      if (U8[141176] !== 5) {
        ok = false;
      } else if (b || ((await MenuCore.YesNoMenu("Abort Spell? ", 14, 10, 15)) === 89)) {
        (await CharDisp.PrintActionLine(r32(143749), "Spell Aborted", "aborts the spell"));
        if ((U8[146457] !== 0) === false) {
          CharHlp.RemoveSpell(r32(143749), spell);
        }
        ok = false;
      }
    }
  }
  (await CharDisp.ClearMessageWindow());
  if (U8[141176] === 5) {
    (await Border.ClearBox(0, 23, 39, 23));
  }
  S.sp = $sp;
}

export function ShowCombatOnlySpell(spell: number) {
  ShowCombatOnly(rS(spell * 33 + 133189), "spell");
}

export function FindScrollCopies(creature: number, spell: number, copies: number, best: number) {
  let item: number = 0, i: number = 0, held: number = 0, fewest: number = 0;
  U8[copies] = 0;
  w32(best, 0);
  fewest = 0;
  item = r32(creature + 200);
  while (item !== 0) {
    if (CharHlp.CastableScroll(creature, item)) {
      held = 0;
      for (let $i2 = 1; $i2 <= 3; $i2++) {
        i = $i2;
        if (CharHlp.ScrollSpellAt(item, i) === spell) {
          held = (held + 1) & 255;
        }
      }
      if (held > 0) {
        U8[copies] = U8[copies] + held;
        if ((r32(best) === 0) || (ScrollSpellCount(item) < fewest)) {
          w32(best, item);
          fewest = ScrollSpellCount(item) & 255;
        }
      }
    }
    item = r32(item + 42);
  }
}

export async function RemoveSpellFromScroll(cr: number, it: number, spell: number) {
  let item: number = 0, sp: number = 0, i: number = 0, found: number = 0;
  item = it;
  sp = spell & 127;
  found = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    if ((U8[item + i + 59] & 127) === sp) {
      found = i;
    }
  }
  for (let $i2 = 1; $i2 <= 3; $i2++) {
    i = $i2;
    if (U8[it + i + 59] === spell) {
      found = i;
    }
  }
  if (found === 0) {
    return;
  }
  U8[item + found + 59] = 0;
  U8[item + 48] = U8[item + 48] - 1;
  if (U8[item + 48] < 210) {
    (await CharHlp.RemoveItem(cr, item));
  }
}

export async function PrintCastSpellMsg(creature: number, msg: string, spell: number) {
  if (U8[141176] === 5) {
    (await CharDisp.PrintNameString(creature, "Casts a Spell", 10, true));
    CbtLog.Add(10, " (" + rS(spell * 33 + 133189) + ")");
    (await Border.ClearBox(0, 23, 39, 23));
    TextRend.DisplayString(0, 23, 10, "Spell:" + rS(spell * 33 + 133189));
  } else {
    (await Border.ClearBox(1, 18, 38, 22));
    CharDisp.DisplayCreatureName(creature, 1, 19, false);
    TextRend.DisplayString(U8[creature] + 2, 19, 10, msg);
    TextRend.DisplayString(1, 20, 10, rS(spell * 33 + 133189));
    (await TextRend.PauseOnly());
    (await CharDisp.ClearMessageWindow());
  }
}

export async function SpellRemoveCurse() {
  let item: number = 0, found: boolean = false;
  if ((await FxEngine.RemoveEffectWithMessage(r32(146161), 36))) {
    (await CharDisp.PrintNameStringAnim(r32(146161), true, "is un-cursed"));
  } else {
    found = false;
    item = r32(r32(146161) + 200);
    while ((item !== 0) && (found === false)) {
      if (U8[item + 54] !== 0) {
        found = true;
        U8[item + 54] = 0;
      }
      item = r32(item + 42);
    }
    if (found) {
      (await CharDisp.PrintNameStringAnim(r32(146161), true, "'s item is un-cursed"));
    }
  }
}

export async function SpellBless() {
  (await CastOneSide(CharHlp.Team(r32(143749)), "is Blessed"));
}

export async function SpellCurse() {
  (await CastOneSide(1 - CharHlp.Team(r32(143749)), "is Cursed"));
}

export async function SpellCureLightWounds() {
  if (U8[146160] === 0) {
    return;
  }
  if ((await FxEngine.RestoreHitPoints(r32(146161), Dice.RollDice(1, 8), false))) {
    (await CharDisp.PrintHpRestoreMsg(r32(146161)));
  }
}

export async function SpellCauseLightWounds() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(1, 8), 8, ""));
}

export async function SpellDetection() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is affected"));
}

export async function SpellProtection() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is protected"));
}

export async function SpellResistCold() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is cold-resistant"));
}

export async function SpellBurningHands() {
  U8[144901] = 1;
  (await ResolveSpell(U8[144900], 0, false, CharHlp.GetCasterLevel(U8[144900]), 9, ""));
}

export async function SpellCharmPerson() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0;
  tgt = r32(146161);
  if (!CharHlp.IsPerson(tgt)) {
    (await CharDisp.PrintNameString(tgt, "is unaffected", 10, true));
  } else {
    (await ResolveSpell(U8[144900], rt.mul(CharHlp.Team(r32(143749)), 128) + CharHlp.GetCasterLevel(U8[144900]), true, 0, 0, "is charmed"));
    if (CharHlp.HasEffect(tgt, 11, $f0)) {
      (await FxEngine.CallEffectHandler(11, r32(146161), r32($f0), false));
    }
  }
  S.sp = $sp;
}

export async function SpellEnlarge() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let baseStr: number = 0, excStr: number = 0, lvl: number = 0;
  baseStr = 18;
  lvl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  switch (lvl) {
    case 1: {
      excStr = 0;
      break;
    }
    case 2: {
      excStr = 1;
      break;
    }
    case 3: {
      excStr = 51;
      break;
    }
    case 4: {
      excStr = 76;
      break;
    }
    case 5: {
      excStr = 91;
      break;
    }
    case 6: {
      excStr = 100;
      break;
    }
    default: {
      if (lvl > 6) {
        excStr = 100;
      } else {
        excStr = 0;
      }
    }
  }
  if (FxEngine.AdjustForNewStrength(r32(146161), baseStr, excStr, $f0)) {
    (await CharDisp.PrintNameString(r32(146161), "is stronger", 10, true));
  }
  FxEngine.AddEffect(r32(146161), 12, CalcSpellDuration(U8[144900]), U8[$f0], true);
  S.sp = $sp;
}

export async function SpellReduce() {
  if (U8[146160] > 0) {
    if (!(await FxEngine.RollSavingThrow(r32(146161), 4, 0))) {
      if ((await FxEngine.RemoveEffectWithMessage(r32(146161), 12))) {
        (await CharDisp.PrintNameString(r32(146161), "has been reduced", 10, true));
      }
    }
  }
}

export async function SpellFriends() {
  let tgt: number = 0, newCha: number = 0;
  if (U8[146160] === 0) {
    return;
  }
  tgt = r32(146161);
  if (tgt === 0) {
    return;
  }
  if ((await FxEngine.EffectImmune(tgt, 14))) {
    (await CharDisp.PrintNameString(tgt, "is Unaffected", 10, true));
  } else {
    newCha = AbilAdj.ClampScore(U8[tgt + 21] + Dice.RollDice(2, 4)) & 255;
    if (newCha < U8[tgt + 21]) {
      newCha = U8[tgt + 21];
    }
    FxEngine.AddEffect(tgt, 14, CalcSpellDuration(U8[144900]), 128 | (newCha - U8[tgt + 21]), true);
    U8[tgt + 21] = newCha;
    (await CharDisp.PrintNameStringAnim(tgt, true, "is friendly"));
    (await CharDisp.ClearMessageWindow());
  }
}

export async function SpellMagicMissile() {
  let missiles: number = 0;
  missiles = Math.trunc((CharHlp.GetCasterLevel(U8[144900]) + 1) / 2) & 255;
  (await ResolveSpell(U8[144900], 0, false, missiles + Dice.RollDamageDice(missiles, 4), 8, ""));
}

export async function SpellShield() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is shielded"));
}

export async function SpellShockingGrasp() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(1, 8) + CharHlp.GetCasterLevel(U8[144900]), 12, ""));
}

export async function SpellSleep() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let i: number = 0;
  U8[144904] = 1;
  U8[$f0] = Dice.RollDice(4, 4);
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (!CharHlp.SleepTakes(r32(i * 4 + 146157), $f0)) {
      w32(i * 4 + 146157, 0);
    }
  }
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "falls asleep"));
  S.sp = $sp;
}

export async function SpellHold() {
  let tgt: number = 0, saved: boolean = false, i: number = 0, smod: number = 0;
  switch (U8[146160]) {
    case 1: {
      if (U8[144900] === 23) {
        smod = -2;
      } else {
        smod = -3;
      }
      break;
    }
    case 2: {
      smod = -1;
      break;
    }
    default: {
      smod = 0;
    }
  }
  for (let $i1 = U8[146160]; $i1 >= 1; $i1--) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      tgt = r32(i * 4 + 146157);
      if (i < U8[146160]) {
        (await SoundDrv.SoundSetAutoStop(0));
        (await SoundDrv.SoundEffect(r16(132891), 32));
        (await CharDisp.AnimateBetween(r32(143749), tgt, 18, 4, 30));
        (await SoundDrv.SoundSetAutoStop(10));
      }
      saved = (await FxEngine.RollSavingThrow(tgt, U8[U8[144900] * 16 + 136515], smod));
      if ((U8[144900] !== 94) && !CharHlp.IsPerson(tgt)) {
        saved = true;
      }
      (await FxEngine.AddEffectWithMessage(tgt, U8[U8[144900] * 16 + 136516], CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), false, U8[U8[144900] * 16 + 136514] === 1, saved, "is held"));
    }
  }
}

export async function SpellResistFire() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is fire resistant"));
}

export async function SpellSilence() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is silenced"));
}

export async function SpellSlowPoison() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0;
  tgt = r32(146161);
  if (U8[tgt + 268] === 1) {
    w32(146161, 0);
  } else if (CharHlp.HasEffect(tgt, 55, $f0)) {
    if (U8[tgt + 283] === 0) {
      U8[tgt + 283] = 1;
    }
    (await ResolveSpell(U8[144900], 255, true, 0, 0, "is affected"));
    let $t1;
    if (((U8[tgt + 268] === 6) || (U8[tgt + 269] === 0)) && !($t1 = U8[tgt + 268], $t1 === 2 || $t1 === 3 || $t1 === 7 || $t1 === 8)) {
      (await StandUpOrWake(tgt));
    }
    FxEngine.AddEffect(tgt, 15, 10, 255, true);
  }
  S.sp = $sp;
}

export async function SpellSnakeCharm() {
  let pool: number = 0, p: number = 0;
  pool = U8[r32(143749) + 283];
  U8[146160] = 0;
  p = r32(143753);
  while (p !== 0) {
    if (rS(p) === C_SPELL.SNAKE_NAME) {
      if (pool >= U8[p + 283]) {
        pool = (pool - U8[p + 283]) & 255;
        U8[146160] = U8[146160] + 1;
        w32(U8[146160] * 4 + 146157, p);
      }
    }
    p = r32(p + 260);
  }
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is charmed"));
}

export async function SpellSpiritualHammer() {
  (await ResolveSpell(U8[144900], 0, true, 0, 0, ""));
  (await FxEngine.CallEffectHandler(23, r32(146161), 0, false));
}

export async function SpellInvisibility() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is invisible"));
}

export async function SpellKnock() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "Knock-Knock"));
}

export async function SpellMirrorImage() {
  (await ResolveSpell(U8[144900], Dice.RollDice(1, 4), false, 0, 0, "is duplicated"));
}

export async function SpellRayOfEnfeeblement() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is weakened"));
}

export async function SpellStinkingCloud() {
  (await LayCloud(34, 40, "Creates a noxious cloud"));
}

export async function SpellStrength() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let tgt: number = 0, exStr: number = 0, roll: number = 0, newStr: number = 0;
  exStr = 0;
  roll = 0;
  tgt = r32(146161);
  if (CharHlp.GetClassLevel(tgt, 32) > 0) {
    roll = Dice.RollDice(1, 4) & 255;
  }
  if (CharHlp.GetClassLevel(tgt, 65) > 0) {
    roll = Dice.RollDice(1, 6) & 255;
  }
  if (CharHlp.WarriorLevel(tgt) > 0) {
    roll = Dice.RollDice(1, 8) & 255;
  }
  newStr = (U8[tgt + 16] + roll) & 255;
  if (newStr > 18) {
    if (CharHlp.WarriorLevel(tgt) > 0) {
      exStr = (U8[tgt + 22] + ((newStr - 18) * 10)) & 255;
      if (exStr > 100) {
        exStr = 100;
      }
      newStr = 18;
    } else {
      newStr = 18;
    }
  }
  if (FxEngine.AdjustForNewStrength(tgt, newStr, exStr, $f0)) {
    (await CharDisp.PrintNameString(tgt, "is stronger", 10, true));
  }
  FxEngine.AddEffect(tgt, 38, CalcSpellDuration(U8[144900]), U8[$f0], true);
  S.sp = $sp;
}

export async function SpellAnimateDead() {
  let i: number = 0, strength: number = 0, n: number = 0, p: number = 0;
  U8[144904] = 1;
  n = CharHlp.GetCasterLevel(U8[144900]) & 255;
  U8[146160] = 0;
  p = r32(143753);
  while ((p !== 0) && (n > 0)) {
    if (U8[p + 268] === 6) {
      if (U8[p + 159] === 0) {
        if (CbtMap.IsValidCreatureLoc(p, CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), true)) {
          strength = CharHlp.GetCasterLevel(U8[144900]) & 255;
          if (strength > 15) {
            strength = 15;
          }
          strength = (rt.mul(CharHlp.Team(p), 16) + strength) & 255;
          U8[p + 270] = CharHlp.Team(r32(143749));
          U8[p + 271] = 1;
          U8[p + 118] = 2;
          U8[p + 107] = 0;
          U8[p + 114] = 6;
          CharHlp.ClearMemorized(p);
          if (CharHlp.IsNpc(p)) {
            U8[p + 132] = 178;
          } else {
            U8[p + 132] = 179;
          }
          U8[p + 159] = 4;
          if (U8[141176] === 5) {
            w32(r32(p + 264) + 10, 0);
          }
          n = (n - 1) & 255;
          if ((await FxEngine.ReviveDeadCreature(p, U8[p + 50]))) {
            (await FxEngine.AddEffectWithMessage(p, 32, 0, strength, true, false, false, "is animated"));
            U8[p + 268] = 1;
          }
        }
      }
    }
    p = r32(p + 260);
  }
}

export async function SpellCureBlindness() {
  if ((await FxEngine.RemoveEffectWithMessage(r32(146161), 33))) {
    (await CharDisp.PrintNameStringAnim(r32(146161), true, "can see"));
  }
}

export async function SpellCauseBlindness() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is blind"));
}

export async function SpellCureDisease() {
  let junk: boolean = false;
  if (r32(146161) !== 0) {
    junk = (await CureDiseaseOf(r32(146161)));
  }
}

export async function SpellCauseDisease() {
  (await ResolveSpell(U8[144900], 0, true, 0, 0, "is diseased"));
}

export async function SpellDispelMagic() {
  let chance: number = 0, effLevel: number = 0, i: number = 0, cl: number = 0, tgt: number = 0, removed: boolean = false, effect: number = 0, nxt: number = 0;
  U8[144904] = 1;
  cl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    removed = false;
    if (i <= 72) {
      tgt = r32(i * 4 + 146157);
    } else {
      tgt = 0;
    }
    if (tgt !== 0) {
      effect = r32(tgt + 127);
    } else {
      effect = 0;
    }
    while (effect !== 0) {
      nxt = r32(effect + 5);
      if ((U8[effect + 3] < 255) && !rt.inS(rt.sUnion(C_EFFECT.DISEASES, rt.setR(140, 140, 141, 141)), U8[effect])) {
        effLevel = U8[effect + 3] & 15;
        if (cl > effLevel) {
          chance = (((cl - effLevel) * 5) + 50) & 255;
        } else if (cl < effLevel) {
          chance = (50 - ((effLevel - cl) * 2)) & 255;
        } else {
          chance = 50;
        }
        if (Dice.RollDice(1, 100) <= chance) {
          (await FxEngine.RemoveEffect(tgt, U8[effect], effect));
          removed = true;
          if ((nxt !== 0) && !FxEngine.HasEffectNode(tgt, nxt)) {
            nxt = 0;
          }
        }
      }
      effect = nxt;
    }
    if (removed) {
      (await CharDisp.PrintNameStringAnim(tgt, true, "is affected"));
    }
  }
}

export async function SpellPrayer() {
  (await ResolveSpell(U8[144900], FxEngine.PrayerStrength(r32(143749), CharHlp.GetCasterLevel(U8[144900])), false, 0, 0, "is praying"));
}

export async function SpellBestowCurse() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "has been cursed!"));
}

export async function SpellBlink() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is blinking"));
}

export async function SpellFireball() {
  let cl: number = 0;
  U8[144904] = 1;
  if (U8[144900] === 64) {
    cl = (rt.mul(Dice.RollDice(1, 3), 2) + 1) & 255;
  } else {
    cl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  }
  if (r16(r32(141147) + 460) === 0) {
    Pathing.TargetArea(I8[240657], I8[240658], 2);
  }
  (await CbtMap.ScrollView(I8[240657], I8[240658], 0, 8));
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(cl, 6), 9, ""));
}

export async function SpellHaste() {
  (await HasteSlowLogic(42, CharHlp.Team(r32(143749)), "is Hasted"));
}

export async function SpellLightningBolt() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let dmg: number = 0;
  dmg = Dice.RollDice(CharHlp.GetCasterLevel(U8[144900]), 6) & 255;
  (await LightningAttackAt(I8[240657], I8[240658], dmg, 4, $f0));
  BoltShape(51, $f0 + 1, $f0 + 2);
  (await LightningPath(U8[$f0 + 1], dmg, 4, (U8[$f0 + 2] !== 0)));
  S.sp = $sp;
}

export async function TraceBolt(spell: number, x: number, y: number, cells: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let savedX: number = 0, savedY: number = 0;
  if ((spell === 84) || (spell === 92)) {
    ConeShape(spell, $f0 + 2, $f0);
    TraceCone(CbtMap.CombatCellX(r32(143749)), CbtMap.CombatCellY(r32(143749)), x, y, U8[$f0 + 2], U8[$f0], cells);
    { S.sp = $sp; return; }
  }
  savedX = I8[240657];
  savedY = I8[240658];
  U8[240657] = x;
  U8[240658] = y;
  BoltShape(spell, $f0, $f0 + 1);
  (await WalkBolt(U8[$f0], 0, 4, (U8[$f0 + 1] !== 0), true, cells));
  U8[240657] = savedX;
  U8[240658] = savedY;
  S.sp = $sp;
}

export async function SpellSlow() {
  (await HasteSlowLogic(39, 1 - CharHlp.Team(r32(143749)), "is Slowed"));
}

export async function SpellRestoration() {
  let tgt: number = 0, resting: number = 0;
  tgt = r32(146161);
  resting = ChgClass.RestingMask(tgt) & 255;
  if (RestoreLevel(tgt)) {
    (await CharDisp.PrintNameString(tgt, "is restored", 10, true));
    if (resting !== 0) {
      (await ChgClass.AnnounceWoken(tgt, resting));
    }
  }
}

export function RestoreLevel(tgt: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 6);
  let logged: boolean = false, share: number = 0, cls: number = 0, levelXp: number = 0, $r0: boolean = false;
  $r0 = U8[tgt + 116] > 0;
  if (U8[tgt + 116] === 0) {
    { S.sp = $sp; return $r0; }
  }
  logged = CharExt.PopDrain(tgt, $f0);
  if (logged) {
    share = U8[$f0 + 4];
    if (share > U8[tgt + 117]) {
      U8[tgt + 117] = 0;
    } else {
      U8[tgt + 117] = U8[tgt + 117] - share;
    }
  } else {
    share = Math.trunc(U8[tgt + 117] / U8[tgt + 116]) & 255;
    U8[tgt + 117] = U8[tgt + 117] - share;
  }
  U8[tgt + 50] = U8[tgt + 50] + share;
  U8[tgt + 283] = U8[tgt + 283] + share;
  U8[tgt + 177] = U8[tgt + 177] + share;
  U8[tgt + 116] = U8[tgt + 116] - 1;
  if (logged && RestorableClass(tgt, I8[$f0 + 5])) {
    cls = I8[$f0 + 5];
  } else {
    cls = RestoreClass(tgt) << 24 >> 24;
  }
  if (cls >= 0) {
    levelXp = ClassCal.LevelXp(cls, I8[tgt + cls + 150] + 1) | 0;
    let $t1;
    $t1 = tgt + cls + 150, U8[$t1] = I8[$t1] + 1;
    if (logged) {
      w32(tgt + 172, ri32(tgt + 172) + ri32($f0));
    }
    if (ri32(tgt + 172) < levelXp) {
      w32(tgt + 172, levelXp);
    }
  }
  ClassCal.RecalcBaseSkills(tgt);
  S.sp = $sp;
  return $r0;
}

export function RestorableClass(tgt: number, cls: number) {
  let lvl: number = 0, $r0: boolean = false;
  lvl = I8[tgt + cls + 150];
  if ((U8[tgt + 285] & (1 << cls)) !== 0) {
    lvl = 0;
  }
  $r0 = ((lvl > 0) && (ClassCal.LevelXp(cls, lvl + 1) > 0)) && !CharHlp.AtLevelCap(tgt, cls);
  return $r0;
}

export function RestoreClass(tgt: number) {
  let bestLvl: number = 0, lvl: number = 0, bestXp: number = 0, cls: number = 0, $r0: number = 0;
  bestLvl = 10;
  bestXp = 10000000;
  $r0 = -1;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if (RestorableClass(tgt, cls)) {
      lvl = I8[tgt + cls + 150];
      if ((lvl <= bestLvl) && (ClassCal.LevelXp(cls, lvl + 1) < bestXp)) {
        bestLvl = lvl;
        $r0 = cls;
        bestXp = ClassCal.LevelXp(cls, lvl + 1) | 0;
      }
    }
  }
  return $r0;
}

export function DrainedByClass(creature: number, counts: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 8);
  let cls: number = 0, j: number = 0, i: number = 0, unlogged: number = 0;
  rt.fill(counts, 8, 0);
  rt.fill($f0, 8, 0);
  for (let $i1 = 1, $e1 = U8[creature + 287]; $i1 <= $e1; $i1++) {
    i = $i1;
    cls = I8[creature + i * 6 + 287];
    if ((cls >= 0) && (cls <= 7)) {
      let $t2;
      $t2 = counts + cls, U8[$t2] = U8[$t2] + 1;
    }
  }
  if (U8[creature + 116] <= U8[creature + 287]) {
    { S.sp = $sp; return; }
  }
  unlogged = (U8[creature + 116] - U8[creature + 287]) & 255;
  for (let $i3 = 0; $i3 <= 7; $i3++) {
    cls = $i3;
    U8[$f0 + cls] = U8[counts + cls];
    let $t4;
    $t4 = creature + cls + 150, U8[$t4] = I8[$t4] + U8[$f0 + cls];
  }
  for (let $i5 = 1, $e5 = unlogged; $i5 <= $e5; $i5++) {
    i = $i5;
    cls = RestoreClass(creature) << 24 >> 24;
    if (cls < 0) {
      for (let $i6 = 0; $i6 <= 7; $i6++) {
        j = $i6;
        if (((U8[creature + 285] & (1 << j)) === 0) && (I8[creature + j + 150] > 0)) {
          if ((cls < 0) || (I8[creature + j + 150] >= I8[creature + cls + 150])) {
            cls = j;
          }
        }
      }
    }
    if (cls >= 0) {
      let $t7;
      $t7 = counts + cls, U8[$t7] = U8[$t7] + 1;
      let $t8;
      $t8 = $f0 + cls, U8[$t8] = U8[$t8] + 1;
      let $t9;
      $t9 = creature + cls + 150, U8[$t9] = I8[$t9] + 1;
    }
  }
  for (let $i10 = 0; $i10 <= 7; $i10++) {
    cls = $i10;
    let $t11;
    $t11 = creature + cls + 150, U8[$t11] = I8[$t11] - U8[$f0 + cls];
  }
  S.sp = $sp;
}

export async function SpellPotionOfSpeed() {
  if (!(await FxEngine.RemoveEffectWithMessage(r32(146161), 42))) {
    (await ResolveSpell(U8[144900], 0, false, 0, 0, "is Speedy"));
  }
}

export async function KeoghtomsOintmentHandler() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0, slowed: boolean = false;
  tgt = r32(146161);
  slowed = CharHlp.HasEffect(tgt, 22, $f0) || CharHlp.HasEffect(tgt, 15, $f0);
  if ((await FxEngine.RemoveEffectWithMessage(tgt, 55))) {
    U8[144903] = 1;
    (await FxEngine.RemoveEffect(tgt, 22, 0));
    U8[144903] = 0;
    if ((U8[tgt + 268] === 6) && !slowed) {
      if (U8[tgt + 283] === 0) {
        U8[tgt + 283] = 1;
      }
      (await StandUpOrWake(tgt));
    }
  } else if (!(await CureDiseaseOf(tgt))) {
    if ((await FxEngine.RestoreHitPoints(r32(146161), Dice.RollDice(1, 4) + 8, false))) {
      (await CharDisp.PrintNameStringAnim(r32(146161), true, "is Healed"));
    }
  }
  S.sp = $sp;
}

export async function SpellGiantStrength() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  if (FxEngine.AdjustForNewStrength(r32(146161), 21, 0, $f0)) {
    (await CharDisp.PrintNameString(r32(146161), "is stronger", 10, true));
  }
  FxEngine.AddEffect(r32(146161), 38, CalcSpellDuration(U8[144900]), U8[$f0], true);
  S.sp = $sp;
}

export async function SpellJavelinOfLightning() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  (await LightningAttackAt(I8[240657], I8[240658], Dice.RollDice(1, 6) + 20, 4, $f0));
  BoltShape(60, $f0 + 1, $f0 + 2);
  (await LightningPath(U8[$f0 + 1], 20, 4, (U8[$f0 + 2] !== 0)));
  S.sp = $sp;
}

export async function SpellWandOfParalyzation() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is paralyzed"));
}

export async function SpellPotionOfHealing() {
  if ((await FxEngine.RestoreHitPoints(r32(146161), Dice.RollDice(2, 4) + 2, false))) {
    (await CharDisp.PrintNameStringAnim(r32(146161), true, "is Healed"));
  }
}

export async function SpellDustOfDisappearance() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is invisible"));
}

export async function SpellWandOfMagicMissiles() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(2, 4) + 2, 8, ""));
}

export function UnusedSpellHandler() {
}

export async function ManualBodilyHealthHandler() {
  (await ResolveSpell(U8[144900], 255, true, 0, 0, "is Reading"));
}

export async function SpellCureSeriousWounds() {
  if (U8[146160] === 0) {
    return;
  }
  if ((await FxEngine.RestoreHitPoints(r32(146161), Dice.RollDice(2, 8) + 1, false))) {
    (await CharDisp.PrintHpRestoreMsg(r32(146161)));
  }
}

export async function SpellCauseSeriousWounds() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(2, 8) + 1, 8, ""));
}

export async function SpellNeutralizePoison() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0, slowed: boolean = false;
  tgt = r32(146161);
  if (tgt === 0) {
    { S.sp = $sp; return; }
  }
  if ((U8[tgt + 268] !== 1) && CharHlp.HasEffect(tgt, 55, $f0)) {
    slowed = CharHlp.HasEffect(tgt, 22, $f0) || CharHlp.HasEffect(tgt, 15, $f0);
    U8[144903] = 1;
    (await FxEngine.RemoveEffect(tgt, 55, 0));
    (await FxEngine.RemoveEffect(tgt, 22, 0));
    (await FxEngine.RemoveEffect(tgt, 15, 0));
    U8[144903] = 0;
    (await CharDisp.PrintNameString(tgt, "is unpoisoned", 10, true));
    let $t1;
    if (($t1 = U8[tgt + 268], $t1 === 2 || $t1 === 3 || $t1 === 7 || $t1 === 8)) {
    } else if ((U8[tgt + 268] !== 6) || !slowed) {
      if (U8[tgt + 283] === 0) {
        U8[tgt + 283] = 1;
      }
      if (U8[141176] === 5) {
        (await StandUpOrWake(tgt));
      } else {
        U8[tgt + 269] = 1;
        U8[tgt + 268] = 0;
      }
    }
    (await CharDisp.RedrawPartyOutOfCombat());
  } else {
    (await CharDisp.PrintNameString(tgt, "is unaffected", 10, true));
  }
  S.sp = $sp;
}

export async function SpellPoison() {
  let tgt: number = 0;
  tgt = r32(146161);
  if ((tgt === 0) || (U8[141176] !== 5)) {
    return;
  }
  CharHlp.RecalcStats(tgt);
  (await FxEngine.TriggerEffectsWithCondition(11, tgt));
  if (!(await FxEngine.AttackRoll(r32(143749), tgt, U8[tgt + 273]))) {
    (await CharDisp.PrintNameString(r32(143749), "misses", 10, true));
  } else if ((await FxEngine.EffectImmune(tgt, 55))) {
    (await CharDisp.PrintNameString(tgt, "is Unaffected", 10, true));
  } else {
    w32(r32(r32(143749) + 264) + 10, tgt);
    (await FxEngine.CallEffectHandler(64, r32(143749), 0, false));
  }
}

export async function SpellSticksToSnakes() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0;
  tgt = r32(146161);
  if (tgt === 0) {
    { S.sp = $sp; return; }
  }
  if (I8[tgt + 115] < 6) {
    (await ResolveSpell(U8[144900], CharHlp.GetCasterLevel(U8[144900]), false, 0, 0, ""));
    if (CharHlp.HasEffect(tgt, 142, $f0)) {
      (await FxEngine.CallEffectHandler(142, tgt, r32($f0), false));
    }
  } else {
    (await CharDisp.PrintNameString(tgt, "smashes them flat", 10, true));
  }
  S.sp = $sp;
}

export async function SpellCureCriticalWounds() {
  if (U8[146160] === 0) {
    return;
  }
  if ((await FxEngine.RestoreHitPoints(r32(146161), Dice.RollDice(3, 8) + 3, false))) {
    (await CharDisp.PrintHpRestoreMsg(r32(146161)));
  }
}

export async function SpellCauseCriticalWounds() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(3, 8) + 3, 8, ""));
}

export async function SpellDispelEvil() {
  (await FxEngine.AddEffectWithMessage(r32(143749), 143, CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), false, false, false, ""));
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is affected"));
}

export async function SpellFlameStrike() {
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(6, 8), 9, ""));
}

export async function SpellRaiseDead() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0;
  tgt = r32(146161);
  if (tgt === 0) {
    { S.sp = $sp; return; }
  }
  if ((U8[tgt + 268] === 6) && CharHlp.HasEffect(tgt, 55, $f0)) {
    (await CharDisp.PrintNameString(tgt, "is still poisoned", 10, true));
  } else if ((((U8[tgt + 268] === 6) || (U8[tgt + 268] === 1)) && (U8[tgt + 20] > 0)) && (I8[tgt + 46] !== 2)) {
    U8[144903] = 1;
    (await FxEngine.RemoveEffect(tgt, 32, 0));
    if (Dice.RollDice(1, 100) > AbilAdj.ConResurrectionSurvival(U8[tgt + 20])) {
      U8[144903] = 0;
      U8[tgt + 268] = 8;
      U8[tgt + 269] = 0;
      U8[tgt + 283] = 0;
      (await CharDisp.PrintNameString(tgt, "does not survive", 10, true));
    } else {
      (await FxEngine.RemoveEffect(tgt, 55, 0));
      U8[144903] = 0;
      U8[tgt + 268] = 0;
      U8[tgt + 269] = 1;
      if (U8[tgt + 20] > 3) {
        ClassCal.LoseConstitution(tgt);
      }
      U8[tgt + 283] = 1;
      Stats.Count(tgt, 6, 1);
      (await CharDisp.PrintNameString(tgt, "is raised", 10, true));
    }
    (await CharDisp.RedrawPartyOutOfCombat());
  } else {
    (await CharDisp.PrintNameString(tgt, "is unaffected", 10, true));
  }
  S.sp = $sp;
}

export async function SpellSlayLiving() {
  let tgt: number = 0;
  tgt = r32(146161);
  if (tgt === 0) {
    return;
  }
  U8[144898] = 8;
  U8[144897] = 1;
  U8[144896] = 0;
  (await FxEngine.TriggerEffectsWithCondition(9, tgt));
  if ((U8[144897] === 0) || (U8[tgt + 159] === 4)) {
    (await CharDisp.PrintNameString(tgt, "is unaffected", 10, true));
  } else if (!(await FxEngine.RollSavingThrow(tgt, 0, 0))) {
    (await EffHndlr.InflictStatusMsg(tgt, 6, "is slain"));
  } else {
    (await FxEngine.InflictNonWeaponDamage(tgt, Dice.RollDamageDice(2, 8) + 1, 0, false));
  }
  U8[144898] = 0;
}

export async function SpellEntangle() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0, tgt: number = 0, saved: boolean = false;
  U8[144904] = 1;
  if (r16(r32(141147) + 460) !== 0) {
    (await CharDisp.PrintNameString(r32(143749), "finds no plants here", 10, true));
    { S.sp = $sp; return; }
  }
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      tgt = r32(i * 4 + 146157);
      if (CharHlp.HasEffect(tgt, 156, $f0)) {
        (await CharDisp.PrintNameString(tgt, "is already entangled", 10, true));
      } else {
        saved = (await FxEngine.RollSavingThrow(tgt, 4, 0));
        if (saved) {
          (await FxEngine.AddEffectWithMessage(tgt, 156, CalcSpellDuration(U8[144900]), 1, false, false, false, "is slowed by the plants"));
        } else {
          (await FxEngine.AddEffectWithMessage(tgt, 156, CalcSpellDuration(U8[144900]), 0, false, false, false, "is entangled"));
        }
        if (CharHlp.HasEffect(tgt, 156, $f0) && (r32(tgt + 264) !== 0)) {
          if (saved) {
            U8[r32(tgt + 264) + 6] = Math.trunc(U8[r32(tgt + 264) + 6] / 2);
          } else {
            U8[r32(tgt + 264) + 6] = 0;
          }
        }
      }
    }
  }
  S.sp = $sp;
}

export async function SpellFaerieFire() {
  (await ApplyEffectToTargets(0, "is outlined"));
}

export async function SpellInvisibilityToAnimals() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is hidden from animals"));
}

export async function SpellCharmMonsters() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let i: number = 0;
  (await ApplyEffectToTargets(0, "is charmed"));
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      if (CharHlp.HasEffect(r32(i * 4 + 146157), 11, $f0)) {
        (await FxEngine.CallEffectHandler(11, r32(i * 4 + 146157), r32($f0), false));
      }
    }
  }
  S.sp = $sp;
}

export async function SpellConfusion() {
  let i: number = 0, most: number = 0, tgt: number = 0;
  U8[144904] = 1;
  most = Dice.RollDice(2, 8) & 255;
  if (U8[146160] > most) {
    U8[146160] = most;
  }
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      tgt = r32(i * 4 + 146157);
      (await FxEngine.AddEffectWithMessage(tgt, 146, CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), false, true, (await FxEngine.RollSavingThrow(tgt, 4, 0)), "is confused"));
    }
  }
}

export async function SpellDimensionDoor() {
  let caster: number = 0, x: number = 0, y: number = 0;
  caster = r32(143749);
  if ((U8[141176] !== 5) || (CbtMap.CombatSlot(caster) === 0)) {
    return;
  }
  x = CbtMap.CombatCellX(caster) << 24 >> 24;
  y = CbtMap.CombatCellY(caster) << 24 >> 24;
  if (CbtMap.IsValidCreatureLoc(caster, I8[240657], I8[240658], true)) {
    (await FxEngine.RemoveEffect(caster, 58, 0));
    (await CbtMap.RedrawArenaCell(x, y));
    (await CbtMap.DisplayMapViewCentered(caster, 3, false));
    (await CharDisp.PrintNameString(caster, "teleports", 10, true));
  } else {
    if (CbtMap.IsValidCreatureLoc(caster, x, y, false)) {
    }
    (await CbtMap.RedrawArenaCell(x, y));
    (await CharDisp.PrintNameString(caster, "cannot teleport there", 10, true));
  }
}

export async function SpellFear() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let caster: number = 0, tgt: number = 0, i: number = 0;
  caster = r32(143749);
  U8[144904] = 1;
  CollectConeTargets(CbtMap.CombatCellX(caster), CbtMap.CombatCellY(caster), I8[240657], I8[240658], 3, 6);
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    tgt = r32(i * 4 + 146157);
    if (!(await FxEngine.RollSavingThrow(tgt, 4, 0))) {
      (await FxEngine.AddEffectWithMessage(tgt, 148, CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), true, true, false, "runs in terror"));
      if (CharHlp.HasEffect(tgt, 148, $f0)) {
        EffHndlr.StartFear(tgt);
      }
    } else {
      (await CharDisp.PrintNameString(tgt, "is unaffected", 10, true));
    }
  }
  S.sp = $sp;
}

export async function SpellFireShield() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0, done: boolean = false, own: number = 0, other: number = 0, minutes: number = 0, lvl: number = 0;
  done = false;
  do {
    if (U8[r32(143749) + 271] !== 0) {
      if (Dice.RollDice(1, 2) === 1) {
        ch = 72;
      } else {
        ch = 67;
      }
    } else {
      ch = (await MenuCore.MenuHorizontal("flame type: ", "Hot Cold", 13, 10, 15, false, false, $f0)) & 255;
    }
    if ((ch === 72) || (ch === 67)) {
      if (ch === 72) {
        own = 149;
        other = 150;
      } else {
        own = 150;
        other = 149;
      }
      minutes = CalcSpellDuration(U8[144900]) & 65535;
      lvl = CharHlp.GetCasterLevel(U8[144900]) & 255;
      (await FxEngine.RemoveEffect(r32(143749), other, 0));
      (await FxEngine.AddEffectWithMessage(r32(143749), own, minutes, lvl, false, false, false, "is protected"));
      (await FxEngine.AddEffectWithMessage(r32(143749), 151, minutes, lvl, false, false, false, ""));
      done = true;
    } else if ((await MenuCore.YesNoMenu("Abort spell? ", 13, 10, 15)) === 89) {
      done = true;
    }
  } while (!(done));
  S.sp = $sp;
}

export async function SpellFumble() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0;
  tgt = r32(146161);
  if (tgt === 0) {
    { S.sp = $sp; return; }
  }
  if (!(await FxEngine.RollSavingThrow(tgt, 4, 0))) {
    (await FxEngine.AddEffectWithMessage(tgt, 152, CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), false, false, false, "is clumsy"));
    if (CharHlp.HasEffect(tgt, 152, $f0)) {
      (await FxEngine.CallEffectHandler(152, tgt, r32($f0), false));
    }
  } else {
    (await FxEngine.AddEffectWithMessage(tgt, 42, CalcSpellDuration(U8[144900]), CharHlp.GetCasterLevel(U8[144900]), false, false, false, "is slowed"));
  }
  S.sp = $sp;
}

export async function SpellIceStorm() {
  U8[144904] = 1;
  (await ResolveSpell(U8[144900], 0, false, Dice.RollDamageDice(3, 10), 10, ""));
}

export async function SpellMinorGlobe() {
  (await ResolveSpell(U8[144900], 0, false, 0, 0, "is protected"));
}

export async function SpellCloudkill() {
  (await LayCloud(91, 157, "Creates a poisonous cloud"));
}

export async function ConsiderCloudkill(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let killed: boolean = false;
  if ((U8[creature + 269] === 0) || FxEngine.CloudkillProof(creature)) {
    { S.sp = $sp; return; }
  }
  if (!CbtMap.ProbeTerrain(creature, 8, 66)) {
    { S.sp = $sp; return; }
  }
  killed = false;
  switch (FxEngine.CloudkillFate(I8[creature + 115], $f0)) {
    case 0: {
      killed = true;
      break;
    }
    case 1: {
      if ((await FxEngine.RollSavingThrow(creature, 0, I8[$f0] + AbilAdj.ConPoisonSave(U8[creature + 20])))) {
        (await CharDisp.PrintNameString(creature, "is Unaffected", 10, true));
      } else {
        killed = true;
      }
      break;
    }
  }
  if (killed) {
    (await CharDisp.PrintNameString(creature, "is Poisoned", 10, false));
    (await TextRend.PauseOnly());
    FxEngine.AddEffect(creature, 55, 0, 255, false);
    (await EffHndlr.InflictStatusMsg(creature, 6, "is killed"));
  }
  S.sp = $sp;
}

export async function SpellConeOfCold() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let p: number = 0, lvl: number = 0;
  p = r32(143749);
  U8[144904] = 1;
  lvl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  ConeShape(U8[144900], $f0, $f0 + 1);
  CollectConeTargets(CbtMap.CombatCellX(p), CbtMap.CombatCellY(p), I8[240657], I8[240658], U8[$f0], U8[$f0 + 1]);
  (await ResolveSpell(U8[144900], 0, false, lvl + Dice.RollDamageDice(lvl, 4), 10, ""));
  S.sp = $sp;
}

export async function SpellFeeblemind() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let tgt: number = 0, saveMod: number = 0;
  tgt = r32(146161);
  if (tgt === 0) {
    { S.sp = $sp; return; }
  }
  if (CharHlp.GetClassLevel(tgt, 32) > 0) {
    saveMod = -4;
  } else if (CharHlp.GetClassLevel(tgt, 1) > 0) {
    saveMod = 1;
  } else {
    saveMod = -2;
  }
  (await FxEngine.AddEffectWithMessage(tgt, 154, 0, CharHlp.GetCasterLevel(U8[144900]), false, true, (await FxEngine.RollSavingThrow(tgt, 4, saveMod)), "is stupid"));
  if (CharHlp.HasEffect(tgt, 154, $f0)) {
    (await FxEngine.CallEffectHandler(154, tgt, r32($f0), false));
  }
  S.sp = $sp;
}

export function CollectConeTargets(ox: number, oy: number, tx: number, ty: number, rays: number, reach: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 129);
  WalkCone(ox, oy, tx, ty, rays, reach, false, $f0);
  S.sp = $sp;
}

export function TraceCone(ox: number, oy: number, tx: number, ty: number, rays: number, reach: number, cells: number) {
  WalkCone(ox, oy, tx, ty, rays, reach, true, cells);
}

export function ConeShape(spell: number, rays: number, reach: number) {
  if (spell === 84) {
    U8[rays] = 3;
  } else {
    U8[rays] = 2;
  }
  if (CharHlp.SpellArea(spell, reach) === 6) {
  }
}

export async function DragonBreathHandler(creature: number, p: number, removed: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let x: number = 0, y: number = 0;
  if (U8[146459] !== 0) {
    if (Dice.RollDice(1, 100) <= 50) {
      { S.sp = $sp; return; }
    }
  }
  x = CbtMap.CombatCellX(creature) << 24 >> 24;
  y = CbtMap.CombatCellY(creature) << 24 >> 24;
  (await CharDisp.PrintNameString(creature, "Breathes!", 10, true));
  Bestiary.Learn(creature, 0, 54);
  (await rt.FT[r32(145644)](51, true, $f0));
  U8[240657] = x + Pathing.SignOf(I8[240657] - x);
  U8[240658] = y + Pathing.SignOf(I8[240658] - y);
  if (I8[240657] === (x + 1)) {
    U8[240657] = I8[240657] + 1;
  }
  if (I8[240658] === (y + 1)) {
    U8[240658] = I8[240658] + 1;
  }
  (await FxEngine.RemoveInvisibility(creature));
  (await CharDisp.BuildIconFacings(19));
  (await CharDisp.CombatAnimateMovingIcon(x, y, I8[240657], I8[240658], 4, 50));
  (await LightningAttackAt(I8[240657], I8[240658], U8[creature + 50], 3, $f0));
  (await LightningPath(10, U8[creature + 50], 3, false));
  if (U8[p + 3] > 253) {
    U8[p + 3] = U8[p + 3] - 1;
  } else {
    (await FxEngine.RemoveEffect(creature, 88, p));
  }
  U8[$f0] = CharHlp.EndActions(creature) ? 1 : 0;
  S.sp = $sp;
}

export async function SpellMenu(menuType: number, selType: number, idx: number, notEmpty: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let $r0: number = 0;
  $r0 = (await ChooseSpell(menuType, selType, idx, notEmpty, $f0)) & 255;
  S.sp = $sp;
  return $r0;
}

export async function CastSpellMenu(idx: number, notEmpty: number, scroll: number) {
  let $r0: number = 0;
  $r0 = (await ChooseSpell(7, 1, idx, notEmpty, scroll)) & 255;
  return $r0;
}

export async function UseItemSpell(item: number, spell: number, announce: boolean, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  if ((spell < 1) || (spell > 128)) {
    U8[done] = false ? 1 : 0;
    { S.sp = $sp; return; }
  }
  if ((CharHlp.ItemReadable(item) && (U8[141176] !== 5)) && (U8[spell * 16 + 136513] === 0)) {
    ShowCombatOnlySpell(spell);
    U8[done] = (await MenuCore.YesNoMenu("Use it? ", 13, 15, 10)) === 89 ? 1 : 0;
    (await CharDisp.ClearMessageWindow());
    if ((U8[done] !== 0)) {
      (await RemoveSpellFromScroll(r32(143749), item, spell));
    }
    { S.sp = $sp; return; }
  }
  if ((U8[141176] === 5) && (U8[r32(143749) + 271] === 0)) {
    (await CharDisp.DisplayCombatInterface());
  }
  if (!CharHlp.ItemReadable(item)) {
    (await CharDisp.PrintNameString(r32(143749), "uses an item", 10, false));
    if (U8[141176] === 5) {
      TextRend.DisplayString(0, 23, 10, "Item:");
      CharDisp.PrintItemLabel(item, 5, 23);
    } else {
      CharDisp.PrintItemLabel(item, 1, 22);
    }
    (await TextRend.PauseOnly());
    (await CharDisp.ClearMessageWindow());
  }
  U8[146457] = true ? 1 : 0;
  if (announce) {
    (await PrintCastSpellMsg(r32(143749), "casts", spell));
  }
  U8[$f0] = false ? 1 : 0;
  (await CastSpell(spell, U8[r32(143749) + 271] !== 0, false, $f0));
  U8[146457] = false ? 1 : 0;
  U8[done] = (U8[$f0] !== 0) ? 1 : 0;
  if (U8[141176] === 5) {
    if (U8[spell * 16 + 136517] !== 0) {
      U8[done] = CharHlp.EndActions(r32(143749)) ? 1 : 0;
    }
  }
  if ((U8[$f0] !== 0)) {
    (await SpendItemSpell(r32(143749), item, spell));
  }
  S.sp = $sp;
}

export async function SpendItemSpell(user: number, item: number, spell: number) {
  if (CharHlp.ItemReadable(item)) {
    (await RemoveSpellFromScroll(user, item, spell));
  } else if (U8[item + 60] > 0) {
    if (U8[item + 57] > 1) {
      U8[item + 57] = U8[item + 57] - 1;
    } else {
      U8[item + 60] = U8[item + 60] - 1;
      if (U8[item + 60] === 0) {
        (await CharHlp.RemoveItem(user, item));
      }
    }
  }
}

export async function CastItemSpellOn(user: number, item: number, spell: number, target: number) {
  let caster: number = 0;
  if ((spell < 1) || (spell > 128)) {
    return;
  }
  caster = r32(143749);
  w32(143749, user);
  w32(146161, target);
  U8[146160] = 1;
  U8[146457] = true ? 1 : 0;
  U8[144900] = spell;
  (await rt.FT[r32(spell * 4 + 145644)]());
  U8[144900] = 0;
  U8[146457] = false ? 1 : 0;
  (await SpendItemSpell(user, item, spell));
  CharHlp.RecalcStats(user);
  w32(143749, caster);
}

export async function UseItem(item: number, done: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 3);
  let spell: number = 0;
  w16($f0, -1);
  U8[146457] = false ? 1 : 0;
  spell = 0;
  if (CharHlp.ItemReadable(item)) {
    w32(248619, item);
    spell = (await SpellMenu(2, 1, $f0, $f0 + 2)) & 255;
  } else {
    spell = CharHlp.ItemSpell(item) & 255;
  }
  if (spell === 0) {
    U8[done] = false ? 1 : 0;
  } else {
    (await UseItemSpell(item, spell, false, done));
  }
  S.sp = $sp;
}

export function SpellMark(creature: number, spell: number, mark: number) {
  let id: number = 0, learnable: boolean = false, $r0: number = 0;
  $r0 = 32;
  id = spell & 127;
  if (CharHlp.IsSpell(id)) {
    switch (mark) {
      case 1: {
        if (CharHlp.KnowsSpell(creature, id)) {
          $r0 = 45;
        }
        break;
      }
      case 2: {
        if (!CharHlp.KnowsSpell(creature, id)) {
          learnable = false;
          {
            const $w1 = id * 16 + 136506;
            if ((I8[$w1 + 1] >= 1) && (I8[$w1 + 1] <= 5)) {
              switch (I8[$w1]) {
                case 0: {
                  learnable = CharHlp.GetClassLevel(creature, 1) > 0;
                  break;
                }
                case 1: {
                  learnable = CharHlp.GetClassLevel(creature, 32) > 0;
                  break;
                }
              }
            }
          }
          if (learnable) {
            $r0 = 43;
          }
        }
        break;
      }
    }
  }
  return $r0;
}

export function SpellLine(creature: number, spell: number, mark: number) {
  let $r0: string = "";
  if (spell > 127) {
    $r0 = "  *" + rS((spell & 127) * 33 + 133189);
  } else {
    $r0 = "  " + String.fromCharCode(SpellMark(creature, spell, mark)) + rS(spell * 33 + 133189);
  }
  return $r0;
}

export function LevelHeading(level: number) {
  let $r0: string = "";
  if ((level >= 1) && (level <= 9)) {
    $r0 = rS(level * 10 + 248614);
  } else {
    $r0 = "";
  }
  return $r0;
}

export function ShowCombatOnly(name_: string, kind: string) {
  TextRend.DisplayString(1, 19, 10, name_);
  TextRend.DisplayString(1, 20, 10, "is a combat-only " + kind + "...");
}

export async function WalkBolt(boltLen: number, damage: number, saveType: number, bounce: boolean, trace: boolean, cells: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 56);
  let x0: number = 0, y0: number = 0, prevX: number = 0, prevY: number = 0, sign: number = 0, valid: boolean = false, doBounce: boolean = false, budget: number = 0, savedX: number = 0, savedY: number = 0, savedMulti: number = 0;
  U8[cells] = 0;
  savedX = I8[240657];
  savedY = I8[240658];
  savedMulti = U8[144904];
  if (!trace) {
    (await CharDisp.BuildIconFacings(19));
  }
  CbtMap.GetArenaContents(I8[240657], I8[240658], $f0 + 53, $f0 + 55);
  sign = 1;
  x0 = CbtMap.CombatCellX(r32(143749)) << 24 >> 24;
  y0 = CbtMap.CombatCellY(r32(143749)) << 24 >> 24;
  doBounce = bounce;
  if (x0 === I8[240657]) {
    if (y0 === I8[240658]) {
      { S.sp = $sp; return; }
    }
  }
  budget = (boltLen * 2) & 255;
  U8[144904] = 1;
  while (budget > 0) {
    rt.fill($f0, 26, 0);
    w16($f0, I8[240657]);
    w16($f0 + 2, I8[240658]);
    w16($f0 + 4, I8[240657] + (((I8[240657] - x0) * sign) * budget));
    w16($f0 + 6, I8[240658] + (((I8[240658] - y0) * sign) * budget));
    Pathing.PathFind($f0);
    do {
      prevX = ri16($f0 + 20) << 24 >> 24;
      prevY = ri16($f0 + 22) << 24 >> 24;
      if ((ri16($f0) !== ri16($f0 + 4)) || (ri16($f0 + 2) !== ri16($f0 + 6))) {
        do {
          valid = Pathing.NextPathStep($f0);
          CbtMap.GetArenaContents(ri16($f0 + 20), ri16($f0 + 22), $f0 + 54, $f0 + 55);
          if (((trace && valid) && (U8[$f0 + 55] !== 0)) && (U8[cells] < 64)) {
            U8[cells] = U8[cells] + 1;
            U8[cells + U8[cells]] = ri16($f0 + 20);
            U8[cells + U8[cells] + 64] = ri16($f0 + 22);
          }
        } while (!(((((valid === false) || ((U8[$f0 + 54] > 0) && (U8[$f0 + 54] !== U8[$f0 + 53]))) || (U8[$f0 + 55] === 0)) || (U8[U8[$f0 + 55] * 3 + 132942] > 1)) || (U8[$f0 + 24] >= budget)));
      }
      U8[$f0 + 53] = U8[$f0 + 54];
      if (U8[$f0 + 55] === 0) {
        budget = 0;
      }
      if (trace) {
        U8[$f0 + 52] = false ? 1 : 0;
        if (U8[$f0 + 55] > 0) {
          U8[$f0 + 52] = U8[U8[$f0 + 55] * 3 + 132942] === 255 ? 1 : 0;
        }
      } else {
        (await CharDisp.CombatAnimateMovingIcon(prevX, prevY, ri16($f0 + 20), ri16($f0 + 22), 4, 50));
        (await LightningAttackAt(ri16($f0 + 20), ri16($f0 + 22), damage, saveType, $f0 + 52));
      }
      if ((U8[$f0 + 52] !== 0)) {
        U8[240657] = ri16($f0 + 20);
        U8[240658] = ri16($f0 + 22);
        rt.fill($f0 + 26, 26, 0);
        w16($f0 + 26, I8[240657]);
        w16($f0 + 28, I8[240658]);
        w16($f0 + 30, x0);
        w16($f0 + 32, y0);
        Pathing.PathFind($f0 + 26);
        while (Pathing.NextPathStep($f0 + 26)) {
        }
        if (doBounce) {
          if (U8[$f0 + 50] <= 8) {
            U8[$f0 + 24] = U8[$f0 + 24] + 8;
          }
        }
        sign = (0 - sign) << 24 >> 24;
        doBounce = false;
        U8[$f0 + 53] = 0;
      }
      if (U8[$f0 + 24] < budget) {
        budget = (budget - U8[$f0 + 24]) & 255;
      } else {
        budget = 0;
      }
    } while (!((U8[$f0 + 52] !== 0) || (budget === 0)));
  }
  U8[144904] = 0;
  if (trace) {
    U8[240657] = savedX;
    U8[240658] = savedY;
    U8[144904] = savedMulti;
  }
  S.sp = $sp;
}

export function BoltShape(spell: number, boltLen: number, bounce: number) {
  U8[bounce] = spell !== 60 ? 1 : 0;
  if ((U8[bounce] !== 0)) {
    U8[boltLen] = 8;
  } else {
    U8[boltLen] = 3;
  }
}

export function LineBefore(n: number) {
  let p: number = 0, k: number = 0, lines: number = 0, $r0: number = 0;
  p = r32(248073);
  k = 0;
  lines = 0;
  while ((p !== 0) && (k < n)) {
    if (U8[p + 41] === 0) {
      lines = (lines + 1) << 16 >> 16;
    }
    p = r32(p + 42);
    k = (k + 1) << 16 >> 16;
  }
  $r0 = lines;
  return $r0;
}

export function LineSpell(n: number) {
  let p: number = 0, line: number = 0, $r0: number = 0;
  $r0 = 0;
  p = MenuCore.FindListMember(n, r32(248073));
  if ((p !== 0) && (n >= 0)) {
    if (U8[p + 41] === 0) {
      line = LineBefore(n) << 16 >> 16;
      if (line <= 68) {
        if ((U8[248623] !== 0) || (r32(line * 4 + 248146) !== 0)) {
          $r0 = U8[line + 248077] | 256;
        } else {
          $r0 = U8[line + 248077];
        }
      }
    }
  }
  return $r0;
}

export async function DrawListWindows(windowRow: number, memorize: boolean) {
  (await Border.DrawWindow(1, 3, 38, windowRow, 0, 0, ""));
  if (memorize) {
    (await Border.DrawWindow(1, 18, 38, 22, 0, 0, ""));
    if (r32(240653) !== 0) {
      (await rt.FT[r32(240653)]());
    }
  }
}

export async function SpellPage(idx: number, lastRow: number, windowRow: number, memorize: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 140);
  let p: number = 0, n: number = 0, count: number = 0, rows: number = 0;
  count = 0;
  w16($f0 + 138, 0);
  p = r32(248073);
  n = 0;
  while (p !== 0) {
    if ((U8[p + 41] === 0) && (count <= 68)) {
      if (n === ri16(idx)) {
        w16($f0 + 138, count);
      }
      w16($f0 + count * 2, LineSpell(n));
      count = (count + 1) << 16 >> 16;
    }
    p = r32(p + 42);
    n = (n + 1) << 16 >> 16;
  }
  (await SpellInf.ShowPage($f0, count, $f0 + 138));
  p = r32(248073);
  n = 0;
  while ((p !== 0) && ((U8[p + 41] !== 0) || (LineBefore(n) < ri16($f0 + 138)))) {
    p = r32(p + 42);
    n = (n + 1) << 16 >> 16;
  }
  if (p !== 0) {
    w16(idx, n);
  }
  rows = MenuCore.PageRows(r32(248073), 3, lastRow, true) << 16 >> 16;
  if (ri16(idx) < ri16(145641)) {
    w16(145641, ri16(idx));
  }
  if (ri16(idx) > ((ri16(145641) + rows) - 1)) {
    w16(145641, (ri16(idx) - rows) + 1);
  }
  (await DrawListWindows(windowRow, memorize));
  S.sp = $sp;
}

export function AddSpellToList(creature: number, spell: number, mark: number) {
  let p: number = 0, count: number = 0, lastLevel: number = 0;
  p = r32(248073);
  if (r32(248073) === 0) {
    p = rt.getMem(46);
    w32(248073, p);
    lastLevel = 0;
    count = 0;
  } else {
    count = 1;
    while (r32(p + 42) !== 0) {
      if (U8[p + 41] === 0) {
        count = (count + 1) << 24 >> 24;
      }
      p = r32(p + 42);
    }
    if (count > 68) {
      return;
    }
    lastLevel = I8[U8[(count - 1) + 248077] * 16 + 136507];
    w32(p + 42, rt.getMem(46));
    p = r32(p + 42);
  }
  w32(p + 42, 0);
  if (I8[(spell & 127) * 16 + 136507] !== lastLevel) {
    wS(p, 40, LevelHeading(I8[(spell & 127) * 16 + 136507]));
    U8[p + 41] = 1;
    w32(p + 42, rt.getMem(46));
    p = r32(p + 42);
    w32(p + 42, 0);
  }
  wS(p, 40, SpellLine(creature, spell, mark));
  U8[p + 41] = 0;
  U8[count + 248077] = spell & 127;
}

export function AddScrollSpells(creature: number, forScribe: boolean, mark: number, lvl: number) {
  let i: number = 0, id: number = 0;
  if (CharHlp.ScrollLegible(creature, r32(248619))) {
    for (let $i1 = 1; $i1 <= 3; $i1++) {
      i = $i1;
      id = CharHlp.ScrollSpellAt(r32(248619), i) & 255;
      if ((id !== 0) && (!forScribe || (U8[r32(248619) + i + 59] > 128))) {
        if (I8[id * 16 + 136507] === lvl) {
          AddSpellToList(creature, U8[r32(248619) + i + 59], mark);
          if (U8[248618] <= 48) {
            w32(U8[248618] * 4 + 248422, r32(248619));
            U8[248618] = U8[248618] + 1;
          }
        }
      }
    }
  }
}

export function AddAllScrollSpells(creature: number, forScribe: boolean, mark: number, lvl: number) {
  w32(248619, r32(creature + 200));
  while (r32(248619) !== 0) {
    if (CharHlp.ItemReadable(r32(248619))) {
      AddScrollSpells(creature, forScribe, mark, lvl);
    }
    w32(248619, r32(r32(248619) + 42));
  }
}

export function AddCopies(copies: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 21);
  let p: number = 0;
  if ((copies < 2) || (r32(248073) === 0)) {
    { S.sp = $sp; return; }
  }
  p = r32(248073);
  while (r32(p + 42) !== 0) {
    p = r32(p + 42);
  }
  wS($f0, 20, " (x" + StrUtil.NumStr(copies) + ")");
  if ((U8[p] + U8[$f0]) > 38) {
    U8[p] = (38 - U8[$f0]) & 255;
  }
  wS(p, 40, rS(p) + rS($f0));
  S.sp = $sp;
}

export function ScrollSpellCount(item: number) {
  let i: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    if (CharHlp.ScrollSpellAt(item, i) !== 0) {
      n = (n + 1) & 255;
    }
  }
  $r0 = n;
  return $r0;
}

export function AddScrollLine(creature: number, item: number, spell: number, copies: number, lines: number) {
  let p: number = 0;
  if (U8[lines] <= 68) {
    AddSpellToList(creature, spell, 0);
    w32(U8[lines] * 4 + 248146, item);
    U8[lines] = U8[lines] + 1;
    p = r32(248073);
    while (r32(p + 42) !== 0) {
      p = r32(p + 42);
    }
    if (U8[p] >= 3) {
      U8[p + 3] = 45;
    }
    AddCopies(copies);
  }
}

export function MemorizedCopies(creature: number, i: number) {
  let j: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  for (let $i1 = 0; $i1 <= 47; $i1++) {
    j = $i1;
    if (CharHlp.MemorizedAt(creature, j) === CharHlp.MemorizedAt(creature, i)) {
      if (j < i) {
        $r0 = 0;
        return $r0;
      }
      n = (n + 1) & 255;
    }
  }
  $r0 = n;
  return $r0;
}

export function AddMemorizedSpell(creature: number, i: number, lines: number) {
  let copies: number = 0;
  copies = MemorizedCopies(creature, i) & 255;
  if ((copies === 0) || (U8[lines] > 68)) {
    return;
  }
  AddSpellToList(creature, CharHlp.MemorizedAt(creature, i), 0);
  U8[lines] = U8[lines] + 1;
  AddCopies(copies);
}

export function AddAvailableSpells(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 38);
  let lvl: number = 0, i: number = 0, id: number = 0, memOk: boolean = false, scrollOk: boolean = false, item: number = 0;
  rt.wSet($f0 + 6, 0, 32, rt.setR());
  memOk = (U8[141176] !== 5) || (U8[r32(creature + 264) + 1] !== 0);
  scrollOk = CharHlp.CanUseItems(creature);
  U8[$f0] = 0;
  for (let $i1 = 1; $i1 <= 7; $i1++) {
    lvl = $i1;
    if (memOk) {
      for (let $i2 = 0; $i2 <= 47; $i2++) {
        i = $i2;
        id = CharHlp.MemorizedAt(creature, i) & 255;
        if (CharHlp.IsSpell(id)) {
          if (I8[id * 16 + 136507] === lvl) {
            AddMemorizedSpell(creature, i, $f0);
          }
        }
      }
    }
    if (scrollOk) {
      item = r32(creature + 200);
      while (item !== 0) {
        if (CharHlp.CastableScroll(creature, item)) {
          for (let $i4 = 1; $i4 <= 3; $i4++) {
            i = $i4;
            id = CharHlp.ScrollSpellAt(item, i) & 255;
            if ((id !== 0) && !rt.inM($f0 + 6, 0, 32, id)) {
              if (I8[id * 16 + 136507] === lvl) {
                rt.wSet($f0 + 6, 0, 32, rt.sUnion(rt.rSet($f0 + 6, 0, 32), rt.setR(id, id)));
                FindScrollCopies(creature, id, $f0 + 5, $f0 + 1);
                AddScrollLine(creature, r32($f0 + 1), id, U8[$f0 + 5], $f0);
              }
            }
          }
        }
        item = r32(item + 42);
      }
    }
  }
  S.sp = $sp;
}

export function SlotLevel(creature: number, i: number) {
  let id: number = 0, $r0: number = 0;
  id = CharHlp.MemorizedAt(creature, i) & 127;
  if (id === 0) {
    $r0 = 0;
  } else {
    $r0 = I8[id * 16 + 136507];
  }
  return $r0;
}

export function CalcSpellDuration(spell: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 5);
  let m: number = 0, $r0: number = 0;
  CharHlp.SpellDuration(spell, $f0);
  m = r16($f0 + 2);
  if (U8[$f0] > 0) {
    m = (m + Dice.RollDice(U8[$f0], U8[$f0 + 1])) & 65535;
  }
  $r0 = (m * U8[$f0 + 4]) & 65535;
  S.sp = $sp;
  return $r0;
}

export async function ResolveSpell(spell: number, eff: number, onRemove: boolean, damage: number, elem: number, msg: string) {
  let effLevel: number = 0, i: number = 0, tgt: number = 0, saved: boolean = false, saveResult: number = 0;
  saveResult = U8[spell * 16 + 136514];
  U8[144898] = 0;
  if (U8[146160] === 0) {
    return;
  }
  if (damage > 0) {
    U8[144898] = elem;
  }
  if (eff === 0) {
    effLevel = CharHlp.GetCasterLevel(spell) & 255;
  } else {
    effLevel = eff;
  }
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      tgt = r32(i * 4 + 146157);
      if (saveResult === 0) {
        saved = false;
      } else {
        saved = (await FxEngine.RollSavingThrow(tgt, U8[spell * 16 + 136515], 0));
      }
      if (U8[spell * 16 + 136508] === 255) {
        CharHlp.RecalcStats(tgt);
        (await FxEngine.TriggerEffectsWithCondition(11, tgt));
        if (!(await FxEngine.AttackRoll(r32(143749), tgt, U8[tgt + 273]))) {
          damage = 0;
          saved = true;
        }
      }
      if (damage > 0) {
        (await FxEngine.InflictNonWeaponDamage(tgt, damage, saveResult, saved));
      }
      if (U8[spell * 16 + 136516] > 0) {
        (await FxEngine.AddEffectWithMessage(tgt, U8[spell * 16 + 136516], CalcSpellDuration(spell), effLevel, onRemove, saveResult === 1 || saveResult === 3, saved, msg));
      }
    }
  }
  U8[144898] = 0;
}

export async function CastOneSide(side: number, msg: string) {
  let i: number = 0;
  U8[144904] = 1;
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      if ((CharHlp.Team(r32(i * 4 + 146157)) !== side) || (((U8[144900] === 1) && (U8[141176] === 5)) && (CbtMap.CountTargets(r32(i * 4 + 146157), 1) > 0))) {
        w32(i * 4 + 146157, 0);
      }
    }
  }
  (await ResolveSpell(U8[144900], 0, false, 0, 0, msg));
}

export async function StandUpOrWake(tgt: number) {
  if (!(await FxEngine.ReviveDeadCreature(tgt, U8[tgt + 283]))) {
    FxEngine.AddEffect(tgt, 78, 1, 0, true);
  }
}

export async function LayCloud(spell: number, effId: number, msg: string) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 10);
  let node: number = 0, j: number = 0, myClouds: number = 0, cl: number = 0, k: number = 0, first: boolean = false;
  U8[144904] = 1;
  if (CharHlp.SpellArea(spell, $f0 + 9) !== 4) {
    U8[$f0 + 9] = 2;
  }
  cl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  myClouds = FxEngine.FreeCloudNumber(r32(143749)) & 255;
  node = CbtMap.AppendCloud();
  FxEngine.AddEffect(r32(143749), effId, cl, FxEngine.CloudStrength(cl, myClouds), true);
  w32(node, r32(143749));
  U8[node + 28] = myClouds;
  U8[node + 26] = I8[240657];
  U8[node + 27] = I8[240658];
  U8[node + 30] = U8[$f0 + 9];
  U8[node + 29] = CbtMap.CloudTerrain(spell);
  CbtMap.SpreadCloud(node, $f0);
  (await CharDisp.PrintNameString(r32(143749), msg, 10, false));
  (await CbtMap.ScrollView(I8[240657], I8[240658], 255, 8));
  (await TextRend.PauseOnly());
  (await CharDisp.ClearMessageWindow());
  for (let $i1 = 1, $e1 = U8[$f0 + 9] * U8[$f0 + 9]; $i1 <= $e1; $i1++) {
    k = $i1;
    if (U8[$f0 + k - 1] > 0) {
      first = true;
      for (let $i2 = 1, $e2 = k - 1; $i2 <= $e2; $i2++) {
        j = $i2;
        if (U8[$f0 + j - 1] === U8[$f0 + k - 1]) {
          first = false;
        }
      }
      if (first) {
        if (U8[node + 29] === 66) {
          (await ConsiderCloudkill(r32(U8[$f0 + k - 1] * 4 + 144292)));
        } else {
          (await FxEngine.ConsiderStinkingCloud(r32(U8[$f0 + k - 1] * 4 + 144292)));
        }
      }
    }
  }
  S.sp = $sp;
}

export async function CureDiseaseOf(tgt: number) {
  let $r0: boolean = false;
  $r0 = false;
  if ((await FxEngine.RemoveDiseases(tgt))) {
    (await CharDisp.PrintNameString(tgt, "is Cured", 10, true));
    $r0 = true;
  }
  return $r0;
}

export async function HasteSlowLogic(removeId: number, side: number, msg: string) {
  let cl: number = 0, i: number = 0;
  U8[144904] = 1;
  cl = CharHlp.GetCasterLevel(U8[144900]) & 255;
  for (let $i1 = 1, $e1 = U8[146160]; $i1 <= $e1; $i1++) {
    i = $i1;
    if (((r32(i * 4 + 146157) !== 0) && (CharHlp.Team(r32(i * 4 + 146157)) === side)) && (cl > 0)) {
      cl = (cl - 1) & 255;
      if ((await FxEngine.RemoveEffectWithMessage(r32(i * 4 + 146157), removeId))) {
        w32(i * 4 + 146157, 0);
      }
    } else {
      w32(i * 4 + 146157, 0);
    }
  }
  (await ResolveSpell(U8[144900], 0, false, 0, 0, msg));
  for (let $i2 = 1, $e2 = U8[146160]; $i2 <= $e2; $i2++) {
    i = $i2;
    if (r32(i * 4 + 146157) !== 0) {
      U8[144899] = U8[r32(i * 4 + 146157) + 162];
      U8[144902] = 0;
      (await FxEngine.TriggerEffectsWithCondition(18, r32(i * 4 + 146157)));
    }
  }
}

export async function LightningAttackAt(x: number, y: number, damage: number, saveType: number, blocked: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 2);
  let tgt: number = 0;
  U8[blocked] = false ? 1 : 0;
  CbtMap.GetArenaContents(x, y, $f0, $f0 + 1);
  if (U8[$f0 + 1] > 0) {
    if (U8[U8[$f0 + 1] * 3 + 132942] === 255) {
      U8[blocked] = true ? 1 : 0;
    }
  }
  if (U8[$f0] > 0) {
    tgt = r32(U8[$f0] * 4 + 144292);
    U8[144898] = 12;
    (await FxEngine.InflictNonWeaponDamage(tgt, damage, 2, (await FxEngine.RollSavingThrow(tgt, saveType, 0))));
    (await CharDisp.BuildIconFacings(19));
    U8[144898] = 0;
  }
  S.sp = $sp;
}

export async function LightningPath(boltLen: number, damage: number, saveType: number, bounce: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 129);
  (await WalkBolt(boltLen, damage, saveType, bounce, false, $f0));
  S.sp = $sp;
}

export async function ApplyEffectToTargets(saveMod: number, msg: string) {
  let tgt: number = 0, saved: boolean = false, saveNegates: boolean = false, i: number = 0, strength: number = 0;
  for (let $i1 = U8[146160]; $i1 >= 1; $i1--) {
    i = $i1;
    if (r32(i * 4 + 146157) !== 0) {
      tgt = r32(i * 4 + 146157);
      if (i < U8[146160]) {
        (await SoundDrv.SoundSetAutoStop(0));
        (await SoundDrv.SoundEffect(r16(132891), 32));
        (await CharDisp.AnimateBetween(r32(143749), tgt, 18, 4, 30));
        (await SoundDrv.SoundSetAutoStop(10));
      }
      if (U8[144900] === 79) {
        saved = false;
        saveNegates = false;
      } else {
        saved = (await FxEngine.RollSavingThrow(tgt, U8[U8[144900] * 16 + 136515], saveMod));
        let $t2;
        saveNegates = ($t2 = U8[U8[144900] * 16 + 136514], $t2 === 1 || $t2 === 3);
      }
      strength = CharHlp.GetCasterLevel(U8[144900]) & 255;
      if (U8[144900] === 81) {
        strength = (rt.mul(CharHlp.Team(r32(143749)), 128) + strength) & 255;
      }
      (await FxEngine.AddEffectWithMessage(tgt, U8[U8[144900] * 16 + 136516], CalcSpellDuration(U8[144900]), strength, U8[144900] === 81, saveNegates, saved, msg));
    }
  }
}

export function SideDir(dir: number, left: boolean) {
  let $r0: number = 0;
  if (left) {
    $r0 = ((dir + 6) + (dir & 1)) & 7;
  } else {
    $r0 = ((dir + 2) - (dir & 1)) & 7;
  }
  return $r0;
}

export function WalkCone(ox: number, oy: number, tx: number, ty: number, rays: number, reach: number, trace: boolean, cells: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 115);
  U8[$f0] = tx;
  U8[$f0 + 1] = ty;
  let done: boolean = false, i: number = 0, n: number = 0, lastDir: number = 0, listCount: number = 0, centerDir: number = 0, k: number = 0;
  function SetLine(ex: number, ey: number) {
    rt.fill($f0 + 2, 26, 0);
    w16($f0 + 2, ox);
    w16($f0 + 4, oy);
    w16($f0 + 6, ex);
    w16($f0 + 8, ey);
    Pathing.PathFind($f0 + 2);
  }
  function ClampCell(cx: number, cy: number) {
    if (I8[cx] > 49) {
      U8[cx] = 49;
    } else if (I8[cx] < 0) {
      U8[cx] = 0;
    }
    if (I8[cy] > 24) {
      U8[cy] = 24;
    } else if (I8[cy] < 0) {
      U8[cy] = 0;
    }
  }
  function CollectAlong(steer: boolean) {
    let j: number = 0, found: boolean = false;
    do {
      done = !Pathing.NextPathStep($f0 + 2);
      if (!done) {
        if (trace && (U8[cells] < 64)) {
          U8[cells] = U8[cells] + 1;
          U8[cells + U8[cells]] = ri16($f0 + 22);
          U8[cells + U8[cells] + 64] = ri16($f0 + 24);
        }
        CbtMap.GetArenaContents(ri16($f0 + 22), ri16($f0 + 24), $f0 + 109, $f0 + 110);
        if (U8[$f0 + 109] > 0) {
          found = false;
          for (let $i2 = 1, $e2 = listCount; $i2 <= $e2; $i2++) {
            j = $i2;
            if (U8[$f0 + j + 78] === U8[$f0 + 109]) {
              found = true;
            }
          }
          if (!found && (listCount < 30)) {
            listCount = (listCount + 1) & 255;
            U8[$f0 + listCount + 78] = U8[$f0 + 109];
          }
          if (steer) {
            centerDir = U8[$f0 + 27];
          }
        }
      }
    } while (!(done));
  }
  U8[cells] = 0;
  listCount = 0;
  if ((ox === I8[$f0]) && (oy === I8[$f0 + 1])) {
    if (!trace) {
      U8[146160] = 0;
    }
    { S.sp = $sp; return; }
  }
  n = 0;
  SetLine(I8[$f0], I8[$f0 + 1]);
  do {
    done = !Pathing.NextPathStep($f0 + 2);
    if (!done && (n <= 49)) {
      U8[$f0 + n + 28] = U8[$f0 + 27];
      n = (n + 1) & 255;
    }
  } while (!(done));
  lastDir = (n - 1) & 255;
  n = 0;
  w16($f0 + 111, reach);
  i = U8[$f0 + 26];
  done = false;
  while ((i < (reach * 2)) && !done) {
    if ((((I8[$f0] < 49) && (I8[$f0] > 0)) && (I8[$f0 + 1] < 24)) && (I8[$f0 + 1] > 0)) {
      if ((U8[$f0 + n + 28] & 1) === 0) {
        i = (i + 2) & 65535;
      } else {
        i = (i + 3) & 65535;
      }
      U8[$f0] = I8[$f0] + I8[U8[$f0 + n + 28] + 132927];
      U8[$f0 + 1] = I8[$f0 + 1] + I8[U8[$f0 + n + 28] + 132936];
      if (n === lastDir) {
        n = 0;
      } else {
        n = (n + 1) & 255;
      }
    } else {
      done = true;
    }
  }
  ClampCell($f0, $f0 + 1);
  if (Pathing.WalkLine(ox, oy, $f0, $f0 + 1, $f0 + 111, r32(144641))) {
  }
  centerDir = U8[$f0 + lastDir + 28];
  SetLine(I8[$f0], I8[$f0 + 1]);
  CollectAlong(true);
  if (rays > 1) {
    U8[$f0 + 113] = I8[$f0] + I8[SideDir(centerDir, false) + 132927];
    U8[$f0 + 114] = I8[$f0 + 1] + I8[SideDir(centerDir, false) + 132936];
    ClampCell($f0 + 113, $f0 + 114);
    SetLine(I8[$f0 + 113], I8[$f0 + 114]);
    CollectAlong(false);
    if (rays > 2) {
      U8[$f0 + 113] = I8[$f0] + I8[SideDir(centerDir, true) + 132927];
      U8[$f0 + 114] = I8[$f0 + 1] + I8[SideDir(centerDir, true) + 132936];
      ClampCell($f0 + 113, $f0 + 114);
      SetLine(I8[$f0 + 113], I8[$f0 + 114]);
      CollectAlong(false);
    }
  }
  if (trace) {
    { S.sp = $sp; return; }
  }
  U8[146160] = 0;
  rt.fill(146161, 288, 0);
  for (let $i5 = 1, $e5 = listCount; $i5 <= $e5; $i5++) {
    k = $i5;
    if (r32(U8[$f0 + k + 78] * 4 + 144292) !== r32(143749)) {
      U8[146160] = U8[146160] + 1;
      w32(U8[146160] * 4 + 146157, r32(U8[$f0 + k + 78] * 4 + 144292));
    }
  }
  S.sp = $sp;
}

export async function ChooseSpell(menuType: number, selType: number, idx: number, notEmpty: number, scroll: number) {
  let $r0: number = 0;
  U8[notEmpty] = GenerateSpellList(r32(143749), menuType) ? 1 : 0;
  if ((U8[notEmpty] !== 0)) {
    if (ri16(idx) < 0) {
      (await Border.DrawWindow(1, 1, 38, 1, 0, 0, ""));
      TextRend.DisplayCentered(1, 38, 1, 11, rS(r32(143749)) + "'s Spells");
    }
    $r0 = (await SpellSelection(selType, idx, scroll)) & 255;
  } else {
    w32(scroll, 0);
    $r0 = 0;
  }
  return $r0;
}

export function $init() {
  U8[240657] = 0;
  U8[240658] = 0;
  w32(240653, 0);
  U8[248623] = false ? 1 : 0;
}
