import { expect, test } from '@playwright/test';

// On the old Next.js site, next/image wrapped the logo in an inline-block
// span, so it sat on the text baseline with the descender gap below it. That
// gap sets the header's spacing: the mobile header's height and where the
// desktop logo sits. Tailwind's preflight makes a plain img a block, which
// drops the gap, so the logo must stay inline to match the live site.
test('the logo sits on the text baseline, as on the live site', async ({
  page,
}) => {
  await page.goto('/music');
  const link = page.locator('header a:has(img[alt="Shabbaton Choir"]):visible');
  const linkBox = await link.boundingBox();
  const logoBox = await link.locator('img').boundingBox();
  expect(logoBox?.height).toBeCloseTo(59, 0);
  expect(linkBox!.height).toBeGreaterThan(logoBox!.height + 2);
});

// On wider screens the header's links mark the page you're on, for sighted
// visitors with an underline and for screen readers with aria-current.
test.describe('desktop navigation', () => {
  test.skip(
    ({ isMobile }) => isMobile,
    'The desktop header is for wide screens.',
  );

  for (const { path, label } of [
    { path: '/', label: 'Home' },
    { path: '/music', label: 'Music' },
    { path: '/contact', label: 'Contact' },
  ]) {
    test(`marks ${label} as the current page on ${path}`, async ({ page }) => {
      await page.goto(path);
      const nav = page.getByRole('navigation', { name: 'Main' });
      await expect(nav.locator('[aria-current="page"]')).toHaveText(label, {
        ignoreCase: true,
      });
    });
  }
});
