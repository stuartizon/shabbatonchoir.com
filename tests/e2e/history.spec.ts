import { expect, test } from '@playwright/test';

// On wider screens, History lists its sections beside the text, each
// linking to its heading.
test('lists its sections, linking to each one', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Phones scroll the page instead.');
  await page.goto('/history');
  const nav = page.getByRole('navigation', { name: 'On this page' });
  const headings = await page.locator('main h2').allTextContents();
  await expect(nav.getByRole('link')).toHaveText(headings);
  for (const link of await nav.getByRole('link').all()) {
    const id = (await link.getAttribute('href'))!.replace(/^#/, '');
    await expect(page.locator(`main h2[id="${id}"]`)).toHaveCount(1);
  }
});
