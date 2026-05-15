# Community Posts + Home Sections — Desktop Refinement

Make `/community` posts feel like a modern editorial feed on desktop, swap horizontal lists for proper carousels, and tighten the home page section visuals.

## 1. PostCard (`src/components/community/PostCard.tsx`)

Currently full-bleed with bottom-only border — looks raw on desktop wide.

- Wrap as a `glass` card: `rounded-2xl`, soft border, hover-lift, `max-w-[640px]` centered (mobile stays full-bleed via `rounded-none sm:rounded-2xl` + `border sm:border`).
- Larger avatar (h-11) + display-font username, role/timestamp on a second line with a subtle dot separator.
- Image: `rounded-xl` inside the card with `aspect-[4/5]` mobile / `aspect-[16/10]` desktop, gradient bottom scrim for the "Shop the look" pill.
- Action row: icon-only ghost buttons in a glass strip with hover scale; like uses gradient-soft fill when active.
- Tap target: whole card subtly clickable to open detail (no nav added — just hover state).

## 2. Community page layout (`src/pages/Community.tsx`)

- Desktop two-column: main feed (max 720px, centered) + sticky right rail (320px) with three glass tiles:
  - "Creators to follow" (3 mini cards)
  - "Trending tags" (chip cloud)
  - "Live now" (1–2 LiveCard mini)
- Sticky tabs: glass treatment + gradient hairline, full-width on mobile, container width on desktop.

## 3. Carousels (`src/components/carousels/ProductCarousel.tsx`, `MyFeedTab.tsx`)

- ProductCarousel: real arrows positioned on top edges, gradient edge fades, peek of next slide on desktop, snap, dot pagination on mobile, `eyebrow-bar` style title.
- Replace ad-hoc horizontal scroll in MyFeedTab "Trending Shorts" and Stories with embla carousels with snap + arrows on desktop.
- Add a generic `CardCarousel` wrapper (used by shorts/stories/creators) so all rails behave the same.

## 4. Home page top section (`src/pages/Index.tsx`)

The signed-in mission/XP/track block (lines 375–388) currently looks plain.

- Wrap as a magazine hero: 12-col grid on `lg+`, left 7 = TodayMissionCard with display headline + eyebrow + aurora background; right 5 = stacked XP/Streak glass tile and TrackProgress glass tile with gradient borders.
- Section dividers: replace plain spacing with `eyebrow-bar` titles + soft hairline before each section.
- Add gradient edge fades to all home carousels.

## 5. SectionHeader polish (`src/components/ui/section-header.tsx`)

- Use `eyebrow-bar` style for the title's left accent, "View all →" with `story-link` underline animation.
- Optional kicker eyebrow above the title for editorial feel.

## Out of scope
- Mobile post layout (kept intact, just gains rounded corners on `sm+`).
- Adding new routes or backend changes.
- Other community tabs (videos/shorts/reviews/live) get card polish only if they share components.

## Technical notes
- Reuse existing `embla-carousel-react`, `glass`, `eyebrow-bar`, `display-1/2`, `aurora-bg`, `container-editorial` utilities introduced last turn.
- Keep infinite-scroll behavior in feeds (project memory).
- All colors via HSL semantic tokens — no raw color classes.

```text
Desktop /community
┌───────────────────────────────────────────────┐
│ glass tabs (sticky)                           │
├──────────────────────────┬────────────────────┤
│  PostCard (glass, 640w)  │ Creators to follow │
│  PostCard                │ Trending tags      │
│  PostCard                │ Live now           │
└──────────────────────────┴────────────────────┘
```
