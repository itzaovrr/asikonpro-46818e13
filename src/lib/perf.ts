/**
 * Lightweight client-side performance instrumentation.
 *
 * - Logs route navigation timings (mount → first paint after route change).
 * - Wraps `window.fetch` once to log Supabase REST/RPC/Storage latency.
 * - Provides `perfMark` / `perfMeasure` helpers for ad-hoc timing.
 *
 * All output is grouped under the `[perf]` prefix so it can be filtered in
 * DevTools. Disable in production builds by checking `import.meta.env.DEV`.
 */

const ENABLED = typeof window !== "undefined" && import.meta.env.DEV;

interface NetEntry {
  url: string;
  ms: number;
  status: number;
  ts: number;
}

const recent: NetEntry[] = [];
const MAX = 100;

export function logNet(entry: NetEntry) {
  if (!ENABLED) return;
  recent.push(entry);
  if (recent.length > MAX) recent.shift();
  const tag = entry.ms > 1500 ? "🐢" : entry.ms > 500 ? "⚠️" : "⚡";
  // eslint-disable-next-line no-console
  console.debug(
    `[perf] ${tag} ${entry.ms.toFixed(0)}ms  ${entry.status}  ${shortUrl(entry.url)}`,
  );
}

function shortUrl(u: string) {
  try {
    const url = new URL(u);
    return url.pathname + (url.search ? url.search.slice(0, 60) : "");
  } catch {
    return u;
  }
}

export function getRecentNet() {
  return [...recent];
}

let installed = false;
export function installFetchTimer() {
  if (!ENABLED || installed || typeof window === "undefined") return;
  installed = true;
  const orig = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const isSupabase = url.includes("supabase.co") || url.includes("/functions/v1/");
    if (!isSupabase) return orig(input, init);
    const start = performance.now();
    try {
      const res = await orig(input, init);
      logNet({ url, ms: performance.now() - start, status: res.status, ts: Date.now() });
      return res;
    } catch (err) {
      logNet({ url, ms: performance.now() - start, status: 0, ts: Date.now() });
      throw err;
    }
  };
}

export function logRoute(pathname: string) {
  if (!ENABLED) return;
  const mark = `route:${pathname}:${Date.now()}`;
  performance.mark(mark);
  // Measure paint after the next two animation frames (commit + paint).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const elapsed = performance.now() - performance.getEntriesByName(mark)[0].startTime;
      const slow = recent.filter((n) => n.ms > 500).slice(-5);
      // eslint-disable-next-line no-console
      console.groupCollapsed(
        `[perf] route ${pathname} → painted in ${elapsed.toFixed(0)}ms`,
      );
      if (slow.length) {
        // eslint-disable-next-line no-console
        console.table(
          slow.map((n) => ({ ms: Math.round(n.ms), status: n.status, url: shortUrl(n.url) })),
        );
      } else {
        // eslint-disable-next-line no-console
        console.debug("no slow Supabase calls");
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
      performance.clearMarks(mark);
    });
  });
}
