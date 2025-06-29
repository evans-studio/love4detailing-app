-- Clean up user_roles table and fix all policies
-- This migration removes the problematic user_roles table and updates all policies to use profiles.role

-- Drop all policies that reference user_roles
DO $$
BEGIN
  -- Drop existing policies that might reference user_roles
  DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Staff can update all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
END $$;

-- Drop the user_roles table completely
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Ensure profiles table has role column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
  END IF;
END $$;

-- Create clean policies using only profiles.role
CREATE POLICY "Staff can view all bookings" ON public.bookings
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('staff', 'admin', 'manager')
    )
  );

CREATE POLICY "Staff can update all bookings" ON public.bookings
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('staff', 'admin', 'manager')
    )
  );

-- Update admin policies to use profiles.role
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can update all bookings" ON public.bookings;

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can view all bookings" ON public.bookings
  FOR SELECT 
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update all bookings" ON public.bookings
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Set admin roles for specified users
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com', 'd.dimpauls@gmail.com');

-- Create index on role for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add comments
COMMENT ON COLUMN public.profiles.role IS 'User role: user, admin, manager, staff';
COMMENT ON INDEX idx_profiles_role IS 'Index for role-based queries'; 