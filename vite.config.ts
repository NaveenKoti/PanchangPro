import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

const isAnalyze = process.env.ANALYZE === 'true';

const pwaOptions: VitePWAOptions = {
  // injectManifest: custom SW lives in src/sw.ts (precache + runtime
  // caching + push handler). Runtime caching that used to be in
  // workbox.runtimeCaching below now lives in src/sw.ts — keep them in sync.
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
  },
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    name: 'VedaTime - Vedic Calendar & Panchang',
    short_name: 'VedaTime',
    description: 'Authentic Vedic calendar and panchang with offline support',
    theme_color: '#C75B12',
    background_color: '#F5F3F0',
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/?source=pwa',
    scope: '/',
    id: '/?source=pwa',
    icons: [
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    categories: ['lifestyle', 'religion', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
    related_applications: []
  },
  // NOTE: workbox.runtimeCaching / navigateFallback are ignored under the
  // injectManifest strategy — their equivalents live in src/sw.ts.
  devOptions: {
    enabled: false, // Disable service worker in development
    type: 'module'
  }
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions),
    isAnalyze && visualizer({
      open: true,
      filename: './dist/bundle-analysis.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    })
  ].filter(Boolean),
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 50, // Warn if chunk > 50KB
    assetsInlineLimit: 4096, // 4KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Node modules chunking - order matters (more specific first)
          if (id.includes('node_modules')) {
            // Emotion (CSS-in-JS runtime, small, shared by MUI)
            if (id.includes('@emotion/react') || id.includes('@emotion/styled')) {
              return 'emotion';
            }

            // MUI Icons (only used in 3 files - keep separate to avoid bloating main MUI chunk)
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }

            // MUI Material (core components - large, used everywhere)
            if (id.includes('@mui/material') || id.includes('@mui/base') || id.includes('@mui/system')) {
              return 'mui-base';
            }

            // React core
            if (id.includes('react/') || id.includes('node_modules/react$')) {
              return 'react-vendor';
            }
            if (id.includes('react-dom')) {
              return 'react-vendor';
            }

            // Router
            if (id.includes('react-router-dom') || id.includes('react-router')) {
              return 'router';
            }

            // i18n
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }

            // Date library
            if (id.includes('date-fns')) {
              return 'date-fns';
            }

            // Animation libraries (only used in GestureHandler)
            if (id.includes('react-spring')) {
              return 'react-spring';
            }

            // Gesture library (only used in GestureHandler)
            if (id.includes('@use-gesture')) {
              return 'gesture';
            }

            // Icon library (used across many components)
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }

            // State management + utility libraries
            if (id.includes('zustand') ||
                id.includes('clsx') ||
                id.includes('classnames') ||
                id.includes('react-device-detect') ||
                id.includes('react-intersection-observer') ||
                id.includes('web-vitals')) {
              return 'utils-vendor';
            }
          }
          // Return undefined to let Rollup use default chunking
          return undefined;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        compact: true,
      },
    },
  },
});
