-- Create storage bucket for performance videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('performance-videos', 'performance-videos', false);

-- Create table for performance videos
CREATE TABLE public.performance_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  file_size BIGINT,
  file_format TEXT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on performance_videos table
ALTER TABLE public.performance_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performance_videos
CREATE POLICY "Users can view their own videos" 
ON public.performance_videos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos" 
ON public.performance_videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
ON public.performance_videos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all videos" 
ON public.performance_videos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all videos" 
ON public.performance_videos 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Storage policies for performance-videos bucket
CREATE POLICY "Users can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'performance-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'performance-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all performance videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'performance-videos' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_performance_videos_updated_at
BEFORE UPDATE ON public.performance_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();