import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

for (const { path, heading } of PAGES) {
  test.describe(`page ${path}`, () => {
    test('loads', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
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

test.describe('navigation', () => {
  for (const { path, heading } of PAGES.filter((p) => p.path !== '/')) {
    test(`reaches ${heading} from the home page`, async ({
      page,
      isMobile,
    }) => {
      await page.goto('/');
      if (isMobile) {
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
      }
      const menu = isMobile
        ? page.getByRole('navigation', { name: 'Main', exact: true })
        : page.getByRole('banner');
      await menu.getByRole('link', { name: heading, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.locator('h1')).toHaveText(heading);
    });
  }
});
