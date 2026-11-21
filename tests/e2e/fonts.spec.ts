import { expect, test } from '@playwright/test';

// Headings use Frank Ruhl Libre, served from the site itself. It covers
// Hebrew as well as Latin, so Hebrew titles match the English beside them.
// Body text stays in the system font.

test('headings use Frank Ruhl Libre, loaded from the site', async ({
  page,
}) => {
  await page.goto('/music');
  const heading = page.getByRole('heading', { level: 1 });
  const fontFamily = await heading.evaluate(
    (element) => getComputedStyle(element).fontFamily,
  );
  expect(fontFamily).toMatch(/^'?"?Frank Ruhl Libre/);
  await expect
    .poll(() =>
      page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].some(
          (font) =>
            font.family.includes('Frank Ruhl Libre') &&
            font.status === 'loaded',
        );
      }),
    )
    .toBe(true);
});

test('body text uses the system font', async ({ page }) => {
  await page.goto('/music');
  const text = page.locator('main p').first();
  const fontFamily = await text.evaluate(
    (element) => getComputedStyle(element).fontFamily,
  );
  expect(fontFamily).toMatch(/^ui-sans-serif, system-ui/);
});
