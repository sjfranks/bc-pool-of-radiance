/**
 * headless.ts
 *
 * Runs the game with no page: a scripted keyboard, a clock that jumps instead of waiting, and the screen saved as PNG
 * files. For checking the translation and for the screenshots in the README.
 *
 *   node tools/headless.mjs [--arg STING]... [--out dir] <step>...
 *
 * A step is text to type, or one of: <enter> <esc> <up> <down> <left> <right> <space> <f1>..<f10> <home> <end> <pgup>
 * <pgdn> <tab> <bksp>, shot:NAME (save NAME.png), wait:MS (let the game run MS of its time first), or dump:NAME
 * (save the file store's file NAME beside the screenshots). Steps are taken one at a time, each time the game waits
 * for the keyboard.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as zlib from 'node:zlib';
import { start, screenAt, dacAt, units } from '../src/boot';
import { host, keys, pushKey } from '../src/host/platform';
import { clock } from '../src/host/x_dos';
import { U8 } from '../src/rt/mem';
import * as vfs from '../src/rt/vfs';
import * as sys from '../src/rt/sys';
import * as hooks from '../src/host/hooks';

const argv = process.argv.slice(2);
const gameArgs: string[] = [];
let outDir = 'shots';
const steps: string[] = [];
let trace = false;
const puts: string[] = [];
// --monkey N: after the steps, N keys chosen at random from what the game is offering, to shake out crashes
let monkey = 0;
let seed = 1;
const recent: string[] = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--arg') gameArgs.push(argv[++i]);
  else if (argv[i] === '--out') outDir = argv[++i];
  else if (argv[i] === '--trace') trace = true;
  else if (argv[i] === '--put') puts.push(argv[++i]);
  else if (argv[i] === '--monkey') monkey = Number(argv[++i]);
  else if (argv[i] === '--seed') seed = Number(argv[++i]);
  else steps.push(argv[i]);
}
fs.mkdirSync(outDir, { recursive: true });

const root = path.resolve(import.meta.dirname, '..', '..');
for (const dir of [path.join(root, 'POOLRAD'), path.join(root, 'src', 'binaries')]) {
  for (const name of fs.readdirSync(dir)) {
    if (/\.(pdf|exe)$/i.test(name) && name !== 'START.EXE') continue;
    vfs.put('C:\\POOLRAD\\' + name, new Uint8Array(fs.readFileSync(path.join(dir, name))), Date.UTC(1988, 5, 1));
  }
}

// --put DIR: a folder of saved games (tests/scenarios/saves/...) into the game's folder
for (const dir of puts) {
  for (const name of fs.readdirSync(dir)) vfs.put('C:\\POOLRAD\\' + name, new Uint8Array(fs.readFileSync(path.join(dir, name))), Date.UTC(1988, 5, 1));
}

function png(name: string): void {
  const scr = screenAt();
  const dac = dacAt();
  const scale = 2;
  const w = 320 * scale;
  const h = 200 * scale;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < w; x++) {
      const c = U8[scr + Math.floor(y / scale) * 320 + Math.floor(x / scale)];
      for (let k = 0; k < 3; k++) {
        const v = U8[dac + c * 3 + k] & 63;
        raw[row + 1 + x * 3 + k] = (v << 2) | (v >> 4);
      }
    }
  }
  const chunk = (type: string, data: Buffer): Buffer => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const out = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(outDir, name + '.png'), out);
  console.log(`[shot ${name} at ${Math.round(now)} ms]`);
}

const NAMED: Record<string, [number, number]> = {
  enter: [0x1c, 13],
  esc: [1, 27],
  space: [0x39, 32],
  tab: [0x0f, 9],
  bksp: [0x0e, 8],
  up: [0x48, 0],
  down: [0x50, 0],
  left: [0x4b, 0],
  right: [0x4d, 0],
  home: [0x47, 0],
  end: [0x4f, 0],
  pgup: [0x49, 0],
  pgdn: [0x51, 0],
  ins: [0x52, 0],
  del: [0x53, 0],
};
for (let i = 1; i <= 10; i++) NAMED['f' + i] = [0x3a + i, 0];

let now = 0;
let waitUntil = -1;
let menuWaits = 0;
let idleSince = -1;

/** Take script steps until one puts a key in the buffer or asks for time to pass; false when the script is done. */
function step(): boolean {
  if (!steps.length && monkey > 0) {
    monkey--;
    monkeyKey();
    return true;
  }
  while (steps.length) {
    if (waitUntil >= 0) {
      if (now < waitUntil) return true;
      waitUntil = -1;
    }
    if (steps[0].startsWith('menu:')) {
      // go on once the game's menu line holds this word
      const want = steps[0].slice(5).toLowerCase();
      const top = hooks.top();
      const have = top && top.name === 'MenuCore.HorizontalMenu' ? String(top.args[0] + ' ' + top.args[1]).toLowerCase() : '';
      if (!have.includes(want)) {
        if (++menuWaits > 400) {
          console.log(`[no menu with "${want}": the game shows "${have}"]`);
          finish();
        }
        now += 5;
        return true;
      }
      menuWaits = 0;
      steps.shift();
      continue;
    }
    const s = steps.shift()!;
    if (trace) console.log(`[step ${s} at ${Math.round(now)} ms]`);
    if (s.startsWith('shot:')) png(s.slice(5));
    else if (s.startsWith('wait:')) {
      waitUntil = now + Number(s.slice(5));
      return true;
    } else if (s === 'cells:') {
      // the screen by 8x8 cell: C the frame's corner piece, . black, # anything else
      const scr = screenAt();
      const cell = (cx: number, cy: number) => {
        let h = '';
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) h += U8[scr + (cy * 8 + y) * 320 + cx * 8 + x].toString(16);
        return h;
      };
      const corner = cell(0, 0);
      for (let cy = 0; cy < 25; cy++) {
        let line = '';
        for (let cx = 0; cx < 40; cx++) line += cell(cx, cy) === corner ? 'C' : /^0+$/.test(cell(cx, cy)) ? '.' : '#';
        console.log(line);
      }
    } else if (s === 'info:') {
      console.log('[hooks] ' + hooks.stack.map((f) => f.name + '(' + f.args.filter((a) => typeof a === 'string').map((a) => JSON.stringify(a)).join(', ') + ')').join(' > '));
    } else if (s.startsWith('dump:')) {
      const f = vfs.get(s.slice(5));
      if (f) fs.writeFileSync(path.join(outDir, s.slice(5).replace(/[\\/:]/g, '_')), f.data.subarray(0, f.size));
      else console.log(`[no file ${s.slice(5)}]`);
    } else if (/^<\w+>$/.test(s)) {
      const k = NAMED[s.slice(1, -1).toLowerCase()];
      if (!k) throw new Error(`unknown key ${s}`);
      pushKey(k[0], k[1]);
      return true;
    } else {
      for (const ch of s) pushKey(0, ch.charCodeAt(0));
      return true;
    }
  }
  return false;
}

function rnd(n: number): number {
  seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
  return seed % n;
}

/** One random key the game might take where it is. */
const deadline = Date.now() + Number(process.env.GUARD ?? 120000) - 5000;
let calls = 0;
/** Called from every wait: the harness's own timers never run while the game does not truly wait. */
function watchdog(where: string): void {
  if ((++calls & 1023) === 0 && Date.now() > deadline) {
    console.log(`[out of time in ${where} at ${Math.round(now)} ms of game time; ${monkey} monkey keys left]`);
    console.log('[hooks] ' + hooks.stack.map((f) => f.name + '(' + f.args.filter((a) => typeof a === 'string').join('|') + ')').join(' > '));
    if (recent.length) console.log('[the last keys]\n  ' + recent.join('\n  '));
    png('timeout');
    process.exit(3);
  }
}

function monkeyKey(): void {
  if (monkey % 500 === 0) console.log(`[monkey: ${monkey} keys left at ${Math.round(now)} ms]`);
  const top = hooks.top();
  let what = '';
  const r = rnd(100);
  if (top && top.name.startsWith('TextRend.Read')) {
    if (r < 50) { pushKey(0, 49 + rnd(3)); what = 'digit'; } else if (r < 90) { pushKey(0x1c, 13); what = 'enter'; } else { pushKey(0, 65 + rnd(26)); what = 'letter'; }
  } else if (top && top.name === 'MenuCore.HorizontalMenu') {
    const menu = String(top.args[1]);
    // never out of the game: not Quit, and No where it asks
    if (/to DOS|Quit/i.test(String(top.args[0]))) {
      pushKey(0, 78);
      recent.push('N @ ' + String(top.args[0]));
      return;
    }
    const hot = [...menu].filter((c) => /[0-9A-Z]/.test(c)).filter((c) => !(/Quit/.test(menu) && c === 'Q'));
    if (hot.length && r < 60) { const c = hot[rnd(hot.length)]; pushKey(0, c.charCodeAt(0)); what = c; }
    else if (r < 75 && !/Quit/.test(menu)) { pushKey(0x1c, 13); what = 'enter'; }
    else if (r < 95) { const k = [72, 80, 75, 77, 71, 79, 73, 81][rnd(8)]; pushKey(k, 0); what = 'arrow' + k; }
    else { pushKey(1, 27); what = 'esc'; }
    what += ' @ ' + String(top.args[0]) + '|' + menu;
  } else { pushKey(0x1c, 13); what = 'enter (no menu)'; }
  if (process.env.MONKEYLOG) fs.appendFileSync(process.env.MONKEYLOG, `${monkey} ${Math.round(now)} ${what}\n`);
  recent.push(what);
  if (recent.length > 12) recent.shift();
}

function finish(): never {
  png('final');
  process.exit(0);
}

host.platform = {
  // each look at the clock moves it a little: the game has loops that only watch it
  now: () => (now += 0.02),
  sleep: async (ms) => {
    watchdog('sleep');
    now += Math.max(ms, 0);
  },
  waitKey: async () => {
    watchdog('waitKey');
    if (waitUntil >= 0 && now < waitUntil) now = waitUntil;
    if (!keys.length && !step()) finish();
    if (!keys.length && waitUntil >= 0) now = waitUntil;
    // waiting for a menu while the game waits for any key: a key no menu takes, and the game looks again
    if (!keys.length && steps.length && steps[0].startsWith('menu:')) pushKey(0, 0xff);
  },
  idle: async () => {
    watchdog('idle');
    // the game polls: a millisecond passes each time, and after a fifth of a second of polling the next step is due
    now += 1;
    if (idleSince < 0) idleSince = now;
    if (waitUntil >= 0) {
      if (now >= waitUntil) step();
      return;
    }
    if (now - idleSince >= 200 || (steps.length && steps[0].startsWith('menu:'))) {
      idleSince = -1;
      if (!step()) finish();
    }
  },
  service: async () => {},
};
clock.date = () => new Date(1988, 5, 1, 12, 0, Math.floor(now / 1000));
sys.env.out = (line) => console.log('[game] ' + line);
void units;

const guard = setTimeout(() => {
  console.log('[timed out]');
  png('timeout');
  process.exit(3);
}, Number(process.env.GUARD ?? 120000));

start(gameArgs)
  .then((code) => {
    console.log(`[the game ended: exit code ${code}]`);
    png('exit');
    clearTimeout(guard);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    if (recent.length) console.log('[the last keys]\n  ' + recent.join('\n  '));
    try {
      png('crash');
    } catch {
      // no screen yet
    }
    process.exit(1);
  });
