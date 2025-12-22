-- Create table for organizers/organisateurs
CREATE TABLE public.organisateurs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  role TEXT NOT NULL, -- 'fondateur', 'administrateur', etc.
  order_display INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organisateurs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view active organizers)
CREATE POLICY "Anyone can view active organizers" 
ON public.organisateurs 
FOR SELECT 
USING (active = true);

-- Create policies for admin management
CREATE POLICY "Admins can manage organizers" 
ON public.organisateurs 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 
  FROM profiles 
  WHERE (profiles.id = auth.uid()) AND (profiles.role = 'admin') 
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_organisateurs_updated_at
BEFORE UPDATE ON public.organisateurs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the two existing organizers
INSERT INTO public.organisateurs (name, title, bio, photo_url, role, order_display) VALUES 
(
  'Pasteur Pierre Jempsley',
  'Fondateur',
  'Fondateur passionné de Rayon des Jeunes Talents, dédié à révéler et valoriser les talents cachés des jeunes haïtiens. Son vision : créer une plateforme culturelle et artistique qui accompagne les jeunes dans leur développement personnel et artistique.',
  '/lovable-uploads/d449e80a-112b-4e5a-bc1c-31b872223be4.png',
  'fondateur',
  1
),
(
  'Pasteur Herns Brenord',
  'Administrateur Général', 
  'Licencié en Sciences de l''Administration et Diplômé en Théologie, il représente officiellement Rayon des Jeunes Talents sur le terrain. Basé dans le Nord d''Haïti, il coordonne toutes les activités locales et accompagne directement les candidats.',
  '/lovable-uploads/8b54fa99-25f3-4baf-beae-62acc466acd0.png',
  'administrateur',
  2
);