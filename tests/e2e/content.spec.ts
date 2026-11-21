import { expect, test } from '@playwright/test';

// Spot checks that page text survives being moved around, including its
// bold text, headings, links and straight quotes.

test('home page text', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main.locator('p')).toHaveCount(4);
  await expect(main.locator('p').first()).toContainText(
    "out of the B'nai Brith Festival Singers",
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
  const charityLink = main.getByRole('link', { name: '1058256' });
  await expect(charityLink).toHaveAttribute(
    'href',
    'https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/1058256',
  );
  await expect(charityLink).toHaveAttribute('target', '_blank');
});

// The client asked for a link to the safeguarding policy at the bottom of
// the site. It is the last paragraph of Home.
test('home page links to the safeguarding policy', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const link = page
    .locator('main p')
    .last()
    .getByRole('link', { name: 'safeguarding policy' });
  await expect(link).toHaveAttribute('href', '/safeguarding-policy.pdf');
  const response = await request.get('/safeguarding-policy.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
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
  const leveyLink = main.getByRole('link', {
    name: 'https://www.stephenleveymusic.com',
  });
  await expect(leveyLink).toHaveAttribute(
    'href',
    'https://www.stephenleveymusic.com',
  );
  await expect(leveyLink).toHaveAttribute('target', '_blank');
  await expect(leveyLink).toHaveAttribute('rel', 'noreferrer');
});
