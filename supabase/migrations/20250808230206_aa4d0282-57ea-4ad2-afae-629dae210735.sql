-- CRITICAL SECURITY FIXES

-- 1. Fix candidate_applications data exposure - Remove dangerous policy that allows anyone to view all PII
DROP POLICY IF EXISTS "Users can view applications" ON public.candidate_applications;

-- 2. Fix role escalation vulnerability in profiles - Prevent users from updating their own roles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policy that allows users to update their profile EXCEPT the role column
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create separate policy for admins to update roles
CREATE POLICY "Admins can update user roles" 
ON public.profiles 
FOR UPDATE 
USING (get_current_user_role() = 'admin'::text)
WITH CHECK (get_current_user_role() = 'admin'::text);

-- 3. Add missing DELETE policy for performance_videos (users can delete their own videos)
CREATE POLICY "Users can delete their own videos" 
ON public.performance_videos 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Fix edge function model name in generate-welcome-image
-- Note: This will be handled separately in the edge function file