import { test, expect, type Locator } from '@playwright/test';
test('três situações, métricas, recuperação e isolamento', async ({page, hasTouch}) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => {
    const keys: string[] = [];
    Object.assign(window, {f2bKeys: keys});
    for (const method of ['getItem', 'setItem', 'removeItem', 'key', 'clear'] as const) {
      const original = Storage.prototype[method];
      Object.defineProperty(Storage.prototype, method, {value: function(this: Storage, ...args: string[]) {
        if (this === localStorage) keys.push(args[0] ?? method);
        return Reflect.apply(original, this, args);
      }});
    }
  });
  await page.goto('/prototipos/f2b/?registo');
  const activate = async (l: Locator): Promise<void> => { if (hasTouch) await l.tap(); else await l.click(); };
  const use = async (word: string, target: string): Promise<void> => {
    await activate(page.locator(`[data-word="${word}"]`));
    await expect(page.locator(`[data-target="${target}"]`)).toHaveClass(/valid/);
    await activate(page.locator(`[data-target="${target}"]`));
  };
  for (let level = 0; level < 3; level++) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const selector of ['.scene', '.tools', '#undo', '#reset']) {
      const box = await page.locator(selector).boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    }
    expect(await page.locator('button').evaluateAll(bs => bs.every(b => {
      const r = b.getBoundingClientRect(); return r.width >= 44 && r.height >= 44;
    }))).toBe(true);
    await page.screenshot({path: test.info().outputPath(`situacao-${level + 1}-inicio.png`), fullPage: true});
    if (level === 0) {
      const start = await page.evaluate(() => performance.now());
      await activate(page.locator('[data-target="caixa"]'));
      await expect(page.getByRole('status')).toContainText('O Abu abre a caixa');
      const elapsed = await page.evaluate(t => performance.now() - t, start);
      const metrics = JSON.parse(await page.locator('#metrics').innerText());
      expect(metrics[0].firstActions).toBe(1);
      expect(metrics[0].reactionMs).toBeLessThan(300);
      await test.info().attach('primeira-consequencia', {body: JSON.stringify({elapsed, metrics}), contentType: 'application/json'});
    } else {
      await use('sopram', 'a');
      if (level === 2) {
        await use('fecha', 'comporta-a');
        await use('abre', 'comporta-b');
      }
      await use('sopra', 'b');
    }
    await expect(page.locator('.feedback')).toContainText('acendeu');
    await page.screenshot({path: test.info().outputPath(`situacao-${level + 1}-sucesso.png`), fullPage: true});
    await activate(page.locator('#undo'));
    await expect(page.locator('.feedback')).not.toContainText('acendeu');
    await activate(page.locator('#reset'));
    if (level === 0) await activate(page.locator('[data-target="caixa"]'));
    else {
      await use('sopram', 'a');
      if (level === 2) { await use('fecha', 'comporta-a'); await use('abre', 'comporta-b'); }
      await use('sopra', 'b');
    }
    if (level < 2) await activate(page.locator('#next'));
  }
  expect(await page.evaluate(() => [...new Set((window as unknown as {f2bKeys: string[]}).f2bKeys)])).toEqual(['eda-proto-f2b']);
  expect(errors).toEqual([]);
});
test('teclado, movimento reduzido, pistas e armazenamento indisponível', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw Error('indisponível'); };
    Storage.prototype.setItem = () => { throw Error('indisponível'); };
  });
  await page.goto('/prototipos/f2b/');
  await expect(page.locator('#metrics')).toHaveCount(0);
  await page.locator('[data-target="caixa"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('#next').click();
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('#hint')).toHaveCount(0);
    await page.locator('[data-word="sopram"]').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-word="sopram"]')).toBeFocused();
    await page.locator('[data-target="b"]').focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#hint')).toBeVisible();
  await page.locator('#hint').click();
  await expect(page.locator('.hint')).toHaveCount(2);
});
