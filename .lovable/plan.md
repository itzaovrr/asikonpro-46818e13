## Problem

The mobile bottom nav currently shows **Home · Analyze · Food · + · Plans** — labels left over from a fitness/meal template. They don't match ASIKON's actual pages (Learn, Shop, Community, Profile), so taps land users on routes the labels don't describe. This breaks the entire mobile workflow.

## Goal

Make the bottom nav the single, trustworthy mobile workflow anchor for ASIKON. Every tab maps to a real ASIKON destination, the center FAB does one obvious thing, and back/forward navigation feels predictable.

## Changes

### 1. Rewire `BottomNav` to ASIKON tabs
File: `src/components/layout/BottomNav.tsx`

New 4 tabs + center FAB:

```text
[ Home ]  [ Learn ]   ( + Create )   [ Shop ]  [ Profile ]
   /        /learn                       /shop     /profile
```

- Icons: `Home`, `GraduationCap`, `Plus` (FAB), `ShoppingBag`, `User`.
- FAB → `/create` (already the consolidated content page — matches Core memory).
- Active-state logic stays (filled primary chip), but uses path prefix match so `/learn/:threadId`, `/shop?...`, `/product/:slug`, `/profile/*` all keep the right tab lit.
- Add a 5th overflow entry behind a long-press / "More" sheet for `Community`, `Wishlist`, `Orders`, `Pod`, `About` — keeps the bar at 4 + FAB while reaching every page.

### 2. Sync hide-rules in `App.tsx`
File: `src/App.tsx` (`PersistentMobileShell`)

Extend `hideOn` to also hide the bar on full-screen flows where it gets in the way: `/checkout`, `/lesson`, `/learn/` (chat), `/pod/upload`, `/create`. Keeps the bar on browse/list pages only.

### 3. Active-tab + scroll-restore polish
- `BottomNav`: tapping the already-active tab scrolls the page to top (matches iOS pattern).
- Add a tiny `useScrollRestore` hook used by `AnimatedRoutes` so back-navigation restores prior scroll on list pages (Shop, Community feeds) instead of jumping to top.

### 4. Mobile header alignment
File: `src/components/layout/MobileHeader.tsx`

- Page title reflects current tab (Home/Learn/Shop/Profile) instead of generic brand on inner pages.
- Back chevron appears automatically on non-tab routes (`/product/*`, `/orders/*`, `/lesson/*`, `/track/*`, `/checkout`, `/cart`, `/settings`, `/about`) using `useLocation` + `navigate(-1)`.
- Cart icon stays; search icon stays.

### 5. Route → tab map (single source of truth)
New `src/lib/nav-map.ts` exporting `getActiveTab(pathname)` and `TAB_ROUTES`. Both `BottomNav` and `MobileHeader` import from it so they never drift again.

```text
/                 → home
/learn, /track/*, /lesson/*  → learn
/shop, /product/*, /cart, /checkout, /orders/*, /wishlist  → shop
/community, /pod/*  → home (community surfaces via Home feed)
/profile, /settings, /about  → profile
/create           → FAB (no tab lit)
```

### 6. Safe-area + spacing audit
- Every page already pads `pb-20` via `AppLayout`. Bump to `pb-24` + `env(safe-area-inset-bottom)` so the 68px bar + 12px gap never overlaps content on notched devices.

## Out of scope

- No new routes, no auth changes, no backend.
- Desktop sidebar untouched (it already lists the right items).
- No visual redesign of the bar shape — only labels, icons, routing, and active-state logic change.

## Test checklist (mobile 393px)

1. Tap each tab → lands on correct page, correct tab lit.
2. Open `/product/abc` from Shop → Shop tab stays lit, back chevron returns to Shop.
3. Open `/lesson/xyz` → bottom bar hidden, full-screen reading.
4. Tap FAB on any page → `/create` opens.
5. Long-press Home → "More" sheet shows Community, Wishlist, Orders, Pod, About.
6. Scroll Shop, open a product, hit back → scroll position restored.
