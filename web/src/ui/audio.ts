/**
 * audio.ts
 *
 * The game's sound. The sequencer and the chip emulation are the port's own Pascal (src/native/sndseq.pas and
 * sndchip.pas), translated with the rest of the game; web/pas/sdlsound.pas hands their samples out. Here they reach
 * the browser: an audio node asks for samples as it needs them. A browser gives a page no sound before the first
 * touch or key, so the output opens then; until it does the game keeps the music's time by the clock.
 */
import { U8 } from '../rt/mem';
import { units } from '../boot';

export const state = { on: localStorage.getItem('por.sound') !== '0' };

const RATE = 48000;
let ctx: AudioContext | null = null;
let node: ScriptProcessorNode | null = null;
let running = false;

function pull(out: Float32Array): void {
  let done = 0;
  while (done < out.length) {
    const n = Math.min(4096, out.length - done);
    const at = units.SdlSound.Pull(n);
    for (let i = 0; i < n; i++) {
      const v = U8[at + i * 2] | (U8[at + i * 2 + 1] << 8);
      out[done + i] = ((v << 16) >> 16) / 32768;
    }
    done += n;
  }
}

function open(): void {
  if (ctx || !running || !state.on) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ sampleRate: RATE, latencyHint: 'interactive' });
  } catch {
    ctx = null;
    return;
  }
  // The emulation renders at 48 kHz; where the device will not run at that, each sample is held or dropped to fit.
  const step = RATE / ctx.sampleRate;
  const scratch = new Float32Array(8192);
  node = ctx.createScriptProcessor(2048, 0, 1);
  node.onaudioprocess = (e) => {
    const out = e.outputBuffer.getChannelData(0);
    if (!state.on) {
      out.fill(0);
      return;
    }
    try {
      if (step === 1) pull(out);
      else {
        const need = Math.min(scratch.length, Math.ceil(out.length * step));
        const src = scratch.subarray(0, need);
        pull(src);
        for (let i = 0; i < out.length; i++) out[i] = src[Math.min(need - 1, Math.floor(i * step))];
      }
    } catch {
      out.fill(0);
    }
  };
  node.connect(ctx.destination);
  units.SdlSound.Open();
}

function close(): void {
  if (!ctx) return;
  units.SdlSound.Close();
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
}

export function start(): void {
  running = true;
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (state.on) void ctx.resume();
  });
}
