# Make the Community page look professional

## Issues seen in your screenshot
1. Large empty gap between the top "Community" header and the tab strip.
2. The active "My Feed" pill's blue glow halo bleeds into "Posts", making tabs look overlapped and unreadable.
3. Stories row is partially covered by the semi-transparent sticky tab bar when scrolling (Add Story / Asikon circles are cut off at the top).
4. Tab strip feels cramped — labels too tight, no breathing room, no clear active separator.
5. Stories ring uses heavy borders that don't match a modern app feel.

## Changes

### 1. `src/components/community/CommunityTabs.tsx`
- Reduce the pill shadow halo so it no longer bleeds into adjacent tabs (`shadow-sm` instead of the big `0_4px_14px` glow).
- Increase gap between tabs (`gap-1.5`), tighten padding, add an underline-style indicator option for cleaner look.
- Add `scroll-padding` so the focused tab snaps cleanly.
- Slightly larger touch targets (`py-2.5`) and `text-sm` for legibility.

### 2. `src/components/layout/MobilePage.tsx`
- Make the sticky wrapper fully opaque (`bg-background/95 backdrop-blur-md`) instead of `glass-subtle`, so scrolling content doesn't bleed through behind the tab strip.
- Remove the visible gap by ensuring no top margin on the first child; verify the sticky sits flush under the fixed header.

### 3. `src/components/community/tabs/MyFeedTab.tsx`
- Tighten the stories row: smaller story circle wrapper (consistent spacing), `pt-1 pb-3` so the ring isn't clipped at the top.
- Reduce the empty space above stories to zero so they render immediately under the sticky tabs.
- Use the shared `StoryCircle` ring style; remove the dashed `Add Story` style and replace with a soft gradient ring + plus icon matching the rest.

### 4. `src/components/community/CommunityHeader.tsx` (in-page header, currently unused on Community route — the global `MobileHeader` is used)
- Leave the global mobile header alone (currency/cart are global app concerns).
- Optionally hide the `CurrencyToggle` on the Community route to declutter — only if you confirm you want that.

## Out of scope
- No changes to feed cards themselves.
- No backend changes.
- No changes to the global app header (unless you say yes to the optional currency-hide).

## Question
The big white gap above the tab strip in your screenshot — is the page actually scrolled, or does it look like that on first load? If on first load, I'll also audit `useMeasuredHeaderHeight` since the sticky `top` value depends on it.
