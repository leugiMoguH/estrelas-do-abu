import { test, expect } from '@playwright/test';

test('teclado mantém foco na criação e nas escolhas da sala', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button',{name:/Jogar/}).first().click();
 const random=page.getByRole('button',{name:/Surpreende/});
 await random.focus(); await page.keyboard.press('Enter'); await expect(random).toBeFocused();
 for (const id of ['skin-clara','tab-Roupa','shoes-shoes-brancas','tab-Acessórios','accessory-none','glasses-none','hat-none','backpack-none','tab-Roupa','outer-none']) {
  const control=page.locator(`[data-focus-id="${id}"]`);
  await control.focus(); await page.keyboard.press('Enter'); await expect(control).toBeFocused();
  await expect(control).toHaveAttribute('aria-pressed','true');
 }
 await page.getByRole('button',{name:/Vamos ao centro/}).click();
 await page.locator('[data-target="matematica"]').click();
 // Bloco B: a sala de Matemática usa a árvore de subcapítulos (caixas de seleção); o foco mantém-se após escolher.
 const chapter=page.locator('[data-focus-id="chapter-mat-geometria"]');
 await chapter.focus(); await page.keyboard.press('Enter'); await expect(chapter).toBeFocused();
 const section=page.locator('[data-focus-id="section-mat-sec-circulo"]');
 await section.focus(); await page.keyboard.press('Space'); await expect(section).toBeFocused(); await expect(section).toBeChecked();
 for (const id of ['mode-test','mode-study','count-3']) {
  const control=page.locator(`[data-focus-id="${id}"]`);
  await control.focus(); await page.keyboard.press('Enter'); await expect(control).toBeFocused();
 }
});
