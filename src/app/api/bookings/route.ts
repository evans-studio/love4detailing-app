import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface BookingData {
  user_id: string
  customer_name: string
  email: string
  postcode: string
  vehicle_size: string
  service_type: string
  vehicle: string
  date: string
  time_slot: string
  add_ons: string[]
  vehicle_images: string[]
  special_requests: string
  total_amount: number
  travel_fee: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed'
  booking_reference: string
  vehicle_lookup?: {
    make: string
    model: string
    year?: number
    registration?: string
  }
  vehicle_info?: {
    type: string
    size: string
    details?: Record<string, unknown>
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error in bookings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Prepare booking data - handle cases where new columns might not exist yet
    const bookingData: BookingData = {
      user_id: body.user_id,
      customer_name: body.customer_name,
      email: body.email,
      postcode: body.postcode,
      vehicle_size: body.vehicle_size,
      service_type: body.service_type || body.vehicle_size,
      vehicle: body.vehicle || 'Unknown',
      date: body.service_date,
      time_slot: body.service_time,
      add_ons: body.add_ons || [],
      vehicle_images: body.vehicle_images || [],
      special_requests: body.notes || '',
      total_amount: body.total_price,
      travel_fee: body.travel_fee || 0,
      status: body.status || 'pending',
      payment_status: body.payment_status || 'pending',
      booking_reference: body.booking_reference
    }

    // Add new vehicle fields if they exist in the request
    if (body.vehicle_lookup) {
      bookingData.vehicle_lookup = body.vehicle_lookup
    }
    if (body.vehicle_info) {
      bookingData.vehicle_info = body.vehicle_info
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error in booking creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: body.status,
        payment_status: body.payment_status,
        payment_id: body.payment_id
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error in booking update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 