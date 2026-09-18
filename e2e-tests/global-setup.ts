/**
 * Global Setup for Playwright Tests
 * Why: Initialize test environment before running tests
 */

import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright E2E tests for VedaTime...');
  
  // Verify environment is ready
  const { baseURL } = config.projects[0].use;
  console.log(`🌐 Testing against: ${baseURL}`);
  
  // Add any global setup here
  // - Seed test data
  // - Set up test accounts
  // - Initialize services
  
  console.log('✅ Global setup complete');
}

export default globalSetup;
