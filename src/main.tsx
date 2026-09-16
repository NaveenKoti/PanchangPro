import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import i18n configuration (initializes i18next before app render)
import './i18n';

// Initialize analytics (error tracking, page views, feature usage)
import { initAnalytics, trackPerformance } from './services/analytics';

// Initialize performance monitoring
import { webVitalsService } from './services/WebVitalsService';

// Initialize analytics as early as possible (captures startup errors)
if (typeof window !== 'undefined') {
  initAnalytics();

  // Subscribe to web vitals and pipe to analytics
  webVitalsService.subscribe('app-init', (metrics) => {
    const vitals = webVitalsService.getCoreWebVitals();
    const scores = webVitalsService.getPerformanceScores();

    // Report key metrics to analytics
    if (vitals.lcp) trackPerformance('LCP', vitals.lcp.value, 'ms');
    if (vitals.fcp) trackPerformance('FCP', vitals.fcp.value, 'ms');
    if (vitals.cls) trackPerformance('CLS', vitals.cls.value, 'score');
    if (vitals.inp) trackPerformance('INP', vitals.inp.value, 'ms');

    // Send scores as boolean indicators
    const hasPerformanceIssues = Object.values(scores).some(
      score => score === 'poor' || score === 'needs-improvement'
    );

    if (hasPerformanceIssues) {
      const poorMetrics = Object.entries(scores)
        .filter(([, score]) => score === 'poor')
        .map(([key]) => key);
      trackPerformance('poor-metrics', poorMetrics.length, 'count');
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
