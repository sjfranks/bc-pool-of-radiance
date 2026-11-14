/**
 * model.ts
 *
 * The translator's picture of a Pascal program: types with Turbo Pascal's sizes and packed layout (the game's files
 * are read straight into its records, so the layout is the file format), symbols, and the syntax trees of routine
 * bodies.
 */

export interface Ty {
  k:
    | 'int'
    | 'bool'
    | 'char'
    | 'enum'
    | 'real'
    | 'string'
    | 'array'
    | 'record'
    | 'set'
    | 'pointer'
    | 'proc'
    | 'file'
    | 'text'
    | 'void'
    | 'openarray';
  size: number;
  name?: string;
  // ordinals
  lo?: number;
  hi?: number;
  signed?: boolean;
  names?: string[];
  // string
  max?: number;
  // array
  index?: Ty;
  elem?: Ty;
  // record
  fields?: Map<string, Field>;
  // set
  base?: Ty;
  byteLo?: number;
  // pointer
  target?: Ty | null;
  targetName?: string;
  resolve?: () => Ty;
  // proc
  params?: Param[];
  result?: Ty | null;
  // file
  of?: Ty | null;
  /** A literal's type, which takes the size of what it is assigned to. */
  lit?: boolean;
}

export interface Field {
  name: string;
  ty: Ty;
  off: number;
}

export interface Param {
  name: string;
  ty: Ty | null; // null: untyped var/const
  mode: 'value' | 'var' | 'const';
}

export type ConstVal = number | string | boolean | Uint8Array;

export interface FuncSym {
  k: 'func';
  name: string;
  unit: Unit;
  params: Param[];
  result: Ty | null;
  parent: FuncSym | null;
  scope: Scope;
  body: Stmt[] | null;
  external: string | null;
  /** Local variables in declaration order (parameters are not among them). */
  locals: VarSym[];
  paramSyms: VarSym[];
  nested: FuncSym[];
  id: number;
  line: number;
  jsName: string;
  /** Set when the routine's address is taken: its place in the procedure table. */
  tableIndex?: number;
  isInit?: boolean;
  resultSym?: VarSym;
}

export interface VarSym {
  k: 'var';
  name: string;
  ty: Ty | null;
  /** A unit's variable or a typed constant: its fixed address. */
  addr?: number;
  fn?: FuncSym;
  mode?: 'value' | 'var' | 'const';
  isParam?: boolean;
  isResult?: boolean;
  jsName?: string;
  unit?: Unit;
}

export interface ConstSym {
  k: 'const';
  name: string;
  ty: Ty;
  v: ConstVal;
  unit?: Unit;
  fn?: FuncSym;
}

export interface TypeSym {
  k: 'type';
  name: string;
  ty: Ty;
}

export interface UnitSym {
  k: 'unit';
  name: string;
  unit: Unit;
}

export interface BuiltinSym {
  k: 'builtin';
  name: string;
}

export type Sym = FuncSym | VarSym | ConstSym | TypeSym | UnitSym | BuiltinSym;

export class Scope {
  map = new Map<string, Sym>();
  parent: Scope | null;
  fn: FuncSym | null;
  constructor(parent: Scope | null, fn: FuncSym | null = null) {
    this.parent = parent;
    this.fn = fn;
  }
  add(name: string, s: Sym): void {
    this.map.set(name.toLowerCase(), s);
  }
  get(name: string): Sym | undefined {
    return this.map.get(name.toLowerCase());
  }
}

export interface Unit {
  name: string;
  file: string;
  isProgram: boolean;
  iface: Scope;
  impl: Scope;
  usesIface: Unit[];
  usesImpl: Unit[];
  funcs: FuncSym[];
  init: FuncSym | null;
  /** Constants to export, in order. */
  consts: ConstSym[];
  ifaceDone: boolean;
  done: boolean;
  globals: VarSym[];
}

// ---- syntax trees of routine bodies

export type Expr =
  | { k: 'num'; v: number; line: number }
  | { k: 'real'; v: number; line: number }
  | { k: 'str'; v: string; line: number }
  | { k: 'nil'; line: number }
  | { k: 'id'; name: string; raw: string; line: number }
  | { k: 'bin'; op: string; l: Expr; r: Expr; line: number }
  | { k: 'un'; op: string; e: Expr; line: number }
  | { k: 'call'; fn: Expr; args: Arg[]; line: number }
  | { k: 'idx'; e: Expr; idxs: Expr[]; line: number }
  | { k: 'fld'; e: Expr; name: string; raw: string; line: number }
  | { k: 'deref'; e: Expr; line: number }
  | { k: 'addr'; e: Expr; line: number }
  | { k: 'set'; items: { lo: Expr; hi?: Expr }[]; line: number };

export interface Arg {
  e: Expr;
  w?: Expr;
  d?: Expr;
}

export type Stmt =
  | { k: 'assign'; l: Expr; r: Expr; line: number }
  | { k: 'callst'; e: Expr; line: number }
  | { k: 'if'; c: Expr; t: Stmt; e: Stmt | null; line: number }
  | { k: 'case'; e: Expr; arms: { labels: { lo: Expr; hi?: Expr }[]; s: Stmt }[]; els: Stmt[] | null; line: number }
  | { k: 'while'; c: Expr; s: Stmt; line: number }
  | { k: 'repeat'; ss: Stmt[]; c: Expr; line: number }
  | { k: 'for'; v: Expr; a: Expr; b: Expr; down: boolean; s: Stmt; line: number }
  | { k: 'with'; es: Expr[]; s: Stmt; line: number }
  | { k: 'block'; ss: Stmt[]; line: number }
  | { k: 'empty'; line: number };

// ---- the built-in types

export const T = {
  byte: { k: 'int', size: 1, signed: false, lo: 0, hi: 255, name: 'Byte' } as Ty,
  shortint: { k: 'int', size: 1, signed: true, lo: -128, hi: 127, name: 'ShortInt' } as Ty,
  word: { k: 'int', size: 2, signed: false, lo: 0, hi: 65535, name: 'Word' } as Ty,
  integer: { k: 'int', size: 2, signed: true, lo: -32768, hi: 32767, name: 'Integer' } as Ty,
  longint: { k: 'int', size: 4, signed: true, lo: -2147483648, hi: 2147483647, name: 'LongInt' } as Ty,
  longword: { k: 'int', size: 4, signed: false, lo: 0, hi: 4294967295, name: 'LongWord' } as Ty,
  int64: { k: 'int', size: 8, signed: true, lo: -9007199254740991, hi: 9007199254740991, name: 'Int64' } as Ty,
  bool: { k: 'bool', size: 1, lo: 0, hi: 1, name: 'Boolean' } as Ty,
  char: { k: 'char', size: 1, lo: 0, hi: 255, name: 'Char' } as Ty,
  real: { k: 'real', size: 8, name: 'Real' } as Ty,
  single: { k: 'real', size: 4, name: 'Single' } as Ty,
  string: { k: 'string', size: 256, max: 255, name: 'String' } as Ty,
  pointer: { k: 'pointer', size: 4, target: null, name: 'Pointer' } as Ty,
  text: { k: 'text', size: 8, name: 'Text' } as Ty,
  file: { k: 'file', size: 8, of: null, name: 'file' } as Ty,
  void: { k: 'void', size: 0 } as Ty,
  /** A whole-number literal or constant expression. */
  intLit: { k: 'int', size: 4, signed: true, lo: -2147483648, hi: 2147483647, name: 'LongInt', lit: true } as Ty,
  strLit: { k: 'string', size: 256, max: 255, name: 'String', lit: true } as Ty,
  charLit: { k: 'char', size: 1, lo: 0, hi: 255, name: 'Char', lit: true } as Ty,
};

export const isOrd = (t: Ty | null | undefined): boolean =>
  !!t && (t.k === 'int' || t.k === 'bool' || t.k === 'char' || t.k === 'enum');

export const isStructured = (t: Ty | null | undefined): boolean => !!t && (t.k === 'array' || t.k === 'record');

/** A subrange's storage, as Turbo Pascal chooses it. */
export function intForRange(lo: number, hi: number): Ty {
  let base: Ty;
  if (lo >= 0 && hi <= 255) base = T.byte;
  else if (lo >= -128 && hi <= 127) base = T.shortint;
  else if (lo >= 0 && hi <= 65535) base = T.word;
  else if (lo >= -32768 && hi <= 32767) base = T.integer;
  else if (lo >= 0) base = hi <= 2147483647 ? T.longint : T.longword;
  else base = T.longint;
  return { ...base, lo, hi, name: undefined, lit: undefined };
}

export function ptrTarget(t: Ty): Ty | null {
  if (t.target === undefined && t.resolve) t.target = t.resolve();
  return t.target ?? null;
}

export function setType(base: Ty): Ty {
  const lo = base.lo ?? 0;
  const hi = base.hi ?? 255;
  const byteLo = lo >> 3;
  return { k: 'set', base, lo, hi, byteLo, size: (hi >> 3) - byteLo + 1 };
}

export const RESERVED = new Set(
  (
    'and array begin case const div do downto else end file for function goto if implementation in inline interface ' +
    'label mod nil not of or packed procedure program record repeat set shl shr then to type unit until uses var ' +
    'while with xor initialization finalization otherwise'
  ).split(' '),
);
