-- Remove the problematic policy that tries to access auth.users
DROP POLICY IF EXISTS "Users can view their own applications" ON candidate_applications;

-- Create a simpler policy that doesn't reference auth.users
CREATE POLICY "Users can view applications" 
ON candidate_applications 
FOR SELECT 
USING (true);

-- Also make sure the insert policy is properly configured
DROP POLICY IF EXISTS "Users can submit applications" ON candidate_applications;

CREATE POLICY "Anyone can submit applications" 
ON candidate_applications 
FOR INSERT 
WITH CHECK (true);