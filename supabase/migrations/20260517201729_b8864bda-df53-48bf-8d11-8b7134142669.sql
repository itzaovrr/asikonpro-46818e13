
-- 1. Profiles: restrict public SELECT (remove `OR true`)
DROP POLICY IF EXISTS "Public profile fields viewable" ON public.profiles;
CREATE POLICY "Authenticated users view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 2. lesson_completions: attach XP-enforcement trigger
DROP TRIGGER IF EXISTS enforce_lesson_xp_trigger ON public.lesson_completions;
CREATE TRIGGER enforce_lesson_xp_trigger
  BEFORE INSERT OR UPDATE ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_lesson_xp();

-- 3. lesson_completions: unique (user_id, lesson_id) — dedupe existing rows first
DELETE FROM public.lesson_completions a
  USING public.lesson_completions b
  WHERE a.ctid < b.ctid
    AND a.user_id = b.user_id
    AND a.lesson_id = b.lesson_id;
ALTER TABLE public.lesson_completions
  DROP CONSTRAINT IF EXISTS lesson_completions_user_lesson_unique;
ALTER TABLE public.lesson_completions
  ADD CONSTRAINT lesson_completions_user_lesson_unique UNIQUE (user_id, lesson_id);

-- 4. learner_profiles: protect xp/streak/level from self-write
CREATE OR REPLACE FUNCTION public.protect_learner_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.xp             := OLD.xp;
    NEW.streak_days    := OLD.streak_days;
    NEW.last_active_at := OLD.last_active_at;
  ELSIF TG_OP = 'INSERT' THEN
    NEW.xp          := 0;
    NEW.streak_days := 0;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_learner_profile_fields_trigger ON public.learner_profiles;
CREATE TRIGGER protect_learner_profile_fields_trigger
  BEFORE INSERT OR UPDATE ON public.learner_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_learner_profile_fields();

-- 5. Avatars bucket: restrict MIME types and size
UPDATE storage.buckets
  SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/gif','image/webp'],
      file_size_limit = 5242880
  WHERE id = 'avatars';

-- 6. Lock down SECURITY DEFINER helper from anon
REVOKE EXECUTE ON FUNCTION public.get_or_create_today_mission() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;
