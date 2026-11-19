import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// Images used to be nearly all of the page weight: a 4.4 MB hero and covers
// of up to 2.7 MB (#14). Keep first loads light, on phones and desktops.
const IMAGE_BUDGET = 500 * 1024;
const IMAGE_FILE = /\.(avif|webp|jpe?g|png|gif|svg)$/;

for (const { path } of PAGES) {
  test(`${path} loads no more than 500 KB of images`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    const bytes = await page.evaluate((pattern) => {
      const isImage = new RegExp(pattern);
      return performance
        .getEntriesByType('resource')
        .filter((entry) => isImage.test(new URL(entry.name).pathname))
        .reduce(
          (total, entry) =>
            total + (entry as PerformanceResourceTiming).encodedBodySize,
          0,
        );
    }, IMAGE_FILE.source);
    expect(bytes).toBeGreaterThan(0);
    expect(bytes).toBeLessThanOrEqual(IMAGE_BUDGET);
  });
}

test.describe('home page hero', () => {
  // The hero is decorative, so it has empty alt text.
  const hero = (page: import('@playwright/test').Page) =>
    page.locator('[data-hero] > picture img').filter({ visible: true });

  test('is an image the browser loads first', async ({ page }) => {
    await page.goto('/');
    await expect(hero(page)).toHaveAttribute('fetchpriority', 'high');
    await expect(hero(page)).toHaveAttribute('loading', 'eager');
    await expect(hero(page)).toHaveAttribute('alt', '');
  });

  test('is served in a modern format at a sensible size', async ({ page }) => {
    await page.goto('/');
    await expect
      .poll(() => hero(page).evaluate((img: HTMLImageElement) => img.complete))
      .toBe(true);
    const { src, naturalWidth } = await hero(page).evaluate(
      (img: HTMLImageElement) => ({
        src: img.currentSrc,
        naturalWidth: img.naturalWidth,
      }),
    );
    expect(new URL(src).pathname).toMatch(/\.(avif|webp)$/);
    expect(naturalWidth).toBeGreaterThan(0);
    expect(naturalWidth).toBeLessThanOrEqual(2000);
  });

  test('is preloaded', async ({ page }) => {
    await page.goto('/');
    const preload = page.locator('head link[rel="preload"][as="image"]');
    await expect(preload).toHaveCount(1);
    await expect(preload).toHaveAttribute('imagesrcset', /\.avif \d+w/);
    await expect(preload).toHaveAttribute('fetchpriority', 'high');
  });

  test('is not preloaded on other pages', async ({ page }) => {
    await page.goto('/music');
    await expect(
      page.locator('head link[rel="preload"][as="image"]'),
    ).toHaveCount(0);
  });
});
