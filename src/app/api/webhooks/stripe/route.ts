import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { BookingStatus, PaymentStatus } from '@/lib/enums'
import { paymentLogger } from '@/lib/utils/logger'
import { emailService } from '@/lib/email/service'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil'
}) : null

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook service not configured' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      paymentLogger.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata.bookingId

        if (!bookingId) {
          paymentLogger.error('No booking ID in payment intent metadata:', paymentIntent.id)
          return NextResponse.json(
            { error: 'No booking ID found' },
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
          .eq('id', bookingId)
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          paymentLogger.error('Failed to update booking after payment:', updateError)
          return NextResponse.json(
            { error: 'Failed to update booking' },
            { status: 500 }
          )
        }

        // Send payment confirmation email
        try {
          const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

          if (booking) {
            await emailService.sendPaymentConfirmation({
              customer_name: booking.customer_name,
              email: booking.email,
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency,
              booking_reference: booking.booking_reference,
              payment_id: paymentIntent.id
            })
          }
        } catch (error) {
          paymentLogger.error('Failed to send payment confirmation email:', error)
          // Don't fail the webhook if email fails
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata.bookingId

        if (bookingId) {
          // Update booking status
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: PaymentStatus.FAILED,
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .eq('payment_intent_id', paymentIntent.id)

          if (updateError) {
            paymentLogger.error('Failed to update booking after payment failure:', updateError)
          }
        }

        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata.bookingId

        if (bookingId) {
          // Update booking status
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: PaymentStatus.CANCELLED,
              status: BookingStatus.CANCELLED,
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .eq('payment_intent_id', paymentIntent.id)

          if (updateError) {
            paymentLogger.error('Failed to update booking after payment cancellation:', updateError)
          }
        }

        break
      }

      // Add handlers for other events as needed
      default:
        paymentLogger.info(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    paymentLogger.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 