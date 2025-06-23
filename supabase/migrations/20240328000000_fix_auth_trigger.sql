-- Complete database setup - creates all necessary tables and functions
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    email text UNIQUE,
    phone text,
    address text,
    postcode text,
    vehicle_make text,
    vehicle_model text,
    vehicle_color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    email text NOT NULL,
    booking_date date NOT NULL,
    booking_time time NOT NULL,
    postcode text NOT NULL,
    total_price decimal(10,2) NOT NULL,
    status booking_status DEFAULT 'pending' NOT NULL,
    notes text,
    service_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT,
    vehicle_size TEXT,
    add_ons JSONB DEFAULT '[]'::jsonb,
    vehicle_images JSONB DEFAULT '[]'::jsonb,
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    booking_reference TEXT
);

-- Create rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rewards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    points integer NOT NULL DEFAULT 0,
    total_saved decimal(10,2) NOT NULL DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create rewards_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rewards_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
    points integer NOT NULL,
    type text NOT NULL CHECK (type IN ('earned', 'redeemed')),
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_email TEXT;
BEGIN
  -- Extract full name and email, handling potential null values
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  user_email := COALESCE(NEW.email, '');
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, user_full_name, user_email)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
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

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- Allow users to create their own profile
CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow admin to view all profiles (check if user is admin by email)
CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'd.dimpauls@gmail.com'
        )
    );

-- Allow admin to update all profiles
CREATE POLICY "Admin can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'd.dimpauls@gmail.com'
        )
    );

-- Create RLS policies for bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (
        auth.uid() = user_id OR
        -- Allow anonymous bookings that will be linked later
        user_id IS NULL
    );

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for rewards
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.rewards;
DROP POLICY IF EXISTS "Users can update their own rewards" ON public.rewards;
DROP POLICY IF EXISTS "System can manage rewards" ON public.rewards;

CREATE POLICY "Users can view their own rewards"
    ON public.rewards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
    ON public.rewards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage rewards"
    ON public.rewards FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for rewards_history
DROP POLICY IF EXISTS "Users can view their own rewards history" ON public.rewards_history;
DROP POLICY IF EXISTS "System can insert rewards history" ON public.rewards_history;

CREATE POLICY "Users can view their own rewards history"
    ON public.rewards_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert rewards history"
    ON public.rewards_history FOR INSERT
    WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_history_user_id ON public.rewards_history(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_history_booking_id ON public.rewards_history(booking_id);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.rewards TO authenticated;
GRANT ALL ON public.rewards TO service_role;
GRANT ALL ON public.rewards_history TO authenticated;
GRANT ALL ON public.rewards_history TO service_role;

-- Add policies for admin access to bookings
CREATE POLICY "Admin can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com')
    )
  );

CREATE POLICY "Admin can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com')
    )
  );

-- Allow anonymous booking creation (for non-authenticated users)
CREATE POLICY "Allow anonymous booking creation" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Allow booking updates for payment processing
CREATE POLICY "Allow booking updates for payment" ON public.bookings
  FOR UPDATE USING (true); 