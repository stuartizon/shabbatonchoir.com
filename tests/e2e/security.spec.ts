import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { PAGES } from './pages';

// Security and caching headers. Cloudflare Pages reads them from
// _headers when it serves the site, but astro preview doesn't, so these tests
// read the file itself, and the browser tests add the policy to each page
// as Cloudflare would.

type Rule = { path: string; headers: Record<string, string> };

// Parse _headers: an unindented URL pattern, then indented "Name: value"
// lines that apply to it. Lines starting with # are comments.
function rules(): Rule[] {
  const text = readFileSync('dist/_headers', 'utf8');
  const parsed: Rule[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      parsed.push({ path: line.trim(), headers: {} });
      continue;
    }
    const match = line.trim().match(/^([^:]+):\s*(.*)$/);
    if (match) parsed.at(-1)!.headers[match[1].toLowerCase()] = match[2];
  }
  return parsed;
}

function headersFor(path: string) {
  return rules().find((rule) => rule.path === path)?.headers ?? {};
}

const everyPage = () => headersFor('/*');

test('every response stops browsers guessing content types', () => {
  expect(everyPage()['x-content-type-options']).toBe('nosniff');
});

test('every response sends only the origin to other sites', () => {
  expect(everyPage()['referrer-policy']).toBe(
    'strict-origin-when-cross-origin',
  );
});

test('every response turns off browser features the site does not use', () => {
  const policy = everyPage()['permissions-policy'] ?? '';
  for (const feature of ['camera', 'microphone', 'geolocation', 'payment']) {
    expect(policy).toContain(`${feature}=()`);
  }
});

test('the content security policy blocks framing and plugins', () => {
  const policy = everyPage()['content-security-policy'] ?? '';
  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("frame-ancestors 'none'");
  expect(policy).toContain("object-src 'none'");
  expect(policy).toContain("base-uri 'self'");
});

test('hashed build assets are cached for a year', () => {
  expect(headersFor('/_astro/*')['cache-control']).toBe(
    'public, max-age=31536000, immutable',
  );
});

// Serve every document with the policy from _headers and record anything it
// blocks: scripts, styles, fonts, images or frames.
async function withPolicy(page: Page) {
  const policy = everyPage()['content-security-policy'];
  expect(policy).toBeTruthy();
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') {
      return route.continue();
    }
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), 'content-security-policy': policy },
    });
  });

  const blocked: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /Content Security/i.test(message.text()))
      blocked.push(message.text());
  });
  return blocked;
}

const PATHS = [...PAGES.map(({ path }) => path), '/no-such-page'];

for (const path of PATHS) {
  test(`the content security policy allows everything on ${path}`, async ({
    page,
  }) => {
    const blocked = await withPolicy(page);
    await page.goto(path, { waitUntil: 'networkidle' });
    expect(blocked).toEqual([]);
  });
}

test('the mobile menu still opens under the content security policy', async ({
  page,
}) => {
  await withPolicy(page);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const menu = page.locator('[data-menu]');
  await expect(menu).toHaveClass(/translate-x-full/);
  await page.locator('[data-menu-toggle]').click();
  await expect(menu).toHaveClass(/translate-x-0/);
});
