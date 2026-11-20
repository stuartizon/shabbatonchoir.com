import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// Screen readers and search engines need to know what language each page,
// and each foreign phrase in it, is written in.

for (const { path } of [...PAGES, { path: '/no-such-page' }]) {
  test(`${path} is in British English`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  });
}

test('marks up the Hebrew in album descriptions', async ({ page }) => {
  await page.goto('/music');
  const hebrew = page.locator('main p span[lang="he"][dir="rtl"]');
  await expect(hebrew).toHaveText(['זצ׳ל']);
});
