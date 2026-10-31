import { expect, test } from '@playwright/test';
import { defaultSave } from '../../src/core/save';

test('D: personalizar, comprar, equipar e persistir sem erros', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(save => {
    if (!localStorage.getItem('eda:save:v2')) localStorage.setItem('eda:save:v2', JSON.stringify(save));
  }, { ...defaultSave(), stars: 100 });
  await page.goto('/?tema=d');
  await page.getByRole('button', { name: /Jogar/ }).first().click();
  await expect(page.locator('.avatar-preview .av-d')).toBeVisible();
  await page.getByRole('button', { name: /Vamos ao centro/ }).click();
  await page.getByRole('button', { name: /^Loja$/ }).first().click();
  await page.getByRole('button', { name: /^Personalizar$/ }).click();
  await page.getByRole('button', { name: /^Mochila$/ }).click();
  await page.getByRole('button', { name: /Mochila rosa/ }).click();
  await expect(page.locator('.extras-preview [data-item="backpack-rosa"]')).toBeVisible();
  await page.getByRole('button', { name: /^Loja$/ }).first().click();
  await page.getByLabel('Filtrar por tipo').selectOption('glasses');
  const card = page.locator('.extras-item').filter({ has: page.getByRole('heading', { name: 'Óculos de estrela', exact: true }) });
  await card.getByRole('button', { name: 'Comprar e equipar' }).click();
  await expect(page.locator('.extras-preview [data-item="acc-oculos-estrela"]')).toBeVisible();
  expect(Number(await page.locator('#stars').innerText())).toBe(88);
  if (page.viewportSize()!.width < 650) {
    const preview = await page.locator('.extras-preview').boundingBox();
    const controls = await page.locator('.extras-controls').boundingBox();
    expect(preview!.y + preview!.height).toBeLessThanOrEqual(controls!.y);
  }
  await page.screenshot({ path: info.outputPath('avatar-d.png'), fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.reload();
  await page.getByRole('button', { name: /Continuar/ }).first().click();
  await page.getByRole('button', { name: /^Loja$/ }).first().click();
  await expect(page.locator('.extras-preview [data-item="acc-oculos-estrela"]')).toBeVisible();
  await expect(page.locator('.extras-preview [data-item="backpack-rosa"]')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.extras-preview .eye').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => document.body.classList.add('reduce-motion'));
  expect(await page.locator('.extras-preview .eye').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(errors).toEqual([]);
});
