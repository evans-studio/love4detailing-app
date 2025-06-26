import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase/client'
import { stripe as stripeClient } from '@/lib/payments/providers/StripeProvider'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event: Stripe.Event
    
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    let paymentId: string
    let amount: number
    let status: string
    let errorMessage: string

    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentId = event.data.object.id
        amount = event.data.object.amount / 100 // Convert from cents
        status = 'completed'

        // Handle successful payment
        await handlePaymentSuccess(paymentId, amount)
        break

      case 'payment_intent.payment_failed':
        paymentId = event.data.object.id
        errorMessage = ((event.data.object as any).last_payment_error?.message) || 'Payment failed'
        status = 'failed'

        // Handle failed payment
        await handlePaymentFailure(paymentId, errorMessage)
        break

      default:
        return NextResponse.json(
          { error: 'Unhandled webhook event' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentId: string, amount: number) {
  // Add your payment success handling logic here
  console.log('Payment succeeded:', paymentId, amount)
}

async function handlePaymentFailure(paymentId: string, error: string) {
  // Add your payment failure handling logic here
  console.log('Payment failed:', paymentId, error)
} 