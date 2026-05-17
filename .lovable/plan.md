## Goal

1. **Remove POD entirely** from the app (UI, routes, components, nav entries, home section, admin page, hooks, assets references).
2. **Add 1-on-1 Mentorship** — a new feature targeted at parents booking a personal teacher for their child. Ship as a "Coming soon" experience: home section + `/mentors` landing page with mentor cards + waitlist signup form (child-focused fields).

---

## Part 1 — Remove POD

### Files to delete
- `src/pages/Pod.tsx`, `src/pages/PodBuilder.tsx`, `src/pages/PodDesigns.tsx`, `src/pages/PodUpload.tsx`
- `src/components/pod/` (entire folder, includes `PodHeroBanner`, `LimitedDrops`, `CreatorSpotlight`, `TrendingDesignsCarousel`, `builder/*`, `index.ts`)
- `src/hooks/usePodDesigns.ts`
- `src/pages/admin/AdminPod.tsx`

### Files to edit
- `src/App.tsx` — remove `/pod`, `/pod/upload`, `/pod/builder`, `/pod/designs` routes and imports.
- `src/lib/nav-map.ts` — drop `/pod` from Explore's `matches`.
- `src/components/layout/MobileHeader.tsx` — remove "Print on Demand" entry from overflow sheet.
- `src/components/layout/sidebar/SidebarNav.tsx` (and any sidebar files) — remove POD links.
- `src/pages/admin/AdminLayout.tsx` — remove POD nav item; remove route in admin router.
- `src/pages/Profile.tsx` + `src/components/profile/tabs/ProfileDesignsTab.tsx` — remove the Designs tab (or repurpose). Simplest: delete the tab and its file.
- `src/components/community/CreateContentFAB.tsx` — remove POD option if present.
- Any other grep hits for `pod`, `Pod`, `POD`, `print-on-demand`.

### DB
- Leave `pod_designs`, `pod_design_favorites` tables and `pod-designs` storage bucket in place (not destructive). Note in chat that they can be dropped later if desired.

### Memory
- Remove `[Print on Demand (POD)]` line from `mem://index.md`.
- Update core line: "Trust-first fashion app (shop + social + POD)" → drop "+ POD".
- Delete `mem://features/print-on-demand-pod-system`.

---

## Part 2 — 1-on-1 Mentorship feature

### Database (one migration)
- New table `mentors`:
  - `name` (text), `slug` (text unique), `avatar_url`, `bio`, `subjects` (text[]), `languages` (text[] — e.g. `['Bangla','English']`), `hourly_rate` (numeric), `rating` (numeric default 0), `experience_years` (int), `for_age_min` / `for_age_max` (int), `is_active` (bool default true), `display_order` (int).
  - RLS: public SELECT where `is_active`; admins full ALL via `has_role`.
- New table `mentor_waitlist`:
  - `user_id` (uuid, nullable — allow anonymous), `mentor_id` (uuid nullable — null = "any"), `parent_name`, `parent_contact` (phone/email), `child_name`, `child_age` (int), `child_grade` (text), `subject` (text), `goal` (text), `preferred_language` (text), `notes` (text), `status` (text default `'new'`).
  - RLS: anyone can INSERT; only the submitter (`auth.uid() = user_id`) and admins can SELECT; admins can UPDATE/DELETE.
- New `home_sections` row: `key='mentorship'`, `display_order=35` (between quick_categories and trending), `enabled=true`.
- Seed 6 sample mentors via the migration (Bangla/English tutors covering Math, Science, English, Coding, Quran, Art).

### Frontend
- `src/hooks/useMentors.ts` — fetch mentors with React Query.
- `src/components/mentorship/MentorshipHomeSection.tsx` — eyebrow "New · Coming soon", headline "Book a personal teacher for your child", 2–3 trust bullets (verified tutors, Bangla+English, 1-on-1), CTA "Join the waitlist" → `/mentors`. Use existing glass + gradient design tokens.
- `src/pages/Mentors.tsx` — landing page:
  - Hero with same CTA + "Coming soon" badge.
  - `MobileScroller` of mentor cards (avatar, name, subjects chips, languages, age range, "Reserve a slot" button → opens waitlist sheet pre-filled with that mentor).
  - "How it works" 3-step strip.
  - Sticky bottom CTA on mobile → opens waitlist sheet.
- `src/components/mentorship/MentorWaitlistSheet.tsx` — shadcn `Sheet` with zod-validated form: parent name, parent contact, child name, child age, child grade, subject, goal, preferred language (Bangla/English/Both), notes. Submits to `mentor_waitlist`. Toast success + close.
- Wire route in `src/App.tsx`: `/mentors` → `Mentors` page.
- Register `mentorship` section renderer in `src/pages/Index.tsx` `SECTION_RENDERERS`.
- Add `mentorship` key to fallback array in `src/hooks/useHomeSections.ts`.
- Update `src/lib/nav-map.ts` Profile/Explore matches to include `/mentors` under Explore (or its own — Explore is fine).

### Optional admin (nice-to-have, include)
- `src/pages/admin/AdminMentors.tsx` — list/toggle `is_active`, edit basic fields. Link from `AdminLayout`. Also a small view of `mentor_waitlist` entries with status dropdown.

### Memory
- Add core line: "1-on-1 Mentorship: parents book personal tutors for their child. Currently waitlist-only."
- Add `mem://features/mentorship-system` with summary of tables, RLS, components, child-focused form.

---

## Technical notes

- All new colors via existing tokens (`gradient-primary`, `glass`, `aurora-bg`).
- Form validation: zod schema with trim + length caps (name ≤80, contact ≤120, notes ≤500, age 4–18).
- `mentor_waitlist.user_id` set from `useAuth()` if logged in, else null.
- Use `<MissionVision />`-aligned tone, not new mission copy.
- Mobile-first: cards use `MobileScroller` like other home sections.

---

## Order of execution

1. Migration (create tables, RLS, seed mentors, insert home_sections row).
2. Delete POD files + edit references.
3. Build mentorship hook, components, page, route, home section renderer.
4. Update memory.
5. Verify build clean and `/`, `/mentors` render.
