/**
 * Thin localStorage persistence helpers used by the mock services (DemandService, AuthService)
 * until a real backend exists. SSR/no-storage safe — falls back to the given default silently.
 */

const PREFIX = 'waschly_';

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, state stays in-memory.
  }
}

export function clearStorage(key: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}
