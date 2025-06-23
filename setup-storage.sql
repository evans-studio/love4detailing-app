-- Add profile and vehicle columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS vehicle_photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS vehicle_make TEXT,
ADD COLUMN IF NOT EXISTS vehicle_model TEXT,
ADD COLUMN IF NOT EXISTS vehicle_year INTEGER,
ADD COLUMN IF NOT EXISTS vehicle_color TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_vehicle_make ON profiles(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_profiles_vehicle_model ON profiles(vehicle_model);

-- Note: Storage buckets need to be created via the Supabase dashboard or API
-- Go to Storage > Create bucket:
-- 1. Create bucket named "profile-images" (public: true)
-- 2. Create bucket named "vehicle-photos" (public: true) 