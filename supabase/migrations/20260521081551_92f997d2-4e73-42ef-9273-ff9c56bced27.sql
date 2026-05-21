DROP FUNCTION IF EXISTS public.protect_pod_design_moderation_fields() CASCADE;
ALTER TABLE public.products DROP COLUMN IF EXISTS is_pod;