import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { baseBookingSchema, type BookingStatus } from '@/lib/schemas'
import { BOOKING } from '@/lib/constants'
import type { PaymentMethod, PaymentStatus } from '@/lib/schemas'
import { emailService } from '@/lib/email/service'
import {
  Booking,
  BookingStatus as BookingStatusType,
  PaymentStatus as PaymentStatusType,
  bookingEditSchema,
} from '@/lib/types'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple validation schemas
const createBookingSchema = z.object({
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

const updateBookingSchema = z.object({
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

// Helper function to get user from auth header
async function getUserFromAuth(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return { userId: user.id }
  } catch (error) {
    console.error('Auth validation error:', error)
    return null
  }
}

// Helper function to calculate pricing
function calculateTotal(servicePackage: string, vehicleSize: string, addOns: string[] = []): number {
  // Base pricing logic - in production this would use constants
  const basePrices: Record<string, Record<string, number>> = {
    essential: { small: 25, medium: 35, large: 45, extraLarge: 55 },
    premium: { small: 40, medium: 50, large: 60, extraLarge: 70 },
    ultimate: { small: 60, medium: 70, large: 80, extraLarge: 90 },
  }
  
  const addOnPrices: Record<string, number> = {
    interiorProtection: 15,
    engineClean: 10,
    headlightRestoration: 20,
  }
  
  const basePrice = basePrices[servicePackage]?.[vehicleSize] || 35
  const addOnPrice = addOns.reduce((sum, addOn) => sum + (addOnPrices[addOn] || 0), 0)
  
  return basePrice + addOnPrice
}

// Helper function to generate booking ID
function generateBookingId(): string {
  return `BK${Date.now().toString().slice(-8)}`
}

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
    const validatedData = bookingEditSchema.parse(json)
    
    // Update booking in database
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: validatedData.status,
        booking_date: validatedData.time.toISOString(),
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