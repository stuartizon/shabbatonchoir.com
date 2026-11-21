import { expect, test, type Locator } from '@playwright/test';

// Links that show only an icon. Each needs an accessible name, a tap
// target big enough to hit, and a visible focus ring around it.
// Targets are 44×44px.
const TAP_TARGET = 44;

async function expectIconLinks(
  links: Locator,
  names: string[],
  minWidth = TAP_TARGET,
) {
  await expect(links).toHaveCount(names.length);
  for (const [i, name] of names.entries()) {
    const link = links.nth(i);
    await expect(link).toHaveAccessibleName(name);

    const box = await link.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(minWidth);
    expect(box?.height).toBeGreaterThanOrEqual(TAP_TARGET);

    await link.focus();
    // The ring is drawn by the link, or for a bare icon by the icon.
    const outlines = await link.evaluate((el) =>
      [el, el.querySelector('svg')!].map((part) => {
        const style = getComputedStyle(part);
        return { style: style.outlineStyle, width: style.outlineWidth };
      }),
    );
    const outline =
      outlines.find(({ style }) => style !== 'none') ?? outlines[0];
    expect(outline.style).toBe('solid');
    expect(outline.width).toBe('2px');
  }
}

test('the footer icon links are named and easy to tap', async ({ page }) => {
  await page.goto('/');
  await expectIconLinks(
    page.locator('footer a[aria-label]'),
    ['Facebook', 'X', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music'].map(
      (service) => `Shabbaton Choir on ${service}`,
    ),
  );
});

test('the album streaming links are named and easy to tap', async ({
  page,
}) => {
  await page.goto('/music');
  const albums = page.locator('main article');
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

test('the album streaming buttons are 8px apart', async ({ page }) => {
  await page.goto('/music');
  const links = page.locator('main article').first().locator('a');
  const boxes = await Promise.all(
    (await links.all()).map((link) => link.boundingBox()),
  );
  for (let i = 1; i < boxes.length; i++) {
    const gap = boxes[i]!.x - (boxes[i - 1]!.x + boxes[i - 1]!.width);
    expect(gap).toBeCloseTo(8, 0);
  }
});

// Twitter is now X, so link to x.com rather than relying on the twitter.com
// redirect.
test('the footer X link points to x.com', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Shabbaton Choir on X' }),
  ).toHaveAttribute('href', 'https://x.com/shabbatonchoir');
});
