import { expect, test } from '@playwright/test';

// Spot checks that page text survives being moved around, including its
// bold text, headings, links and straight quotes.

test('home page text', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main.locator('p')).toHaveCount(3);
  await expect(main.locator('p').first()).toContainText(
    "out of the B'nei Brith Festival Singers",
  );
  await expect(main).toContainText(
    'registered in England and Wales under Number 1058256.',
  );
});

test('history page text', async ({ page }) => {
  await page.goto('/history');
  const main = page.locator('main');
  await expect(main.locator('p')).toHaveCount(5);
  await expect(main.locator(':is(b, strong)')).toHaveText([
    'B’nai Brith Festival Singers',
    'Choral Midnight Selichot',
    'Shabbaton Choir',
    'Choral Shabbaton',
    '"Solidarity Through Song"',
    'raison d’etre',
  ]);
  await expect(main).toContainText('the "Nusach" - traditional');
  await expect(main).toContainText('Lionel & Stephen found');
  await expect(main).toContainText('Stephen Glass conducted a Choral Midnight');
});

test('leadership page text', async ({ page }) => {
  await page.goto('/leadership');
  const main = page.locator('main');
  await expect(main.locator('h2')).toHaveText([
    'Musical Director',
    'Conductor Laureate',
  ]);
  await expect(main.locator('p')).toHaveCount(5);
  await expect(main).toContainText('"Solidarity Through Song" mission');
  await expect(main).toContainText("Stephen's music on his website");
  await expect(
    main.getByRole('link', { name: 'http://www.stephenleveymusic.com' }),
  ).toHaveAttribute('href', 'http://www.stephenleveymusic.com');
});
