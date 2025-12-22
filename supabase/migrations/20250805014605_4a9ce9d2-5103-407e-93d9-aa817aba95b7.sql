-- Create table for candidate applications/inscriptions
CREATE TABLE public.candidate_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  bio TEXT,
  talents TEXT[] DEFAULT '{}',
  category TEXT,
  phone TEXT,
  email TEXT,
  photo_url TEXT,
  social_media JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT, -- Notes from admins
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.candidate_applications ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage all applications
CREATE POLICY "Admins can manage applications" 
ON public.candidate_applications 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 
  FROM profiles 
  WHERE (profiles.id = auth.uid()) AND (profiles.role = 'admin') 
));

-- Anyone can submit an application (public form)
CREATE POLICY "Anyone can submit application" 
ON public.candidate_applications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_candidate_applications_updated_at
BEFORE UPDATE ON public.candidate_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on status queries
CREATE INDEX idx_candidate_applications_status ON public.candidate_applications(status);
CREATE INDEX idx_candidate_applications_applied_at ON public.candidate_applications(applied_at DESC);