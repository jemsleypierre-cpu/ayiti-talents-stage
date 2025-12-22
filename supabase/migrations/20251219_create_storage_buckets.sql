-- Create storage buckets for candidate files and payment receipts

-- Create candidate-files bucket (for showcase videos/photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'candidate-files',
  'candidate-files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Create payment-receipts bucket (for payment proof images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-receipts',
  'payment-receipts',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for candidate-files bucket
-- Allow anyone to read files (public bucket)
CREATE POLICY "Public Access candidate-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-files');

-- Allow anyone to upload files (for registration without auth)
CREATE POLICY "Allow uploads to candidate-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'candidate-files');

-- Storage policies for payment-receipts bucket
-- Allow anyone to read files
CREATE POLICY "Public Access payment-receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-receipts');

-- Allow anyone to upload payment receipts
CREATE POLICY "Allow uploads to payment-receipts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-receipts');

