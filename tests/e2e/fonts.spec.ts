import { expect, test } from '@playwright/test';

// The live (Next.js) site used Tailwind 3.0.7's font stack. San Francisco, the
// system font on Apple devices, has no Hebrew letters, so Hebrew text falls
// back down the stack: to Helvetica Neue or Arial on the live site. Without
// them it falls through to the generic sans-serif, a different font (#54).
// Screenshots on Linux can't show this, so check the stack itself.
const LIVE_SITE_STACK = [
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
].join(', ');

test('Hebrew text uses the live site font stack', async ({ page }) => {
  await page.goto('/music');
  const hebrew = page.getByText('זצ׳ל').first();
  const fontFamily = await hebrew.evaluate(
    (element) => getComputedStyle(element).fontFamily,
  );
  expect(fontFamily).toBe(LIVE_SITE_STACK);
});
