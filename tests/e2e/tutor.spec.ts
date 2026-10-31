import { expect, test, type Page } from '@playwright/test';
async function room(page: Page, subject = 'matematica'): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: /Jogar/ }).first().click();
  await page.getByRole('button', { name: /Surpreende/ }).click();
  await page.getByRole('button', { name: /Vamos ao centro/ }).click();
  await page.locator(`[data-target="${subject}"]`).click();
}
test('tutor por teclado: navegar, Escape, foco e prática', async ({ page }) => {
  await room(page);
  const trigger = page.getByRole('button', { name: 'Falar com Professor Nuno' });
  await trigger.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(dialog.getByRole('heading')).toHaveText('Explica-me esta matéria');
  await dialog.getByRole('button', { name: 'Voltar ao menu' }).click();
  await dialog.getByRole('button', { name: 'Mostra um exemplo' }).click();
  await dialog.getByRole('button', { name: '3/4 + 1/8', exact: true }).click();
  await expect(dialog).toContainText('7/8');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  await trigger.click(); await dialog.getByRole('button', { name: 'Quero praticar' }).click();
  await expect(page.locator('.question-progress')).toContainText('Estudar');
  await expect(dialog).toHaveCount(0);
});
test('dica partilha contador, esgota pistas e preserva a resposta', async ({ page }) => {
  await room(page, 'portugues');
  await page.getByRole('button', { name: /Começar a estudar/ }).click();
  const choices = page.locator('.answer-editor button');
  const inputs = page.locator('.answer-editor input');
  if (await choices.count()) await choices.first().click();
  else for (const input of await inputs.all()) await input.fill('nome comum');
  const before = await page.locator('.answer-editor').innerHTML();
  const trigger = page.getByRole('button', { name: 'Falar com Marta, a lontra' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Dá-me uma dica' }).click();
  await page.keyboard.press('Escape');
  expect(await page.locator('.answer-editor').innerHTML()).toBe(before);
  await expect(page.getByRole('button', { name: 'Mais uma pista' })).toBeEnabled();
  await page.getByRole('button', { name: 'Mais uma pista' }).click();
  await expect(page.getByRole('button', { name: 'Já tens todas as pistas' })).toBeDisabled();
  await trigger.click(); await dialog.getByRole('button', { name: 'Dá-me uma dica' }).click();
  await expect(dialog).toContainText('Já vimos todas as pistas');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Verificar', exact: true }).click();
  const hints = await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('eda:save:v2') ?? '{}');
    return save.mastery['pt-classes'].hintsUsed;
  });
  expect(hints).toBe(2);
});
test('Teste bloqueia tutor e teclado nas duas disciplinas', async ({ page }) => {
  await page.goto('/');
  for (const subject of ['matematica', 'portugues']) {
    await page.evaluate(() => localStorage.clear());
    await room(page, subject);
    await page.getByRole('button', { name: /Falar com/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Simula uma mudança de modo externa enquanto o diálogo está aberto.
    await page.locator('.mode-card').filter({ hasText: 'Teste' }).evaluate((el: HTMLElement) => el.click());
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Falar com/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Começar o teste' }).click();
    await expect(page.getByText('No teste não há ajuda; no fim vês a correção')).toBeVisible();
    await expect(page.getByRole('button', { name: /Falar com|Uma pista/ })).toHaveCount(0);
    await page.keyboard.press('t'); await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
});
