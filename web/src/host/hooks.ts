/**
 * hooks.ts
 *
 * The game's routines the interface watches (gen.sh names them with --hook): the translator has each tell this
 * module when it is entered, with its arguments, and when it is left. What is on top of the stack is what the game is
 * asking the player; ui/touchbar.ts draws its buttons from it.
 */

export interface Frame {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
  /** Filled in by the listener at entry (the menu's flags, read before the menu clears them). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;
}

export const stack: Frame[] = [];
export const listeners: { enter: (f: Frame) => void; change: () => void } = { enter: () => {}, change: () => {} };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enter(name: string, args: any[]): void {
  const f = { name, args, info: null };
  listeners.enter(f);
  stack.push(f);
  listeners.change();
}

export function leave(name: string): void {
  stack.pop();
  listeners.change();
}

/** Calls the interface listens to without their return: text drawn, the screen cleared. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const taps: Record<string, (a: any[]) => void> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tap(name: string, args: any[]): void {
  const f = taps[name];
  if (f) f(args);
}

export function top(): Frame | null {
  return stack.length ? stack[stack.length - 1] : null;
}
