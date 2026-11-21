import { expect, test, type Locator } from '@playwright/test';

// Links that show only an icon. Each needs an accessible name, a tap
// target big enough to hit, and a visible focus ring around its icon.
// Targets are 44×44px where there's room. The album icons sit close
// together, so theirs are 44px tall but only as wide as WCAG's 24px minimum
// allows, to keep the spacing the client approved.
const TAP_TARGET = 44;
const MIN_TAP_TARGET = 24;

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
    const outline = await link.locator('svg').evaluate((el) => {
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
    page.locator('footer a:has(svg)'),
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
      MIN_TAP_TARGET,
    );
  }
});

test('the album streaming icons keep their 8px spacing', async ({ page }) => {
  await page.goto('/music');
  const icons = page.locator('main h2').first().locator('..').locator('svg');
  const boxes = await Promise.all(
    (await icons.all()).map((i) => i.boundingBox()),
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
