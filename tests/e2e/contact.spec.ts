import { expect, test } from '@playwright/test';

// The contact cards have a shadow but no border, as on the live site. Their
// `border-1` class did nothing in Tailwind 3, which had no such utility, but
// Tailwind 4 turns it into a 1px border.
test('the contact cards have no border', async ({ page }) => {
  await page.goto('/contact');
  const cards = page.locator('main .shadow-md');
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('border-top-width', '0px');
  }
});
