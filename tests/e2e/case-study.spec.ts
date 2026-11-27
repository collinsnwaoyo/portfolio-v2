import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Nestwell case study renders with working live and clip links', async ({ page }) => {
  await page.goto('./work/nestwell/');
  await expect(page).toHaveTitle(/Nestwell/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nestwell.');

  const liveLink = page.getByRole('link', { name: /Open the live product/ });
  await expect(liveLink).toHaveAttribute('href', 'https://nestwell-mocha.vercel.app');
  await expect(liveLink).toHaveAttribute('target', '_blank');

  const clipLink = page.getByRole('link', { name: /Play the 30-second brief/ });
  const clipHref = await clipLink.getAttribute('href');
  expect(clipHref).toContain('/clips/nestwell/landscape.html');

  // the clip itself is a real, reachable page
  const clipResponse = await page.request.get(clipHref!);
  expect(clipResponse.ok()).toBe(true);

  await expect(page.getByText('Four rules.')).toBeVisible();
  await expect(page.getByText('does not try to do more')).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('back link returns to the Everything grid', async ({ page }) => {
  await page.goto('./work/nestwell/');
  const backLink = page.getByRole('link', { name: /All work/ });
  await expect(backLink).toHaveAttribute('href', '/portfolio-v2/#everything');
});
