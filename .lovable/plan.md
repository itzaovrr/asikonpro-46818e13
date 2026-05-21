## Goal

Make the app feel like a real desktop web app — not a stretched mobile shell. Lock down one set of breakpoints + container widths, share one animation system, redesign the five remaining pages to match the new Home, and make sure the desktop navigation is always visible and structured.

## 1. Responsive system (foundation)

Standardize on Tailwind defaults so every page reasons about the same widths:

- `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (already the defaults — make sure no component invents its own breakpoint).
- One container token: `container-editorial` (already exists, capped at 1440 px). Drop ad-hoc `container mx-auto`, `max-w-2xl/3xl/6xl` wrappers on page roots; pages opt into a narrower reading width only for forms/articles.
- Reserve the sidebar gutter once in `AppLayout` (already does `lg:pl-60 / lg:pl-16`). Page roots must NOT add their own left padding.
- Define a small set of content widths inside `MobilePage`:
  - `wide` (default, full editorial — Home, Shop, Community feeds)
  - `standard` (max-w-5xl — Profile, Game, Orders)
  - `reading` (max-w-2xl — Settings, Lesson, forms, Checkout right column)
- Replace `section-x` with a single rule: `px-4 sm:px-6 lg:px-0` (parent container handles the lg padding). Audit each section component to remove duplicate horizontal padding.

## 2. Motion system (safe + smooth)

Centralize animation tokens in `index.css`:

- Easing: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)` (already used). Add `--ease-spring` for hover.
- Duration scale: `--dur-fast 160ms`, `--dur-base 240ms`, `--dur-slow 420ms`.
- Hover primitives (utility classes):
  - `.hover-lift` — translateY(-2px) + shadow
  - `.hover-glow` — primary-tinted box-shadow
  - `.hover-tilt` — small rotate/scale for cards
  - All `will-change: transform` only on hover, removed after transition (avoid permanent compositor layers).
- Section reveal:
  - Reuse `Reveal` (already shared IO + 800 ms fallback).
  - Add `useMotion()` hook reading `prefers-reduced-motion` once and exposing `prefersReducedMotion` so components can disable parallax, autoplay carousels, and infinite shimmer.
  - Gate hover-tilt/parallax behind `useMotion()` so reduced-motion users get static cards.
- Performance safeguards:
  - Wrap all `framer-motion`-style transitions in `transform`/`opacity` only — no layout-affecting animations.
  - `Reveal` already uses a shared IntersectionObserver — extend the same pattern to product cards (no per-card observers).
  - Run a profiler pass on Shop + Community after the redesign to confirm no long tasks > 50 ms during scroll.

## 3. Desktop navigation (always structured)

Desktop already has `DesktopSidebar` + `DesktopHeader` (with `NavigationMenu` row). Polish, don't replace:

- Keep the persistent left sidebar (60/16 px collapse) as the primary nav.
- Header stays sticky with the search + currency + cart + theme + user cluster. Trust strip hides on scroll (already done).
- Hide the bottom tab bar on `lg+` — currently `BottomNav` only mounts when `useIsMobile()` is true (good). Verify no page assumes it exists on desktop.
- Add a compact breadcrumb row on inner pages (Product, Order, Lesson, Track) sitting between header and content.
- Make sidebar groups (Menu / Library / Account) collapsible with state persisted to `localStorage`.
- Show active route with the gradient accent bar (already in `NavItem`) and a soft `bg-primary/8` plate.

## 4. Page redesigns (match Home language)

Same rhythm everywhere: editorial container → SectionHeader with gradient bar → grid → `Reveal` wrapping → `hover-lift` cards.

- **Shop** (`/shop`)
  - Two-column at `lg+`: sticky filter rail (already `DesktopFilterRail`) on the left of the main content, products on the right.
  - Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`, gap 4 → 6.
  - Hero strip with category chips + active-filter chips; sort dropdown right-aligned.
  - Reveal-wrap each product row; stagger 40 ms.

- **Game** (`/game`)
  - Desktop split: left = current game / wheel / quiz; right = leaderboard + history + rules cards.
  - Use the same gradient-border panel pattern as the mentorship card.
  - Add a top "stats strip" (XP, streak, coins) styled like ProgressSnapshot.

- **Community** (`/community`)
  - Three-column at `xl+`: left sidebar nav (tabs vertical) · center feed · right rail (CreatorCard, suggestions, live).
  - Center column max-w-2xl for readability.
  - Sticky tab strip under header on `lg-`, vertical on `xl+`.

- **Profile** (`/profile`)
  - Editorial header: cover + avatar lockup left, stats + badges right at `lg+`.
  - Tab strip becomes a horizontal pill row with the gradient accent.
  - Tab content laid out as 2-col (main feed/list + side trust card) at `xl+`.

- **Cart** (`/cart`)
  - Desktop split: items list on the left (max-w-3xl), summary panel sticky on the right (max-w-sm) with shipping, coupon, totals, CTA.

- **Checkout** (`/checkout`)
  - Same split: form (reading width) on the left, sticky order summary on the right with item thumbnails + totals.

Each page also gets:
- `SectionHeader` for every band
- Empty/loading states using the existing skeletons (no raw spinners)
- `Reveal` wrapping for sections, staggered

## 5. QA + verification

- Screenshot every redesigned page at 1280 / 1440 / 1920 widths and confirm: no awkward gutters, sidebar reserved correctly, hero/grid alignment matches Home.
- Run `prefers-reduced-motion: reduce` and confirm reveal/hover/parallax all degrade to static.
- Lighthouse pass on Home + Shop; verify no CLS regression and LCP stays under 2.5 s.

## Technical notes

- Files most affected:
  - `src/components/layout/MobilePage.tsx` (add `maxWidth` presets `wide|standard|reading`)
  - `src/index.css` (motion tokens, hover utilities, refined `section-x`)
  - `src/components/transitions/Reveal.tsx` (add `staggerIndex` prop)
  - `src/hooks/useMotion.ts` (new)
  - `src/pages/Shop.tsx`, `Game.tsx`, `Community.tsx`, `Profile.tsx`, `Cart.tsx`, `Checkout.tsx`
  - `src/components/layout/DesktopSidebar.tsx` (collapsible groups + persistence)
  - `src/components/layout/DesktopHeader.tsx` (breadcrumb slot)
- No data layer / Supabase changes.
- Backwards compatible: mobile layout untouched; all new presets default to current behavior.
