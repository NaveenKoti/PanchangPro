/**
 * src/sw.ts — custom service worker (vite-plugin-pwa injectManifest).
 *
 * Keeps the exact offline behavior the generateSW build had:
 *  - precache of build assets (injected __WB_MANIFEST)
 *  - CacheFirst for Google Fonts (365d), StaleWhileRevalidate for lottie (30d)
 *  - navigation fallback to /index.html, excluding /api/
 * Adds:
 *  - `push` handler: showNotification from payload {title, body, tag}
 *  - `notificationclick`: focus/open the app
 *
 * NOTE: keep the runtime-caching rules below in sync with vite.config.ts.
 */

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

// Minimal SW-global typing so this file type-checks under the DOM lib
// (no lib.webworker reference — it conflicts with DOM).
interface SWPushData {
  json(): { title?: string; body?: string; tag?: string };
  text(): string;
}
interface SWEventLike {
  data?: SWPushData | null;
  notification?: { close(): void };
  waitUntil(p: Promise<unknown>): void;
}
interface SWGlobal {
  skipWaiting(): Promise<void>;
  registration: {
    showNotification(title: string, options?: Record<string, unknown>): Promise<void>;
  };
  clients: {
    matchAll(options?: Record<string, unknown>): Promise<Array<{ url: string; focus(): Promise<unknown> }>>;
    openWindow(url: string): Promise<unknown>;
  };
  addEventListener(type: string, listener: (event: SWEventLike) => void): void;
}

const sw = self as unknown as SWGlobal;

sw.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// Build-asset precache.
// NOTE: keep the literal `self.__WB_MANIFEST` below — workbox-build locates
// this exact string to inject the manifest (do not rename via an alias).
precacheAndRoute(
  (self as unknown as { __WB_MANIFEST: Array<{ url: string; revision: string | null }> })
    .__WB_MANIFEST
);

// Google Fonts stylesheets — CacheFirst, 365 days (same as previous generateSW).
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Google Fonts files — CacheFirst, 365 days.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Lottie animations — StaleWhileRevalidate, 30 days.
registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/lottie-web\/.*/i,
  new StaleWhileRevalidate({
    cacheName: 'lottie-animations-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// App-shell navigation fallback (excludes /api/ so functions are never swallowed).
const navigationHandler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [/^\/api\//],
});
registerRoute(navigationRoute);

// ─── Killed-app push reminders ──────────────────────────────────────
// Payload shape (sent by api/cron.ts): { title, body, tag }.
sw.addEventListener('push', (event) => {
  let title = 'VedaTime';
  let body = 'Your reminder is due.';
  let tag = 'vedatime-push';
  try {
    if (event.data) {
      const data = event.data.json();
      if (typeof data.title === 'string' && data.title) title = data.title;
      if (typeof data.body === 'string' && data.body) body = data.body;
      if (typeof data.tag === 'string' && data.tag) tag = data.tag;
    }
  } catch {
    try {
      if (event.data) body = event.data.text();
    } catch {
      // keep defaults
    }
  }
  event.waitUntil(
    sw.registration.showNotification(title, {
      body,
      tag,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    })
  );
});

sw.addEventListener('notificationclick', (event) => {
  if (event.notification) event.notification.close();
  event.waitUntil(
    sw.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        return sw.clients.openWindow('/');
      })
  );
});
