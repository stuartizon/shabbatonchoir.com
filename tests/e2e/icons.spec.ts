import { expect, test, type Locator } from '@playwright/test';
import { PAGES } from './pages';

// Each icon is an inline SVG named by its data-icon attribute. Icons are
// 1em square, so their size follows the text around them (main text is 18px).
const icons = (scope: Locator) => scope.locator('svg[data-icon]');

async function expectIcons(scope: Locator, names: string[], size: number) {
  await expect(icons(scope)).toHaveCount(names.length);
  for (const [i, name] of names.entries()) {
    const icon = icons(scope).nth(i);
    await expect(icon).toHaveAttribute('data-icon', name);
    // Icons are decorative: the links around them carry the names.
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    const box = await icon.boundingBox();
    expect(box?.height).toBe(size);
    expect(box?.width).toBe(size);
  }
}

test('the footer shows the social and streaming icons', async ({ page }) => {
  await page.goto('/');
  await expectIcons(
    page.locator('footer'),
    ['facebook', 'x', 'youtube', 'spotify', 'apple-music', 'amazon'],
    32,
  );
});

test('each album shows its streaming icons', async ({ page }) => {
  await page.goto('/music');
  const albums = page.locator('main h2').locator('..');
  await expect(albums).toHaveCount(6);
  for (const album of await albums.all()) {
    await expectIcons(album, ['spotify', 'apple-music', 'amazon'], 18);
  }
});

test('the contact page shows email and message icons', async ({ page }) => {
  await page.goto('/contact');
  await expectIcons(page.locator('main'), ['envelope', 'chat'], 36);
});

test('the mobile menu toggle shows a menu icon', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu toggle only shows on small screens.');
  await page.goto('/');
  await expectIcons(page.locator('[data-menu-toggle]'), ['menu'], 32);
});

for (const { path } of PAGES) {
  test(`${path} uses no Font Awesome markup or styles`, async ({ page }) => {
    await page.goto(path);
    expect(await page.content()).not.toContain('svg-inline--fa');
    const css = await page.evaluate(() =>
      [...document.styleSheets]
        .flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText))
        .join('\n'),
    );
    expect(css).not.toContain('svg-inline--fa');
  });
}
