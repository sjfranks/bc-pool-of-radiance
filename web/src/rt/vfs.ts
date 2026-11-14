/**
 * vfs.ts
 *
 * The game's disk: DOS-style paths (backslashes, any case) to bytes, held in memory. The page fills it with the game's
 * data before the game starts, and keeps what the game writes (store.ts watches through onChange).
 */

export interface VFile {
  data: Uint8Array;
  size: number;
  /** When it was last written, in milliseconds since 1970. */
  mtime: number;
}

export const files = new Map<string, VFile>();
export const dirs = new Set<string>(['C:']);
let cwd = 'C:\\POOLRAD';

/** Told of every file written (data) or removed (null), by its full path. */
export const hooks: { onChange: (path: string, f: VFile | null) => void } = { onChange: () => {} };

export function getCwd(): string {
  return cwd;
}

export function setCwd(path: string): void {
  cwd = normalize(path);
}

/** A name as the store keys it: a full path in capitals, backslashes, no trailing separator. */
export function normalize(name: string): string {
  let p = name.replace(/\//g, '\\').toUpperCase();
  if (/^[A-Z]:/.test(p)) {
    if (p[2] !== '\\') p = p.slice(0, 2) + '\\' + p.slice(2);
  } else if (p.startsWith('\\')) p = 'C:' + p;
  else p = cwd + '\\' + p;
  const parts: string[] = [];
  for (const part of p.split('\\')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length > 1) parts.pop();
    } else parts.push(part);
  }
  return parts.join('\\');
}

export function dirOf(path: string): string {
  const i = path.lastIndexOf('\\');
  return i < 0 ? '' : path.slice(0, i);
}

export function baseOf(path: string): string {
  return path.slice(path.lastIndexOf('\\') + 1);
}

export function put(name: string, data: Uint8Array, mtime = Date.now(), notify = false): void {
  const path = normalize(name);
  const f = { data, size: data.length, mtime };
  files.set(path, f);
  for (let d = dirOf(path); d; d = dirOf(d)) dirs.add(d);
  if (notify) hooks.onChange(path, f);
}

export function get(name: string): VFile | undefined {
  return files.get(normalize(name));
}

export function remove(name: string): boolean {
  const path = normalize(name);
  if (!files.delete(path)) return false;
  hooks.onChange(path, null);
  return true;
}

export function isDir(name: string): boolean {
  return dirs.has(normalize(name));
}

/** A DOS wildcard pattern (* and ?) against a name. */
export function matches(pattern: string, name: string): boolean {
  const [pn, pe = ''] = splitExt(pattern);
  const [nn, ne = ''] = splitExt(name);
  return part(pn, nn) && part(pe, ne);
}

function splitExt(s: string): string[] {
  const i = s.lastIndexOf('.');
  return i < 0 ? [s] : [s.slice(0, i), s.slice(i + 1)];
}

function part(p: string, n: string): boolean {
  for (let i = 0; i < p.length; i++) {
    if (p[i] === '*') return true;
    if (i >= n.length) return false;
    if (p[i] !== '?' && p[i] !== n[i]) return false;
  }
  return p.length === n.length;
}

/** The files, and with wantDirs the folders, of a folder that match a pattern. */
export function list(pathPattern: string, wantDirs: boolean): { name: string; dir: boolean; size: number; mtime: number }[] {
  const full = normalize(pathPattern);
  const dir = dirOf(full);
  const pat = baseOf(full);
  const out: { name: string; dir: boolean; size: number; mtime: number }[] = [];
  for (const [path, f] of files) {
    if (dirOf(path) === dir && matches(pat, baseOf(path))) out.push({ name: baseOf(path), dir: false, size: f.size, mtime: f.mtime });
  }
  if (wantDirs) {
    for (const d of dirs) if (dirOf(d) === dir && matches(pat, baseOf(d))) out.push({ name: baseOf(d), dir: true, size: 0, mtime: 0 });
  }
  out.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return out;
}
