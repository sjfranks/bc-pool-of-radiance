// Bundle tools/headless.ts with esbuild and run it; see that file for the arguments.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const here = import.meta.dirname;
const out = path.join(here, '..', '.cache', 'headless.mjs');
const src = path.join(here, 'headless.ts');
const stamp = path.join(here, '..', 'src', 'game', 'index.ts');
const fresh =
  fs.existsSync(out) && !process.env.REBUILD && fs.statSync(out).mtimeMs > Math.max(fs.statSync(src).mtimeMs, fs.statSync(stamp).mtimeMs);
if (!fresh) {
  await build({ entryPoints: [src], bundle: true, platform: 'node', format: 'esm', outfile: out, sourcemap: 'inline', logLevel: 'warning', keepNames: true });
}
const r = spawnSync(process.execPath, ['--enable-source-maps', '--stack-size=4000', out, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
