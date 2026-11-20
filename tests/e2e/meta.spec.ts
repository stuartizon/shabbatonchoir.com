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

// What WhatsApp, Facebook and X show when someone shares a page (#16).

const SHARE_IMAGE = 'https://www.shabbatonchoir.com/share.jpg';

for (const { path, title, canonical } of PAGES) {
  test(`page ${path} has a share preview`, async ({ page }) => {
    await page.goto(path);
    const meta = (key: string) =>
      page.locator(`meta[property="${key}"], meta[name="${key}"]`);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');

    await expect(meta('og:title')).toHaveAttribute('content', title);
    await expect(meta('og:description')).toHaveAttribute(
      'content',
      description ?? '',
    );
    await expect(meta('og:url')).toHaveAttribute('content', canonical);
    await expect(meta('og:type')).toHaveAttribute('content', 'website');
    await expect(meta('og:image')).toHaveAttribute('content', SHARE_IMAGE);
    await expect(meta('og:image:width')).toHaveAttribute('content', '1200');
    await expect(meta('og:image:height')).toHaveAttribute('content', '630');
    await expect(meta('og:image:alt')).toHaveAttribute('content', /\S/);
    await expect(meta('twitter:card')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
  });
}

test('the share image is 1200×630', async ({ page }) => {
  const response = await page.goto(new URL(SHARE_IMAGE).pathname);
  expect(response?.status()).toBe(200);
  const size = await page
    .locator('img')
    .evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]);
  expect(size).toEqual([1200, 630]);
});
