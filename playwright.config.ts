import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the built site (npm run build first), served
// by astro preview. CI runs them; the pre-push hook doesn't, to stay quick.
const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
    launchOptions: {
      // Optional: use an already-installed Chromium instead of running
      // npx playwright install.
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // --ignore-lock keeps astro preview in the foreground, so Playwright can
    // stop it. Without it, Astro backgrounds the server when it detects an
    // AI coding agent.
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
