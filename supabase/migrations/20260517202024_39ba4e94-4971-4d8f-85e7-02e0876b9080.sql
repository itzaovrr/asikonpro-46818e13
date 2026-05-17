
-- Tighten mentor_waitlist INSERT: require authenticated user submitting on behalf of themselves
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.mentor_waitlist;

CREATE POLICY "Authenticated users can join waitlist"
ON public.mentor_waitlist
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Revoke EXECUTE on trigger-only SECURITY DEFINER functions; they are invoked by triggers, not via PostgREST
REVOKE EXECUTE ON FUNCTION public.enforce_lesson_xp() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_lesson_completion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_learner_profile_fields() FROM PUBLIC, anon, authenticated;
