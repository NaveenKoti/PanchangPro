import { test, expect } from '@playwright/test';

test('offline: app shell + panchang render with network cut', async ({ page, context }) => {
  // First load ONLINE (installs SW + precache)
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  // Dismiss onboarding (fresh profile) to reach the Today screen
  const skip = page.getByRole('button', { name: /skip setup/i });
  if (await skip.isVisible({ timeout: 8000 }).catch(() => false)) {
    await skip.click();
  }
  // Today screen must show real panchang content while ONLINE
  await expect(page.getByText(/rahu kaal/i).first()).toBeVisible({ timeout: 15000 });
  // Wait for SW to take control
  await page.waitForFunction(
    () => navigator.serviceWorker?.controller?.state === 'activated',
    { timeout: 20000 }
  );
  const onlineText = await page.locator('body').innerText();

  // Go OFFLINE and hard-reload
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const offlineText = await page.locator('body').innerText();

  // App must render real content offline (not blank, not browser offline error)
  expect(offlineText.length).toBeGreaterThan(200);
  expect(offlineText).not.toMatch(/ERR_INTERNET_DISCONNECTED|offline.*dinosaur/i);
  for (const kw of [/tithi/i, /rahu kaal/i]) {
    expect(offlineText).toMatch(kw);
  }
  console.log(`ONLINE chars=${onlineText.length} OFFLINE chars=${offlineText.length}`);
});
