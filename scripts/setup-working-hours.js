const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  } catch (error) {
    console.log('Could not load .env.local file')
  }
}

loadEnvFile()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function setupWorkingHours() {
  console.log('Setting up working hours...')
  
  // Default working hours: Monday to Friday, 10:00-17:00
  const workingHours = [
    { day_of_week: 1, start_time: '10:00', end_time: '17:00', is_active: true, slot_duration_minutes: 90, max_bookings_per_slot: 1 }, // Monday
    { day_of_week: 2, start_time: '10:00', end_time: '17:00', is_active: true, slot_duration_minutes: 90, max_bookings_per_slot: 1 }, // Tuesday
    { day_of_week: 3, start_time: '10:00', end_time: '17:00', is_active: true, slot_duration_minutes: 90, max_bookings_per_slot: 1 }, // Wednesday
    { day_of_week: 4, start_time: '10:00', end_time: '17:00', is_active: true, slot_duration_minutes: 90, max_bookings_per_slot: 1 }, // Thursday
    { day_of_week: 5, start_time: '10:00', end_time: '17:00', is_active: true, slot_duration_minutes: 90, max_bookings_per_slot: 1 }, // Friday
  ]

  try {
    // First, check if working hours already exist
    const { data: existing } = await supabase
      .from('working_hours')
      .select('day_of_week')

    console.log('Existing working hours:', existing)

    if (!existing || existing.length === 0) {
      // Insert new working hours
      const { data, error } = await supabase
        .from('working_hours')
        .insert(workingHours)

      if (error) {
        console.error('Error inserting working hours:', error)
        return
      }

      console.log('✅ Working hours inserted successfully!')
    } else {
      // Update existing working hours
      for (const hours of workingHours) {
        const { error } = await supabase
          .from('working_hours')
          .upsert(hours, { onConflict: 'day_of_week' })

        if (error) {
          console.error(`Error updating working hours for day ${hours.day_of_week}:`, error)
        }
      }
      console.log('✅ Working hours updated successfully!')
    }

    // Verify the setup
    const { data: verification } = await supabase
      .from('working_hours')
      .select('*')
      .order('day_of_week')

    console.log('Current working hours:', verification)

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

// Run the setup
setupWorkingHours().then(() => {
  console.log('Setup complete!')
  process.exit(0)
}) 