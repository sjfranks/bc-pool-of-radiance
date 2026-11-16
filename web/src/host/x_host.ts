/**
 * x_host.ts
 *
 * The routines web/pas/host.pas declares external: the keyboard buffer, the BIOS clock and the waits.
 */
import { host, keys, pushKey } from './platform';

export function Service(): Promise<void> {
  return host.platform.service();
}

export async function WaitKey(): Promise<void> {
  host.waiting = true;
  while (!keys.length) await host.platform.waitKey();
  host.waiting = false;
}

export function Idle(): Promise<void> {
  return host.platform.idle();
}

export function Sleep(ms: number): Promise<void> {
  return host.platform.sleep(ms);
}

export function PushKey(scan: number, ch: number): void {
  pushKey(scan, ch);
}

export function KeyWaiting(): boolean {
  return keys.length > 0;
}

export function PopKey(): number {
  return keys.length ? keys.shift()! : 0;
}

/** The BIOS's 18.2 Hz tick count, from the game's start. */
export function BiosTicks(): number {
  return Math.floor((host.platform.now() * 1193182) / 65536000);
}
