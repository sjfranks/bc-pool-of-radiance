// Pack the game's data (../POOLRAD and the port's own files in ../src/binaries) into public/gamedata.bin, which the
// page loads into its file store: a count, then for each file its name's length and name, its size and its bytes.
import * as fs from 'node:fs';
import * as path from 'node:path';

const web = path.join(import.meta.dirname, '..');
const dirs = [path.join(web, '..', 'POOLRAD'), path.join(web, '..', 'src', 'binaries')];
// not the game's data: the manuals, the code wheel program, and SSI's own programs
const skip = /\.(pdf|exe|ovr)$/i;
const parts = [];
let count = 0;
for (const dir of dirs) {
  for (const name of fs.readdirSync(dir).sort()) {
    if (skip.test(name)) continue;
    const data = fs.readFileSync(path.join(dir, name));
    const head = Buffer.alloc(1 + name.length + 4);
    head[0] = name.length;
    head.write(name.toUpperCase(), 1, 'latin1');
    head.writeUInt32LE(data.length, 1 + name.length);
    parts.push(head, data);
    count++;
  }
}
const n = Buffer.alloc(4);
n.writeUInt32LE(count);
fs.mkdirSync(path.join(web, 'public'), { recursive: true });
const out = Buffer.concat([n, ...parts]);
fs.writeFileSync(path.join(web, 'public', 'gamedata.bin'), out);
console.log(`pack: ${count} files, ${(out.length / 1024) | 0} KB`);
