import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';
import React from 'react';

interface PerformanceBudget {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  tti: number;
  ttfb: number;
  inp: number;
}

interface PerformanceMetrics extends Metric {
  timestamp: number;
  url: string;
  userAgent: string;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  tti: 3500,
  ttfb: 600,
  inp: 200,
};

class WebVitalsService {
  private metrics: PerformanceMetrics[] = [];
  private budget: PerformanceBudget = DEFAULT_BUDGET;
  private isMonitoring = false;
  private callbacks: Map<string, (metrics: PerformanceMetrics[]) => void> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMonitoring = true;
      this.startMonitoring();
    }
  }

  private recordMetric(metric: Metric) {
    const performanceMetric: PerformanceMetrics = {
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(performanceMetric);
    
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    this.checkBudget(performanceMetric);
    this.notifySubscribers();
  }

  private checkBudget(metric: PerformanceMetrics) {
    const threshold = this.budget[metric.name as keyof PerformanceBudget];
    if (!threshold) return;

    const budgetExceeded = metric.value > threshold;
    
    if (budgetExceeded) {
      // Dispatch event for monitoring - analytics can consume
      this.dispatchPerformanceEvent('budget-exceeded', {
        metric: metric.name,
        value: metric.value,
        threshold,
        url: metric.url,
      });
    }
  }

  private dispatchPerformanceEvent(eventName: string, data: Record<string, any>) {
    const event = new CustomEvent(`vedatime-performance-${eventName}`, {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  private startMonitoring() {
    try {
      onCLS(this.recordMetric.bind(this), { reportAllChanges: true });
      onFCP(this.recordMetric.bind(this));
      onLCP(this.recordMetric.bind(this), { reportAllChanges: true });
      onTTFB(this.recordMetric.bind(this));
      onINP(this.recordMetric.bind(this), { reportAllChanges: true });

      this.dispatchPerformanceEvent('monitoring-started', {
        budget: this.budget,
        timestamp: Date.now(),
      });
    } catch (error) {
      // Failed to start web vitals monitoring
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.name === name);
  }

  getLatest(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getCoreWebVitals() {
    const lcp = this.getMetricsByName('LCP').slice(-5);
    const fid = this.getMetricsByName('FID').slice(-5);
    const cls = this.getMetricsByName('CLS').slice(-5);
    const fcp = this.getMetricsByName('FCP').slice(-5);
    const inp = this.getMetricsByName('INP').slice(-5);

    return {
      lcp: lcp.length > 0 ? lcp[lcp.length - 1] : null,
      fid: fid.length > 0 ? fid[fid.length - 1] : null,
      cls: cls.length > 0 ? cls[cls.length - 1] : null,
      fcp: fcp.length > 0 ? fcp[fcp.length - 1] : null,
      inp: inp.length > 0 ? inp[inp.length - 1] : null,
    };
  }

  updateBudget(updates: Partial<PerformanceBudget>) {
    this.budget = { ...this.budget, ...updates };

    this.dispatchPerformanceEvent('budget-updated', {
      budget: this.budget,
    });
  }

  subscribe(id: string, callback: (metrics: PerformanceMetrics[]) => void) {
    this.callbacks.set(id, callback);
    return () => this.unsubscribe(id);
  }

  unsubscribe(id: string) {
    this.callbacks.delete(id);
  }

  private notifySubscribers() {
    this.callbacks.forEach((callback) => {
      try {
        callback(this.metrics);
      } catch (error) {
        // Subscriber error - continue with others
      }
    });
  }

  exportMetrics(): PerformanceMetrics[] {
    return this.metrics.map(metric => ({
      ...metric,
      delta: Math.round(metric.delta),
      value: Math.round(metric.value * 100) / 100,
    }));
  }

  clearMetrics() {
    this.metrics = [];
  }

  // React hook for real-time monitoring
  usePerformanceMonitor() {
    const [metrics, setMetrics] = React.useState<PerformanceMetrics[]>([]);
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
      setIsActive(true);
      const unsubscribe = this.subscribe('hook-monitor', setMetrics);
      return () => {
        unsubscribe();
        setIsActive(false);
      };
    }, []);

    return { metrics, isActive };
  }

  // Helpers to check performance scores
  getPerformanceScores() {
    const vitals = this.getCoreWebVitals();
    
    const lcpScore = vitals.lcp ? this.getScore(vitals.lcp.value, { good: 2500, poor: 4000 }) : null;
    const fidScore = vitals.fid ? this.getScore(vitals.fid.value, { good: 100, poor: 300 }) : null;
    const clsScore = vitals.cls ? this.getScore(vitals.cls.value, { good: 0.1, poor: 0.25 }) : null;
    const fcpScore = vitals.fcp ? this.getScore(vitals.fcp.value, { good: 1800, poor: 2500 }) : null;
    const inpScore = vitals.inp ? this.getScore(vitals.inp.value, { good: 200, poor: 500 }) : null;

    return {
      lcp: lcpScore,
      fid: fidScore,
      cls: clsScore,
      fcp: fcpScore,
      inp: inpScore,
    };
  }

  private getScore(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }
}

export const webVitalsService = new WebVitalsService();

export default webVitalsService;
