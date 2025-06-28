-- Check if the bookings table doesn't exist
DO $$
DECLARE
  trigger_exists boolean;
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
    -- Create bookings table
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id),
      service_type service_type NOT NULL,
      vehicle_size vehicle_size NOT NULL,
      vehicle TEXT NOT NULL,
      vehicle_year INTEGER,
      vehicle_color TEXT,
      date DATE NOT NULL,
      time_slot TEXT NOT NULL,
      postcode TEXT NOT NULL,
      address TEXT,
      add_ons TEXT[],
      special_requests TEXT,
      access_instructions TEXT,
      status booking_status DEFAULT 'pending',
      total_amount DECIMAL(10,2) NOT NULL,
      travel_fee DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index for querying bookings by date and time
    CREATE INDEX idx_bookings_date_time ON bookings(date, time_slot);
    
    -- Create index for status
    CREATE INDEX idx_bookings_status ON bookings(status);

    -- Add row level security policies
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

    -- Create policy for inserting bookings (anyone can create a booking)
    CREATE POLICY "Enable insert for all users" ON bookings
      FOR INSERT WITH CHECK (true);

    -- Create policy for viewing own bookings
    CREATE POLICY "Enable select for users based on user_id" ON bookings
      FOR SELECT USING (auth.uid() = user_id);

    -- Create policy for updating own bookings
    CREATE POLICY "Enable update for users based on user_id" ON bookings
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'update_bookings_updated_at'
  ) INTO trigger_exists;

  -- Create trigger function if it doesn't exist
  IF NOT trigger_exists THEN
    -- Create function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER 
    LANGUAGE plpgsql
    AS $trigger$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $trigger$;

    -- Create trigger for updating updated_at
    CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$; 