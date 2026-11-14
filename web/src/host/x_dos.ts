/**
 * x_dos.ts
 *
 * The routines web/pas/dos.pas declares external: the date and time, and directory searches and file times on the
 * page's file store.
 */
import { U8, r32, w16, w32, wS } from '../rt/mem';
import * as vfs from '../rt/vfs';
import * as sys from '../rt/sys';

/** The clock the game reads the date from; the headless harness fixes it. */
export const clock = { date: (): Date => new Date() };

let dosErrorAt = 0;

export function Bind(error: number): void {
  dosErrorAt = error;
}

function setDosError(code: number): void {
  if (dosErrorAt) w16(dosErrorAt, code);
}

export function GetDate(year: number, month: number, mday: number, wday: number): void {
  const d = clock.date();
  w16(year, d.getFullYear());
  w16(month, d.getMonth() + 1);
  w16(mday, d.getDate());
  w16(wday, d.getDay());
}

export function GetTime(hour: number, minute: number, second: number, sec100: number): void {
  const d = clock.date();
  w16(hour, d.getHours());
  w16(minute, d.getMinutes());
  w16(second, d.getSeconds());
  w16(sec100, Math.floor(d.getMilliseconds() / 10));
}

/** A time as DOS packs it: two-second steps from 1980. */
export function dosTime(ms: number): number {
  const d = new Date(ms);
  const y = Math.max(1980, d.getFullYear());
  return (
    (((y - 1980) << 25) | ((d.getMonth() + 1) << 21) | (d.getDate() << 16) | (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) >>> 0
  );
}

// SearchRec: fill[21], attr, time, size, name. The search's own state is kept here, its number in the fill bytes.
const searches = new Map<number, { hits: ReturnType<typeof vfs.list>; next: number }>();
let nextSearch = 1;

function fillRec(rec: number): void {
  const s = searches.get(r32(rec));
  if (!s || s.next >= s.hits.length) {
    setDosError(18);
    return;
  }
  const h = s.hits[s.next++];
  U8[rec + 21] = h.dir ? 0x10 : 0x20;
  w32(rec + 22, dosTime(h.mtime));
  w32(rec + 26, h.size);
  wS(rec + 30, 255, h.name);
  setDosError(0);
}

export function FindFirst(path: string, attr: number, rec: number): void {
  const id = nextSearch++;
  searches.set(id, { hits: vfs.list(path, (attr & 0x10) !== 0), next: 0 });
  w32(rec, id);
  fillRec(rec);
}

export function FindNext(rec: number): void {
  fillRec(rec);
}

export function FindClose(rec: number): void {
  searches.delete(r32(rec));
}

export function GetFTime(f: number, time: number): void {
  const info = sys.fileInfo(f);
  if (!info || !info.file) {
    setDosError(6);
    w32(time, 0);
    return;
  }
  w32(time, dosTime(info.file.mtime));
  setDosError(0);
}

export function SetFTime(f: number, time: number): void {
  setDosError(0);
}

export function GetFAttr(f: number, attr: number): void {
  const info = sys.fileInfo(f);
  if (info && info.file) {
    w16(attr, 0x20);
    setDosError(0);
  } else if (info && vfs.dirs.has(info.path)) {
    w16(attr, 0x10);
    setDosError(0);
  } else {
    w16(attr, 0);
    setDosError(2);
  }
}

export function SetFAttr(f: number, attr: number): void {
  setDosError(0);
}

export function FExpand(path: string): string {
  return vfs.normalize(path);
}
