import { test, expect } from '@playwright/test';

test('Português: cinco domínios, subcapítulo de Gramática, resposta, erros e regresso', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/');
  await page.getByRole('button', { name: /Jogar/ }).first().click();
  await page.getByRole('button', { name: /Surpreende/ }).click();
  await page.getByRole('button', { name: /Vamos ao centro/ }).click();
  await page.locator('[data-target="portugues"]').click();
  for (const domain of ['Oralidade', 'Leitura', 'Educação literária', 'Escrita', 'Gramática']) {
    await expect(page.locator('.topic-group > summary').filter({ hasText: new RegExp(`^${domain}:`) })).toBeVisible();
  }
  await expect(page.locator('[data-focus-id="section-pt-sec-classes"]')).toBeChecked();
  await page.locator('[data-focus-id="chapter-pt-oralidade"]').click();
  await expect(page.locator('[data-focus-id="section-pt-sec-implicitos"]')).toBeDisabled();
  await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Começar a estudar', exact: true })).toBeDisabled();
  await page.locator('[data-focus-id="section-pt-sec-classes"]').check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Começar a estudar', exact: true }).click();
  const prompt = await page.locator('.question h2').textContent();
  const options = page.locator('.answer-editor button');
  if (await options.count()) await options.filter({ hasText: /^verbo$/ }).click();
  else await page.locator('.answer-editor input').fill('verbo');
  await page.getByRole('button', { name: 'Verificar', exact: true }).click();
  await expect(page.locator('.feedback')).toHaveClass(/is-wrong/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: /Voltar/ }).first().click();
  await page.getByRole('button', { name: 'Voltar à sala', exact: true }).click();
  await expect(page.locator('[data-focus-id="section-pt-sec-classes"]')).toBeChecked();
  await expect(page.locator('[data-focus-id="section-pt-sec-classes"]').locator('..')).toContainText('0/1 no total');
  await page.getByRole('button', { name: 'Estudar os erros', exact: true }).click();
  await expect(page.locator('.question h2')).toHaveText(prompt!);
  await page.getByRole('button', { name: /Voltar/ }).first().click();
  await page.getByRole('button', { name: 'Voltar à sala', exact: true }).click();
  // O último tema continua a ser a escolha por omissão ao reabrir pelo mapa.
  await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  await page.locator('[data-focus-id="section-pt-sec-flexao"]').check();
  await page.getByRole('button', { name: 'Começar a estudar', exact: true }).click();
  await page.getByRole('button', { name: /Voltar/ }).first().click();
  await page.getByRole('button', { name: 'Voltar à sala', exact: true }).click();
  await page.getByRole('button', { name: /Voltar/ }).first().click();
  await page.locator('[data-target="portugues"]').click();
  await expect(page.locator('[data-focus-id="section-pt-sec-flexao"]')).toBeChecked();
  expect(errors).toEqual([]);
});
