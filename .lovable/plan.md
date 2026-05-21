## Bottom Nav Update

Replace the **Earn (Game)** tab with **Community** in the mobile bottom navigation bar.

### Changes

**`src/components/layout/BottomNav.tsx`**
- Replace `Trophy` import with `Users` (from lucide-react)
- Swap the `game` tab object for a `community` tab:
  - id: "community"
  - icon: Users
  - label: "Community"
  - path: "/community"

No changes needed to `nav-map.ts` — the `community` tab is already fully wired for route matching and active-state detection.
