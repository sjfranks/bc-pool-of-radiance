/**
 * x_sysutils.ts
 *
 * The routines web/pas/sysutils.pas declares external.
 */
import { host } from './platform';
import * as vfs from '../rt/vfs';

export function GetTickCount64(): number {
  return Math.floor(host.platform.now());
}

export function DirectoryExists(name: string): boolean {
  return vfs.isDir(name);
}

export function FileExists(name: string): boolean {
  return vfs.get(name) !== undefined;
}
