// Generated from src/menucore.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as GameVars from './gamevars';
import * as Crt from './crt';
import * as GameIo from './gameio';
import * as Blit from './blit';
import * as Border from './border';
import * as Portrait from './portrait';
import * as C_KEYS from './c_keys';
import * as C_IFC from './c_ifc';
import * as TextRend from './textrend';
import * as StrUtil from './strutil';
import * as $hooks from '../host/hooks';


export const $at = { listOnly: 235272, arrowsToCaller: 235273, enterToCaller: 235274, extraKeys: 235275, unmarked: 235292, quickKeysToCaller: 235295, helpToCaller: 235296, memberKeysToCaller: 235297, movesToCaller: 235298, moved: 235299, fullPaging: 235300, lineScroll: 235301, idleHook: 235302, menuTimeout: 235306, menuDefaultKey: 235308 };

export function FindListMember(n: number, list: number) {
  let p: number = 0, i: number = 0, $r0: number = 0;
  i = 0;
  p = list;
  while ((p !== 0) && (i !== n)) {
    p = r32(p + 42);
    i = (i + 1) << 16 >> 16;
  }
  if (i === n) {
    $r0 = p;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function ListIndex(list: number, member: number) {
  let n: number = 0, $r0: number = 0;
  n = 0;
  while ((list !== 0) && (list !== member)) {
    list = r32(list + 42);
    n = (n + 1) << 16 >> 16;
  }
  if (list === 0) {
    $r0 = -1;
  } else {
    $r0 = n;
  }
  return $r0;
}

export function ListCount(list: number) {
  let p: number = 0, n: number = 0, $r0: number = 0;
  n = 0;
  p = list;
  while (p !== 0) {
    n = (n + 1) << 16 >> 16;
    p = r32(p + 42);
  }
  $r0 = n;
  return $r0;
}

export function PageRows(list: number, ulRow: number, lrRow: number, paged: boolean) {
  let rows: number = 0, $r0: number = 0;
  rows = (lrRow - ulRow) + 1;
  if (paged && (ListCount(list) > rows)) {
    rows = (rows - 1) << 16 >> 16;
  }
  $r0 = rows;
  return $r0;
}

export function DrawMore(leftCol: number, rightCol: number, row: number) {
  TextRend.DisplayCentered(leftCol, rightCol, row, 15, "(more)");
}

export function ScrollThumb(count: number, rows: number, top_: number, first: number, size: number) {
  if ((rows < 1) || (count <= rows)) {
    w16(first, 0);
    w16(size, rows);
  } else {
    w16(size, Math.trunc((rows * rows) / count) << 16 >> 16);
    if (ri16(size) < 1) {
      w16(size, 1);
    }
    if (top_ < 0) {
      top_ = 0;
    }
    if (top_ > (count - rows)) {
      top_ = (count - rows) << 16 >> 16;
    }
    w16(first, Math.trunc(((top_ * (rows - ri16(size))) + Math.trunc((count - rows) / 2)) / (count - rows)) << 16 >> 16);
    if (((ri16(first) === 0) && (top_ > 0)) && ((rows - ri16(size)) > 1)) {
      w16(first, 1);
    }
    if (((ri16(first) === (rows - ri16(size))) && (top_ < (count - rows))) && (ri16(first) > 1)) {
      w16(first, ri16(first) - 1);
    }
  }
}

export function DrawScrollBar(col: number, topRow: number, count: number, rows: number, top_: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 4);
  let r: number = 0;
  ScrollThumb(count, rows, top_, $f0, $f0 + 2);
  for (let $i1 = 0, $e1 = rows - 1; $i1 <= $e1; $i1++) {
    r = $i1;
    if ((r >= ri16($f0)) && (r < (ri16($f0) + ri16($f0 + 2)))) {
      TextRend.DisplayString(col, topRow + r, 15, "*");
    } else {
      TextRend.DisplayString(col, topRow + r, 8, "-");
    }
  }
  S.sp = $sp;
}

export async function MenuHorizontal(query: string, menu: string, qCol: number, mCol: number, hlCol: number, reinterpret: boolean, animate: boolean, ext: number) {
  let $r0: number = 0;
  $r0 = (await HorizontalMenu(query, menu, qCol, mCol, hlCol, reinterpret, animate, true, ext)) & 255;
  return $r0;
}

async function MenuVertical$impl(query: string, menu: string, qCol: number, mCol: number, hlCol: number, ulCol: number, ulRow: number, lrCol: number, lrRow: number, list: number, addExit: boolean, redraw: number, idx: number, sel: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 59);
  let width: number = 0, count: number = 0, rows: number = 0, ch: number = 0, hasNext: boolean = false, hasPrev: boolean = false, p: number = 0, headerCnt: number = 0, toCaller: boolean = false, memberKeys: boolean = false, oldIdx: number = 0, oldTop: number = 0, paged: boolean = false, scrolls: boolean = false, $r0: number = 0;
  function DrawPage(top_: number) {
    let pp: number = 0, row: number = 0;
    Border.ClearBox(ulCol, ulRow, lrCol, lrRow);
    pp = FindListMember(top_, list);
    row = ulRow;
    while ((pp !== 0) && (row < (ulRow + rows))) {
      if (U8[pp + 41] !== 0) {
        TextRend.DisplayString(ulCol, row, qCol, rS(pp));
      } else {
        TextRend.DisplayString(ulCol, row, mCol, rS(pp));
      }
      if (U8[pp] < width) {
        TextRend.RenderChar(ulCol + U8[pp], row, 0, 0, width - U8[pp], 32, 1);
      }
      pp = r32(pp + 42);
      row = (row + 1) << 24 >> 24;
    }
    if (paged && ((top_ + rows) < count)) {
      DrawMore(ulCol, lrCol, lrRow);
    }
    if (scrolls && (count > rows)) {
      DrawScrollBar(lrCol, ulRow, count, rows, top_);
    }
  }
  function FirstNonBlank(s: string) {
    let i: number = 0, len: number = 0, $r1: number = 0;
    i = 1;
    len = s.length;
    while ((i < len) && (rt.chAt(s, i) === 32)) {
      i = (i + 1) & 255;
    }
    $r1 = i;
    return $r1;
  }
  function LastNonBlank(s: string) {
    let n: number = 0, $r1: number = 0;
    n = s.length;
    while ((n > 1) && (rt.chAt(s, n) === 32)) {
      n = (n - 1) & 255;
    }
    $r1 = n;
    return $r1;
  }
  function HighlightLine(n: number) {
    let pp: number = 0, a: number = 0, b: number = 0;
    pp = FindListMember(n, list);
    a = FirstNonBlank(rS(pp)) & 255;
    b = ((LastNonBlank(rS(pp)) - a) + 1) & 255;
    TextRend.DisplayStringOn((ulCol + a) - 1, ulRow + (n - ri16(231527)), 0, hlCol, rt.Copy(rS(pp), a, b));
  }
  function UnhighlightLine(n: number) {
    let pp: number = 0, a: number = 0, b: number = 0;
    pp = FindListMember(n, list);
    a = FirstNonBlank(rS(pp)) & 255;
    b = ((LastNonBlank(rS(pp)) - a) + 1) & 255;
    if (U8[pp + 41] !== 0) {
      TextRend.DisplayString((ulCol + a) - 1, ulRow + (n - ri16(231527)), qCol, rt.Copy(rS(pp), a, b));
    } else {
      TextRend.DisplayString((ulCol + a) - 1, ulRow + (n - ri16(231527)), mCol, rt.Copy(rS(pp), a, b));
    }
  }
  function SkipLabels(down: boolean) {
    let k: number = 0;
    k = 0;
    if (down) {
      while ((k < rows) && (U8[FindListMember(ri16(idx), list) + 41] !== 0)) {
        k = (k + 1) << 16 >> 16;
        w16(idx, ri16(idx) + 1);
        if (((ri16(231527) + rows) - 1) < ri16(idx)) {
          w16(idx, ri16(231527));
        }
        if ((count - 1) < ri16(idx)) {
          w16(idx, ri16(231527));
        }
      }
    } else {
      while ((k < rows) && (U8[FindListMember(ri16(idx), list) + 41] !== 0)) {
        k = (k + 1) << 16 >> 16;
        w16(idx, ri16(idx) - 1);
        if (ri16(idx) < ri16(231527)) {
          w16(idx, (ri16(231527) + rows) - 1);
        }
        if ((count - 1) < ri16(idx)) {
          w16(idx, count - 1);
        }
      }
    }
  }
  function MovePage(down: boolean) {
    let rel: number = 0;
    rel = (ri16(idx) - ri16(231527)) << 16 >> 16;
    if (down) {
      w16(231527, ri16(231527) + rows);
      if ((count - rows) < ri16(231527)) {
        w16(231527, count - rows);
      }
    } else {
      w16(231527, ri16(231527) - rows);
      if (ri16(231527) < 0) {
        w16(231527, 0);
      }
    }
    w16(idx, ri16(231527) + rel);
    SkipLabels(down);
    DrawPage(ri16(231527));
  }
  function ScrollLine(down: boolean) {
    let k: number = 0;
    k = ri16(idx);
    do {
      if (down) {
        k = (k + 1) << 16 >> 16;
      } else {
        k = (k - 1) << 16 >> 16;
      }
    } while (!(((k < 0) || (k > (count - 1))) || (U8[FindListMember(k, list) + 41] === 0)));
    if ((k >= 0) && (k <= (count - 1))) {
      w16(idx, k);
    }
    if (ri16(idx) > (count - 1)) {
      w16(idx, count - 1);
    }
    if (ri16(idx) < ri16(231527)) {
      w16(231527, ri16(idx));
      DrawPage(ri16(231527));
    } else if (ri16(idx) > ((ri16(231527) + rows) - 1)) {
      w16(231527, (ri16(idx) - rows) + 1);
      DrawPage(ri16(231527));
    }
  }
  function MoveLine(down: boolean) {
    if (scrolls) {
      ScrollLine(down);
      return;
    }
    if (down) {
      w16(idx, ri16(idx) + 1);
      if (((ri16(231527) + rows) - 1) < ri16(idx)) {
        w16(idx, ri16(231527));
      }
      if ((count - 1) < ri16(idx)) {
        w16(idx, ri16(231527));
      }
    } else {
      w16(idx, ri16(idx) - 1);
      if (ri16(idx) < ri16(231527)) {
        w16(idx, (ri16(231527) + rows) - 1);
      }
      if ((count - 1) < ri16(idx)) {
        w16(idx, count - 1);
      }
    }
    SkipLabels(down);
  }
  wS($f0 + 42, 16, rS(235275));
  wS(235275, 16, "");
  toCaller = (U8[235298] !== 0);
  U8[235298] = false ? 1 : 0;
  memberKeys = (U8[235297] !== 0);
  U8[235297] = false ? 1 : 0;
  U8[235299] = false ? 1 : 0;
  paged = (U8[235300] !== 0);
  U8[235300] = false ? 1 : 0;
  scrolls = (U8[235301] !== 0);
  U8[235301] = false ? 1 : 0;
  if (list === 0) {
    U8[235272] = false ? 1 : 0;
    w16(idx, 0);
    w32(sel, 0);
    $r0 = 0;
  } else {
    U8[231529] = 1;
    if (scrolls) {
      width = ((lrCol - ulCol) - 1) & 255;
    } else {
      width = ((lrCol - ulCol) + 1) & 255;
    }
    count = ListCount(list) << 16 >> 16;
    rows = PageRows(list, ulRow, lrRow, paged) << 16 >> 16;
    paged = paged && (rows < ((lrRow - ulRow) + 1));
    p = list;
    headerCnt = 0;
    while ((p !== 0) && (U8[p + 41] !== 0)) {
      p = r32(p + 42);
      headerCnt = (headerCnt + 1) << 16 >> 16;
    }
    if (ri16(231527) > ri16(idx)) {
      w16(231527, ri16(idx));
      U8[redraw] = true ? 1 : 0;
    }
    if (ri16(231527) > count) {
      w16(231527, 0);
      U8[redraw] = true ? 1 : 0;
    }
    if (ri16(idx) > (count - 1)) {
      w16(idx, count - 1);
    }
    if (ri16(idx) > ((ri16(231527) + rows) - 1)) {
      w16(231527, (ri16(idx) - rows) + 1);
      U8[redraw] = true ? 1 : 0;
    }
    if ((scrolls && (ri16(231527) > 0)) && (ri16(231527) > (count - rows))) {
      w16(231527, count - rows);
      if (ri16(231527) < 0) {
        w16(231527, 0);
      }
      U8[redraw] = true ? 1 : 0;
    }
    w16(idx, ri16(idx) + 1);
    MoveLine(false);
    if ((U8[redraw] !== 0)) {
      DrawPage(ri16(231527));
    }
    U8[redraw] = false ? 1 : 0;
    if ((U8[235272] !== 0)) {
      U8[235272] = false ? 1 : 0;
      if (count <= rows) {
        w32(sel, 0);
        $r0 = 0;
        { S.sp = $sp; return $r0; }
      }
    }
    do {
      HighlightLine(ri16(idx));
      wS($f0 + 1, 40, menu);
      hasNext = false;
      hasPrev = false;
      if (paged || ((count - rows) > ri16(231527))) {
        if (!scrolls) {
          wS($f0 + 1, 40, rS($f0 + 1) + " Next");
        }
        hasNext = true;
      }
      if (paged || (ri16(231527) > headerCnt)) {
        if (!scrolls) {
          wS($f0 + 1, 40, rS($f0 + 1) + " Prev");
        }
        hasPrev = true;
      }
      if (addExit) {
        wS($f0 + 1, 40, rS($f0 + 1) + " Exit");
      }
      wS(235275, 16, rS($f0 + 42));
      ch = (await HorizontalMenu(query, rS($f0 + 1), qCol, mCol, hlCol, true, false, false, $f0)) & 255;
      UnhighlightLine(ri16(idx));
      oldIdx = ri16(idx);
      oldTop = ri16(231527);
      if ((U8[$f0] !== 0)) {
        switch (ch) {
          case 71: case 72: {
            MoveLine(false);
            break;
          }
          case 79: case 80: {
            MoveLine(true);
            break;
          }
          case 73: {
            if (hasPrev) {
              MovePage(false);
            }
            break;
          }
          case 81: {
            if (hasNext) {
              MovePage(true);
            }
            break;
          }
          case 120: case 121: case 122: case 123: case 124: case 125: case 126: case 127: {
            if (memberKeys) {
              w32(sel, FindListMember(ri16(idx), list));
              $r0 = ch;
              { S.sp = $sp; return $r0; }
            }
            break;
          }
        }
      } else {
        switch (ch) {
          case 80: {
            if (hasPrev && !scrolls) {
              MovePage(false);
            }
            break;
          }
          case 78: {
            if (hasNext && !scrolls) {
              MovePage(true);
            }
            break;
          }
          case 27: case 69: case 0: {
            w32(sel, 0);
            $r0 = 0;
            { S.sp = $sp; return $r0; }
            break;
          }
          default: {
            w32(sel, FindListMember(ri16(idx), list));
            $r0 = ch;
            { S.sp = $sp; return $r0; }
          }
        }
      }
      if (toCaller && ((ri16(idx) !== oldIdx) || (ri16(231527) !== oldTop))) {
        w32(sel, FindListMember(ri16(idx), list));
        U8[235299] = true ? 1 : 0;
        $r0 = ch;
        { S.sp = $sp; return $r0; }
      }
    } while (!(false));
  }
  S.sp = $sp;
  return $r0;
}
export async function MenuVertical(...a) {
  $hooks.enter("MenuCore.MenuVertical", a);
  try {
    return (await MenuVertical$impl(...a));
  } finally {
    $hooks.leave("MenuCore.MenuVertical");
  }
}

export async function YesNoMenu(query: string, qCol: number, mCol: number, hlCol: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let ch: number = 0, $r0: number = 0;
  U8[231529] = 2;
  do {
    ch = (await MenuHorizontal(query, "Yes No", qCol, mCol, hlCol, false, false, $f0)) & 255;
    if ((U8[227098] !== 0)) {
      ch = 78;
    }
  } while (!(ch === 89 || ch === 78));
  $r0 = ch;
  S.sp = $sp;
  return $r0;
}

export function AppendMenuLine(head: number, tail: number, name_: string, title: boolean) {
  let n: number = 0;
  n = rt.getMem(46);
  w32(n + 42, 0);
  wS(n, 40, name_);
  U8[n + 41] = (title ? 1 : 0);
  if (r32(head) === 0) {
    w32(head, n);
  } else {
    w32(r32(tail) + 42, n);
  }
  w32(tail, n);
}

export function AllocStringList(n: number, list: number) {
  let p: number = 0, i: number = 0;
  w32(list, rt.getMem(46));
  w32(r32(list) + 42, 0);
  U8[r32(list) + 41] = 0;
  wS(r32(list), 40, "");
  p = r32(list);
  for (let $i1 = 2, $e1 = n; $i1 <= $e1; $i1++) {
    i = $i1;
    w32(p + 42, rt.getMem(46));
    p = r32(p + 42);
    w32(p + 42, 0);
    U8[p + 41] = 0;
    wS(p, 40, "");
  }
}

export function FreeStringList(list: number) {
  let p: number = 0, q: number = 0;
  p = r32(list);
  while (p !== 0) {
    q = p;
    p = r32(p + 42);
    rt.freeMem(q);
  }
}

async function HorizontalMenu$impl(query: string, menu: string, qCol: number, mCol: number, hlCol: number, reinterpret: boolean, animate: boolean, takeOption: boolean, ext: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 40);
  let frameTick: number = 0, ch: number = 0, i: number = 0, done: boolean = false, mLen: number = 0, qLen: number = 0, optCnt: number = 0, enterOk: boolean = false, waitStart: number = 0, $r0: number = 0;
  function ParseMenu(m: string) {
    let idx: number = 0, i: number = 0, len: number = 0;
    rt.fill($f0, 40, 0);
    idx = 1;
    len = m.length;
    for (let $i1 = 1, $e1 = len; $i1 <= $e1; $i1++) {
      i = $i1;
      let $t2;
      if (($t2 = rt.chAt(m, i), ($t2 >= 48 && $t2 <= 57) || ($t2 >= 65 && $t2 <= 90))) {
        if (U8[$f0 + idx * 2 - 2] === 0) {
          U8[$f0 + idx * 2 - 2] = i;
        } else if (idx < 20) {
          U8[$f0 + idx * 2 - 1] = i - 2;
          idx = (idx + 1) & 255;
          U8[$f0 + idx * 2 - 2] = i;
        }
      }
    }
    U8[$f0 + idx * 2 - 1] = len;
    optCnt = idx;
  }
  function OptionAt(i: number) {
    let j: number = 0, $r1: number = 0;
    j = 1;
    while ((j < optCnt) && (U8[$f0 + j * 2 - 2] !== i)) {
      j = (j + 1) & 255;
    }
    $r1 = j;
    return $r1;
  }
  function DisplayOption(cur: number) {
    const $sp = S.sp, $f1 = (S.sp = $sp - 2);
    let i: number = 0, nextFirst: number = 0;
    if (mLen > 0) {
      U8[$f1] = U8[$f0 + cur * 2 - 2];
      U8[$f1 + 1] = U8[$f0 + cur * 2 - 1];
      if (U8[$f1] > 0) {
        nextFirst = 0;
        if (cur < optCnt) {
          nextFirst = U8[$f0 + (cur + 1) * 2 - 2];
        }
        StrUtil.OptionSpan(menu, U8[$f0 + cur * 2 - 2], nextFirst, $f1, $f1 + 1);
      }
      for (let $i4 = 1, $e4 = mLen; $i4 <= $e4; $i4++) {
        i = $i4;
        let $t5;
        if (((U8[$f1] <= i) && (U8[$f1 + 1] >= i)) && (hlCol !== 0)) {
          TextRend.RenderChar((qLen + i) - 1, 24, 0, hlCol, 1, rt.chAt(menu, i), 1);
        } else if (($t5 = rt.chAt(menu, i), ($t5 >= 48 && $t5 <= 57) || ($t5 >= 65 && $t5 <= 90)) && !rt.inM(235292, 0, 3, OptionAt(i))) {
          TextRend.RenderChar((qLen + i) - 1, 24, hlCol, 0, 1, rt.chAt(menu, i), 1);
        } else {
          TextRend.RenderChar((qLen + i) - 1, 24, mCol, 0, 1, rt.chAt(menu, i), 1);
        }
      }
      if ((qLen + mLen) <= 39) {
        TextRend.RenderChar(qLen + mLen, 24, 0, 0, ((39 - mLen) - qLen) + 1, 32, 1);
      }
    }
    S.sp = $sp;
  }
  function RedrawLine() {
    if (query.length !== 0) {
      TextRend.DisplayString(0, 24, qCol, query);
    }
    DisplayOption(U8[231529]);
  }
  async function Unavailable(msg: string) {
    if (U8[227062] !== 5) {
      (await TextRend.DisplayAndPause(14, msg));
      TextRend.ClearBottomLine();
      RedrawLine();
    }
  }
  function StepOption(toNext: boolean) {
    if (toNext) {
      if (U8[231529] === optCnt) {
        U8[231529] = 1;
      } else {
        U8[231529] = U8[231529] + 1;
      }
    } else if (U8[231529] === 1) {
      U8[231529] = optCnt;
    } else {
      U8[231529] = U8[231529] - 1;
    }
    DisplayOption(U8[231529]);
  }
  enterOk = (mCol !== 0) || (hlCol !== 0);
  ParseMenu(menu);
  if ((U8[231529] < 1) || (U8[231529] > optCnt)) {
    U8[231529] = 1;
  }
  mLen = menu.length;
  ch = 0;
  U8[ext] = false ? 1 : 0;
  done = false;
  frameTick = (await TextRend.GetTicks()) | 0;
  waitStart = frameTick;
  if (query.length !== 0) {
    TextRend.DisplayString(0, 24, qCol, query);
  }
  qLen = query.length;
  DisplayOption(U8[231529]);
  do {
    if (r32(235302) !== 0) {
      (await rt.FT[r32(235302)]());
    }
    if ((await TextRend.GetTicks()) < frameTick) {
      frameTick = (await TextRend.GetTicks()) | 0;
    }
    if ((await TextRend.GetTicks()) < waitStart) {
      waitStart = (await TextRend.GetTicks()) | 0;
    }
    if (((r16(235306) > 0) && (((await TextRend.GetTicks()) - waitStart) >= r16(235306))) && !(await Crt.KeyPressed())) {
      ch = U8[235308];
      done = true;
    }
    if (((r16(r32(227033) + 1022) !== 0) || animate) && (U8[231450] > 0)) {
      Portrait.DisplayImageBuf(3, 3, animate, r32(U8[231450] * 8 + 231447));
      if ((((await TextRend.GetTicks()) - frameTick) >= (ri32(U8[231450] * 8 + 231443) * 10)) || (r16(r32(227033) + 1022) !== 0)) {
        U8[231450] = U8[231450] + 1;
        if (U8[231450] > U8[231449]) {
          U8[231450] = 1;
        }
        frameTick = (await TextRend.GetTicks()) | 0;
      }
    }
    if (!done && ((await Crt.KeyPressed()) || (U8[227098] !== 0))) {
      ch = (await GameIo.ReadGameKey()) & 255;
      waitStart = (await TextRend.GetTicks()) | 0;
      if ((U8[227106] !== 0)) {
        U8[227106] = false ? 1 : 0;
        RedrawLine();
      }
      if (ch === 0) {
        ch = (await GameIo.ReadGameKey()) & 255;
        if (((ch === 75) || (ch === 77)) && !(U8[235273] !== 0)) {
          StepOption(ch === 77);
        } else if (((ch === 63) || (ch === 66)) && !(U8[235295] !== 0)) {
          (await Unavailable("Quick save and load unavailable."));
        } else if (ch === 59) {
          if ((U8[235296] !== 0)) {
            U8[ext] = true ? 1 : 0;
            done = true;
          } else {
            (await Unavailable("Help is on the map and camp menus."));
          }
        } else if (reinterpret || (((U8[235297] !== 0) && (ch >= 120)) && (ch <= 127))) {
          U8[ext] = true ? 1 : 0;
          done = true;
        }
      } else {
        switch (ch) {
          case 27: {
            done = true;
            ch = 0;
            break;
          }
          case 13: {
            if (enterOk) {
              if ((takeOption && !(U8[235274] !== 0)) && (U8[$f0 + U8[231529] * 2 - 2] !== 0)) {
                ch = rt.chAt(menu, U8[$f0 + U8[231529] * 2 - 2]);
              } else {
                ch = 13;
              }
              done = true;
            }
            break;
          }
          case 44: {
            StepOption(false);
            break;
          }
          case 46: {
            StepOption(true);
            break;
          }
          default: {
            ch = rt.UpCase(ch);
            if (ch === 32 || (ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 90)) {
              if (ch === 32) {
                done = true;
              } else {
                for (let $i7 = 1, $e7 = mLen; $i7 <= $e7; $i7++) {
                  i = $i7;
                  if ((rt.chAt(menu, i) === ch) && !rt.inM(235292, 0, 3, OptionAt(i))) {
                    done = true;
                    U8[231529] = OptionAt(i);
                    DisplayOption(U8[231529]);
                  }
                }
              }
            }
            if ((ch !== 32) && (rt.Pos(String.fromCharCode(ch), rS(235275)) > 0)) {
              done = true;
            }
            if (reinterpret && !done) {
              if ((ch >= 49 && ch <= 57) || ch === 92) {
                if (ch === 92) {
                  ch = 55;
                } else {
                  ch = U8[(ch - 49) + 235320];
                }
                U8[ext] = true ? 1 : 0;
                done = true;
              }
            }
          }
        }
      }
    }
  } while (!(done));
  U8[235273] = false ? 1 : 0;
  U8[235274] = false ? 1 : 0;
  wS(235275, 16, "");
  rt.wSet(235292, 0, 3, rt.setR());
  U8[235295] = false ? 1 : 0;
  U8[235296] = false ? 1 : 0;
  w16(235306, 0);
  U8[235308] = 0;
  U8[235297] = false ? 1 : 0;
  w16(r32(227033) + 1022, 0);
  $r0 = ch;
  S.sp = $sp;
  return $r0;
}
export async function HorizontalMenu(...a) {
  $hooks.enter("MenuCore.HorizontalMenu", a);
  try {
    return (await HorizontalMenu$impl(...a));
  } finally {
    $hooks.leave("MenuCore.HorizontalMenu");
  }
}

export function $init() {
  U8[235272] = false ? 1 : 0;
  U8[235273] = false ? 1 : 0;
  U8[235274] = false ? 1 : 0;
  U8[235298] = false ? 1 : 0;
  U8[235299] = false ? 1 : 0;
  U8[235300] = false ? 1 : 0;
  U8[235301] = false ? 1 : 0;
  wS(235275, 16, "");
  rt.wSet(235292, 0, 3, rt.setR());
  U8[235295] = false ? 1 : 0;
  U8[235296] = false ? 1 : 0;
  w16(235306, 0);
  U8[235308] = 0;
  U8[235297] = false ? 1 : 0;
  w32(235302, 0);
}
