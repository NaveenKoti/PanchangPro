/**
 * Share Utility Tests
 * Tests for createShareText, isShareSupported, and shareContent functions
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { createShareText, isShareSupported, shareContent } from '../../utils/share';
import { Panchang } from '../../types';

// Mock panchang data for testing
const mockPanchang: Panchang = {
  date: new Date('2025-01-13'),
  location: {
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    name: 'Mumbai'
  },
  tithi: {
    number: 4,
    name: 'Chaturthi',
    nameHindi: 'चतुर्थी',
    paksha: 'Shukla',
    startTime: new Date('2025-01-13T06:00:00'),
    endTime: new Date('2025-01-14T06:00:00'),
    isKshaya: false,
    isVriddhi: false
  },
  nakshatra: {
    number: 15,
    name: 'Swati',
    nameHindi: 'स्वाति',
    ruler: 'Rahu',
    startTime: new Date('2025-01-13T06:00:00'),
    endTime: new Date('2025-01-14T06:00:00'),
    favorability: 'auspicious'
  },
  yoga: {
    number: 15,
    name: 'Vyaghata',
    nameHindi: 'व्याघात',
    favorability: 'neutral'
  },
  karana: {
    number: 7,
    name: 'Vishti',
    nameHindi: 'विष्टि',
    type: 'variable'
  },
  var: {
    number: 1,
    name: 'Monday',
    nameHindi: 'सोमवार'
  },
  sunrise: new Date('2025-01-13T06:45:00'),
  sunset: new Date('2025-01-13T18:20:00'),
  moonrise: new Date('2025-01-13T19:30:00'),
  moonset: new Date('2025-01-13T08:15:00'),
  rahuKaal: {
    start: new Date('2025-01-13T13:30:00'),
    end: new Date('2025-01-13T14:45:00')
  },
  yamagandam: {
    start: new Date('2025-01-13T08:45:00'),
    end: new Date('2025-01-13T10:00:00')
  },
  gulikaKaal: {
    start: new Date('2025-01-13T10:15:00'),
    end: new Date('2025-01-13T11:30:00')
  },
  festivals: [],
  dinacharya: []
};

describe('share utilities', () => {
  describe('createShareText', () => {
    it('should generate English text correctly', () => {
      const text = createShareText(mockPanchang, 'Bangalore, India', false);
      
      expect(text).toContain("Today's Panchang");
      expect(text).toContain('Bangalore, India');
      expect(text).toContain('Tithi: Chaturthi (Shukla)');
      expect(text).toContain('Shared from Panchang Pro');
    });

    it('should generate Hindi text correctly', () => {
      const text = createShareText(mockPanchang, 'बंगलोर, भारत', true);
      
      expect(text).toContain('आज का पंचांग');
      expect(text).toContain('बंगलोर, भारत');
      expect(text).toContain('तिथि: चतुर्थी (Shukla)');
      expect(text).toContain('Panchang Pro ऐप से');
    });

    it('should include date in output', () => {
      const text = createShareText(mockPanchang, 'Test Location', false);
      expect(text).toMatch(/📅 \d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should use unicode emoji correctly', () => {
      const text = createShareText(mockPanchang, 'Test', false);
      expect(text).toContain('🙏');
      expect(text).toContain('📅');
      expect(text).toContain('🌙');
    });
  });

  describe('isShareSupported', () => {
    const originalNavigator = global.navigator;

    beforeEach(() => {
      // Reset navigator before each test
      // @ts-ignore
      delete global.navigator;
    });

    afterEach(() => {
      // Restore original navigator
      global.navigator = originalNavigator;
    });

    it('should return true when navigator.share is available', () => {
      // @ts-ignore
      global.navigator = {
        share: vi.fn().mockResolvedValue(undefined)
      };
      
      expect(isShareSupported()).toBe(true);
    });

    it('should return false when navigator.share is undefined', () => {
      // @ts-ignore
      global.navigator = {};
      
      expect(isShareSupported()).toBe(false);
    });

    it('should return false when navigator is undefined', () => {
      // @ts-ignore
      global.navigator = undefined;
      
      expect(isShareSupported()).toBe(false);
    });

    it('should return false in non-browser environment', () => {
      // Test with no navigator object
      // @ts-ignore
      delete global.navigator;
      
      expect(isShareSupported()).toBe(false);
    });
  });

  describe('shareContent', () => {
    const mockShareData = {
      title: 'Test Panchang',
      text: 'Today is Chaturthi',
      url: 'https://panchang.app'
    };

    let mockShare: any;
    let mockWriteText: any;

    beforeEach(() => {
      vi.clearAllMocks();
      mockShare = vi.fn().mockResolvedValue(undefined);
      mockWriteText = vi.fn().mockResolvedValue(undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should call navigator.share when supported', async () => {
      // @ts-ignore
      global.navigator = {
        share: mockShare
      };

      await shareContent(mockShareData);

      expect(mockShare).toHaveBeenCalledWith(mockShareData);
    });

    it('should fallback to clipboard when share is not supported', async () => {
      // @ts-ignore
      global.navigator = {
        clipboard: {
          writeText: mockWriteText
        } as unknown as Clipboard
      };

      await shareContent(mockShareData);

      expect(mockWriteText).toHaveBeenCalledWith(
        'Test Panchang\n\nToday is Chaturthi\nhttps://panchang.app'
      );
    });

    it('should handle missing URL gracefully in clipboard fallback', async () => {
      const dataWithoutUrl = {
        title: 'Test Panchang',
        text: 'Today is Chaturthi'
        // no url property
      };

      // @ts-ignore
      global.navigator = {
        clipboard: {
          writeText: mockWriteText
        } as unknown as Clipboard
      };

      await shareContent(dataWithoutUrl);

      expect(mockWriteText).toHaveBeenCalledWith(
        'Test Panchang\n\nToday is Chaturthi\n'
      );
    });

    it('should handle share rejection gracefully', async () => {
      const mockError = new Error('User cancelled share');

      // @ts-ignore
      global.navigator = {
        share: vi.fn().mockRejectedValue(mockError)
      };

      await shareContent(mockShareData);

      // Share rejection handled gracefully without crashing
      expect(true).toBe(true);
    });

    it('should handle clipboard failure gracefully', async () => {
      const mockError = new Error('Clipboard permission denied');

      // @ts-ignore
      global.navigator = {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(mockError)
        } as unknown as Clipboard
      };

      await shareContent(mockShareData);

      // Clipboard failure handled gracefully
      expect(true).toBe(true);
    });

    it('should handle undefined navigator gracefully', async () => {
      // @ts-ignore
      global.navigator = undefined;

      await shareContent(mockShareData);

      // Undefined navigator handled gracefully
      expect(true).toBe(true);
    });
  });
});
