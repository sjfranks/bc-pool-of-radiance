/**
 * sys.ts
 *
 * Turbo Pascal's System unit for the translated game (web/tools/pas2ts writes calls to these): strings, sets, numbers
 * as text, Random as Turbo Pascal's generator, the heap, and files on the page's file store (vfs.ts).
 */
import { U8, r32, w32, w16, ri16, SYS, getMem as memGet, freeMem as memFree, wS } from './mem';
import * as vfs from './vfs';

export const getMem = memGet;
export const freeMem = memFree;

/** The procedure table: a procedure variable holds an index into it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FT: any[] = [null];

export class HaltError extends Error {
  code: number;
  constructor(code: number) {
    super(`Halt(${code})`);
    this.code = code;
  }
}

export function Halt(code: number): never {
  throw new HaltError(code);
}

export function RunError(code: number): never {
  throw new Error(`runtime error ${code}`);
}

// ---- the command line

export const env = { args: [] as string[], out: (line: string) => console.log(line) };

export function ParamStr(i: number): string {
  return i === 0 ? 'C:\\POOLRAD\\POOLRAD.EXE' : (env.args[i - 1] ?? '');
}

export function ParamCount(): number {
  return env.args.length;
}

// ---- numbers

export function r64(a: number): number {
  return r32(a) + r32(a + 4) * 4294967296;
}

export function w64(a: number, v: number): void {
  const t = Math.trunc(v);
  w32(a, t % 4294967296);
  w32(a + 4, Math.floor(t / 4294967296));
}

/** A product of whole numbers: exact while a JavaScript number holds it, else its low 32 bits (Pascal's LongInt). */
export function mul(a: number, b: number): number {
  const p = a * b;
  return p >= -9007199254740991 && p <= 9007199254740991 ? p : Math.imul(a, b);
}

export function sqr(x: number): number {
  return x * x;
}

export function frac(x: number): number {
  return x - Math.trunc(x);
}

/** Round as Turbo Pascal: a half goes away from zero. */
export function round(x: number): number {
  return x < 0 ? -Math.floor(-x + 0.5) : Math.floor(x + 0.5);
}

export function Swap(x: number): number {
  return ((x & 255) << 8) | ((x >> 8) & 255);
}

export function Ptr(seg: number, ofs: number): number {
  return 0;
}

// ---- Random: Turbo Pascal's generator, so the game rolls as it did

function nextSeed(): number {
  const s = (Math.imul(r32(SYS.RandSeed) | 0, 0x08088405) + 1) | 0;
  w32(SYS.RandSeed, s);
  return s >>> 0;
}

export function RandomN(n: number): number {
  const s = nextSeed();
  if (n <= 0) return 0;
  if (n < 2097152) return Math.floor((s * n) / 4294967296);
  return Number((BigInt(s) * BigInt(n)) >> 32n);
}

export function Random(): number {
  return nextSeed() / 4294967296;
}

export function Randomize(): void {
  w32(SYS.RandSeed, (Date.now() ^ (Math.random() * 0x7fffffff)) | 0);
}

// ---- strings

export function chAt(s: string, i: number): number {
  return i > 0 && i <= s.length ? s.charCodeAt(i - 1) : 0;
}

export function Copy(s: string, i: number, n = 255): string {
  if (i < 1) i = 1;
  if (n <= 0 || i > s.length) return '';
  return s.substr(i - 1, n);
}

export function Pos(sub: string, s: string): number {
  if (!sub.length) return 0;
  return s.indexOf(sub) + 1;
}

export function Delete(s: string, i: number, n: number): string {
  if (i < 1 || i > s.length || n <= 0) return s;
  return s.slice(0, i - 1) + s.slice(i - 1 + n);
}

export function Insert(src: string, s: string, i: number): string {
  if (i < 1) i = 1;
  if (i > s.length) return s + src;
  return s.slice(0, i - 1) + src + s.slice(i - 1);
}

export function UpCase(c: number): number {
  return c >= 97 && c <= 122 ? c - 32 : c;
}

export function UpperCase(s: string): string {
  return s.replace(/[a-z]/g, (c) => c.toUpperCase());
}

export function LowerCase(s: string): string {
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

export function padL(s: string, w: number): string {
  return s.length >= w ? s : ' '.repeat(w - s.length) + s;
}

export function fmtI(x: number, w: number): string {
  return padL(String(Math.trunc(x)), w);
}

export function fmtR(x: number, w: number, d: number): string {
  if (d >= 0) return padL(x.toFixed(d), w);
  // Turbo Pascal's scientific form
  const digits = Math.max(1, (w > 0 ? w : 17) - 8);
  let e = x === 0 ? 0 : Math.floor(Math.log10(Math.abs(x)));
  let m = x === 0 ? 0 : x / 10 ** e;
  if (Math.abs(Number(m.toFixed(digits))) >= 10) {
    m /= 10;
    e++;
  }
  return (x < 0 ? '-' : ' ') + Math.abs(m).toFixed(digits) + 'E' + (e < 0 ? '-' : '+') + String(Math.abs(e)).padStart(2, '0');
}

export const valCode = { v: 0 };

export function valI(s: string): number {
  let i = 0;
  while (i < s.length && s[i] === ' ') i++;
  const body = s.slice(i);
  const m = /^[+-]?(\$[0-9A-Fa-f]+|[0-9]+)/.exec(body);
  if (!m) {
    valCode.v = Math.min(i + 1, s.length) || 1;
    return 0;
  }
  if (m[0].length !== body.length) {
    valCode.v = i + m[0].length + 1;
    return 0;
  }
  valCode.v = 0;
  const neg = body[0] === '-';
  const digits = body.replace(/^[+-]/, '');
  const v = digits[0] === '$' ? parseInt(digits.slice(1), 16) : parseInt(digits, 10);
  return neg ? -v : v;
}

export function valR(s: string): number {
  const t = s.trim();
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) {
    valCode.v = 1;
    return 0;
  }
  valCode.v = 0;
  return Number(t);
}

/** An array of characters as a string: all of it. */
export function arrStr(a: number, size: number): string {
  let s = '';
  for (let i = 0; i < size; i++) s += String.fromCharCode(U8[a + i]);
  return s;
}

/** A string into an array of characters at a, padded with zeros; the array's address. */
export function strArr(a: number, size: number, s: string): number {
  for (let i = 0; i < size; i++) U8[a + i] = i < s.length ? s.charCodeAt(i) : 0;
  return a;
}

/** A string value put in memory at a, where a routine takes a place: its address. */
export function tmpS(a: number, s: string): number {
  wS(a, 255, s);
  return a;
}

export function tmpSet(a: number, s: Uint8Array): number {
  U8.set(s, a);
  return a;
}

export function fill(a: number, n: number, v: number | boolean): void {
  if (n > 0) U8.fill(Number(v) & 255, a, a + n);
}

// ---- sets: 256 bits

export function setR(...pairs: number[]): Uint8Array {
  const s = new Uint8Array(32);
  for (let i = 0; i < pairs.length; i += 2) {
    const lo = Math.max(0, pairs[i]);
    const hi = Math.min(255, pairs[i + 1]);
    for (let v = lo; v <= hi; v++) s[v >> 3] |= 1 << (v & 7);
  }
  return s;
}

export function rSet(a: number, byteLo: number, size: number): Uint8Array {
  const s = new Uint8Array(32);
  for (let i = 0; i < size; i++) s[byteLo + i] = U8[a + i];
  return s;
}

export function wSet(a: number, byteLo: number, size: number, s: Uint8Array): void {
  for (let i = 0; i < size; i++) U8[a + i] = s[byteLo + i];
}

export function inS(s: Uint8Array, x: number): boolean {
  return x >= 0 && x <= 255 && (s[x >> 3] & (1 << (x & 7))) !== 0;
}

export function inM(a: number, byteLo: number, size: number, x: number): boolean {
  const b = (x >> 3) - byteLo;
  return x >= 0 && b >= 0 && b < size && (U8[a + b] & (1 << (x & 7))) !== 0;
}

export function include(a: number, byteLo: number, size: number, x: number): void {
  const b = (x >> 3) - byteLo;
  if (b >= 0 && b < size) U8[a + b] |= 1 << (x & 7);
}

export function exclude(a: number, byteLo: number, size: number, x: number): void {
  const b = (x >> 3) - byteLo;
  if (b >= 0 && b < size) U8[a + b] &= ~(1 << (x & 7));
}

export function sUnion(a: Uint8Array, b: Uint8Array): Uint8Array {
  const s = new Uint8Array(32);
  for (let i = 0; i < 32; i++) s[i] = a[i] | b[i];
  return s;
}

export function sDiff(a: Uint8Array, b: Uint8Array): Uint8Array {
  const s = new Uint8Array(32);
  for (let i = 0; i < 32; i++) s[i] = a[i] & ~b[i];
  return s;
}

export function sInter(a: Uint8Array, b: Uint8Array): Uint8Array {
  const s = new Uint8Array(32);
  for (let i = 0; i < 32; i++) s[i] = a[i] & b[i];
  return s;
}

export function sEq(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = 0; i < 32; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function sNe(a: Uint8Array, b: Uint8Array): boolean {
  return !sEq(a, b);
}

export function sLe(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = 0; i < 32; i++) if (a[i] & ~b[i]) return false;
  return true;
}

export function sGe(a: Uint8Array, b: Uint8Array): boolean {
  return sLe(b, a);
}

// ---- files

interface FileObj {
  name: string;
  path: string;
  open: boolean;
  text: boolean;
  /** 'r' reading text, 'w' writing text. */
  mode: string;
  recSize: number;
  pos: number;
  file: vfs.VFile | null;
  dirty: boolean;
  std: boolean;
}

const fileObjs = new Map<number, FileObj>();
let nextFileId = 1;
let stdLine = '';

function setIo(code: number): void {
  w16(SYS.InOutRes, code);
}

function ioBad(): boolean {
  return ri16(SYS.InOutRes) !== 0;
}

export function IOResult(): number {
  const v = ri16(SYS.InOutRes);
  w16(SYS.InOutRes, 0);
  return v;
}

function fobj(a: number): FileObj | undefined {
  return fileObjs.get(r32(a));
}

function isStd(a: number): boolean {
  return a === 0 || a === SYS.Output || a === SYS.StdErr || a === SYS.Input;
}

export function Assign(a: number, name: string): void {
  const id = nextFileId++;
  fileObjs.set(id, { name, path: name === '' ? '' : vfs.normalize(name), open: false, text: false, mode: '', recSize: 1, pos: 0, file: null, dirty: false, std: name === '' });
  w32(a, id);
  w32(a + 4, 0);
}

/** The DOS device names open nothing here. */
function openExisting(f: FileObj): boolean {
  const vf = vfs.files.get(f.path);
  if (!vf) {
    setIo(vfs.dirs.has(vfs.dirOf(f.path)) ? 2 : 3);
    return false;
  }
  f.file = vf;
  f.open = true;
  f.pos = 0;
  f.dirty = false;
  return true;
}

function create(f: FileObj): boolean {
  if (!vfs.dirs.has(vfs.dirOf(f.path))) {
    setIo(3);
    return false;
  }
  if (vfs.dirs.has(f.path)) {
    setIo(5);
    return false;
  }
  const vf: vfs.VFile = { data: new Uint8Array(256), size: 0, mtime: Date.now() };
  vfs.files.set(f.path, vf);
  f.file = vf;
  f.open = true;
  f.pos = 0;
  f.dirty = true;
  return true;
}

export function ResetF(a: number, recSize: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (f.open) closeObj(f);
  f.text = false;
  f.recSize = recSize || 1;
  if (f.std) return setIo(2);
  openExisting(f);
}

export function RewriteF(a: number, recSize: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (f.open) closeObj(f);
  f.text = false;
  f.recSize = recSize || 1;
  if (f.std) return setIo(5);
  create(f);
}

export function ResetT(a: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (f.open) closeObj(f);
  f.text = true;
  f.mode = 'r';
  if (f.std) {
    f.open = true;
    return;
  }
  openExisting(f);
}

export function RewriteT(a: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (f.open) closeObj(f);
  f.text = true;
  f.mode = 'w';
  if (f.std) {
    f.open = true;
    return;
  }
  create(f);
}

export function AppendT(a: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (f.open) closeObj(f);
  f.text = true;
  f.mode = 'w';
  if (f.std) {
    f.open = true;
    return;
  }
  if (openExisting(f)) {
    const vf = f.file!;
    // a DOS text file may end in Ctrl-Z: writing goes on over it
    if (vf.size && vf.data[vf.size - 1] === 0x1a) vf.size--;
    f.pos = vf.size;
  }
}

function closeObj(f: FileObj): void {
  if (f.open && f.dirty && f.file) {
    f.file.mtime = Date.now();
    vfs.hooks.onChange(f.path, f.file);
  }
  f.open = false;
  f.dirty = false;
  f.file = null;
}

export function Close(a: number): void {
  if (ioBad()) return;
  if (isStd(a)) return;
  const f = fobj(a);
  if (!f || !f.open) return setIo(103);
  closeObj(f);
}

export function Flush(a: number): void {
  if (isStd(a)) return;
  const f = fobj(a);
  if (f && f.open && f.dirty && f.file) {
    f.file.mtime = Date.now();
    vfs.hooks.onChange(f.path, f.file);
    f.dirty = false;
  }
}

export function Erase(a: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  if (!vfs.remove(f.path)) setIo(2);
}

export function Rename(a: number, name: string): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f) return setIo(102);
  const to = vfs.normalize(name);
  const vf = vfs.files.get(f.path);
  if (!vf) return setIo(2);
  if (vfs.files.has(to) || vfs.dirs.has(to)) return setIo(5);
  if (!vfs.dirs.has(vfs.dirOf(to))) return setIo(3);
  vfs.files.delete(f.path);
  vfs.hooks.onChange(f.path, null);
  vfs.files.set(to, vf);
  vfs.hooks.onChange(to, vf);
  f.path = to;
  f.name = name;
}

function ensure(vf: vfs.VFile, size: number): void {
  if (size > vf.data.length) {
    let cap = vf.data.length || 256;
    while (cap < size) cap *= 2;
    const bigger = new Uint8Array(cap);
    bigger.set(vf.data.subarray(0, vf.size));
    vf.data = bigger;
  }
}

export function BlockRead(a: number, buf: number, count: number, hasResult: boolean): number {
  if (ioBad()) return 0;
  const f = fobj(a);
  if (!f || !f.open || !f.file) {
    setIo(103);
    return 0;
  }
  const want = count * f.recSize;
  const have = Math.max(0, Math.min(want, f.file.size - f.pos));
  const recs = Math.floor(have / f.recSize);
  const bytes = hasResult ? recs * f.recSize : have;
  U8.set(f.file.data.subarray(f.pos, f.pos + bytes), buf);
  f.pos += bytes;
  if (!hasResult && have < want) setIo(100);
  return recs;
}

export function BlockWrite(a: number, buf: number, count: number, hasResult: boolean): number {
  if (ioBad()) return 0;
  const f = fobj(a);
  if (!f || !f.open || !f.file) {
    setIo(103);
    return 0;
  }
  const bytes = count * f.recSize;
  const vf = f.file;
  ensure(vf, f.pos + bytes);
  vf.data.set(U8.subarray(buf, buf + bytes), f.pos);
  f.pos += bytes;
  if (f.pos > vf.size) vf.size = f.pos;
  f.dirty = true;
  return count;
}

export function ReadRec(a: number, buf: number, size: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f || !f.open || !f.file) return setIo(103);
  if (f.pos + size > f.file.size) return setIo(100);
  U8.set(f.file.data.subarray(f.pos, f.pos + size), buf);
  f.pos += size;
}

export function WriteRec(a: number, buf: number, size: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f || !f.open || !f.file) return setIo(103);
  const vf = f.file;
  ensure(vf, f.pos + size);
  vf.data.set(U8.subarray(buf, buf + size), f.pos);
  f.pos += size;
  if (f.pos > vf.size) vf.size = f.pos;
  f.dirty = true;
}

export function Seek(a: number, rec: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f || !f.open) return setIo(103);
  f.pos = rec * f.recSize;
}

export function FilePos(a: number): number {
  if (ioBad()) return 0;
  const f = fobj(a);
  if (!f || !f.open) {
    setIo(103);
    return 0;
  }
  return Math.floor(f.pos / f.recSize);
}

export function FileSize(a: number): number {
  if (ioBad()) return 0;
  const f = fobj(a);
  if (!f || !f.open || !f.file) {
    setIo(103);
    return 0;
  }
  return Math.floor(f.file.size / f.recSize);
}

export function Truncate(a: number): void {
  if (ioBad()) return;
  const f = fobj(a);
  if (!f || !f.open || !f.file) return setIo(103);
  f.file.size = f.pos;
  f.dirty = true;
}

export function Eof(a: number): boolean {
  if (isStd(a)) return true;
  const f = fobj(a);
  if (!f || !f.open || !f.file) return true;
  if (f.pos >= f.file.size) return true;
  return f.text && f.file.data[f.pos] === 0x1a;
}

export function Eoln(a: number): boolean {
  if (Eof(a)) return true;
  const f = fobj(a)!;
  const c = f.file!.data[f.pos];
  return c === 13 || c === 10;
}

export function WriteT(a: number, s: string): void {
  const f = isStd(a) ? undefined : fobj(a);
  if (!f || f.std) {
    stdLine += s;
    for (let i = stdLine.indexOf('\n'); i >= 0; i = stdLine.indexOf('\n')) {
      env.out(stdLine.slice(0, i));
      stdLine = stdLine.slice(i + 1);
    }
    return;
  }
  if (ioBad()) return;
  if (!f.open || !f.file) return setIo(103);
  const text = s.replace(/\n/g, '\r\n');
  const vf = f.file;
  ensure(vf, f.pos + text.length);
  for (let i = 0; i < text.length; i++) vf.data[f.pos + i] = text.charCodeAt(i);
  f.pos += text.length;
  if (f.pos > vf.size) vf.size = f.pos;
  f.dirty = true;
}

function textFile(a: number): FileObj | null {
  if (isStd(a)) return null;
  const f = fobj(a);
  if (!f || f.std) return null;
  if (ioBad()) return null;
  if (!f.open || !f.file) {
    setIo(103);
    return null;
  }
  return f;
}

export function ReadStrT(a: number): string {
  const f = textFile(a);
  if (!f) return '';
  const d = f.file!.data;
  const end = f.file!.size;
  let s = '';
  while (f.pos < end) {
    const c = d[f.pos];
    if (c === 13 || c === 10 || c === 0x1a) break;
    if (s.length < 255) s += String.fromCharCode(c);
    f.pos++;
  }
  return s;
}

export function ReadCharT(a: number): number {
  const f = textFile(a);
  if (!f) return 26;
  if (f.pos >= f.file!.size) return 26;
  return f.file!.data[f.pos++];
}

function readToken(a: number): string {
  const f = textFile(a);
  if (!f) return '';
  const d = f.file!.data;
  const end = f.file!.size;
  while (f.pos < end && (d[f.pos] === 32 || d[f.pos] === 9 || d[f.pos] === 13 || d[f.pos] === 10)) f.pos++;
  let s = '';
  while (f.pos < end && d[f.pos] > 32 && d[f.pos] !== 0x1a) s += String.fromCharCode(d[f.pos++]);
  return s;
}

export function ReadIntT(a: number): number {
  const t = readToken(a);
  const v = valI(t);
  if (valCode.v !== 0 && t !== '') setIo(106);
  return v;
}

export function ReadRealT(a: number): number {
  const t = readToken(a);
  const v = valR(t);
  if (valCode.v !== 0 && t !== '') setIo(106);
  return v;
}

export function ReadLnT(a: number): void {
  const f = textFile(a);
  if (!f) return;
  const d = f.file!.data;
  const end = f.file!.size;
  while (f.pos < end && d[f.pos] !== 13 && d[f.pos] !== 10 && d[f.pos] !== 0x1a) f.pos++;
  if (f.pos < end && d[f.pos] === 13) f.pos++;
  if (f.pos < end && d[f.pos] === 10) f.pos++;
}

export function MkDir(name: string): void {
  if (ioBad()) return;
  const p = vfs.normalize(name);
  if (vfs.dirs.has(p) || vfs.files.has(p)) return setIo(5);
  if (!vfs.dirs.has(vfs.dirOf(p))) return setIo(3);
  vfs.dirs.add(p);
}

export function RmDir(name: string): void {
  if (ioBad()) return;
  const p = vfs.normalize(name);
  if (!vfs.dirs.has(p)) return setIo(3);
  for (const k of vfs.files.keys()) if (vfs.dirOf(k) === p) return setIo(5);
  vfs.dirs.delete(p);
}

export function ChDir(name: string): void {
  if (ioBad()) return;
  const p = vfs.normalize(name);
  if (!vfs.dirs.has(p)) return setIo(3);
  vfs.setCwd(p);
}

export function GetDir(): string {
  return vfs.getCwd();
}

/** The path a file variable was assigned, and the file there: for Dos.GetFTime and its like. */
export function fileInfo(a: number): { path: string; file: vfs.VFile | undefined } | null {
  const f = fobj(a);
  if (!f) return null;
  return { path: f.path, file: f.file ?? vfs.files.get(f.path) };
}

export function reset(): void {
  fileObjs.clear();
  stdLine = '';
}
