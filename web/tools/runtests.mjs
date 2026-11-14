// Translate each of the Pascal unit tests in ../tests and run it under Node: a check of the translator and the
// runtime against the game's own test suite.
//
//   node tools/runtests.mjs [name...]        (names without .pas; all of them when none is given)
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const web = path.join(import.meta.dirname, '..');
const testsDir = path.join(web, '..', 'tests');
const cache = path.join(web, '.cache', 'tests');
// not for this port: the AdLib driver, the native ports' folder search and their terminal set-up program
const SKIP = new Set(['tsndopl', 'tgamedir', 'ttuikit', 'tpoolcfg', 'tdatapick', 'tfxremov', 'ttickcnt']);

let names = process.argv.slice(2);
if (!names.length) {
  names = fs
    .readdirSync(testsDir)
    .filter((f) => f.endsWith('.pas'))
    .filter((f) => !/^unit /im.test(fs.readFileSync(path.join(testsDir, f), 'latin1')))
    .map((f) => f.replace(/\.pas$/, ''))
    .filter((n) => !SKIP.has(n));
}

const ENTRY = `
import * as fs from 'node:fs';
import * as path from 'node:path';
import { start } from './boot';
import { host, keys } from './host/platform';
import { clock } from './host/x_dos';
import * as vfs from './rt/vfs';
import * as sys from './rt/sys';

const root = process.argv[2];
for (const dir of [path.join(root, 'POOLRAD'), path.join(root, 'src', 'binaries')]) {
  for (const name of fs.readdirSync(dir)) {
    if (/\\.(pdf|exe)$/i.test(name)) continue;
    vfs.put('C:\\\\POOLRAD\\\\' + name, new Uint8Array(fs.readFileSync(path.join(dir, name))), Date.UTC(1988, 5, 1));
  }
}
let now = 0;
host.platform = {
  now: () => now,
  sleep: async (ms) => { now += Math.max(ms, 0); },
  waitKey: async () => { if (!keys.length) throw new Error('the test waits for a key'); },
  idle: async () => { now += 1; },
  service: async () => {},
};
clock.date = () => new Date(1988, 5, 1, 12, 0, Math.floor(now / 1000));
sys.env.out = (line) => console.log('[out] ' + line);
const log = () => {
  const f = vfs.get('TEST.LOG');
  if (f) process.stdout.write(Buffer.from(f.data.subarray(0, f.size)).toString('latin1'));
  else console.log('NOLOG');
};
start([]).then((code) => { log(); process.exit(code); }).catch((e) => { log(); console.log('CRASH ' + (e && e.stack || e)); process.exit(2); });
`;

let bad = 0;
for (const name of names) {
  const dir = path.join(cache, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gen = spawnSync(
    process.execPath,
    [
      path.join(web, 'tools/pas2ts/main.ts'), path.join(testsDir, name + '.pas'), path.join(dir, 'game'),
      '--dir', path.join(web, 'pas'), '--dir', testsDir, '--dir', path.join(web, '..', 'src'), '--dir', path.join(web, '..', 'src', 'includes'),
      '--dir', path.join(web, '..', 'src', 'native'),
      '--inc', path.join(web, 'pas'), '--inc', path.join(web, '..', 'src', 'includes'), '--inc', path.join(web, '..', 'obj'),
    ],
    { encoding: 'utf8' },
  );
  if (gen.status !== 0) {
    console.log(`TRANSLATE ${name}: ${(gen.stderr || gen.stdout).trim().split('\n').filter((l) => !l.startsWith('    at')).slice(0, 2).join(' | ')}`);
    bad++;
    continue;
  }
  for (const link of ['rt', 'host', 'boot.ts']) fs.symlinkSync(path.join(web, 'src', link), path.join(dir, link));
  fs.writeFileSync(path.join(dir, 'entry.ts'), ENTRY);
  const out = path.join(dir, 'test.mjs');
  try {
    await build({ entryPoints: [path.join(dir, 'entry.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, sourcemap: 'inline', logLevel: 'silent', preserveSymlinks: true, keepNames: true });
  } catch (e) {
    console.log(`BUNDLE ${name}: ${String(e.message).split('\n').slice(0, 3).join(' | ')}`);
    bad++;
    continue;
  }
  const r = spawnSync(process.execPath, ['--enable-source-maps', '--stack-size=4000', out, path.join(web, '..')], { encoding: 'utf8', timeout: 120000 });
  const lines = (r.stdout + r.stderr).split(/\r?\n/).filter((l) => l.trim());
  const done = lines.find((l) => l.startsWith('DONE '));
  const fails = lines.filter((l) => l.startsWith('FAIL '));
  const crash = lines.findIndex((l) => l.startsWith('CRASH') || l.includes('Error'));
  if (done && !fails.length && r.status === 0) console.log(done);
  else {
    bad++;
    console.log(`BAD ${name}: status ${r.status}${r.signal ? ' ' + r.signal : ''} ${done ?? ''}`);
    for (const f of fails.slice(0, 8)) console.log('   ' + f);
    if (fails.length > 8) console.log(`   ... ${fails.length - 8} more`);
    if (crash >= 0) for (const l of lines.slice(crash, crash + 6)) console.log('   ' + l);
    for (const l of lines.filter((x) => x.startsWith('[out]')).slice(0, 4)) console.log('   ' + l);
  }
}
console.log(bad ? `${bad} of ${names.length} test programs did not pass` : `all ${names.length} test programs passed`);
process.exit(bad ? 1 : 0);
