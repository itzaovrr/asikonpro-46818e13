## Goal
Make `/learn` feel like a native mobile chat app: header + transcript + composer fill the screen exactly once, no overlap with the global bottom nav, and whitespace is balanced across all viewports.

## Root causes today
1. `AppLayout` applies `pb-28` to `<main>` on mobile, but `Learn.tsx` also subtracts `7rem` from `100dvh` — double accounting creates a gap below the composer and pushes content under the bottom nav.
2. There is no single source of truth for the bottom-nav height, so the chat math is guessed.
3. `EmptyState` is top-aligned in a tall flex container → big empty void on mobile.
4. Jump-to-latest pill uses a fixed `bottom-[180px]` that can collide with the composer on short viewports.
5. Composer padding (`px-3 pt-2 pb-3`) plus action-chips row plus disclaimer pushes the input too tall on small phones.

## Changes

### 1. `src/index.css`
- Add a CSS var for the bottom-nav height in `:root`:
  ```
  --bottom-nav-h: calc(58px + env(safe-area-inset-bottom, 0px));
  ```
- Desktop media query: set `--bottom-nav-h: 0px`.

### 2. `src/components/layout/AppLayout.tsx`
- Accept a new prop `fillViewport?: boolean`. When true on mobile:
  - Drop `pb-28` from `<main>`.
  - Set `main` to `h-[100dvh] overflow-hidden` with `paddingTop: var(--app-header-h)` and `paddingBottom: var(--bottom-nav-h)` so children get the exact remaining space.
- Default behavior unchanged for all other pages.

### 3. `src/pages/Learn.tsx`
- Pass `fillViewport` to `AppLayout`.
- Replace the height calc wrapper with `h-full` (parent now sized exactly).
- Sign-in fallback: also use `fillViewport` and center with `h-full`.

### 4. `src/components/learn/LearnChat.tsx`
- Container: `flex flex-col h-full min-h-0`.
- Transcript: `flex-1 min-h-0 overflow-y-auto`.
- Composer wrapper: keep `sticky bottom-0` but inside a non-scrolling sibling — switch to plain block at the bottom of the flex column (no need for sticky once parent is fixed-height); add `shrink-0` and remove the gradient-fade hack that adds visual weight.
- EmptyState: wrap in `h-full flex items-center justify-center` so it centers vertically on mobile instead of clinging to the top.
- Tighten mobile spacing:
  - Header row: `py-1.5`.
  - Transcript inner padding: `px-3 py-3` on mobile (`sm:px-6 sm:py-4`).
  - Composer outer: `px-3 pt-1.5 pb-2`.
  - Disclaimer `mt-1` text-[10px] (kept) but hide on very short viewports via `hidden xs:block` — or just keep, it's tiny.
  - Action-chips row: `pb-1.5` instead of `pb-2`.
- Jump-to-latest pill: anchor with `bottom-[calc(var(--composer-h,140px)+12px)]` — simpler: change to `bottom-28` and add `pointer-events-auto` only on the button; ensures it sits above the composer card without overlap on any height.
- Add `safe-area-bottom` utility to composer wrapper for iOS notch.

### 5. Verification
- Mobile 393×701 and 360×640: header, transcript, composer, bottom nav all visible; no scroll on `<main>`; composer flush above bottom nav; EmptyState centered.
- Tablet 768 and Desktop ≥1024: thread sidebar visible; chat fills viewport minus header; no regression on other pages (Home/Shop/Community keep `pb-28`).
- Send a message → transcript scrolls, composer stays pinned, jump pill appears above composer without overlap.

## Out of scope
No edge-function, message persistence, thread CRUD, or visual redesign of bubbles. Only layout + spacing.
