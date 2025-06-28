-- Enable Row Level Security safely
DO $$
BEGIN
  -- Enable RLS on tables if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'bookings' AND rowsecurity = true
  ) THEN
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'rewards' AND rowsecurity = true
  ) THEN
    ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'rewards_history' AND rowsecurity = true
  ) THEN
    ALTER TABLE rewards_history ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for tables safely
DO $$
BEGIN
  -- Bookings table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view their own bookings'
  ) THEN
    CREATE POLICY "Users can view their own bookings"
      ON bookings FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can create bookings'
  ) THEN
    CREATE POLICY "Users can create bookings"
      ON bookings FOR INSERT
      WITH CHECK (
        auth.uid() = user_id OR
        -- Allow anonymous bookings that will be linked later
        user_id IS NULL
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update their own bookings'
  ) THEN
    CREATE POLICY "Users can update their own bookings"
      ON bookings FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  -- Rewards table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view their own rewards'
  ) THEN
    CREATE POLICY "Users can view their own rewards"
      ON rewards FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'System can manage rewards'
  ) THEN
    CREATE POLICY "System can manage rewards"
      ON rewards FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Rewards history table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view their rewards history'
  ) THEN
    CREATE POLICY "Users can view their rewards history"
      ON rewards_history FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'System can create rewards history'
  ) THEN
    CREATE POLICY "System can create rewards history"
      ON rewards_history FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes safely
DO $$
BEGIN
  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_bookings_user_id'
  ) THEN
    CREATE INDEX idx_bookings_user_id ON bookings(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_bookings_email'
  ) THEN
    CREATE INDEX idx_bookings_email ON bookings(email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_rewards_user_id'
  ) THEN
    CREATE INDEX idx_rewards_user_id ON rewards(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_rewards_history_user_id'
  ) THEN
    CREATE INDEX idx_rewards_history_user_id ON rewards_history(user_id);
  END IF;
END $$;

-- Add trigger to automatically create profile and rewards record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile record
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  -- Create rewards record
  INSERT INTO public.rewards (user_id, points, total_saved)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$; 