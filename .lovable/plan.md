## Scope

Make the profile fully interactive by completing 5 areas. Most plumbing already exists (`useCreateOrGetChat`, `MessagingDrawer`, `useUserOrders`, `Orders`/`OrderDetail` pages, `useFollowUser`/`useUnfollowUser`); the gaps are wiring, a media lightbox, a real settings backend, and live updates.

---

### 1. Messaging from profile (one-to-one chat)

`Profile.tsx` already calls `useCreateOrGetChat` and opens `MessagingDrawer`, but the drawer doesn't auto-select the freshly created chat — clicking Message lands the user on an empty chat list.

- Pass the new chat id into `MessagingDrawer` via `initialChatId`.
- Fix `MessagingDrawer` selection: replace the misused `useState(() => ...)` initializer with a proper `useEffect` keyed on `initialChatId` + `chats` so the matching `Chat` is selected and the chat window opens.
- Hide the Message button when `isOwnProfile`.
- Disable the button while `createOrGetChat.isPending`, show toast on failure.

### 2. Media tab → media detail viewer

`ProfileMediaTab` already renders a 3-col grid but `onOpen` is unused.

- Add a `MediaLightbox` component (`src/components/profile/MediaLightbox.tsx`) using shadcn `Dialog`: full-screen, swipe/arrow navigation across `mediaItems`, supports both `image` (img) and `video` (HTML5 `<video controls autoPlay>`), shows post caption + "Open post" link to `/community` (or post detail when available).
- Profile.tsx: hold `selectedMediaIndex` state, pass `onOpen` to `ProfileMediaTab`, render `MediaLightbox` with index + setter.
- Keyboard: Esc closes, ←/→ navigate.

### 3. Orders tab + tracking

`ProfileOrdersTab` already lists orders and navigates to `/orders/:id`; `OrderDetail.tsx` exists. Gaps:

- Add a visual tracking timeline to `OrderDetail` (Pending → Processing → Shipped → Delivered) using the existing `statusConfig` — a 4-step horizontal stepper with the current step highlighted; "Cancelled" renders as a red banner instead.
- "View all orders" link at the bottom of the profile Orders tab → `/orders`.
- Empty state CTA in `ProfileOrdersTab` already navigates to shop — keep.
- No schema change.

### 4. Settings tab — privacy + notifications (Supabase-backed)

The profiles table has no privacy/notification fields and `Settings.tsx` only stores notification toggles in local state. Create a dedicated table.

**Migration** — new `public.user_settings` table:

```text
user_settings
  user_id (uuid, PK, FK→auth.users, on delete cascade)
  profile_visibility       text    default 'public'  -- 'public' | 'followers' | 'private'
  show_online_status       boolean default true
  allow_messages_from      text    default 'everyone' -- 'everyone' | 'followers' | 'none'
  show_orders_to_followers boolean default false
  notify_orders            boolean default true
  notify_promotions        boolean default true
  notify_community         boolean default true
  notify_messages          boolean default true
  notify_follows           boolean default true
  created_at, updated_at
```

- RLS: owner can `select/insert/update`; no delete.
- Trigger: auto-insert default row on new auth user (extend `handle_new_user`).
- Backfill insert for existing users.
- `update_updated_at_column` trigger.

**Code**

- `src/hooks/useUserSettings.ts` — `useUserSettings()` + `useUpdateUserSettings()` (react-query, optimistic).
- `Settings.tsx` — split into sections: Profile, Privacy (new), Notifications (wire to Supabase), Account. Each switch calls `useUpdateUserSettings` and shows a toast.
- Enforce `allow_messages_from` client-side in `handleMessage` (skip enforcement server-side this pass — note for follow-up).

### 5. Live follow / unfollow + live counts

`useFollowUser` / `useUnfollowUser` exist but only invalidate `followers`/`following` — the stat row reads from `useProfileCounts` and from `followers/following.length`, so counts can stall.

- In both mutations, also invalidate `["profile-counts", targetUserId]` and `["profile-counts", currentUser.id]`.
- Add optimistic update: increment/decrement `profile-counts` cache immediately on click.
- `ProfileHeader` Follow button: already wired via `ProfileActions` — confirm disabled state while pending and aria-pressed reflects `isFollowing`.
- Realtime channel in `Profile.tsx`: subscribe to `public:user_followers` filtered by `following_id=eq.{targetUserId}`; on insert/delete invalidate `followers` + `profile-counts`. Cleanup on unmount.

---

### Files

**New**
- `src/components/profile/MediaLightbox.tsx`
- `src/hooks/useUserSettings.ts`
- `supabase/migrations/<ts>_user_settings.sql`

**Edited**
- `src/pages/Profile.tsx` — initialChatId, media lightbox state, follow realtime subscription
- `src/components/messaging/MessagingDrawer.tsx` — fix initialChatId effect
- `src/components/profile/tabs/ProfileMediaTab.tsx` — wire onOpen
- `src/components/profile/tabs/ProfileOrdersTab.tsx` — "View all" link
- `src/pages/OrderDetail.tsx` — tracking stepper
- `src/pages/Settings.tsx` — privacy section + Supabase notification toggles
- `src/hooks/useProfile.ts` — invalidate profile-counts in follow/unfollow with optimistic updates

### Out of scope

- Push notifications (only stored prefs, no delivery layer).
- Group chats, message reactions, typing indicators.
- Server-side enforcement of `allow_messages_from` (RLS update on chats can be a follow-up).
- Admin moderation of settings.
