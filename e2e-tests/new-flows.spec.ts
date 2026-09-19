/**
 * New Flows — E2E coverage for recently shipped flows that have only unit tests.
 *
 * Contracts (stable behavior expectations — do NOT change these if a locator
 * needs adapting; adapt the locator and report it):
 *  - Search "diwali" → result with countdown → tap opens FestivalDetail
 *    ("Significance" visible). Hindi "दीपावली" → result. "xyzabc" → "No matches".
 *  - "Coming up" strip on Today: visible, non-empty; tap a festival item opens
 *    detail when a tappable item exists that day.
 *  - Seeded digest: "While you were away" banner (text only; CTA reported, never
 *    asserted).
 *  - Yoga card → "What is it?" dialog → "Got it" closes.
 *  - Fresh-context onboarding (English default): Welcome → Learn → Setup →
 *    Ready → Today.
 *  - FestivalDetail countdown: "Next Diwali" + live units (not fallback text).
 *
 * Ownership: e2e-tests/*.spec.ts ONLY. Never touches src/.
 */

import { test, expect, Page } from '@playwright/test';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Skip onboarding via Zustand persist shape (merged on startup). */
async function seedOnboarded(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem(
        'veda-time-storage',
        JSON.stringify({ state: { hasCompletedOnboarding: true }, version: 0 })
      );
    } catch {
      // Non-critical — test will fail visibly on onboarding screen
    }
  });
}

async function gotoToday(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Panchang content proves the Today screen is ready (default location Mumbai)
  await expect(page.getByText(/Mumbai/i).first()).toBeVisible({ timeout: 15000 });
}

/** Search box lives in SearchUpcoming on the Today screen (may need scroll). */
async function searchBox(page: Page) {
  const box = page.getByPlaceholder(/Try: Diwali, Ekadashi/i);
  await box.scrollIntoViewIfNeeded();
  return box;
}

/** Result rows render inside a <ul> (the coming-up strip is plain <div>s). */
function resultInList(page: Page, name: string) {
  return page.locator('ul').getByText(name, { exact: true });
}

// ─── 1–3. Search ────────────────────────────────────────────────────────────

test.describe('Search festivals & vrats', () => {
  test.beforeEach(async ({ page }) => {
    await seedOnboarded(page);
    await gotoToday(page);
  });

  test('type "diwali" → countdown result → tap opens FestivalDetail', async ({
    page,
  }) => {
    const box = await searchBox(page);
    await box.fill('diwali');

    const row = resultInList(page, 'Diwali');
    await expect(row).toBeVisible({ timeout: 8000 });
    // Countdown secondary label next to the result (e.g. "in 50 days · 8 Nov")
    await expect(
      page.locator('ul').getByText(/in \d+ days?|Today/).first()
    ).toBeVisible({ timeout: 8000 });

    await row.click();
    // FestivalDetail lazy-loads; Significance section proves arrival
    await expect(page.getByText('Significance')).toBeVisible({ timeout: 10000 });
  });

  test('Hindi "दीपावली" → result appears', async ({ page }) => {
    const box = await searchBox(page);
    await box.fill('दीपावली');

    // English-mode UI still lists the English primary name for the Hindi hit
    await expect(resultInList(page, 'Diwali')).toBeVisible({ timeout: 8000 });
  });

  test('gibberish "xyzabc" → no-matches copy', async ({ page }) => {
    const box = await searchBox(page);
    await box.fill('xyzabc');

    await expect(page.getByText('No matches')).toBeVisible({ timeout: 8000 });
  });
});

// ─── 4. Coming-up strip ─────────────────────────────────────────────────────

test.describe('Coming-up strip', () => {
  test.beforeEach(async ({ page }) => {
    await seedOnboarded(page);
    await gotoToday(page);
  });

  test('"Coming up" visible, non-empty; tap festival item opens detail', async ({
    page,
  }) => {
    const heading = page.getByText(/Coming up · next 15 days/);
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 8000 });

    // Strip Box is the sibling right after the heading (SearchUpcoming markup)
    const strip = heading.locator('xpath=following-sibling::div[1]');
    const stripText = (await strip.innerText()).trim();
    expect(stripText.length).toBeGreaterThan(0);

    const tappable = strip.locator('[role="button"]');
    const count = await tappable.count();
    console.log(`Coming-up strip: chars=${stripText.length} tappable=${count}`);
    if (count > 0) {
      await tappable.first().click();
      await expect(page.getByText('Significance')).toBeVisible({
        timeout: 10000,
      });
    }
    // If no tappable item that day, non-empty strip is the whole assertion.
  });
});

// ─── 5. Digest banner (seeded) ──────────────────────────────────────────────

test.describe('Digest banner', () => {
  test('"While you were away" appears for a missed one-time tithi reminder', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const nowIso = new Date().toISOString();
        localStorage.setItem(
          'veda-time-storage',
          JSON.stringify({
            state: {
              hasCompletedOnboarding: true,
              premium: {
                isPremium: false,
                tier: 'free',
                features: {
                  unlimitedCustomTithis: false,
                  fullYearCalendar: false,
                  advancedMuhurta: false,
                  allLanguages: false,
                  allThemes: false,
                  advancedNotifications: false,
                  noAds: false,
                  export: false,
                  familySharing: false,
                },
              },
              preferences: {
                location: {
                  latitude: 19.076,
                  longitude: 72.8777,
                  timezone: 'Asia/Kolkata',
                  name: 'Mumbai',
                },
                language: 'en',
                theme: 'light',
                notifications: {
                  fastingReminders: false,
                  festivalAlerts: false,
                  dinacharyaReminders: false,
                  customTithiReminders: false,
                },
                dinacharya: { enabled: true, showRecommendations: true },
              },
              customTithis: [
                {
                  id: 'seed-tithi-1',
                  name: 'Seed Tithi',
                  nameHindi: 'सीड तिथि',
                  tithiNumber: 1,
                  paksha: 'Shukla',
                  month: 0,
                  isRecurring: false,
                  customDate: yesterday.toISOString(),
                  reminderEnabled: true,
                  reminderTime: '08:00',
                  reminderDaysBefore: 0,
                  createdAt: nowIso,
                },
              ],
            },
            version: 0,
          })
        );
        // Fire time (yesterday 08:00) falls inside (lastSeen, now] → missed.
        localStorage.setItem(
          'panchangpro_last_seen_at',
          threeDaysAgo.toISOString()
        );
        localStorage.removeItem('panchangpro_missed_tithi_shown_ids');
      } catch {
        // Non-critical — banner assertion will fail visibly
      }
    });
    await gotoToday(page);

    const banner = page.getByText('While you were away');
    await banner.scrollIntoViewIfNeeded();
    await expect(banner).toBeVisible({ timeout: 10000 });

    // CTA presence is REPORT-only, never asserted (another agent may add it).
    const alert = page.locator('.MuiAlert-root').filter({
      hasText: 'While you were away',
    });
    const alertText = ((await alert.innerText().catch(() => '')) || '').trim();
    const hasMyTithisCta = /my tithis|view/i.test(alertText);
    console.log(
      `Digest banner text=${JSON.stringify(alertText.slice(0, 200))} cta_present=${hasMyTithisCta}`
    );
  });
});

// ─── 6. Glossary dialog ─────────────────────────────────────────────────────

test.describe('Glossary dialog', () => {
  test.beforeEach(async ({ page }) => {
    await seedOnboarded(page);
    await gotoToday(page);
  });

  test('tap Yoga card → "What is it?" dialog → Got it closes', async ({
    page,
  }) => {
    // Yoga lives in a collapsed ExpandableSection; header toggles it open.
    const yogaHeader = page
      .locator('.expandable-header')
      .filter({ hasText: 'Yoga' });
    await yogaHeader.scrollIntoViewIfNeeded();
    await expect(yogaHeader).toBeVisible({ timeout: 8000 });

    const yogaSection = page
      .locator('.expandable-section')
      .filter({ has: yogaHeader });
    const yogaCard = yogaSection.locator('.expandable-content .MuiCard-root').first();
    if (!(await yogaCard.isVisible().catch(() => false))) {
      await yogaHeader.click();
      await expect(yogaCard).toBeVisible({ timeout: 5000 });
    }
    // Locator adaptation: nested Fade/max-height animations keep covering the
    // card's click point (sticky bar + animated ancestors intercept hit-tests),
    // so dispatch the click directly — React's synthetic onClick still fires.
    // Expectation unchanged.
    await yogaCard.evaluate((el: HTMLElement) => el.click());

    await expect(page.getByText('What is it?')).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: 'Got it' }).click();
    await expect(page.getByText('What is it?')).not.toBeVisible({
      timeout: 5000,
    });
  });
});

// ─── 7. Onboarding fresh walkthrough (English default) ──────────────────────

test.describe('Onboarding', () => {
  test('fresh context: Welcome → Learn → Setup → Ready → Today', async ({
    page,
  }) => {
    // No seeding: fresh context must show onboarding.
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Step 0 — Welcome
    await expect(page.getByText('VedaTime').first()).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole('button', { name: 'Get Started' }).click();

    // Step 1 — Learn
    await expect(page.getByText('What is Panchang?')).toBeVisible({
      timeout: 8000,
    });
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2 — Setup
    await expect(page.getByText('Quick Setup')).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3 — Ready
    await expect(page.getByText("You're all set")).toBeVisible({
      timeout: 8000,
    });
    await page.getByRole('button', { name: 'Enter VedaTime' }).click();

    // Today screen after completion (default location Mumbai)
    await expect(page.getByText(/Mumbai/i).first()).toBeVisible({
      timeout: 15000,
    });
  });
});

// ─── 8. FestivalDetail countdown ────────────────────────────────────────────

test.describe('FestivalDetail', () => {
  test.beforeEach(async ({ page }) => {
    await seedOnboarded(page);
    await gotoToday(page);
  });

  test('Diwali via search shows live countdown (not fallback text)', async ({
    page,
  }) => {
    const box = await searchBox(page);
    await box.fill('diwali');
    await resultInList(page, 'Diwali').click();

    await expect(page.getByText('Next Diwali')).toBeVisible({ timeout: 10000 });
    // Live units prove a real countdown rendered…
    await expect(page.getByText('Days').first()).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Hours').first()).toBeVisible({ timeout: 8000 });
    // …and neither fallback is shown.
    await expect(
      page.getByText('The festival is today!')
    ).not.toBeVisible();
    await expect(
      page.getByText(/follows the lunar calendar/)
    ).not.toBeVisible();
  });
});
