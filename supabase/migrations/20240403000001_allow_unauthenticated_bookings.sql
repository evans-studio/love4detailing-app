-- Update RLS policies for bookings table to allow unauthenticated bookings
DO $$
BEGIN
  -- Enable RLS on bookings table
  ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

  -- Create new policies
  -- Allow anyone to create a booking
  CREATE POLICY "Anyone can create a booking"
    ON public.bookings
    FOR INSERT
    WITH CHECK (true);

  -- Allow users to view their own bookings
  CREATE POLICY "Users can view their own bookings"
    ON public.bookings
    FOR SELECT
    USING (
      auth.uid() IS NOT NULL AND 
      user_id = auth.uid()
    );

  -- Allow users to update their own bookings
  CREATE POLICY "Users can update their own bookings"
    ON public.bookings
    FOR UPDATE
    USING (
      auth.uid() IS NOT NULL AND 
      user_id = auth.uid()
    );

  -- Allow admins to view all bookings (you can uncomment and customize this if needed)
  -- CREATE POLICY "Admins can view all bookings"
  --   ON public.bookings
  --   FOR SELECT
  --   USING (
  --     auth.uid() IN (
  --       SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  --     )
  --   );
END
$$; 