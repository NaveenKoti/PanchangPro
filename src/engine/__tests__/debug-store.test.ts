/**
 * Minimal mock verification - CORRECT PATH
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../services/notificationService', () => {
  console.log('### MOCK FACTORY EXECUTED ###');
  return {
    notificationService: {
      scheduleCustomTithiReminder: vi.fn(),
      cancelNotification: vi.fn(),
    },
  };
});

import { notificationService } from '../../services/notificationService';

describe('Mock verification', () => {
  it('should have mocked notificationService', () => {
    console.log('notificationService:', notificationService);
    expect(typeof (notificationService as any).scheduleCustomTithiReminder).toBe('function');
  });
});
