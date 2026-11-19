import { expect, test } from '@playwright/test';

// The albums as they appear on the Music page, newest first.
const ALBUMS = [
  { name: 'Mi Sheberach', year: '2021', hasDescription: true },
  { name: "Anim Z'mirot", year: '2016', hasDescription: true },
  { name: 'Shabbaton Sings Reuth', year: '2011', hasDescription: false },
  { name: 'Bilvavi', year: '2006', hasDescription: true },
  { name: 'Shir Chadash', year: '2003', hasDescription: true },
  { name: 'Selichot Live', year: '2001', hasDescription: true },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/music');
});

test('lists the albums newest first', async ({ page }) => {
  await expect(page.locator('main h2')).toHaveText(ALBUMS.map((a) => a.name));
});

for (const { name, year, hasDescription } of ALBUMS) {
  test.describe(`album ${name}`, () => {
    const album = (page: import('@playwright/test').Page) =>
      page.locator('main > div > div > div').filter({
        has: page.getByRole('heading', { name, exact: true }),
      });

    test('shows its year', async ({ page }) => {
      await expect(album(page).getByText(year, { exact: true })).toBeVisible();
    });

    test('shows its cover', async ({ page }) => {
      const cover = album(page).getByRole('img', { name, exact: true });
      await expect(cover).toBeVisible();
      const width = await cover.evaluate(
        (img: HTMLImageElement) => img.naturalWidth,
      );
      expect(width).toBeGreaterThan(0);
    });

    // Covers show at 320px wide, so they're served at no more than twice
    // that for retina screens, in a modern format, and only when needed (#14).
    test('serves its cover small, modern and lazily', async ({ page }) => {
      const cover = album(page).getByRole('img', { name, exact: true });
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toHaveAttribute('loading', 'lazy');
      await expect(cover).toHaveAttribute('width', /^\d+$/);
      await expect(cover).toHaveAttribute('height', /^\d+$/);
      const { src, naturalWidth } = await cover.evaluate(
        (img: HTMLImageElement) => ({
          src: img.currentSrc,
          naturalWidth: img.naturalWidth,
        }),
      );
      expect(new URL(src).pathname).toMatch(/\.(avif|webp)$/);
      expect(naturalWidth).toBeLessThanOrEqual(640);
    });

    test('links to Spotify, Apple Music and Amazon', async ({ page }) => {
      const hrefs = await album(page)
        .locator('a')
        .evaluateAll((links: HTMLAnchorElement[]) =>
          links.map((a) => new URL(a.href).hostname),
        );
      expect(hrefs).toHaveLength(3);
      expect(hrefs[0]).toMatch(/spotify\.com$/);
      expect(hrefs[1]).toMatch(/(itunes|music)\.apple\.com$/);
      expect(hrefs[2]).toMatch(/amazon\.co\.uk$/);
    });

    test(`${hasDescription ? 'has' : 'has no'} description`, async ({
      page,
    }) => {
      const text = (await album(page).locator('p').textContent()) ?? '';
      expect(text.trim().length > 0).toBe(hasDescription);
    });

    // The site's own heading and paragraph styles must not override the
    // utility classes that tighten the album's spacing (#44).
    test('keeps its tight title and description spacing', async ({ page }) => {
      await expect(album(page).locator('h2')).toHaveCSS('margin-top', '16px');
      await expect(album(page).locator('p')).toHaveCSS('margin-top', '8px');
    });
  });
}
