/**
 * codegen.ts
 *
 * Routine bodies to TypeScript. The game's data lives in one block of memory (rt/mem.ts) laid out as Turbo Pascal
 * lays it out, so records read from the game's files, Move, FillChar, variant records and pointers all mean what they
 * meant: a variable is an address, a field an offset. Whole numbers, characters and pointers that never have their
 * address taken are plain JavaScript locals.
 *
 * A routine that can wait (for a key, for time to pass) becomes an async function, and so does everything that calls
 * it: call sites are written with markers, and once every unit is generated the markers become "await" where the
 * callee turned out to be async.
 */
import { Compiler, constEval, CompileError, jsIdent, lookupSym } from './parser.ts';
import type { CV } from './parser.ts';
import { isOrd, isStructured, ptrTarget, Scope, setType, T } from './model.ts';
import type { Arg, ConstVal, Expr, FuncSym, Param, Stmt, Sym, Ty, Unit, VarSym } from './model.ts';

interface Value {
  c: string;
  ty: Ty;
  atom?: boolean;
  cv?: ConstVal;
  /** Known bounds of a whole number. */
  rng?: [number, number];
}

type LV =
  | { kind: 'js'; name: string; ty: Ty; sym: VarSym }
  | { kind: 'mem'; base: string | null; off: number; ty: Ty | null };

type Des =
  | { k: 'lv'; lv: LV }
  | { k: 'val'; v: Value }
  | { k: 'func'; f: FuncSym }
  | { k: 'type'; ty: Ty }
  | { k: 'unit'; u: Unit }
  | { k: 'builtin'; name: string };

const OPEN = '\u0001';
const CLOSE = '\u0002';
const ASYNC = '\u0003';

function jsStr(s: string): string {
  let out = '"';
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (ch === '"' || ch === '\\') out += '\\' + ch;
    else if (c >= 32 && c < 127) out += ch;
    else out += '\\x' + c.toString(16).padStart(2, '0');
  }
  return out + '"';
}

const num = (n: number): string => (Object.is(n, -0) ? '0' : String(n));

function depthOf(f: FuncSym): number {
  let d = 0;
  for (let p = f.parent; p; p = p.parent) d++;
  return d;
}

function sigKey(params: Param[], result: Ty | null): string {
  return `${params.length}${result ? 'f' : 'p'}`;
}

export class Gen {
  /** caller id -> callee ids (negative: an indirect call of that signature) */
  edges = new Map<number, Set<number>>();
  sigIds = new Map<string, number>();
  asyncRoots = new Set<number>();

  // per top-level routine
  private memVars = new Set<VarSym>();
  private dirty = false;
  // per routine being written
  private cur!: FuncSym;
  private unit!: Unit;
  private frameOff = new Map<VarSym, number>();
  private frameSize = new Map<FuncSym, number>();
  private tempN = 0;
  private withStack: { ty: Ty; base: string | null; off: number }[] = [];
  private loopStack: { label: string; used: boolean; switchDepth: number }[] = [];
  private switchDepth = 0;
  private lines: string[] = [];
  private ind = 0;
  private unitNs = new Map<Unit, string>();
  private curEdges!: Set<number>;

  private c: Compiler;
  constructor(c: Compiler) {
    this.c = c;
  }

  // ---------------------------------------------------------------- units

  genUnit(u: Unit): string {
    this.unit = u;
    const used: Unit[] = [];
    for (const x of [...u.usesIface, ...u.usesImpl]) if (!used.includes(x) && x !== u) used.push(x);
    // names a unit's namespace must not hide
    const taken = new Set<string>();
    const collect = (f: FuncSym) => {
      taken.add(f.jsName);
      for (const p of f.params) taken.add(jsIdent(p.name));
      for (const l of f.locals) taken.add(l.jsName!);
      f.nested.forEach(collect);
    };
    u.funcs.forEach(collect);
    for (const k of u.consts) taken.add(jsIdent(k.name));
    this.unitNs.clear();
    for (const x of used) this.unitNs.set(x, taken.has(x.name) || jsIdent(x.name) !== x.name ? x.name + '_u' : x.name);

    const out: string[] = [];
    out.push(`// Generated from ${u.file.replace(/^.*\/(src|web)\//, '$1/')} by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".`);
    out.push(`// @ts-nocheck`);
    out.push(`import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';`);
    out.push(`import * as rt from '../rt/sys';`);
    for (const x of used) out.push(`import * as ${this.unitNs.get(x)} from './${x.name.toLowerCase()}';`);
    const hasExt = u.funcs.some((f) => f.external);
    if (hasExt) out.push(`import * as $ext from '../host/x_${u.name.toLowerCase()}';`);
    out.push('');
    const seen = new Set<string>();
    for (const k of u.consts) {
      const n = jsIdent(k.name);
      if (seen.has(n)) continue;
      seen.add(n);
      out.push(`export const ${n} = ${this.constLit(k.v, k.ty)};`);
    }
    // the addresses of the unit's variables, for the host's own code (the interface reads the game's state)
    const addrs = u.globals.filter((g) => g.addr !== undefined);
    if (addrs.length) {
      out.push('');
      out.push(`export const $at = { ${addrs.map((g) => `${jsIdent(g.name)}: ${g.addr}`).join(', ')} };`);
    }
    out.push('');
    for (const f of u.funcs) {
      if (f.external) {
        out.push(`export const ${f.jsName} = $ext.${f.name};`);
        if (f.external === 'async') this.asyncRoots.add(f.id);
        continue;
      }
      if (!f.body) throw new CompileError(`${u.file}: ${f.name} is declared but has no body`);
      out.push(this.genTop(f, true));
      out.push('');
    }
    if (u.init) {
      out.push(this.genTop(u.init, true));
      out.push('');
    }
    return out.join('\n');
  }

  constLit(v: ConstVal, ty: Ty): string {
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') return num(v);
    if (typeof v === 'string') return jsStr(v);
    const pairs: number[] = [];
    for (let i = 0; i < 256; i++) {
      if (v[i >> 3] & (1 << (i & 7))) {
        let j = i;
        while (j < 255 && v[(j + 1) >> 3] & (1 << ((j + 1) & 7))) j++;
        pairs.push(i, j);
        i = j;
      }
    }
    return `rt.setR(${pairs.join(', ')})`;
  }

  private genTop(f: FuncSym, exported: boolean): string {
    this.memVars = new Set();
    let text = '';
    for (let tries = 0; tries < 12; tries++) {
      this.dirty = false;
      this.lines = [];
      this.ind = 0;
      this.tempN = 0;
      this.genFunc(f, exported);
      text = this.lines.join('\n');
      if (!this.dirty) return text;
    }
    throw new CompileError(`${f.unit.file}:${f.line}: ${f.name} did not settle`);
  }

  private emit(s: string): void {
    this.lines.push('  '.repeat(this.ind) + s);
  }

  private tsType(t: Ty | null, mode: string): string {
    if (!t || mode === 'var') return 'number';
    if (t.k === 'bool') return 'boolean';
    if (t.k === 'string') return 'string';
    if (t.k === 'set') return 'Uint8Array';
    return 'number';
  }

  private isJsKind(t: Ty | null): boolean {
    return !!t && (isOrd(t) || t.k === 'real' || t.k === 'pointer' || t.k === 'proc');
  }

  private zero(t: Ty): string {
    if (t.k === 'bool') return 'false';
    if (t.k === 'string') return '""';
    if (t.k === 'set') return 'rt.setR()';
    return '0';
  }

  private genFunc(f: FuncSym, exported: boolean): void {
    const saveCur = this.cur;
    const saveWith = this.withStack;
    const saveLoops = this.loopStack;
    const saveSwitch = this.switchDepth;
    const saveEdges = this.curEdges;
    this.cur = f;
    this.withStack = [];
    this.loopStack = [];
    this.switchDepth = 0;
    this.curEdges = new Set();
    this.edges.set(f.id, this.curEdges);
    const d = depthOf(f);
    const fv = `$f${d}`;
    let size = 0;
    const entry: string[] = [];
    const params: string[] = [];
    const structResult = f.result && (isStructured(f.result) || f.result.k === 'file');
    if (structResult) params.push('$res: number');
    for (const p of f.paramSyms) {
      const t = p.ty;
      params.push(`${p.jsName}: ${this.tsType(t, p.mode!)}`);
      if (t && t.k === 'openarray') params.push(`${p.jsName}$high: number`);
      if (p.mode === 'var' || !t || t.k === 'openarray' || t.k === 'file' || t.k === 'text') continue;
      if (isStructured(t)) {
        if (p.mode === 'value') {
          this.frameOff.set(p, size);
          entry.push(`mv(${fv} + ${size}, ${p.jsName}, ${t.size});`);
          size += t.size;
        }
        continue;
      }
      if (this.memVars.has(p)) {
        this.frameOff.set(p, size);
        entry.push(this.storeCode({ kind: 'mem', base: fv, off: size, ty: t }, p.jsName!) + ';');
        size += t.size;
      }
    }
    const jsLocals: string[] = [];
    for (const l of f.locals) {
      if ((l as any).alias) continue;
      const t = l.ty!;
      if (this.isJsKind(t) && !this.memVars.has(l)) jsLocals.push(`${l.jsName}: ${this.tsType(t, 'value')} = ${this.zero(t)}`);
      else {
        this.frameOff.set(l, size);
        size += t.size;
      }
    }
    const rs = f.resultSym;
    let ret = '';
    if (rs) {
      rs.jsName = `$r${d}`;
      const t = rs.ty!;
      if (structResult) ret = '$res';
      else if (this.memVars.has(rs)) {
        this.frameOff.set(rs, size);
        ret = this.loadCode({ kind: 'mem', base: fv, off: size, ty: t });
        size += t.size;
      } else {
        jsLocals.push(`${rs.jsName}: ${this.tsType(t, 'value')} = ${this.zero(t)}`);
        ret = rs.jsName;
      }
    }
    this.frameSize.set(f, size);
    const head = `${exported ? 'export ' : ''}${ASYNC}${f.id};function ${f.jsName}(${params.join(', ')}) {`;
    this.emit(head);
    this.ind++;
    const frameAt = this.lines.length;
    for (const e of entry) this.emit(e);
    if (jsLocals.length) this.emit(`let ${jsLocals.join(', ')};`);
    for (const n of f.nested) {
      if (n.body) this.genFunc(n, false);
    }
    const bodyAt = this.lines.length;
    for (const s of f.body!) this.stmt(s);
    // the frame, now that the temporaries are counted
    const total = this.frameSize.get(f)!;
    const exitCode = total ? `{ S.sp = $sp; return${ret ? ' ' + ret : ''}; }` : `return${ret ? ' ' + ret : ''};`;
    for (let i = bodyAt; i < this.lines.length; i++) this.lines[i] = this.lines[i].replaceAll(`\u0006${f.id};`, exitCode);
    if (total) {
      this.lines.splice(frameAt, 0, '  '.repeat(this.ind) + `const $sp = S.sp, ${fv} = (S.sp = $sp - ${total});`);
      this.emit('S.sp = $sp;');
    }
    if (ret) this.emit(`return ${ret};`);
    this.ind--;
    this.emit('}');
    this.cur = saveCur;
    this.withStack = saveWith;
    this.loopStack = saveLoops;
    this.switchDepth = saveSwitch;
    this.curEdges = saveEdges;
  }

  private allocTemp(size: number): LV {
    const f = this.cur;
    const off = this.frameSize.get(f)!;
    this.frameSize.set(f, off + size);
    return { kind: 'mem', base: `$f${depthOf(f)}`, off, ty: null };
  }

  private err(e: { line: number }, msg: string): never {
    throw new CompileError(`${this.unit.file}:${e.line}: ${msg} (in ${this.cur?.name})`);
  }

  // ---------------------------------------------------------------- memory access

  private addr(lv: LV): string {
    if (lv.kind !== 'mem') throw new Error('addr of a local');
    if (lv.base === null) return num(lv.off);
    if (lv.off === 0) return lv.base;
    return lv.off > 0 ? `${lv.base} + ${lv.off}` : `${lv.base} - ${-lv.off}`;
  }

  private loadCode(lv: LV): string {
    if (lv.kind === 'js') return lv.name;
    const t = lv.ty;
    const a = this.addr(lv);
    if (!t) return a;
    switch (t.k) {
      case 'bool':
        return `(U8[${a}] !== 0)`;
      case 'char':
        return `U8[${a}]`;
      case 'int':
      case 'enum':
        if (t.size === 1) return t.signed ? `I8[${a}]` : `U8[${a}]`;
        if (t.size === 2) return t.signed ? `ri16(${a})` : `r16(${a})`;
        if (t.size === 8) return `rt.r64(${a})`;
        return t.signed ? `ri32(${a})` : `r32(${a})`;
      case 'real':
        return t.size === 4 ? `rF32(${a})` : `rF64(${a})`;
      case 'pointer':
      case 'proc':
        return `r32(${a})`;
      case 'string':
        return `rS(${a})`;
      case 'set':
        return `rt.rSet(${a}, ${t.byteLo}, ${t.size})`;
      default:
        return `(${a})`;
    }
  }

  private storeCode(lv: LV, v: string): string {
    if (lv.kind === 'js') return `${lv.name} = ${v}`;
    const t = lv.ty;
    const a = this.addr(lv);
    if (!t) throw new Error('store to an untyped place');
    switch (t.k) {
      case 'bool':
        return `U8[${a}] = ${v} ? 1 : 0`;
      case 'char':
        return `U8[${a}] = ${v}`;
      case 'int':
      case 'enum':
        if (t.size === 1) return `U8[${a}] = ${v}`;
        if (t.size === 2) return `w16(${a}, ${v})`;
        if (t.size === 8) return `rt.w64(${a}, ${v})`;
        return `w32(${a}, ${v})`;
      case 'real':
        return t.size === 4 ? `wF32(${a}, ${v})` : `wF64(${a}, ${v})`;
      case 'pointer':
      case 'proc':
        return `w32(${a}, ${v})`;
      case 'string':
        return `wS(${a}, ${t.max}, ${v})`;
      case 'set':
        return `rt.wSet(${a}, ${t.byteLo}, ${t.size}, ${v})`;
      default:
        return `mv(${a}, ${v}, ${t.size})`;
    }
  }

  /** Keep a whole number within a local's type, as storing it in memory would. */
  private wrap(v: Value, t: Ty): string {
    if (t.k !== 'int' && t.k !== 'char' && t.k !== 'enum') return v.c;
    if (v.ty.k === 'real') return v.c;
    const lo = t.k === 'char' ? 0 : t.size === 1 ? (t.signed ? -128 : 0) : t.size === 2 ? (t.signed ? -32768 : 0) : t.signed ? -2147483648 : 0;
    const hi = t.k === 'char' ? 255 : t.size === 1 ? (t.signed ? 127 : 255) : t.size === 2 ? (t.signed ? 32767 : 65535) : t.signed ? 2147483647 : 4294967295;
    const r = v.rng;
    if (r && r[0] >= lo && r[1] <= hi) return v.c;
    const p = this.par(v);
    if (t.k === 'char' || t.k === 'enum') return `${p} & 255`;
    if (t.size === 1) return t.signed ? `${p} << 24 >> 24` : `${p} & 255`;
    if (t.size === 2) return t.signed ? `${p} << 16 >> 16` : `${p} & 65535`;
    if (t.size === 8) return `Math.trunc(${v.c})`;
    return t.signed ? `${p} | 0` : `${p} >>> 0`;
  }

  private par(v: Value): string {
    return v.atom ? v.c : `(${v.c})`;
  }

  private load(lv: LV): Value {
    const c = this.loadCode(lv);
    const t = lv.ty ?? T.pointer;
    const v: Value = { c, ty: t, atom: true };
    if ((t.k === 'int' || t.k === 'char' || t.k === 'enum') && t.lo !== undefined) {
      // a local holds what its type's storage holds; a subrange's storage is wider than the subrange
      const s = t.size;
      v.rng = t.k !== 'int' ? [0, 255] : s === 1 ? (t.signed ? [-128, 127] : [0, 255]) : s === 2 ? (t.signed ? [-32768, 32767] : [0, 65535]) : t.signed ? [-2147483648, 2147483647] : [0, 4294967295];
    }
    return v;
  }

  private store(lv: LV, v: Value, e: { line: number }): string {
    const t = lv.ty;
    if (!t) this.err(e, 'assignment to an untyped place');
    const c = this.coerce(v, t, e);
    if (lv.kind === 'js') return this.storeCode(lv, this.wrap({ ...v, c }, t));
    return this.storeCode(lv, c);
  }

  // ---------------------------------------------------------------- coercion

  private coerce(v: Value, to: Ty | null, e: { line: number }): string {
    if (!to) return v.c;
    const from = v.ty;
    switch (to.k) {
      case 'string':
        if (from.k === 'char') return typeof v.cv === 'number' ? jsStr(String.fromCharCode(v.cv)) : `String.fromCharCode(${v.c})`;
        if (from.k === 'array' && from.elem!.k === 'char') return `rt.arrStr(${v.c}, ${from.size})`;
        if (from.k !== 'string') this.err(e, `cannot use ${from.k} as a string`);
        return v.c;
      case 'char':
        if (from.k === 'string') {
          if (typeof v.cv === 'string' && v.cv.length === 1) return num(v.cv.charCodeAt(0));
          this.err(e, 'cannot use a string as a character');
        }
        return v.c;
      case 'bool':
        if (from.k !== 'bool') this.err(e, `cannot use ${from.k} as a Boolean`);
        return v.c;
      case 'int':
      case 'enum':
      case 'real':
        if (from.k === 'bool') return `(${v.c} ? 1 : 0)`;
        if (from.k === 'string' || isStructured(from) || from.k === 'set') this.err(e, `cannot use ${from.k} as a number`);
        return v.c;
      case 'array':
        if ((from.k === 'string' || from.k === 'char') && to.elem!.k === 'char') {
          const tmp = this.allocTemp(to.size);
          return `rt.strArr(${this.addr(tmp)}, ${to.size}, ${this.coerce(v, T.string, e)})`;
        }
        return v.c;
      default:
        return v.c;
    }
  }

  private str(v: Value, e: { line: number }): string {
    return this.coerce(v, T.string, e);
  }

  // ---------------------------------------------------------------- names

  private lookup(name: string): Sym | undefined {
    return lookupSym(this.c, this.unit, this.cur.scope, name);
  }

  private unitRef(u: Unit): string {
    return u === this.unit ? '' : (this.unitNs.get(u) ?? u.name) + '.';
  }

  private needMem(s: VarSym): void {
    if (!this.memVars.has(s)) {
      this.memVars.add(s);
      this.dirty = true;
    }
  }

  private varLV(s: VarSym, e: { line: number }): LV {
    const t = s.ty;
    if (s.addr !== undefined) return { kind: 'mem', base: null, off: s.addr, ty: t };
    const alias = (s as any).alias as VarSym | undefined;
    if (alias) {
      const lv = this.varLV(alias, e);
      if (lv.kind === 'js') {
        this.needMem(alias);
        return { kind: 'mem', base: '0', off: 0, ty: t };
      }
      return { ...lv, ty: t };
    }
    const f = s.fn!;
    const fv = `$f${depthOf(f)}`;
    if (s.isParam) {
      if (s.mode === 'var' || !t || t.k === 'openarray' || t.k === 'file' || t.k === 'text') return { kind: 'mem', base: s.jsName!, off: 0, ty: t };
      if (isStructured(t)) {
        if (s.mode === 'const') return { kind: 'mem', base: s.jsName!, off: 0, ty: t };
        return { kind: 'mem', base: fv, off: this.frameOff.get(s) ?? 0, ty: t };
      }
      if (this.memVars.has(s)) return { kind: 'mem', base: fv, off: this.frameOff.get(s) ?? 0, ty: t };
      return { kind: 'js', name: s.jsName!, ty: t, sym: s };
    }
    if (s.isResult) {
      if (isStructured(t) || t!.k === 'file') return { kind: 'mem', base: '$res', off: 0, ty: t };
      if (this.memVars.has(s)) return { kind: 'mem', base: fv, off: this.frameOff.get(s) ?? 0, ty: t };
      return { kind: 'js', name: s.jsName!, ty: t!, sym: s };
    }
    if (this.isJsKind(t) && !this.memVars.has(s)) return { kind: 'js', name: s.jsName!, ty: t!, sym: s };
    return { kind: 'mem', base: fv, off: this.frameOff.get(s) ?? 0, ty: t };
  }

  /** A place as an address: a local that has none is moved into the frame, and the routine written again. */
  private memLV(lv: LV): LV & { kind: 'mem' } {
    if (lv.kind === 'mem') return lv;
    this.needMem(lv.sym);
    return { kind: 'mem', base: '0', off: 0, ty: lv.ty };
  }

  private constVal(v: ConstVal, ty: Ty, named?: string): Value {
    const c = named ?? this.constLit(v, ty);
    const out: Value = { c, ty, cv: v, atom: named !== undefined || typeof v !== 'number' || v >= 0 };
    if (typeof v === 'number' && ty.k !== 'real') out.rng = [v, v];
    return out;
  }

  private symDes(s: Sym, e: Expr): Des {
    switch (s.k) {
      case 'var':
        return { k: 'lv', lv: this.varLV(s, e) };
      case 'const': {
        // a routine's own constants, and the whole numbers everywhere, are written as their values
        const named = s.unit && !s.fn && typeof s.v !== 'number' && typeof s.v !== 'boolean' ? this.unitRef(s.unit) + jsIdent(s.name) : undefined;
        return { k: 'val', v: this.constVal(s.v, s.ty, named) };
      }
      case 'func':
        return { k: 'func', f: s };
      case 'type':
        return { k: 'type', ty: s.ty };
      case 'unit':
        return { k: 'unit', u: s.unit };
      case 'builtin':
        return { k: 'builtin', name: s.name };
    }
  }

  // ---------------------------------------------------------------- designators

  private des(e: Expr, want?: Ty | null): Des {
    switch (e.k) {
      case 'id': {
        for (let i = this.withStack.length - 1; i >= 0; i--) {
          const w = this.withStack[i];
          const f = w.ty.fields!.get(e.name);
          if (f) return { k: 'lv', lv: { kind: 'mem', base: w.base, off: w.off + f.off, ty: f.ty } };
        }
        const s = this.lookup(e.name);
        if (!s) this.err(e, `unknown identifier '${e.raw}'`);
        return this.symDes(s, e);
      }
      case 'fld': {
        const b = this.des(e.e);
        if (b.k === 'unit') {
          const s = b.u.iface.get(e.name) ?? (b.u === this.unit ? b.u.impl.get(e.name) : undefined);
          if (!s) this.err(e, `unit ${b.u.name} has no '${e.raw}'`);
          return this.symDes(s, e);
        }
        const lv = this.desLV(b, e);
        const t = lv.ty;
        if (!t || t.k !== 'record') this.err(e, `'.${e.raw}': not a record (${t?.k})`);
        const f = t.fields!.get(e.name);
        if (!f) this.err(e, `the record has no field '${e.raw}'`);
        return { k: 'lv', lv: { kind: 'mem', base: lv.base, off: lv.off + f.off, ty: f.ty } };
      }
      case 'idx': {
        let b = this.des(e.e);
        for (const ie of e.idxs) {
          // a string held as a JavaScript value
          if ((b.k === 'lv' && b.lv.kind === 'js' && b.lv.ty.k === 'string') || (b.k === 'val' && b.v.ty.k === 'string')) {
            const sv = b.k === 'lv' ? this.load(b.lv) : b.v;
            const i = this.ex(ie);
            const code = i.cv === 0 ? `${this.par(sv)}.length` : typeof i.cv === 'number' ? `rt.chAt(${sv.c}, ${i.cv})` : `rt.chAt(${sv.c}, ${i.c})`;
            b = { k: 'val', v: { c: code, ty: T.char, atom: true, rng: [0, 255] } };
            continue;
          }
          if (b.k === 'func' || (b.k === 'lv' && b.lv.ty?.k === 'proc')) b = { k: 'val', v: this.desVal(b, e) };
          const lv = this.desLV(b, e);
          const t = lv.ty;
          const i = this.ex(ie);
          if (t && t.k === 'string') {
            b = { k: 'lv', lv: this.indexLV(lv, i, 0, 1, T.char) };
          } else if (t && t.k === 'array') {
            b = { k: 'lv', lv: this.indexLV(lv, i, t.lo!, t.elem!.size, t.elem!) };
          } else if (t && t.k === 'openarray') {
            b = { k: 'lv', lv: this.indexLV(lv, i, 0, t.elem!.size, t.elem!) };
          } else if (t && t.k === 'pointer' && ptrTarget(t)) {
            // Free Pascal's p[i]
            const tt = ptrTarget(t)!;
            const p: LV = { kind: 'mem', base: this.par(this.load(lv)), off: 0, ty: tt };
            b = { k: 'lv', lv: this.indexLV(p as any, i, 0, tt.size, tt) };
          } else this.err(e, `cannot index ${t?.k ?? 'an untyped place'}`);
        }
        return b;
      }
      case 'deref': {
        const v = this.ex(e.e);
        if (v.ty.k !== 'pointer') this.err(e, `'^' on ${v.ty.k}`);
        return { k: 'lv', lv: { kind: 'mem', base: this.par(v), off: 0, ty: ptrTarget(v.ty) } };
      }
      case 'call':
        return this.callDes(e, want);
      default:
        return { k: 'val', v: this.ex(e, want) };
    }
  }

  private indexLV(lv: LV & { kind: 'mem' }, i: Value, lo: number, size: number, elem: Ty): LV {
    if (typeof i.cv === 'number' || typeof i.cv === 'boolean') return { kind: 'mem', base: lv.base, off: lv.off + (Number(i.cv) - lo) * size, ty: elem };
    const ic = i.ty.k === 'bool' ? `(${i.c} ? 1 : 0)` : this.par(i);
    const term = size === 1 ? ic : `${ic} * ${size}`;
    const base = lv.base === null ? term : `${lv.base} + ${term}`;
    return { kind: 'mem', base, off: lv.off - lo * size, ty: elem };
  }

  /** A designator as a place in memory. */
  private desLV(d: Des, e: { line: number }): LV & { kind: 'mem' } {
    if (d.k === 'lv') return this.memLV(d.lv);
    if (d.k === 'val') {
      const t = d.v.ty;
      if (isStructured(t)) return { kind: 'mem', base: this.par(d.v), off: 0, ty: t };
      if (t.k === 'string' || t.k === 'char') {
        // a string value where a place is wanted: a temporary holds it
        const tmp = this.allocTemp(256);
        return { kind: 'mem', base: `rt.tmpS(${this.addr(tmp)}, ${this.str(d.v, e)})`, off: 0, ty: T.string };
      }
      if (t.k === 'set') {
        const tmp = this.allocTemp(32);
        return { kind: 'mem', base: `rt.tmpSet(${this.addr(tmp)}, ${d.v.c})`, off: 0, ty: { ...setType(T.byte) } };
      }
      if (this.isJsKind(t)) {
        const tmp = this.allocTemp(8);
        const lv: LV = { kind: 'mem', base: tmp.base, off: tmp.off, ty: t };
        return { kind: 'mem', base: `(${this.storeCode(lv, this.coerce(d.v, t, e))}, ${this.addr(lv)})`, off: 0, ty: t };
      }
    }
    if (d.k === 'func') {
      // a function's result where a place is wanted
      return this.desLV({ k: 'val', v: this.callFunc(d.f, [], e) }, e);
    }
    this.err(e, `not a variable (${d.k})`);
  }

  private desVal(d: Des, e: { line: number }, want?: Ty | null): Value {
    switch (d.k) {
      case 'val':
        return d.v;
      case 'lv': {
        const t = d.lv.ty;
        if (t && t.k === 'proc' && !(want && want.k === 'proc') && t.params!.length === 0 && t.result)
          return this.callIndirect(this.load(d.lv), t, [], e);
        if (!t) return { c: this.addr(d.lv as any), ty: T.pointer };
        return this.load(d.lv);
      }
      case 'func':
        // a routine's name where a procedure variable is wanted is the routine; anywhere else it is a call
        if (want && want.k === 'proc') return { c: num(this.c.procIndex(d.f)), ty: T.pointer, atom: true };
        return this.callFunc(d.f, [], e);
      case 'builtin':
        return this.builtin(d.name, [], e, want);
      default:
        this.err(e, `a ${d.k} is not a value`);
    }
  }

  // ---------------------------------------------------------------- calls

  private mark(id: number, code: string): string {
    this.curEdges.add(id);
    return `${OPEN}${id};${code}${CLOSE}${id};`;
  }

  private args(params: Param[], args: Arg[], e: { line: number }, name: string): string[] {
    if (args.length !== params.length) this.err(e, `${name}: ${args.length} arguments for ${params.length} parameters`);
    const out: string[] = [];
    params.forEach((p, i) => {
      const a = args[i].e;
      const t = p.ty;
      if (t && t.k === 'openarray') {
        const lv = this.desLV(this.des(a), a);
        out.push(this.addr(lv));
        const at = lv.ty!;
        out.push(at.k === 'array' ? num(at.hi! - at.lo!) : at.k === 'openarray' ? `${(lv as any).base}$high` : '0');
        return;
      }
      if (p.mode === 'var' || !t || t.k === 'file' || t.k === 'text') {
        out.push(this.addr(this.memLV(this.lvOf(a))));
        return;
      }
      if (isStructured(t)) {
        const d = this.des(a, t);
        if (d.k === 'val' && !isStructured(d.v.ty)) out.push(this.coerce(d.v, t, a));
        else out.push(this.addr(this.desLV(d, a)));
        return;
      }
      out.push(this.coerce(this.ex(a, t), t, a));
    });
    return out;
  }

  private resultOwner(f: FuncSym): boolean {
    for (let p: FuncSym | null = this.cur; p; p = p.parent) if (p === f) return !!f.resultSym;
    return false;
  }

  private resultValue(c: string, t: Ty | null): Value {
    if (!t) return { c, ty: T.void, atom: true };
    return { c, ty: t, atom: true };
  }

  private callFunc(f: FuncSym, args: Arg[], e: { line: number }): Value {
    const a = this.args(f.params, args, e, f.name);
    if (f.result && (isStructured(f.result) || f.result.k === 'file')) a.unshift(this.addr(this.allocTemp(f.result.size) as any));
    const callee = f.parent || f.unit === this.unit ? f.jsName : this.unitRef(f.unit) + f.jsName;
    return this.resultValue(this.mark(f.id, `${callee}(${a.join(', ')})`), f.result);
  }

  private callIndirect(pv: Value, t: Ty, args: Arg[], e: { line: number }): Value {
    const a = this.args(t.params!, args, e, 'procedure variable');
    if (t.result && isStructured(t.result)) a.unshift(this.addr(this.allocTemp(t.result.size) as any));
    const key = sigKey(t.params!, t.result ?? null);
    let id = this.sigIds.get(key);
    if (id === undefined) {
      id = -(this.sigIds.size + 1);
      this.sigIds.set(key, id);
    }
    return this.resultValue(this.mark(id, `rt.FT[${pv.c}](${a.join(', ')})`), t.result ?? null);
  }

  private castValue(t: Ty, v: Value, e: { line: number }): Value {
    const from = v.ty;
    switch (t.k) {
      case 'bool':
        return from.k === 'bool' ? v : { c: `(${v.c} !== 0)`, ty: t, atom: true };
      case 'int':
      case 'char':
      case 'enum': {
        let c = v;
        if (from.k === 'bool') c = { c: `(${v.c} ? 1 : 0)`, ty: T.byte, atom: true, rng: [0, 1] };
        else if (from.k === 'string') {
          if (typeof v.cv === 'string' && v.cv.length === 1) c = this.constVal(v.cv.charCodeAt(0), T.byte);
          else this.err(e, 'cannot cast a string to a number');
        } else if (from.k === 'real') c = { c: `Math.trunc(${v.c})`, ty: T.longint, atom: true };
        if (typeof c.cv === 'number') {
          const bits = t.size * 8;
          const n = t.size === 8 ? c.cv : t.k === 'int' && t.signed ? Number(BigInt.asIntN(bits, BigInt(c.cv))) : Number(BigInt.asUintN(bits, BigInt(c.cv)));
          return this.constVal(n, t);
        }
        const w = this.wrap(c, t);
        return { c: w, ty: t, atom: w === c.c ? c.atom : false, rng: c.rng && w === c.c ? c.rng : undefined };
      }
      case 'string':
        return { c: this.str(v, e), ty: T.string, atom: true };
      case 'pointer':
      case 'proc':
      case 'real':
        return { ...v, ty: t };
      default:
        this.err(e, `cannot cast a value to ${t.k}`);
    }
  }

  private callDes(e: Expr & { k: 'call' }, want?: Ty | null): Des {
    const fd = this.des(e.fn);
    switch (fd.k) {
      case 'func':
        return { k: 'val', v: this.callFunc(fd.f, e.args, e) };
      case 'builtin':
        return { k: 'val', v: this.builtin(fd.name, e.args, e, want) };
      case 'type': {
        const t = fd.ty;
        if (e.args.length !== 1) this.err(e, 'a cast takes one value');
        const ad = this.des(e.args[0].e, t.k === 'pointer' || t.k === 'proc' ? t : undefined);
        // a variable seen as another type, where either type is more than a number
        if (ad.k === 'lv' && ad.lv.kind === 'mem' && (!this.isJsKind(t) || !this.isJsKind(ad.lv.ty)) && t.k !== 'string') return { k: 'lv', lv: { ...ad.lv, ty: t } };
        if (ad.k === 'lv' && ad.lv.kind === 'mem' && t.k === 'string' && ad.lv.ty?.k !== 'char' && ad.lv.ty?.k !== 'string' && !(ad.lv.ty?.k === 'array')) return { k: 'lv', lv: { ...ad.lv, ty: t } };
        if (ad.k === 'val' && isStructured(ad.v.ty) && isStructured(t)) return { k: 'val', v: { ...ad.v, ty: t } };
        return { k: 'val', v: this.castValue(t, this.desVal(ad, e, t), e) };
      }
      case 'lv': {
        const t = fd.lv.ty;
        if (t && t.k === 'proc') return { k: 'val', v: this.callIndirect(this.load(fd.lv), t, e.args, e) };
        this.err(e, 'call of something that is not a routine');
        break;
      }
      case 'val':
        if (fd.v.ty.k === 'proc') return { k: 'val', v: this.callIndirect(fd.v, fd.v.ty, e.args, e) };
        this.err(e, 'call of a value');
        break;
      default:
        this.err(e, 'cannot call this');
    }
  }

  /** A cast on the left of an assignment, or wherever a place is wanted: the variable seen as the type. */
  private lvOf(e: Expr): LV {
    // @procVar := ...: the variable itself
    if (e.k === 'addr') return this.lvOf(e.e);
    if (e.k === 'call') {
      const fd = this.des(e.fn);
      if (fd.k === 'type' && e.args.length === 1) {
        const inner = this.lvOf(e.args[0].e);
        return { ...this.memLV(inner), ty: fd.ty };
      }
    }
    if (e.k === 'idx') {
      const bd = this.des(e.e);
      if (bd.k === 'lv' && bd.lv.kind === 'js') this.needMem(bd.lv.sym);
      else if (bd.k === 'func' && this.resultOwner(bd.f)) {
        // the function's own result, indexed: F[0] := ...
        const rl = this.memLV(this.varLV(bd.f.resultSym!, e));
        let b: LV = rl;
        for (const ie of e.idxs) {
          const t = b.ty!;
          const i = this.ex(ie);
          if (t.k === 'string') b = this.indexLV(b as any, i, 0, 1, T.char);
          else if (t.k === 'array') b = this.indexLV(b as any, i, t.lo!, t.elem!.size, t.elem!);
          else this.err(e, 'cannot index the result');
        }
        return b;
      }
    }
    const d = this.des(e);
    if (d.k === 'lv') return d.lv;
    if (d.k === 'func' && this.resultOwner(d.f)) return this.varLV(d.f.resultSym!, e);
    return this.desLV(d, e);
  }

  // ---------------------------------------------------------------- expressions

  ex(e: Expr, want?: Ty | null): Value {
    switch (e.k) {
      case 'num':
        return this.constVal(e.v, T.intLit);
      case 'real':
        return { c: num(e.v), ty: T.real, cv: e.v, atom: e.v >= 0 };
      case 'str':
        if (e.v.length === 1 && !(want && want.k === 'string')) return this.constVal(e.v.charCodeAt(0), T.charLit);
        return { c: jsStr(e.v), ty: T.strLit, cv: e.v, atom: true };
      case 'nil':
        return { c: '0', ty: T.pointer, atom: true, cv: 0 };
      case 'set':
        return this.setLit(e, want);
      case 'addr': {
        const d = this.des(e.e);
        if (d.k === 'func') return { c: num(this.c.procIndex(d.f)), ty: T.pointer, atom: true };
        if (d.k === 'lv' && d.lv.ty?.k === 'proc') return { ...this.load(d.lv), ty: T.pointer };
        const lv = this.desLV(d, e);
        return { c: this.addr(lv), ty: { k: 'pointer', size: 4, target: lv.ty }, atom: lv.base === null || lv.off === 0 };
      }
      case 'un':
        return this.unary(e, want);
      case 'bin':
        return this.binary(e, want);
      default:
        return this.desVal(this.des(e, want), e, want);
    }
  }

  private setLit(e: Expr & { k: 'set' }, want?: Ty | null): Value {
    const parts: string[] = [];
    let allConst = true;
    const bits = new Uint8Array(32);
    for (const it of e.items) {
      const lo = this.ex(it.lo);
      const hi = it.hi ? this.ex(it.hi) : lo;
      const lc = lo.ty.k === 'bool' ? `(${lo.c} ? 1 : 0)` : lo.c;
      const hc = hi.ty.k === 'bool' ? `(${hi.c} ? 1 : 0)` : hi.c;
      parts.push(lc, hc);
      const ln = typeof lo.cv === 'string' ? lo.cv.charCodeAt(0) : lo.cv;
      const hn = typeof hi.cv === 'string' ? hi.cv.charCodeAt(0) : hi.cv;
      if (typeof ln === 'number' && typeof hn === 'number') for (let v = ln; v <= hn; v++) bits[v >> 3] |= 1 << (v & 7);
      else allConst = false;
    }
    const ty = want && want.k === 'set' ? want : setType(T.byte);
    const v: Value = { c: `rt.setR(${parts.join(', ')})`, ty, atom: true };
    if (allConst) v.cv = bits;
    return v;
  }

  private toNum(v: Value): Value {
    if (v.ty.k === 'bool') return { c: `(${v.c} ? 1 : 0)`, ty: T.byte, atom: true, rng: [0, 1] };
    return v;
  }

  private unary(e: Expr & { k: 'un' }, want?: Ty | null): Value {
    const v = this.ex(e.e, want);
    if (e.op === '-') {
      if (typeof v.cv === 'number') return v.ty.k === 'real' ? { c: num(-v.cv), ty: T.real, cv: -v.cv } : this.constVal(-v.cv, T.intLit);
      return { c: `-${this.par(v)}`, ty: v.ty.k === 'real' ? T.real : T.longint, rng: v.rng ? [-v.rng[1], -v.rng[0]] : undefined };
    }
    // not
    if (v.ty.k === 'bool') {
      if (typeof v.cv === 'boolean') return this.constVal(!v.cv, T.bool);
      return { c: `!${this.par(v)}`, ty: T.bool, atom: true };
    }
    const t = v.ty;
    if (typeof v.cv === 'number') {
      const n = ~v.cv;
      return this.constVal(t.signed === false && !t.lit ? n & (t.size === 1 ? 0xff : t.size === 2 ? 0xffff : -1) : n, T.intLit);
    }
    if (t.k === 'int' && !t.signed && t.size < 4) {
      const m = t.size === 1 ? 255 : 65535;
      return { c: `~${this.par(v)} & ${m}`, ty: t, rng: [0, m] };
    }
    return { c: `~${this.par(v)}`, ty: T.longint };
  }

  private isStrish(t: Ty): boolean {
    return t.k === 'string' || t.k === 'char';
  }

  private binary(e: Expr & { k: 'bin' }, want?: Ty | null): Value {
    const op = e.op;
    if (op === 'in') return this.inOp(e);
    let l = this.ex(e.l, op === '+' && want && want.k === 'string' ? want : undefined);
    const rWant = l.ty.k === 'set' || l.ty.k === 'pointer' || l.ty.k === 'proc' || l.ty.k === 'string' ? l.ty : undefined;
    let r = this.ex(e.r, rWant ?? (op === '+' && want && want.k === 'string' ? want : undefined));
    if (r.ty.k === 'set' && l.ty.k === 'set' && e.l.k === 'set') l = this.ex(e.l, r.ty);
    if ((r.ty.k === 'pointer' || r.ty.k === 'proc') && l.ty.k !== 'pointer' && l.ty.k !== 'proc') l = this.ex(e.l, r.ty);
    const rel: Record<string, string> = { '=': '===', '<>': '!==', '<': '<', '>': '>', '<=': '<=', '>=': '>=' };
    // constant folding, so that case labels and array bounds stay numbers
    if (l.cv !== undefined && r.cv !== undefined && !(l.cv instanceof Uint8Array) && !(r.cv instanceof Uint8Array)) {
      try {
        const cv = constEval(
          { k: 'bin', op, l: this.cvExpr(l), r: this.cvExpr(r), line: e.line },
          { lookup: () => undefined, err: (m) => { throw new CompileError(m); } },
        );
        if (typeof cv.v === 'number' && cv.ty.k === 'int' && (cv.v > 2147483647 || cv.v < -2147483648) && (op === '+' || op === '*' || op === '-')) {
          // keep it: wide intermediate values are exact in JavaScript too
        }
        if (cv.ty.k === 'real') return { c: num(cv.v as number), ty: T.real, cv: cv.v, atom: (cv.v as number) >= 0 };
        if (cv.ty.k === 'string' && typeof cv.v === 'string') return { c: jsStr(cv.v), ty: T.strLit, cv: cv.v, atom: true };
        if (cv.ty.k === 'bool' || cv.ty.k === 'int') return this.constVal(cv.v, cv.ty.k === 'bool' ? T.bool : T.intLit);
      } catch {
        // not foldable: fall through
      }
    }
    // sets
    if (l.ty.k === 'set' || r.ty.k === 'set') {
      const f: Record<string, string> = { '+': 'sUnion', '-': 'sDiff', '*': 'sInter', '=': 'sEq', '<>': 'sNe', '<=': 'sLe', '>=': 'sGe' };
      if (!f[op]) this.err(e, `'${op}' on sets`);
      const isRel = op === '=' || op === '<>' || op === '<=' || op === '>=';
      return { c: `rt.${f[op]}(${l.c}, ${r.c})`, ty: isRel ? T.bool : l.ty, atom: true };
    }
    // strings and characters
    if (this.isStrish(l.ty) && this.isStrish(r.ty) && (l.ty.k === 'string' || r.ty.k === 'string' || op === '+')) {
      const a = this.str(l, e);
      const b = this.str(r, e);
      if (op === '+') return { c: `${a} + ${b}`, ty: T.string };
      if (!rel[op]) this.err(e, `'${op}' on strings`);
      return { c: `${a} ${rel[op]} ${b}`, ty: T.bool };
    }
    if ((l.ty.k === 'array' && this.isStrish(r.ty)) || (r.ty.k === 'array' && this.isStrish(l.ty))) {
      const a = this.str(l, e);
      const b = this.str(r, e);
      if (op === '+') return { c: `${a} + ${b}`, ty: T.string };
      return { c: `${a} ${rel[op]} ${b}`, ty: T.bool };
    }
    // Booleans
    if (l.ty.k === 'bool' && r.ty.k === 'bool') {
      switch (op) {
        case 'and':
          return { c: `${this.par(l)} && ${this.par(r)}`, ty: T.bool };
        case 'or':
          return { c: `${this.par(l)} || ${this.par(r)}`, ty: T.bool };
        case 'xor':
        case '<>':
          return { c: `${this.par(l)} !== ${this.par(r)}`, ty: T.bool };
        case '=':
          return { c: `${this.par(l)} === ${this.par(r)}`, ty: T.bool };
        default:
          l = this.toNum(l);
          r = this.toNum(r);
      }
    }
    l = this.toNum(l);
    r = this.toNum(r);
    if (isStructured(l.ty) || isStructured(r.ty)) this.err(e, `'${op}' on ${l.ty.k} and ${r.ty.k}`);
    const a = this.par(l);
    const b = this.par(r);
    if (rel[op]) return { c: `${a} ${rel[op]} ${b}`, ty: T.bool };
    const real = l.ty.k === 'real' || r.ty.k === 'real';
    const rr = (f: (x: number, y: number) => number): [number, number] | undefined => {
      if (!l.rng || !r.rng || real) return undefined;
      const c = [f(l.rng[0], r.rng[0]), f(l.rng[0], r.rng[1]), f(l.rng[1], r.rng[0]), f(l.rng[1], r.rng[1])];
      return [Math.min(...c), Math.max(...c)];
    };
    switch (op) {
      case '+':
        return { c: `${a} + ${b}`, ty: real ? T.real : T.longint, rng: rr((x, y) => x + y) };
      case '-':
        return { c: `${a} - ${b}`, ty: real ? T.real : T.longint, rng: rr((x, y) => x - y) };
      case '*': {
        const rng = rr((x, y) => x * y);
        // a product too wide for a JavaScript number to hold exactly keeps its low 32 bits, as the game's stored
        if (!real && (!rng || rng[0] < -9007199254740991 || rng[1] > 9007199254740991)) return { c: `rt.mul(${l.c}, ${r.c})`, ty: T.longint, atom: true };
        return { c: `${a} * ${b}`, ty: real ? T.real : T.longint, rng };
      }
      case '/':
        return { c: `${a} / ${b}`, ty: T.real };
      case 'div':
        return { c: `Math.trunc(${a} / ${b})`, ty: T.longint, atom: true, rng: l.rng && r.rng && r.rng[0] > 0 ? [Math.min(l.rng[0], 0), Math.max(l.rng[1], 0)] : undefined };
      case 'mod':
        return { c: `${a} % ${b}`, ty: T.longint, rng: r.rng && r.rng[0] > 0 && l.rng && l.rng[0] >= 0 ? [0, r.rng[1] - 1] : undefined };
      case 'and': {
        let rng: [number, number] | undefined;
        if (r.rng && r.rng[0] >= 0) rng = [0, r.rng[1]];
        if (l.rng && l.rng[0] >= 0 && (!rng || l.rng[1] < rng[1])) rng = [0, l.rng[1]];
        return { c: `${a} & ${b}`, ty: T.longint, rng };
      }
      case 'or':
        return { c: `${a} | ${b}`, ty: T.longint, rng: this.bitRng(l, r) };
      case 'xor':
        return { c: `${a} ^ ${b}`, ty: T.longint, rng: this.bitRng(l, r) };
      case 'shl':
        return { c: `${a} << ${b}`, ty: T.longint };
      case 'shr':
        return { c: `${a} >>> ${b}`, ty: T.longint, rng: l.rng && l.rng[0] >= 0 ? [0, l.rng[1]] : undefined };
    }
    this.err(e, `unknown operator '${op}'`);
  }

  private bitRng(l: Value, r: Value): [number, number] | undefined {
    if (!l.rng || !r.rng || l.rng[0] < 0 || r.rng[0] < 0) return undefined;
    const m = Math.max(l.rng[1], r.rng[1]);
    let p = 1;
    while (p <= m) p *= 2;
    return p - 1 <= 2147483647 ? [0, p - 1] : undefined;
  }

  private cvExpr(v: Value): Expr {
    const cv = v.cv!;
    if (typeof cv === 'number') return v.ty.k === 'real' ? { k: 'real', v: cv, line: 0 } : v.ty.k === 'char' ? { k: 'str', v: String.fromCharCode(cv), line: 0 } : { k: 'num', v: cv, line: 0 };
    if (typeof cv === 'string') {
      if (cv.length === 1) throw new CompileError('no fold');
      return { k: 'str', v: cv, line: 0 };
    }
    throw new CompileError('no fold');
  }

  private inOp(e: Expr & { k: 'bin' }): Value {
    const x = this.toNum(this.ex(e.l));
    // x in [a, b..c]: comparisons, with no set made
    if (e.r.k === 'set') {
      if (!e.r.items.length) return this.constVal(false, T.bool);
      let xc = x.c;
      let pre = '';
      if (!x.atom || /[(\[]/.test(x.c)) {
        const t = `$t${++this.tempN}`;
        this.tempDecls.add(t);
        pre = `(${t} = ${x.c}, `;
        xc = t;
      }
      const tests = e.r.items.map((it) => {
        const lo = this.toNum(this.ex(it.lo));
        if (!it.hi) return `${xc} === ${this.par(lo)}`;
        const hi = this.toNum(this.ex(it.hi));
        return `(${xc} >= ${this.par(lo)} && ${xc} <= ${this.par(hi)})`;
      });
      const body = tests.join(' || ');
      return { c: pre ? `${pre}${body})` : body, ty: T.bool, atom: !!pre };
    }
    const d = this.des(e.r);
    if (d.k === 'lv' && d.lv.kind === 'mem' && d.lv.ty?.k === 'set') {
      const t = d.lv.ty;
      return { c: `rt.inM(${this.addr(d.lv)}, ${t.byteLo}, ${t.size}, ${x.c})`, ty: T.bool, atom: true };
    }
    const s = this.desVal(d, e);
    if (s.ty.k !== 'set') this.err(e, "'in' needs a set");
    return { c: `rt.inS(${s.c}, ${x.c})`, ty: T.bool, atom: true };
  }

  private tempDecls = new Set<string>();

  // ---------------------------------------------------------------- built-in routines

  private builtin(name: string, args: Arg[], e: { line: number }, want?: Ty | null): Value {
    const n = args.length;
    const A = (i: number, w?: Ty | null) => this.ex(args[i].e, w);
    const N = (i: number) => this.toNum(A(i));
    const LVm = (i: number) => this.memLV(this.lvOf(args[i].e));
    const AD = (i: number) => this.addr(this.memLV(this.lvOf(args[i].e)));
    const void_ = (c: string): Value => ({ c, ty: T.void, atom: true });
    const int = (c: string, atom = true, rng?: [number, number]): Value => ({ c, ty: T.longint, atom, rng });
    const realV = (c: string): Value => ({ c, ty: T.real, atom: true });
    const fileKind = (lv: LV) => (lv.ty?.k === 'text' ? 'T' : 'F');
    switch (name) {
      case 'move':
        return void_(`mv(${AD(1)}, ${AD(0)}, ${N(2).c})`);
      case 'fillchar':
        return void_(`rt.fill(${AD(0)}, ${N(1).c}, ${N(2).c})`);
      case 'sizeof': {
        const d = this.des(args[0].e);
        if (d.k === 'type') return this.constVal(d.ty.size, T.intLit);
        if (d.k === 'lv' && d.lv.ty) return this.constVal(d.lv.ty.size, T.intLit);
        if (d.k === 'val') return this.constVal(d.v.ty.size, T.intLit);
        this.err(e, 'SizeOf: unknown operand');
        break;
      }
      case 'high':
      case 'low': {
        const d = this.des(args[0].e);
        const t = d.k === 'type' ? d.ty : d.k === 'lv' ? d.lv.ty : d.k === 'val' ? d.v.ty : null;
        if (!t) this.err(e, `${name}: unknown operand`);
        if (t.k === 'openarray') return name === 'low' ? this.constVal(0, T.intLit) : int(`${(d as any).lv.base}$high`);
        if (t.k === 'string') return this.constVal(name === 'high' ? t.max! : 0, T.intLit);
        const o = t.k === 'array' ? t.index! : t;
        return this.constVal(name === 'high' ? o.hi! : o.lo!, o.k === 'int' ? T.intLit : o);
      }
      case 'length': {
        const d = this.des(args[0].e, T.string);
        if (d.k === 'lv' && d.lv.kind === 'mem' && d.lv.ty?.k === 'string') return { c: `U8[${this.addr(d.lv)}]`, ty: T.byte, atom: true, rng: [0, 255] };
        const v = this.desVal(d, e, T.string);
        if (v.ty.k === 'char') return this.constVal(1, T.intLit);
        if (typeof v.cv === 'string') return this.constVal(v.cv.length, T.intLit);
        return { c: `${this.par(v)}.length`, ty: T.byte, atom: true, rng: [0, 255] };
      }
      case 'copy':
        return { c: `rt.Copy(${this.str(A(0, T.string), e)}, ${N(1).c}${n > 2 ? ', ' + N(2).c : ''})`, ty: T.string, atom: true };
      case 'pos':
        return int(`rt.Pos(${this.str(A(0, T.string), e)}, ${this.str(A(1, T.string), e)})`, true, [0, 255]);
      case 'concat':
        return { c: args.map((_, i) => this.str(A(i, T.string), e)).join(' + '), ty: T.string };
      case 'delete': {
        const lv = LVm(0);
        return void_(this.storeCode(lv, `rt.Delete(${this.loadCode(lv)}, ${N(1).c}, ${N(2).c})`));
      }
      case 'insert': {
        const lv = LVm(1);
        return void_(this.storeCode(lv, `rt.Insert(${this.str(A(0, T.string), e)}, ${this.loadCode(lv)}, ${N(2).c})`));
      }
      case 'str': {
        const lv = this.lvOrResult(args[1].e);
        const v = A(0);
        const w = args[0].w ? this.ex(args[0].w).c : '0';
        const code = v.ty.k === 'real' ? `rt.fmtR(${v.c}, ${w}, ${args[0].d ? this.ex(args[0].d).c : '-1'})` : `rt.fmtI(${this.toNum(v).c}, ${w})`;
        return void_(this.store(lv, { c: code, ty: T.string, atom: true }, e));
      }
      case 'val': {
        const lv = this.lvOf(args[1].e);
        const codeLv = this.lvOf(args[2].e);
        const fn = lv.ty!.k === 'real' ? 'valR' : 'valI';
        return void_(`${this.store(lv, { c: `rt.${fn}(${this.str(A(0, T.string), e)})`, ty: lv.ty!, atom: true }, e)}; ${this.store(codeLv, int('rt.valCode.v'), e)}`);
      }
      case 'upcase':
        return { c: `rt.UpCase(${this.coerce(A(0), T.char, e)})`, ty: T.char, atom: true, rng: [0, 255] };
      case 'uppercase':
        return { c: `rt.UpperCase(${this.str(A(0, T.string), e)})`, ty: T.string, atom: true };
      case 'lowercase':
        return { c: `rt.LowerCase(${this.str(A(0, T.string), e)})`, ty: T.string, atom: true };
      case 'inc':
      case 'dec': {
        const lv = this.lvOf(args[0].e);
        const t = lv.ty!;
        const sign = name === 'inc' ? '+' : '-';
        let by = n > 1 ? this.par(N(1)) : '1';
        if (t.k === 'pointer' && ptrTarget(t) && ptrTarget(t)!.size > 1) by = `${by} * ${ptrTarget(t)!.size}`;
        if (lv.kind === 'js') {
          const v: Value = { c: `${lv.name} ${sign} ${by}`, ty: T.longint };
          return void_(`${lv.name} = ${this.wrap(v, t)}`);
        }
        if (lv.base === null || /^[\w$]+$/.test(lv.base)) return void_(this.storeCode(lv, `${this.loadCode(lv)} ${sign} ${by}`));
        const tn = `$t${++this.tempN}`;
        this.tempDecls.add(tn);
        const tl: LV = { kind: 'mem', base: tn, off: 0, ty: t };
        return void_(`${tn} = ${this.addr(lv)}, ${this.storeCode(tl, `${this.loadCode(tl)} ${sign} ${by}`)}`);
      }
      case 'ord': {
        const v = A(0);
        if (v.ty.k === 'string' && typeof v.cv === 'string' && v.cv.length === 1) return this.constVal(v.cv.charCodeAt(0), T.intLit);
        const t = this.toNum(v);
        return { ...t, ty: t.cv !== undefined ? T.intLit : T.longint };
      }
      case 'chr': {
        const v = N(0);
        if (typeof v.cv === 'number') return this.constVal(v.cv & 255, T.charLit);
        const w = this.wrap(v, T.char);
        return { c: w, ty: T.char, atom: w === v.c ? v.atom : false, rng: [0, 255] };
      }
      case 'hi':
        return int(`${this.par(N(0))} >> 8 & 255`, false, [0, 255]);
      case 'lo':
        return int(`${this.par(N(0))} & 255`, false, [0, 255]);
      case 'swap':
        return int(`rt.Swap(${N(0).c})`, true, [0, 65535]);
      case 'odd':
        return { c: `(${this.par(N(0))} & 1) !== 0`, ty: T.bool };
      case 'abs': {
        const v = N(0);
        return { c: `Math.abs(${v.c})`, ty: v.ty.k === 'real' ? T.real : T.longint, atom: true };
      }
      case 'sqr': {
        const v = N(0);
        return { c: `rt.sqr(${v.c})`, ty: v.ty.k === 'real' ? T.real : T.longint, atom: true };
      }
      case 'sqrt':
        return realV(`Math.sqrt(${N(0).c})`);
      case 'sin':
        return realV(`Math.sin(${N(0).c})`);
      case 'cos':
        return realV(`Math.cos(${N(0).c})`);
      case 'arctan':
        return realV(`Math.atan(${N(0).c})`);
      case 'ln':
        return realV(`Math.log(${N(0).c})`);
      case 'exp':
        return realV(`Math.exp(${N(0).c})`);
      case 'int':
        return realV(`Math.trunc(${N(0).c})`);
      case 'frac':
        return realV(`rt.frac(${N(0).c})`);
      case 'round':
        return int(`rt.round(${N(0).c})`);
      case 'trunc':
        return int(`Math.trunc(${N(0).c})`);
      case 'random':
        return n ? int(`rt.RandomN(${N(0).c})`) : realV('rt.Random()');
      case 'randomize':
        return void_('rt.Randomize()');
      case 'succ':
      case 'pred': {
        const v = N(0);
        return { c: `${this.par(v)} ${name === 'succ' ? '+' : '-'} 1`, ty: v.ty.lit ? T.longint : v.ty };
      }
      case 'include':
      case 'exclude': {
        const lv = LVm(0);
        const t = lv.ty!;
        return void_(`rt.${name}(${this.addr(lv)}, ${t.byteLo}, ${t.size}, ${N(1).c})`);
      }
      case 'assigned': {
        const d = this.des(args[0].e);
        const v = d.k === 'lv' ? this.load(d.lv) : this.desVal(d, e, T.pointer);
        return { c: `${this.par(v)} !== 0`, ty: T.bool };
      }
      case 'addr':
        return this.ex({ k: 'addr', e: args[0].e, line: e.line });
      case 'ptr':
        return { c: `rt.Ptr(${N(0).c}, ${N(1).c})`, ty: T.pointer, atom: true };
      case 'seg':
        return int('0');
      case 'ofs':
        return int(AD(0), false);
      case 'new': {
        const lv = this.lvOf(args[0].e);
        const t = ptrTarget(lv.ty!);
        return void_(this.storeCode(lv, `rt.getMem(${t ? t.size : 0})`));
      }
      case 'getmem': {
        const lv = this.lvOf(args[0].e);
        return void_(this.storeCode(lv, `rt.getMem(${N(1).c})`));
      }
      case 'dispose':
      case 'freemem':
        return void_(`rt.freeMem(${A(0).c})`);
      case 'mark': {
        const lv = this.lvOf(args[0].e);
        return void_(this.storeCode(lv, 'rt.mark()'));
      }
      case 'release':
        return void_(`rt.release(${A(0).c})`);
      case 'maxavail':
      case 'memavail':
        return int('16777216');
      case 'halt':
        return void_(`rt.Halt(${n ? N(0).c : '0'})`);
      case 'runerror':
        return void_(`rt.RunError(${n ? N(0).c : '0'})`);
      case 'exit':
        return void_(`\u0006${this.cur.id};`);
      case 'break': {
        const loop = this.loopStack[this.loopStack.length - 1];
        if (!loop) this.err(e, 'Break outside a loop');
        if (this.switchDepth > loop.switchDepth) {
          loop.used = true;
          return void_(`break ${loop.label}`);
        }
        return void_('break');
      }
      case 'continue':
        return void_('continue');
      case 'paramstr':
        return { c: `rt.ParamStr(${N(0).c})`, ty: T.string, atom: true };
      case 'paramcount':
        return int('rt.ParamCount()');
      case 'ioresult':
        return int('rt.IOResult()');
      case 'assign':
        return void_(`rt.Assign(${AD(0)}, ${this.str(A(1, T.string), e)})`);
      case 'reset':
      case 'rewrite': {
        const lv = LVm(0);
        const fn = name === 'reset' ? 'Reset' : 'Rewrite';
        if (lv.ty?.k === 'text') return void_(`rt.${fn}T(${this.addr(lv)})`);
        const rec = n > 1 ? N(1).c : lv.ty?.k === 'file' && lv.ty.of ? num(lv.ty.of.size) : '128';
        return void_(`rt.${fn}F(${this.addr(lv)}, ${rec})`);
      }
      case 'append':
        return void_(`rt.AppendT(${AD(0)})`);
      case 'close':
        return void_(`rt.Close(${AD(0)})`);
      case 'flush':
        return void_(`rt.Flush(${AD(0)})`);
      case 'erase':
        return void_(`rt.Erase(${AD(0)})`);
      case 'rename':
        return void_(`rt.Rename(${AD(0)}, ${this.str(A(1, T.string), e)})`);
      case 'truncate':
        return void_(`rt.Truncate(${AD(0)})`);
      case 'seek':
        return void_(`rt.Seek(${AD(0)}, ${N(1).c})`);
      case 'filepos':
        return int(`rt.FilePos(${AD(0)})`);
      case 'filesize':
        return int(`rt.FileSize(${AD(0)})`);
      case 'eof':
        return { c: n ? `rt.Eof(${AD(0)})` : 'true', ty: T.bool, atom: true };
      case 'eoln':
      case 'seekeof':
        return { c: n ? `rt.${name === 'eoln' ? 'Eoln' : 'Eof'}(${AD(0)})` : 'true', ty: T.bool, atom: true };
      case 'settextbuf':
        return void_('0');
      case 'blockread':
      case 'blockwrite': {
        const fn = name === 'blockread' ? 'BlockRead' : 'BlockWrite';
        const call = `rt.${fn}(${AD(0)}, ${AD(1)}, ${N(2).c}, ${n > 3 ? 'true' : 'false'})`;
        if (n > 3) return void_(this.store(this.lvOf(args[3].e), int(call), e));
        return void_(call);
      }
      case 'mkdir':
        return void_(`rt.MkDir(${this.str(A(0, T.string), e)})`);
      case 'rmdir':
        return void_(`rt.RmDir(${this.str(A(0, T.string), e)})`);
      case 'chdir':
        return void_(`rt.ChDir(${this.str(A(0, T.string), e)})`);
      case 'getdir':
        return void_(this.store(this.lvOf(args[1].e), { c: 'rt.GetDir()', ty: T.string, atom: true }, e));
      case 'write':
      case 'writeln': {
        let first = 0;
        let f = '0';
        let typed: Ty | null = null;
        if (n) {
          const d = this.des(args[0].e);
          if (d.k === 'lv' && (d.lv.ty?.k === 'text' || d.lv.ty?.k === 'file')) {
            f = this.addr(this.memLV(d.lv));
            first = 1;
            if (d.lv.ty.k === 'file') typed = d.lv.ty.of ?? null;
          }
        }
        if (typed) {
          const parts = args.slice(first).map((a) => `rt.WriteRec(${f}, ${this.addr(this.desLV(this.des(a.e), e))}, ${typed!.size})`);
          return void_(parts.join(', '));
        }
        const parts = args.slice(first).map((a) => {
          const v = this.ex(a.e);
          const w = a.w ? this.ex(a.w).c : null;
          if (v.ty.k === 'real') return `rt.fmtR(${v.c}, ${w ?? '0'}, ${a.d ? this.ex(a.d).c : '-1'})`;
          if (v.ty.k === 'bool') return `(${v.c} ? "TRUE" : "FALSE")`;
          if (v.ty.k === 'string' || v.ty.k === 'char' || v.ty.k === 'array') return w ? `rt.padL(${this.str(v, e)}, ${w})` : this.str(v, e);
          return `rt.fmtI(${v.c}, ${w ?? '0'})`;
        });
        if (name === 'writeln') parts.push('"\\n"');
        return void_(`rt.WriteT(${f}, ${parts.length ? parts.join(' + ') : '""'})`);
      }
      case 'read':
      case 'readln': {
        let first = 0;
        let f = '0';
        let typed: Ty | null = null;
        if (n) {
          const d = this.des(args[0].e);
          if (d.k === 'lv' && (d.lv.ty?.k === 'text' || d.lv.ty?.k === 'file')) {
            f = this.addr(this.memLV(d.lv));
            first = 1;
            if (d.lv.ty.k === 'file') typed = d.lv.ty.of ?? null;
          }
        }
        const parts: string[] = [];
        for (const a of args.slice(first)) {
          const lv = this.lvOrResult(a.e);
          if (typed) {
            parts.push(`rt.ReadRec(${f}, ${this.addr(this.memLV(lv))}, ${typed.size})`);
            continue;
          }
          const t = lv.ty!;
          const fn = t.k === 'string' ? 'ReadStrT' : t.k === 'char' ? 'ReadCharT' : t.k === 'real' ? 'ReadRealT' : 'ReadIntT';
          parts.push(this.store(lv, { c: `rt.${fn}(${f})`, ty: t.k === 'string' ? T.string : t, atom: true }, e));
        }
        if (name === 'readln') parts.push(`rt.ReadLnT(${f})`);
        return void_(parts.join(', '));
      }
      case 'string':
        return { c: this.str(A(0, T.string), e), ty: T.string, atom: true };
      case 'sarsmallint':
        return int(`(${this.par(N(0))} << 16 >> 16) >> ${n > 1 ? this.par(N(1)) : '1'}`, false, [-32768, 32767]);
      case 'sarshortint':
        return int(`(${this.par(N(0))} << 24 >> 24) >> ${n > 1 ? this.par(N(1)) : '1'}`, false, [-128, 127]);
      case 'sarlongint':
        return int(`${this.par(N(0))} >> ${n > 1 ? this.par(N(1)) : '1'}`, false);
    }
    this.err(e, `the built-in '${name}' is not supported`);
  }

  private lvOrResult(e: Expr): LV {
    return this.lvOf(e);
  }

  // ---------------------------------------------------------------- statements

  private flushTemps(at: number): void {
    if (this.tempDecls.size) {
      this.lines.splice(at, 0, '  '.repeat(this.ind) + `let ${[...this.tempDecls].join(', ')};`);
      this.tempDecls.clear();
    }
  }

  private block(s: Stmt): void {
    if (s.k === 'block') for (const x of s.ss) this.stmt(x);
    else this.stmt(s);
  }

  private stmt(s: Stmt): void {
    const at = this.lines.length;
    const outer = this.tempDecls;
    this.tempDecls = new Set();
    this.stmt1(s);
    this.flushTemps(at);
    this.tempDecls = outer;
  }

  private cond(e: Expr): string {
    const v = this.ex(e);
    if (v.ty.k !== 'bool') this.err(e, 'a condition must be Boolean');
    return v.c;
  }

  private stmt1(s: Stmt): void {
    switch (s.k) {
      case 'empty':
        return;
      case 'block':
        for (const x of s.ss) this.stmt(x);
        return;
      case 'assign': {
        const lv = this.lvOf(s.l);
        const t = lv.ty;
        if (!t) this.err(s, 'assignment to an untyped place');
        if (isStructured(t)) {
          const d = this.des(s.r, t);
          let src: string;
          if (d.k === 'val') src = isStructured(d.v.ty) ? d.v.c : this.coerce(d.v, t, s);
          else if (d.k === 'lv' && d.lv.ty && !isStructured(d.lv.ty)) src = this.coerce(this.load(d.lv), t, s);
          else src = this.addr(this.desLV(d, s));
          this.emit(`mv(${this.addr(lv as any)}, ${src}, ${t.size});`);
          return;
        }
        const v = this.ex(s.r, t);
        this.emit(this.store(lv, v, s) + ';');
        return;
      }
      case 'callst': {
        const d = this.des(s.e);
        let v: Value;
        if (d.k === 'func') v = this.callFunc(d.f, [], s);
        else if (d.k === 'builtin') v = this.builtin(d.name, [], s);
        else if (d.k === 'lv' && d.lv.ty?.k === 'proc') v = this.callIndirect(this.load(d.lv), d.lv.ty, [], s);
        else if (d.k === 'val') v = d.v;
        else this.err(s, 'this is not a statement');
        if (v.c.startsWith('\u0006')) this.emit(v.c);
        else this.emit(v.c + ';');
        return;
      }
      case 'if': {
        this.emit(`if (${this.cond(s.c)}) {`);
        this.ind++;
        this.block(s.t);
        this.ind--;
        let e = s.e;
        while (e && e.k === 'if') {
          const c = this.cond(e.c);
          this.emit(`} else if (${c}) {`);
          this.ind++;
          this.block(e.t);
          this.ind--;
          e = e.e;
        }
        if (e && e.k !== 'empty') {
          this.emit('} else {');
          this.ind++;
          this.block(e);
          this.ind--;
        }
        this.emit('}');
        return;
      }
      case 'while': {
        const loop = { label: `L${++this.tempN}`, used: false, switchDepth: this.switchDepth };
        this.loopStack.push(loop);
        const at = this.lines.length;
        this.emit(`while (${this.cond(s.c)}) {`);
        this.ind++;
        this.block(s.s);
        this.ind--;
        this.emit('}');
        this.loopStack.pop();
        if (loop.used) this.lines[at] = this.lines[at].replace(/while/, `${loop.label}: while`);
        return;
      }
      case 'repeat': {
        const loop = { label: `L${++this.tempN}`, used: false, switchDepth: this.switchDepth };
        this.loopStack.push(loop);
        const at = this.lines.length;
        this.emit('do {');
        this.ind++;
        for (const x of s.ss) this.stmt(x);
        this.ind--;
        const c = this.cond(s.c);
        this.emit(`} while (!(${c}));`);
        this.loopStack.pop();
        if (loop.used) this.lines[at] = this.lines[at].replace(/do \{/, `${loop.label}: do {`);
        return;
      }
      case 'for': {
        const lv = this.lvOf(s.v);
        const t = lv.ty!;
        const a = this.toNum(this.ex(s.a, t));
        const b = this.toNum(this.ex(s.b, t));
        const k = ++this.tempN;
        const loop = { label: `L${k}`, used: false, switchDepth: this.switchDepth };
        this.loopStack.push(loop);
        const at = this.lines.length;
        const i = `$i${k}`;
        const bound = typeof b.cv === 'number' ? b.c : `$e${k}`;
        const decl = typeof b.cv === 'number' ? `let ${i} = ${a.c}` : `let ${i} = ${a.c}, $e${k} = ${b.c}`;
        this.emit(`for (${decl}; ${i} ${s.down ? '>=' : '<='} ${bound}; ${i}${s.down ? '--' : '++'}) {`);
        this.ind++;
        this.emit(this.storeCode(lv, i) + ';');
        this.block(s.s);
        this.ind--;
        this.emit('}');
        this.loopStack.pop();
        if (loop.used) this.lines[at] = this.lines[at].replace(/for \(/, `${loop.label}: for (`);
        return;
      }
      case 'with': {
        const n0 = this.withStack.length;
        let opened = 0;
        for (const we of s.es) {
          const lv = this.desLV(this.des(we), s);
          if (!lv.ty || lv.ty.k !== 'record') this.err(s, 'with needs a record');
          if (lv.base === null || /^\$[fw]\d+$/.test(lv.base)) {
            // a fixed place, or one in a frame: no temporary needed
            this.withStack.push({ ty: lv.ty, base: lv.base, off: lv.off });
            continue;
          }
          const w = `$w${++this.tempN}`;
          if (!opened) {
            this.emit('{');
            this.ind++;
          }
          opened++;
          this.emit(`const ${w} = ${this.addr(lv)};`);
          this.withStack.push({ ty: lv.ty, base: w, off: 0 });
        }
        this.block(s.s);
        this.withStack.length = n0;
        if (opened) {
          this.ind--;
          this.emit('}');
        }
        return;
      }
      case 'case': {
        const sel = this.toNum(this.ex(s.e));
        // every label as numbers
        const arms = s.arms.map((arm) => ({
          s: arm.s,
          ranges: arm.labels.map((l) => {
            const lo = this.labelNum(l.lo);
            const hi = l.hi ? this.labelNum(l.hi) : lo;
            return [lo, hi] as [number, number];
          }),
        }));
        const big = arms.some((a) => a.ranges.some(([lo, hi]) => hi - lo > 40));
        if (big) {
          const t = `$c${++this.tempN}`;
          this.emit(`const ${t} = ${sel.c};`);
          let first = true;
          for (const arm of arms) {
            const test = arm.ranges.map(([lo, hi]) => (lo === hi ? `${t} === ${lo}` : `(${t} >= ${lo} && ${t} <= ${hi})`)).join(' || ');
            this.emit(`${first ? '' : '} else '}if (${test}) {`);
            first = false;
            this.ind++;
            this.block(arm.s);
            this.ind--;
          }
          if (s.els) {
            this.emit(first ? '{' : '} else {');
            this.ind++;
            for (const x of s.els) this.stmt(x);
            this.ind--;
          }
          if (!first || s.els) this.emit('}');
          return;
        }
        this.emit(`switch (${sel.c}) {`);
        this.switchDepth++;
        this.ind++;
        for (const arm of arms) {
          const labels: string[] = [];
          for (const [lo, hi] of arm.ranges) for (let v = lo; v <= hi; v++) labels.push(`case ${v}:`);
          for (let i = 0; i < labels.length; i += 12) this.emit(labels.slice(i, i + 12).join(' ') + (i + 12 >= labels.length ? ' {' : ''));
          if (!labels.length) continue;
          this.ind++;
          this.block(arm.s);
          this.emit('break;');
          this.ind--;
          this.emit('}');
        }
        if (s.els) {
          this.emit('default: {');
          this.ind++;
          for (const x of s.els) this.stmt(x);
          this.ind--;
          this.emit('}');
        }
        this.ind--;
        this.switchDepth--;
        this.emit('}');
        return;
      }
    }
  }

  private labelNum(e: Expr): number {
    const v = this.ex(e);
    if (typeof v.cv === 'number') return v.cv;
    if (typeof v.cv === 'boolean') return v.cv ? 1 : 0;
    if (typeof v.cv === 'string' && v.cv.length === 1) return v.cv.charCodeAt(0);
    this.err(e, 'a case label must be a constant');
  }

  // ---------------------------------------------------------------- async

  /** Which routines wait: the host's waiting calls, and everything that calls one. */
  solveAsync(): Set<number> {
    const isAsync = new Set<number>(this.asyncRoots);
    const bySig = new Map<number, FuncSym[]>();
    for (const f of this.c.procTable) {
      const id = this.sigIds.get(sigKey(f.params, f.result));
      if (id === undefined) continue;
      if (!bySig.has(id)) bySig.set(id, []);
      bySig.get(id)!.push(f);
    }
    for (let changed = true; changed; ) {
      changed = false;
      for (const [id, fs] of bySig) {
        if (!isAsync.has(id) && fs.some((f) => isAsync.has(f.id))) {
          isAsync.add(id);
          changed = true;
        }
      }
      for (const [caller, callees] of this.edges) {
        if (isAsync.has(caller)) continue;
        for (const k of callees) {
          if (isAsync.has(k)) {
            isAsync.add(caller);
            changed = true;
            break;
          }
        }
      }
    }
    return isAsync;
  }

  static finish(text: string, isAsync: Set<number>): string {
    return text
      .replace(/\u0001(-?\d+);/g, (_, id) => (isAsync.has(Number(id)) ? '(await ' : ''))
      .replace(/\u0002(-?\d+);/g, (_, id) => (isAsync.has(Number(id)) ? ')' : ''))
      .replace(/\u0003(-?\d+);/g, (_, id) => (isAsync.has(Number(id)) ? 'async ' : ''));
  }
}

export type { CV };
