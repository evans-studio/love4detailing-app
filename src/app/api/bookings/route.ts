import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { bookingSchema, BookingStatus, PaymentStatus, ServiceType, VehicleSize } from '@/lib/schemas'
import { BOOKING } from '@/lib/constants'
import { emailService } from '@/lib/email/service'
import type { BookingFormData } from '@/lib/schemas'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// API Response type
type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  message?: string
}

// Helper function to format booking response
function formatBookingResponse(booking: any): BookingFormData {
  return {
    customer_name: booking.customer_name,
    email: booking.customer_email,
    postcode: booking.postcode,
    service_type: booking.service_type as ServiceType,
    vehicle_size: booking.vehicle_size as VehicleSize,
    add_ons: booking.add_ons || [],
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    total_price: booking.total_amount,
    status: booking.status || BookingStatus.PENDING,
    payment_status: booking.payment_status || PaymentStatus.PENDING,
    vehicle_lookup: booking.vehicle_lookup,
    special_requests: booking.special_requests || '',
    travel_fee: booking.travel_fee || 0,
    vehicle_images: booking.vehicle_images || [],
    booking_reference: booking.booking_reference
  }
}

// POST - Create booking
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      console.error('Failed to create booking:', error)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to create booking',
          details: error
        }
      })
    }

    // Send confirmation email
    await emailService.sendBookingConfirmation(formatBookingResponse(booking))

    return NextResponse.json({
      success: true,
      data: formatBookingResponse(booking)
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to process booking request',
        details: error
      }
    })
  }
}

// GET - Fetch bookings
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<BookingFormData[]>>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch bookings:', error)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch bookings',
          details: error
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: bookings.map(formatBookingResponse)
    })
  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch bookings',
        details: error
      }
    })
  }
}

// PATCH - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<BookingFormData>>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const validatedData = bookingSchema.partial().parse(body)

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update booking:', error)
      return NextResponse.json({
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to update booking',
          details: error
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: formatBookingResponse(booking)
    })
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to update booking',
        details: error
      }
    })
  }
} 