import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a think piece page renders with a working back link', async ({ page }) => {
  await page.goto('./writing/handoff-is-not-a-moment/');
  await expect(page).toHaveTitle(/Handoff is not a moment/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Handoff is not a moment');
  await expect(page.getByRole('link', { name: /Think pieces/ })).toHaveAttribute(
    'href',
    '/portfolio-v2/#think'
  );

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('an unknown page shows the 404 with a link home', async ({ page }) => {
  const response = await page.goto('./this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Not here');
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
    'href',
    '/portfolio-v2/'
  );
});

test('the loader can be skipped, revealing the hero immediately', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.getByRole('dialog', { name: 'Loading' })).toBeHidden();
  await expect(page.getByTestId('font-mono')).toHaveCSS('opacity', '1');
});

test('the loader only plays once per visitor', async ({ page, context }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Loading' })).toHaveCount(0);
  await context.close();
});
