-- Add explicit INSERT policy for user_roles to prevent privilege escalation
-- This ensures only admins can insert new role assignments
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));