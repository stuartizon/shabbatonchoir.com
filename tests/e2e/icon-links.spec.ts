import { expect, test, type Locator } from '@playwright/test';

// Links that show only an icon (#22). Each needs an accessible name, a tap
// target of at least 44×44px and a visible focus style.
const MIN_TAP_TARGET = 44;

async function expectIconLinks(links: Locator, names: string[]) {
  await expect(links).toHaveCount(names.length);
  for (const [i, name] of names.entries()) {
    const link = links.nth(i);
    await expect(link).toHaveAccessibleName(name);

    const box = await link.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(MIN_TAP_TARGET);
    expect(box?.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET);

    await link.focus();
    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).toBe('solid');
    expect(outline.width).toBe('2px');
  }
}

test('the footer icon links are named and easy to tap', async ({ page }) => {
  await page.goto('/');
  await expectIconLinks(
    page.locator('footer a'),
    ['Facebook', 'X', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music'].map(
      (service) => `Shabbaton Choir on ${service}`,
    ),
  );
});

test('the album streaming links are named and easy to tap', async ({
  page,
}) => {
  await page.goto('/music');
  const albums = page.locator('main h2').locator('..');
  await expect(albums).toHaveCount(6);
  for (const album of await albums.all()) {
    const name = await album.locator('h2').innerText();
    await expectIconLinks(
      album.locator('a'),
      ['Spotify', 'Apple Music', 'Amazon Music'].map(
        (service) => `Listen to ${name} on ${service}`,
      ),
    );
  }
});
