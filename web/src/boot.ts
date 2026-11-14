/**
 * boot.ts
 *
 * Starts the translated game: its data image into memory, the heap after it, then every unit's initialization and the
 * program (game/index.ts run()). The game never returns of itself; leaving it (the main menu's Exit) ends run() with
 * a HaltError, which start() reports as its exit code.
 */
import { IMAGE, STATIC_BASE, STATIC_TOP, run, units } from './game/index';
import { U8, S, MEM_SIZE, initHeap, w32, SYS } from './rt/mem';
import * as sys from './rt/sys';

export { units };

function decode(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Where the game's screen (320 by 200, a byte a pixel) and its palette (256 by 3, six bits each) are in memory. */
export const screenAt = (): number => units.Host.$at.screen;
export const dacAt = (): number => units.Host.$at.dac;

export async function start(args: string[] = []): Promise<number> {
  U8.fill(0);
  U8.set(decode(IMAGE), STATIC_BASE);
  initHeap(STATIC_TOP);
  S.sp = MEM_SIZE - 16;
  w32(SYS.RandSeed, 0);
  U8[SYS.FileMode] = 2;
  sys.reset();
  sys.env.args = args;
  try {
    await run();
    return 0;
  } catch (e) {
    if (e instanceof sys.HaltError) return e.code;
    throw e;
  }
}
