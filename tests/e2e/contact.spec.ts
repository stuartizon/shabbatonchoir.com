import { expect, test } from '@playwright/test';

// The Contact page: one card for each kind of enquiry, each with a single
// email button, then the choir's Facebook and X accounts.
const TAP_TARGET = 44;

const EMAIL_OPTIONS = [
  { heading: 'Join the choir', address: 'md@shabbatonchoir.com' },
  {
    heading: 'Mailing list and bookings',
    address: 'chairman@shabbatonchoir.com',
  },
];

test('the page shows the client’s contact text', async ({ page }) => {
  await page.goto('/contact');
  const main = page.locator('main');
  await expect(main).toContainText(
    'If you are interested in joining the Shabbaton Choir as a chorister, please contact our Musical Director, Harry Style.',
  );
  await expect(main).toContainText('We rehearse on most Tuesday evenings.');
  await expect(main).toContainText(
    'If you would like to be added to our mailing list or to engage us for a concert or choral Shabbaton, please contact our Chairman, Russell Kett.',
  );
});

for (const { heading, address } of EMAIL_OPTIONS) {
  test(`the ${heading} card emails ${address}`, async ({ page }) => {
    await page.goto('/contact');
    const card = page
      .locator('main li')
      .filter({ has: page.getByRole('heading', { name: heading }) });
    const link = card.getByRole('link');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName(`Email ${address}`);
    await expect(link).toHaveAttribute('href', `mailto:${address}`);
    // An email link opens the mail app, so a new tab would only be left
    // empty.
    await expect(link).not.toHaveAttribute('target');

    const box = await link.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(TAP_TARGET);
  });

  test(`tapping anywhere on the ${heading} card opens its email link`, async ({
    page,
  }) => {
    await page.goto('/contact');
    const card = page
      .locator('main li')
      .filter({ has: page.getByRole('heading', { name: heading }) });
    const box = (await card.boundingBox())!;
    // Near the card's top-left corner, inside its rounding and well away
    // from the button.
    const href = await page.evaluate(
      ([x, y]) =>
        document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'),
      [box.x + 24, box.y + 24],
    );
    expect(href).toBe(`mailto:${address}`);
  });
}

test('the email buttons fill the width of the card on phones', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Wider screens show the button at its own width.');
  await page.goto('/contact');
  for (const { heading } of EMAIL_OPTIONS) {
    const card = page
      .locator('main li')
      .filter({ has: page.getByRole('heading', { name: heading }) });
    const body = card.locator('[data-card-body]');
    const bodyBox = (await body.boundingBox())!;
    const linkBox = (await card.getByRole('link').boundingBox())!;
    const padding = await body.evaluate((el) =>
      parseFloat(getComputedStyle(el).paddingLeft),
    );
    // The width of the card's text, inside its padding.
    expect(linkBox.width).toBeCloseTo(bodyBox.width - 2 * padding, 0);
  }
});

test.describe('on the narrowest phones', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('the email addresses fit inside their buttons', async ({ page }) => {
    await page.goto('/contact');
    for (const { address } of EMAIL_OPTIONS) {
      const link = page.getByRole('link', { name: `Email ${address}` });
      const fits = await link.evaluate(
        (el) => el.scrollWidth <= el.clientWidth,
      );
      expect(fits, address).toBe(true);
    }
  });
});

test('the page no longer offers Facebook Messenger', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('main a[href*="m.me"]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Messenger');
});

test('the page no longer offers a general enquiries address', async ({
  page,
}) => {
  await page.goto('/contact');
  await expect(page.locator('main')).not.toContainText('info@');
});

for (const { name, href } of [
  {
    name: 'Become a fan of the Shabbaton Choir on Facebook',
    href: 'https://www.facebook.com/shabbatonchoir',
  },
  {
    name: 'Follow the Shabbaton Choir on X',
    href: 'https://x.com/shabbatonchoir',
  },
]) {
  test(`the page links to “${name}”`, async ({ page }) => {
    await page.goto('/contact');
    const link = page.locator('main').getByRole('link', { name });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    const box = await link.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(TAP_TARGET);
  });
}

test.describe('on a phone, where the Facebook line wraps', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('each Follow us icon is centred on the first line of its text', async ({
    page,
  }) => {
    await page.goto('/contact');
    for (const name of [
      'Become a fan of the Shabbaton Choir on Facebook',
      'Follow the Shabbaton Choir on X',
    ]) {
      const link = page.locator('main').getByRole('link', { name });
      const { icon, firstLine, lines } = await link.evaluate((el) => {
        const svg = el.querySelector('svg')!.getBoundingClientRect();
        const text = [...el.childNodes].find(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent!.trim(),
        )!;
        const range = document.createRange();
        range.selectNodeContents(text);
        const rects = [...range.getClientRects()];
        const tops = new Set(rects.map((rect) => Math.round(rect.top)));
        return {
          icon: svg.top + svg.height / 2,
          firstLine: rects[0].top + rects[0].height / 2,
          lines: tops.size,
        };
      });
      if (name.includes('Facebook')) expect(lines).toBeGreaterThan(1);
      expect(Math.abs(icon - firstLine), name).toBeLessThanOrEqual(1);
    }
  });
});
