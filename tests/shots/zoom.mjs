// Uso: node tests/shots/zoom.mjs <url> <seletor> <indice> <saida.png> [escala=3]
import { chromium } from '@playwright/test';
const [url, selector, index, out, scale = '3'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: +scale });
await page.goto(url);
await page.waitForTimeout(500);
await page.locator(selector).nth(+index).screenshot({ path: out });
await browser.close();
