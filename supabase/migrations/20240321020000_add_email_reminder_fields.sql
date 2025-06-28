-- Safely add email reminder fields to bookings table
DO $$
BEGIN
  -- Add reminder_sent column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent') THEN
    ALTER TABLE bookings
    ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add reminder_sent_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent_at') THEN
    ALTER TABLE bookings
    ADD COLUMN reminder_sent_at TIMESTAMPTZ;
  END IF;

  -- Add reminder_sent_24h column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent_24h') THEN
    ALTER TABLE bookings
    ADD COLUMN reminder_sent_24h BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- Add reminder_sent_1h column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent_1h') THEN
    ALTER TABLE bookings
    ADD COLUMN reminder_sent_1h BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- Rename reminder_sent to reminder_sent_legacy if both exist
  IF EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent')
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'reminder_sent_legacy') THEN
    ALTER TABLE bookings
    RENAME COLUMN reminder_sent TO reminder_sent_legacy;
  END IF;
END$$;

-- Safely create indexes if they don't exist
DO $$
BEGIN
  -- Create index for legacy reminder queries if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_reminder') THEN
    CREATE INDEX idx_bookings_reminder ON bookings (reminder_sent_legacy, booking_date)
    WHERE status != 'cancelled';
  END IF;

  -- Create index for 24h reminder queries if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_reminder_24h') THEN
    CREATE INDEX idx_bookings_reminder_24h ON bookings (reminder_sent_24h)
    WHERE NOT reminder_sent_24h AND status != 'cancelled';
  END IF;

  -- Create index for 1h reminder queries if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_reminder_1h') THEN
    CREATE INDEX idx_bookings_reminder_1h ON bookings (reminder_sent_1h)
    WHERE NOT reminder_sent_1h AND status != 'cancelled';
  END IF;
END$$;

-- Add documentation
COMMENT ON TABLE bookings IS 'Stores booking information with enhanced reminder tracking';
COMMENT ON COLUMN bookings.reminder_sent_24h IS '24-hour reminder email sent status';
COMMENT ON COLUMN bookings.reminder_sent_1h IS '1-hour reminder email sent status';
COMMENT ON COLUMN bookings.reminder_sent_legacy IS 'Legacy reminder sent status (deprecated)';

-- Safely update RLS policies
DO $$
BEGIN
  -- Update or create the user bookings policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own bookings') THEN
    ALTER POLICY "Users can view their own bookings"
    ON bookings
    USING (auth.uid() = user_id);
  ELSE
    CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  -- Update or create the staff bookings policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Staff can view all bookings') THEN
    ALTER POLICY "Staff can view all bookings"
    ON bookings
    USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'staff'));
  ELSE
    CREATE POLICY "Staff can view all bookings"
    ON bookings FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'staff'));
  END IF;
END$$; 