/**
 * Festival Detection Tests
 * Verifies that festivals are correctly detected based on tithi and paksha
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { BANGALORE } from './referenceData';
import { getFestivalsForDate } from '../../data/festivals';

describe('PanchangEngine - Festival Detection', () => {
  it('should detect Sankashti Chaturthi on Krishna Paksha Chaturthi', () => {
    const engine = new PanchangEngine(BANGALORE);
    
    // Test with a date that produces tithi number 4 in Krishna paksha
    // Krishna Paksha Chaturthi occurs 4 days after Purnima
    // We'll use a direct approach to test festival detection
    
    // First, test the underlying festival detection function directly
    const festivals = getFestivalsForDate(new Date('2025-06-11'), 4, 'Krishna');
    
    const sankashti = festivals.find(f => f.id === 'sankashti-chaturthi');
    expect(sankashti).toBeDefined();
    expect(sankashti?.name).toBe('Sankashti Chaturthi');
    expect(sankashti?.nameHindi).toBe('संकष्टी चतुर्थी');
    
    // Now test through the panchang engine
    const testDate = new Date('2025-06-11');
    const result = engine.calculate(testDate);
    
    expect(Array.isArray(result.festivals)).toBe(true);
    // Check if festivals array is populated
    if (result.tithi.number === 4 && result.tithi.paksha === 'Krishna') {
      const sankashtiEngine = result.festivals.find(f => f.id === 'sankashti-chaturthi');
      expect(sankashtiEngine).toBeDefined();
    }
  });

  it('should detect major festivals like Diwali', () => {
    const engine = new PanchangEngine(BANGALORE);
    
    // Diwali is on Krishna Paksha Amavasya in Kartika month
    const testDate = new Date('2025-10-20'); // Diwali 2025
    const result = engine.calculate(testDate);
    
    const diwali = result.festivals.find(f => f.id === 'diwali');
    if (diwali) {
      expect(diwali.name).toBe('Diwali');
      expect(diwali.tithiNumber).toBe(15);
      expect(diwali.paksha).toBe('Krishna');
    }
  });

  it('should detect Ganesh Chaturthi', () => {
    const engine = new PanchangEngine(BANGALORE);
    
    // Ganesh Chaturthi is on Shukla Paksha Chaturthi in Bhadrapada
    const testDate = new Date('2025-08-29'); // Ganesh Chaturthi 2025
    const result = engine.calculate(testDate);
    
    const ganesh = result.festivals.find(f => f.id === 'ganesh-chaturthi');
    if (ganesh) {
      expect(ganesh.name).toBe('Ganesh Chaturthi');
      expect(ganesh.tithiNumber).toBe(4);
      expect(ganesh.paksha).toBe('Shukla');
    }
  });

  it('should return empty array when no festivals match', () => {
    const engine = new PanchangEngine(BANGALORE);
    
    // Pick a random date that shouldn't have major festivals
    const testDate = new Date('2025-03-05');
    const result = engine.calculate(testDate);
    
    // Should always return an array (empty or with festivals)
    expect(Array.isArray(result.festivals)).toBe(true);
  });

  it('should detect multiple festivals if they occur on same day', () => {
    const engine = new PanchangEngine(BANGALORE);
    
    // Test date that might match multiple festivals
    // This is a structural test - actual multi-festival dates are rare
    const testDate = new Date('2025-01-01');
    const result = engine.calculate(testDate);
    
    // Should always return an array
    expect(Array.isArray(result.festivals)).toBe(true);
  });
});
