/**
 * store.ts
 *
 * Fills the game's file store (rt/vfs.ts): the game's data from gamedata.bin, then everything the game has written on
 * this device, kept in the browser's IndexedDB (saved games, characters, settings, the merged data archives). A file
 * of the game's own that the game removed stays removed.
 */
import * as vfs from '../rt/vfs';

const DB = 'pool-of-radiance';
const STORE = 'files';
const ROOT = 'C:\\POOLRAD\\';

interface Row {
  data: Uint8Array | null;
  mtime: number;
}

let db: IDBDatabase | null = null;

function open(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function all(d: IDBDatabase): Promise<[string, Row][]> {
  return new Promise((resolve) => {
    const out: [string, Row][] = [];
    const cur = d.transaction(STORE).objectStore(STORE).openCursor();
    cur.onsuccess = () => {
      const c = cur.result;
      if (!c) return resolve(out);
      out.push([String(c.key), c.value as Row]);
      c.continue();
    };
    cur.onerror = () => resolve(out);
  });
}

function write(path: string, row: Row | undefined): void {
  if (!db) return;
  try {
    const s = db.transaction(STORE, 'readwrite').objectStore(STORE);
    if (row === undefined) s.delete(path);
    else s.put(row, path);
  } catch {
    // the device's storage is full or closed: the game plays on from memory
  }
}

export async function loadGameData(url: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`the game's data did not load (${res.status})`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const dv = new DataView(buf.buffer);
  let p = 4;
  const when = Date.UTC(1988, 5, 1);
  for (let i = dv.getUint32(0, true); i > 0; i--) {
    const n = buf[p];
    const name = String.fromCharCode(...buf.subarray(p + 1, p + 1 + n));
    const size = dv.getUint32(p + 1 + n, true);
    p += 5 + n;
    vfs.put(ROOT + name, buf.slice(p, p + size), when);
    p += size;
  }
}

/** Bring back what the game wrote here before, and keep what it writes from now on. */
export async function attach(): Promise<void> {
  const original = new Set(vfs.files.keys());
  db = await open();
  if (db) {
    for (const [path, row] of await all(db)) {
      if (row.data) vfs.put(path, row.data, row.mtime);
      else vfs.files.delete(path);
    }
  }
  vfs.hooks.onChange = (path, f) => {
    if (f) write(path, { data: f.data.slice(0, f.size), mtime: f.mtime });
    else write(path, original.has(path) ? { data: null, mtime: Date.now() } : undefined);
  };
  if (navigator.storage?.persist) void navigator.storage.persist();
}

/** Every file the game has written on this device, for a backup. */
export async function exportAll(): Promise<Blob> {
  const rows = db ? await all(db) : [];
  const parts: BlobPart[] = [];
  const n = new Uint8Array(4);
  new DataView(n.buffer).setUint32(0, rows.filter(([, r]) => r.data).length, true);
  parts.push(n);
  for (const [path, row] of rows) {
    if (!row.data) continue;
    const head = new Uint8Array(1 + path.length + 4);
    head[0] = path.length;
    for (let i = 0; i < path.length; i++) head[1 + i] = path.charCodeAt(i);
    new DataView(head.buffer).setUint32(1 + path.length, row.data.length, true);
    parts.push(head, row.data as BlobPart);
  }
  return new Blob(parts, { type: 'application/octet-stream' });
}

/** Take a backup made by exportAll; the page is reloaded afterwards to play from it. */
export async function importAll(file: Blob): Promise<number> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const dv = new DataView(buf.buffer);
  let p = 4;
  let count = 0;
  for (let i = dv.getUint32(0, true); i > 0; i--) {
    const n = buf[p];
    const path = String.fromCharCode(...buf.subarray(p + 1, p + 1 + n));
    const size = dv.getUint32(p + 1 + n, true);
    p += 5 + n;
    if (!path.startsWith('C:\\')) throw new Error('this is not a Pool of Radiance backup');
    write(path, { data: buf.slice(p, p + size), mtime: Date.now() });
    p += size;
    count++;
  }
  return count;
}

/** Forget everything written here: the game as it came. */
export function eraseAll(): Promise<void> {
  return new Promise((resolve) => {
    if (!db) return resolve();
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).clear();
    t.oncomplete = () => resolve();
    t.onerror = () => resolve();
  });
}
