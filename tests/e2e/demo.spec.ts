import { expect, test, type Page } from '@playwright/test';

const button = (page: Page, name: RegExp) => page.getByRole('button', { name }).first();

async function noHorizontalScroll(page: Page, where: string): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, `scroll horizontal em ${where}`).toBeLessThanOrEqual(1);
}

async function answerCurrentQuestion(page: Page): Promise<void> {
  const order = page.locator('.order-options button');
  const choices = page.locator('.answer-editor button');
  if (await order.count()) {
    for (let i = await order.count(); i > 0; i--)
      await page.locator('.order-options button:not([disabled])').first().click();
  } else if (await choices.count()) {
    await choices.first().click();
  } else {
    for (const input of await page.locator('.answer-editor input').all()) await input.fill('12');
  }
  await button(page, /Verificar|Guardar resposta/).click();
}

test('percurso completo: personagem, sessão, estrelas, compra e persistência', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('/');
  await noHorizontalScroll(page, 'boas-vindas');
  await button(page, /Jogar/).click();
  await button(page, /Surpreende/).click();
  await noHorizontalScroll(page, 'onboarding');
  await button(page, /Vamos ao centro/).click();

  await noHorizontalScroll(page, 'mapa');
  await page.locator('[data-target="matematica"]').click();
  await noHorizontalScroll(page, 'sala');
  await button(page, /Começar/).click();

  for (let q = 0; q < 3; q++) {
    await noHorizontalScroll(page, `pergunta ${q + 1}`);
    await answerCurrentQuestion(page);
    await button(page, /Próxima pergunta|Ver resultado/).click();
  }
  await expect(page.getByText(/estrelas/).first()).toBeVisible();
  await noHorizontalScroll(page, 'resultado');
  const stars = Number(await page.locator('#stars').innerText());
  expect(stars).toBeGreaterThanOrEqual(5);

  await button(page, /Voltar ao centro/).click();
  await button(page, /^Loja$/).click();
  await button(page, /Loja/).click();
  const buy = page.getByRole('button', { name: /Comprar e equipar/ }).first();
  await expect(buy).toBeEnabled();
  await buy.click();
  await expect(page.getByText(/comprado e equipado/)).toBeVisible();
  await noHorizontalScroll(page, 'loja');
  const after = Number(await page.locator('#stars').innerText());
  expect(after).toBeLessThan(stars);

  await page.reload();
  await expect(button(page, /Continuar/)).toBeVisible();
  expect(Number(await page.locator('#stars').innerText())).toBe(after);
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem('eda:save:v2') ?? '{}') as { ownedItems: string[] },
  );
  expect(saved.ownedItems.length).toBeGreaterThan(0);

  expect(errors, errors.join('\n')).toEqual([]);
});

test('Português: sessão de teste devolve nota de 0 a 20', async ({ page }) => {
  await page.goto('/');
  await button(page, /Jogar/).click();
  await button(page, /Surpreende/).click();
  await button(page, /Vamos ao centro/).click();
  await page.locator('[data-target="portugues"]').click();
  await button(page, /^Teste/).click();
  await button(page, /Começar o teste/).click();
  for (let q = 0; q < 3; q++) await answerCurrentQuestion(page);
  await expect(page.locator('.grade')).toContainText('/ 20');
});

test('edifícios sem conteúdo ficam «Em preparação» e não abrem sala', async ({ page }) => {
  await page.goto('/');
  await button(page, /Jogar/).click();
  await button(page, /Surpreende/).click();
  await button(page, /Vamos ao centro/).click();
  await page.locator('[data-target="ingles"]').click({ force: true });
  await expect(page.getByText(/em preparação/i).first()).toBeVisible();
  await expect(page.locator('main h1')).toContainText(/centro/i);
});
