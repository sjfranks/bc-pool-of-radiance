// Generated from src/eclmenu.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_AREA from './c_area';
import * as C_ECL from './c_ecl';
import * as C_NPC from './c_npc';
import * as C_MSG from './c_msg';
import * as GameVars from './gamevars';
import * as MapView from './mapview';
import * as SaveLoad from './saveload';
import * as C_EFFECT from './c_effect';
import * as C_KEYS from './c_keys';
import * as C_STATUS from './c_status';
import * as C_GBVM from './c_gbvm';
import * as C_DIR from './c_dir';
import * as C_MONEY from './c_money';
import * as CharHlp from './charhlp';
import * as DaxIo from './daxio';
import * as FxEngine from './fxengine';
import * as GameIo from './gameio';
import * as MapTiles from './maptiles';
import * as MenuCore from './menucore';
import * as Portrait from './portrait';
import * as TextRend from './textrend';
import * as View3D from './view3d';
import * as EclVars from './eclvars';
import * as CharDisp from './chardisp';
import * as Party from './party';
import * as C_RACE from './c_race';
import * as C_LEVEL from './c_level';
import * as StrUtil from './strutil';
import * as Dice from './dice';
import * as DiskRec from './diskrec';
import * as C_DEMO from './c_demo';
import * as TpRand from './tprand';


export const $at = { cmpFlags: 248851, iconAnimId: 248857, monsterFlags: 248858, picDrawn: 248860, protTextShown: 248861, picIdShown: 255438 };

export function EclInit() {
  let i: number = 0;
  U8[232634] = false ? 1 : 0;
  U8[248861] = 0;
  U8[232630] = false ? 1 : 0;
  U8[232631] = false ? 1 : 0;
  U8[232423] = 65;
  U8[232424] = 9;
  U8[232636] = true ? 1 : 0;
  rt.fill(248858, 2, 0);
  U8[248857] = 8;
  w16(227060, 39168);
  w32(232425, 0);
  w32(232429, 0);
  rt.fill(248851, 6, 0);
  w16(r32(227037) + 1474, 255);
  w16(r32(227037) + 1444, 0);
  w16(r32(227037) + 1446, 0);
  w16(r32(227033) + 458, 0);
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    i = $i1;
    EclVars.LoadEclVars(1);
    w16(i * 2 + 227048, EclVars.CombineBytesToWord(U8[232562], U8[232498]));
  }
  w16(r32(227033) + 460, 1);
  if (U8[227107] === 0) {
    for (let $i2 = 18944; $i2 <= 18975; $i2++) {
      i = $i2;
      w16(r32(227033) + i * 2 - 37376, 0);
    }
    for (let $i3 = 28281; $i3 <= 28290; $i3++) {
      i = $i3;
      w16(r32(227037) + i * 2 - 54784, 0);
    }
  } else {
    U8[227107] = 0;
  }
}

export async function LoadEclScript(scriptId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 10);
  let disk: number = 0, n: number = 0, found: boolean = false;
  rt.fill(r32(227045), 9984, 0);
  if ((U8[227098] !== 0)) {
    U8[229633] = true ? 1 : 0;
    (await DaxIo.LoadDax(C_DEMO.ARCHIVE, ".dax", scriptId, $f0 + 4, $f0 + 6));
    U8[229633] = false ? 1 : 0;
    if (r16($f0 + 4) > 2) {
      n = (r16($f0 + 4) - 2) & 65535;
      if (n > 9984) {
        n = 9984;
      }
      mv(r32(227045), r32($f0 + 6) + 2, n);
    } else {
      U8[227099] = true ? 1 : 0;
    }
    if (r32($f0 + 6) !== 0) {
      rt.freeMem(r32($f0 + 6));
    }
    { S.sp = $sp; return; }
  }
  U8[229633] = false ? 1 : 0;
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, 15, "Loading...Please Wait");
  let $t1;
  if (!($t1 = U8[229120], ($t1 >= 1 && $t1 <= 8))) {
    DaxIo.PushState(1);
  }
  wS($f0, 3, rt.fmtI(U8[229120], 0));
  if ((await DaxIo.ArchiveName("ECL" + rS($f0))) !== "ECL" + rS($f0)) {
    if (!DaxIo.DiskHasBlock("ECL" + rS($f0), scriptId)) {
      disk = 1;
      found = false;
      while ((disk <= 8) && !found) {
        wS($f0, 3, rt.fmtI(disk, 0));
        found = DaxIo.DiskHasBlock("ECL" + rS($f0), scriptId);
        if (found) {
          DaxIo.PushState(disk);
        }
        disk = (disk + 1) & 255;
      }
      wS($f0, 3, rt.fmtI(U8[229120], 0));
    }
  }
  (await DaxIo.LoadDax("ECL" + rS($f0), ".dax", scriptId, $f0 + 4, $f0 + 6));
  if (r16($f0 + 4) < 2) {
    U8[229633] = true ? 1 : 0;
    disk = 1;
    while ((r16($f0 + 4) < 2) && (disk <= 8)) {
      if (disk !== U8[229120]) {
        wS($f0, 3, rt.fmtI(disk, 0));
        (await DaxIo.LoadDax("ECL" + rS($f0), ".dax", scriptId, $f0 + 4, $f0 + 6));
        if (r16($f0 + 4) >= 2) {
          DaxIo.PushState(disk);
        }
      }
      disk = (disk + 1) & 255;
    }
    U8[229633] = false ? 1 : 0;
    if (r16($f0 + 4) < 2) {
      wS($f0, 3, rt.fmtI(scriptId, 0));
      (await DaxIo.PromptBox(14, "Script area " + rS($f0) + " is missing"));
      (await GameIo.ExitGame());
    }
  }
  n = (r16($f0 + 4) - 2) & 65535;
  if (n > 9984) {
    n = 9984;
  }
  mv(r32(227045), r32($f0 + 6) + 2, n);
  rt.freeMem(r32($f0 + 6));
  TextRend.ClearBottomLine();
  S.sp = $sp;
}

export async function InitCreature(id: number, creature: number, inv: number, effect: number) {
  w32(creature, 0);
  w32(creature, rt.getMem(378));
  (await LoadCreatureData(id, r32(creature)));
  w32(inv, r32(r32(creature) + 200));
  w32(effect, r32(r32(creature) + 127));
}

export function MaxMonsterDist(x: number, y: number, facing: number) {
  let blocked: boolean = false, dist: number = 0, $r0: number = 0;
  dist = 0;
  blocked = false;
  $r0 = 0;
  if (r16(r32(227033) + 460) === 0) {
    $r0 = 2;
    w16(r32(227037) + 1410, 2);
  } else {
    while ((dist < 2) && !blocked) {
      if (View3D.GetWallType(x, y, facing) === 0) {
        dist = (dist + 1) & 255;
        $r0 = dist;
        switch (facing) {
          case 0: {
            y = (y - 1) & 255;
            break;
          }
          case 2: {
            x = (x + 1) & 255;
            break;
          }
          case 4: {
            y = (y + 1) & 255;
            break;
          }
          case 6: {
            x = (x - 1) & 255;
            break;
          }
        }
      } else {
        blocked = true;
      }
    }
  }
  return $r0;
}

export async function DisplayPortrait(headId: number, bodyId: number) {
  U8[248860] = false ? 1 : 0;
  U8[248650] = headId;
  U8[248651] = bodyId;
  (await Portrait.LoadPortraitBufs(headId, bodyId));
  Portrait.DisplayPortraitBufs(3, 3, true);
}

export async function DisplayMonster(sprId: number, picId: number, dist: number, flags: number) {
  let d3: number = 0;
  if (!(U8[flags + 1] !== 0) && (U8[flags] !== 0)) {
    (await MapView.DisplayMapView());
  }
  d3 = (dist + 1) & 255;
  if (!(U8[flags + 1] !== 0)) {
    if (!(U8[flags] !== 0)) {
      if ((U8[231431] !== 0)) {
        U8[231431] = false ? 1 : 0;
        (await MapView.DisplayMapView());
      }
      (await Portrait.LoadAnimation("SPRIT", sprId, 1, 231449));
      U8[flags] = true ? 1 : 0;
      U8[232635] = true ? 1 : 0;
    }
    if (U8[227109] === 1) {
      (await Portrait.Show3DSprite(d3, 231449));
    } else {
      (await Portrait.Show3DSprite(2, 231449));
    }
  }
  if ((U8[flags + 1] !== 0)) {
    if (U8[255438] === r16(r32(227037) + 1474)) {
      return;
    }
  }
  if (dist !== 0) {
    return;
  }
  if (U8[227109] !== 1) {
    return;
  }
  if ((U8[232637] !== 0) && ((U8[227063] === 0) || (U8[227065] === 0))) {
    return;
  }
  U8[255438] = r16(r32(227037) + 1474) & 255;
  U8[232634] = true ? 1 : 0;
  if (r16(r32(227037) + 1474) === 255) {
    (await Portrait.LoadAnimation("PIC", picId, 0, 231449));
    U8[flags + 1] = true ? 1 : 0;
    Portrait.DisplayImageBuf(3, 3, true, r32(231455));
  } else {
    (await DisplayPortrait(r16(r32(227037) + 1474) & 255, picId));
    U8[flags + 1] = true ? 1 : 0;
    U8[248860] = false ? 1 : 0;
  }
}

export async function MenuHorizontalCharacterSelect(query: string, menu: string, qCol: number, mCol: number, hlCol: number, enterOk: boolean, animate: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 513);
  wS($f0, 255, menu);
  let idx: number = 0, ch: number = 0, $r0: number = 0;
  StrUtil.MenuToOptions($f0, $f0 + 256);
  U8[231529] = 1;
  do {
    ch = (await MenuCore.MenuHorizontal(query, rS($f0), qCol, mCol, hlCol, true, animate, $f0 + 512)) & 255;
    if ((U8[$f0 + 512] !== 0)) {
      Party.SelectPrevNextChar(ch);
      CharDisp.DisplayParty(r32(229635));
      ch = 0;
    }
  } while (!(((ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 90)) || ((ch === 13) && enterOk)));
  switch (ch) {
    case 13: {
      $r0 = 0;
      break;
    }
    default: {
      idx = 1;
      while ((idx <= U8[$f0 + 256]) && (U8[$f0 + idx + 256] !== ch)) {
        idx = (idx + 1) & 255;
      }
      if (idx <= U8[$f0 + 256]) {
        $r0 = (idx - 1) & 255;
      } else {
        $r0 = 255;
      }
    }
  }
  S.sp = $sp;
  return $r0;
}

export function EclCompareStr(s1: string, s2: string) {
  rt.fill(248851, 6, 0);
  if (s1 === s2) {
    U8[248851] = true ? 1 : 0;
  }
  if (s1 !== s2) {
    U8[248852] = true ? 1 : 0;
  }
  if (s1 < s2) {
    U8[248853] = true ? 1 : 0;
  }
  if (s1 > s2) {
    U8[248854] = true ? 1 : 0;
  }
  if (s1 <= s2) {
    U8[248855] = true ? 1 : 0;
  }
  if (s1 >= s2) {
    U8[248856] = true ? 1 : 0;
  }
}

export function EclCompareInt(v1: number, v2: number) {
  rt.fill(248851, 6, 0);
  if (v1 === v2) {
    U8[248851] = true ? 1 : 0;
  }
  if (v1 !== v2) {
    U8[248852] = true ? 1 : 0;
  }
  if (v1 < v2) {
    U8[248853] = true ? 1 : 0;
  }
  if (v1 > v2) {
    U8[248854] = true ? 1 : 0;
  }
  if (v1 <= v2) {
    U8[248855] = true ? 1 : 0;
  }
  if (v1 >= v2) {
    U8[248856] = true ? 1 : 0;
  }
}

export function EclGosub(varIdx: number) {
  w32(232429, r32(232425));
  w32(232425, rt.getMem(6));
  w32(r32(232425) + 2, r32(232429));
  w16(r32(232425), r16(227060));
  w16(227060, EclVars.CombineBytesToWord(U8[varIdx + 232561], U8[varIdx + 232497]));
}

export async function CharFightsAlone(mirror: number) {
  let p: number = 0, clone: number = 0, cur: number = 0, srcIt: number = 0, slot: number = 0;
  U8[232632] = true ? 1 : 0;
  w16(r32(227037) + 1484, mirror);
  cur = r32(229635);
  p = r32(229639);
  while (p !== 0) {
    if (rS(p) !== rS(cur)) {
      U8[p + 269] = 0;
    }
    p = r32(p + 260);
  }
  if (mirror === 0) {
    return;
  }
  slot = U8[248857];
  if (slot > 12) {
    slot = 12;
  }
  (await MapTiles.LoadIconAnim("CPIC", 11, slot));
  p = Party.LastCreature();
  clone = rt.getMem(378);
  mv(clone, cur, 378);
  U8[clone + 269] = 1;
  w32(clone + 260, 0);
  wS(clone, 15, "ROLF");
  U8[clone + 271] = 1;
  U8[clone + 270] = 1;
  U8[clone + 132] = 178;
  U8[clone + 191] = slot;
  w32(clone + 127, 0);
  w32(clone + 200, 0);
  w32(p + 260, clone);
  p = r32(p + 260);
  srcIt = r32(cur + 200);
  while (srcIt !== 0) {
    CharHlp.PrependItemCopy(p + 200, srcIt);
    srcIt = r32(srcIt + 42);
  }
}

export function EclMoveForward() {
  switch (U8[231434]) {
    case 0: {
      if (I8[231433] > 0) {
        U8[231433] = I8[231433] - 1;
      } else {
        U8[231433] = 15;
      }
      break;
    }
    case 2: {
      if (I8[231432] < 15) {
        U8[231432] = I8[231432] + 1;
      } else {
        U8[231432] = 0;
      }
      break;
    }
    case 4: {
      if (I8[231433] < 15) {
        U8[231433] = I8[231433] + 1;
      } else {
        U8[231433] = 0;
      }
      break;
    }
    case 6: {
      if (I8[231432] > 0) {
        U8[231432] = I8[231432] - 1;
      } else {
        U8[231432] = 15;
      }
      break;
    }
  }
  U8[231436] = View3D.GetMapEvent(I8[231432], I8[231433]);
  U8[231435] = View3D.GetWallType(I8[231432], I8[231433], U8[231434]);
}

export function RobMoney(fraction: number, creature: number) {
  w16(creature + 136, Math.trunc(r16(creature + 136) * fraction));
  w16(creature + 138, Math.trunc(r16(creature + 138) * fraction));
  w16(creature + 140, Math.trunc(r16(creature + 140) * fraction));
  w16(creature + 142, Math.trunc(r16(creature + 142) * fraction));
  w16(creature + 144, Math.trunc(r16(creature + 144) * fraction));
  w16(creature + 146, Math.trunc(r16(creature + 146) * fraction));
  w16(creature + 148, Math.trunc(r16(creature + 148) * fraction));
}

export async function RobItems(chance: number, creature: number) {
  let roll: number = 0, item: number = 0, nxt: number = 0;
  item = r32(creature + 200);
  while (item !== 0) {
    roll = Dice.RollDice(1, 100) & 255;
    nxt = r32(item + 42);
    if (roll <= CharHlp.TheftChance(chance, r16(item + 55))) {
      if (U8[item + 52] !== 0) {
        U8[item + 52] = 0;
        if (U8[item + 62] > 127) {
          (await FxEngine.CallEffectHandler(U8[item + 62], creature, item, true));
        }
      }
      (await CharHlp.RemoveItem(creature, item));
    }
    item = nxt;
  }
}

export function MoveExtremes(hiMove: number, loMove: number) {
  let p: number = 0, m: number = 0;
  U8[hiMove] = 0;
  U8[loMove] = 255;
  p = r32(229639);
  while (p !== 0) {
    m = CharHlp.HasteSlowRate(p, U8[p + 284]) & 255;
    if (m > U8[hiMove]) {
      U8[hiMove] = m;
    }
    if (m < U8[loMove]) {
      U8[loMove] = m;
    }
    p = r32(p + 260);
  }
}

export async function EclInflictDamage(dmg: number, creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 256);
  let pause: boolean = false;
  let $t1;
  if (($t1 = U8[creature + 268], $t1 === 6 || $t1 === 7 || $t1 === 8)) {
    { S.sp = $sp; return; }
  }
  if ((U8[creature + 283] + 10) < dmg) {
    wS($f0, 255, "  " + rS(creature) + " dies. ");
  } else {
    wS($f0, 255, "  " + rS(creature) + " is hit FOR " + StrUtil.NumStr(dmg) + " points of Damage.");
  }
  if (U8[229656] > 22) {
    U8[229656] = 17;
    pause = true;
    (await TextRend.DisplayAndPause(15, C_MSG.CONTINUE_PROMPT));
  } else {
    pause = false;
  }
  U8[229655] = 38;
  (await TextRend.ShowMessage(15, pause, rS($f0)));
  CharHlp.InflictDamage(creature, dmg);
  TextRend.ClearRect(17, 1, 38, 15);
  CharDisp.DisplayParty(r32(229635));
  S.sp = $sp;
}

export async function LoadCreatureData(id: number, creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 26);
  let offset: number = 0, item: number = 0, effect: number = 0, i: number = 0, roll: number = 0, demoNpc: boolean = false, itmId: number = 0;
  wS($f0 + 6, 1, rt.fmtI(U8[229120], 0));
  demoNpc = ((U8[227098] !== 0) && (id >= 240)) && (id <= 243);
  if (demoNpc) {
    wS($f0 + 8, 8, C_DEMO.ARCHIVE);
    wS($f0 + 17, 8, C_DEMO.ARCHIVE);
    itmId = (id + 8) & 255;
  } else {
    wS($f0 + 8, 8, "MON" + rS($f0 + 6) + "CHA");
    wS($f0 + 17, 8, "MON" + rS($f0 + 6) + "ITM");
    itmId = id;
  }
  (await DaxIo.LoadDax(rS($f0 + 8), ".dax", id, $f0, $f0 + 2));
  if (r16($f0) < 285) {
    (await TextRend.DisplayAndPause(15, "Unable to load monster"));
    (await GameIo.ExitGame());
  }
  DiskRec.CharFromDisk(r32($f0 + 2), creature);
  {
    const $w1 = creature;
    w32($w1 + 200, 0);
    w32($w1 + 127, 0);
    w32($w1 + 260, 0);
    w32($w1 + 264, 0);
    switch (I8[$w1 + 46]) {
      case 1: case 3: case 5: {
        U8[$w1 + 192] = 1;
        break;
      }
      case 2: case 4: case 6: case 7: {
        U8[$w1 + 192] = 2;
        break;
      }
    }
    for (let $i2 = 1; $i2 <= 6; $i2++) {
      i = $i2;
      if (i === 4) {
        U8[$w1 + i + 192] = 196;
      } else {
        roll = Dice.RollDice(1, 6) & 255;
        U8[$w1 + i + 192] = roll + ((roll + 8) << 4);
      }
    }
  }
  rt.freeMem(r32($f0 + 2));
  U8[229633] = true ? 1 : 0;
  w16($f0, 0);
  if (!demoNpc) {
    (await DaxIo.LoadDax("MON" + rS($f0 + 6) + "SPC", ".dax", id, $f0, $f0 + 2));
  }
  if (r16($f0) !== 0) {
    if (r16($f0) >= 9) {
      offset = 0;
      w32(creature + 127, rt.getMem(9));
      effect = r32(creature + 127);
      do {
        DiskRec.EffectFromDisk(r32($f0 + 2) + offset, effect);
        w32(effect + 5, 0);
        offset = (offset + 9) & 65535;
        if ((r16($f0) - offset) >= 9) {
          w32(effect + 5, rt.getMem(9));
          effect = r32(effect + 5);
        }
      } while (!((r16($f0) - offset) < 9));
    }
    rt.freeMem(r32($f0 + 2));
  }
  (await DaxIo.LoadDax(rS($f0 + 17), ".dax", itmId, $f0, $f0 + 2));
  if (r16($f0) !== 0) {
    if (r16($f0) >= 63) {
      offset = 0;
      w32(creature + 200, rt.getMem(64));
      item = r32(creature + 200);
      do {
        DiskRec.ItemFromDisk(r32($f0 + 2) + offset, item);
        w32(item + 42, 0);
        offset = (offset + 63) & 65535;
        if ((r16($f0) - offset) >= 63) {
          w32(item + 42, rt.getMem(64));
          item = r32(item + 42);
        }
      } while (!((r16($f0) - offset) < 63));
    }
    rt.freeMem(r32($f0 + 2));
  }
  U8[229633] = false ? 1 : 0;
  item = r32(creature + 200);
  while (item !== 0) {
    let $t6;
    if (((U8[item + 52] !== 0) && (U8[item + 62] > 127)) && !($t6 = U8[item + 62], $t6 === 132 || $t6 === 135)) {
      (await FxEngine.CallEffectHandler(U8[item + 62], creature, item, false));
    }
    item = r32(item + 42);
  }
  S.sp = $sp;
}

export async function AddCreatureToParty(id: number) {
  let creature: number = 0;
  if (r16(r32(227037) + 1660) >= 8) {
    return;
  }
  creature = rt.getMem(378);
  (await LoadCreatureData(id, creature));
  CharHlp.RecalcStats(creature);
  (await JoinParty(creature));
}

export async function JoinParty(creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let cnt: number = 0, i: number = 0;
  w32(creature + 260, 0);
  {
    const $w1 = creature;
    U8[$w1 + 171] = TpRand.Random(256);
    cnt = 0;
    for (let $i2 = 0; $i2 <= 6; $i2++) {
      i = $i2;
      if ((I8[$w1 + i + 150] > 0) && (cnt < 4)) {
        cnt = (cnt + 1) & 255;
        U8[$f0 + cnt - 1] = i;
      }
    }
    if (cnt === 0) {
      cnt = 1;
      U8[$f0 + cnt - 1] = 2;
    }
    cnt = Dice.RollDice(1, cnt) & 255;
    switch (U8[$f0 + cnt - 1]) {
      case 0: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 255454];
        break;
      }
      case 5: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 255474];
        break;
      }
      case 6: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 255484];
        break;
      }
      default: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 255464];
      }
    }
    U8[$w1 + 187] = U8[I8[$w1 + 158] * 8 + Dice.RollDice(1, 8) + 255438];
  }
  SaveLoad.AddCharToParty(creature);
  (await SaveLoad.LoadCharIconAnim(true));
  S.sp = $sp;
}

export function $init() {
  rt.fill(248851, 6, 0);
  U8[248857] = 0;
  rt.fill(248858, 2, 0);
  U8[248860] = false ? 1 : 0;
  U8[248861] = 0;
  U8[255438] = 0;
}
