# VedaTime — Go-Live Plan (stored 2026-09-10, pick up next session)

Decisions locked: host = **Vercel**, reminders = **true push** (works when app closed).
Basis: read-only audits of deploy ops, My Tithis store/remind path, UI structure (2026-09-10 session).
Engine state at store time: Drik-verified (tithi 482/490 exact, sun-times ±5 min all 490 days),
suite 1231 passed / 4 skipped / 0 failed, `tsc && vite build` 0 errors, offline smoke passing.

---

## 1. Go-live distance: ~1 session of ops — code ready, repo/host not

### Blockers (in order)
1. **Commit this session's engine work first** — jd0/EoT fixes, `drikTruth.ts` (490 days),
   `tithi-accuracy.test.ts`, offline spec, parana computation. Deploying without this
   ships the old ±40-min sunset code.
2. **Git: zero commits, everything untracked** — `main` has no commits; repo root is `myCode`.
   Vercel auto-deploy needs a pushed repo (decide: new `vedatime` repo vs monorepo path).
3. **Wire Vercel** — add `vercel.json`, connect repo, HTTPS is automatic (SW requires it).
   Add CI workflow (`npm test` + `npm run build` + offline spec). `test:e2e` script already added.
   Status 2026-09-15: `vercel.json` + `.github/workflows/ci.yml` added locally (uncommitted);
   `npm test` 1231 passed / 4 skipped, `npm run build` 0 errors, precache 33 entries.
4. **Pre-launch check (~30 min)** — real-device PWA install (iOS + Android) + Lighthouse pass.

### Post-launch (all safely stubbed/absent today — ship without)
AdSense real ID (`GoogleAdSlot.tsx:65,96` hides placeholder in prod), Sentry (only local
`analytics.ts` + `WebVitalsService.ts` today), Sanskrit `sa.json` fallback, push backend,
extra languages, widgets, family sharing. Precache-count drift to confirm (ROADMAP says 18,
session-notes says 33).

---

## 2. Tithi store + remind: stores well, reminds unreliably (8 defects)

Works today: CRUD + localStorage persist/migration (`appStore.ts:247-314,490-510`),
upcoming-dates UI + calendar dots (`appStore.ts:25-68`, `MyTithisScreen.tsx:383-612`).

1. **No delivery when app closed** — `setTimeout` + `new Notification` only
   (`notificationService.ts:762-798`); zero PushManager/VAPID/server hits in repo.
   Missed reminders deleted silently (`886-894`).
2. **Permission dead-end** — My Tithis never requests permission; scheduler returns
   `null` silently without Settings visit (`599-602`).
3. **Wrong-date risk** — notifier uses calendar approximation (`831-852`, ignores
   paksha/engine) while UI shows engine dates; 180-day scan hardcodes Mumbai
   (`appStore.ts:71-76`), calendar uses user location (`450-488`).
4. `reminderDaysBefore` in type (`types/index.ts:164`) but never set in UI nor read —
   always "Today is…".
5. No true yearly repeat — `month` collected (`MyTithisScreen.tsx:711-723`) but ignored
   (fires ~monthly, not annual Shraddha); reschedule is +1 calendar month (`814-823`).
6. One pending reminder per tithi max (`id=tithi-{id}`, `618`); 30-day global scheduler
   ignores custom tithis (`173-330` scans festivals/fasts only).
7. Export/import premium-gated (paused premium ⇒ blocked for all); export is also a
   no-op (return discarded, `MyTithisScreen.tsx:176-178`); free cap 2 vs UI saying 5 (`208`).

### Phase A — reliable in-app (no backend)
- Inline permission prompt in My Tithis flow (no silent `null`).
- Schedule from engine dates + user location (single source with UI).
- `reminderDaysBefore` UI + scheduler support; true yearly lunar repeat; refresh
  `nextOccurrence` on month/customDate edits.
- Ungate export/import while premium paused; fix discarded export return; cap 2 vs 5 label.
- Missed-reminder inbox instead of silent delete.

### Phase B — true push (needs backend decision)
- VAPID + `PushManager.subscribe` + SW `push`/`notificationclick` handlers
  (no custom SW today — `vite.config.ts:60-114`, `public/` has no push SW).
- Minimal scheduler endpoint (Vercel Cron or OneSignal/FCM) + daily re-arm job.
- Custom tithis included in the 30-day advance scan.

---

## 3. UI simplification + visual appeal (ordered by impact/effort)

1. **Today screen 9 blocks → 4 (M)** — one sticky date bar; `TodayGuidanceCard` directly
   under hero; dedupe Rahu Kaal (`TodayGuidanceCard:621-624` vs standalone `:853-890`)
   into a "Timings" row. Section order today: FAB, header, date-nav, hero grid,
   guidance, badge, festival/fast alerts, detail grid, AyurvedicClock, My-Tithis CTA.
2. **Remove share FAB (XS)** — duplicates AppBar 3-dot share
   (`TodayScreen.tsx:199-224` vs `App.tsx:337-351`); violates single-entry rule.
3. **One theme file (S)** — `vedaTheme.ts` is dead (zero consumers; live provider is
   `ThemeProvider.tsx`); 3 divergent primaries (`#E8722A`/`#F0A060`/`#E8944A`).
   Delete dead exports, resolve to one saffron.
4. **Typography sweep (S, scriptable)** — 600/700 + Crimson/Playfair intrusions
   (`TodayScreen.tsx:756,799,843,878`, `vedaTheme.ts:112-123`) vs Noto 400/500-only rule.
5. **Gradient/shadow discipline (S)** — 76 gradient hits (worst `MuhurtaScreen` ~15,
   `FestivalDetailScreen` 8); flatten `MuiButton.contained`, AppBar title
   (`App.tsx:291-296`); 4 remaining `elevation>0` (`CalendarScreen:311,407,1380`,
   `OfflineIndicator:98`).
6. **Nav (XS)** — always show bottom labels (mobile icon-only); promote Muhurta from
   behind More sheet (2 taps for highest-value timing feature); fix stale keyboard
   clamp (`App.tsx:180`, `3→4`, `1-4→1-5`).
7. **Biggest single-screen wins** — `FastsScreen` (1781 lines, card+accordion duplication
   `:335-560`, festivals repeat `:581-848` + tabs `:848-1413`) into one list (M);
   copy `StoriesScreen` (378 lines) overline+h5+body2 rhythm as reference.

---

## 4. Execution order
1. Commit + push + Vercel (live URL first) + CI.
2. Reminder Phase A → Phase B.
3. UI simplification pass.
4. Post-launch: AdSense, Sentry, Sanskrit, languages, widgets.
