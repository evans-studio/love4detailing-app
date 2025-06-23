-- Enable Row Level Security for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- Allow public access to basic profile information
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Grant necessary permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role; 