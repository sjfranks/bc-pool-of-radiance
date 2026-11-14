// Generated from src/shopbuy.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as Crt from './crt';
import * as C_EQUIP from './c_equip';
import * as C_KEYS from './c_keys';
import * as GameVars from './gamevars';
import * as Border from './border';
import * as CharDisp from './chardisp';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as MoneyCal from './moneycal';
import * as Party from './party';
import * as Shop from './shop';
import * as StrUtil from './strutil';
import * as TextRend from './textrend';

export const TAB_ALL = 0;
export const TAB_MELEE = 1;
export const TAB_RANGED = 2;
export const TAB_ARMOR = 3;
export const TAB_AMMO = 4;
export const TAB_MISC = 5;
export const TAB_LAST = 5;
export const MELEE_TYPES = rt.setR(1, 8, 10, 27, 29, 40, 89, 89);
export const RANGED_TYPES = rt.setR(2, 2, 7, 7, 9, 9, 20, 21, 31, 31, 41, 47, 85, 86, 94, 96);
export const ARMOR_TYPES = rt.setR(48, 59, 63, 68, 76, 77, 92, 92);
export const AMMO_TYPES = rt.setR(28, 28, 73, 73);
export const PRICE_WIDTH = 6;
export const NAME_WIDTH = 27;
export const MAX_SHOWN = 128;
export const TAB_ROW = 1;
export const LIST_LEFT = 2;
export const LIST_TOP = 3;
export const LIST_RIGHT = 37;
export const LIST_BOTTOM = 15;
export const GOLD_ROW = 17;
export const BUYER_ROW = 18;
export const NEW_ROW = 19;
export const ARMOR_ROW = 20;
export const WEAPON_ROW = 21;
export const AMMO_ROW = 22;
export const PANEL_LEFT = 2;
export const PANEL_RIGHT = 37;
export const POOL_COL = 20;
export const OFF_MAX = 8;

export const $at = { tabKeys: 257981, tabCols: 257988, tabNames: 257994, tabKeyAt: 258036 };

export function InTab(itemType: number, tab: number) {
  let $r0: boolean = false;
  switch (tab) {
    case 0: {
      $r0 = true;
      break;
    }
    case 1: {
      $r0 = rt.inS(MELEE_TYPES, itemType);
      break;
    }
    case 2: {
      $r0 = rt.inS(RANGED_TYPES, itemType);
      break;
    }
    case 3: {
      $r0 = rt.inS(ARMOR_TYPES, itemType);
      break;
    }
    case 4: {
      $r0 = rt.inS(AMMO_TYPES, itemType);
      break;
    }
    case 5: {
      $r0 = !(((rt.inS(MELEE_TYPES, itemType) || rt.inS(RANGED_TYPES, itemType)) || rt.inS(ARMOR_TYPES, itemType)) || rt.inS(AMMO_TYPES, itemType));
      break;
    }
    default: {
      $r0 = false;
    }
  }
  return $r0;
}

export function CanUse(creature: number, item: number) {
  let $r0: boolean = false;
  $r0 = (U8[CharHlp.BaseItem(U8[item + 46]) + 13] & U8[creature + 176]) !== 0;
  return $r0;
}

export function Wearable(item: number) {
  let base: number = 0, $r0: boolean = false;
  base = CharHlp.BaseItem(U8[item + 46]);
  $r0 = (((((U8[base] === 0) && (U8[base + 1] > 0)) || ((U8[base] >= 1) && (U8[base] <= 9))) || (U8[item + 46] === 73)) || (U8[item + 46] === 28)) || (U8[base + 6] > 127);
  return $r0;
}

export function Shown(creature: number, item: number, tab: number, usableOnly: boolean) {
  let $r0: boolean = false;
  $r0 = InTab(U8[item + 46], tab) && (!usableOnly || CanUse(creature, item));
  return $r0;
}

export function FilterStock(stock: number, creature: number, tab: number, usableOnly: boolean, shown: number) {
  w16(shown, 0);
  while ((stock !== 0) && (ri16(shown) < 128)) {
    if (Shown(creature, stock, tab, usableOnly)) {
      w32(shown + ri16(shown) * 4 + 2, stock);
      w16(shown, ri16(shown) + 1);
    }
    stock = r32(stock + 42);
  }
}

export function FindShown(shown: number, item: number) {
  let i: number = 0, $r0: number = 0;
  $r0 = -1;
  if (item !== 0) {
    for (let $i1 = ri16(shown) - 1; $i1 >= 0; $i1--) {
      i = $i1;
      if (r32(shown + i * 4 + 2) === item) {
        $r0 = i;
      }
    }
  }
  return $r0;
}

export function RowText(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let price: number = 0, $r0: string = "";
  CharHlp.ItemLabel(item, false);
  wS($f0, 40, rS(item));
  while ((U8[$f0] > 0) && (U8[$f0 + U8[$f0]] === 32)) {
    U8[$f0] = U8[$f0] - 1;
  }
  if (U8[$f0] > 27) {
    U8[$f0] = 27;
  }
  price = r16(item + 58);
  if (price === 0) {
    price = 1;
  }
  $r0 = StrUtil.PadLeft(StrUtil.NumStr(price), 6) + " " + rS($f0);
  S.sp = $sp;
  return $r0;
}

export function GetFigures(creature: number, f: number) {
  U8[f] = U8[creature + 273];
  U8[f + 1] = U8[creature + 277];
  U8[f + 2] = U8[creature + 279];
  U8[f + 3] = I8[creature + 281];
}

export function TryOn(creature: number, item: number, t: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 100);
  let base: number = 0, offCount: number = 0, p: number = 0, hands: number = 0, rings: number = 0, blocked: boolean = false, i: number = 0;
  function PutAway(q: number) {
    if (U8[q + 54] !== 0) {
      blocked = true;
    } else if (offCount < 8) {
      offCount = (offCount + 1) & 255;
      w32($f0 + offCount * 4 + 60, q);
      U8[q + 52] = 0;
    } else {
      blocked = true;
    }
  }
  rt.fill(t, 9, 0);
  U8[t] = Wearable(item) ? 1 : 0;
  U8[t + 1] = rt.inS(AMMO_TYPES, U8[item + 46]) ? 1 : 0;
  if (!(U8[t] !== 0) || !CanUse(creature, item)) {
    { S.sp = $sp; return; }
  }
  mv($f0, item, 64);
  U8[$f0 + 52] = 1;
  U8[$f0 + 63] = 0;
  w32($f0 + 42, 0);
  base = CharHlp.BaseItem(U8[$f0 + 46]);
  offCount = 0;
  blocked = false;
  p = r32(creature + 200);
  while (p !== 0) {
    if ((U8[p + 52] !== 0) && InTheWay($f0, p)) {
      PutAway(p);
    }
    p = r32(p + 42);
  }
  if (U8[base] === 9) {
    rings = 0;
    p = r32(creature + 200);
    while (p !== 0) {
      if ((U8[p + 52] !== 0) && (U8[CharHlp.BaseItem(U8[p + 46])] === 9)) {
        rings = (rings + 1) & 255;
      }
      p = r32(p + 42);
    }
    if (rings >= 2) {
      p = r32(creature + 200);
      while ((p !== 0) && (((U8[p + 52] === 0) || (U8[p + 54] !== 0)) || (U8[CharHlp.BaseItem(U8[p + 46])] !== 9))) {
        p = r32(p + 42);
      }
      if (p === 0) {
        blocked = true;
      } else {
        PutAway(p);
      }
    }
  }
  hands = 0;
  p = r32(creature + 200);
  while (p !== 0) {
    if (U8[p + 52] !== 0) {
      hands = (hands + U8[CharHlp.BaseItem(U8[p + 46]) + 1]) << 16 >> 16;
    }
    p = r32(p + 42);
  }
  p = r32(creature + 200);
  while ((p !== 0) && ((hands + U8[base + 1]) > 2)) {
    if ((((U8[p + 52] !== 0) && (U8[p + 54] === 0)) && (U8[CharHlp.BaseItem(U8[p + 46]) + 1] > 0)) && (offCount < 8)) {
      hands = (hands - U8[CharHlp.BaseItem(U8[p + 46]) + 1]) << 16 >> 16;
      if (U8[CharHlp.BaseItem(U8[p + 46])] === 1) {
        U8[t + 4] = true ? 1 : 0;
      }
      PutAway(p);
    }
    p = r32(p + 42);
  }
  if ((hands + U8[base + 1]) > 2) {
    blocked = true;
  }
  if (blocked) {
    U8[t + 4] = false ? 1 : 0;
  } else {
    U8[t + 2] = true ? 1 : 0;
    w32($f0 + 42, r32(creature + 200));
    w32(creature + 200, $f0);
    CharHlp.RecalcStats(creature);
    GetFigures(creature, t + 5);
    U8[t + 3] = CharHlp.FindDamagingRangedWeapon(creature, $f0 + 96) && (r32($f0 + 96) === $f0) ? 1 : 0;
    w32(creature + 200, r32($f0 + 42));
  }
  for (let $i6 = 1, $e6 = offCount; $i6 <= $e6; $i6++) {
    i = $i6;
    U8[r32($f0 + i * 4 + 60) + 52] = 1;
  }
  CharHlp.RecalcStats(creature);
  S.sp = $sp;
}

export function AcText(ac: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, StrUtil.NumStr(Math.abs(ac - 60)));
  if (ac > 60) {
    wS($f0, 40, "-" + rS($f0));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function DmgText(f: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  let $r0: string = "";
  wS($f0, 40, StrUtil.NumStr(U8[f + 1]) + "d" + StrUtil.NumStr(U8[f + 2]));
  if (I8[f + 3] > 0) {
    wS($f0, 40, rS($f0) + "+" + StrUtil.NumStr(I8[f + 3]));
  }
  if (I8[f + 3] < 0) {
    wS($f0, 40, rS($f0) + "-" + StrUtil.NumStr(Math.abs(I8[f + 3])));
  }
  $r0 = rS($f0);
  S.sp = $sp;
  return $r0;
}

export function NewTexts(cur: number, t: number, ac: number, dmg: number) {
  if (!(U8[t] !== 0)) {
    wS(ac, 40, AcText(U8[cur]));
    wS(dmg, 40, DmgText(cur));
  } else if (!(U8[t + 2] !== 0)) {
    wS(ac, 40, "--");
    wS(dmg, 40, "--");
  } else {
    wS(ac, 40, AcText(U8[t + 5]));
    if ((U8[t + 1] !== 0) && !(U8[t + 3] !== 0)) {
      wS(dmg, 40, "--");
    } else {
      wS(dmg, 40, DmgText(t + 5));
    }
  }
}

export async function BuyScreen() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 571);
  let sel: number = 0, creature: number = 0, member: number = 0, tab: number = 0, usableOnly: boolean = false, rebuild: boolean = false, done: boolean = false, c: number = 0;
  function BuildList() {
    let i: number = 0;
    if (r32($f0 + 514) !== 0) {
      MenuCore.FreeStringList($f0 + 514);
    }
    w32($f0 + 514, 0);
    w32($f0 + 518, 0);
    FilterStock(r32(230776), creature, tab, usableOnly, $f0);
    for (let $i1 = 0, $e1 = ri16($f0) - 1; $i1 <= $e1; $i1++) {
      i = $i1;
      if (r16(r32($f0 + i * 4 + 2) + 58) === 0) {
        w16(r32($f0 + i * 4 + 2) + 58, 1);
      }
      MenuCore.AppendMenuLine($f0 + 514, $f0 + 518, RowText(r32($f0 + i * 4 + 2)), false);
    }
    w16($f0 + 528, FindShown($f0, sel));
    if (ri16($f0 + 528) < 0) {
      w16($f0 + 528, 0);
      w16(231527, 0);
    }
    if (ri16($f0) > 0) {
      sel = r32($f0 + ri16($f0 + 528) * 4 + 2);
    } else {
      sel = 0;
    }
    DrawTabs(tab);
    Border.ClearBox(1, 3, 38, 15);
    if (ri16($f0) === 0) {
      TextRend.DisplayCentered(2, 37, 9, 15, "** No Items **");
    }
    U8[$f0 + 526] = true ? 1 : 0;
  }
  creature = r32(229635);
  w32($f0 + 514, 0);
  sel = 0;
  tab = 0;
  usableOnly = false;
  w16(231527, 0);
  (await DrawFrame());
  rebuild = true;
  done = false;
  do {
    if (rebuild) {
      BuildList();
      rebuild = false;
    }
    DrawPanel(creature, sel);
    if (usableOnly) {
      wS($f0 + 530, 40, "Showing usable");
    } else {
      wS($f0 + 530, 40, "Showing all");
    }
    wS(235275, 16, rS(257981));
    U8[235297] = true ? 1 : 0;
    if (ri16($f0) === 0) {
      c = (await MenuCore.MenuHorizontal("Shop: ", rS($f0 + 530) + " Exit", 13, 10, 15, true, false, $f0 + 527)) & 255;
      if ((U8[$f0 + 527] !== 0) && (Party.AltMember(c) === 0)) {
        c = 32;
      }
    } else {
      U8[235301] = true ? 1 : 0;
      U8[235298] = true ? 1 : 0;
      c = (await MenuCore.MenuVertical("Shop: ", rS($f0 + 530) + " Buy", 13, 10, 15, 2, 3, 37, 15, r32($f0 + 514), true, $f0 + 526, $f0 + 528, $f0 + 522)) & 255;
      if (r32($f0 + 522) !== 0) {
        sel = r32($f0 + ri16($f0 + 528) * 4 + 2);
      }
      if ((U8[235299] !== 0)) {
        c = 32;
      }
    }
    if (Party.AltMember(c) > 0) {
      member = Party.MemberAt(Party.AltMember(c));
      if ((member !== 0) && (member !== creature)) {
        creature = member;
        w32(229635, member);
        rebuild = usableOnly;
      }
    } else {
      switch (c) {
        case 0: case 27: case 69: {
          done = true;
          break;
        }
        case 83: {
          usableOnly = !usableOnly;
          rebuild = true;
          break;
        }
        case 76: case 77: case 82: case 65: case 79: case 73: {
          tab = (rt.Pos(String.fromCharCode(c), rS(257981)) - 1) & 255;
          rebuild = true;
          break;
        }
        case 66: case 13: {
          if (sel !== 0) {
            (await Shop.BuyItem(sel));
            U8[$f0 + 526] = true ? 1 : 0;
          }
          break;
        }
      }
    }
  } while (!(done));
  if (r32($f0 + 514) !== 0) {
    MenuCore.FreeStringList($f0 + 514);
  }
  S.sp = $sp;
}

export function InTheWay(item: number, other: number) {
  let slot: number = 0, $r0: boolean = false;
  slot = U8[CharHlp.BaseItem(U8[item + 46])];
  $r0 = (((slot <= 8) && (U8[CharHlp.BaseItem(U8[other + 46])] === slot)) || ((U8[item + 46] === 73) && (U8[other + 46] === 73))) || ((U8[item + 46] === 28) && (U8[other + 46] === 28));
  return $r0;
}

export function DrawTabs(cur: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 7);
  let tab: number = 0;
  Border.ClearBox(1, 1, 38, 1);
  for (let $i1 = 0; $i1 <= 5; $i1++) {
    tab = $i1;
    wS($f0, 6, rS(tab * 7 + 257994));
    if (tab === cur) {
      TextRend.DisplayString(U8[tab + 257988], 1, 15, rS($f0));
    } else {
      TextRend.DisplayString(U8[tab + 257988], 1, 14, rS($f0));
      TextRend.DisplayString((U8[tab + 257988] + U8[tab + 258036]) - 1, 1, 15, String.fromCharCode(U8[$f0 + U8[tab + 258036]]));
    }
  }
  S.sp = $sp;
}

export function DrawGear(item: number, col: number, row: number, width: number, color: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 41);
  if (item === 0) {
    { S.sp = $sp; return; }
  }
  CharHlp.ItemLabel(item, false);
  wS($f0, 40, rS(item));
  while ((U8[$f0] > 0) && (U8[$f0 + U8[$f0]] === 32)) {
    U8[$f0] = U8[$f0] - 1;
  }
  if (U8[$f0] > width) {
    U8[$f0] = width;
  }
  TextRend.DisplayString(col, row, color, rS($f0));
  S.sp = $sp;
}

export function ShownAmmo(creature: number) {
  let w: number = 0, arrows: number = 0, bolts: number = 0, $r0: number = 0;
  w = r32(creature + 204);
  arrows = r32(creature + 248);
  bolts = r32(creature + 252);
  if (((w !== 0) && ((U8[CharHlp.BaseItem(U8[w + 46]) + 14] & 128) !== 0)) && (bolts !== 0)) {
    $r0 = bolts;
  } else if (arrows !== 0) {
    $r0 = arrows;
  } else {
    $r0 = bolts;
  }
  return $r0;
}

export function DrawPanel(creature: number, item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 341);
  let acWidth: number = 0, dmgWidth: number = 0, statCol: number = 0, n: number = 0, shield: number = 0, shieldColor: number = 0, armorWidth: number = 0;
  Border.ClearBox(1, 17, 38, 22);
  wS($f0 + 300, 40, StrUtil.Grouped(MoneyCal.CreatureGold(creature)) + " GP");
  TextRend.DisplayString(2, 17, 15, "Char:");
  TextRend.DisplayString(8, 17, 14, rS($f0 + 300));
  TextRend.DisplayString(20, 17, 15, "Pool:");
  TextRend.DisplayString(26, 17, 14, StrUtil.Grouped(MoneyCal.CoinValueInGold(230748)) + " GP");
  CharHlp.RecalcStats(creature);
  GetFigures(creature, $f0);
  wS($f0 + 13, 40, AcText(U8[$f0]));
  wS($f0 + 54, 40, DmgText($f0));
  if (item !== 0) {
    TryOn(creature, item, $f0 + 4);
    NewTexts($f0, $f0 + 4, $f0 + 95, $f0 + 136);
  } else {
    rt.fill($f0 + 4, 9, 0);
    wS($f0 + 95, 40, rS($f0 + 13));
    wS($f0 + 136, 40, rS($f0 + 54));
  }
  acWidth = U8[$f0 + 13];
  if (U8[$f0 + 95] > acWidth) {
    acWidth = U8[$f0 + 95];
  }
  dmgWidth = U8[$f0 + 54];
  if (U8[$f0 + 136] > dmgWidth) {
    dmgWidth = U8[$f0 + 136];
  }
  statCol = (38 - (((3 + acWidth) + 5) + dmgWidth)) & 255;
  TextRend.DisplayString(statCol - 8, 18, 15, "Current");
  TextRend.DisplayString(statCol, 18, 15, "AC");
  TextRend.DisplayString(statCol + 3, 18, 10, StrUtil.PadLeft(rS($f0 + 13), acWidth));
  TextRend.DisplayString((statCol + 4) + acWidth, 18, 15, "Dmg");
  TextRend.DisplayString((statCol + 8) + acWidth, 18, 10, rS($f0 + 54));
  TextRend.DisplayString(statCol - 4, 19, 15, "New");
  TextRend.DisplayString(statCol, 19, 15, "AC");
  TextRend.DisplayString(statCol + 3, 19, 10, StrUtil.PadLeft(rS($f0 + 95), acWidth));
  TextRend.DisplayString((statCol + 4) + acWidth, 19, 15, "Dmg");
  TextRend.DisplayString((statCol + 8) + acWidth, 19, 10, rS($f0 + 136));
  wS($f0 + 177, 40, "");
  for (let $i1 = 1; $i1 <= 8; $i1++) {
    n = $i1;
    if (Party.MemberAt(n) === creature) {
      wS($f0 + 177, 40, StrUtil.NumStr(n) + ": ");
    }
  }
  wS($f0 + 218, 40, rS(creature));
  if (((2 + U8[$f0 + 177]) + U8[$f0 + 218]) > (statCol - 9)) {
    if ((((statCol - 9) - 2) - U8[$f0 + 177]) > 0) {
      U8[$f0 + 218] = (((statCol - 9) - 2) - U8[$f0 + 177]) & 255;
    } else {
      wS($f0 + 218, 40, "");
    }
  }
  TextRend.DisplayString(2, 18, 15, rS($f0 + 177));
  TextRend.DisplayString(2 + U8[$f0 + 177], 18, CharDisp.NameColor(creature), rS($f0 + 218));
  shield = r32(creature + 208);
  armorWidth = 36;
  if (shield !== 0) {
    CharHlp.ItemLabel(shield, false);
    wS($f0 + 259, 40, rS(shield));
    while ((U8[$f0 + 259] > 0) && (U8[$f0 + U8[$f0 + 259] + 259] === 32)) {
      U8[$f0 + 259] = U8[$f0 + 259] - 1;
    }
    if ((U8[$f0 + 8] !== 0)) {
      shieldColor = 12;
    } else {
      shieldColor = 10;
    }
    TextRend.DisplayString(38 - U8[$f0 + 259], 20, shieldColor, rS($f0 + 259));
    armorWidth = ((35 - U8[$f0 + 259]) - 1) & 255;
  }
  DrawGear(r32(creature + 212), 2, 20, armorWidth, 10);
  DrawGear(r32(creature + 204), 2, 21, 36, 10);
  DrawGear(ShownAmmo(creature), 2, 22, 36, 10);
  S.sp = $sp;
}

export async function DrawFrame() {
  TextRend.ClearScreen();
  (await Border.DrawBorder(1, 1, 38, 1, 0));
  (await Border.DrawBorder(1, 3, 38, 15, 0));
  (await Border.DrawBorder(1, 17, 38, 22, 0));
}
