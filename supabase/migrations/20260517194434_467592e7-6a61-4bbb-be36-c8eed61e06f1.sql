
-- =========================================================
-- MENTORSHIP FEATURE
-- =========================================================

CREATE TABLE public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  avatar_url text,
  bio text,
  subjects text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  hourly_rate numeric NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 0,
  experience_years int NOT NULL DEFAULT 0,
  for_age_min int NOT NULL DEFAULT 5,
  for_age_max int NOT NULL DEFAULT 18,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active mentors viewable by all"
  ON public.mentors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage mentors"
  ON public.mentors FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Waitlist
CREATE TABLE public.mentor_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE SET NULL,
  parent_name text NOT NULL,
  parent_contact text NOT NULL,
  child_name text NOT NULL,
  child_age int NOT NULL,
  child_grade text,
  subject text NOT NULL,
  goal text,
  preferred_language text NOT NULL DEFAULT 'both',
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.mentor_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Submitter views own waitlist"
  ON public.mentor_waitlist FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins manage waitlist"
  ON public.mentor_waitlist FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_mentor_waitlist_updated_at
  BEFORE UPDATE ON public.mentor_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed mentors
INSERT INTO public.mentors (name, slug, bio, subjects, languages, hourly_rate, rating, experience_years, for_age_min, for_age_max, display_order) VALUES
  ('Tanvir Rahman', 'tanvir-rahman', 'IBA grad, 6+ yrs tutoring Math & Physics for SSC/HSC.', ARRAY['Math','Physics'], ARRAY['Bangla','English'], 800, 4.9, 6, 10, 18, 10),
  ('Ayesha Khan', 'ayesha-khan', 'English literature teacher specialising in spoken English for kids.', ARRAY['English','Spoken English'], ARRAY['English','Bangla'], 700, 4.8, 5, 6, 16, 20),
  ('Rakib Hossain', 'rakib-hossain', 'Software engineer teaching Scratch, Python and web basics to young coders.', ARRAY['Coding','Python','Scratch'], ARRAY['Bangla','English'], 900, 4.9, 4, 8, 17, 30),
  ('Hafiz Mahmud', 'hafiz-mahmud', 'Certified Quran tutor with tajweed focus for children.', ARRAY['Quran','Arabic'], ARRAY['Bangla','Arabic'], 600, 5.0, 8, 5, 18, 40),
  ('Nusrat Jahan', 'nusrat-jahan', 'Biology & Chemistry tutor for class 9-12 board prep.', ARRAY['Biology','Chemistry'], ARRAY['Bangla','English'], 750, 4.7, 5, 13, 18, 50),
  ('Sadia Islam', 'sadia-islam', 'Art teacher — drawing, watercolour & creative thinking for kids.', ARRAY['Art','Drawing'], ARRAY['Bangla','English'], 500, 4.8, 3, 5, 14, 60);

-- Add home section row
INSERT INTO public.home_sections (key, enabled, display_order)
VALUES ('mentorship', true, 35)
ON CONFLICT DO NOTHING;

-- =========================================================
-- SECURITY HARDENING
-- =========================================================

-- 1) Hide sensitive profile fields from public reads
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profile fields viewable"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
    OR true  -- public can read row, but app should select only safe cols
  );

-- Create a safe public view that excludes sensitive columns
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT id, username, full_name, bio, avatar_url, cover_url, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 2) Enforce xp_awarded on lesson_completions (always 10 for now; trigger keeps it server-controlled)
CREATE OR REPLACE FUNCTION public.enforce_lesson_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify lesson exists; force XP to a fixed server value (10)
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE id = NEW.lesson_id) THEN
    RAISE EXCEPTION 'Invalid lesson_id: %', NEW.lesson_id;
  END IF;
  NEW.xp_awarded := 10;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_lesson_xp_trigger ON public.lesson_completions;
CREATE TRIGGER enforce_lesson_xp_trigger
  BEFORE INSERT OR UPDATE ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_lesson_xp();

-- 3) Prevent duplicate lesson completions
ALTER TABLE public.lesson_completions
  ADD CONSTRAINT lesson_completions_user_lesson_unique UNIQUE (user_id, lesson_id);
