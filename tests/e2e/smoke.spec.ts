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

test('all six homepage sections are present', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'senior product designer who also ships'
  );
  await expect(page.locator('#work')).toContainText('My work.');
  await expect(page.locator('#everything')).toContainText('Everything.');
  await expect(page.getByText('Twenty-plus products, one method')).toBeVisible();
  await expect(page.locator('#think')).toContainText('How I think about the work.');
  await expect(page.locator('#contact')).toContainText("Let’s build.");
});

test('everything grid shows all 14 items with the right filter counts', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('tab', { name: 'All 14' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Projects 9' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Snippets 4' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Illustration 1' })).toBeVisible();
  await expect(page.locator('#everything li')).toHaveCount(14);
});

test('filtering never reshuffles tiles and keeps hidden ones keyboard-inert', async ({ page }) => {
  await page.goto('./');
  const tiles = page.locator('#everything li');
  await expect(tiles).toHaveCount(14);
  const order = await tiles.evaluateAll((els) => els.map((el) => el.textContent));

  const projectsTab = page.getByRole('tab', { name: 'Projects 9' });
  await projectsTab.click();
  await expect(projectsTab).toHaveAttribute('aria-selected', 'true');

  // same 14 tiles, same order: filtering fades, it never reshuffles or removes.
  await expect(tiles).toHaveCount(14);
  expect(await tiles.evaluateAll((els) => els.map((el) => el.textContent))).toEqual(order);

  const snippetLi = page.getByText('The CD player', { exact: true }).locator('xpath=ancestor::li[1]');
  expect(await snippetLi.evaluate((el) => (el as HTMLLIElement).inert)).toBe(true);

  const nestwellLi = page
    .locator('#everything')
    .getByText('Nestwell', { exact: true })
    .locator('xpath=ancestor::li[1]');
  expect(await nestwellLi.evaluate((el) => (el as HTMLLIElement).inert)).toBe(false);
  await nestwellLi.locator('button').focus();
  await expect(nestwellLi.locator('button')).toBeFocused();
});

test('the top of My work peeks into the first screen', async ({ page }) => {
  await page.goto('./');
  const workTitle = page.locator('#work').getByText('My work.');
  const box = await workTitle.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (box && viewport) {
    expect(box.y).toBeLessThan(viewport.height);
  }
});

test('dock menu opens, traps focus, and closes on Escape', async ({ page }) => {
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();

  const menu = page.getByRole('dialog', { name: 'Site menu' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Work' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
