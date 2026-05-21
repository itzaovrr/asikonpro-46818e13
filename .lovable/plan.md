# Route-aware app shell

Goal: switch the desktop chrome based on route, keep mobile unchanged in behavior.

- **Home (`/`)** — full-width top header with a **mega menu** (no sidebar).
- **All other pages** — left **sidebar** + a **slim header** (logo + search + actions, no mega menu).
- **Mobile (all routes)** — top mobile header + **bottom nav** + **drawer sidebar** (current behavior).

## Layout matrix

```text
Route        Desktop chrome                          Mobile chrome
/            TopHeader + MegaMenu (no sidebar)       MobileHeader + BottomNav + Drawer
/shop, ...   DesktopSidebar + SlimHeader             MobileHeader + BottomNav + Drawer
```

## Changes

1. **`AppLayout.tsx`**
   - Read `useLocation()`; compute `isHome = pathname === "/"`.
   - Desktop:
     - If `isHome` → render new `<HomeTopHeader />` (full width, no sidebar, no left padding on `<main>`).
     - Else → render `<DesktopSidebar />` + new `<SlimDesktopHeader />`, keep `lg:pl-60 / lg:pl-16` padding.
   - Mobile: unchanged (MobileHeader + BottomNav + Sheet sidebar).

2. **New `src/components/layout/HomeTopHeader.tsx`**
   - Full-width sticky glass header for Home only.
   - Left: logo lockup. Center: `<MegaMenu />`. Right: search trigger, currency, cart, notifications, theme, user menu.
   - Reuses `TrustStrip` above (hides on scroll, same as today).

3. **New `src/components/layout/MegaMenu.tsx`**
   - Built on existing `NavigationMenu` primitive.
   - Panels: **Learn** (Courses, Tracks, Lessons, AI Tutor), **Shop** (Books, Prompts, Trending, Deals), **Community** (Feed, Reviews, Live), **Mentorship** (Browse mentors, Waitlist), **More** (About, FAQ).
   - Each panel: 2–3 column grid with icon + title + 1-line description, plus a featured card on the right (e.g. "New course" tile).
   - Keyboard accessible; closes on route change.

4. **New `src/components/layout/SlimDesktopHeader.tsx`**
   - Compact one-row header used on non-home pages, sits to the right of the sidebar.
   - Contents: `Breadcrumbs` (left) · `SmartSearch` (center, narrower) · currency · cart · notifications · theme · user menu.
   - No second nav row, no mega menu, no logo (logo lives in sidebar).

5. **`DesktopHeader.tsx`** — keep file but only used as fallback / removed from default path. The new HomeTopHeader and SlimDesktopHeader cover both modes cleanly.

6. **`DesktopSidebar.tsx`** — no behavior change; just not rendered on `/`.

7. **Mobile** — no code change; `MobileHeader` + persistent `BottomNav` + `Sidebar` drawer continue to work on every route including `/`.

## Technical notes

- Route detection in `AppLayout` via `useLocation()`. Exact match on `/` only; `/about`, `/shop`, etc. get sidebar shell.
- `main` padding logic:
  - Home desktop: no `lg:pl-*`.
  - Other desktop: `lg:pl-60` / `lg:pl-16` based on `isCollapsed`.
  - Mobile: existing `pb-28` for bottom nav.
- Header height: `useMeasuredHeaderHeight` already feeds `--app-header-h`; both new headers call it so sticky offsets stay correct.
- Reuse existing tokens (`container-editorial`, `glass`, `hairline-bottom`, `gradient-primary`) — no new colors.
- `prefers-reduced-motion` respected via existing `useMotion` hook for any mega-menu transitions.

## Files

- edit: `src/components/layout/AppLayout.tsx`
- new:  `src/components/layout/HomeTopHeader.tsx`
- new:  `src/components/layout/MegaMenu.tsx`
- new:  `src/components/layout/SlimDesktopHeader.tsx`
- (unchanged) `DesktopSidebar.tsx`, `MobileHeader.tsx`, `BottomNav.tsx`, `Sidebar.tsx`

## Out of scope

- No data/business-logic changes.
- No mobile redesign.
- No changes to page content; only the surrounding shell switches.
