-- Create storage buckets for candidate applications
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('candidate-files', 'candidate-files', false),
  ('payment-receipts', 'payment-receipts', false);

-- Create RLS policies for candidate-files bucket
CREATE POLICY "Anyone can upload candidate files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'candidate-files');

CREATE POLICY "Anyone can view candidate files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'candidate-files');

-- Create RLS policies for payment-receipts bucket  
CREATE POLICY "Anyone can upload payment receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-receipts');

CREATE POLICY "Admins can view payment receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-receipts' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Users can view their own payment receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add file upload columns to candidate_applications table
ALTER TABLE candidate_applications 
ADD COLUMN showcase_file_url text,
ADD COLUMN payment_receipt_url text;