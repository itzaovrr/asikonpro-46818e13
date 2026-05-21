# Asikon Improvements — Implementation Plan

I'll work through all 7 sections in order. Below is the breakdown with technical details and key decisions.

---

## Section 1 — Critical Bug Fixes

**1.1 longestStreak**
- Migration: `ALTER TABLE learner_profiles ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0`
- Update `handle_lesson_completion()` to bump `longest_streak` when `new_streak > longest_streak`
- Backfill: `UPDATE learner_profiles SET longest_streak = streak_days`
- `useGameData.ts` returns the real column

**1.2 Quick Actions on /game**
- New components: `LeaderboardSheet`, `HistorySheet`, `RulesDialog`
- Rank → top 10 from `learner_profiles` (with profile join for name/avatar) ordered by xp desc
- History → last 10 `lesson_completions` joined with `lessons(title)`
- Rules → static modal explaining coins/XP/streaks
- Invite → `navigator.share({ url: window.location.origin })` with clipboard fallback

**1.3** Remove `const db: any = supabase` — use typed client.

**1.4** Move `<ErrorBoundary>` to `main.tsx` wrapping `<HelmetProvider>`.

---

## Section 2 — Navigation

**2.1** BottomNav: Home, Explore, **Earn (Game/Trophy)**, AI (Wand2), Profile. Remove Community.
Update `nav-map.ts` TABS array and add `/game` matchers.

**2.2** Profile page — add a "More" section card linking to Orders, Wishlist, Mentors, Prompts, Community, About, Settings.

---

## Section 3 — UI & Visual

**3.1** Delete fashion images. Replace with SVG-based gradient placeholders generated locally (`src/assets/learning-*.svg`) using book/laptop/grad-cap themes. Update any imports.

**3.2** Theme toggle button (Sun/Moon) using `useTheme` from next-themes in `MobileHeader` and `DesktopHeader`/`UserMenu`.

**3.3** `index.css` light theme: change `--accent` to `262 83% 58%`.

**3.4** `AiAssistantBox` — array of 4 suggestions, `useMemo` shuffle on mount.

**3.5** `SmartImage` — add `loaded` state, render `<Skeleton>` overlay while loading.

**3.6** `HeroCarousel` — 3 CSS gradient slides with lucide icons, no new image files.

---

## Section 4 — SEO

Add `<Helmet>` blocks with title + description to: Shop, Community, Profile, Mentors, About (confirm Learn/Game already done).

---

## Section 5 — Cleanup

Delete `src/components/community/tabs/LiveTab.tsx` and `OffersTab.tsx`, remove imports from `CommunityTabs.tsx`/`Community.tsx`.

---

## Section 6 — Gamification Backend

**6.1** XP/coins on completion — `handle_lesson_completion()` already does XP+streak via trigger. Update it to:
- Add `UPDATE profiles SET coins = coins + 5 WHERE id = NEW.user_id` (bypasses protect trigger via SECURITY DEFINER + direct UPDATE? — the protect trigger blocks non-admin updates. Solution: have the trigger function run as definer and set a session GUC, OR adjust `protect_profile_privileged_fields` to allow trigger context. Cleanest: modify protect trigger to allow when `current_setting('app.allow_coin_grant', true) = 'on'`, and set it in the lesson trigger.)
- Bump `longest_streak` (per 1.1)

**6.2** New `rewards` table:
```
id uuid pk, title text, description text, type text,
coins_required int, image_url text, is_active bool,
display_order int, created_at, updated_at
```
RLS: public SELECT where `is_active`, admin ALL.
Game page fetches from `rewards` table instead of hardcoded.

---

## Section 7 — Admin

**7.1** New `/asikonasik/rewards` route with `AdminRewards.tsx` (list + create/edit/delete form using existing admin panel patterns). Add nav entry.

---

## Constraints respected
- AdminGuard, /asikonasik path, auth flow, dark default, design tokens — all untouched.
- All new tables get RLS.
- Mobile-first preserved.

---

## Execution order
Migrations first (1.1, 6.1 trigger update, 6.2 rewards table) → frontend bugs (1.2–1.4) → nav (2.x) → UI (3.x) → SEO (4) → cleanup (5) → admin (7).

Proceeding now.
