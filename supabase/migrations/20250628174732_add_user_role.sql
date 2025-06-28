-- Add a 'role' column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Set the role to 'admin' for existing admin users
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com', 'd.dimpauls@gmail.com');
