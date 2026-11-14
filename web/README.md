# Pool of Radiance in the browser

The game, in TypeScript, for a phone held upright (and any other browser). It is the same game as the DOS and native
builds in this repository: the Pascal in `src/` is translated to TypeScript, not rewritten, so its rules, its
screens and its saved games are the Pascal's.

## Playing

- **The buttons under the screen** are the options the game is waiting on, named as the game names them. Where the
  game's options are single letters and the screen says what each is (the main menu), the buttons carry those lines.
- **The arrows** stand beside the buttons where the game takes them: four to walk the 3D view, all eight in a fight,
  up and down (and a page at a time) in a list.
- **The screen answers a tap.** A line of a list moves the highlight there, and a tap on the highlighted line takes
  it. An option's own word, or a line that starts with its lit letter, chooses it. In the 3D view the middle steps
  ahead, the sides turn, the foot turns about. Where the game waits for any key, a tap anywhere goes on.
- **Held upright**, a screen the game divides into panes is taken apart and stacked: the 3D view (or the
  battlefield) as large as the width allows, the party (or the fighter's panel) under it, the text under both.
  `☰` > *Screen: whole* shows the screen as one picture instead. Held sideways, or on a desktop, the screen is whole
  with the buttons beside it.
- **`☰`** opens a short menu: the game's function keys by name (command keys, bestiary, quick save and load,
  minimap, combat log), sound, the screen's arrangement, and backing up or restoring everything saved. **Abc** brings
  up the phone's keyboard, for a name or any key the buttons do not offer. **Esc** backs out.
- A keyboard plays as it does on a PC.

Saved games, characters and settings are kept in the browser's storage on the device (IndexedDB) and are there on the
next visit. *Back up saves* downloads them as one file; *Restore a backup* takes it back, on this device or another.

On a phone, use the browser's *Add to Home Screen* to play full screen; the page works offline after the first visit.

## Building

```bash
cd web
npm install
npm run dev      # a development server, also reachable from a phone on the same network
npm run build    # the site, in web/dist
```

Both pack the game's data from `POOLRAD/` (and the port's own files in `src/binaries/`) into `public/gamedata.bin`.

After changing the Pascal:

```bash
npm run gen      # src/*.pas (and web/pas/*.pas) to web/src/game/*.ts
npm test         # translate and run the Pascal unit tests in tests/
```

`.github/workflows/web.yml` builds the site and publishes it to GitHub Pages on a push to `main` (set *Settings >
Pages > Source* to *GitHub Actions* once).

## How it is made

| Where | What |
| --- | --- |
| `tools/pas2ts/` | The translator: Turbo Pascal to TypeScript. |
| `pas/` | The web port's own host units, in Pascal, in the place of `src/native/`: the screen and video BIOS, the keyboard and clock, Dos, the folders, the sound output. |
| `src/game/` | The game, translated. Generated: do not edit, run `npm run gen`. |
| `src/rt/` | The runtime under it: memory, Turbo Pascal's System routines, files. |
| `src/host/` | What `pas/` declares external: keys, time, directory searches; and the hooks the interface listens on. |
| `src/ui/` | The page: the screen and its panes, the touch bar, storage, sound. |
| `tools/headless.mjs` | The game under Node with a scripted keyboard, saving its screen as PNG files. |
| `tools/runtests.mjs` | Translates and runs the unit tests of `tests/`. |

**The translation.** The game's data lives in one block of memory laid out exactly as Turbo Pascal lays it out
(packed records, 4-byte pointers, length-prefixed strings), so records read straight from the game's files, variant
records, `Move`, `FillChar` and pointers all mean what they meant. A variable is an address and a field an offset;
whole numbers and pointers whose address is never taken become plain JavaScript locals. `Random` is Turbo Pascal's
generator. A routine that can wait for a key or for time to pass becomes an `async` function, and so does everything
that calls it; the rest stay ordinary functions.

**The interface** never guesses what the game is doing. The translator is told a few routines to watch (`gen.sh`):
the menu routines report their arguments as they are entered and left, so the buttons are the game's own option line;
every character the game draws is noted, so a tap can be matched to the line under it; and the panes are found from
the game's own frame, whose corner pieces mark where it divides.

**Sound** is the port's own sequencer and chip emulation, translated with the rest and played through Web Audio.

**Checked by** the game's own unit tests: 72 of the 73 test programs that apply to this port pass when translated
(`npm test`). The one that does not, in `TCFGFILE`, expects `C:\POOLRAD\` not to be a folder, as on Linux or macOS;
in the page's DOS-style file store it is one.
