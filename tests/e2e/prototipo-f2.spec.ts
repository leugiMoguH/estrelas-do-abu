import { test, expect, type Page, type Locator } from '@playwright/test';

type Activate = (locator: Locator) => Promise<void>;
const solutions = [
  [[0, 0, 0, 0], [1, 0, 0, 1]],
  [[0, 1, 1, 0], [1, 1, 1, 1]],
  [[0, 0, 0, 0], [1, 1, 1, 1], [2, 0, 0, 2]],
];

async function monitor(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(() => {
    const accesses: string[] = [];
    Object.assign(window, {f2Accesses: accesses});
    for (const method of ['getItem', 'setItem', 'removeItem', 'key', 'clear'] as const) {
      const original = Storage.prototype[method];
      Object.defineProperty(Storage.prototype, method, {
        value: function(this: Storage, ...args: string[]) {
          if (this === window.localStorage) accesses.push(args[0] ?? method);
          return Reflect.apply(original, this, args);
        },
      });
    }
  });
  return errors;
}

async function fits(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

async function put(page: Page, activate: Activate, choice: number[]): Promise<void> {
  const [card, subject, form, layer] = choice;
  await activate(page.locator(`[data-subject="${card}"][data-value="${subject}"]`));
  await activate(page.locator(`[data-form="${card}"][data-value="${form}"]`));
  await activate(page.locator(`[data-card="${card}"]`));
  await activate(page.locator(`[data-layer="${layer}"]`));
  await expect(page.locator(`[data-layer="${layer}"]`)).toBeFocused();
}

async function keyboardAndRecovery(page: Page, activate: Activate): Promise<void> {
  await expect(page.locator('select')).toHaveCount(0);
  await expect(page.locator('.timeline li')).toHaveCount(0);
  const subject = page.locator('[data-subject="0"][data-value="0"]');
  await subject.focus();
  await page.keyboard.press('Enter');
  await expect(subject).toBeFocused();
  const form = page.locator('[data-form="0"][data-value="0"]');
  await form.focus();
  await page.keyboard.press('Space');
  await expect(form).toBeFocused();
  await put(page, activate, [1, 0, 0, 1]);
  await activate(page.locator('#run'));
  await expect(page.getByRole('status')).toContainText('tampa fechada');
  await expect(page.locator('#run')).toBeFocused();
  await activate(page.locator('#undo'));
  await expect(page.locator('#undo')).toBeFocused();
  await expect(page.locator('.timeline li')).toHaveCount(0);
  await put(page, activate, [0, 0, 0, 0]);
  await activate(page.locator('#run'));
  await activate(page.locator('#reset'));
  await expect(page.locator('#reset')).toBeFocused();
  await expect(page.locator('#run')).toHaveAttribute('aria-disabled', 'false');
}

async function travel(page: Page, activate: Activate): Promise<void> {
  for (let level = 0; level < 3; level++) {
    await expect(page.locator('.card')).toHaveCount(level === 2 ? 4 : 3);
    for (const choice of solutions[level]!) await put(page, activate, choice);
    await fits(page);
    await page.screenshot({path: test.info().outputPath(`desafio-${level + 1}.png`), fullPage: true});
    await activate(page.locator('#run'));
    await expect(page.getByRole('status')).toContainText('A constelação acendeu-se');
    await expect(page.locator('.constellation.lit')).toHaveCount(1);
    await expect(page.locator('#run')).toBeFocused();
    await page.screenshot({path: test.info().outputPath(`desafio-${level + 1}-sucesso.png`), fullPage: true});
    await fits(page);
    await activate(page.locator('#next'));
  }
}

test('viagem completa por toque/rato, armazenamento isolado e recuperação', async ({page, hasTouch}) => {
  const errors = await monitor(page);
  await page.goto('/prototipos/f2/');
  const activate: Activate = async locator => { if (hasTouch) await locator.tap(); else await locator.click(); };
  await fits(page);
  await keyboardAndRecovery(page, activate);
  await travel(page, activate);
  await expect(page.getByRole('heading', {name: '5 estrelas recuperadas'})).toBeVisible();
  await expect(page.locator('.final')).toContainText('5 tentativas');
  await fits(page);
  await page.screenshot({path: test.info().outputPath('ecos-final.png'), fullPage: true});
  const accesses = await page.evaluate(() => (window as unknown as {f2Accesses: string[]}).f2Accesses);
  expect(accesses.length).toBeGreaterThanOrEqual(2);
  expect([...new Set(accesses)]).toEqual(['eda-proto-f2']);
  expect(errors).toEqual([]);
});

test('armazenamento indisponível e movimento reduzido não impedem jogar', async ({page, hasTouch}) => {
  const errors = await monitor(page);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('indisponível'); };
    Storage.prototype.setItem = () => { throw new Error('indisponível'); };
  });
  await page.goto('/prototipos/f2/');
  await expect(page.getByRole('heading', {name: /A caixa dos ecos/})).toBeVisible();
  const activate: Activate = async locator => { if (hasTouch) await locator.tap(); else await locator.click(); };
  await activate(page.locator('#run'));
  await expect(page.getByRole('status')).toContainText('coloca um cartão');
  await travel(page, activate);
  await expect(page.getByRole('heading', {name: '5 estrelas recuperadas'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('peças tácteis, ajuda opcional, eco e remoção com teclado', async ({page, hasTouch}) => {
  const errors = await monitor(page);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/prototipos/f2/');
  const activate: Activate = async locator => { if (hasTouch) await locator.tap(); else await locator.click(); };
  await expect(page.locator('details p')).toBeHidden();
  await expect(page.locator('.link')).toHaveCount(0);
  expect(await page.locator('button').evaluateAll(buttons =>
    buttons.every(button => button.getBoundingClientRect().height >= 44))).toBe(true);
  await put(page, activate, [0, 1, 0, 0]);
  await activate(page.locator('#run'));
  await expect(page.locator('.link')).toBeVisible();
  await expect(page.locator('#run')).toBeFocused();
  await page.locator('[data-remove="0"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-card="0"]')).toBeFocused();
  await expect(page.locator('.timeline li')).toHaveCount(0);
  await activate(page.locator('#undo'));
  await expect(page.locator('#undo')).toBeFocused();
  await expect(page.locator('.timeline li')).toHaveCount(1);
  await expect(page.locator('.link')).toHaveCount(0);
  await activate(page.getByLabel('Ajuda dos tempos'));
  await expect(page.locator('details p')).toBeVisible();
  await activate(page.locator('[data-form="0"][data-value="2"]'));
  await expect(page.locator('details p')).toBeVisible();
  await fits(page);
  expect(errors).toEqual([]);
});
