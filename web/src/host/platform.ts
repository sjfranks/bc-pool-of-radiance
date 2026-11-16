/**
 * platform.ts
 *
 * What the game's host needs of where it runs: a clock, a way to wait, and the keyboard's buffer. The page
 * (ui/shell.ts) and the headless harness (tools/headless.ts) each supply one.
 */

export interface Platform {
  /** Milliseconds since the game started. */
  now(): number;
  /** Wait about ms milliseconds. */
  sleep(ms: number): Promise<void>;
  /** Wait until a key may be in the buffer. */
  waitKey(): Promise<void>;
  /** The game polled the keyboard and found nothing. */
  idle(): Promise<void>;
  /** Give the display a turn. */
  service(): Promise<void>;
}

/** waiting: true while the game waits for a key and nothing else (the interface can say so). */
export const host: { platform: Platform; waiting: boolean } = {
  waiting: false,
  platform: {
    now: () => Date.now(),
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    waitKey: () => new Promise((r) => setTimeout(r, 10)),
    idle: () => new Promise((r) => setTimeout(r, 1)),
    service: () => Promise.resolve(),
  },
};

/** The keyboard buffer: each key a word, the scan code high and the character low; an extended key's character 0. */
export const keys: number[] = [];
const waiters: (() => void)[] = [];

export function pushKey(scan: number, ch: number): void {
  if (keys.length >= 32) return;
  keys.push(((scan & 255) << 8) | (ch & 255));
  for (const w of waiters.splice(0)) w();
}

/** Resolves at the next key pushed. */
export function keyArrives(): Promise<void> {
  return new Promise((r) => waiters.push(r));
}
