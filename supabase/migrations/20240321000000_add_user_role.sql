-- Add role column and table safely
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

  -- Create user_roles table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'user_roles'
  ) THEN
    CREATE TABLE public.user_roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create index on user_id
    CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

    -- Enable RLS
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Only admins can manage roles"
      ON public.user_roles FOR ALL
      USING (
        auth.uid() IN (
          SELECT user_id FROM public.user_roles WHERE role = 'admin'
        )
      );
  END IF;

  -- Add comment
  COMMENT ON TABLE public.user_roles IS 'Stores user roles for access control';
END $$;

-- Set the role to 'admin' for existing admin users
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com', 'd.dimpauls@gmail.com');
