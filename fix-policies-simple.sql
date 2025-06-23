-- Fix broken RLS policies - run this in Supabase SQL Editor immediately

-- Drop the broken admin policy
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- Recreate the basic policies that work
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Simple admin policy using your specific user ID
CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id OR 
        auth.uid() = '44609805-6bcd-45a1-9109-b0f83e0b699f'
    );

CREATE POLICY "Admin can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id OR 
        auth.uid() = '44609805-6bcd-45a1-9109-b0f83e0b699f'
    ); 