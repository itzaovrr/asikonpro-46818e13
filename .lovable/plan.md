# Profile Redesign — Hybrid (IG Header + FB Feed), Fully Functional

Make `/profile` and `/profile/:userId` look like an IG-style identity header on top of an FB-style scrollable feed, with tabs for Posts, Media, Reviews, Learning, Library, Orders, Wishlist. All data comes from Supabase; nothing mocked.

## 1. New layout

Mobile (≤lg):
```
┌──────────────────────────────┐
│ Cover (h-40, gradient bleed) │
│           ◯ Avatar            │ ← centered, overlaps cover
│        Full Name  ✓           │
│           @username           │
│           short bio           │
│  ┌─────┬─────┬─────┬─────┐    │
│  │Posts│Foll.│Foll.│Coins│    │ ← IG stats row, tappable
│  └─────┴─────┴─────┴─────┘    │
│ [Edit Profile] [Share]        │ or [Follow][Message] for others
│ Trust ring + verified chip    │
├──────────────────────────────┤
│ Sticky tabs (scrollable)      │ ← Posts·Media·Reviews·Learning·Library·Orders·Wishlist
├──────────────────────────────┤
│ FB-style feed of post cards   │
└──────────────────────────────┘
```

Desktop (≥lg): two-column — left rail keeps Trust + Badges + About Asikon; right column = identity header + tabs + feed.

## 2. Tabs (real data only)

| Tab | Source | Cross-link |
|---|---|---|
| Posts | `posts` where `user_id` (FB feed cards) | tagged product → `/product/:slug` |
| Media | images/videos from `posts` (3-col IG grid) | tap → post detail/lightbox |
| Reviews | `posts` where `type='review'` | product → `/product/:slug` |
| Learning | `learner_profiles` + `lesson_completions` + `milestones` | lesson → `/lesson/:id`, track → `/track/:slug` |
| Library | `lesson_completions` joined to `lessons`/`tracks` | → `/track/:slug` |
| Orders | `orders` + `order_items` (own profile only) | → `/orders/:id` |
| Wishlist | `wishlists` (own profile only) | → `/product/:slug` |

Other-user profiles only see public tabs (Posts/Media/Reviews/Learning summary). Library/Orders/Wishlist are private (RLS already enforces).

## 3. Stats row links

- Posts → scrolls/selects Posts tab
- Followers / Following → sheet/modal listing users (uses existing `useFollowers`/`useFollowing`), each row → `/profile/:userId`
- Coins → opens Trust details

## 4. Actions

Own profile: `Edit Profile` → navigates to `/settings` (profile section), `Share`, `Create Post` FAB reused.
Other profile: `Follow/Unfollow` (already wired), `Message` (already opens MessagingDrawer), `Report/Block` menu.

## 5. Data wiring (new hooks under `src/hooks/`)

- `useUserOrders(userId)` — `orders` + `order_items` + product joins
- `useUserWishlist(userId)` — `wishlists` + product joins
- `useUserLibrary(userId)` — `lesson_completions` grouped by track
- `useUserReviews(userId)` — `posts` filtered by `type='review'`
- Reuse: `useProfile`, `usePosts`, `useFollowers/useFollowing`, `useLearnerProgress`

All hooks use `@tanstack/react-query` and `supabase` client. Empty states everywhere (no mock data) with a clear CTA.

## 6. Components to refactor / add

Refactor:
- `ProfileHeader.tsx` — centered IG identity, smaller cover, trust ring kept, edit cover/avatar kept (upload pipeline already hardened).
- `ProfileStats.tsx` — 4-cell tappable row, abbreviated counts (1.2K).
- `ProfileTabs.tsx` — sticky under app header, horizontal scroll, animated underline (already there), accept more tabs.
- `ProfileActions.tsx` — IG-style pill buttons; Edit routes to `/settings`.
- `Profile.tsx` — remove all `mockProducts`/`mockReviews`/`mockMedia`/`mockActivities`; render tabs conditionally for own vs other.

Add:
- `tabs/ProfileLearningTab.tsx` — XP bar, streak, milestones grid, completed lessons.
- `tabs/ProfileLibraryTab.tsx` — track cards with progress.
- `tabs/ProfileOrdersTab.tsx` — order list with status badges → `/orders/:id`.
- `tabs/ProfileWishlistTab.tsx` — product grid.
- `FollowersSheet.tsx` — bottom sheet with followers/following lists.

Delete (unused after redesign):
- `ProfileShopTab.tsx`, `ProfileActivityTab.tsx`, `ProfileTrustCard` stays (moved to desktop rail / collapsible on mobile).

## 7. Supabase

Schema already supports everything needed — no migration required. Verified tables: `profiles`, `posts`, `orders`, `order_items`, `wishlists`, `lesson_completions`, `lessons`, `tracks`, `learner_profiles`, `milestones`, `user_followers`. RLS for `orders`/`wishlists`/`lesson_completions` correctly restricts to owner, which matches our "private tabs" rule.

User can manually seed data via Supabase dashboard (SQL Editor) — no admin UI needed for this task. Empty states will guide them.

## 8. Out of scope

- No new admin pages.
- No changes to Community, Shop, or Settings page UI (only deep-link target).
- No payment/order creation flow changes.
- MissionVision block stays on profile per project memory.

## Technical notes

- Routing: add `useNavigate()` for `/settings`, `/product/:slug`, `/orders/:id`, `/track/:slug`, `/lesson/:id`, `/profile/:userId`.
- Sticky tabs: use the same `MobilePage` `sticky` slot pattern recently fixed (no double offset).
- Number formatting helper `formatCount(n)` → `1.2K`/`3.4M` in `src/lib/utils.ts`.
- All colors via semantic tokens (no raw hex/text-white).
- Other-user view hides Edit/Orders/Wishlist/Library tabs; conditional rendering driven by `isOwnProfile`.

