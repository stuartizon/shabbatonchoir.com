import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

// Known problems, each with the issue that fixes it. Remove a rule from
// this list in the PR that fixes it, so the check guards it from then on.
const KNOWN_VIOLATIONS: Record<string, string> = {};

for (const { path } of [...PAGES, { path: '/no-such-page' }]) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .disableRules(Object.keys(KNOWN_VIOLATIONS))
      .analyze();
    const summary = violations.map(
      ({ id, help, nodes }) => `${id}: ${help} (${nodes.length})`,
    );
    expect(summary).toEqual([]);
  });
}
