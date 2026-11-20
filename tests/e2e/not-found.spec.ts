import { expect, test } from '@playwright/test';

// Cloudflare Pages serves 404.html, with a 404 status, for any address the
// site doesn't have. It should look like the rest of the site and offer a
// way back in.

const MISSING = '/no-such-page';

test('an unknown address answers with a 404 status', async ({ page }) => {
  const response = await page.goto(MISSING);
  expect(response?.status()).toBe(404);
});

test('the 404 page says the page was not found', async ({ page }) => {
  await page.goto(MISSING);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page).toHaveTitle('Page not found · Shabbaton Choir');
});

test('the 404 page has the site header and footer', async ({ page }) => {
  await page.goto(MISSING);
  await expect(
    page.getByRole('banner').filter({ visible: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('footer')).toBeAttached();
});

test('the 404 page links back to Home, Music and Contact', async ({ page }) => {
  await page.goto(MISSING);
  const main = page.getByRole('main');
  for (const [name, href] of [
    ['Home', '/'],
    ['Music', '/music'],
    ['Contact', '/contact'],
  ]) {
    await expect(main.getByRole('link', { name, exact: true })).toHaveAttribute(
      'href',
      href,
    );
  }
});

test('the 404 page is kept out of search results', async ({ page }) => {
  await page.goto(MISSING);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
});

test('the 404 page has no horizontal scroll', async ({ page }) => {
  await page.goto(MISSING);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
