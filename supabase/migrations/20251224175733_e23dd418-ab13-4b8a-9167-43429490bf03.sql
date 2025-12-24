-- Add explicit INSERT policy to prevent users from creating coin records
-- Only the system/triggers should create coin records
CREATE POLICY "Only system can create coin records" 
ON public.coins 
FOR INSERT 
WITH CHECK (false);

-- Add explicit UPDATE policy to prevent users from manipulating their balances
-- Only admins can update coins (already covered by ALL policy but explicit is better)
CREATE POLICY "Only admins can update coins" 
ON public.coins 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit DELETE policy to prevent users from deleting their coin records
CREATE POLICY "Only admins can delete coins" 
ON public.coins 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));