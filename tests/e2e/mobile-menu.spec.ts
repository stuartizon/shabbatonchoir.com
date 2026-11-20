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

// Wait for the menu to finish sliding in or out.
const waitForMenu = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getElementById('mobile-menu')!
        .getAnimations()
        .map((animation) => animation.finished),
    ),
  );

async function open(page: Page, path = '/music') {
  await page.goto(path);
  await button(page).click();
  await expect(menu(page)).toBeVisible();
  await waitForMenu(page);
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

test('the menu links all look the same, whichever page is open', async ({
  page,
}) => {
  await open(page, '/leadership');
  const styles = await menu(page)
    .getByRole('link')
    .evaluateAll((links) =>
      links.map((link) => {
        const style = getComputedStyle(link);
        return [style.textDecorationLine, style.color, style.fontWeight];
      }),
    );
  expect(new Set(styles.map((style) => style.join())).size).toBe(1);
});

test('the menu button shows only an icon, but is still named Menu', async ({
  page,
}) => {
  await page.goto('/music');
  expect((await button(page).innerText()).trim()).toBe('');
  const box = (await button(page).boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('the menu icon fades into a close icon while the menu is open', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/music');
  const bars = button(page).locator('[data-icon="menu"]');
  const cross = button(page).locator('[data-icon="close"]');
  await expect(bars).toHaveCSS('opacity', '1');
  await expect(cross).toHaveCSS('opacity', '0');
  await button(page).click();
  await expect(bars).toHaveCSS('opacity', '0');
  await expect(cross).toHaveCSS('opacity', '1');
});

test('the icons fade, unless reduced motion is asked for', async ({ page }) => {
  const icons = () => button(page).locator('svg');
  await page.goto('/music');
  for (const icon of await icons().all()) {
    await expect(icon).toHaveCSS('transition-property', 'opacity');
    await expect(icon).not.toHaveCSS('transition-duration', '0s');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const icon of await icons().all()) {
    await expect(icon).toHaveCSS('transition-duration', '0s');
  }
});

// The CSS transitions running on the menu as it opens or closes.
const slides = (page: Page) =>
  page.evaluate(() =>
    document
      .getElementById('mobile-menu')!
      .getAnimations()
      .map((animation) => (animation as CSSTransition).transitionProperty),
  );

test('the menu slides in from the side, and back out', async ({ page }) => {
  await page.goto('/music');
  await button(page).click();
  expect(await slides(page)).toContain('translate');
  await waitForMenu(page);
  await button(page).click();
  expect(await slides(page)).toContain('translate');
  await waitForMenu(page);
  await expect(menu(page)).toBeHidden();
});

test('the menu appears without sliding if reduced motion is asked for', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/music');
  await button(page).click();
  expect(await slides(page)).toEqual([]);
  await expect(menu(page)).toBeVisible();
});

// Where the menu links sit, from the top of the menu.
async function linkPositions(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await open(page);
  const menuTop = (await menu(page).boundingBox())!.y;
  const links = await menu(page).getByRole('link').all();
  return Promise.all(
    links.map(async (link) => (await link.boundingBox())!.y - menuTop),
  );
}

test('the menu links spread down a phone-sized screen', async ({ page }) => {
  const positions = await linkPositions(page, 375, 667);
  const menuHeight = (await menu(page).boundingBox())!.height;
  expect(positions.at(-1)! / menuHeight).toBeGreaterThan(0.65);
});

test('the menu links spread no further apart on taller phones', async ({
  page,
}) => {
  const standard = await linkPositions(page, 375, 667);
  const tall = await linkPositions(page, 430, 932);
  for (const [i, y] of tall.entries()) expect(y).toBeCloseTo(standard[i], 0);
});

test('the menu links close up on short phones, so all of them fit', async ({
  page,
}) => {
  await linkPositions(page, 320, 568);
  for (const link of await menu(page).getByRole('link').all()) {
    await expect(link).toBeInViewport({ ratio: 1 });
  }
  expect(
    await menu(page).evaluate((nav) => nav.scrollHeight - nav.clientHeight),
  ).toBe(0);
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
