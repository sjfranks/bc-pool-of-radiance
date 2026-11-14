/**
 * screen.ts
 *
 * The game's 320 by 200 screen on the page's canvas. On a wide display it is one picture, fitted whole. On a phone
 * held upright, a screen the game divides into panes (the 3D view beside the party, the battlefield beside the
 * fighter's panel, each over the text) is taken apart: the picture pane as large as the width allows, the pane that
 * stood beside it under it, and the text under both, the lot standing on the touch bar where a thumb reaches.
 * The panes are found from the game's own frame: its corner pieces mark where the frame divides.
 */
import { U8 } from '../rt/mem';
import { screenAt, dacAt, units } from '../boot';

export interface Blit {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export interface Split {
  /** The frame's dividing column and row, in cells. */
  col: number;
  row: number;
}

const W = 320;
const H = 200;

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const small = document.createElement('canvas');
small.width = W;
small.height = H;
const sctx = small.getContext('2d')!;
const image = sctx.createImageData(W, H);
const rgba = new Uint32Array(image.data.buffer);
const big = document.createElement('canvas');
const bctx = big.getContext('2d')!;
const last = new Uint8Array(W * H);
const lastDac = new Uint8Array(768);
const pal = new Uint32Array(256);

let blits: Blit[] = [];
let layoutKey = '';
let ready = false;
/** Set by the page's settings: take the screen apart on an upright phone. */
export const options = { split: true };

function cellEq(scr: number, ax: number, ay: number, bx: number, by: number): boolean {
  const a = scr + ay * 8 * W + ax * 8;
  const b = scr + by * 8 * W + bx * 8;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (U8[a + y * W + x] !== U8[b + y * W + x]) return false;
  return true;
}

function cellBlank(scr: number, cx: number, cy: number): boolean {
  const a = scr + cy * 8 * W + cx * 8;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (U8[a + y * W + x] !== 0) return false;
  return true;
}

/** Where the game's frame divides the screen into two panes over a text area; null when it does not. */
export function findSplit(): Split | null {
  const scr = screenAt();
  // not at the main menu or making a character: those screens' frames divide too, but not into panes
  if (U8[units.GameVars.$at.ifcState] === 0) return null;
  if (cellBlank(scr, 0, 0) || !cellEq(scr, 0, 0, 39, 0)) return null;
  for (let c = 8; c < 32; c++) {
    if (!cellEq(scr, 0, 0, c, 0)) continue;
    for (let r = 8; r < 24; r++) {
      if (cellEq(scr, 0, 0, 0, r) && cellEq(scr, 0, 0, c, r) && cellEq(scr, 0, 0, 39, r)) return { col: c, row: r };
    }
  }
  return null;
}

function layout(cw: number, ch: number, split: Split | null): Blit[] {
  const portrait = ch > cw * 0.9;
  // upright, the game's bottom line (its menu and prompts) is not shown: the interface shows it, larger, under the
  // screen
  const h = portrait ? H - 8 : H;
  const t = Math.min(cw / W, ch / h);
  if (portrait && split && options.split) {
    const aW = (split.col + 1) * 8;
    const bW = (40 - split.col) * 8;
    const hA = (split.row + 1) * 8;
    const cY = hA;
    const hC = h - cY;
    const tc = cw / W;
    const room = ch - hC * tc;
    // the picture pane as large as the width allows, leaving the pane beside it letters at least a little larger than
    // the text's (a fight's tall panel, mostly empty, gets by with less); what is left over goes to that pane
    const least = tc * (hA > 150 ? 0.9 : 1.25);
    let vA = Math.min(cw / aW, (room - hA * least) / hA);
    let vB = Math.min(cw / bW, (room - hA * vA) / hA);
    if (vA < vB) vA = vB = Math.min(room / (2 * hA), cw / Math.max(aW, bW));
    if (vA >= tc * 1.1) {
      const total = hA * vA + hA * vB + hC * tc;
      let y = ch - total;
      const out: Blit[] = [];
      out.push({ sx: 0, sy: 0, sw: aW, sh: hA, dx: (cw - aW * vA) / 2, dy: y, dw: aW * vA, dh: hA * vA });
      y += hA * vA;
      out.push({ sx: split.col * 8, sy: 0, sw: bW, sh: hA, dx: (cw - bW * vB) / 2, dy: y, dw: bW * vB, dh: hA * vB });
      y += hA * vB;
      if (hC > 0) out.push({ sx: 0, sy: cY, sw: W, sh: hC, dx: 0, dy: y, dw: cw, dh: hC * tc });
      return out;
    }
  }
  const dw = W * t;
  const dh = h * t;
  return [{ sx: 0, sy: 0, sw: W, sh: h, dx: (cw - dw) / 2, dy: portrait ? ch - dh : (ch - dh) / 2, dw, dh }];
}

/** True when the game's own bottom line is on the canvas (a wide display); upright the interface shows it. */
export function showsBottomLine(): boolean {
  return blits.length === 1 && blits[0].sh === H;
}

/** A point of the canvas (CSS pixels from its corner) as a point of the game's screen; null outside it. */
export function toScreen(x: number, y: number): { x: number; y: number; pane: number } | null {
  for (let i = 0; i < blits.length; i++) {
    const b = blits[i];
    if (x >= b.dx && x < b.dx + b.dw && y >= b.dy && y < b.dy + b.dh) {
      return { x: Math.floor(b.sx + ((x - b.dx) / b.dw) * b.sw), y: Math.floor(b.sy + ((y - b.dy) / b.dh) * b.sh), pane: i };
    }
  }
  return null;
}

/** A point of the game's screen as a point of the canvas (CSS pixels); null when that part is not shown. */
export function fromScreen(x: number, y: number): [number, number] | null {
  for (const b of blits) {
    if (x >= b.sx && x < b.sx + b.sw && y >= b.sy && y < b.sy + b.sh) return [b.dx + ((x - b.sx) / b.sw) * b.dw, b.dy + ((y - b.sy) / b.sh) * b.dh];
  }
  return null;
}

export function paneCount(): number {
  return blits.length;
}

export function start(): void {
  ready = true;
}

function frame(): void {
  requestAnimationFrame(frame);
  if (!ready) return;
  const scr = screenAt();
  const dac = dacAt();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  if (!cw || !ch) return;
  const split = findSplit();
  const key = `${cw}x${ch}@${dpr}:${split ? split.col + ',' + split.row : '-'}:${options.split}`;
  let dirty = key !== layoutKey;
  const live = U8.subarray(scr, scr + W * H);
  const liveDac = U8.subarray(dac, dac + 768);
  if (!dirty) {
    for (let i = 0; i < 768; i++) {
      if (liveDac[i] !== lastDac[i]) {
        dirty = true;
        break;
      }
    }
  }
  if (!dirty) {
    for (let i = 0; i < W * H; i++) {
      if (live[i] !== last[i]) {
        dirty = true;
        break;
      }
    }
  }
  if (!dirty) return;
  last.set(live);
  lastDac.set(liveDac);
  for (let i = 0; i < 256; i++) {
    const r = liveDac[i * 3] & 63;
    const g = liveDac[i * 3 + 1] & 63;
    const b = liveDac[i * 3 + 2] & 63;
    pal[i] = 0xff000000 | (((b << 2) | (b >> 4)) << 16) | (((g << 2) | (g >> 4)) << 8) | ((r << 2) | (r >> 4));
  }
  for (let i = 0; i < W * H; i++) rgba[i] = pal[live[i]];
  sctx.putImageData(image, 0, 0);
  if (key !== layoutKey) {
    layoutKey = key;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    blits = layout(cw, ch, split);
  }
  // whole pixels first, by a whole factor, then smoothly down to size: even pixels at any scale
  let most = 1;
  for (const b of blits) most = Math.max(most, (b.dw / b.sw) * dpr);
  const k = Math.min(6, Math.max(1, Math.ceil(most)));
  if (big.width !== W * k) {
    big.width = W * k;
    big.height = H * k;
  }
  bctx.imageSmoothingEnabled = false;
  bctx.drawImage(small, 0, 0, W * k, H * k);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  for (const b of blits) {
    ctx.drawImage(big, b.sx * k, b.sy * k, b.sw * k, b.sh * k, Math.round(b.dx * dpr), Math.round(b.dy * dpr), Math.round(b.dw * dpr), Math.round(b.dh * dpr));
  }
}
requestAnimationFrame(frame);
