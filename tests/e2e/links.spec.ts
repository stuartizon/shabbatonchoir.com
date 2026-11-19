import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// Every internal link, image, stylesheet and script on every page must
// resolve. External links aren't checked here.
test('internal links and assets all resolve', async ({ page, request }) => {
  const urls = new Set<string>();
  for (const { path } of PAGES) {
    await page.goto(path);
    const found = await page
      .locator('a[href], img[src], link[href], script[src]')
      .evaluateAll((elements) =>
        elements.map((el) =>
          el instanceof HTMLAnchorElement || el instanceof HTMLLinkElement
            ? el.href
            : (el as HTMLImageElement | HTMLScriptElement).src,
        ),
      );
    for (const url of found) {
      const { origin, pathname } = new URL(url);
      if (origin === new URL(page.url()).origin) urls.add(pathname);
    }
  }

  expect(urls.size).toBeGreaterThan(PAGES.length);
  const broken = [];
  for (const url of urls) {
    const response = await request.get(url);
    if (!response.ok()) broken.push(`${url} (${response.status()})`);
  }
  expect(broken).toEqual([]);
});
