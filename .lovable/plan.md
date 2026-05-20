## Plan

1. Simplify the Community tab bar positioning in `src/components/layout/MobilePage.tsx`.
   - Remove the current `fixed` tab-strip + invisible spacer approach.
   - Render the tab bar in normal flow with `sticky top-0` inside the page shell so it sits directly under the app header with no compounded offset.
   - Keep its background opaque enough that stories/feed content never shows through while scrolling.

2. Align page spacing with the app shell instead of double-offsetting.
   - Keep `AppLayout` responsible for the global header offset via `paddingTop: var(--app-header-h)`.
   - Make `MobilePage` stop adding extra top-reservation logic for the sticky row, so the tabs start flush at the top of the page content and the stories begin immediately below them.

3. Verify the result on the Community route in a mobile viewport.
   - Confirm there is no visible gap between header and tab bar on first load.
   - Confirm the tab bar remains sticky while scrolling.
   - Confirm the stories row is no longer overlapped or clipped.

## Technical details

- Primary file: `src/components/layout/MobilePage.tsx`
- Likely no structural changes needed in `AppLayout` unless validation shows `--app-header-h` is stale.
- If the header CSS variable still proves inconsistent after the layout simplification, I’ll make a minimal follow-up adjustment in `src/hooks/use-measured-header-height.ts` to ensure the live mounted header always owns the value.