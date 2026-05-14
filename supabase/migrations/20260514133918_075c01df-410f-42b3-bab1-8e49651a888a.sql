
-- 1) profiles: hide sensitive fields from anonymous (public) visitors via column-level grants.
-- Authenticated users (and admins) keep full read access. RLS already permits row visibility.

-- Reset privileges to a known baseline
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM authenticated;

-- Anonymous users can only read non-sensitive, public-display columns
GRANT SELECT (id, username, full_name, avatar_url, cover_url, bio, created_at, updated_at)
  ON public.profiles TO anon;

-- Authenticated users keep full read; writes still gated by RLS policies
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- 2) app_settings: restrict reads to authenticated users only
DROP POLICY IF EXISTS "App settings readable by all" ON public.app_settings;

CREATE POLICY "App settings readable by authenticated"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (true);
