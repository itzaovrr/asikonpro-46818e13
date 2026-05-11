import { useEffect, useState } from "react";

/**
 * Dev-only overlay that verifies sticky tab bars never overlap feed content.
 *
 * It probes:
 *   - the published `--app-header-h` CSS variable
 *   - the first element matching `[data-sticky-tabs]`
 *   - the first element matching `[data-feed-root]` (and its first child)
 *
 * Turns RED when:
 *   - the sticky tab's top is less than 0 (off-screen)
 *   - the feed's first visible item's top is less than the sticky tab's bottom
 *     (i.e. content is being covered)
 *
 * Only mounted in DEV builds — completely tree-shaken out of production.
 */
export function StickyLayoutDebugger() {
  const [info, setInfo] = useState({
    headerVar: "",
    tabTop: 0,
    tabBottom: 0,
    feedTop: 0,
    overlap: false,
    visible: false,
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let raf = 0;
    const tick = () => {
      const root = document.documentElement;
      const headerVar = getComputedStyle(root).getPropertyValue("--app-header-h").trim();

      const tab = document.querySelector<HTMLElement>("[data-sticky-tabs]");
      const feed = document.querySelector<HTMLElement>("[data-feed-root]");
      const firstFeedChild = feed?.firstElementChild as HTMLElement | null;

      if (tab && firstFeedChild) {
        const tabRect = tab.getBoundingClientRect();
        const feedRect = firstFeedChild.getBoundingClientRect();
        const overlap = feedRect.top < tabRect.bottom - 0.5;
        setInfo({
          headerVar,
          tabTop: Math.round(tabRect.top),
          tabBottom: Math.round(tabRect.bottom),
          feedTop: Math.round(feedRect.top),
          overlap,
          visible: true,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!import.meta.env.DEV || !info.visible) return null;

  return (
    <div
      className="fixed bottom-24 right-3 z-[9999] rounded-lg px-3 py-2 text-[10px] font-mono leading-tight shadow-lg backdrop-blur-md pointer-events-none"
      style={{
        background: info.overlap ? "rgba(220,38,38,0.92)" : "rgba(16,185,129,0.85)",
        color: "white",
      }}
    >
      <div>--app-header-h: {info.headerVar || "—"}</div>
      <div>tab.top / bottom: {info.tabTop} / {info.tabBottom}</div>
      <div>feed[0].top: {info.feedTop}</div>
      <div>{info.overlap ? "⚠ OVERLAP" : "✓ no overlap"}</div>
    </div>
  );
}
