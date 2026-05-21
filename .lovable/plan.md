# Asikon — 10-Point Improvement Plan

Tackling all 10 items in three phases (Critical → Medium → Polish). Each item lists the exact files touched and the approach. No source files will be edited until you approve.

---

## Phase 1 — Critical Fixes

### 1. Wire `/game` to real Supabase data
**Files:** `src/pages/Game.tsx`, new `src/hooks/useGameData.ts`, new migration for `reward_redemptions`.

- Replace `mockUser` with live data from `profiles` (coins) + `learner_profiles` (xp, streak_days) via a new `useGameData` hook.
- Derive **level** from `xp` (e.g. `Math.floor(xp / 100) + 1`) — keep client-side, no schema change.
- Replace `mockChallenges` with real progress: query `lesson_completions` joined with `lessons`/`tracks` to build "enrolled course" cards with `done / total` counts.
- Build weekly activity bars from `lesson_completions.completed_at` grouped by weekday (last 7 days).
- New table `reward_redemptions` (id, user_id, reward_key, coins_spent, created_at) with RLS (`user_id = auth.uid()` for insert/select). Redeem button inserts a row and decrements `profiles.coins` via an edge function (coins is admin-protected by trigger) — or simpler: edge function `redeem-reward` with service role that validates balance and writes both rows atomically.

### 2. Global ErrorBoundary
**Files:** new `src/components/ErrorBoundary.tsx`, `src/App.tsx`.

- Class component catching render errors; shows branded fallback (logo, "Something went wrong", Reload + Go Home buttons) using existing design tokens.
- Wrap `<BrowserRouter>` subtree inside `<ErrorBoundary>` in `App.tsx`.

### 3. Fix `/learn` blank flash
**Files:** `src/pages/Learn.tsx`, reuse `src/components/ui/skeleton.tsx`.

- While `loading` (auth) or `isLoading` (threads) is true, render a skeleton shell (sidebar thread skeletons + chat skeleton) instead of returning nothing.
- Only show the "Sign in" CTA after auth resolves and user is confirmed null.

---

## Phase 2 — Medium Fixes

### 4. Community Live/Offers tabs
**Files:** `src/components/community/CommunityTabs.tsx`, `src/pages/Community.tsx`.

- Approach: **hide** both tabs from the visible tab bar (cleanest given no backing data). Keep the tab components in repo but unmount routes. Add a comment marking them as "ship when content exists."
- If you'd rather keep them visible with a "Soon" pill, say the word and I'll switch the approach.

### 5. Remove Mentors from bottom nav
**Files:** `src/components/layout/BottomNav.tsx`, `src/components/layout/sidebar/SidebarNav.tsx`, `src/lib/nav-map.ts`.

- Strip the Mentors entry from primary nav arrays. Route stays mounted in `App.tsx` so direct links + admin still work; just no nav surface.

### 6. Reset-password flow verification
**Files:** `src/pages/Auth.tsx` (forgot-password call), `src/pages/ResetPassword.tsx`, `src/App.tsx` route.

- Audit: confirm `resetPasswordForEmail` uses `redirectTo: ${window.location.origin}/reset-password`.
- Confirm `/reset-password` route is public (it is — already in `App.tsx`).
- Confirm `ResetPassword.tsx` listens for `PASSWORD_RECOVERY` event (it does) and calls `updateUser({ password })` then redirects to `/` (it does).
- If `redirectTo` is wrong or missing in `Auth.tsx`, fix it. Test by sending a real reset email after deploy.

---

## Phase 3 — Improvements

### 7. Rename package
**Files:** `package.json` → `"name": "asikonpro"`.

### 8. Learn page skeletons
**Files:** `src/components/learn/ThreadList.tsx`, `src/components/learn/LearnChat.tsx`.

- Replace empty states during `isLoading` with skeleton rows (sidebar) and a transcript skeleton (chat area). Reuse existing `TranscriptSkeleton` if present, otherwise build from `Skeleton`.

### 9. Branded 404
**Files:** `src/pages/NotFound.tsx`.

- Rebuild with dark gradient bg, Asikon logo, "Page not found" heading, friendly subcopy ("This page wandered off…"), primary CTA → `/`, secondary → `/learn`. Use existing tokens (`gradient-primary`, `text-gradient`).

### 10. Per-page SEO
**Files:** `src/main.tsx` (HelmetProvider), all listed pages, `package.json` (add `react-helmet-async`).

- Install `react-helmet-async`, wrap app in `<HelmetProvider>`.
- Add `<Helmet>` to `Shop.tsx`, `Learn.tsx`, `Community.tsx`, `Mentors.tsx`, `About.tsx`, `Index.tsx` with unique `<title>`, `<meta name="description">`, canonical, and og:title/description.
- Update `index.html` sitewide defaults; remove the static canonical so per-route Helmet canonicals don't double up.

---

## Execution order
1. Migration for `reward_redemptions` (needs your approval before SQL runs).
2. Phase 1 code (Game wiring, ErrorBoundary, Learn loading).
3. Phase 2 code (tabs, nav, reset flow audit).
4. Phase 3 code (package name, skeletons, 404, SEO).

## Open questions
- **Community tabs:** hide entirely, or keep visible with a "Coming Soon" badge?
- **Game rewards:** OK to add a `reward_redemptions` table + edge function for atomic redeem? (Required because `coins` is trigger-protected from client writes.)
