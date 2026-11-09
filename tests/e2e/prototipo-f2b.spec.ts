import { test, expect, type Locator, type Page } from '@playwright/test';

type Activate = (locator: Locator) => Promise<void>;
type Use = (word: string, target: string) => Promise<void>;
interface Metric {
  actions: number;
  undos: number;
  firstActions?: number;
  firstMs?: number;
  reactionMs?: number;
}

async function readMetrics(page: Page): Promise<Metric[]> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('eda-proto-f2b')!).metrics);
}

async function monitor(page: Page): Promise<string[]> {
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
  return errors;
}

async function fits(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  for (const selector of ['.scene', '.tools', '#undo', '#reset']) {
    const box = await page.locator(selector).boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
  expect(await page.locator('button').evaluateAll(bs => bs.every(b => {
    const r = b.getBoundingClientRect(); return r.width >= 44 && r.height >= 44;
  }))).toBe(true);
}

async function firstConsequence(page: Page, activate: Activate): Promise<void> {
  const start = await page.evaluate(() => performance.now());
  await activate(page.locator('[data-target="caixa"]'));
  await expect(page.getByRole('status')).toContainText('O Abu abre a caixa');
  const elapsed = await page.evaluate(t => performance.now() - t, start);
  await expect.poll(async () => (await readMetrics(page))[0]!.reactionMs).toBeDefined();
  const metrics = await readMetrics(page);
  expect(metrics[0]!.firstActions).toBe(1);
  expect(metrics[0]!.reactionMs).toBeLessThan(300);
  await test.info().attach('primeira-consequencia', {body: JSON.stringify({elapsed, metrics}), contentType: 'application/json'});
}

async function solve(level: number, use: Use): Promise<void> {
  await use('sopram', 'a');
  if (level === 2) {
    await use('fecha', 'comporta-a');
    await use('abre', 'comporta-b');
  }
  await use('sopra', 'b');
}

async function captureSuccess(page: Page, level: number): Promise<void> {
  await expect(page.locator('.feedback')).toContainText('acendeu');
  const measured = (await readMetrics(page))[level]!;
  expect(measured.actions).toBe([1, 4, 8][level]);
  expect(measured.undos).toBe(0);
  await test.info().attach(`metricas-situacao-${level + 1}`, {
    body: JSON.stringify(measured), contentType: 'application/json',
  });
  console.info(`F2b ${test.info().project.name} situação ${level + 1}: ${JSON.stringify(measured)}`);
  await page.locator('.scene').evaluate(async el => {
    await Promise.all(el.getAnimations({subtree: true}).filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished));
  });
  await page.screenshot({path: test.info().outputPath(`situacao-${level + 1}-sucesso.png`), fullPage: true});
}

async function journey(page: Page, activate: Activate, use: Use): Promise<void> {
  for (let level = 0; level < 3; level++) {
    await fits(page);
    await page.screenshot({path: test.info().outputPath(`situacao-${level + 1}-inicio.png`), fullPage: true});
    if (level === 0) await firstConsequence(page, activate);
    else {
      await expect(page.locator('.cloud')).toHaveCount(2);
      await solve(level, use);
    }
    await captureSuccess(page, level);
    await fits(page);
    await activate(page.locator('#undo'));
    await expect(page.locator('.feedback')).not.toContainText('acendeu');
    await expect(page.locator('.selected-cloud')).toHaveCount(0);
    await activate(page.locator('#reset'));
    await expect(page.locator('.selected-cloud')).toHaveCount(0);
    if (level === 0) await activate(page.locator('[data-target="caixa"]'));
    else await solve(level, use);
    if (level < 2) await activate(page.locator('#next'));
  }
}

test('três situações, métricas, recuperação e isolamento', async ({page, hasTouch}) => {
  const errors = await monitor(page);
  await page.goto('/prototipos/f2b/');
  await expect(page.locator('#metrics')).toHaveCount(0);
  const activate: Activate = async locator => {
    if (hasTouch) await locator.tap();
    else await locator.click();
  };
  const use: Use = async (word, target) => {
    await activate(page.locator(`[data-word="${word}"]`));
    await expect(page.locator(`[data-target="${target}"]`)).toHaveClass(/valid/);
    if (word === 'sopra' || word === 'sopram') {
      await expect(page.locator('.cloud')).toHaveCount(2);
      await expect(page.locator('.selected-cloud')).toHaveCount(word === 'sopra' ? 1 : 2);
      await expect(page.locator('.feedback')).toHaveText(word === 'sopra' ? 'A nuvem sopra… Toca num barco.' : 'As nuvens sopram… Toca num barco.');
    } else await expect(page.locator('.selected-cloud')).toHaveCount(0);
    await activate(page.locator(`[data-target="${target}"]`));
    if (word === 'sopra' || word === 'sopram') {
      await expect(page.locator('.cloud')).toHaveCount(2);
      await expect(page.locator('.gust')).toHaveCount(word === 'sopram' ? 2 : 1);
      if (word === 'sopram') {
        await expect(page.locator('.blowing')).toHaveCount(2);
        await page.locator('.scene').evaluate(async el => {
          await Promise.all(el.getAnimations({subtree: true}).filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished));
        });
        await page.screenshot({path: test.info().outputPath(`duas-nuvens-${target}-${await page.locator('.gate').count()}.png`), fullPage: true});
      }
    }
    if (target.startsWith('comporta')) {
      const gate = page.locator('.gate').nth(target === 'comporta-a' ? 0 : 1);
      await expect(gate).toHaveAttribute('data-open', String(word === 'abre'));
      await expect(gate.locator('.current')).toHaveCount(word === 'abre' ? 1 : 0);
      const door = await gate.boundingBox();
      const hit = await page.locator(`[data-target="${target}"]`).boundingBox();
      expect(hit!.width).toBeGreaterThanOrEqual(44);
      expect(hit!.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs((hit!.x + hit!.width / 2) - (door!.x + door!.width / 2))).toBeLessThan(20);
    }
  };
  await journey(page, activate, use);
  expect(await page.evaluate(() => [...new Set((window as unknown as {f2bKeys: string[]}).f2bKeys)])).toEqual(['eda-proto-f2b']);
  expect(errors).toEqual([]);
});
test('teclado, movimento reduzido, pistas e armazenamento indisponível', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw Error('indisponível'); };
    Storage.prototype.setItem = () => { throw Error('indisponível'); };
  });
  await page.goto('/prototipos/f2b/?registo');
  await expect(page.locator('#metrics')).toBeVisible();
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
  await expect(page.locator('.cloud')).toHaveCount(2);
  expect(await page.locator('.blowing .gust').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('[data-word="sopra"]').click();
  await expect(page.locator('.selected-cloud')).toHaveCount(1);
  await page.locator('#undo').click();
  await expect(page.locator('.selected-cloud')).toHaveCount(0);
  await page.locator('[data-word="sopram"]').click();
  await expect(page.locator('.selected-cloud')).toHaveCount(2);
  await page.locator('#reset').click();
  await expect(page.locator('.selected-cloud')).toHaveCount(0);
  await expect(page.locator('.cloud')).toHaveCount(2);
  await expect(page.locator('#hint')).toBeVisible();
  await page.locator('#hint').click();
  await expect(page.locator('.hint')).toHaveCount(2);
});
