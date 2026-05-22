import { db } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

export interface AuditEntry {
  action: string;
  target_type?: string | null;
  target_id?: string | null;
  meta?: Record<string, any>;
}

/**
 * Fire-and-forget admin audit logger. Failures are swallowed so they
 * never block the destructive action that triggered them.
 */
export function useAuditLog() {
  const { user } = useAuth();
  return useCallback(
    async (entry: AuditEntry) => {
      if (!user) return;
      try {
        await db.from("admin_audit_log").insert({
          actor_id: user.id,
          action: entry.action,
          target_type: entry.target_type ?? null,
          target_id: entry.target_id ?? null,
          meta: entry.meta ?? {},
        });
      } catch (e) {
        // Non-fatal — never block the user action.
        console.warn("audit log failed", e);
      }
    },
    [user],
  );
}

/** Resolve actor usernames in bulk. */
export async function resolveActorNames(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id,username,full_name")
    .in("id", ids);
  const out: Record<string, string> = {};
  for (const p of data ?? []) {
    out[p.id] = p.username ?? p.full_name ?? p.id.slice(0, 8);
  }
  return out;
}
