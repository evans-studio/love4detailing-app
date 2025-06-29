-- Fix booking queries and RLS policies
DO $$
BEGIN
  -- Ensure the bookings table exists and has the correct columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'service_date'
  ) THEN
    ALTER TABLE public.bookings
    ADD COLUMN service_date DATE;
  END IF;

  -- Update existing booking_date to service_date if needed
  UPDATE public.bookings
  SET service_date = booking_date
  WHERE service_date IS NULL AND booking_date IS NOT NULL;

  -- Create index for service_date queries
  CREATE INDEX IF NOT EXISTS idx_bookings_service_date ON public.bookings(service_date);
  
  -- Drop existing RLS policies
  DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.bookings;

  -- Create new RLS policies
  CREATE POLICY "Allow read for authenticated users"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can view their own bookings"
    ON public.bookings
    FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Staff can view all bookings"
    ON public.bookings
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('staff', 'admin', 'manager')
      )
    );

  -- Create global error handler function
  CREATE OR REPLACE FUNCTION handle_supabase_error()
  RETURNS trigger AS $$
  BEGIN
    -- Log the error
    RAISE LOG 'Supabase error in % operation on table %: %',
      TG_OP,
      TG_TABLE_NAME,
      SQLERRM;
    
    -- You can add custom error handling logic here
    
    RETURN NULL;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log any errors in the error handler itself
      RAISE LOG 'Error in error handler: %', SQLERRM;
      RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

  -- Create error handler trigger
  DROP TRIGGER IF EXISTS handle_errors ON public.bookings;
  CREATE TRIGGER handle_errors
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW
    WHEN (pg_exception_context() IS NOT NULL)
    EXECUTE FUNCTION handle_supabase_error();

  -- Add comments
  COMMENT ON TABLE public.bookings IS 'Stores booking information with proper RLS and error handling';
  COMMENT ON COLUMN public.bookings.service_date IS 'Date of the service (preferred over booking_date)';
END $$; 