import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The menu on small screens: a sticky header with a menu button that opens
// a full-screen menu, usable by touch, keyboard and screen readers.

test.skip(({ isMobile }) => !isMobile, 'The mobile menu is for small screens.');

const header = (page: Page) =>
  page.getByRole('banner').filter({ visible: true });
const button = (page: Page) =>
  page.getByRole('button', { name: 'Menu', exact: true });
const menu = (page: Page) =>
  page.getByRole('navigation', { name: 'Main', exact: true });

async function open(page: Page, path = '/music') {
  await page.goto(path);
  await button(page).click();
  await expect(menu(page)).toBeVisible();
}

test('the menu button is a labelled button that controls the menu', async ({
  page,
}) => {
  await page.goto('/music');
  await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
  const controls = await button(page).getAttribute('aria-controls');
  expect(controls).toBeTruthy();
  await expect(page.locator(`#${controls}`)).toBeAttached();
});

test('the closed menu is hidden from everyone', async ({ page }) => {
  await page.goto('/music');
  await expect(menu(page)).toBeHidden();
  await expect(page.getByRole('link', { name: 'Leadership' })).toHaveCount(0);
});

test('the header stays at the top of the screen while scrolling', async ({
  page,
}) => {
  await page.goto('/music');
  await page.mouse.wheel(0, 1500);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(500);
  const box = await header(page).boundingBox();
  expect(box?.y).toBe(0);
  await expect(button(page)).toBeInViewport();
});

test('the header casts a shadow only once the page has scrolled', async ({
  page,
}) => {
  await page.goto('/music');
  const shadow = () =>
    header(page).evaluate((el) => getComputedStyle(el).boxShadow);
  expect(await shadow()).toBe('none');
  await page.mouse.wheel(0, 500);
  await expect.poll(shadow).not.toBe('none');
});

test('the open menu fills the screen below the header', async ({ page }) => {
  await open(page);
  await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
  const headerBox = (await header(page).boundingBox())!;
  const menuBox = (await menu(page).boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(menuBox.y).toBeCloseTo(headerBox.y + headerBox.height, 0);
  expect(menuBox.y + menuBox.height).toBeCloseTo(viewport.height, 0);
  expect(menuBox.x).toBe(0);
  expect(menuBox.width).toBe(viewport.width);
});

test('the open menu covers the page, so nothing behind it can be tapped', async ({
  page,
}) => {
  await open(page);
  const viewport = page.viewportSize()!;
  // Just above the bottom edge, where the fixed footer sits.
  for (const y of [viewport.height / 2, viewport.height - 10]) {
    const inMenu = await page.evaluate(
      ([x, y]) =>
        !!document.elementFromPoint(x, y)?.closest('nav[aria-label="Main"]'),
      [viewport.width / 2, y],
    );
    expect(inMenu).toBe(true);
  }
  await expect(page.locator('main')).toHaveJSProperty('inert', true);
});

test('the page behind the open menu does not scroll', async ({ page }) => {
  await open(page);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('the menu links are large enough to tap', async ({ page }) => {
  await open(page);
  const links = menu(page).getByRole('link');
  await expect(links).toHaveText([
    'Home',
    'Music',
    'Leadership',
    'History',
    'Contact',
  ]);
  for (const link of await links.all()) {
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('the menu marks the current page', async ({ page }) => {
  await open(page, '/leadership');
  await expect(menu(page).locator('[aria-current="page"]')).toHaveText(
    'Leadership',
  );
  await expect(menu(page).locator('[aria-current]')).toHaveCount(1);
});

test('the menu icon turns into a close icon while the menu is open', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/music');
  const middle = button(page).locator('[data-line="middle"]');
  const top = button(page).locator('[data-line="top"]');
  await expect(middle).toHaveCSS('opacity', '1');
  await expect(top).toHaveCSS('rotate', 'none');
  await button(page).click();
  await expect(middle).toHaveCSS('opacity', '0');
  await expect(top).toHaveCSS('rotate', '45deg');
});

test('the icon animates, unless reduced motion is asked for', async ({
  page,
}) => {
  const top = () => button(page).locator('[data-line="top"]');
  await page.goto('/music');
  await expect(top()).not.toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(top()).toHaveCSS('transition-duration', '0s');
});

test('the menu works with only a keyboard', async ({ page }) => {
  await page.goto('/music');
  await button(page).focus();
  await page.keyboard.press('Enter');
  await expect(menu(page)).toBeVisible();
  await expect(button(page)).toBeFocused();

  // Tab goes through the links, and never leaves the header.
  await page.keyboard.press('Tab');
  await expect(menu(page).getByRole('link', { name: 'Home' })).toBeFocused();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const inHeader = await page.evaluate(
      () => !!document.activeElement?.closest('header'),
    );
    expect(inHeader).toBe(true);
  }
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Shift+Tab');
    const inHeader = await page.evaluate(
      () => !!document.activeElement?.closest('header'),
    );
    expect(inHeader).toBe(true);
  }

  // Escape closes it and puts focus back on the button.
  await page.keyboard.press('Escape');
  await expect(menu(page)).toBeHidden();
  await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(button(page)).toBeFocused();
});

test('the menu button closes the menu again', async ({ page }) => {
  await open(page);
  await button(page).click();
  await expect(menu(page)).toBeHidden();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
});

test('choosing a link closes the menu', async ({ page }) => {
  await open(page);
  await menu(page).getByRole('link', { name: 'History' }).click();
  await expect(page).toHaveURL('/history');
  await expect(menu(page)).toBeHidden();
  // Coming back restores the previous page, which must not be stuck open.
  await page.goBack();
  await expect(page).toHaveURL('/music');
  await expect(menu(page)).toBeHidden();
  await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
});

test('the menu closes if the window widens to desktop size', async ({
  page,
}) => {
  await open(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(menu(page)).toBeHidden();
});

test('the open menu has no accessibility violations', async ({ page }) => {
  await open(page);
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();
  expect(violations.map(({ id }) => id)).toEqual([]);
});
