## Goal
Make the home page (`/`) a fast app-like dashboard with only quick, frequently-used actions. Move all trust/marketing content to the About page (your landing/promo surface).

## New home order (top → bottom)

Signed-in:
1. `GreetingStrip` — name + streak
2. `TodayMissionCard` — daily action
3. **Quick Access carousel** (rebuilt — see below)
4. `ContinueLearningRow` — resume lesson
5. `ProgressSnapshot` + XP (compact)
6. `AiAssistantBox` — one-tap AI
7. Trending products carousel
8. New arrivals carousel
9. One community post
10. Slim "Learn more about ASIKON" link → About

Signed-out:
1. Hero carousel
2. Trending carousel
3. New arrivals carousel
4. One community post
5. Slim CTA → About

## Sections REMOVED from home, MOVED to About

- `how_it_works` (3 steps)
- `why_trust` (4-up grid)
- `testimonials` (3 cards)
- `faq` (4 questions)
- Big `final_cta` block
- Hero trust ribbon (Verified / 10K+ / 24/7)

Each becomes a reusable component under `src/components/home/sections/` and is appended to `About.tsx` before `AboutCTA`. Home's `useHomeSections` fallback no longer enables these by default (admin can still toggle them on via DB).

## Quick Access carousel — rebuild

File: `src/components/home/workspace/QuickAccessGrid.tsx` (rewrite internals, keep export name).

- embla-carousel-react, free-scroll, snap, no arrows on mobile, 2 rows × N cols.
- Desktop (`md+`): responsive grid (4/8 cols).
- Tile = glass card, square, icon + 1-line label, `pressable focus-ring`, `active:scale-[0.98]`.
- Covers every destination NOT in the bottom nav (Home/Shop/Learn/Community/Profile):
  Continue · AI Tutor · Planner · Progress · Mentors · Prompts · Saved · Cart · Orders · Tracks · Lessons · Games · Messages · Notifications · Settings · About · Create
- Eyebrow label "Quick access" only — no subtitle on mobile.

## Files

New:
- `src/components/home/sections/HowItWorks.tsx`
- `src/components/home/sections/WhyTrust.tsx`
- `src/components/home/sections/Testimonials.tsx`
- `src/components/home/sections/Faq.tsx`
- `src/components/home/sections/FinalCta.tsx`

Edited:
- `src/pages/Index.tsx` — slimmed, reordered, removed moved sections, slim CTA added
- `src/pages/About.tsx` — appends moved sections before `AboutCTA`
- `src/components/home/workspace/QuickAccessGrid.tsx` — embla carousel + expanded tiles
- `src/hooks/useHomeSections.ts` — FALLBACK disables how_it_works/why_trust/testimonials/faq/final_cta on home

## Out of scope
Backend, schema, copy rewrites, visual redesign of existing cards, admin UI changes.

## Confirm before I build
You mentioned "4 landing/promo pages" but earlier confirmed only **About** as the destination. I'll move all trust/promo content to **About only**. If you also want copies on Shop / Mentors / Prompts, say which sections per page.
