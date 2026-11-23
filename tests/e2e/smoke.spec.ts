import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads with the right fonts and no accessibility violations', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/Collins Nwaoyo/);

  const displayFamily = await page
    .getByTestId('font-display')
    .evaluate((el) => getComputedStyle(el).fontFamily);
  const bodyFamily = await page
    .getByTestId('font-body')
    .evaluate((el) => getComputedStyle(el).fontFamily);
  const monoFamily = await page
    .getByTestId('font-mono')
    .evaluate((el) => getComputedStyle(el).fontFamily);

  expect(displayFamily).toMatch(/Inter Tight/i);
  expect(bodyFamily).toMatch(/Inter/i);
  expect(monoFamily).toMatch(/JetBrains/i);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('is noindex with a canonical link to the current site', async ({ page }) => {
  await page.goto('./');
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(robots).toContain('noindex');

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBe('https://collinsnwaoyo.github.io/portfolio/');
});

test('screenshot', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.screenshot({
    path: `test-results/screenshot-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
