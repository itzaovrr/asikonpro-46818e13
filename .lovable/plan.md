## Use custom SVG for Home icon in BottomNav

**Scope:** `src/components/layout/BottomNav.tsx` + new asset file.

### Steps
1. Copy `user-uploads://home-1-svgrepo-com.svg` to `src/assets/icons/home.svg` (the cleaner version, stroke color will be overridden via `currentColor`).
2. Edit the SVG file so the `stroke` attributes use `currentColor` instead of the hardcoded `#1C274C`. This lets it inherit `text-primary` / `text-muted-foreground` like the lucide icons.
3. In `BottomNav.tsx`:
   - Remove `House` from the lucide import.
   - Create a small `HomeIcon` component that renders the SVG inline (or import as ReactComponent via `?react` if vite-plugin-svgr is available; otherwise inline the JSX). Inline JSX is safest — no plugin dependency.
   - Apply the same className/strokeWidth pattern as other tabs so active/inactive states still work (color shift + slight translate).
   - Wire it into the `tabs` array in place of `House`.

### Out of scope
Other tab icons, header, styling tokens, behavior.
