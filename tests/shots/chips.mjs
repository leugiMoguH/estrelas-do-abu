import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:5199/preview/b/index.html?ecra=personalizar');
await p.waitForTimeout(800);
for (const n of ['Roupa','Cabelo','Calçado','Acessórios']) {
  await p.getByRole('button', { name: n, exact: true }).click();
  await p.waitForTimeout(300);
  console.log(n, 'foco:', await p.evaluate(() => document.activeElement?.textContent));
  await p.locator('.chip-grid').first().screenshot({ path: `tests/shots/r2/chips-${n}.png` });
}
await b.close();
