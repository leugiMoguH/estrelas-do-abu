import { test, expect } from '@playwright/test';
test('Estudar os erros reproduz a ref e só usa o template falhado', async ({ page }) => {
 await page.goto('/');
 await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();
 await page.getByRole('button',{name:/Vamos ao centro/}).click();
 await page.locator('[data-target="matematica"]').click();
 await page.getByRole('button',{name:'Limpar',exact:true}).click();
 await page.locator('[data-focus-id="section-mat-sec-mmc-mdc"]').check();
 await page.getByRole('button',{name:'Começar a estudar',exact:true}).click();
 const prompt = await page.locator('.question h2').textContent();
 await page.locator('.answer-editor input').first().fill('-99999');
 await page.getByRole('button',{name:'Verificar',exact:true}).click();
 await expect(page.locator('.feedback')).toHaveClass(/is-wrong/);
 await page.getByRole('button',{name:'Tentar de novo',exact:true}).click();
 const [a, b] = prompt!.match(/\d+/g)!.map(Number) as [number, number];
 const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : x;
 const correct = prompt!.includes('mmc') ? a / gcd(a, b) * b : gcd(a, b);
 await page.locator('.answer-editor input').first().fill(String(correct));
 await page.getByRole('button',{name:'Verificar',exact:true}).click();
 await expect(page.locator('.feedback')).toHaveClass(/is-right/);
 await page.getByRole('button',{name:/Voltar/}).first().click();
 await page.getByRole('button',{name:'Voltar à sala',exact:true}).click();
 await page.getByRole('button',{name:'Estudar os erros',exact:true}).click();
 await expect(page.locator('.question h2')).toHaveText(prompt!);
 for (let i = 0; i < 3; i++) {
   await page.locator('.answer-editor input').first().fill('-99999');
   await page.getByRole('button',{name:'Verificar',exact:true}).click();
   if (i < 2) await page.getByRole('button',{name:'Próxima pergunta',exact:true}).click();
 }
 await expect.poll(async () => page.evaluate(() => {
   const save = JSON.parse(localStorage.getItem('eda:save:v2')!);
   return save.seen.length;
 })).toBe(4);
 const refs: { templateId: string; seed: number; difficulty: number }[] = await page.evaluate(() => JSON.parse(localStorage.getItem('eda:save:v2')!).seen.map((s: {ref: unknown}) => s.ref));
 expect(refs[1]).toEqual(refs[0]);
 expect(new Set(refs.map(ref => ref.templateId)).size).toBe(1);
});
test('Matemática: escolher um subcapítulo novo, responder e voltar', async ({ page }) => {
 await page.goto('/');
 await page.getByRole('button',{name:/Jogar/}).first().click();
 await page.getByRole('button',{name:/Surpreende/}).click();
 await page.getByRole('button',{name:/Vamos ao centro/}).click();
 await page.locator('[data-target="matematica"]').click();
 await page.getByRole('button',{name:'Limpar',exact:true}).click();
 const pending=page.locator('[data-focus-id="section-mat-sec-calculo-mental"]');
 await expect(pending).toBeDisabled();
 await expect(pending.locator('..')).toContainText('Em preparação');
 await page.locator('[data-focus-id="section-mat-sec-mmc-mdc"]').check();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.getByRole('button',{name:'Começar a estudar',exact:true}).click();
 for(const input of await page.locator('.answer-editor input').all()) await input.fill('12');
 await page.getByRole('button',{name:'Verificar',exact:true}).click();
 await expect(page.locator('.feedback')).not.toBeEmpty();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.getByRole('button',{name:/Voltar/}).first().click();
 await page.getByRole('button',{name:'Voltar à sala',exact:true}).click();
 await expect(page.locator('[data-focus-id="section-mat-sec-mmc-mdc"]')).toBeChecked();
});
