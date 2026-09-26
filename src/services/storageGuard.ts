/**
 * Storage eviction guard (Safari focus).
 *
 * WebKit deletes website data for sites unused ~7+ days; installed
 * (home-screen) PWAs are exempt from the 7-day cap but can still lose data
 * under storage pressure. No web API prevents that outright — the honest
 * layered defense is:
 *  1. navigator.storage.persist() — best-effort persistent bucket (granted
 *     for installed/engaged origins; harmless no-op elsewhere).
 *  2. Surface the persisted() state in Settings so users can verify.
 *  3. Keep the My Tithis JSON export as the user-owned backup path.
 * All calls are guarded try/catch and never block boot.
 */

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    const storage = navigator.storage;
    if (!storage?.persist) return false;
    if (await storage.persisted()) return true;
    return await storage.persist();
  } catch {
    return false;
  }
}

export async function isStoragePersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted()) ?? false;
  } catch {
    return false;
  }
}

export async function getStorageEstimate(): Promise<{ usageBytes: number; quotaBytes: number } | null> {
  try {
    const est = await navigator.storage?.estimate();
    if (!est) return null;
    return { usageBytes: est.usage ?? 0, quotaBytes: est.quota ?? 0 };
  } catch {
    return null;
  }
}
