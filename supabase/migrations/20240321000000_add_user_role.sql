-- Add role column and simplified role management
DO $$
BEGIN
  -- Add role column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
  END IF;

  -- Drop the problematic user_roles table if it exists
  DROP TABLE IF EXISTS public.user_roles CASCADE;

  -- Add comment
  COMMENT ON COLUMN public.profiles.role IS 'User role: user, admin, manager, staff';
END $$;

-- Set the role to 'admin' for existing admin users
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com', 'd.dimpauls@gmail.com');

-- Create index on role for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
