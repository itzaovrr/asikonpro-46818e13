# Mobile App-Like UI Pass

Goal: every page feels like a native app (Play Store / bKash / foodpanda / Duolingo-class), not a web page. Consistent header, spacing, motion, and liquid-glass surfaces across Home, Shop, Learn, Community, Mentors, Profile, Cart, Wishlist, Orders, Settings, Product Detail, Lesson Detail, Track Detail.

## 1. Shared mobile page shell

Create one reusable shell so every page looks identical in structure.

`src/components/layout/MobilePageHeader.tsx`
- Sticky, glass-strong, hairline-bottom, height 52px
- Left: optional back chevron (auto-detect non-root routes) OR page icon
- Center: minimal title — Inter 16px / semibold / tracking-tight (NOT display font, NOT large)
- Right: 1–2 contextual actions (search, filter, share, more)
- Safe-area top padding
- Hides title on scroll-down, shows on scroll-up (use existing `use-scroll-direction`)

`src/components/layout/MobilePage.tsx`
- Wraps children with: header slot, scroll container, consistent `px-4`, `pt-3`, `pb-[calc(72px+env(safe-area-inset-bottom))]` (clears BottomNav)
- Optional sticky sub-tabs slot (glass chip row) — used by Shop, Community, Profile
- Built-in page-enter fade (no flash)

## 2. Section primitives (consistency)

`src/components/ui/mobile-section.tsx`
- `<MobileSection title actionLabel onAction>`
- Title: 13px uppercase tracking-wide muted-foreground (eyebrow style) — NOT big H2
- Trailing action: small text-primary link, 12px
- Vertical rhythm: `mt-6 first:mt-2`, internal `space-y-3`

`src/components/ui/mobile-card.tsx`
- Wraps `.glass rounded-2xl p-4` with pressable + safe tap target
- Variants: `flat` (no border, subtle bg), `glass` (default), `outline`

These replace ad-hoc divs in Home workspace, Shop, Community, Profile cards.

## 3. Per-page application

Apply the shell + primitives to:

- `Index.tsx` — Home: GreetingStrip becomes header eyebrow; remove duplicate big headings; tighten section gaps to `space-y-5`
- `Shop.tsx` — header with search icon + filter icon; sticky category chip row; product grid `grid-cols-2 gap-3`
- `Learn.tsx` — header "Learn"; track cards as glass-mobile-cards
- `Community.tsx` — header "Community" + tabs sticky under it
- `Profile.tsx` — collapsible header (avatar shrinks on scroll), tabs stick
- `Mentors.tsx`, `Cart.tsx`, `Wishlist.tsx`, `Orders.tsx`, `Settings.tsx`, `About.tsx` — adopt MobilePage + minimal title
- `ProductDetail.tsx`, `LessonDetail.tsx`, `TrackDetail.tsx`, `OrderDetail.tsx` — back chevron + share/more in header; sticky bottom action bar already in place, just align spacing

## 4. Visual + motion polish

- Replace remaining `H1 text-3xl` page titles on mobile with 16px header titles
- Standard radii: cards `rounded-2xl`, chips `rounded-full`, sheets `rounded-t-3xl`
- All tappable surfaces use `.pressable` (scale 0.98 on active) — bKash/foodpanda feel
- Add `glass-subtle` to sticky tab rows so they layer cleanly over scrolling content
- 180ms fade between routes via existing `PageTransition`
- Skeletons everywhere: replace blank loading states with `<Skeleton class="rounded-2xl">` blocks matching final card shape (Play Store pattern)

## 5. Spacing system (locked)

- Page side padding: `px-4` (16px), never less on mobile
- Between sections: `mt-6`
- Inside a card: `p-4`, internal `space-y-3`
- Between cards in a list: `space-y-3`
- Sticky header height: 52px; sticky tabs row: 44px
- Bottom safe-area: handled by MobilePage

## 6. Technical notes

- No business logic, hooks, or data changes
- Desktop (`lg+`) is untouched — DesktopHeader/Sidebar already handle it; new shell only renders its header on `<lg`
- BottomNav stays as-is (already finalized)
- All colors via semantic tokens; glass via existing `.glass` / `.glass-strong` / `.glass-subtle` utilities — no new CSS variables needed
- Reuse: `use-scroll-direction`, `MobileScroller`, `StickyActionBar`, `PageTransition`, `Reveal`

## Out of scope

- No new features, no copy rewrites, no backend
- No icon library swap
- Desktop layout changes
