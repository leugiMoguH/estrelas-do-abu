// Uso: node tests/shots/sections.mjs <url> <pastaSaida>  — uma captura por <section>
import { chromium } from '@playwright/test';
const [url, dir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url);
await page.waitForTimeout(500);
const sections = page.locator('section');
const n = await sections.count();
for (let i = 0; i < n; i++) {
  const title = (await sections.nth(i).locator('h2').innerText()).toLowerCase().replace(/[^a-z]+/g, '-');
  await sections.nth(i).screenshot({ path: `${dir}/${title}.png` });
}
await browser.close();
if (errors.length) console.log('ERROS:', errors.join('\n'));
console.log(n, 'secções');
