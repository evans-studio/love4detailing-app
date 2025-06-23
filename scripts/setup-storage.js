const { createClient } = require('@supabase/supabase-js')

// Make sure to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key (not anon key)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log('Setting up storage buckets...')

    // Create profile-images bucket
    const { data: profileBucket, error: profileError } = await supabase.storage
      .createBucket('profile-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

    if (profileError && !profileError.message.includes('already exists')) {
      console.error('Error creating profile-images bucket:', profileError)
    } else {
      console.log('✅ Profile images bucket created/exists')
    }

    // Create vehicle-photos bucket
    const { data: vehicleBucket, error: vehicleError } = await supabase.storage
      .createBucket('vehicle-photos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

    if (vehicleError && !vehicleError.message.includes('already exists')) {
      console.error('Error creating vehicle-photos bucket:', vehicleError)
    } else {
      console.log('✅ Vehicle photos bucket created/exists')
    }

    // Add profile columns to profiles table
    console.log('Adding profile columns...')
    
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
        ADD COLUMN IF NOT EXISTS vehicle_photos TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS vehicle_make TEXT,
        ADD COLUMN IF NOT EXISTS vehicle_model TEXT,
        ADD COLUMN IF NOT EXISTS vehicle_year INTEGER,
        ADD COLUMN IF NOT EXISTS vehicle_color TEXT;
      `
    })

    if (alterError) {
      console.error('Error adding columns (this might be expected if they already exist):', alterError)
    } else {
      console.log('✅ Profile columns added/exist')
    }

    console.log('\n🎉 Storage setup complete!')
    console.log('You can now upload profile images and vehicle photos.')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupStorage() 