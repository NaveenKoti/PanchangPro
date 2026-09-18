import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for VedaTime/PanchangPro
 * Why: End-to-end testing for critical user flows
 */

export default defineConfig({
  // Test directory
  testDir: './e2e-tests',
  
  // Glob patterns for test files
  testMatch: '**/*.spec.ts',
  
  // Timeout for each test
  timeout: 30 * 1000, // 30 seconds
  
  // Maximum time expect() should wait for condition
  expect: {
    timeout: 5000, // 5 seconds
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail build on CI if test fails
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Number of workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL
    baseURL: 'http://localhost:4173', // Vite preview server
    
    // Capture screenshots on failure
    screenshot: 'only-on-failure',
    
    // Capture video on retry
    video: 'retain-on-failure',
    
    // Trace for debugging
    trace: 'on-first-retry',
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
  },
  
  // Projects configuration
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile tests
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Global setup file
  globalSetup: './e2e-tests/global-setup.ts',
  

  
  // Run local dev server before starting tests (production-like preview server)
  webServer: {
    // Preview server for production-like testing
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: false,
    timeout: 180 * 1000, // 3 minutes
  },

});
