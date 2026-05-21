-- 1) Remove user_followers from realtime publication (ignore error if not a member)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.user_followers';
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- 2) Restrict pod-designs bucket to image MIME types
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/gif','image/webp']
WHERE id = 'pod-designs';

-- 3) Lock down SECURITY DEFINER callable functions: revoke from anon/public; grant authenticated only
REVOKE EXECUTE ON FUNCTION public.redeem_reward(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(text, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_or_create_today_mission() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;
