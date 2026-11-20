import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// What search engines are told to crawl (#19).

const SITEMAP_INDEX = 'https://www.shabbatonchoir.com/sitemap-index.xml';

// The <loc> addresses listed in a sitemap or sitemap index.
function locs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
}

test('robots.txt allows crawling and points at the sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBe(true);
  const robots = await response.text();
  expect(robots).toMatch(/^User-agent: \*$/m);
  expect(robots).not.toMatch(/^Disallow: \/$/m);
  expect(robots).toMatch(new RegExp(`^Sitemap: ${SITEMAP_INDEX}$`, 'm'));
});

test('the sitemap lists every page at its canonical address', async ({
  request,
}) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.ok()).toBe(true);

  const pages = [];
  for (const sitemap of locs(await index.text())) {
    const response = await request.get(new URL(sitemap).pathname);
    expect(response.ok()).toBe(true);
    pages.push(...locs(await response.text()));
  }

  expect(pages.sort()).toEqual(PAGES.map(({ canonical }) => canonical).sort());
});

// Cloudflare reads _headers when it serves the site. The *.pages.dev
// addresses (staging, PR previews and the production deployment's own
// address) and the staging custom domain are copies of the site, so they
// must not be indexed; only www should be.
test('non-production addresses are marked noindex', async ({ request }) => {
  const response = await request.get('/_headers');
  expect(response.ok()).toBe(true);
  const headers = await response.text();
  for (const host of [
    'https://:project.pages.dev/*',
    'https://:alias.:project.pages.dev/*',
    'https://staging.shabbatonchoir.com/*',
  ]) {
    expect(headers).toMatch(
      new RegExp(
        `^${host.replace(/[.*]/g, '\\$&')}\\n\\s+X-Robots-Tag: noindex$`,
        'm',
      ),
    );
  }
});
