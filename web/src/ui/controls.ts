/**
 * controls.ts
 *
 * Playing with a finger. The game is a keyboard game: a line of options along the foot of the screen, each chosen by
 * its capital letter, and the arrow keys. Here the option line becomes buttons under the screen, named as the game
 * names them, with a direction pad beside them where the game takes the arrows (walking, a list, aiming), and the
 * screen itself answers a tap: a line of a list, an option's own word, the 3D view to walk and turn.
 *
 * What to offer comes from the game itself: the translator has the menu routines report their arguments
 * (host/hooks.ts), so the buttons are always the options the game is waiting on. A keyboard still plays as it does on
 * a PC.
 */
import { U8, rS } from '../rt/mem';
import * as hooks from '../host/hooks';
import { pushKey } from '../host/platform';
import { units } from '../boot';
import * as text from './text';
import * as screen from './screen';

const bar = document.getElementById('bar') as HTMLDivElement;
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

export const settings = {
  /** Called for the pause menu's own entries. */
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
    const label = menu.slice(start, end).trimEnd();
    out.push({ label, key: menu[h], at: h - start });
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

// ---- the bar

let shown = '';
let timer = 0;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
}

/** A button: press runs at once, and again and again while held when repeat is set. */
function button(parent: HTMLElement, cls: string, press: () => void, repeat = false): HTMLButtonElement {
  const b = el('button', cls, parent);
  b.type = 'button';
  let hold = 0;
  const stop = () => {
    window.clearTimeout(hold);
    hold = 0;
    b.classList.remove('down');
  };
  b.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    settings.onGesture();
    b.classList.add('down');
    press();
    if (repeat) {
      const again = () => {
        press();
        hold = window.setTimeout(again, 140);
      };
      hold = window.setTimeout(again, 380);
    }
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) b.addEventListener(ev, stop);
  b.addEventListener('contextmenu', (e) => e.preventDefault());
  return b;
}

function put(b: HTMLElement, s: string, colors: (i: number) => string, scale: number): void {
  const cv = text.label(s, colors, scale);
  if (cv) b.appendChild(cv);
  else b.textContent = s.toUpperCase();
}

const GREEN = 10;
const WHITE = 15;

function optionButton(parent: HTMLElement, o: Option, cls: string, scale: number, press: () => void): void {
  const b = button(parent, cls, press);
  put(b, o.label, (i) => text.color(i === o.at ? WHITE : GREEN), scale);
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

/** True when the cell holds a hotkey's letter: in the menu's highlight colour, or (a menu whose own line is not
    shown has none) in a colour the letter after it is not. */
function isLit(col: number, row: number, hl: number): boolean {
  const c = text.cellAt(col, row);
  if (!c || c.bg !== 0 || c.ch === ' ') return false;
  const next = text.cellAt(col + 1, row);
  if (hl) return c.fg === hl && !(next && next.ch !== ' ' && next.fg === hl && row !== 24 && false);
  return !!next && next.ch !== ' ' && next.fg !== c.fg;
}

function arrow(parent: HTMLElement, cls: string, glyph: string, press: () => void): void {
  const b = button(parent, 'pad ' + cls, press, true);
  b.textContent = glyph;
}

function pad8(parent: HTMLElement): void {
  const p = el('div', 'dpad eight', parent);
  const keys: [string, string, number][] = [
    ['nw', '↖', HOME],
    ['n', '↑', UP],
    ['ne', '↗', PGUP],
    ['w', '←', LEFT],
    ['c', '', 0],
    ['e', '→', RIGHT],
    ['sw', '↙', END],
    ['s', '↓', DOWN],
    ['se', '↘', PGDN],
  ];
  for (const [cls, g, scan] of keys) {
    if (!scan) el('div', 'pad gap', p);
    else arrow(p, cls, g, () => ext(scan));
  }
}

function pad4(parent: HTMLElement): void {
  const p = el('div', 'dpad four', parent);
  el('div', 'pad gap', p);
  arrow(p, 'n', '↑', () => ext(UP));
  el('div', 'pad gap', p);
  arrow(p, 'w', '←', () => ext(LEFT));
  arrow(p, 's', '↓', () => ext(DOWN));
  arrow(p, 'e', '→', () => ext(RIGHT));
}

function padSmall(parent: HTMLElement): void {
  const p = el('div', 'dpad list', parent);
  arrow(p, 'n', '\u2191', () => ext(UP));
  arrow(p, 'w', '\u2190', () => ext(LEFT));
  arrow(p, 's', '\u2193', () => ext(DOWN));
  arrow(p, 'e', '\u2192', () => ext(RIGHT));
}

function padList(parent: HTMLElement): void {
  const p = el('div', 'dpad list', parent);
  arrow(p, 'n', '↑', () => ext(UP));
  arrow(p, 'pg', '⇞', () => ext(PGUP));
  arrow(p, 's', '↓', () => ext(DOWN));
  arrow(p, 'pg', '⇟', () => ext(PGDN));
}

function system(parent: HTMLElement): void {
  const s = el('div', 'sys', parent);
  button(s, 'sysb', () => settings.onMenu()).textContent = '☰';
  button(s, 'sysb', () => openTyper()).textContent = 'Abc';
  button(s, 'sysb', () => key(27)).textContent = 'Esc';
}

/** The prompt's letters: twice the game's size, or what fits the bar's width. */
function headScale(s: string): number {
  return Math.max(1, Math.min(2, Math.floor((bar.clientWidth - 16) / (s.length * 8) / 0.25) * 0.25));
}

function render(): void {
  const { menu, list, typing } = frames();
  const state = ifcState();
  const haveFont = text.glyph('A') !== null;
  const sig = JSON.stringify([menu?.args.slice(0, 6), menu?.info, list ? 1 : 0, typing, state, haveFont, hooks.stack.length, screenSig(menu), screen.findSplit()]);
  if (sig === shown) return;
  shown = sig;
  bar.textContent = '';
  const head = el('div', 'query', bar);
  const body = el('div', 'body', bar);
  const opts = el('div', 'opts', body);

  if (typing) {
    const q = String(hooks.stack.find((f) => f.name.startsWith('TextRend.Read'))?.args[0] ?? '');
    put(head, q.trim(), () => text.color(13), headScale(q.trim()));
    if (typing === 'number') {
      opts.classList.add('keys');
      for (const d of '1234567890') button(opts, 'opt num', () => letter(d)).textContent = d;
      button(opts, 'opt num', () => key(8)).textContent = '⌫';
      button(opts, 'opt num ok', () => key(13)).textContent = 'OK';
    } else {
      button(opts, 'opt wide', () => openTyper()).textContent = 'Tap to type';
      button(opts, 'opt', () => key(8)).textContent = '⌫';
      button(opts, 'opt ok', () => key(13)).textContent = 'OK';
    }
    system(body);
    return;
  }

  if (!menu) {
    // the game is busy, or waits for any key
    button(opts, 'opt wide ok', () => key(13)).textContent = 'Continue';
    system(body);
    return;
  }

  const [query, menuText, , , hlCol, reinterpret] = menu.args as [string, string, number, number, number, boolean];
  const info = menu.info as MenuInfo;
  const options = parseMenu(menuText);
  if (query.trim()) put(head, query.trim(), () => text.color(menu.args[2] || 13), headScale(query.trim()));

  // the arrows, where the game takes them: all eight ways in a fight, the large four to walk the 3D view, and a small
  // four elsewhere (they step through the party, a list, a value)
  const walking = (state === 3 || state === 4) && screen.findSplit() !== null;
  if (list) padList(body);
  else if (reinterpret && state === 5) pad8(body);
  else if (reinterpret && walking) pad4(body);
  else if (reinterpret) padSmall(body);
  if (body.lastChild !== opts) body.insertBefore(body.lastChild!, opts);

  system(body);
  // letters as large as the room allows: a list's line across the buttons' width, other options two or three abreast
  const room = opts.clientWidth || 200;
  const fit = (len: number, across: number) => Math.max(1, Math.min(2, Math.floor(((room - 6 * (across - 1)) / across - 10) / (len * 8) / 0.25) * 0.25));
  if (!options.length) {
    // "press enter to continue", or a list with nothing on its line
    // a prompt with no line of options (walking a fighter about, aiming) is ended with Enter
    button(opts, 'opt wide ok', () => key(13)).textContent = list ? 'Select' : menuText.trim() === '' && query.trim() ? 'Done' : 'Continue';
  } else {
    const letters = options.every((o) => o.label.length === 1);
    const named = letters ? options.map((o) => screenLabel(o.key, hlCol)) : [];
    if (letters && named.filter((n) => n).length >= 2) {
      // the options are letters, and the screen says what each is: a list of those it shows (a letter it does not
      // show is an option that is not open now)
      opts.classList.add('rows');
      options.forEach((o, i) => {
        const n = named[i];
        if (n) optionButton(opts, { label: n, key: o.key, at: 0 }, 'opt row', fit(n.length, 1), () => letter(o.key));
      });
    } else {
      const longest = Math.max(...options.map((o) => o.label.length));
      const across = options.length <= 2 ? options.length : room / 3 >= longest * 12 + 18 && options.length > 4 ? 3 : 2;
      const scale = fit(longest, across);
      opts.style.setProperty('--across', String(across));
      for (const o of options) optionButton(opts, o, 'opt', scale, () => letter(o.key));
    }
    if (list || info.enterToCaller) button(opts, 'opt ok', () => key(13)).textContent = 'Select';
  }
  for (const k of info.extraKeys) {
    if (options.some((o) => o.key === k.toUpperCase())) continue;
    button(opts, 'opt', () => letter(k)).textContent = k.toUpperCase();
  }
}

/** What of the screen the bar's labels were read from: the bar is drawn again when it changes. */
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
window.setInterval(render, 400);

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
  if (p) tap(p.x, p.y, p.pane);
});

function tap(px: number, py: number, pane: number): void {
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

  // an option's own word, or a line that starts with its letter
  const hot = new Set([...options.map((o) => o.key), ...info.extraKeys.toUpperCase()]);
  let best = -1;
  let bestCol = -1;
  for (let col = 0; col < 40; col++) {
    const c = text.cellAt(col, cy);
    if (!c) continue;
    if (c.bg !== 0 && c.bg === hl && cy === 24 && Math.abs(col - cx) <= 1) {
      key(13);
      return;
    }
    if (isLit(col, cy, hl) && hot.has(c.ch) && hl !== (menu.args[3] as number || -1)) {
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
  void pane;
  if (!options.length) key(13);
}

export function start(): void {
  render();
}
