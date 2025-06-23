-- Add profile image and vehicle photos to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS vehicle_photos TEXT[] DEFAULT '{}';

-- Add vehicle information columns for better organization
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vehicle_make TEXT,
ADD COLUMN IF NOT EXISTS vehicle_model TEXT,
ADD COLUMN IF NOT EXISTS vehicle_year INTEGER,
ADD COLUMN IF NOT EXISTS vehicle_color TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postcode TEXT;

-- Create storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for vehicle photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for vehicle photos
CREATE POLICY "Users can upload their own vehicle photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vehicle photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Users can update their own vehicle photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own vehicle photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_vehicle_make ON profiles(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_profiles_vehicle_model ON profiles(vehicle_model); 