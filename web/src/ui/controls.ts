/**
 * controls.ts
 *
 * Playing with a finger. The game is a keyboard game: a line of options along the foot of the screen, each chosen by
 * its capital letter or stepped to with the arrows and taken with Enter. On a phone that line is too small to touch,
 * so it is shown again under the screen, in the game's own letters and colours at a size a finger can hit: touch an
 * option to choose it. Under it are the keys, which never change or move: the arrows, OK (Enter) and Back (Escape).
 * Everything the game can be asked, it can be asked with those.
 *
 * The screen itself answers a tap as well: a line of a list, a line that starts with an option's letter, the 3D view
 * to walk and turn, and the battlefield to walk a fighter to a square or into a foe.
 *
 * What to show comes from the game: the translator has the menu routines report their arguments (host/hooks.ts), so
 * the line under the screen is always the line the game is waiting on. A keyboard still plays as it does on a PC.
 */
import { U8, rS } from '../rt/mem';
import * as hooks from '../host/hooks';
import { pushKey } from '../host/platform';
import { units } from '../boot';
import * as text from './text';
import * as screen from './screen';

const strip = document.getElementById('strip') as HTMLDivElement;
const pad = document.getElementById('pad') as HTMLDivElement;
const canvas = document.getElementById('screen') as HTMLCanvasElement;
const typer = document.getElementById('typer') as HTMLInputElement;

// extended keys' scan codes
const UP = 72;
const DOWN = 80;
const LEFT = 75;
const RIGHT = 77;
const HOME = 71;
const END = 79;
const PGUP = 73;
const PGDN = 81;

// the game's colours (EGA numbers)
const GREEN = 10;
const WHITE = 15;
const MAGENTA = 13;
const GRAY = 7;

export const settings = {
  /** Called for the pause menu. */
  onMenu: (() => {}) as () => void,
  /** Called at the first touch or key, so sound may start. */
  onGesture: (() => {}) as () => void,
};

function key(ch: number): void {
  pushKey(0, ch);
}

function ext(scan: number): void {
  pushKey(scan, 0);
}

function letter(c: string): void {
  key(c.charCodeAt(0));
}

// ---- what the game is asking

interface Option {
  label: string;
  key: string;
  /** Where the hotkey is in the label. */
  at: number;
}

interface MenuInfo {
  extraKeys: string;
  enterToCaller: boolean;
}

hooks.listeners.enter = (f) => {
  if (f.name === 'MenuCore.HorizontalMenu' || f.name === 'MenuCore.MenuVertical') {
    const at = units.MenuCore.$at;
    f.info = { extraKeys: rS(at.extraKeys), enterToCaller: U8[at.enterToCaller] !== 0 } satisfies MenuInfo;
  }
};

/** The options of a menu line, as MenuCore.HorizontalMenu divides it: each starts at a capital letter or a digit. */
export function parseMenu(menu: string): Option[] {
  const hot: number[] = [];
  for (let i = 0; i < menu.length; i++) if (/[0-9A-Z]/.test(menu[i])) hot.push(i);
  const wordStart = (i: number) => {
    let s = i;
    while (s > 0 && menu[s - 1] !== ' ') s--;
    return s;
  };
  const out: Option[] = [];
  hot.forEach((h, k) => {
    const start = wordStart(h);
    if (k > 0 && start === wordStart(hot[k - 1])) return; // a second capital of the same word
    let end = menu.length;
    for (let j = k + 1; j < hot.length; j++) {
      if (wordStart(hot[j]) !== start) {
        end = wordStart(hot[j]);
        break;
      }
    }
    out.push({ label: menu.slice(start, end).trimEnd(), key: menu[h], at: h - start });
  });
  return out;
}

function frames(): { menu: hooks.Frame | null; list: hooks.Frame | null; typing: 'text' | 'number' | null } {
  let menu: hooks.Frame | null = null;
  let list: hooks.Frame | null = null;
  let typing: 'text' | 'number' | null = null;
  const st = hooks.stack;
  const top = st[st.length - 1];
  if (top && top.name === 'MenuCore.HorizontalMenu') {
    menu = top;
    const under = st[st.length - 2];
    if (under && under.name === 'MenuCore.MenuVertical') list = under;
  } else if (top && (top.name === 'TextRend.ReadString' || top.name === 'TextRend.ReadNumber')) {
    typing = st.some((f) => f.name === 'TextRend.ReadNumber') ? 'number' : 'text';
  }
  return { menu, list, typing };
}

function ifcState(): number {
  return U8[units.GameVars.$at.ifcState];
}

const IN_COMBAT = 5;

/** True when the cell holds a hotkey's letter: in the menu's highlight colour, or (a menu whose own line is not
    shown has none) in a colour the letter after it is not. */
function isLit(col: number, row: number, hl: number): boolean {
  const c = text.cellAt(col, row);
  if (!c || c.bg !== 0 || c.ch === ' ') return false;
  if (hl) return c.fg === hl;
  const next = text.cellAt(col + 1, row);
  return !!next && next.ch !== ' ' && next.fg !== c.fg;
}

/** Where on the screen the game shows what a one-letter option does: the line that starts with its lit letter. */
function screenLabel(k: string, hl: number): string | null {
  for (let row = 0; row < 24; row++) {
    for (let col = 0; col < 40; col++) {
      const c = text.cellAt(col, row);
      if (c && c.ch === k && isLit(col, row, hl)) {
        const before = text.cellAt(col - 1, row);
        if (before && before.ch !== ' ') continue;
        const run = text.runFrom(col, row);
        if (run.length > 1) return run;
      }
    }
  }
  return null;
}

// ---- the menu line under the screen

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
}

function put(parent: HTMLElement, s: string, ink: (i: number) => string, paper?: (i: number) => string | null): void {
  const cv = text.label(s, ink, paper);
  if (cv) parent.appendChild(cv);
  else parent.appendChild(document.createTextNode(s));
}

/** Something on the line to touch. */
function item(parent: HTMLElement, s: string, ink: (i: number) => string, press: () => void, paper?: (i: number) => string | null): void {
  const b = el('button', 'item', parent);
  b.type = 'button';
  // a line longer than the width goes on a second row
  const cols = Math.max(8, Math.floor((strip.clientWidth - 8) / (8 * text.ui.scale)) - 1);
  if (s.length > cols && !paper) {
    b.classList.add('tall');
    const inner = el('div', 'lines', b);
    wrapped(inner, Array.from(s, (ch, i) => ({ ch, ink: ink(i) })));
  } else put(b, s, ink, paper);
  b.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    settings.onGesture();
    b.classList.add('down');
    press();
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) b.addEventListener(ev, () => b.classList.remove('down'));
  b.addEventListener('contextmenu', (e) => e.preventDefault());
}

/** Text wrapped to the line's width, word by word; cells keeps each character's own colours. */
function wrapped(parent: HTMLElement, cells: { ch: string; ink: string }[]): void {
  const cols = Math.max(8, Math.floor((strip.clientWidth - 20) / (8 * text.ui.scale)));
  let line: { ch: string; ink: string }[] = [];
  const flush = () => {
    while (line.length && line[line.length - 1].ch === ' ') line.pop();
    if (line.length) {
      const l = line;
      put(parent, l.map((c) => c.ch).join(''), (i) => l[i].ink);
    }
    line = [];
  };
  let i = 0;
  while (i < cells.length) {
    let j = i;
    while (j < cells.length && cells[j].ch !== ' ') j++;
    const word = cells.slice(i, j);
    if (line.length && line.length + word.length > cols) flush();
    line.push(...word);
    if (j < cells.length) line.push(cells[j]);
    i = j + 1;
  }
  flush();
}

function plain(s: string, ink: string): { ch: string; ink: string }[] {
  return Array.from(s, (ch) => ({ ch, ink }));
}

/** The game's bottom line as it stands on its screen, for when no menu is up (a message, a prompt for a key). */
function bottomLine(): { ch: string; ink: string }[] {
  const out: { ch: string; ink: string }[] = [];
  for (let col = 0; col < 40; col++) {
    const c = text.cellAt(col, 24);
    out.push(c ? { ch: c.ch, ink: text.color(c.bg !== 0 ? c.bg : c.fg) } : { ch: ' ', ink: '' });
  }
  while (out.length && out[out.length - 1].ch === ' ') out.pop();
  while (out.length && out[0].ch === ' ') out.shift();
  return out;
}

let shown = '';
let timer = 0;

function render(): void {
  const { menu, list, typing } = frames();
  const state = ifcState();
  const haveFont = text.glyph('A') !== null;
  if (haveFont !== padLabelled) labelPad();
  // twenty-two letters across an upright phone (the main menu's longest line); no larger on anything wider
  const scale = Math.max(1.5, Math.min(3, Math.floor(strip.clientWidth / 184 / 0.125) * 0.125));
  if (scale !== text.ui.scale) {
    text.ui.scale = scale;
    document.documentElement.style.setProperty('--cell', `${8 * scale}px`);
    labelPad();
    shown = '';
  }
  setDiagonals(state === IN_COMBAT);
  const choice = U8[units.GameVars.$at.horizChoice];
  const loose = menu || typing ? '' : bottomLine().map((c) => c.ch).join('');
  const sig = JSON.stringify([menu?.args.slice(0, 6), menu?.info, list ? 1 : 0, typing, haveFont, hooks.stack.length, screenSig(menu), choice, loose, typing ? bottomLine().length : 0]);
  if (sig === shown) return;
  shown = sig;
  strip.textContent = '';

  if (typing) {
    // the question and what has been typed, as the game's bottom line has them
    const prompt = el('div', 'prompt', strip);
    wrapped(prompt, bottomLine());
    const items = el('div', 'items', strip);
    if (typing === 'number') {
      for (const d of '1234567890') item(items, d, () => text.color(WHITE), () => letter(d));
      item(items, 'DEL', () => text.color(GREEN), () => key(8));
    } else {
      item(items, 'KEYBOARD', (i) => text.color(i === 0 ? WHITE : GREEN), openTyper);
      item(items, 'DEL', () => text.color(GREEN), () => key(8));
    }
    return;
  }

  if (!menu) {
    // the game is busy, or waits for any key: what its bottom line says, if anything
    if (screen.showsBottomLine()) return;
    const cells = bottomLine();
    if (cells.length) wrapped(el('div', 'prompt', strip), cells);
    return;
  }

  const [query, menuText, qCol, mCol, hlCol] = menu.args as [string, string, number, number, number];
  const info = menu.info as MenuInfo;
  const options = parseMenu(menuText);
  const letters = options.length > 0 && options.every((o) => o.label.length === 1);
  const named = letters ? options.map((o) => screenLabel(o.key, hlCol)) : [];
  const rows = letters && named.filter((n) => n).length >= 2;
  // (a menu of the screen's own lines has a heading for its question: the lines say enough)
  if (query.trim() && !rows) wrapped(el('div', 'prompt', strip), plain(query.trim(), text.color(qCol || MAGENTA)));
  const items = el('div', 'items', strip);
  const ink = text.color(mCol || GREEN);
  const lit = text.color(hlCol || WHITE);

  if (!options.length) {
    // a line with no options: "press enter to continue". OK takes it; so does touching it.
    if (menuText.trim()) item(items, menuText.trim(), () => text.color(mCol || WHITE), () => key(13));
  } else {
    if (rows) {
      // the options are letters and the screen says what each is: those lines, one to a row (a letter the screen
      // does not show is an option that is not open now)
      items.classList.add('rows');
      options.forEach((o, i) => {
        const n = named[i];
        if (n) item(items, n, (c) => (c === 0 ? lit : ink), () => letter(o.key));
      });
    } else {
      options.forEach((o, i) => {
        // the option the arrows are on is in inverse video, as on the game's own line
        const cur = hlCol !== 0 && i + 1 === choice;
        if (cur) item(items, o.label, () => '#000', () => letter(o.key), () => lit);
        else item(items, o.label, (c) => (c === o.at ? lit : ink), () => letter(o.key));
      });
    }
  }
  // keys the game takes that its line does not show (a save's letter, a list's own choices)
  for (const k of info.extraKeys.toUpperCase()) {
    if (options.some((o) => o.key === k)) continue;
    item(items, k, () => text.color(GRAY), () => letter(k));
  }
}

/** What of the screen the line's labels were read from: the line is drawn again when it changes. */
function screenSig(menu: hooks.Frame | null): string {
  if (!menu) return '';
  const options = parseMenu(String(menu.args[1]));
  if (!options.length || !options.every((o) => o.label.length === 1)) return '';
  return options.map((o) => screenLabel(o.key, menu.args[4]) ?? '').join('|');
}

hooks.listeners.change = () => {
  // after the game has drawn what it is asking about
  window.clearTimeout(timer);
  timer = window.setTimeout(render, 30);
};
window.setInterval(render, 250);
window.addEventListener('resize', () => {
  shown = '';
  render();
});

// ---- the keys: built once, never rearranged

const ARROW = [0x18, 0x3c, 0x7e, 0xff, 0x18, 0x18, 0x18, 0x00];
const CORNER = [0xf8, 0xf0, 0xf8, 0xdc, 0x8e, 0x07, 0x03, 0x00];

function turned(rows: number[], quarter: number): number[] {
  let r = rows;
  for (let q = 0; q < quarter; q++) {
    const out = new Array<number>(8).fill(0);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (r[y] & (0x80 >> x)) out[x] |= 0x80 >> (7 - y);
    r = out;
  }
  return r;
}

interface PadKey {
  el: HTMLButtonElement;
  art?: number[];
  word?: string;
  diagonal?: boolean;
}

const padKeys: PadKey[] = [];
let padLabelled: boolean | null = null;
let held = 0;

function release(): void {
  window.clearTimeout(held);
  held = 0;
  for (const k of padKeys) k.el.classList.remove('down');
}
// a finger lifted anywhere ends a held key, whatever became of the key under it
for (const ev of ['pointerup', 'pointercancel', 'blur'] as const) window.addEventListener(ev, release);
document.addEventListener('visibilitychange', release);

function padKey(parent: HTMLElement, cls: string, press: () => void, repeat: boolean, look: Partial<PadKey>): PadKey {
  const b = el('button', 'key ' + cls, parent);
  b.type = 'button';
  const k: PadKey = { el: b, ...look };
  padKeys.push(k);
  b.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    settings.onGesture();
    release();
    b.classList.add('down');
    press();
    if (repeat) {
      const again = () => {
        press();
        held = window.setTimeout(again, 150);
      };
      held = window.setTimeout(again, 420);
    }
  });
  b.addEventListener('pointerleave', release);
  b.addEventListener('contextmenu', (e) => e.preventDefault());
  return k;
}

function buildPad(): void {
  const d = el('div', 'dpad', pad);
  const dirs: [number, number[], boolean][] = [
    [HOME, CORNER, true],
    [UP, ARROW, false],
    [PGUP, turned(CORNER, 1), true],
    [LEFT, turned(ARROW, 3), false],
    [0, [], false],
    [RIGHT, turned(ARROW, 1), false],
    [END, turned(CORNER, 3), true],
    [DOWN, turned(ARROW, 2), false],
    [PGDN, turned(CORNER, 2), true],
  ];
  for (const [scan, art, diagonal] of dirs) {
    if (!scan) el('div', 'hub', d);
    else padKey(d, '', () => ext(scan), true, { art, diagonal });
  }
  const side = el('div', 'side', pad);
  padKey(side, '', () => settings.onMenu(), false, { word: 'MENU' });
  padKey(side, '', () => openTyper(), false, { word: 'KEYS' });
  padKey(side, 'ok', () => key(13), false, { word: 'OK' });
  padKey(side, 'back', () => key(27), false, { word: 'BACK' });
  labelPad();
}

/** The keys' faces, in the game's letters once it has loaded them. */
function labelPad(): void {
  padLabelled = text.glyph('A') !== null;
  for (const k of padKeys) {
    k.el.textContent = '';
    if (k.art) k.el.appendChild(text.bitmap(k.art, '#fff', 1));
    else if (k.word) {
      const w = k.word;
      const cv = text.label(w, () => (w === 'OK' ? '#fff' : text.color(GREEN)));
      if (cv) k.el.appendChild(cv);
      else k.el.textContent = w;
    }
  }
}

/** The four slanting arrows are a fight's: elsewhere the game has no use for them. */
function setDiagonals(on: boolean): void {
  for (const k of padKeys) if (k.diagonal) k.el.classList.toggle('off', !on);
}

// ---- typing on a phone: a field off the screen brings the keyboard up

function openTyper(): void {
  typer.value = '';
  typer.focus();
}

typer.addEventListener('input', (e) => {
  const ev = e as InputEvent;
  if (ev.inputType === 'deleteContentBackward') key(8);
  else if (ev.inputType === 'insertLineBreak') key(13);
  else if (ev.data) for (const c of ev.data) if (c.charCodeAt(0) < 127) letter(c);
  typer.value = '';
});
typer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') typer.blur();
});

// ---- a keyboard, as on a PC

const NAMED: Record<string, [number, number]> = {
  Enter: [0x1c, 13],
  Escape: [1, 27],
  Backspace: [0x0e, 8],
  Tab: [0x0f, 9],
  ArrowUp: [UP, 0],
  ArrowDown: [DOWN, 0],
  ArrowLeft: [LEFT, 0],
  ArrowRight: [RIGHT, 0],
  Home: [HOME, 0],
  End: [END, 0],
  PageUp: [PGUP, 0],
  PageDown: [PGDN, 0],
  Insert: [82, 0],
  Delete: [83, 0],
};
for (let i = 1; i <= 10; i++) NAMED['F' + i] = [58 + i, 0];

window.addEventListener('keydown', (e) => {
  settings.onGesture();
  if (e.metaKey) return;
  if (e.key === 'Unidentified' || e.keyCode === 229) return; // a phone's keyboard: the field's input event has it
  if (e.altKey && /^Digit[1-8]$/.test(e.code)) {
    pushKey(119 + Number(e.code.slice(5)), 0);
    e.preventDefault();
    return;
  }
  const named = NAMED[e.key];
  if (named) {
    pushKey(named[0], named[1]);
    e.preventDefault();
    return;
  }
  if (e.key.length === 1) {
    const c = e.key.charCodeAt(0);
    if (e.ctrlKey && /[a-z]/i.test(e.key)) key(c & 31);
    else if (c < 127) key(c);
    else return;
    e.preventDefault();
  }
});

// ---- the screen under a finger

let downAt: { x: number; y: number; id: number } | null = null;

canvas.addEventListener('pointerdown', (e) => {
  settings.onGesture();
  downAt = { x: e.clientX, y: e.clientY, id: e.pointerId };
});

canvas.addEventListener('pointerup', (e) => {
  const d = downAt;
  downAt = null;
  if (!d || d.id !== e.pointerId || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 14) return;
  const r = canvas.getBoundingClientRect();
  const p = screen.toScreen(e.clientX - r.left, e.clientY - r.top);
  if (p) tap(p.x, p.y);
});

/** The battlefield's squares: seven by seven of 24 pixels, inside the frame. */
const FIELD = { x: 8, y: 8, cell: 24, cells: 7 };
const STEP_KEYS: Record<string, number> = { '-1,-1': HOME, '0,-1': UP, '1,-1': PGUP, '-1,0': LEFT, '1,0': RIGHT, '-1,1': END, '0,1': DOWN, '1,1': PGDN };

/**
 * The steps from one arena cell to another, the shortest way round walls and the fighter's own side; into the target
 * itself whatever stands there (a foe is struck by walking into it). Empty when there is no way within a turn's reach.
 */
function fieldPath(ax: number, ay: number, tx: number, ty: number): number[] {
  const peek = units.WebPeek;
  const REACH = 12;
  const id = (x: number, y: number) => `${x},${y}`;
  const from = new Map<string, [number, number, number] | null>([[id(ax, ay), null]]);
  let edge: [number, number][] = [[ax, ay]];
  // straight steps before slanting ones, so a way of equal length looks the plainer
  const dirs: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];
  for (let depth = 0; depth < REACH && edge.length && !from.has(id(tx, ty)); depth++) {
    const next: [number, number][] = [];
    for (const [x, y] of edge) {
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (from.has(id(nx, ny))) continue;
        const goal = nx === tx && ny === ty;
        if (!goal && peek.CellKind(nx, ny) !== 0) continue;
        // the square asked for may hold a foe (walking into it strikes), not a wall or a friend
        if (goal && peek.CellKind(nx, ny) !== 0 && peek.CellKind(nx, ny) !== 3) continue;
        from.set(id(nx, ny), [x, y, STEP_KEYS[`${dx},${dy}`]]);
        next.push([nx, ny]);
      }
    }
    edge = next;
  }
  const steps: number[] = [];
  for (let at = from.get(id(tx, ty)); at; at = from.get(id(at[0], at[1]))) steps.unshift(at[2]);
  return steps;
}

/** A tap on the battlefield while a fighter may walk: steps toward the square, the last into a foe an attack. */
function fieldTap(px: number, py: number, menu: hooks.Frame, options: Option[]): boolean {
  const split = screen.findSplit();
  if (ifcState() !== IN_COMBAT || !split) return false;
  const cx = Math.floor((px - FIELD.x) / FIELD.cell);
  const cy = Math.floor((py - FIELD.y) / FIELD.cell);
  if (px < FIELD.x || py < FIELD.y || cx >= FIELD.cells || cy >= FIELD.cells) return false;
  const walking = String(menu.args[0]).startsWith('Move/Attack');
  const canMove = options.find((o) => o.label === 'Move');
  if (!walking && !canMove) return false;
  const peek = units.WebPeek;
  const ox = peek.ViewX();
  const ax = peek.ActorX();
  if (ox < 0 || ax < 0) return false;
  const ay = peek.ActorY();
  const tx = ox + cx;
  const ty = peek.ViewY() + cy;
  if (tx === ax && ty === ay) return true;
  const steps = fieldPath(ax, ay, tx, ty);
  if (!steps.length) return true;
  const go = () => steps.forEach(ext);
  if (walking) go();
  else {
    // choose Move first, and step once the game is asking where (it drops keys typed before it asks)
    letter(canMove!.key);
    let tries = 0;
    const wait = () => {
      const top = hooks.top();
      if (top && top.name === 'MenuCore.HorizontalMenu' && String(top.args[0]).startsWith('Move/Attack')) go();
      else if (++tries < 40) window.setTimeout(wait, 50);
    };
    window.setTimeout(wait, 50);
  }
  return true;
}

function tap(px: number, py: number): void {
  const cx = px >> 3;
  const cy = py >> 3;
  const { menu, list, typing } = frames();
  if (typing) return;
  if (!menu) {
    key(13);
    return;
  }
  const hl = menu.args[4] as number;
  const options = parseMenu(String(menu.args[1]));
  const info = menu.info as MenuInfo;

  // a line of a list: the highlight goes there; the highlighted line is taken
  if (list) {
    const [ulCol, ulRow, lrCol, lrRow] = list.args.slice(5, 9) as number[];
    if (cy >= ulRow && cy <= lrRow && cx >= ulCol - 1 && cx <= lrCol + 1) {
      let lit = -1;
      for (let row = ulRow; row <= lrRow && lit < 0; row++) {
        for (let col = ulCol; col <= lrCol; col++) {
          const c = text.cellAt(col, row);
          if (c && c.bg !== 0) {
            lit = row;
            break;
          }
        }
      }
      if (lit < 0) return;
      if (lit === cy) key(13);
      else for (let i = Math.abs(cy - lit); i > 0; i--) ext(cy > lit ? DOWN : UP);
      return;
    }
  }

  if (fieldTap(px, py, menu, options)) return;

  // an option's own word on the game's line, or a line that starts with an option's letter
  const hot = new Set([...options.map((o) => o.key), ...info.extraKeys.toUpperCase()]);
  let best = -1;
  let bestCol = -1;
  for (let col = 0; col < 40; col++) {
    const c = text.cellAt(col, cy);
    if (!c) continue;
    if (isLit(col, cy, hl) && hot.has(c.ch) && hl !== ((menu.args[3] as number) || -1)) {
      // the option reaches from its letter to the next one: the nearest letter at or before the finger
      if (col <= cx + 1 && col > bestCol) {
        bestCol = col;
        best = c.ch.charCodeAt(0);
      } else if (bestCol < 0 && best < 0) {
        bestCol = -2;
        best = c.ch.charCodeAt(0);
      }
    }
  }
  if (best >= 0) {
    key(best);
    return;
  }

  // the 3D view, where the game takes the arrows: its sides turn, its middle steps ahead, its foot turns about
  const state = ifcState();
  const split = screen.findSplit();
  if (menu.args[5] && !list && (state === 3 || state === 4) && split && cx <= split.col && cy <= split.row) {
    const w = (split.col + 1) * 8;
    const h = (split.row + 1) * 8;
    if (py > h * 0.8) ext(DOWN);
    else if (px < w * 0.3) ext(LEFT);
    else if (px > w * 0.7) ext(RIGHT);
    else ext(UP);
    return;
  }
  if (!options.length && String(menu.args[1]).trim()) key(13);
}

export function start(): void {
  buildPad();
  render();
}
