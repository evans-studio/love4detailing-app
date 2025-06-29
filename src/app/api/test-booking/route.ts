import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Use service role key to bypass RLS for testing
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const testBookingSchema = z.object({
  vehicleSize: z.string(),
  servicePackage: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  postcode: z.string(),
  addOns: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const validatedData = testBookingSchema.parse(json)
    
    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (testError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: testError
      }, { status: 500 })
    }
    
    // Create test booking with service role (bypasses RLS)
    const bookingData = {
      email: validatedData.email,
      customer_name: validatedData.fullName,
      booking_date: validatedData.date,
      booking_time: validatedData.timeSlot,
      postcode: validatedData.postcode,
      total_price: 80.00,
      status: 'pending',
      notes: 'Test booking via simplified API',
      service_id: validatedData.servicePackage,
      vehicle_size: validatedData.vehicleSize,
      add_ons: validatedData.addOns || [],
      payment_status: 'pending',
      user_id: null,
    }
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking',
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Test booking created successfully'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test database connection and fetch bookings with service role
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch bookings',
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: bookings,
      message: `Found ${bookings.length} bookings`
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
} 