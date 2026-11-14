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


export const $at = { cmpFlags: 240659, iconAnimId: 240665, monsterFlags: 240666, picDrawn: 240668, protTextShown: 240669, picIdShown: 247246 };

export function EclInit() {
  let i: number = 0;
  U8[146748] = false ? 1 : 0;
  U8[240669] = 0;
  U8[146744] = false ? 1 : 0;
  U8[146745] = false ? 1 : 0;
  U8[146537] = 65;
  U8[146538] = 9;
  U8[146750] = true ? 1 : 0;
  rt.fill(240666, 2, 0);
  U8[240665] = 8;
  w16(141174, 39168);
  w32(146539, 0);
  w32(146543, 0);
  rt.fill(240659, 6, 0);
  w16(r32(141151) + 1474, 255);
  w16(r32(141151) + 1444, 0);
  w16(r32(141151) + 1446, 0);
  w16(r32(141147) + 458, 0);
  for (let $i1 = 1; $i1 <= 5; $i1++) {
    i = $i1;
    EclVars.LoadEclVars(1);
    w16(i * 2 + 141162, EclVars.CombineBytesToWord(U8[146676], U8[146612]));
  }
  w16(r32(141147) + 460, 1);
  if (U8[141221] === 0) {
    for (let $i2 = 18944; $i2 <= 18975; $i2++) {
      i = $i2;
      w16(r32(141147) + i * 2 - 37376, 0);
    }
    for (let $i3 = 28281; $i3 <= 28290; $i3++) {
      i = $i3;
      w16(r32(141151) + i * 2 - 54784, 0);
    }
  } else {
    U8[141221] = 0;
  }
}

export async function LoadEclScript(scriptId: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 10);
  let disk: number = 0, n: number = 0, found: boolean = false;
  rt.fill(r32(141159), 9984, 0);
  if ((U8[141212] !== 0)) {
    U8[143747] = true ? 1 : 0;
    (await DaxIo.LoadDax(C_DEMO.ARCHIVE, ".dax", scriptId, $f0 + 4, $f0 + 6));
    U8[143747] = false ? 1 : 0;
    if (r16($f0 + 4) > 2) {
      n = (r16($f0 + 4) - 2) & 65535;
      if (n > 9984) {
        n = 9984;
      }
      mv(r32(141159), r32($f0 + 6) + 2, n);
    } else {
      U8[141213] = true ? 1 : 0;
    }
    if (r32($f0 + 6) !== 0) {
      rt.freeMem(r32($f0 + 6));
    }
    { S.sp = $sp; return; }
  }
  U8[143747] = false ? 1 : 0;
  TextRend.ClearBottomLine();
  TextRend.DisplayString(0, 24, 15, "Loading...Please Wait");
  let $t1;
  if (!($t1 = U8[143234], ($t1 >= 1 && $t1 <= 8))) {
    DaxIo.PushState(1);
  }
  wS($f0, 3, rt.fmtI(U8[143234], 0));
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
      wS($f0, 3, rt.fmtI(U8[143234], 0));
    }
  }
  (await DaxIo.LoadDax("ECL" + rS($f0), ".dax", scriptId, $f0 + 4, $f0 + 6));
  if (r16($f0 + 4) < 2) {
    U8[143747] = true ? 1 : 0;
    disk = 1;
    while ((r16($f0 + 4) < 2) && (disk <= 8)) {
      if (disk !== U8[143234]) {
        wS($f0, 3, rt.fmtI(disk, 0));
        (await DaxIo.LoadDax("ECL" + rS($f0), ".dax", scriptId, $f0 + 4, $f0 + 6));
        if (r16($f0 + 4) >= 2) {
          DaxIo.PushState(disk);
        }
      }
      disk = (disk + 1) & 255;
    }
    U8[143747] = false ? 1 : 0;
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
  mv(r32(141159), r32($f0 + 6) + 2, n);
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
  if (r16(r32(141147) + 460) === 0) {
    $r0 = 2;
    w16(r32(141151) + 1410, 2);
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
  U8[240668] = false ? 1 : 0;
  U8[240458] = headId;
  U8[240459] = bodyId;
  (await Portrait.LoadPortraitBufs(headId, bodyId));
  (await Portrait.DisplayPortraitBufs(3, 3, true));
}

export async function DisplayMonster(sprId: number, picId: number, dist: number, flags: number) {
  let d3: number = 0;
  if (!(U8[flags + 1] !== 0) && (U8[flags] !== 0)) {
    (await MapView.DisplayMapView());
  }
  d3 = (dist + 1) & 255;
  if (!(U8[flags + 1] !== 0)) {
    if (!(U8[flags] !== 0)) {
      if ((U8[145545] !== 0)) {
        U8[145545] = false ? 1 : 0;
        (await MapView.DisplayMapView());
      }
      (await Portrait.LoadAnimation("SPRIT", sprId, 1, 145563));
      U8[flags] = true ? 1 : 0;
      U8[146749] = true ? 1 : 0;
    }
    if (U8[141223] === 1) {
      (await Portrait.Show3DSprite(d3, 145563));
    } else {
      (await Portrait.Show3DSprite(2, 145563));
    }
  }
  if ((U8[flags + 1] !== 0)) {
    if (U8[247246] === r16(r32(141151) + 1474)) {
      return;
    }
  }
  if (dist !== 0) {
    return;
  }
  if (U8[141223] !== 1) {
    return;
  }
  if ((U8[146751] !== 0) && ((U8[141177] === 0) || (U8[141179] === 0))) {
    return;
  }
  U8[247246] = r16(r32(141151) + 1474) & 255;
  U8[146748] = true ? 1 : 0;
  if (r16(r32(141151) + 1474) === 255) {
    (await Portrait.LoadAnimation("PIC", picId, 0, 145563));
    U8[flags + 1] = true ? 1 : 0;
    (await Portrait.DisplayImageBuf(3, 3, true, r32(145569)));
  } else {
    (await DisplayPortrait(r16(r32(141151) + 1474) & 255, picId));
    U8[flags + 1] = true ? 1 : 0;
    U8[240668] = false ? 1 : 0;
  }
}

export async function MenuHorizontalCharacterSelect(query: string, menu: string, qCol: number, mCol: number, hlCol: number, enterOk: boolean, animate: boolean) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 513);
  wS($f0, 255, menu);
  let idx: number = 0, ch: number = 0, $r0: number = 0;
  StrUtil.MenuToOptions($f0, $f0 + 256);
  U8[145643] = 1;
  do {
    ch = (await MenuCore.MenuHorizontal(query, rS($f0), qCol, mCol, hlCol, true, animate, $f0 + 512)) & 255;
    if ((U8[$f0 + 512] !== 0)) {
      Party.SelectPrevNextChar(ch);
      (await CharDisp.DisplayParty(r32(143749)));
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
  rt.fill(240659, 6, 0);
  if (s1 === s2) {
    U8[240659] = true ? 1 : 0;
  }
  if (s1 !== s2) {
    U8[240660] = true ? 1 : 0;
  }
  if (s1 < s2) {
    U8[240661] = true ? 1 : 0;
  }
  if (s1 > s2) {
    U8[240662] = true ? 1 : 0;
  }
  if (s1 <= s2) {
    U8[240663] = true ? 1 : 0;
  }
  if (s1 >= s2) {
    U8[240664] = true ? 1 : 0;
  }
}

export function EclCompareInt(v1: number, v2: number) {
  rt.fill(240659, 6, 0);
  if (v1 === v2) {
    U8[240659] = true ? 1 : 0;
  }
  if (v1 !== v2) {
    U8[240660] = true ? 1 : 0;
  }
  if (v1 < v2) {
    U8[240661] = true ? 1 : 0;
  }
  if (v1 > v2) {
    U8[240662] = true ? 1 : 0;
  }
  if (v1 <= v2) {
    U8[240663] = true ? 1 : 0;
  }
  if (v1 >= v2) {
    U8[240664] = true ? 1 : 0;
  }
}

export function EclGosub(varIdx: number) {
  w32(146543, r32(146539));
  w32(146539, rt.getMem(6));
  w32(r32(146539) + 2, r32(146543));
  w16(r32(146539), r16(141174));
  w16(141174, EclVars.CombineBytesToWord(U8[varIdx + 146675], U8[varIdx + 146611]));
}

export async function CharFightsAlone(mirror: number) {
  let p: number = 0, clone: number = 0, cur: number = 0, srcIt: number = 0, slot: number = 0;
  U8[146746] = true ? 1 : 0;
  w16(r32(141151) + 1484, mirror);
  cur = r32(143749);
  p = r32(143753);
  while (p !== 0) {
    if (rS(p) !== rS(cur)) {
      U8[p + 269] = 0;
    }
    p = r32(p + 260);
  }
  if (mirror === 0) {
    return;
  }
  slot = U8[240665];
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
  switch (U8[145548]) {
    case 0: {
      if (I8[145547] > 0) {
        U8[145547] = I8[145547] - 1;
      } else {
        U8[145547] = 15;
      }
      break;
    }
    case 2: {
      if (I8[145546] < 15) {
        U8[145546] = I8[145546] + 1;
      } else {
        U8[145546] = 0;
      }
      break;
    }
    case 4: {
      if (I8[145547] < 15) {
        U8[145547] = I8[145547] + 1;
      } else {
        U8[145547] = 0;
      }
      break;
    }
    case 6: {
      if (I8[145546] > 0) {
        U8[145546] = I8[145546] - 1;
      } else {
        U8[145546] = 15;
      }
      break;
    }
  }
  U8[145550] = View3D.GetMapEvent(I8[145546], I8[145547]);
  U8[145549] = View3D.GetWallType(I8[145546], I8[145547], U8[145548]);
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
  p = r32(143753);
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
  if (U8[143770] > 22) {
    U8[143770] = 17;
    pause = true;
    (await TextRend.DisplayAndPause(15, C_MSG.CONTINUE_PROMPT));
  } else {
    pause = false;
  }
  U8[143769] = 38;
  (await TextRend.ShowMessage(15, pause, rS($f0)));
  CharHlp.InflictDamage(creature, dmg);
  (await TextRend.ClearRect(17, 1, 38, 15));
  (await CharDisp.DisplayParty(r32(143749)));
  S.sp = $sp;
}

export async function LoadCreatureData(id: number, creature: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 26);
  let offset: number = 0, item: number = 0, effect: number = 0, i: number = 0, roll: number = 0, demoNpc: boolean = false, itmId: number = 0;
  wS($f0 + 6, 1, rt.fmtI(U8[143234], 0));
  demoNpc = ((U8[141212] !== 0) && (id >= 240)) && (id <= 243);
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
  U8[143747] = true ? 1 : 0;
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
  U8[143747] = false ? 1 : 0;
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
  if (r16(r32(141151) + 1660) >= 8) {
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
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 247262];
        break;
      }
      case 5: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 247282];
        break;
      }
      case 6: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 247292];
        break;
      }
      default: {
        U8[$w1 + 188] = U8[I8[$w1 + 158] * 5 + Dice.RollDice(1, 5) + 247272];
      }
    }
    U8[$w1 + 187] = U8[I8[$w1 + 158] * 8 + Dice.RollDice(1, 8) + 247246];
  }
  SaveLoad.AddCharToParty(creature);
  (await SaveLoad.LoadCharIconAnim(true));
  S.sp = $sp;
}

export function $init() {
  rt.fill(240659, 6, 0);
  U8[240665] = 0;
  rt.fill(240666, 2, 0);
  U8[240668] = false ? 1 : 0;
  U8[240669] = 0;
  U8[247246] = 0;
}
