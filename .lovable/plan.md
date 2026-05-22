## Goal

Make `/asikonasik/users` scale to large datasets and turn each row into a real moderation surface.

## 1. Server-side pagination & filtering (`AdminUsers.tsx`)

Replace the single 1000-row `profiles` query with a paginated query keyed on all filter state:

```ts
queryKey: ["admin-users", { dq, roleFilter, useRange, range, banFilter, page, sort }]
```

Query construction:
- Base: `supabase.from("profiles").select("...", { count: "exact" })`
- Search (`dq`): `.or("username.ilike.%q%,full_name.ilike.%q%,id.ilike.%q%")`
- Date range: `.gte("created_at", from).lt("created_at", toPlus1)`
- Ban filter (new control: All / Active / Banned): `.eq("is_banned", true/false)`
- Sort: `.order(sort.col, { ascending: sort.asc })` (default `created_at desc`)
- Page window: `.range(page*PAGE_SIZE, page*PAGE_SIZE + PAGE_SIZE - 1)`

Role filter (special — roles live in `user_roles`):
- When `roleFilter !== "all"`, first run `select("user_id").eq("role", roleFilter)` (cached separately), then `.in("id", ids)` on the profiles query. When the role has zero users, short-circuit and render an empty page without hitting profiles.

Auxiliary lookups (`learner_profiles`, `lesson_completions` counts, `user_roles`) are scoped to the current page only via `.in("user_id", pageIds)` — no more "fetch everything".

Reset to page 0 on filter change with a `useEffect` that watches `[dq, roleFilter, useRange, range.from, range.to, banFilter, sort]`.

## 2. Visible pagination controls

Below the table:
- `« First`  `‹ Prev`  `[1] [2] … [k-1] [k] [k+1] … [N]`  `Next ›`  `Last »`
- Page numbers built from `totalCount / PAGE_SIZE`, windowed (current ±2, always show first/last, ellipsis in between).
- Show `Showing X–Y of Z`.
- All buttons are real `<Button>` and disabled appropriately. Page state survives navigation via the query key (no URL sync requested).

CSV export switches to "export current page" (default) plus an explicit "Export all matches" that streams via repeated `.range()` calls in 1000-row chunks so it works on very large filtered sets.

## 3. Row-level promote/demote/ban/unban with confirmation

Add a per-row actions column using a `DropdownMenu` with items:
- **Promote to moderator / admin** (super_admin only for admin)
- **Demote from moderator / admin**
- **Ban** / **Unban**
- **Open details**

Each destructive item opens an `AlertDialog` with a clear summary ("Promote @user to admin?") before dispatching the mutation. Mutations:
- `promote(role)` → `user_roles.insert({ user_id, role })` then `audit({ action: "role.grant", target_type: "user", target_id, meta: { role } })`
- `demote(role)` → `user_roles.delete().eq(user_id).eq(role)` + `audit("role.revoke")`
- `setBan(boolean)` → `profiles.update({ is_banned })` + `audit("user.ban" | "user.unban")`

After success: toast, invalidate `["admin-users"]` and `["admin-all-roles"]`. Super-admin role grants/revokes are blocked in UI (only super admin email can hold that). Bulk-ban bar gains a "Bulk unban" sibling and also logs to audit.

## 4. UserDetailDrawer completion

New 6-tab layout: **Profile · Game · Roles · Orders · Activity · Danger**.

New **Roles tab**:
- Current role badges (chips with × to revoke).
- "Grant role" select (`moderator`, `admin`) + Grant button (super_admin only for `admin`).
- **Role history** list: `admin_audit_log.select("*").eq("target_type","user").eq("target_id", userId).in("action", ["role.grant","role.revoke","user.ban","user.unban"]).order("created_at desc").limit(20)` rendered as a timeline with actor username (joined via a small `profiles` lookup on `actor_id`s).

**Profile tab** gains a read-only header block: User ID (copy), email-domain hint (from auth not available client-side — skip), joined date, last seen, current roles summary, XP / coins / lessons / streak quick stats.

**Activity tab** already shows recent lessons + posts; add an "Audit trail" sub-section that reuses the same `admin_audit_log` query (any action on this user) so admins see the full moderation history in one place.

All role/ban mutations inside the drawer share the same `audit()` calls as the row actions to keep history complete.

## Files

- `src/pages/admin/AdminUsers.tsx` — rewrite query layer, add page-number bar, dropdown actions, ban-status filter, reset-on-filter effect.
- `src/components/admin/UserDetailDrawer.tsx` — add Roles tab, role history, audit trail section, header stats block.

## Out of scope

- URL-syncing filters/page (can follow if you want it).
- Hard-deleting `auth.users` (still requires a service-role edge function — current soft delete stays).
- Realtime updates to the user list.
