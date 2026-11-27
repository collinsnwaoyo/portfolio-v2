import { test, expect } from '@playwright/test';

test('TV plays Nestwell muted with captions on entry, and with sound once a disc is picked', async ({
  page,
}) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width <= 640, 'TV is desktop-only; mobile uses the card rail');

  await page.goto('./');
  await page.locator('#work').scrollIntoViewIfNeeded();

  const audio = page.locator('#work audio');

  // the clip is driving its own captions within a few seconds of entering view
  await expect(page.locator('#work [aria-live]')).not.toBeEmpty({ timeout: 5000 });
  await expect(page.getByRole('button', { name: 'Turn sound on' })).toBeVisible();

  const nestwellDisc = page.getByRole('button', { name: /NOW PLAYING/ });
  await nestwellDisc.click();

  await expect
    .poll(async () => audio.evaluate((el: HTMLAudioElement) => el.paused), { timeout: 3000 })
    .toBe(false);
  await expect(page.getByRole('button', { name: 'Mute' })).toBeVisible();
});

test('the Nestwell clip reaches its end card, and Replay restarts it', async ({ page }) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width <= 640, 'TV is desktop-only; mobile uses the card rail');
  test.setTimeout(60_000);

  await page.goto('./');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /NOW PLAYING/ }).click();

  const endCard = page.getByRole('button', { name: 'Open the case study' });
  await expect(endCard).toBeVisible({ timeout: 40_000 });
  await expect(page.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next project' })).toBeVisible();

  const audio = page.locator('#work audio');
  await page.getByRole('button', { name: 'Replay' }).click();

  // replaying restarts playback from the top rather than leaving the end card up
  await expect
    .poll(async () => audio.evaluate((el: HTMLAudioElement) => el.currentTime), { timeout: 3000 })
    .toBeLessThan(2);
});

test('mobile: tapping the Nestwell card opens a full-screen player with its own history entry', async ({
  page,
}) => {
  // the mobile card rail only renders (and is tappable) at narrow widths
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width > 640, 'mobile-only flow');

  await page.goto('./');
  await page.locator('#work').scrollIntoViewIfNeeded();

  await page.getByRole('button', { name: /Play the walkthrough for/ }).click();
  await expect(page).toHaveURL(/\?play=nestwell/);

  const dialog = page.getByRole('dialog', { name: 'Nestwell clip' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible();

  // disc strip lets you switch project
  await expect(dialog.getByRole('button', { name: 'Liveable', exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/play=/);
});
