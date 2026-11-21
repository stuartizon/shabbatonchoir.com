import { expect, test } from '@playwright/test';

// The albums as they appear on the Music page, newest first.
// Hebrew titles are taken from the covers, for the client to confirm.
const ALBUMS = [
  { name: 'Mi Sheberach', year: '2021', hasDescription: true },
  {
    name: "Anim Z'mirot",
    hebrew: 'אנעים זמירות',
    year: '2016',
    hasDescription: true,
  },
  { name: 'Shabbaton Sings Reuth', year: '2011', hasDescription: false },
  { name: 'Bilvavi', hebrew: 'בלבבי', year: '2006', hasDescription: true },
  { name: 'Shir Chadash', year: '2003', hasDescription: true },
  {
    name: 'Selichot Live',
    hebrew: 'סליחות',
    year: '2001',
    hasDescription: true,
  },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/music');
});

test('lists the albums newest first', async ({ page }) => {
  await expect(page.locator('main h2')).toHaveText(ALBUMS.map((a) => a.name));
});

for (const { name, hebrew, year, hasDescription } of ALBUMS) {
  test.describe(`album ${name}`, () => {
    const album = (page: import('@playwright/test').Page) =>
      page.locator('main article').filter({
        has: page.getByRole('heading', { name, exact: true }),
      });

    test('shows its year', async ({ page }) => {
      await expect(album(page).getByText(year, { exact: true })).toBeVisible();
    });

    test('shows its cover', async ({ page }) => {
      const cover = album(page).getByRole('img', { name, exact: true });
      // Covers load lazily, so bring each one into view first.
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toBeVisible();
      await expect
        .poll(() => cover.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
    });

    // Covers show at up to 360px wide, so they're served at no more than twice
    // that for retina screens, in a modern format, and only when needed.
    test('serves its cover small, modern and lazily', async ({ page }) => {
      const cover = album(page).getByRole('img', { name, exact: true });
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toHaveAttribute('loading', 'lazy');
      await expect(cover).toHaveAttribute('width', /^\d+$/);
      await expect(cover).toHaveAttribute('height', /^\d+$/);
      await expect
        .poll(() => cover.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      const { src, naturalWidth } = await cover.evaluate(
        (img: HTMLImageElement) => ({
          src: img.currentSrc,
          naturalWidth: img.naturalWidth,
        }),
      );
      expect(new URL(src).pathname).toMatch(/\.(avif|webp)$/);
      expect(naturalWidth).toBeLessThanOrEqual(720);
    });

    test(`${hebrew ? 'shows' : 'has no'} a Hebrew title`, async ({ page }) => {
      const title = album(page).locator('[lang="he"]:not(p *)');
      if (hebrew) {
        await expect(title).toHaveText(hebrew);
        await expect(title).toHaveAttribute('dir', 'rtl');
      } else {
        await expect(title).toHaveCount(0);
      }
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
      const description = album(page).locator('p:not([data-year])');
      const text = (await description.allTextContents()).join('');
      expect(text.trim().length > 0).toBe(hasDescription);
    });
  });
}
