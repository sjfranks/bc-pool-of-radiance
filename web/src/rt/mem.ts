/**
 * mem.ts
 *
 * The game's memory: one block, laid out as the translated Pascal expects (web/tools/pas2ts). Low memory is left empty
 * so that a nil pointer reads zeros, as it mostly did under DOS; then System's variables, the units' variables and
 * typed constants (the data image), the heap growing up and the stack growing down from the top.
 */

export const MEM_SIZE = 24 * 1024 * 1024;
export const STACK_SIZE = 2 * 1024 * 1024;

export const SYS = {
  RandSeed: 0x10000,
  FileMode: 0x10004,
  ExitProc: 0x10008,
  ExitCode: 0x1000c,
  InOutRes: 0x1000e,
  Output: 0x10010,
  Input: 0x10018,
  StdErr: 0x10020,
  HeapPtr: 0x10028,
  PrefixSeg: 0x1002c,
  HeapError: 0x10030,
};

export const buffer = new ArrayBuffer(MEM_SIZE);
export const U8 = new Uint8Array(buffer);
export const I8 = new Int8Array(buffer);
const DV = new DataView(buffer);

/** The stack pointer: a routine's frame is below it. */
export const S = { sp: MEM_SIZE - 16 };

export function r16(a: number): number {
  return U8[a] | (U8[a + 1] << 8);
}
export function ri16(a: number): number {
  return ((U8[a] | (U8[a + 1] << 8)) << 16) >> 16;
}
export function r32(a: number): number {
  return DV.getUint32(a, true);
}
export function ri32(a: number): number {
  return DV.getInt32(a, true);
}
export function w16(a: number, v: number): void {
  U8[a] = v;
  U8[a + 1] = v >> 8;
}
export function w32(a: number, v: number): void {
  DV.setInt32(a, v, true);
}
export function rF64(a: number): number {
  return DV.getFloat64(a, true);
}
export function wF64(a: number, v: number): void {
  DV.setFloat64(a, v, true);
}
export function rF32(a: number): number {
  return DV.getFloat32(a, true);
}
export function wF32(a: number, v: number): void {
  DV.setFloat32(a, v, true);
}

/** A Pascal string (a length byte, then its characters) as a JavaScript string, a character a byte. */
export function rS(a: number): string {
  const n = U8[a];
  if (n === 0) return '';
  let s = '';
  for (let i = 1; i <= n; i++) s += String.fromCharCode(U8[a + i]);
  return s;
}

export function wS(a: number, max: number, s: string): void {
  const n = s.length < max ? s.length : max;
  U8[a] = n;
  for (let i = 0; i < n; i++) U8[a + 1 + i] = s.charCodeAt(i);
}

/** Pascal's Move: the bytes may overlap. */
export function mv(dst: number, src: number, n: number): void {
  if (n > 0) U8.copyWithin(dst, src, src + n);
}

// ---- the heap: first fit over a list of free blocks, each block with its size in the 8 bytes before it

const FREED = 0xf4eef4ee;
let heapBase = 0;
let heapTop = 0;
const heapLimit = MEM_SIZE - STACK_SIZE;
const freeBySize = new Map<number, number[]>();

export function initHeap(start: number): void {
  heapBase = (start + 15) & ~15;
  heapTop = heapBase;
  freeBySize.clear();
}

export function getMem(size: number): number {
  if (size <= 0) return 0;
  const n = (size + 7) & ~7;
  const list = freeBySize.get(n);
  let p: number;
  if (list && list.length) {
    p = list.pop()!;
    DV.setUint32(p - 4, 0, true);
  }
  else {
    if (heapTop + n + 8 > heapLimit) throw new Error('the game is out of memory');
    DV.setUint32(heapTop, n, true);
    p = heapTop + 8;
    heapTop += n + 8;
  }
  U8.fill(0, p, p + n);
  return p;
}

export function freeMem(p: number): void {
  if (p < heapBase + 8 || p >= heapTop) return;
  const n = DV.getUint32(p - 8, true);
  // freed twice: the second is ignored
  if (DV.getUint32(p - 4, true) === FREED) return;
  DV.setUint32(p - 4, FREED, true);
  let list = freeBySize.get(n);
  if (!list) freeBySize.set(n, (list = []));
  list.push(p);
}

export function heapUsed(): number {
  return heapTop - heapBase;
}
