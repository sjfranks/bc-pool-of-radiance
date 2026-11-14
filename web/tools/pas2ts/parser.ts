/**
 * parser.ts
 *
 * Parses units and declares what they hold as it goes, the way a one-pass Pascal compiler does: a type is resolved
 * and laid out where it is declared, a constant is worked out, a variable is given its address, a typed constant's
 * bytes go into the program's data image. Routine bodies are kept as syntax trees for codegen.ts, which runs once
 * every unit is loaded.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { lex } from './lexer.ts';
import type { Tok } from './lexer.ts';
import { intForRange, isOrd, ptrTarget, RESERVED, Scope, setType, T } from './model.ts';
import type { Arg, ConstSym, ConstVal, Expr, Field, FuncSym, Param, Stmt, Sym, Ty, Unit, VarSym } from './model.ts';

/** Where the System unit's variables live; the runtime (rt/mem.ts) knows the same numbers. */
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
  HeapError: 0x10030,
  PrefixSeg: 0x1002c,
};
export const STATIC_BASE = 0x10100;

const JS_RESERVED = new Set(
  (
    'break case catch class const continue debugger default delete do else enum export extends false finally for ' +
    'function if import in instanceof new null return super switch this throw true try typeof var void while with ' +
    'yield let static implements interface package private protected public await arguments eval undefined NaN ' +
    'Infinity Object Array String Number Boolean Math Date Error Symbol Map Set Promise JSON console window ' +
    'document name length status top self parent U8 I8 rt S'
  ).split(' '),
);

export function jsIdent(name: string): string {
  return JS_RESERVED.has(name) || name.startsWith('$') ? name + '_' : name;
}

export class CompileError extends Error {}

export interface CV {
  ty: Ty;
  v: ConstVal;
}

export class Compiler {
  units = new Map<string, Unit>();
  order: Unit[] = [];
  system = new Scope(null);
  staticTop = STATIC_BASE;
  image = new Uint8Array(1 << 20);
  procTable: FuncSym[] = [];
  /** Routines held by typed constants: with the constant's procedural type, or null for a plain pointer. */
  procTyped: [FuncSym, Ty | null][] = [];
  /** Typed constants that hold a routine: the table index is known now, the address to write it at. */
  funcCount = 0;
  allFuncs: FuncSym[] = [];

  searchDirs: string[];
  includeDirs: string[];
  defines: string[];
  constructor(searchDirs: string[], includeDirs: string[], defines: string[]) {
    this.searchDirs = searchDirs;
    this.includeDirs = includeDirs;
    this.defines = defines;
    this.initSystem();
  }

  private initSystem(): void {
    const s = this.system;
    const ty = (name: string, t: Ty) => s.add(name, { k: 'type', name, ty: t });
    ty('Byte', T.byte);
    ty('ShortInt', T.shortint);
    ty('Word', T.word);
    ty('Integer', T.integer);
    ty('SmallInt', T.integer);
    ty('LongInt', T.longint);
    ty('LongWord', T.longword);
    ty('Cardinal', T.longword);
    ty('DWord', T.longword);
    ty('Int64', T.int64);
    ty('QWord', T.int64);
    ty('Boolean', T.bool);
    ty('ByteBool', T.bool);
    ty('Char', T.char);
    ty('Real', T.real);
    ty('Double', T.real);
    ty('Extended', T.real);
    ty('Single', T.single);
    ty('ShortString', T.string);
    ty('Pointer', T.pointer);
    ty('Text', T.text);
    ty('PChar', T.pointer);
    ty('PtrUInt', T.longword);
    ty('PtrInt', T.longint);
    ty('SizeInt', T.longint);
    ty('PByte', { k: 'pointer', size: 4, target: T.byte });
    ty('PWord', { k: 'pointer', size: 4, target: T.word });
    ty('PLongInt', { k: 'pointer', size: 4, target: T.longint });
    ty('PInteger', { k: 'pointer', size: 4, target: T.integer });
    const cn = (name: string, t: Ty, v: ConstVal) => s.add(name, { k: 'const', name, ty: t, v });
    cn('True', T.bool, true);
    cn('False', T.bool, false);
    cn('MaxInt', T.intLit, 32767);
    cn('MaxLongInt', T.intLit, 2147483647);
    cn('Pi', T.real, Math.PI);
    const v = (name: string, t: Ty, addr: number) => s.add(name, { k: 'var', name, ty: t, addr });
    v('RandSeed', T.longint, SYS.RandSeed);
    v('FileMode', T.byte, SYS.FileMode);
    v('ExitProc', T.pointer, SYS.ExitProc);
    v('ExitCode', T.integer, SYS.ExitCode);
    v('InOutRes', T.integer, SYS.InOutRes);
    v('Output', T.text, SYS.Output);
    v('Input', T.text, SYS.Input);
    v('StdErr', T.text, SYS.StdErr);
    v('HeapPtr', T.pointer, SYS.HeapPtr);
    v('PrefixSeg', T.word, SYS.PrefixSeg);
    v('HeapError', T.pointer, SYS.HeapError);
    for (const b of BUILTINS) s.add(b, { k: 'builtin', name: b.toLowerCase() });
  }

  alloc(size: number): number {
    const a = this.staticTop;
    this.staticTop += Math.max(size, 1);
    return a;
  }

  poke(addr: number, bytes: ArrayLike<number>): void {
    const off = addr - STATIC_BASE;
    while (off + bytes.length > this.image.length) {
      const bigger = new Uint8Array(this.image.length * 2);
      bigger.set(this.image);
      this.image = bigger;
    }
    for (let i = 0; i < bytes.length; i++) this.image[off + i] = bytes[i] & 255;
  }

  pokeInt(addr: number, size: number, v: number): void {
    const b: number[] = [];
    let x = v;
    if (size === 8) {
      const dv = new DataView(new ArrayBuffer(8));
      dv.setBigInt64(0, BigInt(Math.trunc(v)), true);
      for (let i = 0; i < 8; i++) b.push(dv.getUint8(i));
    } else {
      if (x < 0) x += 2 ** (8 * size);
      for (let i = 0; i < size; i++) {
        b.push(x % 256);
        x = Math.floor(x / 256);
      }
    }
    this.poke(addr, b);
  }

  procIndex(f: FuncSym): number {
    if (f.tableIndex === undefined) {
      this.procTable.push(f);
      f.tableIndex = this.procTable.length;
    }
    return f.tableIndex;
  }

  findUnitFile(name: string): string | null {
    const want = name.toLowerCase() + '.pas';
    for (const d of this.searchDirs) {
      if (!fs.existsSync(d)) continue;
      for (const f of fs.readdirSync(d)) if (f.toLowerCase() === want) return path.join(d, f);
    }
    return null;
  }

  loadUnit(name: string, from?: string): Unit {
    const key = name.toLowerCase();
    const have = this.units.get(key);
    if (have) {
      if (!have.ifaceDone) throw new CompileError(`circular interface reference to ${name} from ${from}`);
      return have;
    }
    const file = this.findUnitFile(name);
    if (!file) throw new CompileError(`unit ${name} not found (used by ${from})`);
    return this.loadFile(file);
  }

  loadFile(file: string): Unit {
    const toks = lex(file, { defines: new Set(this.defines), includeDirs: this.includeDirs });
    const p = new Parser(this, toks, file);
    return p.parseUnit();
  }
}

const BUILTINS = (
  'Move FillChar Length Copy Pos Delete Insert Concat Str Val UpCase Inc Dec Ord Chr Hi Lo Swap Odd Abs Sqr Sqrt ' +
  'Round Trunc Int Frac Ln Exp Sin Cos ArcTan Random Randomize SizeOf High Low Succ Pred Include Exclude Assigned Addr ' +
  'Ptr Seg Ofs New Dispose GetMem FreeMem Mark Release MaxAvail MemAvail Halt Exit Break Continue ParamStr ' +
  'ParamCount IOResult Assign Reset Rewrite Append Close BlockRead BlockWrite Read Write ReadLn WriteLn Seek FilePos ' +
  'FileSize Eof Eoln SeekEof Erase Rename Truncate Flush MkDir GetDir ChDir RmDir RunError String LowerCase UpperCase ' +
  'SetTextBuf SarSmallint SarLongint SarShortint'
).split(' ');

class Parser {
  i = 0;
  unit!: Unit;
  scope!: Scope;
  fn: FuncSym | null = null;
  inIface = false;

  c: Compiler;
  toks: Tok[];
  file: string;
  constructor(c: Compiler, toks: Tok[], file: string) {
    this.c = c;
    this.toks = toks;
    this.file = file;
  }

  // ---- token helpers
  get t(): Tok {
    return this.toks[this.i];
  }
  err(msg: string, tok: Tok = this.t): never {
    throw new CompileError(`${tok.file || this.file}:${tok.line}: ${msg}`);
  }
  isSym(v: string): boolean {
    return this.t.k === 'sym' && this.t.v === v;
  }
  isKw(v: string): boolean {
    return this.t.k === 'id' && this.t.v === v;
  }
  eatSym(v: string): boolean {
    if (this.isSym(v)) {
      this.i++;
      return true;
    }
    return false;
  }
  eatKw(v: string): boolean {
    if (this.isKw(v)) {
      this.i++;
      return true;
    }
    return false;
  }
  expectSym(v: string): void {
    if (!this.eatSym(v)) this.err(`expected '${v}' but found '${this.t.v || this.t.k}'`);
  }
  expectKw(v: string): void {
    if (!this.eatKw(v)) this.err(`expected '${v}' but found '${this.t.v || this.t.k}'`);
  }
  ident(): Tok {
    if (this.t.k !== 'id') this.err(`expected an identifier but found '${this.t.v || this.t.k}'`);
    return this.toks[this.i++];
  }

  // ---- lookup
  lookup(name: string, scope: Scope = this.scope): Sym | undefined {
    return lookupSym(this.c, this.unit, scope, name);
  }

  // ---- units
  parseUnit(): Unit {
    const isProgram = this.isKw('program');
    if (!isProgram) this.expectKw('unit');
    else this.i++;
    const nameTok = this.ident();
    this.expectSym(';');
    const u: Unit = {
      name: nameTok.raw!,
      file: this.file,
      isProgram,
      iface: new Scope(null),
      impl: new Scope(null),
      usesIface: [],
      usesImpl: [],
      funcs: [],
      init: null,
      consts: [],
      ifaceDone: false,
      done: false,
      globals: [],
    };
    u.impl.parent = u.iface;
    this.unit = u;
    this.c.units.set(nameTok.v, u);
    if (isProgram) {
      u.ifaceDone = true;
      this.scope = u.impl;
      if (this.eatKw('uses')) this.parseUses(u.usesImpl);
      this.parseDecls(true);
      this.parseInit();
    } else {
      this.expectKw('interface');
      this.scope = u.iface;
      this.inIface = true;
      if (this.eatKw('uses')) this.parseUses(u.usesIface);
      this.parseDecls(false);
      this.inIface = false;
      u.ifaceDone = true;
      this.expectKw('implementation');
      this.scope = u.impl;
      if (this.eatKw('uses')) this.parseUses(u.usesImpl);
      this.parseDecls(true);
      this.parseInit();
    }
    u.done = true;
    this.c.order.push(u);
    return u;
  }

  parseUses(into: Unit[]): void {
    for (;;) {
      const n = this.ident();
      const skip = ['overlay', 'cthreads', 'sdlhost', 'tpcompat', 'ownterm'].includes(n.v);
      if (!skip) into.push(this.c.loadUnit(n.raw!, this.unit.name));
      if (!this.eatSym(',')) break;
    }
    this.expectSym(';');
  }

  parseInit(): void {
    const u = this.unit;
    if (this.eatKw('begin') || this.eatKw('initialization')) {
      const f = this.newFunc('$init', this.t.line);
      f.isInit = true;
      f.jsName = '$init';
      const save = this.scope;
      this.scope = f.scope;
      f.body = this.stmtList(['end', 'finalization']);
      this.scope = save;
      u.init = f;
      if (this.eatKw('finalization')) this.stmtList(['end']);
    }
    this.expectKw('end');
    this.expectSym('.');
  }

  newFunc(name: string, line: number): FuncSym {
    const f: FuncSym = {
      k: 'func',
      name,
      unit: this.unit,
      params: [],
      result: null,
      parent: this.fn,
      scope: new Scope(this.scope, null),
      body: null,
      external: null,
      locals: [],
      paramSyms: [],
      nested: [],
      id: ++this.c.funcCount,
      line,
      jsName: jsIdent(name),
    };
    f.scope.fn = f;
    this.c.allFuncs.push(f);
    return f;
  }

  // ---- declarations
  parseDecls(bodies: boolean): void {
    for (;;) {
      if (this.eatKw('const')) this.constSection();
      else if (this.eatKw('type')) this.typeSection();
      else if (this.eatKw('var')) this.varSection();
      else if (this.isKw('procedure') || this.isKw('function')) this.procDecl(bodies);
      else if (this.eatKw('label')) {
        while (!this.eatSym(';')) this.i++;
      } else break;
    }
  }

  declStarts(): boolean {
    const t = this.t;
    return (
      t.k !== 'id' ||
      ['const', 'type', 'var', 'procedure', 'function', 'begin', 'implementation', 'end', 'label', 'initialization'].includes(
        t.v,
      )
    );
  }

  constSection(): void {
    while (!this.declStarts()) {
      const name = this.ident();
      if (this.eatSym(':')) {
        const ty = this.parseType();
        this.expectSym('=');
        const addr = this.c.alloc(ty.size);
        const sym: VarSym = { k: 'var', name: name.raw!, ty, addr, unit: this.unit };
        this.scope.add(name.v, sym);
        if (!this.fn) this.unit.globals.push(sym);
        this.initValue(ty, addr);
      } else {
        this.expectSym('=');
        const e = this.expr();
        const cv = this.constEval(e);
        const sym: ConstSym = { k: 'const', name: name.raw!, ty: cv.ty, v: cv.v, unit: this.unit };
        if (this.fn) sym.fn = this.fn;
        else this.unit.consts.push(sym);
        this.scope.add(name.v, sym);
      }
      this.expectSym(';');
    }
  }

  typeSection(): void {
    while (!this.declStarts()) {
      const name = this.ident();
      this.expectSym('=');
      const ty = this.parseType(name.raw);
      this.scope.add(name.v, { k: 'type', name: name.raw!, ty });
      this.expectSym(';');
    }
  }

  varSection(): void {
    while (!this.declStarts()) {
      const names = [this.ident()];
      while (this.eatSym(',')) names.push(this.ident());
      this.expectSym(':');
      const ty = this.parseType();
      let abs: number | undefined;
      let absSym: VarSym | undefined;
      if (this.eatKw('absolute')) {
        const e = this.expr();
        const s = this.symOfExpr(e);
        if (s && s.k === 'var') {
          if (s.addr !== undefined) abs = s.addr;
          else absSym = s;
        } else this.err('absolute: only a variable is supported');
      }
      if (this.eatSym('=')) {
        // Free Pascal's initialized variable
        const addr = this.c.alloc(ty.size);
        const sym: VarSym = { k: 'var', name: names[0].raw!, ty, addr, unit: this.unit };
        this.scope.add(names[0].v, sym);
        this.unit.globals.push(sym);
        this.initValue(ty, addr);
        this.expectSym(';');
        continue;
      }
      this.expectSym(';');
      for (const n of names) {
        const sym: VarSym = { k: 'var', name: n.raw!, ty, unit: this.unit };
        if (this.fn) {
          sym.fn = this.fn;
          sym.jsName = jsIdent(n.raw!);
          if (absSym) (sym as any).alias = absSym;
          this.fn.locals.push(sym);
        } else {
          sym.addr = abs ?? this.c.alloc(ty.size);
          this.unit.globals.push(sym);
        }
        this.scope.add(n.v, sym);
      }
    }
  }

  symOfExpr(e: Expr): Sym | undefined {
    if (e.k === 'id') return this.lookup(e.name);
    if (e.k === 'fld' && e.e.k === 'id') {
      const u = this.lookup(e.e.name);
      if (u && u.k === 'unit') return u.unit.iface.get(e.name);
    }
    return undefined;
  }

  // ---- types
  parseType(declName?: string): Ty {
    const t = this.t;
    if (this.eatKw('packed')) return this.parseType(declName);
    if (this.eatSym('^')) {
      const n = this.ident();
      let qual: string | null = null;
      let nm = n.v;
      if (this.eatSym('.')) {
        qual = n.v;
        nm = this.ident().v;
      }
      const scope = this.scope;
      const unit = this.unit;
      const c = this.c;
      const ty: Ty = { k: 'pointer', size: 4, targetName: nm, name: declName };
      ty.resolve = () => {
        let s: Sym | undefined;
        if (qual) {
          const u = lookupSym(c, unit, scope, qual);
          s = u && u.k === 'unit' ? u.unit.iface.get(nm) : undefined;
        } else s = lookupSym(c, unit, scope, nm);
        if (!s || s.k !== 'type') throw new CompileError(`${t.file}:${t.line}: pointer target ${nm} is not a type`);
        return s.ty;
      };
      return ty;
    }
    if (this.eatKw('array')) {
      if (!this.eatSym('[')) {
        this.expectKw('of');
        const elem = this.parseType();
        return { k: 'openarray', size: 4, elem };
      }
      const idx: Ty[] = [this.parseType()];
      while (this.eatSym(',')) idx.push(this.parseType());
      this.expectSym(']');
      this.expectKw('of');
      let ty = this.parseType();
      for (let k = idx.length - 1; k >= 0; k--) {
        const ix = idx[k];
        if (!isOrd(ix)) this.err('array index must be an ordinal type');
        const count = ix.hi! - ix.lo! + 1;
        ty = { k: 'array', index: ix, elem: ty, lo: ix.lo, hi: ix.hi, size: count * ty.size };
      }
      ty.name = declName;
      return ty;
    }
    if (this.eatKw('record')) {
      const ty: Ty = { k: 'record', size: 0, fields: new Map(), name: declName };
      ty.size = this.fieldList(ty.fields!, 0, 'end');
      this.expectKw('end');
      return ty;
    }
    if (this.eatKw('set')) {
      this.expectKw('of');
      const base = this.parseType();
      const ty = setType(base);
      ty.name = declName;
      return ty;
    }
    if (this.eatKw('file')) {
      if (this.eatKw('of')) return { k: 'file', size: 8, of: this.parseType(), name: declName };
      return { ...T.file };
    }
    if (this.eatKw('string')) {
      if (this.eatSym('[')) {
        const n = this.constInt(this.expr());
        this.expectSym(']');
        return { k: 'string', max: n, size: n + 1, name: declName };
      }
      return T.string;
    }
    if (this.isKw('procedure') || this.isKw('function')) {
      const isFn = this.t.v === 'function';
      this.i++;
      const params = this.isSym('(') ? this.paramList() : [];
      let result: Ty | null = null;
      if (isFn) {
        this.expectSym(':');
        result = this.parseType();
      }
      // "; far" after a procedural type
      if (this.isSym(';') && this.toks[this.i + 1].k === 'id' && ['far', 'near', 'cdecl'].includes(this.toks[this.i + 1].v))
        this.i += 2;
      return { k: 'proc', size: 4, params, result, name: declName };
    }
    if (this.isSym('(')) {
      this.i++;
      const names: string[] = [];
      const ty: Ty = { k: 'enum', size: 1, lo: 0, hi: 0, names, name: declName };
      for (;;) {
        const n = this.ident();
        const sym: ConstSym = { k: 'const', name: n.raw!, ty, v: names.length, unit: this.unit };
        names.push(n.raw!);
        this.scope.add(n.v, sym);
        if (!this.fn) this.unit.consts.push(sym);
        if (!this.eatSym(',')) break;
      }
      this.expectSym(')');
      ty.hi = names.length - 1;
      return ty;
    }
    // a type's name, or a subrange
    const e = this.simpleExprNoRel();
    if (this.eatSym('..')) {
      const lo = this.constEval(e);
      const hi = this.constEval(this.simpleExprNoRel());
      if (typeof lo.v !== 'number' && typeof lo.v !== 'boolean') this.err('subrange bounds must be ordinal', t);
      const l = Number(lo.v);
      const h = Number(hi.v);
      if (lo.ty.k === 'char') return { k: 'char', size: 1, lo: l, hi: h, name: declName };
      if (lo.ty.k === 'enum') return { ...lo.ty, lo: l, hi: h, name: declName };
      if (lo.ty.k === 'bool') return { ...T.bool, lo: l, hi: h };
      const r = intForRange(l, h);
      r.name = declName;
      return r;
    }
    const s = this.symOfExpr(e);
    if (!s || s.k !== 'type') this.err(`unknown type '${(e as any).raw ?? (e as any).name ?? e.k}'`, t);
    return s.ty;
  }

  fieldList(fields: Map<string, Field>, start: number, endKw: string): number {
    let off = start;
    const atEnd = () => (endKw === ')' ? this.isSym(')') : this.isKw('end'));
    while (!atEnd()) {
      if (this.eatKw('case')) {
        // variant part: every arm starts at the same offset
        let tagTy: Ty;
        if (this.toks[this.i + 1].k === 'sym' && this.toks[this.i + 1].v === ':') {
          const tag = this.ident();
          this.expectSym(':');
          tagTy = this.parseType();
          fields.set(tag.v, { name: tag.raw!, ty: tagTy, off });
          off += tagTy.size;
        } else tagTy = this.parseType();
        this.expectKw('of');
        let max = off;
        while (!atEnd()) {
          // labels
          for (;;) {
            this.expr();
            if (this.eatSym('..')) this.expr();
            if (!this.eatSym(',')) break;
          }
          this.expectSym(':');
          this.expectSym('(');
          const end = this.fieldList(fields, off, ')');
          this.expectSym(')');
          if (end > max) max = end;
          if (!this.eatSym(';')) break;
        }
        return max;
      }
      const names = [this.ident()];
      while (this.eatSym(',')) names.push(this.ident());
      this.expectSym(':');
      const ty = this.parseType();
      for (const n of names) {
        fields.set(n.v, { name: n.raw!, ty, off });
        off += ty.size;
      }
      if (!this.eatSym(';')) break;
    }
    return off;
  }

  paramList(): Param[] {
    const out: Param[] = [];
    this.expectSym('(');
    if (this.eatSym(')')) return out;
    for (;;) {
      let mode: Param['mode'] = 'value';
      if (this.eatKw('var') || this.eatKw('out')) mode = 'var';
      else if (this.eatKw('const')) mode = 'const';
      const names = [this.ident()];
      while (this.eatSym(',')) names.push(this.ident());
      let ty: Ty | null = null;
      if (this.eatSym(':')) ty = this.parseType();
      for (const n of names) out.push({ name: n.raw!, ty, mode });
      if (!this.eatSym(';')) break;
    }
    this.expectSym(')');
    return out;
  }

  procDecl(bodies: boolean): void {
    const isFn = this.t.v === 'function';
    const line = this.t.line;
    this.i++;
    const name = this.ident();
    const hasParams = this.isSym('(');
    const save = this.scope;
    let f: FuncSym;
    const prior = this.scope.get(name.v) ?? (this.scope === this.unit.impl ? this.unit.iface.get(name.v) : undefined);
    const redecl = prior && prior.k === 'func' && prior.body === null && !prior.external && prior.unit === this.unit;
    if (redecl) {
      f = prior as FuncSym;
      const params = hasParams ? this.paramList() : null;
      if (isFn && this.eatSym(':')) this.parseType();
      if (params && params.length === f.params.length) {
        // the names of the implementation's heading are the ones its body uses
        for (let k = 0; k < params.length; k++) f.params[k].name = params[k].name;
      }
      f.scope = new Scope(this.scope, f);
      f.line = line;
    } else {
      f = this.newFunc(name.raw!, line);
      f.scope = new Scope(this.scope, f);
      f.params = hasParams ? this.paramList() : [];
      if (isFn) {
        this.expectSym(':');
        f.result = this.parseType();
      }
      this.scope.add(name.v, f);
      if (this.fn) this.fn.nested.push(f);
      else this.unit.funcs.push(f);
    }
    this.expectSym(';');
    // directives
    let forward = false;
    for (;;) {
      if (this.t.k === 'id' && ['far', 'near', 'assembler', 'interrupt', 'overload', 'cdecl', 'export', 'inline'].includes(this.t.v)) {
        this.i++;
        this.expectSym(';');
      } else if (this.eatKw('forward')) {
        forward = true;
        this.expectSym(';');
      } else if (this.eatKw('external')) {
        f.external = 'sync';
        if (this.t.k === 'str') {
          f.external = this.t.v;
          this.i++;
        }
        this.expectSym(';');
      } else break;
    }
    if (!bodies || forward || f.external) {
      this.scope = save;
      return;
    }
    // the body
    f.paramSyms = f.params.map((p) => {
      const s: VarSym = { k: 'var', name: p.name, ty: p.ty, fn: f, mode: p.mode, isParam: true, jsName: jsIdent(p.name) };
      f.scope.add(p.name, s);
      return s;
    });
    if (f.result) {
      f.resultSym = { k: 'var', name: f.name, ty: f.result, fn: f, isResult: true, jsName: '$r' };
    }
    const saveFn = this.fn;
    this.fn = f;
    this.scope = f.scope;
    this.parseDecls(true);
    this.expectKw('begin');
    f.body = this.stmtList(['end']);
    this.expectKw('end');
    this.expectSym(';');
    this.fn = saveFn;
    this.scope = save;
  }

  // ---- typed constants
  initValue(ty: Ty, addr: number): void {
    const c = this.c;
    switch (ty.k) {
      case 'array': {
        const elem = ty.elem!;
        const count = ty.hi! - ty.lo! + 1;
        if (elem.k === 'char' && this.t.k === 'str') {
          const cv = this.constEval(this.expr());
          const s = typeof cv.v === 'number' ? String.fromCharCode(cv.v) : String(cv.v);
          c.poke(addr, Array.from(s.slice(0, count), (ch) => ch.charCodeAt(0)));
          return;
        }
        this.expectSym('(');
        for (let k = 0; k < count; k++) {
          if (k) this.expectSym(',');
          this.initValue(elem, addr + k * elem.size);
        }
        this.expectSym(')');
        return;
      }
      case 'record': {
        this.expectSym('(');
        while (!this.isSym(')')) {
          const n = this.ident();
          const f = ty.fields!.get(n.v);
          if (!f) this.err(`no field ${n.raw} in the record`, n);
          this.expectSym(':');
          this.initValue(f.ty, addr + f.off);
          if (!this.eatSym(';')) break;
        }
        this.expectSym(')');
        return;
      }
      case 'string': {
        const cv = this.constEval(this.expr());
        const s = (typeof cv.v === 'number' ? String.fromCharCode(cv.v) : String(cv.v)).slice(0, ty.max);
        c.poke(addr, [s.length, ...Array.from(s, (ch) => ch.charCodeAt(0))]);
        return;
      }
      case 'set': {
        const cv = this.constEval(this.expr());
        if (!(cv.v instanceof Uint8Array)) this.err('expected a set constant');
        c.poke(addr, cv.v.subarray(ty.byteLo!, ty.byteLo! + ty.size));
        return;
      }
      case 'proc':
      case 'pointer': {
        if (this.eatKw('nil')) return;
        const hadAt = this.eatSym('@');
        const e = this.expr();
        const s = this.symOfExpr(e);
        if (s && s.k === 'func') {
          c.procTyped.push([s, ty.k === 'proc' ? ty : null]);
          c.pokeInt(addr, 4, c.procIndex(s));
        }
        else if (s && s.k === 'var' && s.addr !== undefined && hadAt) c.pokeInt(addr, 4, s.addr);
        else c.pokeInt(addr, 4, Number(this.constEval(e).v));
        return;
      }
      case 'real': {
        const cv = this.constEval(this.expr());
        const dv = new DataView(new ArrayBuffer(8));
        if (ty.size === 4) dv.setFloat32(0, Number(cv.v), true);
        else dv.setFloat64(0, Number(cv.v), true);
        c.poke(addr, new Uint8Array(dv.buffer, 0, ty.size));
        return;
      }
      default: {
        const cv = this.constEval(this.expr());
        let v = cv.v;
        if (typeof v === 'string') v = v.length ? v.charCodeAt(0) : 0;
        c.pokeInt(addr, ty.size, Number(v));
      }
    }
  }

  // ---- constant expressions
  constInt(e: Expr): number {
    const cv = this.constEval(e);
    if (typeof cv.v === 'boolean') return cv.v ? 1 : 0;
    if (typeof cv.v !== 'number') this.err('expected an ordinal constant');
    return cv.v;
  }

  constEval(e: Expr): CV {
    return constEval(e, {
      lookup: (n) => this.lookup(n),
      err: (m) => this.err(m, { ...this.t, line: e.line }),
    });
  }

  // ---- statements
  stmtList(ends: string[]): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      if (this.t.k === 'id' && ends.includes(this.t.v)) break;
      out.push(this.stmt());
      if (!this.eatSym(';')) break;
    }
    return out;
  }

  stmt(): Stmt {
    const t = this.t;
    const line = t.line;
    if (t.k === 'id') {
      switch (t.v) {
        case 'begin': {
          this.i++;
          const ss = this.stmtList(['end']);
          this.expectKw('end');
          return { k: 'block', ss, line };
        }
        case 'if': {
          this.i++;
          const c = this.expr();
          this.expectKw('then');
          const th = this.stmt();
          const el = this.eatKw('else') ? this.stmt() : null;
          return { k: 'if', c, t: th, e: el, line };
        }
        case 'case': {
          this.i++;
          const e = this.expr();
          this.expectKw('of');
          const arms: { labels: { lo: Expr; hi?: Expr }[]; s: Stmt }[] = [];
          let els: Stmt[] | null = null;
          while (!this.isKw('end')) {
            if (this.eatKw('else') || this.eatKw('otherwise')) {
              els = this.stmtList(['end']);
              break;
            }
            const labels: { lo: Expr; hi?: Expr }[] = [];
            for (;;) {
              const lo = this.expr();
              const hi = this.eatSym('..') ? this.expr() : undefined;
              labels.push({ lo, hi });
              if (!this.eatSym(',')) break;
            }
            this.expectSym(':');
            const s = this.stmt();
            arms.push({ labels, s });
            if (!this.eatSym(';')) {
              if (this.eatKw('else') || this.eatKw('otherwise')) els = this.stmtList(['end']);
              break;
            }
          }
          this.expectKw('end');
          return { k: 'case', e, arms, els, line };
        }
        case 'while': {
          this.i++;
          const c = this.expr();
          this.expectKw('do');
          return { k: 'while', c, s: this.stmt(), line };
        }
        case 'repeat': {
          this.i++;
          const ss = this.stmtList(['until']);
          this.expectKw('until');
          return { k: 'repeat', ss, c: this.expr(), line };
        }
        case 'for': {
          this.i++;
          const v = this.designator();
          this.expectSym(':=');
          const a = this.expr();
          let down = false;
          if (this.eatKw('downto')) down = true;
          else this.expectKw('to');
          const b = this.expr();
          this.expectKw('do');
          return { k: 'for', v, a, b, down, s: this.stmt(), line };
        }
        case 'with': {
          this.i++;
          const es = [this.designator()];
          while (this.eatSym(',')) es.push(this.designator());
          this.expectKw('do');
          return { k: 'with', es, s: this.stmt(), line };
        }
        case 'inline': {
          this.i++;
          this.expectSym('(');
          while (!this.eatSym(')')) this.i++;
          return { k: 'empty', line };
        }
        case 'end':
        case 'until':
        case 'else':
          return { k: 'empty', line };
        default:
          break;
      }
    }
    if (this.isSym(';')) return { k: 'empty', line };
    const d = this.isSym('@') ? this.factor() : this.designator();
    if (this.eatSym(':=')) return { k: 'assign', l: d, r: this.expr(), line };
    return { k: 'callst', e: d, line };
  }

  // ---- expressions
  expr(): Expr {
    let l = this.simpleExprNoRel();
    for (;;) {
      const t = this.t;
      let op = '';
      if (t.k === 'sym' && ['=', '<>', '<', '>', '<=', '>='].includes(t.v)) op = t.v;
      else if (t.k === 'id' && t.v === 'in') op = 'in';
      if (!op) return l;
      this.i++;
      l = { k: 'bin', op, l, r: this.simpleExprNoRel(), line: t.line };
    }
  }

  simpleExprNoRel(): Expr {
    const t0 = this.t;
    let neg = false;
    if (this.eatSym('-')) neg = true;
    else this.eatSym('+');
    let l = this.term();
    if (neg) l = { k: 'un', op: '-', e: l, line: t0.line };
    for (;;) {
      const t = this.t;
      let op = '';
      if (t.k === 'sym' && (t.v === '+' || t.v === '-')) op = t.v;
      else if (t.k === 'id' && (t.v === 'or' || t.v === 'xor')) op = t.v;
      if (!op) return l;
      this.i++;
      l = { k: 'bin', op, l, r: this.term(), line: t.line };
    }
  }

  term(): Expr {
    let l = this.factor();
    for (;;) {
      const t = this.t;
      let op = '';
      if (t.k === 'sym' && (t.v === '*' || t.v === '/')) op = t.v;
      else if (t.k === 'id' && ['div', 'mod', 'and', 'shl', 'shr'].includes(t.v)) op = t.v;
      if (!op) return l;
      this.i++;
      l = { k: 'bin', op, l, r: this.factor(), line: t.line };
    }
  }

  factor(): Expr {
    const t = this.t;
    const line = t.line;
    if (t.k === 'num') {
      this.i++;
      return { k: 'num', v: t.n!, line };
    }
    if (t.k === 'real') {
      this.i++;
      return { k: 'real', v: t.n!, line };
    }
    if (t.k === 'str') {
      this.i++;
      return { k: 'str', v: t.v, line };
    }
    if (t.k === 'sym') {
      if (t.v === '(') {
        this.i++;
        const e = this.expr();
        this.expectSym(')');
        return this.postfix(e);
      }
      if (t.v === '[') {
        this.i++;
        const items: { lo: Expr; hi?: Expr }[] = [];
        while (!this.isSym(']')) {
          const lo = this.expr();
          const hi = this.eatSym('..') ? this.expr() : undefined;
          items.push({ lo, hi });
          if (!this.eatSym(',')) break;
        }
        this.expectSym(']');
        return { k: 'set', items, line };
      }
      if (t.v === '@') {
        this.i++;
        return { k: 'addr', e: this.factor(), line };
      }
      if (t.v === '-') {
        this.i++;
        return { k: 'un', op: '-', e: this.factor(), line };
      }
      if (t.v === '+') {
        this.i++;
        return this.factor();
      }
    }
    if (t.k === 'id') {
      if (t.v === 'not') {
        this.i++;
        return { k: 'un', op: 'not', e: this.factor(), line };
      }
      if (t.v === 'nil') {
        this.i++;
        return { k: 'nil', line };
      }
      if (t.v === 'string') {
        // String(x): the cast
        this.i++;
        return this.postfix({ k: 'id', name: 'string', raw: 'String', line });
      }
      if (RESERVED.has(t.v)) this.err(`unexpected '${t.v}'`);
      return this.designator();
    }
    this.err(`unexpected '${t.v || t.k}' in an expression`);
  }

  designator(): Expr {
    const t = this.ident();
    if (RESERVED.has(t.v)) this.err(`unexpected '${t.v}'`, t);
    return this.postfix({ k: 'id', name: t.v, raw: t.raw!, line: t.line });
  }

  postfix(e0: Expr): Expr {
    let e = e0;
    for (;;) {
      const t = this.t;
      if (t.k !== 'sym') return e;
      if (t.v === '.') {
        this.i++;
        const n = this.ident();
        e = { k: 'fld', e, name: n.v, raw: n.raw!, line: t.line };
      } else if (t.v === '[') {
        this.i++;
        const idxs = [this.expr()];
        while (this.eatSym(',')) idxs.push(this.expr());
        this.expectSym(']');
        e = { k: 'idx', e, idxs, line: t.line };
      } else if (t.v === '^') {
        this.i++;
        e = { k: 'deref', e, line: t.line };
      } else if (t.v === '(') {
        this.i++;
        const args: Arg[] = [];
        while (!this.isSym(')')) {
          const a: Arg = { e: this.expr() };
          if (this.eatSym(':')) {
            a.w = this.expr();
            if (this.eatSym(':')) a.d = this.expr();
          }
          args.push(a);
          if (!this.eatSym(',')) break;
        }
        this.expectSym(')');
        e = { k: 'call', fn: e, args, line: t.line };
      } else return e;
    }
  }
}

/** Find a name: the scope chain (routine, then unit), the units used (the last named first), then System. */
export function lookupSym(c: Compiler, unit: Unit, scope: Scope, name: string): Sym | undefined {
  const key = name.toLowerCase();
  for (let s: Scope | null = scope; s; s = s.parent) {
    const hit = s.map.get(key);
    if (hit) return hit;
  }
  if (key === unit.name.toLowerCase()) return { k: 'unit', name: unit.name, unit };
  const used = [...unit.usesIface, ...unit.usesImpl];
  // a unit named in the uses clause comes before what the units hold
  for (let k = used.length - 1; k >= 0; k--) if (used[k].name.toLowerCase() === key) return { k: 'unit', name: used[k].name, unit: used[k] };
  for (let k = used.length - 1; k >= 0; k--) {
    const hit = used[k].iface.map.get(key);
    if (hit) return hit;
  }
  if (key === 'system') return { k: 'unit', name: 'System', unit: { iface: c.system, name: 'System' } as Unit };
  return c.system.map.get(key);
}

export interface EvalCtx {
  lookup(name: string): Sym | undefined;
  err(msg: string): never;
  /** The size of a variable named in SizeOf, when it is not a constant's or a type's. */
  sizeOfExpr?(e: Expr): number | undefined;
}

export function sizeOfTy(t: Ty): number {
  return t.size;
}

/** Work out a constant expression. Throws (through ctx.err) when it is not one. */
export function constEval(e: Expr, ctx: EvalCtx): CV {
  const num = (v: number): CV => ({ ty: T.intLit, v });
  const symOf = (x: Expr): Sym | undefined => {
    if (x.k === 'id') return ctx.lookup(x.name);
    if (x.k === 'fld' && x.e.k === 'id') {
      const u = ctx.lookup(x.e.name);
      if (u && u.k === 'unit') return u.unit.iface.get(x.name);
    }
    return undefined;
  };
  const tyOfDesignator = (x: Expr): Ty | null => {
    const s = symOf(x);
    if (s) {
      if (s.k === 'type') return s.ty;
      if (s.k === 'var') return s.ty;
      if (s.k === 'const') return s.ty;
      return null;
    }
    if (x.k === 'fld') {
      const base = tyOfDesignator(x.e);
      if (base && base.k === 'record') return base.fields!.get(x.name)?.ty ?? null;
    }
    if (x.k === 'idx') {
      let base = tyOfDesignator(x.e);
      for (let k = 0; k < x.idxs.length && base; k++) base = base.k === 'array' ? base.elem! : base.k === 'string' ? T.char : null;
      return base;
    }
    if (x.k === 'deref') {
      const base = tyOfDesignator(x.e);
      if (base && base.k === 'pointer') return ptrTarget(base);
    }
    return null;
  };
  switch (e.k) {
    case 'num':
      return num(e.v);
    case 'real':
      return { ty: T.real, v: e.v };
    case 'str':
      return e.v.length === 1 ? { ty: T.charLit, v: e.v.charCodeAt(0) } : { ty: T.strLit, v: e.v };
    case 'nil':
      return { ty: T.pointer, v: 0 };
    case 'id':
    case 'fld': {
      const s = symOf(e);
      if (s && s.k === 'const') return { ty: s.ty, v: s.v };
      return ctx.err(`'${(e as any).raw}' is not a constant`);
    }
    case 'set': {
      const bits = new Uint8Array(32);
      let base: Ty = T.byte;
      for (const it of e.items) {
        const lo = constEval(it.lo, ctx);
        const hi = it.hi ? constEval(it.hi, ctx) : lo;
        base = lo.ty.k === 'int' ? T.byte : { ...lo.ty, lo: lo.ty.k === 'enum' ? 0 : 0, hi: lo.ty.k === 'enum' ? lo.ty.names!.length - 1 : 255 };
        for (let v = Number(lo.v); v <= Number(hi.v); v++) bits[v >> 3] |= 1 << (v & 7);
      }
      const ty = setType(base);
      ty.lit = true;
      return { ty, v: bits };
    }
    case 'un': {
      const a = constEval(e.e, ctx);
      if (e.op === '-') return { ty: a.ty, v: -Number(a.v) };
      if (e.op === 'not') {
        if (typeof a.v === 'boolean') return { ty: T.bool, v: !a.v };
        const v = ~Number(a.v);
        return { ty: a.ty, v: a.ty.signed === false && !a.ty.lit ? v & (a.ty.size === 1 ? 0xff : 0xffff) : v };
      }
      return ctx.err('bad unary operator in a constant');
    }
    case 'bin': {
      const a = constEval(e.l, ctx);
      const b = constEval(e.r, ctx);
      const av = a.v;
      const bv = b.v;
      if (av instanceof Uint8Array || bv instanceof Uint8Array) {
        if (e.op === 'in') return { ty: T.bool, v: ((bv as Uint8Array)[Number(av) >> 3] & (1 << (Number(av) & 7))) !== 0 };
        const x = av as Uint8Array;
        const y = bv as Uint8Array;
        const r = new Uint8Array(32);
        for (let k = 0; k < 32; k++) r[k] = e.op === '+' ? x[k] | y[k] : e.op === '-' ? x[k] & ~y[k] : x[k] & y[k];
        return { ty: a.ty, v: r };
      }
      const isStr = (cv: CV) => cv.ty.k === 'string' || cv.ty.k === 'char';
      const str = (cv: CV) => (typeof cv.v === 'number' ? String.fromCharCode(cv.v) : String(cv.v));
      if (isStr(a) && isStr(b)) {
        const x = str(a);
        const y = str(b);
        switch (e.op) {
          case '+': {
            const s = x + y;
            return { ty: T.strLit, v: s };
          }
          case '=':
            return { ty: T.bool, v: x === y };
          case '<>':
            return { ty: T.bool, v: x !== y };
          case '<':
            return { ty: T.bool, v: x < y };
          case '>':
            return { ty: T.bool, v: x > y };
          case '<=':
            return { ty: T.bool, v: x <= y };
          case '>=':
            return { ty: T.bool, v: x >= y };
        }
      }
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        switch (e.op) {
          case 'and':
            return { ty: T.bool, v: av && bv };
          case 'or':
            return { ty: T.bool, v: av || bv };
          case 'xor':
            return { ty: T.bool, v: av !== bv };
          case '=':
            return { ty: T.bool, v: av === bv };
          case '<>':
            return { ty: T.bool, v: av !== bv };
        }
      }
      const x = Number(av);
      const y = Number(bv);
      const real = a.ty.k === 'real' || b.ty.k === 'real';
      const rty = real ? T.real : a.ty.k === 'int' ? T.intLit : a.ty;
      switch (e.op) {
        case '+':
          return { ty: rty, v: x + y };
        case '-':
          return { ty: rty, v: x - y };
        case '*':
          return { ty: rty, v: x * y };
        case '/':
          return { ty: T.real, v: x / y };
        case 'div':
          return num(Math.trunc(x / y));
        case 'mod':
          return num(x % y);
        case 'and':
          return num(x & y);
        case 'or':
          return num(x | y);
        case 'xor':
          return num(x ^ y);
        case 'shl':
          return num(x * 2 ** y > 0xffffffff ? (x << y) | 0 : x * 2 ** y);
        case 'shr':
          return num(x >>> y);
        case '=':
          return { ty: T.bool, v: x === y };
        case '<>':
          return { ty: T.bool, v: x !== y };
        case '<':
          return { ty: T.bool, v: x < y };
        case '>':
          return { ty: T.bool, v: x > y };
        case '<=':
          return { ty: T.bool, v: x <= y };
        case '>=':
          return { ty: T.bool, v: x >= y };
      }
      return ctx.err(`bad operator '${e.op}' in a constant`);
    }
    case 'call': {
      const fnSym = symOf(e.fn);
      const name = e.fn.k === 'id' ? e.fn.name : '';
      if (fnSym && fnSym.k === 'type') {
        const a = constEval(e.args[0].e, ctx);
        const t = fnSym.ty;
        let v: ConstVal = a.v;
        if (t.k === 'bool') v = Number(a.v) !== 0;
        else if (isOrd(t)) {
          v = Number(a.v);
          if (t.k === 'int' && t.size < 8) {
            const bits = t.size * 8;
            v = t.signed ? Number(BigInt.asIntN(bits, BigInt(Math.trunc(v)))) : Number(BigInt.asUintN(bits, BigInt(Math.trunc(v))));
          }
        }
        return { ty: t, v };
      }
      if (fnSym && fnSym.k === 'builtin') {
        const arg0 = e.args[0]?.e;
        switch (fnSym.name) {
          case 'sizeof': {
            const t = tyOfDesignator(arg0);
            if (t) return num(t.size);
            const n = ctx.sizeOfExpr?.(arg0);
            if (n !== undefined) return num(n);
            return ctx.err('SizeOf: unknown operand');
          }
          case 'high':
          case 'low': {
            const t = tyOfDesignator(arg0);
            if (!t) return ctx.err('High/Low: unknown operand');
            const o = t.k === 'array' ? t.index! : t;
            if (t.k === 'string') return num(fnSym.name === 'high' ? t.max! : 0);
            return { ty: o.k === 'int' ? T.intLit : o, v: fnSym.name === 'high' ? o.hi! : o.lo! };
          }
          case 'ord': {
            const a = constEval(arg0, ctx);
            return num(typeof a.v === 'string' ? a.v.charCodeAt(0) : Number(a.v));
          }
          case 'chr':
            return { ty: T.charLit, v: Number(constEval(arg0, ctx).v) & 255 };
          case 'length': {
            const a = constEval(arg0, ctx);
            return num(typeof a.v === 'number' ? 1 : String(a.v).length);
          }
          case 'hi':
            return num((Number(constEval(arg0, ctx).v) >> 8) & 255);
          case 'lo':
            return num(Number(constEval(arg0, ctx).v) & 255);
          case 'abs':
            return { ...constEval(arg0, ctx), v: Math.abs(Number(constEval(arg0, ctx).v)) };
          case 'odd':
            return { ty: T.bool, v: (Number(constEval(arg0, ctx).v) & 1) === 1 };
          case 'succ': {
            const a = constEval(arg0, ctx);
            return { ty: a.ty, v: Number(a.v) + 1 };
          }
          case 'pred': {
            const a = constEval(arg0, ctx);
            return { ty: a.ty, v: Number(a.v) - 1 };
          }
          case 'trunc':
            return num(Math.trunc(Number(constEval(arg0, ctx).v)));
          case 'round':
            return num(Math.round(Number(constEval(arg0, ctx).v)));
          case 'swap': {
            const v = Number(constEval(arg0, ctx).v);
            return num(((v & 255) << 8) | ((v >> 8) & 255));
          }
          case 'ptr':
            return { ty: T.pointer, v: 0 };
        }
      }
      return ctx.err(`'${name}' cannot be called in a constant`);
    }
    default:
      return ctx.err('not a constant expression');
  }
}
