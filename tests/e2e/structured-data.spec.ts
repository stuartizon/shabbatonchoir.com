import { expect, test, type Page } from '@playwright/test';

// The JSON-LD that tells search engines about the choir, the charity and
// its albums.

type Node = Record<string, unknown>;

const SITE = 'https://www.shabbatonchoir.com/';
const CHOIR_ID = `${SITE}#choir`;

// Every JSON-LD node on the page, flattening any @graph.
async function structuredData(page: Page): Promise<Node[]> {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return blocks.flatMap((text) => {
    const data = JSON.parse(text) as Node;
    expect(data['@context']).toBe('https://schema.org');
    return (data['@graph'] as Node[] | undefined) ?? [data];
  });
}

const types = (node: Node) => [node['@type']].flat();

test.describe('home page', () => {
  test('describes the choir as a music group and a charity', async ({
    page,
  }) => {
    await page.goto('/');
    const choir = (await structuredData(page)).find(
      (node) => node['@id'] === CHOIR_ID,
    );
    expect(choir).toBeDefined();
    expect(types(choir!)).toEqual(['MusicGroup', 'NGO']);
    expect(choir).toMatchObject({
      name: 'Shabbaton Choir',
      url: SITE,
      logo: `${SITE}logo.svg`,
      foundingDate: '1990',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'Charity Commission for England and Wales charity number',
        value: '1058256',
      },
    });
  });

  test('links the choir to its social and streaming accounts', async ({
    page,
  }) => {
    await page.goto('/');
    const choir = (await structuredData(page)).find(
      (node) => node['@id'] === CHOIR_ID,
    );
    const footerLinks = await page
      .locator('footer a[aria-label][href^="https://"]')
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
    expect(choir?.sameAs).toEqual(footerLinks);
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  test('the logo it names exists', async ({ page }) => {
    const response = await page.request.get('/logo.svg');
    expect(response.status()).toBe(200);
  });
});

test.describe('music page', () => {
  test('describes each album it lists', async ({ page }) => {
    await page.goto('/music');
    const names = await page.locator('main h2').allTextContents();
    const albums = (await structuredData(page)).filter((node) =>
      types(node).includes('MusicAlbum'),
    );
    expect(albums.map((album) => album.name)).toEqual(names);
  });

  test('gives each album its year, cover, artist and streaming links', async ({
    page,
  }) => {
    await page.goto('/music');
    const albums = (await structuredData(page)).filter((node) =>
      types(node).includes('MusicAlbum'),
    );
    expect(albums.length).toBeGreaterThan(0);
    for (const album of albums) {
      const card = page.locator('main article').filter({
        has: page.getByRole('heading', {
          name: album.name as string,
          exact: true,
        }),
      });
      const year = await card.locator('[data-year]').textContent();
      expect(album.datePublished).toBe(year);

      const streaming = await card
        .getByRole('link')
        .evaluateAll((links) =>
          links.map((a) => (a as HTMLAnchorElement).href),
        );
      expect(album.sameAs).toEqual(streaming);

      expect(album.byArtist).toMatchObject({
        '@type': 'MusicGroup',
        '@id': CHOIR_ID,
        name: 'Shabbaton Choir',
        url: SITE,
      });

      // The cover is a full address on the live site, at a path this build
      // serves.
      const image = new URL(album.image as string);
      expect(image.origin).toBe(new URL(SITE).origin);
      const response = await page.request.get(image.pathname);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^image\//);
    }
  });
});
