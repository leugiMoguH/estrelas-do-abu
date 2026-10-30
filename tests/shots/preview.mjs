// Captura as pré-visualizações. Uso: node tests/shots/preview.mjs <baseUrl> <pasta> <largura> <altura> [direções=a,b] [ecrãs=boasvindas,personalizar,mapa]
import { chromium } from '@playwright/test';

const [base, dir, w = '390', h = '844', dirs = 'a,b', screens = 'boasvindas,personalizar,mapa'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
for (const d of dirs.split(',')) {
  for (const s of screens.split(',')) {
    const page = await browser.newPage({ viewport: { width: +w, height: +h } });
    page.on('console', (m) => m.type() === 'error' && errors.push(`${d}/${s}: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`${d}/${s}: ${String(e)}`));
    await page.goto(`${base}/preview/${d}/index.html?ecra=${s}`);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/${d}-${s}.png`, fullPage: s !== 'boasvindas' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) console.log(`! scroll horizontal ${d}/${s}: ${overflow}px`);
    await page.close();
  }
}
await browser.close();
if (errors.length) console.log('ERROS:\n' + errors.join('\n'));
console.log('ok');
