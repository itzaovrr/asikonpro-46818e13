/**
 * Tiny localStorage cache for react-query payloads.
 *
 * Used to make repeat visits to the home feed feel instant: we hand the cached
 * value to react-query as `initialData` so the UI renders immediately, and the
 * background refetch silently replaces it when a fresh response arrives.
 */
const PREFIX = "kz-cache:v1:";
const DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes

interface Wrapper<T> {
  v: T;
  exp: number;
}

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function readCache<T>(key: string): T | undefined {
  const w = safeWindow();
  if (!w) return undefined;
  try {
    const raw = w.localStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Wrapper<T>;
    if (!parsed || parsed.exp < Date.now()) {
      w.localStorage.removeItem(PREFIX + key);
      return undefined;
    }
    return parsed.v;
  } catch {
    return undefined;
  }
}

export function writeCache<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  const w = safeWindow();
  if (!w) return;
  try {
    const wrap: Wrapper<T> = { v: value, exp: Date.now() + ttl };
    w.localStorage.setItem(PREFIX + key, JSON.stringify(wrap));
  } catch {
    // quota exceeded or serialization error — ignore
  }
}

export function cacheKey(parts: unknown): string {
  return typeof parts === "string" ? parts : JSON.stringify(parts);
}
