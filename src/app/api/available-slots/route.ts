import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { BookingStatus } from '@/lib/enums'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schema
const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    // Validate query parameters
    const validatedData = querySchema.parse({ date })

    // Get booked slots for the date
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('booking_time')
      .eq('booking_date', validatedData.date)
      .in('status', [BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.IN_PROGRESS])

    if (error) {
      console.error('Failed to fetch booked slots:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch booked slots' },
        { status: 500 }
      )
    }

    // Extract booked time slots
    const bookedSlots = bookings?.map(booking => booking.booking_time) || []

    return NextResponse.json({
      success: true,
      data: {
        bookedSlots
      }
    })

  } catch (error) {
    console.error('Available slots error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
} 