// Joga uma sessão inteira. Uso: node tests/shots/play.mjs <url> <pasta> <largura> <altura> <disciplina> <tema(regex)> <modo(Estudar|Teste|Rever)> [n]
import { chromium } from '@playwright/test';
const [
  url,
  dir,
  w = '390',
  h = '844',
  subject = 'matematica',
  topic = 'Frações',
  mode = 'Teste',
  count = '3',
] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
let n = 0;
const shot = async (name, full = false) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${dir}/${String(++n).padStart(2, '0')}-${name}.png`, fullPage: full });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) console.log(`  ! scroll horizontal em ${name}`);
};
const btn = (re) => page.getByRole('button', { name: re }).first();
await page.goto(url);
if (await btn(/Jogar/).count()) {
  await btn(/Jogar/).click();
  await btn(/Surpreende/).click();
  await btn(/Vamos ao centro/).click();
}
await page.locator(`[data-target="${subject}"]`).click();
await btn(new RegExp(topic)).click();
await btn(new RegExp(`^${mode}`)).click();
await page.locator(`button:text-is("${count}")`).first().click();
await btn(/Começar/).click();
for (let q = 0; q < +count; q++) {
  await shot(`pergunta${q + 1}`);
  const order = page.locator('.order-options button');
  const choices = page.locator('.answer-editor button');
  if (await order.count()) {
    const total = await order.count();
    for (let i = 0; i < total; i++)
      await page.locator('.order-options button:not([disabled])').first().click();
  } else if (await choices.count()) {
    await choices.first().click();
  } else {
    for (const input of await page.locator('.answer-editor input').all()) await input.fill('12');
  }
  await btn(/Verificar|Guardar resposta/).click();
  if (mode !== 'Teste') {
    await shot(`feedback${q + 1}`);
    await btn(/Próxima pergunta|Ver resultado/).click();
  }
}
await shot('resultado', true);
console.log('texto resultado:', (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 260));
await browser.close();
if (errors.length) console.log('ERROS:', errors.join('\n'));
