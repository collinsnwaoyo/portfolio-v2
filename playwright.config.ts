import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/portfolio-v2/`;

const SCREENSHOT_WIDTHS: Record<string, { width: number; height: number }> = {
  375: { width: 375, height: 812 },
  390: { width: 390, height: 844 },
  430: { width: 430, height: 932 },
  768: { width: 768, height: 1024 },
  1440: { width: 1440, height: 900 },
  1920: { width: 1920, height: 1080 },
  2560: { width: 2560, height: 1440 },
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
  },
  projects: [
    {
      name: 'desktop-1440',
      testMatch: /smoke\.spec\.ts|case-study\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-390',
      testMatch: /smoke\.spec\.ts|case-study\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    ...Object.entries(SCREENSHOT_WIDTHS).map(([label, viewport]) => ({
      name: `screens-${label}`,
      testMatch: /screenshots\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport },
    })),
  ],
  webServer: {
    command: 'node scripts/preview-server.mjs',
    port: PORT,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
