import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { baseBookingSchema } from '@/lib/schemas'
import { BOOKING } from '@/lib/constants'
import type { PaymentStatus } from '@/lib/schemas'
import { emailService } from '@/lib/email/service'
import type { Booking } from '@/lib/types'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple validation schemas
const bookingSchema = z.object({
  servicePackage: z.string(),
  vehicleSize: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.number().optional(),
  vehicleColor: z.string().optional(),
  vehicleRegistration: z.string().optional(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  postcode: z.string(),
  addOns: z.array(z.string()).optional(),
  accessInstructions: z.string().optional(),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
})

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(['confirmed', 'cancelled', 'rescheduled']).optional(),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  notes: z.string().optional(),
})

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

// Status and payment status values
const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const

// Helper function to format booking response
function formatBookingResponse(booking: any): Booking {
  return {
    id: booking.id,
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    customerPhone: booking.customer_phone,
    service: booking.service_package,
    vehicleSize: booking.vehicle_size,
    addOns: booking.add_ons || [],
    time: booking.booking_date,
    price: booking.total_amount,
    status: booking.status,
    paymentStatus: booking.payment_status,
    notes: booking.notes,
    vehicleInfo: {
      make: booking.vehicle_make,
      model: booking.vehicle_model,
      color: booking.vehicle_color,
      year: booking.vehicle_year,
    },
  }
}

// POST - Create new booking
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()
    
    // Validate request data
    const validatedData = baseBookingSchema.parse(json)
    
    // Get payment method and status from config
    const paymentMethod = BOOKING.payment.method
    const paymentStatus: PaymentStatus = 'unpaid'
    
    // Insert booking into database
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        ...validatedData,
        paymentMethod,
        paymentStatus,
        reminderSent: false,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Failed to create booking:', error)
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'Failed to create booking',
          details: error,
        },
      }, { status: 500 })
    }
    
    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking)
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      // Don't fail the booking creation if email fails
    }
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: error,
      },
    }, { status: 500 })
  }
}

// GET - Fetch bookings
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Booking[]>>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    
    // Build query
    let query = supabase.from('bookings').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (status && status !== 'all' && status in BOOKING_STATUS) {
      query = query.eq('status', status)
    }
    
    if (paymentStatus && paymentStatus !== 'all' && paymentStatus in PAYMENT_STATUS) {
      query = query.eq('payment_status', paymentStatus)
    }
    
    const { data: bookings, error } = await query
    
    if (error) {
      console.error('Failed to fetch bookings:', error)
      return NextResponse.json<ApiResponse<Booking[]>>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch bookings',
          details: error,
        },
      }, { status: 500 })
    }
    
    return NextResponse.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings.map(formatBookingResponse),
    })
  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json<ApiResponse<Booking[]>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: error,
      },
    }, { status: 500 })
  }
}

// PATCH - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()
    
    // Validate request data
    const validatedData = updateSchema.parse(json)
    
    // Update booking in database
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: validatedData.status,
        booking_date: validatedData.date,
        notes: validatedData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Failed to update booking:', error)
      return NextResponse.json<ApiResponse<Booking>>({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update booking',
          details: error,
        },
      }, { status: 500 })
    }
    
    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking)
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      // Don't fail the booking update if email fails
    }
    
    return NextResponse.json<ApiResponse<Booking>>({
      success: true,
      data: formatBookingResponse(booking),
    })
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json<ApiResponse<Booking>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: error,
      },
    }, { status: 500 })
  }
} 