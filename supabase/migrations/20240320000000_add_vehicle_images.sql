-- Create storage bucket for user uploads if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'user-uploads'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('user-uploads', 'User Uploads');
  END IF;
END $$;

-- Create storage policies for user uploads
DO $$
BEGIN
  -- Allow authenticated uploads to user-uploads bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow authenticated uploads to user-uploads'
  ) THEN
    CREATE POLICY "Allow authenticated uploads to user-uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'user-uploads'
      AND auth.role() = 'authenticated'
    );
  END IF;

  -- Allow users to view their own uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow users to view their own uploads'
  ) THEN
    CREATE POLICY "Allow users to view their own uploads"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'user-uploads'
      AND owner = auth.uid()
    );
  END IF;

  -- Allow users to update their own uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow users to update their own uploads'
  ) THEN
    CREATE POLICY "Allow users to update their own uploads"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'user-uploads'
      AND owner = auth.uid()
    );
  END IF;

  -- Allow users to delete their own uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow users to delete their own uploads'
  ) THEN
    CREATE POLICY "Allow users to delete their own uploads"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'user-uploads'
      AND owner = auth.uid()
    );
  END IF;
END $$;

-- Add vehicle_images column and index safely
DO $$
BEGIN
  -- Add vehicle_images column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'vehicle_images'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN vehicle_images TEXT[] DEFAULT '{}';
  END IF;

  -- Create index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_bookings_user_id'
  ) THEN
    CREATE INDEX idx_bookings_user_id ON bookings(user_id);
  END IF;
END $$;

comment on column bookings.vehicle_images is 'Array of public URLs for vehicle images uploaded during booking'; 