// Captura os ecrãs principais. Uso: node tests/shots/screens.mjs <url> <pasta> <largura> <altura>
import { chromium } from '@playwright/test';

const [url, dir, w = '390', h = '844'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
const btn = (re) => page.getByRole('button', { name: re }).first();
const shot = async (name, full = true) => {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: full });
};

await page.goto(url);
await shot('01-boas-vindas', false);
await btn(/Jogar/).click();
await shot('02-personagem');
await btn(/Surpreende/).click();
await btn(/Vamos ao centro/).click();
await shot('03-mapa');
await page.locator('[data-target="matematica"]').click();
await shot('04-sala');
await btn(/Começar/).click();
await shot('05-pergunta', false);
const choices = page.locator('.answer-editor button');
if (await choices.count()) await choices.first().click();
else for (const input of await page.locator('.answer-editor input').all()) await input.fill('12');
await btn(/Verificar/).click();
await shot('06-feedback', false);
for (let q = 0; q < 3; q++) {
  if (q > 0) {
    const c = page.locator('.answer-editor button');
    const o = page.locator('.order-options button');
    if (await o.count()) {
      for (let i = await o.count(); i > 0; i--) await page.locator('.order-options button:not([disabled])').first().click();
    } else if (await c.count()) await c.first().click();
    else for (const input of await page.locator('.answer-editor input').all()) await input.fill('12');
    await btn(/Verificar/).click();
  }
  await btn(/Próxima pergunta|Ver resultado/).click();
}
await shot('07-resultado');
await btn(/Voltar ao centro/).click();
await btn(/^Loja$/).click();
await shot('08-loja');
await btn(/Personalizar/).click();
await shot('09-personalizar');
await browser.close();
if (errors.length) console.log('ERROS:', errors.join('\n'));
console.log('ok', dir);
