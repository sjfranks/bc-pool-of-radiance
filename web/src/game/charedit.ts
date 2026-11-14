// Generated from src/charedit.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Crt from './crt';
import * as Types from './types';
import * as C_STAT from './c_stat';
import * as C_ITEM from './c_item';
import * as C_KEYS from './c_keys';
import * as C_LEVEL from './c_level';
import * as C_MONEY from './c_money';
import * as C_MSG from './c_msg';
import * as C_SPELL from './c_spell';
import * as C_STATUS from './c_status';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as Border from './border';
import * as CharDisp from './chardisp';
import * as CharGen from './chargen';
import * as CharHlp from './charhlp';
import * as ChgClass from './chgclass';
import * as ClassCal from './classcal';
import * as MenuCore from './menucore';
import * as Party from './party';
import * as RandItem from './randitem';
import * as Shop from './shop';
import * as StrUtil from './strutil';
import * as TextRend from './textrend';
import * as ViewChar from './viewchar';

export const LEVEL_ROW = 4;
export const NAME_COL = 3;
export const VALUE_COL = 16;
export const MAX_LINES = 100;
export const TEMPLATE_CODE = 256;
export const PLUS_LAST = 5;
export const BRACERS_LAST = 3;
export const BRACERS_GP = 3000;

export const $at = { TEMPLATE_KINDS: 261002, BRACERS_PLUS: 261021, BRACERS_NAME: 261024 };

export async function EditMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let key: number = 0;
  if (r32(229635) === 0) {
    { S.sp = $sp; return; }
  }
  do {
    (await ViewChar.DisplayChar(r32(229635)));
    key = (await MenuCore.MenuHorizontal("", "Abilities Levels Gear Magic Health Exit", 13, 10, 15, false, false, $f0)) & 255;
    if ((U8[$f0] !== 0)) {
      if (key === 71 || key === 79 || key === 72 || key === 80) {
        Party.SelectPrevNextChar(key);
      }
    } else {
      switch (key) {
        case 65: {
          (await CharGen.ModifyCharacter(true));
          break;
        }
        case 76: {
          (await LevelsTool());
          break;
        }
        case 71: {
          (await GearTool());
          break;
        }
        case 77: {
          (await MagicTool());
          break;
        }
        case 72: {
          (await HealthTool());
          break;
        }
      }
    }
  } while (!(!(U8[$f0] !== 0) && (key === 69 || key === 0)));
  S.sp = $sp;
}

export function HeldClasses(held: number, count: number) {
  let cls: number = 0;
  U8[count] = 0;
  for (let $i1 = 0; $i1 <= 7; $i1++) {
    cls = $i1;
    if ((I8[r32(229635) + cls + 150] > 0) && ((U8[r32(229635) + 285] & (1 << cls)) === 0)) {
      U8[held + U8[count]] = cls;
      U8[count] = U8[count] + 1;
    }
  }
}

export async function LowerLevel(cls: number, clsCount: number) {
  let avg: number = 0, loss: number = 0, gave: boolean = false;
  {
    const $w1 = r32(229635);
    if (I8[$w1 + cls + 150] <= 1) {
      return;
    }
    gave = ClassCal.HitDice(r32(229635), cls) > 0;
    avg = Math.trunc(U8[cls + 217796] / 2) + 1;
    loss = Math.trunc((avg + ClassCal.ConHpPerDie(cls, U8[$w1 + 20])) / clsCount) << 16 >> 16;
    if (loss < 1) {
      loss = 1;
    }
    let $t2;
    $t2 = $w1 + cls + 150, U8[$t2] = I8[$t2] - 1;
    if (gave) {
      CharGen.SetHpMax(U8[$w1 + 50] - loss);
      if (U8[$w1 + 177] > Math.trunc(avg / clsCount)) {
        U8[$w1 + 177] = U8[$w1 + 177] - Math.trunc(avg / clsCount);
      }
    }
    if (I8[$w1 + cls + 150] === 1) {
      switch (cls) {
        case 0: {
          ClassCal.ResetClericSlots(r32(229635));
          break;
        }
        case 5: {
          ClassCal.FirstLevelSlots(r32(229635), 5);
          break;
        }
      }
    }
    U8[$w1 + 115] = 0;
    ClassCal.RecalcBaseSkills(r32(229635));
  }
  (await ChgClass.SyncClassPowers(r32(229635)));
}

export function DrawLevels(sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 9);
  let i: number = 0;
  HeldClasses($f0, $f0 + 8);
  Border.ClearBox(1, 1, 38, 22);
  CharDisp.DisplayCreatureName(r32(229635), 3, 2, false);
  for (let $i1 = 0, $e1 = U8[$f0 + 8] - 1; $i1 <= $e1; $i1++) {
    i = $i1;
    if (i === sel) {
      TextRend.DisplayStringOn(3, 4 + i, 0, 13, rS(I8[$f0 + i] * 26 + 217828));
    } else {
      TextRend.DisplayString(3, 4 + i, 10, rS(I8[$f0 + i] * 26 + 217828));
    }
    TextRend.DisplayString(16, 4 + i, 15, "level " + StrUtil.NumStr(I8[r32(229635) + I8[$f0 + i] + 150]) + " ");
  }
  TextRend.DisplayString(3, (4 + U8[$f0 + 8]) + 1, 10, "Experience");
  TextRend.DisplayString(16, (4 + U8[$f0 + 8]) + 1, 15, StrUtil.NumStr(ri32(r32(229635) + 172)) + "   ");
  TextRend.DisplayString(3, (4 + U8[$f0 + 8]) + 2, 10, "Hit points");
  TextRend.DisplayString(16, (4 + U8[$f0 + 8]) + 2, 15, StrUtil.NumStr(U8[r32(229635) + 283]) + "/" + StrUtil.NumStr(U8[r32(229635) + 50]) + "   ");
  S.sp = $sp;
}

export async function LevelsTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 51);
  let sel: number = 0, key: number = 0, cls: number = 0, xp: number = 0, code: number = 0;
  HeldClasses($f0, $f0 + 8);
  if (U8[$f0 + 8] === 0) {
    { S.sp = $sp; return; }
  }
  sel = 0;
  do {
    DrawLevels(sel);
    U8[235273] = true ? 1 : 0;
    key = (await MenuCore.MenuHorizontal("Levels: ", "Experience Done", 13, 10, 15, true, false, $f0 + 9)) & 255;
    cls = I8[$f0 + sel];
    if ((U8[$f0 + 9] !== 0)) {
      {
        const $w2 = r32(229635);
        switch (key) {
          case 80: {
            sel = ((sel + 1) % U8[$f0 + 8]) & 255;
            break;
          }
          case 72: {
            sel = (((sel + U8[$f0 + 8]) - 1) % U8[$f0 + 8]) & 255;
            break;
          }
          case 75: {
            if (I8[$w2 + cls + 150] > 1) {
              (await LowerLevel(cls, ClassCal.HpClassCount(r32(229635))));
              xp = ClassCal.LevelXp(cls, I8[$w2 + cls + 150] + 1) | 0;
              if ((xp > 0) && (ri32($w2 + 172) >= xp)) {
                w32($w2 + 172, xp - 1);
              }
            }
            break;
          }
          case 77: {
            if (I8[$w2 + cls + 150] < 9) {
              (await CharGen.GainLevels(U8[cls + 217788], false));
              if (ri32($w2 + 172) < ClassCal.LevelXp(cls, I8[$w2 + cls + 150])) {
                w32($w2 + 172, ClassCal.LevelXp(cls, I8[$w2 + cls + 150]));
              }
            }
            break;
          }
        }
      }
    } else if (key === 69) {
      wS($f0 + 10, 40, (await TextRend.ReadString("Experience: ", 10, 7)));
      xp = rt.valI(rS($f0 + 10)) | 0; code = rt.valCode.v << 16 >> 16;
      if ((code === 0) && (xp >= 0)) {
        w32(r32(229635) + 172, xp);
      }
    }
  } while (!(!(U8[$f0 + 9] !== 0) && (key === 68 || key === 0)));
  S.sp = $sp;
}

export async function HealthTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let key: number = 0;
  do {
    (await ViewChar.DisplayChar(r32(229635)));
    key = (await MenuCore.MenuHorizontal("Health: ", "Heal Status Exit", 13, 10, 15, false, false, $f0)) & 255;
    {
      const $w2 = r32(229635);
      switch (key) {
        case 72: {
          U8[$w2 + 283] = U8[$w2 + 50];
          let $t3;
          if (($t3 = U8[$w2 + 268], $t3 === 4 || $t3 === 5)) {
            U8[$w2 + 268] = 0;
          }
          let $t4;
          U8[$w2 + 269] = (($t4 = U8[$w2 + 268], $t4 === 0 || $t4 === 1) ? 1 : 0);
          break;
        }
        case 83: {
          switch (U8[$w2 + 268]) {
            case 0: {
              U8[$w2 + 268] = 4;
              break;
            }
            case 4: {
              U8[$w2 + 268] = 5;
              break;
            }
            case 5: {
              U8[$w2 + 268] = 6;
              break;
            }
            case 6: {
              U8[$w2 + 268] = 7;
              break;
            }
            case 7: {
              U8[$w2 + 268] = 8;
              break;
            }
            default: {
              U8[$w2 + 268] = 0;
            }
          }
          if (U8[$w2 + 268] === 0) {
            if (U8[$w2 + 283] === 0) {
              U8[$w2 + 283] = 1;
            }
          } else {
            U8[$w2 + 283] = 0;
          }
          let $t5;
          U8[$w2 + 269] = (($t5 = U8[$w2 + 268], $t5 === 0 || $t5 === 1) ? 1 : 0);
          break;
        }
      }
    }
  } while (!(key === 69 || key === 0));
  S.sp = $sp;
}

export function AddLine(head: number, tail: number, codes: number, n: number, name_: string, code: number) {
  if (U8[n] > 100) {
    return;
  }
  MenuCore.AppendMenuLine(head, tail, name_, code === 0);
  w16(codes + U8[n] * 2, code);
  U8[n] = U8[n] + 1;
}

export function Named(item: number) {
  let $r0: string = "";
  CharHlp.ItemLabel(item, false);
  while ((U8[item] > 0) && (U8[item + U8[item]] === 32)) {
    U8[item] = U8[item] - 1;
  }
  $r0 = rS(item);
  return $r0;
}

export function Make(code: number, item: number) {
  if (code > 256) {
    RandItem.GenerateRandomItem(U8[(code - 256) + 261001], item);
    RandItem.ApplyTemplate(item, code - 256);
  } else {
    RandItem.GenerateRandomItem(code, item);
  }
}

export async function ChoosePlus(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let pos: number = 0, i: number = 0, per: number = 0, key: number = 0, ac: number = 0, $r0: boolean = false;
  function SetBracers() {
    U8[item + 50] = U8[ac + 261020];
    U8[item + 47] = U8[ac + 261023];
    w16(item + 58, rt.mul(I8[item + 50] & 65535, 3000));
  }
  ac = 1;
  if (U8[item + 46] === 77) {
    SetBracers();
  }
  pos = 0;
  for (let $i1 = 1; $i1 <= 3; $i1++) {
    i = $i1;
    if ((U8[item + i + 46] > 161) && (U8[item + i + 46] <= 166)) {
      pos = i;
    }
  }
  per = 0;
  if (I8[item + 50] > 0) {
    per = Math.trunc(r16(item + 58) / (I8[item + 50] & 65535)) & 65535;
  }
  if (pos !== 0) {
    U8[item + 50] = 1;
    U8[item + pos + 46] = 162;
    w16(item + 58, per);
  }
  do {
    Border.ClearBox(1, 1, 38, 22);
    TextRend.DisplayString(3, 4, 15, Named(item));
    if (pos !== 0) {
      TextRend.DisplayString(3, 6, 10, "Left and Right change its plus.");
    } else if (U8[item + 46] === 77) {
      TextRend.DisplayString(3, 6, 10, "Left and Right change its AC.");
    }
    U8[235273] = true ? 1 : 0;
    key = (await MenuCore.MenuHorizontal("Add: ", "Take Exit", 13, 10, 15, true, false, $f0)) & 255;
    if ((U8[$f0] !== 0) && (pos !== 0)) {
      if ((key === 75) && (I8[item + 50] > 0)) {
        U8[item + 50] = I8[item + 50] - 1;
      }
      if ((key === 77) && (I8[item + 50] < 5)) {
        U8[item + 50] = I8[item + 50] + 1;
      }
      if (I8[item + 50] === 0) {
        U8[item + pos + 46] = 0;
      } else {
        U8[item + pos + 46] = 161 + I8[item + 50];
      }
      w16(item + 58, rt.mul(per, I8[item + 50] & 65535));
    } else if ((U8[$f0] !== 0) && (U8[item + 46] === 77)) {
      if ((key === 75) && (ac > 1)) {
        ac = (ac - 1) & 255;
      }
      if ((key === 77) && (ac < 3)) {
        ac = (ac + 1) & 255;
      }
      SetBracers();
    }
  } while (!(!(U8[$f0] !== 0) && (key === 84 || key === 69 || key === 0)));
  $r0 = key === 84;
  S.sp = $sp;
  return $r0;
}

export async function AddItem() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 219);
  let item: number = 0, k: number = 0, line: number = 0, key: number = 0, code: number = 0;
  item = rt.getMem(64);
  w32($f0, 0);
  w32($f0 + 4, 0);
  U8[$f0 + 214] = 0;
  AddLine($f0, $f0 + 4, $f0 + 12, $f0 + 214, "Weapons and armor", 0);
  for (let $i1 = 1; $i1 <= 93; $i1++) {
    k = $i1;
    if (rt.inS(C_ITEM.RANDOM_ARMS_KINDS, k)) {
      RandItem.GenerateRandomItem(k, item);
      if (Named(item) !== "") {
        AddLine($f0, $f0 + 4, $f0 + 12, $f0 + 214, Named(item), k);
      }
    }
  }
  AddLine($f0, $f0 + 4, $f0 + 12, $f0 + 214, "Magic items", 0);
  for (let $i2 = 1; $i2 <= 19; $i2++) {
    k = $i2;
    if (U8[k + 261001] !== 0) {
      Make(256 + k, item);
      U8[item + 53] = 0;
      AddLine($f0, $f0 + 4, $f0 + 12, $f0 + 214, Named(item), 256 + k);
    }
  }
  for (let $i3 = 61; $i3 <= 62; $i3++) {
    k = $i3;
    RandItem.GenerateRandomItem(k, item);
    AddLine($f0, $f0 + 4, $f0 + 12, $f0 + 214, Named(item), k);
  }
  w16($f0 + 215, 0);
  U8[$f0 + 217] = true ? 1 : 0;
  w32($f0 + 8, 0);
  Border.ClearBox(1, 1, 38, 22);
  key = (await MenuCore.MenuVertical("Add: ", "Take", 13, 10, 15, 1, 1, 38, 22, r32($f0), true, $f0 + 217, $f0 + 215, $f0 + 8)) & 255;
  code = 0;
  if ((key !== 0) && (r32($f0 + 8) !== 0)) {
    line = MenuCore.ListIndex(r32($f0), r32($f0 + 8)) << 16 >> 16;
    if (line >= 0) {
      code = r16($f0 + line * 2 + 12);
    }
  }
  MenuCore.FreeStringList($f0);
  if (code !== 0) {
    Make(code, item);
    U8[item + 53] = 0;
    if ((((code > 256) || (code === 61)) || (code === 62)) || (await ChoosePlus(item))) {
      (await Shop.GiveItemCopyToCreature(item, $f0 + 218));
      if ((U8[$f0 + 218] !== 0)) {
        (await TextRend.PauseOnly());
      }
    }
  }
  rt.freeMem(item);
  S.sp = $sp;
}

export async function MoneyTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 56);
  let m: number = 0, key: number = 0, count: number = 0, code: number = 0;
  w16($f0 + 12, 0);
  do {
    w32($f0, 0);
    w32($f0 + 4, 0);
    for (let $i2 = 0; $i2 <= 6; $i2++) {
      m = $i2;
      MenuCore.AppendMenuLine($f0, $f0 + 4, StrUtil.PadLeft(rS(m * 9 + 218524), 8) + " " + StrUtil.NumStr(r16(r32(229635) + m * 2 + 136)), false);
    }
    U8[$f0 + 14] = true ? 1 : 0;
    w32($f0 + 8, 0);
    key = (await MenuCore.MenuVertical("Money: ", "Set", 13, 10, 15, 12, 7, 27, 13, r32($f0), true, $f0 + 14, $f0 + 12, $f0 + 8)) & 255;
    m = -1;
    if (((key !== 0) && (r32($f0 + 8) !== 0)) && (MenuCore.ListIndex(r32($f0), r32($f0 + 8)) >= 0)) {
      m = (0 + MenuCore.ListIndex(r32($f0), r32($f0 + 8))) << 24 >> 24;
    }
    MenuCore.FreeStringList($f0);
    if (m >= 0) {
      wS($f0 + 15, 40, (await TextRend.ReadString(rS(m * 9 + 218524) + ": ", 10, 5)));
      count = rt.valI(rS($f0 + 15)) | 0; code = rt.valCode.v << 16 >> 16;
      if (((code === 0) && (count >= 0)) && (count <= 65535)) {
        w16(r32(229635) + m * 2 + 136, count);
      }
      CharHlp.RecalcStats(r32(229635));
    }
  } while (!(m < 0));
  S.sp = $sp;
}

export async function GearTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let key: number = 0;
  do {
    (await ViewChar.DisplayChar(r32(229635)));
    key = (await MenuCore.MenuHorizontal("Gear: ", "Add Money Exit", 13, 10, 15, false, false, $f0)) & 255;
    switch (key) {
      case 65: {
        (await AddItem());
        break;
      }
      case 77: {
        (await MoneyTool());
        break;
      }
    }
  } while (!(key === 69 || key === 0));
  S.sp = $sp;
}

export async function SpellList(cls: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 118);
  let n: number = 0, m: number = 0, k: number = 0, key: number = 0;
  w16($f0 + 112, 0);
  do {
    w32($f0, 0);
    w32($f0 + 4, 0);
    n = 0;
    for (let $i2 = 1; $i2 <= 100; $i2++) {
      m = $i2;
      {
        const $w3 = m * 16 + 222392;
        if (((CharHlp.IsSpell(m) && (U8[$w3] === cls)) && (I8[$w3 + 1] >= 1)) && (I8[$w3 + 1] <= 5)) {
          wS($f0 + 115, 2, "  ");
          if (CharHlp.KnowsSpell(r32(229635), m)) {
            wS($f0 + 115, 2, "* ");
          }
          MenuCore.AppendMenuLine($f0, $f0 + 4, rS($f0 + 115) + StrUtil.NumStr(I8[$w3 + 1]) + " " + rS(m * 33 + 219075), false);
          n = (n + 1) & 255;
          U8[$f0 + n + 11] = m;
        }
      }
    }
    U8[$f0 + 114] = true ? 1 : 0;
    w32($f0 + 8, 0);
    Border.ClearBox(1, 1, 38, 22);
    key = (await MenuCore.MenuVertical("Known: ", "Toggle", 13, 10, 15, 1, 1, 38, 22, r32($f0), true, $f0 + 114, $f0 + 112, $f0 + 8)) & 255;
    k = 0;
    if ((key !== 0) && (r32($f0 + 8) !== 0)) {
      k = (MenuCore.ListIndex(r32($f0), r32($f0 + 8)) + 1) & 255;
    }
    MenuCore.FreeStringList($f0);
    if (k !== 0) {
      CharHlp.SetSpellKnown(r32(229635), U8[$f0 + k + 11], !CharHlp.KnowsSpell(r32(229635), U8[$f0 + k + 11]));
    }
  } while (!(k === 0));
  S.sp = $sp;
}

export async function MagicTool() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let key: number = 0;
  do {
    (await ViewChar.DisplayChar(r32(229635)));
    key = (await MenuCore.MenuHorizontal("Spells known: ", "Mage Cleric Exit", 13, 10, 15, false, false, $f0)) & 255;
    switch (key) {
      case 77: {
        (await SpellList(1));
        break;
      }
      case 67: {
        (await SpellList(0));
        break;
      }
    }
  } while (!(key === 69 || key === 0));
  S.sp = $sp;
}
