import { test } from '@playwright/test';

test('homepage screenshot', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.screenshot({
    path: `test-results/screenshot-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
