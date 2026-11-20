import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// Headless Chromium hides scrollbars by default. Show them, as Windows and
// macOS ("Show scroll bars: Always") do, so a page sized to the full window
// width, scrollbar included, scrolls sideways here too.
test.use({
  launchOptions: {
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    ignoreDefaultArgs: ['--hide-scrollbars'],
  },
});

test.describe('with a permanent scrollbar', () => {
  // Phones draw their scrollbars over the page, so this is a desktop check.
  test.skip(({ isMobile }) => isMobile, 'phones use overlay scrollbars');

  for (const { path } of PAGES) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
