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
  await expect(main.locator('h2')).toHaveText([
    'Founding',
    'Musical Directors',
    'Solidarity Through Song',
    'Tours and commemorations',
    '25th anniversary',
    'Recordings',
  ]);
  await expect(main.locator('p')).toHaveCount(12);
  await expect(main.locator(':is(b, strong)')).toHaveText([
    'B’nai Brith Festival Singers',
    'Choral Midnight Selichot',
    'Shabbaton Choir',
    'Choral Shabbaton',
    'raison d’être',
    '“Solidarity Through Song”',
  ]);
  await expect(main).toContainText('the "Nusach" - traditional');
  await expect(main).toContainText('Lionel & Stephen found');
  await expect(main).toContainText('Stephen Glass conducted a Choral Midnight');
  await expect(main).toContainText('and, since 2003, by Jonny Turgel.');
  await expect(main).not.toContainText('thirteen years');
  await expect(main).toContainText(
    'The Choir is now under the baton of Harry Style',
  );
  await expect(main).toContainText('80th anniversary of the liberation');
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
