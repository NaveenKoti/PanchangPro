# CLAUDE.md — VedaTime (PanchangPro)

Extends root CLAUDE.md at `myProjects/CLAUDE.md`. All global rules apply.

---

## App Identity
- **Name:** VedaTime (package: `veda-time`)
- **Tagline:** Sacred Rhythms of Time
- **Version:** 3.8.0
- **Brand guide:** `VedaTime-Brand-Guide.docx` in project root

## Stack
- **Framework:** React 18 + TypeScript 5, bundled with Vite 5
- **UI:** MUI v5 (Material UI) + Emotion — all theming via `useTheme()` hook
- **State:** Zustand 4
- **Routing:** React Router 6
- **i18n:** i18next + react-i18next (6 languages: en, hi, sa, kn, te, ta)
- **Testing:** Vitest + jsdom (169 tests, all passing)
- **PWA:** vite-plugin-pwa + Workbox
- **Animations:** lottie-react, react-spring, @use-gesture/react

## Folder Conventions
```
src/
  screens/     # 8 full screens (Today, Calendar, Fasts, MyTithis, Muhurta, Stories, Settings, FestivalDetail)
  components/  # Reusable UI; pwa/ and skeletons/ subfolders
  engine/      # Pure TS panchang calculation (astronomy, sunrise, muhurta, guidance, panchang)
  data/        # Static data: festivals, fastings, verses, stories, ekadashis
  hooks/       # Custom hooks (usePanchang, useLocation, useTheme, useI18n, etc.)
  services/    # Analytics, notifications, verse API, web vitals, cache
  stores/      # appStore.ts (Zustand)
  theme/       # vedaTheme.ts + breakpoints.ts
  i18n/        # JSON language files
  types/       # Shared TypeScript types
  utils/       # haptics, share, icons
```

## Coding Standards
- **Colors:** Never hardcode hex values. Always use `theme.palette.*` or CSS token variables. ~200 legacy hardcoded instances remain — replace on touch.
- **Dark mode:** CSS vars must have a `:root.dark { }` block. MUI theme handles the rest via `useTheme()`.
- **Typography:** Noto Sans only, weights 400 and 500 only. Never use bold/700.
- **Cards:** elevation=0, borderRadius from theme, `border='1px solid'` using `theme.palette.divider`. No heavy gradients.
- **Theme values:** Saffron `#C75B12` (primary), Sacred Green `#3D6B24` (secondary), Cosmic Indigo `#2C3E6B` (info). Dosha: Pitta `#A33030`, Vata `#1A6B8A`, Kapha `#3D6B24`.
- **Console logs:** Zero in production. Never add them; remove any found.
- **Share:** Single entry point only — three-dot menu in AppBar. Do not add share buttons inside screens.
- **Premium:** Paused. No premium gating, lock icons, or paywall dialogs until re-enabled.
- **Tests:** Engine changes must not break the Vitest suite (1231 passing 2026-09-10, incl. 490-day Drik ground truth in `tithi-accuracy.test.ts`). Run `npm test` before marking done.
- **Build:** `tsc && vite build` must pass with zero errors and zero TS errors.

## Panchang Engine Invariants
- **Sunrise/sunset formula signs** (`src/engine/sunrise.ts`, `calculateSunrise`/`calculateSunset`): the formula is
  `hours = solarTime - E/60 - longitudeTimeCorrection`
  where `longitudeTimeCorrection = (observer_lon - standard_meridian) * 4 / 60`.
  BOTH signs are **minus**. History: (1) longitude term was once `+`, fixed to `-`;
  (2) 2026-09-10 found the EoT term had been flipped to `+` (see TODO_COMPLETION_SUMMARY.md),
  injecting a ±29 min seasonal error, AND the Julian-day base was ~1 month stale
  (hand-rolled formula lagged true JD by 30-31 days), injecting up to -47 min sunset
  drift. Fixing both (correct Meeus JD + `-E/60`) brought all 490 Delhi days
  (Dec 2024–May 2026) within ±5 min of Drik. Do not change either sign or the JD
  computation without re-verifying against Drik (`npm test -- tithi-accuracy`).
- **Reference truth:** Drik Panchang. Ground truth lives in `src/engine/__tests__/drikTruth.ts`
  (490 Delhi days). Spot-check Bangalore 2026-04-19 (~sunrise 06:04 IST, sunset 18:34 IST) after any engine change.
