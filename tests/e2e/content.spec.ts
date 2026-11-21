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
  await expect(main.locator('p').first()).toContainText(
    'The current Musical Director is Harry Style.',
  );
  await expect(main.locator('p').first()).toContainText(
    'is the raison d’être of the Shabbaton Choir.',
  );
  await expect(main.locator(':is(b, strong)')).toHaveText([
    'Harry Style',
    'raison d’être',
  ]);
  await expect(main).not.toContainText('Fingerhut');
  await expect(main).toContainText(
    'registered in England and Wales under number 1058256.',
  );
});

test('history page text', async ({ page }) => {
  await page.goto('/history');
  const main = page.locator('main');
  await expect(main.locator('h2')).toHaveText([
    'Musical Directors',
    'Solidarity Through Song',
    'Tours and commemorations',
    '25th anniversary',
    'Recordings',
  ]);
  await expect(main.locator('p')).toHaveCount(11);
  await expect(main.locator(':is(b, strong)')).toHaveText([
    'B’nai Brith Festival Singers',
    'Choral Midnight Selichot',
    'Shabbaton Choir',
    'Choral Shabbaton',
    '“Solidarity Through Song”',
  ]);
  await expect(main).toContainText('the "Nusach" - traditional');
  await expect(main).toContainText('Lionel & Stephen found');
  await expect(main).toContainText('Stephen Glass conducted a Choral Midnight');
  await expect(main).toContainText('and, since 2003, by Jonny Turgel.');
  await expect(main).not.toContainText('thirteen years');
  // The "raison d'être" paragraph is on Home only.
  await expect(main).not.toContainText('raison');
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
  await expect(main).toContainText(
    'Harry joined the Shabbaton Choir as musical director in 2022',
  );
  await expect(main).not.toContainText('Fingerhut');
  await expect(main).toContainText("Stephen's music on his website");
  await expect(
    main.getByRole('link', { name: 'http://www.stephenleveymusic.com' }),
  ).toHaveAttribute('href', 'http://www.stephenleveymusic.com');
});
