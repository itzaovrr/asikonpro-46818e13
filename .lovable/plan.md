## Goal
Make the home page feel like a polished native mobile app — tight gutters, scannable sections, trust-forward but text-light, and a single consistent product card used everywhere.

## Scope
Visual + structural refinements on:
- `src/pages/Index.tsx` (home composition)
- `src/index.css` (spacing + typography tokens)
- `src/components/shop/ProductCard.tsx` (universal card)
- `src/components/carousels/ProductCarousel.tsx` (gutters/header)
- Section pieces: `HeroBanner`, `quick_actions`, `quick_categories`, `why_trust`, `how_it_works`, `final_cta`, `community`

Out of scope: backend, edge functions, routing, auth, data models. No new pages.

---

## 1. Tighter mobile gutters (consistency)
- Add a single `section-x` token: mobile `px-3` (12px), `sm:px-4`, `lg:px-0`. Today some places use `px-4`, others `pl-4`, others `mx-4` → inconsistent.
- Standardize vertical rhythm to `space-y-5 sm:space-y-7` between sections (currently varies).
- Carousel pl/mobile padding aligned to the same 12px.

## 2. Trust-forward, less text
- Replace long subtitles in `how_it_works` / `why_trust` / `testimonials` headers with a single short line (≤ 6 words).
- Promote a compact **trust ribbon** under the hero on mobile: 3 chips (Verified content · 10K+ learners · 7-day refund) using existing icons. Single row, no wrap.
- Reduce `final_cta` copy to a one-liner + two buttons.
- Strip duplicate "ASIKON Academy" brand chip on cards (already implied).

## 3. Native-feel cards
Refactor `ProductCard` (and the inline curated card in Index) into one component with two variants:
- `compact` (default mobile/grid): 1:1 image, 2-line title, price + rating in one row, badge stack capped at 2.
- `wide` (carousel): same dims, slightly larger price.
- Rounded `rounded-2xl`, hairline border `border-border/60`, `shadow-sm` resting → `shadow-md` on press, subtle `active:scale-[0.98]` for tap feedback (mobile-app feel).
- Remove hover overlay + "Quick View" button on mobile (touch can't hover); keep on `md+`.
- Always-visible save icon top-right, 32px tap target.
- Drop the brand line when brand === store default to save vertical space.

Apply this single card in: trending, new_arrivals, curated, and any future product grid → kill the duplicate inline JSX in `Index.tsx`.

## 4. Section UI polish (mobile-native)
- **Hero**: shrink height on mobile to 220px, full-bleed (no horizontal padding), rounded only on `sm+`.
- **Quick actions**: collapse to a single horizontal pill row on mobile (AI Tutor · Streak · Prompts · Mentors) instead of 2 large cards stacked.
- **Quick categories**: 4-col grid stays, but smaller cards (aspect-[1.1] not square), icon 18px, label 11px → looks like an app launcher row.
- **How it works**: convert to numbered horizontal scroll cards on mobile, 3-col grid on desktop.
- **Why trust**: convert to 2×2 compact grid on mobile (not horizontal scroll) — more scannable.
- **Community**: show 1 PostCard mobile, 2 on `sm+`.
- **Section headers**: smaller eyebrow + title, no subtitle on mobile.

## 5. Typography & color consistency
- Headings: `font-display` (Space Grotesk) at `text-[17px] sm:text-xl` for section titles, `tracking-tight`.
- Body: `text-[13px] sm:text-sm` muted-foreground.
- Eyebrows: `text-[10px] uppercase tracking-[0.16em]` (already used in `InsightCard` — make site-wide).
- Use only semantic tokens (`primary`, `accent`, `muted-foreground`, `gradient-primary`). No raw hex/colors.
- Standardize radii: cards `rounded-2xl`, chips `rounded-full`, buttons default.

Note: Memory says brand is "Dark red gradient" but current `index.css` uses indigo/blue. I will **not** change palette tokens in this pass — only ensure consistent token use. If you want the palette retuned to dark red, say so and I'll handle it separately.

## 6. Code quality
- Extract section renderers from `Index.tsx` (currently ~400 lines, big `SECTION_RENDERERS` map) into `src/components/home/sections/*.tsx` — one file per section.
- `Index.tsx` becomes a thin orchestrator: fetch data → map sections.
- Delete inline curated card JSX, reuse `ProductCard`.
- Remove unused imports after extraction.
- Add `section-x` and `eyebrow` utility classes in `index.css` for reuse.

---

## Files touched
- `src/index.css` — add `.section-x`, `.eyebrow` utilities; tweak spacing tokens.
- `src/pages/Index.tsx` — slim down, import extracted sections.
- `src/components/home/sections/` — new: `HeroSection.tsx`, `TrustRibbon.tsx`, `QuickActions.tsx`, `QuickCategories.tsx`, `HowItWorks.tsx`, `WhyTrust.tsx`, `CommunitySection.tsx`, `Testimonials.tsx`, `FaqSection.tsx`, `FinalCta.tsx`.
- `src/components/shop/ProductCard.tsx` — tighter mobile variant, tap states, drop hover overlay on touch.
- `src/components/carousels/ProductCarousel.tsx` — align gutters to `section-x`.
- `src/components/home/HeroBanner.tsx` — shorter mobile height, full-bleed.

## Verification
- 393×701 (current viewport): no horizontal overflow, gutters identical across all sections, hero/cards/buttons all use same radii, trust ribbon visible above-the-fold.
- 768 / 1280: grids re-flow, no regression.
- No console/runtime errors; route `/` renders all sections in order from `useHomeSections`.

## One quick confirmation before I build
Brand palette: keep current indigo/blue, or retune to the "Dark red gradient" noted in project memory? I'll proceed with current palette unless you say otherwise.
