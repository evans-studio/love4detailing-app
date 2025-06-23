import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripePromise = loadStripe(stripePublishableKey)

export interface PaymentIntent {
  id: string
  amount: number
  status: string
  client_secret: string
}

export interface CreatePaymentIntentData {
  amount: number
  currency: string
  payment_method_types: string[]
  metadata: {
    booking_id: string
    service_id: string
    user_id: string
  }
} 