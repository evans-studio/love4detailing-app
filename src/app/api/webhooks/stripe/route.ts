import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return new NextResponse('No signature in request', { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new NextResponse('Webhook signature verification failed', { status: 400 })
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(failedPayment)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new NextResponse('Webhook error', { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { booking_id } = paymentIntent.metadata

  if (!booking_id) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      updated_at: new Date().toISOString()
    })
    .eq('id', booking_id)

  if (error) {
    console.error('Error updating booking status:', error)
    throw error
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { booking_id } = paymentIntent.metadata

  if (!booking_id) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', booking_id)

  if (error) {
    console.error('Error updating booking status:', error)
    throw error
  }
} 