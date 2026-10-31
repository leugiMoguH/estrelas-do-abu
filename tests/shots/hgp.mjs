import { chromium } from '@playwright/test';
const base = process.env.F1_URL || 'http://localhost:4173/';
const b = await chromium.launch(); const out = [];
for (const [w, h] of [[390, 844], [820, 1180], [1280, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
  const shot = async n => p.screenshot({ path: `tests/shots/hgp/${w}x${h}-${n}.png`, fullPage: true });
  await p.goto(base); await p.getByRole('button', { name: /Jogar/ }).first().click();
  await p.getByRole('button', { name: /Surpreende/ }).click(); await p.getByRole('button', { name: /Vamos ao centro/ }).click();
  await shot('mapa'); await p.locator('[data-target="historia"]').click(); await p.waitForTimeout(400); await shot('sala');
  await p.getByRole('button', { name: 'Limpar', exact: true }).click();
  await p.getByRole('checkbox').nth(6).check(); await shot('sala-selecao');
  await p.getByRole('button', { name: /Começar a estudar/ }).click();
  let fig = false;
  for (let i = 0; i < 8 && !fig; i++) {
    if (!(await p.locator('.question-progress').count())) break;
    if (await p.locator('.pt-map').count()) { fig = true; await shot('pergunta-mapa'); break; }
    if (i === 0) await shot('pergunta');
    const order = p.locator('.order-options button:not([disabled])'); const ch = p.locator('.answer-editor button');
    if (await order.count()) { while (await order.count()) await order.first().click(); }
    else if (await ch.count()) await ch.first().click(); else for (const inp of await p.locator('.answer-editor input').all()) await inp.fill('1900');
    await p.getByRole('button', { name: /^Verificar$/ }).click(); await p.waitForTimeout(200);
    if (i === 0) await shot('feedback');
    await p.getByRole('button', { name: /Próxima pergunta|Ver resultado/ }).click();
  }
  out.push({ w, h, fig, overflow: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), errors: errs.length });
  await p.close();
}
console.log(JSON.stringify(out)); await b.close();
