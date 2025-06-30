import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import Stripe from 'stripe'
import { BookingStatus, PaymentStatus } from '@/lib/enums'
import { paymentLogger } from '@/lib/utils/logger'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil'
}) : null

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const createPaymentIntentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().min(1),
  currency: z.string().default('gbp'),
  paymentMethodId: z.string().optional(),
})

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  bookingId: z.string(),
})

// Response types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// POST - Create payment intent
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validatedData = createPaymentIntentSchema.parse(body)

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', validatedData.bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedData.amount,
      currency: validatedData.currency,
      payment_method_types: ['card'],
      metadata: {
        bookingId: validatedData.bookingId,
        customerEmail: booking.email,
        bookingReference: booking.booking_reference
      }
    })

    // Update booking with payment intent ID
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_status: PaymentStatus.PENDING,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.bookingId)

    if (updateError) {
      paymentLogger.error('Failed to update booking with payment intent', updateError)
      if (stripe) {
        await stripe.paymentIntents.cancel(paymentIntent.id)
      }
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    })

  } catch (error) {
    paymentLogger.error('Payment intent creation error', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

// PUT - Confirm payment
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validatedData = confirmPaymentSchema.parse(body)

    // Get payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(validatedData.paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, error: 'Payment not successful' },
        { status: 400 }
      )
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: PaymentStatus.PAID,
        status: BookingStatus.CONFIRMED,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.bookingId)
      .eq('payment_intent_id', validatedData.paymentIntentId)

    if (updateError) {
      paymentLogger.error('Failed to update booking after payment', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed'
    })

  } catch (error) {
    paymentLogger.error('Payment confirmation error', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
} 