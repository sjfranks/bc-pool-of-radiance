/**
 * lexer.ts
 *
 * Turbo Pascal source to tokens, with the compiler directives the game uses handled on the way: conditional
 * compilation ({$IFDEF}, {$IFNDEF}, {$ELSE}, {$ENDIF}) and include files ({$I NAME}). Everything else in a directive
 * is a switch for the DOS compiler and is dropped.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

export type TokKind = 'id' | 'num' | 'real' | 'str' | 'sym' | 'eof';

export interface Tok {
  k: TokKind;
  /** An identifier in lower case, a symbol's text, or a string's bytes (one char per byte). */
  v: string;
  /** An identifier as written. */
  raw?: string;
  n?: number;
  /** A string token written as a single quoted or # character. */
  line: number;
  file: string;
}

export interface LexOptions {
  defines: Set<string>;
  includeDirs: string[];
}

const SYMS3 = ['<>=']; // none in Pascal; kept so the table reads in order
const SYMS2 = [':=', '<>', '<=', '>=', '..', '(.', '.)'];

function findInclude(name: string, dirs: string[], from: string): string {
  const want = name.toLowerCase();
  for (const d of [path.dirname(from), ...dirs]) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.toLowerCase() === want) return path.join(d, f);
  }
  throw new Error(`include file ${name} not found (from ${from})`);
}

export function lex(file: string, opts: LexOptions): Tok[] {
  const out: Tok[] = [];
  lexInto(file, opts, out);
  out.push({ k: 'eof', v: '', line: 0, file });
  return out;
}

function lexInto(file: string, opts: LexOptions, out: Tok[]): void {
  const src = fs.readFileSync(file, 'latin1');
  const n = src.length;
  let i = 0;
  let line = 1;
  // Conditional compilation: each open {$IF..} is 'on' (taking tokens), 'off' (skipping, may turn on at ELSE) or
  // 'dead' (inside a skipped region).
  const cond: ('on' | 'off' | 'dead' | 'done')[] = [];
  const live = () => cond.every((c) => c === 'on');

  function directive(text: string): void {
    const m = /^\$([A-Za-z]+)\s*(.*)$/s.exec(text);
    if (!m) return;
    const name = m[1].toUpperCase();
    const arg = m[2].trim();
    switch (name) {
      case 'IFDEF':
      case 'IFNDEF': {
        if (!live()) {
          cond.push('dead');
          break;
        }
        const has = opts.defines.has(arg.split(/\s+/)[0].toUpperCase());
        cond.push(has === (name === 'IFDEF') ? 'on' : 'off');
        break;
      }
      case 'IFOPT':
      case 'IF':
        cond.push(live() ? 'off' : 'dead');
        break;
      case 'ELSE': {
        const c = cond.pop();
        cond.push(c === 'off' ? 'on' : c === 'on' ? 'done' : c!);
        break;
      }
      case 'ENDIF':
        cond.pop();
        break;
      case 'DEFINE':
        if (live()) opts.defines.add(arg.toUpperCase());
        break;
      case 'UNDEF':
        if (live()) opts.defines.delete(arg.toUpperCase());
        break;
      case 'I':
      case 'INCLUDE':
        if (live() && arg && !/^[+-]/.test(arg)) lexInto(findInclude(arg, opts.includeDirs, file), opts, out);
        break;
      default:
        break;
    }
  }

  while (i < n) {
    const c = src[i];
    if (c === '\n') {
      line++;
      i++;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\r' || c === '\x1a') {
      i++;
      continue;
    }
    if (c === '{') {
      const end = src.indexOf('}', i);
      const text = src.slice(i + 1, end < 0 ? n : end);
      for (const ch of text) if (ch === '\n') line++;
      i = end < 0 ? n : end + 1;
      if (text[0] === '$') directive(text);
      continue;
    }
    if (c === '(' && src[i + 1] === '*') {
      const end = src.indexOf('*)', i + 2);
      const text = src.slice(i + 2, end < 0 ? n : end);
      for (const ch of text) if (ch === '\n') line++;
      i = end < 0 ? n : end + 2;
      if (text[0] === '$') directive(text);
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    const on = live();
    // strings: quoted runs and #nn characters, joined
    if (c === "'" || (c === '#' && /[0-9$]/.test(src[i + 1] ?? ''))) {
      let s = '';
      let quoted = false;
      for (;;) {
        if (src[i] === "'") {
          quoted = true;
          i++;
          for (;;) {
            if (i >= n || src[i] === '\n') throw new Error(`${file}:${line}: unterminated string`);
            if (src[i] === "'") {
              if (src[i + 1] === "'") {
                s += "'";
                i += 2;
                continue;
              }
              i++;
              break;
            }
            s += src[i++];
          }
        } else if (src[i] === '#' && /[0-9$]/.test(src[i + 1] ?? '')) {
          i++;
          let j = i;
          if (src[j] === '$') {
            j++;
            while (/[0-9A-Fa-f]/.test(src[j] ?? '')) j++;
            s += String.fromCharCode(parseInt(src.slice(i + 1, j), 16) & 255);
          } else {
            while (/[0-9]/.test(src[j] ?? '')) j++;
            s += String.fromCharCode(parseInt(src.slice(i, j), 10) & 255);
          }
          i = j;
        } else break;
      }
      if (on) out.push({ k: 'str', v: s, line, file, raw: quoted ? 'q' : '#' });
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const raw = src.slice(i, j);
      i = j;
      if (on) out.push({ k: 'id', v: raw.toLowerCase(), raw, line, file });
      continue;
    }
    if (c === '$' && /[0-9A-Fa-f]/.test(src[i + 1] ?? '')) {
      let j = i + 1;
      while (j < n && /[0-9A-Fa-f]/.test(src[j])) j++;
      const v = parseInt(src.slice(i + 1, j), 16);
      i = j;
      if (on) out.push({ k: 'num', v: '', n: v, line, file });
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < n && /[0-9]/.test(src[j])) j++;
      let real = false;
      if (src[j] === '.' && /[0-9]/.test(src[j + 1] ?? '')) {
        real = true;
        j++;
        while (j < n && /[0-9]/.test(src[j])) j++;
      }
      if (/[eE]/.test(src[j] ?? '') && /[0-9+-]/.test(src[j + 1] ?? '')) {
        real = true;
        j += 2;
        while (j < n && /[0-9]/.test(src[j])) j++;
      }
      const text = src.slice(i, j);
      i = j;
      if (on) out.push({ k: real ? 'real' : 'num', v: '', n: Number(text), line, file });
      continue;
    }
    let sym = '';
    for (const s of [...SYMS3, ...SYMS2]) if (src.startsWith(s, i)) sym = sym || s;
    if (!sym) sym = c;
    i += sym.length;
    if (sym === '(.') sym = '[';
    if (sym === '.)') sym = ']';
    if (on) out.push({ k: 'sym', v: sym, line, file });
  }
  if (cond.length) throw new Error(`${file}: unterminated conditional directive`);
}
