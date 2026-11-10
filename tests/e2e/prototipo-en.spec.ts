import { test, expect, type Page } from '@playwright/test';
async function capture(page: Page, name: string): Promise<void> {
  await page.locator('.festival').evaluate(async el => {
    await Promise.all(el.getAnimations({subtree: true}).filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished));
  });
  await page.screenshot({path: test.info().outputPath(name), fullPage: true});
}
async function fits(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  expect(await page.locator('button').evaluateAll(bs => bs.filter(b => b.getBoundingClientRect().width > 0).every(b => { const r = b.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 && r.bottom <= innerHeight && r.right <= innerWidth; }))).toBe(true);
  expect(await page.locator('.bubble p').evaluateAll(ps => ps.every(p => parseFloat(getComputedStyle(p).fontSize) >= 16))).toBe(true);
}
test('ronda recuperável, constelação, nova ronda e isolamento', async ({ page, hasTouch }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => {
    const audit = { keys: [] as string[], forbidden: [] as string[] };
    Object.assign(window, { enAudit: audit });
    for (const method of ['getItem', 'setItem', 'removeItem', 'key', 'clear'] as const) {
      const original = Storage.prototype[method];
      Object.defineProperty(Storage.prototype, method, { value: function(this: Storage, ...args: string[]) {
        if (this === localStorage) audit.keys.push(args[0] ?? method);
        return Reflect.apply(original, this, args);
      } });
    }
    window.fetch = () => { audit.forbidden.push('fetch'); throw Error('fetch'); };
    if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => { audit.forbidden.push('microphone'); throw Error('microphone'); };
    const Recognition = class { constructor() { audit.forbidden.push('recognition'); throw Error('recognition'); } };
    Object.assign(window, { SpeechRecognition: Recognition, webkitSpeechRecognition: Recognition });
  });
  await page.goto('/prototipos/en/');
  const act = async (action: string): Promise<void> => { const b = page.locator(`[data-action="${action}"]`); if (hasTouch) await b.tap(); else await b.click(); };
  await fits(page);
  if (await page.evaluate(() => innerHeight > innerWidth)) {
    expect(await page.locator('.festival').evaluate(el => getComputedStyle(el).flexDirection)).toBe('column');
    const visitors = await page.locator('.visitors').boundingBox();
    const stall = await page.locator('.stall').boundingBox();
    expect(visitors!.y + visitors!.height).toBeLessThanOrEqual(stall!.y);
  }
  await capture(page, 'festival-inicio.png');
  await expect(page.locator('#metrics')).toHaveCount(0);
  const initial = await page.locator('.bubble').allTextContents();
  await act('vanilla'); await act('give-0');
  await expect(page.locator('.visitor').nth(0)).toHaveClass(/served/);
  await act('mint'); await act('chocolate'); await act('sauce'); await act('give-1');
  await expect(page.locator('.bubble').nth(1)).toHaveText('No sauce, please!');
  await expect(page.locator('.cone .scoop')).toHaveCount(2);
  await expect(page.locator('.abu')).toHaveAttribute('alt', 'Abu curioso');
  await capture(page, 'festival-devolucao.png');
  await act('sauce'); await act('give-1');
  await expect(page.locator('.festival')).toHaveClass(/complete/);
  await expect(page.locator('.lantern.lit')).toHaveCount(6);
  await fits(page);
  expect(await page.locator('.finish p').evaluate(el => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getClientRects().length;
  })).toBe(1);
  await capture(page, 'festival-constelacao.png');
  await act('next');
  expect(await page.locator('.bubble').allTextContents()).not.toEqual(initial);
  await expect(page.locator('.served')).toHaveCount(0);
  await fits(page);
  await capture(page, 'festival-ronda-2.png');
  const audit = await page.evaluate(() => (window as unknown as { enAudit: {keys: string[]; forbidden: string[]} }).enAudit);
  expect([...new Set(audit.keys)]).toEqual(['eda-proto-en']); expect(audit.forbidden).toEqual([]);
  const metrics = await page.evaluate(() => JSON.parse(localStorage.getItem('eda-proto-en')!));
  expect(metrics.roundsPlayed).toBe(2); expect(metrics.metrics[0].returns).toEqual([0, 1]); expect(metrics.metrics[0].firstMs).toBeGreaterThanOrEqual(0);
  expect(errors).toEqual([]);
});
test('teclado, armazenamento indisponível e movimento reduzido', async ({page}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw Error('indisponível'); };
    Storage.prototype.setItem = () => { throw Error('indisponível'); };
  });
  await page.goto('/prototipos/en/?registo');
  await expect(page.locator('#metrics')).toBeVisible();
  await page.locator('[data-action="mint"]').focus(); await page.keyboard.press('Enter');
  await page.locator('[data-action="chocolate"]').focus(); await page.keyboard.press('Space');
  await expect(page.locator('.cone .scoop')).toHaveCount(2);
  expect(await page.locator('.cone .scoop').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('[data-action="remove"]').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.cone .scoop')).toHaveCount(1);
  await page.locator('[data-action="give-0"]').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.served')).toHaveCount(1);
  await fits(page);
});
test('voz inglesa exclusivamente local e falhas silenciosas', async ({page}) => {
  await page.addInitScript(() => {
    const local = { lang: 'en-GB', localService: true };
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => [{ lang: 'en-US', localService: false }, { lang: 'pt-PT', localService: true }, local],
      addEventListener: () => {}, cancel: () => {},
      speak: () => { throw Error('indisponível'); },
    } });
  });
  await page.goto('/prototipos/en/');
  await expect(page.locator('.speaker')).toHaveCount(2);
  await page.locator('.speaker').first().click();
  await page.locator('[data-action="vanilla"]').click();
  await page.locator('[data-action="give-0"]').click();
  await expect(page.locator('.served')).toHaveCount(1);
  await fits(page);
  await capture(page, 'festival-voz-local.png');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => [{ lang: 'en-GB', localService: false }, { lang: 'pt-PT', localService: true }], addEventListener: () => {},
    } });
  });
  await page.reload();
  await expect(page.locator('.speaker')).toHaveCount(0);
});
