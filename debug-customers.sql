-- Debug and fix customer visibility issues
-- Run this in your Supabase SQL Editor

-- First, let's see what users actually exist in the auth.users table
SELECT 
    users.id,
    users.email,
    users.created_at as auth_created,
    profiles.full_name,
    profiles.created_at as profile_created
FROM auth.users 
LEFT JOIN public.profiles ON users.id = profiles.id
ORDER BY users.created_at DESC;

-- Check if there are any orphaned auth users without profiles
SELECT 
    users.id,
    users.email,
    users.created_at
FROM auth.users 
LEFT JOIN public.profiles ON users.id = profiles.id
WHERE profiles.id IS NULL;

-- Fix RLS policies to allow admin to see all customers
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        -- Allow admin user to see all profiles
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'd.dimpauls@gmail.com'
        )
    ); 