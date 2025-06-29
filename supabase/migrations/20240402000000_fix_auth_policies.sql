-- Fix auth policies and user creation flow
DO $$
BEGIN
  -- Enable RLS on profiles table if not already enabled
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies to clean up
  DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

  -- Create new policies with proper checks
  CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Grant necessary permissions
  GRANT ALL ON public.profiles TO authenticated;
  GRANT ALL ON public.profiles TO service_role;

  -- Recreate the handle_new_user function with better error handling
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  DECLARE
    user_full_name text;
    user_email text;
  BEGIN
    -- Extract full name and email, handling potential null values
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
    user_email := COALESCE(NEW.email, '');
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (NEW.id, user_full_name, user_email)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      updated_at = NOW();
    
    -- Insert into rewards table
    INSERT INTO public.rewards (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Ensure the trigger exists and is properly set up
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

END $$; 