-- Remove the existing problematic policy
DROP POLICY IF EXISTS "Anyone can submit application" ON candidate_applications;

-- Create a new policy that works for both authenticated and anonymous users
CREATE POLICY "Users can submit applications" 
ON candidate_applications 
FOR INSERT 
WITH CHECK (true);

-- Also ensure authenticated users can view their own applications
CREATE POLICY "Users can view their own applications" 
ON candidate_applications 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));