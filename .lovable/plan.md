## Goal

The two-section home desktop header is already in place (Section 1 = logo · centered search · actions; Section 2 = mega menu band). The mega menu in Section 2 currently looks like a plain nav row. Make it feel **premium** while keeping all functionality.

## Scope

Only `HomeTopHeader.tsx` (Section 2 band) and `MegaMenu.tsx` (triggers + dropdown panels). No routing, no data, no sidebar/mobile changes.

## Changes

**Section 2 band (`HomeTopHeader.tsx`)**
- Keep the centered layout, but make the band feel like its own surface:
  - Soft gradient wash (`--gradient-primary-soft`) + bottom hairline.
  - Slight inner shadow / top sheen for the "liquid glass" look used elsewhere.
  - Gracefully collapses (height + opacity) when scrolled, exactly as today.

**Mega menu triggers (`MegaMenu.tsx`)**
- Larger hit area, pill-shaped triggers with:
  - Animated underline / glow on hover and when their panel is open.
  - Small leading icon per top-level item (Learn → GraduationCap, Shop → BookOpen, Community → Users, Mentorship → Heart, About → Compass).
  - Active state when current route belongs to that panel.
- Add a thin animated indicator bar that slides under the active trigger.

**Mega menu panels (`MegaMenu.tsx` → `PanelGrid`)**
- Wider panel (`w-[760px]`), 3 columns: `[1fr_1fr_260px]`:
  1. Primary links (with icon tile + label + description, hover lift).
  2. Secondary "Popular" / "Quick links" list (text-only, compact).
  3. Feature card with gradient background, eyebrow, title, CTA arrow — keep current design but add an image/illustration slot using existing assets (course-ai-ml.jpg, prompt-library.jpg, course-python.jpg) per panel.
- Panel surface: `bg-card/90 backdrop-blur-2xl`, `ring-1 ring-border/60`, `shadow-2xl`, rounded `rounded-2xl`, subtle aurora glow behind.
- Smooth open/close motion (Radix already animates; tune duration + easing via classes).
- Add a footer strip inside each panel: "View all {category} →" link.

**Accessibility & behavior**
- Keep keyboard navigation from Radix `NavigationMenu` intact.
- Close on route change (already wired).
- Respect `prefers-reduced-motion` (no underline slide / aurora animation).

## Out of scope
- Mobile header, sidebar, slim header on inner pages.
- Adding new routes or content sources.
- Search/cart/user actions in Section 1 (already final).

## Files touched
- `src/components/layout/HomeTopHeader.tsx` — restyle Section 2 wrapper only.
- `src/components/layout/MegaMenu.tsx` — triggers + panel layout/visuals.
