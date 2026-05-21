## Goal
Make the admin bottom nav stretch full-width pinned to the bottom edge, and ensure admin pages use the full available width.

## Changes

**1. `src/pages/admin/AdminBottomNav.tsx`**
- Remove the `max-w-lg mx-auto` constraint on the inner row so the nav fills the entire viewport width edge-to-edge (currently it's centered as a narrow pill on wider mobile/tablet screens).
- Keep it `fixed bottom-0 inset-x-0` (already correct).
- Keep the safe-area padding for iOS home indicator.

**2. `src/pages/admin/AdminLayout.tsx`**
- The `<main>` already has no max-width wrapper, but I'll audit the horizontal padding so content uses the full width on mobile (`px-3` → drop to `px-2` or keep as-is depending on visual check).
- No structural changes needed beyond confirming pages render edge-to-edge under the sidebar/header.

**3. Quick audit of admin pages**
- Verify no individual admin page (Overview, Products, Community, Users, Orders, etc.) wraps content in a `max-w-*` container that would prevent full-width rendering. Only adjust if a constraint is found.

## Out of scope
- No visual redesign of the nav items, icons, or active-pill animation.
- No changes to desktop sidebar layout.