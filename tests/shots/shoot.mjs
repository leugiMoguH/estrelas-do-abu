// Uso: node tests/shots/shoot.mjs <url> <ficheiro.png> [largura] [altura] [fullPage=1]
import { chromium } from '@playwright/test';
const [url, out, w = '1280', h = '800', full = '1'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url);
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: full === '1' });
await browser.close();
if (errors.length) console.log('ERROS:', errors.join('\n'));
