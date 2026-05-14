/**
 * Typed-loose escape hatch for tables that exist in the database but
 * are not yet present in the auto-generated `src/integrations/supabase/types.ts`.
 * Use this only for new Phase 1+ learning tables (tracks, lessons, learner_profiles, etc.).
 */
import { supabase } from "@/integrations/supabase/client";
export const db = supabase as unknown as {
  from: (table: string) => any;
  rpc: (fn: string, args?: any) => any;
  auth: typeof supabase.auth;
  channel: typeof supabase.channel;
};
