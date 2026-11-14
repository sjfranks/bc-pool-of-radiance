// Drive the built page in a phone-sized browser: node tools/browse.mjs <out dir> <step>...
// Steps: shot:NAME, wait:MS, key:NAME (a keyboard key), tap:X,Y (CSS pixels), btn:TEXT (a bar button whose label is
// TEXT, by its accessible name), eval:JS.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [out, ...steps] = process.argv.slice(2);
const size = (process.env.VIEW ?? '390x844').split('x').map(Number);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
page.on('console', (m) => { if (m.type() === 'error') console.log('[console] ' + m.text()); });
page.on('pageerror', (e) => console.log('[pageerror] ' + e.message));
await page.goto(process.env.URL ?? 'http://localhost:4173/?sting');
for (const s of steps) {
  if (s.startsWith('shot:')) await page.screenshot({ path: `${out}/${s.slice(5)}.png` });
  else if (s.startsWith('wait:')) await page.waitForTimeout(Number(s.slice(5)));
  else if (s.startsWith('key:')) await page.keyboard.press(s.slice(4));
  else if (s.startsWith('tap:')) { const [x, y] = s.slice(4).split(',').map(Number); await page.touchscreen.tap(x, y); }
  else if (s.startsWith('btn:')) {
    const i = Number(s.slice(4));
    const b = page.locator('#bar button').nth(i);
    const box = await b.boundingBox();
    if (box) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); else console.log('no button ' + i);
  }
  else if (s.startsWith('eval:')) console.log(await page.evaluate(s.slice(5)));
  await page.waitForTimeout(250);
}
await browser.close();
