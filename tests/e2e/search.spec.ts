import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// What search engines are told to crawl.

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

// Cloudflare reads _headers when it serves the site. Every address except
// www (staging, PR previews, pages.dev and any custom domain added for
// them) is a copy of the site, so it must not be indexed. Rather than list
// each one, noindex is the default and only www removes it.
test('only www is indexable', async ({ request }) => {
  const response = await request.get('/_headers');
  expect(response.ok()).toBe(true);
  const headers = await response.text();
  expect(headers).toMatch(/^\/\*\n\s+X-Robots-Tag: noindex$/m);
  expect(headers).toMatch(
    /^https:\/\/www\.shabbatonchoir\.com\/\*\n\s+! X-Robots-Tag$/m,
  );
});
