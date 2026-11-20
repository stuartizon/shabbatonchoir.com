import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// What search results and browser tabs show for each page (#15).

for (const { path, title, canonical } of PAGES) {
  test.describe(`page ${path}`, () => {
    test('has its own title', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
    });

    // Search results cut descriptions off at about 160 characters.
    test('has a description of up to 160 characters', async ({ page }) => {
      await page.goto(path);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description).toBeTruthy();
      expect(description?.length).toBeLessThanOrEqual(160);
    });

    test('has a canonical link to the live site', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        canonical,
      );
    });
  });
}

test('no two pages share a title or description', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string | null>();
  for (const { path } of PAGES) {
    await page.goto(path);
    titles.add(await page.title());
    descriptions.add(
      await page.locator('meta[name="description"]').getAttribute('content'),
    );
  }
  expect(titles.size).toBe(PAGES.length);
  expect(descriptions.size).toBe(PAGES.length);
});
