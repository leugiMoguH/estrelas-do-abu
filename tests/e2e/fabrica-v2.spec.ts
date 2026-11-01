import { test, expect } from '@playwright/test';
import snapshot from '../../docs/hgp/fabrica/itens.json' with { type: 'json' };
import type { HgpItem } from '../../content/historia/schema';

test('Fábrica V2: interpretação de resumo, competências persistidas e interface sem scroll', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: /Jogar/ }).first().click();
  await page.getByRole('button', { name: /Surpreende/ }).click();
  await page.getByRole('button', { name: /Vamos ao centro/ }).click();
  // Perfil isolado do Playwright. A exigência da fonte é treinada; as outras competências permanecem novas.
  await page.evaluate(() => {
    const app = JSON.parse(localStorage.getItem('eda:app:v1')!);
    app.skills = { 'hgp-seculo-xviii:fonte': { attempts: 12, correct: 12, level: 3, atLevel: [true, true, true, true], recent: [true, true, true, true], lastSeen: 1, reviewStep: 3, weak: [] } };
    // No subcapítulo escolhido só o resumo exige interpretação de fonte.
    for (const skill of ['conceito', 'facto', 'cronologia', 'consequencia']) app.skills[`hgp-seculo-xviii:${skill}`] = { ...app.skills['hgp-seculo-xviii:fonte'] };
    localStorage.setItem('eda:app:v1', JSON.stringify(app));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.locator('[data-target="historia"]').click();
  await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  const closed = page.locator('.topic-group:not([open]) > summary');
  while (await closed.count()) await closed.first().click();
  await page.getByRole('checkbox', { name: /Legado africano nas sociedades/ }).check();
  await page.getByRole('button', { name: /Começar a estudar/ }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('eda:app:v1')!).skills['hgp-seculo-xviii:fonte']?.level)).toBe(3);
  // Há também um item manual avançado. A ordem entre itens igualmente adequados é aleatória.
  for (let n = 0; n < 2 && !await page.locator('.stimulus').count(); n++) {
    const prompt = await page.locator('form.question h2').innerText();
    const item = (snapshot as unknown as HgpItem[]).find(i => i.prompt === prompt)!;
    expect(item, prompt).toBeTruthy();
    if (item.kind === 'mcq') await page.getByRole('button', { name: item.correct, exact: true }).click();
    else if (item.kind === 'order') for (const value of item.correct) await page.locator('.order-options').getByRole('button', { name: value, exact: true }).click();
    else if (item.kind === 'numeric') await page.locator('.answer-editor input').fill(String(item.correct));
    else for (let k = 0; k < item.correct.length; k++) await page.locator('.answer-editor input').nth(k).fill(item.correct[k]![0]!);
    await page.getByRole('button', { name: 'Verificar', exact: true }).click();
    await page.getByRole('button', { name: /Próxima pergunta/ }).click();
  }
  await expect(page.locator('form.question')).toContainText('Resumo escrito para o jogo');
  await expect(page.locator('form.question')).toContainText('Palmares');
  await page.screenshot({ path: info.outputPath('fabrica-v2-resumo.png'), fullPage: true });
  await page.getByRole('button', { name: 'Existiam formas diferentes de procurar a liberdade e resistir à escravatura', exact: true }).click();
  await page.getByRole('button', { name: 'Verificar', exact: true }).click();
  await expect(page.locator('.feedback')).toHaveClass(/is-right/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('eda:save:v2')!));
  expect(saved.seen.at(-1).ref.templateId).toBe('hgp-seculo-xviii-k-doc-irmandades-documento-resumo');
  expect(saved).not.toHaveProperty('skills');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
