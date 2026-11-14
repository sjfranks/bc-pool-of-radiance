/**
 * audio.ts
 *
 * The game's sound. The sequencer and the chip emulation are the port's own Pascal (src/native/sndseq.pas and
 * sndchip.pas), translated with the rest of the game; web/pas/sdlsound.pas hands their samples out. Here they reach
 * the browser.
 *
 * The game times some waits by the sound driver's ticks, looking at the count over and over until enough have passed.
 * In the native ports an audio thread advances the count meanwhile; a page has one thread, and nothing else runs while
 * the game looks. So the samples are not rendered when the audio output asks: they are rendered ahead, by the audio
 * clock, into a ring the output plays from - on a timer, and each time the game reads the tick count (the translator
 * has that read tell this module). If the output stalls, the sequencer goes back to keeping time by the system clock,
 * as it does before the first touch lets a page make sound at all.
 */
import { U8 } from '../rt/mem';
import { units } from '../boot';
import * as hooks from '../host/hooks';

export const state = { on: localStorage.getItem('por.sound') !== '0' };

const RATE = 48000;
/** How far ahead of the output the game's sound is rendered, in samples. */
const LEAD = RATE / 10;
const ring = new Float32Array(RATE);
let head = 0; // samples rendered, in all
let tail = 0; // samples played
let ctx: AudioContext | null = null;
let node: ScriptProcessorNode | null = null;
let running = false;
/** True while the sequencer's time is the samples rendered (SdlSound.Open). */
let rendering = false;
let base = 0; // the audio clock's time at sample 0
let lastClock = 0;
let lastClockAt = 0;

function render(n: number): void {
  while (n > 0) {
    const k = Math.min(4096, n);
    const at = units.SdlSound.Pull(k);
    for (let i = 0; i < k; i++) {
      const v = U8[at + i * 2] | (U8[at + i * 2 + 1] << 8);
      ring[(head + i) % ring.length] = ((v << 16) >> 16) / 32768;
    }
    head += k;
    n -= k;
  }
}

function clockMode(): void {
  if (!rendering) return;
  rendering = false;
  units.SdlSound.Close();
}

/** Render what the audio clock says is due. */
function pump(): void {
  if (!ctx || !rendering) return;
  const t = ctx.currentTime;
  const now = performance.now();
  if (t !== lastClock) {
    lastClock = t;
    lastClockAt = now;
  } else if (now - lastClockAt > 300) {
    // the output has stopped (the page is hidden, the device is gone): time by the system clock until it is back
    clockMode();
    return;
  }
  const due = Math.floor((t - base) * RATE) + LEAD;
  if (due - head > RATE / 2) {
    // far behind (the page slept): start again from now
    base = t - (head - LEAD / 2) / RATE;
    return;
  }
  if (due > head) render(due - head);
}

hooks.taps['SndSeq.SoundTimerTicks'] = pump;

function resume(): void {
  if (!ctx || rendering || !state.on || ctx.state !== 'running') return;
  head = tail = 0;
  base = ctx.currentTime;
  lastClock = base;
  lastClockAt = performance.now();
  rendering = true;
  units.SdlSound.Open();
}

function open(): void {
  if (ctx || !running || !state.on) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    try {
      ctx = new AC({ sampleRate: RATE, latencyHint: 'interactive' });
    } catch {
      // a browser that will not take a rate: its own
      ctx = new AC();
    }
  } catch {
    ctx = null;
    return;
  }
  // The emulation renders at 48 kHz; where the device will not run at that, samples are held or dropped to fit.
  const step = RATE / ctx.sampleRate;
  let pos = 0;
  node = ctx.createScriptProcessor(2048, 0, 1);
  node.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0);
    if (!rendering) {
      out.fill(0);
      return;
    }
    pump();
    for (let i = 0; i < out.length; i++) {
      const at = tail + Math.floor(pos);
      out[i] = at < head ? ring[at % ring.length] : 0;
      pos += step;
    }
    tail += Math.floor(pos);
    pos -= Math.floor(pos);
    if (tail > head) tail = head;
  };
  node.connect(ctx.destination);
  ctx.addEventListener('statechange', () => {
    if (ctx && ctx.state === 'running') resume();
    else clockMode();
  });
  resume();
}

function close(): void {
  if (!ctx) return;
  clockMode();
  node?.disconnect();
  void ctx.close();
  ctx = null;
  node = null;
}

export function setOn(on: boolean): void {
  state.on = on;
  localStorage.setItem('por.sound', on ? '1' : '0');
  if (on) open();
  else close();
}

/** At a touch or a key: the browser now lets the page make sound. */
export function unlock(): void {
  if (!ctx) open();
  else if (ctx.state === 'suspended') void ctx.resume();
  else resume();
}

export function start(): void {
  running = true;
  window.setInterval(pump, 25);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      clockMode();
      void ctx.suspend();
    } else if (state.on) void ctx.resume();
  });
}
