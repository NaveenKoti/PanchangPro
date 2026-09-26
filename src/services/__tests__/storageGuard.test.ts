/**
 * storageGuard: persist() request, persisted() state, estimate() shape.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestPersistentStorage, isStoragePersisted, getStorageEstimate } from '../storageGuard';

describe('storageGuard', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests persistence and returns the granted flag', async () => {
    vi.stubGlobal('navigator', {
      storage: { persisted: async () => false, persist: async () => true },
    });
    await expect(requestPersistentStorage()).resolves.toBe(true);
  });

  it('short-circuits true when already persisted', async () => {
    const persist = vi.fn(async () => true);
    vi.stubGlobal('navigator', {
      storage: { persisted: async () => true, persist },
    });
    await expect(requestPersistentStorage()).resolves.toBe(true);
    expect(persist).not.toHaveBeenCalled();
  });

  it('returns false when the API is absent or throws', async () => {
    vi.stubGlobal('navigator', {});
    await expect(requestPersistentStorage()).resolves.toBe(false);
    await expect(isStoragePersisted()).resolves.toBe(false);
    await expect(getStorageEstimate()).resolves.toBeNull();
    vi.stubGlobal('navigator', {
      storage: {
        persisted: async () => { throw new Error('x'); },
        persist: async () => { throw new Error('x'); },
        estimate: async () => { throw new Error('x'); },
      },
    });
    await expect(requestPersistentStorage()).resolves.toBe(false);
    await expect(isStoragePersisted()).resolves.toBe(false);
    await expect(getStorageEstimate()).resolves.toBeNull();
  });

  it('reports usage/quota estimate', async () => {
    vi.stubGlobal('navigator', {
      storage: { estimate: async () => ({ usage: 1234, quota: 5678 }) },
    });
    await expect(getStorageEstimate()).resolves.toEqual({ usageBytes: 1234, quotaBytes: 5678 });
  });
});
