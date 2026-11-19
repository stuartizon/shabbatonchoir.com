import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

for (const { path, heading } of PAGES) {
  test.describe(`page ${path}`, () => {
    test('loads', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });

    test('has a title', async ({ page }) => {
      await page.goto(path);
      // Every page has the same title until #15.
      await expect(page).toHaveTitle(/Shabbaton Choir/);
    });

    test('has exactly one h1', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(heading);
    });

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test('an unknown address shows the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('404');
});

test.describe('navigation', () => {
  for (const { path, heading } of PAGES.filter((p) => p.path !== '/')) {
    test(`reaches ${heading} from the home page`, async ({
      page,
      isMobile,
    }) => {
      await page.goto('/');
      // The off-screen mobile menu is still in the page on desktop, and its
      // toggle is an unlabelled icon. #21 rebuilds it.
      if (isMobile) await page.locator('[data-menu-toggle]').click();
      const menu = page.getByRole(isMobile ? 'navigation' : 'banner');
      await menu.getByRole('link', { name: heading, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.locator('h1')).toHaveText(heading);
    });
  }
});
