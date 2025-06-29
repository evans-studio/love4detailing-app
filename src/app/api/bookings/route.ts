import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { bookingRequestSchema } from '@/lib/schemas/api'
import { BookingStatus, PaymentStatus, ServiceType, PaymentMethod } from '@/lib/enums'
import { BookingFormData, BookingRequest } from '@/lib/schemas/types'
import { emailService } from '@/lib/email/service'
import { ZodError } from 'zod'

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
    id: booking.id,
    registration: booking.vehicle_lookup?.registration || '',
    vehicle_lookup: {
      size: booking.vehicle_lookup?.size || 'medium',
      make: booking.vehicle_lookup?.make || 'Unknown Make',
      model: booking.vehicle_lookup?.model || 'Unknown Model',
      registration: booking.vehicle_lookup?.registration || 'UNKNOWN',
      year: booking.vehicle_lookup?.year,
      color: booking.vehicle_lookup?.color,
      notes: booking.vehicle_lookup?.notes
    },
    vehicle_images: booking.vehicle_images || [],
    vehicleSize: booking.vehicle_size,
    fullName: booking.customer_name,
    email: booking.email,
    phone: booking.phone,
    postcode: booking.postcode,
    address: booking.address,
    serviceId: booking.service_type,
    addOnIds: booking.add_ons || [],
    date: booking.booking_date,
    timeSlot: booking.booking_time,
    total_price: booking.total_price,
    travel_fee: booking.travel_fee || 0,
    status: booking.status || BookingStatus.PENDING,
    payment_status: booking.payment_status || PaymentStatus.PENDING,
    payment_method: booking.payment_method || PaymentMethod.CARD,
    special_requests: booking.special_requests,
    notes: booking.notes,
    requires_manual_approval: booking.requires_manual_approval || false,
    distance: booking.distance,
    booking_reference: booking.booking_reference
  }
}

// POST - Create booking
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    console.log('Received booking request:', body)
    
    // Validate request body
    let validatedData: BookingRequest;
    try {
      validatedData = bookingRequestSchema.parse({
        ...body,
        payment_method: body.payment_method || PaymentMethod.CARD
      })
      console.log('Validated booking data:', validatedData)
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation error:', error.errors)
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid booking data',
            details: error.errors
          }
        }, { status: 400 })
      }
      throw error
    }
    
    // Generate a unique booking reference
    const bookingReference = `BK${Date.now().toString().slice(-6)}`
    
    // Try to get the user's session
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()
    
    const bookingData: BookingRequest = {
      ...validatedData,
      booking_reference: bookingReference,
      user_id: session?.user?.id,
      status: BookingStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
      payment_method: validatedData.payment_method || PaymentMethod.CARD,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vehicle_lookup: {
        size: validatedData.vehicle_lookup?.size || 'medium',
        make: validatedData.vehicle_lookup?.make || 'Unknown Make',
        model: validatedData.vehicle_lookup?.model || 'Unknown Model',
        registration: validatedData.vehicle_lookup?.registration || 'UNKNOWN',
        year: validatedData.vehicle_lookup?.year,
        color: validatedData.vehicle_lookup?.color,
        notes: validatedData.vehicle_lookup?.notes
      }
    }

    console.log('Creating booking with data:', bookingData)

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()

    if (error) {
      console.error('Failed to create booking:', error)
      return NextResponse.json({
        success: false,
        error: {
          code: error.code || 'DB_ERROR',
          message: error.message || 'Failed to create booking',
          details: error
        }
      }, { status: 500 })
    }

    console.log('Booking created successfully:', booking)

    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation({
        customer_name: booking.customer_name,
        email: booking.email,
        postcode: booking.postcode,
        address: booking.address,
        vehicle_size: booking.vehicle_size,
        service_type: booking.service_type,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        add_ons: booking.add_ons || [],
        vehicle_images: booking.vehicle_images || [],
        vehicle_lookup: {
          size: booking.vehicle_lookup?.size || 'medium',
          make: booking.vehicle_lookup?.make || 'Unknown Make',
          model: booking.vehicle_lookup?.model || 'Unknown Model',
          registration: booking.vehicle_lookup?.registration || 'UNKNOWN',
          year: booking.vehicle_lookup?.year,
          color: booking.vehicle_lookup?.color,
          notes: booking.vehicle_lookup?.notes
        },
        total_price: booking.total_price,
        travel_fee: booking.travel_fee || 0,
        status: booking.status || BookingStatus.PENDING,
        payment_status: booking.payment_status || PaymentStatus.PENDING,
        payment_method: booking.payment_method || PaymentMethod.CARD,
        booking_reference: booking.booking_reference,
        special_requests: booking.special_requests,
        notes: booking.notes
      })
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      // Don't fail the request if email fails
    }

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
        message: error instanceof Error ? error.message : 'Failed to process booking request',
        details: error
      }
    }, { status: 500 })
  }
}

// GET - Fetch bookings
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse<BookingFormData[]>>> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to view bookings'
        }
      }, { status: 401 })
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', session.user.id)
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
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to update bookings'
        }
      }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookingRequestSchema.partial().parse(body)

    // Verify booking ownership
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!existingBooking || existingBooking.user_id !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this booking'
        }
      }, { status: 403 })
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
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