-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(500),
  tier VARCHAR(20) DEFAULT 'silver' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active sponsors
CREATE POLICY "Anyone can read active sponsors"
  ON sponsors
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage sponsors (for admin)
CREATE POLICY "Authenticated users can manage sponsors"
  ON sponsors
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsor-logos', 'sponsor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can view sponsor logos
CREATE POLICY "Anyone can view sponsor logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'sponsor-logos');

-- Storage policy: Authenticated users can upload sponsor logos
CREATE POLICY "Authenticated users can upload sponsor logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'sponsor-logos');

-- Storage policy: Authenticated users can delete sponsor logos
CREATE POLICY "Authenticated users can delete sponsor logos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'sponsor-logos');

