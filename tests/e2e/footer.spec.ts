import { expect, test, type Page } from '@playwright/test';

// The social footer is an ordinary footer at the end of the page: it doesn't
// stay on screen while scrolling. On pages shorter than the window it sits
// at the bottom of the screen rather than partway up.

async function footerBox(page: Page) {
  const box = await page.getByRole('contentinfo').boundingBox();
  if (!box) throw new Error('The footer is not visible');
  return box;
}

test('the footer is not on screen at the top of a long page', async ({
  page,
}) => {
  await page.goto('/music');
  await expect(
    page.getByRole('contentinfo').getByRole('link').first(),
  ).not.toBeInViewport();
});

test('on a short page the footer sits at the bottom of the screen', async ({
  page,
}) => {
  await page.goto('/no-such-page');
  const footer = await footerBox(page);
  const viewport = page.viewportSize()!;
  expect(footer.y + footer.height).toBeCloseTo(viewport.height, 0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
