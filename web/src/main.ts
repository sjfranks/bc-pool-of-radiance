/**
 * main.ts
 *
 * The page: fills the game's file store, gives the game its clock and keyboard, starts it, and shows it (ui/screen.ts)
 * over the touch bar (ui/controls.ts).
 */
import { start, units } from './boot';
import * as hooks from './host/hooks';
import { U8 } from './rt/mem';
import { host, keys, keyArrives, pushKey } from './host/platform';
import * as store from './ui/store';
import * as screen from './ui/screen';
import * as controls from './ui/controls';
import * as audio from './ui/audio';

const veil = document.getElementById('veil') as HTMLDivElement;
const notice = document.getElementById('notice') as HTMLDivElement;
const menu = document.getElementById('menu') as HTMLDivElement;

function say(text: string, buttons: [string, () => void][] = []): void {
  veil.hidden = false;
  notice.textContent = text;
  for (const [label, act] of buttons) {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', act);
    notice.appendChild(b);
  }
}

// ---- the game's clock and waits

const t0 = performance.now();
let debt = 0;
let lastYield = performance.now();
let lastIdle = 0;

const channel = new MessageChannel();
const turns: (() => void)[] = [];
channel.port1.onmessage = () => turns.shift()?.();
/** Let the page draw and take its input: back as soon as it has. */
function turn(): Promise<void> {
  return new Promise((resolve) => {
    turns.push(() => {
      lastYield = performance.now();
      resolve();
    });
    channel.port2.postMessage(0);
  });
}

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      lastYield = performance.now();
      resolve();
    }, ms),
  );
}

host.platform = {
  now: () => performance.now() - t0,
  // A browser's shortest wait is some four milliseconds, and the game often asks for one: the waits asked for are
  // added up and taken when they come to that much.
  sleep: async (ms) => {
    debt += ms;
    if (debt < 4) {
      if (performance.now() - lastYield > 12) await turn();
      return;
    }
    const before = performance.now();
    await timeout(debt);
    debt = Math.max(-30, debt - (performance.now() - before));
  },
  waitKey: async () => {
    if (!keys.length) await keyArrives();
  },
  // The game looks for a key: when it does nothing else but look, it waits a moment; when it looks between pieces
  // of work, the page only gets its turn now and then.
  idle: async () => {
    const now = performance.now();
    const polling = now - lastIdle < 1.5;
    if (polling) await Promise.race([timeout(5), keyArrives()]);
    else if (now - lastYield > 12) await turn();
    lastIdle = performance.now();
  },
  service: async () => {
    if (performance.now() - lastYield > 12) await turn();
  },
};

// ---- the pause menu

function closeMenu(): void {
  menu.hidden = true;
  menu.textContent = '';
}

function openMenu(): void {
  menu.textContent = '';
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  menu.appendChild(sheet);
  const head = (t: string) => {
    const h = document.createElement('h2');
    h.textContent = t;
    sheet.appendChild(h);
  };
  let cols = sheet;
  const group = () => {
    cols = document.createElement('div');
    cols.className = 'cols';
    sheet.appendChild(cols);
  };
  const item = (label: string, act: () => void, keep = false) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', () => {
      if (!keep) closeMenu();
      act();
    });
    cols.appendChild(b);
    return b;
  };
  const fkey = (n: number) => () => pushKey(58 + n, 0);
  head('The game');
  group();
  item('Command keys', fkey(1));
  item('Bestiary', fkey(2));
  item('Quick save', fkey(5));
  item('Quick load', fkey(8));
  item('Minimap', fkey(3));
  item('Combat log', fkey(7));
  item('Companion tools', fkey(6));
  item('Train', fkey(4));
  head('This page');
  group();
  const snd = item(audio.state.on ? 'Sound: on' : 'Sound: off', () => {
    audio.setOn(!audio.state.on);
    snd.textContent = audio.state.on ? 'Sound: on' : 'Sound: off';
  }, true);
  const lay = item(screen.options.split ? 'Screen: panes' : 'Screen: whole', () => {
    screen.options.split = !screen.options.split;
    localStorage.setItem('por.split', screen.options.split ? '1' : '0');
    lay.textContent = screen.options.split ? 'Screen: panes' : 'Screen: whole';
  }, true);
  item('Full screen', () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  });
  item('Back up saves', async () => {
    const url = URL.createObjectURL(await store.exportAll());
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pool-of-radiance-saves.bin';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
  item('Restore a backup', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', async () => {
      const f = input.files?.[0];
      if (!f) return;
      try {
        await store.importAll(f);
        location.reload();
      } catch (e) {
        say(String((e as Error).message ?? e), [['Back to the game', () => (veil.hidden = true)]]);
      }
    });
    input.click();
  });
  item('Restart the game', () => location.reload());
  cols = sheet;
  item('Back to the game', () => {});
  const p = document.createElement('p');
  p.textContent =
    'Tap the buttons under the screen, a line of a list, or an option’s own word. In the 3D view, tap the middle to step ahead and the sides to turn. Saved games are kept on this device.';
  sheet.appendChild(p);
  menu.hidden = false;
}
menu.addEventListener('click', (e) => {
  if (e.target === menu) closeMenu();
});
controls.settings.onMenu = openMenu;
controls.settings.onGesture = () => audio.unlock();

// ---- start

async function main(): Promise<void> {
  screen.options.split = localStorage.getItem('por.split') !== '0';
  try {
    await store.loadGameData(`${import.meta.env.BASE_URL}gamedata.bin`);
    await store.attach();
  } catch (e) {
    say(`Pool of Radiance could not start: ${(e as Error).message}`, [['Try again', () => location.reload()]]);
    return;
  }
  veil.hidden = true;
  screen.start();
  controls.start();
  audio.start();
  try {
    await start(new URLSearchParams(location.search).has('sting') ? ['STING'] : []);
    say('You have left Pool of Radiance.', [['Play again', () => location.reload()]]);
  } catch (e) {
    console.error(e);
    say(`The game stopped on an error: ${(e as Error).message ?? e}`, [['Start again', () => location.reload()]]);
  }
}

// for looking into the game from the browser's console
(window as unknown as Record<string, unknown>).por = { units, hooks, U8 };

void main();
