/**
 * text.ts
 *
 * What the game has written on its screen, cell by cell (40 by 25): the translator has TextRend.RenderChar tell this
 * module of every character drawn. A picture drawn over text leaves the note stale, so a cell is only believed while
 * its pixels still hold nothing but its two colours. The interface uses it to find the lines of a menu a finger is
 * on, and to draw its buttons in the game's own letters.
 */
import { U8, r32 } from '../rt/mem';
import * as hooks from '../host/hooks';
import { screenAt, units } from '../boot';

const COLS = 40;
const ROWS = 25;
const ch = new Uint8Array(COLS * ROWS);
const fg = new Uint8Array(COLS * ROWS);
const bg = new Uint8Array(COLS * ROWS);

hooks.taps['TextRend.RenderChar'] = (a) => {
  // col, row, fg, bg, count, ch, isAscii
  const row = a[1] & 255;
  if (row >= ROWS || !a[6]) return;
  let c = a[5] & 255;
  if (c >= 97 && c <= 122) c -= 32;
  for (let i = 0, col = a[0] & 255; i < (a[4] & 255) && col < COLS; i++, col++) {
    const k = row * COLS + col;
    ch[k] = c;
    fg[k] = a[2];
    bg[k] = a[3];
  }
};
hooks.taps['TextRend.ClearScreen'] = () => ch.fill(0);

export interface Cell {
  ch: string;
  fg: number;
  bg: number;
}

/** The character at a cell, or null where the screen no longer shows one. */
export function cellAt(col: number, row: number): Cell | null {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
  const k = row * COLS + col;
  if (!ch[k]) return null;
  const scr = screenAt() + row * 8 * 320 + col * 8;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const p = U8[scr + y * 320 + x];
      if (p !== fg[k] && p !== bg[k]) return null;
    }
  }
  return { ch: String.fromCharCode(ch[k]), fg: fg[k], bg: bg[k] };
}

/** A row's text from col to the end of the run that starts there (two blanks end it). */
export function runFrom(col: number, row: number): string {
  let s = '';
  for (let c = col; c < COLS; c++) {
    const cell = cellAt(c, row);
    s += cell ? cell.ch : ' ';
    if (s.endsWith('  ')) break;
  }
  return s.trim();
}

/** The game's 8 by 8 font: a glyph's rows, or null before the game has loaded it. */
export function glyph(c: string): Uint8Array | null {
  const font = r32(units.GameVars.$at.gameFont);
  if (!font) return null;
  let code = c.charCodeAt(0);
  if (code >= 97 && code <= 122) code -= 32;
  const at = font + (code % 64) * 8;
  return U8.subarray(at, at + 8);
}

/** The DAC's colour as CSS. */
export function color(index: number): string {
  const dac = units.Host.$at.dac + index * 3;
  const c = (v: number) => ((v & 63) << 2) | ((v & 63) >> 4);
  return `rgb(${c(U8[dac])},${c(U8[dac + 1])},${c(U8[dac + 2])})`;
}

/** A line of text drawn in the game's font, each character in the colour colors gives it; null without the font. */
export function label(text: string, colors: (i: number) => string, scale = 1): HTMLCanvasElement | null {
  if (!glyph('A')) return null;
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, text.length * 8);
  cv.height = 8;
  cv.style.width = `${cv.width * scale}px`;
  cv.style.height = `${8 * scale}px`;
  const ctx = cv.getContext('2d')!;
  for (let i = 0; i < text.length; i++) {
    const g = glyph(text[i]);
    if (!g || text[i] === ' ') continue;
    ctx.fillStyle = colors(i);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (g[y] & (0x80 >> x)) ctx.fillRect(i * 8 + x, y, 1, 1);
  }
  return cv;
}
