## Improve BottomNav icons and badges

**Scope:** `src/components/layout/BottomNav.tsx` only (mobile bottom navigation bar).

### Issues observed
1. No notification/badge system exists on bottom nav today — but selected element is the Home icon SVG, and the user references "notification dot" and "badge". Likely meaning: add proper unread/cart count indicators to relevant tabs (e.g. Community unread, Explore cart) and polish the active-state dot.
2. Current icons (`House`, `Compass`, `Wand2`, `Users`, `CircleUser`) feel generic. Swap to a more modern, consistent set.
3. Active indicator pill is heavy; a subtle top-dot indicator reads cleaner on mobile.

### Changes

**Icon swap (modern, filled-on-active feel via stroke weight):**
- Home → `HousePlus` or keep `House` but pair with rounded variant — use **`House`** (already modern in lucide latest)
- Explore (shop) → `Compass` → **`Store`** (clearer "shop" semantic) or **`ShoppingBag`**
- AI (learn) → `Wand2` → **`Sparkles`** (current modern AI convention)
- Community → `Users` → **`UsersRound`** (rounded modern variant)
- Profile → `CircleUser` → **`UserRound`** (cleaner, matches set)

All icons rendered at 24px with `strokeWidth` 2 default / 2.25 active for crisp consistency.

**Badge system:**
- Add optional `badge?: number` per tab. Render a small pill top-right of the icon:
  - Count badge: `min-w-[18px] h-[18px]` rounded-full, `bg-primary text-primary-foreground`, `text-[10px] font-bold`, shows `9+` when >9.
  - Dot-only (unread, no count): `h-2 w-2` rounded-full, `bg-primary` with soft glow ring, positioned `-top-0.5 -right-0.5` on the icon wrapper.
- Wire cart count to Explore tab via `useCart` and a notifications/unread dot on Community (placeholder hook, count=0 hidden).

**Active indicator polish:**
- Replace large background pill with: (a) icon color shift to `text-primary`, (b) label weight bump, (c) a 4px primary dot centered **above** the icon (top: 6px) with smooth scale-in. Drops visual weight, makes badges readable.

**Accessibility:**
- Badges wrapped in `aria-label="{n} unread"` for screen readers.
- Hit area unchanged.

### Files
- `src/components/layout/BottomNav.tsx` — icon swap, badge prop + render, active indicator restyle.
- Optional: import `useCart` for live cart count on Explore tab.

### Out of scope
Desktop sidebar, headers, mega menu, route changes.